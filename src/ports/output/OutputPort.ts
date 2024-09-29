import { ShopifyOrderDTO } from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";

export interface OutputPort {
    storeProducts(products: ShopifyProductDTO[]): Promise<void>;
    storeOrders(orders: ShopifyOrderDTO[]): Promise<void>;
}