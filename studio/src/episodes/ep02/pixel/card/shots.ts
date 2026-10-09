// MR. MAS — Ep2 v1: THE FILENAME CARD (2 s), `ep1.1_her.wav`, a one-beat segment on the Ep2 pixel pipeline. A copy of
// Ep1's card (show/episodes/ep01/production/full-v3/assembly/card/shots.ts, locked) with Ep2's name, drawn the same way:
// black, a solid block cursor alone for 4 frames, the name typed on in the show's display face (the plates' 14 px
// bigText) in paper P2 on an N2 shadow, centred, then the cursor blinking on 8s until the cut. No disclaimer, no band
// (LEARNINGS P16 item 3). Ep1 typed its 25 characters at 2 a frame; Ep2's 13 type at 1 a frame, so the name lands on the
// same frame (16) and the cursor keeps Ep1's rhythm: on 17-24, off 25-32, on 33-40, off 41-47 (the cut lands on an off).
// The lock is ./data.ts (tools/lock.py on ./timeline.json). Render: tools/build.mjs card, then `scenes` (one scene).
import {defineSegment, fromScenes, defineScene, layouts, bpt, bpw} from '../kit';
import {rect} from '../../../../shared/pixel/px';
import type {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {LOCK} from './data';

export const NAME = 'ep1.1_her.wav';
/** frames: the cursor alone (solid) for T0, then TYPE characters a frame, then the cursor blinks on BLINK frames */
const T0 = 4, TYPE = 1, BLINK = 8, CUR_W = 7, GAP = 2, TEXT_H = 14;
const INK = PAL.P2, SHADOW = PAL.N2;

export const cardState = (k: number) => {
  const typed = Math.max(0, Math.min(NAME.length, (k - T0 + 1) * TYPE));
  const doneAt = T0 + Math.ceil(NAME.length / TYPE) - 1;
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
  st: `the filename card: black, the cursor, ${NAME} typed on at 1 character a frame (bigText, P2 on an N2 shadow), the cursor blinking on 8s after it; the whole frame (no band)`,
  draw: (fb, k) => { drawCard(fb, k); return {full: true}; },
});

export const SEGMENT = defineSegment({seg: 'card', lock: LOCK, layouts: fromScenes(defineScene({scene: 'card', layouts: L.all}))});
