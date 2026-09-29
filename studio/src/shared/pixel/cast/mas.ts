// MR. MAS — cast: MAS MANALT across the eras, in the approved pixeladv look.
//   masDesk      present day, room sprite, 3/4 FRONT at his desk (typing / turn / look at camera)
//   masPortrait  present day, conversation portrait (mouths A E O M rest smile, lids, eye dart)
//   masKid       1993, age 8, at a beige no-logo computer (screen faces away). Native 1-bit or BASE.
//   masStage     2008, age 23, on a stage: two stacked polos, both collars popped
//   masThrone    2014, age 29, hoodie + tiny parachute pack, seated for the YC throne (crown optional)
// Signature features, every age: the forward cowlick, calm level eyes, the tiny closed smile, slight frame.
import {Buf} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure} from '../figure';
import {Legend, Ramps, newImg, over, paint, memo, seg, shiftPrim, blitTo, bitRamps, blit1bit, BitLadder, edgeLight, lightPool} from './kit';

// ============================================================ shared legend (room-scale tone maps)
// skin o s m l L R  = 0..5 · hair H h g G c C = 0..5 · eye k(dark) x(shadowed white) w(white) j(glint)
// hood Q q u U e E = 0..5 · mouth n (skin 0)
export const MAS_LEGEND: Legend = {
  o: ['skin', 0], s: ['skin', 1], m: ['skin', 2], l: ['skin', 3], L: ['skin', 4], R: ['skin', 5],
  H: ['hair', 0], h: ['hair', 1], g: ['hair', 2], G: ['hair', 3], c: ['hair', 4], C: ['hair', 5],
  k: ['eye', 0], x: ['eye', 2], w: ['eye', 3], j: ['eye', 5],
  Q: ['hood', 0], q: ['hood', 1], u: ['hood', 2], U: ['hood', 3], e: ['hood', 4], E: ['hood', 5],
  n: ['skin', 0], b: ['hair', 1],
  K: ['key', 0], y: ['key', 2], Y: ['key', 4],
};

// ============================================================ light states
export type MasLight = 'monitor' | 'orb';
/** Cold open: the monitor is the only key (camera-left). The Orb at his shoulder adds a cool back-rim. */
const DESK_RAMPS: Ramps = {
  skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K1, PAL.C5],
  eye: [PAL.N0, PAL.X0, PAL.X1, PAL.K1, PAL.K2, PAL.C8],
  hood: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.C3, PAL.C6],
  hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
  chair: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.C1, PAL.C3],
  key: [PAL.N0, PAL.N1, PAL.N2, PAL.C1, PAL.C3, PAL.C6],
};

// ============================================================ MAS present — desk sprite
export const MAS_DESK_W = 48;
export const MAS_DESK_H = 50;
/** local y of his edge of the desk top: the set paints the desk top over the BACK layer below this line */
export const MAS_DESK_EDGE = 37;

export type MasDeskHead = 'screen' | 'turn' | 'camera';
export interface MasDeskPose {
  head: MasDeskHead;
  /** typing drawing: 0 = hands resting, 1..3 = keystroke drawings */
  type: 0 | 1 | 2 | 3;
  lid: 0 | 1 | 2;
  /** eye dart: -1 toward the monitor, 0 centre, 1 away */
  look: -1 | 0 | 1;
  mouth: 'rest' | 'smile' | 'open';
  breathe: 0 | 1;
  light: MasLight;
}
export const MAS_DESK_DEFAULT: MasDeskPose = {head: 'screen', type: 0, lid: 0, look: 0, mouth: 'rest', breathe: 0, light: 'orb'};

// Hand-pixelled heads, 15x18. Top-left sits at HEAD_AT. Light: monitor from camera-left.
const HEAD_AT: [number, number] = [16, 0];
const HEADS: Record<MasDeskHead, string[]> = {
  // 3/4 toward the monitor (screen-left). The lit narrow side is the face front; the broad side is dark.
  screen: [
    '.Gc............',
    'GcGh...........',
    'HgGghHHHHH.....',
    '..HGghhhhhHH...',
    '.HcGghhhhhhhH..',
    '.HcGgghhhhhhhH.',
    'HGgggHhhhhhhhhH',
    'HGgLlGhhhhhhhhH',
    '.LLLllmhhhhhhhH',
    '.blLlbbmsshhhhH',
    '.llLlllmsoosshH',
    '.LLlllmmsmmsshh',
    'RLlllmmssmssh..',
    '.olllmsssss....',
    '.lllmmssss.....',
    '..lLlmssso.....',
    '..ooolsoo......',
    '.....osss......',
  ],
  // halfway round: nose left of centre, both eyes visible, the ear at the far edge
  turn: [
    '..Gc...........',
    '.GcGh..........',
    '.HgGghHHHH.....',
    '..HGghhhhhhHH..',
    '.HcGghhhhhhhhH.',
    '.HcGgghhhhhhhhH',
    'HGggLGhhhhhhhhH',
    'HGLLLlGhhhhhhhH',
    'oLLLlllmmhhhhhH',
    'lbblllbbmsshshH',
    'llllllllmssosh.',
    'lLLLLlmmssssms.',
    'llllLRmssssss..',
    'olllloosssss...',
    '.oLllllmssso...',
    '..olLlmssso....',
    '...oolmsso.....',
    '.....osss......',
  ],
  // straight into camera: split light (left half cyan, right half dark), calm level stare
  camera: [
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
  ],
};

// eyes / mouth are stamped per state so the base heads stay clean. [x, y] are head-local.
type Feature = {at: [number, number]; rows: string[]};
const EYES: Record<MasDeskHead, (lid: number, look: number) => Feature[]> = {
  // far eye = 1 px on the contour, near eye = pupil + white (the dart swaps them)
  screen: (lid, look) =>
    lid === 2 ? [{at: [1, 10], rows: ['o']}, {at: [5, 10], rows: ['oo']}]
      : lid === 1 ? [{at: [1, 9], rows: ['b', 'k']}, {at: [5, 9], rows: ['bb', 'kk']}]
        : [{at: [1, 10], rows: ['k']}, {at: [5, 10], rows: [look > 0 ? 'jk' : 'kj']}], // one catchlight (the monitor side)
  turn: (lid, look) =>
    lid === 2 ? [{at: [1, 10], rows: ['oo']}, {at: [5, 10], rows: ['ooo']}]
      : lid === 1 ? [{at: [1, 9], rows: ['bb', 'kk']}, {at: [5, 9], rows: ['bbb', 'kkk']}]
        : [{at: [1, 10], rows: [look > 0 ? 'wk' : 'kw']}, {at: [5, 10], rows: [look < 0 ? 'kjx' : look > 0 ? 'xjk' : 'jkx']}],
  camera: (lid, look) =>
    lid === 2 ? [{at: [1, 10], rows: ['ooo']}, {at: [8, 10], rows: ['ooo']}]
      : lid === 1 ? [{at: [1, 9], rows: ['bbb', 'kkk']}, {at: [8, 9], rows: ['bbb', 'kkk']}]
        : [{at: [1, 10], rows: [look < 0 ? 'kjw' : look > 0 ? 'wjk' : 'jkw']}, {at: [8, 10], rows: [look < 0 ? 'kjx' : look > 0 ? 'xjk' : 'jkx']}],
};
const MOUTHS: Record<MasDeskHead, Record<MasDeskPose['mouth'], Feature>> = {
  screen: {rest: {at: [2, 14], rows: ['nn']}, smile: {at: [2, 13], rows: ['..n', 'nn.']}, open: {at: [2, 14], rows: ['nn', 'k.']}},
  turn: {rest: {at: [3, 14], rows: ['nnn']}, smile: {at: [3, 13], rows: ['...n', 'nnn.']}, open: {at: [3, 14], rows: ['nnn', '.k.']}},
  camera: {rest: {at: [4, 14], rows: ['nnn']}, smile: {at: [4, 13], rows: ['...n', 'nnn.']}, open: {at: [4, 14], rows: ['nnn', '.k.']}},
};

