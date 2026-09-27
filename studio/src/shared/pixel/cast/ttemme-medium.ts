// MR. MAS — cast: TTEMME at MEDIUM / TWO-SHOT scale (CAST-TTEMME-MEDIUM; Ep1 Act Four v5 art pass; new file, owned by the
// v5 art pass). S4.10b [2S] (Neleh and Ttemme across the table: "Ttemme, we'd like you to serve as interim CEO.") and
// S4.13c [M] (Ttemme in the CEO chair, Tasya soft in the door beyond: the nod). Seated at the head of the table in the
// CEO chair: the off-brand streaming-purple hoodie, the headset with its boom mic and live LED.
// The head is the APPROVED PORTRAIT's geometry (cast/ttemme.ts portraitFig: hood, torso, neck, roll, head, ear, hair,
// band, cup, boom, foam; copied here 2026-09-26 because it is not exported), re-rasterized at half size (medium-kit
// scaleParts: vector geometry, never a scaled sprite), the way mada-medium.ts builds MADA. Every face feature is
// hand-placed at this size: six mouths, three lids, the eye dart, brows level / hype / unsure.
//   heads (2 drawings)  '34' toward camera-left (authored; flip to face camera-right) · 'down' reading (behind the
//                       folder, at the sand): lids lowered, the face tipped a pixel
//   nod                 0 | 1 | 2: the head drops a whole pixel, then two ("Ttemme nods back": 0,1,2,1,0 on 2s)
//   arms (3 drawings)   'rest' both forearms on the table · 'folder' both hands up at a folder held in front of him (the
//                       folder is kits/folder.ts, drawn by drawTtemmeMedium at TTEMME_M_FOLDER) · 'hourglass' his near
//                       hand round the hourglass on the table
//   light               'room' the boardroom's pendant (a cool top key) · 'spot' the spotlight that found him (S4.10:
//                       a warm top key, his purple kept)
// DRAW ORDER (as MADA): ttemmeMediumBack -> the table top over rows >= TTEMME_M_TABLE -> ttemmeMediumFront (forearms,
// hands) -> the props (hourglass, folder) -> the chat panel (kits/chat-panel.ts, beside him, optional).
import {Buf} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure} from '../figure';
import {memo} from './kit';
import {Viseme} from './talk';
import {scaleParts, scaleAdjust, dartRows, rigPoint, handParts, sleeveParts, V2} from './medium-kit';
import {drawHourglass, HourglassState} from './ttemme';
import {drawFolder, FolderState} from '../kits/folder';

export const TTEMME_MW = 72;
export const TTEMME_MH = 100;
/** local row of the table top's FAR edge */
export const TTEMME_M_TABLE = 80;
/** his face (the eye line), for eyelines */
export const TTEMME_M_FACE: [number, number] = [30, 27];
/** where the folder's centre sits when he holds it up (local) */
export const TTEMME_M_FOLDER: [number, number] = [34, 70];
const K = 0.5, OX = 8, OY = 4;

