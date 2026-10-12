/**
 * One-shot / rebuild: đọc seedCombinations.js cũ nếu JSON chưa có,
 * hoặc chuẩn hóa catalog hiện tại. Kết quả: src/data/combinations.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, 'seedCombinations.js');
const outPath = path.join(__dirname, '../data/combinations.json');

const HUNG_DISCLAIMER =
    'Luận giải mang tính tham khảo theo công thức cách cục, không phải kết luận về sức khỏe, hôn nhân, cha mẹ hay sinh tử.';

const MATCHING_OK = new Set([
    'Tử Phủ Đồng Cung',
    'Cự Nhật Đồng Cung',
    'Tả Hữu Đồng Cung',
    'Nhật Nguyệt Đồng Lâm',
    'Tham Vũ Đồng Hành',
    'Cơ Cự Đồng Lâm',
    'Tài Ấn Giao Trì',
    'Thủy Trừng Quế Ngạc',
    'Mệnh Vô Chính Diệu',
    'Phiếm Thủy Đào Hoa',
    'Kình Đà Giáp Mệnh',
    'Không Kiếp Giáp Mệnh',
    'Nhật Lệ Trung Thiên',
    'Thọ Tinh Nhập Miếu',
    'Anh Tinh Nhập Miếu'
]);

const TEXT_OVERRIDES = {
    'Nhật Nguyệt Tàng Huy': {
        description: 'Thái Dương và Thái Âm đều hãm địa. Đây là điều kiện kỹ thuật về độ sáng, không đủ để kết luận về cha mẹ, mắt hay bệnh tật.',
        interpretations: [{
            context: 'Cả hai hãm địa',
            content: 'Nhật và Nguyệt đều hãm: công danh dễ lận đận hơn khi hai sao sáng. Không suy ra tình trạng cha mẹ, hôn nhân hay sức khỏe chỉ từ tổ hợp này.',
            tags: ['ham_dia', 'cong_danh']
        }]
    },
    'Cự Hỏa Kình Dương': {
        description: 'Cự Môn gặp Hỏa Tinh và Kình Dương: lời nói và xung đột dễ gây rắc rối. Không phải kết luận về thương tật hay sinh tử.',
        interpretations: [{
            context: 'Hội tụ hung sát',
            content: 'Lời nói dễ gây họa miệng tiếng; cần thận trọng giao tiếp. Không đủ căn cứ để luận thương tật hay nguy hiểm tính mạng.',
            tags: ['loi_noi', 'xung_dot']
        }]
    },
    'Bán Không Chiết Xỉ': {
        description: 'Không Kiếp gặp chính tinh quyền lực tại Mệnh: sự nghiệp dễ đứt đoạn. Không luận sinh mệnh.',
        interpretations: [{
            context: 'Quyền lực ngộ Không Kiếp',
            content: 'Công danh dễ gãy giữa chừng khi Không Kiếp đóng Mệnh cùng sát tinh quyền lực. Không suy ra sinh mệnh.',
            tags: ['gay_do', 'cong_danh']
        }]
    },
    'Đế Ngộ Hung Đồ': {
        description: 'Tử Vi tại Mệnh gặp sát tinh: hoài bão dễ bị cản. Không luận tiểu nhân ám hại chắc chắn.',
        interpretations: [{
            context: 'Tử Vi ngộ sát tại Mệnh',
            content: 'Tử Vi tọa Mệnh kèm Kình Dương và Hỏa Tinh: chí hướng dễ bị trở ngại. Cần đối chiếu toàn cục, không kết luận thất bại chắc chắn.',
            tags: ['tro_ngai']
        }]
    },
    'Phong Lưu Thái Trượng': {
        description: 'Tham Lang Đà La đồng cung Dần/Thân: tình cảm dễ phức tạp. Không luận tai nạn hay suy bại tuyệt đối.',
        interpretations: [{
            context: 'Tham Lang + Đà La',
            content: 'Tình cảm dễ rối, cần tự chủ. Không đủ căn cứ để luận bị lừa, bại hoại hay nguy hiểm đến tính mạng.',
            tags: ['tinh_cam']
        }]
    },
    'Hoa Cái Cư Phu Thê': {
        description: 'Hóa Kỵ tọa Mệnh: quan hệ gần gũi dễ trắc trở. Tên cách cục cổ, logic engine chỉ bắt Hóa Kỵ tại Mệnh.',
        interpretations: [{
            context: 'Hóa Kỵ tại Mệnh',
            content: 'Hóa Kỵ tọa Mệnh: dễ có thị phi trong quan hệ. Không luận hôn nhân tan vỡ.',
            tags: ['thi_phi']
        }]
    }
};

const LOGIC_OVERRIDES = {
    'Mệnh Lý Phùng Không': { positions: ['Tọa thủ'] },
    'Nhật Nguyệt Tàng Huy': { positions: ['Toàn cục'], require_ham: ['Thái Dương', 'Thái Âm'] },
    'Bán Không Chiết Xỉ': { positions: ['Tọa thủ'] },
    'Đế Ngộ Hung Đồ': { positions: ['Tọa thủ'] },
    'Cự Phùng Tứ Sát': { positions: ['Tọa thủ', 'Giáp'] },
    'Lưỡng Trùng Thiên Mã': { positions: ['Tọa thủ', 'Hội chiếu'] },
    'Cát Xứ Tàng Hung': { positions: ['Tọa thủ'] },
    'Lộc Phùng Xung Phá': { positions: ['Tọa thủ', 'Xung chiếu'], required_stars: ['Lộc Tồn', 'Hóa Kỵ'] },
    'Nhật Nguyệt Tật Ách': { positions: ['Tọa thủ'] },
    'Hoa Cái Cư Phu Thê': { positions: ['Tọa thủ'] },
    'Nhật Nguyệt Tịnh Minh': { positions: ['Hội chiếu'] },
    'Thất Sát Triều Đẩu': { positions: ['Tọa thủ'] },
    'Hùng Tú Triều Viên': { positions: ['Tọa thủ'] },
    'Nguyệt Lãng Thiên Môn': { positions: ['Tọa thủ'] },
    'Nhật Chiếu Lôi Môn': { positions: ['Tọa thủ'] },
    'Thạch Trung Ẩn Ngọc': { positions: ['Tọa thủ'] },
    'Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn)': { positions: ['Tọa thủ'] },
    'Anh Tinh Nhập Miếu': { positions: ['Tọa thủ'] },
    'Thọ Tinh Nhập Miếu': { positions: ['Tọa thủ'] },
    'Nhật Lệ Trung Thiên': { positions: ['Tọa thủ'] },
    'Thiên Cơ Tỵ Hợi': { positions: ['Tọa thủ'] },
    'Phiếm Thủy Đào Hoa': { positions: ['Tọa thủ'] },
    'Chúng Thủy Triều Đông': { positions: ['Tọa thủ'] },
    'Lộ Bàng Mai Thi': { positions: ['Tọa thủ'] },
    'Mệnh Vô Chính Diệu': { require_no_major_at_menh: true, required_stars: [], positions: ['Tọa thủ'] },
    'Mệnh VCD Đắc Tam Không': {
        positions: ['Tọa thủ'],
        required_stars: ['Tuần Không', 'Địa Không'],
        require_no_major_at_menh: false
    },
    'Nhật Nguyệt Tật Ách': { positions: ['Tọa thủ'] }
};

function loadFromSeed() {
    const src = fs.readFileSync(seedPath, 'utf8');
    const start = src.indexOf('const combinations = [');
    const re = /\r?\n\];/g;
    let mm;
    let end = -1;
    while ((mm = re.exec(src))) {
        if (mm.index > start) {
            end = mm.index + mm[0].length - 1;
            break;
        }
    }
    const literal = src.slice(start + 'const combinations = '.length, end);
    return (0, eval)('(' + literal + ')');
}

function enhance(combo) {
    const lc = { ...(combo.logic_conditions || {}) };
    lc.required_stars = [...(lc.required_stars || [])];
    lc.excluded_stars = [...(lc.excluded_stars || [])];
    lc.required_palaces = (lc.required_palaces || []).map((p) => {
        if (p === 'Tý') return 'Tí';
        if (p === 'Tỵ') return 'Tị';
        return p;
    });
    lc.positions = [...(lc.positions || [])];
    Object.assign(lc, LOGIC_OVERRIDES[combo.name] || {});
    if (!lc.positions.length && !lc.require_no_major_at_menh) {
        lc.positions = ['Tọa thủ'];
    }

    const unsupported = (lc.positions || []).some((p) => p === 'Nhị hợp' || p === 'Ám hợp');
    const forceDisabled = combo.name === 'Nhật Nguyệt Tật Ách' || unsupported;
    let verification_status = 'provisional';
    if (forceDisabled) verification_status = 'disabled';
    else if (MATCHING_OK.has(combo.name)) verification_status = 'matching_ok';

    const text = TEXT_OVERRIDES[combo.name];
    return {
        name: combo.name,
        type: combo.type,
        description: text?.description || combo.description,
        logic_conditions: lc,
        interpretations: text?.interpretations || combo.interpretations || [],
        tags: combo.tags || [],
        verification_status,
        disclaimer: combo.type === 'hung_bai_cach' ? HUNG_DISCLAIMER : undefined,
        notes: unsupported
            ? 'Disabled: vị trí Nhị hợp/Ám hợp chưa được engine hỗ trợ.'
            : undefined
    };
}

const raw = loadFromSeed();
const catalog = raw.map(enhance);
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), 'utf8');
const counts = catalog.reduce((a, c) => {
    a[c.verification_status] = (a[c.verification_status] || 0) + 1;
    return a;
}, {});
console.log('wrote', catalog.length, counts);
