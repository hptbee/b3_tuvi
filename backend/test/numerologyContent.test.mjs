import assert from 'node:assert/strict';
import catalog from '../src/numerology/data/catalog.vi.json' with { type: 'json' };
import sources from '../src/numerology/data/sources.json' with { type: 'json' };
import { CONTENT_METRICS, createContentStore, supportedMeaningValue } from '../src/numerology/content.js';

const approved = structuredClone(catalog);
approved.review = { status: 'editorial_reviewed', approvedForPublic: true, reviewerRole: 'independent_editorial_reviewer', evidenceId: 'test-only-fixture-approval' };
const store = createContentStore(approved, sources);
assert.equal(store.contentVersion, '1.1.0');
let published = 0;
for (const metricId of CONTENT_METRICS) for (const value of [1,2,3,4,5,6,7,8,9,11,22,33]) {
    const result = store.getMeaning(metricId, value);
    if (supportedMeaningValue(metricId, value) && value !== 33) {
        published++;
        assert.equal(result.meaningStatus, 'experimental_editorial');
        assert.equal(result.meaning.metricId, metricId);
        assert.equal(result.meaning.value, value);
        assert.equal(result.meaning.kind, 'original_editorial');
        assert.equal(result.meaning.expertVerified, false);
        assert.equal(result.meaning.evidenceStatus, 'community_reference');
        assert.ok(result.meaning.summary.length > 100);
        assert.equal(result.meaning.reflectionPrompts.length, 2);
        assert.equal(result.meaning.sourceReferences[0].relationship, 'general_number_theme');
        assert.ok(result.meaning.sourceReferences[0].url.includes('c0535c9c9e7bcdc340b7eed255f89f64146dd8d5'));
    } else assert.equal(result.meaning, null);
}
assert.equal(published, 102);
assert.equal(store.getMeaning('lifePath', 33).meaningReason, 'source_unavailable');
assert.equal(store.getMeaning('lifePath', 33).meaning, null); // Never replace master33 by root6 text.
assert.notEqual(store.getMeaning('lifePath', 4).meaning.summary, store.getMeaning('soulUrge', 4).meaning.summary);
assert.ok(store.getMeaning('lifePath', 4).meaning.summary.includes('nhiều năm'));
assert.ok(store.getMeaning('personalDay', 4).meaning.summary.includes('một ngày'));
assert.ok(store.getMeaning('lifePath', 11).meaning.summary.includes('không luận bằng gốc 2'));
assert.equal(store.getMeaning('lifePath', 4).meaning.contentId, 'lifePath-4-vi-v2');
const risky = /(bạn sẽ|chắc chắn|định mệnh|chẩn đoán|sự nghiệp|kết hôn|giàu có)/iu;
for (const metricId of CONTENT_METRICS) for (const value of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22]) {
    const meaning = store.getMeaning(metricId, value).meaning;
    if (!meaning) continue;
    assert.equal(risky.test(meaning.summary), false, `${metricId}/${value}`);
}
assert.notDeepEqual(store.getMeaning('personalYear', 4).meaning.reflectionPrompts, store.getMeaning('personalDay', 4).meaning.reflectionPrompts);
for (const selector of [{ profileVersion: '1.0.0' }, { profileId: 'fake' }, { locale: 'en-US' }]) {
    assert.equal(store.getMeaning('lifePath', 4, selector).meaning, null);
    assert.equal(store.getMeaning('lifePath', 4, selector).meaningReason, 'profile_mismatch');
}
const draft = structuredClone(approved); draft.review = { status: 'pending', approvedForPublic: false, reviewerRole: null, evidenceId: null };
assert.equal(createContentStore(draft, sources).contentVersion, null);
assert.equal(createContentStore(draft, sources).getMeaning('lifePath', 4).meaningReason, 'content_unreviewed');
const notPublished = structuredClone(approved); notPublished.review.approvedForPublic = false;
assert.equal(createContentStore(notPublished, sources).getMeaning('lifePath', 4).meaning, null);
const unreviewedSources = structuredClone(sources); unreviewedSources.sources[0].status = 'unreviewed';
assert.equal(createContentStore(approved, unreviewedSources).contentVersion, null);
for (const corrupt of [
    item => { item.version = ''; }, item => { item.themes['4'].body = ''; },
    item => { item.contexts.lifePath.values = [4,4]; }, item => { item.contexts.attitude.values = [11]; },
    item => { item.contexts.unknown = item.contexts.lifePath; }, item => { item.themes['4'].sourceId = 'invented-book'; },
    item => { item.themes['4'].sourceSection = 'destiny.33'; }, item => { item.themes['33'] = item.themes['4']; },
    item => { item.review.status = 'pending'; }, item => { item.review.reviewerRole = 'author'; },
    item => { item.review.evidenceId = null; }, item => { item.approved = true; }
]) {
    const invalid = structuredClone(approved); corrupt(invalid);
    assert.throws(() => createContentStore(invalid, sources), TypeError);
}
for (const corrupt of [
    item => { item.sources[0].expertVerified = true; }, item => { item.sources[0].bookVerified = true; },
    item => { item.sources[0].locator = 'javascript:alert(1)'; }, item => { item.sources[0].revision = 'not-pinned'; },
    item => { item.sources[0].fingerprint = 'sha256:invented'; }, item => { item.sources[0].supportedValues = [1,2,3]; },
    item => { item.sources.push(item.sources[0]); }, item => { item.sources[0].authenticated = true; }
]) {
    const invalid = structuredClone(sources); corrupt(invalid);
    assert.throws(() => createContentStore(approved, invalid), TypeError);
}
const copy = store.getMeaning('lifePath', 4); copy.meaning.sourceReferences[0].url = 'changed'; copy.meaning.reflectionPrompts.length = 0;
assert.ok(store.getMeaning('lifePath', 4).meaning.sourceReferences[0].url.startsWith('https://github.com/'));
assert.equal(store.getMeaning('lifePath', 4).meaning.reflectionPrompts.length, 2);
approved.themes['4'].body = 'changed after creating store';
assert.ok(!store.getMeaning('lifePath', 4).meaning.summary.includes('changed after creating store'));
console.log('numerology content: 102 distinct-context original editorial entries, draft/source/version gates, immutable DTOs and no master33 fallback passed');
