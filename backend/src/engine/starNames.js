/** Strip brightness marks like (M), (H), (Đ). */
export function cleanStarName(star) {
    if (!star) return '';
    const name = typeof star === 'string' ? star : (star.name || '');
    return name.replace(/\s*\([^)]*\)\s*$/g, '').trim();
}

export function wrapIndex(i) {
    let r = Number(i) % 12;
    if (r <= 0) r += 12;
    return r;
}

const CHI_ALIASES = {
    Tý: 'Tí',
    Tỵ: 'Tị',
    Ty: 'Tị',
    'Tỵ.': 'Tị'
};

export function normalizeChi(chi) {
    if (!chi) return '';
    const trimmed = String(chi).trim();
    return CHI_ALIASES[trimmed] || trimmed;
}

export function brightnessOf(star) {
    if (typeof star !== 'string') return '';
    const m = star.match(/\(([MVĐBH])\)\s*$/);
    return m ? m[1] : '';
}

export function getStarsInBox(box) {
    if (!box) return [];
    const stars = [
        ...(box.majorStars || []),
        ...(box.goodStars || []),
        ...(box.badStars || []),
        ...(box.minorStars || [])
    ];
    return stars.map(cleanStarName).filter(Boolean);
}

export function getStarRecords(box) {
    if (!box) return [];
    const stars = [
        ...(box.majorStars || []),
        ...(box.goodStars || []),
        ...(box.badStars || []),
        ...(box.minorStars || [])
    ];
    return stars.map((s) => ({
        raw: typeof s === 'string' ? s : (s.name || ''),
        name: cleanStarName(s),
        brightness: brightnessOf(typeof s === 'string' ? s : (s.name || ''))
    })).filter((r) => r.name);
}

export function palaceHasStar(box, starName) {
    const target = cleanStarName(starName);
    return getStarsInBox(box).includes(target);
}

export function findStarOnChart(boxes, starName) {
    const target = cleanStarName(starName);
    const hits = [];
    for (let i = 1; i <= 12; i++) {
        const recs = getStarRecords(boxes[i]);
        const hit = recs.find((r) => r.name === target);
        if (hit) hits.push({ index: i, ...hit });
    }
    return hits;
}

export const TUAN_ALIASES = new Set(['Tuần', 'Tuần Không']);
export const TRIET_ALIASES = new Set(['Triệt', 'Triệt Không']);

export function isTuanAlias(name) {
    return TUAN_ALIASES.has(cleanStarName(name));
}

export function isTrietAlias(name) {
    return TRIET_ALIASES.has(cleanStarName(name));
}
