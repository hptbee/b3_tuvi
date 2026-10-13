# Cổng chỉ số P2

Ngày: 2026-10-13. Profile giữ `pythagorean-vn-v1` `1.2.0`.

Năm ứng viên không được đưa vào API công khai.

| Chỉ số | Trường phái được trang công khai nhắc | Công thức đủ để viết fixture | Quyết định |
|---|---|---|---|
| Hidden Passion | Decoz, trang chart calculator | Không. Trang liệt kê tên, không nói cách xử lý hòa, master, hay chữ lặp. | `REQUIRES_SPEC` |
| Karmic Lessons | Decoz, cùng trang | Không. Khác với ô trống của lưới ngày sinh. Chưa có quy tắc “thiếu trong tên” được ghim trong repo. | `REQUIRES_SPEC` |
| Balance | Decoz | Không. Chưa có định nghĩa chữ cái đầu từng phần tên, có giữ master hay không. | `REQUIRES_SPEC` |
| Rational Thought | Decoz và mục “tư duy” trên QuizVN | Không. Hai trang không công bố cùng một phép. QuizVN không chạy được trong audit. | `REQUIRES_SPEC` |
| Bridge | Decoz kể Life Path–Expression và Life Path–Birthday | Hiệu tuyệt đối nghe đơn giản, nhưng trang không nói dùng số gốc hay số master, và không có fixture độc lập trong repo. | `REQUIRES_SPEC` |

Bằng chứng: `docs/numerology/product-gap/COMPETITOR_BENCHMARK.md`. Không có `LIVE_RESULT_VERIFIED` cho các chỉ số này.

Khi có một đoạn đặc tả trong repo, kèm ví dụ tính tay và một profile hoặc capability version riêng, mới tính trên server. Không sửa số của bản 1.2.0 để nhét chúng vào.
