import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';
import {
    applyKnowledgePrototype,
    applyPrototypeStatements,
    assertSafePrototypePath,
    backupPrototype,
    refusesLinkedStat,
    restorePrototype
} from '../src/db/knowledgePrototype.js';

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

assert.strictEqual(refusesLinkedStat({ isSymbolicLink: () => true, nlink: 1 }), true);
assert.strictEqual(refusesLinkedStat({ isSymbolicLink: () => false, nlink: 2 }), true);
assert.strictEqual(refusesLinkedStat({ isSymbolicLink: () => false, nlink: 1 }), false);

const escaped = path.join(os.tmpdir(), '..', `tuvi-escape-${process.pid}.sqlite`);
assert.throws(() => assertSafePrototypePath(escaped), /refuses/);
assert.ok(!fs.existsSync(path.resolve(escaped)));

const linkDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-kb-filelink-'));
const outsideFile = path.join(path.dirname(fs.realpathSync(os.tmpdir())), `tuvi-kb-secret-${process.pid}.sqlite`);
try {
    fs.writeFileSync(outsideFile, 'sentinel');
    const linkedDb = path.join(linkDir, 'prototype.sqlite');
    fs.linkSync(outsideFile, linkedDb);
    assert.throws(() => applyKnowledgePrototype(linkedDb), /refuses/);
    assert.strictEqual(fs.readFileSync(outsideFile, 'utf8'), 'sentinel');
    let fileSymlinkCreated = false;
    const symlinkDb = path.join(linkDir, 'symlink.sqlite');
    try {
        fs.symlinkSync(outsideFile, symlinkDb, 'file');
        fileSymlinkCreated = true;
    } catch (error) {
        if (error.code !== 'EPERM' && error.code !== 'ENOTSUP') throw error;
    }
    if (fileSymlinkCreated) {
        assert.throws(() => applyKnowledgePrototype(symlinkDb), /refuses/);
        assert.strictEqual(fs.readFileSync(outsideFile, 'utf8'), 'sentinel');
    }
} finally {
    fs.rmSync(outsideFile, { force: true });
    fs.rmSync(linkDir, { recursive: true, force: true });
}

const rollbackDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-kb-rollback-'));
try {
    const rollbackPath = path.join(rollbackDir, 'rollback.sqlite');
    const rollbackDb = new DatabaseSync(rollbackPath);
    assert.throws(
        () => applyPrototypeStatements(rollbackDb, 'CREATE TABLE should_rollback (id INTEGER); THIS IS NOT SQL;'),
        /syntax|not sql|near/i
    );
    assert.strictEqual(
        rollbackDb.prepare(`SELECT name FROM sqlite_master WHERE name = 'should_rollback'`).get(),
        undefined
    );
    rollbackDb.close();
} finally {
    fs.rmSync(rollbackDir, { recursive: true, force: true });
}

const recoveryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-kb-recovery-'));
try {
    const recoveryPath = path.join(recoveryDir, 'prototype.sqlite');
    applyKnowledgePrototype(recoveryPath);
    const seeded = new DatabaseSync(recoveryPath);
    seeded.prepare(`INSERT INTO sources (source_id, title, bibliographic_status) VALUES ('fixture', 'synthetic', 'secondary')`).run();
    seeded.close();
    const backup = backupPrototype(recoveryPath);
    const wiped = new DatabaseSync(recoveryPath);
    wiped.prepare('DELETE FROM sources').run();
    wiped.close();
    restorePrototype(recoveryPath, backup);
    const restored = new DatabaseSync(recoveryPath);
    assert.strictEqual(restored.prepare(`SELECT COUNT(*) AS n FROM sources`).get().n, 1);
    assert.strictEqual(restored.prepare(`SELECT value FROM kb_prototype_meta WHERE key = 'version'`).get().value, '1');
    restored.close();
} finally {
    fs.rmSync(recoveryDir, { recursive: true, force: true });
}

console.log('knowledge prototype stays off schema v1 and backend/data');
