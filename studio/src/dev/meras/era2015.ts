// MR. MAS — meras: 2015, the first 15 frames of THE WOODROSE. The crown's glint cuts to the same glint on
// a candle flame (a graphic match on 4.4); the flame settles, and its light re-renders the room outward in
// BASE (a radial render front: candlelight literally brings the world up to full fidelity).
// Authored in master colours; before the front passes it shows through the 2014 palette.
import {Buf, rect, line, ellipse, poly} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {bigText, text, textWidth} from '../../shared/pixel/font';
import {bayer4, bayer8} from '../../shared/pixel/dither';
import {inPalette} from '../../shared/pixel/palettes';
import {drawGergTable, gergTypeAt, GERG_TABLE_EDGE} from '../../shared/pixel/cast/gerg';
import {drawSpark, HANDOFF} from './era2014';
import {eraStamp} from '../../shared/pixel/cast/era';
import {T} from './timeline';

/** the candelabra's flame sits exactly where the crown's glint lands (and where mdinner1's candelabra is) */
export const FLAME: [number, number] = HANDOFF;
const TABLE_FAR = 152, TABLE_NEAR = 204;

const dth = (b: Buf, x0: number, y0: number, w: number, h: number, f: (x: number, y: number) => number | null) => {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const c = f(x, y); if (c !== null) b.set(x, y, c); }
};

const room = (b: Buf) => {
  // dark green wallpaper over warm wood panelling
  dth(b, 0, 0, b.w, 108, (x, y) => (((x + (y >> 3) * 3) % 12 === 0 && y % 8 < 5) ? PAL.L0 : PAL.N2));
  rect(0, 108, b.w, 3, b.ink(PAL.D3));
  rect(0, 111, b.w, TABLE_FAR - 111, b.ink(PAL.D1));
  for (let x = 20; x < b.w; x += 44) { rect(x, 116, 36, 30, b.ink(PAL.D2)); rect(x, 116, 36, 1, b.ink(PAL.D3)); rect(x + 35, 116, 1, 30, b.ink(PAL.D0)); }
  // the window: dusk over the city, the sky banded, a few lights coming on
  const wx = 206, wy = 18, ww = 132, wh = 84;
  const bands = [PAL.N5, PAL.N6, PAL.N7, PAL.X3, PAL.W5, PAL.W6];
  for (let y = 0; y < wh; y++) for (let x = 0; x < ww; x++) {
    const t = y / wh * (bands.length - 1);
    const i = Math.floor(t), f = t - i;
    b.set(wx + x, wy + y, i + 1 < bands.length && bayer4(x, y) < f ? bands[i + 1] : bands[i]);
  }
  const sky: Array<[number, number, number]> = [[0, 58, 14], [14, 46, 10], [24, 62, 16], [40, 38, 12], [52, 54, 18], [70, 30, 10], [80, 50, 14], [94, 42, 12], [106, 60, 12], [118, 36, 14]];
  for (const [sx, sy, sw] of sky) { rect(wx + sx, wy + sy, sw, wh - sy, b.ink(PAL.N2)); for (let k = 0; k < 4; k++) b.set(wx + sx + 2 + ((k * 5) % (sw - 2)), wy + sy + 4 + k * 5, PAL.W7); }
  rect(wx - 3, wy - 3, ww + 6, 3, b.ink(PAL.D2)); rect(wx - 3, wy + wh, ww + 6, 4, b.ink(PAL.D3));
  rect(wx - 3, wy, 3, wh, b.ink(PAL.D2)); rect(wx + ww, wy, 3, wh, b.ink(PAL.D1));
  rect(wx + Math.floor(ww / 2) - 1, wy, 3, wh, b.ink(PAL.D1)); rect(wx, wy + 40, ww, 2, b.ink(PAL.D1));
  // candlelight warms the wall behind the flame (stepped rings, ordered edges)
  const [fx, fy] = FLAME;
  dth(b, fx - 120, fy - 90, 240, 180, (x, y) => {
    const d = Math.hypot((x - fx) / 116, (y - fy) / 86);
    if (d > 1) return null;
    const c = b.get(x, y);
    const panel = y >= 108;
    const warm = panel ? [PAL.D2, PAL.D3, PAL.D4] : [PAL.W0, PAL.W1, PAL.W2];
    const lv = d < 0.34 ? 1 : d < 0.72 ? 0 : bayer4(x, y) < (1 - d) * 3.5 ? 0 : -1;
    if (lv < 0) return null;
    if (panel && (c === PAL.D0 || c === PAL.D3)) return stepColor(c, 1);
    return warm[lv];
  });
  // a pendant lamp far right
  line(430, 0, 430, 30, b.ink(PAL.N0));
  poly([420, 38, 440, 38, 435, 30, 425, 30], b.ink(PAL.D0));
  ellipse(430, 40, 4, 2, b.ink(PAL.W8));
};

