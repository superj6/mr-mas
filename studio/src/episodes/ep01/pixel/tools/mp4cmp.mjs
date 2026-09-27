// MR. MAS — Ep1 pixel pipeline (P0): compare two renders of the same picture. Light for a few frames; run a long
// frame list through ops/heavy.sh. Uses the bundled ffmpeg (it has no framemd5 muxer: each listed frame is decoded to PNG
// and hashed here).
//   node src/episodes/ep01/pixel/tools/mp4cmp.mjs <a.mp4> <b.mp4> [f ...] [--json out.json]
// Prints: the md5 of each file's H.264 elementary stream (equal = the same encode, every frame), the frame counts, and
// per listed frame the md5 of the decoded picture in each file (PNG of the decoded frame).
import {spawnSync} from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import {fileURLToPath} from 'url';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const FFDIR = `${STUDIO}/node_modules/@remotion/compositor-linux-x64-gnu`;
const env = {...process.env, LD_LIBRARY_PATH: FFDIR};
const args = process.argv.slice(2);
const ji = args.indexOf('--json');
const jsonOut = ji >= 0 ? args.splice(ji, 2)[1] : null;
const [A, B, ...fr] = args;
if (!A || !B) { console.error('usage: mp4cmp.mjs <a.mp4> <b.mp4> [f ...] [--json out.json]'); process.exit(2); }
const ff = (a) => { const r = spawnSync(`${FFDIR}/ffmpeg`, ['-hide_banner', '-loglevel', 'error', ...a], {env, maxBuffer: 1 << 30}); if (r.status !== 0) throw new Error(String(r.stderr)); return r.stdout; };
const md5 = (b) => crypto.createHash('md5').update(b).digest('hex');
const streamMd5 = (f) => md5(ff(['-i', f, '-map', '0:v:0', '-c', 'copy', '-f', 'h264', '-']));
const frames = (f) => { const r = spawnSync(`${FFDIR}/ffprobe`, ['-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets,width,height', '-of', 'csv=p=0', f], {env}); return String(r.stdout).trim(); };
/** one decoded frame as PNG bytes: an accurate seek to a quarter frame before frame n (the first frame at or after it
 *  is n), decoded from the GOP's keyframe, encoded by the same ffmpeg (deterministic), hashed. The bundled ffmpeg has
 *  no framemd5 / rawvideo muxer and no select filter, so this is the reliable path */
const frameMd5s = (f, list) => list.map((n) => md5(ff(['-ss', ((n - 0.25) / 24).toFixed(6), '-i', f, '-map', '0:v:0', '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-pix_fmt', 'rgb24', '-'])));
const out = {a: path.resolve(A), b: path.resolve(B), stream_md5: {a: streamMd5(A), b: streamMd5(B)}, frames: {a: frames(A), b: frames(B)}, rows: []};
out.stream_identical = out.stream_md5.a === out.stream_md5.b;
const list = fr.map(Number), ma = frameMd5s(A, list), mb = frameMd5s(B, list);
list.forEach((n, i) => out.rows.push({f: n, a: ma[i], b: mb[i], same: ma[i] === mb[i]}));
out.frames_identical = out.rows.every((r) => r.same);
console.log(JSON.stringify({stream_identical: out.stream_identical, stream_md5: out.stream_md5, frames: out.frames, sampled: out.rows.length, sampled_identical: out.rows.filter((r) => r.same).length}, null, 1));
for (const r of out.rows) console.log(`${String(r.f).padStart(6)}  ${r.a}  ${r.b}  ${r.same ? 'same' : 'DIFFERENT'}`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(out, null, 1));
process.exit(out.frames_identical ? 0 : 1);
