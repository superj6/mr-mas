// MR. MAS — shared set: v32-7.03, THE CALL (script draft 8.1: "he launches, it explodes, he secures the money"). New
// file (v3-art-a, v3.2 round, 2026-09-28). Later that night, at his end desk, the open tile's red glow under him, Mas
// has the phone at his ear. One filtered ring. "Mas." / "it's the bill. we're going to need more servers." / "I'll bring
// a pen." He lowers the phone; before it reaches the desk it lights red (8.01's alert) and a siren whines through it.
// Guardrails §5 and the notes' shot note: it must read as CARTOON, never as a real backroom. So: the same toy-bright
// grammar as the drill (the red is the hole's, lit from below like a campfire story), the phone held with its lit
// screen out to us (cartoon licence, so the contact reads without a cutaway), a big friendly key-ring avatar, no
// shadows over his eyes, no smoke, no second party seen.
//   drawLaunchCallMcu(b, f, st)   [MCU] the bullpen behind him stepping down (7.01's fallaway), his portrait lit red from
//                                 below; st.phone: 'ear' (at his ear, the contact screen out: TASYA · MACROSOFT over the
//                                 key-ring avatar, the call running) · 'low' (lowered to his chin, going dark) · 'red'
//                                 (lowered, lit red: the alert card, its red on his chin); st.mas his portrait's state
//   drawTasyaContact(b, x, y, w, h, st)   the contact screen at any size (st.state 'ringing' · 'call' · 'ended')
//   drawCallScreenECU(b, f, st)   [INSERT] the phone on his desk filling the frame, ringing: the contact screen large
//                                 (for a cut-in on the ring, if the shot pass wants the name bigger than the MCU's)
//   drawKeyRingGlyph(b, cx, cy, r) the avatar's key ring (brass, three keys)
//   CALL_TEXT                     the screen's words (the plate `TASYA · MACROSOFT`: the world carries it)
import {Buf, rect, ellipse, bayer} from '../px';
import {PAL, stepColor, familyOf, lightness} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {pt, pw} from '../kits/uitype';
import {tiny, tinyWidth} from './kit-b';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {drawCollarsPortrait} from '../cast/mas-collars';
import {launchBackM, putBust} from './bullpen-launch';
import {drawAlertCard} from '../kits/phone-alert';

const RH = 203;
export const CALL_TEXT = {name: 'TASYA', relation: 'MACROSOFT'};

/** the key-ring avatar: a brass ring and three keys fanned under it, on a slate disc */
export const drawKeyRingGlyph = (b: Buf, cx: number, cy: number, r: number) => {
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r) b.set(cx + x, cy + y, y < -r * 0.3 ? PAL.N6 : PAL.N5);
  const rr = Math.max(2, Math.round(r * 0.42)), ry = cy - Math.round(r * 0.22);
  for (let y = -rr - 1; y <= rr + 1; y++) for (let x = -rr - 1; x <= rr + 1; x++) { const d = Math.hypot(x, y); if (d >= rr - 0.9 && d <= rr + 0.6) b.set(cx + x, ry + y, x + y < 0 ? PAL.W7 : PAL.W5); }
  const kl = Math.max(3, Math.round(r * 0.5));
  for (const [dx, col] of [[-Math.round(rr * 0.8), PAL.W6], [0, PAL.G5], [Math.round(rr * 0.8), PAL.W5]] as Array<[number, number]>) {
    const kx = cx + dx, ky = ry + rr;
    for (let j = 0; j < kl; j++) b.set(kx + Math.round(dx * 0.15 * j / kl), ky + j, col);
    b.set(kx + Math.round(dx * 0.15) + 1, ky + kl - 2, col);
  }
};

export interface ContactState { state?: 'ringing' | 'call' | 'ended'; f?: number }
/** the contact screen (a generic call UI: no real phone's layout or marks): the avatar, the name in the display face
 *  when there's room, the relation line, and the call's own state row */
