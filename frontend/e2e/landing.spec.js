import { test, expect } from '@playwright/test';

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`landing CTA opens the chart workflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hiểu mình hơn.');
    await page.getByRole('link', { name: 'Khám phá lá số của bạn' }).click();
    await expect(page).toHaveURL(/#lap-la-so$/);
    await expect(page.getByRole('heading', { name: 'Lập lá số của bạn' })).toBeInViewport();
    await page.getByPlaceholder('Ngày dương').fill('15');
    await page.getByPlaceholder('Tháng dương').fill('6');
    await page.getByPlaceholder('Năm dương').fill('1990');
    await page.getByRole('combobox', { name: 'Giờ sinh', exact: true }).selectOption('8');
    await page.getByRole('button', { name: 'Lập Lá Số' }).click();
    await expect(page).toHaveURL(/\/la-so\?.*hour=8/);
    await expect(page.locator('.center-info')).toContainText('8 giờ 00 phút');
  });
}

test('header entry opens an empty chart form and numerology remains a preview', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'Lập lá số', exact: true }).click();
  await expect(page).toHaveURL(/\/la-so$/);
  await expect(page.getByRole('heading', { name: 'Bắt đầu với thông tin sinh' })).toBeVisible();
  await expect(page.locator('.palace-box')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Chọn lĩnh vực' }).getByRole('link', { name: /Thần Số Học/ }).click();
  await expect(page.getByText('Đang phát triển', { exact: true })).toBeVisible();
  await expect(page.getByText('Các nội dung trên là tính năng dự kiến. Công cụ tính chưa khả dụng.')).toBeVisible();
  await page.getByRole('link', { name: 'Khám phá Tử Vi trước' }).click();
  await expect(page).toHaveURL('/');
});

test('FAQ opens and closes with keyboard', async ({ page }) => {
  await page.goto('/');
  const question = page.locator('summary').filter({ hasText: 'Tôi nên nhập ngày âm hay ngày dương?' });
  const answer = page.getByText('Hãy nhập ngày sinh dương lịch. Công cụ sẽ chuyển sang âm lịch để lập lá số.');
  await expect(answer).toBeHidden();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(answer).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(answer).toBeHidden();
});