const deskRig = (light: MasLight): LightRig => ({
  key: [-0.95, -0.3],
  keyBand: 2,
  shadowBand: 3,
  rim: true,
  outline: true,
  back: light === 'orb' ? [1, -0.2] : null,
  backBand: 1,
  backRamp: {hood: PAL.C2, chair: PAL.C1, skin: PAL.K1},
  ramps: DESK_RAMPS,
  groupBands: {body: {key: 3, shadow: 4}, chair: {key: 1, shadow: 2}, hood: {key: 0, shadow: 2}, neck: {key: 0, shadow: 2}, fore: {key: 1, shadow: 1}},
  keyGain: (_x, y) => (y < 28 ? 1 : Math.max(0.25, 1 - (y - 28) / 12)),
});

// Seated upper body, hand-pixelled (x 11..38, y 18..38). Chest front faces the monitor (camera-left):
// lit cyan plane + rim on the far shoulder; the near arm and the back fall into the dark.
const TORSO_AT: [number, number] = [11, 18];
const TORSO = [
  '..........ossmQQ..........',
  '........QQIossIuqQQ.......',
  '.....QQEeuIIIIIuuqqqQQ....',
  '...QEEeeeUuIIIuuqqqqqqqQ..',
  '..QEeeeeeUUuuuuqqqqqqqqqQ.',
  '..EeeeeeUeUuuuuqqqqqqqqqqQ',
  '.QEeeeeUeqUuuuqqqqqqqqqqqQ',
  '.EeeeUeUqUuquuqqqqqqqquqqQ',
  '.EeeUeUUqUuuqqqqqqqqqquqqQ',
  '.EeUeUUuEuuuqqqqqqqqqquqqQ',
  'QEeeUUuUuuuqqqqqqqqqqquqqQ',
  'QeUeUUuuuuuqqqqqqqqqqqQqqQ',
  'QeeUUuUuuuqqqqqqqqqqqqQqqQ',
  'QeUUuUuuuuqqqqqqqqqqqqQqqQ',
  'QeUUUUUUuuqqqqqqqqqqqqQqqQ',
  'QUUuuuuuuuuqqqqqqqqqqqQqQ.',
  'QUuUuuuuuuqqqqqqqqqqqqQqQ.',
  'QuUuuuuuuuqqqqqqqqqqqqQqQ.',
  'QuuuuuuuuqqqqqqqqqqqqqQQ..',
  'QQQQQQQQQQQQQQQQQQQQQQQ...',
];

/** The Orb hangs off his near shoulder: a cool 1px kiss down the back edge of hair, face and hood. */
const orbRim = (img: Img) =>
  edgeLight(img, DESK_RAMPS, [1, 0], (mat, t, _x, y) => {
    if (y > 33) return undefined;
    if (mat === 'hair') return t <= 2 ? PAL.C2 : undefined;
    if (mat === 'skin') return PAL.K1;
    if (mat === 'hood' || mat === 'hoodIn') return y < 24 ? PAL.C3 : PAL.C2;
    if (mat === 'chair') return PAL.C1;
    return undefined;
  }, 1, ['hood', 'hair', 'skin']);

const deskBack = (p: MasDeskPose): Img => {
  const b = p.breathe;
  const parts: Part[] = [
    // mesh office chair back, standing up behind his near shoulder
    {group: 'chair', mat: 'chair', prims: [P.poly(30, 14, 37, 13, 40, 16, 41, 38, 31, 38)]},
  ];
  const adjust: Adjust[] = [
    {prims: Array.from({length: 6}, (_, k) => P.line(32, 17 + k * 4, 40, 17 + k * 4)), add: -1, onlyMat: 'chair'},
  ];
  const img = renderFigure({w: MAS_DESK_W, h: MAS_DESK_H, parts, adjust}, deskRig(p.light));
  paint(img, TORSO_AT[0], TORSO_AT[1] - b, TORSO, MAS_LEGEND, DESK_RAMPS);
  // head
  const hx = HEAD_AT[0], hy = HEAD_AT[1] - b;
  paint(img, hx, hy, HEADS[p.head], MAS_LEGEND, DESK_RAMPS);
  for (const f of EYES[p.head](p.lid, p.look)) paint(img, hx + f.at[0], hy + f.at[1], f.rows, MAS_LEGEND, DESK_RAMPS);
  const mo = MOUTHS[p.head][p.mouth];
  paint(img, hx + mo.at[0], hy + mo.at[1], mo.rows, MAS_LEGEND, DESK_RAMPS);
  if (p.light === 'orb') orbRim(img);
  return img;
};

// typing: the two hands alternate on the keys; 1 px lifts, never tweened
const HANDS: Record<number, {f: [number, number]; n: [number, number]}> = {
  0: {f: [0, 0], n: [0, 0]},
  1: {f: [0, -1], n: [0, 0]},
  2: {f: [0, 0], n: [0, -1]},
  3: {f: [-1, -1], n: [1, -1]},
};
// keyboard on the desk top (receding toward the monitor) and the two forearms/hands, hand-pixelled
const KEYBOARD = [
  '..KKKKKKKKKKKKKKKKKK..',
  '.KYyYyYyYyYyYyYyYyyK..',
  '.KyYyYyYyYyYyYyyyyyyK.',
  'KyYyYyYyYyYyYyyyyyyyK.',
  'KKKKKKKKKKKKKKKKKKKKKK',
];
const FORE_F = [ // x 9.., y 33..
  '....QeQ',
  '...QeUQ',
  '...eUuQ',
  '..QeUuQ',
  '..eUuQ.',
  '.QeUuQ.',
  '.eUuQ..',
];
const FORE_N = [ // x 25.., y 34..
  '..........QqQ',
  '........QQuqQ',
  '......QQuUuqQ',
  '....QQUUuuqQ.',
  '..QUeUuuqQQ..',
  '.QeUuuqQQ....',
  'QeUuqQQ......',
];
const HAND_F = ['.LlL', 'Llls', '.oo.'];
const HAND_N = ['.LLls', 'Llmss', '.ooo.'];
const deskFront = (p: MasDeskPose): Img => {
  const h = HANDS[p.type];
  const img = newImg(MAS_DESK_W, MAS_DESK_H);
  paint(img, 7, 40, KEYBOARD, MAS_LEGEND, DESK_RAMPS);
  paint(img, 9, 33, FORE_F, MAS_LEGEND, DESK_RAMPS);
  paint(img, 24, 34, FORE_N, MAS_LEGEND, DESK_RAMPS);
  paint(img, 8 + h.f[0], 40 + h.f[1], HAND_F, MAS_LEGEND, DESK_RAMPS);
  paint(img, 22 + h.n[0], 40 + h.n[1], HAND_N, MAS_LEGEND, DESK_RAMPS);
  return img;
};

export const masDeskBack = memo(deskBack);
export const masDeskFront = memo(deskFront);

/** Draw Mas at the desk: back layer, the caller's desk top (optional), then forearms + hands on top. */
export const drawMasDesk = (b: Buf, x: number, y: number, p: MasDeskPose, deskTop?: (b: Buf, x: number, y: number) => void, map?: (c: number, x: number, y: number) => number) => {
  blitTo(b, masDeskBack(p), x, y, {map});
  deskTop?.(b, x, y + MAS_DESK_EDGE);
  blitTo(b, masDeskFront(p), x, y, {map});
};

// ============================================================ MAS present — conversation portrait (112x136)
// 3/4 front, facing camera-left toward the monitor. Painted planes on polygons (like the approved Nole
// portrait): the rig adds the silhouette edges, every face plane is an explicit ramp index.
export const MAS_PW = 112;
export const MAS_PH = 136;
export type MasMouth = 'rest' | 'smile' | 'A' | 'E' | 'O' | 'M';
export interface MasPortraitState {
  mouth: MasMouth;
  lid: 0 | 1 | 2;
  /** eye dart: -1 toward the monitor (camera-left), 0 centre (at the viewer), 1 away */
  look: -1 | 0 | 1;
  brow: 0 | 1;
  light: 'monitor' | 'warm';
  /** head angle drawing: '34' (default) = 3/4 toward the monitor; 'front' = the near-front head, turned to the lens
   *  (the body stays 3/4). A swapped drawing on a cut or a snap, never an in-between. */
  head?: '34' | 'front';
}
export const MAS_PORTRAIT_DEFAULT: MasPortraitState = {mouth: 'rest', lid: 0, look: 0, brow: 0, light: 'monitor'};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

