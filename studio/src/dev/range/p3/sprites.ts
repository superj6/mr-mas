// MR. MAS — range/p3: the people and the one glass the model couldn't learn. The guests are the approved pixel
// drawings (the portraits for the near pair, the medium tier for the far pair), re-lit ONLY in whole palette rungs:
// the LED candles warm the side that faces them one rung, the monitor adds a cyan rim rung. Mas's water glass is a
// pixel drawing sitting on the real cloth. His reflection is his 2015 dinner drawing at the reflection's size.
// Nothing here is ever scaled on screen; the far drawings are authored at their size (a 2:1 palette-aware reduction
// of the portrait, the same way the medium tier was derived) and fixed by hand where the reduction lost a feature.
import {Buf, W, H, rect, clamp, hash} from '../../../shared/pixel/px';
import {blinkAt} from '../../../shared/pixel/sprite';
import {PAL, stepColor, lightness, familyOf} from '../../../shared/pixel/palette';
import {Img} from '../../../shared/pixel/figure';
import {text, textWidth} from '../../../shared/pixel/font';
import {gergPortrait, GERG_PORTRAIT_DEFAULT} from '../../../shared/pixel/cast/gerg';
import {alyiPortrait, ALYI_PORTRAIT_DEFAULT} from '../../../shared/pixel/cast/alyi';
import {marioPortraitImg, MARIO_PORTRAIT_REST} from '../../../shared/pixel/cast/mario';
import {nolePortraitImg, NOLE_PORTRAIT_REST} from '../../../shared/pixel/cast/nole';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../shared/pixel/cast/mas';
import {Who} from './layout';
import {SPR} from './sprites-geo';

// ------------------------------------------------------------------ image helpers
const blank = (w: number, h: number): Img => ({w, h, c: new Int32Array(w * h).fill(-1)});
const at = (m: Img, x: number, y: number) => (x < 0 || y < 0 || x >= m.w || y >= m.h ? -1 : m.c[y * m.w + x]);
const flipH = (m: Img): Img => { const o = blank(m.w, m.h); for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) o.c[y * m.w + x] = m.c[y * m.w + (m.w - 1 - x)]; return o; };

/** 2:1 palette-aware reduction: the block's majority colour, except a much darker minority wins (features survive) */
export const reduce2 = (m: Img): Img => {
  const w = m.w >> 1, h = m.h >> 1, o = blank(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const vs = [at(m, 2 * x, 2 * y), at(m, 2 * x + 1, 2 * y), at(m, 2 * x, 2 * y + 1), at(m, 2 * x + 1, 2 * y + 1)].filter((v) => v >= 0);
      if (vs.length < 2) continue;
      const cnt = new Map<number, number>();
      for (const v of vs) cnt.set(v, (cnt.get(v) ?? 0) + 1);
      let best = vs[0], bs = -1;
      for (const [v, n] of cnt) { const sc = n * 10 - lightness(v); if (sc > bs) { bs = sc; best = v; } }
      let dk = vs[0]; for (const v of vs) if (lightness(v) < lightness(dk)) dk = v;
      if ((cnt.get(best) ?? 0) < 3 && lightness(best) - lightness(dk) > 0.12) best = dk;
      o.c[y * w + x] = best;
    }
  return o;
};

/** one rung down its own ramp; at a ramp's bottom, down the night ramp by lightness (so anything reaches black) */
const NIGHT = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7, PAL.N8];
const darkCache = new Map<number, number>();
export const darker = (c: number) => {
  let v = darkCache.get(c);
  if (v !== undefined) return v;
  const f = familyOf(c);
  if (f && f[1] > 0) v = stepColor(c, -1);
  else { const L = lightness(c); v = PAL.N0; for (const n of NIGHT) if (lightness(n) < L - 0.02) v = n; }
  darkCache.set(c, v);
  return v;
};
export const darkN = (c: number, k: number) => { for (let i = 0; i < k; i++) c = darker(c); return c; };

/** Continue a bust's bottom edge down into a seated body behind the cloth: the chest carries straight on (no taper:
 *  a person, not a chess piece), narrowing a pixel at a time toward the waist; cylinder shading at the flanks and one
 *  rung down below the chest. It never fades to black: the candles are on the table, level with the chest. */
