// MR. MAS — mdinner2: MAS at THE WOODROSE, the drawings this span needs.
// BASE DRAWINGS ARE A COPY of mdinner1's masdinner.ts (same head map, ramps, rig, arms, steeple, rim light),
// so Mas is the same sprite across the cut at f360. Added here, as whole-drawing swaps only:
//   grab / roll / scope   the scroll's tail: take it, roll it, raise the paper telescope to the eye
//   lift / sip            the water glass comes up; its line never moves
//   stand + upN / flick   standing (the torso continues behind the table), the hand reaches the neon N
//   hair 0 / 1 / 2        the booster's downdraft whips the cowlick; the face never moves
// If mdinner1 changes its base drawings, re-sync the COPY block (marked below).
import {PAL} from '../../shared/pixel/palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, renderFigure} from '../../shared/pixel/figure';
import {MAS_LEGEND} from '../../shared/pixel/cast/mas';
import {Legend, Ramps, memo, paint, seg, edgeLight, shiftPrim} from '../../shared/pixel/cast/kit';
import {CX} from '../../shared/pixel/cast/bosses';

// ============================================================ COPY (mdinner1/masdinner.ts, re-synced 2026-09-25 07:15: eye catchlights)
export const MASD_W = 66;
export const MASD_H = 64;
export const MASD_TABLE_EDGE = 46;
export const MASD_CX = 33;

const HEAD = [
  '...Gc.........',
  '..GcGh........',
  '..HgGghHHH....',
  '..HcGghhhhhH..',
  '.HcGghhhhhhhH.',
  '.HGgghhhhhhhhH',
  'HGgLLGghhhhhhH',
  'HlLLLLlmhhhhhH',
  'olLLLLlmmsshsH',
  'lbbblLmsbbbshs',
  'llllllmsssssos',
  'mlllllmssssssm',
  'olllllmssssss.',
  '.llllRosssss..',
  '.olllllssso...',
  '..olLlmmsso...',
  '...oolmsso....',
  '.....osss.....',
];
const HEAD_AT: [number, number] = [26, 8];
const eyes = (lid: number, look: number): Array<{at: [number, number]; rows: string[]}> =>
  lid === 2 ? [{at: [1, 10], rows: ['ooo']}, {at: [8, 10], rows: ['ooo']}]
    : lid === 1 ? [{at: [1, 9], rows: ['bbb', 'kkk']}, {at: [8, 9], rows: ['bbb', 'kkk']}]
      // one catchlight per eye (the candle, camera-left): the calm, unblinking read survives at room scale
      : [{at: [1, 10], rows: [look < 0 ? 'kjw' : look > 0 ? 'wjk' : 'jkw']}, {at: [8, 10], rows: [look < 0 ? 'kjx' : look > 0 ? 'xjk' : 'jkx']}];
type Mouth = 'rest' | 'smile' | 'open' | 'chew';
const MOUTH: Record<Mouth, {at: [number, number]; rows: string[]}> = {
  rest: {at: [4, 14], rows: ['nnn']},
  smile: {at: [4, 13], rows: ['...n', 'nnn.']},
  open: {at: [4, 14], rows: ['nnn', '.k.']},
  chew: {at: [4, 14], rows: ['.nn']},
};
const RAMPS: Ramps = {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
  eye: [PAL.N0, PAL.X0, PAL.S2, PAL.S4, PAL.S5, PAL.W9],
  hood: [PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  hoodIn: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N2],
  hand: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  key: [PAL.N0, PAL.N1, PAL.N2, PAL.C1, PAL.C3, PAL.C6],
};
const LEG: Legend = {...MAS_LEGEND, a: ['hand', 1], A: ['hand', 2], p: ['hand', 3], F: ['hand', 4], z: ['hand', 0]};
type Stamp = {at: [number, number]; rows: string[]};
const STEEPLE: Stamp = {at: [29, 27], rows: [
  '...zz...',
  '..zFAz..',
  '.zFppAz.',
  '.zpzzAz.',
  'zFz..zAz',
  'zpz..zaz',
  '.z....z.',
]};
const REST_L: Stamp = {at: [26, 46], rows: ['.zzzzz.', 'zFpppAz', '.zzzzz.']};
const REST_R: Stamp = {at: [34, 46], rows: ['.zzzzz.', 'zpFppAz', '.zzzzz.']};
const SH_L: [number, number] = [23.5, 30];
const SH_R: [number, number] = [42.5, 30];
const rig: LightRig = {
  key: [-0.8, -0.55], keyBand: 2, shadowBand: 2, rim: true, outline: true,
  ramps: RAMPS,
  groupBands: {body: {key: 2, shadow: 3}, upL: {key: 1, shadow: 1}, upR: {key: 1, shadow: 2}, foreL: {key: 1, shadow: 1}, foreR: {key: 1, shadow: 1}},
  noEdge: ['hoodIn'],
};
const coolRim = (img: Img, pad: number) => {
  edgeLight(img, RAMPS, [0, -1], (mat, t, _x, y) => {
    if (y > 40 + pad) return undefined;
    if (mat === 'hair') return t <= 1 ? PAL.N4 : t <= 3 ? PAL.N5 : undefined;
    if (mat === 'hood') return PAL.N6;
    return undefined;
  }, 1, ['hood', 'hair', 'skin']);
  edgeLight(img, RAMPS, [1, 0], (mat, t, _x, y) => {
    if (y > 42 + pad) return undefined;
    if (mat === 'hair') return t <= 1 ? PAL.N4 : undefined;
    if (mat === 'hood') return PAL.N5;
    return undefined;
  }, 1, ['hood', 'hair']);
};
// ============================================================ /COPY

