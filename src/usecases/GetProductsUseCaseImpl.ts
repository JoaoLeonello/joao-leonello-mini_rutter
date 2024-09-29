import { injectable } from 'tsyringe';
import { DatabaseRepository } from '../adapters/output/db/DatabaseRepository';
import { Product } from '../domain/entities/Product';
import { GetProductsUseCase } from '../usecases/interfaces/GetProductsUseCase';

@injectable()
export class GetProductsUseCaseImpl implements GetProductsUseCase {
  
  constructor(
    private databaseRepository: DatabaseRepository
  ) {}

  async execute(): Promise<Product[]> {
    return await this.databaseRepository.getProducts()
  }
}
