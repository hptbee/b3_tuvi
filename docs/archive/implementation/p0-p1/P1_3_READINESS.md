# Sẵn sàng cho P1.3 — Expert Knowledge Base?

## Kết luận

**NOT READY FOR P1.3**

Engine cách cục và SQLite đủ để thiết kế schema tri thức sau này. Kho chữ hiện có chưa phải knowledge base có nguồn. Bắt đầu P1.3 bây giờ sẽ bọc lời văn chưa dẫn nguồn thành “tri thức chuyên gia”.

## Ba lớp không được gộp

| Lớp | Hiện có | Không được hiểu là |
|---|---|---|
| Test phần mềm | `npm test` backend PASS; lint/build frontend PASS | Sao đã an đúng theo mọi phái, hoặc cách cục đã đúng thư |
| Công thức trong repo | 15 cách `matching_ok`, 44 `provisional`, 4 `disabled` | Đã thẩm định bởi người hành nghề |
| Nguồn thư tịch | Chưa có sách, chương, tờ, dị bản gắn vào từng câu | Độ tin cậy một số |

## Đã có thể tái sử dụng

- Id sao ổn định, 12 cung, quan hệ cung, Tứ Hóa dạng association.
- Evidence rule: cung, sao, quan hệ (`op`), độ sáng instance, `schoolId` của lá số nếu engine trả.
- `schoolProfile.js` và `docs/tuvi/TU_VI_SCHOOL_VARIANTS.md` ghi một số dị bản an sao (Văn Tinh Nhâm, Chủ Mệnh, Phá Toái).
- Lời nghĩa sao/cung: khoảng 19 sao và 13 cung trong script seed, không có trích dẫn.
- Lời cách cục: `description` và `interpretations` trong JSON, nhiều câu đã rút khẳng định sinh tử / cha mẹ / sức khỏe, kèm disclaimer.

## Còn thiếu trước khi làm P1.3

- Bản ghi nguồn: tác giả, tác phẩm, lần in, vị trí (hồi/đoạn/trang), đoạn trích.
- Rule tri thức tách khỏi rule khớp sao: phạm vi (sao, cung, cách, hạn), tiền đề, yếu tố tăng, yếu tố phá, claim, trạng thái kiểm chứng.
- Tham chiếu rule mâu thuẫn (cùng một thế sao, hai phái hai lời).
- Lịch sử sửa câu chữ, không ghi đè im lặng.
- Không suy diễn “sát tinh”, “đắc địa”, Nhị hợp, Ám hợp, lưu niên khi nguồn chưa liệt kê.

SQLite đủ cho các bảng này ở quy mô một file cục bộ, một tiến trình ghi. Chưa cần PostgreSQL. Schema version hiện là `1` và chưa có ALTER; P1.3 phải thêm version mới thay vì nhét JSON tự do vào cột `rules` của bảng `stars`.

## Schema đề xuất (chưa triển khai)

- `knowledge_rules`: `id`, `rule_type`, `school_id`, `scope_json`, `preconditions_json`, `support_json`, `break_json`, `claims_json`, `verification_status`, `version`
- `sources`: `id`, `author`, `work`, `edition`, `location`, `excerpt`
- `rule_sources`: `rule_id`, `source_id`, `relation` (`states`, `contradicts`, `comments`)
- `rule_conflicts`: `rule_id`, `other_rule_id`, `note`
- Khóa sao/cung dùng id đã có (`tu_vi`, `menh`, …), không dùng tên hiển thị làm khóa.

`verification_status` của knowledge rule là một trường riêng, không thay `matching_ok` của matcher và không thay kết quả test.

## Việc nên làm trước, theo thứ tự

1. Giữ matcher và SQLite như hiện tại. Không bật cách `disabled`.
2. Lập bảng nguồn tối thiểu từ tài liệu dự án đã chấp nhận dị bản, mỗi dòng có chỗ dẫn.
3. Chỉ nhập câu nào gắn được nguồn. Câu không nguồn để `provisional` hoặc bỏ khỏi KB.
4. Sau đó mới thêm schema version `2` và API đọc tri thức. Không gọi LLM ở bước đó.
