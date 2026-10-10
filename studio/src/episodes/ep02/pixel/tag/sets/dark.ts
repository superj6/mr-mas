// MR. MAS — Ep2 v1 · tag: HIS DARK ROOM, NIGHT, AUG 5 → AUG 21, 2024 (sc 23). The tag's picture pass, 2026-10-10.
// Built on Ep1's dark room (rooms/darkroom-plate, kits/mas-monitor, cast/mas, cast/orb-medium, kits/orb-toast: read-only)
// and Act Two's dark room at night (act2/sets/dark.ts otsDark / masMCU, COPIED below so the tag never shares a cache key
// with an act: the same OTS over his right shoulder, his glass, Ep1's framed GUEST lanyard on the wall; the same MCU in
// the monitor's cyan), with the tag's own drawings:
//   wideBack(b, f, st)     [W] 23.01's arrival: the room from behind him, the monitor's glow on, Ep1's GUEST frame on
//                          the wall; his back as he sits at the desk (sc 22's match: his back in the same place in frame,
//                          x ~270, as he walked away across the lot), a window on the left wall; THE ORB on his right
//                          shoulder; then the refiled complaint
//                          dropping from above onto the desk in front of the monitor: THUD (the room jolts, he doesn't)
//   coverOTS(b, f, st)     [OTS] 23.01: over his right shoulder, down onto the desk: the complaint's cover, legible:
//                          NOLE v. MANALT ET AL. · FEDERAL COURT, the (FOR NOW) note stuck to it, crossed out
//   pagesECU(b, f, st)     [ECU] 23.02: its pages turned by his hand: !! · ! · . (each page's one sentence ends in its
//                          punctuation, drawn big, the cold open's ECU grammar); then he slides the stack aside, and
//                          the camera tilts up to the monitor's lit screen
//   otsDark(b, f, paint)   [OTS] 23.04-23.05: Act Two's OTS (copied), with THE ORB at his shoulder (st.mid)
//   orbAt / ORB_*          the Orb's places in the OTS: on his right shoulder (over it, nearer the lens), in front of
//                          the screen
//   terminalScan(b, f, st) [TERMINAL] 23.04: THE ORB's point of view (the 2.E pass, Ep1's palettes TERMINAL: 4-level CRT
//                          teal): the photo's crowd magnified, a scan line, a bracket stepping face to face, `human`
//                          under each, its log counting every face in the photo
//   masMCU(b, f, st)       [MCU] 23.09: his face at the monitor, its glow on his still face (Act Two's night MCU, copied)
// No cursor anywhere (P6): his hand is on paper; the Orb reads the screen with its own lens.
import {Buf, rect, ellipse, bayer, clamp, hash} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import {MON_OTS, MON_POV, screenDim} from '../../../../../shared/pixel/kits/mas-monitor';
import type {Painter} from '../../../../../shared/pixel/kits/mas-monitor';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront} from '../../../../../shared/pixel/rooms/darkroom-plate';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {vignette} from '../../../../../shared/pixel/rooms/kit-b';
import {drawOrb, orbBob} from '../../../../../shared/pixel/cast/orb-medium';
import {drawToast, toastW} from '../../../../../shared/pixel/kits/orb-toast';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {placeHand, drawHand, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, glow, putBustSoft, forearm, isSkin, reframe} from './common';
import {drawBackHead} from './backhead';
import {feedPainter, photoFaces} from './screen';

// ================================================================== Act Two's night OTS (copied)
/** his glass on the desk in the OTS foreground (act2 otsGlass): a cut tumbler of water, the monitor's cyan on it */
const otsGlass = (b: Buf, x: number, y: number) => {
  const w = 30, h = 42, rx = w / 2, cx = x + rx;
  for (let j = 0; j < h; j++) {
    const t = j / h, half = rx - t * 3;
    for (let i = -Math.ceil(half); i <= Math.ceil(half); i++) {
      const X = Math.round(cx + i), Y = y + j;
      if (Y >= RH) continue;
      const u = i / half, edge = Math.abs(u) > 0.86;
      const behind = b.get(X, Y);
      let c: number;
      if (edge) c = u < 0 ? PAL.C4 : PAL.G1;
      else if (j < 9) c = stepColor(behind, 1);
      else c = bayer(X, Y) < 0.35 ? PAL.C2 : stepColor(behind, 1) === behind ? PAL.C1 : stepColor(behind, 1);
      if (!edge && Math.abs(u + 0.55) < 0.1 && j > 4) c = PAL.C6;
      b.set(X, Y, c);
    }
  }
  for (let i = -rx; i <= rx; i++) { const e = Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / (rx * rx))) * 3); b.set(Math.round(cx + i), y - e, i < 0 ? PAL.C6 : PAL.G3); b.set(Math.round(cx + i), y + e, PAL.C5); }
  for (let i = -rx + 2; i <= rx - 2; i++) { const e = Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / ((rx - 2) * (rx - 2)))) * 2); b.set(Math.round(cx + i), y + 9 - e, PAL.C7); b.set(Math.round(cx + i), y + 9 + e, PAL.C4); }
};
/** Ep1's framed GUEST lanyard on the wall (rooms/darkroom-act3's frame, Ep1's lanyard: the grey-blue strap, the card
 *  with its red band): drawn bigger than Act Two's so it reads as a lanyard and GUEST is legible at 1080p (the review:
 *  at 26 x 22 with a blank card it read as a calendar icon, and the Ep1 callback was lost). The strap hangs in a V from
 *  two pins to the clip, the card under it */
