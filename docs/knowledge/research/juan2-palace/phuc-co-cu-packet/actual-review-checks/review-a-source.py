import json,hashlib,urllib.request
from pathlib import Path
from html.parser import HTMLParser
p=Path('/tmp/t027/proposal'); b=json.loads((p/'review-bundle.json').read_text()); sha=lambda x:hashlib.sha256(x).hexdigest()
url='https://raw.githubusercontent.com/SylarLong/iztro/'+b['pin']+'/docs/zh_TW/learn/ancientBook-2.html'
with urllib.request.urlopen(url) as r: status=r.status; raw=r.read()
assert status==200 and raw==(p/'raw-juan2.html').read_bytes() and sha(raw)==b['rawHtmlSha256']
manifest=json.loads((p/'manifest.json').read_text())
for n,h in manifest['files'].items(): assert sha((p/n).read_bytes())==h,n
assert sha((p/'derived-juan2.txt').read_bytes())==b['sourceIdentity']['derivedTextSha256']
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.active=None;self.nodes=[];self.buf=[]
 def handle_starttag(self,t,a):
  if t in ['p','h1','h2','h3','h4'] and self.active is None:self.active=t;self.buf=[]
 def handle_endtag(self,t):
  if t==self.active:self.nodes.append((t,''.join(self.buf)));self.active=None;self.buf=[]
 def handle_data(self,d):
  if self.active:self.buf.append(d)
x=Parser();x.feed(raw.decode());start=next(i for i,(t,s) in enumerate(x.nodes) if t.startswith('h') and s.replace('\u200b','').strip()=='福德宮');end=next(i for i in range(start+1,len(x.nodes)) if x.nodes[i][0].startswith('h'));sec=x.nodes[start:end];co=next(s for t,s in sec if s.startswith('天機先勞'));cu=next(s for t,s in sec if s.startswith('巨門勞力'));assert co+'\n'+cu==(p/'phuc-co-cu-complete-spans.txt').read_text();assert '\n'.join(s for t,s in sec)==(p/'phuc-full-section.txt').read_text()
proof={'status':'PASS','independentPinnedRawFetch':{'status':status,'url':url,'sha256':sha(raw)},'manifestFilesVerified':len(manifest['files']),'derivedTextSha256':sha((p/'derived-juan2.txt').read_bytes()),'fullSectionNodes':len(sec),'completeParagraphs':[co,cu],'rawHtmlExecuted':False}
Path('/tmp/t027/review-a-source-proof.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n');print(json.dumps(proof,ensure_ascii=False))
