import { Product } from "../../domain/entities/Product";

export interface ShopifyPort {
  fetchProductsInBatches(): AsyncGenerator<Product[]>;
}