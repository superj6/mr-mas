// MR. MAS — cast: ALYI, the mystic co-founder. "ALYI / FEELS THE AGI."
// Design: a lit dome with short dark hair at the sides and back (the dome catches the pendant light —
// it is the most beautifully lit form in the room, never a joke), deep-set intense eyes, a dark sweater.
//   alyiTable     room sprite at THE WOODROSE table (3/4, facing camera-left), hands folded
//   alyiLevitate  cross-legged, floating; whole-pixel bob; the shadow stays on the seat and shrinks (not in the intro)
//   alyiChairLift rising STILL SEATED in his dinner chair, napkin in lap (the intro's levitation, SCRIPT §3.5b)
//   alyiPortrait  conversation portrait; eyes: open / closed / 'tokens' (the eyes become token streams)
import {Buf} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, renderFigure} from '../figure';
import {Legend, Ramps, newImg, paint, memo, seg, blitTo, hash01, lightPool, shiftPrim} from './kit';

// skin o s m l L R · hair H h g · eye socket O (skin 0) + glint j · sweater Q q u U e E · mouth n
const LEG: Legend = {
  o: ['skin', 0], s: ['skin', 1], m: ['skin', 2], l: ['skin', 3], L: ['skin', 4], R: ['skin', 5],
  H: ['hair', 0], h: ['hair', 1], g: ['hair', 2],
  j: ['eye', 5], k: ['eye', 0], n: ['skin', 0], b: ['hair', 0],
  Q: ['sw', 0], q: ['sw', 1], u: ['sw', 2], U: ['sw', 3], e: ['sw', 4], E: ['sw', 5],
};

export type AlyiLight = 'dinner' | 'agi';
const RAMPS: Record<AlyiLight, Ramps> = {
  // THE WOODROSE pendant: warm from above
  dinner: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
    eye: [PAL.N0, PAL.N0, PAL.S1, PAL.S3, PAL.S5, PAL.S5],
    sw: [PAL.N0, PAL.X0, PAL.X1, PAL.X2, PAL.X3, PAL.W4],
    chair: [PAL.D0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.W4],
    cloth: [PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W4, PAL.W6],
  },
  // levitating: the same warm key, plus the cool glow of whatever he is feeling, from below
  agi: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
    eye: [PAL.N0, PAL.N0, PAL.S1, PAL.S3, PAL.S5, PAL.K3],
    sw: [PAL.N0, PAL.X0, PAL.X1, PAL.X2, PAL.X3, PAL.W4],
    chair: [PAL.D0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.W4],
    cloth: [PAL.W0, PAL.W1, PAL.W2, PAL.W3, PAL.W4, PAL.W6],
  },
};

// ------------------------------------------------------------------ room heads (15x18)
const HEAD_34 = [ // 3/4 toward camera-left; dome lit from the pendant above-left
  '.....ooooo.....',
  '...oLLLLLlmo...',
  '..oLRRLLllmso..',
  '.oLLRLLllmmmso.',
  '.lLLLLllmmmmsso',
  'olLLLllmmmmmssH',
  'lLLLllmmmmshhhH',
  'lLLllmmmsshhhhH',
  'LbbLlbbbsshhhhH',
  'oOOlmOOOmsoohhH',
  'llllllmmssosshh',
  'RLLllmmssmsshh.',
  'olllmmssssshh..',
  '.lllmmsssssh...',
  '.lllmssssh.....',
  '..lLlmssso.....',
  '..ooolsso......',
  '.....osss......',
];
const HEAD_FRONT = [ // square to camera (levitation); dome lit from above-left, dark hair cropped at the sides
  '......ooooo......',
  '....oLLLLLllo....',
  '...oLRRLLlllmo...',
  '..oLLRLLlllmmmo..',
  '..hlLLLLLllmmmsh.',
  '.hglLLLLlllmmmshh',
  '.hglLLLLllmmmmshh',
  '.hhlLLLllmmmmmshh',
  '.hbbbbLlmmbbbbshh',
  'mlOOOOllmsOOOOsho',
  'mllllllmssssssmso',
  '.lllllLlmsssssso.',
  '.lllllRomsssssso.',
  '..olllllmsssss...',
  '..olllllssso.....',
  '...ollLlmsso.....',
  '....oolmsso......',
  '......osss.......',
];
const LEG_H: Legend = {...LEG, O: ['skin', 0]};

