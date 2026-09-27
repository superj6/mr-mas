// @ts-nocheck -- Node-only tool (bundled with esbuild: tools/build.mjs --entry), excluded from the browser typecheck.
// MR. MAS — Ep1 pixel pipeline (P0): THE PORT TEST. Act Four v5 drawn two ways, in one process, compared pixel for pixel:
//   OLD  act4/animatic/frame5.ts native5 / picture5 / anim5 on data-v5.ts (lock_v5.py's lock): what render5.ts encoded
//   NEW  pixel/frame.ts native / picture / review on pixel/act4-v5 (tools/lock.py's lock + the shots5 layouts)
// Build (from studio/):  node src/episodes/ep01/pixel/tools/build.mjs --entry src/episodes/ep01/pixel/tools/act4check.ts $S/a4c.cjs
// Run through ops/heavy.sh:
//   node $S/a4c.cjs lock                                  the lock: every ShotV5 field of every shot, and SEQS / RAILS / SUBS /
//                                                         SOUND_MARKS / V4_IDS / D6 / MIX, new vs old (light)
//   node $S/a4c.cjs frames <out.json> [--jobs 2] [--review-every 6] [--from a] [--to b]
//                                                         every frame's show frame (480 x 270) and GLYPH layers; the review frame
//                                                         (1920 x 1080) on every Nth frame + every cut + every GLYPH frame; the
//                                                         picture (1920 x 1080) on the same; md5s of the sampled frames
//   node $S/a4c.cjs pngs <dirA> <dirB>                    two Remotion GLYPH-frame dirs ({pic,anim}/NNNNN.png), pixel by pixel
import {fork} from 'child_process';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import {native5, picture5, anim5, glyphFrames5} from '../../act4/animatic/frame5';
import {SHOTS as SHOTS5, SEQS, RAILS, SUBS, SOUND_MARKS, V4_IDS, D6, MIX, ACT_FRAMES, EP_IN_FRAMES} from '../../act4/animatic/data-v5';
import {SEGMENT} from '../act4-v5/shots';
import {prepare, native, picture, review, glyphFrames} from '../frame';

const seg = prepare(SEGMENT);
const [mode, ...rest] = process.argv.slice(2);
const flag = (k, d) => { const i = rest.indexOf(`--${k}`); return i >= 0 ? rest[i + 1] : d; };
const pos = rest.filter((x, i) => !x.startsWith('--') && !(i > 0 && rest[i - 1].startsWith('--')));
const md5 = (b) => crypto.createHash('md5').update(Buffer.from(b.c.buffer, b.c.byteOffset, b.c.byteLength)).digest('hex');
const same = (a, b) => { if (a.c.length !== b.c.length) return -1; let d = 0; for (let i = 0; i < a.c.length; i++) if (a.c[i] !== b.c[i]) d++; return d; };
const J = (o) => JSON.stringify(o);
const SK = ['id', 'setup', 'beats', 'seq', 'side', 'badge', 'whip', 'tag', 'cls', 'framing', 'move', 's', 'e', 'plan', 'v4', 'verdict', 'does', 'sound', 'chars', 'lines', 'texts', 'marks'];
const LK = ['id', 'kind', 'mode', 'who', 'text', 's', 'e', 'fs', 'fe', 'os', 'via', 'face', 'lip', 'carry', 'cut', 'mouth', 'words'];
const proj = (sh) => { const o = {}; for (const k of SK) o[k] = sh[k]; o.lines = sh.lines.map((l) => { const x = {}; for (const k of LK) x[k] = l[k]; return x; }); return o; };

