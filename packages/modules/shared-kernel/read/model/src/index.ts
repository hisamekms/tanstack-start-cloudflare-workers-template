export interface ReadModelStore<T> {
  getAll(): T[];
  save(item: T): void;
}
