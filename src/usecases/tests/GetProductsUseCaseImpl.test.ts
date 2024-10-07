import { container } from "tsyringe";
import { ProductRepository } from "../../adapters/output/db/ProductRepository";
import { ShopifyProduct } from "../../adapters/output/db/entities/ShopifyProduct";
import { GetProductsUseCaseImpl } from "../GetProductsUseCaseImpl";

// Mock dependencies
jest.mock("../../adapters/output/db/ProductRepository");

const mockProductRepository = new ProductRepository();

container.registerInstance(ProductRepository, mockProductRepository);

describe("GetProductsUseCaseImpl", () => {
  let getProductsUseCase: GetProductsUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    getProductsUseCase = new GetProductsUseCaseImpl(mockProductRepository);
  });

  it("should return filtered products with specific fields", async () => {
    const mockShopifyProducts: ShopifyProduct[] = [
      new ShopifyProduct(
        "1",
        1001,
        "Product 1",
        "Title 1",
        "<p>Description</p>",
        "Vendor 1",
        "Product Type 1",
        new Date("2024-01-01"),
        new Date("2024-01-02"),
        "active",
        new Date("2024-01-03"),
        "template_suffix",
        "published_scope",
        "tag1",
        "graphqlApiId",
      ),
    ];
    mockProductRepository.getProducts = jest
      .fn()
      .mockResolvedValue(mockShopifyProducts);

    const products = await getProductsUseCase.execute();

    expect(products).toHaveLength(1);
    expect(products[0]).toEqual({
      id: "1",
      platformId: 1001,
      name: "Title 1",
    });
  });

  it("should return empty array when no products are available", async () => {
    mockProductRepository.getProducts = jest.fn().mockResolvedValue([]);

    const products = await getProductsUseCase.execute();

    expect(products).toHaveLength(0);
  });
});
