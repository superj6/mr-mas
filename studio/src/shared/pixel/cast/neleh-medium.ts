// MR. MAS — cast: NELEH at MEDIUM / TWO-SHOT scale (Ep1 act 4 draft 3.1; new file, owned by the act-4 medium-tier artist).
// pov-and-framing §4.1 `[M]`/`[2S]`: waist-up, STANDING behind the boardroom table with the marker and the glowing
// paper held to her chest like a shield; the footnotes orbit her head. Used in the sc 27 boardroom [2S]s with MADA
// (27.11, 27.13, 27.14b, 27.32, 27.35, 27.36): she carries pass one.
// The head is the APPROVED PORTRAIT's geometry (cast/neleh.ts portraitFig: hair, head, neck, blazer, blouse; copied here
// verbatim 2026-09-25 because it is not exported), re-rasterized at half size (medium-kit scaleParts), with every
// feature hand-placed at medium size: level attentive eyes (near + foreshortened far), the three brows (level ·
// query: the near brow lifts · worry), the six mouths, three lids, the eye dart.
//   heads (3 drawings)  '34' the portrait's three-quarter (authored facing camera-left; she is on the LEFT of the
//                       [2S], so the layouts draw her flipped, facing MADA) · 'down' at the blueprint on the table
//                       (27.35, 27.36's look) · 'front' toward the lens / over the table (27.32: the wall changes)
//   arms (4 drawings)   'paper' the paper held to her chest, both hands (the shield) · 'marker' the paper in the far
//                       arm, the marker up in the near hand, capped · 'cap' the cap off (the marker's felt tip shows) ·
//                       'write' the near hand down on the blueprint on the table, the marker on step 4 (the ?)
//   lights              'room' the boardroom pendant + the paper's own glow (it glows in every Ep1 shot) · 'dim' the
//                       room stepped down behind her (the [PF] fallaway is a portrait shot; this is for a [2S] that
//                       holds in the dark: the glow stays)
// DRAW ORDER: footnotes 'back' -> nelehMediumBack (+ the paper) -> the plate's table top over rows >= NELEH_M_TABLE ->
// nelehMediumFront ('write': the forearm + hand on the table) -> footnotes 'front'. drawNelehMedium does all of it.
import {Buf, bayer} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure} from '../figure';
import {memo} from './kit';
import {Viseme} from './talk';
import {drawFootnotes, FootnoteOrbit, NelehBrow} from './neleh';
import {scaleParts, scaleAdjust, dartRows, rigPoint, handParts, sleeveParts, V2} from './medium-kit';

export const NELEH_MW = 72;
export const NELEH_MH = 152;
/** local row of the table top's FAR edge (she stands: the table cuts her at the hip) */
export const NELEH_M_TABLE = 116;
/** her face (eye line), for eyelines; the marker's tip in 'write' (on step 4) */
export const NELEH_M_FACE: [number, number] = [30, 26];
const K = 0.5, OX = 8, OY = 2;

