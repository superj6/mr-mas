// @ts-nocheck -- Node-only tool (bundled with esbuild by tools/build.mjs), excluded from the browser typecheck.
// MR. MAS — Ep1 pixel pipeline (P0): the Node renderer, generalized from Act Four's render5.ts. The SAME frame.ts the
// Remotion host (pixel/entry.tsx) uses, rendered in Node (no browser), piped raw to the bundled ffmpeg (an uncompressed
// AVI stream: no PNG deflate per frame), in parallel chunks cut on shot starts, concatenated and muxed onto the temp
// track (the lock's mix, or --mix). Frames only a browser can draw (GLYPH tokens; a segment's browser frames, e.g. Act
// Four's J1) are spliced in from the Remotion host's own PNGs (`glyphs`, then GLYPH_DIR); a GLYPH frame with no PNG
// falls back to v4's 2-pixel marks and is reported. Shots with no layout render as the host's STAND-IN, loudly.
// A layout may declare an `overlay` (spec.ts): RGBA frames made outside the pipeline (act1 11.04's 3D claymation CLOD),
// laid over the picture and the review frame in the room area after everything else; shots that declare none are
// untouched. The overlay stage refuses a manifest made for another lock, and reports any refusal or missing file.
//
// Build one renderer per segment (from studio/):   node src/episodes/ep01/pixel/tools/build.mjs <seg> $S/r-<seg>.cjs
// Run every heavy mode through ops/heavy.sh (at most 2 heavy jobs machine-wide, low priority):
//   node $S/r-<seg>.cjs check [--allow-standins]      layouts vs shots (stand-ins fail unless allowed), layouts that throw,
//                                                     marks / faces that did not resolve, tiling, the mix's length
//   node $S/r-<seg>.cjs glyphspan                      the frames the browser host must draw (light)
//   ../ops/heavy.sh node $S/r-<seg>.cjs bundle <dir>   one Remotion bundle of pixel/entry.tsx (then BUNDLE=<dir>)
//   ../ops/heavy.sh node $S/r-<seg>.cjs glyphs <dir> [conc 2]   Remotion renders those frames (picture + review) and 2
//                                                     plain frames either side into <dir>/{pic,anim}/; checks Node = Remotion
//   GLYPH_DIR=<dir> ../ops/heavy.sh node $S/r-<seg>.cjs picture [out.mp4] [--jobs 2] [--from a] [--to b]
//                                                     the picture (default out/ep01/full-v3/picture/<seg>.mp4) + <out>.srt
//   ... review [out.mp4] | both <review.mp4> <picture.mp4>     the review frame, or both in one pass
//     flags: --mix <wav> --mix-offset <frames> | --no-audio · --slate <seconds> (a reviewer head slate, silent)
//            --opt key=value (segment options, e.g. --opt j1=true --opt subs=burn) · --glyph marks (no splice, stand-in marks)
//   node $S/r-<seg>.cjs stills|picstills|native <dir> <f> ...   review frames | pictures | 480 x 270 at 2x (PNG)
//   node $S/r-<seg>.cjs contact <out.png> [native]     one still per shot (its middle frame)
//   node $S/r-<seg>.cjs cuts <dir> · ledger <out.json> · srt <out.srt>
// Env: X264_THREADS (default 2 per encoder), SEGDIR (where chunks go; default beside the output), GLYPH_DIR, BUNDLE,
//      PIXEL_OPTS (JSON segment options; --opt adds to it).
import {spawn, fork} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as crypto from 'crypto';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {prepare, native, picture, review, browserFrames, glyphFrames, srt, tcOf, wideVo, PIC_W, PIC_H, ANIM_W, ANIM_H, RH} from '../frame';
import {otext} from '../text';
import {drawHeadSlate} from '../standin';

