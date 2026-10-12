import { chartExportDocument } from './chartExport';

it('exports the visible chart without an approved reading', () => {
  const doc = chartExportDocument({
    lunarInfo: { lunarYear: 1990 },
    tuviInfo: { menh: 1, than: 2, boxes: { 1: { cungName: 'MỆNH' } } },
    prose: 'không được đưa vào'
  });
  assertNoReading(doc);
});

function assertNoReading(doc) {
  expect(doc.approvedInterpretation).toBe(false);
  expect(doc.prose).toBeNull();
  expect(doc.boxes[1].cungName).toBe('MỆNH');
  expect(JSON.stringify(doc)).not.toContain('không được đưa vào');
}

it('omits boxes when the chart is missing', () => {
  expect(chartExportDocument(null).boxes).toBeNull();
});
