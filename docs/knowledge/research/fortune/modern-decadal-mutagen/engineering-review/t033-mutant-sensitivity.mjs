import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const root='/workspace/b3_tuvi';
const modulePath=`${root}/frontend/src/components/structuredAnalysisContract.js`;
const testPath=`${root}/backend/test/structuredAnalysisContract.integration.test.mjs`;
const original=readFileSync(modulePath,'utf8');
const line="return typeof name === 'string' ? name.replace(/ \\([MVĐBH]\\)$/, '') : name;";
assert.equal(original.split(line).length,2);
// The former R3501 comparison did not recognize brightness presentation suffixes.
writeFileSync('/tmp/t033/mutant-contract.mjs',original.replace(line,'return name;'));
let test=readFileSync(testPath,'utf8');
const locations={
 '../../frontend/src/components/structuredAnalysisContract.js':'file:///tmp/t033/mutant-contract.mjs',
 '../../docs/knowledge/research/fortune/modern-decadal-mutagen/fixtures.json':pathToFileURL(`${root}/docs/knowledge/research/fortune/modern-decadal-mutagen/fixtures.json`).href,
 '../src/app.js':pathToFileURL(`${root}/backend/src/app.js`).href,
 '../src/db/sqlite.js':pathToFileURL(`${root}/backend/src/db/sqlite.js`).href,
 '../src/db/repositories.js':pathToFileURL(`${root}/backend/src/db/repositories.js`).href
};
for(const [from,to] of Object.entries(locations))test=test.replaceAll(from,to);
writeFileSync('/tmp/t033/mutant-test.mjs',test);
const result=spawnSync(process.execPath,['/tmp/t033/mutant-test.mjs'],{encoding:'utf8'});
writeFileSync('/tmp/t033/mutant-test.log',result.stdout+result.stderr);
assert.equal(result.status,1);
assert.match(result.stderr,/real HTTP response must pass production client validators/);
console.log('R3501 scratch-only mutant fails unchanged permanent HTTP acceptance assertion; tracked production code untouched.');
