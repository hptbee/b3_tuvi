from html.parser import HTMLParser
from pathlib import Path
import re,json,hashlib
class P(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.parts=[]
 def handle_starttag(self,t,a):
  if t in ('script','style'):self.skip+=1
 def handle_endtag(self,t):
  if t in ('script','style'):self.skip-=1
 def handle_data(self,d):
  if not self.skip:self.parts.append(d)
p=P();p.feed(Path('/tmp/t026/proposal/raw-juan3.html').read_text());text=''.join(p.parts);derived=Path('/tmp/t026/proposal/derived-juan3.txt').read_text();norm=lambda s:re.sub(r'\s+','',s)
assert norm(text)==norm(derived)
context=Path('/tmp/t026/proposal/juan3-ziwei-complete-context.txt').read_text();assert norm(context) in norm(text)
out={'inertParser':'stdlib HTMLParser, script/style text excluded; no execution','allDerivedTextEqualIgnoringWhitespace':True,'completeContextPresent':True,'rawSha256':hashlib.sha256(Path('/tmp/t026/reviewer-a-raw.html').read_bytes()).hexdigest(),'derivedSha256':hashlib.sha256(derived.encode()).hexdigest()}
Path('/tmp/t026/reviewer-a-extraction-proof.json').write_text(json.dumps(out,indent=2));print(json.dumps(out))
