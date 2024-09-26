
import { Product } from "../../../domain/entities/Product";
import { ShopifyPort } from "../../../ports/input/ShopifyPort";
import { shopifyApi } from "./dto/ShopifyProductRequest";

export class ShopifyProductRepository implements ShopifyPort {
  private shopifyUrl: string = "https://shopify.api/products";

  async *fetchProductsInBatches(): AsyncGenerator<Product[]> {
    let nextPageUrl: string | null = this.shopifyUrl;

    while (nextPageUrl) {
      let productsBatch: Product[] = [];
      const response = await shopifyApi.get(nextPageUrl);

      //  Mapping response to domain entity
      productsBatch = response.data.products.map((productData: any) => 
        new Product(productData.GENERATE_ID, productData.id, productData.title)
      );

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