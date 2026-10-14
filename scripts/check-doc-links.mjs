#!/usr/bin/env node
/**
 * Deterministic Markdown link checker for repository documentation.
 * Validates relative file links and selected root entrypoints.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, dirname, resolve, normalize } from 'path';
import { fileURLToPath } from 'url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const SKIP_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.b3',
    'coverage',
    'backend/data'
]);

const SCAN_ROOTS = [
    'docs',
    'README.md',
    'AGENTS.md',
    '.cursor',
    '.agents'
];

const LINK_RE = /!?\[([^\]]*)\]\(([^)]+)\)/g;
const ANGLE_LINK_RE = /<(docs\/[^>]+)>/g;

function walkFiles(absPath, out) {
    if (!existsSync(absPath)) return;
    const st = statSync(absPath);
    if (st.isFile()) {
        if (absPath.endsWith('.md')) out.push(absPath);
        return;
    }
    for (const name of readdirSync(absPath)) {
        if (SKIP_DIRS.has(name)) continue;
        walkFiles(join(absPath, name), out);
    }
}

function collectMarkdownFiles() {
    const files = [];
    for (const rel of SCAN_ROOTS) {
        walkFiles(join(repoRoot, rel), files);
    }
    return [...new Set(files)].sort();
}

function isExternal(target) {
    return /^(https?:|mailto:|#)/.test(target);
}

function resolveLink(fromFile, rawTarget) {
    let target = rawTarget.trim();
    if (!target || isExternal(target)) return { skip: true };
    const hashIdx = target.indexOf('#');
    const pathPart = hashIdx >= 0 ? target.slice(0, hashIdx) : target;
    if (!pathPart) return { skip: true };
    if (/^\.\.\/\.\.\/(review-loop|adapters)\//.test(pathPart)) return { skip: true };
    if (pathPart.startsWith('/')) {
        return { abs: join(repoRoot, pathPart.slice(1)), display: pathPart };
    }
    const base = dirname(fromFile);
    const abs = normalize(resolve(base, pathPart));
    return { abs, display: pathPart };
}

function checkFile(filePath) {
    const text = readFileSync(filePath, 'utf8');
    const broken = [];
    const check = (raw, kind) => {
        const resolved = resolveLink(filePath, raw);
        if (resolved.skip) return;
        if (!resolved.abs.startsWith(repoRoot)) {
            broken.push({ kind, raw, reason: 'escapes repository root' });
            return;
        }
        if (!existsSync(resolved.abs)) {
            broken.push({ kind, raw, reason: 'missing target' });
        }
    };
    let m;
    LINK_RE.lastIndex = 0;
    while ((m = LINK_RE.exec(text))) check(m[2], 'markdown');
    ANGLE_LINK_RE.lastIndex = 0;
    while ((m = ANGLE_LINK_RE.exec(text))) check(m[1], 'angle');
    return broken.map((b) => ({ file: filePath.slice(repoRoot.length + 1), ...b }));
}

const files = collectMarkdownFiles();
const allBroken = files.flatMap(checkFile);

if (allBroken.length) {
    console.error(`Documentation link check FAILED (${allBroken.length} broken links)`);
    for (const row of allBroken) {
        console.error(`  ${row.file}: [${row.kind}] ${row.raw} — ${row.reason}`);
    }
    process.exit(1);
}

console.log(`Documentation link check PASSED (${files.length} markdown files scanned)`);
