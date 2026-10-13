import { PROFILE, publicProfile } from './profile.js';
import { parseInput } from './input.js';

export const digitSum = value => [...String(value)].reduce((sum, digit) => sum + Number(digit), 0);
export function reduceNumber(total, keepMasters) {
    if (!Number.isSafeInteger(total) || total < 1) throw new RangeError('Reduction requires a positive safe integer');
    const steps = [];
    let value = total;
    while (value > 9 && !(keepMasters && PROFILE.masterNumbers.includes(value))) {
        const digits = [...String(value)].map(Number);
        const output = digits.reduce((sum, digit) => sum + digit, 0);
        steps.push({ input: value, digits, output });
        value = output;
    }
    let rootValue = value;
    while (rootValue > 9) rootValue = digitSum(rootValue);
    return { rawTotal: total, value, rootValue, isMaster: PROFILE.masterNumbers.includes(value), steps };
}
const missing = reason => ({ status: 'unavailable', reason, value: null, meaning: null, meaningStatus: 'withheld' });
const metric = (formulaId, total, keepMasters, parts) => ({
    status: 'available', formulaId, ...reduceNumber(total, keepMasters), keepMasters,
    parts, meaning: null, meaningStatus: 'withheld'
});
const datePart = (label, number) => ({ label, values: [...String(number)].map(Number), total: digitSum(number) });
const lettersPart = (label, letters) => ({ label, values: letters.map(item => item.value), total: letters.reduce((sum, item) => sum + item.value, 0) });

export function calculateNumerology(body, referenceDate) {
    const { birthDate: { year, month, day }, name } = parseInput(body, referenceDate);
    const dateParts = [datePart('day', day), datePart('month', month), datePart('year', year)];
    const metrics = {
        lifePath: metric('life-path-all-date-digits-v1', dateParts.reduce((sum, part) => sum + part.total, 0), true, dateParts),
        birthday: { ...metric('birthday-v1', day, true, [{ label: 'day', values: [day], total: day }]), originalDay: day },
        attitude: metric('attitude-v1', dateParts[0].total + dateParts[1].total, false, dateParts.slice(0, 2))
    };
    for (const [id, kind, reason] of [['expression', null, 'missing_name'], ['soulUrge', 'vowel', 'no_vowels'], ['personality', 'consonant', 'no_consonants']]) {
        if (!name) { metrics[id] = missing('missing_name'); continue; }
        const letters = name.letters.filter(letter => kind === null || letter.kind === kind);
        if (!letters.length) { metrics[id] = missing(reason); continue; }
        const part = lettersPart(id, letters);
        metrics[id] = metric(`${id}-latin-vn-v1`, part.total, true, [part]);
    }
    metrics.maturity = metrics.expression.status === 'available'
        ? metric('maturity-v1', metrics.lifePath.value + metrics.expression.value, true, [
            { label: 'lifePath', values: [metrics.lifePath.value], total: metrics.lifePath.value },
            { label: 'expression', values: [metrics.expression.value], total: metrics.expression.value }
        ]) : missing('missing_name');
    return {
        ok: true, schemaVersion: '1.0.0', profile: publicProfile(), referenceDate,
        contentVersion: null, metrics, nameAnalysis: name,
        capabilities: publicProfile().capabilities,
        warnings: name?.letters.some(letter => letter.letter === 'Y') ? [{ code: 'Y_AS_CONSONANT', field: 'fullName' }] : []
    };
}
