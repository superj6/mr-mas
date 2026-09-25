// MR. MAS — cast (mrollcall): the roll-call portraits for "THE PLAYERS" (intro bar 9, f480-539).
// Painted like the approved pixeladv / cast portraits: every face plane is a hand-placed polygon with an
// explicit ramp index; the rig adds only silhouette edges (lit rim, shadow-side outline, back rim).
// Eyes, brows, mouths and props are hand-pixelled stamps. Whole-pixel only: motion is replacement drawings
// (the key-ring jangle, the siren sweep, the GPU's two spin drawings) and integer nudges. Nothing rotates.
//
// Each portrait paints the INSIDE of its window (background + figure), clipped, at its authored size (RC_SIZE).
// The roll call now uses ONE window size (112x136, SCRIPT §3.7): src/dev/mrollcall/scene.ts crops each portrait's
// authored art into it (per-portrait crop offsets). RUMPT and the cursor are authored at 112x136. k = frames since
// the flash cut in.
import {Buf, bayer, hash, rect, line, ellipse, poly} from '../px';
import {PAL, lightness} from '../palette';
import {Adjust, FigureDef, Img, LightRig, P, Part, Prim, Stamp, blitImg, renderFigure} from '../figure';

// ------------------------------------------------------------------ helpers
const plane = (onlyMat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat});
const recolor = (onlyMat: string, mat: string, tone: number, ...prims: Prim[]): Adjust => ({prims, tone, onlyMat, mat});
const shiftPrim = (p: Prim, dx: number, dy: number): Prim => {
  switch (p.k) {
    case 'poly': return {...p, pts: p.pts.map((v, i) => v + (i % 2 ? dy : dx))};
    case 'ell': return {...p, cx: p.cx + dx, cy: p.cy + dy};
    case 'rect': return {...p, x: p.x + dx, y: p.y + dy};
    case 'line': return {...p, x0: p.x0 + dx, y0: p.y0 + dy, x1: p.x1 + dx, y1: p.y1 + dy};
    case 'map': return {...p, x: p.x + dx, y: p.y + dy};
  }
};
const cache = new Map<string, Img>();
const memoFig = (key: string, build: () => Img) => {
  let v = cache.get(key);
  if (!v) { v = build(); cache.set(key, v); }
  return v;
};
type Clip = (x: number, y: number) => boolean;
const clipTo = (x: number, y: number, w: number, h: number): Clip => (px, py) => px >= x && py >= y && px < x + w && py < y + h;
/** Plot into the frame buffer only inside the window. */
const ink = (b: Buf, clip: Clip, col: number) => (x: number, y: number) => { if (clip(x, y)) b.set(x, y, col); };
/** Paint a hand-pixelled map straight into the frame buffer (window-clipped). */
const stampBuf = (b: Buf, clip: Clip, x: number, y: number, rows: string[], pal: Record<string, number>) =>
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined && clip(x + i, y + j)) b.set(x + i, y + j, c); } });

/** Stepped, dithered pool: rings [[radius 0..1, colour], ...] outer -> inner, 35% of each band dithered. */
const pool = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number, cx: number, cy: number, sx: number, sy: number, base: number, rings: Array<[number, number]>) => {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = Math.hypot((x - cx) / sx, (y - cy) / sy);
      const bz = bayer(x0 + x, y0 + y);
      let c = base;
      for (let q = 0; q < rings.length; q++) {
        const [r, col] = rings[q];
        const next = q + 1 < rings.length ? rings[q + 1][0] : 0;
        const band = (r - next) * 0.35;
        if (d < r - band || (d < r && bz < (r - d) / band)) c = col;
      }
      if (clip(x0 + x, y0 + y)) b.set(x0 + x, y0 + y, c);
    }
};

/**
 * Dithered terminator: where colour `a` meets colour `b` along `dir` (b lies toward dir), the first `w`
 * pixels of `a` take `b` on an ordered pattern (1st px checker, 2nd px 25%). The only gradient on faces.
 */
const seam = (img: Img, a: number, b: number, dir: [number, number], w = 2) => {
  const src = new Int32Array(img.c);
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) {
      if (src[y * img.w + x] !== a) continue;
      for (let d = 1; d <= w; d++) {
        const nx = x + dir[0] * d, ny = y + dir[1] * d;
        if (nx < 0 || ny < 0 || nx >= img.w || ny >= img.h) break;
        const v = src[ny * img.w + nx];
        if (v === b) { if (d === 1 ? (x + y) % 2 === 0 : bayer(x, y) < 0.25) img.c[y * img.w + x] = b; break; }
        if (v !== a) break;
      }
    }
  return img;
};

/** Window inner sizes (must match src/dev/mrollcall/timeline.ts WINDOWS: the window plays the melody). */
export const RC_SIZE = {
  tasya: [124, 150], radnus: [124, 150], kram: [124, 150], nesnej: [124, 150],
  rima: [138, 166], whale: [146, 176], rumpt: [112, 136], cursor: [112, 136],
} as const;
/**
 * Re-author a figure bigger (the leap's tighter crops): every primitive's GEOMETRY is scaled about (cx, cy)
 * before rasterising, so edges stay crisp single pixels; hand-pixelled stamps keep their pixel size and only
 * move. This is drawing at a new size, not scaling a sprite.
 */
const enlarge = (fig: FigureDef, k: number, cx: number, cy: number, dx = 0, dy = 0): FigureDef => {
  const X = (v: number) => cx + (v - cx) * k + dx, Y = (v: number) => cy + (v - cy) * k + dy;
  const sp = (p: Prim): Prim => {
    switch (p.k) {
      case 'poly': return {...p, pts: p.pts.map((v, i) => (i % 2 ? Y(v) : X(v)))};
      case 'ell': return {...p, cx: X(p.cx), cy: Y(p.cy), rx: p.rx * k, ry: p.ry * k};
      case 'rect': return {...p, x: X(p.x), y: Y(p.y), w: p.w * k, h: p.h * k};
      case 'line': return {...p, x0: X(p.x0), y0: Y(p.y0), x1: X(p.x1), y1: Y(p.y1)};
      case 'map': return {...p, x: Math.round(X(p.x)), y: Math.round(Y(p.y))};
    }
  };
  return {
    w: fig.w, h: fig.h,
    parts: fig.parts.map((pt) => ({...pt, prims: pt.prims.map(sp)})),
    adjust: (fig.adjust ?? []).map((a) => ({...a, prims: a.prims.map(sp)})),
    stamps: (fig.stamps ?? []).map((st) => {
      const w = Math.max(...st.rows.map((r) => r.length)), h = st.rows.length;
      return {...st, x: Math.round(X(st.x + w / 2) - w / 2), y: Math.round(Y(st.y + h / 2) - h / 2)};
    }),
  };
};

/** Flashes 1-4: the figures are drawn at the dialogue-portrait scale (112x136 art), placed in the base window. */
const FIG_DX = 8, FIG_DY = 14;
/** Re-seat a figure authored on one canvas onto a bigger one (every prim and stamp moves by whole px). */
const place = (fig: FigureDef, dx: number, dy: number, w: number, h: number): FigureDef => ({
  w, h,
  parts: fig.parts.map((pt) => ({...pt, prims: pt.prims.map((pr) => shiftPrim(pr, dx, dy))})),
  adjust: (fig.adjust ?? []).map((a) => ({...a, prims: a.prims.map((pr) => shiftPrim(pr, dx, dy))})),
  stamps: (fig.stamps ?? []).map((st) => ({...st, x: st.x + dx, y: st.y + dy})),
});

