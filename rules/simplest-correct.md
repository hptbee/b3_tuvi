---
type: rule
strength: strong
scope: architecture
source: synthesized
authority: high
---

# Simplest correct solution

Strong guideline: prefer the **simplest architecture that meets stated requirements** over extra layers, buses, or service splits.

This is not a ban on complexity. Named requirements (scale, isolation, compliance, team boundaries) may justify more architecture.

Do not introduce Clean Architecture, CQRS, microservices, or a mediator solely because they are fashionable.

Do not use this rule to demand the shortest possible function body; that is smallest-change (`engineering-principles`).

Skip this guideline only with a **named requirement** (scale, team boundary, consistency, compliance) recorded in the working notes.

Method: `.cursor/skills/architecture/simplest-correct/SKILL.md`.

Hard rules (verification honesty, safety) still win (`docs/precedence.md`).
