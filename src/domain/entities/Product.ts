// src/domain/entities/Product.ts

export class Product {
  // Propriedades da entidade de domínio
  private _id: string;
  private _platformId: string;
  private _name: string;

  constructor(id: string, platformId: string, name: string) {
    this._id = id;
    this._platformId = platformId;
    this._name = name;
  }

  // Getters para acessar as propriedades
  get id(): string {
    return this._id;
  }

  get platformId(): string {
    return this._platformId;
  }

  get name(): string {
    return this._name;
  }

  // Métodos de domínio (exemplo de lógica de negócios)
  updateName(newName: string): void {
    this._name = newName;
  }

  // Outros métodos que podem ser adicionados conforme a necessidade do domínio
}
