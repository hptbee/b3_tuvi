# Kiểm toán UI/UX Thần Số Học

Phạm vi: route `/than-so-hoc`, các file `frontend/src/numerology/`. Ngày kiểm: 2026-10-13. Không thiết kế lại trang. Khác biệt dưới đây là quan sát từ mã và từ Playwright, tách khỏi lỗi công thức.

## Những gì đang hoạt động

- Một trang: phần mở, form, rồi kết quả. Không có route kết quả riêng, nên không có URL chứa ngày sinh hoặc tên.
- Form có nhãn, `fieldset` ngày sinh, lỗi gắn `aria-invalid` và `aria-describedby`, nút bị khóa khi đang gửi cùng một input.
- Kết quả dùng `output` và tiêu đề. Trace mở bằng bàn phím. E2E tập trung heading kết quả sau lần tính thành công.
- Biểu đồ có `aria-label` theo ô. Kỳ đỉnh đang hoạt động có `aria-current="step"`.
- Master hiển thị kèm gốc. Thử thách ghi “Hiệu tuyệt đối của A và B”, không in phép trừ có dấu sai.
- Disclosure nói nội dung là biên tập thử nghiệm, và đỉnh/thử thách chưa có lời luận.
- `App.css` có rule `prefers-reduced-motion: reduce` tắt animation/transition toàn cục, và trang nằm trong `App`.
- Playwright `e2e/numerology.spec.js` bằng config đã commit: 17/17, gồm 320px, 390px, bàn phím, trace, lưới, chu kỳ và đỉnh.

## Phát hiện

### UX-01 — Ngôn ngữ tài liệu là `en` trong khi UI là tiếng Việt

- Mức: P2.
- File: `frontend/index.html` dòng 2 và dòng 7.
- Bằng chứng: `<html lang="en">`, `<title>tuvi-b</title>`. Toàn bộ nhãn `/than-so-hoc` là tiếng Việt.
- Nguyên nhân: shell HTML dùng cho cả ứng dụng, chưa có tiêu đề hay ngôn ngữ riêng của trang thần số.
- Ảnh hưởng: trình đọc màn hình có thể chọn giọng tiếng Anh cho câu tiếng Việt. Tab trình duyệt không nói tên sản phẩm.
- Hướng xử lý: đặt `lang="vi"` khi vào route này, hoặc đặt ngôn ngữ tài liệu theo ngôn ngữ UI. Tiêu đề tab nên có tên trang.
- Chấp nhận: trình đọc thấy ngôn ngữ Việt; tiêu đề không còn là tên kỹ thuật.
- Test: E2E đọc `document.documentElement.lang` trên `/than-so-hoc`.
- Phụ thuộc: cách các route Tử Vi đang dùng chung `index.html`.

### UX-02 — Chưa có bản in riêng cho kết quả thần số

- Mức: P1 đối với hạng mục V1 “print”, không phải lỗi tính sai.
- File: `frontend/src/numerology/numerology.css` không có `@media print`. `Landing.css` chỉ ẩn nav. `App.css` có print cho lá số Tử Vi.
- Bằng chứng: không có nút in trên `NumerologyPage.jsx`. Form vẫn là một phần của trang kết quả.
- Ảnh hưởng: in từ trình duyệt sẽ kèm form và điều hướng. Chưa có PDF.
- Hướng xử lý: stylesheet in chỉ giữ kết quả đã tính, ẩn form đang sửa, và giữ disclosure.
- Chấp nhận: E2E hoặc kiểm in xác nhận form không nằm trong trang in; số in ra đúng response đã có.
- Test: Playwright `emulateMedia({ media: 'print' })` trên kết quả 15/6/1990.
- Phụ thuộc: hạng mục export/import ở backlog V1.

### UX-03 — Thời lượng thử thách trông như cùng một kỳ với đỉnh

- Mức: P2, là độ rõ của quy ước, không phải lỗi phép trừ.
- File: `frontend/src/numerology/NumerologyAdvanced.jsx` khoảng dòng 35–41.
- Bằng chứng: mỗi mục liệt kê một đỉnh và một thử thách trong cùng cửa sổ tuổi. Trang Decoz đã đọc nói thời lượng thử thách là ước lượng và có chồng lấn.
- Profile cố ý dùng chung cửa sổ. Dòng chữ cuối trang đã nói quy ước tuổi của bản thử nghiệm.
- Hướng xử lý: thêm một câu ngay tại timeline: thử thách dùng cùng mốc tuổi với đỉnh theo profile, không phải lịch chồng lấn của trường phái khác.
- Chấp nhận: câu đó có mặt cả khi số thử thách là 0.
- Test: E2E của 15/6/1990 vẫn thấy thử thách 0 và câu quy ước.
- Phụ thuộc: không đổi `pinnacles.js`.

### UX-04 — Chưa có trạng thái trang cho SEO kết quả cá nhân

- Mức: P1 khi phát hành, vì checklist roadmap còn mở.
- File: `frontend/index.html`.
- Bằng chứng: không có `meta name="robots"`. Kết quả không được đưa lên URL hay `localStorage`; E2E kiểm storage rỗng.
- Ảnh hưởng: landing có thể bị lập chỉ mục với tiêu đề kỹ thuật. Không có URL kết quả riêng để gắn `noindex`, nên rủi ro lộ ngày sinh qua URL hiện không thấy trong thiết kế này.
- Hướng xử lý: chốt chủ đích index của landing. Giữ kết quả ngoài URL. Không thêm storage.
- Chấp nhận: tài liệu phát hành nói rõ kết quả không có URL; meta khớp quyết định đó.
- Test: E2E hiện có cho storage và body POST. Thêm assert meta khi meta được chốt.
- Phụ thuộc: cấu hình deploy.

### UX-05 — Lưới đỉnh chật trên bề ngang rất nhỏ

- Mức: P3.
- File: `numerology.css` quy tắc `.num-pinnacle-values` vẫn là hai cột.
- Bằng chứng: media 600px đổi lưới chỉ số chính về một cột, chưa đổi hai cột đỉnh/thử thách. E2E 320px kiểm không tràn viewport của luồng chính, không chụp riêng khối đỉnh ở mọi cỡ chữ.
- Hướng xử lý: chỉ xếp một cột khi bề ngang không đủ hai số lớn.
- Chấp nhận: ở 320px, giá trị đỉnh và thử thách không chồng chữ.
- Test: bổ sung assert hộp đỉnh trong spec mobile nếu đổi CSS.
- Phụ thuộc: không chặn V1 tính toán.

## Không xếp là lỗi

- Frontend không tính lại công thức. `api.js` chỉ kiểm cấu trúc, trong đó có đối chiếu thử thách với hiệu tuyệt đối của hai toán hạng server đã trả.
- Focus sau submit, abort khi rời trang, và retry theo snapshot đã có test E2E.
- Reduced motion dùng rule toàn cục trong `App.css` dòng 832. Chưa có audit WCAG đầy đủ, nên rule này chưa được gọi là đạt chuẩn.