export type TtemmeMHead = '34' | 'down';
export type TtemmeMArm = 'rest' | 'folder' | 'hourglass';
export type TtemmeMBrow = 'level' | 'hype' | 'unsure';
export type TtemmeMLight = 'room' | 'spot';
export interface TtemmeMediumState {
  head: TtemmeMHead;
  mouth: Viseme;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  brow: TtemmeMBrow;
  nod: 0 | 1 | 2;
  arm: TtemmeMArm;
  light: TtemmeMLight;
}
export const TTEMME_MEDIUM_DEFAULT: TtemmeMediumState = {head: '34', mouth: 'rest', lid: 0, look: 0, brow: 'level', nod: 0, arm: 'rest', light: 'room'};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ------------------------------------------------------------------ the portrait's geometry (portrait space, 112 x 136)
const headGeo = (jaw: number, n: number) => {
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + n + (v >= 74 ? jaw : 0) : v)));
  const H = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + n : v)));
  const HL = (x0: number, y0: number, x1: number, y1: number) => P.line(x0, y0 + n, x1, y1 + n);
  const parts: Part[] = [
    {group: 'hood', mat: 'hood', tone: 1, prims: [P.poly(56, 98, 60, 88, 72, 82, 88, 85, 100, 94, 106, 108, 92, 106, 74, 101)]},
    {group: 'torso', mat: 'hood', tone: 2, prims: [P.poly(2, 144, 5, 118, 13, 106, 27, 99, 42, 96, 70, 96, 88, 100, 102, 110, 110, 144)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(50, 78, 50, 98, 58, 101, 67, 97, 67, 74)]},
    {group: 'roll', mat: 'hood', tone: 2, prims: [P.poly(34, 101, 42, 95, 50, 97, 58, 99, 66, 98, 74, 96, 81, 97, 78, 102, 68, 105, 56, 106, 44, 105)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 48 + n, 24, 25),
      J(42, 28, 38, 35, 36, 42, 36, 48, 35, 53, 36, 58, 36, 64, 38, 71, 41, 77, 45, 82, 51, 85, 58, 84, 65, 80, 71, 74, 75, 66, 77, 56, 79, 46, 77, 35, 70, 27, 58, 23, 48, 23),
    ]},
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(72, 51, 76, 48, 80, 50, 81, 58, 78, 66, 73, 67, 71, 61)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      H(36, 44, 34, 34, 38, 25, 46, 18, 57, 15, 69, 16, 79, 22, 85, 31, 86, 44, 84, 56, 80, 50, 77, 40, 72, 35, 64, 33, 56, 34, 48, 33, 42, 36, 38, 42),
      H(40, 24, 36, 19, 42, 20, 45, 16, 49, 19, 54, 14, 57, 18, 62, 13, 64, 17, 70, 14, 70, 19, 60, 22, 48, 24),
    ]},
    {group: 'band', mat: 'kit', tone: 2, prims: [H(40, 30, 44, 20, 52, 14, 62, 12, 72, 15, 80, 22, 84, 32, 85, 46, 82, 46, 81, 33, 77, 24, 70, 18, 62, 16, 53, 17, 46, 22, 43, 30)]},
    {group: 'cup', mat: 'kit', tone: 2, prims: [P.ell(79, 57 + n, 7, 9)]},
    {group: 'boom', mat: 'kit', tone: 2, prims: [H(74, 63, 76, 65, 70, 72, 60, 77, 51, 78, 51, 76, 60, 75, 69, 70)]},
    {group: 'foam', mat: 'foam', tone: 2, prims: [P.ell(48.5, 77 + n, 3.5, 3)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(40, 37 + n, 47, 35 + n, 55, 36 + n, 50, 39 + n, 44, 40 + n, 39, 42 + n), J(37, 52, 39, 51, 40, 58, 37, 60)),
    plane('skin', 2, J(63, 35, 69, 38, 71, 46, 71, 58, 71, 67, 67, 75, 61, 80, 57, 81, 61, 73, 64, 63, 64, 51, 62, 41)),
    toMat('skin', 'skinD', 2, J(69, 38, 75, 40, 78, 48, 77, 58, 75, 67, 71, 75, 64, 81, 58, 84, 57, 81, 61, 80, 67, 75, 71, 67, 71, 58, 71, 46)),
    plane('neck', 0, J(51, 83, 56, 85, 64, 81, 70, 76, 69, 85, 60, 89, 51, 88)),
    plane('hair', 1, HL(72, 20, 62, 33), HL(64, 17, 55, 32), HL(80, 28, 70, 36)),
    plane('hair', 3, H(36, 33, 39, 26, 45, 21, 41, 28, 38, 35)),
    plane('kit', 4, HL(46, 21, 52, 16), HL(53, 16, 62, 14)),
    toMat('kit', 'pad', 2, P.ell(78, 57 + n, 4.5, 6.5)),
    // hoodie: the rolled hood edge lit, the chest's fold, the drawstrings
    plane('hood', 3, P.poly(35, 101, 42, 96, 50, 98, 44, 100, 38, 103)),
    plane('hood', 3, P.poly(8, 118, 14, 107, 26, 101, 36, 99, 30, 105, 20, 112, 12, 124)),
    plane('hood', 1, P.line(62, 108, 71, 144), P.line(84, 106, 98, 144)),
    plane('hood', 4, P.line(47, 106, 45, 121), P.line(57, 107, 58, 119)),
  ];
  return {parts, adjust};
};

