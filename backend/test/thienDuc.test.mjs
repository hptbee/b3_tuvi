import assert from 'assert';
import { nguyetDucBranch, thienDucBranch, thienDucCapability } from '../src/time/thienDuc.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { timeOverlay } from '../src/time/timeEngine.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';

const EXPECTED = {
    Tí: 'Dậu',
    Sửu: 'Tuất',
    Dần: 'Hợi',
    Mão: 'Tí',
    Thìn: 'Sửu',
    Tị: 'Dần',
    Ngọ: 'Mão',
    Mùi: 'Thìn',
    Thân: 'Tị',
    Dậu: 'Ngọ',
    Tuất: 'Mùi',
    Hợi: 'Thân'
};

for (const [yearBranch, branch] of Object.entries(EXPECTED)) {
    const placed = thienDucBranch(yearBranch);
    assert.strictEqual(placed.ok, true, yearBranch);
    assert.strictEqual(placed.branch, branch, yearBranch);
    assert.strictEqual(placed.branchPlacement, 'supported', yearBranch);
    assert.strictEqual(placed.publicFortune, false, yearBranch);
    assert.strictEqual(placed.interpretation, null, yearBranch);
    assert.strictEqual(placed.interpretationStatus, 'blocked', yearBranch);
    const capability = thienDucCapability(yearBranch);
    assert.strictEqual(capability.status, 'branch_placed', yearBranch);
    assert.strictEqual(capability.ok, undefined, yearBranch);
    assert.notStrictEqual(capability.status, 'branch_only', yearBranch);
}

for (const invalid of ['Tý', '子', ' ', 0, false]) {
    const placed = thienDucBranch(invalid);
    assert.strictEqual(placed.ok, false, String(invalid));
    assert.strictEqual(placed.branch, null, String(invalid));
    const capability = thienDucCapability(invalid);
    assert.strictEqual(capability.status, 'not_applied', String(invalid));
    assert.notStrictEqual(capability.status, 'branch_only', String(invalid));
    assert.strictEqual(capability.interpretation, null);
    assert.strictEqual(capability.publicFortune, false);
}

for (const yearBranch of Object.keys(EXPECTED)) {
    const placed = nguyetDucBranch(yearBranch);
    assert.strictEqual(placed.branch, yearBranch, yearBranch);
    assert.strictEqual(placed.publicFortune, false);
    assert.strictEqual(placed.interpretation, null);
    assert.strictEqual(placed.interpretationStatus, 'blocked');
}

assert.strictEqual(thienDucCapability(undefined).reason, 'missing_view_year_branch');
assert.strictEqual(thienDucCapability('').reason, 'missing_view_year_branch');

const tuviInfo = calculateTuVi(0, 1, 10, 1, 4, 1, false);
const beforeChart = JSON.stringify(tuviInfo);
const chart = normalizeChart({ tuviInfo, lunarInfo: { canIndex: 0, chiIndex: 1 } });
const beforeNormalized = JSON.stringify(chart);
const hidden = timeOverlay(chart);
assert.strictEqual(hidden.capabilities.thien_duc.status, 'not_applied');
assert.strictEqual(JSON.stringify(tuviInfo), beforeChart);
assert.strictEqual(JSON.stringify(chart), beforeNormalized);

const shown = timeOverlay(chart, { viewYearBranch: 'Tí' });
assert.strictEqual(shown.capabilities.thien_duc.status, 'branch_placed');
assert.strictEqual(shown.capabilities.thien_duc.branchPlacement, 'supported');
assert.strictEqual(shown.capabilities.thien_duc.interpretationStatus, 'blocked');
assert.strictEqual(shown.capabilities.thien_duc.branch, 'Dậu');
assert.strictEqual(shown.capabilities.nguyet_duc.status, 'branch_placed');
assert.strictEqual(shown.capabilities.nguyet_duc.branch, 'Tí');
assert.strictEqual(shown.capabilities.nguyet_duc.interpretation, null);
assert.strictEqual(shown.capabilities.nguyet_duc.publicFortune, false);
assert.strictEqual(shown.capabilities.thien_duc.publicFortune, false);
assert.strictEqual(shown.capabilities.thien_duc.interpretation, null);
assert.strictEqual(shown.interpretation, null);
assert.strictEqual(JSON.stringify(tuviInfo), beforeChart);
assert.strictEqual(JSON.stringify(chart), beforeNormalized);

const rejected = timeOverlay(chart, { viewYearBranch: 'Tý' });
assert.strictEqual(rejected.capabilities.thien_duc.status, 'not_applied');
assert.strictEqual(rejected.capabilities.thien_duc.reason, 'unknown_year_branch');
assert.strictEqual(rejected.capabilities.thien_duc.branch, null);
assert.strictEqual(rejected.capabilities.nguyet_duc.status, 'not_applied');

const served = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1, viewYearBranch: 'Ngọ' });
assert.strictEqual(served.status, 200);
assert.strictEqual(served.body.time.capabilities.nguyet_duc.branch, 'Ngọ');
assert.strictEqual(served.body.time.capabilities.thien_duc.branch, 'Mão');
assert.strictEqual(served.body.time.interpretation, null);
const plain = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.strictEqual(plain.body.time.capabilities.nguyet_duc.status, 'not_applied');
const badType = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1, viewYearBranch: 2026 });
assert.strictEqual(badType.status, 400);
assert.strictEqual(badType.body.code, 'invalid_view_year_branch');

console.log('thiên đức and nguyệt đức place branches for a chosen view year');
