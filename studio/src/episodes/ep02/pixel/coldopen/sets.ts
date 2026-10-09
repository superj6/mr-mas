// MR. MAS — Ep2 v1 · coldopen: the cold open's own drawings (the shots pass, 2026-10-09). The rooms, cast and props
// are the art pass's (studio/src/episodes/ep02/pixel/art/, show/episodes/ep02/production/v1/art.md) and Ep1's shared
// rigs, imported read-only; this file composes them per framing and draws what the art pass left to the shot pass:
//   master(b, st)          SET-01's side-on master (sets/lobby2.ts drawLobby2) with sc 1's cast placed: Mas at his
//                          counter with the Orb at his shoulder, the staff on their beanbags (poses per beat), GERG on his
//                          own beanbag at the front row's left end, SELBEEP under the screen, the lobby chair, the pixel
//                          mammoth and its prints, DOT up the ladder; the wall screen (AROS under the overlay, or the
//                          meadow after the step-out, or off)
//   gergOTS(b, f, mouth)   [OTS] over GERG's laptop: his portrait (cast/gerg) low at frame left, the lid's back in front
//   selbeepFore(b, s)      SELBEEP's bust in the right foreground (cast/selbeep, Ep2's sculpted head)
//   medium(b, f, st)       1.02's MEDIUM: the stone wall close, a rack pillar, the wall screen's bezel big (the overlay
//                          plays in MED.screen); the pixel foot breaking the bezel's lower edge
//   counter(b, f, st)      1.07: the back counter, MAS at medium (cast/mas-medium) with the Orb, his water and a staffer's
//                          coffee on the stone top, DOT's ladder and her feet at frame right
//   axis(b, f, st)         1.09 / 1.11 [OTS-W] over MAS's shoulder straight down the axis to the glass doors: a
//                          one-point lobby (the master's materials), the doors' swing, the hand truck and the complaint
//                          at any depth, the complaint flat on the floor, the flyer; Mas's silhouette never moves
//   pageTurn(b, k)         1.10: page one (all exclamation points) turning to the contents (sets/lobby2-art.ts pages)
//   signLow(b, f, st)      1.12 [LOW]: the sign from below (sets/lobby2-art.ts signFromBelow), DOT's spare 0, then the
//                          second sign coming up under it in her hand
//   masCU(b, f, dx)        1.12 [MCU]: MAS (cast/mas-cu, the lobby backdrop): the head shake is the drawing moved 1 px
//   flyerIris(b, k, st)    1.13 [ECU]: the flyer's doorway on the complaint, the Orb's iris closing on it; its last
//                          frames put the doorway's light where the intro's first frame has its lit block
// Rules: native 480 x 270 (the room area rows 0..202), the master palette, whole-pixel moves, held drawings. Adult Mas
// never blinks. No cursor anywhere. No person in the 2.A take; the flyer's photo is a doorway with nobody in it.
import {Buf, rect, line, poly, ellipse, bayer, hash, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {MatBuf, Lights, resolve} from '../../../../shared/pixel/light';
import {blitImg} from '../../../../shared/pixel/figure';
import {bigText, bigTextWidth} from '../../../../shared/pixel/font';
import {LOBBY} from '../../../../shared/pixel/rooms/lobby';
import {drawOrb as drawOrbSmall} from '../../../../shared/pixel/cast/orb';
import {drawOrb, orbBob} from '../../../../shared/pixel/cast/orb-medium';
import {gergPortrait, gergTypeAt} from '../../../../shared/pixel/cast/gerg';
import {drawGergPose} from '../../../../shared/pixel/cast/gerg-poses';
import {drawMasMedium} from '../../../../shared/pixel/cast/mas-medium';
import {masCU as masCUImg, drawCUBackdrop} from '../../../../shared/pixel/cast/mas-cu';
import {putBustCut} from '../../../../shared/pixel/cast/civic-kit';
import {drawLobby2, drawSignBoard, LOBBY2} from '../art/sets/lobby2';
import {complaintPageECU} from '../art/sets/lobby2-art';
import {drawMammoth, mammothPrint, meltChair, MAMMOTH_RAMP} from '../art/creatures';
import {drawSelbeepRoom, drawDirectorsChair, selbeepBust} from '../art/cast/selbeep';
import type {SelbeepBust} from '../art/cast/selbeep';
import {drawDotLadder} from '../art/cast/dot';
import {drawMasStand2} from '../art/cast/mas2';
import {seatedStaff, beanbag} from '../art/cast/civic2';
import type {SeatPose} from '../art/cast/civic2';
import {holdPhone, skinDown} from '../art/cast/hands2';
import {fill, dith, pt, pw, bpt, bpw, tiny, tinyWidth, TR, vramp} from '../art/kit';
import {AROS_MEADOW, AROS_FOOT} from './aros';
void LOBBY; // its lit materials (lb.*) register when it loads

export const RH = 203;
const W = 480;

// ================================================================== the master (sets/lobby2.ts) with sc 1's cast
/** where things stand in the master (native); the screen is LOBBY2.SCREEN (344,24 .. 446,124) */
export const M = {
  mas: {x: 56, y: 152},
  orb: {x: 38, y: 86},
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
export interface MasterState {
  f: number;
  day: 15 | 29;
  screen?: 'clip' | 'meadow' | 'off';
  sign1?: string;
  mammoth?: {x: number; f: number; fifth?: boolean; dy?: number} | null;
  /** the prints right of this x are down (the mammoth has passed them); 0 = all */
  printsFrom?: number | null;
  chair?: 0 | 1 | 2 | 3 | null;
  selbeep?: {arm: 'down' | 'point' | 'present'; mouth: 'rest' | 'open' | 'smile'; flip?: boolean} | null;
  dot?: {pose: 'reach' | 'hold' | 'grip'; tilt: -1 | 0 | 1} | null;
  glance?: boolean;
  gerg?: boolean;
  staff?: (seed: number) => SeatPose;
  door?: 0 | 1 | 2;
  /** the door glass's rattle: 0 still, 1/2 the two drawings of its shiver (a light step on the glass, the frame 1 px) */
  rattle?: 0 | 1 | 2;
  /** the cups on Mas's counter: the coffee's lift in px */
  cupLift?: number;
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
/** his water glass and a staffer's coffee on the counter's stone top (room scale) */
const cups = (b: Buf, lift: number) => {
  const top = LOBBY2.COUNTER.top;
  // the water: a tumbler, its rim, the water line, the light through it
  fill(b, 14, top - 6, 4, 6, PAL.C6); fill(b, 15, top - 4, 2, 3, PAL.C4); fill(b, 14, top - 6, 4, 1, PAL.P2); b.set(17, top - 5, PAL.P2);
  // the coffee: a paper cup with its sleeve and lid (it jumps on the thud)
  const y = top - 7 - lift;
  fill(b, 22, y, 5, 7, PAL.P1); fill(b, 22, y + 2, 5, 3, PAL.D3); fill(b, 21, y - 1, 7, 1, PAL.G5); fill(b, 26, y, 1, 7, PAL.P0);
};
/** Mas at the back (Ep2's stand rig), the glance = his eye one pixel down toward the chair */
const masBack = (b: Buf, glance: boolean) => {
  drawMasStand2(b, M.mas.x, M.mas.y, {arm: 'down'});
  if (glance) {
    // the rig's eyes are the head stamp's 'e' pixels (row 7, cols 9 and 12; stamp at x 11): local (20, 7), (23, 7)
    const x0 = M.mas.x - 20, y0 = M.mas.y - 78;
    for (const ex of [20, 23]) { const skin = b.get(x0 + ex + 1, y0 + 7); b.set(x0 + ex, y0 + 8, b.get(x0 + ex, y0 + 7)); b.set(x0 + ex, y0 + 7, skin); }
  }
};
/** the staff rows (lobby2's own, with their poses given) and GERG on his beanbag at the front row's left end */
const staffRows = (b: Buf, f: number, pose: (seed: number) => SeatPose, gerg: boolean) => {
  const rows: Array<[number, number]> = [[176, 0], [190, 1]];
  for (const [ry, r] of rows) {
    if (r === 1 && gerg) {
      beanbag(b, M.gerg.x - 4, ry - 22, 4);
      drawGergPose(b, M.gerg.x + 8, ry + 6, {body: 'sit', type: gergTypeAt(Math.floor(f / 2)), look: 'screen'});
    }
    for (let k = 0; k < 5; k++) {
      const x = 226 + k * 40 + r * 18, seed = r * 11 + k * 3 + 1;
      beanbag(b, x, ry - 4, seed);
      blitImg(b, seatedStaff({seed, pose: pose(seed)}), x + 2, ry - 28);
    }
  }
};
export const master = (b: Buf, st: MasterState) => {
  const f = st.f;
  const screen = st.screen ?? (st.day === 15 ? 'clip' : 'off');
  drawLobby2(b, {
    f, sign1: st.sign1 ?? (st.day === 15 ? '86' : '100'), sign2: null, flyers: 'feb', beanbags: false, door: st.door ?? 0,
    screen: screen === 'clip' ? clipBase : screen === 'meadow' ? meadowPlate : null,
  }, {
    back: (bb) => {
      cups(bb, st.cupLift ?? 0);
      masBack(bb, !!st.glance);
      drawOrbSmall(bb, M.orb.x, M.orb.y + orbBob(f), 5, {look: [0.6, 0.2], aperture: 0.5});
      if (st.dot) drawDotLadder(bb, M.dot.x, M.dot.y, st.dot.pose, st.dot.tilt);
      if (st.day === 15) drawDirectorsChair(bb, M.dirChair.x, M.dirChair.y);
    },
    floor: (bb) => {
      // the prints in its own ramp, then the chair, then the mammoth (the staff rows are in front of its legs)
      if (st.printsFrom !== null && st.printsFrom !== undefined) for (const [px, py] of M.prints) if (px > st.printsFrom) mammothPrint(bb, px, py);
      if (st.chair !== null && st.chair !== undefined) meltChair(bb, M.chair.x, M.chair.y, st.chair);
      if (st.mammoth) drawMammoth(bb, st.mammoth.x, M.mammothY + (st.mammoth.dy ?? 0), st.mammoth.f, {fifth: st.mammoth.fifth});
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
};

// ================================================================== the foreground figures
/** [OTS] over GERG's laptop: his approved portrait faced camera-right, low at frame left, cut by the frame's foot; the
 *  laptop's lid in front of him (its back to us, the screen's green spilling over its top edge onto his chin); his
 *  shoulders bob a pixel on his typing. mouth = the room flap on his take */
export const gergOTS = (b: Buf, f: number, mouth: 'open' | 'rest') => {
  const bob = gergTypeAt(Math.floor(f / 2)) === 2 ? 1 : 0;
  putBustCut(b, gergPortrait({mouth, lid: 1, look: 1}), -14, 88 + bob, RH, true);
  // his laptop's lid, low in the frame in front of him (its back to us, cut by the frame's foot): dark aluminium, its
  // rounded top corners, a hairline of light along its edge; the screen's green spills over that edge toward his chin
  const x0 = 76, x1 = 138, top = 180;
  for (let y = top; y < RH; y++) for (let x = x0; x <= x1; x++) {
    const r = y - top;
    if (r < 3 && (x - x0 < 3 - r || x1 - x < 3 - r)) continue;
    const edge = x === x0 || x === x1;
    b.set(x, y, r === 0 ? PAL.G4 : edge ? PAL.G1 : bayer(x, y) < 0.18 + r / 40 ? PAL.G2 : PAL.G3);
  }
  for (let x = x0 + 3; x < x1 - 2; x++) { b.set(x, top - 1, (x & 1) ? PAL.L2 : PAL.L1); if (bayer(x, top - 2) < 0.4) b.set(x, top - 2, PAL.L1); if (bayer(x, top - 3) < 0.15) b.set(x, top - 3, PAL.L1); }
  // the keys' clatter under his line: a fingertip's glint over the lid's edge on his typing
  if (gergTypeAt(Math.floor(f / 2)) === 1) { b.set(x0 + 18, top - 1, PAL.S4); b.set(x0 + 19, top - 1, PAL.S4); } else if (gergTypeAt(Math.floor(f / 2)) === 2) { b.set(x0 + 30, top - 1, PAL.S4); b.set(x0 + 31, top - 1, PAL.S4); }
};
/** SELBEEP's bust in the right foreground (Ep2's sculpted head, facing camera-left: the room), cut at the frame's foot */
export const SELBEEP_FORE = {x: 352, y: 66};
export const selbeepFore = (b: Buf, s: Partial<SelbeepBust>, x = SELBEEP_FORE.x, y = SELBEEP_FORE.y) => putBustCut(b, selbeepBust({arm: 'remote', ...s}), x, y, RH);
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
  // the leg comes out as wide as the take's leg at the lip and flares into a round foot; the shag hangs to a ragged
  // fringe two-thirds down; under it the grey, wrinkled foot and four nails along its curved front
  const half = (j: number) => { const base = (x1 - x0) / 2 - 2 + j * 0.16; const r = FOOT_H - 1 - j; return r < 6 ? base - (6 - r) * (6 - r) * 0.22 : base; };
  for (let j = 0; j < Math.min(out, FOOT_H); j++) {
    const hw = half(j), yy = yTop + j;
    for (let x = Math.round(cx - hw); x <= Math.round(cx + hw); x++) {
      const i = x - x0, xin = Math.min(x - (cx - hw), cx + hw - x);
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
      void i;
    }
  }
  if (out >= FOOT_H) {
    // the nails: four pale ovals on the foot's curved front, the outer ones higher up the curve
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
  // the cracks in the bezel's lower lip either side of the foot, and two chips of it falling
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
/** the counter: its stone top seen a little from above (far edge y 122, near lip 146-150), the steel front below */
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
export interface CounterState { cupLift: number; drops: number; tilt: -1 | 0 | 1 }
export const counter = (b: Buf, f: number, st: CounterState) => {
  b.c.set(counterBg().c.subarray(0, W * RH), 0);
  // the sign's foot over him, hung on its wires: its last line and its number plate (DAYS SINCE … FIRE MAS: 100)
  fill(b, 24, 0, 268, 28, PAL.G3); fill(b, 24, 27, 268, 1, PAL.N1); fill(b, 28, 0, 196, 24, PAL.P1);
  bpt(b, 'FIRE MAS:', 40, 6, PAL.N1);
  fill(b, 232, 0, 54, 25, PAL.N0); fill(b, 235, 0, 48, 22, PAL.P2); bpt(b, '100', 259 - Math.round(bpw('100') / 2), 5, PAL.R2);
  // DOT's ladder at frame right: its two rails up out of frame, the rungs, her shoes and trouser legs on a rung (from
  // behind, never her face); the whole ladder sways a pixel on the thud
  const lx = 388 + st.tilt;
  for (const [xa, xb] of [[lx - 24, lx - 15], [lx + 24, lx + 15]]) { line(xa, RH, xb + st.tilt, -10, b.ink(PAL.G5)); line(xa + (xa < lx ? 1 : -1), RH, xb + st.tilt + (xa < lx ? 1 : -1), -10, b.ink(PAL.G3)); }
  for (let r = 0; r < 8; r++) { const yy = 196 - r * 26; const hw = 22 - Math.round(r * 1.1); fill(b, lx - hw + st.tilt, yy, hw * 2 + 1, 2, PAL.G4); fill(b, lx - hw + st.tilt, yy, hw * 2 + 1, 1, PAL.G6); }
  const fy = 40, fx = lx - 12 + st.tilt * 2;
  fill(b, fx, 0, 9, fy - 2, PAL.N1); fill(b, fx + 1, 0, 2, fy - 2, PAL.N2); fill(b, fx + 13, 0, 9, fy - 2, PAL.N1); fill(b, fx + 14, 0, 2, fy - 2, PAL.N2);
  fill(b, fx - 2, fy - 3, 12, 4, PAL.N0); fill(b, fx + 12, fy - 3, 12, 4, PAL.N0); fill(b, fx - 2, fy - 3, 12, 1, PAL.G2); fill(b, fx + 12, fy - 3, 12, 1, PAL.G2);
  // MAS at medium (Ep1's approved medium rig, faced camera-right: the doors), his hands resting on the stone top
  const mx = 96, my = 38;
  drawMasMedium(b, mx, my, {head: '34', mouth: 'rest', lid: 0, look: 1, brow: 0, arm: 'rest', light: 'warm'}, {flip: true,
    desk: (bb) => { const t = counterBg(); for (let y = my + 84; y < RH; y++) for (let x = 0; x < CT.x1; x++) bb.set(x, y, t.c[y * W + x]); }});
  // the Orb behind his shoulder (frame left), looking where he looks
  drawOrb(b, 70, 56 + orbBob(f), 12, {look: [0.7, 0.15], aperture: 0.45});
  // his water: a tumbler on the stone (its walls catching the light, the water's band and surface, the counter seen
  // through it); it never moves
  const gx = 34, gb = 140;
  for (let y = gb - 26; y < gb; y++) for (let x = gx; x < gx + 16; x++) { const wall = x === gx || x === gx + 15; const water = y > gb - 17; b.set(x, y, wall ? PAL.G6 : water ? stepColor(b.get(x, y), 1) : b.get(x, y)); }
  fill(b, gx + 1, gb - 17, 14, 1, PAL.C7); fill(b, gx, gb - 26, 16, 1, PAL.P1); fill(b, gx + 2, gb - 24, 1, 20, PAL.P1); fill(b, gx, gb, 16, 1, PAL.G3);
  // a staffer's coffee: a paper cup, its sleeve and lid; lifted on the thud, its drops above it
  const cx = 222, cy = 136 - 30 - st.cupLift;
  fill(b, cx + 2, cy + 1, 18, 29, PAL.P2); fill(b, cx + 16, cy + 1, 4, 29, PAL.P1); fill(b, cx + 2, cy + 1, 1, 29, PAL.P1);
  fill(b, cx + 2, cy + 10, 18, 11, PAL.D3); fill(b, cx + 2, cy + 10, 18, 1, PAL.D4); fill(b, cx + 16, cy + 10, 4, 11, PAL.D2);
  fill(b, cx, cy - 3, 22, 4, PAL.G5); fill(b, cx, cy - 3, 22, 1, PAL.P1); fill(b, cx + 8, cy - 4, 6, 1, PAL.G4);
  fill(b, cx + 3, 136, 17, 1, st.cupLift ? PAL.G4 : PAL.G3);
  for (let d = 0; d < st.drops; d++) { const dx = cx + 5 + d * 9, dy = cy - 7 - d * 3; fill(b, dx, dy, 2, 2, PAL.D2); b.set(dx, dy, PAL.D4); }
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
    // daylight through the glass: a pool round the doors, and when they swing open a wedge down the floor toward us
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
    const X = dx * z, Y = dy * z, D = 1 / z; // world point; D grows toward the camera
    if (surf === 'far') {
      // the entrance wall: stone above and either side of the glass; the glass itself is painted after resolve
      if (Math.abs(X) <= AX.glassHalf && Y >= AX.glassTop) { mb.mat('lb.brass', 0)(x, y); continue; }
      mb.mat('lb.stone', ((Math.floor((Y + 100) / 9) % 2) ? 0.2 : -0.1) + (Math.abs(((X + 200) % 18) - 9) < 0.6 ? -0.8 : 0))(x, y);
    } else if (surf === 'floor') {
      const tile = Math.abs(((X % 24) + 24) % 24 - 12) > 11.2 || Math.abs((((D * 3.2) % 1) + 1) % 1 - 0.5) > 0.47;
      if (Math.abs(X) < 20) { mb.mat('lb.velvet', Math.abs(X) > 18 ? -1.6 : -1.0)(x, y); continue; }
      mb.mat('lb.floor', tile ? -0.6 : 0.5)(x, y);
    } else if (surf === 'ceil') {
      mb.mat('lb.stoneDk', -0.6 + ((Math.floor(D * 2.2) % 2) ? 0.3 : 0))(x, y);
    } else {
      // the side walls: stone courses (constant Y) and, at three depths, a rack pillar with its LED column
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
/** the glass entrance at the far wall: fixed panes (frosted bright: the street is a blur), bronze mullions, the double
 *  doors (leaves swing toward us: 0 shut, 1 half, 2 open, 3 back off the stops); `street` = the doorway's view when
 *  open: the sidewalk, the steps going down, a planter with a PAUSE sign leaning on it (a group sign only) */
const entrance = (b: Buf, f: number, swing: 0 | 1 | 2 | 3, pause: boolean) => {
  const [gx0, gy0] = P2S(-AX.glassHalf, AX.glassTop, 1), [gx1, gy1] = P2S(AX.glassHalf, AX.floor, 1);
  const [dx0, dy0] = P2S(-AX.doorHalf, AX.doorTop, 1), [dx1] = P2S(AX.doorHalf, AX.floor, 1);
  // the frosted panes: bright, a soft vertical streak pattern (the street a blur of light)
  for (let y = gy0; y < gy1; y++) for (let x = gx0; x < gx1; x++) b.set(x, y, bayer(x, y) < 0.5 + 0.2 * Math.sin(x * 0.4) ? PAL.P1 : PAL.G6);
  // the transom and the mullions (bronze)
  fill(b, gx0 - 2, gy0 - 3, gx1 - gx0 + 4, 3, PAL.D3); fill(b, gx0 - 2, gy0 - 3, gx1 - gx0 + 4, 1, PAL.W5);
  fill(b, gx0 - 2, dy0 - 2, gx1 - gx0 + 4, 2, PAL.D3);
  for (const mx of [gx0 - 2, gx0 + 13, dx0 - 2, dx1, gx1 - 15, gx1]) fill(b, mx, gy0, 2, gy1 - gy0, PAL.D3);
  // the doorway: shut = two leaves of frosted glass; open = the street through it
  const dw = dx1 - dx0, mid = dx0 + (dw >> 1);
  if (swing > 0) {
    // the street: a pale sky, the far kerb, the sidewalk's paving, the steps down out of view, the planter and its sign
    vramp(b, dx0, dy0, dw, gy1 - dy0, [PAL.P1, PAL.G6, PAL.G5]);
    fill(b, dx0, dy0 + 24, dw, 6, PAL.G4); fill(b, dx0, dy0 + 30, dw, gy1 - dy0 - 30, PAL.P0);
    for (let x = dx0; x < dx1; x += 6) b.set(x, dy0 + 34, PAL.G5);
    fill(b, dx0, gy1 - 6, dw, 6, PAL.G5); fill(b, dx0, gy1 - 6, dw, 1, PAL.P1); fill(b, dx0, gy1 - 3, dw, 1, PAL.G4);
    // the planter (right of the steps) and the PAUSE sign leaning on it (clear of the load in the doorway)
    const plx = dx1 - 16;
    fill(b, plx, dy0 + 34, 14, 12, PAL.D2); fill(b, plx, dy0 + 34, 14, 1, PAL.D4); for (let i = 0; i < 14; i += 3) fill(b, plx + 1 + i, dy0 + 29 + (i % 2), 2, 5, PAL.L1);
    if (pause) { const sw = tinyWidth('PAUSE') + 4; const sx = dx1 - sw - 1; fill(b, sx, dy0 + 20, sw, 10, PAL.P2); fill(b, sx, dy0 + 20, sw, 1, PAL.N2); tiny(b, 'PAUSE', sx + 2, dy0 + 22, PAL.R2); line(sx + (sw >> 1), dy0 + 30, sx + (sw >> 1) - 2, dy0 + 36, b.ink(PAL.D2)); }
  } else {
    for (let y = dy0; y < gy1; y++) for (let x = dx0; x < dx1; x++) b.set(x, y, bayer(x, y) < 0.6 ? PAL.P1 : PAL.G6);
  }
  // the leaves: each a frosted pane in a bronze frame, hinged at the doorway's sides, swinging in toward us
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
/** the hand truck and the complaint upright on it, at depth z (X its centre): drawn at the scale of the depth, held on
 *  2s by the caller; the caption in the size that depth allows (tiny type far, the pixel face near) */
export const truckAt = (b: Buf, X: number, z: number, o: {load?: boolean; tip?: number} = {}) => {
  const s = 1 / z;
  const [cx, fy] = P2S(X, AX.floor, z);
  const cw = Math.round(30 * s), ch = Math.round(46 * s);
  const x0 = cx - (cw >> 1);
  // the truck: the nose plate, two wheels, the frame and its handles up behind the load
  const wr = Math.max(2, Math.round(3 * s));
  fill(b, x0 - 2, fy - 2, cw + 4, Math.max(2, Math.round(1.5 * s)), PAL.G4); fill(b, x0 - 2, fy - 2, cw + 4, 1, PAL.G6);
  for (const wx of [x0 + Math.round(cw * 0.15), x0 + cw - Math.round(cw * 0.15)]) { ellipse(wx, fy + 1, wr, wr, b.ink(PAL.N0)); ellipse(wx, fy + 1, Math.max(1, wr - 2), Math.max(1, wr - 2), b.ink(PAL.G3)); }
  for (const hx of [x0 + 2, x0 + cw - 3]) { fill(b, hx, fy - ch - Math.round(8 * s), Math.max(1, Math.round(s)), ch + Math.round(8 * s), PAL.G4); }
  fill(b, x0 + 2, fy - ch - Math.round(8 * s), cw - 4, Math.max(1, Math.round(s)), PAL.G5);
  if (o.load === false) return;
  // the complaint: the cover facing us, a thick edge of pages at its right, the caption over the title
  const px0 = x0 + 1, pw0 = cw - 2, py0 = fy - 3 - ch;
  fill(b, px0 + pw0, py0 + 2, Math.max(2, Math.round(3 * s)), ch - 2, PAL.P0);
  for (let j = 2; j < ch; j += 2) b.set(px0 + pw0 + 1, py0 + j, PAL.G6);
  fill(b, px0, py0, pw0, ch, PAL.P2); fill(b, px0, py0, pw0, 1, PAL.P2); fill(b, px0 + pw0 - 1, py0, 1, ch, PAL.P1); fill(b, px0, py0 + ch - 1, pw0, 1, PAL.P0);
  const m = Math.max(2, Math.round(3 * s));
  if (s < 1.35) {
    const L1 = ['NOLE v.', 'MANALT', 'ET AL.'], L2 = ['YOU', 'PROMISED', '!!!'];
    let y = py0 + m;
    fill(b, px0 + m - 1, y, pw0 - 2 * m + 2, 1, PAL.N2); y += 3;
    for (const l of L1) { tiny(b, l.toUpperCase(), px0 + m, y, PAL.N1); y += 6; }
    fill(b, px0 + m - 1, y, pw0 - 2 * m + 2, 1, PAL.N2); y += 3;
    for (const l of L2) { if (y + 5 < py0 + ch) tiny(b, l, px0 + m, y, PAL.R2); y += 6; }
  } else {
    const L1 = ['NOLE v.', 'MANALT', 'ET AL.'], L2 = ['YOU', 'PROMISED', '!!!'];
    let y = py0 + m;
    fill(b, px0 + m - 1, y, pw0 - 2 * m + 2, 1, PAL.N2); y += 4;
    for (const l of L1) { pt(b, l, px0 + m, y, PAL.N1); y += 10; }
    fill(b, px0 + m - 1, y, pw0 - 2 * m + 2, 1, PAL.N2); y += 5;
    for (const l of L2) { if (y + 8 < py0 + ch) pt(b, l, px0 + m, y, PAL.R2); y += 10; }
  }
};
/** the complaint flat on the floor, face up (it has tipped back off the truck, its foot where it stood, its top away
 *  from us): a slab of pages under its cover, foreshortened; the caption across it in the tiny type, reading the right
 *  way up; the flyer face up on its near half once it lands (its headline one line of the tiny type, its photo a
 *  doorway with nobody in it) */
export const COMPLAINT_DEPTH = 0.115;
export const complaintFlat = (b: Buf, X: number, z: number, flyer: {on: boolean; legible: boolean} = {on: false, legible: false}, dust = 99) => {
  const zn = z, zf = z + COMPLAINT_DEPTH, hw = 19;
  const [ax, ay] = P2S(X - hw, AX.floor, zn), [bx] = P2S(X + hw, AX.floor, zn);
  const [cx, cy] = P2S(X + hw, AX.floor, zf), [dx] = P2S(X - hw, AX.floor, zf);
  const th = Math.round(3 / z);
  // the pages' near face (a thick stack), then the cover
  fill(b, ax, ay - th, bx - ax, th, PAL.P0); for (let x = ax; x < bx; x += 2) for (let j = 1; j < th; j += 2) b.set(x, ay - th + j, PAL.G6);
  const top = cy - th, bot = ay - th;
  for (let y = top; y < bot; y++) {
    const t = (y - top) / Math.max(1, bot - top);
    const l = Math.round(dx + (ax - dx) * t), r = Math.round(cx + (bx - cx) * t);
    for (let x = l; x < r; x++) b.set(x, y, x === l || x === r - 1 ? PAL.P0 : PAL.P2);
  }
  const mid = Math.round((ax + bx) / 2);
  const fmid = Math.round((dx + cx) / 2);
  tiny(b, 'NOLE V. MANALT', fmid - Math.round(tinyWidth('NOLE V. MANALT') / 2), top + 2, PAL.N1);
  tiny(b, 'YOU PROMISED!!!', mid - Math.round(tinyWidth('YOU PROMISED!!!') / 2), top + 9, PAL.R2);
  // the thud's dust: a ring of paper dust out from under its ends, opening and thinning in held steps
  if (dust >= 0 && dust < 10) {
    const d = dust >> 1, r = 4 + d * 3;
    for (let a = 0; a < 24; a++) {
      if (hash(a, d, 77) < 0.25 + d * 0.12) continue;
      const ang = (a / 24) * Math.PI;
      for (const ex of [ax - 2, bx + 2]) { const px = Math.round(ex + Math.cos(ang) * r * (ex < mid ? -1 : 1)), py = Math.round(ay - th - Math.sin(ang) * r * 0.45); b.set(px, py, d < 2 ? PAL.P1 : PAL.G5); }
    }
  }
  if (flyer.on) {
    // the flyer, flat on the cover's near right, a little skewed
    const fw = 62, fh = 12, fx = mid - (fw >> 1) + 6, fyy = bot - fh - 1;
    for (let j = 0; j < fh; j++) { const sk = Math.round((fh - j) * 0.25); fill(b, fx + sk + 1, fyy + j + 1, fw, 1, PAL.G5); fill(b, fx + sk, fyy + j, fw, 1, PAL.P2); }
    fill(b, fx, fyy + fh - 1, fw, 1, PAL.P1);
    if (flyer.legible) tiny(b, 'WHERE IS ALYI?', fx + 5, fyy + 2, PAL.N1);
    // its photo, foreshortened: a dark doorframe, the light through the half-open door
    fill(b, fx + 6, fyy + 8, 50, 3, PAL.G2); fill(b, fx + 27, fyy + 8, 8, 3, PAL.N1); fill(b, fx + 30, fyy + 8, 4, 3, PAL.W6);
    for (const [tx, ty2] of [[fx + 2, fyy], [fx + fw - 2, fyy]]) fill(b, tx, ty2, 3, 2, PAL.G6);
  }
};
/** a flyer in the air (room-ish scale at depth z), tumbling: its face (rot even) or its back (odd) */
export const flyerFalling = (b: Buf, x: number, y: number, rot: number) => {
  const w = [14, 10, 14, 6][rot & 3], h = [18, 18, 12, 18][rot & 3];
  fill(b, x - (w >> 1), y - (h >> 1), w, h, rot & 1 ? PAL.P0 : PAL.P2);
  if (!(rot & 1)) { fill(b, x - (w >> 1) + 2, y - (h >> 1) + 2, w - 4, 2, PAL.N2); fill(b, x - (w >> 1) + 3, y, w - 6, (h >> 1) - 2, PAL.G2); }
};
/** Mas from behind, in the foreground at frame left: the back of his head and his hood's shoulder, a silhouette with a
 *  rim of the doors' light along the edges that face them (it brightens when they open). Never moves. */
export const masSilhouette = (b: Buf, open: number) => {
  const rim = open > 0 ? PAL.W5 : PAL.C3, rim2 = open > 0 ? PAL.W3 : PAL.C1;
  // the back of his head (an egg, the crown up), the neck into the hood bunched at his nape, the shoulders falling away
  // in one smooth curve to the frame's foot
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
    if (inHead && y < 96 && hash(x >> 1, y >> 2, 3) < 0.22) c = PAL.N2; // the hair's sheen
    if (!inHead && Math.hypot((x - 74) / 40, (y - 132) / 15) < 0.8 && (x + y) % 9 === 0) c = PAL.N1; // the hood's folds
    if (edgeR) c = x > 60 ? rim : rim2; else if (edgeT && x > 52) c = rim2;
    b.set(x, y, c);
  }
  // the cowlick's tip over his crown, against the far light
  fill(b, 84, 48, 3, 2, PAL.N1); fill(b, 86, 46, 3, 2, PAL.N1); b.set(89, 45, rim2);
};
export interface AxisState {
  swing: 0 | 1 | 2 | 3; pause: boolean; shake: [number, number]; open: number;
  truck?: {X: number; z: number; load: boolean} | null;
  flat?: {X: number; z: number; flyer: {on: boolean; legible: boolean}; dust?: number} | null;
  falling?: {x: number; y: number; rot: number} | null;
  /** the load's dark shape behind the frosted doors (it has taken the top step) */
  ghost?: boolean;
  /** the flyers taped to the nearest pillar (right wall); `pinned` = the one that falls is still up */
  pinned?: boolean;
}
/** the nearest pillar's flyers (right wall, the near pillar): February's, curling */
export const PILLAR_FLYERS: Array<[number, number]> = [[438, 58], [446, 96]];
const pillarFlyer = (b: Buf, x: number, y: number) => {
  // a flyer at this depth (16 x 20): the headline bar, the dim doorway photo, tape, its lower corner curling, its shadow
  fill(b, x - 7, y - 9, 16, 20, PAL.N1);
  fill(b, x - 8, y - 10, 16, 20, PAL.P2); fill(b, x - 6, y - 8, 12, 2, PAL.N2); fill(b, x - 6, y - 5, 9, 1, PAL.N2);
  fill(b, x - 5, y - 2, 10, 9, PAL.G2); fill(b, x - 1, y - 1, 3, 8, PAL.W4);
  for (let i = 0; i < 3; i++) for (let j = 0; j <= i; j++) b.set(x + 7 - j, y + 7 + i - 2, PAL.P0);
  fill(b, x - 8, y - 10, 3, 3, PAL.G6); fill(b, x + 5, y - 10, 3, 3, PAL.G6);
};
export const axis = (b: Buf, f: number, st: AxisState) => {
  const room = axisRoom(f, st.open);
  const [sx, sy] = st.shake;
  // the room layer (shaken on a thud: the UI never is, and nor is Mas)
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) b.set(x, y, room.c[clamp(y - sy, 0, RH - 1) * W + clamp(x - sx, 0, W - 1)]);
  const t = new Buf(W, RH, TR);
  entrance(t, f, st.swing, st.pause);
  if (st.ghost) {
    // behind the frosted leaves: the load's dark blur, upright on its truck at the top step
    const [dx0, dy0] = P2S(-12, AX.floor - 50, 1);
    for (let y = dy0; y < dy0 + 48; y++) for (let x = dx0; x < dx0 + 26; x++) if (bayer(x, y) < 0.55) t.set(x, y, PAL.G4);
  }
  for (const [i, [px, py]] of PILLAR_FLYERS.entries()) if (i > 0 || st.pinned) pillarFlyer(t, px, py);
  if (st.truck) truckAt(t, st.truck.X, st.truck.z, {load: st.truck.load});
  if (st.flat) complaintFlat(t, st.flat.X, st.flat.z, st.flat.flyer, st.flat.dust);
  if (st.falling) flyerFalling(t, st.falling.x, st.falling.y, st.falling.rot);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) { const c = t.c[clamp(y - sy, 0, RH - 1) * W + clamp(x - sx, 0, W - 1)]; if (c !== TR) b.set(x, y, c); }
  masSilhouette(b, st.open);
};

// ================================================================== 1.10: the pages
/** page one (every line exclamation points), the page lifting off it in three held steps, the contents under it */
export const pageTurn = (b: Buf, k: number, turnAt: number) => {
  const j = k - turnAt;
  if (j < 0) { complaintPageECU(b, 0); return; }
  if (j >= 3) { complaintPageECU(b, 1); return; }
  complaintPageECU(b, 1);
  // page one lifting from the right edge: its remaining part, a curled edge, its shadow on the contents
  const keep = [300, 150, 40][j];
  const one = new Buf(W, RH, 0);
  complaintPageECU(one, 0);
  for (let y = 0; y < RH; y++) for (let x = 0; x < keep; x++) b.set(x, y, one.c[y * W + x]);
  const curl = [26, 34, 18][j];
  for (let y = 0; y < RH; y++) { for (let i = 0; i < curl; i++) b.set(keep + i, y, i < 2 ? PAL.P0 : i < curl - 3 ? PAL.P1 : PAL.G5); for (let i = 0; i < 6; i++) b.set(keep + curl + i, y, stepColor(b.get(keep + curl + i, y), -1)); }
};

// ================================================================== 1.12: the sign from below; Mas's CU
/** the sign from below: the board drawn flat at 2x (its letters whole), then keystoned across only (each row a little
 *  narrower toward the top, the way a sign overhead recedes; no row is dropped, so no letter breaks), on its wires; DOT's
 *  hand (orange cuff, her navy sleeve) holding the spare 0 out from the ladder at frame right, or lowering it; the second
 *  sign coming up under the first in her hand and hanging: second 0 none .. 3 hung; hand = her hand still on it */
const SIGN_CACHE = new Map<string, Buf>();
/** a DAYS SINCE board drawn flat (the pixel face, its number in the display face on a plate), then doubled */
const signBoard2x = (lines: string[], num: string) => {
  const key = lines.join('|') + num;
  const hit = SIGN_CACHE.get(key);
  if (hit) return hit;
  const tw = Math.max(...lines.map((l) => pw(l))), pwd = bpw(num) + 14, FW = tw + 12 + pwd + 6, FH = lines.length * 11 + 10;
  const F = new Buf(FW, FH, TR);
  fill(F, 0, 0, FW, FH, PAL.G3); fill(F, 0, 0, FW, 1, PAL.G5); fill(F, 0, FH - 1, FW, 1, PAL.N1);
  fill(F, 2, 2, tw + 8, FH - 4, PAL.P1); fill(F, 2, 2, tw + 8, 1, PAL.L2);
  lines.forEach((l, i) => pt(F, l, 6, 6 + i * 11, PAL.N1));
  const px0 = tw + 13, ph = Math.min(FH - 8, 24), py0 = Math.round((FH - ph) / 2);
  fill(F, px0, py0, pwd, ph, PAL.N0); fill(F, px0 + 2, py0 + 2, pwd - 4, ph - 4, PAL.P2);
  bpt(F, num, px0 + Math.round((pwd - bpw(num)) / 2), py0 + Math.round((ph - 14) / 2), PAL.R2);
  const out = new Buf(FW * 2, FH * 2, TR);
  for (let y = 0; y < FH * 2; y++) for (let x = 0; x < FW * 2; x++) out.c[y * FW * 2 + x] = F.c[(y >> 1) * FW + (x >> 1)];
  SIGN_CACHE.set(key, out);
  return out;
};
/** a board at (cx, top), keystoned across (narrower toward its top, as overhead), on its two wires; returns its foot */
const keystone = (b: Buf, S: Buf, cx: number, top: number, k0 = 0.9, wire = 40) => {
  for (let y = 0; y < S.h; y++) {
    const v = y / (S.h - 1), half = (S.w / 2) * (k0 + (1 - k0) * v);
    for (let x = Math.round(cx - half); x < Math.round(cx + half); x++) {
      const u = (x - (cx - half)) / (2 * half), c = S.c[y * S.w + clamp(Math.floor(u * S.w), 0, S.w - 1)];
      if (c !== TR) b.set(x, top + y, c);
    }
  }
  const h0 = (S.w / 2) * k0;
  line(Math.round(cx - h0) + 20, top - wire, Math.round(cx - h0) + 24, top, b.ink(PAL.G5)); line(Math.round(cx + h0) - 20, top - wire, Math.round(cx + h0) - 24, top, b.ink(PAL.G5));
  return top + S.h;
};
const SIGN_TOP = 2;
const signFlat = (b: Buf) => {
  vramp(b, 0, 0, W, RH, [PAL.G2, PAL.G3, PAL.G4]);
  for (let y = 0; y < RH; y += 12) fill(b, 0, y, W, 1, PAL.G2);
  return keystone(b, signBoard2x(['DAYS SINCE', 'SOMEONE', 'TRIED TO', 'FIRE MAS:'], '100'), 240, SIGN_TOP);
};
const dotHandZero = (b: Buf, x: number, y: number) => {
  const r = {x: x - 20, y: y - 56, w: 44, h: 56};
  holdPhone(b, r, {side: 'R', grip: 'cup', light: 'lobby', widthCm: 12, thumbAt: -0.6, sleeveTo: [x + 88, y + 88],
    cuffRamp: [PAL.W2, PAL.W3, PAL.W3, PAL.W4, PAL.W5, PAL.W5, PAL.W6], sleeveRamp: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5], skinMap: skinDown(1),
    drawPhone: (bb) => { fill(bb, r.x, r.y, r.w, r.h, PAL.P2); fill(bb, r.x, r.y, r.w, 2, PAL.W9); fill(bb, r.x + r.w - 2, r.y, 2, r.h, PAL.P0); bpt(bb, '0', r.x + Math.round((r.w - bpw('0')) / 2), r.y + Math.round(r.h / 2) - 7, PAL.R2); }});
};
export const signLow = (b: Buf, f: number, st: {zero: 'out' | 'down' | 'gone'; second: 0 | 1 | 2 | 3; hand: boolean}) => {
  const foot = signFlat(b);
  if (st.zero === 'out') dotHandZero(b, 414, 176 + (Math.floor(f / 10) % 2));
  if (st.zero === 'down') dotHandZero(b, 424, 214);
  if (st.second > 0) {
    // the second, smaller sign: DAYS SINCE SOMEONE SUED MAS: 0, coming up into place under the first
    const y0 = [0, 200, 170, foot + 10][st.second];
    const S2 = signBoard2x(['DAYS SINCE', 'SOMEONE', 'SUED MAS:'], '0');
    keystone(b, S2, 240, y0, 0.93, st.second === 3 ? 10 : 0);
    if (st.hand) {
      holdPhone(b, {x: 240 + (S2.w >> 1) - 10, y: y0 + 22, w: 14, h: 18}, {side: 'R', grip: 'cup', light: 'lobby', widthCm: 8, thumbAt: -0.4, sleeveTo: [370, 236],
        cuffRamp: [PAL.W2, PAL.W3, PAL.W3, PAL.W4, PAL.W5, PAL.W5, PAL.W6], sleeveRamp: [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N5], skinMap: skinDown(1),
        drawPhone: () => {}});
    }
  }
};
/** [MCU] Mas in the lobby (Ep1's approved CU and its lobby backdrop: the lit sign behind him); dx moves the drawing a
 *  whole pixel (the head shake) */
export const masCU = (b: Buf, f: number, dx: number) => {
  drawCUBackdrop(b, 'lobby', f);
  blitImg(b, masCUImg('cyan'), dx, 0, {clip: (_x, y) => y < RH});
};

// ================================================================== 1.13: the flyer's doorway, the Orb's iris
/** where the doorway's light lands (native), matched to the intro's first frame (its lit block, x 82..116, y 37..120) */
export const DOOR_LIGHT = {x: 82, y: 37, w: 34, h: 84};
const flyerPage = (b: Buf) => {
  // the complaint's page round the flyer (its rule, ET AL., the red YOU PROMISED and its !!), as sets/lobby2-art's ECU
  fill(b, 0, 0, W, RH, PAL.P1);
  for (let y = 0; y < RH; y++) for (let x = 0; x < W; x++) if (((x * 7 + y * 13) % 97) === 0) b.set(x, y, PAL.P0);
  bpt(b, 'ET AL.', 236, 14, PAL.N1); fill(b, 232, 34, 220, 2, PAL.N1);
  bpt(b, 'YOU', 236, 112, PAL.R2); bpt(b, 'PROMISED', 236, 134, PAL.R2); bpt(b, '!!!', 236, 156, PAL.R2);
};
/** the flyer at ECU scale: the headline, the doorway photo (nobody in it: a dark frame, the door half open on light),
 *  tape at its corners, its lower corner curling; its door light at DOOR_LIGHT */
const flyerBig = (b: Buf) => {
  const D = DOOR_LIGHT;
  const fx0 = D.x - 52, fy0 = -6, fw = 150, fh = 206;
  for (let j = 0; j < fh; j++) for (let i = 0; i < fw; i++) { const X = fx0 + i + 4, Y = fy0 + j + 4; if (Y >= 0 && Y < RH && X >= 0) b.set(X, Y, stepColor(b.get(X, Y), -2)); }
  fill(b, fx0, fy0, fw, fh, PAL.P2); fill(b, fx0 + fw - 2, fy0, 2, fh, PAL.P1);
  // the photo: a dark corridor, the door frame, the half-open door's lit room beyond (nobody in it)
  const px = fx0 + 12, py = 26, pwd = fw - 24, ph = 112;
  fill(b, px, py, pwd, ph, PAL.G2); fill(b, px, py, pwd, 2, PAL.G1);
  fill(b, D.x - 8, D.y - 6, D.w + 16, D.h + 6, PAL.N1);
  fill(b, D.x, D.y, D.w, D.h, PAL.W5); fill(b, D.x + 12, D.y, D.w - 12, D.h, PAL.W6);
  for (let y = D.y + 4; y < D.y + D.h; y += 9) fill(b, D.x + 14, y, D.w - 16, 1, PAL.W7);
  fill(b, D.x - 8, D.y - 6, 8, D.h + 6, PAL.D2); fill(b, D.x - 2, D.y - 6, 2, D.h + 6, PAL.D3);
  // the door leaf itself, swung in, a dark slab at the opening's left
  poly([D.x, D.y, D.x + 10, D.y + 4, D.x + 10, D.y + D.h - 2, D.x, D.y + D.h], b.ink(PAL.D1));
  // the headline over it, the caption lines under it
  const h1 = 'WHERE IS', h2 = 'ALYI?';
  bpt(b, h1, fx0 + Math.round((fw - bpw(h1)) / 2), 152, PAL.N1); bpt(b, h2, fx0 + Math.round((fw - bpw(h2)) / 2), 172, PAL.N1);
  for (const [tx, ty] of [[fx0, fy0 + 6], [fx0 + fw - 16, fy0 + 6]]) for (let j = 0; j < 12; j++) for (let i = 0; i < 16; i++) b.set(tx + i, ty + j, (i + j) % 5 ? PAL.G6 : PAL.P1);
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
  flyerPage(b);
  flyerBig(b);
  if (st.orb) drawOrb(b, st.orb.x, st.orb.y, 30, {look: st.orb.look, aperture: 0.55});
  if (st.iris !== null) iris(b, st.iris, 0.18 + (300 - st.iris) / 900);
};
void poly; void dith; void bigText; void bigTextWidth; void pw;
