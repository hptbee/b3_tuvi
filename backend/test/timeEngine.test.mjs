import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { timeOverlay } from '../src/time/timeEngine.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';

const tuviInfo = calculateTuVi(0, 1, 10, 1, 4, 1, false);
const before = tuviInfo.boxes[1].daiHan;
const chart = normalizeChart({ tuviInfo, lunarInfo: { canIndex: 0, chiIndex: 1 }, input: {} });
const overlay = timeOverlay(chart);
assert.strictEqual(overlay.ok, true);
assert.strictEqual(overlay.interpretation, null);
assert.strictEqual(overlay.capabilities.tieu_han.status, 'blocked');
assert.strictEqual(overlay.capabilities.luu_nien.status, 'blocked');
assert.strictEqual(overlay.capabilities.luu_tinh.status, 'blocked');
assert.strictEqual(overlay.capabilities.tu_hoa_han.status, 'blocked');
assert.strictEqual(overlay.capabilities.leap_month_fortune.status, 'not_applied');
assert.strictEqual(overlay.capabilities.dai_han_label.interpretation, 'not_approved');
assert.strictEqual(overlay.capabilities.dai_han_label.fortuneFormula, 'not_applied');
assert.strictEqual(overlay.research.tieu_han, 'BLOCKED_SOURCE');
assert.strictEqual(overlay.research.blockReason, 'direction_without_age_step');
assert.strictEqual(overlay.research.annualStarReasons.luu_loc, 'example_only_not_a_general_rule');
assert.strictEqual(overlay.research.annualStarReasons.tang_mon, 'reviewers_disagree_on_direction');
assert.strictEqual(overlay.research.luu_loc, 'BLOCKED_SOURCE');
assert.ok(!overlay.capabilities.tieu_han.branch);
assert.strictEqual(overlay.boundaries.leapMonthFortune, 'not_evaluated');
assert.strictEqual(overlay.boundaries.genderEffect, 'not_evaluated');
assert.notStrictEqual(overlay.boundaries.genderEffect, false);
assert.strictEqual(overlay.natalDecadeLabels.length, 12);
assert.ok(overlay.natalDecadeLabels.every((item) => item.daiHan !== undefined));
assert.strictEqual(tuviInfo.boxes[1].daiHan, before);
assert.deepStrictEqual(timeOverlay(chart), overlay);
assert.strictEqual(timeOverlay({ ok: false }).ok, false);

const response = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.strictEqual(response.body.time.capabilities.tieu_han.status, 'blocked');
assert.strictEqual(response.body.time.interpretation, null);

console.log('time overlay reads natal decade labels and blocks unapproved cycles');
