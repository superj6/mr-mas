// MR. MAS — mdinner1: THE WOODROSE opening + the GERG and ALYI cards, intro frames 225-359.
// Every time constant in this folder is a GLOBAL intro frame (the 96 BPM / 24 fps grid of
// src/shared/timing.ts: 15 frames per beat, 60 per bar). The composition runs LOCAL frames 0..134;
// `g = local + MD1.from`. Mount it in the full intro with <Sequence from={MD1.from} durationInFrames={MD1.frames}>.
import {clamp} from '../../shared/pixel/px';
import {ease} from '../../shared/pixel/sprite';

export const MD1 = {from: 225, to: 359, frames: 135} as const;
export const toGlobal = (local: number) => local + MD1.from;
export const toLocal = (global: number) => global - MD1.from;

/** The beats inside the span (hits land on these). 5.1 = bar 5 beat 1 = f240. */
export const BEAT = {
  b44: 225, // pickup: the match cut onto the candle flame (camera locked 225-229), hard cut to GERG at 230
  b51: 240, // HIT (Fm): GERG FREEZE — the world prints for ONE beat; Mas plucks the hanging CTRL key
  b52: 255, // the world is live again (the card holds over it until 285); Mas pockets the key as it resumes
  b53: 270,
  b54: 285, // truck + tilt: the wall lights into the server cathedral, ALYI rises
  b61: 300, // HIT (Db): ALYI FREEZE — the world stays stopped until Mas's marshmallow gag is done (300-339)
  b62: 315, // still frozen; on the card, Alyi's eyes open as token streams
  b63: 330, // the marshmallow toasts on the FROZEN effigy fire anyway (328-339)
  b64: 345, // hard cut to the vault: the door, MARIO steps out
} as const;

/** the WORLD is printed on each hit ([t0, t1)) and stays stopped until Mas finishes his move; the CARD holds on over
 *  the live room until `card`. GERG: one beat (the CTRL gag is inside it). ALYI: through the marshmallow gag (the
 *  frozen fire toasts it anyway) — art director's review, freeze rule "the world stays stopped until Mas finishes". */
export const FREEZE_G = {t0: 240, t1: 255, card: 285} as const;
export const FREEZE_A = {t0: 300, t1: 340, card: 340} as const;
export const inFreeze = (g: number) => (g >= FREEZE_G.t0 && g < FREEZE_G.t1) || (g >= FREEZE_A.t0 && g < FREEZE_A.t1);
export const freezeKind = (g: number): 'gerg' | 'alyi' | null =>
  g >= FREEZE_G.t0 && g < FREEZE_G.t1 ? 'gerg' : g >= FREEZE_A.t0 && g < FREEZE_A.t1 ? 'alyi' : null;

/**
 * WORLD CLOCK: the frame the frozen world shows. It stops during a freeze and resumes where it stopped,
 * so keycaps, typing, flames and candles continue without a jump. Mas never uses it (he never freezes).
 */
export const worldClock = (g: number) => {
  if (g < FREEZE_G.t0) return g;
  if (g < FREEZE_G.t1) return FREEZE_G.t0;
  if (g < FREEZE_A.t0) return g - (FREEZE_G.t1 - FREEZE_G.t0);
  if (g < FREEZE_A.t1) return FREEZE_A.t0 - (FREEZE_G.t1 - FREEZE_G.t0);
  return g - (FREEZE_G.t1 - FREEZE_G.t0) - (FREEZE_A.t1 - FREEZE_A.t0);
};

// ------------------------------------------------------------------ camera (world px, whole pixels only)
export const CAM = {
  gergX: 196, // the GERG framing (the truck arrives here at the freeze)
  alyiX: 330, // the ALYI framing
  marioX: 606, // the vault framing
  yLow: 30, // table-height framing
  yHigh: 14, // after the tilt up to the rose window
  /** the GERG card framing: on the hit the frame re-frames 18 px up the wall (the print drops into its frame), so the
   *  card sits over the wall and the table sits lower — no dead band of under-table at the bottom */
  yCard: 12,
} as const;

/** 225-229: the camera is LOCKED on the candelabra (the crown glint -> flame match cut reads); hard cut at 230. */
export const MATCH_HOLD = {from: 225, to: 229} as const;

export interface Camera { x: number; y: number; /** px moved since the previous frame (for the whip smear) */ dx: number; }

const camRaw = (g: number): [number, number] => {
  if (g < 225) return [0, CAM.yLow];
  if (g <= MATCH_HOLD.to) return [0, CAM.yLow]; // the flame holds its screen position: no whip after the match cut
  if (g < 240) return [Math.round(180 + (CAM.gergX - 180) * ((g - 229) / 11)), CAM.yLow]; // slow truck, 1-2 px/f
  if (g < 285) return [CAM.gergX, g < FREEZE_G.t0 + 2 ? CAM.yLow : CAM.yCard];
  if (g < 300) {
    // truck right, then tilt up to the rose window
    const t = clamp((g - 285) / 13, 0, 1);
    const x = Math.round(CAM.gergX + (CAM.alyiX - CAM.gergX) * ease.inOut(t));
    const ty = clamp((g - 290) / 9, 0, 1);
    return [x, Math.round(CAM.yCard + (CAM.yHigh - CAM.yCard) * ease.inOut(ty))];
  }
  // the ALYI framing holds through his card close (340-341); 345 is a HARD CUT to the vault framing (no candle wipe)
  if (g < 345) return [CAM.alyiX, CAM.yHigh];
  return [CAM.marioX, CAM.yHigh];
};

/** Impact kick on a freeze hit: the frame drops 2 px and settles (never a scale punch-in). */
const KICK: Array<[number, number]> = [[0, 2], [0, -1], [0, 0]];
export const camera = (g: number): Camera => {
  const [x, y] = camRaw(g);
  const [px] = camRaw(g - 1);
  let ky = 0;
  for (const t0 of [FREEZE_G.t0, FREEZE_A.t0]) if (g >= t0 && g < t0 + KICK.length) ky = KICK[g - t0][1];
  return {x, y: y + ky, dx: x - px};
};

/** Card anchoring: a card's screen x follows the world once the camera leaves its framing. */
export const anchoredX = (screenX: number, framingCamX: number, camX: number) => screenX + (framingCamX - camX);
