import { UniqueEntityID } from './unique-entity-id';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Entity<ParamsType = any> {
  #id: UniqueEntityID;

  protected params: ParamsType;

  get id(): UniqueEntityID {
    return this.#id;
  }

  protected constructor(params: ParamsType, id?: UniqueEntityID) {
    this.params = params;
    this.#id = id ?? new UniqueEntityID();
  }
}
