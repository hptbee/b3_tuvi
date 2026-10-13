import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export const unitTests = [
    'test/engine.test.mjs',
    'test/placement.tables.test.mjs',
    'test/combinationMatch.test.mjs',
    'test/palaceRelation.test.mjs',
    'test/normalizeChart.test.mjs',
    'test/ruleEngine.test.mjs',
    'test/provenance.test.mjs',
    'test/knowledgeValidate.test.mjs',
    'test/safeErrorLog.test.mjs',
    'test/evidenceV3.test.mjs',
    'test/interpretationPipeline.test.mjs',
    'test/knowledgeCoverage.test.mjs',
    'test/wholeChart.test.mjs',
    'test/timeEngine.test.mjs',
    'test/fixtureClasses.test.mjs',
    'test/knowledgeCatalog.test.mjs',
    'test/sourceHygiene.test.mjs',
    'test/crossReview.test.mjs',
    'test/decisionRegistry.test.mjs',
    'test/storedDecision.test.mjs',
    'test/internalSlice.test.mjs',
    'test/crossReviewNegatives.test.mjs',
    'test/combinationBatch.test.mjs',
    'test/qualityEdges.test.mjs',
    'test/perfSmoke.test.mjs'
];

export const integrationTests = [
    'test/combinationRoute.integration.test.mjs',
    'test/sqlite.test.mjs',
    'test/knowledgePrototype.test.mjs',
    'test/knowledgeQuery.test.mjs',
    'test/narrator.test.mjs',
    'test/chartGenerate.test.mjs',
    'test/httpApi.test.mjs'
];

const checks = [
    ['node', ['--check', 'src/scripts/migrate.js']]
];

function run(command, args) {
    const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false });
    if (result.status !== 0) process.exit(result.status || 1);
}

const mode = process.argv[2] || 'all';
const files = mode === 'unit'
    ? unitTests
    : mode === 'integration'
        ? integrationTests
        : [...unitTests, ...integrationTests];

for (const file of files) run('node', [file]);
if (mode === 'all' || mode === 'ci') {
    for (const [command, args] of checks) run(command, args);
}
