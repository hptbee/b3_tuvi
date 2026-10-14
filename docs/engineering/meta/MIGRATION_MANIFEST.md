# Documentation migration manifest (2026-10-14)

Bulk path updates were applied with `scripts/apply-doc-path-migration.mjs` from `scripts/doc-path-migration-map.json`. Below is the human-readable summary.

## Planning

| Old path | New path |
| --- | --- |
| `docs/AUTODEV_MASTER_PLAN_V2.md` | `docs/planning/AUTODEV_MASTER_PLAN_V2.md` |
| `docs/AUTODEV_MASTER_PLAN.md` | `docs/archive/planning/AUTODEV_MASTER_PLAN.md` |
| `docs/ROADMAP_SPRINT_9_14.md` | `docs/planning/ROADMAP_SPRINT_9_14.md` |
| `docs/ROADMAP_NUMEROLOGY_A_TO_Z.md` | `docs/planning/ROADMAP_NUMEROLOGY_A_TO_Z.md` |

## Architecture and engineering

| Old path | New path |
| --- | --- |
| `docs/ARCHITECTURAL_OVERVIEW.md` | `docs/architecture/ARCHITECTURAL_OVERVIEW.md` |
| `docs/CHART_DOMAIN_MODEL.md` | `docs/architecture/CHART_DOMAIN_MODEL.md` |
| `docs/AGENT_ENGINEERING.md` | `docs/engineering/AGENT_ENGINEERING.md` |
| `docs/CONTRIBUTING.md` | `docs/engineering/CONTRIBUTING.md` |
| `docs/AI_CONTEXT.md` | `docs/engineering/AI_CONTEXT.md` |
| `docs/CODEX_CLOUD_B3.md` | `docs/engineering/CODEX_CLOUD_B3.md` |
| `docs/TEST_FIXTURES.md` | `docs/engineering/TEST_FIXTURES.md` |
| `docs/quality/` | `docs/engineering/quality/` |

## Tử Vi domain (human docs)

| Old path | New path |
| --- | --- |
| `docs/DOMAIN_KNOWLEDGE.md` | `docs/tuvi/DOMAIN_KNOWLEDGE.md` |
| `docs/TU_VI_*`, `PALACE_*`, `COMBINATION_*`, etc. | `docs/tuvi/` (same filenames) |

## Archives

| Old path | New path |
| --- | --- |
| `docs/P0_*`, `docs/P1_*` | `docs/archive/implementation/p0-p1/` |
| `docs/RULE_ENGINE_V2_VERIFICATION.md` | `docs/archive/specs/` |
| `docs/SQLITE_MIGRATION_VERIFICATION.md` | `docs/archive/specs/` |
| `docs/audits/` | `docs/archive/audits/` |
| `docs/knowledge/SPRINT_9*.md` | `docs/archive/sprints/tuvi/sprint-9/` |
| `docs/knowledge/SPRINT_10*.md` | `docs/archive/sprints/tuvi/sprint-10/` |
| `docs/engineering/quality/SPRINT_8_FINAL_REPORT.md` | `docs/archive/sprints/tuvi/sprint-8/` |
| `docs/knowledge/research/B3_*.md`, `CURSOR_PROMPT.md` | `docs/archive/prompts/` |

## Rationale

- Separate **active navigation** (planning, architecture, engineering, domain) from **historical sprint artifacts** and **one-off prompts**.
- Keep **executable knowledge** under `docs/knowledge/` unchanged.
- Preserve git history via `git mv`.
