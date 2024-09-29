import { Product } from '../../domain/entities/Product';

export interface GetProductsUseCase {
    execute(): Promise<Product[]>;
}