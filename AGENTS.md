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

## Codex cloud invocation: plain-text routing

Codex cloud's supplied skill catalog is separate from repository files. Readable
`.agents/skills` links do not register B3 in that catalog. Do not require `$skill`,
`/skills`, or a Cursor slash command before carrying out a B3 request. Do not
suggest restarting/publishing as proof that native discovery will work.

When the user sends a plain-text request such as `B3: autodev <requirement>`,
`B3: autodev status`, or `B3: plan <requirement>`:

1. Resolve B3 using the map above; bootstrap if absent.
2. Run `bash scripts/b3-paths.sh <action>` to locate canonical instructions.
3. Read the emitted `SKILL` and `COMMAND` files. For autodev also read the emitted
   `WORKFLOW`; for review-loop read its strategy/spec. Treat the resolved absolute
   root as `B3_HOME` in these instructions even if the committed pointer is Windows-specific.
4. Follow the canonical procedure with the user's argument in this product
   checkout. **Reading instructions is not completing the requested action.**
   Continue execution to the procedure's outcome; for `status`, inspect checkpoint
   and Git only, without starting or resuming implementation.
5. Report the outcome and evidence. Do not describe this as native skill activation.

| Plain-text request | Canonical action |
| --- | --- |
| `B3: autodev <requirement or plan path>` | Full autonomous lifecycle; do not stop at the plan |
| `B3: autodev resume` | Reconcile checkpoint and Git, then continue |
| `B3: autodev status` | Read-only checkpoint/Git report |
| `B3: plan <requirement>` | Plan only |
| `B3: implement <plan or change>` | Execute the specified change |
| `B3: debug <failure>` | Diagnose before fixing |
| `B3: review <target>` | One evidence-based review |
| `B3: verify <claim>` | Verification with actual evidence |
| `B3: review-loop <target>` | Independent iterative review/fix procedure |

Equivalent plain-language requests naming the B3 action route the same way.
If a host actually exposes `$autodev` or another B3 skill, its body is the same
canonical source. Installation/troubleshooting mentions are not requests to
launch unrelated autodev backlog work.

For review-loop delegation, read canonical role files at
`{B3_HOME}/.cursor/agents/` before sending isolated tasks. The parent owns
`PASS`, `FAIL`, and `UNKNOWN / INCOMPLETE`.

## Operating constraints

1. Apply `{B3_HOME}/rules/` with the precedence stack; preferences do not silently win.
2. Load the smallest relevant skill. Do not load every skill.
3. Failed tool, missing evidence, empty named review target, or iteration limit → `UNKNOWN / INCOMPLETE`, not `PASS`.
4. Do not copy `{B3_HOME}/.cursor/skills` into this product.
5. `.agents/skills` is a local installation index (one folder per skill), not a second editable skill tree.

Cursor also discovers `.agents/skills`. If this checkout is opened in Cursor, skills may appear twice unless other discovery roots for the same tree are removed.
