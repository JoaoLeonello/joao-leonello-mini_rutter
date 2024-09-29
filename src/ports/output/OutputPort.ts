import { ShopifyOrderDTO } from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { ShopifyProductDTO } from "../../adapters/input/shopify/dto/ShopifyProductDTO";
import { Order } from "../../domain/entities/Order";

import { Product } from '../../domain/entities/Product';

export interface OutputPort {
    storeProducts(products: ShopifyProductDTO[]): Promise<void>;
    storeOrders(orders: ShopifyOrderDTO[]): Promise<void>;
    getProducts(): Promise<Product[]>;
    getOrders(): Promise<Order[]>;
}