import combinations from '../data/combinations.json' with { type: 'json' };
import rules from '../data/rulesV2.json' with { type: 'json' };
import pilot from '../../../docs/knowledge/pilotClaims.json' with { type: 'json' };
import matrix from '../../../docs/knowledge/combination-source-matrix.json' with { type: 'json' };
import sourcesDoc from '../../../docs/knowledge/sources.json' with { type: 'json' };

function countBy(items, key) {
    const counts = {};
    for (const item of items) {
        const value = item[key] || 'missing';
        counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
}

export function buildKnowledgeCoverage() {
    const pilotClaims = pilot.claims;
    const comparedNames = new Set(pilotClaims.map((claim) => claim.combinationName));
    const ruleNames = new Set(rules.map((rule) => rule.combination));
    const proposedCorrections = pilotClaims
        .filter((claim) => claim.formulaComparisonStatus !== 'MATCH')
        .map((claim) => ({
            claimId: claim.claimId,
            combinationName: claim.combinationName,
            ruleId: claim.ruleId,
            formulaComparisonStatus: claim.formulaComparisonStatus,
            researchNotes: claim.researchNotes,
            appliedToRules: false
        }));
    return {
        usage: 'research_gap_report',
        combinationCount: combinations.length,
        ruleCount: rules.length,
        pilotClaimCount: pilotClaims.length,
        pilotByFormulaComparison: countBy(pilotClaims, 'formulaComparisonStatus'),
        matrixFormulaCheckedCount: matrix.rows.filter((row) => row.formulaCheckedAgainstSource === true).length,
        authenticatedEditionIds: sourcesDoc.editions.filter((edition) => edition.authenticated === true).map((edition) => edition.editionId),
        editionAuthenticationDoesNotVerifyFormulas: true,
        comparedCombinationCount: comparedNames.size,
        uncomparedCombinationCount: combinations.filter((item) => !comparedNames.has(item.name)).length,
        combinationsWithoutRule: combinations.filter((item) => !ruleNames.has(item.name)).map((item) => item.name),
        proposedCorrections,
        meaningStoresReviewed: false,
        rulesV2Changed: false
    };
}

export function buildSprint9Inventory() {
    const coverage = buildKnowledgeCoverage();
    const approvedForInterpretationCount = pilot.claims.filter((claim) => claim.approvedForInterpretation === true).length;
    return {
        usage: 'sprint9_live_inventory',
        catalogCountIsNotVerification: true,
        combinationCount: coverage.combinationCount,
        ruleCount: coverage.ruleCount,
        pilotClaimCount: coverage.pilotClaimCount,
        pilotByFormulaComparison: coverage.pilotByFormulaComparison,
        uncomparedCombinationCount: coverage.uncomparedCombinationCount,
        formulaCheckedAgainstSourceCount: coverage.matrixFormulaCheckedCount,
        approvedForInterpretationCount,
        sourceCount: sourcesDoc.sources.length,
        editionCount: sourcesDoc.editions.length,
        meaningStoresReviewed: coverage.meaningStoresReviewed
    };
}
