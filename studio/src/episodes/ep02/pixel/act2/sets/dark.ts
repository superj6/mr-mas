// MR. MAS — Ep2 v1 · act2: HIS DARK ROOM in Act Two (sc 8, the night of APR 1 → MAY 10; sc 12.05-12.08, the afternoon
// of MAY 14). The shots pass, 2026-10-09; the record is shots-act2.md. Built on Ep1's dark room (rooms/darkroom-plate,
// kits/mas-monitor: the POV and the OTS; the portrait, cast/mas.ts) and the art pass's SET-07 painters
// (art/sets/darkroom2.ts: the RULEBOOK notification, the news site, the calendar, the ELPPA call, the news recap), with
// Act Two's own pieces: the OTS foreground (the back of his head: Ep1's turned-away bust redrawn at the OTS's size,
// act2 backhead; the review pass), his glass in the foreground, Ep1's framed GUEST lanyard on the wall, his fingertip on a touch screen (no
// cursor anywhere: LEARNINGS P6), the phone ECU at a phone's own proportions, and the afternoon (the window's sky lit).
//   otsDark(b, f, paint, st)         [OTS] over his right shoulder onto the monitor; st.dim (the room a rung down)
//   swipeECU(b, k, st)               [ECU] 8.01: the notification close, his index and middle fingers flick it away
//   newsPainter(k, turn)             8.02 / 8.03: the news site scrolled into place a whole pixel step at a time
//   calendarPOV(b, f, st)            [POV] 8.04 / 8.07: the week; his fingertip drags his block onto MON 13 / taps Accept
//   masMCU(b, f, st)                 [MCU] Mas at the monitor (Ep1's portrait, the plate soft behind him); st.afternoon
//                                    (his natural skin keyed from the window: masAfternoonImg), st.monday (the lit MON
//                                    square in his eyes), st.faceLight
//   callECU(b, f, st)                [ECU] 8.06: the phone face up, the call tile ELPPA (no face, no name), Answer, …,
//                                    CONFIRMED
//   recapMCU(b, f, st)               [MCU] 12.05: Mas at his desk in the afternoon, the monitor beside him (the recap,
//                                    legible), his fingertip on its minimise
//   phoneECU(b, f, st)               [ECU] 12.06 / 12.07: the phone in his hand, a post in its own UI (scroll, compose)
import {Buf, rect, ellipse, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../../shared/pixel/palette';
import {drawMonitorPOV, MON_OTS, MON_POV} from '../../../../../shared/pixel/kits/mas-monitor';
import type {Painter} from '../../../../../shared/pixel/kits/mas-monitor';
import type {Img} from '../../../../../shared/pixel/figure';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE} from '../../../../../shared/pixel/rooms/darkroom-plate';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {vignette} from '../../../../../shared/pixel/rooms/kit-b';
import {rulebookNotif, newsSitePainter, calendarPainter, newsRecapPainter} from '../../art/sets/darkroom2';
import {drawEp2Post} from '../../art/props/ui';
import {placeHand, drawHand, sleeve, holdPhone, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, pwrap, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, glow, isSkin, forearm, cupThumb, putBustSoft, keyBalloon} from './common';
import {drawBackHead} from './backhead';

// ================================================================== shared pieces
/** his hoodie's sleeve in the monitor's light: [outline, shadow, mid, lit, rim] and the hand rig's 7-tone cuff */
const SLEEVE = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.C4];
const CUFF = [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.C4];
/** his index fingertip on a screen at `tip`, the hand and the sleeve from the frame's lower right (the monitor's cool
 *  key from the screen in front of it); `press` = the pad flat on the glass (the finger a pixel lower, the screen
 *  under it a rung darker), `two` = the middle finger beside it (a flick) */
export const fingerOn = (b: Buf, tip: [number, number], o: {press?: boolean; s?: number; two?: boolean; from?: 'BR' | 'B' | 'R'; skin?: number; elbow?: number; shoulder?: [number, number]} = {}) => {
  const s = o.s ?? 5.2;
  const fwd: [number, number, number] = o.from === 'B' ? [-0.25, -0.9, -0.36] : o.from === 'R' ? [-0.86, -0.36, -0.36] : [-0.7, -0.62, -0.36];
  const pose = o.two ? POSES.open(fwd, [0.2, -0.5, 0.84]) : POSES.point(fwd, [0.2, -0.5, 0.84]);
  if (o.two) pose.fingers = [0.08, 0.1, 0.85, 0.9];
  const at: [number, number] = [tip[0], tip[1] + (o.press ? 2 : 0)];
  const h = placeHand(pose, {s, at, anchor: 'index', light: 'lobby', cuffRamp: CUFF, key: [0.2, -0.75, 0.6]});
  const cx = h.cuffEnd[0], cy = h.cuffEnd[1], dx = cx - h.wrist[0], dy = cy - h.wrist[1], L = Math.hypot(dx, dy) || 1;
  if (o.elbow && o.shoulder) {
    // a bent arm: the forearm on the wrist's own line to the elbow, the upper arm from the elbow up to his shoulder
    const el: [number, number] = [cx + (dx / L) * o.elbow, cy + (dy / L) * o.elbow];
    sleeve(b, el, o.shoulder, 4.2 * s, 4.4 * s, SLEEVE);
    sleeve(b, [cx, cy], el, 3.3 * s, 4.1 * s, SLEEVE);
  } else {
    // the forearm toward the lens, foreshortened (it widens as it nears the camera, below the frame), the wrist bent
    // (the forearm turns down from the hand's own line), the cuff break behind the cuff (common forearm)
    const ux = dx / L, uy = dy / L, bx = ux * 0.8 + 0.12, by = uy * 0.8 + 0.5, bl = Math.hypot(bx, by);
    forearm(b, [cx, cy], [cx + (bx / bl) * 190, cy + (by / bl) * 190], 3.6 * s, 8.8 * s, SLEEVE);
  }
  // its shadow on the glass when it hovers; the pad's own dark when it presses
  if (!o.press) for (let j = -3; j <= 3; j++) for (let i = -5; i <= 5; i++) if (Math.hypot(i / 5, j / 3) < 1 && bayer(at[0] + i + 3, at[1] + j + 6) < 0.5) b.set(at[0] + i + 3, at[1] + j + 6, stepColor(b.get(at[0] + i + 3, at[1] + j + 6), -1));
  // the room's light on his skin is the screen's cool one: the warm rig walked two rungs toward the dark room
  drawHand(b, h.hand, h.x, h.y, {map: (c) => (isSkin(c) ? stepColor(c, -(o.skin ?? 1)) : c)});
  return h;
};

