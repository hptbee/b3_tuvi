import express from 'express';
import { solarToLunar } from '../engine/lunar.js';
import { calculateTuVi } from '../engine/tuviRules.mjs';
import { validateChartInput } from '../engine/chartInput.js';
import { normalizeChart } from '../engine/normalizeChart.js';
import { insertHoroscope } from '../db/repositories.js';

const router = express.Router();

/**
 * POST /api/charts/generate
 * Thực hiện tính toán lá số và lưu vào collection 'horoscopes'.
 */
router.post('/generate', async (req, res) => {
    const parsed = validateChartInput(req.body);
    if (!parsed.ok) {
        return res.status(400).json({ error: 'Dữ liệu lập lá số không hợp lệ', details: parsed.errors });
    }

    try {
        const { name, day, month, year, hour, gender } = parsed.value;

        const ld = solarToLunar(day, month, year);
        if (!ld.lunarDay || !ld.lunarMonth || !ld.lunarYear) {
            return res.status(400).json({ error: 'Không đổi được ngày dương sang âm lịch' });
        }

        // Tí: 23h–1h (giờ 0), Sửu: 1h–3h, ...
        let canhGio = Math.floor((hour + 1) / 2) + 1;
        if (canhGio > 12) canhGio = 1;

        const tvInfo = calculateTuVi(
            ld.canIndex,
            ld.chiIndex,
            ld.lunarDay,
            ld.lunarMonth,
            canhGio,
            gender,
            ld.isLeapMonth
        );

        const normalized = normalizeChart({
            tuviInfo: tvInfo,
            lunarInfo: ld,
            input: { name, day, month, year, hour, gender }
        });
        const chartData = {
            lunarInfo: ld,
            tuviInfo: tvInfo,
            normalizedChart: normalized.ok ? normalized : null
        };

        insertHoroscope({
            input_data: { name, day, month, year, hour, gender },
            lunar_data: {
                lunarDay: ld.lunarDay,
                lunarMonth: ld.lunarMonth,
                lunarYear: ld.lunarYear,
                canIndex: ld.canIndex,
                chiIndex: ld.chiIndex,
                isLeap: Boolean(ld.isLeapMonth),
                anSaoMonth: tvInfo.anSaoMonth
            },
            full_chart: tvInfo
        });

        return res.json(chartData);

    } catch (error) {
        console.error("Tuvi Calculation Error:", error);
        res.status(500).json({ error: 'Lỗi tính toán và lưu lá số' });
    }
});

export default router;
