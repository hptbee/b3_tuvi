import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateNumerology } from '../src/numerology/calculate.js';
import { calculatePinnacles } from '../src/numerology/pinnacles.js';
import { NumerologyInputError, dateOnly } from '../src/numerology/input.js';

const fixtures = JSON.parse(readFileSync(new URL('./fixtures/numerologyPinnacles.json', import.meta.url), 'utf8'));
const today = '2026-10-13';
const allowedPinnacle = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22]);

for (const fixture of fixtures.cases) {
    const input = { birthDate: fixture.birthDate };
    const snapshot = JSON.stringify(input);
    const result = calculateNumerology(input, today);
    assert.equal(result.schemaVersion, '1.2.0', fixture.id);
    assert.equal(result.profile.version, '1.2.0', fixture.id);
    assert.equal(result.capabilities.pinnacles, 'available', fixture.id);
    assert.equal(result.metrics.lifePath.value, fixture.lifePath.value, fixture.id);
    assert.equal(result.metrics.lifePath.rootValue, fixture.lifePath.root, fixture.id);
    const pinnacles = result.pinnacles;
    assert.equal(pinnacles.policy, 'component-reduce-root-age-v1');
    assert.equal(pinnacles.lifePathRoot, fixture.lifePath.root);
    assert.equal(pinnacles.firstCycleEndAge, 36 - fixture.lifePath.root);
    assert.deepEqual({
        month: pinnacles.components.month.value,
        day: pinnacles.components.day.value,
        year: pinnacles.components.year.value
    }, fixture.components, fixture.id);
    assert.deepEqual(pinnacles.periods.map(period => period.pinnacle.value), fixture.pinnacles.map(item => item.value), fixture.id);
    assert.deepEqual(pinnacles.periods.map(period => period.pinnacle.rootValue), fixture.pinnacles.map(item => item.root), fixture.id);
    assert.deepEqual(pinnacles.periods.map(period => period.pinnacle.isMaster), fixture.pinnacles.map(item => item.master), fixture.id);
    assert.deepEqual(pinnacles.periods.map(period => period.challenge.value), fixture.challenges, fixture.id);
    assert.deepEqual(pinnacles.periods.map(period => [period.startAgeInclusive, period.endAgeInclusive]), fixture.ages, fixture.id);
    assert.deepEqual(pinnacles.periods.map(period => [period.startDate, period.endDate]), fixture.dates, fixture.id);
    assert.equal(JSON.stringify(input), snapshot);
    const named = calculateNumerology({ ...input, fullName: 'An' }, today);
    assert.deepEqual(named.pinnacles.periods.map(period => [period.pinnacle.value, period.challenge.value]), pinnacles.periods.map(period => [period.pinnacle.value, period.challenge.value]));
    for (const view of fixture.views) {
        const viewed = calculateNumerology({ ...input, targetDate: view.asOf }, today).pinnacles;
        assert.equal(viewed.asOf, view.asOf, fixture.id);
        assert.equal(viewed.completedAge, view.age, `${fixture.id} ${view.asOf}`);
        const active = viewed.periods.filter(period => period.active);
        assert.deepEqual(active.map(period => period.id), [view.active], `${fixture.id} ${view.asOf}`);
    }
}

const zero = calculateNumerology({ birthDate: { year: 2000, month: 2, day: 29 } }, today).pinnacles;
assert.deepEqual(zero.periods.map(period => period.challenge.value), [0, 0, 0, 0]);
assert.equal(JSON.parse(JSON.stringify(zero)).periods[0].challenge.value, 0);
assert.equal(zero.periods[0].challenge.operands[0] - zero.periods[0].challenge.operands[1], 0);
for (const period of zero.periods) {
    assert.equal(period.challenge.value, 0);
    assert.equal(period.challenge.meaning, null);
    assert.equal(period.challenge.meaningStatus, 'withheld');
    assert.equal(period.challenge.meaningReason, 'content_not_in_scope');
    assert.equal(period.pinnacle.meaningStatus, 'experimental_editorial');
    assert.equal(period.pinnacle.meaning.metricId, period.id);
}

