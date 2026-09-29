// MR. MAS — cast (castrivals): NOLE. Tall, broad, square jaw, swept-back dark hair, black tee, phone.
// v2 of the pixeladv room sprite (3/4 facing screen-left): V-taper with deltoid caps and trapezius slope,
// short sleeves with hems, thicker arms, hair with swept volume, a squarer jaw. Rig: legs (stand, wide,
// 4-drawing walk), front arm (down / phone / jab / jab2 / raise / point), back arm (hang / swing),
// integer lean by row-shear, light states lit / sil (doorway) / fade1 / fade2.
// Plus: his conversation portrait (upgraded copy), the SPACEZ booster with its hatch, and the
// novelty check ($1,000,000,000*).
import {Buf, rect, bayer} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {CX, micro, microImg, microWidth, newImg, putPx, seg, shiftPrim} from './bosses';
import {text} from '../font';

export const NOLE_W = 68;
export const NOLE_H = 96;
const X = 14; // left margin so a jab fits on the canvas
/** local x of the feet centre, local y of the soles */
export const NOLE_FOOT: [number, number] = [X + 27, 93];

export type NoleLegs = 'stand' | 'wide' | 'w0' | 'w1' | 'w2' | 'w3';
export type NoleArm = 'down' | 'phone' | 'jab' | 'jab2' | 'raise' | 'point' | 'check' | 'check2';
export type NoleLight = 'lit' | 'sil' | 'fade1' | 'fade2';
export interface NolePose { legs: NoleLegs; arm: NoleArm; mouth: 0 | 1 | 2; lean: number; light: NoleLight; brow: 0 | 1; back?: 'hang' | 'phoneUp' | 'phoneUp2'; noLegs?: boolean; }
export const NOLE_BASE: NolePose = {legs: 'stand', arm: 'down', mouth: 0, lean: 0, light: 'lit', brow: 0};

type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number; foot: 'flat' | 'toe' | 'heel'};
const L = (hip: number, kx: number, ky: number, ax: number, ay: number, foot: Leg['foot'] = 'flat'): Leg => ({hip, kx, ky, ax, ay, foot});
const LEGS: Record<NoleLegs, {n: Leg; f: Leg; bob: number; swing: number}> = {
  stand: {n: L(23, 22.6, 68, 22.2, 86), f: L(31, 31.4, 68, 31.8, 86), bob: 0, swing: 0},
  wide: {n: L(23, 20.6, 68, 17.4, 86), f: L(31, 33.2, 68, 36.2, 86), bob: 1, swing: 0},
  w0: {n: L(23, 17.2, 67, 12.4, 84, 'heel'), f: L(31, 34.2, 68, 39.2, 83, 'toe'), bob: 1, swing: 1},
  w1: {n: L(23, 22.6, 68, 23, 86), f: L(31, 27.4, 65, 30.6, 79), bob: 0, swing: 0},
  w2: {n: L(23, 26.2, 67, 31.4, 83, 'toe'), f: L(31, 25, 67, 19.2, 84, 'heel'), bob: 1, swing: -1},
  w3: {n: L(23, 20.4, 65, 22.6, 79), f: L(31, 31.4, 68, 31.4, 86), bob: 0, swing: 0},
};

const legParts = (l: Leg, near: boolean): Part[] => {
  const g = near ? 'legN' : 'legF';
  const hx = l.hip + X, kx = l.kx + X, ax = l.ax + X, {ky, ay} = l;
  // shoes point screen-left: long toe, short heel
  const foot = l.foot === 'toe'
    ? P.poly(ax - 2, ay - 1, ax + 3, ay + 1, ax + 1.5, ay + 7, ax - 6, ay + 7, ax - 6, ay + 5.4)
    : l.foot === 'heel'
      ? P.poly(ax - 3, ay, ax + 2.6, ay, ax + 3.4, ay + 6, ax - 7.6, ay + 4.6, ax - 7.6, ay + 3.2)
      : P.poly(ax - 3, ay, ax + 2.6, ay, ax + 3.4, ay + 7, ax - 8.4, ay + 7, ax - 8.4, ay + 5, ax - 5, ay + 3.6);
  return [
    {group: g, mat: 'jeans', prims: [seg(hx, 49, 9, kx, ky, 7), seg(kx, ky, 7, ax, ay + 1, 5), P.ell(kx, ky, 3.4, 3)]},
    {group: g + 's', mat: 'shoe', prims: [foot]},
  ];
};

