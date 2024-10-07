import { ShopifyProductRepository } from "../ShopifyProductRepository";
import { ShopifyProductDTO } from "../dto/ShopifyProductDTO";
import { shopifyApi } from "../requests/ShopifyRequests";

// Mock dependencies
jest.mock("../requests/ShopifyRequests", () => ({
  shopifyApi: {
    get: jest.fn(),
  },
}));

describe("ShopifyProductRepository", () => {
  let shopifyProductRepository: ShopifyProductRepository;

  beforeEach(() => {
    shopifyProductRepository = new ShopifyProductRepository();
    jest.clearAllMocks();
  });

  describe("fetchProductsInBatches", () => {
    it("should fetch products in batches until all products are fetched", async () => {
      const mockProductsBatch: Partial<ShopifyProductDTO>[] = [
        {
          id: 1,
          title: "Product 1",
          vendor: "Vendor 1",
          created_at: "2024-01-01",
          updated_at: "2024-01-02",
        },
      ];
      (shopifyApi.get as jest.Mock)
        .mockResolvedValueOnce({
          data: { products: mockProductsBatch },
          headers: {
            link: '<https://shopify.com/products?page=2>; rel="next"',
          },
        })
        .mockResolvedValueOnce({
          data: { products: [] },
          headers: { link: "" },
        });

      const productsGenerator =
        shopifyProductRepository.fetchProductsInBatches();
      const products: ShopifyProductDTO[] = [];
      for await (const batch of productsGenerator) {
        products.push(...batch);
      }

      expect(shopifyApi.get).toHaveBeenCalledTimes(2);
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe(1);
    });

    it("should stop fetching if there is no next page", async () => {
      const mockProductsBatch: Partial<ShopifyProductDTO>[] = [
        {
          id: 1,
          title: "Product 1",
          vendor: "Vendor 1",
          created_at: "2024-01-01",
          updated_at: "2024-01-02",
        },
      ];
      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { products: mockProductsBatch },
        headers: { link: "" },
      });

      const productsGenerator =
        shopifyProductRepository.fetchProductsInBatches();
      const products: ShopifyProductDTO[] = [];
      for await (const batch of productsGenerator) {
        products.push(...batch);
      }

      expect(shopifyApi.get).toHaveBeenCalledTimes(1);
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe(1);
    });

    it("should handle cases where there are no products", async () => {
      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { products: [] },
        headers: { link: "" },
      });

      const productsGenerator =
        shopifyProductRepository.fetchProductsInBatches();
      const products: ShopifyProductDTO[] = [];
      for await (const batch of productsGenerator) {
        products.push(...batch);
      }

      expect(shopifyApi.get).toHaveBeenCalledTimes(1);
      expect(products).toHaveLength(0);
    });

    it("should handle multiple pages of products", async () => {
      const mockProductsBatch1: Partial<ShopifyProductDTO>[] = Array.from(
        { length: 50 },
        (_, i) => ({
          id: i + 1,
          title: `Product ${i + 1}`,
          vendor: "Vendor 1",
          created_at: "2024-01-01",
          updated_at: "2024-01-02",
        }),
      );
      const mockProductsBatch2: Partial<ShopifyProductDTO>[] = Array.from(
        { length: 20 },
        (_, i) => ({
          id: i + 51,
          title: `Product ${i + 51}`,
          vendor: "Vendor 1",
          created_at: "2024-01-01",
          updated_at: "2024-01-02",
        }),
      );
      (shopifyApi.get as jest.Mock)
        .mockResolvedValueOnce({
          data: { products: mockProductsBatch1 },
          headers: {
            link: '<https://shopify.com/products?page=2>; rel="next"',
          },
        })
        .mockResolvedValueOnce({
          data: { products: mockProductsBatch2 },
          headers: { link: "" },
        });

      const productsGenerator =
        shopifyProductRepository.fetchProductsInBatches();
      const products: ShopifyProductDTO[] = [];
      for await (const batch of productsGenerator) {
        products.push(...batch);
      }

      expect(shopifyApi.get).toHaveBeenCalledTimes(2);
      expect(products).toHaveLength(70);
      expect(products[0].id).toBe(1);
      expect(products[69].id).toBe(70);
    });
  });
});
