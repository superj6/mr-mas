// MR. MAS — style-jump prototype 1 · J1 "CANCELLED" (Ep1 sc 26, shots 26.04c–26.05, then 1 s of 26.05a).
// Brief: show/bible/style-jumps.md §5.1. The clip frame `p` maps 1:1 onto Act Four's timing lock v2 (act frame
// 1620 + p), so every pixel frame is the locked frame and the jump sits exactly inside D6.
//
//   p   0– 59  26.04c  pixel, as locked: the unlit arrow settles on Cancel (score + room under it)
//   p  60      26.05   Cancel's pressed drawing, one frame. THE CLICK. D6: every sound stops
//   p  61– 62          IN: the flash-print (a 2-frame press flash, flat P1 paper at 78% white; the rail never pops)
//   p  63–104          THE JUMP: the certificate, engraved, one ink (45 f with the pop = 3 beats, 1680–1724)
//   p  75                beat 2: CANCELLED is punched through in one frame (silent)
//   p  90                beat 3: his engraved pupils step one line toward the holes (his one live motion)
//   p 105–119          OUT: snap to the grid on beat 4. His tile, greyed, carries the scar row (p105–107); it falls
//                        through its own slot, masked to it, in four held drawings (p108–115; pixel.ts FALL), no
//                        GLYPH dissolve; the slot empty, the four close ranks in two held steps (p116, p118)
//   p 120–143  26.05a  the [CU], as locked (1 s of the deadpan, still inside D6)
export const FPS = 24;
export const ACT0 = 1620; // act frame at p = 0
export const CLIP = 144; // 6.0 s
export const P = {
  click: 60,
  pop: 61,
  cert: 63,
  perf: 75,
  pupils: 90,
  snap: 105,
  /** (retired: the close now starts on pixel.ts CLOSE.t0) */
  slide: 111,
  cu: 120,
} as const;
export const actOf = (p: number) => ACT0 + p;

export type Phase = 'pixel' | 'click' | 'pop' | 'cert' | 'snap' | 'cu';
export const phaseOf = (p: number): Phase =>
  p < P.click ? 'pixel' : p < P.pop ? 'click' : p < P.cert ? 'pop' : p < P.snap ? 'cert' : p < P.cu ? 'snap' : 'cu';
