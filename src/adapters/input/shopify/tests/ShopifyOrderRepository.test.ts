import { ShopifyOrdersRepository } from "../ShopifyOrdersRepository";
import { ShopifyOrderDTO } from "../dto/ShopifyOrderDTO";
import { shopifyApi } from "../requests/ShopifyRequests";

// Mock dependencies
jest.mock("../requests/ShopifyRequests", () => ({
  shopifyApi: {
    get: jest.fn(),
  },
}));

describe("ShopifyOrdersRepository", () => {
  let shopifyOrdersRepository: ShopifyOrdersRepository;

  beforeEach(() => {
    shopifyOrdersRepository = new ShopifyOrdersRepository();
    jest.clearAllMocks();
  });

  describe("fetchOrdersInBatches", () => {
    it("should fetch orders in batches until maxOrders is reached", async () => {
      const mockOrdersBatch: Partial<ShopifyOrderDTO>[] = [
        {
          id: 1,
          closed_at: null,
          created_at: "2024-01-01",
          total_price: "100.00",
        },
      ];
      (shopifyApi.get as jest.Mock)
        .mockResolvedValueOnce({
          data: { orders: mockOrdersBatch },
          headers: { link: '<https://shopify.com/orders?page=2>; rel="next"' },
        })
        .mockResolvedValueOnce({
          data: { orders: [] },
          headers: { link: "" },
        });

      const ordersGenerator = shopifyOrdersRepository.fetchOrdersInBatches();
      const orders: ShopifyOrderDTO[] = [];
      for await (const batch of ordersGenerator) {
        orders.push(...batch);
      }

      expect(shopifyApi.get).toHaveBeenCalledTimes(2);
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe(1);
    });

    it("should stop fetching if there is no next page", async () => {
      const mockOrdersBatch: Partial<ShopifyOrderDTO>[] = [
        {
          id: 1,
          closed_at: null,
          created_at: "2024-01-01",
          total_price: "100.00",
        },
      ];
      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { orders: mockOrdersBatch },
        headers: { link: "" },
      });

      const ordersGenerator = shopifyOrdersRepository.fetchOrdersInBatches();
      const orders: ShopifyOrderDTO[] = [];
      for await (const batch of ordersGenerator) {
        orders.push(...batch);
      }

      expect(shopifyApi.get).toHaveBeenCalledTimes(1);
      expect(orders).toHaveLength(1);
      expect(orders[0].id).toBe(1);
    });

    it("should limit the number of orders fetched to maxOrders", async () => {
      const mockOrdersBatch: Partial<ShopifyOrderDTO>[] = Array.from(
        { length: 300 },
        (_, i) => ({
          id: i + 1,
          closed_at: null,
          created_at: "2024-01-01",
          total_price: "100.00",
          admin_graphql_api_id: "",
          app_id: null,
          browser_ip: null,
          buyer_accepts_marketing: false,
          cancel_reason: null,
          cancelled_at: null,
          cart_token: null,
          checkout_id: 1,
          checkout_token: "",
          client_details: null,
          company: null,
          confirmation_number: "",
          confirmed: false,
          currency: "",
          current_subtotal_price: "",
          current_subtotal_price_set: null,
          current_total_additional_fees_set: null,
          current_total_discounts: "",
          current_total_discounts_set: null,
          current_total_duties_set: null,
          current_total_price_set: null,
          current_total_tax_set: null,
          customer_locale: "",
          device_id: null,
          discount_codes: [],
          estimated_taxes: false,
          financial_status: "",
          fulfillment_status: null,
          landing_site: null,
          landing_site_ref: null,
          location_id: null,
          merchant_of_record_app_id: null,
          name: "",
          note: null,
          note_attributes: [],
          number: 0,
          order_number: 0,
          original_total_additional_fees_set: null,
          original_total_duties_set: null,
          payment_gateway_names: [],
          po_number: null,
          presentment_currency: "",
          processed_at: "",
          reference: null,
          referring_site: null,
          source_identifier: null,
          source_name: "",
          source_url: null,
          subtotal_price_set: null,
          tags: "",
          tax_exempt: false,
          tax_lines: [],
          taxes_included: false,
          test: false,
          token: "",
          total_discounts_set: null,
          total_line_items_price: "",
          total_line_items_price_set: null,
          total_outstanding: "",
          total_price_set: null,
          total_shipping_price_set: null,
          total_tax_set: null,
          total_tip_received: "",
          total_weight: 0,
          updated_at: null,
          user_id: null,
          billing_address: null,
          customer: null,
          discount_applications: [],
          fulfillments: [],
          line_items: [],
          payment_terms: null,
          refunds: [],
          shipping_address: null,
          shipping_lines: [],
        }),
      );
      (shopifyApi.get as jest.Mock).mockResolvedValue({
        data: { orders: mockOrdersBatch },
        headers: { link: '<https://shopify.com/orders?page=2>; rel="next"' },
      });

      const ordersGenerator = shopifyOrdersRepository.fetchOrdersInBatches();
      let totalOrdersFetched = 0;
      for await (const batch of ordersGenerator) {
        totalOrdersFetched += batch.length;
      }

      expect(totalOrdersFetched).toBeLessThanOrEqual(
        shopifyOrdersRepository["maxOrders"],
      );
    });

    it("should handle cases where there are no orders", async () => {
      (shopifyApi.get as jest.Mock).mockResolvedValueOnce({
        data: { orders: [] },
        headers: { link: "" },
      });

      const ordersGenerator = shopifyOrdersRepository.fetchOrdersInBatches();
      const orders: ShopifyOrderDTO[] = [];
      for await (const batch of ordersGenerator) {
        orders.push(...batch);
      }

      expect(shopifyApi.get).toHaveBeenCalledTimes(1);
      expect(orders).toHaveLength(0);
    });
  });
});
