// MR. MAS — kit: ACT THREE's v3.2 ITEMS (Ep1 script draft 8.1, script-v32-notes.md §4 and §10.7; new file, owned by
// the `v3-art-b` pass). Painters for kits/mas-monitor.ts, and the few frames that aren't on the monitor.
//   signupPainter(st)           v32-22.04: the sign-up page (`CHATGTP Plus`): its counter spinning to a blur (never a
//                               figure: the drums smear), `SIGN UP` greying to `NOTIFY ME` (`btn` 0 · 1 · 2), his post
//                               typing in its own compose box (`typed`) and then going up as a card (`post` k, the post
//                               card kit's popup, `POST_PAUSE`)
//   drawRackSlice(b, x0, step)  v32-22.04: the rack's edge beside the monitor in the OTS, its LEDs stepping green →
//                               amber → red, one step a beat (`step` 0 · 1 · 2): launch night's heat, back
//   withTabs(paint, st)         v31-20.08: a browser tab strip over any painter: `tabs`, the `active` one, the one
//                               `closing` (its x lit, then gone): he closes the paper and the next tab (the order) opens
//   drawDevDayFull(b, f, st)    22.01 (draft 8: live, full frame, no monitor, no bezel): the DevDay painter laid out at
//                               the frame's own 480 x 203 (it holds: the painter lays itself out by size)
//   drawDevDayMCU(b, f, st)     22.01's push to [MCU]: MAS on the stage speaking to the hall, the backdrop behind him
//   drawTallyECU(b, f, st)      v31-18.00 (8.1: "framed legibly"): the desk top close, the two faint old marks (and the
//                               third carved, `n` 3), the monitor's light across the wood
// v3.3 (script draft 8.2; additive, opt-in; the `v3-shots-act2-act3` pass):
//   signupPainter({collapse})   P11: once his post is up, it collapses (two held steps) to the post UI's own compact
//                               card at the page's head, so NOTIFY ME stays in sight
//   withReminder(paint, st)     P10 (23.02): the Friday reminder popping up over any page (two held steps): `Board sync`,
//                               `Fri 12:00`, the four attendee circles (kits/phone-high), and the hovered one's card with
//                               the member's small call tile and name (Mada's face under his spinner); a mini for the
//                               plate's small screen
import {Buf, rect, line, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {bigText, bigTextWidth, text, textWidth} from '../font';
import {pt, pw, bpt, bpw, pwrap} from './uitype';
import {isMini, Painter} from './mas-monitor';
import {drawPost, PostSpec} from './post-card';
import {devdayPainter, DevDayState} from './monitor-items';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {putBustCut} from '../cast/civic-kit';
import {attendeeCircles, ATTENDEE_NAMES} from './phone-high';
import {drawAlyiMini} from '../cast/alyi-speak';
import {drawNelehMini} from '../cast/neleh';
import {drawMadaMini, drawSpinner} from '../cast/mada';

const RH = 203;
/** his post (facts W3: its first sentence, the name swap only), the record's casing */
export const POST_PAUSE: PostSpec = {who: 'mas', text: 'we are pausing new CHATGTP Plus sign-ups for a bit :(', ts: 'NOV 14', hearts: 0};

// ------------------------------------------------------------------ the sign-up page (v32-22.04)
export interface SignupState { spin?: number; btn?: 0 | 1 | 2; typed?: number | null; post?: number | null; /** v3.3 (P11): frames since the post began to collapse (null: it stays up) */ collapse?: number | null; }
/** the counter's drums spinning: each digit a vertical smear of digit strips (never a readable number) */
const blurDrums = (b: Buf, x: number, y: number, n: number, f: number, big: boolean) => {
  const dw = big ? 12 : 6, dh = big ? 18 : 9, gap = big ? 3 : 1;
  for (let i = 0; i < n; i++) {
    const dx = x + i * (dw + gap);
    rect(dx, y, dw, dh, b.ink(PAL.P1)); rect(dx, y, dw, 1, b.ink(PAL.P2)); rect(dx, y + dh - 1, dw, 1, b.ink(PAL.G4));
    for (let j = 1; j < dh - 1; j++) for (let q = 1; q < dw - 1; q++) {
      const band = (j + Math.floor(f * (3 + i)) + i * 5) % (big ? 6 : 4);
      if (band < 2 && hash(q, j + f * 7 + i, 11) < 0.55) b.set(dx + q, y + j, band === 0 ? PAL.N3 : PAL.G4);
    }
    if (big && i % 3 === 2 && i < n - 1) rect(dx + dw + 1, y + dh - 3, 1, 3, b.ink(PAL.G5)); // the comma slots
  }
};
export const signupPainter = (st: SignupState = {}): Painter => (scr, f) => {
  const W = scr.w, H = scr.h, mini = isMini(scr), btn = st.btn ?? 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, y < (mini ? 6 : 14) ? PAL.N2 : bayer(x, y) < 0.1 ? PAL.N1 : PAL.N0);
  if (mini) {
    rect(W / 2 - 22, 12, 44, 5, scr.ink(PAL.P1));
    blurDrums(scr, Math.round(W / 2 - 20), 22, 6, (st.spin ?? f), false);
    rect(W / 2 - 16, 40, 32, 8, scr.ink(btn === 2 ? PAL.G2 : btn === 1 ? PAL.G3 : PAL.C5));
    return;
  }
  pt(scr, 'chatgtp.plus', 8, 3, PAL.G5);
  const t = 'CHATGTP Plus';
  bigText(scr, t, Math.round((W - bigTextWidth(t)) / 2), 24, PAL.P2);
  const sub = 'people who signed up this week';
  pt(scr, sub, Math.round((W - pw(sub)) / 2), 46, PAL.G5);
  blurDrums(scr, Math.round(W / 2 - (9 * 15) / 2), 60, 9, st.spin ?? f, true);
  // the button: SIGN UP (live) → greying (a 50% screen, the word knocked) → NOTIFY ME (greyed, the other words)
  const lab = btn === 2 ? 'NOTIFY ME' : 'SIGN UP', bw = bpw(lab) + 28, bh = 22, bx = Math.round((W - bw) / 2), by = 94;
  const col = btn === 0 ? PAL.C5 : PAL.G2;
  rect(bx, by, bw, bh, scr.ink(col)); rect(bx, by, bw, 1, scr.ink(btn === 0 ? PAL.C7 : PAL.G3));
  if (btn === 1) for (let y = by; y < by + bh; y++) for (let x = bx; x < bx + bw; x++) if ((x + y) & 1) scr.set(x, y, PAL.C4);
  const tmp = new Buf(bw, 16, 0); bpt(tmp, lab, 14, 0, 1);
  for (let j = 0; j < 16; j++) for (let i = 0; i < bw; i++) if (tmp.get(i, j) === 1 && !(btn === 1 && (i & 1) && (j & 1))) scr.set(bx + i, by + 4 + j, btn === 0 ? PAL.N0 : PAL.G4);
  // his post: the compose box typing, then the card going up
  if (st.typed !== null && st.typed !== undefined && (st.post === null || st.post === undefined)) {
    const cx = 16, cy = H - 44, cw = W - 32;
    rect(cx, cy, cw, 36, scr.ink(PAL.N2)); rect(cx, cy, cw, 1, scr.ink(PAL.C4));
    pt(scr, 'post as mas', cx + 4, cy + 3, PAL.G5);
    const s = POST_PAUSE.text.slice(0, Math.max(0, Math.floor(st.typed)));
    const ls = pwrap(s, cw - 10);
    ls.slice(-2).forEach((l, i) => pt(scr, l, cx + 4, cy + 14 + i * 10, PAL.P2));
    if (Math.floor(f / 8) % 2 === 0) { const last = ls[ls.length - 1] ?? ''; rect(cx + 4 + pw(last) + 1, cy + 14 + (Math.min(2, ls.length) - 1) * 10, 1, 8, scr.ink(PAL.C6)); }
  }
  // the card goes up over the page's head, so the button under it stays in sight as it greys
  if (st.post !== null && st.post !== undefined) {
    const c = st.collapse;
    if (c === null || c === undefined || c < 0) drawPost(scr, 16, 16, POST_PAUSE, {size: 'popup', w: W - 40, k: st.post});
    else if (c < 3) {
      // the first held step: the card folding up from its foot (its top half, a shadow line under it)
      const tmp = new Buf(W, H, 0x1000000);
      const box = drawPost(tmp, 16, 16, POST_PAUSE, {size: 'popup', w: W - 40, k: st.post});
      const keep = 16 + Math.round(box.h * 0.45);
      for (let y = 0; y < keep; y++) for (let x = 0; x < W; x++) { const v = tmp.get(x, y); if (v !== 0x1000000) scr.set(x, y, v); }
      rect(16, keep, W - 40, 1, scr.ink(PAL.N0));
    } else drawPost(scr, 16, 16, POST_PAUSE, {size: 'notify', w: W - 40, k: 99});
  }
};