// ================================================================== 1 · TASYA (Macrosoft slate)
// Calm. Cropped grey at the sides, bald crown, thin rectangle glasses, a short salt-and-pepper beard; a navy
// blazer over an open collar. He holds up a GIANT brass key ring on a hooked finger and jangles it: two
// drawings, swapped on 2s. Key: monitor cyan from camera-left. Behind him: the four-pane window (slate).
const TY = 3; // head drop (a shorter neck)
const tasyaFig = (): FigureDef => {
  const H = (...pts: number[]) => shiftPrim(P.poly(...pts), 0, TY);
  const HL = (x0: number, y0: number, x1: number, y1: number) => shiftPrim(P.line(x0, y0, x1, y1), 0, TY);
  const parts: Part[] = [
    {group: 'torso', mat: 'blazer', tone: 2, prims: [P.poly(24, 136, 26, 112, 36, 103, 50, 98, 66, 99, 84, 101, 98, 108, 108, 118, 112, 128, 112, 136)]},
    {group: 'shirt', mat: 'shirt', tone: 2, prims: [P.poly(52, 97, 58, 100, 66, 101, 73, 99, 70, 108, 64, 113, 58, 107)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [H(53, 78, 54, 96, 62, 100, 71, 96, 73, 76)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [H(
      46, 30, 51, 23, 59, 19, 68, 18, 77, 21, 84, 28, 87, 38, 87, 50, 85, 60, 81, 70, 76, 78, 69, 84, 60, 87, 52, 86, 47, 82,
      44, 76, 43, 70, 41, 66, 42, 63, 40, 60, 38, 57, 40, 54, 41, 48, 42, 40)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [H(79, 47, 84, 44, 88, 47, 88, 55, 85, 62, 80, 63, 78, 56)]},
    // the raised far arm: sleeve from the bottom-left corner up to the fist
    // the raised far arm: forearm from the left edge up to the fist at the ring's upper left
    {group: 'sleeve', mat: 'blazer', tone: 2, prims: [P.poly(-10, 84, 0, 66, 9, 53, 21, 57, 17, 68, 8, 90, -10, 110)]},
    {group: 'cuff', mat: 'shirt', tone: 3, prims: [P.poly(9, 52, 13, 48, 22, 53, 19, 59)]},
  ];
  const adjust: Adjust[] = [
    // ---- face: cyan key from camera-left; the front of the face lit, the side toward the ear in mauve
    plane('skin', 3, H(46, 30, 51, 23, 59, 19, 66, 20, 62, 28, 61, 40, 63, 50, 62, 60, 60, 70, 57, 80, 52, 86, 47, 82, 44, 76, 43, 70, 41, 66, 42, 63, 40, 60, 38, 57, 40, 54, 41, 48, 42, 40)),
    plane('skin', 4, H(48, 28, 53, 22, 59, 20, 55, 27, 51, 33), H(39, 55, 41, 50, 43, 50, 42, 57, 39, 57), H(51, 52, 57, 51, 58, 57, 52, 58)),
    plane('skin', 5, HL(50, 25, 53, 23), HL(39, 56, 40, 56)),
    plane('skin', 1, H(72, 44, 78, 44, 80, 58, 78, 68, 72, 76, 66, 80, 68, 70, 72, 60)),
    // sockets under the brow, the nose's shadow side, under the nose, cheekbone, under the jaw on the neck
    plane('skin', 1, H(54, 43, 68, 41, 70, 45, 56, 46), H(43, 44, 49, 43, 49, 46, 44, 47)),
    plane('skin', 1, H(45, 49, 48, 48, 48, 57, 45, 60, 43, 58)),
    plane('skin', 1, H(40, 60, 46, 61, 47, 63, 42, 63)),
    plane('skin', 2, H(58, 56, 64, 54, 66, 60, 60, 62)),
    plane('skin', 1, P.poly(53, 89, 62, 88, 72, 83, 74, 84, 72, 92, 62, 95, 54, 94)),
    plane('skin', 0, P.poly(56, 89, 62, 88, 70, 84, 69, 88, 62, 91, 57, 91)),
    plane('skin', 3, P.poly(54, 94, 57, 94, 57, 99, 54, 98)),
    plane('skin', 1, H(81, 49, 85, 48, 86, 55, 83, 60, 81, 58)),
    plane('skin', 0, H(82, 52, 84, 52, 84, 56, 82, 56)),
    // ---- beard: short, salt-and-pepper, along the jaw and chin; moustache; the lit edge toward the key
    recolor('skin', 'beard', 2, H(45, 74, 50, 72, 55, 74, 60, 77, 66, 76, 72, 70, 77, 64, 80, 64, 78, 71, 72, 79, 64, 85, 56, 88, 50, 86, 46, 81)),
    recolor('skin', 'beard', 3, H(45, 74, 49, 73, 51, 76, 49, 82, 52, 86, 47, 82)),
    recolor('skin', 'beard', 2, H(41, 66, 46, 65, 52, 66, 54, 68, 48, 68, 42, 68)),
    recolor('skin', 'beard', 3, HL(42, 66, 46, 65)),
    // stubble texture: a few lit and dark pixels break the flat beard so it never reads as a mask
    {prims: [shiftPrim(P.map(46, 75, ['..#.....#.....#..', '#....#.....#.....', '...#....#.....#..', '.#.....#...#.....', '....#......#..#..', '..#...#..........']), 0, TY)], tone: 3, onlyMat: 'beard'},
    {prims: [shiftPrim(P.map(60, 76, ['.#...#..#', '...#....#', '#.....#..', '..#.#....', '#....#...']), 0, TY)], tone: 1, onlyMat: 'beard'},
    // ---- cropped sides and back: grey stubble with a stepped top edge (the crown stays bare)
    recolor('skin', 'hair', 2, H(72, 32, 79, 28, 85, 32, 87, 40, 87, 50, 84, 45, 79, 44, 75, 44, 73, 38)),
    recolor('skin', 'hair', 3, HL(79, 29, 84, 33)),
    {prims: [shiftPrim(P.map(68, 27, ['....#...#..', '..#...#...#', '#...#...#..', '.#.....#...']), 0, TY)], tone: 2, onlyMat: 'skin', mat: 'hair'},
    // ---- blazer: lapel toward the key, the near shoulder in shadow, the lapel edges
    plane('blazer', 3, P.poly(36, 103, 50, 98, 56, 108, 48, 118, 40, 112)),
    plane('blazer', 4, P.line(37, 103, 49, 99)),
    plane('blazer', 1, P.poly(74, 99, 84, 101, 98, 108, 108, 118, 112, 128, 112, 136, 90, 136, 80, 116, 72, 108)),
    plane('blazer', 0, P.line(58, 108, 62, 136), P.line(70, 108, 66, 136)),
    plane('shirt', 4, P.poly(52, 97, 58, 100, 57, 105, 53, 101)),
    plane('shirt', 1, P.poly(66, 101, 73, 99, 70, 108, 66, 105)),
    // ---- sleeve + fist
    plane('blazer', 3, P.poly(-10, 84, 0, 66, 9, 54, 12, 55, 5, 70, -10, 96)),
    plane('blazer', 1, P.poly(18, 60, 21, 57, 17, 68, 8, 90, -10, 110, -10, 102, 10, 76)),
  ];
  const E = TY;
  const stamps: Stamp[] = [
    // calm eyes: level, a touch hooded; the near eye inside the near lens, the far eye past the bridge
    {x: 55, y: 44 + E, rows: ['..LLLLLLL..', '.LwwIIgww..', '..kwIIwk...'], pal: {L: PAL.N0, w: PAL.K2, I: PAL.N0, g: PAL.C8, k: PAL.X1}},
    {x: 44, y: 45 + E, rows: ['.LL.', 'LIIw', '.kk.'], pal: {L: PAL.N0, w: PAL.K2, I: PAL.N0, k: PAL.X1}},
    // brows: short, level, low (calm)
    {x: 54, y: 40 + E, rows: ['..bbbbbbbbbb.', 'bbbbbbbbbbbbb'], pal: {b: PAL.B1}},
    {x: 43, y: 41 + E, rows: ['.bbbb', 'bbbb.'], pal: {b: PAL.B1}},
    // glasses: thin dark rectangles, the bridge, the temple arm back to the ear; one glint toward the key
    {x: 52, y: 42 + E, rows: [
      'fffffffffffffffff...........',
      'f...............fffffffffff.',
      'f.......c.......f...........',
      'f......c........f...........',
      '.fffffffffffffff............',
    ], pal: {f: PAL.N0, c: PAL.C8}},
    {x: 42, y: 42 + E, rows: ['fffffffffff', 'f.......f..', 'f.c.....f..', 'f.......f..', '.fffffff...'], pal: {f: PAL.N0, c: PAL.C7}},
    {x: 41, y: 60 + E, rows: ['.oo', 'o..'], pal: {o: PAL.S0}},
    // the calm closed smile: one corner lifts a pixel
    {x: 43, y: 69 + E, rows: ['........r', 'mmmmmmmm.', '.lllll...'], pal: {m: PAL.S0, l: PAL.X2, r: PAL.X1}},
  ];
  // the torso runs out of the bottom of the base window
  parts[0].prims = [P.poly(24, 150, 26, 112, 36, 103, 50, 98, 66, 99, 84, 101, 98, 108, 108, 118, 116, 128, 118, 150)];
  return {w: 112, h: 136, parts, adjust, stamps};
};

const TASYA_RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'cuff', 'beard', 'hair'],
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

// ---- the giant key ring. A key is a drawing (bow, shaft, bit); a lean is an integer row shear.
const KEY = [
  '..OOOO..',
  '.OhLLLO.',
  'OhL..LDO',
  'OL....DO',
  'OL....DO',
  'OLL..DDO',
  '.OLDDDO.',
  '..OLDO..',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LD...',
  '...LDLLO',
  '...LDLDO',
  '...LD...',
  '...LDLLO',
  '...LDDO.',
  '...LD...',
  '...OO...',
];
// [attach angle on the ring (deg, 90 = bottom), lean px per row] for the two jangle drawings
const JANGLE: Array<Array<[number, number]>> = [
  [[142, -0.5], [116, -0.26], [92, -0.05], [68, 0.16], [44, 0.38]],
  [[134, -0.3], [110, -0.1], [86, 0.12], [62, 0.32], [38, 0.52]],
];
// the fist that grips the ring's top: knuckles to camera, thumb over, fingertips curled under the band
const FIST = [
  '.....oooo.......',
  '....oLhLLo......',
  '...oLhLLllo.....',
  '..oLLLLllmmoo...',
  '.oLhhLLlLlmmmo..',
  'oLhLLLlLLllmmdo.',
  'oLLLmLLLmLLlmddo',
  'olLLmlLLmlLLmddo',
  'olllmlllmlllmddo',
  'olllmlllmlllmdo.',
  'oddlmdllmdlldmo.',
  '.oddoodddoddddo.',
  '..oo..ooo.oooo..',
];
const drawKeyRing = (b: Buf, clip: Clip, ox: number, oy: number, j: 0 | 1) => {
  const cx = ox + 30, cy = oy + 66; // ring centre: hangs from the fist at its upper left
  const brass = {O: PAL.W1, D: PAL.W3, L: PAL.W6, h: PAL.W8, m: PAL.W4};
  const rx = j ? 13 : 14, ry = j ? 14 : 13;
  // keys first (behind the ring's front arc): each hangs from the ring's lower half
  JANGLE[j].forEach(([deg, lean], i) => {
    const a = (deg * Math.PI) / 180;
    const ax = Math.round(cx + Math.cos(a) * rx), ay = Math.round(cy + Math.sin(a) * ry);
    KEY.forEach((row, r) => {
      const sx = Math.round(r * lean);
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        const col = (brass as Record<string, number>)[ch];
        if (col === undefined) continue;
        // alternate glint: one key's bow catches the key light, per drawing
        const cc = ch === 'h' && i !== (j ? 3 : 1) ? PAL.W5 : col;
        const X = ax - 4 + c + sx, Y = ay - 2 + r;
        if (clip(X, Y)) b.set(X, Y, cc);
      }
    });
  });
  // the ring: 3px brass band, lit on the upper left (toward the key), dark lower right
  for (let y = -16; y <= 16; y++)
    for (let x = -16; x <= 16; x++) {
      const d = Math.hypot(x / rx, y / ry);
      if (d < 0.8 || d > 1.06) continue;
      const lit = -x * 0.6 - y * 0.8;
      const c = d > 0.99 ? PAL.W2 : d < 0.86 ? PAL.W3 : lit > 8 ? PAL.W8 : lit > 0 ? PAL.W6 : lit > -8 ? PAL.W5 : PAL.W4;
      if (clip(cx + x, cy + y)) b.set(cx + x, cy + y, c);
    }
  // the fist grips the ring's upper-left arc
  stampBuf(b, clip, ox + 16, oy + 43, FIST, {o: PAL.S0, d: PAL.X1, m: PAL.X2, l: PAL.K2, L: PAL.K3, h: PAL.K4});
};

const bgTasya = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number) => {
  // slate room; the four-pane window behind him, upper right, lit cool; the mullions dark
  pool(b, clip, x0, y0, w, h, w * 0.8, h * 0.3, w * 0.9, h * 0.75, PAL.G0, [[1, PAL.N2], [0.7, PAL.G1], [0.42, PAL.G2]]);
  const wx = x0 + 70, wy = y0 + 8, ww = 58, wh = 62;
  for (let y = 0; y < wh; y++)
    for (let x = 0; x < ww; x++) {
      const inPane = x > 2 && y > 2 && x < ww - 1 && y < wh - 1 && Math.abs(x - 29) > 1 && Math.abs(y - 30) > 1;
      const bz = bayer(wx + x, wy + y);
      const u = (x + (wh - y) * 0.6) / (ww + wh * 0.6);
      const c = inPane ? (u > 0.62 ? PAL.G4 : u > 0.5 ? (bz < (u - 0.5) / 0.12 ? PAL.G4 : PAL.G3) : u > 0.3 ? PAL.G3 : bz < 0.5 ? PAL.G3 : PAL.G2) : PAL.G1;
      if (clip(wx + x, wy + y)) b.set(wx + x, wy + y, c);
    }
  rect(wx, wy + wh, ww, 2, ink(b, clip, PAL.G2));
  rect(wx, wy + wh + 2, ww, 1, ink(b, clip, PAL.N1));
};

export const drawTasya = (b: Buf, x: number, y: number, k: number) => {
  const [w, h] = RC_SIZE.tasya;
  const clip = clipTo(x, y, w, h);
  bgTasya(b, clip, x, y, w, h);
  // the jangle: A on k 0-1, B on 2-3, A 4-5, B 6+ (2-frame holds)
  const j = (Math.floor(k / 2) % 2) as 0 | 1;
  const img = memoFig('tasya', () => seam(renderFigure(place(tasyaFig(), FIG_DX, FIG_DY, w, h), TASYA_RIG), PAL.X2, PAL.K2, [-1, 0]));
  blitImg(b, img, x, y, {clip});
  drawKeyRing(b, clip, x + FIG_DX - 5, y + FIG_DY, j);
};

