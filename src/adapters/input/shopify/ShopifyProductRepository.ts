
import { InputPort } from "../../../ports/input/InputPort";
import { ShopifyProductDTO } from "./dto/ShopifyProductDTO";
import { shopifyApi } from "./dto/ShopifyProductRequest";

export class ShopifyProductRepository implements InputPort {
  private shopifyUrl: string = "/products.json";

  async *fetchProductsInBatches(): AsyncGenerator<ShopifyProductDTO[]> {
    let nextPageUrl: string | null = this.shopifyUrl;

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
}