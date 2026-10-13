# Báo cáo coverage và kiểm thử Thần Số Học

Ngày chạy: 2026-10-13. HEAD lúc chạy: `e4f06aacc5803224054bcea4d72dc46b81a49902`. Các lệnh chạy từ checkout này. Số liệu cũ trong `IMPLEMENTATION_STATUS.md` (79.97% lines, 20 test frontend, 28 E2E) là snapshot trước, không dùng lại làm kết quả đợt này.

## Lệnh đã chạy và kết quả

| Lệnh | Kết quả |
|---|---|
| `npm run test:ci --prefix backend` | Đạt. Floor toàn backend: 82.6% lines, 87.41% branches. |
| `npm run test:ci --prefix frontend` | Đạt. 5 file, 42 test. |
| `npm run lint --prefix frontend` | Đạt. |
| `npm run build --prefix frontend` | Đạt. Vite build xong. |
| `npx playwright test e2e/numerology.spec.js` trong `frontend`, config `playwright.config.js` | 17/17 đạt. |

Chưa chạy `npm run test:e2e` toàn bộ trong đợt này. Vì vậy không tuyên bố các spec Tử Vi đang xanh.

## Coverage module Thần số

Backend, thư mục `backend/src/numerology` và route của nó:

| File | Lines | Branches | Dòng nhánh chưa phủ |
|---|---|---|---|
| Cả thư mục numerology | 100% | 98.44% | |
| `birthGrid.js`, `calculate.js`, `content.js`, `cycles.js`, `reduction.js` | 100% | 100% | |
| `input.js` | 100% | 97.43% | 51, 61 |
| `pinnacles.js` | 100% | 96.87% | 72 |
| `profile.js` | 100% | 66.66% | 21 |
| `numerologyRoutes.js` | 100% | 95.34% | 44, 62 |

Frontend `src/numerology`: 100% lines, 93.10% branches, 100% functions. Nhánh chưa phủ nằm ở `CalculationTrace.jsx` 4, `MetricMeaning.jsx` 2, `NumerologyAdvanced.jsx` 40, `NumerologyPage.jsx` 33, 69, 73, 93, 96, và `api.js` 37–39, 79, 84–85, 89.

Mục tiêu đặt ra cho mã thần số là ≥95% lines và ≥90% branches. Cả backend và frontend của module đều đạt mức đó trong lần chạy này.

## Coverage toàn repository, tách riêng

| Phạm vi | Lines | Branches |
|---|---|---|
| Backend, mọi file mà c8 đo | 82.6% | 87.41% |
| Frontend, mọi file mà v8 đo | 55.18% | 82.49% |
| Chỉ module thần số backend | 100% | 98.44% |
| Chỉ module thần số frontend | 100% | 93.10% |

Coverage toàn frontend thấp vì `App.jsx`, `Pages.jsx`, `TuViChart.jsx` và một số panel lá số không được vitest import. Điều đó không hạ coverage của thư mục thần số.

## Nhánh còn trống không phải lỗ hổng số học

- `input.js:51`: tên chuẩn hóa dài hơn 100 chữ sau khi chuỗi gốc đã bị chặn ở 100 ký tự. Nhánh phòng thủ, khó kích hoạt bằng input hợp lệ.
- `input.js:61`: một phía của nhánh trường lạ so với trường kết quả client. API test đã có `CLIENT_RESULT_REJECTED`.
- `pinnacles.js:72`: ném lỗi nếu không đúng một kỳ active. Các cửa sổ tuổi liền nhau nên nhánh này không có input hợp lệ.
- `profile.js:21`: nhánh `contentVersion` rỗng. Catalog hiện có version nên nhánh “withheld vì chưa có content” không đi qua `publicProfile()` trong bộ test này.
- `numerologyRoutes.js:44` và `62`: response đã gửi, và các tổ hợp lỗi giải nén. Không làm đổi phép tính.

Các cạnh số đã có fixture tay: bảy chỉ số, master 11/22/33, ngày 11/09/2000 ra Đường đời 4 chứ không ra 22, Unicode và Đ, Y, tên thiếu nguyên âm hoặc phụ âm, năm 1900/2000 và tuổi 29/02, thử thách 0, biên tuổi đỉnh, chu kỳ theo năm lịch, catalog hỏng, lệch profile, input API và no-store. Fixture kỳ vọng nằm trong JSON, không được engine sinh ra.

## Chưa phủ bằng một test riêng

- Chưa có test nào gắn nhãn “kết quả này khác trang Decoz”. Hành vi thì đã khóa: `method-divergence` và `components-do-not-keep-masters`.
- Chưa chạy lại E2E Tử Vi trong đợt audit.
- Chưa có test in, `lang`, hay meta robots, vì các thứ đó chưa được sửa.