// ------------------------------------------------------------------ the medium-native body (local coords)
const bodyParts = (): Part[] => [
  // the hoodie from the shoulders down to the table: straight sides, the pocket's line
  {group: 'body', mat: 'hood', tone: 2, prims: [P.poly(13, 100, 10, 76, 12, 64, 18, 58, 60, 58, 64, 64, 64, 76, 60, 100)]},
];
const bodyAdjust = (): Adjust[] => [
  plane('hood', 1, P.poly(9, 76, 12, 70, 13, 100, 9, 100), P.poly(64, 76, 61, 70, 60, 100, 63, 100)),
  plane('hood', 1, P.line(22, 84, 50, 84)), // the kangaroo pocket's top edge
  plane('hood', 3, P.line(23, 83, 49, 83)),
  plane('hood', 1, P.line(36, 62, 36, 80)), // the zip-less front seam
];
// forearms on the table (the FRONT layer), lit from above
const LIT: V2 = [-0.3, -0.95];
const armsBuild = (arm: TtemmeMArm) => {
  const parts: Part[] = [], adjust: Adjust[] = [];
  const out: {L?: V2; R?: V2} = {};
  if (arm === 'folder') {
    // both hands up at the folder's sides (the folder covers the rest): only the hands and cuffs show, drawn with the prop
    return {parts, adjust, out};
  }
  const A = arm === 'rest'
    ? [{s: 'L', elbow: [15, 82] as V2, wrist: [25, 91] as V2, dir: [0.6, 1] as V2, thumb: -1 as const}, {s: 'R', elbow: [57, 82] as V2, wrist: [47, 91] as V2, dir: [-0.6, 1] as V2, thumb: 1 as const}]
    : [{s: 'L', elbow: [15, 82] as V2, wrist: [25, 91] as V2, dir: [0.6, 1] as V2, thumb: -1 as const}, {s: 'R', elbow: [57, 82] as V2, wrist: [52, 90] as V2, dir: [-0.1, 1] as V2, thumb: 1 as const}];
  for (const a of A) {
    const sv = sleeveParts('fore' + a.s, a.elbow, a.wrist, {w0: 10, w1: 8, mat: 'hood', lit: LIT});
    const hd = handParts('hand' + a.s, {at: a.wrist, dir: a.dir, thumb: a.thumb, len: 10, width: 8, curl: arm === 'hourglass' && a.s === 'R' ? 0.6 : 0.3}, 'skin', LIT);
    parts.push(...sv.parts, ...hd.parts); adjust.push(...sv.adjust, ...hd.adjust);
    out[a.s as 'L' | 'R'] = hd.tip;
  }
  return {parts, adjust, out};
};

// ------------------------------------------------------------------ the face at medium size (local coords)
// L lid · w white · i iris · I pupil · k lower lid · b brow · o nostril · m mouth line · t teeth · d dark · l lower lip
const EYE_N: Record<0 | 1 | 2, string[]> = {0: ['.LLLL.', 'wiIww.', '.kkk..'], 1: ['......', 'LLLLL.', 'wiIww.'], 2: ['......', '......', 'LLLLL.']};
const EYE_F: Record<0 | 1 | 2, string[]> = {0: ['.LL.', 'wIw.', '.kk.'], 1: ['....', 'LLL.', 'wIw.'], 2: ['....', '....', 'LLL.']};
const BROW_N: Record<TtemmeMBrow, string[]> = {level: ['.bbbbb', 'bb....'], hype: ['..bbbb', '.b....'], unsure: ['bb....', '..bbbb']};
const BROW_F: Record<TtemmeMBrow, string[]> = {level: ['bbb', '...'], hype: ['.bb', 'b..'], unsure: ['b..', '.bb']};
const MOUTH: Record<Viseme, string[]> = {
  rest: ['......', 'mmmmm.', '.lll..'],
  smile: ['....m.', 'mmmm..', '.lll..'],
  A: ['......', 'mmmmm.', 'mtttm.', '.mdm..', '..l...'],
  E: ['......', 'mmmmmm', 'mttttm', '.mmmm.', '..ll..'],
  O: ['......', '.mmm..', 'mdddm.', '.mmm..', '..l...'],
  M: ['......', 'mmmmm.', '.MMMM.', '.lll..'],
};
const faceStamps = (s: TtemmeMediumState): Stamp[] => {
  const n = s.nod + (s.head === 'down' ? 1 : 0);
  const lid = s.head === 'down' ? (s.lid === 2 ? 2 : 1) : s.lid;
  const look = s.head === 'down' ? 0 : s.look;
  const eyePal = {L: PAL.N0, w: PAL.S5, i: PAL.B2, I: PAL.N0, k: PAL.X1};
  const bn = s.brow === 'hype' ? -1 : 0;
  return [
    {x: 32, y: 24 + n + bn, rows: BROW_N[s.brow], pal: {b: PAL.B0}},
    {x: 25, y: 24 + n + bn, rows: BROW_F[s.brow], pal: {b: PAL.B0}},
    {x: 32, y: 26 + n, rows: dartRows(EYE_N[lid], look), pal: eyePal},
    {x: 25, y: 26 + n, rows: dartRows(EYE_F[lid], look), pal: eyePal},
    {x: 29, y: 35 + n, rows: ['o.'], pal: {o: PAL.S0}},
    {x: 27, y: 38 + n, rows: MOUTH[s.mouth], pal: {m: PAL.S0, M: PAL.X0, l: PAL.X2, t: PAL.P1, d: PAL.N0}},
    // the headset's live LED on the cup (always live)
    {x: 49, y: 30 + n, rows: ['r'], pal: {r: PAL.R3}},
  ];
};

