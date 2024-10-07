import { v4 as uuidv4 } from 'uuid';
import { LineItem } from '../LineItem';

describe('LineItem', () => {
  it('should create a line item with provided values', () => {
    const id = uuidv4();
    const platformId = 1001;
    const name = 'Item 1';
    const title = 'Title 1';
    const price = '10.00';
    const vendor = 'Vendor 1';
    const quantity = 2;
    const productId = 'product123';
    const orderId = 'order123';

    const lineItem = new LineItem(
      id,
      platformId,
      name,
      title,
      price,
      vendor,
      quantity,
      productId,
      orderId
    );

    expect(lineItem.id).toBe(id);
    expect(lineItem.platformId).toBe(platformId);
    expect(lineItem.name).toBe(name);
    expect(lineItem.title).toBe(title);
    expect(lineItem.price).toBe(price);
    expect(lineItem.vendor).toBe(vendor);
    expect(lineItem.quantity).toBe(quantity);
    expect(lineItem.productId).toBe(productId);
    expect(lineItem.orderId).toBe(orderId);
  });

  it('should create a line item with default values', () => {
    const platformId = 1001;
    const name = 'Item 1';
    const title = 'Title 1';
    const price = '10.00';
    const vendor = 'Vendor 1';

    const lineItem = new LineItem(
      undefined,
      platformId,
      name,
      title,
      price,
      vendor
    );

    expect(lineItem.id).toBeDefined();
    expect(lineItem.platformId).toBe(platformId);
    expect(lineItem.name).toBe(name);
    expect(lineItem.title).toBe(title);
    expect(lineItem.price).toBe(price);
    expect(lineItem.vendor).toBe(vendor);
    expect(lineItem.quantity).toBe(1); // Default value
    expect(lineItem.productId).toBeNull(); // Default value
    expect(lineItem.orderId).toBeNull(); // Default value
  });
});