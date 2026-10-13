import { branchIndexRelations, nhiHop as nhiHopBranch } from './palaceRelation.js';
import { getPalaceAtBranch, getPalaceByFunction, hasStarAtPalace } from './chartQuery.js';
import { normalizeChi } from './starNames.js';
import { resolveStar } from './starCatalog.js';

function starId(name) {
    const resolved = resolveStar(name);
    return resolved.status === 'known' ? resolved.starId : null;
}

export function samePalace(chart, palaceId, starNames) {
    return (starNames || []).every((name) => {
        const id = starId(name);
        return Boolean(id) && hasStarAtPalace(chart, id, palaceId);
    });
}

export function oppositePalace(branchId) {
    return branchIndexRelations(branchId)?.xungChieu ?? null;
}

export function tamHop(branchId) {
    const rel = branchIndexRelations(branchId);
    return rel ? [rel.branchId, ...rel.tamHop] : null;
}

export function tamPhuongTuChinh(branchId) {
    return branchIndexRelations(branchId)?.tamPhuongTuChinh?.slice() ?? null;
}

export function nhiHop(branchId) {
    return nhiHopBranch(branchId);
}

export function flankedBy(branchId) {
    return branchIndexRelations(branchId)?.giap?.slice() ?? null;
}

export function starAt(chart, starName, palaceId) {
    const id = starId(starName);
    return Boolean(id) && hasStarAtPalace(chart, id, palaceId);
}

export function containsAny(chart, palaceIds, starNames) {
    return (starNames || []).some((name) => (palaceIds || []).some((id) => starAt(chart, name, id)));
}

export function containsAll(chart, palaceIds, starNames) {
    return (starNames || []).every((name) => (palaceIds || []).some((id) => starAt(chart, name, id)));
}

export function noMajor(palace) {
    return !(palace?.stars || []).some((star) => star.list === 'major');
}

export function branchIn(name, allowed) {
    const normalized = normalizeChi(name);
    return (allowed || []).map(normalizeChi).includes(normalized);
}

export function targetPalace(chart, functionId = 'menh') {
    if (functionId === 'menh') {
        return getPalaceByFunction(chart, 'menh') || getPalaceAtBranch(chart, chart?.menhPalaceId);
    }
    return getPalaceByFunction(chart, functionId);
}

/** Profile id selects a formula. It does not change natal placement. */
export function sourceSchool(profileId) {
    return profileId || null;
}
