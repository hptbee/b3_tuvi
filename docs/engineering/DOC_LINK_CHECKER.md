# Documentation link checker

Command (repository root):

```bash
node scripts/check-doc-links.mjs
npm run docs:links
```

Regression tests:

```bash
node scripts/check-doc-links.test.mjs
```

## Scan scope

- `docs/**/*.md`
- Root `README.md`, `AGENTS.md`
- `rules/**/*.md` (includes backtick `docs/...` path validation)
- `.cursor/**/*.md`, `.agents/**/*.md`

## Supported link forms

| Form | Example (illustrative) | Validated |
| --- | --- | --- |
| Markdown relative | `[label](../planning/ROADMAP_SPRINT_9_14.md)` | Yes |
| Markdown root-relative | `[label](/README.md)` | Yes |
| Angle autolink | angle-bracket path under `docs/` | Yes |
| Rules backtick path | `` `docs/engineering/CONTRIBUTING.md` `` | Yes, in `rules/` only |
| Fragment only | `[§](#anchor)` | Skipped |
| External URL | `https://...` | Skipped |
| B3 system doc | `` `{B3_HOME}/docs/precedence.md` `` | Skipped (external to product tree) |
| B3 review-loop pointers | `../../review-loop/strategy.md` in `.cursor/commands` | Skipped |

## Not supported (by design)

- HTML `<a href="...">` tags
- Reference-style markdown links `[text][ref]` / `[ref]: url`
- Wiki links or include directives
- Import paths in source code (use backend tests separately)

Broken links fail CI (`docs` job in `.github/workflows/ci.yml`).
