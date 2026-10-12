import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import sourcesDoc from '../../docs/knowledge/sources.json' with { type: 'json' };
import matrixDoc from '../../docs/knowledge/combination-source-matrix.json' with { type: 'json' };
import catalog from '../src/data/combinations.json' with { type: 'json' };
import rules from '../src/data/rulesV2.json' with { type: 'json' };
import pilot from '../../docs/knowledge/pilotClaims.json' with { type: 'json' };

const masterPlan = readFileSync(
    fileURLToPath(new URL('../../docs/AUTODEV_MASTER_PLAN.md', import.meta.url)),
    'utf8'
);
assert.match(masterPlan, /M0-01\s+Master Plan\s+completed/);
assert.match(masterPlan, /M0-02\s+CONTRIBUTING safeguards\s+READY/);
assert.match(masterPlan, /KB-02\s+Authenticate edition\s+BLOCKED/);
assert.match(masterPlan, /P1\.3B\s+SQLite schema v2\s+BLOCKED/);
assert.match(masterPlan, /LLM-01 \/ FORTUNE-01\s+deferred/);
assert.match(masterPlan, /Không ấn bản in nào `authenticated: true`/);
assert.match(masterPlan, /Không cách nào `formulaCheckedAgainstSource: true`/);

const masterPlanV2 = readFileSync(
    fileURLToPath(new URL('../../docs/AUTODEV_MASTER_PLAN_V2.md', import.meta.url)),
    'utf8'
);
assert.match(masterPlanV2, /\| AUTH-01 \| — \| `EXCLUDED_BY_PRODUCT_SCOPE` \|/);
assert.match(masterPlanV2, /### V2-KB-02[\s\S]{0,400}- status: COMPLETED/);
assert.match(masterPlanV2, /### V2-KB-03-prod[\s\S]{0,240}- status: BLOCKED_HUMAN/);
assert.match(masterPlanV2, /V2-M0-01/);
assert.match(masterPlanV2, /V2-KB-01/);
assert.match(masterPlanV2, /`authenticated: true` chỉ sau/);

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
        assert.strictEqual(row.sourceVerificationStatus, 'passage_located_owner_accepted_digital');
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
const accepted = sourcesDoc.editions.find((edition) => edition.editionId === 'tan-bien-retypeset-277-cover-1956');
assert.strictEqual(accepted.authenticated, true);
assert.strictEqual(accepted.authenticationBasis, 'project_owner');
assert.strictEqual(accepted.digitalArtifactVerified, true);
assert.strictEqual(accepted.originalEditionAuthenticated, false);
assert.strictEqual(accepted.textCollatedAgainstOriginal, false);
assert.strictEqual(accepted.publicationYear, null);
const print2012 = sourcesDoc.editions.find((edition) => edition.editionId === 'tan-bien-nxb-thoi-dai-2012');
assert.strictEqual(print2012.authenticated, false);
assert.strictEqual(print2012.catalogRecordVerified, true);
assert.strictEqual(print2012.physicalCopyInspected, false);
assert.strictEqual(print2012.textVerified, false);
assert.strictEqual(print2012.pageCount, 427);
const archiveMultipart = sourcesDoc.editions.find((edition) => edition.editionId === 'tan-bien-archive-2017-multipart');
assert.strictEqual(archiveMultipart.authenticated, false);
assert.strictEqual(archiveMultipart.archiveItemVerified, true);
assert.strictEqual(archiveMultipart.publicationYear, 1956);
assert.ok(sourcesDoc.editions.filter((edition) => edition.editionId !== accepted.editionId).every((edition) => edition.authenticated === false));
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

console.log('knowledge catalogs keep formula flags false and only the accepted PDF edition authenticated');
