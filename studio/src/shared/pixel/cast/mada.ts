// MR. MAS — cast: MADA, "The Poker Face" (Ep1 act 4; new file, owned by the act-4 character artist).
// He runs a Q&A empire and never gives an answer. Neutral, arms folded, perfectly still. Two signatures:
//   1. the LOADING SPINNER that appears over his head whenever he's asked anything: eight dots on a ring, the lit
//      head walking one position every 3 frames (a replacement drawing per step; nothing rotates). It can STOP
//      (the frozen ring dims one rung) and it can be the only thing sticking out of the heart avalanche.
//   2. HIS CHAIR, bolted to the floor: the chair that survives everything (a floor plate with four hex bolts).
// Palette: muted greys (G), dark hair (B), rectangular black frames, fair skin (S). Flat, even office light:
// nothing about him is dramatic, which is the joke.
//   madaPortrait / drawMadaPortrait  near-front portrait (112x136): 6 mouths, 3 lids, eye dart, the nod, a 1px
//                                    'tell' smile; arms folded across the frame's bottom
//   drawSpinner                      the spinner at any scale ('lg' portrait, 'md' tile, 'sm' room)
//   madaBust / drawMadaTile          video-call tile (webcam bust, arms folded, the spinner)
//   drawMadaMini                     38x22 mini tile
//   madaSeated / drawMadaSeated      room sprite: seated in the bolted chair, arms folded, 3/4 facing screen-right
//   drawMadaChair                    the chair alone (empty; it never moves)
import {Buf, rect, line, bayer, hash} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg, blitTo, lightPool} from './kit';
import {Viseme} from './talk';
import {Clip, clipped, tileClip, bustY} from './calltile';

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ============================================================ the spinner
export type SpinnerSize = 'lg' | 'md' | 'sm';
const SPIN: Record<SpinnerSize, {r: number; dot: string[]}> = {
  lg: {r: 6, dot: ['##', '##']},
  md: {r: 5, dot: ['##', '##']},
  sm: {r: 3, dot: ['#']},
};
/** frames per spinner step (8 steps = one turn a second at 24 fps) */
export const SPIN_STEP = 3;
/**
 * The spinner centred on (cx, cy). `f` = frame (freeze it to STOP). 'stopped' dims the ring one rung and drops
 * the tail: a stalled load. `col` picks the family: 'grey' (his, default) or 'blue' (the one blue heart, sc 27).
 */
export const drawSpinner = (b: Buf, cx: number, cy: number, f: number, o: {size?: SpinnerSize; stopped?: boolean; clip?: Clip; col?: 'grey' | 'blue'} = {}) => {
  const sz = SPIN[o.size ?? 'lg'];
  const head = Math.floor(f / SPIN_STEP) % 8;
  const ramp = o.col === 'blue'
    ? [PAL.C8, PAL.C6, PAL.C5, PAL.C4, PAL.C3, PAL.C2, PAL.C2, PAL.C1]
    : [PAL.P2, PAL.G6, PAL.G5, PAL.G5, PAL.G4, PAL.G4, PAL.G4, PAL.G4];
  const hw = sz.dot[0].length, hh = sz.dot.length;
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2 - Math.PI / 2;
    const x = Math.round(cx + Math.cos(a) * sz.r - hw / 2), y = Math.round(cy + Math.sin(a) * sz.r - hh / 2);
    const age = (head - k + 8) % 8;
    const col = o.stopped ? (age === 0 ? PAL.G5 : PAL.G3) : ramp[age];
    // a 1px drop shadow keeps it legible on any wall (the spinner is UI floating over the world)
    if (o.size !== 'sm') sz.dot.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') { const X = x + i + 1, Y = y + j + 1; if (!o.clip || o.clip(X, Y)) b.set(X, Y, PAL.N0); } });
    sz.dot.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') { const X = x + i, Y = y + j; if (!o.clip || o.clip(X, Y)) b.set(X, Y, col); } });
  }
};

// ============================================================ conversation portrait (112 x 136), near-front
export const MADA_PW = 112;
export const MADA_PH = 136;
export interface MadaPortraitState {
  mouth: Viseme;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  /** the nod (sc 30): the head drops a whole pixel, then two, on 2s; 0 = level */
  nod: 0 | 1 | 2;
}
export const MADA_PORTRAIT_DEFAULT: MadaPortraitState = {mouth: 'rest', lid: 0, look: 0, nod: 0};