export type NelehMHead = '34' | 'down' | 'front';
export type NelehMArm = 'paper' | 'marker' | 'cap' | 'write';
export type NelehMLight = 'room' | 'dim';
export interface NelehMediumState {
  head: NelehMHead;
  mouth: Viseme;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  brow: NelehBrow;
  arm: NelehMArm;
  light: NelehMLight;
  /** the write stroke on step 4: 0 the tip lands · 1 the hook of the ? · 2 the dot */
  stroke: 0 | 1 | 2;
}
export const NELEH_MEDIUM_DEFAULT: NelehMediumState = {head: '34', mouth: 'rest', lid: 0, look: 0, brow: 'level', arm: 'marker', light: 'room', stroke: 0};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ------------------------------------------------------------------ the portrait's geometry (portrait space, 112x136)
// copied from cast/neleh.ts portraitFig. `fx` shifts the FACE planes (portrait px; 'front' turns her toward the lens:
// the features move right, the far cheek widens) and `dy` tips the face down ('down').
const geo = (jaw: number, fx: number, dy: number) => {
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + (v >= 70 ? jaw : 0) : v)));
  const F = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + dy + (v >= 70 ? jaw : 0) : v + fx)));
  const FL = (x0: number, y0: number, x1: number, y1: number) => P.line(x0 + fx, y0 + dy, x1 + fx, y1 + dy);
  const parts: Part[] = [
    {group: 'hairB', mat: 'hair', tone: 1, prims: [P.poly(33, 52, 35, 38, 40, 28, 49, 21, 61, 18, 74, 20, 84, 27, 89, 39, 91, 55, 91, 72, 93, 88, 97, 103, 90, 108, 78, 106, 70, 98, 56, 92, 44, 92, 34, 96, 31, 86, 32, 70)]},
    {group: 'top', mat: 'top', tone: 2, prims: [P.poly(45, 96, 53, 99, 59, 100, 66, 97, 64, 106, 58, 113, 51, 106)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(50, 76, 50, 97, 57, 101, 65, 97, 65, 72)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 46, 22, 24),
      J(46, 25, 41, 30, 38, 37, 38, 44, 37, 48, 38, 52, 37, 55, 35, 59, 36, 61, 38, 62, 37, 65, 38, 68, 38, 71, 40, 75, 42, 78, 46, 81, 52, 81, 58, 77, 64, 72, 69, 65, 72, 56, 75, 45, 73, 34, 68, 27, 58, 22),
    ]},
    {group: 'hairN', mat: 'hair', tone: 2, prims: [P.poly(52, 20, 59, 24, 64, 30, 67, 38, 69, 47, 70, 57, 70, 67, 69, 77, 69, 88, 72, 97, 80, 103, 90, 104, 94, 97, 91, 84, 89, 68, 88, 50, 85, 36, 79, 26, 69, 19, 58, 17)]},
    {group: 'hairF', mat: 'hair', tone: 2, prims: [P.poly(53, 20, 46, 22, 41, 26, 38, 32, 37, 40, 38, 44, 40, 37, 43, 31, 48, 26, 54, 23)]},
    {group: 'hairFall', mat: 'hair', tone: 2, prims: [P.poly(34, 60, 36, 62, 38, 72, 40, 80, 42, 88, 44, 96, 42, 103, 36, 104, 32, 98, 31, 88, 32, 76)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, F(40, 33, 46, 28, 54, 26, 50, 31, 45, 36, 41, 40), F(38, 44, 42, 42, 46, 43, 42, 46, 38, 47), F(38, 62, 42, 62, 44, 66, 40, 70, 38, 68), F(41, 75, 46, 76, 48, 80, 43, 80)),
    plane('skin', 2, F(60, 34, 65, 38, 67, 46, 68, 56, 67, 64, 64, 71, 59, 76, 55, 78, 58, 70, 61, 62, 62, 52, 61, 42)),
    toMat('skin', 'skinD', 2, J(64, 36, 69, 42, 70, 52, 69, 62, 66, 70, 61, 76, 56, 80, 59, 76, 64, 71, 67, 64, 68, 56, 67, 46)),
    plane('skin', 2, F(43, 51, 45, 50, 47, 55, 46, 60, 42, 61, 42, 57)),
    toMat('skin', 'skinD', 3, F(41, 62, 47, 61, 49, 63, 44, 64)),
    plane('skin', 4, F(40, 51, 42, 51, 41, 57, 38, 59, 38, 57)),
    plane('skin', 4, F(52, 55, 58, 53, 61, 55, 55, 57)),
    plane('skin', 2, F(44, 78, 50, 79, 56, 77, 62, 73, 66, 68, 66, 72, 61, 78, 54, 82, 48, 82)),
    plane('skin', 5, FL(43, 31, 48, 28)),
    plane('neck', 1, J(50, 79, 55, 82, 61, 79, 65, 75, 65, 84, 58, 88, 50, 86)),
    plane('neck', 3, P.poly(50, 88, 52, 88, 52, 97, 50, 96)),
    plane('neck', 1, P.poly(60, 84, 65, 80, 65, 97, 60, 99)),
    plane('hair', 3, P.poly(42, 27, 48, 23, 53, 21, 49, 25, 44, 30, 40, 35), P.poly(55, 19, 62, 18, 70, 20, 64, 21, 58, 22)),
    plane('hair', 4, P.line(43, 27, 48, 23), P.line(57, 19, 63, 19)),
    plane('hair', 1, P.line(71, 24, 77, 44), P.line(78, 30, 84, 56), P.line(80, 62, 82, 96)),
    plane('hair', 3, P.line(75, 36, 79, 62), P.line(84, 64, 87, 92)),
    plane('hair', 0, P.poly(69, 70, 70, 77, 70, 88, 72, 96, 69, 94, 68, 84)),
    plane('hair', 3, P.line(33, 66, 32, 92)),
    plane('top', 3, P.poly(46, 97, 53, 99, 52, 103, 48, 100)),
    plane('top', 1, P.poly(62, 98, 66, 97, 63, 106, 60, 104)),
  ];
  return {parts, adjust};
};

