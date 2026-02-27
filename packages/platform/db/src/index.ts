export class InMemoryStore<T extends { id: string }> {
  private items = new Map<string, T>();

  getAll(): T[] {
    return [...this.items.values()];
  }

  getById(id: string): T | undefined {
    return this.items.get(id);
  }

  save(item: T): void {
    this.items.set(item.id, item);
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }
}
