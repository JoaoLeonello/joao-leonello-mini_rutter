import { EntityManager, In } from 'typeorm';
import { AppDataSource } from '../../../config/typeOrmConfig';
import { LineItem as DomainLineItem, Order } from '../../../domain/entities/Order';
import { Product } from '../../../domain/entities/Product';
import { OutputPort } from "../../../ports/output/OutputPort";
import { ShopifyOrderDTO } from '../../input/shopify/dto/ShopifyOrderDTO';
import { ShopifyProductDTO } from '../../input/shopify/dto/ShopifyProductDTO';
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
                    let shopifyOrder = await entityManager.findOne(ShopifyOrder, { 
                        where: { platform_id: dto.id }, relations: ['line_items'] 
                    });

                    if (!shopifyOrder) {
                        shopifyOrder = new ShopifyOrder();
                    } 

                    shopifyOrder.platform_id = dto.id;
                    shopifyOrder.admin_graphql_api_id = dto.admin_graphql_api_id;
                    shopifyOrder.buyer_accepts_marketing = dto.buyer_accepts_marketing;
                    shopifyOrder.confirmation_number = dto.confirmation_number;
                    shopifyOrder.confirmed = dto.confirmed;
                    shopifyOrder.created_at = new Date(dto.created_at);
                    shopifyOrder.currency = dto.currency;
                    shopifyOrder.current_subtotal_price = dto.current_subtotal_price;
                    shopifyOrder.current_total_price = dto.current_total_price;
                    shopifyOrder.current_total_tax = dto.current_total_tax;
                    shopifyOrder.customer_locale = dto.customer_locale;
                    shopifyOrder.financial_status = dto.financial_status;
                    shopifyOrder.name = dto.name;
                    shopifyOrder.order_number = dto.order_number;
                    shopifyOrder.presentment_currency = dto.presentment_currency;
                    shopifyOrder.processed_at = new Date(dto.processed_at);
                    shopifyOrder.source_name = dto.source_name;
                    shopifyOrder.subtotal_price = dto.subtotal_price;
                    shopifyOrder.tags = dto.tags;
                    shopifyOrder.tax_exempt = dto.tax_exempt;
                    shopifyOrder.total_discounts = dto.total_discounts;
                    shopifyOrder.total_line_items_price = dto.total_line_items_price;
                    shopifyOrder.total_price = dto.total_price;
                    shopifyOrder.total_tax = dto.total_tax;
                    shopifyOrder.user_id = dto.user_id ? dto.user_id : undefined;
                    shopifyOrder.updated_at = dto.updated_at ? new Date(dto.updated_at) : undefined;
                    shopifyOrder.checkout_id = dto.checkout_id;
                    shopifyOrder.checkout_token = dto.checkout_token ? dto.checkout_token : undefined;

                    const productMap = await entityManager.findBy(ShopifyProduct, {
                        platform_id: In(dto.line_items.map(item => item.product_id))
                    });

                    // Mapeie os `line_items` e associe o produto correto para cada item
                    shopifyOrder.line_items = dto.line_items.map(item => {
                        // Encontre o produto correto para cada `line_item`
                        const product = productMap.find(prod => prod.platform_id === item.product_id);
                        
                        // Se o produto for encontrado, retorna o produto. Caso contrário, retorna `null` ou trata como necessário
                        return product || null;
                    });

                   
                    // shopifyOrder.line_items = productMap;

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
                (order.platform_id ?? '').toString(),
                order.line_items ? 
                order.line_items
                    .filter(lineItem => lineItem) 
                    .map(lineItem => {
                        return new DomainLineItem(
                            lineItem!.id ? lineItem!.id : undefined
                        );
                    }) : [new DomainLineItem()]
            );
        });
    }
}