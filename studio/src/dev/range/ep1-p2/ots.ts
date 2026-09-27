// MR. MAS · range E1-P2: the [OTS] over Mas's shoulder onto the dark room's monitor (NEW drawing, pixel, 480 x 203; v5).
// The same room as rooms/darkroom-plate.ts, seen from behind Mas's left shoulder so it keeps the [2S]'s screen
// direction (v5; v4 was shot from his other side and crossed the line: Mas faced right here and left in the [2S], and
// the Orb and the monitor swapped sides). The monitor left of centre, square to the lens and big (its screen is 264 x
// 148 native, the film's 1056 x 592 at 4x); Mas in the foreground at frame right as the show's OTS silhouette (his
// portrait, one rung off black, a 1 px cyan rim on the side that faces the screen: the act-four `shoulder()` grammar,
// re-done here so a dev folder doesn't import an episode), looking screen-left as he does in the [2S]; the [2S]'s
// window and city behind him; the rack is behind the camera. THE ORB floats on his side away from the monitor, as in
// the [2S], nearer the lens than he is, high at frame right: its face turned to the screen, its chrome back to us; its
// scan beam crosses over his head to the glass.
// Light is the room's language: the monitor is the key, and it lights cyan (resolve() walks each material's cyan ramp).
// The screen itself is left black here: the film is composited over it at output resolution (P2Duck.tsx).
// Also: the monitor's own UI (the player's title strip and the chyron caption) as native pixel UI over the film, the
// contact sheet's layout in screen space, and the Orb's scan beam on the grid (the host screen-blends it over the film).
// Mas and the Orb are their own layer (drawCast), drawn after the film and the beam: the beam passes behind his head.
import {Buf, rect, hash, bayer, clamp, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {MatBuf, resolve} from '../../../shared/pixel/light';
import {text} from '../../../shared/pixel/font';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../shared/pixel/cast/mas';
import {drawOrb, orbBob} from '../../../shared/pixel/cast/orb-medium';
import {blitImg} from '../../../shared/pixel/figure';
import type {Img} from '../../../shared/pixel/figure';
import {tiny, tinyWidth} from '../../../shared/pixel/rooms/kit-b';
import {TITLE, CAPTION} from './plan';

export const RH = 203;
/** the screen (native px): the film fills it; output = 4x. v5: the monitor sits left of centre and Mas is at frame
 *  right, looking screen-left at it, the way he looks at it in the [2S] (v4 had him at left looking right: the [OTS]
 *  crossed the line against the [2S], and the Orb and the monitor swapped sides between the shots) */
export const SCR = {x: 66, y: 14, w: 264, h: 148};
export const SCALE = 4;
/** the bezel's outer box */
const BZ = {x0: SCR.x - 7, y0: 7, x1: SCR.x + SCR.w + 7, y1: 172};
/** the player's title strip (screen-local rows) */
export const TITLE_H = 11;
/** the contact sheet (screen-local): six 84 x 47 stills, 3 x 2, 2 px hairline gaps, numbered with their take frames */
export const STILL = {w: 84, h: 47, gap: 2, x0: 4, y0: 21, cols: 3};
export const cellXY = (i: number): [number, number] => [STILL.x0 + (i % STILL.cols) * (STILL.w + STILL.gap), STILL.y0 + Math.floor(i / STILL.cols) * (STILL.h + STILL.gap)];
export const GRID = {x: STILL.x0, y: STILL.y0, w: 3 * STILL.w + 2 * STILL.gap, h: 2 * STILL.h + STILL.gap};
/** the chyron (screen-local) under the sheet, as wide as it */
export const CAP = {x: 4, y: 123, h: 14};
/** THE ORB (native): high at frame right, nearer the lens than Mas (it floats on his side away from the monitor, as
 *  in the [2S]); its face turned down-left to the screen, its chrome back to us */
export const ORB = {x: 451, y: 29, r: 19, look: [-0.95, 0.36] as [number, number]};
const MON_C = {x: SCR.x + SCR.w / 2, y: SCR.y + SCR.h / 2};
const DESK_Y = 184;
/** the window behind him (the [2S]'s window, its left end: the city is behind Mas in both shots) */
const WIN = {x0: 396, x1: 486, y0: 12, y1: 120, ty: 46};

// ------------------------------------------------------------------ the room behind (resolved once)
let BACK: Buf | null = null;
const paintBack = (): Buf => {
  const mb = new MatBuf(480, RH);
  // the back wall (plaster specks, never a pattern)
  rect(0, 0, 480, DESK_Y, mb.mat('wall', 0));
  for (let y = 0; y < DESK_Y; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 5) < 0.03) mb.shade(-0.5)(x, y);
  // the window at frame right: trim, the black reveal, the night sky (emissive), the transom, the sill
  rect(WIN.x0 - 5, WIN.y0 - 5, WIN.x1 - WIN.x0 + 11, WIN.y1 - WIN.y0 + 11, mb.mat('trim', 0.4));
  rect(WIN.x0 - 5, WIN.y0 - 5, WIN.x1 - WIN.x0 + 11, 1, mb.shade(1));
  rect(WIN.x0 - 1, WIN.y0 - 1, WIN.x1 - WIN.x0 + 3, WIN.y1 - WIN.y0 + 3, mb.mat('black', 0));
  for (let y = WIN.y0; y <= WIN.y1; y++)
    for (let x = WIN.x0; x <= WIN.x1; x++) {
      const t = (y - WIN.y0) / (WIN.y1 - WIN.y0) + (bayer(x, y) - 0.5) * 0.1;
      mb.emit(t < 0.4 ? PAL.N2 : t < 0.68 ? PAL.N3 : t < 0.9 ? PAL.N4 : PAL.N5)(x, y);
    }
  rect(WIN.x0, WIN.ty, WIN.x1 - WIN.x0 + 1, 2, mb.mat('trim', -0.2));
  rect(WIN.x0 - 8, WIN.y1 + 5, WIN.x1 - WIN.x0 + 17, 2, mb.mat('trim', 1));
  rect(WIN.x0 - 7, WIN.y1 + 7, WIN.x1 - WIN.x0 + 15, 2, mb.mat('trim', -0.8));
  // the desk top: long horizontal grain receding to its far edge behind the monitor's foot
  for (let y = DESK_Y; y < RH; y++)
    for (let x = 0; x < 480; x++) {
      const v = y * 2.2 + 1.2 * Math.sin(x / 71 + y / 9) + 0.6 * Math.sin(x / 19 + y / 3);
      const band = Math.floor(v / 5);
      let lvl = (hash(band, 3, 11) - 0.5) * 0.5 + 0.4 - (y - DESK_Y) / 60;
      if (v - band * 5 < 1 && hash(band, 5, 13) < 0.55) lvl -= 0.8;
      mb.mat('wood', lvl)(x, y);
    }
  rect(0, DESK_Y, 480, 1, mb.shade(1.6));
  const b = new Buf(480, RH, PAL.N0);
  resolve(mb, {
    // night ambient, a little more by the window (its cold city glow on the wall round it)
    amb: (x, y) => {
      const dw = Math.hypot((x - (WIN.x0 + 40)) / 110, (y - (WIN.y0 + WIN.y1) / 2) / 90);
      return 1.9 - Math.max(0, (y - 150) / 50) - Math.max(0, (60 - x) / 160) * 0.4 + (dw < 1 ? (1 - dw) * 0.8 : 0);
    },
    cyan: (x, y) => {
      if (y >= DESK_Y) {
        // the screen's pool across the desk in front of it, toward us
        const d = Math.hypot((x - MON_C.x) / 250, (y - DESK_Y) / 22);
        return clamp(1.05 - d, 0, 1) * 0.92;
      }
      // the wall behind: only the screen's back-glow around the bezel (a monitor lights forward, not behind)
      const dx = Math.max(0, Math.abs(x - MON_C.x) - SCR.w / 2), dy = Math.max(0, Math.abs(y - MON_C.y) - SCR.h / 2);
      const d = Math.hypot(dx / 60, dy / 42);
      return clamp(1 - d, 0, 1) ** 1.6 * 0.5;
    },
    warm: () => 0,
    dither: 0.6,
  }, b, 0);
  return b;
};
/** the city in the window: far towers in haze, near towers with lit windows, one red beacon blinking */
const drawCity = (b: Buf, f: number) => {
  const put = (x: number, y: number, c: number) => { if (x >= WIN.x0 && x <= Math.min(479, WIN.x1) && y >= WIN.y0 && y <= WIN.y1 && !(y >= WIN.ty && y <= WIN.ty + 1)) b.set(x, y, c); };
  const WH = WIN.y1 - WIN.y0;
  for (let x = WIN.x0, k = 0; x < 480; k++) {
    const w = 7 + Math.floor(hash(k, 1, 7) * 10);
    const top = WIN.y0 + Math.round(WH * (0.42 + hash(k, 2, 7) * 0.3));
    for (let yy = top; yy <= WIN.y1; yy++) for (let xx = x; xx < x + w; xx++) put(xx, yy, PAL.N2);
    for (let j = top + 3; j < WIN.y1 - 1; j += 3) for (let i = x + 1; i < x + w - 1; i += 2) if (hash(i, j, x) < 0.07) put(i, j, hash(j, i, 3) < 0.6 ? PAL.W4 : PAL.C4);
    x += w + 1 + Math.floor(hash(k, 3, 7) * 3);
  }
  for (let x = WIN.x0 - 3, k = 0; x < 480; k++) {
    const w = 12 + Math.floor(hash(k, 11, 7) * 16);
    const top = WIN.y0 + Math.round(WH * (0.7 + hash(k, 12, 7) * 0.2));
    for (let yy = top; yy <= WIN.y1; yy++) for (let xx = x; xx < x + w; xx++) put(xx, yy, xx === x ? PAL.N2 : PAL.N1);
    for (let j = top + 2; j < WIN.y1 - 1; j += 2) for (let i = x + 2; i < x + w - 1; i += 2) if (hash(i, j, x + 7) < 0.1) put(i, j, hash(j, i, 5) < 0.55 ? PAL.W5 : PAL.C4);
    if (k === 1 && Math.floor((f + 5) / 16) % 2 === 0) put(x + 2, top - 1, PAL.R3);
    x += w + Math.floor(hash(k, 13, 7) * 4);
  }
};

