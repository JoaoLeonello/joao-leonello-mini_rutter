import { v4 as uuidv4 } from "uuid";

export class LineItem {
  private _id: string;
  private _platform_id: number;
  private _name: string;
  private _title: string;
  private _price: string;
  private _vendor: string;
  private _quantity: number;
  private _product_id: string | null;
  private _orderId: string | null;

  constructor(
    id: string = uuidv4(), // Generate a new UUID by default
    platform_id: number,
    name: string,
    title: string,
    price: string,
    vendor: string,
    quantity: number = 1,
    product_id: string | null = null,
    orderId: string | null = null,
  ) {
    this._id = id;
    this._platform_id = platform_id;
    this._name = name;
    this._title = title;
    this._price = price;
    this._vendor = vendor;
    this._quantity = quantity;
    this._product_id = product_id;
    this._orderId = orderId;
  }

  get id(): string {
    return this._id;
  }

  get platformId(): number {
    return this._platform_id;
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
    return this._product_id;
  }

  get orderId(): string | null {
    return this._orderId;
  }
}
