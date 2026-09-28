// MR. MAS — Ep1 v3.5 · Act Four art (the p-act4 pass, v3.5 round; NEW, additive, opt-in). The pieces of script draft
// 8.4's Act Four (proposal-v35 §40–§56) that no kit draws yet, composed from the show's existing drawings where one
// exists and drawn here where none does. Nothing in shared/pixel, act4/animatic or the earlier art files is edited.
//   suitePhone35(b, f, st)       v32-S1.13's end and v35-41.05: kits/act4-v32 drawSuitePhone's afternoon backdrop, phone
//                                and fingers, with any screen (st.screen) and the room at night (st.night 0..3)
//   incomingTile(b, x, y, w, c, k)  a call / message notification on his phone (the post card kit's colours): an avatar
//                                disc with an initial (generic: no photo), the caller, a sub-line; k = frames since it
//                                landed (2 held steps)
//   WAR_CALLERS                  the war room's callers, in the order they land (the lock's onscreen words; the lawyer a
//                                grey briefcase, never named)
//   drawDeskPhone(b, f, st)      v35-41.01 [ECU] his phone face up on the suite desk from above, the calls stacking tile
//                                over tile (newest on top); each new tile a step of light on the desk around it (a
//                                monotonic pool: it never steps back down, so it can't flash); his glass (its water
//                                flat), the hotel notepad and the MACROSOFT check's pen beside it
//   drawSuiteCall2S(b, f, st)    v35-41.02 / 41.03 [2S] v31-S1.01b's framing (the suite's back layer soft, MAS's bust at
//                                the left third turned right, warm) with his laptop's screen on the right: a call tile
//   drawCallField(b, f, tile)    v35-41.03 [SCR] the call app's dark field with one tile opened big (GERG_POV_TILE)
//   gergCallTile / tasyaCallTile the two callers' tiles: GERG still (no keys, no green glow: his laptop's green is taken
//                                out of his light), TASYA warm on top (cast/tasya-phone, his phone away, the ring off frame)
//   drawVoiceTiles(b, f, tiles)  v35-41.04 the money's calls, camera off: avatar tiles cascading over each other on the
//                                pulse, the older ones a rung down (speaking: the ring and a level; lit: joined, muted;
//                                ringing: the call screen's pulses and its two buttons)
//   drawNotepad(b, f, st)        v35-41.06 [INSERT] the hotel notepad at night, his three words stacked in his pen's ink
//                                (NEW COMPANY · MACROSOFT · BACK, none underlined: no choice shown), the pen, the phone
//                                lighting again at the frame's edge
//   drawPlaneTray(b, f, st)      v35-42.01 [INSERT] a small plane in daylight: the window, the tray with his glass and a
//                                paper cup, the notepad on his knee (TERMS, 1. GERG, a second line we can't read), the
//                                bump: everything jolts; the cup's coffee tilts, his water line stays one flat row
//   vhsTrack(b, f, a)            a VHS tracking disturbance over the frame in place (a = 0..1): rows torn sideways in
//                                bands, a rolling noise bar (mid greys, never white: no flash), the bottom head-switch
//   drawTpool(b, f, st)          v35-43.01 / 43.02 TPOOL, 240p (T2a): drawn at 240 x 102 and doubled, in the intro's
//                                2008 palette (dev/meras ERA08, EARLY-WEB 16) with the camcorder's drift on twos: a
//                                frosted glass wall with the TPOOL decal on its door; behind it staff SILHOUETTES pass one
//                                sheet across the table to board SILHOUETTES (TO THE BOARD its only words); the second
//                                time the door opens and a young silhouette in two popped collars walks out, a CEO
//                                nameplate under his arm. Silhouettes only: no faces, no names, no reasons
//   drawNelehProps(b, f, st)     v31-S3.00p's insert: her desk from above, two printed pages she squares twice (his Dec 4
//                                post; her paper, p. 30, one line highlighted); her hands at their edges
//   drawAlyiAlone(b, f, st)      v35-49A.01: the bullpen at night after the walkout (rooms/bullpen 'walkout' with no
//                                crowd, graded to night, the windows' city at night), ALYI alone at the windows with his
//                                phone lit ('wide'); then [MCU] in person at the glass, the users line going up off the
//                                top of it, his hand near it, not on it, the hearts landing on his phone ('mcu')
import {Buf, rect, line, ellipse, poly, bayer, hash, clamp} from '../../../../../shared/pixel/px';
import {PAL, stepColor, familyOf, lightness} from '../../../../../shared/pixel/palette';
import {text, textWidth, bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {pt, pw, pwrap} from '../../../../../shared/pixel/kits/uitype';
import {tiny, tinyWidth} from '../../../../../shared/pixel/rooms/kit-b';
import {drawPost, postLines} from '../../../../../shared/pixel/kits/post-card';
import type {PostSpec} from '../../../../../shared/pixel/kits/post-card';
import {holdFingers} from '../../../../../shared/pixel/rooms/bay-bridge';
import {suiteLayers} from '../../../../../shared/pixel/rooms/vegas-suite';
import {masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../../../shared/pixel/cast/mas';
import type {MasMouth} from '../../../../../shared/pixel/cast/mas';
import {drawGergMediumTile, GERG_POV_TILE} from '../../../../../shared/pixel/cast/gerg-medium';
import {tileFrame, callLabel, speakRing, micIcon, bustInTile, tileClip} from '../../../../../shared/pixel/cast/calltile';
import {tasyaPhonePortrait} from '../../../../../shared/pixel/cast/tasya-phone';
import {alyiLook} from '../../../../../shared/pixel/cast/alyi-v5';
import {drawAlyiStand, ALYI_STAND_DEFAULT} from '../../../../../shared/pixel/cast/alyi-speak';
import {drawBullpen} from '../../../../../shared/pixel/rooms/bullpen';
import {drawBayNight} from '../../../../../shared/pixel/rooms/bullpen-launch';
import {faceKey} from '../../../../../shared/pixel/kits/face-light';
import {applyPalette} from '../../../../../shared/pixel/palettes';
import type {Viseme} from '../../../../../shared/pixel/cast/talk';
import {ERA08} from '../../../../../dev/meras/palettes';
import {drawBust, soft, vignette} from '../../../act4/animatic/framing';

const RH = 203;
const put = (b: Buf, x: number, y: number, c: number) => { if (x >= 0 && x < b.w && y >= 0 && y < RH) b.set(x, y, c); };
/** a colour's luminance 0..1 (for the night grades) */
const lumOf = (c: number) => (0.2126 * ((c >> 16) & 255) + 0.7152 * ((c >> 8) & 255) + 0.0722 * (c & 255)) / 255;
const NIGHT_RAMP = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5, PAL.N6];

// ================================================================== his phone in the suite (v32-S1.13, v35-41.05)
/** drawSuitePhone's geometry (kits/act4-v32: the phone at 150, 6, 180 x 197; the screen inset 7, 10) */
export const SUITE_PHONE = {px: 150, py: 6, pw: 180, ph: 197, sx: 157, sy: 16, sw: 166};
export interface SuitePhone35 { night?: 0 | 1 | 2 | 3; screen: (b: Buf, sx: number, sy: number, sw: number) => void; lights?: boolean }
/** the kit's afternoon backdrop, phone and fingers, any screen, and the kit's fall to night (the screen stays lit);
 *  `lights`: at night the Strip comes on in the window (a scatter of held warm and red points, never flickering) */
export const suitePhone35 = (b: Buf, f: number, st: SuitePhone35) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const t = x / 480 + (bayer(x, y) - 0.5) * 0.25;
    b.set(x, y, y > 150 ? (t < 0.5 ? PAL.D3 : PAL.D2) : t < 0.35 ? PAL.W7 : t < 0.6 ? PAL.W6 : t < 0.8 ? PAL.W5 : PAL.D4);
  }
  for (let k = 0; k < 9; k++) { const x = 20 + k * 52 + Math.round(hash(k, 1, 7) * 20), h = 30 + Math.round(hash(k, 2, 7) * 50); for (let y = 150 - h; y < 150; y++) for (let i = 0; i < 16; i++) if (bayer(x + i, y) < 0.5) b.set(x + i, y, stepColor(b.get(x + i, y), -1)); }
  const {px, py, pw: pw2, ph, sx, sy, sw} = SUITE_PHONE;
  rect(px + 4, py + 4, pw2, ph, b.ink(PAL.D1));
  rect(px, py, pw2, ph + 10, b.ink(PAL.N0)); rect(px + 1, py + 1, pw2 - 2, ph + 10, b.ink(PAL.G1)); rect(px + 1, py, pw2 - 2, 1, b.ink(PAL.G4));
  rect(sx, sy, sw, RH - sy, b.ink(PAL.N1));
  st.screen(b, sx, sy, sw);
  holdFingers(b, px + 2, py + 118, 4, [PAL.S1, PAL.S3, PAL.S4, PAL.S5]);
  const n = st.night ?? 0;
  if (n) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (x >= sx && x < sx + sw && y >= sy) continue;
    const c0 = b.get(x, y);
    if (n === 1) { b.set(x, y, stepColor(c0, -1)); continue; }
    b.set(x, y, NIGHT_RAMP[Math.max(0, Math.min(5, Math.floor(lumOf(c0) * 7) - (n === 3 ? 2 : 0)))]);
  }
  if (n >= 2 && st.lights) for (let i = 0; i < 70; i++) { // the Strip at night through the glass, both sides of the phone
    const x = Math.floor(hash(i, 3, 91) * 470), y = 30 + Math.floor(hash(i, 4, 91) * 118);
    if (x > px - 6 && x < px + pw2 + 6) continue;
    const c = hash(i, 5, 91) < 0.25 ? PAL.R2 : hash(i, 6, 91) < 0.5 ? PAL.W6 : PAL.W4;
    put(b, x, y, c); if (hash(i, 7, 91) < 0.3) put(b, x + 1, y, stepColor(c, -1));
  }
};
/** the compose box's caret, solid (v32-S1.13's deleting: the line eaten back to it); `s` = the text as typed */
export const phoneCaret = (b: Buf, s: string) => {
  const {sx, sy, sw} = SUITE_PHONE;
  const ls = pwrap(s, sw - 10);
  rect(sx + 6 + pw(ls[ls.length - 1] ?? ''), sy + 18 + Math.max(0, ls.length - 1) * 10, 1, 8, b.ink(PAL.C7));
};

