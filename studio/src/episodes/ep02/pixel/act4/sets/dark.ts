// MR. MAS — Ep2 v1 · act4 · sc 20's last beat: HIS DARK ROOM, JUN 19, 2024 (a week later, morning). The shots pass,
// 2026-10-09. The room is Ep1's dark room plate (rooms/darkroom-plate, imported read-only) on Act Two's MCU (act2/sets/
// dark.ts mcuPlate and masAfternoonImg, COPIED: the window's daylight on the city, the room a rung up), the art pass's
// face-down phone and its turn (art/sets/darkroom2 phoneFaceDown), and Act Three's phone screens (act3/sets/office:
// TPOOL in its 2008 colours at a 2024 phone's proportions, the map and its pins: COPIED, the check-in pin where 15.17
// left it):
//   faceDown(b, f, st)     [ECU] 20.10: his phone face down on the desk, its edges lit by the screen underneath; his
//                          hand turning it over (the art's turn drawings)
//   phoneRead(b, f, st)    [ECU] 20.10 / 20.11 / 20.13: the phone in his hand (held from below: the thumb at the
//                          glass's foot), TPOOL still open on its map (the check-in pin at its old place), Alyi's post
//                          arriving over it in its own UI ("I am starting a new company:"), its link card ISS (cropped
//                          to its plate since Act Three's fixes pass) landing on the old pin and knocking it loose
//                          (st.card, st.knock), the pin tipping off the map and falling (st.fall)
//   masReading(b, f, st)   [MCU] 20.12: Mas reading, still (his approved portrait, the morning window behind him keyed
//                          one step: a face light), the phone's light on his chin
//   flyerOut(b, f, st)     [INSERT] 20.12: his hand taking the folded flyer (white, the tape on its corners) out of his
//                          jacket; then he stands (the portrait rising out of the frame's top)
// No V.O. at Alyi's post (W8: another person's real act). Nothing about why: his own words only.
import {Buf, rect, line, ellipse, poly, bayer, clamp, TRANSPARENT} from '../../../../../shared/pixel/px';
import {PAL, stepColor, lightness, familyOf} from '../../../../../shared/pixel/palette';
import type {Img} from '../../../../../shared/pixel/figure';
import {drawDarkPlate, drawDarkPlateDesk, DPLATE} from '../../../../../shared/pixel/rooms/darkroom-plate';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasPortraitState} from '../../../../../shared/pixel/cast/mas';
import {faceLightImg} from '../../../../../shared/pixel/kits/face-light-img';
import {vignette} from '../../../../../shared/pixel/rooms/kit-b';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {phoneFaceDown} from '../../art/sets/darkroom2';
import {drawEp2Post} from '../../art/props/ui';
import {placeHand, drawHand, sleeve, POSES} from '../../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, vramp} from '../../art/kit';
import {RH, W, glow, putBustSoft, cupThumb} from './common';

// ================================================================== the face-down phone
export const faceDown = (b: Buf, f: number, st: {lit: boolean; turn: 0 | 1}) => {
  phoneFaceDown(b, f, {turn: st.turn, lit: st.lit});
};

// ================================================================== the phone in his hand: TPOOL, Alyi's post
/** the phone rect of the ECUs (a 2024 phone's proportions; the frame crops its foot) */
export const PH = {x: 160, y: 8, w: 150, h: 300};
/** the check-in pin's place on TPOOL's map (screen px). A week on from sc 15 the map sits panned a little (the pin
 *  lower than 15.17's 80, 92), so Alyi's post can arrive above it and its link card drop onto it */
export const PIN = {x: 80, y: 150};
const statusBar = (scr: Buf, col = PAL.N8) => { tiny(scr, '10:02', 8, 4, col); for (let q = 0; q < 3; q++) fill(scr, scr.w - 22 + q * 5, 5, 3, 3, col); };
/** TPOOL's map at the phone's proportions (act3/sets/office tpoolScreen 'map', copied): 2008 tiles, every stale pin
 *  tagged 2012, the one checked-in pin (red), EARLY-WEB16 inside the 2024 bezel. `pin`: the checked-in pin's state:
 *  0 in place, 1 knocked (tilted a step), 2.. falling (its drop in px; off the map past the screen's foot) */
