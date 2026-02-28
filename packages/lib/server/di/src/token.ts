export interface Token<T> {
  readonly _type: T;
  readonly symbol: symbol;
  readonly description: string;
}

export function token<T>(description: string): Token<T> {
  return { symbol: Symbol(description), description } as Token<T>;
}
