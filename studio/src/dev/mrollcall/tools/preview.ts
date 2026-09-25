// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// mrollcall Node preview (pixels only; glyph layers are approximated as tinted cells):
//   npx esbuild src/dev/mrollcall/tools/preview.ts --bundle --platform=node --outfile=<scratch>/rc.cjs
//   node <scratch>/rc.cjs <outDir> <scale> f:<global> strip:<flash 0-7> win:<flash>:<k> contact
import {writePNG} from './png';
import {Buf} from '../../../shared/pixel/px';
import {composeFrame} from '../../../shared/pixel/compose';
import {drawRollcall, drawSheet, SHEET_W, SHEET_H} from '../scene';
import {CUTS, WINDOWS, cutLen, MR} from '../timeline';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;

const frameBuf = (g: number, sheet = false) => {
  const {fb, layers} = sheet ? composeFrame({draw: (b) => drawSheet(b), nativeW: SHEET_W, nativeH: SHEET_H}, 0) : composeFrame({draw: (b, f) => drawRollcall(b, f)}, g);
  // approximate glyph tokens: paint each token's cell in its colour (Node has no font)
  for (const l of layers) {
    const [cw, ch] = l.cell;
    for (let i = 0; i < l.fills.length; i += 2) for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) fb.set(l.fills[i] + x, l.fills[i + 1] + y, l.style.bg ?? 0x04050a);
    for (const t of l.tokens) if (t.a > 0.3) for (let y = 1; y < ch; y++) for (let x = 0; x < cw - (t.v < 0.4 ? 1 : 0); x++) fb.set(t.x + x, t.y + y, t.col);
  }
  return fb;
};

const crop = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  const o = new Buf(w, h, 0x04050a);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) o.c[y * w + x] = b.get(x0 + x, y0 + y);
  return o;
};

const tile = (bufs: Buf[], cols: number, gap = 2) => {
  const cw = Math.max(...bufs.map((b) => b.w)), chh = Math.max(...bufs.map((b) => b.h));
  const rows = Math.ceil(bufs.length / cols);
  const o = new Buf(cols * (cw + gap), rows * (chh + gap), 0x141a30);
  bufs.forEach((b, i) => {
    const ox = (i % cols) * (cw + gap), oy = Math.floor(i / cols) * (chh + gap);
    for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) o.c[(oy + y) * o.w + ox + x] = b.c[y * b.w + x];
  });
  return o;
};

for (const id of ids) {
  const [kind, a, bb] = id.split(':');
  let out: Buf;
  let name = id.replace(/:/g, '-');
  if (kind === 'f') out = frameBuf(Number(a));
  else if (kind === 'strip') {
    const n = Number(a);
    const w = WINDOWS[n];
    const fr = Array.from({length: cutLen(n)}, (_, k) => crop(frameBuf(CUTS[n] + k), w.x - 4, w.y - 4, w.w + 8, w.h + 16));
    out = tile(fr, Math.min(8, fr.length));
  } else if (kind === 'win') {
    const n = Number(a), k = Number(bb ?? 0);
    const w = WINDOWS[n];
    out = crop(frameBuf(CUTS[n] + k), w.x - 4, w.y - 4, w.w + 8, w.h + 16);
  } else if (kind === 'sheet') {
    out = frameBuf(0, true);
  } else if (kind === 'contact') {
    const fr = Array.from({length: MR.frames}, (_, i) => frameBuf(MR.from + i));
    out = tile(fr, 6, 4);
  } else { console.log('unknown view', id); continue; }
  writePNG(`${outDir}/${name}.png`, out.w, out.h, out.c, scale);
  console.log('wrote', name, out.w + 'x' + out.h);
}
