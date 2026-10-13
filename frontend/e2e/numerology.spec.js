import { test, expect } from '@playwright/test';

const endpoint = '**/api/numerology/calculate';
const output = (page, name) => page.getByRole('status', { name, exact: true });
async function fill(page, { day = 15, month = 6, year = 1990, name = '' } = {}) {
  await page.locator('#num-day').fill(String(day));
  await page.locator('#num-month').fill(String(month));
  await page.locator('#num-year').fill(String(year));
  await page.locator('#num-name').fill(name);
}
const submit = page => page.getByRole('button', { name: 'Xem kết quả' }).click();
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

test('date-only uses the real API, leaves name metrics unavailable and exposes keyboard traces', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/than-so-hoc');
  await expect(page.locator('.num-results')).toHaveCount(0);
  await expect(page.getByRole('combobox')).toHaveCount(0);
  await fill(page);
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/numerology/calculate'));
  await submit(page);
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(response.headers()['cache-control']).toBe('no-store');
  expect(response.request().postDataJSON()).toEqual({ birthDate: { day: 15, month: 6, year: 1990 } });
  await expect(output(page, 'Đường đời')).toHaveText('4');
  await expect(output(page, 'Ngày sinh')).toHaveText('6');
  await expect(output(page, 'Thái độ')).toHaveText('3');
  await expect(page.getByText('Thêm họ tên để tính chỉ số này.', { exact: true })).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Các chỉ số của bạn' })).toBeFocused();
  const trace = page.locator('.num-trace').first();
  const summary = trace.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(trace).toHaveAttribute('open', '');
  await expect(trace).toContainText('Ngày: 1 + 5 = 6');
  await expect(trace).toContainText('31 → 3 + 1 = 4');
  await page.keyboard.press('Enter');
  await expect(trace).not.toHaveAttribute('open', '');
});

test('Vietnamese name produces seven independently expected values and a private normalization trace', async ({ page }) => {
  await page.goto('/than-so-hoc');
  await fill(page, { name: 'Nguyễn Văn An' });
  await submit(page);
  for (const [name, value] of [['Đường đời', 4], ['Ngày sinh', 6], ['Thái độ', 3], ['Biểu đạt', 3], ['Linh hồn', 1], ['Nhân cách', 11], ['Trưởng thành', 7]]) {
    await expect(output(page, name)).toHaveText(String(value));
  }
  await expect(page.getByRole('article', { name: 'Nhân cách', exact: true })).toContainText('Số đặc biệt · Gốc 2');
  const trace = page.locator('.num-name-trace');
  await trace.locator('summary').click();
  await expect(trace).toContainText('NGUYEN VAN AN');
  await expect(trace).toContainText('Y là phụ âm');
  await expect(trace.getByLabel('Y bằng 7')).toBeVisible();
  await expect(page).toHaveURL(/\/than-so-hoc$/);
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } }))).toEqual({ local: {}, session: {} });
  await page.reload();
  await expect(page.locator('.num-results')).toHaveCount(0);
  await expect(page.locator('#num-name')).toHaveValue('');
});

for (const fixture of [
  { day: 29, month: 9, year: 2007, value: 11, root: 2 },
  { day: 11, month: 1, year: 1990, value: 22, root: 4 },
  { day: 29, month: 3, year: 1990, value: 33, root: 6 }
]) {
  test(`real date arithmetic preserves master ${fixture.value} with root ${fixture.root}`, async ({ page }) => {
    await page.goto('/than-so-hoc');
    await fill(page, fixture);
    await submit(page);
    await expect(output(page, 'Đường đời')).toHaveText(String(fixture.value));
    const card = page.getByRole('article', { name: 'Đường đời', exact: true });
    await expect(card).toContainText(`Số đặc biệt · Gốc ${fixture.root}`);
    await card.locator('summary').click();
    await expect(card).toContainText('Giữ 11, 22, 33');
  });
}

test('impossible date focuses the date field and corrected input calculates', async ({ page }) => {
  await page.goto('/than-so-hoc');
  await fill(page, { day: 31, month: 2 });
  await submit(page);
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('#num-day')).toBeFocused();
  await expect(page.locator('#num-day')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.num-results')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Thử lại' })).toHaveCount(0);
  await fill(page);
  await submit(page);
  await expect(output(page, 'Đường đời')).toHaveText('4');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('hidden-only name reaches backend rejection and Vietnamese Đ remains supported', async ({ page }) => {
  await page.goto('/than-so-hoc');
  await fill(page, { name: '\uFEFF' });
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/numerology/calculate'));
  await submit(page);
  const response = await responsePromise;
  expect(response.status()).toBe(400);
  expect(response.request().postDataJSON().fullName).toBe('\uFEFF');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.locator('#num-name')).toBeFocused();
  await expect(page.locator('#num-name')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#num-name').fill('Đỗ');
  await submit(page);
  await expect(output(page, 'Biểu đạt')).toHaveText('1');
  await expect(output(page, 'Linh hồn')).toHaveText('6');
  await expect(output(page, 'Nhân cách')).toHaveText('4');
  await page.locator('.num-name-trace summary').click();
  await expect(page.locator('.num-name-trace')).toContainText('DO');
});

