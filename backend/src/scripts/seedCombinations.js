/**
 * Seed script cho Collection: combinations
 * Toàn bộ 58 Cách Cục Tử Vi (Cát + Hung + Đặc biệt)
 * Chạy: node src/scripts/seedCombinations.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Combination from '../models/Combination.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/';

const combinations = [
  // =========================================================
  // CÁT CÁCH — Cách cục tốt
  // =========================================================
  {
    name: 'Tử Phủ Đồng Cung',
    type: 'cat_cach',
    description: 'Cách cục phú quý, uy quyền, cuộc đời thường êm đềm, được người trọng vọng.',
    logic_conditions: {
      required_stars: ['Tử Vi', 'Thiên Phủ'],
      positions: ['Đồng cung'],
      required_palaces: ['Dần', 'Thân'],
      formula_text: 'Mệnh tại Dần hoặc Thân có Tử Vi và Thiên Phủ đồng cung.'
    },
    interpretations: [
      { context: 'Mệnh tại Dần/Thân', content: 'Phú quý song toàn, uy quyền bẩm sinh, cuộc đời ít sóng gió, được người tôn trọng.', tags: ['phu_quy', 'uy_quyen'] },
      { context: 'Gặp Sát tinh', content: 'Phú quý vẫn giữ nhưng phải trải qua thử thách, thành công muộn hơn.', tags: ['thu_thach'] }
    ],
    tags: ['phu_quy', 'uy_quyen', 'em_dem', 'cat_cach']
  },
  {
    name: 'Tử Phủ Vũ Tướng',
    type: 'cat_cach',
    description: 'Mẫu người lãnh đạo, làm chủ, có uy quyền và tài sản lớn.',
    logic_conditions: {
      required_stars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'],
      positions: ['Tam hợp', 'Xung chiếu'],
      formula_text: 'Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng nằm tại các cung Mệnh, Tài, Quan hội chiếu.'
    },
    interpretations: [
      { context: 'Mệnh Tài Quan hội chiếu', content: 'Tứ trụ hội tụ, lãnh đạo xuất sắc, tài chính bền vững, quyền uy lâu dài.', tags: ['lanh_dao', 'tai_chinh'] }
    ],
    tags: ['lanh_dao', 'phu_quy', 'uy_quyen', 'cat_cach']
  },
  {
    name: 'Cơ Nguyệt Đồng Lương',
    type: 'cat_cach',
    description: 'Cách cục công danh, làm việc trong cơ quan nhà nước, tham mưu, ổn định.',
    logic_conditions: {
      required_stars: ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'],
      positions: ['Tam hợp', 'Xung chiếu'],
      formula_text: 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội chiếu tại Mệnh.'
    },
    interpretations: [
      { context: 'Cung Mệnh', content: 'Tính cách nhân hòa, mưu lược, đặc biệt thích hợp công chức, tham mưu, giáo dục, y tế.', tags: ['cong_danh', 'on_dinh'] },
      { context: 'Hội Lộc/Khoa', content: 'Thăng tiến đều đặn trong bộ máy nhà nước, nhiều quý nhân phù trợ.', tags: ['thang_tien'] }
    ],
    tags: ['cong_danh', 'on_dinh', 'muu_luoc', 'cat_cach']
  },
  {
    name: 'Sát Phá Tham',
    type: 'cat_cach',
    description: 'Cách cục võ tướng hoặc thương gia lớn, thích mạo hiểm, dũng mãnh, ưa biến động.',
    logic_conditions: {
      required_stars: ['Thất Sát', 'Phá Quân', 'Tham Lang'],
      positions: ['Tam hợp'],
      formula_text: 'Thất Sát, Phá Quân, Tham Lang luôn hội chiếu nhau tại Tam hợp Mệnh - Tài - Quan.'
    },
    interpretations: [
      { context: 'Mệnh tại Dần/Thân (Đắc địa)', content: 'Chí lớn, tài năng xuất chúng, lập nghiệp từ tay trắng, thành công vang dội.', tags: ['manh_me', 'thanh_cong'] },
      { context: 'Gặp Không Kiếp', content: 'Cách cục bị phá, thành bại thất thường, cuộc đời nhiều sóng gió biến động.', tags: ['song_gio', 'bien_dong'] }
    ],
    tags: ['manh_me', 'mao_hiem', 'bien_dong', 'thuong_gia', 'cat_cach']
  },
  {
    name: 'Nhật Nguyệt Tịnh Minh',
    type: 'cat_cach',
    description: 'Công danh rạng rỡ từ sớm, thông minh xuất chúng, giàu sang.',
    logic_conditions: {
      required_stars: ['Thái Dương', 'Thái Âm'],
      required_palaces: ['Sửu', 'Mùi'],
      formula_text: 'Mệnh tại Sửu/Mùi, Thái Dương ở Tỵ/Ngọ (sáng), Thái Âm ở Dậu/Tý (sáng) hội chiếu.'
    },
    interpretations: [
      { context: 'Mệnh tại Sửu/Mùi', content: 'Nhật Nguyệt đều sáng, công danh rực rỡ từ trẻ tuổi, thông minh thiên phú, giàu sang bền vững.', tags: ['cong_danh', 'thong_minh'] }
    ],
    tags: ['cong_danh', 'thong_minh', 'phu_quy', 'cat_cach']
  },
  {
    name: 'Minh Châu Xuất Hải',
    type: 'cat_cach',
    description: 'Ngọc sáng dưới biển, trước khó sau dễ, danh tiếng vang xa rực rỡ.',
    logic_conditions: {
      required_stars: ['Thái Âm', 'Thái Dương'],
      required_palaces: ['Mùi'],
      positions: ['Xung chiếu'],
      formula_text: 'Mệnh Vô chính diệu tại Mùi, có Thái Âm ở Hợi và Thái Dương ở Mão hội chiếu về.'
    },
    interpretations: [
      { context: 'Trước khó sau dễ', content: 'Thời trẻ gian nan, nhưng nhờ kiên trì và tài năng tiềm ẩn, hậu vận danh tiếng vang xa.', tags: ['truoc_kho', 'hau_van'] }
    ],
    tags: ['hau_van', 'danh_tieng', 'kien_tri', 'cat_cach']
  },
  {
    name: 'Cự Nhật Đồng Cung',
    type: 'cat_cach',
    description: 'Cách cục của doanh nhân, chính trị gia ngoại giao xuất sắc, hùng biện giỏi.',
    logic_conditions: {
      required_stars: ['Cự Môn', 'Thái Dương'],
      positions: ['Đồng cung'],
      required_palaces: ['Dần', 'Thân'],
      formula_text: 'Cự Môn và Thái Dương đồng cung tại Dần hoặc Thân.'
    },
    interpretations: [
      { context: 'Đắc địa tại Dần/Thân', content: 'Hùng biện xuất sắc, tài ngoại giao thiên phú, thích hợp chính trị, thương thảo quốc tế.', tags: ['ngoai_giao', 'hung_bien'] }
    ],
    tags: ['ngoai_giao', 'hung_bien', 'chinh_tri', 'doanh_nhan', 'cat_cach']
  },
  {
    name: 'Dương Lương Xương Lộc',
    type: 'cat_cach',
    description: 'Cách cục học giả, đỗ đạt cao, thi cử xuất chúng.',
    logic_conditions: {
      required_stars: ['Thái Dương', 'Thiên Lương', 'Văn Xương', 'Lộc Tồn'],
      required_palaces: ['Mão'],
      positions: ['Hội tụ'],
      formula_text: 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn (hoặc Hóa Lộc) hội tụ tại Mão.'
    },
    interpretations: [
      { context: 'Hội tụ tại Mão', content: 'Cực kỳ thích hợp học thuật, thi cử, nghiên cứu. Dễ đỗ đạt, bằng cấp cao, danh tiếng học giả.', tags: ['hoc_van', 'thi_cu', 'hoc_gia'] }
    ],
    tags: ['hoc_van', 'thi_cu', 'hoc_gia', 'cong_danh', 'cat_cach']
  },
  {
    name: 'Nguyệt Lãng Thiên Môn',
    type: 'cat_cach',
    description: 'Cách cục cực kỳ phú quý, dung mạo đẹp đẽ, thu hút, hợp với nữ mệnh.',
    logic_conditions: {
      required_stars: ['Thái Âm'],
      required_palaces: ['Hợi'],
      formula_text: 'Mệnh có Thái Âm tọa thủ tại Hợi.'
    },
    interpretations: [
      { context: 'Nữ mệnh Thái Âm tại Hợi', content: 'Dung mạo thanh tú, phú quý song toàn, được quý nhân ái mộ, hôn nhân tốt đẹp.', tags: ['nu_menh', 'dung_mao', 'phu_quy'] },
      { context: 'Nam mệnh', content: 'Vẫn phú quý nhưng đặc biệt hợp với nữ mệnh hơn.', tags: ['phu_quy'] }
    ],
    tags: ['phu_quy', 'dung_mao', 'nu_menh', 'cat_cach']
  },
  {
    name: 'Nhật Chiếu Lôi Môn',
    type: 'cat_cach',
    description: 'Vinh hoa phú quý, sự nghiệp rực rỡ vào ban ngày hoặc lúc trẻ.',
    logic_conditions: {
      required_stars: ['Thái Dương'],
      required_palaces: ['Mão'],
      formula_text: 'Mệnh có Thái Dương tọa thủ tại Mão.'
    },
    interpretations: [
      { context: 'Thái Dương tại Mão', content: 'Như mặt trời mọc, rực rỡ, sự nghiệp thăng tiến nhanh. Lúc trẻ đã nổi bật.', tags: ['su_nghiep', 'tre_thanh_cong'] }
    ],
    tags: ['su_nghiep', 'cong_danh', 'phu_quy', 'cat_cach']
  },
  {
    name: 'Thất Sát Triều Đẩu',
    type: 'cat_cach',
    description: 'Uy quyền hiển hách, danh tướng tài ba, tay trắng dựng cơ đồ.',
    logic_conditions: {
      required_stars: ['Thất Sát'],
      required_palaces: ['Dần', 'Thân', 'Tý', 'Ngọ'],
      formula_text: 'Thất Sát tọa thủ tại Dần, Thân, Tý, Ngọ.'
    },
    interpretations: [
      { context: 'Đắc địa tại Dần/Thân/Tý/Ngọ', content: 'Uy quyền bẩm sinh, tự lực lập nghiệp từ hai bàn tay trắng, cuối cùng thành công vang dội.', tags: ['uy_quyen', 'tu_luc'] }
    ],
    tags: ['uy_quyen', 'tu_luc', 'dung_manh', 'cat_cach']
  },
  {
    name: 'Tham Vũ Đồng Hành',
    type: 'cat_cach',
    description: 'Cách cục hoạch phát (giàu lên nhanh chóng) vào lúc trung vận (sau 30 tuổi).',
    logic_conditions: {
      required_stars: ['Tham Lang', 'Vũ Khúc'],
      positions: ['Đồng cung'],
      required_palaces: ['Sửu', 'Mùi'],
      formula_text: 'Tham Lang và Vũ Khúc đồng cung tại Sửu hoặc Mùi.'
    },
    interpretations: [
      { context: 'Sau 30 tuổi', content: 'Trước 30 còn khó khăn, nhưng sau 30 giàu lên rất nhanh trong ngành kinh doanh, đầu tư.', tags: ['hoacu_phat', 'kinh_doanh'] }
    ],
    tags: ['hoach_phat', 'kinh_doanh', 'tai_chinh', 'cat_cach']
  },
  {
    name: 'Hỏa Tham',
    type: 'cat_cach',
    description: 'Bạo phát bạo tàn, giàu có bất ngờ nhờ may mắn hoặc chớp thời cơ.',
    logic_conditions: {
      required_stars: ['Tham Lang', 'Hỏa Tinh'],
      positions: ['Đồng cung', 'Hội chiếu'],
      formula_text: 'Tham Lang đi cùng Hỏa Tinh đắc địa.'
    },
    interpretations: [
      { context: 'Đắc địa', content: 'Một lần đánh lớn thành công rực rỡ, giàu bất ngờ nhờ chớp cơ hội. Nhưng cũng dễ mất nhanh nếu không cẩn thận.', tags: ['hoach_phat', 'may_man'] }
    ],
    tags: ['hoach_phat', 'may_man', 'bat_ngo', 'cat_cach']
  },
  {
    name: 'Linh Tham',
    type: 'cat_cach',
    description: 'Giàu có bất ngờ nhờ may mắn hoặc chớp thời cơ (tương tự Hỏa Tham).',
    logic_conditions: {
      required_stars: ['Tham Lang', 'Linh Tinh'],
      positions: ['Đồng cung', 'Hội chiếu'],
      formula_text: 'Tham Lang đi cùng Linh Tinh đắc địa.'
    },
    interpretations: [
      { context: 'Đắc địa', content: 'Hoạch phát bất ngờ, mang nặng tính đầu cơ và may rủi. Thành công lớn nhưng phải biết giữ gìn.', tags: ['hoach_phat', 'may_man', 'dau_co'] }
    ],
    tags: ['hoach_phat', 'may_man', 'bat_ngo', 'cat_cach']
  },
  {
    name: 'Thạch Trung Ẩn Ngọc',
    type: 'cat_cach',
    description: 'Ngọc ẩn trong đá, tài năng giấu kín, cần kiên trì mới phát lộ vinh quang.',
    logic_conditions: {
      required_stars: ['Cự Môn', 'Hóa Lộc'],
      required_palaces: ['Tý', 'Ngọ'],
      formula_text: 'Cự Môn tọa Mệnh tại Tý hoặc Ngọ, có thêm Hóa Lộc, Hóa Quyền hoặc Lộc Tồn.'
    },
    interpretations: [
      { context: 'Tý/Ngọ có Hóa Lộc', content: 'Tài năng ẩn sâu, người ngoài khó nhận ra nhưng khi phát lộ thì làm người khác phải kinh ngạc.', tags: ['tai_nang', 'an_sau', 'kien_tri'] }
    ],
    tags: ['tai_nang', 'kien_tri', 'an_sau', 'cat_cach']
  },
  {
    name: 'Tam Kỳ Gia Hội',
    type: 'cat_cach',
    description: 'May mắn tột bậc, dễ gặp quý nhân, công thành danh toại.',
    logic_conditions: {
      required_stars: ['Hóa Khoa', 'Hóa Quyền', 'Hóa Lộc'],
      positions: ['Hội chiếu'],
      formula_text: 'Hóa Khoa, Hóa Quyền, Hóa Lộc hội chiếu cung Mệnh.'
    },
    interpretations: [
      { context: 'Tam Hóa hội Mệnh', content: 'Trùng phùng vận hội, may mắn thiên thời địa lợi nhân hòa, công danh thành đạt dễ dàng, quý nhân trợ giúp.', tags: ['may_man', 'quy_nhan', 'cong_danh'] }
    ],
    tags: ['may_man', 'quy_nhan', 'cong_danh', 'hoa_tinh', 'cat_cach']
  },
  {
    name: 'Song Lộc Triều Viên',
    type: 'cat_cach',
    description: 'Tiền tài dồi dào, là cự phú doanh nhân.',
    logic_conditions: {
      required_stars: ['Hóa Lộc', 'Lộc Tồn'],
      positions: ['Hội chiếu'],
      formula_text: 'Hóa Lộc và Lộc Tồn hội chiếu về cung Mệnh.'
    },
    interpretations: [
      { context: 'Song Lộc hội Mệnh', content: 'Hai nguồn lộc cùng hướng về Mệnh, tài vận cực tốt, kiếm tiền giỏi, giàu có bền lâu.', tags: ['tai_chinh', 'phu_quy', 'loc'] }
    ],
    tags: ['tai_chinh', 'phu_quy', 'loc', 'cat_cach']
  },
  {
    name: 'Khoa Minh Lộc Ám',
    type: 'cat_cach',
    description: 'Thông minh đỗ đạt (Khoa) và ngầm có tài lộc phú quý (Lộc).',
    logic_conditions: {
      required_stars: ['Hóa Khoa', 'Hóa Lộc'],
      positions: ['Nhị hợp', 'Ám hợp'],
      formula_text: 'Mệnh có Hóa Khoa, cung Nhị Hợp có Hóa Lộc (hoặc Lộc Tồn).'
    },
    interpretations: [
      { context: 'Khoa minh Lộc ám', content: 'Bề ngoài nổi tiếng về tài học (Khoa), bề trong có lộc ngầm chảy về (Lộc Ám), giàu mà ít ai biết.', tags: ['hoc_van', 'tai_chinh', 'an_sau'] }
    ],
    tags: ['hoc_van', 'tai_chinh', 'an_sau', 'cat_cach']
  },
  {
    name: 'Lộc Mã Giao Trì',
    type: 'cat_cach',
    description: 'Giàu có nhờ buôn bán, ngoại giao, càng xuất ngoại hoặc đi xa càng phát tài.',
    logic_conditions: {
      required_stars: ['Thiên Mã', 'Lộc Tồn'],
      positions: ['Đồng cung', 'Hội chiếu'],
      formula_text: 'Thiên Mã đồng cung hoặc hội chiếu với Lộc Tồn / Hóa Lộc.'
    },
    interpretations: [
      { context: 'Mã đồng cung/hội Lộc', content: 'Công việc liên quan xuất nhập khẩu, du lịch, vận chuyển, ngoại thương đều phát đạt.', tags: ['kinh_doanh', 'xuat_ngoai', 'di_xa'] }
    ],
    tags: ['kinh_doanh', 'xuat_ngoai', 'di_xa', 'tai_chinh', 'cat_cach']
  },
  {
    name: 'Hùng Tú Triều Viên',
    type: 'cat_cach',
    description: 'Làm giàu hoặc hiển đạt nhờ nghệ thuật, kinh doanh tự do, tính cách mạnh mẽ.',
    logic_conditions: {
      required_stars: ['Liêm Trinh'],
      required_palaces: ['Dần', 'Thân'],
      formula_text: 'Liêm Trinh tọa Mệnh tại Dần hoặc Thân.'
    },
    interpretations: [
      { context: 'Liêm Trinh tại Dần/Thân', content: 'Cách cục anh hùng, tự do, phóng khoáng. Thành công nhờ cá tính mạnh mẽ, sáng tạo, không chịu bó buộc.', tags: ['tu_do', 'sang_tao', 'manh_me'] }
    ],
    tags: ['tu_do', 'sang_tao', 'manh_me', 'nghe_thuat', 'cat_cach']
  },

  // =========================================================
  // HUNG BẠI CÁCH — Cách cục xấu
  // =========================================================
  {
    name: 'Linh Xương Đà Vũ',
    type: 'hung_bai_cach',
    description: 'Cách cục rất độc, chủ về rủi ro tai nạn liên quan đến sông nước, hình ngục hoặc bế tắc đổ vỡ.',
    logic_conditions: {
      required_stars: ['Linh Tinh', 'Văn Xương', 'Đà La', 'Vũ Khúc'],
      positions: ['Hội tụ'],
      formula_text: 'Hội tụ đủ 4 sao: Linh Tinh, Văn Xương, Đà La, Vũ Khúc tại Mệnh hoặc Hạn.'
    },
    interpretations: [
      { context: 'Tại Mệnh', content: 'Cuộc đời nhiều tai họa bất ngờ, nguy cơ hình ngục. Cần cẩn thận sông nước, xe cộ, pháp lý.', tags: ['tai_nan', 'hinh_nguc', 'song_nuoc'] }
    ],
    tags: ['tai_nan', 'hinh_nguc', 'rui_ro', 'hung_bai_cach']
  },
  {
    name: 'Hình Kỵ Giáp Ấn',
    type: 'hung_bai_cach',
    description: 'Cách cục pháp luật, kiện tụng, dễ bị người khác hãm hại, làm bia đỡ đạn.',
    logic_conditions: {
      required_stars: ['Thiên Tướng', 'Kình Dương', 'Hóa Kỵ'],
      positions: ['Giáp'],
      formula_text: 'Thiên Tướng (Ấn) tại Mệnh bị Kình Dương (hoặc Thiên Hình) và Hóa Kỵ giáp hai bên.'
    },
    interpretations: [
      { context: 'Tại Mệnh', content: 'Dễ bị vạ lây pháp luật, bị người lợi dụng, đứng ra gánh chịu tội lỗi thay người khác.', tags: ['kien_tung', 'bi_hai', 'phap_luat'] }
    ],
    tags: ['kien_tung', 'phap_luat', 'bi_hai', 'hung_bai_cach']
  },
  {
    name: 'Mệnh Lý Phùng Không',
    type: 'hung_bai_cach',
    description: 'Làm nhiều hưởng ít, công danh chìm nổi, như hoa nở rồi tàn.',
    logic_conditions: {
      required_stars: ['Địa Không'],
      excluded_stars: [],
      formula_text: 'Mệnh có Địa Không hoặc Tuần Không, Triệt Không; Thân có Địa Kiếp (hoặc ngược lại).'
    },
    interpretations: [
      { context: 'Địa Không tại Mệnh', content: 'Nỗ lực nhiều nhưng thu hoạch ít, công danh lúc thăng lúc trầm, khó giữ thành quả bền lâu.', tags: ['bat_on', 'kho_thanh', 'hoa_tan'] }
    ],
    tags: ['bat_on', 'kho_thanh', 'hoa_tan', 'hung_bai_cach']
  },
  {
    name: 'Kình Đà Hiệp Kỵ',
    type: 'hung_bai_cach',
    description: 'Mưu sự trắc trở, xung quanh nhiều tiểu nhân ngáng đường, tiến thoái lưỡng nan.',
    logic_conditions: {
      required_stars: ['Hóa Kỵ', 'Kình Dương', 'Đà La'],
      positions: ['Giáp'],
      formula_text: 'Mệnh có Hóa Kỵ, bị Kình Dương và Đà La giáp hai bên.'
    },
    interpretations: [
      { context: 'Tại Mệnh', content: 'Đường đời bị chặn từ hai phía, tiểu nhân ám hại, mưu sự khó hoàn thành, tiến thoái đều khó.', tags: ['tieu_nhan', 'trac_tro', 'kho_di'] }
    ],
    tags: ['tieu_nhan', 'trac_tro', 'kho_di', 'hung_bai_cach']
  },
  {
    name: 'Lộc Phùng Xung Phá',
    type: 'hung_bai_cach',
    description: 'Tiền tài làm ra nhiều nhưng phá tán cũng nhanh, nguy cơ phá sản.',
    logic_conditions: {
      required_stars: ['Lộc Tồn', 'Hóa Kỵ'],
      excluded_stars: [],
      formula_text: 'Lộc Tồn hoặc Hóa Lộc bị Không Kiếp, Hóa Kỵ, Tuần Triệt phá hỏng.'
    },
    interpretations: [
      { context: 'Lộc bị phá', content: 'Tiền vào nhiều nhưng ra cũng nhiều, không giữ được của, nguy cơ phá sản hoặc mất tất cả vì một quyết định sai.', tags: ['pha_tan', 'pha_san', 'mat_tien'] }
    ],
    tags: ['pha_tan', 'pha_san', 'mat_tien', 'hung_bai_cach']
  },
  {
    name: 'Mã Lạc Không Vong',
    type: 'hung_bai_cach',
    description: 'Bôn ba vất vả, nỗ lực di chuyển nhiều nhưng kết quả bằng không.',
    logic_conditions: {
      required_stars: ['Thiên Mã', 'Địa Không'],
      positions: ['Đồng cung', 'Hội chiếu'],
      formula_text: 'Thiên Mã đồng cung với Tuần Không, Triệt Không hoặc Địa Không.'
    },
    interpretations: [
      { context: 'Mã gặp Không', content: 'Chạy ngược chạy xuôi, đi nhiều nơi, làm nhiều nghề nhưng không tích lũy được gì, công sức bị nuốt chửng.', tags: ['bon_ba', 'vo_ich', 'vat_va'] }
    ],
    tags: ['bon_ba', 'vo_ich', 'vat_va', 'hung_bai_cach']
  },
  {
    name: 'Cự Hỏa Kình Dương',
    type: 'hung_bai_cach',
    description: 'Dễ rước họa vào thân do lời nói, thương tật bất ngờ hoặc bế tắc quyên sinh.',
    logic_conditions: {
      required_stars: ['Cự Môn', 'Hỏa Tinh', 'Kình Dương'],
      positions: ['Đồng cung', 'Hội chiếu'],
      formula_text: 'Cự Môn đồng cung hoặc hội chiếu với Hỏa Tinh và Kình Dương.'
    },
    interpretations: [
      { context: 'Hội tụ hung sát', content: 'Lời nói gây họa, tai nạn thương tích, bế tắc cực điểm. Cần hết sức thận trọng trong lời nói và hành động.', tags: ['tai_nan', 'loi_noi', 'nguy_hiem'] }
    ],
    tags: ['tai_nan', 'loi_noi', 'nguy_hiem', 'hung_bai_cach']
  },
  {
    name: 'Phiếm Thủy Đào Hoa',
    type: 'hung_bai_cach',
    description: 'Sống buông thả, lãng mạn mù quáng, dễ mắc tai họa vì tình ái.',
    logic_conditions: {
      required_stars: ['Tham Lang'],
      required_palaces: ['Tý', 'Hợi'],
      formula_text: 'Tham Lang tọa Mệnh tại Tý hoặc Hợi.'
    },
    interpretations: [
      { context: 'Hãm địa Tý/Hợi', content: 'Đắm mình trong tình ái, rượu chè, cờ bạc, buông thả. Sự nghiệp suy bại vì không kiềm chế được ham muốn.', tags: ['dao_hoa', 'buong_tha', 'tinh_ai'] }
    ],
    tags: ['dao_hoa', 'buong_tha', 'tinh_ai', 'hung_bai_cach']
  },
  {
    name: 'Phong Lưu Thái Trượng',
    type: 'hung_bai_cach',
    description: 'Dễ bị lừa gạt tình cảm, tham sắc dục mà mất mạng hoặc suy bại.',
    logic_conditions: {
      required_stars: ['Tham Lang', 'Đà La'],
      required_palaces: ['Dần', 'Thân'],
      positions: ['Đồng cung'],
      formula_text: 'Tham Lang và Đà La đồng cung tại Dần hoặc Thân.'
    },
    interpretations: [
      { context: 'Tham Lang + Đà La', content: 'Tham mê sắc dục, bị lừa gạt tình cảm, cuộc đời bại hoại vì nữ sắc (nam mệnh) hoặc vì theo đuổi người không đáng (nữ mệnh).', tags: ['tinh_ai', 'bi_lua', 'suy_bai'] }
    ],
    tags: ['tinh_ai', 'bi_lua', 'suy_bai', 'hung_bai_cach']
  },
  {
    name: 'Nhật Nguyệt Tàng Huy',
    type: 'hung_bai_cach',
    description: 'Tối tăm, mắt kém, khắc cha mẹ, công danh lận đận, mưu sự khó thành.',
    logic_conditions: {
      required_stars: ['Thái Dương', 'Thái Âm'],
      formula_text: 'Thái Dương, Thái Âm đều nằm ở vị trí Hãm địa.'
    },
    interpretations: [
      { context: 'Cả hai hãm địa', content: 'Nhật Nguyệt đều khuất, tối tăm buồn tẻ, cha mẹ phân ly hoặc sớm mất, công danh khó nên, thường có vấn đề về mắt.', tags: ['khat_phu_mau', 'cong_danh_kho', 'toi_tang'] }
    ],
    tags: ['khat_phu_mau', 'cong_danh_kho', 'toi_tang', 'hung_bai_cach']
  },
  {
    name: 'Bán Không Chiết Xỉ',
    type: 'hung_bai_cach',
    description: 'Gãy gánh giữa đường, sự nghiệp hoặc sinh mệnh đứt đoạn giữa chừng ở đỉnh cao.',
    logic_conditions: {
      required_stars: ['Địa Không', 'Địa Kiếp'],
      formula_text: 'Các bộ sao quyền lực như Thất Sát, Thiên Tướng ngộ Địa Không, Địa Kiếp ở Mệnh hoặc Hạn.'
    },
    interpretations: [
      { context: 'Quyền lực ngộ Không Kiếp', content: 'Sự nghiệp đang lên cao đột ngột gãy đổ, thường xảy ra tại các Đại Hạn có Không Kiếp. Cần cẩn thận đỉnh cao nhất.', tags: ['gay_do', 'bat_ngo', 'dinh_cao'] }
    ],
    tags: ['gay_do', 'bat_ngo', 'dinh_cao', 'hung_bai_cach']
  },

  // =========================================================
  // ĐẶC BIỆT CÁCH — Cách cục đặc biệt
  // =========================================================
  {
    name: 'Mệnh Vô Chính Diệu',
    type: 'dac_biet_cach',
    description: 'Thích ứng tốt, khôn ngoan, nhưng lập trường thiếu kiên định, lúc nhỏ khó nuôi, thường làm con nuôi hoặc rời xa quê hương.',
    logic_conditions: {
      required_stars: [],
      formula_text: 'Cung Mệnh không có chính tinh. Cần mượn bộ chính tinh ở đối cung (cung Thiên Di) để luận đoán.'
    },
    interpretations: [
      { context: 'Mệnh không có chính tinh', content: 'Tính cách linh hoạt, thích ứng tốt với mọi hoàn cảnh. Nhưng dễ thiếu định hướng, lúc nhỏ sức khỏe yếu, thường xa cha mẹ hoặc quê hương từ nhỏ.', tags: ['linh_hoat', 'khong_dinh_huong', 'xa_que'] }
    ],
    tags: ['linh_hoat', 'khong_dinh_huong', 'xa_que', 'dac_biet_cach']
  },
  {
    name: 'Ám Lộc',
    type: 'dac_biet_cach',
    description: 'Hưởng lộc ẩn tàng, thường có của chìm, tiền tiết kiệm bí mật.',
    logic_conditions: {
      required_stars: ['Lộc Tồn'],
      positions: ['Nhị hợp', 'Ám hợp'],
      formula_text: 'Mệnh có Lộc Tồn Nhị hợp hoặc Ám hợp với cung Tài/Quan.'
    },
    interpretations: [
      { context: 'Lộc ám chiếu Mệnh', content: 'Của cải ẩn giấu, tiền bạc không phô trương, thường có khoản tiết kiệm hoặc tài sản ẩn mà người ngoài không biết.', tags: ['loc_an', 'cua_chim', 'tiet_kiem'] }
    ],
    tags: ['loc_an', 'cua_chim', 'dac_biet_cach']
  },

  // =========================================================
  // CÁT CÁCH BỔ SUNG — Phần 2
  // =========================================================
  {
    name: 'Tử Phủ Triều Viên',
    type: 'cat_cach',
    description: 'Cách cục thanh cao, phúc thọ song toàn, thường có địa vị xã hội được kính trọng.',
    logic_conditions: {
      required_stars: ['Tử Vi', 'Thiên Phủ'],
      positions: ['Tam hợp', 'Xung chiếu'],
      formula_text: 'Tử Vi và Thiên Phủ nằm ở cung Tam hợp hoặc Xung chiếu chiếu về Mệnh.'
    },
    interpretations: [
      { context: 'Tam hợp/Xung chiếu về Mệnh', content: 'Thanh cao phú quý, phúc thọ song toàn, được xã hội kính trọng, uy tín bền lâu.', tags: ['phu_quy', 'phuc_tho', 'uy_tin'] }
    ],
    tags: ['phu_quy', 'phuc_tho', 'uy_tin', 'cat_cach']
  },
  {
    name: 'Thiên Ất Củng Mệnh',
    type: 'cat_cach',
    description: 'Mạng có quý nhân phù trợ, ra ngoài luôn có người giúp đỡ, thi cử dễ đỗ đạt.',
    logic_conditions: {
      required_stars: ['Thiên Khôi', 'Thiên Việt'],
      positions: ['Tọa thủ', 'Xung chiếu'],
      formula_text: 'Thiên Khôi và Thiên Việt tọa thủ ở Mệnh hoặc nằm ở đối cung chiếu về.'
    },
    interpretations: [
      { context: 'Củng Mệnh', content: 'Suốt đời được quý nhân nâng đỡ, ra ngoài gặp may, thi cử dễ thành công, cơ hội nhiều hơn người thường.', tags: ['quy_nhan', 'thi_cu', 'may_man'] }
    ],
    tags: ['quy_nhan', 'thi_cu', 'may_man', 'cat_cach']
  },
  {
    name: 'Tả Hữu Đồng Cung',
    type: 'cat_cach',
    description: 'Quan hệ xã hội cực rộng, làm việc gì cũng có vây cánh, đông bạn bè, đắc lực trong tổ chức.',
    logic_conditions: {
      required_stars: ['Tả Phù', 'Hữu Bật'],
      positions: ['Đồng cung'],
      required_palaces: ['Sửu', 'Mùi'],
      formula_text: 'Tả Phù và Hữu Bật đồng cung tại Sửu hoặc Mùi ở cung Mệnh.'
    },
    interpretations: [
      { context: 'Đồng cung tại Mệnh', content: 'Quan hệ rộng, đông bạn hữu, luôn có người sẵn lòng trợ giúp, đặc biệt thành công trong công tác tổ chức và lãnh đạo nhóm.', tags: ['quan_he', 'ban_be', 'to_chuc'] }
    ],
    tags: ['quan_he', 'ban_be', 'to_chuc', 'cat_cach']
  },
  {
    name: 'Văn Tinh Củng Mệnh',
    type: 'cat_cach',
    description: 'Người có tài văn chương, nghệ thuật, học rộng tài cao, nho nhã.',
    logic_conditions: {
      required_stars: ['Văn Xương', 'Văn Khúc', 'Hóa Khoa'],
      positions: ['Hội tụ'],
      formula_text: 'Văn Xương, Văn Khúc, Hóa Khoa hội tụ tại Mệnh.'
    },
    interpretations: [
      { context: 'Tam văn hội Mệnh', content: 'Thiên tư văn học xuất sắc, tài sáng tác nghệ thuật, học vấn cao, thích hợp những nghề sáng tạo, giảng dạy, viết lách.', tags: ['van_chuong', 'nghe_thuat', 'hoc_van'] }
    ],
    tags: ['van_chuong', 'nghe_thuat', 'hoc_van', 'cat_cach']
  },
  {
    name: 'Nhật Nguyệt Đồng Lâm',
    type: 'cat_cach',
    description: 'Tính cách dung hòa, vừa cương vừa nhu, hậu vận thường rất tốt đẹp nếu có cát tinh trợ lực.',
    logic_conditions: {
      required_stars: ['Thái Dương', 'Thái Âm'],
      positions: ['Đồng cung'],
      required_palaces: ['Sửu', 'Mùi'],
      formula_text: 'Thái Dương và Thái Âm đồng cung tại Sửu hoặc Mùi.'
    },
    interpretations: [
      { context: 'Đồng cung Sửu/Mùi', content: 'Tính tình dung hòa, vừa cứng vừa mềm, biết cân bằng âm dương. Hậu vận tốt khi có thêm cát tinh hội chiếu.', tags: ['dung_hoa', 'can_bang', 'hau_van'] }
    ],
    tags: ['dung_hoa', 'can_bang', 'hau_van', 'cat_cach']
  },
  {
    name: 'Thọ Tinh Nhập Miếu',
    type: 'cat_cach',
    description: 'Trường thọ, tính cách hiền lành, thích làm việc thiện, hay cứu người.',
    logic_conditions: {
      required_stars: ['Thiên Lương'],
      required_palaces: ['Ngọ'],
      formula_text: 'Thiên Lương đắc địa tọa thủ tại Mệnh ở Ngọ.'
    },
    interpretations: [
      { context: 'Thiên Lương tại Ngọ', content: 'Thiên Lương miếu vượng, trường thọ an khang, hiền đức được kính yêu, phù hợp y nghiệp, tu hành, làm từ thiện.', tags: ['tho', 'hien_lanh', 'y_nghiep'] }
    ],
    tags: ['tho', 'hien_lanh', 'y_nghiep', 'cat_cach']
  },
  {
    name: 'Anh Tinh Nhập Miếu',
    type: 'cat_cach',
    description: 'Khí phách hiên ngang, dũng mãnh, thường có uy danh trong quân đội hoặc thương trường.',
    logic_conditions: {
      required_stars: ['Phá Quân'],
      required_palaces: ['Tý', 'Ngọ'],
      formula_text: 'Phá Quân đắc địa tọa thủ tại Tý hoặc Ngọ.'
    },
    interpretations: [
      { context: 'Phá Quân miếu địa', content: 'Dũng mãnh, tiên phong, phá cũ lập mới cực mạnh. Uy danh vang xa trong quân sự hoặc kinh doanh táo bạo.', tags: ['dung_manh', 'tien_phong', 'uy_danh'] }
    ],
    tags: ['dung_manh', 'tien_phong', 'uy_danh', 'cat_cach']
  },
  {
    name: 'Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn)',
    type: 'cat_cach',
    description: 'Gươm kề cổ ngựa, cách cục bạo phát bạo tàn, xông pha nguy hiểm để giành đại thắng.',
    logic_conditions: {
      required_stars: ['Kình Dương'],
      required_palaces: ['Thìn', 'Tuất', 'Sửu', 'Mùi', 'Ngọ'],
      formula_text: 'Kình Dương cư tại Mệnh ở các cung Thìn, Tuất, Sửu, Mùi hoặc Ngọ (có thêm Thất Sát/Tham Lang).'
    },
    interpretations: [
      { context: 'Đắc địa tứ mộ hoặc Ngọ', content: 'Oai hùng không sợ chết, phong thái tướng lĩnh, liều lĩnh đúng chỗ đúng lúc để giành đại thắng. Dễ thành công trong quân sự, thể thao mạo hiểm, kinh doanh liều.', tags: ['bao_phat', 'dung_cam', 'manh_me'] }
    ],
    tags: ['bao_phat', 'dung_cam', 'manh_me', 'cat_cach']
  },
  {
    name: 'Tài Ấn Giao Trì',
    type: 'cat_cach',
    description: 'Vừa có tiền bạc (Tài) vừa có quyền lực (Ấn), danh lợi song thu.',
    logic_conditions: {
      required_stars: ['Vũ Khúc', 'Thiên Tướng'],
      positions: ['Đồng cung'],
      required_palaces: ['Dần', 'Thân'],
      formula_text: 'Vũ Khúc (Tài) và Thiên Tướng (Ấn) đồng cung tại Dần hoặc Thân.'
    },
    interpretations: [
      { context: 'Vũ Tướng đắc địa', content: 'Tiền bạc và quyền lực song hành, danh lợi song thu. Làm việc gì cũng có cả tiền lẫn uy, thành công toàn diện.', tags: ['tai_chinh', 'quyen_luc', 'danh_loi'] }
    ],
    tags: ['tai_chinh', 'quyen_luc', 'danh_loi', 'cat_cach']
  },
  {
    name: 'Giáp Đệ Đăng Khoa',
    type: 'cat_cach',
    description: 'Bảng vàng đề tên, thi cử dễ đứng đầu, đường học vấn rực rỡ.',
    logic_conditions: {
      required_stars: ['Hóa Khoa', 'Hóa Quyền'],
      positions: ['Tam hợp', 'Xung chiếu'],
      formula_text: 'Hóa Khoa ở Mệnh, Hóa Quyền ở Tam hợp chiếu về.'
    },
    interpretations: [
      { context: 'Khoa Quyền hội Mệnh', content: 'Thi cử dễ đứng đầu, học vấn xuất sắc, dễ đạt danh hiệu cao, bảng vàng đề tên.', tags: ['thi_cu', 'hoc_van', 'dung_dau'] }
    ],
    tags: ['thi_cu', 'hoc_van', 'dung_dau', 'cat_cach']
  },

  // =========================================================
  // HUNG BẠI CÁCH BỔ SUNG — Phần 2
  // =========================================================
  {
    name: 'Đế Ngộ Hung Đồ',
    type: 'hung_bai_cach',
    description: 'Vua rơi vào tay kẻ cướp. Mệnh có chí lớn nhưng bị tiểu nhân vây hãm, mưu sự thất bại.',
    logic_conditions: {
      required_stars: ['Tử Vi', 'Kình Dương', 'Hỏa Tinh'],
      formula_text: 'Tử Vi tọa Mệnh hội hợp quá nhiều sát tinh như Không Kiếp, Kình Đà, Hỏa Linh.'
    },
    interpretations: [
      { context: 'Tử Vi ngộ sát', content: 'Hoài bão lớn nhưng môi trường xung quanh toàn tiểu nhân phá hoại. Mưu lớn thường bị dập tắt ở giai đoạn gần thành công.', tags: ['tieu_nhan', 'bi_pha', 'that_bai'] }
    ],
    tags: ['tieu_nhan', 'bi_pha', 'that_bai', 'hung_bai_cach']
  },
  {
    name: 'Nhật Nguyệt Tật Ách',
    type: 'hung_bai_cach',
    description: 'Thường có vấn đề nặng về thị lực (cận, mù lòa) hoặc mắc bệnh thần kinh, khắc cha mẹ.',
    logic_conditions: {
      required_stars: ['Thái Dương', 'Thái Âm', 'Hóa Kỵ'],
      formula_text: 'Thái Dương và Thái Âm đồng cung hoặc hội chiếu tại cung Tật Ách gặp Kỵ, Sát.'
    },
    interpretations: [
      { context: 'Nhật Nguyệt tại Tật Ách gặp Kỵ', content: 'Dễ mắc bệnh về mắt (cận thị, đục thủy tinh thể), bệnh thần kinh hoặc khắc cha mẹ cả hai.', tags: ['benh_mat', 'than_kinh', 'khat_cha_me'] }
    ],
    tags: ['benh_mat', 'than_kinh', 'khat_cha_me', 'hung_bai_cach']
  },
  {
    name: 'Khúc Ám Đồng Cung',
    type: 'hung_bai_cach',
    description: 'Dễ bị lừa gạt, vướng vào thị phi đồn thổi, tâm lý thường bất an, hay lo nghĩ thái quá.',
    logic_conditions: {
      required_stars: ['Văn Khúc', 'Cự Môn'],
      positions: ['Đồng cung', 'Hội chiếu'],
      formula_text: 'Văn Khúc và Cự Môn (Ám tinh) đồng cung hoặc hội chiếu.'
    },
    interpretations: [
      { context: 'Khúc Ám hội', content: 'Tâm lý bất an, hay lo âu thái quá, dễ bị người khác lừa gạt qua lời ngon tiếng ngọt, dính thị phi miệng tiếng.', tags: ['tam_ly', 'thi_phi', 'bi_lua'] }
    ],
    tags: ['tam_ly', 'thi_phi', 'bi_lua', 'hung_bai_cach']
  },
  {
    name: 'Thiên Cơ Tỵ Hợi',
    type: 'hung_bai_cach',
    description: 'Tâm tính xảo trá, nay đây mai đó, khó ổn định cơ nghiệp, dễ lâm cảnh nghèo túng.',
    logic_conditions: {
      required_stars: ['Thiên Cơ'],
      required_palaces: ['Tỵ', 'Hợi'],
      formula_text: 'Thiên Cơ tọa Mệnh hãm địa tại Tỵ hoặc Hợi ngộ sát tinh.'
    },
    interpretations: [
      { context: 'Hãm địa Tỵ/Hợi', content: 'Trí khôn bị dùng sai hướng, hay mưu mô nhỏ nhặt, cuộc đời bôn ba không định hướng, khó lập nghiệp bền vững.', tags: ['bon_ba', 'khong_on_dinh', 'kho_lap_nghiep'] }
    ],
    tags: ['bon_ba', 'khong_on_dinh', 'kho_lap_nghiep', 'hung_bai_cach']
  },
  {
    name: 'Hình Tù Giáp Ấn',
    type: 'hung_bai_cach',
    description: 'Bị giam cầm, dính dáng pháp luật, công danh bị cản trở bởi hình ngục.',
    logic_conditions: {
      required_stars: ['Thiên Tướng', 'Kình Dương', 'Liêm Trinh'],
      positions: ['Giáp'],
      formula_text: 'Thiên Tướng ở Mệnh bị Kình Dương (hoặc Thiên Hình) và Liêm Trinh (Tù tinh) kẹp hai bên.'
    },
    interpretations: [
      { context: 'Tù Hình giáp Ấn', content: 'Nguy cơ tù tội cao, dễ bị giam cầm hoặc mắc vòng lao lý. Công danh nhiều khi bị cắt đứt đột ngột vì pháp luật.', tags: ['tu_toi', 'lao_ly', 'cong_danh_kho'] }
    ],
    tags: ['tu_toi', 'lao_ly', 'cong_danh_kho', 'hung_bai_cach']
  },
  {
    name: 'Cự Phùng Tứ Sát',
    type: 'hung_bai_cach',
    description: 'Mang họa vì lời nói, tai bay vạ gió, cuộc đời nhiều hình thương, tai nạn.',
    logic_conditions: {
      required_stars: ['Cự Môn', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'],
      formula_text: 'Cự Môn cư Mệnh hội đủ 4 sao Kình Dương, Đà La, Hỏa Tinh, Linh Tinh.'
    },
    interpretations: [
      { context: 'Cự ngộ tứ sát', content: 'Lời nói không kiểm soát gây đại họa, tai bay vạ gió, thương tích liên miên, cực kỳ cần tránh tranh cãi và thị phi.', tags: ['dai_hoa', 'thuong_tich', 'loi_noi_gay_hoa'] }
    ],
    tags: ['dai_hoa', 'thuong_tich', 'loi_noi_gay_hoa', 'hung_bai_cach']
  },
  {
    name: 'Lộ Bàng Mai Thi',
    type: 'hung_bai_cach',
    description: 'Chết đường chết chợ, tai nạn giao thông hoặc chết nơi xa xứ không ai hay biết.',
    logic_conditions: {
      required_stars: ['Liêm Trinh', 'Thất Sát', 'Hóa Kỵ'],
      required_palaces: ['Sửu', 'Mùi'],
      formula_text: 'Liêm Trinh, Thất Sát đồng cung tại Sửu, Mùi gặp Hóa Kỵ, Kình Đà.'
    },
    interpretations: [
      { context: 'Hung tinh tụ tứ mộ + Kỵ', content: 'Cực kỳ nguy hiểm về tính mạng, tai nạn bất ngờ nơi đường xa, hoặc mất tích không ai hay. Cần đặc biệt thận trọng lúc di chuyển.', tags: ['tai_nan_giao_thong', 'nguy_hiem_tinh_mang', 'xa_xu'] }
    ],
    tags: ['tai_nan_giao_thong', 'nguy_hiem_tinh_mang', 'xa_xu', 'hung_bai_cach']
  },
  {
    name: 'Hoa Cái Cư Phu Thê',
    type: 'hung_bai_cach',
    description: 'Tình duyên trắc trở, kết hôn muộn hoặc dễ rơi vào cảnh cô độc, bỏ nhau.',
    logic_conditions: {
      required_stars: ['Hóa Kỵ'],
      formula_text: 'Sao Hoa Cái (chủ về sự đài các, cô độc) nằm tại cung Phu Thê gặp Sát tinh/Cô Quả.'
    },
    interpretations: [
      { context: 'Hoa Cái tại Phu Thê', content: 'Tình duyên khó bền, hay gặp người không hợp, hôn nhân dễ đổ vỡ hoặc sống một mình, duyên số trắc trở.', tags: ['tinh_duyen', 'hon_nhan', 'co_doc'] }
    ],
    tags: ['tinh_duyen', 'hon_nhan', 'co_doc', 'hung_bai_cach']
  },
  {
    name: 'Lưỡng Trùng Thiên Mã',
    type: 'hung_bai_cach',
    description: 'Bôn ba lao lực tận cùng, có thể gặp tai nạn di chuyển nặng nề.',
    logic_conditions: {
      required_stars: ['Thiên Mã', 'Kình Dương'],
      formula_text: 'Thiên Mã ở Mệnh gặp Lưu Thiên Mã (Đại hạn/Tiểu hạn) trùng phùng ngộ Sát tinh.'
    },
    interpretations: [
      { context: 'Song Mã ngộ Sát', content: 'Chạy gấp đôi người thường, mệt mỏi lao lực cực điểm. Nguy cơ tai nạn giao thông, máy bay khi hai Mã gặp sát tinh.', tags: ['bon_ba', 'lao_luc', 'tai_nan_di_chuyen'] }
    ],
    tags: ['bon_ba', 'lao_luc', 'tai_nan_di_chuyen', 'hung_bai_cach']
  },
  {
    name: 'Cát Xứ Tàng Hung',
    type: 'hung_bai_cach',
    description: 'Nhìn bề ngoài tưởng tốt, đang lúc đỉnh cao thì sụp đổ bất ngờ.',
    logic_conditions: {
      required_stars: ['Địa Kiếp'],
      formula_text: 'Các chính tinh đắc địa tụ hội nhưng lại dính ngay Triệt Không hoặc Địa Kiếp hãm địa ẩn tàng.'
    },
    interpretations: [
      { context: 'Đỉnh cao ngộ Kiếp Không', content: 'Lá số nhìn bề ngoài rất đẹp, nhưng có "bẫy" ẩn. Đang ở đỉnh cao bỗng sụp đổ không báo trước. Cần cảnh giác nhất ở lúc thịnh vượng nhất.', tags: ['cat_xau_an', 'sup_do_bat_ngo', 'dinh_cao'] }
    ],
    tags: ['cat_xau_an', 'sup_do_bat_ngo', 'dinh_cao', 'hung_bai_cach']
  },
  {
    name: 'Phủ Tướng Triều Viên',
    type: 'cat_cach',
    description: 'Cách cục thanh cao, phú quý song toàn, cuộc đời êm đềm, ít sóng gió. Dễ làm quản lý cấp cao, quan chức, tính tình khoan hòa, nhân duyên tốt đẹp và luôn được người phò tá, giúp đỡ.',
    logic_conditions: {
      required_stars: ['Thiên Phủ', 'Thiên Tướng'],
      positions: ['Tam hợp', 'Hội chiếu'],
      formula_text: 'Thiên Phủ và Thiên Tướng nằm ở cung Tam hợp (Tài Bạch, Quan Lộc) cùng hội chiếu về cung Mệnh.'
    },
    interpretations: [
      { context: 'Phủ Tướng hội chiếu Mệnh', content: 'Phú quý song toàn, cuộc đời ít sóng gió, thích hợp làm quản lý cấp cao hoặc quan chức. Tính tình khoan hòa, luôn được người phò tá và yêu mến.', tags: ['phu_quy', 'quan_chuc', 'khoan_hoa', 'quy_nhan'] }
    ],
    tags: ['phu_quy', 'on_dinh', 'quan_chuc', 'khoan_hoa', 'cat_cach']
  },
  {
    name: 'Nhật Lệ Trung Thiên',
    type: 'cat_cach',
    description: 'Mặt trời giữa trưa cực kỳ rực rỡ. Người có uy quyền lớn, tài lãnh đạo xuất chúng, danh tiếng vang dội, hợp với chính trị hoặc làm chủ doanh nghiệp lớn.',
    logic_conditions: {
      required_stars: ['Thái Dương'],
      required_palaces: ['Ngọ'],
      formula_text: 'Mệnh có Thái Dương tọa thủ đắc địa tại cung Ngọ (không bị Tuần, Triệt hay Không Kiếp phá).'
    },
    interpretations: [
      { context: 'Thái Dương tại Ngọ', content: 'Mặt trời đứng bóng, rực rỡ nhất. Uy quyền cực lớn, danh tiếng vang xa, dễ thành công trong chính trị hoặc lãnh đạo doanh nghiệp lớn.', tags: ['uy_quyen', 'lanh_dao', 'danh_tieng'] }
    ],
    tags: ['uy_quyen', 'lanh_dao', 'danh_tieng', 'cat_cach']
  },
  {
    name: 'Chúng Thủy Triều Đông',
    type: 'cat_cach',
    description: 'Trăm dòng sông đổ về biển lớn. Mẫu người dám đầu tư lớn, tiêu tiền như nước nhưng cũng kiếm được tiền như nước, thường là cự phú hoặc trùm tư bản.',
    logic_conditions: {
      required_stars: ['Đại Hao', 'Tiểu Hao'],
      required_palaces: ['Mão', 'Dậu'],
      formula_text: 'Mệnh hoặc Tài Bạch có Đại Hao, Tiểu Hao tọa thủ tại cung Mão hoặc Dậu.'
    },
    interpretations: [
      { context: 'Hao tinh đắc địa', content: 'Tuy Hao tinh nhưng ở đây lại tạo nên cục phú quý đặc biệt: tiêu tiền rất mạnh nhưng cũng kiếm lại rất nhanh, vòng quay tiền lớn như biển cả.', tags: ['phu_quy', 'cuong_phat', 'tai_chinh'] }
    ],
    tags: ['phu_quy', 'cuong_phat', 'tai_chinh', 'cat_cach']
  },
  {
    name: 'Không Kiếp Giáp Mệnh',
    type: 'hung_bai_cach',
    description: 'Cách cục thăng trầm tột độ, mưu sự hay hỏng vào phút chót, cuộc đời dễ gặp tai họa bất ngờ hoặc bị kẻ xấu bủa vây đoạt tài sản.',
    logic_conditions: {
      required_stars: ['Địa Không', 'Địa Kiếp'],
      positions: ['Giáp'],
      formula_text: 'Cung Mệnh bị hai sao Địa Không và Địa Kiếp nằm ở hai cung kề bên (nhị hợp/giáp) kẹp lại.'
    },
    interpretations: [
      { context: 'Không Kiếp giáp Mệnh', content: 'Mưu sự thường hỏng vào phút chót, tài sản dễ bị đoạt, hay gặp tai họa bất ngờ. Đặc biệt nguy hiểm khi đại hạn trùng thêm Không Kiếp.', tags: ['mat_tai', 'pha_san', 'bat_ngo'] }
    ],
    tags: ['mat_tai', 'pha_san', 'bat_ngo', 'hung_bai_cach']
  },
  {
    name: 'Kình Đà Giáp Mệnh',
    type: 'hung_bai_cach',
    description: 'Phải đơn độc chống chọi, dễ bị ghen ghét, đố kỵ hoặc vướng vào thị phi, ngáng đường. Thường xảy ra khi cung Mệnh có Lộc Tồn.',
    logic_conditions: {
      required_stars: ['Kình Dương', 'Đà La'],
      positions: ['Giáp'],
      formula_text: 'Cung Mệnh bị hai sao Kình Dương và Đà La nằm ở hai cung kề bên kẹp lại.'
    },
    interpretations: [
      { context: 'Kình Đà giáp Mệnh', content: 'Hai gươm kép lại, đường đời nhiều cản trở từ kẻ thù hay tiểu nhân. Cô độc chống chỏi, dễ bị ghen ghét, thị phi và vướng kiện tụng.', tags: ['co_doc', 'tieu_nhan', 'kien_tung'] }
    ],
    tags: ['co_doc', 'tieu_nhan', 'kien_tung', 'hung_bai_cach']
  },
  {
    name: 'Quân Thần Khánh Hội',
    type: 'cat_cach',
    description: 'Vua có bề tôi đắc lực. Cách cục của nhà lãnh đạo kiệt xuất, quyền lực thực tế, được cấp dưới tận tâm phò tá, sự nghiệp hanh thông.',
    logic_conditions: {
      required_stars: ['Tử Vi', 'Tả Phù', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt'],
      positions: ['Hội chiếu', 'Đồng cung'],
      formula_text: 'Tử Vi tọa thủ ở Mệnh hội họp đầy đủ các trung tinh cát như Tả Hữu, Khôi Việt, Xương Khúc.'
    },
    interpretations: [
      { context: 'Tử Vi hội Tả Hữu, Khôi Việt', content: 'Làm việc gì cũng có người xả thân giúp đỡ, lãnh đạo được tập thể lớn, quyền lực vững vàng không sợ bị cô lập.', tags: ['lanh_dao', 'quyen_luc', 'quy_nhan'] }
    ],
    tags: ['lanh_dao', 'quyen_luc', 'quy_nhan', 'cat_cach']
  },
  {
    name: 'Cơ Cự Đồng Lâm',
    type: 'cat_cach',
    description: 'Tay trắng dựng cơ đồ, có tài kinh doanh, phân tích, tham mưu và năng lực cạnh tranh thương trường xuất chúng.',
    logic_conditions: {
      required_stars: ['Thiên Cơ', 'Cự Môn'],
      positions: ['Đồng cung'],
      required_palaces: ['Mão', 'Dậu'],
      formula_text: 'Thiên Cơ và Cự Môn đồng cung đắc địa tại Mão hoặc Dậu (đặc biệt tốt nếu có thêm Hóa Lộc hoặc Lộc Tồn).'
    },
    interpretations: [
      { context: 'Cự Cơ tại Mão Dậu đắc Lộc', content: 'Khởi nghiệp từ hai bàn tay trắng, dùng trí óc và tài ăn nói để làm giàu. Rất bén nhạy với cơ hội kinh doanh, có thể thành đại phú.', tags: ['kinh_doanh', 'tu_luc', 'tai_chinh'] },
      { context: 'Ngộ Sát tinh', content: 'Dễ vướng vào kiện tụng thương mại, tranh chấp lợi ích.', tags: ['tranh_chap', 'thuong_truong'] }
    ],
    tags: ['kinh_doanh', 'tu_luc', 'thuong_truong', 'cat_cach']
  },
  {
    name: 'Thủy Trừng Quế Ngạc',
    type: 'cat_cach',
    description: 'Nước trong thấy cành quế. Người thanh tao, hiền lương, dung mạo đẹp, dễ nổi tiếng về học thuật, nghệ thuật hoặc làm quan thanh liêm.',
    logic_conditions: {
      required_stars: ['Thiên Đồng', 'Thái Âm'],
      positions: ['Đồng cung'],
      required_palaces: ['Tý'],
      formula_text: 'Thiên Đồng và Thái Âm đồng cung đắc địa tại cung Tý.'
    },
    interpretations: [
      { context: 'Đồng Âm tại Tý', content: 'Cuộc đời thanh nhàn, bình an. Tốt chất thông minh tĩnh tại, dễ đạt danh tiếng nhờ học vấn, văn chương hoặc nghệ thuật.', tags: ['thanh_nhan', 'hoc_van', 'nghe_thuat'] }
    ],
    tags: ['thanh_nhan', 'hoc_van', 'nghe_thuat', 'cat_cach']
  },
  {
    name: 'Đồng Lương Tỵ Hợi',
    type: 'hung_bai_cach',
    description: 'Người tài hoa nhưng trôi nổi, bôn ba, lãng tử, tình duyên nhiều thay đổi, khó ổn định cơ nghiệp.',
    logic_conditions: {
      required_stars: ['Thiên Đồng', 'Thiên Lương'],
      positions: ['Đồng cung', 'Xung chiếu'],
      required_palaces: ['Tỵ', 'Hợi'],
      formula_text: 'Thiên Đồng và Thiên Lương hãm địa đồng cung hoặc xung chiếu tại Tỵ và Hợi.'
    },
    interpretations: [
      { context: 'Tại Tỵ hoặc Hợi', content: 'Tính cách thích bay nhảy, nay đây mai đó. Tình duyên lận đận, hay thay đổi chỗ ở và công việc, làm mưu sĩ thì giỏi nhưng làm chủ thì khó thành.', tags: ['bon_ba', 'lang_tu', 'thay_doi'] }
    ],
    tags: ['bon_ba', 'lang_tu', 'thay_doi', 'hung_bai_cach']
  },
  {
    name: 'Mệnh VCD Đắc Tam Không',
    type: 'dac_biet_cach',
    description: 'Cách cục hoạnh phát bất ngờ, khôn ngoan, nhạy bén, từ "không" làm ra "có". Nhưng phú quý thường không bền vững lâu dài.',
    logic_conditions: {
      required_stars: ['Tuần Không', 'Triệt Không', 'Thiên Không', 'Địa Không'],
      positions: ['Đồng cung', 'Hội chiếu'],
      formula_text: 'Mệnh Vô Chính Diệu hội đủ 3 trong 4 sao Không: Tuần Không, Triệt Không, Thiên Không, Địa Không.'
    },
    interpretations: [
      { context: 'Hội đủ 3 sao Không', content: 'Người cực kỳ thông minh, nhạy bén, giỏi nắm bắt thời cơ. Có khả năng dựng cơ đồ vĩ đại từ tay trắng một cách bất ngờ, bạo phát bạo tàn.', tags: ['hoach_phat', 'tu_tay_trang', 'thong_minh'] }
    ],
    tags: ['hoach_phat', 'tu_tay_trang', 'bat_ngo', 'dac_biet_cach']
  }
];

async function seedCombinations() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');
  console.log(`\n📌 Seeding ${combinations.length} cách cục vào collection: combinations...`);

  let inserted = 0, updated = 0;
  for (const combo of combinations) {
    const result = await Combination.findOneAndUpdate(
      { name: combo.name },
      combo,
      { upsert: true, returnDocument: 'after' }
    );
    const isNew = result.createdAt?.getTime() === result.updatedAt?.getTime();
    if (isNew) inserted++; else updated++;
  }

  console.log(`\n🎉 Seed hoàn tất:`);
  console.log(`   - ${inserted} cách cục mới`);
  console.log(`   - ${updated} cách cục cập nhật`);

  // Thống kê theo loại
  const stats = await Combination.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
  console.log('\n📊 Phân bổ:');
  stats.forEach(s => console.log(`   - ${s._id}: ${s.count} cách cục`));

  await mongoose.disconnect();
  console.log('\n👋 Disconnected');
}

seedCombinations().catch(err => {
  console.error('❌ Seed combinations failed:', err);
  process.exit(1);
});
