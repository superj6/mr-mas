// MR. MAS — cast (castrivals): the SKYLINE BOSSES, plus the small rivals kit shared by mario.ts / nole.ts.
// Tiny rooftop sprites (16-28 px) authored as hand-placed TONE MAPS: every char = [material, ramp index],
// so a light state (dusk, freeze two-tone, 1-bit) is a ramp swap, never a redraw. Each boss owns ONE
// readable motion loop of 2-4 drawings, held on 2s-4s. Whole-pixel only: nothing rotates or scales.
// Conventions follow src/shared/pixel/cast/kit.ts (other builder) but this file is self-contained.
import {Buf, rect, line} from '../../../dev/pixeladv/core/px';
import {PAL} from '../../../dev/pixeladv/core/palette';
import type {Img, Prim} from '../../../dev/pixeladv/core/figure';
import {P} from '../../../dev/pixeladv/core/figure';

// ================================================================== rivals kit
/** Extra hand-picked colours the rivals need (added as families; the master palette stays untouched). */
export const CX = {
  // Mario's fleece: ink blue (his card colour #1F3A93 sits at F3)
  F0: 0x0b0f1f, F1: 0x121a33, F2: 0x1b274a, F3: 0x26396a, F4: 0x384f88, F5: 0x5a6fa6, F6: 0x8c9ccb, INK: 0x1f3a93,
  // dusk sky bridge (violet -> plum -> rose -> coral) between the N and W families
  U0: 0x1d1a36, U1: 0x2e2244, U2: 0x46294f, U3: 0x6a3155, U4: 0x96394f, U5: 0xc14e4a,
  // rocket red (SPACEZ livery, never on Mario)
  Q0: 0x4a0e0c, Q1: 0x8a1a12, Q2: 0xe0301e,
} as const;

export type Ramps = Record<string, number[]>;
export type Legend = Record<string, readonly [string, number] | number>;

export const newImg = (w: number, h: number): Img => ({w, h, c: new Int32Array(w * h).fill(-1)});
export const putPx = (img: Img, x: number, y: number, col: number) => {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  img.c[y * img.w + x] = col;
};
/** Paint a tone map into an image. '.' / ' ' transparent, '_' erases. */
export const paintMap = (img: Img, x: number, y: number, rows: readonly string[], legend: Legend, ramps: Ramps, flip = false) => {
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const ch = r[flip ? r.length - 1 - i : i];
      if (ch === '.' || ch === ' ') continue;
      if (ch === '_') { putPx(img, x + i, y + j, -1); continue; }
      const v = legend[ch];
      if (v === undefined) continue;
      const col = typeof v === 'number' ? v : ramps[v[0]]?.[v[1]];
      if (col === undefined) continue;
      putPx(img, x + i, y + j, col);
    }
  });
};
/** Paint a tone map straight into the frame buffer. */
export const paintBuf = (b: Buf, x: number, y: number, rows: readonly string[], legend: Legend, ramps: Ramps, opts: {flip?: boolean; map?: (c: number) => number} = {}) => {
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const ch = r[opts.flip ? r.length - 1 - i : i];
      if (ch === '.' || ch === ' ') continue;
      const v = legend[ch];
      if (v === undefined) continue;
      const col = typeof v === 'number' ? v : ramps[v[0]]?.[v[1]];
      if (col === undefined) continue;
      b.set(x + i, y + j, opts.map ? opts.map(col) : col);
    }
  });
};
export const blitTo = (b: Buf, img: Img, x: number, y: number, opts: {flip?: boolean; map?: (c: number) => number; clip?: (x: number, y: number) => boolean} = {}) => {
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + (opts.flip ? img.w - 1 - i : i)];
      if (v < 0) continue;
      const X = x + i, Y = y + j;
      if (opts.clip && !opts.clip(X, Y)) continue;
      b.set(X, Y, opts.map ? opts.map(v) : v);
    }
};
export const shiftPrim = (p: Prim, dx: number, dy: number): Prim => {
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => v + (i % 2 ? dy : dx))};
    case 'ell': return {...p, cx: p.cx + dx, cy: p.cy + dy};
    case 'rect': return {...p, x: p.x + dx, y: p.y + dy};
    case 'line': return {...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy};
    case 'map': return {...p, x: p.x + dx, y: p.y + dy};
  }
};
/** Tapered limb segment from (x0,y0,w0) to (x1,y1,w1). */
export const seg = (x0: number, y0: number, w0: number, x1: number, y1: number, w1: number): Prim => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return P.poly(x0 + (nx * w0) / 2, y0 + (ny * w0) / 2, x1 + (nx * w1) / 2, y1 + (ny * w1) / 2, x1 - (nx * w1) / 2, y1 - (ny * w1) / 2, x0 - (nx * w0) / 2, y0 - (ny * w0) / 2);
};
export const memo = <T,>(fn: (p: T) => Img): ((p: T) => Img) => {
  const cache = new Map<string, Img>();
  return (p: T) => {
    const k = JSON.stringify(p);
    let v = cache.get(k);
    if (!v) { v = fn(p); cache.set(k, v); }
    return v;
  };
};

