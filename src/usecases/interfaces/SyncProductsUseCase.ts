import { Product } from "../../domain/entities/Product";

export interface SyncProductsUseCase {
  execute(): AsyncGenerator<Product[] | undefined>;
}