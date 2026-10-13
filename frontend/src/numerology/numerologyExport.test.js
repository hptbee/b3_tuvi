import { numerologyExportDocument, numerologyExportFilename, parseNumerologyImport } from './numerologyExport';

const birthDate = { year: 1990, month: 6, day: 15 };
const result = {
  schemaVersion: '1.2.0',
  profile: { id: 'pythagorean-vn-v1', version: '1.2.0' },
  contentVersion: '1.1.0',
  referenceDate: '2026-10-13',
  metrics: { lifePath: { value: 4 } },
  birthGrid: { counts: {} },
  cycles: { targetDate: '2026-10-13' },
  pinnacles: { periods: [{ pinnacle: { value: 3 } }] },
  nameAnalysis: { normalized: 'AN' }
};

it('exports the submitted date without the raw name unless opted in', () => {
  const hidden = numerologyExportDocument(result, { birthDate, fullName: 'Nguyễn Văn An' });
  expect(hidden.fullName).toBeNull();
  expect(hidden.nameAnalysis).toBeUndefined();
  expect(hidden.metrics.lifePath.value).toBe(4);
  expect(hidden.profile).toEqual({ id: 'pythagorean-vn-v1', version: '1.2.0' });
  expect(numerologyExportFilename(birthDate)).toBe('than-so-hoc-1990-06-15.json');
  const shared = numerologyExportDocument(result, { birthDate, fullName: 'Nguyễn Văn An' }, { includeName: true });
  expect(shared.fullName).toBe('Nguyễn Văn An');
  expect(shared.nameAnalysis.normalized).toBe('AN');
});

it('reimports only inputs and ignores tampered calculated values', () => {
  const file = numerologyExportDocument(result, { birthDate, fullName: 'An', targetDate: '2026-10-13' }, { includeName: true });
  file.metrics.lifePath.value = 33;
  file.pinnacles.periods[0].pinnacle.value = 11;
  file.extra = '<script>alert(1)</script>';
  const parsed = parseNumerologyImport(JSON.stringify(file));
  expect(parsed).toEqual({
    ok: true,
    input: { birthDate, fullName: 'An', targetDate: '2026-10-13' }
  });
  expect(JSON.stringify(parsed.input)).not.toContain('33');
  expect(JSON.stringify(parsed.input)).not.toContain('script');
});

it('refuses to export a result outside the published profile', () => {
  expect(() => numerologyExportDocument({ ...result, schemaVersion: '1.0.0' }, { birthDate })).toThrow(/quy ước/);
  expect(() => numerologyExportDocument({ ...result, profile: { id: 'other', version: '1.2.0' } }, { birthDate })).toThrow(/quy ước/);
  expect(() => numerologyExportDocument(result, { birthDate: { year: '1990', month: 6, day: 15 } })).toThrow(/ngày sinh/);
  expect(() => numerologyExportDocument(result, null)).toThrow(/ngày sinh/);
});

it('keeps an omitted target date from the calculated cycles and ignores a blank name', () => {
  const doc = numerologyExportDocument({ ...result, contentVersion: null }, { birthDate, fullName: '   ' }, { includeName: true });
  expect(doc.fullName).toBeNull();
  expect(doc.nameAnalysis).toBeUndefined();
  expect(doc.targetDate).toBe('2026-10-13');
  expect(doc.contentVersion).toBeNull();
  const chosen = numerologyExportDocument(result, { birthDate, targetDate: '2027-01-01' });
  expect(chosen.targetDate).toBe('2027-01-01');
});

it('rejects arrays, missing dates and unsafe target dates', () => {
  const file = numerologyExportDocument(result, { birthDate });
  expect(parseNumerologyImport('').message).toMatch(/256 KB/);
  expect(parseNumerologyImport('[]').ok).toBe(false);
  expect(parseNumerologyImport('null').ok).toBe(false);
  expect(parseNumerologyImport(JSON.stringify({ ...file, birthDate: [1990, 6, 15] })).message).toMatch(/ngày sinh/);
  expect(parseNumerologyImport(JSON.stringify({ ...file, birthDate: { year: 1990, month: 6, day: 15.5 } })).ok).toBe(false);
  expect(parseNumerologyImport(JSON.stringify({ ...file, targetDate: '13/10/2026' })).message).toMatch(/Ngày xem/);
  expect(parseNumerologyImport(JSON.stringify({ ...file, fullName: '   ' })).input).toEqual({ birthDate, targetDate: '2026-10-13' });
  expect(parseNumerologyImport(JSON.stringify({ ...file, fullName: 12 })).ok).toBe(false);
  expect(parseNumerologyImport(JSON.stringify({ ...file, fullName: 'A'.repeat(101) })).ok).toBe(false);
  expect(parseNumerologyImport(JSON.stringify({ ...file, schemaVersion: '1.1.0' })).ok).toBe(false);
});

it('rejects unsupported versions, markup names and oversized files', () => {
  const file = numerologyExportDocument(result, { birthDate });
  expect(parseNumerologyImport(JSON.stringify({ ...file, exportVersion: '0.9.0' })).ok).toBe(false);
  expect(parseNumerologyImport(JSON.stringify({ ...file, profile: { id: 'pythagorean-vn-v1', version: '1.1.0' } })).message).toMatch(/1\.2\.0/);
  expect(parseNumerologyImport(JSON.stringify({ ...file, fullName: '<b>An</b>' })).ok).toBe(false);
  expect(parseNumerologyImport('{').ok).toBe(false);
  expect(parseNumerologyImport('x'.repeat(256 * 1024 + 1)).message).toMatch(/256 KB/);
});
