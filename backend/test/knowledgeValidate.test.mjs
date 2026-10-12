import assert from 'assert';
import sourcesDoc from '../../docs/knowledge/sources.json' with { type: 'json' };
import matrixDoc from '../../docs/knowledge/combination-source-matrix.json' with { type: 'json' };
import pilotDoc from '../../docs/knowledge/pilotClaims.json' with { type: 'json' };
import contract from '../../docs/knowledge/provenance-contract.json' with { type: 'json' };
import catalog from '../src/data/combinations.json' with { type: 'json' };
import { parseKnowledgeJson, validateKnowledgeBundle } from '../src/knowledge/validateKnowledge.js';
import schoolsDoc from '../../docs/knowledge/schools.json' with { type: 'json' };
import { DEFAULT_SCHOOL, resolveSchool } from '../src/engine/schoolProfile.js';

const live = validateKnowledgeBundle({
    sources: sourcesDoc,
    matrix: matrixDoc,
    pilot: pilotDoc,
    contract,
    combinationNames: catalog.map((item) => item.name)
});
assert.strictEqual(live.ok, true, JSON.stringify(live.errors, null, 2));
assert.strictEqual(live.levels.schemaValid, true);
assert.strictEqual(live.levels.sourceLinked, true);
assert.strictEqual(live.levels.bibliographicallyVerified, false);
assert.strictEqual(live.levels.formulaVerified, false);
assert.strictEqual(live.levels.approvedForInterpretation, false);
assert.ok(live.gaps.length > 0);

function bundle() {
    return {
        contract,
        combinationNames: ['Phủ Tướng Triều Viên'],
        sources: {
            sources: [{
                sourceId: 'thai-thu-lang-tan-bien',
                bibliographicStatus: 'secondary',
                schoolId: 'vn-tam-hop-default'
            }],
            editions: [{
                editionId: 'ed',
                sourceId: 'thai-thu-lang-tan-bien',
                authenticated: false
            }]
        },
        pilot: {
            sourceId: 'thai-thu-lang-tan-bien',
            claims: [{
                claimId: 'c1',
                claimType: 'combination_match',
                combinationName: 'Phủ Tướng Triều Viên',
                formulaComparisonStatus: 'CONFLICT'
            }]
        },
        matrix: {
            rows: [{
                name: 'Phủ Tướng Triều Viên',
                sources: [],
                sourceVerificationStatus: 'none',
                formulaCheckedAgainstSource: false
            }]
        }
    };
}

const ok = validateKnowledgeBundle(bundle());
assert.strictEqual(ok.ok, true);
assert.strictEqual(ok.levels.bibliographicallyVerified, false);

function codes(doc) {
    return new Set(validateKnowledgeBundle(doc).errors.map((error) => error.code));
}

const duplicate = bundle();
duplicate.pilot.claims.push({ ...duplicate.pilot.claims[0] });
assert.ok(codes(duplicate).has('duplicate_id'));

const brokenEdition = bundle();
brokenEdition.sources.editions[0].sourceId = 'missing';
assert.ok(codes(brokenEdition).has('broken_reference'));

const unknownCombo = bundle();
unknownCombo.pilot.claims[0].combinationName = 'Không có cách này';
assert.ok(codes(unknownCombo).has('unknown_combination'));

const unknownStar = bundle();
unknownStar.pilot.claims[0].relatedStars = ['not_a_star'];
assert.ok(codes(unknownStar).has('unknown_star'));

const unknownPalace = bundle();
unknownPalace.pilot.claims[0].relatedPalaces = ['no_such_palace'];
assert.ok(codes(unknownPalace).has('unknown_palace'));

const badType = bundle();
badType.pilot.claims[0].claimType = 'fortune';
assert.ok(codes(badType).has('invalid_claim_type'));

const badSchool = bundle();
badSchool.pilot.claims[0].schoolId = 'other-school';
assert.ok(codes(badSchool).has('unknown_school'));

const researchSchool = bundle();
researchSchool.pilot.claims[0].schoolId = 'trung-chau';
assert.strictEqual(validateKnowledgeBundle(researchSchool).ok, true);
assert.strictEqual(schoolsDoc.baselineSchoolId, DEFAULT_SCHOOL.id);
assert.deepStrictEqual(resolveSchool(), DEFAULT_SCHOOL);
assert.ok(schoolsDoc.variants.some((variant) => variant.variantType === 'calculation'));
assert.ok(schoolsDoc.variants.some((variant) => variant.variantType === 'rule'));
assert.ok(schoolsDoc.variants.some((variant) => variant.variantType === 'interpretation'));
assert.ok(schoolsDoc.variants.every((variant) => variant.appliedByDefault === false));
assert.ok(schoolsDoc.schools.filter((school) => school.schoolId !== DEFAULT_SCHOOL.id).every((school) => school.calculationApplied === false));

const crossReviewed = bundle();
crossReviewed.pilot.claims[0].crossReviewed = true;
crossReviewed.pilot.claims[0].locator = '19.2.11/230';
crossReviewed.pilot.claims[0].editionId = 'ed';
crossReviewed.pilot.claims[0].variantType = 'rule';
crossReviewed.pilot.claims[0].variantId = 'rule-pilot-not-runtime';
crossReviewed.pilot.claims[0].schoolId = 'vn-tam-hop-default';
assert.strictEqual(validateKnowledgeBundle(crossReviewed).ok, true);

