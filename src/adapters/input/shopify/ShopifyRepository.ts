
import { InputPort } from "../../../ports/input/InputPort";
import { ShopifyOrderDTO } from "./dto/ShopifyOrderDTO";
import { ShopifyProductDTO } from "./dto/ShopifyProductDTO";
import { shopifyApi } from "./dto/ShopifyProductRequest";

export class ShopifyRepository implements InputPort {
  private shopifyProductUrl: string = "/products.json";
  private shopifyOrderUrl: string = "/orders.json";
  private totalOrdersFetched = 0;
  private maxOrders = 500;

  async *fetchProductsInBatches(): AsyncGenerator<ShopifyProductDTO[]> {
    let nextPageUrl: string | null = this.shopifyProductUrl;

    while (nextPageUrl) {
      let productsBatch: ShopifyProductDTO[] = [];
      const response: any = await shopifyApi.get(nextPageUrl);

      // Populate with data from Shopify API
      productsBatch = response.data.products as ShopifyProductDTO[];

      // Verify header link
      const linkHeader = response.headers['link'];
      if (linkHeader && linkHeader.includes('rel="next"')) {
        // Extract url for next page
        const nextLink = linkHeader.split(',').find((s: string) => s.includes('rel="next"'));
        if (nextLink) {
          nextPageUrl = nextLink.match(/<(.*?)>/)?.[1] || null;
        }
      } else {
        // If there is not next page, stop the loop
        nextPageUrl = null;
      }

      // Return product batch
      yield productsBatch;
    }
  }

  async *fetchOrdersInBatches(): AsyncGenerator<ShopifyOrderDTO[]> {
    let nextPageUrl: string | null = this.shopifyOrderUrl;

    while (nextPageUrl && this.totalOrdersFetched < this.maxOrders) {
      let ordersBatch: ShopifyOrderDTO[] = [];
      const response: any = await shopifyApi.get(nextPageUrl);

      // Populate with data from Shopify API
      ordersBatch = response.data.orders as ShopifyOrderDTO[];

      // Update counter
      this.totalOrdersFetched += ordersBatch.length;

      if (this.totalOrdersFetched > this.maxOrders) {
        const remainingOrders = this.maxOrders - (this.totalOrdersFetched - ordersBatch.length);
        ordersBatch = ordersBatch.slice(0, remainingOrders);
      } else {
        ordersBatch = ordersBatch;
      }

      // Return product batch
      yield ordersBatch;

      // Verify header link
      const linkHeader = response.headers['link'];
      if (linkHeader && linkHeader.includes('rel="next"')) {
        // Extract url for next page
        const nextLink = linkHeader.split(',').find((s: string) => s.includes('rel="next"'));
        if (nextLink) {
          nextPageUrl = nextLink.match(/<(.*?)>/)?.[1] || null;
        }
      } else {
        // If there is not next page, stop the loop
        nextPageUrl = null;
      }
    }
  }
}