// MR. MAS — kit: THE ORDER'S SIGNING, on Mas's monitor (Ep1 sc 21; new file, owned by the `v3-art-b` pass). NEDIB at the
// signing desk, his fountain pen raised, over an order that runs off both ends of a very big desk (the beat plan's
// 21.02); his cut-paper copies pop up and add to his sentence (behind the desk, then at the window); he turns to look at
// them; he signs, in ink; the copies clap, and keep clapping. The character file's staging rule holds: always seated at
// the desk or signing. NEDIB's prop set is the scroll and the pen (guardrails §2a rule 4, RUMPT's props at equal weight).
// A generic office: gold drapes, a tall window, a cream wall; no seal, no flag, no real room's furniture.
// Neleh's paper egg sits in the screen's corner (kits/mas-monitor eggCorner; zero read load).
//   eoPainter(st)   a painter for kits/mas-monitor (POV) or the dark room's two-shot screen (the mini: the three NEDIBs
//                   side by side, small, so the Orb's iris has something to read, 21.04).
//     st.copies    0, 1, 2 copies up · st.pop k: the newest copy's rise (3 held steps from behind the desk / the sill)
//     st.pen       'raised' | 'sign' (the pen on the page: `signK` the signature's strokes) · st.turn: NEDIB looks at
//                  the copies · st.clap: the copies' two clapping drawings on 4s · st.mouth / st.copyMouth
//     st.stat      the corner chip `DEEPFAKES OF ME: SEEN n` (null = none) · st.egg: Neleh's paper in the corner
//   EO_POV_FACES   where the three heads sit on the POV screen (the Orb's look reads off the mini's own table)
import {Buf, rect, line, hash, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg} from '../figure';
import {pt, pw} from './uitype';
import {isMini, eggCorner, Painter} from './mas-monitor';
import {nedibBust, NEDIB_BUST_DEFAULT} from '../cast/nedib';
import type {Viseme} from '../cast/talk';
import {putBustCut} from '../cast/civic-kit';

