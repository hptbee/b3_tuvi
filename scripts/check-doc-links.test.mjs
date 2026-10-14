#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { checkMarkdownFile, runDocLinkCheck } from './check-doc-links.mjs';

const tmp = mkdtempSync(join(tmpdir(), 'doc-links-'));
mkdirSync(join(tmp, 'docs'), { recursive: true });
writeFileSync(join(tmp, 'README.md'), '# ok\n');
writeFileSync(join(tmp, 'docs', 'target.md'), '# target\n');
writeFileSync(
    join(tmp, 'docs', 'valid.md'),
    'See [readme](../README.md) and [self](./target.md).\n'
);
writeFileSync(join(tmp, 'docs', 'broken.md'), 'Bad [link](./missing.md)\n');

const validBroken = checkMarkdownFile(join(tmp, 'docs', 'valid.md'), tmp);
assert.equal(validBroken.length, 0, 'valid links should pass');

const broken = checkMarkdownFile(join(tmp, 'docs', 'broken.md'), tmp);
assert.equal(broken.length, 1);
assert.equal(broken[0].raw, './missing.md');

mkdirSync(join(tmp, 'rules'), { recursive: true });
writeFileSync(join(tmp, 'rules', 'portable.md'), 'Use `docs/missing-in-rules.md` for policy.\n');
const rulesBroken = checkMarkdownFile(join(tmp, 'rules', 'portable.md'), tmp);
assert.equal(rulesBroken.length, 1);
assert.equal(rulesBroken[0].kind, 'backtick');

writeFileSync(
    join(tmp, 'rules', 'b3-only.md'),
    'See `{B3_HOME}/docs/precedence.md` — not checked.\n'
);
const b3Only = checkMarkdownFile(join(tmp, 'rules', 'b3-only.md'), tmp);
assert.equal(b3Only.length, 0);

const repoResult = runDocLinkCheck({ repoRoot: tmp, scanRoots: ['docs', 'rules'] });
assert.ok(repoResult.allBroken.length >= 2);

console.log('check-doc-links.test.mjs: all assertions passed');