// ---- arms. Front arm = the one on the screen-left side (in front of the chest).
const SH_F: [number, number] = [16.4, 25.4];
const SH_B: [number, number] = [34.6, 24.8];
const arm = (group: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number, handR = 2.5): Part[] => {
  // sleeve covers the top ~40% of the upper arm, with a flared hem
  const t = 0.42, mx = sx + (ex - sx) * t, my = sy + (ey - sy) * t;
  return [
    {group, mat: 'skin', prims: [seg(sx + X, sy, 7, ex + X, ey, 6.2), seg(ex + X, ey, 6, hx + X, hy, 4.6), P.ell(ex + X, ey, 3, 3), P.ell(hx + X, hy, handR, handR + 0.2)]},
    {group, mat: 'tee', prims: [P.ell(sx + X, sy + 0.4, 4.4, 4.6), seg(sx + X, sy, 9, mx + X, my, 8.4)]},
  ];
};
const frontArm = (a: NoleArm): {parts: Part[]; phone: Prim | null} => {
  const [sx, sy] = SH_F;
  switch (a) {
    case 'down': return {parts: arm('armN', sx, sy, 15.4, 36, 16.4, 46.4), phone: P.rect(14.6 + X, 44.6, 3, 6)};
    case 'phone': return {parts: arm('armN', sx, sy, 15, 36.5, 9.4, 31.4), phone: P.rect(6.4 + X, 25.4, 3, 7)};
    case 'jab': return {parts: arm('armN', sx, sy, 9.2, 29.6, 0.6, 27.6), phone: P.rect(-4.6 + X, 22.4, 3, 7)};
    case 'jab2': return {parts: arm('armN', sx, sy, 10.6, 31, 3.6, 29.4), phone: P.rect(-1.4 + X, 24.4, 3, 7)};
    case 'raise': return {parts: arm('armN', sx, sy, 12.6, 16, 12, 6.2), phone: P.rect(11 + X, -0.6, 3, 7)};
    case 'point': return {parts: arm('armN', sx, sy, 9.6, 29.4, 2.4, 25.2, 2.2), phone: null};
    case 'check': return {parts: arm('armN', sx, sy, 11, 33.4, 3.6, 33, 2.6), phone: null};
    case 'check2': return {parts: arm('armN', sx, sy, 9, 32.4, 0.4, 31.6, 2.6), phone: null};
  }
};
const backArm = (swing: number, pose: NolePose['back'] = 'hang'): {parts: Part[]; phone: Prim | null} =>
  pose === 'phoneUp' ? {parts: arm('armF', SH_B[0], SH_B[1], 40.4, 18, 38, 9.4), phone: P.rect(36.6 + X, 2.4, 3, 7)}
    : pose === 'phoneUp2' ? {parts: arm('armF', SH_B[0], SH_B[1], 40.6, 17, 38.8, 7.6), phone: P.rect(37.4 + X, 0.6, 3, 7)}
      : {parts: arm('armF', SH_B[0], SH_B[1], 36.6 - swing * 1.4, 36, 37.4 - swing * 3, 46 - Math.abs(swing)), phone: null};

const headParts = (): Part[] => [
  {group: 'neck', mat: 'skin', prims: [P.poly(21.6 + X, 17, 28.8 + X, 16, 30.4 + X, 23, 20.8 + X, 23)]},
  // silhouette stand-in under the hand-pixelled head (keeps the rig's banding of the neck honest)
  {group: 'head', mat: 'skin', prims: [P.rect(20 + X, 13, 7, 6)]},
];

// Hand-pixelled head, 3/4 facing screen-left. Tone map: digits = skin ramp, H..K = hair ramp,
// w/W = warm back-rim (skin/hair), b/e = brow/eye, m/M = mouth, n = nostril. 18 x 22, top-left at (16+X, 0).
const HEAD_ROWS = [
  '.......oooooo.....',
  '.....ooJIIHHHoo...',
  '....oKJJIIHHHHHo..',
  '...oKJIJIIHHHHHho.',
  '...oJIJIIHHIHHhhWo',
  '..oJIIHIHHHHHhhhWo',
  '..oJIHHHHHHhhhhhWo',
  '..o5IIHHhhhhhhhhWo',
  '..o544HHhhhhhhhWo.',
  '.o5443333Hhhhhhwo.',
  '.o4bbb4333oo1hhWo.',
  '.o44e44332o21hWo..',
  'o5544433322o21Wo..',
  'o544443332o221Wo..',
  '.oon443322o21wo...',
  '..o44433222111o...',
  '..o4mmm3222211o...',
  '..o4443322221o....',
  '..o5443322221o....',
  '..oo4332222oo.....',
  '...ooo1111o.......',
  '.....o2221o.......',
];
const headStamp = (mouth: number, brow: number, bob: number): Stamp => {
  const rows = HEAD_ROWS.slice();
  // brow up: the brow lifts a row and pinches (the "I came up with the name!" face)
  if (brow) { rows[9] = '.o4bbb333Hhhhhhwo.'; rows[10] = '.o4443b333oo1hhWo.'; }
  rows[16] = mouth === 0 ? '..o4mmm3222211o...' : mouth === 1 ? '..o4mMm3222211o...' : '..o4MMM3222211o...';
  if (mouth === 2) rows[17] = '..o4MM322221o....';
  return {x: 16 + X, y: bob, rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], K: ['hair', 5],
    w: ['rimS', 0], W: ['rimH', 0], b: ['hair', 0], e: ['hair', 0], m: ['skin', 1], M: ['hair', 0], n: ['skin', 1],
  }};
};

const torsoParts = (): Part[] => [
  // trapezius slope -> broad back deltoid -> lats -> waist; chest bulges forward on the left
  {group: 'torso', mat: 'tee', prims: [P.poly(
    20.8 + X, 20.4, 29.6 + X, 19.8, 33.8 + X, 21.2, 37.6 + X, 24, 38.4 + X, 29.4, 36.8 + X, 36.4, 35 + X, 42.6, 35.6 + X, 48.8,
    18.4 + X, 48.8, 18.8 + X, 43.2, 17.2 + X, 37.6, 14.8 + X, 33.2, 13.2 + X, 28.6, 14.4 + X, 24.2, 17.2 + X, 21.8)]},
  {group: 'torso', mat: 'belt', prims: [P.rect(18.6 + X, 47.6, 17, 2)]},
];


