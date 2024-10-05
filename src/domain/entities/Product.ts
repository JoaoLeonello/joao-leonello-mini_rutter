import { v4 as uuidv4 } from 'uuid';

export class Product {
  private _id: string;
  private _platformId: number | null;
  private _name: string | null;
  private _title: string | null;
  private _bodyHtml: string | null;
  private _vendor: string | null;
  private _productType: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _status: string;
  private _publishedAt: Date | null;
  private _templateSuffix: string | null;
  private _publishedScope: string | null;
  private _tags: string | null;
  private _adminGraphqlApiId: string | null;

  constructor(
    id: string = uuidv4(),
    platformId: number | null = null,
    name: string | null,
    title: string | null,
    bodyHtml: string | null,
    vendor: string | null,
    productType: string | null,
    createdAt: Date,
    updatedAt: Date,
    status: string,
    publishedAt: Date | null = null,
    templateSuffix: string | null = null,
    publishedScope: string | null = null,
    tags: string | null = null,
    adminGraphqlApiId: string | null = null
  ) {
    this._id = id;
    this._platformId = platformId;
    this._name = name;
    this._title = title;
    this._bodyHtml = bodyHtml;
    this._vendor = vendor;
    this._productType = productType;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._status = status;
    this._publishedAt = publishedAt;
    this._templateSuffix = templateSuffix;
    this._publishedScope = publishedScope;
    this._tags = tags;
    this._adminGraphqlApiId = adminGraphqlApiId;
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get platformId(): number | null {
    return this._platformId;
  }

  get name(): string | null {
    return this._name;
  }

  get title(): string | null {
    return this._title;
  }

  get bodyHtml(): string | null {
    return this._bodyHtml;
  }

  get vendor(): string | null {
    return this._vendor;
  }

  get productType(): string | null {
    return this._productType;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get status(): string {
    return this._status;
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  get templateSuffix(): string | null {
    return this._templateSuffix;
  }

  get publishedScope(): string | null {
    return this._publishedScope;
  }

  get tags(): string | null {
    return this._tags;
  }

  get adminGraphqlApiId(): string | null {
    return this._adminGraphqlApiId;
  }
}