/**
 * The NEAR-FRONT head (the look to the lens): turned ~10 degrees short of square, so the far (camera-right) cheek is
 * a touch wider and the right ear shows more than the left. Same key (the monitor, camera-left), same planes
 * grammar: tone 3 base, 4 on the lit forehead/cheekbone/nose ridge, 2 down the far cheek, skinD at the far edge.
 * Signatures kept: the forward cowlick springing off the hairline, calm level eyes with the lid a touch low, the
 * one-pixel smile, one catchlight per eye.
 */
const frontHead = (s: MasPortraitState, q: (y: number) => number, J: (...pts: number[]) => Prim) => {
  const parts: Part[] = [
    {group: 'neck', mat: 'neck', tone: 1, prims: [P.poly(51, 82, 51, 97, 57, 99, 64, 96, 64, 80)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(58, 45, 24, 24),
      J(41, 28, 37, 37, 36, 47, 37, 57, 39, 65, 42, 72, 46, 78, 51, 83, 57, 85, 64, 83, 70, 78, 74, 71, 77, 63, 79, 54, 80, 45, 79, 35, 74, 27, 58, 21),
    ]},
    // hair: short sides, length on top pushed forward; the COWLICK springs off the front hairline toward camera-left
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(35, 46, 34, 35, 37, 26, 44, 18, 54, 14, 65, 14, 75, 18, 82, 26, 84, 36, 83, 47, 80, 53, 79, 44, 77, 37, 72, 32, 66, 31, 60, 32, 55, 31, 50, 33, 45, 32, 40, 36, 37, 46),
      P.poly(51, 32, 49, 24, 45, 18, 39, 14, 33, 15, 30, 19, 34, 18, 38, 19, 42, 23, 45, 31),
    ]},
    // ears: the far one (camera-right) shows; the near one is a sliver behind the cheek
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(78, 50, 82, 47, 85, 50, 85, 58, 82, 65, 78, 64, 78, 57), J(35, 51, 37, 49, 38, 52, 38, 60, 36, 62, 35, 57)]},
  ];
  const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
  const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});
  const adjust: Adjust[] = [
    // ---- hair: strands swept forward off the crown, a cyan catch on the lit (camera-left) crown and the cowlick
    plane('hair', 1, P.line(66, 16, 58, 30), P.line(74, 20, 66, 31), P.line(80, 28, 75, 37), P.line(58, 15, 51, 29), P.line(82, 38, 80, 50)),
    plane('hair', 3, P.poly(36, 33, 39, 26, 45, 20, 41, 28, 38, 35), P.poly(31, 18, 35, 15, 40, 15, 45, 18, 39, 17, 34, 17), P.line(55, 15, 62, 15)),
    plane('hair', 4, P.line(36, 31, 39, 26), P.line(32, 17, 35, 15), P.line(36, 15, 39, 15)),
    plane('hair', 0, P.poly(77, 38, 79, 45, 80, 51, 78, 47), P.line(46, 20, 49, 27), P.line(83, 44, 82, 50)),
    // ---- face planes: the far cheek turns off the monitor (2), its edge deeper (skinD 2)
    plane('skin', 2, J(69, 33, 74, 37, 77, 46, 77, 57, 75, 66, 71, 74, 65, 80, 60, 83, 63, 75, 67, 66, 69, 56, 69, 44)),
    toMat('skin', 'skinD', 2, J(74, 34, 79, 40, 80, 50, 78, 62, 74, 72, 67, 80, 60, 84, 65, 80, 71, 74, 75, 66, 77, 57, 77, 46)),
    // highlights: lit forehead, the near cheekbone, the nose ridge, the chin
    plane('skin', 4, P.poly(40, 36, 48, 33, 57, 34, 51, 37, 43, 39, 39, 41), J(38, 56, 42, 54, 44, 61, 40, 65), P.poly(53, 47, 55, 47, 54, 58, 52, 59), J(51, 80, 57, 79, 59, 83, 53, 84)),
    plane('skin', 5, P.line(52, 56, 52, 57), P.line(44, 35, 49, 34)),
    // eye sockets under the brows
    plane('skin', 2, P.poly(40, 45, 51, 44, 52, 47, 40, 48), P.poly(61, 44, 73, 44, 74, 47, 61, 47)),
    // nose: the shadow side is camera-right, its cast shadow falls right and down; under-nose, under-lip
    plane('skin', 2, P.poly(56, 47, 58, 47, 60, 57, 59, 61, 56, 61)),
    toMat('skin', 'skinD', 3, J(58, 58, 62, 59, 62, 63, 57, 64)),
    toMat('skin', 'skinD', 2, J(50, 62, 58, 62, 57, 64, 51, 64)),
    plane('skin', 2, J(51, 74, 61, 74, 60, 76, 52, 76)),
    // under the jaw: deepest; the neck's lit strip is camera-left
    plane('neck', 0, J(47, 81, 52, 85, 58, 86, 65, 84, 69, 79, 67, 88, 58, 91, 48, 88)),
    plane('neck', 2, P.poly(51, 90, 52, 90, 52, 97, 51, 96)),
    // ears: the far ear's bowl
    toMat('skinD', 'skinD', 1, J(80, 52, 83, 52, 83, 58, 81, 61)),
    toMat('skinD', 'skinD', 4, J(78, 51, 80, 50, 79, 60, 78, 58)),
  ];
  const L = s.lid;
  // 11-wide eyes, the lid a touch low (serene); `g` = the catchlight, on the monitor side of each pupil
  const eyeL = L === 2
    ? ['...........', '...........', '...........', '.LLLLLLLLL.', '..kkkkkkk..']
    : L === 1
      ? ['...........', '..LLLLLLL..', 'LLLLLLLLLLL', 'LwwgIIIiww.', '..kkkkkkk..']
      : ['..LLLLLLL..', '.LLLLLLLLLL', 'LwwgIIIiww.', '.wwiIIIiw..', '..kkkkkk...'];
  const eyeR = L === 2
    ? ['...........', '...........', '...........', '.LLLLLLLLL.', '..kkkkkkk..']
    : L === 1
      ? ['...........', '..LLLLLLL..', 'LLLLLLLLLLL', '.wwgIIIiwwL', '..kkkkkkk..']
      : ['..LLLLLLL..', 'LLLLLLLLLL.', '.wwgIIIiwwL', '..wiIIIiww.', '...kkkkkk..'];
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const chars = r.split('');
    const idx = chars.map((c, i) => (/[iIg]/.test(c) ? i : -1)).filter((i) => i >= 0);
    const out = chars.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    for (const i of idx) { const j = i + d; if (j >= 0 && j < out.length && out[j] !== '.') out[j] = chars[i]; }
    return out.join('');
  });
  const brow = s.brow ? -1 : 0;
  const warm = s.light === 'warm';
  const mouths: Record<MasMouth, string[]> = {
    rest: ['............', '.mmmmmmmmmm.', '...llllll...'],
    smile: ['..........m.', '.mmmmmmmmm..', '...llllll...'],
    A: ['............', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '..mddddddm..', '...mmmmmm...', '....llll....'],
    E: ['............', 'mmmmmmmmmmmm', '.mTTTTTTTTm.', '..mddddddm..', '...mmmmmm...'],
    O: ['............', '...mmmmmm...', '..mddddddm..', '..mddddddm..', '...mmmmmm...', '....llll....'],
    M: ['............', '.mmmmmmmmmm.', '..MMMMMMMM..', '...llllll...'],
  };
  const stamps: Stamp[] = [
    {x: 40, y: 41 + brow, rows: ['.bbbbbbbbb', 'bbb.......'], pal: {b: PAL.B1}},
    {x: 62, y: 41 + brow, rows: ['bbbbbbbbb.', '.......bbb'], pal: {b: PAL.B1}},
    {x: 41, y: 44, rows: dart(eyeL, s.look), pal: {L: PAL.N0, w: warm ? PAL.S5 : PAL.K2, i: PAL.B3, I: PAL.N0, g: warm ? PAL.W8 : PAL.C8, k: PAL.X1}},
    {x: 62, y: 44, rows: dart(eyeR, s.look), pal: {L: PAL.N0, w: warm ? PAL.S4 : PAL.K1, i: PAL.B3, I: PAL.N0, g: warm ? PAL.W8 : PAL.C8, k: PAL.X1}},
    {x: 54, y: Math.round(q(62)), rows: ['o..o', '.oo.'], pal: {o: PAL.S0}},
    {x: 50, y: Math.round(q(70)) - 1, rows: mouths[s.mouth], pal: {m: PAL.S0, M: PAL.X0, l: PAL.X2, t: PAL.K2, T: PAL.K3, d: PAL.N0, g: PAL.S2}},
  ];
  // the front head sits 2px lower on the (shared) neck than the 3/4 drawing: the chin comes toward the lens
  const D = 2;
  const sh = (pr: Prim) => shiftPrim(pr, 0, D);
  return {
    parts: parts.map((pt) => (pt.group === 'neck' ? pt : {...pt, prims: pt.prims.map(sh)})),
    adjust: adjust.map((a) => ({...a, prims: a.prims.map(sh)})),
    stamps: stamps.map((st) => ({...st, y: st.y + D})),
  };
};