const tpoolMap = (scr: Buf, f: number, pin: number) => {
  fill(scr, 0, 0, scr.w, scr.h, PAL.N2); statusBar(scr);
  const A = {x: 0, y: 16, w: scr.w, h: scr.h - 16};
  fill(scr, A.x, A.y, A.w, A.h, PAL.P2); fill(scr, A.x, A.y, A.w, 22, PAL.W5); bpt(scr, 'TPOOL', 8, A.y + 4, PAL.P2);
  fill(scr, 0, A.y + 22, A.w, A.h - 22, PAL.L2);
  for (let i = 4; i < A.w; i += 24) fill(scr, i, A.y + 22, 4, A.h - 22, PAL.P1);
  for (let j = A.y + 30; j < scr.h; j += 28) fill(scr, 0, j, A.w, 4, PAL.P1);
  fill(scr, 0, scr.h - 70, 54, 70, PAL.C5);
  tiny(scr, 'LAST SEEN: 2012', 4, A.y + 26, PAL.N1);
  const pins: Array<[number, number]> = [[14, 70], [58, 64], [116, 58], [132, 92], [26, 100], [110, 112], [16, 132], [120, 140], [134, 168], [36, 184], [100, 186], [44, 160]];
  pins.forEach(([px, py]) => {
    fill(scr, px - 3, py - 9, 7, 7, PAL.N1); fill(scr, px - 2, py - 8, 5, 5, PAL.G3); scr.set(px - 1, py - 7, PAL.G5);
    scr.set(px - 1, py - 2, PAL.N1); scr.set(px, py - 2, PAL.N1); scr.set(px + 1, py - 2, PAL.N1); scr.set(px, py - 1, PAL.N1);
    const tw = tinyWidth('2012') + 2; fill(scr, px - (tw >> 1), py + 1, tw, 7, PAL.P2); tiny(scr, '2012', px - (tw >> 1) + 1, py + 2, PAL.N1);
  });
  // the checked-in pin: in place (pulsing faintly), knocked (tilted, its point off its spot), falling
  const drop = pin >= 2 ? pin : 0, tilt = pin >= 1 ? 1 : 0;
  const X = PIN.x + tilt * 3 + Math.round(drop * 0.15), Y = PIN.y + drop;
  if (Y < scr.h + 12) {
    if (tilt) { poly([X - 4, Y - 9, X + 3, Y - 11, X + 4, Y - 4, X - 3, Y + 1], scr.ink(PAL.R2)); fill(scr, X - 1, Y - 8, 3, 3, PAL.P2); }
    else { const pulse = Math.floor(f / 8) % 2; fill(scr, X - 3 - pulse, Y - 8 - pulse, 7 + pulse * 2, 7 + pulse * 2, PAL.R2); fill(scr, X - 1, Y - 6, 3, 3, PAL.P2); scr.set(X, Y, PAL.R2); }
  }
  if (tilt && !drop) { for (const [dx, dy] of [[-7, -12], [7, -13], [-8, -4], [8, -3]]) scr.set(PIN.x + dx, PIN.y + dy, PAL.N1); }
  applyPalette(scr, 'EARLYWEB16', {rect: [A.x, A.y + 22, A.w, A.h - 22]});
};
/** where the link card rests on the map (its foot just touching the checked-in pin's head); `card` 0 = attached under
 *  the post (CARD.y0), 1 = landed on the pin */
const CARD = {x: 6, w: 138, h: 46, y0: 78};
const cardRestY = PIN.y - 9 - CARD.h;
export interface ReadSt {
  /** Alyi's post card: frames since it arrived (undefined: not yet) */
  post?: number;
  /** the link card's drop: 0..1 from above the screen to resting on the pin */
  card?: number;
  /** the pin: 0 in place, 1 knocked, 2+ falling (px) */
  pin?: number;
}
/** the link card cropped to its plate (Act Three's fixes pass, 2026-10-10, the episode review's blocker: the art's
 *  issLinkCard, copied, without its line "one goal and one product: a safe superintelligence", which on screen read as a
 *  rebuke of Act Two's product and closed a reason for his leaving the film must not supply; W8, facts §F): the ISS
 *  plate and the card's body, two grey bars where a link card's address would be, no words */