// deep-set eyes: the socket is a dark band; the eye is a single intense glint inside it
const eyes34 = (lid: number): Array<[number, number, string]> => lid === 2 ? [] : [[1, 9, lid ? 'k' : 'j'], [6, 9, lid ? 'k' : 'j']];
const eyesFront = (lid: number): Array<[number, number, string]> => lid === 2 ? [] : [[3, 9, lid ? 'k' : 'j'], [11, 9, lid ? 'k' : 'j']];

// ------------------------------------------------------------------ at the table (seated, hands folded)
export const ALYI_W = 48;
export const ALYI_H = 50;
export const ALYI_TABLE_EDGE = 37;
export interface AlyiPose { lid: 0 | 1 | 2; mouth: 'rest' | 'open'; light: AlyiLight; }
export const ALYI_DEFAULT: AlyiPose = {lid: 0, mouth: 'rest', light: 'dinner'};

const TORSO = [ // x 11.., y 18..  crew-neck sweater, 3/4 toward camera-left, lit from above
  '..........ossm............',
  '........QeUUUUeQ..........',
  '.....QEeUuuuuuuUeQQ.......',
  '...QEeUUuuuuuuuuuqqQQ.....',
  '..QeUUUuuuuuuuuuqqqqqQ....',
  '..eUUuuuuuuuuuuuqqqqqqQ...',
  '.QeUuuuuuuuuuuuqqqqqqqQ...',
  '.QUUuuuuuuuuuuqqqqqqqqqQ..',
  '.QUuuuuuuuuuuuqqqqqqquqQ..',
  'QUUuuuuuuuuuuqqqqqqqqquqQ.',
  'QUuuuuuuuuuuqqqqqqqqqquqQ.',
  'QUuuuuuuuuuqqqqqqqqqqqQqQ.',
  'QuuuuuuuuuqqqqqqqqqqqqQqQ.',
  'QuuuuuuuuqqqqqqqqqqqqqQqQ.',
  'QuuuuuuuqqqqqqqqqqqqqqQqQ.',
  'QuuuuuuqqqqqqqqqqqqqqqQQ..',
  'QQuuuuqqqqqqqqqqqqqqqQQ...',
  'QQQQQQQQQQQQQQQQQQQQQQ....',
];
const HANDS = [ // x 9.., y 33..: forearms along the table, hands folded
  '...............QqqQ..',
  '.........QQQuuuqqQ...',
  '....QQUUUuuuqqqQQ....',
  '.QQUeUUuuqqQQ........',
  'QUeUULLlsQ...........',
  '.QQLLlllsso..........',
  '...ooosso............',
];

const tableRig = (light: AlyiLight): LightRig => ({
  key: [-0.4, -1], keyBand: 1, shadowBand: 2, rim: true, outline: true, ramps: RAMPS[light],
});
const tableImg = (p: AlyiPose): Img => {
  const ramps = RAMPS[p.light];
  const img = renderFigure({w: ALYI_W, h: ALYI_H, parts: [
    {group: 'chair', mat: 'chair', prims: [P.poly(31, 15, 35, 13, 39, 15, 40, 38, 36, 38, 35, 19)]},
    {group: 'chair', mat: 'chair', prims: [P.rect(30, 25, 10, 2)]},
  ]}, tableRig(p.light));
  paint(img, 11, 18, TORSO, LEG, ramps);
  paint(img, 16, 1, HEAD_34, LEG_H, ramps);
  for (const [x, y, c] of eyes34(p.lid)) paint(img, 16 + x, 1 + y, [c], LEG_H, ramps);
  paint(img, 16 + 2, 1 + 14, p.mouth === 'open' ? ['nn', 'k.'] : ['nn'], LEG_H, ramps);
  return img;
};
const tableFront = (p: AlyiPose): Img => {
  const img = newImg(ALYI_W, ALYI_H);
  paint(img, 9, 33, HANDS, LEG, RAMPS[p.light]);
  return img;
};
export const alyiTableBack = memo(tableImg);
export const alyiTableFront = memo(tableFront);
export const drawAlyiTable = (b: Buf, x: number, y: number, p: AlyiPose, opts: {table?: (b: Buf, x: number, y: number) => void; flip?: boolean; map?: (c: number, x: number, y: number) => number} = {}) => {
  blitTo(b, alyiTableBack(p), x, y, {flip: opts.flip, map: opts.map});
  opts.table?.(b, x, y + ALYI_TABLE_EDGE);
  blitTo(b, alyiTableFront(p), x, y, {flip: opts.flip, map: opts.map});
};