/** his glass on the desk in the OTS foreground: a cut tumbler of WATER, a rung soft (near the lens), the monitor's
 *  cyan on its near rim and in the water, the room seen through it a rung up */
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
      else if (j < 9) c = stepColor(behind, 1); // the empty top: the room through clear glass
      else c = bayer(X, Y) < 0.35 ? PAL.C2 : stepColor(behind, 1) === behind ? PAL.C1 : stepColor(behind, 1);
      if (!edge && Math.abs(u + 0.55) < 0.1 && j > 4) c = PAL.C6; // the long highlight down the near wall
      b.set(X, Y, c);
    }
  }
  // the rim (an ellipse) and the water's surface (a flatter one), the base's thick bottom
  for (let i = -rx; i <= rx; i++) { const e = Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / (rx * rx))) * 3); b.set(Math.round(cx + i), y - e, i < 0 ? PAL.C6 : PAL.G3); b.set(Math.round(cx + i), y + e, PAL.C5); }
  for (let i = -rx + 2; i <= rx - 2; i++) { const e = Math.round(Math.sqrt(Math.max(0, 1 - (i * i) / ((rx - 2) * (rx - 2)))) * 2); b.set(Math.round(cx + i), y + 9 - e, PAL.C7); b.set(Math.round(cx + i), y + 9 + e, PAL.C4); }
};
/** Ep1's framed GUEST lanyard (rooms/darkroom-act3 drawBackWall's frame, redrawn here at the OTS's soft depth) */
const guestFrame = (b: Buf, x: number, y: number) => {
  fill(b, x, y, 26, 22, PAL.D2); fill(b, x, y, 26, 1, PAL.D3); fill(b, x + 2, y + 2, 22, 18, PAL.N1);
  for (let i = 4; i < 22; i++) b.set(x + i, y + 4, PAL.G2);
  fill(b, x + 8, y + 8, 10, 8, PAL.G5); fill(b, x + 8, y + 8, 10, 2, PAL.R1);
  for (let i = 0; i < 26; i++) b.set(x + i, y + 22, PAL.N0);
};

// ================================================================== the OTS (8.01, 8.03, the tag's setup)
/** the room behind the monitor (Ep1's plate, slid 60 px and stepped down 3 rungs: kits/mas-monitor drawMonitorOTS's own
 *  background, copied without its foreground head so Act Two can draw its own) */
let otsBg: Buf | null = null;
const otsRoom = (): Buf => {
  if (otsBg) return otsBg;
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, 0, {tally: 2, glass: true}); drawDarkPlateDesk(bg, 0, {tally: 2, glass: true}); drawDarkPlateFront(bg, 0, {tally: 2, glass: true});
  const sh = new Buf(480, 270, PAL.N0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) sh.set(x, y, stepColor(bg.get(Math.min(479, x + 60), y), -3));
  // the wall right of the monitor: Ep1's framed GUEST lanyard (the tag's dark room), soft at this depth
  guestFrame(sh, 396, 46);
  otsBg = sh;
  return sh;
};
/** the back of his head and his shoulder, close (the OTS foreground): Ep1's approved turned-away bust redrawn at the
 *  OTS's size in the frame's own pixels (act2 backhead: the silhouette first, his hair in clumps sweeping forward, the
 *  nape and neck, a hint of each ear, the hoodie's shoulders and the hood bunched on his back), turned a step toward the
 *  monitor (the cheek's edge and the near ear on the screen side), the monitor's cyan rim on the edges toward it */
export const OTS_HEAD = {x: -30, y: 30, scale: 1.5};
const darkHead = (b: Buf) => { drawBackHead(b, OTS_HEAD.x, OTS_HEAD.y, {scale: OTS_HEAD.scale, turn: 1, light: 'monitor', flip: true}); };
export const otsDark = (b: Buf, f: number, paint: Painter, st: {dim?: number} = {}) => {
  b.c.set(otsRoom().c.subarray(0, 480 * RH));
  const T = MON_OTS;
  rect(T.x - 8, T.y - 8, T.w + 16, T.h + 16, b.ink(PAL.G1)); rect(T.x - 8, T.y - 8, T.w + 16, 1, b.ink(PAL.G3)); rect(T.x - 1, T.y - 1, T.w + 2, T.h + 2, b.ink(PAL.N0));
  const scr = new Buf(T.w, T.h, PAL.N0);
  paint(scr, f);
  for (let y = 0; y < scr.h; y += 3) for (let x = 0; x < scr.w; x++) if (bayer(x, y) < 0.5) scr.set(x, y, stepColor(scr.get(x, y), -1));
  for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) b.set(T.x + x, T.y + y, scr.get(x, y));
  rect(T.x + T.w / 2 - 12, T.y + T.h + 8, 24, 20, b.ink(PAL.G1));
  // the screen's light on the desk below it
  for (let y = T.y + T.h + 8; y < RH; y++) for (let x = T.x - 30; x < T.x + T.w + 30; x++) if (((x + y) & 3) === 0) b.set(x, y, stepColor(b.get(x, y), 1));
  // his glass in the foreground, right, on the desk's near edge
  otsGlass(b, 402, 160);
  darkHead(b);
  if (st.dim) for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -st.dim));
};

