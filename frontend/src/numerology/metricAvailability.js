const UNAVAILABLE = {
  missing_name: 'Thêm họ tên để tính chỉ số này.',
  no_vowels: 'Tên chuẩn hóa không có nguyên âm A, E, I, O, U.',
  no_consonants: 'Tên chuẩn hóa không có phụ âm.'
};

export function unavailableMetricMessage(metric) {
  return Object.hasOwn(UNAVAILABLE, metric.reason) ? UNAVAILABLE[metric.reason] : 'Chưa đủ thông tin để tính.';
}
