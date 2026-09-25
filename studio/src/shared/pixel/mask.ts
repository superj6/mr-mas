// MR. MAS — shared pixel engine: masks.
// A Mask is per-pixel coverage 0..255 on the native grid. Masked operations (palette remaps, glyph regions)
// apply where coverage > an ordered threshold, so a soft mask edge becomes a clean ordered-dither seam and a
// hard mask stays hard. Used for: the Orb scan cone, "freeze everything except Mas", portrait-only effects.
import {W, H, Plot, Sprite, ellipse, poly, rect, line} from './px';
import type {Img} from './figure';
import {Threshold, bayer8} from './dither';

export class Mask {
  w: number; h: number; a: Uint8Array;
  constructor(w = W, h = H, fill = 0) { this.w = w; this.h = h; this.a = new Uint8Array(w * h).fill(fill); }
  static full(w = W, h = H) { return new Mask(w, h, 255); }
  /** Build from a coverage function (0..1). */
  static from(fn: (x: number, y: number) => number, w = W, h = H) {
    const m = new Mask(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) m.a[y * w + x] = Math.round(Math.max(0, Math.min(1, fn(x, y))) * 255);
    return m;
  }
  get(x: number, y: number) { x |= 0; y |= 0; return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.a[y * this.w + x]; }
  /** Coverage 0..1. */
  cov(x: number, y: number) { return this.get(x, y) / 255; }
  /** Is (x,y) inside, resolving soft coverage with an ordered threshold (default bayer8). */
  on(x: number, y: number, thr: Threshold = bayer8) { const v = this.get(x, y); return v >= 255 || (v > 0 && v / 255 > thr(x, y)); }
  /** A Plot that writes coverage v (max-combined) — use with rect/line/poly/ellipse. */
  plot = (v = 255): Plot => (x, y) => {
    x |= 0; y |= 0;
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = y * this.w + x;
    if (v > this.a[i]) this.a[i] = v;
  };
  addRect(x: number, y: number, w: number, h: number, v = 255) { rect(x, y, w, h, this.plot(v)); return this; }
  addEllipse(cx: number, cy: number, rx: number, ry: number, v = 255) { ellipse(cx, cy, rx, ry, this.plot(v)); return this; }
  addPoly(pts: number[], v = 255) { poly(pts, this.plot(v)); return this; }
  addLine(x0: number, y0: number, x1: number, y1: number, v = 255) { line(x0, y0, x1, y1, this.plot(v)); return this; }
  /** Opaque pixels of a rendered figure image. */
  addImg(img: Img, x: number, y: number, flip = false) {
    for (let j = 0; j < img.h; j++)
      for (let i = 0; i < img.w; i++) if (img.c[j * img.w + (flip ? img.w - 1 - i : i)] >= 0) this.plot()(x + i, y + j);
    return this;
  }
  /** Opaque characters of a string-map sprite. */
  addSprite(s: Sprite, x: number, y: number, flip = false) {
    for (let j = 0; j < s.h; j++)
      for (let i = 0; i < s.w; i++) { const ch = s.rows[j][flip ? s.w - 1 - i : i]; if (ch !== '.' && ch !== ' ') this.plot()(x + i, y + j); }
    return this;
  }
  clone() { const m = new Mask(this.w, this.h); m.a.set(this.a); return m; }
  invert() { for (let i = 0; i < this.a.length; i++) this.a[i] = 255 - this.a[i]; return this; }
  /** Any non-zero -> 255 (e.g. after px.ts `blit(..., {mask: m.a})`, which writes 1). */
  binarize(thr = 0) { for (let i = 0; i < this.a.length; i++) this.a[i] = this.a[i] > thr ? 255 : 0; return this; }
  union(o: Mask) { for (let i = 0; i < this.a.length; i++) this.a[i] = Math.max(this.a[i], o.a[i]); return this; }
  intersect(o: Mask) { for (let i = 0; i < this.a.length; i++) this.a[i] = Math.min(this.a[i], o.a[i]); return this; }
  subtract(o: Mask) { for (let i = 0; i < this.a.length; i++) this.a[i] = Math.max(0, this.a[i] - o.a[i]); return this; }
  /** Square dilation by r px (hard). */
  dilate(r = 1) {
    const src = this.a.slice();
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        let v = 0;
        for (let j = -r; j <= r && v < 255; j++)
          for (let i = -r; i <= r; i++) {
            const xx = x + i, yy = y + j;
            if (xx >= 0 && yy >= 0 && xx < this.w && yy < this.h && src[yy * this.w + xx] > v) v = src[yy * this.w + xx];
          }
        this.a[y * this.w + x] = v;
      }
    return this;
  }
  /** Boundary pixels: inside (>=128) with a 4-neighbour outside. Ink it for beam edges / selection outlines. */
  outline() {
    const m = new Mask(this.w, this.h);
    const inside = (x: number, y: number) => this.get(x, y) >= 128;
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++)
        if (inside(x, y) && (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1))) m.a[y * this.w + x] = 255;
    return m;
  }
  /** [x0, y0, x1, y1] (inclusive) of non-zero coverage, or null. */
  bounds(): [number, number, number, number] | null {
    let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++)
        if (this.a[y * this.w + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return x1 < 0 ? null : [x0, y0, x1, y1];
  }
  /** Call fn for every pixel that is `on` (ordered-threshold resolved). */
  each(fn: (x: number, y: number) => void, thr: Threshold = bayer8) {
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (this.on(x, y, thr)) fn(x, y);
  }
}

export interface ConeOpts {
  /** angular softness in degrees (coverage ramps over this width at each edge). Default 3. */
  soft?: number;
  /** length falloff in px at the far end. Default 24. */
  fade?: number;
  /** start radius (the beam starts a few px out of the emitter). Default 0. */
  start?: number;
  w?: number; h?: number;
}
/**
 * A light/scan cone from apex (ax, ay) pointing at `dirDeg` (0 = screen-right, 90 = down), half-angle
 * `halfDeg`, length `len`. Soft edges resolve to an ordered-dither seam in masked ops.
 */
export const coneMask = (ax: number, ay: number, dirDeg: number, halfDeg: number, len: number, o: ConeOpts = {}) => {
  const soft = o.soft ?? 3, fade = o.fade ?? 24, start = o.start ?? 0;
  const dr = (dirDeg * Math.PI) / 180;
  const dx = Math.cos(dr), dy = Math.sin(dr);
  return Mask.from((x, y) => {
    const px = x + 0.5 - ax, py = y + 0.5 - ay;
    const along = px * dx + py * dy;
    if (along <= start) return 0;
    const d = Math.hypot(px, py);
    const ang = (Math.acos(Math.max(-1, Math.min(1, along / (d || 1)))) * 180) / Math.PI;
    const ca = Math.max(0, Math.min(1, (halfDeg - ang) / soft + 0.5));
    const cl = Math.max(0, Math.min(1, (len - d) / fade + 0.5));
    const cs = Math.max(0, Math.min(1, (along - start) / 3));
    return ca * cl * cs;
  }, o.w ?? W, o.h ?? H);
};

/** Soft disc (iris reveals, spotlights). */
export const radialMask = (cx: number, cy: number, r: number, soft = 4, w = W, h = H) =>
  Mask.from((x, y) => Math.max(0, Math.min(1, (r - Math.hypot(x + 0.5 - cx, y + 0.5 - cy)) / soft + 0.5)), w, h);

/** Mask from a rendered figure image placed at (x, y). */
export const imgMask = (img: Img, x: number, y: number, flip = false, w = W, h = H) => new Mask(w, h).addImg(img, x, y, flip);
