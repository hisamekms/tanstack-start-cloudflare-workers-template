export interface ReadModelStore<T> {
  getAll(): Promise<T[]>;
}
