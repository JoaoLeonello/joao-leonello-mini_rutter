import { inject, injectable } from "tsyringe";
import { ShopifyProductDTO } from "../adapters/input/shopify/dto/ShopifyProductDTO";
import { Product } from "../domain/entities/Product";
import { ShopifyProductsInputPort } from "../ports/input/InputPort";
import { ShopifyProductsOutputPort } from "../ports/output/OutputPort";
import { SyncProductsUseCase } from "../usecases/interfaces/SyncProductsUseCase";

@injectable()
export class SyncProductsUseCaseImpl implements SyncProductsUseCase {
  constructor(
    @inject("ShopifyProductsInputPort")
    private inputPort: ShopifyProductsInputPort,
    @inject("ShopifyProductsOutputPort")
    private outputPort: ShopifyProductsOutputPort,
  ) {}

  async *execute(): AsyncGenerator<void> {
    // Loop for processing batch return from the generator function
    for await (const productsBatch of this.inputPort.fetchProductsInBatches()) {
      let products = productsBatch.map((product: ShopifyProductDTO) =>
        this.toDomain(product),
      );
      yield await this.storeProducts(products);
    }
  }

  async storeProducts(products: Product[]): Promise<void> {
    return await this.outputPort.storeProducts(products);
  }

  toDomain(shopifyProductDTO: ShopifyProductDTO): Product {
    return new Product(
      undefined,
      shopifyProductDTO.id, // platformId mapped from shopify
      shopifyProductDTO.handle,
      shopifyProductDTO.title,
      shopifyProductDTO.body_html,
      shopifyProductDTO.vendor,
      shopifyProductDTO.product_type,
      new Date(shopifyProductDTO.created_at),
      new Date(shopifyProductDTO.updated_at),
      shopifyProductDTO.status,
      shopifyProductDTO.published_at
        ? new Date(shopifyProductDTO.published_at)
        : null,
      shopifyProductDTO.template_suffix,
      shopifyProductDTO.published_scope,
      shopifyProductDTO.tags,
      shopifyProductDTO.admin_graphql_api_id,
    );
  }
}
