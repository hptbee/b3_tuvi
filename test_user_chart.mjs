import { calculateTuVi } from './backend/src/engine/tuviRules.mjs';

const getStarsInBox = (box) => {
    if (!box) return [];
    const stars = [
        ...(box.majorStars || []),
        ...(box.goodStars || []),
        ...(box.badStars || []),
        ...(box.minorStars || [])
    ];
    return stars.map(s => {
        const name = typeof s === 'string' ? s : (s.name || '');
        return name.replace(/\s*\([a-zA-ZĐđ]\)/g, '').trim();
    }).filter(Boolean);
};

const wrapIndex = (i) => {
    let r = i % 12;
    if (r <= 0) r += 12;
    return r;
};

// 1. Calculate the chart
const tvData = calculateTuVi(9, 10, 25, 7, 1, 1);
const { boxes, menh: menhIndex } = tvData;

console.log('--- TEST DATA ---');
console.log('Menh Index:', menhIndex);
console.log('Mệnh Stars:', getStarsInBox(boxes[menhIndex]));

// 2. Mock a combination check (Phủ Tướng Triều Viên)
const combo = {
    name: 'Phủ Tướng Triều Viên',
    logic_conditions: {
        required_stars: ['Thiên Phủ', 'Thiên Tướng'],
        positions: ['Tam hợp', 'Hội chiếu']
    }
};

const required = combo.logic_conditions.required_stars;
const positions = combo.logic_conditions.positions;

const zones = new Set();
if (positions.includes('Đồng cung') || positions.includes('Tọa thủ')) zones.add(menhIndex);
if (positions.includes('Xung chiếu') || positions.includes('Hội chiếu')) zones.add(wrapIndex(menhIndex + 6));
if (positions.includes('Tam hợp') || positions.includes('Hội chiếu')) {
    zones.add(wrapIndex(menhIndex + 4));
    zones.add(wrapIndex(menhIndex + 8));
    zones.add(menhIndex);
}

const starsInZone = new Set();
Array.from(zones).forEach(idx => {
    getStarsInBox(boxes[idx]).forEach(s => starsInZone.add(s));
});

console.log('Zones checked:', Array.from(zones));
console.log('Stars found in Zone:', Array.from(starsInZone));
console.log('Match Phủ Tướng Triều Viên:', required.every(star => starsInZone.has(star)));

// 3. Mock Tử Phủ Vũ Tướng
const combo2 = {
    name: 'Tử Phủ Vũ Tướng',
    logic_conditions: {
        required_stars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'],
        positions: ['Tam hợp', 'Xung chiếu']
    }
};
const zones2 = new Set();
// positions: ['Tam hợp', 'Xung chiếu']
if (combo2.logic_conditions.positions.includes('Tam hợp')) {
    zones2.add(wrapIndex(menhIndex + 4));
    zones2.add(wrapIndex(menhIndex + 8));
    zones2.add(menhIndex);
}
if (combo2.logic_conditions.positions.includes('Xung chiếu')) {
    zones2.add(wrapIndex(menhIndex + 6));
}
const starsInZone2 = new Set();
Array.from(zones2).forEach(idx => {
    getStarsInBox(boxes[idx]).forEach(s => starsInZone2.add(s));
});
console.log('Match Tử Phủ Vũ Tướng:', combo2.logic_conditions.required_stars.every(star => starsInZone2.has(star)));
