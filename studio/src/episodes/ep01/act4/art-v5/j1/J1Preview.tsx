// MR. MAS — Ep1 Act Four v5 · J1 ported: a PREVIEW host (not the v5 animatic). It drops <J1Cancelled> into THE EDITOR's
// v4 animatic at S1.09's Cancel click (lock v4: act frame 735 = S1.09 k 45), exactly as the v5 composer would at its own
// click: the host's frames before the click, J1 for t 0-59, the host's frames again from t 60. S1.09 is an R (reused)
// layout in art-needs-v5, so the v4 frames are the v5 picture here; only the timing around it will move with the v5 lock.
//   'ep01-act4-j1-v5-preview'   1920 x 1080, 24 fps, 120 f: 36 f before the click, J1's 60 f, 24 f after
//                               (the last J1 frame overlaps v4's S1.10 by 1 f: v4's click-to-cut is 59 f; v5's D6 is ~89 f)
// Stills: --frame=N. Entry: ./entry.tsx (registers only this composition; not auto-registered in src/Root.tsx).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {native4} from '../../animatic/frame4';
import {J1Cancelled, BufLayer} from './J1Cancelled';
import {J1_LEN, j1Active} from './timing';

export const V4_CLICK = 735; // shots-locked-v4.json S1.09: start 690 + marks.click 45
export const PREVIEW_PRE = 36, PREVIEW_POST = 24;
export const PREVIEW_LEN = PREVIEW_PRE + J1_LEN + PREVIEW_POST;
const PIXEL = {fClick: V4_CLICK};

export const J1Preview: React.FC<{hold?: number}> = ({hold}) => {
  const cur = useCurrentFrame();
  const p = hold ?? cur;
  const f = V4_CLICK - PREVIEW_PRE + p;
  const t = f - V4_CLICK;
  const frame = React.useMemo(() => native4(f).fb, [f]);
  const click = React.useMemo(() => native4(V4_CLICK).fb, []);
  if (j1Active(t)) return <J1Cancelled t={t} frame={frame} click={click} pixel={PIXEL} />;
  return <AbsoluteFill style={{background: '#04050a'}}><BufLayer buf={frame} tag={`host ${f}`} /></AbsoluteFill>;
};
