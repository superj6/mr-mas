// MR. MAS — meras: KID MAS (8), 1993 — the close shot, drawn natively in 1-bit.
// The cast room sprite (cast/mas.ts drawMasKid) is a wide-shot sprite (head ~26 px); the intro needs the
// "turns to camera" stare to read, so this is a larger medium-shot drawing in the same design: forward
// cowlick, calm level eyes, the tiny closed smile, a striped tee. Lit only by the screen (camera-left).
//
// Three head drawings, swapped on fours: A at the screen, A2 eyes already on the lens, C turned to camera.
// Two layers so the desk top can sit between them: BACK (head, neck, torso, upper arms) and FRONT
// (forearms + hands on the desk). Local box: 130 x 124; the desk's far edge is at local y KID_DESK.
import {Buf} from '../../shared/pixel/px';
import {BitFig, BitMat, BitPart, S, Shape, renderBitFig, blitBitFig, BitFigImg} from './bitfig';

/** the drawing is authored in design units and redrawn (not resampled) at K */
export const K = 1.35;
export const KID_W = Math.ceil(130 * K);
export const KID_H = Math.ceil(124 * K);
/** local y of the desk's far edge (the torso is hidden below it; forearms lie on the desk top) */
export const KID_DESK = Math.round(106 * K);

export type KidHead = 'A' | 'A2' | 'C';

const LIGHT: [number, number, number] = [-0.82, -0.2, 0.55];

const hairTex = (x: number, y: number, v: number): 'ink' | 'paper' | null => {
  // lit strands: short paper runs combed down-forward on the lit side only
  if (v > 0.55 && (((x - y * 2) % 7) + 7) % 7 === 0 && y % 4 !== 0) return 'paper';
  return null;
};
// stripes follow the chest (a gentle arc), two rows ink every five
const stripeY = (x: number, y: number) => y + Math.round(((x - 60) * (x - 60)) / 420);
const teeTex = (x: number, y: number, v: number): 'ink' | 'paper' | null => {
  const k = ((stripeY(x, y) % 5) + 5) % 5;
  if (k < 2) return 'ink';
  return v > 0.6 ? 'paper' : null;
};

const MATS: Record<string, BitMat> = {
  // skin: paper in the light, ONE hard 50% shadow shape past the terminator (no gradient dither on a face)
  skin: {steps: [[0.47, 8], [0, 4]]},
  neck: {steps: [[0, 4]]},
  hair: {steps: [[0.93, 2], [0.72, 1], [0, 0]], tex: hairTex},
  tee: {steps: [[0.56, 8], [0.42, 7], [0.3, 6], [0.18, 5], [0.08, 4], [0, 3]], tex: teeTex},
  arm: {steps: [[0.4, 8], [0, 4]]},
};

// ------------------------------------------------------------------ heads
const HEAD_VOL = {k: 'ell' as const, cx: 56, cy: 30, rx: 22, ry: 24, rz: 1};

const headA = (): BitPart[] => [
  {mat: 'hair', shapes: [S.ell(58, 27, 19.5, 19.5)], vol: HEAD_VOL, bias: 0.05},
  {mat: 'neck', shapes: [S.poly(49, 46, 62, 42, 64, 48, 64, 56, 48, 56)], vol: {k: 'cyl', cx: 56, rx: 10}, bias: -0.1},
  {mat: 'skin', shapes: [S.poly(42, 21, 40, 25, 40, 28, 39, 30, 37, 33, 35, 36, 36, 38, 38, 39, 39, 41, 38, 43, 39, 45, 40, 47, 43, 50, 48, 51, 53, 49, 58, 45, 62, 40, 64, 35, 64, 26, 56, 21, 48, 19)], vol: HEAD_VOL, bias: 0.12},
  // bangs: a kid's cut, jagged, sitting on the brows
  {mat: 'hair', shapes: [S.poly(39, 18, 41, 25, 43, 23, 45, 26, 47, 22, 50, 25, 52, 21, 55, 24, 58, 21, 61, 24, 63, 22, 65, 28, 68, 20, 60, 12, 48, 12)], vol: HEAD_VOL, bias: 0.05},
  // side hair in front of the ear
  {mat: 'hair', shapes: [S.poly(62, 22, 66, 23, 66, 31, 64, 30)], vol: HEAD_VOL},
  {mat: 'skin', shapes: [S.ell(67.5, 34, 3.5, 5.5)], vol: {k: 'ell', cx: 66, cy: 33, rx: 5, ry: 6}, bias: -0.1},
];