// ------------------------------------------------------------------ the medium-native body (local coords)
// the navy blazer from the shoulders to the hip (the table cuts it), the lapels, the arms hanging to the elbows
const bodyParts = (): Part[] => [
  {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(13, 128, 14, 96, 12, 76, 11, 62, 15, 54, 23, 50, 30, 49, 44, 49, 51, 50, 58, 55, 61, 63, 61, 78, 58, 96, 59, 128)]},
];
const bodyAdjust = (): Adjust[] => [
  // the key (the pendant, camera-left as authored) across the far shoulder; the near side turns away
  plane('jacket', 3, P.poly(12, 62, 15, 55, 22, 51, 29, 50, 24, 53, 17, 58, 14, 66)),
  plane('jacket', 4, P.line(14, 57, 21, 52)),
  plane('jacket', 1, P.poly(56, 56, 60, 62, 60, 80, 57, 96, 55, 96, 58, 80, 58, 64)),
  // lapels: the notch, the buttoned front, the pocket flap
  plane('jacket', 1, P.poly(30, 50, 34, 58, 36, 66, 34, 70, 31, 60, 29, 52)),
  plane('jacket', 3, P.line(30, 51, 34, 62)),
  plane('jacket', 1, P.poly(42, 50, 45, 50, 43, 58, 38, 66, 37, 63, 41, 56)),
  plane('jacket', 0, P.line(37, 68, 38, 112)),
  plane('jacket', 1, P.line(15, 70, 16, 96), P.line(56, 70, 55, 96)),
  plane('jacket', 5, P.rect(38, 84, 1, 1)),
  plane('jacket', 1, P.line(44, 94, 52, 94)),
];

// the arms: medium-native upper arms from the shoulders, the forearms raised to the chest (the paper, the marker)
type ArmDef = {parts: Part[]; adjust: Adjust[]};
const upper = (side: 'F' | 'N', elbow: V2): ArmDef => {
  const sh: V2 = side === 'F' ? [16, 58] : [56, 58];
  const sv = sleeveParts('ua' + side, sh, elbow, {w0: 10, w1: 9, mat: 'jacket', lit: [-0.85, -0.5], cuff: 0.01});
  return {parts: sv.parts.slice(0, 1), adjust: sv.adjust};
};
const fore = (side: 'F' | 'N', elbow: V2, wrist: V2): ArmDef => {
  const sv = sleeveParts('fa' + side, elbow, wrist, {w0: 9, w1: 7, mat: 'jacket', lit: [-0.85, -0.5], cuff: 1.5});
  return sv;
};
/** the page at medium size: a stapled stack, dog-eared, one highlighted line; it glows (the brightest thing) */
const PAGE_M = [
  'S..........dd.',
  '.eeeeeeeeeedDd',
  '.ePPPPPPPPPPDe',
  '.ePtttttttPPPe',
  '.ePPPPPPPPPPPe',
  '.ePhhhhhhhhPPe',
  '.ePhtthtthhPPe',
  '.ePPPPPPPPPPPe',
  '.ePtttttttPPPe',
  '.ePPPPPPPPPPPe',
  '.ePttttnPPPPPe',
  '.ePPPPPPPPPPPe',
  '.ePtttttttPPPe',
  '.ePPPPPPPPPPPe',
  '.ePPPPPPPPPPPe',
];
export const NELEH_M_PAGE: [number, number] = [17, 64];
// her near hand holding the stack: four fingertips hooked over its right edge toward us, lit by the page
const FINGERS_M = ['.oo.', 'o45o', '.oo.', 'o45o', '.oo.', 'o34o', '.oo.'];
// the marker in a loose fist: the barrel (dark), the cap (slate), the felt tip when uncapped
// a whiteboard marker: cream barrel, black cap with a white band (it has to read against the navy blazer)
const MARKER_UP = ['.cc.', 'cCCc', 'cwwc', 'bBBb', 'bBBb', 'o44o', 'o344', 'o334', '.o3o'];
const MARKER_OFF = ['.tt.', '.tt.', 'bBBb', 'bBBb', 'bBBb', 'o44o', 'o344', 'o334', '.o3o'];
const CAP = ['.cc.', 'cCCc', 'cwwc', 'cccc'];

