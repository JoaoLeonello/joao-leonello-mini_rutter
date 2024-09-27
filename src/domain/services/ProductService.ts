import { inject, injectable } from 'tsyringe';
import { ShopifyPort } from '../../ports/input/ShopifyPort';
import { DatabasePort } from '../../ports/output/DatabasePort';
import { SyncProductsUseCase } from '../../usecases/SyncProductsUseCase';
import { Product } from '../entities/Product';

@injectable()
export class ProductService implements SyncProductsUseCase {
  
  constructor(
    @inject('ShopifyPort') private shopifyPort: ShopifyPort,
    @inject('DatabasePort') private databasePort: DatabasePort
  ) {}

  async execute() {
    // Loop for processing batch return from the generator function
    for await (const productsBatch of this.shopifyPort.fetchProductsInBatches()) {
      await this.storeProducts(productsBatch);
    }
  }

  async storeProducts(products: Product[]): Promise<void> {
    // Persistence
    await this.databasePort.storeProducts(products);
  }
}
