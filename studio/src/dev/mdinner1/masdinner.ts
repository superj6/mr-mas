// MR. MAS — mdinner1: MAS at THE WOODROSE (2015), seated at the centre of the table, square to camera
// (the Last Supper seat). Not in the cast yet (castmas has only the desk / era sprites), so it lives here.
// Same conventions as src/shared/pixel/cast/mas.ts: the head is the hand-pixelled 'camera' tone map
// (copied, with its eye/mouth stamps), the body is a rig figure, every change is a whole-drawing swap.
// Light: warm key from the candle at his right (camera-left), the dusk window behind him as a cool rim.
import {PAL} from '../../shared/pixel/palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, renderFigure} from '../../shared/pixel/figure';
import {MAS_LEGEND} from '../../shared/pixel/cast/mas';
import {Legend, Ramps, memo, paint, seg, edgeLight} from '../../shared/pixel/cast/kit';

export const MASD_W = 66;
export const MASD_H = 64;
/** local y of the table top's back edge (the set paints the table over the body below this line) */
export const MASD_TABLE_EDGE = 46;
/** local x of his centre line */
export const MASD_CX = 33;

export type MasArm = 'steeple' | 'reach1' | 'reach2' | 'hold' | 'pocket' | 'rest' | 'fork' | 'roast' | 'bite';
export interface MasDinnerPose {
  arm: MasArm;
  lid: 0 | 1 | 2;
  /** eye dart: -1 camera-left (toward Gerg), 0 at the lens, 1 camera-right (toward the fire / Alyi) */
  look: -1 | 0 | 1;
  mouth: 'rest' | 'smile' | 'open' | 'chew';
  /** whole-pixel breath (the shoulders rise 1 px) */
  breathe: 0 | 1;
}
export const MASD_DEFAULT: MasDinnerPose = {arm: 'steeple', lid: 0, look: 0, mouth: 'rest', breathe: 0};

/** where the held object sits for each arm drawing (local), for the CTRL key / fork */
export const MASD_HAND: Record<MasArm, [number, number]> = {
  steeple: [33, 28], reach1: [11, 12], reach2: [7, 6], hold: [14, 19], pocket: [27, 52], rest: [30, 47],
  fork: [53, 39], roast: [61, 30], bite: [37, 24],
};

// the 'camera' head from src/shared/pixel/cast/mas.ts (straight into the lens, split light, calm level stare)
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
const MOUTH: Record<MasDinnerPose['mouth'], {at: [number, number]; rows: string[]}> = {
  rest: {at: [4, 14], rows: ['nnn']},
  smile: {at: [4, 13], rows: ['...n', 'nnn.']},
  open: {at: [4, 14], rows: ['nnn', '.k.']},
  chew: {at: [4, 14], rows: ['.nn']},
};

/** THE WOODROSE: warm candle key from camera-left, pendant fill; the hoodie stays grey (he is the cool one). */
const RAMPS: Ramps = {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
  eye: [PAL.N0, PAL.X0, PAL.S2, PAL.S4, PAL.S5, PAL.W9],
  hood: [PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  hoodIn: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N2],
  hand: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  key: [PAL.N0, PAL.N1, PAL.N2, PAL.C1, PAL.C3, PAL.C6],
};

// hands, hand-pixelled (tone maps): z outline, a shadow, A mid, p light, F bright
const LEG: Legend = {...MAS_LEGEND, a: ['hand', 1], A: ['hand', 2], p: ['hand', 3], F: ['hand', 4], z: ['hand', 0]};
type Stamp = {at: [number, number]; rows: string[]};
// steeple: fingertips meet in a point under the chin, palms apart, wrists down
const STEEPLE: Stamp = {at: [29, 27], rows: [
  '...zz...',
  '..zFAz..',
  '.zFppAz.',
  '.zpzzAz.',
  'zFz..zAz',
  'zpz..zaz',
  '.z....z.',
]};
const HANDS: Partial<Record<MasArm, Stamp>> = {
  reach1: {at: [9, 11], rows: ['.zzz.', 'zFpAz', 'zppAz', '.zpz.']},
  reach2: {at: [5, 5], rows: ['z...z', 'zF.Az', 'zppAz', '.zpz.']},
  hold: {at: [12, 18], rows: ['.zzz.', 'zFpAz', 'zppaz', '.zzz.']},
  fork: {at: [50, 38], rows: ['.zzz.', 'zpFAz', 'zppaz', '.zzz.']},
  roast: {at: [58, 29], rows: ['.zzz.', 'zpFAz', 'zppaz', '.zzz.']},
  bite: {at: [35, 23], rows: ['.zzz.', 'zFpAz', 'zppaz', '.zzz.']},
};
// resting hands, flat on the cloth (front layer)
const REST_L: Stamp = {at: [26, 46], rows: ['.zzzzz.', 'zFpppAz', '.zzzzz.']};
const REST_R: Stamp = {at: [34, 46], rows: ['.zzzzz.', 'zpFppAz', '.zzzzz.']};

