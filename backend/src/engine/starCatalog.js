import { STAR_COLORS } from './constants.js';
import { cleanStarName, brightnessOf } from './starNames.js';

/**
 * Ngũ hành chỉ lấy từ seed trong migrate.js khi trường element có giá trị.
 * Sao không có trong seed, hoặc element rỗng, để null — không suy từ màu UI.
 */
const SEEDED_ELEMENT = {
    'Tử Vi': 'Thổ',
    'Thiên Cơ': 'Mộc',
    'Thái Dương': 'Hỏa',
    'Thái Âm': 'Thủy',
    'Vũ Khúc': 'Kim',
    'Thiên Đồng': 'Thủy',
    'Thiên Phủ': 'Thổ',
    'Liêm Trinh': 'Hỏa',
    'Tham Lang': 'Mộc',
    'Cự Môn': 'Thủy',
    'Thiên Tướng': 'Thủy',
    'Thiên Lương': 'Thổ',
    'Thất Sát': 'Kim',
    'Phá Quân': 'Thủy',
    'Lộc Tồn': 'Thổ'
};

const SEEDED_GROUP = {
    'Tử Vi': 'chinh_tinh',
    'Thiên Cơ': 'chinh_tinh',
    'Thái Dương': 'chinh_tinh',
    'Thái Âm': 'chinh_tinh',
    'Vũ Khúc': 'chinh_tinh',
    'Thiên Đồng': 'chinh_tinh',
    'Thiên Phủ': 'chinh_tinh',
    'Liêm Trinh': 'chinh_tinh',
    'Tham Lang': 'chinh_tinh',
    'Cự Môn': 'chinh_tinh',
    'Thiên Tướng': 'chinh_tinh',
    'Thiên Lương': 'chinh_tinh',
    'Thất Sát': 'chinh_tinh',
    'Phá Quân': 'chinh_tinh',
    'Lộc Tồn': 'phu_tinh',
    'Hóa Lộc': 'tu_hoa',
    'Hóa Quyền': 'tu_hoa',
    'Hóa Khoa': 'tu_hoa',
    'Hóa Kỵ': 'tu_hoa'
};

const ENGINE_ONLY_STARS = ['Thiên Trù'];

const BRIGHTNESS_LABEL = {
    M: 'Miếu',
    V: 'Vượng',
    Đ: 'Đắc',
    B: 'Bình',
    H: 'Hãm'
};

/** Alias chính tả đã gặp trong dữ liệu. Không gộp sao khác nhau. */
const NAME_ALIASES = {
    'Hỏa tinh': 'Hỏa Tinh',
    'Linh tinh': 'Linh Tinh'
};

function slug(name) {
    const folded = name
        .replace(/[đĐ]/g, (char) => (char === 'Đ' ? 'D' : 'd'))
        .normalize('NFD')
        .replace(/\p{M}/gu, '');
    return folded
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function categoryOf(name) {
    if (SEEDED_GROUP[name]) return SEEDED_GROUP[name];
    if (name === 'Tuần' || name === 'Triệt') return 'marker';
    if (ENGINE_ONLY_STARS.includes(name)) return 'phu_tinh';
    if (Object.prototype.hasOwnProperty.call(STAR_COLORS, name)) return 'phu_tinh';
    return 'unknown';
}

const byId = new Map();
const byName = new Map();

function toneSuffix(name) {
    return Array.from(name)
        .map((char) => char.codePointAt(0))
        .filter((code) => code > 127)
        .map((code) => code.toString(16))
        .join('');
}

const pending = [...Object.keys(STAR_COLORS), ...ENGINE_ONLY_STARS].map((displayName) => ({
    displayName,
    baseId: slug(displayName)
}));
const baseCount = new Map();
pending.forEach((item) => baseCount.set(item.baseId, (baseCount.get(item.baseId) || 0) + 1));

for (const item of pending) {
    const id = baseCount.get(item.baseId) > 1
        ? `${item.baseId}_${toneSuffix(item.displayName)}`
        : item.baseId;
    if (byId.has(id)) {
        throw new Error(`Trùng starId "${id}" giữa "${byId.get(id).displayName}" và "${item.displayName}"`);
    }
    const element = SEEDED_ELEMENT[item.displayName] || null;
    const entry = {
        starId: id,
        displayName: item.displayName,
        category: categoryOf(item.displayName),
        element,
        elementStatus: element ? 'known' : 'unknown'
    };
    byId.set(id, entry);
    byName.set(item.displayName, entry);
}

/**
 * @param {string} rawName
 * @returns {{
 *   status: 'known' | 'unknown' | 'ambiguous',
 *   starId: string | null,
 *   displayName: string,
 *   canonicalName: string | null,
 *   category: string,
 *   element: string | null,
 *   elementStatus: 'known' | 'unknown',
 *   brightness: string | null,
 *   brightnessStatus: 'known' | 'none' | 'unparsed',
 *   brightnessLabel: string | null
 * }}
 */
export function resolveStar(rawName) {
    const raw = typeof rawName === 'string' ? rawName : (rawName?.name || '');
    const cleaned = cleanStarName(raw);
    const aliased = NAME_ALIASES[cleaned] || cleaned;
    const brightness = brightnessOf(raw);
    const hasParen = /\([^)]*\)\s*$/.test(raw);
    let brightnessStatus = 'none';
    if (brightness) brightnessStatus = 'known';
    else if (hasParen) brightnessStatus = 'unparsed';

    const entry = byName.get(aliased);
    if (!entry) {
        return {
            status: 'unknown',
            starId: null,
            displayName: raw,
            canonicalName: null,
            category: 'unknown',
            element: null,
            elementStatus: 'unknown',
            brightness: brightness || null,
            brightnessStatus,
            brightnessLabel: brightness ? (BRIGHTNESS_LABEL[brightness] || null) : null
        };
    }
    return {
        status: 'known',
        starId: entry.starId,
        displayName: raw,
        canonicalName: entry.displayName,
        category: entry.category,
        element: entry.element,
        elementStatus: entry.elementStatus,
        brightness: brightness || null,
        brightnessStatus,
        brightnessLabel: brightness ? (BRIGHTNESS_LABEL[brightness] || null) : null
    };
}

export function getStarById(starId) {
    return byId.get(starId) || null;
}

export function listCatalogStars() {
    return Array.from(byId.values());
}

export { BRIGHTNESS_LABEL };