const issCardPlate = (b: Buf, x: number, y: number, w = 200) => {
  fill(b, x - 1, y - 1, w + 2, 46, PAL.N0); fill(b, x, y, w, 44, PAL.N3); fill(b, x, y, 40, 44, PAL.P2); bpt(b, 'ISS', x + 6, y + 15, PAL.N1);
  fill(b, x + 46, y + 14, Math.min(60, w - 56), 3, PAL.N6); fill(b, x + 46, y + 24, Math.min(36, w - 56), 3, PAL.N5);
};
export const phoneScreen = (scr: Buf, f: number, st: ReadSt) => {
  tpoolMap(scr, f, st.pin ?? 0);
  if (st.post !== undefined && st.post >= 0) {
    // Alyi's post over the map, in its own UI (the post card kit: his name, JUN 19, his words)
    drawEp2Post(scr, 4, 20, 'alyiIss', {size: 'phone', w: scr.w - 8, k: st.post});
    if (st.post >= 3 && st.card !== undefined) {
      const c = clamp(st.card, 0, 1), y = Math.round(CARD.y0 + (cardRestY - CARD.y0) * c * c);
      // its link card, dropping out of the post onto the map: the ISS plate (cropped: no line, the fixes pass)
      fill(scr, CARD.x + 3, y + 3, CARD.w, CARD.h, PAL.N0);
      issCardPlate(scr, CARD.x, y, CARD.w);
    }
  }
};
/** the phone in his hand (common cupThumb: the fingers behind it, the thumb at the glass's foot), the dark room soft
 *  behind it, its screen any state of phoneScreen; the screen's light on the room round it */
export const phoneRead = (b: Buf, f: number, st: ReadSt) => {
  b.c.set(plate().c.subarray(0, W * RH));
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(b.get(x, y), -1));
  const P = PH;
  const scr = new Buf(P.w, P.h, PAL.N0);
  phoneScreen(scr, f, st);
  glow(b, P.x + P.w / 2, 90, 200, 140, 1, (x, y) => x >= P.x - 6 && x < P.x + P.w + 6 && y < P.y + P.h);
  const SL = [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G4], CF = [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.G2, PAL.G2, PAL.G4];
  cupThumb(b, P, [P.x + P.w - 22, 198], {cuffRamp: CF, sleeveRamp: SL, sleeveTo: [560, 330], widthCm: 7.4, skinMap: (c) => stepColor(c, -1), drawPhone: (bb) => {
    fill(bb, P.x - 6, P.y - 6, P.w + 12, P.h + 12, PAL.N0); fill(bb, P.x - 5, P.y - 5, P.w + 10, P.h + 10, PAL.G1); fill(bb, P.x - 5, P.y - 5, 1, P.h + 10, PAL.G3);
    for (let y = 0; y < P.h; y++) for (let x = 0; x < P.w; x++) { const Y = P.y + y; if (Y >= 0 && Y < RH) bb.set(P.x + x, Y, scr.get(x, y)); }
  }});
};

// ================================================================== his face, the flyer, standing
const SKY = [PAL.N5, PAL.N6, PAL.N7, PAL.N7];
let PLATE: Buf | null = null;
/** the dark room soft behind him in the morning (act2's mcuPlate 'pm', copied): the window's sky lit, the city a grey
 *  silhouette, the room two rungs down */
const plate = (): Buf => {
  if (PLATE) return PLATE;
  const bg = new Buf(W, 270, PAL.N0);
  drawDarkPlate(bg, 0, {tally: 2}); drawDarkPlateDesk(bg, 0, {tally: 2});
  const out = new Buf(W, 270, PAL.N0);
  const Wn = DPLATE.win;
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    let c = bg.get(x, y);
    if (x > Wn.x0 + 2 && x < Wn.x1 - 2 && y > Wn.y0 + 2 && y < Wn.y1 - 2) {
      const L = lightness(c);
      if (c === PAL.N0 || c === PAL.N1 && L < 0.06) c = PAL.N2;
      else if (y < Wn.y0 + 40 && L < 0.2) c = SKY[clamp(Math.floor((y - Wn.y0) / 10), 0, 3)];
      else c = bayer(x, y) < 0.5 ? PAL.N4 : PAL.N3;
      out.set(x, y, stepColor(c, -1));
      continue;
    }
    out.set(x, y, stepColor(c, -2));
  }
  vignette(out, 1, 0.6, 0.7, RH, RH);
  PLATE = out;
  return out;
};
const PM = new Map<string, Img>();
/** his face in the morning (act2's masAfternoonImg, copied): the warm rig keyed a step from the window behind him to
 *  the right (its daylight on his far edge), the rim a dim cyan; a face light one step */
