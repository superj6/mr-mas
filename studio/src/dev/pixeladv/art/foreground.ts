// MR. MAS — pixeladv: foreground layer. A monstera silhouette in the bottom-left corner gives the
// wide shot a near plane (depth without a camera move); it catches a thin rim from the monitor.
import {Buf} from '../core/px';
import {PAL} from '../core/palette';
import {FigureDef, Img, LightRig, P, Part, Prim, blitImg, renderFigure} from '../core/figure';

const leaf = (cx: number, cy: number, len: number, wid: number, ang: number, splits: number): Prim[] => {
  // pointed leaf blade as a polygon, rotated; monstera splits are cut as thin wedges later
  const pts: number[] = [];
  const n = 14;
  const ca = Math.cos(ang), sa = Math.sin(ang);
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const w = Math.sin(Math.PI * t) * wid * (1 - 0.25 * t);
    pts.push(cx + (t * len) * ca - w * sa, cy + (t * len) * sa + w * ca);
  }
  for (let k = n; k >= 0; k--) {
    const t = k / n;
    const w = Math.sin(Math.PI * t) * wid * (1 - 0.25 * t);
    pts.push(cx + (t * len) * ca + w * sa, cy + (t * len) * sa - w * ca);
  }
  const out: Prim[] = [P.poly(...pts)];
  void splits;
  return out;
};
const cut = (cx: number, cy: number, len: number, ang: number, t: number, side: 1 | -1, depth: number): Prim => {
  const ca = Math.cos(ang), sa = Math.sin(ang);
  const bx = cx + t * len * ca, by = cy + t * len * sa;
  const nx = -sa * side, ny = ca * side;
  const tx = bx + nx * depth + ca * 3, ty = by + ny * depth + sa * 3;
  return P.poly(bx - ca * 0.6, by - sa * 0.6, tx, ty, tx + ca * 1.4, ty + sa * 1.4, bx + ca * 0.8, by + sa * 0.8);
};

const plantFig = (q: number): FigureDef => {
  const L: Array<[number, number, number, number, number]> = [
    // cx, cy, len, wid, angle
    [22, 150, 34, 11, -1.95],
    [20, 158, 40, 12, -0.55],
    [16, 162, 36, 10, -2.6],
    [24, 166, 30, 9, 0.1],
    [10, 150, 28, 8, -1.3],
  ];
  const parts: Part[] = [];
  L.forEach(([cx, cy, len, wid, a], i) => {
    const dq = i % 2 === 0 ? q : -q;
    parts.push({group: 'plant', mat: 'plant', prims: [P.line(18, 196, Math.round(cx), Math.round(cy))]});
    parts.push({group: 'plant', mat: 'plant', prims: leaf(cx, cy + dq, len, wid, a, 0)});
    for (const t of [0.35, 0.55, 0.75]) {
      parts.push({group: 'plant', mat: 'plant', erase: true, prims: [cut(cx, cy + dq, len, a, t, 1, wid * 0.8), cut(cx, cy + dq, len, a, t + 0.08, -1, wid * 0.7)]});
    }
  });
  parts.push({group: 'pot', mat: 'pot', prims: [P.poly(4, 186, 34, 186, 31, 203, 7, 203)]});
  parts.push({group: 'pot', mat: 'pot', prims: [P.rect(3, 184, 33, 3)]});
  return {w: 70, h: 203, parts};
};

const RIG: LightRig = {
  key: [0.9, -0.45], keyBand: 1, shadowBand: 0, rim: true,
  keyGain: (x, y) => (y < 150 && x > 20 ? 1 : 0.2),
  ramps: {
    plant: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.C2],
    pot: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.C1],
  },
};

const cache = new Map<number, Img>();
export const drawForeground = (b: Buf, jolt: number) => {
  const q = jolt >= 0 && jolt < 4 ? [1, -1, 1, 0][jolt] : 0;
  let img = cache.get(q);
  if (!img) { img = renderFigure(plantFig(q), RIG); cache.set(q, img); }
  blitImg(b, img, 0, 0);
};
