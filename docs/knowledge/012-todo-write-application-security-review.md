---
id: 12
tags: [security, modules, todo-write-application, command-bus, handler]
title: "@modules/todo-write-applicationセキュリティレビュー — 問題なし"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [004-todo-public-security-review, 011-todo-write-model-security-review, 010-todo-infra-d1-security-review]
---

# @modules/todo-write-applicationセキュリティレビュー — 問題なし

## 背景

`@modules/todo-write-application` はTodoドメインのWrite側アプリケーション層。`TodoCommandBusImpl`がコマンドのディスパッチを担当し、`CreateTodoHandler`と`CompleteTodoHandler`が各コマンドを処理する。認証・認可チェックとドメインロジックの呼び出しを行うレイヤーで、セキュリティ上の判断が集中する重要な層。

## レビュー結果

### 問題なし（全項目）

| チェック項目 | 結果 |
|---|---|
| **入力バリデーション** | コマンドは上流の`@contracts/todo-public`のZodスキーマで検証済み（title: trim/min1/max200, todoId: UUID形式）。ハンドラ層での再検証は不要 |
| **認証・認可** | 両ハンドラで`context.kind !== "protected"`を検証し、未認証コンテキストを拒否。`CompleteTodoHandler`は`todo.userId !== context.userId`で所有権チェックを実施 |
| **インジェクション脆弱性** | SQL/コマンド/HTML出力なし。リポジトリ経由のDB操作（Drizzle ORM）でパラメタライズドクエリ使用 |
| **機密情報の取り扱い** | エラーメッセージにPII漏洩なし。認可失敗時は`TodoNotFoundError`を返し、Todoの存在を秘匿（IDOR対策） |
| **依存パッケージ** | ランタイム依存は`neverthrow`（型安全エラーハンドリング）と`uuid`（v7生成）のみ。既知の重大脆弱性なし |
| **OWASP Top 10** | 該当するリスクなし |

### 認可パターンの詳細

- **CreateTodoHandler**: 認証済みコンテキスト（`context.kind === "protected"`）を要求。`context.userId`を使ってTodoの所有者を設定。UUIDv7による一意なIDを生成
- **CompleteTodoHandler**: 認証済みコンテキストを要求した上で、`todo.userId !== context.userId`による所有権チェックを実施。他ユーザーのTodoを完了しようとした場合は`TodoNotFoundError`を返す（存在の秘匿）

### 記録のみ（修正不要）

- **認証チェックでの同期例外**: 両ハンドラで`context.kind !== "protected"`の場合に`throw new Error(...)`を使用。`neverthrow`の`errAsync`ではなく同期例外を投げている。型安全性の観点では`errAsync`が望ましいが、認証済みContextのみが渡される設計前提（ミドルウェアで事前に検証）のため防御的コードとして許容範囲
- **監査ログ**: 誰が何を操作したかの記録は本モジュールのスコープ外。ミドルウェア層（`loggingCommandMiddleware`）が担当

## 知見

### アプリケーション層（コマンドハンドラ）のセキュリティレビュー方針

アプリケーション層は認証・認可の判断が集中するレイヤーであり、以下がレビューの焦点となる:

- **認証チェック**: すべてのハンドラで`context.kind`による認証状態の検証が行われているか
- **認可チェック（所有権）**: リソースの変更時に`userId`による所有権チェックが実施されているか
- **情報の秘匿**: 認可失敗時に「権限がない」ではなく「見つからない」を返し、リソースの存在を秘匿しているか（IDOR対策）
- **入力の信頼境界**: 上流（コントラクト層のZodスキーマ）で検証済みの入力を信頼し、二重検証を避けているか

### IDOR（Insecure Direct Object Reference）対策パターン

`CompleteTodoHandler`で実装されているパターンは、IDOR対策の模範例:

1. `findById`でリソースを取得
2. `todo.userId !== context.userId`で所有権を検証
3. 失敗時は`TodoNotFoundError`を返す（`TodoUnauthorizedError`ではない）

これにより、攻撃者は他ユーザーのリソースIDを推測しても、そのリソースの存在すら確認できない。
