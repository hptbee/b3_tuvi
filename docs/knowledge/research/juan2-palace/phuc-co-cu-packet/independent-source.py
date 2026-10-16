from html.parser import HTMLParser
from pathlib import Path
import subprocess,hashlib,json
pin='2f00e2ab0c80b1632e55bc362f2ae26e121245cb';source='docs/zh_TW/learn/ancientBook-2.html';raw=subprocess.check_output(['git','-C','/tmp/tuvi-iztro-pinned','show',pin+':'+source]);assert hashlib.sha256(raw).hexdigest()=='438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a'
class Paragraphs(HTMLParser):
 def __init__(self):super().__init__();self.active=None;self.buf=[];self.nodes=[]
 def handle_starttag(self,t,a):
  if t in ['p','h1','h2','h3','h4'] and self.active is None:self.active=t;self.buf=[]
 def handle_endtag(self,t):
  if t==self.active:self.nodes.append({'tag':t,'text':''.join(self.buf)});self.active=None;self.buf=[]
 def handle_data(self,d):
  if self.active:self.buf.append(d)
p=Paragraphs();p.feed(raw.decode());a=next(i for i,n in enumerate(p.nodes)if n['tag'].startswith('h') and n['text'].replace('\u200b','').strip()=='福德宮');b=next(i for i in range(a+1,len(p.nodes))if p.nodes[i]['tag'].startswith('h') and p.nodes[i]['text'].replace('\u200b','').strip()=='父母宮');section=p.nodes[a:b];co=next(n['text']for n in section if n['text'].startswith('天機先勞'));cu=next(n['text']for n in section if n['text'].startswith('巨門勞力'))
assert co=='天機先勞後逸，巨門同勞力欠安，天梁同享福，太陰同主快樂，加羊陀火鈴空劫奔走不得寧靜。';assert cu=='巨門勞力不安，太陽同有憂有喜，天機同心忙不安，天同同享福，加羊陀火鈴空劫生平多憂。';span=co+'\n'+cu;assert span==Path('/tmp/t027/phuc-co-cu-complete-spans.txt').read_text();Path('/tmp/t027-independent-source.json').write_text(json.dumps({'pin':pin,'upstreamPath':source,'rawDigest':hashlib.sha256(raw).hexdigest(),'spanDigest':hashlib.sha256(span.encode()).hexdigest(),'completeParagraphs':[co,cu],'fullSectionNodes':section,'fullSectionRead':True,'baselineModifiersEvaluated':False,'addedAdverseClauseEvaluated':False,'sourceApproval':None},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'rawPin':'MATCH','completeReciprocalParagraphs':2,'fullSectionNodes':len(section),'spanDigest':hashlib.sha256(span.encode()).hexdigest()},ensure_ascii=False))