// ================================================================== the calls (the war room)
export interface Caller { name: string; initial: string; accent: number; bg: number; sub: string; icon?: 'case' }
/** the order they land (v35-41.01's onscreen words; the lawyer a grey briefcase, no name) */
export const WAR_CALLERS: Caller[] = [
  {name: 'GERG', initial: 'G', accent: PAL.L3, bg: PAL.L1, sub: 'incoming call'},
  {name: 'TASYA · MACROSOFT', initial: 'T', accent: PAL.C6, bg: PAL.C2, sub: 'missed call'},
  {name: 'AUHSOJ', initial: 'A', accent: PAL.U4, bg: PAL.U2, sub: '6 messages'},
  {name: 'THE FIRST CHECK', initial: 'F', accent: PAL.W6, bg: PAL.W3, sub: 'missed call'},
  {name: 'FOUNDER MODE', initial: 'F', accent: PAL.R3, bg: PAL.R1, sub: 'incoming call'},
  {name: 'NOR', initial: 'N', accent: PAL.F5, bg: PAL.F3, sub: 'missed call'},
  {name: 'LAWYER', initial: '', accent: PAL.G5, bg: PAL.G2, sub: 'voicemail', icon: 'case'},
];
export const INCOMING_H = 24;
/** one notification: k = frames since it landed (0: half open, 1+: whole) */
export const incomingTile = (b: Buf, x: number, y: number, w: number, c: Caller, k = 9) => {
  const h = k >= 1 ? INCOMING_H : 12, yy = y + (INCOMING_H - h);
  rect(x - 1, yy - 1, w + 2, h + 2, b.ink(PAL.N0));
  rect(x, yy, w, h, b.ink(PAL.N3)); rect(x, yy, w, 1, b.ink(c.accent));
  if (k < 1) return;
  const ax = x + 11, ay = y + 12;
  ellipse(ax, ay, 7, 7, b.ink(c.bg)); ellipse(ax, ay - 1, 6, 6, b.ink(stepColor(c.bg, 1)));
  if (c.icon === 'case') { rect(ax - 4, ay - 2, 9, 6, b.ink(PAL.G5)); rect(ax - 2, ay - 4, 5, 2, b.ink(PAL.G5)); rect(ax - 1, ay - 3, 3, 1, b.ink(c.bg)); rect(ax - 4, ay, 9, 1, b.ink(PAL.G3)); }
  else pt(b, c.initial, ax - Math.floor(pw(c.initial) / 2), ay - 3, PAL.P2);
  pt(b, c.name, x + 22, y + 4, PAL.P2);
  pt(b, c.sub, x + 22, y + 13, c.sub.startsWith('incoming') ? c.accent : PAL.G5);
};

// ---- v35-41.01: his phone face up on the suite desk
export interface DeskPhoneState { lands: number[]; k: number }
export const DESK_PHONE = {x: 176, y: 4, w: 128, h: 196};
export const drawDeskPhone = (b: Buf, f: number, st: DeskPhoneState) => {
  const {k} = st;
  const n = st.lands.filter((t) => k >= t).length;
  // the desk: dark walnut from above in the afternoon, the window's warm glare from the left
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const plank = Math.floor((y + Math.floor(x * 0.04)) / 34);
    let c = plank % 2 ? PAL.D2 : PAL.D3;
    if ((y + Math.floor(x * 0.04)) % 34 === 0) c = PAL.D1;
    else if (hash(x >> 3, y, plank + 11) < 0.05) c = PAL.D4;
    const g = 1 - x / 150 + (bayer(x, y) - 0.5) * 0.5;
    if (g > 0.5) c = stepColor(c, 1); if (g > 0.85) c = g > 1.05 ? PAL.W4 : PAL.W3;
    b.set(x, y, c);
  }
  // the pool of the screen's light on the wood: it grows a step with each call, and never steps back
  const P = DESK_PHONE, cx = P.x + P.w / 2, cy = P.y + P.h / 2;
  const R = [0, 88, 104, 120, 136, 150, 164, 176][Math.min(7, n)];
  if (n) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = Math.hypot((x - cx) / R, (y - cy) / (R * 0.82));
    if (d > 1) continue;
    const s = d < 0.5 && n >= 4 ? 2 : d < 0.8 || bayer(x, y) < (1 - d) * 4 ? 1 : 0;
    if (s) b.set(x, y, stepColor(b.get(x, y), s));
  }
  // his glass, from above: the rim, the water (flat: one ring of light), its shadow
  const gx = 78, gy = 54;
  for (let y = gy - 22; y <= gy + 24; y++) for (let x = gx - 22; x <= gx + 24; x++) { // its shadow, then the clear glass over the wood
    const ds = Math.hypot((x - gx - 3) / 21, (y - gy - 4) / 20), d = Math.hypot((x - gx) / 20, (y - gy) / 19);
    if (d <= 1) { const c = b.get(x, y); b.set(x, y, d > 0.9 ? PAL.G5 : d > 0.8 ? stepColor(c, 2) : familyOf(c)?.[0] === 'D' ? (bayer(x, y) < 0.5 ? PAL.C1 : stepColor(c, 1)) : stepColor(c, 1)); }
    else if (ds <= 1) b.set(x, y, stepColor(b.get(x, y), -1));
  }
  for (let a = 0; a < 40; a++) { const t = Math.PI * (0.95 + a / 60); put(b, Math.round(gx + Math.cos(t) * 16), Math.round(gy + Math.sin(t) * 15), PAL.C7); } // the flat water's one ring of light
  for (let a = 0; a < 12; a++) { const t = Math.PI * (1.6 + a / 40); put(b, Math.round(gx + Math.cos(t) * 19), Math.round(gy + Math.sin(t) * 18), PAL.C9); }
  // the hotel notepad and the MACROSOFT check's pen on it (41.06 comes back to them)
  const nx = 352, ny = 30;
  rect(nx + 3, ny + 4, 104, 136, b.ink(PAL.D1));
  rect(nx, ny, 104, 136, b.ink(PAL.P1)); rect(nx, ny, 104, 14, b.ink(PAL.P0)); rect(nx, ny + 14, 104, 1, b.ink(PAL.D3));
  hotelCrest(b, nx + 52, ny + 7, PAL.D3);
  pen(b, 360, 172, 468, 124);
  // the phone
  rect(P.x + 4, P.y + 5, P.w, P.h, b.ink(PAL.D0));
  rect(P.x, P.y, P.w, P.h, b.ink(PAL.N0)); rect(P.x + 1, P.y + 1, P.w - 2, P.h - 2, b.ink(PAL.G1)); rect(P.x + 1, P.y + 1, P.w - 2, 1, b.ink(PAL.G3));
  const sx = P.x + 5, sy = P.y + 10, sw = P.w - 10, sh = P.h - 20;
  rect(sx, sy, sw, sh, b.ink(n ? PAL.N2 : PAL.N1));
  pt(b, '4:09 PM', sx + 4, sy + 3, PAL.G5);
  rect(sx + sw - 16, sy + 4, 10, 5, b.ink(PAL.G5)); rect(sx + sw - 15, sy + 5, 6, 3, b.ink(PAL.L3));
  // the stack: the newest on top; the others step down a tile, in two held steps
  const clip = new Buf(sw, sh, PAL.N2);
  for (let i = n - 1; i >= 0; i--) {
    const age = n - 1 - i; // 0 = newest
    let y = 14 + age * (INCOMING_H + 3);
    const since = k - st.lands[n - 1];
    if (since < 1 && age > 0) y -= Math.round((INCOMING_H + 3) / 2);
    incomingTile(clip, 3, y, sw - 6, WAR_CALLERS[i], age === 0 ? since : 9);
  }
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { if (y < 13) continue; b.set(sx + x, sy + y, clip.get(x, y)); }
};
/** a generic hotel's crest: a small star over two rules (no name, no brand) */
export const hotelCrest = (b: Buf, cx: number, cy: number, col: number) => {
  const S = ['..#..', '.###.', '#####', '.#.#.'];
  S.forEach((r, j) => { for (let i = 0; i < 5; i++) if (r[i] === '#') put(b, cx - 2 + i, cy - 3 + j, col); });
  rect(cx - 10, cy + 2, 21, 1, b.ink(col));
};
/** the MACROSOFT check's pen lying from (x0, y0) (its tip) to (x1, y1): a black barrel, a steel band, the slate clip */
export const pen = (b: Buf, x0: number, y0: number, x1: number, y1: number) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / n), y = Math.round(y0 + ((y1 - y0) * i) / n);
    const u = i / n;
    const c = u < 0.08 ? PAL.G5 : u < 0.12 ? PAL.G6 : PAL.N1;
    put(b, x + 1, y + 2, PAL.D0); put(b, x, y + 1, u < 0.08 ? PAL.G3 : PAL.N0); put(b, x, y, c); put(b, x, y - 1, u < 0.12 ? c : PAL.G2);
    if (u > 0.62 && u < 0.9) put(b, x + 1, y - 2, u > 0.64 && u < 0.88 ? PAL.C3 : PAL.C2);
  }
};

