import { Product } from "../../../domain/entities/Product";
import { DatabasePort } from "../../../ports/output/DatabasePort";

export class DatabaseRepository implements DatabasePort {


    async storeProducts(productBatch: Product[]): Promise<void> {
        
    }
}