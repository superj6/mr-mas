// MR. MAS — shared pixel engine: GENERATED-VIDEO inserts (pure part, no DOM; runs in Node previews too).
//
// A generated clip is converted OFFLINE by studio/tools/genvideo/pixelize.py into native 480x270 indexed PNG
// drawings (every pixel a master-palette colour) + clip.json (the 24 fps timeline, held on 2s). Inside a pixel
// shot it is just another palette-constrained Buf, so everything in the engine applies to it: masks, palette
// switches, GLYPH, the render front, family steps. The DOM side (loading the PNGs) is GenVideo.tsx.
//
//   blitGen(fb, gen, {mask})            composite the clip inside a mask (only the sky, only the ceiling hole)
//   genHandoff(fb, gen, t)              ordered-dither handoff between our frame and the clip (see the rule below)
//   maskFromColors(fb, cols, rect)      key a region by palette colour (the window's sky colours, a KEY colour)
//   genDrawingAt(clip, f, placement)    which drawing shows at composition frame f
//
// THE JOIN RULE (PIXEL_GUIDE §2 rule 7: four transitions only). A generated insert joins our pixel scene by a
// MATCH CUT: the clip was conditioned on our own frame (tools/genvideo/keyframes.py), so its first drawing is
// our frame and a hard cut is invisible. genHandoff() exists to hide the small re-quantisation difference over
// 2-6 frames on frames that already match; it is not a visible transition. A visible change of world uses the
// show's vocabulary (renderFront between our Buf and the clip's Buf, the whip, the freeze flash, the candle wipe).
import {Buf, TRANSPARENT} from './px';
import {PAL} from './palette';
import {Mask} from './mask';
import {Threshold, bayer8} from './dither';

/** clip.json, as written by pixelize.py */
export interface GenClipManifest {
  version: number;
  id: string;
  /** native size of every drawing (480x270 unless converted for a sub-region) */
  native: [number, number];
  fps: number;
  durationInFrames: number;
  /** 'BASE' = master palette; otherwise the engine palette set baked in at conversion */
  palette: string;
  families?: string;
  /** drawing file names (relative to the clip folder) */
  drawings: string[];
  /** output frame -> drawing index (held drawings repeat) */
  timeline: number[];
  source?: Record<string, unknown>;
  params?: Record<string, unknown>;
  stats?: Record<string, number>;
}

export interface GenPlacement {
  /** composition frame at which the clip's frame 0 shows. Default 0 */
  from?: number;
  /** skip this many clip frames at the start. Default 0 */
  offset?: number;
  /** before `from` / after the end: 'hold' the first/last drawing, 'none' (null). Default 'hold' */
  outside?: 'hold' | 'none';
  /** loop the clip (plates: drifting clouds, smoke). Default false */
  loop?: boolean;
  /** play on Ns: re-time to whole-frame holds (1 = as converted). Default 1 */
  stretch?: number;
}

/** Drawing index for composition frame `f`, or null (outside the clip with outside: 'none'). */
export const genDrawingAt = (clip: GenClipManifest, f: number, p: GenPlacement = {}): number | null => {
  const n = clip.timeline.length;
  let k = Math.floor((f - (p.from ?? 0)) / Math.max(1, p.stretch ?? 1)) + (p.offset ?? 0);
  if (p.loop) k = ((k % n) + n) % n;
  else if (k < 0 || k >= n) {
    if ((p.outside ?? 'hold') === 'none') return null;
    k = k < 0 ? 0 : n - 1;
  }
  return clip.timeline[k];
};

export interface BlitGenOpts {
  /** composite only inside this mask (soft coverage resolves with `edge`) */
  mask?: Mask;
  /** composite OUTSIDE the mask instead */
  invert?: boolean;
  /** threshold for soft mask edges. Default bayer8 (a clean ordered seam, like every masked op) */
  edge?: Threshold;
  /** whole-pixel offset of the clip (dst = src shifted by dx, dy) — never scale a clip, crop it at conversion */
  dx?: number;
  dy?: number;
  /** clip colours to treat as transparent (a keyed plate) */
  key?: number[];
}

