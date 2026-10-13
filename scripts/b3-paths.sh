#!/usr/bin/env bash
# Resolve canonical instruction paths; this does not execute an AI workflow
# or register a native skill in any host's catalog.
set -euo pipefail
product_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
action="${1:-}"
case "$action" in
  autodev|plan|implement|debug|review|verify|review-loop) ;;
  *) printf 'Usage: bash scripts/b3-paths.sh autodev|plan|implement|debug|review|verify|review-loop\n' >&2; exit 1 ;;
esac
b3_root=""
for candidate in "${B3_HOME:-}" "$(cat "$product_root/.b3/cloud-home" 2>/dev/null || true)" "$(tr -d '\r\n' < "$product_root/.b3/home" 2>/dev/null || true)"; do
  if [[ -n "$candidate" && -f "$candidate/workflows/autonomous-development.md" ]]; then
    b3_root="$(cd "$candidate" && pwd -P)"; break
  fi
done
if [[ -z "$b3_root" ]]; then
  printf 'B3 source is unavailable. Run bash scripts/setup-b3-cloud.sh first.\n' >&2; exit 1
fi
skill="$b3_root/adapters/codex-command-skills/$action/SKILL.md"
command="$b3_root/.cursor/commands/$action.md"
[[ -r "$skill" && -r "$command" ]] || { printf 'Canonical instructions missing for %s\n' "$action" >&2; exit 1; }
printf 'B3_HOME=%s\nSKILL=%s\nCOMMAND=%s\n' "$b3_root" "$skill" "$command"
if [[ "$action" == autodev ]]; then printf 'WORKFLOW=%s/workflows/autonomous-development.md\n' "$b3_root"; fi
if [[ "$action" == review-loop ]]; then printf 'WORKFLOW=%s/review-loop/strategy.md\n' "$b3_root"; fi
