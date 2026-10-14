#!/usr/bin/env node
/**
 * Deterministic Markdown link checker for repository documentation.
 *
 * Supported:
 * - Markdown links: [text](relative-path)
 * - Angle autolinks: <docs/...>
 * - In rules/*.md only: backtick paths `docs/...` (product repo paths)
 *
 * Skipped (not validated here):
 * - http(s), mailto, fragment-only (#anchor)
 * - B3_HOME placeholders: {B3_HOME}/docs/...
 * - .cursor command links into B3_HOME (../../review-loop/, ../../adapters/)
 *
 * See docs/engineering/DOC_LINK_CHECKER.md
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, dirname, resolve, normalize, relative } from 'path';
import { fileURLToPath } from 'url';

const defaultRepoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

const SKIP_DIRS = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    '.b3',
    'coverage',
    'backend/data'
]);

const DEFAULT_SCAN_ROOTS = [
    'docs',
    'README.md',
    'AGENTS.md',
    'rules',
    '.cursor',
    '.agents'
];

const LINK_RE = /!?\[([^\]]*)\]\(([^)]+)\)/g;
const ANGLE_LINK_RE = /<(docs\/[^>]+)>/g;
const BACKTICK_DOC_RE = /`(docs\/[^`]+)`/g;

export function walkMarkdownFiles(repoRoot, scanRoots) {
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
    const files = [];
    for (const rel of scanRoots) {
        walkFiles(join(repoRoot, rel), files);
    }
    return [...new Set(files)].sort();
}

function isExternal(target) {
    return /^(https?:|mailto:|#)/.test(target);
}

export function resolveDocLink(fromFile, rawTarget, repoRoot, options = {}) {
    let target = rawTarget.trim();
    if (!target || isExternal(target)) return { skip: true };
    if (target.startsWith('{B3_HOME}/')) return { skip: true };
    const hashIdx = target.indexOf('#');
    const pathPart = hashIdx >= 0 ? target.slice(0, hashIdx) : target;
    if (!pathPart) return { skip: true };
    if (/^\.\.\/\.\.\/(review-loop|adapters)\//.test(pathPart)) return { skip: true };
    if (pathPart.startsWith('/')) {
        return { abs: join(repoRoot, pathPart.slice(1)), display: pathPart };
    }
    const base = options.repoRootRelative ? repoRoot : dirname(fromFile);
    const abs = normalize(resolve(base, pathPart));
    return { abs, display: pathPart };
}

export function checkMarkdownFile(filePath, repoRoot) {
    const text = readFileSync(filePath, 'utf8');
    const broken = [];
    const check = (raw, kind, linkOptions = {}) => {
        const resolved = resolveDocLink(filePath, raw, repoRoot, linkOptions);
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
    const relFromRoot = relative(repoRoot, filePath).replace(/\\/g, '/');
    if (relFromRoot.startsWith('rules/')) {
        BACKTICK_DOC_RE.lastIndex = 0;
        while ((m = BACKTICK_DOC_RE.exec(text))) {
            if (m[1].startsWith('{B3_HOME}/')) continue;
            check(m[1], 'backtick', { repoRootRelative: true });
        }
    }
    return broken.map((b) => ({ file: relFromRoot, ...b }));
}

export function runDocLinkCheck(options = {}) {
    const repoRoot = options.repoRoot ?? defaultRepoRoot;
    const scanRoots = options.scanRoots ?? DEFAULT_SCAN_ROOTS;
    const files = walkMarkdownFiles(repoRoot, scanRoots);
    const allBroken = files.flatMap((f) => checkMarkdownFile(f, repoRoot));
    return { repoRoot, files, allBroken };
}

function main() {
    const { files, allBroken } = runDocLinkCheck();
    if (allBroken.length) {
        console.error(`Documentation link check FAILED (${allBroken.length} broken links)`);
        for (const row of allBroken) {
            console.error(`  ${row.file}: [${row.kind}] ${row.raw} — ${row.reason}`);
        }
        process.exit(1);
    }
    console.log(`Documentation link check PASSED (${files.length} markdown files scanned)`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
    main();
}
