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
- `fixtureClasses.test.mjs`
- `perfSmoke.test.mjs`
