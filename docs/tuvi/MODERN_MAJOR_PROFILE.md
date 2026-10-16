# Đại hạn: biến thể hiện đại với tuổi mụ nhập trực tiếp

Hồ sơ tùy chọn `iztro-pinned-menh-cuc-decadal` đối chiếu vị trí Đại hạn theo mã nguồn iztro đã ghim, trên Mệnh, Cục và chi năm sinh của lá số B3. Đây là một phép chiếu có phạm vi riêng; không xác nhận toàn bộ lịch hoặc cách lập lá số của iztro. Luận vận hạn và dự báo công khai vẫn khóa.

Trong bảng chứng cứ của lá số, chọn hồ sơ Đại hạn, nhập tuổi mụ từ 1 đến 125 rồi áp dụng. Tuổi này do người dùng cung cấp; ứng dụng không suy từ ngày sinh, ngày hiện tại hoặc năm xem. Đại hạn và Tiểu hạn có lựa chọn tuổi riêng. Đổi dữ liệu sinh sẽ xóa cả hai lựa chọn.

## Phạm vi chính xác

- Chặng đầu ở **Mệnh**, bắt đầu tại tuổi bằng số Cục: Thủy 2, Mộc 3, Kim 4, Thổ 5, Hỏa 6.
- Nam với chi năm sinh dương, nữ với chi năm sinh âm đi thuận; hai trường hợp còn lại đi nghịch. Nguồn dùng âm/dương của **chi năm sinh**. Can và chi của một năm can-chi hợp lệ có cùng tính âm/dương; sự trùng khớp đó không cho phép dùng metadata mâu thuẫn.
- Mỗi chặng có mười tuổi, kể cả hai đầu: Cục đến Cục+9, tiếp theo Cục+10 đến Cục+19. Chỉ có **12 chặng**, kết thúc tại Cục+119: lần lượt tuổi 121, 122, 123, 124 hoặc 125.
- Vị trí cung quay qua vòng 12 chi; tuổi không quay về chặng đầu sau chặng thứ mười hai.
- Tuổi nhỏ hơn Cục hoặc lớn hơn Cục+119 vẫn có thể là đầu vào hợp lệ trong khoảng 1–125, nhưng **không có vị trí Đại hạn** trong bảng nguồn này. Không áp dụng đoạn Đồng hạn của chức năng truy vấn đầy đủ ở upstream.

## API

`POST /api/interpretations/analyze` nhận các trường sinh hiện có và thêm tùy chọn:

```json
{
  "day": 15,
  "month": 6,
  "year": 1990,
  "hour": 8,
  "gender": 1,
  "majorPeriod": {
    "profile": "iztro-pinned-menh-cuc-decadal",
    "nominalAge": 32
  }
}
```

Đối tượng có đúng hai khóa `profile` và `nominalAge`. Tuổi phải là số nguyên 1–125, không ép chuỗi thành số. Hồ sơ lạ, null, mảng, tuổi thiếu/sai/ngoài khoảng hoặc khóa thừa trả HTTP 400 `invalid_major_period`. `/ask` dùng chung bộ phân tích và giữ wrapper lỗi `analysis_failed` hiện có. Có thể gửi `majorPeriod`, `minorPeriod` và `viewYearBranch` trong cùng yêu cầu; chúng không suy tuổi của nhau.

Kết quả thêm tại `time.capabilities.dai_han_modern`. Khi có vị trí, kết quả gồm hồ sơ, nguồn/pin, tuổi đã nhập, chi, cung/chức năng được ánh xạ trên lá số thật, `decadeIndex` từ 0 đến 11 và `decadeStartAge`/`decadeEndAge` gồm cả hai đầu. `ageInput: caller_supplied`, `ageDerivation: not_applied`, `calendarCompatibility: server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe`, `publicFortune: false`, `interpretation: null` giữ nguyên giới hạn.

Không chọn hồ sơ: `not_applied`. Tuổi trước/sau bảng: `not_applied` với `before_first_period`/`after_last_period`, các trường vị trí và chặng đều null. Thiếu hoặc sai chứng cứ duyệt: `blocked`; metadata lá số không hợp lệ cũng không được an vị trí. Giao diện kiểm tra danh tính nguồn, tuổi, khoảng chặng và cung tương ứng trước khi hiển thị. Không lưu lựa chọn hoặc dữ liệu cá nhân vào lịch sử.

## Đối chiếu với các hồ sơ đang có

| Đối tượng | Kết luận có phạm vi |
| --- | --- |
| iztro hiện đại đã ghim | Bắt đầu tại Mệnh, tuổi Cục, 12 chặng mười tuổi; chỉ phép chiếu được chọn rõ ở trên |
| Nhãn Đại hạn natal B3 | 336 mốc tuổi trên 28 lá số độc lập khớp cấu trúc hiện đại; nhãn và công thức gốc không thay đổi, không tự được chứng nhận nguồn cổ |
| Đoạn Quanshu Juan2 đã lưu | Ghi khởi ở Phụ Mẫu/Huynh Đệ liền kề; quyết định thiếu tham số tuổi/tiến trình vẫn giữ nguyên, không dùng nguồn hiện đại để lấp chỗ thiếu |

Upstream có cấu hình ranh giới năm/ngày/tuổi và tùy chọn `from`; cách xử lý tháng nhuận cũng khác B3 tại ngày 15 và giờ Tí muộn. Chúng không thuộc phép chiếu này. Đặc biệt, quy tắc tuổi theo sinh nhật của upstream tăng tuổi khi **qua** ngày sinh âm lịch, không phải đúng ngày bằng nhau. Ứng dụng không chọn hộ một quy ước chuyển ngày thành tuổi.

[Hồ sơ nguồn và quyết định](../knowledge/research/fortune/modern-decadal/REPRODUCING.md) giữ nguyên các đoạn đầy đủ, phụ thuộc, 39 artifact đã ghim, fixture thật, hai đánh giá độc lập và quyết định so sánh của B3. Đây là đối chiếu cấu trúc phần mềm với nguồn hiện đại, không phải golden được chuyên gia ký, xác thực bản cổ hoặc bằng chứng khoa học về kết quả đời người. Không duyệt can/sao/Tứ Hóa Đại hạn, Đồng hạn, lời luận hay phát hành production.
