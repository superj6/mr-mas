// MR. MAS — kit: EMIT's YEAR-END COVER (Ep1 sc 32; new file, owned by the `v3-art-b` pass). naming.md: EMIT for TIME. A
// parody cover in deliberately off-brand colours (guardrails: no real masthead, no red border): a deep teal border, the
// plain slab masthead `EMIT` in gold, Mas full-bleed, calm, lit like a keynote (a warm spot from above, the stage's cyan
// rim), and `CEO OF THE YEAR` at the foot. Each size is its own layout (never a scale of another):
//   drawEmitCover(b, x, y, size, o)   'ecu' 150 x 196 (the delivery's insert, the Orb's re-scan in close) · 'mcu' 104 x 136
//                                     (held up next to his face: the cover's face his portrait's, the same expression) ·
//                                     'desk' 26 x 34 (in his hand / on the tray in the two-shot) · 'wall' 18 x 24
//                                     (pinned on the back wall in the wide)
//   EMIT_SIZE                         the sizes
import {Buf, rect, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../cast/mas';

export const EMIT_SIZE = {ecu: [150, 196], mcu: [104, 136], desk: [26, 34], wall: [18, 24]} as Record<'ecu' | 'mcu' | 'desk' | 'wall', [number, number]>;
/** the masthead's letters, a plain slab face at 2 cells (6 x 9 grid) */
const SLAB: Record<string, string[]> = {
  E: ['######', '##....', '##....', '#####.', '##....', '##....', '##....', '######', '######'],
  M: ['##..##', '###.##', '######', '##.#.#', '##...#', '##...#', '##...#', '##...#', '##...#'],
  I: ['######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..', '######', '######'],
  T: ['######', '######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'],
};
const slab = (b: Buf, s: string, x: number, y: number, cell: number, col: number, shadow?: number) => {
  let cx = x;
  for (const ch of s) {
    const g = SLAB[ch];
    if (!g) { cx += 4 * cell; continue; }
    g.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') { if (shadow !== undefined) rect(cx + i * cell + 1, y + j * cell + 1, cell, cell, b.ink(shadow)); } });
    g.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') rect(cx + i * cell, y + j * cell, cell, cell, b.ink(col)); });
    cx += 7 * cell;
  }
  return cx - x - cell;
};
/** Mas as the cover shoots him: his portrait's near-front head, the tiny closed smile, lit warm from above (keynote) */
const coverFace = (big: boolean) => masPortrait({...MAS_PORTRAIT_DEFAULT, head: 'front', mouth: 'rest', light: 'warm', look: 0, lid: big ? 0 : 0});
export const drawEmitCover = (b: Buf, x: number, y: number, size: 'ecu' | 'mcu' | 'desk' | 'wall', o: {sheen?: boolean} = {}) => {
  const [w, h] = EMIT_SIZE[size];
  const border = PAL.C2, borderHi = PAL.C4;
  if (size === 'desk' || size === 'wall') {
    // small: the teal border, a gold masthead bar, a face-shaped warm oval and the dark band of the headline
    rect(x, y, w, h, b.ink(border)); rect(x, y, w, 1, b.ink(borderHi));
    rect(x + 2, y + 2, w - 4, h - 4, b.ink(PAL.N2));
    rect(x + 3, y + 3, w - 6, size === 'desk' ? 5 : 3, b.ink(PAL.W6));
    const cx = x + (w >> 1), cy = y + Math.round(h * 0.5);
    for (let j = -6; j <= 8; j++) for (let i = -5; i <= 5; i++) if (Math.hypot(i / 5, j / 7) <= 1) b.set(cx + i, cy + j - (size === 'wall' ? 2 : 0), j < -3 ? PAL.B2 : PAL.S4);
    rect(x + 3, y + h - (size === 'desk' ? 7 : 5), w - 6, size === 'desk' ? 3 : 2, b.ink(PAL.P2));
    return;
  }
  // big: the border, the photo full-bleed inside it, the masthead over the photo's top, the headline at the foot
  rect(x, y, w, h, b.ink(border));
  for (let i = 0; i < w; i++) b.set(x + i, y, borderHi);
  const bw = size === 'ecu' ? 6 : 4;
  const px = x + bw, py = y + bw, pw2 = w - 2 * bw, ph = h - 2 * bw;
  // the backdrop: a keynote's dark, a warm spot from above, the stage's cyan at the edges
  for (let j = 0; j < ph; j++) for (let i = 0; i < pw2; i++) {
    const d = Math.hypot((i - pw2 / 2) / (pw2 * 0.55), (j - ph * 0.35) / (ph * 0.6));
    b.set(px + i, py + j, d < 0.6 ? (bayer(i, j) < 0.5 ? PAL.W2 : PAL.W1) : d < 0.9 ? PAL.W1 : i < 6 || i > pw2 - 7 ? PAL.C1 : PAL.N1);
  }
  const face = coverFace(size === 'ecu');
  // the portrait's head and shoulders, cropped into the photo (1:1: the cover's face is his portrait)
  const ox = px + Math.round(pw2 / 2) - 56, oy = py + (size === 'ecu' ? 30 : 12);
  for (let j = 0; j < face.h; j++) for (let i = 0; i < face.w; i++) {
    const v = face.c[j * face.w + i];
    const X = ox + i, Y = oy + j;
    if (v < 0 || X < px || X >= px + pw2 || Y < py || Y >= py + ph) continue;
    b.set(X, Y, v);
  }
  // the masthead over the photo (behind nothing: EMIT sits over his hair, as covers do)
  const cell = size === 'ecu' ? 3 : 2;
  const mw = 4 * 7 * cell - cell;
  slab(b, 'EMIT', px + Math.round((pw2 - mw) / 2), py + 4, cell, PAL.W7, PAL.N0);
  // the headline band at the foot
  const hl = 'CEO OF THE YEAR';
  const band = size === 'ecu' ? 40 : 16;
  rect(px, py + ph - band, pw2, band, b.ink(PAL.N0));
  if (size === 'ecu') {
    const a1 = 'CEO OF', a2 = 'THE YEAR';
    bigText(b, a1, px + Math.round((pw2 - bigTextWidth(a1)) / 2), py + ph - band + 4, PAL.P2);
    bigText(b, a2, px + Math.round((pw2 - bigTextWidth(a2)) / 2), py + ph - band + 21, PAL.W7);
  } else text(b, hl, px + Math.round((pw2 - textWidth(hl)) / 2), py + ph - band + 5, PAL.P2);
  // the fine print: the year-end issue line, the cover's price corner
  const fine = 'YEAR-END ISSUE';
  if (size === 'ecu') tiny(b, fine, px + pw2 - tinyWidth(fine) - 3, py + 34, PAL.P1);
  if (o.sheen) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const d = i + j * 0.6 - w * 0.9; if (d > 0 && d < 3 && bayer(i, j) < 0.6) b.set(x + i, y + j, stepColor(b.get(x + i, y + j), 1)); }
  void hash;
};
