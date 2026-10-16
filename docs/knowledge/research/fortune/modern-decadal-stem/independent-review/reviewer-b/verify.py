import json,hashlib,subprocess,pathlib,re
p=pathlib.Path('/tmp/t030/proposal'); out=pathlib.Path('/tmp/t030/reviewer-b'); b=json.loads((p/'review-bundle.json').read_text()); h=lambda x:hashlib.sha256(x).hexdigest()
checks=[]
for f in b['payloadHashManifest']:
 data=(p/f['path']).read_bytes(); git=subprocess.check_output(['git','-C','/tmp/tuvi-iztro-pinned','show',b['sourcePin']+':'+f['upstreamPath']]); assert data==git; assert len(data)==f['bytes']; assert h(data)==f['sha256']; assert f['pinnedUrl']=='https://github.com/SylarLong/iztro/blob/'+b['sourcePin']+'/'+f['upstreamPath'];checks.append(dict(f,gitBlobMatch=True))
for f,d in json.loads((p/'manifest.json').read_text())['files'].items(): assert h((p/f).read_bytes())==d,f
for key,file in [('source','source-span.txt'),('context','review-context.txt'),('fixtures','fixtures.json')]: assert h((p/file).read_bytes())==b[key+'Digest']
for key in ['algorithm','compatibility']:
 data=json.dumps(b[key+'Spec'],ensure_ascii=False,separators=(',',':')).encode(); assert h(data)==b[key+'Digest'],key
raw=(p/'raw/src/astro/palace.ts').read_text(); assert b['sourceSpan']==(p/'source-span.txt').read_text();assert b['sourceSpan'] in raw
for f in ['src/data/earthlyBranches.ts','src/data/index.ts']:
 data=subprocess.check_output(['git','-C','/tmp/tuvi-iztro-pinned','show',b['sourcePin']+':'+f]);(out/pathlib.Path(f).name).write_bytes(data)
proof={'all13RawBytesHashesUrlsGitMatch':len(checks)==13,'raw':checks,'manifestVerified':True,'fiveDigestsVerified':True,'exactSpanVerified':True,'remoteHTTPSAttempted':False,'method':'git show exact pinned commit:path, byte equality against each frozen payload'}
(out/'verification.json').write_text(json.dumps(proof,indent=2)+'\n');print(json.dumps(proof,indent=2))
