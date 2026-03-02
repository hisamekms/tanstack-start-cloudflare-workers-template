import type { Token } from "./token";

/**
 * サービスのライフタイム（生存期間）を定義する。
 *
 * - `singleton` — 登録オーナーのコンテナに 1 度だけ生成・キャッシュされる。
 *   子スコープから resolve しても、オーナーにキャッシュされた同一インスタンスが返る。
 * - `scoped` — スコープ（Container インスタンス）単位でキャッシュされる。
 *   同一スコープ内では同じインスタンスが返り、別スコープでは別インスタンスが生成される。
 * - `transient` — resolve のたびに新しいインスタンスを生成する。キャッシュしない。
 */
export type Lifetime = "singleton" | "transient" | "scoped";

/** トークンからサービスを解決する機能を提供するインターフェース。 */
export interface Resolver {
  resolve<T>(token: Token<T>): T;
}

/** サービスのインスタンスを生成するファクトリ関数。依存の解決には渡された {@link Resolver} を使う。 */
export type Factory<T> = (resolver: Resolver) => T;

/** ファクトリとライフタイムの組。コンテナ内部でトークンごとに保持される。 */
export interface Registration<T> {
  readonly factory: Factory<T>;
  readonly lifetime: Lifetime;
}
