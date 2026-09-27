// MR. MAS · outro proposal B, "the Orb's verdict" (a VISUAL OUTLINE for comparison, lookdev; nothing here is decided).
// The clock, the words and the per-episode data. Spec: show/production/OUTRO-PROPOSALS.md §1.1 (the text package),
// §3 (B) and §9 (the builder brief).
//
// 96 BPM: 15 frames a beat, 60 a bar. Outro frames are written o0..o179 (3 bars, 7.5 s). Pass 4: the Ep1 stinger (the
// moth) plays INSIDE bar 3 while the Orb is still on screen (it used to follow the cut as a 3.75 s coda over the empty
// band, which a cold viewer read as a second, leftover ending). The mock-up file puts 1 s of a stand-in "last frame"
// before o0 and 0.75 s of black after o179 (the score's open fifth releasing).
//
// READ TIME drives this layout (pass 3). The first mock-up set all six §1.1 credit fields in the toast: about 270
// characters arriving in 1.6 s and gone 3.4-5 s later, which no one can read. B's toast now carries B's own condensed
// lines (§3), trimmed further so that a viewer who follows the toast can read all of it, in order, before it cuts:
//   * the scan target (the header) posts at o9, as the Orb's fade-up lands, before anything else asks to be read;
//   * the scan (o30-54) leaves the two credit lines behind it as plain, legible type (not only inside the cone), so
//     reading starts about o40, not o60; the chips then land on the knee's beats without moving the type;
//   * the verdict pops at o120 (the chime) and holds 2.5 s.
// tools/preview.ts `check` measures it (per line, and the whole toast read in order at 16 / 18 / 20 chars a second).

/** the mock-up file: 24 f stand-in + 180 f outro + 18 f of black (the fifth's release after the cut) = 222 f (9.25 s).
 *  Ep1's moth stinger now plays INSIDE the outro (bar 3, o138-o179): no extra time, the Orb still on screen. */
export const PRE = 24;
export const OUT = 180;
export const TAIL = 18;
export const TOTAL = PRE + OUT + TAIL;
/** file frame -> outro frame (negative during the stand-in) */
export const oOf = (f: number) => f - PRE;
export const BEAT = 15;
export const BAR = 60;

/** Outro beats (o-frames). The comments give the bar.beat each sits on. */
export const T = {
  band: 0, //          1.1  cut to black on the downbeat; the band (terms + pointer) is lit from here to the cut (o179)
  fade: [0, 3, 6, 9] as const, // 1.1 the Orb steps up from black: -3, -2, -1, lit (3 held palette steps, never a blend)
  header: 9, //        1.1+ the Orb is fully lit: its toast's header posts the scan target (`scan: <the episode's file>`)
  glint1: 12, //       1.1+ the catch-light glint (the title's glint), 2 frames
  iris: [15, 17, 19] as const, // 1.2 the iris swivels to the lens in 3 drawings (servo SFX on C6 at o15)
  cone: [30, 54] as const, //     1.3-1.4 the scan fan: opens, sweeps the toast's rows top to bottom, closes
  glyph: [31, 52] as const, //    GLYPH tokens in the cone's leading half; behind it the credits stay as type
  // 2.1, 2.2: the two credit chips land on the knee's flat line (F F | F F), straight (the machine owns the frame).
  lines: [60, 75] as const,
  // 2.3-2.4&: the leap (G Ab C F). The iris narrows one step per note: the Orb looking harder at the viewer.
  think: [90, 97, 105, 112] as const,
  verdict: 120, //     3.1  the verdict on the viewer + the Orb's chime (C7, SFX). The score leaves 3.1 empty
  score: 135, //       3.2  the score's verdict F5 -> C6, one beat after the chime (never with it)
  // 3.3: a plain week, the iris relaxes back to its toast (3 drawings; servo SFX, softer); 3.4 the glint.
  idle: [150, 152, 154] as const,
  glint2: 165,
  // ---- Ep1 only: the moth stinger, INSIDE bar 3 (the Orb still on screen; OUTRO-PROPOSALS §1.3 "inside").
  // o138 the moth drops in from the top of frame, drawn to the only lights: it bumbles across the Orb's lit lens,
  // o150 (3.3) the iris swivels down after it (the servo), o160 it settles beside the terms line's final period (never
  // on a word) and folds its wings, o165 (3.4) the iris narrows on it one step. o172 a wing twitch. Replaces the idle
  // glance and the second glint.
  mothIn: 138,
  mothLand: 160,
  mothFold: [162, 165] as const,
  squint: 165,
  mothTwitch: 172,
  out: 179, //         the last outro frame: the cut to black takes the Orb, the toast, the band and the moth together
  bandOut: 180, //     the band goes out with the cut
  end: 197, //         the mock-up file's last frame (18 f of black while the fifth releases)
};

