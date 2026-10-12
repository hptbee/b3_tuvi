import assert from 'assert';
import sourcesDoc from '../../docs/knowledge/sources.json' with { type: 'json' };
import matrixDoc from '../../docs/knowledge/combination-source-matrix.json' with { type: 'json' };
import catalog from '../src/data/combinations.json' with { type: 'json' };
import rules from '../src/data/rulesV2.json' with { type: 'json' };
import pilot from '../../docs/knowledge/pilotClaims.json' with { type: 'json' };

const PILOT = new Set(pilot.claims.map((claim) => claim.combinationName));
const FORMULA = new Set(['CONFLICT', 'PARTIAL', 'NOT_IMPLEMENTED', 'MATCH']);

const BIBLIO = new Set([
    'primary',
    'secondary',
    'unverified_attribution',
    'conflicting_secondary',
    'internal'
]);

const ids = sourcesDoc.sources.map((source) => source.sourceId);
assert.strictEqual(new Set(ids).size, ids.length);
for (const source of sourcesDoc.sources) {
    assert.ok(BIBLIO.has(source.bibliographicStatus), source.sourceId);
    assert.notStrictEqual(source.bibliographicStatus, 'primary');
    assert.ok(!source.page);
    assert.ok(!source.passageReference);
}

assert.strictEqual(matrixDoc.rows.length, catalog.length);
const ruleBy = new Map(rules.map((rule) => [rule.combination, rule]));
matrixDoc.rows.forEach((row, index) => {
    assert.strictEqual(row.name, catalog[index].name);
    assert.strictEqual(row.verificationStatus, catalog[index].verification_status);
    assert.strictEqual(row.formulaCheckedAgainstSource, false);
    assert.strictEqual(row.interpretationSourced, false);
    if (PILOT.has(row.name)) {
        assert.deepStrictEqual(row.sources, ['thai-thu-lang-tan-bien']);
        assert.strictEqual(row.sourceVerificationStatus, 'passage_located_edition_unverified');
        assert.ok(FORMULA.has(row.formulaComparisonStatus));
    } else {
        assert.deepStrictEqual(row.sources, []);
        assert.strictEqual(row.sourceVerificationStatus, 'none');
    }
    const rule = ruleBy.get(row.name);
    assert.strictEqual(row.executableV2, Boolean(rule));
    assert.strictEqual(row.ruleId, rule ? rule.id : null);
});

const editionIds = sourcesDoc.editions.map((edition) => edition.editionId);
assert.strictEqual(new Set(editionIds).size, editionIds.length);
assert.ok(sourcesDoc.editions.every((edition) => edition.authenticated === false));
assert.notStrictEqual(sourcesDoc.editions[0].pageCount, sourcesDoc.editions[1].pageCount);

const claimIds = pilot.claims.map((claim) => claim.claimId);
assert.strictEqual(new Set(claimIds).size, claimIds.length);
assert.strictEqual(pilot.claims.length, 10);
for (const claim of pilot.claims) {
    assert.ok(claim.pageNumber >= 229 && claim.pageNumber <= 232);
    assert.strictEqual(claim.pdfPageIndex, claim.pageNumber);
    assert.ok(FORMULA.has(claim.formulaComparisonStatus));
    assert.ok(claim.excerpt.length > 20);
}
const khoa = catalog.find((item) => item.name === 'Khoa Minh Lộc Ám');
assert.strictEqual(khoa.verification_status, 'disabled');
assert.ok(!rules.some((rule) => rule.combination === 'Khoa Minh Lộc Ám'));
const phu = rules.find((rule) => rule.id === 'phu_tuong_trieu_vien');
assert.strictEqual(phu.clauses[0].at, 'tam_hop_partners');

console.log('knowledge catalogs keep edition unverified and runtime rules unchanged');
