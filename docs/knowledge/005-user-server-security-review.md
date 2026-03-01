---
id: 5
tags: [security, contracts, user-server, user-public, zod, validation]
title: "@contracts/user-serverセキュリティレビュー — Zodスキーマ制約強化"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [002-shared-kernel-security-review, 004-todo-public-security-review]
---

# @contracts/user-serverセキュリティレビュー — Zodスキーマ制約強化

## 背景

`@contracts/user-server` はUserドメインのサーバー側コントラクトを定義するパッケージ。`UserCommandBus` インターフェースのみを含む純粋な型定義パッケージであり、セキュリティ上の問題なし。関連する `@contracts/user-public` のZodスキーマに対して、todo-publicレビュー（knowledge #004）で確立した制約強化パターンを適用した。

## レビュー結果

### `@contracts/user-server` — 問題なし（修正不要）

純粋なTypeScriptインターフェース定義のみ（`UserCommandBus`）。ビジネスロジック、I/O、ランタイムコードなし。

### `@contracts/user-public` — 修正した事項

#### 1. `dto.ts` — UserDtoSchema の制約不足

- `id: z.string()` → `id: z.string().min(1)` — 空文字を拒否
- `sub: z.string()` → `sub: z.string().min(1)` — 空文字を拒否
- `email: z.string()` → `email: z.string().min(1)` — 空文字を拒否
- DTOはDBから読み出したデータのマッピングに使われるため、`.email()` までは不要だが、最低限の空文字チェックは必要

#### 2. `commands.ts` — EnsureUserCommandSchema の制約不足

- `sub: z.string()` → `sub: z.string().min(1)` — 空文字を拒否
- `email: z.string()` → `email: z.string().email()` — メールフォーマットバリデーション
- コマンドはユーザー入力由来のため、`email` には `.email()` で厳密なバリデーションを適用

#### 3. `events.ts` — UserCreatedEventSchema の制約不足

- `userId: z.string()` → `userId: z.string().min(1)` — 空文字を拒否
- `sub: z.string()` → `sub: z.string().min(1)` — 空文字を拒否
- `email: z.string()` → `email: z.string().min(1)` — 空文字を拒否
- イベントは内部で生成されるため `.email()` までは不要だが、空文字防止は防御的プログラミングとして有効

### 問題なし（修正不要）

| チェック項目 | 結果 |
|---|---|
| **認証・認可** | `Context` 型で `ProtectedContext` / `PublicContext` を区別。実装は上流で制御 |
| **インジェクション脆弱性** | 純粋な型定義・Zodスキーマのみ。SQL/コマンド/HTML出力なし |
| **機密情報の取り扱い** | `errors.ts` の `UnknownUserCommandError` は `commandType` のみ含み、機密情報漏洩なし |
| **依存パッケージ** | `zod`, `neverthrow` のみ。既知の重大脆弱性なし |

## 知見

### コマンドスキーマとDTO/イベントスキーマの `email` フィールドの制約使い分け

- **コマンドスキーマ**（ユーザー入力由来）: `.email()` で厳密なフォーマットバリデーション
- **DTOスキーマ**（DB読み出し）: `.min(1)` で空文字防止のみ。DBに保存された時点で入力バリデーション済み
- **イベントスキーマ**（内部生成）: `.min(1)` で空文字防止のみ。防御的プログラミングとして有効

この使い分けは、todo-publicレビュー（#004）の入力スキーマ/DTO/イベントの3段階制約レベルと一貫している。