const masMorningImg = (o: {look?: -1 | 0 | 1; mouth?: MasPortraitState['mouth']; lid?: 0 | 1}): Img => {
  const id = JSON.stringify(o); const hit = PM.get(id); if (hit) return hit;
  const im = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', look: o.look ?? -1, mouth: o.mouth ?? 'rest', lid: o.lid ?? 0});
  const RIM: Record<number, number> = {[PAL.W5]: PAL.C2, [PAL.W6]: PAL.C3, [PAL.W8]: PAL.C5};
  const c = im.c.slice();
  for (let i = 0; i < c.length; i++) { const v = c[i]; if (v >= 0 && RIM[v] !== undefined) c[i] = RIM[v]; }
  let out: Img = faceLightImg({...im, c}, 1, {key: [1, -0.3]});
  const d = out.c.slice();
  for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w - 1; x++) {
    const v = out.c[y * im.w + x];
    if (v < 0 || out.c[y * im.w + x + 1] >= 0) continue;
    const fm = familyOf(v); if (!fm) continue;
    d[y * im.w + x] = fm[0] === 'B' ? PAL.B4 : fm[0] === 'S' || fm[0] === 'K' || fm[0] === 'X' ? PAL.S6 : fm[0] === 'G' ? PAL.G4 : v;
  }
  out = {...out, c: d};
  PM.set(id, out);
  return out;
};
/** [MCU] Mas reading, still; `down`: his eyes on the phone below frame (the lids lowered, the phone's light on his chin);
 *  the stand (the review pass: his rise left a headless torso sliding out): `pan` px the camera tilts up with him as
 *  he rises (the room drops away under him, his head kept in frame, `rise` the little he gains on it), then `out` px he
 *  steps out of frame right */
export const masReading = (b: Buf, f: number, st: {rise?: number; look?: -1 | 0 | 1; out?: number; down?: boolean; pan?: number}) => {
  const pan = st.pan ?? 0, src = plate();
  for (let y = 0; y < RH; y++) { const sy = clamp(y - pan, 0, RH - 1); for (let x = 0; x < W; x++) b.c[y * W + x] = src.c[sy * W + x]; }
  const x = 110 + (st.out ?? 0), y = 26 - (st.rise ?? 0);
  if (x < W) putBustSoft(b, masMorningImg({look: st.look ?? -1, lid: st.down ? 1 : 0}), x, y, RH);
  // the phone's light on his chin and the underside of his face (it is low in front of him, out of frame)
  if (!st.rise && !pan) for (let yy = y + 60; yy < y + 92; yy++) for (let xx = x + 30; xx < x + 80; xx++) { const c = b.get(xx, yy), fm = familyOf(c); if (fm && fm[0] === 'S' && bayer(xx, yy) < (yy - y - 60) / 40) b.set(xx, yy, stepColor(c, 1)); }
  void f;
};
/** [INSERT] his hand taking the folded flyer out of his jacket: the hoodie's front (the knit, the pocket's opening), the
 *  folded flyer (white, the tape's yellowed strips on its corners: never the old note, which stays in there unseen)
 *  coming up out of it in his fingers (`up` 0..2) */
