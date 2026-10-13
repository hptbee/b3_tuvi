import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import combinations from '../src/data/combinations.json' with { type: 'json' };
import rules from '../src/data/rulesV2.json' with { type: 'json' };
import pilot from '../../docs/knowledge/pilotClaims.json' with { type: 'json' };
import sourcesDoc from '../../docs/knowledge/sources.json' with { type: 'json' };
import matrix from '../../docs/knowledge/combination-source-matrix.json' with { type: 'json' };
import { buildKnowledgeCoverage, buildSprint9Inventory } from '../src/knowledge/coverageReport.js';
import humanDecisions from './fixtures/pilotHumanDecisions.json' with { type: 'json' };

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

assert.strictEqual(humanDecisions.claims.length, pilot.claims.length);
for (const decision of humanDecisions.claims) {
    assert.strictEqual(decision.humanRecorded, true);
    const claim = pilot.claims.find((item) => item.claimId === decision.claimId);
    assert.ok(claim, decision.claimId);
    assert.strictEqual(claim.formulaComparisonStatus, decision.formulaComparisonStatus);
    assert.strictEqual(claim.approvedForInterpretation === true, decision.approvedForInterpretation);
    if (claim.formulaComparisonStatus === 'MATCH' || claim.approvedForInterpretation === true) {
        assert.strictEqual(decision.humanRecorded, true);
        assert.strictEqual(decision.formulaComparisonStatus, claim.formulaComparisonStatus);
    }
    const correction = report.proposedCorrections.find((item) => item.claimId === decision.claimId);
    if (decision.formulaComparisonStatus !== 'MATCH') {
        assert.ok(correction, decision.claimId);
        assert.strictEqual(correction.formulaComparisonStatus, decision.formulaComparisonStatus);
        assert.strictEqual(correction.appliedToRules, false);
    } else {
        assert.strictEqual(correction, undefined);
    }
}
const coverageSource = readFileSync(fileURLToPath(new URL('../src/knowledge/coverageReport.js', import.meta.url)), 'utf8');
assert.ok(!coverageSource.includes('pilotHumanDecisions'));

const inventory = buildSprint9Inventory();
assert.strictEqual(inventory.catalogCountIsNotVerification, true);
assert.strictEqual(inventory.meaningStoresReviewed, false);
assert.strictEqual(inventory.combinationCount, combinations.length);
assert.strictEqual(inventory.ruleCount, rules.length);
assert.strictEqual(inventory.pilotClaimCount, pilot.claims.length);
assert.strictEqual(inventory.uncomparedCombinationCount, combinations.length - new Set(pilot.claims.map((claim) => claim.combinationName)).size);
assert.strictEqual(inventory.formulaCheckedAgainstSourceCount, matrix.rows.filter((row) => row.formulaCheckedAgainstSource === true).length);
assert.strictEqual(inventory.approvedForInterpretationCount, pilot.claims.filter((claim) => claim.approvedForInterpretation === true).length);
assert.strictEqual(inventory.sourceCount, sourcesDoc.sources.length);
assert.strictEqual(inventory.editionCount, sourcesDoc.editions.length);
assert.deepStrictEqual(inventory.pilotByFormulaComparison, report.pilotByFormulaComparison);

console.log(`knowledge coverage compares ${report.comparedCombinationCount} of ${report.combinationCount} combinations`);
console.log(`sprint 9 inventory sources=${inventory.sourceCount} editions=${inventory.editionCount} approved=${inventory.approvedForInterpretationCount}`);
