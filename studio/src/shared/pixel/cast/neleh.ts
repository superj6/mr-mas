// MR. MAS — cast: NELEH, "Cassandra With Citations" (Ep1 act 4; new file, owned by the act-4 character artist).
// The one board member who read the charter literally. Principled, never a villain: she is lit like a scholar
// (a warm reading lamp from camera-left, the room's cool navy as a back-rim), never uplit. Her two signatures:
//   1. the GLOWING PAPER (stapled, dog-eared, highlighted), held to her chest like a shield; it glows gold like a
//      grimoire, a soft warm spill on the lapel and the hand, nothing more.
//   2. the ORBITING FOOTNOTES: superscript 1 2 3 on a tilted ring around her head, whole-pixel steps on 2s;
//      numbers behind the head are occluded by it. They can STOP (the hold in sc 26) and SCATTER (sc 29).
// Palette: academic navy blazer (N), a paper-white blouse (P), shoulder-length straight mid-brown hair with a
// centre part (B), fair warm skin (S), gold glow (W).
//   nelehPortrait / drawNelehPortrait  conversation + name-card portrait (112x136): 6 mouths, 3 lids, eye dart,
//                                      brows level / query / worry, the paper, the footnotes
//   drawFootnotes                      the orbit on its own (portrait, tile and room scale)
//   nelehBust / drawNelehTile          video-call tile (front webcam bust, the paper glowing on the desk behind her)
//   drawNelehMini                      the 38x22 mini tile (the grid in Mas's monitor corner)
//   nelehRoom / drawNelehRoom          room sprite, standing, 3/4 facing screen-right: paper / marker up / writing
import {Buf, rect, line, bayer, hash} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg, shiftPrim, blitTo} from './kit';
import {Viseme} from './talk';
import {Clip, TILE_W, TILE_H, clipped, tileClip, bustY} from './calltile';

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ============================================================ the footnotes (superscript 1 2 3, 3x5)
const DIGITS: Record<string, string[]> = {
  '1': ['.#.', '##.', '.#.', '.#.', '###'],
  '2': ['##.', '..#', '.#.', '#..', '###'],
  '3': ['##.', '..#', '.#.', '..#', '##.'],
};
const DIGITS_SM: Record<string, string[]> = { // 2x3, tile + room scale
  '1': ['#.', '#.', '#.'],
  '2': ['#.', '.#', '##'],
  '3': ['##', '.#', '##'],
};
export interface FootnoteOrbit {
  /** orbit centre (frame coords) */
  cx: number; cy: number;
  /** radii and tilt (deg) of the ring */
  rx: number; ry: number; tilt: number;
  /** size: 'lg' 3x5 digits (portrait), 'sm' 2x3 (tile, room) */
  size: 'lg' | 'sm';
}
/**
 * a4p5 (Act Four v5 art pass; additive: v4 never sets it, so v4 draws exactly as before): the FOOTNOTE STYLE.
 *   'digits' (default, v4)  bare gold superscript numerals. The blind read (style-jumps §5.1) and the prep stills check
 *                           read them cold as "debug numbers or dizzy stars", and in a small tile the front "1" sat on
 *                           her forehead like a mark on the skin.
 *   'slips'                 each footnote is a little slip of her glowing paper with its number printed on it: a pale
 *                           card (a gold top edge, a dog-eared corner, a 1 px shadow) carrying the same digit in ink.
 *                           An object passing in front of her head, not a mark on it; the same paper as the charter she
 *                           holds, so "footnote" reads from the prop. The ring is seen from a little below: its near
 *                           half rides over her crown and its far half passes behind her head, so a slip never
 *                           crosses her brow or eyes (in the soft 1.G tiles a slip on the brow became a block there).
 * Set per call with drawFootnotes(..., {style}) or, for everything drawn inside a callback (a v5 frame, a kit's entry
 * point), withFootnoteStyle('slips', () => ...). It is restored afterwards, so v4 layouts rendered in the same process
 * are untouched.
 */
export type FootnoteStyle = 'digits' | 'slips';
let FOOTNOTE_STYLE: FootnoteStyle = 'digits';
export const footnoteStyle = (): FootnoteStyle => FOOTNOTE_STYLE;
export const withFootnoteStyle = <T>(style: FootnoteStyle, fn: () => T): T => {
  const prev = FOOTNOTE_STYLE;
  FOOTNOTE_STYLE = style;
  try { return fn(); } finally { FOOTNOTE_STYLE = prev; }
};
/** one footnote as a paper slip ('slips' style), centred near (x, y) like the digit it replaces */
const drawSlip = (b: Buf, d: string, x: number, y: number, size: 'lg' | 'sm', front: boolean, clip?: Clip) => {
  const set = (px: number, py: number, c: number) => { if (!clip || clip(px, py)) b.set(px, py, c); };
  const lg = size === 'lg';
  const w = lg ? 7 : 4, h = lg ? 9 : 5;
  const X = Math.round(x) - (lg ? 3 : 1), Y = Math.round(y) - (lg ? 4 : 2);
  const paper = front ? PAL.P2 : PAL.P0, edge = front ? PAL.W7 : PAL.W5, ink = front ? PAL.N3 : PAL.G3;
  for (let j = 1; j <= h; j++) set(X + w, Y + j, PAL.N0); // the shadow, right
  for (let i = 1; i <= w; i++) set(X + i, Y + h, PAL.N0); // and below
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(X + i, Y + j, j === 0 ? edge : paper);
  if (lg) set(X + w - 1, Y, PAL.N0); // the dog-ear
  const rows = (lg ? DIGITS : DIGITS_SM)[d];
  const dx = lg ? 2 : 1, dy = lg ? 2 : 1;
  rows.forEach((r, j) => { for (let k = 0; k < r.length; k++) if (r[k] === '#') set(X + dx + k, Y + dy + j, ink); });
};
export const PORTRAIT_ORBIT: FootnoteOrbit = {cx: 60, cy: 26, rx: 38, ry: 8, tilt: -12, size: 'lg'};
/** frames per revolution; positions are held on 2s */
export const FOOTNOTE_PERIOD = 60;
/**
 * The three footnotes at orbit phase `f` (frames; pass a frozen f to STOP them). `layer` picks the half of the
 * ring to draw: 'back' before the figure (occluded by the head), 'front' after it. `scatter` (0..1+) flings each
 * number outward along its own heading, whole pixels (sc 29: "her footnotes scattering like sparks").
 */