// shoulder points (the throne sprite's proportions: slight frame)
const SH_L: [number, number] = [23.5, 30];
const SH_R: [number, number] = [42.5, 30];
/** upper arm (back layer) + forearm (back or front layer) for each drawing. */
const armL = (a: MasArm, b: number): {up: Prim[]; fore: Prim[]; front: boolean} => {
  const [sx, sy] = [SH_L[0], SH_L[1] - b];
  switch (a) {
    case 'reach1': return {up: [seg(sx, sy, 5, 16, 22, 4.5)], fore: [seg(16, 22, 4.5, 12, 13, 4)], front: false};
    case 'reach2': return {up: [seg(sx, sy, 5, 14, 20, 4.5)], fore: [seg(14, 20, 4.5, 8, 8, 4)], front: false};
    case 'hold': return {up: [seg(sx, sy, 5, 18, 30, 4.5)], fore: [seg(18, 30, 4.5, 15, 21, 4)], front: false};
    case 'pocket': return {up: [seg(sx, sy, 5, 22, 44, 4.5)], fore: [seg(22, 44, 4.5, 27, 52, 4)], front: false};
    case 'steeple': return {up: [seg(sx, sy, 5, 21.5, 45, 4.5)], fore: [seg(21.5, 46, 4.5, 30.5, 33, 4)], front: true};
    default: return {up: [seg(sx, sy, 5, 21.5, 45, 4.5)], fore: [seg(21.5, 47, 4.2, 28, 48, 3.8)], front: true};
  }
};
const armR = (a: MasArm, b: number): {up: Prim[]; fore: Prim[]; front: boolean} => {
  const [sx, sy] = [SH_R[0], SH_R[1] - b];
  switch (a) {
    case 'fork': return {up: [seg(sx, sy, 5, 46, 42, 4.5)], fore: [seg(46, 42, 4.5, 51, 40, 4)], front: false};
    case 'roast': return {up: [seg(sx, sy, 5, 49, 37, 4.5)], fore: [seg(49, 37, 4.5, 58, 31, 4)], front: false};
    case 'bite': return {up: [seg(sx, sy, 5, 46, 41, 4.5)], fore: [seg(46, 41, 4.5, 38, 27, 4)], front: false};
    case 'steeple': return {up: [seg(sx, sy, 5, 44.5, 45, 4.5)], fore: [seg(44.5, 46, 4.5, 35.5, 33, 4)], front: true};
    default: return {up: [seg(sx, sy, 5, 44.5, 45, 4.5)], fore: [seg(44.5, 47, 4.2, 38, 48, 3.8)], front: true};
  }
};
/** which side acts in each drawing */
const LEFT_ACTS = new Set<MasArm>(['reach1', 'reach2', 'hold', 'pocket']);
const RIGHT_ACTS = new Set<MasArm>(['fork', 'roast', 'bite']);
const sides = (arm: MasArm): [MasArm, MasArm] => [LEFT_ACTS.has(arm) || arm === 'steeple' ? arm : 'rest', RIGHT_ACTS.has(arm) || arm === 'steeple' ? arm : 'rest'];

const rig: LightRig = {
  key: [-0.8, -0.55], keyBand: 2, shadowBand: 2, rim: true, outline: true,
  ramps: RAMPS,
  groupBands: {body: {key: 2, shadow: 3}, upL: {key: 1, shadow: 1}, upR: {key: 1, shadow: 2}, foreL: {key: 1, shadow: 1}, foreR: {key: 1, shadow: 1}},
  noEdge: ['hoodIn'],
};

