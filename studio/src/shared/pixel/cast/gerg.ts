// MR. MAS — cast: GERG MOCKBRAN. Slim coder, short dark hair, total focus. Types so fast the keycaps pop
// off like popcorn. Name card: "GERG MOCKBRAN / ORG CHART: HIM."
//   gergTable    room sprite at THE WOODROSE dinner table, hunched over his laptop (3/4, facing camera-left)
//   gergKeycaps  deterministic keycap "popcorn" for any frame (whole-pixel arcs, one bounce, they stay)
//   gergPortrait conversation portrait (laptop uplight + warm restaurant rim)
// Authored facing camera-left like the rest of the cast; pass flip to face right.
import {Buf} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure} from '../figure';
import {Legend, Ramps, newImg, over, paint, memo, seg, blitTo, edgeLight, hash01, lightPool, shiftPrim, fringe} from './kit';

// skin warm o s m l L R · skin under the laptop glow a A · hair H h g G c · eye k · mouth n
const LEG: Legend = {
  o: ['skin', 0], s: ['skin', 1], m: ['skin', 2], l: ['skin', 3], L: ['skin', 4], R: ['skin', 5],
  a: ['skinC', 3], A: ['skinC', 4],
  H: ['hair', 0], h: ['hair', 1], g: ['hair', 2], G: ['hair', 3], c: ['hair', 4],
  k: ['eye', 0], w: ['eye', 3], n: ['skin', 0], b: ['hair', 0],
  Q: ['tee', 0], q: ['tee', 1], u: ['tee', 2], U: ['tee', 3], e: ['tee', 4], E: ['tee', 5],
  K: ['lap', 0], y: ['lap', 2], Y: ['lap', 3], z: ['lap', 5], Z: ['screen', 4],
};

/** THE WOODROSE: warm pendant light from above, the laptop's cool glow on his face and hands. */
export const GERG_RAMPS: Ramps = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.W8],
  skinC: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.W3, PAL.W5],
  eye: [PAL.N0, PAL.X0, PAL.X1, PAL.K2, PAL.K3, PAL.C8],
  tee: [PAL.N0, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.W5],
  chair: [PAL.D0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.W4],
  lap: [PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.W6],
  screen: [PAL.C3, PAL.C4, PAL.C5, PAL.C6, PAL.C7, PAL.C8],
  cap: [PAL.N0, PAL.G2, PAL.G4, PAL.G6, PAL.P2, PAL.P2],
};

export const GERG_W = 52;
export const GERG_H = 52;
/** local y of his edge of the table top (the set paints the table over the BACK layer below this) */
export const GERG_TABLE_EDGE = 37;
/** local y where popped keycaps come to rest on the table */
export const GERG_CAP_FLOOR = 44;

export interface GergPose {
  /** typing drawing 0..2 (cycle every frame: he types on 1s) */
  type: 0 | 1 | 2;
  lid: 0 | 1 | 2;
  /** 0 eyes on the screen, 1 glance up (rare) */
  look: 0 | 1;
  mouth: 'rest' | 'open';
  /** screen flicker state 0/1 (cool light on the face steps between two ramps) */
  flick: 0 | 1;
}
export const GERG_DEFAULT: GergPose = {type: 0, lid: 0, look: 0, mouth: 'rest', flick: 0};

// head, 3/4 toward the laptop (camera-left), tipped down. Close-cropped dark hair, level brows, narrowed eyes.
const HEAD = [
  '....HHHHH.....',
  '..HHhgghhHH...',
  '.HgGGghhhhhH..',
  '.HGGghhhhhhhH.',
  'HGgghhhhhhhhhH',
  'HgGLhhhhhhhhhH',
  'oLLLLmhhhhhhhH',
  'LLLLLLmshhhhhH',
  'bbbLbbbmsshhhH',
  'lllLllmsoossh.',
  'LLLLllmssmssh.',
  'RLLllmssssss..',
  'olllmssssso...',
  '.lllmmssss....',
  '.lLlmsssso....',
  '..olmmsso.....',
  '...aaasss.....',
];
const HEAD_AT: [number, number] = [11, 3];

