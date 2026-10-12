/**
 * Hồ sơ trường phái mặc định của engine.
 * Các khóa là điểm dị bản đã xác nhận trong kiểm toán P0 — không trộn quy tắc mâu thuẫn.
 * Chi tiết nguồn: docs/TU_VI_SCHOOL_VARIANTS.md
 */
export const DEFAULT_SCHOOL = {
    id: 'vn-tam-hop-default',
    label: 'Tử Vi Tam Hợp (quy ước Việt Nam — mặc định engine)',
    // Chủ Mệnh: tra theo chi năm sinh (Toàn Tập / Sơn Khiêm). Dị bản: chi cung Mệnh.
    chuMenhBy: 'yearChi',
    // Chủ Thân năm Ngọ: Linh Tinh (không dùng Hỏa Tinh). Không phải dị bản.
    chuThanNgo: 'Linh Tinh',
    // Thiên Đức / Nguyệt Đức an theo chi năm, không theo tháng.
    ducBy: 'yearChi',
    // Phá Toái theo Tứ Chính / Tứ Sinh / Tứ Mộ.
    phaToaiBy: 'tuChinhSinhMo',
    // Đường Phù: từ Lộc Tồn đếm nghịch đến cung thứ 8.
    duongPhuBy: 'locTonReverse8',
    // Văn Tinh: bảng can phổ biến. Can Nhâm lấy Dần (dị bản Dậu ghi trong docs).
    vanTinhNham: 'dan',
    // Tháng nhuận: trước ngày 15 giữ tháng, từ 15 tính tháng sau.
    leapMonth: 'day15',
    // Giờ 23h–0h: canh Tí, giữ ngày dương đã nhập (Tý muộn chưa đổi ngày).
    tyHour: 'keepSolarDate',
    // Thiên Thương / Thiên Sứ: cố định Nô Bộc / Tật Ách (không đổi chỗ Âm nam Dương nữ).
    thienThuongSwap: false
};

export function resolveSchool(profile) {
    return { ...DEFAULT_SCHOOL, ...(profile || {}) };
}