const masPortraitFig = (s: MasPortraitState): FigureDef => {
  // jaw drops a whole pixel or two on open vowels; the lower face is compressed toward the eye line (younger)
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const q = (y: number) => (y > 56 ? Math.round((56 + (y - 56) * 0.86) * 2) / 2 : y);
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? q(v) + (v >= 71 ? jaw : 0) : v)));
  const parts: Part[] = [
    // hood bunched behind the neck (his back is camera-right), then the hoodie shoulders
    {group: 'hood', mat: 'hood', tone: 1, prims: [P.poly(58, 96, 62, 86, 74, 80, 90, 83, 100, 92, 104, 106, 90, 104, 74, 99)]},
    {group: 'torso', mat: 'hood', tone: 2, prims: [P.poly(4, 144, 6, 116, 14, 104, 28, 97, 42, 94, 70, 94, 88, 98, 102, 108, 108, 144)]},
    // slender neck
    {group: 'neck', mat: 'neck', tone: 1, prims: [P.poly(52, 76, 52, 97, 60, 100, 69, 96, 68, 70)]},
    // the hood's rolled edge around the neck; dark inside only behind the neck
    {group: 'collar', mat: 'hoodIn', tone: 2, prims: [P.poly(60, 93, 66, 90, 76, 91, 80, 95, 72, 97, 64, 96)]},
    {group: 'roll', mat: 'hood', tone: 2, prims: [P.poly(34, 99, 42, 93, 50, 95, 58, 97, 66, 96, 74, 94, 81, 95, 78, 100, 68, 103, 56, 104, 44, 103)]},
    // head: cranium + face (3/4 front, facing camera-left)
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 47, 24, 25),
      J(42, 26, 37, 33, 35, 40, 35, 47, 34, 52, 35, 58, 36, 64, 38, 71, 40, 77, 43, 82, 48, 85, 55, 84, 63, 80, 70, 74, 74, 66, 76, 56, 78, 46, 76, 34, 70, 26, 58, 22, 48, 22),
    ]},
    // hair: short sides, a little length on top pushed forward; the COWLICK springs off the front hairline
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(36, 41, 34, 32, 37, 24, 45, 17, 57, 13, 70, 15, 80, 22, 85, 32, 86, 46, 84, 60, 80, 70, 76, 62, 75, 52, 72, 46, 70, 38, 66, 34, 63, 32, 60, 34, 57, 31, 53, 33, 49, 31, 45, 34, 41, 33, 38, 37),
      P.poly(55, 29, 53, 21, 49, 15, 43, 12, 37, 13, 33, 17, 37, 17, 41, 18, 44, 22, 46, 29),
    ]},
    // ear sits over the hair at the side
    {group: 'ear', mat: 'skinD', tone: 3, prims: [J(72, 50, 76, 47, 80, 49, 81, 57, 78, 65, 73, 66, 71, 60)]},
  ];
  const adjust: Adjust[] = [
    // ---- hair: strands swept forward (crown -> fringe), cyan catch on the front of the crown and cowlick
    plane('hair', 1, P.line(72, 19, 60, 31), P.line(64, 16, 53, 30), P.line(78, 26, 67, 35), P.line(82, 34, 74, 46), P.line(56, 15, 47, 29), P.line(83, 44, 79, 58)),
    plane('hair', 3, P.poly(35, 32, 38, 25, 44, 20, 40, 27, 37, 34), P.poly(35, 16, 39, 13, 45, 13, 50, 16, 44, 15, 39, 15), P.line(58, 14, 66, 15)),
    plane('hair', 4, P.line(35, 30, 38, 25), P.line(36, 15, 40, 13), P.line(41, 13, 44, 13)),
    plane('hair', 0, P.poly(70, 38, 72, 46, 75, 52, 72, 48), P.line(45, 19, 49, 26), P.line(80, 62, 80, 69), P.line(38, 18, 42, 19)),
    // ---- face: front planes lit by the monitor (tone 3 base), highlights (4), the terminator (mauve, 2)
    plane('skin', 2, J(62, 33, 68, 36, 70, 44, 70, 56, 70, 66, 66, 74, 60, 79, 56, 80, 60, 72, 63, 62, 63, 50, 61, 40)),
    toMat('skin', 'skinD', 2, J(68, 36, 74, 38, 77, 46, 76, 56, 74, 66, 70, 74, 63, 80, 57, 83, 56, 80, 60, 79, 66, 74, 70, 66, 70, 56, 70, 44)),
    plane('skin', 4, P.poly(40, 35, 46, 34, 54, 35, 50, 38, 44, 39, 38, 40), P.poly(44, 45, 46, 45, 43, 56, 41, 58), J(36, 50, 38, 49, 39, 56, 36, 58), J(42, 78, 47, 77, 49, 81, 44, 82)),
    plane('skin', 5, P.line(42, 57, 42, 58), P.line(44, 36, 48, 35)),
    // eye sockets, nose shadow side + cast shadow, under-nose, under-lip
    plane('skin', 2, P.poly(38, 44, 44, 44, 44, 46, 38, 47), P.poly(49, 44, 62, 43, 64, 46, 50, 47)),
    plane('skin', 2, P.poly(46, 47, 48, 47, 49, 57, 46, 61, 44, 60)),
    toMat('skin', 'skinD', 3, J(48, 53, 52, 55, 52, 60, 47, 62)),
    toMat('skin', 'skinD', 2, J(39, 61, 47, 61, 46, 63, 40, 63)),
    plane('skin', 2, J(40, 74, 50, 74, 49, 76, 41, 76)),
    // under the jaw on the neck: deepest shadow; neck front catches a little
    plane('neck', 0, J(52, 83, 56, 84, 64, 80, 70, 76, 69, 84, 60, 88, 52, 87)),
    plane('neck', 2, P.poly(52, 88, 54, 88, 54, 97, 52, 96)),
    plane('skin', 4, J(51, 53, 56, 52, 58, 55, 53, 57)),
    // ear: inner bowl
    toMat('skinD', 'skinD', 1, J(74, 52, 77, 51, 78, 57, 76, 61)),
    toMat('skinD', 'skinD', 4, J(72, 51, 74, 49, 73, 60, 72, 58)),
    // ---- hoodie: the rolled hood edge, lit chest plane toward the monitor, drawstrings, folds
    plane('hood', 3, P.poly(35, 99, 42, 94, 50, 96, 44, 98, 38, 101)),
    plane('hood', 1, P.poly(44, 102, 56, 103, 68, 102, 78, 99, 76, 101, 66, 104, 54, 105)),
    plane('hood', 3, P.poly(7, 118, 14, 106, 26, 99, 36, 97, 30, 103, 20, 110, 12, 122)),
    plane('hood', 4, P.poly(7, 115, 14, 105, 24, 99, 16, 107, 10, 118)),
    plane('hood', 3, P.poly(22, 116, 32, 106, 40, 104, 30, 116, 24, 128)),
    plane('hood', 1, P.line(62, 106, 71, 144), P.line(84, 104, 98, 144), P.poly(88, 106, 102, 112, 107, 144, 97, 144)),
    plane('hood', 4, P.line(47, 104, 45, 119), P.line(57, 105, 58, 117)),
    plane('hood', 5, P.rect(45, 119, 1, 2), P.rect(58, 117, 1, 2)),
    plane('hood', 0, P.line(48, 105, 46, 119), P.line(58, 105, 59, 116)),
  ];
  // ---- eyes: calm, level; the upper lid sits a touch low (serene). Iris dart = whole-pixel shift.
  const dx = s.look * 2;
  const L = s.lid;
  const near = L === 2
    ? ['..............', '..............', '..............', '..LLLLLLLLLLL.', '...kkkkkkkkk..']
    : L === 1
      ? ['..............', '...LLLLLLLL...', '.LLLLLLLLLLLL.', 'LwwwiIIIiwww..', '..kkkkkkkkk...']
      : ['...LLLLLLL....', '.LLLLLLLLLLL..', 'LwwiIIIgiwww..', '.wwiIIIIiww...', '..kkkkkkkk....'];
  const far = L === 2
    ? ['.......', '.......', '.......', 'LLLLLL.', '.kkkk..']
    : L === 1
      ? ['.......', '.LLLL..', 'LLLLLL.', 'wiIIw..', '.kkk...']
      : ['..LLL..', 'LLLLLL.', 'wiIgw..', 'wiIIw..', '.kkk...'];
  // shift iris letters inside the sclera (keep lids fixed)
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const chars = r.split('');
    const irisIdx = chars.map((c, i) => (/[iIg]/.test(c) ? i : -1)).filter((i) => i >= 0);
    const out = chars.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    for (const i of irisIdx) { const j = i + d; if (j >= 0 && j < out.length && out[j] !== '.') out[j] = chars[i]; }
    return out.join('');
  });
  const brow = s.brow ? -1 : 0;
  const mouths: Record<MasMouth, string[]> = {
    rest: ['..............', 'mmmmmmmmmmmm..', '..llllllll....'],
    // the tiniest smile: the near corner lifts one pixel
    smile: ['...........m..', 'mmmmmmmmmmm...', '..llllllll....'],
    A: ['..............', 'mmmmmmmmmmmm..', 'mtTTTTTTTTm...', 'mddddddddm....', '.mdggggdm.....', '..mmmmmm......', '...llll.......'],
    E: ['..............', 'mmmmmmmmmmmmm.', 'mtTTTTTTTTTm..', '.mddddddddm...', '..mmmmmmmm....', '...lllll......'],
    O: ['..............', '...mmmmmm.....', '..mddddddm....', '..mddddddm....', '...mmmmmm.....', '....llll......'],
    M: ['..............', 'mmmmmmmmmmmm..', '.MMMMMMMMMM...', '..llllllll....'],
  };
  const stamps: Stamp[] = [
    {x: 49, y: 40 + brow, rows: ['.....bbbbbbb..', '..bbbbbbbbbbbb', 'bbbb..........'], pal: {b: PAL.B1}},
    {x: 36, y: 41 + brow, rows: ['.bbbbb', 'bbbb..'], pal: {b: PAL.B1}},
    {x: 49, y: 44, rows: dart(near, dx), pal: {L: PAL.N0, w: s.light === 'warm' ? PAL.S4 : PAL.K1, i: PAL.B3, I: PAL.N0, g: s.light === 'warm' ? PAL.W8 : PAL.C8, k: PAL.X1}},
    {x: 37, y: 44, rows: dart(far, s.look), pal: {L: PAL.N0, w: s.light === 'warm' ? PAL.S5 : PAL.K2, i: PAL.B3, I: PAL.N0, g: s.light === 'warm' ? PAL.W8 : PAL.C8, k: PAL.X1}},
    {x: 42, y: Math.round(q(62)), rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 38, y: Math.round(q(70)) - 1, rows: mouths[s.mouth], pal: {m: PAL.S0, M: PAL.X0, l: PAL.X2, t: PAL.K2, T: PAL.K3, d: PAL.N0, g: PAL.S2}},
  ];
  if (s.head === 'front') {
    // swap the head drawing: keep the (3/4) body and its hoodie planes, replace everything above the collar
    const fh = frontHead(s, q, J);
    parts.splice(0, parts.length, ...parts.filter((pt) => !['head', 'hair', 'ear', 'neck'].includes(pt.group)), ...fh.parts);
    adjust.splice(0, adjust.length, ...adjust.filter((a) => a.onlyMat === 'hood'), ...fh.adjust);
    stamps.splice(0, stamps.length, ...fh.stamps);
  }
  // compose: the head sits 3px lower and the shoulders 4px higher than drawn (shorter neck)
  const BODY = new Set(['hood', 'torso', 'collar', 'roll', 'neck']);
  const HD = 3, BD = -4;
  const mv = (pr: Prim, dy: number) => shiftPrim(pr, 0, dy);
  const bodyAdj = new Set(adjust.filter((a) => a.onlyMat === 'hood').map((a) => a));
  return {
    w: MAS_PW, h: MAS_PH,
    parts: parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => mv(pr, BODY.has(pt.group) ? (pt.group === 'neck' ? 0 : BD) : HD))})),
    adjust: adjust.map((a) => ({...a, prims: a.prims.map((pr) => mv(pr, bodyAdj.has(a) ? BD : HD))})),
    stamps: stamps.map((st) => ({...st, y: st.y + HD})),
  };
};

