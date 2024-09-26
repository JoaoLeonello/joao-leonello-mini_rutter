export class Order {
    // Propriedades da entidade de domínio
    private _id: string;
    private _platformId: string;
    private _lineItems: LineItem[];
  
    constructor(id: string, platformId: string, lineItems: LineItem[]) {
      this._id = id;
      this._platformId = platformId;
      this._lineItems = lineItems;
    }
  
    // Getters para acessar as propriedades
    get id(): string {
      return this._id;
    }
  
    get platformId(): string {
      return this._platformId;
    }
  
    get lineItems(): LineItem[] {
      return this._lineItems;
    }
  
    // Métodos de domínio (exemplos de lógica de negócios)
    addLineItem(lineItem: LineItem): void {
      this._lineItems.push(lineItem);
    }
  
    removeLineItem(productId: string): void {
      this._lineItems = this._lineItems.filter(item => item.productId !== productId);
    }
  
    totalItems(): number {
      return this._lineItems.length;
    }
  }
  
  // Entidade LineItem
  export class LineItem {
    private _productId: string | null;
  
    constructor(productId: string | null) {
      this._productId = productId;
    }
  
    get productId(): string | null {
      return this._productId;
    }
  }
  