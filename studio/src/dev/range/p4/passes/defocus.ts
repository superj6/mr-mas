// MR. MAS · range passes: STEPPED-RESOLUTION DEFOCUS (style-range §2.4: "Never blur pixel art. Defocus is stepped
// resolution in bands"). A region is re-sampled to n x n blocks aligned to the native grid (2x2 for the near band,
// 4x4 for the far one). Each block takes the linear-light average of its pixels, snapped back to the master palette,
// so the result is still our palette and still square pixels, just bigger ones. It is the only depth of field a
// pixel pass has (P4 SPORTS' crowd, P7 PHONE's portrait mode, P23 PROMO GRADE, the CU backdrops).
import {Buf} from '../../../../shared/pixel/px';
import {averageSnap} from './color';

export type Region = (x: number, y: number) => boolean;

/**
 * Re-sample the pixels of `b` inside [x0, x0+w) x [y0, y0+h) (and inside `region`, if given) to n x n blocks.
 * Blocks align to the GLOBAL grid (x % n === 0), so two bands with different n meet on a clean stepped seam.
 * `keep` pixels (e.g. a figure standing in front of the band) are neither averaged nor overwritten.
 */
export const stepDefocus = (b: Buf, x0: number, y0: number, w: number, h: number, n: number, o: {region?: Region; keep?: Region} = {}) => {
  if (n <= 1) return;
  const xs = Math.floor(x0 / n) * n, ys = Math.floor(y0 / n) * n;
  const tmp: number[] = [];
  for (let by = ys; by < y0 + h; by += n)
    for (let bx = xs; bx < x0 + w; bx += n) {
      tmp.length = 0;
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const x = bx + i, y = by + j;
        if (x < x0 || y < y0 || x >= x0 + w || y >= y0 + h || x >= b.w || y >= b.h || x < 0 || y < 0) continue;
        if (o.region && !o.region(x, y)) continue;
        if (o.keep && o.keep(x, y)) continue;
        tmp.push(b.c[y * b.w + x]);
      }
      if (!tmp.length) continue;
      const c = averageSnap(tmp);
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const x = bx + i, y = by + j;
        if (x < x0 || y < y0 || x >= x0 + w || y >= y0 + h || x >= b.w || y >= b.h || x < 0 || y < 0) continue;
        if (o.region && !o.region(x, y)) continue;
        if (o.keep && o.keep(x, y)) continue;
        b.c[y * b.w + x] = c;
      }
    }
};

/** Depth bands: rows [y0, y1) at block size n, each band re-sampled in turn (far bands first). */
export const defocusBands = (b: Buf, bands: Array<{y0: number; y1: number; n: number; x0?: number; x1?: number}>, o: {keep?: Region} = {}) => {
  for (const d of bands) stepDefocus(b, d.x0 ?? 0, d.y0, (d.x1 ?? b.w) - (d.x0 ?? 0), d.y1 - d.y0, d.n, o);
};

/** Defocus everything outside a mask of pixels that stay sharp (a figure), by distance-free bands: one call per n. */
export const defocusOutside = (b: Buf, sharp: Uint8Array, n: number, x0 = 0, y0 = 0, w = b.w, h = b.h) =>
  stepDefocus(b, x0, y0, w, h, n, {keep: (x, y) => sharp[y * b.w + x] > 0});

/**
 * An out-of-focus point light: a hard-edged disc in the lens's aperture shape (sides 0 = round, 6 = the Orb's six
 * blades), its body `fill` laid over what's behind on an ordered dither of `density`, and a 1 px `rim` (the brighter
 * ring real bokeh has). Paired with the stepped bands, it's what reads "out of focus" in a pixel frame, where a blur
 * would only read "smeared". Whole pixels, master colours, no blending.
 */
export const bokeh = (b: Buf, cx: number, cy: number, r: number, fill: number, rim: number, o: {density?: number; sides?: number; rot?: number} = {}) => {
  const density = o.density ?? 1, sides = o.sides ?? 0, rot = o.rot ?? 0;
  const R = Math.ceil(r) + 1;
  for (let y = Math.floor(cy - R); y <= Math.ceil(cy + R); y++)
    for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
      let d = Math.hypot(dx, dy);
      if (sides >= 3) {
        const seg = (Math.PI * 2) / sides;
        const a = ((Math.atan2(dy, dx) - rot) % seg + seg) % seg - seg / 2;
        d = (d * Math.cos(a)) / Math.cos(seg / 2);
      }
      if (d > r) continue;
      if (d > r - 1) b.set(x, y, rim);
      else if (bayerAt(x, y) < density) b.set(x, y, fill);
    }
};
const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const bayerAt = (x: number, y: number) => (BAYER4[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