const REPO = '/home/jgon/project/art/mrmas';
const STUDIO = `${REPO}/studio`;
const PIXEL = `${STUDIO}/src/episodes/ep01/pixel`;
const FFDIR = `${STUDIO}/node_modules/@remotion/compositor-linux-x64-gnu`;
const FF = `${FFDIR}/ffmpeg`;
const ENV = {...process.env, LD_LIBRARY_PATH: FFDIR};
const ENTRY = 'src/episodes/ep01/pixel/entry.tsx';

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
/** 8-bit RGB / RGBA PNG (non-interlaced, as Remotion and Blender write them) -> its pixels, unfiltered */
const decodePNG = (file) => {
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
  const px = Buffer.alloc(stride * H), zero = Buffer.alloc(stride);
  for (let y = 0; y < H; y++) {
    const ft = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const cur = px.subarray(y * stride, (y + 1) * stride), prev = y ? px.subarray((y - 1) * stride, y * stride) : zero;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0, up = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v = src[i];
      if (ft === 1) v += a; else if (ft === 2) v += up; else if (ft === 3) v += (a + up) >> 1;
      else if (ft === 4) { const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      cur[i] = v & 255;
    }
  }
  return {W, H, bpp, px};
};
/** 8-bit RGB / RGBA PNG -> Buf (alpha dropped) */
export const readPNG = (file) => {
  const {W, H, bpp, px} = decodePNG(file);
  const b = new Buf(W, H, 0);
  for (let i = 0, o = 0; i < W * H; i++, o += bpp) b.c[i] = (px[o] << 16) | (px[o + 1] << 8) | px[o + 2];
  return b;
};
/** 8-bit RGBA PNG -> {w, h, px (RGBA bytes, straight alpha), box: [x0, y0, x1, y1] of its non-zero alpha} */
export const readRGBA = (file) => {
  const {W, H, bpp, px} = decodePNG(file);
  if (bpp !== 4) throw new Error(`${file}: an overlay layer must be RGBA`);
  let x0 = W, y0 = H, x1 = 0, y1 = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (px[(y * W + x) * 4 + 3]) { if (x < x0) x0 = x; if (x >= x1) x1 = x + 1; if (y < y0) y0 = y; if (y >= y1) y1 = y + 1; }
  return {w: W, h: H, px, box: x1 > x0 ? [x0, y0, x1, y1] : [0, 0, 0, 0]};
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
    write: (b) => {
      const out = Buffer.allocUnsafe(8 + fbytes); out.write('00db', 0, 'ascii'); out.writeUInt32LE(fbytes, 4);
      const src = Buffer.from(b.c.buffer, b.c.byteOffset, fbytes), row = W * 4;
      for (let y = 0; y < H; y++) src.copy(out, 8 + (H - 1 - y) * row, y * row, (y + 1) * row); // DIB rows run bottom-up
      return ff.stdin.write(out) ? Promise.resolve() : new Promise((r) => ff.stdin.once('drain', r));
    },
    end: () => { ff.stdin.end(); return done; },
  };
};
const run = (cmd, a, o = {}) => new Promise((resolve, reject) => { const p = spawn(cmd, a, {env: ENV, stdio: 'inherit', ...o}); p.on('close', (c) => (c === 0 ? resolve(0) : reject(new Error(cmd + ' ' + c)))); });
const wavFrames = (file) => {
  const wav = fs.readFileSync(file).subarray(0, 64 * 1024);
  let o = 12, fmt = null;
  while (o < wav.length - 8) { const id = wav.toString('ascii', o, o + 4), len = wav.readUInt32LE(o + 4); if (id === 'fmt ') fmt = {ch: wav.readUInt16LE(o + 10), sr: wav.readUInt32LE(o + 12), bits: wav.readUInt16LE(o + 22)}; if (id === 'data') return (len / (fmt.ch * fmt.bits / 8)) / fmt.sr * 24; o += 8 + len + (len & 1); }
  return null;
};
const md5file = (f) => { try { return crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex'); } catch { return null; } };

// ------------------------------------------------------------------ arguments
const parseArgs = (argv) => {
  const pos = [], flags = {}, opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const k = a.slice(2);
    if (['no-audio', 'allow-standins', 'native'].includes(k)) { flags[k] = true; continue; }
    const v = argv[++i];
    if (k === 'opt') { const [ok, ...rest] = String(v).split('='); const s = rest.join('='); try { opts[ok] = JSON.parse(s); } catch { opts[ok] = s; } continue; }
    flags[k] = v;
  }
  return {pos, flags, opts};
};

// ================================================================== main: the bundle calls main(SEGMENT)
export const main = (SEGMENT) => {
  const [mode, ...rest] = process.argv.slice(2);
  const {pos, flags, opts: optFlags} = parseArgs(rest);
  const OPTS = {...(process.env.PIXEL_OPTS ? JSON.parse(process.env.PIXEL_OPTS) : {}), ...optFlags};
  const seg = prepare(SEGMENT, OPTS);
  const SEG = seg.seg, N = seg.frames, SHOTS = seg.shots;
  const GLYPH_DIR = process.env.GLYPH_DIR ?? '';
  const SERVE = process.env.BUNDLE ? path.resolve(process.env.BUNDLE) : ENTRY;
  const mixPath = flags['no-audio'] ? null : flags.mix ? path.resolve(flags.mix) : seg.lock.mix ? `${REPO}/${seg.lock.mix.path}` : null;
  const mixOff = flags['mix-offset'] !== undefined ? Number(flags['mix-offset']) : flags.mix ? 0 : seg.lock.mix?.offsetFrames ?? 0;
  const glyphMode = flags.glyph === 'marks' ? 'marks' : 'splice';
  const loud = () => {
    if (!seg.standins.length && !seg.problems.length) return;
    const bar = '!'.repeat(96);
    if (seg.standins.length) process.stderr.write(`${bar}\nSTAND-IN: ${seg.standins.length} of ${SHOTS.length} shots in ${SEG} have no layout; they render as the host's stand-in, tagged STAND-IN in the picture:\n  ${seg.standins.join(' ')}\n${bar}\n`);
    if (seg.problems.length) process.stderr.write(`LAYOUT PROBLEMS (${seg.problems.length}):\n  ${seg.problems.join('\n  ')}\n`);
  };

  // ------------------------------------------------------------------ the browser splice
  const pngOf = (kind, f) => (GLYPH_DIR ? path.join(GLYPH_DIR, kind, `${String(f).padStart(5, '0')}.png`) : '');
  const BROWSER = new Set();
  const spliced = {pic: 0, anim: 0}, marked = [], spliceOff = [], missing = [];
  // ------------------------------------------------------------------ declared overlays (a layout's `overlay`)
  const OVL = new Map(), LAYER = new Map(), overlaid = {pic: 0, anim: 0}, overlayMissing = [], overlayRefused = {};
  /** the shot's overlay: null when its layout declares none; {frames} when accepted; {why} when refused */
  const overlayOf = (sh) => {
    const decl = seg.layoutOf(sh)?.overlay;
    if (!decl) return null;
    if (OVL.has(sh.id)) return OVL.get(sh.id);
    const file = path.resolve(REPO, decl.manifest), o = {frames: null, why: ''};
    try {
      const m = JSON.parse(fs.readFileSync(file, 'utf8')), len = sh.e - sh.s;
      const line = m.check?.line ? sh.lines.find((l) => l.id === m.check.line) : null;
      if (m.shot !== sh.id) o.why = `the manifest is for shot ${m.shot}`;
      else if (m.shot_len !== len) o.why = `made for a ${m.shot_len}-frame ${sh.id}; this lock's is ${len} frames`;
      else if (m.check?.line && (!line || line.s !== m.check.s)) o.why = `${m.check.line} starts at k${line?.s ?? '?'} in this lock, k${m.check.s} in the insert`;
      else o.frames = new Map(m.frames.map((x) => [x.k, x.layers.map((p) => path.resolve(path.dirname(file), p))]));
    } catch (e) { o.why = String(e?.message ?? e); }
    if (o.why) { overlayRefused[sh.id] = o.why; process.stderr.write(`OVERLAY REFUSED: ${sh.id} (${decl.manifest}): ${o.why}\n`); }
    OVL.set(sh.id, o);
    return o;
  };
  /** lay the shot's overlay layers for frame f over `target` (the picture at 4x, 1:1; the review frame at 3x, nearest),
   *  above the band only; straight alpha, bottom layer first */
  const overlayInto = (f, kind, target, n) => {
    const o = overlayOf(n.sh);
    const layers = o?.frames?.get(n.k);
    if (!layers) return;
    const sc = kind === 'pic' ? 4 : 3, T = target.c, TW = target.w;
    for (const file of layers) {
      if (!fs.existsSync(file)) { overlayMissing.push(`${f}:${path.basename(file)}`); continue; }
      let r = LAYER.get(file);
      if (!r) { if (LAYER.size >= 4) LAYER.clear(); r = readRGBA(file); LAYER.set(file, r); } // on 2s: a drawing serves two frames
      const [bx0, by0, bx1, by1] = r.box, P = r.px;
      const ya = Math.floor((by0 * sc) / 4), yb = Math.min(RH * sc, Math.ceil((by1 * sc) / 4)), xa = Math.floor((bx0 * sc) / 4), xb = Math.ceil((bx1 * sc) / 4);
      for (let y = ya; y < yb; y++) {
        const sy = sc === 4 ? y : Math.floor((y * 4) / sc);
        for (let x = xa; x < xb; x++) {
          const i = (sy * r.w + (sc === 4 ? x : Math.floor((x * 4) / sc))) * 4, a = P[i + 3];
          if (!a) continue;
          const t = y * TW + x, d = T[t], b = 255 - a;
          T[t] = ((((P[i] * a + ((d >> 16) & 255) * b + 127) / 255) | 0) << 16) | ((((P[i + 1] * a + ((d >> 8) & 255) * b + 127) / 255) | 0) << 8) | (((P[i + 2] * a + (d & 255) * b + 127) / 255) | 0);
        }
      }
    }
    overlaid[kind]++;
  };
  const frameInto = (f, kind, target, n) => {
    frameDraw(f, kind, target, n);
    overlayInto(f, kind, target, n);
  };
  const frameDraw = (f, kind, target, n) => {
    const need = n.layers.length > 0 || BROWSER.has(f);
    const png = need && glyphMode === 'splice' ? pngOf(kind, f) : '';
    if (png && fs.existsSync(png)) {
      const b = readPNG(png);
      if (n.layers.length && !seg.spec.browser?.frames(f, seg.opts)) { // a GLYPH frame must be Node's own frame outside the room area
        const mine = kind === 'pic' ? picture(seg, f, undefined, {n}) : review(seg, f, undefined, {n}), sc = kind === 'pic' ? 4 : 3;
        let off = 0;
        for (let i = 0; i < b.c.length; i++) if (b.c[i] !== mine.c[i]) { const x = i % b.w, y = (i / b.w) | 0; if (!(x < 480 * sc && y < 203 * sc)) off++; }
        if (off) spliceOff.push(`${kind}:${f}:${off}px`);
      }
      target.c.set(b.c); spliced[kind]++; return;
    }
    let nn = n;
    if (n.layers.length) { nn = native(seg, f, {marks: true}); marked.push(`${kind}:${f}`); }
    if (BROWSER.has(f) && kind === 'pic') missing.push(f);
    if (kind === 'pic') picture(seg, f, target, {n: nn}); else review(seg, f, target, {n: nn});
  };
  const slateBuf = (kind, lines) => { const nb = new Buf(480, 270, PAL.N0); drawHeadSlate(nb, seg.lock, lines); const out = new Buf(kind === 'pic' ? PIC_W : ANIM_W, kind === 'pic' ? PIC_H : ANIM_H, PAL.N0); const sc = kind === 'pic' ? 4 : 3; for (let y = 0; y < out.h; y++) for (let x = 0; x < out.w; x++) out.c[y * out.w + x] = nb.c[Math.min(269, Math.floor(y / sc)) * 480 + Math.min(479, Math.floor(x / sc))]; return out; };

  // ------------------------------------------------------------------ chunks and the parallel render
  const encodeRange = async (outs, from, to) => {
    for (const f of browserFrames(seg, from, to)) BROWSER.add(f);
    const n0 = to - from, t0 = Date.now();
    const enc = {}, bufs = {};
    if (outs.anim) { enc.anim = openEncoder(outs.anim, ANIM_W, ANIM_H, n0); bufs.anim = new Buf(ANIM_W, ANIM_H, 0); }
    if (outs.pic) { enc.pic = openEncoder(outs.pic, PIC_W, PIC_H, n0); bufs.pic = new Buf(PIC_W, PIC_H, 0); }
    for (let f = from; f < to; f++) {
      const n = native(seg, f);
      const w = [];
      for (const kind of Object.keys(enc)) { frameInto(f, kind, bufs[kind], n); w.push(enc[kind].write(bufs[kind])); }
      await Promise.all(w);
      if ((f + 1 - from) % 480 === 0) process.stderr.write(`[${from}-${to}] ${f + 1 - from}/${n0} ${((Date.now() - t0) / (f + 1 - from)).toFixed(1)} ms/f\n`);
    }
    await Promise.all(Object.values(enc).map((e) => e.end()));
    return {ms: Date.now() - t0};
  };
  const encodeSlate = async (outs, frames, lines) => {
    const enc = {};
    for (const kind of Object.keys(outs)) if (outs[kind]) enc[kind] = openEncoder(outs[kind], kind === 'pic' ? PIC_W : ANIM_W, kind === 'pic' ? PIC_H : ANIM_H, frames);
    for (const kind of Object.keys(enc)) { const b = slateBuf(kind, lines); for (let i = 0; i < frames; i++) await enc[kind].write(b); }
    await Promise.all(Object.values(enc).map((e) => e.end()));
  };
  const muxTrack = async (silent, out, from, to, slateF) => {
    const ss = ((mixOff + from) / 24).toFixed(4), dur = ((to - from) / 24).toFixed(4);
    if (!mixPath || !fs.existsSync(mixPath)) {
      if (mixPath) console.warn('no temp track at', mixPath, '(silent picture)');
      await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-c:v', 'copy', '-movflags', '+faststart', out]);
      return;
    }
    if (!slateF) {
      await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-ss', ss, '-t', dur, '-i', mixPath, '-map', '0:v:0', '-map', '1:a:0',
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '48000', '-movflags', '+faststart', out]);
      return;
    }
    const sl = (slateF / 24).toFixed(4);
    const fc = `[1:a]atrim=start=${ss}:duration=${dur},asetpts=PTS-STARTPTS,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[c];anullsrc=r=48000:cl=stereo,atrim=duration=${sl},aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[s];[s][c]concat=n=2:v=0:a=1[a]`;
    await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-i', silent, '-i', mixPath, '-filter_complex', fc, '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]);
  };
  const renderSeg = async (outs, jobs, from, to) => {
    const t0 = Date.now();
    loud();
    const base = path.dirname(outs.anim ?? outs.pic);
    fs.mkdirSync(base, {recursive: true});
    const tmp = fs.mkdtempSync(path.join(process.env.SEGDIR ?? base, `.seg-${SEG}-`));
    const per = Math.ceil((to - from) / jobs), cuts = [from];
    for (let j = 1; j < jobs; j++) { const want = from + j * per; const s = SHOTS.find((x) => x.s >= want); cuts.push(Math.min(to, s ? s.s : to)); }
    cuts.push(to);
    const slateF = flags.slate ? Math.round(Number(flags.slate) * 24) : 0;
    const segs = [];
    const workerEnv = {...ENV, PIXEL_OPTS: JSON.stringify(OPTS)};
    await Promise.all(cuts.slice(0, -1).map((a, j) => new Promise((resolve, reject) => {
      const b = cuts[j + 1];
      if (b <= a) return resolve(0);
      const sg = {anim: outs.anim ? path.join(tmp, `a${String(j).padStart(2, '0')}.mp4`) : '', pic: outs.pic ? path.join(tmp, `p${String(j).padStart(2, '0')}.mp4`) : ''};
      segs[j] = sg;
      const p = fork(process.argv[1], ['segment', sg.anim || '-', sg.pic || '-', String(a), String(b), ...(flags.glyph ? ['--glyph', flags.glyph] : [])], {env: workerEnv});
      p.on('exit', (c) => (c === 0 ? resolve(0) : reject(new Error(`segment ${j} exit ${c}`))));
    })));
    if (slateF) {
      const lines = [`PIXEL PREVIEW · ${SEG} · ${N} F (${(N / 24).toFixed(2)} S) · ${tcOf(seg, 0)} → ${tcOf(seg, N)}`, `LOCK: ${seg.lock.source.timeline}`,
        `RENDERED ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · LAYOUTS ${SHOTS.length - seg.standins.length} OF ${SHOTS.length}${seg.standins.length ? ` · ${seg.standins.length} STAND-INS` : ''}`,
        'DRAWN BY CODE. NOBODY HAS WATCHED THIS YET.'];
      await encodeSlate({anim: outs.anim ? path.join(tmp, 'a-slate.mp4') : '', pic: outs.pic ? path.join(tmp, 'p-slate.mp4') : ''}, slateF, lines);
    }
    const sources = Object.fromEntries(['frame.ts', 'spec.ts', 'text.ts', 'standin.ts', 'anchors.ts', 'lipsync.ts', `${SEG}/shots.ts`, `${SEG}/data.ts`].map((f) => [f, md5file(`${PIXEL}/${f}`)]));
    const report = {seg: SEG, frames: to - from, from, to, jobs, slate_frames: slateF, opts: seg.opts, track: mixPath, track_offset_frames: mixOff, glyph_dir: GLYPH_DIR || null, glyph_mode: glyphMode,
      bundle_built: fs.statSync(process.argv[1]).mtime.toISOString(), sources, standins: seg.standins, layout_problems: seg.problems, segments: []};
    for (const kind of ['anim', 'pic']) {
      if (!outs[kind]) continue;
      const list = path.join(tmp, `${kind}.txt`);
      const files = [...(slateF ? [path.join(tmp, `${kind === 'pic' ? 'p' : 'a'}-slate.mp4`)] : []), ...segs.filter(Boolean).map((s) => s[kind])];
      fs.writeFileSync(list, files.map((f) => `file '${f}'`).join('\n') + '\n');
      const silent = path.join(tmp, `${kind}-silent.mp4`);
      await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
      await muxTrack(silent, outs[kind], from, to, slateF);
      console.log('wrote', outs[kind], `${to - from + slateF} frames`);
    }
    const srtFile = `${outs.pic ?? outs.anim}.srt`.replace(/\.mp4\.srt$/, '.srt');
    fs.writeFileSync(srtFile, srt(seg, slateF - from, from, to));
    for (const f of fs.readdirSync(tmp)) if (f.endsWith('.json')) report.segments.push(JSON.parse(fs.readFileSync(path.join(tmp, f), 'utf8')));
    fs.rmSync(tmp, {recursive: true, force: true});
    report.seconds = Math.round((Date.now() - t0) / 1000);
    report.ms_per_frame_per_worker = report.segments.length ? +(report.segments.reduce((a, s) => a + s.ms / (s.to - s.from), 0) / report.segments.length).toFixed(2) : null;
    const sp = report.segments.reduce((a, s) => ({pic: a.pic + s.spliced.pic, anim: a.anim + s.spliced.anim, marked: a.marked.concat(s.marked), off: a.off.concat(s.spliceOff), missing: a.missing.concat(s.missing), failed: {...a.failed, ...s.failed},
      overlaid: {pic: a.overlaid.pic + s.overlaid.pic, anim: a.overlaid.anim + s.overlaid.anim}, overlayMissing: a.overlayMissing.concat(s.overlayMissing), overlayRefused: {...a.overlayRefused, ...s.overlayRefused}}),
    {pic: 0, anim: 0, marked: [], off: [], missing: [], failed: {}, overlaid: {pic: 0, anim: 0}, overlayMissing: [], overlayRefused: {}});
    report.summary = sp;
    const rep = `${outs.pic ?? outs.anim}.render.json`;
    fs.writeFileSync(rep, JSON.stringify(report, null, 1));
    console.log(`done in ${report.seconds} s (${report.ms_per_frame_per_worker} ms/f per worker, ${jobs} workers) · browser frames spliced: pic ${sp.pic}, anim ${sp.anim} (off-room mismatches: ${sp.off.length ? sp.off.join(' ') : 'none'}; browser frames with no PNG: ${sp.missing.length}) · GLYPH stand-in marks: ${sp.marked.length} · failed layouts: ${Object.keys(sp.failed).length ? JSON.stringify(sp.failed) : 'none'} · STAND-INS: ${seg.standins.length}${sp.overlaid.pic + sp.overlaid.anim || sp.overlayMissing.length || Object.keys(sp.overlayRefused).length ? ` · OVERLAYS: pic ${sp.overlaid.pic}, anim ${sp.overlaid.anim} frames; missing files ${sp.overlayMissing.length}; refused ${JSON.stringify(sp.overlayRefused)}` : ''} · srt ${srtFile} · ${rep}`);
    loud();
  };

  // ------------------------------------------------------------------ sheets
  const box2 = (fb, W, H) => {
    const out = new Uint32Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      let r = 0, g = 0, b = 0;
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const v = fb.c[(j * 2 + dy) * fb.w + i * 2 + dx]; r += (v >> 16) & 255; g += (v >> 8) & 255; b += v & 255; }
      out[j * W + i] = ((r >> 2) << 16) | ((g >> 2) << 8) | (b >> 2);
    }
    return out;
  };

  const modes = {
    segment: async () => { // worker: [from, to) -> its chunk file(s)
      const [a, p, from, to] = pos;
      const outs = {anim: a !== '-' ? a : null, pic: p !== '-' ? p : null};
      const r = await encodeRange(outs, Number(from), Number(to));
      fs.writeFileSync(path.join(path.dirname(a !== '-' ? a : p), `seg-${from}.json`), JSON.stringify({from: Number(from), to: Number(to), ms: r.ms, spliced, marked, spliceOff, missing, failed: Object.fromEntries(seg.failed), overlaid, overlayMissing, overlayRefused}));
      process.exit(0);
    },
    picture: () => renderSeg({pic: path.resolve(pos[0] ?? `${REPO}/out/ep01/full-v3/picture/${SEG}.mp4`)}, Number(flags.jobs ?? 2), Number(flags.from ?? 0), Number(flags.to ?? N)),
    review: () => renderSeg({anim: path.resolve(pos[0] ?? `${REPO}/out/ep01/full-v3/review/${SEG}-review.mp4`)}, Number(flags.jobs ?? 2), Number(flags.from ?? 0), Number(flags.to ?? N)),
    both: () => renderSeg({anim: path.resolve(pos[0] ?? `${REPO}/out/ep01/full-v3/review/${SEG}-review.mp4`), pic: path.resolve(pos[1] ?? `${REPO}/out/ep01/full-v3/picture/${SEG}.mp4`)}, Number(flags.jobs ?? 2), Number(flags.from ?? 0), Number(flags.to ?? N)),
    bundle: async () => {
      await run('npx', ['remotion', 'bundle', ENTRY, `--out-dir=${path.resolve(pos[0])}`, '--log=error'], {cwd: STUDIO});
      console.log('bundled', ENTRY, '->', path.resolve(pos[0]));
    },
    glyphspan: () => {
      const g = glyphFrames(seg), b = browserFrames(seg);
      console.log(JSON.stringify({seg: SEG, glyph_frames: g.length, browser_frames: b.length, from: b[0] ?? null, to: b[b.length - 1] ?? null, runs: runsOf(b).map(([a, z]) => `${a}-${z}`), opts: OPTS}));
    },
    glyphs: async () => { // Remotion renders the browser frames of both compositions (+ two plain frames either side)
      const dir = path.resolve(pos[0]), conc = String(Math.min(4, Number(pos[1] ?? 2)));
      const fr = browserFrames(seg);
      if (!fr.length) { console.log('no browser frames in', SEG); return; }
      const props = JSON.stringify({opts: OPTS});
      for (const [a0, b0] of runsOf(fr)) {
        const a = Math.max(0, a0 - 2), b = Math.min(N - 1, b0 + 2);
        for (const [kind, comp] of [['pic', `ep01-pixel-${SEG}`], ['anim', `ep01-pixel-${SEG}-review`]]) {
          const raw = path.join(dir, `${kind}-raw`);
          fs.rmSync(raw, {recursive: true, force: true});
          await run('npx', ['remotion', 'render', SERVE, comp, raw, '--sequence', '--image-format=png', `--frames=${a}-${b}`, `--concurrency=${conc}`, `--props=${props}`, '--log=error'], {cwd: STUDIO});
          fs.mkdirSync(path.join(dir, kind), {recursive: true});
          for (const f of fs.readdirSync(raw)) { const m = /(\d+)\.png$/.exec(f); if (m) fs.renameSync(path.join(raw, f), path.join(dir, kind, `${m[1].padStart(5, '0')}.png`)); }
          fs.rmSync(raw, {recursive: true, force: true});
        }
      }
      // the checks: Node = Remotion on the plain frames (all pixels) and on the GLYPH frames outside the room area
      const res = [];
      for (const [a0, b0] of runsOf(fr)) for (let f = Math.max(0, a0 - 2); f <= Math.min(N - 1, b0 + 2); f++) for (const kind of ['pic', 'anim']) {
        const file = path.join(dir, kind, `${String(f).padStart(5, '0')}.png`);
        if (!fs.existsSync(file)) { res.push({f, kind, missing: true}); continue; }
        const R = readPNG(file), n = native(seg, f), M = kind === 'pic' ? picture(seg, f, undefined, {n}) : review(seg, f, undefined, {n});
        const sc = kind === 'pic' ? 4 : 3, glyph = n.layers.length > 0, browser = !!seg.spec.browser?.frames(f, seg.opts);
        let diff = 0, diffOut = 0;
        for (let i = 0; i < R.c.length; i++) if (R.c[i] !== M.c[i]) { diff++; const x = i % R.w, y = (i / R.w) | 0; if (!(x < 480 * sc && y < 203 * sc)) diffOut++; }
        res.push({f, kind, glyph, browser, pixels_differing: diff, differing_outside_room: diffOut});
      }
      const plain = res.filter((r) => !r.glyph && !r.browser && !r.missing), gl = res.filter((r) => r.glyph && !r.browser);
      const summary = {seg: SEG, browser_frames: fr.length, plain_identical: plain.every((r) => r.pixels_differing === 0), plain: plain.map((r) => `${r.kind}:${r.f}=${r.pixels_differing}`),
        glyph_outside_room_identical: gl.every((r) => r.differing_outside_room === 0), glyph_room_pixels_changed_median: gl.map((r) => r.pixels_differing).sort((x, y) => x - y)[gl.length >> 1] ?? null,
        browser_only: res.filter((r) => r.browser).length, missing: res.filter((r) => r.missing).length};
      fs.writeFileSync(path.join(dir, 'check.json'), JSON.stringify({summary, rows: res}, null, 1));
      console.log(JSON.stringify(summary));
    },
    stills: () => stillsMode('stills'), picstills: () => stillsMode('picstills'), native: () => stillsMode('native'),
    cuts: () => {
      const dir = pos[0];
      SHOTS.forEach((sh, i) => { for (const [tag, f] of [['a', sh.s], ['b', Math.min(sh.e - 1, sh.s + 6)]]) writePNG(`${dir}/${String(i + 1).padStart(3, '0')}${tag}-${sh.id}-f${f}.png`, native(seg, f, {marks: true}).fb, 1); });
      console.log('wrote', SHOTS.length * 2, 'stills to', dir);
    },
    contact: () => { // one still per shot (its middle frame): `native` = 480 x 270 tiles at 1x, else 240 x 135
      const out = pos[0], nat = pos[1] === 'native' || flags.native;
      const COLS = nat ? 6 : 8, CW = nat ? 480 : 240, CH = nat ? 270 : 135, LH = 30, W = COLS * CW, rows = Math.ceil(SHOTS.length / COLS);
      const sheet = new Buf(W, 70 + rows * (CH + LH), 0x07080d);
      otext(sheet, `MR. MAS · EP1 · ${seg.lock.label} · PIXEL PIPELINE (${SEG}) · ONE STILL PER SHOT (ITS MIDDLE FRAME)${nat ? ' · 480 x 270 AT 1X' : ''}`, 12, 14, 2, 0xf2efe6);
      otext(sheet, `${SHOTS.length} SHOTS · ${N} F · ${tcOf(seg, 0)} → ${tcOf(seg, N)} · RED = HOST STAND-IN (NO LAYOUT) OR A LAYOUT FALLBACK · PINK = THE LAYOUT HOLDS A STAND-IN · STAND-INS: ${seg.standins.length}`, 12, 40, 1, 0x8a93a8);
      SHOTS.forEach((sh, i) => {
        const f = Math.floor((sh.s + sh.e) / 2), n = native(seg, f, {marks: true});
        const x0 = (i % COLS) * CW, y0 = 70 + Math.floor(i / COLS) * (CH + LH);
        if (nat) for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) sheet.c[(y0 + y) * W + x0 + x] = n.fb.c[y * 480 + x];
        else { const px = box2(n.fb, CW, CH); for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) sheet.c[(y0 + y) * W + x0 + x] = px[y * CW + x]; }
        otext(sheet, `${sh.id} ${n.host === 'layout' ? n.kind || '' : n.host.toUpperCase()} ${sh.cls} ${sh.tag}`.slice(0, nat ? 70 : 36), x0 + 2, y0 + CH + 5, 1, n.fallback ? 0xff7a7a : 0xf2efe6);
        const tl = `${tcOf(seg, sh.s).slice(0, 5)} · ${((sh.e - sh.s) / 24).toFixed(2)}s`;
        otext(sheet, tl, x0 + CW - tl.length * 6 - 4, y0 + CH + 17, 1, 0x8a93a8);
        otext(sheet, (n.standin ? 'stand-in · ' : '') + sh.framing.slice(0, nat ? 48 : 22), x0 + 2, y0 + CH + 17, 1, n.fallback ? 0xff7a7a : n.standin ? 0xe7a0c4 : 0x5f9f78);
      });
      writePNG(out, sheet, 1);
      console.log('wrote', out, W, sheet.h, '· stand-ins:', seg.standins.join(' ') || 'none', '· layouts that threw:', [...seg.failed.keys()].join(' ') || 'none');
    },
    ledger: () => {
      const rows = SHOTS.map((sh) => { const L = seg.layoutOf(sh); return {id: sh.id, tag: sh.tag, cls: sh.cls, frames: sh.e - sh.s, kind: L?.kind ?? null, st: L?.st ?? (sh.slate ? 'REVIEWER SLATE' : 'HOST STAND-IN (no layout)'), standin: L ? !!L.standin : !sh.slate, layout: !!L, slate: sh.slate}; });
      fs.writeFileSync(pos[0], JSON.stringify(rows, null, 1));
      console.log('wrote', pos[0], rows.length, 'shots ·', rows.filter((r) => !r.layout && !r.slate).length, 'with no layout');
    },
    srt: () => { fs.writeFileSync(pos[0], srt(seg)); console.log('wrote', pos[0]); },
    check: () => {
      const problems = [], notes = [];
      if (seg.standins.length && !flags['allow-standins']) problems.push(`shots with no layout (STAND-IN): ${seg.standins.join(' ')}`);
      else if (seg.standins.length) notes.push(`stand-ins allowed: ${seg.standins.join(' ')}`);
      for (const p of seg.problems) problems.push(p);
      const extra = Object.keys(seg.spec.layouts).filter((id) => !SHOTS.some((s) => s.id === id));
      if (extra.length) problems.push(`layouts for shots the lock does not have (a re-lock renamed them?): ${extra.join(' ')}`);
      let t = 0; for (const s of SHOTS) { if (s.s !== t) problems.push(`gap before ${s.id}`); t = s.e; }
      if (t !== N) problems.push(`shots end at ${t}, the segment is ${N}`);
      for (const s of SHOTS) { const o = overlayOf(s); if (!o) continue; if (!o.frames) { problems.push(`${s.id}: overlay refused: ${o.why}`); continue; } const gone = [...new Set([...o.frames.values()].flat())].filter((p) => !fs.existsSync(p)); if (gone.length) problems.push(`${s.id}: overlay files missing: ${gone.length} (${path.basename(gone[0])}...)`); else notes.push(`${s.id}: overlay on ${o.frames.size} frames`); }
      for (const s of SHOTS) for (const f of [s.s, Math.floor((s.s + s.e) / 2), s.e - 1]) { const n = native(seg, f); if (n.host === 'threw') problems.push(`${s.id} f${f}: the layout threw (${seg.failed.get(s.id)})`); else if (n.fallback && n.host === 'layout') problems.push(`${s.id} f${f}: the layout drew its own fallback`); }
      const vo = seg.lock.subs.filter((x) => x.kind === 'vo'), rails = seg.lock.rails;
      for (const v of vo) for (const r of rails) if (v.s < r.e && r.s < v.e + 15) notes.push(`V.O. ${v.id} shares the screen with the rail "${r.text.slice(0, 24)}" (pov-and-framing §5.2: stagger them)`);
      for (const id of wideVo(seg)) notes.push(`V.O. ${id} is wider than one line above the band: it wraps upward (pov-and-framing §5.2-5.3 want one line, <= 45 glyphs)`);
      let trackFrames = null;
      if (mixPath && fs.existsSync(mixPath)) { trackFrames = wavFrames(mixPath); if (Math.abs(trackFrames - (mixOff + N)) > 0.5) problems.push(`the temp track is ${trackFrames?.toFixed(2)} frames; offset ${mixOff} + the segment ${N} = ${mixOff + N}`); }
      else notes.push(mixPath ? `no temp track at ${mixPath} (a silent picture)` : 'no temp track in the lock (a silent picture unless --mix)');
      const kinds = SHOTS.reduce((a, s) => { const L = seg.layoutOf(s), k = L ? L.kind || 'LAYOUT' : s.slate ? 'SLATE' : 'STAND-IN'; a[k] = (a[k] ?? 0) + 1; return a; }, {});
      loud();
      console.log(JSON.stringify({seg: SEG, shots: SHOTS.length, frames: N, layouts: SHOTS.length - seg.standins.length - SHOTS.filter((s) => s.slate && !seg.layoutOf(s)).length, standins: seg.standins.length,
        slates: SHOTS.filter((s) => s.slate).map((s) => s.id), kinds, glyph_frames: glyphFrames(seg).length, browser_frames: browserFrames(seg).length, opts: seg.opts,
        track: mixPath, track_offset: mixOff, track_frames: trackFrames, notes, problems}, null, 1));
      process.exit(problems.length ? 1 : 0);
    },
  };
  const stillsMode = (m) => {
    const dir = pos[0];
    for (const s of pos.slice(1)) {
      const f = Number(s), n = native(seg, f, {marks: true});
      const name = `${m === 'native' ? 'n' : m === 'picstills' ? 'p' : 'f'}${String(f).padStart(5, '0')}-${n.sh.id}.png`;
      if (m === 'native') writePNG(`${dir}/${name}`, n.fb, 2);
      else { const b = m === 'stills' ? review(seg, f, undefined, {n}) : picture(seg, f, undefined, {n}); overlayInto(f, m === 'stills' ? 'anim' : 'pic', b, n); writePNG(`${dir}/${name}`, b); }
      console.log('wrote', `${dir}/${name}`, n.layers.length ? '(GLYPH frame: stand-in marks in a Node still)' : '', n.host !== 'layout' ? `(${n.host.toUpperCase()})` : '');
    }
  };
  const fn = modes[mode];
  if (!fn) { console.log(`modes: ${Object.keys(modes).filter((m) => m !== 'segment').join(' | ')}`); return; }
  Promise.resolve().then(fn).catch((e) => { console.error(e); process.exit(1); });
};
/** [[first, last], ...] runs of consecutive frames (a gap over 24 frames starts a new run) */
const runsOf = (fr) => { const out = []; for (const f of fr) { const r = out[out.length - 1]; if (r && f - r[1] <= 24) r[1] = f; else out.push([f, f]); } return out; };
