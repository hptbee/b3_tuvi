/** Explicit local replay of immutable engineering witnesses; never imports/executes upstream iztro. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
const base=path.dirname(fileURLToPath(import.meta.url));
let repo=base;
while(!fs.existsSync(path.join(repo,'backend/src/engine/tuviRules.mjs'))){const parent=path.dirname(repo);if(parent===repo)throw Error('Run from an evidence directory inside the B3 repository');repo=parent;}
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'b3-modern-decadal-replay-'));
try{
 fs.copyFileSync(path.join(base,'fixtures.json'),path.join(scratch,'fixtures-analysis.json'));
 const original=fs.readFileSync(path.join(base,'fixture-replay.mjs'),'utf8');
 // Rewrite paths in an ephemeral copy only. Reviewed script and fixture bytes remain untouched.
 const portable=original.replace(/from '(\/workspace\/b3_tuvi\/[^']+)'/g,(_,p)=>`from ${JSON.stringify(pathToFileURL(path.join(repo,p.slice('/workspace/b3_tuvi/'.length))).href)}`)
  .replace(/'\/tmp\/t025\/([^']+)'/g,(_,p)=>JSON.stringify(path.join(scratch,p)));
 if(/(['"])\/(?:workspace\/b3_tuvi|tmp\/t025)\//.test(portable))throw Error('Unadapted original path literal; inspect source before replay');
 const entry=path.join(scratch,'replay.mjs');fs.writeFileSync(entry,portable);
 process.stdout.write(execFileSync(process.execPath,[entry],{cwd:repo,encoding:'utf8'}));
}finally{fs.rmSync(scratch,{recursive:true,force:true});}