// ------------------------------------------------------------------ light gels (remaps, never blends)
const gelMap = (rampCols: number[], lo = 0.1, hi = 0.8) => (c: number) => {
  const L = lightness(c);
  const t = Math.max(0, Math.min(0.999, (L - lo) / (hi - lo)));
  return rampCols[Math.floor(t * rampCols.length)];
};
/** Remap the columns [x0, x1) of the window through `fn`; the band's edges are 3px ordered-dither seams. */
const bandRemap = (b: Buf, clip: Clip, wx: number, wy: number, w: number, h: number, x0: number, x1: number, fn: (c: number) => number) => {
  for (let y = wy; y < wy + h; y++)
    for (let x = Math.max(wx, wx + x0 - 3); x < Math.min(wx + w, wx + x1 + 3); x++) {
      if (!clip(x, y)) continue;
      const u = x - wx;
      const cov = u < x0 ? (u - (x0 - 3)) / 4 : u >= x1 ? (x1 + 3 - u) / 4 : 1;
      if (cov >= 1 || bayer(x, y) < cov) b.set(x, y, fn(b.get(x, y)));
    }
};

// ================================================================== 2 · RADNUS (Elgoog, muted multi-primary)
// Polite smile, neat dark side part, a navy crew-neck over a collar. Right above his head a CODE-RED beacon spins:
// its beam fans out of the dome, sweeps the room on 2s and turns what it crosses red (a gel remap): his face on
// k 2-5. Key: soft warm from camera-right (he faces right). The wall: four muted primary panels.
const radnusFig = (): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'sweater', tone: 2, prims: [P.poly(8, 150, 10, 128, 22, 118, 40, 112, 58, 110, 76, 112, 92, 116, 106, 124, 116, 134, 120, 150)]},
    {group: 'collar', mat: 'shirt', tone: 3, prims: [P.poly(56, 108, 64, 112, 72, 113, 82, 110, 86, 112, 80, 120, 72, 122, 62, 119, 54, 112)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [P.poly(60, 88, 60, 110, 70, 115, 82, 110, 84, 90)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [P.poly(
      58, 38, 68, 33, 78, 33, 86, 38, 90, 45, 92, 53, 93, 58, 92, 62, 96, 69, 97, 71, 94, 73, 93, 75, 94, 77, 93, 80, 93, 83, 91, 88,
      87, 94, 80, 99, 72, 100, 64, 96, 58, 90, 54, 82, 52, 72, 49, 62, 49, 50, 52, 43)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [P.poly(51, 64, 55, 60, 59, 62, 60, 70, 58, 78, 53, 79, 50, 72)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [P.poly(
      50, 58, 48, 48, 52, 40, 60, 34, 70, 31, 80, 31, 88, 36, 92, 43, 93, 50, 89, 46, 84, 44, 78, 44, 72, 45, 67, 47, 64, 52, 62, 58, 60, 64, 57, 62, 53, 60)]},
  ];
  const adjust: Adjust[] = [
    // ---- face: warm key from camera-right; the front planes lit, the cheek toward the ear in mid
    plane('skin', 3, P.poly(74, 45, 84, 44, 89, 46, 92, 53, 93, 58, 92, 62, 96, 69, 97, 71, 94, 73, 93, 75, 94, 77, 93, 80, 93, 83, 91, 88, 87, 94, 80, 99, 76, 98, 78, 88, 78, 78, 77, 68, 76, 58, 74, 50)),
    plane('skin', 4, P.poly(80, 46, 88, 47, 90, 52, 84, 52), P.poly(92, 63, 95, 68, 94, 70, 91, 68), P.poly(84, 72, 88, 71, 88, 75, 84, 76), P.poly(88, 88, 91, 86, 90, 90, 87, 92)),
    plane('skin', 5, P.line(94, 69, 95, 69), P.line(85, 47, 87, 47)),
    // the cheek lifts with the smile: a lit apple under the near eye, a soft fold beside the mouth
    plane('skin', 4, P.poly(76, 68, 82, 67, 83, 71, 78, 73)),
    plane('skin', 2, P.line(85, 76, 83, 82)),
    // shadows: under the brow, the far side of the nose, under the nose, under the lip, the jaw and neck
    plane('skin', 1, P.poly(72, 56, 86, 55, 86, 58, 74, 59), P.poly(89, 56, 92, 57, 91, 60, 89, 59)),
    plane('skin', 2, P.poly(88, 60, 91, 62, 91, 68, 88, 70)),
    plane('skin', 1, P.poly(90, 73, 95, 73, 94, 75, 90, 75), P.poly(86, 85, 92, 84, 91, 86, 87, 87)),
    plane('skin', 1, P.poly(52, 70, 58, 70, 62, 84, 68, 94, 64, 96, 58, 90, 54, 82)),
    plane('skin', 1, P.poly(62, 96, 72, 100, 80, 99, 84, 97, 84, 104, 72, 108, 62, 104)),
    plane('skin', 0, P.line(64, 98, 72, 101), P.line(73, 101, 82, 99)),
    plane('skin', 3, P.poly(80, 100, 84, 98, 84, 108, 80, 110)),
    plane('skin', 1, P.poly(53, 65, 57, 64, 58, 71, 56, 76, 53, 74)),
    plane('skin', 0, P.poly(54, 68, 56, 68, 56, 72, 54, 72)),
    // ---- hair: neat, side-parted; the lit mass toward the key, a clean part line, the temple fade
    plane('hair', 3, P.poly(66, 34, 80, 32, 88, 37, 92, 44, 86, 42, 78, 40, 70, 40)),
    plane('hair', 4, P.line(70, 35, 82, 34), P.line(84, 37, 90, 43)),
    plane('hair', 0, P.line(62, 36, 70, 34)),
    plane('hair', 1, P.poly(50, 58, 48, 48, 52, 42, 56, 44, 56, 56, 53, 60)),
    // ---- sweater: the lit chest toward the key, rib at the neckline, the far shoulder turns away
    plane('sweater', 3, P.poly(76, 114, 92, 116, 106, 124, 110, 132, 96, 134, 84, 126)),
    plane('sweater', 4, P.line(84, 114, 104, 123)),
    plane('sweater', 1, P.poly(8, 150, 10, 128, 22, 118, 36, 114, 30, 130, 26, 150)),
    plane('sweater', 1, P.line(52, 124, 56, 150), P.line(94, 136, 98, 150)),
    plane('shirt', 4, P.poly(76, 112, 82, 110, 86, 112, 80, 118)),
    plane('shirt', 1, P.poly(54, 112, 58, 110, 64, 116, 60, 118)),
  ];
  const stamps: Stamp[] = [
    // polite eyes: the lower lids lifted by the smile; the near eye left of the nose, the far eye right
    {x: 74, y: 59, rows: ['..LLLLLLL.', '.LwgIIwwL.', '..kkkkkk..'], pal: {L: PAL.N0, w: PAL.S4, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 89, y: 60, rows: ['LLL', 'wIL', 'kk.'], pal: {L: PAL.N0, w: PAL.S4, I: PAL.N0, k: PAL.S2}},
    {x: 72, y: 54, rows: ['...bbbbbbb.', '.bbbbbbbbbb', 'bb.........'], pal: {b: PAL.B0}},
    {x: 88, y: 55, rows: ['.bbb', 'bb..'], pal: {b: PAL.B0}},
    {x: 92, y: 72, rows: ['o.', '.o'], pal: {o: PAL.S1}},
    // the polite smile: closed lips, both corners up, the upper lip line soft
    {x: 81, y: 78, rows: ['r..........', '.mmmmmmmmr.', '..llllll...'], pal: {m: PAL.S1, l: PAL.S3, r: PAL.S2}},
  ];
  return {w: 124, h: 150, parts, adjust, stamps};
};
const RADNUS_RIG: LightRig = {
  key: [0.95, -0.3], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['shirt', 'collar'],
  back: [-1, -0.2], backBand: 1,
  backRamp: {skin: PAL.S3, hair: PAL.N5, sweater: PAL.N5},
  ramps: {
    skin: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.N7],
    sweater: [PAL.N0, PAL.N2, PAL.N4, PAL.N5, PAL.N6, PAL.N8],
    shirt: [PAL.N1, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  },
};
// the gel tops out at the hottest red: a white collar under a red lamp is red, never yellow
const RED_GEL = gelMap([PAL.N0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3], 0.1, 0.72);
/**
 * The beacon sits on a wall bracket right above his head. Its beam is a fan from the dome (apex fixed at
 * the lamp), swept left to right across the room in 4 holds on 2s; SWEEP is where the fan's axis meets the
 * bottom of the window. Hold 0 rakes the left wall, 1 the back of his head, 2 his face, 3 his profile.
 */
const BEACON = {x: 54, y: 5} as const; // dome top-left in window px (the dome is 20 x 11)
const BEAM_APEX = {x: BEACON.x + 10, y: BEACON.y + 9} as const;
const SWEEP = [-8, 36, 92, 140];
const bgRadnus = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number) => {
  pool(b, clip, x0, y0, w, h, w * 0.75, h * 0.35, w * 0.8, h * 0.7, PAL.N2, [[1, PAL.N3], [0.62, PAL.N4]]);
  // (the campus wall's four primary tiles are cut: in sequence they were a real brand's four hues, guardrails §5)
  const cols: number[] = [];
  const lit: number[] = [];
  for (let i = 0; i < cols.length; i++) {
    const px = x0 + 4 + i * 11, py = y0 + 30;
    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 10; x++) {
        if ((x === 0 || x === 9) && (y === 0 || y === 9)) continue;
        const c = y === 0 && x > 0 && x < 9 ? lit[i] : x === 9 || y === 9 ? PAL.N2 : cols[i];
        if (clip(px + x, py + y)) b.set(px + x, py + y, c);
      }
  }
};
// the beacon: a red glass dome with a turning reflector inside (4 drawings: its hot face turns left to right)
const DOME = [
  '......RRRRRRRR......',
  '....RRrrrrrrrrRR....',
  '...Rrrrrrrrrrrrrrr..',
  '..Rrrrrrrrrrrrrrrrr.',
  '.Rrrrrrrrrrrrrrrrrrr',
  '.Rrrrrrrrrrrrrrrrrrr',
  'Rrrrrrrrrrrrrrrrrrrr',
  'Rrrrrrrrrrrrrrrrrrrr',
  'Rrrrrrrrrrrrrrrrrrrr',
  'Rrrrrrrrrrrrrrrrrrrr',
  'RRRRRRRRRRRRRRRRRRRR',
];
// [centre x, half width] of the hot lamp face per hold: it turns with the beam; widest when it faces us
const REFLECT: Array<[number, number]> = [[4, 2], [8, 3], [12, 3], [16, 2]];
const drawBeacon = (b: Buf, clip: Clip, x: number, y: number, ph: number) => {
  // the wall bracket under the base: a short steel gusset with its shadow on the wall
  stampBuf(b, clip, x + 5, y + 14, [
    '.GGGGGGGGGG.',
    '..gGGGGGGgn.',
    '...gGGGGgnn.',
    '....gGGgnn..',
    '.....ggnn...',
    '......nn....',
  ], {G: PAL.G2, g: PAL.G1, n: PAL.N2});
  DOME.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '.') continue;
      let c = ch === 'R' ? PAL.R0 : PAL.R1;
      const [rc, hw] = REFLECT[ph];
      if (ch === 'r') {
        const d = Math.abs(i - rc);
        if (d <= hw && j >= 3 && j <= 8) c = d <= 1 && j >= 4 && j <= 7 ? PAL.W8 : PAL.R3;
        else if (d <= hw + 2 && j >= 2 && j <= 9) c = PAL.R2;
      }
      if (ch === 'r' && j === 2 && i >= 5 && i <= 8) c = PAL.R3; // the glass's own highlight
      if (clip(x + i, y + j)) b.set(x + i, y + j, c);
    }
  });
  stampBuf(b, clip, x - 1, y + 11, ['GGGGGGGGGGGGGGGGGGGGGG', 'gggggggggggggggggggggg', '.nnnnnnnnnnnnnnnnnnnn.'], {G: PAL.G3, g: PAL.G1, n: PAL.N0});
};

