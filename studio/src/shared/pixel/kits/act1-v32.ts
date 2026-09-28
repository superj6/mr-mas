// MR. MAS — kit: Act One's small v3.2 compositions (script draft 8.1). New file (v3-art-a, v3.2 round, 2026-09-28).
//   drawMillionPost(b, f, st)   [INSERT] 6.06: far down, the odometer wedged in bedrock, its last wheel settled on
//                               1,000,000 (rooms/drill.ts drawWedgedWheel); his post pops over it in its own UI
//                               (kits/post-card.ts, his avatar and name): MAS_MILLION, card time DEC 4 · 11:35 PM. The
//                               card opens in post-card's held steps (st.k) and sits clear of the wheels' digits
//   MAS_MILLION                 the post (the record's words, the name swap only: [P · facts W1])
import {Buf} from '../px';
import {drawWedgedWheel} from '../rooms/drill';
import {drawPost, postBox, PostSpec} from './post-card';

export const MAS_MILLION: PostSpec = {who: 'mas', text: 'CHATGTP launched on wednesday. today it crossed 1 million users!', ts: 'DEC 4 · 11:35 PM'};
export interface MillionPostState { k?: number | null; settle?: number; heat?: number; w?: number }
export const MILLION_POST_AT: [number, number] = [12, 8];
export const drawMillionPost = (b: Buf, f: number, st: MillionPostState = {}) => {
  drawWedgedWheel(b, f, {settle: st.settle ?? 3, heat: st.heat});
  if (st.k === null || st.k === undefined) return;
  const w = st.w ?? 224;
  drawPost(b, MILLION_POST_AT[0], MILLION_POST_AT[1], MAS_MILLION, {size: 'popup', w, k: st.k});
  void postBox;
};