// ------------------------------------------------------------------ the monitor (square to the lens)
const drawMonitor = (b: Buf) => {
  const {x0, y0, x1, y1} = BZ;
  // the stand: the neck, the foot on the desk, its contact shadow
  const nx = Math.round(MON_C.x) - 12;
  rect(nx, y1 + 1, 24, DESK_Y + 2 - y1, b.ink(PAL.G0));
  rect(nx, y1 + 1, 1, DESK_Y + 2 - y1, b.ink(PAL.G1));
  rect(nx + 23, y1 + 1, 1, DESK_Y + 2 - y1, b.ink(PAL.N0));
  rect(nx - 34, DESK_Y + 2, 92, 4, b.ink(PAL.G0));
  rect(nx - 33, DESK_Y + 2, 90, 1, b.ink(PAL.C2));
  rect(nx - 34, DESK_Y + 6, 92, 1, b.ink(PAL.N0));
  rect(nx - 32, DESK_Y + 7, 90, 1, b.ink(PAL.N0));
  // the bezel: a keyline, the face, the top edge catching the room, the inner lip, the chin and its power LED
  rect(x0, y0, x1 - x0 + 1, y1 - y0 + 1, b.ink(PAL.N0));
  rect(x0 + 1, y0 + 1, x1 - x0 - 1, y1 - y0 - 1, b.ink(PAL.G0));
  rect(x0 + 1, y0 + 1, x1 - x0 - 1, 1, b.ink(PAL.G2));
  rect(x0 + 1, y0 + 2, 1, y1 - y0 - 3, b.ink(PAL.G1));
  rect(x0 + 1, y1 - 1, x1 - x0 - 1, 1, b.ink(PAL.N1));
  rect(SCR.x - 1, SCR.y - 1, SCR.w + 2, SCR.h + 2, b.ink(PAL.N0));
  // the screen's own light on the lip of the bezel (one rung, the lower and right lips a rung darker)
  rect(SCR.x - 2, SCR.y - 2, SCR.w + 4, 1, b.ink(PAL.G2));
  rect(SCR.x - 2, SCR.y - 1, 1, SCR.h + 2, b.ink(PAL.G2));
  rect(SCR.x + SCR.w + 1, SCR.y - 1, 1, SCR.h + 2, b.ink(PAL.G1));
  rect(SCR.x - 2, SCR.y + SCR.h + 1, SCR.w + 4, 1, b.ink(PAL.G1));
  b.set(x1 - 8, y1 - 5, PAL.C4);
  b.set(x1 - 7, y1 - 5, PAL.C3);
  // the screen: black under the film
  rect(SCR.x, SCR.y, SCR.w, SCR.h, b.ink(PAL.N0));
};

