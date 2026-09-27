// MR. MAS — outro proposal D, "the curve": the single source of timing (lookdev mock-up, not a final).
// 96 BPM at 24 fps: 15 frames a beat, 60 a bar. d4 (polish): the outro is 4.5 bars = 270 frames (o0-o269, 11.25 s),
// down from 6 bars (15 s). The motion comp runs PRE (24 frames, 1 s) of the stand-in "last frame of the episode"
// first, so the cut in reads: comp frame g = o + PRE.
//
// d4 shape (why): the cold read found two dead stretches in d3 (5.5 s of empty grid on the flat line, and 2.6 s of
// the intro's x9 caret macro after the hard cut, read as "dead air or a glitch"), the title scrolled off and was cut
// ("R. MAS", "eview.md"), and the last credit was short. So: the knee starts ON the lift (no empty bar 1), the flat
// stays half notes (the decades that took forever) and the leap goes to quarter notes from 2.4 (the curve takes off:
// the rhythm accelerates with it), the camera no longer pans (nothing can scroll off), and the end is the image the
// cold read asked for: MR. MAS beside the empty post box at the top of the curve, then the frame steps to black
// around the post box's own caret.
export const FPS = 24;
export const BEAT = 15;
export const BAR = 60;
export const PRE = 24;
export const OUT = 270;
export const TOTAL = PRE + OUT; // 294 frames = 12.25 s

/** bar.beat (1-based, bar 1 = o0) -> outro frame */
export const at = (bar: number, beat = 1) => (bar - 1) * BAR + (beat - 1) * BEAT;

/**
 * THE KNEE, whole, once (OST §2.1), one event per note:
 *   F 1.1 o0    the thread lifts off the last frame          F 1.3 o30   the title (MR. MAS · the file)
 *   F 2.1 o60   plate: created by                            F 2.3 o90   plate: written
 *   G 2.4 o105  the knee: plate picture · music, the pen climbs, the title steps to EARLY-WEB16, the crane starts
 *   Ab 3.1 o120 plate: voices                                C 3.2 o135  plate: AI tools (the disclosure)
 *   F 3.3 o150  the eighth plate: the empty post box at the top; the title steps to BASE
 * The flat F F F F in half notes, the leap G Ab C F in quarters.
 */
export const NOTES = [at(1, 1), at(1, 3), at(2, 1), at(2, 3), at(2, 4), at(3, 1), at(3, 2), at(3, 3)]; // 0 30 60 90 105 120 135 150
export const PITCH = ['F', 'F', 'F', 'F', 'G', 'Ab', 'C', 'F'];

export const EV = {
  /** o0-4: the thread draws itself along the desk's lit front edge; o4-14: it peels up into the flat line */
  lift: [0, 14] as const,
  /** o6-23: 3-step Bayer dissolve of the last frame (steps at o6, o12, o18); gone from o24 */
  fade: [6, 23] as const,
  /** o15-26: the dotted future (Ep1) draws on from the knee to the top: where the line is going */
  future: [15, 26] as const,
  /** o18 (1.2+3): the band (terms + pointer) steps up in 3 frames; it stays, unmoving, until the out */
  band: 18,
  /** o42: the `you are here` dot comes on (its halo blinks on the beat) */
  dot: 42,
  /** the pen leaves the knee on 2.3 and reaches each leap plate's corner on its note */
  climb: at(2, 3),
  /** o105-153: the crane: 20 px up in whole pixels (ease in-out); the world settles into the final frame */
  crane: [at(2, 4), at(3, 3) + 3] as const,
  /** o240 (5.1): the out. 4 dithered steps to black (o240, 243, 246, 249); the band goes out on 5.1 */
  out: at(5, 1),
  /** o255 (5.2): the post box's caret alone on black, at the same spot: felt F5 + the chip F6 glint */
  glint: at(5, 2),
  end: OUT - 1,
};

/** the flat plates fold back into the line once read: created by on Ab (3.1), written a beat after the post box (3.4) */
export const FOLD = [at(3, 1), at(3, 4)];
export const CRANE = 20;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));
/** the crane's progress in whole pixels (0 before, CRANE after) */
export const craneAt = (o: number) => {
  const [a, b] = EV.crane;
  if (o <= a) return 0;
  if (o >= b) return CRANE;
  return Math.round(CRANE * easeInOut((o - a) / (b - a)));
};

/** the cursor blinks on the beat: on 8 frames, off 7 (the cold open's caretOn) */
export const blinkOn = (o: number) => ((o % BEAT) + BEAT) % BEAT < 8;

/** ≈16 characters a second plus half a second, in frames (the doc's read-time estimate) */
export const readFrames = (chars: number) => Math.ceil(FPS * (chars / 16 + 0.5));
