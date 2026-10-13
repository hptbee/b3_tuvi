import { PROFILE } from './profile.js';

export class NumerologyInputError extends Error {
    constructor(code, message, path = '') {
        super(message);
        this.name = 'NumerologyInputError';
        this.code = code;
        this.fields = path ? [{ path, code, message }] : [];
    }
}
const invalid = (code, message, path) => { throw new NumerologyInputError(code, message, path); };
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
// Explicit Latin/Vietnamese accents only; arbitrary Unicode marks can change or hide a name.
const LATIN_ACCENTS = '\u0300\u0301\u0302\u0303\u0304\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030F\u0311\u031B\u0323\u0324\u0325\u0326\u0327\u0328\u032D\u032E\u0330\u0331';
const supportedName = new RegExp(`^(?:[A-Za-zĐđ][${LATIN_ACCENTS}]*|[ '’-])+$`, 'u');
const latinAccents = new RegExp(`[${LATIN_ACCENTS}]`, 'gu');

export function dateOnly(value) {
    if (!isObject(value) || Object.keys(value).some(key => !['year', 'month', 'day'].includes(key))) return null;
    const { year, month, day } = value;
    if (![year, month, day].every(Number.isInteger) || year < 1200 || year > 2199) return null;
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isoDateOnly(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    return dateOnly({ year, month, day });
}

export function normalizeName(value) {
    if (value === undefined) return null;
    if (typeof value !== 'string') invalid('INVALID_NAME', 'Họ tên phải là văn bản.', 'fullName');
    // Reject hidden characters before normalization and whitespace collapse.
    if (/[\p{Cc}\p{Cf}\p{Default_Ignorable_Code_Point}]/u.test(value)) invalid('UNSUPPORTED_NAME_CHARACTER', 'Họ tên chứa ký tự điều khiển hoặc ký tự ẩn không được hỗ trợ.', 'fullName');
    const original = value.normalize('NFC').trim();
    if (!original) return null;
    if ([...original].length > 100) invalid('NAME_TOO_LONG', 'Họ tên tối đa 100 ký tự.', 'fullName');
    const decomposed = original.normalize('NFD').replace(/\s+/gu, ' ');
    if (!supportedName.test(decomposed)) {
        invalid('UNSUPPORTED_NAME_CHARACTER', 'Hãy dùng chữ Latin hoặc tiếng Việt; chỉ hỗ trợ khoảng trắng, dấu gạch nối và nháy đơn.', 'fullName');
    }
    const normalized = decomposed.replace(latinAccents, '').replace(/[Đđ]/g, 'D').toUpperCase().replace(/['’\-]/g, ' ').replace(/ +/g, ' ').trim();
    const letters = [...normalized.replace(/ /g, '')].map(letter => ({
        letter, value: (letter.charCodeAt(0) - 65) % 9 + 1,
        kind: PROFILE.vowels.includes(letter) ? 'vowel' : 'consonant'
    }));
    if (!letters.length) invalid('INVALID_NAME', 'Họ tên cần có ít nhất một chữ cái.', 'fullName');
    if (letters.length > 100) invalid('NAME_TOO_LONG', 'Tên chuẩn hóa tối đa 100 chữ cái.', 'fullName');
    return { normalized, letters, policy: PROFILE.namePolicy, yPolicy: PROFILE.yPolicy };
}

export function parseInput(body, referenceDate) {
    if (!isObject(body)) invalid('INVALID_BODY', 'Dữ liệu gửi lên phải là một đối tượng JSON.');
    const allowed = ['birthDate', 'fullName', 'profileId', 'profileVersion', 'locale', 'targetDate'];
    for (const key of Object.keys(body)) {
        if (!allowed.includes(key)) {
            const computed = ['metrics', 'analysis', 'normalizedName', 'profile', 'birthGrid', 'cycles', 'pinnacles', 'nameChart', 'combinedChart'].includes(key);
            invalid(computed ? 'CLIENT_RESULT_REJECTED' : 'UNKNOWN_FIELD', 'Request chứa trường không được hỗ trợ.', key);
        }
    }
    if (body.profileId !== undefined && body.profileId !== PROFILE.id) invalid('PROFILE_NOT_FOUND', 'Phương pháp tính chưa được hỗ trợ.', 'profileId');
    if (body.profileVersion !== undefined && body.profileVersion !== PROFILE.version) invalid('PROFILE_NOT_FOUND', 'Phiên bản phương pháp chưa được hỗ trợ.', 'profileVersion');
    if (body.locale !== undefined && body.locale !== PROFILE.locale) invalid('UNSUPPORTED_LOCALE', 'Hiện chỉ hỗ trợ tiếng Việt.', 'locale');
    const iso = dateOnly(body.birthDate);
    if (!iso) invalid('INVALID_BIRTH_DATE', 'Ngày sinh dương lịch không tồn tại hoặc năm nằm ngoài 1200–2199.', 'birthDate');
    if (typeof referenceDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(referenceDate) || !dateOnly(Object.fromEntries(['year', 'month', 'day'].map((key, i) => [key, Number(referenceDate.split('-')[i])])))) {
        throw new TypeError('A valid date-only referenceDate must be injected');
    }
    if (iso > referenceDate) invalid('INVALID_BIRTH_DATE', 'Ngày sinh không được nằm trong tương lai.', 'birthDate');
    const targetDate = body.targetDate === undefined ? referenceDate : isoDateOnly(body.targetDate);
    if (!targetDate) invalid('INVALID_TARGET_DATE', 'Ngày xem phải là ngày dương lịch hợp lệ dạng YYYY-MM-DD, năm 1200–2199.', 'targetDate');
    if (targetDate < iso) invalid('INVALID_TARGET_DATE', 'Ngày xem không được trước ngày sinh.', 'targetDate');
    return { birthDate: { ...body.birthDate }, name: normalizeName(body.fullName), referenceDate, targetDate };
}
