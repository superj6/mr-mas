// MR. MAS — shared pixel engine: framebuffer, integer primitives, string-map sprites.
// (Promoted from src/dev/pixeladv/core/px.ts — the old path re-exports this file; keep every export stable.)
// Everything happens on an integer grid at native resolution (480x270). No anti-aliasing anywhere:
// primitives emit whole pixels, sprites are string maps. The framebuffer is palette-constrained: every
// value is a packed 0xRRGGBB entry of the master palette (palette.ts), so a palette switch is a lookup.

export const W = 480;
export const H = 270;

export type Plot = (x: number, y: number) => void;

/** 4x4 ordered-dither thresholds in (0,1). */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayer = (x: number, y: number) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;

/** Deterministic hash noise 0..1. */
export const hash = (x: number, y: number, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

// ---------- primitives (emit pixel coords) ----------
export const rect = (x: number, y: number, w: number, h: number, p: Plot) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p(x + i, y + j);
};

export const line = (x0: number, y0: number, x1: number, y1: number, p: Plot) => {
  x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    p(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
};

/** Scanline polygon fill, sampling pixel centres. pts = [x0,y0,x1,y1,...] */
export const poly = (pts: number[], p: Plot) => {
  let minY = Infinity, maxY = -Infinity;
  for (let i = 1; i < pts.length; i += 2) { minY = Math.min(minY, pts[i]); maxY = Math.max(maxY, pts[i]); }
  const n = pts.length / 2;
  for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
    const cy = y + 0.5;
    const xs: number[] = [];
    for (let i = 0; i < n; i++) {
      const ax = pts[i * 2], ay = pts[i * 2 + 1];
      const bx = pts[((i + 1) % n) * 2], by = pts[((i + 1) % n) * 2 + 1];
      if ((ay <= cy && by > cy) || (by <= cy && ay > cy)) xs.push(ax + ((cy - ay) / (by - ay)) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const xa = Math.ceil(xs[k] - 0.5), xb = Math.floor(xs[k + 1] - 0.5);
      for (let x = xa; x <= xb; x++) p(x, y);
    }
  }
};

export const ellipse = (cx: number, cy: number, rx: number, ry: number, p: Plot) => {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
      if (dx * dx + dy * dy <= 1) p(x, y);
    }
};

// ---------- colour frame buffer ----------
export class Buf {
  w: number; h: number; c: Uint32Array;
  constructor(w = W, h = H, fill = 0) { this.w = w; this.h = h; this.c = new Uint32Array(w * h).fill(fill); }
  set(x: number, y: number, col: number) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.c[y * this.w + x] = col;
  }
  get(x: number, y: number) {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
    return this.c[y * this.w + x];
  }
  ink = (col: number): Plot => (x, y) => this.set(x, y, col);
  clone() { const b = new Buf(this.w, this.h); b.c.set(this.c); return b; }
  toRGBA(out?: Uint8ClampedArray) {
    const o = out ?? new Uint8ClampedArray(this.w * this.h * 4);
    for (let i = 0; i < this.c.length; i++) {
      const v = this.c[i];
      o[i * 4] = (v >> 16) & 255; o[i * 4 + 1] = (v >> 8) & 255; o[i * 4 + 2] = v & 255; o[i * 4 + 3] = 255;
    }
    return o;
  }
}

// ---------- sprites (string maps) ----------
export interface Sprite { w: number; h: number; rows: string[]; }
export const spr = (src: string | string[]): Sprite => {
  const rows = (Array.isArray(src) ? src : src.split('\n')).map((r) => r.replace(/\s+$/, '')).filter((r, i, a) => !(r.trim() === '' && (i === 0 || i === a.length - 1)));
  const w = Math.max(...rows.map((r) => r.length));
  return {w, h: rows.length, rows: rows.map((r) => r.padEnd(w, '.'))};
};

export type CharPal = Record<string, number | undefined>;

/** Blit a sprite. Characters missing from the palette (and '.', ' ') are transparent. */
export const blit = (b: Buf, s: Sprite, x: number, y: number, pal: CharPal, opts: {flip?: boolean; clip?: (px: number, py: number) => boolean; mask?: Uint8Array} = {}) => {
  for (let j = 0; j < s.h; j++) {
    const row = s.rows[j];
    for (let i = 0; i < s.w; i++) {
      const ch = row[opts.flip ? s.w - 1 - i : i];
      if (ch === '.' || ch === ' ') continue;
      const col = pal[ch];
      if (col === undefined) continue;
      const px = x + i, py = y + j;
      if (opts.clip && !opts.clip(px, py)) continue;
      b.set(px, py, col);
      if (opts.mask && px >= 0 && py >= 0 && px < b.w && py < b.h) opts.mask[py * b.w + px] = 1;
    }
  }
};