export const drawFootnotes = (b: Buf, o: FootnoteOrbit, f: number, layer: 'back' | 'front' | 'all', opts: {scatter?: number; clip?: Clip; col?: number; shade?: number; style?: FootnoteStyle} = {}) => {
  const g = Math.floor(f / 2) * 2;
  const style = opts.style ?? FOOTNOTE_STYLE;
  const th = (o.tilt * Math.PI) / 180;
  ['1', '2', '3'].forEach((d, i) => {
    const t = (g / FOOTNOTE_PERIOD) * Math.PI * 2 + (i * Math.PI * 2) / 3;
    const ex = Math.cos(t) * o.rx, ey = Math.sin(t) * o.ry;
    const front = Math.sin(t) > 0;
    if (layer === 'back' && front) return;
    if (layer === 'front' && !front) return;
    // 'slips': the ring seen from a little below (its near half rides HIGH, over the crown; the far half passes low,
    // behind the head), so a slip never crosses her brow or eyes (a4p5 r2)
    const eyy = style === 'slips' ? -ey : ey;
    let x = o.cx + ex * Math.cos(th) - eyy * Math.sin(th);
    let y = o.cy + ex * Math.sin(th) + eyy * Math.cos(th);
    const s = opts.scatter ?? 0;
    if (s > 0) {
      const a = t + (hash(i, 3, 17) - 0.5) * 1.2;
      x += Math.cos(a) * s * 26;
      y += Math.sin(a) * s * 14 + s * s * 18; // arcs out, then drops
    }
    if (style === 'slips') { drawSlip(b, d, x, y, o.size, front, opts.clip); return; }
    const rows = (o.size === 'lg' ? DIGITS : DIGITS_SM)[d];
    // far side of the ring: one palette step dimmer (depth by palette, never by size)
    const col = front ? (opts.col ?? PAL.W8) : (opts.shade ?? PAL.W6);
    const X = Math.round(x) - 1, Y = Math.round(y) - 2;
    rows.forEach((r, j) => { for (let k = 0; k < r.length; k++) if (r[k] === '#') { const px = X + k, py = Y + j; if (!opts.clip || opts.clip(px, py)) b.set(px, py, col); } });
    // a 1px drop shadow under-right keeps the digits legible over hair and shelf
    if (o.size === 'lg') rows.forEach((r, j) => { for (let k = 0; k < r.length; k++) if (r[k] === '#' && (rows[j + 1]?.[k] !== '#')) { const px = X + k + 1, py = Y + j + 1; if ((!opts.clip || opts.clip(px, py)) && !(rows[j + 1]?.[k + 1] === '#')) b.set(px, py, PAL.W2); } });
  });
};

// ============================================================ conversation portrait (112 x 136)
export const NELEH_PW = 112;
export const NELEH_PH = 136;
export type NelehBrow = 'level' | 'query' | 'worry';
export interface NelehPortraitState {
  mouth: Viseme;
  lid: 0 | 1 | 2;
  /** eye dart: -1 camera-left (toward whoever she addresses), 0 at the viewer, 1 away */
  look: -1 | 0 | 1;
  brow: NelehBrow;
  /** 'down': reading the paper (lids low, eyes down): the precise, citing look */
  gaze?: 'up' | 'down';
}
export const NELEH_PORTRAIT_DEFAULT: NelehPortraitState = {mouth: 'rest', lid: 0, look: -1, brow: 'level'};

