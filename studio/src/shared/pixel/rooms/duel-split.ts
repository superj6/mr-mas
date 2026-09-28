// MR. MAS — shared set: THE DUEL, sc 11's [SPLIT]: INT. NOPEAI BULLPEN / MISANTHROPIC LIGHTHOUSE — DAY, and its
// match-cut arrival (draft 6's 11.01). New file (v3-art-a, 2026-09-27).
// The two panes (238 x 203 each, a 4 px black divider at x 238-241, Act Four's grammar for the board's call to the
// lighthouse): LEFT the day bullpen (rooms/bullpen.ts, Act Four's back wall) set up as a demo stage (the hand-lettered
// GTP-4 banner, a demo monitor on a rolling stand, a livestream camera), Mas at his end desk behind it, Gerg with a
// napkin sketch that he photographs and that becomes a website (the demo screen's caption NAPKIN → WEBSITE), the
// bullpen cheering in two held drawings, Mas holding up his phone and his post popping in his own lowercase;
// RIGHT the lighthouse (rooms/lighthouse.ts, no rent meters in Mar 2023), CLOD on a plinth under a can light (cast/
// clod.ts: unlit, then the launch light slams on), Mario beside it dictating his memo onto a scroll, looking up at the
// split line, reading the post on his phone; phrase 4: a second, longer scroll unrolls across the split into the left
// pane and its end lands on Gerg's desk; Gerg photographs it; MEMO → WEBSITE; Mario holds the empty spindle.
// The left pane's pieces are PORTED from the style-range prototype dev/range/ep1-p1/pixel.ts (its demo screen, banner,
// tripod camera, Gerg's raised arm, Mas's raised phone, the cheering coworker and the day re-light maps), made
// state-driven here (the prototype ran on its own clip's frame list); the prototype is not edited.
//   drawDuelSplit(fb, f, st)     both panes and what crosses them (the scroll, the post)
//   drawDuelLeft(b, f, st)       the left pane alone (238 x 203 at b's origin)
//   drawDuelRight(b, f, st)      the right pane alone
//   drawDemoArrival(b, f, st)    11.01 [W] full frame: the bullpen dressed as the demo stage, Gerg's laptop opening at
//                                exactly the lobby's LOBBY_LID position (the match cut from 9.13)
//   DUEL                         the pane geometry and the crossing's path
import {Buf, rect, line, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor, familyOf, lightness} from '../palette';
import {text} from '../font';
import {blitImg} from '../figure';
import type {Img} from '../figure';
import {drawBullpen} from './bullpen';
import {drawLighthouse, LIGHTHOUSE} from './lighthouse';
import {tiny, tinyWidth} from './kit-b';
import {drawGergTable, GERG_DEFAULT, gergTypeAt} from '../cast/gerg';
import {drawMasDesk, MAS_DESK_DEFAULT} from '../cast/mas';
import {marioImg, MARIO_BASE, MarioPose, MARIO_W, drawScroll} from '../cast/mario';
import {drawClod, ClodState} from '../cast/clod';
import {drawPost} from '../kits/post-card';
import {gergMedium, GERG_MEDIUM_DEFAULT, GergMediumState} from '../cast/gerg-medium';
import {drawMatchLid, LOBBY_LID} from './lobby-deal';

const RH = 203;
export const DUEL = {
  paneW: 238, rx0: 242,
  /** which room x each pane shows at its column 0 */
  sxL: 96, sxR: 64,
  /** the right pane's staging (lighthouse room coords) */
  clod: [142, 176] as [number, number],
  mario: [250, 197] as [number, number],
  can: [96, 214] as [number, number],
  /** the crossing: the floor line the scroll runs along (frame y), and Gerg's desk front (frame x) where it climbs */
  floorY: 186, gergDeskX: 86,
};

