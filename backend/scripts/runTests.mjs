import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export const unitTests = [
    'test/numerologyCore.test.mjs',
    'test/numerologyAdvanced.test.mjs',
    'test/numerologyPinnacles.test.mjs',
    'test/numerologyCharts.test.mjs',
    'test/numerologyIndicators.test.mjs',
    'test/numerologyContent.test.mjs',
    'test/engine.test.mjs',
    'test/placement.tables.test.mjs',
    'test/combinationMatch.test.mjs',
    'test/palaceRelation.test.mjs',
    'test/normalizeChart.test.mjs',
    'test/ruleEngine.test.mjs',
    'test/provenance.test.mjs',
    'test/knowledgeValidate.test.mjs',
    'test/safeErrorLog.test.mjs',
    'test/apiErrors.test.mjs',
    'test/evidenceV3.test.mjs',
    'test/interpretationPipeline.test.mjs',
    'test/interpretationBinding.test.mjs',
    'test/interpretationApplicability.test.mjs',
    'test/sourcePalaceBinding.test.mjs',
    'test/sourcePalaceInterpretation.test.mjs',
    'test/sourcePalaceQuan.test.mjs',
    'test/sourcePalacePhucCoCu.test.mjs',
    'test/sourcePalaceTaiTuViPha.test.mjs',
    'test/sourcePalaceQuanMao.test.mjs',
    'test/sourcePalaceFoundational.test.mjs',
    'test/sprint11bInterpretation.test.mjs',
    'test/sprint11c12Evidence.test.mjs',
    'test/knowledgeCoverage.test.mjs',
    'test/wholeChart.test.mjs',
    'test/timeEngine.test.mjs',
    'test/modernMajorBinding.test.mjs',
    'test/modernMajor.test.mjs',
    'test/modernMajorStemBinding.test.mjs',
    'test/modernMajorStem.test.mjs',
    'test/modernMajorMutagenBinding.test.mjs',
    'test/modernMajorMutagen.test.mjs',
    'test/modernMinorBinding.test.mjs',
    'test/modernMinor.test.mjs',
    'test/thienDuc.test.mjs',
    'test/fixtureClasses.test.mjs',
    'test/knowledgeCatalog.test.mjs',
    'test/sourceHygiene.test.mjs',
    'test/crossReview.test.mjs',
    'test/decisionRegistry.test.mjs',
    'test/storedDecision.test.mjs',
    'test/decisionIntegrity.test.mjs',
    'test/sourceBinding.test.mjs',
    'test/internalSlice.test.mjs',
    'test/crossReviewNegatives.test.mjs',
    'test/combinationBatch.test.mjs',
    'test/combinationResearch.test.mjs',
    'test/sprint9cDiscovery.test.mjs',
    'test/sprint9Adjudication.test.mjs',
    'test/formulaV1.test.mjs',
    'test/sprint9Closure.test.mjs',
    'test/conditionEval.test.mjs',
    'test/qualityEdges.test.mjs',
    'test/perfSmoke.test.mjs'
];

export const integrationTests = [
    'test/sourcePalaceFoundationalApi.test.mjs',
    'test/structuredAnalysisContract.integration.test.mjs',
    'test/modernMajorApi.test.mjs',
    'test/modernMajorStemApi.test.mjs',
    'test/modernMajorMutagenApi.test.mjs',
    'test/modernMinorApi.test.mjs',
    'test/numerologyApi.test.mjs',
    'test/numerologyRateLimit.test.mjs',
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
