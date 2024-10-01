import { EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
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
                    const existingProduct = await entityManager
                        .createQueryBuilder(ShopifyProduct, "product")
                        .where("product.platform_id = :platformId", { platformId: product.platform_id })
                        .getOne();
            
                    if (existingProduct) {
                        // Update
                        await entityManager
                            .createQueryBuilder()
                            .update(ShopifyProduct)
                            .set({
                                title: product.title,
                                body_html: product.body_html,
                                vendor: product.vendor,
                                product_type: product.product_type,
                                updated_at: product.updated_at,
                                published_at: product.published_at,
                                status: product.status,
                                tags: product.tags,
                                admin_graphql_api_id: product.admin_graphql_api_id,
                            })
                            .where("platform_id = :platformId", { platformId: product.platform_id })
                            .execute();
                    } else {
                        // Insert
                        await entityManager
                            .createQueryBuilder()
                            .insert()
                            .into(ShopifyProduct)
                            .values({
                                platform_id: product.platform_id,
                                title: product.title,
                                body_html: product.body_html,
                                vendor: product.vendor,
                                product_type: product.product_type,
                                created_at: product.created_at,
                                updated_at: product.updated_at,
                                published_at: product.published_at,
                                status: product.status,
                                tags: product.tags,
                                admin_graphql_api_id: product.admin_graphql_api_id,
                            })
                            .execute();
                    }
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
            // Transaction to ensure atomic processing
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {
                for (let dto of shopifyOrderBatch) {
                    // Verifica if ShopifyOrder already exists
                    const existingOrder = await entityManager
                        .createQueryBuilder()
                        .select("order")
                        .from(ShopifyOrder, "order")
                        .where("order.platform_id = :platform_id", { platform_id: dto.id })
                        .getOne();

                    const shopifyOrder = new ShopifyOrder(
                        existingOrder ? existingOrder.id : uuidv4(),  // Use existent id if register already exists
                        dto.id, // platform_id
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
                    );
        
                    if (existingOrder) {
                        // Update 
                        await entityManager
                            .createQueryBuilder()
                            .update(ShopifyOrder)
                            .set({
                                admin_graphql_api_id: dto.admin_graphql_api_id,
                                platform_id: dto.id,
                                buyer_accepts_marketing: dto.buyer_accepts_marketing,
                                confirmation_number: dto.confirmation_number,
                                confirmed: dto.confirmed,
                                created_at: new Date(dto.created_at),
                                currency: dto.currency,
                                current_subtotal_price: dto.current_subtotal_price,
                                current_total_price: dto.current_total_price,
                                current_total_tax: dto.current_total_tax,
                                customer_locale: dto.customer_locale,
                                financial_status: dto.financial_status,
                                name: dto.name,
                                order_number: dto.order_number,
                                presentment_currency: dto.presentment_currency,
                                processed_at: new Date(dto.processed_at),
                                source_name: dto.source_name,
                                subtotal_price: dto.subtotal_price,
                                tags: dto.tags,
                                tax_exempt: dto.tax_exempt,
                                total_discounts: dto.total_discounts,
                                total_line_items_price: dto.total_line_items_price,
                                total_price: dto.total_price,
                                total_tax: dto.total_tax,
                                user_id: dto.user_id ? dto.user_id : null,
                                updated_at: dto.updated_at ? new Date(dto.updated_at) : null,
                                checkout_id: dto.checkout_id,
                                checkout_token: dto.checkout_token ? dto.checkout_token : null,
                            })
                            .where("id = :id", { id: existingOrder.id })
                            .execute();
                    } else {
                        // Insert
                        await entityManager
                            .createQueryBuilder()
                            .insert()
                            .into(ShopifyOrder)
                            .values({
                                id: uuidv4(),
                                platform_id: dto.id,
                                admin_graphql_api_id: shopifyOrder.admin_graphql_api_id,
                                buyer_accepts_marketing: shopifyOrder.buyer_accepts_marketing,
                                confirmation_number: shopifyOrder.confirmation_number,
                                confirmed: shopifyOrder.confirmed,
                                created_at: shopifyOrder.created_at,
                                currency: shopifyOrder.currency,
                                current_subtotal_price: shopifyOrder.current_subtotal_price,
                                current_total_price: shopifyOrder.current_total_price,
                                current_total_tax: shopifyOrder.current_total_tax,
                                customer_locale: shopifyOrder.customer_locale,
                                financial_status: shopifyOrder.financial_status,
                                name: shopifyOrder.name,
                                order_number: shopifyOrder.order_number,
                                presentment_currency: shopifyOrder.presentment_currency,
                                processed_at: shopifyOrder.processed_at,
                                source_name: shopifyOrder.source_name,
                                subtotal_price: shopifyOrder.subtotal_price,
                                tags: shopifyOrder.tags,
                                tax_exempt: shopifyOrder.tax_exempt,
                                total_discounts: shopifyOrder.total_discounts,
                                total_line_items_price: shopifyOrder.total_line_items_price,
                                total_price: shopifyOrder.total_price,
                                total_tax: shopifyOrder.total_tax,
                                user_id: shopifyOrder.user_id ? shopifyOrder.user_id : null,
                                updated_at: shopifyOrder.updated_at,
                                checkout_id: shopifyOrder.checkout_id,
                                checkout_token: shopifyOrder.checkout_token,
                            })
                            .execute();
                    }

                    // After order is in, map it's line items
                    for (let lineItemDTO of dto.line_items) {
                        // Get product by id
                        const productExistent = await entityManager.findOne(ShopifyProduct, { where: { platform_id: Number(lineItemDTO.product_id) } });
        
                        // Check if it already exists
                        const existingLineItem = await entityManager
                            .createQueryBuilder(EntityLineItem, "line_item")
                            .where("line_item.order_id = :orderId", { orderId: shopifyOrder.id })
                            .andWhere("line_item.product_id = :productId", { productId: productExistent ? productExistent.id : null })
                            .getOne();

                        if (existingLineItem) {
                            // Update 
                            await entityManager
                                .createQueryBuilder()
                                .update(EntityLineItem)
                                .set({
                                    quantity: existingLineItem.quantity + 1,
                                    product: productExistent ? productExistent : undefined,
                                    order: shopifyOrder
                                })
                                .where("id = :id", { id: existingLineItem.id })
                                .execute();
                        } else {
                            // Insert
                            await entityManager
                                .createQueryBuilder()
                                .insert()
                                .into(EntityLineItem)
                                .values({
                                    quantity: 1, 
                                    product: productExistent ? productExistent : null, 
                                    order: shopifyOrder  
                                })
                                .execute();
                        }
                    }
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
        const orderEntities = await AppDataSource.manager.find(ShopifyOrder, {
            relations: ['line_items', 'line_items.product'],
        });

        return this.mapOrderPersistenceEntityToDomain(orderEntities);      
    }

    mapOrderPersistenceEntityToDomain(orderEntities: ShopifyOrder[]): Order[] {
        return orderEntities.map(order => {
            return new Order(
                order.id,
                order.platform_id.toString(),
                order.line_items.flatMap(lineItem => {
                    return Array.from({ length: lineItem.quantity }, () => {
                        return new DomainLineItem(
                            lineItem.product ? lineItem.product.id : undefined
                        );
                    });
                })
            );
        });
    }
}