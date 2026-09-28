// MR. MAS — kit: HIS PHONE ON THE DESK, FROM ABOVE (Ep1 sc 22, 23; new file, owned by the `v3-art-b` pass). The dark
// desk's [HIGH] with the phone face up, the same phone and the same key as Act Four's 2 AM insert (kits/inserts-mas.ts
// PHONE29 geometry, its tap hand from kits/inserts-hands.ts), and the Orb at the frame's top-right edge.
//   drawPhoneHigh(b, f, st)   screen 'prompt' (22.02: a generic app's prompt `How did the keynote go?` and the
//                             suggested-replies strip `[super] [enthusiastic] [thrilled]`) · 'reminder' (23.02: the invite
//                             he accepted on the APEC stage, now a reminder, `Board sync · Fri 12:00`, with the same four
//                             attendee circles: a doorway, a glowing page, a loading spinner, a black square) · 'dark'
//                             (the reminder gone dark on its own) · 'call' (GERG on speaker)
//                             thumb 'none' | 'hover' (over the strip: the beat plan's new pose) | 'tap' (on `super`)
//                             orb: the iris's look (reminder: `orbStep` one circle per beat, ORB_CIRCLE_LOOKS)
//   phoneMini(kind)           a painter for the dark plate's phone lying on the desk (DPLATE.phone, 18 x 9 screen):
//                             'gerg' (the call, GERG lit green, the speaker on) · 'prompt' · 'reminder' · 'off'
import {Buf, rect, hash, bayer, ellipse} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg} from '../figure';
import {MatBuf, resolve} from '../light';
import {pt, pw} from './uitype';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {PHONE29, drawSleeve, contactShadow} from './inserts-mas';
import {tapHandCaps} from './inserts-hands';
import {drawOrb} from '../cast/orb-medium';

const RH = 203;
// ------------------------------------------------------------------ the desk, from above (the 2 AM insert's plate, re-made)
let DESK: Buf | null = null;
const desk = (): Buf => {
  if (DESK) return DESK;
  const rb = new Buf(480, RH, PAL.N0);
  const mb = new MatBuf(480, RH);
  const edgeY = 12;
  rect(0, 0, 480, edgeY, mb.mat('wall', -0.8));
  for (let y = edgeY; y < RH; y++) for (let x = 0; x < 480; x++) {
    const v = y * 0.34 + 1.2 * Math.sin(x / 140 + y / 60) + 0.5 * Math.sin(x / 38 + y / 21);
    const band = Math.floor(v / 5), inB = v - band * 5;
    let lvl = (hash(band, 3, 11) - 0.5) * 0.6 + 0.4;
    if (inB < 0.9 && hash(band, 5, 13) < 0.6) lvl -= 0.9;
    mb.mat('wood', lvl)(x, y);
  }
  rect(0, edgeY, 480, 1, mb.shade(1.8));
  resolve(mb, {
    amb: (x, y) => 1.8 + (y < edgeY ? 0.4 : 0) - Math.max(0, (y - 150) / 80),
    cyan: (x, y) => { const d = Math.hypot((x + 60) / 620, (y + 10) / 260); return y < edgeY ? 0 : Math.max(0, Math.min(1, 1.02 - d)) * 0.95; },
    warm: () => 0, dither: 0.4,
  }, rb, 0);
  DESK = rb;
  return rb;
};
const phoneBody = (b: Buf) => {
  const {x0, y0, x1, y1} = PHONE29.body;
  for (let y = y0 + 3; y <= y1 + 3; y++) for (let x = x0 + 3; x <= x1 + 3; x++) b.set(x, y, stepColor(b.get(x, y), -2));
  const r = 7;
  const inRound = (x: number, y: number) => { const cx = Math.max(x0 + r, Math.min(x1 - r, x)), cy = Math.max(y0 + r, Math.min(y1 - r, y)); return Math.hypot(x - cx, y - cy) <= r; };
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    if (!inRound(x, y)) continue;
    const e = !inRound(x - 1, y) || !inRound(x, y - 1), e2 = !inRound(x + 1, y) || !inRound(x, y + 1);
    b.set(x, y, e ? PAL.C3 : e2 ? PAL.N0 : PAL.N1);
  }
  const S = PHONE29.screen;
  rect(S.x0, S.y0, S.x1 - S.x0 + 1, S.y1 - S.y0 + 1, b.ink(PAL.N0));
};
/** the four attendee circles (the invite's): ALYI's doorway, NELEH's glowing page, MADA's spinner, THE QUIET VOTE's
 *  black square; each 11 px, in a row at (x, y); returns their centres */
