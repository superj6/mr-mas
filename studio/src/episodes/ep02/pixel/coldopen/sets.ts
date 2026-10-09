// MR. MAS — Ep2 v1 · coldopen: the cold open's own drawings (the shots pass, 2026-10-09; the review fixes, the same
// day). The rooms, cast and props are the art pass's (studio/src/episodes/ep02/pixel/art/,
// show/episodes/ep02/production/v1/art.md) and Ep1's shared rigs, imported read-only; this file composes them per
// framing and draws what the art pass left to the shot pass:
//   master(b, st)          SET-01's side-on master (sets/lobby2.ts drawLobby2) with sc 1's cast placed: Mas BEHIND his
//                          counter's right end (his hands on its top, his water and a staffer's coffee either side of
//                          them), the Orb at his shoulder, the staff on their beanbags (poses per beat, heads turned
//                          after the mammoth), GERG on his own beanbag, SELBEEP under the screen, the lobby chair, the
//                          pixel mammoth (and its step-out drawings), DOT up her ladder (her own jointed arms here), the
//                          DAYS SINCE board with a fixed number plate; st.cam reframes the whole room (a new setup)
//   gergOTS(b, f, mouth)   [OTS] over GERG's laptop: his portrait low at frame left (clear of Mas), the screen's spill on
//                          his face, the laptop's deck and lid in front of him, two fingertips ticking on the keys
//   putSelbeep(b, s, x, y) SELBEEP's bust (cast/selbeep), his remote forearm a sleeve value lighter than the bust's fall-off
//   medium(b, f, st)       1.02's MEDIUM: the stone wall close, a rack pillar, the wall screen's bezel big (the overlay
//                          plays in MED.screen); the pixel foot breaking the bezel's lower edge
//   counter(b, f, st)      1.07: the back counter, MAS at medium (cast/mas-medium) with the Orb, his water and a staffer's
//                          coffee on the stone top, DOT's ladder and her feet at frame right
//   axis(b, f, st)         1.09 / 1.11 [OTS-W] over MAS's shoulder straight down the axis to the glass doors: the doors'
//                          swing, the courier's foot that kicks the hand truck in, the truck and the complaint at any
//                          depth, the complaint tipping back flat (the truck under it), the flyer landing on it
//   pageTurn(b, k, ...)    1.10: page one (edge to edge exclamation points) lifting at a corner in the draught, turning
//                          to the contents
//   signLow(b, f, st)      1.12 [LOW]: the sign from below (its letters drawn after the keystone), DOT's spare 0, then
//                          the second sign coming up under it in her hand
//   masCU(b, f, dx)        1.12 [MCU]: MAS (cast/mas-cu) on a backdrop of this lobby's own materials, out of focus
//   flyerIris(b, k, st)    1.13 [ECU]: tight on the flyer on the complaint's cover, the Orb's iris closing on its doorway
// Rules: native 480 x 270 (the room area rows 0..202), the master palette, whole-pixel moves, held drawings. Adult Mas
// never blinks. No cursor anywhere. No person in the 2.A take; the flyer's photo is a doorway with nobody in it, and no
// words of the complaint's ever sit beside the flyer (GR: nothing supplies a reason for Alyi leaving).
import {Buf, rect, line, poly, ellipse, bayer, hash, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor, familyOf} from '../../../../shared/pixel/palette';
import {MatBuf, Lights, resolve} from '../../../../shared/pixel/light';
import {blitImg} from '../../../../shared/pixel/figure';
import type {Img} from '../../../../shared/pixel/figure';
import {bigText, bigTextWidth} from '../../../../shared/pixel/font';
import {LOBBY} from '../../../../shared/pixel/rooms/lobby';
import {drawOrb as drawOrbSmall} from '../../../../shared/pixel/cast/orb';
import {drawOrb, orbBob} from '../../../../shared/pixel/cast/orb-medium';
import {gergPortrait, gergTypeAt} from '../../../../shared/pixel/cast/gerg';
import {drawGergPose, GERG_POSE_FOOT} from '../../../../shared/pixel/cast/gerg-poses';
import {drawMasMedium} from '../../../../shared/pixel/cast/mas-medium';
import type {MasMediumState} from '../../../../shared/pixel/cast/mas-medium';
import {masCU as masCUImg} from '../../../../shared/pixel/cast/mas-cu';
import {putBustCut} from '../../../../shared/pixel/cast/civic-kit';
import {drawLobby2, drawFlyer, LOBBY2} from '../art/sets/lobby2';
import {complaintPageECU} from '../art/sets/lobby2-art';
import {drawMammoth, mammothPrint, meltChair, MAMMOTH_RAMP} from '../art/creatures';
import {drawSelbeepRoom, drawDirectorsChair, selbeepBust} from '../art/cast/selbeep';
import type {SelbeepBust} from '../art/cast/selbeep';
import {drawMasStand2} from '../art/cast/mas2';
import {seatedStaff, beanbag} from '../art/cast/civic2';
import type {SeatPose} from '../art/cast/civic2';
import {holdPhone, skinDown} from '../art/cast/hands2';
import {fill, pt, pw, bpt, bpw, tiny, tinyWidth, TR, vramp, capsule, HANDSKIN} from '../art/kit';
import type {Sleeve} from '../art/kit';
import {AROS_MEADOW, AROS_FOOT} from './aros';
void LOBBY; // its lit materials (lb.*) register when it loads

export const RH = 203;
const W = 480;
/** composite a TR-keyed layer over b (offset dx, dy) */
const compose = (b: Buf, t: Buf, dx = 0, dy = 0) => {
  for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) { const c = t.c[y * t.w + x]; if (c !== TR) b.set(x + dx, y + dy, c); }
};
/** the room reframed: everything already drawn moves (dx, dy) whole pixels; the strip it uncovers repeats the edge
 *  (always under a foreground figure or in the dark vault) */
export const reframe = (b: Buf, dx: number, dy: number) => {
  if (!dx && !dy) return;
  const src = b.c.slice(0, W * RH);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.c[y * W + x] = src[clamp(y - dy, 0, RH - 1) * W + clamp(x - dx, 0, W - 1)];
};
/** the cameras: W (the master, as 1.01), the OTS over GERG (the room 32 px right and 4 down: the camera left and a
 *  little low, by his beanbag), the M on SELBEEP (the room 10 px right and 6 up: the camera a little left and high,
 *  over his shoulder); Mas stays in frame in every one */
export const CAM: Record<'W' | 'OTS' | 'M', [number, number]> = {W: [0, 0], OTS: [32, 4], M: [10, -6]};

// ================================================================== the master (sets/lobby2.ts) with sc 1's cast
/** where things stand in the master (native, before a reframe); the screen is LOBBY2.SCREEN (344,24 .. 446,124) */
export const M = {
  /** Mas behind the counter's right end (the counter's front hides him from the hips down; his hands on its top) */
  mas: {x: 32, y: 152},
  orb: {x: 13, y: 86},
  gerg: {x: 196, y: 190},
  selbeep: {x: 318, y: 172},
  chair: {x: 150, y: 176},
  dirChair: {x: 404, y: 168},
  dot: {x: 160, y: 150},
  /** the mammoth's feet line on the runner, and where it lands out of the screen */
  mammothY: 170, outX: 362,
  /** the footprints it leaves on its way (x, y), from the screen leftward */
  prints: [[402, 171], [380, 168], [356, 171], [332, 168], [308, 171], [284, 168], [260, 171], [236, 168], [212, 171], [188, 168], [164, 171], [140, 168], [116, 171], [92, 168], [68, 171], [44, 168], [20, 171]] as Array<[number, number]>,
};
export type StaffPose = SeatPose | 'backL' | 'backR';
export type DotArms = 'reach' | 'lift' | 'lower' | 'pocket' | 'raise' | 'hang' | 'rails' | 'railsShift';
export interface DotState { arms: DotArms; tilt: -1 | 0 | 1 }
export interface MasterState {
  f: number;
  day: 15 | 29;
  screen?: 'clip' | 'meadow' | 'off';
  /** the number plate on the sign's hooks ('86', '100', null = bare hooks); default by the day */
  plate?: string | null;
  mammoth?: {x: number; f: number; fifth?: boolean; dy?: number} | null;
  /** the step-out's in-between drawings instead of the walk (1.03): 0 forelegs over the lip, 1 half out and turning,
   *  2 the hind legs dropping to the carpet (fifth = its fifth leg) */
  stepOut?: {n: 0 | 1 | 2; fifth?: boolean} | null;
  /** the prints right of this x are down (the mammoth has passed them); 0 = all */
  printsFrom?: number | null;
  chair?: 0 | 1 | 2 | 3 | null;
  selbeep?: {arm: 'down' | 'point' | 'present'; mouth: 'rest' | 'open' | 'smile'; flip?: boolean} | null;
  dot?: DotState | null;
  /** Mas's head turned toward the chair (1.04) */
  glance?: boolean;
  gerg?: boolean;
  /** the staff's poses: seed and the staffer's x (to turn their heads after the mammoth) */
  staff?: (seed: number, x: number) => StaffPose;
  door?: 0 | 1 | 2;
  /** the door glass's rattle: 0 still, 1/2 the two drawings of its shiver */
  rattle?: 0 | 1 | 2;
  /** the reception votives dip for a frame on a thud */
  dip?: boolean;
  /** the coffee's lift in px */
  cupLift?: number;
  /** leave out Mas / the mammoth (the freeze's keep mask is the difference) */
  omit?: {mas?: boolean; mammoth?: boolean};
  /** the camera (CAM): the room reframed after it is drawn */
  cam?: [number, number];
}
/** the meadow on the wall screen after the step-out (the take's own meadow, ours now: aros.ts) */
export const meadowPlate = (b: Buf, r: {x: number; y: number; w: number; h: number}) => {
  const P = AROS_MEADOW;
  for (let j = 0; j < Math.min(r.h, P.h); j++) for (let i = 0; i < Math.min(r.w, P.w); i++) {
    const o = (j * P.w + i) * 2;
    b.set(r.x + i, r.y + j, P.pal[parseInt(P.px.slice(o, o + 2), 16)]);
  }
};
/** under the overlay: the screen lit a pale snowy grey (the overlay covers it in the picture) */
const clipBase = (b: Buf, r: {x: number; y: number; w: number; h: number}) => vramp(b, r.x, r.y, r.w, r.h, [PAL.G5, PAL.G6, PAL.P1, PAL.P2]);

// ------------------------------------------------------------------ the DAYS SINCE board, its plate a fixed width
const SIGN_LINES = ['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'];
/** the plate is as wide as the widest number it carries this episode (100), so the cream panel never changes width
 *  when the plates swap (lobby2's board sizes the plate to its number) */
const PLATE_W = Math.max(26, bigTextWidth('100') + 12);
export const SIGN_PLATE = {x: LOBBY2.SIGN.x1 - PLATE_W + 3, y: LOBBY2.SIGN.y0 + 12, w: PLATE_W - 5, h: 28};
/** a number plate (its black edge, cream face, the red number) at x, y */
const numberPlate = (b: Buf, x: number, y: number, txt: string) => {
  const {w, h} = SIGN_PLATE;
  fill(b, x, y, w, h, PAL.N0); fill(b, x + 2, y + 2, w - 4, h - 4, PAL.P2);
  bigText(b, txt, x + Math.round((w - bigTextWidth(txt)) / 2), y + 7, PAL.R2);
};
const signBoard = (b: Buf, plate: string | null) => {
  const {x0, y0, x1, y1} = LOBBY2.SIGN;
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  fill(b, x0 + 2, y0 + 2, w, h, PAL.N0); fill(b, x0, y0, w, h, PAL.G3); fill(b, x0, y0, w, 1, PAL.G5);
  const fx1 = x1 - PLATE_W;
  fill(b, x0 + 2, y0 + 2, fx1 - x0 - 2, h - 4, PAL.P1); fill(b, x0 + 2, y0 + 2, fx1 - x0 - 2, 2, PAL.L2);
  SIGN_LINES.forEach((l, i) => pt(b, l, x0 + 4, y0 + 6 + i * 10, PAL.N1));
  const P = SIGN_PLATE;
  // the bare board where the plate hangs: a cleaner patch (the plate kept the dust off), the two hooks
  fill(b, P.x + 1, P.y + 1, P.w - 2, P.h - 2, PAL.G4);
  fill(b, P.x + 1, P.y - 2, 2, 3, PAL.G5); fill(b, P.x + P.w - 3, P.y - 2, 2, 3, PAL.G5);
  if (plate) numberPlate(b, P.x, P.y, plate);
};

// ------------------------------------------------------------------ the counter, the cups, Mas behind it
/** his water glass (left of his far hand) and a staffer's coffee (right of his near hand, at the counter's end) */
const cups = (b: Buf, lift: number) => {
  const top = LOBBY2.COUNTER.top;
  fill(b, 15, top - 6, 4, 6, PAL.C6); fill(b, 16, top - 4, 2, 3, PAL.C4); fill(b, 15, top - 6, 4, 1, PAL.P2); b.set(18, top - 5, PAL.P2);
  const x = 42, y = top - 7 - lift;
  if (lift) fill(b, x, top - 1, 5, 1, PAL.N1);
  fill(b, x, y, 5, 7, PAL.P1); fill(b, x, y + 2, 5, 3, PAL.D3); fill(b, x - 1, y - 1, 7, 1, PAL.G5); fill(b, x + 4, y, 1, 7, PAL.P0);
};
/** Mas behind the counter (Ep2's stand rig): drawn, then the counter's front redrawn over him from the hips down; the
 *  glance turns his head toward the chair (down-right): the head a pixel over and down, the eyes a pixel more */
const masAtCounter = (b: Buf, glance: boolean) => {
  const C = LOBBY2.COUNTER;
  const xa = C.x0 - 2, xb = C.x1 + 2, ya = C.top + 3, yb = M.mas.y + 6;
  const keep: number[] = [];
  for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) keep.push(b.get(x, y));
  const t = new Buf(W, RH, TR);
  drawMasStand2(t, M.mas.x, M.mas.y, {arm: 'down'});
  if (glance) {
    // the head stamp is local (11, 0), 16 x 18; rows 0..13 are the head (the neck and hood below stay)
    const hx = M.mas.x - 20 + 11, hy = M.mas.y - 78;
    const blk: number[] = [];
    for (let y = hy; y < hy + 14; y++) for (let x = hx - 1; x < hx + 17; x++) { blk.push(t.get(x, y)); t.set(x, y, TR); }
    let i = 0;
    for (let y = hy; y < hy + 14; y++) for (let x = hx - 1; x < hx + 17; x++) { const c = blk[i++]; if (c !== TR) t.set(x + 1, y + 1, c); }
    // the eyes (head row 7, cols 9 and 12): now at (10, 8), (13, 8); each moves one more toward the chair
    for (const ex of [10, 13]) {
      const x = hx + ex, y = hy + 8, eye = t.get(x, y), skin = t.get(x + 1, y);
      t.set(x, y, skin); t.set(x + 1, y + 1, eye);
    }
  }
  compose(b, t);
  let i = 0;
  for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) { const c = keep[i++]; if (y >= C.top + 3 && x >= C.x0 - 2) b.set(x, y, c); }
};

