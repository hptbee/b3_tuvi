# Sổ nguồn Tử Vi

Máy đọc: `docs/knowledge/sources.json`. Truy cập các URL trong sổ: 2026-10-12.

Không điền năm, nhà xuất bản, chương, trang khi các trang thứ cấp không thống nhất hoặc khi chưa thấy ấn bản. Không có mục nào ở trạng thái `primary`.

## Sách và truyền thống

| sourceId | Điều đã thấy | bibliographicStatus |
|---|---|---|
| `ziwei-quanshu-tradition` | Tên Hán 紫微斗數全書. Các bài tiếng Việt gán Hi Di Trần Đoàn và La Hồng Tiên. Không có bản Hán trong tay. | `unverified_attribution` |
| `vu-tai-luc-toan-thu` | Bản Việt được giới thiệu là Vũ Tài Lục dịch. Một trang bán và đầu một scan ghi Ngân Hà Thư Xã 1973. Sơn Khiêm nói năm bản Việt chưa đối soát. | `conflicting_secondary` |
| `thai-thu-lang-tan-bien` | Bút danh Vân Đằng Thái Thứ Lang. PDF 277 trang, bìa ghi Sài Gòn 1956, file InDesign 2014, chưa phải bản in đã giám định. Ngày 2026-10-12 file tại URL đã chấp nhận có SHA-256 `941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458`, 2202452 byte, 277 đối tượng trang. Catalog EMIC: NXB Thời đại, Hà Nội, 2012, 427 trang, chưa đọc chữ. Hai vật không gộp. | `conflicting_secondary` |
| `nguyen-phat-loc-ham-so` | Ngày 2026-10-12 URL cũ là trang *Tân Biên*. URL hiện tại là trang giới thiệu *Tử Vi Hàm Số*. Không phải file sách. | `secondary` |
| `nguyen-phat-loc-tong-hop` | Trang bán ghi Nguyễn Phát Lộc, 686 trang. Không năm, không nhà in trên phần đã đọc. | `secondary` |
| `thien-luong-nghiem-ly` | Ngày 2026-10-12 URL cũ là *Tử Vi Lập Thành Và Phú Đoán*. URL đã gỡ. Trang *Nghiệm Lý Toàn Thư* là một sách khác, không gắn vào mục này. | `unverified_attribution` |
| `trung-chau-wang-tingzhi` | Bài mô tả phái của Vương Đình Chi, không phải một sách. | `secondary` |

*Tử Vi Đẩu Số Tân Biên* không phải sách của Nguyễn Phát Lộc. Hai tên này bị trang tìm kiếm gộp; sổ này tách ra.

Phái Tứ Hóa / Phi tinh không có sách riêng trong sổ. `TU_VI_SCHOOL_VARIANTS.md` ghi chúng ngoài phạm vi engine.

## Website đã được repo dẫn từ P0

Các URL này là giáo trình web, dùng cho an sao, không dùng để chứng một cách cục.

| sourceId | URL |
|---|---|
| `kabala-an-sao` | https://hoc.kabala.vn/chuong-4-an-sao-la-so-tu-vi-phan-2/ |
| `hocvienlyso-chi-nam` | https://hocvienlyso.org/tu-hoc-tu-vi-sao-theo-chi-nam-sinh.html |
| `tuvisonkhiem-pha-toai` | https://tuvisonkhiem.vn/thu-vien/sao/pha-toai/ |
| `xemsomenh-an-sao` | https://xemsomenh.com/an-sao-tu-vi |

## Nội bộ

`project-combinations-json`: `formula_text` của 63 cách. Đây là nguồn của câu trong repo, không phải nguồn lịch sử.

## Tham chiếu đoạn (chưa có)

Schema đoạn hỗ trợ `chapter`, `section`, `page`, `location`, `passageReference`, `supportsClaimId`, `supportType`, `verificationStatus`. Mọi passage trong pha này bỏ trống. Không tạo file passage giả.

Bản quyền: sổ chỉ giữ tên, URL, và ghi chú đối soát. Không chép sách.