export const attendeeCircles = (b: Buf, x: number, y: number, f: number, r = 6): Array<[number, number]> => {
  // the same four circles as the invite the cold open shows (kits/phone-invite.ts, the `v3-art-a` pass): a G4 ring, a
  // dark face; a doorway ajar with its light, a glowing page, a loading spinner, a black square
  const out: Array<[number, number]> = [];
  for (let k = 0; k < 4; k++) {
    const cx = x + r + 1 + k * (2 * r + 4), cy = y + r + 1;
    out.push([cx, cy]);
    ellipse(cx, cy, r + 1, r + 1, b.ink(PAL.G4)); ellipse(cx, cy, r, r, b.ink(k === 3 ? PAL.N0 : PAL.N2));
    if (k === 0) { rect(cx - 3, cy - 4, 6, 9, b.ink(PAL.N0)); rect(cx - 3, cy - 4, 2, 9, b.ink(PAL.W6)); rect(cx - 1, cy - 4, 1, 9, b.ink(PAL.W4)); }
    if (k === 1) { rect(cx - 3, cy - 4, 7, 9, b.ink(PAL.C7)); rect(cx - 2, cy - 3, 5, 7, b.ink(PAL.P2)); for (const yy of [cy - 2, cy, cy + 2]) rect(cx - 1, yy, 3, 1, b.ink(PAL.G5)); }
    if (k === 2) { const st = Math.floor(f / 4) % 4; for (let a = 0; a < 8; a++) { const ang = ((a + st * 2) / 8) * Math.PI * 2; b.set(Math.round(cx + Math.cos(ang) * 3), Math.round(cy + Math.sin(ang) * 3), a < 3 ? PAL.P2 : a < 5 ? PAL.G5 : PAL.G3); } }
    if (k === 3) rect(cx - 3, cy - 3, 6, 6, b.ink(PAL.N0));
  }
  return out;
};
/** the Orb's looks from its corner (PHONE29.orb) to each circle, whole steps */
export const ORB_CIRCLE_LOOKS: Array<[number, number]> = [[-0.86, 0.46], [-0.8, 0.5], [-0.74, 0.54], [-0.68, 0.58]];
export type PhoneScreen = 'prompt' | 'reminder' | 'dark' | 'call';
const drawScreen = (b: Buf, kind: PhoneScreen, f: number, press: boolean) => {
  const S = PHONE29.screen, W = S.x1 - S.x0 + 1;
  if (kind === 'dark') return;
  rect(S.x0, S.y0, W, S.y1 - S.y0 + 1, b.ink(PAL.N1));
  pt(b, '9:41', S.x0 + 4, S.y0 + 3, PAL.G5);
  if (kind === 'call') {
    rect(S.x0 + 6, S.y0 + 30, W - 12, 60, b.ink(PAL.L0));
    ellipse(S.x0 + W / 2, S.y0 + 50, 11, 11, b.ink(PAL.L2)); pt(b, 'G', S.x0 + W / 2 - 2, S.y0 + 47, PAL.P2);
    pt(b, 'GERG', S.x0 + W / 2 - pw('GERG') / 2, S.y0 + 66, PAL.L3); pt(b, 'speaker', S.x0 + W / 2 - pw('speaker') / 2, S.y0 + 78, PAL.G5);
    return;
  }
  if (kind === 'prompt') {
    // a generic app's prompt card, then the suggested-replies strip (three chips, super first)
    rect(S.x0 + 4, S.y0 + 22, W - 8, 44, b.ink(PAL.N2)); rect(S.x0 + 4, S.y0 + 22, W - 8, 1, b.ink(PAL.G4));
    pt(b, 'How did the', S.x0 + 8, S.y0 + 28, PAL.P2); pt(b, 'keynote go?', S.x0 + 8, S.y0 + 39, PAL.P2);
    for (let i = 0; i < 30; i++) if (i % 5 !== 4) b.set(S.x0 + 8 + i, S.y0 + 55, PAL.G3);
    const chips = ['super', 'enthusiastic', 'thrilled'];
    let y = S.y0 + 82;
    chips.forEach((c, k) => {
      const w = W - 10, down = press && k === 0 ? 1 : 0;
      for (let j = 0; j < 16; j++) for (let i = 0; i < w; i++) { if ((i === 0 || i === w - 1) && (j === 0 || j === 15)) continue; b.set(S.x0 + 5 + i, y + j + down, j === 0 ? (down ? PAL.C3 : PAL.C6) : down ? PAL.C2 : PAL.C4); }
      pt(b, c, S.x0 + 9, y + 5 + down, down ? PAL.C8 : PAL.N0);
      y += 20;
    });
    return;
  }
  // the reminder: the invite's card
  rect(S.x0 + 4, S.y0 + 28, W - 8, 64, b.ink(PAL.N2)); rect(S.x0 + 4, S.y0 + 28, 2, 64, b.ink(PAL.C5));
  pt(b, 'Board sync', S.x0 + 10, S.y0 + 34, PAL.P2);
  pt(b, 'Fri 12:00', S.x0 + 10, S.y0 + 45, PAL.C6);
  attendeeCircles(b, S.x0 + 6, S.y0 + 60, f);
};
/** the strip's first chip centre (`super`), and where the hovering thumb waits above it */
export const STRIP_SUPER: [number, number] = [PHONE29.screen.x1 - 10, PHONE29.screen.y0 + 90];
/** v3.1 (23.02): the four circles' names on hover, as the Orb's iris steps along them */
export const ATTENDEE_NAMES = ['ALYI', 'NELEH', 'MADA', 'THE QUIET VOTE'];
export interface PhoneHighState { screen: PhoneScreen; thumb?: 'none' | 'hover' | 'tap'; orb?: [number, number] | null; hover?: 0 | 1 | 2 | 3 | null; }
export const drawPhoneHigh = (b: Buf, f: number, st: PhoneHighState) => {
  const d = desk();
  b.c.set(d.c.subarray(0, 480 * RH));
  // the rack's LEDs far off beyond the desk (top-left)
  for (const [x, y, c, k] of [[14, 4, PAL.C4, 0], [20, 7, PAL.R3, 1], [26, 4, PAL.L2, 2]] as Array<[number, number, number, number]>) { const on = (Math.floor((f * 2) / 15) + k) % 3 !== 0; b.set(x, y, on ? c : stepColor(c, -2)); }
  phoneBody(b);
  drawScreen(b, st.screen, f, st.thumb === 'tap');
  if (st.screen === 'reminder' && st.hover !== null && st.hover !== undefined) {
    // the hover tooltip over the circle: its name in small caps on a dark chip with a pointer notch
    const S = PHONE29.screen, cx = S.x0 + 6 + 7 + st.hover * 16, cy = S.y0 + 60;
    const name = ATTENDEE_NAMES[st.hover], w = tinyWidth(name) + 6;
    const x = Math.max(S.x0 + 1, Math.min(S.x1 - w, cx - (w >> 1))), y = cy - 12;
    rect(x - 1, y - 1, w + 2, 10, b.ink(PAL.N0)); rect(x, y, w, 8, b.ink(PAL.G1)); b.set(cx, y + 8, PAL.G1); b.set(cx, y + 9, PAL.N0);
    tiny(b, name, x + 3, y + 2, PAL.P2);
  }
  // his hand: the thumb over the strip (hover), or down on `super` (tap)
  if (st.thumb && st.thumb !== 'none') {
    const H = tapHandCaps({s: 9.5, thumb: st.thumb === 'tap' ? 'tap' : 'up', light: 'dark'});
    const [tx, ty] = STRIP_SUPER;
    const off = st.thumb === 'hover' ? [14, 12] : [0, 0];
    const ox = Math.round(tx - H.anchors.thumbPad[0] + off[0]), oy = Math.round(ty - H.anchors.thumbPad[1] + off[1]);
    drawSleeve(b, [ox + H.anchors.wrist[0], oy + H.anchors.wrist[1] - 4], [ox + H.anchors.wrist[0] + 22, RH + 10], 50, 56, 'dark', -1, 0.6);
    contactShadow(b, H.img, ox, oy, st.thumb === 'hover' ? 5 : 2, st.thumb === 'hover' ? 5 : 2, 2);
    blitImg(b, H.img, ox, oy);
  }
  if (st.orb !== null) {
    const O = PHONE29.orb;
    drawOrb(b, O.cx, O.cy, O.r, {look: st.orb ?? [-0.62, 0.6], aperture: 0.55, monitor: -1});
  }
};
/** a painter for the dark plate's phone lying on the desk (its screen is 18 x 9: DPLATE.phone less its frame) */
export const phoneMini = (kind: 'gerg' | 'prompt' | 'reminder' | 'off') => (scr: Buf, f: number) => {
  if (kind === 'off') { rect(0, 0, scr.w, scr.h, scr.ink(PAL.N0)); return; }
  rect(0, 0, scr.w, scr.h, scr.ink(kind === 'gerg' ? PAL.L0 : PAL.N1));
  if (kind === 'gerg') { rect(2, 2, 4, 4, scr.ink(PAL.L3)); rect(8, 3, 8, 2, scr.ink(PAL.L3)); if (Math.floor(f / 6) % 2) rect(8, 6, 5, 1, scr.ink(PAL.L2)); }
  if (kind === 'prompt') { rect(2, 1, 12, 3, scr.ink(PAL.N3)); for (let k = 0; k < 3; k++) rect(2 + k * 5, 6, 4, 2, scr.ink(PAL.C4)); }
  if (kind === 'reminder') { rect(1, 1, scr.w - 2, 4, scr.ink(PAL.N3)); for (let k = 0; k < 4; k++) scr.set(3 + k * 3, 7, k === 3 ? PAL.N0 : PAL.G4); }
};
