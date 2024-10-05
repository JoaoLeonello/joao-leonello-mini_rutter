import { ShopifyOrderDTO } from "../../adapters/input/shopify/dto/ShopifyOrderDTO";
import { ShopifyOrder } from './../../adapters/output/db/entities/ShopifyOrder';
import { ShopifyProduct } from './../../adapters/output/db/entities/ShopifyProduct';

import { Product } from '../../domain/entities/Product';
import { Order } from "domain/entities/Order";

export interface ShopifyProductsOutputPort {
    storeProducts(products: Product[]): Promise<void>;
    getProducts(): Promise<ShopifyProduct[]>;
}
  
export interface ShopifyOrdersOutputPort {
    storeOrders(orders: Order[]): Promise<void>;
    getOrders(): Promise<ShopifyOrder[]>;
}