import { test, expect } from '@playwright/test';

test('maps accepted annual stars on the calculated chart and resets the year', async ({ page }) => {
  await page.goto('/la-so?day=15&month=6&year=1990&hour=8&gender=1');
  const placements = page.getByRole('region', { name: 'Vị trí sao theo chi năm xem' });
  await expect(placements).toContainText('Chọn chi năm xem');
  const year = page.getByRole('combobox', { name: 'Chi năm xem', exact: true });
  const responsePromise = page.waitForResponse(response => response.url().endsWith('/api/interpretations/analyze')
    && response.request().postDataJSON().viewYearBranch === 'Tí');
  await year.selectOption('Tí');
  const body = await (await responsePromise).json();
  const mapped = body.time.capabilities;
  expect(mapped.thien_duc.branch).toBe('Dậu');
  expect(mapped.nguyet_duc.branch).toBe('Tí');
  for (const id of ['thien_duc', 'nguyet_duc']) {
    expect(mapped[id].palaceMapping).toBe('mapped');
    expect(mapped[id].interpretation).toBeNull();
    expect(mapped[id].publicFortune).toBe(false);
  }
  await expect(placements).toContainText(/Thiên Đức: chi Dậu — cung/);
  await expect(placements).toContainText(/Nguyệt Đức: chi Tí — cung/);
  await expect(placements).toContainText('chưa có lời luận vận hạn được duyệt');
  await year.selectOption('Ngọ');
  await expect(placements).toContainText(/Thiên Đức: chi Mão — cung/);
  await expect(placements).toContainText(/Nguyệt Đức: chi Ngọ — cung/);
  await expect(placements).not.toContainText('Thiên Đức: chi Dậu');
  await year.selectOption('');
  await expect(placements).toContainText('Chọn chi năm xem');
  await expect(placements).not.toContainText('Nguyệt Đức: chi Ngọ');
});