const armParts = (s: NelehMediumState): {back: ArmDef; front: ArmDef; tip: V2 | null} => {
  const back: ArmDef = {parts: [], adjust: []}, front: ArmDef = {parts: [], adjust: []};
  const add = (d: ArmDef, a: ArmDef) => { d.parts.push(...a.parts); d.adjust.push(...a.adjust); };
  // the far arm (camera-left) always holds the paper to her chest: elbow in at her side, forearm up and across
  const eF: V2 = [17, 84];
  add(back, upper('F', eF));
  add(back, fore('F', eF, [25, 72]));
  let tip: V2 | null = null;
  if (s.arm === 'write') {
    // the near arm reaches down past the table edge to the blueprint: the upper arm to the elbow, then the forearm and
    // the hand in FRONT of the table (drawn after the table top), the marker's tip on the sheet
    const eN: V2 = [52, 98];
    add(back, upper('N', eN));
    const w: V2 = [12 - s.stroke, 133];
    add(front, fore('N', eN, w));
    const hd = handParts('handN', {at: w, dir: [-0.7, 1], thumb: 1, len: 8, width: 7, curl: 0.8, thumbOut: 0.1, thumbLen: 3}, 'skin', [-0.85, -0.5]);
    add(front, hd);
    tip = [w[0] - 5, w[1] + 7];
  } else {
    const eN: V2 = [56, 86];
    add(back, upper('N', eN));
    const w: V2 = s.arm === 'paper' ? [36, 72] : [45, 70];
    add(back, fore('N', eN, w));
  }
  return {back, front, tip};
};

// ------------------------------------------------------------------ the face at medium size
const EYES: Record<0 | 1 | 2, {near: string[]; far: string[]}> = {
  0: {near: ['.LLLLL', 'LwiIgw', '.kkkk.'], far: ['LL', 'iw']},
  1: {near: ['......', 'LLLLLL', '.wiIw.'], far: ['..', 'LL']},
  2: {near: ['......', '......', 'LLLLL.'], far: ['..', 'L.']},
};
const MOUTHS: Record<Viseme, string[]> = {
  rest: ['......', 'mmmmm.', '.lll..'],
  smile: ['....m.', 'mmmm..', '.lll..'],
  A: ['......', 'mmmmm.', 'mTTTm.', '.mdm..', '..l...'],
  E: ['......', 'mmmmmm', 'mTTTm.', '.mmm..'],
  O: ['......', '.mmm..', 'mddm..', '.mm...'],
  M: ['......', 'mmmmm.', '.MMM..', '.lll..'],
};
const BROWS: Record<NelehBrow, {near: string[]; far: string[]; dy: number}> = {
  level: {near: ['.bbbbb', 'bb....'], far: ['bb'], dy: 0},
  // the pointed question: the near brow lifts a whole pixel, its tail stays
  query: {near: ['..bbb.', 'bb...b'], far: ['bb'], dy: -1},
  worry: {near: ['bb....', '.bbbbb'], far: ['.b'], dy: 0},
};
const faceStamps = (s: NelehMediumState): Stamp[] => {
  const fx = s.head === 'front' ? 2 : 0, dy = s.head === 'down' ? 1 : 0;
  const lid = s.head === 'down' ? (s.lid === 2 ? 2 : 1) : s.lid;
  const look = s.head === 'down' ? 0 : s.look;
  const e = EYES[lid], br = BROWS[s.brow];
  const eyePal = {L: PAL.N0, w: PAL.S5, i: PAL.B3, I: PAL.N0, g: PAL.W8, k: PAL.S2};
  return [
    {x: 31 + fx, y: 22 + br.dy + dy, rows: br.near, pal: {b: PAL.B1}},
    {x: 26 + fx, y: 23 + dy, rows: br.far, pal: {b: PAL.B1}},
    {x: 31 + fx, y: 24 + dy, rows: dartRows(e.near, look), pal: eyePal},
    {x: 26 + fx, y: 25 + dy, rows: dartRows(e.far, look), pal: eyePal},
    {x: 27 + fx, y: 31 + dy, rows: ['o'], pal: {o: PAL.S1}},
    {x: 26 + fx, y: 33 + dy, rows: MOUTHS[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0}},
  ];
};

