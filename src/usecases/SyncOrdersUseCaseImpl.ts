import { inject, injectable } from 'tsyringe';
import { ShopifyOrderDTO } from '../adapters/input/shopify/dto/ShopifyOrderDTO';
import { InputPort } from '../ports/input/InputPort';
import { OutputPort } from '../ports/output/OutputPort';
import { SyncOrdersUseCase } from '../usecases/interfaces/SyncOrdersUseCase';

@injectable()
export class SyncOrdersUseCaseImpl implements SyncOrdersUseCase {
  
  constructor(
    @inject('InputPort') private inputPort: InputPort,
    @inject('OutputPort') private outputPort: OutputPort
  ) {}

  async *execute(): AsyncGenerator<void> {
    // Loop for processing batch return from the generator function
    for await (const ordersBatch of this.inputPort.fetchOrdersInBatches()) {
      yield await this.storeOrders(ordersBatch);
    }
  }

  async storeOrders(orders: ShopifyOrderDTO[]): Promise<void> {
    return await this.outputPort.storeOrders(orders);
  }
}