export interface EOState {
  copies: 0 | 1 | 2;
  pop?: number;
  pen: 'raised' | 'sign';
  signK?: number;
  turn?: boolean;
  clap?: boolean;
  mouth?: Viseme;
  copyMouth?: Viseme;
  stat?: number | null;
  egg?: boolean;
}
/** the office behind the desk: cream wall, gold drapes both sides, a tall window centre-right with daylight */
const office = (scr: Buf, mini: boolean) => {
  const W = scr.w, H = scr.h;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const d = x < W * 0.12 || x > W * 0.88;
    const fold = d && x % (mini ? 3 : 7) === 0;
    scr.set(x, y, d ? (fold ? PAL.W3 : x < W / 2 ? PAL.W5 : PAL.W4) : bayer(x, y) < 0.2 ? PAL.P0 : PAL.P1);
  }
  const wx0 = Math.round(W * 0.6), wx1 = Math.round(W * 0.82), wy0 = Math.round(H * 0.08), wy1 = Math.round(H * 0.55);
  for (let y = wy0; y < wy1; y++) for (let x = wx0; x < wx1; x++) scr.set(x, y, y < wy0 + (wy1 - wy0) * 0.6 ? (bayer(x, y) < 0.5 ? PAL.F6 : PAL.G6) : PAL.L2);
  rect(Math.round((wx0 + wx1) / 2), wy0, 1, wy1 - wy0, scr.ink(PAL.P2)); rect(wx0, Math.round((wy0 + wy1) / 2), wx1 - wx0, 1, scr.ink(PAL.P2));
  rect(wx0 - 1, wy0 - 1, wx1 - wx0 + 2, 1, scr.ink(PAL.P2)); rect(wx0 - 1, wy1, wx1 - wx0 + 2, 2, scr.ink(PAL.P0));
  return {win: {x0: wx0, x1: wx1, y0: wy0, y1: wy1}};
};
/** the very big desk and the order across it, running off both ends of the desk and out of frame */
const desk = (scr: Buf, y0: number, mini: boolean, signK: number) => {
  const W = scr.w, H = scr.h;
  for (let y = y0; y < H; y++) for (let x = 0; x < W; x++) scr.set(x, y, y === y0 ? PAL.D4 : y < y0 + (mini ? 2 : 5) ? PAL.D3 : (x + (y >> 1)) % (mini ? 9 : 23) === 0 ? PAL.D1 : PAL.D2);
  // the order: a long pale strip across the whole desk, curling down over both ends (it goes on out of frame)
  const py = y0 + (mini ? 1 : 3), ph = mini ? 4 : 12;
  for (let x = 0; x < W; x++) for (let j = 0; j < ph; j++) scr.set(x, py + j, j === 0 ? PAL.W9 : j === ph - 1 ? PAL.P0 : ((x >> 1) + j) % 4 === 0 && j > 2 ? PAL.G5 : PAL.P2);
  if (!mini) for (const ex of [0, W - 14]) for (let y = py; y < H; y++) for (let i = 0; i < 14; i++) scr.set(ex + i, y, i === 0 || i === 13 ? PAL.P0 : (y + i) % 5 === 0 ? PAL.G5 : PAL.P2);
  // the signature going on (ink, left to right, in held strokes)
  if (signK > 0 && !mini) { const sx = Math.round(W / 2 - 30); for (let i = 0; i < Math.min(60, signK * 12); i++) scr.set(sx + i, py + 6 + Math.round(Math.sin(i / 3) * 2), PAL.N1); }
  return {py};
};
export const EO_POV_FACES = {real: [178, 60] as [number, number], copyL: [74, 58] as [number, number], copyR: [300, 44] as [number, number]};
/** the short layout's placement (screen coords): the busts' top, the real NEDIB's x (the toast goes over his head) */
export const EO_SHORT = {y: -20, realX: 96};
export const eoPainter = (st: EOState): Painter => (scr, f) => {
  const mini = isMini(scr);
  const W = scr.w, H = scr.h;
  const {win} = office(scr, mini);
  const clapArm = st.clap ? (Math.floor(f / 4) % 2 ? 'clap1' : 'clap0') : 'down';
  if (mini) {
    // three small NEDIBs: the real one behind the desk's centre with the pen; the copies left and at the window,
    // white-edged (cut paper), their ties the wrong green
    const face = (cx: number, cy: number, copy: boolean) => {
      if (copy) for (let j = -5; j <= 8; j++) for (let i = -5; i <= 5; i++) if (Math.hypot(i / 5.5, j / 6.5) <= 1.25) scr.set(cx + i, cy + j, PAL.P2);
      rect(cx - 4, cy - 4, 8, 3, scr.ink(PAL.G6)); rect(cx - 3, cy - 5, 6, 1, scr.ink(PAL.W6)); // hair and the aviators
      rect(cx - 3, cy - 1, 6, 5, scr.ink(copy ? PAL.S5 : PAL.S4)); scr.set(cx - 2, cy + 1, PAL.N0); scr.set(cx + 1, cy + 1, PAL.N0);
      rect(cx - 5, cy + 4, 10, 5, scr.ink(PAL.N2)); scr.set(cx, cy + 5, copy ? PAL.L3 : PAL.N6); scr.set(cx, cy + 6, copy ? PAL.L3 : PAL.N6);
    };
    face(Math.round(W / 2), Math.round(H * 0.48), false);
    if (st.pen === 'raised') line(Math.round(W / 2) + 6, Math.round(H * 0.56), Math.round(W / 2) + 9, Math.round(H * 0.44), scr.ink(PAL.N0));
    if (st.copies >= 1) face(Math.round(W * 0.22), Math.round(H * 0.46), true);
    if (st.copies >= 2) face(Math.round((win.x0 + win.x1) / 2), Math.round((win.y0 + win.y1) / 2), true);
    desk(scr, Math.round(H * 0.66), true, 0);
    if (st.egg) eggCorner(scr, f, 'tr');
    return;
  }
  // the POV: the copies behind (pop in 3 held steps from behind the desk / up past the window's sill), NEDIB centre
  // v3.1 (21.04's 2S·SCR: the two-shot's big monitor, 216 x 120): a short screen raises the busts so their faces clear
  // the desk (EO_SHORT); the POV layout is unchanged
  const short = H < 150;
  const deskY = Math.round(H * (short ? 0.8 : 0.72));
  const rise = (k: number) => [40, 24, 10, 0][Math.min(3, Math.max(0, k))];
  if (st.copies >= 2) {
    const k = st.copies === 2 ? (st.pop ?? 3) : 3;
    const im = nedibBust({...NEDIB_BUST_DEFAULT, copy: 2, arm: clapArm, mouth: st.copyMouth ?? 'smile'});
    // at the window: clipped to the window's frame (he stands outside it, looking in)
    const X = win.x0 - 18, Y = win.y0 - 6 + rise(k);
    for (let j = 0; j < im.h; j++) for (let i = 0; i < im.w; i++) { const v = im.c[j * im.w + i]; const x = X + i, y = Y + j; if (v >= 0 && x >= win.x0 && x < win.x1 && y >= win.y0 && y < win.y1) scr.set(x, y, v); }
  }
  if (st.copies >= 1) {
    const k = st.copies === 1 ? (st.pop ?? 3) : 3;
    const im = nedibBust({...NEDIB_BUST_DEFAULT, copy: 1, arm: clapArm, mouth: st.copies === 1 ? (st.copyMouth ?? 'smile') : 'smile'});
    putBustCut(scr, im, short ? -14 : 20, (short ? EO_SHORT.y : 24) + rise(k), deskY);
  }
  const real = nedibBust({...NEDIB_BUST_DEFAULT, arm: st.pen === 'sign' ? 'sign' : 'baton', mouth: st.mouth ?? 'smile', look: st.turn ? -1 : 0, brow: st.turn ? -1 : 0});
  putBustCut(scr, real, short ? EO_SHORT.realX : 124, short ? EO_SHORT.y : 22, deskY);
  desk(scr, deskY, false, st.pen === 'sign' ? (st.signK ?? 5) : 0);
  // his hand and pen on the order when he signs (from the sleeve at the bust's lower left)
  if (st.pen === 'sign') {
    const hx = Math.round(W / 2 - 4), hy = deskY + 2;
    for (let j = -8; j < 6; j++) for (let i = -10; i < 12; i++) if (Math.hypot(i / 11, j / 7) < 1) scr.set(hx + i, hy + j, i < -3 ? PAL.S5 : PAL.S4);
    line(hx - 12, hy + 4, hx - 2, hy - 4, scr.ink(PAL.N0)); scr.set(hx - 13, hy + 5, PAL.W6);
  }
  // the stat chip in the corner (his card's stat row), and the egg
  if (st.stat !== null && st.stat !== undefined) {
    const s = `DEEPFAKES OF ME: SEEN ${st.stat}`;
    rect(8, H - 20, pw(s) + 12, 13, scr.ink(PAL.N1)); rect(8, H - 20, 2, 13, scr.ink(PAL.W6));
    pt(scr, s, 14, H - 17, PAL.P2);
  }
  if (st.egg) eggCorner(scr, f, 'tr');
  void hash; void stepColor; void blitImg;
};