const portraitFig = (s: MadaPortraitState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const n = s.nod;
  // head prims move with the nod; the jaw below the mouth line opens on A/O
  const H = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + n + (v >= 76 ? jaw : 0) : v)));
  const HL = (x0: number, y0: number, x1: number, y1: number) => P.line(x0, y0 + n, x1, y1 + n);
  const HE = (cx: number, cy: number, rx: number, ry: number) => P.ell(cx, cy + n, rx, ry);
  const parts: Part[] = [
    {group: 'torso', mat: 'sw', tone: 2, prims: [P.poly(-2, 144, 1, 116, 10, 104, 26, 98, 44, 95, 68, 95, 86, 98, 102, 104, 111, 116, 114, 144)]},
    {group: 'neck', mat: 'neck', tone: 3, prims: [P.poly(45, 80, 45, 98, 56, 102, 67, 98, 67, 80)]},
    {group: 'rib', mat: 'rib', tone: 2, prims: [P.poly(42, 96, 50, 94, 56, 99, 62, 94, 70, 96, 67, 101, 56, 105, 45, 101)]},
    {group: 'ears', mat: 'skinD', tone: 3, prims: [HE(33.5, 55, 3.2, 6), HE(79, 55, 3, 6)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [H(35, 40, 36, 30, 40, 24, 48, 20, 56, 19, 64, 20, 72, 24, 76, 30, 77, 40, 77, 52, 76, 62, 73, 71, 68, 79, 62, 84, 56, 86, 50, 84, 44, 79, 39, 71, 36, 62, 35, 52)]},
    // short, neat dark hair with a side part (camera-right); the sides cropped
    {group: 'hair', mat: 'hair', tone: 2, prims: [H(33, 46, 33, 34, 37, 25, 44, 18, 52, 15, 60, 15, 68, 17, 75, 22, 79, 30, 80, 42, 78, 47, 77, 38, 74, 31, 66, 28, 58, 27, 50, 28, 43, 30, 38, 35, 36, 44)]},
  ];
  const adjust: Adjust[] = [
    // ---- face: flat office light from above-front. Forehead + nose ridge + cheeks lit (4); the sides turn (2)
    plane('skin', 4, H(42, 33, 50, 30, 62, 30, 70, 33, 64, 35, 50, 35), H(55, 50, 58, 50, 58, 64, 55, 64), H(41, 58, 45, 57, 44, 59), H(67, 57, 71, 58, 68, 59)),
    plane('skin', 5, HL(50, 31, 61, 31), HL(56, 52, 56, 60)),
    plane('skin', 2, H(35, 44, 38, 44, 40, 60, 42, 72, 38, 68, 35, 58), H(74, 44, 77, 44, 77, 58, 74, 68, 71, 72, 72, 60)),
    toMat('skin', 'skinD', 2, H(39, 71, 44, 78, 50, 83, 56, 85, 62, 83, 68, 78, 73, 71, 70, 79, 63, 86, 56, 88, 49, 86, 42, 79)),
    // under the brow, the nose's sides + its shadow, under-nose, the chin plane, under-lip
    plane('skin', 2, H(41, 46, 52, 45, 53, 48, 41, 49), H(60, 45, 71, 46, 71, 49, 60, 48)),
    plane('skin', 2, H(58, 52, 60, 54, 61, 64, 58, 66)),
    toMat('skin', 'skinD', 3, H(52, 65, 61, 65, 60, 68, 53, 68)),
    plane('skin', 2, H(50, 79, 62, 79, 60, 81, 52, 81)),
    plane('skin', 4, H(52, 81, 60, 81, 59, 84, 53, 84)),
    // neck under the jaw; ears' bowls
    plane('neck', 0, P.poly(45, 83 + n, 50, 87 + n, 56, 89 + n, 62, 87 + n, 67, 83 + n, 67, 88 + n, 56, 91 + n, 45, 88 + n)),
    plane('neck', 2, P.poly(60, 90, 67, 86, 67, 98, 60, 100)),
    toMat('skinD', 'skinD', 1, HE(34, 56, 1.4, 3.5), HE(79, 56, 1.3, 3.5)),
    // ---- hair: a clean side part, sheen along the top, cropped sides darker
    plane('hair', 3, H(42, 24, 50, 19, 58, 18, 52, 21, 45, 26), H(62, 18, 70, 20, 64, 21)),
    plane('hair', 4, HL(47, 20, 54, 18)),
    plane('hair', 1, HL(60, 17, 64, 27), H(33, 38, 36, 32, 36, 46, 33, 46), H(78, 32, 80, 40, 79, 47, 77, 40)),
    plane('hair', 0, HL(61, 16, 62, 22)),
    // ---- sweater: crew-neck rib, the shoulders catching the ceiling light, fold lines toward the folded arms
    plane('sw', 3, P.poly(6, 110, 12, 103, 26, 99, 40, 97, 30, 102, 16, 108, 8, 118), P.poly(106, 110, 100, 103, 86, 99, 72, 97, 82, 102, 96, 108, 104, 118)),
    plane('sw', 4, P.line(12, 104, 24, 100), P.line(100, 104, 88, 100)),
    plane('sw', 1, P.line(40, 104, 34, 118), P.line(72, 104, 78, 118)),
  ];
  // ---- the folded arms: the far forearm (his left) lies ON TOP across the frame's bottom, its fingers over the
  // near upper arm; the near forearm (his right) runs under it, only its elbow and tucked fingertips showing.
  parts.push(
    {group: 'uarmN', mat: 'sw', tone: 2, prims: [P.poly(-2, 108, 8, 104, 18, 108, 22, 122, 18, 136, -2, 136)]},
    {group: 'uarmF', mat: 'sw', tone: 2, prims: [P.poly(114, 108, 104, 104, 94, 108, 90, 122, 94, 136, 114, 136)]},
    {group: 'farmU', mat: 'sw', tone: 2, prims: [P.poly(6, 136, 10, 128, 30, 126, 60, 128, 74, 132, 78, 136)]},
    {group: 'tipsU', mat: 'skin', tone: 3, prims: [P.poly(88, 122, 96, 120, 100, 124, 96, 128, 88, 127)]},
    {group: 'farmO', mat: 'sw', tone: 3, prims: [P.poly(108, 136, 104, 126, 84, 121, 56, 119, 34, 119, 22, 118, 22, 129, 36, 131, 60, 133, 84, 134, 96, 136)]},
    {group: 'cuffO', mat: 'rib', tone: 3, prims: [P.poly(22, 118, 27, 118, 27, 130, 22, 129)]},
    {group: 'handO', mat: 'skin', tone: 3, prims: [P.poly(10, 118, 16, 114, 23, 116, 23, 128, 16, 130, 10, 126)]},
  );
  adjust.push(
    // the top forearm: a lit upper plane, the underside in shadow, one fold at the elbow
    plane('sw', 4, P.poly(26, 119, 56, 119, 84, 121, 100, 125, 84, 123, 56, 121, 26, 121)),
    plane('sw', 5, P.line(30, 119, 54, 119)),
    plane('sw', 1, P.poly(26, 129, 60, 132, 90, 134, 100, 136, 60, 135, 26, 131)),
    plane('sw', 1, P.line(92, 124, 96, 131)),
    // the arms throw a soft shadow onto the sweater's front just above them
    plane('sw', 1, P.poly(22, 114, 60, 113, 92, 116, 92, 119, 60, 117, 22, 117)),
    // the near upper arm: lit shoulder edge; the under-forearm in its own shadow
    plane('sw', 3, P.line(2, 108, 8, 105)),
    plane('sw', 1, P.poly(10, 130, 30, 127, 60, 129, 74, 134, 60, 131, 30, 129)),
    // fingers over the near arm: three knuckle ridges; the fingertips under the far arm
    plane('skin', 4, P.line(12, 118, 16, 115), P.line(11, 121, 16, 118)),
    plane('skin', 2, P.line(12, 122, 21, 122), P.line(12, 125, 21, 125), P.line(89, 126, 97, 126)),
    plane('skin', 4, P.line(90, 122, 96, 121)),
  );
  const L = s.lid;
  // level, unreadable eyes behind rectangular lenses; the lid sits a touch low (patience)
  const eye = L === 2 ? ['.......', '.......', 'LLLLLLL', '.kkkkk.'] : L === 1 ? ['.......', 'LLLLLLL', 'wwiIgww', '.kkkkk.'] : ['.LLLLL.', 'LwiIgwL', 'wwiIIww', '.kkkkk.'];
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const ch = r.split(''), out = ch.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    ch.forEach((c, i) => { if (/[iIg]/.test(c) && out[i + d] && out[i + d] !== '.') out[i + d] = c; });
    return out.join('');
  });
  const mouths: Record<Viseme, string[]> = {
    rest: ['.............', 'mmmmmmmmmmmmm', '..lllllllll..'],
    // the tell: one pixel, one corner. Use it once.
    smile: ['............m', 'mmmmmmmmmmmm.', '..lllllllll..'],
    A: ['.............', 'mmmmmmmmmmmmm', 'mTTTTTTTTTTTm', '.mddddddddddm', '..mdddddddm..', '...mmmmmmm...', '....lllll....'],
    E: ['.............', 'mmmmmmmmmmmmm', 'mTTTTTTTTTTTm', '.mdddddddddm.', '..mmmmmmmmm..', '...lllllll...'],
    O: ['.............', '....mmmmm....', '...mdddddm...', '...mdddddm...', '....mmmmm....', '.....lll.....'],
    M: ['.............', 'mmmmmmmmmmmmm', '.MMMMMMMMMMM.', '..lllllllll..'],
  };
  const stamps: Stamp[] = [
    // brows: straight, level, low. They never move.
    {x: 40, y: 43 + n, rows: ['.bbbbbbbbbbb', 'bbbbbbbbbbbb'], pal: {b: PAL.B0}},
    {x: 61, y: 43 + n, rows: ['bbbbbbbbbbb.', 'bbbbbbbbbbbb'], pal: {b: PAL.B0}},
    {x: 43, y: 48 + n, rows: dart(eye, s.look), pal: {L: PAL.N0, w: PAL.S5, i: PAL.B2, I: PAL.N0, g: PAL.P2, k: PAL.S2}},
    {x: 62, y: 48 + n, rows: dart(eye, s.look), pal: {L: PAL.N0, w: PAL.S5, i: PAL.B2, I: PAL.N0, g: PAL.P2, k: PAL.S2}},
    // glasses: thin black rectangles, a straight bridge, the temples back to the ears; a flat glint (office light)
    {x: 38, y: 46 + n, rows: [
      'ffffffffffffffff..ffffffffffffffff',
      'f..............fffff.............f',
      'f..............f..f..............f',
      'f..............f..f..............f',
      'f..............f..f..............f',
      'f..............f..f..............f',
      'f..............f..f..............f',
      'ffffffffffffffff..ffffffffffffffff',
    ], pal: {f: PAL.N0}},
    {x: 34, y: 47 + n, rows: ['ffff'], pal: {f: PAL.N0}},
    {x: 72, y: 47 + n, rows: ['ffff'], pal: {f: PAL.N0}},
    {x: 40, y: 47 + n, rows: ['GGG', 'G..'], pal: {G: PAL.G6}},
    {x: 59, y: 47 + n, rows: ['GGG', 'G..'], pal: {G: PAL.G6}},
    {x: 52, y: 65 + n, rows: ['o......o', '.o....o.'], pal: {o: PAL.S1}},
    {x: 50, y: 74 + n, rows: mouths[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0}},
  ];
  return {w: MADA_PW, h: MADA_PH, parts, adjust, stamps};
};
const PRIG: LightRig = {
  key: [-0.35, -0.94], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'rib'],
  back: [0.95, -0.2], backBand: 1,
  backRamp: {skin: PAL.S4, skinD: PAL.S3, hair: PAL.G3, sw: PAL.G4},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    skinD: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B3],
    sw: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
    rib: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G4, PAL.G5],
  },
};
export const madaPortrait = memo((s: MadaPortraitState) => renderFigure(portraitFig(s), PRIG));