const baseline = calculateNumerology({ birthDate: { year: 1990, month: 6, day: 15 } }, today);
assert.equal(baseline.metrics.lifePath.meaningStatus, 'experimental_editorial');
assert.equal(baseline.pinnacles.periods[0].pinnacle.steps[0].output, 3);
assert.equal(baseline.pinnacles.periods[2].pinnacle.rawTotal, 10);
assert.throws(() => calculateNumerology({ birthDate: { year: 1990, month: 6, day: 15 }, pinnacles: { periods: [] } }, today), error => error.code === 'CLIENT_RESULT_REJECTED');
assert.throws(() => calculatePinnacles({ year: 1990, month: 6, day: 15 }, today, 11), RangeError);
assert.throws(() => calculatePinnacles({ year: 1990, month: 6, day: 15 }, '1989-06-15', 4), RangeError);
for (const profileVersion of ['1.0.0', '1.1.0']) {
    assert.throws(() => calculateNumerology({ birthDate: { year: 1990, month: 6, day: 15 }, profileVersion }, today), error => error instanceof NumerologyInputError && error.code === 'PROFILE_NOT_FOUND');
}

for (const year of [1200, 1900, 1990, 2000, 2020]) for (const month of [1, 2, 6, 11, 12]) for (const day of [1, 11, 15, 22, 28, 29]) {
    if (!dateOnly({ year, month, day })) continue;
    const birthDate = { year, month, day };
    const result = calculateNumerology({ birthDate }, today);
    const pinnacles = result.pinnacles;
    assert.equal(pinnacles.lifePathRoot, result.metrics.lifePath.rootValue);
    assert.equal(pinnacles.firstCycleEndAge, 36 - pinnacles.lifePathRoot);
    assert.equal(pinnacles.periods.filter(period => period.active).length, 1);
    assert.equal(pinnacles.periods[0].startAgeInclusive, 0);
    assert.equal(pinnacles.periods[3].endAgeInclusive, null);
    assert.equal(pinnacles.periods[3].endDate, null);
    for (let index = 0; index < 3; index += 1) {
        assert.equal(pinnacles.periods[index + 1].startAgeInclusive, pinnacles.periods[index].endAgeInclusive + 1);
        assert.ok(pinnacles.periods[index].startDate <= pinnacles.periods[index].endDate);
    }
    for (const key of ['month', 'day', 'year']) {
        const item = pinnacles.components[key];
        assert.equal(item.keepMasters, false);
        assert.ok(item.value >= 1 && item.value <= 9);
        assert.equal(item.steps.reduce((value, step) => step.output, item.rawTotal), item.value);
    }
    for (const period of pinnacles.periods) {
        assert.equal(period.pinnacle.keepMasters, true);
        assert.ok(allowedPinnacle.has(period.pinnacle.value));
        assert.equal(period.pinnacle.steps.reduce((value, step) => step.output, period.pinnacle.rawTotal), period.pinnacle.value);
        assert.equal(period.challenge.value, Math.abs(period.challenge.operands[0] - period.challenge.operands[1]));
        assert.ok(Number.isInteger(period.challenge.value) && period.challenge.value >= 0 && period.challenge.value <= 8);
        for (const boundary of [period.startDate, period.endDate].filter(Boolean)) {
            const viewed = calculateNumerology({ birthDate, targetDate: boundary }, today).pinnacles;
            assert.equal(viewed.periods.filter(item => item.active).length, 1);
            assert.equal(viewed.periods.find(item => item.active).id, period.id);
        }
    }
}
console.log(`numerology pinnacles: ${fixtures.cases.length} hand-derived timelines, challenge 0, leap-day ages and period coverage passed`);