// ---------------------------------------------------------------- micro font (3x5, for props & plates)
const MG: Record<string, string> = {
  A: '.#.|#.#|###|#.#|#.#', B: '##.|#.#|##.|#.#|##.', C: '.##|#..|#..|#..|.##', D: '##.|#.#|#.#|#.#|##.',
  E: '###|#..|##.|#..|###', F: '###|#..|##.|#..|#..', G: '.##|#..|#.#|#.#|.##', H: '#.#|#.#|###|#.#|#.#',
  I: '###|.#.|.#.|.#.|###', J: '..#|..#|..#|#.#|.#.', K: '#.#|#.#|##.|#.#|#.#', L: '#..|#..|#..|#..|###',
  M: '#...#|##.##|#.#.#|#...#|#...#', N: '#..#|##.#|#.##|#..#|#..#', O: '.#.|#.#|#.#|#.#|.#.', P: '##.|#.#|##.|#..|#..',
  Q: '.#.|#.#|#.#|##.|.##', R: '##.|#.#|##.|#.#|#.#', S: '.##|#..|.#.|..#|##.', T: '###|.#.|.#.|.#.|.#.',
  U: '#.#|#.#|#.#|#.#|###', V: '#.#|#.#|#.#|#.#|.#.', W: '#...#|#...#|#.#.#|##.##|#...#', X: '#.#|#.#|.#.|#.#|#.#',
  Y: '#.#|#.#|.#.|.#.|.#.', Z: '###|..#|.#.|#..|###',
  '0': '###|#.#|#.#|#.#|###', '1': '.#.|##.|.#.|.#.|###', '2': '##.|..#|.#.|#..|###', '3': '##.|..#|.#.|..#|##.',
  '4': '#.#|#.#|###|..#|..#', '5': '###|#..|##.|..#|##.', '6': '.##|#..|###|#.#|###', '7': '###|..#|.#.|.#.|.#.',
  '8': '###|#.#|###|#.#|###', '9': '###|#.#|###|..#|##.',
  $: '.##|##.|.#.|.##|##.', ',': '.|.|.|.|#|#', '.': '.|.|.|.|#', ':': '.|#|.|#|.', '-': '...|...|###|...|...',
  '*': '#.#|.#.|#.#|...|...', '!': '#|#|#|.|#', '/': '..#|..#|.#.|#..|#..', '?': '##.|..#|.#.|...|.#.',
  z: '...|###|..#|.#.|###', a: '...|.##|#.#|#.#|.##', '+': '...|.#.|###|.#.|...', '(': '.#|#.|#.|#.|.#', ')': '#.|.#|.#|.#|#.',
  // tick (5 wide)
  '^': '....#|...#.|#.#..|.#...|.....',
};
const MGL: Record<string, {w: number; rows: string[]}> = {};
for (const [k, v] of Object.entries(MG)) { const rows = v.split('|'); MGL[k] = {w: rows[0].length, rows}; }
export const microWidth = (s: string) => {
  let w = 0;
  for (const ch of s) w += (ch === ' ' ? 2 : (MGL[ch]?.w ?? 3)) + 1;
  return Math.max(0, w - 1);
};
/** 3x5 micro text; `^` draws a tick mark. */
export const micro = (b: Buf, s: string, x: number, y: number, col: number, shadow?: number) => {
  const draw = (ox: number, oy: number, c: number) => {
    let cx = x + ox;
    for (const ch of s) {
      if (ch === ' ') { cx += 3; continue; }
      const g = MGL[ch];
      if (!g) { cx += 4; continue; }
      g.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + oy + j, c); });
      cx += g.w + 1;
    }
  };
  if (shadow !== undefined) draw(1, 1, shadow);
  draw(0, 0, col);
};
/** micro text into an Img (for props baked into sprites) */
export const microImg = (img: Img, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const ch of s) {
    if (ch === ' ') { cx += 3; continue; }
    const g = MGL[ch];
    if (!g) { cx += 4; continue; }
    g.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') putPx(img, cx + i, y + j, col); });
    cx += g.w + 1;
  }
};

// ================================================================== skyline bosses
// Light: DUSK. Low sun from screen-left: warm key + hot rim on left-facing edges (selective outline:
// lit edges get the rim colour instead of the dark line), violet ambient in the shadows.
// Figures are ~26 px (head 10 / torso 8 / legs 8): a big-head rooftop scale where a face is 3-4 tones
// and the prop is exaggerated until it reads in silhouette.
export type BossId = 'tasya' | 'radnus' | 'simed' | 'kram' | 'nesnej' | 'misanthropic' | 'zai';

export const DUSK: Ramps = {
  line: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0],
  skin: [PAL.S0, PAL.X1, PAL.S3, PAL.S4, PAL.S5, PAL.W7],
  hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B3, PAL.B4, PAL.W5],
  grey: [PAL.N1, PAL.G1, PAL.G3, PAL.G5, PAL.G6, PAL.W8],
  low: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5, PAL.W4],
  shoe: [PAL.N0, PAL.N0, PAL.N1, PAL.N3, PAL.N4, PAL.W3],
  metal: [PAL.N0, PAL.N3, PAL.G2, PAL.G4, PAL.G6, PAL.W8],
  white: [PAL.N0, PAL.N5, PAL.G4, PAL.G6, PAL.P2, PAL.W9],
  paper: [PAL.N1, PAL.P0, PAL.P1, PAL.P2, PAL.W9, PAL.W9],
  red: [PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.W7],
  amber: [PAL.W0, PAL.W2, PAL.W4, PAL.W6, PAL.W7, PAL.W9],
  gold: [PAL.W1, PAL.W3, PAL.W5, PAL.W6, PAL.W7, PAL.W9],
  green: [PAL.N0, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.W8],
  wood: [PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.D4, PAL.W5],
  // per-character tops
  navy: [PAL.N0, PAL.N1, PAL.N3, PAL.N5, PAL.N6, PAL.W5],
  sweater: [PAL.N1, PAL.N4, PAL.N5, PAL.N7, PAL.N8, PAL.W6],
  charcoal: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.W5],
  tee: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N4, PAL.W4],
  leather: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.G5, PAL.W8],
  fleece: [CX.F0, CX.F1, CX.F2, CX.F3, CX.F4, PAL.W5],
  blazer: [PAL.N0, CX.U1, CX.U2, CX.U3, CX.U4, PAL.W6],
};

