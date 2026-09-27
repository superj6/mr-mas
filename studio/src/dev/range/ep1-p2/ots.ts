// MR. MAS · range E1-P2: the [OTS] over Mas's shoulder onto the dark room's monitor (NEW drawing, pixel, 480 x 203).
// The same room as rooms/darkroom-plate.ts, turned round: the monitor square to the lens and big (its screen is
// 264 x 148 native, the film's 1056 x 592 at 4x), the rack at frame right with its LEDs ticking in eighths, Mas in the
// foreground left as the show's OTS silhouette (his portrait, flipped, one rung off black, a 1 px cyan rim on the side
// that faces the screen: the act-four `shoulder()` grammar, re-done here so a dev folder doesn't import an episode),
// and THE ORB at his shoulder, its face turned into the screen, its chrome back to us, rimmed by the screen's light.
// Light is the room's language: the monitor is the key, and it lights cyan (resolve() walks each material's cyan ramp).
// The screen itself is left black here: the film is composited over it at output resolution (P2Duck.tsx).
// Also: the monitor's own UI (the player's title strip and the chyron caption) as native pixel UI over the film, and
// the stills' layout in screen space. The Orb's eye-light is drawn by the host (it lands on the film, at the grid).
import {Buf, rect, hash, bayer, clamp, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {MatBuf, resolve} from '../../../shared/pixel/light';
import {text, textWidth} from '../../../shared/pixel/font';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../shared/pixel/cast/mas';
import {drawOrb} from '../../../shared/pixel/cast/orb-medium';
import {blitImg} from '../../../shared/pixel/figure';
import type {Img} from '../../../shared/pixel/figure';
import {TITLE, CAPTION} from './plan';

export const RH = 203;
/** the screen (native px): the film fills it; output = 4x */
export const SCR = {x: 150, y: 14, w: 264, h: 148};
export const SCALE = 4;
/** the bezel's outer box */
const BZ = {x0: 143, y0: 7, x1: 421, y1: 172};
/** the player's title strip (screen-local rows) */
export const TITLE_H = 11;
/** the strip of stills (screen-local): three 84 x 47 holds with 2 px hairline gaps */
export const STILL = {w: 84, h: 47, gap: 2, x0: 4, y0: 44};
export const stillX = (i: number) => STILL.x0 + i * (STILL.w + STILL.gap);
/** the chyron (screen-local) under the stills */
export const CAP = {x: 4, y: 104, h: 14};
/** where the Orb's eye-light lands (native, on the middle still) and its radii */
export const EYE = {cx: SCR.x + stillX(1) + STILL.w / 2, cy: SCR.y + STILL.y0 + STILL.h / 2 + 1, rx: 23, ry: 17};
/** the eye-light's three held steps sliding in from the Orb's side (x of the centre), then landed */
export const EYE_STEPS = [SCR.x - 14, SCR.x + 34, SCR.x + 84, EYE.cx];
const MON_C = {x: SCR.x + SCR.w / 2, y: SCR.y + SCR.h / 2};
const DESK_Y = 184;
const RACK = {x0: 449, y0: 8};
const ORB = {x: 118, y: 120, r: 13};

// ------------------------------------------------------------------ the room behind (resolved once)
let BACK: Buf | null = null;
const paintBack = (): Buf => {
  const mb = new MatBuf(480, RH);
  // the back wall (plaster specks, never a pattern)
  rect(0, 0, 480, DESK_Y, mb.mat('wall', 0));
  for (let y = 0; y < DESK_Y; y++) for (let x = 0; x < 480; x++) if (hash(x, y, 5) < 0.03) mb.shade(-0.5)(x, y);
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
  // the rack at frame right: a stack of units, its left edge catching the screen across the room
  rect(RACK.x0, RACK.y0, 480 - RACK.x0, DESK_Y - RACK.y0, mb.mat('black', 0));
  rect(RACK.x0, RACK.y0, 480 - RACK.x0, 1, mb.shade(1.4));
  rect(RACK.x0, RACK.y0 + 1, 1, DESK_Y - RACK.y0 - 1, mb.shade(1.6));
  for (let y = RACK.y0 + 6; y < DESK_Y - 4; y += 12) {
    rect(RACK.x0 + 4, y, 480 - RACK.x0 - 4, 10, mb.mat('metal', -1.4));
    rect(RACK.x0 + 4, y, 480 - RACK.x0 - 4, 1, mb.shade(0.8));
    for (let x = RACK.x0 + 16; x < 480; x += 2) mb.shade(-0.7)(x, y + 4);
  }
  const b = new Buf(480, RH, PAL.N0);
  resolve(mb, {
    amb: (x, y) => 1.9 - Math.max(0, (y - 150) / 50) - Math.max(0, (x - 380) / 160) * 0.4,
    cyan: (x, y) => {
      if (y >= DESK_Y) {
        // the screen's pool across the desk in front of it, toward us
        const d = Math.hypot((x - MON_C.x) / 250, (y - DESK_Y) / 22);
        return clamp(1.05 - d, 0, 1) * 0.92;
      }
      // the wall behind: only the screen's back-glow around the bezel (a monitor lights forward, not behind)
      const dx = Math.max(0, Math.abs(x - MON_C.x) - SCR.w / 2), dy = Math.max(0, Math.abs(y - MON_C.y) - SCR.h / 2);
      const d = Math.hypot(dx / 60, dy / 42);
      const glow = clamp(1 - d, 0, 1) ** 1.6 * 0.5;
      // the rack's face, across the room: a raking wash on its left half
      const rack = x >= RACK.x0 ? clamp(1 - (x - RACK.x0) / 30, 0, 1) * 0.55 : 0;
      return Math.max(glow, rack);
    },
    warm: () => 0,
    dither: 0.6,
  }, b, 0);
  return b;
};

// ------------------------------------------------------------------ the monitor (square to the lens)
const drawMonitor = (b: Buf) => {
  const {x0, y0, x1, y1} = BZ;
  // the stand: the neck, the foot on the desk, its contact shadow
  rect(270, y1 + 1, 24, DESK_Y + 2 - y1, b.ink(PAL.G0));
  rect(270, y1 + 1, 1, DESK_Y + 2 - y1, b.ink(PAL.G1));
  rect(293, y1 + 1, 1, DESK_Y + 2 - y1, b.ink(PAL.N0));
  rect(236, DESK_Y + 2, 92, 4, b.ink(PAL.G0));
  rect(237, DESK_Y + 2, 90, 1, b.ink(PAL.C2));
  rect(236, DESK_Y + 6, 92, 1, b.ink(PAL.N0));
  rect(238, DESK_Y + 7, 90, 1, b.ink(PAL.N0));
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

const drawRackLeds = (b: Buf, f: number) => {
  const eighth = Math.floor((f * 2) / 15);
  for (let k = 0, y = RACK.y0 + 6; y < DESK_Y - 4; y += 12, k++) {
    const x = RACK.x0 + 8;
    b.set(x, y + 3, PAL.C4);
    b.set(x + 3, y + 3, k % 2 ? PAL.C3 : PAL.L2);
    if (k === 1 || k === 4 || k === 6 || k === 10) b.set(x, y + 7, (eighth + k) % 3 !== 0 ? PAL.R3 : PAL.R0);
    if (k % 3 === 2) b.set(x + 6, y + 7, (eighth + k * 2) % 4 === 0 ? PAL.W6 : PAL.W2);
  }
};

// ------------------------------------------------------------------ Mas: the OTS silhouette (the act-four grammar)
let SIL: Img | null = null;
/** below the neck his outline is drawn, not the portrait's crop: from the neck's right edge the trapezius slopes out
 *  to the shoulder, then the upper arm falls out of frame, a little wider as it goes (his body runs off frame left) */
const NECK_ROW = 88;
const masSilhouette = (): Img => {
  if (SIL) return SIL;
  const src = masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1});
  const extend = 60;
  const W = src.w + 24, H = src.h + extend;
  const op = new Uint8Array(W * H);
  const srcOn = (x: number, y: number) => { const sx = src.w - 1 - x; return sx >= 0 && sx < src.w && y >= 0 && y < src.h && src.c[y * src.w + sx] >= 0; };
  let neckR = 0, neckL = src.w;
  for (let x = 0; x < src.w; x++) if (srcOn(x, NECK_ROW)) { neckR = x; neckL = Math.min(neckL, x); }
  const R = (y: number) => neckR + 34 * (1 - Math.exp(-(y - NECK_ROW) / 11)) + Math.max(0, y - NECK_ROW - 20) * 0.22;
  // the far shoulder falls away down-left, out of frame (no flat top edge at the frame's left)
  const Lx = (y: number) => neckL - 44 * (1 - Math.exp(-(y - NECK_ROW) / 10)) - (y - NECK_ROW) * 0.6;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < NECK_ROW) { if (srcOn(x, y)) op[y * W + x] = 1; } else if (x <= R(y) && x >= Lx(y)) op[y * W + x] = 1;
  }
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && op[y * W + x] === 1;
  const c = new Int32Array(W * H).fill(-1);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!on(x, y)) continue;
    let col = PAL.N0;
    // the rim: the screen is in front of him and to the right; its light wraps the right edge and the crown
    if (!on(x + 1, y)) col = y < 96 ? PAL.C4 : y < 124 ? PAL.C3 : y < 150 ? PAL.C2 : PAL.C1;
    else if (!on(x + 2, y) && y < 90 && y > 20) col = PAL.C1;
    else if (!on(x, y - 1) && x > W * 0.4) col = y < 96 ? PAL.C2 : PAL.C1;
    c[y * W + x] = col;
  }
  SIL = {w: W, h: H, c};
  return SIL;
};
export const MAS_AT = {x: -2, y: 58};
/** Mas breathes on 2s: one pixel, a slow cycle, snapped to even frames */
export const breath = (f: number) => {
  const e = f - (f % 2);
  const ph = e % 84;
  return ph >= 30 && ph < 62 ? -1 : 0;
};

