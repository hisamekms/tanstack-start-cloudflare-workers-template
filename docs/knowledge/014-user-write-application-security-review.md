---
id: 14
tags: [security, modules, user-write-application, command-bus, handler]
title: "@modules/user-write-applicationセキュリティレビュー — 問題なし"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [013-user-write-model-security-review, 013-user-infra-d1-security-review]
---

# @modules/user-write-applicationセキュリティレビュー — 問題なし

## 背景

`@modules/user-write-application` はUserドメインのWrite側アプリケーション層。`UserCommandBusImpl`がコマンドのディスパッチを担当し、`EnsureUserHandler`が唯一のコマンドハンドラ。Auth.jsの`signIn`コールバックから呼ばれ、OAuth認証時にユーザーの作成・確認を行う。

## レビュー結果

### 問題なし（全項目）

| チェック項目 | 結果 |
|---|---|
| **入力バリデーション** | コマンドは上流の`@contracts/user-public`のZodスキーマで検証済み（`sub: z.string().min(1)`, `email: z.string().email()`）。ハンドラ層での再検証は不要 |
| **認証・認可** | `EnsureUserHandler`は`context`を使用しない（`_context`）。Auth.js `signIn`コールバックから`{ kind: "public" }`で呼ばれる設計のため、認証チェックを行わないのは意図的 |
| **インジェクション脆弱性** | SQL/コマンド/HTML出力なし。リポジトリ経由のDB操作（Drizzle ORM）でパラメタライズドクエリ使用 |
| **機密情報の取り扱い** | エラーメッセージにPII漏洩なし。ログ出力はミドルウェア層が担当 |
| **依存パッケージ** | ランタイム依存は`neverthrow`（型安全エラーハンドリング）と`uuid`（v7生成）のみ。既知の重大脆弱性なし |
| **OWASP Top 10** | 該当するリスクなし |

### PublicContextでの実行パターン

`todo-write-application`の各ハンドラが`context.kind === "protected"`を要求するのとは対照的に、`EnsureUserHandler`は認証チェックを行わない。これは以下の設計上の理由による:

- **呼び出し元**: Auth.jsの`signIn`コールバック内で実行される。OAuthプロバイダによる認証が完了した直後のタイミング
- **コンテキスト**: `{ kind: "public" }`（`PublicContext`）で呼ばれる。ユーザーがまだシステム上に存在しない可能性があるため、`ProtectedContext`（`userId`を含む）を構築できない
- **入力の信頼性**: `sub`と`email`はOAuthプロバイダから取得される値であり、エンドユーザーが直接操作できない信頼できる入力源

### 記録のみ（修正不要）

- **冪等設計**: `findBySub`で既存ユーザーを確認し、存在する場合は何もしない。重複作成を防止するとともに、OAuth認証のたびに安全に呼び出せる
- **`fromSafePromise`の使用**: リポジトリの例外が`ResultAsync`の型に反映されない。ただし、DB制約違反等のエッジケースは実質的にインフラ層（Drizzleの`onConflictDoUpdate`）で吸収されるため、実害なし
- **`UnknownUserCommandError`**: `UserCommandBusImpl`のdefaultケースで未知のコマンドを適切に拒否。型安全なdiscriminated unionと合わせて、不正なコマンドの実行を防止

## 知見

### PublicContext が正当なケースの判断基準

アプリケーション層のハンドラが`PublicContext`で実行される場合、以下の条件をすべて満たすか確認する:

1. **認証フロー中である**: ユーザーのセッションがまだ確立されていないタイミング（例: OAuth signInコールバック）
2. **入力がサーバーサイドで信頼できる**: エンドユーザーが直接入力する値ではなく、OAuthプロバイダ等の信頼できるソースから取得される
3. **操作が限定的である**: ユーザーの作成・確認のみで、他ユーザーのリソースへのアクセスや変更を伴わない

### todo-write-application との設計上の違い

| 観点 | todo-write-application | user-write-application |
|---|---|---|
| コンテキスト | `ProtectedContext`を要求 | `PublicContext`で実行 |
| 認証チェック | `context.kind !== "protected"`で検証 | なし（意図的） |
| 認可チェック | 所有権チェック（`userId`比較） | なし（自身のレコード作成のみ） |
| 呼び出し元 | tRPCルーター（認証済みリクエスト） | Auth.js signInコールバック |
