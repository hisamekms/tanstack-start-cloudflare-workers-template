#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_NAME="$(basename "$PROJECT_ROOT")"
BASE_CONFIG="${PROJECT_ROOT}/apps/web/wrangler.toml"
LOCAL_CONFIG="${PROJECT_ROOT}/apps/web/wrangler.local.toml"
LOCAL_DB_NAME="app-local-${WORKTREE_NAME}"

cp "$BASE_CONFIG" "$LOCAL_CONFIG"
perl -0pi -e "s/database_name = \"app-local\"/database_name = \"${LOCAL_DB_NAME}\"/" "$LOCAL_CONFIG"

cd "${PROJECT_ROOT}/apps/web"
bun x wrangler d1 execute DB --local --config "$LOCAL_CONFIG" --command "select 1;"
bash "${PROJECT_ROOT}/scripts/bin/db-migrate.sh"
bash "${PROJECT_ROOT}/scripts/bin/db-seed.sh"
