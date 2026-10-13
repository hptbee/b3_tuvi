# Sprint 9D adjudication of seven Tân Biên conflicts

Sprint 9 stays open. The stored Tân Biên decisions remain `CONFLICT`. The models were not rerun. The registered PDF was hashed and pages 230, 71, and 229 were rendered. Modern 108s pages remain a different school record.

Machine-readable rows: `docs/knowledge/research/sprint-9d-seven-cases.json`.

## Nhật Nguyệt Tịnh Minh

The registered PDF SHA-256 matches `941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458`. On printed page 230 the text layer encodes the Sun position as U+00FD, `Tý`. The rendered glyph has a dot below the y, matching page 71 words encoded U+1EF5, `Tỵ`. Page 71's U+00FD in `lý` has an acute and no dot below. The stored span was not changed. The visible first clause is Sửu / Sun Tỵ / Moon Hợi. That pair is not produced by the current placer. Quách Ngọc Bội says the book wrote Hợi by mistake and the Moon should be Dậu. Page 71 labels Sửu / Sun Tỵ / Moon Dậu, and a different illustration on the same page puts Sun Mão and Moon Hợi at Sửu. Editorial Sửu / Tỵ / Dậu is reachable at can=0, chi=0, day=14, month=2, hour=3. Clause 2, Mùi / Mão / Hợi, is reachable at can=0, chi=0, day=1, month=2, hour=9. `rulesV2` allows Sun Tị or Ngọ and Moon Dậu or Tí, so it accepts the editorial pair and other mixtures, and it does not implement clause 2. Disposition: `PDF_TEXT_LAYER_MISMATCH_CONFIRMED`. The original decision stays `CONFLICT`.

## Cự Nhật Đồng Cung

The stored span requires the two stars together at Mệnh and names no branch. `rulesV2` adds Dần and Thân. A placement search found that same-palace pair only at those two branches. 108s info/223 says 寅 or 未 in the formation sentence, then says 寅 is better than 申. Those sentences were left as an internal difference. Wikisource oldid 7913704 names 巨日同宫 and does not give this branch list.

## Thất Sát Triều Đẩu

The stored span and 108s info/207 require Dần or Thân and Tử Vi with Thiên Phủ opposite. The quý sentence on that page is auxiliary stars. `rulesV2` also allows Tí and Ngọ and does not require the opposite pair. Year indices 0/0, day 4, month 1, hour 7 has the opposite pair at Mệnh Thân. Day 3, month 2, hour 10 has Mệnh Ngọ without that opposite pair. Relation: `OVERLAPPING_DIFFERENT`.

## Tham Vũ Đồng Hành

Both stored reviews say `MATCH`. Terra adds `branch_suu` beside `branch_suu_mui`. The span names Sửu and Mùi together, so Sửu alone is not a further requirement. `rulesV2` uses that same-palace pair at Sửu or Mùi. 108s info/197 also accepts 辰/戌 opposition and treats 丑 as the quý seat. The stored decision stays `CONFLICT`. The normalized basic-span relation is `EQUIVALENT_ON_BASIC_SPAN`.

## Mã Lạc Không Vong

Three formulas stay separate. The stored recognition is Thiên Mã at Mệnh with Tuần or Triệt. The phụ luận is mitigation, which is why Terra's `bright` is not part of the formation. 108s info/268 uses Địa Không or Địa Kiếp, same palace or opposite. `rulesV2` uses tam phương tứ chính plus Địa Không or Tuần/Triệt. Wikisource oldid 7913704 glosses 马落空亡 as 马既落亡. Disposition: `SOURCE_CONTRADICTION`.

## Tử Phủ Triều Viên

The stored span is a bright-host disjunction at Mệnh or Quan. Terra's general `bright` id repeats the star-specific brightness already in the span. `rulesV2` only requires Tử Vi and Thiên Phủ in tam phương tứ chính. 108s info/196 describes eight 三方四正 configurations and was not substituted for the Tân Biên sentence. Relation: `RUNTIME_BROADER`.

## Nhật Nguyệt Đồng Lâm

The same page-230 mismatch applies to 19.2.14. The visible first clause is Sửu / Sun Tỵ / Moon Hợi, and that pair is not produced by the placer. The printed second clause, Mệnh at Mùi with both luminaries at Sửu, is reachable at can=0, chi=0, day=3, month=3, hour=10. Section 19.1.5 on printed page 229 and Quách Ngọc Bội section 14 put the conjunction opposite the target. Mệnh Sửu with both luminaries at Mùi is reachable at can=0, chi=0, day=18, month=2, hour=3. `rulesV2` requires both stars in the target palace. That is a different chart, can=0, chi=0, day=6, month=3, hour=4. Disposition: `PDF_TEXT_LAYER_MISMATCH_CONFIRMED`. The original decision stays `CONFLICT`. This file is the registered retypeset PDF, not a proven 1956 printing. The archive.org item was opened and its scan was not visually collated.
