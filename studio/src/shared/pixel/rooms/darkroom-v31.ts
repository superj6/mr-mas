// MR. MAS — shared room: MAS'S DARK ROOM, the v3.1 two-shot with the monitor LARGE (Ep1 script draft 7; new file, owned
// by the `v3-art-b` pass). v31-19.03 (the hands runner, one held room frame) and 21.04 (three NEDIBs, now two: the Orb's
// toast over the real one) want the monitor big enough to follow inside the two-shot. This is the dark room from the
// monitor's other side: the plate (rooms/darkroom-plate.ts, not edited) behind, its small monitor painted out, the big
// monitor at frame right, Mas at the desk facing it (cast/mas-medium flipped: nothing on him is lettering), the Orb at
// his far shoulder.
//   drawDark2SSCR(b, f, st)   st.screen (any painter: kits/monitor-v31 runnerPainter, kits/eo-signing eoPainter, ...),
//                             st.hand: Mas copies for the Orb: 'two' (two fingers up) · 'pinky' · 'up' (the whole hand;
//                             "i've had mine up since may.") · 'lower' (coming down) · null
//                             st.orb: 'whirr' (the aperture ticking, as if counting) · 'rotate' (a turn) · 'rise' (one
//                             pixel up) · 'look' (still) · its `look` vector; st.toasts: the Orb's toasts (over the
//                             real NEDIB on the monitor: DARK_SCR.screen + EO_POV-style coordinates scaled by the caller)
//                             v3.2: hand 'switch' (he reaches over to the switch on the bezel's near corner) and
//                             `off` (v32-21.06: the glass black in one step)
//   DARK_SCR                  the big monitor's screen rect (216 x 120) and Mas's / the Orb's anchors
import {Buf, rect, line, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {drawDarkPlate, drawDarkPlateDesk, drawDarkPlateFront, DPLATE, DarkPlateOpts} from './darkroom-plate';
import * as MM from '../cast/mas-medium';
import * as OM from '../cast/orb-medium';
import {screenScanlines, Painter} from '../kits/mas-monitor';
import {drawToast, ToastKind} from '../kits/orb-toast';
import {drawOrbOutline} from './darkroom-act3';

export const DARK_SCR = {screen: {x: 250, y: 12, w: 216, h: 120}, mas: [96, 44] as [number, number], orb: [70, 58] as [number, number]};
export interface Dark2SSCRState {
  screen?: Painter;
  mas?: Partial<MM.MasMediumState>;
  hand?: 'two' | 'pinky' | 'up' | 'lower' | 'switch' | null;
  /** v3.2 (v32-21.06): the monitor switched off: the glass black in one step, its LED out */
  off?: boolean;
  orb?: {mode?: 'whirr' | 'rotate' | 'rise' | 'look'; look?: [number, number]} | null;
  plate?: DarkPlateOpts;
  toasts?: Array<{s: string; k: number; kind?: ToastKind; x: number; y: number; anchor?: 'left' | 'right'}>;
}
/** his raised hand at medium scale (a head is ~22 px here, so a hand ~10 x 12), the back of it toward us, lit by the
 *  monitor on its right: o outline, L lit, l the shade side; fingers 2 px wide */
const HANDS: Record<'two' | 'pinky' | 'up' | 'lower', string[]> = {
  two: ['.oo.oo.....', '.LL.LL.....', '.LL.LL.....', '.LL.LL.....', '.LLoLLo....', 'oLLLLLLo...', 'oLLLLLLLo..', 'olLLLLLLo..', 'olLLLLLlo..', '.olllllo...', '..ollllo...', '...oooo....'],
  pinky: ['.......oo..', '.......LL..', '.......LL..', '.......LL..', '..ooooLLLo.', '.oLLLLLLLo.', 'oLLLLLLLLo.', 'olLLLLLLLo.', 'olLLLLLLlo.', '.ollllllo..', '..olllllo..', '...ooooo...'],
  up: ['.oo.oo.oo..', '.LLoLLoLLo.', '.LLoLLoLLoo', '.LLoLLoLLLo', 'oLLLLLLLLLo', 'oLLLLLLLLLo', 'LLLLLLLLLLo', 'olLLLLLLLLo', '.olLLLLLllo', '..olllllo..', '...ooooo...', '...........'],
  lower: ['...........', '...........', '...........', '...........', '..ooooo....', '.oLLLLLo...', 'oLLLLLLLo..', 'olLLLLLLo..', 'olLLLLLlo..', '.olllllo...', '..ollllo...', '...oooo....'],
};
const drawHand = (b: Buf, x: number, y: number, kind: keyof typeof HANDS, drop = 0) => {
  const pal: Record<string, number> = {o: PAL.X1, L: PAL.K3, l: PAL.K2};
  // the forearm in the hoodie sleeve: the elbow on the desk, up to the wrist under the hand (its lit edge toward the
  // monitor, frame right), the cuff
  const wx = x + 4, wy = y + 11 + drop, ex = x - 6, ey = DPLATE.deskY - 2;
  const L = Math.hypot(wx - ex, wy - ey), ux = (wx - ex) / L, uy = (wy - ey) / L;
  for (let t = 0; t <= L; t += 0.5) for (let s = -4; s <= 4; s += 0.5) {
    const X = Math.round(ex + ux * t - uy * s), Y = Math.round(ey + uy * t + ux * s);
    b.set(X, Y, s >= 3.5 ? PAL.C4 : s <= -3.5 ? PAL.N0 : t > L - 3 ? PAL.G3 : s > 1 ? PAL.G2 : PAL.G1);
  }
  HANDS[kind].forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i, y + j + drop, c); } });
};
/** his near arm reaching across the desk to the monitor's switch: the hoodie sleeve from his shoulder, the hand with one
 *  finger on the button (lit by the screen, camera-right) */
