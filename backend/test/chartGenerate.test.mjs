import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const dbPath = path.join(os.tmpdir(), `tuvi-chart-${process.pid}.sqlite`);
process.env.SQLITE_PATH = dbPath;

const routeSource = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/routes/chartRoutes.js'), 'utf8');
assert.ok(!routeSource.includes('insertHoroscope'));
assert.ok(!routeSource.includes('DELETE FROM horoscopes'));

const sqlite = await import('../src/db/sqlite.js');
const repo = await import('../src/db/repositories.js');
const { default: chartRoutes } = await import('../src/routes/chartRoutes.js');

sqlite.initDatabase();
repo.insertHoroscope({
    input_data: { name: 'Giữ lại', day: 1, month: 1, year: 1990, hour: 1, gender: 1 },
    lunar_data: {},
    full_chart: { menh: 1 }
});

const app = express();
app.use(express.json());
app.use('/api/charts', chartRoutes);
const server = await new Promise((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
});

try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/charts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Mới', day: 15, month: 6, year: 1992, hour: 8, gender: 1 })
    });
    const payload = await response.json();
    assert.strictEqual(response.status, 200);
    assert.ok(payload.tuviInfo);
    assert.ok(payload.lunarInfo);
    assert.strictEqual(repo.countHoroscopes(), 1);
    assert.strictEqual(repo.getHoroscopeById(1).input_data.name, 'Giữ lại');
    console.log('chart generate does not store birth data');
} finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    sqlite.closeDatabase();
    for (const suffix of ['', '-wal', '-shm']) {
        fs.rmSync(dbPath + suffix, { force: true });
    }
}
