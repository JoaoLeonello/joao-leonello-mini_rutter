import { injectable } from 'tsyringe';
import { DatabaseRepository } from '../adapters/output/db/DatabaseRepository';
import { Order } from '../domain/entities/Order';
import { GetOrdersUseCase } from '../usecases/interfaces/GetOrdersUseCase';

@injectable()
export class GetOrdersUseCaseImpl implements GetOrdersUseCase {
  
  constructor(
    private databaseRepository: DatabaseRepository
  ) {}

  async execute(): Promise<Order[]> {
    return await this.databaseRepository.getOrders()
  }
}