// ------------------------------------------------------------------ DOT up her ladder (from behind, never her face)
const NAVY: Sleeve = [PAL.N1, PAL.N2, PAL.N3, PAL.N5];
const ORANGE = [PAL.W3, PAL.W4, PAL.W5, PAL.W6];
const DHAIR = [PAL.N0, PAL.B0, PAL.B1, PAL.B2];
const DSK = HANDSKIN[1];
/** the platform ladder (an A-frame with a guard rail at the top) and DOT on its top step, from behind: art/cast/dot's
 *  figure with her arms jointed here (shoulder, elbow, cuff, hand), the plates in her hand, the 100 tucked in her back
 *  waistband until she pulls it; a one-step rim of the doors' light down her right side and over her shoulders (she
 *  stands against the dark rack pillar). x, y = the ladder's foot centre */
export const dotLadder = (b: Buf, x: number, y: number, st: DotState) => {
  const tilt = st.tilt, top = y - 58;
  // the ladder and its guard rail (two posts up from the top step to her waist, a bar across)
  for (const [x0, x1] of [[x - 12, x - 4], [x + 12, x + 4]]) { line(x0, y, x1 + tilt, top, b.ink(PAL.G5)); line(x0 + (x0 < x ? 1 : -1), y, x1 + tilt + (x0 < x ? 1 : -1), top, b.ink(PAL.G3)); }
  for (let r = 1; r < 7; r++) { const yy = y - r * 8, hw = 12 - Math.round(r * 1.2); fill(b, x - hw + Math.round((tilt * r) / 7), yy, hw * 2 + 1, 1, PAL.G4); }
  fill(b, x - 5 + tilt, top - 2, 11, 3, PAL.G6);
  // the guard rail: two posts up and out from the top step to her waist, outside her body
  const rail = top - 18;
  for (const s of [-1, 1]) { line(x + s * 6 + tilt, top - 1, x + s * 11 + tilt, rail, b.ink(PAL.G5)); line(x + s * 6 + tilt - s, top - 1, x + s * 11 + tilt - s, rail + 1, b.ink(PAL.G3)); fill(b, x + s * 11 + tilt - 1, rail - 1, 3, 2, PAL.G6); }
  const t = new Buf(W, RH, TR);
  const fx = x - 13 + tilt, fy = y - 104;
  // legs on the top step (the near foot shifts on 'railsShift')
  const sh = st.arms === 'railsShift' ? 2 : 0;
  fill(t, fx + 7, fy + 30, 5, 20, PAL.N1); fill(t, fx + 13 + sh, fy + 30, 5, 20 - (sh ? 1 : 0), PAL.N1); fill(t, fx + 8, fy + 30, 1, 20, PAL.N2); fill(t, fx + 14 + sh, fy + 30, 1, 19, PAL.N2);
  fill(t, fx + 6, fy + 49, 6, 3, PAL.N0); fill(t, fx + 13 + sh, fy + 49 - (sh ? 1 : 0), 6, 3, PAL.N0);
  // the jacket, the back seam, the lanyard's strap at the collar
  for (let j = 0; j < 22; j++) for (let i = 0; i < 18; i++) { if (j < 3 && (i < 2 || i > 15)) continue; t.set(fx + 4 + i, fy + 10 + j, i < 4 ? NAVY[1] : i > 13 ? NAVY[0] : NAVY[2]); }
  fill(t, fx + 12, fy + 14, 1, 16, NAVY[0]);
  fill(t, fx + 8, fy + 9, 10, 2, ORANGE[2]); t.set(fx + 8, fy + 11, ORANGE[1]); t.set(fx + 17, fy + 11, ORANGE[1]);
  // the 100 in her back waistband (its top edge and the red tops of its digits) until she pulls it
  // the spare plate in her back waistband, its top edge and the red tops of its digits: the 100 until she pulls it, then
  // the 86 she tucks there in its place
  const tucked = st.arms === 'reach' || st.arms === 'lift' || st.arms === 'lower' ? '100' : st.arms === 'pocket' ? null : '86';
  if (tucked) { fill(t, fx + 13, fy + 25, 9, 6, PAL.N0); fill(t, fx + 14, fy + 26, 7, 5, PAL.P2); if (tucked === '100') { fill(t, fx + 15, fy + 28, 1, 3, PAL.R2); fill(t, fx + 17, fy + 28, 2, 3, PAL.R2); fill(t, fx + 20, fy + 28, 1, 3, PAL.R2); } else { fill(t, fx + 15, fy + 28, 2, 3, PAL.R2); fill(t, fx + 18, fy + 28, 2, 3, PAL.R2); } }
  // the head from behind: dark hair in a low bun, the ears' edges
  for (let j = 0; j < 11; j++) for (let i = 0; i < 10; i++) { const d = Math.hypot((i - 4.5) / 5, (j - 5) / 5.5); if (d < 1) t.set(fx + 8 + i, fy - 2 + j, j < 3 ? DHAIR[3] : i < 3 ? DHAIR[2] : DHAIR[1]); }
  ellipse(fx + 13, fy + 8, 3, 2, t.ink(DHAIR[1])); t.set(fx + 12, fy + 7, DHAIR[3]);
  t.set(fx + 7, fy + 4, DSK[1]); t.set(fx + 18, fy + 4, DSK[1]);
  // an arm: shoulder -> elbow -> wrist (navy capsules), the orange cuff, the hand
  const arm = (s: [number, number], e: [number, number], h: [number, number], hand = true) => {
    capsule(t, fx + s[0], fy + s[1], fx + e[0], fy + e[1], 2.6, NAVY); capsule(t, fx + e[0], fy + e[1], fx + h[0], fy + h[1], 2.3, NAVY);
    t.set(fx + e[0] - 1, fy + e[1], NAVY[3]);
    if (!hand) return;
    const hx = fx + h[0], hy = fy + h[1];
    fill(t, hx - 2, hy, 4, 2, ORANGE[2]); fill(t, hx - 2, hy - 3, 4, 3, DSK[2]); t.set(hx - 2, hy - 3, DSK[3]); t.set(hx + 1, hy - 1, DSK[1]);
  };
  const P = SIGN_PLATE;
  // the far (right) hand on the guard rail's post unless both are busy
  const railR = (): void => arm([20, 13], [27, 21], [x + 11 + tilt - fx, rail + 2 - fy]);
  const railL = (): void => arm([6, 13], [-1, 21], [x - 11 + tilt - fx, rail + 2 - fy]);
  switch (st.arms) {
    case 'reach': arm([6, 13], [-3, 7], [P.x + P.w - 2 - fx, P.y + 13 - fy]); railR(); break;
    case 'lift': { numberPlate(t, P.x, P.y - 3, '86'); arm([6, 13], [-3, 6], [P.x + P.w - 2 - fx, P.y + 10 - fy]); railR(); break; }
    case 'lower': { const px = fx - 34, py = fy + 22; numberPlate(t, px, py, '86'); arm([6, 13], [-2, 18], [px + P.w - 3 - fx, py + 4 - fy]); railR(); break; }
    // she reaches behind her with the near hand to her back waistband (the forearm across her back): the 86 in, the
    // 100 out
    case 'pocket': { railR(); numberPlate(t, fx + 2, fy + 24, '100'); arm([6, 13], [3, 23], [14, 27]); break; }
    case 'raise': { numberPlate(t, P.x, P.y - 4, '100'); arm([6, 13], [-3, 6], [P.x + P.w - 2 - fx, P.y + 9 - fy]); railR(); break; }
    case 'hang': arm([6, 13], [-3, 7], [P.x + P.w - 2 - fx, P.y + 13 - fy]); railR(); break;
    case 'rails': case 'railsShift': railL(); railR(); break;
  }
  // the rim: her right-hand and upper edges a step toward the light
  const src = new Uint32Array(t.c);
  for (let yy = 1; yy < RH - 1; yy++) for (let xx = 1; xx < W - 1; xx++) {
    const c = src[yy * W + xx];
    if (c === TR) continue;
    const fam = familyOf(c);
    if (!fam || fam[0] !== 'N') continue;
    if (src[yy * W + xx + 1] === TR || src[(yy - 1) * W + xx] === TR) t.set(xx, yy, stepColor(c, 2));
  }
  compose(b, t);
};

// ------------------------------------------------------------------ the staff: heads turned after the mammoth
const BACKS = new Map<string, Img>();
/** a seated staffer (civic2's), or with the head turned away upstage (the back of the head, the ear, a sliver of
 *  cheek toward where they look): 'backL' after the mammoth (upstage-left), 'backR' toward it (upstage-right) */
export const staffImg = (seed: number, pose: StaffPose): Img => {
  if (pose !== 'backL' && pose !== 'backR') return seatedStaff({seed, pose});
  const key = `${seed}:${pose}`;
  const hit = BACKS.get(key);
  if (hit) return hit;
  const base = seatedStaff({seed, pose: 'watch'});
  const c = new Int32Array(base.c), Wd = base.w;
  const at = (x: number, y: number) => c[y * Wd + x];
  const hx = 8, hy = 2;
  const hair1 = at(hx + 4, hy - 1) >= 0 ? at(hx + 4, hy - 1) : at(hx + 4, hy), hair0 = at(hx - 1, hy + 3), skin = at(hx + 5, hy + 6), skinD = at(hx + 3, hy + 10);
  for (let j = 0; j < 10; j++) for (let i = 0; i < 9; i++) {
    const d = Math.hypot((i - 4) / 4.6, (j - 4.8) / 5.2);
    if (d >= 1) continue;
    c[(hy + j) * Wd + hx + i] = j < 2 ? hair1 : hair0;
  }
  // the crown's sheen, the ear, the sliver of cheek and jaw on the side they turn to
  c[(hy + 1) * Wd + hx + 5] = hair1; c[(hy + 2) * Wd + hx + 6] = hair1;
  if (pose === 'backL') { c[(hy + 5) * Wd + hx + 1] = skinD; c[(hy + 6) * Wd + hx + 0] = skin; c[(hy + 7) * Wd + hx + 0] = skin; c[(hy + 8) * Wd + hx + 1] = skinD; }
  else { c[(hy + 5) * Wd + hx + 7] = skinD; c[(hy + 6) * Wd + hx + 8] = skin; c[(hy + 7) * Wd + hx + 8] = skin; c[(hy + 8) * Wd + hx + 7] = skinD; }
  // the head's own outline again (dark on its left edge, a step lit on its right), as civic2 does
  for (let j = -1; j < 11; j++) {
    const row = hy + j; if (row < 0) continue;
    let l = -1, r = -1;
    for (let i = -2; i < 11; i++) { const v = c[row * Wd + hx + i]; if (v >= 0) { if (l < 0) l = i; r = i; } }
    if (l >= 0 && row < hy + 10) { c[row * Wd + hx + l] = stepColor(c[row * Wd + hx + l], -2); c[row * Wd + hx + r] = stepColor(c[row * Wd + hx + r], 1); }
  }
  const im = {w: base.w, h: base.h, c};
  BACKS.set(key, im);
  return im;
};
/** GERG on his beanbag (gerg-poses sit), his laptop's light the show's monitor cyan: the lid's inner edge cyan, and
 *  the glow off his mouth onto his jaw as a soft spill (the chin's bright pixels read as a smear) */
const gergSitting = (b: Buf, x: number, y: number, f: number) => {
  const t = new Buf(W, RH, TR);
  drawGergPose(t, x, y, {body: 'sit', type: gergTypeAt(Math.floor(f / 2)), look: 'screen'});
  const oy = y - GERG_POSE_FOOT[1], ox = x - GERG_POSE_FOOT[0];
  for (let yy = oy; yy < oy + 80; yy++) for (let xx = ox; xx < ox + 50; xx++) {
    if (t.get(xx, yy) !== PAL.L3) continue;
    if (yy - oy < 40) { const s = t.get(xx, yy - 1); t.set(xx, yy, s === PAL.L3 || s === TR ? PAL.S4 : s); }
    else t.set(xx, yy, PAL.C6);
  }
  // the spill: two pixels down the near jaw (head stamp at local 11, 14: jaw rows 9..10, cols 11..12)
  for (const [i, j] of [[12, 9], [11, 10]] as Array<[number, number]>) { const px = ox + 11 + i, py = oy + 14 + j; const c = t.get(px, py); if (c !== TR) { const fam = familyOf(c); if (fam && fam[0] === 'S') t.set(px, py, PAL.K2); } }
  compose(b, t);
};
/** the staff rows (lobby2's own, with their poses given) and GERG on his beanbag at the front row's left end */
const staffRows = (b: Buf, f: number, pose: (seed: number, x: number) => StaffPose, gerg: boolean) => {
  const rows: Array<[number, number]> = [[176, 0], [190, 1]];
  for (const [ry, r] of rows) {
    if (r === 1 && gerg) {
      beanbag(b, M.gerg.x - 4, ry - 22, 4);
      gergSitting(b, M.gerg.x + 8, ry + 6, f);
    }
    for (let k = 0; k < 5; k++) {
      const x = 226 + k * 40 + r * 18, seed = r * 11 + k * 3 + 1;
      beanbag(b, x, ry - 4, seed);
      blitImg(b, staffImg(seed, pose(seed, x + 15)), x + 2, ry - 28);
    }
  }
};

// ------------------------------------------------------------------ the mammoth's step-out (1.03)
const IVORY = [PAL.P0, PAL.P1, PAL.P2];
const strandOf = (cyc: number) => (i: number, j: number, base: number) => {
  const R = MAMMOTH_RAMP, col = i + cyc, h = hash(col, Math.floor(j / 5), 31);
  return R[clamp(base + (h < 0.22 ? 1 : h > 0.8 ? -1 : 0) + (col % 4 === 0 ? -1 : 0), 0, R.length - 1)];
};
/** the mammoth head-on at room scale (its own ramp, the take's pose: the high dome, the trunk down the middle, the
 *  tusks sweeping out and up either side), cx its centre, fy its feet's line. clip = which pixels may draw */
