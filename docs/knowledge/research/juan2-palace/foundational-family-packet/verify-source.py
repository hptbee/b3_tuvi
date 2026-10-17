"""Local inert source identity/context replay. No semantic review or source approval."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib,json
root=Path(__file__).resolve().parent
bundle=json.loads((root/'review-bundle.json').read_text(encoding='utf-8'))
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(root/'raw-juan2.html').read_bytes()
assert sha(raw)==bundle['rawHtmlSha256']
assert sha((root/'derived-juan2.txt').read_bytes())==bundle['sourceIdentity']['derivedTextSha256']
class P(HTMLParser):
 def __init__(self):super().__init__();self.active=None;self.buf=[];self.nodes=[]
 def handle_starttag(self,t,a):
  if t in ['p','h1','h2','h3','h4'] and self.active is None:self.active=t;self.buf=[]
 def handle_endtag(self,t):
  if t==self.active:self.nodes.append({'tag':t,'text':''.join(self.buf)});self.active=None;self.buf=[]
 def handle_data(self,d):
  if self.active:self.buf.append(d)
p=P();p.feed(raw.decode());sections={};current=None
for n in p.nodes:
 title=n['text'].replace('\u200b','').strip()
 if n['tag'].startswith('h') and title.endswith('宮'):current=title;sections[current]=[]
 elif current:sections[current].append(n['text'])
natal=sections['命宮'];major=['紫微','天機','太陽','武曲','天同','廉貞','天府','太陰','貪狼','巨門','天相','天梁','七殺','破軍','文昌']
for c in bundle['candidates']:
 _,palace,star=c['locator'].split('/')
 assert c['sourceSpan'] in sections[palace]
 assert (root/c['spanFile']).read_text(encoding='utf-8')==c['sourceSpan']
 section='\n'.join([palace]+sections[palace]);assert (root/c['palaceSectionFile']).read_text(encoding='utf-8')==section
 start=natal.index(star);end=next(i for i in range(start+1,len(natal)) if natal[i] in major)
 nataltext='\n'.join(natal[start:end]);assert (root/c['natalContextFile']).read_text(encoding='utf-8')==nataltext
 context='\n'.join([section,'Natal source context '+star,nataltext])
 assert (root/c['contextFile']).read_text(encoding='utf-8')==context
 assert sha(context.encode())==c['contextDigest'];assert sha(c['sourceSpan'].encode())==c['sourceDigest']
 assert all(a in c['sourceSpan'] for a in c['requiredAnchors'])
print(json.dumps({'status':'PASS_LOCAL_SOURCE_BYTE_CONTEXT_REPLAY_NOT_SEMANTIC_APPROVAL','claims':len(bundle['candidates']),'rawDigest':sha(raw),'fullOriginalParagraphs':True,'fullPalaceSections':True,'completeNatalStarSubsections':True,'sourceApproval':None,'publicRelease':False}))
