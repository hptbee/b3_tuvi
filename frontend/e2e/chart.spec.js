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

test('keyboard reaches the print control', async ({ page }) => {
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  await page.getByRole('button', { name: 'In lá số' }).focus();
  await expect(page.getByRole('button', { name: 'In lá số' })).toBeFocused();
});
