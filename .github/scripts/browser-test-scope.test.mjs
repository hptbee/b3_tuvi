import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { requiresBrowser, comparison, run } from './browser-test-scope.mjs';

for (const file of ['backend/src/time/modernMajor.js', 'frontend/src/components/StructuredAnalysis.jsx',
    'frontend/src/components/StructuredAnalysis.test.jsx', 'docs/engineering/quality/TEST_STRATEGY.md']) {
    assert.equal(requiresBrowser([file]), false, file);
}
for (const file of ['frontend/e2e/chart.spec.js', 'frontend/playwright.config.js',
    'frontend/package.json', 'frontend/package-lock.json']) assert.equal(requiresBrowser([file]), true, file);
assert.equal(requiresBrowser([], true), true);
assert.equal(requiresBrowser([]), false);
const a = 'a'.repeat(40), b = 'b'.repeat(40), zero = '0'.repeat(40);
assert.deepEqual(comparison('pull_request', { pull_request: { base: { sha: a }, head: { sha: b } } }, args => {
    assert.deepEqual(args, ['diff', '--name-only', '-z', a, b, '--']);
    return 'backend/test/example.test.mjs\0frontend/src/app.jsx\0';
}).paths, ['backend/test/example.test.mjs', 'frontend/src/app.jsx']);
assert.equal(comparison('workflow_dispatch', { inputs: { browser_e2e: 'false' } }).manual, false);
assert.equal(comparison('workflow_dispatch', { inputs: { browser_e2e: 'true' } }).manual, true);
assert.deepEqual(comparison('push', { before: a, after: zero }).paths, []);
assert.throws(() => comparison('pull_request', {}, () => ''), /invalid/);
assert.throws(() => comparison('push', { before: zero, after: b }, () => ''), /default branch/);
assert.throws(() => comparison('push', { before: a, after: b }, () => { throw Error('Git comparison unavailable'); }), /unavailable/);
// A real temporary Git history checks changed/deleted browser paths and safe new-branch baselines.
const temp = mkdtempSync(join(tmpdir(), 'b3-browser-scope-'));
try {
    const git = args => execFileSync('git', args, { cwd: temp, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    git(['init', '-b', 'main']); git(['config', 'user.email', 'test@example.invalid']); git(['config', 'user.name', 'B3 test']);
    writeFileSync(join(temp, 'base.txt'), 'base\n'); git(['add', 'base.txt']); git(['commit', '-m', 'base']);
    const first = git(['rev-parse', 'HEAD']).trim(); git(['update-ref', 'refs/remotes/origin/main', first]);
    git(['switch', '-c', 'domain']); writeFileSync(join(temp, 'domain.txt'), 'domain\n'); git(['add', 'domain.txt']); git(['commit', '-m', 'domain']);
    const head = git(['rev-parse', 'HEAD']).trim();
    const selection = comparison('push', { before: zero, after: head, repository: { default_branch: 'main' } }, git);
    assert.deepEqual(selection.paths, ['domain.txt']); assert.equal(requiresBrowser(selection.paths), false);
    const eventPath = join(temp, 'event.json'), output = join(temp, 'output'), summary = join(temp, 'summary');
    writeFileSync(eventPath, JSON.stringify({ inputs: { browser_e2e: 'false' } }));
    assert.equal(run({ GITHUB_EVENT_PATH: eventPath, GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_OUTPUT: output, GITHUB_STEP_SUMMARY: summary }), false);
    assert.match(readFileSync(output, 'utf8'), /run_browser=false/); assert.match(readFileSync(summary, 'utf8'), /NOT RUN/);
    writeFileSync(eventPath, JSON.stringify({ inputs: { browser_e2e: 'true' } }));
    assert.equal(run({ GITHUB_EVENT_PATH: eventPath, GITHUB_EVENT_NAME: 'workflow_dispatch' }), true);
} finally { rmSync(temp, { recursive: true, force: true }); }
console.log('Browser-scope routing: domain/component exclusion, browser opt-in, invalid ranges, real Git and truthful skip receipts passed');