test('editing leaves results attached to the submitted date until resubmission', async ({ page }) => {
  await page.goto('/than-so-hoc');
  await fill(page);
  await submit(page);
  await expect(output(page, 'Đường đời')).toHaveText('4');
  await page.locator('#num-day').fill('16');
  await expect(page.locator('.num-draft-note')).toBeVisible();
  await expect(page.locator('.num-results-heading')).toContainText('15/6/1990');
  await expect(output(page, 'Đường đời')).toHaveText('4');
  await submit(page);
  await expect(output(page, 'Đường đời')).toHaveText('5');
  await expect(page.locator('.num-results-heading')).toContainText('16/6/1990');
  await expect(page.locator('.num-draft-note')).toHaveCount(0);
});

test('service retry sends the failed snapshot even after unsent form edits', async ({ page }) => {
  let recovering = false;
  const retries = [];
  await page.route(endpoint, async route => {
    if (!recovering) await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ ok: false, error: { message: 'Máy chủ đang bận', fields: [] } }) });
    else { retries.push(route.request().postDataJSON()); await route.continue(); }
  });
  await page.goto('/than-so-hoc');
  await fill(page);
  await submit(page);
  await expect(page.getByRole('alert')).toContainText('Máy chủ đang bận');
  await page.locator('#num-day').fill('16');
  recovering = true;
  await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(output(page, 'Đường đời')).toHaveText('4');
  expect(retries).toEqual([{ birthDate: { year: 1990, month: 6, day: 15 } }]);
  await expect(page.locator('.num-results-heading')).toContainText('15/6/1990');
  await expect(page.locator('#num-day')).toHaveValue('16');
  await expect(page.locator('.num-draft-note')).toBeVisible();
});

test('a changed submission replaces a held calculation without stale results', async ({ page }) => {
  const captured = deferred(), release = deferred(), finished = deferred();
  await page.route(endpoint, async route => {
    if (route.request().postDataJSON().birthDate.day !== 15) return route.continue();
    const response = await route.fetch();
    captured.resolve();
    await release.promise;
    try { await route.fulfill({ response }); } catch { /* Client deliberately aborted this request. */ }
    finally { finished.resolve(); }
  });
  try {
    await page.goto('/than-so-hoc');
    await fill(page);
    await submit(page);
    await captured.promise;
    await expect(page.getByRole('button', { name: 'Đang tính…' })).toBeDisabled();
    await page.locator('#num-day').fill('16');
    await submit(page);
    await expect(output(page, 'Đường đời')).toHaveText('5');
    release.resolve();
    await finished.promise;
    await expect(output(page, 'Đường đời')).toHaveText('5');
    await expect(page.locator('.num-results-heading')).toContainText('16/6/1990');
    await expect(page.getByRole('alert')).toHaveCount(0);
  } finally { release.resolve(); }
});

test('navigation cancels a pending calculation and returning starts a fresh form', async ({ page }) => {
  const captured = deferred(), release = deferred(), finished = deferred();
  let requests = 0;
  await page.route(endpoint, async route => {
    requests += 1;
    const response = await route.fetch();
    captured.resolve();
    await release.promise;
    try { await route.fulfill({ response }); } catch { /* Navigation deliberately aborted this request. */ }
    finally { finished.resolve(); }
  });
  try {
    await page.goto('/than-so-hoc');
    await fill(page, { name: 'Nguyễn Văn An' });
    await submit(page);
    await captured.promise;
    const domains = page.getByRole('navigation', { name: 'Chọn lĩnh vực' });
    await domains.getByRole('link', { name: 'Tử Vi', exact: true }).click();
    await expect(page).toHaveURL('/');
    await domains.getByRole('link', { name: 'Thần Số Học', exact: true }).click();
    release.resolve();
    await finished.promise;
    await expect(page).toHaveURL(/\/than-so-hoc$/);
    await expect(page.locator('.num-results')).toHaveCount(0);
    await expect(page.locator('#num-name')).toHaveValue('');
    await expect(page.locator('#num-day')).toHaveValue('');
    expect(requests).toBe(1);
  } finally { release.resolve(); }
});

for (const width of [320, 390]) {
  test(`mobile calculator and trace stay within ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/than-so-hoc');
    await fill(page, { name: 'Nguyễn Văn An' });
    await submit(page);
    await expect(output(page, 'Trưởng thành')).toHaveText('7');
    await page.locator('.num-name-trace summary').click();
    await expect(page.locator('.num-name-trace')).toContainText('NGUYEN VAN AN');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole('navigation', { name: 'Chọn lĩnh vực' })).toBeVisible();
  });
}