const masPortraitRig = (light: MasPortraitState['light']): LightRig => light === 'warm'
  ? {
    key: [-0.9, -0.4], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['hoodIn', 'neck'],
    back: [1, -0.1], backBand: 1,
    backRamp: {skin: PAL.K2, skinD: PAL.K1, hair: PAL.C2, hood: PAL.C2},
    ramps: {
      skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
      neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
      skinD: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
      hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
      hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
      hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
    },
  }
  : {
    key: [-0.9, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['hoodIn', 'neck'],
    back: [1, -0.1], backBand: 1,
    backRamp: {skin: PAL.K1, skinD: PAL.K1, hair: PAL.C2, hood: PAL.C2},
    ramps: {
      skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
      neck: [PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2, PAL.K3],
      skinD: [PAL.S0, PAL.S0, PAL.X0, PAL.X1, PAL.X2, PAL.K2],
      hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.K2, PAL.C6],
      hood: [PAL.N1, PAL.G0, PAL.G1, PAL.C2, PAL.C3, PAL.C6],
      hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
    },
  };

export const masPortrait = memo((s: MasPortraitState) => renderFigure(masPortraitFig(s), masPortraitRig(s.light)));

// ============================================================ MAS at 8 (1993): kid at a beige computer
// The compact computer shows us its back (no logo, vents, a handle recess); its screen faces him and the
// glow comes round its edge onto his face. Drawn for 1-BIT first: strong value blocks, pattern-friendly
// materials. render: 'base' (palette) or '1bit' (native MacPaint-style patterns per material).
export const MAS_KID_W = 84;
export const MAS_KID_H = 74;
export interface MasKidPose {
  lid: 0 | 1 | 2;
  /** 0 at the screen, 1 up at the camera (the dialog moment) */
  look: 0 | 1;
  mouth: 'rest' | 'o';
  /** mouse hand: 0 resting, 1 clicking */
  click: 0 | 1;
}
export const MAS_KID_DEFAULT: MasKidPose = {lid: 0, look: 0, mouth: 'rest', click: 0};

const KID_HEAD = [
  '.......Gc...............',
  '......GcGh..............',
  '.....HGGghHHHH..........',
  '...HHGgghhhhhhHH........',
  '..HGGgghhhhhhhhhhH......',
  '.HGGgghhhhhhhhhhhhH.....',
  '.HGgghhhhhhhhhhhhhhH....',
  'HGggghhhhhhhhhhhhhhhH...',
  'HGgghhhhhhhhhhhhhhhhhH..',
  'HGgGhgGhhghhhhhhhhhhhH..',
  'HlGLLGlLGmhghhhhhhhhhhH.',
  'oLLLLLLLLlmshhhhhhhhhhH.',
  'lLLbbLLLbbbmsshhhhhhhhH.',
  'lLLLLLLLLLLmsssshhhhhhH.',
  'LLLLLLLLLLlmssssoohhhH..',
  'LLLLLLLLLLlmsssosmhhH...',
  'lLLLLLLLLLlmssssomhH....',
  'lLLLLLLLLllmsssssshH....',
  'lLLLLLLLLlmmsssssH......',
  '.lLLLmLLllmmssss........',
  '.lLLLLLLlllmsss.........',
  '.lLLLLLLlllmss..........',
  '..lLLLLLllmsso..........',
  '..oLLLLLlmsso...........',
  '...oolllmsoo............',
  '.....ooosss.............',
];
const KID_LEGEND: Legend = {
  ...MAS_LEGEND,
  k: ['eye', 0], w: ['eye', 4], j: ['eye', 5],
};

