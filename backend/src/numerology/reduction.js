import { PROFILE } from './profile.js';

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