export type Arm2 = 'steeple' | 'rest' | 'grab' | 'roll' | 'scope' | 'lift' | 'sip' | 'sdown' | 'upN' | 'flick';
export interface MasPose2 {
  arm: Arm2;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  mouth: Mouth;
  breathe: 0 | 1;
  /** the downdraft: 0 calm, 1 / 2 the cowlick whipped flat */
  hair: 0 | 1 | 2;
  /** standing (the N beat) */
  stand?: boolean;
  /** standing with his water glass in the camera-left hand (from the sip on; the key art's "glass in hand") */
  glass?: boolean;
}
export const MAS2_DEFAULT: MasPose2 = {arm: 'steeple', lid: 0, look: 0, mouth: 'rest', breathe: 0, hair: 0};

/** standing: the upper body rises STAND px; the canvas gets PADT px of headroom for the raised arm */
export const STAND = 22, PADT = 20;
export const MAS2_H_STAND = MASD_H + STAND + PADT;
/** the local y of the table edge for a pose's canvas */
export const tableEdge = (p: MasPose2) => (p.stand ? MASD_TABLE_EDGE + STAND + PADT : MASD_TABLE_EDGE);

// the downdraft pushes the cowlick flat and forward (hand-placed, rows 0..2 of the head map)
const HAIR_TOP: Record<1 | 2, string[]> = {
  1: ['..............', '..cGcGh.......', '.HHgGghHHH....'],
  2: ['..............', '.cGGcGh.......', 'cHHgGghHHH....'],
};

