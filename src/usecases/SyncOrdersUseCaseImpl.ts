import { inject, injectable } from "tsyringe";
import {
  LineItemDTO,
  ShopifyOrderDTO,
} from "../adapters/input/shopify/dto/ShopifyOrderDTO";
import { LineItem } from "../domain/entities/LineItem";
import { Order } from "../domain/entities/Order";
import { ShopifyOrdersInputPort } from "../ports/input/InputPort";
import { ShopifyOrdersOutputPort } from "../ports/output/OutputPort";
import { SyncOrdersUseCase } from "../usecases/interfaces/SyncOrdersUseCase";

@injectable()
export class SyncOrdersUseCaseImpl implements SyncOrdersUseCase {
  constructor(
    @inject("ShopifyOrdersInputPort") private inputPort: ShopifyOrdersInputPort,
    @inject("ShopifyOrdersOutputPort")
    private outputPort: ShopifyOrdersOutputPort,
  ) {}

  async *execute(): AsyncGenerator<void> {
    // Loop for processing batch return from the generator function
    for await (const ordersBatch of this.inputPort.fetchOrdersInBatches()) {
      let orders = ordersBatch.map((order: ShopifyOrderDTO) =>
        this.toDomain(order),
      );
      yield await this.storeOrders(orders);
    }
  }

  async storeOrders(orders: Order[]): Promise<void> {
    return await this.outputPort.storeOrders(orders);
  }

  toDomain(shopifyOrderDTO: ShopifyOrderDTO): Order {
    return new Order(
      undefined,
      shopifyOrderDTO.id.toString(),
      shopifyOrderDTO.line_items.map(
        (lineItemDTO: LineItemDTO) =>
          new LineItem(
            undefined,
            lineItemDTO.id,
            lineItemDTO.name,
            lineItemDTO.title,
            lineItemDTO.price,
            lineItemDTO.vendor,
            lineItemDTO.quantity,
            lineItemDTO.product_id ? lineItemDTO.product_id.toString() : null,
            shopifyOrderDTO.id.toString(),
          ),
      ),
      shopifyOrderDTO.admin_graphql_api_id,
      shopifyOrderDTO.buyer_accepts_marketing,
      shopifyOrderDTO.confirmation_number,
      shopifyOrderDTO.confirmed,
      new Date(shopifyOrderDTO.created_at),
      shopifyOrderDTO.currency,
      shopifyOrderDTO.current_subtotal_price,
      shopifyOrderDTO.current_total_price,
      shopifyOrderDTO.current_total_tax,
      shopifyOrderDTO.customer_locale,
      shopifyOrderDTO.financial_status,
      shopifyOrderDTO.name,
      shopifyOrderDTO.order_number,
      shopifyOrderDTO.presentment_currency,
      new Date(shopifyOrderDTO.processed_at),
      shopifyOrderDTO.source_name,
      shopifyOrderDTO.subtotal_price,
      shopifyOrderDTO.tags,
      shopifyOrderDTO.tax_exempt,
      shopifyOrderDTO.total_discounts,
      shopifyOrderDTO.total_line_items_price,
      shopifyOrderDTO.total_price,
      shopifyOrderDTO.total_tax,
      shopifyOrderDTO.user_id,
      shopifyOrderDTO.updated_at ? new Date(shopifyOrderDTO.updated_at) : null,
      shopifyOrderDTO.checkout_id,
      shopifyOrderDTO.checkout_token,
    );
  }
}
