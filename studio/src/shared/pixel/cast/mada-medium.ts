// MR. MAS — cast: MADA at MEDIUM / TWO-SHOT scale (Ep1 act 4 draft 3.1; new file, owned by the act-4 medium-tier artist).
// pov-and-framing §4.1 `[M]`/`[2S]`: waist-up, seated in the bolted chair, arms folded, perfectly still; the spinner
// over his head. Used in 27.11-27.36 (the [2S] with NELEH), 30.09 (his [M] among the fires) and the calm-off
// (30.14-30.17, the [2S] with MAS: the episode's one long hold).
// The head is the APPROVED PORTRAIT's geometry (cast/mada.ts portraitFig: head, hair, ears, neck, rib; copied here
// verbatim 2026-09-25 because it is not exported), re-rasterized at half size (medium-kit scaleParts: vector geometry,
// never a scaled sprite). Every face feature is hand-placed at medium size: the rectangular frames, the level
// eyes, the straight low brows (they never move), the six mouths, three lids, the eye dart, the one-pixel 'tell'.
//   heads (3 drawings)  'front' the poker face to the lens (default) · '34' turned toward camera-left (to MAS across
//                       the table, to NELEH) · 'down' at the blueprint (27.35)
//   nod                 0 | 1 | 2: the head drops a whole pixel, then two (30.17: "He nods once." = 0,1,2,1,0 on 2s)
//   arms (4 drawings)   'fold' arms folded across his middle (the signature; default) · 'rest' both forearms flat on
//                       the table · 'clasp' hands together on the table · 'take' his camera-left hand forward on the
//                       table at the term sheet (30.17: Terb hands it to both at once), the other still folded under
//   lights              'room' the boardroom pendant (a cool top key, the window's night behind) · 'fire' the same
//                       key with the burning room's warm kiss on his edges (sc 30)
//   chair               the high-backed bolted chair behind him (true by default: it's his signature)
// Authored facing camera (front) with his '34' turned camera-left; flip mirrors the whole drawing.
// DRAW ORDER: madaMediumBack -> the plate's table top over rows >= MADA_M_TABLE -> madaMediumFront (forearms on the
// table: 'rest' / 'clasp' / 'take'; 'fold' has nothing in front). The spinner is UI over the world: drawMadaMedium
// paints it last, at MADA_M_SPIN (local), with the nod.
import {Buf} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure} from '../figure';
import {memo, shiftPrim} from './kit';
import {Viseme} from './talk';
import {drawSpinner} from './mada';
import {scaleParts, scaleAdjust, dartRows, rigPoint, handParts, sleeveParts, HandSpec, V2} from './medium-kit';

export const MADA_MW = 76;
export const MADA_MH = 104;
/** local row of the table top's FAR edge: the plate paints its top over the BACK image from here down */
export const MADA_M_TABLE = 80;
/** the spinner's centre (local), above his head (it moves with the nod) */
export const MADA_M_SPIN: [number, number] = [38, 3];
/** his face (the eye line), for eyelines */
export const MADA_M_FACE: [number, number] = [38, 29];
const K = 0.5, OX = 10, OY = 5;

