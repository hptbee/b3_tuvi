import express from 'express';
import catalogJson from '../data/combinations.json' with { type: 'json' };
import { matchCombinations } from '../engine/combinationMatch.js';
import { logSafeError } from '../http/safeErrorLog.js';

const router = express.Router();

/**
 * Matcher dùng catalog JSON (nguồn sự thật).
 * GET và POST đều đọc combinations.json. Bảng SQLite combinations không được API đọc.
 */
router.post('/match', async (req, res) => {
    try {
        const { boxes, menhIndex, menhChi, sourceProfile } = req.body || {};
        const options = typeof sourceProfile === 'string' ? { profile: sourceProfile } : {};
        const matched = matchCombinations(
            { boxes, menhIndex, menhChi },
            catalogJson,
            options
        );
        res.json({ count: matched.length, combinations: matched });
    } catch (error) {
        logSafeError('Combination match error', error);
        res.status(500).json({ error: 'Lỗi đối chiếu cách cục' });
    }
});

router.get('/', (req, res) => {
    const { type } = req.query;
    const list = type ? catalogJson.filter((item) => item.type === type) : catalogJson;
    res.json(list);
});

export default router;