// hunched torso (x 14.., y 18..): shoulders rounded forward over the laptop
const TORSO = [
  '.......sssQQ..........',
  '....QQEsssqQQQ........',
  '..QEeeUUuqqqqqQQ......',
  '.QEeUUUUuuqqqqqqQQ....',
  'QEeUUUUUuuqqqqqqqqQ...',
  'QeUUUUUuuuqqqqqqqqqQ..',
  'QeUUUUuuuqqqqqqqqqqQ..',
  'QeUUUuuuqqqqqqqqqqqqQ.',
  'QUUUuuuqqqqqqqqqqqqqQ.',
  'QUUuuuuqqqqqqqqqquqqQ.',
  'QUuuuuqqqqqqqqqqquqqqQ',
  'QuuuuuqqqqqqqqqqquqqqQ',
  'QuuuuqqqqqqqqqqqquqqqQ',
  'QuuuqqqqqqqqqqqqqQqqqQ',
  'QuuuqqqqqqqqqqqqqQqqQ.',
  'QuuqqqqqqqqqqqqqqQqqQ.',
  'QQQQQQQQQQQQQQQQQQQQ..',
];

// laptop: lid back toward camera-left, the keyboard deck toward him, glow leaking off the lid's edge
const LAPTOP = [ // at (1, 20)
  '..KKKKK.........',
  '.KyYYYK.........',
  '.KyyYYK.........',
  '.KyyyYKZ........',
  'KyyyyYKZ........',
  'KyyyyYKZ........',
  'KyyyyYKZ........',
  'KyyyyYKZ........',
  'KyyyyyYKZ.......',
  'KyyyyyYKZ.......',
  'KyyyyyYKZ.......',
  'KyyyyyYKZ.......',
  'KyyyyyYKZ.......',
  'KyyyyyyYKZ......',
  'KyyyyyyYKZ......',
  'KyyyyyyYKZ......',
  'KKKKKKKKKKYYYYYYY',
  '.KzyzyzyzyzyzyzYK',
  '..KKKKKKKKKKKKKKK',
];

// forearms + hands, three typing drawings (on 1s)
const HANDS: Array<{f: [number, number]; n: [number, number]}> = [
  {f: [0, 0], n: [0, -1]},
  {f: [0, -1], n: [1, 0]},
  {f: [-1, 0], n: [0, 0]},
];
const FORE = [ // x 16.., y 30.. (both forearms converge on the deck)
  '..........QqqQ....QqQ.',
  '........QQuqQ....QuqQ.',
  '......QQUuqQ...QQuqQ..',
  '....QQUUuqQ..QQUuqQ...',
  '..QQUUuqQQ.QQUUuqQ....',
  '.QUUuqQQ..QUUuqQQ.....',
  'QUuqQQ...QUuqQQ.......',
];
const HAND = ['.AaA', 'AaAa', '.oo.'];

const rig = (): LightRig => ({
  key: [0.2, -1], keyBand: 1, shadowBand: 2, rim: true, outline: true,
  ramps: GERG_RAMPS,
  groupBands: {chair: {key: 1, shadow: 2}},
});

const back = (p: GergPose): Img => {
  const parts: Part[] = [
    // dining chair: a bentwood back rising behind him (camera-right)
    {group: 'chair', mat: 'chair', prims: [P.poly(34, 16, 38, 14, 42, 16, 43, 38, 39, 38, 38, 20)]},
    {group: 'chair', mat: 'chair', prims: [P.rect(33, 26, 10, 2)]},
  ];
  const img = renderFigure({w: GERG_W, h: GERG_H, parts}, rig());
  const ramps = p.flick ? {...GERG_RAMPS, skinC: [PAL.S0, PAL.X0, PAL.X2, PAL.K1, PAL.K2, PAL.K3]} : GERG_RAMPS;
  paint(img, 14, 18, TORSO, LEG, ramps);
  paint(img, HEAD_AT[0], HEAD_AT[1], HEAD, LEG, ramps);
  // eyes: narrowed on the screen; a glance up opens them a pixel
  const [hx, hy] = HEAD_AT;
  if (p.lid === 2) paint(img, hx, hy + 9, ['mmm', '...'], LEG, ramps);
  else if (p.look === 1) paint(img, hx, hy + 8, ['bbb.bbb', 'kwl.lwk'], LEG, ramps);
  else paint(img, hx, hy + 9, p.lid === 1 ? ['kkk.kkk'] : ['kkl.kkm'], LEG, ramps);
  paint(img, hx + 1, hy + 13, p.mouth === 'open' ? ['nnn', '.k.'] : ['nnn'], LEG, ramps);
  return img;
};