export const mammothFront = (b: Buf, cx: number, fy: number, f: number, clip?: (x: number, y: number) => boolean) => {
  const R = MAMMOTH_RAMP, cyc = Math.floor(f / 6) % 3, strand = strandOf(cyc);
  const set = (x: number, y: number, c: number) => { if (!clip || clip(x, y)) b.set(x, y, c); };
  // the body behind the head: the shoulders' shag either side of it, ragged at its edges and its hem (narrower than
  // the tusks' sweep, so they read against the meadow)
  for (let y = fy - 64; y <= fy - 18; y++) for (let x = cx - 26; x <= cx + 26; x++) {
    const dx = (x - cx) / (22 + 3 * hash(x, Math.floor(y / 3), 5)), dy = (y - (fy - 42)) / 22;
    const hem = fy - 22 + Math.round(2 * Math.sin(x * 1.3 + cyc)) + (hash(x + cyc, 7, 3) < 0.4 ? 3 : 0);
    if (dx * dx + dy * dy > 1 || y > hem) continue;
    set(x, y, Math.abs(dx) > 0.85 ? R[1] : strand(x, y, Math.abs(dx) > 0.55 ? 1 : 2));
  }
  // the forelegs: shag columns to round grey feet, four pale nails each
  for (const lx of [cx - 16, cx + 5]) {
    for (let y = fy - 30; y < fy; y++) for (let i = 0; i < 12; i++) {
      const foot = y >= fy - 5;
      set(lx + i, y, i === 0 ? R[0] : i === 11 ? R[1] : foot ? (i < 3 ? PAL.G2 : PAL.G3) : strand(lx + i, y, 3 + (i < 3 ? 1 : 0)));
    }
    for (let i = 1; i < 11; i += 3) { set(lx + i, fy - 2, PAL.P1); set(lx + i + 1, fy - 2, PAL.P0); }
    for (let i = 0; i < 12; i++) set(lx + i, fy, R[0]);
  }
  // the head: the high dome over a broad brow (its shag lit along the top, a darker edge where it turns away)
  for (let y = fy - 78; y <= fy - 40; y++) for (let x = cx - 16; x <= cx + 16; x++) {
    const dome = Math.hypot((x - cx) / 11, (y - (fy - 67)) / 11), face = Math.hypot((x - cx) / 15, (y - (fy - 52)) / 12);
    if (dome >= 1 && face >= 1) continue;
    const rim = (dome < 1 ? dome : 2) > 0.82 && y < fy - 68;
    set(x, y, rim ? R[6] : y < fy - 70 ? R[5] : (face >= 0.88 && dome >= 1) ? R[1] : strand(x, y, y < fy - 62 ? 4 : 3));
  }
  // the small ears: darker shag at the head's sides
  for (const sd of [-1, 1]) for (let j = 0; j < 9; j++) for (let i = 0; i < 4; i++) set(cx + sd * (15 + i), fy - 62 + j + (i > 2 ? 1 : 0), strand(cx + sd * 15 + i, j, 1));
  // the eyes: small and dark under the brow, their lit lids
  for (const ex of [cx - 8, cx + 6]) { set(ex, fy - 58, PAL.N0); set(ex + 1, fy - 58, PAL.N0); set(ex, fy - 59, R[6]); set(ex + 1, fy - 59, R[6]); }
  // the trunk down the middle, its wrinkles a few dark ticks, curling forward at its tip
  for (let k = 0; k < 32; k++) {
    const tx = cx - 3 + Math.round(Math.sin((k / 32) * 1.4) * 1.5) + (k > 28 ? k - 28 : 0), ty = fy - 50 + k;
    const w = k < 10 ? 7 : k < 22 ? 6 : 5;
    for (let q = 0; q < w; q++) set(tx + q, ty, q === 0 ? R[1] : q === w - 1 ? R[3] : (k % 5 === 2 && q === (w >> 1)) ? R[2] : strand(tx + q, ty, 4));
  }
  // the tusks out of the jaw either side of the trunk: down and out past the shoulders, then sweeping up and in (a
  // cubic stepped a pixel at a time), thick at the root, lit above, shadowed under
  for (const sd of [-1, 1]) {
    const P = [[cx + sd * 5, fy - 42], [cx + sd * 14, fy - 16], [cx + sd * 40, fy - 22], [cx + sd * 34, fy - 52]];
    let px = -999, py = -999;
    for (let n = 0; n <= 160; n++) {
      const t = n / 160, u = 1 - t;
      const bx = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0];
      const by = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
      const qx = Math.round(bx), qy = Math.round(by);
      if (qx === px && qy === py) continue;
      px = qx; py = qy;
      const th = t < 0.7 ? 3 : 2;
      for (let q = 0; q < th; q++) set(qx, qy + q, q === 0 ? IVORY[2] : q === th - 1 ? IVORY[0] : IVORY[1]);
    }
  }
};
/** the profile mammoth (art/creatures drawMammoth) drawn foreshortened (sx < 1: turned toward us) and on a slope
 *  (slope > 0: its rear higher, climbing down), the vertical strands and legs kept vertical. x = the head box's front,
 *  fy its front feet's line. clip(X, Y, i): i = the source column from the head's front (the rear is i > 44) */
export const mammothWarp = (b: Buf, x: number, fy: number, f: number, o: {sx: number; slope: number; fifth?: boolean; clip?: (X: number, Y: number, i: number) => boolean}) => {
  const T = new Buf(120, 80, TR), OX = 26, FY = 76;
  drawMammoth(T, OX, FY, f, {fifth: o.fifth});
  for (let tx = T.w - 1; tx >= 0; tx--) {
    const i = tx - OX, X = x + Math.round(i * o.sx), dy = Math.round(i * o.slope);
    for (let ty = 0; ty < T.h; ty++) {
      const c = T.c[ty * T.w + tx];
      if (c === TR) continue;
      const Y = fy + (ty - FY) - dy;
      if (o.clip && !o.clip(X, Y, i)) continue;
      b.set(X, Y, c);
    }
  }
};
const SCR = LOBBY2.SCREEN;
const inScreen = (x: number, y: number) => x >= SCR.x0 && x <= SCR.x1 && y >= SCR.y0 && y <= SCR.y1;
/** the step-out's three in-between drawings, held (master coordinates) */
const stepOutDrawing = (b: Buf, f: number, n: 0 | 1 | 2, fifth: boolean) => {
  if (n === 0) {
    // forelegs over the lip, the body still in the bezel: head-on, its feet 18 px out below the screen's edge
    const cx = 396, fy = SCR.y1 + 18;
    mammothFront(b, cx, fy, f, (x, y) => inScreen(x, y) || (y > SCR.y1 && ((x >= cx - 16 && x < cx - 4) || (x >= cx + 5 && x < cx + 17))));
  } else if (n === 1) {
    // half out and turning: three-quarter (foreshortened), its forelegs down on the floor at the wall's foot, its
    // rear still inside the bezel (drawn only inside the screen)
    mammothWarp(b, 350, 156, f, {sx: 0.74, slope: 0.42, clip: (X, Y, i) => i < 46 || inScreen(X, Y)});
  } else {
    // out: in profile, its forefeet on the carpet's edge, the hind legs dropping from the lip (its rear a little high)
    mammothWarp(b, 345, 166, 12, {sx: 1, slope: 0.1, fifth});
  }
  // the bezel's lip cracked where it came through, two chips on the floor below
  const ly = SCR.y1 + 5;
  for (const [sx, dir] of [[372, -1], [420, 1]] as Array<[number, number]>) { let xx = sx, yy = ly; for (let s = 0; s < 6; s++) { b.set(xx, yy, PAL.G4); xx += dir; if (s % 2) yy++; } }
  fill(b, 366, LOBBY2.WALL_Y + 2, 2, 1, PAL.G2); fill(b, 428, LOBBY2.WALL_Y + 4, 2, 1, PAL.G2);
};
/** the chair's end state: a flat pool of teal plastic on the runner, glossy, a few drips run out from its edge, one
 *  steel leg sticking up out of it at an angle (the three sagging steps before it are creatures.ts meltChair) */
const chairPool = (b: Buf, x: number, y: number) => {
  const C = [PAL.C1, PAL.C2, PAL.C3, PAL.C4, PAL.C5];
  for (let j = -4; j <= 2; j++) for (let i = -2; i <= 28; i++) {
    const d = Math.hypot((i - 13) / 15.5, j / 3.4 + (i > 18 ? 0.15 : 0));
    if (d >= 1) continue;
    b.set(x + i, y + j, d > 0.8 ? C[0] : j < -1 ? C[3] : C[2]);
  }
  // the drips: short runs out of the pool along the runner, and two beads
  for (const [dx, len] of [[-3, 3], [27, 4], [8, 2]] as Array<[number, number]>) for (let k = 0; k < len; k++) b.set(x + dx - (dx < 0 ? k : dx > 20 ? -k : 0), y + 1 + (dx === 8 ? k : 0), C[1]);
  b.set(x - 7, y + 1, C[2]); b.set(x + 33, y, C[2]);
  // the gloss: a white streak and a cyan rim light
  for (let i = 6; i < 15; i++) b.set(x + i, y - 3, i < 10 ? PAL.P2 : PAL.C7);
  for (let i = 17; i < 22; i++) b.set(x + i, y - 2, PAL.C6);
  // one steel leg out of it, leaning
  line(x + 20, y - 1, x + 25, y - 9, b.ink(PAL.G4)); line(x + 21, y - 1, x + 26, y - 9, b.ink(PAL.G2)); b.set(x + 25, y - 10, PAL.G5);
};
export const master = (b: Buf, st: MasterState) => {
  const f = st.f;
  const screen = st.screen ?? (st.day === 15 ? 'clip' : 'off');
  const plate = st.plate === undefined ? (st.day === 15 ? '86' : '100') : st.plate;
  drawLobby2(b, {
    f, sign1: '100', sign2: null, flyers: 'feb', beanbags: false, door: st.door ?? 0,
    screen: screen === 'clip' ? clipBase : screen === 'meadow' ? meadowPlate : null,
  }, {
    back: (bb) => {
      signBoard(bb, plate);
      if (st.dip) { const D = LOBBY2.DESK; for (let x = D.x0 + 4; x < D.x1 - 2; x += 7) bb.set(x, D.top - 3, PAL.C3); }
      if (!st.omit?.mas) masAtCounter(bb, !!st.glance);
      cups(bb, st.cupLift ?? 0);
      drawOrbSmall(bb, M.orb.x, M.orb.y + orbBob(f), 5, {look: [0.6, 0.2], aperture: 0.5});
      if (st.dot) dotLadder(bb, M.dot.x, M.dot.y, st.dot);
      if (st.day === 15) drawDirectorsChair(bb, M.dirChair.x, M.dirChair.y);
    },
    floor: (bb) => {
      // the prints in its own ramp, then the chair, then the mammoth (the staff rows are in front of its legs)
      if (st.printsFrom !== null && st.printsFrom !== undefined) for (const [px, py] of M.prints) if (px > st.printsFrom) mammothPrint(bb, px, py);
      if (st.chair !== null && st.chair !== undefined) { if (st.chair === 3) chairPool(bb, M.chair.x, M.chair.y); else meltChair(bb, M.chair.x, M.chair.y, st.chair); }
      if (!st.omit?.mammoth) {
        if (st.stepOut) stepOutDrawing(bb, f, st.stepOut.n, !!st.stepOut.fifth);
        else if (st.mammoth) drawMammoth(bb, st.mammoth.x, M.mammothY + (st.mammoth.dy ?? 0), st.mammoth.f, {fifth: st.mammoth.fifth});
      }
      if (st.selbeep) drawSelbeepRoom(bb, M.selbeep.x, M.selbeep.y, {arm: st.selbeep.arm, mouth: st.selbeep.mouth}, {flip: st.selbeep.flip});
    },
    front: (bb) => {
      staffRows(bb, f, st.staff ?? ((s) => ((f + s * 13) % 97 < 50 ? 'watch' : 'type')), st.gerg !== false);
    },
  });
  // the door glass's shiver on a thud: the glass a light step, its bronze frame 1 px over
  if (st.rattle) {
    const D = LOBBY2.DOORS;
    for (let y = D.y0 + 4; y < D.y1 - 2; y++) for (let x = D.x0 + 3; x < D.x1; x++) if ((x + y + st.rattle) % 3 === 0) b.set(x, y, stepColor(b.get(x, y), 1));
    if (st.rattle === 1) fill(b, D.x0 + 1, D.y0 + 2, 1, D.y1 - D.y0 - 4, PAL.W5);
  }
  if (st.cam) {
    const [dx, dy] = st.cam;
    reframe(b, dx, dy);
    // the strip the reframe uncovers at the left repeats the wall's edge: give it the wall's own joints (its courses
    // every 12 px, the joints every 28 staggered by 14), so it reads as more of the wall
    for (let x = 0; x < dx; x++) for (let y = Math.max(0, LOBBY2.CEIL_Y + 8 + dy); y < LOBBY2.WALL_Y - 8 + dy; y++) {
      const ry = y - dy, band = Math.floor((ry - LOBBY2.CEIL_Y - 8) / 12) + 1, off = band % 2 ? 0 : 14, rx = x - dx;
      if ((((rx - off) % 28) + 28) % 28 === 0 && ry > 60) b.set(x, y, stepColor(b.get(x, y), -1));
    }
  }
};

// ================================================================== the foreground figures
/** [OTS] over GERG's laptop: his approved portrait faced camera-right, low at frame left and part out of frame (so Mas,
 *  at the back of the reframed room, stays clear of him); the laptop's screen lights his face's near side in the
 *  monitor cyan; the deck across his chest, the lid standing at its far edge angled toward him (its dark back to us,
 *  its top edge lit), cutting into the portrait's lower right; two fingertips on the keys, ticking on his typing.
 *  mouth = the room flap on his take */
