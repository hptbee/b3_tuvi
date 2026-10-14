# Lộ trình hoàn thiện sản phẩm Thần số học

> **Rebaseline:** 2026-10-14 · `main ed31ad1` · Profile `pythagorean-vn-v1` `1.2.0` · Catalog `1.2.0`.
> **Nguồn roadmap chính:** [ROADMAP_NUMEROLOGY_A_TO_Z.md](../../planning/ROADMAP_NUMEROLOGY_A_TO_Z.md) §12.9, §15–18.
> **Điểm xuất phát lịch sử:** product gap audit tại `f709e42`, PR #24 và ảnh `screenshots/`. Kế hoạch P0/P1 khi đó đã được triển khai, không còn là backlog chưa làm.

## Phạm vi và cách đọc

Audit ban đầu ghi **90 mục** thuộc 9 nhóm (49 MISSING, 27 BASIC, 4 PARTIAL, 2 NUMBER_ONLY, 2 DATA_ONLY, 3 COMPLETE, 3 NOT_APPLICABLE). Các số này là **snapshot tại `f709e42`**, tuyệt đối không dùng làm phần trăm hoàn thành sản phẩm sau merge PR #24. Hiện tại có báo cáo nhiều chương nhưng chưa phải toàn bộ mọi trường phái/chỉ số hoặc report luận sâu.

| Chiều | Trạng thái | Điều chưa được suy ra |
|---|---|---|
| Calculation consistency | `FORMULA_PROFILE_CONSISTENT` | Không phải school/source authentication |
| Report experience | `V1_FEATURE_COMPLETE` cho scope đã chọn | Không phải đầy đủ 90 mục product audit |
| Visualization | Đã có hình đỉnh/cạnh/trục tuổi/grid tên/ngày sinh/ghép/chu kỳ | Không có suy diễn tâm lý ở lưới tên |
| Interpretation | 154 bài experimental-editorial eligible, còn 33/Challenge 0 withheld | Không phải expert/book verified |
| Release | CI trên `ed31ad1` PASS | Chưa staging, rollback, owner approval |

## P0 — Lá số nhìn được và đọc được

### P0a — DONE (đã merge PR #24)

- Kim tự tháp bốn đỉnh có cạnh toán học chính xác: P1=tháng+ngày; P2=ngày+năm; P3=P1+P2; P4=tháng+năm. Đáy là reduced components với master tắt, không gọi là Decoz Period Cycle.
- Challenge age timeline có giai đoạn mở, không gán độ dài giả; Challenge 0 giữ nguyên.
- Lưới ngày sinh 3×3 vẽ một tuyến được chọn, phân biệt present/partial/absent và có text alternative; ô trống không phải điểm yếu.
- Fact-only overview, responsive desktop/320px/390px/A4 print.
- Tên + ngày sinh: biểu đồ 3×3 dual source, đếm riêng hai lớp, bảng chi tiết vẫn có.