export const noleFigure = (p: NolePose): FigureDef => {
  const Lg = LEGS[p.legs];
  const bob = Lg.bob;
  const fa = frontArm(p.arm);
  const up = (parts: Part[]) => parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftPrim(pr, 0, bob))}));
  const ba = backArm(p.legs.startsWith('w') ? -Lg.swing : 0, p.back);
  const parts: Part[] = [
    ...(p.noLegs ? [] : legParts(Lg.f, false)),
    ...up(ba.parts),
    ...(ba.phone ? up([{group: 'phoneB', mat: 'phone', prims: [ba.phone]}]) : []),
    ...(p.noLegs ? [] : legParts(Lg.n, true)),
    ...up(torsoParts()),
    ...up(headParts()),
    ...up(fa.parts),
    ...(fa.phone ? up([{group: 'phone', mat: 'phone', prims: [fa.phone]}]) : []),
  ];
  const S = (pr: Prim) => shiftPrim(pr, 0, bob);
  return {
    w: NOLE_W, h: NOLE_H, parts,
    adjust: [
      // chest plane catches the key; a fold under the pec; lats fall into shadow; tee hem
      {prims: [S(P.poly(16 + X, 27, 23 + X, 23.6, 26 + X, 27, 22 + X, 33, 17.6 + X, 34))], add: 1, onlyMat: 'tee'},
      {prims: [S(P.poly(17 + X, 21.4, 29 + X, 20.2, 33 + X, 21.4, 27 + X, 22.6, 19 + X, 23.4))], tone: 4, onlyMat: 'tee'},
      {prims: [S(P.poly(18 + X, 23, 30 + X, 22, 31 + X, 28, 25 + X, 31, 19 + X, 32))], tone: 3, onlyMat: 'tee'},
      {prims: [S(P.line(19 + X, 32, 25 + X, 31)), S(P.line(25 + X, 31, 30 + X, 28))], tone: 1, onlyMat: 'tee'},
      {prims: [S(P.line(18 + X, 35, 25 + X, 36)), S(P.line(21 + X, 41, 27 + X, 42))], add: -1, onlyMat: 'tee'},
      {prims: [S(P.poly(32 + X, 29, 37.6 + X, 28.6, 35.4 + X, 42, 32.6 + X, 40))], tone: 1, onlyMat: 'tee'},
      {prims: [S(P.line(19 + X, 47, 35 + X, 47))], tone: 1, onlyMat: 'tee'},
      // jaw shadow onto the neck, and the hair's swept strands
      // shins fall off into the dark
      {prims: [P.rect(0, 78, NOLE_W, 18)], add: -1, onlyMat: 'jeans'},
    ],
    stamps: [headStamp(p.mouth, p.brow, bob), ...phoneStamp(fa.phone, bob), ...phoneStamp(ba.phone, bob)],
  };
};

/** the phone's screen glows (it is his light source as much as the monitor is) */
const phoneStamp = (ph: Prim | null, bob: number): Stamp[] => {
  if (!ph || ph.k !== 'rect') return [];
  const x = Math.round(ph.x), y = Math.round(ph.y) + bob;
  const vert = ph.h > ph.w;
  return [{x, y, rows: vert ? ['ooo', 'oCo', 'oco', 'oCo', 'oco', 'oco', 'ooo'].slice(0, Math.round(ph.h)) : ['oooo', 'occo'], pal: {o: PAL.N0, C: PAL.C8, c: PAL.C6}}];
};

const LIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  hair: [PAL.N0, PAL.N0, PAL.B0, PAL.B1, PAL.K1, PAL.C4],
  tee: [PAL.N0, PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.C4],
  belt: [PAL.N0, PAL.N0, PAL.D0, PAL.D1, PAL.C1, PAL.C3],
  jeans: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.C2, PAL.C4],
  shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.C2, PAL.C3],
  phone: [PAL.N0, PAL.N0, PAL.N1, PAL.N3, PAL.C4, PAL.C7],
  rimS: [PAL.W6, PAL.W6, PAL.W6, PAL.W6, PAL.W6, PAL.W6],
  rimH: [PAL.W3, PAL.W3, PAL.W3, PAL.W3, PAL.W3, PAL.W3],
};
const SIL: Record<string, number[]> = Object.fromEntries(Object.keys(LIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.W1, PAL.W2]]));
SIL.rimS = SIL.rimH = [PAL.W7, PAL.W7, PAL.W7, PAL.W7, PAL.W7, PAL.W7];
const dim = (r: number[], k: number) => r.map((_, i) => r[Math.max(0, i - k)]);
const FADE1 = Object.fromEntries(Object.entries(LIT).map(([k, r]) => [k, dim(r, 2)]));
const FADE2 = Object.fromEntries(Object.entries(LIT).map(([k, r]) => [k, dim(r, 1)]));

export const noleRig = (light: NoleLight): LightRig => ({
  key: [-0.97, -0.25],
  keyBand: light === 'sil' ? 1 : 3,
  shadowBand: 3,
  rim: true,
  outline: true,
  back: [1, -0.1],
  backBand: 1,
  backRamp: light === 'sil'
    ? {skin: PAL.W7, hair: PAL.W6, tee: PAL.W6, jeans: PAL.W6, shoe: PAL.W5, phone: PAL.W7, belt: PAL.W5}
    : {skin: PAL.W6, hair: PAL.W4, tee: PAL.W3, jeans: PAL.W2, shoe: PAL.W2, phone: PAL.W5, belt: PAL.W3},
  ramps: light === 'lit' ? LIT : light === 'sil' ? SIL : light === 'fade1' ? FADE1 : FADE2,
  groupBands: {head: {key: 6, shadow: 2}, hair: {key: 2, shadow: 2}, torso: {key: 6, shadow: 4}, armN: {key: 3, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 3}, phone: {key: 0, shadow: 0}, phoneB: {key: 0, shadow: 0}},
  keyGain: light === 'sil' ? undefined : (_x, y) => (y < 50 ? 1 : Math.max(0.12, 1 - (y - 50) / 34)),
  backGain: light === 'sil' ? undefined : (_x, y) => (y < 48 ? 1 : Math.max(0.2, 1 - (y - 48) / 40)),
});

