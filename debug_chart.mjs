import { calculateTuVi } from './backend/src/engine/tuviRules.mjs';

// 1993 Quý Dậu
// Lunar Month: 7
// Lunar Day: 25
// Hour: Tí (1)
// Gender: 1 (Assumption: Male)

const tvData = calculateTuVi(9, 10, 25, 7, 1, 1);

console.log('--- CHART INFO ---');
console.log('Menh Index:', tvData.menh);
console.log('Cuc:', tvData.cucInfo);

console.log('\n--- ALL PALACES (STARS) ---');
Object.entries(tvData.boxes).forEach(([idx, box]) => {
    const stars = [...box.majorStars, ...box.goodStars, ...box.badStars];
    if (stars.length > 0) {
        console.log(`[${idx}] ${box.cungName || '??'}:`, stars.join(', '));
    }
});
