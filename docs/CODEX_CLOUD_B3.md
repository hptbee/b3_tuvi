# Sử dụng B3 trên Codex cloud

## Vì sao `$autodev` và các command skill chưa gọi được?

Có ba lớp riêng:

1. **File hướng dẫn:** skill, command và workflow trong repository B3.
2. **Cài đặt filesystem:** dependency B3, đường dẫn Linux và symlink `.agents/skills`.
3. **Catalog của host:** các skill mà giao diện/runtime Codex cloud thực sự cung cấp.

Bootstrap đã sửa lớp 2; nó không có quyền đăng ký lớp 3. Trong phiên cloud đã
kiểm tra, `skills.list` cho cloud chỉ trả onboarding plugin; executor không trả
skill nào. Cả bảy command skill B3 vẫn đọc được trên máy. Các công cụ hiện có
không cung cấp thao tác đăng ký B3 vào catalog đó.

Vì vậy không dùng “clone thành công”, “symlink tồn tại”, hoặc “đã Publish” để
khẳng định `$autodev` đã hoạt động trong picker. Khả năng discovery của Codex
CLI/IDE không tự chứng minh khả năng tương tự ở cloud. Hướng dẫn trước đây gợi
ý đổi cách gõ hoặc mở task mới là chưa đủ căn cứ cho vấn đề này.

## Cách gọi ở cloud

Gửi **tin nhắn thường**, không cần chọn skill trong menu:

| Tin nhắn | Hành động |
|---|---|
| `B3: autodev status` | Đọc checkpoint và Git, báo trạng thái; không triển khai |
| `B3: autodev resume` | Đối chiếu trạng thái đang có và tiếp tục |
| `B3: autodev <yêu cầu>` | Chạy lifecycle cho yêu cầu đó |
| `B3: autodev <đường dẫn plan đã chấp nhận>` | Kiểm tra plan rồi thực thi theo workflow |
| `B3: plan <yêu cầu>` | Lập kế hoạch, không tự viết code sản phẩm |
| `B3: implement <plan hoặc thay đổi>` | Thực thi phạm vi chỉ định |
| `B3: debug <lỗi>` | Điều tra nguyên nhân trước khi sửa |
| `B3: review <diff/target>` | Một lượt review có chứng cứ |
| `B3: verify <khẳng định>` | Chạy kiểm tra và báo PASS/FAIL/INCOMPLETE |
| `B3: review-loop <target>` | Theo thủ tục review/fix độc lập |

Ví dụ để kiểm tra trước khi chạy một task dài:

```text
Đọc AGENTS.md. B3: autodev status.
```

Ví dụ lập kế hoạch Thần Số Học:

```text
B3: plan triển khai NUM-001 đến NUM-005 theo
 docs/ROADMAP_NUMEROLOGY_A_TO_Z.md.
```

Lập kế hoạch không có nghĩa công thức/nguồn đã được duyệt. Khi triển khai,
các giới hạn domain và gate trong tài liệu sản phẩm vẫn áp dụng.

## Agent phải làm gì?

Root `AGENTS.md` là bộ định tuyến. Khi nhận yêu cầu B3, agent resolve nguồn,
đọc skill/command/workflow tương ứng và thực hiện hành động; không trả một bản
hướng dẫn dùng lệnh rồi dừng. Nếu task chưa nạp hướng dẫn repository, người dùng
có thể ghi rõ “Đọc AGENTS.md” như ví dụ trên.

Từ thư mục gốc sản phẩm:

```bash
bash scripts/setup-b3-cloud.sh
bash scripts/b3-paths.sh autodev
```

Helper thứ hai in `B3_HOME`, `SKILL`, `COMMAND` và `WORKFLOW` ở đường dẫn thật.
Nó **chỉ resolve đường dẫn**, không phải một chương trình AI chạy autodev.
Agent đọc các file được chỉ ra bằng công cụ filesystem, không phụ thuộc
`skills.read` chỉ nhận package có trong catalog.

Với canonical instructions, coi đường dẫn resolved là B3_HOME. Khi chạy shell
cần B3, export trong chính command đó:

```bash
export B3_HOME="$(cat .b3/cloud-home)"
bash scripts/b3-paths.sh review-loop
```

Skill bodies vẫn nằm ở B3, không copy vào sản phẩm, không sửa qua symlink.
Không tạo workflow thay thế để giả lập autodev. Status chỉ đọc checkpoint/Git;
nếu chưa có run, báo chưa có checkpoint, không tự chọn backlog để triển khai.

## Môi trường và giới hạn

- Installation script chuẩn bị dependency/file/link; startup instructions nhắc
  cách resolve nguồn và định tuyến prompt. Cả hai không đăng ký native skill.
- Lưu/Publish môi trường dùng để giữ cấu hình và filesystem cho task sau;
  đây là việc khác với discovery trong catalog.
- Muốn picker hiển thị `$autodev`, cần cơ chế tích hợp skill/plugin được chính
  host cloud hỗ trợ. Phiên này chưa có cơ chế đăng ký B3 đó; không hướng dẫn
  người dùng cài một plugin không tồn tại hoặc cam kết UI sẽ nhận sau restart.
- `review-loop` dùng agent cách ly khi công cụ/quy trình cho phép; nếu không,
  báo giới hạn theo B3, không gọi review của chính tác giả là review độc lập.

## Kiểm tra

```bash
bash scripts/setup-b3-cloud.sh --verify
bash scripts/test-b3-cloud.sh
for action in autodev plan implement debug review verify review-loop; do
  bash scripts/b3-paths.sh "$action"
done
```

Các kiểm tra này xác nhận cài đặt, bảo vệ file người dùng và nguồn hướng dẫn
cho từng action. Chúng không chứng minh lifecycle đã được thực thi, review đã
PASS, hoặc native catalog đã đăng ký B3.