// ------------------------------------------------------------------ levitating, cross-legged
export const ALYI_LEV_W = 48;
export const ALYI_LEV_H = 50;
/** local y of the seat/floor the shadow sits on when lift = 0 */
export const ALYI_LEV_SEAT = 48;
export interface AlyiLevPose { lid: 0 | 1 | 2; mouth: 'rest' | 'open'; hands: 'knees' | 'open'; }
export const ALYI_LEV_DEFAULT: AlyiLevPose = {lid: 2, mouth: 'rest', hands: 'knees'};

const levFig = (p: AlyiLevPose): FigureDef => {
  const open = p.hands === 'open';
  const parts: Part[] = [
    // crossed legs: the meditation triangle. Thighs out to the knees, the shins folded in front.
    {group: 'legs', mat: 'cloth', prims: [P.poly(16, 35, 32, 35, 38, 38, 44, 41, 45, 44, 41, 45, 24, 43, 7, 45, 3, 44, 4, 41, 10, 38)]},
    {group: 'shins', mat: 'cloth', prims: [P.poly(7, 43, 16, 42, 24, 44, 32, 42, 41, 43, 40, 46, 30, 47, 24, 46, 18, 47, 8, 46)]},
    // the upturned foot resting on the far thigh (lotus)
    {group: 'foot', mat: 'skin', prims: [P.poly(27, 39, 32, 38, 34, 40, 30, 42, 27, 41)]},
    // torso upright, slight frame; arms angle down and out to the knees
    {group: 'body', mat: 'sw', prims: [
      P.poly(15, 20, 19, 17, 29, 17, 33, 20, 34, 28, 33, 36, 15, 36, 14, 28),
      seg(15.5, 20, 5, 11, open ? 29 : 31, 4.5), seg(32.5, 20, 5, 37, open ? 29 : 31, 4.5),
    ]},
    {group: 'fore', mat: 'sw', prims: open ? [seg(11, 29, 4.5, 5, 34, 4), seg(37, 29, 4.5, 43, 34, 4)] : [seg(11, 31, 4.5, 7, 39, 4), seg(37, 31, 4.5, 41, 39, 4)]},
    {group: 'hand', mat: 'skin', prims: open ? [P.ell(3.5, 34.5, 2.2, 1.5), P.ell(44.5, 34.5, 2.2, 1.5)] : [P.ell(6, 40, 2.4, 1.5), P.ell(42, 40, 2.4, 1.5)]},
    {group: 'neck', mat: 'skin', prims: [P.rect(21, 15, 6, 3)]},
  ];
  const adjust: Adjust[] = [
    {prims: [P.poly(19, 17, 29, 17, 28, 19, 20, 19)], tone: 3, onlyMat: 'sw'}, // crew neck rib
    {prims: [P.line(24, 37, 24, 43)], tone: 1, onlyMat: 'cloth'},
    {prims: [P.line(9, 44, 16, 43), P.line(32, 43, 39, 44)], tone: 1, onlyMat: 'cloth'},
    {prims: [P.line(17, 34, 31, 34)], tone: 1, onlyMat: 'sw'},
    {prims: open ? [P.line(2, 34, 5, 34), P.line(43, 34, 46, 34)] : [P.line(5, 39, 7, 39), P.line(41, 39, 43, 39)], tone: 4, onlyMat: 'skin'}, // palms up
  ];
  return {w: ALYI_LEV_W, h: ALYI_LEV_H, parts, adjust};
};
const levRig: LightRig = {
  key: [-0.3, -1], keyBand: 1, shadowBand: 2, rim: true, outline: true,
  back: [0.1, 1], backBand: 1,
  backRamp: {sw: PAL.C2, cloth: PAL.C2, skin: PAL.K2},
  ramps: {...RAMPS.agi, cloth: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.W3]},
  groupBands: {legs: {key: 3, shadow: 1}, shins: {key: 2, shadow: 1}},
  backGain: (x, y) => (y > 42 && x > 5 && x < 43 ? 1 : 0),
};
export const alyiLevitate = memo((p: AlyiLevPose) => {
  const img = renderFigure(levFig(p), levRig);
  const ramps = levRig.ramps;
  paint(img, 16, 0, HEAD_FRONT, LEG_H, ramps);
  for (const [x, y, c] of eyesFront(p.lid)) paint(img, 16 + x, y, [c], LEG_H, ramps);
  paint(img, 16 + 6, 14, p.mouth === 'open' ? ['nkn'] : ['nnn'], LEG_H, ramps);
  return img;
});

