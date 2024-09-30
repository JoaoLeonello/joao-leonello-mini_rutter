import { Controller, Get, HttpError } from 'routing-controllers';
import { inject, injectable } from 'tsyringe';
import { SyncOrdersUseCase } from '../../../usecases/interfaces/SyncOrdersUseCase';
import { SyncProductsUseCase } from '../../../usecases/interfaces/SyncProductsUseCase';

@injectable()
@Controller('/v1/sync')
export class ShopifySyncController {
    

    constructor(
      @inject('SyncProductsUseCase') private syncProductsUseCase: SyncProductsUseCase,
      @inject('SyncOrdersUseCase') private syncOrdersUseCase: SyncOrdersUseCase
    ) {}
  
    @Get('/products')
    async fetchAndStoreProducts(_: Response) {
        try {
            const results = [];
            
            for await (const batch of this.syncProductsUseCase.execute()) {
                results.push(batch);  
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
  
    @Get('/orders')
    async fetchAndStoreOrders(_: Response) {
        try {
            const results = [];

            for await (const batch of this.syncOrdersUseCase.execute()) {
                results.push(batch);
            }
    
            return {
                status: 200,
                message: 'Orders processed successfully'
            };
        } catch (error) {
            console.error('Error processing orders:', error);
            throw new HttpError(500, 'Internal server error');
        }
    }
  }