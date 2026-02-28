#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[check-dep-rules] %s\n' "$*"
}

on_error() {
  local exit_code=$?
  log "FAILED (exit=${exit_code}) at line ${BASH_LINENO[0]}: ${BASH_COMMAND}"
  exit "$exit_code"
}

trap on_error ERR

PROJECT_ROOT="$(git rev-parse --show-toplevel)"

violations=0

# classify_package <package-name>
# Sets: pkg_scope, pkg_bc, pkg_side, pkg_layer, pkg_suffix
classify_package() {
  local name="$1"
  pkg_scope="" pkg_bc="" pkg_side="" pkg_layer="" pkg_suffix=""

  if [[ "$name" =~ ^@modules/(.+)-(read|write)-(model|application|infra)$ ]]; then
    pkg_scope="modules"
    pkg_bc="${BASH_REMATCH[1]}"
    pkg_side="${BASH_REMATCH[2]}"
    pkg_layer="${BASH_REMATCH[3]}"
  elif [[ "$name" =~ ^@contracts/(.+)$ ]]; then
    pkg_scope="contracts"
    pkg_bc="${BASH_REMATCH[1]}"
  elif [[ "$name" =~ ^@platform/(.+)$ ]]; then
    pkg_scope="platform"
  elif [[ "$name" =~ ^@lib/(.+)$ ]]; then
    pkg_scope="lib"
  fi
}

# layer_order <layer> -> numeric rank (higher = outer)
layer_order() {
  case "$1" in
    model)       echo 0 ;;
    application) echo 1 ;;
    infra)       echo 2 ;;
    *)           echo -1 ;;
  esac
}

report_violation() {
  local from="$1" dep="$2" rule="$3"
  log "VIOLATION: ${from} -> ${dep} (${rule})"
  violations=$((violations + 1))
}

check_dependency() {
  local from="$1" dep="$2"

  # Rule 6: @contracts/* and @lib/* are always allowed as dependencies
  if [[ "$dep" =~ ^@contracts/ ]] || [[ "$dep" =~ ^@lib/ ]]; then
    return
  fi

  # Classify both packages
  local from_scope from_bc from_side from_layer from_suffix
  classify_package "$from"
  from_scope="$pkg_scope" from_bc="$pkg_bc" from_side="$pkg_side"
  from_layer="$pkg_layer" from_suffix="$pkg_suffix"

  local dep_scope dep_bc dep_side dep_layer dep_suffix
  classify_package "$dep"
  dep_scope="$pkg_scope" dep_bc="$pkg_bc" dep_side="$pkg_side"
  dep_layer="$pkg_layer" dep_suffix="$pkg_suffix"

  # Rule 5: lib must not depend on modules, contracts, platform
  if [[ "$from_scope" == "lib" ]]; then
    if [[ "$dep_scope" == "modules" ]] || [[ "$dep_scope" == "contracts" ]] || [[ "$dep_scope" == "platform" ]]; then
      report_violation "$from" "$dep" "lib must not depend on ${dep_scope}"
      return
    fi
  fi

  # Rule 4: contracts must not depend on modules or platform
  if [[ "$from_scope" == "contracts" ]]; then
    if [[ "$dep_scope" == "modules" ]] || [[ "$dep_scope" == "platform" ]]; then
      report_violation "$from" "$dep" "contracts must not depend on ${dep_scope}"
      return
    fi
  fi

  # Rule 3: platform -> modules is NG
  if [[ "$from_scope" == "platform" ]] && [[ "$dep_scope" == "modules" ]]; then
    report_violation "$from" "$dep" "platform must not depend on modules"
    return
  fi

  # Rules for modules scope
  if [[ "$from_scope" == "modules" ]]; then
    # Rule 3: only infra layer can depend on platform
    if [[ "$dep_scope" == "platform" ]]; then
      if [[ "$from_layer" != "infra" ]]; then
        report_violation "$from" "$dep" "only modules/*-infra can depend on platform"
        return
      fi
      # infra -> platform is OK
      return
    fi

    # Rule 2: BC isolation (modules -> modules cross-BC is NG, except shared-kernel)
    if [[ "$dep_scope" == "modules" ]]; then
      if [[ "$from_bc" != "$dep_bc" ]]; then
        if [[ "$dep_bc" != "shared-kernel" ]]; then
          report_violation "$from" "$dep" "cross-BC module dependency (use contracts instead)"
          return
        fi
        # shared-kernel exception: allowed
      fi

      # Rule 1: Layer ordering within same BC and same side
      if [[ "$from_bc" == "$dep_bc" ]] && [[ "$from_side" == "$dep_side" ]]; then
        local from_rank dep_rank
        from_rank=$(layer_order "$from_layer")
        dep_rank=$(layer_order "$dep_layer")

        if [[ "$from_rank" -le "$dep_rank" ]]; then
          report_violation "$from" "$dep" "layer violation: ${from_layer} must not depend on ${dep_layer}"
          return
        fi
      fi
    fi
  fi
}

# Find and check all package.json files
checked=0

while IFS= read -r pkg_file; do
  pkg_name=$(jq -r '.name // empty' "$pkg_file")
  if [[ -z "$pkg_name" ]]; then
    continue
  fi

  # Only check packages in our scopes
  if [[ ! "$pkg_name" =~ ^@(modules|contracts|platform|lib)/ ]]; then
    continue
  fi

  deps=$(jq -r '.peerDependencies // {} | keys[]' "$pkg_file" 2>/dev/null || true)
  if [[ -z "$deps" ]]; then
    checked=$((checked + 1))
    continue
  fi

  while IFS= read -r dep; do
    check_dependency "$pkg_name" "$dep"
  done <<< "$deps"

  checked=$((checked + 1))
done < <(find "$PROJECT_ROOT/packages" -name 'package.json' -not -path '*/node_modules/*' | sort)

if [[ "$violations" -gt 0 ]]; then
  log "Found ${violations} violation(s) across ${checked} packages"
  exit 1
fi

log "All dependency rules OK (checked ${checked} packages)"