/** Freeze / two-tone remap (name-card holds): luminance -> ink / (mid) / paper. */
export const twoTone = (ink: number, paper: number, mid?: number) => (c: number) => {
  const l = (((c >> 16) & 255) * 0.3 + ((c >> 8) & 255) * 0.59 + (c & 255) * 0.11) / 255;
  return l > 0.42 ? paper : mid !== undefined && l > 0.2 ? mid : ink;
};

// shared legend for the tiny figures
const BL: Legend = {
  o: ['line', 0],
  '1': ['skin', 1], '2': ['skin', 2], '3': ['skin', 3], '4': ['skin', 4], '5': ['skin', 5],
  h: ['hair', 1], H: ['hair', 2], I: ['hair', 3], J: ['hair', 4], K: ['hair', 5],
  a: ['top', 1], b: ['top', 2], c: ['top', 3], d: ['top', 4], e: ['top', 5],
  p: ['low', 1], q: ['low', 2], Q: ['low', 3], O: ['low', 5],
  z: ['shoe', 1], Z: ['shoe', 3],
  r: ['pa', 1], R: ['pa', 2], s: ['pa', 3], S: ['pa', 4], t: ['pa', 5],
  u: ['pb', 1], U: ['pb', 2], v: ['pb', 3], V: ['pb', 4], w: ['pb', 5],
  k: PAL.N0, m: PAL.S1, g: PAL.W8, y: PAL.G5,
};
type Map = readonly string[];

// ---------------------------------------------------------------- shared body parts (15 wide, feet centre x=8)
const LEGS: Map = [
  '.....oQqqpppo..',
  '.....oQqqoppo..',
  '.....oQqo.opo..',
  '.....oQqo.opo..',
  '.....oQqo.opo..',
  '.....oQqo.opo..',
  '....ozZzo.ozzo.',
  '....ooooo.oooo.',
];
const TORSO: Map = [
  '.....oedcbbo...',
  '...ooedccbbboo.',
  '..oedoddccbboao',
  '..oedoddcbbbaao',
  '..oedoddcbbbaao',
  '..oedoedcbbbaao',
  '..o54odcbbbbo1o',
  '..o43oqqqpppo1o',
];
/** torso with the far (left) arm free — the arm is drawn separately */
const TORSO_FREE: Map = [
  '.....oecbbbo...',
  '....oedccbbboo.',
  '...oedccbbbbaao',
  '...oedccbbbbaao',
  '...oedcbbbbbaao',
  '...oedcbbbbbaao',
  '...oedcbbbbbo1o',
  '....oqqqpppoo1o',
];
/** torso with both arms free */
const TORSO_BARE: Map = [
  '.....oecbbbo...',
  '....oedccbbbo..',
  '...oedccbbbbo..',
  '...oedccbbbbo..',
  '...oedcbbbbbo..',
  '...oedcbbbbbo..',
  '...oedcbbbbbo..',
  '....oqqqpppo...',
];

// ---------------------------------------------------------------- heads (15 wide, 10 rows incl. neck)
const HEAD_SHORT: Map = [ // neat short dark hair
  '......ooooo....',
  '.....oJIHHho...',
  '....oJIHHHhho..',
  '....oIHHhhhho..',
  '....o54Hhhhho..',
  '....o4k43k2ho..',
  '...o44433321o..',
  '....o4mm321o...',
  '.....o4321o....',
  '......o11o.....',
];
const HEAD_TASYA: Map = [ // shaved head, glasses, trim beard
  '......ooooo....',
  '.....o54443o...',
  '....o5444332o..',
  '....o4444332o..',
  '....o4443321o..',
  '....okgkkgk21o.',
  '...o44433321o..',
  '....o4Imm3I1o..',
  '.....oIIII1o...',
  '......o11o.....',
];
const HEAD_RADNUS: Map = [ // neat dark hair, polite smile
  '......ooooo....',
  '.....oJIHHho...',
  '....oJIHHHhho..',
  '....oJHhhhhho..',
  '....o5Hhhhhho..',
  '....o4k43k2ho..',
  '...o44433321o..',
  '....o4m33m1o...',
  '.....o3mm1o....',
  '......o11o.....',
];
const HEAD_KRAM: Map = [ // short curly crop
  '.....o.o.o.....',
  '....oJoJoIo....',
  '....oJIHIHho...',
  '...oJHIhIhHho..',
  '....o5HhIhhho..',
  '....o4k43k2ho..',
  '...o44433321o..',
  '....o4mm321o...',
  '.....o4321o....',
  '......o11o.....',
];
const HEAD_NESNEJ: Map = [ // swept-back grey hair
  '.....ooooo.....',
  '....oKJJIIgo...',
  '...oKJJIIgggo..',
  '...oJJIIgghgo..',
  '....o54IIghgo..',
  '....o4k43k2go..',
  '...o44433321o..',
  '....o4mm321o...',
  '.....o4321o....',
  '......o11o.....',
];
const HEAD_MARIO: Map = [ // curly mop + glasses (mini)
  '....o.oo.oo....',
  '...oJoJHoIHo...',
  '..oKJIHIHhIho..',
  '..oJIHhIhhIhho.',
  '...oJ54hhIhhho.',
  '...okgkkgk1hho.',
  '..o4443321ho...',
  '...o4mm21ho....',
  '....o4321o.....',
  '.....o11o......',
];
const HEAD_ADELINA: Map = [ // shoulder-length dark hair framing the face
  '.....ooooo.....',
  '....oKJIHHho...',
  '...oKJHHHhhho..',
  '...oJH54HhhHo..',
  '...oH544hhhHho.',
  '...oH4k43k2Hho.',
  '..oH444333hHho.',
  '...oH4mm21hHho.',
  '...oHo4321ohho.',
  '...oho.o11ohho.',
];
const HEAD_NOLE: Map = [ // swept dark hair, square jaw
  '.....oooooo....',
  '....oKJJIHHo...',
  '...oKJIHHHhho..',
  '...oJIHHhhhho..',
  '...o54Hhhhhho..',
  '...o4k43k2hho..',
  '..o444433211o..',
  '...o4443321o...',
  '...o4mm3321o...',
  '....oo1111oo...',
];

