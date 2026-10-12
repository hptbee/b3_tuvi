import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const chartUrl = '/la-so?day=15&month=6&year=1990&hour=8&gender=1';

test('invalid calendar date is explained and the corrected form succeeds', async ({ page }) => {
  await page.goto('/la-so?day=31&month=2&year=1990&hour=8&gender=1');
  await expect(page.getByRole('alert')).toContainText('Ngày dương lịch không tồn tại');
  await expect(page.locator('.palace-box')).toHaveCount(0);
  await page.getByPlaceholder('Ngày dương').fill('15');
  await page.getByRole('button', { name: 'Lập Lá Số' }).click();
  await expect(page.locator('.palace-box')).toHaveCount(12);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('a failed chart request can be retried without changing birth details', async ({ page }) => {
  let recovering = false;
  const retries = [];
  await page.route('**/api/charts/generate', async route => {
    if (!recovering) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Máy chủ tạm thời chưa sẵn sàng' }) });
    } else {
      retries.push(route.request().postDataJSON());
      await route.continue();
    }
  });
  await page.goto(chartUrl);
  await expect(page.getByRole('alert')).toContainText('Máy chủ tạm thời chưa sẵn sàng');
  recovering = true;
  await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
  await expect(page.locator('.center-info')).toContainText('8 giờ 00 phút');
  await expect(page.getByRole('alert')).toHaveCount(0);
  expect(retries).toEqual([{ name: '', day: 15, month: 6, year: 1990, hour: 8, gender: 1 }]);
});

test('a combination API failure does not appear as an empty match result', async ({ page }) => {
  await page.route('**/api/combinations/match', route => route.fulfill({
    status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Lỗi đối chiếu cách cục' })
  }));
  await page.goto(chartUrl);
  await expect(page.getByRole('alert')).toContainText('Không tải được cách cục');
  await expect(page.locator('.palace-box')).toHaveCount(12);
  await expect(page.locator('.cach-cuc-loading')).toHaveCount(0);
  await expect(page.locator('.cach-cuc-empty')).not.toContainText('Không tìm thấy');
});

test('download exports the displayed chart as valid JSON', async ({ page }) => {
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/charts/generate') && response.status() === 200);
  await page.goto(chartUrl);
  const expectedChart = await (await responsePromise).json();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải JSON' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('la-so.json');
  const file = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(file.lunarInfo).toEqual(expectedChart.lunarInfo);
  expect(file.boxes).toEqual(expectedChart.tuviInfo.boxes);
  expect(file.menh).toEqual(expectedChart.tuviInfo.menh);
  expect(file.approvedInterpretation).toBe(false);
  expect(file.prose).toBeNull();
});
