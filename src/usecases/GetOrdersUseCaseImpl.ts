import { OrderRepository } from 'adapters/output/db/OrderRepository';
import { LineItem } from 'domain/entities/LineItem';
import { injectable } from 'tsyringe';
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
    return orders.map((order: ShopifyOrder) => this.toDomain(order));
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
      shopifyOrder.user_id,
      shopifyOrder.updated_at ? new Date(shopifyOrder.updated_at) : null,
      shopifyOrder.checkout_id,
      shopifyOrder.checkout_token
    );
  }
}
