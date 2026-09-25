// MR. MAS — pixeladv: conversation portraits (112x136).
// Painted like a pixel artist blocks in values: every plane of the face is a hand-placed polygon with an
// explicit ramp index; the rig only adds the automatic silhouette edges (cyan rim / warm back-rim /
// shadow-side outline). Acting = replacement parts (mouths, lids, brows) + integer nudges.
import {Buf, bayer, rect} from '../core/px';
import {PAL} from '../core/palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, renderFigure, blitImg} from '../core/figure';
import {LINE_NOLE_T0, LINE_NOLE_STR, LINE_MAS_T0, MAS_BLINK, MAS_SMILE_F} from './timing';

export const PW = 112, PH = 136;

const shift = (p: Prim, dx: number, dy: number): Prim => {
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => v + (i % 2 ? dy : dx))};
    case 'ell': return {...p, cx: p.cx + dx, cy: p.cy + dy};
    case 'rect': return {...p, x: p.x + dx, y: p.y + dy};
    case 'line': return {...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy};
    case 'map': return {...p, x: p.x + dx, y: p.y + dy};
  }
};
const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});

// ================================================================ NOLE
export interface NolePortrait { mouth: 0 | 1 | 2 | 3; jab: 0 | 1 | 2; blink: 0 | 1 | 2; brow: 0 | 1; dip: number; }

