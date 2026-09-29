// MR. MAS — mfinale: the title (f630-689).
// "MR. MAS" slams across NopeAI's blazing rose window, in finished BASE chrome from f630 (v2.1 cut the old
// 1-BIT -> EARLY-WEB 16 -> flat -> chrome ladder: four brightness jumps within 24 frames of the f622 ignition). The period is THE ORB: the cold open's Orb model (mcoldopen/orb.ts: the black glass
// face, the blades, the lens), small, its chrome reflecting the dusk on a low curved horizon. It is kerned tight
// to the R with a word space after, so the line reads "MR." then "MAS".
// A tiny Mas stands on the spire balcony; the rivals flinch at the slam. f640: the subtitle types on.
import {Buf, W, H, rect, poly, bayer, clamp, shiftBuf} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {text, textWidth} from '../../shared/pixel/font';
import {Mask} from '../../shared/pixel/mask';
import {remap, familyStep, PALETTES} from '../../shared/pixel/palettes';
import type {SwitchSpec, DrawResult} from '../../shared/pixel/compose';
import {T} from './timeline';
import {drawSkyline, drawIgnition, drawRoseWindow, drawTowerPlates, camX, roseCenter, tinyMas, SPIRE} from './skyline';
import {View} from './iso';
import {drawOrb as drawColdOrb} from '../../shared/pixel/cast/orb';

// ================================================================== the wordmark (chamfered display letters)
const SC = 1.25; // the letters are hand-set on a 40px grid and rasterised at 1.25 (re-rasterised polygons, not a scaled sprite)
const CAP = Math.round(40 * SC);
type Glyph = {w: number; polys: number[][]; holes?: number[][]};
// letters on a 40px cap, 8px strokes, 6px chamfers (hand-set polygons: every edge is 0, 45 or 90 degrees)
const GL: Record<string, Glyph> = {
  M: {w: 44, polys: [[0, 6, 6, 0, 14, 0, 22, 14, 30, 0, 38, 0, 44, 6, 44, 40, 36, 40, 36, 16, 25, 30, 19, 30, 8, 16, 8, 40, 0, 40]]},
  R: {w: 34, polys: [[0, 0, 28, 0, 34, 6, 34, 18, 28, 24, 22, 24, 34, 36, 34, 40, 25, 40, 12, 24, 8, 24, 8, 40, 0, 40]], holes: [[8, 8, 26, 8, 26, 16, 8, 16]]},
  A: {w: 36, polys: [[0, 40, 0, 10, 10, 0, 26, 0, 36, 10, 36, 40, 28, 40, 28, 29, 8, 29, 8, 40]], holes: [[8, 12, 12, 8, 24, 8, 28, 12, 28, 21, 8, 21]]},
  // S: point-symmetric, all four outer corners cut, hooked terminals (a squared S that never reads as a 5)
  S: {w: 32, polys: [[6, 0, 26, 0, 32, 6, 32, 10, 24, 10, 24, 8, 8, 8, 8, 16, 26, 16, 32, 22, 32, 34, 26, 40, 6, 40, 0, 34, 0, 30, 8, 30, 8, 32, 24, 32, 24, 24, 6, 24, 0, 18, 0, 6]]},
};
const ORB_R = 9;
const ORB_D = 2 * ORB_R + 1; // 19
const LAYOUT: Array<{ch: string; dx: number}> = [];
let WM_W = 0;
{
  let x = 0;
  // gaps in 40-grid units: the period sits 1 unit off the R's leg; a word space (20 units) after it
  const seq: Array<[string, number]> = [['M', 5], ['R', 1], ['.', 20], ['M', 5], ['A', 5], ['S', 0]];
  for (const [ch, gap] of seq) { LAYOUT.push({ch, dx: x}); x += (ch === '.' ? ORB_D : Math.round(GL[ch].w * SC)) + Math.round(gap * SC); }
  WM_W = x;
}
export const WORDMARK = {w: WM_W, cap: CAP, orbD: ORB_D};

/** letter coverage (1 = letter, 2 = orb) in a WM_W x CAP bitmap */
const WM_BITS = (() => {
  const b = new Buf(WM_W, CAP + 1, 0);
  for (const l of LAYOUT) {
    if (l.ch === '.') {
      const r = ORB_D / 2, cx = l.dx + r, cy = CAP - r;
      for (let y = 0; y <= CAP; y++) for (let x = l.dx; x < l.dx + ORB_D; x++) if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r) b.set(x, y, 2);
      continue;
    }
    const g = GL[l.ch];
    for (const p of g.polys) poly(p.map((v, i) => (i % 2 ? Math.round(v * SC) : Math.round(v * SC) + l.dx)), b.ink(1));
    for (const p of g.holes ?? []) poly(p.map((v, i) => (i % 2 ? Math.round(v * SC) : Math.round(v * SC) + l.dx)), b.ink(0));
  }
  return b;
})();
const ORB_AT = LAYOUT.find((l) => l.ch === '.')!.dx;