const missingLocator = bundle();
missingLocator.pilot.claims[0].crossReviewed = true;
missingLocator.pilot.claims[0].editionId = 'ed';
missingLocator.pilot.claims[0].variantType = 'rule';
missingLocator.pilot.claims[0].variantId = 'rule-pilot-not-runtime';
assert.ok(codes(missingLocator).has('missing_locator'));

const wrongEdition = bundle();
wrongEdition.sources.editions.push({ editionId: 'other-source-edition', sourceId: 'missing-source', authenticated: false });
wrongEdition.pilot.claims[0].crossReviewed = true;
wrongEdition.pilot.claims[0].locator = '19.2.11/230';
wrongEdition.pilot.claims[0].editionId = 'other-source-edition';
wrongEdition.pilot.claims[0].variantType = 'rule';
wrongEdition.pilot.claims[0].variantId = 'rule-pilot-not-runtime';
wrongEdition.pilot.claims[0].schoolId = 'vn-tam-hop-default';
assert.ok(codes(wrongEdition).has('broken_reference') || codes(wrongEdition).has('mismatched_edition'));

const unknownVariant = bundle();
unknownVariant.pilot.claims[0].crossReviewed = true;
unknownVariant.pilot.claims[0].locator = '19.2.11/230';
unknownVariant.pilot.claims[0].editionId = 'ed';
unknownVariant.pilot.claims[0].variantType = 'rule';
unknownVariant.pilot.claims[0].variantId = 'not-a-variant';
unknownVariant.pilot.claims[0].schoolId = 'vn-tam-hop-default';
assert.ok(codes(unknownVariant).has('invalid_variant'));

const mixed = bundle();
mixed.schools = {
    baselineSchoolId: DEFAULT_SCHOOL.id,
    schools: schoolsDoc.schools,
    variants: schoolsDoc.variants.map((variant) => variant.variantId === 'calc-chu-menh-menh-chi'
        ? { ...variant, appliedByDefault: true }
        : variant)
};
assert.ok(codes(mixed).has('mixed_school'));

const blankVariant = bundle();
blankVariant.schools = {
    ...schoolsDoc,
    variants: schoolsDoc.variants.map((variant, index) => index === 0 ? { ...variant, variantId: ' ' } : variant)
};
assert.ok(codes(blankVariant).has('duplicate_id'));

const promoted = bundle();
promoted.sources.sources[0].bibliographicStatus = 'primary';
assert.ok(codes(promoted).has('unsupported_promotion'));

const formulaFlag = bundle();
formulaFlag.matrix.rows[0].formulaCheckedAgainstSource = true;
assert.ok(codes(formulaFlag).has('unsupported_promotion'));

const emptyCondition = bundle();
emptyCondition.pilot.claims[0].conditions = [''];
assert.ok(codes(emptyCondition).has('invalid_empty_condition'));

const emptyClauses = bundle();
emptyClauses.pilot.claims[0].rule = { clauses: [] };
assert.ok(codes(emptyClauses).has('invalid_empty_condition'));

const badSupport = bundle();
badSupport.pilot.claims[0].sourceReferences = [{
    sourceId: 'thai-thu-lang-tan-bien',
    supportType: 'copied'
}];
assert.ok(codes(badSupport).has('unsupported_citation'));

const missingCitation = bundle();
missingCitation.pilot.sourceId = null;
assert.ok(codes(missingCitation).has('missing_citation'));

const mismatch = bundle();
mismatch.sources.sources.push({
    sourceId: 'other',
    bibliographicStatus: 'secondary',
    schoolId: null
});
mismatch.sources.editions[0].sourceId = 'other';
mismatch.pilot.claims[0].editionId = 'ed';
assert.ok(codes(mismatch).has('mismatched_edition'));

const danglingLink = bundle();
danglingLink.pilot.claims[0].contradicts = ['missing-claim'];
assert.ok(codes(danglingLink).has('broken_reference'));

const jumped = bundle();
jumped.sources.editions[0].authenticated = true;
jumped.sources.editions[0].authenticationBasis = 'project_owner';
jumped.pilot.claims[0].editionId = 'ed';
jumped.pilot.claims[0].previousStatus = {
    implementationStatus: 'untested',
    formulaStatus: 'undocumented',
    bibliographicStatus: 'unverified_attribution',
    interpretationStatus: 'unreviewed'
};
Object.assign(jumped.pilot.claims[0], {
    implementationStatus: 'untested',
    formulaStatus: 'undocumented',
    bibliographicStatus: 'primary',
    interpretationStatus: 'unreviewed'
});
assert.ok(codes(jumped).has('invalid_transition'));

