import { solarToLunar } from './backend/src/engine/lunar.js';
import { calculateTuVi } from './backend/src/engine/tuviRules.mjs';

let ld = solarToLunar(19, 5, 2024);
console.log('Lunar:', ld);
// hr 12 -> 12:30 is Giờ Ngọ (7)
let tv = calculateTuVi(ld.canIndex, ld.chiIndex, ld.lunarDay, ld.lunarMonth, 7, 1);

console.log('Mệnh/Cục:', tv.nguHanhBanMenh, tv.cucInfo);
console.log('Mệnh at:', tv.menh);
console.log('Tuần/Triệt:', Object.entries(tv.boxes).filter(([_, b]) => b.isTuan).map(([k, _]) => k), Object.entries(tv.boxes).filter(([_, b]) => b.isTriet).map(([k, _]) => k));

for (let i = 1; i <= 12; i++) {
    let b = tv.boxes[i];
    console.log(`Cung ${i} (${b.cungName}): Major:`, b.majorStars, `Good:`, b.goodStars, `Bad:`, b.badStars);
}
