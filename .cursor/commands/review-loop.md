---
name: review-loop
description: Run the autonomous independent review loop to completion (quality gate, non-convergence, or iteration limit). Use when the user wants iterative review-and-fix, not a single pass.
---

# review-loop

**Action now:** run the autonomous review loop **to completion** (gate, stuck, or limit). Do not stop after the first findings list for the user to re-invoke this command.

**Orchestrator:** [`review-loop/strategy.md`](../../review-loop/strategy.md)

**Spec:** [`review-loop/spec.md`](../../review-loop/spec.md)

```text
Review → validate findings → fix valid ones → build/test → fresh review → …
```

- Size the PR first (`review-loop/sizing.md`). Small/medium = full-PR loop. Large = unit loops, then cross-cutting review.
- You are the orchestrator: dispatch Reviewer then Fixer (subagents if available, else hat-change). Do not review-and-fix in one pass.
- Reviewer does not edit. Fixer does not declare PASS. Only you declare PASS / INCOMPLETE / STOP.
- After every fix: fresh Reviewer pass on current code, not “did we fix R001?”
- One `review` command remains a **single** pass (`.cursor/commands/review.md`).

Slots: [`review-loop/models.md`](../../review-loop/models.md). Cursor two-model setup: [`adapters/cursor/review-loop-models.md`](../../adapters/cursor/review-loop-models.md).
