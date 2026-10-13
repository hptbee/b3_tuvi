import { contentStore } from './content.js';

export const PROFILE = Object.freeze({
    id: 'pythagorean-vn-v1',
    version: '1.1.0',
    status: 'experimental',
    sourceStatus: 'product_specification_only',
    locale: 'vi-VN',
    lifePathMethod: 'all-date-digits',
    masterNumbers: Object.freeze([11, 22, 33]),
    namePolicy: 'latin-vn-nfd-v1',
    yPolicy: 'consonant',
    vowels: 'AEIOU',
    cyclePolicy: 'calendar-year-v1',
    birthGridPolicy: 'ddmmyyyy-zero-excluded-v1'
});

export function publicProfile() {
    const { vowels, ...metadata } = PROFILE;
    return { ...metadata, capabilities: { core: 'available', birthGrid: 'available', cycles: 'available', pinnacles: 'not_implemented', meanings: contentStore.contentVersion ? 'experimental_available' : 'withheld' } };
}
