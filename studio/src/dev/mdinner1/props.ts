// MR. MAS — mdinner1: props. The CTRL key, Gerg's napkin (sketch -> website), the paperclip-robot effigy and
// its fire, Mas's telescoping marshmallow fork, and the foreground candle that wipes the frame at f340.
// Screen coordinates unless a function says world. Whole pixels, master palette, held drawings.
import {Buf, bayer, clamp, hash, line, rect} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {micro, microWidth} from '../../shared/pixel/cast/bosses';

const stamp = (b: Buf, x: number, y: number, rows: string[], pal: Record<string, number>, flip = false) =>
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[flip ? r.length - 1 - i : i]]; if (c !== undefined) b.set(x + i, y + j, c); } });

// ------------------------------------------------------------------ the CTRL key (a modifier: wider than the popcorn caps)
// The legend is printed ON the cap (no floating label): a 13x4 hand-pixelled "CTRL" in the key's green.
const KEY_PAL: Record<string, number> = {z: PAL.N0, T: PAL.G5, t: PAL.G4, g: PAL.L3, G: PAL.L2, S: PAL.G3, s: PAL.G2, h: PAL.G6};
const LEGEND = ['.##.###.##..#.', '#....#..#.#.#.', '#....#..##..#.', '.##..#..#.#.##'];
const face = (row: string, lit: boolean) => row.split('').map((c) => (c === '#' ? (lit ? 'g' : 'G') : 'T')).join('');
const KEY_DRAW = [
  // 0: flat, legend up (the read)
  ['.zzzzzzzzzzzzzz.', 'zhTTTTTTTTTTTTtz', ...LEGEND.map((r) => 'z' + face(r, true) + 'z'), 'zSSSSSSSSSSSSSsz', '.zzzzzzzzzzzzzz.'],
  // 1: tumbling, edge-on
  ['.zzzz.', 'zhTTtz', 'zTgTtz', 'zTTTtz', 'zSSSsz', 'zSSSsz', '.zzzz.'],
  // 2: tumbling, the underside (the stem cross shows)
  ['.zzzzzzzzzzzzzz.', 'zsSSSSSSSSSSSSSz', 'zsSSSSSSzSSSSSSz', 'zsSSSSSzzzSSSSSz', 'zsSSSSSSzSSSSSSz', 'zhTTTTTTTTTTTTtz', '.zzzzzzzzzzzzzz.'],
];
export const KEY_W = 16, KEY_H = 8;
/** the key's grip point inside the drawing (so Mas's hand stays on the same pixel whatever the key's size) */
export const KEY_HAND: [number, number] = [8, 6];
export const drawCtrlKey = (b: Buf, x: number, y: number, drawing: 0 | 1 | 2) => {
  const d = KEY_DRAW[drawing];
  // centre every drawing on the flat key's box so the tumble does not wander
  stamp(b, x + ((KEY_W - d[0].length) >> 1), y + ((KEY_H - d.length) >> 1), d, KEY_PAL);
};

/** Mas's water glass: the flat water line (two rows inside set.ts drawGlass's empty bowl). It never moves. */
export const drawWaterLine = (b: Buf, x: number, y: number) => {
  for (let i = 1; i < 5; i++) { b.set(x - 3 + i, y - 7, PAL.P1); b.set(x - 3 + i, y - 6, PAL.X3); }
};

/** CTRL key flight (world): pops off Gerg's deck at w=226 and is at its apex, right in front of Mas, at w=240. */
export const CTRL_FROM: [number, number] = [412, 200];
export const CTRL_APEX: [number, number] = [486, 160]; // exactly where his reach2 hand closes (masdinner MASD_HAND.reach2 - key offset)
export const ctrlFlight = (w: number): {x: number; y: number; d: 0 | 1 | 2} | null => {
  const t0 = 226, t1 = 240;
  if (w < t0) return null;
  const t = clamp((w - t0) / (t1 - t0), 0, 1);
  const x = Math.round(CTRL_FROM[0] + (CTRL_APEX[0] - CTRL_FROM[0]) * t);
  const y = Math.round(CTRL_FROM[1] - (CTRL_FROM[1] - CTRL_APEX[1]) * (1 - (1 - t) * (1 - t)));
  const d = t >= 1 ? 0 : ([1, 2, 1, 0][Math.floor((w - t0) / 2) % 4] as 0 | 1 | 2);
  return {x, y, d};
};