/** integer lean: rows above the waist shift toward screen-left, one pixel per `rpp` rows */
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
      // doorway: pure silhouette with a hot rim that wraps both edges and the crown
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

// ================================================================== the SPACEZ booster
export interface BoosterState {
  /** whole-pixel offset above its landed position (descent) */
  lift: number;
  /** landing legs compressed on touchdown */
  squat: boolean;
  /** hatch drawings: 0 shut, 1 cracked, 2 open */
  hatch: 0 | 1 | 2;
  /** engine plume drawing (0..2) or -1 for off; -2 = hot afterglow only */
  burn: number;
  f: number;
}
export const BOOSTER = {hw: 20, hatchX0: -19, hatchX1: 2, hatchY0: -92, hatchY1: -40, bellH: 11};
// white paint: its unlit value is still a mid grey; each light pushes it toward its own hue
const hullRamps = {
  cyan: [PAL.N2, PAL.N4, PAL.G3, PAL.G4, PAL.G5, PAL.C7, PAL.C8],
  warm: [PAL.N2, PAL.X2, PAL.X3, PAL.G5, PAL.W6, PAL.W7, PAL.W8],
  amb: [PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.G2, PAL.G3, PAL.G4],
};
/** Draw the booster with its engine-bell bottom centre at (cx, by) (landed position, before lift). */
export const drawBooster = (b: Buf, cx: number, by: number, s: BoosterState, legY: number) => {
  const {hw, bellH} = BOOSTER;
  const top = -400;
  const baseY = by - s.lift + (s.squat ? 2 : 0);
  const bodyBot = baseY - bellH;
  // ---- landing legs (behind the bell, in front of nothing): two visible, one back
  const legs: Array<[number, number, number]> = [[-1, -34, 0], [1, 32, 0], [0, 6, 1]];
  for (const [side, fx, back] of legs) {
    const hx = cx + side * (hw - 2), hy = bodyBot - 14 + (s.squat ? 2 : 0);
    const footX = cx + fx, footY = s.lift > 0 ? hy + 20 : legY;
    const kx = s.lift > 0 ? cx + side * (hw + 6) : footX;
    const steps = 40;
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const x = Math.round(hx + (kx - hx) * t), y = Math.round(hy + (footY - hy) * t);
      b.set(x, y, back ? PAL.N2 : PAL.N0); b.set(x + 1, y, back ? PAL.N3 : side < 0 ? PAL.C4 : PAL.G3); b.set(x + 2, y, back ? PAL.N2 : PAL.N0);
    }
    if (!back) { rect(footX - 3, footY, 7, 2, b.ink(PAL.N0)); rect(footX - 2, footY, 5, 1, b.ink(side < 0 ? PAL.C3 : PAL.W4)); }
  }
  // ---- hull: a painted cylinder. Cool key from the left (the vault next door), warm from below.
  for (let y = Math.max(0, baseY + top); y < bodyBot; y++)
    for (let x = cx - hw; x <= cx + hw; x++) {
      const u = (x + 0.5 - cx) / hw;
      if (Math.abs(u) > 1) continue;
      const edge = Math.abs(u) > 0.94;
      const bz = bayer(x, y) - 0.5;
      const ck = Math.max(0, -u * 0.9 + 0.05) * 6.4;
      const near = clampN((y - (bodyBot - 80)) / 80, 0, 1);
      const wk = Math.max(0, u * 0.8 + 0.2) * (0.35 + near * 0.65) * 6 * (s.burn >= 0 ? 1.1 : 0.9);
      const ak = 3.4 - Math.abs(u) * 1.4;
      let r = hullRamps.amb, v = ak;
      if (ck + bz * 0.7 > v) { r = hullRamps.cyan; v = ck; }
      if (wk + bz * 0.7 > v) { r = hullRamps.warm; v = wk; }
      let q = Math.max(0, Math.min(6, Math.floor(v + bz * 0.8 + 0.5)));
      // soot: vertical streaks from the bottom up
      const soot = (bodyBot - y) < 22 + ((x * 7) % 9) * 2 && ((x * 13) % 5) < 3;
      if (soot) q = Math.max(0, q - 2);
      b.set(x, y, edge ? PAL.N0 : r[q]);
    }
  // livery: a rocket-red band, the SPACEZ stencil down the lit side
  const bandY = bodyBot - 100;
  for (let y = bandY; y < bandY + 4; y++)
    for (let x = cx - hw + 1; x < cx + hw; x++) {
      const u = (x + 0.5 - cx) / hw;
      b.set(x, y, u < -0.5 ? CX.Q2 : u < 0.4 ? (y === bandY ? CX.Q2 : CX.Q1) : CX.Q0);
    }
  // the SPACEZ stencil (must-read, SCRIPT T13): the 7-px face stacked down the lit side, cream paint with a 1-px
  // dark keyline, so it reads on the grey-blue hull (the navy micro stencil read only as an egg)
  'SPACEZ'.split('').forEach((ch, i) => text(b, ch, cx + 8, bodyBot - 88 + i * 9, PAL.P2, {outline: PAL.N0}));
  // grid fins up top (usually out of frame, through the ceiling)
  for (const side of [-1, 1]) for (let j = 0; j < 7; j++) for (let i = 0; i < 6; i++) if ((i + j) % 2 === 0 || j === 0 || j === 6) b.set(cx + side * (hw + 1 + i), bodyBot - 110 + j, j === 0 || j === 6 ? PAL.N0 : side < 0 ? PAL.C4 : PAL.G2);
  // ---- hatch
  const X0 = cx + BOOSTER.hatchX0, X1 = cx + BOOSTER.hatchX1;
  const Y0 = bodyBot + BOOSTER.hatchY0 + 11, Y1 = bodyBot + BOOSTER.hatchY1 + 11;
  if (s.hatch === 0) {
    rect(X0, Y0, X1 - X0, 1, b.ink(PAL.N0)); rect(X0, Y1, X1 - X0, 1, b.ink(PAL.N0));
    rect(X0, Y0, 1, Y1 - Y0, b.ink(PAL.N0)); rect(X1, Y0, 1, Y1 - Y0 + 1, b.ink(PAL.N0));
    for (let y = Y0 + 3; y < Y1; y += 8) { b.set(X0 + 2, y, PAL.C6); b.set(X1 - 2, y, PAL.N2); }
    rect(X0 + 3, Y0 + 24, 3, 2, b.ink(PAL.N0));
  } else {
    // interior: warm cabin light, falling off toward the back
    for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
      const d = (x - X0) / (X1 - X0) + (Y1 - y) / (Y1 - Y0) * 0.3 + (bayer(x, y) - 0.5) * 0.18;
      b.set(x, y, d < 0.35 ? PAL.W4 : d < 0.6 ? PAL.W3 : d < 0.85 ? PAL.W2 : PAL.W1);
    }
    // frame lip
    rect(X0 - 1, Y0 - 1, X1 - X0 + 3, 1, b.ink(PAL.N0)); rect(X0 - 1, Y1 + 1, X1 - X0 + 3, 1, b.ink(PAL.N0));
    rect(X1 + 1, Y0 - 1, 1, Y1 - Y0 + 3, b.ink(PAL.N0));
    rect(X0, Y0, X1 - X0 + 1, 1, b.ink(PAL.W5));
    // the door: hinged on the left edge, swung out toward camera (1 = cracked, 2 = open)
    const dw = s.hatch === 1 ? 3 : 8;
    for (let y = Y0 - 2; y <= Y1 + 2; y++)
      for (let i = 0; i < dw; i++) {
        const x = X0 - 1 - i;
        const skew = Math.floor((i * (y - Y0)) / (Y1 - Y0) / 2);
        const yy = y - (i >> 2) + skew * 0;
        b.set(x, yy, i === dw - 1 ? PAL.N0 : i === 0 ? PAL.G4 : (i + y) % 9 === 0 ? PAL.G2 : PAL.G3);
      }
    rect(X0 - dw - 1, Y0 - 3, dw + 1, 1, b.ink(PAL.N0));
  }
  // ---- engine bell
  for (let j = 0; j < bellH; j++) {
    const w = 8 + Math.round(j * 0.45), y = bodyBot + j;
    for (let x = cx - w; x <= cx + w; x++) {
      const u = (x - cx) / w;
      b.set(x, y, Math.abs(u) > 0.9 ? PAL.N0 : u < -0.3 ? PAL.G2 : u < 0.4 ? PAL.N3 : PAL.W2);
    }
  }
  const thr = s.burn >= 0 ? PAL.W9 : s.burn === -2 ? PAL.W5 : PAL.N1;
  rect(cx - 9, baseY - 1, 19, 1, b.ink(thr));
  if (s.burn >= 0) {
    const plumes = [
      ['.WWWWWWWWWWWWWWWWW.', '..YYYYYYYYYYYYYYY..', '...YYyyyyyyyyyYY...', '....yyyyyyyyyyy....', '.....yyooooooyy....', '......oooooooo.....', '.......oo.oo.o.....', '........o..o.......'],
      ['WWWWWWWWWWWWWWWWWWW', '.YYYYYYYYYYYYYYYYY.', '..YYyyyyyyyyyyyYY..', '...yyyyyyyyyyyyy...', '....yyyoooooyyy....', '.....ooooooooo.....', '......o.oooo.o.....', '.......o....o......'],
      ['.WWWWWWWWWWWWWWWWW.', '.YYYYYYYYYYYYYYYYY.', '..YYYyyyyyyyyyYYY..', '...yyyyyyyyyyyyy...', '....yyyyooooyyy....', '.....yoooooooo.....', '.......oo.o.oo.....', '......o...o........'],
    ];
    const pc: Record<string, number> = {W: PAL.W9, Y: PAL.W8, y: PAL.W6, o: PAL.W4};
    plumes[s.burn % 3].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (pc[r[i]]) { b.set(cx - 9 + i, baseY + j, pc[r[i]]); b.set(cx - 9 + i, baseY + j + 8, r[i] === 'o' ? PAL.W3 : pc[r[i]] === PAL.W9 ? PAL.W7 : PAL.W4); } });
  }
};
const clampN = (v: number, a: number, b2: number) => (v < a ? a : v > b2 ? b2 : v);

