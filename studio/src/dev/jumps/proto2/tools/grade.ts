// @ts-nocheck -- Node-only dev tool: the far side against the pixel sky it replaces (fix pass).
// The fix-pass brief lets the far side exceed the one-stop limit INSIDE THE OPENING ONLY; this measures by how much,
// over exactly the native pixels the opening shows at p75, against the same pixels at p29. Also: the cooling on the
// Orb, and on Mas (must be zero).   node grade.js [seam|glass]
import {compose, VARIANT} from '../scene';
import {DPLATE} from '../../../../shared/pixel/rooms/darkroom-plate';
const v = ['tear', 'seam', 'glass'].includes(process.argv[2]) ? process.argv[2] : VARIANT;
const lin = (x) => Math.pow(x / 255, 2.2);
const lum = (f, o) => 0.2126 * lin(f[o]) + 0.7152 * lin(f[o + 1]) + 0.0722 * lin(f[o + 2]);
const f0 = compose(29, undefined, v).rgba, f1 = compose(75, undefined, v).rgba;
const {gap} = compose(75, undefined, v);
let s0 = 0, s1 = 0, n = 0, peak = 0;
for (let y = 0; y < 812; y++) for (let x = 0; x < 1920; x++) {
  if (!gap[(y >> 2) * 480 + (x >> 2)]) continue;
  const o = (y * 1920 + x) * 4;
  s0 += lum(f0, o); s1 += lum(f1, o); n++; peak = Math.max(peak, lum(f1, o));
}
// the Orb's disc: mean colour change p29 -> p75
const [ox, oy] = DPLATE.orb; let dr = 0, db = 0, m = 0;
for (let y = (oy - 8) * 4; y < (oy + 8) * 4; y++) for (let x = (ox - 8) * 4; x < (ox + 8) * 4; x++) { const o = (y * 1920 + x) * 4; dr += f1[o] - f0[o]; db += f1[o + 2] - f0[o + 2]; m++; }
console.log(JSON.stringify({variant: v, openingPx1080: n, pixelSkyThere: (s0 / n).toFixed(5), farSideThere: (s1 / n).toFixed(5), stops: Math.log2(s1 / s0).toFixed(2), peakLum: peak.toFixed(3), orbCooling: {red: (dr / m).toFixed(1), blue: (db / m).toFixed(1)}}));
