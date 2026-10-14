#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p docs/planning docs/architecture docs/engineering/meta docs/tuvi
mkdir -p docs/archive/planning docs/archive/implementation/p0-p1 docs/archive/specs
mkdir -p docs/archive/sprints/tuvi/sprint-{8,9,10} docs/archive/prompts docs/archive/audits

git mv docs/planning/AUTODEV_MASTER_PLAN_V2.md docs/planning/
git mv docs/planning/ROADMAP_SPRINT_9_14.md docs/planning/
git mv docs/planning/ROADMAP_NUMEROLOGY_A_TO_Z.md docs/planning/
git mv docs/archive/planning/AUTODEV_MASTER_PLAN.md docs/archive/planning/

git mv docs/architecture/ARCHITECTURAL_OVERVIEW.md docs/architecture/
git mv docs/architecture/CHART_DOMAIN_MODEL.md docs/architecture/

git mv docs/engineering/AGENT_ENGINEERING.md docs/engineering/
git mv docs/engineering/CONTRIBUTING.md docs/engineering/
git mv docs/engineering/AI_CONTEXT.md docs/engineering/
git mv docs/engineering/CODEX_CLOUD_B3.md docs/engineering/
git mv docs/engineering/TEST_FIXTURES.md docs/engineering/
git mv docs/quality docs/engineering/

git mv docs/tuvi/DOMAIN_KNOWLEDGE.md docs/tuvi/
git mv docs/tuvi/TU_VI_SCHOOL_VARIANTS.md docs/tuvi/
git mv docs/tuvi/TU_VI_SOURCE_REGISTRY.md docs/tuvi/
git mv docs/tuvi/PALACE_RELATIONSHIPS.md docs/tuvi/
git mv docs/tuvi/COMBINATION_SOURCE_MATRIX.md docs/tuvi/
git mv docs/tuvi/KNOWLEDGE_CLAIM_MODEL.md docs/tuvi/
git mv docs/tuvi/GOLDEN_TEST_REFERENCE.md docs/tuvi/
git mv docs/tuvi/PILOT_RULE_SOURCE_COMPARISON.md docs/tuvi/

git mv docs/archive/implementation/p0-p1/P0_IMPLEMENTATION_REPORT.md docs/archive/implementation/p0-p1/
git mv docs/archive/implementation/p0-p1/P1_1_CHART_MODEL_REPORT.md docs/archive/implementation/p0-p1/
git mv docs/archive/implementation/p0-p1/P1_2_RULE_ENGINE.md docs/archive/implementation/p0-p1/
git mv docs/archive/implementation/p0-p1/P1_2_5_DEEP_AUDIT.md docs/archive/implementation/p0-p1/
git mv docs/archive/implementation/p0-p1/P1_3_READINESS.md docs/archive/implementation/p0-p1/
git mv docs/archive/implementation/p0-p1/P1_3A_KNOWLEDGE_AUDIT.md docs/archive/implementation/p0-p1/
git mv docs/archive/implementation/p0-p1/P1_3A_1_SOURCE_VERIFICATION.md docs/archive/implementation/p0-p1/
git mv docs/archive/implementation/p0-p1/P1_3B_IMPLEMENTATION_PLAN.md docs/archive/implementation/p0-p1/

git mv docs/archive/specs/RULE_ENGINE_V2_VERIFICATION.md docs/archive/specs/
git mv docs/archive/specs/SQLITE_MIGRATION_VERIFICATION.md docs/archive/specs/
git mv docs/audits docs/archive/

git mv docs/archive/sprints/tuvi/sprint-9/SPRINT_9B_COMPLETION_REPORT.md docs/archive/sprints/tuvi/sprint-9/
git mv docs/archive/sprints/tuvi/sprint-9/SPRINT_9C_SOURCE_DISCOVERY_REPORT.md docs/archive/sprints/tuvi/sprint-9/
git mv docs/archive/sprints/tuvi/sprint-9/SPRINT_9_CLOSURE_REPORT.md docs/archive/sprints/tuvi/sprint-9/
git mv docs/archive/sprints/tuvi/sprint-9/SPRINT_9_FINAL_IMPLEMENTATION_REPORT.md docs/archive/sprints/tuvi/sprint-9/
git mv docs/archive/sprints/tuvi/sprint-9/SPRINT_9_FINAL_FORMULA_SPEC.md docs/archive/sprints/tuvi/sprint-9/
git mv docs/archive/sprints/tuvi/sprint-9/SPRINT_9_ADJUDICATION_MATRIX.md docs/archive/sprints/tuvi/sprint-9/
git mv docs/archive/sprints/tuvi/sprint-9/SPRINT_9D_SEVEN_CASE_ADJUDICATION.md docs/archive/sprints/tuvi/sprint-9/

git mv docs/archive/sprints/tuvi/sprint-10/SPRINT_10_OPERATOR_MATRIX.md docs/archive/sprints/tuvi/sprint-10/
git mv docs/archive/sprints/tuvi/sprint-10/SPRINT_10_RESEARCH_INVENTORY.md docs/archive/sprints/tuvi/sprint-10/
git mv docs/archive/sprints/tuvi/sprint-10/SPRINT_10_FINAL_REPORT.md docs/archive/sprints/tuvi/sprint-10/

git mv docs/archive/sprints/tuvi/sprint-8/SPRINT_8_FINAL_REPORT.md docs/archive/sprints/tuvi/sprint-8/

for f in docs/knowledge/research/B3_*.md docs/archive/prompts/CURSOR_PROMPT.md; do
  [ -f "$f" ] && git mv "$f" docs/archive/prompts/
done

echo "Documentation git mv complete"
