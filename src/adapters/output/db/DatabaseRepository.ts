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
                    const existingProduct = await entityManager.findOne(ShopifyProduct, {
                        where: { platform_id: product.platform_id },
                    });
                    
                    if (existingProduct) {
                        // Update existing product properties
                        existingProduct.title = product.title;
                        existingProduct.body_html = product.body_html;
                        existingProduct.vendor = product.vendor;
                        existingProduct.product_type = product.product_type;
                        existingProduct.updated_at = product.updated_at;
                        existingProduct.published_at = product.published_at;
                        existingProduct.status = product.status;
                        existingProduct.tags = product.tags;
                        existingProduct.admin_graphql_api_id = product.admin_graphql_api_id;
    
                        // Save the updated product
                        await entityManager.save(existingProduct);
                    } else {
                        // Insert new product
                        await entityManager.save(product);
                    }
                }
            });
        } catch (error) {
            console.error("Error on saving products:", error);
            throw new Error("Error on saving products on database.");
        }
    }
    

    mapShopifyProductDTOToShopifyProduct(shopifyProductBatch: ShopifyProductDTO[]): ShopifyProduct[] {
        return shopifyProductBatch.map(dto => {
            return new ShopifyProduct(
                undefined,
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
        let { existingOrdersMap, existingLineItemsMap, existingProductsMap } = await this.setupMaps(shopifyOrderBatch);

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
                    undefined,
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
                        .filter((order: ShopifyOrder) => order !== undefined) 
                        .map((order: ShopifyOrder) => [String(order.platform_id), order])
                );

                lineItemsToSave = this.processLineItems(
                    { existingOrdersMap, existingLineItemsMap, existingProductsMap }, shopifyOrderBatch
                )

                // Batch operation
                await entityManager.save((await lineItemsToSave));
            });
        } catch (error) {
            console.error("Error on saving orders:", error);
            throw new Error("Error on saving orders in database.");
        }
    }

    // Decoupling concerns ( LineItems / Orders )
    private async processLineItems(
        findMaps: {
            existingOrdersMap: Map<string, ShopifyOrder>;
            existingLineItemsMap: Map<string, EntityLineItem>;
            existingProductsMap: Map<string, ShopifyProduct>;
        },
        shopifyOrderBatch: ShopifyOrderDTO[]
    ): Promise<EntityLineItem[]> {
        let { existingOrdersMap, existingLineItemsMap, existingProductsMap } = findMaps;
        const lineItemsToSave = [];

        let filterOrderIds: string[] = [];
        existingOrdersMap.forEach((value, key) => {
            if (typeof value === 'object' && value !== null) {
              const { platform_id } = value;
              filterOrderIds.push(String(platform_id));
            }
        });

        let filterProductIds: (string | null)[] = [];
        existingProductsMap.forEach((value, key) => {
            if (typeof value === 'object' && value !== null) {
              const { platform_id } = value;
              filterProductIds.push(String(platform_id));
            }
        });

        let filterLineItemsIds: (string | null)[] = [];
        existingLineItemsMap.forEach((value, key) => {
            if (typeof value === 'object' && value !== null) {
              const { platform_id } = value;
              filterLineItemsIds.push(String(platform_id));
            }
        });

        // Create map to organize LineItems by [productId (platform_id, or id from shopify): quantity]
        const productIdQuantityKeyValue: { [key: string]: number } = {};
        let lineItem;
        for(let shopifyOrder of shopifyOrderBatch) {
            for(let lineItemDTO of shopifyOrder.line_items) {
                lineItem = existingLineItemsMap.get(String(lineItemDTO.id));
                const productId = String(lineItemDTO.product_id || null);

                if (lineItemDTO.product_id === null) {
                    // GERAR LOGS AQUI ******
                }

                // If productId is already in the map, sum - as in the case with 13 equal line_items with quantity: 1
                if (productIdQuantityKeyValue[productId]) {
                    productIdQuantityKeyValue[productId] += lineItemDTO.quantity || 1;
                } else {
                    // Otherwise, add it to the map 
                    productIdQuantityKeyValue[productId] = lineItemDTO.quantity || 1;
                }

                if (!lineItem) {
                    // Insert
                    let productExistent = existingProductsMap.get(productId) ?? null;
                    let shopifyOrderEntity = existingOrdersMap.get(shopifyOrder.id.toString()) ?? null;
                    
                    // let shopifyOrderEntity = this.mapShopifyOrderDTOToShopifyOrder(shopifyOrder)
                    lineItem = new EntityLineItem(
                        undefined,
                        lineItemDTO.id,
                        lineItemDTO.name,
                        lineItemDTO.title,
                        lineItemDTO.price,
                        lineItemDTO.vendor,
                        lineItemDTO.quantity, 
                        productExistent, 
                        shopifyOrderEntity
                    );
                } else {
                    // Update
                    const quantity = productIdQuantityKeyValue[productId];
                    lineItem.quantity = quantity;
                }
                
                lineItemsToSave.push(lineItem);
            }
        }

        return lineItemsToSave;
    }

    async setupMaps(shopifyOrderBatch: ShopifyOrderDTO[]): Promise<{
        existingOrdersMap: Map<string, ShopifyOrder>;
        existingLineItemsMap: Map<string, EntityLineItem>;
        existingProductsMap: Map<string, ShopifyProduct>;
      }> {
        // Initialize the maps
        let existingOrdersMap = new Map<string, ShopifyOrder>();
        let existingLineItemsMap = new Map<string, EntityLineItem>();
        let existingProductsMap = new Map<string, ShopifyProduct>();

        // Optimize lookups using one find and map 
        const shopifyOrderRepository = AppDataSource.getRepository(ShopifyOrder);
        let existingOrders = await shopifyOrderRepository.find({ where: { platform_id: In(shopifyOrderBatch.map(order => order.id)) }});
        existingOrdersMap = new Map<string, ShopifyOrder>(
            existingOrders
                .filter((order: ShopifyOrder) => order !== undefined) 
                .map((order: ShopifyOrder) => [String(order.platform_id), order]
        ));

        const shopifyLineItemRepository = AppDataSource.getRepository(EntityLineItem);
        let existingLineItems = await shopifyLineItemRepository.find({ where: { platform_id: In(shopifyOrderBatch.map(order => {
            return order.line_items.map(line_item => line_item.id)
        })) }});
        existingLineItemsMap = new Map<string, EntityLineItem>(
            existingLineItems.map((lineItem: EntityLineItem) => [String(lineItem.platform_id || 'null'), lineItem])
        );

        let productIds = shopifyOrderBatch.map(order => {
            return order.line_items.map(line_item => line_item.product_id);
        })
        const shopifyProductRepository = AppDataSource.getRepository(ShopifyProduct);
        const existingProducts = await shopifyProductRepository.find({ where: { platform_id: In(productIds) }});
        existingProductsMap = new Map<string, ShopifyProduct>(
            existingProducts.map((product: ShopifyProduct) => [String(product.platform_id || 'null'), product])
        );

        return {
            existingOrdersMap,
            existingLineItemsMap,
            existingProductsMap,
        }; 
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