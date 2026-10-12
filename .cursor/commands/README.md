# Commands

Commands are explicit, user-triggered operations. They answer: **what action should the agent perform now?**

In Cursor these files are slash-invocable. Each file selects skills; it does not duplicate skill text.

| Command | Intent |
| --- | --- |
| [`plan.md`](plan.md) | Implementation plan, no coding |
| [`implement.md`](implement.md) | Execute via problem-solving + domain skills |
| [`debug.md`](debug.md) | Root-cause investigation |
| [`review.md`](review.md) | One code-review pass |
| [`verify.md`](verify.md) | Evidence for a named claim |
| [`review-loop.md`](review-loop.md) | One-shot independent loop to gate/stuck/limit |
| [`autodev.md`](autodev.md) | Full lifecycle until completion, blocker, or `status` |

Slash discovery in Cursor is **INTENDED** (files live at `.cursor/commands/`). Runtime `/` UX is **NOT VERIFIED** in this change.

## Design notes

- A command selects skills and maybe a workflow.
- Do not add a command that is only an alias of a skill name unless users invoke it explicitly.