const seatTorso = (m: Img, rows: number, inner: 1 | -1): Img => {
  const o = blank(m.w, m.h + rows);
  o.c.set(m.c);
  const base = m.h - 3;
  let l0 = 0, r0 = m.w - 1;
  while (l0 < m.w && at(m, l0, base) < 0) l0++;
  while (r0 >= 0 && at(m, r0, base) < 0) r0--;
  for (let j = 1; j <= rows + 2; j++) {
    const y = base + j;
    const past = Math.max(0, j - rows * 0.3);
    const nO = Math.floor(past / 8), nI = Math.floor(past / 11);
    const l = l0 + (inner < 0 ? nI : nO), r = r0 - (inner > 0 ? nI : nO);
    const mid = (l + r) / 2, hw = Math.max(1, (r - l) / 2);
    if (y < m.h) for (let x = 0; x < m.w; x++) o.c[y * m.w + x] = -1; // the portrait's own last rows (its frame line) go
    for (let x = l; x <= r; x++) {
      let src = at(m, clamp(x, l0 + 2, r0 - 2), base);
      if (src < 0) src = at(m, clamp(x, l0 + 2, r0 - 2), base - 1);
      if (src < 0) continue;
      const u = Math.abs(x - mid) / hw;
      const k = (u > 0.88 ? 1 : 0) + (j > rows * 0.42 ? 1 : 0);
      o.c[y * m.w + x] = darkN(src, k);
    }
  }
  return o;
};

/** the cyan rung for a colour: skin goes to its under-cyan ramp, everything else to the monitor ramp, a rung up */
const CRAMP = [PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5, PAL.C6, PAL.C7];
const KRAMP = [PAL.K0, PAL.K1, PAL.K2, PAL.K3, PAL.K4, PAL.K5];
const cyanRung = (c: number) => {
  const f = familyOf(c)?.[0];
  const L = lightness(c);
  const ramp = f === 'S' || f === 'K' || f === 'X' ? KRAMP : CRAMP;
  let best = ramp[0], bd = 9;
  for (const r of ramp) { const d = Math.abs(lightness(r) - (L + 0.1)); if (d < bd) { bd = d; best = r; } }
  return best;
};

/** Re-light a drawing in whole rungs, in three stages (the light arriving in the room, as palette steps):
 *  0 = only the monitor is on: the figure one rung down, a cyan rim on the head's monitor side
 *  1 = the candles come up: the drawing's own colours
 *  2 = candle light: one warm rung on the band that faces the candles (the cheek, the jaw, the chest that faces the
 *      table), a backlight rung on the head's outer edge from the sconce behind.
 *  Rims are kept to the head and shoulders' top (a rim round the whole body reads as a sticker's cut line). */
export const relight = (m: Img, toward: 1 | -1, stage: 0 | 1 | 2): Img => {
  const o: Img = {w: m.w, h: m.h, c: new Int32Array(m.c)};
  for (let y = 0; y < m.h; y++) {
    let l = 0, r = m.w - 1;
    while (l < m.w && at(m, l, y) < 0) l++;
    while (r >= 0 && at(m, r, y) < 0) r--;
    if (l > r) continue;
    const band = Math.max(5, Math.round((r - l) * (y > m.h * 0.55 ? 0.5 : 0.38)));
    for (let x = l; x <= r; x++) {
      const v = at(m, x, y);
      if (v < 0) continue;
      const fromIn = toward > 0 ? r - x : x - l;
      const fromOut = toward > 0 ? x - l : r - x;
      const topEdge = at(m, x, y - 1) < 0;
      if ((fromIn === 0 && y < m.h * 0.3) || (topEdge && y < m.h * 0.4)) { o.c[y * m.w + x] = cyanRung(v); continue; }
      if (stage === 0) { o.c[y * m.w + x] = darker(v); continue; }
      if (stage === 1) continue;
      if (fromOut === 0 && y < m.h * 0.3) { o.c[y * m.w + x] = stepColor(v, 1); continue; }
      if (fromIn >= 1 && fromIn <= band && y > m.h * 0.1) o.c[y * m.w + x] = stepColor(v, 1);
    }
  }
  return o;
};

