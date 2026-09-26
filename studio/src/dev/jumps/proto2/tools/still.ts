// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// Fast Node stills of prototype 2, pixel-identical to the Remotion composition (same compose()).
//   npx esbuild src/dev/jumps/proto2/tools/still.ts --bundle --platform=node --outfile=<scratch>/still.js
//   node <scratch>/still.js <outDir> <p,p,...> [seam|glass] [crop x,y,w,h] [scale]
import {writePNG} from '../../../pixeladv/tools/png';
import {compose, OUT_W, OUT_H, VARIANT} from '../scene';

const [outDir, list, variantS, cropS, scaleS] = process.argv.slice(2);
const variant = ['tear', 'seam', 'glass'].includes(variantS) ? variantS : VARIANT;
const frames = list.split(',').map(Number);
const crop = cropS && cropS !== '-' ? cropS.split(',').map(Number) : null;
const sc = Number(scaleS) || 1;
for (const p of frames) {
  const t0 = Date.now();
  const {rgba, gapPx} = compose(p, undefined, variant);
  const t1 = Date.now();
  const [cx, cy, cw, ch] = crop ?? [0, 0, OUT_W, OUT_H];
  const c = new Uint32Array(cw * ch);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const o = ((cy + y) * OUT_W + cx + x) * 4; c[y * cw + x] = (rgba[o] << 16) | (rgba[o + 1] << 8) | rgba[o + 2]; }
  const name = `${outDir}/${variant}-p${String(p).padStart(3, '0')}${crop ? '-crop' : ''}.png`;
  writePNG(name, cw, ch, c, sc);
  console.log(name, `compose ${t1 - t0}ms`, `gap ${gapPx}px`);
}
