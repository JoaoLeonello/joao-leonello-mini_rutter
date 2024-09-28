import { inject, injectable } from 'tsyringe';
import { Product } from '../domain/entities/Product';
import { InputPort } from '../ports/input/InputPort';
import { OutputPort } from '../ports/output/OutputPort';
import { SyncProductsUseCase } from '../usecases/interfaces/SyncProductsUseCase';

@injectable()
export class SyncProductsUseCaseImpl implements SyncProductsUseCase {
  
  constructor(
    @inject('InputPort') private inputPort: InputPort,
    @inject('OutputPort') private outputPort: OutputPort
  ) {}

  async *execute(): AsyncGenerator<Product[]> {
    // Loop for processing batch return from the generator function
    for await (const productsBatch of this.inputPort.fetchProductsInBatches()) {
      yield await this.storeProducts(productsBatch);
    }
  }

  async storeProducts(products: Product[]): Promise<Product[]> {
    return await this.outputPort.storeProducts(products);
  }
}
