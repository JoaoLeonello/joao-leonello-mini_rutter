import { Order } from 'domain/entities/Order';
import { ShopifyOrder } from './../../adapters/output/db/entities/ShopifyOrder';

export interface GetOrdersUseCase {
    execute(): Promise<Order[]>;
    toDomain(shopifyOrder: ShopifyOrder): Order;
}