#!/usr/bin/env node
/**
 * Generate documentation inventory with coarse classification heuristics.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

const RUNTIME_JSON = new Set([
    'pilotClaims.json',
    'sources.json',
    'combination-source-matrix.json',
    'provenance-contract.json',
    'schools.json',
    'combination-research.json',
    'combination-passages.json'
]);

const ACTIVE_CANONICAL = [
    'docs/README.md',
    'docs/planning/AUTODEV_MASTER_PLAN_V2.md',
    'docs/planning/ROADMAP_SPRINT_9_14.md',
    'docs/planning/ROADMAP_NUMEROLOGY_A_TO_Z.md',
    'docs/architecture/ARCHITECTURAL_OVERVIEW.md',
    'docs/architecture/CHART_DOMAIN_MODEL.md',
    'docs/numerology/RELEASE_READINESS.md',
    'docs/engineering/CONTRIBUTING.md',
    'docs/engineering/AGENT_ENGINEERING.md',
    'docs/engineering/TEST_FIXTURES.md',
    'docs/tuvi/DOMAIN_KNOWLEDGE.md',
    'docs/numerology/FORMULA_SPEC.md',
    'docs/numerology/API_CONTRACT.md',
    'docs/DOCUMENTATION_POLICY.md'
];

function walk(dir, out) {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (name === 'node_modules' || name === '.git') continue;
        const st = statSync(p);
        if (st.isDirectory()) walk(p, out);
        else out.push(p);
    }
}

function classify(rel) {
    if (rel.includes('/archive/')) return 'HISTORICAL_RECORD';
    if (rel.startsWith('docs/knowledge/decisions/') || rel.startsWith('docs/knowledge/research/sprint-9c/decisions/')) {
        return 'EXECUTABLE_DATA_DEPENDENCY';
    }
    if (rel.startsWith('docs/knowledge/passages/') || rel.startsWith('docs/knowledge/reviews/')) {
        return 'RESEARCH_EVIDENCE';
    }
    if (rel.includes('/passages/') && rel.endsWith('.txt')) return 'RESEARCH_EVIDENCE';
    if (rel.includes('/reviews/') && rel.endsWith('.json')) return 'RESEARCH_EVIDENCE';
    if (rel.startsWith('docs/knowledge/research/') && extname(rel) === '.json') return 'RESEARCH_EVIDENCE';
    if (RUNTIME_JSON.has(rel.split('/').pop()) && rel.startsWith('docs/knowledge/')) {
        return 'EXECUTABLE_DATA_DEPENDENCY';
    }
    if (rel.includes('screenshots/') || rel.endsWith('.png')) return 'GENERATED_ARTIFACT';
    if (ACTIVE_CANONICAL.includes(rel)) return 'ACTIVE_CANONICAL';
    if (rel.startsWith('docs/numerology/')) return 'ACTIVE_SUPPORTING';
    if (rel.startsWith('docs/engineering/')) return 'ACTIVE_SUPPORTING';
    if (rel.startsWith('docs/tuvi/')) return 'ACTIVE_SUPPORTING';
    if (rel.startsWith('docs/knowledge/') && rel.endsWith('.md')) return 'RESEARCH_EVIDENCE';
    if (rel.startsWith('docs/knowledge/') && rel.endsWith('.json')) return 'RESEARCH_EVIDENCE';
    return 'UNKNOWN';
}

const docsRoot = join(repoRoot, 'docs');
const files = [];
walk(docsRoot, files);

let consumers = {};
try {
    const rg = execSync('rg -l "docs/" backend frontend README.md AGENTS.md .cursor .agents 2>/dev/null || true', {
        cwd: repoRoot,
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
    });
    consumers = Object.fromEntries(
        rg.trim().split('\n').filter(Boolean).map((f) => [f, true])
    );
} catch {
    /* optional */
}

const inventory = files
    .map((abs) => relative(repoRoot, abs).replace(/\\/g, '/'))
    .filter((rel) => !rel.includes('/.git/'))
    .sort()
    .map((path) => ({
        path,
        category: classify(path),
        extension: extname(path).slice(1) || 'none',
        action: path.includes('/archive/') ? 'archived' : 'retain'
    }));

const outPath = join(repoRoot, 'docs/engineering/meta/DOCUMENTATION_INVENTORY.json');
writeFileSync(outPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), count: inventory.length, items: inventory }, null, 2)}\n`);
console.log(`Wrote ${outPath} (${inventory.length} entries)`);
