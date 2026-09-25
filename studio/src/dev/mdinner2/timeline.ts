// MR. MAS — mdinner2: intro frames 345-479 (MARIO + NOLE cards, the OPEN -> NOPE founding).
// Every constant below is a GLOBAL intro frame (the composition's local frame 0 = global 345), so the
// numbers read straight against final.md §3 and the 96 BPM / 24 fps beat grid (15 frames per beat).
//
// Polish pass (art director): Mario's freeze is ONE beat of stopped world (360-374), then the room runs again under
// the card. Picture-fix pass (reviews, 2026-09-25): Nole's freeze holds until Mas has renamed the company (420-464:
// the sip 450-455 and the N move 456-464 happen while time is stopped, SCRIPT §3.5d); on 465 the room thaws and the
// sign relights in one step. No whip: a hard cut at 390 to the telescope framing, Mario's card holds over it and
// closes 403-404. The founding (465-479) and the neon relight play in the full-colour room.
import {FRAMES_PER_BEAT} from '../../shared/timing';
import {worldClock as md1WorldClock} from '../mdinner1/timeline';

export const MD2_FROM = 345;
export const MD2_TO = 479; // inclusive
export const MD2_DURATION = MD2_TO - MD2_FROM + 1; // 135

/** local composition frame -> global intro frame */
export const toGlobal = (local: number) => local + MD2_FROM;
/** global intro frame -> local composition frame */
export const toLocal = (global: number) => global - MD2_FROM;

// ------------------------------------------------------------------ the beat grid inside the span
// 345 = beat 24 (6.4) ... 465 = beat 32 (8.4). Hits land on these.
export const BEAT = FRAMES_PER_BEAT;
export const onBeat = (g: number) => g % BEAT === 0;

/** the two freezes, [t0, t1): the world clock stops inside them; Mas never does */
export const FREEZE_M = {t0: 360, t1: 375} as const;
export const FREEZE_N = {t0: 420, t1: 465} as const;

export const T = {
  // 6.4 · vault (345-359, mdinner1's staging, pixel-identical): the door already swinging, beacons, steam
  vault: 345,
  tick1: 348, tick2: 351, tick3: 354, // RED-TEAMED ✓✓✓: the triple chime (SCRIPT §3.5c)
  marioOut: 350,
  finger: 357,
  // 7.1 · MARIO FREEZE (hit on Bb minor, klaxon cut dead): the card rises from the bottom in 3 held steps
  marioCard: 360,
  wordCount: 366, // the fine print: WORD COUNT races to 15,000+ (366-374)
  // 7.2 · the world runs again under the card: Mario talks, his essay unrolls down the table toward Mas
  marioLive: 375,
  cut: 390, // 7.3: HARD CUT to the telescope framing (no whip); Mario's card holds over the cut (UI layer)
  grab: 390, // 7.3: Mas takes the tail (390), rolls it (391-394), telescope to the eye (395-404)
  telescope: 395,
  marioClose: 403, // Mario's card closes in 2 steps (403-404)
  // 7.4 · the booster (405-419): the ceiling bursts while he is looking at it
  burst: 405,
  signIn: 409,
  hatch: 415,
  touchdown: 420,
  // 8.1 · NOLE FREEZE (the biggest hit, C major)
  noleCard: 420,
  stamp: 435, // 8.2: SUED OVER IT.
  // 8.3 · still frozen: Mas's gag. (The LEDGER flash on the check is HELD in v2.1: length 0.)
  ledger: 450,
  ledgerLen: 0,
  sip: 450, // a calm sip under the sign (lift 450, sip 451-453, lower 454); the water line never moves
  stand: 455, // he stands (half-stand drawing), glass in his other hand
  nLift: 456, // while time is still stopped he unhooks the N (it takes his colour)...
  nClunk: 464, // ...it slides to the front of the word and clunks into place: NOPE AI (frozen, the N in colour)
  // 8.4 · the founding (465-479), full colour
  noleLive: 465, // the room thaws on the beat
  founding: 465, // the camera trucks to the sign and cranes up
  touch: 465, // Nole's card closes into the place cards
  aiOn: 465, // the sign relights in one step: NOPE AI (no flicker)
} as const;

/** Is g inside [a, b) */
export const within = (g: number, a: number, b: number) => g >= a && g < b;
export const frozenAt = (g: number) => within(g, FREEZE_M.t0, FREEZE_M.t1) || within(g, FREEZE_N.t0, FREEZE_N.t1);
/**
 * WORLD CLOCK (mdinner1's convention): the frame the world shows. Up to 359 it IS mdinner1's clock (read, not
 * copied, so the 345-359 overlap stays pixel-identical when mdinner1 retimes its freezes); this span then stops
 * it for 15 (Mario) and 30 (Nole) frames and resumes without a jump.
 */
const MD1_OFF = 359 - md1WorldClock(359);
export const worldClock = (g: number) => {
  const m = FREEZE_M.t1 - FREEZE_M.t0, n = FREEZE_N.t1 - FREEZE_N.t0;
  if (g < FREEZE_M.t0) return md1WorldClock(g);
  if (g < FREEZE_M.t1) return FREEZE_M.t0 - MD1_OFF;
  if (g < FREEZE_N.t0) return g - MD1_OFF - m;
  if (g < FREEZE_N.t1) return FREEZE_N.t0 - MD1_OFF - m;
  return g - MD1_OFF - m - n;
};
/** the booster / sign clock: live time up to touchdown, stopped through the Nole freeze, then running again */
export const boostClock = (g: number) => (g < FREEZE_N.t0 ? g : g < FREEZE_N.t1 ? FREEZE_N.t0 : g - (FREEZE_N.t1 - FREEZE_N.t0));