type Arm = {up: Prim[]; fore: Prim[]; front: boolean};
const armLOf = (a: Arm2, b: number, stand: boolean, glass = false): Arm => {
  const [sx, sy] = [SH_L[0], SH_L[1] - b];
  // standing with the glass: the elbow at his side, the forearm up across the chest, the glass held at chest height
  if (stand && glass) return {up: [seg(sx, sy, 5, 19.5, 43, 4.5)], fore: [seg(19.5, 43, 4.5, 24, 37, 4)], front: false};
  if (stand) return {up: [seg(sx, sy, 5, 21.5, 44, 4.5)], fore: [seg(21.5, 44, 4.5, 22, 57, 4)], front: false};
  switch (a) {
    case 'roll': return {up: [seg(sx, sy, 5, 20, 42, 4.5)], fore: [seg(20, 42, 4.5, 28, 38, 4)], front: false};
    case 'steeple': return {up: [seg(sx, sy, 5, 21.5, 45, 4.5)], fore: [seg(21.5, 46, 4.5, 30.5, 33, 4)], front: true};
    default: return {up: [seg(sx, sy, 5, 21.5, 45, 4.5)], fore: [seg(21.5, 47, 4.2, 28, 48, 3.8)], front: true};
  }
};
const armROf = (a: Arm2, b: number, stand: boolean): Arm => {
  const [sx, sy] = [SH_R[0], SH_R[1] - b];
  if (stand) {
    if (a === 'upN') return {up: [seg(sx, sy, 5, 49, 17, 4.5)], fore: [seg(49, 17, 4.5, 46, 4, 4)], front: false};
    if (a === 'flick') return {up: [seg(sx, sy, 5, 49, 17, 4.5)], fore: [seg(49, 17, 4.5, 46, 3, 4)], front: false};
    return {up: [seg(sx, sy, 5, 44.5, 44, 4.5)], fore: [seg(44.5, 44, 4.5, 44, 57, 4)], front: false};
  }
  switch (a) {
    case 'grab': return {up: [seg(sx, sy, 5, 47, 42, 4.5)], fore: [seg(47, 42, 4.5, 45, 47, 4)], front: true};
    case 'roll': return {up: [seg(sx, sy, 5, 46, 42, 4.5)], fore: [seg(46, 42, 4.5, 38, 38, 4)], front: false};
    case 'scope': return {up: [seg(sx, sy, 5, 51, 24, 4.5)], fore: [seg(51, 24, 4.5, 45, 13, 4)], front: false};
    case 'lift': return {up: [seg(sx, sy, 5, 46, 42, 4.5)], fore: [seg(46, 42, 4.5, 41, 35, 4)], front: false};
    case 'sip': return {up: [seg(sx, sy, 5, 46, 41, 4.5)], fore: [seg(46, 41, 4.5, 38, 27, 4)], front: false};
    case 'steeple': return {up: [seg(sx, sy, 5, 44.5, 45, 4.5)], fore: [seg(44.5, 46, 4.5, 35.5, 33, 4)], front: true};
    default: return {up: [seg(sx, sy, 5, 44.5, 45, 4.5)], fore: [seg(44.5, 47, 4.2, 38, 48, 3.8)], front: true};
  }
};
/** acting-hand stamps (local, unpadded) */
const HAND2: Partial<Record<Arm2, Stamp>> = {
  grab: {at: [42, 44], rows: ['.zzz.', 'zFpAz', 'zppaz', '.zzz.']},
  roll: {at: [25, 36], rows: ['.zzz.', 'zFpAz', 'zppAz', '.zzz.']},
  scope: {at: [42, 10], rows: ['.zzz.', 'zFpAz', 'zppaz', '.zzz.']},
  lift: {at: [39, 32], rows: ['.zzz.', 'zpFAz', 'zppaz', '.zzz.']},
  sip: {at: [35, 22], rows: ['.zzz.', 'zFpAz', 'zppaz', '.zzz.']},
  upN: {at: [44, 1], rows: ['.zzz.', 'zFpAz', 'zpFAz', 'zppaz', '.zzz.']},
  flick: {at: [43, -3], rows: ['z.z.z.', 'zFzFzz', 'zpFpAz', 'zppAaz', '.zppz.', '..zz..']},
};
const ROLL_R: Stamp = {at: [36, 36], rows: ['.zzz.', 'zpFAz', 'zppaz', '.zzz.']};
/** standing hands (the key-art hand pass: every standing arm ends in a readable hand) */
const GLASS_HAND_L: Stamp = {at: [21, 33], rows: ['.zzz.', 'zFpAz', 'zppaz', '.zzz.']};
const FIST_L: Stamp = {at: [19, 56], rows: ['.zzz.', 'zFpAz', 'zppaz', '.zzz.']};
const FIST_R: Stamp = {at: [42, 56], rows: ['.zzz.', 'zpFAz', 'zppaz', '.zzz.']};