const fromTest = bundle();
fromTest.sources.sources[0].bibliographicStatus = 'secondary';
fromTest.sources.editions[0].authenticated = true;
fromTest.sources.editions[0].authenticationBasis = 'project_owner';
fromTest.pilot.claims[0].editionId = 'ed';
fromTest.pilot.claims[0].inferredFromTestPass = true;
Object.assign(fromTest.pilot.claims[0], {
    implementationStatus: 'tested',
    formulaStatus: 'undocumented',
    bibliographicStatus: 'primary',
    interpretationStatus: 'unreviewed'
});
assert.ok(codes(fromTest).has('invalid_provenance'));

const reviewed = bundle();
reviewed.sources.sources[0].bibliographicStatus = 'primary';
reviewed.sources.editions[0].authenticated = true;
reviewed.sources.editions[0].authenticationBasis = 'project_owner';
reviewed.sources.editions[0].textCollatedAgainstOriginal = false;
reviewed.sources.editions[0].originalEditionAuthenticated = false;
reviewed.sources.editions[0].authenticationScope = 'library_record_accepted_by_owner';
reviewed.pilot.claims[0].editionId = 'ed';
reviewed.pilot.claims[0].sourceId = 'thai-thu-lang-tan-bien';
Object.assign(reviewed.pilot.claims[0], {
    implementationStatus: 'tested',
    formulaStatus: 'checked_against_edition',
    bibliographicStatus: 'primary',
    interpretationStatus: 'sourced'
});
const unreviewed = validateKnowledgeBundle(reviewed);
assert.strictEqual(unreviewed.ok, true, JSON.stringify(unreviewed.errors));
assert.strictEqual(unreviewed.levels.bibliographicallyVerified, false);
assert.strictEqual(unreviewed.levels.formulaVerified, false);
assert.strictEqual(unreviewed.levels.approvedForInterpretation, false);
reviewed.humanReview = { bibliographic: true, formula: true, interpretation: true };
const approved = validateKnowledgeBundle(reviewed);
assert.strictEqual(approved.ok, true, JSON.stringify(approved.errors));
assert.strictEqual(approved.levels.bibliographicallyVerified, true);
assert.strictEqual(approved.levels.formulaVerified, true);
assert.strictEqual(approved.levels.approvedForInterpretation, true);

const nullSource = bundle();
nullSource.sources.sources.push(null);
assert.strictEqual(validateKnowledgeBundle(nullSource).ok, false);
assert.ok(codes(nullSource).has('malformed_json'));

const badClaims = bundle();
badClaims.pilot.claims = 'bad';
assert.strictEqual(validateKnowledgeBundle(badClaims).ok, false);
assert.ok(codes(badClaims).has('malformed_json'));

const blankPalace = bundle();
blankPalace.pilot.claims[0].rule = { samePalace: [''] };
assert.ok(codes(blankPalace).has('invalid_empty_condition'));

const blankClause = bundle();
blankClause.pilot.claims[0].rule = { clauses: [{ stars: [] }] };
assert.ok(codes(blankClause).has('invalid_empty_condition'));

const noContract = bundle();
delete noContract.contract;
noContract.sources.sources[0].bibliographicStatus = 'primary';
noContract.sources.editions[0].authenticated = true;
noContract.sources.editions[0].authenticationBasis = 'project_owner';
noContract.humanReview = { bibliographic: true, formula: true, interpretation: true };
Object.assign(noContract.pilot.claims[0], {
    formulaStatus: 'checked_against_edition',
    bibliographicStatus: 'primary',
    interpretationStatus: 'sourced',
    implementationStatus: 'tested'
});
const ungated = validateKnowledgeBundle(noContract);
assert.strictEqual(ungated.levels.formulaVerified, false);
assert.strictEqual(ungated.levels.bibliographicallyVerified, false);
assert.strictEqual(ungated.levels.approvedForInterpretation, false);

const uncitedEdition = bundle();
delete uncitedEdition.pilot.sourceId;
uncitedEdition.sources.sources.push({
    sourceId: 'other',
    bibliographicStatus: 'secondary',
    schoolId: null
});
uncitedEdition.sources.editions.push({
    editionId: 'other-ed',
    sourceId: 'other',
    authenticated: true,
    authenticationBasis: 'project_owner'
});
uncitedEdition.pilot.claims[0].sourceReferences = [{
    sourceId: 'thai-thu-lang-tan-bien',
    supportType: 'states'
}];
uncitedEdition.pilot.claims[0].editionId = 'other-ed';
uncitedEdition.humanReview = { formula: true, bibliographic: true };
Object.assign(uncitedEdition.pilot.claims[0], {
    implementationStatus: 'tested',
    formulaStatus: 'checked_against_edition',
    bibliographicStatus: 'primary',
    interpretationStatus: 'unreviewed'
});
const uncited = validateKnowledgeBundle(uncitedEdition);
assert.ok(uncited.errors.some((error) => error.code === 'mismatched_edition'));
assert.strictEqual(uncited.levels.formulaVerified, false);
assert.strictEqual(uncited.levels.bibliographicallyVerified, false);

assert.strictEqual(parseKnowledgeJson('{').ok, false);
assert.strictEqual(parseKnowledgeJson('[]').ok, false);
assert.strictEqual(parseKnowledgeJson('{"ok":true}').ok, true);

console.log('knowledge validator separates schema validity from expert verification');
