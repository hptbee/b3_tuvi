# Ma trận nguồn của 63 cách cục

Bản đủ cột: `docs/knowledge/combination-source-matrix.json`.

Cột tách riêng, không gộp thành một điểm tin cậy:

| Cột JSON | Câu hỏi |
|---|---|
| `executableV2` | Code có rule và test không |
| `verificationStatus` | Nhãn repo: `matching_ok`, `provisional`, `disabled` |
| `formula` | `formula_text` hiện có, chưa phải câu trong sách |
| `formulaCheckedAgainstSource` | Đã đọc ấn bản và thấy cùng công thức chưa |
| `interpretationSourced` | Lời luận có đoạn dẫn chưa |
| `sourceVerificationStatus` | Hiện là `none` cho cả 63 |

Số đếm trên file JSON ngày 2026-10-12:

- 63 dòng, khớp tên và thứ tự `combinations.json`.
- 58 dòng `executableV2: true`.
- 15 `matching_ok`, 44 `provisional`, 4 `disabled`.
- 10 dòng pilot có `sources: ["thai-thu-lang-tan-bien"]` và `sourceVerificationStatus: passage_located_edition_unverified`. 53 dòng còn `sources` rỗng.
- 0 dòng `formulaCheckedAgainstSource: true`. Ấn bản in chưa xác thực, kể cả 10 đoạn đã thấy trong PDF dựng lại.
- 9 dòng `absoluteClaimReview: true` (chữ bệnh, cha mẹ, tai nạn, chết hoặc cùng kiểu trong description / interpretation).

Bốn cách tắt, hành động `remain_disabled`: Khoa Minh Lộc Ám, Ám Lộc, Lưỡng Trùng Thiên Mã, Cát Xứ Tàng Hung.

Một cách provisional không có rule: Thiên Cơ Tỵ Hợi. “Ngộ sát tinh” không có danh sách đóng.

Đồng Lương Tỵ Hợi có ghi chú dị bản nội bộ: bảng độ sáng không cho Thiên Đồng hãm tại Tị/Hợi. Đó là xung đột dữ liệu dự án, chưa phải xung đột hai sách.

Mọi cách còn lại: `recommendedAction` = `hold_until_edition_checked`.

## Đọc nhanh

| Trạng thái repo | Có rule v2 | Đã đối chiếu sách |
|---|---|---|
| matching_ok (15) | 15 | 0 trang sách in đã giám định. Một số tên nằm trong PDF dựng lại; xem `docs/tuvi/PILOT_RULE_SOURCE_COMPARISON.md` |
| provisional (44) | 43 | 0 |
| disabled (4) | 0 | Khoa Minh Lộc Ám có đoạn 19.2.25 trong PDF dựng lại, rule vẫn tắt |

Test khóa ma trận không được gắn nguồn giả: `backend/test/knowledgeCatalog.test.mjs`.
