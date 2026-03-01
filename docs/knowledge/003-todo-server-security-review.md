---
id: 3
tags: [security, contracts, todo-server, cqrs]
title: "@contracts/todo-serverセキュリティレビュー — 問題なし確認"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [002-shared-kernel-security-review]
---

# @contracts/todo-serverセキュリティレビュー — 問題なし確認

## 背景

`@contracts/todo-server` はTodoドメインのサーバーサイド契約を定義するパッケージ。CQRSパターンに基づき `TodoCommandBus`、`TodoQueryBus`、`TodoEventBus` の3つのインターフェースを公開している。ランタイムコード（Zodスキーマ等）を含まない純粋なTypeScript型定義パッケージ。

## レビュー結果

### 問題なし（修正不要）

| チェック項目 | 結果 |
|---|---|
| **入力バリデーション・サニタイズ** | 該当なし — 純粋な型定義のみ。入力バリデーションは `@contracts/todo-public` のZodスキーマと各ハンドラーの責務 |
| **認証・認可** | `Context` パラメータが全バス操作に必須。`PublicContext` / `ProtectedContext` の判別型で認証レベルを型安全に表現。実際の認可チェックはハンドラー側の責務 |
| **インジェクション脆弱性** | SQL/コマンド/XSS のリスクなし — データベースアクセス・HTML出力のコードを含まない |
| **機密情報の取り扱い** | ログ出力・エラーメッセージのコードなし。DTO (`TodoDto`) にパスワード等の機密フィールドなし |
| **依存パッケージ** | `neverthrow` のみ（型利用のみ）。既知の重大脆弱性なし |
| **OWASP Top 10** | 該当するリスクなし |

### 設計メモ（記録のみ）

- **TodoEventBus のエラー型不一致**: `TodoCommandBus`/`TodoQueryBus` は `TodoError` を使用するが、`TodoEventBus` は `AppError` を使用。これは基底の `EventBus<TEvent, TError>` のデフォルト型パラメータに従っており、イベント発行が特定のドメインエラーを返さない設計意図として妥当
- **ListTodosQuery のフィルタリング**: クエリにフィルタパラメータがなく、ユーザー別の絞り込みはハンドラー側で `context.userId` を使って行う設計。コントラクト上は問題ないが、ハンドラー実装でのフィルタリング漏れに注意が必要（`@modules/todo-read-app` のレビュー範囲）

## 知見

### 純粋型定義パッケージのセキュリティレビュー

- ランタイムコードを含まない型定義パッケージでは、インジェクション・機密情報漏洩・OWASP Top 10 の多くの項目が「該当なし」となる
- レビューの焦点は「型レベルでの認証・認可の表現が適切か」「ハンドラー側に必要な制約が正しく伝播するか」に絞られる
- 問題が見つからなかった場合でも、設計上の注意点を記録しておくことで下流パッケージのレビュー時に参考になる
