export function safeErrorFields(error) {
    const message = typeof error?.message === 'string' ? error.message : 'unknown';
    return {
        name: typeof error?.name === 'string' ? error.name : 'Error',
        message: message.slice(0, 240)
    };
}

export function logSafeError(scope, error) {
    const fields = safeErrorFields(error);
    console.error(scope, fields.name, fields.message);
}