// ------------------------------------------------------------------ the left pane's pieces (ported from ep1-p1)
/** a coworker at station 2 (the table sprite recoloured: another person), cheering in two held drawings */
const COWORKER = (c: number) => {
  const fm = familyOf(c); if (!fm) return c; const [fam, i] = fm;
  if (fam === 'B') return [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4][Math.min(4, i)];
  if (fam === 'L') return [PAL.U0, PAL.U1, PAL.U2, PAL.U3][Math.min(3, i)];
  if (fam === 'F') return [PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6][Math.min(6, i)];
  if (fam === 'S') return stepColor(c, -1);
  return c;
};
const teeMap = (ramp: number[], then?: (c: number) => number) => (c: number) => { const fm = familyOf(c); if (fm && fm[0] === 'N' && fm[1] >= 2 && fm[1] <= 5) return ramp[fm[1]]; return then ? then(c) : c; };
const GERG_DAY = teeMap([PAL.N0, PAL.N1, PAL.F1, PAL.F2, PAL.F3, PAL.F4]);
const COWORKER_DAY = teeMap([PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4], COWORKER);
const MAS_DAY = (c: number) => { const fm = familyOf(c); if (!fm) return c; const [fam, i] = fm; if (fam === 'X') return [PAL.S1, PAL.S1, PAL.S2, PAL.S2][i] ?? PAL.S2; if (fam === 'K') return [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S5][i] ?? PAL.S5; if (fam === 'C') return i >= 6 ? PAL.G5 : i >= 3 ? PAL.G3 : PAL.G1; return c; };
const drawCoworker = (b: Buf, x: number, y: number, f: number, cheer: 0 | 1 | 2) => {
  drawGergTable(b, x, y, {...GERG_DEFAULT, type: cheer ? 0 : gergTypeAt(f + 5), look: 1}, f, {flip: true, capsFrom: 1e9, map: COWORKER_DAY});
  if (!cheer) return;
  const up = cheer === 2 ? 3 : 0;
  for (const [sx, dir] of [[x + 17, -1], [x + 33, 1]] as Array<[number, number]>) {
    for (let j = 0; j < 16 + up; j++) { const xx = sx + Math.round(dir * j * 0.2); b.set(xx, y + 28 - j, PAL.G2); b.set(xx + 1, y + 28 - j, PAL.G3); }
    const hx = sx + Math.round(dir * (16 + up) * 0.2), hy = y + 28 - 16 - up;
    rect(hx - 1, hy - 3, 3, 3, b.ink(PAL.S3)); b.set(hx + dir * 2, hy - 2, PAL.S3); b.set(hx, hy - 4, PAL.S4);
  }
};
/** the hand-lettered GTP-4 banner (a paper strip on two strings, marker letters at a fat nib, a teal swoosh) */
const drawBanner = (b: Buf, x: number, y: number) => {
  const w = 80, h = 16;
  for (const sx of [x + 4, x + w - 5]) for (let yy = 6; yy < y + 1; yy++) b.set(sx, yy, PAL.N2);
  for (let i = 0; i < w; i++) for (let j = -1; j <= h; j++) { if (j === -1 || j === h || i === 0 || i === w - 1) { b.set(x + i, y + j, PAL.N0); continue; } b.set(x + i, y + j, j >= h - 2 ? PAL.P0 : (i + j) % 17 === 0 ? PAL.P0 : PAL.P1); }
  const G: Record<string, string[]> = {
    G: ['.####.', '##..##', '##....', '##.###', '##..##', '##..##', '.####.'], T: ['######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'],
    P: ['#####.', '##..##', '##..##', '#####.', '##....', '##....', '##....'], '-': ['....', '....', '....', '####', '....', '....', '....'],
    '4': ['...##.', '..###.', '.#.##.', '#..##.', '######', '...##.', '...##.'],
  };
  const word = ['G', 'T', 'P', '-', '4'];
  const tw = word.reduce((q, ch) => q + G[ch][0].length + 2, -2);
  let cx = x + Math.round((w - tw) / 2);
  for (const ch of word) { G[ch].forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') b.set(cx + i, y + 3 + j, PAL.N1); })); cx += G[ch][0].length + 2; }
  for (let i = 0; i < w - 18; i++) b.set(x + 9 + i, y + h - 3 - (i > w - 26 ? 1 : 0), PAL.C4);
};
/** the demo monitor on its rolling stand; its screen: blank chat · the napkin photo · the site (half / working) ·
 *  the memo photo · the memo site; its own caption under the picture (NAPKIN → WEBSITE, MEMO → WEBSITE) */
export type DemoScreen = 'blank' | 'napkin' | 'site1' | 'site2' | 'memo' | 'memo1' | 'memo2';
const drawDemoScreen = (b: Buf, x: number, y: number, s: DemoScreen, caption = true) => {
  const w = 64, h = 44;
  rect(x - 3, y - 3, w + 6, h + 6 + 9, b.ink(PAL.N0)); rect(x - 2, y - 2, w + 4, h + 4 + 9, b.ink(PAL.G1)); rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.G3));
  rect(x + w / 2 - 1, y + h + 12, 3, 196 - (y + h + 12), b.ink(PAL.G1)); rect(x + w / 2 - 12, 196, 25, 2, b.ink(PAL.G2));
  const scr = (c: number) => rect(x, y, w, h, b.ink(c));
  const napkin = (ox: number, oy: number) => {
    rect(ox, oy, 38, 30, b.ink(PAL.P2)); rect(ox + 5, oy + 5, 28, 5, b.ink(PAL.N4)); rect(ox + 7, oy + 7, 24, 1, b.ink(PAL.P2));
    rect(ox + 5, oy + 14, 16, 1, b.ink(PAL.N4)); rect(ox + 5, oy + 18, 12, 1, b.ink(PAL.N4)); rect(ox + 24, oy + 16, 11, 7, b.ink(PAL.N4)); rect(ox + 26, oy + 18, 7, 3, b.ink(PAL.P2));
    b.set(ox + 8, oy + 23, PAL.N4); rect(ox + 8, oy + 24, 1, 4, b.ink(PAL.N4)); b.set(ox + 7, oy + 26, PAL.N4); b.set(ox + 9, oy + 26, PAL.N4); b.set(ox + 7, oy + 28, PAL.N4); b.set(ox + 9, oy + 28, PAL.N4);
  };
  const site = (k: number, memo: boolean) => {
    scr(memo ? PAL.P1 : PAL.G6);
    rect(x, y, w, 8, b.ink(memo ? PAL.F3 : PAL.C4)); rect(x + 2, y + 2, 14, 4, b.ink(PAL.P2));
    for (let i = 0; i < 3; i++) b.set(x + w - 4 - i * 3, y + 4, PAL.P2);
    if (memo) { text(b, 'MEMO', x + 5, y + 11, PAL.F2); for (let j = 0; j < 5; j++) rect(x + 5, y + 21 + j * 3, w - 14 - (j % 2) * 10, 1, b.ink(PAL.N4)); }
    else { rect(x + 5, y + 13, w - 26, 4, b.ink(PAL.N3)); for (let j = 0; j < 4; j++) rect(x + 5, y + 21 + j * 3, w - 18 - (j % 2) * 8, 1, b.ink(PAL.G3)); }
    if (k >= 2) { rect(x + w - 22, y + h - 12, 18, 8, b.ink(memo ? PAL.F4 : PAL.C5)); rect(x + w - 20, y + h - 10, 14, 4, b.ink(PAL.P2)); }
    else for (let j = y + h - 13; j < y + h - 3; j += 2) rect(x + w - 24, j, 20, 1, b.ink(PAL.G4));
  };
  if (s === 'blank') { scr(PAL.N2); rect(x + 5, y + h - 10, w - 10, 5, b.ink(PAL.N3)); b.set(x + 7, y + h - 8, PAL.C6); }
  else if (s === 'napkin') { scr(PAL.N3); napkin(x + 13, y + 7); }
  else if (s === 'site1') site(1, false);
  else if (s === 'site2') site(2, false);
  else if (s === 'memo') { scr(PAL.N3); rect(x + 4, y + 8, w - 8, 30, b.ink(PAL.P1)); for (let j = 0; j < 6; j++) rect(x + 7, y + 11 + j * 4, w - 16 - (j % 3) * 6, 1, b.ink(PAL.N4)); }
  else if (s === 'memo1') site(1, true);
  else site(2, true);
  for (let i = 0; i < 6; i++) b.set(x + w - 8 + i, y + 1 + i, stepColor(b.get(x + w - 8 + i, y + 1 + i), 1));
  // the caption band under the picture: X → WEBSITE once the site is up (the demo's own UI)
  const cap = !caption ? '' : s === 'site1' || s === 'site2' ? 'NAPKIN' : s === 'memo1' || s === 'memo2' ? 'MEMO' : '';
  rect(x, y + h + 1, w, 8, b.ink(PAL.N0));
  if (cap) {
    const tw = tinyWidth(cap) + 7 + tinyWidth('WEBSITE');
    let cx = x + Math.round((w - tw) / 2);
    tiny(b, cap, cx, y + h + 3, PAL.P2); cx += tinyWidth(cap) + 1;
    line(cx, y + h + 5, cx + 4, y + h + 5, b.ink(PAL.C6)); b.set(cx + 3, y + h + 4, PAL.C6); b.set(cx + 3, y + h + 6, PAL.C6); cx += 6;
    tiny(b, 'WEBSITE', cx, y + h + 3, PAL.C6);
  }
};
const drawTripodCam = (b: Buf, x: number, foot: number) => {
  line(x, foot - 26, x - 8, foot, b.ink(PAL.G2)); line(x, foot - 26, x + 7, foot, b.ink(PAL.G1)); line(x, foot - 26, x, foot, b.ink(PAL.N2));
  rect(x - 1, foot - 44, 2, 18, b.ink(PAL.G2));
  const cy = foot - 54;
  rect(x - 8, cy, 16, 10, b.ink(PAL.N0)); rect(x - 7, cy + 1, 14, 8, b.ink(PAL.G2)); rect(x - 7, cy + 1, 14, 1, b.ink(PAL.G4));
  rect(x + 7, cy + 2, 6, 6, b.ink(PAL.N0)); rect(x + 8, cy + 3, 4, 4, b.ink(PAL.N3)); b.set(x + 10, cy + 4, PAL.C6);
  b.set(x - 5, cy - 1, PAL.R3);
};
/** Gerg's arm up with the napkin, or his phone snapping it (a flash on the snap frame) */
const gergArmUp = (b: Buf, gx: number, gy: number, what: 'napkin' | 'phone' | 'both', flash: boolean) => {
  const arm = (x0: number, y0: number, x1: number, y1: number) => { line(x0, y0, x1, y1, b.ink(PAL.F1)); line(x0 + 1, y0, x1 + 1, y1, b.ink(PAL.F2)); line(x0 - 1, y0, x1 - 1, y1, b.ink(PAL.N1)); };
  if (what !== 'phone') {
    arm(gx + 18, gy + 30, gx + 12, gy + 12);
    rect(gx + 4, gy + 1, 15, 11, b.ink(PAL.P2)); rect(gx + 4, gy + 11, 15, 1, b.ink(PAL.P0));
    rect(gx + 6, gy + 3, 11, 2, b.ink(PAL.N4)); rect(gx + 6, gy + 7, 5, 1, b.ink(PAL.N4)); rect(gx + 13, gy + 6, 4, 3, b.ink(PAL.N4));
    b.set(gx + 11, gy + 12, PAL.S4); b.set(gx + 12, gy + 12, PAL.S5);
  }
  if (what !== 'napkin') {
    arm(gx + 34, gy + 30, gx + 30, gy + 16);
    rect(gx + 27, gy + 10, 6, 8, b.ink(PAL.N0)); rect(gx + 28, gy + 11, 4, 6, b.ink(flash ? PAL.P2 : PAL.C3));
    b.set(gx + 30, gy + 18, PAL.S4);
    if (flash) { b.set(gx + 26, gy + 9, PAL.P1); b.set(gx + 25, gy + 8, PAL.P0); b.set(gx + 34, gy + 9, PAL.P1); }
  }
};
const masPhoneUp = (b: Buf, mx: number, my: number) => {
  line(mx + 28, my + 32, mx + 34, my + 16, b.ink(PAL.G1)); line(mx + 29, my + 32, mx + 35, my + 16, b.ink(PAL.G2));
  rect(mx + 32, my + 7, 6, 10, b.ink(PAL.N0)); rect(mx + 33, my + 8, 4, 8, b.ink(PAL.C5)); b.set(mx + 33, my + 8, PAL.C8);
  b.set(mx + 34, my + 17, PAL.S3);
};

