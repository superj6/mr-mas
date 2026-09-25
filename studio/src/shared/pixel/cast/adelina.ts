// MR. MAS — cast: ADELINA (Ep1 act 4; new file, owned by the act-4 character artist).
// Misanthropic's co-founder and COO: "In plain English:". Brisk, warm and unhurried, a COO's patience. She is
// played as a co-founder only (guardrails §6: never sibling jokes, the family relationship is never the joke).
// Design: shoulder-length dark hair framing the face, reading glasses pushed up on her head (a flourish, no age
// cue), a tidy terracotta blazer over a graphite top. In Ep1 act 4 she takes the phone out of Mario's hand (the
// handset with the small throne attached) and says the only line she needs.
//   adelinaPortrait / drawAdelinaPortrait  portrait / name card (112x136): 6 mouths, 3 lids, eye dart, brows
//                                          level / brisk / warm; phone 'none' | 'ear' (the handset, throne optional)
//   drawThroneHandset                      the handset with the small throne on its back (portrait + room scale)
//   adelinaRoom / drawAdelinaRoom          room sprite (standing, 3/4 facing screen-right): reach / phone / down
import {Buf, rect, bayer, hash} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg, blitTo, lightPool} from './kit';
import {Viseme} from './talk';
import {Clip, clipped, tileClip} from './calltile';

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const toMat = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

// ============================================================ the handset (with the throne attached)
// 'lg' (portrait): a classic desk-phone handset, ~30 x 12, drawn at the angle it is held (a drawing, not a
// rotation); the throne is a small gilt chair stuck to its back, red seat cushion. 'room': 7 x 3 + a 3x4 throne.
export const drawThroneHandset = (b: Buf, x: number, y: number, o: {size?: 'lg' | 'room'; throne?: boolean; clip?: Clip; flip?: boolean} = {}) => {
  const put = (X: number, Y: number, c: number) => { if (!o.clip || o.clip(X, Y)) b.set(X, Y, c); };
  const pal: Record<string, number> = {k: PAL.N0, K: PAL.N2, h: PAL.G2, g: PAL.W6, G: PAL.W8, d: PAL.W3, r: PAL.R2, R: PAL.R3};
  // 'lg': a steep diagonal (earpiece top-right under her hand, mouthpiece bottom-left at her chin), 30 x 30
  const lgRows = (() => {
    const W = 30, Hh = 30;
    const g = Array.from({length: Hh}, () => Array(W).fill('.'));
    for (let j = 0; j < 26; j++) {
      const c = W - 4 - j;
      g[j][c - 1] = 'k'; g[j][c] = 'K'; g[j][c + 1] = 'h'; g[j][c + 2] = 'K'; g[j][c + 3] = 'k';
    }
    // the mouthpiece: a rounded cup at the lower-left end, its opening toward her mouth
    ['.kkkkk..', 'kKhhKKk.', 'kKKKKKKk', 'kKKKKKKk', '.kkkkkk.'].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== '.') g[24 + j][i] = r[i]; });
    return g.map((r) => r.join(''));
  })();
  const rows = (o.size ?? 'lg') === 'lg'
    ? lgRows
    : ['....kk', '..kkKk', 'kkKk..', 'kk....'];
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) put(o.flip ? x + r.length - 1 - i : x + i, y + j, c); } });
  if (!o.throne) return;
  const T = (o.size ?? 'lg') === 'lg'
    ? [
      '..g..g..',
      '.gGggGg.',
      '.gdddgg.',
      '.gdddgg.',
      '.gRRRRg.',
      'gRrrrrRg',
      'gggggggg',
      '.g....g.',
      '.d....d.',
    ]
    : ['g.g', 'grg', 'd.d'];
  const tx = (o.size ?? 'lg') === 'lg' ? x + 8 : x + 2, ty = (o.size ?? 'lg') === 'lg' ? y + 9 : y - 3;
  T.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) put(o.flip ? x + (rows[0].length - 1) - (tx - x) - i : tx + i, ty + j, c); } });
};

