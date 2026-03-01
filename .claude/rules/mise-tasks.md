## mise tasks

プロジェクトのコマンド実行には `mise run` を使うこと。

`turbo run` を呼ぶ task は、`--` 以降の引数をそのまま渡せる。パッケージを絞って実行したい場合は `--filter` を使うこと。

- `mise run lint -- --filter @modules/todo-write-model` — `@modules/todo-write-model` に絞って lint を実行
- `mise run test:unit -- --filter @modules/todo-write-model` — `@modules/todo-write-model` に絞ってユニットテストを実行
- `mise run typecheck -- --filter @modules/todo-write-model` — `@modules/todo-write-model` に絞って型チェックを実行

- `mise run setup` — 依存関係をインストール
- `mise run dev` — 開発サーバーを起動（依存関係のインストールも自動実行）
- `mise run test:unit` — ユニットテストを実行
- `mise run test:e2e` — Playwright e2eテストを実行
- `mise run lint` — リントを実行
- `mise run typecheck` — tsgoによる型チェックを実行
- `mise run format` — コードフォーマットを実行
- `mise run format:check` — フォーマットチェックを実行
