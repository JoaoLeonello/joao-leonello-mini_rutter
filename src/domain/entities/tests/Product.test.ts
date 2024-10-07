import { Product } from "../Product";

// Mock uuid to return a consistent value for testing
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid"),
}));

describe("Product", () => {
  let product: Product;

  beforeEach(() => {
    product = new Product(
      "mock-uuid",
      1001,
      "Test Product",
      "Test Title",
      "<p>Test Body HTML</p>",
      "Test Vendor",
      "Test Product Type",
      new Date("2024-01-01T00:00:00Z"),
      new Date("2024-01-02T00:00:00Z"),
      "active",
      new Date("2024-01-03T00:00:00Z"),
      "Test Template Suffix",
      "global",
      "tag1, tag2",
      "gid://shopify/Product/1001",
    );
  });

  it("should create a Product instance with provided values", () => {
    expect(product.id).toBe("mock-uuid");
    expect(product.platformId).toBe(1001);
    expect(product.name).toBe("Test Product");
    expect(product.title).toBe("Test Title");
    expect(product.bodyHtml).toBe("<p>Test Body HTML</p>");
    expect(product.vendor).toBe("Test Vendor");
    expect(product.productType).toBe("Test Product Type");
    expect(product.createdAt).toEqual(new Date("2024-01-01T00:00:00Z"));
    expect(product.updatedAt).toEqual(new Date("2024-01-02T00:00:00Z"));
    expect(product.status).toBe("active");
    expect(product.publishedAt).toEqual(new Date("2024-01-03T00:00:00Z"));
    expect(product.templateSuffix).toBe("Test Template Suffix");
    expect(product.publishedScope).toBe("global");
    expect(product.tags).toBe("tag1, tag2");
    expect(product.adminGraphqlApiId).toBe("gid://shopify/Product/1001");
  });

  it("should create a Product instance with default values when optional parameters are not provided", () => {
    const defaultProduct = new Product(
      undefined,
      null,
      null,
      null,
      null,
      null,
      null,
      new Date("2024-01-01T00:00:00Z"),
      new Date("2024-01-02T00:00:00Z"),
      "draft",
    );

    expect(defaultProduct.id).toBe("mock-uuid");
    expect(defaultProduct.platformId).toBeNull();
    expect(defaultProduct.name).toBeNull();
    expect(defaultProduct.title).toBeNull();
    expect(defaultProduct.bodyHtml).toBeNull();
    expect(defaultProduct.vendor).toBeNull();
    expect(defaultProduct.productType).toBeNull();
    expect(defaultProduct.createdAt).toEqual(new Date("2024-01-01T00:00:00Z"));
    expect(defaultProduct.updatedAt).toEqual(new Date("2024-01-02T00:00:00Z"));
    expect(defaultProduct.status).toBe("draft");
    expect(defaultProduct.publishedAt).toBeNull();
    expect(defaultProduct.templateSuffix).toBeNull();
    expect(defaultProduct.publishedScope).toBeNull();
    expect(defaultProduct.tags).toBeNull();
    expect(defaultProduct.adminGraphqlApiId).toBeNull();
  });
});