const backFig = (p: MasDinnerPose): FigureDef => {
  const b = p.breathe;
  const [aL, aR] = sides(p.arm);
  const L = armL(aL, b), R = armR(aR, b);
  const parts: Part[] = [
    {group: 'body', mat: 'hood', tone: 2, prims: [P.poly(23, 31 - b, 27, 27.5 - b, 39, 27.5 - b, 43, 31 - b, 44, 39, 43, 56, 23, 56, 22, 39)]},
    {group: 'collar', mat: 'hoodIn', tone: 2, prims: [P.poly(28, 28 - b, 31, 26.5, 35, 26.5, 38, 28 - b, 35, 30, 31, 30)]},
    {group: 'upL', mat: 'hood', tone: 2, prims: L.up},
    {group: 'upR', mat: 'hood', tone: 2, prims: R.up},
  ];
  if (!L.front) parts.push({group: 'foreL', mat: 'hood', tone: 2, prims: L.fore});
  if (!R.front) parts.push({group: 'foreR', mat: 'hood', tone: 2, prims: R.fore});
  const adjust: Adjust[] = [
    // drawstrings: two short cords off the collar, the lit one catches the candle
    {prims: [P.line(31, 30, 31, 35)], tone: 3, onlyMat: 'hood'},
    {prims: [P.line(35, 30, 35, 34)], tone: 1, onlyMat: 'hood'},
    {prims: [P.rect(31, 36, 1, 1)], tone: 4, onlyMat: 'hood'},
    // the chest turns away from the candle: a soft shadow plane on the far side
    {prims: [P.poly(37, 31, 43, 32, 44, 39, 43, 50, 38, 50, 39, 40)], add: -1, onlyMat: 'hood'},
  ];
  return {w: MASD_W, h: MASD_H, parts, adjust};
};
const frontFig = (p: MasDinnerPose): FigureDef => {
  const b = p.breathe;
  const [aL, aR] = sides(p.arm);
  const L = armL(aL, b), R = armR(aR, b);
  const parts: Part[] = [];
  if (L.front) parts.push({group: 'foreL', mat: 'hood', tone: 2, prims: L.fore});
  if (R.front) parts.push({group: 'foreR', mat: 'hood', tone: 2, prims: R.fore});
  return {w: MASD_W, h: MASD_H, parts};
};

const coolRim = (img: Img) => {
  // the dusk window behind him: a cool 1px kiss on the top edges (hair, shoulders) — the halo
  edgeLight(img, RAMPS, [0, -1], (mat, t, _x, y) => {
    if (y > 40) return undefined;
    if (mat === 'hair') return t <= 1 ? PAL.N4 : t <= 3 ? PAL.N5 : undefined;
    if (mat === 'hood') return PAL.N6;
    return undefined;
  }, 1, ['hood', 'hair', 'skin']);
  edgeLight(img, RAMPS, [1, 0], (mat, t, _x, y) => {
    if (y > 42) return undefined;
    if (mat === 'hair') return t <= 1 ? PAL.N4 : undefined;
    if (mat === 'hood') return PAL.N5;
    return undefined;
  }, 1, ['hood', 'hair']);
};

const buildBack = (p: MasDinnerPose): Img => {
  const img = renderFigure(backFig(p), rig);
  const [hx, hy] = HEAD_AT;
  // neck: in the chin's shadow, one lit strip on the candle side
  paint(img, 30, 25, ['msssss', 'lmssss', 'lmsss.'], MAS_LEGEND, RAMPS);
  paint(img, hx, hy, HEAD, MAS_LEGEND, RAMPS);
  for (const e of eyes(p.lid, p.look)) paint(img, hx + e.at[0], hy + e.at[1], e.rows, MAS_LEGEND, RAMPS);
  const mo = MOUTH[p.mouth];
  paint(img, hx + mo.at[0], hy + mo.at[1], mo.rows, MAS_LEGEND, RAMPS);
  const hand = HANDS[p.arm];
  if (hand) paint(img, hand.at[0], hand.at[1], hand.rows, LEG, RAMPS);
  coolRim(img);
  return img;
};
const buildFront = (p: MasDinnerPose): Img => {
  const img = renderFigure(frontFig(p), rig);
  const [aL, aR] = sides(p.arm);
  if (p.arm === 'steeple') paint(img, STEEPLE.at[0], STEEPLE.at[1], STEEPLE.rows, LEG, RAMPS);
  if (aL === 'rest') paint(img, REST_L.at[0], REST_L.at[1], REST_L.rows, LEG, RAMPS);
  if (aR === 'rest') paint(img, REST_R.at[0], REST_R.at[1], REST_R.rows, LEG, RAMPS);
  return img;
};
export const masDinnerBack = memo(buildBack);
export const masDinnerFront = memo(buildFront);

/** Is the acting hand below the table edge (hidden by the table layer)? */
export const handHidden = (a: MasArm) => a === 'pocket';
