// MR. MAS — cast: RIMA TAMURI, speaking set (Ep1 act 4; new file, owned by the act-4 character artist).
// Her only existing art is the roll-call flash (cast/rollcall.ts drawRima: no mouths, fixed crop). This module
// re-seats that same face (the same planes, the same top-lit spotlight grammar) into the standard 112x136
// dialogue / name-card window and gives it the speaking set, plus the tile she appears in on the board's call.
// "The Unflappable Founder": poised, a structured jacket that is always perfect, the hard circular spotlight
// that finds her. Never "understudy" framing (guardrails §6).
//   rimaSpeakPortrait / drawRimaSpeakPortrait  112x136: 6 mouths, 3 lids, brows level / lift / firm, the jacket
//                                              smoothing hand (2 drawings); spotlight 'dark' | 'on'
//   rimaBust / drawRimaTile                    call tile: the hard circular spotlight snaps on (spot 0 | 1)
//   drawRimaMini                               38x22
import {Buf, rect, bayer, hash} from '../px';
import {PAL, lightness} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, shiftPrim, blitTo} from './kit';
import {Viseme} from './talk';
import {Clip, clipped, tileClip, bustY} from './calltile';

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});

export const RIMA_PW = 112;
export const RIMA_PH = 136;
export type RimaBrow = 'level' | 'lift' | 'firm';
export interface RimaPortraitState {
  mouth: Viseme;
  lid: 0 | 1 | 2;
  brow: RimaBrow;
  /** the jacket: 'none' | 'smooth0' | 'smooth1' (the hand runs down the lapel in two held drawings) */
  hand: 'none' | 'smooth0' | 'smooth1';
}
export const RIMA_PORTRAIT_DEFAULT: RimaPortraitState = {mouth: 'rest', lid: 0, brow: 'level', hand: 'none'};

