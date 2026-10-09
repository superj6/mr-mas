// MR. MAS — Ep2 v1 art: a COPY of studio/src/dev/meras/mas08.ts (not edited), for F2.1's 2008 stage (manifest SET-20).
// MR. MAS — meras: Mas (23) on the 2008 stage, extending the cast sprite (cast/mas.ts masStage, read-only).
// Adds what the intro needs and the cast sheet doesn't have yet:
//   - a 4-drawing stride (legs redrawn with the stage rig's ramps + light), upper body from masStage
//   - collar states: 0 both flat, 1 the green outer collar popped, 2 both popped (the cast drawing)
// Everything is whole-pixel; the collars are swaps, not tweens.
import {PAL} from '../../../../../shared/pixel/palette';
import {FigureDef, Img, LightRig, P, Part, renderFigure} from '../../../../../shared/pixel/figure';
import {masStage, MAS_STAGE_W, MAS_STAGE_H, MAS_STAGE_DY, MAS_STAGE_HIP, MasStagePose} from '../../../../../shared/pixel/cast/mas';
import {seg} from '../../../../../shared/pixel/cast/kit';

export const M08_W = MAS_STAGE_W;
export const M08_H = MAS_STAGE_H;
/** local [x, y] of the point between his soles (standing) */
export const M08_FOOT: [number, number] = [23, 80];
const HIP_Y = MAS_STAGE_HIP; // the cast drawing is kept above this row; legs are ours below it (78 px lineup)
const D = MAS_STAGE_DY;

// the stage rig's ramps (copied values from cast/mas.ts STAGE_RAMPS: jeans / shoe), for the legs only
const LEG_RAMPS = {
  jeans: [PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7],
  shoe: [PAL.N2, PAL.G3, PAL.G5, PAL.G6, PAL.P2, PAL.P2],
};
const LEG_RIG: LightRig = {
  key: [-0.7, -0.7], keyBand: 2, shadowBand: 2, rim: true, outline: true,
  back: [1, -0.2], backBand: 1, backRamp: {jeans: PAL.C3, shoe: PAL.C5},
  ramps: LEG_RAMPS, groupBands: {legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 3}},
};

/** stride drawings, facing camera-left and walking left. [hipF, kneeF, ankleF, hipN, kneeN, ankleN] x/y, plus lift */
type Leg = {k: [number, number]; a: [number, number]; toe: number};
const STRIDE: Array<{far: Leg; near: Leg; bob: number}> = [
  // 0 contact: near foot forward (left), far foot back
  {far: {k: [22, 64], a: [27, 75], toe: 0}, near: {k: [21, 64], a: [15, 75], toe: 0}, bob: 0},
  // 1 passing: near leg planted under him, far leg swings through (knee forward, foot lifted)
  {far: {k: [15, 62], a: [19, 71], toe: 1}, near: {k: [24, 64], a: [23, 75], toe: 0}, bob: -1},
  // 2 contact: far foot forward, near foot back
  {far: {k: [14, 64], a: [10, 75], toe: 0}, near: {k: [28, 64], a: [32, 75], toe: 0}, bob: 0},
  // 3 passing: far leg planted, near leg swings through
  {far: {k: [17, 64], a: [16, 75], toe: 0}, near: {k: [21, 62], a: [25, 71], toe: 1}, bob: -1},
];

const shoe = (ax: number, ay: number, lift: number) => {
  // toe points camera-left; a lifted foot tips its toe down one pixel
  const y = ay + (lift ? -1 : 0);
  return P.poly(ax - 6, y + 1 + lift, ax + 2, y, ax + 3, y + 3, ax + 3, y + 5, ax - 7, y + 5, ax - 7, y + 3);
};

const legsFig = (d: (typeof STRIDE)[number]): FigureDef => {
  const parts: Part[] = [
    {group: 'legF', mat: 'jeans', prims: [seg(18, HIP_Y, 6, d.far.k[0], d.far.k[1], 5), seg(d.far.k[0], d.far.k[1], 5, d.far.a[0], d.far.a[1], 4.5)]},
    {group: 'shoeF', mat: 'shoe', prims: [shoe(d.far.a[0], d.far.a[1], d.far.toe)]},
    {group: 'legN', mat: 'jeans', prims: [seg(25, HIP_Y, 6, d.near.k[0], d.near.k[1], 5), seg(d.near.k[0], d.near.k[1], 5, d.near.a[0], d.near.a[1], 4.5)]},
    {group: 'shoeN', mat: 'shoe', prims: [shoe(d.near.a[0], d.near.a[1], d.near.toe)]},
  ];
  return {w: M08_W, h: M08_H, parts, adjust: [{prims: [P.rect(0, 79, M08_W, 2)], tone: 1, onlyMat: 'shoe'}]};
};

