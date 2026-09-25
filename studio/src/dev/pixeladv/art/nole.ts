// MR. MAS — pixeladv: NOLE, room sprite (3/4 facing screen-left). Tall, broad, square jaw,
// swept-back dark hair, black tee, phone. Rig: legs (stand + 4-drawing walk), near arm (5 poses),
// head (mouth closed/open), lean by integer row-shear, palettes: lit / doorway silhouette / fade.
import {FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure} from '../core/figure';
import {PAL} from '../core/palette';

export const NOLE_W = 58;
export const NOLE_H = 94;
/** local x of the feet centre, local y of the soles */
export const NOLE_FOOT: [number, number] = [34, 92];

export type NoleLegs = 'stand' | 'w0' | 'w1' | 'w2' | 'w3' | 'wide';
export type NoleArm = 'down' | 'phone' | 'jab' | 'jab2' | 'raise' | 'slam';
export interface NolePose { legs: NoleLegs; arm: NoleArm; mouth: 0 | 1 | 2; lean: number; light: 'lit' | 'sil' | 'fade1' | 'fade2'; brow: 0 | 1; }

const X = 10; // horizontal offset so a jabbing arm fits on the canvas

// a limb segment as a tapered quad from (x0,y0,w0) to (x1,y1,w1)
const seg = (x0: number, y0: number, w0: number, x1: number, y1: number, w1: number): Prim => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return P.poly(x0 + nx * w0 / 2, y0 + ny * w0 / 2, x1 + nx * w1 / 2, y1 + ny * w1 / 2, x1 - nx * w1 / 2, y1 - ny * w1 / 2, x0 - nx * w0 / 2, y0 - ny * w0 / 2);
};

type Leg = [number, number, number, number, number, number, number]; // hipX, kneeX, kneeY, ankleX, ankleY, toeLift, heel
const LEGS: Record<NoleLegs, {n: Leg; f: Leg; bob: number}> = {
  stand: {n: [22, 21, 67, 21, 85, 0, 0], f: [30, 30, 67, 31, 85, 0, 0], bob: 0},
  wide: {n: [22, 19, 67, 16, 85, 0, 0], f: [30, 32, 67, 35, 85, 0, 0], bob: 1},
  w0: {n: [22, 15, 66, 10, 83, 0, 1], f: [30, 33, 67, 39, 82, 1, 0], bob: 1},
  w1: {n: [22, 21, 67, 22, 85, 0, 0], f: [30, 25, 64, 29, 78, 0, 0], bob: 0},
  w2: {n: [22, 25, 66, 30, 82, 1, 0], f: [30, 23, 66, 18, 83, 0, 1], bob: 1},
  w3: {n: [22, 18, 64, 21, 78, 0, 0], f: [30, 29, 67, 30, 85, 0, 0], bob: 0},
};

const legParts = (l: Leg, near: boolean): Part[] => {
  const [hx, kx, ky, ax, ay, toe, heel] = l.map((v, i) => (i === 0 || i === 1 || i === 3 ? v + X : v)) as Leg;
  const g = near ? 'legN' : 'legF';
  const foot = toe
    ? P.poly(ax - 2, ay - 1, ax + 3, ay + 1, ax + 1, ay + 6, ax - 5, ay + 6) // toe-off: heel up
    : heel
      ? P.poly(ax - 3, ay, ax + 2, ay, ax + 3, ay + 5, ax - 7, ay + 4) // heel strike: toe up
      : P.poly(ax - 3, ay, ax + 2, ay, ax + 3, ay + 6, ax - 8, ay + 6, ax - 8, ay + 4);
  return [
    {group: g, mat: 'jeans', prims: [seg(hx, 48, 8, kx, ky, 6), seg(kx, ky, 6, ax, ay + 1, 4.5)]},
    {group: g + 's', mat: 'shoe', prims: [foot]},
  ];
};

