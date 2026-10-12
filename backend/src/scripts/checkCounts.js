import dotenv from 'dotenv';
import { initDatabase } from '../db/sqlite.js';
import {
    countCombinations,
    countHoroscopes,
    countPalaces,
    countStars
} from '../db/repositories.js';

dotenv.config();

function checkCounts() {
    initDatabase();
    console.log('stars:', countStars());
    console.log('palaces:', countPalaces());
    console.log('combinations:', countCombinations());
    console.log('horoscopes:', countHoroscopes());
}

try {
    checkCounts();
} catch (err) {
    console.error(err);
    process.exit(1);
}