// ---- v35-41.02 / 41.03: the 2S at his laptop, and the call's own field
export type TileDraw = (b: Buf, x: number, y: number, w: number, h: number) => void;
export const LAPTOP_2S = {x: 262, y: 22, w: 200, h: 122};
const back2S: {buf: Buf | null} = {buf: null};
export interface Suite2SState { mas: {mouth?: MasMouth; lid?: 0 | 1 | 2}; tile: TileDraw }
export const drawSuiteCall2S = (b: Buf, f: number, st: Suite2SState) => {
  if (!back2S.buf) { // the suite's back layer (v31-S1.01b's), soft; held
    const L = suiteLayers({f: 0, laptop: 1, truckX: null});
    const bg = new Buf(480, 270, PAL.N0); bg.c.set(L.back.c.subarray(0, 480 * RH));
    soft(bg, 2); vignette(bg, 170, 1);
    back2S.buf = bg;
  }
  b.c.set(back2S.buf.c.subarray(0, 480 * RH), 0);
  // the laptop, three-quarters to him: its screen's back edge, the bezel, the deck under it
  const T = LAPTOP_2S;
  rect(T.x - 7, T.y - 7, T.w + 14, T.h + 14, b.ink(PAL.N0)); rect(T.x - 6, T.y - 6, T.w + 12, T.h + 12, b.ink(PAL.G1)); rect(T.x - 6, T.y - 6, T.w + 12, 1, b.ink(PAL.G3));
  st.tile(b, T.x, T.y, T.w, T.h);
  poly([T.x - 14, T.y + T.h + 7, T.x + T.w + 10, T.y + T.h + 7, T.x + T.w + 24, T.y + T.h + 20, T.x - 22, T.y + T.h + 20], b.ink(PAL.G2));
  rect(T.x - 20, T.y + T.h + 19, T.w + 42, 2, b.ink(PAL.N0)); rect(T.x - 14, T.y + T.h + 7, T.w + 24, 1, b.ink(PAL.G4));
  // its light on the desk under it (a rung, dithered)
  for (let y = T.y + T.h + 21; y < RH; y++) for (let x = T.x - 30; x < T.x + T.w + 30; x++) if (bayer(x, y) < 0.35 - (y - T.y - T.h - 21) / 80) put(b, x, y, stepColor(b.get(x, y), 1));
  // MAS at the left third, turned to it (v31-S1.01b's bust and light): still
  drawBust(b, masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, light: 'warm', mouth: st.mas.mouth ?? 'rest', lid: st.mas.lid ?? 0}), {third: 'L', dx: -20, flip: true});
};
/** the call app's field, full frame (his laptop's screen: the dot grid), one tile opened big */
export const drawCallField = (b: Buf, f: number, tile: TileDraw) => {
  for (let j = 0; j < RH; j++) for (let i = 0; i < 480; i++) b.set(i, j, (i % 8 === 0 && j % 8 === 0) ? PAL.N2 : PAL.N0);
  const T = GERG_POV_TILE;
  rect(T.x - 1, T.y - 1, T.w + 2, T.h + 2, b.ink(PAL.N2));
  tile(b, T.x, T.y, T.w, T.h);
  // the call's own bar under it: the timer and the red end button
  pt(b, '0:0' + (3 + (Math.floor(f / 24) % 7)), T.x + 2, T.y + T.h + 6, PAL.G4);
  rect(T.x + T.w / 2 - 10, T.y + T.h + 5, 20, 9, b.ink(PAL.R2)); rect(T.x + T.w / 2 - 5, T.y + T.h + 9, 10, 1, b.ink(PAL.P2));
};
/** green light out of a tile (GERG's laptop glow, taken out: "no green glow"): L rungs to the grey rung beside them */
const degreen = (b: Buf, x: number, y: number, w: number, h: number) => {
  const G = [PAL.G0, PAL.G1, PAL.G2, PAL.G3];
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) { const fm = familyOf(b.get(i, j)); if (fm && fm[0] === 'L') b.set(i, j, G[fm[1]]); }
};
export interface CallerTileState { mouth: Viseme; speaking: boolean; lid?: 0 | 1 | 2; f: number }
/** GERG, still: his hands off the keys, looking into the lens (head 'up' / 'talk'), no green glow */
export const gergCallTile = (st: CallerTileState): TileDraw => (b, x, y, w, h) => {
  drawGergMediumTile(b, x, y, w, h, {head: st.speaking ? 'talk' : 'up', mouth: st.mouth, lid: st.lid ?? 1, look: 0}, {f: st.f, typing: false, cx: 0.5});
  degreen(b, x, y, w, h);
  tileFrame(b, x, y, w, h);
  callLabel(b, x + 3, y + h - 13, 'GERG MOCKBRAN', {mic: true});
  if (st.speaking) speakRing(b, x, y, w, h, PAL.G6);
};
/** TASYA at his office (Macrosoft slate behind him, a warm lamp on him): the smile that doesn't move, lip-synced */
export const tasyaCallTile = (st: CallerTileState): TileDraw => (b, x, y, w, h) => {
  const clip = tileClip(x, y, w, h);
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
    const u = (i - x) / w;
    let c = (i - x) % 40 < 2 ? PAL.N4 : u < 0.25 ? PAL.N3 : PAL.N2; // a slate wall, its panel seams
    if (j - y > h * 0.62) c = PAL.N1; // his desk's dark edge
    if (u > 0.7 && j - y < h * 0.55 && (i - x) % 40 >= 2) c = bayer(i, j) < 0.4 ? PAL.C1 : PAL.N3; // a window's cool light
    b.set(i, j, c);
  }
  for (let j = y + 6; j < y + h * 0.6; j++) for (let i = x + 6; i < x + 40; i++) { const d = Math.hypot((i - x - 18) / 26, (j - y - 20) / 30); if (d < 1 && bayer(i, j) < (1 - d) * 0.6) b.set(i, j, stepColor(b.get(i, j), 1)); }
  const img = tasyaPhonePortrait({mouth: st.mouth, lid: st.lid ?? 0, brow: 'warm', arms: 'none', read: false, jangle: 0});
  bustInTile(b, img, x, y, w, h, 0.52, 6);
  void clip;
  tileFrame(b, x, y, w, h);
  callLabel(b, x + 3, y + h - 13, 'TASYA · MACROSOFT', {mic: true});
  if (st.speaking) speakRing(b, x, y, w, h, PAL.C6);
};