const kidMats = ['skin', 'hair', 'eye', 'shirtA', 'shirtB', 'plastic', 'vent', 'glow', 'desk', 'mouse'];
const KID_BASE: Ramps = {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S5, PAL.S6, PAL.C9],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.P1],
  eye: [PAL.N0, PAL.N0, PAL.N2, PAL.P1, PAL.P2, PAL.C9],
  shirtA: [PAL.N0, PAL.N3, PAL.P0, PAL.P1, PAL.P2, PAL.C9],
  shirtB: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.N6, PAL.N7],
  plastic: [PAL.N0, PAL.D3, PAL.P0, PAL.P1, PAL.P2, PAL.C9],
  vent: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4],
  glow: [PAL.C8, PAL.C8, PAL.C9, PAL.C9, PAL.C9, PAL.C9],
  desk: [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.P0],
  mouse: [PAL.N0, PAL.N3, PAL.P0, PAL.P1, PAL.P2, PAL.C9],
};
export const MAS_KID_LADDERS: BitLadder = {
  skin: ['ink', 'd75', 'd50', 'd12', 'paper', 'paper'],
  hair: ['ink', 'd88', 'd75', 'd50', 'd12', 'paper'],
  eye: ['ink', 'ink', 'd50', 'paper', 'paper', 'paper'],
  shirtA: ['ink', 'd50', 'd25', 'paper', 'paper', 'paper'],
  shirtB: ['ink', 'ink', 'd88', 'd75', 'd75', 'd50'],
  plastic: ['ink', 'd75', 'd25', 'd12', 'paper', 'paper'],
  vent: ['ink', 'ink', 'ink', 'd88', 'd75', 'd75'],
  glow: ['paper', 'paper', 'paper', 'paper', 'paper', 'paper'],
  desk: ['ink', 'ink', 'ink', 'ink', 'd75', 'd50'],
  mouse: ['ink', 'd50', 'd25', 'paper', 'paper', 'paper'],
};

const kidFig = (p: MasKidPose): FigureDef => {
  const c = p.click;
  const parts: Part[] = [
    // --- the kid (behind the computer's right edge)
    {group: 'armF', mat: 'shirtA', tone: 2, prims: [seg(48, 37, 6, 42, 52, 5)]},
    {group: 'torso', mat: 'shirtA', tone: 3, prims: [P.poly(46, 37, 52, 32, 63, 32, 69, 35, 72, 43, 73, 66, 46, 66, 44, 45)]},
    {group: 'neck', mat: 'skin', tone: 2, prims: [P.rect(53, 30, 7, 4)]},
    {group: 'armN', mat: 'shirtA', tone: 2, prims: [seg(68, 37, 6, 72, 50, 5)]},
    {group: 'armN', mat: 'skin', tone: 2, prims: [seg(72, 50, 4, 70, 59 - c, 4)]},
    // --- the compact computer, from the back
    {group: 'side', mat: 'plastic', tone: 3, prims: [P.poly(33, 24, 40, 27, 41, 65, 34, 68)]},
    {group: 'box', mat: 'plastic', tone: 2, prims: [P.poly(3, 26, 34, 23, 35, 68, 4, 70)]},
    {group: 'box', mat: 'plastic', tone: 3, prims: [P.poly(3, 26, 34, 23, 40, 27, 10, 30)]},
    // --- desk top + the mouse
    {group: 'desk', mat: 'desk', tone: 3, prims: [P.poly(0, 66, 84, 64, 84, 74, 0, 74)]},
    {group: 'mouse', mat: 'mouse', tone: 3, prims: [P.poly(66, 60, 73, 59, 75, 65, 67, 66)]},
    {group: 'hand', mat: 'skin', tone: 3, prims: [P.ell(70, 60 - c, 3, 2)]},
  ];
  const adjust: Adjust[] = [
    // stripes across the tee (dark stripe every 3rd row), following the chest
    {prims: Array.from({length: 11}, (_, k) => P.poly(38, 38 + k * 3, 80, 36 + k * 3, 80, 37 + k * 3, 38, 39 + k * 3)), mat: 'shirtB', tone: 2},
    // torso light: glow from camera-left (the screen), falling off to the right
    {prims: [P.poly(44, 36, 54, 32, 58, 34, 50, 44, 46, 66, 43, 66, 42, 44)], add: 1},
    {prims: [P.poly(63, 32, 69, 35, 72, 43, 73, 66, 64, 66, 65, 44)], add: -1},
    // computer: handle recess, vents, a port row, the power key; NO logo
    {prims: [P.rect(11, 29, 16, 3)], mat: 'vent', tone: 1},
    {prims: [P.rect(11, 32, 16, 1)], mat: 'plastic', tone: 3},
    {prims: Array.from({length: 6}, (_, k) => P.rect(9, 36 + k * 2, 21, 1)), mat: 'vent', tone: 1},
    {prims: [P.rect(8, 60, 3, 2), P.rect(13, 60, 3, 2), P.rect(18, 60, 5, 2), P.rect(26, 59, 2, 3)], mat: 'vent', tone: 1},
    {prims: [P.line(4, 55, 34, 54)], mat: 'plastic', tone: 1},
    // screen spill: the light coming round the far edge of the box (emissive)
    {prims: [P.line(41, 28, 42, 62)], mat: 'glow', tone: 3},
    // desk: lit near the computer's glow, dark to the right; its front edge
    {prims: [P.poly(36, 65, 50, 65, 52, 67, 34, 67)], add: 2, onlyMat: 'desk'},
    {prims: [P.line(0, 72, 84, 70)], tone: 1, onlyMat: 'desk'},
    // mouse: one button, a cord
    {prims: [P.line(67, 61, 73, 60)], tone: 1, onlyMat: 'mouse'},
    {prims: [P.line(75, 64, 80, 66), P.line(80, 66, 84, 66)], mat: 'vent', tone: 1},
  ];
  return {w: MAS_KID_W, h: MAS_KID_H, parts, adjust};
};

const kidRig = (ramps: Ramps): LightRig => ({
  key: [-0.95, -0.2], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['glow', 'vent', 'desk'],
  ramps,
});

const masKidImg = (p: MasKidPose & {bit: boolean}) => {
  const ramps = p.bit ? bitRamps(kidMats) : KID_BASE;
  const img = renderFigure(kidFig(p), kidRig(ramps));
  const hx = 44, hy = 7;
  paint(img, hx, hy, KID_HEAD, KID_LEGEND, ramps);
  // eyes (big, calm) + mouth. far eye at x1-3, near eye x8-10 (head-local)
  // big calm eyes with the screen's glint on the lit side; looking up at camera moves the pupils right
  const eyesOpen = p.look ? [['kk', 'wj'], ['kkk', 'wkj']] : [['kk', 'jk'], ['kkk', 'jkw']];
  if (p.lid === 2) {
    paint(img, hx + 1, hy + 15, ['oo'], KID_LEGEND, ramps);
    paint(img, hx + 8, hy + 15, ['ooo'], KID_LEGEND, ramps);
  } else {
    paint(img, hx + 2, hy + 14, p.lid === 1 ? ['bb', 'kk'] : eyesOpen[0], KID_LEGEND, ramps);
    paint(img, hx + 8, hy + 14, p.lid === 1 ? ['bbb', 'kkk'] : eyesOpen[1], KID_LEGEND, ramps);
  }
  paint(img, hx + 4, hy + 21, p.mouth === 'o' ? ['.n.', 'nkn', '.n.'] : ['nnn'], KID_LEGEND, ramps);
  return img;
};
const kidMemo = memo(masKidImg);
export const masKid = (p: MasKidPose, render: 'base' | '1bit' = 'base') => kidMemo({...p, bit: render === '1bit'});
/** Draw the kid; '1bit' resolves each material through its own MacPaint-style pattern ladder. */
export const drawMasKid = (b: Buf, x: number, y: number, p: MasKidPose, render: 'base' | '1bit' = 'base') => {
  if (render === '1bit') blit1bit(b, masKid(p, '1bit'), x, y, MAS_KID_LADDERS, {halo: ['hair', 'skin', 'shirtB']});
  else blitTo(b, masKid(p, 'base'), x, y);
};

