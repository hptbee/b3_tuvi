// Keep parser and routing failures out of Express's HTML/stack-trace fallback.
export function apiErrorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);
    let status = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Chưa xử lý được yêu cầu. Vui lòng thử lại.';
    if (error?.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON không hợp lệ' });
    } else if (error?.status === 413 || error?.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Dữ liệu gửi lên quá lớn' });
    } else if (error?.type === 'charset.unsupported') {
        status = 415; code = 'UNSUPPORTED_CHARSET'; message = 'Bảng mã dữ liệu không được hỗ trợ.';
    } else if (error?.type === 'encoding.unsupported') {
        status = 415; code = 'UNSUPPORTED_ENCODING'; message = 'Kiểu mã hóa dữ liệu không được hỗ trợ.';
    } else if (error instanceof URIError && error.status === 400) {
        status = 400; code = 'INVALID_PATH'; message = 'Đường dẫn không hợp lệ.';
    } else if (error?.status === 400 && error.expose === true) {
        status = 400; code = 'INVALID_BODY'; message = 'Dữ liệu gửi lên không hợp lệ.';
    } else {
        // Error messages/stacks can contain request data; log only a constant.
        console.error('API request failed');
    }
    return res.status(status).json({ error: message, code });
}
