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

test('header entry opens an empty chart form and numerology has its own calculator', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('banner').getByRole('link', { name: 'Lập lá số', exact: true }).click();
  await expect(page).toHaveURL(/\/la-so$/);
  await expect(page.getByRole('heading', { name: 'Bắt đầu với thông tin sinh' })).toBeVisible();
  await expect(page.locator('.palace-box')).toHaveCount(0);
  await page.getByRole('navigation', { name: 'Chọn lĩnh vực' }).getByRole('link', { name: /Thần Số Học/ }).click();
  await expect(page.getByRole('heading', { name: 'Tính chỉ số của bạn', exact: true })).toBeVisible();
  await expect(page.getByText('Bản thử nghiệm', { exact: true })).toBeVisible();
  await page.getByRole('navigation', { name: 'Chọn lĩnh vực' }).getByRole('link', { name: 'Tử Vi', exact: true }).click();
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

for (const width of [320, 390, 1440]) {
  test(`resource pages give usable guidance and fit ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, title] of [['/kien-thuc', 'Hiểu cách đọc kết quả'], ['/tai-lieu', 'Nguồn để đối chiếu'], ['/luan-giai', 'Hiểu trạng thái luận giải'], ['/lien-he', 'Góp ý cho dự án']]) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (route === '/kien-thuc' || route === '/tai-lieu') {
        await page.screenshot({ path: testInfo.outputPath(`${route.slice(1)}-${width}.png`), fullPage: true });
      }
    }
    await expect(page.getByRole('link', { name: 'Mở trang góp ý trên GitHub' })).toHaveAttribute('href', 'https://github.com/hptbee/b3_tuvi/issues');
    await expect(page.getByText(/Trang góp ý công khai/)).toBeVisible();
    await page.goto('/kien-thuc');
    const sourceLink = page.getByRole('link', { name: /Xem nguồn để đối chiếu/ });
    await sourceLink.focus();
    await expect(sourceLink).toBeFocused();
    expect(await sourceLink.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/tai-lieu');
    await expect(page.getByRole('link', { name: 'Can Chi và giờ theo Địa Chi' })).toHaveAttribute('href', 'https://www.hko.gov.hk/en/gts/time/stemsandbranches.htm');
    await page.goto('/luan-giai');
    await page.getByRole('link', { name: 'Mở báo cáo Thần số học' }).click();
    await expect(page).toHaveURL('/than-so-hoc');
    await expect(page.getByRole('heading', { name: 'Tính chỉ số của bạn', exact: true })).toBeVisible();
  });
}
