import { Controller, Get, HttpError } from 'routing-controllers';
// import { SyncOrdersUseCase } from '../../../usecases/SyncOrdersUseCase';
import { inject, injectable } from 'tsyringe';
import { SyncProductsUseCase } from '../../../usecases/interfaces/SyncProductsUseCase';

@injectable()
@Controller('/sync')
export class ShopifySyncController {
    

    constructor(
      @inject('SyncProductsUseCase') private syncProductsUseCase: SyncProductsUseCase
      // @Inject(SyncOrdersUseCaseToken) private syncOrdersUseCase: SyncOrdersUseCase
    ) {}
  
    @Get('/products')
    async fetchAndStoreProducts() {
        try {
            const results = [];
            
            // Iterarate over AsyncGenerator
            for await (const batch of this.syncProductsUseCase.execute()) {
                results.push(batch);  // Armazenar cada batch processado
            }
            
            if (results.length === 0) {
                throw new HttpError(404, 'No products found or processed.');
            }
    
            return {
                status: 200,
                message: 'Products processed successfully'
            };
        } catch (error) {
            console.error('Error processing products:', error);
            throw new HttpError(500, 'Internal server error');
        }
    }
  
    // @Get('/orders')
    // async fetchAndStoreOrders(_: Response) {
    //   let test = this.syncOrdersUseCase.execute();
    // }
  }