// MR. MAS — mcoldopen: the LCD macro. The cold open starts inside the monitor: the same screen buffer the
// medium shot shows 1:1, magnified by an integer P, so its own pixels (and their R/G/B subpixel stripes)
// become visible. The dolly-out is three integer steps on three beats: P9 -> P3 -> 1:1, always centred on
// the caret (CARET_FRAME), so the steps read as one move, not three shots.
import {Buf, bayer} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';

// subpixel ramps (index 0 = the "off" state: a black LCD is never quite black at macro range)
const RR = [PAL.D0, PAL.R0, PAL.R1, PAL.R2, PAL.R3, PAL.R3];
const GG = [PAL.N1, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.K4];
const BB = [PAL.N1, PAL.N3, PAL.N5, PAL.N7, PAL.C5, PAL.C7];
/** channel 0..255 -> subpixel level 0..5; dark UI greys (and cyan's weak red) stay OFF so the black stays black */
const lvl = (v: number) => (v < 72 ? 0 : Math.max(1, Math.min(5, Math.round(((v - 72) / 183) * 5 + 0.45))));

export interface MacroOpts {
  /** screen px drawn at `anchor` (its cell's top-left) */
  focus: [number, number];
  anchor: [number, number];
  /** colour outside the screen (the bezel) */
  outside?: number;
  /** light scatter around bright pixels, in screen px (0 = off) */
  glow?: number;
}

/** Paint the magnified screen into fb. P = native px per screen px (integer >= 2). */
export const drawMacro = (fb: Buf, scr: Buf, P: number, o: MacroOpts) => {
  const [fx, fy] = o.focus, [ax, ay] = o.anchor;
  // per-channel light scatter: how much of each primary the neighbourhood throws into this cell
  const gr = o.glow ?? (P >= 6 ? 2 : 3);
  const scat = [new Float32Array(scr.w * scr.h), new Float32Array(scr.w * scr.h), new Float32Array(scr.w * scr.h)];
  if (gr > 0)
    for (let y = 0; y < scr.h; y++)
      for (let x = 0; x < scr.w; x++)
        for (let j = -gr; j <= gr; j++)
          for (let i = -gr; i <= gr; i++) {
            const xx = x + i, yy = y + j;
            if (xx < 0 || yy < 0 || xx >= scr.w || yy >= scr.h || (!i && !j)) continue;
            const d = Math.hypot(i, j);
            if (d > gr + 0.5) continue;
            const fall = 1 - (d - 1) / (gr + 0.5);
            const c = scr.c[yy * scr.w + xx];
            const k = y * scr.w + x;
            for (let ch = 0; ch < 3; ch++) {
              const v = ((c >> (16 - ch * 8)) & 255) / 255;
              const g = v * v * fall;
              if (g > scat[ch][k]) scat[ch][k] = g;
            }
          }
  const third = P / 3;
  for (let y = 0; y < fb.h; y++)
    for (let x = 0; x < fb.w; x++) {
      const dx = x - ax, dy = y - ay;
      const sx = fx + Math.floor(dx / P), sy = fy + Math.floor(dy / P);
      const ix = ((dx % P) + P) % P, iy = ((dy % P) + P) % P;
      if (sx < 0 || sy < 0 || sx >= scr.w || sy >= scr.h) { fb.set(x, y, o.outside ?? PAL.N0); continue; }
      const c = scr.c[sy * scr.w + sx];
      if (P < 6) {
        // CELLS (P3): no stripes, just each pixel as a lit block in its own colour inside the black matrix
        const gap = ix === P - 1 || iy === P - 1;
        if (gap) { fb.set(x, y, PAL.N0); continue; }
        const lit = Math.max((c >> 16) & 255, (c >> 8) & 255, c & 255);
        if (lit < 40) {
          // dark cells: the panel black, with scatter from bright neighbours in whole cells
          const sc = Math.max(scat[0][sy * scr.w + sx], scat[1][sy * scr.w + sx], scat[2][sy * scr.w + sx]);
          const tint = scat[0][sy * scr.w + sx] > scat[2][sy * scr.w + sx] ? PAL.N2 : PAL.C0;
          fb.set(x, y, sc * 1.2 > bayer(sx, sy) + 0.15 ? tint : c === PAL.N0 ? PAL.N1 : c);
          continue;
        }
        // lit cells: flat colour, the top-left pixel a rung hotter (the glass)
        fb.set(x, y, ix === 0 && iy === 0 ? stepColor(c, 1) : c);
        continue;
      }
      const sub = Math.min(2, Math.floor(ix / third));
      const v = sub === 0 ? (c >> 16) & 255 : sub === 1 ? (c >> 8) & 255 : c & 255;
      // black matrix: the last row of each cell; wide cells also get a column after each subpixel
      const rowGap = iy === P - 1;
      const colGap = P >= 6 && ix - Math.round(sub * third) === Math.round(third) - 1;
      if (rowGap || colGap) {
        fb.set(x, y, v > 170 && bayer(x, y) < 0.35 ? PAL.N1 : PAL.N0);
        continue;
      }
      const ramp = sub === 0 ? RR : sub === 1 ? GG : BB;
      let k = lvl(v);
      // scatter lights whole stripes (never single dots): nearest cells more often, one dim level
      if (k === 0 && scat[sub][sy * scr.w + sx] * 1.25 > bayer(sx * 3 + sub, sy) + 0.12) k = 1;
      // the top row of every lit stripe catches a little more (the glass), on wide cells only
      if (P >= 6 && iy === 0 && k > 1 && k < 5) k += 1;
      fb.set(x, y, ramp[k]);
    }
  return fb;
};