// ------------------------------------------------------------------ lights
const RAMPS: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  skinD: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.B4],
  jacket: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N7],
  top: [PAL.N1, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2],
};
const DIM: Record<string, number[]> = Object.fromEntries(Object.entries(RAMPS).map(([k, r]) => [k, r.map((_, i) => r[Math.max(0, i - 1)])]));
const rigFor = (light: NelehMLight): LightRig => ({
  key: [-0.85, -0.5], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'top'],
  back: [1, -0.15], backBand: 1,
  backRamp: {skin: PAL.X2, skinD: PAL.X1, hair: PAL.N5, jacket: PAL.N6},
  ramps: light === 'dim' ? DIM : RAMPS,
});

// ------------------------------------------------------------------ the rig
const backFig = (s: NelehMediumState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const g = geo(jaw, s.head === 'front' ? 4 : 0, s.head === 'down' ? 2 : 0);
  const sp = scaleParts(g.parts, K, OX, OY);
  const hairB = sp.filter((p) => p.group === 'hairB');
  const rest = sp.filter((p) => p.group !== 'hairB');
  const arms = armParts(s);
  const parts: Part[] = [...hairB, ...bodyParts(), ...rest, ...arms.back.parts];
  const adjust: Adjust[] = [...bodyAdjust(), ...scaleAdjust(g.adjust, K, OX, OY, false), ...arms.back.adjust];
  return {w: NELEH_MW, h: NELEH_MH, parts, adjust, stamps: faceStamps(s)};
};
const frontFig = (s: NelehMediumState): FigureDef => {
  const ap = armParts(s);
  const a = ap.front;
  // 'write': the uncapped marker in her fist, its felt tip on the sheet (the tip = nelehMediumTip)
  const stamps: Stamp[] = ap.tip ? [{x: Math.round(ap.tip[0]), y: Math.round(ap.tip[1]) - 4, rows: ['....BB', '...bBB', '..bB..', '.bB...', 't.....'], pal: {b: PAL.P0, B: PAL.P2, t: PAL.N0}}] : [];
  return {w: NELEH_MW, h: NELEH_MH, parts: a.parts, adjust: a.adjust, stamps};
};
export const nelehMediumBack = memo((s: NelehMediumState): Img => renderFigure(backFig(s), rigFor(s.light)));
export const nelehMediumFront = memo((s: NelehMediumState): Img => renderFigure(frontFig(s), rigFor(s.light)));
/** the marker's felt tip (local) in 'write' (on step 4), else null */
export const nelehMediumTip = (s: NelehMediumState): [number, number] | null => {
  const t = armParts(s).tip;
  return t ? [Math.round(t[0]), Math.round(t[1])] : null;
};

