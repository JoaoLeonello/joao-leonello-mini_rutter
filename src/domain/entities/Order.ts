import { v4 as uuidv4 } from "uuid";
import { LineItem } from "./LineItem";

export class Order {
  private _id: string;
  private _platform_id: string;
  private _line_items!: LineItem[] | null | undefined;
  private _adminGraphqlApiId: string | undefined;
  private _buyerAcceptsMarketing: boolean | undefined;
  private _confirmationNumber: string | undefined;
  private _confirmed: boolean | undefined;
  private _createdAt: Date | undefined;
  private _currency: string | undefined;
  private _currentSubtotalPrice: string | undefined;
  private _currentTotalPrice: string | undefined;
  private _currentTotalTax: string | undefined;
  private _customerLocale: string | undefined;
  private _financialStatus: string | undefined;
  private _name: string | undefined;
  private _orderNumber: number | undefined;
  private _presentmentCurrency: string | undefined;
  private _processedAt: Date | undefined;
  private _sourceName: string | undefined;
  private _subtotalPrice: string | undefined;
  private _tags: string | undefined;
  private _taxExempt: boolean | undefined;
  private _totalDiscounts: string | undefined;
  private _totalLineItemsPrice: string | undefined;
  private _totalPrice: string | undefined;
  private _totalTax: string | undefined;
  private _userId: number | null | undefined;
  private _updatedAt: Date | null | undefined;
  private _checkoutId: number | undefined;
  private _checkoutToken: string | null | undefined;

  constructor(
    id: string = uuidv4(),
    platform_id: string,
    line_items?: LineItem[] | null | undefined,
    adminGraphqlApiId?: string | undefined,
    buyerAcceptsMarketing?: boolean | undefined,
    confirmationNumber?: string | undefined,
    confirmed?: boolean | undefined,
    createdAt?: Date | undefined,
    currency?: string | undefined,
    currentSubtotalPrice?: string | undefined,
    currentTotalPrice?: string | undefined,
    currentTotalTax?: string | undefined,
    customerLocale?: string | undefined,
    financialStatus?: string | undefined,
    name?: string | undefined,
    orderNumber?: number | undefined,
    presentmentCurrency?: string | undefined,
    processedAt?: Date,
    sourceName?: string,
    subtotalPrice?: string,
    tags?: string,
    taxExempt?: boolean,
    totalDiscounts?: string,
    totalLineItemsPrice?: string,
    totalPrice?: string,
    totalTax?: string,
    userId?: number | null,
    updatedAt?: Date | null,
    checkoutId?: number,
    checkoutToken?: string | null,
  ) {
    this._id = id;
    this._platform_id = platform_id;
    this._line_items = line_items;
    this._adminGraphqlApiId = adminGraphqlApiId;
    this._buyerAcceptsMarketing = buyerAcceptsMarketing;
    this._confirmationNumber = confirmationNumber;
    this._confirmed = confirmed;
    this._createdAt = createdAt;
    this._currency = currency;
    this._currentSubtotalPrice = currentSubtotalPrice;
    this._currentTotalPrice = currentTotalPrice;
    this._currentTotalTax = currentTotalTax;
    this._customerLocale = customerLocale;
    this._financialStatus = financialStatus;
    this._name = name;
    this._orderNumber = orderNumber;
    this._presentmentCurrency = presentmentCurrency;
    this._processedAt = processedAt;
    this._sourceName = sourceName;
    this._subtotalPrice = subtotalPrice;
    this._tags = tags;
    this._taxExempt = taxExempt;
    this._totalDiscounts = totalDiscounts;
    this._totalLineItemsPrice = totalLineItemsPrice;
    this._totalPrice = totalPrice;
    this._totalTax = totalTax;
    this._userId = userId;
    this._updatedAt = updatedAt;
    this._checkoutId = checkoutId;
    this._checkoutToken = checkoutToken;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get platformId(): string | undefined {
    return this._platform_id;
  }

  get lineItems(): LineItem[] | undefined {
    return this._line_items ?? undefined;
  }

  get adminGraphqlApiId(): string | undefined {
    return this._adminGraphqlApiId;
  }

  get buyerAcceptsMarketing(): boolean | undefined {
    return this._buyerAcceptsMarketing;
  }

  get confirmationNumber(): string | undefined {
    return this._confirmationNumber;
  }

  get confirmed(): boolean | undefined {
    return this._confirmed;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get currency(): string | undefined {
    return this._currency;
  }

  get currentSubtotalPrice(): string | undefined {
    return this._currentSubtotalPrice;
  }

  get currentTotalPrice(): string | undefined {
    return this._currentTotalPrice;
  }

  get currentTotalTax(): string | undefined {
    return this._currentTotalTax;
  }

  get customerLocale(): string | undefined {
    return this._customerLocale;
  }

  get financialStatus(): string | undefined {
    return this._financialStatus;
  }

  get name(): string | undefined {
    return this._name;
  }

  get orderNumber(): number | undefined {
    return this._orderNumber;
  }

  get presentmentCurrency(): string | undefined {
    return this._presentmentCurrency;
  }

  get processedAt(): Date | undefined {
    return this._processedAt;
  }

  get sourceName(): string | undefined {
    return this._sourceName;
  }

  get subtotalPrice(): string | undefined {
    return this._subtotalPrice;
  }

  get tags(): string | undefined {
    return this._tags;
  }

  get taxExempt(): boolean | undefined {
    return this._taxExempt;
  }

  get totalDiscounts(): string | undefined {
    return this._totalDiscounts;
  }

  get totalLineItemsPrice(): string | undefined {
    return this._totalLineItemsPrice;
  }

  get totalPrice(): string | undefined {
    return this._totalPrice;
  }

  get totalTax(): string | undefined {
    return this._totalTax;
  }

  get userId(): number | null | undefined {
    return this._userId;
  }

  get updatedAt(): Date | null | undefined {
    return this._updatedAt;
  }

  get checkoutId(): number | undefined {
    return this._checkoutId;
  }

  get checkoutToken(): string | null | undefined {
    return this._checkoutToken;
  }
}
