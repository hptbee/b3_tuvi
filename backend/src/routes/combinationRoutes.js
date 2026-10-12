import express from 'express';
import Combination from '../models/Combination.js';
import catalogJson from '../data/combinations.json' with { type: 'json' };
import { matchCombinations } from '../engine/combinationMatch.js';

const router = express.Router();

/**
 * Matcher dùng catalog JSON (nguồn sự thật).
 * Mongo chỉ phục vụ GET danh sách khi đã seed.
 */
router.post('/match', async (req, res) => {
    try {
        const { boxes, menhIndex, menhChi } = req.body || {};
        const matched = matchCombinations(
            { boxes, menhIndex, menhChi },
            catalogJson
        );
        res.json({ count: matched.length, combinations: matched });
    } catch (error) {
        console.error('Combination match error:', error);
        res.status(500).json({ error: 'Lỗi đối chiếu cách cục' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { type } : {};
        const combos = await Combination.find(filter).select('-vector_embedding');
        if (!combos.length) {
            const fallback = type ? catalogJson.filter((c) => c.type === type) : catalogJson;
            return res.json(fallback);
        }
        res.json(combos);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi tải cách cục' });
    }
});

export default router;