/** hatch rectangle in buffer coords for a booster drawn at (cx, by) with lift */
export const boosterHatch = (cx: number, by: number, s: BoosterState) => {
  const bodyBot = by - s.lift + (s.squat ? 2 : 0) - BOOSTER.bellH;
  return {x0: cx + BOOSTER.hatchX0, x1: cx + BOOSTER.hatchX1, y0: bodyBot + BOOSTER.hatchY0 + 11, y1: bodyBot + BOOSTER.hatchY1 + 11};
};

// ================================================================== the novelty check
export const CHECK_W = 60, CHECK_H = 22;
/** Novelty check. `ledger` = the 4-frame LEDGER flash (money): it remaps and shows what was received. */
export const checkImg = (ledger = false): Img => {
  const img = newImg(CHECK_W, CHECK_H);
  const paper = ledger ? 0x4f6f55 : PAL.P2, shade = ledger ? 0x16251d : PAL.P1, ink = ledger ? 0xe3dcc0 : PAL.N3, line = ledger ? 0xe3dcc0 : PAL.P0;
  for (let y = 0; y < CHECK_H; y++) for (let x = 0; x < CHECK_W; x++) {
    const edge = x === 0 || y === 0 || x === CHECK_W - 1 || y === CHECK_H - 1;
    const border = x === 2 || y === 2 || x === CHECK_W - 3 || y === CHECK_H - 3;
    let c = edge ? PAL.N0 : border ? (ledger ? 0xe3dcc0 : PAL.W5) : y > CHECK_H - 7 ? shade : paper;
    if (ledger && !edge && !border && y % 3 === 0) c = 0x16251d; // ledger line-screen
    putPx(img, x, y, c);
  }
  if (ledger) {
    microImg(img, 'RECEIVED:', 5, 5, ink);
    microImg(img, '$133M', 5, 12, ink);
  } else {
    // bank line + payee scribbles (not text), the amount (must read), the signature squiggle
    for (let x = 5; x < 20; x++) putPx(img, x, 5, line);
    for (let x = 40; x < 55; x++) putPx(img, x, 5, line);
    const amt = '$1,000,000,000*';
    microImg(img, amt, Math.round((CHECK_W - microWidth(amt)) / 2), 9, ink);
    for (let x = 38; x < 55; x++) putPx(img, x, 17 + Math.round(Math.sin(x * 0.9) * 1), PAL.N4);
    for (let x = 5; x < 22; x++) putPx(img, x, 17, line);
  }
  return img;
};