export const GERG_OTS = {x: -34, y: 96};
export const gergOTS = (b: Buf, f: number, mouth: 'open' | 'rest') => {
  const typ = gergTypeAt(Math.floor(f / 2));
  const bob = typ === 2 ? 1 : 0;
  const ox = GERG_OTS.x, oy = GERG_OTS.y + bob;
  const t = new Buf(W, RH, TR);
  putBustCut(t, gergPortrait({mouth, lid: 1, look: 1}), ox, oy, RH, true);
  // the screen's light on his face: a rim along the planes that face it (down and to camera-right, the lid's way):
  // skin within two pixels of the face's lower or near edge walks to the cyan-lit skin ramp
  const KS: Record<number, number> = {[PAL.S1]: PAL.K0, [PAL.S2]: PAL.K1, [PAL.S3]: PAL.K1, [PAL.S4]: PAL.K2, [PAL.S5]: PAL.K3, [PAL.S6]: PAL.K4, [PAL.X1]: PAL.K1, [PAL.X2]: PAL.K2, [PAL.X3]: PAL.K3};
  const skinAt = (x: number, y: number) => KS[t.get(x, y)] !== undefined;
  const lit: Array<[number, number, number]> = [];
  for (let y = oy + 50; y < RH; y++) for (let x = ox + 40; x < ox + 112; x++) {
    if (!skinAt(x, y)) continue;
    const out = (xx: number, yy: number) => { const c = t.get(xx, yy); if (c === TR) return true; const fam = familyOf(c); return !!fam && (fam[0] === 'N' || fam[0] === 'G'); };
    const edge = out(x + 1, y) || out(x + 2, y) || out(x, y + 1) || out(x, y + 2);
    if (edge) lit.push([x, y, KS[t.get(x, y)]]);
  }
  for (const [x, y, c] of lit) t.set(x, y, c);
  compose(b, t);
  // the laptop on his lap: the deck in front of his chest (a dark slab seen from above, its keys a dotted grid in the
  // screen's light), the lid standing on its far edge, angled toward him: its dark back to us, its edges lit by the
  // screen, cutting into the portrait's lower right
  const lx0 = ox + 98, ly0 = oy + 66;
  poly([ox + 52, RH - 4, lx0 - 2, RH - 16, lx0 + 4, RH - 13, ox + 62, RH + 2], b.ink(PAL.N2));
  line(ox + 52, RH - 4, lx0 - 2, RH - 16, b.ink(PAL.C3));
  for (let i = 0; i < 8; i++) for (let j = 0; j < 2; j++) { const kx = ox + 60 + i * 5 + j * 2, ky = RH - 5 - Math.round(i * 1.3) + j * 2; if (ky < RH) b.set(kx, ky, PAL.C2); }
  const lid: Array<[number, number]> = [[lx0, ly0 + 8], [lx0 + 26, ly0], [lx0 + 30, RH + 4], [lx0 + 4, RH + 4]];
  poly(lid.flat(), b.ink(PAL.N1));
  for (let y = ly0; y < RH; y++) {
    const ta = (y - (ly0 + 8)) / (RH + 4 - (ly0 + 8)), xa = Math.round(lx0 + 4 * ta);
    const tb = (y - ly0) / (RH + 4 - ly0), xb = Math.round(lx0 + 26 + 4 * tb);
    if (y >= ly0 + 8) { b.set(xa, y, PAL.C5); b.set(xa - 1, y, bayer(xa - 1, y) < 0.5 ? PAL.C3 : b.get(xa - 1, y)); }
    b.set(xb, y, PAL.G1);
  }
  line(lx0, ly0 + 8, lx0 + 26, ly0, b.ink(PAL.C6)); line(lx0, ly0 + 7, lx0 + 26, ly0 - 1, b.ink(PAL.C3));
  // the maker's logo, a dull mark on the lid's back
  fill(b, lx0 + 13, ly0 + 30, 3, 3, PAL.N2);
  // two fingertips on the keys, the one that strikes a pixel down
  const tips: Array<[number, number]> = [[ox + 70, RH - 9], [ox + 82, RH - 12]];
  tips.forEach(([tx, ty], i) => {
    const dn = typ === i + 1 ? 1 : 0, y = ty + dn;
    fill(b, tx + 1, y, 2, 1, PAL.K4); fill(b, tx, y + 1, 4, 3, PAL.K2); b.set(tx + 1, y + 1, PAL.K3); b.set(tx + 2, y + 1, PAL.K3); fill(b, tx, y + 4, 4, 1, PAL.K1);
  });
};
/** SELBEEP's bust (Ep2's sculpted head) cut at the frame's foot, with the remote's forearm a sleeve value up: the
 *  bust's fall-off darkens its edge bands (where his forearm comes up to the remote) almost to black */
const armMask = (s: Partial<SelbeepBust>) => {
  const a = selbeepBust({...s, arm: 'remote'}), n = selbeepBust({...s, arm: 'none'});
  return {a, diff: (i: number) => a.c[i] !== n.c[i] && a.c[i] >= 0};
};
export const putSelbeep = (b: Buf, s: Partial<SelbeepBust>, x: number, y: number) => {
  const {a, diff} = armMask(s);
  putBustCut(b, a, x, y, RH);
  for (let j = 113; j < a.h; j++) for (let i = 0; i < a.w; i++) { const k = j * a.w + i; if (diff(k) && y + j < RH) b.set(x + i, y + j, a.c[k]); }
};
/** SELBEEP's bust in the right foreground (Ep2's sculpted head, facing camera-left: the room), cut at the frame's foot */
export const SELBEEP_FORE = {x: 352, y: 66};
export const selbeepFore = (b: Buf, s: Partial<SelbeepBust>) => putSelbeep(b, s, SELBEEP_FORE.x, SELBEEP_FORE.y);
/** a background a rung down (depth: the foreground figure stays crisp) */
export const dimRoom = (b: Buf, k = 1) => { for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.c[y * W + x] = stepColor(b.c[y * W + x], -k); };

// ================================================================== 1.02: the MEDIUM under the wall screen
export const MED = {screen: {x: 206, y: 12, w: 262, h: 148}, bust: {x: 58, y: 67}, pillar: [180, 198] as [number, number]};
const medLights: Lights = {
  amb: (x, y) => 3.3 - Math.max(0, (y - 150) / 60) - Math.max(0, (120 - x) / 200),
  cyan: (x, y) => { const S = MED.screen; const dx = Math.max(S.x - x, 0, x - (S.x + S.w)), dy = Math.max(S.y - y, 0, y - (S.y + S.h)); const d = Math.hypot(dx / 40, dy / 30); return d < 1 ? (1 - d) * 0.5 : 0; },
  warm: (x, y) => { const d = Math.hypot((x - 520) / 220, (y - 120) / 180); return d < 1 ? (1 - d) * 0.6 : 0; },
  dither: 0.5,
};
const medCache = new Map<number, Buf>();
const medRoom = (f: number) => {
  const key = Math.floor(f / 4) % 16;
  let r = medCache.get(key);
  if (r) return r;
  const mb = new MatBuf(W, RH);
  // the stone wall at medium scale: courses every 24 px, joints every 56 px, staggered; a moulding at y 172
  rect(0, 0, W, RH, mb.mat('lb.stone', 0));
  for (let y = 10; y < RH; y += 24) { rect(0, y, W, 1, mb.shade(-0.9)); rect(0, y + 1, W, 1, mb.shade(0.5)); const off = ((y / 24) | 0) % 2 ? 0 : 28; for (let x = off; x < W; x += 56) { rect(x, y - 23, 1, 23, mb.shade(-0.6)); rect(x + 1, y - 23, 1, 23, mb.shade(0.3)); } }

  // the rack pillar between him and the screen: steel, its LED column (cyan, a little amber), a stone base
  const [p0, p1] = MED.pillar;
  rect(p0, 0, p1 - p0, RH, mb.mat('lb.rack', 0.5)); rect(p0, 0, 1, RH, mb.shade(1.6)); rect(p1 - 1, 0, 1, RH, mb.shade(-1));
  for (let y = 6; y < 172; y += 7) { rect(p0 + 2, y, p1 - p0 - 4, 1, mb.shade(-1)); for (let q = 0; q < 3; q++) { const lx = p0 + 5 + q * 5; const on = hash(lx, y, Math.floor((f + lx * 7 + y * 3) / (5 + ((lx + y) % 6)))); mb.emit(on < 0.4 ? PAL.C6 : on < 0.5 ? PAL.L3 : on < 0.55 ? PAL.W6 : PAL.N2)(lx, y + 3); mb.emit(on < 0.4 ? PAL.C4 : PAL.N1)(lx + 1, y + 3); } }

  // the bezel: black, bevelled, its lower lip a little proud
  const S = MED.screen;
  rect(S.x - 6, S.y - 6, S.w + 12, S.h + 12, mb.mat('black', 0.7));
  rect(S.x - 6, S.y - 6, S.w + 12, 1, mb.shade(1.8)); rect(S.x - 6, S.y - 6, 1, S.h + 12, mb.shade(1.3)); rect(S.x + S.w + 5, S.y - 6, 1, S.h + 12, mb.shade(-0.6));
  rect(S.x - 6, S.y + S.h + 5, S.w + 12, 1, mb.shade(-1)); rect(S.x - 2, S.y + S.h + 1, S.w + 4, 1, mb.shade(0.8));
  rect(S.x, S.y, S.w, S.h, mb.emit(PAL.N0));
  r = new Buf(W, RH, PAL.N0);
  resolve(mb, medLights, r, 0);
  medCache.set(key, r);
  if (medCache.size > 20) medCache.delete(medCache.keys().next().value as number);
  return r;
};
/** the pixel foot coming out under the screen, ours now (front view, in the mammoth's own ramp, dark like the take's
 *  fur): a shaggy leg spreading over the bezel's lip, its hair ending in a ragged fringe over the grey foot, snow
 *  caught in it, four pale nails along the sole. out = rows below the screen's lower edge it has come (0 = none) */
const FOOT_H = 36;
const pixelFoot = (b: Buf, x0: number, x1: number, yTop: number, out: number) => {
  if (out <= 0) return;
  const R = MAMMOTH_RAMP, cx = (x0 + x1) / 2;
  const HAIR = [PAL.N1, R[0], R[1], R[2], R[3], R[5]];
  const half = (j: number) => { const base = (x1 - x0) / 2 - 2 + j * 0.16; const r = FOOT_H - 1 - j; return r < 6 ? base - (6 - r) * (6 - r) * 0.22 : base; };
  for (let j = 0; j < Math.min(out, FOOT_H); j++) {
    const hw = half(j), yy = yTop + j;
    for (let x = Math.round(cx - hw); x <= Math.round(cx + hw); x++) {
      const xin = Math.min(x - (cx - hw), cx + hw - x);
      const fringe = 22 + Math.floor(hash(x, 7, 13) * 8) - (Math.abs(x - cx) > hw - 4 ? 3 : 0);
      let c: number;
      if (j <= fringe) {
        const run = hash(x, Math.floor((j + hash(x, 1, 9) * 8) / 7), 23), col = hash(x, 2, 31);
        c = HAIR[clamp(2 + (run < 0.25 ? 1 : run > 0.82 ? -1 : 0) + (col < 0.2 ? -1 : col > 0.85 ? 1 : 0) + (j < 5 ? 1 : 0) - (xin < 1.5 ? 1 : 0), 0, HAIR.length - 1)];
        if (j < 8 && hash(x, j, 41) < 0.03) c = PAL.P1;
        if (j > fringe - 2 && hash(x, j, 5) < 0.5) c = HAIR[1];
      } else {
        c = xin < 1.5 ? PAL.G1 : (j + Math.round(x * 0.5)) % 5 === 0 ? PAL.G2 : x < cx ? PAL.G3 : PAL.G4;
      }
      b.set(x, yy, c);
    }
  }
  if (out >= FOOT_H) {
    for (let n = 0; n < 4; n++) {
      const u = (n + 0.5) / 4, nx = Math.round(cx - half(FOOT_H - 3) + u * 2 * half(FOOT_H - 3)) - 2, ny = yTop + FOOT_H - 5 - Math.round(Math.abs(u - 0.5) * 6);
      fill(b, nx, ny, 5, 3, PAL.P1); fill(b, nx + 1, ny, 3, 1, PAL.P2); fill(b, nx, ny + 2, 5, 1, PAL.P0);
    }
  }
};
export interface MediumState { foot: number; crack: boolean; chips: number }
export const medium = (b: Buf, f: number, st: MediumState) => {
  b.c.set(medRoom(f).c.subarray(0, W * RH), 0);
  const S = MED.screen;
  clipBase(b, S);
  const yTop = S.y + S.h;
  if (st.crack) {
    const xa = AROS_FOOT.x0 - 14, xb = AROS_FOOT.x1 + 3;
    for (const [sx, dir] of [[xa, -1], [xb, 1]] as Array<[number, number]>) {
      let x = sx, y = yTop;
      for (let s = 0; s < 9; s++) { b.set(x, y, PAL.G4); b.set(x, y + 1, PAL.N0); x += dir; y += s % 3 === 1 ? 1 : 0; if (y > yTop + 5) y = yTop + 5; }
      for (let s = 0; s < 5; s++) b.set(sx + dir * (3 + s), yTop + 3 + (s >> 1), PAL.G3);
    }
    for (let c = 0; c < 2; c++) { const cy = yTop + 6 + st.chips * (3 + c * 2), cx = (c ? AROS_FOOT.x1 + 6 : AROS_FOOT.x0 - 17) + (c ? 1 : -1) * Math.floor(st.chips / 2); if (cy < RH - 2) { fill(b, cx, cy, 2, 2, PAL.N1); b.set(cx, cy, PAL.G4); } }
  }
  pixelFoot(b, AROS_FOOT.x0 - 12, AROS_FOOT.x1 + 2, yTop, st.foot);
};

// ================================================================== 1.07: the back counter, Mas at medium
const counterLights: Lights = {
  amb: (x, y) => 3.3 - Math.max(0, (60 - x) / 120) - (y > 150 ? 0.6 : 0),
  cyan: (x, y) => (y >= 150 && y < 152 ? 0.4 : 0),
  warm: (x, y) => { const d = Math.hypot((x - 560) / 320, (y - 100) / 220); return d < 1 ? (1 - d) * 0.75 : 0; },
  dither: 0.5,
};
/** the counter: its stone top seen a little from above (far edge y 122, near lip 146-150), the steel front below; it
 *  runs from frame left to its end at x 330 (the master's counter end, seen from in front: his water at its left, the
 *  coffee by his near hand at the end) */