/** Sprite -> opaque mask test (for shadows). */
export const opaqueAt = (s: Sprite, i: number, j: number) => {
  if (i < 0 || j < 0 || i >= s.w || j >= s.h) return false;
  const ch = s.rows[j][i];
  return ch !== '.' && ch !== ' ';
};

/** Horizontally shear rows (integer steps) — used for leans; `pivotRow` stays put. */
export const shear = (s: Sprite, pivotRow: number, rowsPerPx: number, dir = -1): Sprite => {
  const maxShift = Math.ceil(pivotRow / rowsPerPx) + 1;
  const pad = '.'.repeat(maxShift);
  const rows = s.rows.map((r, j) => {
    const k = j < pivotRow ? Math.floor((pivotRow - j) / rowsPerPx) : 0;
    const padded = pad + r + pad;
    const start = maxShift - dir * k;
    return padded.slice(start, start + s.w + maxShift).padEnd(s.w + maxShift, '.');
  });
  // keep left anchor stable: caller offsets by -maxShift when dir=-1
  return {w: s.w + maxShift, h: s.h, rows};
};

/** Stitch sprite parts into one (for sheets). */
export const layer = (w: number, h: number, parts: Array<[Sprite, number, number]>): Sprite => {
  const grid = Array.from({length: h}, () => Array(w).fill('.'));
  for (const [s, ox, oy] of parts)
    for (let j = 0; j < s.h; j++)
      for (let i = 0; i < s.w; i++) {
        const ch = s.rows[j][i];
        if (ch === '.' || ch === ' ') continue;
        const x = ox + i, y = oy + j;
        if (x >= 0 && y >= 0 && x < w && y < h) grid[y][x] = ch;
      }
  return {w, h, rows: grid.map((r) => r.join(''))};
};

/** Replace characters in a sprite at explicit coordinates (hand-edits/overrides). */
export const patch = (s: Sprite, edits: Array<[number, number, string]>): Sprite => {
  const rows = s.rows.map((r) => r.split(''));
  for (const [x, y, str] of edits) for (let k = 0; k < str.length; k++) if (rows[y] && x + k < s.w) rows[y][x + k] = str[k];
  return {w: s.w, h: s.h, rows: rows.map((r) => r.join(''))};
};

/** Palette remap of a whole buffer region (e.g. dim the UI in cutscene mode). */
export const remapRect = (b: Buf, x: number, y: number, w: number, h: number, f: (c: number, x: number, y: number) => number) => {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < b.w && j < b.h) b.c[j * b.w + i] = f(b.c[j * b.w + i], i, j);
};

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

// ---------- additions (shared engine) ----------

/** Sentinel for "no pixel" in overlay/UI buffers (outside the 24-bit colour range; presented as alpha 0). */
export const TRANSPARENT = 0x1000000;

/** Copy a whole buffer (same size) or blit `src` at (x, y). */
export const copyBuf = (dst: Buf, src: Buf, x = 0, y = 0) => {
  if (x === 0 && y === 0 && dst.w === src.w && dst.h === src.h) { dst.c.set(src.c); return dst; }
  for (let j = 0; j < src.h; j++) for (let i = 0; i < src.w; i++) dst.set(x + i, y + j, src.c[j * src.w + i]);
  return dst;
};

/** Crop a region into a new buffer (out-of-bounds reads as `fill`). */
export const cropBuf = (src: Buf, x: number, y: number, w: number, h: number, fill = 0) => {
  const out = new Buf(w, h, fill);
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const sx = x + i, sy = y + j;
      if (sx >= 0 && sy >= 0 && sx < src.w && sy < src.h) out.c[j * w + i] = src.c[sy * src.w + sx];
    }
  return out;
};

/** Whole-pixel scroll/offset composite: dst(x, y) = src(x - dx, y - dy), edges clamped (camera shake / pans). */
export const shiftBuf = (dst: Buf, src: Buf, dx: number, dy: number) => {
  dx |= 0; dy |= 0;
  for (let y = 0; y < dst.h; y++)
    for (let x = 0; x < dst.w; x++) dst.c[y * dst.w + x] = src.c[clamp(y - dy, 0, src.h - 1) * src.w + clamp(x - dx, 0, src.w - 1)];
  return dst;
};
