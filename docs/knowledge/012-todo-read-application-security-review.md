---
id: 12
tags: [security, modules, todo-read-application, cqrs, query-bus]
title: "@modules/todo-read-applicationセキュリティレビュー — 問題なし"
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: [009-sk-read-application-security-review, 004-todo-public-security-review]
---

# @modules/todo-read-applicationセキュリティレビュー — 問題なし

## 背景

`@modules/todo-read-application` はCQRSパターンのクエリ側アプリケーション層パッケージ。`TodoQueryBusImpl`（クエリルーティング）と`ListTodosHandler`（ToDo一覧取得ハンドラ）の2クラスで構成される。クエリの種別に応じてハンドラへディスパッチし、`Context`に基づくスコープ制御を行う。

## レビュー結果

### 問題なし（全項目）

| チェック項目 | 結果 |
|---|---|
| **入力バリデーション** | ユーザー入力を直接扱わない。`TodoQuery`型は上流の`@contracts/todo-public`（Zodスキーマ）で検証済み |
| **認証・認可** | `ListTodosHandler`が`Context`の`kind`により`public`/`protected`を適切に分岐。`protected`の場合は`context.userId`でスコープを限定し、他ユーザーのデータにアクセスできない設計 |
| **インジェクション脆弱性** | SQL/コマンド実行/HTML出力なし。型安全なインターフェース（`TodoReadModelStore`）呼び出しのみ |
| **機密情報の取り扱い** | ログ出力なし。`UnknownTodoQueryError`のメッセージはクエリタイプ（列挙値）のみで、機密情報の漏洩リスクなし |
| **依存パッケージ** | ランタイム依存は`neverthrow`のみ。広く利用されているResult型ライブラリで既知の重大脆弱性なし |
| **OWASP Top 10** | 該当するリスクなし |

### 記録のみ（修正不要）

- **Contextの信頼**: `ListTodosHandler`は`Context`オブジェクトの`kind`と`userId`を信頼して分岐する。`Context`の生成・検証は認証ミドルウェア（上流）の責務であり、この層で再検証しない設計は妥当
- **網羅性**: `TodoQueryBusImpl`の`switch`文は`default`で未知のクエリタイプをエラーとして処理。TypeScriptの型による網羅性チェックが機能するため、未処理のクエリタイプが追加された場合はコンパイル時に検出される

## 知見

### コンテキストベース認可パターンのセキュリティレビュー方針

`Context`の`kind`（`public`/`protected`）に基づくスコープ制御は、CQRSクエリハンドラにおける軽量な認可パターンとして有効。レビューの焦点は以下に絞られる:

- `protected`コンテキストで`userId`によるスコープ限定が確実に行われているか
- `public`コンテキストで返却されるデータに機密情報が含まれないか（DTOの設計は`@contracts`層の責務）
- `Context`の生成・検証が適切な上流層（認証ミドルウェア）で行われているか
