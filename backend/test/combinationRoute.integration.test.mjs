import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import express from 'express';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { findStarOnChart } from '../src/engine/starNames.js';
import { matchCombinations } from '../src/engine/combinationMatch.js';
import combinationRoutes from '../src/routes/combinationRoutes.js';
import catalog from '../src/data/combinations.json' with { type: 'json' };
import tuHoaMap from '../src/data/tuHoaMap.json' with { type: 'json' };

const tempDb = path.join(os.tmpdir(), `tuvi-api-${process.pid}.sqlite`);
process.env.SQLITE_PATH = tempDb;

function listen(app) {
    return new Promise((resolve) => {
        const server = app.listen(0, '127.0.0.1', () => resolve(server));
    });
}

async function testRouteMatchesPureMatcher() {
    const app = express();
    app.use(express.json());
    app.use('/api/combinations', combinationRoutes);
    const server = await listen(app);
    const port = server.address().port;
    try {
        const chart = calculateTuVi(2, 3, 12, 6, 4, 1);
        const body = {
            boxes: chart.boxes,
            menhIndex: chart.menh,
            menhChi: chart.boxes[chart.menh].chiName
        };
        const response = await fetch(`http://127.0.0.1:${port}/api/combinations/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const payload = await response.json();
        const pure = matchCombinations(body, catalog);
        assert.strictEqual(response.status, 200);
        assert.deepStrictEqual(payload.combinations.map((item) => item.name), pure.map((item) => item.name));
        assert.ok(payload.combinations.every((item) => item.verification_status !== 'disabled'));
        assert.ok(payload.combinations.filter((item) => item.verification_status === 'provisional').every((item) => item.summary.startsWith('[Chưa xác thực]')));

        const empty = await fetch(`http://127.0.0.1:${port}/api/combinations/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const emptyPayload = await empty.json();
        assert.deepStrictEqual(emptyPayload, { count: 0, combinations: [] });
        const profileBody = { ...body, sourceProfile: 'modern-108s' };
        const profileResponse = await fetch(`http://127.0.0.1:${port}/api/combinations/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileBody)
        });
        const profilePayload = await profileResponse.json();
        const profilePure = matchCombinations(body, catalog, { profile: 'modern-108s' });
        assert.deepStrictEqual(profilePayload.combinations.map((item) => item.name), profilePure.map((item) => item.name));
        assert.deepStrictEqual(chart.boxes, calculateTuVi(2, 3, 12, 6, 4, 1).boxes);
        console.log('POST /match equals pure matcher passed');
    } finally {
        await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    }
}

function testTuHoaThroughChart() {
    const hoa = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
    const chart = calculateTuVi(2, 3, 1, 1, 1, 1);
    const targets = tuHoaMap['2'];
    targets.forEach((star, idx) => {
        const starPalaces = findStarOnChart(chart.boxes, star).map((hit) => hit.index);
        const hoaPalaces = findStarOnChart(chart.boxes, hoa[idx]).map((hit) => hit.index);
        assert.ok(hoaPalaces.some((palace) => starPalaces.includes(palace)), `${hoa[idx]} phải đồng cung ${star}`);
    });
    console.log('Tứ Hóa Bính on chart passed');
}

async function testGetUsesJsonNotSqlite() {
    const { initDatabase, closeDatabase } = await import('../src/db/sqlite.js');
    const { upsertCombination } = await import('../src/db/repositories.js');
    initDatabase();
    upsertCombination({
        name: 'Cách Chỉ Có Trong SQLite',
        type: 'cat_cach',
        description: 'Không được lộ qua API.'
    });
    const app = express();
    app.use('/api/combinations', combinationRoutes);
    const server = await listen(app);
    const port = server.address().port;
    try {
        const response = await fetch(`http://127.0.0.1:${port}/api/combinations`);
        const payload = await response.json();
        assert.strictEqual(response.status, 200);
        assert.strictEqual(payload.length, catalog.length);
        assert.ok(payload.every((item) => item.name !== 'Cách Chỉ Có Trong SQLite'));
        assert.deepStrictEqual(payload.map((item) => item.name), catalog.map((item) => item.name));
        console.log('GET /combinations follows JSON catalog passed');
    } finally {
        await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
        closeDatabase();
        for (const suffix of ['', '-wal', '-shm']) {
            fs.rmSync(`${tempDb}${suffix}`, { force: true });
        }
    }
}

await testRouteMatchesPureMatcher();
await testGetUsesJsonNotSqlite();
testTuHoaThroughChart();
console.log('API integration tests passed');
