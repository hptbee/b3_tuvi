/**
 * Seed script: Đẩy dữ liệu gốc (Stars & Palaces) lên MongoDB.
 * Sử dụng cho Architecture: 6-collections.
 * Chạy: node src/scripts/seed.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Star from '../models/Star.js';
import Palace from '../models/Palace.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/';

// ============================================================
// DỮ LIỆU CUNG (PALACE)
// perPalace chứa: { short, description }
// ============================================================
const palaceData = [
  {
    name: 'MỆNH', type: 'palace',
    perPalace: {
      short: 'Cung Mệnh',
      description: 'Cung Mệnh là cung quan trọng nhất trong lá số Tử Vi, là cơ sở để xem xét bản mệnh, tính cách, tướng mạo, cũng như mức độ phú quý, bần tiện, thọ yểu của đương số.'
    }
  },
  {
    name: 'PHỤ MẪU', type: 'palace',
    perPalace: {
      short: 'Cung Phụ Mẫu',
      description: 'Xem về cha mẹ, sự thọ yểu của cha mẹ, sự hòa hợp hay xung khắc giữa đương số và cha mẹ.'
    }
  },
  {
    name: 'PHÚC ĐỨC', type: 'palace',
    perPalace: {
      short: 'Cung Phúc Đức',
      description: 'Xem về phúc phận, thọ mạng, họ hàng nội ngoại, sự phù hộ của tổ tiên. Đây là cung ảnh hưởng đến toàn bộ lá số.'
    }
  },
  {
    name: 'ĐIỀN TRẠCH', type: 'palace',
    perPalace: {
      short: 'Cung Điền Trạch',
      description: 'Xem về nhà cửa, đất đai, bất động sản, sự kế thừa sản nghiệp và tình trạng nơi ở.'
    }
  },
  {
    name: 'QUAN LỘC', type: 'palace',
    perPalace: {
      short: 'Cung Quan Lộc',
      description: 'Xem về công danh, sự nghiệp, học hành, thi cử, bằng cấp, nghề nghiệp phù hợp và uy quyền trong xã hội.'
    }
  },
  {
    name: 'NÔ BỘC', type: 'palace',
    perPalace: {
      short: 'Cung Nô Bộc',
      description: 'Xem về bạn bè, đồng nghiệp, người giúp việc, cấp dưới, những người giao tiếp ngoài xã hội. Sự giúp đỡ hay phản trắc của họ.'
    }
  },
  {
    name: 'THIÊN DI', type: 'palace',
    perPalace: {
      short: 'Cung Thiên Di',
      description: 'Xem về môi trường xã hội, khả năng giao tiếp, những điều gặp phải khi rời quê hương đi làm ăn xa hoặc xuất ngoại.'
    }
  },
  {
    name: 'TẬT ÁCH', type: 'palace',
    perPalace: {
      short: 'Cung Tật Ách',
      description: 'Xem về tình trạng sức khỏe, bệnh tật, cũng như những tai ương, ách nạn có thể gặp phải trong đời.'
    }
  },
  {
    name: 'TÀI BẠCH', type: 'palace',
    perPalace: {
      short: 'Cung Tài Bạch',
      description: 'Xem về năng lực kiếm tiền, khả năng giữ tiền, nguồn tài chính, phương thức làm giàu và mức độ giàu nghèo.'
    }
  },
  {
    name: 'TỬ TỨC', type: 'palace',
    perPalace: {
      short: 'Cung Tử Tức',
      description: 'Xem về con cái, số lượng con, giới tính (nam nữ), sự hiếu thuận, thành đạt của con cái, và quan hệ giữa đương số với con cái.'
    }
  },
  {
    name: 'PHU THÊ', type: 'palace',
    perPalace: {
      short: 'Cung Phu Thê',
      description: 'Xem về tính cách, đạo đức, xuất thân của người hôn phối, cũng như hạnh phúc gia đình, sự viên mãn hay gãy đổ trong hôn nhân.'
    }
  },
  {
    name: 'HUYNH ĐỆ', type: 'palace',
    perPalace: {
      short: 'Cung Huynh Đệ',
      description: 'Xem về anh chị em ruột thịt, số lượng anh chị em, sự hòa thuận, giúp đỡ hay xung khắc lẫn nhau.'
    }
  },
  {
    name: 'THÂN', type: 'palace',
    perPalace: {
      short: 'Cung Thân',
      description: 'Cung Thân là cung chỉ hậu vận (thường sau 30 tuổi), đánh giá những gì đương số đạt được thông qua nỗ lực bản thân. Thân cư cung nào thì cung đó có ý nghĩa đặc biệt quan trọng trong nửa đời sau.'
    }
  }
];

// ============================================================
// DỮ LIỆU SAO (STAR)
// perPalace chứa: { Mệnh, Quan Lộc, ..., default }
// ============================================================
const starData = [
  {
    name: 'Tử Vi', type: 'star',
    perPalace: {
      Mệnh: 'Tử Vi thủ Mệnh là người có vẻ mặt hiền hòa, đoan chính, tính tình trung hậu, nghiêm trang. Có khả năng lãnh đạo, uy quyền và quý hiển.',
      'Phụ Mẫu': 'Cha mẹ có uy quyền, có danh chức. Trong gia đình cha mẹ là người nghiêm khắc nhưng thương con.',
      'Phúc Đức': 'Được hưởng phúc thọ, họ hàng có người làm quan, có địa vị trong xã hội.',
      'Điền Trạch': 'Nhà cửa cao rộng, có của chìm, điền sản dồi dào, thường thừa tự tài sản do tổ tiên để lại.',
      'Quan Lộc': 'Công danh hiển đạt, thường làm người đứng đầu, tài lãnh đạo bẩm sinh.',
      'Nô Bộc': 'Bạn bè, người dưới tay là người có năng lực, tuy nhiên đôi khi lấn át mình.',
      'Thiên Di': 'Ra ngoài được quý nhân trọng vọng, thích giao thiệp với người quyền quý.',
      'Tật Ách': 'Ít bệnh tật, nếu có cũng dễ gặp thầy gặp thuốc cứu chữa (Tử Vi có tính giải ách).',
      'Tài Bạch': 'Mưu cầu tiền bạc dễ dàng, tài khí dồi dào, có khả năng quản lý tài chính tốt.',
      'Tử Tức': 'Con cái hiếu thảo, giỏi giang, có chí làm ăn.',
      'Phu Thê': 'Vợ chồng có người làm quyền chức, tính tình có chút gia trưởng hoặc hay quán xuyến gia đình.',
      'Huynh Đệ': 'Anh em khá giả, có danh giá.',
      default: 'Tử Vi là sao Đế Toà, tượng trưng cho uy quyền, cao quý, phúc lộc và tuổi thọ. Tính chất hóa giải hung ách rất tốt.'
    }
  },
  {
    name: 'Thiên Cơ', type: 'star',
    perPalace: {
      Mệnh: 'Thiên Cơ thủ Mệnh là người mưu trí, khéo léo, đầu óc nhanh nhẹn, tính tình nhân từ. Làm việc có kế hoạch, nhưng hay suy nghĩ nhiều.',
      'Phu Thê': 'Người hôn phối thường khéo léo, có tài lẻ, tuy nhiên tình cảm đôi khi hay thay đổi do tính biến động của Cự Cơ.',
      'Quan Lộc': 'Phù hợp với các ngành nghề cần đầu óc tính toán, mưu lược, tham mưu, giáo dục, hoặc công việc văn phòng.',
      default: 'Thiên Cơ là sao Thiện, chủ về huynh đệ, trí lực, mưu kế, sự khéo léo và tính hiền lành.'
    }
  },
  {
    name: 'Thái Dương', type: 'star',
    perPalace: {
      Mệnh: 'Thái Dương là mặt trời. Người có Thái Dương thủ mệnh thường cương trực, nhân ái, có tính tự trọng cao, bộc trực.',
      'Quan Lộc': 'Quan Lộc rực rỡ, thích hợp với các việc hoạt động xã hội, chính trị, năng động. Dễ đạt được vị trí cao.',
      'Tài Bạch': 'Kiếm tiền chân chính, quang minh chính đại. Ưa tiêu xài phóng khoáng.',
      default: 'Thái Dương thuộc Hỏa, chủ về sự cao quý, quyền uy, nam giới (cha, chồng, con trai), tính quang minh, nóng nảy.'
    }
  },
  {
    name: 'Thái Âm', type: 'star',
    perPalace: {
      Mệnh: 'Thái Âm là mặt trăng. Người có Thái Âm thì tính nhu hòa, lịch thiệp, yêu cái đẹp, lãng mạn, thiên về cảm xúc.',
      'Điền Trạch': 'Thái Âm là chủ Điền Trạch, đóng ở đây rất tốt, nhà cửa đẹp đẽ, điền sản dồi dào.',
      'Tài Bạch': 'Sao Thái Âm cũng là sao Tài Tinh, giỏi tích lũy, tiền bạc nhiều, thường có duyên với làm giàu.',
      default: 'Thái Âm thuộc Thủy, chủ về sự phú túc, nữ giới (mẹ, vợ, con gái), điền sản, tiền bạc, êm dịu.'
    }
  },
  {
    name: 'Vũ Khúc', type: 'star',
    perPalace: {
      Mệnh: 'Vũ Khúc là sao Tài Tinh, cương nghị, quả quyết, có đầu óc kinh doanh nhưng đôi khi cô độc.',
      'Tài Bạch': 'Chủ đứng đầu về tài lộc, kiếm tiền giỏi, nhiều nguồn thu nhập, nhưng chi tiêu cũng quyết đoán, dám làm dám chịu.',
      default: 'Vũ Khúc thuộc Kim, là Tài tinh và Cô tinh. Trí dũng song toàn, giỏi kinh doanh làm ăn nhưng hay cô độc, khắc lục thân.'
    }
  },
  {
    name: 'Thiên Đồng', type: 'star',
    perPalace: {
      Mệnh: 'Thiên Đồng là Phúc Tinh, tính tình ôn hòa, trẻ con, thích hưởng thụ, vui vẻ, có thiên lộc.',
      'Phúc Đức': 'Được hưởng phúc lộc tự nhiên, họ hàng yên ấm, tuổi thọ cao.',
      default: 'Thiên Đồng thuộc Thủy, chủ về Phúc đức, sự diên thọ, tính tình trẻ trung, ôn hòa, hay thay đổi.'
    }
  },
  {
    name: 'Thiên Phủ', type: 'star',
    perPalace: {
      Mệnh: 'Thiên Phủ là Lệnh Tinh, Kho Khố. Người có Thiên Phủ ôn hòa, điềm đạm, có tài quản lý, cầm chịch, thích giúp đỡ người khác.',
      'Tài Bạch': 'Như cái kho đầy tiền bạc, giữ tiền tốt, quản lý tài chính giỏi.',
      default: 'Thiên Phủ thuộc Thổ, là Lộc khố (kho tiền), chủ về sự giàu có, ruộng đất, điền sản, tính tình cẩn trọng bao dung.'
    }
  },
  {
    name: 'Liêm Trinh', type: 'star',
    perPalace: {
      Mệnh: 'Liêm Trinh là Đào Hoa Tinh, Tù Tinh. Tính nóng nảy nhưng thẳng thắn, làm việc có nguyên tắc, nghiêm túc nhưng cũng lãng mạn ngầm.',
      'Quan Lộc': 'Rất hợp làm các công việc đòi hỏi kỷ luật, quân đội, công an hoặc công việc liên quan đến nghệ thuật, sáng tạo.',
      default: 'Liêm Trinh thuộc Hỏa, chủ về mưu lược, đào hoa, kiện tụng. Lúc tốt thì thanh liêm, mưu trí; lúc xấu thì hình ngục, họa hại.'
    }
  },
  {
    name: 'Tham Lang', type: 'star',
    perPalace: {
      Mệnh: 'Tham Lang là Đại Đào Hoa, chủ về vật dục, tửu sắc, nhưng cũng giao thiệp rộng, thông minh, tài nghệ đa đoan.',
      default: 'Tham Lang thuộc Mộc (Thủy), chủ về phúc họa, đào hoa, vật dục. Tính cách hay thay đổi, lanh lẹ, nhiều tham vọng.'
    }
  },
  {
    name: 'Cự Môn', type: 'star',
    perPalace: {
      Mệnh: 'Cự Môn là Ám Tinh, chủ thị phi miệng tiếng nhưng lại có tài ăn nói, biện luận sắc sảo, trí tuệ sâu sắc.',
      default: 'Cự Môn thuộc Thủy, chủ về ngôn ngữ, thị phi, sự khó hiểu, ám muội nhưng cũng là sao trí tuệ, phân tích nhạy bén.'
    }
  },
  {
    name: 'Thiên Tướng', type: 'star',
    perPalace: {
      Mệnh: 'Thiên Tướng là Ấn Tinh. Tính tình nhân từ, trắc ẩn, hào hiệp, thích làm việc thiện, ăn mặc chải chuốt.',
      default: 'Thiên Tướng thuộc Thủy, chủ về chức vị, áo gấm, sự trung hậu. Thích giúp đỡ người khác, có phẩm chất của một người phụ tá đắc lực.'
    }
  },
  {
    name: 'Thiên Lương', type: 'star',
    perPalace: {
      Mệnh: 'Thiên Lương là Ấm Tinh, Thanh Tinh. Người có Thiên Lương tính tình hiền lành, từ bi, hay bao bọc người khác, phong thái người lớn tuổi.',
      default: 'Thiên Lương thuộc Thổ, chủ về sự thọ, sự bảo bọc, giải tai ách. Có duyên với y lý, tôn giáo và sư phạm.'
    }
  },
  {
    name: 'Thất Sát', type: 'star',
    perPalace: {
      Mệnh: 'Thất Sát là Tướng Tinh, chủ uy quyền. Tính cách mạnh mẽ, cương quyết, có gan làm giàu, thích xông pha, không sợ hiểm nguy.',
      default: 'Thất Sát thuộc Kim, chủ về uy quyền, sát phạt, sự thành bại bất ngờ. Cương trường, dũng mãnh nhưng gặp nhiều chông gai.'
    }
  },
  {
    name: 'Phá Quân', type: 'star',
    perPalace: {
      Mệnh: 'Phá Quân là Hao Tinh, chủ về sự phá cũ lập mới, phá hoại để xây dựng. Tính tình xốc nổi, liều lĩnh, ưa mạo hiểm.',
      default: 'Phá Quân thuộc Thủy, chủ về sự tiên phong, hao tán, phu thê. Dám nghĩ dám làm, thích sự đổi mới, mang tính cách mạng.'
    }
  },
  {
    name: 'Lộc Tồn', type: 'star',
    perPalace: {
      Mệnh: 'Lộc Tồn thủ Mệnh là người kín đáo, biết giữ gìn của cải, cẩn thận. Thường có tuổi thọ cao và không lo thiếu tiền.',
      default: 'Lộc Tồn thuộc Thổ, chủ về sự phú quý, thọ, cẩn trọng, tích lũy. Thường được ban lộc do cơ duyên.'
    }
  },
  {
    name: 'Hóa Lộc', type: 'star',
    perPalace: {
      default: 'Hóa Lộc là sự sinh sôi, tiền bạc vượng phát, vui vẻ, tận hưởng. Ở cung nào thì mang lại tài lộc cho cung đó.'
    }
  },
  {
    name: 'Hóa Quyền', type: 'star',
    perPalace: {
      default: 'Hóa Quyền là sự lấn lướt, cố gắng vươn lên, quyền lực, uy thế. Ở cung nào thì có quyền quyết định, kiểm soát ở cung đó.'
    }
  },
  {
    name: 'Hóa Khoa', type: 'star',
    perPalace: {
      default: 'Hóa Khoa là sự thanh danh, khoa bảng, thanh tao, khả năng giải tai ương (Đệ nhất giải thần). Mang lại danh tiếng và sự cứu giải.'
    }
  },
  {
    name: 'Hóa Kỵ', type: 'star',
    perPalace: {
      default: 'Hóa Kỵ là sự trắc trở, đố kỵ, thị phi, rắc rối, ám muội. Đóng ở cung nào thì gây sóng gió, buồn phiền ở cung đó.'
    }
  }
];

// ============================================================
// XỬ LÝ SEED DỮ LIỆU
// ============================================================
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');

  // 1. Seed Palaces
  console.log('📌 Seeding Palaces...');
  for (const p of palaceData) {
    const palaceDoc = {
      palace_name: p.name,
      short_name: p.perPalace.short,
      core_meaning: p.perPalace.description
    };
    await Palace.findOneAndUpdate({ palace_name: palaceDoc.palace_name }, palaceDoc, { upsert: true });
  }

  // 2. Seed Stars
  console.log('📌 Seeding Stars...');
  for (const s of starData) {
    const starDoc = {
      name: s.name,
      basic_meaning: s.perPalace.default || '',
      palace_meanings: new Map(Object.entries(s.perPalace))
    };
    await Star.findOneAndUpdate({ name: s.name }, starDoc, { upsert: true });
  }

  const pCount = await Palace.countDocuments();
  const sCount = await Star.countDocuments();
  
  console.log(`🌱 Seed complete: ${pCount} Palaces, ${sCount} Stars.`);
  await mongoose.disconnect();
  console.log('👋 Disconnected');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
