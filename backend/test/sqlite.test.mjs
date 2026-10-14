import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-sqlite-'));
const dbPath = path.join(dir, 'tuvi.sqlite');
const originalDbPath = process.env.SQLITE_PATH;
process.env.SQLITE_PATH = dbPath;

const sqlite = await import('../src/db/sqlite.js');
const repo = await import('../src/db/repositories.js');

try {
    sqlite.initDatabase();
    assert.strictEqual(sqlite.initDatabase(), sqlite.getDb());
    const saved = repo.insertHoroscope({
        input_data: { name: 'An', day: 1, month: 2, year: 1991, hour: 3, gender: 1 },
        lunar_data: { lunarDay: 4 },
        full_chart: { menh: 6 }
    });
    sqlite.closeDatabase();
    sqlite.initDatabase();
    const loaded = repo.getHoroscopeById(saved.id);
    assert.strictEqual(loaded.input_data.name, 'An');
    assert.strictEqual(loaded.full_chart.menh, 6);
    assert.strictEqual(repo.getHoroscopeById(99999), null);

    repo.upsertStar({ name: 'Tử Vi', basic_meaning: 'lần một', palace_meanings: { Mệnh: 'a' } });
    repo.upsertStar({ name: 'Tử Vi', basic_meaning: 'lần hai', palace_meanings: { Mệnh: 'b' } });
    assert.strictEqual(repo.countStars(), 1);
    assert.strictEqual(repo.findStarByName('Tử Vi').basic_meaning, 'lần hai');
    assert.strictEqual(repo.findStarByName('Tử Vi').palace_meanings.Mệnh, 'b');

    const version = sqlite.getDb().prepare(`SELECT value FROM schema_meta WHERE key = 'schema_version'`).get();
    assert.strictEqual(version.value, '1');

    const other = new DatabaseSync(dbPath);
    other.exec('PRAGMA busy_timeout = 5000');
    other.prepare(`INSERT INTO palaces (palace_name, core_meaning) VALUES (?, ?)`).run('MỆNH', 'từ kết nối khác');
    other.close();
    assert.strictEqual(repo.findPalaceByName('MỆNH').core_meaning, 'từ kết nối khác');
    repo.upsertPalace({ palace_name: 'MỆNH', short_name: 'Mệnh', core_meaning: 'upsert' });
    assert.strictEqual(repo.countPalaces(), 1);
    assert.strictEqual(repo.findPalaceByName('MỆNH').core_meaning, 'upsert');

    sqlite.closeDatabase();
    const legacyPath = path.join(dir, 'legacy.sqlite');
    const legacy = new DatabaseSync(legacyPath);
    legacy.exec(`CREATE TABLE horoscopes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      input_data TEXT NOT NULL,
      lunar_data TEXT,
      full_chart TEXT NOT NULL,
      is_public INTEGER NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`);
    legacy.prepare(`INSERT INTO horoscopes (input_data, full_chart) VALUES (?, ?)`).run('{"name":"Cu"}', '{"menh":2}');
    legacy.close();
    process.env.SQLITE_PATH = legacyPath;
    sqlite.initDatabase();
    assert.strictEqual(sqlite.getDb().prepare(`SELECT value FROM schema_meta WHERE key = 'schema_version'`).get().value, '1');
    assert.strictEqual(repo.getHoroscopeById(1).input_data.name, 'Cu');
    sqlite.closeDatabase();

    for (const [index, metadataName] of ['schema_meta', 'SCHEMA_META'].entries()) {
        const futurePath = path.join(dir, `future-${index}.sqlite`);
        const future = new DatabaseSync(futurePath);
        future.exec(`
          CREATE TABLE ${metadataName} (key TEXT PRIMARY KEY, value TEXT NOT NULL);
          INSERT INTO ${metadataName} VALUES ('schema_version', '99');
          CREATE TABLE user_payload (id INTEGER PRIMARY KEY, content TEXT NOT NULL);
          CREATE INDEX payload_content ON user_payload(content);
          INSERT INTO user_payload VALUES (1, 'synthetic retained data');
        `);
        future.close();
        const snapshotFuture = () => {
            const connection = new DatabaseSync(futurePath, { readOnly: true });
            try {
                return {
                    schema: connection.prepare('SELECT type, name, tbl_name, sql FROM sqlite_master ORDER BY type, name').all(),
                    metadata: connection.prepare('SELECT * FROM schema_meta ORDER BY key').all(),
                    data: connection.prepare('SELECT * FROM user_payload ORDER BY id').all(),
                    journal: connection.prepare('PRAGMA journal_mode').get()
                };
            } finally { connection.close(); }
        };
        const futureBefore = snapshotFuture();
        assert.strictEqual(futureBefore.journal.journal_mode, 'delete');
        process.env.SQLITE_PATH = futurePath;
        assert.throws(() => sqlite.initDatabase(), /^Error: Unsupported SQLite schema version 99$/);
        assert.strictEqual(sqlite.isDbReady(), false);
        assert.deepStrictEqual(snapshotFuture(), futureBefore, 'unsupported database must retain schema, metadata, data and journal mode');
        process.env.SQLITE_PATH = dbPath;
        sqlite.initDatabase();
        assert.strictEqual(sqlite.isDbReady(), true);
        assert.strictEqual(repo.getHoroscopeById(saved.id).input_data.name, 'An');
        sqlite.closeDatabase();
    }

    const malformedPath = path.join(dir, 'malformed.sqlite');
    const malformed = new DatabaseSync(malformedPath);
    malformed.exec('CREATE TABLE schema_meta (key TEXT PRIMARY KEY);');
    malformed.close();
    process.env.SQLITE_PATH = malformedPath;
    assert.throws(() => sqlite.initDatabase(), /no such column: value/);
    assert.strictEqual(sqlite.isDbReady(), false);
    process.env.SQLITE_PATH = dbPath;
    sqlite.initDatabase();
    assert.strictEqual(sqlite.isDbReady(), true);
    assert.strictEqual(sqlite.getDb().prepare(`SELECT value FROM schema_meta WHERE key = 'schema_version'`).get().value, '1');
    assert.strictEqual(repo.getHoroscopeById(saved.id).input_data.name, 'An');
    console.log('sqlite isolation passed');
} finally {
    sqlite.closeDatabase();
    if (originalDbPath === undefined) delete process.env.SQLITE_PATH;
    else process.env.SQLITE_PATH = originalDbPath;
    const relativeDir = path.relative(path.resolve(os.tmpdir()), path.resolve(dir));
    assert.ok(relativeDir && !relativeDir.startsWith('..') && !path.isAbsolute(relativeDir));
    fs.rmSync(dir, { recursive: true, force: true });
}
