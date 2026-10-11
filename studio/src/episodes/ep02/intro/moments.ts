// MR. MAS — Ep2's intro: the moments as Ep2 cuts them. Ep1's moments for Ep2's slot (src/intro/scenes.ts scenesFor),
// with three Ep2-only changes made HERE, in Ep2's own code, so the shared moments (src/dev/, src/intro/) and Ep1's
// intro are untouched (the cleanup pass, 2026-10-11; LEARNINGS R1, P6, guardrail W8):
//   1. the cold open (f30-59, 72-98, 105): no free mouse pointer idles on the chart while both his hands are on the
//      keyboard (P6: "no stray cursor"). The pointer is hidden while he types, as a desktop hides it, and shows when
//      his hand takes the mouse (f106, EV.pointer[0]), then travels to Post on 2s and clicks (f112) as in Ep1.
//      Done on the finished frame: the medium shot shows the screen 1:1 at MED.screen, so the pointer's own pixels are
//      put back to the screen without it (only pixels that still show the screen's pointer are touched). The LCD
//      macros (f0-29) never reach the pointer's corner and the wide draws its own screen, without one.
//   2. the bookend (f705-719): the composer comes back (its f0 state) after he clicks Post with his hand on the mouse;
//      Ep1's pointer idled on the curve there too. Ep2's rests where his click left it, on Post (the same drawing).
//      The thumbnail's fly-up (705-707) and the dissolve's dither (712-719) are applied to the patched pixels exactly
//      as bookend.ts applies them to the screen.
//   3. the dinner (f300-341): Alyi's founder card's fine print is `EFFIGIES: 1` alone (Ep1's `PRODUCTS: 0 · EFFIGIES: 1`
//      could point at a products reading of why he left: nothing may hint at a reason, W8). The card is Ep1's lancet
//      and the engine's one card geometry (shared/pixel/freeze.ts founderCard, its `fine` override); the plate fits the
//      longest line, now his tagline. drawAlyiCard is copied from src/dev/mdinner1/cards.ts (unchanged but the fine
//      print), and mdinner1's UI layer (`after`) from src/dev/mdinner1/scene.ts, so only this card differs.
// The typed quote is Ep1's, unchanged ("near the singularity; unclear which side.": slot.ts).
import {Buf, bayer} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import type {DrawResult} from '../../../shared/pixel/compose';
import {founderCard, FOUNDERS, CARD} from '../../../shared/pixel/freeze';
import {drawAlyiPortrait} from '../../../shared/pixel/cast/alyi';
import {eraStamp} from '../../../shared/pixel/cast/era';
import {scenesFor} from '../../../intro/scenes';
import type {Scene} from '../../../intro/scenes';
import type {MomentId} from '../../../intro/edl';
import {qcScene} from '../../../intro/qc';
import type {IntroSlot} from '../../../intro/slot';
import {makeColdOpen} from '../../../dev/mcoldopen/scene';
import {shotAt, EV} from '../../../dev/mcoldopen/timeline';
import type {ColdSlot} from '../../../dev/mcoldopen/timeline';
import {screenAt, screenState, drawScreen, SW, SH, POST_BTN} from '../../../dev/mcoldopen/screen';
import {MED} from '../../../dev/mcoldopen/medium';
import {makeScene as makeMd1Scene} from '../../../dev/mdinner1/scene';
import {toGlobal as md1Global, FREEZE_G, FREEZE_A} from '../../../dev/mdinner1/timeline';
import {drawGergCard, GERG_CARD, ALYI_CARD} from '../../../dev/mdinner1/cards';
import {localScene} from '../../../dev/mfinale/scene';
import {MF_START, T as MF_T} from '../../../dev/mfinale/timeline';

const [SX, SY] = MED.screen;

/** the composer at frame f with the pointer drawn at `at` (off the screen = no pointer) */
const screenWith = (f: number, co: ColdSlot, at: [number, number]) => drawScreen(new Buf(SW, SH, PAL.N1), {...screenState(f, co), pointer: at, pressed: false});

