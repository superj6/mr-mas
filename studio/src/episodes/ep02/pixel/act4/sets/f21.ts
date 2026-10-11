// MR. MAS — Ep2 v1 · act4 · F2.1's 2008 stage (sc 19.13-19.14). The shots pass, 2026-10-09. The frame is the intro's
// own 2008 keynote (art/f21/era2008 draw2008, the art pass's copy of studio/src/dev/meras: the sleeve's toss, the catch,
// the collars, the camcorder, EARLY-WEB16), imported; its screen hook (o.screen) is painted here with what F2.1 needs
// (the art's stage2008 painted only the greying pins):
//   stage08(b, g, st)    st.splash: before his click, the screen is a TPOOL title slide whose one red pin stands where the
//                        2006 end card's pin stood (240, 70: the match on the pin); after it, the map in its own
//                        colours (the frame's own) with nine pins, `grey` of them greyed (no cause claimed), and its
//                        corner LAST UPDATED 2012 (`last`)
import {Buf, ellipse, poly, rect, line, clamp, shiftBuf} from '../../../../../shared/pixel/px';
import {blitImg} from '../../../../../shared/pixel/figure';
import {bayer4} from '../../../../../shared/pixel/dither';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {mas08, M08_FOOT} from '../../art/f21/mas08';
import {MAS_STAGE_DY} from '../../../../../shared/pixel/cast/mas';
import {ERA08} from '../../art/f21/palettes';
import {PAL} from '../../../../../shared/pixel/palette';
import {bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {draw2008, SCR, WING_X} from '../../art/f21/era2008';
import {fill, pt, pw} from '../../art/kit';

/** the GPS pin (2006 web red), its tip at (x, y): the same drawing as the 2006 end card's (art/sets/elppa gpsPin) */
const gpsPin = (b: Buf, x: number, y: number) => { poly([x - 4, y - 10, x + 4, y - 10, x + 4, y - 6, x, y, x - 4, y - 6], b.ink(PAL.R2)); ellipse(x, y - 8, 4, 4, b.ink(PAL.R3)); fill(b, x - 1, y - 9, 2, 2, PAL.P2); };
const PINS: Array<[number, number]> = [[30, 30], [62, 54], [100, 26], [140, 70], [180, 40], [210, 90], [44, 100], [120, 104], [228, 30]];
export const stage08 = (b: Buf, g: number, st: {splash?: boolean; grey?: number; last?: boolean} = {}) => {
  draw2008(b, g, {screen: (w, r) => {
    if (st.splash) {
      // the title slide: white, the wordmark, one red pin where the 2006 card's pin was
      fill(w, r.x, r.y, r.w, r.h, PAL.P2);
      fill(w, r.x, r.y + r.h - 18, r.w, 18, PAL.C5);
      const tw = bigTextWidth('TPOOL');
      bigText(w, 'TPOOL', r.x + Math.round((r.w - tw) / 2), r.y + 82, PAL.C4);
      gpsPin(w, 240, 70);
      return;
    }
    PINS.forEach(([px, py], i) => {
      const grey = i < (st.grey ?? 0); const X = r.x + px, Y = r.y + py;
      poly([X - 3, Y - 8, X + 3, Y - 8, X + 3, Y - 5, X, Y, X - 3, Y - 5], w.ink(grey ? PAL.G4 : PAL.R2)); ellipse(X, Y - 6, 3, 3, w.ink(grey ? PAL.G5 : PAL.R3));
    });
    if (st.last) { const s = 'LAST UPDATED 2012'; fill(w, r.x + r.w - pw(s) - 10, r.y + r.h - 14, pw(s) + 8, 11, PAL.P2); pt(w, s, r.x + r.w - pw(s) - 6, r.y + r.h - 12, PAL.G3); }
  }});
};

// ============================================================================================ 19.13 since the fixes pass
// (2026-10-10; the episode review's minor: "THE SLEEVE is a flat black arm from the left edge, and Mas is tiny and
// cropped at the right edge by the curtain. The clicker toss and the popped collars don't read.") The intro's frame is
// re-staged on 19.13's own clock from copies of era2008's parts (the art file is imported only; its draw2008 runs every
// part on the intro's one clock, f150-256, a 1 s montage beat): Mas strides out to his mark (in frame from the shot's
// first frame, at the mark by k24); THE SLEEVE reaches out of a stage-left wing (shaped now: the turtleneck sleeve
// tapering to a ribbed cuff, a lit crest and two folds, the hand round the clicker) and tosses it in a high arc on twos
// with a short trail (20 frames, its apex in front of the white slide); he catches it on `clicker_catch`; the
// camcorder pushes in on him in two held steps (1.5x, 2x) and both collars pop where they can be seen. The pin on the
// slide (the match from 19.12) is untouched in the wide.

const FLOOR8 = 196, EDGE8 = 238;
const backdrop8 = (b: Buf) => {
  for (let y = 0; y < FLOOR8; y++) for (let x = 0; x < b.w; x++) b.set(x, y, y < 18 ? PAL.N1 : y < 60 ? (bayer4(x, y) < (y - 18) / 42 ? PAL.N3 : PAL.N1) : PAL.N3);
  for (let x = 24; x < b.w; x += 48) for (let y = 30; y < FLOOR8; y++) if (bayer4(x, y) < 0.6) b.set(x, y, PAL.N2);
  for (let y = 0; y < FLOOR8; y++) for (let x = 0; x < b.w; x++) {
    const dx = Math.max(0, Math.max(SCR.x - x, x - (SCR.x + SCR.w))), dy = Math.max(0, Math.max(SCR.y - y, y - (SCR.y + SCR.h)));
    const d = Math.hypot(dx, dy);
    if (d > 0 && d < 34 && bayer4(x, y) < (1 - d / 34) * 0.7) b.set(x, y, d < 12 ? PAL.N6 : PAL.N5);
  }
};
const floor8 = (b: Buf) => {
  rect(0, FLOOR8, b.w, EDGE8 - FLOOR8, b.ink(PAL.N3));
  for (let k = 0; k < 6; k++) { const y = FLOOR8 + Math.round(k * k * 1.2) + 2; if (y < EDGE8) rect(0, y, b.w, 1, b.ink(PAL.N2)); }
  for (let y = FLOOR8 + 1; y < EDGE8 - 2; y++) for (let x = SCR.x + 4; x < SCR.x + SCR.w - 4; x++) {
    const sy = SCR.y + SCR.h - 1 - (y - FLOOR8) * 2; if (sy < SCR.y) continue;
    if (bayer4(x, y) < 0.45 * (1 - (y - FLOOR8) / (EDGE8 - FLOOR8))) b.set(x, y, PAL.N6);
  }
  for (let y = FLOOR8 + 12; y < EDGE8; y++) for (let x = 230; x < 372; x++) {
    const d = Math.hypot((x - 300) / 60, (y - 225) / 12);
    if (d < 1) { const lv = d < 0.4 ? PAL.W7 : d < 0.7 ? PAL.W6 : PAL.W4; if (d < 0.7 || bayer4(x, y) < (1 - d) * 2.5) b.set(x, y, lv); }
  }
};
/** the masking curtains: stage right (the art's) and, new, a narrow one at stage left for the sleeve to come out of */
const WING_L = 26;
const wings8 = (b: Buf) => {
  rect(WING_X, 0, b.w - WING_X, EDGE8, b.ink(PAL.N1));
  for (let x = WING_X + 2; x < b.w; x += 10) { rect(x, 0, 3, EDGE8, b.ink(PAL.N3)); rect(x, 0, 1, EDGE8, b.ink(PAL.N4)); rect(x + 5, 0, 2, EDGE8, b.ink(PAL.N0)); }
  rect(WING_X, 0, 1, EDGE8, b.ink(PAL.N5)); rect(WING_X + 1, 0, 1, EDGE8, b.ink(PAL.N0));
  rect(0, 0, WING_L, EDGE8, b.ink(PAL.N1));
  for (let x = 0; x < WING_L - 2; x += 10) { rect(x + 3, 0, 3, EDGE8, b.ink(PAL.N3)); rect(x + 5, 0, 1, EDGE8, b.ink(PAL.N4)); rect(x, 0, 2, EDGE8, b.ink(PAL.N0)); }
  rect(WING_L - 1, 0, 1, EDGE8, b.ink(PAL.N5)); rect(WING_L - 2, 0, 1, EDGE8, b.ink(PAL.N0));
};
const HEADS8: Array<[number, number, number]> = [[16, 248, 11], [60, 243, 12], [108, 250, 11], [150, 244, 12], [200, 251, 11], [244, 246, 12], [352, 250, 12], [398, 244, 12], [444, 249, 12]];
const audience8 = (b: Buf) => {
  for (const [hx, hy, r] of HEADS8) { ellipse(hx, hy + r + 12, r * 2.1, r + 4, b.ink(PAL.N0)); ellipse(hx, hy, r * 0.8, r, b.ink(PAL.N0)); }
};
/** THE SLEEVE: a black turtleneck sleeve out of the stage-left wing, its cuff at x1 (`out` 0..1 how far it reaches),
 *  tapering, a lit crest on top and two folds; a ribbed cuff; the hand round the clicker (`hold`) or open after the
 *  flick (`flick` the flick frames) */
const sleeve8 = (b: Buf, out: number, hold: boolean, flick: boolean) => {
  if (out <= 0) return;
  const y = 172, x0 = WING_L - 4, x1 = Math.round(WING_L + 6 + out * 46);
  const half = (x: number) => 6 - ((x - x0) / Math.max(1, x1 - x0)) * 2;       // 6 px at the wing, 4 at the cuff
  for (let x = x0; x <= x1; x++) {
    const h = half(x), top = Math.round(y - h + (x - x0) * 0.04), bot = Math.round(y + h + (x - x0) * 0.04);
    for (let yy = top; yy <= bot; yy++) b.set(x, yy, yy === top ? PAL.N5 : yy === top + 1 ? PAL.N2 : yy === bot ? PAL.N0 : PAL.N1);
  }
  // two folds where the sleeve bunches (a short dark crease and its lit lip)
  for (const fx of [x0 + Math.round((x1 - x0) * 0.35), x0 + Math.round((x1 - x0) * 0.7)]) { line(fx, y - 3, fx + 2, y + 3, b.ink(PAL.N0)); line(fx + 1, y - 3, fx + 3, y + 2, b.ink(PAL.N3)); }
  // the ribbed cuff
  for (let i = 0; i < 4; i++) for (let yy = y - 4; yy <= y + 5; yy++) b.set(x1 - 3 + i, yy, i % 2 ? PAL.N0 : PAL.N2);
  // the hand: the back of the hand and the knuckles, the thumb over the clicker; open and flicked up after the toss
  const hx = x1 + 1;
  if (flick) {
    poly([hx, y - 3, hx + 7, y - 7, hx + 9, y - 4, hx + 2, y + 3], b.ink(PAL.S3));
    line(hx + 2, y - 4, hx + 8, y - 7, b.ink(PAL.S5)); line(hx + 1, y + 3, hx + 4, y + 5, b.ink(PAL.S3));
  } else {
    rect(hx, y - 3, 7, 7, b.ink(PAL.S3)); rect(hx, y - 3, 7, 1, b.ink(PAL.S5)); rect(hx + 6, y - 2, 2, 5, b.ink(PAL.S2));
    for (let i = 0; i < 3; i++) b.set(hx + 7, y - 2 + i * 2, PAL.S5);
    if (hold) { rect(hx + 3, y - 7, 5, 8, b.ink(PAL.N0)); rect(hx + 4, y - 6, 3, 6, b.ink(PAL.G6)); b.set(hx + 5, y - 5, PAL.R3); rect(hx + 1, y - 2, 4, 2, b.ink(PAL.S4)); }
  }
};
const clicker8 = (b: Buf, x: number, y: number, tumble: number) => {
  if (tumble % 2) { rect(x - 4, y - 3, 10, 6, b.ink(PAL.N0)); rect(x - 3, y - 2, 8, 4, b.ink(PAL.G6)); b.set(x + 3, y - 1, PAL.R3); }
  else { rect(x - 3, y - 5, 6, 10, b.ink(PAL.N0)); rect(x - 2, y - 4, 4, 8, b.ink(PAL.G6)); b.set(x - 1, y - 3, PAL.R3); }
};
const JIT8: Array<[number, number]> = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0], [-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [0, 0]];
/** [W → M] 19.13 on its own clock: k the shot's frame, c the catch (`clicker_catch`). Draws the frame (its splash
 *  slide with the matched pin), then pushes in on Mas after the catch */
