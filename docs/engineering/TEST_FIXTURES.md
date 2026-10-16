# Phân loại test backend

Các file trong `backend/test` được xếp một lần. Regression fixture không phải golden case đã được chuyên gia kiểm.

## Independent domain reference

Bảng hoặc quan hệ có thể đối chiếu với quy ước đã ghi trong repo, không phải lá số của một người.

- `placement.tables.test.mjs`
- `palaceRelation.test.mjs`

## Source-comparative fixture

- `modernMajorStem.test.mjs`: independent pinned-source arithmetic for 24 valid natal charts, 288 periods, 654 age queries and 120 finite stem/branch mappings. Missing/conflicting metadata mutations are synthetic structural cases; pre-change response snapshots are engineering regressions. None is an expert-verified chart or a real-world prediction.

## Expert-verified golden case

Không có file expert-verified golden. Chưa có lá số nào được một chuyên gia ký và khóa kết quả từng cung.

## Regression fixture

Giữ hành vi đã có của engine, API, hoặc chuẩn hóa. Kết quả kỳ vọng là hành vi hiện tại của repo, không phải bản đã thẩm định sách.

- `engine.test.mjs`
- `normalizeChart.test.mjs`
- `ruleEngine.test.mjs`
- `interpretationBinding.test.mjs`: existing interpretation evidence binding and unreviewed-clone regressions; no new source approval or expert verification.
- `modernMajorBinding.test.mjs`: separately approved immutable modern Đại hạn evidence, actual distinct-model decision replay and tamper withholding; not inherited minor approval or historical authentication.
- `modernMajor.test.mjs`: independent real natal witnesses and finite decade boundaries, strict server metadata and adapter negatives; engineering/source-comparative fixtures, not life-outcome goldens.
- `modernMajorStemBinding.test.mjs`: separately approved can–chi profile, immutable actual reviews and frozen artifacts, coherent forgery rejection, old-gate prerequisite and cached fixed-loader failures; no historical authentication.
- `modernMajorStemApi.test.mjs`: actual HTTP replay of every independent source-comparative period, two-key opt-in, combined overlays, unchanged old/omitted fields, ask/no-store/privacy and no personal persistence.
- `modernMajorApi.test.mjs`: actual HTTP explicit-age modern Đại hạn, combined optional profiles, ask/error/privacy/no-store and no persistence; structural placement only.
- `modernMinorBinding.test.mjs`: exact pinned modern-software profile evidence, distinct actual model replay and tamper withholding; no historical authentication or interpretation approval.
- `modernMinor.test.mjs`: 120 source-comparative endpoints, 2880 independent finite age allocations, reachable natal layouts and strict option/chart boundaries; engineering mathematical witnesses, not historical goldens.
- `modernMinorApi.test.mjs`: real HTTP explicit-age opt-in, privacy, no-store error responses and no persistence; modern structural placement only.
- `sourcePalaceBinding.test.mjs`: pinned paragraph/context, actual distinct-model approval and digest binding; mutations never grant source approval.
- `sourcePalaceQuan.test.mjs`: ten real solar witnesses of the separately reviewed Quan Lộc Cơ–Cự/Dậu textual branch, evidence mutations and branch-coherence guards; engineering regressions, not verified career outcomes.
- `sourcePalacePhucCoCu.test.mjs`: nineteen independently replayed real solar witnesses of the source-scoped Phúc Đức Cơ–Cự baseline, immutable review/evidence mutations and withheld public output; engineering regressions, not health/personality or life-outcome goldens.
- `sourcePalaceTaiTuViPha.test.mjs`: eight independently replayed real solar witnesses of the Tài Bạch Tử Vi–Phá Quân source branch, coexistence with the approved adverse-star note, immutable evidence and withheld public output; engineering regressions, not verified wealth or life outcomes.
- `sourcePalaceQuanMao.test.mjs`: nine independently verified API-valid solar fixtures for the distinct Quan Lộc Cơ–Cự/Mão source branch, mutual exclusion with Dậu, immutable required-star/branch conditions and withheld public output; engineering regressions, not verified career outcomes.
- `sourcePalaceInterpretation.test.mjs`: real solar inputs exercise reviewed source-palace predicates and withheld public prose; engineering witnesses, not historical life-outcome goldens.
- `combinationRoute.integration.test.mjs`
- `chartGenerate.test.mjs`
- `httpApi.test.mjs`

