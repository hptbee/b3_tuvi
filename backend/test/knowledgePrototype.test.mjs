import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import { applyKnowledgePrototype, assertSafePrototypePath } from '../src/db/knowledgePrototype.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const sqliteSource = fs.readFileSync(path.join(here, '../src/db/sqlite.js'), 'utf8');
assert.ok(!sqliteSource.includes('applyKnowledgePrototype'));
assert.ok(!sqliteSource.includes('knowledgePrototype'));

const refused = path.join(os.tmpdir(), 'backend', 'data', 'tuvi.sqlite');
assert.throws(() => assertSafePrototypePath(refused), /refuses/);
assert.ok(!fs.existsSync(refused));

const dotted = path.join(os.tmpdir(), 'backend', 'data.', 'tuvi.sqlite');
assert.throws(() => assertSafePrototypePath(dotted), /refuses/);
assert.ok(!fs.existsSync(path.join(os.tmpdir(), 'backend', 'data', 'tuvi.sqlite')));

if (process.platform === 'win32') {
    const linkRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-kb-link-'));
    const target = path.join(linkRoot, 'backend', 'data');
    fs.mkdirSync(target, { recursive: true });
    const link = path.join(linkRoot, 'link');
    fs.symlinkSync(target, link, 'junction');
    assert.throws(() => applyKnowledgePrototype(path.join(link, 'tuvi.sqlite')), /refuses/);
    assert.ok(!fs.existsSync(path.join(target, 'tuvi.sqlite')));
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-kb-'));
const dbPath = path.join(dir, 'prototype.sqlite');
const first = applyKnowledgePrototype(dbPath);
const second = applyKnowledgePrototype(dbPath);
assert.strictEqual(first.version, '1');
assert.strictEqual(second.version, '1');
assert.strictEqual(first.claims, 0);
assert.strictEqual(second.claims, 0);

const db = new DatabaseSync(dbPath);
const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`).all().map((row) => row.name);
for (const name of ['sources', 'editions', 'claims', 'claim_sources', 'claim_links', 'claim_revisions', 'combination_claims', 'school_variants']) {
    assert.ok(tables.includes(name), name);
}
assert.strictEqual(db.prepare('SELECT COUNT(*) AS n FROM sources').get().n, 0);
assert.strictEqual(db.prepare(`SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'schema_meta'`).get().n, 0);
db.close();

console.log('knowledge prototype stays off schema v1 and backend/data');
