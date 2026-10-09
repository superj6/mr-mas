// @ts-nocheck -- Node-only tool (bundled with esbuild by tools/build.mjs), excluded from the browser typecheck.
// MR. MAS — Ep2 v1 pixel pipeline: the Node renderer. A copy of the Ep1 v3 renderer (studio/src/episodes/ep01/pixel/
// tools/render.ts, which stays locked) with Ep2's paths and ONE ADDITION, the per-scene render with a content-hash cache:
//
//   node $S/r-<seg>.cjs scenes [out.mp4] [--jobs 2] [--only ID,ID] [--force ID,ID|all] [--concat] [--dry] [--cache DIR]
//       Each SCENE (the lock's scenes: runs of shots with one beat-plan scene id) renders alone, on its own clock
//       (frame.ts sceneSeg: a layout's f is the frame inside its scene), into the cache
//       out/ep02/v1/scenes/<seg>/sc-<scene>-<key>.mp4, where the key hashes everything that can change its pixels:
//         slice  the scene's shots (with every line, mouth, text, mark and spot), the rails and (burned) subtitles over
//                it, all rebased to the scene's first frame, plus the next scene's first shot (a dither exit reads it)
//         code   every source file the scene's layouts import (from the bundle's esbuild metafile, <bundle>.meta.json,
//                that tools/build.mjs writes): the scene module <seg>/scenes/sc-<scene>.ts and its imports, plus the
//                pipeline itself (tools/render.ts and its imports); a layout written straight in shots.ts brings all of
//                shots.ts's imports except the lock (data.ts)
//         assets the files a layout or its scene names (defineScene({assets}), an overlay's manifest and its layers)
//         glyph  the Remotion host's PNGs for the scene's GLYPH / browser frames (GLYPH_DIR), by content
//         enc    the encoder's settings, the picture size, the segment options, the glyph mode
//       A scene whose key is in the cache is not rendered again. Then the act picture is the scenes concatenated with
//       no re-encode (ffmpeg concat, -c copy: every scene file is a closed H.264 stream with the same settings) into
//       out/ep02/v1/picture/<seg>.mp4 (silent; the mux adds the mix), with <seg>.srt and <out>.render.json (per scene:
//       its key, cached or rendered, and why). --only renders just those scenes (no concat unless --concat); --force
//       renders them even if cached; --dry prints what would render and why, rendering nothing. Old cache entries are
//       kept (a revert costs nothing); `sceneprune` deletes those the current index doesn't name.
//   node $S/r-<seg>.cjs scenekeys                    each scene's key, cached or not, and which part changed (light)
//   node $S/r-<seg>.cjs scenecheck [--every N]       every frame (or every Nth and every shot's ends) drawn in the act
//                                                     and in its scene alone, compared pixel for pixel (exit 1 if any differ)
//   node $S/r-<seg>.cjs sceneprune                   delete the cache entries the current index doesn't name
//
// Everything below is the Ep1 renderer's, unchanged in behaviour:
// (Ep1) the Node renderer, generalized from Act Four's render5.ts. The SAME frame.ts the
// Remotion host (pixel/entry.tsx) uses, rendered in Node (no browser), piped raw to the bundled ffmpeg (an uncompressed
// AVI stream: no PNG deflate per frame), in parallel chunks cut on shot starts, concatenated and muxed onto the temp
// track (the lock's mix, or --mix). Frames only a browser can draw (GLYPH tokens; a segment's browser frames, e.g. Act
// Four's J1) are spliced in from the Remotion host's own PNGs (`glyphs`, then GLYPH_DIR); a GLYPH frame with no PNG
// falls back to v4's 2-pixel marks and is reported. Shots with no layout render as the host's STAND-IN, loudly.
// A layout may declare an `overlay` (spec.ts): RGBA frames made outside the pipeline (act1 11.04's 3D claymation CLOD),
// laid over the picture and the review frame in the room area after everything else; shots that declare none are
// untouched. The overlay stage refuses a manifest made for another lock, and reports any refusal or missing file.
//
// Build one renderer per segment (from studio/):   node src/episodes/ep02/pixel/tools/build.mjs <seg> $S/r-<seg>.cjs
// Run every heavy mode through ops/heavy.sh (at most 2 heavy jobs machine-wide, low priority):
//   node $S/r-<seg>.cjs check [--allow-standins]      layouts vs shots (stand-ins fail unless allowed), layouts that throw,
//                                                     marks / faces that did not resolve, tiling, the mix's length
//   node $S/r-<seg>.cjs glyphspan                      the frames the browser host must draw (light)
//   ../ops/heavy.sh node $S/r-<seg>.cjs bundle <dir>   one Remotion bundle of pixel/entry.tsx (then BUNDLE=<dir>)
//   ../ops/heavy.sh node $S/r-<seg>.cjs glyphs <dir> [conc 2]   Remotion renders those frames (picture + review) and 2
//                                                     plain frames either side into <dir>/{pic,anim}/; checks Node = Remotion
//   GLYPH_DIR=<dir> ../ops/heavy.sh node $S/r-<seg>.cjs picture [out.mp4] [--jobs 2] [--from a] [--to b]
//                                                     the picture (default out/ep02/v1/picture/<seg>.mp4) + <out>.srt
//   ... review [out.mp4] | both <review.mp4> <picture.mp4>     the review frame, or both in one pass
//     flags: --mix <wav> --mix-offset <frames> | --no-audio · --slate <seconds> (a reviewer head slate, silent)
//            --opt key=value (segment options, e.g. --opt j1=true --opt subs=burn) · --glyph marks (no splice, stand-in marks)
//   node $S/r-<seg>.cjs stills|picstills|native <dir> <f> ...   review frames | pictures | 480 x 270 at 2x (PNG)
//   node $S/r-<seg>.cjs contact <out.png> [native]     one still per shot (its middle frame)
//   node $S/r-<seg>.cjs cuts <dir> · ledger <out.json> · srt <out.srt>
// Env: X264_THREADS (default 2 per encoder), SEGDIR (where chunks go; default beside the output), GLYPH_DIR, BUNDLE,
//      PIXEL_OPTS (JSON segment options; --opt adds to it).
import {spawn, fork, spawnSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as crypto from 'crypto';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {prepare, native, picture, review, browserFrames, glyphFrames, srt, tcOf, wideVo, sceneSeg, PIC_W, PIC_H, ANIM_W, ANIM_H, RH} from '../frame';
import {sceneSlug} from '../spec';
import {otext} from '../text';
import {drawHeadSlate} from '../standin';

const REPO = process.env.MRMAS_ROOT ?? repo();
function repo(): string {   // the project root: the nearest .mrmas-root above the cwd (phase 1; this tool can run bundled from scratch)
  for (let d = process.cwd(); ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, '.mrmas-root'))) return d;
    if (d === path.dirname(d)) throw new Error('MR. MAS: no .mrmas-root above the cwd; set MRMAS_ROOT');
  }
}
const STUDIO = `${REPO}/studio`;
const PIXEL = `${STUDIO}/src/episodes/ep02/pixel`;
const FFDIR = `${STUDIO}/node_modules/@remotion/compositor-linux-x64-gnu`;
const FF = `${FFDIR}/ffmpeg`;
const ENV = {...process.env, LD_LIBRARY_PATH: FFDIR};
const ENTRY = 'src/episodes/ep02/pixel/entry.tsx';
const OUT = `${REPO}/out/ep02/v1`;

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
const ENC_ARGS = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-g', '48'];
const openEncoder = (outFile, W, H, N) => {
  const ff = spawn(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'avi', '-i', 'pipe:0',
    ...ENC_ARGS, '-threads', process.env.X264_THREADS ?? '2', '-f', 'mp4', outFile], {env: ENV, stdio: ['pipe', 'inherit', 'inherit']});
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
    if (['no-audio', 'allow-standins', 'native', 'dry', 'concat'].includes(k)) { flags[k] = true; continue; }
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
  // S = the segment drawn (the act, or one scene from sceneSeg); f is S's frame, A = f + S.f0 the act frame (the GLYPH
  // PNGs, the browser frames and every report are in act frames)
  const frameInto = (f, kind, target, n, S = seg) => {
    frameDraw(f, kind, target, n, S);
    overlayInto(f + S.f0, kind, target, n);
  };
  const frameDraw = (f, kind, target, n, S = seg) => {
    const A = f + S.f0;
    const need = n.layers.length > 0 || BROWSER.has(A);
    const png = need && glyphMode === 'splice' ? pngOf(kind, A) : '';
    if (png && fs.existsSync(png)) {
      const b = readPNG(png);
      if (n.layers.length && !S.spec.browser?.frames(A, S.opts)) { // a GLYPH frame must be Node's own frame outside the room area
        const mine = kind === 'pic' ? picture(S, f, undefined, {n}) : review(S, f, undefined, {n}), sc = kind === 'pic' ? 4 : 3;
        let off = 0;
        for (let i = 0; i < b.c.length; i++) if (b.c[i] !== mine.c[i]) { const x = i % b.w, y = (i / b.w) | 0; if (!(x < 480 * sc && y < 203 * sc)) off++; }
        if (off) spliceOff.push(`${kind}:${A}:${off}px`);
      }
      target.c.set(b.c); spliced[kind]++; return;
    }
    let nn = n;
    if (n.layers.length) { nn = native(S, f, {marks: true}); marked.push(`${kind}:${A}`); }
    if (BROWSER.has(A) && kind === 'pic') missing.push(A);
    if (kind === 'pic') picture(S, f, target, {n: nn}); else review(S, f, target, {n: nn});
  };
  const slateBuf = (kind, lines) => { const nb = new Buf(480, 270, PAL.N0); drawHeadSlate(nb, seg.lock, lines); const out = new Buf(kind === 'pic' ? PIC_W : ANIM_W, kind === 'pic' ? PIC_H : ANIM_H, PAL.N0); const sc = kind === 'pic' ? 4 : 3; for (let y = 0; y < out.h; y++) for (let x = 0; x < out.w; x++) out.c[y * out.w + x] = nb.c[Math.min(269, Math.floor(y / sc)) * 480 + Math.min(479, Math.floor(x / sc))]; return out; };

  // ------------------------------------------------------------------ chunks and the parallel render
  const encodeRange = async (outs, from, to, S = seg) => {
    for (const f of browserFrames(S, from, to)) BROWSER.add(f + S.f0);
    const n0 = to - from, t0 = Date.now();
    const enc = {}, bufs = {};
    if (outs.anim) { enc.anim = openEncoder(outs.anim, ANIM_W, ANIM_H, n0); bufs.anim = new Buf(ANIM_W, ANIM_H, 0); }
    if (outs.pic) { enc.pic = openEncoder(outs.pic, PIC_W, PIC_H, n0); bufs.pic = new Buf(PIC_W, PIC_H, 0); }
    for (let f = from; f < to; f++) {
      const n = native(S, f);
      const w = [];
      for (const kind of Object.keys(enc)) { frameInto(f, kind, bufs[kind], n, S); w.push(enc[kind].write(bufs[kind])); }
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


  // ================================================================== Ep2: the per-scene render and its content-hash cache
  // (the header has the rules; frame.ts sceneSeg draws a scene on its own clock, render.ts `scenecheck` proves it)
  const SCENE_V = 'ep02-scenes-1';                    // bump to invalidate every cached scene (a change to the rules here)
  const CACHE = path.resolve(flags.cache ?? process.env.SCENE_CACHE ?? `${OUT}/scenes/${SEG}`);
  const INDEX = path.join(CACHE, 'index.json');
  const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
  const FILESHA = new Map();
  const fileSha = (p) => { if (!FILESHA.has(p)) { try { FILESHA.set(p, sha(fs.readFileSync(p))); } catch { FILESHA.set(p, null); } } return FILESHA.get(p); };
  const META = (() => { try { return JSON.parse(fs.readFileSync(`${process.argv[1]}.meta.json`, 'utf8')); } catch { return null; } })();
  const closure = (entries, skip) => {
    const seen = new Set(), st = [...entries];
    while (st.length) { const p = st.pop(); if (seen.has(p) || skip.has(p)) continue; seen.add(p); for (const q of META.inputs[p] ?? []) st.push(q); }
    return seen;
  };
  const SHOTS_TS = META?.shots ?? null;
  // the lock: shots.ts's direct import named data*.ts (its own ./data.ts, or a redirected lock): the slice stands for it
  const LOCK_TS = new Set(SHOTS_TS ? (META.inputs[SHOTS_TS] ?? []).filter((q) => /^data[\w.-]*\.ts$/.test(path.basename(q))) : []);
  const CORE = META ? closure([path.join(PIXEL, 'tools', 'render.ts')], LOCK_TS) : new Set();
  const sceneModule = (id) => SHOTS_TS ? path.join(path.dirname(SHOTS_TS), 'scenes', `sc-${sceneSlug(id)}.ts`) : null;
  const relR = (p) => path.relative(REPO, p);
  /** the shots of a scene segment that count: its own, and the look-ahead only when the last one dissolves into it */
  const countedShots = (S) => {
    const own = S.shots.filter((x) => x.s < S.frames), last = own[own.length - 1];
    const dither = S.layoutOf(last)?.exit?.kind === 'dither' && S.shots.length > own.length;
    return {own, dither, shots: dither ? S.shots : own};
  };
  /** everything that can change a scene's pixels, each part hashed (the key hashes the parts) */
  const sceneParts = (id) => {
    const S = sceneSeg(seg, id), {shots, dither} = countedShots(S);
    const raw = S.lock.shots.filter((x) => shots.some((y) => y.id === x.id && y.s === x.s));
    const slice = {frames: S.frames, shots: raw, rails: S.lock.rails, subs: S.opts.subs === 'burn' ? S.lock.subs : null};
    let code, codeNote = '';
    if (!META) { code = [[path.basename(process.argv[1]), fileSha(process.argv[1])]]; codeNote = 'no metafile: the whole bundle is hashed (rebuild with tools/build.mjs)'; }
    else {
      const mods = new Set(); let whole = false;
      for (const sh of shots) { const L = S.layoutOf(sh); if (!L) continue; const m = L.scene ? sceneModule(L.scene) : null; if (m && META.inputs[m]) mods.add(m); else whole = true; }
      const files = new Set([...CORE, ...closure([...mods], LOCK_TS), ...(whole && SHOTS_TS ? closure([SHOTS_TS], LOCK_TS) : [])]);
      code = [...files].sort().map((f) => [relR(f), fileSha(f)]);
      codeNote = `${mods.size} scene module(s)${whole ? ' + all of shots.ts (a layout outside a scene module)' : ''}, ${files.size} files`;
    }
    const assets = new Set();
    for (const sh of shots) {
      const L = S.layoutOf(sh);
      for (const a of L?.assets ?? []) assets.add(path.resolve(REPO, a));
      if (L?.overlay) {
        const mf = path.resolve(REPO, L.overlay.manifest); assets.add(mf);
        try { for (const fr of JSON.parse(fs.readFileSync(mf, 'utf8')).frames ?? []) for (const p of fr.layers ?? []) assets.add(path.resolve(path.dirname(mf), p)); } catch { /* hashed as missing */ }
      }
    }
    const glyph = glyphMode === 'splice' ? browserFrames(S).map((f) => [f + S.f0, fileSha(pngOf('pic', f + S.f0))]) : 'marks';
    const parts = {
      slice: sha(JSON.stringify(slice)),
      code: sha(JSON.stringify(code)),
      assets: sha(JSON.stringify([...assets].sort().map((f) => [relR(f), fileSha(f)]))),
      glyph: sha(JSON.stringify(glyph)),
      enc: sha(JSON.stringify({v: SCENE_V, ENC_ARGS, PIC_W, PIC_H, opts: S.opts, glyphMode})),
    };
    const key = sha(JSON.stringify(parts));
    const sc = seg.scenes.find((x) => x.id === id);
    return {id, slug: sceneSlug(id), s: sc.s, e: sc.e, frames: sc.e - sc.s, key, parts, dither, codeNote,
      file: path.join(CACHE, `sc-${sceneSlug(id)}-${key.slice(0, 16)}.mp4`), shots: sc.shots};
  };
  const readIndex = () => { try { return JSON.parse(fs.readFileSync(INDEX, 'utf8')); } catch { return null; } };
  const changedParts = (p, old) => !old ? ['new scene'] : old.key === p.key ? [] : Object.keys(p.parts).filter((k) => old.parts?.[k] !== p.parts[k]);
  const probeFrames = (file) => {
    const r = spawnSync(`${FFDIR}/ffprobe`, ['-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', file], {env: ENV});
    return Number(String(r.stdout).trim());
  };
  const scenesMode = async () => {
    const t0 = Date.now();
    const ids = seg.scenes.map((x) => x.id);
    if (new Set(ids).size !== ids.length) throw new Error(`scene ids repeat in ${SEG}: ${ids.join(' ')} (lock.py names a split scene's runs id~2)`);
    const only = flags.only ? String(flags.only).split(',') : null, force = flags.force ? String(flags.force).split(',') : [];
    for (const x of [...(only ?? []), ...force.filter((y) => y !== 'all')]) if (!ids.includes(x)) throw new Error(`no scene ${x} in ${SEG} (scenes: ${ids.join(' ')})`);
    loud();
    const prev = readIndex(), prevOf = (id) => prev?.scenes?.find((x) => x.id === id) ?? null;
    const rows = seg.scenes.map((sc) => {
      const p = sceneParts(sc.id);
      const want = !only || only.includes(sc.id);
      const cached = fs.existsSync(p.file);
      const forced = force.includes('all') || force.includes(sc.id);
      return {...p, want, cached, forced, todo: want && (!cached || forced), why: changedParts(p, prevOf(sc.id))};
    });
    for (const r of rows) console.log(`scene ${r.id.padEnd(8)} f ${String(r.s).padStart(6)}-${String(r.e).padEnd(6)} ${String(r.frames).padStart(5)} f  ${r.key.slice(0, 16)}  ${!r.want ? 'skipped (--only)' : r.todo ? (r.forced && r.cached ? 'RENDER (forced)' : `RENDER (${r.why.join(', ') || 'not in the cache'})`) : 'cached'}${r.dither ? '  [dither exit: the next scene\'s first shot is in its key]' : ''}`);
    if (!META) console.log('NOTE: no <bundle>.meta.json: every scene\'s code part is the whole bundle (rebuild with tools/build.mjs)');
    if (flags.dry) return;
    fs.mkdirSync(CACHE, {recursive: true});
    const todo = rows.filter((r) => r.todo), jobs = Math.max(1, Number(flags.jobs ?? 2));
    const workerEnv = {...ENV, PIXEL_OPTS: JSON.stringify(OPTS)};
    const queue = [...todo].sort((a, b) => b.frames - a.frames);   // longest first: the pool finishes together
    const runOne = (r) => new Promise((resolve, reject) => {
      const tmp = path.join(CACHE, `.part-${r.slug}-${process.pid}.mp4`);
      const t1 = Date.now();
      const p = fork(process.argv[1], ['scenepart', r.id, tmp, ...(flags.glyph ? ['--glyph', flags.glyph] : [])], {env: workerEnv});
      p.on('exit', (c) => {
        if (c !== 0) { fs.rmSync(tmp, {force: true}); fs.rmSync(`${tmp}.json`, {force: true}); return reject(new Error(`scene ${r.id}: worker exit ${c}`)); }
        const st = JSON.parse(fs.readFileSync(`${tmp}.json`, 'utf8'));
        fs.rmSync(`${tmp}.json`, {force: true});
        const n = probeFrames(tmp);
        if (n !== r.frames) { fs.rmSync(tmp, {force: true}); return reject(new Error(`scene ${r.id}: ${n} frames encoded, ${r.frames} wanted`)); }
        fs.renameSync(tmp, r.file);
        r.ms = Date.now() - t1; r.stats = st; r.rendered = true;
        fs.writeFileSync(`${r.file}.json`, JSON.stringify({seg: SEG, scene: r.id, key: r.key, parts: r.parts, frames: r.frames, act_from: r.s, act_to: r.e, shots: r.shots,
          code: r.codeNote, rendered: new Date().toISOString(), ms: r.ms, bundle: path.basename(process.argv[1]), ...st}, null, 1));
        console.log(`  rendered scene ${r.id}: ${r.frames} f in ${(r.ms / 1000).toFixed(1)} s -> ${relR(r.file)}`);
        resolve(0);
      });
    });
    const pool = Array.from({length: Math.min(jobs, queue.length)}, async () => { while (queue.length) await runOne(queue.shift()); });
    await Promise.all(pool);
    // the index: what the act is made of now (the previous one is kept for sceneprune and for "what changed")
    const index = {seg: SEG, frames: N, updated: new Date().toISOString(), lock: seg.lock.source.timeline, cache: relR(CACHE),
      scenes: rows.map((r) => ({id: r.id, slug: r.slug, s: r.s, e: r.e, frames: r.frames, key: r.key, parts: r.parts, file: relR(r.file), shots: r.shots})),
      previous: prev ? {updated: prev.updated, scenes: (prev.scenes ?? []).map((x) => ({id: x.id, key: x.key, file: x.file}))} : null};
    if (!only) fs.writeFileSync(INDEX, JSON.stringify(index, null, 1));
    const concat = !only || flags.concat;
    if (!concat) { console.log(`done (${todo.length} rendered; --only: no act picture; the scene files are in ${relR(CACHE)})`); return; }
    const missingFiles = rows.filter((r) => !fs.existsSync(r.file));
    if (missingFiles.length) throw new Error(`no cached file for scene(s) ${missingFiles.map((r) => r.id).join(' ')}: run scenes without --only`);
    const out = path.resolve(pos[0] ?? `${OUT}/picture/${SEG}.mp4`);
    fs.mkdirSync(path.dirname(out), {recursive: true});
    const list = path.join(CACHE, `.concat-${process.pid}.txt`);
    fs.writeFileSync(list, rows.map((r) => `file '${r.file}'`).join('\n') + '\n');
    await run(FF, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', '-f', 'mp4', `${out}.part`]);
    fs.rmSync(list, {force: true});
    const n = probeFrames(`${out}.part`);
    if (n !== N) { fs.rmSync(`${out}.part`, {force: true}); throw new Error(`the act picture has ${n} frames, the lock ${N}`); }
    fs.renameSync(`${out}.part`, out);
    const srtFile = out.replace(/\.mp4$/, '.srt');
    fs.writeFileSync(srtFile, srt(seg, 0, 0, N));
    const report = {seg: SEG, frames: N, mode: 'scenes', out: relR(out), cache: relR(CACHE), seconds: Math.round((Date.now() - t0) / 1000), opts: seg.opts,
      bundle_built: fs.statSync(process.argv[1]).mtime.toISOString(), glyph_dir: GLYPH_DIR || null, glyph_mode: glyphMode, standins: seg.standins, layout_problems: seg.problems,
      rendered: rows.filter((r) => r.rendered).map((r) => r.id), cached: rows.filter((r) => !r.rendered).map((r) => r.id),
      scenes: rows.map((r) => ({id: r.id, s: r.s, e: r.e, frames: r.frames, key: r.key, file: relR(r.file), status: r.rendered ? 'rendered' : 'cached', changed: r.rendered ? r.why : [], ms: r.ms ?? null, code: r.codeNote, stats: r.stats ?? null}))};
    fs.writeFileSync(`${out}.render.json`, JSON.stringify(report, null, 1));
    console.log(`wrote ${relR(out)}: ${N} frames, ${rows.length} scenes (${report.rendered.length} rendered: ${report.rendered.join(' ') || 'none'}; ${report.cached.length} cached), concatenated without re-encoding in ${report.seconds} s · ${relR(srtFile)} · ${relR(out)}.render.json`);
    loud();
  };
  const modes = {
    segment: async () => { // worker: [from, to) -> its chunk file(s)
      const [a, p, from, to] = pos;
      const outs = {anim: a !== '-' ? a : null, pic: p !== '-' ? p : null};
      const r = await encodeRange(outs, Number(from), Number(to));
      fs.writeFileSync(path.join(path.dirname(a !== '-' ? a : p), `seg-${from}.json`), JSON.stringify({from: Number(from), to: Number(to), ms: r.ms, spliced, marked, spliceOff, missing, failed: Object.fromEntries(seg.failed), overlaid, overlayMissing, overlayRefused}));
      process.exit(0);
    },
    scenepart: async () => { // worker: one scene, on its own clock, into pos[1]
      const S = sceneSeg(seg, pos[0]);
      const r = await encodeRange({pic: pos[1]}, 0, S.frames, S);
      fs.writeFileSync(`${pos[1]}.json`, JSON.stringify({ms: r.ms, spliced, marked, spliceOff, missing, failed: Object.fromEntries(S.failed), overlaid, overlayMissing, overlayRefused, standins: S.standins}));
      process.exit(0);
    },
    scenes: () => scenesMode(),
    scenekeys: () => {
      const prev = readIndex();
      for (const sc of seg.scenes) {
        const p = sceneParts(sc.id), old = prev?.scenes?.find((x) => x.id === sc.id);
        const ch = changedParts(p, old);
        console.log(`scene ${sc.id.padEnd(8)} ${String(p.frames).padStart(5)} f  ${p.key.slice(0, 16)}  ${fs.existsSync(p.file) ? 'cached' : 'NOT CACHED'}  ${ch.length ? `changed since the index: ${ch.join(', ')}` : 'as the index'}  (${p.codeNote})`);
      }
    },
    scenecheck: () => { // the act's frames against the same frames drawn by each scene alone
      const every = Math.max(1, Number(flags.every ?? 1));
      let n = 0, bad = [];
      for (const sc of seg.scenes) {
        const S = sceneSeg(seg, sc.id);
        const want = new Set();
        for (let j = 0; j < S.frames; j += every) want.add(j);
        for (const sh of S.shots) if (sh.s < S.frames) { want.add(sh.s); want.add(Math.min(S.frames - 1, sh.e - 1)); }
        want.add(S.frames - 1);
        for (const j of [...want].sort((a, b) => a - b)) {
          const a = native(seg, sc.s + j, {marks: true}), b = native(S, j, {marks: true});
          n++;
          let d = 0; for (let i = 0; i < a.fb.c.length; i++) if (a.fb.c[i] !== b.fb.c[i]) d++;
          const la = JSON.stringify(a.layers), lb = JSON.stringify(b.layers);
          if (d || la !== lb || a.host !== b.host) bad.push(`${sc.id}:${j} (act ${sc.s + j}): ${d} px differ${la !== lb ? ', GLYPH layers differ' : ''}${a.host !== b.host ? `, host ${a.host}/${b.host}` : ''}`);
        }
      }
      console.log(JSON.stringify({seg: SEG, scenes: seg.scenes.length, frames_compared: n, differing: bad.length, first: bad.slice(0, 20)}, null, 1));
      process.exit(bad.length ? 1 : 0);
    },
    sceneprune: () => {
      const idx = readIndex();
      if (!idx) { console.log('no index in', relR(CACHE), '(run scenes first)'); return; }
      const keep = new Set([...(idx.scenes ?? []), ...((idx.previous ?? {}).scenes ?? [])].map((x) => path.basename(x.file)));
      let gone = 0, bytes = 0;
      for (const f of fs.readdirSync(CACHE)) {
        const base = f.replace(/\.json$/, '');
        if (!/^sc-.*\.mp4$/.test(base) || keep.has(base)) continue;
        bytes += fs.statSync(path.join(CACHE, f)).size; fs.rmSync(path.join(CACHE, f)); gone++;
      }
      console.log(`sceneprune ${SEG}: removed ${gone} files (${(bytes / 1e6).toFixed(1)} MB); kept the current and the previous index's scenes`);
    },
    picture: () => renderSeg({pic: path.resolve(pos[0] ?? `${OUT}/picture/${SEG}.mp4`)}, Number(flags.jobs ?? 2), Number(flags.from ?? 0), Number(flags.to ?? N)),
    review: () => renderSeg({anim: path.resolve(pos[0] ?? `${OUT}/review/${SEG}-review.mp4`)}, Number(flags.jobs ?? 2), Number(flags.from ?? 0), Number(flags.to ?? N)),
    both: () => renderSeg({anim: path.resolve(pos[0] ?? `${OUT}/review/${SEG}-review.mp4`), pic: path.resolve(pos[1] ?? `${OUT}/picture/${SEG}.mp4`)}, Number(flags.jobs ?? 2), Number(flags.from ?? 0), Number(flags.to ?? N)),
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
        for (const [kind, comp] of [['pic', `ep02-pixel-${SEG}`], ['anim', `ep02-pixel-${SEG}-review`]]) {
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
      otext(sheet, `MR. MAS · EP2 · ${seg.lock.label} · PIXEL PIPELINE (${SEG}) · ONE STILL PER SHOT (ITS MIDDLE FRAME)${nat ? ' · 480 x 270 AT 1X' : ''}`, 12, 14, 2, 0xf2efe6);
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
