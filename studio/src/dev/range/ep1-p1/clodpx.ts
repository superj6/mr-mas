// MR. MAS — range E1-P1: the generated pixel data (gen/clod-px.json, written by tools/pxclod.ts from the clay's
// own render of its first key). The pixel CLOD of phrase 1 is the clay's silhouette on the grid, so the change at the
// slam reads as light, not a cut; the clay's contact shadow reaches the pixel plinth and floor as whole rungs.
import type {Img} from '../../../shared/pixel/figure';
import type {ClodPixel} from './pixel';

export interface ClodPixelJSON {
  x: number; y: number; w: number; h: number;
  /** each drawing: rows of palette indices into `pal` ('.' = clear), base-36 */
  frames: string[][]; pal: number[];
  shadow: Record<string, {x: number; y: number; w: number; h: number; k: string}>;
  /** round 5: the clay's coverage on the grid per key pose, hex-packed (4 cells a digit, bit b = cell q + b) */
  cover?: {x: number; y: number; w: number; h: number; keys: Record<string, string>};
}
export const loadClodPixel = (j: ClodPixelJSON): ClodPixel => {
  const frames: Img[] = j.frames.map((rows) => {
    const c = new Int32Array(j.w * j.h).fill(-1);
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== '.') c[y * j.w + x] = j.pal[parseInt(r[x], 36)]; });
    return {w: j.w, h: j.h, c};
  });
  const shadow: ClodPixel['shadow'] = {};
  for (const [id, s] of Object.entries(j.shadow)) shadow[id] = {x: s.x, y: s.y, w: s.w, h: s.h, k: [...s.k].map((ch) => Number(ch))};
  const cover: ClodPixel['cover'] = {};
  if (j.cover) for (const [id, hex] of Object.entries(j.cover.keys)) {
    const n = j.cover.w * j.cover.h, a = new Uint8Array(n);
    for (let q = 0; q < n; q++) a[q] = (parseInt(hex[q >> 2], 16) >> (q & 3)) & 1;
    cover[id] = {x: j.cover.x, y: j.cover.y, w: j.cover.w, h: j.cover.h, a};
  }
  return {frames, x: j.x, y: j.y, shadow, cover};
};