const tabletop = (b: Buf, x0 = 0, x1 = 480, y0 = TABLE_FAR) => {
  // linen, lit warm from the candles, receding
  dth(b, x0, y0, x1 - x0, TABLE_NEAR - y0, (x, y) => {
    const d = Math.min(Math.hypot((x - FLAME[0]) / 150, (y - TABLE_NEAR) / 60), Math.hypot((x - 170) / 70, (y - 170) / 30) + 0.3, Math.hypot((x - 400) / 70, (y - 168) / 30) + 0.3);
    return d < 0.4 ? PAL.W8 : d < 0.7 ? (bayer4(x, y) < 0.5 ? PAL.W8 : PAL.P1) : d < 1.1 ? PAL.P1 : d < 1.5 ? (bayer4(x, y) < 0.5 ? PAL.P1 : PAL.P0) : PAL.P0;
  });
  // the table runner: the thread, lying flat
  if (y0 <= 172) { rect(x0, 172, x1 - x0, 3, b.ink(PAL.C4)); rect(x0, 172, x1 - x0, 1, b.ink(PAL.C6)); }
};

const TABLE_X0 = 158;
const table = (b: Buf) => {
  // the floor at the left, where the table ends and the sideboard stands against the wall
  dth(b, 0, 190, TABLE_X0, b.h - 190, (x, y) => ((y - 190) % 9 === 0 ? PAL.D0 : bayer4(x, y) < Math.max(0, 0.5 - Math.hypot(x - FLAME[0], y - 196) / 160) ? PAL.D2 : PAL.D1));
  tabletop(b, TABLE_X0, b.w);
  rect(TABLE_X0, TABLE_FAR - 1, b.w - TABLE_X0, 1, b.ink(PAL.P0));
  // the cloth's front drape, folds in the candlelight
  const ramp = [PAL.W8, PAL.P1, PAL.P0, PAL.X3, PAL.X2, PAL.X1, PAL.X0];
  dth(b, TABLE_X0, TABLE_NEAR, b.w - TABLE_X0, b.h - TABLE_NEAR, (x, y) => {
    const ph = ((x + 3) % 26) / 26; // a fold every 26px: lit crest, then the turn into shadow
    const fold = ph < 0.5 ? 0 : 1;
    const dx = Math.abs(x - FLAME[0]) / 200, dy = (y - TABLE_NEAR) / 70;
    const v = dx * 2 + dy * 2.2;
    let lv = Math.floor(v) + fold;
    // dither only on the seam between two bands (a 2px checker), never across a whole band
    if ((v % 1) > 0.85 && ((x + y) & 1)) lv += 1;
    return ramp[Math.max(0, Math.min(ramp.length - 1, lv))];
  });
  rect(TABLE_X0, TABLE_NEAR, b.w - TABLE_X0, 1, b.ink(PAL.P2));
  // the table's end: the cloth corner falls straight down, in shadow
  poly([TABLE_X0 - 6, TABLE_NEAR + 2, TABLE_X0, TABLE_FAR, TABLE_X0, b.h, TABLE_X0 - 8, b.h], b.ink(PAL.X1));
  line(TABLE_X0, TABLE_FAR, TABLE_X0 - 6, TABLE_NEAR + 2, b.ink(PAL.P0));
};