// ---------------------------------------------------------------- compositor
type Part = readonly [Map, number, number, Legend?];
const drawParts = (b: Buf, x: number, y: number, parts: Part[], ramps: Ramps, map?: (c: number) => number) => {
  for (const [rows, dx, dy, leg] of parts) paintBuf(b, x + dx, y + dy, rows, leg ? {...BL, ...leg} : BL, ramps, {map});
};
const withMats = (R: Ramps, m: {top: string; hair?: string; low?: string; pa?: string; pb?: string}): Ramps => ({
  ...R, top: R[m.top], hair: R[m.hair ?? 'hair'], low: R[m.low ?? 'low'], pa: R[m.pa ?? 'metal'], pb: R[m.pb ?? 'metal'],
});

// ---------------------------------------------------------------- props
/** a skeleton key hanging from (x, y) at angle a (radians from straight down) */
const key = (b: Buf, x: number, y: number, a: number, R: Ramps, map?: (c: number) => number, len = 7) => {
  const M = (c: number) => (map ? map(c) : c);
  const g = R.gold;
  // bow: a compact 2x2 loop hooked on the ring (spaced so neighbours never merge)
  b.set(x, y, M(g[4])); b.set(x + 1, y, M(g[3])); b.set(x, y + 1, M(g[3])); b.set(x + 1, y + 1, M(g[2])); b.set(x + 2, y + 1, M(g[0])); b.set(x, y + 2, M(g[0]));
  const sx = Math.sin(a), sy = Math.cos(a);
  let ex = x, ey = y + 2;
  for (let t = 1; t <= len; t++) {
    const px = Math.round(x + 0.5 + sx * t), py = Math.round(y + 1 + sy * t);
    b.set(px + 1, py, M(g[0]));
    b.set(px, py, M(t < 3 ? g[4] : g[3]));
    ex = px; ey = py;
  }
  // bit (two teeth) on the far side of the shaft end
  b.set(ex + 1, ey, M(g[3])); b.set(ex + 1, ey - 2, M(g[3])); b.set(ex + 2, ey, M(g[0])); b.set(ex + 2, ey - 2, M(g[0]));
};
const KEYRING: Map = [
  '...ooo...',
  '.ooSsRoo.',
  '.oS...ro.',
  'oS.....ro',
  'os.....ro',
  'oR.....ro',
  '.oR...ro.',
  '.ooRrroo.',
  '...ooo...',
];
const TASYA_ARM: Map = [ // far arm raised (the fist is drawn over the ring separately)
  '.oedo..',
  '.oedo..',
  '..oedo.',
  '..oedo.',
  '...oedo',
  '...oedo',
  '...oedo',
];
const EXTINGUISHER: Map = [
  '...ouo..',
  '..ouUUo.',
  '.oouuoo.',
  'oStRRRo.',
  'oSsRRro.',
  'oSsRRro.',
  'oSsRRro.',
  'oSsRRro.',
  'oSsRRro.',
  'otsRRro.',
  '.oooooo.',
];
const HOSE: Map = [
  'oo....',
  'uvo...',
  'ouoo..',
  '.oUo..',
  '..oUo.',
  '..oUo.',
];
const PUFF: Map[] = [
  ['.......', '.......', '.......', '.......', '.......'],
  ['.......', '.......', '...oo..', '..oVwo.', '...oo..'],
  ['...oo..', '.ooVwo.', 'oVwVVwo', 'oVVwVVo', '.oooooo'],
];
const SIREN_DOME: Map[] = [
  // CODE RED rotor: the bright lens faces left / us / right / away
  ['...oooo...', '..otSRro..', '.otSRRrro.', '.oSRRrrro.', 'oooooooooo', '.ouvvvvuo.', '..ouuuuo..'],
  ['...oooo...', '..oStSRo..', '.oRStSSRo.', '.orRSSRro.', 'oooooooooo', '.ouvvvvuo.', '..ouuuuo..'],
  ['...oooo...', '..orRStSo..', '.orrRRSto.', '.orrrRRSo.', 'oooooooooo', '.ouvvvvuo.', '..ouuuuo..'],
  ['...oooo...', '..orRRro..', '.orRRRRro.', '.orrRRrro.', 'oooooooooo', '.ouvvvvuo.', '..ouuuuo..'],
];
const CHESS_TABLE_W = 18;
const ROBOT: Map[] = [
  // up (thinking) / down (moves a piece): white industrial arm with cyan joint lights
  [
    '........ooo......',
    '.......oStSo.....',
    '......oSGsRoooo..',
    '.....oSsRooSSSRo.',
    '.....oSso..oooRo.',
    '....oSso......oRo',
    '....oSso.....ooRoo',
    '...oSso......oRkRo',
    '...oSso......oo.oo',
    '..oSso...........',
    '..oSso...........',
    '..oSso...........',
    '..oSso...........',
    '..oSso...........',
    '..oGso...........',
    '..oSso...........',
    '..oSso...........',
    '.ooSsoo..........',
    '.oSSssRo.........',
    'oSSSssRRo........',
    'oRRRRRRRo........',
  ],
  [
    '.................',
    '.................',
    '........ooo......',
    '.......oStSooo...',
    '......oSGsRSSSoo.',
    '.....oSsRooooSRo.',
    '.....oSso.....oRo',
    '....oSso.......oRo',
    '....oSso......ooRoo',
    '...oSso.......oRkRo',
    '...oSso.......oo.oo',
    '..oSso...........',
    '..oSso...........',
    '..oSso...........',
    '..oGso...........',
    '..oSso...........',
    '..oSso...........',
    '.ooSsoo..........',
    '.oSSssRo.........',
    'oSSSssRRo........',
    'oRRRRRRRo........',
  ],
];
const SIMED_SIT: Map = [
  '...oQqqqpppo...',
  '..oQQqqqpppo...',
  '..oQqoooopo....',
  '..oQqo..ouo....',
  '..oQqo..ouo....',
  '..oQqo..ouo....',
  '.ozZzo..ouo....',
  '.ooooo.ouuuo...',
];
const SIMED_ARM: Map[] = [
  // reach to the board / tap the clock
  ['......', '.oo...', 'o4doo.', 'oodeeo', '...ooo'],
  ['.oo...', 'o4o...', 'oedo..', '.odeo.', '..ooo.'],
  ['......', '......', '..oo..', '.o4eo.', '.odeo.'],
];
const KRAM_POSTER: Map = [
  'ooooooooooooo',
  'oVVVVVVVVVVVo',
  'oVokkoVokkoVo',
  'oVkHHkVkIIkVo',
  'oVk21kVk21kVo',
  'oVokkoVokkoVo',
  'oVVVVVVVVVVVo',
  'oVrrrVVVrrrVo',
  'oVVVVVVVVVVVo',
  'oVvvvvvvvvvVo',
  'oVvvvvvvvvvVo',
  'oVVVVVVVVVVVo',
  'oVvvvvvVvvvVo',
  'oVVVVVVVVVVVo',
  'ooooooooooooo',
];
const KRAM_HANDS: Map = ['o54o', 'o43o', '.oo.'];
const KRAM_CHAIN_PTS: Array<[number, number]> = [[6, 11], [7, 12], [8, 13], [9, 13], [10, 12], [11, 11]];
const NESNEJ_JACKET: Map = [ // open leather jacket over a black tee, hard specular streaks
  '.....oedbbbo...',
  '....oedukkbbo..',
  '...oedvukkbuo..',
  '...oedvkkkbuo..',
  '...oedbkkkbuo..',
  '...oedbkkbbbo..',
  '...oedbkkbbbo..',
  '....oqqqpppo...',
];
const NESNEJ_ARM: Map[] = [
  // reach into the crate / wind back at hip height with a card / release / follow-through
  ['.......', '.......', 'oeo....', 'oedo...', '.oedo..', '.oedo..', '..o43o.', '..oo...'],
  ['.......', '.......', 'oeo....', 'oedoooo', '.oeddo4', '..ooo43', '....oo.', '.......'],
  ['.......', '.......', '.......', 'oo.....', 'o43oooo', '.ooddeeo', '...ooooo', '.......'],
  ['.......', '.......', '.......', '.....oo', '....oeo', '...oedo', '..oedo.', 'o43o...'],
];
const GPU_CARD: Map = [
  'oooooooo',
  'oVGVVGVo',
  'oGkGGkGo',
  'ouuuuuuo',
  'oooooooo',
];
const CRATE: Map = [
  '.oooooooooo.',
  'oVGVoVGVoVGo',
  'oooooooooooo',
  'otSSSSSSSSso',
  'oSRRRRRRRRro',
  'oSooooooooro',
  'oSRRRRRRRRro',
  'otSSSSSSSSso',
  'oooooooooooo',
];
const MARIO_WAVE: Map[] = [
  ['.o54o', '.o43o', 'oedo.', 'oedo.', '.oo..'],
  ['o54o.', 'o43o.', '.oedo', '.oedo', '..oo.'],
];
const CLIPBOARD: Map[] = [
  ['.oyyo...', 'oVVVVo..', 'oVkVVo..', 'oVVVVo..', 'oVkVVo54', 'oVVVVoo3', 'oooooo..'],
  ['.oyyo...', 'oVVVVo..', 'oVkVVo..', 'oVVkV54.', 'oVkVVo3.', 'oVVVVo..', 'oooooo..'],
];
const MEGAPHONE: Map = [
  '.....ooo',
  '...ooSSo',
  '.ooSSSSo',
  'oStSSSso',
  'oRRSSSso',
  '.ooSSSSo',
  '...ooSSo',
  '.....ooo',
];
const NOLE_FIST: Map[] = [
  ['.......', '.......', '.......', '...o54o', '..oedo.', '.oedo..', '.oo....'],
  ['...o54o', '...o43o', '...oedo', '..oedo.', '..oedo.', '.oedo..', '.oo....'],
];

