// MR. MAS — Ep2 v1 art: a COPY of the intro's 2008 frame (studio/src/dev/meras/era2008.ts, not edited), for F2.1 (sc 19):
// "the intro's own 2008 frame: THE SLEEVE tosses the clicker, Mas catches it, the collars pop" (manifest SET-20). One
// addition: draw2008's `o.screen` paints over the big screen (TPOOL's map, its pins greying to LAST UPDATED 2012) before
// the camcorder's drift and the EARLY-WEB 16 remap, so it sits in the same frame.
// (Original header follows.) MR. MAS — meras: 2008. The TPOOL keynote, seen from an audience camcorder, in EARLY-WEB 16.
// Authored in master-palette colours and remapped (the palette literally scales with the era).
//   - a faceless turtleneck sleeve at stage left tosses the clicker; Mas (23) strides out of the right
//     wing into the spot and catches it. Collars pop on 4.1 (f180) and the hook's swung F (f190).
//   - the giant screen: the TPOOL app, a GPS breadcrumb that climbs like the curve, ending at a pin.
//   - camcorder: 1px handheld drift on twos; the shared era stamp "2008" is the year slate (no OSD).
import {Buf, rect, line, ellipse, poly, clamp, shiftBuf} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {blitImg} from '../../../../../shared/pixel/figure';
import {text, bigText, textWidth} from '../../../../../shared/pixel/font';
import {bayer4, bayer8} from '../../../../../shared/pixel/dither';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import {mas08, M08_FOOT} from './mas08';
import {MAS_STAGE_DY} from '../../../../../shared/pixel/cast/mas';
import {ERA08} from './palettes';
import {eraStamp} from '../../../../../shared/pixel/cast/era';
import {T} from './timeline';

const FLOOR = 196, EDGE = 238;
export const SCR = {x: 112, y: 14, w: 256, h: 128};

const dither = (b: Buf, x: number, y: number, w: number, h: number, a: number, c: number, thr = bayer4) => {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (thr(i, j) < a) b.set(i, j, c);
};

// ------------------------------------------------------------------ the set
const backdrop = (b: Buf) => {
  // a blue stage wash on the back wall, darker toward the top; black silhouettes read against it
  for (let y = 0; y < FLOOR; y++) for (let x = 0; x < b.w; x++) b.set(x, y, y < 18 ? PAL.N1 : y < 60 ? (bayer4(x, y) < (y - 18) / 42 ? PAL.N3 : PAL.N1) : PAL.N3);
  for (let x = 24; x < b.w; x += 48) for (let y = 30; y < FLOOR; y++) if (bayer4(x, y) < 0.6) b.set(x, y, PAL.N2);
  // the screen lifts the wall around it (stepped, ordered)
  for (let y = 0; y < FLOOR; y++)
    for (let x = 0; x < b.w; x++) {
      const dx = Math.max(0, Math.max(SCR.x - x, x - (SCR.x + SCR.w))), dy = Math.max(0, Math.max(SCR.y - y, y - (SCR.y + SCR.h)));
      const d = Math.hypot(dx, dy);
      if (d > 0 && d < 34 && bayer4(x, y) < (1 - d / 34) * 0.7) b.set(x, y, d < 12 ? PAL.N6 : PAL.N5);
    }
};

