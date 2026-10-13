import catalogData from './data/catalog.vi.json' with { type: 'json' };
import sourceData from './data/sources.json' with { type: 'json' };

export const CONTENT_METRICS = ['lifePath', 'birthday', 'attitude', 'expression', 'soulUrge', 'personality', 'maturity', 'personalYear', 'personalMonth', 'personalDay'];
export function supportedMeaningValue(metricId, value) {
    return CONTENT_METRICS.includes(metricId) && Number.isInteger(value)
        && ((value >= 1 && value <= 9) || (![ 'attitude', 'personalYear', 'personalMonth', 'personalDay'].includes(metricId) && [11, 22, ...(metricId === 'birthday' ? [] : [33])].includes(value)));
}
const requireValid = condition => { if (!condition) throw new TypeError('Invalid numerology content catalog'); };
const text = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 1500;
const shape = (object, keys) => object !== null && typeof object === 'object' && !Array.isArray(object)
    && Object.keys(object).length === keys.length && keys.every(key => Object.hasOwn(object, key));
const strings = value => Array.isArray(value) && value.length > 0 && value.length <= 12 && value.every(text);

export function createContentStore(catalogInput, sourceInput) {
    const catalog = structuredClone(catalogInput), manifest = structuredClone(sourceInput);
    requireValid(shape(catalog, ['version', 'locale', 'profileId', 'compatibleProfileVersions', 'review', 'themes', 'contexts']));
    requireValid(/^\d+\.\d+\.\d+$/.test(catalog.version) && catalog.locale === 'vi-VN' && catalog.profileId === 'pythagorean-vn-v1' && strings(catalog.compatibleProfileVersions));
    requireValid(shape(catalog.review, ['status', 'approvedForPublic', 'reviewerRole', 'evidenceId']));
    requireValid(['pending', 'editorial_reviewed'].includes(catalog.review.status) && typeof catalog.review.approvedForPublic === 'boolean');
    requireValid(!catalog.review.approvedForPublic || (catalog.review.status === 'editorial_reviewed' && catalog.review.reviewerRole === 'independent_editorial_reviewer' && text(catalog.review.evidenceId)));
    requireValid(shape(manifest, ['version', 'sources']) && text(manifest.version) && Array.isArray(manifest.sources) && manifest.sources.length > 0 && manifest.sources.length <= 12);
    const sources = new Map();
    for (const source of manifest.sources) {
        requireValid(shape(source, ['id', 'title', 'authors', 'evidenceClass', 'status', 'locator', 'revision', 'fingerprint', 'license', 'supportedValues', 'relationship', 'expertVerified', 'bookVerified']));
        requireValid(text(source.id) && !sources.has(source.id) && text(source.title) && strings(source.authors) && text(source.license));
        requireValid(source.evidenceClass === 'community_reference' && ['reference_checked', 'unreviewed'].includes(source.status) && source.relationship === 'general_number_theme');
        requireValid(source.expertVerified === false && source.bookVerified === false && /^[a-f0-9]{40}$/.test(source.revision) && /^sha256:[a-f0-9]{64}$/.test(source.fingerprint));
        const locator = new URL(source.locator);
        requireValid(locator.protocol === 'https:' && locator.hostname === 'github.com' && !locator.username && !locator.password && !locator.search && !locator.hash && locator.pathname.includes(`/blob/${source.revision}/`));
        requireValid(Array.isArray(source.supportedValues) && source.supportedValues.length > 0 && source.supportedValues.length <= 12 && new Set(source.supportedValues).size === source.supportedValues.length && source.supportedValues.every(value => [1,2,3,4,5,6,7,8,9,11,22,33].includes(value)));
        sources.set(source.id, source);
    }
    requireValid(catalog.themes !== null && typeof catalog.themes === 'object' && !Array.isArray(catalog.themes) && Object.keys(catalog.themes).length > 0 && Object.keys(catalog.themes).length <= 12);
    for (const [value, theme] of Object.entries(catalog.themes)) {
        requireValid(/^(?:[1-9]|11|22|33)$/.test(value) && shape(theme, ['title', 'body', 'prompt', 'sourceId', 'sourceSection']));
        requireValid([theme.title, theme.body, theme.prompt].every(text) && theme.sourceSection === `destiny.${value}` && sources.get(theme.sourceId)?.supportedValues.includes(Number(value)));
    }
    requireValid(catalog.contexts !== null && typeof catalog.contexts === 'object' && !Array.isArray(catalog.contexts) && Object.keys(catalog.contexts).length > 0 && Object.keys(catalog.contexts).length <= CONTENT_METRICS.length);
    const entries = new Map();
    for (const [metricId, context] of Object.entries(catalog.contexts)) {
        requireValid(CONTENT_METRICS.includes(metricId) && shape(context, ['label', 'opening', 'application', 'prompt', 'values']) && [context.label, context.opening, context.application, context.prompt].every(text));
        requireValid(Array.isArray(context.values) && context.values.length > 0 && context.values.length <= 12 && new Set(context.values).size === context.values.length);
        for (const value of context.values) {
            requireValid(supportedMeaningValue(metricId, value) && catalog.themes[value]);
            const theme = catalog.themes[value], source = sources.get(theme.sourceId);
            entries.set(`${metricId}/${value}`, {
                contentId: `${metricId}-${value}-vi-v1`, metricId, value, kind: 'original_editorial',
                title: `${context.label} ${value} · ${theme.title}`, summary: `${context.opening} ${theme.body}`,
                reflectionPrompts: [context.prompt, theme.prompt], limitations: [context.application, 'Góc nhìn biểu tượng để suy ngẫm; không phải kết luận khoa học hoặc dự báo.'],
                sourceReferences: [{ id: source.id, title: source.title, url: source.locator, evidenceClass: source.evidenceClass, relationship: source.relationship, section: theme.sourceSection }],
                reviewStatus: 'editorial_reviewed', evidenceStatus: 'community_reference', expertVerified: false
            });
        }
    }
    const reviewed = catalog.review.status === 'editorial_reviewed' && catalog.review.approvedForPublic && [...sources.values()].every(source => source.status === 'reference_checked');
    const publishedVersion = reviewed ? catalog.version : null;
    return {
        contentVersion: publishedVersion,
        getMeaning(metricId, value, { profileId = catalog.profileId, profileVersion = '1.1.0', locale = catalog.locale } = {}) {
            const compatible = profileId === catalog.profileId && catalog.compatibleProfileVersions.includes(profileVersion) && locale === catalog.locale;
            const entry = entries.get(`${metricId}/${value}`);
            if (!reviewed || !compatible || !entry) return { meaning: null, meaningStatus: 'withheld', meaningReason: !compatible ? 'profile_mismatch' : !reviewed ? 'content_unreviewed' : 'source_unavailable' };
            return { meaning: structuredClone(entry), meaningStatus: 'experimental_editorial' };
        }
    };
}

export const contentStore = createContentStore(catalogData, sourceData);
