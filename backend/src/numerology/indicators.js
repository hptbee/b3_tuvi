import { reduceNumber } from './reduction.js';

export const INDICATOR_VERSION = '1.0.0';
export const INDICATOR_POLICY = 'decoz-frequency-initials-bridge-v1';

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const withheld = () => ({ meaning: null, meaningStatus: 'withheld', meaningReason: 'content_not_in_scope' });
const unavailable = reason => ({ status: 'unavailable', reason, value: null, ...withheld() });
const letterValue = letter => (letter.charCodeAt(0) - 65) % 9 + 1;

function countsOf(name) {
    const counts = Object.fromEntries(DIGITS.map(digit => [digit, 0]));
    for (const letter of name.letters) counts[letter.value] += 1;
    return counts;
}

function bridge(id, left, right) {
    if (left?.status !== 'available' || right?.status !== 'available') return { id, ...unavailable(left?.reason || right?.reason || 'missing_name') };
    const value = Math.abs(left.value - right.value);
    return {
        id, status: 'available', formulaId: 'absolute-difference-published-core-v1',
        operands: [left.value, right.value], value, mastersPreReduced: false, furtherReduced: false, ...withheld()
    };
}

export function calculateIndicators({ name, metrics, birthDay }) {
    const bridges = [
        bridge('lifePath-expression', metrics.lifePath, metrics.expression),
        bridge('soulUrge-personality', metrics.soulUrge, metrics.personality),
        bridge('lifePath-birthday', metrics.lifePath, metrics.birthday)
    ];
    const base = { version: INDICATOR_VERSION, policy: INDICATOR_POLICY, bridges };
    if (!name) {
        return { ...base, hiddenPassion: unavailable('missing_name'), karmicLessons: unavailable('missing_name'), balance: unavailable('missing_name'), rationalThought: unavailable('missing_name') };
    }
    const counts = countsOf(name);
    const max = Math.max(...DIGITS.map(digit => counts[digit]));
    const tokens = name.normalized.split(' ').filter(Boolean);
    const initials = tokens.map(token => ({ letter: token[0], value: letterValue(token[0]) }));
    const balanceReduced = reduceNumber(initials.reduce((sum, item) => sum + item.value, 0), false);
    const first = [...tokens[0]].map(letter => ({ letter, value: letterValue(letter) }));
    const nameReduced = reduceNumber(first.reduce((sum, item) => sum + item.value, 0), false);
    const thought = reduceNumber(nameReduced.value + birthDay, false);
    return {
        ...base,
        hiddenPassion: { status: 'available', formulaId: 'name-letter-frequency-mode-v1', counts, values: DIGITS.filter(digit => counts[digit] === max), count: max, ...withheld() },
        karmicLessons: { status: 'available', formulaId: 'name-letter-frequency-absent-v1', counts, values: DIGITS.filter(digit => counts[digit] === 0), ...withheld() },
        balance: {
            status: 'available', formulaId: 'name-initials-reduce-no-master-v1', initials, ...balanceReduced,
            parts: [{ label: 'initials', values: initials.map(item => item.value), total: balanceReduced.rawTotal }],
            keepMasters: false, ...withheld()
        },
        rationalThought: {
            status: 'available', formulaId: 'first-token-plus-calendar-day-no-master-v1', token: tokens[0],
            nameReduced: nameReduced.value, calendarDay: birthDay, ...thought,
            parts: [
                { label: 'firstToken', values: first.map(item => item.value), total: nameReduced.rawTotal },
                { label: 'namePlusDay', values: [nameReduced.value, birthDay], total: thought.rawTotal }
            ],
            steps: [...nameReduced.steps, ...thought.steps], keepMasters: false, ...withheld()
        }
    };
}
