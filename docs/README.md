# Documentation index (`b3_tuvi`)

Single navigation entry for human-readable documentation. Runtime knowledge JSON, decision records, passages, and reviews stay under [`knowledge/`](knowledge/) with stable paths (see [path-sensitive files](engineering/meta/PATH_SENSITIVE_FILES.md)).

## Start here

| Need | Canonical document |
| --- | --- |
| Product overview | [Repository README](../README.md) |
| Agent / AutoDev routing | [AGENTS.md](../AGENTS.md), [Agent engineering](engineering/AGENT_ENGINEERING.md) |
| What to change and how | [Contributing](engineering/CONTRIBUTING.md) |
| Documentation maintenance | [Documentation policy](DOCUMENTATION_POLICY.md) |

## Planning and task tracking

| Document | Role |
| --- | --- |
| [AUTODEV_MASTER_PLAN_V2.md](planning/AUTODEV_MASTER_PLAN_V2.md) | **Active** Tử Vi AutoDev task tracker |
| [ROADMAP_SPRINT_9_14.md](planning/ROADMAP_SPRINT_9_14.md) | Tử Vi roadmap (Sprints 9–14) |
| [ROADMAP_NUMEROLOGY_A_TO_Z.md](planning/ROADMAP_NUMEROLOGY_A_TO_Z.md) | Thần Số Học roadmap |
| [AUTODEV_MASTER_PLAN.md](archive/planning/AUTODEV_MASTER_PLAN.md) | Historical V1 plan (locked; do not edit for V2 status) |

Do not create a competing “Master Plan V3”. Completed sprint **reports** live under [`archive/sprints/`](archive/sprints/).

## Architecture and engineering

| Document | Role |
| --- | --- |
| [ARCHITECTURAL_OVERVIEW.md](architecture/ARCHITECTURAL_OVERVIEW.md) | Current system architecture (Tử Vi data flow) |
| [CHART_DOMAIN_MODEL.md](architecture/CHART_DOMAIN_MODEL.md) | Normalized chart model |
| [AI_CONTEXT.md](engineering/AI_CONTEXT.md) | File map for developers and agents |
| [TEST_FIXTURES.md](engineering/TEST_FIXTURES.md) | Backend test fixture classification |
| [quality/](engineering/quality/) | Test strategy, coverage baselines, release readiness notes |
| [CHANGELOG.md](CHANGELOG.md) | Product changelog |

## Tử Vi domain

| Document | Role |
| --- | --- |
| [DOMAIN_KNOWLEDGE.md](tuvi/DOMAIN_KNOWLEDGE.md) | Domain terminology and rules |
| [TU_VI_SCHOOL_VARIANTS.md](tuvi/TU_VI_SCHOOL_VARIANTS.md) | School variants |
| [KNOWLEDGE_CLAIM_MODEL.md](tuvi/KNOWLEDGE_CLAIM_MODEL.md) | Claim and provenance model |
| [knowledge/](knowledge/) | Sources, matrix, decisions, research evidence (includes runtime JSON) |

**Live formula spec:** Formula V1 in code (`backend/src/engine/formulaV1.mjs`); human spec in [SPRINT_9_FINAL_FORMULA_SPEC.md](archive/sprints/tuvi/sprint-9/SPRINT_9_FINAL_FORMULA_SPEC.md). `rulesV2.json` is a research snapshot, not the runtime matcher.

**Active backlog (research):** [UNRESOLVED_COMBINATIONS.md](knowledge/UNRESOLVED_COMBINATIONS.md), [RULE_REMEDIATION_BACKLOG.md](knowledge/RULE_REMEDIATION_BACKLOG.md).

## Thần Số Học domain

| Document | Role |
| --- | --- |
| [numerology/IMPLEMENTATION_STATUS.md](numerology/IMPLEMENTATION_STATUS.md) | Current capability snapshot |
| [numerology/FORMULA_SPEC.md](numerology/FORMULA_SPEC.md) | Formula specification |
| [numerology/API_CONTRACT.md](numerology/API_CONTRACT.md) | API contract |
| [numerology/RELEASE_READINESS.md](numerology/RELEASE_READINESS.md) | Release gates |

## Archives and evidence

| Location | Contents |
| --- | --- |
| [archive/implementation/p0-p1/](archive/implementation/p0-p1/) | P0/P1 implementation reports |
| [archive/sprints/tuvi/](archive/sprints/tuvi/) | Sprint 8–10 Tử Vi completion reports |
| [archive/prompts/](archive/prompts/) | Superseded Cursor/B3 execution prompts |
| [archive/audits/](archive/audits/) | Historical repository audits |
| [archive/specs/](archive/specs/) | Superseded verification specs (e.g. rule engine v2 checklist) |

## Meta (documentation system)

| Document | Role |
| --- | --- |
| [CANONICAL_SOURCES.md](engineering/meta/CANONICAL_SOURCES.md) | Source-of-truth map |
| [MIGRATION_MANIFEST.md](engineering/meta/MIGRATION_MANIFEST.md) | Path moves from 2026-10-14 restructure |
| [DOCUMENTATION_INVENTORY.json](engineering/meta/DOCUMENTATION_INVENTORY.json) | Generated file inventory |
| [PATH_SENSITIVE_FILES.md](engineering/meta/PATH_SENSITIVE_FILES.md) | Files that must not move casually |
| [DOCUMENTATION_RESTRUCTURE_REPORT.md](engineering/meta/DOCUMENTATION_RESTRUCTURE_REPORT.md) | 2026-10-14 cleanup summary |

## Link integrity

Run from repository root:

```bash
node scripts/check-doc-links.mjs
```

CI runs the same check on every push and pull request.