const PAPER = PAL.P2, PAPER2 = PAL.P1, EDGE = PAL.P0, INK = CX.INK;
/** paper roll held across the chest (roll) */
const drawRollHeld = (img: Img) => {
  for (let x = 28; x <= 38; x++) { put(img, x, 36, PAPER); put(img, x, 37, x % 3 === 0 ? INK : PAPER2); put(img, x, 38, EDGE); }
  put(img, 27, 36, EDGE); put(img, 27, 37, PAPER); put(img, 27, 38, EDGE);
};
/** the telescope: from the camera-right eye up and to the right, 3 px thick, whole-pixel diagonal */
const drawScope = (img: Img) => {
  const ex = 35, ey = 18, tx = 53, ty = 1;
  const n = Math.max(Math.abs(tx - ex), Math.abs(ty - ey));
  for (let k = 0; k <= n; k++) {
    const x = Math.round(ex + ((tx - ex) * k) / n), y = Math.round(ey + ((ty - ey) * k) / n);
    put(img, x, y - 1, PAPER); put(img, x, y, k % 4 === 2 ? INK : PAPER2); put(img, x + 1, y, EDGE); put(img, x, y + 1, EDGE);
  }
  // the open far end (a ring) and the eye end pressed to the brow
  put(img, tx + 1, ty - 1, PAPER); put(img, tx + 2, ty, PAPER); put(img, tx + 1, ty, PAL.N1); put(img, tx + 1, ty + 1, EDGE);
  put(img, ex - 1, ey, EDGE); put(img, ex - 1, ey - 1, PAPER2);
};
/** Mas's water glass in his hand: mdinner1's stemmed glass (set.ts drawGlass, wine = false) + the flat water
 *  line. (x, y) = the foot, same anchor as drawGlass. */
const GLASS_ROWS = ['g....h', 'o....o', 'owwwwo', 'oWWWWo', '.oWWo.', '..oo..', '..o...', '..o...', '..o...', '.oooo.'];
const drawHeldGlass = (img: Img, x: number, y: number) => {
  const pal: Record<string, number> = {o: PAL.N5, g: PAL.W7, h: PAL.N6, w: PAL.P1, W: PAL.X3};
  GLASS_ROWS.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) put(img, x - 3 + i, y - 9 + j, c); } });
};
const put = (img: Img, x: number, y: number, c: number) => { if (x >= 0 && y >= 0 && x < img.w && y < img.h) img.c[y * img.w + x] = c; };

const sides2 = (a: Arm2): [Arm2, Arm2] => {
  if (a === 'steeple') return ['steeple', 'steeple'];
  if (a === 'roll') return ['roll', 'roll'];
  return ['rest', a];
};

const shiftAll = (prims: Prim[], dy: number) => (dy ? prims.map((p) => shiftPrim(p, 0, dy)) : prims);

const backFig = (p: MasPose2): FigureDef => {
  const b = p.breathe, st = !!p.stand, pad = st ? PADT : 0;
  const [aL, aR] = sides2(p.arm);
  const L = armLOf(aL, b, st, !!p.glass), R = armROf(aR, b, st);
  const bot = st ? 56 + STAND + 12 : 56;
  const parts: Part[] = [
    {group: 'body', mat: 'hood', tone: 2, prims: shiftAll([P.poly(23, 31 - b, 27, 27.5 - b, 39, 27.5 - b, 43, 31 - b, 44, 39, st ? 43.5 : 43, bot, st ? 22.5 : 23, bot, 22, 39)], pad)},
    {group: 'collar', mat: 'hoodIn', tone: 2, prims: shiftAll([P.poly(28, 28 - b, 31, 26.5, 35, 26.5, 38, 28 - b, 35, 30, 31, 30)], pad)},
    {group: 'upL', mat: 'hood', tone: 2, prims: shiftAll(L.up, pad)},
    {group: 'upR', mat: 'hood', tone: 2, prims: shiftAll(R.up, pad)},
  ];
  if (!L.front) parts.push({group: 'foreL', mat: 'hood', tone: 2, prims: shiftAll(L.fore, pad)});
  if (!R.front) parts.push({group: 'foreR', mat: 'hood', tone: 2, prims: shiftAll(R.fore, pad)});
  const adjust: Adjust[] = [
    {prims: shiftAll([P.line(31, 30, 31, 35)], pad), tone: 3, onlyMat: 'hood'},
    {prims: shiftAll([P.line(35, 30, 35, 34)], pad), tone: 1, onlyMat: 'hood'},
    {prims: shiftAll([P.rect(31, 36, 1, 1)], pad), tone: 4, onlyMat: 'hood'},
    {prims: shiftAll([P.poly(37, 31, 43, 32, 44, 39, 43, 50, 38, 50, 39, 40)], pad), add: -1, onlyMat: 'hood'},
  ];
  if (st) {
    // standing: the hoodie's lower half shows — the kangaroo pocket seam and the hem's fold
    adjust.push({prims: shiftAll([P.line(26, 58, 40, 58), P.line(25, 59, 25, 66), P.line(41, 59, 41, 66)], pad), add: -1, onlyMat: 'hood'});
    adjust.push({prims: shiftAll([P.line(27, 57, 39, 57)], pad), add: 1, onlyMat: 'hood'});
  }
  return {w: MASD_W, h: st ? MAS2_H_STAND : MASD_H, parts, adjust};
};
const frontFig = (p: MasPose2): FigureDef => {
  const b = p.breathe, st = !!p.stand;
  const [aL, aR] = sides2(p.arm);
  const L = armLOf(aL, b, st, !!p.glass), R = armROf(aR, b, st);
  const parts: Part[] = [];
  if (L.front) parts.push({group: 'foreL', mat: 'hood', tone: 2, prims: L.fore});
  if (R.front) parts.push({group: 'foreR', mat: 'hood', tone: 2, prims: R.fore});
  return {w: MASD_W, h: st ? MAS2_H_STAND : MASD_H, parts};
};

