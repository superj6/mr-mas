// MR. MAS — cast: TASYA, speaking set (Ep1 act 4; new file, owned by the act-4 character artist).
// His only existing art is the roll-call flash (cast/rollcall.ts drawTasya: one fixed face, no mouths, the key
// ring always up). This module re-draws that same face (the same planes, glasses, cropped grey sides, short
// salt-and-pepper beard, navy blazer over an open collar, Macrosoft slate room) as a speaking portrait, adds the
// hands-clasped pose, and gives him a room sprite for the doorway and the bullpen. Warm, measured, gently amused.
// No accent humour, ever (guardrails §6); nothing in the performance leans on it.
//   tasyaSpeakPortrait / drawTasyaSpeakPortrait  112x136: 6 mouths, 3 lids, brows level / warm, arms 'ring'
//                                                (the jangle, 2 drawings) | 'clasp' | 'none'
//   tasyaRoom / drawTasyaRoom                    room sprite, standing, 3/4 facing screen-right: clasp (hands
//                                                together, delighted) | sign (a small sign, arrow pointing OUT) |
//                                                keys (the ring at his side, 2 jangle drawings)
import {Buf, rect, bayer} from '../px';
import {PAL} from '../palette';
import {Adjust, FigureDef, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../figure';
import {memo, seg, shiftPrim, blitTo} from './kit';
import {Viseme} from './talk';
import {Clip, clipped, tileClip} from './calltile';

const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const recolor = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});

export const TASYA_PW = 112;
export const TASYA_PH = 136;
export type TasyaArms = 'ring' | 'clasp' | 'none';
export interface TasyaPortraitState {
  mouth: Viseme;
  lid: 0 | 1 | 2;
  /** 'warm' = delighted: brows soften up a pixel and the lower lids lift (the smile reaches the eyes) */
  brow: 'level' | 'warm';
  arms: TasyaArms;
  /** jangle drawing for 'ring' (0 | 1), swapped on 2s */
  jangle: 0 | 1;
}
export const TASYA_PORTRAIT_DEFAULT: TasyaPortraitState = {mouth: 'smile', lid: 0, brow: 'level', arms: 'clasp', jangle: 0};