const portraitFig = (s: NelehPortraitState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + (v >= 70 ? jaw : 0) : v)));
  const parts: Part[] = [
    // hair behind everything: the back of the head and the fall to the shoulders; a far-side sheet behind the jaw
    {group: 'hairB', mat: 'hair', tone: 1, prims: [P.poly(33, 52, 35, 38, 40, 28, 49, 21, 61, 18, 74, 20, 84, 27, 89, 39, 91, 55, 91, 72, 93, 88, 97, 103, 90, 108, 78, 106, 70, 98, 56, 92, 44, 92, 34, 96, 31, 86, 32, 70)]},
    {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(0, 144, 3, 118, 12, 106, 27, 99, 43, 96, 70, 96, 87, 99, 101, 108, 108, 119, 112, 144)]},
    {group: 'top', mat: 'top', tone: 2, prims: [P.poly(45, 96, 53, 99, 59, 100, 66, 97, 64, 106, 58, 113, 51, 106)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(50, 76, 50, 97, 57, 101, 65, 97, 65, 72)]},
    // head: cranium + the 3/4 face (profile edge camera-left: brow, a straight nose, soft chin)
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 46, 22, 24),
      J(46, 25, 41, 30, 38, 37, 38, 44, 37, 48, 38, 52, 37, 55, 35, 59, 36, 61, 38, 62, 37, 65, 38, 68, 38, 71, 40, 75, 42, 78, 46, 81, 52, 81, 58, 77, 64, 72, 69, 65, 72, 56, 75, 45, 73, 34, 68, 27, 58, 22),
    ]},
    // front hair: the near-side curtain from the centre part over the ear and the back cheek, down to the shoulder
    {group: 'hairN', mat: 'hair', tone: 2, prims: [P.poly(52, 20, 59, 24, 64, 30, 67, 38, 69, 47, 70, 57, 70, 67, 69, 77, 69, 88, 72, 97, 80, 103, 90, 104, 94, 97, 91, 84, 89, 68, 88, 50, 85, 36, 79, 26, 69, 19, 58, 17)]},
    // the far-side sweep from the part to the far temple
    {group: 'hairF', mat: 'hair', tone: 2, prims: [P.poly(53, 20, 46, 22, 41, 26, 38, 32, 37, 40, 38, 44, 40, 37, 43, 31, 48, 26, 54, 23)]},
    // far-side fall: straight, in front of the far shoulder, ends turning in a little
    {group: 'hairFall', mat: 'hair', tone: 2, prims: [P.poly(34, 60, 36, 62, 38, 72, 40, 80, 42, 88, 44, 96, 42, 103, 36, 104, 32, 98, 31, 88, 32, 76)]},
  ];
  const adjust: Adjust[] = [
    // ---- face: lamp from camera-left. Lit forehead + cheekbone + nose ridge (4), the terminator down the near
    // cheek into the hair (2), skinD at the deepest edge
    plane('skin', 4, P.poly(40, 33, 46, 28, 54, 26, 50, 31, 45, 36, 41, 40), P.poly(38, 44, 42, 42, 46, 43, 42, 46, 38, 47), J(38, 62, 42, 62, 44, 66, 40, 70, 38, 68), J(41, 75, 46, 76, 48, 80, 43, 80)),
    plane('skin', 5, P.line(43, 31, 48, 28), P.line(39, 45, 41, 44), P.line(38, 57, 38, 58)),
    plane('skin', 2, J(60, 34, 65, 38, 67, 46, 68, 56, 67, 64, 64, 71, 59, 76, 55, 78, 58, 70, 61, 62, 62, 52, 61, 42)),
    toMat('skin', 'skinD', 2, J(64, 36, 69, 42, 70, 52, 69, 62, 66, 70, 61, 76, 56, 80, 59, 76, 64, 71, 67, 64, 68, 56, 67, 46)),
    // eye sockets (a soft crease, never a dark mask)
    plane('skin', 3, P.poly(38, 48, 43, 47, 44, 50, 38, 51), P.poly(47, 47, 60, 46, 61, 49, 48, 50)),
    // the nose: a lit ridge (5) down to the tip, its shadow side (3) toward the near eye, a cast shadow (skinD)
    // under and right of the tip, the nostril wing
    plane('skin', 2, P.poly(43, 51, 45, 50, 47, 55, 46, 60, 42, 61, 42, 57)),
    toMat('skin', 'skinD', 2, P.poly(45, 56, 47, 56, 47, 60, 44, 61)),
    toMat('skin', 'skinD', 3, P.poly(41, 62, 47, 61, 49, 63, 44, 64)),
    plane('skin', 4, P.poly(40, 51, 42, 51, 41, 57, 38, 59, 38, 57)),
    plane('skin', 5, P.line(41, 52, 39, 57), P.line(36, 59, 37, 59)),
    // cheekbone: a thin lit ridge under the near eye's outer corner (no blush disc)
    plane('skin', 4, P.poly(52, 55, 58, 53, 61, 55, 55, 57)),
    // the jaw: the near cheek turns under toward the neck; a chin highlight; the under-lip shadow
    plane('skin', 2, J(44, 78, 50, 79, 56, 77, 62, 73, 66, 68, 66, 72, 61, 78, 54, 82, 48, 82)),
    plane('skin', 2, J(39, 72, 46, 72, 45, 73, 40, 73)),
    plane('skin', 4, J(41, 75, 45, 75, 46, 78, 42, 78)),
    // the lamp on the forehead: a broad lit plane up-left, its hot edge under the hair sweep
    plane('skin', 5, P.poly(41, 36, 44, 33, 48, 31, 45, 35, 42, 38)),
    // under the jaw on the neck: deepest; the neck's lit strip camera-left
    plane('neck', 0, J(50, 79, 55, 82, 61, 79, 65, 75, 65, 84, 58, 88, 50, 86)),
    plane('neck', 3, P.poly(50, 88, 52, 88, 52, 97, 50, 96)),
    plane('neck', 1, P.poly(60, 84, 65, 80, 65, 97, 60, 99)),
    // ---- hair: long straight strands; the lamp catches the crown near the part and the far sweep
    plane('hair', 3, P.poly(42, 27, 48, 23, 53, 21, 49, 25, 44, 30, 40, 35), P.poly(55, 19, 62, 18, 70, 20, 64, 21, 58, 22)),
    plane('hair', 4, P.line(43, 27, 48, 23), P.line(57, 19, 63, 19), P.line(39, 34, 41, 30)),
    plane('hair', 1, P.line(62, 26, 66, 40), P.line(71, 24, 77, 44), P.line(78, 30, 84, 56), P.line(83, 44, 86, 70), P.line(74, 50, 76, 80), P.line(80, 62, 82, 96), P.line(86, 78, 90, 100)),
    plane('hair', 3, P.line(67, 30, 70, 44), P.line(75, 36, 79, 62), P.line(84, 64, 87, 92), P.line(71, 84, 74, 98)),
    plane('hair', 0, P.poly(69, 70, 70, 77, 70, 88, 72, 96, 69, 94, 68, 84), P.line(52, 20, 52, 22)),
    // the far fall: lit on the lamp side, a dark core
    plane('hair', 3, P.line(33, 66, 32, 92), P.line(35, 63, 38, 76)),
    plane('hair', 1, P.line(38, 84, 41, 100), P.line(36, 80, 35, 100)),
    // ---- blazer: lapels, the lamp across the far shoulder, the near shoulder's shadow, the blouse's collar
    plane('jacket', 3, P.poly(5, 116, 12, 106, 26, 100, 38, 97, 30, 104, 18, 112, 9, 124)),
    plane('jacket', 4, P.poly(5, 114, 12, 105, 24, 100, 15, 108, 8, 118)),
    // lapel notch: left lapel edge + the right lapel in shadow
    plane('jacket', 1, P.poly(44, 97, 50, 107, 56, 115, 52, 122, 46, 108, 42, 99)),
    plane('jacket', 3, P.line(43, 98, 51, 112)),
    plane('jacket', 1, P.poly(66, 98, 70, 97, 68, 108, 60, 118, 58, 114, 64, 104)),
    plane('jacket', 0, P.line(58, 116, 62, 136), P.line(84, 104, 96, 136)),
    plane('jacket', 1, P.poly(88, 102, 101, 109, 107, 122, 110, 144, 98, 144)),
    plane('top', 3, P.poly(46, 97, 53, 99, 52, 103, 48, 100)),
    plane('top', 1, P.poly(62, 98, 66, 97, 63, 106, 60, 104)),
  ];
  // ---- eyes: level, attentive; near eye 12 wide, far eye foreshortened. Iris dart = whole-pixel shift.
  const L = s.gaze === 'down' ? Math.max(1, s.lid) : s.lid;
  const near = L === 2
    ? ['............', '............', '............', '.LLLLLLLLLL.', '..kkkkkkkk..']
    : L === 1
      ? ['............', '............', '.LLLLLLLLLLL', 'LwwiIIgiwww.', '..kkkkkkkk..']
      : ['...LLLLLL...', '.LLLLLLLLLLL', 'LwwiIIgiwww.', '.wwiIIIiww..', '..kkkkkkk...'];
  const far = L === 2
    ? ['......', '......', '......', 'LLLLL.', '.kkk..']
    : L === 1 ? ['......', '......', 'LLLLL.', 'wiIgw.', '.kkk..'] : ['..LL..', 'LLLLL.', 'wiIgw.', 'wiIIw.', '.kkk..'];
  const lookD = s.gaze === 'down' ? 0 : s.look;
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const ch = r.split(''), out = ch.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    ch.forEach((c, i) => { if (/[iIg]/.test(c) && out[i + d] && out[i + d] !== '.') out[i + d] = c; });
    return out.join('');
  });
  // brows: level = precise; query = the near brow lifts (the pointed question); worry = both inner ends lift
  const B = s.brow;
  const nearBrow = B === 'query'
    ? ['.....bbbbbb.', '..bbbb....bb', 'bbb.........']
    : B === 'worry'
      ? ['bb..........', '.bbbbbb.....', '......bbbbbb']
      : ['............', '...bbbbbbbbb', 'bbbb.......b'];
  const farBrow = B === 'worry' ? ['....b', '.bbb.', 'b....'] : B === 'query' ? ['.....', 'bbbbb', '.....'] : ['.....', '.bbbb', 'bb...'];
  const nb = B === 'query' ? -2 : B === 'worry' ? -1 : 0;
  const mouths: Record<Viseme, string[]> = {
    rest: ['...........', 'mmmmmmmmmm.', '.lllllll...'],
    smile: ['.........m.', 'mmmmmmmmm..', '.lllllll...'],
    A: ['...........', 'mmmmmmmmmm.', 'mTTTTTTTm..', 'mdddddddm..', '.mdgggdm...', '..mmmmm....', '...lll.....'],
    E: ['...........', 'mmmmmmmmmmm', 'mTTTTTTTTm.', '.mddddddm..', '..mmmmmm...', '...llll....'],
    O: ['...........', '..mmmmm....', '.mdddddm...', '.mdddddm...', '..mmmmm....', '...lll.....'],
    M: ['...........', 'mmmmmmmmmm.', '.MMMMMMMM..', '..llllll...'],
  };
  const stamps: Stamp[] = [
    {x: 47, y: 42 + nb, rows: nearBrow, pal: {b: PAL.B1}},
    {x: 36, y: 43 + (B === 'worry' ? -1 : 0), rows: farBrow, pal: {b: PAL.B1}},
    {x: 48, y: 46 + (s.gaze === 'down' ? 1 : 0), rows: dart(near, lookD * 2), pal: {L: PAL.N0, w: PAL.S5, i: PAL.B3, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 37, y: 46 + (s.gaze === 'down' ? 1 : 0), rows: dart(far, lookD), pal: {L: PAL.N0, w: PAL.S4, i: PAL.B3, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    // nostril
    {x: 38, y: 60, rows: ['.o', 'o.'], pal: {o: PAL.S1}},
    {x: 37, y: 66, rows: mouths[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0, g: PAL.S2}},
    // a small stud earring would be jewellery-as-character; she gets none. The blouse's top button:
    {x: 57, y: 104, rows: ['o'], pal: {o: PAL.P0}},
  ];
  return {w: NELEH_PW, h: NELEH_PH, parts, adjust, stamps};
};

const PRIG: LightRig = {
  key: [-0.85, -0.5], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'top'],
  back: [1, -0.15], backBand: 1,
  backRamp: {skin: PAL.X2, skinD: PAL.X1, hair: PAL.N5, jacket: PAL.N6},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    skinD: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.B4],
    jacket: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N7],
    top: [PAL.N1, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2],
  },
};

