#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
CONFIG_PATH="$("${PROJECT_ROOT}/scripts/resolve-wrangler-config.sh")"

cd "${PROJECT_ROOT}/apps/web"
bun x wrangler d1 migrations apply DB --local --config "$CONFIG_PATH"