const TY = 3;
const fig = (s: TasyaPortraitState): FigureDef => {
  const jaw = s.mouth === 'A' ? 2 : s.mouth === 'O' ? 1 : 0;
  const H = (...pts: number[]) => shiftPrim(P.poly(...pts.map((v, i) => (i % 2 ? v + (v >= 70 ? jaw : 0) : v))), 0, TY);
  const HL = (x0: number, y0: number, x1: number, y1: number) => shiftPrim(P.line(x0, y0, x1, y1), 0, TY);
  const parts: Part[] = [
    {group: 'torso', mat: 'blazer', tone: 2, prims: [P.poly(24, 150, 26, 112, 36, 103, 50, 98, 66, 99, 84, 101, 98, 108, 108, 118, 116, 128, 118, 150)]},
    {group: 'shirt', mat: 'shirt', tone: 2, prims: [P.poly(52, 97, 58, 100, 66, 101, 73, 99, 70, 108, 64, 113, 58, 107)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [H(53, 78, 54, 96, 62, 100, 71, 96, 73, 76)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [H(
      46, 30, 51, 23, 59, 19, 68, 18, 77, 21, 84, 28, 87, 38, 87, 50, 85, 60, 81, 70, 76, 78, 69, 84, 60, 87, 52, 86, 47, 82,
      44, 76, 43, 70, 41, 66, 42, 63, 40, 60, 38, 57, 40, 54, 41, 48, 42, 40)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [H(79, 47, 84, 44, 88, 47, 88, 55, 85, 62, 80, 63, 78, 56)]},
  ];
  if (s.arms === 'ring') parts.push(
    {group: 'sleeve', mat: 'blazer', tone: 2, prims: [P.poly(-10, 84, 0, 66, 9, 53, 21, 57, 17, 68, 8, 90, -10, 110)]},
    {group: 'cuff', mat: 'shirt', tone: 3, prims: [P.poly(9, 52, 13, 48, 22, 53, 19, 59)]},
  );
  if (s.arms === 'clasp') parts.push(
    // both forearms come up from the bottom edge to the hands, clasped at the front of the frame
    {group: 'sleeveL', mat: 'blazer', tone: 2, prims: [P.poly(22, 150, 30, 126, 44, 120, 54, 124, 50, 136, 40, 150)]},
    {group: 'sleeveR', mat: 'blazer', tone: 2, prims: [P.poly(96, 150, 92, 128, 80, 121, 70, 124, 72, 136, 80, 150)]},
    {group: 'cuffs', mat: 'shirt', tone: 3, prims: [P.poly(46, 120, 52, 118, 56, 124, 51, 128), P.poly(68, 118, 74, 120, 71, 128, 65, 124)]},
  );
  const adjust: Adjust[] = [
    plane('skin', 3, H(46, 30, 51, 23, 59, 19, 66, 20, 62, 28, 61, 40, 63, 50, 62, 60, 60, 70, 57, 80, 52, 86, 47, 82, 44, 76, 43, 70, 41, 66, 42, 63, 40, 60, 38, 57, 40, 54, 41, 48, 42, 40)),
    plane('skin', 4, H(48, 28, 53, 22, 59, 20, 55, 27, 51, 33), H(39, 55, 41, 50, 43, 50, 42, 57, 39, 57), H(51, 52, 57, 51, 58, 57, 52, 58)),
    plane('skin', 5, HL(50, 25, 53, 23), HL(39, 56, 40, 56)),
    plane('skin', 1, H(72, 44, 78, 44, 80, 58, 78, 68, 72, 76, 66, 80, 68, 70, 72, 60)),
    plane('skin', 1, H(54, 43, 68, 41, 70, 45, 56, 46), H(43, 44, 49, 43, 49, 46, 44, 47)),
    plane('skin', 1, H(45, 49, 48, 48, 48, 57, 45, 60, 43, 58)),
    plane('skin', 1, H(40, 60, 46, 61, 47, 63, 42, 63)),
    plane('skin', 2, H(58, 56, 64, 54, 66, 60, 60, 62)),
    plane('skin', 1, P.poly(53, 89, 62, 88, 72, 83, 74, 84, 72, 92, 62, 95, 54, 94)),
    plane('skin', 0, P.poly(56, 89, 62, 88, 70, 84, 69, 88, 62, 91, 57, 91)),
    plane('skin', 3, P.poly(54, 94, 57, 94, 57, 99, 54, 98)),
    plane('skin', 1, H(81, 49, 85, 48, 86, 55, 83, 60, 81, 58)),
    plane('skin', 0, H(82, 52, 84, 52, 84, 56, 82, 56)),
    recolor('skin', 'beard', 2, H(45, 74, 50, 72, 55, 74, 60, 77, 66, 76, 72, 70, 77, 64, 80, 64, 78, 71, 72, 79, 64, 85, 56, 88, 50, 86, 46, 81)),
    recolor('skin', 'beard', 3, H(45, 74, 49, 73, 51, 76, 49, 82, 52, 86, 47, 82)),
    recolor('skin', 'beard', 2, H(41, 66, 46, 65, 52, 66, 54, 68, 48, 68, 42, 68)),
    recolor('skin', 'beard', 3, HL(42, 66, 46, 65)),
    {prims: [shiftPrim(P.map(46, 75 + jaw, ['..#.....#.....#..', '#....#.....#.....', '...#....#.....#..', '.#.....#...#.....', '....#......#..#..', '..#...#..........']), 0, TY)], tone: 3, onlyMat: 'beard'},
    {prims: [shiftPrim(P.map(60, 76 + jaw, ['.#...#..#', '...#....#', '#.....#..', '..#.#....', '#....#...']), 0, TY)], tone: 1, onlyMat: 'beard'},
    recolor('skin', 'hair', 2, H(72, 32, 79, 28, 85, 32, 87, 40, 87, 50, 84, 45, 79, 44, 75, 44, 73, 38)),
    recolor('skin', 'hair', 3, HL(79, 29, 84, 33)),
    {prims: [shiftPrim(P.map(68, 27, ['....#...#..', '..#...#...#', '#...#...#..', '.#.....#...']), 0, TY)], tone: 2, onlyMat: 'skin', mat: 'hair'},
    plane('blazer', 3, P.poly(36, 103, 50, 98, 56, 108, 48, 118, 40, 112)),
    plane('blazer', 4, P.line(37, 103, 49, 99)),
    plane('blazer', 1, P.poly(74, 99, 84, 101, 98, 108, 108, 118, 112, 128, 112, 136, 90, 136, 80, 116, 72, 108)),
    plane('blazer', 0, P.line(58, 108, 62, 136), P.line(70, 108, 66, 136)),
    plane('shirt', 4, P.poly(52, 97, 58, 100, 57, 105, 53, 101)),
    plane('shirt', 1, P.poly(66, 101, 73, 99, 70, 108, 66, 105)),
  ];
  if (s.arms === 'ring') adjust.push(
    plane('blazer', 3, P.poly(-10, 84, 0, 66, 9, 54, 12, 55, 5, 70, -10, 96)),
    plane('blazer', 1, P.poly(18, 60, 21, 57, 17, 68, 8, 90, -10, 110, -10, 102, 10, 76)),
  );
  if (s.arms === 'clasp') adjust.push(
    plane('blazer', 3, P.poly(30, 127, 44, 121, 48, 123, 36, 130, 28, 142)),
    plane('blazer', 1, P.poly(92, 130, 94, 150, 86, 150, 82, 132)),
  );
  const E = TY;
  const L = s.lid;
  const warm = s.brow === 'warm';
  // calm eyes, a touch hooded; 'warm' lifts the lower lid a pixel (the smile reaches the eyes)
  const nearEye = L === 2 ? ['...........', '.LLLLLLLLL.', '...kkkkk...'] : L === 1 ? ['...........', '.LLLLLLLLL.', '..kwIIgwk..'] : warm ? ['..LLLLLLL..', '.LwwIIgwwk.', '..kkkkkk...'] : ['..LLLLLLL..', '.LwwIIgww..', '..kwIIwk...'];
  const farEye = L === 2 ? ['....', 'LLLL', '.kk.'] : L === 1 ? ['....', 'LLLL', 'kIIk'] : warm ? ['.LL.', 'LIIk', '.kk.'] : ['.LL.', 'LIIw', '.kk.'];
  const mouths: Record<Viseme, string[]> = {
    rest: ['.........', 'mmmmmmmm.', '.lllll...'],
    // his signature: the calm closed smile, one corner up
    smile: ['........r', 'mmmmmmmm.', '.lllll...'],
    A: ['.........', 'mmmmmmmmm', 'mTTTTTTm.', 'mddddddm.', '.mddddm..', '..mmmm...'],
    E: ['.........', 'mmmmmmmmr', 'mTTTTTTTm', '.mddddm..', '..llll...'],
    O: ['.........', '..mmmm...', '.mddddm..', '.mddddm..', '..mmmm...'],
    M: ['.........', 'mmmmmmmm.', '.MMMMMM..', '..llll...'],
  };
  const stamps: Stamp[] = [
    {x: 55, y: 44 + E, rows: nearEye, pal: {L: PAL.N0, w: PAL.K2, I: PAL.N0, g: PAL.C8, k: PAL.X1}},
    {x: 44, y: 45 + E, rows: farEye, pal: {L: PAL.N0, w: PAL.K2, I: PAL.N0, k: PAL.X1}},
    {x: 54, y: 40 + E - (warm ? 1 : 0), rows: warm ? ['...bbbbbbbb..', '.bbb......bbb'] : ['..bbbbbbbbbb.', 'bbbbbbbbbbbbb'], pal: {b: PAL.B1}},
    {x: 43, y: 41 + E - (warm ? 1 : 0), rows: warm ? ['.bbb.', 'b...b'] : ['.bbbb', 'bbbb.'], pal: {b: PAL.B1}},
    {x: 52, y: 42 + E, rows: [
      'fffffffffffffffff...........',
      'f...............fffffffffff.',
      'f.......c.......f...........',
      'f......c........f...........',
      '.fffffffffffffff............',
    ], pal: {f: PAL.N0, c: PAL.C8}},
    {x: 42, y: 42 + E, rows: ['fffffffffff', 'f.......f..', 'f.c.....f..', 'f.......f..', '.fffffff...'], pal: {f: PAL.N0, c: PAL.C7}},
    {x: 41, y: 60 + E, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 43, y: 69 + E, rows: mouths[s.mouth], pal: {m: PAL.S0, M: PAL.X0, l: PAL.X2, r: PAL.X1, T: PAL.K3, d: PAL.N0}},
  ];
  if (s.arms === 'clasp') stamps.push({x: 47, y: 113, rows: [
    // the clasped hands, held in front of him: fingers interlaced, the two thumbs resting on top, lit cool
    '.....ooooo..ooooo.....',
    '....oKKKKKooKKKKKo....',
    '...oK4444KooK4444Ko...',
    '..oK3K3K3K3K3K3K3K3o..',
    '.oK3K3K3K3K3K3K3K3K3o.',
    'oK3K3K3K3K33K3K3K3K3Ko',
    'o23K3K3K3K33K3K3K3K32o',
    'o2233333333333333333o.',
    '.o222222222222222222o.',
    '..oooooooooooooooooo..',
  ], pal: {o: PAL.S0, '2': PAL.X2, '3': PAL.K2, '4': PAL.K4, K: PAL.K3}});
  return {w: TASYA_PW, h: TASYA_PH, parts, adjust, stamps};
};
const RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'cuff', 'cuffs', 'beard', 'hair'],
  back: [1, -0.2], backBand: 1,
  backRamp: {skin: PAL.G5, blazer: PAL.G3, hair: PAL.G4, beard: PAL.G4},
  ramps: {
    skin: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    beard: [PAL.N0, PAL.N3, PAL.G2, PAL.G3, PAL.G5, PAL.K3],
    hair: [PAL.N0, PAL.X1, PAL.G2, PAL.G3, PAL.G4, PAL.K3],
    blazer: [PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.C2, PAL.C4],
    shirt: [PAL.N1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.C8],
  },
};
export const tasyaSpeakPortrait = memo((s: TasyaPortraitState) => renderFigure(fig(s), RIG));

// ---- the giant key ring (the roll-call's drawing: two jangle drawings, keys lean by integer row shears)
const KEY = ['..OOOO..', '.OhLLLO.', 'OhL..LDO', 'OL....DO', 'OL....DO', 'OLL..DDO', '.OLDDDO.', '..OLDO..', '...LD...', '...LD...', '...LD...', '...LD...', '...LD...', '...LD...', '...LD...', '...LD...', '...LD...', '...LD...', '...LDLLO', '...LDLDO', '...LD...', '...LDLLO', '...LDDO.', '...LD...', '...OO...'];
const JANGLE: Array<Array<[number, number]>> = [
  [[142, -0.5], [116, -0.26], [92, -0.05], [68, 0.16], [44, 0.38]],
  [[134, -0.3], [110, -0.1], [86, 0.12], [62, 0.32], [38, 0.52]],
];
const FIST = ['.....oooo.......', '....oLhLLo......', '...oLhLLllo.....', '..oLLLLllmmoo...', '.oLhhLLlLlmmmo..', 'oLhLLLlLLllmmdo.', 'oLLLmLLLmLLlmddo', 'olLLmlLLmlLLmddo', 'olllmlllmlllmddo', 'olllmlllmlllmdo.', 'oddlmdllmdlldmo.', '.oddoodddoddddo.', '..oo..ooo.oooo..'];
const drawRing = (b: Buf, clip: Clip, ox: number, oy: number, j: 0 | 1) => {
  const cx = ox + 30, cy = oy + 66;
  const brass: Record<string, number> = {O: PAL.W1, D: PAL.W3, L: PAL.W6, h: PAL.W8, m: PAL.W4};
  const rx = j ? 13 : 14, ry = j ? 14 : 13;
  JANGLE[j].forEach(([deg, lean], i) => {
    const a = (deg * Math.PI) / 180;
    const ax = Math.round(cx + Math.cos(a) * rx), ay = Math.round(cy + Math.sin(a) * ry);
    KEY.forEach((row, r) => {
      const sx = Math.round(r * lean);
      for (let c = 0; c < row.length; c++) {
        const ch = row[c]; const col = brass[ch];
        if (col === undefined) continue;
        const cc = ch === 'h' && i !== (j ? 3 : 1) ? PAL.W5 : col;
        const X = ax - 4 + c + sx, Y = ay - 2 + r;
        if (clip(X, Y)) b.set(X, Y, cc);
      }
    });
  });
  for (let y = -16; y <= 16; y++) for (let x = -16; x <= 16; x++) {
    const d = Math.hypot(x / rx, y / ry);
    if (d < 0.8 || d > 1.06) continue;
    const lit = -x * 0.6 - y * 0.8;
    const c = d > 0.99 ? PAL.W2 : d < 0.86 ? PAL.W3 : lit > 8 ? PAL.W8 : lit > 0 ? PAL.W6 : lit > -8 ? PAL.W5 : PAL.W4;
    if (clip(cx + x, cy + y)) b.set(cx + x, cy + y, c);
  }
  const fp: Record<string, number> = {o: PAL.S0, d: PAL.X1, m: PAL.X2, l: PAL.K2, L: PAL.K3, h: PAL.K4};
  FIST.forEach((r, jj) => { for (let i = 0; i < r.length; i++) { const c = fp[r[i]]; if (c !== undefined && clip(ox + 16 + i, oy + 43 + jj)) b.set(ox + 16 + i, oy + 43 + jj, c); } });
};
const bgSlate = (b0: Buf, x0: number, y0: number, w: number, h: number, clip: Clip) => {
  const b = clipped(b0, clip);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const d = Math.hypot((x - w * 0.8) / (w * 0.9), (y - h * 0.3) / (h * 0.75));
    const bz = bayer(x0 + x, y0 + y);
    b.set(x0 + x, y0 + y, d < 0.42 ? PAL.G2 : d < 0.6 ? (bz < (0.6 - d) / 0.18 ? PAL.G2 : PAL.G1) : d < 0.85 ? PAL.G1 : bz < 0.4 ? PAL.G1 : PAL.N2);
  }
  const wx = x0 + 62, wy = y0 + 6, ww = 58, wh = 58;
  for (let y = 0; y < wh; y++) for (let x = 0; x < ww; x++) {
    const inPane = x > 2 && y > 2 && x < ww - 1 && y < wh - 1 && Math.abs(x - 29) > 1 && Math.abs(y - 28) > 1;
    const bz = bayer(wx + x, wy + y);
    const u = (x + (wh - y) * 0.6) / (ww + wh * 0.6);
    b.set(wx + x, wy + y, inPane ? (u > 0.62 ? PAL.G4 : u > 0.5 ? (bz < (u - 0.5) / 0.12 ? PAL.G4 : PAL.G3) : u > 0.3 ? PAL.G3 : bz < 0.5 ? PAL.G3 : PAL.G2) : PAL.G1);
  }
  rect(wx, wy + wh, ww, 2, b.ink(PAL.G2)); rect(wx, wy + wh + 2, ww, 1, b.ink(PAL.N1));
};
/** Portrait window content: the slate room + window, Tasya, the ring when arms = 'ring'. */
export const drawTasyaSpeakPortrait = (b: Buf, x: number, y: number, s: TasyaPortraitState, o: {w?: number; h?: number; ox?: number} = {}) => {
  const w = o.w ?? TASYA_PW, h = o.h ?? TASYA_PH, ox = o.ox ?? 0;
  const clip = tileClip(x, y, w, h);
  bgSlate(b, x, y, w, h, clip);
  blitTo(b, tasyaSpeakPortrait(s), x - ox, y, {clip});
  if (s.arms === 'ring') drawRing(b, clip, x - ox - 5, y, s.jangle);
};