// ---- the paper (held to her chest like a shield): a stapled stack, dog-eared, one highlighted line. It GLOWS:
// the page is the brightest thing in frame, a 1px gold edge, a checker ring, and its light lifts the navy lapel
// toward plum (palette steps, never a blend). Drawn after the figure; the window crops its bottom.
const PAGE = [
  'S.......................ddd.',
  '.SeeeeeeeeeeeeeeeeeeeeeedDd.',
  '.ePPPPPPPPPPPPPPPPPPPPPPdDDd',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPtttttttttttttttPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPttttttttttttPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPhhhhhhhhhhhhhhhhhhPPPPPe',
  '.ePPhtthtttttttthtttthPPPPPe',
  '.ePPhhhhhhhhhhhhhhhhhhPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPtttttttttttttttttPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPtttttttttt.ttttPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPttttttnPPPPPPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPtttttttttttttttttPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPttttttttttttttPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
  '.ePPPPPPPPPPPPPPPPPPPPPPPPPe',
];
// her near hand holds the stack against her chest: four fingertips hook over the right edge toward us,
// their undersides caught by the page's light
const FINGERS = [
  '.ooo.',
  'o455o',
  'o3456',
  '.ooo.',
  'o455o',
  'o3456',
  '.ooo.',
  'o455o',
  'o3456',
  '.ooo.',
  'o345o',
  'o2346',
  '.ooo.',
];
const PAPER_X = 16, PAPER_Y = 106;
const drawPaper = (b: Buf, x: number, y: number, clip: Clip, glow: number) => {
  const pal: Record<string, number> = glow
    ? {P: PAL.W9, e: PAL.W8, S: PAL.G6, d: PAL.W7, D: PAL.W6, t: PAL.P1, h: PAL.W7, n: PAL.R2}
    : {P: PAL.P2, e: PAL.P1, S: PAL.G5, d: PAL.P1, D: PAL.P0, t: PAL.P0, h: PAL.W7, n: PAL.R2};
  const W = PAGE[0].length, H = PAGE.length;
  // the glow first, onto what is already there: lift the lapel toward plum within 7px, gold checker ring at 1px
  if (glow) {
    for (let j = -8; j < H + 2; j++)
      for (let i = -8; i < W + 8; i++) {
        const inside = i >= 1 && j >= 1 && i < W && j < H;
        if (inside) continue;
        const dx = i < 1 ? 1 - i : i >= W ? i - W + 1 : 0, dy = j < 1 ? 1 - j : j >= H ? j - H + 1 : 0;
        const d = Math.hypot(dx, dy);
        const X = x + i, Y = y + j;
        if (!clip(X, Y) || d > 8) continue;
        const bz = bayer(X, Y);
        if (d <= 1.01 && ((X + Y) & 1) === 0) { b.set(X, Y, PAL.W6); continue; }
        if (bz < 1.1 - d / 6) b.set(X, Y, glowStep(b.get(X, Y), d));
      }
  }
  PAGE.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined && clip(x + i, y + j)) b.set(x + i, y + j, c); } });
  const skin: Record<string, number> = {o: PAL.S1, '2': PAL.S2, '3': PAL.S3, '4': PAL.S4, '5': PAL.S5, '6': glow ? PAL.W8 : PAL.S6};
  FINGERS.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = skin[r[i]]; if (c !== undefined && clip(x + W - 3 + i, y + 6 + j)) b.set(x + W - 3 + i, y + 6 + j, c); } });
};
const glowStep = (c: number, d: number) => {
  // light from the page on navy cloth reads as a warm plum, one or two rungs; far pixels only one
  const k = d < 3 ? 2 : 1;
  const map: Record<number, number[]> = {
    [PAL.N0]: [PAL.N1, PAL.U0], [PAL.N1]: [PAL.U0, PAL.U0], [PAL.N2]: [PAL.U0, PAL.U1], [PAL.N3]: [PAL.U1, PAL.U1],
    [PAL.N4]: [PAL.U1, PAL.U2], [PAL.N5]: [PAL.U2, PAL.U2], [PAL.N6]: [PAL.U2, PAL.U3], [PAL.N7]: [PAL.U3, PAL.U3],
    [PAL.P0]: [PAL.P1, PAL.W7], [PAL.P1]: [PAL.P2, PAL.W8],
  };
  const m = map[c];
  return m ? m[k - 1] : c;
};

export const nelehPortrait = memo((s: NelehPortraitState) => renderFigure(portraitFig(s), PRIG));