// ============================================================ conversation portrait (112 x 136)
export const ADELINA_PW = 112;
export const ADELINA_PH = 136;
export type AdelinaBrow = 'level' | 'brisk' | 'warm';
export interface AdelinaPortraitState {
  mouth: Viseme;
  lid: 0 | 1 | 2;
  look: -1 | 0 | 1;
  brow: AdelinaBrow;
  phone: 'none' | 'ear';
  throne?: boolean;
}
export const ADELINA_PORTRAIT_DEFAULT: AdelinaPortraitState = {mouth: 'smile', lid: 0, look: -1, brow: 'warm', phone: 'none'};

const portraitFig = (s: AdelinaPortraitState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const J = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v + (v >= 70 ? jaw : 0) : v)));
  const parts: Part[] = [
    // hair behind: a shoulder-length bob with a soft outward turn at the ends
    {group: 'hairB', mat: 'hair', tone: 1, prims: [P.poly(34, 50, 36, 36, 42, 26, 52, 19, 64, 17, 76, 20, 85, 27, 90, 40, 91, 56, 92, 74, 95, 88, 90, 94, 80, 92, 72, 86, 48, 88, 38, 92, 31, 88, 32, 72)]},
    {group: 'torso', mat: 'blazer', tone: 2, prims: [P.poly(0, 144, 3, 118, 12, 106, 27, 99, 43, 96, 70, 96, 87, 99, 101, 108, 108, 119, 112, 144)]},
    {group: 'top', mat: 'top', tone: 2, prims: [P.poly(44, 96, 72, 96, 66, 106, 58, 110, 50, 106)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(50, 76, 50, 97, 57, 101, 65, 97, 65, 72)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [
      P.ell(60, 46, 22, 24),
      J(46, 25, 41, 30, 38, 37, 38, 44, 37, 48, 38, 52, 37, 55, 35, 59, 36, 61, 38, 62, 37, 65, 38, 68, 38, 71, 40, 75, 42, 78, 46, 81, 52, 81, 58, 77, 64, 72, 69, 65, 72, 56, 75, 45, 73, 34, 68, 27, 58, 22),
    ]},
    // front hair: a side part (camera-right), a soft sweep across the forehead, the near side tucked to the jaw
    {group: 'hairF', mat: 'hair', tone: 2, prims: [
      P.poly(36, 46, 36, 34, 41, 25, 50, 19, 62, 16, 74, 18, 83, 25, 88, 36, 89, 50, 88, 64, 86, 78, 88, 88, 80, 90, 74, 84, 72, 72, 72, 58, 70, 46, 66, 38, 60, 34, 52, 33, 46, 34, 41, 38, 38, 44),
    ]},
    // lapels: notched, terracotta, the graphite top between
    {group: 'lapL', mat: 'blazer', tone: 3, prims: [P.poly(43, 96, 49, 98, 55, 112, 50, 126, 40, 108)]},
    {group: 'lapR', mat: 'blazer', tone: 2, prims: [P.poly(73, 96, 67, 98, 61, 112, 64, 126, 76, 108)]},
    // reading glasses pushed up on her head: two lenses sitting in the hair above the part
    {group: 'specs', mat: 'specs', tone: 2, prims: [P.poly(46, 23, 56, 20, 57, 24, 47, 27), P.poly(59, 19, 69, 18, 70, 22, 60, 23)]},
  ];
  const adjust: Adjust[] = [
    // warm lamp key from camera-left (the lighthouse's lamp room light), the brick room's red bounce as rim
    plane('skin', 4, P.poly(40, 37, 46, 35, 54, 36, 50, 38, 45, 40, 41, 42), P.poly(38, 44, 42, 42, 46, 43, 42, 46, 38, 47), J(38, 62, 42, 62, 44, 66, 40, 70, 38, 68), J(41, 75, 46, 76, 48, 80, 43, 80)),
    plane('skin', 5, P.line(39, 45, 41, 44), P.line(38, 57, 38, 58)),
    plane('skin', 2, J(60, 36, 65, 40, 67, 46, 68, 56, 67, 64, 64, 71, 59, 76, 55, 78, 58, 70, 61, 62, 62, 52, 61, 42)),
    toMat('skin', 'skinD', 2, J(64, 38, 69, 42, 70, 52, 69, 62, 66, 70, 61, 76, 56, 80, 59, 76, 64, 71, 67, 64, 68, 56, 67, 46)),
    plane('skin', 3, P.poly(38, 48, 43, 47, 44, 50, 38, 51), P.poly(47, 47, 60, 46, 61, 49, 48, 50)),
    plane('skin', 2, P.poly(43, 51, 45, 50, 47, 55, 46, 60, 42, 61, 42, 57)),
    toMat('skin', 'skinD', 2, P.poly(45, 56, 47, 56, 47, 60, 44, 61)),
    toMat('skin', 'skinD', 3, P.poly(41, 62, 47, 61, 49, 63, 44, 64)),
    plane('skin', 4, P.poly(40, 51, 42, 51, 41, 57, 38, 59, 38, 57)),
    plane('skin', 5, P.line(41, 52, 39, 57)),
    plane('skin', 4, P.poly(52, 55, 58, 53, 61, 55, 55, 57)),
    plane('skin', 2, J(44, 78, 50, 79, 56, 77, 62, 73, 66, 68, 66, 72, 61, 78, 54, 82, 48, 82)),
    plane('skin', 2, J(39, 72, 46, 72, 45, 73, 40, 73)),
    plane('neck', 0, J(50, 79, 55, 82, 61, 79, 65, 75, 65, 84, 58, 88, 50, 86)),
    plane('neck', 3, P.poly(50, 88, 52, 88, 52, 97, 50, 96)),
    // hair: a lit sweep across the brow, soft waves (dark curved strands), the ends turning out
    plane('hair', 3, P.poly(38, 38, 42, 30, 50, 24, 58, 22, 52, 27, 45, 32, 40, 40), P.line(62, 17, 72, 18)),
    plane('hair', 4, P.line(40, 33, 44, 28), P.line(46, 25, 52, 22)),
    plane('hair', 1, P.line(66, 22, 72, 36), P.line(74, 24, 80, 44), P.line(80, 34, 84, 60), P.line(76, 56, 78, 80), P.line(84, 66, 88, 86), P.line(34, 60, 33, 84)),
    plane('hair', 3, P.line(70, 30, 74, 50), P.line(82, 48, 85, 70), P.line(33, 52, 32, 70)),
    plane('hair', 0, P.poly(72, 60, 72, 72, 74, 84, 72, 84, 70, 72)),
    // blazer: the lamp on the far shoulder, lapel edges, the near side in shadow
    plane('blazer', 3, P.poly(5, 116, 12, 106, 26, 100, 38, 97, 30, 104, 18, 112, 9, 124)),
    plane('blazer', 4, P.poly(5, 114, 12, 105, 24, 100, 15, 108, 8, 118)),
    plane('blazer', 4, P.line(44, 97, 52, 114)),
    plane('blazer', 1, P.poly(88, 102, 101, 109, 107, 122, 110, 144, 98, 144), P.line(58, 116, 60, 136)),
    plane('top', 3, P.poly(46, 97, 56, 98, 54, 103)),
    plane('specs', 4, P.line(47, 24, 55, 21), P.line(60, 20, 68, 19)),
  ];
  const L = s.lid;
  const near = L === 2
    ? ['............', '............', '............', '.LLLLLLLLLL.', '..kkkkkkkk..']
    : L === 1
      ? ['............', '............', '.LLLLLLLLLLL', 'LwwiIIgiwww.', '..kkkkkkkk..']
      : ['...LLLLLL...', '.LLLLLLLLLLL', 'LwwiIIgiwww.', '.wwiIIIiww..', '..kkkkkkk...'];
  const far = L === 2 ? ['......', '......', '......', 'LLLLL.', '.kkk..'] : L === 1 ? ['......', '......', 'LLLLL.', 'wiIgw.', '.kkk..'] : ['..LL..', 'LLLLL.', 'wiIgw.', 'wiIIw.', '.kkk..'];
  const dart = (rows: string[], d: number) => rows.map((r) => {
    if (!d || !/[iIg]/.test(r)) return r;
    const ch = r.split(''), out = ch.map((c) => (/[iIg]/.test(c) ? 'w' : c));
    ch.forEach((c, i) => { if (/[iIg]/.test(c) && out[i + d] && out[i + d] !== '.') out[i + d] = c; });
    return out.join('');
  });
  const B = s.brow;
  const nearBrow = B === 'brisk' ? ['.....bbbbbb.', '..bbbb....bb', 'bbb.........'] : B === 'warm' ? ['....bbbbbb..', '..bb......bb', 'bb..........'] : ['............', '...bbbbbbbbb', 'bbbb.......b'];
  const nb = B === 'brisk' ? -2 : B === 'warm' ? -1 : 0;
  const mouths: Record<Viseme, string[]> = {
    rest: ['...........', 'mmmmmmmmmm.', '.lllllll...'],
    smile: ['.........m.', 'mmmmmmmmm..', '.lllllll...'],
    A: ['...........', 'mmmmmmmmmm.', 'mTTTTTTTm..', 'mdddddddm..', '.mdgggdm...', '..mmmmm....', '...lll.....'],
    E: ['...........', 'mmmmmmmmmmm', 'mTTTTTTTTm.', '.mddddddm..', '..mmmmmm...', '...llll....'],
    O: ['...........', '..mmmmm....', '.mdddddm...', '.mdddddm...', '..mmmmm....', '...lll.....'],
    M: ['...........', 'mmmmmmmmmm.', '.MMMMMMMM..', '..llllll...'],
  };
  const stamps: Stamp[] = [
    {x: 47, y: 42 + nb, rows: nearBrow, pal: {b: PAL.B0}},
    {x: 36, y: 43, rows: ['.....', '.bbbb', 'bb...'], pal: {b: PAL.B0}},
    {x: 48, y: 46, rows: dart(near, s.look * 2), pal: {L: PAL.N0, w: PAL.S5, i: PAL.B2, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 37, y: 46, rows: dart(far, s.look), pal: {L: PAL.N0, w: PAL.S4, i: PAL.B2, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 38, y: 60, rows: ['.o', 'o.'], pal: {o: PAL.S1}},
    {x: 37, y: 66, rows: mouths[s.mouth], pal: {m: PAL.S1, M: PAL.S0, l: PAL.S3, T: PAL.P1, d: PAL.N0, g: PAL.S2}},
  ];
  if (s.phone === 'ear') {
    // her near hand holds the handset to her near ear; the fingers wrap the grip
    parts.push({group: 'cuff', mat: 'blazer', tone: 2, prims: [P.poly(72, 64, 84, 62, 96, 84, 108, 120, 112, 144, 92, 144, 88, 112, 74, 80)]});
    parts.push({group: 'hand', mat: 'skin', tone: 3, prims: [P.poly(66, 50, 72, 45, 80, 46, 84, 52, 84, 62, 78, 68, 70, 68, 65, 62)]});
    adjust.push(plane('skin', 4, P.line(68, 50, 73, 46), P.line(66, 54, 67, 60)), plane('skin', 2, P.line(67, 56, 82, 55), P.line(67, 60, 82, 59), P.line(68, 64, 80, 64)),
      plane('blazer', 3, P.poly(74, 66, 80, 66, 92, 90, 100, 112, 94, 110, 84, 88)), plane('blazer', 1, P.line(88, 70, 110, 130)));
  }
  return {w: ADELINA_PW, h: ADELINA_PH, parts, adjust, stamps};
};
const PRIG: LightRig = {
  key: [-0.85, -0.45], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['neck', 'top', 'specs'],
  back: [1, -0.15], backBand: 1,
  backRamp: {skin: PAL.U4, skinD: PAL.U3, hair: PAL.U2, blazer: PAL.U4},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    skinD: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4],
    blazer: [PAL.W0, PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6],
    top: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3],
    specs: [PAL.N0, PAL.N0, PAL.G1, PAL.G3, PAL.G5, PAL.P2],
  },
};
export const adelinaPortrait = memo((s: AdelinaPortraitState) => renderFigure(portraitFig(s), PRIG));