// the roll-call face, authored on a 138x166 canvas; re-seated into 112x136 by whole pixels
const DX = -13, DY = -9;
const fig = (s: RimaPortraitState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const Jm = (pts: number[]) => pts.map((v, i) => (i % 2 ? v + (v >= 86 ? jaw : 0) : v));
  const parts: Part[] = [
    {group: 'hairback', mat: 'hair', tone: 2, prims: [P.poly(42, 62, 44, 46, 52, 34, 62, 27, 74, 25, 86, 27, 96, 33, 103, 44, 106, 60, 105, 80, 106, 98, 110, 114, 112, 122, 104, 124, 96, 116, 92, 104, 88, 96, 58, 96, 52, 104, 46, 116, 38, 122, 34, 118, 38, 104, 40, 86)]},
    // a structured jacket over a dark top: square shoulders, notched lapels
    {group: 'top', mat: 'jacket', tone: 2, prims: [P.poly(4, 166, 8, 146, 22, 136, 42, 128, 56, 120, 90, 120, 104, 128, 122, 136, 134, 146, 138, 166)]},
    {group: 'inner', mat: 'inner', tone: 2, prims: [P.poly(58, 120, 88, 120, 82, 132, 73, 146, 64, 132)]},
    {group: 'neck', mat: 'skin', tone: 2, prims: [P.poly(61, 94, 61, 121, 72, 125, 85, 121, 85, 94)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(...Jm([50, 58, 54, 46, 62, 38, 72, 35, 82, 36, 90, 41, 95, 50, 96, 62, 95, 74, 91, 84, 85, 92, 77, 97, 70, 98, 63, 96, 57, 90, 53, 82, 50, 70]))]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(46, 76, 45, 58, 50, 44, 58, 35, 68, 30, 80, 30, 90, 34, 98, 42, 102, 54, 103, 70, 100, 62, 95, 52, 88, 45, 80, 43, 70, 46, 62, 44, 56, 50, 53, 60, 52, 74, 50, 90, 46, 98),
      P.poly(96, 58, 102, 66, 104, 84, 106, 102, 102, 108, 97, 96, 95, 80, 95, 66),
    ]},
    // lapels (drawn as their own parts so the rig edges them): left lapel over the inner top, right lapel
    {group: 'lapL', mat: 'jacket', tone: 3, prims: [P.poly(56, 120, 62, 120, 72, 146, 66, 150, 54, 132, 50, 126)]},
    {group: 'lapR', mat: 'jacket', tone: 2, prims: [P.poly(90, 120, 84, 120, 74, 146, 80, 150, 92, 132, 96, 126)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(58, 48, 66, 46, 80, 46, 88, 50, 86, 54, 72, 53, 60, 54), P.poly(71, 54, 73, 54, 73, 70, 71, 70)),
    plane('skin', 5, P.line(64, 48, 80, 48), P.line(72, 57, 72, 65)),
    plane('skin', 2, P.poly(74, 58, 76, 64, 76, 72, 74, 72)),
    plane('skin', 4, P.poly(70, 71, 74, 71, 74, 73, 70, 73)),
    plane('skin', 4, P.poly(56, 68, 62, 67, 63, 70, 58, 71), P.poly(82, 67, 89, 68, 87, 71, 82, 70), P.poly(...Jm([68, 89, 76, 89, 75, 91, 69, 91]))),
    plane('skin', 2, P.poly(51, 72, 56, 74, 60, 86, 56, 91, 52, 82), P.poly(91, 72, 94, 72, 92, 82, 88, 88, 86, 82)),
    plane('skin', 2, P.poly(57, 58, 68, 57, 69, 60, 58, 61), P.poly(76, 57, 87, 58, 87, 61, 76, 60)),
    plane('skin', 2, P.poly(68, 75, 76, 75, 75, 77, 69, 77)),
    plane('skin', 2, P.poly(...Jm([66, 94, 78, 93, 74, 97, 69, 97]))),
    plane('skin', 1, P.poly(61, 95, 64, 100, 72, 104, 80, 100, 85, 95, 85, 104, 72, 110, 61, 104)),
    plane('skin', 3, P.poly(67, 115, 77, 115, 75, 120, 69, 120)),
    plane('hair', 0, P.line(61, 30, 60, 36)),
    plane('hair', 4, P.line(63, 31, 72, 30), P.line(64, 33, 80, 32), P.line(66, 35, 88, 36), P.line(70, 38, 94, 44), P.line(59, 31, 53, 36), P.line(58, 34, 50, 42)),
    plane('hair', 5, P.line(66, 31, 71, 30), P.line(72, 33, 78, 33), P.line(56, 33, 54, 35)),
    plane('hair', 3, P.line(65, 37, 86, 39), P.line(46, 62, 48, 90), P.line(100, 60, 104, 90), P.line(50, 50, 55, 42), P.line(92, 42, 98, 50)),
    plane('hair', 2, P.line(62, 40, 72, 41), P.line(80, 41, 90, 46)),
    plane('hair', 1, P.line(54, 62, 51, 92), P.line(96, 64, 99, 98), P.line(98, 100, 104, 118), P.line(40, 106, 46, 96)),
    plane('hair', 4, P.line(36, 118, 40, 106), P.line(104, 108, 110, 120)),
    // the jacket: the spotlight rides the square shoulders; the lapel edges; a clean crease
    plane('jacket', 4, P.poly(10, 146, 24, 138, 42, 131, 46, 133, 26, 141, 12, 150), P.poly(100, 130, 118, 138, 128, 148, 118, 142, 102, 134)),
    plane('jacket', 5, P.line(14, 145, 26, 139), P.line(108, 133, 120, 139)),
    plane('jacket', 4, P.line(57, 121, 66, 142)),
    plane('jacket', 1, P.line(89, 121, 80, 142), P.line(30, 146, 26, 166), P.line(112, 146, 118, 166)),
  ];
  const L = s.lid;
  const eye = (flipCatch: boolean) => L === 2
    ? ['............', '............', '.LLLLLLLLLL.', '...kkkkkk...']
    : L === 1
      ? ['............', '.LLLLLLLLLL.', flipCatch ? '..kWIIIWwk..' : '..kwWIIIWk..', '...kkkkkk...']
      : ['..LLLLLLLL..', flipCatch ? '.LwWIgIIWwL.' : '.LwWIgIIWwL.', flipCatch ? '..kWIIIWwk..' : '..kwWIIIWk..', '...kkkkkk...'];
  const by = s.brow === 'lift' ? -1 : s.brow === 'firm' ? 1 : 0;
  const browL = s.brow === 'firm' ? ['............', '..bbbbbbbb..', '.b........bb'] : ['....bbbbbb..', '..bb......bb', '.b..........'];
  const browR = s.brow === 'firm' ? ['............', '..bbbbbbbb..', 'bb........b.'] : ['..bbbbbb....', 'bb......bb..', '..........b.'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['............', '.rmmmmmmmmr.', '...lLLLLl...'],
    smile: ['r...uuuu...r', '.rmmmmmmmmr.', '...lLLLLl...'],
    A: ['..uuuuuuuu..', '.rmmmmmmmmr.', '.mTTTTTTTTm.', '..mddddddm..', '...mmmmmm...', '....lLLl....'],
    E: ['..uuuuuuuu..', 'rmmmmmmmmmmr', '.mTTTTTTTTm.', '..mddddddm..', '...lLLLLl...'],
    O: ['....uuuu....', '...mmmmmm...', '..mddddddm..', '..mddddddm..', '...mmmmmm...', '....lLLl....'],
    M: ['............', '.rmmmmmmmmr.', '..MMMMMMMM..', '...lLLLLl...'],
  };
  const stamps: Stamp[] = [
    {x: 56, y: 61, rows: eye(false), pal: {L: PAL.N0, w: PAL.P0, W: PAL.P1, I: PAL.N0, g: PAL.W9, k: PAL.S3}},
    {x: 76, y: 61, rows: eye(true), pal: {L: PAL.N0, w: PAL.P0, W: PAL.P1, I: PAL.N0, g: PAL.W9, k: PAL.S3}},
    {x: 55, y: 56 + by, rows: browL, pal: {b: PAL.B1}},
    {x: 77, y: 56 + by, rows: browR, pal: {b: PAL.B1}},
    {x: 69, y: 76, rows: ['o....o'], pal: {o: PAL.S2}},
    {x: 63, y: 82, rows: mouths[s.mouth], pal: {u: PAL.S3, m: PAL.S1, M: PAL.S0, l: PAL.S3, L: PAL.S5, r: PAL.S2, T: PAL.P1, d: PAL.N0}},
  ];
  // the smoothing hand on the near lapel (camera-left): fingers together, the heel of the hand down the cloth
  if (s.hand !== 'none') {
    const hy = s.hand === 'smooth0' ? 125 : 130;
    // the back of her hand flat on the lapel, fingers together pointing up the slope, tips parted by 1px lines
    stamps.push({x: 34, y: hy, rows: [
      '...........oo.......',
      '.........oo54o......',
      '........o5o544o.....',
      '.......o45o5433o....',
      '......o455o54332o...',
      '....oo4455o44332o...',
      '..oo44445544332o....',
      '.o44444445433322o...',
      'o344444444333222o...',
      'o334444443322222o...',
      'o23344443322222o....',
      '.o223333322222o.....',
      '..oo22222222oo......',
      '....oooooooo........',
    ], pal: {o: PAL.S1, '2': PAL.S2, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5}});
  }
  const sh = (pr: Prim) => shiftPrim(pr, DX, DY);
  return {
    w: RIMA_PW, h: RIMA_PH,
    parts: parts.map((pt) => ({...pt, prims: pt.prims.map(sh)})),
    adjust: adjust.map((a) => ({...a, prims: a.prims.map(sh)})),
    stamps: stamps.map((st) => ({...st, x: st.x + DX, y: st.y + DY})),
  };
};
const RIG: LightRig = {
  key: [-0.15, -1], keyBand: 0, shadowBand: 0, rim: false, outline: true, edgesOnTop: true, noEdge: ['inner'],
  back: null,
  ramps: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B4, PAL.P1],
    jacket: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5, PAL.P2],
    inner: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N2, PAL.N3],
  },
};
export const rimaSpeakPortrait = memo((s: RimaPortraitState) => renderFigure(fig(s), RIG));