/** His wall: a plain office in flat light, one framed print (a single line going up, then down), a plant. */
const bgOffice = (b0: Buf, x: number, y: number, w: number, h: number, clip: Clip, k = 1) => {
  const b = clipped(b0, clip);
  lightPool(b, x, y, w, h, w * 0.5, -h * 0.1, w * 0.95, h * 0.9, PAL.G1, [[1, PAL.G2], [0.62, PAL.G3]]);
  // the framed print, upper right
  const fx = x + Math.round(w * 0.64), fy = y + Math.round(10 * k), fw = Math.round(30 * k), fh = Math.round(22 * k);
  rect(fx - 1, fy - 1, fw + 2, fh + 2, b.ink(PAL.N0)); rect(fx, fy, fw, fh, b.ink(PAL.P0)); rect(fx + 2, fy + 2, fw - 4, fh - 4, b.ink(PAL.P1));
  line(fx + 3, fy + fh - 5, fx + Math.round(fw / 2), fy + 5, b.ink(PAL.G2)); line(fx + Math.round(fw / 2), fy + 5, fx + fw - 4, fy + fh - 7, b.ink(PAL.G2));
  rect(fx - 1, fy + fh + 1, fw + 2, 1, b.ink(PAL.G1));
  // the plant, lower left: a pot and leaf clumps
  const px = x + Math.round(10 * k), py = y + h;
  rect(px, py - Math.round(16 * k), Math.round(11 * k), Math.round(16 * k), b.ink(PAL.D2)); rect(px, py - Math.round(16 * k), Math.round(11 * k), 1, b.ink(PAL.D4));
  for (const [i, j, r] of [[5, -20, 4], [1, -25, 3.5], [9, -27, 3.5], [4, -32, 3], [8, -36, 2.5]] as const) {
    const cx = px + i * k, cy = py + j * k;
    for (let yy = -r * k; yy <= r * k; yy++) for (let xx = -r * k; xx <= r * k; xx++) if (xx * xx + yy * yy <= r * r * k * k) b.set(Math.round(cx + xx), Math.round(cy + yy), yy < -r * k * 0.3 && xx < 0 ? PAL.L2 : PAL.L1);
  }
};

