import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { logSafeError, safeErrorFields } from '../src/http/safeErrorLog.js';
import { requestLogLine } from '../src/http/requestLog.js';

const error = new Error('calculation failed');
error.body = { name: 'Lan', day: 1, month: 2, year: 1990, hour: 3, gender: 'nu' };
error.query = { hour: 3 };
const fields = safeErrorFields(error);
assert.strictEqual(fields.name, 'Error');
assert.strictEqual(fields.message, 'calculation failed');
assert.ok(!('body' in fields));
assert.ok(!('query' in fields));

const lines = [];
const original = console.error;
console.error = (...args) => lines.push(args.map((item) => String(item)).join(' '));
try {
    logSafeError('Tuvi Calculation Error', error);
} finally {
    console.error = original;
}
const logged = lines.join('\n');
assert.match(logged, /Tuvi Calculation Error Error calculation failed/);
assert.ok(!logged.includes('Lan'));
assert.ok(!logged.includes('1990'));

const routes = ['chartRoutes.js', 'combinationRoutes.js', 'meaningRoutes.js'];
for (const name of routes) {
    const source = readFileSync(fileURLToPath(new URL(`../src/routes/${name}`, import.meta.url)), 'utf8');
    assert.match(source, /logSafeError\(/);
    assert.ok(!source.includes('console.error'));
}

const loggedRequest = requestLogLine({
    method: 'POST',
    url: '/api/charts/generate?year=1990&day=15',
    path: '/api/charts/generate'
});
assert.strictEqual(loggedRequest, 'POST /api/charts/generate');
assert.ok(!loggedRequest.includes('1990'));
assert.strictEqual(requestLogLine({ method: 'GET', url: '/api/health?hour=3' }), 'GET /api/health');
const serverSource = readFileSync(fileURLToPath(new URL('../src/app.js', import.meta.url)), 'utf8');
assert.ok(serverSource.includes('requestLogLine'));
assert.ok(!serverSource.includes('req.url'));

console.log('route error logs omit birth fields attached to the error');
