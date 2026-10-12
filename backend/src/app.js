import express from 'express';
import cors from 'cors';
import { isDbReady } from './db/sqlite.js';
import chartRoutes from './routes/chartRoutes.js';
import meaningRoutes from './routes/meaningRoutes.js';
import combinationRoutes from './routes/combinationRoutes.js';
import interpretationRoutes from './routes/interpretationRoutes.js';
import { requestLogLine } from './http/requestLog.js';

export function createApp() {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(express.json({ limit: '256kb' }));
    app.use((req, res, next) => {
        const requestId = typeof req.get('x-request-id') === 'string' && req.get('x-request-id').length <= 80
            ? req.get('x-request-id')
            : null;
        if (requestId) res.set('x-request-id', requestId);
        console.log(requestLogLine(req));
        next();
    });
    app.use('/api/charts', chartRoutes);
    app.use('/api/meanings', meaningRoutes);
    app.use('/api/combinations', combinationRoutes);
    app.use('/api/interpretations', interpretationRoutes);
    app.get('/api/health', (req, res) => res.json({
        status: 'server is running',
        database: isDbReady() ? 'sqlite' : 'disconnected'
    }));
    app.get('/api/test-direct', (req, res) => res.json({ ok: true }));
    app.use((error, req, res, next) => {
        if (error instanceof SyntaxError && error.status === 400 && Object.prototype.hasOwnProperty.call(error, 'body')) {
            return res.status(400).json({ error: 'JSON không hợp lệ' });
        }
        if (error.status === 413 || error.type === 'entity.too.large') {
            return res.status(413).json({ error: 'Dữ liệu gửi lên quá lớn' });
        }
        return next(error);
    });
    return app;
}
