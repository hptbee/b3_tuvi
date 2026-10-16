# B3 Tử Vi testing policy

This is the canonical project policy for choosing and reporting tests. It applies to B3 Tử Vi, not the global B3 engineering skills. Use the lowest test level that reliably catches the behavior at risk.

## Priority and selection

1. **Unit tests first.** Use the existing Node assertion scripts for backend calculations and predicates; use Vitest/React Testing Library for component state, validation and rendering.
2. **Integration tests** protect cross-module and HTTP contracts, including source decisions, profile isolation, errors, privacy and persistence boundaries.
3. **Non-browser pipeline/smoke tests** are justified when they exercise meaningful integration behavior. A listening port, build success or trivial mocked response does not prove a calculation or API works.
4. **Browser E2E is exceptional.** Use Playwright only for a specific browser integration risk that cannot be reliably checked below that level, such as browser print/download behavior, focus/keyboard interaction across real pages, or viewport/layout integration. Explain that risk in the change description.

Backend-only changes, including Đại hạn/Tiểu hạn formulas, do not require new Playwright tests or browser runs. Do not launch a browser to verify a domain formula. For future UI work, prefer component tests where sufficient. Preserve existing browser tests unless evidence establishes that a particular test is redundant; this policy is not authorization to delete security, privacy, API or domain regressions.

## Domain unit-test priorities

Prioritize calendar conversion and lunar/solar boundaries; star/palace placement; heavenly stems and earthly branches; Đại hạn/Tiểu hạn limits; formation matching and rule predicates; source-specific variants; approved versus unapproved execution; missing, malformed or conflicting metadata; and regressions from confirmed defects.

For each implemented or approved domain rule, cover applicable positive, negative, boundary, variant/profile, invalid-input and previously discovered regression cases. Explain categories that cannot apply. Use table-driven tests when they make independent cases clearer, without duplicating every case through every test layer.

Expected results must come from independently justified calculations, accepted source decisions or previously verified fixtures. Do not generate expected values by calling the function being tested. For source-scoped rules, test the exact reviewed operands and exclusions, closed states, immutable evidence, profile isolation and public withholding. Synthetic metadata mutations belong in structural validation tests; never present an unreachable or invalid chart as a real negative witness.

## Evidence classes and approval boundaries

| Class | Meaning and required attribution |
| --- | --- |
| Independent domain reference | An independently justified calculation or domain relation, with its assumptions and method recorded. |
| Source-comparative fixture | Expected output derived independently from an identified passage/software pin and accepted source scope; not proof of historical authenticity or a real-world outcome. |
| Engineering regression fixture | Locks previously observed repository/API behavior or a confirmed bug fix; does not independently establish source correctness. |
| Synthetic test case | Deliberately constructed input or metadata mutation for a structural boundary; identify it as synthetic. |
| Expert-verified golden case | Requires actual identifiable expert verification of the exact expected chart/results. No such case is established by the current fixture catalog. |

A test may exercise multiple classes; document which expectation has which basis in [TEST_FIXTURES](../TEST_FIXTURES.md). Coverage percentages measure execution, not historical or mathematical truth. Coverage, fixtures and green CI never grant formula approval, source authentication, expert verification, permission to alter defaults, public interpretation or release permission. Actual independent source-review judgments remain separate prerequisites where governance requires them. Fake narrator-provider tests do not evaluate a live model.

## Verification commands

Start with the focused Node test files for the changed rule, then the relevant suites:

```sh
cd backend
npm run test:unit
npm run test:integration
npm run test:ci
```

Register new backend tests in `backend/scripts/runTests.mjs`; do not introduce a second backend framework. Run broader backend CI before declaring implemented backend code complete. Run frontend tests when frontend behavior changes:

```sh
cd frontend
npm run test:ci
npm run lint
npm run build
```

Playwright (`cd frontend && npm run test:e2e`) requires the exceptional browser-specific justification above; it is not a universal completion gate. See [browser matrix and CI routing](E2E_TEST_MATRIX.md). Documentation changes use `npm run docs:links:test` and `npm run docs:links` at repository root. Local cloud browser configuration, if genuinely needed, is an environment detail rather than domain evidence.

## CI and truthful reporting

Retain backend CI, frontend component/lint/build checks, documentation validation and existing security/privacy regressions. The `e2e` CI job keeps its identity; it runs browser tests for changes to browser specs/configuration/frontend dependency manifests or an explicit manual browser request. Ordinary backend or component changes run their lower-level checks. A frontend change that needs an exceptional browser check must add/update the justified browser test or request the manual run.

The browser routing step is itself checked without a browser. An unknown/invalid comparison range fails routing rather than silently declaring coverage. When not selected, the CI summary explicitly reports **NOT RUN — not a browser PASS**. Existing required checks must not be silently removed or renamed. Hosted statuses and branch-protection decisions require actual GitHub evidence; a local test cannot certify them.

Report executed commands and results, skipped/unrun checks with reasons, fixture class and source decision scope. Failed commands, missing evidence, quota errors and exhausted review budgets remain INCOMPLETE; they are never converted into PASS. Run the verification that could detect a confirmed fix, then obtain fresh review as required by B3.
