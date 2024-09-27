import { container } from 'tsyringe';
import { ShopifyProductRepository } from '../adapters/input/shopify/ShopifyProductRepository';
import { DatabaseRepository } from '../adapters/output/db/DatabaseRepository';
import { ProductService } from '../domain/services/ProductService';
import { ShopifyPort } from '../ports/input/ShopifyPort';
import { DatabasePort } from '../ports/output/DatabasePort';
import { SyncProductsUseCase } from '../usecases/SyncProductsUseCase';

export function setupDependencyInjection() {
    // Registrar as dependências no container do tsyringe
    container.register<ShopifyPort>('ShopifyPort', {
        useClass: ShopifyProductRepository
    });

    container.register<DatabasePort>('DatabasePort', {
        useClass: DatabaseRepository
    });

    container.register<SyncProductsUseCase>('SyncProductsUseCase', {
        useClass: ProductService
    });
}