// ------------------------------------------------------------------ Mas: the OTS silhouette (the act-four grammar)
/** below the neck his outline is drawn, not the portrait's crop: from the neck's right edge the trapezius slopes out
 *  to the shoulder, then the upper arm falls out of frame, a little wider as it goes (his body runs off frame left) */
const NECK_ROW = 88;
const SIL = new Map<number, Img>();
/** v5: the head is OPENED (eroded, then dilated, with a radius-5 disc) so the portrait's cowlick, which read as a hook
 *  or an antenna against the rim, becomes a smooth crown (seen from behind a head is an oval); `lean` shears the head toward the screen (2 px at the crown,
 *  fading out through the neck into the shoulders): he leans in when the film freezes */
const masSilhouette = (lean: 0 | 1): Img => {
  const hit = SIL.get(lean);
  if (hit) return hit;
  const src = masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1});
  const extend = 60, PAD = 40;                        // PAD: room for the far shoulder to run off the frame's edge
  const W = src.w + 24 + PAD, H = src.h + extend;
  const op0 = new Uint8Array(W * H);
  const srcOn = (x: number, y: number) => { const sx = src.w - 1 - (x - PAD); return sx >= 0 && sx < src.w && y >= 0 && y < src.h && src.c[y * src.w + sx] >= 0; };
  let neckR = 0, neckL = W;
  for (let x = 0; x < W; x++) if (srcOn(x, NECK_ROW)) { neckR = x; neckL = Math.min(neckL, x); }
  const R = (y: number) => neckR + 34 * (1 - Math.exp(-(y - NECK_ROW) / 11)) + Math.max(0, y - NECK_ROW - 20) * 0.22;
  // the far shoulder falls away down-left, out of frame (no flat top edge at the frame's left)
  const Lx = (y: number) => neckL - 44 * (1 - Math.exp(-(y - NECK_ROW) / 10)) - (y - NECK_ROW) * 0.6;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < NECK_ROW) { if (srcOn(x, y)) op0[y * W + x] = 1; } else if (x <= R(y) && x >= Lx(y)) op0[y * W + x] = 1;
  }
  // open the head (rows above the neck): erode then dilate with a radius-5 disc
  const RD = 5, disc: Array<[number, number]> = [];
  for (let j = -RD; j <= RD; j++) for (let i = -RD; i <= RD; i++) if (i * i + j * j <= RD * RD + 1) disc.push([i, j]);
  const at = (m: Uint8Array, x: number, y: number) => (x >= 0 && y >= 0 && x < W && y < H ? m[y * W + x] : 0);
  const ero = new Uint8Array(W * H), opn = new Uint8Array(op0);
  for (let y = 0; y < NECK_ROW + RD + 1; y++) for (let x = 0; x < W; x++) ero[y * W + x] = disc.every(([i, j]) => at(op0, x + i, y + j)) ? 1 : 0;
  for (let y = 0; y < NECK_ROW - 2; y++) for (let x = 0; x < W; x++) opn[y * W + x] = disc.some(([i, j]) => y + j < NECK_ROW + RD + 1 && at(ero, x + i, y + j)) ? 1 : 0;
  // the lean: a shear toward the screen (x+), 2 px down to the ear line, fading to 0 across the neck and shoulders
  const shear = (y: number) => Math.round(lean * 2 * Math.max(0, Math.min(1, (NECK_ROW + 18 - y) / 30)));
  const op = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const sx = x - shear(y); if (sx >= 0 && sx < W && opn[y * W + sx]) op[y * W + x] = 1; }
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && op[y * W + x] === 1;
  const c = new Int32Array(W * H).fill(-1);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!on(x, y)) continue;
    let col = PAL.N0;
    // the rim: the screen is in front of him and to the right; its light wraps the right edge and the crown
    if (!on(x + 1, y)) col = y < 96 ? PAL.C4 : y < 124 ? PAL.C3 : y < 150 ? PAL.C2 : PAL.C1;
    else if (!on(x + 2, y) && y < 90 && y > 20) col = PAL.C1;
    else if (!on(x, y - 1) && x > PAD + (W - PAD) * 0.4) col = y < 96 ? PAL.C2 : PAL.C1;
    c[y * W + x] = col;
  }
  // built facing right (the act-four grammar), then mirrored: in v5 he's at frame right, looking left at the screen
  const m = new Int32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) m[y * W + x] = c[y * W + (W - 1 - x)];
  const img = {w: W, h: H, c: m};
  SIL.set(lean, img);
  return img;
};
export const MAS_AT = {x: 316, y: 58};
/** Mas breathes on 2s: one pixel, a slow cycle, snapped to even frames */
export const breath = (f: number) => {
  const e = f - (f % 2);
  const ph = e % 84;
  return ph >= 30 && ph < 62 ? -1 : 0;
};
/** the Orb's float: one pixel on a slow hold cycle, on its own phase (orb-medium's orbBob, offset) */
export const orbFloat = (f: number) => orbBob(f + 20);

