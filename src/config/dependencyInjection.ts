import { container } from 'tsyringe';
import { ShopifyRepository } from '../adapters/input/shopify/ShopifyRepository';
import { DatabaseRepository } from '../adapters/output/db/DatabaseRepository';
import { ShopifyInputPort } from '../ports/input/InputPort';
import { OutputPort } from '../ports/output/OutputPort';
import { GetProductsUseCaseImpl } from '../usecases/GetProductsUseCaseImpl';
import { GetProductsUseCase } from '../usecases/interfaces/GetProductsUseCase';
import { SyncOrdersUseCase } from '../usecases/interfaces/SyncOrdersUseCase';
import { SyncProductsUseCase } from '../usecases/interfaces/SyncProductsUseCase';
import { SyncOrdersUseCaseImpl } from '../usecases/SyncOrdersUseCaseImpl';
import { SyncProductsUseCaseImpl } from '../usecases/SyncProductsUseCaseImpl';

export function setupDependencyInjection() {
    // Registrar as dependências no container do tsyringe
    container.register<ShopifyInputPort>('ShopifyInputPort', {
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

    container.register<GetProductsUseCase>('GetProductsUseCase', {
        useClass: GetProductsUseCaseImpl
    });

}