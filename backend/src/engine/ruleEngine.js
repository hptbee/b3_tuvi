import { wrapIndex, normalizeChi } from './starNames.js';
import { resolveStar } from './starCatalog.js';
import { branchIndexRelations } from './palaceRelation.js';
import { getPalaceAtBranch, getPalaceByFunction, hasStarAtPalace } from './chartQuery.js';

function targetPalace(chart, rule) {
    if (!rule.target || rule.target === 'menh') {
        return getPalaceByFunction(chart, 'menh') || getPalaceAtBranch(chart, chart.menhPalaceId);
    }
    if (/^\d+$/.test(String(rule.target))) return getPalaceAtBranch(chart, rule.target);
    return getPalaceByFunction(chart, rule.target);
}

function starIds(names) {
    return (names || []).map((name) => {
        const resolved = resolveStar(name);
        return resolved.status === 'known' ? resolved.starId : null;
    });
}

function markerOn(palace, marker) {
    if (marker === 'tuan') return Boolean(palace?.isTuan);
    if (marker === 'triet') return Boolean(palace?.isTriet);
    return false;
}

function palaceHasAny(chart, palace, spec) {
    if (!spec) return true;
    const ids = starIds(spec.stars || []);
    if (ids.some((id) => !id)) return false;
    if (ids.some((id) => hasStarAtPalace(chart, id, palace.id))) return true;
    return (spec.markers || []).some((marker) => markerOn(palace, marker));
}

function rowsAt(palaceId, ids) {
    return ids.map((starId) => ({ starId, palaces: [Number(palaceId)] }));
}

function zoneIds(palace, at) {
    const rel = branchIndexRelations(palace.branchId);
    if (!rel) return [];
    if (at === 'target') return [rel.branchId];
    if (at === 'tam_hop') return [rel.branchId, ...rel.tamHop];
    if (at === 'tam_hop_partners') return [...rel.tamHop];
    if (at === 'tam_phuong_tu_chinh') return [...rel.tamPhuongTuChinh];
    if (at === 'opposite') return [rel.xungChieu];
    if (at === 'menh_or_opposite') return [rel.branchId, rel.xungChieu];
    if (at === 'chart') return null;
    return [];
}

function instancesInClause(chart, starId, palace, clause) {
    const hits = chart.byStarId?.[starId] || [];
    if (hits.length === 0) return [];
    if (clause.brightness?.length && !hits.every((hit) => clause.brightness.includes(hit.brightness))) {
        return [];
    }
    const zone = zoneIds(palace, clause.at || 'target');
    const branches = clause.branches?.map(normalizeChi);
    return hits
        .filter((hit) => {
            const where = getPalaceAtBranch(chart, hit.palaceId);
            if (!where) return false;
            if (zone && !zone.includes(Number(where.id))) return false;
            if (branches && !branches.includes(normalizeChi(where.branchName))) return false;
            if (!palaceHasAny(chart, where, clause.samePalaceAny)) return false;
            return true;
        })
        .map((hit) => Number(hit.palaceId));
}

function clauseRows(chart, palace, clause) {
    const ids = starIds(clause.stars);
    if (ids.some((id) => !id)) return null;
    if (clause.any) {
        for (const starId of ids) {
            const palaces = instancesInClause(chart, starId, palace, clause);
            if (palaces.length) return [{ starId, palaces }];
        }
        return null;
    }
    const rows = [];
    for (const starId of ids) {
        const palaces = instancesInClause(chart, starId, palace, clause);
        if (!palaces.length) return null;
        rows.push({ starId, palaces });
    }
    return rows;
}

function countSignals(chart, palace, spec) {
    const rows = [];
    for (const name of spec.stars || []) {
        const starId = starIds([name])[0];
        if (!starId) return null;
        if (hasStarAtPalace(chart, starId, palace.id)) {
            rows.push({ starId, palaces: [Number(palace.id)] });
        }
    }
    for (const marker of spec.markers || []) {
        if (markerOn(palace, marker)) rows.push({ starId: marker, palaces: [Number(palace.id)] });
    }
    return rows;
}

function palaceByRole(chart, role) {
    if (role === 'menh') return getPalaceByFunction(chart, 'menh') || getPalaceAtBranch(chart, chart.menhPalaceId);
    return getPalaceByFunction(chart, role);
}

function signalsAt(chart, role, spec) {
    const palace = palaceByRole(chart, role);
    if (!palace) return null;
    const rows = countSignals(chart, palace, spec);
    if (!rows || rows.length < (spec.min || 1)) return null;
    return rows;
}

function linkedRows(chart, linked) {
    const pair = (leftRole, rightRole) => {
        const left = signalsAt(chart, leftRole, linked.left);
        const right = signalsAt(chart, rightRole, linked.right);
        if (!left || !right) return null;
        return left.concat(right);
    };
    return pair(linked.left.palace, linked.right.palace)
        || (linked.orSwap ? pair(linked.right.palace, linked.left.palace) : null);
}

/**
 * both_flanks: mỗi sao phải có trong Mệnh hoặc hai bên,
 * và mỗi bên phải có ít nhất một sao trong danh sách.
 * Sao chỉ nằm trong Mệnh thì không đủ.
 */
function giapBothFlanks(chart, palaceId, ids) {
    const menh = Number(palaceId);
    const left = wrapIndex(menh - 1);
    const right = wrapIndex(menh + 1);
    const zone = [left, menh, right];
    const rows = ids.map((starId) => ({
        starId,
        palaces: zone.filter((id) => hasStarAtPalace(chart, starId, id))
    }));
    if (rows.some((row) => row.palaces.length === 0)) return null;
    const leftHas = ids.some((starId) => hasStarAtPalace(chart, starId, left));
    const rightHas = ids.some((starId) => hasStarAtPalace(chart, starId, right));
    if (!leftHas || !rightHas) return null;
    return rows;
}