/** the OTS room layer (rows 0..202): the room, the city in the window, the monitor (screen black). Mas and the Orb are drawCast. */
export const drawOTS = (b: Buf, f: number) => {
  const back = (BACK ??= paintBack());
  for (let y = 0; y < RH; y++) b.c.set(back.c.subarray(y * 480, (y + 1) * 480), y * b.w);
  drawCity(b, f);
  drawMonitor(b);
};
/** the cast layer, into a transparent native buffer: Mas (breathing, leaning in or not), then the Orb nearer the lens */
export const drawCast = (ui: Buf, f: number, s: {lean: 0 | 1; orbAp: number; fire: boolean}) => {
  blitImg(ui, masSilhouette(s.lean), MAS_AT.x, MAS_AT.y + breath(f), {clip: (x, y) => y < RH});
  drawOrb(ui, ORB.x, ORB.y + orbFloat(f), ORB.r, {look: ORB.look, aperture: s.orbAp, scanning: s.fire, monitor: -1});
};
/** where the Orb's lens is on the frame (native): the centre of its face */
export const orbLens = (f: number): [number, number] => {
  const yaw = ORB.look[0] * 0.95, pitch = ORB.look[1] * 0.8;
  const d = [Math.sin(yaw), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)];
  const l = Math.hypot(d[0], d[1], d[2]);
  return [ORB.x + (ORB.r * d[0]) / l + 0.5, ORB.y + orbFloat(f) + (ORB.r * d[1]) / l + 0.5];
};