// ------------------------------------------------------------------ the panes
export interface DuelLeftState {
  screen?: DemoScreen;
  /** Gerg: typing · holding the napkin up · snapping it (flash) · snapping the scroll's end (phrase 4) */
  gerg?: 'type' | 'napkin' | 'snap' | 'snapScroll' | 'glance';
  /** the room cheers (two held drawings) */
  cheer?: 0 | 1 | 2;
  /** Mas holds up his phone (the post) */
  masPhone?: boolean;
  /** everyone's phones out, reading his post */
  phones?: boolean;
  /** v3.1 (opt-in false; draft 7's 11.04): the demo screen's X → WEBSITE caption. Default true (v3) */
  caption?: boolean;
}
const ROOM = (() => { let cache: {buf: Buf; anchors: Record<string, [number, number]>} | null = null; return () => {
  if (cache) return cache;
  const buf = new Buf(480, 270, PAL.N0);
  const room = drawBullpen(buf, 0, {variant: 'day', door: 'shut', chairs: [true, false, false, false], iou: false});
  cache = {buf, anchors: room.anchors};
  return cache;
}; })();
/** the whole day bullpen dressed as the demo stage, in room coords (480 wide); the panes crop it */
const demoRoom = (b: Buf, f: number, st: DuelLeftState) => {
  const R = ROOM();
  b.c.set(R.buf.c.subarray(0, 480 * RH), 0);
  drawBanner(b, DUEL.sxL - 2, 34);
  const [sx, sy] = R.anchors.seat2;
  drawCoworker(b, sx, sy, f, st.cheer ?? 0);
  if (st.phones) { rect(sx + 22, sy + 24, 4, 6, b.ink(PAL.N0)); rect(sx + 23, sy + 25, 2, 4, b.ink(PAL.C6)); }
  const [gx, gy] = R.anchors.gergDesk;
  const g = st.gerg ?? 'type';
  const armUp = g === 'napkin' || g === 'snap' || g === 'snapScroll';
  drawGergTable(b, gx, gy, {...GERG_DEFAULT, type: armUp || g === 'glance' ? 0 : gergTypeAt(f), look: armUp || g === 'glance' ? 1 : 0}, f, {capsFrom: 1e9, map: GERG_DAY});
  if (g === 'napkin') gergArmUp(b, gx, gy - 8, 'napkin', false);
  if (g === 'snap') gergArmUp(b, gx, gy - 8, 'both', true);
  if (g === 'snapScroll') gergArmUp(b, gx, gy - 4, 'phone', true);
  const [mx, my] = R.anchors.masDesk;
  drawMasDesk(b, mx, my, {...MAS_DESK_DEFAULT, head: st.masPhone ? 'screen' : 'turn', light: 'monitor'}, undefined, MAS_DAY);
  if (st.masPhone) masPhoneUp(b, mx, my);
  drawDemoScreen(b, DUEL.sxL - 1, 58, st.screen ?? 'blank', st.caption ?? true);
  drawTripodCam(b, DUEL.sxL + 26, 202);
};
export const drawDuelLeft = (b: Buf, f: number, st: DuelLeftState = {}) => {
  const W = new Buf(480, 270, PAL.N0);
  demoRoom(W, f, st);
  for (let y = 0; y < RH; y++) for (let x = 0; x < DUEL.paneW; x++) b.set(x, y, W.c[y * 480 + DUEL.sxL + x]);
};