/** Composite a generated drawing into the frame (inside a mask, at a whole-pixel offset). */
export const blitGen = (fb: Buf, gen: Buf, o: BlitGenOpts = {}) => {
  const dx = (o.dx ?? 0) | 0, dy = (o.dy ?? 0) | 0;
  const edge = o.edge ?? bayer8;
  const key = o.key ? new Set(o.key) : null;
  const m = o.mask;
  for (let y = 0; y < fb.h; y++) {
    const sy = y - dy;
    if (sy < 0 || sy >= gen.h) continue;
    for (let x = 0; x < fb.w; x++) {
      const sx = x - dx;
      if (sx < 0 || sx >= gen.w) continue;
      if (m && m.on(x, y, edge) === !!o.invert) continue;
      const c = gen.c[sy * gen.w + sx];
      if (c >= TRANSPARENT || (key && key.has(c))) continue;
      fb.c[y * fb.w + x] = c;
    }
  }
  return fb;
};

/**
 * Ordered-dither HANDOFF from our frame (fb) to the clip, t 0..1 (0 = all ours, 1 = all clip). Pixels that
 * already agree never change, so on a conditioned match cut only the re-quantisation differences dissolve.
 * Keep it to 2-6 frames on the beat (see THE JOIN RULE above).
 */
export const genHandoff = (fb: Buf, gen: Buf, t: number, o: {mask?: Mask; thr?: Threshold; dx?: number; dy?: number} = {}) => {
  const thr = o.thr ?? bayer8;
  const dx = (o.dx ?? 0) | 0, dy = (o.dy ?? 0) | 0;
  for (let y = 0; y < fb.h; y++)
    for (let x = 0; x < fb.w; x++) {
      if (o.mask && !o.mask.on(x, y)) continue;
      const sx = x - dx, sy = y - dy;
      if (sx < 0 || sy < 0 || sx >= gen.w || sy >= gen.h) continue;
      const c = gen.c[sy * gen.w + sx];
      if (c < TRANSPARENT && thr(x, y) < t) fb.c[y * fb.w + x] = c;
    }
  return fb;
};

/** Mask of the pixels of `b` whose colour is in `cols` (optionally only inside rect [x, y, w, h]). */
export const maskFromColors = (b: Buf, cols: number[], rect?: [number, number, number, number]) => {
  const set = new Set(cols);
  const [rx, ry, rw, rh] = rect ?? [0, 0, b.w, b.h];
  const m = new Mask(b.w, b.h);
  for (let y = Math.max(0, ry); y < Math.min(b.h, ry + rh); y++)
    for (let x = Math.max(0, rx); x < Math.min(b.w, rx + rw); x++) if (set.has(b.c[y * b.w + x])) m.a[y * b.w + x] = 255;
  return m;
};

/** Mask from any predicate on (colour, x, y). */
export const maskFromBuf = (b: Buf, pred: (c: number, x: number, y: number) => boolean) => {
  const m = new Mask(b.w, b.h);
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) if (pred(b.c[y * b.w + x], x, y)) m.a[y * b.w + x] = 255;
  return m;
};

/** RGBA pixels (canvas ImageData, a decoded PNG) -> Buf; alpha < 128 -> TRANSPARENT. */
export const bufFromRGBA = (data: Uint8ClampedArray | Uint8Array, w: number, h: number) => {
  const b = new Buf(w, h, PAL.N0);
  for (let i = 0; i < w * h; i++)
    b.c[i] = data[i * 4 + 3] < 128 ? TRANSPARENT : (data[i * 4] << 16) | (data[i * 4 + 1] << 8) | data[i * 4 + 2];
  return b;
};
