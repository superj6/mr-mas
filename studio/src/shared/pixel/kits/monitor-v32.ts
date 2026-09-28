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
import {Buf, rect, line, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {bigText, bigTextWidth, text, textWidth} from '../font';
import {pt, pw, bpt, bpw, pwrap} from './uitype';
import {isMini, Painter} from './mas-monitor';
import {drawPost, PostSpec} from './post-card';
import {devdayPainter, DevDayState} from './monitor-items';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../cast/mas';
import {putBustCut} from '../cast/civic-kit';

const RH = 203;
/** his post (facts W3: its first sentence, the name swap only), the record's casing */
export const POST_PAUSE: PostSpec = {who: 'mas', text: 'we are pausing new CHATGTP Plus sign-ups for a bit :(', ts: 'NOV 14', hearts: 0};

// ------------------------------------------------------------------ the sign-up page (v32-22.04)
export interface SignupState { spin?: number; btn?: 0 | 1 | 2; typed?: number | null; post?: number | null; }
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
  if (st.post !== null && st.post !== undefined) drawPost(scr, 16, H - 62, POST_PAUSE, {size: 'popup', w: W - 40, k: st.post});
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
  // the stage mic's thin boom at his chin, off the frame's foot
  line(236, 110, 262, RH, b.ink(PAL.N0)); rect(232, 106, 6, 5, b.ink(PAL.G1)); rect(232, 106, 6, 1, b.ink(PAL.G3));
};

// ------------------------------------------------------------------ the tally, framed legibly (v31-18.00)
/** the desk top close: its dark wood in the monitor's cyan, the two faint old marks (worn, broken, a rung down) and,
 *  with `n` 3, the third carved fresh; his glass's base at the frame's edge */
export const drawTallyECU = (b: Buf, f: number, st: {n?: 2 | 3} = {}) => {
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const g = Math.floor(y * 0.35 + Math.sin(x / 60 + y / 50) * 1.5);
    let c: number = g % 4 === 0 && hash(x >> 3, y, 5) < 0.6 ? PAL.D0 : PAL.D1;
    const lit = 1 - x / 520; // the monitor's light from the left
    if (bayer(x, y) < lit * 0.45) c = x < 200 ? PAL.C1 : stepColor(c, 1);
    b.set(x, y, c);
  }
  const mark = (x: number, worn: boolean, seed: number) => {
    for (let j = 0; j < 90; j++) {
      if (worn && hash(j >> 2, seed, 9) < 0.22) continue; // broken, worn smooth in places
      const xx = x + Math.round(j * 0.12);
      rect(xx, 50 + j, 3, 1, b.ink(worn ? PAL.N1 : PAL.N0)); b.set(xx - 1, 50 + j, worn ? PAL.C1 : PAL.C3); // the groove, its lit wall
      if (!worn) b.set(xx + 3, 50 + j, PAL.D3);
    }
  };
  mark(170, true, 1); mark(222, true, 2);
  if ((st.n ?? 2) === 3) mark(274, false, 3);
  // the glass's base in the corner, its ring of light on the wood
  for (let j = -18; j <= 18; j++) for (let i = -60; i <= 60; i++) { const d = Math.hypot(i / 60, j / 18); if (d <= 1) b.set(430 + i, 190 + j, d > 0.9 ? PAL.C5 : d > 0.75 ? PAL.C3 : PAL.C2); }
  void f; void text; void textWidth;
};
