# Sprint 9 closure report

Baseline: `origin/main` `434345c` (merge of PR #25). This branch starts there. Formula V1 was not reimplemented. `rulesV2.json` and the stored research decisions were not rewritten. `expertVerified` stays false.

## What closed

The combination matcher and `interpretChart` both call `evaluateNormalizedFormulas`. A source profile selects the formula and does not change natal stars. Runtime recognition, formation status, grade status, breaking status, source verification, and interpretation eligibility stay separate fields.

The internal slice is Tử Phủ Đồng Cung at Mệnh. The stored decision `tu-phu-dong-cung-2026-10-12` is `AI_ACCEPTED` with formula comparison `MATCH`. That decision does not authorize interpretation prose. The slice therefore returns `prose: null`, `auspicious: false`, grade `not_certified` when the formation matches, and `interpretationEligibility.eligible: false` with reason `formula_match_is_not_interpretation_approval`. A chart that is not marked `chartSource: server` does not match. `POST` analysis still rejects a client-supplied `normalizedChart`.

A reachable positive witness from the closure test is can 1, chi 1, lunar day 15, month 1, hour 7. The same test checks a negative chart, editorial Nhật Nguyệt Tịnh Minh against an unpaired Mùi / Tị / Dậu chart, Thạch Trung Ẩn Ngọc without a quý grade, Thất Sát at Mệnh Ngọ, and the unsupported Thiên Tướng hóa Kỵ profile.

## Tests

`node scripts/runTests.mjs unit` and `node scripts/runTests.mjs integration` passed locally, including `backend/test/sprint9Closure.test.mjs`. Frontend source was not changed. Frontend and e2e are expected from GitHub Actions on the pull request.

## Still unresolved

Disabled and internal formations stay unpublished. The Tân Biên Hình Tù flank still has no observed natal witness. The Thiên Tướng hóa Kỵ profile stays unsupported. Grades marked `not_certified` are not recognition rules. No interpretation claim is approved for public prose.

## Sprint 10

**CONDITIONAL GO.** Sprint 10 may continue condition and evidence work. It may not open public interpretation, fortune prediction, or AI prose, and it may not treat a formula `MATCH` as expert verification.