const RED_WALL = gelMap([PAL.N0, PAL.R0, PAL.R0, PAL.R1, PAL.R1], 0.1, 0.6);
export const drawRadnus = (b: Buf, x: number, y: number, k: number) => {
  const [w, h] = RC_SIZE.radnus;
  const clip = clipTo(x, y, w, h);
  bgRadnus(b, clip, x, y, w, h);
  const img = memoFig('radnus', () => seam(renderFigure(radnusFig(), RADNUS_RIG), PAL.S2, PAL.S3, [1, 0]));
  blitImg(b, img, x, y, {clip});
  const hold = Math.min(3, Math.floor(k / 2));
  // (the beam fan is cut: the siren's red stays INSIDE the sprite, SCRIPT §3.7 — his face stays in its own key,
  // the polite smile legible; only the lamp's small glow ring touches the wall round the dome)
  const bx = SWEEP[hold];
  const onFig = (px: number, py: number) => img.c[(py - y) * img.w + (px - x)] >= 0;
  for (let yy = BEAM_APEX.y; yy < (BEAM_APEX.y - 1); yy++) {
    const t = (yy - BEAM_APEX.y) / (h - BEAM_APEX.y);
    const cx = BEAM_APEX.x + (bx - BEAM_APEX.x) * t;
    const hw = 2 + (yy - BEAM_APEX.y) * 0.16;
    for (let xx = 0; xx < w; xx++) {
      const X = x + xx, Y = y + yy;
      const u = Math.abs(xx - cx);
      const cov = u <= hw ? 1 : u <= hw + 4 ? (hw + 4 - u) / 5 : 0;
      if (cov <= 0 || !(cov >= 1 || bayer(X, Y) < cov)) continue;
      b.set(X, Y, onFig(X, Y) ? RED_GEL(b.get(X, Y)) : RED_WALL(b.get(X, Y)));
    }
  }
  // the lamp's own glow on the wall round the dome (a dim, dithered ring; the dome is drawn over it)
  for (let yy = BEAM_APEX.y - 14; yy <= BEAM_APEX.y + 8; yy++)
    for (let xx = BEAM_APEX.x - 18; xx <= BEAM_APEX.x + 18; xx++) {
      const X = x + xx, Y = y + yy;
      if (!clip(X, Y) || onFig(X, Y)) continue;
      const d = Math.hypot((xx - BEAM_APEX.x) / 16, (yy - BEAM_APEX.y + 3) / 11);
      if (d < 1 && bayer(X, Y) < (1 - d) * 1.4) b.set(X, Y, RED_WALL(b.get(X, Y)));
    }
  drawBeacon(b, clip, x + BEACON.x, y + BEACON.y, hold);
};

// ================================================================== 3 · KRAM (Atem violet)
// Tight short curls, wide unblinking eyes, an eager closed half-smile; black tee, a gold chain. He offers a
// soup thermos toward camera; a signed check floats in the soup and bobs on 2s. Violet room, a cool
// violet-white key from camera-left, a violet rim.
const U = {U0: 0x1d1a36, U1: 0x2e2244, U2: 0x46294f, U3: 0x6a3155}; // castrivals' dusk violets (CX.U*, bosses.ts)
const KRAM_CURLS: Array<[number, number, number]> = [
  [52, 40, 5], [58, 35, 5.5], [65, 32, 5.5], [72, 32, 5.5], [79, 34, 5], [84, 39, 4.5], [49, 47, 4.5], [55, 42, 4.5], [62, 38, 4.5],
  [69, 37, 4.5], [76, 38, 4.5], [82, 44, 4], [47, 54, 4], [86, 47, 3.5], [60, 30, 4], [69, 28, 4], [77, 29, 4],
  [87, 53, 3.2], [45, 47, 3.5], [83, 50, 3.5],
];
const kramFig = (): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'tee', tone: 2, prims: [P.poly(2, 150, 4, 128, 16, 118, 34, 111, 52, 109, 70, 110, 88, 114, 102, 122, 112, 134, 116, 150)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [P.poly(52, 86, 53, 108, 64, 114, 76, 108, 76, 86)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [P.poly(
      50, 44, 56, 36, 64, 33, 74, 33, 82, 37, 87, 44, 89, 54, 88, 64, 85, 72, 81, 80, 75, 87, 66, 91, 58, 90, 52, 87, 48, 82,
      46, 78, 45, 74, 43, 70, 44, 67, 42, 64, 40, 61, 42, 58, 43, 52, 46, 47)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [P.poly(80, 56, 85, 53, 89, 56, 89, 64, 86, 70, 81, 71, 79, 64)]},
    {group: 'hair', mat: 'hair', tone: 1, prims: KRAM_CURLS.map(([cx, cy, r]) => P.ell(cx, cy, r, r * 0.92))},
    // the offering arm: forearm from the bottom-left, the hand wrapped round the thermos
    {group: 'arm', mat: 'skin', tone: 2, prims: [P.poly(0, 150, 0, 130, 10, 118, 22, 112, 30, 118, 22, 132, 12, 150)]},
  ];
  const adjust: Adjust[] = [
    // curls: a lit C-stroke toward the key (upper left) and a dark separating arc under each clump
    ...KRAM_CURLS.flatMap(([cx, cy, r], i): Adjust[] => {
      const a = -2.3 + (((i * 37) % 11) / 11 - 0.5) * 0.8;
      const arc = (from: number, to: number, rr: number, n = 4) => Array.from({length: n}, (_, q) => {
        const t = a + from + ((to - from) * q) / (n - 1);
        return [cx + Math.cos(t) * rr, cy + Math.sin(t) * rr] as const;
      });
      const out: Adjust[] = [];
      const dk = arc(1.9, 3.9, r * 0.9);
      for (let q = 0; q < dk.length - 1; q++) out.push(plane('hair', 0, P.line(dk[q][0], dk[q][1], dk[q + 1][0], dk[q + 1][1])));
      const lt = arc(-1.0, 0.9, r * 0.5);
      for (let q = 0; q < lt.length - 1; q++) out.push(plane('hair', q === 1 ? 4 : 3, P.line(lt[q][0], lt[q][1], lt[q + 1][0], lt[q + 1][1])));
      return out;
    }),
    // ---- face: key from camera-left; the front of the face lit, the side toward the ear in mauve
    plane('skin', 3, P.poly(50, 44, 58, 40, 64, 42, 62, 50, 62, 60, 64, 70, 63, 78, 60, 86, 58, 90, 52, 87, 48, 82, 46, 78, 45, 74, 43, 70, 44, 67, 42, 64, 40, 61, 42, 58, 43, 52, 46, 47)),
    plane('skin', 4, P.poly(46, 48, 52, 45, 50, 52, 45, 54), P.poly(41, 60, 43, 57, 45, 58, 44, 63, 41, 63), P.poly(52, 64, 58, 63, 59, 68, 53, 69), P.poly(48, 80, 52, 79, 53, 84, 49, 84)),
    plane('skin', 5, P.line(41, 61, 42, 61), P.line(47, 50, 48, 49)),
    plane('skin', 1, P.poly(72, 56, 80, 56, 82, 66, 80, 74, 74, 82, 68, 88, 70, 78, 73, 68)),
    plane('skin', 1, P.poly(52, 54, 68, 53, 70, 56, 54, 57), P.poly(44, 55, 49, 54, 49, 57, 45, 58)),
    plane('skin', 1, P.poly(46, 58, 49, 58, 49, 66, 46, 68, 44, 66)),
    plane('skin', 1, P.poly(42, 67, 47, 68, 48, 70, 43, 70), P.poly(46, 77, 53, 77, 52, 79, 47, 79)),
    plane('skin', 1, P.poly(55, 91, 66, 91, 75, 87, 76, 94, 66, 100, 56, 98)),
    plane('skin', 0, P.line(57, 92, 66, 92), P.line(67, 91, 74, 88)),
    plane('skin', 3, P.poly(54, 100, 58, 101, 58, 108, 55, 107)),
    plane('skin', 1, P.poly(82, 58, 86, 57, 87, 64, 84, 68, 82, 66)),
    plane('skin', 0, P.poly(83, 61, 85, 61, 85, 65, 83, 65)),
    // ---- tee: the lit chest toward the key, the far side falls away
    plane('tee', 3, P.poly(16, 118, 34, 111, 50, 110, 44, 122, 28, 128)),
    plane('tee', 1, P.poly(78, 112, 88, 114, 102, 122, 112, 134, 116, 150, 94, 150, 86, 128)),
    plane('tee', 0, P.line(64, 118, 66, 150)),
    // ---- arm
    plane('skin', 3, P.poly(0, 130, 10, 118, 16, 115, 8, 128, 2, 140)),
    plane('skin', 1, P.poly(22, 124, 30, 118, 22, 132, 14, 150, 10, 150)),
  ];
  const stamps: Stamp[] = [
    // wide, unblinking eyes (the white shows all round the iris), the far eye past the bridge
    // (the whites are paper-bright so the stare reads at a glance; skin-toned whites read as a squint)
    {x: 53, y: 56, rows: ['..LLLLLLL..', '.LwWIIIWwL.', '.LwWIgIWwL.', '..kwwwwwk..'], pal: {L: PAL.N0, w: PAL.P0, W: PAL.P1, I: PAL.N0, g: PAL.W8, k: PAL.X1}},
    {x: 43, y: 57, rows: ['.LLL', 'LwIw', 'LwIL', '.kk.'], pal: {L: PAL.N0, w: PAL.P0, I: PAL.N0, k: PAL.X1}},
    {x: 52, y: 52, rows: ['..bbbbbbbbb..', 'bbbbbbbbbbbbb'], pal: {b: PAL.B1}},
    {x: 42, y: 53, rows: ['.bbbb', 'bbbb.'], pal: {b: PAL.B1}},
    {x: 42, y: 67, rows: ['.oo', 'o..'], pal: {o: PAL.S1}},
    // the eager half-smile: closed, the near corner pulled up two pixels (keen to be liked)
    {x: 44, y: 72, rows: ['.........r', 'r.......r.', '.mmmmmmm..', '..lllll...'], pal: {m: PAL.S1, l: PAL.X3, r: PAL.X2}},
  ];
  return {w: 124, h: 150, parts, adjust, stamps};
};
const KRAM_RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true,
  back: [1, -0.1], backBand: 1,
  backRamp: {skin: PAL.N8, hair: PAL.N6, tee: U.U3},
  ramps: {
    skin: [PAL.S0, PAL.X1, PAL.X2, PAL.S4, PAL.S5, PAL.S6],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.N7],
    tee: [PAL.N0, PAL.N0, PAL.N1, U.U1, U.U2, PAL.N7],
  },
};
// the gold chain: links in 3 tones laid along the collarbone curve
const drawChain = (b: Buf, clip: Clip, x: number, y: number) => {
  for (let i = 0; i <= 36; i++) {
    const t = i / 36;
    const cx = Math.round(x + 44 + t * 36), cy = Math.round(y + 110 + Math.sin(t * Math.PI) * 9);
    const c = i % 3 === 0 ? PAL.W8 : i % 3 === 1 ? PAL.W6 : PAL.W4;
    if (clip(cx, cy)) b.set(cx, cy, c);
    if (i % 2 === 0 && clip(cx, cy + 1)) b.set(cx, cy + 1, PAL.W2);
  }
};
// the thermos (brushed steel), its open mouth, the soup, the check, the steam; the hand wraps round it
const drawThermos = (b: Buf, clip: Clip, x: number, y: number, k: number) => {
  const lift = k === 0 ? 3 : k === 1 ? 1 : 0; // the offer: it rises toward us, then holds
  const bob = k >= 2 && Math.floor(k / 2) % 2 === 1 ? -1 : 0;
  const tx = x + 14, ty = y + 88 + lift;
  const steel = [PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P1];
  // body: a vertical cylinder, lit toward camera-left
  for (let yy = 0; yy < 46; yy++)
    for (let xx = 0; xx < 22; xx++) {
      const u = xx / 21;
      let t = u < 0.12 ? 4 : u < 0.28 ? 6 : u < 0.36 ? 7 : u < 0.55 ? 5 : u < 0.8 ? 3 : u < 0.93 ? 2 : 1;
      if (yy === 0 || yy === 45) t = Math.max(1, t - 2);
      if (yy >= 30 && yy < 33) t = Math.max(1, t - 2); // the grip band
      if (clip(tx + xx, ty + yy)) b.set(tx + xx, ty + yy, steel[t]);
    }
  // the open mouth: rim, the dark inside, soup, and the check standing up in it
  stampBuf(b, clip, tx - 1, ty - 4, [
    '..PPPPPPPPPPPPPPPPPP..',
    '.PGGGGGGGGGGGGGGGGGGP.',
    'PGssssssssssssssssssGP',
    '.PGssssssssssssssssGP.',
  ], {P: PAL.G6, G: PAL.G3, s: PAL.W4});
  // the check: a long slip standing tilted in the soup (a bank check's proportions: amount box, the
  // signature line, a green "$"), wet at the bottom; it bobs a pixel on 2s
  stampBuf(b, clip, tx - 2, ty - 16 + bob, [
    '....................pp',
    '................ppppPp',
    '............ppppPPPPPp',
    '........ppppPPPPPPPPpp',
    '....ppppPPPPPPPPPPPPp.',
    'ppppPPPPPPPggPPPPPPPp.',
    'pPPPPPPPPPgPPPgPPPPp..',
    'pPPPPPPPPPPggPPPPPPp..',
    'pPPPllPPPPPPPgPPPPp...',
    '.pPPPPlllPPPggPPPPp...',
    '.pPPPPPPPlllPPPPPp....',
    '..pPPPPPPPPPPPPPPp....',
    '..wwwwwwwwwwwwwwww....',
  ], {p: PAL.P0, P: PAL.P2, g: PAL.L2, l: PAL.N5, w: PAL.W5});
  // steam: two wisps, alternating on 2s
  const wisp = Math.floor(k / 2) % 2 === 0
    ? ['....c...', '...c....', '...c....', '....c...', '.....c..']
    : ['...c....', '....c...', '....c...', '...c....', '..c.....'];
  stampBuf(b, clip, tx + 16, ty - 24 + bob, wisp, {c: PAL.N6});
  // the hand: palm on the far (left) side, four fingers wrapped across the front (backs toward us, tips
  // toward the right), the thumb up along the left edge
  stampBuf(b, clip, tx - 5, ty + 14, [
    '.oo.............',
    'oLLo............',
    'oLhlo...........',
    'oLLlo...........',
    'oLLlooooooooo...',
    'oLLlLLLLLhLLLlo.',
    'oLllmllllllllmo.',
    'oddoooooooooooo.',
    'oLLLLLLLhLLLLlo.',
    'oLlllllllllllmo.',
    'oddooooooooooo..',
    'oLLLLLLhLLLLlo..',
    'oLllllllllllmo..',
    'oddoooooooooo...',
    'oLLLLLhLLLLlo...',
    'oLllllllllmo....',
    '.odddddddoo.....',
  ], {o: PAL.S0, d: PAL.X1, m: PAL.X2, l: PAL.S4, L: PAL.S5, h: PAL.S6});
};
const bgKram = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number) => {
  pool(b, clip, x0, y0, w, h, w * 0.3, h * 0.3, w * 0.9, h * 0.8, U.U0, [[1, U.U1], [0.6, U.U2]]);
  // a tall window of violet dusk behind his far shoulder: two panes, a mullion, a sill
  for (let yy = 0; yy < 64; yy++) for (let xx = 0; xx < 24; xx++) {
    const X = x0 + 98 + xx, Y = y0 + 16 + yy;
    const frame = xx < 2 || xx === 12 || yy < 2;
    const c = frame ? U.U0 : yy < 22 ? U.U3 : yy < 40 ? (bayer(X, Y) < 0.5 ? U.U3 : U.U2) : U.U2;
    if (clip(X, Y)) b.set(X, Y, c);
  }
  rect(x0 + 96, y0 + 80, 28, 2, ink(b, clip, U.U0));
};
export const drawKram = (b: Buf, x: number, y: number, k: number) => {
  const [w, h] = RC_SIZE.kram;
  const clip = clipTo(x, y, w, h);
  bgKram(b, clip, x, y, w, h);
  const img = memoFig('kram', () => seam(renderFigure(kramFig(), KRAM_RIG), PAL.X2, PAL.S4, [-1, 0]));
  blitImg(b, img, x, y, {clip});
  drawChain(b, clip, x, y);
  drawThermos(b, clip, x, y, k);
};

