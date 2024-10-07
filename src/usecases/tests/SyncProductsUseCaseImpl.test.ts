import { container } from "tsyringe";
import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";
import { Product } from "../../domain/entities/Product";
import { ShopifyProductsInputPort } from "../../ports/input/InputPort";
import { ShopifyProductsOutputPort } from "../../ports/output/OutputPort";
import { SyncProductsUseCaseImpl } from "../SyncProductsUseCaseImpl";

// Mock dependencies
jest.mock("../../ports/input/InputPort");
jest.mock("../../ports/output/OutputPort");

const mockInputPort: ShopifyProductsInputPort = {
  fetchProductsInBatches: jest.fn(),
};

const mockOutputPort: ShopifyProductsOutputPort = {
  storeProducts: jest.fn(),
  getProducts: jest.fn(),
};

container.registerInstance("ShopifyProductsInputPort", mockInputPort);
container.registerInstance("ShopifyProductsOutputPort", mockOutputPort);

describe("SyncProductsUseCaseImpl", () => {
  let syncProductsUseCase: SyncProductsUseCaseImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    syncProductsUseCase = new SyncProductsUseCaseImpl(
      mockInputPort,
      mockOutputPort,
    );
  });

  it("should process and store products in batches", async () => {
    const mockProductsBatch: ShopifyProductDTO[] = [
      {
        id: 1,
        handle: "product-handle",
        title: "Product Title",
        body_html: "<p>Product description</p>",
        vendor: "Vendor Name",
        product_type: "Product Type",
        created_at: "2024-01-01",
        updated_at: "2024-01-02",
        status: "active",
        published_at: "2024-01-03",
        template_suffix: "template_suffix",
        published_scope: "web",
        tags: "tag1, tag2",
        admin_graphql_api_id: "graphqlApiId",
      },
    ];

    (mockInputPort.fetchProductsInBatches as jest.Mock).mockResolvedValueOnce([
      mockProductsBatch,
    ]);
    (mockOutputPort.storeProducts as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const generator = syncProductsUseCase.execute();
    const result = await generator.next();

    expect(result.done).toBe(false);
    expect(mockInputPort.fetchProductsInBatches).toHaveBeenCalledTimes(1);
    expect(mockOutputPort.storeProducts).toHaveBeenCalledWith(
      mockProductsBatch.map(
        (productDTO) =>
          new Product(
            undefined,
            productDTO.id,
            productDTO.handle,
            productDTO.title,
            productDTO.body_html,
            productDTO.vendor,
            productDTO.product_type,
            new Date(productDTO.created_at),
            new Date(productDTO.updated_at),
            productDTO.status,
            productDTO.published_at ? new Date(productDTO.published_at) : null,
            productDTO.template_suffix,
            productDTO.published_scope,
            productDTO.tags,
            productDTO.admin_graphql_api_id,
          ),
      ),
    );
  });

  it("should handle empty batches gracefully", async () => {
    (mockInputPort.fetchProductsInBatches as jest.Mock).mockResolvedValueOnce(
      [],
    );
    (mockOutputPort.storeProducts as jest.Mock).mockResolvedValueOnce(
      undefined,
    );

    const generator = syncProductsUseCase.execute();
    const result = await generator.next();

    expect(result.done).toBe(true);
    expect(mockInputPort.fetchProductsInBatches).toHaveBeenCalledTimes(1);
    expect(mockOutputPort.storeProducts).not.toHaveBeenCalled();
  });
});