// ------------------------------------------------------------------ v3.3 (P10): the Friday reminder over his page
export interface ReminderState { /** frames since it popped up (< 0: not yet) */ k: number; /** the circle the Orb's iris is on (its card shows) */ hover?: 0 | 1 | 2 | 3 | null; }
export const withReminder = (paint: Painter, st: ReminderState): Painter => (scr, f) => {
  paint(scr, f);
  if (st.k < 0) return;
  const W = scr.w;
  if (isMini(scr)) {
    // the small screen: a dark card at the top right, its title bar and four dots
    const cw = Math.min(36, W - 4), x = W - cw - 2, y = 7;
    rect(x - 1, y - 1, cw + 2, 16, scr.ink(PAL.N0)); rect(x, y, cw, 14, scr.ink(PAL.N2)); rect(x, y, cw, 2, scr.ink(PAL.R2));
    for (let i = 0; i < 4; i++) rect(x + 3 + i * 6, y + 7, 4, 4, scr.ink(i === 3 ? PAL.N0 : PAL.G4));
    return;
  }
  // at the page's lower right, clear of his collapsed post at its head and of the NOTIFY ME button
  const cw = 124, ch = 104, x = W - cw - 4, y = Math.max(20, Math.min(50, scr.h - ch - 8));
  const open = st.k < 2 ? 0.35 : 1; // it pops up in two held steps
  const hh = Math.round(ch * open);
  rect(x + 3, y + 3, cw, hh, scr.ink(PAL.N0)); rect(x - 1, y - 1, cw + 2, hh + 2, scr.ink(PAL.G3)); rect(x, y, cw, hh, scr.ink(PAL.N2));
  if (open < 1) return;
  // the calendar icon, the title and the time
  rect(x + 5, y + 8, 14, 14, scr.ink(PAL.P2)); rect(x + 5, y + 8, 14, 4, scr.ink(PAL.R2)); scr.set(x + 8, y + 7, PAL.G5); scr.set(x + 15, y + 7, PAL.G5);
  pt(scr, '17', x + 8, y + 13, PAL.N1);
  const tx0 = x + 23, ttl = 'Board sync';
  bpt(scr, ttl, tx0, y + 6, PAL.P2);
  pt(scr, 'Fri 12:00', tx0, y + 24, PAL.C6);
  // the four attendee circles, the invite's own (a doorway, a glowing page, a spinner, a black square)
  const cs = attendeeCircles(scr, x + 10, y + 38, f, 8);
  if (st.hover !== null && st.hover !== undefined) {
    const [cx, cy] = cs[st.hover];
    rect(cx - 10, cy - 10, 21, 21, scr.ink(PAL.C5)); // the iris's ring, drawn behind the circle it has reached
    attendeeCircles(scr, x + 10, y + 38, f, 8);
    // its card under the circles: the member's small call tile over the name
    const nm = ATTENDEE_NAMES[st.hover], nw = pw(nm);
    const tw = 44, th = 38, tx = Math.min(W - Math.max(tw, nw + 6) - 2, Math.max(x + 4, Math.min(x + cw - tw - 4, cx - (tw >> 1)))), ty = y + 62;
    rect(tx - 1, ty - 1, tw + 2, th + 2, scr.ink(PAL.N0)); rect(tx, ty, tw, th, scr.ink(PAL.G1)); scr.set(cx, ty - 1, PAL.G1); scr.set(cx, ty - 2, PAL.N0);
    if (st.hover === 0) drawAlyiMini(scr, tx + 3, ty + 3); else if (st.hover === 1) drawNelehMini(scr, tx + 3, ty + 3);
    else if (st.hover === 2) { drawMadaMini(scr, tx + 3, ty + 3); drawSpinner(scr, tx + 22, ty + 7, f, {size: 'sm'}); }
    else { rect(tx + 3, ty + 3, 38, 22, scr.ink(PAL.N0)); rect(tx + 18, ty + 10, 8, 8, scr.ink(PAL.N1)); }
    if (nw <= tw - 4) pt(scr, nm, tx + Math.round((tw - nw) / 2), ty + 27, PAL.P2);
    else { rect(tx + tw, ty + 26, nw - tw + 6, 11, scr.ink(PAL.G1)); pt(scr, nm, tx + 3, ty + 27, PAL.P2); }
  }
};

