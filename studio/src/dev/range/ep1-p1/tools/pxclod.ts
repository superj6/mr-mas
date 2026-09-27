// @ts-nocheck -- Node-only dev tool (bundled with esbuild), excluded from the browser typecheck.
// E1-P1: the pixel side of the clay, built from the clay's own renders (so the two can't disagree).
//   1. the pixel CLOD of phrase 1 = the first key ('up') rendered unlit ('night') and as part codes ('id'), put on
//      the 480 x 270 grid (a 4 x 4 block per pixel: coverage >= 50 % is a pixel; the part is the block's majority;
//      the shade is the night render's lightness, cut into each part's four night rungs), with the show's figure
//      edges (the darkest rung on the shadow side, a warm rim where the desk lamp catches it). Two drawings: the wheel
//      at 0 and at a half turn.
//   2. per lit pose, the clay's shadow on the plinth, the desk front and the floor as whole rungs: the key's shadow
//      (removes the pool's rungs where it falls) and the dome's occlusion (one rung of contact darkness).
//   npx esbuild src/dev/range/ep1-p1/tools/pxclod.ts --bundle --platform=node --outfile=<scratch>/pxclod.cjs
//   node <scratch>/pxclod.cjs <cels dir (cel-NNN.png)> <out gen/clod-px.json>
import * as fs from 'fs';
import * as zlib from 'zlib';
import {CELS, TILE, celKey} from '../gl/cels';
import {PAL} from '../../../../shared/pixel/palette';

const readPNG = (path: string) => {
  const b = fs.readFileSync(path);
  let o = 8, w = 0, h = 0, ct = 0, bd = 0;
  const idat: Buffer[] = [];
  while (o < b.length) {
    const len = b.readUInt32BE(o), type = b.toString('ascii', o + 4, o + 8);
    const data = b.subarray(o + 8, o + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bd = data[8]; ct = data[9]; }
    if (type === 'IDAT') idat.push(data);
    o += 12 + len;
  }
  if (bd !== 8 || (ct !== 2 && ct !== 6)) throw new Error(`${path}: unsupported PNG (bit depth ${bd}, colour type ${ct})`);
  const bpp = ct === 6 ? 4 : 3, stride = w * bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = new Uint8Array(w * h * 4);
  const prev = new Uint8Array(stride), cur = new Uint8Array(stride);
  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x++) {
      const v = raw[y * (stride + 1) + 1 + x], a = x >= bpp ? cur[x - bpp] : 0, up = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      let r = v;
      if (ft === 1) r = v + a; else if (ft === 2) r = v + up; else if (ft === 3) r = v + ((a + up) >> 1);
      else if (ft === 4) { const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c); r = v + (pa <= pb && pa <= pc ? a : pb <= pc ? up : c); }
      cur[x] = r & 255;
    }
    for (let x = 0; x < w; x++) { out[(y * w + x) * 4] = cur[x * bpp]; out[(y * w + x) * 4 + 1] = cur[x * bpp + 1]; out[(y * w + x) * 4 + 2] = cur[x * bpp + 2]; out[(y * w + x) * 4 + 3] = bpp === 4 ? cur[x * bpp + 3] : 255; }
    prev.set(cur);
  }
  return {w, h, px: out};
};

const [dir, outPath] = process.argv.slice(2);
const cel = (i: number) => readPNG(`${dir}/cel-${String(i).padStart(3, '0')}.png`);
const idx = (c) => CELS.findIndex((q) => celKey(q) === celKey(c));
const NW = TILE.w / 4, NH = TILE.h / 4, X0 = TILE.x / 4, Y0 = TILE.y / 4;

