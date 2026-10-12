---
type: rule
strength: hard
scope: global
source: synthesized
authority: high
---

# Portability

Hard rule: portable **meaning** (`AGENTS.md`, `docs/`, `rules/` bodies, Agent Skills, `knowledge/`, `research/`, review-loop spec) must not be rewritten per host.

Hard rule: Cursor is the first host. Skills, commands, and agents live in `.cursor/` so discovery works on a fresh clone (decision-009). That location is a discovery choice, not a meaning fork.

Hard rule: host-only metadata (`.mdc` frontmatter, hooks, MCP, command IDs, other-host trees) belongs in `.cursor/rules` activation files or `adapters/`. Adapters may map or generate; they may not fork meaning.

Strong guideline: prefer Markdown, `SKILL.md`, YAML frontmatter, and plain shell/Node/Python scripts.

Strong guideline: if a skill cannot be followed without a specific host feature, the skill is not ready — extract the portable method, then adapt.