// ---- v35-41.04: the money's calls, camera off
export interface VoiceTile { name: string; initial: string; accent: number; bg: number; state: 'speaking' | 'lit' | 'ringing'; k: number; level?: number }
export const VOICE_AT: Array<[number, number]> = [[20, 10], [112, 34], [200, 58]];
export const VOICE_W = 250, VOICE_H = 132;
export const drawVoiceTiles = (b: Buf, f: number, tiles: VoiceTile[]) => {
  for (let j = 0; j < RH; j++) for (let i = 0; i < 480; i++) b.set(i, j, (i % 8 === 0 && j % 8 === 0) ? PAL.N2 : PAL.N0);
  tiles.forEach((t, n) => {
    const [x, y] = VOICE_AT[n], w = VOICE_W, h = VOICE_H;
    rect(x + 3, y + 3, w, h, b.ink(PAL.N0));
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) b.set(i, j, bayer(i, j) < 0.2 + (j - y) / h * 0.3 ? PAL.N3 : PAL.N2);
    const cx = x + Math.round(w / 2), cy = y + 54;
    if (t.state === 'ringing') { // the call screen's pulses, on 6s, and its two buttons
      const ring = 34 + (Math.floor(t.k / 6) % 3) * 8;
      for (let a = 0; a < 90; a++) { const q = (a / 90) * Math.PI * 2; if (a % 3 !== 0) put(b, Math.round(cx + Math.cos(q) * ring), Math.round(cy + Math.sin(q) * ring * 0.9), PAL.N5); }
      ellipse(cx - 44, y + h - 22, 8, 8, b.ink(PAL.R2)); ellipse(cx + 44, y + h - 22, 8, 8, b.ink(PAL.L2));
      rect(cx - 48, y + h - 22, 9, 1, b.ink(PAL.P2)); rect(cx + 40, y + h - 23, 9, 2, b.ink(PAL.P2));
      pt(b, 'incoming call…', cx - Math.floor(pw('incoming call…') / 2), y + 8, PAL.G5);
    }
    ellipse(cx, cy, 24, 24, b.ink(PAL.N0)); ellipse(cx, cy, 23, 23, b.ink(t.bg)); ellipse(cx, cy - 2, 20, 20, b.ink(stepColor(t.bg, 1)));
    bigText(b, t.initial, cx - Math.floor(bigTextWidth(t.initial) / 2), cy - 7, PAL.P2);
    if (t.state !== 'ringing') {
      tileFrame(b, x, y, w, h);
      callLabel(b, x + 3, y + h - 13, t.name, {mic: t.state === 'speaking', muted: t.state === 'lit'});
      pt(b, 'camera off', x + w - 6 - pw('camera off'), y + h - 11, PAL.N6);
      if (t.state === 'speaking') {
        speakRing(b, x, y, w, h, t.accent);
        const lv = t.level ?? 0; // the level: three bars beside the avatar
        for (let i = 0; i < 3; i++) { const bh = Math.max(1, Math.min(10, lv * (3 + i * 3))); rect(cx + 32 + i * 5, cy + 6 - bh, 3, bh, b.ink(t.accent)); }
      }
      if (t.state === 'lit') { speakRing(b, x, y, w, h, t.accent); micIcon(b, x + w - 12, y + 5, true); }
    } else {
      rect(x, y, w, 1, b.ink(t.accent));
      pt(b, t.name, cx - Math.floor(pw(t.name) / 2), cy + 32, PAL.P2);
    }
    // an older tile under a newer one steps down a rung
    if (n < tiles.length - 1) for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) b.set(i, j, stepColor(b.get(i, j), -1));
  });
};

// ---- v35-41.06: the hotel notepad at night
export interface NotepadState { k: number; ring: number | null }
const NOTE_WORDS = ['NEW COMPANY', 'MACROSOFT', 'BACK'];
/** his hand-lettering: the display face in the pen's ink, each letter a pixel off its line (a held jitter) */
export const handText = (b: Buf, s: string, x: number, y: number, n: number, col: number, seed: number) => {
  let cx = x;
  for (let i = 0; i < Math.min(n, s.length); i++) {
    const ch = s[i];
    if (ch !== ' ') bigText(b, ch, cx, y + (hash(i, seed, 5) < 0.3 ? 1 : 0) - (hash(i, seed, 6) < 0.15 ? 1 : 0), col);
    cx += bigTextWidth(ch + 'A') - bigTextWidth('A') + (ch === ' ' ? 0 : 0);
  }
  return cx;
};
export const drawNotepad = (b: Buf, f: number, st: NotepadState) => {
  const {k} = st;
  // the suite desk at night: dark wood, the lamp's warm pool from the right
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c = Math.floor((y + x * 0.04) / 34) % 2 ? PAL.D1 : PAL.D2;
    const d = Math.hypot((x - 420) / 300, (y - 40) / 200);
    if (d < 1 && bayer(x, y) < (1 - d) * 1.6) c = stepColor(c, 1);
    if (d < 0.55 && bayer(x, y) < (0.55 - d) * 3) c = PAL.W2;
    b.set(x, y, c);
  }
  const nx = 118, ny = 4, nw = 236, nh = 199;
  rect(nx + 4, ny + 5, nw, nh, b.ink(PAL.D0));
  for (let y = ny; y < ny + nh; y++) for (let x = nx; x < nx + nw; x++) b.set(x, y, bayer(x, y) < 0.12 + (x - nx) / nw * 0.3 ? PAL.P2 : PAL.P1);
  rect(nx, ny, nw, 18, b.ink(PAL.P0)); rect(nx, ny + 18, nw, 1, b.ink(PAL.D3));
  hotelCrest(b, nx + nw / 2, ny + 9, PAL.D3);
  for (let j = 0; j < 6; j++) rect(nx + 10, ny + 46 + j * 26, nw - 20, 1, b.ink(stepColor(PAL.P1, -1)));
  const INK = PAL.I0;
  const lastN = k < 2 ? 1 : k < 5 ? 2 : k < 8 ? 3 : 4; // BACK is written as we arrive (its letters on 3s)
  NOTE_WORDS.forEach((w, i) => handText(b, w, nx + 22, ny + 30 + i * 26, i < 2 ? 99 : lastN, INK, i + 3));
  // the pen: at the last letter while it's written, then laid down beside the words
  const bx = nx + 22 + bigTextWidth('BACK'.slice(0, lastN)) + 1, by = ny + 30 + 52 + 12;
  if (k < 9) pen(b, bx, by, bx + 92, by - 62);
  else pen(b, nx + 150, ny + 150, nx + 262, ny + 104);
  // the phone lights again at the frame's right edge: its lit edge and its cool spill on the wood (monotonic)
  if (st.ring !== null && k >= st.ring) {
    const s = Math.min(2, 1 + Math.floor((k - st.ring) / 4));
    rect(466, 60, 14, 110, b.ink(PAL.N0)); rect(468, 64, 12, 102, b.ink(s > 1 ? PAL.C6 : PAL.C4));
    for (let y = 40; y < 190; y++) for (let x = 400; x < 466; x++) { const d = Math.hypot((x - 470) / 70, (y - 115) / 80); if (d < 1 && bayer(x, y) < (1 - d) * (s * 0.5)) b.set(x, y, stepColor(b.get(x, y), 1)); }
  }
};