const guestFrame = (b: Buf, x: number, y: number) => {
  const w = 36, h = 38;
  fill(b, x + 2, y + h, w, 1, PAL.N0); fill(b, x + w, y + 2, 1, h - 1, PAL.N0);
  fill(b, x, y, w, h, PAL.D2); fill(b, x, y, w, 1, PAL.D3); fill(b, x, y, 1, h, PAL.D3); fill(b, x + w - 1, y + 1, 1, h - 1, PAL.D1);
  fill(b, x + 3, y + 3, w - 6, h - 6, PAL.N1); fill(b, x + 3, y + 3, w - 6, 1, PAL.N0);
  // the strap: from two pins at the mat's top corners down in a V to the clip, two px wide (lit side, shadow side)
  const cx = x + (w >> 1), clipY = y + 17;
  for (const side of [-1, 1]) {
    const px0 = cx + side * 11, py0 = y + 6;
    b.set(px0, py0 - 1, PAL.G6);
    const n = clipY - py0;
    for (let i = 0; i <= n; i++) { const X = Math.round(px0 + ((cx + side * 2 - px0) * i) / n), Y = py0 + i; b.set(X, Y, PAL.G3); b.set(X + side, Y, PAL.G2); }
  }
  fill(b, cx - 2, clipY - 1, 5, 4, PAL.G5); fill(b, cx - 2, clipY - 1, 5, 1, PAL.G6);
  // the card: its red band, GUEST in the small caps (Ep1's lanyard)
  const cw = tinyWidth('GUEST') + 7, cxl = cx - (cw >> 1), cy = clipY + 3;
  fill(b, cxl + 1, cy + 1, cw, 13, PAL.N0);
  fill(b, cxl, cy, cw, 13, PAL.P1); fill(b, cxl, cy, cw, 3, PAL.R2); fill(b, cxl, cy + 12, cw, 1, PAL.P0);
  tiny(b, 'GUEST', cxl + 4, cy + 5, PAL.N1);
};
/** the room behind the monitor: Ep1's plate slid 60 px and stepped down 3 rungs (act2 otsRoom), the GUEST frame */
let otsBg: Buf | null = null;
const otsRoom = (): Buf => {
  if (otsBg) return otsBg;
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, 0, {tally: 2, glass: true}); drawDarkPlateDesk(bg, 0, {tally: 2, glass: true}); drawDarkPlateFront(bg, 0, {tally: 2, glass: true});
  const sh = new Buf(480, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) sh.set(x, y, stepColor(bg.get(Math.min(479, x + 60), y), -3));
  // the plate's own monitor light came with the slide (a teal slab on the desk behind his head, left of the screen, with
  // no source from here: the review): left of the OTS monitor the cyan walks to the navy, and the desk is the dark wood
  for (let y = 0; y < RH; y++) for (let x = 0; x < MON_OTS.x - 12; x++) {
    const fm = familyOf(sh.c[y * W + x]);
    if (fm && (fm[0] === 'C' || fm[0] === 'K')) sh.c[y * W + x] = fm[1] < 2 ? PAL.N1 : fm[1] < 5 ? PAL.N2 : PAL.N3;
  }
  deskDark(sh, 0, MON_OTS.x - 12);
  guestFrame(sh, 390, 36);
  otsBg = sh;
  return sh;
};
/** the desk's top band (y DESK_TOP..DESK_FOOT) as dark wood between x0 and x1: its far edge a rung up, the wood a rung
 *  under the lit desk by the monitor (D1 with D0) */
const DESK_TOP = 131, DESK_FOOT = 176;
const deskDark = (b: Buf, x0: number, x1: number) => {
  for (let y = DESK_TOP; y < DESK_FOOT; y++) for (let x = x0; x < x1; x++) b.c[y * W + x] = y === DESK_TOP ? PAL.D1 : bayer(x, y) < 0.3 ? PAL.D1 : PAL.D0;
};
export const OTS_HEAD = {x: -30, y: 30, scale: 1.5};
const darkHead = (b: Buf) => { drawBackHead(b, OTS_HEAD.x, OTS_HEAD.y, {scale: OTS_HEAD.scale, turn: 1, light: 'monitor', flip: true}); };
/** [OTS] over his right shoulder onto the monitor (act2 otsDark); st.mid draws between the room and his head, st.front
 *  over him (the Orb on his shoulder and on its way to the screen, its toast) */
export const otsDark = (b: Buf, f: number, paint: Painter, st: {dim?: number; mid?: (b: Buf) => void; front?: (b: Buf) => void} = {}) => {
  b.c.set(otsRoom().c.subarray(0, 480 * RH));
  const T = MON_OTS;
  rect(T.x - 8, T.y - 8, T.w + 16, T.h + 16, b.ink(PAL.G1)); rect(T.x - 8, T.y - 8, T.w + 16, 1, b.ink(PAL.G3)); rect(T.x - 1, T.y - 1, T.w + 2, T.h + 2, b.ink(PAL.N0));
  const scr = new Buf(T.w, T.h, PAL.N0);
  paint(scr, f);
  for (let y = 0; y < scr.h; y += 3) for (let x = 0; x < scr.w; x++) if (bayer(x, y) < 0.5) scr.set(x, y, stepColor(scr.get(x, y), -1));
  for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) b.set(T.x + x, T.y + y, scr.get(x, y));
  rect(T.x + T.w / 2 - 12, T.y + T.h + 8, 24, 20, b.ink(PAL.G1));
  for (let y = T.y + T.h + 8; y < RH; y++) for (let x = T.x - 30; x < T.x + T.w + 30; x++) if (((x + y) & 3) === 0) b.set(x, y, stepColor(b.get(x, y), 1));
  otsGlass(b, 402, 160);
  st.mid?.(b);
  darkHead(b);
  st.front?.(b);
  if (st.dim) for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -st.dim));
};

// ================================================================== THE ORB in the OTS (23.04-23.05)
/** its home ON his right shoulder (over his right shoulder the near shoulder is frame right of his head): perched over
 *  the shoulder's line, nearer the lens than the screen so a size bigger (the review: it sat on the monitor's bezel,
 *  150 px from him, and read as already at the screen); and its place in front of the photo (nearer the screen: smaller) */
export const ORB_HOME = {x: 98, y: 171, r: 12};
export const ORB_SCREEN = {x: 196, y: 104, r: 8};
/** where its verdict hangs: centred under the photo it verified (the photo's foot in the OTS's screen) */
export const TOAST_AT = {cx: MON_OTS.x + 22 + 79, y: MON_OTS.y + 50 + 72 - 18};
/** the Orb between home (t 0) and the screen (t 1), whole pixels; its look toward the photo while it travels and scans */
export const orbAt = (t: number): {x: number; y: number; r: number} => {
  const u = clamp(t, 0, 1);
  return {x: Math.round(ORB_HOME.x + (ORB_SCREEN.x - ORB_HOME.x) * u), y: Math.round(ORB_HOME.y + (ORB_SCREEN.y - ORB_HOME.y) * u - Math.sin(u * Math.PI) * 10), r: Math.round(ORB_HOME.r + (ORB_SCREEN.r - ORB_HOME.r) * u)};
};
export const drawOrbOTS = (b: Buf, f: number, st: {t: number; aperture?: number; scanning?: boolean; look?: [number, number]; still?: boolean; toast?: number; toastText?: string}) => {
  const p = orbAt(st.t), bob = orbBob(f, !!st.still);
  // its glow on the screen glass behind it once it is out in front of the screen (it is lit by the screen, a soft cyan
  // halo a rung up); none on his shoulder
  if (st.t > 0.4) glow(b, p.x, p.y + bob, p.r * 2.2, p.r * 2.2, 1);
  drawOrb(b, p.x, p.y + bob, p.r, {look: st.look ?? [0.55, -0.6], aperture: st.aperture ?? 0.5, scanning: !!st.scanning, monitor: 1});
  if (st.toast !== undefined && st.toast >= 0) {
    const s = st.toastText ?? 'verified: human (all of them)';
    drawToast(b, TOAST_AT.cx - Math.round(toastW(s) / 2), TOAST_AT.y, s, st.toast, {f});
  }
};

