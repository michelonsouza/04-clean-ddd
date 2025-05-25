import { UniqueEntityID } from './unique-entity-id';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Entity<ParamsType = any> {
  #id: UniqueEntityID;

  protected params: ParamsType;

  protected constructor(params: ParamsType, id?: UniqueEntityID) {
    this.params = params;
    this.#id = id ?? new UniqueEntityID();
  }

  get id(): UniqueEntityID {
    return this.#id;
  }

  public equals(entity: Entity): boolean {
    if (this === entity) {
      return true;
    }

    return this.#id.equals(entity.id);
  }
}
