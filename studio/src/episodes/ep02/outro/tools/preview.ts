// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Ep2's outro: a fast Node preview and the text checks (pixels exact; GLYPH tokens drawn as tinted cells; a copy of
// Ep1's outro B preview, studio/src/dev/outro/b/tools/preview.ts, for two pages and no moth).
//   S=<scratch>; (cd studio && node_modules/.bin/esbuild src/episodes/ep02/outro/tools/preview.ts --bundle --platform=node --outfile=$S/pv.js)
//   node $S/pv.js <outDir> <scale> <frame>[,<frame>...]     one PNG per frame (scale 4 = 1920x1080, the full-size look)
//   node $S/pv.js <outDir> 1 grid:<f>,<f>,...                a 4-wide contact grid
//   node $S/pv.js <outDir> 1 check                           the text checks -> <outDir>/check-ep2.json
import * as fs from 'fs';
import {writePNG} from '../../../../shared/pixel/png';
import {composeFrame} from '../../../../shared/pixel/compose';
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {makeScene, textRows, castRow, INK_RESOLVED, INK_ROLE, INK_VOICE} from '../scene';
import {tx, ORB} from '../art';
import {T, OUT_F} from '../timeline';

const [outDir, scaleS, spec] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
const scene = makeScene();
const LAST = OUT_F - 1;

const render = (f) => {
  const {fb, layers, ui} = composeFrame(scene, f);
  const c = fb.c.slice();
  for (const l of layers) {
    const [cw, ch] = l.cell;
    for (let i = 0; i < l.fills.length; i += 2)
      for (let j = 0; j < ch; j++) for (let k = 0; k < cw; k++) { const x = l.fills[i] + k, y = l.fills[i + 1] + j; if (x >= 0 && y >= 0 && x < fb.w && y < fb.h) c[y * fb.w + x] = l.style.bg ?? 0x04050a; }
    for (const t of l.tokens) {
      const a = t.a * (0.35 + 0.65 * t.v);
      for (let j = 1; j < ch; j++) for (let k = 0; k < Math.max(1, cw - 1); k++) {
        const x = t.x + k, y = t.y + j;
        if (x < 0 || y < 0 || x >= fb.w || y >= fb.h) continue;
        const o = c[y * fb.w + x];
        const mix = (s) => Math.round(((o >> s) & 255) * (1 - a) + ((t.col >> s) & 255) * a);
        c[y * fb.w + x] = (mix(16) << 16) | (mix(8) << 8) | mix(0);
      }
    }
  }
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  return c;
};

