import { Order } from '../../domain/entities/Order';

export interface GetOrdersUseCase {
    execute(): Promise<Order[]>;
}