const CT = {far: 122, lip: 146, front: 150, x1: 330};
let counterRoom: Buf | null = null;
const counterBg = () => {
  if (counterRoom) return counterRoom;
  const mb = new MatBuf(W, RH);
  rect(0, 0, W, RH, mb.mat('lb.stone', 0.2));
  for (let y = 6; y < RH; y += 24) { rect(0, y, W, 1, mb.shade(-0.9)); rect(0, y + 1, W, 1, mb.shade(0.5)); const off = ((y / 24) | 0) % 2 ? 0 : 28; for (let x = off; x < W; x += 56) { rect(x, y - 23, 1, 23, mb.shade(-0.6)); rect(x + 1, y - 23, 1, 23, mb.shade(0.3)); } }
  rect(0, CT.far, CT.x1, CT.lip - CT.far, mb.mat('lb.stone', 1.5)); rect(0, CT.far, CT.x1, 1, mb.shade(-0.6));
  for (let y = CT.far + 4; y < CT.lip; y += 7) rect(0, y, CT.x1, 1, mb.shade(0.25));
  rect(0, CT.lip, CT.x1, CT.front - CT.lip, mb.mat('lb.stone', 2)); rect(0, CT.lip, CT.x1, 1, mb.shade(0.6));
  rect(0, CT.front, CT.x1 - 4, RH - CT.front, mb.mat('lb.steel', 0.5)); rect(0, CT.front + 1, CT.x1 - 4, 1, mb.emit(PAL.C5));
  for (const yy of [170, 192]) rect(4, yy, CT.x1 - 12, 1, mb.shade(-0.8));
  rect(CT.x1 - 4, CT.front, 4, RH - CT.front, mb.mat('lb.steel', -0.4)); rect(CT.x1 - 2, CT.far, 2, CT.front - CT.far, mb.mat('lb.stone', 0.6));
  counterRoom = new Buf(W, RH, PAL.N0);
  resolve(mb, counterLights, counterRoom, 0);
  return counterRoom;
};
export interface CounterState {
  /** frames since the cup jumped (< 0: before) */
  j: number;
  /** the ladder's sway */
  tilt: -1 | 0 | 1;
  /** DOT's feet: 0 as they were, 1 the near foot shifted */
  feet: 0 | 1;
  /** Mas's eyes on the cup (the one held shift after the jump) */
  eyes: boolean;
}
/** the coffee's lift after the jump (px), its drops' state */
const CUP = [3, 6, 5, 2];
export const counter = (b: Buf, f: number, st: CounterState) => {
  b.c.set(counterBg().c.subarray(0, W * RH), 0);
  // the sign's foot over him, hung on its wires: its last line and its number plate (DAYS SINCE … FIRE MAS: 100)
  fill(b, 24, 0, 268, 28, PAL.G3); fill(b, 24, 27, 268, 1, PAL.N1); fill(b, 28, 0, 196, 24, PAL.P1);
  bpt(b, 'FIRE MAS:', 40, 6, PAL.N1);
  fill(b, 232, 0, 54, 25, PAL.N0); fill(b, 235, 0, 48, 22, PAL.P2); bpt(b, '100', 259 - Math.round(bpw('100') / 2), 5, PAL.R2);
  // DOT's ladder at frame right: its rails up out of frame, the rungs, her shoes and trouser legs on a rung (from
  // behind, never her face); the whole ladder sways on the thud, her near foot shifts its weight
  const lx = 388 + st.tilt;
  for (const [xa, xb] of [[lx - 24, lx - 15], [lx + 24, lx + 15]]) { line(xa, RH, xb + st.tilt, -10, b.ink(PAL.G5)); line(xa + (xa < lx ? 1 : -1), RH, xb + st.tilt + (xa < lx ? 1 : -1), -10, b.ink(PAL.G3)); }
  for (let r = 0; r < 8; r++) { const yy = 196 - r * 26; const hw = 22 - Math.round(r * 1.1); fill(b, lx - hw + st.tilt, yy, hw * 2 + 1, 2, PAL.G4); fill(b, lx - hw + st.tilt, yy, hw * 2 + 1, 1, PAL.G6); }
  const fy = 40, fx = lx - 12 + st.tilt * 2, sh = st.feet ? 3 : 0;
  fill(b, fx, 0, 9, fy - 2, PAL.N1); fill(b, fx + 1, 0, 2, fy - 2, PAL.N2); fill(b, fx + 13 + sh, 0, 9, fy - 2 - (sh ? 1 : 0), PAL.N1); fill(b, fx + 14 + sh, 0, 2, fy - 3, PAL.N2);
  fill(b, fx - 2, fy - 3, 12, 4, PAL.N0); fill(b, fx + 12 + sh, fy - 3 - (sh ? 1 : 0), 12, 4, PAL.N0); fill(b, fx - 2, fy - 3, 12, 1, PAL.G2); fill(b, fx + 12 + sh, fy - 3 - (sh ? 1 : 0), 12, 1, PAL.G2);
  // MAS at medium (Ep1's approved medium rig, faced camera-right: the doors), his hands resting on the stone top;
  // after the jump his eyes go down to the cup and stay there
  const mx = 96, my = 38;
  const ms: MasMediumState = {head: st.eyes ? 'down' : '34', mouth: 'rest', lid: 0, look: 1, brow: 0, arm: 'rest', light: 'warm'};
  drawMasMedium(b, mx, my, ms, {flip: true,
    desk: (bb) => { const t = counterBg(); for (let y = my + 84; y < RH; y++) for (let x = 0; x < CT.x1; x++) bb.set(x, y, t.c[y * W + x]); }});
  // the Orb behind his shoulder (frame left), looking where he looks
  drawOrb(b, 70, 56 + orbBob(f), 12, {look: st.eyes ? [0.7, 0.45] : [0.7, 0.15], aperture: 0.45});
  // his water: a tumbler on the stone; it never moves
  const gx = 34, gb = 140;
  for (let y = gb - 26; y < gb; y++) for (let x = gx; x < gx + 16; x++) { const wall = x === gx || x === gx + 15; const water = y > gb - 17; b.set(x, y, wall ? PAL.G6 : water ? stepColor(b.get(x, y), 1) : b.get(x, y)); }
  fill(b, gx + 1, gb - 17, 14, 1, PAL.C7); fill(b, gx, gb - 26, 16, 1, PAL.P1); fill(b, gx + 2, gb - 24, 1, 20, PAL.P1); fill(b, gx, gb, 16, 1, PAL.G3);
  // a staffer's coffee: a paper cup, its sleeve and lid, its contact shadow on the stone; a wisp of steam before the
  // thud; on the thud it jumps (its shadow stays on the stone), lands, and two drops splash beside it and stay
  const j = st.j, lift = j < 0 || j >= CUP.length ? 0 : CUP[j];
  const cx = 222, cy = 136 - 30 - lift;
  fill(b, cx + 3, 136, 17, 1, PAL.G3);
  if (lift) { fill(b, cx + 5, 136, 13, 1, PAL.N2); } else fill(b, cx + 3, 136, 17, 1, PAL.N2);
  fill(b, cx + 2, cy + 1, 18, 29, PAL.P2); fill(b, cx + 16, cy + 1, 4, 29, PAL.P1); fill(b, cx + 2, cy + 1, 1, 29, PAL.P1);
  fill(b, cx + 2, cy + 10, 18, 11, PAL.D3); fill(b, cx + 2, cy + 10, 18, 1, PAL.D4); fill(b, cx + 16, cy + 10, 4, 11, PAL.D2);
  fill(b, cx, cy - 3, 22, 4, PAL.G5); fill(b, cx, cy - 3, 22, 1, PAL.P1); fill(b, cx + 8, cy - 4, 6, 1, PAL.G4);
  if (j < 0) { const s = Math.floor(f / 6) % 4; for (let q = 0; q < 3; q++) { const sy = cy - 7 - q * 4 - (s % 2), sx = cx + 10 + ((q + s) % 2 ? 1 : -1); if (bayer(sx, sy) < 0.6) b.set(sx, sy, PAL.G6); } }
  if (j >= 1 && j < 4) for (let d = 0; d < 2; d++) { const dx = cx + 5 + d * 9, dy = cy - 7 - d * 3 + (j - 1) * 4; fill(b, dx, dy, 2, 2, PAL.D2); b.set(dx, dy, PAL.D4); }
  if (j >= 4) for (const [sx, sw] of [[cx - 4, 3], [cx + 21, 2]] as Array<[number, number]>) { fill(b, sx, 135, sw, 1, PAL.D3); b.set(sx + 1, 134, PAL.D2); }
};

// ================================================================== 1.09 / 1.11: down the axis to the doors
// A one-point view of the lobby along its length, painted in the master's own lit materials (lb.*): the far wall is
// the glass entrance (fixed panes either side of the double doors, bronze frames, the transom), the side walls carry
// the rack pillars receding, the floor is the polished stone in perspective with the red runner down its middle, the
// ceiling the dark vault. World units are pixels at the far wall; z is depth (1 = the entrance wall, smaller = nearer):
// sx = VP.x + X / z, sy = VP.y + Y / z.
export const AX = {vx: 306, vy: 92, halfW: 80, ceil: -58, floor: 48, doorHalf: 26, doorTop: -22, glassHalf: 54, glassTop: -36};
const axisLights = (open: number): Lights => ({
  amb: (x, y) => 3.0 + Math.max(0, 1 - Math.hypot((x - AX.vx) / 160, (y - 110) / 120)) * 1.2 - Math.max(0, (y - 150) / 80),
  cyan: (x, y) => { const d = Math.hypot((x - AX.vx) / 260, (y - 60) / 200); return d < 1 ? (1 - d) * 0.25 : 0; },
  warm: (x, y) => {
    let L = 0;
    const d = Math.hypot((x - AX.vx) / 120, (y - 120) / 70); if (d < 1) L = (1 - d) * 0.65;
    if (open > 0 && y > AX.vy + AX.floor) { const half = AX.doorHalf * (y - AX.vy) / AX.floor; const u = Math.abs(x - AX.vx) / (half * 1.15); if (u < 1) L = Math.max(L, (1 - u) * (0.5 + 0.35 * open)); }
    return L;
  },
  dither: 0.55,
});
const axisCache = new Map<string, Buf>();
/** the room (no doors' leaves, no props): open = how far the doors' light spills (0, 0.5, 1); f steps the LEDs on 4s */
const axisRoom = (f: number, open: number) => {
  const key = `${open}:${Math.floor(f / 4) % 16}`;
  let r = axisCache.get(key);
  if (r) return r;
  const mb = new MatBuf(W, RH);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const dx = x + 0.5 - AX.vx, dy = y + 0.5 - AX.vy;
    const zs: Array<[number, string]> = [];
    if (dy > 0) zs.push([AX.floor / dy, 'floor']);
    if (dy < 0) zs.push([AX.ceil / dy, 'ceil']);
    if (dx < 0) zs.push([-AX.halfW / dx, 'left']);
    if (dx > 0) zs.push([AX.halfW / dx, 'right']);
    let z = 1, surf = 'far';
    for (const [zz, s] of zs) if (zz < z) { z = zz; surf = s; }
    const X = dx * z, Y = dy * z, D = 1 / z;
    if (surf === 'far') {
      if (Math.abs(X) <= AX.glassHalf && Y >= AX.glassTop) { mb.mat('lb.brass', 0)(x, y); continue; }
      mb.mat('lb.stone', ((Math.floor((Y + 100) / 9) % 2) ? 0.2 : -0.1) + (Math.abs(((X + 200) % 18) - 9) < 0.6 ? -0.8 : 0))(x, y);
    } else if (surf === 'floor') {
      const tile = Math.abs(((X % 24) + 24) % 24 - 12) > 11.2 || Math.abs((((D * 3.2) % 1) + 1) % 1 - 0.5) > 0.47;
      if (Math.abs(X) < 20) { mb.mat('lb.velvet', Math.abs(X) > 18 ? -1.6 : -1.0)(x, y); continue; }
      mb.mat('lb.floor', tile ? -0.6 : 0.5)(x, y);
    } else if (surf === 'ceil') {
      mb.mat('lb.stoneDk', -0.6 + ((Math.floor(D * 2.2) % 2) ? 0.3 : 0))(x, y);
    } else {
      const pill = [1.25, 1.62, 2.1].findIndex((p) => Math.abs(D - p) < 0.09 + p * 0.012);
      if (pill >= 0) {
        const edge = Math.abs(Math.abs(D - [1.25, 1.62, 2.1][pill]) - (0.09 + [1.25, 1.62, 2.1][pill] * 0.012)) < 0.012;
        const led = Math.abs((((Y + 200) % 7) + 7) % 7 - 3.5) < 0.6 && !edge && Y > AX.ceil + 6 && Y < AX.floor - 6;
        if (led) { const on = hash(Math.floor(D * 40), Math.floor(Y), Math.floor((f + D * 30) / 6) + (surf === 'left' ? 0 : 3)); mb.emit(on < 0.45 ? PAL.C6 : on < 0.52 ? PAL.L3 : PAL.N2)(x, y); continue; }
        mb.mat('lb.rack', edge ? 1.4 : 0.4)(x, y); continue;
      }
      const course = Math.abs(((Y + 200) % 10) - 5) > 4.5;
      mb.mat('lb.stone', course ? -0.8 : (surf === 'left' ? 0.1 : -0.2))(x, y);
    }
  }
  r = new Buf(W, RH, PAL.N0);
  resolve(mb, axisLights(open), r, 0);
  axisCache.set(key, r);
  if (axisCache.size > 40) axisCache.delete(axisCache.keys().next().value as string);
  return r;
};
const P2S = (X: number, Y: number, z: number): [number, number] => [Math.round(AX.vx + X / z), Math.round(AX.vy + Y / z)];
/** the glass entrance at the far wall: fixed panes (frosted bright), bronze mullions, the double doors (leaves swing
 *  toward us: 0 shut, 1 half, 2 open, 3 back off the stops); open = the sidewalk, a planter with a PAUSE sign leaning on
 *  it (a group sign only) */
