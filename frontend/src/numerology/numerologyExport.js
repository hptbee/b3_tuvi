export const NUMEROLOGY_EXPORT_VERSION = '1.0.0';
const PROFILE_ID = 'pythagorean-vn-v1';
const PROFILE_VERSION = '1.2.0';
const SCHEMA_VERSION = '1.2.0';
const MAX_IMPORT_CHARS = 256 * 1024;

const dateParts = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const year = value.year;
  const month = value.month;
  const day = value.day;
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  return { year, month, day };
};

export function numerologyExportFilename(birthDate) {
  const pad = number => String(number).padStart(2, '0');
  return `than-so-hoc-${birthDate.year}-${pad(birthDate.month)}-${pad(birthDate.day)}.json`;
}

export function numerologyExportDocument(result, input, { includeName = false } = {}) {
  if (result?.schemaVersion !== SCHEMA_VERSION || result.profile?.id !== PROFILE_ID || result.profile?.version !== PROFILE_VERSION) {
    throw new TypeError('Kết quả không thuộc quy ước có thể xuất.');
  }
  const birthDate = dateParts(input?.birthDate);
  if (!birthDate) throw new TypeError('Thiếu ngày sinh của lần tính đã gửi.');
  const name = typeof input.fullName === 'string' ? input.fullName.trim() : '';
  const shareName = Boolean(includeName && name);
  return {
    exportVersion: NUMEROLOGY_EXPORT_VERSION,
    usage: 'user_requested_numerology_export',
    schemaVersion: SCHEMA_VERSION,
    profile: { id: PROFILE_ID, version: PROFILE_VERSION },
    contentVersion: result.contentVersion ?? null,
    referenceDate: result.referenceDate,
    birthDate,
    targetDate: input.targetDate || result.cycles?.targetDate || null,
    fullName: shareName ? name : null,
    metrics: result.metrics,
    birthGrid: result.birthGrid,
    cycles: result.cycles,
    pinnacles: result.pinnacles,
    ...(shareName && result.nameAnalysis ? { nameAnalysis: result.nameAnalysis } : {}),
    disclaimer: 'Quy ước thử nghiệm pythagorean-vn-v1 1.2.0. Không phải đánh giá khoa học. Khi nhập lại, ứng dụng chỉ lấy ngày sinh, ngày xem và họ tên nếu có, rồi tính lại trên máy chủ.'
  };
}

export function parseNumerologyImport(text) {
  if (typeof text !== 'string' || text.length === 0 || text.length > MAX_IMPORT_CHARS) {
    return { ok: false, message: 'Tệp trống hoặc lớn hơn 256 KB.' };
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, message: 'Tệp không phải JSON hợp lệ.' };
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, message: 'Tệp JSON không phải một bản xuất Thần số học.' };
  }
  if (data.exportVersion !== NUMEROLOGY_EXPORT_VERSION) {
    return { ok: false, message: 'Phiên bản tệp chưa được hỗ trợ. Hãy xuất lại từ bản thử nghiệm hiện tại.' };
  }
  if (data.profile?.id !== PROFILE_ID || data.profile?.version !== PROFILE_VERSION || data.schemaVersion !== SCHEMA_VERSION) {
    return { ok: false, message: 'Tệp dùng quy ước hoặc schema khác pythagorean-vn-v1 1.2.0. Bản này không nhập các số có sẵn trong tệp.' };
  }
  const birthDate = dateParts(data.birthDate);
  if (!birthDate) return { ok: false, message: 'Tệp thiếu ngày sinh hợp lệ.' };
  const input = { birthDate };
  if (data.fullName != null && data.fullName !== '') {
    if (typeof data.fullName !== 'string' || data.fullName.trim().length > 100 || /[<>]/.test(data.fullName)) {
      return { ok: false, message: 'Họ tên trong tệp không được hỗ trợ.' };
    }
    if (data.fullName.trim()) input.fullName = data.fullName.trim();
  }
  if (data.targetDate != null && data.targetDate !== '') {
    if (typeof data.targetDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.targetDate)) {
      return { ok: false, message: 'Ngày xem trong tệp không hợp lệ.' };
    }
    input.targetDate = data.targetDate;
  }
  return { ok: true, input };
}

export function downloadNumerologyJson(result, input, options) {
  const document = numerologyExportDocument(result, input, options);
  const blob = new Blob([JSON.stringify(document, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = numerologyExportFilename(document.birthDate);
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