// ================================================================== 23.01: the arrival (his back at the desk)
/** the monitor in the wide (smaller: the camera is further back), on the desk, its screen the dim feed */
export const WIDE_MON = {x: 222, y: 40, w: 150, h: 86};
/** his chair's back, between the camera and his lower back */
const chairBack = (b: Buf, cx: number, top: number) => {
  for (let y = top; y < RH; y++) {
    const t = y - top, hw = t < 4 ? 30 - (4 - t) * 2 : 32;
    for (let x = cx - hw; x <= cx + hw; x++) {
      const edge = x <= cx - hw + 1 || x >= cx + hw - 1;
      b.set(x, y, t < 2 ? PAL.C3 : edge ? PAL.N1 : t < 5 ? PAL.G1 : bayer(x, y) < 0.15 ? PAL.G0 : PAL.N1);
    }
  }
  // the seam of the backrest's padding, a rung down
  for (let x = cx - 26; x <= cx + 26; x++) b.set(x, top + 20, PAL.N0);
};
/** the refiled complaint seen from behind him at the desk: a thick stack (its top face cream, its near side the page
 *  edges), x = its left, y = its top face's far edge */
const stackFar = (b: Buf, x: number, y: number) => {
  const w = 96;
  // the top face (in perspective: a little wider at its near edge), the cover's caption a grey bar from here
  for (let j = 0; j < 12; j++) { const xi = x - Math.round(j * 0.4), wi = w + Math.round(j * 0.8); fill(b, xi, y + j, wi, 1, j < 2 ? PAL.P2 : PAL.P1); }
  fill(b, x + 10, y + 3, 56, 2, PAL.G4); fill(b, x + 10, y + 7, 30, 1, PAL.G5);
  fill(b, x + 64, y + 4, 18, 6, PAL.W7);
  // the near side: the pages' edges, striped
  for (let j = 0; j < 9; j++) fill(b, x - 5, y + 12 + j, w + 10, 1, j % 2 ? PAL.P0 : PAL.G5);
  fill(b, x - 5, y + 21, w + 10, 1, PAL.N0);
};
/** a window on the left wall in the wide (x, y its glass's top-left): the city at night through it, in whole pixels:
 *  the sky N0 to a faint glow over the skyline, the blocks as silhouettes with a grid of lit windows (a few warm, very
 *  few bright), a red light on the tallest roof, the frame, its mullion and transom, the sill catching the monitor */
const cityWindow = (b: Buf, x: number, y: number, w: number, h: number) => {
  fill(b, x - 3, y - 3, w + 6, h + 6, PAL.N2); fill(b, x - 3, y - 3, w + 6, 1, PAL.N3); fill(b, x + w + 2, y - 2, 1, h + 4, PAL.N3);
  vramp(b, x, y, w, h, [PAL.N0, PAL.N0, PAL.N1, PAL.U0]);
  let bx = x, i = 0, tallest = {x: 0, y: y + h};
  while (bx < x + w) {
    const bw = 9 + Math.floor(hash(i, 3, 41) * 15), top = y + Math.round(h * (0.3 + hash(i, 5, 43) * 0.42)), xe = Math.min(bx + bw, x + w);
    if (top < tallest.y) tallest = {x: bx + (bw >> 1), y: top};
    for (let yy = top; yy < y + h; yy++) for (let xx = bx; xx < xe; xx++) b.set(xx, yy, yy === top ? PAL.N2 : PAL.N1);
    for (let yy = top + 3; yy < y + h - 1; yy += 4) for (let xx = bx + 2; xx < xe - 1; xx += 3) {
      const q = hash(xx, yy, 47);
      if (q < 0.2) b.set(xx, yy, q < 0.012 ? PAL.W6 : q < 0.15 ? PAL.W3 : PAL.D3);
    }
    bx = xe + 1 + Math.floor(hash(i, 7, 49) * 3); i++;
  }
  b.set(tallest.x, tallest.y - 1, PAL.R3); b.set(tallest.x, tallest.y - 2, PAL.N2);
  fill(b, x + (w >> 1) - 1, y, 3, h, PAL.N2); fill(b, x + (w >> 1) + 1, y, 1, h, PAL.N3);
  fill(b, x, y + Math.round(h * 0.36), w, 2, PAL.N2);
  fill(b, x - 6, y + h + 3, w + 12, 3, PAL.G0); fill(b, x - 6, y + h + 3, w + 12, 1, PAL.G1); fill(b, x + w - 30, y + h + 3, 36, 1, PAL.G2);
};
/**
 * st.sit 0 (standing at the chair) · 1 (half down) · 2 (seated); st.drop: -1 (nothing yet) · 0..2 the complaint falling
 * (held drawings) · 3 landed; st.jolt: the room's jolt on the landing (whole pixels down); st.dust 0..3
 */
