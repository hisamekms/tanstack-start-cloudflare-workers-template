#!/usr/bin/env bash
set -euo pipefail

cd "$WTH_PATH"
./scripts/bin/setup-local-d1
./scripts/bin/setup-e2e-d1
