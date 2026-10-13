/**
 * Sprint 9 V1 formula table.
 * rulesV2.json stays the researched runtime snapshot. This module is what the matcher executes.
 * expertVerified is never set by this table.
 */
export const FORMULA_VERSION = 's9-v1';

const BRIGHT = ['M', 'V', 'Đ'];
const LOC = ['Hóa Lộc', 'Lộc Tồn'];
const SAT = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Hóa Kỵ'];
const QUAN_THAN_AUX = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Long Trì', 'Phượng Các'];

function clause(stars, at, extra = {}) {
    return { stars, at, ...extra };
}

function hostAspect(target, host, other) {
    return {
        target,
        clauses: [
            clause([host], 'target', { brightness: BRIGHT }),
            clause([other], 'aspect')
        ]
    };
}

function thatSat(target) {
    return {
        target,
        branches: ['Dần', 'Thân'],
        samePalace: ['Thất Sát'],
        clauses: [clause(['Tử Vi', 'Thiên Phủ'], 'opposite')]
    };
}

function tinhMinh(target, anchor, sun, moon) {
    return {
        target,
        branches: [anchor],
        clauses: [
            clause(['Thái Dương'], 'chart', { branches: [sun] }),
            clause(['Thái Âm'], 'chart', { branches: [moon] })
        ]
    };
}

function dongLamOpposite(target, anchor) {
    return {
        target,
        branches: [anchor],
        clauses: [clause(['Thái Dương', 'Thái Âm'], 'opposite')]
    };
}

function khoaPair(target, hostStars, nhiStars) {
    return {
        target,
        clauses: [
            clause(hostStars, 'target', hostStars.length > 1 ? { any: true } : {}),
            clause(nhiStars, 'nhi_hop', nhiStars.length > 1 ? { any: true } : {})
        ]
    };
}

function row(spec) {
    return {
        formulaVersion: FORMULA_VERSION,
        expertVerified: false,
        publicEligible: spec.publicEligible !== false && spec.namedPublicEligible !== false && spec.engineeringState !== 'INTERNAL_ONLY' && spec.engineeringState !== 'DISABLED',
        defaultProfile: spec.defaultProfile ?? null,
        grade: spec.grade || null,
        modifiers: spec.modifiers || [],
        limitation: spec.limitation || null,
        variants: spec.variants || [],
        ...spec
    };
}

function one(profile, rule, sourceRef, extra = {}) {
    return { profile, rule, sourceRef, publicEligible: extra.publicEligible !== false, ...extra };
}

