#!/usr/bin/env bash
# Regression checks for the product's cloud installer, using canonical B3.
set -euo pipefail
product_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
b3_root="${B3_HOME:-$(cat "$product_root/.b3/cloud-home")}"
scratch="$(mktemp -d)"
trap 'rm -rf "$scratch"' EXIT
installer="$product_root/scripts/setup-b3-cloud.sh"
mkdir -p "$scratch/product/.b3" "$scratch/product/.cursor"
printf 'D:\\Project\\b3_ai-engineering\n' > "$scratch/product/.b3/home"
printf 'keep existing instructions\n' > "$scratch/product/.cursor/README.md"
cp "$scratch/product/.b3/home" "$scratch/windows-home"
B3_HOME="$b3_root" bash "$installer" --product-root "$scratch/product" > /dev/null
B3_HOME="$b3_root" bash "$installer" --product-root "$scratch/product" > /dev/null
B3_HOME="$b3_root" bash "$installer" --product-root "$scratch/product" --verify > /dev/null
cmp "$scratch/windows-home" "$scratch/product/.b3/home"
grep -q 'keep existing instructions' "$scratch/product/.cursor/README.md"
[[ -L "$scratch/product/.agents/skills/autodev" && -f "$scratch/product/.agents/skills/autodev/SKILL.md" ]]
printf 'PASS: installs links, repeats safely, preserves Windows pointer and Cursor files\n'
mkdir -p "$scratch/conflict/.agents/skills/autodev"
printf 'user content\n' > "$scratch/conflict/.agents/skills/autodev/SKILL.md"
if B3_HOME="$b3_root" bash "$installer" --product-root "$scratch/conflict" > "$scratch/conflict.log" 2>&1; then
  printf 'FAIL: conflicting user skill was accepted\n' >&2; exit 1
fi
grep -q 'Conflicting skill' "$scratch/conflict.log"
grep -q 'user content' "$scratch/conflict/.agents/skills/autodev/SKILL.md"
[[ ! -e "$scratch/conflict/.b3/cloud-home" ]]
[[ "$(find "$scratch/conflict/.agents/skills" -mindepth 1 -maxdepth 1 | wc -l)" -eq 1 ]]
printf 'PASS: conflicting skill refused before adding links; user content preserved\n'
mkdir -p "$scratch/missing"
if B3_HOME= bash "$installer" --product-root "$scratch/missing" --verify > "$scratch/missing.log" 2>&1; then
  printf 'FAIL: missing installation passed verification\n' >&2; exit 1
fi
[[ ! -e "$scratch/missing/.b3" ]]
printf 'PASS: verification reports missing installation without cloning\n'
mkdir -p "$scratch/fresh/.b3"
cp "$scratch/windows-home" "$scratch/fresh/.b3/home"
B3_HOME= bash "$installer" --product-root "$scratch/fresh" > "$scratch/fresh.log" 2>&1
B3_HOME= bash "$installer" --product-root "$scratch/fresh" --verify > /dev/null
cmp "$scratch/windows-home" "$scratch/fresh/.b3/home"
[[ "$(git -C "$scratch/fresh/.b3/runtime/b3_ai-engineering" rev-parse HEAD)" == 443443094192c3c062a5164aa46ced8577dd1efd ]]
printf 'PASS: fresh cloud bootstrap clones pinned dependency and resolves its local pointer\n'
for action in autodev plan implement debug review verify review-loop; do
  paths="$(B3_HOME="$b3_root" bash "$product_root/scripts/b3-paths.sh" "$action")"
  while IFS='=' read -r kind path; do
    case "$kind" in
      SKILL|COMMAND|WORKFLOW) [[ -r "$path" ]] || { printf 'FAIL: missing %s for %s\n' "$kind" "$action" >&2; exit 1; } ;;
    esac
  done <<< "$paths"
done
if bash "$product_root/scripts/b3-paths.sh" not-a-command > /dev/null 2>&1; then
  printf 'FAIL: unsupported B3 action accepted\n' >&2; exit 1
fi
printf 'PASS: all seven cloud actions resolve readable canonical instructions; unknown action rejected\n'
