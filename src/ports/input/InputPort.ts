import { ShopifyOrderDTO } from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";

import { Product } from '../../domain/entities/Product';

export interface ShopifyInputPort {
  fetchProductsInBatches(): AsyncGenerator<ShopifyProductDTO[]>;
  fetchOrdersInBatches(): AsyncGenerator<ShopifyOrderDTO[]>
}