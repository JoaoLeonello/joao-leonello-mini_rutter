import { EntityManager } from 'typeorm';
import { AppDataSource } from '../../../config/typeOrmConfig';
import { OutputPort } from "../../../ports/output/OutputPort";
import { ShopifyProductDTO } from '../../input/shopify/dto/ShopifyProductDTO';
import { ShopifyProduct } from './entities/ShopifyProduct';


export class DatabaseRepository implements OutputPort {
    async storeProducts(shopifyProductBatch: ShopifyProductDTO[]): Promise<void> {
        try {
            let shopifyProductDbBatch: ShopifyProduct[] = this.mapShopifyProductDTOToShopifyProduct(shopifyProductBatch);

            // Transaction to ensure atomic processing
            return await AppDataSource.transaction(async (entityManager: EntityManager) => {
                await entityManager.save(shopifyProductDbBatch);
            })        
        } catch (error) {
            console.error("Error on saving products:", error);
            throw new Error("Error on saving products on database.");
        }
    }

    mapShopifyProductDTOToShopifyProduct(shopifyProductBatch: ShopifyProductDTO[]) {
        return shopifyProductBatch.map(dto => {
            return new ShopifyProduct(
                dto.id,
                dto.title,
                dto.body_html,
                dto.vendor,
                dto.product_type,
                new Date(dto.created_at),
                new Date(dto.updated_at),
                dto.status,
                dto.published_at ? new Date(dto.published_at) : null,
                null, // template_suffix não está presente no DTO
                null, // published_scope não está presente no DTO
                dto.tags,
                dto.admin_graphql_api_id
            );
        });
    }
}