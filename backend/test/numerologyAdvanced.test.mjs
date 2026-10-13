import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateNumerology } from '../src/numerology/calculate.js';
import { NumerologyInputError, isoDateOnly } from '../src/numerology/input.js';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/numerologyAdvanced.json', import.meta.url), 'utf8'));
const today = '2026-10-13';
const base = { birthDate: { year: 1990, month: 6, day: 15 } };
for (const fixture of fixtures.cases) {
    const input = { birthDate: fixture.birthDate, targetDate: fixture.targetDate };
    const snapshot = JSON.stringify(input);
    const result = calculateNumerology(input, today);
    const { birthGrid: grid, cycles } = result;
    assert.equal(result.profile.version, fixtures.profileVersion);
    assert.equal(result.schemaVersion, '1.1.0');
    if (fixture.counts) assert.deepEqual(grid.counts, fixture.counts, fixture.id);
    if (fixture.zeros !== undefined) assert.equal(grid.ignoredZeroCount, fixture.zeros, fixture.id);
    assert.deepEqual([cycles.personalYear.value, cycles.personalMonth.value, cycles.personalDay.value], fixture.cycles, fixture.id);
    assert.equal(cycles.targetDate, fixture.targetDate);
    assert.equal(cycles.policy, 'calendar-year-v1');
    assert.deepEqual(grid.layout, [[3, 6, 9], [2, 5, 8], [1, 4, 7]]);
    assert.equal(grid.lines.length, 8);
    assert.equal(new Set(grid.lines.map(line => line.id)).size, 8);
    assert.equal(JSON.stringify(input), snapshot);
}
const baseline = calculateNumerology(base, today);
assert.equal(baseline.cycles.targetDate, today);
assert.deepEqual(baseline.birthGrid.presentDigits, [1, 5, 6, 9]);
assert.deepEqual(baseline.birthGrid.missingDigits, [2, 3, 4, 7, 8]);
assert.equal(baseline.birthGrid.lines.find(line => line.id === '1-5-9').state, 'present');
assert.equal(baseline.birthGrid.lines.find(line => line.id === '1-2-3').state, 'partial');
const repeated = calculateNumerology({ birthDate: { year: 1999, month: 1, day: 11 } }, today);
assert.equal(repeated.birthGrid.lines.find(line => line.id === '4-5-6').state, 'absent');
assert.equal(repeated.birthGrid.lines.find(line => line.id === '1-5-9').state, 'partial');
for (const targetDate of ['2026-06-14', '2026-06-15', '2026-06-16']) {
    assert.equal(calculateNumerology({ ...base, targetDate }, today).cycles.personalYear.value, 4);
}
assert.equal(calculateNumerology({ ...base, targetDate: '2026-12-31' }, today).cycles.personalYear.value, 4);
assert.equal(calculateNumerology({ ...base, targetDate: '2027-01-01' }, today).cycles.personalYear.value, 5);
assert.equal(calculateNumerology({ ...base, targetDate: '2199-12-31' }, today).cycles.targetDate, '2199-12-31');
assert.equal(calculateNumerology({ ...base, targetDate: '1990-06-15' }, today).cycles.targetDate, '1990-06-15');
assert.equal(isoDateOnly('2000-02-29'), '2000-02-29');
for (const bad of [null, 1, {}, '', '2026-1-01', '2026-02-30', '1900-02-29', '1990-06-14', '2200-01-01', '2026-10-13T00:00:00Z', '2026-10-13 ']) {
    assert.throws(() => calculateNumerology({ ...base, targetDate: bad }, today), error => error instanceof NumerologyInputError && error.code === 'INVALID_TARGET_DATE' && error.fields[0].path === 'targetDate');
}
for (const field of ['birthGrid', 'cycles']) {
    assert.throws(() => calculateNumerology({ ...base, [field]: {} }, today), error => error.code === 'CLIENT_RESULT_REJECTED');
}
assert.throws(() => calculateNumerology({ ...base, profileVersion: '1.0.0' }, today), error => error.code === 'PROFILE_NOT_FOUND');
for (const year of [1200, 1900, 1990, 2000, 2020]) for (let month = 1; month <= 12; month++) for (const day of [1, 11, 15, 22, 28]) {
    const result = calculateNumerology({ birthDate: { year, month, day } }, today);
    const grid = result.birthGrid;
    assert.equal(Object.values(grid.counts).reduce((a, b) => a + b, 0) + grid.ignoredZeroCount, 8);
    assert.deepEqual([...grid.presentDigits, ...grid.missingDigits].sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const line of grid.lines) {
        const numberPresent = line.digits.filter(digit => grid.counts[digit] > 0).length;
        assert.equal(line.state, ['absent', 'partial', 'partial', 'present'][numberPresent]);
    }
    for (const metric of [result.cycles.personalYear, result.cycles.personalMonth, result.cycles.personalDay]) {
        assert.ok(metric.value >= 1 && metric.value <= 9);
        assert.equal(metric.isMaster, false);
        assert.equal(metric.keepMasters, false);
        assert.equal(metric.parts.reduce((sum, part) => sum + part.total, 0), metric.rawTotal);
        for (const step of metric.steps) assert.equal(step.digits.reduce((a, b) => a + b, 0), step.output);
    }
}
console.log(`numerology advanced: ${fixtures.cases.length} independent fixtures, 300 date invariants, grid states and cycle/calendar/target boundaries passed`);
