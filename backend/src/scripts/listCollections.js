import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Combination from '../models/Combination.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/';

const newCombos = [
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
  }
];

async function addNew() {
  await mongoose.connect(MONGO_URI);
  let added = 0;
  for (const combo of newCombos) {
    await Combination.findOneAndUpdate({ name: combo.name }, combo, { upsert: true, returnDocument: 'after' });
    added++;
  }
  const total = await Combination.countDocuments();
  console.log(`✅ Đã thêm ${added} cách cục mới. Tổng: ${total} cách cục.`);
  await mongoose.disconnect();
}

addNew().catch(console.error);