const nolePortraitFig = (s: NolePortrait): FigureDef => {
  const dx = -s.dip, dy = s.dip; // head dips toward Mas on the accents
  const H = (...pts: number[]) => shift(P.poly(...pts), dx, dy);
  const HL = (x0: number, y0: number, x1: number, y1: number) => shift(P.line(x0, y0, x1, y1), dx, dy);
  const jx = s.jab === 1 ? -5 : s.jab === 2 ? -2 : 0, jy = s.jab === 1 ? -3 : s.jab === 2 ? -1 : 0;
  const J = (...pts: number[]) => shift(P.poly(...pts), jx, jy);
  const parts: Part[] = [
    // black tee — broad shoulders that fill the frame
    {group: 'torso', mat: 'tee', tone: 1, prims: [P.poly(0, 136, 0, 116, 10, 108, 26, 102, 44, 97, 62, 103, 80, 98, 96, 102, 108, 109, 112, 113, 112, 136)]},
    // thick neck
    {group: 'neck', mat: 'skin', tone: 1, prims: [P.poly(46 + dx, 76 + dy, 47, 100, 62, 105, 79, 100, 80 + dx, 64 + dy, 74 + dx, 70 + dy)]},
    {group: 'collar', mat: 'collar', tone: 2, prims: [P.poly(41, 95, 50, 99, 62, 102, 79, 96, 83, 96, 81, 100, 62, 107, 48, 103)]},
    // head (skull + square jaw + profile features on the left)
    {group: 'head', mat: 'skin', tone: 2, prims: [H(
      40, 24, 36, 31, 34, 37, 33, 40, 35, 43, 33, 50, 29, 55, 27, 58, 29, 61, 33, 62, 35, 64, 34, 67, 36, 70, 35, 73, 37, 77, 37, 81,
      41, 84, 52, 84, 62, 80, 71, 74, 76, 68, 80, 60, 84, 50, 85, 36, 72, 26)]},
    // ear
    {group: 'head', mat: 'skin', tone: 2, prims: [H(72, 44, 77, 42, 81, 45, 82, 52, 80, 60, 76, 64, 72, 62, 71, 53)]},
    // swept-back hair, dark, with a high hairline
    {group: 'hair', mat: 'hair', tone: 1, prims: [H(
      40, 26, 41, 19, 48, 12, 59, 8, 72, 7, 83, 11, 90, 18, 93, 29, 93, 41, 90, 50, 85, 57, 83, 48, 80, 41, 75, 40, 71, 44, 69, 48, 67, 39, 64, 31, 56, 27, 48, 26)]},
    // phone hand (jabbing toward Mas / camera-left)
    {group: 'hand', mat: 'skin', tone: 2, prims: [J(1, 96, 5, 86, 12, 81, 22, 82, 27, 88, 26, 99, 20, 109, 10, 117, 1, 119)]},
    {group: 'phone', mat: 'phone', tone: 1, prims: [J(6, 57, 22, 56, 24, 88, 8, 89)]},
    {group: 'fingers', mat: 'skin', tone: 2, prims: [J(21, 68, 26, 67, 27, 72, 22, 73), J(22, 74, 27, 73, 28, 78, 23, 79), J(22, 80, 27, 79, 28, 84, 23, 86)]},
    {group: 'thumb', mat: 'skin', tone: 3, prims: [J(4, 84, 8, 74, 12, 74, 11, 86)]},
  ];
  const adjust: Adjust[] = [
    // ---- hair: swept strands (lighter) toward back-top, cyan catch on the front crown
    plane('hair', 2, H(42, 24, 50, 14, 60, 10, 58, 14, 48, 22), H(56, 26, 66, 12, 76, 10, 68, 16, 62, 26)),
    plane('hair', 3, HL(44, 22, 52, 14), HL(50, 24, 60, 13), HL(62, 25, 72, 12), HL(70, 28, 82, 15)),
    plane('hair', 4, HL(45, 20, 50, 15), HL(43, 23, 45, 21)),
    plane('hair', 0, H(80, 40, 86, 36, 88, 48, 85, 56, 83, 48)),
    // ---- face: lit front planes (cyan key from camera-left)
    plane('skin', 3, H(40, 24, 36, 31, 34, 37, 33, 40, 35, 43, 33, 50, 29, 55, 27, 58, 29, 61, 33, 62, 35, 64, 34, 67, 36, 70, 35, 73, 37, 77, 37, 81, 41, 84, 47, 84, 46, 76, 44, 70, 45, 62, 44, 54, 44, 46, 47, 40, 51, 33, 54, 27)),
    plane('skin', 4, H(40, 25, 37, 31, 36, 36, 42, 36, 46, 30, 49, 26), H(35, 43, 32, 51, 29, 56, 28, 58, 31, 58, 35, 52, 38, 45), H(39, 49, 44, 48, 45, 53, 40, 55), H(37, 76, 38, 80, 42, 83, 43, 78), H(35, 63, 38, 63, 37, 65)),
    plane('skin', 5, HL(29, 57, 30, 57), HL(39, 28, 41, 28), HL(41, 50, 42, 50)),
    // ---- shadows (mauve), deepest under the jaw
    plane('skin', 1, H(47, 40, 60, 38, 64, 40, 50, 42)), // under-brow socket
    plane('skin', 1, H(45, 42, 48, 42, 48, 46, 46, 46)), // inner corner
    plane('skin', 1, H(37, 46, 41, 50, 41, 58, 38, 61, 35, 61)), // nose side
    plane('skin', 1, H(57, 56, 66, 52, 70, 58, 63, 64)), // under cheekbone
    plane('skin', 1, H(62, 66, 72, 61, 76, 67, 70, 74, 61, 80, 55, 82)), // jaw side
    plane('skin', 1, H(66, 36, 72, 40, 72, 60, 66, 56)), // side of head
    plane('skin', 1, H(29, 61, 33, 62, 36, 64, 31, 64)), // under nose
    plane('skin', 1, H(36, 73, 43, 73, 42, 75, 37, 76)), // under lip
    plane('skin', 0, H(46, 84, 62, 81, 73, 73, 79, 70, 79, 79, 62, 89, 48, 88)), // under jaw on neck
    plane('skin', 3, P.poly(47, 88, 51, 88, 52, 100, 48, 99)), // neck front catches light
    plane('skin', 1, H(75, 47, 78, 48, 78, 56, 76, 58)), // inner ear
    plane('skin', 0, H(76, 50, 77, 50, 77, 54, 76, 54)),
    plane('skin', 3, H(72, 45, 74, 44, 74, 60, 72, 60)),
    // ---- tee: lit chest plane, fold
    plane('tee', 3, P.poly(12, 108, 42, 99, 46, 102, 20, 113, 8, 120)),
    plane('tee', 2, P.poly(20, 114, 46, 103, 52, 110, 30, 124)),
    plane('tee', 0, P.line(88, 103, 94, 136), P.line(62, 108, 66, 136)),
    // ---- hand: knuckles lit by the phone glow
    plane('skin', 4, J(6, 86, 11, 81, 16, 81, 10, 88), J(22, 69, 25, 68, 25, 70), J(23, 75, 26, 74, 26, 76)),
    plane('skin', 1, J(14, 100, 24, 92, 26, 99, 20, 109, 12, 112)),
    plane('skin', 1, J(21, 73, 26, 73, 26, 74, 21, 74), J(22, 79, 27, 79, 27, 80, 22, 80)),
  ];
  const lid = s.blink;
  const nearEye = lid === 2
    ? ['...........', '...........', '.LLLLLLLLL.', '..kkkkkkk..']
    : lid === 1
      ? ['...........', '..LLLLLLLL.', '.LLLLLLLLLL', '..wIIiwwk..']
      : ['..LLLLLLLLL.', '.LwIIgiwwwwL', '.LwIIIiwwwL.', '...kkkkkkk..'];
  const nearBrow = s.brow ? ['..bbbbbbbbb..', 'bbbbbbbbbbbbb', 'b..........bb'] : ['.............', '..bbbbbbbbbb.', 'bbbbbbbbbbbbb'];
  const farEye = lid === 2 ? ['.....', 'LLLL.', '.kk..'] : ['.LLL.', 'LIIw.', '.kk..'];
  const mouths: Record<number, string[]> = {
    0: ['..........r', 'mmmmmmmmmm.', '.lllllll...'],
    1: ['...........', 'mmmmmmmmmmm', 'mtTTTTTTtm.', '.llllllll..'],
    2: ['...........', 'mmmmmmmmmm.', 'mtTTTTTTm..', 'mdddddddm..', '.mdgggdm...', '..lllll....'],
    3: ['...........', '...mmmmm...', '..mdddddm..', '..mddddm...', '...llll....'],
  };
  const stamps: Stamp[] = [
    {x: 47 + dx, y: 35 + dy - (s.brow ? 1 : 0), rows: nearBrow, pal: {b: PAL.N0}},
    {x: 34 + dx, y: 38 + dy - (s.brow ? 1 : 0), rows: ['.bbbb', 'bbbb.'], pal: {b: PAL.N0}},
    {x: 49 + dx, y: 42 + dy, rows: nearEye, pal: {L: PAL.N0, w: PAL.K2, i: PAL.C3, I: PAL.N0, g: PAL.C8, k: PAL.S1}},
    {x: 36 + dx, y: 43 + dy, rows: farEye, pal: {L: PAL.N0, w: PAL.K2, I: PAL.N0, k: PAL.S1}},
    {x: 31 + dx, y: 60 + dy, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    {x: 35 + dx, y: 65 + dy, rows: mouths[s.mouth], pal: {m: PAL.S0, l: PAL.X2, t: PAL.K3, T: PAL.K4, d: PAL.N0, g: PAL.S2, r: PAL.X1}},
    // phone screen: a glowing post (avatar, a line, a big "NAME" card)
    {x: 8 + jx, y: 59 + jy, rows: [
      'ccccccccccccc',
      'cAAcwwwwwwccc',
      'cAAcwwwcccccc',
      'ccccccccccccc',
      'cbbbbbbbbbccc',
      'cbbbbbbcccccc',
      'ccccccccccccc',
      'cYYYYYYYYYYYc',
      'cYWWWWWWWWWYc',
      'cYWRRRRRRRWYc',
      'cYWWWWWWWWWYc',
      'cYYYYYYYYYYYc',
      'ccccccccccccc',
      'cbbbbbbbccccc',
      'cbbbbcccccccc',
      'ccccccccccccc',
      'ccrrrcccHHccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
      'ccccccccccccc',
    ].map((r, j) => (j > 21 ? r.replace(/c/g, 'e') : r)), pal: {c: PAL.C7, e: PAL.C6, A: PAL.W6, w: PAL.N3, b: PAL.C4, Y: PAL.C5, W: PAL.C9, R: PAL.N2, r: PAL.R3, H: PAL.C4}},
  ];
  return {w: PW, h: PH, parts, adjust, stamps};
};

const NOLE_RIG: LightRig = {
  key: [-0.95, -0.3], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['collar'],
  back: [1, -0.35], backBand: 2,
  backRamp: {skin: PAL.W6, hair: PAL.W5, tee: PAL.W3, phone: PAL.W4},
  ramps: {
    skin: [PAL.S0, PAL.X1, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.K1, PAL.C5],
    tee: [PAL.N0, PAL.N0, PAL.N1, PAL.C0, PAL.C1, PAL.C3],
    collar: [PAL.N0, PAL.N0, PAL.N2, PAL.C0, PAL.C1, PAL.C3],
    phone: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.C4],
  },
};

