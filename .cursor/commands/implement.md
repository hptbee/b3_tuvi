---
name: implement
description: Execute a plan or specified change using the default engineering loop. Use when the user asks to implement, build, or ship a change.
---

# implement

**Action now:** execute a plan or specified change using the default engineering loop.

**Skill:** `.cursor/skills/engineering/problem-solving/SKILL.md`

Load the smallest domain skill that matches the stack (React, Node, ASP.NET, Three.js, etc.).

Sequence: `workflows/feature-implementation.md`. Do not run the full review loop unless asked (`.cursor/commands/review-loop.md`).

A lifecycle that plans, implements, reviews, commits, and continues is `.cursor/commands/autodev.md`. This command stays one execution request.