// ------------------------------------------------------------------ the rack beside him (v32-22.04)
/** the rack's near edge at the OTS frame's right: its dark rails, two columns of LEDs, all one colour per step */
export const drawRackSlice = (b: Buf, x0: number, step: 0 | 1 | 2, f = 0) => {
  const on = [PAL.L3, PAL.W5, PAL.R3][step], dim = [PAL.L1, PAL.W3, PAL.R1][step];
  for (let y = 0; y < RH; y++) for (let x = x0; x < 480; x++) b.set(x, y, x === x0 ? PAL.G2 : x === x0 + 1 ? PAL.N0 : (y % 16) < 2 ? PAL.N2 : PAL.N1);
  for (let r = 0; r < 12; r++) for (let c = 0; c < 2; c++) {
    const lx = x0 + 8 + c * 14, ly = 8 + r * 16;
    if (lx >= 479) continue;
    const blink = (Math.floor((f * 2) / 15) + r + c) % 3 !== 0;
    rect(lx, ly, 3, 2, b.ink(blink ? on : dim));
    if (step === 2 && blink) { b.set(lx - 1, ly, stepColor(b.get(lx - 1, ly), 1)); b.set(lx + 3, ly + 1, stepColor(b.get(lx + 3, ly + 1), 1)); } // the red's bloom
  }
};