const armParts = (a: NoleArm): Part[] => {
  const sx = 17 + X, sy = 23;
  const S = (pts: Array<[number, number, number]>) => pts.slice(1).map((p, i) => seg(pts[i][0] + X, pts[i][1], pts[i][2], p[0] + X, p[1], p[2]));
  switch (a) {
    case 'down':
      return [
        {group: 'armN', mat: 'tee', prims: [seg(sx, sy, 8, 16 + X, 32, 7)]},
        {group: 'armN', mat: 'skin', prims: S([[16, 32, 6], [16, 40, 5], [17, 45, 4]])},
        {group: 'phone', mat: 'phone', prims: [P.rect(15 + X, 43, 3, 6)]},
      ];
    case 'phone':
      return [
        {group: 'armN', mat: 'tee', prims: [seg(sx, sy, 8, 16 + X, 32, 7)]},
        {group: 'armN', mat: 'skin', prims: S([[16, 33, 6], [11, 32, 5], [8, 29, 4]])},
        {group: 'phone', mat: 'phone', prims: [P.rect(5 + X, 24, 3, 6)]},
      ];
    case 'jab':
      return [
        {group: 'armN', mat: 'tee', prims: [seg(sx, sy, 8, 11 + X, 27, 7)]},
        {group: 'armN', mat: 'skin', prims: S([[11, 27, 6], [3, 27, 5], [-1, 26, 4]])},
        {group: 'phone', mat: 'phone', prims: [P.rect(-5 + X, 22, 3, 6)]},
      ];
    case 'jab2':
      return [
        {group: 'armN', mat: 'tee', prims: [seg(sx, sy, 8, 12 + X, 28, 7)]},
        {group: 'armN', mat: 'skin', prims: S([[12, 28, 6], [5, 29, 5], [2, 28, 4]])},
        {group: 'phone', mat: 'phone', prims: [P.rect(-2 + X, 24, 3, 6)]},
      ];
    case 'raise':
      return [
        {group: 'armN', mat: 'tee', prims: [seg(sx, sy, 8, 13 + X, 16, 7)]},
        {group: 'armN', mat: 'skin', prims: S([[13, 16, 6], [11, 8, 5], [11, 3, 5]])},
        {group: 'phone', mat: 'phone', prims: [P.rect(12 + X, -1, 3, 6)]},
        {group: 'armN', mat: 'skin', prims: [P.ell(11 + X, 3, 2.6, 2.4)]},
      ];
    case 'slam':
      return [
        {group: 'armN', mat: 'tee', prims: [seg(sx, sy, 8, 10 + X, 31, 7)]},
        {group: 'armN', mat: 'skin', prims: S([[10, 31, 6], [4, 36, 5], [1, 37, 5]])},
        {group: 'phone', mat: 'phone', prims: [P.rect(-5 + X, 37, 7, 2)]},
        {group: 'armN', mat: 'skin', prims: [P.ell(0 + X, 36, 2.8, 2.2)]},
      ];
  }
};

const headParts = (): Part[] => [
  {group: 'neck', mat: 'skin', prims: [P.rect(23 + X, 16, 8, 6)]},
  {group: 'head', mat: 'skin', prims: [
    P.ell(26 + X, 10, 5.6, 6.3),
    P.poly(20.4 + X, 10, 21 + X, 15.5, 23.4 + X, 18.2, 28.6 + X, 18.2, 30.6 + X, 15.6, 31.4 + X, 10),
    P.poly(20.6 + X, 8.2, 18.6 + X, 11.8, 20.8 + X, 12.6),
  ]},
  {group: 'head', mat: 'hair', prims: [P.poly(20 + X, 7.4, 20.6 + X, 4.4, 23.5 + X, 2.4, 29 + X, 2.2, 32.2 + X, 4.6, 33 + X, 8.6, 32 + X, 13, 30.4 + X, 11.6, 30 + X, 8, 26.5 + X, 6.4, 23 + X, 6.2, 20.6 + X, 8.4)]},
  {group: 'ear', mat: 'skin', prims: [P.ell(29.6 + X, 11.4, 1.2, 1.8)]},
];

const torsoParts = (): Part[] => [
  // far arm first (behind torso)
  {group: 'armF', mat: 'tee', prims: [seg(35 + X, 23, 8, 38 + X, 33, 7)]},
  {group: 'armF', mat: 'skin', prims: [seg(38 + X, 33, 6, 38.5 + X, 44, 4.5), P.ell(38.4 + X, 45.5, 2, 2.2)]},
  {group: 'torso', mat: 'tee', prims: [P.poly(12.5 + X, 24, 17 + X, 20.4, 34 + X, 20.4, 39 + X, 23, 39.5 + X, 29, 35.5 + X, 49, 17.5 + X, 49, 14.5 + X, 32)]},
  {group: 'torso', mat: 'belt', prims: [P.rect(16 + X, 47, 21, 2)]},
];

const faceStamp = (mouth: number, brow: number): Stamp[] => [{
  x: 19 + X, y: 7,
  rows: [
    '.......',
    brow ? '.bbb...' : 'bbbb...',
    brow ? 'b.e....' : '..e....',
    '.......',
    '.......',
    '.......',
    '.......',
    mouth === 0 ? '.mmm...' : mouth === 1 ? '.mMm...' : '.MMm...',
    mouth === 2 ? '..M....' : '.......',
    '...j...',
  ],
  pal: {b: PAL.N0, e: PAL.N0, m: PAL.S1, M: PAL.N0, j: PAL.S3},
}];

export const noleFigure = (p: NolePose): FigureDef => {
  const L = LEGS[p.legs];
  const bob = L.bob;
  const up: Part[] = [...torsoParts(), ...headParts(), ...armParts(p.arm)].map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftPrim(pr, 0, bob))}));
  const parts: Part[] = [...legParts(L.f, false), ...up.slice(0, 2), ...legParts(L.n, true), ...up.slice(2)];
  return {
    w: NOLE_W, h: NOLE_H, parts,
    adjust: [
      // tee crease + a sleeve hem, jaw shadow line
      {prims: [shiftPrim(P.line(17 + X, 30, 22 + X, 38), 0, bob)], add: -1, onlyMat: 'tee'},
      {prims: [shiftPrim(P.line(22 + X, 18, 29 + X, 18), 0, bob)], tone: 1, onlyMat: 'skin'},
    ],
    stamps: faceStamp(p.mouth, p.brow).map((s) => ({...s, y: s.y + bob})),
  };
};

