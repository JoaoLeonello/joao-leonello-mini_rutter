import { jest } from "@jest/globals";
import { container } from "tsyringe";
import { OrderRepository } from "../../adapters/output/db/OrderRepository";
import { LineItem } from "../../adapters/output/db/entities/LineItem";
import { ShopifyOrder } from "../../adapters/output/db/entities/ShopifyOrder";
import { GetOrdersUseCaseImpl } from "../GetOrdersUseCaseImpl";

// Mock dependencies
jest.mock("../../adapters/output/db/OrderRepository");

const mockOrderRepository = new OrderRepository();

container.registerInstance(OrderRepository, mockOrderRepository);

const mockShopifyOrders: ShopifyOrder[] = [new ShopifyOrder("1", 1001)];

describe("GetOrdersUseCaseImpl", () => {
  let getOrdersUseCase: GetOrdersUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    getOrdersUseCase = new GetOrdersUseCaseImpl(mockOrderRepository);
  });

  it("should return filtered orders with line items", async () => {
    mockOrderRepository.getOrders = jest
      .fn()
      .mockResolvedValue(mockShopifyOrders);

    const orders = await getOrdersUseCase.execute();

    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe("1");
    expect(orders[0].platformId).toBe("1001");
    expect(orders[0].lineItems).toHaveLength(2);
    expect(orders[0].lineItems[0].product_id).toBe("product1");
  });

  it("should return orders with product_id: null if there are no line items", async () => {
    mockOrderRepository.getOrders = jest
      .fn()
      .mockResolvedValue([new ShopifyOrder("2", 1002, [])]);

    const orders = await getOrdersUseCase.execute();

    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe("2");
    expect(orders[0].platformId).toBe("1002");
    expect(orders[0].lineItems).toEqual([{ product_id: null }]);
  });
});
