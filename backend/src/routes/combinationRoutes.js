import express from 'express';
import Combination from '../models/Combination.js';

const router = express.Router();

const COMBINATION_CACHE_MS = 60_000;
let combinationCache = null;

async function getCombinationCatalog() {
    const now = Date.now();
    if (combinationCache && now - combinationCache.loadedAt < COMBINATION_CACHE_MS) {
        return combinationCache.docs;
    }
    const docs = await Combination.find({})
        .select('-vector_embedding')
        .lean();
    combinationCache = { loadedAt: now, docs };
    return docs;
}

/**
 * Helpler: Wrap index in 1-12 range
 */
const wrapIndex = (i) => {
    let r = i % 12;
    if (r <= 0) r += 12;
    return r;
};

/**
 * Helper: Extract clean star names from a palace box
 */
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

/**
 * POST /api/combinations/match
 * Body: { boxes: {...}, menhIndex: 5, menhChi: 'Ngọ' }
 */
router.post('/match', async (req, res) => {
    try {
        console.log('--- START MATCH ---');
        const { boxes = {}, menhIndex: rawMenhIndex = 0, menhChi = '' } = req.body;
        const menhIndex = Number(rawMenhIndex);

        console.log('POST Body parsed:', { menhIndex, menhChi, boxCount: Object.keys(boxes).length });

        if (!menhIndex || Object.keys(boxes).length === 0) {
            console.log('Early return: missing index or boxes');
            return res.json({ count: 0, combinations: [] });
        }

        const allCombinations = await getCombinationCatalog();
        console.log(`Using ${allCombinations.length} patterns (cache ${COMBINATION_CACHE_MS}ms, embeddings excluded).`);

        const matched = [];

        for (const combo of allCombinations) {
            const required = combo.logic_conditions?.required_stars ?? [];
            const requiredPalaces = combo.logic_conditions?.required_palaces ?? [];
            const positions = combo.logic_conditions?.positions ?? [];

            const palaceMatch = requiredPalaces.length === 0 || requiredPalaces.includes(menhChi);
            if (!palaceMatch) continue;

            let checkIndices = [];
            if (positions.length === 0) {
                if (requiredPalaces.length > 0) {
                    checkIndices = Object.entries(boxes)
                        .filter(([idx, box]) => requiredPalaces.includes(box.chi || box.chiName))
                        .map(([idx]) => Number(idx));
                } else {
                    checkIndices = Array.from({ length: 12 }, (_, i) => i + 1);
                }
            } else {
                const zones = new Set();
                if (positions.includes('Đồng cung') || positions.includes('Tọa thủ')) zones.add(menhIndex);
                if (positions.includes('Xung chiếu') || positions.includes('Hội chiếu')) zones.add(wrapIndex(menhIndex + 6));
                if (positions.includes('Tam hợp') || positions.includes('Hội chiếu')) {
                    zones.add(wrapIndex(menhIndex + 4));
                    zones.add(wrapIndex(menhIndex + 8));
                    zones.add(menhIndex);
                }
                if (positions.includes('Giáp')) {
                    zones.add(wrapIndex(menhIndex - 1));
                    zones.add(wrapIndex(menhIndex + 1));
                }
                if (positions.includes('Hội chiếu')) zones.add(menhIndex);
                checkIndices = Array.from(zones);
            }

            const starsInZone = new Set();
            checkIndices.forEach(idx => {
                getStarsInBox(boxes[idx]).forEach(s => starsInZone.add(s));
            });

            const starsMatch = required.length > 0 ? 
                required.every(star => starsInZone.has(star)) : 
                (combo.name === 'Mệnh Vô Chính Diệu' ? (boxes[menhIndex]?.majorStars?.length === 0) : true);

            if (starsMatch) {
                matched.push({
                    _id: combo._id,
                    name: combo.name,
                    type: combo.type,
                    description: combo.description,
                    formula_text: combo.logic_conditions?.formula_text || '',
                    summary: combo.interpretations?.[0]?.content || combo.description,
                    tags: combo.tags
                });
            }
        }

        console.log(`Matched ${matched.length} combinations.`);
        res.json({ count: matched.length, combinations: matched });
        console.log('--- END MATCH ---');
    } catch (error) {
        console.error('CRASH in engine:', error);
        res.status(500).json({ error: 'System crash during matching', detail: error.message });
    }
});

/**
 * GET /api/combinations
 */
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const combos = await Combination.find(filter).select('-vector_embedding');
        res.json(combos);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi tải cách cục' });
    }
});

export default router;
