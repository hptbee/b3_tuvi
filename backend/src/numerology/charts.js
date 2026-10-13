const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const emptyCounts = () => Object.fromEntries(DIGITS.map(digit => [digit, 0]));

export function buildNameChart(name) {
    if (!name) {
        return { status: 'unavailable', reason: 'missing_name', version: '1.0.0', policy: 'pythagorean-letter-count-v1',
            layoutVersion: '3-6-9-v1', counts: null, letters: null };
    }
    const counts = emptyCounts();
    for (const letter of name.letters) counts[letter.value] += 1;
    return {
        status: 'available', version: '1.0.0', policy: 'pythagorean-letter-count-v1', layoutVersion: '3-6-9-v1',
        layout: [[3, 6, 9], [2, 5, 8], [1, 4, 7]], normalized: name.normalized, counts,
        letters: name.letters.map(letter => ({ letter: letter.letter, value: letter.value }))
    };
}

export function buildCombinedChart(birthGrid, nameChart) {
    if (nameChart.status !== 'available') {
        return { status: 'unavailable', reason: 'missing_name', version: '1.0.0', policy: 'birth-name-presence-v1', digits: null };
    }
    const digits = DIGITS.map(digit => {
        const birth = birthGrid.counts[digit];
        const name = nameChart.counts[digit];
        const presence = birth > 0 && name > 0 ? 'both' : birth > 0 ? 'birth' : name > 0 ? 'name' : 'neither';
        return { digit, birth, name, presence };
    });
    return { status: 'available', version: '1.0.0', policy: 'birth-name-presence-v1', digits };
}
