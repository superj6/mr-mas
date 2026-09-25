// MR. MAS — mdinner1: the GERG and ALYI name cards, on the engine's ONE founder-card geometry
// (src/shared/pixel/freeze.ts: portrait window top-left, the plate to its right, at most one fine-print line) — the
// same template as MARIO and NOLE in mdinner2. UI layer: never printed, never remapped.
//   GERG: the standard card; its one template break is a single blink out of his working squint.
//   ALYI: same layout; only the window's shape and entrance differ: a leaded LANCET that drops in from above (4 held
//         drawings, 2px overshoot) instead of opening, and on the second beat his eyes become token streams.
import {Buf} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import {founderCard, FOUNDERS, CARD} from '../../shared/pixel/freeze';
import {drawGergPortrait} from '../../shared/pixel/cast/gerg';
import {drawAlyiPortrait} from '../../shared/pixel/cast/alyi';

// ------------------------------------------------------------------ GERG
export const GERG_CARD = {x: 12, y: 14} as const;
/** `g` = global frame (drives the blink) */
export const drawGergCard = (b: Buf, k: number, x: number, y: number, g = 0) => {
  const lid = g >= 266 && g < 268 ? 2 : 1;
  founderCard(b, {who: 'gerg', x, y, k, portrait: (bb, px, py) => drawGergPortrait(bb, px, py, {mouth: 'rest', lid, look: 0})});
};

// ------------------------------------------------------------------ ALYI (the leaded lancet)
export const ALYI_CARD = {x: 12, y: 12} as const;
const PW = CARD.portraitW, PH = CARD.portraitH;
/** lancet: the top 52px is a pointed arch (two arcs meeting at the apex). */
const LANCET = 52;
const inLancet = (i: number, j: number) => {
  if (j >= LANCET) return true;
  const r = PW * 0.8; // arc radius: a proper gothic point
  const dy = LANCET - j;
  const cxL = PW - r, cxR = r;
  return (i + 0.5 - cxL) ** 2 + dy * dy <= r * r && (i + 0.5 - cxR) ** 2 + dy * dy <= r * r;
};
const DROP = [-110, -44, 3, 0]; // held drawings for k = 0..3 (then settled)
export const alyiCardY = (k: number, y0: number) => y0 + (k < DROP.length ? DROP[k] : 0);

/** close = 1, 2: the 2-step close (the lancet goes back up the way it came; the plate is gone on the first step) */
const CLOSE = [-44, -110];
export const drawAlyiCard = (b: Buf, k: number, x: number, y0: number, eyes: 'open' | 'closed' | 'tokens', t: number, close = 0) => {
  const y = close ? y0 + CLOSE[Math.min(CLOSE.length, close) - 1] : alyiCardY(k, y0);
  const accent = FOUNDERS.alyi.accent;
  const inside = (i: number, j: number) => i >= 0 && j >= 0 && i < PW && j < PH && inLancet(i, j);
  // the leaded frame follows the lancet: outer black, an ember came line, a dark inner line
  for (let j = -4; j < PH + 4; j++)
    for (let i = -4; i < PW + 4; i++) {
      if (inside(i, j)) continue;
      let dmin = 9;
      for (let d = 1; d <= 4 && dmin === 9; d++) if (inside(i + d, j) || inside(i - d, j) || inside(i, j + d) || inside(i, j - d) || inside(i + d, j + d) || inside(i - d, j - d) || inside(i + d, j - d) || inside(i - d, j + d)) dmin = d;
      if (dmin > 4) continue;
      b.set(x + i, y + j, dmin === 2 ? accent : dmin === 3 ? PAL.W3 : PAL.N0);
    }
  // the portrait, clipped to the lancet
  const tmp = new Buf(PW, PH, PAL.N0);
  drawAlyiPortrait(tmp, 0, 0, {eyes, mouth: 'rest', t});
  for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) if (inside(i, j)) b.set(x + i, y + j, tmp.c[j * PW + i]);
  // two jewel panes in the spandrel corners (the only "stained glass" colour, kept small)
  for (const [sx, col] of [[4, PAL.C3], [PW - 12, PAL.R1]] as const)
    for (let j = 2; j < 14; j++) for (let i = 0; i < 8; i++) if (!inside(sx + i, j) && inside(sx + i, j + 10)) b.set(x + sx + i, y + j, col);
  // the standard plate beside it, at the standard height (it does not drop with the window)
  if (!close) founderCard(b, {who: 'alyi', x, y: y0, k, customWindow: true});
};