export interface DuelRightState {
  /** the launch light: 0 off (CLOD unlit, waiting) · 1 on (it slammed on and stays on) */
  light?: 0 | 1;
  clod?: Partial<ClodState>;
  /** Mario: dictating (finger up) · writing · looking up at the split line · reading his phone · the empty spindle */
  mario?: 'dictate' | 'write' | 'lookup' | 'phone' | 'spindle';
  /** the first scroll's length (px of paper shown), and the second, longer one unrolling (phrase 4: 0..1 of its run) */
  scroll?: number;
  unroll?: number;
  f?: number;
}
export const drawDuelRight = (b: Buf, f: number, st: DuelRightState = {}) => {
  const W = new Buf(480, 270, PAL.N0);
  drawLighthouse(W, f, {meters: 0, throne: 'on', lampTurns: true});
  const lit = (st.light ?? 0) === 1;
  // the can light on its tall stand (near left), its cone onto the plinth when on
  const [cxr, foot] = DUEL.can, headY = 62;
  line(cxr, headY + 8, cxr, RH, W.ink(PAL.N1)); line(cxr - 1, headY + 8, cxr - 1, RH, W.ink(PAL.N2));
  rect(cxr - 5, headY, 12, 9, W.ink(PAL.N0)); rect(cxr - 4, headY + 1, 10, 7, W.ink(PAL.G1)); rect(cxr + 5, headY + 2, 3, 5, W.ink(lit ? PAL.W8 : PAL.N2));
  const [kx, ky] = DUEL.clod;
  if (lit) {
    // the cone: a stepped warm wedge from the lens to the plinth, a pool on the floor round it
    for (let y = headY + 4; y < ky + 12; y++) {
      const t = (y - headY - 4) / (ky + 12 - headY - 4);
      const cxl = cxr + 8 + (kx - cxr - 8) * t, hw = 3 + t * 28;
      for (let x = Math.round(cxl - hw); x <= Math.round(cxl + hw); x++) { const c = W.get(x, y); if (bayer(x, y) < 0.42 - Math.abs(x - cxl) / hw * 0.3) W.set(x, y, lightness(c) > 0.3 ? PAL.W7 : PAL.W4); }
    }
    for (let y = ky - 4; y < ky + 14; y++) for (let x = kx - 40; x < kx + 40; x++) { const d = Math.hypot((x - kx) / 40, (y - ky - 5) / 9); if (d < 1 && bayer(x, y) < (1 - d) * 0.8) W.set(x, y, d < 0.5 ? PAL.W5 : PAL.W3); }
  }
  // the plinth, and CLOD on it
  for (let y = ky; y < ky + 17; y++) for (let x = kx - 20; x <= kx + 20; x++) { const top = y < ky + 3 && Math.hypot((x - kx) / 20, (y - ky - 1.5) / 3) < 1; const side = y >= ky + 1 && Math.abs(x - kx) <= 20; if (top) W.set(x, y, lit ? PAL.G6 : PAL.G3); else if (side) W.set(x, y, x < kx - 12 ? (lit ? PAL.G5 : PAL.G2) : lit ? PAL.G4 : PAL.G1); }
  drawClod(W, kx, ky + 1, {lit: lit ? 1 : 0, wheel: Math.floor(f / 5), pose: lit ? 'up' : 'wait', ...st.clod});
  // Mario beside it, facing the split line (frame left): his poses from the cast rig
  const pose: MarioPose = {...MARIO_BASE};
  const m = st.mario ?? 'dictate';
  if (m === 'dictate') { pose.arm = 'raise'; pose.scroll = true; pose.mouth = Math.floor(f / 5) % 3 === 0 ? 1 : 0 as 0; }
  if (m === 'write') { pose.arm = 'chest'; pose.scroll = true; }
  if (m === 'lookup') { pose.arm = 'down'; pose.scroll = true; pose.brow = 1; }
  if (m === 'phone') { pose.arm = 'chest'; pose.scroll = true; }
  if (m === 'spindle') { pose.arm = 'chest'; pose.scroll = false; pose.brow = 1; }
  const img = marioImg(pose);
  const [mxr, myr] = DUEL.mario;
  const mx = mxr - (MARIO_W - 33), my = myr - 80;
  // the first scroll trails from his far hand to the floor (it unrolls as he writes)
  if (st.scroll && m !== 'spindle') drawScroll(W, mx + 18, my + 44, myr, st.scroll, mxr + 60);
  blitImg(W, img, mx, my, {flip: true});
  if (m === 'phone') { rect(mx + 16, my + 28, 4, 6, W.ink(PAL.N0)); rect(mx + 17, my + 29, 2, 4, W.ink(PAL.C6)); }
  if (m === 'spindle') { rect(mx + 16, my + 22, 2, 9, W.ink(PAL.D4)); W.set(mx + 16, my + 22, PAL.W4); }
  // phrase 4: the second, longer scroll runs from his hand down to the floor and along it to the pane's left edge
  if (st.unroll) {
    const run = Math.round(st.unroll * (mxr - DUEL.sxR + 20));
    const y0 = DUEL.floorY;
    for (let i = 0; i < run; i++) { const x = mxr - 8 - i; for (let j = 0; j < 5; j++) W.set(x, y0 + j, j === 0 ? PAL.P2 : j === 4 ? PAL.P0 : (i % 3 === 0 && j % 2 === 1 && hash(i, j, 12) < 0.8) ? PAL.F2 : PAL.P1); }
    for (let j = my + 44; j < y0; j++) for (let i = 0; i < 5; i++) W.set(mxr - 8 - i + 2, j, i === 0 ? PAL.P0 : PAL.P1);
  }
  for (let y = 0; y < RH; y++) for (let x = 0; x < DUEL.paneW; x++) b.set(x, y, W.c[y * 480 + DUEL.sxR + x]);
  void ellipse; void clamp; void LIGHTHOUSE;
};

