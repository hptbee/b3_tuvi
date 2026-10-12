export function requestLogLine(req) {
    const rawUrl = typeof req?.url === 'string' ? req.url : '';
    const pathOnly = typeof req?.path === 'string' && req.path.length > 0
        ? req.path
        : rawUrl.split('?')[0];
    return `${req?.method || ''} ${pathOnly}`;
}