// ------------------------------------------------------------------ the tabs (v31-20.08)
export interface TabsState { tabs: string[]; active: number; /** the tab being closed: its x lit (the click); it goes on the caller's next state */ closing?: number | null; }
export const withTabs = (paint: Painter, st: TabsState): Painter => (scr, f) => {
  paint(scr, f);
  const W = scr.w, mini = isMini(scr), h = mini ? 5 : 12;
  rect(0, 0, W, h, scr.ink(PAL.N0));
  const tw = Math.min(mini ? 30 : 130, Math.floor((W - 8) / Math.max(1, st.tabs.length)));
  st.tabs.forEach((t, i) => {
    const x = 4 + i * (tw + 2), act = i === st.active;
    rect(x, 1, tw, h - 1, scr.ink(act ? PAL.N3 : PAL.N1)); if (act) rect(x, 1, tw, 1, scr.ink(PAL.C5));
    if (mini) return;
    let s = t; while (s.length > 1 && pw(s) > tw - 16) s = s.slice(0, -2) + '…';
    pt(scr, s, x + 4, 3, act ? PAL.P2 : PAL.G4);
    const cx = x + tw - 8, lit = st.closing === i;
    if (lit) rect(cx - 2, 2, 8, 8, scr.ink(PAL.R2));
    for (let k = 0; k < 4; k++) { scr.set(cx + k, 4 + k, lit ? PAL.P2 : PAL.G4); scr.set(cx + 3 - k, 4 + k, lit ? PAL.P2 : PAL.G4); }
  });
};

