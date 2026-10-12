import express from 'express';
import { analyzeChartRequest } from '../interpretation/analyze.js';
import { logSafeError } from '../http/safeErrorLog.js';

const router = express.Router();

router.post('/analyze', (req, res) => {
    try {
        const result = analyzeChartRequest(req.body);
        res.status(result.status).json(result.body);
    } catch (error) {
        logSafeError('Interpretation analyze error', error);
        res.status(500).json({ error: 'Lỗi phân tích lá số' });
    }
});

export default router;
