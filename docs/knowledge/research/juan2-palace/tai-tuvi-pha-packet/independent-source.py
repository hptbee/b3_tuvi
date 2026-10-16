from html.parser import HTMLParser
from pathlib import Path
from hashlib import sha256
import json
class Text(HTMLParser):
 def __init__(self): super().__init__(); self.text=[]
 def handle_data(self,s): self.text.append(s)
raw=Path('/tmp/t028/pinned-juan2.html').read_bytes();p=Text();p.feed(raw.decode());alltext=''.join(p.text)
start=alltext.index('紫微豐足倉箱');end=alltext.index('天機勞心費力生財',start);tuvi=alltext[start:end]
start=alltext.index('破軍在子午宮');end=alltext.index('文昌富足倉箱',start);pha=alltext[start:end]
compact=lambda s: ''.join(s.split())
span=Path('/tmp/t028/source-span.txt').read_text()
assert compact(span)==compact(tuvi+pha)
assert '加羊陀火鈴空劫不旺，破軍同先難後易，天相同財帛蓄積' in tuvi
assert '紫微同先去後生，廉貞同勞碌生財，先難後遂，加空劫極貧。' in pha
assert '丑未宮入廟與破軍同度' in alltext and '丑未宮旺地與紫微同度' in alltext
assert sha256(raw).hexdigest()=='438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a'
result={'status':'INDEPENDENT_TEXT_EXTRACTION_ONLY_NOT_SEMANTIC_APPROVAL','rawHtmlSha256':sha256(raw).hexdigest(),'sourceSpanSha256':sha256(Path('/tmp/t028/source-span.txt').read_bytes()).hexdigest(),'fullTuViEntry':tuvi,'fullPhaQuanEntry':pha,'spanEqualsBothCompleteEntriesIgnoringWhitespace':True,'branchCohostContextVerified':True,'sourceAuthenticatedAsHistoricalEdition':False,'semanticModifierScopeApproved':False}
Path('/tmp/t028-independent-source.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
