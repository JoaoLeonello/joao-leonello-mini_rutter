import { container } from "tsyringe";
import { ShopifyOrdersRepository } from "../adapters/input/shopify/ShopifyOrdersRepository";
import { ShopifyProductRepository } from "../adapters/input/shopify/ShopifyProductRepository";
import { OrderRepository } from "../adapters/output/db/OrderRepository";
import { ProductRepository } from "../adapters/output/db/ProductRepository";
import {
  ShopifyOrdersInputPort,
  ShopifyProductsInputPort,
} from "../ports/input/InputPort";
import { GetOrdersUseCaseImpl } from "../usecases/GetOrdersUseCaseImpl";
import { GetProductsUseCaseImpl } from "../usecases/GetProductsUseCaseImpl";
import { GetOrdersUseCase } from "../usecases/interfaces/GetOrdersUseCase";
import { GetProductsUseCase } from "../usecases/interfaces/GetProductsUseCase";
import { SyncOrdersUseCase } from "../usecases/interfaces/SyncOrdersUseCase";
import { SyncProductsUseCase } from "../usecases/interfaces/SyncProductsUseCase";
import { SyncOrdersUseCaseImpl } from "../usecases/SyncOrdersUseCaseImpl";
import { SyncProductsUseCaseImpl } from "../usecases/SyncProductsUseCaseImpl";

export function setupDependencyInjection() {
  container.register<ShopifyProductsInputPort>("ShopifyProductsInputPort", {
    useClass: ShopifyProductRepository,
  });

  container.register<ShopifyOrdersInputPort>("ShopifyOrdersInputPort", {
    useClass: ShopifyOrdersRepository,
  });

  container.register<ProductRepository>("ShopifyProductsOutputPort", {
    useClass: ProductRepository,
  });

  container.register<OrderRepository>("ShopifyOrdersOutputPort", {
    useClass: OrderRepository,
  });

  container.register<SyncProductsUseCase>("SyncProductsUseCase", {
    useClass: SyncProductsUseCaseImpl,
  });

  container.register<SyncOrdersUseCase>("SyncOrdersUseCase", {
    useClass: SyncOrdersUseCaseImpl,
  });

  container.register<GetProductsUseCase>("GetProductsUseCase", {
    useClass: GetProductsUseCaseImpl,
  });

  container.register<GetOrdersUseCase>("GetOrdersUseCase", {
    useClass: GetOrdersUseCaseImpl,
  });
}