const front = (p: GergPose): Img => {
  const img = newImg(GERG_W, GERG_H);
  const ramps = GERG_RAMPS;
  paint(img, 1, 20, LAPTOP, LEG, ramps);
  paint(img, 16, 30, FORE, LEG, ramps);
  const h = HANDS[p.type];
  paint(img, 14 + h.f[0], 36 + h.f[1], HAND, LEG, ramps);
  paint(img, 23 + h.n[0], 36 + h.n[1], HAND, LEG, ramps);
  return img;
};

export const gergBack = memo(back);
export const gergFront = memo(front);

// ------------------------------------------------------------------ keycap popcorn
export interface Keycap { x: number; y: number; spin: 0 | 1 | 2; resting: boolean; }
/**
 * Keycaps popped by frame f (local sprite coords). Deterministic: cap i launches at a hashed frame from
 * `from`, arcs on whole pixels, bounces once on the table and stays there.
 */
export const gergKeycaps = (f: number, opts: {from?: number; rate?: number; max?: number; floor?: number} = {}): Keycap[] => {
  const from = opts.from ?? 0, rate = opts.rate ?? 5, max = opts.max ?? 24, floor = opts.floor ?? GERG_CAP_FLOOR;
  const out: Keycap[] = [];
  for (let i = 0; i < max; i++) {
    const t0 = from + Math.floor(i * rate + hash01(i, 1) * rate * 0.8);
    const t = f - t0;
    if (t < 0) break;
    const x0 = 9 + Math.floor(hash01(i, 2) * 12), y0 = 37;
    const vx = (hash01(i, 3) - 0.42) * 3.6, vy = -(3.1 + hash01(i, 4) * 1.7), g = 0.36;
    // flight until it comes down to the floor, then one small bounce
    const tLand = (-vy + Math.sqrt(vy * vy + 2 * g * (floor - y0))) / g;
    let x: number, y: number, resting = false;
    if (t < tLand) { x = x0 + vx * t; y = y0 + vy * t + 0.5 * g * t * t; }
    else {
      const xl = x0 + vx * tLand, tb = t - tLand, vb = -1.1;
      const tb1 = (2 * -vb) / g;
      if (tb < tb1) { x = xl + vx * 0.4 * tb; y = floor + vb * tb + 0.5 * g * tb * tb; }
      else { x = xl + vx * 0.4 * tb1; y = floor; resting = true; }
    }
    const spin = (resting ? 0 : Math.floor(t / 2) % 3) as 0 | 1 | 2;
    out.push({x: Math.round(x), y: Math.round(Math.min(y, floor)), spin, resting});
  }
  return out;
};
// three tumble drawings, 3x2 / 2x2 / 2x3
const CAP: string[][] = [['LLl', 'mms'], ['LL', 'ms'], ['L.', 'Lm', '.s']];
const CAP_LEG: Legend = {L: ['cap', 4], l: ['cap', 3], m: ['cap', 2], s: ['cap', 1]};
export const drawKeycaps = (b: Buf, x: number, y: number, caps: Keycap[], flip = false) => {
  for (const c of caps) {
    const spr = CAP[c.spin];
    const img = newImg(3, 3);
    paint(img, 0, 0, spr, CAP_LEG, GERG_RAMPS);
    blitTo(b, img, flip ? x + GERG_W - 1 - c.x - 2 : x + c.x, y + c.y - spr.length + 1, {flip});
  }
};