// ================================================================== 8.01: the notification, the swipe
/** the RULEBOOK notification sliding down k frames after its pop (the art's painter, its own timing) */
export const rulebookPainter = (k: number, swipe = 0): Painter => (scr) => { if (k < 0) { rulebookNotif(-99)(scr, 0); return; } rulebookNotif(k, swipe)(scr, 0); };
/** [ECU] the notification close (the screen's own UI at this distance: the book big, the SNOOZE button bolted to its
 *  spine, the headline in the display face) and his two fingertips flicking it off to the right. st.touch: the fingers
 *  arrive (0 none, 1 hovering, 2 on it), st.off: whole pixels the card has gone right */
export const swipeECU = (b: Buf, k: number, st: {touch: 0 | 1 | 2; off: number}) => {
  // the desktop behind (the screen's own pixels: dark blue, the taskbar's icons at the foot)
  vramp(b, 0, 0, W, RH, [PAL.N2, PAL.N1, PAL.N1]);
  for (let y = 0; y < RH; y += 3) for (let x = 0; x < W; x++) if (bayer(x, y) < 0.5) b.set(x, y, stepColor(b.get(x, y), -1));
  fill(b, 0, 186, W, 17, PAL.N0); for (let i = 0; i < 6; i++) fill(b, 24 + i * 34, 190, 22, 10, [PAL.C3, PAL.W4, PAL.L2, PAL.R1, PAL.G3, PAL.U2][i]);
  const x = 40 + st.off, y = 24, w = 400, h = 118;
  if (x < W) {
    fill(b, x - 2, y - 2, w + 4, h + 4, PAL.N0); fill(b, x, y, w, h, PAL.N3); fill(b, x, y, w, 2, PAL.C5);
    // the book: 400 pages, its spine at the left with the big red SNOOZE button bolted on (four bolts), unpressed
    const bx = x + 26, by = y + 14, bw = 78, bh = 90;
    fill(b, bx, by, bw, bh, PAL.F3); fill(b, bx, by, bw, 3, PAL.F5); fill(b, bx + bw - 8, by, 8, bh, PAL.P1);
    for (let j = 3; j < bh - 1; j += 2) fill(b, bx + bw - 8, by + j, 8, 1, PAL.P0);
    fill(b, bx, by, 10, bh, PAL.F2);
    const kx = bx - 8, ky = by + 24;
    fill(b, kx, ky, 30, 26, PAL.G3); fill(b, kx, ky, 30, 1, PAL.G5); fill(b, kx, ky + 25, 30, 1, PAL.G1);
    ellipse(kx + 15, ky + 12, 10, 9, b.ink(PAL.R1)); ellipse(kx + 15, ky + 11, 9, 8, b.ink(PAL.R2)); ellipse(kx + 13, ky + 8, 3, 2, b.ink(PAL.R3));
    for (const [qx, qy] of [[kx + 2, ky + 2], [kx + 27, ky + 2], [kx + 2, ky + 23], [kx + 27, ky + 23]]) { b.set(qx, qy, PAL.G6); b.set(qx + 1, qy, PAL.G4); }
    pt(b, 'SNOOZE', kx + 15 - Math.round(pw('SNOOZE') / 2), ky + 30, PAL.P2);
    bpt(b, 'EUROPE PASSES ITS', x + 132, y + 26, PAL.P2);
    bpt(b, 'AI RULEBOOK · 523–46', x + 132, y + 48, PAL.P2);
    pt(b, 'NEWS', x + 132, y + 76, PAL.N7);
  }
  if (st.touch) fingerOn(b, [x + 300, y + 92], {press: st.touch === 2, two: true, s: 6.4});
  void k;
};

// ================================================================== 8.02 / 8.03: the news site
/** the news site, scrolled into place: before k = 0 the page above it (his feed); one whole-pixel scroll of 4 steps */
export const newsPainter = (k: number, turn: 0 | 1, play = true): Painter => (scr, f) => {
  const steps = [scr.h, Math.round(scr.h * 0.62), Math.round(scr.h * 0.3), Math.round(scr.h * 0.08), 0];
  const off = steps[clamp(Math.floor(k / 3), 0, 4)];
  newsSitePainter(k, {turn})(scr, f);
  if (play) {
    // the video playing: the play glyph is gone, a thin progress bar runs along the still's foot
    const lines = pwrap('…TAKES AIM AT MAS, TASYA AND RADNUS…', scr.w - 20);
    const vy = 22 + lines.length * 10 + 4, vh = scr.h - vy - 8, vw = Math.min(scr.w - 20, Math.round(vh * 1.78));
    if (turn === 0) { const cx = 10 + vw / 2, cy = vy + vh / 2; for (let j = -8; j <= 8; j++) for (let i = -6; i <= 8; i++) scr.set(Math.round(cx + i), Math.round(cy + j), scr.get(Math.round(cx + i), Math.round(cy + j) - 0)); }
    fill(scr, 10, vy + vh - 3, vw, 2, PAL.N1); fill(scr, 10, vy + vh - 3, Math.round(vw * clamp(0.2 + k / 400, 0, 1)), 2, PAL.R2);
  }
  if (off > 0) {
    // the page above: his feed, scrolling up out of the way (grey rows, avatars)
    for (let y = 0; y < off; y++) { const yy = y + (scr.h - off); for (let x = 0; x < scr.w; x++) scr.set(x, y, PAL.N2); void yy; }
    for (let r = 0; r * 26 < off; r++) { const yy = off - 26 * (r + 1); if (yy + 20 < 0) continue; ellipse(16, yy + 10, 5, 5, scr.ink(PAL.N5)); fill(scr, 28, yy + 6, 120 + ((r * 37) % 90), 3, PAL.N5); fill(scr, 28, yy + 13, 80 + ((r * 53) % 70), 3, PAL.N4); }
    fill(scr, 0, off - 1, scr.w, 1, PAL.N0);
  }
};
/** the POV of the monitor with any painter (Ep1's kit) */
export const povDark = (b: Buf, f: number, paint: Painter) => drawMonitorPOV(b, f, paint);

