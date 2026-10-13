# Sprint 9C source discovery report

Measured on 2026-10-13 from the live decision files under `docs/knowledge/research/sprint-9c/decisions/`. The uploaded source pack is a candidate index. Its lead status was not copied into a decision.

Status: `RESEARCH_PARTIAL_EVIDENCE_GAPS`. Sprint 9 stays open.

## Sprint 9C, the 39 only

- Candidates examined: 39/39.
- URL validity checked: 39/39 in `sprint-9c-url-verification.json` (HTTP 200 on 2026-10-13). Later fetches of `hocvienlyso.org` and `blog.udn.com` returned HTTP 403 to the direct client. The Khúc Ám sentence was recovered by a second retrieval.
- Stored excerpts with a passage digest: 39/39.
- Wikisource transcription checked: `zh.wikisource.org` 紫微斗數全書/全覽, oldid 850734. This is a digital transcription, not a checked printed edition and not a PDF page.
- Dual-AI reviewed: 39/39.
- `AI_ACCEPTED`: 28. Formula `MATCH`: 5. `PARTIAL`: 11. Formula `CONFLICT`: 9. `NOT_IMPLEMENTED`: 3.
- Decision `CONFLICT`: 11.
- `UNRESOLVED`: 0 in the stored 9C decisions. Six earlier short quotations were replayed under `source-sentence-v2` without a new model run. Five Wikisource quotations that failed that same gate were sent through a real second model pass.
- `REVIEW_NOT_EXECUTED`: 0. Execution coverage is not identity coverage. Most 9C decisions stay `UNRESOLVED_IDENTITY`.
- Decision identity `NAME_MISMATCH`: 3 (Hùng Tú Triều Viên, Bán Không Chiết Xỉ, Lưỡng Trùng Thiên Mã). Every other 9C decision stays `UNRESOLVED_IDENTITY`. A modern page title that uses the catalog name is not a checked historical identity.
- `pdfTextChecked`: false on every 9C record.
- `expertVerified`: false. `rulesV2.json` was not changed.

`AI_ACCEPTED` is not formula `MATCH`. The five `MATCH` rows compare a runtime rule with one modern excerpt. Identity on those rows stays `UNRESOLVED_IDENTITY`.

### Quotation policy

`min-40-v1` remains the default: a quotation must be an exact substring of at least 40 characters. `source-sentence-v2` also accepts an exact substring of at least 16 characters when it ends with sentence punctuation and contains a comma-class mark. Title-only strings, keyword fragments, and strings that are not in the span stay rejected. Quotes were not padded.

The six stored reviews that failed only the 40-character gate were replayed under v2. The models were not rerun for those six: Không Kiếp Giáp Mệnh (`MATCH`), Cơ Cự Đồng Lâm (`MATCH`), Giáp Đệ Đăng Khoa (`MATCH`), Phong Lưu Thái Trượng (`MATCH`), Hỏa Tham (`PARTIAL`), Linh Tham (`PARTIAL`). Replaying the same files under v1 is still `UNRESOLVED`.

Đế Ngộ Hung Đồ, Lộ Bàng Mai Thi, Cát Xứ Tàng Hung, Chúng Thủy Triều Đông, and Thủy Trừng Quế Ngạc had a second real review because the first quotations were shorter than a complete bound sentence. Pass 1 files are `review-a-pass1.json` and `review-b-pass1.json`. Models: `grok-4.7-high` and `gpt-5.6-terra-medium`.

### Group A

| Combination | Decision | Formula | Note |
| --- | --- | --- | --- |
| Anh Tinh Nhập Miếu | CONFLICT | — | Grok `CONFLICT`, Terra `PARTIAL` |
| Nhật Nguyệt Tàng Huy | AI_ACCEPTED | CONFLICT | Span is two alternatives. Runtime requires both luminaries hãm |
| Bán Không Chiết Xỉ | CONFLICT | — | `NAME_MISMATCH`. Page title is 命裡逢空格 and the simile is 半天折翅 |
| Đế Ngộ Hung Đồ | AI_ACCEPTED | CONFLICT | Aphorism. Runtime adds Tử Vi, Kình Dương, Hỏa Tinh |
| Lộ Bàng Mai Thi | CONFLICT | — | Models disagreed on `alias_lo_thuong`. Span does not state Sửu/Mùi or Hóa Kỵ/Kình/Đà |
| Cát Xứ Tàng Hung | AI_ACCEPTED | NOT_IMPLEMENTED | Runtime rule is null. Span is 祿逢沖破，吉處藏凶, not Địa Kiếp or Triệt |
| Chúng Thủy Triều Đông | AI_ACCEPTED | PARTIAL | Span says 文耗居寅卯. Runtime says Đại Hao and Tiểu Hao at Mão/Dậu |
| Thủy Trừng Quế Ngạc | AI_ACCEPTED | CONFLICT | Span says 太陰居子. Runtime adds Thiên Đồng |

### Group B