// ------------------------------------------------------------------ Gerg's napkin: a pen sketch, then (f232) a live website
const NAPKIN_SKETCH = [
  '.pppppppppppp.',
  'pPPPPPPPPPPPPp',
  'pPkkkkkPkPkPPp',
  'pPPPPPPPPPPPPp',
  'pPkPPPPPPPkPPp',
  'pPkPkkkkPPkPPp',
  'pPkPPPPPPPkPPp',
  'pPkkkkkkkkkPPp',
  'pPPPPkkkPPPPPp',
  'pPPPPPPPPPPPPp',
  '.pppppppppppp.',
];
const NAPKIN_SITE = [
  '.zzzzzzzzzzzz.',
  'zbbbbbbbbbbbbz',
  'zbrbybgbbbbbbz',
  'zwwwwwwwwwwwwz',
  'zwhhhhhhhwwwwz',
  'zwhHHhhhhwLLwz',
  'zwhhhhhhhwwwwz',
  'zwwwwwwwwwwwwz',
  'zwkkkkkwkkkkwz',
  'zwwwwwwwwwwwwz',
  '.zzzzzzzzzzzz.',
];
export const drawNapkin = (b: Buf, x: number, y: number, site: boolean) => {
  if (!site) stamp(b, x, y, NAPKIN_SKETCH, {p: PAL.P0, P: PAL.P1, k: PAL.N4});
  else {
    stamp(b, x, y, NAPKIN_SITE, {z: PAL.N1, b: PAL.C4, r: PAL.R3, y: PAL.W7, g: PAL.L3, w: PAL.P2, h: PAL.C6, H: PAL.C8, L: PAL.L3, k: PAL.N5});
    // the page lights the cloth under it
    for (let i = 1; i < 13; i++) if (bayer(x + i, y + 11) < 0.5) b.set(x + i, y + 11, PAL.C4);
  }
};

// ------------------------------------------------------------------ the paperclip-robot effigy (world coords in, screen out)
export const EFFIGY = {x: 590, base: 209} as const;
/** The robot is one bent paperclip wire: clip torso, loop head, wire limbs. `glow` = the wire heats in the fire. */
/** `arms`: 0 = at its sides (the sign lies on the plinth), 1 = halfway, 2 = the sign held up over its head. */
export const drawEffigy = (b: Buf, ox: number, oy: number, glow: number, arms: 0 | 1 | 2 = 2) => {
  const X = EFFIGY.x - ox, B = EFFIGY.base - oy;
  const wire = glow > 0.5 ? PAL.W6 : PAL.G5, hi = glow > 0.5 ? PAL.W8 : PAL.G6, sh = PAL.N1;
  const w = (x: number, y: number) => { b.set(x, y, wire); };
  const wl = (x0: number, y0: number, x1: number, y1: number) => line(x0, y0, x1, y1, w);
  // plinth
  rect(X - 8, B - 2, 17, 3, b.ink(PAL.D2));
  rect(X - 8, B - 2, 17, 1, b.ink(PAL.D4));
  rect(X - 7, B + 1, 15, 1, b.ink(PAL.N0));
  // legs: two wires down to the plinth, bent at the knee
  wl(X - 3, B - 13, X - 4, B - 8); wl(X - 4, B - 8, X - 3, B - 3);
  wl(X + 3, B - 13, X + 4, B - 8); wl(X + 4, B - 8, X + 3, B - 3);
  // the clip torso (outer loop 9x18, inner loop 5x12, joined at the bottom-left)
  const T = B - 32;
  const loop = (x0: number, y0: number, ww: number, hh: number) => {
    wl(x0 + 1, y0, x0 + ww - 2, y0); wl(x0 + 1, y0 + hh - 1, x0 + ww - 2, y0 + hh - 1);
    wl(x0, y0 + 1, x0, y0 + hh - 2); wl(x0 + ww - 1, y0 + 1, x0 + ww - 1, y0 + hh - 2);
  };
  loop(X - 4, T, 9, 19);
  loop(X - 2, T + 3, 5, 13);
  b.set(X - 3, T + 17, PAL.N0); // the gap where the wire crosses over
  for (let j = 1; j < 18; j++) b.set(X + 5, T + j, sh); // wire shadow side
  b.set(X - 4, T + 2, hi); b.set(X - 4, T + 3, hi); b.set(X - 3, T, hi);
  // arms: at its sides, then (on its own, as the cathedral wakes) raising its protest sign over its head
  if (arms === 2) { wl(X - 4, T + 4, X - 8, T - 2); wl(X - 8, T - 2, X - 11, T - 10); wl(X + 4, T + 4, X + 8, T - 2); wl(X + 8, T - 2, X + 11, T - 10); }
  else if (arms === 1) { wl(X - 4, T + 4, X - 9, T + 3); wl(X - 9, T + 3, X - 11, T - 1); wl(X + 4, T + 4, X + 9, T + 3); wl(X + 9, T + 3, X + 11, T - 1); }
  else { wl(X - 4, T + 4, X - 6, T + 10); wl(X - 6, T + 10, X - 6, T + 16); wl(X + 4, T + 4, X + 6, T + 10); wl(X + 6, T + 10, X + 6, T + 16); }
  // head: a small wire loop with two dot eyes
  const H = T - 7;
  wl(X - 1, H, X + 1, H); wl(X - 2, H + 1, X - 2, H + 4); wl(X + 2, H + 1, X + 2, H + 4); wl(X - 1, H + 5, X + 1, H + 5);
  b.set(X, H + 6, wire);
  b.set(X - 1, H + 2, glow > 0.5 ? PAL.W9 : PAL.R3); b.set(X + 1, H + 2, glow > 0.5 ? PAL.W9 : PAL.R3);
  b.set(X - 2, H + 1, hi);
};
/** The effigy's sign, drawn AFTER the fire (held over the flames, so it stays readable). arms 0: lying on the plinth. */
export const drawEffigySign = (b: Buf, ox: number, oy: number, arms: 0 | 1 | 2 = 2) => {
  const X = EFFIGY.x - ox, B = EFFIGY.base - oy;
  const T = B - 32 + (arms === 1 ? 11 : 0);
  if (arms === 0) {
    // face down on the plinth: just its cardboard edge
    rect(X - 10, B - 3, 21, 1, b.ink(PAL.P0)); rect(X - 10, B - 4, 21, 1, b.ink(PAL.D4));
    return;
  }
  const wl = (x0: number, y0: number, x1: number, y1: number) => line(x0, y0, x1, y1, (x, y) => b.set(x, y, PAL.P0));
  // hand-lettered UNALIGNED on a card, held up over its head in both wire hands
  const s = 'UNALIGNED', sw = microWidth(s) + 6, sx = X - Math.floor(sw / 2), sy = T - 19;
  void wl;
  rect(sx, sy, sw, 9, b.ink(PAL.N0));
  rect(sx + 1, sy + 1, sw - 2, 7, b.ink(PAL.P1));
  rect(sx + 1, sy + 1, sw - 2, 1, b.ink(PAL.P2));
  rect(sx + 1, sy + 7, sw - 2, 1, b.ink(PAL.P0));
  micro(b, s, sx + 3, sy + 2, PAL.R0);
  // the two wire hands gripping the card's bottom edge
  const hy = sy + 8 + (arms === 1 ? -1 : 0);
  b.set(X - 11, hy, PAL.G5); b.set(X - 11, hy + 1, PAL.G5); b.set(X + 11, hy, PAL.G5); b.set(X + 11, hy + 1, PAL.G5);
};