export const FORMULAS = [
    row({
        catalogIndex: 1,
        id: 'tu_phu_dong_cung',
        combination: 'Tử Phủ Đồng Cung',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'tan-bien 19.2 Tử Phủ đồng cung; base predicate retained',
        grade: { complete: false, note: 'Additional auspicious stars and birth-year distinctions stay grade notes.' },
        variants: [one('tan-bien', {
            id: 'tu_phu_dong_cung',
            target: 'menh',
            branches: ['Dần', 'Thân'],
            samePalace: ['Tử Vi', 'Thiên Phủ']
        }, 'tan-bien base predicate')]
    }),
    row({
        catalogIndex: 2,
        id: 'tu_phu_vu_tuong',
        combination: 'Tử Phủ Vũ Tướng',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'widened',
        defaultProfile: 'modern-structural',
        sourceRef: 'modern structural variant; Vietnamese catalog name is not certified as a classical formula',
        limitation: 'Not a verified classical formula and not a single-palace requirement.',
        variants: [one('modern-structural', {
            id: 'tu_phu_vu_tuong',
            target: 'menh',
            clauses: [clause(['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'], 'tam_phuong_tu_chinh')]
        }, 'modern structural: four stars in Mệnh tam phương tứ chính')]
    }),
    row({
        catalogIndex: 3,
        id: 'co_nguyet_dong_luong',
        combination: 'Cơ Nguyệt Đồng Lương',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'narrowed',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/229',
        grade: { complete: false, note: 'Grade is separate from the four-star tam hợp predicate.' },
        variants: [one('modern-108s', {
            id: 'co_nguyet_dong_luong',
            target: 'menh',
            clauses: [clause(['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'], 'tam_hop')]
        }, 'https://www.108s.tw/article/info/229')]
    }),
    row({
        catalogIndex: 4,
        id: 'sat_pha_tham',
        combination: 'Sát Phá Tham',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'modern-108s',
        sourceRef: 'Mệnh–Tài–Quan tam hợp structural recognition',
        grade: { complete: false, note: 'Structural recognition is not a quý cách.' },
        variants: [one('modern-108s', {
            id: 'sat_pha_tham',
            target: 'menh',
            clauses: [clause(['Thất Sát', 'Phá Quân', 'Tham Lang'], 'tam_hop')]
        }, 'tam hợp Mệnh Tài Quan')]
    }),
    row({
        catalogIndex: 5,
        id: 'nhat_nguyet_tinh_minh',
        combination: 'Nhật Nguyệt Tịnh Minh',
        engineeringState: 'VARIANT',
        identityStatus: 'EDITORIAL_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien-editorial',
        sourceRef: 'Tân Biên 19.2.15 text layer Tý/Hợi; rendered page Tỵ/Hợi; editorial Tỵ/Dậu. Enabled variant is the editorial pair only.',
        limitation: 'The enabled wording is an editorial emendation. It is not authenticated from a 1956 printing.',
        variants: [one('tan-bien-editorial', {
            id: 'nhat_nguyet_tinh_minh_editorial',
            anyOf: [
                tinhMinh('menh', 'Sửu', 'Tị', 'Dậu'),
                tinhMinh('quan_loc', 'Sửu', 'Tị', 'Dậu'),
                tinhMinh('menh', 'Mùi', 'Mão', 'Hợi'),
                tinhMinh('quan_loc', 'Mùi', 'Mão', 'Hợi')
            ]
        }, 'editorial: Mệnh/Quan Sửu + Nhật Tỵ + Nguyệt Dậu, or Mệnh/Quan Mùi + Nhật Mão + Nguyệt Hợi')]
    }),
    row({
        catalogIndex: 6,
        id: 'minh_chau_xuat_hai',
        combination: 'Minh Châu Xuất Hải',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.2.12 points at 19.2.13 Nguyệt Sinh Thương Hải',
        limitation: 'The older B3 Mệnh-VCD Mùi / Nhật Mão / Nguyệt Hợi formula remains profile b3-legacy.',
        variants: [
            one('tan-bien', {
                id: 'minh_chau_nguyet_sinh_thuong_hai',
                anyOf: [
                    { target: 'menh', branches: ['Tí'], samePalace: ['Thái Âm'] },
                    { target: 'quan_loc', branches: ['Tí'], samePalace: ['Thái Âm'] }
                ]
            }, 'Tân Biên 19.2.13 Nguyệt Sinh Thương Hải'),
            one('b3-legacy', {
                id: 'minh_chau_b3_legacy',
                target: 'menh',
                branches: ['Mùi'],
                noMajor: true,
                clauses: [
                    clause(['Thái Âm'], 'chart', { branches: ['Hợi'] }),
                    clause(['Thái Dương'], 'chart', { branches: ['Mão'] })
                ]
            }, 'b3-legacy Mệnh VCD at Mùi, Nhật Mão, Nguyệt Hợi')
        ]
    }),
    row({
        catalogIndex: 7,
        id: 'cu_nhat_dong_cung',
        combination: 'Cự Nhật Đồng Cung',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'widened',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên: Cung Mệnh có Cự, Nhật tọa thủ đồng cung',
        limitation: 'Dần/Thân is a current placer invariant, not an explicit branch requirement in the stored passage.',
        variants: [one('tan-bien', {
            id: 'cu_nhat_dong_cung',
            target: 'menh',
            samePalace: ['Cự Môn', 'Thái Dương']
        }, 'Tân Biên đồng cung Mệnh')]
    }),
    row({
        catalogIndex: 8,
        id: 'duong_luong_xuong_loc',
        combination: 'Dương Lương Xương Lộc',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'kept',
        defaultProfile: 'modern-108s',
        sourceRef: 'modern: Mệnh Mão, Nhật + Lương + Xương, Hóa Lộc or Lộc Tồn',
        grade: { complete: false, note: 'Grade stays separate. Lộc is an OR, not an AND.' },
        variants: [one('modern-108s', {
            id: 'duong_luong_xuong_loc',
            target: 'menh',
            branches: ['Mão'],
            clauses: [
                clause(['Thái Dương', 'Thiên Lương', 'Văn Xương'], 'target'),
                clause(LOC, 'target', { any: true })
            ]
        }, 'modern OR of Hóa Lộc and Lộc Tồn')]
    }),
    row({
        catalogIndex: 9,
        id: 'nguyet_lang_thien_mon',
        combination: 'Nguyệt Lãng Thiên Môn',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'Thái Âm tại Mệnh Hợi',
        variants: [one('tan-bien', {
            id: 'nguyet_lang_thien_mon',
            target: 'menh',
            branches: ['Hợi'],
            samePalace: ['Thái Âm']
        }, 'Mệnh Hợi Thái Âm')]
    }),
    row({
        catalogIndex: 10,
        id: 'nhat_chieu_loi_mon',
        combination: 'Nhật Chiếu Lôi Môn',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'Thái Dương tại Mệnh Mão',
        variants: [one('tan-bien', {
            id: 'nhat_chieu_loi_mon',
            target: 'menh',
            branches: ['Mão'],
            samePalace: ['Thái Dương']
        }, 'Mệnh Mão Thái Dương')]
    }),
    row({
        catalogIndex: 11,
        id: 'that_sat_trieu_dau',
        combination: 'Thất Sát Triều Đẩu',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.2.8; modern-108s https://www.108s.tw/article/info/207',
        grade: { complete: false, note: 'Auspicious auxiliaries are quý-grade modifiers.' },
        variants: [
            one('tan-bien', {
                id: 'that_sat_trieu_dau_tan_bien',
                anyOf: [thatSat('menh'), thatSat('quan_loc')]
            }, 'Tân Biên 19.2.8 Mệnh or Quan'),
            one('modern-108s', {
                id: 'that_sat_trieu_dau_108s',
                ...thatSat('menh')
            }, 'https://www.108s.tw/article/info/207 target Mệnh')
        ]
    }),
    row({
        catalogIndex: 12,
        id: 'tham_vu_dong_hanh',
        combination: 'Tham Vũ Đồng Hành',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên Mệnh Sửu/Mùi đồng cung; 108s Thìn/Tuất opposite is a separate profile',
        variants: [
            one('tan-bien', {
                id: 'tham_vu_dong_hanh',
                target: 'menh',
                branches: ['Sửu', 'Mùi'],
                samePalace: ['Tham Lang', 'Vũ Khúc']
            }, 'Tân Biên đồng cung Sửu/Mùi'),
            one('modern-108s', {
                id: 'tham_vu_108s_opposite',
                target: 'menh',
                branches: ['Thìn', 'Tuất'],
                clauses: [
                    clause(['Vũ Khúc'], 'target'),
                    clause(['Tham Lang'], 'opposite')
                ]
            }, '108s Thìn/Tuất opposite')
        ]
    }),
    row({
        catalogIndex: 13,
        id: 'hoa_tham',
        combination: 'Hỏa Tham',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'same-palace',
        sourceRef: 'https://www.108s.tw/article/info/217',
        variants: [
            one('same-palace', {
                id: 'hoa_tham_same',
                target: 'menh',
                soleMajor: ['Tham Lang'],
                samePalace: ['Tham Lang', 'Hỏa Tinh']
            }, 'https://www.108s.tw/article/info/217 primary same palace'),
            one('opposite-weaker', {
                id: 'hoa_tham_opposite',
                target: 'menh',
                soleMajor: ['Tham Lang'],
                clauses: [
                    clause(['Tham Lang'], 'target'),
                    clause(['Hỏa Tinh'], 'opposite')
                ]
            }, 'https://www.108s.tw/article/info/217 weaker opposite')
        ]
    }),
    row({
        catalogIndex: 14,
        id: 'linh_tham',
        combination: 'Linh Tham',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'same-palace',
        sourceRef: 'https://www.108s.tw/article/info/217',
        variants: [
            one('same-palace', {
                id: 'linh_tham_same',
                target: 'menh',
                soleMajor: ['Tham Lang'],
                samePalace: ['Tham Lang', 'Linh Tinh']
            }, 'https://www.108s.tw/article/info/217 primary same palace'),
            one('opposite-weaker', {
                id: 'linh_tham_opposite',
                target: 'menh',
                soleMajor: ['Tham Lang'],
                clauses: [
                    clause(['Tham Lang'], 'target'),
                    clause(['Linh Tinh'], 'opposite')
                ]
            }, 'https://www.108s.tw/article/info/217 weaker opposite')
        ]
    }),
    row({
        catalogIndex: 15,
        id: 'thach_trung_an_ngoc',
        combination: 'Thạch Trung Ẩn Ngọc',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'widened',
        defaultProfile: 'toan-thu',
        sourceRef: 'Tử Vi Đẩu Số Toàn Thư quyển I; https://www.108s.tw/article/info/227',
        grade: {
            complete: true,
            rule: {
                id: 'thach_trung_an_ngoc_grade',
                target: 'menh',
                branches: ['Tí'],
                absent: { at: 'tam_phuong_tu_chinh', stars: SAT },
                clauses: [clause(['Hóa Lộc', 'Hóa Quyền', 'Lộc Tồn'], 'target', { any: true })]
            }
        },
        variants: [one('toan-thu', {
            id: 'thach_trung_an_ngoc',
            target: 'menh',
            branches: ['Tí', 'Ngọ'],
            samePalace: ['Cự Môn']
        }, 'basic Cự Môn at Mệnh Tý/Ngọ')]
    }),
    row({
        catalogIndex: 16,
        id: 'tam_ky_gia_hoi',
        combination: 'Tam Kỳ Gia Hội',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'Hóa Lộc, Hóa Quyền, Hóa Khoa in Mệnh tam phương tứ chính',
        variants: [one('tan-bien', {
            id: 'tam_ky_gia_hoi',
            target: 'menh',
            clauses: [clause(['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa'], 'tam_phuong_tu_chinh')]
        }, 'tam phương tứ chính, no same-palace requirement')]
    }),
    row({
        catalogIndex: 17,
        id: 'song_loc_trieu_vien',
        combination: 'Song Lộc Triều Viên',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-108s',
        sourceRef: 'Mệnh has neither Lộc; Hóa Lộc and Lộc Tồn split between Tài and Quan',
        variants: [one('modern-108s', {
            id: 'song_loc_trieu_vien',
            target: 'menh',
            splitPalaces: { absentAt: 'menh', stars: LOC, oneEach: ['tai_bach', 'quan_loc'] }
        }, 'one Lộc in Tài and the other in Quan')]
    }),
    row({
        catalogIndex: 18,
        id: 'khoa_minh_loc_am',
        combination: 'Khoa Minh Lộc Ám',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'missing',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.2.25',
        variants: [one('tan-bien', {
            id: 'khoa_minh_loc_am',
            anyOf: [
                khoaPair('menh', ['Hóa Khoa'], LOC),
                khoaPair('menh', LOC, ['Hóa Khoa']),
                khoaPair('quan_loc', ['Hóa Khoa'], LOC),
                khoaPair('quan_loc', LOC, ['Hóa Khoa'])
            ]
        }, 'Tân Biên 19.2.25 reciprocal nhị hợp')]
    }),
    row({
        catalogIndex: 19,
        id: 'loc_ma_giao_tri',
        combination: 'Lộc Mã Giao Trì',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien-xung',
        sourceRef: 'Tân Biên: Lộc Tồn xung chiếu (Lộc, Mã gặp nhau)',
        variants: [
            one('tan-bien-xung', {
                id: 'loc_ma_tan_bien_xung',
                target: 'menh',
                clauses: [
                    clause(['Lộc Tồn'], 'opposite'),
                    clause(['Thiên Mã'], 'menh_or_opposite')
                ]
            }, 'Tân Biên Lộc Tồn xung chiếu, Mã gặp tại Mệnh hoặc đối cung'),
            one('same-palace', {
                id: 'loc_ma_same',
                target: 'menh',
                clauses: [
                    clause(['Thiên Mã'], 'target'),
                    clause(LOC, 'target', { any: true })
                ]
            }, 'same-palace variant'),
            one('hoi-chieu', {
                id: 'loc_ma_hoi',
                target: 'menh',
                clauses: [
                    clause(['Thiên Mã'], 'tam_phuong_tu_chinh'),
                    clause(LOC, 'tam_phuong_tu_chinh', { any: true })
                ]
            }, 'hội chiếu variant')
        ]
    }),
    row({
        catalogIndex: 20,
        id: 'hung_tu_trieu_vien',
        combination: 'Hùng Tú Triều Viên',
        engineeringState: 'DISABLED',
        identityStatus: 'NAME_MISMATCH',
        publicEligible: false,
        rulesV2Disposition: 'disabled',
        sourceRef: '雄宿朝垣 is not an exact match for this catalog name',
        limitation: 'The Liêm Trinh Dần/Thân predicate is not kept under this title. A modern 雄宿朝垣 formula would need a distinct id and display name.'
    }),
    row({
        catalogIndex: 21,
        id: 'linh_xuong_da_vu',
        combination: 'Linh Xương Đà Vũ',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/205',
        variants: [one('modern-108s', {
            id: 'linh_xuong_da_vu',
            target: 'menh',
            branches: ['Thìn', 'Tuất'],
            soleMajor: ['Vũ Khúc'],
            clauses: [
                clause(['Vũ Khúc'], 'target'),
                clause(['Tham Lang'], 'opposite'),
                clause(['Linh Tinh', 'Văn Xương', 'Đà La'], 'tam_phuong_tu_chinh')
            ]
        }, 'https://www.108s.tw/article/info/205')]
    }),
    row({
        catalogIndex: 22,
        id: 'hinh_ky_giap_an',
        combination: 'Hình Kỵ Giáp Ấn',
        engineeringState: 'VARIANT',
        identityStatus: 'SCHOOL_GATED',
        publicEligible: false,
        rulesV2Disposition: 'gated',
        defaultProfile: null,
        sourceRef: 'https://www.108s.tw/article/info/206',
        limitation: 'No unqualified default. Enabled only for a selected school profile. Distinct from Hình Tù Giáp Ấn.',
        variants: [
            one('school-kinh-da-flank', {
                id: 'hinh_ky_kinh_da_flank',
                target: 'menh',
                giap: { mode: 'anchor_flanks', anchor: 'Thiên Tướng', flankGroups: [['Kình Dương'], ['Đà La']] }
            }, 'school: Kình Dương and Đà La flank Thiên Tướng'),
            one('school-tuong-hoa-ky', {
                id: 'hinh_ky_tuong_hoa_ky',
                target: 'menh',
                clauses: [
                    clause(['Thiên Tướng', 'Hóa Kỵ'], 'target'),
                    clause(['Kình Dương'], 'tam_phuong_tu_chinh')
                ]
            }, 'school: Thiên Tướng meets Hóa Kỵ and Kình Dương')
        ]
    }),
    row({
        catalogIndex: 23,
        id: 'menh_ly_phung_khong',
        combination: 'Mệnh Lý Phùng Không',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-108s',
        sourceRef: '108s: Mệnh encounters Địa Không and Địa Kiếp',
        variants: [
            one('modern-108s', {
                id: 'menh_ly_phung_khong',
                target: 'menh',
                clauses: [clause(['Địa Không', 'Địa Kiếp'], 'target')]
            }, '108s encounter at Mệnh; no Mệnh–Thân link'),
            one('ty-hoi-vcd', {
                id: 'menh_ly_ty_hoi_vcd',
                target: 'menh',
                branches: ['Tị', 'Hợi'],
                noMajor: true,
                clauses: [clause(['Địa Không', 'Địa Kiếp'], 'target')]
            }, 'more specific Tỵ/Hợi vô chính diệu form')
        ]
    }),
    row({
        catalogIndex: 24,
        id: 'kinh_da_hiep_ky',
        combination: 'Kình Đà Hiệp Kỵ',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/248',
        variants: [one('modern-108s', {
            id: 'kinh_da_hiep_ky',
            anyOf: [
                {
                    target: 'menh',
                    giap: { mode: 'anchor_flanks', anchor: 'Lộc Tồn', flankGroups: [['Kình Dương'], ['Đà La']] },
                    clauses: [clause(['Hóa Kỵ'], 'target')]
                },
                {
                    target: 'menh',
                    noMajor: true,
                    giap: { mode: 'anchor_flanks', anchor: 'Lộc Tồn', flankGroups: [['Kình Dương'], ['Đà La']] },
                    clauses: [clause(['Hóa Kỵ'], 'opposite')]
                }
            ]
        }, 'https://www.108s.tw/article/info/248')]
    }),
    row({
        catalogIndex: 25,
        id: 'loc_phung_xung_pha',
        combination: 'Lộc Phùng Xung Phá',
        engineeringState: 'DISABLED',
        identityStatus: 'STAR_ALIAS_UNRESOLVED',
        publicEligible: false,
        rulesV2Disposition: 'disabled',
        sourceRef: 'Tân Biên phu-giai/107: Lộc tọa Mệnh, Phá xung chiếu',
        limitation: 'The star-alias map does not establish which Phá is meant. Không, Kiếp, Hóa Kỵ, Tuần and Triệt are not substituted.'
    }),
    row({
        catalogIndex: 26,
        id: 'ma_lac_khong_vong',
        combination: 'Mã Lạc Không Vong',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.3.8; modern https://www.108s.tw/article/info/268',
        variants: [
            one('tan-bien', {
                id: 'ma_lac_tan_bien',
                target: 'menh',
                clauses: [clause(['Thiên Mã'], 'target')],
                countAtLeast: { n: 1, markers: ['tuan', 'triet'] }
            }, 'Tân Biên: Thiên Mã at Mệnh gặp Tuần hoặc Triệt'),
            one('modern-108s', {
                id: 'ma_lac_108s',
                target: 'menh',
                clauses: [
                    clause(['Thiên Mã'], 'target'),
                    clause(['Địa Không', 'Địa Kiếp'], 'menh_or_opposite', { any: true })
                ]
            }, 'https://www.108s.tw/article/info/268')
        ]
    }),
    row({
        catalogIndex: 27,
        id: 'cu_hoa_kinh_duong',
        combination: 'Cự Hỏa Kình Dương',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        namedPublicEligible: false,
        publicEligible: false,
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên: Cự tọa Mệnh, Hỏa Kình Đà hội hợp, thêm nhiều sao xấu',
        limitation: 'The extra inauspicious context is an incomplete modifier. No death or suicide interpretation is emitted.',
        modifiers: [{ id: 'many_inauspicious_stars', status: 'incomplete', predictive: false }],
        variants: [one('tan-bien', {
            id: 'cu_hoa_kinh_duong',
            target: 'menh',
            clauses: [
                clause(['Cự Môn'], 'target'),
                clause(['Hỏa Tinh'], 'tam_phuong_tu_chinh'),
                clause(['Kình Dương'], 'tam_phuong_tu_chinh'),
                clause(['Đà La'], 'tam_phuong_tu_chinh')
            ]
        }, 'structural hội of Cự, Hỏa, Kình, Đà', { publicEligible: false })]
    }),
    row({
        catalogIndex: 28,
        id: 'phiem_thuy_dao_hoa',
        combination: 'Phiếm Thủy Đào Hoa',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'narrowed',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên: Mệnh Hợi/Tý, Tham, Kình hoặc Đà đồng cung',
        variants: [one('tan-bien', {
            id: 'phiem_thuy_dao_hoa',
            target: 'menh',
            branches: ['Tí', 'Hợi'],
            samePalace: ['Tham Lang'],
            clauses: [clause(['Kình Dương', 'Đà La'], 'target', { any: true })]
        }, 'Tân Biên Kình or Đà đồng cung')]
    }),
    row({
        catalogIndex: 29,
        id: 'phong_luu_thai_truong',
        combination: 'Phong Lưu Thái Trượng',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'narrowed',
        defaultProfile: 'modern-108s',
        sourceRef: '108s: Tham độc tọa Mệnh Dần, Đà La đồng cung',
        variants: [one('modern-108s', {
            id: 'phong_luu_thai_truong',
            target: 'menh',
            branches: ['Dần'],
            soleMajor: ['Tham Lang'],
            samePalace: ['Tham Lang', 'Đà La']
        }, 'Mệnh Dần only')]
    }),
    row({
        catalogIndex: 30,
        id: 'nhat_nguyet_tang_huy',
        combination: 'Nhật Nguyệt Tàng Huy',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'sprint9c-span',
        sourceRef: 'docs/knowledge/research/sprint-9c/passages/nhat-nguyet-tang-huy.txt',
        variants: [one('sprint9c-span', {
            id: 'nhat_nguyet_tang_huy',
            anyOf: [
                {
                    target: 'menh',
                    branches: ['Hợi', 'Tí', 'Sửu'],
                    clauses: [
                        clause(['Thái Dương'], 'target'),
                        clause(['Cự Môn'], 'target')
                    ]
                },
                {
                    target: 'menh',
                    branches: ['Tị', 'Ngọ', 'Mùi'],
                    clauses: [
                        clause(['Thái Âm'], 'target'),
                        clause(['Cự Môn'], 'target')
                    ]
                }
            ]
        }, 'Sprint 9C two-alternative span')]
    }),
    row({
        catalogIndex: 31,
        id: 'ban_khong_chiet_xi',
        combination: 'Bán Không Chiết Xỉ',
        engineeringState: 'DISABLED',
        identityStatus: 'NAME_MISMATCH',
        publicEligible: false,
        rulesV2Disposition: 'disabled',
        sourceRef: 'Retrieved text says 半天折翅 inside another formation',
        limitation: 'Catalog identity is not established. The phrase is not implemented as this name.'
    }),
    row({
        catalogIndex: 32,
        id: 'menh_vo_chinh_dieu',
        combination: 'Mệnh Vô Chính Diệu',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'No main star in Mệnh',
        variants: [one('tan-bien', {
            id: 'menh_vo_chinh_dieu',
            target: 'menh',
            noMajor: true
        }, 'existing no-major predicate')]
    }),
    row({
        catalogIndex: 33,
        id: 'am_loc',
        combination: 'Ám Lộc',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'missing',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên phu-giai/108 Minh Lộc–Ám Lộc',
        variants: [one('tan-bien', {
            id: 'am_loc',
            anyOf: [
                { ...khoaPair('menh', ['Lộc Tồn'], ['Hóa Lộc']), brightHost: true },
                { ...khoaPair('menh', ['Hóa Lộc'], ['Lộc Tồn']), brightHost: true }
            ]
        }, 'Tân Biên reciprocal Lộc Tồn and Hóa Lộc on a bright Mệnh')]
    }),
    row({
        catalogIndex: 34,
        id: 'tu_phu_trieu_vien',
        combination: 'Tử Phủ Triều Viên',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.2.2',
        variants: [
            one('tan-bien', {
                id: 'tu_phu_trieu_vien',
                anyOf: [
                    hostAspect('menh', 'Tử Vi', 'Thiên Phủ'),
                    hostAspect('menh', 'Thiên Phủ', 'Tử Vi'),
                    hostAspect('quan_loc', 'Tử Vi', 'Thiên Phủ'),
                    hostAspect('quan_loc', 'Thiên Phủ', 'Tử Vi')
                ]
            }, 'Tân Biên 19.2.2 bright host and chiếu'),
            one('modern-broader', {
                id: 'tu_phu_trieu_vien_modern',
                target: 'menh',
                clauses: [clause(['Tử Vi', 'Thiên Phủ'], 'tam_phuong_tu_chinh')]
            }, 'broader modern tam phương tứ chính variant')
        ]
    }),
    row({
        catalogIndex: 35,
        id: 'thien_at_cung_menh',
        combination: 'Thiên Ất Củng Mệnh',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'widened',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/262',
        variants: [one('modern-108s', {
            id: 'thien_at_cung_menh',
            target: 'menh',
            clauses: [clause(['Thiên Khôi', 'Thiên Việt'], 'tam_phuong_tu_chinh')]
        }, 'https://www.108s.tw/article/info/262')]
    }),
    row({
        catalogIndex: 36,
        id: 'ta_huu_dong_cung',
        combination: 'Tả Hữu Đồng Cung',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tả Phù + Hữu Bật đồng cung Mệnh Sửu/Mùi',
        grade: { complete: false, note: 'Additional beneficial stars are grade conditions.' },
        variants: [one('tan-bien', {
            id: 'ta_huu_dong_cung',
            target: 'menh',
            branches: ['Sửu', 'Mùi'],
            samePalace: ['Tả Phù', 'Hữu Bật']
        }, 'đồng cung Sửu/Mùi')]
    }),
    row({
        catalogIndex: 37,
        id: 'van_tinh_cung_menh',
        combination: 'Văn Tinh Củng Mệnh',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/254',
        grade: {
            complete: true,
            rule: {
                id: 'van_tinh_cung_menh_grade',
                target: 'menh',
                absent: { at: 'tam_phuong_tu_chinh', stars: SAT },
                clauses: [clause(['Văn Xương', 'Văn Khúc'], 'tam_phuong_tu_chinh')]
            }
        },
        variants: [one('modern-108s', {
            id: 'van_tinh_cung_menh',
            target: 'menh',
            clauses: [clause(['Văn Xương', 'Văn Khúc'], 'tam_phuong_tu_chinh')]
        }, 'https://www.108s.tw/article/info/254')]
    }),
    row({
        catalogIndex: 38,
        id: 'nhat_nguyet_dong_lam',
        combination: 'Nhật Nguyệt Đồng Lâm',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien-editorial',
        sourceRef: 'Tân Biên/editorial opposite Sửu–Mùi; modern https://www.108s.tw/article/info/222',
        variants: [
            one('tan-bien-editorial', {
                id: 'nhat_nguyet_dong_lam_opposite',
                anyOf: [
                    dongLamOpposite('menh', 'Sửu'),
                    dongLamOpposite('menh', 'Mùi'),
                    dongLamOpposite('quan_loc', 'Sửu'),
                    dongLamOpposite('quan_loc', 'Mùi')
                ]
            }, 'editorial opposite-palace conjunction'),
            one('modern-108s', {
                id: 'nhat_nguyet_dong_lam_same',
                target: 'menh',
                branches: ['Sửu', 'Mùi'],
                samePalace: ['Thái Dương', 'Thái Âm']
            }, 'https://www.108s.tw/article/info/222')
        ]
    }),
    row({
        catalogIndex: 39,
        id: 'tho_tinh_nhap_mieu',
        combination: 'Thọ Tinh Nhập Miếu',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'widened',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/236',
        grade: { complete: false, note: 'The restrictive Ngọ quý configuration is not certified from base recognition.' },
        variants: [one('modern-108s', {
            id: 'tho_tinh_nhap_mieu',
            target: 'menh',
            branches: ['Tí', 'Ngọ'],
            samePalace: ['Thiên Lương']
        }, 'https://www.108s.tw/article/info/236')]
    }),
    row({
        catalogIndex: 40,
        id: 'anh_tinh_nhap_mieu',
        combination: 'Anh Tinh Nhập Miếu',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/208',
        grade: { complete: false, note: 'Ngọ, year and favorable quý conditions are not part of the basic predicate.' },
        variants: [one('modern-108s', {
            id: 'anh_tinh_nhap_mieu',
            target: 'menh',
            branches: ['Tí', 'Ngọ'],
            soleMajor: ['Phá Quân'],
            clauses: [
                clause(['Phá Quân'], 'target'),
                clause(['Liêm Trinh', 'Thiên Tướng'], 'opposite')
            ]
        }, 'https://www.108s.tw/article/info/208')]
    }),
    row({
        catalogIndex: 41,
        id: 'kinh_duong_nhap_mieu',
        combination: 'Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn)',
        engineeringState: 'ACTIVE',
        identityStatus: 'CORRECTED_DISPLAY',
        displayIdentity: 'Kình Dương Nhập Miếu',
        notASynonymOf: 'Mã Đầu Đới Tiễn',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/265',
        grade: { complete: false, note: 'Supporting stars are grade, not the basic predicate.' },
        variants: [one('modern-108s', {
            id: 'kinh_duong_nhap_mieu',
            target: 'menh',
            branches: ['Sửu', 'Thìn', 'Mùi', 'Tuất'],
            samePalace: ['Kình Dương']
        }, 'https://www.108s.tw/article/info/265')]
    }),
    row({
        catalogIndex: 42,
        id: 'tai_an_giao_tri',
        combination: 'Tài Ấn Giao Trì',
        engineeringState: 'DISABLED',
        identityStatus: 'HISTORICAL_NAME_NOT_ESTABLISHED',
        publicEligible: false,
        rulesV2Disposition: 'disabled',
        sourceRef: 'Modern 财印交驰 passage does not establish the catalog title',
        limitation: 'Vũ Khúc + Thiên Tướng at Dần/Thân may be discussed as an internal pair. It is not published under this historical title.'
    }),
    row({
        catalogIndex: 43,
        id: 'giap_de_dang_khoa',
        combination: 'Giáp Đệ Đăng Khoa',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'widened',
        defaultProfile: 'modern-108s',
        sourceRef: 'Mệnh host Hóa Khoa; Hóa Quyền in tam phương tứ chính',
        grade: { complete: false, note: 'No sát/kỵ and extra auspicious stars belong to quý-grade.' },
        variants: [one('modern-108s', {
            id: 'giap_de_dang_khoa',
            target: 'menh',
            clauses: [
                clause(['Hóa Khoa'], 'target'),
                clause(['Hóa Quyền'], 'tam_phuong_tu_chinh')
            ]
        }, '108s basic: host Hóa Khoa, Hóa Quyền hội chiếu')]
    }),
    row({
        catalogIndex: 44,
        id: 'de_ngo_hung_do',
        combination: 'Đế Ngộ Hung Đồ',
        engineeringState: 'DISABLED',
        identityStatus: 'HISTORICAL_NAME_NOT_ESTABLISHED',
        publicEligible: false,
        rulesV2Disposition: 'disabled',
        sourceRef: 'Aphorism does not establish Tử Vi + Kình Dương + Hỏa Tinh at Mệnh',
        limitation: 'No precise rule is invented from the aphorism.'
    }),
    row({
        catalogIndex: 45,
        id: 'nhat_nguyet_tat_ach',
        combination: 'Nhật Nguyệt Tật Ách',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'source-wording',
        sourceRef: 'Both luminaries in the Tật Ách palace',
        limitation: 'Illness wording in sources is not a medical diagnosis.',
        variants: [one('source-wording', {
            id: 'nhat_nguyet_tat_ach',
            target: 'tat_ach',
            samePalace: ['Thái Dương', 'Thái Âm']
        }, 'direct wording: both luminaries in Tật Ách')]
    }),
    row({
        catalogIndex: 46,
        id: 'khuc_am_dong_cung',
        combination: 'Khúc Ám Đồng Cung',
        engineeringState: 'INTERNAL_ONLY',
        identityStatus: 'UNRESOLVED_IDENTITY',
        publicEligible: false,
        namedPublicEligible: false,
        rulesV2Disposition: 'internal',
        defaultProfile: 'structural',
        sourceRef: 'Văn Khúc + Cự Môn đồng cung; historical formation name not established',
        variants: [one('structural', {
            id: 'khuc_am_dong_cung',
            target: 'menh',
            samePalace: ['Văn Khúc', 'Cự Môn']
        }, 'internal same-palace pattern', { publicEligible: false })]
    }),
    row({
        catalogIndex: 47,
        id: 'thien_co_ty_hoi',
        combination: 'Thiên Cơ Tỵ Hợi',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'missing',
        defaultProfile: 'modern-source',
        sourceRef: 'modern source-specific: Thiên Cơ độc tọa Mệnh Tỵ/Hợi, Thái Âm opposite',
        variants: [one('modern-source', {
            id: 'thien_co_ty_hoi',
            target: 'menh',
            branches: ['Tị', 'Hợi'],
            soleMajor: ['Thiên Cơ'],
            clauses: [
                clause(['Thiên Cơ'], 'target'),
                clause(['Thái Âm'], 'opposite')
            ]
        }, 'modern variant, no added sát or hãm requirement')]
    }),
    row({
        catalogIndex: 48,
        id: 'hinh_tu_giap_an',
        combination: 'Hình Tù Giáp Ấn',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.2.18; modern https://www.108s.tw/article/info/210',
        limitation: 'The 108s same-palace formula is not used as the Tân Biên flank. A 10800-chart sample of this placer found same-palace Liêm–Tướng–Kình and no Kình/Liêm flank around Thiên Tướng, so the Tân Biên variant has no observed natal witness. A chart matches it only when the flank is actually present.',
        variants: [
            one('tan-bien', {
                id: 'hinh_tu_tan_bien_giap',
                anyOf: [
                    {
                        target: 'menh',
                        giap: { mode: 'anchor_flanks', anchor: 'Thiên Tướng', flankGroups: [['Kình Dương'], ['Liêm Trinh']] }
                    },
                    {
                        target: 'quan_loc',
                        giap: { mode: 'anchor_flanks', anchor: 'Thiên Tướng', flankGroups: [['Kình Dương'], ['Liêm Trinh']] }
                    }
                ]
            }, 'Tân Biên 19.2.18 Ấn tọa thủ, Kình and Liêm giáp'),
            one('modern-108s', {
                id: 'hinh_tu_108s_same',
                target: 'menh',
                branches: ['Tí', 'Ngọ'],
                samePalace: ['Liêm Trinh', 'Thiên Tướng', 'Kình Dương']
            }, 'https://www.108s.tw/article/info/210')
        ]
    }),
    row({
        catalogIndex: 49,
        id: 'cu_phung_tu_sat',
        combination: 'Cự Phùng Tứ Sát',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'sprint9c-span',
        sourceRef: 'docs/knowledge/research/sprint-9c/passages/cu-phung-tu-sat.txt',
        variants: [one('sprint9c-span', {
            id: 'cu_phung_tu_sat',
            target: 'menh',
            clauses: [
                clause(['Cự Môn'], 'target'),
                clause(['Kình Dương', 'Đà La'], 'tam_phuong_tu_chinh', { any: true }),
                clause(['Linh Tinh', 'Hỏa Tinh'], 'tam_phuong_tu_chinh', { any: true }),
                clause(['Địa Không', 'Địa Kiếp'], 'tam_phuong_tu_chinh', { any: true })
            ]
        }, 'OR within each sát group, AND across the three groups')]
    }),
    row({
        catalogIndex: 50,
        id: 'lo_bang_mai_thi',
        combination: 'Lộ Bàng Mai Thi',
        engineeringState: 'INTERNAL_ONLY',
        identityStatus: 'RELATED_APHORISM',
        publicEligible: false,
        namedPublicEligible: false,
        rulesV2Disposition: 'internal',
        defaultProfile: 'structural',
        sourceRef: 'Classical line supports Liêm Trinh and Thất Sát đồng vị; catalog name is distinct from 路上埋屍',
        limitation: 'No death interpretation. Sửu/Mùi, Hóa Kỵ, Kình and Đà are not added from that sentence.',
        variants: [one('structural', {
            id: 'lo_bang_mai_thi',
            target: 'menh',
            samePalace: ['Liêm Trinh', 'Thất Sát']
        }, 'đồng vị only', { publicEligible: false })]
    }),
    row({
        catalogIndex: 51,
        id: 'hoa_cai_cu_phu_the',
        combination: 'Hoa Cái Cư Phu Thê',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'bound-source',
        sourceRef: 'Hoa Cái in Phu Thê',
        variants: [one('bound-source', {
            id: 'hoa_cai_cu_phu_the',
            target: 'phu_the',
            samePalace: ['Hoa Cái']
        }, 'Hoa Cái at Phu Thê; Hóa Kỵ is not required')]
    }),
    row({
        catalogIndex: 52,
        id: 'luong_trung_thien_ma',
        combination: 'Lưỡng Trùng Thiên Mã',
        engineeringState: 'DISABLED',
        identityStatus: 'NAME_MISMATCH',
        publicEligible: false,
        rulesV2Disposition: 'missing',
        sourceRef: '兩重天祿天馬 is two Lộc stars and one Thiên Mã',
        limitation: 'No Lưu Thiên Mã overlay is invented for two Thiên Mã.'
    }),
    row({
        catalogIndex: 53,
        id: 'cat_xu_tang_hung',
        combination: 'Cát Xứ Tàng Hung',
        engineeringState: 'DISABLED',
        identityStatus: 'HISTORICAL_NAME_NOT_ESTABLISHED',
        publicEligible: false,
        rulesV2Disposition: 'missing',
        sourceRef: 'Aphorism concerns Lộc encountering xung phá',
        limitation: 'Not promoted to a standalone Địa Kiếp/Triệt pattern.'
    }),
    row({
        catalogIndex: 54,
        id: 'phu_tuong_trieu_vien',
        combination: 'Phủ Tướng Triều Viên',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.2.5',
        variants: [one('tan-bien', {
            id: 'phu_tuong_trieu_vien',
            anyOf: [
                hostAspect('menh', 'Thiên Phủ', 'Thiên Tướng'),
                hostAspect('menh', 'Thiên Tướng', 'Thiên Phủ'),
                hostAspect('quan_loc', 'Thiên Phủ', 'Thiên Tướng'),
                hostAspect('quan_loc', 'Thiên Tướng', 'Thiên Phủ')
            ]
        }, 'Tân Biên 19.2.5')]
    }),
    row({
        catalogIndex: 55,
        id: 'nhat_le_trung_thien',
        combination: 'Nhật Lệ Trung Thiên',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'modern-108s',
        sourceRef: 'https://www.108s.tw/article/info/221',
        grade: { complete: false, note: 'Brightness and supporting stars are grade, not extra base stars.' },
        variants: [one('modern-108s', {
            id: 'nhat_le_trung_thien',
            target: 'menh',
            branches: ['Ngọ'],
            samePalace: ['Thái Dương']
        }, 'https://www.108s.tw/article/info/221')]
    }),
    row({
        catalogIndex: 56,
        id: 'chung_thuy_trieu_dong',
        combination: 'Chúng Thủy Triều Đông',
        engineeringState: 'DISABLED',
        identityStatus: 'STAR_IDENTITY_UNRESOLVED',
        publicEligible: false,
        rulesV2Disposition: 'disabled',
        sourceRef: 'Classical 文耗居寅卯',
        limitation: 'Đại Hao + Tiểu Hao at Mão/Dậu is not an authorized substitute. The classical statement remains research evidence.'
    }),
    row({
        catalogIndex: 57,
        id: 'khong_kiep_giap_menh',
        combination: 'Không Kiếp Giáp Mệnh',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'narrowed',
        defaultProfile: 'tan-bien',
        sourceRef: 'Địa Không and Địa Kiếp on opposite neighboring palaces',
        variants: [one('tan-bien', {
            id: 'khong_kiep_giap_menh',
            target: 'menh',
            giap: { mode: 'split_flanks', stars: ['Địa Không', 'Địa Kiếp'] }
        }, 'one star on each flank')]
    }),
    row({
        catalogIndex: 58,
        id: 'kinh_da_giap_menh',
        combination: 'Kình Đà Giáp Mệnh',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'narrowed',
        defaultProfile: 'tan-bien',
        sourceRef: 'Kình Dương and Đà La on opposite neighboring palaces',
        variants: [one('tan-bien', {
            id: 'kinh_da_giap_menh',
            target: 'menh',
            giap: { mode: 'split_flanks', stars: ['Kình Dương', 'Đà La'] }
        }, 'one star on each flank')]
    }),
    row({
        catalogIndex: 59,
        id: 'quan_than_khanh_hoi',
        combination: 'Quân Thần Khánh Hội',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'tan-bien',
        sourceRef: 'Tân Biên 19.2.3–19.2.4',
        limitation: 'A missing auxiliary star returns no match.',
        variants: [one('tan-bien', {
            id: 'quan_than_khanh_hoi',
            anyOf: ['menh', 'quan_loc'].map((target) => ({
                target,
                clauses: [
                    clause(['Tử Vi'], 'target', { brightness: BRIGHT }),
                    clause(QUAN_THAN_AUX, 'tam_phuong_tu_chinh')
                ]
            }))
        }, 'Tân Biên 19.2.3–19.2.4')]
    }),
    row({
        catalogIndex: 60,
        id: 'co_cu_dong_lam',
        combination: 'Cơ Cự Đồng Lâm',
        engineeringState: 'ACTIVE',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'kept',
        defaultProfile: 'tan-bien',
        sourceRef: 'Thiên Cơ + Cự Môn đồng cung Mệnh Mão/Dậu',
        variants: [one('tan-bien', {
            id: 'co_cu_dong_lam',
            target: 'menh',
            branches: ['Mão', 'Dậu'],
            samePalace: ['Thiên Cơ', 'Cự Môn']
        }, 'đồng cung Mão/Dậu')]
    }),
    row({
        catalogIndex: 61,
        id: 'thuy_trung_que_ngac',
        combination: 'Thủy Trừng Quế Ngạc',
        engineeringState: 'VARIANT',
        identityStatus: 'SOURCE_SCOPED',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'classical',
        sourceRef: '太陰居子，號曰水澄桂萼',
        variants: [one('classical', {
            id: 'thuy_trung_que_ngac',
            target: 'menh',
            branches: ['Tí'],
            samePalace: ['Thái Âm']
        }, 'classical Thái Âm at Tý')]
    }),
    row({
        catalogIndex: 62,
        id: 'dong_luong_ty_hoi',
        combination: 'Đồng Lương Tỵ Hợi',
        engineeringState: 'VARIANT',
        identityStatus: 'MODERN_VARIANT',
        rulesV2Disposition: 'replaced',
        defaultProfile: 'modern-source',
        sourceRef: 'Thiên Đồng độc tọa Mệnh Tỵ/Hợi; Thiên Lương at the opposite palace',
        variants: [one('modern-source', {
            id: 'dong_luong_ty_hoi',
            target: 'menh',
            branches: ['Tị', 'Hợi'],
            soleMajor: ['Thiên Đồng'],
            clauses: [
                clause(['Thiên Đồng'], 'target'),
                clause(['Thiên Lương'], 'opposite')
            ]
        }, 'oriented opposite, not an unordered menh_or_opposite pair')]
    }),
    row({
        catalogIndex: 63,
        id: 'menh_vcd_tam_khong',
        combination: 'Mệnh VCD Đắc Tam Không',
        engineeringState: 'VARIANT',
        identityStatus: 'UNRESOLVED_IDENTITY',
        namedPublicEligible: false,
        publicEligible: false,
        rulesV2Disposition: 'replaced',
        defaultProfile: 'school-specific',
        sourceRef: 'Bound sentence: vô chính diệu, Tuần hoặc Triệt thủ, Thiên Không chiếu',
        limitation: 'Public named-formation eligibility stays off. Đắc, Ngộ and Kiến Tam Không are not conflated. Địa Không is not counted.',
        variants: [one('school-specific', {
            id: 'menh_vcd_tam_khong',
            target: 'menh',
            noMajor: true,
            countAtLeast: { n: 1, markers: ['tuan', 'triet'] },
            clauses: [clause(['Thiên Không'], 'aspect')]
        }, 'school-specific structural predicate', { publicEligible: false })]
    })
];

