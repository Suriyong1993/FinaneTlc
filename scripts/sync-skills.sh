#!/usr/bin/env bash
# sync-skills.sh — distribute all source-of-truth skills to every AI tool / IDE.
#
# Source of truth:  .agents/skills/*/
# Edit ONLY copies under .agents/skills/, then run:  ./scripts/sync-skills.sh
#
# It mirrors all skill folders into each tool's skills/ directory.
# AGENTS.md and GitHub workflows are NOT touched here — edit those by hand.
#
# SECURITY NOTE: some skills run `npx` commands or fetch remote instructions
# over the network. Only use in projects/networks you trust.

set -euo pipefail

# repo root = parent of this script's dir
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SRC_ROOT=".agents/skills"

if [[ ! -d "$SRC_ROOT" ]]; then
  echo "ERROR: source skills directory not found at $SRC_ROOT" >&2
  exit 1
fi

# Tools that consume a skills/ folder
TARGETS=(.claude .cursor .gemini .trae .windsurf .clinerules)

echo "Source root: $SRC_ROOT"
for t in "${TARGETS[@]}"; do
  echo "Syncing to $t/skills:"
  mkdir -p "$t/skills"
  # Remove existing skills to clean up old ones
  rm -rf "$t/skills"/*
  # Copy all skills
  for skill in "$SRC_ROOT"/*/; do
    skill_name="$(basename "$skill")"
    dst="$t/skills/$skill_name"
    cp -r "$skill" "$dst"
    echo "  synced -> $dst"
  done
done

# Also sync into Hermes global skills if present
if [[ -d "$HOME/.hermes/skills" ]]; then
  echo
  echo "Syncing to Hermes global skills:"
  HERMES_ROOT="$HOME/.hermes/skills/software-development"
  mkdir -p "$HERMES_ROOT"
  for skill in "$SRC_ROOT"/*/; do
    skill_name="$(basename "$skill")"
    dst="$HERMES_ROOT/$skill_name"
    rm -rf "$dst"
    cp -r "$skill" "$dst"
    echo "  synced -> $dst"
  done
fi

echo
echo "Native rule files (.cursor/rules, .clinerules) are maintained by hand."
echo "Done."