const reachSwitch = (b: Buf, mx: number, sx: number, sy: number) => {
  // two segments: the upper arm down and forward from his shoulder to the elbow, the forearm out to the switch
  const seg = (ax: number, ay: number, zx: number, zy: number, w: number, cuff: boolean) => {
    const L = Math.hypot(zx - ax, zy - ay), ux = (zx - ax) / L, uy = (zy - ay) / L;
    for (let t = 0; t <= L; t += 0.5) for (let s = -w; s <= w; s += 0.5) {
      const X = Math.round(ax + ux * t - uy * s), Y = Math.round(ay + uy * t + ux * s);
      b.set(X, Y, s <= -w + 0.5 ? PAL.C4 : s >= w - 0.5 ? PAL.N0 : cuff && t > L - 3 ? PAL.G3 : s < -1 ? PAL.G2 : PAL.G1);
    }
  };
  const shx = mx + 56, shy = 84, elx = mx + 74, ely = 112, hx = sx - 9, hy = sy - 4;
  seg(shx, shy, elx, ely, 5, false);
  seg(elx, ely, hx, hy, 4.5, true);
  for (let j = 0; j < 10; j++) for (let i = 0; i < 12; i++) { const d = Math.hypot((i - 6) / 6, (j - 5) / 5); if (d <= 1) b.set(hx - 5 + i, hy - 5 + j, d > 0.85 ? PAL.X1 : i > 7 ? PAL.K3 : PAL.K2); }
  rect(hx + 5, hy - 1, 4, 2, b.ink(PAL.K3)); b.set(hx + 8, hy - 1, PAL.K4); // the finger on the button
};
export const drawDark2SSCR = (b: Buf, f: number, st: Dark2SSCRState = {}) => {
  const o: DarkPlateOpts = {tally: 2, glass: true, ...st.plate};
  drawDarkPlate(b, f, o);
  // the plate's own small monitor painted out: the wall runs on (the camera has come round the desk)
  for (let y = DPLATE.mon.topL - 6; y < DPLATE.deskY + 10; y++) for (let x = 0; x < DPLATE.mon.x1 + 16; x++) b.set(x, y, stepColor(b.get(x + 96, y), -1));
  drawOrbOutline(b, {filled: false});
  // the Orb at his far shoulder: whirring (the aperture ticks), rotating, or up one pixel
  if (st.orb !== null) {
    const mode = st.orb?.mode ?? 'look';
    const [ox, oy0] = DARK_SCR.orb;
    const oy = oy0 + OM.orbBob(f) - (mode === 'rise' ? 1 : 0);
    const look: [number, number] = st.orb?.look ?? (mode === 'rotate' ? ([[0.9, 0.1], [0.6, -0.3], [0.2, -0.5]][Math.floor(f / 6) % 3] as [number, number]) : [0.9, 0.1]);
    const ap = mode === 'whirr' ? [0.3, 0.8, 0.5][Math.floor(f / 3) % 3] : 0.5;
    OM.drawOrb(b, ox, oy, OM.ORB_MR, {look, aperture: ap, monitor: 1});
    if (mode === 'whirr' && Math.floor(f / 3) % 2 === 0) { b.set(ox - OM.ORB_MR - 3, oy - 2, PAL.C5); b.set(ox - OM.ORB_MR - 5, oy, PAL.C4); b.set(ox - OM.ORB_MR - 3, oy + 2, PAL.C5); }
  }
  // MAS at the desk facing the monitor (flipped), his hands in his lap unless one is up
  const hand = st.hand ?? null;
  // he leans toward the monitor to reach its switch (18 px: the medium's arm can't span the desk otherwise)
  const mx = DARK_SCR.mas[0] + (hand === 'switch' ? 18 : 0), my = DARK_SCR.mas[1];
  MM.drawMasMedium(b, mx, my, {...MM.MAS_MEDIUM_DEFAULT, arm: hand ? 'down' : 'rest', look: 1, ...st.mas}, {flip: true, desk: (bb) => {
    drawDarkPlateDesk(bb, f, o);
    // the monitor's pool across the desk from the right
    for (let y = DPLATE.deskY + 1; y < DPLATE.nearY; y++) for (let x = 250; x < 480; x++) if (bayer(x, y) < 0.3 - (480 - x) / 900) bb.set(x, y, stepColor(bb.get(x, y), 1));
  }});
  if (hand && hand !== 'switch') drawHand(b, mx + 62, 70, hand, hand === 'lower' ? 22 : 0);
  // the big monitor at frame right, standing on the desk (drawn after the desk: its foot sits on the desk's top), the
  // screen at 1:1
  const S = DARK_SCR.screen;
  const footY = S.y + S.h + 12;
  rect(S.x + S.w / 2 - 8, S.y + S.h + 6, 16, footY - (S.y + S.h + 6), b.ink(PAL.G1)); rect(S.x + S.w / 2 - 8, S.y + S.h + 6, 1, footY - (S.y + S.h + 6), b.ink(PAL.C3));
  rect(S.x + S.w / 2 - 26, footY, 52, 3, b.ink(PAL.G1)); rect(S.x + S.w / 2 - 26, footY, 52, 1, b.ink(PAL.G3)); rect(S.x + S.w / 2 - 24, footY + 3, 50, 1, b.ink(PAL.N0));
  rect(S.x - 7, S.y - 6, S.w + 14, S.h + 13, b.ink(PAL.G0)); rect(S.x - 7, S.y - 6, S.w + 14, 1, b.ink(PAL.G2)); rect(S.x - 1, S.y - 1, S.w + 2, S.h + 2, b.ink(PAL.N0));
  b.set(S.x + S.w + 3, S.y + S.h + 3, PAL.L3);
  const scr = new Buf(S.w, S.h, PAL.N0);
  if (st.off) {
    // off: black glass, the room's faint reflection in it (the window's glow, a sheen streak), the LED out
    for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) scr.set(x, y, bayer(x, y) < 0.05 + (S.h - y) / 2400 ? PAL.N1 : PAL.N0);
    for (let j = 0; j < S.h; j++) { const x = 40 + Math.round(j * 0.5); if (x < S.w && bayer(x, j) < 0.5) scr.set(x, j, PAL.N2); }
    b.set(S.x + S.w + 3, S.y + S.h + 3, PAL.G1);
  } else {
    (st.screen ?? ((s: Buf) => rect(0, 0, s.w, s.h, s.ink(PAL.N1))))(scr, f);
    screenScanlines(scr);
  }
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) b.set(S.x + x, S.y + y, scr.get(x, y));
  // v3.2: the power switch on the bezel's near corner (bottom-left), and his hand on it: he reaches over and presses
  rect(S.x - 5, S.y + S.h + 2, 4, 3, b.ink(st.off ? PAL.G1 : PAL.G3));
  if (hand === 'switch') reachSwitch(b, mx, S.x - 3, S.y + S.h + 3);

  drawDarkPlateFront(b, f, o);
  for (const t of st.toasts ?? []) drawToast(b, t.x, t.y, t.s, t.k, {kind: t.kind, anchor: t.anchor, f});
};
void line;
