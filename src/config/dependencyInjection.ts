import { container } from 'tsyringe';
import { ShopifyProductRepository } from '../adapters/input/shopify/ShopifyProductRepository';
import { DatabaseRepository } from '../adapters/output/db/DatabaseRepository';
import { InputPort } from '../ports/input/InputPort';
import { OutputPort } from '../ports/output/OutputPort';
import { SyncProductsUseCase } from '../usecases/interfaces/SyncProductsUseCase';
import { SyncProductsUseCaseImpl } from '../usecases/SyncProductsUseCaseImpl';

export function setupDependencyInjection() {
    // Registrar as dependências no container do tsyringe
    container.register<InputPort>('InputPort', {
        useClass: ShopifyProductRepository
    });

    container.register<OutputPort>('OutputPort', {
        useClass: DatabaseRepository
    });

    container.register<SyncProductsUseCase>('SyncProductsUseCase', {
        useClass: SyncProductsUseCaseImpl
    });
}