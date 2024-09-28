import { Response } from 'express';
import { Controller, Get } from 'routing-controllers';
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
    async fetchAndStoreProducts(_: Response) {
      let test = this.syncProductsUseCase.execute();
    }
  
    // @Get('/orders')
    // async fetchAndStoreOrders(_: Response) {
    //   let test = this.syncOrdersUseCase.execute();
    // }
  }