// the paper + the hands on it + the marker, painted over the BACK image (local coords, then flipped as a whole)
const glowStep: Record<number, number> = {[PAL.N0]: PAL.N1, [PAL.N1]: PAL.U0, [PAL.N2]: PAL.U0, [PAL.N3]: PAL.U1, [PAL.N4]: PAL.U1, [PAL.N5]: PAL.U2, [PAL.N6]: PAL.U2, [PAL.N7]: PAL.U3};
const paintProps = (put: (i: number, j: number, c: number) => void, get: (i: number, j: number) => number, s: NelehMediumState) => {
  const [px, py] = NELEH_M_PAGE;
  const W = PAGE_M[0].length, H = PAGE_M.length;
  // the glow: lift the navy lapel toward plum within 4px, a checker gold ring at 1px (palette steps, never a blend)
  for (let j = -4; j < H + 2; j++) for (let i = -4; i < W + 4; i++) {
    if (i >= 1 && j >= 1 && i < W && j < H) continue;
    const dx = i < 1 ? 1 - i : i >= W ? i - W + 1 : 0, dy2 = j < 1 ? 1 - j : j >= H ? j - H + 1 : 0;
    const d = Math.hypot(dx, dy2);
    const X = px + i, Y = py + j;
    const c = get(X, Y);
    if (c < 0 || d > 4) continue;
    if (d <= 1.01 && ((X + Y) & 1) === 0) { put(X, Y, PAL.W6); continue; }
    if (bayer(X, Y) < 1 - d / 4.5 && glowStep[c] !== undefined) put(X, Y, glowStep[c]);
  }
  const pal: Record<string, number> = {P: PAL.W9, e: PAL.W8, S: PAL.G6, d: PAL.W7, D: PAL.W6, t: PAL.P1, h: PAL.W7, n: PAL.R2};
  PAGE_M.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) put(px + i, py + j, c); } });
  const skin: Record<string, number> = {o: PAL.S1, '2': PAL.S2, '3': PAL.S3, '4': PAL.S4, '5': PAL.W8};
  // the far hand's fingertips hook over the page's right edge (she holds it to her chest in every pose)
  FINGERS_M.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = skin[r[i]]; if (c !== undefined) put(px + W - 2 + i, py + 3 + j, c); } });
  const mk: Record<string, number> = {c: PAL.N0, C: PAL.N2, w: PAL.P1, b: PAL.P0, B: PAL.P2, t: PAL.N0, o: PAL.S1, '3': PAL.S3, '4': PAL.S4};
  const stamp = (rows: string[], x: number, y: number) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = mk[r[i]]; if (c !== undefined) put(x + i, y + j, c); } });
  if (s.arm === 'marker') stamp(MARKER_UP, 43, 60);
  if (s.arm === 'cap') { stamp(MARKER_OFF, 43, 60); stamp(CAP, 31, 59); }
  if (s.arm === 'paper') FINGERS_M.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = skin[r[i]]; if (c !== undefined) put(px - 2 + i, py + 5 + j, c); } });
};

export interface NelehMediumDraw {
  flip?: boolean;
  /** the plate's table top (painted between BACK and FRONT) */
  table?: (b: Buf) => void;
  /** footnote orbit phase (frames); freeze it to STOP; null = none */
  orbit?: number | null;
  /** 0..1+ the footnotes scatter */
  scatter?: number;
  map?: (c: number, x: number, y: number) => number;
  mask?: Uint8Array;
}
/** the footnotes' ring around her head at medium scale (frame coords for a rig at (x, y)) */
export const nelehMediumOrbit = (x: number, y: number, flip = false): FootnoteOrbit => {
  const [cx, cy] = rigPoint({w: NELEH_MW}, x, y, [36, 12], flip);
  return {cx, cy, rx: 20, ry: 4, tilt: flip ? 8 : -8, size: 'sm'};
};
/** Draw NELEH at medium scale with her top-left at (x, y). */
export const drawNelehMedium = (b: Buf, x: number, y: number, s: NelehMediumState, o: NelehMediumDraw = {}) => {
  const set = (X: number, Y: number, v: number) => { b.set(X, Y, o.map ? o.map(v, X, Y) : v); if (o.mask && X >= 0 && Y >= 0 && X < b.w && Y < b.h) o.mask[Y * b.w + X] = 255; };
  const put = (img: Img) => {
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (o.flip ? img.w - 1 - i : i)];
      if (v >= 0) set(x + i, y + j, v);
    }
  };
  const orb = o.orbit === null || o.orbit === undefined ? null : nelehMediumOrbit(x, y, o.flip);
  if (orb) drawFootnotes(b, orb, o.orbit!, 'back', {scatter: o.scatter});
  const back = nelehMediumBack(s);
  put(back);
  // the paper, her hands on it, the marker: local coords mirrored with the figure
  const lx = (i: number) => x + (o.flip ? NELEH_MW - 1 - i : i);
  paintProps((i, j, c) => set(lx(i), y + j, c), (i, j) => (i < 0 || j < 0 || i >= back.w || j >= back.h ? -1 : back.c[j * back.w + i]), s);
  o.table?.(b);
  put(nelehMediumFront(s));
  if (orb) drawFootnotes(b, orb, o.orbit!, 'front', {scatter: o.scatter});
};
