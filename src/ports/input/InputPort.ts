import { Product } from "../../domain/entities/Product";

export interface InputPort {
  fetchProductsInBatches(): AsyncGenerator<Product[]>;
}