// ------------------------------------------------------------------ the guests, and what they do while he reads them
const PHRASE = [2, 1, 3, 1, 0, 2, 3, 2, 1, 0, 0, 2, 1, 2, 3, 1, 0, 0, 0, 1, 2, 1, 3, 2, 0];
/** a wordless phrase: a mouth drawing every 3 frames, a pause every few syllables (the murmur, not words) */
const talk = (f: number, t0: number, t1: number, seed: number) => {
  if (f < t0 || f >= t1) return 0;
  const k = Math.floor((f - t0) / 3) + seed;
  return PHRASE[k % PHRASE.length];
};
const blink = (f: number, at0: number[]) => { for (const t of at0) { const b = blinkAt(f, t); if (b) return b; } return 0 as 0 | 1 | 2; };
/** the idles (hold drawings, swaps on 2s-4s): NOLE is holding forth with his phone; MARIO waits with his finger up,
 *  nods, then makes his point; GERG watches whoever is talking; ALYI listens, and has one short remark */
export const guestPose = (who: Who, f: number): {img: Img; key: string} => {
  switch (who) {
    case 'nole': {
      const mouth = talk(f, 150, 236, 0) as 0 | 1 | 2 | 3 | 4;
      const jab: 0 | 1 | 2 = f >= 168 && f < 178 ? 1 : f >= 178 && f < 188 ? 2 : f >= 188 && f < 196 ? 1 : f >= 212 && f < 224 ? 1 : 0;
      const dip = f >= 236 && f < 248 ? 1 : 0;
      const b = blink(f, [194, 262, 301]);
      return {img: nolePortraitImg({...NOLE_PORTRAIT_REST, screen: 'post', mouth, jab, dip, blink: b}), key: `n${mouth}${jab}${dip}${b}`};
    }
    case 'mario': {
      const mouth = talk(f, 246, 270, 7) as 0 | 1 | 2 | 3;
      const finger: 0 | 1 | 2 = f >= 244 && f < 272 ? ([1, 2, 1, 2, 1] as const)[Math.min(4, Math.floor((f - 244) / 5))] : 0;
      const nod = f >= 198 && f < 206 ? 1 : f >= 206 && f < 210 ? 2 : 0;
      const b = blink(f, [172, 229, 286]);
      return {img: marioPortraitImg({...MARIO_PORTRAIT_REST, finger, mouth, nod, blink: b}), key: `m${mouth}${finger}${nod}${b}`};
    }
    case 'gerg': {
      const look: -1 | 0 | 1 = f >= 152 && f < 244 ? 1 : f >= 248 ? -1 : 0;
      const mouth = f >= 204 && f < 216 ? 'smile' : 'rest';
      const b = blink(f, [166, 221, 279]);
      return {img: gergPortrait({...GERG_PORTRAIT_DEFAULT, look, mouth, lid: b}), key: `g${look}${mouth}${b}`};
    }
    default: {
      const closed = (f >= 181 && f < 183) || (f >= 250 && f < 252) || (f >= 292 && f < 294);
      const open = (f >= 226 && f < 229) || (f >= 232 && f < 236);
      return {img: alyiPortrait({...ALYI_PORTRAIT_DEFAULT, eyes: closed ? 'closed' : 'open', mouth: open ? 'open' : 'rest'}), key: `a${closed ? 1 : 0}${open ? 1 : 0}`};
    }
  }
};
/** breathing: the bust rises one native pixel for half of a slow cycle (whole-pixel motion; the arms stay on the cloth) */
const PHASE: Record<Who, number> = {mario: 0, nole: 23, gerg: 47, alyi: 12};
export const breathe = (who: Who, f: number) => (((f + PHASE[who]) % 76) < 38 ? 0 : -1);

