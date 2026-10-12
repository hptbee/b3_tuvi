import assert from 'assert';
import contract from '../../docs/knowledge/provenance-contract.json' with { type: 'json' };
import { canTransition, validateProvenance } from '../src/knowledge/provenance.js';

const base = {
    implementationStatus: 'untested',
    formulaStatus: 'undocumented',
    bibliographicStatus: 'conflicting_secondary',
    interpretationStatus: 'unreviewed'
};

const ok = validateProvenance(base, {}, contract);
assert.strictEqual(ok.ok, true, ok.errors.join('; '));

const fromTest = validateProvenance({
    ...base,
    implementationStatus: 'tested',
    bibliographicStatus: 'primary',
    formulaStatus: 'checked_against_edition'
}, { inferredFromTestPass: true, editionAuthenticated: true }, contract);
assert.strictEqual(fromTest.ok, false);
assert.ok(fromTest.errors.some((e) => e.includes('cannot be inferred from test pass')));

const matched = { ...base, formulaStatus: 'matches_repo_formula' };
const noEdition = canTransition(matched, {
    ...matched,
    formulaStatus: 'checked_against_edition'
}, { editionAuthenticated: false }, contract);
assert.strictEqual(noEdition.ok, false);
const withEdition = canTransition(matched, {
    ...matched,
    formulaStatus: 'checked_against_edition'
}, { editionAuthenticated: true }, contract);
assert.strictEqual(withEdition.ok, true, withEdition.errors.join('; '));
const ownerAccepted = canTransition(matched, {
    ...matched,
    formulaStatus: 'checked_against_edition'
}, {
    editionAuthenticated: true,
    textCollatedAgainstOriginal: false,
    originalEditionAuthenticated: false,
    authenticationScope: 'digital_file_accepted_as_working_text'
}, contract);
assert.strictEqual(ownerAccepted.ok, true, ownerAccepted.errors.join('; '));

const stepped = canTransition(base, {
    ...base,
    formulaStatus: 'matches_repo_formula'
}, {}, contract);
assert.strictEqual(stepped.ok, true, stepped.errors.join('; '));

const jumpPrimary = canTransition(base, {
    ...base,
    bibliographicStatus: 'primary'
}, { editionAuthenticated: true }, contract);
assert.strictEqual(jumpPrimary.ok, false);

const sourced = canTransition(base, {
    ...base,
    interpretationStatus: 'sourced'
}, {}, contract);
assert.strictEqual(sourced.ok, false);

const sourcedOk = canTransition(base, {
    ...base,
    interpretationStatus: 'sourced'
}, { sourceId: 'thai-thu-lang-tan-bien' }, contract);
assert.strictEqual(sourcedOk.ok, true, sourcedOk.errors.join('; '));

console.log('provenance contract rejects test-pass upgrades and unauthenticated edition checks');
