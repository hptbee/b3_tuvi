/**
 * Xóa dữ liệu seed (stars, palaces, combinations, horoscopes) trong SQLite.
 */
import dotenv from 'dotenv';
import { initDatabase } from '../db/sqlite.js';
import {
    deleteAllCombinations,
    deleteAllHoroscopes,
    deleteAllPalaces,
    deleteAllStars
} from '../db/repositories.js';

dotenv.config();

function cleanup() {
    initDatabase();
    console.log('📌 Cleaning SQLite tables...');
    console.log(`   stars: ${deleteAllStars()}`);
    console.log(`   palaces: ${deleteAllPalaces()}`);
    console.log(`   combinations: ${deleteAllCombinations()}`);
    console.log(`   horoscopes: ${deleteAllHoroscopes()}`);
    console.log('✅ Cleanup complete');
}

try {
    cleanup();
} catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
}
