import { solarToLunar } from './backend/src/engine/lunar.js';
import { calculateTuVi } from './backend/src/engine/tuviRules.mjs';

let ld = solarToLunar(10, 3, 1993);
console.log('Lunar:', ld);
// hr 12 -> canhGio = 7 (Ngọ)
let tv = calculateTuVi(ld.canIndex, ld.chiIndex, ld.lunarDay, ld.lunarMonth, 7, 1);

console.log('Cục:', tv.cucInfo);
console.log('Mệnh at:', tv.menh);

for(let i=1; i<=12; i++) {
    console.log(`Cung ${i}:`, tv.boxes[i].majorStars);
}