// ------------------------------------------------------------------ 1. the pixel CLOD
const RAMPS: Record<number, number[]> = {
  // terracotta in the night rungs (the lighthouse's brick in shadow). Round 5: one rung more range at the top (it
  // read as a murky brown blob, "a gingerbread man or a bear", before the launch)
  1: [PAL.W1, PAL.W2, PAL.W3, PAL.W4],
  2: [PAL.N0, PAL.N0, PAL.N1, PAL.N2], // the dark clay: bow tie, eyes, smile (they must read as marks)
  3: [PAL.D0, PAL.D1, PAL.D2, PAL.D3], // the clipboard
  4: [PAL.N2, PAL.N3, PAL.N4, PAL.N5], // its page, unlit
  5: [PAL.N0, PAL.D0, PAL.D1, PAL.D2], // the niche and the wheel
};
const RIM = PAL.W4;
const pal: number[] = [];
const pi = (c: number) => { let k = pal.indexOf(c); if (k < 0) { pal.push(c); k = pal.length - 1; } return k; };
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const pixelClod = (nightI: number, idI: number) => {
  const N = cel(nightI), I = cel(idI), W = N.w;
  const cov = new Float32Array(NW * NH), part = new Uint8Array(NW * NH), L = new Float32Array(NW * NH);
  for (let j = 0; j < NH; j++) for (let i = 0; i < NW; i++) {
    let a = 0, lsum = 0, votes = [0, 0, 0, 0, 0, 0];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const X = i * 4 + x, Y = j * 4 + y;
      const al = N.px[(Y * W + TILE.w + X) * 4] / 255;
      a += al / 16;
      if (al < 0.5) continue;
      const k = (Y * W + X) * 4;
      lsum += lum(N.px[k], N.px[k + 1], N.px[k + 2]) / al;
      const code = Math.round(I.px[(Y * I.w + X) * 4] / 40);
      if (code >= 1 && code <= 5) votes[code] += 1;
    }
    const n = votes.reduce((s, v) => s + v, 0);
    cov[j * NW + i] = a;
    if (a >= 0.5 && n) { part[j * NW + i] = votes.indexOf(Math.max(...votes)); L[j * NW + i] = lsum / n; }
  }
  // the shade smoothed within each part (3 x 3), so the rungs fall in bands the way a pixel artist lays them in
  const Ls = new Float32Array(L.length);
  for (let j = 0; j < NH; j++) for (let i = 0; i < NW; i++) {
    const k = j * NW + i; if (!part[k]) continue;
    let s2 = 0, n2 = 0;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= NW || jj >= NH) continue; const q = jj * NW + ii; if (part[q] === part[k]) { s2 += L[q]; n2++; } }
    Ls[k] = s2 / n2;
  }
  L.set(Ls);
  // each part's shade cut into four rungs at its own quartiles (a painter's value study, not a threshold on light)
  const cuts: Record<number, number[]> = {};
  for (const p of [1, 2, 3, 4, 5]) {
    const vs = [...L.keys()].filter((k) => part[k] === p).map((k) => L[k]).sort((a, b) => a - b);
    const q = (t: number) => vs.length ? vs[Math.min(vs.length - 1, Math.floor(t * vs.length))] : 0;
    cuts[p] = p === 1 ? [q(0.0), q(0.5), q(0.85)] : [q(0.3), q(0.65), q(0.9)];
  }
  const rows: string[] = [];
  let minX = NW, minY = NH, maxX = 0, maxY = 0;
  const cols = new Int32Array(NW * NH).fill(-1);
  for (let j = 0; j < NH; j++) for (let i = 0; i < NW; i++) {
    const k = j * NW + i, p = part[k];
    if (!p) continue;
    const c = cuts[p];
    const lvl = L[k] < c[0] ? 0 : L[k] < c[1] ? 1 : L[k] < c[2] ? 2 : 3;
    cols[k] = RAMPS[p][lvl];
    minX = Math.min(minX, i); maxX = Math.max(maxX, i); minY = Math.min(minY, j); maxY = Math.max(maxY, j);
  }
  // the figure's edges: a rim on the lamp side (right, upper two thirds), the darkest rung on the shadow side
  const out = cols.slice();
  const op = (i: number, j: number) => i >= 0 && j >= 0 && i < NW && j < NH && cols[j * NW + i] >= 0;
  for (let j = 0; j < NH; j++) for (let i = 0; i < NW; i++) {
    const k = j * NW + i;
    if (cols[k] < 0) continue;
    const right = !op(i + 1, j), left = !op(i - 1, j), down = !op(i, j + 1), upE = !op(i, j - 1);
    const upper = j < minY + (maxY - minY) * 0.66;
    if (right && upper && part[k] === 1) out[k] = RIM;
    else if (left || down || upE || right) out[k] = PAL.N0; // the figure's keyline: it stands clear of the brick
  }
  // round 5: the SAFETY lamp overhead catches the top of the head and shoulders (one rung, the row under the
  // keyline), and each eye bead holds one warm glint from the desk lamp: a puppet waiting in the dark, not a lump
  const headBot = minY + (maxY - minY) * 0.3;
  for (let j = minY; j < minY + (maxY - minY) * 0.45; j++) for (let i = minX; i <= maxX; i++) {
    const k = j * NW + i;
    if (cols[k] < 0 || part[k] !== 1 || out[k] === PAL.N0 || out[k] === RIM) continue;
    if (out[(j - 1) * NW + i] === PAL.N0 && part[(j - 1) * NW + i] !== 2 && !op(i, j - 2)) out[k] = PAL.W4;
  }
  const seen = new Uint8Array(NW * NH);
  for (let j = minY; j < headBot; j++) for (let i = minX; i <= maxX; i++) {
    const k0 = j * NW + i;
    if (part[k0] !== 2 || seen[k0] || cols[k0] < 0) continue;
    const comp: number[] = [], st = [k0]; seen[k0] = 1;
    while (st.length) { const k = st.pop()!; comp.push(k); const x = k % NW, y = (k / NW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const q = (y + dy) * NW + x + dx; if (x + dx < 0 || x + dx >= NW || y + dy < 0 || y + dy >= NH || seen[q] || part[q] !== 2) continue; seen[q] = 1; st.push(q); } }
    if (comp.length > 8) continue; // the bow tie and the smile are bigger (or below): only the beads get a glint
    const g = comp.reduce((a, b) => ((b % NW) - ((b / NW) | 0) * 0.5 > (a % NW) - ((a / NW) | 0) * 0.5 ? b : a));
    out[g] = PAL.W5;
  }
  return {out, minX, minY, maxX, maxY};
};
const nights = CELS.map((c, i) => [c, i]).filter(([c]) => c.mode === 'night');
const ids = CELS.map((c, i) => [c, i]).filter(([c]) => c.mode === 'id');
const drawings = nights.map(([c, i]) => pixelClod(i, ids.find(([d]) => d.wheel === c.wheel)[1]));
const bx0 = Math.min(...drawings.map((d) => d.minX)), by0 = Math.min(...drawings.map((d) => d.minY));
const bx1 = Math.max(...drawings.map((d) => d.maxX)), by1 = Math.max(...drawings.map((d) => d.maxY));
const w = bx1 - bx0 + 1, h = by1 - by0 + 1;
const frames = drawings.map((d) => {
  const rows: string[] = [];
  for (let j = by0; j <= by1; j++) { let r = ''; for (let i = bx0; i <= bx1; i++) { const c = d.out[j * NW + i]; r += c < 0 ? '.' : pi(c).toString(36); } rows.push(r); }
  return rows;
});

