export interface Query<TQueryType extends string = string> {
  readonly queryType: TQueryType;
}
