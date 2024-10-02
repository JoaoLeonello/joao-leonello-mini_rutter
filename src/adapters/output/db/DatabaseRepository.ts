import { EntityManager, In } from 'typeorm';
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
        const ordersToSave: ShopifyOrder[] = []; 
        let lineItemsToSave: Promise<EntityLineItem[]>;

        // Optimize lookups using one find and map 
        const shopifyOrderRepository = AppDataSource.getRepository(ShopifyOrder);
        let existingOrders = await shopifyOrderRepository.find({ where: { platform_id: In(shopifyOrderBatch.map(order => order.id)) }});
        let existingOrdersMap = new Map<string, ShopifyOrder>(
            existingOrders
                .filter(order => order !== undefined) 
                .map(order => [String(order.platform_id), order]
        ));

        for (let shopifyOrder of shopifyOrderBatch) {
            // Verify if ShopifyOrder exists
            if (existingOrdersMap.has(shopifyOrder.id.toString())) {
                let existingOrder: ShopifyOrder = existingOrdersMap.get(shopifyOrder.id.toString())!;

                existingOrder.admin_graphql_api_id = shopifyOrder.admin_graphql_api_id;
                existingOrder.platform_id = shopifyOrder.id;
                existingOrder.buyer_accepts_marketing = shopifyOrder.buyer_accepts_marketing;
                existingOrder.confirmation_number = shopifyOrder.confirmation_number;
                existingOrder.confirmed = shopifyOrder.confirmed;
                existingOrder.created_at = new Date(shopifyOrder.created_at);
                existingOrder.currency = shopifyOrder.currency;
                existingOrder.current_subtotal_price = shopifyOrder.current_subtotal_price;
                existingOrder.current_total_price = shopifyOrder.current_total_price;
                existingOrder.current_total_tax = shopifyOrder.current_total_tax;
                existingOrder.customer_locale = shopifyOrder.customer_locale;
                existingOrder.financial_status = shopifyOrder.financial_status;
                existingOrder.name = shopifyOrder.name;
                existingOrder.order_number = shopifyOrder.order_number;
                existingOrder.presentment_currency = shopifyOrder.presentment_currency;
                existingOrder.processed_at = new Date(shopifyOrder.processed_at);
                existingOrder.source_name = shopifyOrder.source_name;
                existingOrder.subtotal_price = shopifyOrder.subtotal_price;
                existingOrder.tags = shopifyOrder.tags;
                existingOrder.tax_exempt = shopifyOrder.tax_exempt;
                existingOrder.total_discounts = shopifyOrder.total_discounts;
                existingOrder.total_line_items_price = shopifyOrder.total_line_items_price;
                existingOrder.total_price = shopifyOrder.total_price;
                existingOrder.total_tax = shopifyOrder.total_tax;
                existingOrder.user_id = shopifyOrder.user_id ? shopifyOrder.user_id : null;
                existingOrder.updated_at = shopifyOrder.updated_at ? new Date(shopifyOrder.updated_at) : null;
                existingOrder.checkout_id = shopifyOrder.checkout_id;
                existingOrder.checkout_token = shopifyOrder.checkout_token ? shopifyOrder.checkout_token : null;

                ordersToSave.push(existingOrder);
            } else {
                let newShopifyOrder = new ShopifyOrder(
                    uuidv4(),  // Generate new ID if its new
                    shopifyOrder.id, // platform_id
                    shopifyOrder.admin_graphql_api_id,
                    shopifyOrder.buyer_accepts_marketing,
                    shopifyOrder.confirmation_number,
                    shopifyOrder.confirmed,
                    new Date(shopifyOrder.created_at),
                    shopifyOrder.currency,
                    shopifyOrder.current_subtotal_price,
                    shopifyOrder.current_total_price,
                    shopifyOrder.current_total_tax,
                    shopifyOrder.customer_locale,
                    shopifyOrder.financial_status,
                    shopifyOrder.name,
                    shopifyOrder.order_number,
                    shopifyOrder.presentment_currency,
                    new Date(shopifyOrder.processed_at),
                    shopifyOrder.source_name,
                    shopifyOrder.subtotal_price,
                    shopifyOrder.tags,
                    shopifyOrder.tax_exempt,
                    shopifyOrder.total_discounts,
                    shopifyOrder.total_line_items_price,
                    shopifyOrder.total_price,
                    shopifyOrder.total_tax,
                    shopifyOrder.user_id ? shopifyOrder.user_id : null,
                    shopifyOrder.updated_at ? new Date(shopifyOrder.updated_at) : null,
                    shopifyOrder.checkout_id,
                    shopifyOrder.checkout_token ? shopifyOrder.checkout_token : null
                );

                ordersToSave.push(newShopifyOrder);
            }
        } 

        try {
            // Transaction to ensure atomic processing
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {  
                // Reduce the number of queries doing batch operations 1  
                let ordersSaved = await entityManager.save(ordersToSave);

                // Remake the map with the return from save
                existingOrdersMap = new Map<string, ShopifyOrder>(
                    ordersSaved
                        .filter(order => order !== undefined) 
                        .map(order => [String(order.platform_id), order])
                );

                lineItemsToSave = this.processLineItems(existingOrdersMap, shopifyOrderBatch, entityManager)

                // Reduce the number of queries doing batch operations 2
                await entityManager.save((await lineItemsToSave));
            });
        } catch (error) {
            console.error("Error on saving orders:", error);
            throw new Error("Error on saving orders in database.");
        }
    }

    // Decoupling concerns ( LineItems / Orders )
    private async processLineItems(
        existingOrdersMap: Map<string, ShopifyOrder>, 
        shopifyOrderBatch: ShopifyOrderDTO[], 
        entityManager: EntityManager
    ): Promise<EntityLineItem[]> {
        const lineItemsToSave = [];

        let ordersIds: string[] = [];
        existingOrdersMap.forEach((value, key) => {
            if (typeof value === 'object' && value !== null) {
              const { id } = value;
              ordersIds.push(id);
            }
        });

        let productIdsWithNull: (string | null)[] = []
        for(let shopifyOrder of shopifyOrderBatch) {
            const productIds = shopifyOrder.line_items.map(item => item.product_id);

            // Optimize lookups using map
            const existingProducts = await entityManager.find(ShopifyProduct, { where: { platform_id: In(productIds) }});
            const existingProductsMap = new Map<string, ShopifyProduct>(
                existingProducts.map(product => [String(product.platform_id || 'null'), product])
            );

            // DEPOIS VERIFICAR SE QUANDO product.id FOR NULL VAI BUGAR *****
            productIdsWithNull.push(...existingProducts.map(product => product.id));
        }

        // Just 1 query to find
        const lineItemsFind = await entityManager.find(EntityLineItem, {
            where: {
                order: { id: In(ordersIds) },
                product: { id: In(productIdsWithNull) }
            },
            relations: ['order', 'product'],
        });

        for(let shopifyOrder of shopifyOrderBatch) {
            // Create map to organize LineItems by [productId: quantity]
            const productIdQuantityMap: { [key: string]: number } = {};
            
            //Process lineItemsMap and the quantities
            for (let dtoLineItem of shopifyOrder.line_items) {
                const productId = String(dtoLineItem.product_id || null);

                if (dtoLineItem.product_id === null) {
                    // GERAR LOGS AQUI ******
                }

                // If productId is already in the map, sum - as in the case with 13 equal line_items with quantity: 1
                if (productIdQuantityMap[productId]) {
                    productIdQuantityMap[productId] += dtoLineItem.quantity || 1;
                } else {
                    // Otherwise, add it to the map 
                    productIdQuantityMap[productId] = dtoLineItem.quantity || 1;
                }
            }

            // Process lineItemsMap and the quantities
            for (let productId in productIdQuantityMap) {
                const quantity = productIdQuantityMap[productId];

                // Verify if product already exists
                let productExistent = existingProductsMap.get(productId) ?? null;
                
                let lineItem = lineItemsFind.find(lineItem => )

                if (!lineItem) {
                    // Insert
                    let shopifyOrderEntity = existingOrdersMap.get(shopifyOrder.id.toString()) ?? null;
                    // let shopifyOrderEntity = this.mapShopifyOrderDTOToShopifyOrder(shopifyOrder)
                    lineItem = new EntityLineItem(quantity, productExistent, shopifyOrderEntity);
                } else {
                    // Update
                    lineItem.quantity = quantity;
                }

                lineItemsToSave.push(lineItem);
            }
        }

        return lineItemsToSave;
    }

    mapShopifyOrderDTOToShopifyOrder(shopifyOrderDTO: ShopifyOrderDTO): ShopifyOrder {
        return new ShopifyOrder(
            shopifyOrderDTO.id.toString(), // id (Assuming you are converting number to string for 'uuid')
            shopifyOrderDTO.id, // platform_id
            shopifyOrderDTO.admin_graphql_api_id, // admin_graphql_api_id
            shopifyOrderDTO.buyer_accepts_marketing, // buyer_accepts_marketing
            shopifyOrderDTO.confirmation_number, // confirmation_number
            shopifyOrderDTO.confirmed, // confirmed
            new Date(shopifyOrderDTO.created_at), // created_at
            shopifyOrderDTO.currency, // currency
            shopifyOrderDTO.current_subtotal_price, // current_subtotal_price
            shopifyOrderDTO.current_total_price, // current_total_price
            shopifyOrderDTO.current_total_tax, // current_total_tax
            shopifyOrderDTO.customer_locale, // customer_locale
            shopifyOrderDTO.financial_status, // financial_status
            shopifyOrderDTO.name, // name
            shopifyOrderDTO.order_number, // order_number
            shopifyOrderDTO.presentment_currency, // presentment_currency
            new Date(shopifyOrderDTO.processed_at), // processed_at
            shopifyOrderDTO.source_name, // source_name
            shopifyOrderDTO.subtotal_price, // subtotal_price
            shopifyOrderDTO.tags, // tags
            shopifyOrderDTO.tax_exempt, // tax_exempt
            shopifyOrderDTO.total_discounts, // total_discounts
            shopifyOrderDTO.total_line_items_price, // total_line_items_price
            shopifyOrderDTO.total_price, // total_price
            shopifyOrderDTO.total_tax, // total_tax
            shopifyOrderDTO.user_id, // user_id
            shopifyOrderDTO.updated_at ? new Date(shopifyOrderDTO.updated_at) : null, // updated_at
            shopifyOrderDTO.checkout_id, // checkout_id
            shopifyOrderDTO.checkout_token // checkout_token
        );
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
                            lineItem.product ? lineItem.product.id : ''
                        );
                    });
                })
            );
        });
    }
}