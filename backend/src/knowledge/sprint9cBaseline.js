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
    ['化權', 'star_hoa_quyen_aspect']
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