// ================================================================== 8.04 / 8.07: the calendar
/** the calendar POV. st.drag 0..1 (WED -> MON, snapped at 1), st.invite 0..3, st.finger: his fingertip on the glass
 *  (the block while dragging, Accept on 8.07), st.press, st.glow 0..3: the lit MON square glowing at the end (the
 *  match into the work light backstage) */
export const calendarPOV = (b: Buf, f: number, st: {drag: number; invite: number; finger?: 'block' | 'accept' | null; press?: boolean; glow?: number}) => {
  drawMonitorPOV(b, f, calendarPainter({drag: st.drag, invite: st.invite}));
  const S = MON_POV, cw = Math.floor((S.w - 16) / 5), top = 24;
  // his block's frame position (the painter's own geometry)
  const d = clamp(st.drag, 0, 1), bx = S.x + Math.round(8 + 2 * cw + 2 + (8 + 2 - (8 + 2 * cw + 2)) * d), by = S.y + top + 14 + (d >= 1 ? 0 : -3);
  if (st.glow) {
    // the Monday square lit: its light spills past the bezel in a soft pool (held steps)
    const g = st.glow;
    // the rest of the screen a rung down (the eye goes to the square), the square up g rungs, its light past the bezel
    if (g >= 2) for (let y = S.y; y < S.y + S.h; y++) for (let x = S.x; x < S.x + S.w; x++) if (x < bx - 2 || x > bx + cw - 4 || y < by - 2 || y > by + 40) b.set(x, y, stepColor(b.get(x, y), -(g - 1)));
    glow(b, bx + 33, by + 19, 50 + g * 22, 36 + g * 14, g + 1);
    for (let j = 0; j < 38; j++) for (let i = 0; i < cw - 6; i++) { const X = bx + i, Y = by + j; b.set(X, Y, stepColor(b.get(X, Y), g)); }
  }
  if (st.finger === 'block') fingerOn(b, [bx + 40, by + 26], {press: st.press, from: 'BR'});
  if (st.finger === 'accept') fingerOn(b, [S.x + 8 + 26, S.y + top + 80 + 6 + 20], {press: st.press, from: 'BR'});
};

// ================================================================== the MCU (8.05, 8.06's middle, 12.08)
const AFTERNOON_SKY = [PAL.N5, PAL.N6, PAL.N7, PAL.N7];
const mcuBg = new Map<string, Buf>();
/** the plate soft behind him (Ep1's, three rungs down); in the afternoon the window's sky is lit (an overcast May
 *  afternoon: the city a grey silhouette, its windows dark) and the room comes up a rung */
const mcuPlate = (afternoon: boolean): Buf => {
  const key = afternoon ? 'pm' : 'night';
  const hit = mcuBg.get(key); if (hit) return hit;
  const bg = new Buf(480, 270, PAL.N0);
  drawDarkPlate(bg, 0, {tally: 2}); drawDarkPlateDesk(bg, 0, {tally: 2});
  const out = new Buf(480, 270, PAL.N0);
  const Wn = DPLATE.win;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c = bg.get(x, y);
    if (afternoon && x > Wn.x0 + 2 && x < Wn.x1 - 2 && y > Wn.y0 + 2 && y < Wn.y1 - 2) {
      const L = lightness(c);
      // the glazing bars stay dark; the sky lit; the buildings a flat grey-blue silhouette, their windows off
      if (c === PAL.N0 || c === PAL.N1 && L < 0.06) c = PAL.N2;
      else if (y < Wn.y0 + 40 && L < 0.2) c = AFTERNOON_SKY[clamp(Math.floor((y - Wn.y0) / 10), 0, 3)];
      else c = bayer(x, y) < 0.5 ? PAL.N4 : PAL.N3;
      out.set(x, y, stepColor(c, -1));
      continue;
    }
    out.set(x, y, stepColor(c, afternoon ? -2 : -3));
  }
  vignette(out, 1, 0.6, 0.7, RH, RH);
  mcuBg.set(key, out);
  return out;
};
/** his eyes in the portrait (local), where a reflection lands */
const EYES: Array<[number, number]> = [[39, 48], [52, 48]];
/** HIS FACE IN THE AFTERNOON (12.05, 12.08; the review pass): his natural-skin portrait (the 'warm' light of 9.04 and
 *  11.11), keyed one step from the window (cast/face-light-img: the side facing it a step up, a hard cel step at the
 *  terminator, no dither on skin); the monitor's cyan kept only as the rim on the screen side (the warm rig's own rim
 *  walked to the cyan, a rung lower once the screen shows his dark document); when the window is behind him, its pale
 *  daylight along his far edge. key: where the window is ('left' = beside the monitor, 12.05; 'right' = behind him to
 *  the right, 12.08) */
