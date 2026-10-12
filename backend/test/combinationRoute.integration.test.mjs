import assert from 'assert';
import express from 'express';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { findStarOnChart } from '../src/engine/starNames.js';
import { matchCombinations } from '../src/engine/combinationMatch.js';
import combinationRoutes from '../src/routes/combinationRoutes.js';
import catalog from '../src/data/combinations.json' with { type: 'json' };
import tuHoaMap from '../src/data/tuHoaMap.json' with { type: 'json' };

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

await testRouteMatchesPureMatcher();
testTuHoaThroughChart();
console.log('API integration tests passed');
