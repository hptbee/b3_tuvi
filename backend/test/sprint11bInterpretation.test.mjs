import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { interpretChart } from '../src/interpretation/pipeline.js';
import { claimEligibility } from '../src/interpretation/eligibility.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import claimsDoc from '../../docs/knowledge/interpretation-claims.json' with { type: 'json' };

const span = readFileSync(fileURLToPath(new URL('../../docs/knowledge/passages/tu-phu-dong-cung/span.txt', import.meta.url)), 'utf8');
const claim = claimsDoc.claims[0];
assert.ok(span.includes('Tuổi Giáp có cách này chắc chắn là được hưởng phúc trọn đời'));
assert.ok(claim.approvedWording.startsWith('Tuổi Giáp có cách này chắc chắn là được hưởng phúc trọn đời'));
assert.strictEqual(claim.expertVerified, false);
assert.strictEqual(claim.releasePermission, 'withheld');

function chartFrom(can, chi, day, month, hour) {
    const tuviInfo = calculateTuVi(can, chi, day, month, hour, 1, false);
    const chart = normalizeChart({
        tuviInfo,
        lunarInfo: { canIndex: can, chiIndex: chi, canName: can === 0 ? 'Giáp' : 'Ất', lunarDay: day, lunarMonth: month }
    });
    chart.chartSource = 'server';
    return chart;
}

const positive = chartFrom(0, 0, 6, 1, 1);
const reading = interpretChart(positive, { includeInternal: true });
const menh = reading.statements.find((item) => item.statementId === 'palace:menh');
assert.strictEqual(menh.availabilityStatus, 'eligible_claims_present');
assert.strictEqual(menh.prose, null);
assert.match(menh.internalProse, /Tuổi Giáp có cách này/);
assert.match(menh.internalProse, /không phải sự kiện đời đã kiểm chứng/);
assert.ok(menh.claimApplicability.find((item) => item.claimId === claim.claimId).layers.grade !== 'satisfied');
assert.notStrictEqual(menh.breakingConditions, 'checked_clear');

const missed = chartFrom(0, 0, 1, 1, 1);
const missedMenh = interpretChart(missed, { includeInternal: true }).statements.find((item) => item.statementId === 'palace:menh');
assert.notStrictEqual(missedMenh.availabilityStatus, 'eligible_claims_present');
assert.strictEqual(missedMenh.internalProse, null);
assert.ok(missedMenh.claimApplicability.find((item) => item.claimId === claim.claimId).reasons.includes('formula_runtime_not_matched'));

const otherStem = chartFrom(1, 0, 6, 1, 1);
const stemGate = claimEligibility(claim, otherStem, otherStem.palaces.find((palace) => palace.functionId === 'menh'), {
    formulaHits: [{ catalogId: 'tu_phu_dong_cung', palaceId: otherStem.menhPalaceId, sourceProfile: 'tan-bien', gradeStatus: 'not_certified', formationStatus: 'unknown', breakingStatus: 'not_implemented' }]
});
assert.ok(stemGate.reasons.includes('year_stem_not_met'));

const blocked = claimEligibility({ ...claim, claimId: 'interp-blocked-condition', conditions: ['vô Sát chưa mã hóa'] }, positive, positive.palaces.find((palace) => palace.functionId === 'menh'), {
    formulaHits: [{ catalogId: 'tu_phu_dong_cung', palaceId: positive.menhPalaceId, sourceProfile: 'tan-bien', gradeStatus: 'not_certified', formationStatus: 'unknown', breakingStatus: 'not_implemented' }]
});
assert.ok(blocked.reasons.includes('conditions_not_evaluated'));

const conflict = interpretChart(positive, {
    includeInternal: true,
    claims: [{ ...claim, claimId: 'interp-conflict', contradicts: [claim.claimId], relatedPalaces: ['menh'] }]
});
assert.strictEqual(conflict.statements.find((item) => item.statementId === 'palace:menh').availabilityStatus, 'contradiction');
assert.strictEqual(conflict.statements.find((item) => item.statementId === 'palace:menh').internalProse, null);

const wrongSchool = { ...positive, schoolId: 'other-school' };
const school = interpretChart(wrongSchool, { includeInternal: true });
assert.ok(school.statements.find((item) => item.statementId === 'palace:menh').claimApplicability.find((item) => item.claimId === claim.claimId).reasons.includes('school_mismatch'));

const unapproved = interpretChart(positive, {
    includeInternal: true,
    claims: [{ ...claim, claimId: 'interp-unapproved', approvedForInterpretation: false }]
});
assert.strictEqual(unapproved.statements.find((item) => item.statementId === 'palace:menh').internalProse.includes('interp-unapproved') || true, true);
assert.ok(!String(unapproved.statements.find((item) => item.statementId === 'palace:menh').internalProse || '').includes('interp-unapproved'));

const promoted = claimEligibility(claim, positive, positive.palaces.find((palace) => palace.functionId === 'menh'), {
    formulaHits: [{ catalogId: 'tu_phu_dong_cung', palaceId: positive.menhPalaceId, sourceProfile: 'tan-bien', gradeStatus: 'satisfied', formationStatus: 'unknown', breakingStatus: 'not_implemented' }]
});
assert.ok(promoted.reasons.includes('formation_or_grade_promoted'));

const publicBody = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.ok(publicBody.body.statements.every((item) => item.internalProse == null && item.prose == null));

console.log('sprint 11b internal interpretation stays source-bound and withheld from public');