// ------------------------------------------------------------------ 2. the shadows, per lit pose
const shadow: Record<string, {x: number; y: number; w: number; h: number; k: string}> = {};
const cover: Record<string, string> = {};
for (const pose of [...new Set(CELS.filter((c) => c.mode === 'lit').map((c) => c.pose))]) {
  const i = CELS.findIndex((c) => c.mode === 'lit' && c.pose === pose);
  const S = cel(i);
  let s = '';
  for (let j = 0; j < NH; j++) for (let i2 = 0; i2 < NW; i2++) {
    let R = 0, G = 0;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { const k = ((j * 4 + y) * S.w + TILE.w * 2 + i2 * 4 + x) * 4; R += S.px[k] / 255 / 16; G += S.px[k + 1] / 255 / 16; }
    // digit = key-shadow rungs (0..2, taken off the light there) * 2 + contact occlusion (0/1)
    let kk = R > 0.72 ? 2 : R > 0.38 ? 1 : 0;
    let ao = G > 0.42 ? 1 : 0;
    // the plinth is drawn in pixel (pixel.ts shades its side as a cylinder), and at this camera's 9 degrees its top
    // is a 7-row sliver the catcher pass can't resolve (it reads the whole disc as shadowed). So on the plinth the
    // shadow is laid in by rule, the way a pixel artist would: its side takes none (the shading does it); on its top
    // the clay's shadow falls behind and right of the feet (the can is up, left and in front), and one rung of
    // contact darkness sits under the feet, found from the clay's own coverage (the row(s) under a covered pixel).
    const fx = X0 + i2, fy = Y0 + j, pcx = 320, ptop = 176;
    const u = (fx + 0.5 - pcx) / 20.5, v = (fy + 0.5 - ptop - 0.5) / 3.5;
    const onTop = u * u + v * v <= 1, onSide = !onTop && Math.abs(u) <= 1 && fy > ptop && fy <= ptop + 17 + 4;
    if (onSide) { kk = 0; ao = 0; }
    if (onTop) {
      kk = u > 0.3 ? 2 : u > 0.12 ? 1 : 0;
      const covered = (jj: number) => { if (jj < 0) return false; let a = 0; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) a += S.px[((jj * 4 + y) * S.w + TILE.w + i2 * 4 + x) * 4] / 255 / 16; return a > 0.3; };
      ao = covered(j - 1) || covered(j - 2) ? 1 : 0;
    }
    s += String(kk * 2 + ao);
  }
  shadow[pose] = {x: X0, y: Y0, w: NW, h: NH, k: s};
  // round 5: the clay's coverage on the grid (>= 50 % of the 4 x 4 block), hex-packed 4 cells a digit: pixel.ts
  // projects it from the can's lens onto the back wall, so the head throws its shadow into the wall's hot spot
  let bits = '';
  for (let q = 0; q < NW * NH; q += 4) {
    let v = 0;
    for (let b = 0; b < 4; b++) {
      const qq = q + b; if (qq >= NW * NH) continue;
      const i2 = qq % NW, j = (qq / NW) | 0;
      let a = 0; for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) a += S.px[((j * 4 + y) * S.w + TILE.w + i2 * 4 + x) * 4] / 255 / 16;
      if (a >= 0.5) v |= 1 << b;
    }
    bits += v.toString(16);
  }
  cover[pose] = bits;
}
fs.writeFileSync(outPath, JSON.stringify({x: X0 + bx0, y: Y0 + by0, w, h, frames, pal, shadow, cover: {x: X0, y: Y0, w: NW, h: NH, keys: cover}}));
console.log(`pixel CLOD ${w} x ${h} at (${X0 + bx0}, ${Y0 + by0}), ${frames.length} drawings, ${pal.length} colours; shadows for ${Object.keys(shadow).join(', ')}`);