## Synthetic test case

- `apiErrors.test.mjs`: private-message error boundary and headers-sent forwarding; no domain/reference verification.

- `numerologyApi.test.mjs`: real HTTP contract/validation/privacy and unchanged temp SQLite counts for the experimental calculator.
- `numerologyRateLimit.test.mjs`: per-process window, proxy-token key, reset and HTTP 429. Not a multi-instance production proof.

- `numerologyContent.test.mjs`: versioned original-editorial schema, source/review eligibility and immutable public serializer; community themes not expert formula proof.

- `numerologyAdvanced.test.mjs`: independent grid/calendar-cycle arithmetic, line states, target validation and date boundaries; experimental product convention.

- `numerologyPinnacles.test.mjs`: hand-derived pinnacle and challenge timelines, challenge 0, life-path-root ages and 29 February anniversaries. Experimental product convention, not an externally verified school.

- `numerologyCharts.test.mjs`: nine-year personal-year window, twelve personal months, Pythagorean letter counts, birth/name presence, and unchanged core pinnacle numbers. Product counting convention, not an externally verified school.

- `numerologyIndicators.test.mjs`: Decoz-convention frequency, initials, rational thought and published-core bridges, including the Thomas John Hancock example and a missing-name case. Not an expert-verified golden case.

- `numerologyCore.test.mjs`: independent hand-derived product-spec arithmetic fixtures, Unicode/calendar negatives and invariants. Experimental Pythagorean convention; not an externally verified domain reference.

Dữ liệu dựng trong test, database tạm, hoặc lỗi giả. Không dùng cho luận giải người dùng.

- `sqlite.test.mjs`
- `knowledgePrototype.test.mjs`
- `knowledgeQuery.test.mjs`
- `safeErrorLog.test.mjs`
- `evidenceV3.test.mjs`
- `interpretationPipeline.test.mjs`
- `sprint11bInterpretation.test.mjs`
- `sprint11c12Evidence.test.mjs`
- `internalSlice.test.mjs`
- `knowledgeCoverage.test.mjs`
- `wholeChart.test.mjs`
- `timeEngine.test.mjs`
- `thienDuc.test.mjs`
- `narrator.test.mjs`
- `qualityEdges.test.mjs`

## Property/invariant test

Khóa tính chất: không nâng nguồn từ test pass, catalog không thành primary, matcher không trả cách disabled, validator không biến schema hợp lệ thành tri thức đã duyệt.

- `combinationMatch.test.mjs`
- `provenance.test.mjs`
- `knowledgeCatalog.test.mjs`
- `knowledgeValidate.test.mjs`
- `sourceHygiene.test.mjs`
- `crossReview.test.mjs`
- `crossReviewNegatives.test.mjs`
- `decisionRegistry.test.mjs`
- `storedDecision.test.mjs`
- `decisionIntegrity.test.mjs`
- `sourceBinding.test.mjs`
- `combinationBatch.test.mjs`
- `combinationResearch.test.mjs`
- `sprint9cDiscovery.test.mjs`
- `sprint9Adjudication.test.mjs`
- `formulaV1.test.mjs`: source-scoped V1 dispositions for all 63 catalog formations. Not an expert-verified golden chart.
- `sprint9Closure.test.mjs`: Formula V1 interpretation wiring and the internal Tử Phủ Đồng Cung slice. Not an approved interpretation.
- `conditionEval.test.mjs`: typed condition contracts and three-valued Boolean cases. Not a historical formula proof.
- `fixtureClasses.test.mjs`
- `perfSmoke.test.mjs`
