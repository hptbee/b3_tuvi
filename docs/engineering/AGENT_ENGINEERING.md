# Hướng dẫn agent — B3 Tử Vi

Đọc trước khi sửa repo. Không thay `docs/archive/planning/AUTODEV_MASTER_PLAN.md` (lịch sử V1). Việc đang chạy nằm ở `docs/planning/AUTODEV_MASTER_PLAN_V2.md`. Hàng rào đóng góp: `docs/engineering/CONTRIBUTING.md`.

## Phạm vi đã loại

Không làm đăng ký, đăng nhập, hồ sơ, lịch sử lá số, dashboard ngày giờ sinh, đồng bộ cloud, hay thanh toán. Không đặt lại các việc đó dưới tên khác.

## Không làm im lặng

- Sửa công thức an sao hoặc `rulesV2.json` / logic `combinations.json`.
- Gắn `authenticated: true` khi chưa có quyết định dual-AI trên đúng đối tượng đã đọc (locator hoặc hash kiểm lại được), hoặc gắn `bibliographicStatus: primary` / `formulaCheckedAgainstSource: true` chỉ vì edition đã authenticated hay vì test PASS.
- Ghi đè hoặc xóa `backend/data/*.sqlite`.
- Merge công thức, nguồn đã nâng, migration production, hoặc AI công khai vào `main` khi chưa duyệt.
- Bật cách `disabled`. Coi test PASS là đối chiếu sách.
- Gọi prototype schema tri thức từ `initDatabase()`.

## Bốn lớp

`implementationStatus`, `formulaStatus`, `bibliographicStatus`, `interpretationStatus`. Validator: `backend/src/knowledge/provenance.js`.

## Ủy quyền đọc nguồn (Sprint 9)

Chủ dự án không tự giám định từng đoạn sách. Với nghiên cứu nguồn và claim trong Sprint 9, quyết định văn bản là **dual-AI cross-review**: hai model đọc độc lập cùng đoạn, rồi một hàm so sánh fail-closed. Kết quả chấp nhận là `AI_CROSS_REVIEWED` / `AI_ACCEPTED` theo policy `dual-ai-source-review-v1`. `expertVerified` giữ `false`. Hai model đồng ý không phải expert review, không phải chân lý khoa học, và không tự sửa `rulesV2.json`.

Nếu model không chạy được hoặc không cùng đọc được đoạn, ghi `REVIEW_NOT_EXECUTED` hoặc `SOURCE_INACCESSIBLE`. Không điền verdict giả.

## Cổng chủ dự án vẫn giữ

Đổi công thức runtime, bật cách `disabled`, đổi school profile mặc định, migration SQLite production, luận giải hoặc AI public, và phát hành production. Các cổng này không được bỏ vì dual-AI đã chấp nhận một đoạn sách.

Việc kỹ thuật đã có acceptance criteria và không nằm trong danh sách trên thì làm tiếp, không hỏi lại.
