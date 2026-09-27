// MR. MAS · outro B, "the Orb's verdict": Ep1's FINAL outro (v3, 2026-09-27). The clock, the words and the
// per-episode data. Chosen by the showrunner ("i liked the orb outro"; SHOWRUNNER-NOTES notes 3-5); the brief is
// show/production/OUTRO-PROPOSALS.md §1.1 and §3; the build before this one (the lookdev mock-up) is in git history.
//
// 96 BPM: 15 frames a beat, 60 a bar. Outro frames are written o0..; the file starts at o0 (the cut from the episode's
// last shot to black) and has no stand-in. A PLAIN week is 3 bars (o0-o179, 7.5 s). A week with a stinger keeps the
// Orb on screen for 3 more beats: Ep1's moth starts inside bar 3 and ends on 4.4 (o0-o224, 9.375 s), one continuous
// scene. The file then holds TAIL frames of black while the score's open fifth releases.
//
// v3 (the final): no band, no terms line and no pointer (SHOWRUNNER-NOTES note 3). The toast carries the show, the
// file and the credits (note 4) in the Orb's lowercase voice, then its verdict on the viewer. With the band gone, the
// Orb and its toast sit centred in the frame, and the moth lands on the Orb itself (the lamp it came to), not on a word.
//
// READ TIME. The header posts at o9; the scan (o30-54) leaves the two credit lines behind it as plain type (legible
// from about o47); their chips land around that type on 2.1 and 2.2 without moving it; the verdict pops at o120.
// tools/preview.ts `check` measures it on the rendered pixels (per line, and the whole toast read in order at 16 / 18
// / 20 chars a second).

/** the outro's length: a plain week 3 bars (180 f, 7.5 s); Ep1, with its moth stinger, to 4.4 (225 f, 9.375 s) */
export const OUT_PLAIN = 180;
export const OUT_STINGER = 225;
/** no stand-in: file frame 0 is o0 */
export const PRE = 0;
/** black after the cut while the fifth releases (0.75 s) */
export const TAIL = 18;
/** the Ep1 file: 225 f outro + 18 f black = 243 f (10.125 s) */
export const TOTAL = PRE + OUT_STINGER + TAIL;
/** file frame -> outro frame */
export const oOf = (f: number) => f - PRE;
export const BEAT = 15;
export const BAR = 60;

/** Outro beats (o-frames). The comments give the bar.beat each sits on. */
export const T = {
  fade: [0, 3, 6, 9] as const, // 1.1 cut to black on the downbeat; the Orb steps up: -3, -2, -1, lit (held steps)
  header: 9, //        1.1+ the Orb is fully lit: its toast's header posts the show and the file
  glint1: 12, //       1.1+ the catch-light glint (the title's glint), 2 frames
  iris: [15, 17, 19] as const, // 1.2 the iris swivels to the lens in 3 drawings (servo SFX on C6 at o15)
  cone: [30, 54] as const, //     1.3-1.4 the scan fan: opens, sweeps the toast's rows top to bottom, closes
  glyph: [31, 52] as const, //    GLYPH tokens in the cone's leading half; behind it the credits stay as type
  // 2.1, 2.2: the two credit chips land on the knee's flat line (F F | F F), straight (the machine owns the frame).
  lines: [60, 75] as const,
  // 2.3-2.4&: the leap (G Ab C F). The iris narrows one step per note: the Orb looking harder at the viewer.
  think: [90, 97, 105, 112] as const,
  verdict: 120, //     3.1  the verdict on the viewer + the Orb's chime (C7, SFX). The score leaves 3.1 empty.
  //                   The verdict LIGHTS the lens (the scan's hot palette + a glow in the glass): the Orb has decided.
  //                   A plain week puts the light out with the glance back (3.3); Ep1 keeps it on (the moth's lamp)
  lamp: 120,
  score: 135, //       3.2  the score's verdict F5 -> C6, one beat after the chime (never with it)
  // 3.3: a plain week, the iris relaxes back to its toast (3 drawings; servo SFX, softer); 3.4 the glint.
  idle: [150, 152, 154] as const,
  glint2: 165,
  // ---- Ep1 only: the moth stinger, from inside bar 3 to 4.4 (the Orb on screen throughout).
  // o130, ten frames after the lens lights, the moth drops in from the top of frame, drawn to it; o142-163 it loops
  // the light in front of the glass, going cyan as it nears it; o165 (3.4) it bumps the lens (a glass tink) and
  // tumbles off to the lower right; the iris flinches shut, then o171 looks down-right after it, where it fell. The
  // moth recovers, flutters up the Orb's right side and over its crown, and o183 lands ON the Orb, on top of it, and
  // folds its wings. o195 (4.2) the Orb, still looking where the moth fell, rolls its eye up to the top of its own
  // head and finds it there (servo); o210 (4.3) it narrows its iris on it; o217 the moth twitches its wings; o224 the
  // last frame: the cut takes the Orb, its toast and the moth together.
  mothIn: 130,
  mothCircle: 142,
  bump: 165,
  flinch: [166, 171] as const,
  after: 171, //       the iris to where the moth fell (3 drawings on 2s)
  mothLand: 183,
  mothFold: [185, 189] as const,
  lookUp: 195, //      4.2  the eye roll up to the moth on its head (3 drawings on 2s)
  squint: 210, //      4.3
  mothTwitch: 217,
  out: 179, //         a plain week's last frame
  outStinger: 224, //  a stinger week's last frame (Ep1)
};
/** the last outro frame of an episode's outro (the cut is the frame after it) */
export const lastO = (e: {moth: boolean}) => (e.moth ? T.outStinger : T.out);

