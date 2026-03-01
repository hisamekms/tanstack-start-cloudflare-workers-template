---
id: 4
tags: [security, contracts, todo-public, zod, validation]
title: "@contracts/todo-publicセキュリティレビュー — Zodスキーマ制約強化"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [002-shared-kernel-security-review, 003-todo-server-security-review, 005-user-public-security-review]
---

# @contracts/todo-publicセキュリティレビュー — Zodスキーマ制約強化

## 背景

`@contracts/todo-public` はTodoドメインの公開コントラクトを定義するパッケージ。Zodスキーマによるコマンド・クエリ・イベント・DTOの定義を含む。shared-kernelレビュー（knowledge #002）で確立されたZodスキーマ制約強化パターンを適用した。

## レビュー結果

### 問題なし（修正不要）

| チェック項目 | 結果 |
|---|---|
| **入力バリデーション** | `CreateTodoInputSchema`: `title` に `.trim().min(1).max(200)` あり。`CompleteTodoInputSchema`: `todoId` に `.uuid()` あり。テストも充実 |
| **認証・認可** | Web層で `commandHandler`/`queryHandler` 経由で `ProtectedContext` を生成。下流ハンドラーで `context.userId` による所有者チェック実施済み |
| **インジェクション脆弱性** | 純粋な型定義・Zodスキーマのみ。SQL/コマンド/HTML出力なし |
| **依存パッケージ** | `zod` と `neverthrow` のみ。既知の重大脆弱性なし |
| **型安全性** | Discriminated Union でコマンド・クエリ・イベントを型安全に判別 |

### 修正した事項

#### 1. `dto.ts` — TodoDtoSchema の制約不足

- `id: z.string()` → `id: z.string().min(1)` — 空文字を拒否
- `title: z.string()` → `title: z.string().min(1)` — 空文字を拒否
- DTOはDBから読み出したデータのマッピングに使われるため、入力スキーマほどの厳密な制約（`.uuid()`, `.max(200)`）は不要だが、最低限の空文字チェックは必要

#### 2. `events.ts` — イベントスキーマの制約不足

- `TodoCreatedEventSchema`: `todoId` と `title` に `.min(1)` を追加
- `TodoCompletedEventSchema`: `todoId` に `.min(1)` を追加
- イベントは内部で生成されるため `.uuid()` や `.max(200)` までは不要だが、空文字防止は防御的プログラミングとして有効

### 記録のみ（修正不要・スコープ外）

- **`handler.server.ts` の `throw new Error(error.message)`**: `error.message` に `todoId` 等のユーザー提供データが含まれるが、内部IDであり機密情報ではない。Web層の改善は別タスクの責務
- **`DomainEventSchema.eventType: z.string()`**: shared-kernel側の問題。todo-publicでは `z.literal()` で上書きしているため影響なし

## 知見

### 入力スキーマとDTO/イベントスキーマの制約レベルの使い分け

- **入力スキーマ**（ユーザー入力）: `.trim().min(1).max(200)`, `.uuid()` など厳密な制約
- **DTOスキーマ**（DB読み出し）: `.min(1)` で空文字防止のみ。DBに保存された時点で入力バリデーション済み
- **イベントスキーマ**（内部生成）: `.min(1)` で空文字防止のみ。防御的プログラミングとして有効

この3段階の制約レベルの使い分けは、shared-kernelレビュー（#002）のパターンと一貫している。
