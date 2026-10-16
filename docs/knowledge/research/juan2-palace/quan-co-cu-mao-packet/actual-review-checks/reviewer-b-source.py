from html.parser import HTMLParser
from pathlib import Path
import json
p=Path('/tmp/t029/proposal')
class Reader(HTMLParser):
 def __init__(self): super().__init__(); self.fragments=[]; self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in ['script','style']:self.skip+=1
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.skip-=1
 def handle_data(self,data):
  if not self.skip:self.fragments.append(data)
r=Reader();r.feed((p/'raw-juan2.html').read_text());text=''.join(r.fragments)
def compact(s):return ''.join(s.split()).replace('\u200b','')
derived=(p/'derived-juan2.txt').read_text()
# Entire derived text content is present in HTML text, independently of block newlines.
assert compact(derived)==compact(text)
start=text.index('巨門入廟武職權貴');end=text.index('天相入廟文武皆宜食祿千鐘',start)
assert compact(text[start:end])==compact((p/'quan-co-cu-mao-source-span.txt').read_text())
q=text.index('官祿宮');qe=text.index('田宅宮',q)
assert compact(text[q:qe])==compact((p/'quan-full-section.txt').read_text())
for anchor in ['見羊陀火鈴方宜','天機同在卯宮吉美','陷宮遭悔吝，加羊陀火鈴空劫更不美，退宮卸職','卯酉宮旺地與巨門同度','卯酉宮入廟，與天機同度']:
 assert anchor in text
out={'fullDerivedTextMatchesRawIgnoringWhitespace':True,'fullQuanSectionMatches':True,'completeSpanMatches':True,'upstreamCodeExecuted':False,'method':'Python standard HTMLParser inert data extraction; raw previously verified against pinned git object','historicalAuthentication':False}
Path('/tmp/t029/reviewer-b-source-proof.json').write_text(json.dumps(out,indent=2));print(json.dumps(out))