// ============================================================ room sprite (standing, 3/4 facing screen-right)
export const TASYA_W = 44;
export const TASYA_H = 82;
export const TASYA_FOOT: [number, number] = [20, 80];
export type TasyaRoomArm = 'clasp' | 'sign' | 'keys0' | 'keys1';
export type TasyaLight = 'room' | 'slate' | 'sil';
export interface TasyaRoomPose { arm: TasyaRoomArm; mouth: 'rest' | 'open' | 'smile'; blink: boolean; light: TasyaLight; }
export const TASYA_ROOM_DEFAULT: TasyaRoomPose = {arm: 'clasp', mouth: 'smile', blink: false, light: 'room'};
/** the sign's arrow: 'out' points screen-right (toward the door he stands in), per the script's "arrow pointing out" */
const RHEAD = [
  '.....oooooo.....',
  '...oo334455o....',
  '..o3344455554o..',
  '.ogg334445555o..',
  '.gGgg34444455o..',
  'ogGgg2344444455.',
  'oGgg22bbb4bbbo..',
  'ogg2fffff4ffff..',
  'ogg2f2e4f4fe4o..',
  '.og22233444445o5',
  '.ob22333444444o.',
  '..bB2233444444o.',
  '..bBB2mmmmm44o..',
  '...bBBB33bBBbo..',
  '....obBBBBBBo...',
  '.....oo1111o....',
  '.......o12o.....',
];
const rfig = (p: TasyaRoomPose): FigureDef => {
  const leg = (g: string, hip: number, kx: number, ax: number): Part[] => [
    {group: g, mat: 'pants', prims: [seg(hip, 46, 7.2, kx, 60, 5.8), seg(kx, 60, 5.6, ax, 75, 4.6), P.ell(kx, 60, 2.8, 2.6)]},
    {group: g + 's', mat: 'shoe', prims: [P.poly(ax - 2.6, 74, ax + 2.6, 74, ax + 6.4, 77, ax + 6.4, 80, ax - 3, 80)]},
  ];
  const sl = (g: string, sx: number, sy: number, ex: number, ey: number, hx: number, hy: number): Part => ({group: g, mat: 'blazer', prims: [P.ell(sx, sy, 3.5, 3.8), seg(sx, sy, 6.4, ex, ey, 5.6), seg(ex, ey, 5.4, hx, hy, 4.6), P.ell(ex, ey, 2.8, 2.8)]});
  const A = p.arm === 'clasp' ? {n: [28, 33, 25, 38], f: [16, 33, 22, 38]}
    : p.arm === 'sign' ? {n: [30, 30, 34, 22], f: [15, 33, 15.4, 42]}
      : {n: [27, 33, 27.4, 42], f: [15, 33, 15, 42]};
  const parts: Part[] = [
    ...leg('legF', 16.5, 16.4, 16),
    sl('armF', 15, 23, A.f[0], A.f[1], A.f[2], A.f[3]),
    ...leg('legN', 22, 22.4, 22.6),
    {group: 'torso', mat: 'blazer', prims: [P.poly(14, 20, 20, 18, 26, 19, 29, 23, 29, 30, 28, 38, 28, 47, 12, 47, 12, 40, 11, 32, 11, 24)]},
    {group: 'shirt', mat: 'shirt', prims: [P.poly(19, 18, 25, 18, 24, 22, 22, 25, 20, 22)]},
    {group: 'neck', mat: 'skin', prims: [P.poly(19, 15, 24, 15, 24, 19, 19, 19)]},
    sl('armN', 26, 23, A.n[0], A.n[1], A.n[2], A.n[3]),
  ];
  const rows = RHEAD.slice();
  if (p.blink) rows[8] = 'ogg2f2b4f4fb4o..';
  if (p.mouth === 'open') { rows[12] = '..bBB2mMMMm44o..'; rows[13] = '...bBBBMMbBBbo..'; }
  if (p.mouth === 'smile') rows[12] = '..bBB2mmmmm4mo..';
  const hand = (x: number, y: number): Stamp => ({x: Math.round(x) - 1, y: Math.round(y) - 1, rows: ['.34.', '3445', '2344', '.22.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5]}});
  const stamps: Stamp[] = [
    {x: 12, y: 0, rows, pal: {
      o: ['skin', 0], '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
      g: ['hair', 2], G: ['hair', 3], b: ['beard', 2], B: ['beard', 3], e: ['dark', 0], f: ['dark', 0], m: ['skin', 1], M: ['dark', 0],
    }},
  ];
  if (p.arm === 'clasp') stamps.push({x: 21, y: 36, rows: ['.3443.', '344443', '233332', '.2222.'], pal: {'2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4]}});
  else {
    stamps.push(hand(A.f[2], A.f[3]), hand(A.n[2], A.n[3]));
    if (p.arm === 'sign') stamps.push({x: 30, y: 10, rows: [
      // a small hand-held sign, cream, the arrow pointing out (screen-right), on a short stick
      'oooooooooooo',
      'oPPPPPPPPPPo',
      'oPPPPPPPKPPo',
      'oPPKKKKKKKPo',
      'oPPPPPPPKPPo',
      'oPPPPPPPPPPo',
      'oooooooooooo',
      '....ss......',
      '....ss......',
      '....ss......',
    ], pal: {o: ['sign', 0], P: ['sign', 2], K: ['sign', 1], s: ['sign', 3]}});
    if (p.arm === 'keys0' || p.arm === 'keys1') {
      // the ring at his side, hooked on the far hand's finger; two jangle drawings
      const j = p.arm === 'keys1' ? 1 : 0;
      stamps.push({x: 10, y: 42, rows: j ? ['.oWWo..', 'W....W.', 'W....W.', '.WWWW..', '.k.k.k.', '.k.k..k', '..k.k.k'] : ['.oWWo..', 'W....W.', 'W....W.', '.WWWW..', 'k.k.k..', 'k..k.k.', '.k..k.k'], pal: {o: ['keys', 1], W: ['keys', 2], k: ['keys', 3]}});
    }
  }
  return {w: TASYA_W, h: TASYA_H, parts, adjust: [{prims: [P.rect(0, 62, TASYA_W, 20)], add: -1, onlyMat: 'pants'}, {prims: [P.line(21, 20, 21, 46)], tone: 1, onlyMat: 'blazer'}], stamps};
};
const TLIT: Record<string, number[]> = {
  skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
  hair: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  beard: [PAL.N0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5],
  blazer: [PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.N5, PAL.N7],
  shirt: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  pants: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4],
  shoe: [PAL.N0, PAL.N0, PAL.D1, PAL.D2, PAL.D3, PAL.W3],
  sign: [PAL.N0, PAL.N1, PAL.P2, PAL.D3, PAL.P2, PAL.P2],
  keys: [PAL.W1, PAL.W3, PAL.W6, PAL.W5, PAL.W7, PAL.W8],
  dark: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
};
const TSLATE: Record<string, number[]> = {...TLIT, skin: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4]};
const TSIL: Record<string, number[]> = Object.fromEntries(Object.keys(TLIT).map((k) => [k, [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1]]));
TSIL.sign = TLIT.sign; TSIL.keys = TLIT.keys;
const rrig = (light: TasyaLight): LightRig => ({
  key: [0.55, -0.83], keyBand: 3, shadowBand: 3, rim: true, outline: true,
  back: [-1, -0.1], backBand: 1,
  backRamp: light === 'sil' ? {skin: PAL.G5, hair: PAL.G5, blazer: PAL.G5, pants: PAL.G4, shoe: PAL.G3, beard: PAL.G5} : {skin: PAL.G5, hair: PAL.G4, blazer: PAL.G3, pants: PAL.G3, shoe: PAL.N3, beard: PAL.G4},
  ramps: light === 'room' ? TLIT : light === 'slate' ? TSLATE : TSIL,
  groupBands: {torso: {key: 4, shadow: 3}, armN: {key: 2, shadow: 2}, armF: {key: 1, shadow: 2}, legN: {key: 2, shadow: 2}, legF: {key: 1, shadow: 2}},
  keyGain: light === 'sil' ? () => 0 : (_x, y) => (y < 46 ? 1 : Math.max(0.25, 1 - (y - 46) / 34)),
});
export const tasyaRoom = memo((p: TasyaRoomPose) => renderFigure(rfig(p), rrig(p.light)));
export const drawTasyaRoom = (b: Buf, footX: number, footY: number, p: TasyaRoomPose, o: {flip?: boolean; map?: (c: number) => number; mask?: Uint8Array} = {}) => {
  const fx = o.flip ? TASYA_W - 1 - TASYA_FOOT[0] : TASYA_FOOT[0];
  blitImg(b, tasyaRoom(p), footX - fx, footY - TASYA_FOOT[1], {flip: o.flip, map: o.map, mask: o.mask});
};
