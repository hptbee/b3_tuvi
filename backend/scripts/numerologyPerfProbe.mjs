import { mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

process.env.SQLITE_PATH = path.join(mkdtempSync(path.join(os.tmpdir(), 'numerology-perf-')), 'tuvi.sqlite');
process.env.NUMEROLOGY_RATE_LIMIT = '100000';
const { initDatabase } = await import('../src/db/sqlite.js');
const { createApp } = await import('../src/app.js');
initDatabase();
const server = await new Promise(resolve => {
    const instance = createApp().listen(0, '127.0.0.1', () => resolve(instance));
});
const base = `http://127.0.0.1:${server.address().port}`;
const post = body => fetch(`${base}/api/numerology/calculate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
});
const elapsed = async work => {
    const start = performance.now();
    const result = await work();
    return { ms: performance.now() - start, result };
};
const birth = { birthDate: { year: 1990, month: 6, day: 15 }, fullName: 'Nguyễn Văn An' };
try {
    const before = process.memoryUsage();
    const sequential = [];
    for (let index = 0; index < 30; index += 1) sequential.push(await elapsed(() => post(birth)));
    const concurrentStarted = performance.now();
    const concurrent = await Promise.all(Array.from({ length: 20 }, () => post(birth)));
    const concurrentMs = performance.now() - concurrentStarted;
    const oversized = await elapsed(() => fetch(`${base}/api/numerology/calculate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: `{"pad":"${'A'.repeat(300 * 1024)}"}`
    }));
    const unicode = await elapsed(() => post({ ...birth, fullName: '漢' }));
    const longName = await elapsed(() => post({ ...birth, fullName: 'A'.repeat(100) }));
    const invalidDate = await elapsed(() => post({ birthDate: { year: 1990, month: 2, day: 31 } }));
    const after = process.memoryUsage();
    const times = sequential.map(item => item.ms).sort((left, right) => left - right);
    const percentile = ratio => times[Math.min(times.length - 1, Math.ceil(times.length * ratio) - 1)];
    console.log(JSON.stringify({
        environment: { node: process.version, platform: process.platform, arch: process.arch },
        sequential: { count: times.length, minMs: times[0], p50Ms: percentile(0.5), p95Ms: percentile(0.95), maxMs: times.at(-1) },
        concurrent: { count: concurrent.length, wallMs: concurrentMs, statuses: concurrent.map(response => response.status) },
        oversized: { status: oversized.result.status, ms: oversized.ms },
        unicode: { status: unicode.result.status, ms: unicode.ms },
        longName: { status: longName.result.status, ms: longName.ms },
        invalidDate: { status: invalidDate.result.status, ms: invalidDate.ms },
        cacheControl: sequential[0].result.headers.get('cache-control'),
        memory: {
            heapUsedBefore: before.heapUsed,
            heapUsedAfter: after.heapUsed,
            rssBefore: before.rss,
            rssAfter: after.rss
        }
    }, null, 2));
} finally {
    await new Promise(resolve => server.close(resolve));
}