/** Shelves behind her: an academic's wall of books, dark and out of focus; the reading lamp's pool upper left. */
const bgShelf = (b0: Buf, x: number, y: number, w: number, h: number, clip: Clip) => {
  const b = clipped(b0, clip);
  const lampD = (i: number, j: number) => Math.hypot((i + 14) / (w * 0.95), (j - h * 0.12) / (h * 0.8));
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const d = lampD(i, j);
    const bz = bayer(x + i, y + j);
    b.set(x + i, y + j, d < 0.5 ? PAL.N2 : d < 0.72 ? (bz < (0.72 - d) / 0.22 ? PAL.N2 : PAL.N1) : PAL.N1);
  }
  const spines = [PAL.N3, PAL.N2, PAL.N4, PAL.D1, PAL.N3, PAL.U0, PAL.N2, PAL.D2, PAL.G1];
  for (let s = 0; s < 5; s++) {
    const sy = y + 4 + s * 30;
    let bx = x + ((s * 5) % 4) - 1;
    while (bx < x + w) {
      const bw = 3 + Math.floor(hash(bx, s, 9) * 3);
      const bh = 15 + Math.floor(hash(bx, s, 8) * 7);
      const col = spines[Math.floor(hash(bx, s, 7) * spines.length)];
      const d = lampD(bx - x, sy + 12 - y);
      const lit = d < 0.62;
      const band = hash(bx, s, 4) < 0.3;
      for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) {
        const X = bx + i, Y = sy + 24 - bh + j;
        let c = col;
        if (i === 0) c = PAL.N0;
        else if (i === 1 && lit) c = stepUp(col);
        if (band && lit && i > 0 && (j === 3 || j === bh - 4)) c = PAL.N5;
        b.set(X, Y, c);
      }
      bx += bw + (hash(bx, s, 6) < 0.12 ? 2 : 0);
    }
    // the plank: a lit front edge, a dark underside
    rect(x, sy + 24, w, 3, b.ink(PAL.N2)); rect(x, sy + 24, w, 1, b.ink(lampD(20, sy + 24 - y) < 0.62 ? PAL.D3 : PAL.D2)); rect(x, sy + 27, w, 1, b.ink(PAL.N0));
  }
};
const stepUp = (c: number) => (c === PAL.N4 ? PAL.N5 : c === PAL.N5 ? PAL.N6 : c === PAL.D2 ? PAL.D3 : c === PAL.D3 ? PAL.D4 : c === PAL.U1 ? PAL.U2 : c === PAL.L0 ? PAL.L1 : c === PAL.N3 ? PAL.N4 : c === PAL.R0 ? PAL.R1 : c === PAL.G2 ? PAL.G3 : c);

export interface NelehDrawOpts {
  /** orbit phase (frames). Freeze it to STOP the footnotes. null = no footnotes. */
  orbit?: number | null;
  scatter?: number;
  /** paper glow on/off (it is on in every Ep1 shot) */
  glow?: boolean;
  w?: number; h?: number; ox?: number;
}
/** Portrait window content: shelf, the back half of the orbit, Neleh, the paper, the front half of the orbit. */
export const drawNelehPortrait = (b: Buf, x: number, y: number, s: NelehPortraitState, o: NelehDrawOpts = {}) => {
  const w = o.w ?? NELEH_PW, h = o.h ?? NELEH_PH, ox = o.ox ?? 0;
  const clip = tileClip(x, y, w, h);
  bgShelf(b, x, y, w, h, clip);
  const orbit = o.orbit === undefined ? 0 : o.orbit;
  const OR = {...PORTRAIT_ORBIT, cx: PORTRAIT_ORBIT.cx + x - ox, cy: PORTRAIT_ORBIT.cy + y};
  if (orbit !== null) drawFootnotes(b, OR, orbit, 'back', {clip, scatter: o.scatter});
  blitTo(b, nelehPortrait(s), x - ox, y, {clip});
  drawPaper(b, x + PAPER_X - ox, y + PAPER_Y, clip, o.glow === false ? 0 : 1);
  if (orbit !== null) drawFootnotes(b, OR, orbit, 'front', {clip, scatter: o.scatter});
};