// ------------------------------------------------------------------ the monitor's own UI (native, over the film)
/** the player's generic title strip across the film's top edge (a play glyph, the title, three window dots) */
export const drawTitleStrip = (ui: Buf) => {
  const x = SCR.x, y = SCR.y;
  rect(x, y, SCR.w, TITLE_H - 1, ui.ink(PAL.G0));
  rect(x, y + TITLE_H - 1, SCR.w, 1, ui.ink(PAL.N0));
  for (let k = 0; k < 4; k++) rect(x + 5 + k, y + 2 + k, 1, 7 - 2 * k, ui.ink(PAL.G5));
  text(ui, TITLE, x + 14, y + 2, PAL.P1, {shadow: PAL.N0});
  for (let i = 0; i < 3; i++) rect(x + SCR.w - 22 + i * 6, y + 4, 3, 3, ui.ink(PAL.G2));
};
/** the chyron caption under the sheet, typed to n characters (a dark bar as wide as the sheet, a red tab, paper type) */
export const drawCaption = (ui: Buf, n: number) => {
  if (n <= 0) return;
  const s = CAPTION.slice(0, n);
  const x = SCR.x + CAP.x, y = SCR.y + CAP.y;
  rect(x, y, GRID.w, CAP.h, ui.ink(PAL.N0));
  rect(x, y, 3, CAP.h, ui.ink(PAL.R2));
  rect(x + 3, y, GRID.w - 3, 1, ui.ink(PAL.N2));
  text(ui, s, x + 8, y + 4, PAL.P2);
};
/** the player's dark field behind the sheet, and each cell's 1 px keyline (only for the cells already dealt) */
export const drawSheetField = (ui: Buf, cells: number[]) => {
  rect(SCR.x, SCR.y + TITLE_H, SCR.w, SCR.h - TITLE_H, ui.ink(PAL.N1));
  for (const i of cells) {
    const [cx, cy] = cellXY(i);
    rect(SCR.x + cx - 1, SCR.y + cy - 1, STILL.w + 2, STILL.h + 2, ui.ink(PAL.N0));
  }
};
/** each still's number: its take frame, on a small dark tab in its top-left corner (the frames between are missing) */
export const drawStillTabs = (ui: Buf, cells: number[], ts: number[]) => {
  for (const i of cells) {
    const [cx, cy] = cellXY(i);
    const s = 'F' + String(ts[i]).padStart(3, '0');
    const x = SCR.x + cx, y = SCR.y + cy;
    rect(x, y, tinyWidth(s) + 4, 7, ui.ink(PAL.N0));
    tiny(ui, s, x + 2, y + 1, PAL.P0);
  }
};