const place = (b: Buf, x: number, y: number) => {
  ellipse(x, y, 11, 3, b.ink(PAL.P0)); ellipse(x, y - 1, 9, 2, b.ink(PAL.P2));
  rect(x - 16, y - 2, 1, 5, b.ink(PAL.G5)); rect(x + 16, y - 2, 1, 5, b.ink(PAL.G5));
  // a wine glass
  rect(x + 20, y - 12, 5, 6, b.ink(PAL.G4)); rect(x + 21, y - 11, 3, 3, b.ink(PAL.R1)); rect(x + 22, y - 6, 1, 5, b.ink(PAL.G5)); rect(x + 20, y - 1, 5, 1, b.ink(PAL.G5));
  b.set(x + 20, y - 12, PAL.W8);
};

const candle = (b: Buf, x: number, base: number, h: number, g: number, hero = false) => {
  // brass stick, wax taper, a flame on twos
  const w = hero ? 8 : 3;
  rect(x - w, base - 2, w * 2 + 1, 3, b.ink(PAL.W4)); rect(x - w, base - 2, w * 2 + 1, 1, b.ink(PAL.W6));
  if (hero) { rect(x - 3, base - 8, 7, 6, b.ink(PAL.W3)); rect(x - 3, base - 8, 2, 6, b.ink(PAL.W5)); rect(x - 5, base - 9, 11, 2, b.ink(PAL.W4)); }
  else rect(x - 2, base - 6, 5, 4, b.ink(PAL.W3));
  const cw = hero ? 7 : 3, cx0 = x - Math.floor(cw / 2), top = base - (hero ? 9 : 6) - h;
  rect(cx0, top, cw, h, b.ink(PAL.P1));
  rect(cx0, top, hero ? 2 : 1, h, b.ink(PAL.W8));
  rect(cx0 + cw - 1, top, 1, h, b.ink(PAL.P0));
  if (hero) { rect(cx0 + 4, top + 1, 2, 9, b.ink(PAL.P2)); rect(cx0 + 4, top + 10, 1, 2, b.ink(PAL.P2)); rect(cx0, top, cw, 1, b.ink(PAL.P2)); }
  const fy = top - 1;
  const f = Math.floor(g / 2) % 2;
  if (hero) {
    const fl = f ? ['..#..', '..#..', '.###.', '.#o#.', '#ooo#', '#ooo#', '.#o#.', '..,..'] : ['...#.', '..#..', '.###.', '.#o#.', '#ooo#', '#ooo#', '.#o#.', '..,..'];
    fl.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; const X = x - 2 + i, Y = fy - 7 + j; if (c === '#') b.set(X, Y, PAL.W7); else if (c === 'o') b.set(X, Y, PAL.W9); else if (c === ',') b.set(X, Y, PAL.N0); } });
  } else { b.set(x, fy - 1, PAL.W8); b.set(x, fy - 2, PAL.W7); b.set(x + (f ? 1 : 0), fy - 3, PAL.W6); }
};

