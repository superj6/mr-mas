// MR. MAS — mfinale: the bookend (f690-719). Back in the cold open's room, in its MEDIUM two-shot, so the piece
// closes where it opened. The room, Mas, the Orb, the desk, his glass and the monitor ARE the cold open's
// (src/dev/mcoldopen/medium.ts drawMedium, read-only): whatever the cold open changes, the bookend inherits.
// Only the screen's content is this span's.
//   690-691  pull back: the title turns out to be on a screen (the bezel comes in from the frame edge, LCD rows)
//   692-704  the room. The show is on his monitor; its dusk violet lights him (a ramp swap on his key light and
//            the monitor's pool), and the Orb watches the screen with him
//   705      the last beat: Post, the cold open's own click drawing (eyes on the lens, the one-pixel smile). The
//            picture flies up into the feed, the composer is empty again (the f0 state), the key light goes
//            back to cyan, and for 2 frames the Orb's iris shows the skyline in GLYPH, then settles
//   712-719  the room dissolves to black on an ordered dither; the caret stays, on the beat, for the loop
import {Buf, W, H, rect, line, bayer, clamp, TRANSPARENT} from '../../shared/pixel/px';
import {PAL, stepColor, nearest, ALL_COLORS} from '../../shared/pixel/palette';
import {text, textWidth} from '../../shared/pixel/font';
import {radialMask} from '../../shared/pixel/mask';
import type {SwitchSpec, DrawResult} from '../../shared/pixel/compose';
import {drawMedium, MED, CARET_FRAME} from '../mcoldopen/medium';
import {screenAt, SW, SH} from '../mcoldopen/screen';
import {orbBob} from '../../shared/pixel/cast/orb';
import {T, IRIS_GLYPH} from './timeline';
import {drawTitle, titleAfter} from './title';

// ================================================================== layout: the cold open's, imported
export const SCREEN = {x: MED.screen[0], y: MED.screen[1], w: SW, h: SH};
/** the caret's home (frame coords): where the cold open's LCD macros hold it — the loop point */
export const LOOP_CURSOR: [number, number] = CARET_FRAME;

/**
 * Which cold-open frame's acting the room shows. The bookend replays the cold open's own drawings:
 *   692-704  f56-62, the pause after the first line: eyes on the screen, hands still, the Orb watching the
 *            monitor (cycled so the rack LEDs and the city keep living under a held performance)
 *   705-711  f112, the click on Post: eyes on the lens, the one-pixel smile, the Orb's iris on the lens
 */
const coldFrame = (g: number) => (g < T.last ? 56 + ((g - T.orbTurn) % 7) : 112);
const POSTED = T.last; // 705
const FADE0 = 712;

// ================================================================== the picture on the screen (the title at f689)
const IMG_H = 101;
let thumbCache: Buf | null = null;
/** the title frame at f689, box-filtered 8:3 onto the screen (a display showing a picture), snapped back to the
 *  master palette; bright hairlines (the cyan curve, type) win their cell so they survive the averaging */
const thumb = () => {
  if (thumbCache) return thumbCache;
  const full = new Buf(W, H, PAL.N0);
  drawTitle(full, T.book - 1);
  const ui = new Buf(W, H, TRANSPARENT);
  titleAfter(ui, T.book - 1);
  for (let i = 0; i < full.c.length; i++) if (ui.c[i] < TRANSPARENT) full.c[i] = ui.c[i];
  const tw = SCREEN.w, th = IMG_H, k = W / tw;
  const t = new Buf(tw, th, PAL.N0);
  for (let y = 0; y < th; y++)
    for (let x = 0; x < tw; x++) {
      let r = 0, g = 0, b = 0, n = 0, mx = 0, mc = 0;
      for (let sy = Math.floor(y * k); sy < Math.min(H, Math.ceil((y + 1) * k)); sy++)
        for (let sx = Math.floor(x * k); sx < Math.min(W, Math.ceil((x + 1) * k)); sx++) {
          const c = full.c[sy * W + sx];
          const cr = (c >> 16) & 255, cg = (c >> 8) & 255, cb = c & 255;
          r += cr; g += cg; b += cb; n++;
          if (cr + cg + cb > mx) { mx = cr + cg + cb; mc = c; }
        }
      const avg = (Math.round(r / n) << 16) | (Math.round(g / n) << 8) | Math.round(b / n);
      t.c[y * tw + x] = mx > 3 * 150 && mx / 3 > ((r + g + b) / n) * 1.6 ? mc : nearest(avg, ALL_COLORS);
    }
  thumbCache = t;
  return t;
};

