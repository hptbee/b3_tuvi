# Testing-policy independent technical review 1

Scope: current testing-policy unit against 774ac6c, including untracked `.github/scripts/browser-test-scope.mjs` and its test. Read AGENTS, resolved canonical B3 reviewer role, code-review skill, review-loop strategy and spec. No authoring, fixes, browser launch, source approval, or domain-code review was performed. Parent owns final gate. Previous failed quota attempts are not this actual executed review.

Findings: no confirmed blocking findings and no R3301+ allocation.

Correctness/contracts: policy establishes Node unit > integration > meaningful non-browser smoke > exceptional browser E2E. Fixture classes and historical/source/expert distinctions are explicit. Coverage grants no formula approval. AGENTS and Cursor rule reference one project policy rather than duplicate it. E2E matrix labels historical executions; its retained-suite statement is not a fresh PASS. Current modern-major Playwright spec is byte-identical to HEAD.

CI: reviewed push, pull_request, workflow_dispatch, zero-before new branch, zero-after deletion and invalid/missing Git ranges. Browser-only npm/install/run steps retain the e2e job identity. Lower-level docs/backend/frontend job bodies are byte-identical to baseline. Node22/read-only permissions remain; PR head/base SHA syntax is constrained; subprocess uses execFileSync argument arrays, not shell interpolation. Comparison failure fails the routing step rather than silently skipping. Manual input is compared to actual event-payload string format. Ordinary backend/component edits select no browser by current explicit policy. Exceptional UI work must add a justified spec/config update or manual run. A green routing job is explicitly NOT a browser PASS in its summary.

Security/privacy: no permission expansion, external secret use, path interpolation shell, deployment or bypass of lower-level coverage. CI remains ordinary pull_request rather than pull_request_target. Existing browser tests retained. Actual hosted branch protection/status semantics cannot be certified locally and are explicitly not claimed.

Architecture/maintainability/simplification: one small dependency-free routing module and one executable Node test fit the existing scripts/workflow boundary. No second framework or global B3 skill edits. Four conditional dependency/browser steps have distinct necessary responsibilities; no confirmed redundancy or residue. Historical withdrawn cases documented transparently; no new Playwright test retained for backend T030.

Performance: bounded changed-path scan and two Git subprocesses at most for a new branch; full checkout is required for reliable Git comparisons. No application hot-path or routed specialist need.

Executed verification:
- `node .github/scripts/browser-test-scope.test.mjs`: exit0, actual temporary Git history/new-branch plus skip/manual receipt assertions.
- Independent Node probes: actual checkpoint-to-HEAD Git range; alternate Playwright config extensions; anchored path exclusions; malformed SHA/default-branch/unsupported-event rejection; baseline equality of all three lower-level jobs; exactly four browser guard steps; unchanged read-only permissions. All passed. Initial reviewer-only job-extraction regex omitted digits in e2e and overcaptured; corrected the probe to [a-z0-9] and reran successfully. This was not a repository defect.
- `git diff --exit-code HEAD -- frontend/e2e/modern-major-placement.spec.js`: exit0.
- `npm run docs:links:test`: exit0, assertions passed.
- `npm run docs:links`: exit0, 231 Markdown files passed.

Not run: browser E2E (explicitly inappropriate for policy/backend work); hosted GitHub Actions or branch-protection checks (no hosted evidence available). Backend/frontend implementation tests are outside this policy-only review unit.
