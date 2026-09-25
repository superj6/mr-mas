// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// mfinale preview: node preview.cjs <outDir> <scale> <g>[@x,y,w,h] ... | grid:<g0>,<g1>,...
// Renders GLOBAL intro frames through composeFrame (no DOM): glyph layers are shown as flat cells.
import {writePNG} from './png';
import {composeFrame} from '../../../shared/pixel/compose';
import {TRANSPARENT} from '../../../shared/pixel/px';
import {mfinaleScene} from '../scene';

const flat = (g) => {
  const {fb, layers, ui, uiLayers} = composeFrame(mfinaleScene, g);
  const c = new Uint32Array(fb.c);
  const put = (L) => {
    for (let i = 0; i < L.fills.length; i += 2) for (let y = 0; y < L.cell[1]; y++) for (let x = 0; x < L.cell[0]; x++) { const X = L.fills[i] + x, Y = L.fills[i + 1] + y; if (X >= 0 && Y >= 0 && X < 480 && Y < 270) c[Y * 480 + X] = L.style.bg ?? 0x04050a; }
    for (const t of L.tokens) { if (t.a < 0.3 || t.v < 0.1) continue; const X = Math.round(t.x), Y = Math.round(t.y); for (let y = 0; y < 2; y++) for (let x = 0; x < 1; x++) { const XX = X + x, YY = Y + y; if (XX >= 0 && YY >= 0 && XX < 480 && YY < 270) c[YY * 480 + XX] = t.col; } }
  };
  layers.forEach(put);
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < TRANSPARENT) c[i] = ui.c[i];
  uiLayers.forEach(put);
  return c;
};

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;
for (const id of ids) {
  if (id.startsWith('grid:')) {
    const fr = id.slice(5).split(',').map(Number), cols = 3, rows = Math.ceil(fr.length / cols);
    const out = new Uint32Array(480 * cols * 270 * rows);
    fr.forEach((g, k) => { const c = flat(g); const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270; for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) out[(oy + y) * 480 * cols + ox + x] = c[y * 480 + x]; });
    writePNG(`${outDir}/grid-${fr[0]}.png`, 480 * cols, 270 * rows, out, scale);
    console.log('wrote grid', fr.join(','));
    continue;
  }
  const [gs, crop] = id.split('@');
  const g = Number(gs);
  const c = flat(g);
  if (crop) {
    const [x0, y0, w, h] = crop.split(',').map(Number);
    const o = new Uint32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) o[y * w + x] = c[(y0 + y) * 480 + x0 + x];
    writePNG(`${outDir}/f${g}-crop.png`, w, h, o, scale);
  } else writePNG(`${outDir}/f${g}.png`, 480, 270, c, scale);
  console.log('wrote', id);
}