export interface MadaDrawOpts {
  /** spinner frame (freeze it to STOP); null = no spinner (he hasn't been asked anything) */
  spin?: number | null;
  stopped?: boolean;
  w?: number; h?: number; ox?: number;
}
export const MADA_SPIN_AT: [number, number] = [56, 8];
/** Portrait window content: office, Mada, the spinner above his head. */
export const drawMadaPortrait = (b: Buf, x: number, y: number, s: MadaPortraitState, o: MadaDrawOpts = {}) => {
  const w = o.w ?? MADA_PW, h = o.h ?? MADA_PH, ox = o.ox ?? 0;
  const clip = tileClip(x, y, w, h);
  bgOffice(b, x, y, w, h, clip);
  blitTo(b, madaPortrait(s), x - ox, y, {clip});
  if (o.spin !== null && o.spin !== undefined) drawSpinner(b, x - ox + MADA_SPIN_AT[0], y + MADA_SPIN_AT[1] + s.nod, o.spin, {size: 'lg', stopped: o.stopped, clip});
};

// ============================================================ video-call tile (webcam bust, 72 x 80)
export const MADA_BUST_W = 72, MADA_BUST_H = 80;
export interface MadaBustState { mouth: Viseme; lid: 0 | 1 | 2; nod: 0 | 1 | 2; }
export const MADA_BUST_DEFAULT: MadaBustState = {mouth: 'rest', lid: 0, nod: 0};
const bustFig = (s: MadaBustState): FigureDef => {
  const n = s.nod;
  const H = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + n : v)));
  const parts: Part[] = [
    {group: 'torso', mat: 'sw', tone: 2, prims: [P.poly(0, 80, 3, 64, 12, 56, 24, 52, 36, 51, 48, 52, 60, 56, 69, 64, 72, 80)]},
    {group: 'neck', mat: 'neck', tone: 3, prims: [P.poly(30, 40, 30, 54, 36, 57, 42, 54, 42, 40)]},
    {group: 'rib', mat: 'rib', tone: 2, prims: [P.poly(27, 52, 36, 55, 45, 52, 43, 56, 36, 59, 29, 56)]},
    {group: 'ears', mat: 'skin', tone: 2, prims: [P.ell(21.5, 28 + n, 2.5, 4), P.ell(50.5, 28 + n, 2.5, 4)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [H(22, 22, 23, 13, 28, 9, 36, 8, 44, 9, 49, 13, 50, 22, 50, 32, 47, 40, 42, 45, 36, 47, 30, 45, 25, 40, 22, 32)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [H(21, 24, 21, 14, 26, 7, 33, 4, 40, 4, 47, 7, 51, 14, 51, 24, 49, 18, 45, 14, 38, 13, 31, 14, 26, 16, 23, 20)]},
    // folded arms across the bottom of the frame (the top forearm, a hand at each side)
    {group: 'farm', mat: 'sw', tone: 3, prims: [P.poly(8, 80, 10, 70, 24, 68, 48, 68, 62, 70, 64, 80)]},
    {group: 'hand', mat: 'skin', tone: 3, prims: [P.poly(6, 70, 11, 67, 14, 70, 13, 76, 7, 76), P.poly(60, 71, 65, 69, 67, 73, 63, 76)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, H(26, 16, 32, 13, 40, 13, 46, 16, 40, 17, 32, 17), H(35, 26, 37, 26, 37, 34, 35, 34)),
    plane('skin', 2, H(22, 22, 24, 22, 26, 34, 23, 30), H(48, 22, 50, 22, 49, 30, 46, 34), H(28, 41, 36, 45, 44, 41, 40, 46, 32, 46)),
    plane('skin', 2, H(26, 24, 33, 24, 33, 26, 26, 26), H(39, 24, 46, 24, 46, 26, 39, 26), H(37, 27, 39, 28, 39, 34, 37, 34)),
    plane('neck', 1, P.poly(30, 43 + n, 36, 47 + n, 42, 43 + n, 42, 48, 36, 51, 30, 48)),
    plane('hair', 3, H(25, 11, 32, 7, 38, 6, 31, 9, 26, 13)),
    plane('hair', 1, H(21, 16, 23, 14, 23, 24, 21, 24), H(49, 14, 51, 16, 51, 24, 49, 20), P.line(40, 5 + n, 41, 13 + n)),
    plane('sw', 4, P.line(12, 69, 50, 68), P.line(3, 64, 12, 57), P.line(69, 64, 60, 57)),
    plane('sw', 1, P.line(14, 78, 60, 78), P.poly(12, 58, 60, 58, 62, 66, 10, 66)),
    plane('skin', 4, P.line(7, 70, 11, 68)),
  ];
  const eye = s.lid === 2 ? ['.....', '.....', 'LLLLL'] : s.lid === 1 ? ['.....', 'LLLLL', 'wIgw.'] : ['.LLL.', 'LwIgw', '.kkk.'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['.......', 'mmmmmmm', '.lllll.'],
    smile: ['......m', 'mmmmmm.', '.lllll.'],
    A: ['mmmmmmm', 'mTTTTTm', 'mdddddm', '.mdddm.', '..lll..'],
    E: ['mmmmmmm', 'mTTTTTm', '.mdddm.', '..lll..'],
    O: ['..mmm..', '.mdddm.', '.mdddm.', '..mmm..'],
    M: ['.......', 'mmmmmmm', '.MMMMM.', '.lllll.'],
  };
  const stamps: Stamp[] = [
    {x: 25, y: 22 + n, rows: ['bbbbbb...bbbbbb'], pal: {b: PAL.B0}},
    {x: 27, y: 24 + n, rows: eye, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.P2, k: PAL.S2}},
    {x: 40, y: 24 + n, rows: eye, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.P2, k: PAL.S2}},
    {x: 24, y: 23 + n, rows: ['fffffffff.fffffffff', 'f.......fff.......f', 'f.......f.f.......f', 'f.......f.f.......f', 'fffffffff.fffffffff'], pal: {f: PAL.N0}},
    {x: 25, y: 24 + n, rows: ['G'], pal: {G: PAL.G6}},
    {x: 35, y: 34 + n, rows: ['o.o'], pal: {o: PAL.S1}},
    {x: 33, y: 38 + n, rows: mouths[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0}},
  ];
  return {w: MADA_BUST_W, h: MADA_BUST_H, parts, adjust, stamps};
};
const BUST_RIG: LightRig = {...PRIG, key: [-0.4, -0.9]};
export const madaBust = memo((s: MadaBustState) => renderFigure(bustFig(s), BUST_RIG));