const PM = new Map<string, Img>();
export const masAfternoonImg = (o: {look?: -1 | 0 | 1; key: 'left' | 'right'; rim: 'on' | 'dim'; mouth?: MasPortraitState['mouth']}): Img => {
  const id = JSON.stringify(o); const hit = PM.get(id); if (hit) return hit;
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', look: o.look ?? -1, mouth: o.mouth ?? 'rest'});
  const RIM: Record<number, number> = o.rim === 'on' ? {[PAL.W5]: PAL.C4, [PAL.W6]: PAL.C5, [PAL.W8]: PAL.C7} : {[PAL.W5]: PAL.C2, [PAL.W6]: PAL.C3, [PAL.W8]: PAL.C5};
  const c = im.c.slice();
  for (let i = 0; i < c.length; i++) { const v = c[i]; if (v >= 0 && RIM[v] !== undefined) c[i] = RIM[v]; }
  let out: Img = faceLightImg({...im, c}, 1, {key: o.key === 'left' ? [-1, -0.3] : [1, -0.3]});
  if (o.key === 'right') {
    // the window's daylight on his far edge: the hair, the ear and cheek, the hoodie's shoulder
    const d = out.c.slice();
    for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w - 1; x++) {
      const v = out.c[y * im.w + x];
      if (v < 0 || out.c[y * im.w + x + 1] >= 0) continue;
      const fm = familyOf(v); if (!fm) continue;
      d[y * im.w + x] = fm[0] === 'B' ? PAL.B4 : fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X' ? PAL.S6 : fm[0] === 'G' ? PAL.G4 : v;
    }
    out = {...out, c: d};
  }
  PM.set(id, out);
  return out;
};
/** the phone pressed to his ear in the MCU (the portrait faces camera-left, so its visible ear is at its right, about
 *  (80, 50) local; act3 bridge masCall's construction at this scale): the slab's edge against his cheek, the call's
 *  green bar lit along its near edge, his hand round its back (fingers along it, the thumb on its near edge), the
 *  sleeve down out of the frame's foot; the screen's spill a rung up on the cheek beside it */
const phoneAtEar = (b: Buf, x: number, y: number) => {
  const ex = x + 80, ey = y + 50;
  for (let j = -14; j < 22; j++) for (let i = -9; i < -2; i++) { const X = ex + i, Y = ey + j, c = b.get(X, Y); if (isSkin(c) && bayer(X, Y) < 0.5 + i / 18) b.set(X, Y, stepColor(c, 1)); }
  // the slab: its back to us in the dark room, so a grey body (black would vanish into the room), the monitor's cyan
  // along its near edge, a lit far edge, the call's green bar on its rim
  fill(b, ex - 3, ey - 18, 10, 40, PAL.N0); fill(b, ex - 2, ey - 17, 8, 38, PAL.G1); fill(b, ex - 2, ey - 17, 1, 38, PAL.C4);
  fill(b, ex + 5, ey - 17, 1, 38, PAL.G3); fill(b, ex - 1, ey - 17, 6, 1, PAL.G3); fill(b, ex - 2, ey - 9, 1, 16, PAL.L3);
  const h = placeHand(POSES.grip([0.1, -1, 0.1], [0.95, 0, 0.3], 'L', 0.55), {s: 2.6, at: [ex + 4, ey + 6], anchor: 'middle', light: 'lobby', cuffRamp: CUFF});
  sleeve(b, h.cuffEnd, [ex + 30, RH + 40], 9, 13, SLEEVE);
  drawHand(b, h.hand, h.x, h.y, {map: (c) => (isSkin(c) ? stepColor(c, -1) : c)});
};
/** HIS FACE ON THE CALL (8.06; the fixes pass: the cold cyan MCU read as talking to the air, P10): his natural-skin
 *  portrait keyed one step from the monitor's side, the monitor's cyan only as his rim (12.05's warm rig, at night) */
export const masMCU = (b: Buf, f: number, st: {mas?: Partial<MasPortraitState>; afternoon?: boolean; monday?: boolean; faceLight?: number; x?: number; call?: boolean} = {}) => {
  b.c.set(mcuPlate(!!st.afternoon).c.subarray(0, 480 * RH));
  const x = st.x ?? 100, y = 22;
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, look: -1, ...st.mas};
  if (st.call) { putBustSoft(b, masAfternoonImg({look: s.look, key: 'left', rim: 'on', mouth: s.mouth}), x, y, RH); phoneAtEar(b, x, y); void f; return; }
  if (st.afternoon) { putBustSoft(b, masAfternoonImg({look: s.look, key: 'right', rim: 'dim', mouth: s.mouth}), x, y, RH); void f; return; }
  const im = masPortrait(s);
  const fl = st.faceLight ?? (st.monday ? 1 : 0);
  putBustSoft(b, fl ? faceLightImg(im, fl, {key: [-1, -0.2]}) : im, x, y, RH);
  if (st.monday) {
    // the lit MON square in his eyes: a 2 x 2 teal-white square in each, on the monitor's side of the pupil
    for (const [ex, ey] of EYES) { const X = x + ex, Y = y + ey; b.set(X, Y, PAL.C9); b.set(X + 1, Y, PAL.C8); b.set(X, Y + 1, PAL.C8); b.set(X + 1, Y + 1, PAL.C7); }
  }
  void f;
};

