import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../../config/typeOrmConfig";
import { Order } from "../../../../domain/entities/Order";
import { LineItem as EntityLineItem } from "../entities/LineItem";
import { ShopifyOrder } from "../entities/ShopifyOrder";
import { ShopifyProduct } from "../entities/ShopifyProduct";
import { OrderRepository } from "../OrderRepository";

// Mock dependencies
jest.mock("../../../../config/typeOrmConfig", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      find: jest.fn(),
    })),
    transaction: jest.fn(),
  },
}));

const mockEntityManager = {
  save: jest.fn(),
  update: jest.fn(),
} as unknown as EntityManager;

const mockOrderRepository = {
  find: jest.fn(),
};

const mockLineItemRepository = {
  find: jest.fn(),
};

const mockProductRepository = {
  find: jest.fn(),
};

jest.spyOn(AppDataSource, "getRepository").mockImplementation((entity) => {
  if (entity === ShopifyOrder) return mockOrderRepository as any;
  if (entity === EntityLineItem) return mockLineItemRepository as any;
  if (entity === ShopifyProduct) return mockProductRepository as any;
  throw new Error("Unknown entity");
});

(AppDataSource.transaction as jest.Mock).mockImplementation(async (cb) => {
  return cb(mockEntityManager);
});

describe("OrderRepository", () => {
  let orderRepository: OrderRepository;

  beforeEach(() => {
    orderRepository = new OrderRepository();
    jest.clearAllMocks();
  });

  describe("storeOrders", () => {
    it("should save new orders and line items", async () => {
      const orders: Order[] = [
        new Order(
          "1",
          "1001",
          [],
          "graphqlApiId",
          true,
          "confirmation",
          true,
          new Date(),
          "USD",
          "10",
          "15",
          "5",
          "en",
          "paid",
          "Order1",
          1,
          "USD",
          new Date(),
          "shopify",
          "10",
          "",
          false,
          "0",
          "10",
          "15",
          "5",
          12345,
          new Date(),
          123,
          "token",
        ),
      ];

      await orderRepository.storeOrders(orders);

      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it("should update existing orders", async () => {
      // Mock existing orders in the database
      mockOrderRepository.find.mockResolvedValue([new ShopifyOrder("1", 1001)]);
      const orders: Order[] = [
        new Order(
          "1",
          "1001",
          [],
          "graphqlApiId",
          true,
          "confirmation",
          true,
          new Date(),
          "USD",
          "10",
          "15",
          "5",
          "en",
          "paid",
          "Order1",
          1,
          "USD",
          new Date(),
          "shopify",
          "10",
          "",
          false,
          "0",
          "10",
          "15",
          "5",
          12345,
          new Date(),
          123,
          "token",
        ),
      ];

      await orderRepository.setupMaps(orders);
      await orderRepository.storeOrders(orders);

      expect(mockEntityManager.update).toHaveBeenCalled();
    });

    it("should log a warning when a line item has no linked product", async () => {
      const orders: Order[] = [
        new Order(
          "1",
          "1001",
          [],
          "graphqlApiId",
          true,
          "confirmation",
          true,
          new Date(),
          "USD",
          "10",
          "15",
          "5",
          "en",
          "paid",
          "Order1",
          1,
          "USD",
          new Date(),
          "shopify",
          "10",
          "",
          false,
          "0",
          "10",
          "15",
          "5",
          12345,
          new Date(),
          123,
          "token",
        ),
      ];

      const loggerSpy = jest
        .spyOn(console, "warn")
        .mockImplementation(() => {});

      await orderRepository.storeOrders(orders);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining("Skipping line item"),
      );
      loggerSpy.mockRestore();
    });
  });

  describe("setupMaps", () => {
    it("should setup existing orders, line items, and products maps", async () => {
      const orders: Order[] = [
        new Order(
          "1",
          "1001",
          [],
          "graphqlApiId",
          true,
          "confirmation",
          true,
          new Date(),
          "USD",
          "10",
          "15",
          "5",
          "en",
          "paid",
          "Order1",
          1,
          "USD",
          new Date(),
          "shopify",
          "10",
          "",
          false,
          "0",
          "10",
          "15",
          "5",
          12345,
          new Date(),
          123,
          "token",
        ),
      ];

      mockOrderRepository.find.mockResolvedValue([new ShopifyOrder("1", 1001)]);
      mockLineItemRepository.find.mockResolvedValue([
        new EntityLineItem(
          "1",
          2002,
          "name",
          "title",
          "price",
          "vendor",
          1,
          null,
          null,
        ),
      ]);
      mockProductRepository.find.mockResolvedValue([
        new ShopifyProduct(
          "1",
          1001,
          "name",
          "title",
          "body_html",
          "vendor",
          "product_type",
          new Date(),
          new Date(),
          "status",
        ),
      ]);

      await orderRepository.setupMaps(orders);

      expect(orderRepository["existingOrdersMap"].size).toBeGreaterThan(0);
      expect(orderRepository["existingLineItemsMap"].size).toBeGreaterThan(0);
      expect(orderRepository["existingProductsMap"].size).toBeGreaterThan(0);
    });
  });

  describe("getOrders", () => {
    it("should return orders with line items and products", async () => {
      mockOrderRepository.find.mockResolvedValue([new ShopifyOrder("1", 1001)]);

      const orders = await orderRepository.getOrders();

      expect(orders).toBeDefined();
      expect(orders.length).toBeGreaterThan(0);
    });
  });
});
