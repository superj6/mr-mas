// @ts-nocheck -- Node-only tool (bundled with esbuild), excluded from the browser typecheck.
// MR. MAS — Ep1 Act Four · the animatic v5 renderer (INF-RENDER5; the a4p5-render pass). The SAME frame5.ts the Remotion
// host (Animatic5.tsx: 'ep01-act4-animatic-v5' / '-v5-picture') uses, rendered in Node (no browser), piped raw to the
// bundled ffmpeg (an uncompressed AVI stream: no PNG deflate per frame), in parallel chunks cut on shot starts, then
// concatenated and muxed onto the temp track: the stick reel's mix (audio/reel/ep01-act4-v5/mix.wav, act frame 0 = its
// frame 72; $MIX overrides it). The GLYPH frames (S1.09's dissolve: real tokens need a browser) are spliced in from the
// Remotion host's own PNGs (`glyphs`); a frame with tokens and no PNG falls back to v4's 2-pixel marks and is reported.
//
// Build (from studio/):   npx esbuild src/episodes/ep01/act4/animatic/tools/render5.ts --bundle --platform=node --outfile=$S/r5.cjs
// Run every heavy mode through ops/heavy.sh (the laptop: at most 2 heavy jobs machine-wide, low priority):
//   node $S/r5.cjs check                                   every shot has a layout; tiling; fallbacks; the mix's missing spots
//   node $S/r5.cjs glyphspan                               the act frames that carry GLYPH tokens (light)
//   ../ops/heavy.sh node $S/r5.cjs bundle <dir>            one Remotion bundle of entry.tsx; then BUNDLE=<dir> for glyphs / compare
//   ../ops/heavy.sh node $S/r5.cjs glyphs <dir> [conc]     Remotion renders those frames (both compositions) + 2 plain frames
//                                                          either side, as PNGs in <dir>/{anim,pic}/; checks Node = Remotion
//                                                          on the plain ones (pixel-identical) and on the glyph frames
//                                                          outside the room area
//   GLYPH_DIR=<dir> ../ops/heavy.sh node $S/r5.cjs both <anim.mp4> <picture.mp4> [jobs 2] [from] [to]
//                                                          the act, both outputs in one pass (each frame's layout drawn once)
//   GLYPH_DIR=<dir> ../ops/heavy.sh node $S/r5.cjs anim|picture <out.mp4> [jobs] [from] [to]    one output
//   ../ops/heavy.sh node $S/r5.cjs compare <out.mp4> [conc] the Cancel click both ways (Cancel5.tsx) + the mix under each pass
//                                                          (out/ep01/act4/animatic/act4-v5-cancel-compare.mp4)
//   node $S/r5.cjs contact <out.png> [native]              one still per shot (its middle frame), 240x135 or 480x270 tiles
//   node $S/r5.cjs stills|picstills|native <dir> <f> ...   review frames (1920x1080) | pictures (1920x1080) | 480x270 at 2x
//   node $S/r5.cjs cuts <dir> | cutpairs <dir>             the picture at every cut | outgoing/incoming pairs on sheets
//   node $S/r5.cjs ledger <out.json>                       what each shot's layout is built from (shotlist_v5.py reads it)
// Env: X264_THREADS (default 2 per encoder), SEGDIR (where segments go; default beside the output), MIX, GLYPH_DIR.
import {spawn, fork, execFileSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import {Buf} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {native5, picture5, anim5, glyphFrames5, MIX_MISSING, PIC_W, PIC_H, ANIM_W, ANIM_H, ACT_FRAMES, tcOf} from '../frame5';
import {otext} from '../frame';
import {SHOTS, MIX, D6} from '../data-v5';
import {DRAW5, DRAW5_FAILED, ledger5, missingShots5, textChecks5, OPT5, CANCEL_CLICK} from '../shots5';
import {COMPARE_LEN, COMPARE_PARTS, CLIP_FROM, CLIP_TO, SLATE} from '../compare5';

const REPO = '/home/jgon/project/art/mrmas';
const STUDIO = `${REPO}/studio`;
const FFDIR = `${STUDIO}/node_modules/@remotion/compositor-linux-x64-gnu`;
const FF = `${FFDIR}/ffmpeg`;
const ENV = {...process.env, LD_LIBRARY_PATH: FFDIR};
const ENTRY = 'src/episodes/ep01/act4/animatic/entry.tsx';
const TRACK = process.env.MIX ?? `${REPO}/${MIX.path}`;
const GLYPH_DIR = process.env.GLYPH_DIR ?? '';
/** a Remotion bundle of entry.tsx (`bundle <dir>`), so `glyphs` and `compare` don't re-bundle: $BUNDLE, else the entry */
const SERVE = process.env.BUNDLE ? path.resolve(process.env.BUNDLE) : ENTRY;
const [mode, ...args] = process.argv.slice(2);

// ------------------------------------------------------------------ PNG in and out (stills, sheets, the spliced frames)
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf, s, e) => { let c = 0xffffffff; for (let i = s; i < e; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii'); data.copy(out, 8); out.writeUInt32BE(crc32(out, 4, 8 + data.length), 8 + data.length); return out; };
export const writePNG = (file, b, scale = 1) => {
  const W = b.w * scale, H = b.h * scale;
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) { let o = y * (W * 3 + 1); raw[o++] = 0; const row = Math.floor(y / scale) * b.w; for (let x = 0; x < W; x++) { const v = b.c[row + Math.floor(x / scale)]; raw[o++] = (v >> 16) & 255; raw[o++] = (v >> 8) & 255; raw[o++] = v & 255; } }
  const h = Buffer.alloc(13); h.writeUInt32BE(W, 0); h.writeUInt32BE(H, 4); h[8] = 8; h[9] = 2;
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', h), chunk('IDAT', zlib.deflateSync(raw, {level: 6})), chunk('IEND', Buffer.alloc(0))]));
};
/** 8-bit RGB / RGBA PNG (non-interlaced, as Remotion writes them) -> Buf */
export const readPNG = (file) => {
  const d = fs.readFileSync(file);
  let o = 8, W = 0, H = 0, ct = 0; const idat = [];
  while (o < d.length) {
    const len = d.readUInt32BE(o), type = d.toString('ascii', o + 4, o + 8), body = d.subarray(o + 8, o + 8 + len);
    if (type === 'IHDR') { W = body.readUInt32BE(0); H = body.readUInt32BE(4); ct = body[9]; if (body[8] !== 8 || body[12] !== 0) throw new Error(`${file}: unsupported PNG`); }
    if (type === 'IDAT') idat.push(body);
    if (type === 'IEND') break;
    o += 12 + len;
  }
  const bpp = ct === 6 ? 4 : ct === 2 ? 3 : 0;
  if (!bpp) throw new Error(`${file}: colour type ${ct}`);
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = W * bpp;
  const cur = Buffer.alloc(stride), prev = Buffer.alloc(stride);
  const b = new Buf(W, H, 0);
  for (let y = 0; y < H; y++) {
    const ft = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, up = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (ft === 1) v += a; else if (ft === 2) v += up; else if (ft === 3) v += (a + up) >> 1;
      else if (ft === 4) { const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      cur[i] = v & 255;
    }
    for (let x = 0; x < W; x++) b.c[y * W + x] = (cur[x * bpp] << 16) | (cur[x * bpp + 1] << 8) | cur[x * bpp + 2];
    cur.copy(prev);
  }
  return b;
};

// ------------------------------------------------------------------ the encoder: raw BGRX frames in an AVI stream -> x264
// (the bundled ffmpeg has no rawvideo demuxer, but its AVI demuxer takes uncompressed DIB frames from a pipe)
const aviHeader = (W, H, N) => {
  const u32 = (v) => { const x = Buffer.alloc(4); x.writeUInt32LE(v >>> 0); return x; }, u16 = (v) => { const x = Buffer.alloc(2); x.writeUInt16LE(v); return x; };
  const fb = W * H * 4, movi = 4 + N * (8 + fb);
  const ck = (id, d) => Buffer.concat([Buffer.from(id), u32(d.length), d]);
  const list = (t, d) => Buffer.concat([Buffer.from('LIST'), u32(4 + d.length), Buffer.from(t), d]);
  const avih = Buffer.concat([u32(41667), u32(fb * 24), u32(0), u32(0x10), u32(N), u32(0), u32(1), u32(fb), u32(W), u32(H), u32(0), u32(0), u32(0), u32(0)]);
  const strh = Buffer.concat([Buffer.from('vids'), Buffer.from('DIB '), u32(0), u16(0), u16(0), u32(0), u32(1), u32(24), u32(0), u32(N), u32(fb), u32(0xffffffff), u32(0), u16(0), u16(0), u16(W), u16(H)]);
  const strf = Buffer.concat([u32(40), u32(W), u32(H), u16(1), u16(32), u32(0), u32(fb), u32(0), u32(0), u32(0), u32(0)]);
  const hdrl = list('hdrl', Buffer.concat([ck('avih', avih), list('strl', Buffer.concat([ck('strh', strh), ck('strf', strf)]))]));
  return Buffer.concat([Buffer.from('RIFF'), u32(4 + hdrl.length + 8 + movi), Buffer.from('AVI '), hdrl, Buffer.from('LIST'), u32(movi), Buffer.from('movi')]);
};
const openEncoder = (outFile, W, H, N) => {
  const ff = spawn(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'avi', '-i', 'pipe:0',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-g', '48', '-threads', process.env.X264_THREADS ?? '2', outFile], {env: ENV, stdio: ['pipe', 'inherit', 'inherit']});
  const done = new Promise((resolve, reject) => { ff.on('error', reject); ff.on('close', (c) => (c === 0 ? resolve(0) : reject(new Error(`ffmpeg ${c} (${outFile})`)))); });
  ff.stdin.write(aviHeader(W, H, N));
  const fbytes = W * H * 4;
  return {
    /** write one frame (Buf W x H); resolves when the pipe can take more */
    write: (b) => {
      const out = Buffer.allocUnsafe(8 + fbytes); out.write('00db', 0, 'ascii'); out.writeUInt32LE(fbytes, 4);
      const src = Buffer.from(b.c.buffer, b.c.byteOffset, fbytes), row = W * 4;
      for (let y = 0; y < H; y++) src.copy(out, 8 + (H - 1 - y) * row, y * row, (y + 1) * row); // DIB rows run bottom-up
      return ff.stdin.write(out) ? Promise.resolve() : new Promise((r) => ff.stdin.once('drain', r));
    },
    end: () => { ff.stdin.end(); return done; },
  };
};

// ------------------------------------------------------------------ the GLYPH splice
const glyphPNG = (kind, f) => (GLYPH_DIR ? path.join(GLYPH_DIR, kind, `${String(f).padStart(5, '0')}.png`) : '');
const spliced = {pic: 0, anim: 0}, marked = [], spliceOff = [];
const frameInto = (f, kind, target, n) => {
  const png = n.layers.length ? glyphPNG(kind, f) : '';
  if (png && fs.existsSync(png)) {
    const b = readPNG(png);
    // the spliced frame must be Node's own frame outside the room area (the tokens live only inside it)
    const mine = kind === 'pic' ? picture5(f, undefined, {n}) : anim5(f, undefined, {n}), sc = kind === 'pic' ? 4 : 3;
    let off = 0;
    for (let i = 0; i < b.c.length; i++) if (b.c[i] !== mine.c[i]) { const x = i % b.w, y = (i / b.w) | 0; if (!(x < 480 * sc && y < 203 * sc)) off++; }
    if (off) spliceOff.push(`${kind}:${f}:${off}px`);
    target.c.set(b.c); spliced[kind]++; return;
  }
  let nn = n;
  if (n.layers.length) { nn = native5(f, {marks: true}); marked.push(`${kind}:${f}`); }
  if (kind === 'pic') picture5(f, target, {n: nn}); else anim5(f, target, {n: nn});
};

// ------------------------------------------------------------------ segments and the parallel render
const encodeRange = async (outs, from, to) => {
  const N = to - from, t0 = Date.now();
  const enc = {}, bufs = {};
  if (outs.anim) { enc.anim = openEncoder(outs.anim, ANIM_W, ANIM_H, N); bufs.anim = new Buf(ANIM_W, ANIM_H, 0); }
  if (outs.pic) { enc.pic = openEncoder(outs.pic, PIC_W, PIC_H, N); bufs.pic = new Buf(PIC_W, PIC_H, 0); }
  for (let f = from; f < to; f++) {
    const n = native5(f);
    const w = [];
    for (const kind of Object.keys(enc)) { frameInto(f, kind, bufs[kind], n); w.push(enc[kind].write(bufs[kind])); }
    await Promise.all(w);
    if ((f + 1 - from) % 480 === 0) process.stderr.write(`[${from}-${to}] ${f + 1 - from}/${N} ${((Date.now() - t0) / (f + 1 - from)).toFixed(1)} ms/f\n`);
  }
  await Promise.all(Object.values(enc).map((e) => e.end()));
  return {ms: Date.now() - t0};
};
const run = (cmd, a, o = {}) => new Promise((resolve, reject) => { const p = spawn(cmd, a, {env: ENV, stdio: 'inherit', ...o}); p.on('close', (c) => (c === 0 ? resolve(0) : reject(new Error(cmd + ' ' + c)))); });
const muxTrack = async (silent, out, from, to) => {
  const ss = ((MIX.offsetFrames + from) / 24).toFixed(4), dur = ((to - from) / 24).toFixed(4);
  if (TRACK && fs.existsSync(TRACK)) await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-ss', ss, '-t', dur, '-i', TRACK, '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000', '-movflags', '+faststart', out]);
  else { console.warn('no temp track at', TRACK, '(silent picture)'); await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-c:v', 'copy', '-movflags', '+faststart', out]); }
};
const renderAct = async (outs, jobs, from, to) => {
  const t0 = Date.now();
  const base = path.dirname(outs.anim ?? outs.pic);
  fs.mkdirSync(base, {recursive: true});
  const tmp = fs.mkdtempSync(path.join(process.env.SEGDIR ?? base, '.seg5-'));
  const per = Math.ceil((to - from) / jobs), cuts = [from];
  for (let j = 1; j < jobs; j++) { const want = from + j * per; const s = SHOTS.find((x) => x.s >= want); cuts.push(Math.min(to, s ? s.s : to)); }
  cuts.push(to);
  const segs = [];
  await Promise.all(cuts.slice(0, -1).map((a, j) => new Promise((resolve, reject) => {
    const b = cuts[j + 1];
    if (b <= a) return resolve(0);
    const sg = {anim: outs.anim ? path.join(tmp, `a${String(j).padStart(2, '0')}.mp4`) : '', pic: outs.pic ? path.join(tmp, `p${String(j).padStart(2, '0')}.mp4`) : ''};
    segs[j] = sg;
    const p = fork(process.argv[1], ['segment', sg.anim || '-', sg.pic || '-', String(a), String(b)], {env: ENV});
    p.on('exit', (c) => (c === 0 ? resolve(0) : reject(new Error(`segment ${j} exit ${c}`))));
  })));
  // the sources on disk at render time (rebuild r5.cjs after editing them: the bundle is what renders)
  const md5 = (f) => { try { return require('crypto').createHash('md5').update(fs.readFileSync(`${STUDIO}/src/episodes/ep01/act4/animatic/${f}`)).digest('hex'); } catch { return null; } };
  const sources = Object.fromEntries(['shots5.ts', 'lipsync5.ts', 'frame5.ts', 'data-v5.ts'].map((f) => [f, md5(f)]));
  const report = {frames: to - from, from, to, jobs, track: TRACK, glyph_dir: GLYPH_DIR || null, bundle_built: fs.statSync(process.argv[1]).mtime.toISOString(), sources, segments: []};
  for (const kind of ['anim', 'pic']) {
    if (!outs[kind]) continue;
    const list = path.join(tmp, `${kind}.txt`);
    fs.writeFileSync(list, segs.filter(Boolean).map((s) => `file '${s[kind]}'`).join('\n') + '\n');
    const silent = path.join(tmp, `${kind}-silent.mp4`);
    await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
    await muxTrack(silent, outs[kind], from, to);
    console.log('wrote', outs[kind], `${to - from} frames`);
  }
  for (const f of fs.readdirSync(tmp)) if (f.endsWith('.json')) report.segments.push(JSON.parse(fs.readFileSync(path.join(tmp, f), 'utf8')));
  fs.rmSync(tmp, {recursive: true, force: true});
  report.seconds = Math.round((Date.now() - t0) / 1000);
  const rep = `${outs.anim ?? outs.pic}.render.json`;
  fs.writeFileSync(rep, JSON.stringify(report, null, 1));
  const sp = report.segments.reduce((a, s) => ({pic: a.pic + s.spliced.pic, anim: a.anim + s.spliced.anim, marked: a.marked.concat(s.marked), off: a.off.concat(s.spliceOff), failed: {...a.failed, ...s.failed}}), {pic: 0, anim: 0, marked: [], off: [], failed: {}});
  report.summary = sp;
  fs.writeFileSync(rep, JSON.stringify(report, null, 1));
  console.log(`done in ${report.seconds} s · GLYPH frames spliced from Remotion: pic ${sp.pic}, anim ${sp.anim} (off-room mismatches: ${sp.off.length ? sp.off.join(' ') : 'none'}) · stand-in marks: ${sp.marked.length}${sp.marked.length ? ' ' + sp.marked.slice(0, 8).join(' ') : ''} · failed layouts: ${Object.keys(sp.failed).length ? JSON.stringify(sp.failed) : 'none'} · ${rep}`);
};

// ------------------------------------------------------------------ sheets
const box2 = (fb, x, y, W, H) => { // 2x2 box downsample of fb's (x..x+2W, y..y+2H) -> W x H
  const out = new Uint32Array(W * H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    let r = 0, g = 0, b = 0;
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const v = fb.c[(y + j * 2 + dy) * fb.w + x + i * 2 + dx]; r += (v >> 16) & 255; g += (v >> 8) & 255; b += v & 255; }
    out[j * W + i] = ((r >> 2) << 16) | ((g >> 2) << 8) | (b >> 2);
  }
  return out;
};
const epTc = (f) => tcOf(f).slice(0, 5);

// ------------------------------------------------------------------ modes
(async () => {
  if (mode === 'segment') { // worker: [from, to) -> its segment file(s)
    const [a, p, from, to] = args;
    const outs = {anim: a !== '-' ? a : null, pic: p !== '-' ? p : null};
    const r = await encodeRange(outs, Number(from), Number(to));
    fs.writeFileSync(path.join(path.dirname(a !== '-' ? a : p), `seg-${from}.json`), JSON.stringify({from: Number(from), to: Number(to), ms: r.ms, spliced, marked, spliceOff, failed: Object.fromEntries(DRAW5_FAILED)}));
    process.exit(0);
  }
  if (mode === 'both' || mode === 'anim' || mode === 'picture') {
    const outs = mode === 'both' ? {anim: args[0], pic: args[1]} : mode === 'anim' ? {anim: args[0]} : {pic: args[0]};
    const rest = args.slice(mode === 'both' ? 2 : 1);
    const jobs = Number(rest[0] ?? 2), from = Number(rest[1] ?? 0), to = Number(rest[2] ?? ACT_FRAMES);
    if (!GLYPH_DIR) console.warn('GLYPH_DIR not set: the GLYPH frames will carry v4\'s 2-pixel stand-in marks (run `glyphs` first)');
    await renderAct(outs, jobs, from, to);
    return;
  }
  if (mode === 'bundle') { // one webpack bundle of entry.tsx for the Remotion modes (BUNDLE=<dir>)
    await run('npx', ['remotion', 'bundle', ENTRY, `--out-dir=${path.resolve(args[0])}`, '--log=error'], {cwd: STUDIO});
    console.log('bundled', ENTRY, '->', path.resolve(args[0]));
    return;
  }
  if (mode === 'glyphspan') {
    const fr = glyphFrames5();
    console.log(JSON.stringify({frames: fr.length, from: fr[0], to: fr[fr.length - 1], contiguous: fr.length ? fr[fr.length - 1] - fr[0] + 1 === fr.length : true}));
    return;
  }
  if (mode === 'glyphs') { // Remotion renders the GLYPH frames of both compositions (+ two plain frames either side)
    const dir = path.resolve(args[0]), conc = args[1] ?? '2';
    const fr = glyphFrames5();
    if (!fr.length) { console.log('no GLYPH frames'); return; }
    const a = fr[0] - 2, b = fr[fr.length - 1] + 2;
    for (const [kind, comp] of [['pic', 'ep01-act4-animatic-v5-picture'], ['anim', 'ep01-act4-animatic-v5']]) {
      const raw = path.join(dir, `${kind}-raw`);
      fs.rmSync(raw, {recursive: true, force: true});
      await run('npx', ['remotion', 'render', SERVE, comp, raw, '--sequence', '--image-format=png', `--frames=${a}-${b}`, `--concurrency=${conc}`, '--log=error'], {cwd: STUDIO});
      fs.mkdirSync(path.join(dir, kind), {recursive: true});
      for (const f of fs.readdirSync(raw)) { const m = /(\d+)\.png$/.exec(f); if (m) fs.renameSync(path.join(raw, f), path.join(dir, kind, `${m[1].padStart(5, '0')}.png`)); }
      fs.rmSync(raw, {recursive: true, force: true});
    }
    // the checks: Node = Remotion on the plain frames (all pixels) and on the GLYPH frames outside the room area
    const res = [];
    for (let f = a; f <= b; f++) for (const kind of ['pic', 'anim']) {
      const file = path.join(dir, kind, `${String(f).padStart(5, '0')}.png`);
      if (!fs.existsSync(file)) { res.push({f, kind, missing: true}); continue; }
      const R = readPNG(file), n = native5(f), N = kind === 'pic' ? picture5(f, undefined, {n}) : anim5(f, undefined, {n});
      const sc = kind === 'pic' ? 4 : 3, glyph = n.layers.length > 0;
      let diff = 0, diffOut = 0;
      for (let i = 0; i < R.c.length; i++) if (R.c[i] !== N.c[i]) { diff++; const x = i % R.w, y = (i / R.w) | 0; if (!(x < 480 * sc && y < 203 * sc)) diffOut++; }
      res.push({f, kind, glyph, pixels_differing: diff, differing_outside_room: diffOut});
    }
    const plain = res.filter((r) => !r.glyph && !r.missing), gl = res.filter((r) => r.glyph);
    const summary = {frames: `${a}-${b}`, glyph_frames: fr.length, plain_identical: plain.every((r) => r.pixels_differing === 0), plain: plain.map((r) => `${r.kind}:${r.f}=${r.pixels_differing}`),
      glyph_outside_room_identical: gl.every((r) => r.differing_outside_room === 0), glyph_room_pixels_changed_median: gl.map((r) => r.pixels_differing).sort((x, y) => x - y)[gl.length >> 1], missing: res.filter((r) => r.missing).length};
    fs.writeFileSync(path.join(dir, 'check.json'), JSON.stringify({summary, rows: res}, null, 1));
    console.log(JSON.stringify(summary));
    return;
  }
  if (mode === 'compare') { // the Cancel click both ways (Cancel5.tsx): Remotion picture + the mix under each pass
    const out = path.resolve(args[0]), conc = args[1] ?? '2';
    const tmp = fs.mkdtempSync(path.join(process.env.SEGDIR ?? path.dirname(out), '.cmp5-'));
    // COMPARE_SILENT=<mp4>: reuse an earlier render of the composition (only re-mux the sound)
    const silent = process.env.COMPARE_SILENT ? path.resolve(process.env.COMPARE_SILENT) : path.join(tmp, 'silent.mp4');
    if (!process.env.COMPARE_SILENT) await run('npx', ['remotion', 'render', SERVE, 'ep01-act4-v5-cancel-compare', silent, `--concurrency=${conc}`, '--crf=16', '--log=error'], {cwd: STUDIO});
    const ss = ((MIX.offsetFrames + CLIP_FROM) / 24).toFixed(4), dur = ((CLIP_TO - CLIP_FROM) / 24).toFixed(4), sl = (SLATE / 24).toFixed(4);
    // the bundled ffmpeg has no asplit: the track goes in twice. Silence under each slate, the mix under each pass
    const clip = (i, o) => `[${i}:a]atrim=start=${ss}:duration=${dur},asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[${o}]`;
    const hush = (o) => `anullsrc=r=48000:cl=stereo,atrim=duration=${sl},aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[${o}]`;
    const fc = `${clip(1, 'c1')};${clip(2, 'c2')};${hush('s1')};${hush('s2')};[s1][c1][s2][c2]concat=n=4:v=0:a=1[a]`;
    await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-i', TRACK, '-i', TRACK, '-filter_complex', fc, '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]);
    fs.rmSync(tmp, {recursive: true, force: true});
    console.log('wrote', out, `${COMPARE_LEN} frames`, JSON.stringify(COMPARE_PARTS), `clip act ${CLIP_FROM}-${CLIP_TO}, click ${CANCEL_CLICK}`);
    return;
  }
  if (mode === 'stills' || mode === 'picstills' || mode === 'native') {
    const dir = args[0];
    for (const s of args.slice(1)) {
      const f = Number(s), n = native5(f, {marks: true});
      const name = `${mode === 'native' ? 'n' : mode === 'picstills' ? 'p' : 'f'}${String(f).padStart(5, '0')}-${n.sh.id}.png`;
      if (mode === 'native') writePNG(`${dir}/${name}`, n.fb, 2);
      else writePNG(`${dir}/${name}`, mode === 'stills' ? anim5(f, undefined, {n}) : picture5(f, undefined, {n}));
      console.log('wrote', `${dir}/${name}`, n.layers.length ? '(GLYPH frame: stand-in marks in a Node still)' : '');
    }
    return;
  }
  if (mode === 'cuts') {
    const dir = args[0];
    SHOTS.forEach((sh, i) => { for (const [tag, f] of [['a', sh.s], ['b', Math.min(sh.e - 1, sh.s + 6)]]) writePNG(`${dir}/${String(i + 1).padStart(2, '0')}${tag}-${sh.id}-f${f}.png`, native5(f, {marks: true}).fb, 1); });
    console.log('wrote', SHOTS.length * 2, 'stills to', dir);
    return;
  }
  if (mode === 'cutpairs') {
    const dir = args[0], per = Number(args[1] ?? 28);
    const pairs = SHOTS.slice(1).map((sh, i) => ({a: SHOTS[i], b: sh}));
    const CW = 240, CH = 135, LH = 16, COLS = 4, W = COLS * (CW * 2 + 12);
    for (let p0 = 0, n = 0; p0 < pairs.length; p0 += per, n++) {
      const ch = pairs.slice(p0, p0 + per), rows = Math.ceil(ch.length / COLS);
      const sheet = new Buf(W, rows * (CH + LH + 6), 0x07080d);
      ch.forEach(({a, b}, i) => {
        const x0 = (i % COLS) * (CW * 2 + 12), y0 = Math.floor(i / COLS) * (CH + LH + 6);
        [[a, a.e - 1], [b, Math.min(b.e - 1, b.s + 2)]].forEach(([sh, f], j) => { const px = box2(native5(f, {marks: true}).fb, 0, 0, CW, CH); for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) sheet.c[(y0 + y) * W + x0 + j * CW + x] = px[y * CW + x]; });
        otext(sheet, `${a.id} | ${b.id}  (${((a.e - a.s) / 24).toFixed(2)}s | ${((b.e - b.s) / 24).toFixed(2)}s)`, x0 + 2, y0 + CH + 4, 1, 0xf2efe6);
      });
      writePNG(`${dir}/cutpairs-${n + 1}.png`, sheet, 1);
    }
    console.log('wrote cut pairs to', dir);
    return;
  }
  if (mode === 'contact') { // one still per shot (its middle frame): `native` = 480 x 270 tiles at 1x, else 240 x 135
    const out = args[0], nat = args[1] === 'native';
    const COLS = nat ? 6 : 8, CW = nat ? 480 : 240, CH = nat ? 270 : 135, LH = 30, W = COLS * CW, rows = Math.ceil(SHOTS.length / COLS);
    const H = 70 + rows * (CH + LH);
    const sheet = new Buf(W, H, 0x07080d);
    const endTc = tcOf(ACT_FRAMES);
    otext(sheet, `MR. MAS · EP1 ACT FOUR · ANIMATIC v5 (TIMING LOCK v5 = THE APPROVED STICK TIMING) · ONE STILL PER SHOT (ITS MIDDLE FRAME)${nat ? ' · 480 x 270 AT 1X' : ''}`, 12, 14, 2, 0xf2efe6);
    otext(sheet, `${SHOTS.length} SHOTS · ${ACT_FRAMES} F · ${tcOf(0)} → ${endTc} · HIS SIDE = CYAN RULE, THE BOARD'S SIDE = AMBER · R = V4 LAYOUT RE-TIMED, C = V4 + V5 ART, N = NEW · PINK = HOLDS A STAND-IN (DRAWN, NOT A LABEL)`, 12, 40, 1, 0x8a93a8);
    SHOTS.forEach((sh, i) => {
      const f = Math.floor((sh.s + sh.e) / 2);
      const n = native5(f, {marks: true});
      const x0 = (i % COLS) * CW, y0 = 70 + Math.floor(i / COLS) * (CH + LH);
      if (nat) for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) sheet.c[(y0 + y) * W + x0 + x] = n.fb.c[y * 480 + x];
      else { const px = box2(n.fb, 0, 0, CW, CH); for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) sheet.c[(y0 + y) * W + x0 + x] = px[y * CW + x]; }
      const col = sh.side === 'MAS' ? 0x3aa6c8 : 0xd08a3a;
      for (let x = 0; x < CW - 4; x++) sheet.c[(y0 + CH) * W + x0 + x] = col;
      const kind = n.fallback ? 'FALLBACK' : DRAW5[sh.id]?.kind ?? '?';
      otext(sheet, `${sh.id} ${kind} ${sh.cls} ${sh.tag}`.slice(0, nat ? 70 : 36), x0 + 2, y0 + CH + 5, 1, n.fallback ? 0xff7a7a : 0xf2efe6);
      const tl = `${epTc(sh.s)} · ${((sh.e - sh.s) / 24).toFixed(2)}s`;
      otext(sheet, tl, x0 + CW - (tl.length * 6) - 4, y0 + CH + 17, 1, 0x8a93a8);
      otext(sheet, (n.standin ? 'stand-in · ' : '') + sh.framing.slice(0, nat ? 48 : 22), x0 + 2, y0 + CH + 17, 1, n.standin ? 0xe7a0c4 : 0x5f9f78);
    });
    writePNG(out, sheet, 1);
    console.log('wrote', out, W, H, 'fallbacks at the middle frames:', [...DRAW5_FAILED.keys()].join(' ') || 'none');
    return;
  }
  if (mode === 'ledger') {
    const rows = ledger5().map((r) => { const sh = SHOTS.find((s) => s.id === r.id); return {...r, tag: sh.tag, cls: sh.cls, framing: sh.framing}; });
    fs.writeFileSync(args[0], JSON.stringify(rows, null, 1));
    console.log('wrote', args[0], rows.length, 'stand-ins', rows.filter((r) => r.standin).length);
    return;
  }
  if (mode === 'check') {
    const problems = [];
    const missing = missingShots5();
    if (missing.length) problems.push(`shots without a layout: ${missing.join(' ')}`);
    let t = 0; for (const s of SHOTS) { if (s.s !== t) problems.push(`gap before ${s.id}`); t = s.e; }
    if (t !== ACT_FRAMES) problems.push(`shots end at ${t}, act is ${ACT_FRAMES}`);
    // every shot's first / middle / last frame draws without the stick fallback
    for (const s of SHOTS) for (const f of [s.s, Math.floor((s.s + s.e) / 2), s.e - 1]) if (native5(f).fallback) problems.push(`fallback at ${s.id} f${f}`);
    const tc = textChecks5(); if (tc.length) problems.push(`text checks: ${JSON.stringify(tc)}`);
    // the temp track: its length, and the sound spots it lacks (re-derived; frame5.ts MIX_MISSING must agree)
    const wav = fs.readFileSync(TRACK).subarray(0, 64 * 1024);
    let o = 12, frames = null; while (o < wav.length - 8) { const id = wav.toString('ascii', o, o + 4), len = wav.readUInt32LE(o + 4); if (id === 'fmt ') var fmt = {ch: wav.readUInt16LE(o + 10), sr: wav.readUInt32LE(o + 12), bits: wav.readUInt16LE(o + 22)}; if (id === 'data') { frames = (len / (fmt.ch * fmt.bits / 8)) / fmt.sr * 24; break; } o += 8 + len + (len & 1); }
    if (Math.abs(frames - MIX.frames) > 0.5) problems.push(`the temp track is ${frames} frames, the lock says ${MIX.frames}`);
    const A = JSON.parse(fs.readFileSync(`${REPO}/show/reel/ep01-act4-v5.json`, 'utf8')), Hh = JSON.parse(fs.readFileSync(`${REPO}/audio/reel/ep01-act4-v5/history/v5a-1508/ep01-act4-v5.json`, 'utf8'));
    const hb = new Map(Hh.beats.map((b) => [b.id, b]));
    const newer = [];
    for (const b of A.beats) { const a = JSON.stringify(b.sounds ?? []), h = JSON.stringify(hb.get(b.id)?.sounds ?? []); if (a !== h) newer.push(b.id); }
    const lockMissing = new Set();
    for (const sh of SHOTS) for (const x of (sh.sound ? sh.sound.split(' · ') : [])) if (sh.beats.some((b) => newer.includes(b))) lockMissing.add(`${sh.id} ${x.trim()}`);
    const same = lockMissing.size === MIX_MISSING.size && [...lockMissing].every((x) => MIX_MISSING.has(x));
    const mixNewer = fs.statSync(TRACK).mtimeMs > fs.statSync(`${REPO}/show/reel/ep01-act4-v5.json`).mtimeMs;
    if (!same) problems.push(`frame5.ts MIX_MISSING is stale: the approved timeline vs the mix's source differ at ${[...lockMissing].join(', ') || 'nothing'}`);
    if (mixNewer && MIX_MISSING.size) problems.push('mix.wav is newer than the approved timeline: if bed.py re-ran, empty MIX_MISSING in frame5.ts');
    console.log(JSON.stringify({shots: SHOTS.length, act_frames: ACT_FRAMES, layouts: Object.keys(DRAW5).length, kinds: ledger5().reduce((a, r) => ({...a, [r.kind]: (a[r.kind] ?? 0) + 1}), {}),
      glyph_frames: glyphFrames5().length, d6: D6, click: CANCEL_CLICK, opt5: OPT5, track: TRACK, track_frames: frames, beats_with_spots_not_in_mix: newer, problems}, null, 1));
    process.exit(problems.length ? 1 : 0);
  }
  console.log('modes: check | glyphspan | glyphs | both | anim | picture | compare | contact | stills | picstills | native | cuts | cutpairs | ledger');
})().catch((e) => { console.error(e); process.exit(1); });
