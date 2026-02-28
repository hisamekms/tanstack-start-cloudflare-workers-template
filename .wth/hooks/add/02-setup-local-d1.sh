#!/usr/bin/env bash
set -euo pipefail

cd "$WTH_PATH"
./scripts/setup-local-d1.sh
./scripts/setup-e2e-d1.sh