const headC = (): BitPart[] => [
  {mat: 'hair', shapes: [S.ell(58, 27, 19.5, 19.5)], vol: HEAD_VOL, bias: 0.05},
  {mat: 'neck', shapes: [S.poly(50, 46, 64, 44, 66, 50, 66, 56, 50, 56)], vol: {k: 'cyl', cx: 58, rx: 10}, bias: -0.1},
  {mat: 'skin', shapes: [S.poly(44, 21, 41, 26, 41, 31, 41, 35, 42, 40, 44, 45, 47, 49, 52, 51, 58, 52, 63, 50, 67, 46, 70, 41, 71, 34, 71, 26, 65, 21, 54, 19)], vol: {k: 'ell', cx: 58, cy: 32, rx: 20, ry: 24, rz: 1}, bias: 0.12},
  {mat: 'hair', shapes: [S.poly(40, 20, 42, 26, 44, 23, 47, 26, 49, 22, 52, 25, 55, 21, 58, 24, 61, 21, 64, 25, 67, 22, 70, 26, 73, 20, 66, 12, 50, 12)], vol: HEAD_VOL, bias: 0.05},
  {mat: 'hair', shapes: [S.poly(70, 22, 74, 24, 74, 31, 72, 31)], vol: HEAD_VOL},
  {mat: 'skin', shapes: [S.ell(75, 35, 2.6, 5)], vol: {k: 'ell', cx: 74, cy: 34, rx: 4, ry: 6}, bias: -0.15},
];

// forward cowlick: springs up off the front of the crown and curls toward the screen (authored at K)
const COWLICK = ['   ##        ', '  #o#        ', ' #o##        ', ' #o###       ', '#o####       ', '#o#####      ', ' #######     ', ' ########    ', '  #########  ', '  ########## ', '   ##########', '    #########', '     ########'];

type Stamp = {x: number; y: number; rows: string[]};
// Eyes (authored at K): a level, slightly heavy upper lid = the calm; a big round iris under it; the
// screen's glint sits on the camera-left side. Never blinks.
const EYE_A_NEAR = ['.########.', '#oo###oooo', '#o####oooo', '######oooo', 'o####ooooo', '..........'];
const EYE_A2_NEAR = ['.########.', 'oo#oo###oo', 'oo#o####oo', 'oo######oo', 'ooo####ooo', '..........'];
const EYE_A_FAR = ['#####', '#o##o', '####o', '###oo', '.....'];
const EYE_A2_FAR = ['#####', 'o#o##', 'o####', 'oo###', '.....'];
const featuresA = (lens: boolean): Stamp[] => [
  {x: 58, y: 4, rows: COWLICK},
  // brows (level, calm)
  {x: 64, y: 38, rows: ['.#######']},
  {x: 54, y: 39, rows: ['####']},
  {x: 62, y: 41, rows: lens ? EYE_A2_NEAR : EYE_A_NEAR},
  {x: 53, y: 42, rows: lens ? EYE_A2_FAR : EYE_A_FAR},
  // nose: the tip is the silhouette; the nostril and the shadow under it
  {x: 51, y: 52, rows: ['..#', '.##']},
  // mouth: tiny, closed, the far corner up one pixel
  {x: 54, y: 61, rows: ['.......#', '#######.']},
  {x: 56, y: 65, rows: ['::::']},
  // ear: the inner curve
  {x: 89, y: 44, rows: ['.##', '#..', '#..', '#..', '#..', '.##']},
];

const EYE_C = ['.########.', 'oo#oo###oo', 'oo#o####oo', 'oo######oo', 'ooo####ooo', '..........'];
const featuresC = (): Stamp[] => [
  {x: 64, y: 3, rows: COWLICK},
  {x: 57, y: 38, rows: ['.######']},
  {x: 76, y: 38, rows: ['#######.']},
  // eyes straight into the lens: the stare
  {x: 56, y: 41, rows: EYE_C},
  {x: 75, y: 41, rows: EYE_C},
  // nose (front-ish): the lit side is open, the shade side carries it
  {x: 70, y: 47, rows: ['...#', '...#', '...#', '..##']},
  {x: 67, y: 60, rows: ['........#', '########.']},
  {x: 70, y: 64, rows: [':::']},
  {x: 100, y: 45, rows: ['#', '#', '#', '#', '.#']},
];

// ------------------------------------------------------------------ body (an 8-year-old: narrow shoulders, short neck)
const TORSO_VOL = {k: 'cyl' as const, cx: 61, rx: 26};
const body = (): BitPart[] => [
  // bare upper arms under the short sleeves
  {mat: 'arm', shapes: [S.poly(37, 71, 47, 71, 42, 97, 33, 103, 29, 94)], vol: {k: 'cyl', cx: 38, rx: 8}, bias: 0.08},
  {mat: 'arm', shapes: [S.poly(77, 71, 86, 70, 91, 93, 89, 104, 81, 102, 79, 87)], vol: {k: 'cyl', cx: 84, rx: 7}, bias: -0.05},
  // tee: 3/4 toward camera-left, slight frame
  {mat: 'tee', shapes: [S.poly(40, 59, 45, 53, 54, 50, 68, 50, 77, 53, 82, 59, 83, 73, 82, 121, 42, 121, 39, 81)], vol: TORSO_VOL, bias: 0.06},
  // short sleeves
  {mat: 'tee', shapes: [S.poly(40, 57, 47, 55, 47, 73, 36, 75, 35, 67)], vol: {k: 'cyl', cx: 41, rx: 8}, bias: 0.06},
  {mat: 'tee', shapes: [S.poly(77, 55, 83, 58, 87, 72, 79, 74, 78, 65)], vol: {k: 'cyl', cx: 82, rx: 7}, bias: -0.04},
  // neck band of the tee
  {mat: 'arm', shapes: [S.poly(50, 51, 56, 54, 63, 54, 69, 51, 67, 49, 57, 51, 52, 49)], vol: TORSO_VOL, bias: -0.05},
];