// ---- v35-42.01: the plane
export interface PlaneState { k: number; bump: number; gerg: number; scrawl: number }
export const drawPlaneTray = (b: Buf, f: number, st: PlaneState) => {
  const {k} = st;
  const kb = k - st.bump;
  const jolt = kb < 0 ? 0 : kb < 2 ? 2 : kb < 4 ? -1 : kb < 6 ? 1 : 0; // the bump: held drawings, whole px
  const w = new Buf(480, 270, PAL.P1);
  // the cabin wall: pale plastic, a soft shade toward the floor
  for (let y = 0; y < RH + 4; y++) for (let x = 0; x < 480; x++) w.set(x, y, y < 110 ? (y < 8 ? PAL.P0 : PAL.P1) : PAL.G5);
  // the window: an oval of sky with a cloud, its bright light
  const wx = 70, wy = 50;
  ellipse(wx, wy, 46, 38, w.ink(PAL.P0)); ellipse(wx, wy, 42, 34, w.ink(PAL.G6));
  for (let y = wy - 32; y < wy + 32; y++) for (let x = wx - 40; x < wx + 40; x++) {
    if (Math.hypot((x - wx) / 38, (y - wy) / 30) > 1) continue;
    const t = (y - wy + 30) / 60;
    let c = t < 0.55 ? PAL.C6 : PAL.C7;
    const cl = Math.hypot((x - wx - 8 - ((f >> 3) % 4)) / 30, (y - wy - 8) / 8);
    if (cl < 1) c = cl < 0.6 ? PAL.P2 : PAL.C8;
    w.set(x, y, c);
  }
  for (let y = 0; y < 110; y++) for (let x = 110; x < 300; x++) { const d = Math.hypot((x - 110) / 190, (y - 50) / 60); if (d < 0.45) w.set(x, y, PAL.P2); }
  // the tray table (grey plastic), his glass, a paper cup (someone's coffee)
  rect(0, 118, 300, 3, w.ink(PAL.G6)); rect(0, 121, 300, 26, w.ink(PAL.G4)); rect(0, 147, 300, 3, w.ink(PAL.G2));
  const gx = 196, gy = 88;
  rect(gx, gy, 14, 32, w.ink(PAL.G6)); rect(gx + 1, gy, 12, 31, w.ink(PAL.C7)); rect(gx + 1, gy, 12, 9, w.ink(PAL.P2));
  rect(gx + 1, gy + 9, 12, 1, w.ink(PAL.C8)); // his water line: one flat row, always
  rect(gx + 13, gy, 1, 32, w.ink(PAL.G4));
  const cxp = 120, cyp = 96; // the paper cup: its coffee tilts and slops in the bump
  poly([cxp, cyp, cxp + 20, cyp, cxp + 18, cyp + 24, cxp + 2, cyp + 24], w.ink(PAL.P2)); rect(cxp, cyp, 20, 2, w.ink(PAL.P0));
  const tilt = kb >= 0 && kb < 10 ? [2, -2, 1, -1, 1, 0, 1, 0, 0, 0][kb] : 0;
  for (let i = 1; i < 19; i++) { const yy = cyp + 3 + Math.round(((i - 9.5) / 9.5) * tilt); w.set(cxp + i, yy, PAL.D3); w.set(cxp + i, yy + 1, PAL.D2); }
  if (kb >= 0 && kb < 8) { w.set(cxp + 22, cyp + 2 - (kb >> 1), PAL.D3); w.set(cxp - 2, cyp + 3 - (kb >> 2), PAL.D3); }
  // his knee and the notepad on it (the hotel's, torn off), his hand and the pen writing
  poly([280, 203, 300, 128, 480, 110, 480, 203], w.ink(PAL.N3)); line(300, 128, 480, 110, w.ink(PAL.N4));
  const px = 312, py = 104;
  poly([px, py + 8, px + 150, py, px + 158, py + 100, px + 6, py + 112], w.ink(PAL.D1));
  poly([px - 2, py + 5, px + 148, py - 3, px + 156, py + 97, px + 4, py + 109], w.ink(PAL.P2));
  hotelCrest(w, px + 76, py + 6, PAL.P0);
  const INK = PAL.I0;
  handText(w, 'TERMS', px + 12, py + 14, 9, INK, 11);
  rect(px + 12, py + 30, bigTextWidth('TERMS') + 2, 1, w.ink(INK));
  const gn = st.gerg < 0 ? 0 : Math.min(7, 1 + Math.floor(st.gerg / 2));
  const gEnd = handText(w, '1. GERG', px + 16, py + 40, gn, INK, 12);
  // the second line we can't read: a scrawl growing on 2s
  const sn = st.scrawl < 0 ? 0 : Math.min(60, Math.floor(st.scrawl / 2) * 4);
  for (let i = 0; i < sn; i++) { const x = px + 16 + i, y = py + 70 + Math.round(Math.sin(i * 0.9) * 2 + Math.sin(i * 0.31) * 1.5); w.set(x, y, INK); if (i % 7 < 2) w.set(x, y - 1, INK); }
  const tip: [number, number] = st.scrawl >= 0 ? [px + 16 + sn, py + 70] : st.gerg >= 0 && gn < 7 ? [gEnd, py + 50] : [px + 120, py + 60];
  // his hand round the pen (below and right of its tip, off the words), the sleeve running off the frame's right edge
  const hx = tip[0] + 10, hy = tip[1] + 6;
  poly([hx + 14, hy - 2, hx + 40, hy - 14, 480, hy - 30, 480, hy + 24, hx + 30, hy + 20], w.ink(PAL.N3)); line(hx + 14, hy - 2, 480, hy - 32, w.ink(PAL.N4));
  ellipse(hx + 8, hy + 2, 12, 9, w.ink(PAL.S2)); ellipse(hx + 7, hy + 1, 11, 8, w.ink(PAL.S4)); ellipse(hx + 5, hy - 2, 7, 4, w.ink(PAL.S5));
  for (let i = 0; i < 3; i++) ellipse(hx - 2 + i * 3, hy + 8 + (i === 1 ? 1 : 0), 2, 2, w.ink(PAL.S3)); // the curled fingers under
  pen(w, tip[0], tip[1], tip[0] + 34, tip[1] - 24);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, w.get(x, clamp(y - jolt, 0, RH + 3)));
};

// ================================================================== the VHS tracking disturbance
export const vhsTrack = (b: Buf, f: number, a: number) => {
  if (a <= 0) return;
  const src = b.clone();
  const bandY = RH - ((f * 11) % (RH + 40)), bandH = Math.round(6 + a * 18);
  for (let y = 0; y < RH; y++) {
    const inBand = y >= bandY && y < bandY + bandH;
    const tear = inBand ? Math.round((hash(y, f, 31) - 0.5) * 40 * a) : hash(y >> 2, f >> 1, 32) < a * 0.18 ? Math.round((hash(y, f, 33) - 0.3) * 14 * a) : 0;
    for (let x = 0; x < 480; x++) {
      let c = src.get(clamp(x - tear, 0, 479), y);
      if (inBand && hash(x >> 1, y, f) < 0.35 + a * 0.3) c = hash(x, y, f + 1) < 0.5 ? PAL.G4 : PAL.G3;
      b.set(x, y, c);
    }
  }
  const hs = Math.round(3 + a * 5); // the head-switch at the foot
  for (let y = RH - hs; y < RH; y++) { const sh = Math.round((hash(y, f, 34) - 0.2) * 24); for (let x = 479; x >= 0; x--) b.set(x, y, x - sh >= 0 && x - sh < 480 ? src.get(x - sh, y) : PAL.N1); }
};

// ================================================================== TPOOL, 240p (v35-43.01 / 43.02)
export interface TpoolState {
  /** the sheet's slide across the table, 0..1 (held steps) */
  sheet: number;
  /** the door: 0 shut, 1 ajar, 2 open */
  door: 0 | 1 | 2;
  /** the young silhouette walking out: x in the 240 grid, or null; its stride drawing */
  mas: {x: number; step: number} | null;
  /** tracking: 0 clean .. 1 torn */
  track: number;
  /** a sheet already on the board's side (the first pass, in the second shot) */
  first?: boolean;
}
const LW = 240, LH = 102;
/** a silhouette at 240p: head and shoulders (seated, cut by the table) or standing; flat dark, a lighter edge where the
 *  frosted glass lights it from behind */
