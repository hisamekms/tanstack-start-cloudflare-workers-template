#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
CONFIG_PATH="$("${PROJECT_ROOT}/scripts/resolve-wrangler-config.sh")"
SEED_PATH="${PROJECT_ROOT}/packages/platform/db/src/d1/seed.sql"

cd "${PROJECT_ROOT}/apps/web"
bun x wrangler d1 execute DB --local --config "$CONFIG_PATH" --file "$SEED_PATH"
