import { LineItem, Order } from '../Order';

describe('Order Entity', () => {
  it('should correctly instantiate an Order with id, platformId, and lineItems', () => {
    const lineItems = [new LineItem('product-1'), new LineItem('product-2')];
    const order = new Order('order-1', 'platform-123', lineItems);

    expect(order.id).toBe('order-1');
    expect(order['_platformId']).toBe('platform-123');
    expect(order['_lineItems']).toEqual(lineItems);
  });

  it('should instantiate an Order with undefined platformId and lineItems', () => {
    const order = new Order('order-1');

    expect(order.id).toBe('order-1');
    expect(order['_platformId']).toBeUndefined();
    expect(order['_lineItems']).toBeUndefined();
  });
});

describe('LineItem Entity', () => {
  it('should correctly instantiate a LineItem with productId', () => {
    const lineItem = new LineItem('product-1');

    expect(lineItem.productId).toBe('product-1');
  });

  it('should instantiate a LineItem with undefined productId', () => {
    const lineItem = new LineItem();

    expect(lineItem.productId).toBeUndefined();
  });
});