export const wideBack = (b: Buf, f: number, st: {sit: 0 | 1 | 2; drop: number; jolt?: number; dust?: number}) => {
  b.c.set(otsRoom().c.subarray(0, 480 * RH));
  // the OTS room's left side is Ep1's plate slid (its monitor's light, its board, its clock, a window's specks, all soft):
  // from behind him, wider, it read as a smear (the review). Left of the monitor it is redrawn plain: the dark wall, the
  // desk's dark wood running on under the monitor, the floor's dark; a window comes after the light (below)
  const LX = WIDE_MON.x - 6;
  for (let y = 8; y < RH; y++) for (let x = 0; x < LX; x++) {
    if (y < DESK_TOP) b.c[y * W + x] = bayer(x, y) < 0.22 ? PAL.N1 : PAL.N0;
    else if (y >= DESK_FOOT) { const fm = familyOf(b.c[y * W + x]); if (!fm || fm[0] !== 'N') b.c[y * W + x] = bayer(x, y) < 0.5 ? PAL.N1 : PAL.N0; }
  }
  deskDark(b, 0, LX);
  // the room a rung up near the monitor (its light): the wall and the desk round it
  const M = WIDE_MON;
  glow(b, M.x + M.w / 2, M.y + M.h / 2 + 30, 230, 120, 2);
  // the window on the left wall: the city at night, crisp (dim: the monitor is the light in this room)
  cityWindow(b, 26, 22, 146, 82);
  // the monitor on the desk, its screen the tag's dim feed (Ep1's screenDim: sound off, nothing to read)
  rect(M.x - 6, M.y - 6, M.w + 12, M.h + 12, b.ink(PAL.G1)); rect(M.x - 6, M.y - 6, M.w + 12, 1, b.ink(PAL.G3)); rect(M.x - 1, M.y - 1, M.w + 2, M.h + 2, b.ink(PAL.N0));
  const scr = new Buf(M.w, M.h, PAL.N0);
  feedPainter({post: false})(scr, f);
  // (lit: a screen in a dark room glows; its feed a rung up)
  for (let i = 0; i < scr.c.length; i++) scr.c[i] = stepColor(scr.c[i], 1);
  for (let y = 0; y < scr.h; y += 3) for (let x = 0; x < scr.w; x++) if (bayer(x, y) < 0.5) scr.set(x, y, stepColor(scr.get(x, y), -1));
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) b.set(M.x + x, M.y + y, scr.get(x, y));
  rect(M.x + M.w / 2 - 9, M.y + M.h + 6, 18, 10, b.ink(PAL.G1)); rect(M.x + M.w / 2 - 22, M.y + M.h + 15, 44, 3, b.ink(PAL.G2));
  // the screen's pool on the desk top in front of it
  for (let y = M.y + M.h + 12; y < M.y + M.h + 40; y++) for (let x = M.x - 20; x < M.x + M.w + 20; x++) if (((x + y) & 3) === 0) b.set(x, y, stepColor(b.get(x, y), 1));
  // the complaint dropping from above onto the desk in front of the monitor's right end (clear of the Orb on his right
  // shoulder)
  const SX = 306, SY = 128;
  if (st.drop >= 0) {
    const dy = [-150, -86, -26, 0][clamp(st.drop, 0, 3)];
    if (st.drop < 3) {
      // in the air: the stack edge-on as it falls (its near side and its bottom), a motion streak above it
      const y = SY + dy;
      fill(b, SX - 4, y, 106, 18, PAL.P1); fill(b, SX - 4, y, 106, 2, PAL.P2);
      for (let j = 4; j < 18; j += 2) fill(b, SX - 4, y + j, 106, 1, PAL.G5);
      for (let k = 1; k < 4; k++) for (let x = SX + 6; x < SX + 96; x += 6) if (bayer(x, y - k * 8) < 0.5) b.set(x, y - k * 8, PAL.P0);
    } else stackFar(b, SX, SY);
  }
  if (st.dust) {
    // the dust puffs off the desk either side of the landing, spreading in three held steps
    const d = st.dust;
    for (const [cx, dir] of [[SX - 8, -1], [SX + 104, 1]] as Array<[number, number]>) for (let j = -4; j <= 2; j++) for (let i = -10; i <= 10; i++) {
      const X = cx + dir * d * 5 + i, Y = SY + 18 - d * 2 + j;
      if (Math.hypot(i / (6 + d * 2), j / (3 + d)) < 1 && bayer(X, Y) < 0.42 - d * 0.1) b.set(X, Y, stepColor(b.get(X, Y), 2));
    }
  }
  // the room's jolt on the landing (the room layer only; he and the band never move)
  if (st.jolt) reframe(b, 0, st.jolt);
  // HIS BACK at the desk: the back of his head and shoulders (Act Two's turned-away bust, square away, in the monitor's
  // rim light), seated (or rising/sitting), his hoodie carried down behind the chair's back; the chair in front of it
  const dy = [-20, -9, 0][st.sit], HX = 222, HY = 68 + dy, sc = 0.66;
  const t = new Buf(480, 270, 0x1000000);
  drawBackHead(t, HX, HY, {scale: sc, turn: 0, light: 'monitor'});
  // carry the hoodie down from the bust's foot (each column's last drawn colour), the outline kept at the sides
  const foot = HY + Math.floor(136 * sc) - 1;
  let x0 = 480, x1 = -1; for (let x = 0; x < 480; x++) if (t.get(x, foot) !== 0x1000000) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  for (let x = x0; x <= x1; x++) { const c = x <= x0 + 1 || x >= x1 - 1 ? PAL.N1 : t.get(x, foot) === 0x1000000 ? PAL.G0 : t.get(x, foot); for (let y = foot + 1; y < RH; y++) t.set(x, y, c); }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const v = t.c[y * 480 + x]; if (v !== 0x1000000) b.set(x, y, v); }
  chairBack(b, HX + Math.round(62 * sc), 150);
  // THE ORB on his right shoulder (from behind him, frame right of his head, as in the OTS: perched over the shoulder's
  // line, riding it down as he sits; the complaint falls beyond it), looking at the screen
  drawOrb(b, 285, 131 + dy + orbBob(f), 7, {look: [0.05, -0.8], aperture: 0.5, monitor: 1});
};

// ================================================================== 23.01: the cover (over his shoulder, down)
const deskWood = (b: Buf, y0 = 0) => { for (let y = y0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, (x + y * 3) % 41 < 2 ? PAL.D1 : bayer(x, y) < 0.2 ? PAL.D1 : PAL.D0); };
/** the (FOR NOW) note (sc 20's sticky note), stuck on, crossed out with one red stroke */
const forNow = (b: Buf, x: number, y: number, w: number, h: number) => {
  fill(b, x + 2, y + 2, w, h, PAL.D0);
  fill(b, x, y, w, h, PAL.W7); fill(b, x, y, w, 2, PAL.W8); fill(b, x, y + h - 1, w, 1, PAL.W5);
  const s = '(FOR NOW)';
  pt(b, s, x + Math.round((w - pw(s)) / 2), y + Math.round(h / 2) - 4, PAL.N1);
  // the stroke: a marker line corner to corner, two px, drawn after the words (they still read through it)
  const n = Math.max(w, h);
  for (let i = 0; i <= n; i++) { const X = Math.round(x + 4 + ((w - 8) * i) / n), Y = Math.round(y + h - 5 - ((h - 10) * i) / n); b.set(X, Y, PAL.R2); b.set(X, Y + 1, PAL.R2); b.set(X + 1, Y, PAL.R1); }
};
export const CAPTION = 'NOLE v. MANALT ET AL.';
/** [OTS] down past his right shoulder onto the desk: the monitor's foot at the top (its light on everything), the
 *  complaint lying there, its cover legible; st.settle: the stack's last bounce (px) */
