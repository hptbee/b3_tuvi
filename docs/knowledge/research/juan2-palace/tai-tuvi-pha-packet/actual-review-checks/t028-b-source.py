from html.parser import HTMLParser
from pathlib import Path
import json
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.data=[]
 def handle_data(self,s):self.data.append(s)
p=Parser();p.feed(Path('/tmp/t028-b-fetched.html').read_text());t=''.join(p.data)
compact=lambda s:''.join(s.split())
root=Path('/tmp/t028/proposal');tu=t[t.index('紫微豐足倉箱'):t.index('天機勞心費力生財')];ph=t[t.index('破軍在子午宮'):t.index('文昌富足倉箱')]
assert compact(tu+ph)==compact((root/'tai-tuvi-pha-complete-spans.txt').read_text())
ctx=(root/'tai-full-section.txt').read_text();assert compact(ctx) in compact(t)
assert '丑未宮入廟與破軍同度' in t and '丑未宮旺地與紫微同度' in t
out={'completeTuVi':tu,'completePhaQuan':ph,'completeSpanMatches':True,'fullTaiSectionMatches':True,'branchContextMatches':True,'upstreamExecuted':False}
Path('/tmp/t028-b-source-proof.json').write_text(json.dumps(out,ensure_ascii=False,indent=2));print(json.dumps(out,ensure_ascii=False))