// forearms + hands on the desk top (drawn after the desk)
const front = (click: boolean): BitPart[] => [
  // far forearm reaches left to the keys; hand flat on the keyboard
  {mat: 'arm', shapes: [S.poly(31, 101, 40, 102, 26, 113, 14, 115, 13, 110)], vol: {k: 'flat', nx: -0.4, ny: -0.8, nz: 0.5}, bias: 0.1},
  {mat: 'arm', shapes: [S.poly(5, 110, 15, 108, 17, 114, 8, 117, 3, 115)], vol: {k: 'flat', nx: -0.5, ny: -0.8, nz: 0.4}, bias: 0.15},
  // near forearm forward to the mouse
  {mat: 'arm', shapes: [S.poly(82, 102, 90, 102, 101, 111, 95, 116)], vol: {k: 'flat', nx: 0.2, ny: -0.9, nz: 0.4}, bias: -0.05},
  {mat: 'arm', shapes: [S.poly(96, 110, 104, 107 + (click ? 1 : 0), 108, 110 + (click ? 1 : 0), 106, 115, 98, 116)], vol: {k: 'flat', nx: 0, ny: -0.9, nz: 0.4}, bias: 0.02},
];

/** the head sits low on the shoulders (an 8-year-old has almost no neck) */
const HEAD_DY = 3;
const moveShape = (sh: Shape, dy: number): Shape =>
  sh.k === 'poly' ? {k: 'poly', pts: sh.pts.map((v, i) => (i % 2 ? v + dy : v))} : sh.k === 'ell' ? {...sh, cy: sh.cy + dy} : {...sh, y: sh.y + dy};
const moveVol = (v: BitPart['vol'], dy: number): BitPart['vol'] => (v.k === 'ell' ? {...v, cy: v.cy + dy} : v);
const lower = (parts: BitPart[]) => parts.map((p) => ({...p, shapes: p.shapes.map((sh) => moveShape(sh, HEAD_DY)), vol: moveVol(p.vol, HEAD_DY)}));
const scaleShape = (sh: Shape): Shape =>
  sh.k === 'poly' ? {k: 'poly', pts: sh.pts.map((v) => v * K)} : sh.k === 'ell' ? {k: 'ell', cx: sh.cx * K, cy: sh.cy * K, rx: sh.rx * K, ry: sh.ry * K} : {k: 'rect', x: sh.x * K, y: sh.y * K, w: sh.w * K, h: sh.h * K};
const scaleVol = (v: BitPart['vol']): BitPart['vol'] =>
  v.k === 'ell' ? {...v, cx: v.cx * K, cy: v.cy * K, rx: v.rx * K, ry: v.ry * K} : v.k === 'cyl' ? {...v, cx: v.cx * K, rx: v.rx * K} : v;
const scaled = (parts: BitPart[]) => parts.map((p) => ({...p, shapes: p.shapes.map(scaleShape), vol: scaleVol(p.vol)}));

const cache = new Map<string, {back: BitFigImg; front: BitFigImg}>();
export const kidImgs = (head: KidHead, click = false) => {
  const key = head + (click ? 'c' : '');
  let v = cache.get(key);
  if (v) return v;
  const back: BitFig = {
    w: KID_W, h: KID_H, light: LIGHT, mats: MATS,
    parts: scaled([...body(), ...lower(head === 'C' ? headC() : headA())]),
    stamps: head === 'C' ? featuresC() : featuresA(head === 'A2'),
  };
  const fr: BitFig = {w: KID_W, h: KID_H, light: LIGHT, mats: MATS, parts: scaled(front(click))};
  v = {back: renderBitFig(back), front: renderBitFig(fr)};
  cache.set(key, v);
  return v;
};

/** Draw the BACK layer (head, torso) — clipped at the desk's far edge. */
export const drawKidBack = (b: Buf, x: number, y: number, head: KidHead, mask?: Uint8Array) =>
  blitBitFig(b, kidImgs(head).back, x, y, {mask, halo: true, clip: (_X, Y) => Y < y + KID_DESK});
/** Draw the FRONT layer (forearms, hands) on the desk top. */
export const drawKidFront = (b: Buf, x: number, y: number, click: boolean, mask?: Uint8Array) =>
  blitBitFig(b, kidImgs('A', click).front, x, y, {mask});

export type {Shape};