export const flyerOut = (b: Buf, f: number, st: {up: number}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const lit = 0.55 - 0.35 * ((x / W) * 0.6 + (y / RH) * 0.4);
    let c = lit > 0.42 ? PAL.G3 : lit > 0.26 ? PAL.G2 : PAL.G1;
    if (x % 3 === 0) c = stepColor(c, -1);
    b.set(x, y, c);
  }
  const hemY = (x: number) => 128 + Math.round(6 * Math.sin((x / W) * Math.PI));
  const u = clamp(st.up, 0, 2), cx = 200, cy = 96 - u * 34;
  // the opening's shadow, the flyer (folded in four: a square with a crease, the tape at its corners)
  for (let x = 0; x < W; x++) { const bow = Math.max(0, 1 - Math.abs(x - (cx + 40)) / 80); const d = 2 + Math.round(bow * 7); fill(b, x, hemY(x) - d, 1, d, x % 2 ? PAL.N1 : PAL.N0); }
  const fw = 84, fh = 70;
  for (let j = 0; j < fh; j++) for (let i = 0; i < fw; i++) { const X = cx + i + Math.round((fh - j) * 0.12), Y = cy + j; let c = (i * 5 + j) % 17 === 0 ? PAL.P1 : PAL.P2; if (i === 0 || j === 0) c = PAL.W9; if (Math.abs(i - fw / 2) < 0.6 || Math.abs(j - fh / 2) < 0.6) c = PAL.P0; b.set(X, Y, c); }
  for (const [tx, ty] of [[2, 2], [fw - 14, 2]]) { fill(b, cx + tx + Math.round((fh - ty) * 0.12), cy + ty, 12, 6, PAL.W6); fill(b, cx + tx + Math.round((fh - ty) * 0.12), cy + ty, 12, 1, PAL.W7); }
  // printed through the fold: the upside-down headline's ink, faint (no words: it's folded)
  for (let r = 0; r < 3; r++) fill(b, cx + 14, cy + 44 + r * 6, 50 - r * 10, 2, PAL.G5);
  // the pocket panel over the paper's foot
  for (let x = 0; x < W; x++) for (let y = hemY(x); y < RH; y++) { let c = y < hemY(x) + 6 ? PAL.G3 : (x % 3 === 0 ? PAL.G2 : PAL.G3); if (y === hemY(x)) c = PAL.G4; b.set(x, y, c); }
  for (let x = 4; x < W; x += 5) fill(b, x, hemY(x) + 8, 3, 1, PAL.G1);
  // his hand pinching the flyer's top edge, the grey cuff, the sleeve off frame to the upper right
  const tip: [number, number] = [cx + 30 + Math.round(fh * 0.12), cy + 2];
  const h = placeHand(POSES.pinch([-0.55, 0.62, -0.5], [0.2, -0.55, 0.8], 'R'), {s: 9, at: tip, anchor: 'index', light: 'lobby', key: [-0.4, -0.7, 0.6], cuffRamp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5]});
  sleeve(b, h.cuffEnd, [h.cuffEnd[0] + 150, h.cuffEnd[1] - 150], 34, 38, [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3]);
  drawHand(b, h.hand, h.x, h.y);
  void f;
};
void rect; void line; void ellipse; void pt; void pw; void bpw; void vramp;

// ================================================================== the review pass (2026-10-10): the pin at ECU
/** the check-in pin at the ECU's size (the matched object into 22.01's white: the same drawing there): a map marker,
 *  its head a red disc with the white centre, tapering to the point at (x, y); `rot` radians about the point (the
 *  knock, the tumble); `grey` for the stale 2012 pins; `s` its scale (1 = 26 px tall) */