const buildBack = (p: MasPose2): Img => {
  const img = renderFigure(backFig(p), rig);
  const pad = p.stand ? PADT : 0;
  const [hx, hy] = [HEAD_AT[0], HEAD_AT[1] + pad];
  paint(img, 30, 25 + pad, ['msssss', 'lmssss', 'lmsss.'], MAS_LEGEND, RAMPS);
  const head = p.hair ? [...HAIR_TOP[p.hair], ...HEAD.slice(3)] : HEAD;
  paint(img, hx, hy, head, MAS_LEGEND, RAMPS);
  const lid = p.arm === 'scope' ? 0 : p.lid;
  for (const e of eyes(lid, p.look)) paint(img, hx + e.at[0], hy + e.at[1], e.rows, MAS_LEGEND, RAMPS);
  if (p.arm === 'scope') paint(img, hx + 1, hy + 10, ['ooo'], MAS_LEGEND, RAMPS); // the other eye squeezed shut
  const mo = MOUTH[p.mouth];
  if (p.arm !== 'sip') paint(img, hx + mo.at[0], hy + mo.at[1], mo.rows, MAS_LEGEND, RAMPS);
  if (p.arm === 'roll') drawRollHeld(img);
  if (p.arm === 'scope') drawScope(img);
  if (p.arm === 'lift') drawHeldGlass(img, 41, 37);
  if (p.arm === 'sip') drawHeldGlass(img, 33, 30);
  const hand = HAND2[p.arm];
  if (hand) paint(img, hand.at[0], hand.at[1] + pad, hand.rows, LEG, RAMPS);
  if (p.stand) {
    if (p.glass) { drawHeldGlass(img, 24, 37 + pad); paint(img, GLASS_HAND_L.at[0], GLASS_HAND_L.at[1] + pad, GLASS_HAND_L.rows, LEG, RAMPS); }
    else paint(img, FIST_L.at[0], FIST_L.at[1] + pad, FIST_L.rows, LEG, RAMPS);
    if (p.arm !== 'upN' && p.arm !== 'flick') paint(img, FIST_R.at[0], FIST_R.at[1] + pad, FIST_R.rows, LEG, RAMPS);
  }
  if (p.arm === 'roll') paint(img, ROLL_R.at[0], ROLL_R.at[1], ROLL_R.rows, LEG, RAMPS);
  coolRim(img, pad);
  return img;
};
const buildFront = (p: MasPose2): Img => {
  const img = renderFigure(frontFig(p), rig);
  const [aL, aR] = sides2(p.arm);
  if (p.stand) return img;
  if (p.arm === 'steeple') paint(img, STEEPLE.at[0], STEEPLE.at[1], STEEPLE.rows, LEG, RAMPS);
  if (aL === 'rest') paint(img, REST_L.at[0], REST_L.at[1], REST_L.rows, LEG, RAMPS);
  if (aR === 'rest') paint(img, REST_R.at[0], REST_R.at[1], REST_R.rows, LEG, RAMPS);
  if (p.arm === 'grab') paint(img, HAND2.grab!.at[0], HAND2.grab!.at[1], HAND2.grab!.rows, LEG, RAMPS);
  return img;
};
export const masBack2 = memo(buildBack);
export const masFront2 = memo(buildFront);