// ================================================================== 4 · NESNEJ (Invidia green)
// Full silver hair swept back, a big grin, the black leather jacket with its hard specular streak. He
// tosses a GPU up out of his far hand: it spins as 2 held drawings (face-on, edge-on), climbing on 2s.
// Key: warm white from camera-left; the green room behind gives a green back rim.
const nesnejFig = (open: boolean): FigureDef => {
  const parts: Part[] = [
    {group: 'jacket', mat: 'leather', tone: 2, prims: [P.poly(0, 150, 2, 128, 14, 118, 32, 111, 50, 108, 66, 110, 84, 114, 98, 122, 108, 134, 112, 150)]},
    {group: 'tee', mat: 'tee', tone: 2, prims: [P.poly(44, 108, 52, 112, 60, 114, 68, 111, 64, 128, 56, 136, 48, 124)]},
    {group: 'neck', mat: 'skin', tone: 1, prims: [P.poly(46, 88, 46, 108, 56, 114, 66, 108, 68, 88)]},
    {group: 'head', mat: 'skin', tone: 2, prims: [P.poly(
      40, 44, 48, 38, 58, 36, 68, 38, 75, 44, 78, 52, 79, 58, 78, 62, 82, 69, 83, 71, 80, 73, 79, 75, 80, 77, 80, 82, 79, 86, 76, 92,
      70, 97, 62, 99, 54, 97, 48, 92, 44, 84, 42, 74, 39, 64, 38, 54)]},
    {group: 'ear', mat: 'skin', tone: 2, prims: [P.poly(40, 64, 44, 60, 48, 62, 49, 70, 47, 78, 42, 79, 39, 72)]},
    // the silver mane: full, swept straight back from a high front, over the ears
    {group: 'hair', mat: 'silver', tone: 3, prims: [P.poly(
      36, 66, 33, 56, 34, 46, 40, 36, 50, 29, 62, 27, 72, 29, 79, 35, 82, 42, 81, 48, 76, 45, 70, 44, 64, 45, 58, 47, 52, 52, 49, 58, 47, 64, 42, 62, 39, 68)]},
    // the tossing arm: raised on the far side (camera-right), the hand open after the release
    {group: 'arm', mat: 'leather', tone: 2, prims: [P.poly(92, 124, 100, 104, 106, 88, 116, 88, 114, 104, 110, 126)]},
    {group: 'hand', mat: 'skin', tone: 2, prims: [open
      ? P.poly(104, 90, 104, 80, 106, 72, 109, 72, 110, 80, 112, 70, 115, 70, 115, 80, 118, 74, 120, 76, 117, 88, 110, 92)
      : P.poly(103, 90, 103, 80, 108, 76, 116, 76, 119, 82, 117, 90, 110, 92)]},
  ];
  const adjust: Adjust[] = [
    // ---- face: warm key from camera-left, the cheek toward the ear in shadow
    plane('skin', 3, P.poly(56, 46, 64, 45, 72, 47, 76, 50, 78, 56, 79, 58, 78, 62, 82, 69, 83, 71, 80, 73, 79, 75, 80, 77, 80, 82, 79, 86, 76, 92, 70, 97, 62, 99, 60, 90, 62, 80, 62, 70, 60, 60, 57, 52)),
    plane('skin', 4, P.poly(64, 47, 72, 48, 74, 53, 66, 52), P.poly(78, 63, 81, 68, 80, 70, 77, 68), P.poly(66, 68, 72, 67, 72, 71, 67, 72)),
    plane('skin', 5, P.line(80, 69, 81, 69), P.line(67, 48, 70, 48)),
    // the grin lifts both cheeks: two lit apples and the deep folds beside the mouth
    plane('skin', 4, P.poly(60, 70, 65, 70, 65, 74, 61, 75)),
    plane('skin', 1, P.line(70, 74, 67, 82), P.line(79, 78, 80, 83)),
    plane('skin', 1, P.poly(58, 56, 72, 55, 73, 58, 60, 59), P.poly(75, 56, 78, 57, 77, 60, 75, 59)),
    plane('skin', 2, P.poly(74, 60, 77, 62, 77, 68, 74, 70)),
    plane('skin', 1, P.poly(76, 73, 81, 73, 80, 75, 76, 75)),
    plane('skin', 1, P.poly(42, 68, 48, 68, 52, 82, 58, 94, 54, 97, 48, 92, 44, 84)),
    plane('skin', 1, P.poly(50, 96, 62, 99, 70, 97, 74, 95, 74, 102, 62, 106, 50, 102)),
    plane('skin', 0, P.line(52, 97, 62, 100), P.line(63, 100, 72, 97)),
    plane('skin', 3, P.poly(66, 102, 70, 100, 70, 108, 66, 110)),
    plane('skin', 1, P.poly(42, 65, 46, 64, 47, 71, 45, 76, 42, 74)),
    // ---- silver hair: the swept strands run back; hot highlights on the crown, dark roots at the nape
    plane('silver', 4, P.poly(46, 34, 58, 29, 70, 30, 76, 36, 68, 34, 58, 34, 50, 38)),
    plane('silver', 5, P.line(52, 32, 62, 29), P.line(64, 30, 72, 32)),
    plane('silver', 2, P.line(44, 40, 56, 36), P.line(42, 46, 56, 41), P.line(40, 52, 52, 47), P.line(58, 38, 72, 38), P.line(60, 42, 76, 42)),
    plane('silver', 1, P.poly(36, 66, 33, 56, 35, 50, 40, 52, 42, 62, 39, 68)),
    // ---- jacket: the hard specular streak along the near shoulder and lapel (leather), the lapel edge
    plane('leather', 1, P.poly(0, 150, 2, 128, 14, 118, 32, 111, 44, 109, 48, 124, 40, 150)),
    // the specular streak: a long, thin, hard highlight riding the shoulder's curve (white core, grey skirt)
    plane('leather', 3, P.poly(4, 132, 10, 124, 20, 117, 32, 113, 40, 112, 40, 114, 32, 115, 21, 120, 11, 127, 6, 134)),
    plane('leather', 4, P.poly(6, 130, 12, 123, 21, 118, 32, 114, 38, 113, 32, 116, 21, 121, 12, 127, 7, 132)),
    plane('leather', 5, P.line(8, 128, 13, 123), P.line(14, 122, 22, 118), P.line(23, 117, 34, 114)),
    plane('leather', 4, P.line(41, 112, 47, 126)),
    plane('leather', 3, P.poly(68, 111, 84, 114, 98, 122, 94, 126, 78, 120, 70, 118)),
    plane('leather', 0, P.line(44, 110, 52, 136), P.line(68, 112, 62, 136)),
    plane('tee', 3, P.poly(48, 112, 56, 114, 54, 120, 50, 118)),
    // ---- arm + hand
    plane('leather', 3, P.poly(100, 104, 106, 88, 109, 88, 104, 106, 96, 124, 94, 124)),
    plane('leather', 4, P.line(103, 100, 107, 90)),
    plane('skin', 3, open ? P.poly(104, 88, 104, 80, 106, 72, 108, 72, 108, 86) : P.poly(103, 86, 103, 80, 108, 77, 112, 77, 106, 82)),
    plane('skin', 1, open ? P.poly(112, 86, 117, 80, 117, 88, 110, 92) : P.poly(112, 86, 118, 83, 117, 90, 110, 92)),
  ];
  const stamps: Stamp[] = [
    // grinning eyes: crinkled, the lower lids pushed up
    {x: 60, y: 59, rows: ['..LLLLLLL..', '.LwwIIgwwL.', '..kkkkkkk..', '....kk.....'], pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, g: PAL.W8, k: PAL.S2}},
    {x: 75, y: 60, rows: ['LLL', 'wIL', '.k.'], pal: {L: PAL.N0, w: PAL.S5, I: PAL.N0, k: PAL.S2}},
    {x: 58, y: 54, rows: ['.bbbbbbbbbb.', 'bbbbbbbbbbbb'], pal: {b: PAL.G3}},
    {x: 74, y: 55, rows: ['bbb.', '.bbb'], pal: {b: PAL.G3}},
    {x: 78, y: 72, rows: ['o.', '.o'], pal: {o: PAL.S1}},
    // the big grin: open, teeth showing, the corners deep
    {x: 64, y: 77, rows: ['m.........m.', '.mmmmmmmmmm.', '.mTTTTTTTTm.', '..mttttttm..', '...mmmmmm...', '....llll....'], pal: {m: PAL.S0, T: PAL.P2, t: PAL.P0, l: PAL.S3}},
  ];
  return {w: 124, h: 150, parts, adjust, stamps};
};
const NESNEJ_RIG: LightRig = {
  key: [-0.95, -0.35], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['tee'],
  back: [1, -0.1], backBand: 2,
  backRamp: {skin: PAL.L2, silver: PAL.L3, leather: PAL.L2},
  ramps: {
    skin: [PAL.S0, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    silver: [PAL.N0, PAL.G2, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
    leather: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.G5, PAL.W9],
    tee: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4],
  },
};
// the GPU: two held drawings. A face-on (shroud, two fans, the green edge), B edge-on (bracket + fin stack)
const GPU_A = [
  '..ssssssssssssssssssssssssssssssssss..',
  '.sSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSB.',
  'sSSSSkkkkkkkSSSSSSSSSSSSSSkkkkkkkSSSSB',
  'sSSSkkfffffkkSSSSSSSSSSSSkkfffffkkSSSB',
  'sSSkkfffhfffkkSSSSSSSSSSkkfffhfffkkSSB',
  'sSSkffhhHhhffkSSSSGGSSSSkffhhHhhffkSSB',
  'sSSkfhHkkkHhfkSSSSSSSSSSkfhHkkkHhfkSSB',
  'sSSkffhhHhhffkSSSSSSSSSSkffhhHhhffkSSB',
  'sSSkkfffhfffkkSSSSSSSSSSkkfffhfffkkSSB',
  'sSSSkkfffffkkSSSSSSSSSSSSkkfffffkkSSSB',
  'sSSSSkkkkkkkSSSSSSSSSSSSSSkkkkkkkSSSSB',
  'sSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSB',
  'sggggggggggggggggggggggggggggggggggggB',
  '.nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn.',
  '....yyyyyyyyyyyyyy....................',
];
const GPU_B = [
  'ss....................................',
  'sBSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSB.',
  'sBhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhB.',
  'sBggggggggggggggggggggggggggggggggggB.',
  'sBnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnB.',
  'ss....................................',
];
const drawGpu = (b: Buf, clip: Clip, x: number, y: number, drawing: 0 | 1) =>
  stampBuf(b, clip, x, y, drawing ? GPU_B : GPU_A, {B: PAL.G2, s: PAL.G6, S: PAL.G4, k: PAL.N1, f: PAL.G3, h: PAL.G5, H: PAL.P2, G: PAL.L3, g: PAL.L3, n: PAL.N0, y: PAL.W6});
