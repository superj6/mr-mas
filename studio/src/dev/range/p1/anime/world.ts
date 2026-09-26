// MR. MAS - style-range Prototype 1: the anime push's WORLD and CAMERA.
// A multiplane stand, built honestly: every held drawing is a flat cel standing at its own depth, facing the lens, and
// the lens only dollies, cranes and trucks (no pan, no tilt), so the parallax between the planes is exact. The table
// top is one painted plate mapped in true perspective under the cels. Units: centimetres; X right, Y down, Z away.
//
// The players sit round the far arc of the oval (not in a row): the ends of the arc come toward the lens, so each seat
// is at its own depth and the push opens them up against each other. Each has a chair behind them.
import {Easing, interpolate} from 'remotion';
import {T} from '../geo';

export interface Cam { x: number; y: number; z: number; f: number; px: number; py: number; }
export interface Proj { x: number; y: number; s: number; d: number; }
export const project = (c: Cam, X: number, Y: number, Z: number): Proj => {
  const d = Z - c.z;
  return {x: c.px + (c.f * (X - c.x)) / d, y: c.py + (c.f * (Y - c.y)) / d, s: c.f / d, d};
};

/** the table: an oval felt top at Y = TOP, centred (XC, ZC), semi-axes A (along X) and B (along Z); the rail ring R wide */
export const TABLE = {XC: 10, ZC: 184, A: 112, B: 58, R: 9, TOP: 50, CUSHION: 5};
export const railFarZ = (X: number) => {
  const {XC, ZC, A, B, R} = TABLE;
  const u = Math.max(-1, Math.min(1, (X - XC) / (A + R)));
  return ZC + (B + R) * Math.sqrt(1 - u * u);
};
export const railNearZ = (X: number) => 2 * TABLE.ZC - railFarZ(X);

export type SeatName = 'nole' | 'kram' | 'mario' | 'nesnej';
export interface SeatSpec {
  x: number; z: number;
  /** head centre height (Y down; the table top is 50): a seated build */
  headY: number;
  /** head tilt in degrees (+ = toward screen-right in the drawing's own facing) */
  tilt: number;
  /** drawing scale (a per-player build) */
  scale: number;
  /** breathing phase and period (frames) */
  breath: [number, number];
  /** blink frames (each: closed on f, f+1; half on f-1, f+2) */
  blinks: number[];
}
/** seated just behind the far rail, round the arc */
const seatZ = (x: number, back = 15) => railFarZ(x) + back;
/** where everyone is (world cm). Heads: seated players' head centres; the Intern's monitor centre. */
export const WORLD = {
  mas: {head: [-64, -8, 98] as V3, hand: [-38, 44, 126] as V3, glass: [-30, TABLE.TOP, 146] as V3},
  seats: {
    // Nole straight across from Mas; Kram leaning in on the rail (lower, nearer); Mario sat up at the far side's crown;
    // Nesnej sat back in his chair (farther, taller); the Intern standing at the right end. Uneven gaps, no two alike.
    nole: {x: -66, z: seatZ(-66, 16), headY: -9, tilt: 0, scale: 1.04, breath: [0, 92], blinks: [171, 268, 331]},
    kram: {x: -24, z: seatZ(-24, 6), headY: 3, tilt: 0, scale: 0.92, breath: [31, 84], blinks: [203, 297]},
    mario: {x: 24, z: seatZ(24, 18), headY: -7, tilt: 0, scale: 1.0, breath: [57, 100], blinks: [161, 244, 318]},
    nesnej: {x: 78, z: seatZ(78, 27), headY: -10, tilt: 0, scale: 1.06, breath: [12, 96], blinks: [236, 288, 349]},
  } as Record<SeatName, SeatSpec>,
  intern: {x: 113, z: seatZ(113, 12), headY: -33},
  lamp: [8, -78, 184] as V3,
  pot: [8, TABLE.TOP, 184] as V3,
  wallZ: 820,
};
export type V3 = [number, number, number];

// ------------------------------------------------------------------ the camera move (p150 -> rest -> into the screen)
export const LENS = {f: 1400, px: 960, py: 330};
/** behind his right shoulder, a little above his eye line */
const C0 = {x: -18, y: -17, z: 0};
/** at rest on the dealer: the caret face right of centre, Nesnej's bar at left, open dark over the monitor */
const C1 = {x: 90, y: -38, z: 128};
/** into the screen: the black glass fills the frame, the caret at its centre */
const C2 = {x: 113, y: -34, z: WORLD.intern.z - 30};
/**
 * One continuous move with mass: it leaves slowly (a heavy dolly getting going), gathers through the four tells,
 * carries through the middle, and lands long and soft on the dealer. The truck leads; the dolly-in follows; the crane
 * rises last.
 */
export const moveAt = (p: number) => MOVE[Math.max(0, Math.min(MOVE.length - 1, Math.round((p - T.ots) * 4)))];
/**
 * The move's progress as an integrated speed profile (sampled on quarter frames): it gathers slowly through the four
 * tells (p150-230), carries at speed through the middle (to ~p286), and brakes into the dealer (to p318). Built this
 * way so the lens is still visibly travelling until it lands; an ease curve would spend its last third barely moving.
 */
const MOVE = (() => {
  const n = (T.rest - T.ots) * 4;
  const a = 0.47, b = 0.8;
  const v = (x: number) => (x < a ? Math.pow(x / a, 2.2) : x < b ? 1 : Math.pow(1 - (x - b) / (1 - b), 1.6));
  const acc = [0];
  for (let i = 1; i <= n; i++) acc.push(acc[i - 1] + v((i - 0.5) / n));
  return acc.map((s) => s / acc[n]);
})();
/** the second move: after the hold, the lens is drawn into its screen (slow to start, then it doesn't stop) */
export const intoAt = (p: number) => {
  const x = Math.max(0, Math.min(1, (p - T.into) / (T.j4 - 1 - T.into)));
  return Math.pow(x, 2.2);
};
export const camAt = (p: number): Cam => {
  const tau = moveAt(p);
  const tx = Math.pow(tau, 1.2), tz = Math.pow(tau, 0.95), ty = Math.pow(tau, 1.6);
  const a = {x: C0.x + (C1.x - C0.x) * tx, y: C0.y + (C1.y - C0.y) * ty, z: C0.z + (C1.z - C0.z) * tz};
  const u = intoAt(p);
  if (u <= 0) return {...a, ...LENS};
  // into the screen: the lens shift walks the caret to the frame centre as we arrive
  const py = LENS.py + (540 - LENS.py) * Math.pow(u, 0.8);
  return {x: a.x + (C2.x - a.x) * u, y: a.y + (C2.y - a.y) * u, z: a.z + (C2.z - a.z) * u, f: LENS.f, px: LENS.px, py};
};

/** focus distance (the depth that is sharp): it starts on the players and lands on the dealer */
export const focusAt = (p: number, c: Cam) => {
  const onPlayers = 262 - c.z;
  const onIntern = WORLD.intern.z - c.z;
  const k = interpolate(p, [T.ots + 70, T.rest - 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
  return onPlayers + (onIntern - onPlayers) * k;
};
/** circle of confusion (screen px) for a plane at depth d when focus is at fd */
export const blurFor = (d: number, fd: number, amount = 520) => Math.min(4.2, Math.abs(1 / fd - 1 / d) * amount);