// ------------------------------------------------------------------ rising STILL SEATED in his dinner chair
// (SCRIPT v2.1 §3.5b: "he rises still seated: his dinner chair lifts with him ... napkin in lap, never cross-legged").
// Same canvas and seat line as alyiLevitate (ALYI_LEV_W x ALYI_LEV_H, feet/chair feet on ALYI_LEV_SEAT), so it is a
// drop-in swap: a front-facing diner in a bentwood chair, hands resting on the napkin, feet off the floor.
export const ALYI_CHAIR_EYES: Array<[number, number]> = [[16 + 3, 9], [16 + 11, 9]];
const chairFig = (): FigureDef => {
  const parts: Part[] = [
    // the chair: back uprights and top rail behind him, the seat, four legs (the front pair nearest)
    {group: 'chair', mat: 'chair', prims: [P.rect(9, 13, 3, 24), P.rect(36, 13, 3, 24), P.poly(9, 12, 39, 12, 39, 15, 9, 15)]},
    {group: 'chair', mat: 'chair', prims: [P.poly(8, 35, 40, 35, 41, 38, 7, 38)]},
    {group: 'legsC', mat: 'chair', prims: [P.rect(8, 38, 2, 10), P.rect(38, 38, 2, 10), P.rect(13, 38, 1, 8), P.rect(34, 38, 1, 8)]},
    // shins down from the knees, feet dangling (dark trousers, dark shoes)
    {group: 'shins', mat: 'cloth', prims: [P.rect(15, 39, 6, 7), P.rect(27, 39, 6, 7)]},
    {group: 'shoe', mat: 'chair', prims: [P.rect(14, 45, 7, 3), P.rect(27, 45, 7, 3)]},
    // torso upright; the lap (thighs toward camera, foreshortened) over the seat's front edge; knees
    {group: 'body', mat: 'sw', prims: [
      P.poly(15, 20, 19, 17, 29, 17, 33, 20, 34, 28, 33, 35, 15, 35, 14, 28),
      seg(15.5, 20, 5, 13, 30, 4.5), seg(32.5, 20, 5, 35, 30, 4.5),
    ]},
    {group: 'lap', mat: 'cloth', prims: [P.poly(14, 33, 34, 33, 35, 38, 33, 40, 15, 40, 13, 38)]},
    // the napkin in his lap, a point hanging over the knees
    {group: 'napkin', mat: 'napkin', prims: [P.poly(16, 33, 32, 33, 31, 38, 24, 42, 17, 38)]},
    // forearms come in to the lap; the hands rest on the napkin (never palms up)
    {group: 'fore', mat: 'sw', prims: [seg(13, 30, 4.5, 18, 36, 4), seg(35, 30, 4.5, 30, 36, 4)]},
    {group: 'hand', mat: 'skin', prims: [P.ell(19, 37, 2.6, 1.6), P.ell(29, 37, 2.6, 1.6)]},
    {group: 'neck', mat: 'skin', prims: [P.rect(21, 15, 6, 3)]},
  ];
  const adjust: Adjust[] = [
    {prims: [P.poly(19, 17, 29, 17, 28, 19, 20, 19)], tone: 3, onlyMat: 'sw'}, // crew neck rib
    {prims: [P.line(17, 32, 31, 32)], tone: 1, onlyMat: 'sw'},
    {prims: [P.line(24, 39, 24, 42)], tone: 2, onlyMat: 'napkin'}, // the napkin's fold
    {prims: [P.line(8, 35, 40, 35)], tone: 4, onlyMat: 'chair'}, // the seat's lit front edge
    {prims: [P.line(10, 12, 38, 12)], tone: 4, onlyMat: 'chair'}, // the top rail catches the rose window
  ];
  return {w: ALYI_LEV_W, h: ALYI_LEV_H, parts, adjust};
};
const chairRig: LightRig = {
  ...levRig,
  ramps: {...levRig.ramps, napkin: [PAL.N1, PAL.P0, PAL.P0, PAL.P1, PAL.P2, PAL.P2]},
  groupBands: {shins: {key: 2, shadow: 1}, lap: {key: 2, shadow: 1}},
  backGain: (x, y) => (y > 36 && x > 5 && x < 43 ? 1 : 0),
};
/** ALYI rising in his dinner chair (same canvas/seat line as alyiLevitate: a drop-in replacement). */
export const alyiChairLift = memo((p: AlyiLevPose) => {
  const img = renderFigure(chairFig(), chairRig);
  const ramps = chairRig.ramps;
  paint(img, 16, 0, HEAD_FRONT, LEG_H, ramps);
  for (const [x, y, c] of eyesFront(p.lid)) paint(img, 16 + x, y, [c], LEG_H, ramps);
  paint(img, 16 + 6, 14, p.mouth === 'open' ? ['nkn'] : ['nnn'], LEG_H, ramps);
  return img;
});

