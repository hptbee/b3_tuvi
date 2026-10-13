import assert from 'node:assert/strict';
import { calculateNumerology } from '../src/numerology/calculate.js';
import { NumerologyInputError } from '../src/numerology/input.js';

const today = '2026-10-13';
const birth = { year: 1990, month: 6, day: 15 };
const dated = calculateNumerology({ birthDate: birth }, today);
assert.equal(dated.metrics.lifePath.value, 4);
assert.equal(dated.cycles.personalYear.value, 4);
assert.deepEqual(dated.cycles.yearBand.map(item => item.year), [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031]);
assert.deepEqual(dated.cycles.yearBand.map(item => item.personalYear.value), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
assert.equal(dated.cycles.yearBand.filter(item => item.selected).length, 1);
assert.equal(dated.cycles.yearBand.find(item => item.selected).personalYear.value, dated.cycles.personalYear.value);
assert.equal(dated.cycles.months.length, 12);
assert.equal(dated.cycles.months.filter(item => item.selected).length, 1);
assert.equal(dated.cycles.months.find(item => item.selected).month, 10);
assert.equal(dated.cycles.months.find(item => item.selected).personalMonth.value, dated.cycles.personalMonth.value);
assert.equal(dated.nameChart.status, 'unavailable');
assert.equal(dated.combinedChart.status, 'unavailable');
assert.deepEqual(dated.pinnacles.periods.map(period => period.pinnacle.value), [3, 7, 1, 7]);
assert.deepEqual(dated.pinnacles.periods.map(period => period.challenge.value), [0, 5, 5, 5]);
assert.equal(dated.pinnacles.components.month.keepMasters, false);

const named = calculateNumerology({ birthDate: birth, fullName: 'Nguyễn Văn An' }, today);
assert.equal(named.metrics.expression.value, 3);
assert.equal(named.nameChart.status, 'available');
assert.equal(named.nameChart.policy, 'pythagorean-letter-count-v1');
assert.deepEqual(named.nameChart.counts, { 1: 2, 2: 0, 3: 1, 4: 1, 5: 5, 6: 0, 7: 2, 8: 0, 9: 0 });
assert.equal(Object.values(named.nameChart.counts).reduce((sum, count) => sum + count, 0), named.nameAnalysis.letters.length);
assert.deepEqual(named.combinedChart.digits.map(item => item.presence), ['both', 'neither', 'name', 'name', 'both', 'birth', 'name', 'neither', 'birth']);

const late = calculateNumerology({ birthDate: birth, targetDate: '2199-12-31' }, today);
assert.equal(late.cycles.yearBand.length, 9);
assert.equal(late.cycles.yearBand.at(-1).year <= 2199, true);
assert.equal(late.cycles.yearBand[0].year >= 1200, true);
assert.equal(late.cycles.yearBand.find(item => item.selected).year, 2199);
assert.equal(late.cycles.yearBand.find(item => item.selected).personalYear.value, late.cycles.personalYear.value);

assert.throws(() => calculateNumerology({ birthDate: birth, nameChart: { counts: { 1: 9 } } }, today), NumerologyInputError);
console.log('numerology charts: nine-year band, twelve months, name counts, combined presence and unchanged pinnacles passed');
