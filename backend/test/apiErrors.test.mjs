import assert from 'node:assert/strict';
import { apiErrorHandler } from '../src/http/apiErrors.js';

const lines = [];
const original = console.error;
console.error = (...args) => lines.push(args.join(' '));
try {
    for (const [error, status, body] of [
        [{ type: 'entity.parse.failed' }, 400, { error: 'JSON không hợp lệ' }],
        [{ type: 'entity.too.large' }, 413, { error: 'Dữ liệu gửi lên quá lớn' }],
        [{ status: 413 }, 413, { error: 'Dữ liệu gửi lên quá lớn' }]
    ]) {
        const response = { headersSent: false, status(value) { this.statusCode = value; return this; }, json(value) { this.body = value; return this; } };
        apiErrorHandler(error, {}, response, () => assert.fail('must handle legacy parser error'));
        assert.equal(response.statusCode, status);
        assert.deepEqual(response.body, body);
    }
    for (const environment of ['development', 'production']) {
        const secret = new Error('Private Name 1990-06-15 /private/source.js');
        secret.body = { fullName: 'Private Name' };
        secret.status = 503;
        const response = { headersSent: false, status(value) { this.statusCode = value; return this; }, json(value) { this.body = value; return this; } };
        apiErrorHandler(secret, { app: { get: () => environment } }, response, () => assert.fail('must handle error'));
        assert.equal(response.statusCode, 500);
        assert.equal(response.body.code, 'INTERNAL_ERROR');
        assert.doesNotMatch(JSON.stringify(response.body), /Private|1990|source|stack/);
    }
    const error = new Error('already sent');
    let forwarded;
    apiErrorHandler(error, {}, { headersSent: true }, value => { forwarded = value; });
    assert.equal(forwarded, error);
    assert.deepEqual(lines, ['API request failed', 'API request failed']);
} finally {
    console.error = original;
}
console.log('shared API errors omit private error details and forward completed responses');
