import 'reflect-metadata';
import { createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import { container } from "tsyringe";
import { GetOrdersUseCase } from 'usecases/interfaces/GetOrdersUseCase';
import { GetProductsUseCase } from 'usecases/interfaces/GetProductsUseCase';
import { TsyringeAdapter } from '../../../../config/tsyringeAdapter';
import { Order } from "../../../../domain/entities/Order";
import { Product } from "../../../../domain/entities/Product";
import { MiniRutterController } from "../MiniRutterController";

// Mock dependencies
const mockGetProductsUseCase: jest.Mocked<GetProductsUseCase> = {
  execute: jest.fn<Promise<Product[]>, any>(),
  toDomain: jest.fn(), 
};

const mockGetOrdersUseCase: jest.Mocked<GetOrdersUseCase> = {
  execute: jest.fn<Promise<Order[]>, any>(),
  toDomain: jest.fn(),
};

let app: any;

beforeAll(() => {
  useContainer(new TsyringeAdapter(container));

  container.registerInstance<GetProductsUseCase>(
    "GetProductsUseCase",
    mockGetProductsUseCase
  );
  container.registerInstance<GetOrdersUseCase>(
    "GetOrdersUseCase",
    mockGetOrdersUseCase
  );

  app = createExpressServer({
    controllers: [MiniRutterController],
  });
});

describe("MiniRutterController", () => {

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

      const productsFromResponse = response.body.map(
        (product: any) => new Product(
          product._id,
          product._platformId,
          product._name,
          product._title,
          product._bodyHtml,
          product._vendor,
          product._productType,
          new Date(product._createdAt),
          new Date(product._updatedAt),
          product._status,
        )
      );

      expect(response.status).toBe(200);
      expect(productsFromResponse).toEqual(mockProducts);
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should return 500 and log an error when getProductsUseCase fails", async () => {
      mockGetProductsUseCase.execute.mockRejectedValue(
        new Error("Failed to get products"),
      );

      const response = await request(app).get("/v1/mini-rutter/products");

      expect(response.status).toBe(500);
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
      expect(mockGetOrdersUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});