# Model domain lá số

`palaceId` là chỉ số địa chi dạng chuỗi `"1"` … `"12"` (Tí … Hợi). Đó không phải mã cung chức. Cung Mệnh đổi chỗ theo tháng và giờ; địa chi của ô thì cố định.

## Chart

| Trường | Ý nghĩa |
|---|---|
| `version` | `1` |
| `schoolId` | Hồ sơ trường phái từ `calculateTuVi`, hoặc `null` |
| `input` | Dương lịch và giới tính nếu caller truyền vào. Thiếu thì `null` |
| `lunar` | Ngày âm, can chi, cờ nhuận. Thiếu thì `null` |
| `menhPalaceId`, `thanPalaceId` | Id địa chi của Mệnh và Thân |
| `cuc.name`, `cuc.number` | Tên cục từ engine. Số cục chỉ khi tên khớp `CUC_SO_MAP` |
| `banMenh`, `amDuong`, `thuanLy`, `cucKhacMenh`, `chuMenh`, `chuThan`, `anSaoMonth` | Giữ nguyên từ `tuviInfo` |
| `palaces` | Đúng 12 cung |
| `byStarId` | Index `starId` → các lần xuất hiện |
| `unknownStars` | Sao không có trong catalog. Không bị xóa |

## Palace

| Trường | Ý nghĩa |
|---|---|
| `id`, `branchId`, `branchName` | Định danh và địa chi |
| `functionId`, `functionLabel` | Cung chức (`menh`, `quan_loc`, …). `THÂN` không phải functionId |
| `isMenh`, `isThan` | Cờ riêng. Một cung có thể vừa Mệnh vừa Thân |
| `daiHan`, `trangSinh`, `isTuan`, `isTriet`, `fullCanChi`, `thang` | Metadata engine giữ nguyên |
| `stars` | `StarInstance[]` |

## StarInstance

Tên hiển thị, ID và độ sáng là các trường riêng.

| Trường | Ý nghĩa |
|---|---|
| `starId` | ID catalog, hoặc `null` nếu chưa biết |
| `canonicalName` | Tên Việt không kèm `(M)` |
| `displayName` | Chuỗi gốc trong `tuviInfo` |
| `brightness` | `M` `V` `Đ` `B` `H`, hoặc `null` |
| `brightnessStatus` | `known`, `none`, `unparsed` |
| `category` | `chinh_tinh`, `tu_hoa`, `phu_tinh`, `marker`, `unknown` |
| `element`, `elementStatus` | Chỉ sao có `element` trong seed `migrate.js`. Còn lại `unknown` |
| `list` | `major`, `good`, `bad`, `minor` |
| `association` | Với Tứ Hóa: `{ type: 'tu_hoa', sourceStarId, sourceName, status }`. Hai sao vẫn là hai instance |

`status` của association là `same_palace` khi sao gốc đứng cùng cung, `unresolved` khi không thấy sao gốc. Cần `lunar.canIndex` để tra `tuHoaMap`. Không có can thì `association` là `null`.

## Chuẩn hóa tên

- Bỏ hậu tố `(M|V|Đ|B|H)` bằng `cleanStarName`.
- Alias đã khai: `Hỏa tinh` → `Hỏa Tinh`, `Linh tinh` → `Linh Tinh`.
- `Quan Phù` và `Quan Phủ` khác ID. Slug bỏ dấu bị trùng thì thêm mã Unicode của ký tự ngoài ASCII.
- Sao engine có nhưng chưa có màu UI: `Thiên Trù` (`thien_tru`). Không thêm vào `STAR_COLORS` để không đổi màu đang vẽ.
- Tên lạ giữ `status: 'unknown'`, vẫn nằm trong cung.

Ngũ hành Tham Lang trong seed là `Mộc`. Câu mô tả seed còn nhắc Thủy. Model chỉ lấy trường `element` đã ghi, không chọn thêm dị bản.
