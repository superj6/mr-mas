// @ts-nocheck -- Node-only dev tool: the far side on its own over the window's sky (fix pass: deep.ts), for grading.
//   node farside.js <outDir> [p]
import {writePNG} from '../../../../shared/pixel/png';
import {deepAt, deepStarsInto, deepGrain, toByte, DEEP} from '../deep';
const [out, pS] = process.argv.slice(2);
const p = Number(pS) || 75;
const bx = DEEP.rx0, by = DEEP.ry0, bw = DEEP.rx1 - DEEP.rx0, bh = DEEP.ry1 - DEEP.ry0;
const st = new Float32Array(bw * bh * 3);
deepStarsInto(st, bx, by, bw, bh, p);
const c = new Uint32Array(bw * bh), px = new Float32Array(3);
const cl = (v) => Math.max(0, Math.min(255, Math.round(v)));
for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
  deepAt(bx + x + 0.5, by + y + 0.5, px, 0);
  const o = (y * bw + x) * 3, g = deepGrain(bx + x, by + y, p);
  c[y * bw + x] = (cl(toByte(px[0] + st[o]) + g) << 16) | (cl(toByte(px[1] + st[o + 1]) + g) << 8) | cl(toByte(px[2] + st[o + 2]) + g);
}
writePNG(`${out}/farside-p${p}.png`, bw, bh, c, 1);
