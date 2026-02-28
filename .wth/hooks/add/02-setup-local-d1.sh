#!/usr/bin/env bash
set -euo pipefail

cd "$WTH_PATH"
./scripts/bin/setup-local-d1.sh
./scripts/bin/setup-e2e-d1.sh