const silhouette = (b: Buf, x: number, footY: number, o: {tall: number; w: number; frost: (x: number, y: number) => boolean; lean?: number}) => {
  const hy = footY - o.tall;
  for (let y = hy; y < footY; y++) for (let x0 = -o.w; x0 <= o.w; x0++) {
    const t = (y - hy) / o.tall;
    const half = t < 0.18 ? Math.round(o.w * 0.42 * Math.sqrt(Math.max(0, 1 - ((t - 0.09) / 0.09) ** 2))) : t < 0.24 ? Math.round(o.w * 0.3) : o.w;
    if (Math.abs(x0) > half) continue;
    const xx = x + x0 + (t > 0.24 && o.lean ? Math.round(o.lean * (t - 0.24)) : 0);
    b.set(xx, y, o.frost(xx, y) ? (Math.abs(x0) === half ? PAL.N4 : PAL.N3) : (Math.abs(x0) === half ? PAL.G2 : PAL.N1));
  }
};
export const drawTpool = (fb: Buf, f: number, st: TpoolState) => {
  const b = new Buf(LW, LH, PAL.P1);
  const FROST = {y0: 18, y1: 56}, GLASS = {x0: 18, x1: 222, y0: 8, y1: 88}, DOOR = {x0: 150, x1: 186};
  const frost = (x: number, y: number) => y >= FROST.y0 && y < FROST.y1 && x >= GLASS.x0 && x < GLASS.x1;
  // the office wall (2008 beige), the carpet
  // (flat fills only: the drift moves this picture under the palette's screen-fixed dither, so any dither drawn here
  // would move with it and flicker)
  for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) b.set(x, y, y > 88 ? PAL.G3 : PAL.P0);
  // the conference room behind the glass: its back wall, the table, lit from inside
  for (let y = GLASS.y0; y < GLASS.y1; y++) for (let x = GLASS.x0; x < GLASS.x1; x++) b.set(x, y, y > 70 ? PAL.G3 : PAL.P1);
  // the board's side (right) seated, the staff (left) standing; the table between
  const TY = 66;
  silhouette(b, 44, 86, {tall: 58, w: 10, frost});
  silhouette(b, 66, 86, {tall: 62, w: 10, frost, lean: 6});
  silhouette(b, 88, 86, {tall: 56, w: 9, frost});
  silhouette(b, 176, 76, {tall: 44, w: 10, frost});
  silhouette(b, 200, 76, {tall: 42, w: 10, frost});
  rect(40, TY, 176, 5, b.ink(PAL.D3)); rect(40, TY, 176, 1, b.ink(PAL.D4)); rect(44, TY + 5, 4, 14, b.ink(PAL.D2)); rect(208, TY + 5, 4, 14, b.ink(PAL.D2));
  // the frosted band over the glass (the silhouettes' heads soften into it), then the glass's frame and the door
  for (let y = FROST.y0; y < FROST.y1; y++) for (let x = GLASS.x0; x < GLASS.x1; x++) { // frosted: the shapes behind go soft and pale
    const c = b.get(x, y), fm = familyOf(c);
    const dark = fm && fm[0] === 'N' || fm && fm[0] === 'G' && fm[1] <= 2;
    b.set(x, y, dark ? PAL.N7 : stepColor(c, 1));
  }
  for (let y = FROST.y0; y < FROST.y1; y++) for (let x = GLASS.x0 + 1; x < GLASS.x1 - 1; x++) { // their edges diffuse a pixel
    const c = b.get(x, y), r = b.get(x + 1, y);
    if (c !== PAL.N7 && r === PAL.N7) b.set(x, y, PAL.N8);
  }
  rect(GLASS.x0 - 2, GLASS.y0 - 2, GLASS.x1 - GLASS.x0 + 4, 2, b.ink(PAL.G4)); rect(GLASS.x0 - 2, GLASS.y0, 2, GLASS.y1 - GLASS.y0, b.ink(PAL.G4)); rect(GLASS.x1, GLASS.y0, 2, GLASS.y1 - GLASS.y0, b.ink(PAL.G4));
  rect(GLASS.x0, FROST.y0 - 1, GLASS.x1 - GLASS.x0, 1, b.ink(PAL.G5)); rect(GLASS.x0, FROST.y1, GLASS.x1 - GLASS.x0, 1, b.ink(PAL.G5));
  // the door in the glass: its frame; open, the leaf swings out toward us (a dark edge-on leaf)
  rect(DOOR.x0 - 1, GLASS.y0, 1, GLASS.y1 - GLASS.y0, b.ink(PAL.G2)); rect(DOOR.x1, GLASS.y0, 1, GLASS.y1 - GLASS.y0, b.ink(PAL.G2));
  if (st.door > 0) {
    const lw = st.door === 1 ? 10 : 4; // the leaf's face narrowing as it swings
    for (let y = GLASS.y0; y < GLASS.y1; y++) for (let x = DOOR.x1 - lw; x < DOOR.x1; x++) b.set(x, y, y >= FROST.y0 && y < FROST.y1 ? PAL.P2 : PAL.G5);
    rect(DOOR.x1 - lw - 1, GLASS.y0, 1, GLASS.y1 - GLASS.y0, b.ink(PAL.G3));
  }
  // the TPOOL decal on the door's frost (a pin and the name), where the door is (on the leaf once it swings)
  const dx = st.door === 0 ? DOOR.x0 + 6 : -99;
  if (dx > 0) {
    ellipse(dx + 3, 26, 3, 3, b.ink(PAL.L2)); b.set(dx + 3, 26, PAL.P2); b.set(dx + 3, 30, PAL.L2);
    tiny(b, 'TPOOL', dx + 8, 24, PAL.L1);
  }
  // the sheet: across the table from the staff's hands to the board's (legible: TO THE BOARD)
  const drawSheet = (sx: number, sy: number) => {
    rect(sx - 1, sy - 1, 54, 12, b.ink(PAL.G4)); rect(sx, sy, 52, 10, b.ink(PAL.P2));
    tiny(b, 'TO THE BOARD', sx + 3, sy + 3, PAL.N1);
  };
  if (st.first) drawSheet(150, TY - 12);
  const s = clamp(st.sheet, 0, 1);
  drawSheet(Math.round(72 + s * 78), TY - 12 + (s > 0 && s < 1 ? 0 : 0));
  // a staff hand on it while it slides (a dark sleeve reaching from the left silhouette)
  if (s < 0.25) { const hx = Math.round(72 + s * 78); rect(66, TY - 8, hx - 64, 3, b.ink(PAL.N1)); } // the push
  else if (s >= 1) { rect(199, TY - 9, 7, 3, b.ink(PAL.N1)); } // taken: a board hand on its far edge
  // the young silhouette walking out of the door toward us and past (two popped collars, the CEO nameplate)
  if (st.mas) {
    const {x, step} = st.mas, top = 38;
    const ink = (xx: number, yy: number, c = PAL.N0) => b.set(xx, yy, c);
    for (let y = 0; y < 10; y++) for (let dx = -4; dx <= 4; dx++) if ((dx / 4.4) ** 2 + ((y - 4.5) / 5) ** 2 <= 1) ink(x + dx, top + y); // the head
    rect(x - 1, top + 10, 3, 2, (xx, yy) => ink(xx, yy));
    for (let y = 12; y < 36; y++) { const hw = y < 15 ? 8 : y < 31 ? 7 : 6; for (let dx = -hw; dx <= hw; dx++) ink(x + dx, top + y, Math.abs(dx) === hw ? PAL.G1 : PAL.N0); } // the torso
    const STRIDE: Array<[number, number]> = [[-3, 3], [-1, 1], [3, -3], [1, -1]];
    const [la, lb] = STRIDE[step % 4];
    for (let y = 36; y < 60; y++) { // two legs, their stride opening toward the feet
      const t = (y - 36) / 24;
      for (const [cx0, o] of [[-3, la], [3, lb]] as Array<[number, number]>) { const cx = x + cx0 + Math.round(o * t); for (let dx = -2; dx <= 1; dx++) ink(cx + dx, top + y); }
    }
    // the two popped collars standing up at the neck: coral inside, green out (the silhouette's one colour)
    for (const side of [-1, 1]) { // each collar a point standing up off the shoulder line, the green outside the coral
      for (const [dx, dy] of [[2, 12], [2, 11], [3, 11], [3, 10], [3, 9]]) ink(x + side * dx, top + dy, PAL.W6);
      for (const [dx, dy] of [[4, 12], [4, 11], [5, 11], [5, 10], [5, 9], [6, 9], [6, 8]]) ink(x + side * dx, top + dy, PAL.L3);
    }
    // the near arm down his side, the nameplate clamped under it: CEO
    for (let y = 14; y < 32; y++) { ink(x + 8, top + y); ink(x + 9, top + y); }
    rect(x + 7, top + 20, 18, 8, b.ink(PAL.W5)); rect(x + 8, top + 21, 16, 6, b.ink(PAL.W7));
    tiny(b, 'CEO', x + 11, top + 22, PAL.N1);
    for (let y = 19; y < 29; y++) { ink(x + 7, top + y); ink(x + 8, top + y); } // his hand over the plate's near edge
  }
  // the 2008 palette (the intro's), the camcorder's drift on twos, then doubled into the frame
  // (the drift moves the picture under the palette's ordered dither, which stays fixed to the screen, as the intro's
  // era2008 does: shift, then remap; remapping first would flip the dither's phase on every drift step, a flicker)
  const JIT: Array<[number, number]> = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0], [-1, 0], [-1, -1], [0, -1]];
  const [jx, jy] = JIT[Math.floor(f / 2) % JIT.length];
  const sb = new Buf(LW, LH, PAL.N0);
  for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) sb.set(x, y, b.get(clamp(x - jx, 0, LW - 1), clamp(y - jy, 0, LH - 1)));
  applyPalette(sb, ERA08);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, sb.get(x >> 1, y >> 1));
  // the tape: a faint scanline every other row, the head-switch at the foot, and the tracking
  for (let y = 1; y < RH; y += 2) for (let x = 0; x < 480; x++) if (bayer(x, y) < 0.5) fb.set(x, y, stepColor(fb.get(x, y), -1));
  vhsTrack(fb, f, Math.max(0.12, st.track));
};

