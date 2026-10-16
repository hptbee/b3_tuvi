// constants.js
export const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

// 1: Tí, ..., 12: Hợi
export const DIA_CHI = ["", "Tí", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

export const CUNG_CHUC = [
    "MỆNH", "PHỤ MẪU", "PHÚC ĐỨC", "ĐIỀN TRẠCH", "QUAN LỘC", "NÔ BỘC",
    "THIÊN DI", "TẬT ÁCH", "TÀI BẠCH", "TỬ TỨC", "PHU THÊ", "HUYNH ĐỆ"
];

// Ngũ hành của các sao để tô màu (Mộc: Green, Hỏa: Red, Thổ: Orange/Gold, Kim: Gray/White, Thủy: Black/Blue)
// Để phù hợp nền sáng của tuvivietnam, Thủy sẽ là Black, Kim là Gray, Mộc là Green, Hỏa là Đỏ, Thổ là Vàng Đất
export const NGU_HANH_COLORS = {
    MUC: "#2e7d32", // Xanh lá
    HOA: "#c62828", // Đỏ
    THO: "#ef6c00", // Vàng/Cam
    KIM: "#616161", // Xám
    THUY: "#000000" // Đen
};

// Định nghĩa màu cho từng sao 
export const STAR_COLORS = {
    // CHÍNH TINH
    "Tử Vi": NGU_HANH_COLORS.THO, "Thiên Phủ": NGU_HANH_COLORS.THO, "Thái Dương": NGU_HANH_COLORS.HOA,
    "Vũ Khúc": NGU_HANH_COLORS.KIM, "Thiên Đồng": NGU_HANH_COLORS.THUY, "Liêm Trinh": NGU_HANH_COLORS.HOA,
    "Thái Âm": NGU_HANH_COLORS.THUY, "Tham Lang": NGU_HANH_COLORS.THUY, "Cự Môn": NGU_HANH_COLORS.THUY,
    "Thiên Tướng": NGU_HANH_COLORS.THUY, "Thiên Cơ": NGU_HANH_COLORS.MUC, "Thiên Lương": NGU_HANH_COLORS.MUC,
    "Thất Sát": NGU_HANH_COLORS.KIM, "Phá Quân": NGU_HANH_COLORS.THUY,
    
    // TỨ HÓA
    "Hóa Khoa": NGU_HANH_COLORS.THUY, "Hóa Quyền": NGU_HANH_COLORS.MUC,
    "Hóa Lộc": NGU_HANH_COLORS.MUC, "Hóa Kỵ": NGU_HANH_COLORS.THUY,
    
    // LỤC SÁT TINH & LỤC BẠI TINH
    "Kình Dương": NGU_HANH_COLORS.KIM, "Đà La": NGU_HANH_COLORS.KIM,
    "Hỏa Tinh": NGU_HANH_COLORS.HOA, "Linh Tinh": NGU_HANH_COLORS.HOA,
    "Địa Không": NGU_HANH_COLORS.HOA, "Địa Kiếp": NGU_HANH_COLORS.HOA,
    "Thiên Không": NGU_HANH_COLORS.HOA, "Đại Hao": NGU_HANH_COLORS.HOA, "Tiểu Hao": NGU_HANH_COLORS.HOA,
    
    // THÁI TUẾ CÙNG VÒNG
    "Thái Tuế": NGU_HANH_COLORS.HOA, "Thiếu Dương": NGU_HANH_COLORS.HOA, "Tang Môn": NGU_HANH_COLORS.MUC,
    "Thiếu Âm": NGU_HANH_COLORS.THUY, "Quan Phù": NGU_HANH_COLORS.HOA, "Tử Phù": NGU_HANH_COLORS.KIM,
    "Tuế Phá": NGU_HANH_COLORS.HOA, "Long Đức": NGU_HANH_COLORS.THUY, "Bạch Hổ": NGU_HANH_COLORS.KIM,
    "Phúc Đức": NGU_HANH_COLORS.THO, "Điếu Khách": NGU_HANH_COLORS.HOA, "Trực Phù": NGU_HANH_COLORS.KIM,
    
    // LỘC TỒN CÙNG VÒNG
    "Lộc Tồn": NGU_HANH_COLORS.THO, "Bác Sĩ": NGU_HANH_COLORS.THUY, "Lực Sĩ": NGU_HANH_COLORS.HOA,
    "Thanh Long": NGU_HANH_COLORS.THUY, "Tướng Quân": NGU_HANH_COLORS.MUC, "Tấu Thư": NGU_HANH_COLORS.KIM,
    "Phi Liêm": NGU_HANH_COLORS.HOA, "Hỉ Thần": NGU_HANH_COLORS.HOA, "Bệnh Phù": NGU_HANH_COLORS.THO,
    "Phục Binh": NGU_HANH_COLORS.HOA, "Quan Phủ": NGU_HANH_COLORS.HOA,
    
    // CÁT TINH & PHỤ TINH CÒN LẠI
    "Thiên Khôi": NGU_HANH_COLORS.HOA, "Thiên Việt": NGU_HANH_COLORS.HOA,
    "Văn Xương": NGU_HANH_COLORS.KIM, "Văn Khúc": NGU_HANH_COLORS.THUY,
    "Tả Phù": NGU_HANH_COLORS.THO, "Hữu Bật": NGU_HANH_COLORS.THUY, // Hữu Bật often Thổ/Thủy, Tuvi map usually colors it Thủy
    "Đào Hoa": NGU_HANH_COLORS.MUC, "Hồng Loan": NGU_HANH_COLORS.THUY, "Thiên Hỷ": NGU_HANH_COLORS.THUY,
    "Thiên Diêu": NGU_HANH_COLORS.THUY, "Thiên Y": NGU_HANH_COLORS.THUY, "Thiên Hình": NGU_HANH_COLORS.HOA,
    "Thiên Khốc": NGU_HANH_COLORS.THUY, "Thiên Hư": NGU_HANH_COLORS.THUY,
    "Thiên Mã": NGU_HANH_COLORS.HOA, "Hoa Cái": NGU_HANH_COLORS.KIM,
    "Cô Thần": NGU_HANH_COLORS.THO, "Quả Tú": NGU_HANH_COLORS.THO,
    "Long Trì": NGU_HANH_COLORS.THUY, "Phượng Các": NGU_HANH_COLORS.THO, "Giải Thần": NGU_HANH_COLORS.MUC,
    "Tam Thai": NGU_HANH_COLORS.THUY, "Bát Tọa": NGU_HANH_COLORS.MUC,
    "Ân Quang": NGU_HANH_COLORS.MUC, "Thiên Quý": NGU_HANH_COLORS.THO,
    "Thiên Tài": NGU_HANH_COLORS.THO, "Thiên Thọ": NGU_HANH_COLORS.THO,
    "Thiên Quan": NGU_HANH_COLORS.HOA, "Thiên Phúc": NGU_HANH_COLORS.THO,
    "Thiên La": NGU_HANH_COLORS.THO, "Địa Võng": NGU_HANH_COLORS.THO,
    "Lưu Hà": NGU_HANH_COLORS.THUY, "Kiếp Sát": NGU_HANH_COLORS.HOA, "Phá Toái": NGU_HANH_COLORS.HOA,
    "Thiên Sứ": NGU_HANH_COLORS.THUY, "Thiên Thương": NGU_HANH_COLORS.THUY, "Đẩu Quân": NGU_HANH_COLORS.HOA,
    "Địa Giải": NGU_HANH_COLORS.THO, "Thiên Giải": NGU_HANH_COLORS.THO,
    "Thai Phụ": NGU_HANH_COLORS.KIM, "Phong Cáo": NGU_HANH_COLORS.THO,
    "Quốc Ấn": NGU_HANH_COLORS.THO, "Đường Phù": NGU_HANH_COLORS.MUC,
    "Nguyệt Đức": NGU_HANH_COLORS.HOA, "Thiên Đức": NGU_HANH_COLORS.HOA,
    "Văn Tinh": NGU_HANH_COLORS.HOA,

    // ĐẶC BIỆT
    "Tuần": NGU_HANH_COLORS.HOA, "Triệt": NGU_HANH_COLORS.KIM
};

// Hàm lấy màu
export const getStarColor = (starName) => {
    // Xóa hậu tố Đắc, Hãm (H), (Đ) nếu có
    let cleanName = starName.replace(/\(.*?\)/g, '').trim();
    if (STAR_COLORS[cleanName]) return STAR_COLORS[cleanName];
    // Default màu đen xám cho các sao nhỏ
    return "#757575";
};

export const CUC_SO_MAP = {
    2: "Thủy nhị cục",
    3: "Mộc tam cục",
    4: "Kim tứ cục",
    5: "Thổ ngũ cục",
    6: "Hỏa lục cục"
};
