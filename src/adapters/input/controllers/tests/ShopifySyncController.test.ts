import 'reflect-metadata';
import { HttpError } from 'routing-controllers';
import { SyncOrdersUseCase } from '../../../../usecases/interfaces/SyncOrdersUseCase';
import { SyncProductsUseCase } from '../../../../usecases/interfaces/SyncProductsUseCase';
import { ShopifySyncController } from '../ShopifySyncController';

const mockSyncProductsUseCase = {
  execute: jest.fn(),
};
const mockSyncOrdersUseCase = {
  execute: jest.fn(),
};

describe('ShopifySyncController', () => {
  let controller: ShopifySyncController;

  beforeEach(() => {
    controller = new ShopifySyncController(
      mockSyncProductsUseCase as unknown as SyncProductsUseCase,
      mockSyncOrdersUseCase as unknown as SyncOrdersUseCase
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAndStoreProducts', () => {
    it('should process products and return success', async () => {
      mockSyncProductsUseCase.execute.mockImplementation(async function* () {
        yield [{ id: 1, name: 'Product 1' }];
        yield [{ id: 2, name: 'Product 2' }];
      });

      const result = await controller.fetchAndStoreProducts(null as any);

      expect(result).toEqual({
        status: 200,
        message: 'Products processed successfully',
      });
      expect(mockSyncProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpError 500 on error', async () => {
      mockSyncProductsUseCase.execute.mockImplementation(async function* () {
        throw new Error('Erro no processamento');
      });

      await expect(controller.fetchAndStoreProducts(null as any)).rejects.toThrow(HttpError);
      await expect(controller.fetchAndStoreProducts(null as any)).rejects.toThrow('Internal server error');
    });
  });

  describe('fetchAndStoreOrders', () => {
    it('should return orders on success', async () => {
      mockSyncOrdersUseCase.execute.mockImplementation(async function* () {
        yield [{ id: 1, total: 100 }];
        yield [{ id: 2, total: 200 }];
      });

      const result = await controller.fetchAndStoreOrders(null as any);

      expect(result).toEqual({
        status: 200,
        message: 'Orders processed successfully',
      });
      expect(mockSyncOrdersUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return HttpError 500 on error', async () => {
        mockSyncOrdersUseCase.execute.mockImplementation(async function* () {
          throw new Error('Erro no processamento');
        });
  
        await expect(controller.fetchAndStoreOrders(null as any)).rejects.toThrow(HttpError);
        await expect(controller.fetchAndStoreOrders(null as any)).rejects.toThrow('Internal server error');
      });
    });
  });
