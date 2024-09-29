import { ShopifyOrderDTO } from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";

export interface InputPort {
  fetchProductsInBatches(): AsyncGenerator<ShopifyProductDTO[]>;
  fetchOrdersInBatches(): AsyncGenerator<ShopifyOrderDTO[]>
}