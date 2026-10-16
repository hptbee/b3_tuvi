from html.parser import HTMLParser
import pathlib,re,json,hashlib
class Inert(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.parts=[]
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style'):self.skip+=1
 def handle_endtag(self,tag):
  if tag in ('script','style'):self.skip-=1
 def handle_data(self,data):
  if not self.skip:self.parts.append(data)
p=pathlib.Path('/tmp/t027/proposal');h=Inert();h.feed((p/'raw-juan2.html').read_text());norm=lambda s:re.sub(r'\s+','',s)
assert norm(''.join(h.parts))==norm((p/'derived-juan2.txt').read_text())
print(json.dumps({'inertVisibleTextMatchesFullDerivedIgnoringWhitespace':True,'scriptsExecuted':False,'derivedSha256':hashlib.sha256((p/'derived-juan2.txt').read_bytes()).hexdigest()}))
