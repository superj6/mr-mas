// MR. MAS — mcoldopen: THE COLD OPEN (intro f0-119), pixel edition. Single source of timing for this span.
// Every number below is a GLOBAL intro frame (96 BPM / 24 fps: 15 frames per beat, 60 per bar).
// The composition 'mcoldopen' starts at global frame SPAN.from, so local frame = global frame - SPAN.from.
import {FRAMES_PER_BEAT} from '../../shared/timing';

export const SPAN = {from: 0, durationInFrames: 120} as const;
export const toGlobal = (local: number) => local + SPAN.from;

// ------------------------------------------------------------------ shots (cuts land on the beat grid, except
// the 6-frame scan cutaway, which is locked to the brief's f99-104 glyph window)
export type ShotId = 'macro9' | 'macro3' | 'medium' | 'wide' | 'white';
export interface Shot { id: ShotId; from: number; to: number; why: string }
export const SHOTS: Shot[] = [
  {id: 'macro9', from: 0, to: 14, why: 'beat 1: black LCD, the cyan block cursor blinks (on 8 / off 7). Subpixels.'},
  {id: 'macro3', from: 15, to: 29, why: 'beat 2: stepped dolly-out x3. Typing starts at f18, 6 frames ahead of the VO (f24).'},
  {id: 'medium', from: 30, to: 59, why: 'beat 3: x3 again = 1:1. The reveal: composer over the log chart, Mas, the Orb; holds through "singularity;" (VO f35-57) so the typed line 1 stays readable.'},
  {id: 'wide', from: 60, to: 71, why: 'bar 2 beat 1 (the D-flat in the pause): the dark room, Mas 3/4 front at his desk; the head tilt, shift+enter and "unclear" start typing here.'},
  {id: 'medium', from: 72, to: 98, why: 'f72 (VO "unclear"): cut back in for the performance.'},
  {id: 'wide', from: 99, to: 104, why: 'the scan: 6-frame cutaway, the room is a cathedral inside the cone.'},
  {id: 'medium', from: 105, to: 117, why: 'beat 8: micro-smile, Post, the words become tokens.'},
  {id: 'white', from: 118, to: 119, why: 'white-to-white match cut into 1993 (1-bit paper).'},
];
export const shotAt = (f: number): Shot => SHOTS.find((s) => f >= s.from && f <= s.to) ?? SHOTS[SHOTS.length - 1];

// ------------------------------------------------------------------ the typed line (VO is added in audio)
export const L1 = 'near the singularity;';
export const L2 = 'unclear which side.';
/** frame each character of L1 appears (hand-keyed typing rhythm, word gaps, the semicolon lands late).
 *  SCRIPT v2.1 §3.2: f18-49, 6 frames ahead of the VO ("near" f24) — he reads back what he just typed. */
export const L1_KEYS = [18, 19, 21, 22, 24, 25, 26, 28, 30, 31, 33, 34, 35, 37, 38, 40, 41, 43, 44, 46, 49];
/** Shift+Enter at f63 moves the caret to line 2 (typing resumes at f64, SCRIPT §3.2) */
export const L2_BREAK = 63;
/** "unclear which side." f64-83, 7-8 frames ahead of the VO ("unclear" f72, "which" f81, "side" f86); complete f84 */
export const L2_KEYS = [64, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83];
/** tokenizer view of the post (the semicolon gets its own token): the Post burst's chips (chips.ts) */
export const L_TOKENS: Array<{t: string; line: 0 | 1}> = [
  {t: 'near', line: 0}, {t: ' the', line: 0}, {t: ' singular', line: 0}, {t: 'ity', line: 0}, {t: ';', line: 0},
  {t: 'unclear', line: 1}, {t: ' which', line: 1}, {t: ' side', line: 1}, {t: '.', line: 1},
];

// ------------------------------------------------------------------ the episode slot (SCRIPT.md §8 items 1 and 2)
// The cold open's per-episode values. Every function in this moment takes them with Ep1's as the default, so Ep1's
// intro (intro-ep1) draws exactly as before; studio/src/intro/slot.ts gathers them with the other moments' slots, and
// another episode's intro (Ep2: studio/src/episodes/ep02/intro/) passes its own.
export interface ColdLine {
  /** the typed line: line 1, line 2 ('' if the line is one line) */
  l1: string;
  l2: string;
  /** the frame each character of l1 / l2 appears */
  keys1: number[];
  keys2: number[];
  /** shift+enter to line 2 (null: no second line) */
  brk: number | null;
  /** the Post burst's tokens */
  tokens: Array<{t: string; line: 0 | 1}>;
  /** a pulsing typing indicator (three dots) after the typed text, holding the rest of the phrase's slot:
   *  [first, last] frame, or null (Ep1 has none; Ep2's "her" is followed by one) */
  indicator: [number, number] | null;
}
export interface ColdSlot {
  line: ColdLine;
  /** the `you are here` dot's rest on the chart (SCRIPT §8.4): 0.50 = at the knee (Ep1), 1.0 = the chart's top edge */
  dot: number;
}
export const EP1_LINE: ColdLine = {l1: L1, l2: L2, keys1: L1_KEYS, keys2: L2_KEYS, brk: L2_BREAK, tokens: L_TOKENS, indicator: null};
export const EP1_COLD: ColdSlot = {line: EP1_LINE, dot: 0.5};
/** every keystroke of a line, the shift+enter included (Ep1: [...L1_KEYS, L2_BREAK, ...L2_KEYS]) */
export const lineKeys = (line: ColdLine) => (line.brk === null ? [...line.keys1, ...line.keys2] : [...line.keys1, line.brk, ...line.keys2]);
/** the indicator is up on frame f */
export const indicatorOn = (line: ColdLine, f: number) => !!line.indicator && f >= line.indicator[0] && f <= line.indicator[1];

