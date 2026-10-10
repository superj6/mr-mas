// MR. MAS — Ep2 v1 · act4: THE BACK OF A HEAD, at any size: a COPY of act3/sets/backhead.ts (itself Act Two's, from its
// review pass, 2026-10-09; copied so the acts never share a cache key), used for 18.06's over-the-shoulder onto Terb. A copy of Ep1's approved
// turned-away bust (shared/pixel/cast/mas-turnaway.ts masTurnedAway, read-only: copied, never edited) as a figure that
// renders at any scale in the frame's own pixels (its polygons scaled, then rasterised: no doubled pixels), with:
//   - the hair redrawn as CLUMPS SWEEPING FORWARD (from the nape and the crown's back toward the face), not strands
//     radiating from one point (the review: "a ball with radial spokes");
//   - a turn in three held drawings (0 square away: both ears a hint, no cheek · 1 the cheek's edge and the near ear
//     coming round · 2 the lost profile, Ep1's own drawing), so a head can come round in steps;
//   - other people: the hair's colour and length, the skin's ramp, the top's colour (nobody named, nobody real).
// Light: 'monitor' (his dark room's cyan, Ep1's rig), 'house' (an audience from behind in the house light, the stage's
// light rimming their outlines from beyond them).
//   backHeadImg(st)    the bust (112 x 136 at scale 1) as an image; st.flip turns it to face screen-right
//   drawBackHead(b, x, y, st)   placed by its top-left
import {PAL} from '../../../../../shared/pixel/palette';
import {P, renderFigure} from '../../../../../shared/pixel/figure';
import type {FigureDef, Img, LightRig, Part, Adjust} from '../../../../../shared/pixel/figure';
import {Buf} from '../../../../../shared/pixel/px';

export interface BackHeadSt {
  scale: number;
  turn: 0 | 1 | 2;
  light: 'monitor' | 'house';
  /** hair: 'mas' (short, the cowlick), 'short', 'long' (to the shoulders), 'bun' */
  hair?: 'mas' | 'short' | 'long' | 'bun';
  /** colour ramps (six tones each, outline..rim); omitted = Mas's own */
  hairRamp?: number[]; skinRamp?: number[]; topRamp?: number[];
  /** the house light's level: 0 dark (the show on), 1 a step up */
  level?: 0 | 1;
  flip?: boolean;
  /** the walk's bob (a whole pixel) */
  bob?: number;
}

/** a tapered ribbon along a quadratic curve (a hair clump's gap or its lit edge), as one polygon */
const ribbon = (x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w: number) => {
  const N = 8, L: number[] = [], R: number[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = (1 - t) * (1 - t), b2 = 2 * (1 - t) * t, c = t * t;
    const x = a * x0 + b2 * cx + c * x1, y = a * y0 + b2 * cy + c * y1;
    const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
    const l = Math.hypot(dx, dy) || 1, hw = (w / 2) * Math.sin(Math.PI * (0.15 + 0.7 * t)) + 0.35;
    L.push(x - (dy / l) * hw, y + (dx / l) * hw); R.unshift(x + (dy / l) * hw, y - (dx / l) * hw);
  }
  const pts = [...L]; for (let i = 0; i < R.length; i += 2) pts.push(R[i], R[i + 1]);
  return pts;
};