| Combination | Result |
| --- | --- |
| Tử Phủ Vũ Tướng | Decision `CONFLICT`. Grok `PARTIAL`, Terra `MATCH`. Span names the four stars and says they need not share one palace. It does not say tam hợp |
| Sát Phá Tham | Decision `CONFLICT`. Grok `MATCH`, Terra `PARTIAL`. Span: tam hợp Mệnh, Tài, Quan with Thất Sát, Phá Quân, Tham Lang |
| Tài Ấn Giao Trì | `AI_ACCEPTED`, formula `CONFLICT`. See the final-four table |
| Khúc Ám Đồng Cung | `AI_ACCEPTED`, formula `CONFLICT`. Đồng cung only. See the final-four table |
| Thiên Cơ Tỵ Hợi | `AI_ACCEPTED`, formula `NOT_IMPLEMENTED`. Display.tw p128 states 天機 alone at 巳/亥 with 太陰 opposite. No rulesV2 row. Catalog formula_text still says hãm plus sát; that sentence is not in the bound span |
| Cự Phùng Tứ Sát | `AI_ACCEPTED`, formula `CONFLICT`. Page uses hoặc inside each sát pair, including Không/Kiếp. Runtime requires Kình, Đà, Hỏa, and Linh together |
| Hoa Cái Cư Phu Thê | `AI_ACCEPTED`, formula `CONFLICT`. Placement only. Catalog `required_stars` is still Hóa Kỵ |
| Lưỡng Trùng Thiên Mã | `AI_ACCEPTED`, formula `NOT_IMPLEMENTED`, identity `NAME_MISMATCH`. The bound line is 兩重天祿天馬 |
| Đồng Lương Tỵ Hợi | `AI_ACCEPTED`, formula `CONFLICT`. Span says Thiên Đồng alone at Tỵ/Hợi and Thiên Lương must be opposite. Runtime allows `menh_or_opposite` |
| Nhật Nguyệt Tật Ách | Decision `CONFLICT`. Grok `CONFLICT`, Terra `PARTIAL`. Span: both luminaries in the illness palace, no Hóa Kỵ. Illness wording on that page is not a medical finding |
| Mệnh VCD Đắc Tam Không | Decision `CONFLICT`. The models disagreed on `thien_khong_aspect`. The bound sentence requires vô chính diệu, Tuần or Triệt at the palace, and Thiên Không aspect. Catalog `require_no_major_at_menh` is false. Other pages define Đắc, Ngộ, and Kiến differently and were not promoted |

## Cumulative, all 63

The 24 Tân Biên decisions were not rewritten. They remain 14 `AI_ACCEPTED`, 9 decision `CONFLICT`, 1 `UNRESOLVED`.

Research records exist for 63/63. Defining paragraphs in the Tân Biên edition remain 24/63. The other 39 stay `SOURCE_INACCESSIBLE` in that edition. All 39 now have a separate 9C excerpt and a dual-AI record. `expertVerified` was not set. Sprint 9 is not closed. A completed model run does not verify the catalog name.

## Final four

| Combination | Decision | Formula | Identity | Bound source |
| --- | --- | --- | --- | --- |
| Tài Ấn Giao Trì | AI_ACCEPTED | CONFLICT | UNRESOLVED_IDENTITY | xuanjige, 财印交驰 with 武曲 at 寅申. The span does not say 命宫 or 天相. 财印坐马格 was fetched and kept separate |
| Khúc Ám Đồng Cung | AI_ACCEPTED | CONFLICT | UNRESOLVED_IDENTITY | hocvienlyso list item 9, Văn Khúc and Cự Môn đồng cung. The catalog name and hội chiếu are not in the span |
| Hoa Cái Cư Phu Thê | AI_ACCEPTED | CONFLICT | UNRESOLVED_IDENTITY | tracuutuvi section 1, Hoa Cái at Phu Thê. The span does not require Hóa Kỵ or sát. Catalog required_stars is still Hóa Kỵ |
| Lưỡng Trùng Thiên Mã | AI_ACCEPTED | NOT_IMPLEMENTED | NAME_MISMATCH | ichingtrilogy gloss of 兩重天祿天馬 as 祿存 + 化祿 + one 天馬. No rulesV2 row. This is not two Thiên Mã |

Direct HTTP to hocvienlyso returned Cloudflare 403. A second retrieval returned the article. udn returned 403. tuvi.cohoc.net redirected to a 404 anti-spam URL. goodfate.tw returned a title 華蓋在夫妻宮 and was not the bound span. askziwei names 武曲 + 天相 as 财印交驰 without the Dần/Thân sentence used here. ziweitai defines 疊馬 as natal 天馬 with 流馬, separate from 兩重天祿天馬. tuvisonlong discusses Lưu Thiên Mã without the catalog name. Those pages are recorded in `docs/knowledge/research/sprint-9c-final4-assertions.json` and were not merged into the four decisions.

## Open backlog after 39/39 execution

Eleven 9C decisions stay `CONFLICT` because the two models did not agree. Eight disagree on the formula label: Anh Tinh Nhập Miếu, Hình Kỵ Giáp Ấn, Nhật Nguyệt Tật Ách, Sát Phá Tham, Thạch Trung Ẩn Ngọc, Thiên Ất Củng Mệnh, Tử Phủ Vũ Tướng, Văn Tinh Củng Mệnh. Three agree on `CONFLICT` and disagree on the condition list: Bán Không Chiết Xỉ, Lộ Bàng Mai Thi, Mệnh VCD Đắc Tam Không. The validator was not changed to force agreement.

The 24 Tân Biên decisions stay as recorded: 9 decision `CONFLICT` and 1 `UNRESOLVED` (Kình Dương Nhập Miếu). They were not re-reviewed in this pass.

Decision identity remains `UNRESOLVED_IDENTITY` except Hùng Tú Triều Viên, Bán Không Chiết Xỉ, and Lưỡng Trùng Thiên Mã (`NAME_MISMATCH`). Resolving a name needs a located historical edition that uses that name for the same structural conditions. A modern page title is not that edition.

## Blockers

- Formula `MATCH` on a modern excerpt is not an authenticated historical formula.
- Wikisource oldid 850734 is a transcription, not a printed-page check. `pdfTextChecked` is false.
- Catalog and rulesV2 disagreements are backlog items. They were not edited in this batch.
- Sprint 9 stays `RESEARCH_PARTIAL_EVIDENCE_GAPS`.