// ================================================================== conversation portrait (112 x 136)
// Upgraded copy of the approved pixeladv portrait (src/dev/pixeladv/art/portraits.ts): same planes and
// light, plus a jaw-clench mouth and a check-flash phone screen. Acting = replacement parts + nudges.
export const PORTRAIT_W = 112, PORTRAIT_H = 136;
const PW = PORTRAIT_W, PH = PORTRAIT_H;
const shift = shiftPrim;
const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
export interface NolePortrait { mouth: 0 | 1 | 2 | 3 | 4; jab: 0 | 1 | 2; blink: 0 | 1 | 2; brow: 0 | 1; dip: number; screen?: 'post' | 'check'; }

const nolePortraitFig = (s: NolePortrait): FigureDef => {
  const dx = -s.dip, dy = s.dip; // head dips toward Mas on the accents
  const H = (...pts: number[]) => shift(P.poly(...pts), dx, dy);
  const HL = (x0: number, y0: number, x1: number, y1: number) => shift(P.line(x0, y0, x1, y1), dx, dy);
  const jx = s.jab === 1 ? -5 : s.jab === 2 ? -2 : 0, jy = s.jab === 1 ? -3 : s.jab === 2 ? -1 : 0;
  const J = (...pts: number[]) => shift(P.poly(...pts), jx, jy);
  const parts: Part[] = [
    // black tee — broad shoulders that fill the frame
    {group: 'torso', mat: 'tee', tone: 1, prims: [P.poly(0, 136, 0, 116, 10, 108, 26, 102, 44, 97, 62, 103, 80, 98, 96, 102, 108, 109, 112, 113, 112, 136)]},
    // thick neck
    {group: 'neck', mat: 'skin', tone: 1, prims: [P.poly(46 + dx, 76 + dy, 47, 100, 62, 105, 79, 100, 80 + dx, 64 + dy, 74 + dx, 70 + dy)]},
    {group: 'collar', mat: 'collar', tone: 2, prims: [P.poly(41, 95, 50, 99, 62, 102, 79, 96, 83, 96, 81, 100, 62, 107, 48, 103)]},
    // head (skull + square jaw + profile features on the left)
    {group: 'head', mat: 'skin', tone: 2, prims: [H(
      40, 24, 36, 31, 34, 37, 33, 40, 35, 43, 33, 50, 29, 55, 27, 58, 29, 61, 33, 62, 35, 64, 34, 67, 36, 70, 35, 73, 37, 77, 37, 81,
      41, 84, 52, 84, 62, 80, 71, 74, 76, 68, 80, 60, 84, 50, 85, 36, 72, 26)]},
    // ear
    {group: 'head', mat: 'skin', tone: 2, prims: [H(72, 44, 77, 42, 81, 45, 82, 52, 80, 60, 76, 64, 72, 62, 71, 53)]},
    // swept-back hair, dark, with a high hairline
    {group: 'hair', mat: 'hair', tone: 1, prims: [H(
      40, 26, 41, 19, 48, 12, 59, 8, 72, 7, 83, 11, 90, 18, 93, 29, 93, 41, 90, 50, 85, 57, 83, 48, 80, 41, 75, 40, 71, 44, 69, 48, 67, 39, 64, 31, 56, 27, 48, 26)]},
    // phone hand (jabbing toward Mas / camera-left)
    {group: 'hand', mat: 'skin', tone: 2, prims: [J(1, 96, 5, 86, 12, 81, 22, 82, 27, 88, 26, 99, 20, 109, 10, 117, 1, 119)]},
    {group: 'phone', mat: 'phone', tone: 1, prims: [J(6, 57, 22, 56, 24, 88, 8, 89)]},
    {group: 'fingers', mat: 'skin', tone: 2, prims: [J(21, 68, 26, 67, 27, 72, 22, 73), J(22, 74, 27, 73, 28, 78, 23, 79), J(22, 80, 27, 79, 28, 84, 23, 86)]},
    {group: 'thumb', mat: 'skin', tone: 3, prims: [J(4, 84, 8, 74, 12, 74, 11, 86)]},
  ];
  const adjust: Adjust[] = [
    // ---- hair: swept strands (lighter) toward back-top, cyan catch on the front crown
    plane('hair', 2, H(42, 24, 50, 14, 60, 10, 58, 14, 48, 22), H(56, 26, 66, 12, 76, 10, 68, 16, 62, 26)),
    plane('hair', 3, HL(44, 22, 52, 14), HL(50, 24, 60, 13), HL(62, 25, 72, 12), HL(70, 28, 82, 15)),
    plane('hair', 4, HL(45, 20, 50, 15), HL(43, 23, 45, 21)),
    plane('hair', 0, H(80, 40, 86, 36, 88, 48, 85, 56, 83, 48)),
    // ---- face: lit front planes (cyan key from camera-left)
    plane('skin', 3, H(40, 24, 36, 31, 34, 37, 33, 40, 35, 43, 33, 50, 29, 55, 27, 58, 29, 61, 33, 62, 35, 64, 34, 67, 36, 70, 35, 73, 37, 77, 37, 81, 41, 84, 47, 84, 46, 76, 44, 70, 45, 62, 44, 54, 44, 46, 47, 40, 51, 33, 54, 27)),
    plane('skin', 4, H(40, 25, 37, 31, 36, 36, 42, 36, 46, 30, 49, 26), H(35, 43, 32, 51, 29, 56, 28, 58, 31, 58, 35, 52, 38, 45), H(39, 49, 44, 48, 45, 53, 40, 55), H(37, 76, 38, 80, 42, 83, 43, 78), H(35, 63, 38, 63, 37, 65)),
    plane('skin', 5, HL(29, 57, 30, 57), HL(39, 28, 41, 28), HL(41, 50, 42, 50)),
    // ---- shadows (mauve), deepest under the jaw
    plane('skin', 1, H(47, 40, 60, 38, 64, 40, 50, 42)), // under-brow socket
    plane('skin', 1, H(45, 42, 48, 42, 48, 46, 46, 46)), // inner corner
    plane('skin', 1, H(37, 46, 41, 50, 41, 58, 38, 61, 35, 61)), // nose side
    plane('skin', 1, H(57, 56, 66, 52, 70, 58, 63, 64)), // under cheekbone
    plane('skin', 1, H(62, 66, 72, 61, 76, 67, 70, 74, 61, 80, 55, 82)), // jaw side
    plane('skin', 1, H(66, 36, 72, 40, 72, 60, 66, 56)), // side of head
    plane('skin', 1, H(29, 61, 33, 62, 36, 64, 31, 64)), // under nose
    plane('skin', 1, H(36, 73, 43, 73, 42, 75, 37, 76)), // under lip
    plane('skin', 0, H(46, 84, 62, 81, 73, 73, 79, 70, 79, 79, 62, 89, 48, 88)), // under jaw on neck
    plane('skin', 3, P.poly(47, 88, 51, 88, 52, 100, 48, 99)), // neck front catches light
    plane('skin', 1, H(75, 47, 78, 48, 78, 56, 76, 58)), // inner ear
    plane('skin', 0, H(76, 50, 77, 50, 77, 54, 76, 54)),
    plane('skin', 3, H(72, 45, 74, 44, 74, 60, 72, 60)),
    // ---- tee: lit chest plane, fold
    plane('tee', 3, P.poly(12, 108, 42, 99, 46, 102, 20, 113, 8, 120)),
    plane('tee', 2, P.poly(20, 114, 46, 103, 52, 110, 30, 124)),
    plane('tee', 0, P.line(88, 103, 94, 136), P.line(62, 108, 66, 136)),
    // ---- hand: knuckles lit by the phone glow
    plane('skin', 4, J(6, 86, 11, 81, 16, 81, 10, 88), J(22, 69, 25, 68, 25, 70), J(23, 75, 26, 74, 26, 76)),
    plane('skin', 1, J(14, 100, 24, 92, 26, 99, 20, 109, 12, 112)),
    plane('skin', 1, J(21, 73, 26, 73, 26, 74, 21, 74), J(22, 79, 27, 79, 27, 80, 22, 80)),
  ];
  const lid = s.blink;
  const nearEye = lid === 2
    ? ['...........', '...........', '.LLLLLLLLL.', '..kkkkkkk..']
    : lid === 1
      ? ['...........', '..LLLLLLLL.', '.LLLLLLLLLL', '..wIIiwwk..']
      : ['..LLLLLLLLL.', '.LwIIgiwwwwL', '.LwIIIiwwwL.', '...kkkkkkk..'];
  const nearBrow = s.brow ? ['..bbbbbbbbb..', 'bbbbbbbbbbbbb', 'b..........bb'] : ['.............', '..bbbbbbbbbb.', 'bbbbbbbbbbbbb'];
  const farEye = lid === 2 ? ['.....', 'LLLL.', '.kk..'] : ['.LLL.', 'LIIw.', '.kk..'];
  const mouths: Record<number, string[]> = {
    0: ['..........r', 'mmmmmmmmmm.', '.lllllll...'],
    1: ['...........', 'mmmmmmmmmmm', 'mtTTTTTTtm.', '.llllllll..'],
    2: ['...........', 'mmmmmmmmmm.', 'mtTTTTTTm..', 'mdddddddm..', '.mdgggdm...', '..lllll....'],
    3: ['...........', '...mmmmm...', '..mdddddm..', '..mddddm...', '...llll....'],
    // 4: the smirk (NAMED IT.) — one corner up, lips pressed
    4: ['........mr.', 'mmmmmmmmm..', '.lllllll...'],
  };
  const stamps: Stamp[] = [
    {x: 47 + dx, y: 35 + dy - (s.brow ? 1 : 0), rows: nearBrow, pal: {b: PAL.N0}},
    {x: 34 + dx, y: 38 + dy - (s.brow ? 1 : 0), rows: ['.bbbb', 'bbbb.'], pal: {b: PAL.N0}},
    {x: 49 + dx, y: 42 + dy, rows: nearEye, pal: {L: PAL.N0, w: PAL.K2, i: PAL.C3, I: PAL.N0, g: PAL.C8, k: PAL.S1}},
    {x: 36 + dx, y: 43 + dy, rows: farEye, pal: {L: PAL.N0, w: PAL.K2, I: PAL.N0, k: PAL.S1}},
    {x: 31 + dx, y: 60 + dy, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 35 + dx, y: 65 + dy, rows: mouths[s.mouth], pal: {m: PAL.S0, l: PAL.X2, t: PAL.K3, T: PAL.K4, d: PAL.N0, g: PAL.S2, r: PAL.X1}},
    // phone screen: a glowing post (avatar, a line, a big "NAME" card)
    {x: 8 + jx, y: 59 + jy, rows: [
      'ccccccccccccc',
      'cAAcwwwwwwccc',
      'cAAcwwwcccccc',
      'ccccccccccccc',
      'cbbbbbbbbbccc',
      'cbbbbbbcccccc',
      'ccccccccccccc',
      'cYYYYYYYYYYYc',
      'cYWWWWWWWWWYc',
      'cYWRRRRRRRWYc',
      'cYWWWWWWWWWYc',
      'cYYYYYYYYYYYc',
      'ccccccccccccc',
      'cbbbbbbbccccc',
      'cbbbbcccccccc',
      'ccccccccccccc',
      'ccrrrcccHHccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
    ].map((r, j) => (j > 21 ? r.replace(/c/g, 'e') : r)), pal: {c: PAL.C7, e: PAL.C6, A: PAL.W6, w: PAL.N3, b: PAL.C4, Y: s.screen === 'check' ? PAL.W5 : PAL.C5, W: s.screen === 'check' ? PAL.P2 : PAL.C9, R: s.screen === 'check' ? PAL.N3 : PAL.N2, r: PAL.R3, H: PAL.C4}},
  ];
  return {w: PW, h: PH, parts, adjust, stamps};
};

