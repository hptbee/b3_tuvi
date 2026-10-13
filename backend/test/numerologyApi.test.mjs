import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { brotliCompressSync, deflateSync, gzipSync } from 'node:zlib';

const dir = mkdtempSync(path.join(os.tmpdir(), 'numerology-api-'));
process.env.SQLITE_PATH = path.join(dir, 'tuvi.sqlite');
const { initDatabase, closeDatabase } = await import('../src/db/sqlite.js');
const { countHoroscopes, countStars, countPalaces } = await import('../src/db/repositories.js');
const { createApp } = await import('../src/app.js');
const { calculateNumerology } = await import('../src/numerology/calculate.js');
initDatabase();
const before = [countHoroscopes(), countStars(), countPalaces()];
const server = await new Promise(resolve => {
    const instance = createApp().listen(0, '127.0.0.1', () => resolve(instance));
});
const base = `http://127.0.0.1:${server.address().port}`;
const birth = { birthDate: { year: 1990, month: 6, day: 15 }, fullName: 'Nguyễn Văn An' };
const post = (body, headers = {}) => fetch(`${base}/api/numerology/calculate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body
});
try {
    const profilesResponse = await fetch(`${base}/api/numerology/profiles`);
    assert.equal(profilesResponse.headers.get('cache-control'), 'no-store');
    const profiles = await profilesResponse.json();
    assert.equal(profiles.profiles.length, 1);
    assert.equal(profiles.profiles[0].status, 'experimental');
    const preflight = await fetch(`${base}/api/numerology/calculate`, {
        method: 'OPTIONS', headers: {
            Origin: 'https://example.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'content-type'
        }
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('cache-control'), 'no-store');
    assert.equal(preflight.headers.get('access-control-allow-origin'), '*');
    assert.ok(preflight.headers.get('access-control-allow-methods').includes('POST'));
    const originalLog = console.log;
    const logs = [];
    let response;
    console.log = (...args) => logs.push(args.join(' '));
    try { response = await post(JSON.stringify(birth)); } finally { console.log = originalLog; }
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const result = await response.json();
    assert.match(result.referenceDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.deepEqual(result, calculateNumerology(birth, result.referenceDate));
    assert.equal(result.metrics.lifePath.value, 4);
    assert.equal(result.metrics.personality.value, 11);
    assert.equal(result.nameAnalysis.normalized, 'NGUYEN VAN AN');
    assert.equal(result.metrics.lifePath.meaning, null);
    assert.equal(result.profile.version, '1.1.0');
    assert.equal(result.capabilities.birthGrid, 'available');
    assert.equal(result.capabilities.cycles, 'available');
    assert.equal(result.cycles.targetDate, result.referenceDate);
    assert.deepEqual(result.birthGrid.counts, { 1: 2, 2: 0, 3: 0, 4: 0, 5: 1, 6: 1, 7: 0, 8: 0, 9: 2 });
    const selected = await post(JSON.stringify({ ...birth, targetDate: '2027-01-01' }));
    assert.equal(selected.headers.get('cache-control'), 'no-store');
    const selectedResult = await selected.json();
    assert.deepEqual([selectedResult.cycles.personalYear.value, selectedResult.cycles.personalMonth.value, selectedResult.cycles.personalDay.value], [5, 6, 7]);
    assert.equal(selectedResult.cycles.targetDate, '2027-01-01');
    assert.ok(logs.some(line => line.includes('POST /api/numerology/calculate')));
    for (const privateValue of ['Nguyễn', 'NGUYEN', '1990', 'fullName', 'birthDate']) assert.ok(!logs.join('\n').includes(privateValue));

    const unnamed = await (await post(JSON.stringify({ birthDate: birth.birthDate }))).json();
    assert.equal(unnamed.metrics.expression.status, 'unavailable');
    assert.equal(unnamed.metrics.expression.value, null);
    const cases = [
        [null, 400, 'INVALID_JSON'], [1, 400, 'INVALID_JSON'], [[], 400, 'INVALID_BODY'],
        [{ ...birth, birthDate: { year: 1900, month: 2, day: 29 } }, 400, 'INVALID_BIRTH_DATE'],
        [{ ...birth, birthDate: { year: 2199, month: 1, day: 1 } }, 400, 'INVALID_BIRTH_DATE'],
        [{ ...birth, fullName: 'A\u034F' }, 400, 'UNSUPPORTED_NAME_CHARACTER'],
        [{ ...birth, fullName: '漢字' }, 400, 'UNSUPPORTED_NAME_CHARACTER'],
        [{ ...birth, metrics: { lifePath: 9 } }, 400, 'CLIENT_RESULT_REJECTED'],
        [{ ...birth, profileId: 'fake' }, 404, 'PROFILE_NOT_FOUND'],
        [{ ...birth, profileVersion: '2.0.0' }, 404, 'PROFILE_NOT_FOUND'],
        [{ ...birth, locale: 'en-US' }, 400, 'UNSUPPORTED_LOCALE'],
        [{ ...birth, targetDate: '1990-06-14' }, 400, 'INVALID_TARGET_DATE'],
        [{ ...birth, targetDate: '2026-02-30' }, 400, 'INVALID_TARGET_DATE'],
        [{ ...birth, targetDate: null }, 400, 'INVALID_TARGET_DATE'],
        [{ ...birth, cycles: { personalYear: 1 } }, 400, 'CLIENT_RESULT_REJECTED'],
        [{ ...birth, birthGrid: {} }, 400, 'CLIENT_RESULT_REJECTED'],
        [{ ...birth, profileVersion: '1.0.0' }, 404, 'PROFILE_NOT_FOUND']
    ];
    for (const [body, status, code] of cases) {
        const failure = await post(JSON.stringify(body));
        assert.equal(failure.status, status);
        assert.equal(failure.headers.get('cache-control'), 'no-store');
        const content = await failure.json();
        assert.equal(content.ok, false);
        assert.equal(content.error.code, code);
        assert.ok(Array.isArray(content.error.fields));
    }
    const malformed = await post('{');
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error.code, 'INVALID_JSON');
    assert.equal(malformed.headers.get('cache-control'), 'no-store');
    const oversized = await post(JSON.stringify({ fullName: 'A'.repeat(300000) }));
    assert.equal(oversized.status, 413);
    assert.equal((await oversized.json()).error.code, 'PAYLOAD_TOO_LARGE');
    assert.equal(oversized.headers.get('cache-control'), 'no-store');
    const compressedBody = gzipSync(JSON.stringify(birth));
    const compressedSuccess = await post(compressedBody, { 'Content-Encoding': 'gzip' });
    assert.equal(compressedSuccess.status, 200);
    assert.equal(compressedSuccess.headers.get('cache-control'), 'no-store');
    assert.equal((await compressedSuccess.json()).metrics.lifePath.value, 4);
    const corruptBody = Buffer.from(compressedBody);
    corruptBody[corruptBody.length - 1] ^= 0xff;
    const brotliBody = brotliCompressSync(JSON.stringify(birth));
    const corruptBrotli = Buffer.from(brotliBody);
    corruptBrotli[0] ^= 0xff;
    const deflateBody = deflateSync(JSON.stringify(birth));
    const corruptDeflate = Buffer.from(deflateBody);
    corruptDeflate[corruptDeflate.length - 1] ^= 0xff;
    for (const [body, encoding] of [[brotliBody, 'br'], [deflateBody, 'deflate']]) {
        const success = await post(body, { 'Content-Encoding': encoding });
        assert.equal(success.status, 200);
        assert.equal((await success.json()).metrics.lifePath.value, 4);
    }
    const decodingCases = [
        [JSON.stringify(birth), { 'Content-Type': 'application/json; charset=iso-8859-1' }, 415, 'UNSUPPORTED_CHARSET'],
        [JSON.stringify(birth), { 'Content-Encoding': 'private-nguyen-1990' }, 415, 'UNSUPPORTED_ENCODING'],
        [corruptBody, { 'Content-Encoding': 'gzip' }, 400, 'INVALID_BODY_ENCODING'],
        [compressedBody.subarray(0, compressedBody.length - 8), { 'Content-Encoding': 'gzip' }, 400, 'INVALID_BODY_ENCODING'],
        [corruptBrotli, { 'Content-Encoding': 'br' }, 400, 'INVALID_BODY_ENCODING'],
        [brotliBody.subarray(0, brotliBody.length - 1), { 'Content-Encoding': 'br' }, 400, 'INVALID_BODY_ENCODING'],
        [corruptDeflate, { 'Content-Encoding': 'deflate' }, 400, 'INVALID_BODY_ENCODING'],
        [deflateBody.subarray(0, deflateBody.length - 4), { 'Content-Encoding': 'deflate' }, 400, 'INVALID_BODY_ENCODING'],
        [deflateSync(JSON.stringify(birth), { dictionary: Buffer.from('birthDateyearmonthday') }),
            { 'Content-Encoding': 'deflate' }, 400, 'INVALID_BODY_ENCODING']
    ];
    const originalParserError = console.error;
    const parserErrorLogs = [];
    try {
        console.error = (...args) => parserErrorLogs.push(args.join(' '));
        for (const [body, headers, status, code] of decodingCases) {
            const failure = await post(body, headers);
            assert.equal(failure.status, status);
            assert.equal(failure.headers.get('cache-control'), 'no-store');
            const content = await failure.json();
            assert.equal(content.ok, false);
            assert.equal(content.error.code, code);
            assert.equal(typeof content.error.message, 'string');
            assert.deepEqual(content.error.fields, []);
            for (const privateValue of ['Nguyễn', '1990', 'fullName', 'birthDate', 'private-nguyen']) {
                assert.ok(!JSON.stringify(content).includes(privateValue));
            }
        }
    } finally {
        console.error = originalParserError;
    }
    assert.deepEqual(parserErrorLogs, []);
    const formatter = Intl.DateTimeFormat;
    const originalError = console.error;
    const errorLogs = [];
    try {
        console.error = (...args) => errorLogs.push(args.join(' '));
        const internalCases = [
            [undefined, undefined, JSON.stringify(birth), {}],
            [400, undefined, JSON.stringify(birth), {}],
            [415, undefined, JSON.stringify(birth), {}],
            [400, 'Z_DATA_ERROR', compressedBody, { 'Content-Encoding': 'gzip' }],
            [400, 'ERR__ERROR_FORMAT_PADDING_1', brotliBody, { 'Content-Encoding': 'br' }]
        ];
        for (const [status, code, body, headers] of internalCases) {
            Intl.DateTimeFormat = function () {
                throw Object.assign(new Error('private internal input Nguyễn 1990'), { status, code, expose: true });
            };
            const unexpected = await post(body, headers);
            assert.equal(unexpected.status, 500);
            const internalFailure = await unexpected.json();
            assert.equal(internalFailure.error.code, 'CALCULATION_FAILED');
            assert.equal(unexpected.headers.get('cache-control'), 'no-store');
            assert.ok(!JSON.stringify(internalFailure).includes('private internal'));
        }
    } finally {
        Intl.DateTimeFormat = formatter;
        console.error = originalError;
    }
    assert.deepEqual(errorLogs, Array(5).fill('Numerology calculation failed'));
    const legacy = await fetch(`${base}/api/charts/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal(legacy.status, 400);
    assert.deepEqual(await legacy.json(), { error: 'JSON không hợp lệ' });
    assert.deepEqual([countHoroscopes(), countStars(), countPalaces()], before);
    console.log('numerology API: calculation, profiles, malformed/oversize/compressed input, preflight, cache/log privacy and no persistence passed');
} finally {
    await new Promise(resolve => server.close(resolve));
    closeDatabase();
    rmSync(dir, { recursive: true, force: true });
}
