import { injectable } from "tsyringe";
import { Product } from "../domain/entities/Product";
import { GetProductsUseCase } from "../usecases/interfaces/GetProductsUseCase";
import { ShopifyProduct } from "./../adapters/output/db/entities/ShopifyProduct";
import { ProductRepository } from "./../adapters/output/db/ProductRepository";

@injectable()
export class GetProductsUseCaseImpl implements GetProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    let products = await this.productRepository.getProducts();
    let productsDomain = products.map((product: ShopifyProduct) =>
      this.toDomain(product),
    );
    return productsDomain.map((product: Product) =>
      this.filterFields(product, ["_id", "_platformId", "_title"]),
    );
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
      shopifyProduct.published_at
        ? new Date(shopifyProduct.published_at)
        : null,
      shopifyProduct.template_suffix,
      shopifyProduct.published_scope,
      shopifyProduct.tags,
      shopifyProduct.admin_graphql_api_id,
    );
  }

  filterFields(obj: any, fields: string[]): any {
    return Object.keys(obj)
      .filter((key) => fields.includes(key))
      .reduce((result: Record<string, any>, key) => {
        let newKey = key.startsWith("_") ? key.substring(1) : key;

        if (newKey === "title") {
          newKey = "name";
        }

        result[newKey] = obj[key];
        return result;
      }, {});
  }
}
