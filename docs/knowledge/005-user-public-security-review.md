---
id: 5
tags: [security, contracts, user-public, zod, validation]
title: "@contracts/user-publicセキュリティレビュー — Zodスキーマ制約強化"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [002-shared-kernel-security-review, 004-todo-public-security-review]
---

# @contracts/user-publicセキュリティレビュー — Zodスキーマ制約強化

## 背景

`@contracts/user-public` はユーザードメインのコマンド・イベント・DTO・エラーの公開コントラクトを定義するパッケージ。shared-kernelレビュー（knowledge #002）で確立されたZodスキーマ制約強化パターンを適用した。

## レビュー結果

### 問題なし（修正不要）

| チェック項目 | 結果 |
|---|---|
| **インジェクション脆弱性** | 純粋な型定義・Zodスキーマのみ。SQL/コマンド/HTML出力なし |
| **認証・認可** | 型定義のみで認証ロジックを含まない（適切） |
| **機密情報の漏洩** | `UnknownUserCommandError` は `commandType`（列挙値）のみ含む。ユーザーデータの漏洩リスクなし |
| **依存パッケージ** | `zod` と `neverthrow` のみ。既知の重大脆弱性なし |
| **OWASP Top 10** | 該当するリスクなし（型・スキーマ定義のみ） |

### 修正した事項

#### 1. `commands.ts` — EnsureUserCommandSchema の制約不足

- `sub: z.string()` → `z.string().min(1)` — 空文字を拒否
- `email: z.string()` → `z.string().email()` — メールフォーマット検証を追加

#### 2. `dto.ts` — UserDtoSchema の制約不足

- `id: z.string()` → `z.string().min(1)` — 空文字を拒否
- `sub: z.string()` → `z.string().min(1)` — 空文字を拒否
- `email: z.string()` → `z.string().email()` — メールフォーマット検証を追加

#### 3. `events.ts` — UserCreatedEventSchema の制約不足

- `userId: z.string()` → `z.string().min(1)` — 空文字を拒否
- `sub: z.string()` → `z.string().min(1)` — 空文字を拒否
- `email: z.string()` → `z.string().email()` — メールフォーマット検証を追加

## 知見

### emailフィールドには `.email()` を使う

`email` フィールドは入力スキーマ・DTO・イベントのいずれでも `.email()` で検証すべき。`.min(1)` だけでは不正なメールアドレスが通過する。shared-kernelの `email: z.string()` は各ドメインコントラクトで `.email()` に強化する方針（knowledge #002 参照）。

### sub（サブジェクト識別子）は `.min(1)` で十分

OIDCの `sub` クレームはプロバイダーによってフォーマットが異なるため、`.min(1)` による空文字防止のみが適切。UUID等の特定フォーマット制約は避ける。