export const coverOTS = (b: Buf, f: number, st: {settle?: number} = {}) => {
  deskWood(b);
  // the monitor's lower edge at the top of the frame: the screen's last rows (the feed's glow), the bezel, the stand
  fill(b, 96, 0, 340, 9, PAL.N2); for (let x = 96; x < 436; x += 7) fill(b, x, 2, 4, 2, PAL.N4);
  fill(b, 90, 9, 352, 7, PAL.G1); fill(b, 90, 9, 352, 1, PAL.G3);
  fill(b, 252, 16, 26, 16, PAL.G1); fill(b, 252, 16, 2, 16, PAL.G2); ellipse(265, 34, 34, 5, b.ink(PAL.G1)); ellipse(265, 33, 32, 3, b.ink(PAL.G2));
  // its cyan light on the desk, falling off down the frame
  for (let y = 16; y < RH; y++) for (let x = 0; x < W; x++) { const d = Math.hypot((x - 266) / 300, (y - 10) / 190); if (d < 1 && bayer(x, y) < (1 - d) * 0.8) b.set(x, y, stepColor(b.get(x, y), 1)); }
  // the stack: shadow, the page edges (bottom and right), the cover
  const X = 170, Y = 52 + (st.settle ?? 0), Wd = 262, Ht = 134;
  fill(b, X + 6, Y + 6, Wd + 2, Ht + 6, PAL.N0);
  for (let j = 0; j < 7; j++) fill(b, X + 2, Y + Ht + j, Wd, 1, j % 2 ? PAL.P0 : PAL.G5);
  for (let i = 0; i < 5; i++) fill(b, X + Wd + i, Y + 3, 1, Ht + 3, i % 2 ? PAL.P0 : PAL.G5);
  fill(b, X, Y, Wd, Ht, PAL.P1); fill(b, X, Y, Wd, 2, PAL.P2); fill(b, X, Y, 2, Ht, PAL.P2);
  // the paper's tooth and the monitor's cool cast on its far half
  for (let y = Y + 2; y < Y + Ht; y++) for (let x = X + 2; x < X + Wd; x++) if (hash(x, y, 11) < 0.04) b.set(x, y, PAL.P0);
  // the staple at its top-left corner
  fill(b, X + 8, Y + 7, 10, 2, PAL.G5); b.set(X + 8, Y + 9, PAL.G3); b.set(X + 17, Y + 9, PAL.G3);
  bpt(b, CAPTION, X + 18, Y + 18, PAL.N1);
  fill(b, X + 18, Y + 38, bpw(CAPTION), 1, PAL.G4);
  pt(b, 'FEDERAL COURT', X + 20, Y + 46, PAL.N2);
  // the body's first lines (grey bars, nothing legible)
  for (let r = 0; r < 4; r++) fill(b, X + 20, Y + 66 + r * 10, 120 - ((r * 29) % 50), 3, PAL.G5);
  forNow(b, X + Wd - 104, Y + Ht - 66, 88, 50);
  // the back of his head, close, at the frame's left (his right shoulder; the monitor's rim on it), looking down
  drawBackHead(b, -44, 46, {scale: 1.5, turn: 1, light: 'monitor', flip: true});
};

// ================================================================== 23.02: the pages
/** the page's punctuation, big: the display face (the cold open's ECU used it) drawn at 2x, whole pixels; x = its left,
 *  base = the foot of the glyph box; returns its width */
const bigMark = (b: Buf, s: string, x: number, base: number, col: number) => {
  const w = bpw(s), t = new Buf(w + 2, 16, 0x1000000);
  bpt(t, s, 0, 0, col);
  for (let y = 0; y < 16; y++) for (let i = 0; i < w + 2; i++) { const v = t.get(i, y); if (v !== 0x1000000) fill(b, x + i * 2, base - 32 + y * 2, 2, 2, v); }
  return w * 2;
};
/** one page of the refiled complaint at ECU (top-down, the page filling the frame): its lines as grey bars, and the
 *  sentence that ends the page ending in its big punctuation (`!!`, `!`, `.`); n = the page number (0 = the cover) */
const PAGE = {x: 52, y: -14, w: 376, h: 236};
const drawPage = (b: Buf, n: number, dx = 0) => {
  const X = PAGE.x + dx, Y = PAGE.y;
  fill(b, X + 5, Y + 5, PAGE.w, PAGE.h, PAL.N0);
  fill(b, X, Y, PAGE.w, PAGE.h, PAL.P1); fill(b, X, Y, 2, PAGE.h, PAL.P2);
  for (let y = Y; y < Y + PAGE.h; y++) for (let x = X + 2; x < X + PAGE.w; x++) if (hash(x - dx, y, 7) < 0.035) b.set(x, y, PAL.P0);
  if (n === 0) {
    // the cover at this distance
    bpt(b, CAPTION, X + 34, Y + 44, PAL.N1); fill(b, X + 34, Y + 64, bpw(CAPTION), 1, PAL.G4);
    pt(b, 'FEDERAL COURT', X + 36, Y + 72, PAL.N2);
    for (let r = 0; r < 4; r++) fill(b, X + 36, Y + 96 + r * 12, 170 - ((r * 37) % 70), 4, PAL.G5);
    forNow(b, X + PAGE.w - 140, Y + 132, 104, 58);
    return;
  }
  // the page's text: a paragraph of grey bars, then its last sentence ending in the mark, on its own line, big
  const rows = [300, 284, 296, 270, 292, 188];
  rows.forEach((w, r) => fill(b, X + 34, Y + 40 + r * 14, w, 5, r === rows.length - 1 ? PAL.G4 : PAL.G5));
  const lineY = Y + 40 + rows.length * 14 + 30;
  fill(b, X + 34, lineY - 6, 150, 5, PAL.G4);
  const marks = n === 1 ? '!!' : n === 2 ? '!' : '.';
  bigMark(b, marks, X + 34 + 154, lineY + 3, PAL.N0);
  // the page number at the foot, small
  const pn = `- ${n} -`;
  pt(b, pn, X + Math.round((PAGE.w - pw(pn)) / 2), Y + PAGE.h - 46, PAL.G4);
};
/** his hand, the monitor's light on it, from the frame's lower right: 'pinch' at a point (a page's edge), 'flat' (the
 *  palm down on the stack, pushing it) */