export type MadaMHead = 'front' | '34' | 'down';
export type MadaMArm = 'fold' | 'rest' | 'clasp' | 'take';
export type MadaMLight = 'room' | 'fire';
export interface MadaMediumState {
  head: MadaMHead;
  mouth: Viseme;
  lid: 0 | 1 | 2;
  /** eye dart: -1 camera-left, 0 centre, 1 camera-right */
  look: -1 | 0 | 1;
  nod: 0 | 1 | 2;
  arm: MadaMArm;
  light: MadaMLight;
  chair: boolean;
}
export const MADA_MEDIUM_DEFAULT: MadaMediumState = {head: 'front', mouth: 'rest', lid: 0, look: 0, nod: 0, arm: 'fold', light: 'room', chair: true};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ------------------------------------------------------------------ the portrait's head geometry (portrait space)
// copied from cast/mada.ts portraitFig (parts: neck, rib, ears, head, hair; adjust: face, neck, ears, hair). `fx` is
// the '34' feature shift (portrait px, toward camera-left) applied to the face planes only; `n` the nod.
const headGeo = (jaw: number, n: number, fx: number) => {
  const H = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + n + (v >= 76 ? jaw : 0) : v)));
  const F = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + n + (v >= 76 ? jaw : 0) : v + fx)));
  const HL = (x0: number, y0: number, x1: number, y1: number) => P.line(x0, y0 + n, x1, y1 + n);
  const FL = (x0: number, y0: number, x1: number, y1: number) => P.line(x0 + fx, y0 + n, x1 + fx, y1 + n);
  const HE = (cx: number, cy: number, rx: number, ry: number) => P.ell(cx, cy + n, rx, ry);
  const parts: Part[] = [
    {group: 'neck', mat: 'neck', tone: 3, prims: [P.poly(45, 80, 45, 98, 56, 102, 67, 98, 67, 80)]},
    {group: 'rib', mat: 'rib', tone: 2, prims: [P.poly(42, 96, 50, 94, 56, 99, 62, 94, 70, 96, 67, 101, 56, 105, 45, 101)]},
    // '34': the near (camera-left) ear turns behind the cheek; the far one stays
    {group: 'ears', mat: 'skinD', tone: 3, prims: fx ? [HE(79, 55, 3.4, 6)] : [HE(33.5, 55, 3.2, 6), HE(79, 55, 3, 6)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [H(35, 40, 36, 30, 40, 24, 48, 20, 56, 19, 64, 20, 72, 24, 76, 30, 77, 40, 77, 52, 76, 62, 73, 71, 68, 79, 62, 84, 56, 86, 50, 84, 44, 79, 39, 71, 36, 62, 35, 52)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [H(33, 46, 33, 34, 37, 25, 44, 18, 52, 15, 60, 15, 68, 17, 75, 22, 79, 30, 80, 42, 78, 47, 77, 38, 74, 31, 66, 28, 58, 27, 50, 28, 43, 30, 38, 35, 36, 44)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, F(42, 33, 50, 30, 62, 30, 70, 33, 64, 35, 50, 35), F(55, 50, 58, 50, 58, 64, 55, 64), F(41, 58, 45, 57, 44, 59), F(67, 57, 71, 58, 68, 59)),
    plane('skin', 5, FL(50, 31, 61, 31), FL(56, 52, 56, 60)),
    // the sides turn: on '34' the camera-left side narrows to a sliver and the far (camera-right) cheek widens
    plane('skin', 2, fx ? H(35, 44, 37, 44, 38, 58, 36, 60) : H(35, 44, 38, 44, 40, 60, 42, 72, 38, 68, 35, 58), fx ? H(70, 42, 77, 44, 77, 58, 74, 68, 69, 74, 69, 58) : H(74, 44, 77, 44, 77, 58, 74, 68, 71, 72, 72, 60)),
    toMat('skin', 'skinD', 2, H(39, 71, 44, 78, 50, 83, 56, 85, 62, 83, 68, 78, 73, 71, 70, 79, 63, 86, 56, 88, 49, 86, 42, 79)),
    plane('skin', 2, F(41, 46, 52, 45, 53, 48, 41, 49), F(60, 45, 71, 46, 71, 49, 60, 48)),
    plane('skin', 2, F(58, 52, 60, 54, 61, 64, 58, 66)),
    toMat('skin', 'skinD', 3, F(52, 65, 61, 65, 60, 68, 53, 68)),
    plane('skin', 2, F(50, 79, 62, 79, 60, 81, 52, 81)),
    plane('skin', 4, F(52, 81, 60, 81, 59, 84, 53, 84)),
    plane('neck', 0, P.poly(45, 83 + n, 50, 87 + n, 56, 89 + n, 62, 87 + n, 67, 83 + n, 67, 88 + n, 56, 91 + n, 45, 88 + n)),
    plane('neck', 2, P.poly(60, 90, 67, 86, 67, 98, 60, 100)),
    toMat('skinD', 'skinD', 1, HE(79, 56, 1.3, 3.5)),
    plane('hair', 3, H(42, 24, 50, 19, 58, 18, 52, 21, 45, 26), H(62, 18, 70, 20, 64, 21)),
    plane('hair', 4, HL(47, 20, 54, 18)),
    plane('hair', 1, HL(60, 17, 64, 27), H(33, 38, 36, 32, 36, 46, 33, 46), H(78, 32, 80, 40, 79, 47, 77, 40)),
    plane('hair', 0, HL(61, 16, 62, 22)),
  ];
  return {parts, adjust};
};

// ------------------------------------------------------------------ the medium-native body (local coords)
const bodyParts = (s: MadaMediumState): Part[] => {
  const parts: Part[] = [];
  if (s.chair) parts.push(
    // the high-backed executive chair: its padded back rises behind his shoulders (bolted: it never moves)
    {group: 'chair', mat: 'chair', tone: 2, prims: [P.poly(12, 104, 11, 44, 14, 32, 22, 26, 38, 24, 54, 26, 62, 32, 65, 44, 64, 104)]},
  );
  parts.push(
    // grey crew-neck sweater: sloped shoulders, straight down to the table (a neutral figure)
    {group: 'torso', mat: 'sw', tone: 2, prims: [P.poly(16, 104, 15, 70, 17, 61, 23, 56, 30, 53, 38, 52.5, 46, 53, 53, 56, 59, 61, 61, 70, 60, 104)]},
  );
  return parts;
};
const bodyAdjust = (s: MadaMediumState): Adjust[] => [
  // the chair: its quilted seams, the pendant's top light along its crown, the dark core behind him
  ...(s.chair ? [plane('chair', 3, P.poly(15, 33, 22, 27, 38, 25, 54, 27, 61, 33, 54, 29, 38, 27, 22, 29)), plane('chair', 1, P.line(18, 40, 18, 100), P.line(58, 40, 58, 100)), plane('chair', 4, P.line(24, 26, 50, 26))] : []),
  // the pendant from above: the shoulders' tops lit, a hot line; the arms' outer edges and the sides turn away
  plane('sw', 3, P.poly(15, 61, 22, 56, 30, 53.5, 36, 53, 30, 55.5, 22, 58.5, 16, 64), P.poly(61, 61, 54, 56, 46, 53.5, 40, 53, 46, 55.5, 54, 58.5, 60, 64)),
  plane('sw', 4, P.line(19, 58, 27, 54), P.line(57, 58, 49, 54)),
  plane('sw', 1, P.poly(13, 70, 16, 66, 17, 104, 14, 104), P.poly(63, 70, 60, 66, 59, 104, 62, 104)),
  // fold lines toward the folded arms
  plane('sw', 1, P.line(28, 58, 25, 64), P.line(48, 58, 51, 64)),
];

// the folded arms at medium size (local coords): the far forearm (his left, camera-right) lies ON TOP across his
// middle, its hand tucked over the near upper arm; the near forearm runs under it, only the fingertips showing
const foldParts = (): Part[] => [
  {group: 'uarmN', mat: 'sw', tone: 2, prims: [P.poly(13, 62, 18, 60, 22, 64, 23, 74, 20, 80, 13, 80)]},
  {group: 'uarmF', mat: 'sw', tone: 2, prims: [P.poly(63, 62, 58, 60, 54, 64, 53, 74, 56, 80, 63, 80)]},
  {group: 'farmU', mat: 'sw', tone: 2, prims: [P.poly(17, 80, 19, 76, 30, 75, 44, 76, 52, 78, 54, 80)]},
  {group: 'tipsU', mat: 'skin', tone: 3, prims: [P.poly(51, 71, 55, 70, 57, 72, 55, 75, 51, 74)]},
  {group: 'farmO', mat: 'sw', tone: 3, prims: [P.poly(60, 80, 58, 74, 49, 71, 36, 70, 26, 70, 21, 69.5, 21, 76, 28, 77, 38, 78, 50, 78.5, 56, 80)]},
  {group: 'cuffO', mat: 'rib', tone: 3, prims: [P.poly(21, 69.5, 23.5, 69.5, 23.5, 76, 21, 76)]},
  {group: 'handO', mat: 'skin', tone: 3, prims: [P.poly(15, 69.5, 18, 67.5, 22, 68.5, 22, 75.5, 18, 76.5, 15, 74.5)]},
];
const foldAdjust = (): Adjust[] => [
  plane('sw', 4, P.poly(24, 70.5, 36, 70.5, 49, 71.5, 56, 74, 49, 72.5, 36, 71.5, 24, 71.5)),
  plane('sw', 5, P.line(26, 70, 36, 70)),
  plane('sw', 1, P.poly(24, 76, 38, 77.5, 52, 78.5, 56, 80, 38, 79, 24, 77)),
  plane('sw', 1, P.line(53, 73, 55, 77)),
  // the arms throw a shadow on the sweater just above them
  plane('sw', 1, P.poly(21, 67.5, 38, 67, 54, 68.5, 54, 70, 38, 69, 21, 69)),
  plane('skin', 4, P.line(16, 70, 18, 68.5)),
  plane('skin', 2, P.line(16, 72, 21, 72), P.line(16, 74, 21, 74), P.line(52, 73, 56, 73)),
];

// forearms on the table (the FRONT layer): medium-kit sleeves + hands, lit from above (the pendant)
const LIT: V2 = [-0.3, -0.95];
interface APose { L?: {elbow: V2; wrist: V2; hand: HandSpec}; R?: {elbow: V2; wrist: V2; hand: HandSpec} }
const ARMS: Record<Exclude<MadaMArm, 'fold'>, APose> = {
  rest: {
    L: {elbow: [17, 82], wrist: [26, 91], hand: {at: [26, 91], dir: [0.6, 1], thumb: -1, len: 10, width: 8, curl: 0.3}},
    R: {elbow: [59, 82], wrist: [50, 91], hand: {at: [50, 91], dir: [-0.6, 1], thumb: 1, len: 10, width: 8, curl: 0.3}},
  },
  clasp: {
    L: {elbow: [18, 82], wrist: [30, 90], hand: {at: [30, 90], dir: [1, 0.3], thumb: -1, len: 10, width: 8, curl: 0.45, noThumb: true}},
    R: {elbow: [58, 82], wrist: [46, 90], hand: {at: [46, 90], dir: [-1, 0.3], thumb: 1, len: 10, width: 8, curl: 0.45, thumbOut: 0.1}},
  },
  take: {
    // his camera-left hand out on the table at the term sheet's corner; the right forearm stays folded under
    L: {elbow: [17, 82], wrist: [16, 94], hand: {at: [16, 94], dir: [-0.15, 1], thumb: -1, len: 10, width: 8, curl: 0.2, thumbOut: 0.25}},
  },
};
const armBuild = (arm: MadaMArm) => {
  const parts: Part[] = [], adjust: Adjust[] = [];
  const out: {L?: V2; R?: V2} = {};
  if (arm === 'fold') return {parts, adjust, out};
  const A = ARMS[arm];
  for (const side of ['L', 'R'] as const) {
    const s = A[side];
    if (!s) continue;
    const sv = sleeveParts('fore' + side, s.elbow, s.wrist, {w0: 10, w1: 8, mat: 'sw', lit: LIT});
    const hd = handParts('hand' + side, s.hand, 'skin', LIT);
    parts.push(...sv.parts, ...hd.parts); adjust.push(...sv.adjust, ...hd.adjust);
    out[side] = hd.tip;
  }
  return {parts, adjust, out};
};
/** hand anchors (local): the middle fingertip of each hand on the table */
export const MADA_M_HAND: Record<Exclude<MadaMArm, 'fold'>, {L?: [number, number]; R?: [number, number]}> = (() => {
  const o: Record<string, {L?: [number, number]; R?: [number, number]}> = {};
  for (const k of ['rest', 'clasp', 'take'] as const) {
    const b = armBuild(k).out;
    o[k] = {L: b.L ? [Math.round(b.L[0]), Math.round(b.L[1])] : undefined, R: b.R ? [Math.round(b.R[0]), Math.round(b.R[1])] : undefined};
  }
  return o as Record<Exclude<MadaMArm, 'fold'>, {L?: [number, number]; R?: [number, number]}>;
})();

// ------------------------------------------------------------------ the face at medium size (local coords)
// L lid · w white · i iris · I pupil · g glint · k lower lid · f frames · G lens glint · b brow · o nostril · mouth
// one row inside the lens: the frame's top bar doubles as the (low, patient) upper lid
const EYE: Record<0 | 1 | 2, string[]> = {
  0: ['wiIw', '.kk.'],
  1: ['LLLL', 'wiIw'],
  2: ['LLLL', 'kkkk'],
};
const MOUTH: Record<Viseme, string[]> = {
  rest: ['.......', 'mmmmmmm', '.lllll.'],
  // the tell: one pixel, one corner. Use it once.
  smile: ['......m', 'mmmmmm.', '.lllll.'],
  A: ['.......', 'mmmmmmm', 'mTTTTTm', '.mdddm.', '..lll..'],
  E: ['.......', 'mmmmmmm', 'mTTTTTm', '.mmmmm.', '..lll..'],
  O: ['.......', '..mmm..', '.mdddm.', '..mmm..', '...l...'],
  M: ['.......', 'mmmmmmm', '.MMMMM.', '.lllll.'],
};
const faceStamps = (s: MadaMediumState): Stamp[] => {
  const n = s.nod + (s.head === 'down' ? 1 : 0);
  const dx = s.head === '34' ? -3 : 0;
  const lid = s.head === 'down' ? (s.lid === 2 ? 2 : 1) : s.lid;
  const look = s.head === 'down' ? 0 : s.look;
  const eyePal = {L: PAL.N1, w: PAL.S6, i: PAL.B2, I: PAL.N0, g: PAL.P2, k: PAL.S2};
  const fr = {f: PAL.N0};
  const out: Stamp[] = [];
  if (s.head === '34') {
    // turned camera-left: the near lens narrows, the far (camera-right) lens and its temple arm to the ear show
    out.push(
      {x: 30 + dx, y: 26 + n, rows: ['bbbb'], pal: {b: PAL.B0}},
      {x: 37 + dx, y: 26 + n, rows: ['bbbbbbb'], pal: {b: PAL.B0}},
      {x: 30 + dx, y: 27 + n, rows: ['ffffff.ffffffff', 'f....fff......f', 'f....f.f......f', 'ffffff.ffffffff'], pal: fr},
      {x: 45 + dx, y: 28 + n, rows: ['fffff'], pal: fr},
      {x: 31 + dx, y: 28 + n, rows: dartRows(EYE[lid].map((r) => r.slice(1)), look), pal: eyePal},
      {x: 39 + dx, y: 28 + n, rows: dartRows(EYE[lid], look), pal: eyePal},
      {x: 38 + dx, y: 28 + n, rows: ['G'], pal: {G: PAL.G6}},
      {x: 35 + dx, y: 37 + n, rows: ['o...o'], pal: {o: PAL.S1}},
      {x: 35 + dx, y: 40 + n, rows: MOUTH[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0}},
    );
    return out;
  }
  out.push(
    // brows: straight, level, low. They never move.
    {x: 29, y: 26 + n, rows: ['bbbbbb'], pal: {b: PAL.B0}},
    {x: 40, y: 26 + n, rows: ['bbbbbb'], pal: {b: PAL.B0}},
    // the rectangular frames with a straight bridge and the temples back to the ears
    {x: 28, y: 27 + n, rows: ['ffffffff..ffffffff', 'f......ffff......f', 'f......f..f......f', 'ffffffff..ffffffff'], pal: fr},
    {x: 26, y: 28 + n, rows: ['ff'], pal: fr},
    {x: 46, y: 28 + n, rows: ['ff'], pal: fr},
    {x: 30, y: 28 + n, rows: dartRows(EYE[lid], look), pal: eyePal},
    {x: 41, y: 28 + n, rows: dartRows(EYE[lid], look), pal: eyePal},
    // a flat glint on each lens (office light)
    {x: 29, y: 28 + n, rows: ['G'], pal: {G: PAL.G6}},
    {x: 45, y: 28 + n, rows: ['G'], pal: {G: PAL.G6}},
    {x: 36, y: 37 + n, rows: ['o...o'], pal: {o: PAL.S1}},
    {x: 35, y: 40 + n, rows: MOUTH[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0}},
  );
  return out;
};

// ------------------------------------------------------------------ lights
const RAMPS: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  skinD: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B3],
  sw: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  rib: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G4, PAL.G5],
  chair: [PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N3, PAL.N4],
};
const rigFor = (light: MadaMLight): LightRig => ({
  key: [-0.35, -0.94], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'rib'],
  back: [0.95, -0.2], backBand: 1,
  backRamp: light === 'fire' ? {skin: PAL.W6, skinD: PAL.W5, hair: PAL.W3, sw: PAL.W5, chair: PAL.W2} : {skin: PAL.S4, skinD: PAL.S3, hair: PAL.G3, sw: PAL.G4, chair: PAL.C1},
  ramps: RAMPS,
});

