import type { Token } from "./token";

export type Lifetime = "singleton" | "transient" | "scoped";

export interface Resolver {
  resolve<T>(token: Token<T>): T;
}

export type Factory<T> = (resolver: Resolver) => T;

export interface Registration<T> {
  readonly factory: Factory<T>;
  readonly lifetime: Lifetime;
}
