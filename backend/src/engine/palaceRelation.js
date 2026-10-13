import { wrapIndex } from './starNames.js';
import { DIA_CHI } from './constants.js';

/** Lục hợp / nhị hợp: một cung đối tác. Tí–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tị–Thân, Ngọ–Mùi. */
const NHI_HOP = {
    1: 2,
    2: 1,
    3: 12,
    12: 3,
    4: 11,
    11: 4,
    5: 10,
    10: 5,
    6: 9,
    9: 6,
    7: 8,
    8: 7
};

export function nhiHop(branchId) {
    const branch = Number(branchId);
    if (!Number.isInteger(branch) || branch < 1 || branch > 12) return null;
    return NHI_HOP[branch];
}

/**
 * Quan hệ địa chi của một cung. Chỉ số 1 = Tí … 12 = Hợi.
 * Tam hợp trả về đúng hai cung đối tác, không gồm cung gốc.
 * Ám hợp chưa có quy tắc đã chốt — không tính ở đây.
 *
 * @param {number} branchId
 */
export function branchIndexRelations(branchId) {
    const branch = Number(branchId);
    if (!Number.isInteger(branch) || branch < 1 || branch > 12) return null;
    const forwardTam = wrapIndex(branch + 4);
    const backwardTam = wrapIndex(branch - 4);
    const opposite = wrapIndex(branch + 6);
    const backward = wrapIndex(branch - 1);
    const forward = wrapIndex(branch + 1);
    return {
        branchId: branch,
        branchName: DIA_CHI[branch],
        tamHop: [forwardTam, backwardTam],
        xungChieu: opposite,
        giap: [backward, forward],
        neighbors: { backward, forward },
        nhiHop: NHI_HOP[branch],
        tamPhuongTuChinh: [branch, forwardTam, backwardTam, opposite]
    };
}

export const RELATION_TYPES = [
    'same',
    'tam_hop',
    'xung_chieu',
    'giap',
    'tam_phuong_tu_chinh',
    'adjacent',
    'nhi_hop'
];

/** Chỉ số cung thuộc một quan hệ. `same` và `tam_phuong_tu_chinh` gồm cung gốc. */
export function relatedBranchIds(branchId, relationType) {
    const rel = branchIndexRelations(branchId);
    if (!rel) return null;
    switch (relationType) {
        case 'same':
            return [rel.branchId];
        case 'tam_hop':
            return [...rel.tamHop];
        case 'xung_chieu':
            return [rel.xungChieu];
        case 'giap':
        case 'adjacent':
            return [...rel.giap];
        case 'tam_phuong_tu_chinh':
            return [...rel.tamPhuongTuChinh];
        case 'nhi_hop':
            return [rel.nhiHop];
        default:
            return null;
    }
}
