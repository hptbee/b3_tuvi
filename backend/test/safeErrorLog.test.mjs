import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { logSafeError, safeErrorFields } from '../src/http/safeErrorLog.js';

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

console.log('route error logs omit birth fields attached to the error');
