// import { Product as DbProduct } from "../../adapters/output/db/entities/Product";
import { Product as DomainProduct } from "../../domain/entities/Product";

export interface OutputPort {
    storeProducts(products: DomainProduct[]): Promise<DomainProduct[]>;
}