// ================================================================== v31-S3.00p: her two printed pages, squared twice
export interface PropsState { k: number; square1: number; square2: number }
const POST_DEC4 = 'CHATGTP launched on wednesday. today it crossed 1 million users!';
export const drawNelehProps = (b: Buf, f: number, st: PropsState) => {
  const {k} = st;
  // her desk from above (the warm wood of her desk's high view), the laptop's edge at the top
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let c = (Math.floor((x + y * 0.1) / 28) % 2) ? PAL.W3 : PAL.D4;
    if (hash(x, y >> 2, 7) < 0.04) c = PAL.W4; else if ((x + Math.floor(y * 0.1)) % 28 === 0) c = PAL.D3;
    b.set(x, y, c);
  }
  rect(0, 0, 480, 10, b.ink(PAL.G2)); rect(0, 10, 480, 2, b.ink(PAL.G1)); rect(0, 12, 480, 3, b.ink(PAL.D2));
  // the sheets: off true until she squares them (1 px knocks), then square; the second time they're already square
  const sq1 = k >= st.square1, knock2 = k >= st.square2 && k < st.square2 + 3;
  const offA: [number, number] = sq1 ? [0, knock2 ? -1 : 0] : [-4, 5], offB: [number, number] = sq1 ? [0, knock2 ? -1 : 0] : [5, -3];
  const sheet = (x: number, y: number, w: number, h: number) => {
    rect(x + 3, y + 3, w, h, b.ink(PAL.D2));
    rect(x, y, w, h, b.ink(PAL.P2)); rect(x, y + h - 1, w, 1, b.ink(PAL.P1)); rect(x + w - 1, y, 1, h, b.ink(PAL.P1));
  };
  // his post, printed: the avatar, the name, the date, the words
  const [ax, ay] = [58 + offA[0], 22 + offA[1]];
  sheet(ax, ay, 178, 170);
  ellipse(ax + 16, ay + 17, 8, 8, b.ink(PAL.C5)); pt(b, 'M', ax + 14, ay + 14, PAL.N1);
  pt(b, 'Mas Manalt', ax + 30, ay + 10, PAL.N1); pt(b, '@mas', ax + 32 + pw('Mas Manalt'), ay + 10, PAL.G4); pt(b, 'Dec 4, 2022', ax + 30, ay + 19, PAL.G4);
  const ls = pwrap(POST_DEC4, 150);
  ls.forEach((l, i) => pt(b, l, ax + 14, ay + 38 + i * 11, PAL.N1));
  rect(ax + 14, ay + 42 + ls.length * 11, 150, 1, b.ink(PAL.P1));
  for (let i = 0; i < 3; i++) rect(ax + 14 + i * 40, ay + 48 + ls.length * 11, 18, 4, b.ink(PAL.P1));
  // her paper, page 30: grey lines, one highlighted, the page number
  const [bx, by] = [252 + offB[0], 16 + offB[1]];
  sheet(bx, by, 170, 178);
  for (let j = 0; j < 14; j++) { const y = by + 14 + j * 10; if (j === 6) continue; const w = j === 13 ? 70 : 142 - (hash(j, 2, 9) < 0.3 ? 12 : 0); rect(bx + 14, y, w, 2, b.ink(PAL.G6)); }
  const hy = by + 14 + 6 * 10 - 3;
  rect(bx + 10, hy - 1, 150, 11, b.ink(PAL.W7)); rect(bx + 10, hy + 9, 150, 1, b.ink(PAL.W6));
  pt(b, '…frantic corner-cutting…', bx + 14, hy + 1, PAL.N1);
  pt(b, '30', bx + 85 - Math.floor(pw('30') / 2), by + 164, PAL.G4);
  // her hands at the outer edges: sleeves from the frame's foot, the fingers along the paper's edge (in on the square)
  const press = (k >= st.square1 && k < st.square1 + 4) || (k >= st.square2 && k < st.square2 + 4) ? 2 : 0;
  // a hand from above at a sheet's outer edge: `side` = where the sleeve is (-1 left, 1 right); the fingers lie in over
  // the paper's edge, the thumb under them, the palm off the paper, the sleeve out to the frame's edge
  const capsule = (x0: number, y0: number, x1: number, y1: number, r: number, c: number) => {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0)));
    for (let t = 0; t <= n; t++) ellipse(Math.round(x0 + ((x1 - x0) * t) / n), Math.round(y0 + ((y1 - y0) * t) / n), r, r, b.ink(c));
  };
  const hand = (edgeX: number, side: -1 | 1) => {
    const ex = edgeX - side * press, wx = ex + side * 30;
    // the forearm, out and down to the frame's foot (her sleeve, navy, its cuff at the wrist)
    poly([ex + side * 24, 90, ex + side * 22, 120, ex + side * 62, RH, ex + side * 102, RH], b.ink(PAL.N4));
    line(ex + side * 24, 90, ex + side * 102, RH, b.ink(PAL.N5)); line(ex + side * 22, 120, ex + side * 62, RH, b.ink(PAL.N3));
    line(ex + side * 26, 92, ex + side * 24, 118, b.ink(PAL.P1));
    void wx;
    ellipse(ex + side * 16, 104, 15, 16, b.ink(PAL.S1)); ellipse(ex + side * 16, 104, 14, 15, b.ink(PAL.S3)); ellipse(ex + side * 17, 99, 10, 9, b.ink(PAL.S4));
    [[88, 3], [96, 6], [104, 5], [111, 1]].forEach(([fy, reach]) => {
      capsule(ex + side * 8, fy, ex - side * (6 + reach), fy, 3, PAL.S1);
      capsule(ex + side * 8, fy, ex - side * (6 + reach), fy, 2, PAL.S4);
      line(ex + side * 8, fy - 1, ex - side * (5 + reach), fy - 1, b.ink(PAL.S5));
    });
    capsule(ex + side * 10, 118, ex - side * 2, 124, 3, PAL.S1); capsule(ex + side * 10, 118, ex - side * 2, 124, 2, PAL.S3);
  };
  hand(ax, -1); hand(bx + 170, 1);
};

// ================================================================== v35-49A.01: Alyi alone
export interface AlyiAloneState { shot: 'wide' | 'mcu'; k: number; hand: number; hearts: number[] }
/** the users line on the glass (Act One sc 18's marker line: flat along the bottom, then up, and off the top of the
 *  pane), in the marker's white, from (x0, y0); `s` = the scale (1 wide, 3 close) */
