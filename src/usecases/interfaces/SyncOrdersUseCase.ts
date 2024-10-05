import { Order } from "domain/entities/Order";

export interface SyncOrdersUseCase {
  execute(): AsyncGenerator<void | undefined>;
  storeOrders(orders: Order[]): Promise<void>;
}