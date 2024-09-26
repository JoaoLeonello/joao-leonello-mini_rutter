import { Order } from '../entities/Order';
import { OrderRepository } from '../ports/OrderRepository';

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async fetchAndStoreOrders(orders: Order[]): Promise<void> {
    // Lógica de persistência de pedidos
    await this.orderRepository.saveOrders(orders);
  }
}