const shiftPrim = (p: Prim, dx: number, dy: number): Prim => {
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => v + (i % 2 ? dy : dx))};
    case 'ell': return {...p, cx: p.cx + dx, cy: p.cy + dy};
    case 'rect': return {...p, x: p.x + dx, y: p.y + dy};
    case 'line': return {...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy};
    case 'map': return {...p, x: p.x + dx, y: p.y + dy};
  }
};

const LIT = {
  skin: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  hair: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.K1, PAL.C4],
  tee: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.C1, PAL.C4],
  belt: [PAL.N0, PAL.N0, PAL.D0, PAL.D1, PAL.C1, PAL.C3],
  jeans: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.C2, PAL.C4],
  shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.C2, PAL.C3],
  phone: [PAL.N0, PAL.N0, PAL.N1, PAL.N3, PAL.C4, PAL.C7],
};
const SIL: Record<string, number[]> = Object.fromEntries(Object.keys(LIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.W1, PAL.W2]]));
const dim = (r: number[], k: number) => r.map((_, i) => r[Math.max(0, i - k)]);
const FADE1 = Object.fromEntries(Object.entries(LIT).map(([k, r]) => [k, dim(r, 2)]));
const FADE2 = Object.fromEntries(Object.entries(LIT).map(([k, r]) => [k, dim(r, 1)]));

export const noleRig = (light: NolePose['light']): LightRig => ({
  key: [-0.97, -0.25],
  keyBand: light === 'sil' ? 1 : 3,
  shadowBand: 3,
  rim: true,
  outline: true,
  back: [1, -0.1],
  backBand: light === 'sil' ? 1 : 1,
  backRamp: light === 'sil'
    ? {skin: PAL.W7, hair: PAL.W6, tee: PAL.W6, jeans: PAL.W6, shoe: PAL.W5, phone: PAL.W7, belt: PAL.W5}
    : {skin: PAL.W6, hair: PAL.W4, tee: PAL.W3, jeans: PAL.W2, shoe: PAL.W2, phone: PAL.W5, belt: PAL.W3},
  ramps: light === 'lit' ? LIT : light === 'sil' ? SIL : light === 'fade1' ? FADE1 : FADE2,
  groupBands: {head: {key: 3, shadow: 3}, torso: {key: 4, shadow: 4}, armN: {key: 2, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 3}},
  // the monitor sits at desk height: his head and chest get it, his legs fall off into the dark
  keyGain: light === 'sil' ? undefined : (_x, y) => (y < 50 ? 1 : Math.max(0.12, 1 - (y - 50) / 34)),
  // hallway light from behind: strong on the upper body, thin on the legs
  backGain: light === 'sil' ? undefined : (_x, y) => (y < 48 ? 1 : Math.max(0.2, 1 - (y - 48) / 40)),
});

/** integer lean: rows above the waist shift left, one pixel per `rpp` rows */
const leanImg = (img: Img, lean: number, pivot = 50): Img => {
  if (!lean) return img;
  const rpp = Math.max(3, Math.round(pivot / lean));
  const c = new Int32Array(img.w * img.h).fill(-1);
  for (let j = 0; j < img.h; j++) {
    const k = j < pivot ? Math.min(lean, Math.floor((pivot - j) / rpp)) : 0;
    for (let i = 0; i < img.w; i++) {
      const si = i + k;
      if (si >= 0 && si < img.w) c[j * img.w + i] = img.c[j * img.w + si];
    }
  }
  return {w: img.w, h: img.h, c};
};

const cache = new Map<string, Img>();
export const noleImg = (p: NolePose): Img => {
  const k = JSON.stringify(p);
  let v = cache.get(k);
  if (!v) {
    v = leanImg(renderFigure(noleFigure(p), noleRig(p.light)), p.lean);
    if (p.light === 'sil') {
      // doorway: pure silhouette with a hot hallway rim that wraps both edges and the crown
      const s = v, c = new Int32Array(s.c);
      const op = (i: number, j: number) => i >= 0 && j >= 0 && i < s.w && j < s.h && s.c[j * s.w + i] >= 0;
      for (let j = 0; j < s.h; j++)
        for (let i = 0; i < s.w; i++) {
          if (!op(i, j)) continue;
          const edgeR = !op(i + 1, j), edgeL = !op(i - 1, j), edgeT = !op(i, j - 1);
          c[j * s.w + i] = edgeR || edgeT ? PAL.W7 : edgeL ? PAL.W5 : PAL.N0;
        }
      v = {w: s.w, h: s.h, c};
    }
    cache.set(k, v);
  }
  return v;
};
