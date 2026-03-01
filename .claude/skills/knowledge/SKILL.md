---
name: knowledge
description: ナレッジの管理。docs/knowledge/ にある知見の追加・一覧・検索を行う。Triggers on "/knowledge" or similar.
argument-hint: [add <description> | ls | <id> | search <query>]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# knowledge - ナレッジ管理スキル

プロジェクトルートの `docs/knowledge/` ディレクトリにナレッジファイルを蓄積・管理する。

## ナレッジファイル形式

ファイル名: `<id>-<title>.md` (例: `001-authjs-db-adapter-table-names.md`)

```md
---
id: 1
tags: [tag1, tag2]
title: ナレッジのタイトル
created_at: 2026-03-01T00:00:00+09:00
updated_at: 2026-03-01T00:00:00+09:00
related_to: []
---

# 見出し

本文
```

## コマンド

- `/knowledge` — 引数なし: `AskUserQuestion` で操作を確認後、追加フローへ
- `/knowledge add <description>` — ナレッジを追加
- `/knowledge ls` — 一覧表示
- `/knowledge <id>` — 個別表示
- `/knowledge search <query>` — タグ・本文を検索

## 引数の解析

`$ARGUMENTS` を以下のルールで解析する:

1. **空の場合**: `AskUserQuestion` で何を記録したいか確認し、追加フローへ
2. **`ls` の場合**: 一覧表示（後述の「ナレッジ一覧」参照）
3. **`add` で始まる場合**: `add` 以降のテキストを説明としてナレッジを追加（後述の「ナレッジ追加」参照）
4. **`search` で始まる場合**: `search` 以降のテキストをクエリとして検索（後述の「ナレッジ検索」参照）
5. **数字の場合**: 該当IDのナレッジを表示（後述の「ナレッジ個別表示」参照）

---

## ナレッジ一覧

`docs/knowledge/` 内の全ファイルを `Glob` で取得し、各ファイルのfrontmatterを `Read` で読み取る。

以下の形式でMarkdownテーブルを表示する:

```
| ID | Title | Tags |
|----|-------|------|
| 1  | Auth.js DBアダプターのテーブル名は... | authjs, database, d1 |
```

ナレッジが1件も存在しない場合は「ナレッジがありません」と表示する。

---

## ナレッジ個別表示

指定IDに一致するファイルを `Glob` で検索（パターン: `docs/knowledge/<id>-*.md`、IDはゼロ埋め3桁）し、`Read` で内容を表示する。

該当ファイルが見つからない場合はその旨を伝える。

---

## ナレッジ検索

`Grep` で `docs/knowledge/` 配下を検索し、マッチしたファイルの一覧を表示する。

---

## ナレッジ追加

### 手順

1. `docs/knowledge/` ディレクトリが存在しない場合は作成する
2. 既存ファイルを `Glob` で走査し、最大IDを取得する。ファイルが存在しない場合は `0` を最大IDとする
3. 新しいID = 最大ID + 1
4. ユーザーの説明から以下を決定する:
   - `title`: ナレッジのタイトル（日本語、簡潔に）
   - `tags`: 関連タグの配列（英語のkebab-case）
   - ファイル名用の `<title>`: 英語のkebab-case
   - 本文: 知見の詳細
5. `AskUserQuestion` で以下を確認する:
   - タイトル、タグ、本文の内容が適切か
   - 関連ナレッジ (`related_to`) があるか
6. 「ナレッジファイル形式」に従ってファイルを作成する:
   - `id`: 数値
   - `tags`: タグ配列
   - `created_at` / `updated_at`: 現在日時（ISO 8601、`+09:00`）
   - `related_to`: 関連ナレッジID配列（空の場合は `[]`）
   - ファイル名: `<id>-<title>.md`（IDはゼロ埋め3桁）
7. `related_to` を指定した場合は、関連先ファイルの `related_to` にも新しいナレッジのIDを追加する（双方向リンク）

作成後、ファイルパスと内容をユーザーに表示する。

---

## 注意事項

- **言語**: ユーザーの入力言語に合わせて応答する
- **エラー時**: `docs/knowledge/` が存在しない、ファイルが見つからない等のエラーは明確にユーザーに伝える