export const drawCheckPin = (b: Buf, x: number, y: number, o: {rot?: number; grey?: boolean; s?: number} = {}) => {
  const s = o.s ?? 1, R = 10 * s, H = 26 * s, Wd = Math.ceil(R * 2 + 4), Ht = Math.ceil(H + R * 0.2 + 4);
  const t = new Buf(Wd, Ht, TRANSPARENT);
  const cx = Wd / 2 - 0.5, cy = R + 2, py = cy + H - R;
  const body = o.grey ? [PAL.N1, PAL.G2, PAL.G3, PAL.G5] : [PAL.N0, PAL.R1, PAL.R2, PAL.R3];
  for (let j = 0; j < Ht; j++) for (let i = 0; i < Wd; i++) {
    const dx = i - cx, dy = j - cy, inHead = Math.hypot(dx, dy) <= R;
    const u = (j - cy) / Math.max(1, py - cy), inTail = j >= cy && j <= py && Math.abs(dx) <= R * (1 - u) * 0.92;
    if (!inHead && !inTail) continue;
    const edge = (Math.hypot(dx, dy) > R - 1.2 && (inHead && !(j > cy && Math.abs(dx) <= R * (1 - u) * 0.92 - 1))) || (inTail && !inHead && Math.abs(dx) > R * (1 - u) * 0.92 - 1.2);
    t.set(i, j, edge ? body[0] : dx > R * 0.35 ? body[1] : dx < -R * 0.3 && dy < 0 ? body[3] : body[2]);
  }
  const dr = Math.max(2, R * 0.38);
  for (let j = 0; j < Ht; j++) for (let i = 0; i < Wd; i++) if (Math.hypot(i - cx, j - cy) <= dr) t.set(i, j, o.grey ? PAL.G6 : PAL.P2);
  // set on the frame rotated about its point
  const a = o.rot ?? 0, ca = Math.cos(a), sa = Math.sin(a);
  const reach = Math.ceil(Math.hypot(Wd, Ht));
  for (let yy = -reach; yy <= reach; yy++) for (let xx = -reach; xx <= reach; xx++) {
    const u = ca * xx + sa * yy + cx, v = -sa * xx + ca * yy + py;
    const iu = Math.round(u), iv = Math.round(v);
    if (iu < 0 || iv < 0 || iu >= Wd || iv >= Ht) continue;
    const c = t.c[iv * Wd + iu]; if (c !== TRANSPARENT) b.set(x + xx, y + yy, c);
  }
};
/** the ECU of the map (20.11, 20.13; the review pass: the pin was a 25-px speck in a phone the size of the frame's
 *  middle third): pushed in on TPOOL's map until the check-in pin is ~26 px (about 100 at 1080p), in its 2008 colours
 *  inside the 2024 glass (the bezel at the frame's edges); the stale 2012 pins grey; Alyi's pin red with sc 15's warm
 *  ripple and its tag (ALYI · DEC 2022); the link card falling from the top of frame, its lower-left corner striking
 *  the pin's head (`card` 0..1, 1 = landed); the pin `pin`: 0 in place, 1 knocked (tipped away from the corner), or a
 *  fall in px (it tips off its spot and drops out past the frame's foot, tumbling) */
