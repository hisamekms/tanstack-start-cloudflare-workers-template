---
id: 13
tags: [security, modules, user-write-model, domain-model]
title: "@modules/user-write-modelセキュリティレビュー — 問題なし"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [005-user-public-security-review, 008-sk-write-model-security-review]
---

# @modules/user-write-modelセキュリティレビュー — 問題なし

## 背景

`@modules/user-write-model` はUserドメインのWrite Model（集約・ドメインロジック）を定義するパッケージ。`User` インターフェース、`createUser` ファクトリ関数、`UserRepository` インターフェースで構成される。純粋な関数とインターフェースのみのパッケージ。

## レビュー結果

### 問題なし（全項目）

| チェック項目 | 結果 |
|---|---|
| **入力バリデーション** | ドメインモデル層は入力バリデーションを担当しない。バリデーションは上流の`@contracts/user-public`（Zodスキーマ）で実施済み |
| **認証・認可** | ドメインモデル層は認証・認可を扱わない。アプリケーション層の責務 |
| **インジェクション脆弱性** | SQL/コマンド/HTML出力なし。純粋な関数とインターフェース定義のみ |
| **機密情報の取り扱い** | ログ出力・エラーメッセージなし。`sub`/`email`はドメインオブジェクト内部に保持されるが、DTOへの変換時にインフラ層で適切に制御される |
| **依存パッケージ** | `@contracts/shared-kernel`, `@contracts/user-public`, `@modules/shared-kernel-write-model`のみ（すべて内部パッケージ、`import type`）。ランタイム依存なし |
| **OWASP Top 10** | 該当するリスクなし |

### 型安全性の評価

- `User`インターフェースが`AggregateRoot<string>`を拡張し、`id`と`version`を型レベルで保証
- `createUser`は純粋関数で、`CommandResult<User, UserCreatedEvent>`を返す（状態とイベントの組）
- `readonly`プロパティによる不変性の保証

### 記録のみ（修正不要）

- **入力の信頼**: `createUser(id, sub, email)` の引数に対するバリデーションはこの層では行わない。呼び出し元（アプリケーション層）がZodスキーマでバリデーション済みの値を渡す設計として妥当
- **イベントへの機密情報の含有**: `UserCreatedEvent`に`sub`と`email`が含まれるが、これはドメインイベントとして必要な情報であり、イベントの保存・配信時のアクセス制御はインフラ層の責務

## 知見

### 純粋なドメインモデル層のセキュリティレビュー方針

純粋関数とインターフェースのみで構成されるドメインモデル層は、セキュリティリスクが極めて低い。レビューの焦点は以下に絞られる:

- ランタイム依存が存在しないこと（`import type`のみ）
- 機密情報がドメインオブジェクトからDTOへの変換時に適切に除外されるか（インフラ層の責務）
- 副作用がないこと（純粋関数であること）
- ドメインイベントに含まれる機密情報のアクセス制御がインフラ層で担保されるか
