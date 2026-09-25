// MR. MAS — mdinner2: the MARIO and NOLE name cards (UI layer: never frozen, never remapped).
// Both use the engine's ONE founder-card geometry (src/shared/pixel/freeze.ts: portrait window top-left, the
// plate to its right, at most one fine-print line), the same as GERG and ALYI. Only the entrances differ:
//   MARIO  rises from the bottom in 3 held steps; his one fine-print line is a live counter, WORD COUNT, racing
//          to 15,000+ while the world is stopped (the essay itself then unrolls down the table in the world).
//   NOLE   slams down from the top with a 1 px overshoot; at f435 the SUED OVER IT. rubber stamp lands on the
//          plate's shoulder (7px caps, double border, worn ink). No fine print: the check carries the money.
// A card persists over the running room after its freeze, and leaves with the camera (a near plane).
import {Buf} from '../../shared/pixel';
import {founderCard, CARD} from '../../shared/pixel/freeze';
import {drawMarioPortrait, MarioPortrait} from '../../shared/pixel/cast/mario';
import {drawNolePortrait, NolePortrait} from '../../shared/pixel/cast/nole';

/** the standard card position (GERG's): portrait window top-left */
export const CARD_AT = {x: 12, y: 14} as const;
export const PW = CARD.portraitW, PH = CARD.portraitH;

// ------------------------------------------------------------------ MARIO
const M_RISE = [150, 52, 6]; // held drawings for k = 0..2 (up from below the frame), then settled
const M_CLOSE = [52, 150]; // the 2-step close (403-404): back down the way it came
/** k = frames since 360; ox = a screen offset (0: it holds over the 390 cut); close = 1, 2: the closing drawings */
export const drawMarioCard = (b: Buf, k: number, ox: number, portrait: MarioPortrait, words: number, close = 0) => {
  if (k < 0) return;
  const dy = close ? M_CLOSE[Math.min(M_CLOSE.length, close) - 1] : k < M_RISE.length ? M_RISE[k] : 0;
  const num = words.toLocaleString('en-US') + (words >= 15000 ? '+' : '');
  // the window rides up already open (the rise IS the entrance); the plate cuts in on k3 like every card
  return founderCard(b, {
    who: 'mario', x: CARD_AT.x + ox, y: CARD_AT.y + dy, k, open: true,
    portrait: (bb, x, y) => drawMarioPortrait(bb, x, y, portrait),
    fine: `WORD COUNT: ${num}`, kFine: 6,
  });
};

// ------------------------------------------------------------------ NOLE
const N_SLAM = [-150, -34, 3, -1]; // held drawings for k = 0..3: down from above, 3 px past, 1 px back, settled
/** k = frames since 420; collapse >= 1: gone (at Mas's touch it becomes the place card on the cloth) */
export const drawNoleCard = (b: Buf, k: number, portrait: NolePortrait, collapse = 0) => {
  if (k < 0 || collapse >= 1) return;
  const dy = k < N_SLAM.length ? N_SLAM[k] : 0;
  return founderCard(b, {
    who: 'nole', x: CARD_AT.x, y: CARD_AT.y + dy, k, open: true,
    portrait: (bb, x, y) => drawNolePortrait(bb, x, y, portrait),
    fine: '', kStamp: 15,
  });
};