const guestCache = new Map<string, Img>();
/** the guest's drawing for the reconstruction at frame f, lit for the stage (see relight) */
export const guestImg = (who: Who, near: boolean, flip: boolean, toward: 1 | -1, stage: 0 | 1 | 2, f = 0): Img => {
  const pose = guestPose(who, f);
  const k = `${pose.key}${near}${flip}${toward}${stage}`;
  let v = guestCache.get(k);
  if (v) return v;
  let m = pose.img;
  if (!near) m = reduce2(m);
  if (flip) m = flipH(m);
  const d = near ? SPR.near : SPR.far;
  m = seatTorso(m, d.h - m.h, toward);
  v = relight(m, toward, stage);
  guestCache.set(k, v);
  if (guestCache.size > 400) guestCache.delete(guestCache.keys().next().value as string);
  return v;
};
/** the colour a guest's clothes are, where a forearm would come from (the chest's middle, a rung down) */
export const sleeveOf = (m: Img) => {
  const y = Math.round(m.h * 0.62);
  let l = 0, r = m.w - 1;
  while (l < m.w && at(m, l, y) < 0) l++;
  while (r >= 0 && at(m, r, y) < 0) r--;
  return at(m, Math.round((l + r) / 2), y);
};

/** A forearm lying on the cloth, drawn on the native grid from its projected elbow (e), wrist (w) and fingertips (h):
 *  a capsule `r` px thick, lit on top by the candles and dark underneath; the hand flat on the cloth. Writes into
 *  `out` (native, TRANSPARENT elsewhere) and marks the cloth under it in `shade` (the contact, in whole pixels). */
export const drawForearm = (out: Buf, shade: Buf, e: [number, number], w: [number, number], h: [number, number], r: number, sleeve: number, stage: 0 | 1 | 2) => {
  const dx = w[0] - e[0], dy = w[1] - e[1], L2 = dx * dx + dy * dy || 1;
  const x0 = Math.floor(Math.min(e[0], w[0], h[0]) - r - 2), x1 = Math.ceil(Math.max(e[0], w[0], h[0]) + r + 2);
  const y0 = Math.floor(Math.min(e[1], w[1], h[1]) - r - 2), y1 = Math.ceil(Math.max(e[1], w[1], h[1]) + r + 3);
  const lit = (c: number) => (stage === 0 ? darker(c) : stage === 2 ? stepColor(c, 1) : c);
  // the contact: two rows of shadow on the cloth under the arm and the hand
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const t = clamp(((x - e[0]) * dx + (y - r * 0.7 - e[1]) * dy) / L2, 0, 1.25);
    const cx = e[0] + dx * t, cy = e[1] + dy * t + r * 0.85;
    if (Math.abs(x - cx) < r * 0.2 + (t > 1 ? 3 : 1) && y >= cy && y <= cy + 2) shade.set(x, y, y <= cy + 1 ? 2 : 1);
  }
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const t = clamp(((x - e[0]) * dx + (y - e[1]) * dy) / L2, 0, 1);
    const cx = e[0] + dx * t, cy = e[1] + dy * t;
    const d = Math.hypot(x - cx, y - cy);
    if (d > r) continue;
    const v = (y - cy) / r; // -1 top .. 1 underside
    let c = sleeve;
    if (v < -0.62) c = stepColor(c, 1); else if (v > 0.5) c = darker(c);
    if (d > r - 1) c = darker(c);
    if (t < 0.18) c = darker(c); // the elbow goes into the body's shadow
    if (t > 0.9 && t < 0.97) c = stepColor(sleeve, 1); // the cuff
    out.set(x, y, lit(c));
  }
  // the hand, flat on the cloth: a rounded wedge from the wrist to the fingertips, knuckles on its top edge
  const hx = h[0] - w[0], hy = h[1] - w[1], hL = Math.hypot(hx, hy) || 1;
  const hr = Math.max(2, r * 0.62);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const t = ((x - w[0]) * hx + (y - w[1]) * hy) / (hL * hL);
    if (t < 0 || t > 1) continue;
    const cx = w[0] + hx * t, cy = w[1] + hy * t + r * 0.25 * t;
    const half = hr * (1 - 0.35 * t * t);
    const d = Math.abs(y - cy);
    if (d > half || Math.abs(x - cx) > hr * 1.5) continue;
    const v = (y - cy) / half;
    let c = v < -0.5 ? PAL.S5 : v > 0.55 ? PAL.S2 : PAL.S4;
    if (t > 0.55 && t < 0.62 && v < 0.2) c = PAL.S3; // the knuckle line
    if (t > 0.94) c = v > 0 ? PAL.S2 : PAL.S3;
    out.set(x, y, stage === 0 ? darker(c) : stage === 2 && v < 0.2 ? stepColor(c, 1) : c);
  }
};