export interface DuelSplitState {
  left?: DuelLeftState;
  right?: DuelRightState;
  /** Mas's post popping over the left pane, in his own lowercase: k frames since it popped, or null */
  post?: number | null;
  /** phrase 4: the second scroll crossing into the left pane (0..1 of its run to Gerg's desk; 1 = landed on it) */
  cross?: number;
}
export const drawDuelSplit = (fb: Buf, f: number, st: DuelSplitState = {}) => {
  const L = new Buf(DUEL.paneW, RH, PAL.N0), R = new Buf(DUEL.paneW, RH, PAL.N0);
  drawDuelLeft(L, f, st.left);
  drawDuelRight(R, f, {...st.right, unroll: st.cross ? 1 : st.right?.unroll});
  for (let y = 0; y < RH; y++) { for (let x = 0; x < DUEL.paneW; x++) { fb.c[y * fb.w + x] = L.c[y * DUEL.paneW + x]; fb.c[y * fb.w + DUEL.rx0 + x] = R.c[y * DUEL.paneW + x]; } for (let x = DUEL.paneW; x < DUEL.rx0; x++) fb.c[y * fb.w + x] = PAL.N0; }
  // the crossing: the sheet over the divider and across the bullpen floor to Gerg's desk front, then up onto it
  if (st.cross) {
    const end = Math.round(DUEL.rx0 - (DUEL.rx0 - DUEL.gergDeskX) * Math.min(1, st.cross));
    for (let x = DUEL.rx0 + 1; x >= end; x--) for (let j = 0; j < 5; j++) fb.set(x, DUEL.floorY + j, j === 0 ? PAL.P2 : j === 4 ? PAL.P0 : ((x % 3 === 0) && j % 2 === 1) ? PAL.F2 : PAL.P1);
    if (st.cross >= 1) {
      for (let y = 150; y < DUEL.floorY; y++) for (let i = 0; i < 5; i++) fb.set(DUEL.gergDeskX - 3 + i, y, i === 0 ? PAL.P0 : (y % 3 === 0 && i > 1) ? PAL.F2 : PAL.P1);
      rect(74, 145, 16, 5, fb.ink(PAL.N0)); rect(75, 146, 14, 3, fb.ink(PAL.P1)); rect(72, 144, 5, 7, fb.ink(PAL.N0)); rect(73, 145, 3, 5, fb.ink(PAL.P1));
    } else { rect(end - 5, DUEL.floorY - 1, 6, 7, fb.ink(PAL.N0)); rect(end - 4, DUEL.floorY, 4, 5, fb.ink(PAL.P1)); }
  }
  if (st.post !== null && st.post !== undefined) drawPost(fb, 8, 10, {who: 'mas', text: '…still flawed, still limited…', ts: 'MAR 14'}, {size: 'popup', w: 196, k: st.post});
};

