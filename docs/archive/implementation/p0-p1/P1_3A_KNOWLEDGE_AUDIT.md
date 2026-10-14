# P1.3A — Kiểm kê tri thức và nguồn

Ngày: 2026-10-12. HEAD: `2ead661`. Không đổi engine, API, hay schema SQLite. `package-lock.json` và `frontend/package-lock.json` vẫn dirty từ trước, không đụng.

## Kiểm kê

| Nhóm | Số bản ghi | Chỗ | Logic chạy được? | Nguồn thư tịch trong repo |
|---|---|---|---|---|
| Cách cục | 63 | `backend/src/data/combinations.json` | 58 có rule v2; 1 matcher cũ; 4 tắt | Không |
| Rule v2 | 58 | `backend/src/data/rulesV2.json` | Có, test nội bộ | Không |
| Ý nghĩa sao (seed migrate) | 19 | `backend/src/scripts/migrate.js` | Không, chỉ chữ | Không |
| Ý nghĩa cung | 13 | cùng script, gồm Thân | Không | Không |
| Bảng miếu/vượng/đắc/hãm | 22 khóa | `backend/src/data/starStatus.json` | Có, `getStarStatus` | `DOMAIN_KNOWLEDGE.md` nói “theo Toàn Thư” nhưng không có ấn bản, chương, trang |
| An sao / Tứ Hóa / Lộc | bảng JSON + `tuviRules.mjs` | `placementReference.json`, `tuHoaMap.json`, `locMap.json` | Có | URL thứ cấp trong `docs/tuvi/TU_VI_SCHOOL_VARIANTS.md` |
| Dị bản trường phái | 6 mục đã chốt P0, 8 mục còn mở | `schoolProfile.js`, `TU_VI_SCHOOL_VARIANTS.md` | Có, một giá trị mặc định | Website, không phải cổ thư |
| Lời luận cách cục | 63 description + interpretations | trong `combinations.json` | Không | Không |

`matching_ok` vẫn nghĩa là công thức vị trí đã viết được trong DSL. Không đổi thành “đã đối chiếu sách”.

Chín lời luận có chữ bệnh, cha mẹ, tai nạn, chết hoặc cùng kiểu, cần rà trước khi đưa vào knowledge base: Linh Xương Đà Vũ, Phong Lưu Thái Trượng, Nhật Nguyệt Tàng Huy, Mệnh Vô Chính Diệu, Kình Dương Nhập Miếu, Nhật Nguyệt Tật Ách, Cự Phùng Tứ Sát, Lộ Bàng Mai Thi, Lưỡng Trùng Thiên Mã. Disclaimer hung cách đã có từ P0. Chưa sửa câu chữ trong pha này.

## Nguồn đã nhận diện

Registry: `docs/knowledge/sources.json`. 12 mục.

- Thư mục đã kiểm trên một ấn bản cầm tay hoặc catalog thư viện: **0**.
- Gán trực tiếp một đoạn sách cho một cách trong 63 cách: **0**.
- Thứ cấp (website, trang bán sách): Kabala, Học viện lý số, Sơn Khiêm, Xem số mệnh, và vài trang mô tả sách.
- Gán chưa kiểm: Trần Đoàn / La Hồng Tiên, Nguyễn Phát Lộc *Tử Vi Hàm Số*, Thiên Lương *Tử Vi Nghiệm Lý*.
- Mâu thuẫn giữa các trang thứ cấp: năm và nhà in của bản Vũ Tài Lục; nơi in *Tân Biên* (Sài Gòn 1956 theo Sơn Khiêm, Hà Nội / NXB Văn Học theo một trang khác).

Độ phổ biến của một tên sách không được tính là đã kiểm.

## Sáu mươi ba cách

Ma trận đủ cột nằm ở `docs/knowledge/combination-source-matrix.json` và được tóm trong `docs/tuvi/COMBINATION_SOURCE_MATRIX.md`.

Mọi dòng: `sources` rỗng, `formulaCheckedAgainstSource` false, `interpretationSourced` false. Test `backend/test/knowledgeCatalog.test.mjs` khóa các cờ này.

## Pilot cho P1.3B

**0 cách** đủ điều kiện nạp thành claim đã dẫn nguồn.

Ứng viên để đối chiếu khi có một ấn bản, chưa phải claim: Tử Phủ Đồng Cung, Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Nhật Nguyệt Tàng Huy. Chúng đã có test phần mềm. Chưa có trang sách.

## Kết luận

**NOT READY FOR P1.3B**

P1.3B nếu bắt đầu bây giờ chỉ tạo bảng rỗng hoặc nạp chữ không nguồn. Việc nhỏ nhất trước khi code schema:

1. Chọn một ấn bản nhìn thấy bìa. Ưu tiên *Tử Vi Đẩu Số Tân Biên* (Thái Thứ Lang) hoặc bản Vũ Tài Lục, ghi nhà in và năm đúng như bìa.
2. Với 10 cách đã có rule v2, ghi chương hoặc trang của ấn bản đó nếu câu có trong sách. Không có thì ghi “không thấy”, không suy từ web.
3. Tách câu luận tuyệt đối (chín mục ở trên) khỏi phần công thức vị trí.
4. Sau bước 2 mới thêm schema SQLite version 2.