/** where the wordmark sits (screen): the Orb-period lands over the rose window */
export const wmOrigin = (): [number, number] => {
  // the Orb's centre lands exactly on the rose window's hub (the title is set around it)
  const [rx, ry] = roseCenter();
  const x = Math.round(rx - camX(T.title) - ORB_AT - ORB_R);
  return [x, Math.round(ry - CAP + ORB_R)];
};

// chrome: the letter face reflects sky (top) / a hard horizon / the city's cyan (bottom)
const CHROME = (y0: number) => {
  const y = (y0 / CAP) * 40;
  if (y < 2) return PAL.C9;
  if (y < 7) return PAL.C8;
  if (y < 14) return bayer(0, y0) < (y - 7) / 7 ? PAL.C7 : PAL.C8;
  if (y < 17) return PAL.P2;
  if (y < 19) return PAL.N3;
  if (y < 25) return PAL.C3;
  if (y < 31) return PAL.C4;
  if (y < 36) return PAL.C5;
  return PAL.C6;
};

type Tier = 'bit' | 'web' | 'flat' | 'chrome';
/** v2.1: the wordmark is finished BASE chrome from f630 (the 1-bit / early-web / flat ladder is cut: SCRIPT §7). */
export const tierAt = (g: number): Tier => { void g; return 'chrome'; };

/** draw the wordmark; returns its screen-space coverage mask (letters + outline + halo) */
const drawWordmark = (fb: Buf, x0: number, y0: number, g: number, tier: Tier, m: Mask) => {
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < WM_W && y <= CAP && WM_BITS.c[y * WM_W + x] > 0;
  const kind = (x: number, y: number) => (x >= 0 && y >= 0 && x < WM_W && y <= CAP ? WM_BITS.c[y * WM_W + x] : 0);
  const DEPTH = 5;
  // bloom (chrome tier): an ordered-dither halo, 3px, cyan
  if (tier === 'chrome')
    for (let y = -4; y <= CAP + DEPTH + 4; y++)
      for (let x = -4; x <= WM_W + DEPTH + 4; x++) {
        if (on(x, y)) continue;
        let d = 9;
        // the letters bloom; the Orb does not (it is lit by the rose behind it, not by its own glow)
        for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (on(x + i, y + j) && kind(x + i, y + j) === 1) d = Math.min(d, Math.max(Math.abs(i), Math.abs(j)));
        if (d > 3) continue;
        const X = x0 + x, Y = y0 + y;
        if (bayer(X, Y) < [0, 0.55, 0.3, 0.12][d]) fb.set(X, Y, d === 1 ? PAL.C4 : PAL.C3);
      }
  // extrusion (down-right, stepped), then a 1px ink outline
  for (let d = DEPTH; d >= 1; d--)
    for (let y = 0; y <= CAP; y++) for (let x = 0; x < WM_W; x++) if (on(x, y) && kind(x, y) === 1) fb.set(x0 + x + d, y0 + y + d, d === 1 ? PAL.N2 : PAL.N1);
  for (let y = -1; y <= CAP + DEPTH + 1; y++)
    for (let x = -1; x <= WM_W + DEPTH + 1; x++) {
      const inside = on(x, y) || (() => { for (let d = 1; d <= DEPTH; d++) if (on(x - d, y - d) && kind(x - d, y - d) === 1) return true; return false; })();
      if (inside) { m.a[(y0 + y) * W + x0 + x] = 255; continue; }
      const L1 = (xx: number, yy: number) => on(xx, yy) && kind(xx, yy) === 1;
      if (L1(x + 1, y) || L1(x - 1, y) || L1(x, y + 1) || L1(x, y - 1) || L1(x - DEPTH - 1, y - DEPTH) || L1(x - DEPTH, y - DEPTH - 1)) { fb.set(x0 + x, y0 + y, PAL.N0); m.a[(y0 + y) * W + x0 + x] = 255; }
    }
  // faces
  const k = g - T.title;
  const glint = tier === 'chrome' ? (k - 3) * 22 - 30 : -999; // the glint sweeps once the slam has settled
  for (let y = 0; y <= CAP; y++)
    for (let x = 0; x < WM_W; x++) {
      if (kind(x, y) !== 1) continue;
      let c: number;
      if (tier === 'flat') c = y < CAP / 2 ? PAL.P2 : PAL.P1;
      else {
        c = CHROME(y);
        // bevel: lit top/left edges, shaded bottom/right edges
        const mid = CAP * 0.46;
        if (!on(x, y - 1) || !on(x - 1, y)) c = y > mid ? PAL.C6 : PAL.C9;
        else if (!on(x, y + 1) || !on(x + 1, y)) c = y > mid ? PAL.C2 : PAL.C6;
        // the glint: a 45-degree sweep, 3px wide, left to right
        const gd = x + y - glint;
        if (gd >= 0 && gd < 4) c = gd === 1 || gd === 2 ? PAL.C9 : PAL.P2;
      }
      fb.set(x0 + x, y0 + y, c);
    }
  // the Orb period stands off the rose window's coloured petals: a 1-px dark knock-out ring, then a 1-px N0 keyline
  {
    const ox = x0 + ORB_AT, oy = y0 + CAP - ORB_D, r = ORB_R;
    for (let j = -r - 3; j <= r + 2; j++) for (let i = -r - 3; i <= r + 2; i++) {
      const d = Math.hypot(i + 0.5, j + 0.5);
      if (d <= r || d > r + 2) continue;
      fb.set(ox + r + i, oy + r + j, d <= r + 1 ? PAL.N0 : PAL.N2);
      m.a[(oy + r + j) * W + ox + r + i] = 255;
    }
  }
  drawOrb(fb, x0 + ORB_AT, y0 + CAP - ORB_D, g, tier);
};

