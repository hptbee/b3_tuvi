# Báo cáo hoàn thành — mở rộng tri thức

Baseline: `b014969844b9e9accf3e8ef6be5bd0f629775658`. Nhánh: `cursor/numerology-knowledge-2318`.
Không deploy. Không merge. Không đổi công thức Tử Vi hay SQLite.

## Số liệu

- Chỉ số nâng cao đã nghiên cứu: 5.
- Có đặc tả kiểm được độc lập: 5.
- Đã tính trên server và hiện trên báo cáo: 5.
- Công thức còn kẹt: 0.
- Bài catalog mới: 0. Catalog vẫn `1.2.0`, 154 bài.
- Quy tắc quan hệ mới trong sổ: 10, toàn bộ là phép tính, chưa có bài.
- Hồi quy số cũ: không thấy. Đường đời 15/6/1990 vẫn 4. Schema vẫn `1.2.0`.

## Ma trận

| Capability | Source | Formula | Tests | Visualization | Interpretation | Review | Public status |
|---|---|---|---|---|---|---|---|
| Hidden Passion | Decoz how-to; Affinity tie-break rejected | Mode 1–9, ties kept | An [5], AABB [1,2] | Count card and trace | Withheld | Grok + GPT | `FORMULA_ONLY` |
| Karmic Lessons | Decoz; Numerologist.com agrees on missing 1–9 | Absent name digits | An [2,6,8,9] | Card; empty list is “Không thiếu” | Withheld | Grok + GPT | `FORMULA_ONLY` |
| Balance | Decoz initials, masters off | First letter of each normalized token | Thomas 11→2 | Card and trace | Withheld | Grok + GPT | `FORMULA_ONLY` |
| Rational Thought | Decoz Thomas example; 22-sentence not used | First token + raw day, masters off | An day 15 → 2; Thomas 7 | Card, trace, surname note | Withheld | Grok + GPT | `FORMULA_ONLY` |
| Bridges | Decoz three pairs | Absolute difference of published values | An 1, 10, 2; bridge 0; master 11 | List, no score | Withheld, including 0 and values above 9 | Grok + GPT | `FORMULA_ONLY` |
| Master 33 | Decoz page; pinned catalog has no 33 | Unchanged | Life path 29/3/1990 stays 33 | Existing master label | No article | Both reviewers | `BLOCKED_WITH_EVIDENCE` |
| Challenge 0 | Decoz versus “no single challenge” | Unchanged absolute difference | Existing pinnacle tests | Sentence states the conflict | No article | Both reviewers | `BLOCKED_WITH_EVIDENCE` |
| 154 readings | Pinned community themes | Unchanged | Content gate still 154 | Brief visible, theme body behind “Đọc thêm” | Previously published text kept | GPT: no new claims | `IMPLEMENTED_AND_VERIFIED` |
| Birth-grid arrows / name-chart psychology | No new gate-eligible source | Unchanged counts | Chart tests | Factual chart only | Not added | Documented | `NOT_IMPLEMENTED` |
| Heart’s Desire–Expression bridge | Mentioned by Decoz, omitted on purpose | Not in this release | None | None | None | Recorded | `OUT_OF_SCOPE` |

## Review

- `grok-4.7-high`, agent `bc-90ac3b55-385b-557e-b9eb-f6e43171ee20`: hai lỗi test minor. Đã sửa và chạy lại test chỉ số.
- `gpt-5.6-terra-medium`, agent `bc-218b9ff2-103b-5706-8ce0-19c7c7d03653`: `NO_FINDINGS`.
- Không có review chuyên gia. `expertVerified` và `bookVerified` vẫn false.

## Kiểm thử đã chạy

- Backend `npm run test:ci`: pass. Coverage floor lines 86.01, branches 87.61.
- Frontend `npm run test:ci`: 56 tests pass. `npm run lint` và `npm run build` pass.
- Playwright `e2e/numerology.spec.js`: 19 pass sau khi tắt server cũ cổng 5000/5173. Lần đầu 17 fail vì Playwright dùng lại server không có `indicators`. Đó là server cũ, không phải sai số.

CI trên GitHub chưa chạy tại thời điểm viết tệp này.

## Giới hạn còn lại

- Năm chỉ số có số, chưa có bài.
- Số 33 và thử thách 0 không có bài vì nguồn mâu thuẫn hoặc không qua cổng catalog.
- Gạch nối bị tách thành hai token vì chuẩn hóa tên hiện có. Một ví dụ transit của Decoz giữ họ ghép.
- Tư duy dùng token đầu. Họ tên Việt ghi họ trước thì đó là họ.
- Tệp JSON xuất ra không chứa `indicators`; nhập lại chỉ lấy ngày và họ tên rồi tính lại.
- Không thêm điểm hòa hợp. Không thêm lời mũi tên cho biểu đồ tên.
