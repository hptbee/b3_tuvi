import { test, expect } from '@playwright/test';

const chartUrl = '/la-so?day=15&month=6&year=1990&hour=8&gender=1';
// Synthetic presentation data: these tests do not certify a domain formation.
const combination = { _id: 'same-id', name: 'Cách minh họa', type: 'cat_cach', description: 'Mô tả từ catalog.',
  formula_text: 'Điều kiện được khai báo.', summary: 'Nội dung catalog tham khảo.', tags: ['tham khảo'],
  verification_status: 'provisional', disclaimer: 'Không phải kết luận chắc chắn về cuộc đời.' };
const matched = (name = combination.name) => ({ count: 1, combinations: [{ ...combination, name }] });
const reply = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

test('keyboard opens and closes catalog conditions at 320px with a valid disclosure relationship', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.route('**/api/combinations/match', route => reply(route, matched()));
  await page.goto(chartUrl);
  const toggle = page.getByRole('button', { name: 'Cách minh họa', exact: true });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const id = await toggle.getAttribute('aria-controls');
  const detail = page.locator('.cach-cuc-panel .card-detail');
  await expect(detail).toHaveAttribute('id', id);
  expect(await page.evaluate(controlled => Boolean(document.getElementById(controlled)), id)).toBe(true);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(detail).toBeVisible();
  await expect(detail).toContainText(combination.formula_text);
  await expect(detail).toContainText(combination.summary);
  await expect(detail).toContainText(combination.disclaimer);
  await expect(page.getByText('Chưa xác thực — không phải kết luận chắc chắn về cuộc đời.')).toBeVisible();
  const focusedOutline = await toggle.evaluate(element => getComputedStyle(element).outlineStyle);
  expect(focusedOutline).not.toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(detail).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('failed match retries the committed chart without another chart generation', async ({ page }) => {
  let recovering = false;
  let chartRequests = 0;
  const failed = [];
  const retried = [];
  page.on('request', request => { if (request.url().endsWith('/api/charts/generate')) chartRequests += 1; });
  await page.route('**/api/combinations/match', route => {
    (recovering ? retried : failed).push(route.request().postDataJSON());
    return reply(route, recovering ? matched() : { error: 'Private server detail' }, recovering ? 200 : 503);
  });
  await page.goto(chartUrl);
  await expect(page.locator('.center-info')).toContainText('8 giờ 00 phút');
  await expect(page.locator('.cach-cuc-panel').getByRole('alert')).toContainText('Không tải được cách cục');
  await expect(page.locator('.cach-cuc-panel')).not.toContainText('Private');
  await page.getByRole('combobox', { name: 'Giờ sinh', exact: true }).selectOption('10');
  const originalChartRequests = chartRequests;
  recovering = true;
  await page.getByRole('button', { name: 'Thử lại cách cục' }).click();
  await expect(page.getByRole('button', { name: 'Cách minh họa', exact: true })).toBeVisible();
  expect(retried).toEqual([failed.at(-1)]);
  expect(chartRequests).toBe(originalChartRequests);
  await expect(page.locator('.center-info')).toContainText('8 giờ 00 phút');
  await expect(page.locator('.cach-cuc-panel').getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Cách cục', exact: true })).toBeFocused();
});

test('malformed successful match data is recoverable and does not replace the chart', async ({ page }) => {
  let recovering = false;
  await page.route('**/api/combinations/match', route => reply(route, recovering ? matched() : { combinations: [{ ...combination, tags: {} }] }));
  await page.goto(chartUrl);
  await expect(page.locator('.cach-cuc-panel').getByRole('alert')).toContainText('Không tải được cách cục');
  await expect(page.locator('.palace-box')).toHaveCount(12);
  await expect(page.getByText('Không phát hiện cách cục đặc biệt nào trong lá số này.')).toHaveCount(0);
  recovering = true;
  await page.getByRole('button', { name: 'Thử lại cách cục' }).click();
  await expect(page.getByRole('button', { name: 'Cách minh họa', exact: true })).toBeVisible();
});

test('changing charts closes existing expansion and ignores delayed matcher results', async ({ page }) => {
  let phase = 'first';
  const held = [];
  await page.route('**/api/combinations/match', async route => {
    if (phase === 'held') {
      let complete;
      const finished = new Promise(resolve => { complete = resolve; });
      await new Promise(resolve => held.push({ release: resolve, finished }));
      try { await reply(route, matched('Cách cũ')); } catch { /* Chart change aborts this request. */ }
      complete();
      return;
    }
    await reply(route, matched());
  });
  await page.goto(chartUrl);
  const toggle = page.getByRole('button', { name: 'Cách minh họa', exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  phase = 'held';
  await page.getByRole('combobox', { name: 'Giờ sinh', exact: true }).selectOption('9');
  await page.getByRole('button', { name: 'Lập Lá Số' }).click();
  await expect(page.locator('.center-info')).toContainText('9 giờ 00 phút');
  await expect.poll(() => held.length).toBeGreaterThan(0);
  phase = 'new';
  await page.getByRole('combobox', { name: 'Giờ sinh', exact: true }).selectOption('10');
  await page.getByRole('button', { name: 'Lập Lá Số' }).click();
  await expect(page.locator('.center-info')).toContainText('10 giờ 00 phút');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  for (const pending of held) pending.release();
  await Promise.all(held.map(pending => pending.finished));
  await expect(page.getByRole('button', { name: 'Cách cũ', exact: true })).toHaveCount(0);
});
