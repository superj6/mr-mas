// MR. MAS — Ep1 Act Four v5 · the Cancel-click comparison's timing (pure: Cancel5.tsx and tools/render5.ts share it).
// Each pass runs act frames CLIP_FROM..CLIP_TO: about 8 s either side of the click, each end snapped back to the cut at or
// before click ± 8 s, so a pass starts and ends on a cut. On the current lock: S1.07 (the call grid comes up, act 778,
// 9.1 s before the click at 997) to the end of S1.12 (act 1178, 7.5 s after; S2.01 is next). Brief: "about 8 s either
// side ... each after a 1 s slate".
import {SHOTS, D6} from './data-v5';

const CLICK = D6[0]; // = shots5.ts CANCEL_CLICK (kept off shots5 so this file stays pure data)
const EIGHT = 8 * 24;
const cutAtOrBefore = (f: number) => SHOTS.filter((s) => s.s <= f).reduce((a, s) => (s.s > a.s ? s : a)).s;
export const CLIP_FROM = cutAtOrBefore(CLICK - EIGHT), CLIP_TO = cutAtOrBefore(CLICK + EIGHT);
export const CLIP_LEN = CLIP_TO - CLIP_FROM;
/** the first and last shot of each pass (for the slate) */
export const CLIP_SHOTS = [SHOTS.find((s) => s.s <= CLIP_FROM && CLIP_FROM < s.e)!.id, SHOTS.find((s) => s.s < CLIP_TO && CLIP_TO <= s.e)!.id];
/** the slate before each pass (1 s, silent) */
export const SLATE = 24;
export const COMPARE_PARTS = [
  {at: 0, kind: 'slate' as const, which: 'A' as const},
  {at: SLATE, kind: 'clip' as const, which: 'A' as const},
  {at: SLATE + CLIP_LEN, kind: 'slate' as const, which: 'B' as const},
  {at: 2 * SLATE + CLIP_LEN, kind: 'clip' as const, which: 'B' as const},
];
export const COMPARE_LEN = 2 * (SLATE + CLIP_LEN);
export const partAt = (p: number) => [...COMPARE_PARTS].reverse().find((x) => p >= x.at)!;
