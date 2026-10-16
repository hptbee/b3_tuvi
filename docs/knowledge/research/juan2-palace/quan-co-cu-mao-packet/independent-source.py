from html.parser import HTMLParser
from pathlib import Path
from hashlib import sha256
import subprocess,json
pin='2f00e2ab0c80b1632e55bc362f2ae26e121245cb';gitpath='docs/zh_TW/learn/ancientBook-2.html'
raw=subprocess.run(['git','-C','/tmp/tuvi-iztro-pinned','show',pin+':'+gitpath],check=True,capture_output=True).stdout
assert raw==Path('/tmp/t029/pinned-juan2.html').read_bytes()
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,s):self.parts.append(s)
p=Text();p.feed(raw.decode());text=''.join(p.parts)
extract=lambda a,b:text[text.index(a):text.index(b,text.index(a))]
span=extract('巨門入廟武職權貴','天相入廟文武皆宜食祿千鐘')
reciprocal=extract('天機入廟權貴','太陽入廟文武為良')
compact=lambda x:''.join(x.split()).replace('\u200b','')
assert compact(span)==compact(Path('/tmp/t029/quan-co-cu-mao-source-span.txt').read_text())
assert compact(reciprocal)==compact(json.loads(Path('/tmp/t029/candidate.json').read_text())['reciprocal'])
assert span.endswith('退宮卸職。')
assert '天機同在卯宮吉美，在酉宮雖美無始終' in span
assert '加羊陀火鈴空劫更不美' in span
section=extract('官祿宮','田宅宮');assert compact(section)==compact(Path('/tmp/t029/quan-full-section.txt').read_text())
brightness=Path('/tmp/t029/branch-brightness-context.txt').read_text()
assert '卯酉宮旺地與巨門同度' in brightness and '卯酉宮入廟，與天機同度' in brightness
assert '卯酉宮旺地與巨門同度' in text and '卯酉宮入廟，與天機同度' in text
context=Path('/tmp/t029/quan-co-cu-mao-context.txt').read_text()
assert section and compact(section) in compact(context)
assert brightness in context
out={'status':'INDEPENDENT_INERT_PINNED_TEXT_CHECK_NOT_APPROVAL','pin':pin,'path':gitpath,'exactGitObjectRead':True,'rawHtmlSha256':sha256(raw).hexdigest(),'spanSha256':sha256(Path('/tmp/t029/quan-co-cu-mao-source-span.txt').read_bytes()).hexdigest(),'contextSha256':sha256(context.encode()).hexdigest(),'completeGiantGateEntry':span,'completeReciprocalThienCo':reciprocal,'wholeQuanSectionMatches':True,'sourceWangVersusMiaoPreserved':True,'upstreamCodeExecuted':False,'historicalEditionAuthenticated':False,'sourceApproved':False,'oldDauApprovalReused':False}
assert out['rawHtmlSha256']=='438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a'
assert out['spanSha256']=='ae7aec7a8cb175d88b956f6562e7ccc138b45c65268c7bd0f7a7aba5a0966443'
assert out['contextSha256']=='bc5cb3737a70e083f983b4498af51281a266ae35ba2df71aa75fa46e7ad42ba4'
Path('/tmp/t029-independent-source.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps(out,ensure_ascii=False,indent=2))