export const drawTasyaContact = (b: Buf, x: number, y: number, w: number, h: number, st: ContactState = {}) => {
  const s = st.state ?? 'call', f = st.f ?? 0;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, j < h * 0.55 ? (bayer(i, j) < 0.25 ? PAL.N4 : PAL.N3) : PAL.N2);
  const big = w >= 120;
  const r = big ? 22 : Math.max(7, Math.round(w * 0.24));
  const cy = y + (big ? 34 : Math.round(h * 0.26));
  drawKeyRingGlyph(b, x + (w >> 1), cy, r);
  let ty = cy + r + (big ? 8 : 4);
  if (big) { bigText(b, CALL_TEXT.name, x + ((w - bigTextWidth(CALL_TEXT.name)) >> 1), ty, PAL.P2); ty += 18; pt(b, CALL_TEXT.relation, x + ((w - pw(CALL_TEXT.relation)) >> 1), ty, PAL.G6); ty += 14; }
  else { text(b, CALL_TEXT.name, x + ((w - textWidth(CALL_TEXT.name)) >> 1), ty, PAL.P2); ty += 9; tiny(b, CALL_TEXT.relation, x + ((w - tinyWidth(CALL_TEXT.relation)) >> 1), ty, PAL.G6); ty += 8; }
  // the state row: ringing (three dots stepping), a call in progress (a small green bar), ended (a grey bar)
  if (s === 'ringing') for (let i = 0; i < 3; i++) rect(x + (w >> 1) - 6 + i * 5, ty + 2, 2, 2, b.ink(Math.floor(f / 6) % 3 === i ? PAL.P2 : PAL.G4));
  else rect(x + (w >> 1) - (big ? 16 : 6), ty + 2, big ? 32 : 12, 2, b.ink(s === 'call' ? PAL.L3 : PAL.G4));
  // the end button (generic red disc) near the bottom
  const ey = y + h - (big ? 18 : 8), er = big ? 8 : 3;
  for (let j = -er; j <= er; j++) for (let i = -er; i <= er; i++) if (i * i + j * j <= er * er) b.set(x + (w >> 1) + i, ey + j, s === 'ended' ? PAL.G3 : PAL.R2);
};

/** a phone body with its screen at (x, y) (outer size w x h), rounded, a dark bezel */
const phoneBody = (b: Buf, x: number, y: number, w: number, h: number, edge: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const cx = Math.min(i, w - 1 - i), cy = Math.min(j, h - 1 - j);
    if (cx < 3 && cy < 3 && Math.hypot(3 - cx, 3 - cy) > 3.2) continue;
    b.set(x + i, y + j, cx === 0 || cy === 0 ? PAL.N0 : cx === 1 || cy === 1 ? edge : PAL.N1);
  }
};