// ------------------------------------------------------------------ acting / events
export const EV = {
  blink: 48, // one blink while typing; after "side" there is none
  tilt: 63, // the pause: head tilts (held)
  dotSlide: [86, 89] as const, // on "side" the you-are-here dot climbs the curve...
  dotExit: 90, // ...and leaves the top of the screen (pluck)
  eyeSnap: 94, // eyes snap to the lens
  irisTurn: 97, // the Orb's iris swivels to the lens (servo); f97 in-between, f98 on the lens
  scan: [99, 104] as const, // the scan fan: opens f99 (BASE), GLYPH cathedral inside the cone f100-104 (the 5-frame S1 budget)
  glyph: [100, 104] as const,
  smile: 107, // the tiniest smile: one pixel
  pointer: [106, 111] as const, // the mouse pointer travels to Post (on 2s)
  click: 112, // Post
  chips: [112, 114] as const, // the line splits into its tokens (1x on the screen), then 2x and 3x past the lens
  chartSnap: 113, // the curve snaps vertical
  white: [118, 119] as const,
};

/** idle caret: on 8 / off 7, phase-locked to the beat */
export const caretOn = (f: number) => ((f % FRAMES_PER_BEAT) + FRAMES_PER_BEAT) % FRAMES_PER_BEAT < 8;

/** characters of L1 / L2 visible at frame f */
export const typedCount = (keys: number[], f: number) => keys.filter((k) => k <= f).length;
/** frame of the most recent keystroke at or before f (either line), or -Infinity */
export const lastKey = (f: number, line: ColdLine = EP1_LINE) => {
  const all = lineKeys(line).filter((k) => k <= f);
  return all.length ? Math.max(...all) : -Infinity;
};

// ------------------------------------------------------------------ beat grid audit (see notes/mcoldopen.md)
export const BEATS = Array.from({length: 8}, (_, i) => i * FRAMES_PER_BEAT); // 0 15 30 45 60 75 90 105
export const HITS: Array<{f: number; what: string}> = [
  {f: 0, what: 'caret on, macro x9 (piano F5)'},
  {f: 15, what: 'cut: macro x3, caret on (piano F5)'},
  {f: 30, what: 'cut: medium, the reveal (piano F5)'},
  {f: 45, what: 'piano F5 (medium holds through "singularity;")'},
  {f: 60, what: 'cut: wide on the D-flat, the pause'},
  {f: 72, what: 'cut: medium on "unclear"'},
  {f: 75, what: 'caret/typing on the beat ("clear")'},
  {f: 90, what: 'the dot leaves the top of the screen (pluck)'},
  {f: 105, what: 'cut: medium, knee run G5 (smile lands f107)'},
];

// ------------------------------------------------------------------ audio cue sheet for this span
// (frames are global; the audio builder / temp mix in tools/audio.ts reads this)
export interface Cue { f: number; len?: number; kind: 'music' | 'sfx' | 'vo'; what: string }
export const CUES: Cue[] = [
  {f: 0, len: 120, kind: 'music', what: 'sub drone F1 + C2 (open fifth, no third), fades in over f0-30'},
  {f: 0, len: 120, kind: 'sfx', what: 'room tone + server hum (60 Hz family, very low), rack fans'},
  {f: 0, kind: 'music', what: 'felt piano F5'},
  {f: 15, kind: 'music', what: 'felt piano F5'},
  {f: 30, kind: 'music', what: 'felt piano F5 (ducked -6 dB under VO)'},
  {f: 45, kind: 'music', what: 'felt piano F5 (ducked)'},
  ...L1_KEYS.map((f) => ({f, kind: 'sfx' as const, what: 'key (soft low-profile keyboard)'})),
  {f: 24, len: 34, kind: 'vo', what: '"near the singularity;" soft, close-mic, no stress'},
  {f: 60, kind: 'music', what: 'low D-flat, inside the pause (the colour note)'},
  {f: L2_BREAK, kind: 'sfx', what: 'shift+enter (heavier key)'},
  ...L2_KEYS.map((f) => ({f, kind: 'sfx' as const, what: 'key'})),
  {f: 72, len: 20, kind: 'vo', what: '"unclear which side." "side" left hanging, neither falling nor rising'},
  {f: 90, kind: 'music', what: 'pluck as the dot exits'},
  {f: 94, kind: 'sfx', what: '(nothing: the eye snap is silent)'},
  {f: 97, kind: 'sfx', what: 'Orb servo (tiny, precise, 2 steps)'},
  {f: 99, len: 6, kind: 'sfx', what: 'scan "shhk" (f100 peak), an airy filtered-noise sweep with a high sine chirp'},
  {f: 105, kind: 'music', what: 'knee run G5'},
  {f: 108, kind: 'music', what: 'knee run A-flat5'},
  {f: 112, kind: 'music', what: 'knee run C6 + mouse click on Post'},
  {f: 112, len: 3, kind: 'sfx', what: 'a glassy tick per chip step (1x, 2x, 3x)'},
  {f: 116, kind: 'music', what: 'knee run F6'},
  {f: 105, len: 15, kind: 'sfx', what: 'reverse-cymbal swell into the white (f118) and the f120 drop'},
];
