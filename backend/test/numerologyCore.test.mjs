import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateNumerology, reduceNumber } from '../src/numerology/calculate.js';
import { dateOnly, normalizeName, NumerologyInputError } from '../src/numerology/input.js';
import { PROFILE } from '../src/numerology/profile.js';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/numerologyCore.json', import.meta.url), 'utf8'));
const today = '2026-10-13';
const base = { birthDate: { year: 1990, month: 6, day: 15 } };
for (const { id, input, expected } of fixture.cases) {
    const before = JSON.stringify(input);
    const result = calculateNumerology(input, today);
    for (const [metric, value] of Object.entries(expected)) assert.equal(result.metrics[metric].value, value, `${id}/${metric}`);
    assert.equal(JSON.stringify(input), before, `${id}: input mutation`);
    assert.equal(result.profile.status, 'experimental');
    assert.equal(result.contentVersion, '1.2.0');
    for (const metric of Object.values(result.metrics)) {
        const eligible = metric.status === 'available' && metric.value !== 33;
        assert.equal(metric.meaningStatus, eligible ? 'experimental_editorial' : 'withheld');
        if (eligible) {
            assert.equal(metric.meaning.value, metric.value);
            assert.equal(metric.meaning.kind, 'original_editorial');
            assert.equal(metric.meaning.expertVerified, false);
        } else assert.equal(metric.meaning, null);
        if (metric.status === 'available') {
            assert.equal(metric.parts.reduce((sum, part) => sum + part.total, 0), metric.rawTotal);
            assert.equal(metric.isMaster, [11, 22, 33].includes(metric.value));
            assert.ok(metric.rootValue >= 1 && metric.rootValue <= 9);
            for (const step of metric.steps) assert.equal(step.digits.reduce((a, b) => a + b, 0), step.output);
        }
    }
}
assert.equal(fixture.profileVersion, PROFILE.version);
const dependentMaster = calculateNumerology({ birthDate: { year: 1990, month: 1, day: 11 }, fullName: 'A'.repeat(11) }, today);
assert.equal(dependentMaster.metrics.lifePath.value, 22);
assert.equal(dependentMaster.metrics.expression.value, 11);
assert.equal(dependentMaster.metrics.maturity.value, 33);
assert.equal(dependentMaster.metrics.maturity.rootValue, 6);
for (const total of [1, 9, 11, 22, 33, 29, 48, 999]) {
    for (const keep of [true, false]) {
        const result = reduceNumber(total, keep);
        assert.equal(reduceNumber(result.value, keep).value, result.value);
        if (!keep) assert.ok(result.value <= 9);
    }
}
for (const invalid of [0, -1, 1.2, NaN, Infinity, '11', Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => reduceNumber(invalid, true), RangeError);
assert.deepEqual(reduceNumber(29, true).steps, [{ input: 29, digits: [2, 9], output: 11 }]);
assert.equal(reduceNumber(33, false).value, 6);
const withName = calculateNumerology({ ...base, fullName: 'Nguyễn Văn An' }, today);
assert.equal(withName.nameAnalysis.normalized, 'NGUYEN VAN AN');
assert.equal(withName.metrics.expression.rawTotal, withName.metrics.soulUrge.rawTotal + withName.metrics.personality.rawTotal);
for (const variant of ['Nguyễn Văn An'.normalize('NFD'), 'nguyễn  văn-an', 'Nguyễn Văn’An']) {
    assert.deepEqual(calculateNumerology({ ...base, fullName: variant }, today).metrics, withName.metrics);
}
const expectedValues = { A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8 };
for (const [letter, value] of Object.entries(expectedValues)) assert.equal(normalizeName(letter).letters[0].value, value);
assert.equal(normalizeName('Đỗ').normalized, 'DO');
for (const [accented, expected] of [
    ['ÀÁẢÃẠ ĂẰẮẲẴẶ ÂẦẤẨẪẬ', 'AAAAA AAAAAA AAAAAA'],
    ['ÈÉẺẼẸ ÊỀẾỂỄỆ ÌÍỈĨỊ', 'EEEEE EEEEEE IIIII'],
    ['ÒÓỎÕỌ ÔỒỐỔỖỘ ƠỜỚỞỠỢ', 'OOOOO OOOOOO OOOOOO'],
    ['ÙÚỦŨỤ ƯỪỨỬỮỰ ỲÝỶỸỴ Đ', 'UUUUU UUUUUU YYYYY D'],
    ['José François Zoë Åsa', 'JOSE FRANCOIS ZOE ASA'],
    ['Ā Ć Č Ģ İ Ő Ř Ș Ț Ů', 'A C C G I O R S T U']
]) {
    for (const variant of [accented, accented.toLowerCase(), accented.normalize('NFD')]) {
        assert.equal(normalizeName(variant).normalized, expected);
        assert.deepEqual(normalizeName(variant).letters, normalizeName(expected).letters);
    }
}
for (const fullName of ['A\u093E', 'A\u20E3', 'A\u034F', 'A\uFE0F', 'A\u{E0100}', 'A\u05B0', 'A\u036F']) {
    assert.throws(() => normalizeName(fullName), error => error instanceof NumerologyInputError && error.code === 'UNSUPPORTED_NAME_CHARACTER');
}
assert.equal(normalizeName('Y').letters[0].kind, 'consonant');
assert.equal(calculateNumerology({ ...base, fullName: 'LY' }, today).metrics.soulUrge.reason, 'no_vowels');
assert.equal(calculateNumerology({ ...base, fullName: 'AE' }, today).metrics.personality.reason, 'no_consonants');
assert.equal(calculateNumerology({ ...base, fullName: ' ' }, today).metrics.maturity.reason, 'missing_name');
assert.equal(normalizeName('A'.repeat(100)).letters.length, 100);
assert.equal(dateOnly({ year: 1900, month: 2, day: 29 }), null);
assert.equal(dateOnly({ year: 2000, month: 2, day: 29 }), '2000-02-29');
for (const bad of [null, [], 1, {}, { birthDate: { year: 1990, month: 2, day: 30 } },
    { birthDate: { year: 1199, month: 1, day: 1 } }, { birthDate: { year: 2200, month: 1, day: 1 } },
    { birthDate: { year: '1990', month: 6, day: 15 } }, { birthDate: { year: 2026, month: 10, day: 14 } },
    { ...base, metrics: {} }, { ...base, normalizedName: 'A' }, { ...base, profileId: 'unknown' },
    { ...base, profileVersion: '2.0.0' }, { ...base, locale: 'en' }, { ...base, fullName: 123 },
    { ...base, fullName: null }, ...['漢', '😊', 'Æ', 'Ł', 'A1', 'A\u200b', 'A\nB', '\u0301A', 'A\u093E', 'A\u20E3', 'A\u034F', 'A'.repeat(101), '---'].map(fullName => ({ ...base, fullName }))]) {
    assert.throws(() => calculateNumerology(bad, today), NumerologyInputError);
}
assert.throws(() => calculateNumerology(base), TypeError);
assert.throws(() => calculateNumerology(base, '2026-02-30'), TypeError);
assert.equal(withName.capabilities.birthGrid, 'available');
console.log(`numerology core: ${fixture.cases.length} independent arithmetic fixtures, mapping, Unicode/date negatives and invariants passed`);
