import {
    wrapIndex,
    normalizeChi,
    getStarsInBox,
    findStarOnChart,
    isTuanAlias,
    isTrietAlias
} from './starNames.js';

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

function hamSatisfied(boxes, requireHam) {
    if (!requireHam || requireHam.length === 0) return true;
    for (const star of requireHam) {
        const hits = findStarOnChart(boxes, star);
        if (hits.length === 0) return false;
        if (!hits.every((h) => h.brightness === 'H')) return false;
    }
    return true;
}

/**
 * Pure matcher. Returns [] when input is missing/invalid.
 * Never returns true for empty conditions.
 */
export function matchCombinations({ boxes, menhIndex, menhChi } = {}, catalog = []) {
    if (!boxes || typeof boxes !== 'object' || Array.isArray(boxes)) return [];
    const menh = Number(menhIndex);
    if (!menh || menh < 1 || menh > 12) return [];
    if (Object.keys(boxes).length === 0) return [];
    if (!Array.isArray(catalog) || catalog.length === 0) return [];

    const menhChiNorm = normalizeChi(menhChi || boxes[menh]?.chiName || boxes[menh]?.chi || '');
    const matched = [];

    for (const combo of catalog) {
        const status = combo.verification_status || 'provisional';
        if (status === 'disabled') continue;

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

        const zoneStars = starsInIndices(boxes, indices);
        const flags = tuanTrietInIndices(boxes, indices);

        const dongOnly = (positions.includes('Đồng cung') || positions.includes('Tọa thủ'))
            && !positions.some((p) => ['Hội chiếu', 'Hội tụ', 'Tam hợp', 'Xung chiếu', 'Giáp', 'Toàn cục'].includes(p));

        let starsOk;
        if (dongOnly) {
            const menhStars = new Set(getStarsInBox(boxes[menh]));
            starsOk = requiredStars.every((s) => menhStars.has(s));
        } else {
            starsOk = requiredStars.every((s) => zoneStars.has(s));
        }
        if (!starsOk) continue;
        if (needTuan && !flags.tuan) continue;
        if (needTriet && !flags.triet) continue;
        if (excluded.some((s) => zoneStars.has(s))) continue;
        if (!hamSatisfied(boxes, requireHam)) continue;

        matched.push(toMatchDto(combo));
    }

    return matched;
}

function toMatchDto(combo) {
    const lc = combo.logic_conditions || {};
    const type = combo.type;
    const summary = combo.interpretations?.[0]?.content || combo.description || '';
    return {
        _id: combo._id,
        name: combo.name,
        type,
        description: combo.description,
        formula_text: lc.formula_text || '',
        summary,
        tags: combo.tags || [],
        verification_status: combo.verification_status || 'provisional',
        disclaimer: type === 'hung_bai_cach' ? (combo.disclaimer || HUNG_ABSOLUTE_DISCLAIMER) : combo.disclaimer
    };
}

export { unique, HUNG_ABSOLUTE_DISCLAIMER };
