# Documentation restructure report (2026-10-14)

## Outcome

PASS for scoped documentation architecture cleanup on branch `cursor/docs-architecture-cleanup-69e0`. Runtime knowledge JSON/decision trees unchanged except markdown relocation and link updates. Backend `npm run test:ci`, frontend lint/test/build, and `node scripts/check-doc-links.mjs` executed successfully in the agent environment.

## Before → after (top level)

**Before:** flat `docs/*.md` mix of P0/P1 reports, roadmaps, architecture, and domain docs; sprint reports beside executable JSON in `docs/knowledge/`; quality under `docs/quality/`.

**After:**

```text
docs/
├── README.md                 # navigation entrypoint
├── DOCUMENTATION_POLICY.md
├── CHANGELOG.md
├── planning/                 # active roadmaps + AUTODEV V2
├── architecture/
├── engineering/              # CONTRIBUTING, tests, quality/
│   └── meta/                 # inventory, canonical map, manifest
├── tuvi/                     # domain reference docs
├── numerology/               # unchanged layout
├── knowledge/                # runtime JSON + research (stable paths)
└── archive/
    ├── planning/             # AUTODEV V1
    ├── implementation/p0-p1/
    ├── sprints/tuvi/sprint-{8,9,10}/
    ├── prompts/
    ├── audits/
    └── specs/
```

## Deliverables index

| # | Artifact | Location |
| --- | --- | --- |
| 1 | Before/after trees | This file § above |
| 2 | Inventory + classification | [DOCUMENTATION_INVENTORY.json](./DOCUMENTATION_INVENTORY.json) |
| 3 | Canonical map | [CANONICAL_SOURCES.md](./CANONICAL_SOURCES.md) |
| 4 | Migration manifest | [MIGRATION_MANIFEST.md](./MIGRATION_MANIFEST.md) |
| 5 | Duplicates/superseded analysis | Archive prompts + `archive/specs/`; no duplicate master plans |
| 6 | Path-sensitive list | [PATH_SENSITIVE_FILES.md](./PATH_SENSITIVE_FILES.md) |
| 7 | Link validation | `scripts/check-doc-links.mjs` (CI `docs` job) |
| 8 | Tests | Backend/frontend CI commands (see verification log in PR) |
| 9 | Open issues | `rules/*.md` pointers to missing `docs/precedence.md` / `docs/research-methodology.md` (pre-existing; outside doc scan roots) |
| 10 | Maintenance rules | [DOCUMENTATION_POLICY.md](../../DOCUMENTATION_POLICY.md) |
| 11 | PR | Draft PR on `cursor/docs-architecture-cleanup-69e0` |

## Drift resolutions (active docs)

- **AI_CONTEXT.md:** documents Formula V1 as runtime matcher; `rulesV2.json` as research snapshot.
- **ROADMAP_SPRINT_9_14.md:** sprint report links point to `archive/sprints/`; engineering links use `../engineering/` and `../tuvi/`.
- **Numerology cross-links:** roadmaps under `docs/planning/`.

## Preserved without move

All `docs/knowledge/*.json` imported by backend, `decisions/`, `passages/`, `reviews/`, and `research/sprint-9c/` decision graph. See PATH_SENSITIVE_FILES.md.
