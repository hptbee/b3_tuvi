import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const tempDir = mkdtempSync(join(tmpdir(), 'tuvi-modern-minor-api-'));
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
const profile = 'iztro-pinned-age1-sex-triad';
const birth = { day:15,month:6,year:1990,hour:8,gender:1,fullName:'PRIVATE-NAME-DO-NOT-ECHO' };
async function post(body, endpoint='analyze', extra={}) {
    const response = await fetch(`${base}/${endpoint}`,{ method:'POST',headers:{'Content-Type':'application/json',...extra},
        body:typeof body==='string'?body:JSON.stringify(body) });
    assert.match(response.headers.get('cache-control'),/no-store/);
    return {response, body:await response.json()};
}
try {
    const omitted=await post(birth);assert.equal(omitted.response.status,200);
    assert.equal(omitted.body.time.capabilities.tieu_han_modern.status,'not_applied');
    assert.equal(omitted.body.time.capabilities.tieu_han_modern.profile,null);
    for (const gender of [1,-1]) for (const nominalAge of [1,2,120]) {
        const result=await post({...birth,gender,minorPeriod:{profile,nominalAge}});
        assert.equal(result.response.status,200);const cap=result.body.time.capabilities.tieu_han_modern;
        assert.equal(cap.profile,profile);assert.equal(cap.nominalAge,nominalAge);assert.equal(cap.palaceMapping,'mapped');
        assert.equal(cap.branch,nominalAge===1?'Thìn':gender===1?(nominalAge===2?'Tị':'Mão'):(nominalAge===2?'Mão':'Tị'));
        assert.equal(cap.publicFortune,false);assert.equal(cap.interpretation,null);
        assert.equal(result.body.time.capabilities.tieu_han.status,'blocked');
        assert.equal(JSON.stringify(result.body).includes(birth.fullName),false);
    }
    const fixtures=JSON.parse(readFileSync(new URL('../../docs/knowledge/research/fortune/modern-minor/fixtures.json',import.meta.url),'utf8'));
    const badAges=fixtures.badInputs.filter(row=>row.invalidField==='nominalAge').map(row=>row.input.nominalAge);
    const invalid=[null,[],{}, {profile},{nominalAge:1},{profile:'',nominalAge:1},{profile:'other',nominalAge:1},
        ...badAges.map(nominalAge=>({profile,nominalAge})), {profile,nominalAge:'1'},
        {profile,nominalAge:1,birthYearBranch:'Ngọ'}, {profile,nominalAge:1,gender:1},
        {profile,nominalAge:1,approval:true},{profile,nominalAge:1,normalizedChart:{}}];
    for (const minorPeriod of invalid) {
        const result=await post({...birth,minorPeriod});assert.equal(result.response.status,400);
        assert.equal(result.body.code,'invalid_minor_period');assert.equal(JSON.stringify(result.body).includes(birth.fullName),false);
        const ask=await post({...birth,minorPeriod,questionId:'why_menh'},'ask');assert.equal(ask.response.status,400);
        assert.deepEqual(ask.body,{ok:false,error:'analysis_failed',prose:null});
    }
    const injected=await post({...birth,minorPeriod:{profile,nominalAge:1},normalizedChart:{ok:true}});
    assert.equal(injected.response.status,400);assert.equal(injected.body.code,'client_chart_rejected');
    const ask=await post({...birth,minorPeriod:{profile,nominalAge:1},questionId:'why_menh'},'ask');
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
console.log('modern minor HTTP: strict opt-in, explicit ages, ask compatibility, no-store errors and no personal persistence/logging');
