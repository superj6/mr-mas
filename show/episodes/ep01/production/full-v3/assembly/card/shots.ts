// MR. MAS — Ep1 v3: THE FILENAME CARD (2 s), a one-beat segment on the pixel pipeline (the v3-assemble pass, 2026-09-27).
// The filename alone on black (SHOWRUNNER-NOTES 3: no disclaimer), Mr. Robot's filename-card grammar: a cursor, the name
// typed on quickly in the show's display face (the 14 px bigText the plates use), in the rails' paper ink one step up,
// then the cursor blinking after it until the cut to Act One. The whole 480 x 270 frame (no band rule).
// The lock is ./data.ts (tools/lock.py on ./timeline.json, --out-ts here). Built with tools/build.mjs --entry ./render.ts.
// Record: show/episodes/ep01/production/full-v3/assembly.md.
import {defineSegment, layouts, bpt, bpw} from '../../../../../../../studio/src/episodes/ep01/pixel/kit';
import {Buf, rect} from '../../../../../../../studio/src/shared/pixel/px';
import {PAL} from '../../../../../../../studio/src/shared/pixel/palette';
import {LOCK} from './data';

export const NAME = 'ep1.0_research_preview.md';
/** frames: the cursor alone (solid) for T0, then TYPE characters a frame, then the cursor blinks on BLINK frames */
const T0 = 4, TYPE = 2, BLINK = 8, CUR_W = 7, GAP = 2, TEXT_H = 14;
const INK = PAL.P2, SHADOW = PAL.N2;

export const cardState = (k: number) => {
  const typed = Math.max(0, Math.min(NAME.length, (k - T0 + 1) * TYPE));
  const doneAt = T0 + Math.ceil(NAME.length / TYPE) - 1;
  // solid while it types, then on/off on BLINK frames: on 17-24, off 25-32, on 33-40, off 41-47 (the cut lands on an off)
  const cursor = k <= doneAt || Math.floor((k - doneAt - 1) / BLINK) % 2 === 0;
  return {typed: k < T0 ? 0 : typed, cursor, doneAt};
};

export const drawCard = (fb: Buf, k: number) => {
  rect(0, 0, 480, 270, fb.ink(PAL.N0));
  const {typed, cursor} = cardState(k);
  const full = bpw(NAME) + GAP + CUR_W;
  const x0 = Math.round((480 - full) / 2), y0 = Math.round((270 - TEXT_H) / 2);
  const s = NAME.slice(0, typed);
  if (s) bpt(fb, s, x0, y0, INK, {shadow: SHADOW});
  if (cursor) {
    const cx = x0 + (s ? bpw(s) + GAP : 0);
    rect(cx + 1, y0 + 1, CUR_W, TEXT_H, fb.ink(SHADOW));
    rect(cx, y0, CUR_W, TEXT_H, fb.ink(INK));
  }
};

const L = layouts();
L.add('card.01', {
  st: 'the filename card: black, the cursor, ep1.0_research_preview.md typed on at 2 characters a frame (bigText, P2 on an N2 shadow), the cursor blinking on 8s after it; the whole frame (no band)',
  draw: (fb, k) => { drawCard(fb, k); return {full: true}; },
});

export const SEGMENT = defineSegment({seg: 'card', lock: LOCK, layouts: L.all});