export interface MadaTileOpts { spin?: number | null; stopped?: boolean; }
/** The whole tile content (office, bust, spinner), clipped. Chrome (label, vote icon) is the caller's. */
export const drawMadaTile = (b: Buf, x: number, y: number, w: number, h: number, s: MadaBustState, o: MadaTileOpts = {}) => {
  const clip = tileClip(x, y, w, h);
  bgOffice(b, x, y, w, h, clip, 0.7);
  // the bust sits 6px low in his tile: room above his head for the spinner (the folded arms crop a little)
  const bx = x + Math.round(w / 2 - MADA_BUST_W / 2), by = bustY(y, h, MADA_BUST_H) + MADA_TILE_DROP;
  blitImg(b, madaBust(s), bx, by, {clip});
  if (o.spin !== null && o.spin !== undefined) drawSpinner(b, bx + 36, by - 2 + s.nod, o.spin, {size: 'md', stopped: o.stopped, clip});
};
/** where the tile's spinner sits (tile-local), for anything that has to land on it (the blue heart, sc 27) */
export const MADA_TILE_DROP = 6;
export const madaTileSpinner = (x: number, y: number, w: number, h: number): [number, number] => [x + Math.round(w / 2 - MADA_BUST_W / 2) + 36, bustY(y, h, MADA_BUST_H) + MADA_TILE_DROP - 2];