const entrance = (b: Buf, f: number, swing: 0 | 1 | 2 | 3, pause: boolean) => {
  const [gx0, gy0] = P2S(-AX.glassHalf, AX.glassTop, 1), [gx1, gy1] = P2S(AX.glassHalf, AX.floor, 1);
  const [dx0, dy0] = P2S(-AX.doorHalf, AX.doorTop, 1), [dx1] = P2S(AX.doorHalf, AX.floor, 1);
  for (let y = gy0; y < gy1; y++) for (let x = gx0; x < gx1; x++) b.set(x, y, bayer(x, y) < 0.5 + 0.2 * Math.sin(x * 0.4) ? PAL.P1 : PAL.G6);
  fill(b, gx0 - 2, gy0 - 3, gx1 - gx0 + 4, 3, PAL.D3); fill(b, gx0 - 2, gy0 - 3, gx1 - gx0 + 4, 1, PAL.W5);
  fill(b, gx0 - 2, dy0 - 2, gx1 - gx0 + 4, 2, PAL.D3);
  for (const mx of [gx0 - 2, gx0 + 13, dx0 - 2, dx1, gx1 - 15, gx1]) fill(b, mx, gy0, 2, gy1 - gy0, PAL.D3);
  const dw = dx1 - dx0, mid = dx0 + (dw >> 1);
  if (swing > 0) {
    vramp(b, dx0, dy0, dw, gy1 - dy0, [PAL.P1, PAL.G6, PAL.G5]);
    fill(b, dx0, dy0 + 24, dw, 6, PAL.G4); fill(b, dx0, dy0 + 30, dw, gy1 - dy0 - 30, PAL.P0);
    for (let x = dx0; x < dx1; x += 6) b.set(x, dy0 + 34, PAL.G5);
    fill(b, dx0, gy1 - 6, dw, 6, PAL.G5); fill(b, dx0, gy1 - 6, dw, 1, PAL.P1); fill(b, dx0, gy1 - 3, dw, 1, PAL.G4);
    const plx = dx1 - 16;
    fill(b, plx, dy0 + 34, 14, 12, PAL.D2); fill(b, plx, dy0 + 34, 14, 1, PAL.D4); for (let i = 0; i < 14; i += 3) fill(b, plx + 1 + i, dy0 + 29 + (i % 2), 2, 5, PAL.L1);
    if (pause) { const sw = tinyWidth('PAUSE') + 4; const sx = dx1 - sw - 1; fill(b, sx, dy0 + 20, sw, 10, PAL.P2); fill(b, sx, dy0 + 20, sw, 1, PAL.N2); tiny(b, 'PAUSE', sx + 2, dy0 + 22, PAL.R2); line(sx + (sw >> 1), dy0 + 30, sx + (sw >> 1) - 2, dy0 + 36, b.ink(PAL.D2)); }
  } else {
    for (let y = dy0; y < gy1; y++) for (let x = dx0; x < dx1; x++) b.set(x, y, bayer(x, y) < 0.6 ? PAL.P1 : PAL.G6);
  }
  const leaf = (side: -1 | 1) => {
    const hingeX = side * AX.doorHalf;
    const ang = [0, 0.75, 1.45, 1.25][swing];
    const fx = hingeX - side * AX.doorHalf * Math.cos(ang), fz = 1 - 0.055 * Math.sin(ang);
    const [hx, hyT] = P2S(hingeX, AX.doorTop, 1), [, hyB] = P2S(hingeX, AX.floor, 1);
    const [ex, eyT] = P2S(fx, AX.doorTop, fz), [, eyB] = P2S(fx, AX.floor, fz);
    const xa = Math.min(hx, ex), xb = Math.max(hx, ex);
    for (let x = xa; x <= xb; x++) {
      const t = xb === xa ? 0 : (x - hx) / (ex - hx);
      const yt = Math.round(hyT + (eyT - hyT) * t), yb = Math.round(hyB + (eyB - hyB) * t);
      for (let y = yt; y < yb; y++) {
        const frame = x === xa || x === xb || y < yt + 2 || y > yb - 3;
        b.set(x, y, frame ? PAL.D3 : swing === 0 ? (bayer(x, y) < 0.6 ? PAL.P1 : PAL.G6) : (bayer(x, y) < 0.4 ? PAL.G6 : PAL.G5));
      }
      if (swing > 0 && Math.abs(t - 0.5) < 0.06) for (let y = yt + Math.round((yb - yt) * 0.45); y < yt + Math.round((yb - yt) * 0.5); y++) b.set(x, y, PAL.W6);
    }
  };
  leaf(-1); leaf(1);
  if (swing === 0) fill(b, mid, dy0, 1, gy1 - dy0, PAL.D3);
};
/** the courier outside, seen only as a trouser leg and a work boot in the doorway behind the truck (pixel, no face, no
 *  more of them): 'brace' planted, 'back' drawn back to kick, 'kick' the boot on the truck's frame */
const courierLeg = (b: Buf, pose: 'brace' | 'back' | 'kick') => {
  // (from behind the complaint's right edge, in the gap before the planter, under the PAUSE sign: never over it)
  const z = 1.06, s = 1 / z;
  const hip = P2S(0, 8, z);
  const knee = pose === 'brace' ? P2S(8, 26, z) : pose === 'back' ? P2S(12, 22, z) : P2S(6, 28, z);
  const ankle = pose === 'brace' ? P2S(6, AX.floor - 4, z) : pose === 'back' ? P2S(15, AX.floor - 12, z) : P2S(2, AX.floor - 6, z);
  capsule(b, hip[0], hip[1], knee[0], knee[1], 3.4 * s, [PAL.N1, PAL.N2, PAL.N3, PAL.W4], [0.8, -0.6]);
  capsule(b, knee[0], knee[1], ankle[0], ankle[1], 3 * s, [PAL.N1, PAL.N2, PAL.N3, PAL.W4], [0.8, -0.6]);
  const toe = pose === 'kick' ? -1 : pose === 'back' ? 1 : -1;
  const bx = ankle[0] + (toe < 0 ? -7 : -2), by = ankle[1];
  fill(b, bx, by, 9, 4, PAL.N0); fill(b, bx, by, 9, 1, PAL.G2); fill(b, bx + (toe < 0 ? 0 : 7), by + 1, 2, 3, PAL.G1); fill(b, bx, by + 3, 9, 1, PAL.D2);
};
/** the caption's lines on the upright cover */
const CAP1 = ['NOLE v.', 'MANALT', 'ET AL.'], CAP2 = ['YOU', 'PROMISED', '!!!'];
/** the hand truck and the complaint upright on it, at depth z (X its centre): drawn at the scale of the depth, held on
 *  2s by the caller. The caption in the largest face that fits inside the cover with its margins (the pixel face near,
 *  the tiny type mid-way); where neither fits (the doorway's far steps) its lines are ruled bars, so no glyph ever
 *  prints past the cover */
export const COMPLAINT_W = 34;
export const truckAt = (b: Buf, X: number, z: number, o: {load?: boolean} = {}) => {
  const s = 1 / z;
  const [cx, fy] = P2S(X, AX.floor, z);
  const cw = Math.round(COMPLAINT_W * s), ch = Math.round(46 * s);
  const x0 = cx - (cw >> 1);
  const wr = Math.max(2, Math.round(3 * s));
  fill(b, x0 - 2, fy - 2, cw + 4, Math.max(2, Math.round(1.5 * s)), PAL.G4); fill(b, x0 - 2, fy - 2, cw + 4, 1, PAL.G6);
  for (const wx of [x0 + Math.round(cw * 0.15), x0 + cw - Math.round(cw * 0.15)]) { ellipse(wx, fy + 1, wr, wr, b.ink(PAL.N0)); ellipse(wx, fy + 1, Math.max(1, wr - 2), Math.max(1, wr - 2), b.ink(PAL.G3)); }
  for (const hx of [x0 + 2, x0 + cw - 3]) { fill(b, hx, fy - ch - Math.round(8 * s), Math.max(1, Math.round(s)), ch + Math.round(8 * s), PAL.G4); }
  fill(b, x0 + 2, fy - ch - Math.round(8 * s), cw - 4, Math.max(1, Math.round(s)), PAL.G5);
  if (o.load === false) return;
  const px0 = x0 + 1, pw0 = cw - 2, py0 = fy - 3 - ch;
  fill(b, px0 + pw0, py0 + 2, Math.max(2, Math.round(3 * s)), ch - 2, PAL.P0);
  for (let j = 2; j < ch; j += 2) b.set(px0 + pw0 + 1, py0 + j, PAL.G6);
  fill(b, px0, py0, pw0, ch, PAL.P2); fill(b, px0 + pw0 - 1, py0, 1, ch, PAL.P1); fill(b, px0, py0 + ch - 1, pw0, 1, PAL.P0);
  const m = s < 1.6 ? 2 : Math.round(3 * s), inner = pw0 - 1 - 2 * m;
  const fits = (wf: (t: string) => number) => Math.max(...CAP1.map(wf), ...CAP2.map(wf)) <= inner;
  const face: 'pt' | 'tiny' | 'bars' = fits(pw) && s >= 1.75 ? 'pt' : fits(tinyWidth) ? 'tiny' : 'bars';
  const lh = face === 'pt' ? 10 : 6, gap = face === 'pt' ? 5 : 3;
  let y = py0 + m;
  fill(b, px0 + m - 1, y, pw0 - 2 * m + 1, 1, PAL.N2); y += gap + 1;
  const put = (l: string, col: number) => {
    if (face === 'pt') pt(b, l, px0 + m, y, col);
    else if (face === 'tiny') tiny(b, l, px0 + m, y, col);
    else { const bw = Math.min(inner, Math.round((tinyWidth(l) / 33) * inner)); fill(b, px0 + m, y + 1, bw, 2, col === PAL.N1 ? PAL.G3 : PAL.R1); }
  };
  for (const l of CAP1) { put(l, PAL.N1); y += lh; }
  fill(b, px0 + m - 1, y, pw0 - 2 * m + 1, 1, PAL.N2); y += gap;
  for (const l of CAP2) { if (y + lh - 2 < py0 + ch) put(l, PAL.R2); y += lh; }
};
/** the complaint tipping back off the nose plate about its foot (theta 0 upright .. 90 flat; the truck tips with it):
 *  the cover as a quad, its foot at z, its top falling away from us */
export const COMPLAINT_DEPTH = 0.115;
const complaintTipping = (b: Buf, X: number, z: number, theta: number) => {
  const r = (theta * Math.PI) / 180, hw = COMPLAINT_W / 2;
  const zt = z + COMPLAINT_DEPTH * Math.sin(r), Yt = AX.floor - 46 * Math.cos(r);
  const [ax, ay] = P2S(X - hw, AX.floor, z), [bx] = P2S(X + hw, AX.floor, z);
  const [dx, dy] = P2S(X - hw, Yt, zt), [cx] = P2S(X + hw, Yt, zt);
  for (let y = dy; y < ay; y++) {
    const t = (y - dy) / Math.max(1, ay - dy), l = Math.round(dx + (ax - dx) * t), rr = Math.round(cx + (bx - cx) * t);
    for (let x = l; x < rr; x++) b.set(x, y, x === l || x === rr - 1 || y === dy ? PAL.P0 : PAL.P2);
    b.set(rr, y, PAL.P0); b.set(rr + 1, y, PAL.P1);
  }
  // its caption mid-fall: ruled bars where the lines are (two dark, two red), foreshortened with the cover
  for (const [v, col, len] of [[0.12, PAL.G3, 0.7], [0.24, PAL.G3, 0.75], [0.52, PAL.R1, 0.4], [0.64, PAL.R1, 0.8]] as Array<[number, number, number]>) {
    const y = Math.round(dy + (ay - dy) * v), t = v, l = Math.round(dx + (ax - dx) * t) + 4, rr = Math.round(cx + (bx - cx) * t) - 4;
    if (y > dy && y < ay - 1) fill(b, l, y, Math.round((rr - l) * len), Math.max(1, Math.round((ay - dy) / 30)), col);
  }
  // the truck's wheels and nose plate at its foot
  const s = 1 / z, wr = Math.max(2, Math.round(3 * s));
  fill(b, ax - 2, ay - 2, bx - ax + 4, 2, PAL.G4);
  for (const wx of [ax + 4, bx - 4]) { ellipse(wx, ay + 1, wr, wr, b.ink(PAL.N0)); ellipse(wx, ay + 1, Math.max(1, wr - 2), Math.max(1, wr - 2), b.ink(PAL.G3)); }
};
/** the complaint flat on the floor, face up (it has tipped back with the truck under it: the nose plate and wheels at
 *  its near edge, the handles' ends past its far edge): a slab of pages under its cover, foreshortened; the caption in
 *  the tiny type on its far half until the flyer lands ON it and covers both its lines (no word of the complaint's is
 *  left beside the flyer). The flyer is its own sheet: warm white paper (the cover is cream), a few degrees of tilt,
 *  its shadow on the cover, its near corner curling up */
