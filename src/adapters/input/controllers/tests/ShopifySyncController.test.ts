import { createExpressServer, useContainer } from "routing-controllers";
import request from "supertest";
import { container } from "tsyringe";
import { SyncOrdersUseCase } from "usecases/interfaces/SyncOrdersUseCase";
import { SyncProductsUseCase } from "usecases/interfaces/SyncProductsUseCase";
import { TsyringeAdapter } from "../../../../config/tsyringeAdapter";
import { ShopifySyncController } from "../ShopifySyncController";

// Mock dependencies
const mockSyncProductsUseCase = {
  execute: jest.fn(),
  storeProducts: jest.fn()
};

const mockSyncOrdersUseCase = {
  execute: jest.fn(),
  storeOrders: jest.fn()
};

let app: any;

beforeAll(() => {
  useContainer(new TsyringeAdapter(container));

  container.registerInstance<SyncProductsUseCase>(
    "SyncProductsUseCase",
    mockSyncProductsUseCase
  );
  container.registerInstance<SyncOrdersUseCase>(
    "SyncOrdersUseCase",
    mockSyncOrdersUseCase
  );

  app = createExpressServer({
    controllers: [ShopifySyncController],
  });
});

describe("ShopifySyncController", () => {
  let app: any;

  beforeAll(() => {
    app = createExpressServer({
      controllers: [ShopifySyncController],
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /v1/sync/products", () => {
    it("should return 200 and a success message when products are processed successfully", async () => {
      mockSyncProductsUseCase.execute.mockImplementation(async function* () {
        yield ["Product 1"];
      });

      const response = await request(app).get("/v1/sync/products");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        message: "Products processed successfully",
      });
      expect(mockSyncProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should return 500 and log an error when product processing fails", async () => {
      mockSyncProductsUseCase.execute.mockImplementation(async function* () {
        throw new Error("Failed to process products");
      });

      const response = await request(app).get("/v1/sync/products");

      expect(response.status).toBe(500);
      expect(mockSyncProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /v1/sync/orders", () => {
    it("should return 200 and a success message when orders are processed successfully", async () => {
      mockSyncOrdersUseCase.execute.mockImplementation(async function* () {
        yield ["Order 1"];
      });

      const response = await request(app).get("/v1/sync/orders");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        message: "Orders processed successfully",
      });
      expect(mockSyncOrdersUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it("should return 500 and log an error when order processing fails", async () => {
      mockSyncOrdersUseCase.execute.mockImplementation(async function* () {
        throw new Error("Failed to process products");
      });

      const response = await request(app).get("/v1/sync/orders");

      expect(response.status).toBe(500);
      expect(mockSyncOrdersUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });
});
