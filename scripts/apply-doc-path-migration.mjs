#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const map = JSON.parse(
    readFileSync(join(repoRoot, 'scripts/doc-path-migration-map.json'), 'utf8')
);

const ordered = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.b3', 'coverage']);
const EXT = new Set(['.md', '.mjs', '.js', '.jsx', '.json', '.yml', '.yaml', '.sh', '.ps1']);

function walk(dir, out) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name)) continue;
        const p = join(dir, name);
        const st = statSync(p);
        if (st.isDirectory()) walk(p, out);
        else if ([...EXT].some((e) => name.endsWith(e))) out.push(p);
    }
}

const files = [];
walk(repoRoot, files);
files.push(join(repoRoot, 'README.md'), join(repoRoot, 'AGENTS.md'));

let touched = 0;
for (const file of files) {
    if (file.includes('doc-path-migration-map.json')) continue;
    let text = readFileSync(file, 'utf8');
    let next = text;
    for (const [from, to] of ordered) {
        if (next.includes(from)) next = next.split(from).join(to);
    }
    if (next !== text) {
        writeFileSync(file, next, 'utf8');
        touched += 1;
    }
}

console.log(`Updated ${touched} files with documentation path migrations`);