/** Levitation bob in whole pixels: slow rise, a hold at the top, slow settle. Never tweened. */
export const alyiLift = (f: number, period = 48): number => {
  const t = ((f % period) + period) % period;
  const curve = [2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2];
  return curve[Math.floor((t / period) * curve.length)];
};

/** Draw the levitation: the shadow stays on the seat and shrinks as he rises; he never tilts or scales. */
export const drawAlyiLevitate = (b: Buf, x: number, y: number, p: AlyiLevPose, lift: number, opts: {shadow?: number; glow?: number; map?: (c: number, x: number, y: number) => number} = {}) => {
  const sy = y + ALYI_LEV_SEAT;
  const half = 17 - lift;
  const sh = opts.shadow ?? PAL.N0;
  for (let i = -half; i <= half; i++) {
    const edge = Math.abs(i) > half - 3;
    if (edge && (i + sy) % 2) continue;
    b.set(x + 24 + i, sy, sh);
  }
  if (opts.glow !== undefined)
    for (let i = -half + 4; i <= half - 4; i += 2) b.set(x + 24 + i + (sy & 1), sy - 1, opts.glow);
  blitTo(b, alyiLevitate(p), x, y - lift, {map: opts.map});
};

// ============================================================ portrait (112x136)
export const ALYI_PW = 112;
export const ALYI_PH = 136;
export interface AlyiPortraitState { eyes: 'open' | 'closed' | 'tokens'; mouth: 'rest' | 'open'; t: number; }
export const ALYI_PORTRAIT_DEFAULT: AlyiPortraitState = {eyes: 'open', mouth: 'rest', t: 0};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

const hairlineFade = (): string[] => {
  const top = (x: number) => (x < 70 ? 45 - (x - 66) : x < 77 ? 41 - ((x - 70) * 3) / 7 : x < 84 ? 38 + ((x - 77) * 1) / 7 : 39 + (x - 84) * 1.7);
  const rows = Array.from({length: 13}, () => Array(22).fill('.'));
  for (let i = 0; i < 22; i++) {
    const e = Math.round(top(66 + i)) - 33;
    [[1, 0.7], [2, 0.4], [3, 0.15]].forEach(([d, pr]) => { const j = e - d; if (j >= 0 && j < 13 && hash01(i * 13 + d, 5) < pr) rows[j][i] = '#'; });
  }
  return rows.map((r) => r.join(''));
};