/** the screen: the picture (the show) until he posts; then it flies up into the feed in 3 held steps */
const drawScreenContent = (fb: Buf, g: number) => {
  const {x: sx, y: sy, w: sw, h: sh} = SCREEN;
  // underneath: the cold open's composer at its f0 state (empty, the caret on the beat, the knee on the chart)
  const s = screenAt(((g % 15) + 15) % 15);
  const off = g < POSTED ? 0 : [-34, -72, -112][Math.min(2, g - POSTED)];
  for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) fb.set(sx + i, sy + j, s.c[j * sw + i]);
  if (g < POSTED + 3) {
    const t = thumb();
    for (let j = 0; j < IMG_H; j++) { const Y = sy + j + off; if (Y < sy) continue; for (let i = 0; i < sw; i++) fb.set(sx + i, Y, t.c[j * sw + i]); }
    // the post bar under the picture, the Post button (pressed on the beat)
    const by = sy + IMG_H + off;
    if (by >= sy) {
      rect(sx, by, sw, sh - IMG_H, fb.ink(PAL.N0));
      rect(sx + sw - 30, by + 1, 26, 9, fb.ink(g >= POSTED ? PAL.C8 : PAL.C5));
      text(fb, 'Post', sx + sw - 27, by + 2, PAL.N0);
    }
  }
  // (the f705-711 "your post was sent" notification is replaced by the Orb's per-episode toast, bookAfter)
};

/** THE ORB'S TOAST [SLOT] (SCRIPT §3.10 / §8.1, T28): Ep1 "verified: human", lowercase mono, a notification on his
 *  monitor from f692 (with the Orb's C7 chime) to f719. UI layer, so it holds through the room's dissolve. */
export const TOAST = {text: 'verified: human', from: T.orbTurn, to: 719} as const;
const drawToast = (ui: Buf, g: number) => {
  if (g < TOAST.from || g > TOAST.to) return;
  const {x: sx, y: sy, w: sw} = SCREEN;
  const nw = textWidth(TOAST.text) + 12, kk = g - TOAST.from;
  const nx = sx + sw - nw - 3, ny = sy + (kk === 0 ? 1 : 3); // pops down into place in 2 steps
  rect(nx - 1, ny - 1, nw + 2, 13, ui.ink(PAL.N0));
  rect(nx, ny, nw, 11, ui.ink(PAL.C6));
  rect(nx, ny, nw, 1, ui.ink(PAL.C8));
  text(ui, TOAST.text, nx + 6, ny + 2, PAL.N0);
};

// ================================================================== the key light takes the picture's colour
/**
 * While the dusk title is on his screen, its violet lights him: his cyan-lit skin (K) walks to the mauve
 * mixed-light ramp (X), the cyan rims on his hoodie to the dusk ramp (U), and the monitor's pool on the wall
 * and the desk goes violet. A ramp swap, so the moment he posts (the screen goes back to the dark cyan
 * composer) it simply stops.
 */
const DUSK_KEY = new Map<number, number>([
  [PAL.K0, PAL.X0], [PAL.K1, PAL.X1], [PAL.K2, PAL.X2], [PAL.K3, PAL.X3], [PAL.K4, PAL.S5], [PAL.K5, PAL.S6],
  [PAL.C1, PAL.U0], [PAL.C2, PAL.U1], [PAL.C3, PAL.U2], [PAL.C4, PAL.U3], [PAL.C5, PAL.U4], [PAL.C6, PAL.X3], [PAL.C7, PAL.P1],
]);
const DUSK_POOL = new Map<number, number>([[PAL.C0, PAL.U0], [PAL.C1, PAL.U1], [PAL.C2, PAL.U2]]);
const duskKey = (fb: Buf, mas: Uint8Array) => {
  const {x: sx, y: sy, w: sw, h: sh} = SCREEN;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const c = fb.c[i];
      if (mas[i]) { const n = DUSK_KEY.get(c); if (n !== undefined) fb.c[i] = n; continue; }
      // the pool: the wall between the rack and the window, and the desk; never the screen, the city or the Orb
      const inScreen = x >= sx - 4 && x < sx + sw + 4 && y >= sy - 4 && y < sy + sh + 8;
      const onWall = x >= 46 && x < MED.win.x0 - 5;
      const onDesk = y >= MED.deskY && x < MED.orb[0] - 30;
      if (inScreen || !(onWall || onDesk)) continue;
      const n = DUSK_POOL.get(c);
      if (n !== undefined) fb.c[i] = n;
    }
};