/** Draw Gerg at the table: back layer, the caller's table top, then laptop + hands, then keycaps. */
export const drawGergTable = (b: Buf, x: number, y: number, p: GergPose, f: number, opts: {table?: (b: Buf, x: number, y: number) => void; flip?: boolean; capsFrom?: number; map?: (c: number, x: number, y: number) => number} = {}) => {
  blitTo(b, gergBack(p), x, y, {flip: opts.flip, map: opts.map});
  opts.table?.(b, x, y + GERG_TABLE_EDGE);
  blitTo(b, gergFront(p), x, y, {flip: opts.flip, map: opts.map});
  drawKeycaps(b, x, y, gergKeycaps(f, {from: opts.capsFrom ?? 0}), opts.flip);
};

/** The typing drawing for a frame: on 1s, in an irregular order so it never reads as a loop. */
export const gergTypeAt = (f: number): 0 | 1 | 2 => ([0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 0, 2][((f % 12) + 12) % 12] as 0 | 1 | 2);

// ============================================================ portrait (112x136)
export const GERG_PW = 112;
export const GERG_PH = 136;
export interface GergPortraitState { mouth: 'rest' | 'open' | 'smile'; lid: 0 | 1 | 2; look: -1 | 0 | 1; }
export const GERG_PORTRAIT_DEFAULT: GergPortraitState = {mouth: 'rest', lid: 1, look: 0};

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

