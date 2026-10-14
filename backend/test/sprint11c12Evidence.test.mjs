import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import claimsDoc from '../../docs/knowledge/interpretation-claims.json' with { type: 'json' };
import coNguyet from '../../docs/knowledge/interpretation-decisions/co-nguyet-dong-luong.json' with { type: 'json' };
import menhVo from '../../docs/knowledge/interpretation-decisions/menh-vo-chinh-dieu.json' with { type: 'json' };
import { claimEligibility } from '../src/interpretation/eligibility.js';

const span = readFileSync(fileURLToPath(new URL('../../docs/knowledge/passages/tu-phu-dong-cung/span.txt', import.meta.url)), 'utf8');
assert.strictEqual(claimsDoc.claims.length, 1);
assert.strictEqual(claimsDoc.claims[0].claimId, 'interp-tu-phu-dong-cung-giap-menh');
assert.ok(span.includes(claimsDoc.claims[0].approvedWording.split('. Đây là')[0]));
assert.strictEqual(claimsDoc.claims[0].expertVerified, false);
assert.strictEqual(coNguyet.decision, 'UNRESOLVED');
assert.strictEqual(coNguyet.approvedForInterpretation, false);
assert.strictEqual(menhVo.decision, 'INSUFFICIENT_EVIDENCE');
assert.ok(!claimsDoc.claims.some((claim) => claim.formulaCatalogId === 'co_nguyet_dong_luong'));

const mismatched = claimEligibility({
    ...claimsDoc.claims[0],
    sourceProfile: 'modern-108s'
}, { schoolId: 'vn-tam-hop-default', lunar: { canName: 'Giáp' } }, { id: '3' }, {
    formulaHits: [{
        catalogId: 'tu_phu_dong_cung',
        palaceId: '3',
        sourceProfile: 'tan-bien',
        gradeStatus: 'not_certified',
        formationStatus: 'unknown',
        breakingStatus: 'not_implemented'
    }]
});
assert.ok(mismatched.reasons.includes('formula_runtime_not_matched'));

console.log('sprint 11c keeps disagreed and definition-only passages unbound');
