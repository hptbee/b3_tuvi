import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const tempDir = mkdtempSync(join(tmpdir(), 'tuvi-modern-major-api-'));
process.env.SQLITE_PATH = join(tempDir, 'test.sqlite');
const { createApp } = await import('../src/app.js');
const sqlite = await import('../src/db/sqlite.js');
const repo = await import('../src/db/repositories.js');
sqlite.initDatabase();
const before = repo.countHoroscopes();
const logs = []; const originalLog = console.log; const originalError = console.error;
console.log = (...items) => logs.push(items.join(' ')); console.error = (...items) => logs.push(items.join(' '));
const server = await new Promise(resolve => { const instance = createApp().listen(0,'127.0.0.1',()=>resolve(instance)); });
const base = `http://127.0.0.1:${server.address().port}/api/interpretations`;
const profile = 'iztro-pinned-menh-cuc-decadal';
const birth = { day:15,month:6,year:1990,hour:8,gender:1,fullName:'PRIVATE-NAME-DO-NOT-ECHO' };
async function post(body, endpoint='analyze', extra={}) {
    const response = await fetch(`${base}/${endpoint}`,{ method:'POST',headers:{'Content-Type':'application/json',...extra},
        body:typeof body==='string'?body:JSON.stringify(body) });
    assert.match(response.headers.get('cache-control'),/no-store/);
    return {response, body:await response.json()};
}
try {
    const omitted=await post(birth);assert.equal(omitted.response.status,200);
    assert.equal(omitted.body.time.capabilities.dai_han_modern.status,'not_applied');
    assert.equal(omitted.body.time.capabilities.dai_han_modern.profile,null);
    for (const gender of [1,-1]) for (const nominalAge of [6,16,125]) {
        const result=await post({...birth,gender,majorPeriod:{profile,nominalAge}});
        assert.equal(result.response.status,200);const cap=result.body.time.capabilities.dai_han_modern;
        assert.equal(cap.profile,profile);assert.equal(cap.nominalAge,nominalAge);assert.ok(['mapped','not_applied'].includes(cap.palaceMapping));
        if (cap.status === 'branch_placed') { assert.ok(cap.decadeIndex>=0 && cap.decadeIndex<=11); assert.equal(cap.decadeEndAge-cap.decadeStartAge,9); }
        assert.equal(cap.publicFortune,false);assert.equal(cap.interpretation,null);
        assert.equal(result.body.time.capabilities.tieu_han.status,'blocked');
        assert.equal(JSON.stringify(result.body).includes(birth.fullName),false);
    }
    const fixtures=JSON.parse(readFileSync(new URL('../../docs/knowledge/research/fortune/modern-decadal/fixtures.json',import.meta.url),'utf8'));
    const badAges=[0,-1,126,1.5,null,true,[],{}];
    const invalid=[null,[],{}, {profile},{nominalAge:1},{profile:'',nominalAge:1},{profile:'other',nominalAge:1},
        ...badAges.map(nominalAge=>({profile,nominalAge})), {profile,nominalAge:'1'},
        {profile,nominalAge:1,birthYearBranch:'Ngọ'}, {profile,nominalAge:1,gender:1},
        {profile,nominalAge:1,approval:true},{profile,nominalAge:1,normalizedChart:{}}];
    for (const majorPeriod of invalid) {
        const result=await post({...birth,majorPeriod});assert.equal(result.response.status,400);
        assert.equal(result.body.code,'invalid_major_period');assert.equal(JSON.stringify(result.body).includes(birth.fullName),false);
        const ask=await post({...birth,majorPeriod,questionId:'why_menh'},'ask');assert.equal(ask.response.status,400);
        assert.deepEqual(ask.body,{ok:false,error:'analysis_failed',prose:null});
    }
    const combined=await post({...birth,majorPeriod:{profile,nominalAge:16},
        minorPeriod:{profile:'iztro-pinned-age1-sex-triad',nominalAge:16},viewYearBranch:'Tí'});
    assert.equal(combined.response.status,200);
    assert.equal(combined.body.time.capabilities.dai_han_modern.palaceMapping,'mapped');
    assert.equal(combined.body.time.capabilities.tieu_han_modern.palaceMapping,'mapped');
    assert.equal(combined.body.time.capabilities.thien_duc.palaceMapping,'mapped');
    assert.equal(combined.body.time.capabilities.dai_han_modern.nominalAge,16);
    const witness=fixtures.fixtures[0];
    for (const age of [1,2,11,12,121,122,125]) {
        const actual=await post({...witness.input,majorPeriod:{profile,nominalAge:age}});
        const cap=actual.body.time.capabilities.dai_han_modern;
        assert.equal(actual.response.status,200);
        if(age===1) {assert.equal(cap.reason,'before_first_period');assert.equal(cap.branch,null);}
        else if(age>=122) {assert.equal(cap.reason,'after_last_period');assert.equal(cap.branch,null);}
        else {assert.equal(cap.branch,age<12?'Tí':age===12?'Hợi':'Sửu');assert.equal(cap.palaceMapping,'mapped');}
    }
    const injected=await post({...birth,majorPeriod:{profile,nominalAge:1},normalizedChart:{ok:true}});
    assert.equal(injected.response.status,400);assert.equal(injected.body.code,'client_chart_rejected');
    const ask=await post({...birth,majorPeriod:{profile,nominalAge:1},questionId:'why_menh'},'ask');
    assert.equal(ask.response.status,200);assert.equal(ask.body.prose,null);
    assert.equal((await post('{')).response.status,400);
    assert.equal((await post(JSON.stringify({...birth,fullName:'x'.repeat(270000)}))).response.status,413);
    assert.equal((await post('{}','analyze',{'content-encoding':'not-supported'})).response.status,415);
    assert.equal(repo.countHoroscopes(),before);
    assert.equal(logs.some(line=>line.includes(birth.fullName)||line.includes('nominalAge')||line.includes('1990')),false);
} finally {
    await new Promise(resolve=>server.close(resolve));
    sqlite.getDb().close();rmSync(tempDir,{recursive:true,force:true});console.log=originalLog;console.error=originalError;
}
console.log('modern major HTTP: strict opt-in, explicit ages, ask compatibility, no-store errors and no personal persistence/logging');
