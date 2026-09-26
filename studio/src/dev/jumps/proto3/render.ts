// MR. MAS — style jump prototype C · J6 · THE RING: one frame, both media. Pure (no DOM), so the Remotion component
// and the Node preview produce the same pixels.
//   'jump'       the booked jump: pixel -> the ring's front hands the water to the continuous renderer -> snap
//   'quantized'  genai-candidates' alternative (decision 8 in style-jumps §7.1): the same ring, kept on the grid —
//                palette-bound, whole-pixel displacement, on 2s. Not a jump; the comparison the showrunner asked for.
import {Buf} from '../../../shared/pixel/px';
import {stepColor} from '../../../shared/pixel/palette';
import {G, inWater, pixelFrame, pixelWaterAt, KEY} from './art';
import {CLIP, KNOBS, paintContinuous, surface} from './ring';

export type Variant = 'jump' | 'quantized';
export const OUT_W = 1920, OUT_H = 1080;

/** the same ring, on the grid: whole-pixel displacement of the drawn water + a one-rung crest / trough, held on 2s */
const quantizedRing = (fb: Buf, p: number) => {
  if (p < CLIP.jumpIn || p >= CLIP.snap) return fb;
  const pq = p - (p % 2);
  const ll = Math.hypot(KEY[0] * 0.8, KEY[1] * 0.8, 0.6);
  const L = [(KEY[0] * 0.8) / ll, (KEY[1] * 0.8) / ll, 0.6 / ll];
  for (let y = G.cy - G.Rw - 1; y <= G.cy + G.Rw; y++)
    for (let x = G.cx - G.Rw - 1; x <= G.cx + G.Rw; x++) {
      if (!inWater(x, y)) continue;
      const dx = x + 0.5 - G.cx, dy = y + 0.5 - G.cy, rho = Math.hypot(dx, dy);
      const rx = rho > 0 ? dx / rho : 0, ry = rho > 0 ? dy / rho : 0;
      const [s, h] = surface(rho, pq);
      if (s === 0 && h === 0) continue;
      const sx = Math.round(x + rx * s * KNOBS.kRefl * 0.7), sy = Math.round(y + ry * s * KNOBS.kRefl * 0.7);
      let c = pixelWaterAt(inWater(sx, sy) ? sx : x, inWater(sx, sy) ? sy : y, p);
      const nx = -s * rx, ny = -s * ry, nl = Math.hypot(nx, ny, 1);
      const lift = ((nx * L[0] + ny * L[1] + L[2]) / nl - L[2]) * KNOBS.kShade + h * KNOBS.kHeight;
      if (lift > 0.45) c = stepColor(c, 2);
      else if (lift > 0.16) c = stepColor(c, 1);
      else if (lift < -0.16) c = stepColor(c, -1);
      fb.set(x, y, c);
    }
  return fb;
};

/** Frame p of the clip as 1920 x 1080 RGBA. */
export const renderFrame = (p: number, variant: Variant = 'jump', out?: Uint8ClampedArray): Uint8ClampedArray => {
  let fb = pixelFrame(p);
  if (variant === 'quantized') fb = quantizedRing(fb, p);
  const rgba = out ?? new Uint8ClampedArray(OUT_W * OUT_H * 4);
  // present: 4x nearest-neighbour (the 480 x 270 grid exactly fills 1080p)
  for (let y = 0; y < fb.h; y++)
    for (let x = 0; x < fb.w; x++) {
      const c = fb.c[y * fb.w + x];
      const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
      for (let j = 0; j < 4; j++) {
        let o = ((y * 4 + j) * OUT_W + x * 4) * 4;
        for (let i = 0; i < 4; i++, o += 4) { rgba[o] = r; rgba[o + 1] = g; rgba[o + 2] = b; rgba[o + 3] = 255; }
      }
    }
  if (variant === 'jump') paintContinuous(rgba, p);
  return rgba;
};
