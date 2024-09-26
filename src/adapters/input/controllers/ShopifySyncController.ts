import { Response } from 'express';
import { Controller, Get } from 'routing-controllers';
import { SyncOrdersUseCase } from '../../../usecases/SyncOrdersUseCase';
import { SyncProductsUseCase } from '../../../usecases/SyncProductsUseCase';


@Controller('/sync')
export class ShopifySyncController {
    constructor(
      private syncProductsUseCase: SyncProductsUseCase,
      private syncOrdersUseCase: SyncOrdersUseCase
    ) {}
  
    @Get('/products')
    async fetchAndStoreProducts(_: Response) {
      let test = this.syncProductsUseCase.execute();
    }
  
    @Get('/orders')
    async fetchAndStoreOrders(_: Response) {
      let test = this.syncOrdersUseCase.execute();
    }
  }