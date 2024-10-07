import { SyncOrdersUseCaseImpl } from "../SyncOrdersUseCaseImpl";
import { ShopifyOrdersInputPort } from "../../ports/input/InputPort";
import { ShopifyOrdersOutputPort } from "../../ports/output/OutputPort";
import {
  ShopifyOrderDTO,
  LineItemDTO,
} from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { Order } from "../../domain/entities/Order";
import { LineItem } from "../../domain/entities/LineItem";
import { container } from "tsyringe";

// Mock dependencies
jest.mock("../../ports/input/InputPort");
jest.mock("../../ports/output/OutputPort");

const mockInputPort: ShopifyOrdersInputPort = {
  fetchOrdersInBatches: jest.fn(),
};

const mockOutputPort: ShopifyOrdersOutputPort = {
  storeOrders: jest.fn(),
  getOrders: jest.fn(),
};

container.registerInstance("ShopifyOrdersInputPort", mockInputPort);
container.registerInstance("ShopifyOrdersOutputPort", mockOutputPort);

describe("SyncOrdersUseCaseImpl", () => {
  let syncOrdersUseCase: SyncOrdersUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    syncOrdersUseCase = new SyncOrdersUseCaseImpl(
      mockInputPort,
      mockOutputPort,
    );
  });

  it("should process and store orders in batches", async () => {
    const mockOrdersBatch: ShopifyOrderDTO[] = [
      {
        id: 1,
        line_items: [
          {
            id: 1001,
            name: "Item 1",
            title: "Title 1",
            price: "10.00",
            vendor: "Vendor 1",
            quantity: 2,
            product_id: 1001,
            admin_graphql_api_id: "graphqlApiId",
            fulfillable_quantity: 2,
            fulfillment_service: "manual",
            fulfillment_status: null,
            gift_card: false,
            grams: 200,
            price_set: {
              shop_money: { amount: "10.00", currency_code: "USD" },
              presentment_money: { amount: "10.00", currency_code: "USD" },
            },
            product_exists: true,
            properties: [],
            requires_shipping: true,
            sku: "SKU123",
            taxable: true,
            total_discount: "0.00",
            total_discount_set: {
              shop_money: { amount: "0.00", currency_code: "USD" },
              presentment_money: { amount: "0.00", currency_code: "USD" },
            },
            variant_id: null,
            variant_inventory_management: null,
            variant_title: null,
            tax_lines: [],
            duties: [],
            discount_allocations: [],
          },
        ],
        admin_graphql_api_id: "graphqlApiId",
        buyer_accepts_marketing: true,
        confirmation_number: "confirmationNumber",
        confirmed: true,
        created_at: "2024-01-01",
        currency: "USD",
        current_subtotal_price: "100.00",
        current_total_price: "120.00",
        current_total_tax: "20.00",
        customer_locale: "en",
        financial_status: "paid",
        name: "Order1",
        order_number: 1,
        presentment_currency: "USD",
        processed_at: "2024-01-02",
        source_name: "shopify",
        subtotal_price: "100.00",
        tags: "tag1",
        tax_exempt: false,
        total_discounts: "10.00",
        total_line_items_price: "110.00",
        total_price: "120.00",
        total_tax: "20.00",
        user_id: 12345,
        updated_at: "2024-01-03",
        checkout_id: 123,
        checkout_token: "token",
      },
    ];

    (mockInputPort.fetchOrdersInBatches as jest.Mock).mockResolvedValueOnce([
      mockOrdersBatch,
    ]);
    (mockOutputPort.storeOrders as jest.Mock).mockResolvedValueOnce(undefined);

    const generator = syncOrdersUseCase.execute();
    const result = await generator.next();

    expect(result.done).toBe(false);
    expect(mockInputPort.fetchOrdersInBatches).toHaveBeenCalledTimes(1);
    expect(mockOutputPort.storeOrders).toHaveBeenCalledWith(
      mockOrdersBatch.map(
        (orderDTO) =>
          new Order(
            undefined,
            orderDTO.id.toString(),
            orderDTO.line_items.map(
              (lineItemDTO: LineItemDTO) =>
                new LineItem(
                  undefined,
                  lineItemDTO.id,
                  lineItemDTO.name,
                  lineItemDTO.title,
                  lineItemDTO.price,
                  lineItemDTO.vendor,
                  lineItemDTO.quantity,
                  lineItemDTO.product_id
                    ? lineItemDTO.product_id.toString()
                    : null,
                  orderDTO.id.toString(),
                ),
            ),
            orderDTO.admin_graphql_api_id,
            orderDTO.buyer_accepts_marketing,
            orderDTO.confirmation_number,
            orderDTO.confirmed,
            new Date(orderDTO.created_at),
            orderDTO.currency,
            orderDTO.current_subtotal_price,
            orderDTO.current_total_price,
            orderDTO.current_total_tax,
            orderDTO.customer_locale,
            orderDTO.financial_status,
            orderDTO.name,
            orderDTO.order_number,
            orderDTO.presentment_currency,
            new Date(orderDTO.processed_at),
            orderDTO.source_name,
            orderDTO.subtotal_price,
            orderDTO.tags,
            orderDTO.tax_exempt,
            orderDTO.total_discounts,
            orderDTO.total_line_items_price,
            orderDTO.total_price,
            orderDTO.total_tax,
            orderDTO.user_id,
            orderDTO.updated_at ? new Date(orderDTO.updated_at) : null,
            orderDTO.checkout_id,
            orderDTO.checkout_token,
          ),
      ),
    );
  });

  it("should handle empty batches gracefully", async () => {
    (mockInputPort.fetchOrdersInBatches as jest.Mock).mockResolvedValueOnce([]);
    (mockOutputPort.storeOrders as jest.Mock).mockResolvedValueOnce(undefined);

    const generator = syncOrdersUseCase.execute();
    const result = await generator.next();

    expect(result.done).toBe(true);
    expect(mockInputPort.fetchOrdersInBatches).toHaveBeenCalledTimes(1);
    expect(mockOutputPort.storeOrders).not.toHaveBeenCalled();
  });
});