// ------------------------------------------------------------------ the rig
const backFig = (s: MadaMediumState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const fx = s.head === '34' ? -6 : 0;
  const n = s.nod * 2 + (s.head === 'down' ? 2 : 0);
  const g = headGeo(jaw, n, fx);
  const head = scaleParts(g.parts, K, OX, OY);
  // '34': the whole head silhouette shifts a pixel toward camera-left with the features (the turn)
  const turn = (pt: Part): Part => (fx && ['head', 'hair', 'ears'].includes(pt.group) ? {...pt, prims: pt.prims.map((pr) => shiftPrim(pr, -1, 0))} : pt);
  const parts: Part[] = [...bodyParts(s), ...(s.arm === 'fold' ? [] : []), ...head.map(turn)];
  if (s.arm === 'fold' || s.arm === 'take') parts.push(...foldParts().filter((pt) => s.arm === 'fold' || pt.group !== 'handO'));
  const adjust: Adjust[] = [...bodyAdjust(s), ...scaleAdjust(g.adjust, K, OX, OY, true).map((a) => (fx && a.onlyMat !== 'neck' ? {...a, prims: a.prims.map((pr) => shiftPrim(pr, -1, 0))} : a))];
  if (s.arm === 'fold' || s.arm === 'take') adjust.push(...foldAdjust());
  return {w: MADA_MW, h: MADA_MH, parts, adjust, stamps: faceStamps(s)};
};
const frontFig = (s: MadaMediumState): FigureDef => {
  const a = armBuild(s.arm);
  return {w: MADA_MW, h: MADA_MH, parts: a.parts, adjust: a.adjust};
};
export const madaMediumBack = memo((s: MadaMediumState): Img => renderFigure(backFig(s), rigFor(s.light)));
export const madaMediumFront = memo((s: MadaMediumState): Img => renderFigure(frontFig(s), rigFor(s.light)));

