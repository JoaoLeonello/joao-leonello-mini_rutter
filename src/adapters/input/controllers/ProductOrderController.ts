import { Request, Response } from 'express';
import { Controller, Get } from 'routing-controllers';
import { ProductService } from '../../../domain/services/ProductService';

@Controller('/products')
export class ProductOrderController {
  constructor(private productService: ProductService) {}

  @Get('/')
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      // const products = await this.productService.getAllProducts();
      // res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
}