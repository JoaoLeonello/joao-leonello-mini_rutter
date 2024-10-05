import { EntityManager, In } from 'typeorm';
import { AppDataSource } from '../../../config/typeOrmConfig';
import { ShopifyProductsOutputPort } from "../../../ports/output/OutputPort";
import { Product } from './../../../domain/entities/Product';
import { ShopifyProduct } from './entities/ShopifyProduct';


export class ProductRepository implements ShopifyProductsOutputPort {
    async storeProducts(productBatch: Product[]): Promise<void> {
        let productsToSave = [];
        const shopifyProductRepository = AppDataSource.getRepository(ShopifyProduct);
        const existingProducts = await shopifyProductRepository.find({ where: { platform_id: In(productBatch.map((product: Product) => product.platformId)) }});
        let existingProductsMap = new Map<string, ShopifyProduct>(
            existingProducts.map((product: ShopifyProduct) => [String(product.platform_id || 'null'), product])
        );

        for (let product of productBatch) {
            const existingProduct = existingProductsMap.get(String(product.platformId));
            
            if (existingProduct) {
                // Update existing product properties
                existingProduct.platform_id = product.platformId;
                existingProduct.name = product.name;
                existingProduct.title = product.title;
                existingProduct.body_html = product.bodyHtml;
                existingProduct.vendor = product.vendor;
                existingProduct.product_type = product.productType;
                existingProduct.created_at = product.createdAt;
                existingProduct.updated_at = product.updatedAt;
                existingProduct.status = product.status;
                existingProduct.published_at = product.publishedAt;
                existingProduct.template_suffix = product.templateSuffix;
                existingProduct.published_scope = product.publishedScope;
                existingProduct.tags = product.tags;
                existingProduct.admin_graphql_api_id = product.adminGraphqlApiId;

                productsToSave.push(existingProduct);
            } else {
                // Insert new product
                let newProduct = new ShopifyProduct(
                    product.id,
                    product.platformId,
                    product.name,
                    product.title,
                    product.bodyHtml,
                    product.vendor,
                    product.productType,
                    product.createdAt,
                    product.updatedAt,
                    product.status,
                    product.publishedAt,
                    product.templateSuffix,
                    product.publishedScope,
                    product.tags,
                    product.adminGraphqlApiId
                );

                productsToSave.push(newProduct);
            }
        }

        try {
            // Transaction to ensure atomic processing
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {
                await entityManager.save(productsToSave);
            });
        } catch (error) {
            console.error("Error on saving products:", error);
            throw new Error("Error on saving products on database.");
        }
    }

    async getProducts(): Promise<ShopifyProduct[]> {
        return await AppDataSource.manager
            .getRepository(ShopifyProduct)
            .createQueryBuilder('shopify_product')
            .select(['shopify_product.id', 'shopify_product.platform_id', 'shopify_product.name'])
            .getMany();
    }
}