export interface MadaMediumDraw {
  flip?: boolean;
  /** the plate's table top, painted between the BACK and the FRONT images */
  table?: (b: Buf) => void;
  /** spinner frame (freeze it to STOP); null / undefined = no spinner */
  spin?: number | null;
  stopped?: boolean;
  /** the one blue heart's spinner (27): 'blue' */
  spinCol?: 'grey' | 'blue';
  map?: (c: number, x: number, y: number) => number;
  mask?: Uint8Array;
}
/** Draw Mada at medium scale with his top-left at (x, y). */
export const drawMadaMedium = (b: Buf, x: number, y: number, s: MadaMediumState, o: MadaMediumDraw = {}) => {
  const put = (img: Img) => {
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (o.flip ? img.w - 1 - i : i)];
      if (v < 0) continue;
      const X = x + i, Y = y + j;
      b.set(X, Y, o.map ? o.map(v, X, Y) : v);
      if (o.mask && X >= 0 && Y >= 0 && X < b.w && Y < b.h) o.mask[Y * b.w + X] = 255;
    }
  };
  put(madaMediumBack(s));
  o.table?.(b);
  put(madaMediumFront(s));
  if (o.spin !== null && o.spin !== undefined) {
    const [sx, sy] = rigPoint({w: MADA_MW}, x, y, MADA_M_SPIN, o.flip);
    drawSpinner(b, sx, sy + s.nod, o.spin, {size: 'md', stopped: o.stopped, col: o.spinCol});
  }
};
/** frame coords of a hand anchor */
export const madaMediumHand = (x: number, y: number, arm: Exclude<MadaMArm, 'fold'>, side: 'L' | 'R', flip = false): [number, number] | null => {
  const p = MADA_M_HAND[arm][side];
  return p ? rigPoint({w: MADA_MW}, x, y, p, flip) : null;
};