const HCUFF = [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.C4];
const HSLEEVE = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.C4];
const pageHand = (b: Buf, at: [number, number], pose: 'pinch' | 'flat') => {
  const P = pose === 'pinch' ? POSES.pinch([-0.55, -0.75, -0.35], [0.1, -0.45, 0.88]) : POSES.open([-0.75, -0.55, -0.1], [0.05, -0.2, 0.98]);
  const h = placeHand(P, {s: 4.6, at, anchor: pose === 'pinch' ? 'index' : 'middle', light: 'lobby', cuffRamp: HCUFF, key: [0.1, -0.85, 0.5]});
  const cx = h.cuffEnd[0], cy = h.cuffEnd[1], dx = cx - h.wrist[0], dy = cy - h.wrist[1], L = Math.hypot(dx, dy) || 1;
  const ux = dx / L, uy = dy / L, bx = ux * 0.75 + 0.2, by = uy * 0.75 + 0.45, bl = Math.hypot(bx, by);
  forearm(b, [cx, cy], [cx + (bx / bl) * 200, cy + (by / bl) * 200], 3.4 * 4.6, 8.6 * 4.6, HSLEEVE);
  drawHand(b, h.hand, h.x, h.y, {map: (c) => (isSkin(c) ? stepColor(c, -1) : c)});
};
/** above the ECU's top edge, for the tilt up (content y < 0, drawn at frame y + tl): the desk running on to its far
 *  edge, the monitor's stand rising to the bezel's foot, and the screen's lower part lit, HTURT's feed on it (the
 *  feed 23.03 opens on, a rung up: a screen glowing in a dark room), its light pooling on the desk under it */
let tiltScr: Buf | null = null;
const monitorAbove = (b: Buf, tl: number) => {
  const Y = (cy: number) => cy + tl;
  for (let y = 0; y < tl; y++) for (let x = 0; x < W; x++) { const cy = y - tl; b.set(x, y, cy >= -44 ? ((x + (cy + 4100) * 3) % 41 < 2 || bayer(x, y) < 0.2 ? PAL.D1 : PAL.D0) : bayer(x, y) < 0.2 ? PAL.N1 : PAL.N0); }
  if (!tiltScr) {
    tiltScr = new Buf(MON_POV.w, MON_POV.h, PAL.N0);
    feedPainter({post: false})(tiltScr, 0);
    for (let i = 0; i < tiltScr.c.length; i++) tiltScr.c[i] = stepColor(tiltScr.c[i], 1);
    for (let y = 0; y < tiltScr.h; y += 3) for (let x = 0; x < tiltScr.w; x++) if (bayer(x, y) < 0.5) tiltScr.set(x, y, stepColor(tiltScr.get(x, y), -1));
  }
  const sx = 240 - (MON_POV.w >> 1), foot = -24;
  // the screen's light on the desk under it, a rung up, falling off toward the camera (the desk only: drawn first)
  for (let cy = foot + 12; cy < 0; cy++) { const fy = Y(cy); if (fy < 0) continue; for (let x = 0; x < W; x++) { const d = Math.hypot((x - 240) / 300, (cy - foot - 12) / 90); if (d < 1 && bayer(x, fy) < (1 - d) * 0.8) b.set(x, fy, stepColor(b.get(x, fy), 1)); } }
  // the bezel round the screen's foot, its lower lip catching the desk's light
  fill(b, sx - 9, Y(foot - MON_POV.h - 9), MON_POV.w + 18, MON_POV.h + 21, PAL.G1); fill(b, sx - 9, Y(foot + 11), MON_POV.w + 18, 1, PAL.G3);
  fill(b, sx - 1, Y(foot - MON_POV.h - 1), MON_POV.w + 2, MON_POV.h + 2, PAL.N0);
  for (let y = 0; y < MON_POV.h; y++) { const fy = Y(foot - MON_POV.h + y); if (fy < 0 || fy >= tl) continue; for (let x = 0; x < MON_POV.w; x++) b.set(sx + x, fy, tiltScr.get(x, y)); }
  // the stand's neck from the bezel down to its base (the base is the ECU's own, at the old top edge)
  for (let cy = foot + 12; cy < 0; cy++) { const fy = Y(cy); if (fy < 0) continue; fill(b, 226, fy, 28, 1, PAL.G1); fill(b, 226, fy, 2, 1, PAL.G2); }
};
/**
 * st.page: the page lying face up (0 the cover .. 3); st.turn 0 (flat) · 1..3 the top page lifting from its foot and
 * going over the top (its curled lip rising, its underside showing), held drawings; st.hand: where his pinching hand is
 * ('lip' on the lifting edge, 'rest' at the page's lower right, null gone); st.slide: px the stack has gone left (his
 * flat hand pushing it); st.tilt: px the camera has tilted up off the clear desk to the monitor (the shot's tail: the
 * review found 0.45 s on a near-black desk before the cut to the bright screen; the tilt matches the cut to the POV)
 */
