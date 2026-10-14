import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createNumerologyRateLimit, numerologyClientKey } from '../src/http/numerologyRateLimit.js';

function request(forwarded, token, address = '10.1.1.1') {
    return {
        method: 'POST',
        path: '/api/numerology/calculate',
        url: '/api/numerology/calculate',
        socket: { remoteAddress: address },
        get(name) {
            const header = name.toLowerCase();
            if (header === 'x-forwarded-for') return forwarded;
            if (header === 'x-numerology-proxy-token') return token;
            return undefined;
        }
    };
}
function response() {
    const headers = {};
    return {
        headers,
        set(name, value) { headers[name] = value; },
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; }
    };
}

const direct = numerologyClientKey(request('1.1.1.1, 2.2.2.2', 'secret'), { trustProxy: false, proxyToken: 'secret' });
assert.equal(direct, 'direct:10.1.1.1');
assert.equal(numerologyClientKey(request('1.1.1.1, 2.2.2.2', 'nope'), { trustProxy: true, proxyToken: 'secret' }), 'direct:10.1.1.1');
assert.equal(numerologyClientKey(request('1.1.1.1, 2.2.2.2', 'secret'), { trustProxy: true, proxyToken: 'secret' }), 'fwd:2.2.2.2');
assert.equal(numerologyClientKey(request('spoofed', 'secret'), { trustProxy: true, proxyToken: 'secret' }), 'fwd:spoofed');
assert.equal(numerologyClientKey(request('', 'secret'), { trustProxy: true, proxyToken: 'secret' }), 'direct:10.1.1.1');
assert.equal(numerologyClientKey({ get: () => undefined, socket: {} }, { trustProxy: true, proxyToken: 'secret' }), 'direct:unknown');
assert.equal(numerologyClientKey(request('x'.repeat(81), 'secret'), { trustProxy: true, proxyToken: 'secret' }), 'direct:10.1.1.1');
const fallback = createNumerologyRateLimit({ limit: 0, windowMs: -1, now: () => 5 });
let fallbackPassed = false;
fallback(request('', ''), response(), () => { fallbackPassed = true; });
assert.equal(fallbackPassed, true);
const crowded = new Map();
const crowdedLimit = createNumerologyRateLimit({ limit: 1, windowMs: 10, now: () => 50, buckets: crowded });
for (let index = 0; index < 10_000; index += 1) {
    const reply = response();
    let accepted = false;
    crowdedLimit(request('', '', `10.0.0.${index}`), reply, () => { accepted = true; });
    assert.equal(accepted, index < 4096);
    if (index >= 4096) {
        assert.equal(reply.statusCode, 429);
        assert.equal(reply.body.error.code, 'RATE_LIMITED');
        assert.equal(reply.headers['RateLimit-Remaining'], '0');
        assert.equal(reply.headers['Retry-After'], '1');
    }
}
assert.equal(crowded.size, 4096);
const activeReply = response();
crowdedLimit(request('', '', '10.0.0.0'), activeReply, () => assert.fail('active key must not be evicted'));
assert.equal(activeReply.statusCode, 429);
assert.equal(crowded.get('direct:10.0.0.0').count, 2);

let scannedEntries = 0;
class ObservedMap extends Map {
    *[Symbol.iterator]() {
        for (const entry of super[Symbol.iterator]()) { scannedEntries += 1; yield entry; }
    }
}
const bounded = new ObservedMap();
let boundedNow = 0;
const boundedLimit = createNumerologyRateLimit({ maxKeys: 2, limit: 1, windowMs: 2000, now: () => boundedNow, buckets: bounded });
boundedLimit(request('', '', 'first'), response(), () => {});
boundedLimit(request('', '', 'second'), response(), () => {});
for (let index = 0; index < 1000; index += 1) {
    boundedLimit(request('', '', `denied-${index}`), response(), () => assert.fail('overflow must fail closed'));
}
assert.equal(bounded.size, 2);
assert.equal(scannedEntries, 0, 'denied traffic must not scan live buckets for each request');
boundedNow = 1000;
boundedLimit(request('', '', 'third'), response(), () => assert.fail('live budgets must remain'));
assert.equal(scannedEntries, 2);
boundedNow = 2000;
let recovered = false;
boundedLimit(request('', '', 'third'), response(), () => { recovered = true; });
assert.equal(recovered, true);
assert.equal(bounded.size, 1);
assert.equal(scannedEntries, 4);
const invalidCapacity = new Map();
createNumerologyRateLimit({ maxKeys: -1, buckets: invalidCapacity })(request('', ''), response(), () => {});
assert.equal(invalidCapacity.size, 1);
const expiring = new Map();
let expiringNow = 0;
const expiringLimit = createNumerologyRateLimit({ limit: 1, windowMs: 10, now: () => expiringNow, buckets: expiring });
for (let index = 0; index < 4097; index += 1) expiringLimit(request('', '', `10.8.0.${index}`), response(), () => {});
expiringNow = 20;
expiringLimit(request('', '', '10.8.1.1'), response(), () => {});
assert.ok(expiring.size < 10);

