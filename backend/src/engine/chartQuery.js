import { branchIndexRelations, relatedBranchIds } from './palaceRelation.js';

function palaceMap(chart) {
    const map = new Map();
    (chart?.palaces || []).forEach((palace) => {
        map.set(String(palace.id), palace);
        map.set(String(palace.branchId), palace);
    });
    return map;
}

export function getPalaceAtBranch(chart, branchId) {
    return palaceMap(chart).get(String(branchId)) || null;
}

export function getPalaceByFunction(chart, functionId) {
    if (functionId === 'than') {
        return (chart?.palaces || []).find((palace) => palace.isThan) || null;
    }
    return (chart?.palaces || []).find((palace) => palace.functionId === functionId) || null;
}

export function getSamePalaceStars(chart, palaceId) {
    return getPalaceAtBranch(chart, palaceId)?.stars || [];
}

export function getTamHopPalaces(chart, palaceId) {
    const rel = branchIndexRelations(palaceId);
    if (!rel) return [];
    return rel.tamHop.map((id) => getPalaceAtBranch(chart, id)).filter(Boolean);
}

export function getOppositePalace(chart, palaceId) {
    const rel = branchIndexRelations(palaceId);
    if (!rel) return null;
    return getPalaceAtBranch(chart, rel.xungChieu);
}

export function getAdjacentPalaces(chart, palaceId) {
    const rel = branchIndexRelations(palaceId);
    if (!rel) return [];
    return rel.giap.map((id) => getPalaceAtBranch(chart, id)).filter(Boolean);
}

export function getTamPhuongTuChinh(chart, palaceId) {
    const rel = branchIndexRelations(palaceId);
    if (!rel) return [];
    return rel.tamPhuongTuChinh.map((id) => getPalaceAtBranch(chart, id)).filter(Boolean);
}

export function findStarPlacements(chart, starId) {
    return chart?.byStarId?.[starId] || [];
}

export function hasStarAtPalace(chart, starId, palaceId) {
    return findStarPlacements(chart, starId).some((hit) => String(hit.palaceId) === String(palaceId));
}

export function getStarsByRelation(chart, palaceId, relationType) {
    const ids = relatedBranchIds(palaceId, relationType);
    if (!ids) return [];
    return ids.flatMap((id) => getPalaceAtBranch(chart, id)?.stars || []);
}

/**
 * Adapter đọc cho P1.2. Không thay matcher hiện tại.
 * relation: same | tam_hop | xung_chieu | giap | tam_phuong_tu_chinh | adjacent
 */
export function queryStars(chart, { starIds = [], palaceId, relation = 'same', brightness = null } = {}) {
    const stars = getStarsByRelation(chart, palaceId, relation);
    return stars.filter((star) => {
        if (starIds.length && !starIds.includes(star.starId)) return false;
        if (brightness && star.brightness !== brightness) return false;
        return true;
    });
}