export const pagesECU = (b: Buf, f: number, st: {page: number; turn?: number; hand?: 'lip' | 'rest' | 'push' | null; slide?: number; tilt?: number}) => {
  deskWood(b);
  // the monitor's light from above the frame on the desk and the paper
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const d = Math.hypot((x - 240) / 380, (y + 60) / 260); if (d < 1 && bayer(x, y) < (1 - d) * 0.9) b.set(x, y, stepColor(b.get(x, y), 1)); }
  const sl = st.slide ?? 0, turn = st.turn ?? 0;
  // the monitor's foot at the top of the frame (under the stack until he slides it away): its stand and base, the
  // screen's light pooled on the desk in front of it
  fill(b, 226, 0, 28, 20, PAL.G1); fill(b, 226, 0, 2, 20, PAL.G2); ellipse(240, 24, 46, 7, b.ink(PAL.G1)); ellipse(240, 23, 44, 5, b.ink(PAL.G2)); ellipse(232, 21, 18, 2, b.ink(PAL.G3));
  for (let y = 30; y < RH; y++) for (let x = 0; x < W; x++) { const d = Math.hypot((x - 240) / 260, (y - 30) / 150); if (d < 1 && bayer(x, y) < (1 - d) * 0.7) b.set(x, y, stepColor(b.get(x, y), 1)); }
  if (PAGE.x - sl + PAGE.w > 0) {
    // the stack's edges under the top page (its thickness, to the right and the foot)
    for (let i = 1; i <= 4; i++) fill(b, PAGE.x - sl + PAGE.w, PAGE.y + i * 2, i, PAGE.h, i % 2 ? PAL.G5 : PAL.P0);
    const under = turn ? st.page + 1 : st.page;
    drawPage(b, under, -sl);
    if (turn) {
      // the turning page: its foot lifted to `lip`, the page above it still on the stack, its underside (the back of
      // the sheet, a rung down, its lines showing through faintly) curling toward the camera below the lip
      const lip = [0, 150, 76, 10][turn];
      const top = new Buf(480, 270, 0x1000000);
      drawPage(top, st.page, -sl);
      for (let y = 0; y < Math.min(RH, PAGE.y + lip); y++) for (let x = 0; x < W; x++) { const v = top.c[y * 480 + x]; if (v !== 0x1000000) b.set(x, y, v); }
      const curl = [0, 22, 30, 16][turn];
      for (let j = 0; j < curl; j++) {
        const y = PAGE.y + lip + j, inset = Math.round(j * 0.3);
        if (y >= RH) break;
        for (let x = PAGE.x - sl + inset; x < PAGE.x - sl + PAGE.w - inset; x++) b.set(x, y, j < 2 ? PAL.P2 : j > curl - 3 ? PAL.G5 : bayer(x, y) < 0.18 ? PAL.P0 : PAL.G6);
      }
      // its shadow on the page beneath, below the curl
      for (let j = 0; j < 8; j++) { const y = PAGE.y + lip + curl + j; if (y >= RH) break; for (let x = PAGE.x - sl; x < PAGE.x - sl + PAGE.w; x++) if (bayer(x, y) < 0.5 - j * 0.06) b.set(x, y, stepColor(b.get(x, y), -1)); }
      if (st.hand === 'lip') pageHand(b, [PAGE.x - sl + 300, PAGE.y + lip + curl - 2], 'pinch');
    }
  }
  if (st.hand === 'rest') pageHand(b, [PAGE.x + 312, 196], 'pinch');
  if (st.hand === 'push') pageHand(b, [PAGE.x - sl + 250, 120], 'flat');
  const tl = st.tilt ?? 0;
  if (tl > 0) { reframe(b, 0, tl); monitorAbove(b, tl); }
};

// ================================================================== 23.04: THE ORB's TERMINAL view (2.E)
/** Ep1's TERMINAL ramp (palettes.ts): the overlays use its own four colours */
const T4 = [0x020606, 0x0b3b3b, 0x22a7ad, 0xc6fbf1];
const SCAN = {panelX: 374};
/** the photo's crowd as the Orb's lens resolves it: the same rally (the hangar's warm wall, its pillars, SIRRAH's plate,
 *  the decal) with the crowd's faces at the machine's resolution (heads big enough to bracket), drawn in the show's
 *  colours, then remapped to TERMINAL. Returns the faces [x, y, r] of the two front rows */
const SK = [PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.D3, PAL.B3], HAIR = [PAL.B0, PAL.B1, PAL.B2, PAL.G5, PAL.N1, PAL.W3], CLOTH = [PAL.R2, PAL.C4, PAL.N3, PAL.W6, PAL.P1, PAL.L2, PAL.U3, PAL.G4];
const ROWS = [{hr: 7, y: 70, step: 22}, {hr: 10, y: 100, step: 30}, {hr: 13, y: 136, step: 38}, {hr: 17, y: 182, step: 48}];
const drawCrowdBig = (b: Buf) => {
  const X1 = SCAN.panelX;
  vramp(b, 0, 0, X1, RH, [PAL.W2, PAL.W3, PAL.W4, PAL.W4]);
  for (let i = 0; 24 + i * 88 < X1; i++) fill(b, 24 + i * 88, 0, 5, 64, PAL.W6);
  const pl = 'SIRRAH', pw2 = bpw(pl) + 28;
  fill(b, Math.round(X1 / 2 - pw2 / 2), 10, pw2, 26, PAL.N1); fill(b, Math.round(X1 / 2 - pw2 / 2), 10, pw2, 2, PAL.W7);
  bpt(b, pl, Math.round(X1 / 2 - bpw(pl) / 2), 16, PAL.P2);
  // (the decal is drawn after the remap, in TERMINAL's own darkest and lightest: crowd())
  const faces: Array<[number, number, number]> = [];
  ROWS.forEach(({hr, y, step}, r) => {
    for (let i = -((r * 11) % step); i < X1 + step; i += step) {
      const q = (i * 7 + r * 13 + 1000) & 0xffff, fx = i + (q % 5) - 2, fy = y - (q % 3);
      // the body (shoulders widening below the head), the head, the hair's cap, the eyes, the mouth
      for (let yy = fy + hr - 2; yy < RH; yy++) { const hw = Math.min(Math.round(hr * 2.1), Math.round(hr * 1.1 + (yy - fy - hr) * 0.9)); for (let xx = fx - hw; xx <= fx + hw; xx++) if (xx >= 0 && xx < X1) b.set(xx, yy, xx === fx - hw || xx === fx + hw ? PAL.N1 : CLOTH[q % CLOTH.length]); }
      ellipse(fx, fy, hr, Math.round(hr * 1.15), b.ink(SK[q % SK.length]));
      for (let yy = fy - Math.round(hr * 1.15); yy < fy - Math.round(hr * 0.35); yy++) for (let xx = fx - hr; xx <= fx + hr; xx++) if (Math.hypot((xx - fx) / hr, (yy - fy) / (hr * 1.15)) < 1) b.set(xx, yy, HAIR[(q >> 3) % HAIR.length]);
      const e = Math.max(1, Math.round(hr / 6)), ex = Math.round(hr * 0.4);
      fill(b, fx - ex - e + 1, fy, e, e + 1, PAL.N0); fill(b, fx + ex, fy, e, e + 1, PAL.N0);
      fill(b, fx - Math.round(hr * 0.28), fy + Math.round(hr * 0.5), Math.round(hr * 0.56), Math.max(1, e - 1), PAL.S1);
      // a few plain signs held up in the back rows (no words)
      if (r < 2 && q % 6 === 0) { fill(b, fx + hr + 2, fy - hr * 3, 2, hr * 3, PAL.D3); fill(b, fx - 4, fy - hr * 3 - 12, hr * 3 + 10, 12, PAL.C5); }
      if (r >= 2 && fx > 20 && fx < X1 - 20) faces.push([fx, fy, hr]);
    }
  });
  return faces;
};
let crowdBuf: Buf | null = null, crowdFaces: Array<[number, number, number]> = [];
const crowd = () => {
  if (!crowdBuf) {
    crowdBuf = new Buf(480, 270, PAL.N0); crowdFaces = drawCrowdBig(crowdBuf); applyPalette(crowdBuf, 'TERMINAL', {rect: [0, 0, SCAN.panelX, RH]});
    // the SUMMER 2024 decal in the machine's view: its words at TERMINAL's darkest on its lightest, the plate a few px
    // wider than the words (the review: mid teal on pale teal, its S clipped by the plate's edge)
    const dw = pw('SUMMER 2024') + 14, dx = SCAN.panelX - 6 - dw;
    fill(crowdBuf, dx - 1, 3, dw + 2, 17, T4[0]); fill(crowdBuf, dx, 4, dw, 15, T4[3]);
    pt(crowdBuf, 'SUMMER 2024', dx + 7, 8, T4[0]);
  }
  return crowdBuf;
};
/** the four faces the bracket steps through (the two front rows, spread across the frame), and every face in the photo
 *  as the screen shows it (the log counts all of them) */