/** 38 x 22 mini tile: grey wall, the print, the bust in six shapes, glasses as one dark bar. */
export const drawMadaMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.G2));
  rect(x + w - 11, y + 3, 8, 6, b.ink(PAL.P0)); rect(x + w - 10, y + 4, 6, 4, b.ink(PAL.P1));
  const cx = x + Math.floor(w / 2);
  rect(cx - 9, y + h - 5, 18, 5, b.ink(PAL.G3));
  rect(cx - 8, y + h - 3, 16, 3, b.ink(PAL.G4));
  rect(cx - 4, y + 5, 8, 10, b.ink(PAL.S4));
  rect(cx - 4, y + 4, 8, 2, b.ink(PAL.B1));
  rect(cx - 4, y + 8, 8, 1, b.ink(PAL.N0));
  rect(cx - 1, y + 12, 3, 1, b.ink(PAL.S1));
  rect(cx - 2, y + 15, 4, 2, b.ink(PAL.S2));
};

// ============================================================ room sprite: seated in the bolted chair
// 3/4 facing screen-right, arms folded, perfectly still. The chair is part of the sprite (its back behind him,
// the seat, one column, the floor plate with four hex bolts) and drawMadaChair draws it empty.
export const MADA_SEAT_W = 44;
export const MADA_SEAT_H = 66;
/** the floor line under the plate (local) */
export const MADA_SEAT_FLOOR = 64;
export const MADA_SEAT_ANCHOR: [number, number] = [22, 64];
export type MadaLight = 'room' | 'sil' | 'fade';
export interface MadaSeatPose { lid: 0 | 1 | 2; mouth: 'rest' | 'open'; nod: 0 | 1; light: MadaLight; }
export const MADA_SEAT_DEFAULT: MadaSeatPose = {lid: 0, mouth: 'rest', nod: 0, light: 'room'};
const SEAT_HEAD = [
  '....oohhhhoo....',
  '..ohHHHIIIHho...',
  '.ohHHHIIJJIHho..',
  '.hHHHIIIIHHHHho.',
  'ohHHHIHHHHh44o..',
  'ohHHHHh3344444o.',
  'oHHHh233bbb4bbo.',
  'oHHh2fffff4ffff.',
  'oHHh3f4e4f4fe4o.',
  '.oh233444444445.',
  '.o1223344444445o',
  '.o1223344444444o',
  '..o12233mmm44o..',
  '..o1223344444o..',
  '...o11223344o...',
  '....oo122oo.....',
  '......o12o......',
];
const seatFig = (p: MadaSeatPose, withMan: boolean): FigureDef => {
  const parts: Part[] = [
    // the chair: tall back behind him (camera-left side), the seat, the column, the bolted plate
    {group: 'cback', mat: 'chair', prims: [P.poly(4, 14, 10, 10, 13, 12, 14, 44, 10, 46, 5, 44)]},
    {group: 'cseat', mat: 'chair', prims: [P.poly(6, 42, 34, 42, 36, 46, 34, 48, 8, 48, 5, 46)]},
    {group: 'ccol', mat: 'steel', prims: [P.rect(19, 48, 4, 11)]},
    {group: 'cplate', mat: 'steel', prims: [P.poly(8, 59, 34, 59, 36, 62, 36, 64, 6, 64, 6, 62)]},
  ];
  if (withMan) parts.push(
    // legs: thighs forward along the seat, shins down, shoes on the floor in front of the plate
    {group: 'legF', mat: 'pants', prims: [seg(14, 40, 8, 30, 40, 7), seg(30, 40, 6.4, 31, 58, 5.4)]},
    {group: 'legFs', mat: 'shoe', prims: [P.poly(28, 58, 34, 58, 38, 61, 38, 63, 28, 63)]},
    {group: 'legN', mat: 'pants', prims: [seg(16, 42, 8, 33, 42, 7), seg(33, 42, 6.4, 34, 59, 5.4)]},
    {group: 'legNs', mat: 'shoe', prims: [P.poly(31, 59, 37, 59, 41, 62, 41, 64, 31, 64)]},
    // torso upright against the back, the folded arms a thick bar across the chest
    {group: 'torso', mat: 'sw', prims: [P.poly(12, 18, 18, 15, 24, 16, 27, 20, 28, 30, 27, 40, 13, 42, 11, 32, 11, 22)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(17, 13, 22, 13, 22, 17, 17, 17)]},
    {group: 'arms', mat: 'sw', prims: [P.poly(12, 27, 20, 26, 28, 26, 31, 28, 31, 33, 28, 35, 18, 35, 12, 33)]},
  );
  const stamps: Stamp[] = [];
  if (withMan) {
    const rows = SEAT_HEAD.slice();
    if (p.lid === 1) rows[8] = 'oHHh3f4b4f4fb4o.';
    if (p.lid === 2) rows[8] = 'oHHh3fbbbf4fbbo.';
    if (p.mouth === 'open') { rows[12] = '..o12233MMM44o..'; rows[13] = '..o122334MM44o..'; }
    stamps.push({x: 11, y: p.nod ? 1 : 0, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], b: ['hair', 0], e: ['dark', 0], f: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
    }});
    // the hands at each end of the folded arms
    stamps.push({x: 29, y: 28, rows: ['34', '23'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
    stamps.push({x: 12, y: 29, rows: ['.4', '33'], pal: {'3': ['skin', 3], '4': ['skin', 4]}});
  }
  // the four hex bolts on the plate (two visible per side): a lit face, a dark edge
  for (const bx of [9, 15, 26, 32]) stamps.push({x: bx, y: 60, rows: ['bBb', 'bbb'], pal: {b: ['bolt', 1], B: ['bolt', 4]}});
  return {
    w: MADA_SEAT_W, h: MADA_SEAT_H, parts,
    adjust: withMan ? [
      {prims: [P.line(12, 30, 30, 30)], tone: 4, onlyMat: 'sw'},
      {prims: [P.line(14, 34, 28, 34)], tone: 1, onlyMat: 'sw'},
      {prims: [P.rect(0, 50, MADA_SEAT_W, 16)], add: -1, onlyMat: 'pants'},
    ] : [],
    stamps,
  };
};
const SLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B3],
  sw: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5],
  shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  chair: [PAL.N0, PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.G3],
  steel: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5, PAL.G6],
  bolt: [PAL.N0, PAL.G2, PAL.G3, PAL.G4, PAL.G6, PAL.P2],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const dimR = (r: number[], k: number) => r.map((_, i) => r[Math.max(0, i - k)]);