// ================================================================== THE ORB (the period)
/**
 * What the Orb's chrome reflects at the title: the dusk sky above (bright, warming to the west), a LOW curved
 * horizon (the afterglow line), the dark city below it; and on both flanks the wordmark's own cyan chrome
 * letters (the R to its left, the M to its right), the way the cold-open Orb carries the monitor's slab.
 */
const duskReflect = (rx: number, ry: number, x: number, y: number) => {
  const h = 0.26 + rx * 0.05; // the horizon, low; the sun went down screen-left
  if (Math.abs(rx) > 0.62 && ry > -0.45 && ry < 0.55) return Math.abs(rx) > 0.8 ? PAL.C7 : PAL.C5; // the letters
  if (ry > h) {
    const lit = ((x * 7 + y * 13) % 9 === 0);
    return lit ? (rx < 0 ? PAL.W6 : PAL.C5) : ry > h + 0.45 ? PAL.N1 : PAL.U1;
  }
  if (ry > h - 0.14) return rx < -0.1 ? PAL.W7 : PAL.W6; // the afterglow on the horizon line
  if (ry > h - 0.42) return rx < 0 ? PAL.U4 : PAL.U3;
  if (ry > -0.5) return PAL.X3;
  return PAL.G5;
};
/**
 * The Orb as the period (ox, oy = top-left of its ORB_D box). The face, blades and lens are the cold open's
 * model at r = 9, the iris on us; the chrome shell around the face is re-shaded with the dusk it reflects.
 * f660 (the celesta): a four-point glint crosses its shoulder. The pupil breathes on the beat.
 */
export const drawOrb = (fb: Buf, ox: number, oy: number, g: number, tier: Tier | 'room' = 'chrome') => {
  const r = ORB_R, cx = ox + r, cy = oy + r;
  if (tier === 'flat') {
    for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) {
      const d = Math.hypot(i + 0.5, j + 0.5) / r;
      if (d <= 1) fb.set(cx + i, cy + j, d > 0.9 ? PAL.N0 : PAL.G5);
    }
    return;
  }
  const beat = Math.floor((g - T.title) / 15) % 2;
  drawColdOrb(fb, cx, cy, r, {look: [0, 0], aperture: beat ? 0.75 : 0.5, monitor: 1});
  const cosA = Math.cos(0.8); // the cold-open model's face radius for small orbs (orb.ts: alpha)
  for (let j = -r - 1; j <= r + 1; j++)
    for (let i = -r - 1; i <= r + 1; i++) {
      const nx = (i + 0.5) / r, ny = (j + 0.5) / r, d2 = nx * nx + ny * ny;
      if (d2 > 1) continue;
      const nz = Math.sqrt(1 - d2);
      if (nz > cosA) continue; // the face: the cold open's, untouched
      const rx = 2 * nz * nx, ry = 2 * nz * ny + 0.1;
      let c = duskReflect(rx, ry, i, j);
      const edge = 1 - nz;
      // the rim: backlit by the blazing rose behind it (a cold rim all round, the west edge warm)
      if (edge > 0.88) c = nx < -0.45 && ny < 0.3 ? PAL.W7 : PAL.C6;
      fb.set(cx + i, cy + j, c);
    }
  // one hard specular: the afterglow, upper left, on the chrome shoulder
  fb.set(cx - 6, cy - 5, PAL.P2); fb.set(cx - 5, cy - 6, PAL.P2); fb.set(cx - 6, cy - 6, PAL.W8);
  const tw = g - 660;
  if (tier === 'chrome' && tw >= 0 && tw < 4) {
    const L = [2, 4, 3, 1][tw], sx = cx - 6, sy = cy - 6;
    for (let i = -L; i <= L; i++) { fb.set(sx + i, sy, Math.abs(i) < 2 ? PAL.P2 : PAL.C8); fb.set(sx, sy + i, Math.abs(i) < 2 ? PAL.P2 : PAL.C8); }
  }
};
export const ORB_IRIS_OFF: [number, number] = [ORB_R + 0.5, ORB_R + 0.5];