**Evidence:** [VISUAL_ACCEPTANCE](../implementation/VISUAL_ACCEPTANCE.md), [ảnh after](../implementation/screenshots/after/), [CI main](https://github.com/hptbee/b3_tuvi/actions/runs/38438302551).

### P0b — PARTIAL CONTENT

- **Đã công bố:** 44 bài đỉnh (4 giai đoạn × 11 giá trị 1–9/11/22), 8 bài thử thách 1–8; lớp tên tuyến `arrow-labels-vn-v1` chỉ dùng đúng điều kiện.
- **Chưa có:** Challenge 0 và Master 33; lời sâu cho repeated/missing digits, partial lines và name/combined chart chưa xác lập lớp diễn giải riêng.
- **Evidence gate:** original Vietnamese, source scoped, model editorial review có thật; `expertVerified=false`, `bookVerified=false`. Không fallback 0→9 hoặc 33→6.

**Next:** `NUM-K004`, `NUM-K005`, `NUM-K006` theo master roadmap. Không xem việc withholding là lỗi tính toán.

## P1 — Báo cáo nhiều chương — DONE for scoped interactions

Các mục đã triển khai:

- 102 lời core/chu kỳ có thể đọc ngay trên thẻ; nguồn/method mở riêng.
- 9 năm và 12 tháng tính **backend**, có `viewDate` hợp lệ, ô trước ngày sinh disabled.
- Name Chart, Combined Birth+Name Chart, tính số từ chữ Pythagorean, không suy tên bù ô trống.
- Các mối nối **đúng phép tính** (maturity, master/root, thành phần đỉnh, hiệu thử thách, chu kỳ), không gắn điểm harmony/conflict.
- Mục lục chương, JSON export/import có recalculation, print A4 và opt-in họ tên.

**Còn cải thiện chất lượng:** đọc sâu theo metric, tổng hợp đa chỉ số được định nghĩa và review, progressive disclosure, ngắt trang A4; không cần làm lại giao diện từ đầu. Gắn `NUM-K005`–`NUM-K008`.

## P2 — Knowledge Expansion — NEXT / REQUIRE SOURCE

| Ưu tiên | Candidate | Hiện trạng | Điều kiện cho public |
|---|---|---|---|
| P0 | Hidden Passion | `REQUIRES_SPEC` | Frequency/tie/name/master rule + source + >=3 fixtures |
| P0 | Karmic Lessons | `REQUIRES_SPEC` | Quy tắc thiếu **trong tên**, không đồng nhất thiếu ở birth grid |
| P0 | Balance | `REQUIRES_SPEC` | Initials, tên ghép/hyphen, master reduction |
| P0 | Rational Thought | `REQUIRES_SPEC` | Chọn birthday/original day vs expression policy có nguồn |
| P0 | Bridge Numbers | `REQUIRES_SPEC` | Root/master difference, zero và defined bridge types |
| P1 | 33 + Challenge 0 interpretation | `SOURCE_GAP` | Independent source-specific editorial decisions; không đổi phép tính |
| P1 | Defined combined interpretation | `NEEDS RULE REGISTRY` | Separate formula fact / scoped symbolic reading / original reflective synthesis |
| P2 | Alternate profiles, Minor numbers, Period Cycle | `OPTIONAL` | Profile/capability version và variant transparency |

Các mục này **không được tự hiện số trong UI** khi chỉ mới có tên gọi trên competitor landing. Ưu tiên nguồn tác giả, phép tính rõ và fixtures độc lập. Không dừng cả package khi một ứng viên thiếu nguồn; ghi blocker và tiếp tục.

**Execution:** một AutoDev có Master Plan duy nhất, work packages `NUM-K001`–`NUM-K009`, research có giới hạn; xem [master roadmap §18](../../planning/ROADMAP_NUMEROLOGY_A_TO_Z.md).

## P3 — Optional / không thành điều kiện V1

Tương hợp cặp đôi, luận tên trẻ, saved birth history, career/wealth/health certainty, color/proportional score, AI narration, transits/essence phức tạp. Không thêm điểm hay lời dự đoán chỉ để giống competitor. Nếu về sau chọn một tính năng, cần spec, source, test, privacy và review độc lập.

## Release validation — track tách biệt

`NUM-R001` staging deploy/API/SPA; `NUM-R002` shared proxy rate limit; `NUM-R003` rollback rehearsal; `NUM-R004` cross-browser/a11y; `NUM-R005` release owner approval. **Chưa hoàn thành**, không tự gộp vào Knowledge Expansion và không suy production-ready từ CI.

## Đợt thực thi tiếp theo

Một AutoDev từ `main`: **K0 nghiên cứu 5 ứng viên → K1 quyết định 33/0 → K2 tăng chiều sâu nội dung và biểu đồ → K3 relationship registry → K4 cải thiện trải nghiệm đọc → integration review**. Formula 1.2.0 phải bất biến. Mỗi capability báo riêng formula, visualization, interpretation, source, review và public eligibility. Draft PR; không auto merge/deploy.