const floor = (b: Buf) => {
  rect(0, FLOOR, b.w, EDGE - FLOOR, b.ink(PAL.N3));
  for (let k = 0; k < 6; k++) { const y = FLOOR + Math.round(k * k * 1.2) + 2; if (y < EDGE) rect(0, y, b.w, 1, b.ink(PAL.N2)); }
  // the screen reflected in the glossy floor: flipped, dimmed, broken by an ordered dither
  for (let y = FLOOR + 1; y < EDGE - 2; y++)
    for (let x = SCR.x + 4; x < SCR.x + SCR.w - 4; x++) {
      const sy = SCR.y + SCR.h - 1 - (y - FLOOR) * 2;
      if (sy < SCR.y) continue;
      const fade = 1 - (y - FLOOR) / (EDGE - FLOOR);
      if (bayer4(x, y) < 0.45 * fade) b.set(x, y, PAL.N6);
    }
  // the spot on the floor where he stops: warm, stepped
  for (let y = FLOOR + 12; y < EDGE; y++)
    for (let x = 230; x < 372; x++) {
      const d = Math.hypot((x - 300) / 60, (y - 225) / 12);
      if (d < 1) { const lv = d < 0.4 ? PAL.W7 : d < 0.7 ? PAL.W6 : PAL.W4; if (d < 0.7 || bayer4(x, y) < (1 - d) * 2.5) b.set(x, y, lv); }
    }
  rect(0, EDGE, b.w, 1, b.ink(PAL.N5));
  rect(0, EDGE + 1, b.w, b.h - EDGE - 1, b.ink(PAL.N2));
};

export const WING_X = 440;
const wing = (b: Buf) => {
  // the masking curtain (stage right), narrower, and read as fabric: flat folds, each with a lit crest toward the
  // screen and a shadow trough (no dither), the leading edge rimmed by the screen
  rect(WING_X, 0, b.w - WING_X, EDGE, b.ink(PAL.N1));
  for (let x = WING_X + 2; x < b.w; x += 10) {
    rect(x, 0, 3, EDGE, b.ink(PAL.N3));
    rect(x, 0, 1, EDGE, b.ink(PAL.N4));
    rect(x + 5, 0, 2, EDGE, b.ink(PAL.N0));
  }
  rect(WING_X, 0, 1, EDGE, b.ink(PAL.N5));
  rect(WING_X + 1, 0, 1, EDGE, b.ink(PAL.N0));
};

// ------------------------------------------------------------------ the TPOOL screen (a keynote slide of the app)
/** breadcrumb path in screen-local coords: flat, then the knee */
const CRUMB: Array<[number, number]> = [];
for (let i = 0; i <= 44; i++) {
  const t = i / 44;
  // over the land, clear of the river (y 90-111): the flat runs at y 84, the knee climbs to the pin
  CRUMB.push([22 + t * 190, 84 - (Math.exp(t * 3.2) - 1) / (Math.exp(3.2) - 1) * 56]);
}
export const crumbCount = (g: number) => clamp(Math.floor((g - 172) * 2.6), 0, CRUMB.length);

