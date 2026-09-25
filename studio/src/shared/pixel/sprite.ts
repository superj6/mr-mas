// MR. MAS — shared pixel engine: sprite + pose helpers (animation conventions as code).
// House rules: drawings are HELD (2s or longer), changes are SWAPS, motion is WHOLE-PIXEL, and nothing is
// ever rotated or scaled. These helpers make the right thing the easy thing.
import {Buf, Sprite, CharPal, clamp} from './px';
import {Img, blitImg} from './figure';
import {stepColor} from './palette';

// ------------------------------------------------------------------ timing
/** Pose from a hold sheet: [[drawing, frames], ...]. Holds past the end on the last drawing (or loops). */
export const holds = <T>(f: number, seq: Array<[T, number]>, loop = false): T => {
  const total = seq.reduce((a, s) => a + s[1], 0);
  let t = loop ? ((f % total) + total) % total : clamp(f, 0, total - 1);
  for (const [v, n] of seq) { if (t < n) return v; t -= n; }
  return seq[seq.length - 1][0];
};
/** Quantise time to n-frame holds (animate "on twos" = n 2). */
export const onN = (f: number, n = 2) => Math.floor(f / n) * n;
/** Cycle through drawings on n-frame holds (walk cycles). */
export const cycle = <T>(f: number, frames: T[], n = 2) => frames[Math.floor(f / n) % frames.length];

export const ease = {
  linear: (t: number) => t,
  in: (t: number) => t * t,
  out: (t: number) => 1 - (1 - t) * (1 - t),
  inOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  /** snap: 70% of the move in the first third (adventure-game "pop" into place) */
  snap: (t: number) => 1 - Math.pow(1 - t, 3),
};
export type Ease = keyof typeof ease;

/**
 * Whole-pixel move from a to b between frames t0..t1, optionally updated only every `hold` frames
 * (a stepped move on 2s reads as animation, a per-frame one reads as a slide).
 */
export const moveTo = (f: number, t0: number, t1: number, a: number, b: number, e: Ease = 'out', hold = 1) => {
  const ff = hold > 1 ? t0 + onN(f - t0, hold) : f;
  const t = clamp((ff - t0) / Math.max(1, t1 - t0), 0, 1);
  return Math.round(a + (b - a) * ease[e](t));
};
export const moveTo2 = (f: number, t0: number, t1: number, a: [number, number], b: [number, number], e: Ease = 'out', hold = 1): [number, number] =>
  [moveTo(f, t0, t1, a[0], b[0], e, hold), moveTo(f, t0, t1, a[1], b[1], e, hold)];

/** Integer hop for an object k frames after an impact: up, hang, land, settle. */
export const hop = (k: number, amp: number) => {
  const seq = [0, -amp, -amp, -Math.ceil(amp / 2), 0, 1, 0];
  return k < 0 || k >= seq.length ? 0 : seq[k];
};
/** Impact shake offsets (door burst default). Returns [0,0] outside the window. */
export const SHAKE_DOOR: Array<[number, number]> = [[2, 0], [-2, 1], [1, -1], [-1, 0]];
export const SHAKE_SLAM: Array<[number, number]> = [[0, 3], [1, -2], [-1, 1], [0, -1], [0, 1]];
export const shakeAt = (f: number, t0: number, seq: Array<[number, number]> = SHAKE_DOOR): [number, number] =>
  f >= t0 && f < t0 + seq.length ? seq[f - t0] : [0, 0];
/** Spring follow-through (hair tufts, antennae) in whole px after an impact. */
export const spring = (f: number, t0: number, seq = [0, -1, 0, 1, 0]) => (f >= t0 && f < t0 + seq.length ? seq[f - t0] : 0);

/** Typewriter: characters shown at frame f for text starting at t0, `cps` chars per frame. */
export const typed = (f: number, t0: number, str: string, cps = 1) => clamp(Math.floor((f - t0) * cps), 0, str.length);
/** Replacement-mouth index for the letter under the typewriter head: 0 rest/closed, 1 mid, 2 open, 3 round. */
export const mouthFor = (ch: string | undefined): 0 | 1 | 2 | 3 => {
  if (!ch || ch === ' ' || /[.,!?]/.test(ch)) return 0;
  if (/[mbpMBP]/.test(ch)) return 0;
  if (/[aAeEiI]/.test(ch)) return 2;
  if (/[oOuUwW]/.test(ch)) return 3;
  return 1;
};
/** Blink drawing for a blink starting at t0: 0 open, 1 half, 2 closed (half-closed-half). */
export const blinkAt = (f: number, t0: number): 0 | 1 | 2 => (f === t0 || f === t0 + 2 ? 1 : f === t0 + 1 ? 2 : 0);
/** Stepped window open (portraits, cards): 0 -> 0.1 -> .33 -> .66 -> 1 over n frames (never a smooth scale). */
export const openStep = (f: number, t0: number, t1 = Infinity, n = 3) => (f < t0 || f >= t1 ? 0 : Math.min(1, (f - t0 + 1) / n));

