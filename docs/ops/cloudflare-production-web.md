# apps/web Cloudflare 本番環境構築手順

## 目的

`apps/web` を Cloudflare Workers 上の本番環境として手動で構築し、D1 と Google OAuth を含めて運用可能にする。

## 対象

- アプリ: `apps/web`
- 実行基盤: Cloudflare Workers
- データベース: Cloudflare D1
- 認証: Google OAuth

## 現状の前提

`apps/web` は Cloudflare Workers 前提で実装されている。主な依存は以下。

- Worker エントリポイント: `apps/web/src/server-entry.ts`
- Cloudflare 設定: `apps/web/wrangler.toml`
- 環境変数参照: `apps/web/src/config.ts`
- 認証設定: `apps/web/src/server/auth/config.server.ts`
- D1 マイグレーション: `packages/platform/db/d1/src/migrations/`

本番化にあたって最低限必要なのは以下。

- Cloudflare Worker
- 本番用 D1 データベース
- 本番用 secret
- Google OAuth の本番設定
- 本番ドメインまたは `workers.dev` ドメイン

## 手動構築手順

### 1. Cloudflare で本番用 D1 を作成する

Cloudflare Dashboard で D1 を新規作成する。

推奨:

- DB 名: `tanstack-start-cloudflare-workers-template`

作成後、以下を控える。

- `database_name`
- `database_id`

その後、`apps/web/wrangler.toml` の `[[env.production.d1_databases]]` に反映する。

補足:

- Worker のコードは `binding = "DB"` を参照する
- Cloudflare 側で実際の DB を特定するのは `database_id`
- `database_name` は設定上必要なので、Cloudflare 上の DB 名と一致させておく

### 2. production 用 secret を登録する

`apps/web` で必要な secret は以下。

- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`

`AUTH_SECRET` は 32 文字以上を推奨。

生成例:

```bash
openssl rand -base64 33
```

登録コマンド:

```bash
cd /workspace/apps/web
wrangler secret put AUTH_SECRET --env production
wrangler secret put AUTH_GOOGLE_ID --env production
wrangler secret put AUTH_GOOGLE_SECRET --env production
```

### 3. Google OAuth を本番用に設定する

Google Cloud Console で OAuth Client を開き、Authorized redirect URI に本番 URL を追加する。

独自ドメインを使う場合:

```txt
https://<your-domain>/api/auth/callback/google
```

`workers.dev` を使う場合:

```txt
https://<worker-name>.<subdomain>.workers.dev/api/auth/callback/google
```

注意:

- OAuth の callback URL は実際の公開 URL と完全一致させる
- ドメイン変更時は Google 側も更新する

### 4. 本番用 D1 にマイグレーションを適用する

本番 DB には migration を明示的に適用する。

```bash
cd /workspace/apps/web
wrangler d1 migrations apply tanstack-start-cloudflare-workers-template --env production --remote
```

使用される migration は以下。

- `packages/platform/db/d1/src/migrations/0000_cynical_famine.sql`

この migration で以下のテーブルが作成される。

- `accounts`
- `sessions`
- `users`
- `verification_tokens`
- `todos`
- `users_app`

### 5. Worker を本番デプロイする

依存関係のセットアップ後、`apps/web` からデプロイする。

```bash
cd /workspace
mise run setup

cd /workspace/apps/web
bun run deploy
```

`bun run deploy` は `bun run build && wrangler deploy --env production` を実行する。

### 6. 公開 URL を割り当てる

以下のどちらかを使う。

- `workers.dev`
- 独自ドメイン

本番運用では独自ドメインを推奨する。Google OAuth の callback URL もこの公開 URL に合わせる。

## 事前確認

デプロイ前に最低限以下を実行する。

```bash
cd /workspace
mise run typecheck -- --filter web
mise run lint -- --filter web
```

必要ならローカル確認も行う。

```bash
cd /workspace
mise run dev -- --filter web
```

## 本番化チェックリスト

- `apps/web/wrangler.toml` の production に `APP_ENV = "production"` が入っている
- production の `database_id` が local と別になっている
- 本番用 D1 が作成済み
- D1 migration を本番 DB に適用済み
- `AUTH_SECRET` を登録済み
- `AUTH_GOOGLE_ID` を登録済み
- `AUTH_GOOGLE_SECRET` を登録済み
- Google OAuth の callback URL が本番 URL と一致している
- Worker が `workers.dev` または独自ドメインで公開されている

## トラブルシュート

### ログイン時に OAuth callback error になる

確認点:

- Google OAuth の redirect URI が公開 URL と一致しているか
- `AUTH_GOOGLE_ID` と `AUTH_GOOGLE_SECRET` が production に登録されているか

### 本番で DB 接続エラーになる

確認点:

- `wrangler.toml` の production `database_id` が正しいか
- `binding = "DB"` がコードと一致しているか
- migration を本番 DB に適用済みか

### 認証後に Unauthorized になる

確認点:

- `AUTH_SECRET` が production に設定されているか
- D1 に Auth.js 用テーブルが作成されているか
- callback 後に session が保存されているか

## 関連ファイル

- `apps/web/wrangler.toml`
- `apps/web/package.json`
- `apps/web/src/config.ts`
- `apps/web/src/server/auth/config.server.ts`
- `apps/web/src/server-entry.ts`
- `packages/platform/db/d1/src/migrations/0000_cynical_famine.sql`
