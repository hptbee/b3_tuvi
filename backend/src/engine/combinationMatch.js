import {
    wrapIndex,
    normalizeChi,
    getStarsInBox,
    getStarRecords,
    isTuanAlias,
    isTrietAlias
} from './starNames.js';
import { branchIndexRelations } from './palaceRelation.js';
import { normalizeChart } from './normalizeChart.js';
import { evaluateRule } from './ruleEngine.js';
import { getStarById } from './starCatalog.js';
import rulesV2 from '../data/rulesV2.json' with { type: 'json' };

export const SUPPORTED_POSITIONS = new Set([
    'Đồng cung',
    'Tọa thủ',
    'Xung chiếu',
    'Tam hợp',
    'Hội chiếu',
    'Hội tụ',
    'Giáp',
    'Toàn cục'
]);

export const UNSUPPORTED_POSITIONS = new Set(['Nhị hợp', 'Ám hợp']);

const HUNG_ABSOLUTE_DISCLAIMER =
    'Luận giải mang tính tham khảo theo công thức cách cục, không phải kết luận về sức khỏe, hôn nhân, cha mẹ hay sinh tử.';

function unique(arr) {
    return Array.from(new Set(arr));
}

/** Hình cũ cho matcher: tamHop gồm cung gốc rồi hai đối tác. Công thức nằm ở palaceRelation.js. */
export function palaceRelations(menhIndex) {
    const rel = branchIndexRelations(menhIndex);
    if (!rel) {
        return { targetPalaceId: String(menhIndex), tamHop: [], xungChieu: '', giapCung: [], tamPhuongTuChinh: [] };
    }
    return {
        targetPalaceId: String(rel.branchId),
        tamHop: [rel.branchId, rel.tamHop[0], rel.tamHop[1]].map(String),
        xungChieu: String(rel.xungChieu),
        giapCung: rel.giap.map(String),
        tamPhuongTuChinh: rel.tamPhuongTuChinh.map(String)
    };
}

function relationIndices(token, menh) {
    const rel = palaceRelations(menh);
    if (token === 'Toàn cục') return Array.from({ length: 12 }, (_, i) => i + 1);
    if (token === 'Đồng cung' || token === 'Tọa thủ') return [menh];
    if (token === 'Xung chiếu') return [menh, Number(rel.xungChieu)];
    if (token === 'Tam hợp') return rel.tamHop.map(Number);
    if (token === 'Hội chiếu' || token === 'Hội tụ') return rel.tamPhuongTuChinh.map(Number);
    if (token === 'Giáp') return [Number(rel.giapCung[0]), menh, Number(rel.giapCung[1])];
    return [];
}

function locateStars(boxes, indices, stars) {
    const places = stars.map((star) => ({
        star,
        palaces: indices.filter((idx) => getStarsInBox(boxes[idx]).includes(star))
    }));
    if (places.some((row) => row.palaces.length === 0)) return null;
    return places;
}

/** Giáp: hai bên Mệnh đều có ít nhất một sao yêu cầu. Sao chỉ nằm trong Mệnh thì không phải giáp. */
function giapPlacement(boxes, menh, stars) {
    const left = wrapIndex(menh - 1);
    const right = wrapIndex(menh + 1);
    const places = locateStars(boxes, [left, menh, right], stars);
    if (!places) return null;
    const leftHit = stars.some((star) => getStarsInBox(boxes[left]).includes(star));
    const rightHit = stars.some((star) => getStarsInBox(boxes[right]).includes(star));
    if (!leftHit || !rightHit) return null;
    return places;
}

function samePalacePlacement(boxes, menh, stars) {
    const names = new Set(getStarsInBox(boxes[menh]));
    if (!stars.every((star) => names.has(star))) return null;
    return stars.map((star) => ({ star, palaces: [menh] }));
}

/**
 * Nhiều token: "Đồng cung + hội/xung/giáp" là HOẶC.
 * "Tam hợp + Xung chiếu" (không có đồng cung) là hợp vùng tứ chính.
 * Giáp đơn lẻ bắt buộc cả hai bên.
 */
