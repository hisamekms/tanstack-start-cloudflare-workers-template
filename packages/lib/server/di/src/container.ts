import { TokenNotRegisteredError } from "./errors";
import type { Token } from "./token";
import type { Factory, Lifetime, Registration, Resolver } from "./types";

/**
 * 親子スコープ構造を持つ DI コンテナ。
 *
 * {@link createScope} で子スコープを作成でき、子から親へ登録を辿って解決する。
 * このプロジェクトでは `apps/web` のリクエストハンドラで `createScope()` を呼び
 * リクエストスコープを作成しているため、`scoped` は実質リクエスト単位のライフタイムとなる。
 */
export class Container implements Resolver {
  private readonly registrations = new Map<symbol, Registration<unknown>>();
  private readonly singletonCache = new Map<symbol, unknown>();
  private readonly scopedCache = new Map<symbol, unknown>();
  private readonly parent: Container | null;

  constructor(parent: Container | null = null) {
    this.parent = parent;
  }

  /** 値をそのまま `singleton` として登録する。登録と同時にキャッシュされる。 */
  registerValue<T>(token: Token<T>, value: T): this {
    this.registrations.set(token.symbol, {
      factory: () => value,
      lifetime: "singleton",
    });
    this.singletonCache.set(token.symbol, value);
    return this;
  }

  /** ファクトリ関数を指定したライフタイムで登録する。デフォルトは `transient`。 */
  registerFactory<T>(token: Token<T>, factory: Factory<T>, lifetime: Lifetime = "transient"): this {
    this.registrations.set(token.symbol, { factory, lifetime });
    return this;
  }

  /**
   * トークンに対応するサービスを解決する。
   *
   * 自身の登録を探し、見つからなければ親コンテナへ再帰的に辿る。
   * 登録が見つからない場合は {@link TokenNotRegisteredError} をスローする。
   */
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

  /** このコンテナを親とする子スコープを作成する。 */
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
