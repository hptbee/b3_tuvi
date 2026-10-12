import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { applyKnowledgePrototype } from '../src/db/knowledgePrototype.js';
import { createKnowledgeReader } from '../src/knowledge/knowledgeQuery.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tuvi-kb-query-'));
const dbPath = path.join(dir, 'prototype.sqlite');
applyKnowledgePrototype(dbPath);

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON');
db.prepare(`INSERT INTO kb_prototype_meta (key, value) VALUES ('usage', 'synthetic_test_fixture')`).run();
db.prepare(`INSERT INTO sources (source_id, title, bibliographic_status) VALUES ('src', 'synthetic', 'secondary')`).run();
db.prepare(`
    INSERT INTO claims (claim_id, school_id, body_json, implementation_status, formula_status, bibliographic_status, interpretation_status)
    VALUES
    ('b-claim', 'vn-tam-hop-default', '{"relatedStars":["tu_vi"],"relatedPalaces":["menh"]}', 'untested', 'undocumented', 'secondary', 'unreviewed'),
    ('a-claim', 'vn-tam-hop-default', '{"relatedStars":["tu_vi"],"relatedPalaces":["tai_bach"]}', 'tested', 'undocumented', 'secondary', 'unreviewed'),
    ('bare-claim', 'other-school', '{}', 'untested', 'undocumented', 'secondary', 'unreviewed')
`).run();
db.prepare(`INSERT INTO combination_claims (combination_name, claim_id) VALUES ('Phủ Tướng Triều Viên', 'b-claim')`).run();
db.prepare(`INSERT INTO combination_claims (combination_name, claim_id) VALUES ('Phủ Tướng Triều Viên', 'a-claim')`).run();
db.prepare(`
    INSERT INTO claim_sources (claim_id, source_id, edition_id, support_type)
    VALUES ('a-claim', 'src', NULL, 'paraphrase')
`).run();
db.prepare(`
    INSERT INTO claim_links (from_claim_id, to_claim_id, relation)
    VALUES ('a-claim', 'b-claim', 'contradicts'), ('b-claim', 'a-claim', 'supports')
`).run();

const before = db.prepare(`SELECT COUNT(*) AS n FROM claims`).get().n;
const reader = createKnowledgeReader(db);
const usage = reader.datasetUsage();
assert.strictEqual(usage.usage, 'synthetic_test_fixture');
assert.strictEqual(usage.approvedForUserInterpretation, false);

const byId = reader.getClaimById('a-claim');
assert.strictEqual(byId.claimId, 'a-claim');
assert.strictEqual(byId.usage, 'research_or_fixture');
assert.strictEqual(reader.getClaimById('missing'), null);

const byCombo = reader.findClaimsByCombination('Phủ Tướng Triều Viên').map((claim) => claim.claimId);
assert.deepStrictEqual(byCombo, ['a-claim', 'b-claim']);
assert.deepStrictEqual(reader.findClaimsBySchool('vn-tam-hop-default').map((claim) => claim.claimId), ['a-claim', 'b-claim']);
assert.deepStrictEqual(reader.findClaimsByStar('tu_vi').map((claim) => claim.claimId), ['a-claim', 'b-claim']);
assert.deepStrictEqual(reader.findClaimsByPalace('menh').map((claim) => claim.claimId), ['b-claim']);

const sourced = reader.getSourceReferences('a-claim');
assert.strictEqual(sourced.missingSource, false);
assert.strictEqual(sourced.references[0].sourceId, 'src');
assert.strictEqual(sourced.references[0].supportType, 'paraphrase');
const bare = reader.getSourceReferences('bare-claim');
assert.strictEqual(bare.claimFound, true);
assert.strictEqual(bare.missingSource, true);
assert.deepStrictEqual(bare.references, []);
const absent = reader.getSourceReferences('missing');
assert.strictEqual(absent.claimFound, false);
assert.strictEqual(absent.missingSource, true);

const links = reader.getClaimDependencies('a-claim');
assert.strictEqual(links.claimFound, true);
assert.deepStrictEqual(links.contradicts, [{ claimId: 'b-claim', direction: 'outgoing' }]);
assert.strictEqual(reader.getClaimDependencies('missing').claimFound, false);
assert.deepStrictEqual(links.supports, [{ claimId: 'b-claim', direction: 'incoming' }]);

const status = reader.getVerificationStatuses('a-claim');
assert.strictEqual(status.found, true);
assert.strictEqual(status.formulaStatus, 'undocumented');
assert.strictEqual(status.bibliographicStatus, 'secondary');
const missingStatus = reader.getVerificationStatuses('missing');
assert.strictEqual(missingStatus.found, false);
assert.strictEqual(missingStatus.formulaStatus, null);

assert.throws(() => db.prepare(`INSERT INTO claims (claim_id, body_json, implementation_status, formula_status, bibliographic_status, interpretation_status) VALUES ('x', '{}', 'untested', 'undocumented', 'secondary', 'unreviewed')`).run());
assert.strictEqual(db.prepare(`SELECT COUNT(*) AS n FROM claims`).get().n, before);

db.close();
fs.rmSync(dir, { recursive: true, force: true });
console.log('knowledge queries stay read-only on a synthetic temp fixture');
