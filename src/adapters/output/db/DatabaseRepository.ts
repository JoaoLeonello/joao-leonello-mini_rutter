import { EntityManager, In } from 'typeorm';
import { AppDataSource } from '../../../config/typeOrmConfig';
import { LineItem as DomainLineItem, Order } from '../../../domain/entities/Order';
import { Product } from '../../../domain/entities/Product';
import { OutputPort } from "../../../ports/output/OutputPort";
import { ShopifyOrderDTO } from '../../input/shopify/dto/ShopifyOrderDTO';
import { ShopifyProductDTO } from '../../input/shopify/dto/ShopifyProductDTO';
import { LineItem as EntityLineItem } from './entities/LineItem';
import { ShopifyOrder } from './entities/ShopifyOrder';
import { ShopifyProduct } from './entities/ShopifyProduct';


export class DatabaseRepository implements OutputPort {
    async storeProducts(shopifyProductBatch: ShopifyProductDTO[]): Promise<void> {
        try {
            let shopifyProductDbBatch: ShopifyProduct[] = this.mapShopifyProductDTOToShopifyProduct(shopifyProductBatch);

            // Transaction to ensure atomic processing
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {
                for (let product of shopifyProductDbBatch) {
                    await entityManager.upsert(ShopifyProduct, product, ['platform_id'])
                }
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
                dto.handle,
                new Date(dto.created_at),
                new Date(dto.updated_at),
                dto.status,
                dto.published_at ? new Date(dto.published_at) : null,
                dto.template_suffix ? dto.template_suffix : null,
                dto.published_scope ? dto.published_scope : null,
                dto.tags,
                dto.admin_graphql_api_id
            );
        });
    }
    

    async storeOrders(shopifyOrderBatch: ShopifyOrderDTO[]): Promise<void> {
        try {
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {
                for (let dto of shopifyOrderBatch) {
                    const shopifyOrder = new ShopifyOrder(
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
                        dto.checkout_token ? dto.checkout_token : null
                    );

                    const products = await entityManager.findBy(ShopifyProduct, {
                        platform_id: In(dto.line_items.map(item => item.product_id))
                    });

                   
                    shopifyOrder.line_items = dto.line_items.map((lineItemDTO) => {
                        const product = products.find(product => {
                            return Number(product.platform_id) === Number(lineItemDTO.product_id);
                        });
                        if (product) {
                            const lineItem = new EntityLineItem(product, shopifyOrder);
                            return lineItem;
                        }
                        return null;
                    }).filter(item => item !== null);

                    await entityManager.save(shopifyOrder);
                }
            });
        } catch (error) {
            console.error("Error on saving orders:", error);
            throw new Error("Error on saving orders in database.");
        }
    }

    async getProducts(): Promise<Product[]> {
        try {
            const productEntities = await AppDataSource.manager.find(ShopifyProduct);
    
            return this.mapProductPersistenceEntitytoDomain(productEntities);
        } catch (error) {
            console.error("Error fetching products:", error);
            throw new Error("Error fetching products from the database.");
        }
    }

    mapProductPersistenceEntitytoDomain(productEntities: ShopifyProduct[]): Product[] {
        return productEntities.map(productEntity => {
            return new Product(
                productEntity.id,
                productEntity.platform_id.toString(),
                productEntity.title
            );
        });
    }

    async getOrders(): Promise<Order[]> {
        const orderEntities = await AppDataSource.manager.find(ShopifyOrder, { relations: ['line_items'] });

        return this.mapOrderPersistenceEntityToDomain(orderEntities);      
    }

    mapOrderPersistenceEntityToDomain(orderEntities: ShopifyOrder[]): Order[] {
        return orderEntities.map(order => {
            return new Order(
                order.id,
                order.platform_id.toString(),
                order.line_items ? 
                    order.line_items.map(lineItem => {
                        return new DomainLineItem(
                            lineItem.id ? lineItem.id : null
                        );
                    }) : []
            );
        });
    }
}