const gelMap = (rampCols: number[], lo = 0.1, hi = 0.8) => (c: number) => {
  const Lx = lightness(c);
  const t = Math.max(0, Math.min(0.999, (Lx - lo) / (hi - lo)));
  return rampCols[Math.floor(t * rampCols.length)];
};
/** house lights down: she is a shape in the dark before the spot finds her */
export const RIMA_HOUSE_DARK = gelMap([PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2], 0.1, 0.8);
const cone = (b0: Buf, x0: number, y0: number, w: number, h: number, clip: Clip) => {
  const b = clipped(b0, clip);
  rect(x0, y0, w, h, b.ink(PAL.N0));
  for (let y = 0; y < h; y++) {
    const half = 26 + y * 0.26, cx = w / 2 + 1;
    for (let x = 0; x < w; x++) {
      const d = Math.abs(x - cx) / half;
      if (d > 1.02) continue;
      const X = x0 + x, Y = y0 + y, bz = bayer(X, Y);
      const c = d > 0.95 ? PAL.X0 : d < 0.5 ? (bz < 0.5 ? PAL.X1 : PAL.X0) : d < 0.8 ? (bz < 0.25 ? PAL.X1 : PAL.X0) : bz < 0.5 ? PAL.X0 : PAL.N1;
      b.set(X, Y, c);
      if (d < 0.9 && hash(X, Y, 21) > 0.994) b.set(X, Y, PAL.P0);
    }
  }
};
/** Portrait window: 'on' the spotlight cone from above (the roll-call's), 'dark' before it snaps on. */
export const drawRimaSpeakPortrait = (b: Buf, x: number, y: number, s: RimaPortraitState, o: {spot?: 'on' | 'dark'; w?: number; h?: number; ox?: number} = {}) => {
  const w = o.w ?? RIMA_PW, h = o.h ?? RIMA_PH, ox = o.ox ?? 0;
  const clip = tileClip(x, y, w, h);
  if (o.spot === 'dark') { rect(x, y, w, h, clipped(b, clip).ink(PAL.N0)); blitImg(b, rimaSpeakPortrait(s), x - ox, y, {clip, map: RIMA_HOUSE_DARK}); return; }
  cone(b, x, y, w, h, clip);
  blitTo(b, rimaSpeakPortrait(s), x - ox, y, {clip});
};