// ================================================================== the Orb's iris (the GLYPH switch's source)
const orbCenter = (g: number): [number, number] => [MED.orb[0], MED.orb[1] + orbBob(coldFrame(g))];
export const irisAt = (g: number) => orbCenter(g);
const IRIS_R = 7.5;
/** the true world the iris sees: the skyline redrawn at iris scale */
const irisSource = (g: number) => {
  const b = new Buf(W, H, PAL.N0);
  const [ix, iy] = orbCenter(g);
  const R = 9;
  for (let y = -R; y <= R; y++)
    for (let x = -R; x <= R; x++) {
      let c = y < -3 ? PAL.N1 : y < 1 ? PAL.U2 : y < 3 ? PAL.W4 : PAL.N0;
      const tower = [4, 6, 3, 7, 5, 4, 8, 6, 9, 17, 10, 6, 8, 5, 9, 4, 6, 3, 5][x + R] ?? 3;
      if (4 - y <= tower && y <= 5) c = x === 0 ? PAL.C3 : (x * 7 + y * 3) % 5 === 0 ? PAL.W5 : PAL.N2;
      if (x === 0 && y < -6) c = PAL.C8; // the spire
      b.set(ix + x, iy + y, c);
    }
  for (let x = -R; x <= 0; x++) { const y = Math.round(4 - 0.02 * Math.exp((x + R) / 1.7)); b.set(ix + x, iy + clamp(y, -R, 4), PAL.C9); }
  return b;
};

// ================================================================== the scene
export const drawBook = (fb: Buf, g: number): void | DrawResult => {
  const k = g - T.book;
  if (k <= 1) {
    // the title is on a screen: the bezel comes in from the frame edge, LCD rows show
    drawTitle(fb, g);
    const ui = new Buf(W, H, TRANSPARENT);
    titleAfter(ui, g);
    for (let i = 0; i < fb.c.length; i++) if (ui.c[i] < TRANSPARENT) fb.c[i] = ui.c[i];
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x++) fb.set(x, y, stepColor(fb.get(x, y), -1));
    const ins = k === 0 ? 7 : 20;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const e = Math.min(x, y, W - 1 - x, H - 1 - y);
      if (e < ins - 5) fb.set(x, y, e < ins - 12 ? PAL.N1 : PAL.N2);
      else if (e < ins) fb.set(x, y, e === ins - 5 ? PAL.N2 : PAL.N0);
    }
    return;
  }
  // the cold open's medium two-shot, with this span's picture on the monitor
  const mas = new Uint8Array(W * H);
  drawMedium(fb, coldFrame(g), {masMask: mas});
  drawScreenContent(fb, g);
  if (g < POSTED) duskKey(fb, mas);
  // zoom-rects: the frame collapsing onto the screen (2 frames: two outlines, then one)
  if (k === 2 || k === 3) {
    const {x: sx, y: sy, w: sw, h: sh} = SCREEN;
    for (const s of k === 2 ? [0.35, 0.7] : [0.82]) {
      const x0 = Math.round(20 + (sx - 20) * s), y0 = Math.round(20 + (sy - 20) * s);
      const x1 = Math.round(W - 21 + (sx + sw - (W - 21)) * s), y1 = Math.round(H - 21 + (sy + sh - (H - 21)) * s);
      const col = k === 2 ? (s < 0.5 ? PAL.U2 : PAL.U3) : PAL.U2;
      line(x0, y0, x1, y0, fb.ink(col)); line(x0, y1, x1, y1, fb.ink(col)); line(x0, y0, x0, y1, fb.ink(col)); line(x1, y0, x1, y1, fb.ink(col));
    }
  }
  // the last frames dissolve to black on an ordered dither (the caret stays, in the UI layer)
  if (g >= FADE0) {
    const t = (g - FADE0 + 1) / (T.last + 15 - FADE0);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (bayer(x, y) < t * 1.05) fb.set(x, y, PAL.N0); else if (t > 0.3) fb.set(x, y, stepColor(fb.get(x, y), -1));
  }
};

export const bookSwitch = (g: number): SwitchSpec[] | null => {
  if (g >= IRIS_GLYPH.from && g < IRIS_GLYPH.from + IRIS_GLYPH.frames) {
    const [ix, iy] = orbCenter(g);
    return [{type: 'glyph', mask: radialMask(ix + 0.5, iy + 0.5, IRIS_R, 1.5), source: irisSource(g), style: {cell: [1, 2], bloom: 0.9, tint: PAL.C6, tintAmt: 0.25, floor: 0.02, edges: false, size: [1.0, 1.25], shimmer: 0.2}}];
  }
  return null;
};

export const bookAfter = (ui: Buf, g: number): void | DrawResult => {
  drawToast(ui, g);
  // the caret, once the composer is back: on the beat grid (on 8 / off 7), like f0; it survives the fade
  if (g >= FADE0) {
    const [cx, cy] = LOOP_CURSOR;
    if (g % 15 < 8) rect(cx, cy, 4, 8, ui.ink(PAL.C7));
  }
};
