import { CUNG_CHUC, CUC_SO_MAP, DIA_CHI, THIEN_CAN } from './constants.js';
import { palaceHasStar } from './starNames.js';
import { DEFAULT_SCHOOL, resolveSchool } from './schoolProfile.js';
import tuviRing from '../data/tuviRing.json' with { type: 'json' };
import phuRing from '../data/phuRing.json' with { type: 'json' };
import tsArray from '../data/tsArray.json' with { type: 'json' };
import locMap from '../data/locMap.json' with { type: 'json' };
import bsArray from '../data/bsArray.json' with { type: 'json' };
import NAP_AM_MAP from '../data/NAP_AM_MAP.json' with { type: 'json' };
import tuHoaMap from '../data/tuHoaMap.json' with { type: 'json' };
import khoiMap from '../data/khoiMap.json' with { type: 'json' };
import vietMap from '../data/vietMap.json' with { type: 'json' };
import starStatus from '../data/starStatus.json' with { type: 'json' };

function fixChi(x) { let r = x % 12; if (r <= 0) r += 12; return r; }

/**
 * Tháng dùng để an sao.
 * Tháng nhuận: trước ngày 15 giữ đúng số tháng (tháng trước), từ ngày 15 tính tháng sau.
 * Tháng 12 nhuận từ ngày 15 trở đi an theo tháng 1.
 */
export function resolveAnSaoMonth(lunarMonth, lunarDay, isLeapMonth) {
    if (!isLeapMonth) return lunarMonth;
    if (lunarDay < 15) return lunarMonth;
    return lunarMonth === 12 ? 1 : lunarMonth + 1;
}

// Vị trí 1 = Tí … 12 = Hợi. Bảng 14 chính tinh theo Tử Vi Đẩu Số Toàn Thư (tách Miếu và Vượng).
export function getStarStatus(star, pos) {
    const mark = starStatus[star]?.[pos];
    if (mark) return `${star} (${mark})`;
    return star;
}

// Break down calculateTuVi into smaller helpers to improve readability and testability
function initBoxes() {
    const boxes = {};
    for (let i = 1; i <= 12; i++) {
        boxes[i] = { cungName: "", chiName: DIA_CHI[i], fullCanChi: "", majorStars: [], goodStars: [], badStars: [], daiHan: "", trangSinh: "", isTuan: false, isTriet: false, thang: fixChi(i - 2) };
    }
    return boxes;
}

function computeCanChiForBoxes(boxes, canYearIndex, menh) {
    let canDan = (canYearIndex * 2 + 2) % 10;
    for (let i = 1; i <= 12; i++) {
        let dist = i - 3;
        if (dist < 0) dist += 12;
        let canCung = (canDan + dist) % 10;
        boxes[i].fullCanChi = THIEN_CAN[canCung][0] + "." + DIA_CHI[i];
    }
    return canDan;
}

function computeCucId(canMenh, menh) {
    let hanhVal = Math.floor(canMenh / 2) + 1 + Math.floor(((menh - 1) % 6) / 2) + 1;
    if (hanhVal > 5) hanhVal -= 5;
    const napAmToCuc = { 1: 3, 2: 4, 3: 2, 4: 6, 5: 5 };
    return napAmToCuc[hanhVal];
}

