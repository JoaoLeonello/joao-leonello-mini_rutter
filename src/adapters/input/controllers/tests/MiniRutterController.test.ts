import 'reflect-metadata';
import { HttpError } from 'routing-controllers';
import { Order } from '../../../../domain/entities/Order';
import { Product } from '../../../../domain/entities/Product';
import { GetOrdersUseCaseImpl } from '../../../../usecases/GetOrdersUseCaseImpl';
import { GetProductsUseCaseImpl } from '../../../../usecases/GetProductsUseCaseImpl';
import { MiniRutterController } from '../MiniRutterController';

// Mock dos casos de uso
const mockGetProductsUseCase = {
  execute: jest.fn(),
};
const mockGetOrdersUseCase = {
  execute: jest.fn(),
};

describe('MiniRutterController', () => {
  let controller: MiniRutterController;

  beforeEach(() => {
    controller = new MiniRutterController(
      mockGetProductsUseCase as unknown as GetProductsUseCaseImpl,
      mockGetOrdersUseCase as unknown as GetOrdersUseCaseImpl
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('getProducts', () => {
    it('deve retornar uma lista de produtos', async () => {
      const products: Product[] = [
        new Product(undefined, '1', 'Product 1'),
        new Product(undefined, '2', 'Product 2')
      ];
      mockGetProductsUseCase.execute.mockResolvedValue(products);

      const result = await controller.getProducts(null as any);

      // Verificando o resultado
      expect(result).toEqual(products);
      expect(mockGetProductsUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('deve lançar HttpError 500 em caso de erro', async () => {
      // Simulando erro no caso de uso
      mockGetProductsUseCase.execute.mockRejectedValue(new Error('Erro no caso de uso'));

      await expect(controller.getProducts(null as any)).rejects.toThrow(HttpError);
      await expect(controller.getProducts(null as any)).rejects.toThrow('Internal server error');
    });
  });

  describe('getOrders', () => {
    it('deve retornar uma lista de pedidos', async () => {
      // Mock do retorno esperado
      const orders: Order[] = [
        new Order('1', undefined, undefined),
        new Order('2', undefined, undefined)
      ];
      mockGetOrdersUseCase.execute.mockResolvedValue(orders);

      // Chamando o método do controller
      const result = await controller.getOrders(null as any);

      // Verificando o resultado
      expect(result).toEqual(orders);
      expect(mockGetOrdersUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('deve lançar HttpError 500 em caso de erro', async () => {
      // Simulando erro no caso de uso
      mockGetOrdersUseCase.execute.mockRejectedValue(new Error('Erro no caso de uso'));

      await expect(controller.getOrders(null as any)).rejects.toThrow(HttpError);
      await expect(controller.getOrders(null as any)).rejects.toThrow('Internal server error');
    });
  });
});
