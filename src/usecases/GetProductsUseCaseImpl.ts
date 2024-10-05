import { ShopifyProduct } from './../adapters/output/db/entities/ShopifyProduct';
import { ProductRepository } from 'adapters/output/db/ProductRepository';
import { injectable } from 'tsyringe';
import { Product } from '../domain/entities/Product';
import { GetProductsUseCase } from '../usecases/interfaces/GetProductsUseCase';

@injectable()
export class GetProductsUseCaseImpl implements GetProductsUseCase {
  
  constructor(
    private productRepository: ProductRepository
  ) {}

  async execute(): Promise<Product[]> {
    let products = await this.productRepository.getProducts()
    return products.map((product: ShopifyProduct) => this.toDomain(product));
  }

  toDomain(shopifyProduct: ShopifyProduct): Product {
    return new Product(
      shopifyProduct.id,
      shopifyProduct.platform_id,
      shopifyProduct.name,
      shopifyProduct.title,
      shopifyProduct.body_html,
      shopifyProduct.vendor,
      shopifyProduct.product_type,
      new Date(shopifyProduct.created_at),
      new Date(shopifyProduct.updated_at),
      shopifyProduct.status,
      shopifyProduct.published_at ? new Date(shopifyProduct.published_at) : null,
      shopifyProduct.template_suffix,
      shopifyProduct.published_scope,
      shopifyProduct.tags,
      shopifyProduct.admin_graphql_api_id
    );
  }
}
