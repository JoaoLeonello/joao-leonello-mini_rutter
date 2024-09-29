import { inject, injectable } from 'tsyringe';
import { ShopifyProductDTO } from '../adapters/input/shopify/dto/ShopifyProductDTO';
import { ShopifyInputPort } from '../ports/input/InputPort';
import { OutputPort } from '../ports/output/OutputPort';
import { SyncProductsUseCase } from '../usecases/interfaces/SyncProductsUseCase';

@injectable()
export class SyncProductsUseCaseImpl implements SyncProductsUseCase {
  
  constructor(
    @inject('ShopifyInputPort') private inputPort: ShopifyInputPort,
    @inject('OutputPort') private outputPort: OutputPort
  ) {}

  async *execute(): AsyncGenerator<void> {
    // Loop for processing batch return from the generator function
    for await (const productsBatch of this.inputPort.fetchProductsInBatches()) {
      yield await this.storeProducts(productsBatch);
    }
  }

  async storeProducts(products: ShopifyProductDTO[]): Promise<void> {
    return await this.outputPort.storeProducts(products);
  }
}
