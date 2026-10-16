from pathlib import Path
from html.parser import HTMLParser
from hashlib import sha256
import re,json
root=Path(__file__).resolve().parents[4]
out=Path(__file__).resolve().parent
base=root/'docs/knowledge/research/juan2-palace/phuc-co-cu-packet'
raw=(base/'raw-juan2.html').read_bytes()
assert sha256(raw).hexdigest()=='438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a'
class Inert(HTMLParser):
 def __init__(self): super().__init__();self.parts=[];self.skip=0
 def handle_starttag(self,t,a):
  if t in ['script','style']: self.skip+=1
 def handle_endtag(self,t):
  if t in ['script','style']: self.skip-=1
 def handle_data(self,s):
  if not self.skip:self.parts.append(s)
p=Inert();p.feed(raw.decode());inert=''.join(p.parts)
text=(base/'derived-juan2.txt').read_text(encoding='utf-8')
compact=lambda s:re.sub(r'\s|\u200b','',s)
section=text[text.index('田宅宮 \u200b'):text.index('福德宮 \u200b')]
paragraph=section.splitlines()[2]
assert paragraph.startswith('天機退祖新創置，巨門同在卯宮有田莊，在酉宮不守祖業，先大後小，')
assert paragraph.endswith('天梁同有置晚年富，太陰同自置旺相。')
assert compact(section) in compact(inert)
star_context=text[text.index('\n天機\n')+1:text.index('\n太陽\n')]+text[text.index('\n巨門\n')+1:text.index('\n天相\n')]
context='[COMPLETE DIEN TRACH SECTION]\n'+section+'\n[COMPLETE NATAL SOURCE THIEN CO AND CU MON CONTEXT, NOT ENGINE BRIGHTNESS EQUIVALENCE]\n'+star_context
for name,value in [('source-span.txt',paragraph+'\n'),('full-section.txt',section),('review-context.txt',context)]:
 (out/name).write_text(value,encoding='utf-8',newline='\n')
(out/'raw-juan2.html').write_bytes(raw)
identity={'status':'PRELIMINARY_SOURCE_INSPECTED_NOT_APPROVED','sourceId':'ziwei-quanshu-iztro-transcription','editionId':'iztro-juan2-2f00e2ab0c80','gitCommit':'2f00e2ab0c80b1632e55bc362f2ae26e121245cb','gitPath':'docs/zh_TW/learn/ancientBook-2.html','url':'https://github.com/SylarLong/iztro/blob/2f00e2ab0c80b1632e55bc362f2ae26e121245cb/docs/zh_TW/learn/ancientBook-2.html','rawHtmlSha256':sha256(raw).hexdigest(),'retrieval':'byte-exact committed prior reviewed source artifact; no fresh upstream Git object retrieval this subtask','fullSectionMatchesInertRaw':True,'upstreamCodeExecuted':False,'authenticated':False,'bookVerified':False,'expertVerified':False,'publicRelease':False,'historicalIndependence':'same existing modern transcription, not new independent historical witness'}
(out/'source-identity.json').write_text(json.dumps(identity,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(identity,ensure_ascii=True,indent=2)); print(json.dumps(paragraph,ensure_ascii=True))