const LANTERN: Map[] = [0, 1, 2, 3].map((k) => [
  '......oooooo.......',
  '....ooSSSsRRoo.....',
  '...oSSSsssRRRRo....',
  '..oooooooooooooo...',
  '...oRo.......oRo...',
  '...oRo.......oRo...',
  '...oRo.......oRo...',
  '...oRo.......oRo...',
  '...oRo.......oRo...',
  '...oRo.......oRo...',
  '...oRo.......oRo...',
  '...oRo.......oRo...',
  '..oooooooooooooo...',
  '..oSSSSsssRRRRRo...',
  '..oooooooooooooo...',
].map((r, j) => {
  if (j < 4 || j > 11) return r;
  // the lens: glass panes (dark sky reflection) with the lamp; the bright side turns with the beam
  const glass = '.' + 'wwwwwww'.split('').map((c, i) => {
    const d = Math.abs(i - 3) + Math.abs(j - 8) * 0.8;
    if (d < 1.2) return k === 3 ? 'U' : 'G';
    if (d < 2.4) return k === 3 ? 'u' : k === 1 ? 'G' : 'F';
    if (d < 3.4 && k !== 3) return (k === 0 && i < 3) || (k === 2 && i > 3) || k === 1 ? 'E' : 'V';
    return 'v';
  }).join('') + '.';
  return r.slice(0, 5) + glass.slice(1, 8) + r.slice(12);
}));
const ZAI_ROCKET: Map = [
  '....oo....',
  '...oSso...',
  '..oSSsso..',
  '..oSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.ouuuuuuo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.ouuuuuuo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
  '.oSSSssRo.',
];

