from pathlib import Path
import subprocess,json,hashlib
root=Path('/workspace/b3_tuvi'); out=Path('/tmp/t030/source'); repo='/tmp/tuvi-iztro-pinned'; pin='2f00e2ab0c80b1632e55bc362f2ae26e121245cb'
files=['src/astro/palace.ts','src/astro/astro.ts','src/astro/config.ts','src/data/constants.ts','src/data/types/astro.ts','src/utils/index.ts','src/i18n/index.ts','src/i18n/locales/vi-VN/index.ts','src/i18n/locales/vi-VN/heavenlyStem.ts','src/i18n/locales/vi-VN/earthlyBranch.ts','package.json','yarn.lock','LICENSE']
proof=[]
for f in files:
 data=subprocess.check_output(['git','-C',repo,'show',f'{pin}:{f}'])
 dest=out/'raw'/f;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
 tracked=root/'docs/knowledge/research/fortune/modern-decadal/raw'/f
 proof.append(dict(path=f,sha256=hashlib.sha256(data).hexdigest(),bytes=len(data),method='git show exact pinned object',gitBlob=subprocess.check_output(['git','-C',repo,'rev-parse',f'{pin}:{f}'],text=True).strip(),existingSnapshotMatch=(tracked.read_bytes()==data) if tracked.exists() else None,url=f'https://github.com/SylarLong/iztro/blob/{pin}/{f}'))
ref=(out/'palace-refetched.ts').read_bytes();same=ref==(out/'raw/src/astro/palace.ts').read_bytes();assert same
ranges=[('src/astro/palace.ts',28,93),('src/astro/palace.ts',174,234),('src/data/constants.ts',5,35),('src/data/constants.ts',130,153),('src/utils/index.ts',32,65),('src/i18n/locales/vi-VN/heavenlyStem.ts',1,12),('src/i18n/locales/vi-VN/earthlyBranch.ts',1,14),('src/data/types/astro.ts',216,231),('src/astro/config.ts',9,24),('src/astro/astro.ts',123,145),('src/astro/astro.ts',286,330),('src/i18n/index.ts',74,119)]
context=[]
for f,a,b in ranges:
 lines=(out/'raw'/f).read_text().splitlines()
 context.append(f'### {f} lines {a}-{min(b,len(lines))}\n'+'\n'.join(f'{i}: {lines[i-1]}' for i in range(a,min(b,len(lines))+1)))
(out/'review-context.txt').write_text('\n\n'.join(context)+'\n')
lines=(out/'raw/src/astro/palace.ts').read_text().splitlines()
(out/'source-span.txt').write_text('\n'.join(lines[185:217])+'\n')
proofdoc={'repository':'https://github.com/SylarLong/iztro','pin':pin,'gitOrigin':subprocess.check_output(['git','-C',repo,'remote','get-url','origin'],text=True).strip(),'commitType':subprocess.check_output(['git','-C',repo,'cat-file','-t',pin],text=True).strip(),'claim':'Pinned modern software formula, not classical book or real-world prediction evidence','files':proof,'rawRefetch':{'url':f'https://raw.githubusercontent.com/SylarLong/iztro/{pin}/src/astro/palace.ts','method':'curl --fail --location exact commit URL','httpStatus':200,'bytes':len(ref),'sha256':hashlib.sha256(ref).hexdigest(),'agreesWithGitObject':same},'derived':[{'path':f,'sha256':hashlib.sha256((out/f).read_bytes()).hexdigest()}for f in ['review-context.txt','source-span.txt']]}
Path('/tmp/t030/source-proof.json').write_text(json.dumps(proofdoc,ensure_ascii=False,indent=2)+'\n')