/** put back, on the finished frame, the screen pixels where `was` (as drawn) and `now` (as wanted) differ: only where
 *  the frame still shows `was` through `look` (a later pass's colour map at that pixel), from screen row `fromRow` */
const patchScreen = (fb: Buf, was: Buf, now: Buf, fromRow = 0, look: (c: number, x: number, y: number) => number = (c) => c) => {
  for (let j = Math.max(0, fromRow); j < SH; j++) for (let i = 0; i < SW; i++) {
    const a = was.c[j * SW + i], b = now.c[j * SW + i];
    if (a === b) continue;
    const X = SX + i, Y = SY + j;
    if (fb.get(X, Y) === look(a, X, Y)) fb.set(X, Y, look(b, X, Y));
  }
};

// ------------------------------------------------------------------ 1. the cold open: no idle pointer while he types
const OFF: [number, number] = [-99, -99];
const coldOpenEp2 = (co: ColdSlot): Scene => {
  const sc = makeColdOpen(co);
  return {
    ...sc,
    draw: (fb, f) => {
      const r = sc.draw!(fb, f);
      if (f < EV.pointer[0] && shotAt(f).id === 'medium') patchScreen(fb, screenAt(f, co), screenWith(f, co, OFF));
      return r;
    },
  };
};

// ------------------------------------------------------------------ 2. the bookend: the pointer rests on Post
const POSTED = MF_T.last; // 705 (bookend.ts POSTED)
const FADE0 = 712; // bookend.ts FADE0
const IMG_H = 101; // bookend.ts: the picture's rows on the screen (the post bar under it fills the rest)
const ON_POST: [number, number] = [POST_BTN.x + 13, POST_BTN.y + 5]; // the click's own spot (screen.ts, f >= EV.pointer[1])
const finaleEp2 = (slot: IntroSlot): Scene => {
  const sc = localScene(MF_START, {cold: slot.cold, subtitle: slot.subtitle});
  return {
    ...sc,
    draw: (fb, f): void | DrawResult => {
      const r = sc.draw!(fb, f);
      const g = f + MF_START;
      if (g < POSTED) return r;
      const s = ((g % 15) + 15) % 15; // bookend.ts drawScreenContent: the composer's f0-14 state
      // the picture flying up into the feed covers the screen's top rows (705: rows 0-77, 706: 0-39; gone from 707):
      // the picture's rows down to IMG_H + off, and the post bar under it to SH + off while the bar is on the screen
      const off = g < POSTED + 3 ? [-34, -72, -112][g - POSTED] : null;
      const covered = off === null ? 0 : IMG_H + off >= 0 ? SH + off : 0;
      // the dissolve to black (bookend.ts, the last frames): N0 on the ordered dither, the rest a rung down after 30 %
      const t = (g - FADE0 + 1) / (MF_T.last + 15 - FADE0);
      const look = g >= FADE0 ? (c: number, x: number, y: number) => (bayer(x, y) < t * 1.05 ? PAL.N0 : t > 0.3 ? stepColor(c, -1) : c) : undefined;
      patchScreen(fb, screenAt(s, slot.cold), screenWith(s, slot.cold, ON_POST), covered, look);
      return r;
    },
  };
};

