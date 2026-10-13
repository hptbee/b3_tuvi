# Phân loại test backend

Các file trong `backend/test` được xếp một lần. Regression fixture không phải golden case đã được chuyên gia kiểm.

## Independent domain reference

Bảng hoặc quan hệ có thể đối chiếu với quy ước đã ghi trong repo, không phải lá số của một người.

- `placement.tables.test.mjs`
- `palaceRelation.test.mjs`

## Expert-verified golden case

Không có file expert-verified golden. Chưa có lá số nào được một chuyên gia ký và khóa kết quả từng cung.

## Regression fixture

Giữ hành vi đã có của engine, API, hoặc chuẩn hóa. Kết quả kỳ vọng là hành vi hiện tại của repo, không phải bản đã thẩm định sách.

- `engine.test.mjs`
- `normalizeChart.test.mjs`
- `ruleEngine.test.mjs`
- `combinationRoute.integration.test.mjs`
- `chartGenerate.test.mjs`
- `httpApi.test.mjs`

## Synthetic test case

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
- `internalSlice.test.mjs`
- `knowledgeCoverage.test.mjs`
- `wholeChart.test.mjs`
- `timeEngine.test.mjs`
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
- `fixtureClasses.test.mjs`
- `perfSmoke.test.mjs`
