#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_NAME="$(basename "$PROJECT_ROOT")"
BASE_CONFIG="${PROJECT_ROOT}/apps/web/wrangler.toml"
E2E_CONFIG="${PROJECT_ROOT}/apps/web/wrangler.e2e.toml"
E2E_DB_NAME="app-e2e-${WORKTREE_NAME}"
SEED_PATH="${PROJECT_ROOT}/packages/platform/db/d1/src/seed.sql"

cp "$BASE_CONFIG" "$E2E_CONFIG"
perl -0pi -e "s/database_name = \"app-local\"/database_name = \"${E2E_DB_NAME}\"/" "$E2E_CONFIG"

cd "${PROJECT_ROOT}/apps/web"
bun x wrangler d1 execute DB --local --config "$E2E_CONFIG" --command "select 1;"
bun x wrangler d1 migrations apply DB --local --config "$E2E_CONFIG"
bun x wrangler d1 execute DB --local --config "$E2E_CONFIG" --file "$SEED_PATH"
