export const PROFILE = Object.freeze({
    id: 'pythagorean-vn-v1',
    version: '1.0.0',
    status: 'experimental',
    sourceStatus: 'product_specification_only',
    locale: 'vi-VN',
    lifePathMethod: 'all-date-digits',
    masterNumbers: Object.freeze([11, 22, 33]),
    namePolicy: 'latin-vn-nfd-v1',
    yPolicy: 'consonant',
    vowels: 'AEIOU'
});

export function publicProfile() {
    const { vowels, ...metadata } = PROFILE;
    return { ...metadata, capabilities: { core: 'available', birthGrid: 'not_implemented', cycles: 'not_implemented', pinnacles: 'not_implemented' } };
}
