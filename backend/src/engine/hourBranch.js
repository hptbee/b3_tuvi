/**
 * Canh giờ 1–12 dùng chung cho lập lá số và phân tích.
 * Tí là 23h–1h: giờ 23 và giờ 0 đều ra 1.
 */
export function hourBranchIndex(hour) {
    let index = Math.floor((Number(hour) + 1) / 2) + 1;
    if (index > 12) index = 1;
    return index;
}