/** The lighthouse home room behind her: brick, a paper stack, the lamp's warm pool from above-left. */
const bgBrick = (b0: Buf, x: number, y: number, w: number, h: number, clip: Clip) => {
  const b = clipped(b0, clip);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const row = Math.floor(j / 6), off = row % 2 ? 6 : 0;
    const mortar = j % 6 === 5 || (i + off) % 12 === 11;
    const d = Math.hypot((i + 6) / (w * 0.95), (j + 4) / (h * 0.85));
    const bz = bayer(x + i, y + j);
    const lit = d < 0.55 ? 2 : d < 0.78 ? (bz < (0.78 - d) / 0.23 ? 2 : 1) : d < 1.05 ? 1 : bz < 0.4 ? 1 : 0;
    const brick = [PAL.W0, PAL.W1, PAL.W2][lit];
    const n = hash(Math.floor((i + off) / 12), row, 5) < 0.2 ? -1 : 0;
    b.set(x + i, y + j, mortar ? [PAL.N0, PAL.W0, PAL.W1][lit] : n ? [PAL.N1, PAL.W0, PAL.W1][lit] : brick);
  }
  // a stack of paper at the right edge (the lighthouse is full of it)
  for (let k = 0; k < 9; k++) { const py = y + h - 40 + k * 4; rect(x + w - 16, py, 16, 3, b.ink(k % 3 === 0 ? PAL.P0 : PAL.P1)); rect(x + w - 16, py + 3, 16, 1, b.ink(PAL.D1)); }
};
export const drawAdelinaPortrait = (b: Buf, x: number, y: number, s: AdelinaPortraitState, o: {w?: number; h?: number; ox?: number} = {}) => {
  const w = o.w ?? ADELINA_PW, h = o.h ?? ADELINA_PH, ox = o.ox ?? 0;
  const clip = tileClip(x, y, w, h);
  bgBrick(b, x, y, w, h, clip);
  blitTo(b, adelinaPortrait(s), x - ox, y, {clip});
  if (s.phone === 'ear') {
    // the handset runs from under her hand (at the ear) down to the mouthpiece at her chin; the hand is redrawn
    // over its top end so the fingers wrap the grip
    drawThroneHandset(b, x - ox + 42, y + 50, {size: 'lg', throne: s.throne, clip});
    const img = adelinaPortrait(s);
    for (let j = 44; j < 70; j++) for (let i = 64; i < 86; i++) {
      const v = img.c[j * img.w + i];
      if (v < 0) continue;
      const isHand = v === PAL.S1 || v === PAL.S2 || v === PAL.S3 || v === PAL.S4 || v === PAL.S5 || v === PAL.S6 || v === PAL.S0;
      if (isHand && i >= 65 && j >= 45 && j <= 68 && (i > 66 || j > 50) && clip(x - ox + i, y + j)) b.set(x - ox + i, y + j, v);
    }
  }
  void lightPool;
};

