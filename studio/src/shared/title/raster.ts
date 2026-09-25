import {useLayoutEffect, useRef, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import {hexToRgb} from '../theme/color';

/**
 * Low-res raster helpers for the pixel / dither / glyph / riso title styles.
 * Everything is drawn into small buffers, then blitted nearest-neighbour to the 1920x1080 canvas.
 */

/** Hold the frame until the canvas has been painted (fonts must be ready first). */
export const useCanvasDraw = (ready: boolean, draw: (c: HTMLCanvasElement) => void, deps: unknown[]) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [handle] = useState(() => delayRender('title-canvas'));
  const done = useRef(false);
  useLayoutEffect(() => {
    if (!ready || !ref.current) return;
    draw(ref.current);
    if (!done.current) {
      done.current = true;
      continueRender(handle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps]);
  return ref;
};

export const offscreen = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c.getContext('2d', {willReadFrequently: true})!;
};

/** Rasterize with canvas AA, then hard-threshold alpha -> crisp 0/1 mask (pixel-art edges). */
export const maskOf = (w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void, thresh = 128): Uint8Array => {
  const c = offscreen(w, h);
  c.fillStyle = '#fff';
  c.strokeStyle = '#fff';
  paint(c);
  const d = c.getImageData(0, 0, w, h).data;
  const m = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) m[i] = d[i * 4 + 3] >= thresh ? 1 : 0;
  return m;
};

/** Greyscale (0..1) field painted with canvas ops (uses the red channel over black). */
export const fieldOf = (w: number, h: number, paint: (ctx: CanvasRenderingContext2D) => void): Float32Array => {
  const c = offscreen(w, h);
  c.fillStyle = '#000';
  c.fillRect(0, 0, w, h);
  paint(c);
  const d = c.getImageData(0, 0, w, h).data;
  const f = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) f[i] = d[i * 4] / 255;
  return f;
};

export const dilate = (m: Uint8Array, w: number, h: number, diag = true): Uint8Array => {
  const o = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (m[i]) {
        o[i] = 1;
        continue;
      }
      let on = 0;
      for (let dy = -1; dy <= 1 && !on; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (!diag && dx && dy) continue;
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          if (m[yy * w + xx]) {
            on = 1;
            break;
          }
        }
      o[i] = on;
    }
  return o;
};

export const shift = (m: Uint8Array, w: number, h: number, dx: number, dy: number): Uint8Array => {
  const o = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const sx = x - dx;
      const sy = y - dy;
      if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
      o[y * w + x] = m[sy * w + sx];
    }
  return o;
};

export const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
export const BAYER8 = (() => {
  const b = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  return b.map((v) => (v + 0.5) / 64);
})();

/** Indexed-colour buffer with a palette; blit scales up nearest-neighbour. */
export class IndexBuf {
  w: number;
  h: number;
  px: Uint8Array;
  constructor(w: number, h: number, fill = 0) {
    this.w = w;
    this.h = h;
    this.px = new Uint8Array(w * h).fill(fill);
  }
  set(x: number, y: number, c: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px[(y | 0) * this.w + (x | 0)] = c;
  }
  get(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return -1;
    return this.px[y * this.w + x];
  }
  /** Paint colour c wherever mask is on (optionally only where fn(x,y) true). */
  fill(mask: Uint8Array, c: number | ((x: number, y: number) => number)) {
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const i = y * this.w + x;
        if (!mask[i]) continue;
        const v = typeof c === 'number' ? c : c(x, y);
        if (v >= 0) this.px[i] = v;
      }
  }
  blit(out: CanvasRenderingContext2D, palette: string[], scale: number, ox = 0, oy = 0) {
    const pal = palette.map(hexToRgb);
    const img = out.createImageData(this.w, this.h);
    for (let i = 0; i < this.w * this.h; i++) {
      const [r, g, b] = pal[this.px[i]] ?? [255, 0, 255];
      img.data[i * 4] = r;
      img.data[i * 4 + 1] = g;
      img.data[i * 4 + 2] = b;
      img.data[i * 4 + 3] = 255;
    }
    const tmp = document.createElement('canvas');
    tmp.width = this.w;
    tmp.height = this.h;
    tmp.getContext('2d')!.putImageData(img, 0, 0);
    out.imageSmoothingEnabled = false;
    out.drawImage(tmp, ox, oy, this.w * scale, this.h * scale);
  }
}
