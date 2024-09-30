import { v4 as uuidv4 } from 'uuid';
import { Product } from '../Product'; // Assumindo que a classe Product está em um arquivo chamado 'Product.ts'

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('Product Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks entre os testes
  });

  it('should correctly instantiate a Product with a provided id, platformId, and name', () => {
    const product = new Product('product-1', 'platform-123', 'Product Name 1');

    expect(product.id).toBe('product-1');
    expect(product.platformId).toBe('platform-123');
    expect(product.name).toBe('Product Name 1');
  });

  it('should generate a UUID for the id if none is provided', () => {
    const mockUUID = 'mock-uuid-1234';
    (uuidv4 as jest.Mock).mockReturnValue(mockUUID);

    const product = new Product(undefined, 'platform-456', 'Product Name 2');

    expect(product.id).toBe(mockUUID); // Verifica se o UUID gerado foi atribuído
    expect(product.platformId).toBe('platform-456');
    expect(product.name).toBe('Product Name 2');
  });
});
