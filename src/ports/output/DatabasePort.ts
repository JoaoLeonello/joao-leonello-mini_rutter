import { Product } from "../../domain/entities/Product";

export interface DatabasePort {
    storeProducts(products: Product[]): Promise<void>;
}