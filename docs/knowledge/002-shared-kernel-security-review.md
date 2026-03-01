---
id: 2
tags: [security, zod, shared-kernel, validation]
title: shared-kernelセキュリティレビュー — Zodスキーマ制約の強化
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: []
---

# shared-kernelセキュリティレビュー — Zodスキーマ制約の強化

## 背景

`@contracts/shared-kernel` はCQRS/イベント駆動アーキテクチャの基盤パッケージ。DomainEventSchema と AggregateRootSchema のZodスキーマに適切な制約が不足していた。

## 発見事項と対応

### 修正済み

| 対象 | 問題 | 修正 |
|------|------|------|
| `events.ts` — `occurredAt` | `z.string()` で日時フォーマット未検証 | `z.string().datetime()` に変更 |
| `events.ts` — `schemaVersion`, `aggregateVersion` | `z.number()` で整数・非負制約なし | `z.number().int().nonnegative()` に変更 |
| `aggregate-root.ts` — `id` | `z.string()` で空文字許容 | `z.string().min(1)` に変更 |
| `aggregate-root.ts` — `version` | `z.number()` で整数・非負制約なし | `z.number().int().nonnegative()` に変更 |

### 問題なし

- **インジェクション脆弱性**: SQL/コマンド実行/HTML出力のコードがなくリスクなし
- **依存パッケージ**: `zod` と `neverthrow` のみ。既知の重大脆弱性なし
- **認証・認可の型設計**: `PublicContext`/`ProtectedContext` の判別型は適切
- **Bus/Middleware型**: 純粋な型定義のみ

### 記録のみ（修正不要）

- `defineError` の `as never` キャスト: TypeScript制約上やむを得ない。型安全を損なうが、関数の戻り値型が正しく推論されるために必要

## 知見

### Zodスキーマ設計のベストプラクティス

- `z.string()` を日時フィールドに使う場合は `.datetime()` を付与し、不正なフォーマットを防ぐ
- `z.string()` をIDフィールドに使う場合は `.min(1)` で空文字を拒否する
- `z.number()` でバージョン番号やカウンタを表す場合は `.int().nonnegative()` を明示する
- 基盤スキーマの制約は下流の全コントラクトに伝播するため、適切な制約を設けることが重要

### スコープ外の課題（各ドメインの責務）

- 下流コントラクトの `title: z.string()`, `email: z.string()` 等への長さ・フォーマット制約は各ドメインで対処すべき
- `createProtectedContext(userId)` の呼び出し元での userId 検証は認証レイヤーの責務
- ハンドラーでの `throw new Error()` は `AppError` サブクラスを返すべき
- `unwrap()` のエラーメッセージHTTP露出はWebアプリ側の責務