export type EpId = 1 | 6 | 10;
export interface EpData {
  ep: EpId;
  file: string;
  /** the toast's last line: the Orb's verdict on the viewer (G07's drift, OUTRO-PROPOSALS §3). Ep1 is the check mark
   *  (the shared face's own ✓): one colon, not `viewer: verified: human`'s two, which a cold viewer read as clunky. The
   *  drift then erodes the check into hedges: `human ✓` -> `human (probably)` -> `—` -> `human… probably?` */
  verdict: string;
  /** Ep10+: the credit chips land before the cone has swept them (it already knew) */
  prefill: boolean;
  /** the GLYPH token cell (native px): the ladder goes coarse -> fine across the season (MM-13) */
  cell: [number, number];
  /** the score's verdict (OST-BIBLE §2.4), for the labels */
  music: string;
  moth: boolean;
}
export const EPS: Record<EpId, EpData> = {
  1: {ep: 1, file: 'ep1.0_research_preview.md', verdict: 'viewer: human ✓', prefill: false, cell: [2, 3], music: 'F5 -> C6', moth: true},
  6: {ep: 6, file: 'ep1.5_backstop.xlsx', verdict: 'viewer: human (probably)', prefill: false, cell: [2, 3], music: 'F5 -> C6 with a Db grace', moth: false},
  10: {ep: 10, file: 'ep1.9_pace.yaml', verdict: 'viewer: —', prefill: true, cell: [1, 2], music: 'F5 alone', moth: false},
};

/** The text package (OUTRO-PROPOSALS §1.1), carried on B's surface, the Orb's scan toast, in B's condensed wording
 *  (§3), lowercase (the Orb's voice). `(creator)` is the placeholder until the showrunner gives the credit line.
 *  How the six §1.1 fields map onto three lines:
 *    title `MR. MAS · <file>`                         -> `scan: <file>` (the filename is the episode's identity)
 *    created by / written: (creator), with AI /
 *    picture · music: ... rendered in code /
 *    AI tools: used throughout                        -> `made in code by (creator), with ai tools`
 *    voices: synthetic, designed from text · none cloned -> `voices: synthetic · none cloned`
 *    ... listed in the notice                          -> the band's pointer (`Full notice and sources: ...`)
 *  The band carries the terms line and the pointer exactly as §1.1 gives them. */
export const TERMS = 'A parody. Events dramatized, scenes invented. No one depicted took part or endorsed it.';
export const POINTER = 'Full notice and sources: in the description.';
/** [0] the header (the scan target), [1..2] the credit lines */
export const toastLines = (e: EpData) => [
  `scan: ${e.file}`,
  'made in code by (creator), with ai tools',
  'voices: synthetic · none cloned',
];
/** when each toast row POSTS as a chip (o-frames): the header as the Orb lights (o9); the credit lines on the knee's
 *  flat line (Ep10: the moment the cone opens, before it has swept them) */
export const linePops = (e: EpData): number[] => (e.prefill ? [T.header, 31, 32] : [T.header, ...T.lines]);

/** The stills composition: one frame per state. Index = the composition frame. */
export const STILLS: Array<{ep: EpId; o: number; label: string}> = [
  {ep: 10, o: 40, label: 'Ep10 · the toast is already posted while the scan is still running (it already knew)'},
  {ep: 10, o: 140, label: 'Ep10 · viewer: — (it returns nothing); the score plays F alone'},
  {ep: 6, o: 140, label: 'Ep6 · the verdict drifts: viewer: human (probably)'},
  {ep: 6, o: 172, label: 'a plain week (no stinger) ends on the glance back to its toast'},
];
