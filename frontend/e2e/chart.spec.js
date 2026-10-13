import { test, expect } from '@playwright/test';

test('generates a chart, evidence, and export controls', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Ngày dương').fill('15');
  await page.getByPlaceholder('Tháng dương').fill('6');
  await page.getByPlaceholder('Năm dương').fill('1990');
  await page.getByRole('combobox').first().selectOption('8');
  await page.getByRole('button', { name: 'Lập Lá Số' }).click();
  await expect(page.getByRole('heading', { name: 'LÁ SỐ TỬ VI' })).toBeVisible();
  await expect(page.locator('.palace-box').filter({ hasText: 'MỆNH' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Trạng thái chứng cứ' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Mệnh:/ })).toBeVisible();
  await page.getByRole('button', { name: /Mệnh:/ }).click();
  await expect(page.getByText(/Công thức chưa được duyệt nguồn/)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Cách cục/ })).toBeVisible();
  await expect(page.getByText('Luận giải:')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'In lá số' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tải JSON' })).toBeVisible();
});

test('keeps the newer hour when the first analysis is slow', async ({ page }) => {
  await page.route('**/api/interpretations/analyze', async (route) => {
    const body = route.request().postDataJSON();
    if (body.hour === 8) await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  await page.getByRole('combobox').first().selectOption('10');
  await page.getByRole('button', { name: 'Lập Lá Số' }).click();
  await expect(page).toHaveURL(/hour=10/);
  await expect(page.getByRole('button', { name: /Mệnh:/ })).toBeVisible();
});

test('shows a safe message when analysis fails', async ({ page }) => {
  await page.route('**/api/interpretations/analyze', (route) => route.fulfill({
    status: 500,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Lỗi phân tích lá số' })
  }));
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  await expect(page.getByRole('alert')).toContainText('Lỗi phân tích lá số');
  await expect(page.getByRole('heading', { name: 'LÁ SỐ TỬ VI' })).toBeVisible();
});

test('keyboard reaches and activates the print control', async ({ page }) => {
  await page.addInitScript(() => {
    window.printCalls = 0;
    window.print = () => { window.printCalls += 1; };
  });
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  const print = page.getByRole('button', { name: 'In lá số' });
  await expect(print).toBeVisible();
  await page.getByRole('button', { name: 'Lập Lá Số' }).focus();
  await page.keyboard.press('Tab');
  await expect(print).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.printCalls)).toBe(1);
});

test('editing the form keeps the chart tied to the submitted birth time', async ({ page }) => {
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  await expect(page.locator('.center-info')).toContainText('8 giờ 00 phút');
  await page.getByRole('combobox', { name: 'Giờ sinh', exact: true }).selectOption('10');
  await expect(page.locator('.center-info')).toContainText('8 giờ 00 phút');
  await page.getByRole('button', { name: 'Lập Lá Số' }).click();
  await expect(page.locator('.center-info')).toContainText('10 giờ 00 phút');
});

test('a slow chart cannot replace the latest chart after navigation', async ({ page }) => {
  await page.route('**/api/charts/generate', async route => {
    if (route.request().postDataJSON().hour === 8) await new Promise(resolve => setTimeout(resolve, 800));
    try { await route.continue(); } catch { /* Navigation cancels the old request. */ }
  });
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  await page.getByRole('link', { name: '← Về trang bắt đầu' }).click();
  await expect(page).toHaveURL(/\/$/);
  const hour = page.getByRole('combobox', { name: 'Giờ sinh', exact: true });
  await expect(hour).toHaveValue('1');
  await hour.selectOption('10');
  await expect(hour).toHaveValue('10');
  await page.getByRole('button', { name: 'Lập Lá Số' }).click();
  await expect(page.locator('.center-info')).toContainText('10 giờ 00 phút');
  await page.waitForTimeout(1000);
  await expect(page.locator('.center-info')).toContainText('10 giờ 00 phút');
});

test('mobile navigation separates the disciplines without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Lập lá số của bạn' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('navigation', { name: 'Chọn lĩnh vực' }).getByRole('link', { name: /Thần Số Học/ }).click();
  await expect(page).toHaveURL(/than-so-hoc/);
  await expect(page.getByRole('heading', { name: 'Tính chỉ số của bạn', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  await expect(page.locator('.center-info')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
