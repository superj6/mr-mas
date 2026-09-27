// MR. MAS — Ep1 Act Four v5 · J1 "CANCELLED", ported (STYLE-J1; prep-artbuild-r3). The jump's timing RELATIVE TO THE
// CANCEL CLICK: t = frames since the click's pressed drawing (t 0). The prototype (src/dev/jumps/proto1/timeline.ts)
// counted clip frames p with the click at p 60 on lock v2; every beat here is that beat minus 60, unchanged:
//
//   t  0        THE CLICK: Cancel's pressed drawing (the host draws it: the v5 S1.09 layout). D6: every sound stops
//   t  1-  2    IN: the flash-print (the room area one flat P1 paper tone, 78% white; the rail band never flashes)
//   t  3- 44    THE JUMP: the certificate, engraved, one ink (42 f; with the pop, 45 f = 3 beats at 90 bpm)
//   t 15          beat 2: CANCELLED is punched through (silent); the grid the jump left shows through every cut
//   t 30          beat 3: his engraved pupils step one line toward the holes (his one live motion)
//   t 45- 59    OUT: the snap to the grid on beat 4. His tile, greyed, carries the scar row (t 45-47); it falls through
//                 its own slot, masked to it, in four held drawings (t 48-55); the four close ranks in two held steps
//                 (t 54-57) and settle. No GLYPH dissolve: J1 REPLACES it (style-jumps: "never both")
//   t 60        J1 is done: the host resumes its own S1.09 frames (the four in the G4 grid, the call's notice)
//
// v5 fit: v5's D6 runs about 3.7 s (~89 f) from the click to the phone's buzz (S1.11), so J1's 60 f sit inside it with
// ~29 f of the host's own post-drop grid after. On lock v4 the click is S1.09 k 45 (act frame 735) and S1.10 starts 59 f
// later (act frame 794): J1's last frame would overlap S1.10 by one frame there (the preview composition shows it).
export const J1_LEN = 60;
export const J1_T = {
  click: 0,
  pop: 1,
  cert: 3,
  perf: 15,
  pupils: 30,
  snap: 45,
  end: 60,
} as const;
/** the scar tile's fall through its own slot: [t, dy] held drawings on 2s (dy 999 = gone) */
export const J1_FALL: Array<[number, number]> = [[48, 4], [50, 14], [52, 34], [54, 60], [56, 999]];
/** the four close ranks (G5 -> G4) in two held steps from t0 over `frames` */
export const J1_CLOSE = {t0: 54, frames: 4};

export type J1Phase = 'before' | 'click' | 'pop' | 'cert' | 'snap' | 'done';
export const j1PhaseOf = (t: number): J1Phase =>
  t < 0 ? 'before' : t < J1_T.pop ? 'click' : t < J1_T.cert ? 'pop' : t < J1_T.snap ? 'cert' : t < J1_T.end ? 'snap' : 'done';
/** true while J1 owns the picture (a host shows J1Cancelled instead of its own frame for t in [0, 60)) */
export const j1Active = (t: number) => t >= 0 && t < J1_LEN;
