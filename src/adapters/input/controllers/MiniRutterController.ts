import { Controller, Get, HttpError } from "routing-controllers";
import { inject, injectable } from "tsyringe";
import logger from "../../../config/logger";
import { Order } from "../../../domain/entities/Order";
import { Product } from "../../../domain/entities/Product";
import { GetOrdersUseCase } from "../../../usecases/interfaces/GetOrdersUseCase";
import { GetProductsUseCase } from "../../../usecases/interfaces/GetProductsUseCase";

@injectable()
@Controller("/v1/mini-rutter")
export class MiniRutterController {
  constructor(
    @inject("GetProductsUseCase")
    private getProductsUseCase: GetProductsUseCase,
    @inject("GetOrdersUseCase") 
    private getOrdersUseCase: GetOrdersUseCase,
  ) {}

  @Get("/products")
  async getProducts(_: Response): Promise<Product[]> {
    console.log("chegou aqui***********************************")
    try {
      return await this.getProductsUseCase.execute();
    } catch (error) {
      console.error("Error getting products:", error);
      logger.error(`Error getting products`, { error });
      throw new HttpError(500, "Internal server error");
    }
  }

  @Get("/orders")
  async getOrders(_: Response): Promise<Order[]> {
    try {
      return await this.getOrdersUseCase.execute();
    } catch (error) {
      console.error("Error getting orders:", error);
      logger.error(`Error getting orders`, { error });
      throw new HttpError(500, "Internal server error");
    }
  }
}
