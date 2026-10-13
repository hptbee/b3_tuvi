# Backlog hoàn thiện Numerology V1

Ngày lập: 2026-10-13, sau kiểm toán profile `pythagorean-vn-v1` `1.2.0`. Không tự thêm việc V2 vào V1. Không đổi công thức trong các mục dưới đây trừ khi mục đó nói rõ là đề xuất profile mới.

## P0

Không có mục P0. Không thấy phép tính lệch spec 1.2.0, không thấy lưu ngày sinh, và không thấy lời 33 hay lời đỉnh được đăng khi chưa có bài.

## P1

### NUM-AUD-001 — Profile Decoz chỉ là đề xuất, chưa triển khai

- Mức: P1 đối với quyết định tri thức, không phải lỗi đang chạy.
- File: `backend/src/numerology/calculate.js` dòng 24; `pinnacles.js` dòng 25–27; `input.js` dòng 47–48.
- Bằng chứng: 11/09/2000 profile ra Đường đời 4, cách thành phần có master ra 22. 22/11/1992 profile P1=6, cách giữ master ra 33. Y cố định là phụ âm. Biểu đạt cộng một lần cả chuỗi.
- Nguyên nhân: D03, D06 và `component-reduce-root-age-v1` cố ý khác trang Decoz đã đọc.
- Ảnh hưởng: người dùng đối chiếu worldnumerology.com sẽ thấy số khác ở một số ngày và một số tên, dù profile tự nhất quán.
- Hướng xử lý: giữ 1.2.0. Nếu cần khớp trang Decoz, tạo profile mới, fixture tay mới, và từ chối đổi số của profile cũ.
- Chấp nhận: client gửi `profileVersion=1.2.0` vẫn nhận các fixture hiện tại. Profile mới có bài kiểm 11/09/2000 và 22/11/1992 theo quy ước mới.
- Test: không sửa fixture `method-divergence` và `components-do-not-keep-masters` cho đến khi có version mới.
- Phụ thuộc: quyết định sản phẩm. Chưa có ấn bản sách.

### NUM-AUD-002 — Export, import an toàn và in

- Mức: P1 cho checklist V1, không chặn calculator.
- File: `frontend/src/numerology/NumerologyPage.jsx`; không có module export thần số.
- Bằng chứng: roadmap §15.3 còn mở. CSS thần số không có print. Export lá số Tử Vi không dùng cho trang này.
- Nguyên nhân: hạng mục chưa làm.
- Ảnh hưởng: chưa tải JSON, chưa nhập lại để tính lại, chưa in riêng kết quả.
- Hướng xử lý: JSON opt-in tên, import chỉ gửi lại input cho `POST /calculate`, in ẩn form.
- Chấp nhận: import một file đã sửa số không được tin số đó; server tính lại. Bản in không chứa form nháp.
- Test: unit từ chối kết quả client; Playwright print media.
- Phụ thuộc: không thêm localStorage.

### NUM-AUD-003 — Giới hạn tần suất và cấu hình phát hành

- Mức: P1 trước production, không phải lỗi tính.
- File: `backend/src/routes/numerologyRoutes.js` không có rate limit. `frontend/index.html` chưa có robots/tiêu đề trang.
- Bằng chứng: route có `Cache-Control: no-store`, parser 256kb ở `app.js`, log lỗi không ghi tên. Không có staging, rollback hay monitoring trong repo cho route này.
- Nguyên nhân: checklist §15 chưa được triển khai.
- Ảnh hưởng: endpoint công khai có thể bị gọi dồn. Landing chưa được cấu hình index có chủ đích.
- Hướng xử lý: giới hạn theo IP hoặc cổng deploy, meta/robots theo quyết định SEO, checklist staging và rollback.
- Chấp nhận: vượt ngưỡng trả lỗi ổn định, không log body; tài liệu không ghi production-ready chỉ vì test local đạt.
- Test: integration vượt ngưỡng; không dùng ngày sinh làm khóa log.
- Phụ thuộc: môi trường deploy. Ngoài phạm vi sửa công thức.

### NUM-AUD-004 — Tài liệu lệch runtime

- Mức: P1 vì có câu nói chưa có endpoint nội dung và `contentVersion=null` trong khi runtime đã có catalog.
- File: `docs/numerology/IMPLEMENTATION_STATUS.md`, `docs/ROADMAP_NUMEROLOGY_A_TO_Z.md` §17, `docs/numerology/DECISIONS.md` D11, `docs/numerology/SOURCE_REGISTRY.md`.
- Bằng chứng: `GET /api/numerology/meanings/:metricId/:value`, catalog 102 mục, profile 1.2.0. Đợt này sửa các câu đó.
- Nguyên nhân: snapshot 13/10 được viết tiếp nhưng còn câu của giai đoạn trước.
- Ảnh hưởng: người đọc có thể tưởng lời luận chưa tồn tại, hoặc tưởng nguồn đã xác minh.
- Hướng xử lý: snapshot mới trỏ tới thư mục audit. Giữ lịch sử bằng cách ghi là snapshot cũ.
- Chấp nhận: không còn câu “không có meaning endpoint” hay “mọi meaning đều null” như hiện trạng HEAD.
- Test: review tài liệu, không cần test runtime.
- Phụ thuộc: không nâng cờ `bookVerified`.

