import { ClientDetailsDTO, LineItemDTO, MoneyDTO, MoneySetDTO, ShopifyOrderDTO, TaxLineDTO } from '../../adapters/input/shopify/dto/ShopifyOrderDTO';
import { ShopifyInputPort } from '../../ports/input/InputPort';
import { OutputPort } from '../../ports/output/OutputPort';
import { SyncOrdersUseCaseImpl } from '../SyncOrdersUseCaseImpl';

describe('SyncOrdersUseCaseImpl', () => {
  let syncOrdersUseCase: SyncOrdersUseCaseImpl;
  let inputPortMock: jest.Mocked<ShopifyInputPort>;
  let outputPortMock: jest.Mocked<OutputPort>;

  beforeEach(() => {
    inputPortMock = {
      fetchOrdersInBatches: jest.fn()
    } as unknown as jest.Mocked<ShopifyInputPort>;

    outputPortMock = {
      storeOrders: jest.fn()
    } as unknown as jest.Mocked<OutputPort>;

    syncOrdersUseCase = new SyncOrdersUseCaseImpl(inputPortMock, outputPortMock);
  });

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

  function createMockOrder2(overrides: Partial<ShopifyOrderDTO> = {}): ShopifyOrderDTO {
    return new ShopifyOrderDTO(
      overrides.id || 2,
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

  it('should fetch orders in batches and store each batch', async () => {
    const mockOrdersBatch1: ShopifyOrderDTO[] = [createMockOrder()];

    const mockOrdersBatch2: ShopifyOrderDTO[] = [createMockOrder2()];

    inputPortMock.fetchOrdersInBatches.mockReturnValue((async function* () {
      yield mockOrdersBatch1;
      yield mockOrdersBatch2;
    })());

    outputPortMock.storeOrders.mockResolvedValue();

    const generator = syncOrdersUseCase.execute();
    await generator.next();
    await generator.next();

    expect(inputPortMock.fetchOrdersInBatches).toHaveBeenCalled();

    expect(outputPortMock.storeOrders).toHaveBeenCalledWith(mockOrdersBatch1);
    expect(outputPortMock.storeOrders).toHaveBeenCalledWith(mockOrdersBatch2);
  });

  it('should propagate errors when fetching orders fails', async () => {
    const error = new Error('Failed to fetch orders');
    inputPortMock.fetchOrdersInBatches.mockReturnValue((async function* () {
      throw error;
    })());

    const generator = syncOrdersUseCase.execute();
    
    await expect(generator.next()).rejects.toThrow('Failed to fetch orders');
    expect(outputPortMock.storeOrders).not.toHaveBeenCalled(); 
  });

  it('should propagate errors when storing orders fails', async () => {
    // Mockando um batch de pedidos
    const mockOrdersBatch: ShopifyOrderDTO[] = [createMockOrder()];

    // Mock do inputPort para retornar um batch de pedidos
    inputPortMock.fetchOrdersInBatches.mockReturnValue((async function* () {
      yield mockOrdersBatch;
    })());

    // Mock do outputPort para lançar um erro
    const error = new Error('Failed to store orders');
    outputPortMock.storeOrders.mockRejectedValue(error);

    const generator = syncOrdersUseCase.execute();

    await expect(generator.next()).rejects.toThrow('Failed to store orders');
    expect(outputPortMock.storeOrders).toHaveBeenCalledWith(mockOrdersBatch);
  });
});