const screen = (b: Buf, g: number) => {
  const {x, y, w, h} = SCR;
  rect(x - 3, y - 3, w + 6, h + 6, b.ink(PAL.N0));
  rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.G2));
  // map (2008 web-map colours: cream land, white streets on a loose grid, one avenue, park, river)
  rect(x, y, w, h, b.ink(PAL.P1));
  const road = (pts: number[], wd: number, col: number) => { for (let k = 0; k + 3 < pts.length; k += 2) for (let t = 0; t < wd; t++) line(x + pts[k], y + pts[k + 1] + t, x + pts[k + 2], y + pts[k + 3] + t, b.ink(col)); };
  for (const sx0 of [26, 58, 96, 131, 170, 203, 236]) road([sx0, 0, sx0 + 14, h], 2, PAL.P2);
  for (const sy0 of [16, 40, 66, 116]) road([0, sy0, 90, sy0 + 3, 180, sy0 - 2, w, sy0 + 2], 2, PAL.P2);
  // the avenue (grey edged)
  road([0, 70, 90, 62, 180, 50, w, 44], 4, PAL.G5);
  road([0, 71, 90, 63, 180, 51, w, 45], 2, PAL.P2);
  for (let i = 0; i < w; i++) { const ry = y + 96 + Math.round(Math.sin(i / 26) * 6); rect(x + i, ry, 1, 10, b.ink(PAL.C5)); rect(x + i, ry, 1, 1, b.ink(PAL.C7)); }
  // a park
  poly([x + 150, y + 50, x + 204, y + 46, x + 208, y + 84, x + 154, y + 88], b.ink(PAL.L1));
  for (let i = 0; i < 22; i++) b.set(x + 156 + ((i * 29 + (i * i) % 7) % 46), y + 53 + ((i * 13 + (i * i * 3) % 11) % 30), PAL.L3);
  // breadcrumb: the thread, as GPS dots, laid down as the render front passes
  const n = crumbCount(g);
  for (let i = 0; i < n; i += 1) {
    if (i % 2) continue;
    const [cx, cy] = CRUMB[i];
    // the brightest early-web cyan on a navy keyline, so the thread reads on the cream land
    rect(x + Math.round(cx) - 2, y + Math.round(cy) - 2, 4, 4, b.ink(PAL.N2));
    rect(x + Math.round(cx) - 1, y + Math.round(cy) - 1, 2, 2, b.ink(PAL.C6));
  }
  // the pin drops when the crumbs arrive (a 2-frame drop + 1px settle)
  if (n >= CRUMB.length) {
    const k = g - (172 + Math.ceil(CRUMB.length / 2.6));
    const dy = k < 1 ? -10 : k < 2 ? -3 : k < 3 ? 1 : 0;
    const [px, py] = CRUMB[CRUMB.length - 1];
    const X = x + Math.round(px), Y = y + Math.round(py);
    ellipse(X, Y + 1, 4, 1.5, b.ink(PAL.G4));
    poly([X - 4, Y - 11 + dy, X + 4, Y - 11 + dy, X + 4, Y - 7 + dy, X, Y + dy, X - 4, Y - 7 + dy], b.ink(PAL.R2));
    ellipse(X, Y - 9 + dy, 4.2, 4.2, b.ink(PAL.R3));
    rect(X - 1, Y - 10 + dy, 2, 2, b.ink(PAL.P2));
    // "where u at?" — the 2008 text bubble, tiny
    if (k >= 3) {
      const s = 'where u at?', tw = textWidth(s) + 8, bx = X - tw - 8, by2 = Y - 26;
      rect(bx, by2, tw, 12, b.ink(PAL.P2));
      rect(bx + 1, by2 + 12, tw - 2, 1, b.ink(PAL.G4));
      poly([bx + tw - 6, by2 + 11, bx + tw, by2 + 11, bx + tw + 4, by2 + 16], b.ink(PAL.P2));
      text(b, s, bx + 4, by2 + 3, PAL.N2);
    }
  }
  // the TPOOL panel: rounded white card, glossy wordmark with a reflection, a BETA starburst
  const px0 = x + 10, py0 = y + 10, pw = 104, ph = 38;
  rect(px0 + 2, py0 + 2, pw, ph, b.ink(PAL.G4));
  rect(px0 + 1, py0, pw - 2, ph, b.ink(PAL.P2)); rect(px0, py0 + 1, pw, ph - 2, b.ink(PAL.P2));
  const tmp = new Buf(96, 16, 0);
  bigText(tmp, 'TPOOL', 0, 0, 1);
  for (let j = 0; j < 14; j++) for (let i = 0; i < 96; i++) if (tmp.c[j * 96 + i]) {
    b.set(px0 + 8 + i, py0 + 6 + j, j < 6 ? PAL.C6 : j < 7 ? PAL.C7 : PAL.C4);
    // reflection: flipped under the baseline, broken by the dither, fading
    const ry = py0 + 6 + 14 + (13 - j) + 1;
    if (j > 6 && bayer4(px0 + 8 + i, ry) < (j - 6) / 14) b.set(px0 + 8 + i, ry, PAL.C7);
  }
  const sx = px0 + pw - 4, sy = py0 + 2;
  const star: number[] = [];
  for (let k = 0; k < 24; k++) { const a = (k / 24) * Math.PI * 2, r = k % 2 ? 9 : 13; star.push(sx + Math.cos(a) * r, sy + Math.sin(a) * r * 0.8); }
  poly(star, b.ink(PAL.R2));
  const star2 = star.map((v, i) => (i % 2 ? sy + (v - sy) * 0.84 : sx + (v - sx) * 0.84));
  poly(star2, b.ink(PAL.R3));
  text(b, 'BETA', sx - 9, sy - 3, PAL.P2);
};