// ================================================================== 8.06: the call
const deskWood = (b: Buf, y0 = 0) => { for (let y = y0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, (x + y * 3) % 41 < 2 ? PAL.D1 : bayer(x, y) < 0.2 ? PAL.D1 : PAL.D0); };
/** the phone face up on the desk (a phone's proportions, ~1:2), its glow on the wood; the call tile ELPPA: a plain
 *  grey disc and the word, no face and no name, ever. st.state: 'ring' (rings round the disc, Answer / Decline) ·
 *  'live' (the call's timer) · 'dots' (…) · 'confirmed'. st.tap: his fingertip on Answer (0 none, 1 over, 2 down) */
export const callECU = (b: Buf, f: number, st: {state: 'ring' | 'live' | 'dots' | 'confirmed'; tap?: 0 | 1 | 2; secs?: number}) => {
  deskWood(b);
  const r = {x: 186, y: 6, w: 108, h: 210};
  glow(b, r.x + r.w / 2, r.y + r.h / 2, 150, 130, 1);
  fill(b, r.x + 5, r.y + 5, r.w, r.h, PAL.N0);
  fill(b, r.x - 3, r.y - 3, r.w + 6, r.h + 6, PAL.G1); fill(b, r.x - 3, r.y - 3, r.w + 6, 1, PAL.G3); fill(b, r.x - 3, r.y - 3, 1, r.h + 6, PAL.G2);
  fill(b, r.x, r.y, r.w, r.h, PAL.N1);
  fill(b, r.x + r.w / 2 - 10, r.y + 4, 20, 3, PAL.N0);
  const cx = r.x + r.w / 2, cy = r.y + 62;
  if (st.state === 'ring') { const p = Math.floor(f / 6) % 3; for (let q = 0; q <= p; q++) ellipse(cx, cy, 31 + q * 5, 31 + q * 5, b.ink(q === p ? PAL.G2 : PAL.N2)); }
  ellipse(cx, cy, 30, 30, b.ink(PAL.G3)); ellipse(cx, cy, 28, 28, b.ink(PAL.G4)); ellipse(cx - 6, cy - 8, 12, 10, b.ink(PAL.G5));
  ellipse(cx, cy, 28, 28, (x, y) => { if (y > cy + 10 && bayer(x, y) < 0.5) b.set(x, y, PAL.G3); });
  bpt(b, 'ELPPA', cx - Math.round(bpw('ELPPA') / 2), r.y + 104, PAL.P2);
  const sub = st.state === 'ring' ? 'incoming call' : st.state === 'live' ? `0:${String(st.secs ?? 0).padStart(2, '0')}` : '';
  if (sub) pt(b, sub, cx - Math.round(pw(sub) / 2), r.y + 124, PAL.N7);
  if (st.state === 'ring') {
    // Answer (green) and Decline (red), round buttons at the foot
    for (const [bx, col, lab] of [[cx + 26, PAL.L2, 'Answer'], [cx - 26, PAL.R1, 'Decline']] as Array<[number, number, string]>) {
      ellipse(bx, r.y + 164, 13, 13, b.ink(st.tap === 2 && lab === 'Answer' ? stepColor(col, -1) : col)); ellipse(bx - 3, r.y + 160, 4, 3, b.ink(stepColor(col, 1)));
      tiny(b, lab.toUpperCase(), bx - Math.round(tinyWidth(lab.toUpperCase()) / 2), r.y + 182, PAL.N7);
    }
  }
  if (st.state === 'dots') for (let q = 0; q < 3; q++) fill(b, cx - 11 + q * 9, r.y + 140, 4, 4, Math.floor(f / 6) % 3 === q ? PAL.P2 : PAL.N5);
  if (st.state === 'confirmed') { const s = 'CONFIRMED'; fill(b, cx - Math.round(pw(s) / 2) - 7, r.y + 136, pw(s) + 14, 15, PAL.L1); fill(b, cx - Math.round(pw(s) / 2) - 7, r.y + 136, pw(s) + 14, 1, PAL.L3); pt(b, s, cx - Math.round(pw(s) / 2), r.y + 140, PAL.L3); }
  if (st.tap) fingerOn(b, [cx + 26, r.y + 162], {press: st.tap === 2, s: 5.6});
};

// ================================================================== 12.05: the afternoon, the recap beside him
/** [MCU] Mas at his desk, the monitor beside him at the frame's left, face-on enough to read: the recap (ELGOOG'S
 *  KEYNOTE under NopeAI's OMNI stamp; no blimp). st.min 0..1 (minimised to the taskbar), st.tap: his fingertip on
 *  the window's minimise (0 none, 1 over, 2 down) */
