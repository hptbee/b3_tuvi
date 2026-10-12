/**
 * Seed bảng combinations từ catalog JSON (nguồn sự thật của matcher).
 * Chạy: node src/scripts/seedCombinations.js
 */
import dotenv from 'dotenv';
import combinations from '../data/combinations.json' with { type: 'json' };
import { initDatabase, withTransaction } from '../db/sqlite.js';
import { combinationTypeStats, countCombinations, upsertCombination } from '../db/repositories.js';

dotenv.config();

function seedCombinations() {
    initDatabase();
    console.log(`Seeding ${combinations.length} cách cục...`);

    withTransaction(() => {
        for (const combo of combinations) upsertCombination(combo);
    });

    const stats = combinationTypeStats();
    console.log(`Done: ${countCombinations()} rows in combinations`);
    stats.forEach((s) => console.log(`  ${s._id}: ${s.count}`));
}

try {
    seedCombinations();
} catch (err) {
    console.error('Seed combinations failed:', err);
    process.exit(1);
}