const NOLE_RIG: LightRig = {
  key: [-0.95, -0.3], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['collar'],
  back: [1, -0.35], backBand: 2,
  backRamp: {skin: PAL.W6, hair: PAL.W5, tee: PAL.W3, phone: PAL.W4},
  ramps: {
    skin: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.K1, PAL.C5],
    tee: [PAL.N0, PAL.N0, PAL.N1, PAL.C0, PAL.C1, PAL.C3],
    collar: [PAL.N0, PAL.N0, PAL.N2, PAL.C0, PAL.C1, PAL.C3],
    phone: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.C4],
  },
};

const bgNole = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const bz = bayer(x, y);
      const u = x / w;
      let c: number = PAL.N1;
      if (u > 0.8) c = u > 0.9 ? (bz < 0.5 ? PAL.W5 : PAL.W4) : bz < (u - 0.8) / 0.1 ? PAL.W4 : PAL.W2;
      else if (u > 0.66) c = bz < (u - 0.66) / 0.14 ? PAL.W2 : PAL.W1;
      else if (u > 0.55) c = bz < (u - 0.55) / 0.11 ? PAL.W1 : PAL.N1;
      if (x >= w - 12 && x < w - 9) c = PAL.W1; // door jamb
      b.set(x0 + x, y0 + y, c);
    }
};

const nCache = new Map<string, Img>();
export const nolePortraitImg = (s: NolePortrait) => {
  const k = JSON.stringify(s);
  let v = nCache.get(k);
  if (!v) { v = renderFigure(nolePortraitFig(s), NOLE_RIG); nCache.set(k, v); }
  return v;
};
export const NOLE_PORTRAIT_REST: NolePortrait = {mouth: 0, jab: 0, blink: 0, brow: 0, dip: 0};
/** Draw the portrait (background + figure) into a window at (x, y). */
export const drawNolePortrait = (b: Buf, x: number, y: number, s: NolePortrait) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + PW && py < y + PH;
  bgNole(b, x, y, PW, PH);
  blitImg(b, nolePortraitImg(s), x, y, {clip});
};
