import { EntityManager, In } from 'typeorm';
import { AppDataSource } from '../../../config/typeOrmConfig';
import { ShopifyOrdersOutputPort } from "../../../ports/output/OutputPort";
import { Order } from './../../../domain/entities/Order';
import { LineItem as EntityLineItem } from './entities/LineItem';
import { ShopifyOrder } from './entities/ShopifyOrder';
import { ShopifyProduct } from './entities/ShopifyProduct';


export class OrderRepository implements ShopifyOrdersOutputPort {
    private existingOrdersMap: Map<string, ShopifyOrder>;
    private existingLineItemsMap: Map<string, EntityLineItem>;
    private existingProductsMap: Map<string, ShopifyProduct>;

    constructor() {
        this.existingOrdersMap = new Map<string, ShopifyOrder>();
        this.existingLineItemsMap = new Map<string, EntityLineItem>();
        this.existingProductsMap = new Map<string, ShopifyProduct>();
    }

    async storeOrders(shopifyOrderBatch: Order[]): Promise<void> {
        const ordersToSave: ShopifyOrder[] = []; 
        let lineItemsToSave: Promise<EntityLineItem[]>;
        await this.setupMaps(shopifyOrderBatch);

        for (let order of shopifyOrderBatch) {
            // Verify if ShopifyOrder exists
            if (this.existingOrdersMap.has(order.platformId ?? '')) {
                let existingOrder: ShopifyOrder = this.existingOrdersMap.get(order.platformId ?? '')!;
                this.updateShopifyOrder(existingOrder, order);
                ordersToSave.push(existingOrder);
            } else {
                let newShopifyOrder = new ShopifyOrder(
                    order.id,
                    parseInt(order.platformId ?? '0'),
                    order.adminGraphqlApiId ?? '',
                    order.buyerAcceptsMarketing ?? false,
                    order.confirmationNumber ?? '',
                    order.confirmed ?? false,
                    order.createdAt ?? new Date(),
                    order.currency ?? 'USD',
                    order.currentSubtotalPrice ?? '0',
                    order.currentTotalPrice ?? '0',
                    order.currentTotalTax ?? '0',
                    order.customerLocale ?? '',
                    order.financialStatus ?? '',
                    order.name ?? '',
                    order.orderNumber ?? 0,
                    order.presentmentCurrency ?? 'USD',
                    order.processedAt ?? new Date(),
                    order.sourceName ?? '',
                    order.subtotalPrice ?? '0',
                    order.tags ?? '',
                    order.taxExempt ?? false,
                    order.totalDiscounts ?? '0',
                    order.totalLineItemsPrice ?? '0',
                    order.totalPrice ?? '0',
                    order.totalTax ?? '0',
                    order.userId ?? null,
                    order.updatedAt ?? null,
                    order.checkoutId ?? 0,
                    order.checkoutToken ?? null
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
                this.existingOrdersMap = new Map<string, ShopifyOrder>(
                    ordersSaved
                        .filter((order: ShopifyOrder) => order !== undefined) 
                        .map((order: ShopifyOrder) => [String(order.platform_id), order])
                );

                lineItemsToSave = this.processLineItems(shopifyOrderBatch)

                // Batch operation
                await entityManager.save((await lineItemsToSave));
            });
        } catch (error) {
            console.error("Error on saving orders:", error);
            throw new Error("Error on saving orders in database.");
        }
    }

    // Decoupling concerns ( LineItems / Orders )
    private async processLineItems(shopifyOrderBatch: Order[]): Promise<EntityLineItem[]> {
        const lineItemsToSave = [];

        // Create map to organize LineItems by [productId (platform_id, or id from shopify): quantity]
        const productIdQuantityKeyValue: { [key: string]: number } = {};
        let existingLineItem;
        for(let shopifyOrder of shopifyOrderBatch) {
            for(let lineItem of shopifyOrder.lineItems ?? []) {
                existingLineItem = this.existingLineItemsMap.get(String(lineItem.id));
                const productId = String(lineItem.productId || null);

                if (lineItem.productId === null) {
                    // GERAR LOGS AQUI ******
                }

                // If productId is already in the map, sum - as in the case with 13 equal line_items with quantity: 1
                if (productIdQuantityKeyValue[productId]) {
                    productIdQuantityKeyValue[productId] += lineItem.quantity || 1;
                } else {
                    // Otherwise, add it to the map 
                    productIdQuantityKeyValue[productId] = lineItem.quantity || 1;
                }

                if (!existingLineItem) {
                    // Insert
                    let productExistent = this.existingProductsMap.get(productId) ?? null;
                    let shopifyOrderEntity = this.existingOrdersMap.get(shopifyOrder.id.toString()) ?? null;
                    
                    // let shopifyOrderEntity = this.mapShopifyOrderDTOToShopifyOrder(shopifyOrder)
                    existingLineItem = new EntityLineItem(
                        undefined,
                        parseInt(lineItem.id, 10),
                        lineItem.name,
                        lineItem.title,
                        lineItem.price,
                        lineItem.vendor,
                        lineItem.quantity, 
                        productExistent, 
                        shopifyOrderEntity
                    );
                } else {
                    // Update
                    const quantity = productIdQuantityKeyValue[productId];
                    existingLineItem.quantity = quantity;
                }
                
                lineItemsToSave.push(existingLineItem);
            }
        }

        return lineItemsToSave;
    }