const bgNesnej = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number) => {
  pool(b, clip, x0, y0, w, h, w * 0.78, h * 0.3, w * 0.8, h * 0.75, PAL.N1, [[1, PAL.L0], [0.62, PAL.L1]]);
  // a die-shot grid glowing faintly in the green: blocks and bus lines, low contrast
  for (let yy = 4; yy < 90; yy++)
    for (let xx = 50; xx < w; xx++) {
      const X = x0 + xx, Y = y0 + yy;
      if (!clip(X, Y)) continue;
      const bus = (xx % 16 === 0 && yy > 8) || (yy % 14 === 0 && xx > 54);
      const blk = (Math.floor(xx / 16) + Math.floor(yy / 14)) % 3 === 0 && xx % 16 > 3 && xx % 16 < 13 && yy % 14 > 3 && yy % 14 < 11;
      if (bus && b.get(X, Y) === PAL.L1) b.set(X, Y, PAL.L2);
      else if (bus) b.set(X, Y, PAL.L1);
      else if (blk && bayer(X, Y) < 0.5) b.set(X, Y, b.get(X, Y) === PAL.L1 ? PAL.L2 : PAL.L1);
    }
};
export const drawNesnej = (b: Buf, x: number, y: number, k: number) => {
  const [w, h] = RC_SIZE.nesnej;
  const clip = clipTo(x, y, w, h);
  bgNesnej(b, clip, x, y, w, h);
  const open = k >= 2;
  const img = memoFig('nesnej' + open, () => seam(renderFigure(nesnejFig(open), NESNEJ_RIG), PAL.S3, PAL.S4, [1, 0]));
  blitImg(b, img, x, y, {clip});
  // the toss on 2s: in the hand, then up and spinning (A, B, A)
  const hold = Math.min(3, Math.floor(k / 2));
  const pos: Array<[number, number, 0 | 1]> = [[86, 64, 0], [84, 40, 1], [82, 18, 0], [82, 9, 1]];
  const [gx, gy, d] = pos[hold];
  drawGpu(b, clip, x + gx, y + gy, d);
};