const candelabra = (b: Buf, g: number) => {
  const [fx, fy] = FLAME;
  // sideboard against the wall, lit from its own candles
  rect(22, 146, 128, 6, b.ink(PAL.D3)); rect(22, 146, 128, 1, b.ink(PAL.W5));
  rect(26, 152, 120, 40, b.ink(PAL.D1));
  for (const x of [30, 88]) { rect(x, 156, 54, 32, b.ink(PAL.D2)); rect(x, 156, 54, 1, b.ink(PAL.D4)); rect(x + 25, 170, 4, 2, b.ink(PAL.W5)); }
  // brass: a stem and two arms
  rect(fx - 1, fy + 22, 3, 24, b.ink(PAL.W4)); rect(fx - 1, fy + 22, 1, 24, b.ink(PAL.W6));
  rect(fx - 6, fy + 42, 13, 4, b.ink(PAL.W4)); rect(fx - 6, fy + 42, 13, 1, b.ink(PAL.W6));
  for (const s of [-1, 1]) { line(fx, fy + 30, fx + s * 16, fy + 26, b.ink(PAL.W4)); line(fx + s * 16, fy + 26, fx + s * 18, fy + 20, b.ink(PAL.W4)); }
  candle(b, fx - 18, fy + 22, 10, g + 1);
  candle(b, fx + 18, fy + 22, 10, g + 3);
  candle(b, fx, fy + 22 + 6, 16, g, true);
};

/** Paint the dinner in master colours (BASE) for global frame g. */
export const dinnerBase = (b: Buf, g: number) => {
  rect(0, 0, b.w, b.h, b.ink(PAL.N1));
  room(b);
  // Gerg is already there, typing; keycaps pop from the first frame of the room
  candelabra(b, g);
  table(b);
  drawGergTable(b, 322, TABLE_FAR - GERG_TABLE_EDGE + 10, {type: gergTypeAt(g), lid: 0, look: 0, mouth: 'rest', flick: (g >> 1) & 1 ? 1 : 0}, g - 214, {
    table: (bb, x, y) => tabletop(bb, x - 4, x + 58, y),
  });
  place(b, 262, 188);
  place(b, 360, 190);
  candle(b, 214, 170, 14, g + 1);
  candle(b, 400, 168, 12, g);
  // the menu card
  const card = 'THE WOODROSE';
  const cw = textWidth(card) + 8;
  const mx = 186;
  poly([mx, 196, mx + cw, 196, mx + cw - 3, 182, mx + 3, 182], b.ink(PAL.P2));
  rect(mx, 196, cw, 1, b.ink(PAL.P0));
  text(b, card, mx + 4, 186, PAL.D2);

  eraStamp(b, '2015', g - T.y15);
};

/**
 * Radial render front from the flame: BASE behind it, the 2014 palette ahead, a ring of candle-warm
 * dither at the edge. r grows eased-in (the light gathers, then races to the corners).
 */
const radialFront = (out: Buf, a: Buf, bb: Buf, cx: number, cy: number, r: number, smear: number) => {
  for (let y = 0; y < out.h; y++)
    for (let x = 0; x < out.w; x++) {
      const i = y * out.w + x;
      const d = Math.hypot(x + 0.5 - cx, (y + 0.5 - cy) * 1.15);
      const k = d - r;
      let c = k < -smear ? bb.c[i] : k < 0 ? (bayer8(x, y) < -k / smear ? bb.c[i] : a.c[i]) : a.c[i];
      // the edge of the light: a 1px broken warm line, a sparse glow just behind it — light, not a bubble
      if (k >= -1 && k < 1) c = bayer4(x, y) < 0.35 ? PAL.W8 : c;
      else if (k >= -4 && k < -1 && bayer4(x, y) < 0.12) c = PAL.W7;
      out.c[i] = c;
    }
};

export const frontRadius = (g: number) => {
  const t = Math.max(0, Math.min(1, (g - (T.y15 - 3)) / (T.frontEnd - (T.y15 - 3))));
  return Math.round(4 + t * t * 560);
};

/**
 * Paint the 2015 frame for global frame g (f225..239). A hard switch on the cut: the dinner is in the show's full
 * palette from its first frame (no second render front: meras ends its whip in early-web on f224). The glint carried
 * over from the crown flares on the cut and shrinks into the flame.
 */
export const draw2015 = (b: Buf, g: number) => {
  dinnerBase(b, g);
  if (g < T.y15 - 2) drawSpark(b, FLAME[0], FLAME[1], g === T.whip ? 4 : 3);
  else if (g === T.y15 - 2) drawSpark(b, FLAME[0], FLAME[1], 2);
};
