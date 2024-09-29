import { EntityManager } from 'typeorm';
import { AppDataSource } from '../../../config/typeOrmConfig';
import { OutputPort } from "../../../ports/output/OutputPort";
import { ShopifyOrderDTO } from '../../input/shopify/dto/ShopifyOrderDTO';
import { ShopifyProductDTO } from '../../input/shopify/dto/ShopifyProductDTO';
import { LineItem } from './entities/LineItem';
import { ShopifyOrder } from './entities/ShopifyOrder';
import { ShopifyProduct } from './entities/ShopifyProduct';


export class DatabaseRepository implements OutputPort {
    async storeProducts(shopifyProductBatch: ShopifyProductDTO[]): Promise<void> {
        try {
            let shopifyProductDbBatch: ShopifyProduct[] = this.mapShopifyProductDTOToShopifyProduct(shopifyProductBatch);

            // Transaction to ensure atomic processing
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {
                await entityManager.save(shopifyProductDbBatch);
            })        
        } catch (error) {
            console.error("Error on saving products:", error);
            throw new Error("Error on saving products on database.");
        }
    }

    mapShopifyProductDTOToShopifyProduct(shopifyProductBatch: ShopifyProductDTO[]): ShopifyProduct[] {
        return shopifyProductBatch.map(dto => {
            return new ShopifyProduct(
                dto.id,
                dto.title,
                dto.body_html,
                dto.vendor,
                dto.product_type,
                new Date(dto.created_at),
                new Date(dto.updated_at),
                dto.status,
                dto.published_at ? new Date(dto.published_at) : null,
                null, // template_suffix não está presente no DTO
                null, // published_scope não está presente no DTO
                dto.tags,
                dto.admin_graphql_api_id
            );
        });
    }

    async storeOrders(shopifyOrderBatch: ShopifyOrderDTO[]): Promise<void> {
        try {
            // Transaction to ensure atomic processing
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {
                // Mapping order DTOs to ShopifyOrder entity
                const shopifyOrderDbBatch: ShopifyOrder[] = this.mapShopifyOrderDTOToShopifyOrder(shopifyOrderBatch);
                for (let order of shopifyOrderDbBatch) {
                     // For each order, verify each line_items
                    for (let lineItem of order.line_items) {
                        // Transform product_id to number
                        const productIdAsNumber = Number(lineItem.product_id);

                        // Verify if product exists in db
                        const product = await entityManager.findOne(ShopifyProduct, { where: { platform_id: productIdAsNumber } });

                        // If product exists, associate it's id, otherwise leave null
                        lineItem.product_id = product ? product.id.toString() : null;
                    }
    
                    // Salvar order with the correct mapping
                    await entityManager.save(order);
                }
            })        
        } catch (error) {
            console.error("Error on saving orders:", error);
            throw new Error("Error on saving orders on database.");
        }
    }

    mapShopifyOrderDTOToShopifyOrder(shopifyOrderBatch: ShopifyOrderDTO[]): ShopifyOrder[] {
        return shopifyOrderBatch.map(dto => {
            // Mapping line_items
            const lineItems = dto.line_items.map(lineItemDTO => {
                return new LineItem(
                    lineItemDTO.product_id ? lineItemDTO.product_id.toString() : '',
                    null, 
                    null  // Will be associated at save
                );
            });
    
            return new ShopifyOrder(
                dto.id,
                dto.admin_graphql_api_id,
                dto.buyer_accepts_marketing,
                dto.confirmation_number,
                dto.confirmed,
                new Date(dto.created_at),
                dto.currency,
                dto.current_subtotal_price,
                dto.current_total_price,
                dto.current_total_tax,
                dto.customer_locale,
                dto.financial_status,
                dto.name,
                dto.order_number,
                dto.presentment_currency,
                new Date(dto.processed_at),
                dto.source_name,
                dto.subtotal_price,
                dto.tags,
                dto.tax_exempt,
                dto.total_discounts,
                dto.total_line_items_price,
                dto.total_price,
                dto.total_tax,
                dto.user_id ? dto.user_id : null,
                dto.updated_at ? new Date(dto.updated_at) : null,
                dto.checkout_id,
                dto.checkout_token ? dto.checkout_token : null,  
                lineItems 
            );
        });
    }
}