const portraitFig = (s: GergPortraitState): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'tee', tone: 2, prims: [P.poly(2, 144, 4, 118, 14, 106, 30, 99, 46, 96, 70, 97, 88, 102, 102, 112, 110, 144)]},
    {group: 'neck', mat: 'neck', tone: 1, prims: [P.poly(50, 78, 50, 100, 60, 103, 70, 98, 69, 74)]},
    {group: 'collar', mat: 'tee', tone: 1, prims: [P.poly(42, 98, 50, 96, 60, 99, 70, 96, 78, 99, 70, 104, 60, 106, 50, 103)]},
    // slim face, defined cheekbones; 3/4 facing camera-left, tipped slightly down toward the laptop
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 46, 23, 24),
      P.poly(40, 28, 36, 36, 35, 44, 35, 50, 33, 56, 34, 62, 36, 68, 38, 74, 42, 80, 48, 84, 55, 83, 63, 79, 70, 72, 74, 64, 77, 54, 78, 44, 75, 32, 68, 25, 56, 21, 46, 22),
    ]},
    // close-cropped dark hair, a neat straight hairline, a little length on top
    {group: 'hair', mat: 'hair', tone: 1, prims: [
      P.poly(36, 38, 35, 30, 40, 22, 48, 16, 60, 13, 72, 15, 81, 22, 85, 32, 85, 46, 82, 58, 78, 64, 75, 56, 74, 47, 71, 42, 69, 34, 60, 31, 50, 31, 42, 33, 38, 38),
    ]},
    {group: 'ear', mat: 'skinD', tone: 3, prims: [P.poly(71, 48, 75, 45, 79, 47, 80, 55, 77, 62, 72, 63, 70, 57)]},
  ];
  const adjust: Adjust[] = [
    // hair: short clipped texture, warm catch on the crown from the pendant above
    plane('hair', 2, P.poly(40, 24, 50, 17, 62, 14, 72, 16, 64, 18, 52, 20, 44, 26)),
    plane('hair', 3, P.line(46, 18, 58, 14), P.line(62, 14, 70, 15)),
    // clipped texture + a hairline that is neat but not ruler-straight
    plane('hair', 2, P.line(44, 24, 50, 20), P.line(54, 22, 60, 18), P.line(64, 21, 70, 18), P.line(40, 30, 44, 26)),
    {prims: [P.map(40, 30, fringe(20, 3, 3, 0.7))], tone: 1, onlyMat: 'skin', mat: 'hair'},
    plane('hair', 0, P.poly(69, 34, 72, 40, 74, 47, 71, 44), P.line(82, 40, 80, 56)),
    // face: top planes warm (pendant above), lower planes cool (laptop below-front)
    // the laptop's cool kiss: only on the planes that face down toward it (jaw underside, chin tip, lower lip)
    toMat('skin', 'skinC', 3, P.poly(40, 79, 44, 82, 50, 84, 56, 83, 62, 80, 62, 82, 56, 85, 48, 86, 42, 83)),
    toMat('skin', 'skinC', 4, P.poly(43, 81, 48, 83, 52, 83, 48, 84)),
    plane('skin', 2, P.poly(36, 64, 38, 70, 42, 77, 46, 80, 42, 80, 38, 74, 36, 68)),
    plane('skin', 4, P.poly(39, 34, 48, 32, 56, 33, 50, 37, 42, 38)),
    plane('skin', 2, P.poly(62, 34, 68, 38, 70, 48, 70, 58, 66, 66, 60, 72, 60, 60, 62, 48)),
    toMat('skin', 'skinD', 2, P.poly(68, 38, 74, 38, 77, 48, 74, 62, 70, 72, 63, 79, 60, 72, 66, 66, 70, 58, 70, 48)),
    // cheekbone + under-cheekbone hollow (slim face)
    plane('skin', 4, P.poly(50, 52, 58, 51, 61, 54, 54, 56)),
    plane('skin', 2, P.poly(56, 59, 61, 58, 62, 62, 58, 66)),
    // eye sockets + brow ridge, nose
    plane('skin', 2, P.poly(38, 42, 44, 42, 45, 45, 38, 46), P.poly(48, 42, 62, 41, 64, 45, 49, 46)),
    plane('skin', 4, P.poly(44, 44, 46, 44, 42, 56, 40, 57)),
    plane('skin', 2, P.poly(46, 46, 48, 46, 48, 56, 45, 59, 43, 58)),
    plane('skin', 1, P.poly(38, 60, 46, 60, 45, 62, 39, 62)),
    plane('neck', 0, P.poly(50, 82, 56, 84, 64, 79, 70, 74, 69, 84, 60, 89, 50, 88)),
    toMat('skinD', 'skinD', 1, P.poly(73, 50, 76, 49, 77, 55, 75, 59)),
    // tee: the laptop's cool light on the chest, warm rim on the far shoulder
    toMat('tee', 'teeC', 3, P.poly(4, 128, 8, 118, 16, 110, 12, 120, 8, 132)),
    plane('tee', 1, P.line(64, 106, 70, 136), P.poly(88, 104, 102, 112, 110, 136, 98, 136)),
    plane('tee', 3, P.poly(44, 99, 50, 97, 60, 100, 70, 97, 76, 99, 70, 102, 60, 104, 50, 102)),
  ];
  const L = s.lid;
  const dx = s.look * 2;
  // focused: the lids ride low; even "open" is a working squint
  const near = L === 2 ? ['.............', '.............', '.LLLLLLLLLLL.', '..kkkkkkkkk..']
    : L === 1 ? ['.............', '..LLLLLLLLL..', 'LLLLLLLLLLLL.', 'LwwiIIgiwww..', '..kkkkkkkk...']
      : ['..LLLLLLLL...', '.LLLLLLLLLLL.', 'LwwiIIgiwww..', '.wwiIIIiww...', '..kkkkkkkk...'];
  const far = L === 2 ? ['......', '......', 'LLLLL.', '.kkk..'] : L === 1 ? ['......', '.LLLL.', 'LLLLL.', 'wiIw..', '.kk...'] : ['..LL..', 'LLLLL.', 'wiIg..', 'wiIw..', '.kk...'];
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const ch = r.split(''), out = ch.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    ch.forEach((c, i) => { if (/[iIg]/.test(c) && out[i + d] && out[i + d] !== '.') out[i + d] = c; });
    return out.join('');
  });
  const mouths = {
    rest: ['.............', 'mmmmmmmmmmm..', '..lllllll....'],
    open: ['.............', 'mmmmmmmmmmm..', 'mtTTTTTTTm...', '.mddddddm....', '..lllll......'],
    smile: ['..........m..', 'mmmmmmmmmm...', '..lllllll....'],
  };
  const stamps: Stamp[] = [
    {x: 47, y: 38, rows: ['bbbbbbbbbbbbbbb', 'bbbbbbbbbbbbbb.'], pal: {b: PAL.B0}}, // level, low brow: concentration
    {x: 35, y: 39, rows: ['bbbbbb', '.bbbb.'], pal: {b: PAL.B0}},
    {x: 49, y: 43, rows: dart(near, dx), pal: {L: PAL.N0, w: PAL.K1, i: PAL.B2, I: PAL.N0, g: PAL.C8, k: PAL.X1}},
    {x: 37, y: 43, rows: dart(far, s.look), pal: {L: PAL.N0, w: PAL.K2, i: PAL.B2, I: PAL.N0, g: PAL.C8, k: PAL.X1}},
    {x: 42, y: 58, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 38, y: 68, rows: mouths[s.mouth], pal: {m: PAL.S0, l: PAL.S3, t: PAL.S4, T: PAL.P1, d: PAL.N0}},
  ];
  // compose: head 3px lower, shoulders 4px higher than drawn (a shorter neck)
  const BODY = new Set(['torso', 'collar']);
  const mv = (pr: Prim, dy: number) => shiftPrim(pr, 0, dy);
  const bodyMat = new Set(['tee', 'teeC']);
  return {
    w: GERG_PW, h: GERG_PH,
    parts: parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => mv(pr, BODY.has(pt.group) ? -4 : pt.group === 'neck' ? 0 : 3))})),
    adjust: adjust.map((a) => ({...a, prims: a.prims.map((pr) => mv(pr, bodyMat.has(a.onlyMat ?? '') ? -4 : 3))})),
    stamps: stamps.map((st) => ({...st, y: st.y + 3})),
  };
};
const PRIG: LightRig = {
  key: [-0.6, 0.8], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck'],
  back: [0.9, -0.5], backBand: 1,
  backRamp: {skin: PAL.W6, skinD: PAL.W5, hair: PAL.W4, tee: PAL.W4, teeC: PAL.W4},
  ramps: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.K3],
    skinD: [PAL.S0, PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4],
    skinC: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.W4],
    tee: [PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.N5, PAL.W5],
    teeC: [PAL.N0, PAL.N1, PAL.C1, PAL.C2, PAL.C3, PAL.C5],
  },
};
export const gergPortrait = memo((s: GergPortraitState) => renderFigure(portraitFig(s), PRIG));
void over; void seg; void edgeLight;