// ================================================================ MAS
export interface MasPortrait { lid: 0 | 1 | 2 | 3; mouth: 0 | 1 | 2; smile: boolean; }

const masPortraitFig = (s: MasPortrait): FigureDef => {
  // lower face compressed toward the eye line (y=50): shorter, younger jaw
  const q = (y: number) => (y > 50 ? Math.round((50 + (y - 50) * 0.86) * 2) / 2 : y);
  const Q = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? q(v) : v)));
  const QL = (x0: number, y0: number, x1: number, y1: number) => P.line(x0, q(y0), x1, q(y1));
  const parts: Part[] = [
    // hood bunched behind the neck (camera-left) + hoodie shoulders (slight frame)
    {group: 'hood', mat: 'hood', tone: 2, prims: [P.poly(4, 136, 5, 104, 12, 92, 24, 83, 38, 81, 42, 89, 32, 100, 30, 136)]},
    {group: 'torso', mat: 'hood', tone: 2, prims: [P.poly(12, 136, 14, 106, 26, 94, 44, 88, 70, 88, 86, 94, 98, 104, 102, 136)]},
    // slender neck
    {group: 'head', mat: 'skinW', tone: 1, prims: [P.poly(46, 70, 47, 90, 57, 92, 67, 89, 67, 74)]},
    {group: 'collar', mat: 'hoodIn', tone: 2, prims: [P.poly(38, 86, 50, 84, 72, 85, 65, 96, 47, 96)]},
    // head: cranium + jaw + profile (faces screen-right)
    {group: 'head', mat: 'skinW', tone: 2, prims: [
      P.ell(54, 46, 22, 22),
      Q(34, 52, 38, 64, 46, 73, 56, 79, 64, 81, 69, 80, 73, 76, 76, 70, 75, 67, 77, 63, 76, 60, 79, 57, 81, 55, 78, 49, 76, 44, 76, 38, 72, 26),
    ]},
    // ear (same group: no outline ring; detailed by planes)
    {group: 'head', mat: 'skin', tone: 3, prims: [Q(35, 46, 39, 44, 43, 47, 43, 56, 41, 62, 37, 63, 34, 58)]},
    // hair: short and soft; the FORWARD COWLICK is a lock that lifts and flicks forward at the front
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(33, 54, 31, 44, 32, 34, 37, 27, 45, 21, 55, 18, 64, 18, 71, 21, 76, 27, 77, 33, 74, 32, 71, 30, 66, 31, 62, 30, 58, 32, 53, 32, 48, 35, 45, 40, 44, 46, 41, 44, 38, 47, 36, 55),
      P.poly(62, 22, 66, 16, 72, 13, 78, 14, 81, 17, 78, 18, 75, 18, 73, 21, 76, 26, 71, 25),
    ]},
  ];
  const adjust: Adjust[] = [
    // ---- hair: clumps + the monitor's cyan catching the back of the head
    plane('hair', 1, P.line(46, 22, 42, 33), P.line(54, 20, 50, 32), P.line(62, 20, 60, 30), P.line(38, 30, 35, 42), P.line(70, 23, 70, 29)),
    plane('hair', 3, P.poly(33, 36, 37, 28, 45, 22, 41, 30, 36, 40), P.line(67, 16, 74, 14), P.line(56, 19, 62, 19)),
    plane('hair', 4, P.line(34, 34, 38, 28)),
    plane('hair', 0, P.poly(44, 41, 45, 47, 42, 45)),
    // ---- face. skinW = warm door fill (front of the face), skin = cyan kicker from the monitor behind-left
    {prims: [Q(34, 44, 38, 36, 42, 34, 40, 44, 40, 56, 44, 66, 48, 72, 42, 70, 36, 62, 34, 54)], mat: 'skin', tone: 3, onlyMat: 'skinW'},
    {prims: [Q(35, 46, 37, 40, 38, 50, 38, 58, 36, 56)], mat: 'skin', tone: 4, onlyMat: 'skinW'},
    // warm planes: forehead, cheekbone, nose bridge/tip, upper lip, chin
    // terminator band (mid-light mauve) that follows the form: brow -> under the eye -> cheekbone -> mouth corner -> chin
    {prims: [Q(57, 31, 62, 30, 61, 40, 64, 50, 67, 58, 68, 66, 69, 74, 66, 80, 62, 80, 64, 72, 63, 64, 60, 55, 57, 48, 56, 40)], mat: 'skinM', tone: 2, onlyMat: 'skinW'},
    plane('skinW', 3, Q(62, 30, 72, 28, 76, 36, 77, 44, 80, 52, 81, 55, 78, 58, 77, 63, 76, 70, 73, 76, 68, 80, 66, 80, 69, 74, 68, 66, 67, 58, 64, 50, 61, 40)),
    // upper cheek catches the door light under the eye
    plane('skinW', 3, Q(62, 49, 68, 48, 71, 52, 67, 56, 63, 54)),
    plane('skinW', 4, QL(76, 46, 79, 53), QL(66, 31, 71, 30), QL(64, 51, 67, 51), QL(70, 75, 71, 75), QL(74, 62, 75, 62)),
    // shadows: eye socket, under nose, under lip, jaw underside, cast shadow on neck
    plane('skinW', 1, Q(55, 40, 70, 40, 71, 42, 56, 42), Q(70, 42, 73, 44, 72, 48, 70, 46), Q(70, 57, 76, 58, 74, 60, 69, 59), Q(67, 69, 74, 68, 72, 71, 67, 71)),
    plane('skinW', 1, Q(44, 62, 50, 70, 58, 76, 64, 79, 56, 79, 46, 73, 40, 66)),
    plane('skinW', 0, Q(46, 74, 56, 80, 66, 82, 67, 85, 47, 84)),
    plane('skinW', 2, P.poly(58, 84, 66, 83, 67, 90, 60, 91)),
    {prims: [P.poly(46, 78, 49, 78, 50, 90, 47, 90)], mat: 'skin', tone: 3, onlyMat: 'skinW'},
    plane('skin', 1, Q(39, 48, 41, 49, 41, 57, 39, 59)), // inner ear
    plane('skin', 4, Q(35, 47, 37, 46, 36, 56)),
    // cyan kicker along the back of the jaw and cheek edge
    {prims: [Q(37, 60, 40, 60, 46, 70, 44, 71)], mat: 'skin', tone: 3, onlyMat: 'skinW'},
    // ---- hoodie: drawstrings, folds, cyan catch on the hood and far shoulder
    plane('hood', 4, P.line(52, 100, 50, 120), P.line(64, 99, 67, 118), P.poly(6, 108, 13, 97, 24, 90, 17, 99, 10, 112)),
    plane('hood', 5, P.rect(50, 120, 1, 2), P.rect(67, 118, 1, 2)),
    plane('hood', 1, P.line(32, 100, 44, 91), P.line(78, 96, 92, 105), P.poly(84, 102, 98, 110, 102, 136, 90, 136)),
    plane('hood', 3, P.poly(18, 110, 30, 100, 36, 102, 24, 114)),
  ];
  const L = s.lid;
  // calm, large-ish eyes; the upper lid sits a touch low (serene). Looking right, at Nole.
  const eyes: Record<number, string[]> = {
    0: ['...LLLLLL...', '.LLLLLLLLLL.', 'LwwwiiIIiw..', '.wwwiIIgIw..', '..wwiIIIw...', '...kkkkk....'],
    1: ['............', '...LLLLLL...', '.LLLLLLLLLL.', 'LLLLLLLLLL..', '.wwwiIIIw...', '...kkkkk....'],
    2: ['............', '............', '...LLLLLL...', '.LLLLLLLLL..', '..kkkkkkk...', '............'],
    3: ['............', '...LLLLLL...', '.LLLLLLLLLL.', 'LwwwiIIgIw..', '..wwiIIIw...', '...kkkkk....'],
  };
  const far: Record<number, string[]> = {
    0: ['.LLL.', 'LLLLL', 'wiIg.', '.kk..'],
    1: ['.....', '.LLL.', 'LLLLL', '.kk..'],
    2: ['.....', '.....', 'LLLLL', '.kk..'],
    3: ['.....', '.LLL.', 'LLLLL', 'wiIg.'],
  };
  const mouth = s.mouth === 1
    ? ['..mmmm.', '.mdddm.', '..lll..']
    : s.mouth === 2
      ? ['.......', '.mmmmm.', '..lll..']
      : s.smile
        // the tiniest smile: one pixel
        ? ['m......', '.mmmmmm', '..lll..']
        : ['.......', 'mmmmmmm', '..lll..'];
  const stamps: Stamp[] = [
    {x: 56, y: 38, rows: ['....bbbbbb.', '.bbbbbb....'], pal: {b: PAL.B2}},
    {x: 71, y: 39, rows: ['.bbb', 'bb..'], pal: {b: PAL.B2}},
    {x: 57, y: 42, rows: eyes[L], pal: {L: PAL.N0, w: PAL.X3, i: PAL.B3, I: PAL.N0, g: PAL.W8, k: PAL.X2}},
    {x: 71, y: 43, rows: far[L], pal: {L: PAL.N0, w: PAL.S3, i: PAL.B3, I: PAL.N0, g: PAL.W7, k: PAL.X2}},
    {x: 75, y: Math.round(q(56)), rows: ['.o', 'o.'], pal: {o: PAL.S0}},
    {x: 67, y: Math.round(q(66)) - 1, rows: mouth, pal: {m: PAL.S1, d: PAL.N0, l: PAL.S3}},
  ];
  return {w: PW, h: PH, parts, adjust, stamps};
};

