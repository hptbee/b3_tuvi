const PHRASES = [
    ['坐命', 'palace_menh'],
    ['命宮', 'palace_menh'],
    ['在卯位', 'branch_mao'],
    ['太陽星、天梁星同宮', 'star_duong_luong_same'],
    ['文昌', 'star_xuong'],
    ['化祿或祿存', 'star_loc'],
    ['無煞忌', 'avoid_sat_khong_kiep'],
    ['天魁、天鉞', 'strengthened_by_loc_qui'],
    ['子位或午位', 'branch_ty_ngo'],
    ['巨門星', 'star_cu_host'],
    ['祿、權或祿存', 'strengthened_by_loc_quyen'],
    ['化祿、化權、化科', 'star_hoa_loc_quyen_khoa'],
    ['廟旺', 'bright'],
    ['地空或地劫夾命宮', 'star_khong_kiep_flank'],
    ['祿存', 'star_loc_ton_host'],
    ['擎羊、陀羅夾', 'star_kinh_da_flank'],
    ['卯位或酉位', 'branch_mao_dau'],
    ['天機星、巨門星同宮', 'star_co_cu_same'],
    ['化科', 'star_hoa_khoa_host'],
    ['化權', 'star_hoa_quyen_aspect'],
    ['貪狼星', 'star_tham_host'],
    ['同宮有火星', 'star_hoa_same'],
    ['同宮有鈴星', 'star_linh_same'],
    ['命宮無祿星坐守', 'star_loc_not_host'],
    ['三合宮', 'star_loc_tam_hop'],
    ['寅位或申位', 'branch_dan_than'],
    ['廉貞星坐命', 'star_liem_host'],
    ['對宮貪狼星', 'star_tham_opposite'],
    ['辰或戌', 'branch_thin_tuat'],
    ['武曲星獨坐', 'star_vu_host'],
    ['鈴星、陀羅星、文昌星', 'star_linh_da_xuong'],
    ['各門派的定義皆不盡相同', 'school_dependent'],
    ['天相是否會化忌', 'star_tuong_hoa_ky'],
    ['地劫、地空', 'star_khong_kiep_host'],
    ['巳位或亥位', 'branch_ty_hoi'],
    ['化忌', 'star_hoa_ky'],
    ['在寅位', 'branch_dan'],
    ['陀羅同宮', 'star_da_same'],
    ['天魁星、天鉞星', 'star_khoi_viet_aspect'],
    ['文昌、文曲', 'star_xuong_khuc_aspect'],
    ['無煞忌', 'avoid_sat'],
    ['天梁星', 'star_luong_host']
];

export function sprint9cObligationIds(span, allowed) {
    const allow = new Set(allowed || []);
    const text = typeof span === 'string' ? span : '';
    const ids = [];
    for (const [phrase, id] of PHRASES) {
        if (allow.has(id) && text.includes(phrase) && !ids.includes(id)) ids.push(id);
    }
    return ids.sort();
}
