const PHRASES = [
    { phrase: 'Cung Mệnh hay Quan Lộc', conditionId: 'palace_menh_or_quan_loc' },
    { phrase: 'không có Chính diệu', conditionId: 'no_major_star' },
    { phrase: 'Lộc Tồn xung chiếu', conditionId: 'star_loc_ton_opposite' },
    { phrase: 'Mã giao trì', conditionId: 'star_ma' },
    { phrase: 'Mã thủ Mệnh', conditionId: 'star_ma_host' },
    { phrase: 'Sát tinh', conditionId: 'avoid_sat' },
    { phrase: 'Bại tinh', conditionId: 'avoid_bai' },
    { phrase: 'Khoa, Quyền, Lộc', conditionId: 'strengthened_by_khoa_quyen_loc' },
    { phrase: 'Dần, Thân', conditionId: 'branch_dan_than' },
    { phrase: 'Tử Phủ tọa thủ đồng cung', conditionId: 'star_tu_phu_same_palace' },
    { phrase: 'Cơ, Nguyệt, Đồng Lương', conditionId: 'star_co_nguyet_dong_luong' },
    { phrase: 'Nguyệt tọa thủ', conditionId: 'star_nguyet_toa_thu' },
    { phrase: 'Nhật tọa thủ', conditionId: 'star_nhat_toa_thu' },
    { phrase: 'Tứ Mộ', conditionId: 'branch_tu_mo' },
    { phrase: 'an tại Sửu, Mùi', conditionId: 'branch_suu_mui' },
    { phrase: 'Hợi, Tý', conditionId: 'branch_hoi_ty' },
    { phrase: 'Hợi, Tí', conditionId: 'branch_hoi_ty' },
    { phrase: 'an tại Ngọ', conditionId: 'branch_ngo' },
    { phrase: 'sáng sủa', conditionId: 'bright' },
    { phrase: 'Cự, Nhật', conditionId: 'star_cu_nhat_same_palace' },
    { phrase: 'Sát tọa thủ', conditionId: 'star_sat_toa_thu' },
    { phrase: 'Tham Vũ', conditionId: 'star_tham_vu_same_palace' },
    { phrase: 'Tham, Vũ', conditionId: 'star_tham_vu_same_palace' },
    { phrase: 'Phá xung', conditionId: 'star_pha_opposite' },
    { phrase: 'Cự tọa thủ', conditionId: 'star_cu_host' },
    { phrase: 'Tham tọa thủ', conditionId: 'star_tham_host' },
    { phrase: 'Kình đồng cung', conditionId: 'star_kinh_same_palace' },
    { phrase: 'Đà đồng cung', conditionId: 'star_da_same_palace' },
    { phrase: 'Lộc Tồn tọa thủ', conditionId: 'star_loc_ton_host' },
    { phrase: 'Hóa Lộc tọa thủ', conditionId: 'star_hoa_loc_host' },
    { phrase: 'nhị hợp', conditionId: 'star_nhi_hop' },
    { phrase: 'Khoa tọa thủ', conditionId: 'star_khoa_host' },
    { phrase: 'Tử sáng', conditionId: 'star_tu_bright_host' },
    { phrase: 'Phủ chiếu', conditionId: 'star_phu_opposite' },
    { phrase: 'Phủ sáng', conditionId: 'star_phu_bright_host' },
    { phrase: 'Tướng chiếu', conditionId: 'star_tuong_opposite' },
    { phrase: 'Tướng sáng', conditionId: 'star_tuong_bright_host' },
    { phrase: 'Tả, Hữu tọa thủ đồng cung', conditionId: 'star_ta_huu_same_palace' },
    { phrase: 'Nhật, Nguyệt', conditionId: 'star_nhat_nguyet' },
    { phrase: 'Kình tọa thủ', conditionId: 'star_kinh_host' },
    { phrase: 'Ấn tọa thủ', conditionId: 'star_an_host' },
    { phrase: 'Hình, Liêm', conditionId: 'star_hinh_liem_flank' },
    { phrase: 'Phụ - Bật', conditionId: 'star_phu_bat_opposite' },
    { phrase: 'Xương, Khúc, Khôi, Việt, Long', conditionId: 'star_xuong_khuc_khoi_viet_long' },
    { phrase: 'Phượng', conditionId: 'star_phuong' }
];

export function obligationIds(span, allowed) {
    const allow = new Set(allowed || []);
    const text = typeof span === 'string' ? span : '';
    const ids = [];
    const add = (id) => {
        if (allow.has(id) && !ids.includes(id)) ids.push(id);
    };
    if (text.includes('Cung Mệnh hay Quan Lộc')) add('palace_menh_or_quan_loc');
    else if (text.includes('Cung Mệnh')) add('palace_menh');
    if (text.includes('an tại Hợi') && !text.includes('Hợi, Tý') && !text.includes('Hợi, Tí')) add('branch_hoi');
    for (const item of PHRASES) {
        if (item.conditionId === 'palace_menh_or_quan_loc') continue;
        if (text.includes(item.phrase)) add(item.conditionId);
    }
    if (text.includes('Tuần') && text.includes('Triệt')) {
        if (allow.has('avoid_tuan_triet')) add('avoid_tuan_triet');
        else {
            add('avoid_tuan');
            add('avoid_triet');
        }
    }
    return ids.sort();
}

export function allowedIdsFromPrompt(prompt) {
    const block = String(prompt || '').split('Allowed condition ids:\n')[1]?.split('\n\n')[0] || '';
    return block.split('\n').map((line) => line.trim()).filter(Boolean);
}

export function anchorFromPrompt(prompt) {
    const line = String(prompt || '').split('\n').find((item) => item.includes('must include this anchor:'));
    if (!line) return null;
    return line.split('must include this anchor:')[1].replace(/^ /, '');
}

export function reviewBaseline({ span, prompt, editionId, schoolId, locator, sourceDigest, fallbackAnchors = [] }) {
    const allowed = allowedIdsFromPrompt(prompt);
    const anchor = anchorFromPrompt(prompt);
    return {
        sourceDigest,
        editionId,
        schoolId,
        locator,
        requiredConditions: obligationIds(span, allowed),
        requiredExceptions: [],
        requiredAnchors: anchor ? [anchor] : fallbackAnchors,
        allowedConditions: allowed
    };
}
