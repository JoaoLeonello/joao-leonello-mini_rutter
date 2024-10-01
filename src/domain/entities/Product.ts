import { v4 as uuidv4 } from 'uuid';

export class Product {
  private _id!: string;
  private _platformId!: string;
  private _name: string;

  constructor(id: string = uuidv4(), platformId: string, name: string) {
    this._id = id;
    this._platformId = platformId;
    this._name = name;
  }
}
