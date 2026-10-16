from pathlib import Path
import json,hashlib
root=Path('/workspace/b3_tuvi');p=Path('/tmp/t030');a=json.loads((p/'candidate-algorithm.json').read_text())
a['profile']='iztro-pinned-menh-cuc-decadal-stem';a['legacyProfile']='iztro-pinned-menh-cuc-decadal';a['scope'][0]='Only explicitly requested new iztro-pinned-menh-cuc-decadal-stem profile extends approved mapped modern-major period with source-scoped stem; legacy profile/request/output remain unchanged'
a['outputConditions']={'heavenlyStem':'canonical fixed Vietnamese label only for valid new profile with valid complete metadata and successfully mapped supported branch; null otherwise','stemPlacement':'supported only valid new profile + accepted newdecision + accepted originalbranchbinding + successful mappedbranch + trustedlunarstem; closed otherwise'}
a['legacyBranchEvidence']=[{'path':f,'sha256':hashlib.sha256((root/f).read_bytes()).hexdigest()} for f in ['docs/knowledge/research/fortune/modern-decadal/review-bundle.json','docs/knowledge/research/fortune/modern-decadal/decision.json','docs/knowledge/research/fortune/modern-decadal/source-span.txt','docs/knowledge/research/fortune/modern-decadal/review-context.txt']]
(p/'candidate-algorithm.json').write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n')
