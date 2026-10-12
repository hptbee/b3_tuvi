---
name: autodev
description: Run the full development lifecycle from a requirement or plan until completion or a blocker. Use for autonomous implementation, resume, or status. Do not use for plan-only, a single implement, debug, one review, or review-loop-only.
---

# autodev

**Action now:** run autonomous development until `PASS`, `FAIL`, `INCOMPLETE`, or `BLOCKED`. Do not stop after the plan and wait for `/implement`. Do not stop after one task while other ready tasks remain — continue in this session (workflow **Continue**). Do not tell the user to run `/autodev resume` unless the session ended or the run is blocked.

This file is a **thin product-repo pointer**. It does not contain the procedure.

## Locate B3

Resolve `B3_HOME` in this order. Stop at the first match that contains `workflows/autonomous-development.md`:

1. Environment variable `B3_HOME`
2. Product git root file `.b3/home` (one line, absolute path)
3. This repository itself, if it contains `workflows/autonomous-development.md`

If none match → `BLOCKED`. Do not invent a second procedure. Do not copy B3 skills into this product repository.

**Workflow:** `{B3_HOME}/workflows/autonomous-development.md`

Load B3 skills, rules, review-loop, and agents from `B3_HOME`. Write checkpoints and make Git commits in this product repository.

| Argument | Behavior |
| --- | --- |
| Story, requirement, bug, refactor, or a path to one | Start or continue the lifecycle |
| Path to an existing plan | Validate it, then execute |
| `resume` | Reconcile `.b3/autodev/` with Git, then continue |
| `status` | Report the checkpoint. Do not implement |

You are the orchestrator in this session. Dispatch reviewer and fixer subagents when this host can isolate them. If it cannot, record that limit in `.b3/autodev/progress.md`.

`/plan`, `/implement`, `/debug`, `/review`, `/verify`, and `/review-loop` stay single-purpose. This command composes them; it does not replace their files.
