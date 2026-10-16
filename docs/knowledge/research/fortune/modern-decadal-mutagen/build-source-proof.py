from pathlib import Path
import re,json,hashlib,subprocess
root=Path('/tmp/t032');raw=root/'source/raw';pin='2f00e2ab0c80b1632e55bc362f2ae26e121245cb'; repo='/tmp/tuvi-iztro-pinned';b3=Path('/workspace/b3_tuvi')
sha=lambda x:hashlib.sha256(x).hexdigest()
vi=dict(re.findall(r"\s+(\w+): '([^']+)'",(raw/'src/i18n/locales/vi-VN/star.ts').read_text()))
stems=re.findall(r"(\w+Heavenly): \{.*?mutagen: \[([^\]]+)\]",(raw/'src/data/heavenlyStems.ts').read_text(),re.S)
keys=[s for s,_ in stems];names=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý']; rows=[]
for i,(s,v) in enumerate(stems):
 stars=re.findall(r"'([^']+)'",v);rows.append({'stemIndex':i,'sourceStemKey':s,'stemName':names[i],'sourceStarKeys':stars,'canonicalStarNames':[vi[k] for k in stars]})
assert len(rows)==10 and all(len(x['sourceStarKeys'])==4 for x in rows)
unique=sorted({k for row in rows for k in row['sourceStarKeys']});assert len(unique)==15
star_names=[vi[k] for k in unique]
code="import {resolveStar} from './backend/src/engine/starCatalog.js'; console.log(JSON.stringify("+json.dumps(star_names,ensure_ascii=False)+".map(resolveStar)));"
resolved=json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=b3))
assert all(x['status']=='known' for x in resolved)
mapping=[{'sourceStarKey':key,'sourceClass':'major' if key.endswith('Maj') else 'minor','canonicalName':vi[key],'b3StarId':r['starId'],'b3Category':r['category'],'b3ExpectedList':'major' if key.endswith('Maj') else 'good','classificationNote':'B3 list expectation must be independently validated on reachable charts; upstream minor does not imply B3 list minor'} for key,r in zip(unique,resolved)]
old=json.loads((b3/'backend/src/data/tuHoaMap.json').read_text());assert all(old[str(r['stemIndex'])]==r['canonicalStarNames'] for r in rows)
(root/'canonical-mapping.json').write_text(json.dumps({'order':['sihuaLu','sihuaQuan','sihuaKe','sihuaJi'],'b3Labels':['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'],'sourceVietnameseLabels':['Lộc','Quyền','Khoa','Kỵ'],'rows':rows,'stars':mapping},ensure_ascii=False,indent=2)+'\n')
artifacts=[]
for p in sorted(raw.rglob('*')):
 if not p.is_file():continue
 rel=str(p.relative_to(raw));actual=subprocess.check_output(['git','-C',repo,'show',pin+':'+rel]);assert p.read_bytes()==actual
 artifacts.append({'path':'source/raw/'+rel,'upstreamPath':rel,'sha256':sha(actual),'bytes':len(actual),'gitBlob':subprocess.check_output(['git','-C',repo,'rev-parse',pin+':'+rel],text=True).strip()})
sourcefiles=['src/data/heavenlyStems.ts','src/data/stars.ts','src/astro/config.ts','src/astro/context.ts','src/utils/index.ts','src/astro/palace.ts','src/astro/FunctionalHoroscope.ts','src/i18n/index.ts','src/i18n/locales/vi-VN/star.ts','src/i18n/locales/vi-VN/mutagen.ts']
spans=['Pinned software source, not a classical book. Full contextual files below.\nCommit: '+pin+'\n']
for f in sourcefiles:spans.append('\n===== '+f+' (complete file) =====\n'+(raw/f).read_text())
f='src/astro/FunctionalAstrolabe.ts';content=(raw/f).read_text().splitlines(keepends=True)
spans.append('\n===== '+f+' lines 1–218 (complete private selector/calculation function) =====\n'+''.join(content[:218]))
spans.append('\n===== '+f+' lines 430–453 (horoscope and complete decadalList) =====\n'+''.join(content[429:453]))
(root/'source/source-span.txt').write_text(''.join(spans))
proof={'task':'T032','status':'SOURCE_INSPECTED_NOT_APPROVED','sourceId':'iztro-modern-software','editionId':'iztro-modern-2f00e2ab0c80','repository':'https://github.com/SylarLong/iztro','pin':pin,'access':{'method':'actual local Git object reads using git show at exact pin','repositoryPath':repo,'httpStatus':None,'httpNotAttempted':True,'upstreamCodeExecuted':False},'identity':{'commitObject':subprocess.check_output(['git','-C',repo,'cat-file','-t',pin],text=True).strip(),'package':json.loads((raw/'package.json').read_text())['name'],'version':json.loads((raw/'package.json').read_text())['version'],'license':'MIT','historicalBookAuthentication':False},'checks':{'rawFilesMatchPinnedGitObjects':True,'tableRows':10,'orderedTableCells':40,'uniqueTargetStars':15,'all40ExistingB3NatalTableCellsEqualSource':True,'all15VietnameseTargetsResolveToKnownB3Ids':True,'fixtureListClassificationsPendingIndependentCheck':True,'sourceSpanContainsFullFunctionsAndContext':True,'dualReviewExecutedByThisAnalyst':False,'expertVerified':False,'formulaApproved':False,'publicRelease':False},'artifacts':artifacts,'canonicalMappingSha256':sha((root/'canonical-mapping.json').read_bytes()),'sourceSpanSha256':sha((root/'source/source-span.txt').read_bytes())}
(root/'source-proof.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(proof['checks'],indent=2))
