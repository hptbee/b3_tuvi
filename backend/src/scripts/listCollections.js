/**
 * Đồng bộ combinations từ JSON vào SQLite (alias của seedCombinations).
 */
import dotenv from 'dotenv';
import combinations from '../data/combinations.json' with { type: 'json' };
import { initDatabase, withTransaction } from '../db/sqlite.js';
import { countCombinations, upsertCombination } from '../db/repositories.js';

dotenv.config();

function syncCombinations() {
    initDatabase();
    withTransaction(() => {
        for (const combo of combinations) upsertCombination(combo);
    });
    console.log(`combinations: ${countCombinations()}`);
}

try {
    syncCombinations();
} catch (err) {
    console.error(err);
    process.exit(1);
}
