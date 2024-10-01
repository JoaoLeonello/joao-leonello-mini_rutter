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
                    // Verify if ShopifyOrder exists
                    let shopifyOrder = await entityManager.findOne(ShopifyOrder, {
                        where: { platform_id: dto.id },
                        relations: ['line_items'],
                    });
    
                    if (!shopifyOrder) {
                        // Create
                        shopifyOrder = new ShopifyOrder(
                            uuidv4(),  // Generate new ID if its new
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
                            dto.checkout_token ? dto.checkout_token : null
                        );
                    } else {
                        // Update
                        shopifyOrder.admin_graphql_api_id = dto.admin_graphql_api_id;
                        shopifyOrder.platform_id = dto.id;
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
                        shopifyOrder.user_id = dto.user_id ? dto.user_id : null;
                        shopifyOrder.updated_at = dto.updated_at ? new Date(dto.updated_at) : null;
                        shopifyOrder.checkout_id = dto.checkout_id;
                        shopifyOrder.checkout_token = dto.checkout_token ? dto.checkout_token : null;
                    }
    
                    shopifyOrder = await entityManager.save(shopifyOrder);

                    // Group LineItems by [productId: quantity]
                    const lineItemsMap: { [key: string]: number } = {};

                    let lineItemDTO
                    for (lineItemDTO of dto.line_items) {
                        const productId = String(lineItemDTO.product_id || null);
    
                        // If productId is already in the map, sum
                        if (lineItemsMap[productId]) {
                            lineItemsMap[productId] += lineItemDTO.quantity || 1;
                        } else {
                            // Otherwise, add it to the map
                            lineItemsMap[productId] = lineItemDTO.quantity || 1;
                        }
                    }
    
                    // Process lineItemsMap
                    for (let productId in lineItemsMap) {
                        const quantity = lineItemsMap[productId];

                        // Verify if productId is valid, if it is, search db, if not, null
                        const productExistent = productId !== 'null'
                            ? await entityManager.findOne(ShopifyProduct, {
                                    where: { platform_id: Number(productId) }
                                }) 
                            : null;

                        let lineItem: EntityLineItem | null = null;
                        if (productExistent) {
                            // If product exists, include ir in LineItem search
                            lineItem = await entityManager.findOne(EntityLineItem, {
                                where: { order: { id: shopifyOrder.id }, product: { id: productExistent.id } },
                            });
                        } else {
                            // If product doesn't exist, search LineItem with undefined value for it
                            lineItem = await entityManager.findOne(EntityLineItem, {
                                where: { order: { id: shopifyOrder.id }, product: undefined },
                            });
                        }

                        if (!lineItem) {
                            // Insert
                            lineItem = new EntityLineItem(quantity, productExistent, shopifyOrder);
                        } else {
                            // Update
                            lineItem.quantity = quantity;
                        }

                        await entityManager.save(lineItem);
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
                (productEntity.platform_id ?? '').toString(),
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