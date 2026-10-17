# Canonical sources of truth

Last rebaseline: 2026-10-14 (documentation architecture cleanup).

Planning precedence updated 2026-10-17: Knowledge-First Research Strategy is the active Tử Vi priority; existing engineering history and all source evidence remain in place.

| Concern | Authoritative location | Notes |
| --- | --- | --- |
| Tử Vi research strategy, backlog, inventory process, research statuses and metrics | [planning/ROADMAP_KNOWLEDGE_RESEARCH.md](../../planning/ROADMAP_KNOWLEDGE_RESEARCH.md) | Active knowledge-first priority; collected/source-reviewed/runtime-approved/public permissions stay separate |
| Tử Vi engineering task history and future AutoDev tracking | [planning/AUTODEV_MASTER_PLAN_V2.md](../../planning/AUTODEV_MASTER_PLAN_V2.md) | T030–T038 and unresolved T034 preserved; no current AutoDev invocation implied |
| Previous Tử Vi engineering sequence (Sprints 9–14) | [planning/ROADMAP_SPRINT_9_14.md](../../planning/ROADMAP_SPRINT_9_14.md) | Reference/deferred behind research strategy; historical baselines retained |
| Thần Số Học roadmap | [planning/ROADMAP_NUMEROLOGY_A_TO_Z.md](../../planning/ROADMAP_NUMEROLOGY_A_TO_Z.md) | |
| System architecture | [architecture/ARCHITECTURAL_OVERVIEW.md](../../architecture/ARCHITECTURAL_OVERVIEW.md) | |
| Normalized chart model | [architecture/CHART_DOMAIN_MODEL.md](../../architecture/CHART_DOMAIN_MODEL.md) | |
| Agent / contributor rules | [engineering/AGENT_ENGINEERING.md](../AGENT_ENGINEERING.md), [engineering/CONTRIBUTING.md](../CONTRIBUTING.md) | |
| Backend test fixtures | [engineering/TEST_FIXTURES.md](../TEST_FIXTURES.md) | Enforced by `fixtureClasses.test.mjs` |
| Tử Vi domain terms | [tuvi/DOMAIN_KNOWLEDGE.md](../../tuvi/DOMAIN_KNOWLEDGE.md) | |
| Source / provenance policy | [tuvi/KNOWLEDGE_CLAIM_MODEL.md](../../tuvi/KNOWLEDGE_CLAIM_MODEL.md), [knowledge/provenance-contract.json](../../knowledge/provenance-contract.json) | |
| Runtime knowledge registry | [knowledge/sources.json](../../knowledge/sources.json), [knowledge/combination-source-matrix.json](../../knowledge/combination-source-matrix.json) | Imported by backend |
| Formula V1 (executable) | `backend/src/data/formulaV1.mjs` (called from `backend/src/engine/combinationMatch.js`) | Human spec: [archive sprint 9 spec](../../archive/sprints/tuvi/sprint-9/SPRINT_9_FINAL_FORMULA_SPEC.md). There is no `backend/src/engine/formulaV1.mjs`. |
| Rule engine v2 snapshot | `backend/src/data/rulesV2.json` | Research/historical; not runtime matcher |
| Condition engine (Sprint 10) | `backend/src/engine/conditionEval.js` | Report: [SPRINT_10_FINAL_REPORT.md](../../archive/sprints/tuvi/sprint-10/SPRINT_10_FINAL_REPORT.md) |
| Thần Số Học formulas | [numerology/FORMULA_SPEC.md](../../numerology/FORMULA_SPEC.md) | |
| Thần Số Học API | [numerology/API_CONTRACT.md](../../numerology/API_CONTRACT.md) | |
| Thần Số Học release gates | [numerology/RELEASE_READINESS.md](../../numerology/RELEASE_READINESS.md) | |
| CI / quality baselines | [engineering/quality/](../quality/) | |
| Documentation index | [README.md](../../README.md) | This file’s parent index |
