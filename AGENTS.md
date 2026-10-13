# AGENTS.md

This product repository is attached to B3. Do not copy B3 skills into this repo. Load the smallest relevant slice.

## Locate B3

Resolve `B3_HOME` in this order. Stop at the first match that contains `workflows/autonomous-development.md`:

1. Environment variable `B3_HOME`
2. Product git root file `.b3/cloud-home` (ignored Linux/cloud installation pointer)
3. Product git root file `.b3/home` (one line, absolute path; may be Windows-specific)

If none match on Linux/cloud, run `bash scripts/setup-b3-cloud.sh` once to install the canonical B3 dependency and skill links, then resolve again. Do not invent an autonomous procedure or copy skill bodies. If installation fails, report the exact blocker.

In cloud sessions use the resolved absolute path as `B3_HOME` when following a canonical skill. For shell commands: `export B3_HOME="$(cat .b3/cloud-home)"`. Never rewrite tracked `.b3/home` merely to adapt a Windows checkout to Linux.

## What to load

| Need | Location |
| --- | --- |
| Skills | This repo `.agents/skills/<name>/SKILL.md` (local junctions). Canonical source is B3; do not edit through the link. |
| Commands (Cursor slash) | This repo `.cursor/commands/` |
| Rules | `{B3_HOME}/rules/*.md` |
| Workflows | `{B3_HOME}/workflows/` |
| Review loop | `{B3_HOME}/review-loop/` |
| Isolated roles | `{B3_HOME}/.cursor/agents/` |

Product files and Git commits stay in this repository. Checkpoints go under `.b3/autodev/` (gitignored).

## Codex invocation

Codex does **not** load `.cursor/commands/` as slash commands (`/autodev` is Cursor-only). Use **skills**:

| Intent | Invoke |
| --- | --- |
| Autonomous lifecycle | `$autodev` (also `/skills` → autodev) |
| Plan only | `$plan` |
| Implement | `$implement` |
| Debug | `$debug` |
| Review | `$review` |
| Verify | `$verify` |
| Review loop | `$review-loop` |

When the user asks to execute “autodev”, “run autodev”, or `$autodev`, **read and follow** `.agents/skills/autodev/SKILL.md`, then `{B3_HOME}/workflows/autonomous-development.md`. Do not stop after the plan. Installation/troubleshooting requests are not instructions to launch development of unrelated backlog items.

A running cloud chat may not refresh its skill picker after installation. If `$autodev` is absent from the host catalog, follow the same local `SKILL.md` and canonical workflow by explicit file path; do not claim picker discovery was verified. A fresh task may be required for native discovery.

For review-loop delegation, send `{B3_HOME}/.cursor/agents/reviewer.md`, `fixer.md`, `security-reviewer.md`, or `architecture-reviewer.md` to an isolated agent when available. The parent owns `PASS`, `FAIL`, and `UNKNOWN / INCOMPLETE`.

## Operating constraints

1. Apply `{B3_HOME}/rules/` with the precedence stack; preferences do not silently win.
2. Load the smallest relevant skill. Do not load every skill.
3. Failed tool, missing evidence, empty named review target, or iteration limit → `UNKNOWN / INCOMPLETE`, not `PASS`.
4. Do not copy `{B3_HOME}/.cursor/skills` into this product.
5. `.agents/skills` is a local installation index (one folder per skill), not a second editable skill tree.

Cursor also discovers `.agents/skills`. If this checkout is opened in Cursor, skills may appear twice unless other discovery roots for the same tree are removed.
