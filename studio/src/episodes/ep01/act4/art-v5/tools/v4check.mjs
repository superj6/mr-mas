// MR. MAS — Ep1 Act Four v5 art pass: the v4 NON-REGRESSION check. The v5 art is additive, and the one shared file it
// edits (shared/pixel/kits/callgrid.ts) must keep drawing v4 exactly. This builds THE EDITOR's v4 renderer twice, once
// with callgrid.ts as committed (git HEAD) and once with the working copy, renders the same v4 native frames from both
// and compares them byte for byte. Run from studio/ (Node 18+, git on PATH):
//   node src/episodes/ep01/act4/art-v5/tools/v4check.mjs <scratch-dir> [file-to-pin ...]
// Default pinned file: src/shared/pixel/kits/callgrid.ts. Frames: every v4 shot's first / middle / last frame plus every
// 3rd frame of S1, S6 and the call shots (812 frames). Prints IDENTICAL or the differing frames. Writes only into the
// scratch dir. (2026-09-26, prep-artbuild-r3: 812 / 812 identical.)
import * as esbuild from 'esbuild';
import {execFileSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const [scratch, ...pinArgs] = process.argv.slice(2);
if (!scratch) { console.error('usage: node v4check.mjs <scratch-dir> [file-to-pin ...]'); process.exit(2); }
const STUDIO = process.cwd();
if (!fs.existsSync(path.join(STUDIO, 'src/episodes/ep01/act4/animatic/tools/render4.ts'))) { console.error('run from studio/'); process.exit(2); }
const pins = (pinArgs.length ? pinArgs : ['src/shared/pixel/kits/callgrid.ts']).map((p) => path.resolve(STUDIO, p));
fs.mkdirSync(scratch, {recursive: true});
const head = new Map(pins.map((p) => [p, execFileSync('git', ['show', `HEAD:${path.relative(path.resolve(STUDIO, '..'), p)}`], {cwd: STUDIO, maxBuffer: 64 << 20}).toString()]));
const entry = path.join(STUDIO, 'src/episodes/ep01/act4/animatic/tools/render4.ts');
const headPlugin = {name: 'pin-head', setup(b) { b.onLoad({filter: /\.tsx?$/}, (a) => (head.has(path.resolve(a.path)) ? {contents: head.get(path.resolve(a.path)), loader: a.path.endsWith('x') ? 'tsx' : 'ts'} : undefined)); }};
const A = path.join(scratch, 'anim4-head.cjs'), B = path.join(scratch, 'anim4-now.cjs');
await esbuild.build({entryPoints: [entry], bundle: true, platform: 'node', outfile: A, logLevel: 'warning', plugins: [headPlugin]});
await esbuild.build({entryPoints: [entry], bundle: true, platform: 'node', outfile: B, logLevel: 'warning'});
const lock = JSON.parse(fs.readFileSync(path.join(STUDIO, '../show/episodes/ep01/production/act4/shots-locked-v4.json'), 'utf8'));
const fr = new Set();
for (const s of lock.shots) {
  const a = s.start_frame, e = s.end_frame;
  fr.add(a + 1); fr.add(Math.floor((a + e) / 2)); fr.add(e - 2);
  if (/^S[16]\./.test(s.id) || ['S3.01', 'S3.05', 'S4.01', 'S5.09', 'S5.09b', 'S8.03'].includes(s.id)) for (let f = a; f < e; f += 3) fr.add(f);
}
const frames = [...fr].sort((x, y) => x - y).map(String);
const run = (bundle, dir) => { fs.mkdirSync(dir, {recursive: true}); execFileSync('node', [bundle, 'native', dir, ...frames], {stdio: 'ignore', maxBuffer: 64 << 20}); };
const dA = path.join(scratch, 'head'), dB = path.join(scratch, 'now');
run(A, dA); run(B, dB);
const md5 = (p) => crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
const files = fs.readdirSync(dA).filter((f) => f.endsWith('.png')).sort();
const bad = files.filter((f) => !fs.existsSync(path.join(dB, f)) || md5(path.join(dA, f)) !== md5(path.join(dB, f)));
console.log(`${files.length} frames compared; pinned to HEAD: ${pins.map((p) => path.relative(STUDIO, p)).join(', ')}`);
console.log(bad.length ? `DIFFERENT (${bad.length}): ${bad.slice(0, 20).join(' ')}` : 'IDENTICAL');
process.exit(bad.length ? 1 : 0);
