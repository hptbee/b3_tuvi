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


## Hồ sơ riêng có thiên can Đại hạn

Lựa chọn `iztro-pinned-menh-cuc-decadal-stem` dùng cùng giới hạn tuổi/chặng/cung của hồ sơ chỉ chi và bổ sung thiên can đã được xét riêng trên nguồn iztro đã ghim. Trong danh sách **Hồ sơ Đại hạn**, chọn mục can và chi rồi nhập tuổi mụ và áp dụng. Hồ sơ cũ giữ nguyên kết quả; ứng dụng không tự đổi lựa chọn cũ sang hồ sơ có can.

API vẫn chỉ nhận đúng hai khóa `profile` và `nominalAge`; không nhận can, năm hoặc cung do client cung cấp. Chỉ hồ sơ mới thêm `heavenlyStem` và `stemPlacement`. Khi đúng cung đã ánh xạ: can là một trong Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý và `stemPlacement: supported`. Mọi kết quả mới bị chặn hoặc trước/sau bảng tuổi đều có `heavenlyStem: null`, `stemPlacement: not_applied`. Hồ sơ cũ và yêu cầu không chọn hồ sơ không có hai trường này.

Phép chiếu dùng can năm âm lịch đã được server tính và kiểm tra tính nhất quán, không lấy năm dương lịch nhập vào hoặc năm xem. Ngũ Hổ cho can đầu tại Dần, rồi cộng **chỉ số cung đích tính từ Dần** theo vòng 12 cung trước khi lấy modulo 10 can. Số chặng Đại hạn không thay được chỉ số cung này; khi đi qua Sửu → Dần phải tính lại vị trí, không cộng tiếp can của chặng trước. Chiều thuận/nghịch quyết định cung đích; không đảo chiều can thêm lần nữa.

Kết quả có `calendarCompatibility: server_natal_menh_cuc_stem_branch_sex_age_projection_not_full_iztro_astrolabe`. Hồ sơ mới cần cả chứng cứ duyệt chi/tuổi cũ và [quyết định thiên can riêng](../knowledge/research/fortune/modern-decadal-stem/decision.json). Thiếu chứng cứ mới trả `blocked` với `modern_stem_profile_not_approved`; hồ sơ chỉ chi cũ vẫn độc lập. Hai mô hình đã kiểm tra nguồn, 24 lá số/288 chặng và 120 phép chiếu can hữu hạn; fixture là đối chiếu thuật toán theo nguồn, không phải golden được chuyên gia hoặc kết quả đời thực xác minh.

Phạm vi này không duyệt lịch upstream, tùy chọn `from`, tự suy tuổi, sao Đại hạn, Tứ Hóa, lời luận hoặc public release. `publicFortune: false`, `interpretation: null` và các quyết định Toàn Thư cổ điển giữ nguyên. [Bằng chứng và cách chạy lại](../knowledge/research/fortune/modern-decadal-stem/STATUS.md) giữ nguyên đầu vào đóng băng, model output thực tế và giới hạn.


## Hồ sơ riêng: liên kết Tứ Hóa Đại hạn với sao nguyên cục

Lựa chọn `iztro-pinned-menh-cuc-decadal-mutagen` giữ cùng phép chiếu tuổi, chi và can đã duyệt, rồi đối chiếu bảng Tứ Hóa **mặc định của iztro tại commit đã ghim**. Đây là hồ sơ có quyết định riêng; hai hồ sơ chỉ chi/can–chi cũ không tự được thêm Tứ Hóa. Chọn mục Tứ Hóa trong cùng danh sách Hồ sơ Đại hạn rồi nhập tuổi mụ và áp dụng. Không nhận bảng tự định nghĩa, can hoặc cung do client gửi.

Bốn dòng kết quả theo thứ tự **Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ** cho biết sao nguồn và cung nguyên cục đang chứa sao đó. Can dùng để chọn bảng là **can của chặng Đại hạn đã chọn**, không phải can năm sinh hay năm xem. Bảng ghim cho Mậu/Khoa là Hữu Bật, Nhâm/Khoa là Tả Phù; không tự thay biến thể khác. Các dòng chỉ là liên kết theo nguồn truyền thống, không phải nhận định cát/hung hoặc kết quả đời người.

Phần mềm không thêm hoặc di chuyển sao natal và không đổi tên/chức năng cung theo vòng Đại hạn. Nếu hai sao nguồn cùng cung, cả hai dòng vẫn được giữ; luôn đủ bốn liên kết khi hợp lệ. Thiếu/trùng hoặc mâu thuẫn danh tính/vị trí của sao nguồn khiến toàn bộ hồ sơ mới bị chặn, không chọn lần xuất hiện đầu tiên hoặc giữ kết quả một phần. Đây là guard nhất quán của B3, không phải khẳng định nguồn upstream bảo đảm tính duy nhất.

API vẫn dùng đúng hai khóa `majorPeriod.profile` và `majorPeriod.nominalAge`, tuổi nguyên 1–125. Chỉ hồ sơ mới có `mutagenScope: natal_physical_palaces`, `mutagenPlacement: supported` và mảng `mutagens` gồm đúng bốn dòng. Một phần tử có bảy trường:

```json
{
  "mutagenId": "hoa_loc",
  "mutagenLabel": "Hóa Lộc",
  "sourceStarId": "liem_trinh",
  "sourceStarName": "Liêm Trinh",
  "palaceId": "3",
  "functionId": "menh",
  "functionLabel": "MỆNH"
}
```

Đối tượng trên chỉ minh họa cấu trúc một dòng, không phải fixture lá số hay kết quả mẫu cho ngày sinh cụ thể. `calendarCompatibility` của hồ sơ là `server_natal_menh_cuc_stem_branch_sex_age_and_default_mutagen_projection_not_full_iztro_astrolabe`. Mọi trạng thái đóng mới có `mutagens: []`, `mutagenPlacement: not_applied` và không giữ can/chi/cung một phần. Thiếu chứng cứ mới trả `modern_mutagen_profile_not_approved`; hai hồ sơ cũ vẫn độc lập.

[Quyết định riêng](../knowledge/research/fortune/modern-decadal-mutagen/decision.json) dựa trên đầy đủ luồng can chặng → bảng mặc định → membership sao nguyên cục, bao gồm giới hạn cấu hình và snapshot của upstream. Hai mô hình độc lập kiểm tra 29 payload ghim, 40 ô bảng, 15 danh tính sao và fixture 24 lá số/288 chặng/1.152 liên kết; vị trí sao B3 trong fixture là quan sát regression, không phải công thức natal mới được xác thực. Xem [bằng chứng và cách chạy lại](../knowledge/research/fortune/modern-decadal-mutagen/STATUS.md).

Không duyệt bảng custom, năm/tháng/ngày/giờ, phi hóa dây chuyền, sao lưu động, lời luận hoặc public release. Capability Toàn Thư `tu_hoa_han`, các công thức natal, hồ sơ mặc định, danh tính nguồn và mọi cổng phát hành giữ nguyên.