/** Fire around the effigy's legs and plinth. `age` = frames since ignition (<0 none), `t` = flame clock (held 2). */
export const drawEffigyFire = (b: Buf, ox: number, oy: number, age: number, t: number) => {
  if (age < 0) return;
  const X = EFFIGY.x - ox, B = EFFIGY.base - oy;
  // ignition: a spark (0), the whoomph (1: oversized), then the steady burn
  const hgt = age === 0 ? 7 : age === 1 ? 30 : 19 + ((Math.floor(t / 2) % 3) === 1 ? 2 : 0);
  const hw = age === 0 ? 4 : age === 1 ? 16 : 12;
  const k = Math.floor(t / 2);
  const BANDS = [PAL.R1, PAL.R2, PAL.W5, PAL.W6, PAL.W7, PAL.W8, PAL.W9];
  for (let j = 0; j < hgt + 6; j++)
    for (let i = -hw - 3; i <= hw + 3; i++) {
      const u = j / hgt; // 0 at the base
      // teardrop profile, licked by three tongues that walk up on the clock
      const prof = hw * Math.pow(Math.max(0, 1 - u), 0.7) * (1 + 0.18 * Math.sin(u * 7 + k * 1.9));
      const tongue = Math.max(0, Math.sin(i * 0.55 + k * 2.3) * 0.5 + Math.sin(i * 0.23 - k * 1.1) * 0.5) * 7 * (1 - Math.abs(i) / (hw + 3));
      const top = hgt + tongue;
      if (j > top) continue;
      const ax = Math.abs(i);
      if (ax > prof + 1.5 && j > 3) continue;
      const heat = clamp(1 - Math.max(ax / (prof + 1.5), Math.pow(j / top, 2.4)) - (j / top) * 0.25 + (hash(i, j + k * 3, 17) - 0.5) * 0.12, 0, 1);
      if (heat < 0.06 && bayer(X + i, B - j) > 0.5) continue;
      b.set(X + i, B - j, BANDS[clamp(Math.floor(heat * 7.2), 0, 6)]);
    }
  // embers rising (whole pixels, hashed paths)
  if (age >= 1)
    for (let e = 0; e < 6; e++) {
      const life = 10, ph = (t + e * 4) % life;
      const ex = X + Math.round((hash(e, Math.floor((t + e * 4) / life), 3) - 0.5) * hw * 1.6 + Math.sin(ph * 0.9 + e) * 1.5);
      const ey = B - hgt + 4 - ph * 3;
      b.set(ex, ey, ph < 4 ? PAL.W8 : ph < 7 ? PAL.W6 : PAL.R2);
    }
};

