import dotenv from 'dotenv';
import { initDatabase } from './backend/src/db/sqlite.js';
import { listCombinations } from './backend/src/db/repositories.js';

dotenv.config({ path: './backend/.env' });

initDatabase();
const combos = listCombinations().filter((c) => /Phủ Tướng Triều Viên/i.test(c.name));
console.log(JSON.stringify(combos, null, 2));