// ============================================================ call tile (front webcam bust, 72 x 80)
export const RIMA_BUST_W = 72, RIMA_BUST_H = 80;
export interface RimaBustState { mouth: Viseme; lid: 0 | 1 | 2; }
const bustFig = (s: RimaBustState): FigureDef => {
  const parts: Part[] = [
    {group: 'hairB', mat: 'hair', tone: 1, prims: [P.poly(14, 30, 16, 14, 23, 6, 36, 3, 49, 6, 56, 14, 58, 30, 59, 46, 62, 60, 55, 64, 47, 58, 25, 58, 17, 64, 10, 60, 13, 46)]},
    {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(0, 80, 2, 66, 10, 59, 23, 55, 36, 54, 49, 55, 62, 59, 70, 66, 72, 80)]},
    {group: 'inner', mat: 'inner', tone: 2, prims: [P.poly(29, 55, 43, 55, 40, 64, 36, 70, 32, 64)]},
    {group: 'lapL', mat: 'jacket', tone: 3, prims: [P.poly(28, 55, 31, 55, 36, 68, 33, 71, 25, 62)]},
    {group: 'lapR', mat: 'jacket', tone: 2, prims: [P.poly(44, 55, 41, 55, 36, 68, 39, 71, 47, 62)]},
    {group: 'neck', mat: 'skin', tone: 2, prims: [P.poly(31, 42, 31, 56, 36, 59, 41, 56, 41, 42)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(23, 22, 25, 13, 30, 9, 36, 8, 42, 9, 47, 13, 49, 22, 49, 31, 47, 38, 43, 44, 36, 47, 29, 44, 25, 38, 23, 31)]},
    // side part high on her right (camera-left): the sweep crosses the brow to the far side
    {group: 'hair', mat: 'hair', tone: 2, prims: [P.poly(21, 36, 21, 20, 25, 11, 31, 6, 38, 5, 45, 7, 50, 12, 52, 22, 52, 40, 50, 48, 48, 32, 47, 20, 42, 15, 34, 16, 28, 14, 25, 20, 24, 30, 23, 44)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(27, 18, 34, 16, 42, 16, 46, 19, 40, 20, 30, 20), P.poly(35, 23, 37, 23, 37, 33, 35, 33)),
    plane('skin', 5, P.line(30, 18, 40, 18)),
    plane('skin', 2, P.poly(24, 26, 27, 28, 29, 38, 26, 36), P.poly(46, 26, 48, 26, 47, 36, 44, 38), P.poly(30, 43, 36, 46, 42, 43, 39, 47, 33, 47)),
    plane('skin', 1, P.poly(31, 43, 36, 47, 41, 43, 41, 49, 36, 52, 31, 49)),
    plane('hair', 4, P.line(28, 9, 36, 6), P.line(38, 6, 46, 9)),
    plane('hair', 1, P.line(24, 24, 22, 44), P.line(50, 24, 51, 46), P.line(15, 32, 14, 56), P.line(56, 32, 58, 56)),
    plane('jacket', 4, P.line(2, 66, 10, 60), P.line(10, 59, 22, 56), P.line(70, 66, 62, 60)),
    plane('jacket', 4, P.line(29, 56, 34, 67)),
  ];
  const eye = s.lid === 2 ? ['.....', '.....', 'LLLLL'] : s.lid === 1 ? ['.....', 'LLLLL', 'wIgw.'] : ['.LLL.', 'LwIgw', '.kkk.'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['.......', '.mmmmm.', '..lLl..'], smile: ['m.....m', '.mmmmm.', '..lLl..'],
    A: ['.mmmmm.', 'mTTTTTm', 'mdddddm', '.mdddm.', '..lLl..'], E: ['mmmmmmm', 'mTTTTTm', '.mdddm.', '..lLl..'],
    O: ['..mmm..', '.mdddm.', '.mdddm.', '..mmm..'], M: ['.......', '.mmmmm.', '.MMMMM.', '..lLl..'],
  };
  const stamps: Stamp[] = [
    {x: 26, y: 21, rows: ['.bbb...bbb.', 'b...b.b...b'], pal: {b: PAL.B1}},
    {x: 27, y: 24, rows: eye, pal: {L: PAL.N0, w: PAL.P1, I: PAL.N0, g: PAL.W9, k: PAL.S3}},
    {x: 40, y: 24, rows: eye, pal: {L: PAL.N0, w: PAL.P1, I: PAL.N0, g: PAL.W9, k: PAL.S3}},
    {x: 35, y: 34, rows: ['o.o'], pal: {o: PAL.S2}},
    {x: 33, y: 38, rows: mouths[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, L: PAL.S5, T: PAL.P1, d: PAL.N0}},
  ];
  return {w: RIMA_BUST_W, h: RIMA_BUST_H, parts, adjust, stamps};
};
export const rimaBust = memo((s: RimaBustState) => renderFigure(bustFig(s), {...RIG, rim: true, ramps: {...RIG.ramps, hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B4, PAL.B4], jacket: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G5, PAL.G6]}}));
/**
 * Her tile: a dark room, and a HARD circular spotlight that finds her. spot 0 = the tile is dark (she is a
 * shape), 1 = the circle is on: a crisp 1px edge, flat warm-white inside, nothing dithered.
 */