const MAS_RIG: LightRig = {
  key: [-0.9, -0.3], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['hoodIn'],
  back: [1, -0.1], backBand: 1,
  backRamp: {skinW: PAL.S5, hair: PAL.W3, hood: PAL.W2},
  ramps: {
    skin: [PAL.S0, PAL.X0, PAL.X2, PAL.K2, PAL.K3, PAL.K4],
    skinW: [PAL.S0, PAL.S1, PAL.X2, PAL.S4, PAL.S5, PAL.K4],
    skinM: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.K4],
    hair: [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.K2, PAL.C6],
    hood: [PAL.N1, PAL.G0, PAL.G2, PAL.G3, PAL.G4, PAL.C6],
    hoodIn: [PAL.N0, PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2],
  },
};

// ================================================================ backgrounds + timing
const bgNole = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const bz = bayer(x, y);
      const u = x / w;
      let c: number = PAL.N1;
      if (u > 0.8) c = u > 0.9 ? (bz < 0.5 ? PAL.W5 : PAL.W4) : bz < (u - 0.8) / 0.1 ? PAL.W4 : PAL.W2;
      else if (u > 0.66) c = bz < (u - 0.66) / 0.14 ? PAL.W2 : PAL.W1;
      else if (u > 0.55) c = bz < (u - 0.55) / 0.11 ? PAL.W1 : PAL.N1;
      if (x >= w - 12 && x < w - 9) c = PAL.W1; // door jamb
      b.set(x0 + x, y0 + y, c);
    }
};
const bgMas = (b: Buf, x0: number, y0: number, w: number, h: number) => {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const bz = bayer(x, y);
      const d = Math.hypot((x + 10) / w, (y - 64) / h);
      let c: number = PAL.N1;
      if (d < 0.3) c = PAL.C2;
      else if (d < 0.42) c = bz < (0.42 - d) / 0.12 ? PAL.C2 : PAL.C1;
      else if (d < 0.62) c = bz < (0.62 - d) / 0.2 ? PAL.C1 : PAL.N1;
      b.set(x0 + x, y0 + y, c);
    }
  // the monitor's edge behind his shoulder: code lines
  for (let y = 30; y < 92; y++)
    for (let x = 0; x < 18; x++) {
      const inRow = (y - 32) % 3 === 0 && x < ((y * 7) % 13) + 2;
      b.set(x0 + x, y0 + y, y === 30 || y === 91 ? PAL.C4 : inRow ? PAL.C6 : PAL.C3);
    }
  for (let y = 29; y < 93; y++) b.set(x0 + 18, y0 + y, PAL.N0);
};

