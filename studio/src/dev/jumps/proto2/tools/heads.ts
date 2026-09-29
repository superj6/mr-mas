// @ts-nocheck -- Node-only dev tool: Mas's reaction drawing options in context (p80), side by side.
import {writePNG} from '../../../../shared/pixel/png';
import * as PL from '../plate';
import {compose} from '../scene';
const out = process.argv[2];
const opts = [
  {head: 'front', look: 1, brow: 0}, {head: 'front', look: 1, brow: 1}, {head: '34', look: 1, brow: 0}, {head: 'front', look: 0, brow: 0},
];
const W = 520, H = 330, X0 = 380, Y0 = 60;
const c = new Uint32Array(W * 2 * H * 2);
opts.forEach((o, k) => {
  Object.assign(PL.REACT, o);
  const {rgba} = compose(80);
  const ox = (k % 2) * W, oy = Math.floor(k / 2) * H;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const q = ((Y0 + y) * 1920 + X0 + x) * 4; c[(oy + y) * W * 2 + ox + x] = (rgba[q] << 16) | (rgba[q + 1] << 8) | rgba[q + 2]; }
});
writePNG(`${out}/heads.png`, W * 2, H * 2, c, 1);