// ------------------------------------------------------------------ DevDay, live (22.01)
/** the stage full frame: the painter drawn straight at the frame's size (no monitor, no bezel) */
export const drawDevDayFull = (b: Buf, f: number, st: DevDayState) => {
  const scr = new Buf(480, RH, PAL.N0);
  devdayPainter(st)(scr, f);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, scr.get(x, y));
};
/** the push to [MCU]: MAS at the centre mark speaking to the hall, the backdrop's cyan behind him, the hall dark */
export const drawDevDayMCU = (b: Buf, f: number, st: {mas?: Partial<MasPortraitState>} = {}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const t = y / 150 + (bayer(x, y) - 0.5) * 0.2;
    b.set(x, y, x < 40 || x > 440 ? (bayer(x, y) < 0.15 ? PAL.N2 : PAL.N1) : t < 0.4 ? PAL.C1 : t < 0.8 ? PAL.C2 : PAL.C3);
  }
  // the backdrop's word, huge and cut by the frame behind him (a stage, never a caption)
  bigText(b, 'DEVDAY', 300, 36, PAL.C5, {shadow: PAL.C0});
  putBustCut(b, masPortrait({...MAS_PORTRAIT_DEFAULT, head: 'front', light: 'monitor', ...st.mas}), 150, 24, RH);
  // a lavalier mic clipped to the hoodie's neckline (a stage, not a podium: no boom across his face)
  rect(222, 118, 3, 3, b.ink(PAL.N0)); b.set(223, 118, PAL.G4);
};

// ------------------------------------------------------------------ the tally, framed legibly (v31-18.00)
/** the desk top close: its dark wood in the monitor's cyan, the two faint old marks (worn, broken, a rung down) and,
 *  with `n` 3, the third carved fresh; his glass's base at the frame's edge */
export const drawTallyECU = (b: Buf, f: number, st: {n?: 2 | 3} = {}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const g = Math.floor(y * 0.35 + Math.sin(x / 60 + y / 50) * 1.5);
    let c: number = g % 4 === 0 && hash(x >> 3, y, 5) < 0.6 ? PAL.D0 : PAL.D1;
    const lit = 1 - x / 480; // the monitor's light from the left, falling off across the wood
    if (bayer(x, y) < lit * 0.55) c = stepColor(c, 1);
    b.set(x, y, c);
  }
  // each mark a groove 4 px wide, its far wall catching the monitor's cyan, its floor dark; the old two worn (broken,
  // shallower), the third fresh
  const mark = (x: number, worn: boolean, seed: number) => {
    for (let j = 0; j < 96; j++) {
      if (worn && hash(j >> 2, seed, 9) < 0.2) continue;
      const xx = x + Math.round(j * 0.14);
      b.set(xx - 1, 48 + j, worn ? PAL.C2 : PAL.C4); // the lit wall
      rect(xx, 48 + j, worn ? 2 : 3, 1, b.ink(PAL.N0)); // the floor
      b.set(xx + (worn ? 2 : 3), 48 + j, worn ? PAL.D2 : PAL.D3); // the near lip
    }
  };
  mark(170, true, 1); mark(222, true, 2);
  if ((st.n ?? 2) === 3) mark(274, false, 3);
  // the glass's base in the corner, its ring of light on the wood
  for (let j = -18; j <= 18; j++) for (let i = -60; i <= 60; i++) { const d = Math.hypot(i / 60, j / 18); if (d <= 1) b.set(430 + i, 190 + j, d > 0.9 ? PAL.C5 : d > 0.75 ? PAL.C3 : PAL.C2); }
  void f; void text; void textWidth;
};