const STATES = ['ACTIVE', 'VARIANT', 'INTERNAL_ONLY', 'DISABLED'];

export function formulaByName(name) {
    return FORMULAS.find((item) => item.combination === name) || null;
}

export function resolveRuntime(entry, profile) {
    if (!entry) return { evaluable: false, publicInterpretationAllowed: false, formulaVersion: FORMULA_VERSION };
    const base = {
        catalogId: entry.id,
        combination: entry.combination,
        engineeringState: entry.engineeringState,
        identityStatus: entry.identityStatus,
        formulaVersion: FORMULA_VERSION,
        expertVerified: false,
        sourceRef: entry.sourceRef,
        grade: entry.grade || null,
        displayIdentity: entry.displayIdentity || entry.combination,
        notASynonymOf: entry.notASynonymOf || null
    };
    if (entry.engineeringState === 'DISABLED' || !entry.variants?.length) {
        return { ...base, evaluable: false, publicInterpretationAllowed: false, reason: entry.limitation || 'disabled' };
    }
    const selected = profile == null || profile === '' ? entry.defaultProfile : profile;
    if (!selected) {
        return { ...base, evaluable: false, publicInterpretationAllowed: false, reason: 'no_default_profile' };
    }
    const variant = entry.variants.find((item) => item.profile === selected);
    if (!variant?.rule) {
        return { ...base, evaluable: false, publicInterpretationAllowed: false, profile: selected, reason: 'profile_unavailable' };
    }
    const namedOff = entry.namedPublicEligible === false || entry.engineeringState === 'INTERNAL_ONLY';
    return {
        ...base,
        evaluable: true,
        publicInterpretationAllowed: !namedOff && variant.publicEligible !== false,
        profile: variant.profile,
        sourceRef: variant.sourceRef || entry.sourceRef,
        rule: { ...variant.rule, id: variant.rule.id || entry.id },
        reason: null
    };
}