// ------------------------------------------------------------------ Mas's glass (pixel, on the real cloth)
/** His water goblet at the POV's size, drawn the way the show draws glass: lit walls, a bright lip, ONE flat row for the
 *  water line (it never ripples), a solid stem and foot. It is not an outline: inside the bowl the glass is a LENS, and
 *  what you see through it (the real cloth, the knife) comes out in pixel, quantised to the master palette (the water
 *  a rung cooler). `masGlassLens()` is that mask: 1 = glass above the water, 2 = through the water. */
export const MAS_GLASS_W = 30, MAS_GLASS_H = 50;
const GL = {cx: 14.5, rimY: 3, rx: 13.2, ry: 2.6, wl: 16};
const glassHW = (y: number) => (y < GL.rimY ? 0 : y <= 22 ? GL.rx - Math.max(0, (y - 12) * 0.12) : Math.sqrt(Math.max(0, 1 - Math.pow((y - 22) / 9.5, 2))) * (GL.rx - 1.2));
export const masGlassImg = (() => {
  let cache: Img | null = null;
  return (): Img => {
    if (cache) return cache;
    const w = MAS_GLASS_W, h = MAS_GLASS_H, m = blank(w, h);
    const put = (x: number, y: number, c: number) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < w && y < h) m.c[y * w + x] = c; };
    const {cx, rimY, rx, ry, wl} = GL;
    // walls: the left lit by the near candle (ahead-left), the right cool from the monitor; a second, darker line
    // inside each wall gives the glass its thickness
    let pl = -1, pr = -1;
    for (let y = rimY; y <= 31; y++) {
      const hh = glassHW(y); if (hh < 0.6) continue;
      const xl = Math.round(cx - hh), xr = Math.round(cx + hh);
      const lit = y < 9 ? PAL.W8 : y < 24 ? PAL.P1 : PAL.X3;
      const cool = y < 12 ? PAL.C6 : y < 24 ? PAL.N7 : PAL.N6;
      if (pl >= 0) { for (let x = Math.min(pl, xl); x <= Math.max(pl, xl); x++) put(x, y, lit); for (let x = Math.min(pr, xr); x <= Math.max(pr, xr); x++) put(x, y, cool); }
      else { put(xl, y, lit); put(xr, y, cool); }
      if (y > rimY + 1 && y < 30) { put(xl + 1, y, y < wl ? PAL.N6 : PAL.X2); put(xr - 1, y, y < wl ? PAL.N5 : PAL.C3); }
      pl = xl; pr = xr;
    }
    // the base of the bowl: its glass is thick there (a lit crescent over a dark core)
    for (let x = Math.round(cx - 5); x <= Math.round(cx + 5); x++) { put(x, 31, x < cx ? PAL.P0 : PAL.N6); put(x, 30, x < cx - 2 ? PAL.X3 : PAL.N5); }
    // the rim: a full ellipse seen a little from above; the near lip brighter than the far one
    for (let i = 0; i < 240; i++) {
      const a = (i / 240) * Math.PI * 2, x = cx + Math.cos(a) * rx, y = rimY + Math.sin(a) * ry;
      const near = Math.sin(a) > 0;
      put(x, y, near ? (Math.cos(a) < -0.3 ? PAL.W9 : PAL.P1) : Math.cos(a) > 0.45 ? PAL.C7 : PAL.N7);
    }
    // the water line: ONE flat row, bright where the candle catches it
    const hwl = glassHW(wl);
    for (let x = Math.round(cx - hwl) + 1; x < Math.round(cx + hwl); x++) put(x, wl, x < cx - 4 ? PAL.W9 : x < cx + 4 ? PAL.P2 : PAL.C7);
    // the long highlight down the lit side, a short one on the cool side
    for (let y = 6; y <= 14; y++) put(Math.round(cx - glassHW(y)) + 2, y, y < 9 ? PAL.W9 : PAL.P2);
    for (let y = 19; y <= 23; y++) put(Math.round(cx + glassHW(y)) - 2, y, PAL.C5);
    // stem (solid, two tones) and the foot (a filled ellipse: its top catches the light, its front edge brightest)
    for (let y = 32; y < 45; y++) { put(13, y, PAL.X3); put(14, y, PAL.P1); put(15, y, PAL.N6); put(16, y, PAL.N4); }
    for (let y = 43; y <= 48; y++) for (let x = 3; x <= 26; x++) {
      const u = (x - cx) / 10.8, v = (y - 46) / 2.2;
      if (u * u + v * v > 1) continue;
      put(x, y, v > 0.55 ? (u < -0.2 ? PAL.W8 : PAL.P1) : v < -0.4 ? PAL.N6 : u < 0 ? PAL.P0 : PAL.N6);
    }
    cache = m;
    return m;
  };
})();
export const masGlassLens = (() => {
  let cache: Img | null = null;
  return (): Img => {
    if (cache) return cache;
    const w = MAS_GLASS_W, h = MAS_GLASS_H, m = blank(w, h), g = masGlassImg();
    for (let y = GL.rimY + 3; y <= 29; y++) {
      if (y === GL.wl) continue;
      const hh = glassHW(y);
      for (let x = Math.round(GL.cx - hh) + 2; x <= Math.round(GL.cx + hh) - 2; x++) if (g.c[y * w + x] < 0) m.c[y * w + x] = y < GL.wl ? 1 : 2;
    }
    cache = m;
    return m;
  };
})();