export const ECU_PIN = {x: 240, y: 150};
export const mapECU = (b: Buf, f: number, st: {card: number; pin: number}) => {
  // the map: 2008 tiles (green blocks, beige streets, a corner of water), remapped to EARLY-WEB16
  const m = new Buf(W, 270, PAL.N0);
  fill(m, 0, 0, W, RH, PAL.L2);
  for (let x = 70; x < W; x += 132) fill(m, x, 0, 16, RH, PAL.P1);
  for (let y = 48; y < RH; y += 104) fill(m, 0, y, W, 16, PAL.P1);
  fill(m, 0, 150, 60, RH - 150, PAL.C5);
  applyPalette(m, 'EARLYWEB16', {rect: [0, 0, W, RH]});
  // the screen at night in his dark room, filling the frame: two rungs down the era's own sixteen (the white streets to
  // its grey, the grey blocks to its slate, the water to its deep blue), so a frame-filling glass doesn't glare
  const DIM: Record<number, number> = {0xffffff: 0x999999, 0x999999: 0x666699, 0x66ccff: 0x336699, 0xccffff: 0x999999};
  for (let i = 0; i < W * RH; i++) { const d = DIM[m.c[i]]; if (d !== undefined) m.c[i] = d; }
  b.c.set(m.c.subarray(0, W * RH));
  // the stale pins, grey, each tagged 2012
  for (const [px, py] of [[64, 112], [390, 92], [150, 40], [430, 186], [330, 190]] as Array<[number, number]>) {
    drawCheckPin(b, px, py, {grey: true, s: 0.8});
    const tw = tinyWidth('2012') + 4; fill(b, px - (tw >> 1), py + 3, tw, 9, PAL.P2); fill(b, px - (tw >> 1), py + 11, tw, 1, PAL.G4); tiny(b, '2012', px - (tw >> 1) + 2, py + 5, PAL.N1);
  }
  const P = ECU_PIN, pin = st.pin;
  // Alyi's: the ripple (sc 15's, warm, rings walking out) while it's checked in; the tag stays on the map
  if (pin === 0) { const r0 = (f % 24) / 2; for (const rr of [14 + r0, 26 + r0]) for (let a = 0; a < 96; a++) { const t = (a / 96) * Math.PI * 2, x = Math.round(P.x + Math.cos(t) * rr), y = Math.round(P.y - 2 + Math.sin(t) * rr * 0.42); if (a % 2 === 0) b.set(x, y, rr > 28 ? PAL.W5 : PAL.W7); } }
  fill(b, P.x + 16, P.y - 4, pw('ALYI') + 8, 22, PAL.P2); fill(b, P.x + 16, P.y - 4, pw('ALYI') + 8, 1, PAL.W5); fill(b, P.x + 16, P.y + 17, pw('ALYI') + 8, 1, PAL.G4);
  pt(b, 'ALYI', P.x + 20, P.y - 1, PAL.N1); tiny(b, 'DEC 2022', P.x + 20, P.y + 9, PAL.I0);
  if (pin === 0) drawCheckPin(b, P.x, P.y);
  else if (pin === 1) { drawCheckPin(b, P.x + 5, P.y + 1, {rot: 0.5}); for (const [dx, dy] of [[-16, -30], [-20, -22], [14, -34], [20, -26]] as Array<[number, number]>) { b.set(P.x + dx, P.y + dy, PAL.N1); b.set(P.x + dx + Math.sign(dx), P.y + dy - 1, PAL.N1); } }
  else drawCheckPin(b, P.x + 6 + Math.round(pin * 0.08), P.y + pin, {rot: 0.6 + (Math.floor(pin / 12) % 2) * 0.9});
  // the link card, falling from the top of frame (only its lower part in the ECU): the cream block with ISS, the dark
  // body with the company's line; its lower-left corner lands on the pin's head
  const c = clamp(st.card, 0, 1), bot = Math.round(-10 + (P.y - 25 + 10) * c), x0 = P.x - 14;
  if (st.card >= 0) {
    fill(b, x0 + 4, bot - 116, W - x0, 120, PAL.N0);
    fill(b, x0, bot - 120, W - x0, 120, PAL.N3); fill(b, x0, bot - 1, W - x0, 1, PAL.N1);
    fill(b, x0, bot - 120, 104, 120, PAL.P2); fill(b, x0, bot - 120, 2, 120, PAL.W9);
    bpt(b, 'ISS', x0 + 30, bot - 66, PAL.N1);
    // (cropped to its plate at Act Three's fixes pass: two grey address bars, no line)
    fill(b, x0 + 118, bot - 72, 120, 4, PAL.N6); fill(b, x0 + 118, bot - 56, 72, 4, PAL.N5);
  }
  // the phone's bezel at the frame's edges (we are in close on its glass), the glass's faint glare
  fill(b, 0, 0, 10, RH, PAL.N0); fill(b, 10, 0, 2, RH, PAL.G2); fill(b, W - 10, 0, 10, RH, PAL.N0); fill(b, W - 12, 0, 2, RH, PAL.G2);
  for (let i = 0; i < 70; i++) for (let j = 0; j < 3; j++) { const x = 300 + i, y = 6 + Math.round(i * 0.45) + j; if (bayer(x, y) < 0.25) b.set(x, y, stepColor(b.get(x, y), 1)); }
};
/** 20.10's first framing (the review pass: the object match from 20.09): his phone face down on the desk in the dark,
 *  lying flat and horizontal where the clean rectangle lay on the lobby's carpet (the same shape, the same place in
 *  the frame), its edges lit when it buzzes; the art's top-down ECU follows */
export const faceDownMatch = (b: Buf, f: number, st: {lit?: boolean} = {}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, (x + y * 3) % 41 < 2 ? PAL.D1 : bayer(x, y) < 0.2 ? PAL.D1 : PAL.D0);
  // (drawCleanRect's footprint: x 156.., y 169..174, slanting 0.9 px a row; the phone a little thicker: its back and
  // its lit near edge)
  const L = 92;
  for (let j = 0; j < 9; j++) for (let i = 0; i < L; i++) { const X = 156 + i - Math.round(j * 0.9), Y = 176 - j; b.set(X, Y, j === 0 ? PAL.N0 : j === 8 ? PAL.G3 : PAL.G1); }
  ellipse(156 + L - 14 - 5, 172, 3, 2, b.ink(PAL.N0));
  if (st.lit) for (let i = -3; i < L + 3; i++) { const X = 156 + i, Y = 178; if (bayer(X, Y) < 0.6) b.set(X, Y, PAL.C3); if (bayer(X - 8, Y - 10) < 0.4) b.set(X - 8, 166, PAL.C3); }
  void f;
};
