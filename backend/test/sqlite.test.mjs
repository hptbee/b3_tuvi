import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-sqlite-'));
const dbPath = path.join(dir, 'tuvi.sqlite');
process.env.SQLITE_PATH = dbPath;

const sqlite = await import('../src/db/sqlite.js');
const repo = await import('../src/db/repositories.js');

try {
    sqlite.initDatabase();
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
    console.log('sqlite isolation passed');
} finally {
    sqlite.closeDatabase();
    fs.rmSync(dir, { recursive: true, force: true });
}