// ============================================================ video-call tile (front webcam bust, 72 x 80)
// A webcam sees her square-on and a touch from below; the room lamp is still the key (camera-left), the laptop
// adds a cool frontal fill (the skin's tone-2 mids go mauve). Mouths: the six visemes at webcam size.
export const NELEH_BUST_W = 72, NELEH_BUST_H = 80;
export interface NelehBustState { mouth: Viseme; lid: 0 | 1 | 2; brow: NelehBrow; }
export const NELEH_BUST_DEFAULT: NelehBustState = {mouth: 'rest', lid: 0, brow: 'level'};
const bustFig = (s: NelehBustState): FigureDef => {
  const jaw = s.mouth === 'A' ? 1 : 0;
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + (v >= 40 ? jaw : 0) : v)));
  const parts: Part[] = [
    {group: 'hairB', mat: 'hair', tone: 1, prims: [P.poly(13, 30, 15, 14, 22, 6, 36, 3, 50, 6, 57, 14, 59, 30, 60, 46, 62, 62, 54, 64, 46, 58, 26, 58, 18, 64, 10, 62, 12, 46)]},
    {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(1, 80, 3, 67, 11, 59, 23, 55, 36, 54, 49, 55, 61, 59, 69, 67, 71, 80)]},
    {group: 'top', mat: 'top', tone: 2, prims: [P.poly(29, 55, 36, 53, 43, 55, 40, 63, 36, 67, 32, 63)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(31, 42, 31, 56, 36, 59, 41, 56, 41, 42)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [J(23, 22, 25, 13, 30, 9, 36, 8, 42, 9, 47, 13, 49, 22, 49, 31, 47, 38, 43, 44, 36, 47, 29, 44, 25, 38, 23, 31)]},
    // centre-parted curtains, falling past the jaw to the shoulders
    {group: 'hairL', mat: 'hair', tone: 2, prims: [P.poly(36, 8, 31, 11, 27, 15, 25, 21, 24, 32, 24, 44, 25, 56, 18, 60, 14, 50, 14, 30, 16, 17, 23, 8)]},
    {group: 'hairR', mat: 'hair', tone: 2, prims: [P.poly(36, 8, 41, 11, 45, 15, 47, 21, 48, 32, 48, 44, 47, 56, 54, 60, 58, 50, 58, 30, 56, 17, 49, 8)]},
    // the crown: hair to a soft hairline, parted in the centre
    {group: 'hairT', mat: 'hair', tone: 2, prims: [P.poly(24, 20, 26, 15, 30, 13, 35, 13, 36, 15, 37, 13, 42, 13, 46, 15, 48, 20, 51, 12, 47, 6, 36, 3, 25, 6, 21, 12)]},
  ];
  const adjust: Adjust[] = [
    // lamp from camera-left: the near cheek and brow lit (4), the far cheek turning off (2), the nose's shadow side
    plane('skin', 4, P.poly(24, 20, 28, 15, 32, 13, 28, 18, 26, 24, 26, 34, 24, 34), P.poly(34, 26, 35, 26, 34, 33, 33, 33)),
    plane('skin', 5, P.line(25, 22, 25, 30)),
    plane('skin', 2, P.poly(43, 17, 48, 22, 48, 32, 45, 39, 43, 30), J(29, 41, 36, 45, 43, 41, 40, 46, 32, 46)),
    plane('skin', 2, P.poly(26, 24, 31, 24, 31, 26, 26, 26), P.poly(40, 24, 45, 24, 45, 26, 40, 26)),
    plane('skin', 2, P.poly(36, 27, 38, 27, 38, 33, 36, 33)),
    toMat('skin', 'skinD', 2, P.poly(36, 34, 39, 33, 39, 35, 36, 35)),
    plane('skin', 2, J(33, 41, 39, 41, 38, 42, 34, 42)),
    plane('neck', 0, J(31, 43, 36, 47, 41, 43, 41, 49, 36, 52, 31, 49)),
    plane('hair', 3, P.poly(24, 14, 30, 9, 27, 14, 24, 22, 23, 30), P.line(34, 8, 30, 10)),
    plane('hair', 4, P.line(25, 15, 28, 11)),
    plane('hair', 1, P.line(36, 7, 36, 9), P.line(47, 18, 49, 40), P.line(52, 30, 54, 56), P.line(17, 30, 17, 54), P.line(20, 40, 21, 56)),
    plane('jacket', 3, P.poly(5, 66, 11, 60, 21, 56, 15, 63, 9, 73)),
    plane('jacket', 1, P.poly(60, 59, 68, 67, 70, 80, 62, 80, 60, 68), P.line(27, 57, 31, 80), P.line(45, 57, 41, 80)),
    plane('top', 3, P.poly(30, 55, 36, 54, 34, 58)),
    plane('top', 1, P.poly(38, 56, 43, 55, 40, 62)),
  ];
  const lid = s.lid;
  const eyes = lid === 2 ? ['..........', '..........', '.kkk...kkk'] : lid === 1 ? ['..........', 'LLLL..LLLL', 'wIIw..wIIw'] : ['.LL....LL.', 'LwIg..wIgL', '.kk....kk.'];
  const brows = s.brow === 'query' ? ['bbbb......', '.....bbbb.', '.........b'] : s.brow === 'worry' ? ['...b..b...', '.bb....bb.', 'b........b'] : ['.bbb..bbb.', 'b........b', '..........'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['.......', 'mmmmmmm', '.lllll.'],
    smile: ['m.....m', '.mmmmm.', '..lll..'],
    A: ['mmmmmmm', 'mTTTTTm', 'mdddddm', '.mdddm.', '..lll..'],
    E: ['mmmmmmm', 'mTTTTTm', '.mdddm.', '..lll..'],
    O: ['..mmm..', '.mdddm.', '.mdddm.', '..mmm..', '..lll..'],
    M: ['.......', 'mmmmmmm', '.MMMMM.', '..lll..'],
  };
  const stamps: Stamp[] = [
    {x: 26, y: 22 - (s.brow === 'query' ? 1 : 0), rows: brows, pal: {b: PAL.B1}},
    {x: 26, y: 25, rows: eyes, pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 35, y: 34, rows: ['o.o'], pal: {o: PAL.S1}},
    {x: 36, y: 5, rows: ['s', 's', 's', 's', 's', 's', 's', 's', 's'], pal: {s: PAL.B4}},
    {x: 33, y: 38, rows: mouths[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0}},
  ];
  return {w: NELEH_BUST_W, h: NELEH_BUST_H, parts, adjust, stamps};
};
const BUST_RIG: LightRig = {
  key: [-0.6, -0.6], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'top'],
  back: [0.9, -0.3], backBand: 1,
  backRamp: {skin: PAL.X2, hair: PAL.N5, jacket: PAL.N6},
  ramps: {
    skin: [PAL.S0, PAL.X1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    skinD: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.B4],
    jacket: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6],
    top: [PAL.N1, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2],
  },
};
export const nelehBust = memo((s: NelehBustState) => renderFigure(bustFig(s), BUST_RIG));

/** tile-scale orbit, relative to the tile's top-left (the bust sits centred, bottom-anchored) */
export const tileOrbit = (x: number, y: number, w: number, h: number): FootnoteOrbit => ({cx: x + Math.round(w / 2) + 1, cy: bustY(y, h, NELEH_BUST_H) + 10, rx: 30, ry: 5, tilt: -10, size: 'lg'});

/** Her tile's room: shelves, and behind her right shoulder a desk where the paper lies, glowing. */
export const nelehTileBg = (b0: Buf, x: number, y: number, w: number, h: number, glow = true) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  bgShelfSmall(b, x, y, w, h);
  // the desk behind her (camera-right): a dark top edge-on, the paper on it throwing a warm pool up the shelf
  const dx = x + Math.round(w * 0.62), dy = y + h - 26;
  rect(dx, dy, w, 3, b.ink(PAL.D2)); rect(dx, dy, w, 1, b.ink(PAL.D3)); rect(dx, dy + 3, w, h, b.ink(PAL.N1));
  if (glow) {
    for (let j = -16; j < 1; j++) for (let i = -14; i < 30; i++) {
      const d = Math.hypot(i - 10, j * 1.6) / 18;
      if (d > 1) continue;
      const X = dx + 14 + i - 10, Y = dy + j;
      const bz = bayer(X, Y);
      if (bz < 1 - d) b.set(X, Y, glowStep(b0.get(X, Y), d * 6));
    }
    // the page, flat on the desk (a thin bright sliver, foreshortened), its light edge
    rect(dx + 7, dy - 2, 16, 2, b.ink(PAL.W9)); rect(dx + 9, dy - 3, 12, 1, b.ink(PAL.W8)); rect(dx + 11, dy - 2, 7, 1, b.ink(PAL.W7));
    b.set(dx + 6, dy - 1, PAL.W6); b.set(dx + 23, dy - 1, PAL.W6); b.set(dx + 8, dy - 3, PAL.W6); b.set(dx + 21, dy - 3, PAL.W6);
    for (const [i, j] of [[4, -6], [26, -8], [15, -11], [9, -9]] as const) b.set(dx + i, dy + j, PAL.W5);
  }
};
const bgShelfSmall = (b: Buf, x: number, y: number, w: number, h: number) => {
  rect(x, y, w, h, b.ink(PAL.N1));
  const spines = [PAL.N3, PAL.N2, PAL.N4, PAL.D1, PAL.N3, PAL.U0, PAL.N2, PAL.D2, PAL.G1];
  for (let s = 0; s < 4; s++) {
    const sy = y + 3 + s * 21;
    let bx = x + ((s * 3) % 4) - 1;
    while (bx < x + w) {
      const bw = 2 + Math.floor(hash(bx, s, 19) * 3);
      const bh = 10 + Math.floor(hash(bx, s, 18) * 6);
      rect(bx, sy + 17 - bh, bw, bh, b.ink(spines[Math.floor(hash(bx, s, 17) * spines.length)]));
      rect(bx, sy + 17 - bh, 1, bh, b.ink(PAL.N0));
      bx += bw + (hash(bx, s, 16) < 0.12 ? 2 : 0);
    }
    rect(x, sy + 17, w, 2, b.ink(PAL.D1)); rect(x, sy + 17, w, 1, b.ink(PAL.D2)); rect(x, sy + 19, w, 1, b.ink(PAL.N0));
  }
};

