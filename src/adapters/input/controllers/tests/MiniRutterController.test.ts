import { createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import { container } from "tsyringe";
import { Order } from "../../../../domain/entities/Order";
import { Product } from "../../../../domain/entities/Product";
import { MiniRutterController } from "../MiniRutterController";

// Mock dependencies
const mockGetProductsUseCase = {
  execute: jest.fn(),
};

const mockGetOrdersUseCase = {
  execute: jest.fn(),
};

// Setup dependency injection container
beforeAll(() => {
  container.registerInstance("GetProductsUseCase", mockGetProductsUseCase);
  container.registerInstance("GetOrdersUseCase", mockGetOrdersUseCase);
  useContainer(container as any);
});

describe("MiniRutterController", () => {
  let app: any;

  beforeAll(() => {
    app = createExpressServer({
      controllers: [MiniRutterController],
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /v1/mini-rutter/products", () => {
    it("should return products when getProductsUseCase executes successfully", async () => {
      const mockProducts: Product[] = [
        new Product(
          "1",
          1001,
          "Product 1",
          "Title 1",
          null,
          null,
          null,
          new Date(),
          new Date(),
          "active",
        ),
        new Product(
          "2",
          1002,
          "Product 2",
          "Title 2",
          null,
          null,
          null,
          new Date(),
          new Date(),
          "active",
        ),
      ];
      mockGetProductsUseCase.execute.mockResolvedValue(mockProducts);

      const response = await request(app).get("/v1/mini-rutter/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should return 500 and log an error when getProductsUseCase fails", async () => {
      mockGetProductsUseCase.execute.mockRejectedValue(
        new Error("Failed to get products"),
      );

      const response = await request(app).get("/v1/mini-rutter/products");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        name: "HttpError",
        message: "Internal server error",
      });
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /v1/mini-rutter/orders", () => {
    it("should return orders when getOrdersUseCase executes successfully", async () => {
      const mockOrders: Order[] = [
        new Order("1", "1001", []),
        new Order("2", "1002", []),
      ];
      mockGetOrdersUseCase.execute.mockResolvedValue(mockOrders);

      const response = await request(app).get("/v1/mini-rutter/orders");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
      expect(mockGetOrdersUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should return 500 and log an error when getOrdersUseCase fails", async () => {
      mockGetOrdersUseCase.execute.mockRejectedValue(
        new Error("Failed to get orders"),
      );

      const response = await request(app).get("/v1/mini-rutter/orders");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        name: "HttpError",
        message: "Internal server error",
      });
      expect(mockGetOrdersUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
