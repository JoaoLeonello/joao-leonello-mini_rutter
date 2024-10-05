import { v4 as uuidv4 } from 'uuid';

export class LineItem {
  private _id: string;
  private _platformId: number;
  private _name: string;
  private _title: string;
  private _price: string;
  private _vendor: string;
  private _quantity: number;
  private _productId: string | null;
  private _orderId: string | null;

  constructor(
    id: string = uuidv4(), // Generate a new UUID by default
    platformId: number,
    name: string,
    title: string,
    price: string,
    vendor: string,
    quantity: number = 1,
    productId: string | null = null,
    orderId: string | null = null,
  ) {
    this._id = id;
    this._platformId = platformId;
    this._name = name;
    this._title = title;
    this._price = price;
    this._vendor = vendor;
    this._quantity = quantity;
    this._productId = productId;
    this._orderId = orderId;
  }

  get id(): string {
    return this._id;
  }

  get platformId(): number {
    return this._platformId;
  }

  get name(): string {
    return this._name;
  }

  get title(): string {
    return this._title;
  }

  get price(): string {
    return this._price;
  }

  get vendor(): string {
    return this._vendor;
  }

  get quantity(): number {
    return this._quantity;
  }

  get productId(): string | null {
    return this._productId;
  }

  get orderId(): string | null {
    return this._orderId;
  }
}