function resolvePlacement(boxes, menh, positions, stars) {
    const tokens = (positions || []).filter((token) => SUPPORTED_POSITIONS.has(token));
    const wantsSame = tokens.some((token) => token === 'Đồng cung' || token === 'Tọa thủ');
    const rest = tokens.filter((token) => token !== 'Đồng cung' && token !== 'Tọa thủ');

    if (tokens.length === 0 || (wantsSame && rest.length === 0)) {
        return samePalacePlacement(boxes, menh, stars);
    }
    if (!wantsSame && rest.length === 1 && rest[0] === 'Giáp') {
        return giapPlacement(boxes, menh, stars);
    }
    if (wantsSame) {
        const atMenh = samePalacePlacement(boxes, menh, stars);
        if (atMenh) return atMenh;
        if (rest.length === 1 && rest[0] === 'Giáp') return giapPlacement(boxes, menh, stars);
        const zone = unique(rest.flatMap((token) => relationIndices(token, menh)));
        return locateStars(boxes, zone, stars);
    }
    const zone = unique(rest.flatMap((token) => relationIndices(token, menh)));
    return locateStars(boxes, zone, stars);
}

function hamOnPlacement(boxes, placement, relationPalaceIds, requireHam) {
    if (!requireHam || requireHam.length === 0) return true;
    const allowed = new Set(relationPalaceIds);
    for (const star of requireHam) {
        const row = placement.find((item) => item.star === star);
        const indices = (row ? row.palaces : relationPalaceIds).filter((idx) => allowed.has(idx));
        if (indices.length === 0) return false;
        for (const idx of indices) {
            const hit = getStarRecords(boxes[idx]).find((record) => record.name === star);
            if (!hit || hit.brightness !== 'H') return false;
        }
    }
    return true;
}

export function resolveCheckIndices(positions, menhIndex) {
    const pos = positions || [];
    if (pos.length === 0) {
        return [menhIndex];
    }
    if (pos.some((p) => UNSUPPORTED_POSITIONS.has(p))) {
        return null;
    }
    const unknown = pos.filter((p) => !SUPPORTED_POSITIONS.has(p));
    if (unknown.length === pos.length) {
        return null;
    }

    const zones = new Set();
    const hasDong = pos.includes('Đồng cung') || pos.includes('Tọa thủ');
    const hasXung = pos.includes('Xung chiếu');
    const hasTamHop = pos.includes('Tam hợp');
    const hasHoi = pos.includes('Hội chiếu') || pos.includes('Hội tụ');
    const hasGiap = pos.includes('Giáp');
    const hasChart = pos.includes('Toàn cục');

    if (hasChart) {
        for (let i = 1; i <= 12; i++) zones.add(i);
    }
    if (hasDong) zones.add(menhIndex);
    if (hasXung || hasHoi) zones.add(wrapIndex(menhIndex + 6));
    if (hasTamHop || hasHoi) {
        zones.add(menhIndex);
        zones.add(wrapIndex(menhIndex + 4));
        zones.add(wrapIndex(menhIndex + 8));
    }
    if (hasGiap) {
        zones.add(menhIndex);
        zones.add(wrapIndex(menhIndex - 1));
        zones.add(wrapIndex(menhIndex + 1));
    }
    if (zones.size === 0 && hasDong === false && pos.some((p) => SUPPORTED_POSITIONS.has(p))) {
        zones.add(menhIndex);
    }
    return Array.from(zones);
}

function starsInIndices(boxes, indices) {
    const names = new Set();
    indices.forEach((idx) => {
        getStarsInBox(boxes[idx]).forEach((s) => names.add(s));
    });
    return names;
}

function tuanTrietInIndices(boxes, indices) {
    let tuan = false;
    let triet = false;
    indices.forEach((idx) => {
        if (boxes[idx]?.isTuan) tuan = true;
        if (boxes[idx]?.isTriet) triet = true;
    });
    return { tuan, triet };
}

function splitRequiredStars(required) {
    const stars = [];
    let needTuan = false;
    let needTriet = false;
    for (const raw of required || []) {
        if (isTuanAlias(raw)) needTuan = true;
        else if (isTrietAlias(raw)) needTriet = true;
        else stars.push(raw);
    }
    return { stars, needTuan, needTriet };
}

const RULES_V2 = new Map(rulesV2.map((rule) => [rule.combination, rule]));

function chartFromMatchInput(boxes, menh) {
    return normalizeChart({
        tuviInfo: { boxes, menh, than: null }
    });
}

