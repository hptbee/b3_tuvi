import { DIA_CHI, CUC_SO_MAP } from './constants.js';
import { resolveStar } from './starCatalog.js';
import tuHoaMap from '../data/tuHoaMap.json' with { type: 'json' };

const HOA_ORDER = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];

const FUNCTION_BY_LABEL = {
    'MỆNH': 'menh',
    'PHỤ MẪU': 'phu_mau',
    'PHÚC ĐỨC': 'phuc_duc',
    'ĐIỀN TRẠCH': 'dien_trach',
    'QUAN LỘC': 'quan_loc',
    'NÔ BỘC': 'no_boc',
    'THIÊN DI': 'thien_di',
    'TẬT ÁCH': 'tat_ach',
    'TÀI BẠCH': 'tai_bach',
    'TỬ TỨC': 'tu_tuc',
    'PHU THÊ': 'phu_the',
    'HUYNH ĐỆ': 'huynh_de'
};

const CUC_NUMBER_BY_NAME = Object.fromEntries(
    Object.entries(CUC_SO_MAP).map(([number, name]) => [name, Number(number)])
);

const LISTS = [
    ['major', 'majorStars'],
    ['good', 'goodStars'],
    ['bad', 'badStars'],
    ['minor', 'minorStars']
];

function parseFunction(cungName) {
    const parts = String(cungName || '').split('/').map((part) => part.trim()).filter(Boolean);
    const isThan = parts.includes('THÂN');
    const functionLabel = parts.find((part) => part !== 'THÂN') || null;
    const functionId = functionLabel ? (FUNCTION_BY_LABEL[functionLabel] || null) : null;
    return {
        functionId,
        functionLabel,
        functionStatus: functionId ? 'known' : 'unknown',
        isThan
    };
}

function starInstances(box, palaceId) {
    const instances = [];
    LISTS.forEach(([list, key]) => {
        (box[key] || []).forEach((raw, ordinal) => {
            const resolved = resolveStar(raw);
            instances.push({
                instanceId: `${palaceId}:${resolved.starId || 'unknown'}:${list}:${ordinal}`,
                starId: resolved.starId,
                canonicalName: resolved.canonicalName,
                displayName: resolved.displayName,
                status: resolved.status,
                category: resolved.category,
                list,
                palaceId,
                brightness: resolved.brightness,
                brightnessStatus: resolved.brightnessStatus,
                brightnessLabel: resolved.brightnessLabel,
                element: resolved.element,
                elementStatus: resolved.elementStatus,
                association: null
            });
        });
    });
    return instances;
}

function attachTuHoa(instances, canIndex) {
    if (canIndex == null || canIndex === '') return;
    const sources = tuHoaMap[String(canIndex)];
    if (!sources) return;
    HOA_ORDER.forEach((hoaName, index) => {
        const sourceName = sources[index];
        const hoa = instances.find((star) => star.canonicalName === hoaName);
        const source = instances.find((star) => star.canonicalName === sourceName);
        if (!hoa) return;
        hoa.association = {
            type: 'tu_hoa',
            sourceStarId: source?.starId || null,
            sourceName,
            status: source ? 'same_palace' : 'unresolved'
        };
    });
}

function indexStars(palaces) {
    const byStarId = {};
    const unknownStars = [];
    palaces.forEach((palace) => {
        palace.stars.forEach((star) => {
            if (!star.starId) {
                unknownStars.push({
                    displayName: star.displayName,
                    palaceId: palace.id,
                    brightness: star.brightness
                });
                return;
            }
            if (!byStarId[star.starId]) byStarId[star.starId] = [];
            byStarId[star.starId].push({
                instanceId: star.instanceId,
                palaceId: star.palaceId,
                brightness: star.brightness,
                list: star.list
            });
        });
    });
    return { byStarId, unknownStars };
}

/**
 * Biến đầu ra calculateTuVi thành model domain. Không sửa object đầu vào.
 * palaceId là chỉ số địa chi 1–12, không phải mã cung chức.
 *
 * @param {{ tuviInfo: object, lunarInfo?: object, input?: object }} source
 */
