#!/usr/bin/env bash
# Install local Codex skill links using the canonical B3 adapter.
# Never rewrite tracked .b3/home or copy skill bodies into this product.
set -euo pipefail
product_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
verify_only=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --verify) verify_only=true; shift ;;
    --product-root) product_root="${2:?missing product root}"; shift 2 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; exit 1 ;;
  esac
done
product_root="$(cd "$product_root" && pwd -P)"
b3_ref=443443094192c3c062a5164aa46ced8577dd1efd
b3_repo=https://github.com/hptbee/b3_ai-engineering.git
b3_root="${B3_HOME:-}"
if [[ -z "$b3_root" ]]; then
  for home_file in "$product_root/.b3/cloud-home" "$product_root/.b3/home"; do
    if [[ -f "$home_file" ]]; then
      candidate="$(tr -d '\r\n' < "$home_file")"
      if [[ -f "$candidate/workflows/autonomous-development.md" ]]; then b3_root="$candidate"; break; fi
    fi
  done
fi
if [[ -z "$b3_root" ]]; then
  b3_root="$product_root/.b3/runtime/b3_ai-engineering"
  if $verify_only; then printf 'B3 is not installed. Run bash scripts/setup-b3-cloud.sh\n' >&2; exit 1; fi
  if [[ ! -e "$b3_root" ]]; then
    mkdir -p "$(dirname "$b3_root")"
    git clone --no-checkout "$b3_repo" "$b3_root"
    git -C "$b3_root" checkout --detach "$b3_ref"
  elif [[ "$(git -C "$b3_root" rev-parse HEAD)" != "$b3_ref" ]]; then
    printf 'Existing B3 cache has a different revision; refusing to reset it. Set B3_HOME explicitly.\n' >&2; exit 1
  fi
fi
b3_root="$(cd "$b3_root" && pwd -P)"
[[ -f "$b3_root/workflows/autonomous-development.md" && -f "$b3_root/adapters/install-product.sh" ]] || {
  printf 'B3_HOME is missing the canonical workflow or Linux adapter.\n' >&2; exit 1;
}
# Build the index through the official adapter in scratch space. Its generated
# pointers/commands never overwrite this checkout's Windows-specific files.
staging="$(mktemp -d)"
trap 'rm -rf "$staging"' EXIT
bash "$b3_root/adapters/install-product.sh" --product-root "$staging" --b3-home "$b3_root" --host codex > "$staging/install.log"
index="$product_root/.agents/skills"
[[ ! -L "$product_root/.agents" && ! -L "$index" ]] || {
  printf 'Refusing to replace an existing .agents or skill-index symlink.\n' >&2; exit 1;
}
[[ ! -e "$index" || -d "$index" ]] || { printf 'Skill index is not a directory.\n' >&2; exit 1; }
cloud_pointer="$product_root/.b3/cloud-home"
[[ ! -L "$cloud_pointer" ]] || { printf 'Refusing to overwrite a cloud-home symlink.\n' >&2; exit 1; }
if [[ -e "$cloud_pointer" ]]; then
  [[ -f "$cloud_pointer" && "$(tr -d '\r\n' < "$cloud_pointer")" == "$b3_root" ]] || {
    printf 'Conflicting cloud-home pointer (not overwritten).\n' >&2; exit 1;
  }
fi
# Preflight every destination before adding links; never replace user files.
for source in "$staging/.agents/skills/"*; do
  destination="$index/$(basename "$source")"
  if [[ -e "$destination" || -L "$destination" ]]; then
    [[ -L "$destination" && "$(readlink -f "$destination")" == "$(readlink -f "$source")" ]] || {
      printf 'Conflicting skill: %s (not overwritten)\n' "$destination" >&2; exit 1;
    }
  elif $verify_only; then
    printf 'Missing skill: %s\n' "$destination" >&2; exit 1
  fi
  [[ -f "$source/SKILL.md" ]] || { printf 'Broken canonical skill: %s\n' "$source" >&2; exit 1; }
done
if ! $verify_only; then
  mkdir -p "$index" "$product_root/.b3"
  for source in "$staging/.agents/skills/"*; do
    destination="$index/$(basename "$source")"
    if [[ ! -L "$destination" ]]; then ln -s "$(readlink "$source")" "$destination"; fi
  done
  printf '%s\n' "$b3_root" > "$product_root/.b3/cloud-home"
fi
[[ -f "$index/autodev/SKILL.md" ]] || { printf 'autodev is not readable.\n' >&2; exit 1; }
printf 'B3 skill links verified (%s); canonical workflow readable.\n' "$b3_root"
printf 'For shell commands: export B3_HOME="$(cat .b3/cloud-home)"\n'
printf 'Filesystem verification only; this does not register Codex cloud skills. Use plain-text B3 routing in AGENTS.md.\n'