export function calculateTuVi(canYearIndex, chiYearIndex, day, month, hour, gender, isLeapMonth = false, schoolProfile = DEFAULT_SCHOOL) {
    const school = resolveSchool(schoolProfile);
    const boxes = initBoxes();
    const anSaoMonth = resolveAnSaoMonth(month, day, isLeapMonth);

    const posThang = fixChi(3 + anSaoMonth - 1);
    const menh = fixChi(posThang - (hour - 1));
    const than = fixChi(posThang + (hour - 1));

    const canDan = computeCanChiForBoxes(boxes, canYearIndex, menh);

    let distMenh = menh - 3;
    if (distMenh < 0) distMenh += 12;
    let canMenh = (canDan + distMenh) % 10;

    const cucId = computeCucId(canMenh, menh);

    const napAmName = NAP_AM_MAP[`${canYearIndex}-${chiYearIndex}`] || "Kim Bạch Kim";
    const napAmToHanh = { "Kim": 2, "Mộc": 1, "Thủy": 3, "Hỏa": 4, "Thổ": 5 };
    let napAmElement = "Kim";
    for (let el in napAmToHanh) { if (napAmName.includes(el)) { napAmElement = el; break; } }
    let nguHanhBanMenh = napAmName;

    const cucElements = { 2: "Thủy", 3: "Mộc", 4: "Kim", 5: "Thổ", 6: "Hỏa" };
    let cucElement = cucElements[cucId] || "Mộc";

    const sinhKhacMap = {
        "Kim": { sinh: "Thủy", khac: "Mộc", binhHoa: "Kim" },
        "Mộc": { sinh: "Hỏa", khac: "Thổ", binhHoa: "Mộc" },
        "Thủy": { sinh: "Mộc", khac: "Hỏa", binhHoa: "Thủy" },
        "Hỏa": { sinh: "Thổ", khac: "Kim", binhHoa: "Hỏa" },
        "Thổ": { sinh: "Kim", khac: "Thủy", binhHoa: "Thổ" },
    };
    let cucKhacMenh = "Mệnh Cục bình hòa";
    if (napAmElement === cucElement) cucKhacMenh = "Mệnh Cục bình hòa";
    else if (sinhKhacMap[napAmElement]?.khac === cucElement) cucKhacMenh = "Mệnh khắc Cục";
    else if (sinhKhacMap[napAmElement]?.sinh === cucElement) cucKhacMenh = "Mệnh sinh Cục";
    else if (sinhKhacMap[cucElement]?.khac === napAmElement) cucKhacMenh = "Cục khắc Mệnh";
    else if (sinhKhacMap[cucElement]?.sinh === napAmElement) cucKhacMenh = "Cục sinh Mệnh";

    const isDuong = [0, 2, 4, 6, 8].includes(canYearIndex);
    const textAmDuong = (isDuong ? "Dương " : "Âm ") + (gender === 1 ? "Nam" : "Nữ");
    const isDuongCung = [1, 3, 5, 7, 9, 11].includes(menh);
    const thuanLy = (isDuong && isDuongCung) || (!isDuong && !isDuongCung) ? "Âm Dương thuận lý" : "Âm Dương nghịch lý";

    for (let i = 0; i < 12; i++) boxes[fixChi(menh + i)].cungName = CUNG_CHUC[i];
    boxes[than].cungName = boxes[than].cungName !== "MỆNH" ? boxes[than].cungName + " / THÂN" : "MỆNH / THÂN";

    const isThuan = (gender === 1 && isDuong) || (gender === -1 && !isDuong);
    for (let i = 0; i < 12; i++) boxes[fixChi(isThuan ? menh + i : menh - i)].daiHan = cucId + i * 10;

    // helper functions for placing stars
    const addMajor = (pos, star) => { if (star) boxes[pos].majorStars.push(getStarStatus(star, pos)); };
    const addGood = (pos, star) => { if (star) boxes[pos].goodStars.push(getStarStatus(star, pos)); };
    const addBad = (pos, star) => { if (star) boxes[pos].badStars.push(getStarStatus(star, pos)); };

    // place Tử Vi and Thiên Phủ rings
    let x = (cucId - (day % cucId)) % cucId;
    let p = Math.floor((day + x) / cucId);
    let tuViPos = fixChi(2 + p);
    if (x % 2 !== 0) tuViPos = fixChi(tuViPos - x);
    else tuViPos = fixChi(tuViPos + x);

    let thienPhuPos = fixChi(18 - tuViPos);
    // rings loaded from JSON seeds: tuviRing, phuRing

    for (let i = 0; i < 12; i++) {
        addMajor(fixChi(tuViPos - i), tuviRing[i]);
        addMajor(fixChi(thienPhuPos + i), phuRing[i]);
    }

    // remaining placements (kept structure identical to original for compatibility)
    const tsStart = { 2: 9, 3: 12, 4: 6, 5: 9, 6: 3 };
    for (let i = 0; i < 12; i++) boxes[fixChi(isThuan ? tsStart[cucId] + i : tsStart[cucId] - i)].trangSinh = tsArray[i];

    let locPos = locMap[canYearIndex];
    addGood(locPos, "Lộc Tồn"); addBad(fixChi(locPos + 1), "Kình Dương"); addBad(fixChi(locPos - 1), "Đà La");

    // bsArray loaded from JSON seed
    for (let i = 0; i < 12; i++) {
        let star = bsArray[i];
        let pos = fixChi(isThuan ? locPos + i : locPos - i);
        if (["Tiểu Hao", "Phi Liêm", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"].includes(star)) addBad(pos, star);
        else addGood(pos, star);
    }
    addGood(fixChi(locPos - 4), "Quốc Ấn");

    let thaiTuePos = chiYearIndex;
    const tueArray = ["Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù", "Tử Phù", "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"];
    for (let i = 0; i < 12; i++) {
        let pos = fixChi(thaiTuePos + i); let star = tueArray[i];
        if (["Tang Môn", "Tuế Phá", "Bạch Hổ", "Điếu Khách", "Trực Phù", "Thái Tuế", "Tử Phù"].includes(star)) addBad(pos, star);
        else addGood(pos, star);
    }

    let taPhu = fixChi(5 + anSaoMonth - 1); let huuBat = fixChi(11 - anSaoMonth + 1);
    addGood(taPhu, "Tả Phù"); addGood(huuBat, "Hữu Bật");

    let vanXuong = fixChi(11 - hour + 1); let vanKhuc = fixChi(5 + hour - 1);
    addGood(vanXuong, "Văn Xương"); addGood(vanKhuc, "Văn Khúc");

    let diaKhong = fixChi(12 - hour + 1); let diaKiep = fixChi(12 + hour - 1);
    addBad(diaKhong, "Địa Không"); addBad(diaKiep, "Địa Kiếp");

    addGood(khoiMap[canYearIndex], "Thiên Khôi"); addGood(vietMap[canYearIndex], "Thiên Việt");

    let hoaStart, linhStart;
    let isDanNgoTuat = [3, 7, 11].includes(chiYearIndex), isThanTiThin = [9, 1, 5].includes(chiYearIndex), isTyDauSuu = [6, 10, 2].includes(chiYearIndex), isHoiMaoMui = [12, 4, 8].includes(chiYearIndex);
    if (isDuong) {
        if (isDanNgoTuat) { hoaStart = 2; linhStart = 4; } else if (isThanTiThin) { hoaStart = 3; linhStart = 11; } else if (isTyDauSuu) { hoaStart = 4; linhStart = 11; } else { hoaStart = 10; linhStart = 11; }
    } else {
        if (isDanNgoTuat) { hoaStart = 2; linhStart = 4; } else if (isThanTiThin) { hoaStart = 3; linhStart = 11; } else if (isTyDauSuu) { hoaStart = 4; linhStart = 11; } else { hoaStart = 10; linhStart = 11; }
    }
    let ht = fixChi(hoaStart + hour - 1), lt = fixChi(linhStart - hour + 1);
    if (!isThuan) { lt = fixChi(linhStart + hour - 1); ht = fixChi(hoaStart - hour + 1); }
    addBad(ht, "Hỏa Tinh"); addBad(lt, "Linh Tinh");

    addGood(fixChi(5 + chiYearIndex - 1), "Long Trì"); addGood(fixChi(11 - chiYearIndex + 1), "Phượng Các");

    let daoHoa = isThanTiThin ? 10 : isHoiMaoMui ? 1 : isDanNgoTuat ? 4 : 7;
    let hongLoan = fixChi(4 - chiYearIndex + 1);
    addGood(daoHoa, "Đào Hoa"); addGood(hongLoan, "Hồng Loan"); addGood(fixChi(hongLoan + 6), "Thiên Hỷ");

    let isXuan = [3, 4, 5].includes(chiYearIndex), isHa = [6, 7, 8].includes(chiYearIndex), isThu = [9, 10, 11].includes(chiYearIndex), isDong = [12, 1, 2].includes(chiYearIndex);
    let coThan = isXuan ? 6 : isHa ? 9 : isThu ? 12 : 3;
    let quaTu = isXuan ? 2 : isHa ? 5 : isThu ? 8 : 11;
    addBad(coThan, "Cô Thần"); addBad(quaTu, "Quả Tú");

    addBad(fixChi(7 - chiYearIndex + 1), "Thiên Khốc");
    addBad(fixChi(7 + chiYearIndex - 1), "Thiên Hư");

    let thienMa = isDanNgoTuat ? 9 : isThanTiThin ? 3 : isTyDauSuu ? 12 : 6;
    addGood(thienMa, "Thiên Mã");
    addBad(fixChi(10 + anSaoMonth - 1), "Thiên Hình");
    addBad(fixChi(2 + anSaoMonth - 1), "Thiên Diêu");
    addGood(fixChi(2 + anSaoMonth - 1), "Thiên Y");

    addGood(fixChi(8 + anSaoMonth), "Thiên Giải");
    addGood(fixChi(7 + anSaoMonth), "Địa Giải");
    addGood(fixChi(11 - chiYearIndex + 1), "Giải Thần");

    addGood(fixChi(vanKhuc + 2), "Thai Phụ"); addGood(fixChi(vanKhuc - 2), "Phong Cáo");
    addGood(fixChi(vanXuong + day - 2), "Ân Quang");
    addGood(fixChi(vanKhuc - day + 2), "Thiên Quý");

    let hoaCai = isDanNgoTuat ? 11 : isThanTiThin ? 5 : isTyDauSuu ? 2 : 8;
    addGood(hoaCai, "Hoa Cái");

    addGood(fixChi(taPhu + day - 1), "Tam Thai");
    addGood(fixChi(huuBat - day + 1), "Bát Tọa");

    // Đường Phù: Lộc Tồn là cung 1, đếm nghịch đến cung thứ 8.
    addGood(fixChi(locPos - 7), "Đường Phù");

    const tTruMap = { 0: 6, 1: 7, 2: 1, 3: 6, 4: 7, 5: 9, 6: 3, 7: 7, 8: 10, 9: 11 };
    addGood(tTruMap[canYearIndex], "Thiên Trù");

    // Văn Tinh theo can năm. Nhâm mặc định Dần (dị bản Dậu: school.vanTinhNham = 'dau').
    const vTinhMap = { 0: 6, 1: 7, 2: 9, 3: 10, 4: 9, 5: 10, 6: 12, 7: 1, 8: 3, 9: 4 };
    if (school.vanTinhNham === 'dau') vTinhMap[8] = 10;
    addGood(vTinhMap[canYearIndex], "Văn Tinh");

    addBad(fixChi(thaiTuePos - anSaoMonth + hour), "Đẩu Quân");
    addBad(fixChi(menh + 5), "Thiên Thương"); addBad(fixChi(menh + 7), "Thiên Sứ");
    addBad(fixChi(thaiTuePos + 1), "Thiên Không"); addBad(5, "Thiên La"); addBad(11, "Địa Võng");

    addGood(fixChi(menh + chiYearIndex - 1), "Thiên Tài");
    addGood(fixChi(than + chiYearIndex - 1), "Thiên Thọ");

    const tQuanMap = { 0: 8, 1: 5, 2: 6, 3: 3, 4: 4, 5: 10, 6: 12, 7: 10, 8: 11, 9: 7 };
    const tPhucMap = { 0: 10, 1: 9, 2: 1, 3: 12, 4: 4, 5: 3, 6: 7, 7: 6, 8: 7, 9: 6 };
    addGood(tQuanMap[canYearIndex], "Thiên Quan");
    addGood(tPhucMap[canYearIndex], "Thiên Phúc");

    // Thiên Đức khởi Dậu năm Tí, Nguyệt Đức khởi Tị năm Tí, đếm thuận theo chi năm.
    addGood(fixChi(6 + chiYearIndex - 1), "Nguyệt Đức");
    addGood(fixChi(10 + chiYearIndex - 1), "Thiên Đức");

    const lHMap = { 0: 10, 1: 11, 2: 8, 3: 9, 4: 6, 5: 7, 6: 4, 7: 5, 8: 12, 9: 3 };
    addBad(lHMap[canYearIndex], "Lưu Hà");

    let kiepSat = isDanNgoTuat ? 12 : isThanTiThin ? 6 : isTyDauSuu ? 3 : 9;
    addBad(kiepSat, "Kiếp Sát");
    const isTuChinh = [1, 7, 4, 10].includes(chiYearIndex);
    const isTuSinh = [3, 9, 6, 12].includes(chiYearIndex);
    addBad(isTuChinh ? 6 : isTuSinh ? 10 : 2, "Phá Toái");

    // Tứ Hóa sau khi đã an Xương, Khúc, Tả, Hữu và các phụ tinh khác.
    let tuHoaList = tuHoaMap[canYearIndex];
    let hoaNames = ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ"];
    for (let i = 1; i <= 12; i++) {
        tuHoaList.forEach((st, idx) => {
            if (palaceHasStar(boxes[i], st)) {
                if (idx === 3) addBad(i, hoaNames[idx]); else addGood(i, hoaNames[idx]);
            }
        });
    }

    let chiStartGiap = fixChi(chiYearIndex - canYearIndex);
    boxes[fixChi(chiStartGiap - 1)].isTuan = true; boxes[fixChi(chiStartGiap - 2)].isTuan = true;

    const trietMap = { 0: [9, 10], 5: [9, 10], 1: [7, 8], 6: [7, 8], 2: [5, 6], 7: [5, 6], 3: [3, 4], 8: [3, 4], 4: [1, 2], 9: [1, 2] };
    if (trietMap[canYearIndex]) { boxes[trietMap[canYearIndex][0]].isTriet = true; boxes[trietMap[canYearIndex][1]].isTriet = true; }

    const chuMenhArr = { 1: "Tham Lang", 2: "Cự Môn", 3: "Lộc Tồn", 4: "Văn Khúc", 5: "Liêm Trinh", 6: "Vũ Khúc", 7: "Phá Quân", 8: "Vũ Khúc", 9: "Liêm Trinh", 10: "Văn Khúc", 11: "Lộc Tồn", 12: "Cự Môn" };
    const chuThanArr = { 1: "Hỏa Tinh", 2: "Thiên Tướng", 3: "Thiên Lương", 4: "Thiên Đồng", 5: "Văn Xương", 6: "Thiên Cơ", 7: "Linh Tinh", 8: "Thiên Tướng", 9: "Thiên Lương", 10: "Thiên Đồng", 11: "Văn Xương", 12: "Thiên Cơ" };
    const chuMenhKey = school.chuMenhBy === 'menhChi' ? menh : chiYearIndex;

    return {
        menh, than, cucInfo: CUC_SO_MAP[cucId], boxes, nguHanhBanMenh, textAmDuong, thuanLy, cucKhacMenh,
        chuMenh: chuMenhArr[chuMenhKey], chuThan: chuThanArr[chiYearIndex],
        anSaoMonth, isLeapMonth: Boolean(isLeapMonth), schoolId: school.id
    };
}