const SFADE = Object.fromEntries(Object.entries(SLIT).map(([k, r]) => [k, dimR(r, 2)]));
const SSIL: Record<string, number[]> = Object.fromEntries(Object.keys(SLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
const seatRig = (light: MadaLight): LightRig => ({
  key: [0.55, -0.83], keyBand: 3, shadowBand: 2, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.C6, hair: PAL.C6, sw: PAL.C6, pants: PAL.C5, shoe: PAL.C4, chair: PAL.C5, steel: PAL.C5} : {skin: PAL.X2, hair: PAL.G2, sw: PAL.G4, pants: PAL.N4, shoe: PAL.N3, chair: PAL.G2, steel: PAL.G4},
  ramps: light === 'room' ? SLIT : light === 'fade' ? SFADE : SSIL,
  groupBands: {torso: {key: 3, shadow: 2}, arms: {key: 2, shadow: 1}, legN: {key: 2, shadow: 1}, legF: {key: 1, shadow: 1}, cback: {key: 1, shadow: 1}, cseat: {key: 1, shadow: 1}, cplate: {key: 1, shadow: 1}},
});
export const madaSeated = memo((p: MadaSeatPose) => renderFigure(seatFig(p, true), seatRig(p.light)));
export const madaChair = memo((light: MadaLight) => renderFigure(seatFig(MADA_SEAT_DEFAULT, false), seatRig(light)));
/** the spinner's centre above the seated head (local, unflipped) */
export const MADA_SEAT_SPIN: [number, number] = [19, -6];
/** Draw seated with the plate's centre on (x, floorY). flip = face screen-left. Spinner optional. */
export const drawMadaSeated = (b: Buf, x: number, floorY: number, p: MadaSeatPose, o: {flip?: boolean; spin?: number | null; stopped?: boolean; map?: (c: number) => number} = {}) => {
  const ax = o.flip ? MADA_SEAT_W - 1 - MADA_SEAT_ANCHOR[0] : MADA_SEAT_ANCHOR[0];
  const ox = x - ax, oy = floorY - MADA_SEAT_ANCHOR[1];
  blitImg(b, madaSeated(p), ox, oy, {flip: o.flip, map: o.map});
  if (o.spin !== null && o.spin !== undefined) {
    const sx = o.flip ? MADA_SEAT_W - 1 - MADA_SEAT_SPIN[0] : MADA_SEAT_SPIN[0];
    drawSpinner(b, ox + sx, oy + MADA_SEAT_SPIN[1] + p.nod, o.spin, {size: 'sm', stopped: o.stopped});
  }
};
export const drawMadaChair = (b: Buf, x: number, floorY: number, light: MadaLight = 'room', flip = false) => {
  const ax = flip ? MADA_SEAT_W - 1 - MADA_SEAT_ANCHOR[0] : MADA_SEAT_ANCHOR[0];
  blitImg(b, madaChair(light), x - ax, floorY - MADA_SEAT_ANCHOR[1], {flip});
};
void bayer; void hash; void seg;
