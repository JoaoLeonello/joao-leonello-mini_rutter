import { container } from "tsyringe";
import {
  LineItemDTO,
  MoneyDTO,
  MoneySetDTO,
  ShopifyOrderDTO,
} from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { LineItem } from "../../domain/entities/LineItem";
import { Order } from "../../domain/entities/Order";
import { ShopifyOrdersInputPort } from "../../ports/input/InputPort";
import { ShopifyOrdersOutputPort } from "../../ports/output/OutputPort";
import { SyncOrdersUseCaseImpl } from "../SyncOrdersUseCaseImpl";

// Mock dependencies
jest.mock("../../ports/input/InputPort");
jest.mock("../../ports/output/OutputPort");

const mockInputPort: jest.Mocked<ShopifyOrdersInputPort> = {
  fetchOrdersInBatches: jest.fn().mockReturnValue({
    [Symbol.asyncIterator]: jest.fn().mockReturnValue({
      next: jest.fn().mockResolvedValue({ done: true, value: [] })
    })
  }),
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
      new ShopifyOrderDTO(
        1, // id
        "admin_graphql_api_id_mock",
        null, // app_id
        "192.168.0.1", // browser_ip
        true, // buyer_accepts_marketing
        null, // cancel_reason
        null, // cancelled_at
        "cart_token_mock",
        12345, // checkout_id
        "checkout_token_mock",
        null, // client_details
        null, // closed_at
        null, // company
        "confirmation_number_mock",
        true, // confirmed
        "2024-10-01T10:00:00Z", // created_at
        "USD", // currency
        "100.00", // current_subtotal_price
        null, // current_subtotal_price_set
        null, // current_total_additional_fees_set
        "10.00", // current_total_discounts
        null, // current_total_discounts_set
        null, // current_total_duties_set
        "90.00", // current_total_price
        null, // current_total_price_set
        "8.00", // current_total_tax
        null, // current_total_tax_set
        "en-US", // customer_locale
        null, // device_id
        [], // discount_codes
        false, // estimated_taxes
        "paid", // financial_status
        null, // fulfillment_status
        null, // landing_site
        null, // landing_site_ref
        null, // location_id
        null, // merchant_of_record_app_id
        "Order #1001", // name
        null, // note
        [], // note_attributes
        1, // number
        1001, // order_number
        null, // original_total_additional_fees_set
        null, // original_total_duties_set
        ["credit_card"], // payment_gateway_names
        null, // po_number
        "USD", // presentment_currency
        "2024-10-01T10:10:00Z", // processed_at
        null, // reference
        null, // referring_site
        null, // source_identifier
        "web", // source_name
        null, // source_url
        "90.00", // subtotal_price
        null, // subtotal_price_set
        "example tag", // tags
        false, // tax_exempt
        [], // tax_lines
        true, // taxes_included
        false, // test
        "token_mock", // token
        "10.00", // total_discounts
        null, // total_discounts_set
        "90.00", // total_line_items_price
        null, // total_line_items_price_set
        "90.00", // total_outstanding
        "90.00", // total_price
        null, // total_price_set
        null, // total_shipping_price_set
        "8.00", // total_tax
        null, // total_tax_set
        "0.00", // total_tip_received
        0, // total_weight
        null, // updated_at
        null, // user_id
        null, // billing_address
        null, // customer
        [], // discount_applications
        [], // fulfillments
        [
          new LineItemDTO(
            1, // id
            "admin_graphql_api_id_mock",
            1, // fulfillable_quantity
            "manual", // fulfillment_service
            null, // fulfillment_status
            false, // gift_card
            500, // grams
            "Test Product", // name
            "45.00", // price
            new MoneySetDTO(
              new MoneyDTO("45.00", "USD"),
              new MoneyDTO("45.00", "USD")
            ), // price_set
            true, // product_exists
            10001, // product_id
            [], // properties
            2, // quantity
            true, // requires_shipping
            "SKU-001", // sku
            true, // taxable
            "Test Variant", // title
            "5.00", // total_discount
            new MoneySetDTO(
              new MoneyDTO("5.00", "USD"),
              new MoneyDTO("5.00", "USD")
            ), // total_discount_set
            null, // variant_id
            null, // variant_inventory_management
            null, // variant_title
            "Test Vendor", // vendor
            [], // tax_lines
            [], // duties
            [] // discount_allocations
          ),
        ], // line_items
        null, // payment_terms
        [], // refunds
        null, // shipping_address
        [] // shipping_lines
      ),
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
                  orderDTO.id.toString()
                )
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
            orderDTO.checkout_token
          )
      )
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
