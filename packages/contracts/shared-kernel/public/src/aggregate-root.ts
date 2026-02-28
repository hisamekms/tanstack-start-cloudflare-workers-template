export interface AggregateRoot<TId extends string = string> {
  readonly id: TId;
  readonly version: number;
}
