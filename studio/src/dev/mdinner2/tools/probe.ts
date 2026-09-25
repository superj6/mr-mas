// @ts-nocheck -- Node-only dev tool: print master-palette names + OKLab L along a column of a (pre-switch) frame.
import {Buf, W, H, PAL, PAL_NAMES, lightness} from '../../../shared/pixel';
import {runFrame} from '../scene';
const [g, x, y0, y1] = process.argv.slice(2).map(Number);
const fb = new Buf(W, H, PAL.N0);
runFrame(fb, g);
const name = new Map(PAL_NAMES.map((n) => [PAL[n], n]));
const out = [];
for (let y = y0; y <= y1; y++) { const c = fb.c[y * W + x]; out.push(`${y}:${name.get(c) ?? c.toString(16)}(${lightness(c).toFixed(2)})`); }
console.log(out.join(' '));
