import { DatabaseRepository } from '../../adapters/output/db/DatabaseRepository';
import { Order } from '../../domain/entities/Order';
import { GetOrdersUseCaseImpl } from '../GetOrdersUseCaseImpl';

describe('GetOrdersUseCaseImpl', () => {
  let getOrdersUseCase: GetOrdersUseCaseImpl;
  let databaseRepositoryMock: jest.Mocked<DatabaseRepository>;

  beforeEach(() => {
    databaseRepositoryMock = {
      getOrders: jest.fn(),
    } as unknown as jest.Mocked<DatabaseRepository>;

    getOrdersUseCase = new GetOrdersUseCaseImpl(databaseRepositoryMock);
  });

  it('should return orders from the repository', async () => {
    const mockOrders: Order[] = [new Order('order-1'), new Order('order-2')];
    databaseRepositoryMock.getOrders.mockResolvedValue(mockOrders);

    const result = await getOrdersUseCase.execute();

    expect(result).toEqual(mockOrders);
    expect(databaseRepositoryMock.getOrders).toHaveBeenCalled();
  });

  it('should handle empty order list', async () => {
    databaseRepositoryMock.getOrders.mockResolvedValue([]);

    const result = await getOrdersUseCase.execute();

    expect(result).toEqual([]);
    expect(databaseRepositoryMock.getOrders).toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database failure');
    databaseRepositoryMock.getOrders.mockRejectedValue(error);

    await expect(getOrdersUseCase.execute()).rejects.toThrow('Database failure');
    expect(databaseRepositoryMock.getOrders).toHaveBeenCalled();
  });
});
