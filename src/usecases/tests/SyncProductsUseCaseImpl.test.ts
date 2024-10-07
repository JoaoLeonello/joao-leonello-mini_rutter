import { container } from "tsyringe";
import { ImageDTO, OptionDTO, ShopifyProductDTO, VariantDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";
import { Product } from "../../domain/entities/Product";
import { ShopifyProductsInputPort } from "../../ports/input/InputPort";
import { ShopifyProductsOutputPort } from "../../ports/output/OutputPort";
import { SyncProductsUseCaseImpl } from "../SyncProductsUseCaseImpl";

// Mock dependencies
jest.mock("../../ports/input/InputPort");
jest.mock("../../ports/output/OutputPort");

const mockInputPort: jest.Mocked<ShopifyProductsInputPort> = {
  fetchProductsInBatches: jest.fn().mockImplementation(async function* () {
    yield [];
  }),
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
      new ShopifyProductDTO(
        1, // id
        "Mock Product", // title
        "<p>Product description</p>", // body_html
        "Mock Vendor", // vendor
        "Mock Product Type", // product_type
        "2024-10-01T10:00:00Z", // created_at
        "mock-product", // handle
        "2024-10-01T10:10:00Z", // updated_at
        "2024-10-01T12:00:00Z", // published_at
        null, // template_suffix
        "global", // published_scope
        "example tag", // tags
        "active", // status
        "admin_graphql_api_id_mock", // admin_graphql_api_id
        [
          new VariantDTO(
            1, // id
            1, // product_id
            "Default Title", // title
            "10.00", // price
            1, // position
            "deny", // inventory_policy
            null, // compare_at_price
            "Option 1", // option1
            null, // option2
            null, // option3
            "2024-10-01T10:00:00Z", // created_at
            "2024-10-01T10:10:00Z", // updated_at
            true, // taxable
            "manual", // fulfillment_service
            500, // grams
            null, // inventory_management
            true, // requires_shipping
            "SKU-001", // sku
            1.5, // weight
            "kg", // weight_unit
            1001, // inventory_item_id
            100, // inventory_quantity
            100, // old_inventory_quantity
            "admin_graphql_api_id_variant_mock", // admin_graphql_api_id
            null, // image_id
          ),
        ], // variants
        [
          new OptionDTO(
            1, // id
            1, // product_id
            "Size", // name
            1, // position
            ["Small", "Medium", "Large"], // values
          ),
        ], // options
        [
          new ImageDTO(
            1, // id
            1, // product_id
            1, // position
            "https://example.com/image1.png", // src
            800, // width
            600, // height
            [], // variant_ids
            "2024-10-01T10:00:00Z", // created_at
            "2024-10-01T10:10:00Z", // updated_at
            "admin_graphql_api_id_image_mock", // admin_graphql_api_id
          ),
        ], // images
        null, // image
      ),
    ];

    (mockInputPort.fetchProductsInBatches as jest.Mock).mockImplementation(async function* () {
      yield mockProductsBatch;
    });
    (mockOutputPort.storeProducts as jest.Mock).mockResolvedValueOnce(undefined);

    const generator = syncProductsUseCase.execute();
    const result = await generator.next();

    expect(result.done).toBe(false);
    expect(mockInputPort.fetchProductsInBatches).toHaveBeenCalledTimes(1);
    expect(mockOutputPort.storeProducts).toHaveBeenCalledWith(
      mockProductsBatch.map(
        (productDTO) =>
          new Product(
            expect.any(String),
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
});
