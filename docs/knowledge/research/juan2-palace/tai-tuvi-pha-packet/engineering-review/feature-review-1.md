# Independent B3 engineering review — T028 full feature

Review pass: 8/12 (one reviewer pass; parent owns loop result).
Target: base b33a2d55c4fb6a66124f31d58a69ddbec79fe5d4 through current tracked diff and all untracked T028 files on codex/tuvi-tai-tuvi-pha-interpretation.
Finding allocation: R2401 onward.

## Confirmed blocking findings

None found. No finding IDs allocated.

## Scope examined

- Entire production-code delta is one finite subject entry in sourcePalaceBinding.js. Existing validation/reader/cache logic and previous subjects remain unchanged. The new entry registers fixed paths, exact five evidence digests and canonical whole-document review digests; it cannot authorize arbitrary new claims or caller-provided evidence.
- New claim, decision, bundle, execution receipt, both complete actual review documents, source excerpts/full section, frozen proposal manifest and proof artifacts. Exact raw review file SHA256 values match execution.rawReviewSha256. Canonical digests are enforced by the production binder and exercised by the new test.
- New test and modified old sourcePalaceInterpretation assertion, runTests registration, attributes, README/research/fixture/plan/checkpoint updates. Archived scripts are inert historical verification materials rather than runtime entrypoints; original temporary paths are explicitly documented.
- New source annotation describes the quoted primary branch only, leaves adverse clauses and reciprocal wording unevaluated, and does not activate the unresolved T026 candidate. Separate ERRATA preserves and identifies the original intake misstatement. Public narration remains withheld and natal/default/source registries are untouched.

## Verification personally run

- node backend/test/sourcePalaceTaiTuViPha.test.mjs — exit 0.
- node backend/test/sourcePalaceInterpretation.test.mjs — exit 0.
- node docs/knowledge/research/juan2-palace/tai-tuvi-pha-packet/verify-proposal.mjs /workspace/b3_tuvi — exit 0; all21 manifest entries, five digest classes and eight real fixture replays agree.
- sha256sum of both actual review documents — matches execution raw review hashes.

The parent-reported full backend CI result was not independently rerun in this pass.

## Dimensions and limits

Correctness/tests: real direct-host predicates distinguish both missing partners and wrong host; positive fixtures cover Sửu/Mùi with and without the existing named adverse subset. New test asserts exact combination rendering, each eligible old/new wording once, and a reachable old-adverse-only witness. Replacing blanket internalProse=null with absence of the specific ineligible old claim is necessary because one pre-existing negative chart is now a valid new-pair chart; old applicability/reason checks remain. No coverage weakening found in that adjustment.

Security/privacy: no new input, external execution, network or public narration path. Mutated evidence/reviewer metadata, coherent rehashes, caller clones, missing fixed files and serialized public output are exercised. Path allowlisting and source/public gates retain their prior implementation.

Architecture/necessity/residue: finite data extension reuses the established binder, condition evaluator and synthesis. No duplicate business logic or confirmed redundant runtime abstraction found. Raw/derived/source-review duplication has the current named responsibility of frozen review provenance and independently reproducible source inspection (INTENTIONAL COMPLEXITY).

Performance: one additional bounded, lazily cached fixed evidence load follows the existing pattern; there is no new unbounded or per-request I/O loop. No confirmed performance regression; no speculative optimization requested.

UI/accessibility: no UI changes; the capability is intentionally internal and public prose withheld, so no new user interaction requires UI/a11y testing in this scope.

Domain limit: this engineering pass checks implementation/evidence coherence; it does not provide an additional source-authentication, expert review or independent original-edition verification. Both actual source reviews explicitly limit their acceptance accordingly.

## Nonblocking speculative/nit items

None raised.