export const drawRimaTile = (b0: Buf, x: number, y: number, w: number, h: number, s: RimaBustState, o: {spot?: 0 | 1} = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N0));
  const spot = o.spot ?? 1;
  const bx = x + Math.round(w / 2 - RIMA_BUST_W / 2), by = bustY(y, h, RIMA_BUST_H);
  if (!spot) { blitImg(b0, rimaBust(s), bx, by, {clip, map: RIMA_HOUSE_DARK}); return; }
  const cx = x + w / 2, cy = y + h * 0.42, r = Math.min(w, h * 1.4) * 0.36;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const d = Math.hypot(x + i + 0.5 - cx, (y + j + 0.5 - cy) * 1.05);
    if (d < r - 1) b.set(x + i, y + j, PAL.X2);
    else if (d < r) b.set(x + i, y + j, PAL.X3);
  }
  blitImg(b0, rimaBust(s), bx, by, {clip});
};
export const drawRimaMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N0));
  const cx = x + Math.floor(w / 2);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (Math.hypot(x + i - cx, (y + j - y - 9) * 1.1) < 10) b.set(x + i, y + j, PAL.X1);
  rect(cx - 9, y + h - 5, 18, 5, b.ink(PAL.G3));
  rect(cx - 5, y + 3, 10, 14, b.ink(PAL.B1));
  rect(cx - 3, y + 5, 6, 9, b.ink(PAL.S4));
  b.set(cx - 2, y + 8, PAL.N0); b.set(cx + 1, y + 8, PAL.N0);
  rect(cx - 1, y + 11, 3, 1, b.ink(PAL.S1));
};
void (null as unknown as Img);
