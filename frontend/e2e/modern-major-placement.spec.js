import { test, expect } from '@playwright/test';

const profile = 'iztro-pinned-menh-cuc-decadal';
const chartUrl = '/la-so?day=15&month=6&year=1990&hour=8&gender=';
const panelFor = page => page.getByRole('region', { name: 'Vị trí Đại hạn — hồ sơ phần mềm iztro' });
async function apply(page, age) {
  await page.getByLabel('Hồ sơ Đại hạn', { exact: true }).selectOption(profile);
  await page.getByLabel('Tuổi mụ cho Đại hạn', { exact: true }).fill(String(age));
  const response = page.waitForResponse(response => response.url().endsWith('/api/interpretations/analyze')
    && response.request().postDataJSON().majorPeriod?.nominalAge === age);
  await page.getByRole('button', { name: 'Áp dụng tuổi mụ Đại hạn', exact: true }).click();
  return (await response).json();
}
function closedProse(cap) {
  expect(cap).toMatchObject({ profile, sourceId: 'iztro-modern-software',
    sourcePin: '2f00e2ab0c80b1632e55bc362f2ae26e121245cb',
    ageInput: 'caller_supplied', ageDerivation: 'not_applied', publicFortune: false,
    interpretation: null, interpretationStatus: 'blocked' });
}

test('explicit major ages cover first/next/final periods and both nonplacements', async ({ page }) => {
  await page.goto(`${chartUrl}1`);
  const panel = panelFor(page);
  await expect(panel).toContainText('Chọn hồ sơ và nhập tuổi mụ');
  await expect(page.getByLabel('Hồ sơ Đại hạn', { exact: true })).toHaveValue('');
  for (const [age, branch, start, end] of [[5, 'Dần', 5, 14], [14, 'Dần', 5, 14], [15, 'Mão', 15, 24], [124, 'Sửu', 115, 124]]) {
    const body = await apply(page, age);
    const cap = body.time.capabilities.dai_han_modern;
    closedProse(cap);
    expect(cap).toMatchObject({ status: 'branch_placed', reason: null, branch,
      decadeStartAge: start, decadeEndAge: end, palaceMapping: 'mapped' });
    expect(body.statements.filter(s => !s.thanOverlay && s.palaceId === cap.palaceId && s.functionId === cap.functionId)).toHaveLength(1);
    await expect(panel).toContainText(`Đại hạn tuổi mụ ${age}: chi ${branch}`);
    await expect(panel).toContainText(`khoảng tuổi mụ ${start}–${end}`);
  }
  for (const [age, reason, copy] of [[1, 'before_first_period', 'chưa đến khoảng Đại hạn đầu tiên'], [125, 'after_last_period', 'vượt khoảng Đại hạn cuối cùng']]) {
    const body = await apply(page, age); const cap = body.time.capabilities.dai_han_modern;
    closedProse(cap); expect(cap).toMatchObject({ status: 'not_applied', reason, branch: null,
      palaceId: null, decadeIndex: null, decadeStartAge: null, decadeEndAge: null });
    await expect(panel).toContainText(copy); await expect(panel).not.toContainText(`Đại hạn tuổi mụ ${age}: chi`);
  }
  await page.getByLabel('Hồ sơ Đại hạn', { exact: true }).selectOption('');
  await expect(panel).toContainText('Chọn hồ sơ và nhập tuổi mụ');
  await expect(page.getByLabel('Tuổi mụ cho Đại hạn', { exact: true })).toHaveValue('');
});

test('female modern major direction is reversed with the same explicit age convention', async ({ page }) => {
  await page.goto(`${chartUrl}-1`);
  const body = await apply(page, 15);
  closedProse(body.time.capabilities.dai_han_modern);
  expect(body.time.capabilities.dai_han_modern).toMatchObject({ branch: 'Sửu', decadeIndex: 1, decadeStartAge: 15, decadeEndAge: 24 });
  await expect(panelFor(page)).toContainText('Đại hạn tuổi mụ 15: chi Sửu');
});

test('major and minor profiles coexist with viewing year and hide unapplied major edits', async ({ page }) => {
  await page.goto(`${chartUrl}1`);
  await page.getByLabel('Hồ sơ Tiểu hạn', { exact: true }).selectOption('iztro-pinned-age1-sex-triad');
  await page.getByLabel('Tuổi mụ nhập trực tiếp', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Áp dụng tuổi mụ', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Vị trí Tiểu hạn — hồ sơ phần mềm iztro' })).toContainText('Tuổi mụ 2: chi Tị');
  const body = await apply(page, 15);
  expect(body.time.capabilities.tieu_han_modern).toMatchObject({ nominalAge: 2, branch: 'Tị' });
  await page.getByLabel('Chi năm xem', { exact: true }).selectOption('Ngọ');
  await expect(panelFor(page)).toContainText('Đại hạn tuổi mụ 15: chi Mão');
  await expect(page.getByRole('region', { name: 'Vị trí sao theo chi năm xem' })).toContainText('Thiên Đức: chi Mão');
  await page.getByLabel('Tuổi mụ cho Đại hạn', { exact: true }).fill('16');
  await expect(panelFor(page)).toContainText('Chưa áp dụng thay đổi Đại hạn');
  await expect(panelFor(page)).not.toContainText('Đại hạn tuổi mụ 15:');
});

test('invalid major age never requests a placement and controls fit mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto(`${chartUrl}1`);
  await apply(page, 5); const panel = panelFor(page);
  await page.getByLabel('Tuổi mụ cho Đại hạn', { exact: true }).fill('126');
  let invalidRequests = 0;
  page.on('request', request => { if (request.url().endsWith('/api/interpretations/analyze') && request.postDataJSON()?.majorPeriod?.nominalAge === 126) invalidRequests++; });
  await page.getByRole('button', { name: 'Áp dụng tuổi mụ Đại hạn', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('số nguyên từ 1 đến 125');
  expect(invalidRequests).toBe(0); await expect(panel).not.toContainText('Đại hạn tuổi mụ 5:');
  for (const control of await panel.locator('input, select, button').all()) {
    const bounds = await control.boundingBox(); expect(bounds.x).toBeGreaterThanOrEqual(0); expect(bounds.x + bounds.width).toBeLessThanOrEqual(391);
  }
});
