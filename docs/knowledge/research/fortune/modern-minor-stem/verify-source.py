"""Verify recovered exact-pin bytes and bounded minor-stem derivation; no upstream code runs."""
from pathlib import Path
import hashlib, json, re

BASE = Path(__file__).resolve().parent
TREE = json.loads((BASE / 'upstream-tree.json').read_text(encoding='utf-8'))
PIN = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb'
entries = {entry['path']: entry for entry in TREE['tree']}
assert TREE['sha'] == '3095b2e908923aea98072d1eb965a95028ebf995' and not TREE['truncated']
commit = json.loads((BASE / 'upstream-commit.json').read_text(encoding='utf-8'))
assert commit['sha'] == PIN and commit['tree']['sha'] == TREE['sha']
proof = []
for file in sorted((BASE / 'raw').rglob('*')):
    if not file.is_file(): continue
    path = file.relative_to(BASE / 'raw').as_posix()
    data = file.read_bytes()
    blob = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
    assert blob == entries[path]['sha'], (path, blob, entries[path]['sha'])
    proof.append(dict(path=path, bytes=len(data), gitBlob=blob, sha256=hashlib.sha256(data).hexdigest()))

def source(path):
    return (BASE / 'raw' / path).read_text(encoding='utf-8')

constants = source('src/data/constants.ts')
stems = re.findall(r"'([^']+)'", re.search(r'export const HEAVENLY_STEMS = \[(.*?)\]', constants, re.S)[1])
branches = re.findall(r"'([^']+)'", re.search(r'export const EARTHLY_BRANCHES = \[(.*?)\]', constants, re.S)[1])
tiger = dict(re.findall(r"(\w+): '([^']+)'", re.search(r'export const TIGER_RULE = \{(.*?)\}', constants, re.S)[1]))
assert len(stems) == 10 and len(branches) == 12 and len(tiger) == 10
checks = 0
for stem in stems:
    start = stems.index(tiger[stem])
    for soul in range(12):
        for physical in range(12):
            soul_stem = (start + soul) % 10
            natal_stem = (soul_stem - soul + physical) % 10
            projection = (start + physical) % 10
            assert natal_stem == projection
            checks += 1

ranges = [('src/astro/FunctionalAstrolabe.ts', 33, 132), ('src/astro/FunctionalAstrolabe.ts', 150, 171),
          ('src/astro/astro.ts', 108, 215), ('src/astro/palace.ts', 28, 93),
          ('src/astro/palace.ts', 174, 234), ('src/utils/index.ts', 32, 65),
          ('src/utils/index.ts', 118, 134), ('src/utils/index.ts', 177, 207),
          ('src/data/constants.ts', 5, 35), ('src/data/constants.ts', 136, 154),
          ('src/astro/config.ts', 9, 23), ('src/i18n/index.ts', 74, 119),
          ('src/i18n/locales/vi-VN/heavenlyStem.ts', 1, 12),
          ('src/i18n/locales/vi-VN/earthlyBranch.ts', 1, 14)]
context = []
for path, start, end in ranges:
    lines = source(path).splitlines()
    context.append(f'### {path} lines {start}-{min(end,len(lines))}\n' + '\n'.join(f'{i}: {lines[i-1]}' for i in range(start, min(end,len(lines))+1)))
(BASE / 'review-context.txt').write_text('\n\n'.join(context)+'\n', encoding='utf-8', newline='\n')
lines = source('src/astro/FunctionalAstrolabe.ts').splitlines(keepends=True)
(BASE / 'source-span.txt').write_bytes(''.join(lines[20:213]).encode('utf-8'))
result = dict(status='SOURCE_INSPECTED_NOT_APPROVED', repository='https://github.com/SylarLong/iztro', pin=PIN,
              tree=TREE['sha'], acquisition='Live GitHub connector exact-pin files and complete Git tree; reconstructed Git blob SHA1 validates every byte',
              recoveredFiles=proof, algebraCases=checks, algorithmApproval=False, upstreamCodeExecuted=False,
              independentFixtureChecks='Owned separately; not established by this source verification',
              historicalAuthentication=False, calendarEquivalence=False,
              extractedFiles={name: hashlib.sha256((BASE / name).read_bytes()).hexdigest() for name in ['source-span.txt','review-context.txt']})
(BASE / 'source-proof.json').write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf-8', newline='\n')
print(json.dumps(dict(status=result['status'], recoveredFiles=len(proof), algebraCases=checks, rawGitBlobMatches=True)))