// ------------------------------------------------------------------ images
/** String-map sprite -> Img (transparent = -1). */
export const imgFromSprite = (s: Sprite, pal: CharPal): Img => {
  const c = new Int32Array(s.w * s.h).fill(-1);
  for (let j = 0; j < s.h; j++)
    for (let i = 0; i < s.w; i++) {
      const v = pal[s.rows[j][i]];
      if (v !== undefined && s.rows[j][i] !== '.' && s.rows[j][i] !== ' ') c[j * s.w + i] = v;
    }
  return {w: s.w, h: s.h, c};
};
/** Region of a Buf -> Img (every pixel opaque, or `key` colour transparent). */
export const imgFromBuf = (b: Buf, x: number, y: number, w: number, h: number, key?: number): Img => {
  const c = new Int32Array(w * h).fill(-1);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const v = b.get(x + i, y + j); if (v !== key) c[j * w + i] = v; }
  return {w, h, c};
};
export const mapImg = (img: Img, f: (c: number, x: number, y: number) => number): Img => {
  const c = new Int32Array(img.c.length);
  for (let i = 0; i < c.length; i++) c[i] = img.c[i] < 0 ? -1 : f(img.c[i], i % img.w, Math.floor(i / img.w));
  return {w: img.w, h: img.h, c};
};
/** Flat silhouette (doorway backlight). */
export const silhouette = (img: Img, col: number) => mapImg(img, () => col);
/** Step every colour along its master family (fade from silhouette to lit = step -3, -2, -1, 0). */
export const stepImg = (img: Img, k: number) => mapImg(img, (c) => stepColor(c, k));
export const flipImg = (img: Img): Img => mapImg(img, (_c, x, y) => img.c[y * img.w + (img.w - 1 - x)]);
/** Add a 1px outline (outside the silhouette, 4-neighbour) in `col`; the result is 2px wider and taller (offset -1,-1). */
export const outlineImg = (img: Img, col: number): Img => {
  const w = img.w + 2, h = img.h + 2;
  const c = new Int32Array(w * h).fill(-1);
  const op = (i: number, j: number) => i >= 0 && j >= 0 && i < img.w && j < img.h && img.c[j * img.w + i] >= 0;
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      if (op(i - 1, j - 1)) c[j * w + i] = img.c[(j - 1) * img.w + i - 1];
      else if (op(i - 2, j - 1) || op(i, j - 1) || op(i - 1, j - 2) || op(i - 1, j)) c[j * w + i] = col;
    }
  return {w, h, c};
};
/** Tight bounds of the opaque pixels [x0, y0, x1, y1] or null. */
export const imgBounds = (img: Img): [number, number, number, number] | null => {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) if (img.c[j * img.w + i] >= 0) { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, j); y1 = Math.max(y1, j); }
  return x1 < 0 ? null : [x0, y0, x1, y1];
};

// ------------------------------------------------------------------ pose sheets
/** A character's drawings with a shared foot anchor (the pixel that sits on the floor line). */
export interface PoseSheet<K extends string = string> {
  poses: Record<K, Img>;
  /** anchor inside each drawing (default: bottom-centre) */
  anchor?: Partial<Record<K, [number, number]>> | [number, number];
}
/** Draw a pose so its anchor lands on (footX, footY). */
export const drawPose = <K extends string>(b: Buf, sheet: PoseSheet<K>, pose: K, footX: number, footY: number, opts: Parameters<typeof blitImg>[4] = {}) => {
  const img = sheet.poses[pose];
  const an = Array.isArray(sheet.anchor) ? sheet.anchor : sheet.anchor?.[pose] ?? [Math.floor(img.w / 2), img.h - 1];
  const ax = opts.flip ? img.w - 1 - an[0] : an[0];
  blitImg(b, img, footX - ax, footY - an[1], opts);
};
