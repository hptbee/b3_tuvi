import { wrapIndex, normalizeChi } from './starNames.js';
import { resolveStar } from './starCatalog.js';
import { branchIndexRelations, nhiHop } from './palaceRelation.js';
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

function zoneIds(palace, at) {
    const rel = branchIndexRelations(palace.branchId);
    if (!rel) return [];
    if (at === 'target') return [rel.branchId];
    if (at === 'tam_hop') return [rel.branchId, ...rel.tamHop];
    if (at === 'tam_hop_partners') return [...rel.tamHop];
    if (at === 'tam_phuong_tu_chinh') return [...rel.tamPhuongTuChinh];
    if (at === 'opposite') return [rel.xungChieu];
    if (at === 'menh_or_opposite') return [rel.branchId, rel.xungChieu];
    if (at === 'aspect') return [...rel.tamHop, rel.xungChieu];
    if (at === 'nhi_hop') {
        const partner = nhiHop(rel.branchId);
        return partner ? [partner] : [];
    }
    if (at === 'chart') return null;
    return [];
}

function instancesInClause(chart, starId, palace, clause) {
    const hits = chart.byStarId?.[starId] || [];
    if (hits.length === 0) return [];
    const zone = zoneIds(palace, clause.at || 'target');
    const branches = clause.branches?.map(normalizeChi);
    return hits
        .filter((hit) => {
            const where = getPalaceAtBranch(chart, hit.palaceId);
            if (!where) return false;
            if (zone && !zone.includes(Number(where.id))) return false;
            if (branches && !branches.includes(normalizeChi(where.branchName))) return false;
            if (clause.brightness?.length && !clause.brightness.includes(hit.brightness)) return false;
            if (!palaceHasAny(chart, where, clause.samePalaceAny)) return false;
            return true;
        })
        .map((hit) => ({ palaceId: Number(hit.palaceId), brightness: hit.brightness }));
}

function packHits(starId, hits) {
    return {
        starId,
        palaces: hits.map((hit) => hit.palaceId),
        brightness: hits.map((hit) => hit.brightness)
    };
}

