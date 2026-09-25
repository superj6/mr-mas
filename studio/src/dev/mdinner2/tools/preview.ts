// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node preview of mdinner2 (pixel-exact; this span uses no glyph layers).
//   npx esbuild src/dev/mdinner2/tools/preview.ts --bundle --platform=node --outfile=<scratch>/md2.cjs
//   node <scratch>/md2.cjs <outDir> <scale> f:<global> | grid:<g,g,..> | diff:<global> (vs mdinner1's scene)
import {writePNG} from '../../pixeladv/tools/png';
import {composeFrame} from '../../../shared/pixel/compose';
import {SCENE, _tunePrint} from '../scene';
import {toLocal} from '../timeline';
import {SCENE as MD1_SCENE} from '../../mdinner1/scene';
import {toLocal as md1Local} from '../../mdinner1/timeline';

const [outDir, scaleS, ...ids] = process.argv.slice(2);
const scale = Number(scaleS) || 2;

const flat = (scene, local) => {
  const {fb, ui} = composeFrame(scene, local);
  const c = fb.c.slice();
  if (ui) for (let i = 0; i < c.length; i++) if (ui.c[i] < 0x1000000) c[i] = ui.c[i];
  return c;
};
const render = (g) => flat(SCENE, toLocal(g));

for (const id of ids) {
  const [kind, arg] = id.split(':');
  // tune:<set>=<lo>,<hi>,<gamma>;...  re-tunes the print's curves (room, figure, star, linen, type, pop) for the views after it
  if (kind === 'tune') { const t = {}; for (const q of arg.split(';')) { const [k, v] = q.split('='); const [lo, hi, gamma] = v.split(',').map(Number); t[k] = {lo, hi, gamma}; } _tunePrint(t); continue; }
  if (kind === 'f') writePNG(`${outDir}/f${arg}.png`, 480, 270, render(Number(arg)), scale);
  else if (kind === 'grid') {
    const fs = arg.split(',').map(Number);
    const cols = Math.min(4, fs.length), rows = Math.ceil(fs.length / cols);
    const W = 480 * cols, H = 270 * rows;
    const c = new Uint32Array(W * H);
    fs.forEach((g, k) => {
      const b = render(g);
      const ox = (k % cols) * 480, oy = Math.floor(k / cols) * 270;
      for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) c[(oy + y) * W + ox + x] = b[y * 480 + x];
    });
    writePNG(`${outDir}/grid-${fs[0]}-${fs[fs.length - 1]}.png`, W, H, c, scale);
  } else if (kind === 'c') {
    // c:<g>,<x>,<y>,<w>,<h>  crop of a frame
    const [g, x0, y0, w, h] = arg.split(',').map(Number);
    const a = render(g);
    const c = new Uint32Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c[y * w + x] = a[(y0 + y) * 480 + x0 + x];
    writePNG(`${outDir}/c${g}-${x0}.png`, w, h, c, scale);
  } else if (kind === 'cgrid') {
    // cgrid:<x>,<y>,<w>,<h>,<g>,<g>,...  the same crop across frames, side by side
    const [x0, y0, w, h, ...gs] = arg.split(',').map(Number);
    const cols = Math.min(6, gs.length), rows = Math.ceil(gs.length / cols);
    const c = new Uint32Array(w * cols * h * rows);
    gs.forEach((g, k) => {
      const a = render(g);
      const ox = (k % cols) * w, oy = Math.floor(k / cols) * h;
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c[(oy + y) * w * cols + ox + x] = a[(y0 + y) * 480 + x0 + x];
    });
    writePNG(`${outDir}/cg-${gs[0]}-${gs[gs.length - 1]}.png`, w * cols, h * rows, c, scale);
  } else if (kind === 'diff') {
    const g = Number(arg);
    const a = render(g), b = flat(MD1_SCENE, md1Local(g));
    let n = 0;
    const c = new Uint32Array(480 * 270);
    for (let i = 0; i < a.length; i++) { if (a[i] !== b[i]) { n++; c[i] = 0xff00ff; } else c[i] = (a[i] >> 2) & 0x3f3f3f; }
    writePNG(`${outDir}/diff${g}.png`, 480, 270, c, scale);
    writePNG(`${outDir}/md1-f${g}.png`, 480, 270, b, scale);
    console.log(`diff ${g}: ${n} px differ`);
  }
  console.log('wrote', id);
}
