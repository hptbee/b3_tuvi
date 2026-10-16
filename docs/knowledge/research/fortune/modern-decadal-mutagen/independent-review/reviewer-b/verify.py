import json,hashlib,pathlib,subprocess,re,collections
P=pathlib.Path('/tmp/t032/proposal'); O=pathlib.Path('/tmp/t032/reviewer-b'); R='/tmp/tuvi-iztro-pinned'; B=pathlib.Path('/workspace/b3_tuvi')
def sha(b):return hashlib.sha256(b).hexdigest()
def read(p):return json.loads(p.read_text())
b=read(P/'review-bundle.json');pin=b['sourcePin']; proof={'method':'local git show at exact commit; no HTTP attempted; no upstream execution','repository':R,'pin':pin}
assert subprocess.check_output(['git','-C',R,'cat-file','-t',pin]).strip()==b'commit'
proof['commit']=subprocess.check_output(['git','-C',R,'show','-s','--format=%H %T',pin],text=True).strip()
proof['remote']=subprocess.check_output(['git','-C',R,'remote','get-url','origin'],text=True).strip()
manifest=read(P/'manifest.json')['files'];assert len(manifest)==44
for p,h in manifest.items():assert sha((P/p).read_bytes())==h,p
proof['manifestVerified']=44;proof['rawFiles']=[]
for f in b['payloadHashManifest']:
 data=subprocess.check_output(['git','-C',R,'show',pin+':'+f['upstreamPath']]);assert data==(P/f['path']).read_bytes();assert len(data)==f['bytes'];assert sha(data)==f['sha256']
 proof['rawFiles'].append({'path':f['upstreamPath'],'bytes':len(data),'sha256':sha(data),'gitBlob':subprocess.check_output(['git','-C',R,'rev-parse',pin+':'+f['upstreamPath']],text=True).strip()})
assert len(proof['rawFiles'])==29
for name,file in [('source','source-span.txt'),('context','review-context.txt'),('fixtures','fixtures.json')]:assert sha((P/file).read_bytes())==b[name+'Digest']
assert b['sourceSpan']==(P/'source-span.txt').read_text()
for name in ['algorithm','compatibility']:assert sha(json.dumps(b[name+'Spec'],ensure_ascii=False,separators=(',',':')).encode())==b[name+'Digest']
proof['digests']={k:v for k,v in b.items() if k.endswith('Digest')}
span=(P/'source-span.txt').read_text()
parts=re.split(r'^===== (.*?) =====\n',span,flags=re.M)
for label,body in zip(parts[1::2],parts[2::2]):
 if '(complete file)' in label:
  path=label.split(' (')[0];assert body.rstrip()==(P/'raw'/path).read_text().rstrip()
 else:
  m=re.match(r'(.*?) lines (\d+)–(\d+)',label);lines=(P/'raw'/m[1]).read_text().splitlines();assert body.rstrip()=='\n'.join(lines[int(m[2])-1:int(m[3])]).rstrip()
proof['spanSectionsVerified']=len(parts[1::2])
for f in read(P/'candidate-algorithm.json')['prerequisiteEvidence']:assert sha((B/f['path']).read_bytes())==f['sha256']
for f in b['legacyEvidenceManifest']:assert sha((B/f['path']).read_bytes())==f['sha256']
# Independent literal transcription after reading the pinned ten rows.
keys=['jia','yi','bing','ding','wu','ji','geng','xin','ren','gui']
rows=[['lianzhenMaj','pojunMaj','wuquMaj','taiyangMaj'],['tianjiMaj','tianliangMaj','ziweiMaj','taiyinMaj'],['tiantongMaj','tianjiMaj','wenchangMin','lianzhenMaj'],['taiyinMaj','tiantongMaj','tianjiMaj','jumenMaj'],['tanlangMaj','taiyinMaj','youbiMin','tianjiMaj'],['wuquMaj','tanlangMaj','tianliangMaj','wenquMin'],['taiyangMaj','wuquMaj','taiyinMaj','tiantongMaj'],['jumenMaj','taiyangMaj','wenquMin','wenchangMin'],['tianliangMaj','ziweiMaj','zuofuMin','wuquMaj'],['pojunMaj','jumenMaj','taiyinMaj','tanlangMaj']]
vi=dict(re.findall(r"(\w+): '([^']+)'",(P/'raw/src/i18n/locales/vi-VN/star.ts').read_text())); mapping=read(P/'canonical-mapping.json');sm={s['sourceStarKey']:s for s in mapping['stars']}
for i,row in enumerate(rows):
 assert mapping['rows'][i]['sourceStarKeys']==row
 assert b['algorithmSpec']['defaultTable'][str(i)]==[vi[k] for k in row]
assert read(B/'backend/src/data/tuHoaMap.json')==b['algorithmSpec']['defaultTable']
f=read(P/'fixtures.json');assert (P/'fixtures.json').read_bytes()==pathlib.Path('/tmp/t032-astra-replay/fixtures.json').read_bytes()
shared=0;records=0;reached=set();seen=set();branches=set(); counts=collections.Counter()
for c in f['cases']:
 n=c['natal'];expectedDirection=1 if ((n['birthBranchIndex']%2==1)==(c['input']['gender']==1)) else -1;assert n['direction']==expectedDirection
 menh=c['periods'][0]['selectedBranchId'];assert len(c['periods'])==12
 for i,p in enumerate(c['periods']):
  branch=(menh-1+expectedDirection*i)%12+1;stem=(2*(n['birthStemIndex']%5+1)+(branch-3)%12)%10
  assert p['selectedBranchId']==branch and p['selectedStemIndex']==stem and p['selectedStemKey']==keys[stem]+'Heavenly'
  assert p['nominalAge']==n['cuc']+10*i and p['decadeIndex']==i
  ass=p['expectedAssociations'];assert len(ass)==4
  for j,a in enumerate(ass):
   key=rows[stem][j];m=sm[key];assert a['sourceStarKey']==key and a['sourceStarName']==vi[key]
   assert a['mutagenKey']==['sihuaLu','sihuaQuan','sihuaKe','sihuaJi'][j]
   assert a['b3StarId']==m['b3StarId'] and a['b3List']==m['b3ExpectedList']
   assert int(a['palaceId'])==a['branchId'];assert a['b3InstanceId'].split(':')[0]==a['palaceId']
   reached.add((stem,j));seen.add(key);records+=1
  shared+=len(set(a['palaceId'] for a in ass))<4
  for k,v in p['distinguishes'].items():counts[k]+=v
assert len(f['cases'])==24 and records==1152 and shared==101 and len(reached)==40 and len(seen)==15
proof['fixtureVerification']={'replayByteIdentical':True,'fixturesSha256':sha((P/'fixtures.json').read_bytes()),'charts':24,'periods':288,'records':records,'shared':shared,'cells':len(reached),'stars':len(seen),'wrongAlgorithmCounts':dict(counts),'arithmetic':'independent Python direction, branch and 2*(birthStem%5+1)+Dần-relative branch modulo ten; literal source row transcription','limits':'positions and IDs are observed existing B3 natal metadata, not independent natal formula truth; malformed negatives are proposed engineering guards'}
(O/'verification.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in proof.items() if k!='rawFiles'},ensure_ascii=False,indent=2))