export const complaintFlat = (b: Buf, X: number, z: number, flyer: {on: boolean; legible: boolean} = {on: false, legible: false}, dust = 99) => {
  const zn = z, zf = z + COMPLAINT_DEPTH, hw = COMPLAINT_W / 2;
  const [ax, ay] = P2S(X - hw, AX.floor, zn), [bx] = P2S(X + hw, AX.floor, zn);
  const [cx, cy] = P2S(X + hw, AX.floor, zf), [dx] = P2S(X - hw, AX.floor, zf);
  const th = Math.round(3 / z);
  // the truck under it: the handles' ends past the far edge, the wheels either side of the near edge
  const [hx0] = P2S(X - hw + 3, AX.floor, zf + 0.02), [hx1] = P2S(X + hw - 3, AX.floor, zf + 0.02), [, hy] = P2S(0, AX.floor, zf + 0.02);
  for (const hx of [hx0, hx1]) { fill(b, hx, hy - th, 1, 3, PAL.G4); b.set(hx, hy - th, PAL.G5); }
  const s = 1 / z, wr = Math.max(2, Math.round(2.5 * s));
  for (const wx of [ax - 1, bx + 1]) { ellipse(wx, ay - 2, wr, wr, b.ink(PAL.N0)); ellipse(wx, ay - 2, Math.max(1, wr - 2), Math.max(1, wr - 2), b.ink(PAL.G3)); }
  // the pages' near face (a thick stack), the nose plate's grey lip under it, then the cover
  fill(b, ax, ay - th, bx - ax, th, PAL.P0); for (let x = ax; x < bx; x += 2) for (let j = 1; j < th; j += 2) b.set(x, ay - th + j, PAL.G6);
  fill(b, ax + 2, ay, bx - ax - 4, 1, PAL.G4);
  const top = cy - th, bot = ay - th;
  for (let y = top; y < bot; y++) {
    const t = (y - top) / Math.max(1, bot - top);
    const l = Math.round(dx + (ax - dx) * t), r = Math.round(cx + (bx - cx) * t);
    for (let x = l; x < r; x++) b.set(x, y, x === l || x === r - 1 ? PAL.P0 : PAL.P2);
  }
  const mid = Math.round((ax + bx) / 2), fmid = Math.round((dx + cx) / 2);
  if (!flyer.on) {
    tiny(b, 'NOLE V. MANALT', fmid - Math.round(tinyWidth('NOLE V. MANALT') / 2), top + 2, PAL.N1);
    tiny(b, 'YOU PROMISED!!!', mid - Math.round(tinyWidth('YOU PROMISED!!!') / 2), top + 9, PAL.R2);
  }
  if (dust >= 0 && dust < 10) {
    const d = dust >> 1, rr = 4 + d * 3;
    for (let a = 0; a < 24; a++) {
      if (hash(a, d, 77) < 0.25 + d * 0.12) continue;
      const ang = (a / 24) * Math.PI;
      for (const ex of [ax - 2, bx + 2]) { const px = Math.round(ex + Math.cos(ang) * rr * (ex < mid ? -1 : 1)), py = Math.round(ay - th - Math.sin(ang) * rr * 0.45); b.set(px, py, d < 2 ? PAL.P1 : PAL.G5); }
    }
  }
  if (flyer.on) flyerFlat(b, Math.round((mid + fmid) / 2), top - 1, flyer.legible);
};
/** where the flyer lies on the flat complaint (centre x, top y): over both caption lines */
export const FLYER_FLAT = {w: 72, h: 18};
const flyerFlat = (b: Buf, cx: number, y0: number, legible: boolean) => {
  const {w, h} = FLYER_FLAT, x0 = cx - (w >> 1);
  // a few degrees of tilt on the floor: its far edge a little right of its near edge, its sides sloping a pixel
  const xAt = (j: number) => x0 + Math.round((h - j) * 0.4) - 3;
  const yOff = (i: number) => Math.round((i - w / 2) * -0.06);
  // its shadow on the cover (down and right), then the sheet
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const X = xAt(j) + i + 2, Y = y0 + j + yOff(i) + 2; b.set(X, Y, stepColor(b.get(X, Y), -2)); }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const curl = i > w - 9 && j > h - 9 && (i - (w - 9)) + (j - (h - 9)) > 7;
    if (curl) continue;
    b.set(xAt(j) + i, y0 + j + yOff(i), i === w - 1 || j === h - 1 ? PAL.P1 : PAL.W9);
  }
  // the curl: its near right corner lifted, its underside showing
  for (let q = 0; q < 6; q++) for (let r = 0; r <= q; r++) b.set(xAt(h - 1) + w - 1 - r - (5 - q), y0 + h - 1 - q + yOff(w - 1) - 1, r === 0 ? PAL.P0 : PAL.P1);
  // tape at its far corners
  for (const ix of [1, w - 4]) { fill(b, xAt(0) + ix, y0 + yOff(ix), 3, 2, PAL.G6); }
  if (legible) tiny(b, 'WHERE IS ALYI?', xAt(3) + Math.round((w - tinyWidth('WHERE IS ALYI?')) / 2), y0 + 3 + yOff(w >> 1), PAL.N1);
  // its photo, foreshortened: a dark doorway band, the light through the half-open door; nobody in it
  const py = y0 + 10 + yOff(w >> 1);
  fill(b, xAt(10) + 8, py, w - 16, 5, PAL.G2); fill(b, xAt(10) + 31, py, 9, 5, PAL.N1); fill(b, xAt(10) + 34, py, 5, 5, PAL.W6); fill(b, xAt(10) + 31, py, 3, 5, PAL.D2);
};
/** a flyer in the air, tumbling: its face (rot even) or its back (odd) */
export const flyerFalling = (b: Buf, x: number, y: number, rot: number) => {
  const w = [14, 10, 14, 6][rot & 3], h = [18, 18, 12, 18][rot & 3];
  fill(b, x - (w >> 1), y - (h >> 1), w, h, rot & 1 ? PAL.P1 : PAL.W9);
  if (!(rot & 1)) { fill(b, x - (w >> 1) + 2, y - (h >> 1) + 2, w - 4, 2, PAL.N2); fill(b, x - (w >> 1) + 3, y, w - 6, (h >> 1) - 2, PAL.G2); }
};
/** Mas from behind, in the foreground at frame left: the back of his head and his hood's shoulder, a silhouette with a
 *  rim of the doors' light along the edges that face them (it brightens when they open). Never moves. */
export const masSilhouette = (b: Buf, open: number) => {
  const rim = open > 0 ? PAL.W5 : PAL.C3, rim2 = open > 0 ? PAL.W3 : PAL.C1;
  const inside = (x: number, y: number) => {
    if (y >= RH + 4) return false;
    const head = Math.hypot((x - 74) / 29, (y - 84) / 35) < 1;
    const neck = x > 58 && x < 94 && y > 108 && y < 140;
    const hood = Math.hypot((x - 74) / 40, (y - 132) / 15) < 1;
    const sh = y > (x >= 76 ? 128 + 0.0048 * (x - 76) ** 2 : 128 + 0.0016 * (76 - x) ** 2);
    return head || neck || hood || (sh && x < 230);
  };
  for (let y = 40; y < RH; y++) for (let x = 0; x < 230; x++) {
    if (!inside(x, y)) continue;
    const edgeR = !inside(x + 1, y) || !inside(x + 1, y - 1);
    const edgeT = !inside(x, y - 1);
    const inHead = Math.hypot((x - 74) / 29, (y - 84) / 35) < 1 && y < 118;
    let c = inHead ? PAL.N1 : PAL.N0;
    if (inHead && y < 96 && hash(x >> 1, y >> 2, 3) < 0.22) c = PAL.N2;
    if (!inHead && Math.hypot((x - 74) / 40, (y - 132) / 15) < 0.8 && (x + y) % 9 === 0) c = PAL.N1;
    if (edgeR) c = x > 60 ? rim : rim2; else if (edgeT && x > 52) c = rim2;
    b.set(x, y, c);
  }
  fill(b, 84, 48, 3, 2, PAL.N1); fill(b, 86, 46, 3, 2, PAL.N1); b.set(89, 45, rim2);
};
export interface AxisState {
  swing: 0 | 1 | 2 | 3; pause: boolean; shake: [number, number]; open: number;
  truck?: {X: number; z: number; load: boolean} | null;
  /** the complaint tipping back (degrees) at the truck's place */
  tip?: {X: number; z: number; theta: number} | null;
  flat?: {X: number; z: number; flyer: {on: boolean; legible: boolean}; dust?: number} | null;
  falling?: {x: number; y: number; rot: number} | null;
  /** the load's dark shape behind the frosted doors (it has taken the top step) */
  ghost?: boolean;
  /** the courier's leg in the doorway behind the truck */
  leg?: 'brace' | 'back' | 'kick' | null;
  /** the flyers taped to the nearest pillar (right wall); `pinned` = the one that falls is still up */
  pinned?: boolean;
}
/** the nearest pillar's flyers (right wall, the near pillar): February's, curling */
export const PILLAR_FLYERS: Array<[number, number]> = [[438, 58], [446, 96]];
const pillarFlyer = (b: Buf, x: number, y: number) => {
  fill(b, x - 7, y - 9, 16, 20, PAL.N1);
  fill(b, x - 8, y - 10, 16, 20, PAL.W9); fill(b, x - 6, y - 8, 12, 2, PAL.N2); fill(b, x - 6, y - 5, 9, 1, PAL.N2);
  fill(b, x - 5, y - 2, 10, 9, PAL.G2); fill(b, x - 1, y - 1, 3, 8, PAL.W4);
  for (let i = 0; i < 3; i++) for (let j = 0; j <= i; j++) b.set(x + 7 - j, y + 7 + i - 2, PAL.P0);
  fill(b, x - 8, y - 10, 3, 3, PAL.G6); fill(b, x + 5, y - 10, 3, 3, PAL.G6);
};
export const axis = (b: Buf, f: number, st: AxisState) => {
  const room = axisRoom(f, st.open);
  const [sx, sy] = st.shake;
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, room.c[clamp(y - sy, 0, RH - 1) * W + clamp(x - sx, 0, W - 1)]);
  const t = new Buf(W, RH, TR);
  entrance(t, f, st.swing, st.pause);
  if (st.ghost) {
    const [dx0, dy0] = P2S(-12, AX.floor - 50, 1);
    for (let y = dy0; y < dy0 + 48; y++) for (let x = dx0; x < dx0 + 26; x++) if (bayer(x, y) < 0.55) t.set(x, y, PAL.G4);
  }
  if (st.leg) courierLeg(t, st.leg);
  for (const [i, [px, py]] of PILLAR_FLYERS.entries()) if (i > 0 || st.pinned) pillarFlyer(t, px, py);
  if (st.truck) truckAt(t, st.truck.X, st.truck.z, {load: st.truck.load});
  if (st.tip) complaintTipping(t, st.tip.X, st.tip.z, st.tip.theta);
  if (st.flat) complaintFlat(t, st.flat.X, st.flat.z, st.flat.flyer, st.flat.dust);
  if (st.falling) flyerFalling(t, st.falling.x, st.falling.y, st.falling.rot);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const c = t.c[clamp(y - sy, 0, RH - 1) * W + clamp(x - sx, 0, W - 1)]; if (c !== TR) b.set(x, y, c); }
  masSilhouette(b, st.open);
};

// ================================================================== 1.10: the pages
/** the paper of a page filling the frame (a slight fold shadow, the grain): lobby2-art's page */
const pageBg = (b: Buf) => { fill(b, 0, 0, W, RH, PAL.P2); for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) if (((x * 7 + y * 13) % 97) === 0) b.set(x, y, PAL.P1); fill(b, 0, 196, W, 7, PAL.P0); };
/** page one: set like a page of body text, edge to edge, and every mark on it an exclamation point: a header line,
 *  justified paragraphs (an indent, a short last line), the page number at its foot */
const pageOne = (b: Buf) => {
  pageBg(b);
  const L = 26, R = 454;
  // the header: a centred run in the display face, a rule under it
  const hd = '! ! ! ! ! ! ! !', hw = bpw(hd);
  bpt(b, hd, 240 - (hw >> 1), 12, PAL.N1); fill(b, L, 32, R - L, 1, PAL.N2);
  // the body: 12 rows of 7 px type, every row justified to the margins
  const rows = 12, lastOf = [3, 7, 11], indentOf = [0, 4, 8];
  for (let r = 0; r < rows; r++) {
    const y = 42 + r * 12;
    const x0 = indentOf.includes(r) ? L + 18 : L;
    const x1 = lastOf.includes(r) ? L + 120 + ((r * 53) % 140) : R;
    const n = Math.floor((x1 - x0) / 6);
    for (let i = 0; i <= n; i++) { const x = Math.round(x0 + ((x1 - x0) * i) / n); if (hash(i, r, 9) < 0.93 || lastOf.includes(r)) pt(b, '!', x, y, PAL.N1); }
  }
  // the page number, centred: - ! -
  pt(b, '- ! -', 240 - (pw('- ! -') >> 1), 186, PAL.G3);
};
/** page one's near corner lifting in the doors' draught (on the flutter): size of the lifted triangle (0 = flat) */
const cornerLift = (b: Buf, n: number) => {
  if (n <= 0) return;
  // the lifted corner shows the page's back (a shade down) and lets the next page's paper show beneath it, its shadow
  for (let j = 0; j < n; j++) for (let i = 0; i < n - j; i++) {
    const x = W - 1 - i, y = 195 - j;
    b.set(x, y, PAL.P2);
  }
  for (let q = 0; q < n; q++) { const x = W - n + q, y = 195 - (n - 1 - q); for (let r = 0; r <= Math.floor(q * 0.55); r++) b.set(x, y - r, r === 0 ? PAL.G5 : PAL.P1); b.set(x - 1, y + 1, stepColor(b.get(x - 1, y + 1), -1)); }
};
/** 1.10: page one (from k0; the corner lifts on the flutter and flutters on 3s), then the page lifts off in three held
 *  steps from `turn`, then the contents */
export const pageTurn = (b: Buf, k: number, flut: number, turn: number) => {
  if (k >= turn + 6) { complaintPageECU(b, 1); return; }
  if (k < turn) {
    pageOne(b);
    const j = k - flut;
    if (j >= 0) cornerLift(b, [16, 32, 22, 40, 26, 46][Math.min(5, Math.floor(j / 3))]);
    return;
  }
  complaintPageECU(b, 1);
  const s = (k - turn) >> 1;
  const keep = [300, 150, 40][s];
  const one = new Buf(W, RH, 0);
  pageOne(one);
  for (let y = 0; y < RH; y++) for (let x = 0; x < keep; x++) b.set(x, y, one.c[y * W + x]);
  const curl = [26, 34, 18][s];
  for (let y = 0; y < RH; y++) { for (let i = 0; i < curl; i++) b.set(keep + i, y, i < 2 ? PAL.P0 : i < curl - 3 ? PAL.P1 : PAL.G5); for (let i = 0; i < 6; i++) b.set(keep + curl + i, y, stepColor(b.get(keep + curl + i, y), -1)); }
};

// ================================================================== 1.12: the sign from below; Mas's CU
/** a DAYS SINCE board for the LOW: the board, its cream panel and its number plate drawn flat at 2x WITHOUT their
 *  words; the words are separate 2x stamps, laid on after the keystone (so no glyph loses a pixel to it) */
