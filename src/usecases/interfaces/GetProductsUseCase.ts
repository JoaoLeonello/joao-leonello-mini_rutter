import { ShopifyProduct } from '@entities/ShopifyProduct';
import { Product } from '../../domain/entities/Product';

export interface GetProductsUseCase {
    execute(): Promise<Product[]>;
    toDomain(shopifyProduct: ShopifyProduct): Product;
}