import { ShopifyOrderDTO } from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";

import { Product } from '../../domain/entities/Product';

export interface ShopifyProductsInputPort {
  fetchProductsInBatches(): AsyncGenerator<ShopifyProductDTO[]>;
}

export interface ShopifyOrdersInputPort {
  fetchOrdersInBatches(): AsyncGenerator<ShopifyOrderDTO[]>;
}