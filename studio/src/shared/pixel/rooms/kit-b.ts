// MR. MAS — shared rooms (background artist B): small helpers used by bullpen.ts, lighthouse.ts and darkroom.ts.
// Pure (no DOM). Every colour written is a master-palette colour (PAL.*), so `strayColors` stays empty.
// Owner: rooms B (ep01 act 4). Other builders may import; please don't edit (add your own helper file instead).
import {Buf, Plot, bayer, hash, rect} from '../px';
import {PAL, stepColor} from '../palette';
import type {Img} from '../figure';
import {Mask} from '../mask';

// ------------------------------------------------------------------ the room contract
/** Room plates are 480 x 203: the adventure layout's room. Rows 203-269 belong to the rail (cutscene band). */
export const ROOM_W = 480;
export const ROOM_H = 203;

/**
 * What a room draw hands back to the scene builder: coverage masks of its surfaces (for palette remaps such as
 * THE LANDLORD, or for clipping a figure behind furniture) and named anchors (feet / seats / prop marks).
 */
export interface RoomOut {
  masks: Record<string, Mask>;
  anchors: Record<string, [number, number]>;
  /** repaint the room's near furniture (the desk / bench and what sits on it) over figures drawn behind it */
  front?: (b: Buf) => void;
}
export const newRoomOut = (names: string[]): RoomOut => ({masks: Object.fromEntries(names.map((n) => [n, new Mask()])), anchors: {}});

// ------------------------------------------------------------------ tiny text (3x5), the micro font + the few glyphs rooms need
const TG: Record<string, string> = {
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
  $: '.##|##.|.#.|.##|##.', ',': '.|.|.|#|#', '.': '.|.|.|.|#', ':': '.|#|.|#|.', '-': '...|...|###|...|...',
  '*': '#.#|.#.|#.#|...|...', '!': '#|#|#|.|#', '/': '..#|..#|.#.|#..|#..', '?': '##.|..#|.#.|...|.#.',
  '+': '...|.#.|###|.#.|...', '(': '.#|#.|#.|#.|.#', ')': '#.|.#|.#|.#|#.', '%': '##..#|##.#.|..#..|.#.##|#..##',
  '·': '.|.|#|.|.', '#': '#.#|###|#.#|###|#.#', '=': '...|###|...|###|...', "'": '#|#|.|.|.', '"': '#.#|#.#|...|...|...',
  '&': '.#.|#.#|.#.|#.#|.##', '~': '....|.#.#|#.#.|....|....', _: '...|...|...|...|###',
};
const TGL: Record<string, {w: number; rows: string[]}> = {};
for (const [k, v] of Object.entries(TG)) { const rows = v.split('|'); TGL[k] = {w: rows[0].length, rows}; }
const glyph = (ch: string) => TGL[ch] ?? TGL[ch.toUpperCase()];
export const tinyWidth = (s: string) => {
  let w = 0;
  for (const ch of s) w += (ch === ' ' ? 2 : (glyph(ch)?.w ?? 3)) + 1;
  return Math.max(0, w - 1);
};
/** 3x5 text through any Plot (so it can paint a material, an emissive, a mask or a buffer colour). */
export const tinyPlot = (s: string, x: number, y: number, p: Plot) => {
  let cx = x;
  for (const ch of s) {
    if (ch === ' ') { cx += 3; continue; }
    const g = glyph(ch);
    if (!g) { cx += 4; continue; }
    g.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') p(cx + i, y + j); });
    cx += g.w + 1;
  }
};
export const tiny = (b: Buf, s: string, x: number, y: number, col: number, shadow?: number) => {
  if (shadow !== undefined) tinyPlot(s, x + 1, y + 1, b.ink(shadow));
  tinyPlot(s, x, y, b.ink(col));
};

