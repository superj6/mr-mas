// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of the act4 FX kits (pixels exact; glyph tokens approximated as tinted cells — the real glyphs
// only exist in the Remotion render).
//   npx esbuild src/episodes/ep01/act4/kits/tools/preview.ts --bundle --platform=node --outfile=<scratch>/kpv.cjs
//   node <scratch>/kpv.cjs <outDir> <scale> <scene>:<f> | <scene>:grid:<f,f,...> [...]
import {writePNG} from '../../../../../shared/pixel/png';
import {composeFrame} from '../../../../../shared/pixel/compose';
import {TRANSPARENT} from '../../../../../shared/pixel/px';
import {SCENES} from '../scenes';

const flat = (scene, g) => {
  const {fb, layers, ui, uiLayers} = composeFrame(scene, g);
  const c = new Uint32Array(fb.c);
  const put = (L) => {
    for (let i = 0; i < L.fills.length; i += 2) for (let y = 0; y < L.cell[1]; y++) for (let x = 0; x < L.cell[0]; x++) { const X = L.fills[i] + x, Y = L.fills[i + 1] + y; if (X >= 0 && Y >= 0 && X < fb.w && Y < fb.h) c[Y * fb.w + X] = L.style.bg ?? 0x04050a; }
    for (const t of L.tokens) {
      if (t.a < 0.25 || t.v < 0.08) continue;
      const X = Math.round(t.x), Y = Math.round(t.y);
      for (let y = 0; y < 2; y++) { const XX = X, YY = Y + y; if (XX >= 0 && YY >= 0 && XX < fb.w && YY < fb.h) c[YY * fb.w + XX] = t.col; }
    }
  };
  layers.forEach(put);
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < TRANSPARENT) c[i] = ui.c[i];
  uiLayers.forEach(put);
  return {c, w: fb.w, h: fb.h};
};

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const id of ids) {
  const [name, a, b] = id.split(':');
  const scene = SCENES[name];
  if (!scene) { console.log('no scene', name); continue; }
  if (a === 'cgrid') {
    // crop grid: <scene>:cgrid:<x,y,w,h>:<f,f,...>
    const [x0, y0, cw, chh] = b.split(',').map(Number);
    const fr = id.split(':')[3].split(',').map(Number), cols = Math.min(6, fr.length), rows = Math.ceil(fr.length / cols);
    const out = new Uint32Array(cw * cols * chh * rows);
    fr.forEach((g, k) => { const {c, w} = flat(scene, g); const ox = (k % cols) * cw, oy = Math.floor(k / cols) * chh; for (let y = 0; y < chh; y++) for (let x = 0; x < cw; x++) out[(oy + y) * cw * cols + ox + x] = c[(y0 + y) * w + x0 + x]; });
    writePNG(`${outDir}/${name}-cgrid-${fr[0]}.png`, cw * cols, chh * rows, out, scale);
    console.log('wrote cgrid', name, fr.join(','));
    continue;
  }
  if (a === 'grid') {
    const fr = b.split(',').map(Number), cols = 3, rows = Math.ceil(fr.length / cols);
    const first = flat(scene, fr[0]);
    const W = first.w, H = first.h;
    const out = new Uint32Array(W * cols * H * rows);
    fr.forEach((g, k) => { const {c} = k === 0 ? first : flat(scene, g); const ox = (k % cols) * W, oy = Math.floor(k / cols) * H; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) out[(oy + y) * W * cols + ox + x] = c[y * W + x]; });
    writePNG(`${outDir}/${name}-grid-${fr[0]}.png`, W * cols, H * rows, out, scale);
    console.log('wrote grid', name, fr.join(','));
    continue;
  }
  const [gs, crop] = a.split('@');
  const g = Number(gs);
  const {c, w, h} = flat(scene, g);
  if (crop) {
    const [x0, y0, cw, chh] = crop.split(',').map(Number);
    const o = new Uint32Array(cw * chh);
    for (let y = 0; y < chh; y++) for (let x = 0; x < cw; x++) o[y * cw + x] = c[(y0 + y) * w + x0 + x];
    writePNG(`${outDir}/${name}-f${g}-crop.png`, cw, chh, o, scale);
    console.log('wrote crop', name, g);
    continue;
  }
  writePNG(`${outDir}/${name}-f${g}.png`, w, h, c, scale);
  console.log('wrote', name, g);
}