// ------------------------------------------------------------------ Mas's telescoping marshmallow fork (world coords)
/** `len` = shaft length, `toast` 0 raw .. 3 golden. Hand at (hx, hy) (world), pointing along +x. */
export const drawForkStick = (b: Buf, ox: number, oy: number, hx: number, hy: number, len: number, toast: number, dir: [number, number] = [1, 0]) => {
  const x0 = hx - ox, y0 = hy - oy;
  const x1 = Math.round(x0 + dir[0] * len), y1 = Math.round(y0 + dir[1] * len);
  // telescoping sections: each joint a 1px brighter collar
  line(x0, y0, x1, y1, (x, y) => b.set(x, y, PAL.G5));
  line(x0, y0 + 1, x1, y1 + 1, (x, y) => { if (b.get(x, y) !== PAL.G5) b.set(x, y, PAL.N1); });
  for (let s = 12; s < len; s += 12) b.set(Math.round(x0 + dir[0] * s), Math.round(y0 + dir[1] * s), PAL.G6);
  // two tines
  b.set(x1 + 1, y1 - 1, PAL.G6); b.set(x1 + 1, y1 + 1, PAL.G6);
  // the marshmallow (4x4): raw cream -> toasted -> golden, a caramel seam
  const M = [
    ['.PP.', 'PPPp', 'PPpp', '.pp.'],
    ['.WP.', 'WPPp', 'PPpp', '.pp.'],
    ['.WW.', 'WwPp', 'PPpd', '.dd.'],
    ['.WW.', 'WwwW', 'wwdd', '.dd.'],
  ][clamp(toast, 0, 3)];
  stamp(b, x1 + 1, y1 - 2, M, {P: PAL.P2, p: PAL.P1, W: PAL.W7, w: PAL.W6, d: PAL.W4});
};

// ------------------------------------------------------------------ the foreground candle that wipes the frame (f340-344)
/** Wipe positions (screen x of the flame's centre) for f340..344: right to left across the lens. */
export const WIPE_X = [560, 380, 200, 20, -170];
/**
 * A candle almost on the lens, trucked past at 3x parallax. A real flame shape: a round belly, a concave taper to
 * the tip, a blue root at the wick; hot white core, bands stepped with an
 * ordered-dither seam (no blur), plus a warm flare lifted into whatever is around it. `x` = the flame's centre.
 */
export const drawWipeFlame = (b: Buf, x: number, frame: number) => {
  const H = b.h, base = H + 24, tip = -6, HW = 118;
  const len = base - tip;
  const kb = 0.34; // where the belly is widest
  // flare: a stepped warm lift around the flame (one ring, dithered)
  for (let y = 0; y < H; y++)
    for (let X = Math.max(0, x - HW - 60); X <= Math.min(b.w - 1, x + HW + 60); X++) {
      const d = Math.hypot((X - x) / (HW + 56), (y - (base - kb * len)) / (len * 0.62));
      if (d > 1 || bayer(X, y) > (1 - d) * 1.2) continue;
      const c = b.get(X, y);
      const n = stepColor(c, 1);
      b.set(X, y, n === c ? PAL.W1 : n);
    }
  for (let y = 0; y < H; y++) {
    const t = (base - y) / len; // 0 at the wick, 1 at the tip
    const hw = t < kb ? HW * Math.sqrt(Math.max(0, 1 - ((kb - t) / kb) ** 2)) : HW * Math.pow(Math.max(0, 1 - (t - kb) / (1 - kb)), 1.7);
    const cx = x + Math.sin(t * 3.2 + frame * 0.8) * 10 * t * t;
    for (let X = Math.max(0, Math.floor(cx - hw - 1)); X <= Math.min(b.w - 1, Math.ceil(cx + hw + 1)); X++) {
      const d = Math.abs(X + 0.5 - cx) / Math.max(1, hw);
      if (d > 1) continue;
      const bz = (bayer(X, y) - 0.5) * 0.1;
      if (t < 0.1 && d > 0.25) { b.set(X, y, d + bz > 0.75 ? PAL.N6 : PAL.C5); continue; } // blue root
      const hot = d * 0.9 + Math.max(0, t - 0.6) * 0.45 + bz;
      const c = hot < 0.36 ? PAL.W9 : hot < 0.56 ? PAL.W8 : hot < 0.72 ? PAL.W7 : hot < 0.86 ? PAL.W6 : PAL.W5;
      b.set(X, y, c);
    }
  }
};
