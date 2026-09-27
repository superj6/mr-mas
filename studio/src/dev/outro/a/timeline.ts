// MR. MAS — outro proposal A, "the closing session" (LOOKDEV MOCK-UP). Single source of timing.
// Brief: show/production/OUTRO-PROPOSALS.md §2 and §9 (row A), reshaped by two cold reads (README).
// 96 BPM / 24 fps: 15 frames a beat, 60 a bar. The outro is 4.75 bars, 285 frames, 11.875 s.
// The mock-up composition is PRE + OUT frames: a 1 s stand-in of "the episode's last frame", then the outro,
// whose frames are numbered o0-o284 (composition frame = PRE + o).
//
// The shape (one move outward, the reveal once, at the end; ONE block of text, read top to bottom, once):
//   o0-2     the act's picture steps down to black inside the monitor's bezel
//   o3-5     the 1-bit session pane opens (a line, half, full); the title bar is up with it
//   o6       the header prints (`session closed`, the date flush right)
//   o9-69    three credit lines type at 2 characters a frame, each one waiting for a reader to finish the one
//            before it (READ_CPF), so the log is never far ahead of the eye
//   o85      the terms PRINT, whole, in one frame (a `cat`, never typed), both rows; they hold, unmoving, to o224
//            (5.8 s); the cursor waits on the next row, blinking on the beat
//   o145     the pointer prints under them (its own beat, so the eye goes to it), with the prompt
//   o225-228 the pull-back (4.4): LCD rows and the bezel coming in, then the room's zoom outlines
//   o229-251 ROOM: Mas at his desk, the Orb, the pane on his monitor lighting him; the moth comes to the light
//   o252-254 the session window closes (half, a line, gone) into the cursor; his light goes with it
//   o255     5.2: the cursor comes on at the loop point (felt F5 + chip F6 glint: the cold open's f0 sound)
//   o265     the moth settles on the glass beside the cursor
//   o270-277 5.3: the last blink; the room goes down around it (o272, o274, o276), the cursor the last light
//   o278-284 black; out o284
export const PRE = 24; // 1.0 s of the stand-in before the outro (brief: "Play 1 s of it before the outro")
export const OUT = 285; // 4.75 bars, 11.875 s
export const TOTAL = PRE + OUT;
export const BEAT = 15;
export const BAR = 60;

/** composition frame -> outro frame (negative during the stand-in) */
export const toO = (f: number) => f - PRE;

/** the reading pace the reveal waits for: 25 characters a second (about 240 words a minute, an average adult's
 *  silent reading), as characters per frame */
export const READ_CPS = 25;
export const READ_CPF = READ_CPS / 24;

export const O = {
  stepDown: 0, // o0-2   the act's picture steps down in 3 palette steps inside the bezel
  paneUp: 3, // o3-5   the pane opens in 3 drawings (a line, half, full)
  paneFull: 5,
  header: 6, // the header prints at once (a return)
  /** earliest start of each credit line (a 25 cps reader has finished the line before); each also waits for the
   *  line before it to finish typing (+1 frame, the return) */
  lines: [9, 29, 55] as const,
  cps: 2, // keystrokes a frame (straight: the machine doesn't swing)
  legal: 85, // 2.2 swung &: the terms print whole (both rows)
  pointer: 145, // 3.2 swung &: the pointer prints under them, with the prompt
  pull: 225, // 4.4: o225-226 LCD rows + the bezel coming in, o227-228 the room's zoom outlines
  room: 227,
  mothIn: 231, // the moth flies in from the dark toward the lit pane
  close: 252, // o252-254 the window closes (half, a line, gone) into the cursor; his key light drops with it
  dark: 255, // the monitor is black but for the cursor; the room one step down
  cursorOn: 255, // 5.2  the cursor comes on at LOOP_CURSOR (on 8 / off 7 on the beat grid from here)
  blink: 258, // o258-260 Mas blinks (lid half, closed, half)
  mothLand: 265, // the moth touches down beside the cursor (open, folding, folded by o269)
  lastBlink: 270, // 5.3  the cursor's last on-phase o270-277
  fade: 272, // the room goes down one more step every 2 frames (o272, o274, o276) around the lit cursor
  black: 278, // the cursor goes off: black to the end
  end: 284,
} as const;

/** the terms are on screen for exactly these outro frames (the pointer from O.pointer to the same end) */
export const TERMS_ON: [number, number] = [O.legal, O.pull - 1];

/** caret on the beat grid (on 8 / off 7), phase-locked like the cold open's f0 caret */
export const beatOn = (o: number) => ((o % BEAT) + BEAT) % BEAT < 8;

/** the typing schedule: [start, done] outro frames per credit line (keys = label + tab + value) */
export const typingSchedule = (credits: Array<[string, string]>): Array<[number, number]> => {
  const out: Array<[number, number]> = [];
  let next = 0;
  credits.forEach(([l, v], i) => {
    const keys = l.length + 1 + v.length;
    const start = Math.max(O.lines[i] ?? next, next);
    const done = start + Math.ceil(keys / O.cps) - 1;
    out.push([start, done]);
    next = done + 2; // one frame for the return
  });
  return out;
};

/** the room's step down at the very end (0 before O.fade; 1, 2, 3 on o272, o274, o276) */
export const fadeStep = (o: number) => (o < O.fade ? 0 : Math.min(3, 1 + ((o - O.fade) >> 1)));

/** key stills (outro frames) for the 3 key stills and the 6-frame strip */
export const KEY_STILLS: Array<{name: string; o: number; what: string}> = [
  {name: 'log', o: 200, what: 'INSERT: the session log complete, one block, one face'},
  {name: 'room', o: 240, what: 'ROOM: the pull-back, the pane on his monitor, the moth coming to it'},
  {name: 'moth', o: 273, what: 'ROOM: the moth beside the cursor, the last blink, the room going down'},
];
export const STRIP: Array<{o: number; what: string}> = [
  {o: 40, what: 'the pane: the credits type, paced to a reader'},
  {o: 110, what: 'the terms printed whole; the cursor waits'},
  {o: 200, what: 'the pointer printed: the log complete, held'},
  {o: 240, what: 'pull-back: his monitor, the moth to the light'},
  {o: 259, what: 'the window closed into the cursor; he blinks'},
  {o: 275, what: 'the last blink: the room goes down around it'},
];