// ------------------------------------------------------------------ the audience (we're in it)
const HEADS: Array<[number, number, number]> = [[16, 248, 11], [60, 243, 12], [108, 250, 11], [150, 244, 12], [200, 251, 11], [244, 246, 12], [352, 250, 12], [398, 244, 12], [444, 249, 12]];
const audience = (b: Buf, g: number) => {
  for (const [hx, hy, r] of HEADS) {
    // shoulders, then the head, rim-lit on top by the screen
    ellipse(hx, hy + r + 12, r * 2.1, r + 4, b.ink(PAL.N0));
    ellipse(hx, hy, r * 0.8, r, b.ink(PAL.N0));
    for (let i = -Math.round(r * 0.6); i <= Math.round(r * 0.6); i++) { const yy = hy - Math.round(Math.sqrt(Math.max(0, 1 - (i / (r * 0.8)) ** 2)) * r); b.set(hx + i, yy, i < 0 ? PAL.N7 : PAL.N5); b.set(hx + i, yy + 1, i < 0 ? PAL.N5 : PAL.N1); }
  }
  // two people filming: a flip phone and a little camcorder, screens glowing
  const bob = Math.floor(g / 6) % 2;
  rect(94, 214 + bob, 9, 13, b.ink(PAL.N0)); rect(95, 215 + bob, 7, 8, b.ink(PAL.C6)); rect(96, 216 + bob, 5, 2, b.ink(PAL.C8));
  rect(99, 227 + bob, 3, 20, b.ink(PAL.N0));
  rect(356, 218, 16, 10, b.ink(PAL.N0)); rect(358, 219, 8, 7, b.ink(PAL.C5)); rect(372, 221, 4, 5, b.ink(PAL.G3));
  rect(360, 228, 4, 20, b.ink(PAL.N0));
};

// ------------------------------------------------------------------ the sleeve + the clicker
const TOSS = 182, CATCH = T.take;
const sleeve = (b: Buf, g: number) => {
  // a black turtleneck sleeve reaching in from stage left. No face, no body: just the handoff.
  const out = g < TOSS + 2 ? 0 : Math.min(64, (Math.floor((g - TOSS - 2) / 2) + 1) * 12);
  const x1 = 58 - out, y = 176;
  if (x1 < -6) return;
  poly([-4, y - 3, x1, y - 1, x1, y + 7, -4, y + 9], b.ink(PAL.N0));
  line(-4, y - 3, x1, y - 1, b.ink(PAL.N6)); line(-4, y - 2, x1, y, b.ink(PAL.N2));
  rect(x1 - 1, y - 1, 2, 9, b.ink(PAL.G0)); // cuff
  // hand: open after the toss (a flick), holding the clicker before it
  const flick = g >= TOSS && g < TOSS + 2;
  poly([x1 + 1, y, x1 + 7, y - (flick ? 3 : 0), x1 + 8, y + 4, x1 + 1, y + 7], b.ink(PAL.S3));
  line(x1 + 2, y, x1 + 7, y - (flick ? 3 : 0), b.ink(PAL.S4));
  if (g < TOSS) { rect(x1 + 5, y - 2, 4, 7, b.ink(PAL.G4)); b.set(x1 + 6, y - 1, PAL.R3); }
};
/** the clicker in flight: an arc on twos from the sleeve to his raised hand */
const clickerFlight = (b: Buf, g: number, hand: [number, number]) => {
  if (g < TOSS || g >= CATCH) return;
  const t = (Math.floor((g - TOSS) / 2) * 2 + 1) / (CATCH - TOSS);
  const x0 = 63, y0 = 176;
  const x = Math.round(x0 + (hand[0] - x0) * t), y = Math.round(y0 + (hand[1] - y0) * t - Math.sin(t * Math.PI) * 58);
  const tumble = Math.floor((g - TOSS) / 2) % 2;
  // a short whole-pixel trail back along the arc, then the clicker itself (bright, so it reads in flight)
  const tp = Math.max(0, t - 0.12);
  const px = Math.round(x0 + (hand[0] - x0) * tp), py = Math.round(y0 + (hand[1] - y0) * tp - Math.sin(tp * Math.PI) * 58);
  line(px, py, x, y, b.ink(PAL.N6));
  if (tumble) { rect(x - 3, y - 2, 8, 5, b.ink(PAL.N0)); rect(x - 2, y - 1, 6, 3, b.ink(PAL.G6)); b.set(x + 2, y, PAL.R3); }
  else { rect(x - 2, y - 4, 5, 8, b.ink(PAL.N0)); rect(x - 1, y - 3, 3, 6, b.ink(PAL.G6)); b.set(x, y - 2, PAL.R3); }
};

