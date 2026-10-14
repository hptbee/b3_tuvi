#!/usr/bin/env node
/**
 * One-time bulk path rewrites from scripts/doc-path-migration-map.json.
 *
 * Safeguards:
 * - Never modifies files under docs/knowledge/ (runtime JSON, decisions, passages, reviews, research).
 * - Never modifies scripts/doc-path-migration-map.json itself.
 * - Idempotent for already-migrated paths (only replaces map "from" keys).
 *
 * Usage: node scripts/apply-doc-path-migration.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dryRun = process.argv.includes('--dry-run');
const mapPath = join(repoRoot, 'scripts/doc-path-migration-map.json');
const map = JSON.parse(readFileSync(mapPath, 'utf8'));

const ordered = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.b3', 'coverage']);
const EXT = new Set(['.md', '.mjs', '.js', '.jsx', '.json', '.yml', '.yaml', '.sh', '.ps1']);

function isKnowledgeProtected(relPosix) {
    return relPosix === 'docs/knowledge' || relPosix.startsWith('docs/knowledge/');
}

function walk(dir, out) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name)) continue;
        const p = join(dir, name);
        const rel = relative(repoRoot, p).replace(/\\/g, '/');
        if (isKnowledgeProtected(rel)) continue;
        const st = statSync(p);
        if (st.isDirectory()) walk(p, out);
        else if ([...EXT].some((e) => name.endsWith(e))) out.push(p);
    }
}

const files = [];
walk(repoRoot, files);
files.push(join(repoRoot, 'README.md'), join(repoRoot, 'AGENTS.md'));

let touched = 0;
let skippedKnowledge = 0;
for (const file of files) {
    if (file === mapPath) continue;
    let text = readFileSync(file, 'utf8');
    let next = text;
    for (const [from, to] of ordered) {
        if (next.includes(from)) next = next.split(from).join(to);
    }
    if (next !== text) {
        touched += 1;
        if (!dryRun) writeFileSync(file, next, 'utf8');
    }
}

// Report any knowledge files that still contain unmigrated "from" keys (manual follow-up only).
for (const [from] of ordered) {
    const probe = join(repoRoot, 'docs/knowledge');
    try {
        const stack = [probe];
        while (stack.length) {
            const dir = stack.pop();
            for (const name of readdirSync(dir)) {
                const p = join(dir, name);
                const st = statSync(p);
                if (st.isDirectory()) stack.push(p);
                else if (name.endsWith('.md') || name.endsWith('.json')) {
                    const body = readFileSync(p, 'utf8');
                    if (body.includes(from)) {
                        skippedKnowledge += 1;
                        if (dryRun) {
                            console.warn(`knowledge file still contains legacy path "${from}": ${relative(repoRoot, p)}`);
                        }
                    }
                }
            }
        }
    } catch {
        /* no knowledge dir */
    }
}

console.log(
    dryRun
        ? `[dry-run] Would update ${touched} files; ${skippedKnowledge} knowledge files still mention legacy paths`
        : `Updated ${touched} files with documentation path migrations (docs/knowledge/ skipped)`
);
