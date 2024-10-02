import { ShopifyRepository } from '../ShopifyRepository';
import { ClientDetailsDTO, LineItemDTO, MoneyDTO, MoneySetDTO, ShopifyOrderDTO, TaxLineDTO } from '../dto/ShopifyOrderDTO';
import { ImageDTO, OptionDTO, ShopifyProductDTO, VariantDTO } from '../dto/ShopifyProductDTO';
import { shopifyApi } from '../requests/ShopifyRequests';

jest.mock('../requests/ShopifyRequests.ts', () => ({
  shopifyApi: {
    get: jest.fn(),
  },
}));

describe('ShopifyRepository', () => {
  let repository: ShopifyRepository;

  beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    repository = new ShopifyRepository();
    jest.clearAllMocks();
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

  function createMockOrder(overrides: Partial<ShopifyOrderDTO> = {}): ShopifyOrderDTO {
    return new ShopifyOrderDTO(
      overrides.id || 1,
      overrides.admin_graphql_api_id || 'gid://shopify/Order/1',
      overrides.app_id || 123456,
      overrides.browser_ip || '127.0.0.1',
      overrides.buyer_accepts_marketing || false,
      overrides.cancel_reason || null,
      overrides.cancelled_at || null,
      overrides.cart_token || null,
      overrides.checkout_id || 1001,
      overrides.checkout_token || 'checkout-token',
      overrides.client_details || new ClientDetailsDTO(null, null, '127.0.0.1', null, null, 'user-agent'),
      overrides.closed_at || null,
      overrides.company || null,
      overrides.confirmation_number || 'CONFIRMATION123',
      overrides.confirmed || true,
      overrides.created_at || '2024-09-30T00:00:00Z',
      overrides.currency || 'USD',
      overrides.current_subtotal_price || '100.00',
      overrides.current_subtotal_price_set || new MoneySetDTO(new MoneyDTO('100.00', 'USD'), new MoneyDTO('100.00', 'USD')),
      overrides.current_total_additional_fees_set || null,
      overrides.current_total_discounts || '10.00',
      overrides.current_total_discounts_set || new MoneySetDTO(new MoneyDTO('10.00', 'USD'), new MoneyDTO('10.00', 'USD')),
      overrides.current_total_duties_set || null,
      overrides.current_total_price || '110.00',
      overrides.current_total_price_set || new MoneySetDTO(new MoneyDTO('110.00', 'USD'), new MoneyDTO('110.00', 'USD')),
      overrides.current_total_tax || '10.00',
      overrides.current_total_tax_set || new MoneySetDTO(new MoneyDTO('10.00', 'USD'), new MoneyDTO('10.00', 'USD')),
      overrides.customer_locale || 'en',
      overrides.device_id || null,
      overrides.discount_codes || [],
      overrides.estimated_taxes || false,
      overrides.financial_status || 'paid',
      overrides.fulfillment_status || null,
      overrides.landing_site || '/',
      overrides.landing_site_ref || null,
      overrides.location_id || null,
      overrides.merchant_of_record_app_id || null,
      overrides.name || 'Order #1001',
      overrides.note || null,
      overrides.note_attributes || [],
      overrides.number || 1001,
      overrides.order_number || 1001,
      overrides.original_total_additional_fees_set || null,
      overrides.original_total_duties_set || null,
      overrides.payment_gateway_names || ['credit_card'],
      overrides.po_number || null,
      overrides.presentment_currency || 'USD',
      overrides.processed_at || '2024-09-30T00:00:00Z',
      overrides.reference || null,
      overrides.referring_site || null,
      overrides.source_identifier || null,
      overrides.source_name || 'web',
      overrides.source_url || null,
      overrides.subtotal_price || '100.00',
      overrides.subtotal_price_set || new MoneySetDTO(new MoneyDTO('100.00', 'USD'), new MoneyDTO('100.00', 'USD')),
      overrides.tags || '',
      overrides.tax_exempt || false,
      overrides.tax_lines || [new TaxLineDTO('10.00', 0.1, 'Tax', new MoneySetDTO(new MoneyDTO('10.00', 'USD'), new MoneyDTO('10.00', 'USD')), false)],
      overrides.taxes_included || false,
      overrides.test || false,
      overrides.token || 'order-token',
      overrides.total_discounts || '10.00',
      overrides.total_discounts_set || new MoneySetDTO(new MoneyDTO('10.00', 'USD'), new MoneyDTO('10.00', 'USD')),
      overrides.total_line_items_price || '100.00',
      overrides.total_line_items_price_set || new MoneySetDTO(new MoneyDTO('100.00', 'USD'), new MoneyDTO('100.00', 'USD')),
      overrides.total_outstanding || '0.00',
      overrides.total_price || '110.00',
      overrides.total_price_set || new MoneySetDTO(new MoneyDTO('110.00', 'USD'), new MoneyDTO('110.00', 'USD')),
      overrides.total_shipping_price_set || new MoneySetDTO(new MoneyDTO('10.00', 'USD'), new MoneyDTO('10.00', 'USD')),
      overrides.total_tax || '10.00',
      overrides.total_tax_set || new MoneySetDTO(new MoneyDTO('10.00', 'USD'), new MoneyDTO('10.00', 'USD')),
      overrides.total_tip_received || '0.00',
      overrides.total_weight || 1000,
      overrides.updated_at || '2024-09-30T00:00:00Z',
      overrides.user_id || null,
      overrides.billing_address || null,
      overrides.customer || null,
      overrides.discount_applications || [],
      overrides.fulfillments || [],
      overrides.line_items || [new LineItemDTO(1, 'gid://shopify/LineItem/1', 1, 'manual', null, false, 500, 'Product Name', '100.00', new MoneySetDTO(new MoneyDTO('100.00', 'USD'), new MoneyDTO('100.00', 'USD')), true, 1001, [], 1, true, null, true, 'Product Title', '10.00', new MoneySetDTO(new MoneyDTO('10.00', 'USD'), new MoneyDTO('10.00', 'USD')), null, null, null, 'Vendor', [], [], [])],
      overrides.payment_terms || null,
      overrides.refunds || [],
      overrides.shipping_address || null,
      overrides.shipping_lines || []
    );
  }

  describe('fetchProductsInBatches', () => {
    it('should return product batches until there is no more pages', async () => {
        const productsBatch1: ShopifyProductDTO[] = [
            createMockProduct({ id: 1, title: 'Product 1' }),
        ];
          
        const productsBatch2: ShopifyProductDTO[] = [
            createMockProduct({ id: 2, title: 'Product 2' }),
        ];

      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { products: productsBatch1 },
        headers: { link: '<next-page-url>; rel="next"' },
      });

      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { products: productsBatch2 },
        headers: { link: '' },
      });

      const products = repository.fetchProductsInBatches();
      const result1 = await products.next();
      expect(result1.value).toEqual(productsBatch1);

      const result2 = await products.next();
      expect(result2.value).toEqual(productsBatch2);

      const result3 = await products.next();
      expect(result3.done).toBe(true);
    });

    it('deve parar o fetch se não houver link de próxima página', async () => {
        const productsBatch: ShopifyProductDTO[] = [
            createMockProduct({ id: 1, title: 'Product 1' }),
        ];

      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { products: productsBatch },
        headers: { link: '' },
      });

      const products = repository.fetchProductsInBatches();
      const result = await products.next();
      expect(result.value).toEqual(productsBatch);

      const doneResult = await products.next();
      expect(doneResult.done).toBe(true);
    });
  });

  describe('fetchOrdersInBatches', () => {
    it('deve retornar batches de pedidos até atingir o limite de 500 pedidos', async () => {
      const ordersBatch1 = [
        createMockOrder({ id: 1, total_price: '100.00' }),
        createMockOrder({ id: 2, total_price: '200.00' }),
      ];
      
      const ordersBatch2 = [
        createMockOrder({ id: 3, total_price: '300.00' }),
        createMockOrder({ id: 4, total_price: '400.00' }),
      ];

      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { orders: ordersBatch1 },
        headers: { link: '<next-page-url>; rel="next"' },
      });

      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { orders: ordersBatch2 },
        headers: { link: '' },
      });

      const orders = repository.fetchOrdersInBatches();

      const result1 = await orders.next();
      expect(result1.value).toEqual(ordersBatch1);

      const result2 = await orders.next();
      expect(result2.value).toEqual(ordersBatch2);

      const result3 = await orders.next();
      expect(result3.done).toBe(true);
    });

    it('deve parar o fetch se o total de pedidos exceder o limite de 500', async () => {
      const ordersBatch: ShopifyOrderDTO[] = new Array(600).fill({ id: '1', total_price: '100' });

      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { orders: ordersBatch },
        headers: { link: '' },
      });

      const orders = repository.fetchOrdersInBatches();
      const result = await orders.next();

      expect(result.value.length).toEqual(500);

      const doneResult = await orders.next();
      expect(doneResult.done).toBe(true);
    });
  });
});