export const recapMCU = (b: Buf, f: number, st: {min: number; tap?: 0 | 1 | 2; k: number}) => {
  b.c.set(mcuPlate(true).c.subarray(0, 480 * RH));
  // the monitor beside him, turned three-quarters to him: its bezel, the screen, its foot on the desk
  const M = {x: 22, y: 30, w: 212, h: 120};
  fill(b, M.x - 7, M.y - 6, M.w + 14, M.h + 13, PAL.G0); fill(b, M.x - 7, M.y - 6, M.w + 14, 1, PAL.G2); fill(b, M.x - 7, M.y - 6, 2, M.h + 13, PAL.G1);
  fill(b, M.x - 1, M.y - 1, M.w + 2, M.h + 2, PAL.N0);
  fill(b, M.x + M.w / 2 - 14, M.y + M.h + 7, 28, 18, PAL.G0); fill(b, M.x + M.w / 2 - 26, M.y + M.h + 24, 52, 4, PAL.G1);
  const scr = new Buf(M.w, M.h, PAL.N0);
  newsRecapPainter(st.k, st.min)(scr, f);
  // behind the recap: his work (a plain document, grey lines of text), uncovered as it shrinks to the taskbar
  if (st.min > 0) {
    const doc = new Buf(M.w, M.h, PAL.N0); newsRecapPainter(st.k, 1)(doc, f);
    fill(doc, 10, 8, M.w - 20, M.h - 24, PAL.N2); fill(doc, 10, 8, M.w - 20, 9, PAL.N3);
    for (let r = 0; r < 9; r++) fill(doc, 18, 24 + r * 9, 60 + ((r * 47) % 110), 3, r % 4 === 0 ? PAL.C3 : PAL.N5);
    // the recap's shrinking window over it (its own painter's geometry)
    const s2 = 1 - clamp(st.min, 0, 1) * 0.85, w = Math.round((M.w - 20) * s2), hh = Math.round((M.h - 24) * s2), x = Math.round((M.w - w) / 2 * (1 - st.min) + 6 * st.min), y = Math.round(8 + (M.h - 18 - hh) * st.min);
    for (let yy = 0; yy < M.h; yy++) for (let xx = 0; xx < M.w; xx++) { const inWin = xx >= x - 1 && xx < x + w + 1 && yy >= y - 1 && yy < y + hh + 1; if (!inWin) scr.set(xx, yy, doc.get(xx, yy)); }
  }
  // the player's own minimise, at the right end of its control bar (so the finger has a thing to press)
  if (st.min < 0.05) { const wx = M.w - 30, wy = M.h - 34; fill(scr, wx, wy, 14, 10, st.tap === 2 ? PAL.N5 : PAL.N3); fill(scr, wx + 3, wy + 7, 8, 1, PAL.P1); }
  for (let y = 0; y < scr.h; y += 3) for (let x = 0; x < scr.w; x++) if (bayer(x, y) < 0.5) scr.set(x, y, stepColor(scr.get(x, y), -1));
  for (let y = 0; y < M.h; y++) for (let x = 0; x < M.w; x++) b.set(M.x + x, M.y + y, scr.get(x, y));
  // its light on him and on the desk
  glow(b, M.x + M.w, M.y + M.h / 2, 120, 90, 1, (x) => x < M.x + M.w + 8);
  // his face in the afternoon: the window and the monitor both on his left; the screen's cyan only as his near rim,
  // a rung lower once the player has gone to the taskbar
  putBustSoft(b, masAfternoonImg({look: -1, key: 'left', rim: st.min > 0.5 ? 'dim' : 'on'}), 262, 22, RH);
  // his hand on the player's minimise, at his own scale (about three-quarters of his face's length), his arm bent
  // from his shoulder
  if (st.tap) fingerOn(b, [M.x + M.w - 23, M.y + M.h - 29], {press: st.tap === 2, s: 3.0, from: 'BR', skin: 2, elbow: 52, shoulder: [296, 150]});
};

// ================================================================== 12.06 / 12.07: his phone in his hand
/** the phone's face in the ECU (a phone's proportions; the frame crops it): held by its edge (12.06, the 'wrap' grip:
 *  his thumb on the near edge, scrolling) or from below (12.07, the 'cup' grip: the thumb on the keys) */
export const PH_A = {x: 176, y: 2, w: 128, h: 256};
export const PH_C = {x: 166, y: -96, w: 148, h: 296};
/** the app's chrome: a plain top bar (no real platform's name or marks), a back arrow */
const appChrome = (s: Buf, title: string, y0: number) => {
  fill(s, 0, 0, s.w, s.h, PAL.N1);
  fill(s, 0, y0, s.w, 22, PAL.N2); fill(s, 0, y0 + 22, s.w, 1, PAL.N4);
  for (let i = 0; i < 4; i++) { s.set(10 + i, y0 + 11 - i, PAL.P1); s.set(10 + i, y0 + 11 + i, PAL.P1); }
  pt(s, title, Math.round(s.w / 2 - pw(title) / 2), y0 + 8, PAL.P1);
};
const MAS_POST = 'ALYI and NOPEAI are going to part ways. This is very sad to me; ALYI is easily one of the greatest minds of our generation, a guiding light of our field, and a dear friend.';
const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const KBY = 216;
const keyXY = (ch: string): [number, number] => { const c = ch.toLowerCase(); for (let r = 0; r < 3; r++) { const q = KEYS[r].indexOf(c); if (q >= 0) return [3 + q * 14 + r * 7 + 6, KBY + 4 + r * 24 + 10]; } return [74, KBY + 4 + 3 * 24 + 8]; };
/**
 * st.mode: 'dark' (the screen off) · 'alyi' (Alyi's post, its first crop; st.scroll 0..1 runs it up a whole-pixel
 * step at a time to the second crop, …I will miss everyone dearly.) · 'compose' (his post being typed: st.typed
 * characters, the keyboard up, his thumb on the key of the last letter) · 'posted' (his post, sent, hard-stopped at the
 * crop: no scroll). st.lit 0..3: the screen lighting up in held steps.
 */