interface Board2x { board: Buf; words: Array<{img: Buf; x: number; y: number}> }
const BOARDS = new Map<string, Board2x>();
const x2 = (src: Buf) => { const o = new Buf(src.w * 2, src.h * 2, TR); for (let y = 0; y < o.h; y++) for (let x = 0; x < o.w; x++) o.c[y * o.w + x] = src.c[(y >> 1) * src.w + (x >> 1)]; return o; };
const board2x = (lines: string[], num: string): Board2x => {
  const key = lines.join('|') + num;
  const hit = BOARDS.get(key);
  if (hit) return hit;
  const tw = Math.max(...lines.map((l) => pw(l))), pwd = bpw(num) + 14, FW = tw + 12 + pwd + 6, FH = lines.length * 11 + 10;
  const F = new Buf(FW, FH, TR);
  fill(F, 0, 0, FW, FH, PAL.G3); fill(F, 0, 0, FW, 1, PAL.G5); fill(F, 0, FH - 1, FW, 1, PAL.N1);
  fill(F, 2, 2, tw + 8, FH - 4, PAL.P1); fill(F, 2, 2, tw + 8, 1, PAL.L2);
  const px0 = tw + 13, ph = Math.min(FH - 8, 24), py0 = Math.round((FH - ph) / 2);
  fill(F, px0, py0, pwd, ph, PAL.N0); fill(F, px0 + 2, py0 + 2, pwd - 4, ph - 4, PAL.P2);
  const words: Board2x['words'] = [];
  lines.forEach((l, i) => { const t = new Buf(pw(l) + 1, 8, TR); pt(t, l, 0, 0, PAL.N1); words.push({img: x2(t), x: 6 * 2, y: (6 + i * 11) * 2}); });
  { const t = new Buf(bpw(num) + 1, 15, TR); bpt(t, num, 0, 0, PAL.R2); words.push({img: x2(t), x: (px0 + Math.round((pwd - bpw(num)) / 2)) * 2, y: (py0 + Math.round((ph - 14) / 2)) * 2}); }
  const out = {board: x2(F), words};
  BOARDS.set(key, out);
  return out;
};
/** a board at (cx, top), keystoned across (narrower toward its top, as overhead), its words laid on whole at their
 *  rows' places, on its two wires; returns its foot and its right edge at mid-height */
const keystone = (b: Buf, B: Board2x, cx: number, top: number, k0 = 0.9, wire = 40) => {
  const S = B.board;
  const half = (y: number) => (S.w / 2) * (k0 + (1 - k0) * (y / (S.h - 1)));
  for (let y = 0; y < S.h; y++) {
    const h = half(y);
    for (let x = Math.round(cx - h); x < Math.round(cx + h); x++) {
      const u = (x - (cx - h)) / (2 * h), c = S.c[y * S.w + clamp(Math.floor(u * S.w), 0, S.w - 1)];
      if (c !== TR) b.set(x, top + y, c);
    }
  }
  for (const w of B.words) {
    // each stamp centred where its own centre lands on the keystoned board (whole glyphs, inside the narrowed panel)
    const yc = w.y + (w.img.h >> 1), h = half(yc), X = Math.round(cx - h + ((w.x + w.img.w / 2) / S.w) * 2 * h - w.img.w / 2);
    for (let y = 0; y < w.img.h; y++) for (let x = 0; x < w.img.w; x++) { const c = w.img.c[y * w.img.w + x]; if (c !== TR) b.set(X + x, top + w.y + y, c); }
  }
  const h0 = (S.w / 2) * k0;
  if (wire > 0) { line(Math.round(cx - h0) + 20, top - wire, Math.round(cx - h0) + 24, top, b.ink(PAL.G5)); line(Math.round(cx + h0) - 20, top - wire, Math.round(cx + h0) - 24, top, b.ink(PAL.G5)); }
  return {foot: top + S.h, right: Math.round(cx + half(S.h >> 1))};
};
const SIGN_TOP = 2;
const signFlat = (b: Buf) => {
  vramp(b, 0, 0, W, RH, [PAL.G2, PAL.G3, PAL.G4]);
  for (let y = 0; y < RH; y += 12) fill(b, 0, y, W, 1, PAL.G2);
  return keystone(b, board2x(SIGN_LINES, '100'), 240, SIGN_TOP, 0.93).foot;
};
const CUFF = [PAL.W2, PAL.W3, PAL.W3, PAL.W4, PAL.W5, PAL.W5, PAL.W6], SLEEVE = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5];
const dotHandZero = (b: Buf, x: number, y: number) => {
  const r = {x: x - 20, y: y - 56, w: 44, h: 56};
  holdPhone(b, r, {side: 'R', grip: 'cup', light: 'lobby', widthCm: 12, thumbAt: -0.6, sleeveTo: [x + 88, y + 88], cuffRamp: CUFF, sleeveRamp: SLEEVE, skinMap: skinDown(1),
    drawPhone: (bb) => { fill(bb, r.x, r.y, r.w, r.h, PAL.P2); fill(bb, r.x, r.y, r.w, 2, PAL.W9); fill(bb, r.x + r.w - 2, r.y, 2, r.h, PAL.P0); bpt(bb, '0', r.x + Math.round((r.w - bpw('0')) / 2), r.y + Math.round(r.h / 2) - 7, PAL.R2); }});
};
/** her hand gripping a board's right edge (the fingers round behind it, the thumb on its face), the sleeve down to the
 *  ladder out of frame right; the board's pixels are put back over the hand's hidden part */
const gripBoardEdge = (b: Buf, ex: number, y: number) => {
  const snap = b.clone();
  const r = {x: ex - 16, y, w: 16, h: 22};
  holdPhone(b, r, {side: 'R', grip: 'wrap', light: 'lobby', widthCm: 6, thumbAt: 0.4, sleeveTo: [ex + 70, RH + 30], cuffRamp: CUFF, sleeveRamp: SLEEVE, skinMap: skinDown(1),
    drawPhone: (bb) => { for (let yy = r.y; yy < r.y + r.h; yy++) for (let xx = r.x; xx < r.x + r.w; xx++) bb.set(xx, yy, snap.get(xx, yy)); }});
};
export const signLow = (b: Buf, f: number, st: {zero: 'out' | 'down' | 'gone'; second: 0 | 1 | 2 | 3; hand: boolean}) => {
  const foot = signFlat(b);
  if (st.zero === 'out') dotHandZero(b, 414, 176 + (Math.floor(f / 10) % 2));
  if (st.zero === 'down') dotHandZero(b, 424, 214);
  if (st.second > 0) {
    // the second, smaller sign: DAYS SINCE SOMEONE SUED MAS: 0, coming up into place under the first in her hand
    const y0 = [0, 200, 170, foot + 10][st.second];
    const k2 = keystone(b, board2x(['DAYS SINCE', 'SOMEONE', 'SUED MAS:'], '0'), 240, y0, 0.93, st.second === 3 ? 10 : 0);
    if (st.hand) gripBoardEdge(b, k2.right, y0 + 14);
  }
};
/** [MCU] the lobby behind him, out of focus, in this lobby's own materials (sets/lobby2): the cool stone in soft
 *  courses, the DAYS SINCE board's beige panel and its plate a soft block upper right (no letters, only cooler bands),
 *  a rack pillar at the right with its cyan LEDs as round bokeh, the floor's dark at the foot */
const cuBackdrop = (() => {
  let cache: Buf | null = null;
  return () => {
    if (cache) return cache;
    const b = new Buf(W, RH, PAL.G2);
    for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
      const t = y / RH + (bayer(x, y) - 0.5) * 0.16;
      const course = ((y + 6) % 30) < 3 && bayer(x, y) < 0.5;
      b.set(x, y, t > 0.86 ? PAL.N2 : t > 0.74 ? PAL.G1 : course ? PAL.G1 : x > 300 && t < 0.4 ? PAL.G3 : PAL.G2);
    }
    // the board: a soft beige block (its panel), the grey board round it, the plate a paler patch with a soft red core
    const soft = (x0: number, y0: number, x1: number, y1: number, core: number, edge: number, reach = 6) => {
      for (let y = y0 - reach; y < y1 + reach; y++) for (let x = x0 - reach; x < x1 + reach; x++) {
        const dx = Math.max(x0 - x, 0, x - x1 + 1), dy = Math.max(y0 - y, 0, y - y1 + 1), d = Math.hypot(dx, dy) / reach;
        if (d >= 1) continue;
        if (d === 0 || bayer(x, y) > d * 1.1) b.set(x, y, d < 0.45 ? core : edge);
      }
    };
    soft(250, -10, 480, 92, PAL.G3, PAL.G2, 8);
    soft(262, -6, 410, 82, PAL.P1, PAL.G4, 7);
    for (let r = 0; r < 4; r++) for (let x = 272; x < 380 - (r % 2) * 40; x++) for (let j = 0; j < 4; j++) { const y = 2 + r * 20 + j; if (bayer(x, y) < 0.35 && b.get(x, y) === PAL.P1) b.set(x, y, PAL.G5); }
    soft(424, 4, 470, 56, PAL.P2, PAL.G4, 6);
    soft(436, 18, 458, 42, PAL.R3, PAL.P1, 5);
    // the rack pillar at the right edge: dark steel, its LEDs as soft cyan discs
    soft(452, 96, 480, RH, PAL.N2, PAL.G1, 6);
    for (let k = 0; k < 7; k++) {
      const cx = 462 + (k % 2) * 8, cy = 104 + k * 14, r = 3 + (k % 3 === 0 ? 1 : 0);
      for (let y = cy - r - 2; y <= cy + r + 2; y++) for (let x = cx - r - 2; x <= cx + r + 2; x++) { const d = Math.hypot(x - cx, y - cy); if (d <= r) b.set(x, y, k % 3 === 1 ? PAL.C5 : PAL.C6); else if (d <= r + 2 && bayer(x, y) < 0.5) b.set(x, y, PAL.C3); }
    }
    cache = b;
    return b;
  };
})();
/** [MCU] Mas in the lobby (Ep1's approved CU drawing on this lobby's backdrop); dx moves the drawing a whole pixel (the
 *  head shake) */
export const masCU = (b: Buf, f: number, dx: number) => {
  b.c.set(cuBackdrop().c.subarray(0, W * RH), 0);
  void f;
  blitImg(b, masCUImg('cyan'), dx, 0, {clip: (_x, y) => y < RH});
};

// ================================================================== 1.13: the flyer's doorway, the Orb's iris
/** where the doorway's light lands (native), matched to the intro's first frame (its lit block, x 82..116, y 37..120) */
export const DOOR_LIGHT = {x: 82, y: 37, w: 34, h: 84};
/** the complaint's cover round the flyer, framed tight on the flyer: plain cover (its caption lies under the flyer) */
const flyerCover = (b: Buf) => {
  fill(b, 0, 0, W, RH, PAL.P2);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) if (((x * 7 + y * 13) % 97) === 0) b.set(x, y, PAL.P1);
};
/** the flyer at ECU scale, its own sheet: warm white paper (the cover is cream), its shadow on the cover, tape at its
 *  top corners, its lower right corner curling up; the photo (nobody in it: a dark frame, the door half open on light)
 *  with its door light at DOOR_LIGHT, the headline under it */
const flyerBig = (b: Buf) => {
  const D = DOOR_LIGHT;
  const fx0 = D.x - 54, fy0 = -8, fw = 156, fh = 210;
  for (let j = 0; j < fh; j++) for (let i = 0; i < fw; i++) { const X = fx0 + i + 5, Y = fy0 + j + 5; if (Y >= 0 && Y < RH && X >= 0) b.set(X, Y, stepColor(b.get(X, Y), j > fh - 4 || i > fw - 4 ? -3 : -2)); }
  fill(b, fx0, fy0, fw, fh, PAL.W9); fill(b, fx0 + fw - 2, fy0, 2, fh, PAL.P2); fill(b, fx0, fy0 + fh - 2, fw, 2, PAL.P2);
  // the photo: a dark corridor, the door frame, the half-open door's lit room beyond (nobody in it)
  const px = fx0 + 12, py = 26, pwd = fw - 24, ph = 112;
  fill(b, px, py, pwd, ph, PAL.G2); fill(b, px, py, pwd, 2, PAL.G1);
  fill(b, D.x - 8, D.y - 6, D.w + 16, D.h + 6, PAL.N1);
  fill(b, D.x, D.y, D.w, D.h, PAL.W5); fill(b, D.x + 12, D.y, D.w - 12, D.h, PAL.W6);
  for (let y = D.y + 4; y < D.y + D.h; y += 9) fill(b, D.x + 14, y, D.w - 16, 1, PAL.W7);
  fill(b, D.x - 8, D.y - 6, 8, D.h + 6, PAL.D2); fill(b, D.x - 2, D.y - 6, 2, D.h + 6, PAL.D3);
  poly([D.x, D.y, D.x + 10, D.y + 4, D.x + 10, D.y + D.h - 2, D.x, D.y + D.h], b.ink(PAL.D1));
  const h1 = 'WHERE IS', h2 = 'ALYI?';
  bpt(b, h1, fx0 + Math.round((fw - bpw(h1)) / 2), 152, PAL.N1); bpt(b, h2, fx0 + Math.round((fw - bpw(h2)) / 2), 172, PAL.N1);
  for (const [tx, ty] of [[fx0 - 2, fy0 + 6], [fx0 + fw - 14, fy0 + 6]]) for (let j = 0; j < 12; j++) for (let i = 0; i < 16; i++) b.set(tx + i, ty + j, (i + j) % 5 ? PAL.G6 : PAL.P1);
  // the curl: the lower right corner lifted off the cover, its underside a shade down, the cover's shadow under it
  const cx = fx0 + fw, cy = 196, n = 24;
  for (let j = 0; j < n; j++) for (let i = 0; i < n - j; i++) b.set(cx - 1 - i, cy - j, i < 2 || j < 2 ? stepColor(PAL.P2, -2) : PAL.P2);
  for (let q = 0; q < n; q++) for (let r = 0; r <= Math.floor(q * 0.5); r++) b.set(cx - n + q - r, cy - (n - 1 - q) + r, r === 0 ? PAL.P0 : PAL.P1);
};
/** the iris: a hexagonal aperture of six dark blades closing on the door light; r = its radius (null = open) */
const iris = (b: Buf, r: number, rot: number) => {
  const cx = DOOR_LIGHT.x + DOOR_LIGHT.w / 2, cy = DOOR_LIGHT.y + DOOR_LIGHT.h / 2;
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy;
    const a = Math.atan2(dy, dx) - rot, sector = Math.PI / 3;
    const local = ((a % sector) + sector) % sector - sector / 2;
    const rr = Math.hypot(dx, dy) * Math.cos(local);
    if (rr < r) continue;
    const blade = Math.floor((((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / sector);
    const edge = rr < r + 2;
    b.set(x, y, edge ? PAL.C2 : (blade & 1) ? PAL.N1 : PAL.N0);
  }
};
export const flyerIris = (b: Buf, f: number, st: {orb: {x: number; y: number; look: [number, number]} | null; iris: number | null}) => {
  flyerCover(b);
  flyerBig(b);
  void f;
  if (st.orb) drawOrb(b, st.orb.x, st.orb.y, 30, {look: st.orb.look, aperture: 0.55});
  if (st.iris !== null) iris(b, st.iris, 0.18 + (300 - st.iris) / 900);
};
void drawFlyer;
