import { ShopifyPort } from '../../ports/input/ShopifyPort';
import { DatabasePort } from '../../ports/output/DatabasePort';
import { SyncProductsUseCase } from '../../usecases/SyncProductsUseCase';
import { Product } from '../entities/Product';

export class ProductService implements SyncProductsUseCase {
  constructor(
    private ShopifyPort: ShopifyPort,
    private DatabasePort: DatabasePort
  ) {}

  async execute() {
    // Loop for processing batch return from the generator function
    for await (const productsBatch of this.ShopifyPort.fetchProductsInBatches()) {
      await this.storeProducts(productsBatch);
    }
  }

  async storeProducts(products: Product[]): Promise<void> {
    // Persistence
    await this.DatabasePort.storeProducts(products);
  }
}