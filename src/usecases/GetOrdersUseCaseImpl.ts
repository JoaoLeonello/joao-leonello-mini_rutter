import { injectable } from 'tsyringe';
import { OrderRepository } from '../adapters/output/db/OrderRepository';
import { LineItem } from '../domain/entities/LineItem';
import { Order } from '../domain/entities/Order';
import { GetOrdersUseCase } from '../usecases/interfaces/GetOrdersUseCase';
import { ShopifyOrder } from './../adapters/output/db/entities/ShopifyOrder';

@injectable()
export class GetOrdersUseCaseImpl implements GetOrdersUseCase {
  
  constructor(
    private orderRepository: OrderRepository
  ) {}

  async execute(): Promise<Order[]> {
    let orders = await this.orderRepository.getOrders()
    let ordersDomain = orders.map((order: ShopifyOrder) => this.toDomain(order));
    
    return ordersDomain.map((order: Order) => {
      // First, filter fields from order
      let filteredOrder = this.filterFields(order, ['_id', '_platformId', '_lineItems']);
  
      // Second, filter line_items fields
      if (filteredOrder._lineItems) {
        let expandedLineItems: any[] = [];
        filteredOrder._lineItems.forEach((lineItem: any) => {
          // Define null if there is no value
          const productId = lineItem._productId ? lineItem._productId : null;
          const filteredLineItem = { product_id: productId };
  
          // Multiply line item by quantity and push to array expandedLineItems
          for (let i = 0; i < (lineItem._quantity || 1); i++) {
            expandedLineItems.push(filteredLineItem);
          }
        });
        filteredOrder._lineItems = expandedLineItems;
      }
  
      return filteredOrder;
    });
  }

  toDomain(shopifyOrder: ShopifyOrder): Order {
    return new Order(
      shopifyOrder.id,
      shopifyOrder.platform_id.toString(),
      shopifyOrder.line_items?.map(lineItem => new LineItem(
        lineItem.id,
        lineItem.platform_id,
        lineItem.name,
        lineItem.title,
        lineItem.price,
        lineItem.vendor,
        lineItem.quantity,
        lineItem.product?.id ? lineItem.product?.id.toString() : null,
        shopifyOrder.id
      )),
      shopifyOrder.admin_graphql_api_id,
      shopifyOrder.buyer_accepts_marketing,
      shopifyOrder.confirmation_number,
      shopifyOrder.confirmed,
      new Date(shopifyOrder.created_at ?? new Date()),
      shopifyOrder.currency,
      shopifyOrder.current_subtotal_price,
      shopifyOrder.current_total_price,
      shopifyOrder.current_total_tax,
      shopifyOrder.customer_locale,
      shopifyOrder.financial_status,
      shopifyOrder.name,
      shopifyOrder.order_number,
      shopifyOrder.presentment_currency,
      new Date(shopifyOrder.processed_at ?? new Date()),
      shopifyOrder.source_name,
      shopifyOrder.subtotal_price,
      shopifyOrder.tags,
      shopifyOrder.tax_exempt,
      shopifyOrder.total_discounts,
      shopifyOrder.total_line_items_price,
      shopifyOrder.total_price,
      shopifyOrder.total_tax,
      shopifyOrder.user_id,
      shopifyOrder.updated_at ? new Date(shopifyOrder.updated_at) : null,
      shopifyOrder.checkout_id,
      shopifyOrder.checkout_token
    );
  }

  filterFields(obj: any, fields: string[]): any {
    return Object.keys(obj)
      .filter(key => fields.includes(key) && obj[key] !== null)
      .reduce((result: Record<string, any>, key) => {
        result[key] = obj[key];
        return result;
      }, {});
  }
}
