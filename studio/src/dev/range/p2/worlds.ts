// MR. MAS — Prototype 2 · THE CLIFF · the machine's worlds, in voxels (pure; no DOM). Every piece is a box in its own
// segment's frame (turned only about its vertical axis), coloured from the master palette (the shader shades whole
// rungs).
//   THE NEST    the Researcher's badge as a slab (the monitor's own art at 1 voxel per card unit, the band and type
//               raised a voxel, the photo window a real hole whose inner faces carry dim glyph marks), repeated as a
//               Droste: each badge is the last one scaled by rho about a fixed point F behind the photo windows, hung a
//               few degrees off square on its lanyard. Generations V3 .. V9; V9 reads EXCEEDS EXPECTATIONS, and its
//               photo window frames the loss plot.
//   THE PLOT    the monitor's post-state plot, the grid gaining depth: the dark field (the monitor's N1, the line's
//               glow dithered onto it, the faint grid), the grey axes, the label `loss` in the house font, and the cyan
//               line standing out of the field as a ledge. It falls fast, plateaus, rounds the lip and runs straight
//               down (a hair past vertical), through the x axis and off the chart, down the wall it is drawn on, with
//               dim glyph marks on its face. Mario's napkin (ep10's smooth curve) is pinned to the wall on the way
//               down. The room lies at the foot of the wall. No tickers, no currency, no red, no green.
import {Buf, bayer, hash, rect, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {tinyPlot} from '../../../shared/pixel/rooms/kit-b';
import {CARD, BARCODE, paintBadge, NEST_GENS, PLOT, PLOT_TICKS, lossCurveY, labelPlot} from './pixel';
import {colCode} from './extrude';

/** per-instance: b0 = (cx, cy, cz, colCode), b1 = (sx, sy, sz, flags), b2 = (yaw, 0, 0, 0) */
export interface Boxes { n: number; b0: Float32Array; b1: Float32Array; b2: Float32Array }
export class BoxBuilder {
  b0: number[] = []; b1: number[] = []; b2: number[] = [];
  box(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, col: number, flags = 0, yaw = 0) {
    this.b0.push(cx, cy, cz, colCode(col));
    this.b1.push(sx, sy, sz, flags);
    this.b2.push(yaw, 0, 0, 0);
  }
  done(): Boxes { return {n: this.b0.length / 4, b0: new Float32Array(this.b0), b1: new Float32Array(this.b1), b2: new Float32Array(this.b2)}; }
}
export const BOXFLAG = {emissive: 1, glyph: 2, card: 4, flat: 8} as const;
void BARCODE;

// ================================================================== the badge slab (card units: x right, y up, z out)
export const SLAB = {depth: 7};
const cardArt = (gen: number) => {
  const base = new Buf(CARD.w, CARD.h, TRANSPARENT), raised = new Buf(CARD.w, CARD.h, TRANSPARENT);
  paintBadge(gen, true, (u, v, w, h, c, r) => rect(u, v, w, h, (r ? raised : base).ink(c)));
  const p = CARD.photo;
  rect(p.x, p.y, p.w, p.h, base.ink(TRANSPARENT));
  rect(p.x, p.y, p.w, p.h, raised.ink(TRANSPARENT));
  return {base, raised};
};
/** glyph marks for the photo window's inner faces: tokens from the 3x5 type, never words */
const GLYPH_TOKENS = ['+', '-', '=', '/', ':', '*', '1', '0', '7', '4', '#', '(', ')', '~', '%'];
const glyphStrip = (len: number, depth: number, seed: number): Uint8Array => {
  const out = new Uint8Array(len * depth);
  for (let gx = 0, k = 0; gx + 3 <= len; gx += 5, k++) {
    if (hash(k, seed, 77) < 0.45) continue;
    const ch = GLYPH_TOKENS[Math.floor(hash(k, seed, 78) * GLYPH_TOKENS.length)];
    const off = 1 + Math.floor(hash(k, seed, 79) * Math.max(1, depth - 5));
    tinyPlot(ch, gx, off, (x, y) => { if (x >= 0 && x < len && y >= 0 && y < depth) out[y * len + x] = 1; });
  }
  return out;
};

/** one badge in card units, its top-left front corner at the origin (x 0..80, y 0..-46, z 0..-depth) */
export const badgeBoxes = (B: BoxBuilder, place: (x: number, y: number, z: number) => [number, number, number], s: number, gen: number, yaw: number) => {
  const {base, raised} = cardArt(gen);
  const D = SLAB.depth;
  const put = (u: number, v: number, z0: number, z1: number, c: number, flags = 0) => {
    const [x, y, z] = place(u + 0.5, -(v + 0.5), (z0 + z1) / 2);
    B.box(x, y, z, s, s, (z1 - z0) * s, c, flags, yaw);
  };
  const hole = (u: number, v: number) => u >= CARD.photo.x && u < CARD.photo.x + CARD.photo.w && v >= CARD.photo.y && v < CARD.photo.y + CARD.photo.h;
  for (let v = 0; v < CARD.h; v++) for (let u = 0; u < CARD.w; u++) {
    if (hole(u, v)) continue;
    const c = base.c[v * CARD.w + u];
    const r = raised.c[v * CARD.w + u];
    const edge = u === 0 || v === 0 || u === CARD.w - 1 || v === CARD.h - 1;
    const rim = hole(u - 1, v) || hole(u + 1, v) || hole(u, v - 1) || hole(u, v + 1);
    // the face (and, at the edges and the rim, the slab's depth behind it)
    if (edge || rim) put(u, v, -D, 0, c);
    else put(u, v, -1, 0, c);
    if (r !== TRANSPARENT) put(u, v, 0, 1, r);
  }
  // the photo window's inner faces: dim glyph marks on the dark, one voxel inside the rim, full depth
  const p = CARD.photo;
  const ring: Array<[number, number]> = [];
  for (let u = p.x; u < p.x + p.w; u++) ring.push([u, p.y]);
  for (let v = p.y; v < p.y + p.h; v++) ring.push([p.x + p.w - 1, v]);
  for (let u = p.x + p.w - 1; u >= p.x; u--) ring.push([u, p.y + p.h - 1]);
  for (let v = p.y + p.h - 1; v >= p.y; v--) ring.push([p.x, v]);
  const strip = glyphStrip(ring.length, D, gen);
  ring.forEach(([u, v], i) => {
    for (let d = 1; d < D; d++) {
      const lit = strip[d * ring.length + i];
      put(u, v, -d - 1, -d, lit ? PAL.C3 : PAL.N1, lit ? BOXFLAG.glyph : 0);
    }
  });
  // the clip and the lanyard: two strips of voxels rising from the slot, a narrow V, out of the top of frame
  for (let v = -5; v < 0; v++) for (let u = 37; u < 43; u++) put(u, v, -2, 0, v === -5 ? PAL.G6 : PAL.G4);
  for (let k = 0; k < 90; k++) {
    const v = -6 - k, spread = Math.round(k * 0.22);
    for (const [u0, cA, cB] of [[35 - spread, PAL.C3, PAL.C4], [42 + spread, PAL.C4, PAL.C5]] as Array<[number, number, number]>) {
      put(u0, v, -1.5, -0.5, cA);
      put(u0 + 1, v, -1.5, -0.5, cB);
      put(u0 + 2, v, -1.5, -0.5, cA);
    }
  }
};

// ================================================================== the nest (Droste) in the tunnel frame
// Unit: card units of the first badge (V3), which fills the portal (V2's photo window on his screen) exactly.
export const TUNNEL = {
  /** badges in the tunnel: V3 .. V9; the last one's photo window opens onto the plot */
  count: NEST_GENS - 2,
  rho: CARD.rho,
  /** spacing between badge 0 and badge 1, in badge-0 card units */
  gap: 70,
};
/** the similarity S(p) = F + rho (p - F), in card units of badge 0 (origin at badge 0's top-left front) */
export const nestGeometry = () => {
  const rho = TUNNEL.rho, p = CARD.photo;
  const c0: [number, number, number] = [CARD.w / 2, -CARD.h / 2, 0];
  const w0: [number, number, number] = [p.x + p.w / 2, -(p.y + p.h / 2), 0];
  // S(c0) sits centred on the photo window, `gap` behind: F solves F + rho (c0 - F) = w0 - [0, 0, gap]
  const target: [number, number, number] = [w0[0], w0[1], -TUNNEL.gap];
  const F: [number, number, number] = [0, 1, 2].map((i) => (target[i] - rho * c0[i]) / (1 - rho)) as [number, number, number];
  const origin = (k: number): [number, number, number] => [0, 1, 2].map((i) => F[i] + Math.pow(rho, k) * (0 - F[i])) as [number, number, number];
  const photoCentre = (k: number): [number, number, number] => [0, 1, 2].map((i) => F[i] + Math.pow(rho, k) * (w0[i] - F[i])) as [number, number, number];
  return {F, origin, photoCentre, scale: (k: number) => Math.pow(rho, k)};
};
/** each badge's hang: a few degrees off square on its lanyard, alternating (V3, which fills the portal, hangs square) */
export const hangOf = (k: number) => (k === 0 ? 0 : (k % 2 ? -1 : 1) * (4 + 2 * (k % 3)) * (Math.PI / 180));
/** all the nest's voxels, in card units of badge 0 */
export const nestBoxes = (): Boxes => {
  const B = new BoxBuilder();
  const G = nestGeometry();
  const p = CARD.photo, wc = p.x + p.w / 2;
  for (let k = 0; k < TUNNEL.count; k++) {
    const s = G.scale(k), o = G.origin(k);
    const a = hangOf(k), ca = Math.cos(a), sa = Math.sin(a);
    badgeBoxes(B, (x, y, z) => {
      const dx = x - wc, xr = wc + dx * ca + z * sa, zr = -dx * sa + z * ca;
      return [o[0] + xr * s, o[1] + y * s, o[2] + zr * s];
    }, s, k + 3, a);
  }
  return B.done();
};

// ================================================================== the plot world (frame S, in cells)
// S: x right, y up, z out of the wall toward the camera. 1 cell = 1/4 of a virtual-screen px, so the plot is
// 384 x 240 cells (the monitor's 96 x 60), its bottom edge at y = 0. The wall carries on below the chart.
export const PW = {
  cs: 4,
  /** the ledge: how far the line stands out of the wall */
  lw: 40,
  /** the lip's radius (outer face) */
  ro: 14,
  /** past vertical: the face recedes under the plateau by this much per cell of drop */
  overhang: 0.05,
  /** where the camera lands (the room's staging camera) and where the wall and the line end, below it */
  landY: -250, wallEnd: -262,
  /** the camera trucks along the chart facing it, this far above the line's top and this far out from the wall;
   *  in the plunge it drifts in toward the face */
  clear: 24, camZ: 115, fallZ: 72,
  /** the room at the foot: cells per metre */
  sigma: 40,
};
export const VX = (u: number) => u * PW.cs;
export const VY = (v: number) => (60 - v) * PW.cs;
/** the line's top edge (cells) at x (cells), on the plateau */
export const lineTop = (x: number) => VY(lossCurveY(x / PW.cs));
/** the outer face of the drop, and the lip's centre */
export const X_OUT = VX(PLOT.drop + PLOT.lw);
export const LIP = (() => {
  const cx = X_OUT - PW.ro, top = lineTop(cx);
  return {cx, cy: top - PW.ro, top};
})();
/** the outer face's x at height y (below the lip): it recedes a hair (past vertical) */
export const faceX = (y: number) => X_OUT - PW.overhang * Math.max(0, LIP.cy - y);

export const plotBoxes = (): Boxes => {
  const B = new BoxBuilder();
  const {lw, ro, wallEnd} = PW;
  const W = 96 * PW.cs, H = 60 * PW.cs;
  // ---- the line: plateau columns, the lip (annulus), the face; each cell stands out of the wall `lw` deep
  const cells = new Map<number, number>(); // key = (y + 2048) * 4096 + x -> colour
  const put = (x: number, y: number, c: number) => cells.set((y + 2048) * 4096 + x, c);
  const x0 = VX(PLOT.x0);
  // the plateau: one column per cell along the line, its top at the curve's exact height (no stair-steps: a smooth,
  // noiseless surface), two tones across the line measured along its normal (the monitor's C6 over C4)
  for (let x = x0; x < LIP.cx; x++) {
    const t = lineTop(x + 0.5), sl = lineTop(x + 1) - lineTop(x), k = Math.hypot(1, sl);
    const seam = (x - x0) % 10 === 0;
    B.box(x + 0.5, t - 2 * k, lw / 2, 1, 4 * k, lw, seam ? PAL.C5 : PAL.C6);
    B.box(x + 0.5, t - 6 * k, lw / 2, 1, 4 * k, lw, PAL.C4);
  }
  for (let y = Math.floor(LIP.cy); y < LIP.top + 1; y++) for (let x = Math.floor(LIP.cx); x < X_OUT + 1; x++) {
    const d = Math.hypot(x + 0.5 - LIP.cx, y + 0.5 - LIP.cy);
    if (d <= ro && d >= ro - 8) put(x, y, d >= ro - 4 ? PAL.C6 : PAL.C4);
  }
  for (let y = Math.floor(LIP.cy) - 1; y >= wallEnd; y--) {
    const xo = Math.round(faceX(y + 0.5));
    for (let x = xo - 8; x < xo; x++) put(x, y, x >= xo - 4 ? PAL.C6 : PAL.C4);
  }
  for (const [k, c] of cells) {
    const y = Math.floor(k / 4096) - 2048, x = k % 4096;
    // the ledge is built of voxel courses: a seam a rung down every 10 cells along it (its speed, and its make)
    const course = y > LIP.cy ? x : Math.floor(-y);
    if (course % 10 === 0 && c === PAL.C6) { B.box(x + 0.5, y + 0.5, lw / 2, 1, 1, lw, PAL.C5); continue; }
    B.box(x + 0.5, y + 0.5, lw / 2, 1, 1, lw, c);
  }
  // the face's glyph marks (tokens, not words): a voxel proud of the outer face, dim, where it streams past the lens
  for (let gy = Math.floor(LIP.cy) - 10, row = 0; gy - 5 > wallEnd; gy -= 8, row++) for (let gz = 4, col = 0; gz + 3 < lw - 2; gz += 6, col++) {
    if (hash(row, col, 41) < 0.45) continue;
    const ch = ['+', '-', '=', '/', ':', '*', '1', '0', '7', '4', '#', '(', ')', '~', '%'][Math.floor(hash(row, col, 42) * 15)];
    tinyPlot(ch, 0, 0, (i, j) => {
      const y = gy - j - 0.5, xo = faceX(y);
      B.box(xo + 0.5, y, gz + i + 0.5, 1, 1, 1, PAL.C5, BOXFLAG.glyph);
    });
  }
  // ---- the axes (grey, standing a little proud), the ticks, the label once
  const g = PAL.G3;
  const bar = (xa: number, ya: number, xb: number, yb: number, zd: number, c: number, fl = 0) => B.box((xa + xb) / 2, (ya + yb) / 2, zd / 2, xb - xa, yb - ya, zd, c, fl);
  bar(VX(PLOT.x0 - 1), VY(PLOT.yBase), VX(PLOT.x0), VY(6), 4, g);
  bar(VX(PLOT.x0 - 1), VY(PLOT.yBase + 1), VX(PLOT.x1 + 1), VY(PLOT.yBase), 4, g);
  for (const gx of PLOT_TICKS.x) bar(VX(gx), VY(PLOT.yBase + 2), VX(gx + 1), VY(PLOT.yBase + 1), 3, g);
  for (const gy of PLOT_TICKS.y) bar(VX(PLOT.x0 - 2), VY(gy + 1), VX(PLOT.x0 - 1), VY(gy), 3, g);
  labelPlot('loss', 0, 0, (i, j) => B.box(VX(13) + i + 0.5, VY(2.2) - j - 0.5, 3, 1, 1, 6, PAL.C5, BOXFLAG.emissive), PW.cs);
  // ---- Mario's napkin, pinned to the wall on the way down: ep10's very smooth curve, gentle from here. Pinned at
  // its top, it curls off the wall (a voxel staircase), so it faces up at the lens as we fall past it
  const NP = {x0: X_OUT + 14, x1: X_OUT + 58, y0: -130, y1: -94};
  for (let y = NP.y0; y < NP.y1; y++) for (let x = NP.x0; x < NP.x1; x++) {
    const u = (x + 0.5 - NP.x0) / (NP.x1 - NP.x0), v = (y + 0.5 - NP.y0) / (NP.y1 - NP.y0);
    const curve = 0.2 + 0.62 / (1 + Math.exp(-(u - 0.5) * 6.5));
    let c = PAL.P1;
    if (v > 0.93 || u < 0.04) c = PAL.P2;
    if (Math.abs(u - 0.5) < 0.014) c = PAL.P0; // the fold
    if (Math.abs(v - curve) < 0.04 && u > 0.08 && u < 0.93) c = PAL.I0; // his pen
    if (x === NP.x0 + Math.round((NP.x1 - NP.x0) / 2) && y === NP.y1 - 2) c = PAL.R2; // the pin
    const out = Math.round((NP.y1 - 1 - y) * 0.9); // the curl off the wall
    B.box(x + 0.5, y + 0.5, out + 0.5, 1, 1, 1, c);
  }
  // ---- the wall: the plot's dark field above y = 0, the wall it is drawn on below; the line's glow dithered onto
  // both in whole rungs; the faint grid on the field. Runs of one colour are one box (the wall is flat).
  const lineDist = (x: number, y: number) => {
    if (y > LIP.cy) { if (x < x0) return 1e9; if (x < LIP.cx) return Math.abs(y - (lineTop(x) - 4)); return Math.abs(Math.hypot(x - LIP.cx, y - LIP.cy) - (ro - 4)); }
    return Math.abs(x - (faceX(y) - 4));
  };
  for (let y = wallEnd; y < H; y++) {
    let runC = -1, runX = 0;
    const flush = (xEnd: number) => { if (runC >= 0 && xEnd > runX) B.box((runX + xEnd) / 2, y + 0.5, -1, xEnd - runX, 1, 2, runC, BOXFLAG.flat); };
    for (let x = 0; x <= W; x++) {
      let c = -1;
      if (x < W) {
        const onChart = y >= 0;
        c = onChart ? PAL.N1 : (bayer(x, y) < Math.max(0, Math.min(1, 1 + y / 60)) ? PAL.N1 : PAL.N0);
        const d = lineDist(x + 0.5, y + 0.5);
        if (d < 30 && bayer(x, y) < (1 - d / 30) * 0.85) c = stepColor(c, 1);
        if (onChart) {
          const vx = x / PW.cs, vy = 60 - (y + 0.5) / PW.cs;
          const gridX = PLOT_TICKS.x.some((gx) => Math.abs(vx - (gx + 0.5)) < 0.26) && vy > 7 && vy < PLOT.yBase && Math.floor(vy) % 2 === 1;
          const gridY = PLOT_TICKS.y.some((gy) => Math.abs(vy - (gy + 0.5)) < 0.26) && vx > PLOT.x0 + 1 && vx < PLOT.x1 && Math.floor(vx) % 2 === 1;
          if (gridX || gridY) c = PAL.N2;
          // the chart's edge (the monitor's bezel, seen from inside): a rung down
          if (x < 2 || x >= W - 2 || y >= H - 2) c = PAL.N0;
        }
      }
      if (c !== runC) { flush(x); runC = c; runX = x; }
    }
  }
  return B.done();
};