/** Portrait window: THE WOODROSE behind him (warm dark, pendant glow, a little bokeh), the laptop glow low-left. */
export const drawGergPortrait = (b: Buf, x: number, y: number, s: GergPortraitState, w = GERG_PW, h = GERG_PH, ox = 0) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + w && py < y + h;
  lightPool(b, x, y, w, h, w * 0.85, h * 0.12, w * 0.7, h * 0.5, PAL.N1, [[1, PAL.W0], [0.6, PAL.W1], [0.3, PAL.W2]]);
  // out-of-focus pendant lamps far behind: soft stepped discs (dithered rims), never hard dots
  for (const [cx, cy, r, hot] of [[16, 22, 6, 1], [34, 12, 4, 0], [8, 44, 3, 0]] as const)
    for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
      const d = Math.sqrt(i * i + j * j) / r;
      if (d > 1) continue;
      if (d > 0.7 && ((i + j + cx) & 1)) continue;
      b.set(x + cx + i, y + cy + j, d < 0.5 && hot ? PAL.W3 : PAL.W2);
    }
  // the laptop screen is just below frame, camera-left: a cool pool rising off the bottom edge
  for (let j = 0; j < 26; j++) for (let i = 0; i < 44; i++) {
    const d = Math.hypot(i / 44, (26 - j) / 26);
    if (d < 1 && (d < 0.6 || ((i + j) & 1) === 0)) b.set(x + i, y + h - 26 + j, d < 0.45 ? PAL.C1 : PAL.C0);
  }
  blitTo(b, gergPortrait(s), x - ox, y, {clip});
};
