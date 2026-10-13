# Sprint 9C source discovery report

Measured on 2026-10-13 from the discovery pack plus live HTTP retrieval. The pack is a candidate index. Its lead status was not copied into the decision.

Status: `RESEARCH_PARTIAL_EVIDENCE_GAPS`.

## Sprint 9C, the 39 only

- Candidates examined: 39/39.
- URL validity checked: 39/39. Every candidate URL returned HTTP 200 on 2026-10-13.
- Stored webpage excerpts with a passage digest: 20/39.
- Wikisource transcription checked: `zh.wikisource.org` 紫微斗數全書/全覽, oldid 850734. This is a digital transcription, not a checked printed edition and not a PDF page.
- Phrases present in that transcription: `帝遇兇徒` (the pack searched `帝遇凶徒`), `路上埋屍`, `吉處藏凶`, `文耗居寅卯，謂之眾水朝東`, `太陰居子，號曰水澄桂萼`.
- Dual-AI reviewed: 20/39.
- `AI_ACCEPTED`: 10. Formula `MATCH`: 1. `PARTIAL`: 8. Formula `CONFLICT`: 1.
- Decision `CONFLICT`: 4.
- `UNRESOLVED`: 6. In these, one quotation was shorter than 40 characters, so the comparator refused it.
- `REVIEW_NOT_EXECUTED`: 19.
- Identity `EXACT_IDENTITY`: 1 (Tử Phủ Vũ Tướng, modern Vietnamese page title). `NAME_MISMATCH`: 2 (Hùng Tú vs 雄宿朝垣; Bán Không Chiết Xỉ vs 半天折翅). `RELATED_CONCEPT`: 4. The other Chinese pages stay `UNRESOLVED_IDENTITY`.
- `pdfTextChecked`: false on every 9C record.
- `expertVerified`: false. `rulesV2.json` was not changed.

`AI_ACCEPTED` with formula `MATCH` on Dương Lương Xương Lộc compares the runtime rule to one modern excerpt. Both models also wrote that the excerpt does not prove the Vietnamese catalog name. Identity for that row stays `UNRESOLVED_IDENTITY`.

## Cumulative, all 63

The previous 24 Tân Biên decisions were not rewritten. They remain 14 `AI_ACCEPTED`, 9 decision `CONFLICT`, 1 `UNRESOLVED`, with formula counts from Sprint 9B.

The 39 Tân Biên rows remain without a defining paragraph in that edition. Twenty of them now also have a separate webpage excerpt and a dual-AI decision stored under `docs/knowledge/research/sprint-9c/`, not in the Tân Biên decision directory.

## Blockers

- 19 combinations were checked and still have no dual-AI review. Anh Tinh Nhập Miếu, Nhật Nguyệt Tàng Huy, Bán Không Chiết Xỉ, and the Wikisource lines for Đế Ngộ Hung Đồ, Lộ Bàng Mai Thi, Cát Xứ Tàng Hung, Chúng Thủy Triều Đông, and Thủy Trừng Quế Ngạc have a located sentence that was not sent to the models in this pass. Tài Ấn Giao Trì, Khúc Ám Đồng Cung, Lưỡng Trùng Thiên Mã, Cự Phùng Tứ Sát, Hoa Cái Cư Phu Thê, Đồng Lương Tỵ Hợi, Mệnh VCD Đắc Tam Không, and Tử Phủ Vũ Tướng did not yield a defining paragraph in the retrieved HTML.
- Equivalence between most Chinese page titles and the Vietnamese catalog names is not established.
- Hùng Tú and Bán Không Chiết Xỉ point at different names on the retrieved pages.
- Wikisource lines for Đế Ngộ, Lộ Bàng, Cát Xứ, Chúng Thủy, and Thủy Trừng were located and not sent through the comparator in this batch.
- Tài Ấn Giao Trì, Khúc Ám Đồng Cung, and Lưỡng Trùng Thiên Mã still have no defining passage on the checked URL.