export const SCAN_FACES = (() => {
  crowd();
  const picks: Array<[number, number, number]> = [];
  for (const tx of [62, 150, 240, 318]) {
    let best: [number, number, number] | null = null, bd = 1e9;
    for (const c of crowdFaces) { if (c[2] !== ROWS[2].hr) continue; const d = Math.abs(c[0] - tx); if (d < bd && !picks.includes(c)) { bd = d; best = c; } }
    if (best) picks.push(best);
  }
  return {picks, total: photoFaces(MON_POV.w, MON_POV.h).faces.length};
})();
/** st.sweep: the scan line's row (null: done); st.n: faces bracketed so far (0..4; the last one is the live bracket);
 *  st.count: the log's count (up to every face in the photo) */
export const terminalScan = (b: Buf, f: number, st: {sweep: number | null; n: number; count: number}) => {
  b.c.set(crowd().c.subarray(0, 480 * RH));
  const T = (x: number, y: number, i: number) => b.set(x, y, T4[i]);
  // the panel: the log (1-bit monospace on the CRT's dark), its rule
  for (let y = 0; y < RH; y++) { b.set(SCAN.panelX, y, T4[2]); for (let x = SCAN.panelX + 1; x < W; x++) b.set(x, y, T4[0]); }
  pt(b, '> scan', SCAN.panelX + 8, 8, T4[3]);
  const rows = Math.min(st.count, 14);
  for (let i = 0; i < rows; i++) {
    const n = st.count - rows + i + 1;
    pt(b, `${String(n).padStart(3, '0')} human`, SCAN.panelX + 8, 24 + i * 12, i === rows - 1 ? T4[3] : T4[2]);
  }
  // the scan line sweeping down the photo (a bright row, a dimmer trail above it)
  if (st.sweep !== null) for (let x = 0; x < SCAN.panelX; x++) { T(x, st.sweep, 3); T(x, st.sweep + 1, 3); if (st.sweep - 3 >= 0 && (x & 1)) T(x, st.sweep - 3, 2); if (st.sweep - 6 >= 0 && !(x % 4)) T(x, st.sweep - 6, 2); }
  // the brackets (corner marks, light with a dark keyline so they read on any face) and the labels
  SCAN_FACES.picks.forEach(([fx, fy, r], i) => {
    if (i >= st.n) return;
    const live = i === st.n - 1, R = r + 5, L = Math.max(5, Math.round(r * 0.6));
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const cx = fx + dx * R, cy = fy + dy * Math.round(R * 1.1);
      // an L at the outer corner (cx, cy), its arms running in toward the face: the keyline (4 thick, 1 px proud), then
      // the mark (2 thick)
      const ell = (x0: number, y0: number, th: number, len: number, col: number) => { for (let q = 0; q < len; q++) for (let w = 0; w < th; w++) { T(x0 - dx * q, y0 - dy * w, col); T(x0 - dx * w, y0 - dy * q, col); } };
      ell(cx + dx, cy + dy, 4, L + 2, 0);
      ell(cx, cy, 2, L, live ? 3 : 2);
    }
    const s = 'human', lx = fx - Math.round(pw(s) / 2), ly = fy + Math.round(R * 1.1) + 4;
    fill(b, lx - 3, ly - 2, pw(s) + 6, 11, T4[0]); fill(b, lx - 3, ly - 2, pw(s) + 6, 1, T4[live ? 3 : 2]);
    pt(b, s, lx, ly, T4[3]);
  });
  // the CRT's rows: every third a rung down (the machine's screen texture)
  for (let y = 0; y < RH; y += 3) for (let x = 0; x < W; x++) { const v = b.get(x, y), i = T4.indexOf(v); if (i > 0 && bayer(x, y) < 0.5) b.set(x, y, T4[i - 1]); }
  void f;
};

// ================================================================== 23.09: his face (Act Two's night MCU, copied)
let mcuNight: Buf | null = null;
const mcuPlate = (): Buf => {
  if (mcuNight) return mcuNight;
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, 0, {tally: 2}); drawDarkPlateDesk(bg, 0, {tally: 2});
  const out = new Buf(480, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) out.set(x, y, stepColor(bg.get(x, y), -3));
  vignette(out, 1, 0.6, 0.7, RH, RH);
  mcuNight = out;
  return out;
};
/** [MCU] Mas at the monitor at night (Ep1's approved portrait toward the monitor, the plate soft behind him), a face
 *  light one step from the screen (st.faceLight), the screen's light on his cheek */
export const masMCU = (b: Buf, f: number, st: {mas?: Partial<MasPortraitState>; faceLight?: number; x?: number} = {}) => {
  b.c.set(mcuPlate().c.subarray(0, 480 * RH));
  const x = st.x ?? 100, y = 22;
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, look: -1, ...st.mas};
  const im = masPortrait(s);
  const fl = st.faceLight ?? 0;
  putBustSoft(b, fl ? faceLightImg(im, fl, {key: [-1, -0.2]}) : im, x, y, RH);
  void f;
};
void tiny; void tinyWidth; void screenDim;
