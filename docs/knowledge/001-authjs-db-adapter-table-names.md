---
id: 1
tags: [authjs, database, d1, cloudflare, drizzle]
title: Auth.js DBアダプターのテーブル名はアダプターによって固定/可変
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: []
---

# Auth.js DBアダプターのテーブル名

## デフォルトテーブル（全アダプター共通）

Auth.jsのDBアダプターを使用すると、以下のテーブルが作成される。

| テーブル名 | 用途 |
|---|---|
| `users` | ユーザー情報 |
| `accounts` | OAuthアカウント連携 |
| `sessions` | セッション管理 |
| `verification_tokens` | メール認証トークン |
| `authenticators` | WebAuthn用（オプション） |

## アダプター別のテーブル名カスタマイズ可否

| アダプター | カスタマイズ | 方法 |
|---|---|---|
| **D1 Adapter** | 不可 | テーブル名・カラム名ともに固定 |
| **Drizzle Adapter** | 可 | スキーマ定義で自由に変更可能 |
| **Prisma Adapter** | 可 | `@@map("custom_name")` で変更可能 |
| **Kysely Adapter** | 可 | テーブル定義でカスタマイズ可能 |
| **TypeORM Adapter** | 可 | エンティティ定義で変更可能 |

いずれのアダプターでも、カラム構造やリレーションはAuth.jsの期待する形に合わせる必要がある。

## 本プロジェクトでの対応

- Auth.jsアダプター: `@auth/d1-adapter`（テーブル名固定）
- アプリ側ORM: Drizzle ORM
- Auth.jsが `users` テーブルを使用するため、アプリ独自のユーザーテーブルは `users_app` として名前衝突を回避

### テーブル構成

**Auth.js管理（D1 Adapter自動作成）:**

- `users` — Auth.jsのユーザー
- `accounts` — OAuthアカウント連携
- `sessions` — セッション
- `verification_tokens` — 認証トークン

**アプリ管理（Drizzle ORM）:**

- `users_app` — アプリ独自のユーザー情報（`sub` でAuth.jsユーザーと紐付け）
- `todos` — Todoデータ（`userId` でアプリユーザーと紐付け）

### マイグレーション

- Auth.jsテーブル: `ensureAuthTables()` で自動マイグレーション（`/api/auth/*` アクセス時に実行）
- アプリテーブル: Drizzle Kit によるマイグレーション管理（`packages/platform/db/d1/src/migrations/`）
