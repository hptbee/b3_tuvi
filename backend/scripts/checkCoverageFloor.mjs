import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const summary = JSON.parse(readFileSync(path.join(root, 'coverage', 'coverage-summary.json'), 'utf8'));
const baseline = JSON.parse(
    readFileSync(path.join(root, '..', 'docs', 'engineering', 'quality', 'coverage-baseline.json'), 'utf8')
);
const floors = baseline.backend;
let failed = false;
for (const metric of ['lines', 'statements', 'functions', 'branches']) {
    const actual = summary.total[metric].pct;
    if (actual + 0.05 < floors[metric]) {
        console.error(`${metric} ${actual} fell below baseline ${floors[metric]}`);
        failed = true;
    }
}
if (failed) process.exit(1);
console.log(`coverage floor holds at lines ${summary.total.lines.pct} branches ${summary.total.branches.pct}`);