export interface NelehTileOpts {
  /** footnote orbit phase (frames); freeze it to STOP the orbit; null hides it */
  orbit?: number | null;
  scatter?: number;
  glow?: boolean;
}
/** The whole tile content (bg + orbit + bust), clipped to (x, y, w, h). Chrome (label, vote icon) is the caller's. */
export const drawNelehTile = (b: Buf, x: number, y: number, w: number, h: number, s: NelehBustState, o: NelehTileOpts = {}) => {
  const clip = tileClip(x, y, w, h);
  nelehTileBg(b, x, y, w, h, o.glow !== false);
  const OR = tileOrbit(x, y, w, h);
  const orbit = o.orbit === undefined ? 0 : o.orbit;
  if (orbit !== null) drawFootnotes(b, OR, orbit, 'back', {clip, scatter: o.scatter});
  blitImg(b, nelehBust(s), x + Math.round(w / 2 - NELEH_BUST_W / 2), bustY(y, h, NELEH_BUST_H), {clip});
  if (orbit !== null) drawFootnotes(b, OR, orbit, 'front', {clip, scatter: o.scatter});
};

/** 38 x 22 mini tile (Mas's monitor corner): shelf strips, the bust as five shapes, the paper's warm dot. */
export const drawNelehMini = (b0: Buf, x: number, y: number, w = 38, h = 22) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  rect(x, y, w, h, b.ink(PAL.N1));
  for (let s = 0; s < 3; s++) { rect(x, y + 5 + s * 7, w, 1, b.ink(PAL.D2)); for (let i = 1; i < w; i += 3) if (hash(i, s, 3) < 0.6) rect(x + i, y + 1 + s * 7, 2, 4, b.ink(hash(i, s, 4) < 0.5 ? PAL.N3 : PAL.D1)); }
  rect(x + w - 11, y + h - 6, 5, 1, b.ink(PAL.W8));
  const cx = x + Math.floor(w / 2);
  rect(cx - 5, y + 4, 10, 16, b.ink(PAL.B2));
  rect(cx - 9, y + h - 4, 18, 4, b.ink(PAL.N3));
  rect(cx - 3, y + 6, 6, 8, b.ink(PAL.S4));
  rect(cx - 3, y + 6, 2, 8, b.ink(PAL.S5));
  rect(cx - 1, y + 14, 2, 3, b.ink(PAL.S2));
  b.set(cx - 2, y + 9, PAL.N0); b.set(cx + 1, y + 9, PAL.N0);
  rect(cx - 1, y + 12, 2, 1, b.ink(PAL.S1));
  rect(cx - 1, y + h - 4, 2, 2, b.ink(PAL.P1));
};

// ============================================================ room sprite (standing, 3/4 facing screen-right)
// ~78 px tall (a 5.5-head adult). Body on the figure rig, head hand-pixelled as a tone map. Light states:
//   'room'  the boardroom at night: tungsten pendant above the table (key, up-right), the dark window's cool rim
//   'sil'   black silhouette with the cool rim only (for the doorway / window beats)
//   'fade'  two rungs down (out of the light pool)
// Arms (the near arm is screen-right): 'paper' both hands hold the glowing paper to her chest; 'marker' the marker
// raised, uncapped; 'write0'/'write1' the marker down on the blueprint (two drawings, the writing wiggle).
export const NELEH_W = 44;
export const NELEH_H = 82;
/** local feet centre / sole line */
export const NELEH_FOOT: [number, number] = [20, 80];
/** where the marker's tip is in each pose (local), for the blueprint builder's ink */
export const NELEH_MARKER_TIP: Record<'marker' | 'write0' | 'write1', [number, number]> = {marker: [36, 27], write0: [38, 43], write1: [39, 43]};
export type NelehArm = 'paper' | 'marker' | 'write0' | 'write1';
export type NelehLight = 'room' | 'sil' | 'fade';
export interface NelehRoomPose { arm: NelehArm; mouth: 'rest' | 'open'; blink: boolean; light: NelehLight; }
export const NELEH_ROOM_DEFAULT: NelehRoomPose = {arm: 'paper', mouth: 'rest', blink: false, light: 'room'};