// ================================================================== 5 · RIMA TAMURI (Machines Thinking, warm white)
// The leap begins: a tighter crop, black around her. She steps into a spotlight: k0 she is a shape in the
// dark a few px off her mark; k1 the cone SNAPS on (warm white from above) and she lands on it. Top light:
// hot forehead, nose ridge, cheekbones and shoulders; a soft crease under the brow, a hard shadow under the chin.
const rimaFig = (): FigureDef => {
  const parts: Part[] = [
    // hair behind the head: falls from the crown to the shoulders, the ends turning out
    {group: 'hairback', mat: 'hair', tone: 2, prims: [P.poly(42, 62, 44, 46, 52, 34, 62, 27, 74, 25, 86, 27, 96, 33, 103, 44, 106, 60, 105, 80, 106, 98, 110, 114, 112, 122, 104, 124, 96, 116, 92, 104, 88, 96, 58, 96, 52, 104, 46, 116, 38, 122, 34, 118, 38, 104, 40, 86)]},
    {group: 'top', mat: 'top', tone: 2, prims: [P.poly(4, 166, 8, 148, 22, 138, 42, 129, 56, 119, 90, 119, 104, 129, 120, 138, 132, 150, 136, 166)]},
    {group: 'neck', mat: 'skin', tone: 2, prims: [P.poly(61, 94, 61, 119, 72, 123, 85, 119, 85, 94)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(
      50, 58, 54, 46, 62, 38, 72, 35, 82, 36, 90, 41, 95, 50, 96, 62, 95, 74, 91, 84, 85, 92, 77, 97, 70, 98, 63, 96, 57, 90, 53, 82, 50, 70)]},
    // front hair: a side part high on her right (camera-left); a sweep across the brow to the far side
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(46, 76, 45, 58, 50, 44, 58, 35, 68, 30, 80, 30, 90, 34, 98, 42, 102, 54, 103, 70, 100, 62, 95, 52, 88, 45, 80, 43, 70, 46, 62, 44, 56, 50, 53, 60, 52, 74, 50, 90, 46, 98),
      P.poly(96, 58, 102, 66, 104, 84, 106, 102, 102, 108, 97, 96, 95, 80, 95, 66),
    ]},
  ];
  const adjust: Adjust[] = [
    // ---- the spotlight from above: forehead, nose ridge, cheekbones, the top lip and the chin catch it
    plane('skin', 4, P.poly(58, 48, 66, 46, 80, 46, 88, 50, 86, 54, 72, 53, 60, 54), P.poly(71, 54, 73, 54, 73, 70, 71, 70)),
    plane('skin', 5, P.line(64, 48, 80, 48), P.line(72, 57, 72, 65)),
    // nose: the shaded far side, a lit tip; cheekbones: small lit ridges under the outer eye corners
    plane('skin', 2, P.poly(74, 58, 76, 64, 76, 72, 74, 72)),
    plane('skin', 4, P.poly(70, 71, 74, 71, 74, 73, 70, 73)),
    plane('skin', 4, P.poly(56, 68, 62, 67, 63, 70, 58, 71), P.poly(82, 67, 89, 68, 87, 71, 82, 70), P.poly(68, 89, 76, 89, 75, 91, 69, 91)),
    plane('skin', 2, P.poly(51, 72, 56, 74, 60, 86, 56, 91, 52, 82), P.poly(91, 72, 94, 72, 92, 82, 88, 88, 86, 82)),
    // the brow ridge shades only a soft crease on the upper lid (a dark socket reads tired, not lit)
    plane('skin', 2, P.poly(57, 58, 68, 57, 69, 60, 58, 61), P.poly(76, 57, 87, 58, 87, 61, 76, 60)),
    plane('skin', 2, P.poly(68, 75, 76, 75, 75, 77, 69, 77)),
    plane('skin', 2, P.poly(65, 87, 79, 87, 77, 89, 67, 89)),
    plane('skin', 2, P.poly(66, 94, 78, 93, 74, 97, 69, 97)),
    // the neck: in the chin's hard shadow, a lit sliver at the base of the throat
    plane('skin', 1, P.poly(61, 94, 64, 99, 72, 103, 80, 99, 85, 94, 85, 103, 72, 109, 61, 103)),
    plane('skin', 3, P.poly(67, 114, 77, 114, 75, 119, 69, 119)),
    // ---- hair: the spotlight lays a hot sheen across the crown and down the falls; dark inner strands
    // the part, high on her right (camera-left); strands fan away from it and catch the spot in pieces
    plane('hair', 0, P.line(61, 30, 60, 36)),
    plane('hair', 4, P.line(63, 31, 72, 30), P.line(64, 33, 80, 32), P.line(66, 35, 88, 36), P.line(70, 38, 94, 44), P.line(59, 31, 53, 36), P.line(58, 34, 50, 42)),
    plane('hair', 5, P.line(66, 31, 71, 30), P.line(72, 33, 78, 33), P.line(56, 33, 54, 35)),
    plane('hair', 3, P.line(65, 37, 86, 39), P.line(46, 62, 48, 90), P.line(100, 60, 104, 90), P.line(50, 50, 55, 42), P.line(92, 42, 98, 50)),
    plane('hair', 2, P.line(62, 40, 72, 41), P.line(80, 41, 90, 46)),
    plane('hair', 1, P.line(54, 62, 51, 92), P.line(96, 64, 99, 98), P.line(98, 100, 104, 118), P.line(40, 106, 46, 96)),
    plane('hair', 4, P.line(36, 118, 40, 106), P.line(104, 108, 110, 120)),
    // ---- shoulders: the top light rides them; the collarline
    plane('top', 4, P.poly(10, 148, 24, 139, 42, 132, 46, 134, 26, 142, 12, 152), P.poly(100, 131, 118, 139, 128, 150, 118, 144, 102, 135)),
    plane('top', 5, P.line(14, 146, 26, 140), P.line(108, 134, 120, 140)),
    plane('top', 3, P.poly(56, 119, 90, 119, 86, 125, 60, 125)),
    plane('top', 1, P.line(72, 136, 72, 166)),
  ];
  const stamps: Stamp[] = [
    // direct, level eyes under clean arched brows
    {x: 56, y: 61, rows: ['..LLLLLLLL..', '.LwWIgIIWwL.', '..kwWIIIWk..', '...kkkkkk...'], pal: {L: PAL.N0, w: PAL.P0, W: PAL.P1, I: PAL.N0, g: PAL.W9, k: PAL.S3}},
    {x: 76, y: 61, rows: ['..LLLLLLLL..', '.LwWIgIIWwL.', '..kWIIIWwk..', '...kkkkkk...'], pal: {L: PAL.N0, w: PAL.P0, W: PAL.P1, I: PAL.N0, g: PAL.W9, k: PAL.S3}},
    // clean arched brows, a pixel higher and thinner: the head of the brow by the nose, a fine tail out
    {x: 55, y: 56, rows: ['....bbbbbb..', '..bb......bb', '.b..........'], pal: {b: PAL.B1}},
    {x: 77, y: 56, rows: ['..bbbbbb....', 'bb......bb..', '..........b.'], pal: {b: PAL.B1}},
    {x: 69, y: 76, rows: ['o....o'], pal: {o: PAL.S2}},
    // a small, sure closed smile
    {x: 63, y: 82, rows: ['r...uuuu...r', '.rmmmmmmmmr.', '...lLLLLl...'], pal: {u: PAL.S3, m: PAL.S1, l: PAL.S3, L: PAL.S5, r: PAL.S2}},
  ];
  return {w: 138, h: 166, parts, adjust, stamps};
};
const RIMA_RIG: LightRig = {
  key: [-0.15, -1], keyBand: 0, shadowBand: 0, rim: false, outline: true, edgesOnTop: true,
  back: null,
  ramps: {
    skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.S6],
    hair: [PAL.N0, PAL.B0, PAL.B1, PAL.B2, PAL.B4, PAL.P1],
    top: [PAL.N0, PAL.N0, PAL.N1, PAL.N2, PAL.P0, PAL.P2],
  },
};
const HOUSE_DARK = gelMap([PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2], 0.1, 0.8);
const drawCone = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number) => {
  // the beam in the air: a trapezoid from above the frame; a pale warm haze (never a colour wash), hotter
  // at the core, with a crisp edge and a few lit motes
  for (let y = 0; y < h; y++) {
    const half = 30 + y * 0.28, cx = w / 2 + 2;
    for (let x = 0; x < w; x++) {
      const d = Math.abs(x - cx) / half;
      if (d > 1.02) continue;
      const X = x0 + x, Y = y0 + y, bz = bayer(X, Y);
      const c = d > 0.95 ? PAL.X0 : d < 0.5 ? (bz < 0.5 ? PAL.X1 : PAL.X0) : d < 0.8 ? (bz < 0.25 ? PAL.X1 : PAL.X0) : bz < 0.5 ? PAL.X0 : PAL.N1;
      if (clip(X, Y)) b.set(X, Y, c);
      if (d < 0.9 && hash(X, Y, 21) > 0.994 && clip(X, Y)) b.set(X, Y, PAL.P0);
    }
  }
};
export const drawRima = (b: Buf, x: number, y: number, k: number) => {
  const [w, h] = RC_SIZE.rima;
  const clip = clipTo(x, y, w, h);
  rect(x, y, w, h, ink(b, clip, PAL.N0));
  // the leap tightens the crop: she is drawn 16% bigger than the incumbents, the head held high in frame
  const img = memoFig('rima', () => renderFigure(enlarge(rimaFig(), 1.16, 72, 66, -2, 4), RIMA_RIG));
  if (k === 0) {
    // house lights off: she is a shape in the dark, four px short of her mark
    blitImg(b, img, x + 4, y + 1, {clip, map: HOUSE_DARK});
    return;
  }
  drawCone(b, clip, x, y, w, h);
  const step = k === 1 ? 1 : 0; // lands on the mark
  blitImg(b, img, x + step, y, {clip});
  // the light's rim on the floor of the frame: a hard warm edge where the cone meets the shoulders
};

