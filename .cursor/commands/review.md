---
name: review
description: One evidence-based code-review pass on the current change. Not the full independent review loop.
---

# review

**Action now:** one evidence-based review pass on the current change (diff/PR).

**Skill:** `.cursor/skills/engineering/code-review/SKILL.md`

This is **not** the full independent review loop. For the loop: `.cursor/commands/review-loop.md` and `review-loop/spec.md`.

Covers all core review dimensions: architecture, correctness, security, performance, simplification / implementation residue, tests, maintainability. Evaluates whether every meaningful piece of complexity in the diff still has a current responsibility.

Optional depth: `api-security`, `accessibility`, `react-performance`, `threejs-performance`, `ef-core` when those dimensions apply. Independent `performance-reviewer` only for hot-path diffs (`review-loop/strategy.md` routing) — not every PR.
