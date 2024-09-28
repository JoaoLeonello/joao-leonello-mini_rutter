// import { Product as DbProduct } from "../../adapters/output/db/entities/Product";
import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";

export interface OutputPort {
    storeProducts(products: ShopifyProductDTO[]): Promise<void>;
}