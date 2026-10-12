# Hướng dẫn agent — B3 Tử Vi

Đọc trước khi sửa repo. Không thay `docs/AUTODEV_MASTER_PLAN.md` (lịch sử V1). Việc đang chạy nằm ở `docs/AUTODEV_MASTER_PLAN_V2.md`. Hàng rào đóng góp: `docs/CONTRIBUTING.md`.

## Phạm vi đã loại

Không làm đăng ký, đăng nhập, hồ sơ, lịch sử lá số, dashboard ngày giờ sinh, đồng bộ cloud, hay thanh toán. Không đặt lại các việc đó dưới tên khác.

## Không làm im lặng

- Sửa công thức an sao hoặc `rulesV2.json` / logic `combinations.json`.
- Gắn `authenticated: true`, `bibliographicStatus: primary`, hoặc `formulaCheckedAgainstSource: true` khi chưa có ấn bản do người xác nhận.
- Ghi đè hoặc xóa `backend/data/*.sqlite`.
- Merge công thức, nguồn đã nâng, migration production, hoặc AI công khai vào `main` khi chưa duyệt.
- Bật cách `disabled`. Coi test PASS là đối chiếu sách.
- Gọi prototype schema tri thức từ `initDatabase()`.

## Bốn lớp

`implementationStatus`, `formulaStatus`, `bibliographicStatus`, `interpretationStatus`. Validator: `backend/src/knowledge/provenance.js`.

## Cổng cần người

Công nhận ấn bản, đổi công thức đang tranh luận, bật cách tắt, đổi school profile mặc định, migration có thể mất dữ liệu, AI luận giải công khai, phát hành production.

Việc kỹ thuật đã có acceptance criteria và không nằm trong danh sách trên thì làm tiếp, không hỏi lại.
