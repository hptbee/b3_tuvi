import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import combinations from '../src/data/combinations.json' with { type: 'json' };
import rules from '../src/data/rulesV2.json' with { type: 'json' };
import pilot from '../../docs/knowledge/pilotClaims.json' with { type: 'json' };
import { buildKnowledgeCoverage } from '../src/knowledge/coverageReport.js';

const report = buildKnowledgeCoverage();
assert.strictEqual(report.combinationCount, combinations.length);
assert.strictEqual(report.ruleCount, rules.length);
assert.strictEqual(report.pilotClaimCount, pilot.claims.length);
assert.strictEqual(report.matrixFormulaCheckedCount, 0);
assert.strictEqual(report.editionAuthenticationDoesNotVerifyFormulas, true);
assert.strictEqual(report.rulesV2Changed, false);
assert.strictEqual(report.meaningStoresReviewed, false);
assert.ok(report.proposedCorrections.every((item) => item.appliedToRules === false));
assert.strictEqual(
    report.proposedCorrections.length,
    pilot.claims.filter((claim) => claim.formulaComparisonStatus !== 'MATCH').length
);
assert.strictEqual(report.comparedCombinationCount + report.uncomparedCombinationCount, combinations.length);
assert.ok(report.uncomparedCombinationCount > 0);
const rulesSource = readFileSync(fileURLToPath(new URL('../src/data/rulesV2.json', import.meta.url)), 'utf8');
assert.ok(!rulesSource.includes('appliedToRules'));

console.log(`knowledge coverage compares ${report.comparedCombinationCount} of ${report.combinationCount} combinations`);
