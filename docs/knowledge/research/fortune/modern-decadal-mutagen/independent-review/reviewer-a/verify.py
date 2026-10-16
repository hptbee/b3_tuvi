import json,hashlib,pathlib,subprocess,re
p=pathlib.Path('/tmp/t032/proposal');g='/tmp/tuvi-iztro-pinned';pin='2f00e2ab0c80b1632e55bc362f2ae26e121245cb';h=lambda b:hashlib.sha256(b).hexdigest();b=json.loads((p/'review-bundle.json').read_text());m=json.loads((p/'manifest.json').read_text())['files'];assert len(m)==44
for f,d in m.items():assert h((p/f).read_bytes())==d,f
proof=[]
assert subprocess.check_output(['git','-C',g,'cat-file','-t',pin]).strip()==b'commit'
for f in b['payloadHashManifest']:
 raw=(p/f['path']).read_bytes();actual=subprocess.check_output(['git','-C',g,'show',pin+':'+f['upstreamPath']]);assert raw==actual;assert len(actual)==f['bytes'];assert h(actual)==f['sha256'];proof.append({'path':f['upstreamPath'],'bytes':len(actual),'sha256':h(actual),'gitBlob':subprocess.check_output(['git','-C',g,'rev-parse',pin+':'+f['upstreamPath']]).decode().strip()})
assert len(proof)==29
for key,file in [('sourceDigest','source-span.txt'),('contextDigest','review-context.txt'),('fixturesDigest','fixtures.json')]:assert h((p/file).read_bytes())==b[key]
for key in ['algorithm','compatibility']:assert h(json.dumps(b[key+'Spec'],ensure_ascii=False,separators=(',',':')).encode())==b[key+'Digest']
assert (p/'source-span.txt').read_text()==b['sourceSpan']
assert (p/'fixtures.json').read_bytes()==pathlib.Path('/tmp/t032-sol-replay/fixtures.json').read_bytes()
# Parse actual source table and locale independently of candidate table.
s=(p/'raw/src/data/heavenlyStems.ts').read_text(); rows={k:re.findall("'([^']+)'",re.search(r'mutagen: \[([^\]]+)\]',v)[1]) for k,v in re.findall(r'(\w+Heavenly): \{([\s\S]*?)\n  \}',s)}
names=dict(re.findall(r"(\w+): '([^']+)'",(p/'raw/src/i18n/locales/vi-VN/star.ts').read_text()));candidate=json.loads((p/'candidate-algorithm.json').read_text());assert len(rows)==10;assert sum(map(len,rows.values()))==40;assert len(set(sum(rows.values(),[])))==15
for row in candidate['rows']:assert row['sourceStarKeys']==rows[row['sourceStemKey']];assert row['canonicalStarNames']==[names[k] for k in row['sourceStarKeys']]
for item in candidate['starMapping']:assert names[item['sourceStarKey']]==item['canonicalName'];assert item['sourceClass']==('major' if item['sourceStarKey'].endswith('Maj') else 'minor')
result={'manifestFiles':len(m),'rawGitPayloads':len(proof),'gitRepository':g,'pin':pin,'method':'local git show/cat-file/rev-parse; no HTTPS attempted','fiveDigestsMatch':True,'fixtureBytesMatch':True,'fixturesSha256':h((p/'fixtures.json').read_bytes()),'tableCells':40,'targetStars':15,'payloads':proof}
pathlib.Path('/tmp/t032/reviewer-a/verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='payloads'},indent=2))
