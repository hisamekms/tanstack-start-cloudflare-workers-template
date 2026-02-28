import { TokenNotRegisteredError } from "./errors";
import type { Token } from "./token";
import type { Factory, Lifetime, Registration, Resolver } from "./types";

export class Container implements Resolver {
  private readonly registrations = new Map<symbol, Registration<unknown>>();
  private readonly singletonCache = new Map<symbol, unknown>();
  private readonly scopedCache = new Map<symbol, unknown>();
  private readonly parent: Container | null;

  constructor(parent: Container | null = null) {
    this.parent = parent;
  }

  registerValue<T>(token: Token<T>, value: T): this {
    this.registrations.set(token.symbol, {
      factory: () => value,
      lifetime: "singleton",
    });
    this.singletonCache.set(token.symbol, value);
    return this;
  }

  registerFactory<T>(token: Token<T>, factory: Factory<T>, lifetime: Lifetime = "transient"): this {
    this.registrations.set(token.symbol, { factory, lifetime });
    return this;
  }

  resolve<T>(token: Token<T>): T {
    const owner = this.findOwner(token.symbol);

    if (!owner) {
      throw new TokenNotRegisteredError(token.description);
    }

    const registration = owner.registrations.get(token.symbol)!;

    switch (registration.lifetime) {
      case "singleton":
        return this.resolveSingleton(token.symbol, registration, owner) as T;
      case "scoped":
        return this.resolveScoped(token.symbol, registration) as T;
      case "transient":
        return registration.factory(this) as T;
    }
  }

  createScope(): Container {
    return new Container(this);
  }

  private findOwner(symbol: symbol): Container | undefined {
    if (this.registrations.has(symbol)) return this;
    return this.parent?.findOwner(symbol);
  }

  private resolveSingleton(
    symbol: symbol,
    registration: Registration<unknown>,
    owner: Container,
  ): unknown {
    const cached = owner.singletonCache.get(symbol);
    if (cached !== undefined) {
      return cached;
    }
    const value = registration.factory(this);
    owner.singletonCache.set(symbol, value);
    return value;
  }

  private resolveScoped(symbol: symbol, registration: Registration<unknown>): unknown {
    const cached = this.scopedCache.get(symbol);
    if (cached !== undefined) {
      return cached;
    }
    const value = registration.factory(this);
    this.scopedCache.set(symbol, value);
    return value;
  }
}
