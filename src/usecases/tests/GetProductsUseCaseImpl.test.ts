import { DatabaseRepository } from '../../adapters/output/db/DatabaseRepository';
import { Product } from '../../domain/entities/Product';
import { GetProductsUseCaseImpl } from '../GetProductsUseCaseImpl';

describe('GetProductsUseCaseImpl', () => {
  let getProductsUseCase: GetProductsUseCaseImpl;
  let databaseRepositoryMock: jest.Mocked<DatabaseRepository>;

  beforeEach(() => {
    databaseRepositoryMock = {
      getProducts: jest.fn(),
    } as unknown as jest.Mocked<DatabaseRepository>;

    getProductsUseCase = new GetProductsUseCaseImpl(databaseRepositoryMock);
  });

  it('should return products from the repository', async () => {
    const mockProducts: Product[] = [
      new Product('product-1', 'platform-123', 'Product Name 1'),
      new Product('product-2', 'platform-456', 'Product Name 2')
    ];
    databaseRepositoryMock.getProducts.mockResolvedValue(mockProducts);

    const result = await getProductsUseCase.execute();

    expect(result).toEqual(mockProducts);
    expect(databaseRepositoryMock.getProducts).toHaveBeenCalled();
  });

  it('should return an empty list if no products are available', async () => {
    databaseRepositoryMock.getProducts.mockResolvedValue([]);

    const result = await getProductsUseCase.execute();

    expect(result).toEqual([]);
    expect(databaseRepositoryMock.getProducts).toHaveBeenCalled();
  });

  it('should propagate repository errors', async () => {
    const error = new Error('Database failure');
    databaseRepositoryMock.getProducts.mockRejectedValue(error);

    await expect(getProductsUseCase.execute()).rejects.toThrow('Database failure');
    expect(databaseRepositoryMock.getProducts).toHaveBeenCalled();
  });
});