export interface LaunchCallState {
  phone?: 'ear' | 'low' | 'red';
  mas?: Partial<MasPortraitState>;
  contact?: ContactState;
  /** the hole's red from below (0..2), as 7.01 */
  glow?: number;
  collars?: number;
  collarStyle?: 'v31';
  f?: number;
}
const skinOf = (c: number) => { const fm = familyOf(c); return !!fm && fm[0] === 'S' && lightness(c) > 0.3; };
export const drawLaunchCallMcu = (b: Buf, f: number, st: LaunchCallState = {}) => {
  // the bullpen behind him, soft and stepped down (7.01's fallaway, so the two beats cut together)
  launchBackM(b, 300, {soft: 2, alyi: 'gone', underlines: 3});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -2));
  const s: MasPortraitState = {...MAS_PORTRAIT_DEFAULT, light: 'warm', lid: 0, look: 0, ...st.mas};
  const x = 96, y = 34;
  putBust(b, masPortrait(s), x, y);
  drawCollarsPortrait(b, x, y, st.collars ?? 2, {head: s.head ?? '34', light: 'warm', style: st.collarStyle});
  // the hole's red from below: a clean rim on the undersides of his face (as 7.01: no dither on skin)
  const glow = st.glow ?? 2;
  if (glow) {
    const hits: Array<[number, number]> = [];
    for (let yy = y + 60; yy < y + 86; yy++) for (let xx = x + 10; xx < x + 100; xx++) if (skinOf(b.get(xx, yy)) && !skinOf(b.get(xx, yy + 1))) hits.push([xx, yy]);
    for (const [xx, yy] of hits) { b.set(xx, yy, glow >= 2 ? PAL.W5 : PAL.S5); if (glow >= 2 && skinOf(b.get(xx, yy - 1))) b.set(xx, yy - 1, PAL.S5); }
    // and on the floor of the frame: the tile's red, a band under the desk's edge
    for (let yy = RH - 10; yy < RH; yy++) for (let xx = 0; xx < 480; xx++) if (bayer(xx, yy) < (yy - RH + 10) / 12) b.set(xx, yy, yy > RH - 4 ? PAL.R2 : PAL.R1);
  }
  const phone = st.phone ?? 'ear';
  // his arm: the hoodie sleeve from the frame's bottom right up to the hand (drawn first; the hand and phone over it)
  const hand = phone === 'ear' ? [x + 90, y + 88] : [x + 64, y + 124];
  const [hx, hy] = hand;
  for (let yy = hy; yy < RH; yy++) { const t = (yy - hy) / Math.max(1, RH - hy); const cx = Math.round(hx + 4 + t * 36), hw = 9 + Math.round(t * 8); for (let xx = cx - hw; xx <= cx + hw; xx++) b.set(xx, yy, xx === cx - hw ? (glow ? PAL.W3 : PAL.G3) : xx > cx + hw - 3 ? PAL.G0 : PAL.G2); }
  if (phone === 'ear') {
    // the phone at his ear, its lit screen out to us (cartoon licence), 40 x 64: the contact and the call running
    const px = x + 70, py = y + 30;
    phoneBody(b, px, py, 42, 64, PAL.G3);
    drawTasyaContact(b, px + 3, py + 4, 36, 56, {state: 'call', ...st.contact, f});
    // the screen's cool light on his cheek beside it (skin a rung up in a strip next to the phone's left edge)
    for (let yy = py + 4; yy < py + 50; yy++) for (let xx = px - 5; xx < px; xx++) { const c = b.get(xx, yy); if (skinOf(c)) b.set(xx, yy, stepColor(c, 1)); }
  } else {
    // lowered to his chin: the call over; then the alert: the screen red, its light up his chin
    const px = x + 46, py = y + 104;
    phoneBody(b, px, py, 42, 64, PAL.G3);
    if (phone === 'red') {
      // the alert at the phone's size: the red card, a siren dome, ELGOOG / CODE RED in micro caps
      rect(px + 3, py + 4, 36, 56, b.ink(PAL.R1)); rect(px + 3, py + 4, 36, 8, b.ink(PAL.R2)); rect(px + 3, py + 4, 36, 1, b.ink(PAL.R3));
      const on = Math.floor(f / 6) % 2 === 0;
      for (let j = 0; j < 9; j++) for (let i = -8; i <= 8; i++) if (Math.hypot(i / 8, (j - 9) / 9) < 1) b.set(px + 21 + i, py + 16 + j, j < 4 && Math.abs(i) < 4 ? (on ? PAL.W8 : PAL.W6) : PAL.R3);
      rect(px + 11, py + 25, 20, 2, b.ink(PAL.G2));
      tiny(b, 'ELGOOG', px + 21 - (tinyWidth('ELGOOG') >> 1), py + 32, PAL.P2);
      tiny(b, 'CODE RED', px + 21 - (tinyWidth('CODE RED') >> 1), py + 40, PAL.W7);
      const hits: Array<[number, number]> = [];
      for (let yy = y + 56; yy < y + 100; yy++) for (let xx = x + 20; xx < x + 90; xx++) if (skinOf(b.get(xx, yy)) && !skinOf(b.get(xx, yy + 1))) hits.push([xx, yy]);
      for (const [xx, yy] of hits) b.set(xx, yy, PAL.R3);
    } else drawTasyaContact(b, px + 3, py + 4, 36, 56, {state: 'ended', ...st.contact, f});
  }
  // the hand round the phone's lower half: the thumb on its near edge, four fingertips on its far edge
  const [fx0, fy0] = phone === 'ear' ? [x + 70, y + 66] : [x + 46, y + 140];
  for (let j = 0; j < 22; j++) for (let i = -4; i < 3; i++) { if (Math.hypot((i + 1) / 3.2, (j - 11) / 11) < 1) b.set(fx0 + i, fy0 + j, i < -2 ? PAL.S2 : j < 6 ? PAL.S5 : PAL.S4); }
  for (let k = 0; k < 4; k++) { const ty = fy0 + 2 + k * 5; for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) if (Math.hypot(i - 1.5, j - 1.5) < 2) b.set(fx0 + 41 + i, ty + j, i > 2 ? PAL.S2 : j === 0 ? PAL.S5 : PAL.S4); }
  for (let j = 0; j < 12; j++) for (let i = 0; i < 40; i++) if (Math.hypot((i - 20) / 21, (j - 12) / 10) < 1) b.set(fx0 + 1 + i, fy0 + 22 + j, j < 3 ? PAL.S4 : PAL.S3);
  void ellipse; void hx; void hy;
};

/** [INSERT] the phone on his desk, ringing, filling the frame: the contact large (the red of the tile on the desk) */
export const drawCallScreenECU = (b: Buf, f: number, st: ContactState = {}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 240) / 300, (y - 230) / 160); b.set(x, y, bayer(x, y) < (1 - Math.min(1, d)) * 0.6 ? PAL.R1 : bayer(x, y) < 0.3 ? PAL.G1 : PAL.G2); }
  const w = 160, h = 190, px = 160, py = 8;
  const shake = (st.state ?? 'ringing') === 'ringing' && Math.floor(f / 3) % 2 ? 1 : 0;
  phoneBody(b, px + shake, py, w, h + 10, PAL.G3);
  drawTasyaContact(b, px + shake + 6, py + 8, w - 12, h - 10, {state: 'ringing', ...st, f});
};
