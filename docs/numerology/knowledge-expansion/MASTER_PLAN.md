# Kế hoạch mở rộng tri thức Thần số học

- version: 1
- source: yêu cầu AutoDev ngày 2026-10-13
- baseline: `b014969844b9e9accf3e8ef6be5bd0f629775658` (`origin/main`, merge PR #24)

## Yêu cầu gốc

Nghiên cứu và, khi công thức đủ để kiểm độc lập, triển khai năm chỉ số nâng cao. Nghiên cứu số 33 và thử thách 0. Làm sâu lời đã có khi có căn cứ. Lập sổ quan hệ nhiều số. Không đổi profile `1.2.0`. Không deploy. Không sửa Tử Vi.

## Phạm vi

Công thức Decoz đã có trang tính tay cho đam mê ẩn, bài học từ tên, cân bằng, tư duy và cầu. API thêm đối tượng `indicators` phiên bản `1.0.0`. Lời catalog `1.2.0` giữ nguyên. Số 33 và thử thách 0 vẫn withheld. Mũi tên tâm lý và biểu đồ tên không nhận bài mới.

## Loại trừ

P2 không đủ công thức khác (period cycle giữ master, planes, transit, karmic debt). Deploy, staging, Tử Vi, SQLite.

## Bối cảnh kỹ thuật

Profile `pythagorean-vn-v1` `1.2.0`, schema `1.2.0`, catalog `1.2.0` (154 bài). Cổng nội dung chỉ nhận nguồn GitHub blob đã ghim; nguồn đó không có 33 hay 0.

## Kiến trúc

Một hàm thuần `calculateIndicators` trên server. Frontend chỉ hiển thị. Không tính lại.

## Giả định

Họ tên Việt nhập họ trước. Token đầu sau chuẩn hóa là họ, không phải first name kiểu Decoz. Giao diện nói rõ điều này.

## Rủi ro

Cầu lấy số master đã công bố nên hiệu có thể lớn hơn 9. Tư duy của Decoz có một câu mâu thuẫn về số 22; hồ sơ chọn trang hướng dẫn tính và ví dụ Thomas.

## Việc

### T001 — Nghiên cứu và đặc tả

- status: completed
- depends_on: []
- scope: `docs/numerology/knowledge-expansion/`
- acceptance_criteria:
  - Năm chỉ số có nguồn, công thức, ví dụ và quyết định.
  - 33 và thử thách 0 có quyết định xuất bản.
- verification:
  - Đọc các tệp nguồn trong thư mục này.

### T002 — Máy tính và báo cáo

- status: completed
- depends_on: [T001]
- scope: backend indicators, frontend report, tests
- acceptance_criteria:
  - Số cũ 15/6/1990 Nguyễn Văn An không đổi.
  - Chỉ số mới khớp fixture độc lập.
  - Thiếu tên thì không bịa số 0.
- verification:
  - `node test/numerologyIndicators.test.mjs`
  - frontend page tests

## Xong khi

Năm chỉ số được nghiên cứu. Chỉ số đủ công thức được tính trên server và hiện trên báo cáo. 33 và thử thách 0 không bị đổi số và không có bài catalog mới. PR nháp ghi giới hạn còn lại.

## Thay đổi kế hoạch

Không.