const lockCheck = () => {
  const L = seg.lock, diffs = [];
  if (L.shots.length !== SHOTS5.length) diffs.push(`shots ${L.shots.length} vs ${SHOTS5.length}`);
  SHOTS5.forEach((a, i) => { const b = proj(L.shots[i] ?? {}); for (const k of SK) if (J(a[k]) !== J(b[k])) diffs.push(`${a.id}.${k}`); });
  const pick = (o, ks) => Object.fromEntries(ks.map((k) => [k, o[k]]));
  const tables = {
    SEQS: J(SEQS) === J(L.seqs.map((q) => pick(q, ['id', 'chapter', 'title', 'place', 'time', 's', 'e', 'cue']))), RAILS: J(RAILS) === J(L.rails), SUBS: J(SUBS) === J(L.subs),
    SOUND_MARKS: J(SOUND_MARKS) === J(L.soundMarks), V4_IDS: J(V4_IDS) === J(L.v4Ids), D6: J(D6) === J(L.refs.D6), MIX: J(MIX) === J(L.mix),
    ACT_FRAMES: ACT_FRAMES === L.frames, EP_IN_FRAMES: EP_IN_FRAMES === L.epIn,
  };
  const g5 = glyphFrames5(), g = glyphFrames(seg);
  return {shots: SHOTS5.length, shot_fields_compared: SHOTS5.length * SK.length, shot_fields_differing: diffs, tables, glyph_frames: {old: g5.length, new: g.length, identical: J(g5) === J(g)}, identical: !diffs.length && Object.values(tables).every(Boolean) && J(g5) === J(g)};
};

const frameRange = async (from, to, every, glyphSet, cutSet) => {
  const out = {from, to, frames: 0, native_differ: [], layers_differ: [], review_checked: 0, review_differ: [], picture_checked: 0, picture_differ: [], samples: [], ms_old: 0, ms_new: 0};
  for (let f = from; f < to; f++) {
    let t = Date.now();
    const a = native5(f);
    out.ms_old += Date.now() - t; t = Date.now();
    const b = native(seg, f);
    out.ms_new += Date.now() - t;
    out.frames++;
    const d = same(a.fb, b.fb);
    if (d !== 0) out.native_differ.push([f, d]);
    if (J(a.layers) !== J(b.layers)) out.layers_differ.push(f);
    const sample = (f - from) % every === 0 || glyphSet.has(f) || cutSet.has(f);
    if (sample) {
      const ra = anim5(f, undefined, {n: a}), rb = review(seg, f, undefined, {n: b});
      const dr = same(ra, rb); out.review_checked++; if (dr !== 0) out.review_differ.push([f, dr]);
      const pa = picture5(f, undefined, {n: a}), pb = picture(seg, f, undefined, {n: b});
      const dp = same(pa, pb); out.picture_checked++; if (dp !== 0) out.picture_differ.push([f, dp]);
      if (glyphSet.has(f) || cutSet.has(f) || (f - from) % (every * 40) === 0) out.samples.push({f, shot: b.sh.id, glyph: b.layers.length > 0, picture_md5_old: md5(pa), picture_md5_new: md5(pb), review_md5_old: md5(ra), review_md5_new: md5(rb)});
    }
  }
  return out;
};

