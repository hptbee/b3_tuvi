import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const base = process.argv[2];
if (!['foundational-single-star-packet', 'foundational-family-packet'].includes(base)) throw Error('Unknown source packet');
const prefix = `docs/knowledge/research/juan2-palace/${base}/`;
const manifest = JSON.parse(fs.readFileSync(prefix + 'manifest.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const mismatches = [];
for (const [ref, digest] of Object.entries(manifest.files)) {
    if (hash(fs.readFileSync(prefix + ref)) !== digest) throw Error(`Working frozen file changed: ${ref}`);
    const bytes = execFileSync('git', ['show', ':' + prefix + ref], { maxBuffer: 20 * 1024 * 1024 });
    if (hash(bytes) !== digest) mismatches.push(ref);
}
console.log(JSON.stringify({ packet: base, files: Object.keys(manifest.files).length, stagedByteMismatches: mismatches }));
if (mismatches.length) process.exitCode = 1;
