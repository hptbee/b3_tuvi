import express from 'express';
import { analyzeChartRequest } from '../interpretation/analyze.js';
import { answerQuestion } from '../ai/questions.js';
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

router.post('/ask', (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object' || Object.prototype.hasOwnProperty.call(req.body, 'analysis')) {
            return res.status(400).json({ ok: false, error: 'client_analysis_rejected', prose: null });
        }
        const result = analyzeChartRequest(req.body);
        if (result.status !== 200) {
            return res.status(result.status).json({ ok: false, error: 'analysis_failed', prose: null });
        }
        const answer = answerQuestion(result.body, req.body.questionId, req.body.topic);
        res.status(answer.ok ? 200 : 400).json(answer);
    } catch (error) {
        logSafeError('Interpretation ask error', error);
        res.status(500).json({ error: 'Lỗi hỏi đáp lá số' });
    }
});

export default router;
