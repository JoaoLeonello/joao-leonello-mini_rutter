import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";

export interface InputPort {
  fetchProductsInBatches(): AsyncGenerator<ShopifyProductDTO[]>;
}