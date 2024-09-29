import { Controller, Get, HttpError } from 'routing-controllers';
import { inject, injectable } from 'tsyringe';
import { Product } from '../../../domain/entities/Product';
import { GetProductsUseCase } from '../../../usecases/interfaces/GetProductsUseCase';

@injectable()
@Controller('/v1/mini-rutter')
export class MiniRutterController {
    constructor(
        @inject('GetProductsUseCase') private getProductsUseCase: GetProductsUseCase
      ) {}

      
      @Get('/products')
      async getProducts(_: Response): Promise<Product[]> {
          try {
              return await this.getProductsUseCase.execute();
          } catch (error) {
              console.error('Error getting products:', error);
              throw new HttpError(500, 'Internal server error');
          }
      }

}