    async setupMaps(shopifyOrderBatch: Order[]) {
        // Optimize lookups using one find and map 
        const shopifyOrderRepository = AppDataSource.getRepository(ShopifyOrder);
        let existingOrders = await shopifyOrderRepository.find({ where: { platform_id: In(shopifyOrderBatch.map(order => order.id)) }});
        this.existingOrdersMap = new Map<string, ShopifyOrder>(
            existingOrders
                .filter((order: ShopifyOrder) => order !== undefined) 
                .map((order: ShopifyOrder) => [String(order.platform_id), order]
        ));

        const shopifyLineItemRepository = AppDataSource.getRepository(EntityLineItem);
        let existingLineItems = await shopifyLineItemRepository.find({ where: { platform_id: In(shopifyOrderBatch.map(order => {
            return order.lineItems?.map(line_item => line_item.id)
        })) }});
        this.existingLineItemsMap = new Map<string, EntityLineItem>(
            existingLineItems.map((lineItem: EntityLineItem) => [String(lineItem.platform_id || 'null'), lineItem])
        );

        let productIds = shopifyOrderBatch.map(order => {
            return order.lineItems?.map(line_item => line_item.id);
        })
        const shopifyProductRepository = AppDataSource.getRepository(ShopifyProduct);
        const existingProducts = await shopifyProductRepository.find({ where: { platform_id: In(productIds) }});
        this.existingProductsMap = new Map<string, ShopifyProduct>(
            existingProducts.map((product: ShopifyProduct) => [String(product.platform_id || 'null'), product])
        );
    }

    updateShopifyOrder(existingOrder: ShopifyOrder, order: Order): void {
        existingOrder.admin_graphql_api_id = order.adminGraphqlApiId!;
        existingOrder.buyer_accepts_marketing = order.buyerAcceptsMarketing!;
        existingOrder.confirmation_number = order.confirmationNumber!;
        existingOrder.confirmed = order.confirmed!;
        existingOrder.created_at = order.createdAt!;
        existingOrder.currency = order.currency!;
        existingOrder.current_subtotal_price = order.currentSubtotalPrice!;
        existingOrder.current_total_price = order.currentTotalPrice!;
        existingOrder.current_total_tax = order.currentTotalTax!;
        existingOrder.customer_locale = order.customerLocale!;
        existingOrder.financial_status = order.financialStatus!;
        existingOrder.name = order.name!;
        existingOrder.order_number = order.orderNumber!;
        existingOrder.presentment_currency = order.presentmentCurrency!;
        existingOrder.processed_at = order.processedAt!;
        existingOrder.source_name = order.sourceName!;
        existingOrder.subtotal_price = order.subtotalPrice!;
        existingOrder.tags = order.tags!;
        existingOrder.tax_exempt = order.taxExempt!;
        existingOrder.total_discounts = order.totalDiscounts!;
        existingOrder.total_line_items_price = order.totalLineItemsPrice!;
        existingOrder.total_price = order.totalPrice!;
        existingOrder.total_tax = order.totalTax!;
        existingOrder.user_id = order.userId!;
        existingOrder.updated_at = order.updatedAt!;
        existingOrder.checkout_id = order.checkoutId!;
        existingOrder.checkout_token = order.checkoutToken!;
        
        existingOrder.line_items = order.lineItems?.map(lineItem => {
            const product = this.existingProductsMap.get(lineItem.productId ?? '') ?? null;
            const orderEntity = this.existingOrdersMap.get(order.id ?? '') ?? null;
            return new EntityLineItem(
                lineItem.id,
                lineItem.platformId,
                lineItem.name,
                lineItem.title,
                lineItem.price,
                lineItem.vendor,
                lineItem.quantity,
                product,
                orderEntity
            );
        }) || [];
    }

    async getOrders(): Promise<ShopifyOrder[]> {
        return await AppDataSource.manager.find(ShopifyOrder, {
            relations: ['line_items', 'line_items.product'],
        });
    }
}