const fig = (st: BackHeadSt): FigureDef => {
  const k = st.scale, b = st.bob ?? 0;
  const S = (pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? (v + b) * k : v * k)));
  const Y = (...pts: number[]) => S(pts);
  const E = (cx: number, cy: number, rx: number, ry: number) => P.ell(cx * k, (cy + b) * k, rx * k, ry * k);
  const turn = st.turn, hair = st.hair ?? 'mas';
  const parts: Part[] = [
    // the top from behind (Ep1's hoodie shape: the near shoulder lower and forward, the far one squarer)
    {group: 'torso', mat: 'hood', tone: 2, prims: [Y(2, 144, 4, 118, 12, 106, 28, 99, 46, 96, 70, 96, 88, 100, 100, 110, 108, 144)]},
    {group: 'neck', mat: 'neck', tone: 1, prims: [Y(50, 72, 50, 96, 66, 96, 72, 72)]},
  ];
  // the hood bunched on his back (Mas's hoodie); anyone else wears a plain collar
  if (hair === 'mas') parts.push({group: 'hood', mat: 'hood', tone: 1, prims: [Y(34, 104, 40, 94, 52, 90, 66, 90, 78, 93, 86, 102, 82, 116, 68, 122, 50, 120, 38, 114)]});
  else parts.push({group: 'hood', mat: 'hood', tone: 1, prims: [Y(44, 98, 50, 93, 66, 93, 76, 96, 72, 100, 60, 99, 48, 101)]});
  // the head: the cranium, and the cheek's edge on the left as it turns (none square away)
  const head = [E(62, 47, 24, 26)];
  if (turn === 2) head.push(Y(38, 50, 36, 58, 37, 66, 40, 74, 45, 80, 50, 82, 50, 60, 44, 46));
  if (turn === 1) head.push(Y(40, 52, 39, 60, 40, 68, 43, 75, 48, 80, 50, 80, 50, 60, 45, 48));
  parts.push({group: 'head', mat: 'skin', tone: 2, prims: head});
  // the hair: Ep1's shape (short sides and nape, a little length on top); the cowlick for Mas; long hair to the
  // shoulders; a bun
  const crown = Y(42, 44, 40, 34, 44, 24, 52, 17, 62, 14, 74, 16, 82, 23, 86, 32, 87, 46, 85, 58, 81, 68, 74, 74, 64, 76, 54, 74, 48, 66, 46, 56);
  const hp = [crown];
  if (turn === 0) hp[0] = Y(39, 44, 38, 34, 43, 23, 52, 16, 62, 14, 74, 16, 82, 23, 86, 32, 87, 46, 85, 58, 81, 68, 74, 74, 64, 76, 52, 74, 44, 66, 40, 56);
  if (hair === 'mas') hp.push(Y(47, 22, 45, 17, 41, 13, 37, 13, 39, 16, 42, 19, 44, 24));
  if (hair === 'long') hp.push(Y(40, 40, 38, 60, 38, 84, 44, 98, 62, 100, 80, 98, 88, 86, 88, 60, 86, 40));
  if (hair === 'bun') hp.push(E(66, 18, 10, 8));
  parts.push({group: 'hair', mat: 'hair', tone: 2, prims: hp});
  // the ears: the far (right) one always, near its back edge; the near (left) one a hint square away, then by the
  // cheek's back as the head comes round (hidden by long hair)
  if (hair !== 'long') {
    parts.push({group: 'ear', mat: 'skinD', tone: 2, prims: [Y(82, 46, 86, 44, 89, 48, 89, 56, 86, 62, 82, 62, 81, 54)]});
    if (turn === 0) parts.push({group: 'earL', mat: 'skinD', tone: 2, prims: [Y(41, 46, 37, 44, 35, 48, 35, 56, 38, 62, 41, 62, 42, 54)]});
    if (turn === 1) parts.push({group: 'earL', mat: 'skinD', tone: 2, prims: [Y(46, 47, 43, 46, 41, 50, 41, 57, 43, 62, 46, 62, 47, 55)]});
  }
  const adjust: Adjust[] = [];
  const plane = (onlyMat: string, tone: number, ...prims: ReturnType<typeof P.poly>[]): Adjust => ({prims, tone, onlyMat});
  // the hair in CLUMPS sweeping forward: the gaps between them (tone 1) run from the back of the head up and toward
  // the face (screen-left), the clumps' lit upper edges (tone 3) beside them; the nape's short hair a rung darker
  const gaps = [
    ribbon(81, 66, 85, 40, 64, 19, 1.6), ribbon(73, 72, 75, 46, 54, 22, 1.6), ribbon(63, 74, 61, 50, 46, 32, 1.5),
    ribbon(86, 50, 86, 28, 72, 16, 1.3), ribbon(54, 70, 49, 56, 43, 42, 1.3),
  ];
  const lits = [ribbon(78, 64, 81, 40, 60, 20, 1.3), ribbon(69, 70, 70, 48, 50, 25, 1.3), ribbon(59, 72, 56, 52, 44, 36, 1.2)];
  adjust.push(plane('hair', 1, ...gaps.map((g) => S(g))));
  adjust.push(plane('hair', 3, ...lits.map((g) => S(g))));
  if (hair === 'mas') adjust.push(plane('hair', 3, Y(38, 13, 42, 13, 44, 18, 41, 16)), plane('hair', 4, Y(39, 13, 41, 13, 40, 14)));
  adjust.push(plane('hair', 0, Y(52, 70, 60, 74, 72, 73, 80, 67, 76, 72, 64, 77, 54, 75)));
  // the cheek's lit edge and the jaw going away (the turn), the nape's shadow, the ears' bowls
  if (turn === 2) adjust.push(plane('skin', 3, Y(38, 52, 40, 51, 40, 66, 42, 74, 39, 70, 37, 62)), plane('skin', 1, Y(44, 62, 48, 60, 50, 66, 50, 80, 46, 78)));
  if (turn === 1) adjust.push(plane('skin', 3, Y(40, 54, 42, 53, 42, 66, 44, 73, 41, 69, 40, 62)));
  adjust.push(plane('neck', 0, Y(50, 72, 70, 74, 68, 80, 52, 80)), plane('neck', 2, Y(50, 84, 53, 84, 53, 96, 50, 96)));
  if (hair !== 'long') adjust.push(plane('skinD', 1, Y(84, 48, 87, 48, 87, 56, 85, 59)), plane('skinD', 3, Y(82, 47, 83, 46, 83, 58, 82, 57)));
  // the top: the shoulder blades' folds, the hood's lit top edge and its fold, the seam down the near shoulder
  if (hair === 'mas') adjust.push(plane('hood', 3, Y(36, 104, 42, 95, 52, 91, 46, 97, 40, 106)), plane('hood', 0, Y(42, 112, 52, 118, 66, 120, 80, 114, 78, 118, 66, 123, 50, 121)));
  adjust.push(plane('hood', 3, Y(6, 118, 12, 108, 24, 101, 16, 109, 10, 122)), plane('hood', 1, Y(58, 124, 60, 124, 62, 144, 60, 144), Y(90, 108, 96, 112, 104, 144, 98, 144)));
  return {w: Math.ceil(112 * k), h: Math.ceil(136 * k), parts, adjust};
};

