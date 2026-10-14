# Documentation lifecycle policy

Applies to `hptbee/b3_tuvi` and B3 AutoDev runs attached to this repository.

## Canonical vs supporting vs archive

- **Canonical** documents are listed in [engineering/meta/CANONICAL_SOURCES.md](engineering/meta/CANONICAL_SOURCES.md). Only one active tracker per concern (e.g. `planning/AUTODEV_MASTER_PLAN_V2.md` for Tử Vi AutoDev tasks).
- **Supporting** documents explain how to work in the repo (engineering, domain references, numerology specs).
- **Research evidence** lives primarily under `docs/knowledge/` (JSON decisions, passages, reviews). Superseded one-off research dossiers and execution prompts may live under `docs/archive/prompts/` with JSON companions remaining in `docs/knowledge/research/`. Treat as evidence, not as “current product behavior” unless cross-checked with code.
- **Historical** sprint reports, P0/P1 write-ups, and superseded prompts live under `docs/archive/`. Do not rewrite historical conclusions to match today’s code; add a new active doc or archive note instead.

## When to create a document

Create a new markdown file when:

- A **new canonical concern** appears (e.g. a new domain API contract) and no existing canonical doc covers it.
- A **sprint or phase completes** and needs a durable report (place under `docs/archive/sprints/…`, not next to active roadmaps).
- **Research** produces a decision record or evidence bundle (under `docs/knowledge/`, following existing JSON/span conventions).

Do **not** create duplicate master plans, roadmaps, or “final final” reports for unchanged content.

## When to update

- **Roadmaps and AUTODEV_MASTER_PLAN_V2:** update task status when a sprint task completes; cite PR/commit evidence.
- **Architecture / AI context:** update when public API boundaries or primary modules change.
- **Numerology IMPLEMENTATION_STATUS / API_CONTRACT:** update when shipped behavior changes.

Prefer editing the canonical file over adding a parallel summary.

## When to archive

Move (with `git mv`) to `docs/archive/` when:

- The document describes a **completed phase** (P0/P1, closed sprint) and is no longer the operational entrypoint.
- A **prompt or one-off execution brief** is superseded by workflow or policy.
- An audit or verification checklist refers to **superseded runtime** (e.g. rule engine v2 as primary matcher).

Record old → new paths in [engineering/meta/MIGRATION_MANIFEST.md](engineering/meta/MIGRATION_MANIFEST.md) when moving.

## Naming

- **Plans / roadmaps:** `ROADMAP_*`, `AUTODEV_MASTER_PLAN_V2.md`, domain `*_MASTER_PLAN.md` under the domain folder.
- **Specs:** `*_SPEC.md`, `API_CONTRACT.md` in domain folders.
- **Sprint reports:** `SPRINT_<n>_*.md` under `docs/archive/sprints/<domain>/sprint-<n>/`.
- **Research decisions:** JSON under `docs/knowledge/decisions/` or `docs/knowledge/research/sprint-9c/decisions/`; do not rename slugs without migration.

## Evidence and provenance

Attach source locators (edition, page, span file, review JSON refs) in knowledge JSON, not only in prose. Follow [KNOWLEDGE_CLAIM_MODEL.md](tuvi/KNOWLEDGE_CLAIM_MODEL.md) and `docs/knowledge/provenance-contract.json`.

Software tests passing does **not** upgrade source verification or interpretation approval.

## AutoDev after each sprint

1. Update **AUTODEV_MASTER_PLAN_V2** (or numerology equivalent) with status and evidence links.
2. Add or update **one** sprint report under `docs/archive/sprints/` if the sprint closes a scoped body of work.
3. Update **roadmap** rebaseline section only with verified facts (merge commits, CI runs).
4. Run `node scripts/check-doc-links.mjs` before opening a PR.
5. Do not move path-sensitive knowledge files without updating every consumer (see PATH_SENSITIVE_FILES.md).

## Link integrity in CI

`.github/workflows/ci.yml` runs `node scripts/check-doc-links.mjs` on all pushes and pull requests. Fix broken relative links in the same PR as file moves; use `scripts/doc-path-migration-map.json` for bulk path updates when reorganizing.