// ============================================================ room sprite (standing, 3/4 facing screen-right)
export const ADELINA_W = 44;
export const ADELINA_H = 80;
export const ADELINA_FOOT: [number, number] = [20, 78];
export type AdelinaArm = 'reach' | 'phone' | 'down';
export type AdelinaLight = 'room' | 'sil';
export interface AdelinaRoomPose { arm: AdelinaArm; mouth: 'rest' | 'open' | 'smile'; blink: boolean; light: AdelinaLight; throne?: boolean; }
export const ADELINA_ROOM_DEFAULT: AdelinaRoomPose = {arm: 'down', mouth: 'smile', blink: false, light: 'room'};
const RHEAD = [
  '....ohhhhhho....',
  '..ohHgggggHho...',
  '.ohHIIIIHHHHho..',
  '.hHIIJJIHHHh4o..',
  'hHHIIIHHHh3444o.',
  'hHHIHHHhh23b4bbo',
  'hHHIHHHh234e44eo',
  'hHHIHHHh2344444o',
  'hHHIHHHh23344445',
  'hHHIHHHh2233444o',
  'hHHIHHHh1223m44o',
  '.hHIHHHho1223o..',
  '.hHHHHHh.o12o...',
  '..hHHHhh..oo....',
  '...hhhh...o2o...',
  '..........o2o...',
];
const rfig = (p: AdelinaRoomPose): FigureDef => {
  const leg = (g: string, hip: number, kx: number, ax: number): Part[] => [
    {group: g, mat: 'pants', prims: [seg(hip, 44, 7, kx, 58, 5.6), seg(kx, 58, 5.4, ax, 73, 4.4), P.ell(kx, 58, 2.7, 2.5)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.4, 72, ax + 2.4, 72, ax + 6, 75, ax + 6, 78, ax - 2.8, 78)]},
  ];
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'blazer', prims: [P.ell(sx, sy, 3.3, 3.6), seg(sx, sy, 6, ex, ey, 5.2), seg(ex, ey, 5, hx, hy, 4.4), P.ell(ex, ey, 2.6, 2.6)]});
  const A = p.arm === 'reach' ? {n: [30, 30, 37, 28], f: [15, 32, 15.4, 40]}
    : p.arm === 'phone' ? {n: [30, 26, 25, 16], f: [15, 32, 15.4, 40]}
      : {n: [26, 32, 26.4, 40], f: [15, 32, 15.4, 40]};
  const parts: Part[] = [
    ...leg('legF', 16.5, 16.4, 16),
    sl('armF', 15, 22, A.f[0], A.f[1], A.f[2], A.f[3]),
    ...leg('legN', 22, 22.4, 22.6),
    {group: 'torso', mat: 'blazer', prims: [P.poly(15, 18, 21, 17, 26, 18, 28, 22, 28, 29, 27, 36, 28, 45, 13, 45, 13, 38, 12, 31, 12, 23)]},
    {group: 'top', mat: 'top', prims: [P.poly(19, 17, 25, 17, 24, 21, 22, 24, 20, 21)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(19, 14, 24, 14, 24, 18, 19, 18)]},
    sl('armN', 25, 22, A.n[0], A.n[1], A.n[2], A.n[3]),
  ];
  const rows = RHEAD.slice();
  if (p.blink) rows[6] = 'hHHIHHHh234b44bo';
  if (p.mouth === 'open') { rows[10] = 'hHHIHHHh1223M44o'; rows[11] = '.hHIHHHho12M3o..'; }
  if (p.mouth === 'smile') rows[10] = 'hHHIHHHh1223mm4o';
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [
    {x: 12, y: 0, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], g: ['specs', 3], b: ['hair', 0], e: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
    }},
    hand(A.f[2], A.f[3]), hand(A.n[2], A.n[3]),
  ];
  return {w: ADELINA_W, h: ADELINA_H, parts, adjust: [{prims: [P.rect(0, 60, ADELINA_W, 20)], add: -1, onlyMat: 'pants'}, {prims: [P.line(21, 19, 23, 28)], tone: 4, onlyMat: 'blazer'}], stamps};
};
const ALIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4],
  blazer: [PAL.W0, PAL.W2, PAL.W3, PAL.W4, PAL.W5, PAL.W6],
  top: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G3],
  pants: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4],
  shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  specs: [PAL.N0, PAL.G1, PAL.G3, PAL.G4, PAL.G5, PAL.P2],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const ASIL: Record<string, number[]> = Object.fromEntries(Object.keys(ALIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
const rrig = (light: AdelinaLight): LightRig => ({
  key: [0.6, -0.8], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.W6, hair: PAL.W6, blazer: PAL.W6, pants: PAL.W4, shoe: PAL.W3} : {skin: PAL.U4, hair: PAL.U2, blazer: PAL.U4, pants: PAL.G3, shoe: PAL.N3},
  ramps: light === 'room' ? ALIT : ASIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 44 ? 1 : Math.max(0.25, 1 - (y - 44) / 34)),
});
export const adelinaRoom = memo((p: AdelinaRoomPose) => renderFigure(rfig(p), rrig(p.light)));
/** top-left of the room-scale handset per arm pose (local, unflipped) */
export const ADELINA_ROOM_PHONE: Record<AdelinaArm, [number, number] | null> = {reach: [36, 25], phone: [23, 9], down: null};
export const drawAdelinaRoom = (b: Buf, footX: number, footY: number, p: AdelinaRoomPose, o: {flip?: boolean; handset?: boolean; map?: (c: number) => number} = {}) => {
  const fx = o.flip ? ADELINA_W - 1 - ADELINA_FOOT[0] : ADELINA_FOOT[0];
  const ox = footX - fx, oy = footY - ADELINA_FOOT[1];
  blitImg(b, adelinaRoom(p), ox, oy, {flip: o.flip, map: o.map});
  const at = ADELINA_ROOM_PHONE[p.arm];
  if (at && o.handset !== false) drawThroneHandset(b, ox + (o.flip ? ADELINA_W - at[0] - 6 : at[0]), oy + at[1], {size: 'room', throne: p.throne, flip: o.flip});
};
