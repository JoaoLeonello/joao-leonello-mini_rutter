import { jest } from "@jest/globals";
import { container } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { OrderRepository } from "../../adapters/output/db/OrderRepository";
import { LineItem } from '../../adapters/output/db/entities/LineItem';
import { ShopifyOrder } from "../../adapters/output/db/entities/ShopifyOrder";
import { ShopifyProduct } from '../../adapters/output/db/entities/ShopifyProduct';
import { GetOrdersUseCaseImpl } from "../GetOrdersUseCaseImpl";

// Mock dependencies
jest.mock("../../adapters/output/db/OrderRepository");

const mockOrderRepository: jest.Mocked<OrderRepository> = {
  getOrders: jest.fn(),
  storeOrders: jest.fn(),
} as unknown as jest.Mocked<OrderRepository>;

container.registerInstance(OrderRepository, mockOrderRepository);

const mockShopifyProduct: ShopifyProduct = new ShopifyProduct(
  '1', // id
  123, // title
  "<p>Product description</p>", // body_html
  "Mock Vendor", // vendor
  "Mock Product Type", // product_type
  "2024-10-01T10:00:00Z", // created_at
  "mock-product", // handle
  new Date(), // updated_at
  new Date(), // published_at
  'test', // template_suffix
  new Date(), // published_scope
  "example tag", // tags
  "active", // status
  "admin_graphql_api_id_mock", // admin_graphql_api_id
  'test', // variants
);

const mockShopifyOrders: ShopifyOrder[] = [new ShopifyOrder(
  "1", // id
  1001, // platform_id
  "admin_graphql_api_id_mock", // admin_graphql_api_id
  true, // buyer_accepts_marketing
  "CONF-12345", // confirmation_number
  true, // confirmed
  new Date("2024-10-01T10:00:00Z"), // created_at
  "USD", // currency
  "100.00", // current_subtotal_price
  "110.00", // current_total_price
  "10.00", // current_total_tax
  "en-US", // customer_locale
  "paid", // financial_status
  "Order #1001", // name
  1001, // order_number
  "USD", // presentment_currency
  new Date("2024-10-01T10:10:00Z"), // processed_at
  "web", // source_name
  "100.00", // subtotal_price
  "mock_tag", // tags
  false, // tax_exempt
  "5.00", // total_discounts
  "105.00", // total_line_items_price
  "110.00", // total_price
  "10.00", // total_tax
  null, // user_id
  new Date("2024-10-01T10:15:00Z"), // updated_at
  123456, // checkout_id
  "checkout_token_mock", // checkout_token
  [
    new LineItem(
      uuidv4(), // id
      1, // platform_id
      "Mock Line Item", // name
      "Mock Line Item Title", // title
      "100.00", // price
      "Mock Vendor", // vendor
      2, // quantity
      mockShopifyProduct, // product (associado ao mockShopifyProduct)
      null // order (não associado diretamente neste contexto de mock)
    ),
  ] // line_items
)];

describe("GetOrdersUseCaseImpl", () => {
  let getOrdersUseCase: GetOrdersUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    getOrdersUseCase = new GetOrdersUseCaseImpl(mockOrderRepository);
  });

  it("should return filtered orders with line items", async () => {
    mockOrderRepository.getOrders.mockResolvedValue(mockShopifyOrders);

    const orders = await getOrdersUseCase.execute();

    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe("1");
  });

  it("should return orders with product_id: null if there are no line items", async () => {
    mockOrderRepository.getOrders.mockResolvedValue([new ShopifyOrder("2", 1002, undefined)]);

    const orders = await getOrdersUseCase.execute();

    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe("2");
  });
});