// ------------------------------------------------------------------ 11.01: the match cut's second half
export interface DemoArrivalState { lid?: 0 | 1 | 2; gerg?: Partial<GergMediumState>; screen?: DemoScreen }
/** [W] the bullpen dressed as the demo stage, full frame (the room plate soft behind), Gerg in the foreground at frame
 *  right exactly where he sat in 9.13, his laptop's lid at LOBBY_LID: it OPENS (lid 2 shut → 1 → 0 open) */
export const drawDemoArrival = (b: Buf, f: number, st: DemoArrivalState = {}) => {
  const W = new Buf(480, 270, PAL.N0);
  demoRoom(W, f, {screen: st.screen ?? 'blank', gerg: 'type'});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const c = W.c[y * 480 + x]; b.c[y * b.w + x] = bayer(x, y) < 0.5 ? stepColor(c, lightness(c) > 0.4 ? -1 : 0) : c; }
  const g = gergMedium({...GERG_MEDIUM_DEFAULT, ...st.gerg});
  const gx0 = 300, gy0 = 96;
  for (let j = 0; j < g.h; j++) for (let i = 0; i < g.w; i++) { const c = g.c[j * g.w + i]; if (c >= 0) b.set(gx0 + i, gy0 + j, c); }
  // his desk top under the laptop (the bullpen's grey laminate), then the lid at the match position
  for (let y = LOBBY_LID.base + 4; y < RH; y++) for (let x = 280; x < 480; x++) b.set(x, y, y === LOBBY_LID.base + 4 ? PAL.G5 : bayer(x, y) < 0.3 ? PAL.G2 : PAL.G3);
  drawMatchLid(b, st.lid ?? 2);
};
