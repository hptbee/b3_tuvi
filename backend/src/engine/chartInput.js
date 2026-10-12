const MIN_YEAR = 1200;
const MAX_YEAR = 2199;

function readInt(value) {
    if (typeof value === 'number' && Number.isInteger(value)) return value;
    if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) return Number(value.trim());
    return null;
}

function isRealSolarDate(day, month, year) {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day;
}

/**
 * Kiểm tra payload lập lá số trước khi đổi lịch và ghi SQLite.
 * hour là giờ đồng hồ 0–23. gender: 1 nam, -1 nữ.
 */
export function validateChartInput(body) {
    const errors = [];
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return { ok: false, errors: ['Thiếu dữ liệu lập lá số'] };
    }

    const day = readInt(body.day);
    const month = readInt(body.month);
    const year = readInt(body.year);
    const hour = readInt(body.hour);
    const gender = readInt(body.gender);

    if (day === null || month === null || year === null || !isRealSolarDate(day, month, year)) {
        errors.push('Ngày dương lịch không tồn tại');
    }
    if (year !== null && (year < MIN_YEAR || year > MAX_YEAR)) {
        errors.push(`Năm phải từ ${MIN_YEAR} đến ${MAX_YEAR}`);
    }
    if (hour === null || hour < 0 || hour > 23) {
        errors.push('Giờ phải là số nguyên từ 0 đến 23');
    }
    if (gender !== 1 && gender !== -1) {
        errors.push('Giới tính phải là 1 (nam) hoặc -1 (nữ)');
    }

    let name = '';
    if (body.name !== undefined && body.name !== null && body.name !== '') {
        if (typeof body.name !== 'string') {
            errors.push('Họ tên phải là chuỗi');
        } else if (body.name.trim().length > 100) {
            errors.push('Họ tên tối đa 100 ký tự');
        } else {
            name = body.name.trim();
        }
    }

    if (errors.length > 0) return { ok: false, errors };
    return { ok: true, value: { name, day, month, year, hour, gender } };
}
