import { normalizeChi } from './starNames.js';
import { resolveStar } from './starCatalog.js';
import { branchIndexRelations, nhiHop } from './palaceRelation.js';
import { getPalaceAtBranch, getPalaceByFunction, hasStarAtPalace } from './chartQuery.js';

/** Operators with a tested contract. Others return not_implemented. */
export const OPERATORS = [
    { id: 'and', executable: true, semantics: 'Fail closed: not_satisfied wins, then not_implemented, then unknown.' },
    { id: 'or', executable: true, semantics: 'satisfied wins. Otherwise unknown blocks success. All not_satisfied is not_satisfied.' },
    { id: 'not', executable: true, semantics: 'Flips satisfied and not_satisfied. unknown and not_implemented stay.' },
    { id: 'same_palace', executable: true, semantics: 'Every named star is in the target palace.' },
    { id: 'opposite', executable: true, semantics: 'Every named star is in the opposite palace.' },
    { id: 'tam_hop', executable: true, semantics: 'Every named star is in the target tam hợp, including the target palace.' },
    { id: 'tam_phuong_tu_chinh', executable: true, semantics: 'Every named star is in tam phương tứ chính.' },
    { id: 'nhi_hop', executable: true, semantics: 'The named star is in the lục hợp partner of the target. Tý is not Tỵ.' },
    { id: 'flank_split', executable: true, semantics: 'The two stars occupy opposite neighboring palaces, one on each side.' },
    { id: 'star_present', executable: true, semantics: 'The named star is in the target palace.' },
    { id: 'star_absent', executable: true, semantics: 'The named star is absent from the target palace or requested zone.' },
    { id: 'brightness', executable: true, semantics: 'The star at the target has one of the listed brightness marks. Missing brightness is unknown.' },
    { id: 'branch', executable: true, semantics: 'The target palace branch is in the allowed list after Tý/Tỵ normalization.' },
    { id: 'marker', executable: true, semantics: 'Tuần or Triệt is present or absent on the target palace.' },
    { id: 'tu_hoa', executable: true, semantics: 'Uses a recorded tứ hóa association. Missing association is unknown, not a pass.' }
];

const EXECUTABLE = new Set(OPERATORS.filter((item) => item.executable).map((item) => item.id));

function trace(status, op, detail = {}) {
    return { status, op, ...detail, children: detail.children || [] };
}

function starIdOf(name) {
    const resolved = resolveStar(name);
    return resolved.status === 'known' ? resolved.starId : null;
}

function palaceFor(chart, target) {
    const fn = target || 'menh';
    if (fn === 'menh') {
        return getPalaceByFunction(chart, 'menh') || getPalaceAtBranch(chart, chart?.menhPalaceId);
    }
    return getPalaceByFunction(chart, fn);
}

function zoneIds(palace, zone) {
    const rel = branchIndexRelations(palace.branchId);
    if (!rel) return null;
    if (!zone || zone === 'target') return [rel.branchId];
    if (zone === 'opposite') return [rel.xungChieu];
    if (zone === 'tam_hop') return [rel.branchId, ...rel.tamHop];
    if (zone === 'tam_phuong_tu_chinh') return [...rel.tamPhuongTuChinh];
    if (zone === 'nhi_hop') return [rel.nhiHop];
    if (zone === 'flanks') return [...rel.giap];
    return null;
}

function starsIn(chart, ids, starId) {
    return ids.some((id) => hasStarAtPalace(chart, starId, id));
}

function combine(op, children) {
    const statuses = children.map((child) => child.status);
    if (op === 'and') {
        if (statuses.includes('not_satisfied')) return 'not_satisfied';
        if (statuses.includes('not_implemented')) return 'not_implemented';
        if (statuses.includes('unknown')) return 'unknown';
        return 'satisfied';
    }
    if (statuses.includes('satisfied')) return 'satisfied';
    if (statuses.every((status) => status === 'not_satisfied')) return 'not_satisfied';
    if (statuses.includes('unknown')) return 'unknown';
    return 'not_implemented';
}

function scopeAllows(expr, scope) {
    if (expr.schoolId && scope.schoolId && expr.schoolId !== scope.schoolId) return false;
    if (expr.profile && scope.profile && expr.profile !== scope.profile) return false;
    return true;
}

/**
 * @returns {{ status: 'satisfied'|'not_satisfied'|'unknown'|'not_implemented', op: string, reason?: string, children: object[] }}
 */
export function evaluateCondition(expr, chart = {}, scope = {}) {
    if (!expr || typeof expr !== 'object' || typeof expr.op !== 'string' || expr.op.trim() === '') {
        return trace('not_implemented', 'malformed', { reason: 'malformed' });
    }
    if (!EXECUTABLE.has(expr.op)) {
        return trace('not_implemented', expr.op, { reason: 'unsupported_operator' });
    }
    if (!scopeAllows(expr, scope)) {
        return trace('not_implemented', expr.op, { reason: 'school_not_authorized' });
    }
    if (expr.op === 'and' || expr.op === 'or') {
        if (!Array.isArray(expr.items) || expr.items.length === 0) {
            return trace('not_implemented', expr.op, { reason: 'missing_operands' });
        }
        const children = expr.items.map((item) => evaluateCondition(item, chart, scope));
        return trace(combine(expr.op, children), expr.op, { children });
    }
    if (expr.op === 'not') {
        if (!expr.item || typeof expr.item !== 'object') {
            return trace('not_implemented', 'not', { reason: 'missing_operands' });
        }
        const child = evaluateCondition(expr.item, chart, scope);
        const status = child.status === 'satisfied'
            ? 'not_satisfied'
            : child.status === 'not_satisfied'
                ? 'satisfied'
                : child.status;
        return trace(status, 'not', { children: [child] });
    }
    return evaluateLeaf(expr, chart);
}

