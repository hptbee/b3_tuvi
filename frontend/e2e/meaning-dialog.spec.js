import { test, expect } from '@playwright/test';

const chartUrl = '/la-so?day=15&month=6&year=1990&hour=8&gender=1';

test('detail dialog exposes failure and retry, traps keyboard focus and restores its trigger', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/meanings/star/**', route => route.fulfill({
    status: calls++ === 0 ? 503 : 200, contentType: 'application/json',
    body: JSON.stringify(calls === 1 ? { error: 'Private failure' } : { text: 'Thông tin tra cứu mẫu.' })
  }));
  await page.goto(chartUrl);
  const origin = page.locator('.major-star').first();
  await expect(origin).toBeVisible();
  await origin.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'Đóng thông tin' });
  await expect(close).toBeFocused();
  await expect(dialog.getByRole('alert')).toContainText('Không tải được thông tin');
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('button', { name: 'Thử lại' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog.getByText('Thông tin tra cứu mẫu.')).toBeVisible();
  await expect(dialog.getByRole('heading')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(origin).toBeFocused();
  await expect(page.locator('.center-info')).toContainText('8 giờ 00 phút');
});

test('palace details reject malformed success, fit mobile, scroll and close from backdrop', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  let calls = 0;
  await page.route('**/api/meanings/palace/**', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify(calls++ === 0 ? { error: 'not a list' } : [{ title: 'Thông tin mẫu', desc: 'Nội dung tra cứu mẫu. '.repeat(200) }])
  }));
  await page.goto(chartUrl);
  const origin = page.locator('.cung-name-group').first();
  await expect(origin).toBeVisible();
  await origin.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('alert')).toContainText('Không tải được thông tin');
  await dialog.getByRole('button', { name: 'Thử lại' }).click();
  await expect(dialog.getByRole('heading', { name: 'Thông tin mẫu' })).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.width).toBeLessThanOrEqual(320);
  expect(bounds.height).toBeLessThanOrEqual(700);
  expect(await dialog.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
  await page.mouse.click(2, 2);
  await expect(dialog).toHaveCount(0);
  await expect(origin).toBeFocused();
});