let clock = 1_000;
const buckets = new Map();
const limit = createNumerologyRateLimit({ limit: 2, windowMs: 1_000, trustProxy: false, now: () => clock, buckets });
const seen = [];
const run = forwarded => {
    const res = response();
    let passed = false;
    limit(request(forwarded, 'secret'), res, () => { passed = true; });
    seen.push({ passed, status: res.statusCode, retry: res.headers['Retry-After'], body: res.body });
};
run('203.0.113.5');
run('198.51.100.9');
run('203.0.113.5');
assert.equal(seen[0].passed, true);
assert.equal(seen[1].passed, true);
assert.equal(seen[2].passed, false);
assert.equal(seen[2].status, 429);
assert.equal(seen[2].retry, '1');
assert.equal(seen[2].body.error.code, 'RATE_LIMITED');
assert.equal(JSON.stringify(seen[2].body).includes('203.0.113.5'), false);
clock = 2_000;
run('203.0.113.5');
assert.equal(seen[3].passed, true);

const options = response();
let optionsPassed = false;
limit({ method: 'OPTIONS', get: () => undefined, socket: { remoteAddress: '10.1.1.1' } }, options, () => { optionsPassed = true; });
assert.equal(optionsPassed, true);

process.env.SQLITE_PATH = path.join(mkdtempSync(path.join(os.tmpdir(), 'numerology-rate-')), 'tuvi.sqlite');
process.env.NUMEROLOGY_RATE_LIMIT = '2';
process.env.NUMEROLOGY_RATE_WINDOW_MS = '60000';
process.env.NUMEROLOGY_TRUST_PROXY = '0';
const { initDatabase } = await import('../src/db/sqlite.js');
const { createApp } = await import('../src/app.js');
initDatabase();
const server = await new Promise(resolve => {
    const instance = createApp().listen(0, '127.0.0.1', () => resolve(instance));
});
const base = `http://127.0.0.1:${server.address().port}`;
const logs = [];
const original = console.log;
console.log = (...args) => logs.push(args.join(' '));
try {
    const body = birthDate => JSON.stringify({ birthDate, fullName: 'Nguyễn Văn An' });
    const first = await fetch(`${base}/api/numerology/calculate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.8' }, body: body({ year: 1990, month: 6, day: 15 })
    });
    const second = await fetch(`${base}/api/numerology/profiles`, { headers: { 'X-Forwarded-For': '198.51.100.8' } });
    const blocked = await fetch(`${base}/api/numerology/meanings/lifePath/4`, { headers: { 'X-Forwarded-For': '192.0.2.8' } });
    assert.equal(first.status, 200);
    assert.equal(first.headers.get('cache-control'), 'no-store');
    assert.equal(second.status, 200);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get('cache-control'), 'no-store');
    assert.equal(blocked.headers.get('retry-after'), '60');
    assert.equal((await blocked.json()).error.code, 'RATE_LIMITED');
    const chart = await fetch(`${base}/api/charts/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 })
    });
    assert.equal(chart.status, 200);
    assert.equal(logs.some(line => line.includes('429') || line.includes('Nguyễn') || line.includes('1990')), false);
    assert.ok(logs.some(line => line === 'GET /api/numerology/meanings/lifePath/4'));
} finally {
    console.log = original;
    await new Promise(resolve => server.close(resolve));
}
console.log('numerology rate limit: shared socket key, proxy token, reset and HTTP 429 passed');
