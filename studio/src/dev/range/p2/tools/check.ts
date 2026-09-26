// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Prototype 2 · checks on the pixel side: (1) the staged composite equals the reference composite on every frame of
// the pixel stretches, (2) every colour is a master-palette colour, (3) the layer extents the depth model needs.
//   node check.js <outDir>   (writes a few previews)
import {writePNG} from './png';
import {roomLayers, referenceFrame, pixelFrame, portalRect} from '../pixel';
import {PAL_INDEX} from '../../../../shared/pixel/palette';
import {TRANSPARENT} from '../../../../shared/pixel/px';
import {NW, NH} from '../params';

const out = process.argv[2] ?? '.';
let bad = 0;
for (const p of [0, 14, 30, 59]) {
  const L = roomLayers(p, 'nest'), R = referenceFrame(p, 'nest');
  let d = 0;
  for (let i = 0; i < NW * NH; i++) if (L.frame.c[i] !== R.c[i]) d++;
  console.log(`p${p} nest: staged vs reference differ on ${d} px`);
  bad += d;
}
for (const p of [315, 330, 345, 359]) {
  const L = roomLayers(p, 'plot'), R = referenceFrame(p, 'plot');
  let d = 0;
  for (let i = 0; i < NW * NH; i++) if (L.frame.c[i] !== R.c[i]) d++;
  console.log(`p${p} plot: staged vs reference differ on ${d} px`);
  bad += d;
}
const L = roomLayers(59, 'nest');
const stray = new Set<number>();
for (const b of [L.frame, L.plate, L.desk, L.orb, L.mas, L.glass]) for (const c of b.c) if (c !== TRANSPARENT && !PAL_INDEX.has(c)) stray.add(c);
console.log('stray colours:', [...stray].map((c) => c.toString(16)));
const ext = (b) => {
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, n = 0;
  for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) if (b.c[y * NW + x] !== TRANSPARENT) { n++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return {x0, x1, y0, y1, n};
};
console.log('mas', ext(L.mas), 'orb', ext(L.orb), 'glass', ext(L.glass));
let ov = 0;
for (let i = 0; i < NW * NH; i++) if (L.mas.c[i] !== TRANSPARENT && L.glass.c[i] !== TRANSPARENT) ov++;
console.log('mas over glass px:', ov);
// Mas's lowest pixel per column band (the card must stand in front of the desk everywhere)
let maxRow = 0;
for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) if (L.mas.c[y * NW + x] !== TRANSPARENT) maxRow = Math.max(maxRow, y);
console.log('mas lowest row', maxRow, 'portal (virtual screen)', portalRect());
writePNG(`${out}/chk-p059.png`, NW, NH, pixelFrame(59).c, 2);
writePNG(`${out}/chk-p030.png`, NW, NH, pixelFrame(30).c, 2);
writePNG(`${out}/chk-p350.png`, NW, NH, pixelFrame(350).c, 2);
writePNG(`${out}/chk-p047.png`, NW, NH, pixelFrame(47).c, 2);
console.log(bad ? `FAIL: ${bad} px differ` : 'OK: staged == reference');
