import stageCopy from './data/stageCopy.vi.json' with { type: 'json' };

// Counts raw DDMMYYYY birth digits; padding zeros are included in ignoredZeroCount.
export function buildBirthGrid({ day, month, year }) {
    const digits = [...`${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${year}`].map(Number);
    const counts = Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, 0]));
    for (const digit of digits) if (digit !== 0) counts[digit] += 1;
    const presentDigits = Object.keys(counts).map(Number).filter(digit => counts[digit] > 0);
    const missingDigits = Object.keys(counts).map(Number).filter(digit => counts[digit] === 0);
    const lines = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]].map(line => {
        const present = line.filter(digit => counts[digit] > 0);
        const id = line.join('-');
        return { id, digits: line, state: present.length === 3 ? 'present' : present.length === 0 ? 'absent' : 'partial', note: stageCopy.lines.items[id] };
    });
    return { version: '1.0.0', layoutVersion: '3-6-9-v1', policy: 'ddmmyyyy-zero-excluded-v1',
        lineLayer: { version: stageCopy.lines.version, disclaimer: stageCopy.lines.disclaimer },
        layout: [[3, 6, 9], [2, 5, 8], [1, 4, 7]], counts, presentDigits, missingDigits,
        ignoredZeroCount: digits.filter(digit => digit === 0).length, lines };
}
