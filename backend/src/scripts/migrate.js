/**
 * Migration script: Chuyển đổi dữ liệu từ collection 'charts' cũ sang 'horoscopes'
 * và đồng bộ hóa Stars/Palaces từ meanings.
 * Chạy: node src/scripts/migrate.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Star from '../models/Star.js';
import Palace from '../models/Palace.js';
import Horoscope from '../models/Horoscope.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/';

// ============================================================
// DỮ LIỆU SAO — chuyển từ meanings collection sang stars
// ============================================================
const starsToSeed = [
  {
    name: 'Tử Vi', element: 'Thổ', group: 'chinh_tinh',
    basic_meaning: 'Tử Vi là sao Đế Toà, tượng trưng cho uy quyền, cao quý, phúc lộc và tuổi thọ. Tính chất hóa giải hung ách rất tốt.',
    palace_meanings: {
      Mệnh: 'Tử Vi thủ Mệnh là người có vẻ mặt hiền hòa, đoan chính, tính tình trung hậu, nghiêm trang. Có khả năng lãnh đạo, uy quyền và quý hiển.',
      'Phụ Mẫu': 'Cha mẹ có uy quyền, có danh chức. Trong gia đình cha mẹ là người nghiêm khắc nhưng thương con.',
      'Quan Lộc': 'Công danh hiển đạt, thường làm người đứng đầu, tài lãnh đạo bẩm sinh.',
      'Tài Bạch': 'Mưu cầu tiền bạc dễ dàng, tài khí dồi dào, có khả năng quản lý tài chính tốt.',
      'Tử Tức': 'Con cái hiếu thảo, giỏi giang, có chí làm ăn.',
      'Phu Thê': 'Vợ chồng có người làm quyền chức, tính tình có chút gia trưởng hoặc hay quán xuyến gia đình.',
      default: 'Tử Vi là sao Đế Toà, tượng trưng cho uy quyền, cao quý, phúc lộc và tuổi thọ. Tính chất hóa giải hung ách rất tốt.'
    },
    rules: [{ condition: 'Đắc Địa', description: 'Phúc lộc vẹn toàn, uy quyền hiển đạt.' }, { condition: 'Hãm Địa', description: 'Dễ tự cao tự đại, khó hòa hợp với người khác.' }]
  },
  {
    name: 'Thiên Cơ', element: 'Mộc', group: 'chinh_tinh',
    basic_meaning: 'Thiên Cơ là sao Thiện, chủ về huynh đệ, trí lực, mưu kế, sự khéo léo và tính hiền lành.',
    palace_meanings: {
      Mệnh: 'Thiên Cơ thủ Mệnh là người mưu trí, khéo léo, đầu óc nhanh nhẹn, tính tình nhân từ. Làm việc có kế hoạch, nhưng hay suy nghĩ nhiều.',
      'Quan Lộc': 'Phù hợp với các ngành nghề cần đầu óc tính toán, mưu lược, tham mưu, giáo dục.',
      'Phu Thê': 'Người hôn phối thường khéo léo, có tài lẻ, tuy nhiên tình cảm đôi khi hay thay đổi.',
      default: 'Thiên Cơ là sao Thiện, chủ về huynh đệ, trí lực, mưu kế, sự khéo léo và tính hiền lành.'
    }
  },
  {
    name: 'Thái Dương', element: 'Hỏa', group: 'chinh_tinh',
    basic_meaning: 'Thái Dương thuộc Hỏa, chủ về sự cao quý, quyền uy, nam giới (cha, chồng, con trai), tính quang minh, nóng nảy.',
    palace_meanings: {
      Mệnh: 'Thái Dương là mặt trời. Người có Thái Dương thủ mệnh thường cương trực, nhân ái, có tính tự trọng cao, bộc trực.',
      'Quan Lộc': 'Quan Lộc rực rỡ, thích hợp với các việc hoạt động xã hội, chính trị, năng động.',
      'Tài Bạch': 'Kiếm tiền chân chính, quang minh chính đại. Ưa tiêu xài phóng khoáng.',
      default: 'Thái Dương thuộc Hỏa, chủ về sự cao quý, quyền uy, nam giới (cha, chồng, con trai), tính quang minh, nóng nảy.'
    },
    rules: [{ condition: 'Đắc Địa', description: 'Miếu cung Dần-Mão-Thìn (ban ngày), huy hoàng rực rỡ.' }, { condition: 'Hãm Địa', description: 'Cung Thân-Dậu-Tuất (ban ngày), uy giảm sút, hay thất bại.' }]
  },
  {
    name: 'Thái Âm', element: 'Thủy', group: 'chinh_tinh',
    basic_meaning: 'Thái Âm thuộc Thủy, chủ về sự phú túc, nữ giới (mẹ, vợ, con gái), điền sản, tiền bạc, êm dịu.',
    palace_meanings: {
      Mệnh: 'Thái Âm là mặt trăng. Người có Thái Âm thì tính nhu hòa, lịch thiệp, yêu cái đẹp, lãng mạn, thiên về cảm xúc.',
      'Điền Trạch': 'Thái Âm là chủ Điền Trạch, đóng ở đây rất tốt, nhà cửa đẹp đẽ, điền sản dồi dào.',
      'Tài Bạch': 'Sao Thái Âm cũng là sao Tài Tinh, giỏi tích lũy, tiền bạc nhiều, thường có duyên với làm giàu.',
      default: 'Thái Âm thuộc Thủy, chủ về sự phú túc, nữ giới (mẹ, vợ, con gái), điền sản, tiền bạc, êm dịu.'
    }
  },
  {
    name: 'Vũ Khúc', element: 'Kim', group: 'chinh_tinh',
    basic_meaning: 'Vũ Khúc thuộc Kim, là Tài tinh và Cô tinh. Trí dũng song toàn, giỏi kinh doanh làm ăn nhưng hay cô độc, khắc lục thân.',
    palace_meanings: {
      Mệnh: 'Vũ Khúc là sao Tài Tinh, cương nghị, quả quyết, có đầu óc kinh doanh nhưng đôi khi cô độc.',
      'Tài Bạch': 'Chủ đứng đầu về tài lộc, kiếm tiền giỏi, nhiều nguồn thu nhập, nhưng chi tiêu cũng quyết đoán.',
      default: 'Vũ Khúc thuộc Kim, là Tài tinh và Cô tinh. Trí dũng song toàn, giỏi kinh doanh làm ăn nhưng hay cô độc, khắc lục thân.'
    }
  },
  {
    name: 'Thiên Đồng', element: 'Thủy', group: 'chinh_tinh',
    basic_meaning: 'Thiên Đồng thuộc Thủy, chủ về Phúc đức, sự diên thọ, tính tình trẻ trung, ôn hòa, hay thay đổi.',
    palace_meanings: {
      Mệnh: 'Thiên Đồng là Phúc Tinh, tính tình ôn hòa, trẻ con, thích hưởng thụ, vui vẻ, có thiên lộc.',
      'Phúc Đức': 'Được hưởng phúc lộc tự nhiên, họ hàng yên ấm, tuổi thọ cao.',
      default: 'Thiên Đồng thuộc Thủy, chủ về Phúc đức, sự diên thọ, tính tình trẻ trung, ôn hòa, hay thay đổi.'
    }
  },
  {
    name: 'Thiên Phủ', element: 'Thổ', group: 'chinh_tinh',
    basic_meaning: 'Thiên Phủ thuộc Thổ, là Lộc khố (kho tiền), chủ về sự giàu có, ruộng đất, điền sản, tính tình cẩn trọng bao dung.',
    palace_meanings: {
      Mệnh: 'Thiên Phủ là Lệnh Tinh, Kho Khố. Người có Thiên Phủ ôn hòa, điềm đạm, có tài quản lý, cầm chịch, thích giúp đỡ người khác.',
      'Tài Bạch': 'Như cái kho đầy tiền bạc, giữ tiền tốt, quản lý tài chính giỏi.',
      default: 'Thiên Phủ thuộc Thổ, là Lộc khố (kho tiền), chủ về sự giàu có, ruộng đất, điền sản, tính tình cẩn trọng bao dung.'
    }
  },
  {
    name: 'Liêm Trinh', element: 'Hỏa', group: 'chinh_tinh',
    basic_meaning: 'Liêm Trinh thuộc Hỏa, chủ về mưu lược, đào hoa, kiện tụng. Lúc tốt thì thanh liêm, mưu trí; lúc xấu thì hình ngục, họa hại.',
    palace_meanings: {
      Mệnh: 'Liêm Trinh là Đào Hoa Tinh, Tù Tinh. Tính nóng nảy nhưng thẳng thắn, làm việc có nguyên tắc, nghiêm túc nhưng cũng lãng mạn ngầm.',
      'Quan Lộc': 'Rất hợp làm các công việc đòi hỏi kỷ luật, quân đội, công an hoặc công việc liên quan đến nghệ thuật, sáng tạo.',
      default: 'Liêm Trinh thuộc Hỏa, chủ về mưu lược, đào hoa, kiện tụng. Lúc tốt thì thanh liêm, mưu trí; lúc xấu thì hình ngục, họa hại.'
    }
  },
  {
    name: 'Tham Lang', element: 'Mộc', group: 'chinh_tinh',
    basic_meaning: 'Tham Lang thuộc Mộc (Thủy), chủ về phúc họa, đào hoa, vật dục. Tính cách hay thay đổi, lanh lẹ, nhiều tham vọng.',
    palace_meanings: {
      Mệnh: 'Tham Lang là Đại Đào Hoa, chủ về vật dục, tửu sắc, nhưng cũng giao thiệp rộng, thông minh, tài nghệ đa đoan.',
      default: 'Tham Lang thuộc Mộc (Thủy), chủ về phúc họa, đào hoa, vật dục. Tính cách hay thay đổi, lanh lẹ, nhiều tham vọng.'
    }
  },
  {
    name: 'Cự Môn', element: 'Thủy', group: 'chinh_tinh',
    basic_meaning: 'Cự Môn thuộc Thủy, chủ về ngôn ngữ, thị phi, sự khó hiểu, ám muội nhưng cũng là sao trí tuệ, phân tích nhạy bén.',
    palace_meanings: {
      Mệnh: 'Cự Môn là Ám Tinh, chủ thị phi miệng tiếng nhưng lại có tài ăn nói, biện luận sắc sảo, trí tuệ sâu sắc.',
      default: 'Cự Môn thuộc Thủy, chủ về ngôn ngữ, thị phi, sự khó hiểu, ám muội nhưng cũng là sao trí tuệ, phân tích nhạy bén.'
    }
  },
  {
    name: 'Thiên Tướng', element: 'Thủy', group: 'chinh_tinh',
    basic_meaning: 'Thiên Tướng thuộc Thủy, chủ về chức vị, áo gấm, sự trung hậu. Thích giúp đỡ người khác, có phẩm chất của một người phụ tá đắc lực.',
    palace_meanings: {
      Mệnh: 'Thiên Tướng là Ấn Tinh. Tính tình nhân từ, trắc ẩn, hào hiệp, thích làm việc thiện, ăn mặc chải chuốt.',
      default: 'Thiên Tướng thuộc Thủy, chủ về chức vị, áo gấm, sự trung hậu. Thích giúp đỡ người khác, có phẩm chất của một người phụ tá đắc lực.'
    }
  },
  {
    name: 'Thiên Lương', element: 'Thổ', group: 'chinh_tinh',
    basic_meaning: 'Thiên Lương thuộc Thổ, chủ về sự thọ, sự bảo bọc, giải tai ách. Có duyên với y lý, tôn giáo và sư phạm.',
    palace_meanings: {
      Mệnh: 'Thiên Lương là Ấm Tinh, Thanh Tinh. Người có Thiên Lương tính tình hiền lành, từ bi, hay bao bọc người khác, phong thái người lớn tuổi.',
      default: 'Thiên Lương thuộc Thổ, chủ về sự thọ, sự bảo bọc, giải tai ách. Có duyên với y lý, tôn giáo và sư phạm.'
    }
  },
  {
    name: 'Thất Sát', element: 'Kim', group: 'chinh_tinh',
    basic_meaning: 'Thất Sát thuộc Kim, chủ về uy quyền, sát phạt, sự thành bại bất ngờ. Cương trường, dũng mãnh nhưng gặp nhiều chông gai.',
    palace_meanings: {
      Mệnh: 'Thất Sát là Tướng Tinh, chủ uy quyền. Tính cách mạnh mẽ, cương quyết, có gan làm giàu, thích xông pha, không sợ hiểm nguy.',
      default: 'Thất Sát thuộc Kim, chủ về uy quyền, sát phạt, sự thành bại bất ngờ. Cương trường, dũng mãnh nhưng gặp nhiều chông gai.'
    }
  },
  {
    name: 'Phá Quân', element: 'Thủy', group: 'chinh_tinh',
    basic_meaning: 'Phá Quân thuộc Thủy, chủ về sự tiên phong, hao tán, phu thê. Dám nghĩ dám làm, thích sự đổi mới, mang tính cách mạng.',
    palace_meanings: {
      Mệnh: 'Phá Quân là Hao Tinh, chủ về sự phá cũ lập mới, phá hoại để xây dựng. Tính tình xốc nổi, liều lĩnh, ưa mạo hiểm.',
      default: 'Phá Quân thuộc Thủy, chủ về sự tiên phong, hao tán, phu thê. Dám nghĩ dám làm, thích sự đổi mới, mang tính cách mạng.'
    }
  },
  // Phụ tinh
  {
    name: 'Lộc Tồn', element: 'Thổ', group: 'phu_tinh',
    basic_meaning: 'Lộc Tồn thuộc Thổ, chủ về sự phú quý, thọ, cẩn trọng, tích lũy. Thường được ban lộc do cơ duyên.',
    palace_meanings: {
      Mệnh: 'Lộc Tồn thủ Mệnh là người kín đáo, biết giữ gìn của cải, cẩn thận. Thường có tuổi thọ cao và không lo thiếu tiền.',
      default: 'Lộc Tồn thuộc Thổ, chủ về sự phú quý, thọ, cẩn trọng, tích lũy. Thường được ban lộc do cơ duyên.'
    }
  },
  { name: 'Hóa Lộc', element: '', group: 'hoa_tinh', basic_meaning: 'Hóa Lộc là sự sinh sôi, tiền bạc vượng phát, vui vẻ, tận hưởng. Ở cung nào thì mang lại tài lộc cho cung đó.', palace_meanings: { default: 'Hóa Lộc là sự sinh sôi, tiền bạc vượng phát, vui vẻ, tận hưởng. Ở cung nào thì mang lại tài lộc cho cung đó.' } },
  { name: 'Hóa Quyền', element: '', group: 'hoa_tinh', basic_meaning: 'Hóa Quyền là sự lấn lướt, cố gắng vươn lên, quyền lực, uy thế. Ở cung nào thì có quyền quyết định, kiểm soát ở cung đó.', palace_meanings: { default: 'Hóa Quyền là sự lấn lướt, cố gắng vươn lên, quyền lực, uy thế.' } },
  { name: 'Hóa Khoa', element: '', group: 'hoa_tinh', basic_meaning: 'Hóa Khoa là sự thanh danh, khoa bảng, thanh tao, khả năng giải tai ương (Đệ nhất giải thần).', palace_meanings: { default: 'Hóa Khoa là sự thanh danh, khoa bảng, khả năng giải tai ương (Đệ nhất giải thần). Mang lại danh tiếng và sự cứu giải.' } },
  { name: 'Hóa Kỵ', element: '', group: 'hoa_tinh', basic_meaning: 'Hóa Kỵ là sự trắc trở, đố kỵ, thị phi, rắc rối, ám muội. Đóng ở cung nào thì gây sóng gió, buồn phiền ở cung đó.', palace_meanings: { default: 'Hóa Kỵ là sự trắc trở, đố kỵ, thị phi, rắc rối, ám muội. Đóng ở cung nào thì gây sóng gió, buồn phiền ở cung đó.' } }
];

// ============================================================
// DỮ LIỆU CUNG — chuyển sang palaces collection
// ============================================================
const palacesToSeed = [
  { palace_name: 'MỆNH', short_name: 'Cung Mệnh', core_meaning: 'Cung Mệnh là cung quan trọng nhất trong lá số Tử Vi, là cơ sở để xem xét bản mệnh, tính cách, tướng mạo, cũng như mức độ phú quý, bần tiện, thọ yểu của đương số.', life_aspect: ['bản thân', 'tính cách', 'tướng mạo'], keywords: ['mệnh', 'bản mệnh', 'tính cách'] },
  { palace_name: 'PHỤ MẪU', short_name: 'Cung Phụ Mẫu', core_meaning: 'Xem về cha mẹ, sự thọ yểu của cha mẹ, sự hòa hợp hay xung khắc giữa đương số và cha mẹ.', life_aspect: ['gia đình'], keywords: ['cha mẹ', 'phụ mẫu'] },
  { palace_name: 'PHÚC ĐỨC', short_name: 'Cung Phúc Đức', core_meaning: 'Xem về phúc phận, thọ mạng, họ hàng nội ngoại, sự phù hộ của tổ tiên. Đây là cung ảnh hưởng đến toàn bộ lá số.', life_aspect: ['phúc phận', 'tổ tiên'], keywords: ['phúc đức', 'thọ mạng', 'tổ tiên'] },
  { palace_name: 'ĐIỀN TRẠCH', short_name: 'Cung Điền Trạch', core_meaning: 'Xem về nhà cửa, đất đai, bất động sản, sự kế thừa sản nghiệp và tình trạng nơi ở.', life_aspect: ['tài sản', 'nhà cửa'], keywords: ['điền trạch', 'nhà', 'đất'] },
  { palace_name: 'QUAN LỘC', short_name: 'Cung Quan Lộc', core_meaning: 'Xem về công danh, sự nghiệp, học hành, thi cử, bằng cấp, nghề nghiệp phù hợp và uy quyền trong xã hội.', life_aspect: ['sự nghiệp', 'học vấn'], keywords: ['quan lộc', 'sự nghiệp', 'công danh', 'học hành'] },
  { palace_name: 'NÔ BỘC', short_name: 'Cung Nô Bộc', core_meaning: 'Xem về bạn bè, đồng nghiệp, người giúp việc, cấp dưới, những người giao tiếp ngoài xã hội. Sự giúp đỡ hay phản trắc của họ.', life_aspect: ['xã hội', 'bạn bè'], keywords: ['nô bộc', 'bạn bè', 'đồng nghiệp'] },
  { palace_name: 'THIÊN DI', short_name: 'Cung Thiên Di', core_meaning: 'Xem về môi trường xã hội, khả năng giao tiếp, những điều gặp phải khi rời quê hương đi làm ăn xa hoặc xuất ngoại.', life_aspect: ['di chuyển', 'xã hội'], keywords: ['thiên di', 'xuất ngoại', 'di chuyển'] },
  { palace_name: 'TẬT ÁCH', short_name: 'Cung Tật Ách', core_meaning: 'Xem về tình trạng sức khỏe, bệnh tật, cũng như những tai ương, ách nạn có thể gặp phải trong đời.', life_aspect: ['sức khỏe', 'tai nạn'], keywords: ['tật ách', 'sức khỏe', 'bệnh tật'] },
  { palace_name: 'TÀI BẠCH', short_name: 'Cung Tài Bạch', core_meaning: 'Xem về năng lực kiếm tiền, khả năng giữ tiền, nguồn tài chính, phương thức làm giàu và mức độ giàu nghèo.', life_aspect: ['tài chính', 'tiền bạc'], keywords: ['tài bạch', 'tiền bạc', 'kiếm tiền', 'tài chính'] },
  { palace_name: 'TỬ TỨC', short_name: 'Cung Tử Tức', core_meaning: 'Xem về con cái, số lượng con, giới tính (nam nữ), sự hiếu thuận, thành đạt của con cái, và quan hệ giữa đương số với con cái.', life_aspect: ['con cái', 'gia đình'], keywords: ['tử tức', 'con cái'] },
  { palace_name: 'PHU THÊ', short_name: 'Cung Phu Thê', core_meaning: 'Xem về tính cách, đạo đức, xuất thân của người hôn phối, cũng như hạnh phúc gia đình, sự viên mãn hay gãy đổ trong hôn nhân.', life_aspect: ['hôn nhân', 'tình cảm'], keywords: ['phu thê', 'hôn nhân', 'vợ chồng', 'tình yêu'] },
  { palace_name: 'HUYNH ĐỆ', short_name: 'Cung Huynh Đệ', core_meaning: 'Xem về anh chị em ruột thịt, số lượng anh chị em, sự hòa thuận, giúp đỡ hay xung khắc lẫn nhau.', life_aspect: ['gia đình'], keywords: ['huynh đệ', 'anh em', 'chị em'] },
  { palace_name: 'THÂN', short_name: 'Cung Thân', core_meaning: 'Cung Thân là cung chỉ hậu vận (thường sau 30 tuổi), đánh giá những gì đương số đạt được thông qua nỗ lực bản thân.', life_aspect: ['hậu vận', 'bản thân'], keywords: ['thân', 'hậu vận', 'nỗ lực'] }
];

// ============================================================
// RUN MIGRATION
// ============================================================
async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');

  // 1. Seed Stars
  console.log('\n📌 Seeding stars collection...');
  for (const s of starsToSeed) {
    const doc = { ...s, palace_meanings: new Map(Object.entries(s.palace_meanings)) };
    await Star.findOneAndUpdate({ name: s.name }, doc, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   ✓ ${starsToSeed.length} stars upserted`);

  // 2. Seed Palaces
  console.log('📌 Seeding palaces collection...');
  for (const p of palacesToSeed) {
    await Palace.findOneAndUpdate({ palace_name: p.palace_name }, p, { upsert: true, returnDocument: 'after' });
  }
  console.log(`   ✓ ${palacesToSeed.length} palaces upserted`);

  // 3. Migrate charts → horoscopes
  console.log('📌 Migrating charts → horoscopes...');
  const db = mongoose.connection.db;
  const chartsCol = db.collection('charts');
  const count = await chartsCol.countDocuments();
  if (count > 0) {
    const oldCharts = await chartsCol.find({}).toArray();
    let migrated = 0;
    for (const c of oldCharts) {
      const exists = await Horoscope.findOne({ 'input_data.day': c.day, 'input_data.month': c.month, 'input_data.year': c.year, 'input_data.name': c.name });
      if (!exists) {
        await Horoscope.create({
          input_data: { name: c.name || '', day: c.day, month: c.month, year: c.year, hour: c.hour, gender: c.gender },
          lunar_data: c.chartData?.lunarInfo || {},
          full_chart: c.chartData?.tuviInfo || c.chartData || {}
        });
        migrated++;
      }
    }
    console.log(`   ✓ ${migrated} charts migrated to horoscopes (${count - migrated} already existed)`);
  } else {
    import fs from 'fs/promises';
    console.log('   ℹ️  No old charts to migrate');
  }

  console.log('\n🎉 Migration complete!');
  await mongoose.disconnect();
  console.log('👋 Disconnected');
}
let starsToSeed = [];
let palacesToSeed = [];
migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

// load JSON data files
try {
  const sRaw = await fs.readFile(new URL('../data/stars.json', import.meta.url), 'utf8');
  starsToSeed = JSON.parse(sRaw);
} catch (err) {
  console.error('Failed to load stars.json:', err);
  process.exit(1);
}
try {
  const pRaw = await fs.readFile(new URL('../data/palaces.json', import.meta.url), 'utf8');
  palacesToSeed = JSON.parse(pRaw);
} catch (err) {
  console.error('Failed to load palaces.json:', err);
  process.exit(1);
}