// ================================================================== assembly
export interface BossOpts { ramps?: Ramps; map?: (c: number) => number; }
const stepOf = (f: number, n: number, hold: number) => Math.floor(f / hold) % n;

/** Draw a boss with his/her feet on the roof line at (x, y). f = video frame. */
export const drawBoss = (b: Buf, id: BossId, x: number, y: number, f: number, o: BossOpts = {}) => {
  const R0 = o.ramps ?? DUSK;
  const M = (c: number) => (o.map ? o.map(c) : c);
  const ox = x - 8, oy = y - 26; // figure box origin
  switch (id) {
    case 'tasya': {
      // keys swing L / C / R / C, held 3; the glint rides the key that swings through the light
      const s = stepOf(f, 4, 3);
      const sw = [-0.28, 0, 0.28, 0][s];
      const R = withMats(R0, {top: 'navy', pa: 'gold'});
      drawParts(b, ox, oy, [[LEGS, 0, 18], [TORSO_FREE, 0, 10], [HEAD_TASYA, 0, 0]], R, o.map);
      // layered: raised arm, keys, the ring, then the fist gripping the ring's top
      drawParts(b, ox - 1, oy + 5, [[TASYA_ARM, 0, 0]], R, o.map);
      const rx = ox - 8, ry = oy + 2;
      key(b, rx + 1, ry + 7, sw - 0.6, R0, o.map, 6);
      key(b, rx + 4, ry + 8, sw, R0, o.map, 7);
      key(b, rx + 7, ry + 7, sw + 0.6, R0, o.map, 6);
      drawParts(b, rx, ry, [[KEYRING, 0, 0]], R, o.map);
      drawParts(b, ox - 3, oy + 0, [[['.oo..', 'o54o.', 'o443o', '.ooo.'], 0, 0]], R, o.map);
      if (s === 1 || s === 3) b.set(rx + 5 + Math.round(sw * 8), ry + 15, M(PAL.W9));
      return;
    }
    case 'radnus': {
      // a polite puff: 0 / small / full / small (held 4) while the CODE RED rotor turns behind him
      const s = stepOf(f, 4, 4);
      const R = withMats(R0, {top: 'sweater', pa: 'red', pb: 'metal'});
      const sx = ox + 12, sy = oy - 8;
      rect(sx + 4, sy + 7, 2, y - sy - 7, b.ink(M(R0.metal[1])));
      rect(sx + 4, sy + 7, 1, y - sy - 7, b.ink(M(R0.metal[2])));
      // beam: a flat two-tone wedge that breaks into a dither at its far end (light, not a glow)
      const beam = (dir: number) => {
        for (let i = 1; i <= 12; i++) {
          const hw = Math.floor(i / 3);
          for (let j = -hw; j <= hw; j++) {
            if (i > 8 && ((i + j) & 1)) continue;
            const px = dir < 0 ? sx + 1 - i : sx + 8 + i;
            b.set(px, sy + 2 + j, M(i < 5 && Math.abs(j) < 1 + i / 4 ? R0.red[5] : R0.red[4]));
          }
        }
      };
      if (s === 0) beam(-1);
      if (s === 2) beam(1);
      drawParts(b, sx, sy, [[SIREN_DOME[s], 0, 0]], R, o.map);
      if (s === 1) { b.set(sx + 4, sy + 2, M(PAL.W9)); b.set(sx + 5, sy + 2, M(PAL.W9)); b.set(sx + 4, sy + 3, M(PAL.W8)); b.set(sx + 3, sy - 1, M(R0.red[4])); b.set(sx + 6, sy - 1, M(R0.red[4])); }
      drawParts(b, ox, oy, [[LEGS, 0, 18], [TORSO, 0, 10], [HEAD_RADNUS, 0, 0]], R, o.map);
      // when the beam passes over him, the red kicks along his lit edge
      if (s === 0) for (let j = 11; j < 17; j++) b.set(ox + 2, oy + j, M(R0.red[4]));
      drawParts(b, ox + 1, oy + 14, [[EXTINGUISHER, 0, 0]], R, o.map);
      drawParts(b, ox - 3, oy + 13, [[HOSE, 0, 0]], R, o.map);
      drawParts(b, ox - 10, oy + 10, [[PUFF[[0, 1, 2, 1][s]], 0, 0]], withMats(R0, {top: 'sweater', pb: 'paper'}), o.map);
      drawParts(b, ox + 2, oy + 15, [[['o54o', 'o43o', '.oo.'], 0, 0]], R, o.map);
      return;
    }
    case 'simed': {
      // speed chess: he moves / he hits the clock / the arm moves / the arm hits the clock (held 3)
      const s = stepOf(f, 4, 3);
      const R = withMats(R0, {top: 'charcoal', pa: 'white', pb: 'metal'});
      const tx = ox - CHESS_TABLE_W + 2, ty = oy + 14;
      // robot arm on the far side of the table, standing on the roof
      drawParts(b, tx - 11, y - 21, [[ROBOT[s === 2 ? 1 : 0], 0, 0, {G: PAL.C7}]], R, o.map);
      // table
      rect(tx, ty + 2, CHESS_TABLE_W, 1, b.ink(M(R0.wood[4])));
      rect(tx, ty + 3, CHESS_TABLE_W, 1, b.ink(M(R0.wood[1])));
      rect(tx + 8, ty + 4, 2, 7, b.ink(M(R0.wood[1])));
      rect(tx + 5, ty + 11, 8, 1, b.ink(M(R0.wood[2])));
      // board: 8 squares wide, 2 rows deep, seen from the side
      for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) b.set(tx + 4 + i, ty + j, M(((i + j) & 1) ? R0.paper[3] : R0.wood[2]));
      // pieces: a pawn that changes square with each move
      const pw = s >= 2 ? 1 : 0, pb = s === 0 || s === 3 ? 0 : 1;
      b.set(tx + 6 + pw, ty - 1, M(R0.paper[4])); b.set(tx + 6 + pw, ty - 2, M(R0.paper[3]));
      b.set(tx + 9 - pb, ty - 1, M(R0.line[0])); b.set(tx + 9 - pb, ty - 2, M(R0.metal[1]));
      b.set(tx + 5, ty - 1, M(R0.paper[3])); b.set(tx + 10, ty - 1, M(R0.line[0]));
      // chess clock: the pressed side goes down
      const lDown = s === 3, rDown = s === 1;
      rect(tx + 13, ty - 1, 4, 3, b.ink(M(R0.line[0])));
      b.set(tx + 14, ty, M(R0.paper[3])); b.set(tx + 15, ty, M(R0.paper[2]));
      b.set(tx + 13, ty - (lDown ? 1 : 2), M(R0.red[3]));
      b.set(tx + 16, ty - (rDown ? 1 : 2), M(R0.red[3]));
      drawParts(b, ox, oy, [[SIMED_SIT, 0, 18], [TORSO_FREE, 0, 10], [HEAD_SHORT, 0, 0]], R, o.map);
      const arm = s === 0 ? [SIMED_ARM[0], -3, 12] : s === 1 ? [SIMED_ARM[1], -2, 10] : [SIMED_ARM[2], 0, 11];
      drawParts(b, ox + (arm[1] as number), oy + (arm[2] as number), [[arm[0] as Map, 0, 0]], R, o.map);
      return;
    }
    case 'kram': {
      // pumps the poster up / down; the sun runs down the chain (3 steps, held 4)
      const s = stepOf(f, 3, 4);
      const up = s === 1 ? -1 : 0;
      const R = withMats(R0, {top: 'tee', pa: 'red', pb: 'paper'});
      drawParts(b, ox, oy, [[LEGS, 0, 18], [TORSO_BARE, 0, 10], [HEAD_KRAM, 0, 0]], R, o.map);
      // chunky chain: alternating links, one hot link per step
      KRAM_CHAIN_PTS.forEach(([cx, cy], i) => b.set(ox + cx, oy + cy, M(i === s * 2 || i === s * 2 + 1 ? R0.gold[5] : i % 2 ? R0.gold[2] : R0.gold[4])));
      const px = ox - 11, py = oy + 6 + up;
      drawParts(b, px, py, [[KRAM_POSTER, 0, 0, {V: ['paper', 3], v: ['paper', 1], r: ['red', 3], H: ['hair', 2], I: ['hair', 3]}]], R, o.map);
      // CANCELED: a red band slapped across it
      for (let i = 0; i < 11; i++) { b.set(px + 1 + i, py + 11 - Math.floor(i / 2), M(R0.red[4])); b.set(px + 1 + i, py + 12 - Math.floor(i / 2), M(R0.red[2])); }
      drawParts(b, px + 11, py + 4, [[KRAM_HANDS, 0, 0]], R, o.map);
      drawParts(b, px + 11, py + 10, [[KRAM_HANDS, 0, 0]], R, o.map);
      return;
    }
    case 'nesnej': {
      const s = stepOf(f, 4, 3);
      const R = withMats(R0, {top: 'leather', hair: 'grey', pa: 'wood', pb: 'green'});
      const leg: Legend = {G: PAL.L3, V: ['green', 3], u: ['green', 1], k: PAL.N0, R: ['wood', 2], S: ['wood', 3], r: ['wood', 1], t: ['wood', 4], s: ['wood', 3]};
      drawParts(b, ox + 12, y - CRATE.length, [[CRATE, 0, 0, leg]], R, o.map);
      drawParts(b, ox, oy, [[LEGS, 0, 18], [NESNEJ_JACKET, 0, 10, {u: ['leather', 4], v: ['leather', 3], k: PAL.N0}], [HEAD_NESNEJ, 0, 0, {g: ['grey', 2], J: ['grey', 4], I: ['grey', 3], K: ['grey', 5], H: ['grey', 2], h: ['grey', 1]}]], R, o.map);
      const [ax, ay] = [[ox + 11, oy + 12], [ox + 10, oy + 9], [ox - 4, oy + 8], [ox - 3, oy + 9]][s];
      if (s === 1) drawParts(b, ox + 17, oy + 11, [[GPU_CARD, 0, 0, leg]], R, o.map);
      drawParts(b, ax, ay, [[NESNEJ_ARM[s], 0, 0, leg]], R, o.map);
      if (s === 2) drawParts(b, ox - 13, oy + 6, [[GPU_CARD, 0, 0, leg]], R, o.map);
      if (s === 3) drawParts(b, ox - 24, oy - 1, [[GPU_CARD, 0, 0, leg]], R, o.map);
      return;
    }
    case 'misanthropic': {
      // lighthouse lantern: the SAFETY beacon sweeps (4 states, held 3); on the gallery, behind the rail,
      // Mario waves (2 drawings) and Adelina ticks her clipboard (2 drawings)
      const s = stepOf(f, 2, 6), bs = stepOf(f, 4, 3);
      const RM = withMats(R0, {top: 'fleece'});
      const RA = withMats(R0, {top: 'blazer', pa: 'metal', pb: 'paper'});
      const RL = withMats(R0, {top: 'white', pa: 'white', pb: 'amber'});
      const lx = x - 9, ly = y - 36;
      drawParts(b, lx, ly, [[LANTERN[bs], 0, 0, {G: PAL.W9, F: PAL.W8, E: PAL.W7}]], RL, o.map);
      const beam = (dir: number) => {
        for (let i = 1; i <= 16; i++) {
          const hw = Math.floor(i / 4);
          for (let j = -hw; j <= hw; j++) {
            if (i > 11 && ((i + j) & 1)) continue;
            b.set(dir < 0 ? lx + 3 - i : lx + 15 + i, ly + 9 + j, M(i < 7 ? PAL.W8 : PAL.W7));
          }
        }
      };
      if (bs === 0) beam(-1);
      if (bs === 2) beam(1);
      const mx = x - 17, my = y - 21;
      drawParts(b, mx, my, [[TORSO_FREE.slice(0, 6), 0, 10, {y: PAL.G5}], [HEAD_MARIO, 0, 0]], RM, o.map);
      drawParts(b, mx - 1, my + 5 - s, [[MARIO_WAVE[s], 0, 0]], RM, o.map);
      const ax = x - 2, ay = y - 21;
      drawParts(b, ax, ay, [[TORSO_BARE.slice(0, 6), 0, 10], [HEAD_ADELINA, 0, 0]], RA, o.map);
      drawParts(b, ax + 2, ay + 11, [[CLIPBOARD[s], 0, 0]], RA, o.map);
      // gallery: deck, rail at waist height, balusters
      rect(x - 22, y - 5, 36, 1, b.ink(M(R0.metal[3])));
      rect(x - 22, y - 4, 36, 1, b.ink(M(R0.metal[1])));
      for (let i = 0; i < 36; i += 3) rect(x - 22 + i, y - 3, 1, 3, b.ink(M(R0.metal[i < 6 ? 3 : 2])));
      rect(x - 23, y, 38, 1, b.ink(M(R0.metal[3])));
      rect(x - 23, y + 1, 38, 1, b.ink(M(R0.metal[1])));
      return;
    }
    case 'zai': {
      const s = stepOf(f, 3, 4);
      const R = withMats(R0, {top: 'tee', pa: 'white'});
      // the gantry: a lattice mast (behind), the rocket beyond it, the deck + handrail he stands on
      const gx = x + 8;
      const RW = withMats(R0, {top: 'white', pa: 'white', pb: 'red'});
      drawParts(b, gx + 2, y - 46, [[ZAI_ROCKET, 0, 0]], RW, o.map);
      for (let j = -40; j < 0; j++) { b.set(gx, y + j, M(R0.metal[1])); b.set(gx + 5, y + j, M(R0.metal[1])); if (((j + 40) % 6) < 1) rect(gx, y + j, 6, 1, b.ink(M(R0.metal[1]))); else { b.set(gx + ((j + 40) % 6), y + j, M(R0.metal[2])); } }
      drawParts(b, ox, oy, [[LEGS, 0, 18], [TORSO_BARE, 0, 10], [HEAD_NOLE, 0, 0]], R, o.map);
      drawParts(b, ox - 5, oy + 3, [[MEGAPHONE, 0, 0, {R: ['red', 3]}]], R, o.map);
      drawParts(b, ox + 1, oy + 9, [[['.oo.', 'o54o', 'oedo', '.oedo', '..oo'], 0, 0]], R, o.map);
      drawParts(b, ox + 10, oy + 5, [[NOLE_FIST[s === 1 ? 1 : 0], 0, 0]], R, o.map);
      // the voice: arcs leaving the bell
      const arcs = [[0], [0, 1], [1, 2]][s];
      for (const a of arcs) {
        const cx = ox - 7 - a * 3, cy = oy + 6;
        const r = 2 + a;
        for (let j = -r; j <= r; j++) b.set(cx - Math.round(Math.sqrt(Math.max(0, r * r - j * j)) * 0.6), cy + j, M(a === 2 ? R0.gold[3] : R0.gold[4]));
      }
      // deck + rail
      rect(x - 14, y, 30, 1, b.ink(M(R0.metal[3])));
      rect(x - 14, y + 1, 30, 1, b.ink(M(R0.metal[1])));
      rect(x - 14, y - 11, 30, 1, b.ink(M(R0.metal[3])));
      for (let i = 0; i <= 28; i += 7) rect(x - 14 + i, y - 10, 1, 10, b.ink(M(R0.metal[2])));
      rect(x - 14, y - 5, 30, 1, b.ink(M(R0.metal[1])));
      return;
    }
  }
};

/** Loop lengths (video frames); every boss loop divides the 48-frame motion test. */
export const BOSS_LOOP: Record<BossId, number> = {tasya: 12, radnus: 16, simed: 12, kram: 12, nesnej: 12, misanthropic: 12, zai: 12};

export const BOSSES: Array<{id: BossId; name: string; roof: string; note: string}> = [
  {id: 'tasya', name: 'TASYA', roof: 'MACROSOFT', note: 'jangles the keys'},
  {id: 'radnus', name: 'RADNUS', roof: 'ELGOOG', note: 'politely on fire'},
  {id: 'simed', name: 'SIMED', roof: 'MINDDEEP', note: 'speed chess'},
  {id: 'kram', name: 'KRAM', roof: 'ATEM', note: 'the poster'},
  {id: 'nesnej', name: 'NESNEJ', roof: 'INVIDIA', note: 'tosses GPUs'},
  {id: 'misanthropic', name: 'MARIO+ADELINA', roof: 'MISANTHROPIC', note: 'lighthouse'},
  {id: 'zai', name: 'NOLE', roof: 'zAI', note: 'megaphone'},
];

export {line};
