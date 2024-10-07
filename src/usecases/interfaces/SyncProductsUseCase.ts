import { Product } from "domain/entities/Product";

export interface SyncProductsUseCase {
  execute(): AsyncGenerator<void | undefined>;
  storeProducts(products: Product[]): Promise<void>;
}