// ------------------------------------------------------------------ 3. the dinner: Alyi's card, EFFIGIES: 1 alone
/** Ep2's fine print on Alyi's card */
export const ALYI_FINE_EP2 = 'EFFIGIES: 1';
// the leaded lancet (src/dev/mdinner1/cards.ts, copied unchanged)
const PW = CARD.portraitW, PH = CARD.portraitH;
const LANCET = 52;
const inLancet = (i: number, j: number) => {
  if (j >= LANCET) return true;
  const r = PW * 0.8;
  const dy = LANCET - j;
  const cxL = PW - r, cxR = r;
  return (i + 0.5 - cxL) ** 2 + dy * dy <= r * r && (i + 0.5 - cxR) ** 2 + dy * dy <= r * r;
};
const DROP = [-110, -44, 3, 0];
const alyiCardY = (k: number, y0: number) => y0 + (k < DROP.length ? DROP[k] : 0);
const CLOSE = [-44, -110];
const drawAlyiCardEp2 = (b: Buf, k: number, x: number, y0: number, eyes: 'open' | 'closed' | 'tokens', t: number, close = 0) => {
  const y = close ? y0 + CLOSE[Math.min(CLOSE.length, close) - 1] : alyiCardY(k, y0);
  const accent = FOUNDERS.alyi.accent;
  const inside = (i: number, j: number) => i >= 0 && j >= 0 && i < PW && j < PH && inLancet(i, j);
  for (let j = -4; j < PH + 4; j++)
    for (let i = -4; i < PW + 4; i++) {
      if (inside(i, j)) continue;
      let dmin = 9;
      for (let d = 1; d <= 4 && dmin === 9; d++) if (inside(i + d, j) || inside(i - d, j) || inside(i, j + d) || inside(i, j - d) || inside(i + d, j + d) || inside(i - d, j - d) || inside(i + d, j - d) || inside(i - d, j + d)) dmin = d;
      if (dmin > 4) continue;
      b.set(x + i, y + j, dmin === 2 ? accent : dmin === 3 ? PAL.W3 : PAL.N0);
    }
  const tmp = new Buf(PW, PH, PAL.N0);
  drawAlyiPortrait(tmp, 0, 0, {eyes, mouth: 'rest', t});
  for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) if (inside(i, j)) b.set(x + i, y + j, tmp.c[j * PW + i]);
  for (const [sx, col] of [[4, PAL.C3], [PW - 12, PAL.R1]] as const)
    for (let j = 2; j < 14; j++) for (let i = 0; i < 8; i++) if (!inside(sx + i, j) && inside(sx + i, j + 10)) b.set(x + sx + i, y + j, col);
  // the standard plate beside it: Ep2's one fine-print line
  if (!close) founderCard(b, {who: 'alyi', x, y: y0, k, customWindow: true, fine: ALYI_FINE_EP2});
};
const dinnerEp2 = (slot: IntroSlot): Scene => {
  const sc = makeMd1Scene(slot.keycap.legend);
  return {
    ...sc,
    // src/dev/mdinner1/scene.ts makeScene's UI layer, copied: the era stamp, Gerg's card, then Alyi's (Ep2's fine print)
    after: (ui, f) => {
      const g = md1Global(f);
      if (g >= 230 && g < 248) eraStamp(ui, '2015', g - 230);
      if (g >= FREEZE_G.t0 && g < 300) {
        const k = g - FREEZE_G.t0;
        const EXIT = [0, -14, -44, -96, -170, -266];
        const x = GERG_CARD.x + (g < FREEZE_G.card ? 0 : EXIT[Math.min(EXIT.length - 1, g - FREEZE_G.card)] - 40 * Math.max(0, g - FREEZE_G.card - 5));
        if (x > -330) drawGergCard(ui, k, x, GERG_CARD.y, g);
      }
      if (g >= FREEZE_A.t0 && g < FREEZE_A.card + 2) {
        const k = g - FREEZE_A.t0;
        const eyes = g < 315 ? 'closed' : 'tokens';
        if (g < FREEZE_A.card) drawAlyiCardEp2(ui, k, ALYI_CARD.x, ALYI_CARD.y, eyes, g);
        else drawAlyiCardEp2(ui, k, ALYI_CARD.x, ALYI_CARD.y, eyes, g, g - FREEZE_A.card + 1);
      }
    },
  };
};

/** Ep2's moments: scenesFor(slot) with the three Ep2-only changes above (each wrapped in the same QC pass) */
export const scenesEp2 = (slot: IntroSlot): Record<MomentId, Scene> => ({
  ...scenesFor(slot),
  mcoldopen: qcScene(coldOpenEp2(slot.cold)),
  mdinner1: qcScene(dinnerEp2(slot)),
  mfinale: qcScene({...finaleEp2(slot), bg: PAL.N0}),
});
