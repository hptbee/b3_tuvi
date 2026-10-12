import express from 'express';
import { findPalaceByName, findStarByName } from '../db/repositories.js';
import { logSafeError } from '../http/safeErrorLog.js';

const router = express.Router();

/**
 * GET /api/meanings/star/:name?palace=MenhPalaceName
 * Tra cứu ý nghĩa của một ngôi sao tại một cung cụ thể.
 */
router.get('/star/:name', async (req, res) => {
    try {
        const cleanName = decodeURIComponent(req.params.name)
            .replace(/\s*\([a-zA-ZĐđ]\)/g, '').trim();
        const cungName = req.query.palace || '';

        const doc = findStarByName(cleanName);
        if (!doc) {
            return res.json({ text: `Chưa có dữ liệu hồ sơ cho sao ${cleanName}.` });
        }

        // Chuẩn hóa tên cung để tra cứu trong Map
        let mainCung = cungName.includes('/') ? cungName.split('/')[0].trim() : cungName;
        // Chuyển về Capitalize (Ví dụ: "mệnh" -> "Mệnh", "PHỤ MẪU" -> "Phụ mẫu")
        mainCung = mainCung.charAt(0).toUpperCase() + mainCung.slice(1).toLowerCase();
        
        // Đặc biệt cho Phụ mẫu, Phúc đức... (có dấu cách)
        // Lưu ý: Dữ liệu seed dùng: "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc", "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"
        const palaceMapping = {
            'Phụ mẫu': 'Phụ Mẫu',
            'Phúc đức': 'Phúc Đức',
            'Điền trạch': 'Điền Trạch',
            'Quan lộc': 'Quan Lộc',
            'Nô bộc': 'Nô Bộc',
            'Thiên di': 'Thiên Di',
            'Tật ách': 'Tật Ách',
            'Tài bạch': 'Tài Bạch',
            'Tử tức': 'Tử Tức',
            'Phu thê': 'Phu Thê',
            'Huynh đệ': 'Huynh Đệ'
        };
        const searchKey = palaceMapping[mainCung] || mainCung;

        const palaceMeanings = doc.palace_meanings || {};
        const specific = palaceMeanings[searchKey];

        if (specific) {
            return res.json({ text: specific });
        }

        const fallback = palaceMeanings.default || doc.basic_meaning;
        if (fallback) {
            return res.json({ text: `Tại cung ${cungName}: ${fallback}` });
        }

        return res.json({ text: `Hiện chưa có giải nghĩa chi tiết cho sao ${cleanName} tại cung ${cungName}.` });
    } catch (error) {
        logSafeError('Meaning Fetch Error (Star)', error);
        res.status(500).json({ error: 'Lỗi tra cứu dữ liệu sao' });
    }
});

/**
 * GET /api/meanings/palace/:name
 * Tra cứu ý nghĩa cốt lõi của cung chức năng.
 */
router.get('/palace/:name', async (req, res) => {
    try {
        const cungName = decodeURIComponent(req.params.name);
        // Hỗ trợ cung kép (ví dụ: "Mệnh / Thân")
        const parts = cungName.split('/').map(c => c.trim().toUpperCase());

        const results = [];
        for (const part of parts) {
            const doc = findPalaceByName(part);
            if (doc) {
                results.push({
                    title: doc.short_name || part,
                    desc: doc.core_meaning || 'Chưa có thông tin.'
                });
            }
        }

        if (results.length === 0) {
            return res.json([{ title: cungName, desc: 'Chưa có thông tin luận giải.' }]);
        }
        return res.json(results);
    } catch (error) {
        logSafeError('Meaning Fetch Error (Palace)', error);
        res.status(500).json({ error: 'Lỗi tra cứu dữ liệu cung' });
    }
});

export default router;