function groupOnSide(chart, groupIds, side) {
    return groupIds.filter((starId) => hasStarAtPalace(chart, starId, side));
}

/** Sao neo tại cung đích. Hai nhóm sao nằm ở hai bên đối nhau. */
function giapAnchorFlanks(chart, palaceId, anchorId, groups) {
    const menh = Number(palaceId);
    if (!hasStarAtPalace(chart, anchorId, menh)) return null;
    const left = wrapIndex(menh - 1);
    const right = wrapIndex(menh + 1);
    const [groupA, groupB] = groups;
    const leftA = groupOnSide(chart, groupA, left);
    const rightA = groupOnSide(chart, groupA, right);
    const leftB = groupOnSide(chart, groupB, left);
    const rightB = groupOnSide(chart, groupB, right);
    const split = (leftA.length && rightB.length) || (leftB.length && rightA.length);
    if (!split) return null;
    const used = new Set([anchorId, ...leftA, ...rightA, ...leftB, ...rightB]);
    return [...used].map((starId) => ({
        starId,
        palaces: [left, menh, right].filter((id) => hasStarAtPalace(chart, starId, id))
    }));
}

function excludedHits(chart, palaceId, excluded) {
    return (excluded || []).some((clause) => {
        const ids = starIds(clause.stars);
        if (ids.some((id) => !id)) return true;
        if (clause.relation === 'same') {
            return ids.some((id) => hasStarAtPalace(chart, id, palaceId));
        }
        return false;
    });
}

function finish(rule, palace, rows, op) {
    if (!rows) return null;
    return {
        ruleId: rule.id,
        rows,
        evidence: {
            ruleId: rule.id,
            palaceId: palace.id,
            branchName: palace.branchName,
            op,
            stars: rows.map((row) => ({ starId: row.starId, palaces: row.palaces }))
        }
    };
}

/**
 * @returns {null | { ruleId: string, rows: {starId: string, palaces: number[]}[], evidence: object }}
 */
export function evaluateRule(chart, rule) {
    if (!chart?.ok || !rule?.id) return null;
    if (rule.anyOf?.length) {
        const { anyOf, ...base } = rule;
        for (const alternative of anyOf) {
            const hit = evaluateRule(chart, { ...base, ...alternative, id: rule.id });
            if (hit) return hit;
        }
        return null;
    }

    const palace = targetPalace(chart, rule);
    if (!palace) return null;

    if (rule.branches?.length) {
        const allowed = rule.branches.map(normalizeChi);
        if (!allowed.includes(normalizeChi(palace.branchName))) return null;
    }

    if (rule.noMajor && palace.stars.some((star) => star.list === 'major')) return null;

    const hasBody = rule.samePalace || rule.giap || rule.clauses || rule.countAtLeast || rule.linked;
    if (rule.noMajor && !hasBody) {
        return finish(rule, palace, [], 'no_major');
    }

    let rows = [];
    let op = 'clauses';
    if (rule.samePalace) {
        const ids = starIds(rule.samePalace);
        if (ids.some((id) => !id)) return null;
        if (!ids.every((id) => hasStarAtPalace(chart, id, palace.id))) return null;
        if (rule.brightness) {
            const brightOk = Object.entries(rule.brightness).every(([name, mark]) => {
                const id = starIds([name])[0];
                const star = palace.stars.find((item) => item.starId === id);
                return star && star.brightness === mark;
            });
            if (!brightOk) return null;
        }
        rows = rows.concat(rowsAt(palace.id, ids));
        op = 'same_palace';
    }
    if (rule.giap?.mode === 'both_flanks') {
        const ids = starIds(rule.giap.stars);
        if (ids.some((id) => !id)) return null;
        const giapRows = giapBothFlanks(chart, palace.id, ids);
        if (!giapRows) return null;
        rows = rows.concat(giapRows);
        op = 'giap_both_flanks';
    }
    if (rule.giap?.mode === 'anchor_flanks') {
        const anchorId = starIds([rule.giap.anchor])[0];
        const groups = (rule.giap.flankGroups || []).map((group) => starIds(group));
        if (!anchorId || groups.length !== 2 || groups.some((group) => group.some((id) => !id))) return null;
        const giapRows = giapAnchorFlanks(chart, palace.id, anchorId, groups);
        if (!giapRows) return null;
        rows = rows.concat(giapRows);
        op = 'giap_anchor_flanks';
    }
    if (rule.clauses?.length) {
        for (const clause of rule.clauses) {
            const part = clauseRows(chart, palace, clause);
            if (!part) return null;
            rows = rows.concat(part);
        }
        if (!rule.samePalace && !rule.giap) op = 'clauses';
    }
    if (rule.countAtLeast) {
        const counted = countSignals(chart, palace, rule.countAtLeast);
        if (!counted || counted.length < rule.countAtLeast.n) return null;
        rows = rows.concat(counted);
        op = 'count';
    }
    if (rule.linked) {
        const linked = linkedRows(chart, rule.linked);
        if (!linked) return null;
        rows = rows.concat(linked);
        op = 'linked';
    }
    if (!rule.noMajor && !rule.samePalace && !rule.giap && !rule.clauses && !rule.countAtLeast && !rule.linked) return null;
    if (excludedHits(chart, palace.id, rule.excluded)) return null;
    if (rule.noMajor && rows.length === 0) return finish(rule, palace, [], 'no_major');
    return finish(rule, palace, rows, op);
}
