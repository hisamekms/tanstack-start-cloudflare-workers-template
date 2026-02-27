#!/usr/bin/env bash
set -euo pipefail

USER=dev

log() {
  printf '[post-create] %s\n' "$*"
}

on_error() {
  local exit_code=$?
  log "FAILED (exit=${exit_code}) at line ${BASH_LINENO[0]}: ${BASH_COMMAND}"
  exit "$exit_code"
}

trap on_error ERR

log "fix base ownership"
sudo chown "$USER":"$USER" "$HOME/.local"
sudo chown "$USER":"$USER" "$HOME/.local/share"
sudo chown "$USER":"$USER" "$HOME/.cache"
sudo chown "$USER":"$USER" "$HOME/.config"

volume_paths=(
  "$HOME/.local/share/mise"
  "$HOME/.bun"
  "$HOME/.npm"
  "$HOME/.codex"
  "$HOME/.claude"
  "$HOME/.config/claude"
  "$HOME/.cache/claude"
  "$HOME/.config/gh"
)

log "prepare volume mounts"
for path in "${volume_paths[@]}"; do
  if [ -e "$path" ]; then
    sudo chown -R "$USER":"$USER" "$path"
  else
    sudo mkdir -p "$path"
    sudo chown -R "$USER":"$USER" "$path"
  fi
done

export PATH="$HOME/.local/bin:$PATH"

if [ ! -f "/workspace/.env" ]; then
  if [ -f "/workspace/.env.example" ]; then
    log "initialize .env from .env.example"
    cp /workspace/.env.example /workspace/.env
  else
    log "no .env or .env.example found; skipping .env initialization"
  fi
else
  log ".env already exists; skipping initialization"
fi

BASH_ACTIVATE='eval "$(mise activate bash)"'
ZSH_ACTIVATE='eval "$(mise activate zsh)"'

if ! grep -qF 'mise activate bash' "$HOME/.bashrc" 2>/dev/null; then
  log "adding mise activate to .bashrc"
  echo "$BASH_ACTIVATE" >> "$HOME/.bashrc"
else
  log "mise activate already in .bashrc; skipping"
fi

if ! grep -qF 'mise activate zsh' "$HOME/.zshrc" 2>/dev/null; then
  log "adding mise activate to .zshrc"
  echo "$ZSH_ACTIVATE" >> "$HOME/.zshrc"
else
  log "mise activate already in .zshrc; skipping"
fi