/** a transparent native buffer */
export const newUI = () => new Buf(480, 270, TRANSPARENT);

// ------------------------------------------------------------------ the Orb's scan beam (v5; replaces v4's ring)
/** a rect on the frame (native) */
export type Rect = {x: number; y: number; w: number; h: number};
/** the screen's picture area under the title strip, and the sheet (native) */
export const FILM_RECT: Rect = {x: SCR.x, y: SCR.y + TITLE_H, w: SCR.w, h: SCR.h - TITLE_H};
export const GRID_RECT: Rect = {x: SCR.x + GRID.x, y: SCR.y + GRID.y, w: GRID.w, h: GRID.h};
/**
 * The beam's cells on the native grid, from the Orb's lens to a footprint on the glass: per native pixel, a kind
 *   1 the air: a sparse ordered dither inside the fan (a projector's beam through a dark room's haze)
 *   2 the fan's two edges, dotted
 *   3 the footprint's wash on the glass (one pixel in four, faint)
 *   4 the footprint's four corner brackets (the Orb's frame on what it reads)
 *   5 the scan line on the footprint, and 6 its short dithered trail above it
 * `t` = frames since the beam came on: the scan line steps down the footprint on 2s, one sixth of it at a time.
 */
export const beamCells = (lens: [number, number], fp: Rect, t: number): Array<[number, number, number]> => {
  const out: Array<[number, number, number]> = [];
  const [lx, ly] = lens;
  const inFp = (x: number, y: number) => x >= fp.x && x < fp.x + fp.w && y >= fp.y && y < fp.y + fp.h;
  // the fan: between the rays to the footprint's two near corners (its right edge when the Orb is at frame right),
  // from the lens to the glass
  const right = lx > fp.x + fp.w;
  const ex = right ? fp.x + fp.w : fp.x;
  const ax = ex - lx, ay = fp.y - ly, bx = ex - lx, by = fp.y + fp.h - ly;
  const cross = (ux: number, uy: number, vx: number, vy: number) => ux * vy - uy * vx;
  const sgn = right ? -1 : 1;
  const xa = right ? ex : Math.floor(lx), xb = right ? Math.ceil(lx) : ex;
  const y0 = Math.floor(Math.min(ly, fp.y)), y1 = Math.ceil(Math.max(ly, fp.y + fp.h));
  for (let y = y0; y <= y1; y++)
    for (let x = xa; x < xb; x++) {
      const px = x + 0.5 - lx, py = y + 0.5 - ly;
      const c1 = sgn * cross(ax, ay, px, py), c2 = sgn * cross(px, py, bx, by);
      if (c1 < 0 || c2 < 0) continue;
      const u = (x + 0.5 - lx) / (ex - lx);              // 0 at the lens .. 1 at the glass
      if (u < 0 || u > 1) continue;
      // the edges: a ray's pixel is where it crosses this column (dotted: every other column)
      const eA = ly + ay * u, eB = ly + by * u;
      if ((Math.abs(y + 0.5 - eA) < 0.6 || Math.abs(y + 0.5 - eB) < 0.6) && (x & 1) === 0) { out.push([x, y, 2]); continue; }
      // the air thins out as the fan widens
      if (bayer(x, y) < 0.13 * (1 - 0.55 * u) && hash(x, y, 31) < 0.75) out.push([x, y, 1]);
    }
  const n = 6, step = Math.floor((t - 1) / 2) % n;
  const sy = fp.y + Math.round(((step + 0.5) / n) * fp.h);
  for (let y = fp.y; y < fp.y + fp.h; y++)
    for (let x = fp.x; x < fp.x + fp.w; x++) {
      const bx0 = Math.min(x - fp.x, fp.x + fp.w - 1 - x), by0 = Math.min(y - fp.y, fp.y + fp.h - 1 - y);
      if ((bx0 === 0 && by0 < 6) || (by0 === 0 && bx0 < 6)) { out.push([x, y, 4]); continue; }
      if (y === sy) { out.push([x, y, 5]); continue; }
      if (y < sy && y >= sy - 3 && bayer(x, y) < 0.5 - (sy - y) * 0.14) { out.push([x, y, 6]); continue; }
      if (bayer(x, y) < 0.25 && inFp(x, y)) out.push([x, y, 3]);
    }
  return out;
};