const nCache = new Map<string, Img>();
const mCache = new Map<string, Img>();

export const nolePortraitState = (f: number): NolePortrait => {
  const t = Math.floor((f - LINE_NOLE_T0) * 1.25);
  const n = Math.max(0, Math.min(LINE_NOLE_STR.length, t));
  const ch = t >= 0 && n < LINE_NOLE_STR.length ? LINE_NOLE_STR[n] : '';
  const mouth: NolePortrait['mouth'] = !ch || ch === ' ' ? (t >= LINE_NOLE_STR.length ? 1 : 0) : /[aA!I]/.test(ch) ? 2 : /[oOuU]/.test(ch) ? 3 : /[mpbMPB]/.test(ch) ? 0 : 1;
  const jab = (f >= 55 && f < 59) || (f >= 72 && f < 77) ? 1 : (f >= 59 && f < 62) || (f >= 77 && f < 80) ? 2 : 0;
  const dip = jab === 1 ? 2 : jab === 2 ? 1 : 0;
  const blink = f === 66 || f === 68 ? 1 : f === 67 ? 2 : 0;
  return {mouth, jab, dip, blink, brow: f >= 55 && f < 84 ? 1 : 0};
};

export const masPortraitState = (f: number): MasPortrait => {
  const t = f - LINE_MAS_T0;
  // "super." — he barely moves his mouth: s-u-p-er
  const mouth: MasPortrait['mouth'] = t >= 0 && t < 2 ? 2 : t >= 2 && t < 4 ? 1 : t >= 4 && t < 6 ? 2 : 0;
  const b = f - MAS_BLINK;
  const lid: MasPortrait['lid'] = b === 0 || b === 2 ? 1 : b === 1 ? 2 : f > MAS_BLINK + 2 ? 3 : 0;
  return {lid, mouth, smile: f >= MAS_SMILE_F};
};

export const nolePortraitImg = (s: NolePortrait) => {
  const k = JSON.stringify(s);
  let v = nCache.get(k);
  if (!v) { v = renderFigure(nolePortraitFig(s), NOLE_RIG); nCache.set(k, v); }
  return v;
};
export const masPortraitImg = (s: MasPortrait) => {
  const k = JSON.stringify(s);
  let v = mCache.get(k);
  if (!v) { v = renderFigure(masPortraitFig(s), MAS_RIG); mCache.set(k, v); }
  return v;
};

export const drawPortrait = (b: Buf, who: 'nole' | 'mas', x: number, y: number, w: number, h: number, f: number) => {
  const clip = (px: number, py: number) => px >= x && py >= y && px < x + w && py < y + h;
  if (who === 'nole') {
    bgNole(b, x, y, w, h);
    blitImg(b, nolePortraitImg(nolePortraitState(f)), x, y, {clip});
  } else {
    bgMas(b, x, y, w, h);
    blitImg(b, masPortraitImg(masPortraitState(f)), x, y, {clip});
  }
  rect(x, y, w, 0, b.ink(PAL.N0));
};