// ------------------------------------------------------------------ his reflection in the window (the insert)
// His approved portrait at the far tier's size (the same 2:1 derivation as the far guests: at the insert's 4x lens his
// reflection, 9.4 m away optically, is exactly that size), mirrored, seated behind the reflected table, one rung down
// for the dark glass. Over it: nothing (an empty plate, the cursor waiting).
export const REFL_EYE: [number, number] = [SPR.near.w - 1 - SPR.near.eyeCol, SPR.near.eyeRow];
export const masReflectionImg = (() => {
  const cache = new Map<number, Img>();
  return (lid: 0 | 1 | 2 = 0): Img => {
    const hit = cache.get(lid);
    if (hit) return hit;
    let m = masPortrait({...MAS_PORTRAIT_DEFAULT, look: 0, lid});
    m = flipH(m);
    m = seatTorso(m, SPR.near.h - m.h, 1);
    const o = blank(m.w, m.h);
    for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
      const v = at(m, x, y);
      if (v < 0) continue;
      o.c[y * m.w + x] = darker(v);
    }
    // the pane's sheen crosses him (a rung up where it passes): he is behind glass
    for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) {
      const v = o.c[y * o.w + x];
      if (v < 0) continue;
      const d = x + y * 0.62;
      void d;
    }
    cache.set(lid, o);
    return o;
  };
})();
/** the LED flame as it shows in the window (steady: it is plastic; one drawing, held) */
export const reflFlame = (): Img => {
  const rows = ['.a.', 'aba', 'aba', '.c.'];
  const pal: Record<string, number> = {a: PAL.W5, b: PAL.W7, c: PAL.W3};
  const m = blank(3, 4);
  rows.forEach((r, j) => { for (let i = 0; i < 3; i++) if (pal[r[i]] !== undefined) m.c[j * 3 + i] = pal[r[i]]; });
  return m;
};

// ------------------------------------------------------------------ the stat bars (F4.1's device: label first, then cells left to right)
export interface Bar { label: string; value: number; cells: number; }
export const BARS: Record<Who, Bar> = {
  gerg: {label: 'ORG CHART', value: 4, cells: 5},
  alyi: {label: 'A-G-I', value: 5, cells: 5},
  nole: {label: 'NAMED IT', value: 5, cells: 5},
  mario: {label: 'CONCERNS', value: 3, cells: 5},
};
const CELL_W = 5, CELL_H = 7, CELL_GAP = 2;
export const barWidth = (b: Bar) => textWidth(b.label) + 5 + b.cells * (CELL_W + CELL_GAP) - CELL_GAP + 6;
const MARGIN = 10;
/** draw a stat bar centred on (cx, bottom) at k frames after its beat: it rises 3 held steps, types, then fills.
 *  It is kept inside the frame (a margin of 10 native px), sliding in along its row if the head is near an edge. */
