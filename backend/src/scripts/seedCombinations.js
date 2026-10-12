/**
 * Seed collection combinations từ catalog JSON (nguồn sự thật của matcher).
 * Chạy: node src/scripts/seedCombinations.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Combination from '../models/Combination.js';
import combinations from '../data/combinations.json' with { type: 'json' };

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:adminpassword@localhost:27017/';

async function seedCombinations() {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    console.log(`Seeding ${combinations.length} cách cục...`);

    let inserted = 0;
    let updated = 0;
    for (const combo of combinations) {
        const result = await Combination.findOneAndUpdate(
            { name: combo.name },
            combo,
            { upsert: true, returnDocument: 'after' }
        );
        const isNew = result.createdAt?.getTime() === result.updatedAt?.getTime();
        if (isNew) inserted += 1;
        else updated += 1;
    }

    const stats = await Combination.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
    console.log(`Done: ${inserted} new, ${updated} updated`);
    stats.forEach((s) => console.log(`  ${s._id}: ${s.count}`));
    await mongoose.disconnect();
}

seedCombinations().catch((err) => {
    console.error('Seed combinations failed:', err);
    process.exit(1);
});
