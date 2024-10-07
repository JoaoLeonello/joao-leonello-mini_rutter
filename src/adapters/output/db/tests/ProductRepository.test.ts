import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../../config/typeOrmConfig";
import { Product } from "../../../../domain/entities/Product";
import { ShopifyProduct } from "../entities/ShopifyProduct";
import { ProductRepository } from "../ProductRepository";

// Mock dependencies
jest.mock("../../../../config/typeOrmConfig", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      find: jest.fn(),
    })),
    transaction: jest.fn(),
    manager: {
      getRepository: jest.fn(() => ({
        createQueryBuilder: jest.fn(() => ({
          select: jest.fn().mockReturnThis(),
          getMany: jest.fn(),
        })),
      })),
    },
  },
}));

const mockEntityManager = {
  save: jest.fn(),
} as unknown as EntityManager;

const mockProductRepository = {
  find: jest.fn(),
};

jest.spyOn(AppDataSource, "getRepository").mockImplementation((entity) => {
  if (entity === ShopifyProduct) return mockProductRepository as any;
  throw new Error("Unknown entity");
});

(AppDataSource.transaction as jest.Mock).mockImplementation(async (cb) => {
  return cb(mockEntityManager);
});

describe("ProductRepository", () => {
  let productRepository: ProductRepository;

  beforeEach(() => {
    productRepository = new ProductRepository();
    jest.clearAllMocks();
  });

  describe("storeProducts", () => {
    it("should save new products and update existing ones", async () => {
      const products: Product[] = [
        new Product(
          "1",
          1001,
          "name",
          "title",
          "bodyHtml",
          "vendor",
          "productType",
          new Date(),
          new Date(),
          "status",
          null,
          null,
          null,
          "tags",
          "graphqlApiId",
        ),
      ];

      mockProductRepository.find.mockResolvedValue([
        new ShopifyProduct(
          "1",
          1001,
          "existingName",
          "existingTitle",
          "existingBodyHtml",
          "existingVendor",
          "existingProductType",
          new Date(),
          new Date(),
          "existingStatus",
        ),
      ]);

      await productRepository.storeProducts(products);

      expect(mockEntityManager.save).toHaveBeenCalled();
    });

    it("should log an error when failing to save products", async () => {
      const products: Product[] = [
        new Product(
          "1",
          1001,
          "name",
          "title",
          "bodyHtml",
          "vendor",
          "productType",
          new Date(),
          new Date(),
          "status",
          null,
          null,
          null,
          "tags",
          "graphqlApiId",
        ),
      ];

      mockProductRepository.find.mockResolvedValue([]);
      (mockEntityManager.save as jest.Mock).mockRejectedValue(
        new Error("Save failed"),
      );

      const loggerSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(productRepository.storeProducts(products)).rejects.toThrow(
        "Error on saving products on database.",
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        "Error on saving products:",
        expect.any(Error),
      );
      loggerSpy.mockRestore();
    });
  });

  describe("getProducts", () => {
    it("should return products with specific fields", async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        getMany: jest
          .fn()
          .mockResolvedValue([
            new ShopifyProduct(
              "1",
              1001,
              "name",
              "title",
              "bodyHtml",
              "vendor",
              "productType",
              new Date(),
              new Date(),
              "status",
            ),
          ]),
      };

      (AppDataSource.manager.getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      });

      const products = await productRepository.getProducts();

      expect(products).toBeDefined();
      expect(products.length).toBeGreaterThan(0);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith([
        "shopify_product.id",
        "shopify_product.platform_id",
        "shopify_product.name",
        "shopify_product.title",
      ]);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    });
  });
});
