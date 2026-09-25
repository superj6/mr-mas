// MR. MAS — shared pixel engine: pixel-native transitions. All ordered-dither, all whole-pixel, deterministic.
//   renderFront  a glowing scanline sweeps the frame; behind it the image is "re-rendered" in palette/scene B.
//   ditherFade   ordered-dither crossfade A -> B (bayer8 = 64 steps).
//   ditherWipe   directional wipe with a dithered seam.
import {Buf, clamp} from './px';
import {PAL} from './palette';
import {Threshold, bayer8, bayer4} from './dither';

export type Dir = 'down' | 'up' | 'right' | 'left';

/** distance along a sweep direction for pixel (x, y) in a w x h frame */
const along = (dir: Dir, x: number, y: number, w: number, h: number) =>
  dir === 'down' ? y : dir === 'up' ? h - 1 - y : dir === 'right' ? x : w - 1 - x;
const extent = (dir: Dir, w: number, h: number) => (dir === 'down' || dir === 'up' ? h : w);

export interface FrontOpts {
  dir?: Dir;
  /** px behind the line where A and B are still interleaved (motion smear; use the per-frame travel). Default 6. */
  smear?: number;
  /** glow half-width in px (emissive dither around the line). Default 5. */
  glow?: number;
  /** line colours, hottest first: [core, inner, ...falloff]. Default monitor cyan C9..C4. */
  core?: number[];
  /** 1px horizontal tear on the rows under the beam (energy). Default 1; 0 = none. */
  tear?: number;
}

/**
 * Render-front: out = B where the beam has passed, A ahead of it. `pos` is the beam position in px along `dir`
 * (0..extent). Deterministic; call per frame with `frontPos()`.
 */
export const renderFront = (out: Buf, a: Buf, b: Buf, pos: number, o: FrontOpts = {}) => {
  const dir = o.dir ?? 'down';
  const smear = Math.max(1, o.smear ?? 6);
  const glow = o.glow ?? 5;
  const core = o.core ?? [PAL.C9, PAL.C8, PAL.C7, PAL.C6, PAL.C5, PAL.C4];
  const tear = o.tear ?? 1;
  const w = out.w, h = out.h;
  pos = Math.round(pos);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = along(dir, x, y, w, h);
      const k = d - pos; // <0 behind the line (already upgraded), >0 ahead
      let src: Buf;
      if (k < -smear) src = b;
      else if (k < 0) src = bayer8(x, y) < (-k / smear) ? b : a; // interleave: more B the further behind
      else src = a;
      // beam tear: the few px under the beam read one px displaced (like a raster being rewritten)
      let sx = x, sy = y;
      if (tear && Math.abs(k) <= 1) { if (dir === 'down' || dir === 'up') sx = clamp(x - tear, 0, w - 1); else sy = clamp(y - tear, 0, h - 1); }
      let c = src.c[sy * w + sx];
      const ak = Math.abs(k);
      if (ak === 0) c = core[0];
      else if (ak === 1 && k < 0) c = core[1];
      else if (ak <= glow) {
        // emissive falloff, denser behind the line (the freshly written raster is still hot)
        const s = 1 - (ak - 1) / glow;
        const dens = (k < 0 ? 0.7 : 0.4) * s * s;
        if (bayer4(x, y) < dens) c = core[Math.min(core.length - 1, 1 + Math.floor((ak / glow) * (core.length - 1)))];
      }
      out.c[y * w + x] = c;
    }
  return out;
};

/**
 * Beam position for frame `f` of a sweep lasting `frames`, starting at `t0`, eased in-out, quantised to whole
 * px. Returns {pos, smear} (smear = travel since last frame, so the interleave band always covers the jump).
 * The beam starts just before the frame and ends just past it so first/last frames are clean A / clean B.
 */
export const frontPos = (f: number, t0: number, frames: number, len: number, glow = 5) => {
  const at = (ff: number) => {
    const t = clamp((ff - t0) / Math.max(1, frames - 1), 0, 1);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return Math.round(-glow - 2 + e * (len + glow * 2 + 4));
  };
  const pos = at(f);
  return {pos, smear: Math.min(16, Math.max(3, pos - at(f - 1)))};
};

/** Ordered-dither crossfade: t = 0 -> A, 1 -> B. */
export const ditherFade = (out: Buf, a: Buf, b: Buf, t: number, thr: Threshold = bayer8) => {
  for (let y = 0; y < out.h; y++)
    for (let x = 0; x < out.w; x++) {
      const i = y * out.w + x;
      out.c[i] = thr(x, y) < t ? b.c[i] : a.c[i];
    }
  return out;
};

/** Directional wipe with a dithered seam `soft` px wide. pos = seam position along dir. */
export const ditherWipe = (out: Buf, a: Buf, b: Buf, pos: number, o: {dir?: Dir; soft?: number; thr?: Threshold} = {}) => {
  const dir = o.dir ?? 'right', soft = Math.max(1, o.soft ?? 12), thr = o.thr ?? bayer8;
  for (let y = 0; y < out.h; y++)
    for (let x = 0; x < out.w; x++) {
      const i = y * out.w + x;
      const t = clamp((pos - along(dir, x, y, out.w, out.h)) / soft + 0.5, 0, 1);
      out.c[i] = thr(x, y) < t ? b.c[i] : a.c[i];
    }
  return out;
};

export {extent as sweepExtent};
