import { ImageDTO, OptionDTO, ShopifyProductDTO, VariantDTO } from '../../adapters/input/shopify/dto/ShopifyProductDTO';
import { ShopifyInputPort } from '../../ports/input/InputPort';
import { OutputPort } from '../../ports/output/OutputPort';
import { SyncProductsUseCaseImpl } from '../SyncProductsUseCaseImpl';

describe('SyncProductsUseCaseImpl', () => {
  let syncProductsUseCase: SyncProductsUseCaseImpl;
  let inputPortMock: jest.Mocked<ShopifyInputPort>;
  let outputPortMock: jest.Mocked<OutputPort>;

  beforeEach(() => {

    inputPortMock = {
      fetchProductsInBatches: jest.fn()
    } as unknown as jest.Mocked<ShopifyInputPort>;


    outputPortMock = {
      storeProducts: jest.fn()
    } as unknown as jest.Mocked<OutputPort>;


    syncProductsUseCase = new SyncProductsUseCaseImpl(inputPortMock, outputPortMock);
  });


  function createMockProduct(overrides: Partial<ShopifyProductDTO> = {}): ShopifyProductDTO {
    return new ShopifyProductDTO(
      overrides.id || 1,
      overrides.title || 'Test Product',
      overrides.body_html || '<p>Body HTML</p>',
      overrides.vendor || 'Vendor',
      overrides.product_type || 'Product Type',
      overrides.created_at || '2024-09-30T00:00:00Z',
      overrides.handle || 'test-product-handle',
      overrides.updated_at || '2024-09-30T00:00:00Z',
      overrides.published_at || null,
      overrides.template_suffix || null,
      overrides.published_scope || 'web',
      overrides.tags || 'test-tag',
      overrides.status || 'active',
      overrides.admin_graphql_api_id || 'gid://shopify/Product/1',
      overrides.variants || [
        new VariantDTO(1, 1, 'Variant 1', '19.99', 1, 'deny', null, null, null, '2024-09-30T00:00:00Z', '2024-09-30T00:00:00Z', 'true', true, 'manual', 500, null, true, 'SKU1', 1.5, 'kg', 1001, 10, 0, 'gid://shopify/ProductVariant/1', null),
      ],
      overrides.options || [
        new OptionDTO(1, 1, 'Size', 1, ['S', 'M', 'L']),
      ],
      overrides.images || [
        new ImageDTO(1, 1, 1, 'https://example.com/image.png', 800, 600, [], '2024-09-30T00:00:00Z', '2024-09-30T00:00:00Z', 'gid://shopify/ProductImage/1'),
      ],
      overrides.image || null
    );
  }

  function createMockProduct2(overrides: Partial<ShopifyProductDTO> = {}): ShopifyProductDTO {
    return new ShopifyProductDTO(
      overrides.id || 2,
      overrides.title || 'Test Product',
      overrides.body_html || '<p>Body HTML</p>',
      overrides.vendor || 'Vendor',
      overrides.product_type || 'Product Type',
      overrides.created_at || '2024-09-30T00:00:00Z',
      overrides.handle || 'test-product-handle',
      overrides.updated_at || '2024-09-30T00:00:00Z',
      overrides.published_at || null,
      overrides.template_suffix || null,
      overrides.published_scope || 'web',
      overrides.tags || 'test-tag',
      overrides.status || 'active',
      overrides.admin_graphql_api_id || 'gid://shopify/Product/1',
      overrides.variants || [
        new VariantDTO(1, 1, 'Variant 1', '19.99', 1, 'deny', null, null, null, '2024-09-30T00:00:00Z', '2024-09-30T00:00:00Z', 'true', true, 'manual', 500, null, true, 'SKU1', 1.5, 'kg', 1001, 10, 0, 'gid://shopify/ProductVariant/1', null),
      ],
      overrides.options || [
        new OptionDTO(1, 1, 'Size', 1, ['S', 'M', 'L']),
      ],
      overrides.images || [
        new ImageDTO(1, 1, 1, 'https://example.com/image.png', 800, 600, [], '2024-09-30T00:00:00Z', '2024-09-30T00:00:00Z', 'gid://shopify/ProductImage/1'),
      ],
      overrides.image || null
    );
  }

  it('should fetch products in batches and store each batch', async () => {
    const mockProductsBatch1: ShopifyProductDTO[] = [createMockProduct2()];

    const mockProductsBatch2: ShopifyProductDTO[] = [createMockProduct()]

    inputPortMock.fetchProductsInBatches.mockReturnValue((async function* () {
      yield mockProductsBatch1;
      yield mockProductsBatch2;
    })());

    outputPortMock.storeProducts.mockResolvedValue();

    const generator = syncProductsUseCase.execute();
    await generator.next();
    await generator.next();

    expect(inputPortMock.fetchProductsInBatches).toHaveBeenCalled();

    expect(outputPortMock.storeProducts).toHaveBeenCalledWith(mockProductsBatch1);
    expect(outputPortMock.storeProducts).toHaveBeenCalledWith(mockProductsBatch2);
  });

  it('should propagate errors when fetching products fails', async () => {
    const error = new Error('Failed to fetch products');
    inputPortMock.fetchProductsInBatches.mockReturnValue((async function* () {
      throw error;
    })());

    const generator = syncProductsUseCase.execute();
    
    await expect(generator.next()).rejects.toThrow('Failed to fetch products');
    expect(outputPortMock.storeProducts).not.toHaveBeenCalled(); 
  });

  it('should propagate errors when storing products fails', async () => {
    const mockProductsBatch: ShopifyProductDTO[] = [
        createMockProduct()
    ];

    inputPortMock.fetchProductsInBatches.mockReturnValue((async function* () {
      yield mockProductsBatch;
    })());

    const error = new Error('Failed to store products');
    outputPortMock.storeProducts.mockRejectedValue(error);

    const generator = syncProductsUseCase.execute();

    await expect(generator.next()).rejects.toThrow('Failed to store products');
    expect(outputPortMock.storeProducts).toHaveBeenCalledWith(mockProductsBatch);
  });
});
