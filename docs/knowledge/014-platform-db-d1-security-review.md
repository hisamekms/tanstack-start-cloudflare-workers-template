---
id: 14
tags: [security, platform, db-d1, d1, drizzle, schema]
title: "@platform/db-d1セキュリティレビュー — 問題なし"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [010-todo-infra-d1-security-review, 013-user-infra-d1-security-review]
---

# @platform/db-d1セキュリティレビュー — 問題なし

## 背景

`@platform/db-d1` はCloudflare D1（SQLite）のスキーマ定義とデータベースファクトリを提供するパッケージ。Auth.jsテーブル4つ（`users`, `accounts`, `sessions`, `verification_tokens`）とアプリケーションテーブル2つ（`todos`, `users_app`）を定義し、Drizzle ORMでの型安全なアクセスを提供する。データベーススキーマの中核であるため、テーブル構造・マイグレーション・シードデータの安全性を確認する。

## レビュー対象

| ファイル | 役割 |
|---|---|
| `src/index.ts` | DBファクトリ関数（`createD1Database`）。D1バインディングからDrizzleインスタンスを生成 |
| `src/schema.ts` | テーブル定義。Auth.jsテーブル4つ + アプリテーブル2つ |
| `src/migrations/0000_cynical_famine.sql` | 初期マイグレーション。CREATE TABLE文のみ |
| `src/seed.sql` | 開発用シードデータ |
| `package.json` | 依存関係定義 |

## レビュー結果

### 問題なし（全項目）

| チェック項目 | 結果 |
|---|---|
| **入力バリデーション** | スキーマ定義とファクトリ関数のみ。入力バリデーションはこの層の責務外 |
| **認証・認可** | スキーマ定義のみ。認証・認可ロジックを含まない |
| **インジェクション脆弱性** | Drizzle ORMのスキーマ定義のみ。クエリ実行ロジックなし。マイグレーションはDDL（CREATE TABLE）のみで動的パラメータなし |
| **機密情報の取り扱い** | ログ出力なし。エラーメッセージ生成なし。シードデータにダミー値のみ使用 |
| **依存パッケージ** | ランタイム依存は `drizzle-orm` のみ。広く利用されているORMで既知の重大脆弱性なし |
| **OWASP Top 10** | 該当するリスクなし |

### 記録のみ（修正不要）

- **Auth.jsテーブルの機密カラム**: `accounts` テーブルに `access_token`, `refresh_token`, `id_token`, `oauth_token_secret`, `oauth_token` 等のOAuthトークンカラムがある。これらはAuth.js（`@auth/d1-adapter`）の仕様に準拠したスキーマであり、暗号化・アクセス制御はAuth.jsおよびアプリケーション層の責務
- **外部キー制約なし**: `accounts.userId` → `users.id`、`sessions.userId` → `users.id`、`todos.user_id` → `users_app.id` の参照関係に外部キー制約が設定されていない。D1（SQLite）では外部キー制約のサポートが限定的（`PRAGMA foreign_keys = ON` が必要）であり、データ整合性はアプリケーション層で担保する設計として妥当
- **seed.sqlの固定ID**: テストデータに固定UUIDv7を使用。開発環境専用であり、本番環境では実行されない。`DELETE FROM` で既存データをクリアしてから挿入するため、冪等性が確保されている
- **DBファクトリのスキーマ制限**: `createD1Database` はアプリテーブル（`todos`, `users_app`）のみをスキーマに登録し、Auth.jsテーブルは含まない。Auth.jsテーブルへのアクセスは `@auth/d1-adapter` が直接D1バインディングを使用するため、この分離は意図的な設計