export function formulaInventory() {
    const byState = Object.fromEntries(STATES.map((state) => [state, 0]));
    const rulesV2 = {};
    let publicEligible = 0;
    let executable = 0;
    let variantImplementations = 0;
    let unimplementedSupported = 0;
    for (const entry of FORMULAS) {
        byState[entry.engineeringState] += 1;
        rulesV2[entry.rulesV2Disposition] = (rulesV2[entry.rulesV2Disposition] || 0) + 1;
        const resolved = resolveRuntime(entry);
        if (resolved.publicInterpretationAllowed) publicEligible += 1;
        const runnable = entry.variants?.filter((item) => item.rule) || [];
        variantImplementations += runnable.length;
        if (entry.engineeringState !== 'DISABLED' && runnable.length > 0) executable += 1;
        if (entry.engineeringState !== 'DISABLED' && runnable.length === 0) unimplementedSupported += 1;
    }
    return {
        total: FORMULAS.length,
        byState,
        stateSum: STATES.reduce((sum, state) => sum + byState[state], 0),
        publicEligible,
        executable,
        disabled: byState.DISABLED,
        variantImplementations,
        unimplementedSupported,
        rulesV2,
        missingRules: FORMULAS.filter((entry) => entry.rulesV2Disposition === 'missing').map((entry) => entry.combination)
    };
}

const inventory = formulaInventory();
if (inventory.total !== 63 || inventory.stateSum !== 63) {
    throw new Error(`Sprint 9 V1 formula table must account for 63 records, got ${inventory.total}/${inventory.stateSum}`);
}
