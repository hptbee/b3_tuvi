import { timingSafeEqual } from 'node:crypto';

const DEFAULT_LIMIT = 120;
const DEFAULT_WINDOW_MS = 60_000;

function tokenMatches(provided, expected) {
    if (typeof provided !== 'string' || typeof expected !== 'string' || expected.length === 0) return false;
    const actual = Buffer.from(provided);
    const required = Buffer.from(expected);
    if (actual.length !== required.length) return false;
    return timingSafeEqual(actual, required);
}

export function numerologyClientKey(req, { trustProxy = false, proxyToken = '' } = {}) {
    const socket = req.socket?.remoteAddress || 'unknown';
    if (!trustProxy) return `direct:${socket}`;
    const forwarded = req.get('x-forwarded-for');
    const authorized = tokenMatches(req.get('x-numerology-proxy-token'), proxyToken);
    if (!authorized || typeof forwarded !== 'string') return `direct:${socket}`;
    const hops = forwarded.split(',').map(part => part.trim()).filter(Boolean);
    const client = hops[hops.length - 1];
    if (!client || client.length > 80) return `direct:${socket}`;
    return `fwd:${client}`;
}

export function createNumerologyRateLimit({
    limit = Number(process.env.NUMEROLOGY_RATE_LIMIT || DEFAULT_LIMIT),
    windowMs = Number(process.env.NUMEROLOGY_RATE_WINDOW_MS || DEFAULT_WINDOW_MS),
    trustProxy = process.env.NUMEROLOGY_TRUST_PROXY === '1',
    proxyToken = process.env.NUMEROLOGY_PROXY_TOKEN || '',
    now = () => Date.now(),
    buckets = new Map()
} = {}) {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT;
    const safeWindow = Number.isInteger(windowMs) && windowMs > 0 ? windowMs : DEFAULT_WINDOW_MS;
    return function numerologyRateLimit(req, res, next) {
        if (req.method === 'OPTIONS') return next();
        const time = now();
        const key = numerologyClientKey(req, { trustProxy, proxyToken });
        let bucket = buckets.get(key);
        if (!bucket || time >= bucket.resetAt) {
            bucket = { count: 0, resetAt: time + safeWindow };
            buckets.set(key, bucket);
        }
        if (buckets.size > 4096) {
            for (const [storedKey, stored] of buckets) if (time >= stored.resetAt) buckets.delete(storedKey);
        }
        bucket.count += 1;
        res.set('RateLimit-Limit', String(safeLimit));
        res.set('RateLimit-Remaining', String(Math.max(0, safeLimit - bucket.count)));
        res.set('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));
        if (bucket.count <= safeLimit) return next();
        const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - time) / 1000));
        res.set('Retry-After', String(retryAfter));
        const loggedPath = String(req.originalUrl || req.url || '').split('?')[0];
        console.log(`${req.method} ${loggedPath}`);
        return res.status(429).json({
            ok: false,
            error: {
                code: 'RATE_LIMITED',
                message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một lúc rồi thử lại.',
                fields: []
            }
        });
    };
}