// ------------------------------------------------------------------ lights
const RAMPS = (l: TtemmeMLight): Record<string, number[]> => ({
  skin: [PAL.S0, PAL.X1, PAL.S3, PAL.S4, PAL.S5, l === 'spot' ? PAL.S6 : PAL.S5],
  skinD: [PAL.S0, PAL.S0, PAL.X1, PAL.X2, PAL.S3, PAL.S4],
  neck: [PAL.S0, PAL.X0, PAL.X1, PAL.S3, PAL.S4, PAL.S5],
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B3],
  hood: [PAL.N0, PAL.U0, PAL.U1, PAL.U2, PAL.U3, l === 'spot' ? PAL.U4 : PAL.U3],
  kit: [PAL.N0, PAL.N1, PAL.G0, PAL.G1, PAL.G3, PAL.G4],
  pad: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N2],
  foam: [PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G2, PAL.G3],
});
const rigFor = (l: TtemmeMLight): LightRig => ({
  key: [-0.35, -0.94], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'pad', 'foam'],
  back: [0.95, -0.2], backBand: 1,
  backRamp: l === 'spot' ? {skin: PAL.S5, skinD: PAL.S4, hair: PAL.B3, hood: PAL.U4, kit: PAL.G3} : {skin: PAL.S4, skinD: PAL.S3, hair: PAL.G2, hood: PAL.U3, kit: PAL.G2},
  ramps: RAMPS(l),
});

// ------------------------------------------------------------------ the rig
const backFig = (s: TtemmeMediumState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const n = s.nod * 2 + (s.head === 'down' ? 2 : 0);
  const g = headGeo(jaw, n);
  const parts: Part[] = [...bodyParts(), ...scaleParts(g.parts, K, OX, OY)];
  const adjust: Adjust[] = [...bodyAdjust(), ...scaleAdjust(g.adjust, K, OX, OY, true)];
  return {w: TTEMME_MW, h: TTEMME_MH, parts, adjust, stamps: faceStamps(s)};
};
const frontFig = (s: TtemmeMediumState): FigureDef => {
  const a = armsBuild(s.arm);
  return {w: TTEMME_MW, h: TTEMME_MH, parts: a.parts, adjust: a.adjust};
};
export const ttemmeMediumBack = memo((s: TtemmeMediumState): Img => renderFigure(backFig(s), rigFor(s.light)));
export const ttemmeMediumFront = memo((s: TtemmeMediumState): Img => renderFigure(frontFig(s), rigFor(s.light)));

export interface TtemmeMediumDraw {
  flip?: boolean;
  /** the table top, painted between the BACK and the FRONT images */
  table?: (b: Buf) => void;
  /** the hourglass on the table by his near hand ('hourglass' arm), or null */
  hourglass?: HourglassState | null;
  /** the folder in his hands ('folder' arm) */
  folder?: FolderState | null;
  f?: number;
  map?: (c: number, x: number, y: number) => number;
  mask?: Uint8Array;
}
/** Draw Ttemme at medium scale with his top-left at (x, y). */
export const drawTtemmeMedium = (b: Buf, x: number, y: number, s: TtemmeMediumState, o: TtemmeMediumDraw = {}) => {
  const put = (img: Img) => {
    for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (o.flip ? img.w - 1 - i : i)];
      if (v < 0) continue;
      const X = x + i, Y = y + j;
      b.set(X, Y, o.map ? o.map(v, X, Y) : v);
      if (o.mask && X >= 0 && Y >= 0 && X < b.w && Y < b.h) o.mask[Y * b.w + X] = 255;
    }
  };
  put(ttemmeMediumBack(s));
  o.table?.(b);
  put(ttemmeMediumFront(s));
  if (s.arm === 'hourglass' && o.hourglass) {
    const [hx, hy] = rigPoint({w: TTEMME_MW}, x, y, [50, 76], o.flip);
    drawHourglass(b, hx - 3, hy, o.hourglass, {size: 'room', f: o.f});
  }
  if (s.arm === 'folder' && o.folder) {
    const [fx, fy] = rigPoint({w: TTEMME_MW}, x, y, TTEMME_M_FOLDER, o.flip);
    drawFolder(b, fx, fy, o.folder, {hands: 'ttemme'});
  }
};