const usersLine = (b: Buf, x0: number, y0: number, s: number, clip: (x: number, y: number) => boolean, col: number) => {
  const pts: Array<[number, number]> = [[0, 0], [10, -1], [18, -1], [24, -3], [28, -6], [31, -11], [33, -18], [35, -28], [36, -40], [37, -60], [38, -90]];
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    line(x0 + ax * s, y0 + ay * s, x0 + bx * s, y0 + by * s, (x, y) => { for (let t = 0; t < s; t++) if (clip(x + t, y)) b.set(x + t, y, col); });
  }
  if (s >= 2) tiny(b, 'USERS', x0 + 2 * s, y0 + 3 * s, col);
};
let NIGHT_ROOM: {buf: Buf; win: Uint8Array} | null = null;
/** the walkout bullpen (no crowd: the boxes on every desk) graded to night, the windows the city at night */
const nightRoom = () => (NIGHT_ROOM ??= (() => {
  const buf = new Buf(480, 270, PAL.N0);
  const out = drawBullpen(buf, 0, {variant: 'walkout', crowd: false});
  const win = new Uint8Array(480 * RH);
  const wm = out.masks.window;
  let x0 = 480, x1 = 0, y0 = RH, y1 = 0;
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (wm.a[y * 480 + x]) { win[y * 480 + x] = 1; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    if (win[y * 480 + x]) continue;
    const c = buf.get(x, y), fm = familyOf(c);
    if (fm && fm[0] === 'W' && fm[1] >= 4) { buf.set(x, y, stepColor(c, -2)); continue; } // the hall's tungsten stays on
    buf.set(x, y, NIGHT_RAMP[Math.max(0, Math.min(6, Math.floor(lumOf(c) * 7.5) - 1))]);
  }
  const city = new Buf(480, 270, PAL.N0);
  if (x1 > x0) drawBayNight(city, x0, y0, x1, y1, 1);
  for (let i = 0; i < 480 * RH; i++) if (win[i]) buf.c[i] = city.c[i] === PAL.N0 ? PAL.N1 : city.c[i];
  return {buf, win};
})());
export const ALYI_WIN_AT: [number, number] = [372, 176];
export const drawAlyiAlone = (b: Buf, f: number, st: AlyiAloneState) => {
  const {k} = st;
  if (st.shot === 'wide') {
    const R = nightRoom();
    b.c.set(R.buf.c.subarray(0, 480 * RH), 0);
    // the users line on the near pane, rising off its top
    let wx0 = 480, wy1 = 0;
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (R.win[y * 480 + x]) { wx0 = Math.min(wx0, x); wy1 = Math.max(wy1, y); }
    usersLine(b, wx0 + 10, wy1 - 12, 1, (x, y) => !!R.win[y * 480 + x], PAL.C7);
    // ALYI at the windows, the city's cool light on his back, his phone lit in his hand (its glow on his chest)
    const [fx, fy] = ALYI_WIN_AT;
    drawAlyiStand(b, fx, fy, {...ALYI_STAND_DEFAULT, light: 'sil', arms: 'clasp'}, {flip: true});
    const px = fx - 4, py = fy - 44;
    rect(px, py, 3, 4, b.ink(PAL.C7)); put(b, px + 1, py - 1, PAL.C6);
    for (let y = py - 10; y < py + 6; y++) for (let x = px - 6; x < px + 8; x++) { const d = Math.hypot((x - px - 1) / 7, (y - py + 2) / 9); if (d < 1 && bayer(x, y) < (1 - d) * 0.7) b.set(x, y, stepColor(b.get(x, y), 1)); }
    // a heart, now and then, lifting off his phone (the post's hearts landing)
    for (const t of st.hearts) { const a = k - t; if (a >= 0 && a < 10) { put(b, px + 1, py - 3 - (a >> 1), PAL.R3); put(b, px + 2, py - 3 - (a >> 1), PAL.R2); } }
    return;
  }
  // [MCU], in person: the glass on the left (the city, the line going up off the top), ALYI at the right third facing
  // it, lit from below by his phone; his hand comes up near the line, not on it
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, PAL.N1);
  const GX1 = 300;
  drawBayNight(b, 0, 0, GX1, RH - 1, 2, 40);
  for (let y = 0; y < RH; y++) for (let x = 0; x < GX1; x++) b.set(x, y, stepColor(b.get(x, y), -1)); // the glass between
  rect(GX1, 0, 6, RH, b.ink(PAL.N3)); rect(GX1, 0, 1, RH, b.ink(PAL.N5)); // the mullion
  rect(GX1 + 6, 0, 480 - GX1 - 6, RH, b.ink(PAL.N1)); // the dark room behind him
  for (let y = 0; y < RH; y++) for (let x = GX1 + 6; x < 480; x++) if (bayer(x, y) < 0.12) b.set(x, y, PAL.N2);
  usersLine(b, 64, 178, 3, (x, y) => x < GX1 && y >= 0, PAL.C7);
  // ALYI: his bust at the right third, facing the glass (camera-left), eyes down to his phone
  drawBust(b, alyiLook({mouth: 'rest', eyes: 'open', t: 0, dir: k >= st.hand + 6 ? 'left' : 'down'}), {third: 'R', dx: -6});
  faceKey(b, 300, 30, 440, 150, 1, -1);
  // his phone low in the frame, lit: RIMA's post, the hearts landing on it and lifting
  const px = 390, py = 164;
  rect(px - 1, py - 1, 50, 40, b.ink(PAL.N0)); rect(px, py, 48, 40, b.ink(PAL.C2)); rect(px + 2, py + 2, 44, 36, b.ink(PAL.N2));
  rect(px + 4, py + 4, 40, 1, b.ink(PAL.P1)); rect(px + 4, py + 8, 34, 1, b.ink(PAL.G5)); rect(px + 4, py + 11, 38, 1, b.ink(PAL.G5));
  const nh = st.hearts.filter((t) => k >= t).length;
  for (let i = 0; i < Math.min(6, nh); i++) { const hx = px + 5 + i * 6, hy = py + 16; b.set(hx, hy, PAL.R3); b.set(hx + 2, hy, PAL.R3); rect(hx, hy + 1, 3, 1, b.ink(PAL.R3)); b.set(hx + 1, hy + 2, PAL.R3); }
  for (const t of st.hearts) { const a = k - t; if (a >= 0 && a < 16) { const hx = px + 22 + ((t * 7) % 16) - 8, hy = py - 2 - a; if (hy > 0) { b.set(hx, hy, PAL.R3); b.set(hx + 2, hy, PAL.R3); rect(hx, hy + 1, 3, 1, b.ink(a < 10 ? PAL.R3 : PAL.R2)); b.set(hx + 1, hy + 2, PAL.R2); } } }
  for (let y = py - 30; y < py; y++) for (let x = px - 40; x < px + 50; x++) { const d = Math.hypot((x - px - 24) / 60, (y - py) / 34); if (d < 1 && bayer(x, y) < (1 - d) * 0.8) b.set(x, y, stepColor(b.get(x, y), 1)); }
  // his near hand, open, rising to the glass beside the line in three held steps, stopping short of it; his forearm from
  // below; the city's cool light on its outer edge; its faint reflection in the glass a hand's width from it
  if (k >= st.hand) {
    const s = Math.min(2, Math.floor((k - st.hand) / 4));
    const hx = 214, hy = 106 + (2 - s) * 28;
    const m = new Uint8Array(480 * RH);
    const mark = (x: number, y: number) => { if (x >= 0 && x < 480 && y >= 0 && y < RH) m[y * 480 + x] = 1; };
    const disc = (cx: number, cy: number, r: number) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r) mark(cx + x, cy + y); };
    const caps = (x0: number, y0: number, x1: number, y1: number, r: number) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0))); for (let t = 0; t <= n; t++) disc(Math.round(x0 + ((x1 - x0) * t) / n), Math.round(y0 + ((y1 - y0) * t) / n), r); };
    for (let y = -12; y <= 12; y++) for (let x = -11; x <= 11; x++) if ((x / 11) ** 2 + (y / 12) ** 2 <= 1) mark(hx + x, hy + y);
    [15, 19, 18, 14].forEach((L, i) => caps(hx - 8 + i * 5, hy - 8, hx - 9 + i * 5, hy - 8 - L, 2));
    caps(hx + 9, hy + 2, hx + 15, hy - 9, 2);
    // the reflection first (under nothing: it's in the glass)
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (m[y * 480 + x]) { const X = 2 * 176 - x; if (X >= 0 && X < GX1) b.set(X, y, stepColor(b.get(X, y), 1)); }
    // the forearm, from the hand down to his side at the frame's foot
    poly([hx - 6, hy + 8, hx + 9, hy + 10, 330, RH, 296, RH], b.ink(PAL.N2)); line(hx - 6, hy + 8, 296, RH, b.ink(PAL.C2));
    for (let y = 0; y < RH; y++) {
      let first = -1;
      for (let x = 0; x < 480; x++) {
        if (!m[y * 480 + x]) continue;
        if (first < 0) first = x;
        const edge = !m[y * 480 + x + 1] || !m[y * 480 + x - 1] || !m[(y - 1) * 480 + x] || !m[(y + 1) * 480 + x];
        b.set(x, y, edge ? PAL.S1 : x - first < 2 ? PAL.K2 : x > hx + 6 ? PAL.S2 : PAL.S3);
      }
    }
    for (let i = 0; i < 4; i++) put(b, hx - 8 + i * 5, hy - 6, PAL.S2); // the knuckles
  }
  void lightness; void textWidth; void text; void tinyWidth; void postLines;
};
/** his hand-lettered words' width in the display face (for placing the pen) */
export const handWidth = (s: string) => bigTextWidth(s);
export type {PostSpec};
