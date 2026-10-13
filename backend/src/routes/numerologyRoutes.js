import express from 'express';
import { calculateNumerology } from '../numerology/calculate.js';
import { NumerologyInputError } from '../numerology/input.js';
import { PROFILE, publicProfile } from '../numerology/profile.js';
import { contentStore, supportedMeaningValue } from '../numerology/content.js';

export function numerologyNoStore(req, res, next) {
    res.set('Cache-Control', 'no-store');
    next();
}
export function currentVietnamDate() {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date()).map(part => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
}
const router = express.Router();
router.get('/profiles', (req, res) => res.json({ ok: true, profiles: [publicProfile()] }));
router.get('/meanings/:metricId/:value', (req, res, next) => {
    try {
        const { metricId, value: rawValue } = req.params;
        const value = Number(rawValue);
        if (!/^(?:[1-9]|11|22|33)$/.test(rawValue) || !supportedMeaningValue(metricId, value)) {
            throw new NumerologyInputError('MEANING_NOT_FOUND', 'Chỉ số hoặc giá trị chưa được hỗ trợ.');
        }
        for (const key of Object.keys(req.query)) if (!['profileId', 'profileVersion', 'locale'].includes(key)) {
            throw new NumerologyInputError('UNKNOWN_FIELD', 'Tham số không được hỗ trợ.', key);
        }
        for (const [key, expected] of [['profileId', PROFILE.id], ['profileVersion', PROFILE.version], ['locale', PROFILE.locale]]) {
            if (req.query[key] !== undefined && req.query[key] !== expected) throw new NumerologyInputError(key === 'locale' ? 'UNSUPPORTED_LOCALE' : 'PROFILE_NOT_FOUND', 'Phương pháp, phiên bản hoặc ngôn ngữ chưa được hỗ trợ.', key);
        }
        res.json({ ok: true, metricId, value, profile: publicProfile(), contentVersion: contentStore.contentVersion, ...contentStore.getMeaning(metricId, value) });
    } catch (error) { next(error); }
});
router.post('/calculate', (req, res, next) => {
    try {
        res.json(calculateNumerology(req.body, currentVietnamDate()));
    } catch (error) {
        next(error);
    }
});

export function numerologyErrorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);
    let status = 500;
    let code = 'CALCULATION_FAILED';
    let message = 'Chưa tính được chỉ số. Vui lòng thử lại.';
    let fields = [];
    if (error instanceof NumerologyInputError) {
        status = ['PROFILE_NOT_FOUND', 'MEANING_NOT_FOUND'].includes(error.code) ? 404 : 400;
        ({ code, message, fields } = error);
    } else if (error.type === 'entity.too.large' || error.status === 413) {
        status = 413; code = 'PAYLOAD_TOO_LARGE'; message = 'Dữ liệu gửi lên quá lớn.';
    } else if (error.type === 'entity.parse.failed') {
        status = 400; code = 'INVALID_JSON'; message = 'JSON không hợp lệ.';
    } else if (error.type === 'charset.unsupported') {
        status = 415; code = 'UNSUPPORTED_CHARSET'; message = 'Bảng mã dữ liệu không được hỗ trợ.';
    } else if (error.type === 'encoding.unsupported') {
        status = 415; code = 'UNSUPPORTED_ENCODING'; message = 'Kiểu mã hóa dữ liệu không được hỗ trợ.';
    } else if (req.body === undefined && error.status === 400 && error.expose === true
        && (['Z_DATA_ERROR', 'Z_BUF_ERROR', 'Z_NEED_DICT'].includes(error.code) || /^ERR__ERROR_FORMAT_[A-Z0-9_]+$/.test(error.code))
        && ['gzip', 'deflate', 'br'].includes((req.get('content-encoding') || '').toLowerCase())) {
        // body-parser wraps invalid or dictionary-dependent streams as exposed 400 decoder errors.
        status = 400; code = 'INVALID_BODY_ENCODING'; message = 'Dữ liệu nén không hợp lệ.';
    } else {
        // No message, stack, input, birth date or name in logs.
        console.error('Numerology calculation failed');
    }
    res.status(status).json({ ok: false, error: { code, message, fields } });
}
export default router;