// ------------------------------------------------------------------ Mas
const WALK0 = 168, WALK1 = 188;
export const masFoot = (g: number): number => {
  if (g <= WALK0) return WING_X - 4;
  const ff = WALK0 + Math.floor((g - WALK0) / 3) * 3; // position updates with the drawings (on threes)
  const t = clamp((ff - WALK0) / (WALK1 - WALK0), 0, 1);
  return Math.round(WING_X - 4 + (296 - (WING_X - 4)) * (1 - (1 - t) * (1 - t)));
};
const masDraw = (b: Buf, g: number) => {
  const collars: 0 | 1 | 2 = g < T.y08 ? 0 : g < T.pop2 ? 1 : 2;
  const walking = g >= WALK0 && g < WALK1;
  const walk = walking ? (Math.floor((g - WALK0) / 3) % 4) as 0 | 1 | 2 | 3 : -1;
  const pose = g >= CATCH ? 'present' : 'down';
  const img = mas08({arm: pose, lid: 0, mouth: g >= CATCH + 2 ? 'smile' : 'rest', look: g >= CATCH ? 1 : 0}, collars, walk);
  const fx = masFoot(g), fy = 226;
  blitImg(b, img, fx - M08_FOOT[0], fy - M08_FOOT[1], {clip: (x) => x < WING_X});
  // spring follow-through on the pop frames: the collar tips overshoot one pixel
  return [fx - M08_FOOT[0] + 5, fy - M08_FOOT[1] + 16 + MAS_STAGE_DY] as [number, number];
};

// ------------------------------------------------------------------ camcorder
const JITTER: Array<[number, number]> = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0], [-1, 0], [-1, -1], [0, -1], [1, 0], [0, 1], [-1, 1], [0, 0]];
/** the year slate: the shared era stamp, "2008" (SCRIPT §3.4, f180-194). The camcorder OSD (▶ PLAY, the tape
 *  counter, the real date) is cut: self-labelling (v2.0 cut list) and a third on-screen language in two seconds. */
const osd = (b: Buf, g: number) => eraStamp(b, '2008', g - T.y08, {text: PAL.P2, plate: PAL.N0, rule: PAL.C6});

/** Paint the 2008 frame (EARLY-WEB 16) for global frame g. */
export const draw2008 = (b: Buf, g: number, o: {screen?: (b: Buf, r: {x: number; y: number; w: number; h: number}) => void} = {}) => {
  const w = new Buf(b.w, b.h, PAL.N1);
  backdrop(w);
  screen(w, g);
  o.screen?.(w, SCR);
  floor(w);
  const hand = masDraw(w, g);
  wing(w);
  sleeve(w, g);
  clickerFlight(w, g, hand);
  audience(w, g);
  // handheld: 1px drift on twos, a 2px bump when the first collar pops
  const j = JITTER[Math.floor(g / 2) % JITTER.length];
  const bump = g === T.y08 ? 2 : g === T.y08 + 1 ? 1 : 0;
  shiftBuf(b, w, j[0], j[1] + bump);
  osd(b, g);
  applyPalette(b, ERA08);
};