// ================================================================== the scene
/** the slam: an integer shake of at most 3 px, f630-632 (rule 3.0.6) */
const SHAKE: Array<[number, number]> = [[0, -3], [2, 2], [-1, -1]];
let LETTERS = new Mask();

export const drawTitle = (fb: Buf, g: number): void | DrawResult => {
  const k = g - T.title;
  drawSkyline(fb, g, {blaze: k < 4 ? 2 : 1, flinch: k, noPlates: true, lineStop: SPIRE.balcony + 1});
  // the city steps down behind the title (two rungs, one on the sky), the cyan line and the rose window stay lit
  remap(fb, familyStep(-1), {rect: [0, 0, W, H]});
  remap(fb, familyStep(-1), {rect: [0, 70, W, H - 70]});
  // the tower wordmarks stay readable under the title: full on the slam frames, one light step down from f634
  // (only the plates clear of the wordmark and the subtitle: MACROSOFT, zAI and MISANTHROPIC sit under the title,
  // and their wordmarks were read by f629, T20/T24)
  drawTowerPlates(fb, g, k >= 4 ? 1 : 0, {ids: ['elgoog', 'minddeep', 'atem', 'invidia', 'peekdeep']});
  const v = new View(fb, camX(g), 0);
  roseGlow(fb, g);
  drawIgnition(v, g, SPIRE.balcony + 1);
  drawRoseWindow(v, g, k < 4 ? 2 : 1);
  tinyMas(v, SPIRE.x - 2, SPIRE.balcony, g);
  const [x0, y0] = wmOrigin();
  LETTERS = new Mask();
  drawWordmark(fb, x0, y0 + (k === 0 ? -3 : k === 1 ? 1 : 0), g, tierAt(g), LETTERS);
  // the slam: a 3-px shake of the whole picture (edges clamp), 3 frames
  const sh = SHAKE[k];
  if (sh) { const src = fb.clone(); shiftBuf(fb, src, sh[0], sh[1]); LETTERS = shiftMask(LETTERS, sh[0], sh[1]); }
};
const shiftMask = (m: Mask, dx: number, dy: number) => {
  const o = new Mask();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const sx = x - dx, sy = y - dy; if (sx >= 0 && sy >= 0 && sx < W && sy < H) o.a[y * W + x] = m.a[sy * W + sx]; }
  return o;
};

/** the rose window blazes: a soft pixel glow (ordered dither, one rung up) in a disc around it */
const roseGlow = (fb: Buf, g: number) => {
  const [rx, ry] = roseCenter();
  const cx = rx - camX(g), cy = ry;
  const pulse = Math.floor((g - T.title) / 15) % 2 ? 0.05 : 0;
  for (let y = Math.floor(cy - 60); y <= cy + 60; y++)
    for (let x = Math.floor(cx - 80); x <= cx + 80; x++) {
      const d = Math.hypot((x - cx) / 1.35, y - cy) / 58;
      if (d > 1) continue;
      if (bayer(x, y) < (1 - d) * (0.55 + pulse)) fb.set(x, y, stepColor(fb.get(x, y), 1));
    }
};

export const titleSwitch = (g: number): SwitchSpec[] | null => {
  // (the wordmark's 1-BIT / EARLY-WEB16 ladder is cut in v2.1: no switch on the title)
  void g; void PALETTES; void LETTERS;
  return null;
};

const SUB = 'now in low-key research preview';
export const titleAfter = (ui: Buf, g: number): void | DrawResult => {
  if (g < T.subtitle) return;
  const n = clamp((g - T.subtitle) * 4, 0, SUB.length); // 4 characters per frame (SCRIPT §3.9 / §8: typed by f647)
  const [x0, y0] = wmOrigin();
  const w = textWidth(SUB);
  const x = Math.round(x0 + (WM_W - w) / 2), y = y0 + CAP + 20;
  rect(x - 5, y - 3, w + 10, 13, ui.ink(PAL.N0));
  rect(x - 5, y - 3, w + 10, 1, ui.ink(PAL.C4));
  text(ui, SUB.slice(0, n), x, y, PAL.P1);
  // the type-on cursor (blinks when done)
  if (n < SUB.length || Math.floor(g / 8) % 2 === 0) rect(x + textWidth(SUB.slice(0, n)) + 1, y, 4, 7, ui.ink(PAL.C7));
};
