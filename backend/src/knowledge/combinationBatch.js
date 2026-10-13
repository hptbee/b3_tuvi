import { createHash } from 'crypto';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { validateDecisionRecord } from './decisionRegistry.js';

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
        if (!checked.ok || decision.sourceDigest !== passage.sourceDigest || decision.expertVerified !== false) {
            return row(passage, { batchStatus: 'UNRESOLVED' });
        }
        return row(passage, {
            batchStatus: decision.decision,
            formulaComparison: decision.formulaComparison || null,
            crossReviewOutcome: decision.crossReviewOutcome || null
        });
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
    const decisions = readdirSync(`${KNOWLEDGE}decisions`)
        .filter((name) => name.endsWith('.json'))
        .map((name) => JSON.parse(readFileSync(`${KNOWLEDGE}decisions/${name}`, 'utf8')));
    return {
        catalog,
        passages,
        decisions,
        rows: buildCombinationBatch({ catalog, passages, decisions })
    };
}
