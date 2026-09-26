// @ts-nocheck -- Node-only dev tool: the brief's hard checks on the frame (fix pass).
//   node check.js [seam|glass]
import {compose, VARIANT} from '../scene';
import {drawRoom, NW} from '../plate';
import {T} from '../timing';
import {SEAM} from '../seam';
import {TEAR} from '../tear';
const v = ['tear', 'seam', 'glass'].includes(process.argv[2]) ? process.argv[2] : VARIANT;
const px = (f, x, y) => { const o = (y * 1920 + x) * 4; return (f[o] << 16) | (f[o + 1] << 8) | f[o + 2]; };
// determinism: two composes of the same frame are identical
const a = compose(80, undefined, v).rgba, b = compose(80, undefined, v).rgba;
let same = true; for (let i = 0; same && i < a.length; i++) if (a[i] !== b[i]) same = false;
// the rail band never changes across the clip
const r0 = compose(0, undefined, v).rgba.slice(1920 * 812 * 4), r1 = compose(80, undefined, v).rgba.slice(1920 * 812 * 4);
let railSame = true; for (let i = 0; railSame && i < r0.length; i++) if (r0[i] !== r1[i]) railSame = false;
// the pixel frames before and after the jump are exact 4x (every 4x4 block uniform)
const blocksOk = (p) => { const f = compose(p, undefined, v).rgba; for (let y = 0; y < 1080; y += 4) for (let x = 0; x < 1920; x += 4) { const q = px(f, x, y); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) if (px(f, x + i, y + j) !== q) return false; } return true; };
// Mas and his glass are untouched to the value on every frame of the jump (no far side, no cooling on him); and the
// nearest the opening ever comes to his figure (native px)
let masTouched = 0, nearest = 1e9, maxGap = 0;
for (let p = T.crack; p < T.back; p++) {
  const f = compose(p, undefined, v);
  maxGap = Math.max(maxGap, f.gapPx);
  const {fb, mas, glass} = drawRoom(p, [0, 0]);
  for (let y = 0; y < 203; y++) for (let x = 0; x < NW; x++) {
    const i = y * NW + x;
    if (!(mas[i] || glass[i])) continue;
    // compare the 4x block against the pixel frame's colour (the Orb's look differs, but it is not in these masks)
    if (px(f.rgba, x * 4 + 1, y * 4 + 1) !== (fb.c[i] & 0xffffff)) masTouched++;
  }
  if (p === 75) for (let y = 0; y < 203; y++) for (let x = 0; x < NW; x++) {
    const q = px(f.rgba, x * 4, y * 4), ok = [0, 1, 2, 3].every((j) => [0, 1, 2, 3].every((i) => px(f.rgba, x * 4 + i, y * 4 + j) === q));
    if (!ok) for (let yy = 0; yy < 203; yy++) for (let xx = 0; xx < NW; xx++) if (mas[yy * NW + xx]) nearest = Math.min(nearest, Math.max(Math.abs(xx - x), Math.abs(yy - y)));
  }
}
console.log(JSON.stringify({variant: v, geometry: v === 'tear' ? TEAR : v === 'seam' ? SEAM : undefined, deterministic: same, railUntouched: railSame, pixelGridBefore: blocksOk(29), pixelGridAfter: blocksOk(105), pixelGridEnd: blocksOk(119), masOrGlassPixelsTouched: masTouched, nearestNonGridPxToMasAtP75: nearest, maxGapPx: maxGap}));