const portraitFig = (s: AlyiPortraitState): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'sw', tone: 2, prims: [P.poly(2, 144, 4, 116, 14, 104, 30, 97, 46, 94, 70, 95, 88, 100, 102, 110, 110, 144)]},
    {group: 'neck', mat: 'neck', tone: 1, prims: [P.poly(49, 80, 49, 98, 60, 101, 71, 96, 70, 76)]},
    {group: 'rib', mat: 'sw', tone: 3, prims: [P.poly(42, 96, 50, 93, 60, 96, 70, 93, 78, 96, 72, 101, 60, 103, 48, 101)]},
    // head: a broad dome, a strong brow ridge, the jaw; 3/4 facing camera-left
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 44, 26, 27),
      P.poly(38, 30, 35, 38, 34, 44, 35, 50, 33, 56, 34, 62, 36, 68, 38, 74, 42, 80, 48, 85, 56, 84, 64, 80, 71, 73, 75, 64, 78, 54, 80, 44),
    ]},
    // short dark hair: only the sides and back, cropped close, below the dome
    {group: 'hair', mat: 'hair', tone: 1, prims: [P.poly(65, 45, 70, 41, 77, 38, 84, 39, 88, 46, 88, 56, 85, 63, 81, 68, 78, 66, 77, 58, 75, 50, 71, 47), P.poly(64, 46, 69, 45, 71, 49, 70, 57, 67, 57, 65, 51)]},
    {group: 'ear', mat: 'skinD', tone: 3, prims: [P.poly(71, 48, 75, 45, 79, 47, 80, 55, 77, 62, 72, 63, 70, 57)]},
  ];
  const adjust: Adjust[] = [
    // the dome: a clean spherical read. Highlight (4) up and left, the hot spec (5), the turn into shadow
    plane('skin', 4, P.poly(40, 26, 44, 20, 50, 17, 58, 16, 54, 20, 48, 24, 44, 30, 41, 33)),
    plane('skin', 5, P.poly(45, 21, 50, 18, 53, 18, 49, 21)),
    plane('skin', 2, P.poly(66, 20, 74, 24, 80, 32, 70, 34, 64, 30)),
    toMat('skin', 'skinD', 2, P.poly(72, 22, 80, 28, 85, 36, 80, 32, 74, 30)),
    // strong brow ridge catches the light; the deep sockets under it
    plane('skin', 4, P.poly(36, 40, 44, 38, 48, 39, 60, 38, 64, 40, 48, 41, 38, 42)),
    toMat('skin', 'skinD', 1, P.poly(37, 42, 45, 42, 46, 49, 38, 49), P.poly(48, 42, 64, 41, 65, 48, 50, 50)),
    // terminator + far side of the face
    plane('skin', 2, P.poly(62, 44, 68, 44, 70, 54, 70, 64, 66, 72, 60, 78, 60, 66, 63, 56)),
    toMat('skin', 'skinD', 2, P.poly(68, 44, 72, 44, 76, 50, 76, 60, 72, 70, 64, 79, 60, 78, 66, 72, 70, 64, 70, 54)),
    // nose (long, straight), cheek, mouth planes
    plane('skin', 4, P.poly(44, 49, 46, 49, 42, 60, 40, 61)),
    plane('skin', 2, P.poly(46, 50, 48, 50, 48, 60, 45, 63, 43, 62)),
    plane('skin', 1, P.poly(38, 63, 46, 63, 45, 65, 39, 65)),
    plane('skin', 4, P.poly(50, 56, 58, 55, 60, 58, 53, 60)),
    plane('skin', 2, P.poly(40, 76, 50, 76, 49, 78, 41, 78)),
    plane('neck', 0, P.poly(49, 83, 56, 85, 64, 80, 71, 75, 70, 84, 60, 89, 49, 88)),
    toMat('skinD', 'skinD', 1, P.poly(73, 50, 76, 49, 77, 55, 75, 59)),
    // hair texture: cropped close; the top edge fades into the dome as stubble (dithered), never a hard band
    plane('hair', 2, P.line(80, 42, 84, 50), P.line(77, 42, 80, 50)),
    plane('hair', 0, P.poly(70, 47, 74, 50, 75, 56, 72, 52)),
    // the scalp greys softly just above the hairline (follows the hair's top edge; hashed, sparse)
    {prims: [P.map(66, 33, hairlineFade())], tone: 2, onlyMat: 'skin'},
    // sweater: warm top light on the shoulders, rib texture, the fold
    plane('sw', 3, P.poly(6, 118, 14, 106, 30, 99, 44, 97, 38, 104, 24, 110, 12, 124)),
    plane('sw', 1, P.line(64, 104, 70, 136), P.poly(88, 102, 102, 110, 110, 136, 98, 136)),
  ];
  // eye rows (stamped over the dark sockets). tokens: rows of short bright runs streaming toward the nose.
  const near = (s.eyes === 'closed') ? ['............', '............', '..kkkkkkkk..'] : ['..........', '.kwwiIgiwk.', '..kwiIIwk..'];
  const far = (s.eyes === 'closed') ? ['......', '......', '.kkkk.'] : ['.....', 'kwiIg', '.wiIk'];
  const stamps: FigureDef['stamps'] = [
    {x: 49, y: 44, rows: near, pal: {k: PAL.S0, w: PAL.S2, i: PAL.B2, I: PAL.N0, g: PAL.W8}},
    {x: 38, y: 44, rows: far, pal: {k: PAL.S0, w: PAL.S2, i: PAL.B2, I: PAL.N0, g: PAL.W8}},
    // brows: heavy, level
    {x: 48, y: 40, rows: ['.bbbbbbbbbbbbb', 'bbbbbbbbbbbbbb'], pal: {b: PAL.B0}},
    {x: 36, y: 41, rows: ['bbbbbbb', '.bbbb..'], pal: {b: PAL.B0}},
    {x: 41, y: 61, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 38, y: 71, rows: s.mouth === 'open' ? ['mmmmmmmmmm..', 'mdddddddm...', '.mmmmmmm....', '..lllll.....'] : ['mmmmmmmmmm..', '..llllll....'], pal: {m: PAL.S0, d: PAL.N0, l: PAL.S3}},
  ];
  if (s.eyes === 'tokens') {
    // each eye becomes 2-3 rows of token runs (1-3 px, 1 px gaps) scrolling toward camera-left, 1 px/frame
    const tok = (x0: number, y0: number, w: number, h: number): NonNullable<FigureDef['stamps']>[number] => {
      const rows: string[] = [];
      for (let j = 0; j < h; j++) {
        let r = '';
        for (let i = 0; i < w; i++) {
          const u = i + s.t + j * 7; // scroll
          // run-length pattern from a hash per "token slot" of 4 px
          const slot = Math.floor(u / 4), k = u % 4;
          const len = 1 + Math.floor(hash01(slot, j + 11) * 3);
          r += k < len ? (hash01(slot, j + 23) > 0.8 ? 'T' : 't') : 'x';
        }
        rows.push(r);
      }
      return {x: x0, y: y0, rows, pal: {t: PAL.C6, T: PAL.C8, x: PAL.N0}};
    };
    stamps[0] = tok(50, 44, 10, 3);
    stamps[1] = tok(38, 45, 5, 2);
  }
  // compose: head 3px lower, shoulders 4px higher than drawn (a shorter neck)
  const BODY = new Set(['torso', 'rib']);
  const mv = (pr: Prim, dy: number) => shiftPrim(pr, 0, dy);
  return {
    w: ALYI_PW, h: ALYI_PH,
    parts: parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => mv(pr, BODY.has(pt.group) ? -4 : pt.group === 'neck' ? 0 : 3))})),
    adjust: adjust.map((a) => ({...a, prims: a.prims.map((pr) => mv(pr, a.onlyMat === 'sw' ? -4 : 3))})),
    stamps: stamps.map((st) => ({...st, y: st.y + 3})),
  };
};
const PRIG = (tokens: boolean): LightRig => ({
  key: [-0.5, -0.9], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'rib'],
  back: [0.9, 0.2], backBand: 1,
  backRamp: tokens ? {skin: PAL.C3, skinD: PAL.C2, hair: PAL.C2, sw: PAL.C2} : {skin: PAL.W4, skinD: PAL.W3, hair: PAL.W3, sw: PAL.W2},
  ramps: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.W8],
    skinD: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
    sw: [PAL.N0, PAL.N1, PAL.X0, PAL.X1, PAL.X2, PAL.W5],
  },
});
export const alyiPortrait = memo((s: AlyiPortraitState) => renderFigure(portraitFig(s), PRIG(s.eyes === 'tokens')));

/** Portrait window: warm dark with a low candle glow; in 'tokens' the room cools behind him. */
export const drawAlyiPortrait = (b: Buf, x: number, y: number, s: AlyiPortraitState, w = ALYI_PW, h = ALYI_PH, ox = 0) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + w && py < y + h;
  if (s.eyes === 'tokens') lightPool(b, x, y, w, h, w * 0.9, h * 0.35, w * 0.8, h * 0.7, PAL.N0, [[1, PAL.N1], [0.66, PAL.C0], [0.4, PAL.C1]]);
  else lightPool(b, x, y, w, h, w * 0.9, h * 0.8, w * 0.8, h * 0.6, PAL.N1, [[1, PAL.W0], [0.62, PAL.W1], [0.34, PAL.W2]]);
  blitTo(b, alyiPortrait(s), x - ox, y, {clip});
};
