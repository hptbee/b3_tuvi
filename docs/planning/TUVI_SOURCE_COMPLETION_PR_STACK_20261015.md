# Tử Vi source-completion PR stack — 2026-10-15

Các nhánh dưới đây đã push và kiểm tra remote. API GraphQL trả `Forbidden` khi tạo PR; **chưa có PR mới**. Tái sử dụng #50 → #51 → #52, không tạo lại hoặc auto-merge. `main` vẫn ở `f0dec74973ef9d07129e19330356f8e6d2040227` khi kiểm tra cuối. Commit checkpoint sau cùng có thể nằm trên feature commit đã ghi, không thay đổi source/math/runtime.

Tạo các PR theo đúng thứ tự phụ thuộc dưới đây khi API khả dụng, hoặc mở compare đã chuẩn bị để duyệt. Không merge hoặc deploy tự động.

## 1. Tài Bạch / Phúc Đức

- Base: `codex/tuvi-interpretation-evidence-binding`
- Head: `codex/tuvi-juan2-palace-interpretations`
- Feature commit đã kiểm tra remote: `67ff179c10e75bfd5d92b037702f7024014a76ae`
- [Mở compare / tạo PR](https://github.com/hptbee/b3_tuvi/compare/codex%2Ftuvi-interpretation-evidence-binding...codex%2Ftuvi-juan2-palace-interpretations?expand=1)

### Nội dung PR chuẩn bị sẵn

#### Change

Add two internal, source-scoped palace annotations from the complete pinned Juan 2 transcription: Tử Vi in Tài Bạch with a directly co-hosted Kình/Đà/Hỏa/Linh modifier, and Thiên Đồng–Thiên Lương in Phúc Đức. Each annotation uses the exact predicate and Vietnamese wording independently accepted by gpt-6.1-sol and gpt-6-astra after reproducing the reachable positive/negative charts.

A finite evidence binder replays the existing cross-review gate, all five evidence digests, actual model records and source identity before evaluating the approved condition tree against the calculated chart. Altered claims, missing evidence and malformed chart projections cannot emit the internal annotation. Existing Tử Phủ behavior and natal formulas remain intact.

The reproduction is explicitly an unauthenticated secondary transcription. These are traditional textual annotations, with no empirical validation, historical-edition authentication, whole-chart conclusion or public-prose release.

#### Validation

- Backend CI: 55 files (46 unit, 9 integration); 87.42% line / 89.33% branch coverage.
- Sixteen actual solar-input predicate witnesses; 22 malformed-data regressions; evidence mutation and legacy interpretation tests.
- Frontend StructuredAnalysis: 37 tests. Chromium Tử Vi regressions: 25 tests after verified local backend startup.
- Documentation links: 181 Markdown files; git diff check.
- Independent source assembly, runtime and performance reviews; runtime fix R601 followed by fresh review. Final cross-cut receipt is recorded in the committed checkpoint.

#### Dependency and limits

Base: PR #52 (`codex/tuvi-interpretation-evidence-binding`), after #50 → #51 → #52. This does not duplicate those PRs or merge PR #49.

Quan Lộc Thiên Phủ, generic VCD terminology and classical fortune-profile parameters remain unresolved. No merge, deployment, public predictions or AI narration are authorized by this change.

## 2. Quan Lộc Cơ–Cự tại Dậu

- Base: `codex/tuvi-juan2-palace-interpretations`
- Head: `codex/tuvi-quan-loc-branch-annotation`
- Feature commit đã kiểm tra remote: `0f0c1f814e9a23c3f7c88c880240286eee9f1650`
- [Mở compare / tạo PR](https://github.com/hptbee/b3_tuvi/compare/codex%2Ftuvi-juan2-palace-interpretations...codex%2Ftuvi-quan-loc-branch-annotation?expand=1)

### Nội dung PR chuẩn bị sẵn

#### Change

Add the separately reviewed internal Quan Lộc annotation for Thiên Cơ and Cự Môn sharing the Dậu palace. The exact attributed branch clause is `在酉宮雖美無始終`; following adverse modifiers remain explicitly unevaluated. This does not produce an integrated career prediction or dismissal claim.

Bind this third source-palace subject to its own immutable source packet, model responses and execution record. Require actual branch ID/name consistency before condition evaluation, preventing a Mão chart with a spoofed Dậu label from matching. Prior Tài Bạch, Phúc Đức and Tử Phủ evidence stays isolated and unchanged.

#### Validation

- Independent gpt-6.1-sol and gpt-6-astra source/wording approval after all ten real positive/negative chart fixtures; existing comparison replays AI_ACCEPTED.
- Backend CI: 56 files; 87.45% lines / 89.43% branches.
- Evidence mutation/outage/borrowed-review tests, ten new plus sixteen prior solar/API witnesses and legacy regressions.
- Separate source, runtime and cross-cut engineering reviews clear. Cross-cut probes: 78 actual HTTP responses through the exact frontend validator; new evidence outage does not disable prior subjects.

#### Dependency and limits

Base: `codex/tuvi-juan2-palace-interpretations` at 67ff179, itself above existing PR #52 (#50 → #51 → #52). No duplicate or merge of existing PRs.

The pinned reproduction remains unauthenticated and secondary. Original formulas, source decisions and public prose/prediction gates remain intact; Thiên Phủ, generic VCD and classical fortune semantics retain their separate blockers. No merge or deployment.

## 3. Tiểu hạn hiện đại, tuổi mụ nhập trực tiếp

- Base: `codex/tuvi-quan-loc-branch-annotation`
- Head: `codex/tuvi-modern-minor-placement`
- Feature commit đã kiểm tra remote: `e02baf419ecf84f94166590ce6c6b0aebe7140c4`
- [Mở compare / tạo PR](https://github.com/hptbee/b3_tuvi/compare/codex%2Ftuvi-quan-loc-branch-annotation...codex%2Ftuvi-modern-minor-placement?expand=1)

### Nội dung PR chuẩn bị sẵn

#### Change

Add an optional Tiểu hạn location using the independently reviewed modern iztro profile. Users select the variant, enter nominal age 1–120 and apply it. The API uses the existing server natal lunar-year branch and validated sex, then maps the accepted branch to the real natal palace. It does not derive age from a date or produce fortune prose.

A finite verifier replays the actual distinct-model source decision, exact algorithm/compatibility/fixture hashes, pinned modern source identity and supplemental locale evidence. Missing or changed approval data disables this optional placement. The UI binds each response to the submitted profile/age/birth request, validates actual palace mapping, clears age when the birth changes, and keeps annual controls independent.

Classical Quanshu/Tân Biên decisions, existing natal labels/formulas, annual placements and public interpretation gates are preserved. The software reference remains historically unauthenticated and non-expert/non-book-verified. No entire upstream calendar/natal equivalence is claimed.

#### Validation

- Actual gpt-6.1-sol and gpt-6-astra source reviews: MATCH for the complete restricted explicit-age projection; existing comparator AI_ACCEPTED.
- Independent source fixtures: 120 endpoints, 2,880 age allocations, 24 natal layouts, Tết/leap/hour boundaries; nineteen primary and three supplemental pinned payloads verified.
- Backend CI: 59 files (49 unit, 10 integration), 87.96% lines / 89.95% branches.
- Frontend CI: 169 tests, 88.48% lines / 88.72% branches; lint/build pass.
- Full Tử Vi Chromium E2E: 29/29. Final independent cross-cut: 285 actual HTTP/validator/outage probes pass.
- Isolated core.autocrlf=true checkout preserves exact accepted JSON fixture bytes. Documentation links: 183 Markdown files.
- Independent source/backend, UI, performance and final interaction reviews have no blocking findings. Cold first opt-in evidence validation costs 14.78–18.54 ms once; warm calls read no modern evidence. No production SLO guarantee.

#### Dependency and release

Base: `codex/tuvi-quan-loc-branch-annotation` at 0f0c1f8, after `codex/tuvi-juan2-palace-interpretations` at 67ff179 and existing #50 → #51 → #52. No existing PR is duplicated.

No merge or deployment. Public predictions/AI narration remain gated; source-profile conflicts for classical fortune, generic VCD and Thiên Phủ retain their separate blockers. Local checks do not establish hosted CI, staging, rollback, historical authentication or production readiness.

## Ngoại lệ định dạng bằng chứng

Tệp `docs/knowledge/research/fortune/modern-minor/review-context.txt` giữ nguyên 45 dòng có khoảng trắng cuối dòng từ nguồn/ngữ cảnh đã duyệt. Full `git diff --check` báo các dòng này; kiểm tra phần ứng dụng/tài liệu loại trừ đúng tệp byte-evidence đó đạt. Hash nguồn vẫn khớp cả hai model và decision; không xóa khoảng trắng, sửa hash hoặc tắt assertion để làm sạch báo cáo.

Local verification không chứng nhận hosted CI, môi trường Node22/Windows, Firefox/WebKit, staging/rollback hoặc production readiness. Public prose, AI narration và dự báo vẫn giữ khóa.
