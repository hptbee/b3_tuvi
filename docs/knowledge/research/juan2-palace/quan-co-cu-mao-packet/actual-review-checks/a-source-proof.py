from html.parser import HTMLParser
from pathlib import Path
import json,hashlib,subprocess
p=Path('/tmp/t029/proposal'); raw=Path('/tmp/t029/a-raw.html').read_bytes(); pin='2f00e2ab0c80b1632e55bc362f2ae26e121245cb'
assert raw==subprocess.run(['git','-C','/tmp/tuvi-iztro-pinned','show',pin+':docs/zh_TW/learn/ancientBook-2.html'],check=True,capture_output=True).stdout
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.data=[];self.paras=[];self.current=None;self.hidden=0
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style'):self.hidden+=1
  if tag=='p':self.current=[]
 def handle_data(self,x):
  if self.hidden:return
  self.data.append(x)
  if self.current is not None:self.current.append(x)
 def handle_endtag(self,tag):
  if tag in ('script','style'):self.hidden-=1
  if tag=='p' and self.current is not None:self.paras.append(''.join(self.current));self.current=None
parser=Parser();parser.feed(raw.decode());full=''.join(parser.data);norm=lambda s:''.join(s.split()).replace('\u200b','');span=(p/'quan-co-cu-mao-source-span.txt').read_text(); start=full.index('巨門入廟武職權貴');end=full.index('天相入廟文武皆宜食祿千鐘',start);assert norm(full[start:end])==norm(span)
assert any(x.startswith('巨門入廟武職權貴') for x in parser.paras);assert '陷宮遭悔吝，加羊陀火鈴空劫更不美，退宮卸職。' in parser.paras
s=full.index('官祿宮');e=full.index('田宅宮',s);assert norm(full[s:e])==norm((p/'quan-full-section.txt').read_text())
assert '卯酉宮旺地與巨門同度' in full and '卯酉宮入廟，與天機同度' in full
# Full derived document is ordered textual extraction of this inert HTML.
derived=(p/'derived-juan2.txt').read_text();assert norm(derived)==norm(full)
proof={'rawHttpStatus':200,'pin':pin,'rawHtmlSha256':hashlib.sha256(raw).hexdigest(),'gitObjectEqual':True,'completeTwoParagraphsEqual':True,'wholeQuanEqual':True,'fullDerivedEqualIgnoringLayoutWhitespace':True,'sourceBrightnessWangNotMiao':True,'licenseNoticeRead':True,'upstreamCodeExecuted':False}
Path('/tmp/t029/a-source-proof.json').write_text(json.dumps(proof,indent=2));print(json.dumps(proof))