// ============================================================ shared room-scale head for the era sprites
const paintHead = (img: Img, x: number, y: number, head: MasDeskHead, lid: number, look: number, mouth: MasDeskPose['mouth'], ramps: Ramps) => {
  paint(img, x, y, HEADS[head], MAS_LEGEND, ramps);
  for (const f of EYES[head](lid, look)) paint(img, x + f.at[0], y + f.at[1], f.rows, MAS_LEGEND, ramps);
  const mo = MOUTHS[head][mouth];
  paint(img, x + mo.at[0], y + mo.at[1], mo.rows, MAS_LEGEND, ramps);
};

// ============================================================ MAS at 23 (2008): the stage, two popped polos
// Standing 3/4 toward camera-left (the audience). A stage spot from above-left, a cool wash rimming his back.
export const MAS_STAGE_W = 44;
export const MAS_STAGE_H = 82;
/** local [x, y] of the point between his soles */
export const MAS_STAGE_FOOT: [number, number] = [23, 80];
export interface MasStagePose {
  arm: 'present' | 'down' | 'point';
  lid: 0 | 1 | 2;
  mouth: 'rest' | 'smile' | 'open';
  look: -1 | 0 | 1;
}
export const MAS_STAGE_DEFAULT: MasStagePose = {arm: 'present', lid: 0, mouth: 'rest', look: 0};

const STAGE_RAMPS: Ramps = {
  skin: [PAL.S1, PAL.S2, PAL.S3, PAL.S5, PAL.S6, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W5],
  eye: [PAL.N0, PAL.S1, PAL.S2, PAL.S4, PAL.S5, PAL.W9],
  polo: [PAL.L0, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.L3],
  polo2: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.W6, PAL.W8],
  jeans: [PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7],
  shoe: [PAL.N2, PAL.G3, PAL.G5, PAL.G6, PAL.P2, PAL.P2],
  belt: [PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W6],
  phone: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.G4, PAL.G6],
  hood: [PAL.N1, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G5],
  key: [PAL.N0, PAL.N1, PAL.N2, PAL.C1, PAL.C3, PAL.C6],
};

// the two popped collars, hand-pixelled around the neck: coral inner collar stands taller inside the green one
const COLLARS = [ // at (14, 13): drawn after the neck, before the head (the jaw overlaps it)
  '...........R....',
  '..r.......rRR...',
  '..rR......rRRG..',
  '..RRG.....rRGGG.',
  '..RGGg...rRgGGG.',
  '.GGggg...ggGGG..',
  '..GGgg..gGGG....',
];
const COLLAR_LEGEND: Legend = {R: ['polo2', 3], r: ['polo2', 2], G: ['polo', 3], g: ['polo', 2]};

/**
 * The locked lineup (castrivals v2): MAS stands 78 px (Mario 80, Nole 93). The stage drawing keeps its 82 px canvas
 * and foot anchor, but everything above the hips sits STAGE_DY lower and the legs are that much shorter.
 */
export const MAS_STAGE_DY = 4;
export const MAS_STAGE_HIP = 46 + MAS_STAGE_DY;
const stageFig = (p: MasStagePose): FigureDef => {
  const legs: Part[] = [
    // far leg / near leg (jeans) and sneakers
    {group: 'legF', mat: 'jeans', prims: [seg(18, MAS_STAGE_HIP, 6, 17, 64, 5), seg(17, 64, 5, 17, 75, 4.5)]},
    {group: 'shoeF', mat: 'shoe', prims: [P.poly(12, 75, 19, 75, 20, 78, 20, 80, 11, 80, 11, 78)]},
    {group: 'legN', mat: 'jeans', prims: [seg(25, MAS_STAGE_HIP, 6, 26, 64, 5), seg(26, 64, 5, 27, 75, 4.5)]},
    {group: 'shoeN', mat: 'shoe', prims: [P.poly(22, 75, 29, 75, 30, 78, 30, 80, 20, 80, 21, 78)]},
  ];
  const parts: Part[] = [];
  // far arm (camera-left): presents the phone to the audience
  if (p.arm === 'present') parts.push(
    {group: 'armF', mat: 'polo2', prims: [seg(14, 24, 6, 9.4, 30, 5.5)]},
    {group: 'armF', mat: 'polo', prims: [seg(14, 24, 6, 10, 29, 5.5)]},
    {group: 'armF', mat: 'skin', prims: [seg(10, 29, 4, 6, 21, 3.5), P.ell(5.5, 19.5, 2, 2)]},
    {group: 'phone', mat: 'phone', prims: [P.rect(4, 13, 3, 6)]},
  );
  else if (p.arm === 'point') parts.push(
    {group: 'armF', mat: 'polo', prims: [seg(14, 24, 6, 10, 28, 5.5)]},
    {group: 'armF', mat: 'skin', prims: [seg(10, 28, 4, 3, 27, 3.5), P.rect(0, 26, 3, 1)]},
  );
  else parts.push(
    {group: 'armF', mat: 'polo', prims: [seg(14, 24, 6, 12, 31, 5.5)]},
    {group: 'armF', mat: 'skin', prims: [seg(12, 31, 4, 12, 43, 3.5), P.ell(12, 44, 2, 2)]},
  );
  parts.push(
    {group: 'hem2', mat: 'polo2', prims: [P.poly(13.5, 42, 30.5, 42, 30.5, 46, 13.5, 46)]},
    {group: 'torso', mat: 'polo', prims: [P.poly(12, 24, 16, 21, 27, 21, 31, 23.5, 31.5, 31, 30, 44, 14, 44, 12.5, 32)]},
    {group: 'belt', mat: 'belt', prims: [P.rect(14, 46, 16, 1)]},
    // near arm: short sleeve, forearm down, hand in the jeans pocket
    {group: 'armN', mat: 'polo2', prims: [seg(29, 24, 6, 31.3, 32, 5.5)]},
    {group: 'armN', mat: 'polo', prims: [seg(29, 24, 6, 31, 30.5, 5.5)]},
    {group: 'armN', mat: 'skin', prims: [seg(31, 31, 4, 29, 43, 3.5)]},
    {group: 'neck', mat: 'skin', prims: [P.rect(19, 16, 5, 6)]},
  );
  const upper = parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftPrim(pr, 0, MAS_STAGE_DY))}));
  const adjustUp: Adjust[] = [
    {prims: [P.line(20, 22, 20, 28)], tone: 2, onlyMat: 'polo'}, // placket
    {prims: [P.rect(20, 24, 1, 1), P.rect(20, 27, 1, 1)], tone: 5, onlyMat: 'polo'}, // buttons catch the spot
    {prims: [P.line(14, 43, 29, 43)], tone: 1, onlyMat: 'polo'}, // outer polo hem
    {prims: [P.line(14, 45, 30, 45)], tone: 1, onlyMat: 'polo2'},
    {prims: [P.line(16, 32, 18, 42), P.line(26, 30, 25, 40)], add: -1, onlyMat: 'polo'},
    {prims: [P.rect(4, 14, 3, 3)], tone: 5, onlyMat: 'phone'}, // the screen glows
  ];
  const adjust: Adjust[] = [
    ...adjustUp.map((a) => ({...a, prims: a.prims.map((pr) => shiftPrim(pr, 0, MAS_STAGE_DY))})),
    {prims: [P.line(21, MAS_STAGE_HIP + 4, 21, 74)], add: -1, onlyMat: 'jeans'},
    {prims: [P.rect(11, 79, 9, 1), P.rect(20, 79, 10, 1)], tone: 1, onlyMat: 'shoe'},
  ];
  return {w: MAS_STAGE_W, h: MAS_STAGE_H, parts: [...legs, ...upper], adjust};
};
const stageRig: LightRig = {
  key: [-0.7, -0.7], keyBand: 2, shadowBand: 2, rim: true, outline: true,
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: PAL.C4, polo: PAL.C3, polo2: PAL.C4, jeans: PAL.C3, shoe: PAL.C5, hair: PAL.C3, belt: PAL.C2, phone: PAL.C3},
  ramps: STAGE_RAMPS,
  groupBands: {torso: {key: 3, shadow: 3}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 3}},
};
export const masStage = memo((p: MasStagePose) => {
  const img = renderFigure(stageFig(p), stageRig);
  const D = MAS_STAGE_DY;
  paint(img, 14, 13 + D, COLLARS, COLLAR_LEGEND, STAGE_RAMPS);
  paintHead(img, 14, D, 'turn', p.lid, p.look, p.mouth, STAGE_RAMPS);
  // the near collar stands proud of the jaw line: re-stamp its outer edge over the head
  paint(img, 14, 13 + D, ['...........R....', '...........RR...', '...........RRG..', '............GGG.'], COLLAR_LEGEND, STAGE_RAMPS);
  return img;
});

