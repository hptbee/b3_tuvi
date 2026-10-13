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

- `numerologyContent.test.mjs`: versioned original-editorial schema, source/review eligibility and immutable public serializer; community themes not expert formula proof.

- `numerologyAdvanced.test.mjs`: independent grid/calendar-cycle arithmetic, line states, target validation and date boundaries; experimental product convention.

- `numerologyCore.test.mjs`: independent hand-derived product-spec arithmetic fixtures, Unicode/calendar negatives and invariants. Experimental Pythagorean convention; not an externally verified domain reference.

Dữ liệu dựng trong test, database tạm, hoặc lỗi giả. Không dùng cho luận giải người dùng.

- `sqlite.test.mjs`
- `knowledgePrototype.test.mjs`
- `knowledgeQuery.test.mjs`
- `safeErrorLog.test.mjs`
- `evidenceV3.test.mjs`
- `interpretationPipeline.test.mjs`
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
- `fixtureClasses.test.mjs`
- `perfSmoke.test.mjs`