// ------------------------------------------------------------------ images
export const newImg = (w: number, h: number): Img => ({w, h, c: new Int32Array(w * h).fill(-1)});
export const imgPut = (img: Img, x: number, y: number, col: number) => {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return;
  img.c[y * img.w + x] = col;
};
export const imgInk = (img: Img, col: number): Plot => (x, y) => imgPut(img, x, y, col);
/** blit an Img (transparent = -1) with an optional colour map and mask capture */
export const put = (b: Buf, img: Img, x: number, y: number, o: {map?: (c: number, x: number, y: number) => number; mask?: Mask; clip?: (x: number, y: number) => boolean} = {}) => {
  for (let j = 0; j < img.h; j++)
    for (let i = 0; i < img.w; i++) {
      const c = img.c[j * img.w + i];
      if (c < 0) continue;
      const X = x + i, Y = y + j;
      if (o.clip && !o.clip(X, Y)) continue;
      b.set(X, Y, o.map ? o.map(c, X, Y) : c);
      if (o.mask) o.mask.plot()(X, Y);
    }
};

// ------------------------------------------------------------------ stepped light (copied from mcoldopen/paint.ts, the approved look)
/** Stepped elliptical light pool: rings = [[radius 0..1, colour], ...] from outer to inner. */
export const ringPool = (
  b: Buf, cx: number, cy: number, rx: number, ry: number, rings: Array<[number, number]>,
  test: (x: number, y: number) => boolean = () => true, seam = 0.35,
) => {
  const x0 = Math.floor(cx - rx), x1 = Math.ceil(cx + rx), y0 = Math.floor(cy - ry), y1 = Math.ceil(cy + ry);
  for (let y = Math.max(0, y0); y <= Math.min(b.h - 1, y1); y++)
    for (let x = Math.max(0, x0); x <= Math.min(b.w - 1, x1); x++) {
      if (!test(x, y)) continue;
      const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
      let c = -1;
      for (let k = 0; k < rings.length; k++) {
        const [r, col] = rings[k];
        const next = k + 1 < rings.length ? rings[k + 1][0] : 0;
        const band = (r - next) * seam;
        if (d < r - band || (d < r && bayer(x, y) < (r - d) / band)) c = col;
      }
      if (c >= 0) b.set(x, y, c);
    }
};

/** Step every pixel of a rect by k rungs (a light change is a palette step, never a blend). */
export const stepRect = (b: Buf, x: number, y: number, w: number, h: number, k: number, test: (x: number, y: number) => boolean = () => true) =>
  rect(x, y, w, h, (px, py) => { if (test(px, py)) b.set(px, py, stepColor(b.get(px, py), k)); });

/** Step by k inside an ellipse with an ordered-dither seam of width `seam` (0..1 of the radius). */
export const stepPool = (b: Buf, cx: number, cy: number, rx: number, ry: number, k: number, seam = 0.35, test: (x: number, y: number) => boolean = () => true) => {
  for (let y = Math.max(0, Math.floor(cy - ry)); y <= Math.min(b.h - 1, Math.ceil(cy + ry)); y++)
    for (let x = Math.max(0, Math.floor(cx - rx)); x <= Math.min(b.w - 1, Math.ceil(cx + rx)); x++) {
      if (!test(x, y)) continue;
      const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
      if (d >= 1) continue;
      if (d < 1 - seam || bayer(x, y) < (1 - d) / seam) b.set(x, y, stepColor(b.get(x, y), k));
    }
};

/** Cinematic edge falloff (copied from mcoldopen/paint.ts): one rung darker toward the corners, dithered seam. */
export const vignette = (b: Buf, strength = 1, rx = 0.62, ry = 0.66, h = b.h, rows = h) => {
  for (let y = 0; y < Math.min(rows, b.h); y++)
    for (let x = 0; x < b.w; x++) {
      const d = Math.hypot((x + 0.5 - b.w / 2) / (b.w * rx), (y + 0.5 - h / 2) / (h * ry));
      const t = (d - 0.78) / 0.3 + (bayer(x, y) - 0.5) * 0.5;
      if (t > 0) b.c[y * b.w + x] = stepColor(b.c[y * b.w + x], t > 1.2 && strength > 1 ? -2 : -1);
    }
};

/** Deterministic 0..1 per integer (props, crowd variation). */
export const h01 = (i: number, salt = 0) => hash(i, salt * 7 + 3, 911);

/** The rail band placeholder for previews only (the real rail is another builder's component). */
export const previewBand = (b: Buf, label?: string) => {
  rect(0, ROOM_H, b.w, b.h - ROOM_H, b.ink(PAL.N0));
  rect(0, ROOM_H, b.w, 1, b.ink(PAL.N2));
  if (label) tiny(b, label, 12, ROOM_H + 10, PAL.N5);
};