function evaluateLeaf(expr, chart) {
    if (!chart?.ok || !Array.isArray(chart.palaces)) {
        return trace('unknown', expr.op, { reason: 'missing_chart' });
    }
    const palace = palaceFor(chart, expr.target);
    if (!palace) return trace('unknown', expr.op, { reason: 'missing_palace' });
    if (expr.op === 'branch') {
        if (!Array.isArray(expr.branches) || expr.branches.length === 0) {
            return trace('not_implemented', 'branch', { reason: 'missing_operands' });
        }
        const allowed = expr.branches.map(normalizeChi);
        const hit = allowed.includes(normalizeChi(palace.branchName));
        return trace(hit ? 'satisfied' : 'not_satisfied', 'branch', { branch: palace.branchName });
    }
    if (expr.op === 'marker') {
        if (expr.marker !== 'tuan' && expr.marker !== 'triet') {
            return trace('not_implemented', 'marker', { reason: 'unsupported_marker' });
        }
        const present = expr.marker === 'tuan' ? Boolean(palace.isTuan) : Boolean(palace.isTriet);
        const want = expr.present !== false;
        return trace(present === want ? 'satisfied' : 'not_satisfied', 'marker', { marker: expr.marker });
    }
    if (expr.op === 'flank_split') {
        if (!Array.isArray(expr.stars) || expr.stars.length !== 2) {
            return trace('not_implemented', 'flank_split', { reason: 'missing_operands' });
        }
        const ids = expr.stars.map(starIdOf);
        if (ids.some((id) => !id)) return trace('not_implemented', 'flank_split', { reason: 'unknown_star' });
        const rel = branchIndexRelations(palace.branchId);
        const [left, right] = rel.giap;
        const orientations = [
            [ids[0], ids[1]],
            [ids[1], ids[0]]
        ];
        const hit = orientations.some(([onLeft, onRight]) => hasStarAtPalace(chart, onLeft, left) && hasStarAtPalace(chart, onRight, right));
        return trace(hit ? 'satisfied' : 'not_satisfied', 'flank_split');
    }
    if (expr.op === 'tu_hoa') {
        const hoaId = starIdOf(expr.hoa);
        const sourceId = starIdOf(expr.source);
        if (!hoaId || !sourceId) return trace('not_implemented', 'tu_hoa', { reason: 'unknown_star' });
        const hoa = (palace.stars || []).find((star) => star.starId === hoaId);
        if (!hoa) return trace('not_satisfied', 'tu_hoa', { reason: 'hoa_absent' });
        if (!hoa.association || hoa.association.type !== 'tu_hoa' || hoa.association.status !== 'same_palace') {
            return trace('unknown', 'tu_hoa', { reason: 'association_not_recorded' });
        }
        const linked = hoa.association.sourceStarId === sourceId;
        return trace(linked ? 'satisfied' : 'not_satisfied', 'tu_hoa');
    }
    const names = expr.op === 'brightness' || expr.op === 'star_present' || expr.op === 'star_absent' || expr.op === 'nhi_hop'
        ? [expr.star]
        : expr.stars;
    if (!Array.isArray(names) || names.length === 0 || names.some((name) => typeof name !== 'string')) {
        return trace('not_implemented', expr.op, { reason: 'missing_operands' });
    }
    const ids = names.map(starIdOf);
    if (ids.some((id) => !id)) return trace('not_implemented', expr.op, { reason: 'unknown_star' });
    if (expr.op === 'brightness') {
        const star = (palace.stars || []).find((item) => item.starId === ids[0]);
        if (!star) return trace('not_satisfied', 'brightness', { reason: 'star_absent' });
        if (!star.brightness) return trace('unknown', 'brightness', { reason: 'brightness_missing' });
        const marks = Array.isArray(expr.marks) ? expr.marks : [];
        if (marks.length === 0) return trace('not_implemented', 'brightness', { reason: 'missing_operands' });
        return trace(marks.includes(star.brightness) ? 'satisfied' : 'not_satisfied', 'brightness', { brightness: star.brightness });
    }
    if (expr.op === 'star_absent') {
        const zone = zoneIds(palace, expr.zone || 'target');
        if (!zone) return trace('not_implemented', 'star_absent', { reason: 'unsupported_zone' });
        const present = starsIn(chart, zone, ids[0]);
        return trace(present ? 'not_satisfied' : 'satisfied', 'star_absent');
    }
    if (expr.op === 'nhi_hop') {
        const partner = nhiHop(palace.branchId);
        if (!partner) return trace('unknown', 'nhi_hop', { reason: 'missing_partner' });
        return trace(hasStarAtPalace(chart, ids[0], partner) ? 'satisfied' : 'not_satisfied', 'nhi_hop');
    }
    const zoneName = expr.op === 'same_palace' || expr.op === 'star_present'
        ? 'target'
        : expr.op === 'opposite'
            ? 'opposite'
            : expr.op === 'tam_hop'
                ? 'tam_hop'
                : 'tam_phuong_tu_chinh';
    const zone = zoneIds(palace, zoneName);
    const hit = ids.every((id) => starsIn(chart, zone, id));
    return trace(hit ? 'satisfied' : 'not_satisfied', expr.op);
}