(async () => {
  if (mode === 'lock') { const r = lockCheck(); console.log(JSON.stringify(r, null, 1)); process.exit(r.identical ? 0 : 1); }
  if (mode === 'part') { // worker
    const [from, to, every, file] = pos;
    const g = new Set(glyphFrames(seg)), cuts = new Set(seg.shots.flatMap((s) => [s.s, s.e - 1]));
    const r = await frameRange(Number(from), Number(to), Number(every), g, cuts);
    fs.writeFileSync(file, JSON.stringify(r));
    process.exit(0);
  }
  if (mode === 'frames') {
    const out = pos[0], jobs = Number(flag('jobs', 2)), every = Number(flag('review-every', 6)), from = Number(flag('from', 0)), to = Number(flag('to', seg.frames));
    const t0 = Date.now(), per = Math.ceil((to - from) / jobs), parts = [];
    await Promise.all(Array.from({length: jobs}, (_, j) => new Promise((res, rej) => {
      const a = from + j * per, b = Math.min(to, a + per), file = `${out}.part${j}.json`;
      if (a >= b) return res(0);
      parts.push(file);
      const p = fork(process.argv[1], ['part', String(a), String(b), String(every), file]);
      p.on('exit', (c) => (c === 0 ? res(0) : rej(new Error(`part ${j} exit ${c}`))));
    })));
    const rs = parts.map((f) => JSON.parse(fs.readFileSync(f, 'utf8')));
    for (const f of parts) fs.rmSync(f);
    const sum = (k) => rs.reduce((a, r) => a + (Array.isArray(r[k]) ? r[k].length : r[k]), 0), cat = (k) => rs.flatMap((r) => r[k]);
    const report = {
      test: 'Act Four v5: frame5.ts (data-v5.ts) vs pixel/frame.ts (pixel/act4-v5, tools/lock.py)', from, to, jobs, review_every: every, seconds: Math.round((Date.now() - t0) / 1000),
      lock: lockCheck(),
      native: {frames: sum('frames'), differing: cat('native_differ')}, glyph_layers: {frames: sum('frames'), differing: cat('layers_differ')},
      picture: {frames: sum('picture_checked'), differing: cat('picture_differ')}, review: {frames: sum('review_checked'), differing: cat('review_differ')},
      ms_per_frame_native: {old: +(sum('ms_old') / sum('frames')).toFixed(2), new: +(sum('ms_new') / sum('frames')).toFixed(2)},
      samples: cat('samples'),
    };
    report.identical = report.lock.identical && !report.native.differing.length && !report.glyph_layers.differing.length && !report.picture.differing.length && !report.review.differing.length;
    fs.writeFileSync(out, JSON.stringify(report, null, 1));
    console.log(JSON.stringify({identical: report.identical, native: `${report.native.frames} frames, ${report.native.differing.length} differ`, layers: `${report.glyph_layers.differing.length} differ`, picture: `${report.picture.frames} frames, ${report.picture.differing.length} differ`, review: `${report.review.frames} frames, ${report.review.differing.length} differ`, lock: report.lock.identical, ms: report.ms_per_frame_native, seconds: report.seconds, out}));
    process.exit(report.identical ? 0 : 1);
  }
  if (mode === 'pngs') {
    const [A, B] = pos, rows = [];
    const read = (file) => { // 8-bit RGB(A), as Remotion writes
      const d = fs.readFileSync(file); let o = 8, W = 0, H = 0, ct = 0; const idat = [];
      while (o < d.length) { const len = d.readUInt32BE(o), type = d.toString('ascii', o + 4, o + 8), body = d.subarray(o + 8, o + 8 + len); if (type === 'IHDR') { W = body.readUInt32BE(0); H = body.readUInt32BE(4); ct = body[9]; } if (type === 'IDAT') idat.push(body); if (type === 'IEND') break; o += 12 + len; }
      const bpp = ct === 6 ? 4 : 3, raw = zlib.inflateSync(Buffer.concat(idat)), stride = W * bpp, cur = Buffer.alloc(stride), prev = Buffer.alloc(stride), px = new Uint32Array(W * H);
      for (let y = 0; y < H; y++) { const ft = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)); for (let i = 0; i < stride; i++) { const a = i >= bpp ? cur[i - bpp] : 0, up = prev[i], c = i >= bpp ? prev[i - bpp] : 0; let v = src[i]; if (ft === 1) v += a; else if (ft === 2) v += up; else if (ft === 3) v += (a + up) >> 1; else if (ft === 4) { const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; } cur[i] = v & 255; } for (let x = 0; x < W; x++) px[y * W + x] = (cur[x * bpp] << 16) | (cur[x * bpp + 1] << 8) | cur[x * bpp + 2]; cur.copy(prev); }
      return px;
    };
    for (const kind of ['pic', 'anim']) {
      for (const f of fs.readdirSync(`${A}/${kind}`).filter((x) => x.endsWith('.png')).sort()) {
        const b = `${B}/${kind}/${f}`;
        if (!fs.existsSync(b)) { rows.push({kind, f, missing: true}); continue; }
        const pa = read(`${A}/${kind}/${f}`), pb = read(b);
        let d = 0; for (let i = 0; i < pa.length; i++) if (pa[i] !== pb[i]) d++;
        rows.push({kind, f, pixels_differing: d, md5_a: crypto.createHash('md5').update(Buffer.from(pa.buffer)).digest('hex'), md5_b: crypto.createHash('md5').update(Buffer.from(pb.buffer)).digest('hex')});
      }
    }
    const summary = {a: A, b: B, frames: rows.length, identical: rows.every((r) => r.pixels_differing === 0), differing: rows.filter((r) => r.pixels_differing).map((r) => `${r.kind}:${r.f}=${r.pixels_differing}`), missing: rows.filter((r) => r.missing).length};
    console.log(JSON.stringify(summary));
    if (pos[2]) fs.writeFileSync(pos[2], JSON.stringify({summary, rows}, null, 1));
    process.exit(summary.identical ? 0 : 1);
  }
  console.log('modes: lock | frames <out.json> [--jobs 2] [--review-every 6] | pngs <dirA> <dirB> [out.json]');
})().catch((e) => { console.error(e); process.exit(1); });