export const stageToss = (b: Buf, k: number, c: number) => {
  const w = new Buf(b.w, b.h, PAL.N1);
  backdrop8(w);
  // the screen's bezel and the splash slide (stage08's: white, TPOOL, the pin where the 2006 card's pin was)
  rect(SCR.x - 3, SCR.y - 3, SCR.w + 6, SCR.h + 6, w.ink(PAL.N0)); rect(SCR.x - 2, SCR.y - 2, SCR.w + 4, 1, w.ink(PAL.G2));
  fill(w, SCR.x, SCR.y, SCR.w, SCR.h, PAL.P2); fill(w, SCR.x, SCR.y + SCR.h - 18, SCR.w, 18, PAL.C5);
  const tw = bigTextWidth('TPOOL'); bigText(w, 'TPOOL', SCR.x + Math.round((SCR.w - tw) / 2), SCR.y + 82, PAL.C4);
  gpsPin(w, 240, 70);
  floor8(w);
  // Mas: out of the wing at k0 (most of him already clear of it), at his mark (the spot, 296) by k24, striding on threes
  const t = clamp(Math.floor(k / 3) * 3 / 24, 0, 1), fx = Math.round(412 - (412 - 296) * (1 - (1 - t) * (1 - t))), fy = 226;
  const walk = (k < 24 ? Math.floor(k / 3) % 4 : -1) as -1 | 0 | 1 | 2 | 3;
  const caught = k >= c;
  const pop1 = c + 14, pop2 = c + 22;
  const collars = (k < pop1 ? 0 : k < pop2 ? 1 : 2) as 0 | 1 | 2;
  const img = mas08({arm: caught ? 'present' : 'down', lid: 0, mouth: k >= c + 2 ? 'smile' : 'rest', look: caught ? 1 : 0}, collars, walk);
  blitImg(w, img, fx - M08_FOOT[0], fy - M08_FOOT[1], {clip: (x) => x < WING_X});
  const hand: [number, number] = [296 - M08_FOOT[0] + 5, fy - M08_FOOT[1] + 16 + MAS_STAGE_DY];
  wings8(w);
  // THE SLEEVE: reaches out of the stage-left wing (k12-20), holds, flicks at the toss, withdraws
  const toss = c - 20;
  const out = k < 12 ? 0 : k < toss ? Math.min(1, (Math.floor((k - 12) / 2) + 1) / 4) : k < toss + 6 ? 1 : Math.max(0, 1 - (Math.floor((k - toss - 6) / 2) + 1) / 4);
  sleeve8(w, out, k < toss, k >= toss && k < toss + 4);
  // the clicker in flight: a high arc on twos from the sleeve's hand to his raised hand, a short dotted trail behind it
  if (k >= toss && k < c) {
    const x0 = WING_L + 6 + 46 + 6, y0 = 166;
    const at = (u: number): [number, number] => [Math.round(x0 + (hand[0] - x0) * u), Math.round(y0 + (hand[1] - y0) * u - Math.sin(u * Math.PI) * 74)];
    const u = (Math.floor((k - toss) / 2) * 2 + 1) / (c - toss);
    for (let q = 1; q <= 3; q++) { const uu = u - q * 0.07; if (uu > 0) { const [px, py] = at(uu); rect(px, py, 2, 2, w.ink(q === 1 ? PAL.N6 : PAL.N5)); } }
    const [x, y] = at(u);
    clicker8(w, x, y, Math.floor((k - toss) / 2));
  }
  audience8(w);
  // the camcorder's drift starts after the cut has settled (held for the first 14 frames, as the intro frame's own
  // clock held at f150: a one-pixel drift on the cut's own frames counted as a second flash at the match)
  const j = k < 14 ? JIT8[0] : JIT8[Math.floor(k / 2) % JIT8.length], bump = k === pop1 ? 2 : k === pop1 + 1 ? 1 : 0;
  const frame = new Buf(b.w, b.h, PAL.N1);
  shiftBuf(frame, w, j[0], j[1] + bump);
  applyPalette(frame, ERA08);
  // the camcorder's push after the catch, in two held steps, round his chest (his head, the clicker up, the collars)
  const z = k < c + 6 ? 1 : k < c + 10 ? 1.5 : 2;
  b.c.set(frame.c);
  if (z === 1) return;
  const cx = 296, cy = 168, sw = b.w / z, sh = 203 / z, ox = Math.round(cx - sw / 2), oy = Math.round(cy - sh / 2);
  for (let y = 0; y < 203; y++) for (let x = 0; x < b.w; x++) b.set(x, y, frame.get(clamp(ox + Math.floor(x / z), 0, b.w - 1), clamp(oy + Math.floor(y / z), 0, b.h - 1)));
};