## P2

### NUM-AUD-005 — Lời luận ít lặp và vẫn trong cổng

- File: `backend/src/numerology/data/catalog.vi.json`, `content.js` dòng 47–50.
- Bằng chứng: 11 thân chữ ghép thành 102 mục. Ma trận trong `CONTENT_QUALITY_AUDIT.md`.
- Hướng xử lý: sửa ở bản thảo, thêm câu theo nhóm chỉ số, rồi mới qua cổng review. Không bật 33. Không thêm lời đỉnh cho đến khi có nguồn được phép dùng.
- Chấp nhận: `approvedForPublic` chỉ đổi bằng một review mới, không đổi trong đợt audit.
- Test: `numerologyContent.test.mjs` vẫn đủ 102 mục hoặc số mục mới được khai báo, và vẫn không có fallback 33.
- Phụ thuộc: người review biên tập. Nguồn cộng đồng vẫn không phải sách.

### NUM-AUD-006 — Nói rõ cửa sổ thử thách trên UI

- File: `NumerologyAdvanced.jsx`.
- Bằng chứng: cùng kỳ với đỉnh, trong khi trang Decoz nói thời lượng thử thách là ước lượng.
- Hướng xử lý: một câu disclosure cạnh timeline. Không đổi tuổi.
- Chấp nhận: E2E đỉnh vẫn thấy thử thách 0 và câu mới.
- Test: spec pinnacle hiện có.
- Phụ thuộc: không đổi `pinnacles.js`.

### NUM-AUD-007 — `lang` và tiêu đề

- File: `frontend/index.html`.
- Bằng chứng: `lang="en"`, title `tuvi-b`.
- Hướng xử lý: ngôn ngữ và tiêu đề đúng trang tiếng Việt, không phá route Tử Vi nếu chúng cần ngôn ngữ khác.
- Chấp nhận: E2E đọc `lang` trên `/than-so-hoc`.
- Test: một assert Playwright.
- Phụ thuộc: UX-01.

### NUM-AUD-008 — Dossier sách

- File: `SOURCE_REGISTRY.md` và báo cáo nguồn đợt này.
- Bằng chứng: năm URL Decoz ở bậc `source_read`, không có `edition_verified`.
- Hướng xử lý: nếu mua hoặc mượn được ấn bản, ghi locator, năm, và đoạn được phép trích. Không điền trang cho sách chưa cầm.
- Chấp nhận: conflict matrix tách trang web khỏi sách.
- Test: không có test tự động cho sách giấy.
- Phụ thuộc: quyền truy cập tài liệu.

## P3

### NUM-AUD-009 — Nhánh phòng thủ và default version nội dung

- File: `profile.js` dòng 21; `content.js` dòng 60 default `profileVersion='1.1.0'`; `pinnacles.js` dòng 72; `input.js` dòng 51.
- Bằng chứng: coverage nhánh profile 66.66% dù lines 100%. `calculate.js` truyền `1.2.0` nên default không đi qua API.
- Hướng xử lý: default nên là version profile hiện tại, hoặc bỏ default. Thêm test cho nhánh content rỗng nếu muốn đủ nhánh.
- Chấp nhận: gọi `getMeaning` không tham số không vô tình chọn version đã bỏ.
- Test: unit gọi thiếu version.
- Phụ thuộc: không đổi số.

### NUM-AUD-010 — Lưới đỉnh một cột trên 320px

- File: `numerology.css` quy tắc `.num-pinnacle-values`.
- Hướng xử lý: một cột khi hẹp.
- Chấp nhận: không tràn ở 320px.
- Test: spec mobile hiện có, thêm hộp đỉnh nếu đổi CSS.
- Phụ thuộc: không.

## Ngoài V1

Các chỉ số Decoz chưa có trong profile: karmic debt/lesson, hidden passion, balance, rational thought, planes, cornerstone, transits, essence, tên đang dùng, minor expression. AI luận giải runtime cũng ngoài V1. Không đưa vào scope hoàn thiện V1 trừ khi có yêu cầu mới.

## Thứ tự làm tiếp

1. Giữ nguyên công thức 1.2.0.
2. Đóng tài liệu lệch, đợt này đã làm phần mô tả runtime.
3. Chốt có hay không một profile Decoz riêng trước khi viết thêm fixture.
4. Export/import/in và câu disclosure thử thách.
5. Rate limit, SEO, staging, rollback.
6. Sửa chữ catalog chỉ sau cổng review.
7. Sách và V2 để sau.