function clauseRows(chart, palace, clause) {
    if (!Array.isArray(clause?.stars) || clause.stars.length === 0) return null;
    const ids = starIds(clause.stars);
    if (ids.some((id) => !id)) return null;
    if (clause.any) {
        for (const starId of ids) {
            const hits = instancesInClause(chart, starId, palace, clause);
            if (hits.length) return [packHits(starId, hits)];
        }
        return null;
    }
    const rows = [];
    for (const starId of ids) {
        const hits = instancesInClause(chart, starId, palace, clause);
        if (!hits.length) return null;
        rows.push(packHits(starId, hits));
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

function giapSplitFlanks(chart, palaceId, ids) {
    if (ids.length !== 2) return null;
    const left = wrapIndex(Number(palaceId) - 1);
    const right = wrapIndex(Number(palaceId) + 1);
    const [leftStar, rightStar] = ids;
    const orientations = [
        [leftStar, rightStar],
        [rightStar, leftStar]
    ];
    const hit = orientations.find(([onLeft, onRight]) => hasStarAtPalace(chart, onLeft, left) && hasStarAtPalace(chart, onRight, right));
    if (!hit) return null;
    return ids.map((starId) => ({
        starId,
        palaces: [left, right].filter((id) => hasStarAtPalace(chart, starId, id))
    }));
}

function absentHits(chart, palace, absent) {
    if (!absent) return false;
    const ids = starIds(absent.stars || []);
    if (ids.length === 0 || ids.some((id) => !id)) return true;
    const zone = zoneIds(palace, absent.at || 'target');
    return ids.some((starId) => {
        const hits = chart.byStarId?.[starId] || [];
        return hits.some((hit) => !zone || zone.includes(Number(hit.palaceId)));
    });
}

function soleMajorOk(palace, names) {
    const ids = starIds(names);
    if (!Array.isArray(names) || names.length === 0 || ids.some((id) => !id)) return false;
    const majors = (palace.stars || []).filter((star) => star.list === 'major');
    if (majors.length !== ids.length) return false;
    return ids.every((id) => majors.some((star) => star.starId === id));
}

function splitPalaceRows(chart, spec) {
    if (!spec?.absentAt || !Array.isArray(spec.stars) || !Array.isArray(spec.oneEach) || spec.oneEach.length !== 2) {
        return null;
    }
    const home = palaceByRole(chart, spec.absentAt);
    const left = palaceByRole(chart, spec.oneEach[0]);
    const right = palaceByRole(chart, spec.oneEach[1]);
    if (!home || !left || !right) return null;
    const ids = starIds(spec.stars);
    if (ids.length < 2 || ids.some((id) => !id)) return null;
    if (ids.some((id) => hasStarAtPalace(chart, id, home.id))) return null;
    const present = (palace) => ids.filter((id) => hasStarAtPalace(chart, id, palace.id));
    const a = present(left);
    const b = present(right);
    if (a.length !== 1 || b.length !== 1 || a[0] === b[0]) return null;
    return [
        { starId: a[0], palaces: [Number(left.id)] },
        { starId: b[0], palaces: [Number(right.id)] }
    ];
}

function excludedHits(chart, palaceId, excluded) {
    return (excluded || []).some((clause) => {
        if (!clause || clause.relation !== 'same' || !Array.isArray(clause.stars) || clause.stars.length === 0) {
            return true;
        }
        const ids = starIds(clause.stars);
        if (ids.some((id) => !id)) return true;
        return ids.some((id) => hasStarAtPalace(chart, id, palaceId));
    });
}

function finish(rule, chart, palace, rows, op) {
    if (!rows) return null;
    return {
        ruleId: rule.id,
        rows,
        evidence: {
            ruleId: rule.id,
            palaceId: palace.id,
            branchName: palace.branchName,
            op,
            schoolId: chart.schoolId || null,
            stars: rows.map((row) => ({
                starId: row.starId,
                palaces: row.palaces,
                ...(row.brightness ? { brightness: row.brightness } : {})
            }))
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
    if (rule.brightHost) {
        const majors = (palace.stars || []).filter((star) => star.list === 'major');
        if (majors.length === 0 || majors.some((star) => !['M', 'V', 'Đ'].includes(star.brightness))) return null;
    }
    if (rule.soleMajor && !soleMajorOk(palace, rule.soleMajor)) return null;
    if (absentHits(chart, palace, rule.absent)) return null;

    const hasBody = rule.samePalace || rule.giap || rule.clauses || rule.countAtLeast || rule.linked || rule.splitPalaces;
    if (rule.noMajor && !hasBody) {
        return finish(rule, chart, palace, [], 'no_major');
    }

    let rows = [];
    let op = 'clauses';
    if (rule.samePalace) {
        if (!Array.isArray(rule.samePalace) || rule.samePalace.length === 0) return null;
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
        rows = rows.concat(ids.map((starId) => {
            const star = palace.stars.find((item) => item.starId === starId);
            return { starId, palaces: [Number(palace.id)], brightness: [star?.brightness ?? null] };
        }));
        op = 'same_palace';
    }
    if (rule.giap) {
        if (!['both_flanks', 'anchor_flanks', 'split_flanks'].includes(rule.giap.mode)) return null;
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
    if (rule.giap?.mode === 'split_flanks') {
        const ids = starIds(rule.giap.stars);
        if (ids.some((id) => !id)) return null;
        const giapRows = giapSplitFlanks(chart, palace.id, ids);
        if (!giapRows) return null;
        rows = rows.concat(giapRows);
        op = 'giap_split_flanks';
    }
    if (rule.clauses) {
        if (!Array.isArray(rule.clauses) || rule.clauses.length === 0) return null;
        for (const clause of rule.clauses) {
            const part = clauseRows(chart, palace, clause);
            if (!part) return null;
            rows = rows.concat(part);
        }
        if (!rule.samePalace && !rule.giap) op = 'clauses';
    }
    if (rule.countAtLeast) {
        const n = rule.countAtLeast.n;
        if (!Number.isInteger(n) || n < 1) return null;
        const counted = countSignals(chart, palace, rule.countAtLeast);
        if (!counted || counted.length < n) return null;
        rows = rows.concat(counted);
        op = 'count';
    }
    if (rule.linked) {
        const linked = linkedRows(chart, rule.linked);
        if (!linked) return null;
        rows = rows.concat(linked);
        op = 'linked';
    }
    if (rule.splitPalaces) {
        const split = splitPalaceRows(chart, rule.splitPalaces);
        if (!split) return null;
        rows = rows.concat(split);
        op = 'split_palaces';
    }
    if (!rule.noMajor && !rule.samePalace && !rule.giap && !rule.clauses && !rule.countAtLeast && !rule.linked && !rule.splitPalaces) return null;
    if (excludedHits(chart, palace.id, rule.excluded)) return null;
    if (rows.length === 0) return null;
    return finish(rule, chart, palace, rows, op);
}