const MAS_HAIR = [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K2, PAL.C6];
const rig = (st: BackHeadSt): LightRig => {
  if (st.light === 'monitor') return {
    key: [-0.9, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck'],
    back: [1, -0.1], backBand: 1,
    backRamp: {skin: PAL.X0, skinD: PAL.S0, hair: PAL.B1, hood: PAL.G1},
    ramps: {
      skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
      neck: [PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2, PAL.K3],
      skinD: [PAL.S0, PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2],
      hair: st.hairRamp ?? MAS_HAIR,
      hood: st.topRamp ?? [PAL.N1, PAL.G0, PAL.G1, PAL.C2, PAL.C3, PAL.C6],
    },
  };
  // the house: lit from beyond them (the stage), a cool rim along their outlines; the face's turned edge catching the
  // stage's light; a rung up when the house lights come up
  const up = st.level ?? 0;
  const sk = st.skinRamp ?? [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5];
  const ramp = (r: number[]) => (up ? [r[0], r[2], r[3], r[4], r[5], r[5]] : r);
  return {
    key: [-0.5, -0.9], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck'],
    back: [0.2, -1], backBand: 1,
    backRamp: {skin: sk[1], skinD: sk[0], hair: (st.hairRamp ?? MAS_HAIR)[1], hood: (st.topRamp ?? [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4])[1]},
    ramps: {
      skin: ramp(sk), neck: ramp([sk[0], sk[0], sk[1], sk[2], sk[3], sk[4]]), skinD: ramp([sk[0], sk[0], sk[1], sk[2], sk[3], sk[4]]),
      hair: ramp(st.hairRamp ?? [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.G5]),
      hood: ramp(st.topRamp ?? [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G5]),
    },
  };
};
const CACHE = new Map<string, Img>();
export const backHeadImg = (st: BackHeadSt): Img => {
  const key = JSON.stringify(st);
  const hit = CACHE.get(key); if (hit) return hit;
  let im = renderFigure(fig(st), rig(st));
  if (st.flip) { const c = new Int32Array(im.c.length); for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) c[y * im.w + x] = im.c[y * im.w + im.w - 1 - x]; im = {...im, c}; }
  CACHE.set(key, im);
  return im;
};
/** place the bust by its top-left; `map` recolours as it lands (a light, a rung down) */
export const drawBackHead = (b: Buf, x: number, y: number, st: BackHeadSt, map?: (c: number) => number) => {
  const im = backHeadImg(st);
  for (let j = 0; j < im.h; j++) for (let i = 0; i < im.w; i++) { const v = im.c[j * im.w + i]; if (v < 0) continue; b.set(x + i, y + j, map ? map(v) : v); }
  return im;
};