export const phoneECU = (b: Buf, f: number, st: {mode: 'dark' | 'alyi' | 'compose' | 'posted'; scroll?: number; typed?: number; lit?: number}) => {
  deskWood(b);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), 1));
  const cup = st.mode === 'compose' || st.mode === 'posted';
  const P = cup ? PH_C : PH_A;
  const scr = new Buf(P.w, P.h, PAL.N0);
  let thumb: [number, number] = [P.x + P.w * 0.7, P.y + P.h - 40];
  if (st.mode !== 'dark') {
    if (st.mode === 'alyi') {
      appChrome(scr, 'post', 4);
      const off = Math.round(clamp(st.scroll ?? 0, 0, 1) * 150);
      const card = new Buf(P.w, 360, PAL.N1);
      drawEp2Post(card, 4, 4, 'alyiLeave1', {size: 'phone', w: P.w - 8});
      // the post's middle (not in either crop: grey bars, no words), then its last sentence
      for (let r = 0; r < 8; r++) fill(card, 30, 100 + r * 8, P.w - 50 - (r * 13) % 30, 3, PAL.N3);
      drawEp2Post(card, 4, 178, 'alyiLeave2', {size: 'phone', w: P.w - 8});
      for (let y = 0; y < P.h - 30; y++) for (let x = 0; x < P.w; x++) { const sy = y + off; if (sy < card.h) scr.set(x, 30 + y, card.get(x, sy)); }
    } else if (st.mode === 'compose') {
      appChrome(scr, 'new post', 98);
      const n = clamp(st.typed ?? 0, 0, MAS_POST.length);
      fill(scr, 4, 124, P.w - 8, 88, PAL.N2);
      const lines = pwrap(MAS_POST.slice(0, n), P.w - 18);
      lines.forEach((l, i) => pt(scr, l, 9, 128 + i * 9, PAL.P1));
      const ll = lines[lines.length - 1] ?? '';
      if (Math.floor(f / 8) % 2 === 0) fill(scr, 9 + pw(ll) + 1, 128 + Math.max(0, lines.length - 1) * 9 - 1, 1, 8, PAL.C6);
      fill(scr, P.w - 40, 100, 36, 16, n >= MAS_POST.length ? PAL.C3 : PAL.N3); pt(scr, 'Post', P.w - 33, 104, PAL.P2);
      fill(scr, 0, KBY, P.w, P.h - KBY, PAL.N2);
      const ch = n > 0 ? MAS_POST[n - 1] : ' ';
      KEYS.forEach((row, r) => { for (let q = 0; q < row.length; q++) { const kx = 3 + q * 14 + r * 7, ky = KBY + 4 + r * 24, on = row[q] === ch.toLowerCase() && n < MAS_POST.length; fill(scr, kx, ky, 12, 20, on ? PAL.N7 : PAL.N4); fill(scr, kx, ky + 19, 12, 1, PAL.N1); tiny(scr, row[q].toUpperCase(), kx + 4, ky + 7, on ? PAL.P2 : PAL.N8); } });
      fill(scr, 30, KBY + 4 + 72, P.w - 60, 14, PAL.N4);
      const kxy = n < MAS_POST.length ? keyXY(ch === ' ' ? ' ' : ch) : [P.w - 22, 108] as [number, number];
      // the pressed key's preview above the thumb (a letter key: its balloon)
      if (n > 0 && n < MAS_POST.length && /[a-z]/i.test(ch)) keyBalloon(scr, kxy, ch, 12, 20);
      thumb = [P.x + kxy[0] + 2, P.y + kxy[1] + 5];
    } else {
      appChrome(scr, 'post', 84);
      drawEp2Post(scr, 4, 108, 'masAlyi', {size: 'phone', w: P.w - 8}, 'now');   // just sent: the app's 'now' (the fixes pass: @masa and MAY 14 ran together)
      thumb = [P.x + P.w * 0.75, P.y + P.h - 10];
    }
    const lit = st.lit ?? 3;
    if (lit < 3) for (let y = 0; y < scr.h; y++) for (let x = 0; x < scr.w; x++) scr.set(x, y, stepColor(scr.get(x, y), -(3 - lit)));
  }
  const drawPhone = (bb: Buf) => {
    fill(bb, P.x - 6, P.y - 6, P.w + 12, P.h + 12, PAL.N0); fill(bb, P.x - 5, P.y - 5, P.w + 10, P.h + 10, PAL.G1); fill(bb, P.x - 5, P.y - 5, 1, P.h + 10, PAL.G3);
    for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) bb.set(P.x + x, P.y + y, scr.get(x, y));
  };
  if (cup) {
    // the thumb posed ON the key of the letter it types (the lit key), per key (common cupThumb); the check: within one
    // key's width of it on every press
    const h = cupThumb(b, P, thumb, {cuffRamp: CUFF, sleeveRamp: SLEEVE, sleeveTo: [560, 330], widthCm: 7.4, skinMap: (c) => stepColor(c, -1), drawPhone});
    if (st.mode === 'compose' && Math.hypot(h.thumb[0] - thumb[0], h.thumb[1] - thumb[1]) > 12) throw new Error(`12.07: the thumb is ${Math.round(Math.hypot(h.thumb[0] - thumb[0], h.thumb[1] - thumb[1]))} px from its key`);
  } else holdPhone(b, P, {side: 'R', grip: 'wrap', light: 'lobby', cuffRamp: CUFF, sleeveRamp: SLEEVE, sleeveTo: [560, 330], widthCm: 7.4, thumbAt: 0.25 + (st.scroll ?? 0) * 0.3, skinMap: (c) => stepColor(c, -1), drawPhone});
  // the screen's light on the desk round the phone
  if (st.mode !== 'dark') glow(b, P.x + P.w / 2, 110, 230, 150, 1, (x, y) => x >= P.x - 6 && x < P.x + P.w + 6 && y < P.y + P.h + 6);
};
void rect; void hash; void tiny; void bpt; void MON_OTS;
