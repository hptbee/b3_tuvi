import { createHash } from 'crypto';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { validateDecisionRecord } from './decisionRegistry.js';
import { verifyDecisionBinding } from './decisionIntegrity.js';
import { reviewBaseline } from './extractionBaseline.js';

const KNOWLEDGE = fileURLToPath(new URL('../../../docs/knowledge/', import.meta.url));

export function digestOf(span) {
    return createHash('sha256').update(span).digest('hex');
}

function row(passage, fields) {
    return {
        combinationName: passage.combinationName,
        schoolId: passage.schoolId,
        expertVerified: false,
        formulaCheckedAgainstSource: false,
        runtimeRuleChangeApplied: false,
        locator: passage.locator || null,
        sourceDigest: passage.sourceDigest || null,
        formulaComparison: null,
        ...fields,
        expertVerified: false
    };
}

export function buildCombinationBatch({ catalog, passages, decisions }) {
    const byName = new Map((passages || []).map((passage) => [passage.combinationName, passage]));
    const byClaim = new Map((decisions || []).map((decision) => [decision.subjectId, decision]));
    return (catalog || []).map((item) => {
        const passage = byName.get(item.name);
        if (!passage || passage.located !== true) {
            return row(passage || { combinationName: item.name, schoolId: 'vn-tam-hop-default' }, {
                batchStatus: 'PASSAGE_NOT_LOCATED'
            });
        }
        const decision = byClaim.get(passage.claimId);
        if (!decision) {
            return row(passage, { batchStatus: 'REVIEW_NOT_EXECUTED' });
        }
        const checked = validateDecisionRecord(decision);
        if (!checked.ok || decision.sourceDigest !== passage.sourceDigest || decision.expertVerified !== false || decision.bindingOk !== true) {
            return row(passage, { batchStatus: 'UNRESOLVED' });
        }
        return row(passage, {
            batchStatus: decision.decision,
            formulaComparison: decision.formulaComparison || null,
            crossReviewOutcome: decision.crossReviewOutcome || null
        });
    });
}

const NGUYET_ANCHORS = [
    'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ',
    'xa lánh Tuần',
    'Sát tinh và Bại tinh',
    'Khoa, Quyền, Lộc'
];

function reviewFromRef(ref) {
    if (typeof ref !== 'string' || !ref.startsWith('docs/knowledge/reviews/') || ref.includes('..')) return null;
    try {
        return JSON.parse(readFileSync(`${KNOWLEDGE}${ref.slice('docs/knowledge/'.length)}`, 'utf8'));
    } catch {
        return null;
    }
}

export function bindStoredDecision(record, passage) {
    const refs = (record.reviewers || []).map((reviewer) => reviewer?.reviewRef);
    const reviews = refs.map(reviewFromRef);
    if (reviews.some((review) => !review) || typeof passage.span !== 'string') {
        return { ok: false, reason: 'binding_evidence_missing' };
    }
    const slug = passage.spanFile.split('/').at(-2);
    let prompt = '';
    try {
        prompt = readFileSync(`${KNOWLEDGE}reviews/${slug}/prompt-v1.txt`, 'utf8');
    } catch {
        return { ok: false, reason: 'binding_evidence_missing' };
    }
    return verifyDecisionBinding({
        record,
        reviews,
        storedSpan: passage.span,
        baseline: reviewBaseline({
            span: passage.span,
            prompt,
            editionId: passage.editionId,
            schoolId: passage.schoolId,
            locator: passage.locator,
            sourceDigest: passage.sourceDigest,
            fallbackAnchors: NGUYET_ANCHORS
        })
    });
}

function readSpan(root, spanFile) {
    const text = readFileSync(`${root}${spanFile.replace('docs/knowledge/', '')}`, 'utf8').replace(/\n$/, '');
    return text;
}

export function loadCombinationBatch() {
    const catalog = JSON.parse(readFileSync(fileURLToPath(new URL('../data/combinations.json', import.meta.url)), 'utf8'));
    const manifest = JSON.parse(readFileSync(`${KNOWLEDGE}combination-passages.json`, 'utf8'));
    const passages = manifest.entries.map((entry) => {
        if (entry.located !== true) return entry;
        const span = readSpan(KNOWLEDGE, entry.spanFile);
        return { ...entry, sourceDigest: digestOf(span), span };
    });
    const byClaimPassage = new Map(passages.filter((passage) => passage.located === true).map((passage) => [passage.claimId, passage]));
    const decisions = readdirSync(`${KNOWLEDGE}decisions`)
        .filter((name) => name.endsWith('.json'))
        .map((name) => {
            const record = JSON.parse(readFileSync(`${KNOWLEDGE}decisions/${name}`, 'utf8'));
            const passage = byClaimPassage.get(record.subjectId);
            return { ...record, bindingOk: passage ? bindStoredDecision(record, passage).ok === true : false };
        });
    return {
        catalog,
        passages,
        decisions,
        rows: buildCombinationBatch({ catalog, passages, decisions })
    };
}
