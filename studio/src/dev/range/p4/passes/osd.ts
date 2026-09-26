// MR. MAS · range passes: OSD helpers for the three device sizes (style-range §2.3: OSD only, bezel, full room).
// Honest broadcast grammar with generic marks: a plate that steps in, a crawl, a telestrator loop, a corner bug,
// a timecode. Every element enters in held steps (never a smooth slide) and uses master colours only.
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {tiny, tinyWidth} from '../../../../shared/pixel/rooms/kit-b';
import {osdText, osdWidth} from './osdfont';

/** a flat plate with a 1 px top highlight and a 1 px bottom shade (a broadcast "glass bar" in two rungs) */
export const plate = (b: Buf, x: number, y: number, w: number, h: number, face: number, hi?: number, lo?: number) => {
  rect(x, y, w, h, b.ink(face));
  if (hi !== undefined) rect(x, y, w, 1, b.ink(hi));
  if (lo !== undefined) rect(x, y + h - 1, w, 1, b.ink(lo));
};

/** how much of a plate is revealed at frame k after its start: 3 held steps, left to right (0 before, 1 from k=4) */
export const revealStep = (k: number, steps = 3, hold = 2) => (k < 0 ? 0 : Math.min(1, (Math.floor(k / hold) + 1) / steps));
/** clip-painting helper: run `paint` into a scratch copy, then copy back only x < x0 + w * t */
export const revealed = (b: Buf, x0: number, y0: number, w: number, h: number, t: number, paint: (b: Buf) => void) => {
  if (t <= 0) return;
  if (t >= 1) { paint(b); return; }
  const tmp = b.clone();
  paint(tmp);
  const xe = x0 + Math.round(w * t);
  for (let y = Math.max(0, y0); y < Math.min(b.h, y0 + h); y++) for (let x = Math.max(0, x0); x < Math.min(b.w, xe); x++) b.c[y * b.w + x] = tmp.c[y * b.w + x];
};

/** a crawl: text repeated along a strip, moving `speed` native px per frame (whole pixels), clipped to the strip */
export const crawl = (b: Buf, x0: number, y: number, w: number, txt: string, f: number, col: number, o: {speed?: number; font?: 'osd' | 'tiny'} = {}) => {
  const font = o.font ?? 'tiny';
  const tw = (font === 'osd' ? osdWidth(txt) : tinyWidth(txt)) + 8;
  const off = Math.floor(f * (o.speed ?? 1)) % tw;
  const strip = new Buf(w + tw * 2, 8, 0x1000000);
  for (let k = 0; k * tw < w + tw * 2; k++) {
    if (font === 'osd') osdText(strip, txt, k * tw, 0, col);
    else tiny(strip, txt, k * tw, 1, col);
  }
  for (let j = 0; j < strip.h; j++) for (let i = 0; i < w; i++) {
    const c = strip.c[j * strip.w + i + off];
    if (c !== 0x1000000) b.set(x0 + i, y + j, c);
  }
};

/**
 * The telestrator: an analyst's hand-drawn loop around a point, revealed in held steps (k = frames since the pen went
 * down, `steps` strokes of `hold` frames). A slightly open, overshooting ellipse with a pen wobble, 2 px thick, in the
 * telestrator yellow with a dark keyline so it reads on any picture.
 */
export const telestrator = (b: Buf, cx: number, cy: number, rx: number, ry: number, k: number, o: {steps?: number; hold?: number; col?: number; seed?: number} = {}) => {
  const steps = o.steps ?? 4, hold = o.hold ?? 3;
  if (k < 0) return;
  const t = Math.min(1, (Math.floor(k / hold) + 1) / steps);
  const start = -2.2, sweep = Math.PI * 2 + 0.55; // starts upper-left, overshoots past the start (a real pen loop)
  const n = Math.round(160 * t);
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) {
    const a = start + (sweep * i) / 160;
    const wob = 1 + 0.06 * Math.sin(a * 3 + (o.seed ?? 1)) + 0.04 * Math.sin(a * 7);
    const grow = 1 + 0.1 * (i / 160); // the pen drifts outward as it closes: the loop doesn't meet itself
    pts.push([Math.round(cx + Math.cos(a) * rx * wob * grow), Math.round(cy + Math.sin(a) * ry * wob * grow)]);
  }
  const col = o.col ?? PAL.W7;
  for (const [x, y] of pts) for (const [dx, dy] of [[-1, 0], [2, 0], [0, -1], [0, 2], [2, 1], [-1, 1], [1, 2], [1, -1]]) {
    if (b.get(x + dx, y + dy) !== col) b.set(x + dx, y + dy, PAL.N0);
  }
  for (const [x, y] of pts) { b.set(x, y, col); b.set(x + 1, y, col); b.set(x, y + 1, col); b.set(x + 1, y + 1, col); }
};

/** HH:MM:SS:FF from a frame count (24 fps), for a timecode burn-in */
export const timecode = (f: number, base = 0) => {
  const t = base + f;
  const ff = t % 24, s = Math.floor(t / 24);
  const p = (v: number) => String(v).padStart(2, '0');
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(ff)}`;
};

/** a small boxed tag (LIVE, WEBCAST): micro caps on a flat plate with a 1 px keyline */
export const tag = (b: Buf, s: string, x: number, y: number, face: number, ink: number, key = PAL.N0, dot?: number) => {
  const w = tinyWidth(s) + 6 + (dot !== undefined ? 4 : 0);
  rect(x - 1, y - 1, w + 2, 9, b.ink(key));
  rect(x, y, w, 7, b.ink(face));
  let tx = x + 3;
  if (dot !== undefined) { rect(x + 2, y + 2, 3, 3, b.ink(dot)); tx += 4; }
  tiny(b, s, tx, y + 1, ink);
  return w;
};

/** a whole-pixel number formatter with thousands commas */
export const commas = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const clamp01 = (v: number) => clamp(v, 0, 1);
