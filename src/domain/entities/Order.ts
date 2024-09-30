export class Order {
  
  private _id: string;
  private _platformId!: string | undefined;
  private _lineItems!: LineItem[] | undefined;

  constructor(id: string, platformId?: string | undefined, lineItems?: LineItem[] | undefined) {
    this._id = id;
    this._platformId = platformId;
    this._lineItems = lineItems;
  }

  get id(): string {
    return this._id;
  }
}
  
export class LineItem {
  private _productId!: string | undefined;

  constructor(productId?: string | undefined) {
    this._productId = productId;
  }

  get productId(): string | undefined {
    return this._productId || undefined;
  }
}
  