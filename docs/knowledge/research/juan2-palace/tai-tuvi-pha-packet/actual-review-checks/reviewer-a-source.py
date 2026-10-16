import urllib.request,hashlib,json,re
from pathlib import Path
from html.parser import HTMLParser
p=Path('/tmp/t028/proposal'); b=json.loads((p/'review-bundle.json').read_text());pin=b['pin']
u=f'https://raw.githubusercontent.com/SylarLong/iztro/{pin}/docs/zh_TW/learn/ancientBook-2.html'
with urllib.request.urlopen(u) as r: raw=r.read();status=r.status
Path('/tmp/t028/reviewer-a-remote.html').write_bytes(raw)
assert raw==(p/'raw-juan2.html').read_bytes()
class P(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,x):self.parts.append(x)
h=P();h.feed(raw.decode());t=''.join(h.parts)
compact=lambda s:re.sub(r'\s','',s)
a=t[t.index('紫微豐足倉箱'):t.index('天機勞心費力生財')];z=t[t.index('破軍在子午宮'):t.index('文昌富足倉箱')]
assert compact(a+z)==compact((p/'tai-tuvi-pha-complete-spans.txt').read_text())
for s in (p/'tai-full-section.txt').read_text().splitlines()[1:]:assert compact(s) in compact(t)
for s in (p/'branch-brightness-context.txt').read_text().splitlines():assert compact(s) in compact(t)
# Independently compare every nonempty derived line against inert HTML text.
for s in (p/'derived-juan2.txt').read_text().splitlines():
 if s.strip(): assert compact(s) in compact(t),s[:80]
proof={'status':status,'url':u,'sha256':hashlib.sha256(raw).hexdigest(),'rawMatchesFrozen':True,'completeEntriesMatch':True,'allDerivedLinesInRaw':True,'fullTaiAndBranchContextMatch':True,'upstreamCodeExecuted':False,'editionAuthenticated':False}
Path('/tmp/t028/reviewer-a-source-proof.json').write_text(json.dumps(proof,indent=2));print(json.dumps(proof))
