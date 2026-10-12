# Kế hoạch P1.3B — chưa thực hiện

P1.3A dừng ở sổ nguồn và ma trận. Không có migration.

## Khi nào được code

Chỉ sau khi một ấn bản có bìa đã được ghi trong `sources.json` với `bibliographicStatus` không còn `conflicting_secondary` / `unverified_attribution`, và ít nhất một claim có `page` hoặc `location` trỏ ấn bản đó.

Nếu sách không chứa một cách nào trong 10 ứng viên, ghi “không thấy” và vẫn không bịa claim.

## Bảng đề xuất (schema version 2)

Giữ bảng v1 (`horoscopes`, `stars`, `palaces`, `combinations`). Thêm:

- `sources` — cột trùng `docs/knowledge/sources.json`. Trường không biết để NULL.
- `claims` — một ý, bốn cột trạng thái riêng: `implementation_status`, `formula_status`, `bibliographic_status`, `interpretation_status`.
- `claim_sources` — `claim_id`, `source_id`, `chapter`, `section`, `page`, `location`, `support_type`. `page` NULL được phép.
- `claim_links` — `from_claim_id`, `to_claim_id`, `relation` (`contradicts` hoặc `supports`).
- `claim_revisions` — `claim_id`, `version`, `body_json`, `edited_at`. Không ghi đè im.
- `combo_claims` — `combination_name` (trùng `combinations.json`) tới `claim_id`.

`school_id` nằm trên `claims`, không suy từ độ phổ biến.

`schema_meta.schema_version` chuyển từ `1` sang `2` trong cùng transaction với `CREATE TABLE`.

## Migration

1. Copy file `tuvi.sqlite` ra chỗ backup trước khi mở ghi. Gồm cả `-wal` nếu tiến trình đang chạy; tốt hơn là dừng server rồi copy.
2. `BEGIN IMMEDIATE`.
3. `CREATE TABLE` các bảng mới. Không `ALTER` bảng v1 nếu không bắt buộc.
4. Không copy `description` của 63 cách vào `claims`.
5. Ghi `schema_version = 2`.
6. `COMMIT`. Lỗi thì `ROLLBACK`.

Rollback: đóng SQLite, thay file bằng bản copy bước 1. Không có script downgrade xóa claim nếu backup còn.

Dữ liệu v1 (lá số, sao, cung) đọc lại bằng repository hiện tại. API lập lá số và matcher không đọc bảng claim.

## Việc không làm trong P1.3B

- Không bật cách `disabled`.
- Không gọi LLM.
- Không đổi `verification_status` trong `combinations.json` chỉ vì đã có bảng.
- Không đưa PostgreSQL.
