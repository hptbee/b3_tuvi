# Sprint 9C source discovery report

Measured on 2026-10-13 from the live decision files under `docs/knowledge/research/sprint-9c/decisions/`. The uploaded source pack is a candidate index. Its lead status was not copied into a decision.

Status: `RESEARCH_PARTIAL_EVIDENCE_GAPS`. Sprint 9 stays open.

## Sprint 9C, the 39 only

- Candidates examined: 39/39.
- URL validity checked: 39/39. The stored index `sprint-9c-url-verification.json` records HTTP 200 for every candidate URL on 2026-10-13. This continuation re-fetched Group B pages; `hocvienlyso.org`, `blog.udn.com`, and `ziwei.info` returned HTTP 403, so those three bodies were not read.
- Stored excerpts with a passage digest: 35/39.
- Wikisource transcription checked: `zh.wikisource.org` 紫微斗數全書/全覽, oldid 850734. This is a digital transcription, not a checked printed edition and not a PDF page.
- Dual-AI reviewed: 35/39.
- `AI_ACCEPTED`: 24. Formula `MATCH`: 5. `PARTIAL`: 11. Formula `CONFLICT`: 6. `NOT_IMPLEMENTED`: 2.
- Decision `CONFLICT`: 11.
- `UNRESOLVED`: 0 in the stored 9C decisions. Six earlier short quotations were replayed under `source-sentence-v2` without a new model run. Five Wikisource quotations that failed that same gate were sent through a real second model pass.
- `REVIEW_NOT_EXECUTED`: 4. Tài Ấn Giao Trì, Khúc Ám Đồng Cung, Hoa Cái Cư Phu Thê, and Lưỡng Trùng Thiên Mã. See `docs/knowledge/research/sprint-9c-search-exhaustion.json`.
- Decision identity `NAME_MISMATCH`: 2 (Hùng Tú Triều Viên, Bán Không Chiết Xỉ). Every other 9C decision stays `UNRESOLVED_IDENTITY`. A modern page title that uses the catalog name is not a checked historical identity.
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
| Tài Ấn Giao Trì | `RELATED_CONCEPT_ONLY`. No dual-AI review |
| Khúc Ám Đồng Cung | `RELATED_CONCEPT_ONLY`. No dual-AI review |
| Thiên Cơ Tỵ Hợi | `AI_ACCEPTED`, formula `NOT_IMPLEMENTED`. Display.tw p128 states 天機 alone at 巳/亥 with 太陰 opposite. No rulesV2 row. Catalog formula_text still says hãm plus sát; that sentence is not in the bound span |
| Cự Phùng Tứ Sát | `AI_ACCEPTED`, formula `CONFLICT`. Page uses hoặc inside each sát pair, including Không/Kiếp. Runtime requires Kình, Đà, Hỏa, and Linh together |
| Hoa Cái Cư Phu Thê | No exact cách sentence. No dual-AI review. Catalog `required_stars` is Hóa Kỵ |
| Lưỡng Trùng Thiên Mã | No exact named source. No dual-AI review. No Lưu Thiên Mã rule was invented |
| Đồng Lương Tỵ Hợi | `AI_ACCEPTED`, formula `CONFLICT`. Span says Thiên Đồng alone at Tỵ/Hợi and Thiên Lương must be opposite. Runtime allows `menh_or_opposite` |
| Nhật Nguyệt Tật Ách | Decision `CONFLICT`. Grok `CONFLICT`, Terra `PARTIAL`. Span: both luminaries in the illness palace, no Hóa Kỵ. Illness wording on that page is not a medical finding |
| Mệnh VCD Đắc Tam Không | Decision `CONFLICT`. The models disagreed on `thien_khong_aspect`. The bound sentence requires vô chính diệu, Tuần or Triệt at the palace, and Thiên Không aspect. Catalog `require_no_major_at_menh` is false. Other pages define Đắc, Ngộ, and Kiến differently and were not promoted |

## Cumulative, all 63

The 24 Tân Biên decisions were not rewritten. They remain 14 `AI_ACCEPTED`, 9 decision `CONFLICT`, 1 `UNRESOLVED`.

Research records exist for 63/63. Defining paragraphs in the Tân Biên edition remain 24/63. The other 39 stay `SOURCE_INACCESSIBLE` in that edition. Thirty-five of those 39 now have a separate 9C excerpt and a dual-AI record. Four do not. `expertVerified` was not set. Sprint 9 is not closed.

## Blockers

- Tài Ấn Giao Trì, Khúc Ám Đồng Cung, Hoa Cái Cư Phu Thê, and Lưỡng Trùng Thiên Mã still have no bound exact passage.
- Decision identity is unresolved for every 9C row except the two name mismatches.
- Formula `MATCH` on a modern excerpt is not an authenticated historical formula.
- Wikisource oldid 850734 is a transcription, not a printed-page check. `pdfTextChecked` is false.
- Catalog and rulesV2 disagreements listed above are backlog items. They were not edited in this batch.
