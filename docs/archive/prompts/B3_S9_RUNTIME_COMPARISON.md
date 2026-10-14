# Direct comparison of actual PR #19 model artifacts and rulesV2

Observed 2026-10-13 at commit `7a4504c580dbafcabdd904b3fec0d08cf5f7a02b` using GitHub connected repository files (not locally executed app tests).

| Combination | Stored Grok vs Terra | What both extracted | rulesV2 observed | Research implication |
|---|---|---|---|---|
| Anh Tinh Nhập Miếu | CONFLICT vs PARTIAL | Same 3 condition IDs: `branch_ty_ngo`, `star_pha_host`, `star_liem_tuong_opposite` | `target=menh`, `branches=[Tí,Ngọ]`, `samePalace=[Phá Quân]` | Models disagree about *scope/grade*, not structural extraction. Verify opposite Liêm/Tướng is a calculated placement invariant; test base vs noble grade. |
| Hình Kỵ Giáp Ấn | CONFLICT vs PARTIAL | Same: `school_dependent`, `star_tuong_hoa_ky` | `giap(anchor=Thiên Tướng, flankGroups=[[Kình Dương,Thiên Hình],[Hóa Kỵ]])` | Multi-school definitions explicitly diverge. Evaluate per-school, no one universal formula. |
| Thiên Ất Củng Mệnh | CONFLICT vs MATCH | Same: `palace_menh`, `star_khoi_viet_aspect` | `clauses` with Khôi/Việt `at: menh_or_opposite` | Source 108s explicitly says 三方四正 (broader than menh-or-opposite); an unqualified MATCH is not supported by that source. |
| Văn Tinh Củng Mệnh | CONFLICT vs PARTIAL | Same: `palace_menh`, `star_xuong_khuc_aspect`, `avoid_sat` | `samePalace=[Văn Xương,Văn Khúc,Hóa Khoa]` | Source 108s 三方四正 for Xương/Khúc + quý-grade no sát. Code requires co-location plus Hóa Khoa: extra structural obligation. |
| Thạch Trung Ẩn Ngọc | PARTIAL vs MATCH | Same: `palace_menh`, `branch_ty_ngo`, `star_cu_host`, `strengthened_by_loc_quyen` | Cự Môn Mệnh Tí/Ngọ + mandatory (Hóa Lộc OR Hóa Quyền OR Lộc Tồn) at target | Source basic title applies before Lộc/Quyền additions, and stricter quý-grade adds conditions; one binary comparison hides two separate scopes. |
| Sát Phá Tham | MATCH vs PARTIAL | Not independently compared in this file | target Mệnh; 7 Sát, Phá Quân, Tham Lang `at:tam_hop` | Check relative chart geometry and whether condition is inherently true when Mệnh lies in that stellar trine. |
| Tử Phủ Vũ Tướng | PARTIAL vs MATCH | Not independently compared in this file | strict 4 stars in `tam_hop` | Secondary source often says 三方四正, a broader set; exact historical name unresolved. |

Evidence types: user PR review files and B3 runtime JSON are **repository facts**. Chinese source statements are **external historical/secondary text** requiring source-level binding before acceptance. Suggested distinctions are analysis, not official decisions.
