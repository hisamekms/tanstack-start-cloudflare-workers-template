#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
LOCAL_CONFIG="${PROJECT_ROOT}/apps/web/wrangler.local.toml"
DEFAULT_CONFIG="${PROJECT_ROOT}/apps/web/wrangler.toml"

if [ -f "$LOCAL_CONFIG" ]; then
  printf '%s\n' "$LOCAL_CONFIG"
else
  printf '%s\n' "$DEFAULT_CONFIG"
fi
