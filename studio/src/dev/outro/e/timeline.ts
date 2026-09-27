// MR. MAS — outro proposal E, "file closed": the single source of timing (96 BPM / 24 fps: 15 frames a beat, 60 a bar).
// Two clocks:
//   m = the mock-up's frame (the whole composition): 1 s of the stand-in, then the outro (and, in Ep1, the moth)
//   o = the outro's own frame (o0 = the cut to the file, on the downbeat of bar 1). o = m - PRE.
// Bar.beat below is the outro's own grid: bar 1 beat 1 = o0.
//
// POLISH PASS (after the cold read): the outro is 3 bars (7.5 s), not 2.5. The file holds 2 beats longer (the click
// moved from 3.1 to 3.3), its credits block lights up line by line on the knee's eight notes, and the pointer waits
// until the block has been whole for 3 s. The black tail is gone (it was 4.5 s of near-black): in Ep1 the moth comes
// in with the collapsing line of light and lands on the terms line's period on 4.1, 1.25 s after the click, in the
// silence where the downbeat would be; the mock-up ends 0.83 s after it lands.

export const FPB = 15; // frames per beat
export const FPBAR = 60;
/** the stand-in for the episode's last frame (the cold open's dark-room MEDIUM), before the cut */
export const PRE = 24;
/** the outro proper: 3 bars, o0-o179 (every week) */
export const OUTRO = 180;
/** Ep1: the moth arrives inside the outro's last bar, lands on 4.1 and holds 20 frames; the mock-up ends on o199 */
export const EP1_END = 199;
export const TOTAL = PRE + EP1_END + 1; // 224 frames = 9.33 s (the Ep1 mock-up)
export const TOTAL_PLAIN = PRE + OUTRO; // 204 frames = 8.5 s (a week with no stinger)

export const toO = (m: number) => m - PRE;
/** outro frame of bar.beat (1-based) */
export const bb = (bar: number, beat = 1) => (bar - 1) * FPBAR + (beat - 1) * FPB;

/** the knee's eight swung eighths in bar 1 (OST engine swing 1.0 = triplet: 10 + 5 frames a beat) */
export const KNEE = [0, 10, 15, 25, 30, 40, 45, 55] as const;

export const EV = {
  // the file, held for reading (6.25 s). The credits block (its 8 lines, --- to ---) lights one line per knee note
  file: [0, 149] as const,
  // the caret appears at the file's end on 2.1 (the button chord), then blinks on the beat
  caret: 60,
  // the pointer: in from frame-right on 3.1+8 (the block has been whole for 3 s), on 2s with an ease-out
  pointer: [128, 141] as const,
  hover: [142, 147] as const,
  press: [148, 149] as const,
  // 3.3: the click. The window closes in 4 whole-pixel drawings, 2 frames each
  click: 150,
  close: {rows: 150, line: 152, dot: 154, gone: 156} as const,
  // the black desktop; the loop cursor blinks on the beat (first on at o165 = 3.4)
  desktop: 158,
  outroEnd: 179,
  // Ep1: the moth comes in with the collapsing light, loses it, and lands on the terms line's final period on 4.1
  moth: {enter: 152, land: 180, settle: [180, 187] as const, folded: 188} as const,
  end: EP1_END,
} as const;

/** beat-locked blink, on 8 / off 7 (the cold open's caret rule), o0 = a downbeat */
export const blinkOn = (o: number) => ((o % FPB) + FPB) % FPB < 8;

/** audio cue sheet (outro frames); tools/track.py and tools/mix.py follow these numbers */
export const CUES = [
  {o: -PRE, what: 'stand-in: the episode button\'s tail, a held open fifth (pad), under the last frame'},
  {o: 0, what: '1.1 cut to the file: the knee whole, swung eighths, felt + chip double; each note lights one credits line'},
  {o: 60, what: '2.1 the button chord F-C-G (no third); brushes keep time through bar 2; the felt answers C4 -> F4 on 2.3'},
  {o: 120, what: '3.1 the bass re-strikes F2, a brush swirl; the pointer moves in silence'},
  {o: 150, what: '3.3 the click (SFX post_click) + felt F5 + a 1-frame chip F6 glint (the cold open\'s f0 sound)'},
  {o: 152, what: 'Ep1: the moth\'s wing flutter (SFX, papery, panned with it) from the right; stops dead on the landing, o180 = 4.1'},
  {o: 179, what: 'plain weeks: out (the F5 faded to zero by o179)'},
  {o: 199, what: 'Ep1: out (the F5 faded to zero by o199)'},
] as const;
