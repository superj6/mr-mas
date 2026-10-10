// @ts-nocheck -- Node-only tool (bundled with esbuild by tools/build.mjs), excluded from the browser typecheck.
// MR. MAS — Ep2 v1 · act4 · sc 22: the 2.H splice. Writes each sc 22 shot's OVERLAY (spec.ts Layout.overlay; render.ts
// lays the layers over the picture, room area only, bottom first, straight alpha): for every frame, its 3D plate (the
// art pass's seven, out/ep02/v1/art/iss/plates, and this pass's, out/ep02/v1/inserts/iss/plates, made RGBA here: opaque,
// except the insert plate's keyed gap, which is transparent so the layout's pixel room shows through it) and, where the
// frame has one, the pixel figures' layer drawn by the scene module's own ISS_PLAN (scenes/sc-22.ts) at 4x nearest
// (a figure's contact shadow is black at 30% alpha). Identical figure layers are written once. Keeping the contrast:
// nothing is graded, rimmed or down-rezzed on either side.
// Writes (the PNGs git-ignored, the manifests tracked): out/ep02/v1/inserts/iss/rgba/<plate>.png · out/ep02/v1/inserts/iss/<shot>/manifest.json and
// fig-<hash>.png. Build (light) and run (through ops/heavy.sh), from studio/:
//   node src/episodes/ep02/pixel/tools/build.mjs --entry src/episodes/ep02/pixel/act4/tools/iss22-insert.ts $S/iss22.cjs
//   ../ops/heavy.sh node $S/iss22.cjs
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as crypto from 'crypto';
import {Buf, TRANSPARENT} from '../../../../../shared/pixel/px';
import {SEGMENT} from '../shots';
import {prepare} from '../../frame';
import {ISS_PLAN} from '../scenes/sc-22';
import {ISS_SHADOW} from '../sets/iss';
import {readPNG} from '../../tools/render';

const REPO = path.resolve(__dirname.includes('studio') ? __dirname.slice(0, __dirname.indexOf('/studio')) : process.cwd(), '.');
const root = (() => { let d = process.cwd(); while (d !== '/' && !fs.existsSync(path.join(d, '.mrmas-root'))) d = path.dirname(d); return d; })();
const OUT = path.join(root, 'out/ep02/v1/inserts/iss');
const SRC = [path.join(root, 'out/ep02/v1/inserts/iss/plates'), path.join(root, 'out/ep02/v1/art/iss/plates')];
const W = 1920, H = 812, RH = 203;
void REPO;

// ------------------------------------------------------------------ PNG (RGBA)
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (buf) => { let c = 0xffffffff; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const out = Buffer.alloc(12 + data.length); out.writeUInt32BE(data.length, 0); out.write(type, 4, 'ascii'); Buffer.from(data).copy(out, 8); out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length); return out; };
const writeRGBA = (file, px, w, h) => {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(px.buffer, px.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, {level: 6})), chunk('IEND', Buffer.alloc(0))]));
};

// ------------------------------------------------------------------ the plates, RGBA
const KEYED = (r, g, b) => g > r + 50 && g > b + 50;
const done = new Map();
const plateRGBA = (name) => {
  if (done.has(name)) return done.get(name);
  const src = SRC.map((d) => path.join(d, `${name}.png`)).find((p) => fs.existsSync(p));
  if (!src) throw new Error(`no plate ${name} in ${SRC.join(' or ')}`);
  // (the review pass, P15 FIRM: every pop at 80% white or less) the tilt's plates (the opening white is tilt_00, the
  // first frames after 20.13's dark phone) go through a soft knee: luma above 0.70 eases toward a 0.79 ceiling, the
  // colour kept (the RGB scaled with it); below the knee nothing changes, so tilt_27 still meets the art's wide plate
  // (its brightest pixel 0.773 -> 0.761). A safety level, not a grade match: the leap keeps its contrast.
  const cap = name.startsWith('tilt_');
  const out = path.join(OUT, 'rgba', cap ? `${name}-c79.png` : `${name}.png`);
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs) {
    const r = readPNG(src);
    const px = new Uint8Array(W * H * 4);
    const K0 = 0.70, CAP = 0.79;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const sx = Math.floor((x * r.w) / W), sy = Math.floor((y * r.h) / H), v = r.c[sy * r.w + sx], o = (y * W + x) * 4;
      let R = (v >> 16) & 255, G = (v >> 8) & 255, B = v & 255;
      if (cap) {
        const Y = (0.299 * R + 0.587 * G + 0.114 * B) / 255;
        if (Y > K0) { const Y2 = K0 + (CAP - K0) * Math.tanh((Y - K0) / (CAP - K0)), k = Y2 / Y; R = Math.round(R * k); G = Math.round(G * k); B = Math.round(B * k); }
      }
      px[o] = R; px[o + 1] = G; px[o + 2] = B; px[o + 3] = name === 'insert' && KEYED(R, G, B) ? 0 : 255;
    }
    writeRGBA(out, px, W, H);
    console.log('plate', name, '<-', path.relative(root, src));
  }
  done.set(name, out);
  return out;
};

// ------------------------------------------------------------------ the figure layers and manifests
const seg = prepare(SEGMENT);
const shots = seg.shots.filter((s) => s.scene === '22');
fs.mkdirSync(path.join(OUT, 'rgba'), {recursive: true});
for (const sh of shots) {
  const dir = path.join(OUT, sh.id);
  fs.mkdirSync(dir, {recursive: true});
  const len = sh.e - sh.s, frames = [], seen = new Map();
  for (let k = 0; k < len; k++) {
    const f = sh.s - sh.sceneS + k;
    const p = ISS_PLAN[sh.id](k, sh, f);
    if (!p.plate) continue;
    const layers = [path.relative(dir, plateRGBA(p.plate))];
    if (p.fig) {
      const b = new Buf(480, 270, TRANSPARENT);
      p.fig(b);
      const px = new Uint8Array(W * H * 4);
      let any = false;
      for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
        const v = b.c[y * 480 + x];
        if (v === TRANSPARENT) continue;
        any = true;
        const [R, G, B, A] = v === ISS_SHADOW ? [0, 0, 0, 77] : [(v >> 16) & 255, (v >> 8) & 255, v & 255, 255];
        for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const o = ((y * 4 + j) * W + x * 4 + i) * 4; px[o] = R; px[o + 1] = G; px[o + 2] = B; px[o + 3] = A; }
      }
      if (any) {
        const h = crypto.createHash('md5').update(px).digest('hex').slice(0, 16);
        let file = seen.get(h);
        if (!file) { file = `fig-${h}.png`; writeRGBA(path.join(dir, file), px, W, H); seen.set(h, file); }
        layers.push(file);
      }
    }
    frames.push({k, layers});
  }
  // drop figure files a previous run left that this one doesn't name
  for (const f of fs.readdirSync(dir)) if (f.startsWith('fig-') && ![...seen.values()].includes(f)) fs.unlinkSync(path.join(dir, f));
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({shot: sh.id, shot_len: len, note: '2.H: the 3D plate (RGBA) and the pixel figures\' layer, per frame (act4/tools/iss22-insert.ts)', frames}, null, 0));
  console.log(sh.id, `${frames.length} frames · ${seen.size} figure layers`);
}