// ------------------------------------------------------------------ collars
const POLO = [PAL.L0, PAL.L1, PAL.L2, PAL.L3];
const CORAL = [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.W6, PAL.W8];
const isCollar = (c: number) => POLO.includes(c) || CORAL.includes(c);
// the cast's collar art (cast/mas.ts COLLARS at (14, 13)); we re-use its green half for state 1
const COLLARS = [
  '...........R....',
  '..r.......rRR...',
  '..rR......rRRG..',
  '..RRG.....rRGGG.',
  '..RGGg...rRgGGG.',
  '.GGggg...ggGGG..',
  '..GGgg..gGGG....',
];
const put = (img: Img, x: number, y: number, c: number) => { if (x >= 0 && y >= 0 && x < img.w && y < img.h) img.c[y * img.w + x] = c; };

const withCollars = (src: Img, state: 0 | 1 | 2): Img => {
  if (state === 2) return src;
  const img: Img = {w: src.w, h: src.h, c: new Int32Array(src.c)};
  // scrub every collar pixel above the shoulder line, restoring neck / jaw skin underneath
  for (let y = 12 + D; y <= 20 + D; y++)
    for (let x = 12; x <= 31; x++) {
      const v = img.c[y * img.w + x];
      if (v < 0 || !isCollar(v)) continue;
      const neck = x >= 19 && x <= 23 && y >= 15 + D;
      const jaw = x >= 24 && x <= 28 && y <= 16 + D;
      img.c[y * img.w + x] = neck ? (x >= 22 ? PAL.S2 : PAL.S3) : jaw ? PAL.S2 : -1;
    }
  if (state === 1) {
    // the green collar stands; the coral one still lies flat inside it
    COLLARS.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const ch = r[i]; if (ch === 'G') put(img, 14 + i, 13 + D + j, PAL.L2); else if (ch === 'g') put(img, 14 + i, 13 + D + j, PAL.L1); } });
    for (let x = 19; x <= 24; x++) put(img, x, 20 + D, PAL.R2);
    put(img, 25, 19 + D, PAL.R3);
  } else {
    // both flat: two small green flaps on the shoulders, a coral line at the neck
    const flaps: Array<[number, number, number]> = [[15, 20, PAL.L2], [16, 20, PAL.L3], [17, 20, PAL.L3], [18, 20, PAL.L2], [16, 21, PAL.L1], [17, 21, PAL.L2], [18, 21, PAL.L2],
      [24, 20, PAL.L2], [25, 20, PAL.L2], [26, 20, PAL.L1], [27, 20, PAL.L1], [24, 21, PAL.L1], [25, 21, PAL.L1], [26, 21, PAL.L0]];
    for (const [x, y, c] of flaps) put(img, x, y + D, c);
    for (let x = 19; x <= 23; x++) put(img, x, 20 + D, PAL.R2);
  }
  return img;
};

const cache = new Map<string, Img>();
/**
 * Mas 2008. `walk` = stride drawing 0..3, or -1 to stand (the cast legs). Feet stay on M08_FOOT.
 */
export const mas08 = (pose: MasStagePose, collars: 0 | 1 | 2, walk: -1 | 0 | 1 | 2 | 3) => {
  const key = JSON.stringify([pose, collars, walk]);
  let img = cache.get(key);
  if (!img) {
    const base0 = withCollars(masStage(pose), collars);
    // (Ep2's copy: the stage drawing's mouth, a two-pixel dark stroke running back up the cheek, read as a moustache
    // at this size and in the 2008 palette. The mouth is redrawn at the front of the face: a small open grin (teeth,
    // the back corner, a crease) when he smiles, a short closed line at rest.)
    const base = {...base0, c: Int32Array.from(base0.c)};
    const at = (x: number, y: number) => base.c[y * base.w + x], put = (x: number, y: number, v: number) => { base.c[y * base.w + x] = v; };
    if (at(19, 17) === PAL.S1 && at(17, 18) === PAL.S1) {
      put(19, 17, PAL.S2); put(20, 17, PAL.S2); put(19, 18, PAL.S2);
      if (pose.mouth === 'smile') { put(16, 18, PAL.P2); put(17, 18, PAL.P2); put(18, 18, PAL.S1); put(18, 17, PAL.S3); }
      else put(18, 18, PAL.S3);
    }
    if (walk < 0) img = base;
    else {
      img = {w: M08_W, h: M08_H, c: new Int32Array(M08_W * M08_H).fill(-1)};
      const legs = renderFigure(legsFig(STRIDE[walk]), LEG_RIG);
      for (let i = 0; i < img.c.length; i++) if (legs.c[i] >= 0) img.c[i] = legs.c[i];
      // upper body (belt and up) from the cast drawing, on top of the hips
      // (on the passing drawings the body rides up a pixel; the planted foot stays on the floor)
      const bob = STRIDE[walk].bob;
      for (let y = 0; y <= HIP_Y; y++) for (let x = 0; x < M08_W; x++) { const v = base.c[y * M08_W + x]; if (v >= 0 && y + bob >= 0) img.c[(y + bob) * M08_W + x] = v; }
    }
    cache.set(key, img);
  }
  return img;
};
