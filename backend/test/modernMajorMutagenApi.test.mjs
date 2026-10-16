import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const tempDir=mkdtempSync(join(tmpdir(),'tuvi-modern-major-mutagen-api-'));
process.env.SQLITE_PATH=join(tempDir,'test.sqlite');
const {createApp}=await import('../src/app.js');
const sqlite=await import('../src/db/sqlite.js');
const repo=await import('../src/db/repositories.js');
sqlite.initDatabase();const before=repo.countHoroscopes();
const logs=[],originalLog=console.log,originalError=console.error;
console.log=(...items)=>logs.push(items.join(' '));console.error=(...items)=>logs.push(items.join(' '));
const server=await new Promise(resolve=>{const instance=createApp().listen(0,'127.0.0.1',()=>resolve(instance));});
const base=`http://127.0.0.1:${server.address().port}/api/interpretations`;
const profile='iztro-pinned-menh-cuc-decadal-mutagen',oldProfile='iztro-pinned-menh-cuc-decadal';
const stems=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const labels=['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'],ids=['hoa_loc','hoa_quyen','hoa_khoa','hoa_ky'];
const fixtures=JSON.parse(readFileSync(new URL('../../docs/knowledge/research/fortune/modern-decadal-mutagen/fixtures.json',import.meta.url),'utf8')).cases;
const privateName='PRIVATE-T032-NEVER-ECHO';let requests=0,periods=0;
async function post(body,endpoint='analyze') {
    requests++;
    const response=await fetch(`${base}/${endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    assert.match(response.headers.get('cache-control'),/no-store/);
    const payload=await response.json();assert.equal(JSON.stringify(payload).includes(privateName),false);
    return {response,body:payload};
}
try {
    for (const f of fixtures) {
        for (const expected of f.periods) {
            const result=await post({...f.input,fullName:privateName,majorPeriod:{profile,nominalAge:expected.nominalAge}});
            assert.equal(result.response.status,200);const cap=result.body.time.capabilities.dai_han_modern;
            assert.equal(cap.profile,profile);assert.equal(cap.heavenlyStem,stems[expected.selectedStemIndex]);assert.equal(cap.stemPlacement,'supported');
            assert.equal(cap.branchPlacement,'supported');assert.equal(cap.mutagenPlacement,'supported');assert.equal(cap.mutagenScope,'natal_physical_palaces');
            assert.deepEqual(cap.mutagens.map(({functionLabel,...record})=>{assert.equal(typeof functionLabel,'string');return record;}),expected.expectedAssociations.map((x,i)=>({mutagenId:ids[i],mutagenLabel:labels[i],sourceStarId:x.b3StarId,sourceStarName:x.sourceStarName,palaceId:x.palaceId,functionId:x.functionId})));
            assert.equal(cap.decadeIndex,expected.decadeIndex);assert.equal(cap.decadeStartAge,expected.nominalAge);assert.equal(cap.decadeEndAge,expected.nominalAge+9);
            assert.equal(cap.palaceMapping,'mapped');assert.equal(cap.publicFortune,false);assert.equal(cap.interpretation,null);
            assert.equal(cap.calendarCompatibility,'server_natal_menh_cuc_stem_branch_sex_age_and_default_mutagen_projection_not_full_iztro_astrolabe');
            assert.equal(result.body.time.capabilities.tieu_han.status,'blocked');
            periods++;
        }
        for (const nominalAge of [1,125].filter(age=>age<f.natal.cuc||age>f.natal.cuc+119)) {
            const result=await post({...f.input,majorPeriod:{profile,nominalAge}});
            const cap=result.body.time.capabilities.dai_han_modern;
            assert.equal(result.response.status,200);assert.equal(cap.status,'not_applied');
            assert.equal(cap.heavenlyStem,null);assert.equal(cap.stemPlacement,'not_applied');assert.equal(cap.branch,null);
            assert.equal(cap.mutagenPlacement,'not_applied');assert.deepEqual(cap.mutagens,[]);
        }
    }
    assert.equal(periods,288);
    const birth={...fixtures[0].input,fullName:privateName};
    const invalid=[null,[],{}, {profile},{nominalAge:1},{profile:'other',nominalAge:1},
        ...[0,-1,126,1.5,null,true,[],{},'14'].map(nominalAge=>({profile,nominalAge})),
        ...['heavenlyStem','stemPlacement','birthYearStemIndex','viewYear','gender','approval','normalizedChart','mutagens','mutagenScope','mutagenPlacement','config','table'].map(key=>({profile,nominalAge:14,[key]:key==='heavenlyStem'?'Giáp':true}))];
    for (const majorPeriod of invalid) {
        const result=await post({...birth,majorPeriod});assert.equal(result.response.status,400);assert.equal(result.body.code,'invalid_major_period');
        const ask=await post({...birth,majorPeriod,questionId:'why_menh'},'ask');assert.equal(ask.response.status,400);
        assert.deepEqual(ask.body,{ok:false,error:'analysis_failed',prose:null});
    }
    const nominalAge=14;
    const standalone=await post({...birth,majorPeriod:{profile,nominalAge}});
    const combined=await post({...birth,majorPeriod:{profile,nominalAge},minorPeriod:{profile:'iztro-pinned-age1-sex-triad',nominalAge},viewYearBranch:'Tí'});
    assert.equal(combined.response.status,200);assert.deepEqual(combined.body.time.capabilities.dai_han_modern,standalone.body.time.capabilities.dai_han_modern);
    assert.equal(combined.body.time.capabilities.tieu_han_modern.palaceMapping,'mapped');assert.equal(combined.body.time.capabilities.thien_duc.palaceMapping,'mapped');
    for (const option of [undefined,{profile:oldProfile,nominalAge},{profile:'iztro-pinned-menh-cuc-decadal-stem',nominalAge}]) {
        const result=await post({...birth,...(option?{majorPeriod:option}:{})});assert.equal(result.response.status,200);
        const cap=result.body.time.capabilities.dai_han_modern;
        for(const key of ['mutagens','mutagenPlacement','mutagenScope'])assert.equal(Object.hasOwn(cap,key),false);
    }
    for (const age of [1,14,125]) {
        const ask=await post({...birth,majorPeriod:{profile,nominalAge:age},questionId:'why_menh'},'ask');
        assert.equal(ask.response.status,200);assert.equal(ask.body.prose,null);
    }
    const forged=await post({...birth,majorPeriod:{profile,nominalAge},normalizedChart:{ok:true}});
    assert.equal(forged.response.status,400);assert.equal(forged.body.code,'client_chart_rejected');
    assert.equal(repo.countHoroscopes(),before);
    assert.equal(logs.some(line=>line.includes(privateName)||line.includes('nominalAge')||line.includes('1984')),false);
} finally {
    await new Promise(resolve=>server.close(resolve));sqlite.getDb().close();rmSync(tempDir,{recursive:true,force:true});
    console.log=originalLog;console.error=originalError;
}
console.log(`modern major mutagen HTTP:${requests} requests,24 independent charts/${periods} periods,strict contract,combined overlays,ask,no-store and privacy`);
