import { container } from 'tsyringe';
import { ShopifyRepository } from '../adapters/input/shopify/ShopifyRepository';
import { DatabaseRepository } from '../adapters/output/db/DatabaseRepository';
import { InputPort } from '../ports/input/InputPort';
import { OutputPort } from '../ports/output/OutputPort';
import { SyncOrdersUseCase } from '../usecases/interfaces/SyncOrdersUseCase';
import { SyncProductsUseCase } from '../usecases/interfaces/SyncProductsUseCase';
import { SyncOrdersUseCaseImpl } from '../usecases/SyncOrdersUseCaseImpl';
import { SyncProductsUseCaseImpl } from '../usecases/SyncProductsUseCaseImpl';

export function setupDependencyInjection() {
    // Registrar as dependências no container do tsyringe
    container.register<InputPort>('InputPort', {
        useClass: ShopifyRepository
    });

    container.register<OutputPort>('OutputPort', {
        useClass: DatabaseRepository
    });

    container.register<SyncProductsUseCase>('SyncProductsUseCase', {
        useClass: SyncProductsUseCaseImpl
    });

    container.register<SyncOrdersUseCase>('SyncOrdersUseCase', {
        useClass: SyncOrdersUseCaseImpl
    });

    
}