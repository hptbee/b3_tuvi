import assert from 'node:assert/strict';
import { calculateNumerology } from '../src/numerology/calculate.js';

const today = '2026-10-13';
const an = calculateNumerology({ birthDate: { year: 1990, month: 6, day: 15 }, fullName: 'Nguyễn Văn An' }, today);
assert.equal(an.metrics.lifePath.value, 4);
assert.equal(an.metrics.expression.value, 3);
assert.equal(an.metrics.soulUrge.value, 1);
assert.equal(an.metrics.personality.value, 11);
assert.equal(an.metrics.birthday.value, 6);
assert.equal(an.schemaVersion, '1.2.0');
assert.equal(an.profile.version, '1.2.0');
assert.deepEqual(an.indicators.hiddenPassion.values, [5]);
assert.equal(an.indicators.hiddenPassion.count, 5);
assert.deepEqual(an.indicators.karmicLessons.values, [2, 6, 8, 9]);
assert.equal(an.indicators.balance.value, 1);
assert.equal(an.indicators.balance.isMaster, false);
assert.equal(an.indicators.rationalThought.value, 2);
assert.equal(an.indicators.rationalThought.token, 'NGUYEN');
assert.equal(an.indicators.rationalThought.calendarDay, 15);
assert.equal(an.indicators.rationalThought.nameReduced, 5);
assert.deepEqual(an.indicators.rationalThought.parts[1], { label: 'namePlusDay', values: [5, 15], total: 20 });
assert.deepEqual(an.indicators.bridges.map(item => item.value), [1, 10, 2]);
assert.equal(an.indicators.bridges[1].operands.join(), '1,11');

const thomas = calculateNumerology({ birthDate: { year: 1980, month: 3, day: 3 }, fullName: 'Thomas John Hancock' }, today);
assert.equal(thomas.indicators.balance.value, 2);
assert.equal(thomas.indicators.balance.rawTotal, 11);
assert.equal(thomas.indicators.rationalThought.nameReduced, 4);
assert.equal(thomas.indicators.rationalThought.calendarDay, 3);
assert.equal(thomas.indicators.rationalThought.value, 7);
assert.deepEqual(thomas.indicators.rationalThought.parts[1], { label: 'namePlusDay', values: [4, 3], total: 7 });
assert.deepEqual(thomas.indicators.rationalThought.steps[0], { input: 22, digits: [2, 2], output: 4 });
assert.deepEqual(thomas.indicators.balance.parts[0].values, [2, 1, 8]);

const tie = calculateNumerology({ birthDate: { year: 1990, month: 1, day: 1 }, fullName: 'AABB' }, today);
assert.deepEqual(tie.indicators.hiddenPassion.values, [1, 2]);
assert.equal(tie.indicators.hiddenPassion.count, 2);
assert.deepEqual(tie.indicators.karmicLessons.values, [3, 4, 5, 6, 7, 8, 9]);
assert.equal(tie.indicators.balance.value, 1);

const hyphen = calculateNumerology({ birthDate: { year: 1990, month: 1, day: 1 }, fullName: 'Hancock-Johnson' }, today);
assert.deepEqual(hyphen.indicators.balance.initials.map(item => item.letter), ['H', 'J']);

const none = calculateNumerology({ birthDate: { year: 1990, month: 6, day: 15 } }, today);
for (const id of ['hiddenPassion', 'karmicLessons', 'balance', 'rationalThought']) {
    assert.equal(none.indicators[id].status, 'unavailable');
    assert.equal(none.indicators[id].reason, 'missing_name');
    assert.equal(none.indicators[id].value, null);
}
assert.equal(none.indicators.bridges[0].status, 'unavailable');
assert.equal(none.indicators.bridges[2].status, 'available');
assert.equal(none.indicators.bridges[2].value, 2);
assert.deepEqual(none.indicators.bridges[2].operands, [4, 6]);
assert.equal(none.metrics.lifePath.value, 4);
assert.equal(none.metrics.birthday.value, 6);

const masters = calculateNumerology({ birthDate: { year: 1990, month: 1, day: 11 }, fullName: 'A'.repeat(11) }, today);
assert.equal(masters.metrics.lifePath.value, 22);
assert.equal(masters.metrics.expression.value, 11);
assert.equal(masters.indicators.bridges[0].value, 11);
assert.equal(masters.indicators.bridges[0].furtherReduced, false);
assert.equal(masters.metrics.maturity.value, 33);

const zero = calculateNumerology({ birthDate: { year: 1990, month: 6, day: 15 }, fullName: 'D' }, today);
assert.equal(zero.metrics.lifePath.value, 4);
assert.equal(zero.metrics.expression.value, 4);
assert.equal(zero.indicators.bridges[0].value, 0);

console.log('numerology indicators: frequency, initials, rational thought, and published-core bridges passed');