// ================================================================== 6 · THE WHALE (PeekDeep, sea blue)
// The company mascot, never a person: a round-headed pixel whale breaching from night water. Three held
// drawings: the snout breaks the surface (k 0-1), half out (2-3), the apex, arched, streaming (4-7).
// Moonlight from the upper right: a cyan rim; the belly grooves catch it.
const whaleFig = (): FigureDef => {
  const parts: Part[] = [
    // body: vertical, head up, the belly facing camera-left; wide at the jaw, tapering down into the water
    {group: 'body', mat: 'back', tone: 2, prims: [P.poly(52, 30, 58, 16, 68, 9, 80, 8, 90, 13, 97, 24, 100, 40, 100, 62, 98, 84, 95, 108, 92, 132, 90, 170, 60, 170, 58, 132, 54, 104, 50, 78, 48, 52)]},
    {group: 'belly', mat: 'belly', tone: 3, prims: [P.poly(50, 44, 54, 34, 60, 30, 66, 32, 68, 48, 68, 72, 70, 100, 72, 130, 72, 170, 62, 170, 60, 134, 56, 104, 52, 80, 49, 60)]},
    // the pectoral fin, flung out toward camera-left
    {group: 'fin', mat: 'back', tone: 2, prims: [P.poly(54, 84, 44, 88, 30, 98, 20, 112, 18, 118, 26, 116, 38, 108, 50, 100, 56, 96)]},
  ];
  const adjust: Adjust[] = [
    plane('back', 3, P.poly(84, 12, 92, 16, 97, 26, 99, 40, 94, 34, 88, 22)),
    plane('back', 4, P.line(90, 15, 96, 24), P.line(98, 30, 99, 44)),
    plane('back', 1, P.poly(72, 40, 80, 42, 82, 70, 80, 110, 78, 170, 74, 170, 74, 110, 74, 72)),
    // the ventral grooves: long lit lines down the belly
    plane('belly', 2, P.line(56, 50, 58, 90), P.line(60, 48, 62, 96), P.line(64, 50, 66, 104), P.line(59, 100, 63, 140)),
    plane('belly', 4, P.line(54, 38, 58, 33), P.line(52, 46, 54, 40)),
    // the mouth line from the snout back along the jaw
    plane('back', 0, P.line(60, 30, 74, 40), P.line(74, 40, 82, 42)),
    plane('back', 3, P.line(24, 110, 40, 98), P.line(40, 98, 52, 90)),
  ];
  const stamps: Stamp[] = [
    // the eye: small, dark, kind; a moon glint
    {x: 80, y: 44, rows: ['.oo.', 'oIgo', 'oIIo', '.oo.'], pal: {o: PAL.N1, I: PAL.N0, g: PAL.C9}},
    // barnacle freckles on the snout
    {x: 70, y: 16, rows: ['h....', '...h.', '.h...'], pal: {h: PAL.C6}},
  ];
  return {w: 146, h: 176, parts, adjust, stamps};
};
const WHALE_RIG: LightRig = {
  key: [0.8, -0.6], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true,
  back: null,
  ramps: {
    back: [PAL.N0, PAL.N4, PAL.N6, PAL.C4, PAL.C6, PAL.C8],
    belly: [PAL.N1, PAL.N6, PAL.C5, PAL.C7, PAL.C8, PAL.C9],
  },
};
const WATER_Y = 132;
/** spray clusters around the breach: deterministic droplets, drawn per drawing */
const spray = (b: Buf, clip: Clip, x0: number, y0: number, drawing: number, fall: number) => {
  const cx = x0 + 74, wy = y0 + WATER_Y;
  const n = drawing === 0 ? 26 : drawing === 1 ? 60 : 90;
  const reach = drawing === 0 ? 16 : drawing === 1 ? 34 : 54;
  for (let i = 0; i < n; i++) {
    const a = hash(i, drawing, 3), r = hash(i, drawing, 7), s = hash(i, drawing, 11);
    const side = a < 0.5 ? -1 : 1;
    const dx = side * (12 + r * reach);
    const up = (1 - Math.abs(dx) / (reach + 40)) * (drawing === 0 ? 14 : drawing === 1 ? 40 : 62) * (0.4 + s * 0.6);
    const X = Math.round(cx + dx), Y = Math.round(wy - up + fall * (0.5 + s));
    const c = s > 0.7 ? PAL.C9 : s > 0.35 ? PAL.C8 : PAL.C6;
    if (clip(X, Y) && Y < wy + 2) b.set(X, Y, c);
    if (s > 0.55 && clip(X, Y + 1) && Y + 1 < wy + 2) b.set(X, Y + 1, PAL.C6);
  }
  // the white crown where he tears the surface
  for (let x = -26; x <= 26; x++) {
    const hgt = Math.round((1 - (x / 27) ** 2) * (drawing === 0 ? 10 : drawing === 1 ? 9 : 7) * (0.6 + hash(x, drawing, 5) * 0.6));
    for (let yy = 0; yy < hgt; yy++) {
      const X = cx + x, Y = wy - yy;
      const c = yy === hgt - 1 ? PAL.C9 : yy > hgt / 2 ? PAL.C8 : PAL.C7;
      if (clip(X, Y)) b.set(X, Y, c);
    }
  }
};
const bgWhale = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number) => {
  // night sky over the sea: black to a low sea-blue haze at the horizon; the sea below, moon-streaked
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const X = x0 + x, Y = y0 + y, bz = bayer(X, Y);
      let c: number;
      if (y < WATER_Y) {
        const t = y / WATER_Y;
        c = t < 0.55 ? PAL.N0 : t < 0.75 ? (bz < (t - 0.55) / 0.2 ? PAL.N1 : PAL.N0) : t < 0.92 ? (bz < (t - 0.75) / 0.17 ? PAL.C0 : PAL.N1) : PAL.C0;
      } else {
        const t = (y - WATER_Y) / (h - WATER_Y);
        c = t < 0.08 ? PAL.C1 : bz < 0.5 - t * 0.5 ? PAL.C0 : PAL.N1;
        // the moon's glitter path on the water (upper right moon): short horizontal dashes
        if (x > 96 && x < 132 && (y % 5 === 0) && hash(x >> 2, y, 9) > 0.55 - (1 - t) * 0.2) c = hash(x, y, 4) > 0.5 ? PAL.C5 : PAL.C3;
      }
      if (clip(X, Y)) b.set(X, Y, c);
    }
  // the moon, high right, small and hard
  stampBuf(b, clip, x0 + 118, y0 + 12, ['.mmm.', 'mMMMm', 'mMMMm', 'mMMMm', '.mmm.'], {m: PAL.C7, M: PAL.C9});
};
export const drawWhale = (b: Buf, x: number, y: number, k: number) => {
  const [w, h] = RC_SIZE.whale;
  const clip = clipTo(x, y, w, h);
  bgWhale(b, clip, x, y, w, h);
  const drawing = k < 2 ? 0 : k < 4 ? 1 : 2;
  const rise = [84, 42, 8][drawing];
  const img = memoFig('whale', () => renderFigure(whaleFig(), WHALE_RIG));
  // the apex drawing arches: the upper body leans toward camera-left in integer row steps
  const lean = (row: number) => (drawing === 2 ? Math.round(Math.max(0, 80 - row) * 0.12) : 0);
  const above = (py: number) => py < y + WATER_Y + (drawing === 0 ? 0 : 1);
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const v = img.c[j * img.w + i];
      if (v < 0) continue;
      const X = x + i - lean(j), Y = y + j + rise;
      if (clip(X, Y) && above(Y)) b.set(X, Y, v);
    }
  // water streaming off his flanks at the apex; the spray falls a little on the second hold
  if (drawing === 2) for (let j = 0; j < 90; j += 3) {
    const yy = y + rise + 30 + j;
    for (const sx of [-1, 1]) {
      const xx = x + (sx < 0 ? 50 : 100) + (sx < 0 ? -1 : 1) - lean(30 + j) + (hash(j, sx, 2) > 0.5 ? 1 : 0);
      if (clip(xx, yy) && above(yy) && hash(j, sx, 8) > 0.35) b.set(xx, yy, PAL.C8);
    }
  }
  spray(b, clip, x, y, drawing, drawing === 2 && k >= 6 ? 4 : 0);
};

// ================================================================== 7 · RUMPT (podium gold / black)
// SILHOUETTE ONLY: the mystery-figure trope, at the roll call's 112x136 window. A black shape behind a small
// fluted gold podium, pointing; a gold rim from the backlight is the only light on him. Guardrails (his never-do
// list): recognised by PROPS AND POSE ONLY — a plain rounded head (no hair shape at all), square suit shoulders,
// the over-long tie hanging past the podium's lip, and the point. The arm leaves the camera-left shoulder within
// 15 degrees of horizontal (never a raised-arm salute, never a fist pump): a clear fist and an index finger
// against the backlight. The podium is plain (no roundel: not a seal, not Ep4's coin slot).
// k0 the hand is down behind the podium; k1 it snaps out into the point, 1px past its mark; k2 on it holds.
const RUMPT_W = 112, RUMPT_H = 136;
const RUMPT_ARM = (kick: number): Prim[] => {
  const dx = -kick;
  const S = (...pts: number[]) => P.poly(...pts.map((v, i) => (i % 2 ? v : v + dx)));
  return [
    // the suit sleeve: shoulder to a narrower wrist, about 8 degrees up toward camera-left
    S(36, 76, 36, 88, 17, 83, 17, 76),
    // the fist: a knob taller than the wrist (the curled fingers a block)
    S(17, 73, 17, 85, 9, 85, 8, 82, 8, 75, 10, 73),
    // the index finger continuing the arm's line, and the thumb riding on top of the fist
    S(9, 75, 9, 78, 1, 78, -1, 77, -1, 76, 1, 75),
    S(15, 70, 15, 73, 10, 73, 10, 71),
  ];
};
const rumptFig = (point: boolean, kick = 0): FigureDef => {
  const body: Prim[] = [
    // square suit shoulders (a boxy jacket), cut by the window at the bottom and the right
    P.poly(24, 136, 24, 82, 30, 75, 52, 69, 88, 69, 110, 75, 116, 82, 116, 136),
    // the neck, then a plain rounded head, turned a touch toward camera-left: no hair shape, no features
    P.rect(62, 56, 14, 16),
    P.ell(69, 44, 12.5, 15),
    P.ell(81, 46, 2.2, 4), // the ear
  ];
  if (point) body.push(...RUMPT_ARM(kick));
  return {w: RUMPT_W, h: RUMPT_H, parts: [{group: 'body', mat: 'sil', tone: 2, prims: body}], adjust: [], stamps: []};
};
const RUMPT_RIG: LightRig = {
  key: [0.55, -0.85], keyBand: 0, shadowBand: 0, rim: true, outline: false, edgesOnTop: true,
  back: [-0.2, -1], backBand: 1,
  backRamp: {sil: PAL.W3},
  ramps: {sil: [PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.N0, PAL.W7]},
};
const PODIUM = {x: 34, y: 98, w: 72, h: 38} as const;
const drawPodium = (b: Buf, clip: Clip, x0: number, y0: number) => {
  const px = x0 + PODIUM.x, py = y0 + PODIUM.y;
  // two goosenecks rising toward him (black against the backlight)
  line(px + 30, py, px + 33, py - 13, ink(b, clip, PAL.N0));
  line(px + 40, py, px + 37, py - 13, ink(b, clip, PAL.N0));
  rect(px + 31, py - 16, 3, 4, ink(b, clip, PAL.N0));
  rect(px + 36, py - 16, 3, 4, ink(b, clip, PAL.N0));
  // the slanted reading top
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < PODIUM.w; x++) {
      const c = y === 0 ? PAL.W8 : y < 3 ? (x < 44 ? PAL.W7 : PAL.W6) : y < 5 ? PAL.W5 : PAL.W1;
      if (clip(px + x, py + y)) b.set(px + x, py + y, c);
    }
  // the front panel: plain flutes, lit from camera-left, falling off to the right (no emblem)
  for (let y = 6; y < PODIUM.h; y++)
    for (let x = 5; x < PODIUM.w - 5; x++) {
      const X = px + x, Y = py + y, u = (x - 5) / (PODIUM.w - 10), bz = bayer(X, Y);
      let c = u < 0.06 ? PAL.W6 : u < 0.3 ? PAL.W5 : u < 0.62 ? PAL.W4 : u < 0.9 ? (bz < 0.5 ? PAL.W3 : PAL.W4) : PAL.W2;
      if ((x - 5) % 8 === 0 && x > 5) c = PAL.W2; // flute shadow
      if ((x - 5) % 8 === 1 && x > 6 && u < 0.7) c = PAL.W6; // flute edge catch
      if (clip(X, Y)) b.set(X, Y, c);
    }
  // THE TIE (his allowed prop): over-long, hanging past the podium's lip as a black shape on the gold, no colour
  const tx = x0 + 67, ty = py;
  poly([tx, ty - 1, tx + 7, ty - 1, tx + 7, ty + 16, tx + 3.5, ty + 21, tx, ty + 16], ink(b, clip, PAL.N0));
  line(tx - 1, ty + 1, tx - 1, ty + 16, ink(b, clip, PAL.W2)); // its shadow on the flutes
};
const bgRumpt = (b: Buf, clip: Clip, x0: number, y0: number, w: number, h: number) => {
  // black stage, a gold backlight pool behind his head and his point, faint gold drape pleats
  // (a strong halo: the silhouette and the point must cut out against it in a third of a second)
  pool(b, clip, x0, y0, w, h, w * 0.4, h * 0.5, w * 0.72, h * 0.56, PAL.N0, [[1, PAL.W0], [0.78, PAL.W1], [0.54, PAL.W2], [0.3, PAL.W3]]);
  for (let x = 0; x < w; x += 10) for (let y = 0; y < h; y++) {
    const X = x0 + x, Y = y0 + y;
    if (clip(X, Y) && b.get(X, Y) !== PAL.N0) b.set(X, Y, stepCol(b.get(X, Y), -1));
  }
};
const stepCol = (c: number, k: number) => {
  const ramp = [PAL.N0, PAL.W0, PAL.W1, PAL.W2, PAL.W3];
  const i = ramp.indexOf(c);
  return i < 0 ? c : ramp[Math.max(0, Math.min(ramp.length - 1, i + k))];
};
export const drawRumpt = (b: Buf, x: number, y: number, k: number) => {
  const [w, h] = RC_SIZE.rumpt;
  const clip = clipTo(x, y, w, h);
  bgRumpt(b, clip, x, y, w, h);
  const point = k >= 1, kick = k === 1 ? 1 : 0;
  const img = memoFig(`rumpt112${point}${kick}`, () => renderFigure(rumptFig(point, kick), RUMPT_RIG));
  blitImg(b, img, x, y, {clip});
  drawPodium(b, clip, x, y);
};

// ================================================================== 8 · THE CURSOR (glyph, cyan on black)
// The player who doesn't exist yet: a portrait window holding only a blinking cursor, drawn by the GLYPH
// layer (see src/dev/mrollcall/scene.ts). The pixel side of it is just the black of the window.
export const drawCursorWindow = (b: Buf, x: number, y: number, w: number, h: number) => rect(x, y, w, h, b.ink(PAL.N0));
