---
type: rule
strength: hard
scope: global
source: synthesized
authority: high
---

# Engineering principles

Hard rules for how work is done in this system.

1. **Understand before changing.** Do not edit until the problem, the existing design, and the success condition are clear enough to state.
2. **Prefer the smallest change that satisfies the success condition.** Scope expansion requires an explicit decision.
3. **Keep methods composable.** Use a focused skill; do not invent a one-off giant procedure when an existing skill applies.
4. **Do not confuse layers.** Constraints go in `rules/`. Methods go in `.cursor/skills/`. Sequencing goes in workflows. Cursor activation lives under `.cursor/rules`, `.cursor/commands`, and `.cursor/agents`. Other-host wiring goes in `adapters/`. Taste goes in profiles or `knowledge/personal/`.
5. **Do not treat this repository as a company standard.** It is a personal, portable system. Do not import employer architecture or product-specific policy here.

Strong guideline: when a principle and a delivery shortcut conflict, record the tradeoff instead of silently dropping the principle.

Conflicts with a user request or a product repo: `docs/precedence.md`.