if (spec === 'check') {
  // 1) every row ends clear of the Orb; no two rows' boxes overlap. 2) READ TIME on the rendered pixels: a row is
  // LEGIBLE on a frame when every pixel of its type is an ink colour and every other pixel in the type's box its ground
  // (a token, a ray or a half-drawn chip fails it). Page 1's rows must stay legible to the page turn (o180), page 2's
  // to the last frame. Then per line (on screen >= 0.25 s + 0.05 s a character, LEARNINGS P15) and each page READ IN
  // ORDER at 16, 18 and 20 characters a second.
  const frames = {};
  for (let o = 0; o <= LAST; o++) frames[o] = render(o);
  const rows = textRows();
  const maxX = ORB.cx - ORB.r - 24;
  const overlaps = [];
  rows.forEach((a, i) => rows.forEach((b, j) => {
    if (j <= i || a.page !== b.page) return;
    if (a.box[0] <= b.box[2] && b.box[0] <= a.box[2] && a.box[1] <= b.box[3] && b.box[1] <= a.box[3]) overlaps.push([a.line, b.line]);
  }));
  const masks = rows.map((r) => { const m = new Buf(480, 270, 0); if (r.cast) castRow(m, r.cast, r.x, r.y, 1, 1); else tx(m, r.line, r.x, r.y, 1); return m; });
  const legible = (c, r, m) => {
    const pairs = r.cast
      ? [[[INK_ROLE, INK_VOICE], [PAL.N0, PAL.N1]]]
      : [[[PAL.C8], [PAL.C1]], [[INK_RESOLVED], [PAL.N0, PAL.N1]], [[PAL.N0], [PAL.C6]]];
    return pairs.some(([inks, grounds]) => {
      for (let yy = r.y; yy <= r.y + 8; yy++) for (let xx = r.x; xx < r.x + r.w; xx++) {
        const v = c[yy * 480 + xx];
        if (m.c[yy * 480 + xx]) { if (!inks.includes(v)) return false; } else if (!grounds.includes(v)) return false;
      }
      return true;
    });
  };
  const out = rows.map((r, i) => {
    const end = r.page === 1 ? T.turn[0] - 1 : LAST;
    let from = null;
    for (let o = end; o >= 0; o--) { if (legible(frames[o], r, masks[i])) from = o; else break; }
    const chars = [...r.line].length;
    const on = from === null ? 0 : end - from + 1;
    const need = 0.25 + 0.05 * chars;
    return {page: r.page, line: r.line, chars, px: r.w, box: r.box, right: r.box[2], clearOfOrb: r.box[2] < maxX, legibleFrom: from,
            legibleTo: end, seconds: +(on / 24).toFixed(2), needP15: +need.toFixed(2), perLineOk: on / 24 >= need};
  });
  const inOrder = (page, cps) => {
    const rs = out.filter((r) => r.page === page);
    let t = 0;
    const fin = rs.map((r) => { t = Math.max(t, r.legibleFrom ?? 999) + (r.chars / cps) * 24; return +t.toFixed(1); });
    const end = (page === 1 ? T.turn[0] : LAST + 1);
    return {page, cps, chars: rs.reduce((a, r) => a + r.chars, 0), lastFinish: fin[fin.length - 1], pageEnds: end,
            marginFrames: +(end - fin[fin.length - 1]).toFixed(1), ok: fin[fin.length - 1] <= end};
  };
  const res = {rows: out, overlaps, inOrder: [1, 2].flatMap((p) => [16, 18, 20].map((c) => inOrder(p, c))),
    clearOfOrb: out.every((r) => r.clearOfOrb), perLineOk: out.every((r) => r.perLineOk)};
  res.ok = res.clearOfOrb && res.perLineOk && !overlaps.length && res.inOrder.filter((x) => x.page === 1 && x.cps === 16)[0].ok;
  fs.writeFileSync(`${outDir}/check-ep2.json`, JSON.stringify(res, null, 1));
  console.log(JSON.stringify({ok: res.ok, clearOfOrb: res.clearOfOrb, perLineOk: res.perLineOk, overlaps: overlaps.length,
    rightmost: Math.max(...out.map((r) => r.right)), page1: out.filter((r) => r.page === 1).map((r) => `${r.legibleFrom}:${r.seconds}s`),
    page2From: [Math.min(...out.filter((r) => r.page === 2).map((r) => r.legibleFrom ?? 999)), Math.max(...out.filter((r) => r.page === 2).map((r) => r.legibleFrom ?? 999))],
    inOrder: res.inOrder.map((x) => `p${x.page} ${x.cps}cps: ${x.chars}ch done ${x.lastFinish}/${x.pageEnds}`)}));
} else if (spec.startsWith('grid:')) {
  const fsx = spec.slice(5).split(',').map(Number);
  const cols = 4, rowsN = Math.ceil(fsx.length / cols);
  const W = 480 * cols, H = 270 * rowsN;
  const c = new Uint32Array(W * H);
  fsx.forEach((f, k) => {
    const b = render(f);
    const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
    for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(oy + y) * W + ox + x] = b[y * 480 + x];
  });
  writePNG(`${outDir}/grid-ep2.png`, W, H, c, scale);
  console.log('ok');
} else {
  for (const f of spec.split(',').map(Number)) writePNG(`${outDir}/pv-ep2-f${String(f).padStart(3, '0')}.png`, 480, 270, render(f), scale);
  console.log('ok');
}