// ============================================================ MAS at 29 (2014): hoodie + tiny parachute pack
// Seated square to camera for the throne of laptops. Gold key from above, the laptops' cyan from below.
export const MAS_THRONE_W = 46;
export const MAS_THRONE_H = 66;
/** local y of the seat (the throne's cushion line) and the armrest top */
export const MAS_THRONE_SEAT = 44;
export const MAS_THRONE_ARM = 40;
export interface MasThronePose { crown: boolean; lid: 0 | 1 | 2; look: -1 | 0 | 1; mouth: 'rest' | 'smile' | 'open'; }
export const MAS_THRONE_DEFAULT: MasThronePose = {crown: true, lid: 0, look: 0, mouth: 'smile'};

const THRONE_RAMPS: Ramps = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.W6],
  eye: [PAL.N0, PAL.S1, PAL.S2, PAL.S3, PAL.S5, PAL.W9],
  hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.W7],
  hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
  jeans: [PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7],
  shoe: [PAL.N0, PAL.N1, PAL.G3, PAL.G5, PAL.G6, PAL.W8],
  strap: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.G3, PAL.N4],
  // the pack is red nylon (never a skin-adjacent brown: at 2014's scale a brown pack against the jaw read as a beard)
  pack: [PAL.N0, PAL.R1, PAL.R2, PAL.R2, PAL.R3, PAL.P1],
  ring: [PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.G6, PAL.W8],
  gold: [PAL.W1, PAL.W3, PAL.W5, PAL.W6, PAL.W7, PAL.W9],
};
// crown: three points, a touch too small; the cowlick comes up through the middle
const CROWN = [ // at (hx+1, hy-3)
  '.J...J...J..',
  '.JJ.JjJ.JJ..',
  '.JjJJjJJjJ..',
  'JjjjjjjjjjJ.',
  'jJjJjJjJjJj.',
];
const CROWN_LEGEND: Legend = {J: ['gold', 4], j: ['gold', 2]};

const throneFig = (): FigureDef => {
  const parts: Part[] = [
    // the tiny pack sits BEHIND and below his left shoulder (camera-right), drawn first so the body covers it: it
    // peeks out over the shoulder line and past the arm, clear of the head and jaw
    {group: 'pack', mat: 'pack', prims: [P.poly(32, 19, 39, 18, 42, 21, 42, 32, 38, 33, 36, 30)]},
    // legs: seated, thighs foreshortened toward camera, shins down to the floor
    {group: 'legs', mat: 'jeans', prims: [P.poly(13, 43, 22, 43, 22, 49, 20, 51, 14, 51, 12, 48), P.poly(24, 43, 33, 43, 34, 48, 32, 51, 26, 51, 24, 49)]},
    {group: 'shin', mat: 'jeans', prims: [seg(16.5, 50, 5, 16, 61, 4.5), seg(29.5, 50, 5, 30, 61, 4.5)]},
    {group: 'shoe', mat: 'shoe', prims: [P.poly(12, 60, 19, 60, 20, 64, 11, 64), P.poly(27, 60, 34, 60, 35, 64, 26, 64)]},
    // torso + upper arms (frontal hoodie, slight frame); elbows out to the armrests
    {group: 'body', mat: 'hood', prims: [
      P.poly(13, 24, 17, 20.5, 29, 20.5, 33, 24, 34, 32, 32.5, 44, 13.5, 44, 12, 32),
      seg(13.5, 24, 5, 11.5, 38, 4.5), seg(32.5, 24, 5, 34.5, 38, 4.5),
    ]},
    // forearms come toward camera along the armrests (foreshortened), hands curl over the ends
    {group: 'fore', mat: 'hood', prims: [P.poly(9, 37, 13, 37, 13, 41, 9, 41), P.poly(33, 37, 37, 37, 37, 41, 33, 41)]},
    {group: 'hand', mat: 'skin', prims: [P.poly(9, 41, 13, 41, 13, 43, 10, 44, 9, 43), P.poly(33, 41, 37, 41, 37, 43, 36, 44, 33, 43)]},
    {group: 'neck', mat: 'skin', prims: [P.rect(20, 16, 6, 6)]},
    {group: 'collar', mat: 'hoodIn', prims: [P.poly(17, 21, 20, 20, 26, 20, 29, 21, 26, 24, 20, 24)]},
    // harness: two shoulder straps, a chest strap; the ripcord handle on his left chest
    {group: 'strap', mat: 'strap', prims: [P.poly(15, 21, 17, 21, 18, 34, 16, 34), P.poly(29, 21, 31, 21, 30, 34, 28, 34), P.rect(16, 29, 14, 2)]},
    {group: 'ring', mat: 'ring', prims: [P.poly(26, 24, 29, 24, 29, 27, 26, 27)]},
  ];
  const adjust: Adjust[] = [
    {prims: [P.line(21, 25, 21, 28), P.line(25, 25, 25, 27)], add: 1, onlyMat: 'hood'}, // drawstrings
    {prims: [P.line(15, 38, 31, 38)], add: 1, onlyMat: 'hood'}, // pocket edge
    {prims: [P.line(23, 43, 23, 51)], tone: 0, onlyMat: 'jeans'},
    {prims: [P.rect(27, 25, 1, 1)], tone: 0, onlyMat: 'ring'},
    {prims: [P.rect(22, 29, 2, 2)], tone: 4, onlyMat: 'strap'}, // buckle
    {prims: [P.line(34, 20, 40, 19)], tone: 4, onlyMat: 'pack'}, // flap
    {prims: [P.rect(41, 24, 1, 1)], tone: 5, onlyMat: 'pack'}, // snap
    {prims: [P.line(10, 42, 12, 42), P.line(34, 42, 36, 42)], tone: 2, onlyMat: 'skin'}, // knuckles
  ];
  return {w: MAS_THRONE_W, h: MAS_THRONE_H, parts, adjust};
};
const throneRig: LightRig = {
  key: [-0.3, -1], keyBand: 2, shadowBand: 2, rim: true, outline: true,
  back: [0.15, 1], backBand: 1,
  backRamp: {hood: PAL.C3, jeans: PAL.C4, shoe: PAL.C5, skin: PAL.K2, strap: PAL.C2, pack: PAL.C3, hoodIn: PAL.N1},
  ramps: THRONE_RAMPS,
  groupBands: {body: {key: 2, shadow: 3}, legs: {key: 2, shadow: 2}, strap: {key: 1, shadow: 1}},
  noEdge: ['strap', 'ring'],
};
export const masThrone = memo((p: MasThronePose) => {
  const img = renderFigure(throneFig(), throneRig);
  const hx = 16, hy = 0;
  paintHead(img, hx, hy + 3, 'camera', p.lid, p.look, p.mouth, THRONE_RAMPS);
  if (p.crown) {
    paint(img, hx + 1, hy + 2, CROWN, CROWN_LEGEND, THRONE_RAMPS);
    // the cowlick springs up through the crown
    paint(img, hx + 3, hy + 0, ['.Gc', 'GcG', '.G.'], MAS_LEGEND, THRONE_RAMPS);
  }
  return img;
});

/** Portrait window content: the background for the light state, then Mas. (w/h = the window; clips.) */
export const drawMasPortrait = (b: Buf, x: number, y: number, s: MasPortraitState, w = MAS_PW, h = MAS_PH, ox = 0) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + w && py < y + h;
  if (s.light === 'warm') lightPool(b, x, y, w, h, w * 1.05, h * 0.3, w * 0.9, h * 0.8, PAL.N1, [[1, PAL.W0], [0.7, PAL.W1], [0.45, PAL.W2]]);
  else {
    // the monitor is just out of frame camera-left: its glow on the wall, and the edge of its bezel
    lightPool(b, x, y, w, h, -8, h * 0.42, w * 0.85, h * 0.7, PAL.N1, [[1, PAL.N2], [0.72, PAL.C0], [0.5, PAL.C1], [0.3, PAL.C2]]);
    for (let j = 26; j < 96; j++) {
      b.set(x, y + j, PAL.C6);
      b.set(x + 1, y + j, (j - 30) % 5 === 0 ? PAL.C4 : PAL.N0);
    }
  }
  blitTo(b, masPortrait(s), x - ox, y, {clip});
};
