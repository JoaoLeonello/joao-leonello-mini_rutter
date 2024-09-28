import { Request, Response } from 'express';
import { Controller, Get } from 'routing-controllers';
import { SyncProductsUseCaseImpl } from '../../../usecases/SyncProductsUseCaseImpl';

@Controller('/products')
export class ProductOrderController {
  constructor(private syncProductsUseCaseImpl: SyncProductsUseCaseImpl) {}

  @Get('/')
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      // const products = await this.syncProductsUseCaseImpl.getAllProducts();
      // res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
}