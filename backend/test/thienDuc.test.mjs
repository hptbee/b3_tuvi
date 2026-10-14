import assert from 'assert';
import { thienDucBranch } from '../src/time/thienDuc.js';
import { timeOverlay } from '../src/time/timeEngine.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';

assert.deepStrictEqual(thienDucBranch('Tí'), {
    ok: true,
    branch: 'Dậu',
    profile: 'ziwei-quanshu-wikisource-juan2',
    convention: 'hko-earthly-branch-forward',
    publicFortune: false,
    interpretation: null
});
assert.strictEqual(thienDucBranch('Sửu').branch, 'Tuất');
assert.strictEqual(thienDucBranch('Hợi').branch, 'Thân');
assert.strictEqual(thienDucBranch('Tý').ok, false);
assert.strictEqual(thienDucBranch('Tý').interpretation, null);

const tuviInfo = calculateTuVi(0, 1, 10, 1, 4, 1, false);
const chart = normalizeChart({ tuviInfo, lunarInfo: { canIndex: 0, chiIndex: 1 } });
const hidden = timeOverlay(chart);
assert.strictEqual(hidden.capabilities.thien_duc.status, 'not_applied');
assert.strictEqual(hidden.capabilities.thien_duc.reason, 'missing_view_year_branch');
assert.deepStrictEqual(hidden.research.missingParameters.dai_han, ['starting_age', 'years_per_palace', 'yin_yang_definition']);
assert.deepStrictEqual(hidden.research.missingParameters.tieu_han, ['age_on_start_palace', 'step_size']);
assert.strictEqual(hidden.research.annualStarReasons.tang_mon, 'opposite_offset_not_agreed');

const shown = timeOverlay(chart, { viewYearBranch: 'Tí' });
assert.strictEqual(shown.capabilities.thien_duc.branch, 'Dậu');
assert.strictEqual(shown.capabilities.thien_duc.publicFortune, false);
assert.strictEqual(shown.capabilities.thien_duc.interpretation, null);
assert.strictEqual(shown.interpretation, null);

console.log('thiên đức places a branch only and does not open a fortune reading');