function placementFromRows(rows) {
    return rows.map((row) => ({
        star: getStarById(row.starId)?.displayName || row.starId,
        starId: row.starId,
        palaces: row.palaces
    }));
}

/**
 * Pure matcher. Returns [] when input is missing/invalid.
 * Cách có rule v2 được đánh giá trên lá số chuẩn hóa.
 * Cách chưa có rule giữ logic cũ.
 */
export function matchCombinations(input = {}, catalog = [], options = {}) {
    const useV2 = options.useV2 !== false;
    const { boxes, menhIndex, menhChi } = input;
    if (!boxes || typeof boxes !== 'object' || Array.isArray(boxes)) return [];
    const menh = Number(menhIndex);
    if (!menh || menh < 1 || menh > 12) return [];
    if (Object.keys(boxes).length === 0) return [];
    if (!Array.isArray(catalog) || catalog.length === 0) return [];

    const chart = useV2 ? chartFromMatchInput(boxes, menh) : null;
    const menhChiNorm = normalizeChi(menhChi || boxes[menh]?.chiName || boxes[menh]?.chi || '');
    const matched = [];

    for (const combo of catalog) {
        const status = combo.verification_status || 'provisional';
        if (status === 'disabled') continue;

        const rule = useV2 ? RULES_V2.get(combo.name) : null;
        if (rule) {
            const hit = evaluateRule(chart, rule);
            if (!hit) continue;
            matched.push(toMatchDto(combo, placementFromRows(hit.rows), hit.evidence));
            continue;
        }

        const lc = combo.logic_conditions || {};
        const requiredPalaces = (lc.required_palaces || []).map(normalizeChi);
        if (requiredPalaces.length > 0 && !requiredPalaces.includes(menhChiNorm)) continue;

        const positions = lc.positions || [];
        const indices = resolveCheckIndices(positions, menh);
        if (!indices || indices.length === 0) continue;

        if (lc.require_no_major_at_menh || combo.name === 'Mệnh Vô Chính Diệu') {
            const majors = boxes[menh]?.majorStars || [];
            if (majors.length === 0) {
                matched.push(toMatchDto(combo));
            }
            continue;
        }

        const { stars: requiredStars, needTuan, needTriet } = splitRequiredStars(lc.required_stars);
        const excluded = lc.excluded_stars || [];
        const requireHam = lc.require_ham || [];

        if (requiredStars.length === 0 && !needTuan && !needTriet && requireHam.length === 0) {
            continue;
        }

        const placement = resolvePlacement(boxes, menh, positions.length ? positions : ['Tọa thủ'], requiredStars);
        if (!placement) continue;

        const usedPalaces = unique(placement.flatMap((row) => row.palaces));
        const flags = tuanTrietInIndices(boxes, usedPalaces);
        const zoneStars = starsInIndices(boxes, usedPalaces);

        if (needTuan && !flags.tuan) continue;
        if (needTriet && !flags.triet) continue;
        if (excluded.some((star) => zoneStars.has(star))) continue;
        if (!hamOnPlacement(boxes, placement, indices, requireHam)) continue;

        matched.push(toMatchDto(combo, placement));
    }

    return matched;
}

export function matchLegacyCombinations(input, catalog) {
    return matchCombinations(input, catalog, { useV2: false });
}

function toMatchDto(combo, placement = [], evidence = null) {
    const lc = combo.logic_conditions || {};
    const type = combo.type;
    const status = combo.verification_status || 'provisional';
    const summary = combo.interpretations?.[0]?.content || combo.description || '';
    const unverified = status !== 'matching_ok';
    return {
        _id: combo._id,
        name: combo.name,
        type,
        description: combo.description,
        formula_text: lc.formula_text || '',
        summary: unverified ? `[Chưa xác thực] ${summary}` : summary,
        tags: combo.tags || [],
        verification_status: status,
        certainty: unverified ? 'unverified' : 'rule_match_only',
        placements: placement,
        evidence,
        disclaimer: type === 'hung_bai_cach'
            ? (combo.disclaimer || HUNG_ABSOLUTE_DISCLAIMER)
            : (combo.disclaimer || 'Khớp điều kiện sao đã khai báo. Không phải kết luận chắc chắn về cuộc đời.')
    };
}

export { unique, HUNG_ABSOLUTE_DISCLAIMER };