const HEAD_ROWS = [
  '.....ohhhhho....',
  '...ohHHIIIHHho..',
  '..ohHIIJJIIHHho.',
  '.chHIIJJIIHHHho.',
  '.cHHIIIIHHHh34o.',
  'cHHIIIHHHhh344o.',
  'cHHIIHHHHh23b4b.',
  'cHHIHHHHh234e4eo',
  'cHHIHHHHh234444o',
  'cHHIHHHHh2334455',
  'cHHIHHHHh223444o',
  'cHHIHHHHh1223m4o',
  'cHHIHHHHho12334o',
  'cHHIHHHHh.o1223o',
  'cHHIHHHHh..oooo.',
  'cHHIHHHHh..o2o..',
  '.cHIHHHHh..o2o..',
  '.cHIIHHh...o1o..',
  '..cHIHhh........',
  '..cHHhh.........',
  '...chh..........',
];
const headStamp = (p: NelehRoomPose): Stamp => {
  const rows = HEAD_ROWS.slice();
  if (p.blink) rows[7] = 'cHHIHHHHh234b4bo';
  if (p.mouth === 'open') { rows[11] = 'cHHIHHHHh1223M4o'; rows[12] = 'cHHIHHHHho12M34o'; }
  return {x: 12, y: 0, rows, pal: {
    o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
    h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], c: ['rim', 0],
    b: ['hair', 0], e: ['eye', 0], m: ['skin', 1], M: ['eye', 0],
  }};
};
type Leg = {hip: number; kx: number; ky: number; ax: number; ay: number};
const RLEGS: {n: Leg; f: Leg} = {n: {hip: 22, kx: 22.4, ky: 60, ax: 22.6, ay: 74}, f: {hip: 16.5, kx: 16.4, ky: 60, ax: 16, ay: 74}};
const legParts = (l: Leg, near: boolean): Part[] => {
  const g = near ? 'legN' : 'legF';
  const foot = P.poly(l.ax - 2.4, l.ay, l.ax + 2.6, l.ay, l.ax + 6.4, l.ay + 3.4, l.ax + 6.4, l.ay + 5.6, l.ax - 2.8, l.ay + 5.6);
  return [
    {group: g, mat: 'pants', prims: [seg(l.hip, 45, 7.4, l.kx, l.ky, 5.8), seg(l.kx, l.ky, 5.6, l.ax, l.ay + 1, 4.6), P.ell(l.kx, l.ky, 2.8, 2.6)]},
    {group: g + 's', mat: 'shoe', prims: [foot]},
  ];
};
const sleeve = (group: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part[] => [
  {group, mat: 'jacket', prims: [P.ell(sx, sy, 3.4, 3.6), seg(sx, sy, 6.2, ex, ey, 5.4), seg(ex, ey, 5.2, hx, hy, 4.6), P.ell(ex, ey, 2.6, 2.6)]},
];
const ARMS: Record<NelehArm, {near: [number, number, number, number]; hand: [number, number]; far: [number, number, number, number]; farHand: [number, number]}> = {
  // [elbow x, y, wrist x, y]
  paper: {near: [26, 33, 25, 29], hand: [24, 28], far: [15, 33, 20, 30], farHand: [21, 29]},
  marker: {near: [28, 34, 33, 28], hand: [34, 27], far: [14, 33, 14.4, 41], farHand: [14.6, 42]},
  write0: {near: [29, 34, 35, 40], hand: [36, 41], far: [14, 33, 14.4, 41], farHand: [14.6, 42]},
  write1: {near: [29, 34, 36, 40], hand: [37, 41], far: [14, 33, 14.4, 41], farHand: [14.6, 42]},
};
const roomFig = (p: NelehRoomPose): FigureDef => {
  const A = ARMS[p.arm];
  const parts: Part[] = [
    ...legParts(RLEGS.f, false),
    ...sleeve('armF', 15, 23, A.far[0], A.far[1], A.far[2], A.far[3]),
    ...legParts(RLEGS.n, true),
    // blazer: shoulders, a nipped waist, the hem over the hips
    {group: 'torso', mat: 'jacket', prims: [P.poly(15, 19, 21, 18, 26, 19, 29, 23, 29, 29, 28, 35, 27, 39, 29, 47, 12, 47, 13, 40, 12, 34, 12, 24)]},
    {group: 'top', mat: 'top', prims: [P.poly(19, 18, 26, 18, 25, 20, 23, 25, 22, 25, 20, 20)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(20, 15, 24, 15, 24, 19, 20, 19)]},
    ...sleeve('armN', 26, 23, A.near[0], A.near[1], A.near[2], A.near[3]),
  ];
  const stamps: Stamp[] = [headStamp(p)];
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  if (p.arm === 'paper') {
    // the paper against her chest, both hands on it; it glows
    stamps.push({x: 20, y: 25, rows: ['gPPPPd', 'gPPPPd', 'gPPPPd', 'gPPPPd', 'gPPPPd', 'gPPPPd', '.gggg.'], pal: {P: ['paper', 2], g: ['paper', 3], d: ['paper', 1]}});
    stamps.push(hand(A.farHand[0], A.farHand[1]), hand(A.hand[0], A.hand[1]));
  } else {
    // the paper in the far hand at her side (a bright sliver), the marker in the near hand
    stamps.push({x: Math.round(A.farHand[0]) - 2, y: Math.round(A.farHand[1]) - 1, rows: ['gP', 'gP', 'gP', 'gP', 'gP', 'gP', 'g.'], pal: {P: ['paper', 2], g: ['paper', 3]}});
    stamps.push(hand(A.farHand[0], A.farHand[1]));
    const [tx, ty] = NELEH_MARKER_TIP[p.arm];
    // marker: a short dark barrel, the felt tip, held like a pen
    const mk = p.arm === 'marker' ? ['..kt', '.kk.', 'kk..', 'k...'] : ['k...', '.k..', '..k.', '...t'];
    stamps.push({x: tx - 3, y: ty - (p.arm === 'marker' ? 0 : 3), rows: mk, pal: {k: ['marker', 0], t: ['marker', 1]}});
    stamps.push(hand(A.hand[0], A.hand[1]));
  }
  return {
    w: NELEH_W, h: NELEH_H, parts,
    adjust: [
      // lapels + the blouse's V; the hem; trousers darker toward the floor (out of the pendant's pool)
      {prims: [P.line(25, 20, 23, 27), P.line(20, 20, 21, 27)], tone: 1, onlyMat: 'jacket'},
      {prims: [P.line(22, 27, 22, 46)], tone: 1, onlyMat: 'jacket'},
      {prims: [P.line(13, 46, 28, 46)], tone: 1, onlyMat: 'jacket'},
      {prims: [P.rect(0, 62, NELEH_W, 20)], add: -1, onlyMat: 'pants'},
    ],
    stamps,
  };
};
const RLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.B4],
  jacket: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N7],
  top: [PAL.N1, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2],
  pants: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5],
  shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  rim: [PAL.N6, PAL.N6, PAL.N6, PAL.N6, PAL.N6, PAL.N6],
  eye: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
  paper: [PAL.W6, PAL.W8, PAL.W9, PAL.W7, PAL.W7, PAL.W7],
  marker: [PAL.N0, PAL.R3, PAL.R3, PAL.R3, PAL.R3, PAL.R3],
};
const dimR = (r: number[], k: number) => r.map((_, i) => r[Math.max(0, i - k)]);
const RFADE = Object.fromEntries(Object.entries(RLIT).map(([k, r]) => [k, k === 'paper' ? r : dimR(r, 2)]));
const RSIL: Record<string, number[]> = Object.fromEntries(Object.keys(RLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
RSIL.rim = [PAL.C6, PAL.C6, PAL.C6, PAL.C6, PAL.C6, PAL.C6];
RSIL.paper = RLIT.paper;
const roomRig = (light: NelehLight): LightRig => ({
  key: [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.C6, hair: PAL.C6, jacket: PAL.C6, pants: PAL.C5, shoe: PAL.C4} : {skin: PAL.X2, hair: PAL.N5, jacket: PAL.N6, pants: PAL.N4, shoe: PAL.N3},
  ramps: light === 'room' ? RLIT : light === 'fade' ? RFADE : RSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 46 ? 1 : Math.max(0.25, 1 - (y - 46) / 34)),
});
export const nelehRoom = memo((p: NelehRoomPose) => renderFigure(roomFig(p), roomRig(p.light)));
/** Draw with the feet on (footX, footY). flip = face screen-left. */
export const drawNelehRoom = (b: Buf, footX: number, footY: number, p: NelehRoomPose, opts: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array} = {}) => {
  const img = nelehRoom(p);
  const fx = opts.flip ? NELEH_W - 1 - NELEH_FOOT[0] : NELEH_FOOT[0];
  blitImg(b, img, footX - fx, footY - NELEH_FOOT[1], {flip: opts.flip, map: opts.map, mask: opts.mask});
};
/** room-scale footnote orbit around her head, for drawFootnotes (feet at footX, footY; unflipped) */
export const roomOrbit = (footX: number, footY: number): FootnoteOrbit => ({cx: footX + 1, cy: footY - NELEH_FOOT[1] + 3, rx: 11, ry: 3, tilt: -8, size: 'sm'});
