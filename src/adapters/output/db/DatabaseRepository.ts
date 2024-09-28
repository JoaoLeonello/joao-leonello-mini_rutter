import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/typeOrmConfig';
import { Product as DomainProduct } from '../../../domain/entities/Product';
import { OutputPort } from "../../../ports/output/OutputPort";
import { Product as DbProduct } from "./entities/Product";


export class DatabaseRepository implements OutputPort {
    private repository: Repository<DbProduct>;

    constructor() {
        this.repository = AppDataSource.getRepository(DbProduct);
    }

    async storeProducts(domainProducts: DomainProduct[]): Promise<DomainProduct[]> {
        // Convert domain entities to db entities
        const dbProducts = domainProducts.map(domainProduct => {
            const dbProduct = new DbProduct(domainProduct.id, domainProduct.platformId, domainProduct.name);
            return dbProduct;
        });

        const savedProducts = await this.repository.save(dbProducts);

        // Convert return db entities to domain entities again
        return savedProducts.map(sp => new DomainProduct(sp.id, sp.platform_id, sp.name));
    }
}