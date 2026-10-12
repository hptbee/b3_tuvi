import { wrapIndex } from './starNames.js';
import { DIA_CHI } from './constants.js';

/**
 * Quan hệ địa chi của một cung. Chỉ số 1 = Tí … 12 = Hợi.
 * Tam hợp trả về đúng hai cung đối tác, không gồm cung gốc.
 * Nhị hợp và Ám hợp chưa có quy tắc đã chốt — không tính ở đây.
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
        tamPhuongTuChinh: [branch, forwardTam, backwardTam, opposite]
    };
}

export const RELATION_TYPES = [
    'same',
    'tam_hop',
    'xung_chieu',
    'giap',
    'tam_phuong_tu_chinh',
    'adjacent'
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
        default:
            return null;
    }
}