export const drawBar = (ui: Buf, b: Bar, cx: number, bottom: number, k: number) => {
  if (k < 0) return;
  const rise = k < 1 ? 6 : k < 2 ? 4 : k < 3 ? 2 : 0;
  const w = barWidth(b), h = CELL_H + 6;
  const x = clamp(Math.round(cx - w / 2), MARGIN, W - MARGIN - w), y = Math.max(MARGIN, bottom - h) + rise;
  rect(x, y, w, h, ui.ink(PAL.N0));
  rect(x + 1, y + 1, w - 2, 1, ui.ink(PAL.N3));
  const chars = clamp(Math.floor((k - 1) * 2), 0, b.label.length);
  if (chars > 0) text(ui, b.label.slice(0, chars), x + 3, y + 4, PAL.P1);
  const cx0 = x + 3 + textWidth(b.label) + 5;
  const filled = clamp(Math.floor((k - 1 - Math.ceil(b.label.length / 2)) / 2) + 1, 0, b.value);
  for (let i = 0; i < b.cells; i++) {
    const X = cx0 + i * (CELL_W + CELL_GAP), Y = y + 3;
    for (let j = 0; j < CELL_H; j++) {
      const sl = Math.floor((CELL_H - 1 - j) / 3); // the cell leans (a parallelogram: the ▰)
      for (let q = 0; q < CELL_W; q++) {
        const on = i < filled;
        const edge = q === 0 || q === CELL_W - 1 || j === 0 || j === CELL_H - 1;
        if (on) ui.set(X + q + sl, Y + j, j === 0 ? PAL.C8 : j === CELL_H - 1 ? PAL.C4 : PAL.C6);
        else if (edge && k >= 2) ui.set(X + q + sl, Y + j, PAL.N5);
      }
    }
  }
};
/** Over his reflection: the same plate rises in the same three steps, and nothing types. The cursor waits. */
export const drawEmptyPlate = (ui: Buf, cx: number, bottom: number, k: number) => {
  if (k < 0) return;
  const rise = k < 1 ? 6 : k < 2 ? 4 : k < 3 ? 2 : 0;
  const w = 40, h = CELL_H + 6;
  const x = clamp(Math.round(cx - w / 2), MARGIN, W - MARGIN - w), y = Math.max(MARGIN, bottom - h) + rise;
  rect(x, y, w, h, ui.ink(PAL.N0));
  rect(x + 1, y + 1, w - 2, 1, ui.ink(PAL.N3));
  if (k >= 4 && Math.floor((k - 4) / 8) % 2 === 0) rect(x + 3, y + 4, 4, 7, ui.ink(PAL.C6));
};

// ------------------------------------------------------------------ the POV rim (whose memory this is)
/** The model's rim, in cyan once the four have converged: a stepped glow in whole rungs (the edge of a memory, not a
 *  UI stroke). level 0..3; the third ring is a 50% light-falloff dither. */
export const drawRim = (ui: Buf, level: number) => {
  if (level <= 0) return;
  const rings: number[][] = [[PAL.C2], [PAL.C4, PAL.C2], [PAL.C5, PAL.C3, PAL.C1]];
  const r = rings[Math.min(3, level) - 1];
  r.forEach((c, i) => {
    const dith = i === 2;
    for (let x = i; x < W - i; x++) { if (!dith || (x + i) % 2 === 0) { ui.set(x, i, c); } if (!dith || (x + H - 1 - i) % 2 === 0) ui.set(x, H - 1 - i, c); }
    for (let y = i + 1; y < H - 1 - i; y++) { if (!dith || (i + y) % 2 === 0) ui.set(i, y, c); if (!dith || (W - 1 - i + y) % 2 === 0) ui.set(W - 1 - i, y, c); }
  });
};
void hash; void H;
