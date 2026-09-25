// MR. MAS — mfinale: headline type. The show's display face is the 7px pixel face upscaled with Scale2x
// (bigText, 14px caps). Headlines (CHATGTP / FIRED. / BACK.) run it through Scale2x once more: 28px caps with
// 4px stems and stepped-smooth diagonals — still the same hand-pixelled face, just bigger, never a filter.
import {Buf, rect} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {text, textWidth, BIG_CAP} from '../../shared/pixel/font';

export const HUGE_CAP = BIG_CAP * 2; // 28

const cache = new Map<string, {w: number; h: number; a: Uint8Array}>();
/**
 * 28px-cap bitmap of a string (1 = ink): the 7px face at 4x, where every true diagonal step (two pixels touching
 * only at a corner) is filled into a clean 45-degree edge. Square corners stay square, so D stays a D.
 */
export const hugeBitmap = (s: string) => {
  let hit = cache.get(s);
  if (hit) return hit;
  const S = 4;
  const w0 = textWidth(s) + 2, h0 = 10;
  const b = new Buf(w0, h0, 0);
  text(b, s, 1, 1, 1);
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < w0 && y < h0 && b.c[y * w0 + x] === 1;
  const w = w0 * S, h = h0 * S;
  const a = new Uint8Array(w * h);
  for (let y = 0; y < h0; y++) for (let x = 0; x < w0; x++) if (on(x, y)) for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) a[(y * S + j) * w + x * S + i] = 1;
  const tri = (cx: number, cy: number, f: (i: number, j: number) => boolean) => {
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) if (f(i, j)) a[(cy * S + j) * w + cx * S + i] = 1;
  };
  for (let y = 0; y < h0 - 1; y++)
    for (let x = 0; x < w0 - 1; x++) {
      // "\" step: (x,y) and (x+1,y+1) on, the two others off
      if (on(x, y) && on(x + 1, y + 1) && !on(x + 1, y) && !on(x, y + 1)) {
        tri(x + 1, y, (i, j) => i <= j - 1);
        tri(x, y + 1, (i, j) => i >= j + 1);
      }
      // "/" step: (x+1,y) and (x,y+1) on
      if (on(x + 1, y) && on(x, y + 1) && !on(x, y) && !on(x + 1, y + 1)) {
        tri(x, y, (i, j) => i + j >= S);
        tri(x + 1, y + 1, (i, j) => i + j <= S - 2);
      }
    }
  // shift so caps start at y 0 (the 7px face was drawn at y 1)
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h - S; y++) for (let x = 0; x < w - S; x++) out[y * w + x] = a[(y + S) * w + x + S];
  hit = {w, h, a: out};
  cache.set(s, hit);
  return hit;
};
export const hugeWidth = (s: string) => {
  const bm = hugeBitmap(s);
  let mx = 0;
  for (let y = 0; y < bm.h; y++) for (let x = 0; x < bm.w; x++) if (bm.a[y * bm.w + x] && x > mx) mx = x;
  return mx + 1;
};

/**
 * 28px headline. `fill(x, y)` colours each ink pixel (row-banded fills read as printed metal/neon);
 * shadow = 2px deep drop shadow. `rows` limits how many rows are revealed (a slam-in wipe).
 */
export const hugeText = (b: Buf, s: string, x: number, y: number, fill: number | ((lx: number, ly: number) => number), o: {shadow?: number; deep?: number; rows?: number} = {}) => {
  const bm = hugeBitmap(s);
  const deep = o.deep ?? 2;
  const col = typeof fill === 'number' ? () => fill : fill;
  const lim = o.rows ?? bm.h;
  if (o.shadow !== undefined)
    for (let d = deep; d >= 1; d--)
      for (let j = 0; j < Math.min(lim, bm.h); j++) for (let i = 0; i < bm.w; i++) if (bm.a[j * bm.w + i]) b.set(x + i + d, y + j + d, o.shadow);
  for (let j = 0; j < Math.min(lim, bm.h); j++) for (let i = 0; i < bm.w; i++) if (bm.a[j * bm.w + i]) b.set(x + i, y + j, col(i, j));
};

/**
 * The slot's news plate (same language as the founders' name cards): black plate, accent top rule,
 * the 28px headline, an accent underline, and an egg-size line under it.
 */
export const newsPlate = (b: Buf, x: number, y: number, head: string, accent: number, line: string | null, k: number, o: {headCol?: number | ((lx: number, ly: number) => number); lineCol?: number; lineCps?: number} = {}) => {
  if (k < 0) return;
  const hw = hugeWidth(head);
  const lw = line ? textWidth(line) : 0;
  const bw = Math.max(hw, lw) + 14;
  const bh = HUGE_CAP + (line ? 24 : 12);
  // the plate opens in 2 held steps (rule first, then the plate), the headline cuts in on the 2nd frame
  if (k === 0) { rect(x - 6, y - 6, bw, 2, b.ink(accent)); rect(x - 6, y - 4, bw, 3, b.ink(PAL.N0)); return; }
  rect(x - 6, y - 6, bw, bh, b.ink(PAL.N0));
  rect(x - 6, y - 6, bw, 1, b.ink(accent));
  hugeText(b, head, x, y, o.headCol ?? accent, {shadow: PAL.N0});
  rect(x, y + HUGE_CAP + 3, Math.min(hw, 6 + k * 24), 2, b.ink(accent));
  if (line && k >= 2) text(b, line.slice(0, Math.max(0, Math.floor((k - 2) * (o.lineCps ?? 3)))), x, y + HUGE_CAP + 9, o.lineCol ?? PAL.N6);
};