/** the whole OTS room layer (rows 0..202): room, monitor (screen black), LEDs, Mas, the Orb */
export const drawOTS = (b: Buf, f: number) => {
  const back = (BACK ??= paintBack());
  for (let y = 0; y < RH; y++) b.c.set(back.c.subarray(y * 480, (y + 1) * 480), y * b.w);
  drawMonitor(b);
  drawRackLeds(b, f);
  // THE ORB at his shoulder: its face turned into the screen (up-right, away from us), its chrome back rimmed
  drawOrb(b, ORB.x, ORB.y, ORB.r, {look: [0.98, -0.34], aperture: 0.5, monitor: 1});
  blitImg(b, masSilhouette(), MAS_AT.x, MAS_AT.y + breath(f), {clip: (x, y) => y < RH});
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
/** the chyron caption under the stills, typed to n characters (a dark bar, a small red tab, paper type) */
export const drawCaption = (ui: Buf, n: number) => {
  if (n <= 0) return;
  const s = CAPTION.slice(0, n);
  const x = SCR.x + CAP.x, y = SCR.y + CAP.y;
  const wFull = Math.max(textWidth(CAPTION) + 14, 3 * STILL.w + 2 * STILL.gap);   // as wide as the strip above it
  rect(x, y, wFull, CAP.h, ui.ink(PAL.N0));
  rect(x, y, 3, CAP.h, ui.ink(PAL.R2));
  rect(x + 3, y, wFull - 3, 1, ui.ink(PAL.N2));
  text(ui, s, x + 8, y + 4, PAL.P2);
};
/** the player's dark field under the strip of stills */
export const drawStripField = (ui: Buf) => {
  rect(SCR.x, SCR.y + TITLE_H, SCR.w, SCR.h - TITLE_H, ui.ink(PAL.N1));
  for (let i = 0; i < 3; i++) {
    // each still's 1 px keyline (the hairline gaps are the field between them)
    const x = SCR.x + stillX(i), y = SCR.y + STILL.y0;
    rect(x - 1, y - 1, STILL.w + 2, STILL.h + 2, ui.ink(PAL.N0));
  }
};

/** a transparent native UI buffer */
export const newUI = () => new Buf(480, 270, TRANSPARENT);

/** the eye-light's shape on the grid: per native pixel, 0 none · 1 the core · 2 the dithered mid · 3 the rim · 4 a glint */
export const eyeCells = (cx: number): Array<[number, number, number]> => {
  const out: Array<[number, number, number]> = [];
  const {cy, rx, ry} = EYE;
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      if (x < SCR.x || x >= SCR.x + SCR.w || y < SCR.y + TITLE_H || y >= SCR.y + SCR.h) continue;
      const d = Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
      if (d >= 1) continue;
      if (d > 0.88) { if (((x + y) & 1) === 0) out.push([x, y, 3]); }
      else if (d < 0.66) out.push([x, y, 1]);
      else if (bayer(x, y) < 0.5) out.push([x, y, 2]);
    }
  for (const [dx, dy] of [[-15, -11], [11, -8], [-9, 11], [14, 12]] as Array<[number, number]>) {
    const x = Math.round(cx + dx), y = Math.round(cy + dy);
    if (x >= SCR.x && x < SCR.x + SCR.w) out.push([x, y, 4]);
  }
  return out;
};
void stepColor;