export function normalizeChart(source = {}) {
    const tuviInfo = source.tuviInfo;
    if (!tuviInfo?.boxes) {
        return { ok: false, error: 'missing_chart' };
    }
    const lunar = source.lunarInfo || {};
    const input = source.input || {};
    const canIndex = lunar.canIndex ?? lunar.canYearIndex ?? null;
    const chiIndex = lunar.chiIndex ?? lunar.chiYearIndex ?? null;

    const palaces = [];
    for (let branchId = 1; branchId <= 12; branchId += 1) {
        const box = tuviInfo.boxes[branchId] || tuviInfo.boxes[String(branchId)];
        if (!box) return { ok: false, error: 'missing_palace', branchId };
        const palaceId = String(branchId);
        const role = parseFunction(box.cungName);
        const stars = starInstances(box, palaceId);
        attachTuHoa(stars, canIndex);
        palaces.push({
            id: palaceId,
            branchId,
            branchName: box.chiName || DIA_CHI[branchId],
            ...role,
            isMenh: branchId === tuviInfo.menh,
            daiHan: box.daiHan ?? null,
            trangSinh: box.trangSinh ?? null,
            isTuan: Boolean(box.isTuan),
            isTriet: Boolean(box.isTriet),
            fullCanChi: box.fullCanChi || null,
            thang: box.thang ?? null,
            stars
        });
    }

    const thanPalace = palaces.find((palace) => palace.id === String(tuviInfo.than));
    if (thanPalace) thanPalace.isThan = true;

    const { byStarId, unknownStars } = indexStars(palaces);
    const cucName = tuviInfo.cucInfo || null;

    return {
        ok: true,
        version: 1,
        schoolId: tuviInfo.schoolId || null,
        input: {
            name: input.name ?? null,
            day: input.day ?? null,
            month: input.month ?? null,
            year: input.year ?? null,
            hour: input.hour ?? null,
            gender: input.gender ?? null
        },
        lunar: {
            lunarDay: lunar.lunarDay ?? null,
            lunarMonth: lunar.lunarMonth ?? null,
            lunarYear: lunar.lunarYear ?? null,
            canIndex,
            chiIndex,
            canName: lunar.canName || null,
            chiName: lunar.chiName || null,
            isLeapMonth: lunar.isLeapMonth ?? tuviInfo.isLeapMonth ?? null
        },
        menhPalaceId: tuviInfo.menh != null ? String(tuviInfo.menh) : null,
        thanPalaceId: tuviInfo.than != null ? String(tuviInfo.than) : null,
        cuc: {
            name: cucName,
            number: cucName ? (CUC_NUMBER_BY_NAME[cucName] ?? null) : null
        },
        banMenh: tuviInfo.nguHanhBanMenh || null,
        amDuong: tuviInfo.textAmDuong || null,
        thuanLy: tuviInfo.thuanLy || null,
        cucKhacMenh: tuviInfo.cucKhacMenh || null,
        chuMenh: tuviInfo.chuMenh || null,
        chuThan: tuviInfo.chuThan || null,
        anSaoMonth: tuviInfo.anSaoMonth ?? null,
        palaces,
        byStarId,
        unknownStars
    };
}

/** Dựng lại boxes kiểu engine để matcher cũ đọc. Không dùng cho hiển thị. */
export function toLegacyBoxes(chart) {
    const boxes = {};
    chart.palaces.forEach((palace) => {
        const cungName = palace.isThan && palace.functionLabel && palace.functionLabel !== 'MỆNH'
            ? `${palace.functionLabel} / THÂN`
            : (palace.isThan && palace.functionLabel === 'MỆNH'
                ? 'MỆNH / THÂN'
                : (palace.functionLabel || ''));
        const box = {
            cungName,
            chiName: palace.branchName,
            fullCanChi: palace.fullCanChi || '',
            majorStars: [],
            goodStars: [],
            badStars: [],
            minorStars: [],
            daiHan: palace.daiHan ?? '',
            trangSinh: palace.trangSinh ?? '',
            isTuan: palace.isTuan,
            isTriet: palace.isTriet,
            thang: palace.thang
        };
        palace.stars.forEach((star) => {
            const key = `${star.list}Stars`;
            if (box[key]) box[key].push(star.displayName);
        });
        boxes[palace.branchId] = box;
    });
    return boxes;
}