export type EpId = 1 | 6 | 10;
export interface EpData {
  ep: EpId;
  file: string;
  /** the toast's last line: the Orb's verdict on the viewer (G07's drift, OUTRO-PROPOSALS §3):
   *  `human ✓` -> `human (probably)` -> `—` -> `human… probably?` */
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

// ================================================================== THE CREDITS (edit here)
/** The credit text, in the Orb's scan-toast voice: lowercase, `field: value`, a 1-px dot between fields.
 *  Showrunner, 2026-09-27: "it should say art, script, etc. created by opus 4.5, prompt jgon"; the model is Claude
 *  Opus 5.5, so it reads `opus 5.5` (SHOWRUNNER-NOTES note 4). To change a credit, edit these strings and re-render
 *  (README.md). The shared 7-px face has a-z, 0-9, `. , : ; ' " - / ( ) _ * + = ! ? $ · ✓` (and this folder draws `—`);
 *  keep each line under about 330 px (tools/preview.ts `check` reports each chip's width) so it stays clear of the Orb.
 *  The header is `<SHOW> · <the episode's file>`. */
export const SHOW = 'mr. mas';
export const CREDITS = [
  'art · script · music · voices · edit: opus 5.5',
  'prompt: jgon',
];
/** [0] the header (the show and the file: what the Orb is scanning), [1..2] the credit lines */
export const toastLines = (e: EpData) => [`${SHOW} · ${e.file}`, ...CREDITS];
/** when each toast row POSTS as a chip (o-frames): the header as the Orb lights (o9); the credit lines on the knee's
 *  flat line (Ep10: the moment the cone opens, before it has swept them) */
export const linePops = (e: EpData): number[] => (e.prefill ? [T.header, 31, 32] : [T.header, ...T.lines]);

/** The stills composition: one frame per state. Index = the composition frame. (Frame 1, Ep10 o140, is also read by
 *  studio/src/dev/outro/_compare/reel.py.) */
export const STILLS: Array<{ep: EpId; o: number; label: string}> = [
  {ep: 10, o: 40, label: 'Ep10 · the toast is already posted while the scan is still running (it already knew)'},
  {ep: 10, o: 140, label: 'Ep10 · viewer: — (it returns nothing); the score plays F alone'},
  {ep: 6, o: 140, label: 'Ep6 · the verdict drifts: viewer: human (probably)'},
  {ep: 6, o: 172, label: 'a plain week (no stinger) ends on the glance back to its toast'},
];
