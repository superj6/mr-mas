// MR. MAS — outro proposal A, "the closing session" (LOOKDEV MOCK-UP). Single source of timing.
// Brief: show/production/OUTRO-PROPOSALS.md §2 and §9 (row A), cut down after the cold read (README "Polish pass").
// 96 BPM / 24 fps: 15 frames a beat, 60 a bar. The outro is 3.5 bars, 210 frames, 8.75 s.
// The mock-up composition is PRE + OUT frames: a 1 s stand-in of "the episode's last frame", then the outro,
// whose frames are numbered o0-o209 (composition frame = PRE + o).
//
// The shape (one move outward, the reveal once, at the end):
//   o0-2     the act's picture steps down to black inside the monitor's bezel; THE BAND lights on o0 (terms + pointer)
//   o3-149   INSERT, the monitor: the 1-bit session pane opens, the header prints, 5 credit lines type, the log holds
//   o150-153 the pull-back (the band goes out on o150): LCD rows and the bezel coming in, then the room's zoom outlines
//   o154-169 ROOM: Mas at his desk, the Orb, the pane on his monitor lighting him; the moth comes to the light
//   o170-172 the session window closes (half, a line, gone); his light goes with it, the room one step down
//   o180     the cursor comes on at the loop point (felt F5 + chip F6 glint: the cold open's f0 sound)
//   o190     the moth, which lost its light when the window closed, settles on the glass beside the cursor
//   o195-202 the last blink; out o209
export const PRE = 24; // 1.0 s of the stand-in before the outro (brief: "Play 1 s of it before the outro")
export const OUT = 210; // 3.5 bars, 8.75 s
export const TOTAL = PRE + OUT;
export const BEAT = 15;
export const BAR = 60;

/** composition frame -> outro frame (negative during the stand-in) */
export const toO = (f: number) => f - PRE;

export const O = {
  stepDown: 0, // o0-2   the act's picture steps down in 3 palette steps inside the bezel (the band is lit from o0)
  paneUp: 3, // o3-5   the pane opens in 3 drawings (a line, half, full)
  paneFull: 5,
  header: 7, // the header prints at once (a return)
  /** earliest start of each credit line; each also waits for the line before it (+1 frame, the return) */
  lines: [10, 16, 24, 41, 55] as const,
  cps: 4, // keystrokes a frame (straight: the machine doesn't swing)
  pull: 150, // 3.3  the pull-back: o150-151 LCD rows + the bezel coming in, o152-153 the room's zoom outlines
  room: 152,
  mothIn: 156, // the moth flies in from the dark toward the lit pane
  close: 170, // o170-172 the window closes (half, a line, gone); his key light drops with it
  dark: 173, // the monitor is black; the room one step down
  cursorOn: 180, // 4.1  the cursor comes on at LOOP_CURSOR (on 8 / off 7 on the beat grid from here)
  blink: 183, // o183-185 Mas blinks (lid half, closed, half)
  mothLand: 190, // the moth touches down beside the cursor (open, folding, folded by o194)
  lastBlink: 195, // 4.2  the cursor's last on-phase o195-202, off o203-209
  end: 209,
} as const;

/** the band (terms + pointer) is on screen for exactly these outro frames */
export const TERMS_ON: [number, number] = [0, O.pull - 1];

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

/** key stills (outro frames) for the 3 key stills and the 6-frame strip */
export const KEY_STILLS: Array<{name: string; o: number; what: string}> = [
  {name: 'log', o: 120, what: 'INSERT: the session log complete, the band under it'},
  {name: 'room', o: 162, what: 'ROOM: the pull-back, the pane on his monitor, the moth coming to it'},
  {name: 'moth', o: 198, what: 'ROOM: the moth beside the cursor, the last blink'},
];
export const STRIP: Array<{o: number; what: string}> = [
  {o: 1, what: "the act's picture steps down; the band lights"},
  {o: 30, what: 'the pane: the credits type (4 chars a frame)'},
  {o: 120, what: 'the log complete, held for reading'},
  {o: 162, what: 'pull-back: his monitor, the moth to the light'},
  {o: 176, what: 'the window closed: the dark, the moth lost'},
  {o: 198, what: 'the cursor; the moth settled; the last blink'},
];
