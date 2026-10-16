import { test, expect } from '@playwright/test';

const profile = 'iztro-pinned-age1-sex-triad';
const pin = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb';
const chartUrl = '/la-so?day=15&month=6&year=1990&hour=8&gender=';
const panelFor = page => page.getByRole('region', { name: 'Vị trí Tiểu hạn — hồ sơ phần mềm iztro' });
async function apply(page, age) {
  await page.getByLabel('Hồ sơ Tiểu hạn', { exact: true }).selectOption(profile);
  await page.getByLabel('Tuổi mụ nhập trực tiếp', { exact: true }).fill(String(age));
  const response = page.waitForResponse(response => response.url().endsWith('/api/interpretations/analyze')
    && response.request().postDataJSON().minorPeriod?.nominalAge === age);
  await page.getByRole('button', { name: 'Áp dụng tuổi mụ', exact: true }).click();
  return (await response).json();
}
function assertClosed(capability) {
  expect(capability).toMatchObject({ profile, sourceId: 'iztro-modern-software', sourcePin: pin,
    ageInput: 'caller_supplied', ageDerivation: 'not_applied', publicFortune: false,
    interpretation: null, interpretationStatus: 'blocked', palaceMapping: 'mapped', status: 'branch_placed' });
}

test('explicit male age1, age2 and age120 map source positions, then clear', async ({ page }) => {
  await page.goto(`${chartUrl}1`);
  const panel = panelFor(page);
  await expect(panel).toContainText('Chọn hồ sơ và nhập tuổi mụ');
  await expect(page.getByLabel('Hồ sơ Tiểu hạn', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Tuổi mụ nhập trực tiếp', { exact: true })).toHaveValue('');
  for (const [age, branch] of [[1, 'Thìn'], [2, 'Tị'], [120, 'Mão']]) {
    const body = await apply(page, age);
    const cap = body.time.capabilities.tieu_han_modern;
    assertClosed(cap);
    expect(cap.nominalAge).toBe(age);
    expect(cap.branch).toBe(branch);
    expect(body.statements.filter(s => !s.thanOverlay && s.palaceId === cap.palaceId && s.functionId === cap.functionId)).toHaveLength(1);
    await expect(panel).toContainText(`Tuổi mụ ${age}: chi ${branch} — cung`);
  }
  await expect(panel.getByRole('link')).toHaveAttribute('href', new RegExp(pin));
  await expect(panel).toContainText('ứng dụng không tự tính tuổi');
  await page.getByLabel('Hồ sơ Tiểu hạn', { exact: true }).selectOption('');
  await expect(panel).toContainText('Chọn hồ sơ và nhập tuổi mụ');
  await expect(panel).not.toContainText('Tuổi mụ 120:');
});

test('female explicit ages use the reviewed reverse direction', async ({ page }) => {
  await page.goto(`${chartUrl}-1`);
  for (const [age, branch] of [[1, 'Thìn'], [2, 'Mão'], [120, 'Tị']]) {
    const body = await apply(page, age);
    assertClosed(body.time.capabilities.tieu_han_modern);
    expect(body.time.capabilities.tieu_han_modern.branch).toBe(branch);
    await expect(panelFor(page)).toContainText(`Tuổi mụ ${age}: chi ${branch} — cung`);
  }
});

test('annual selector and explicit minor age remain independent', async ({ page }) => {
  await page.goto(`${chartUrl}1`);
  const year = page.getByRole('combobox', { name: 'Chi năm xem', exact: true });
  await year.selectOption('Tí');
  await expect(page.getByRole('region', { name: 'Vị trí sao theo chi năm xem' })).toContainText('Thiên Đức: chi Dậu');
  let body = await apply(page, 1);
  expect(body.time.capabilities.thien_duc.branch).toBe('Dậu');
  expect(body.time.capabilities.nguyet_duc.branch).toBe('Tí');
  await year.selectOption('Ngọ');
  await expect(panelFor(page)).toContainText('Tuổi mụ 1: chi Thìn');
  body = await apply(page, 2);
  expect(body.time.capabilities.thien_duc.branch).toBe('Mão');
  expect(body.time.capabilities.nguyet_duc.branch).toBe('Ngọ');
  expect(body.time.capabilities.tieu_han_modern.branch).toBe('Tị');
});

test('invalid draft age preserves the natal analysis and fits mobile controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${chartUrl}1`);
  await apply(page, 1);
  const panel = panelFor(page);
  await page.getByLabel('Tuổi mụ nhập trực tiếp', { exact: true }).fill('121');
  await expect(panel).not.toContainText('Tuổi mụ 1:');
  let invalidRequests = 0;
  page.on('request', request => {
    if (request.url().endsWith('/api/interpretations/analyze') && request.postDataJSON()?.minorPeriod?.nominalAge === 121) invalidRequests++;
  });
  await page.getByRole('button', { name: 'Áp dụng tuổi mụ', exact: true }).click();
  await expect(panel.getByRole('alert')).toContainText('số nguyên từ 1 đến 120');
  await expect(page.getByRole('button', { name: /Mệnh: Chưa đủ chứng cứ/ })).toBeVisible();
  expect(invalidRequests).toBe(0);
  for (const control of await panel.locator('input, select, button').all()) {
    const bounds = await control.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(391);
  }
});
