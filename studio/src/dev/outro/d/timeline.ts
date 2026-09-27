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
  /** d5: o0-1 the monitor's own curve lights up (the thread IS the line on Mas's screen; no second curve is drawn) */
  light: [0, 1] as const,
  /** o2-13: the room dissolves around the lit curve in 4 dithered steps (o2, 5, 8, 11); black from o11 */
  fade: [2, 13] as const,
  /** o12-23: the push-in, on the thread alone: the monitor's curve stretches out to the full-frame chart's line
   *  (one line the whole way, so the two charts are never on screen together); its rise breaks into the dotted future */
  morph: [12, 23] as const,
  /** o14-25: the chart's grid and axis develop in on an ordered dither under the moving line */
  grid: [14, 25] as const,
  /** o18 (1.2+3): the band (terms + pointer) steps up in 3 frames; it stays, unmoving, until the out */
  band: 18,
  /** o42: the `you are here` dot comes on (its halo blinks on the beat) */
  dot: 42,
  /** the pen leaves the knee on 2.3 and reaches each leap plate's corner on its note */
  climb: at(2, 3),
  /** o105-153: the crane: 20 px up in whole pixels (ease in-out); the world settles into the final frame */
  crane: [at(2, 4), at(3, 3) + 3] as const,
  /** o150-152 (3.3): the title's one upgrade, 1-BIT paper plate -> the show's own window (the post box's twin), as an
   *  interlaced develop (every 4th row, every 2nd, all) */
  upgrade: at(3, 3),
  /** o240 (5.1): the out. 4 dithered steps to black (o240, 243, 246, 249), the band with them */
  out: at(5, 1),
  /** o255 (5.2): the post box's caret alone on black, at the same spot: felt F5 + the chip F6 glint */
  glint: at(5, 2),
  end: OUT - 1,
};

/** d5: no plate folds. Both human credits (created by, written) stay on the flat line to the out, so the frame held
 *  longest lists every credit, human first (d4 folded them at o120/o165 and the cold read took the last frame as
 *  "made by AI"). */
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
