// MR. MAS — range E1-P1 (style-range §6.1a, 1.A): CLOD under its launch light. The timeline.
// 24 fps on the 96 BPM grid: a beat is 15 f, a bar 60 f. The brief's clip is 600 f opening on phrase 1's second bar;
// Mario's temp take runs 206 f (8.57 s at 151 wpm, inside his 145-160 band), past the brief's p176 limit, so, as the
// brief says, the clip opens a bar earlier (on phrase 1's downbeat) and every later frame shifts by 60: 660 f, 11 bars.
// Brief p180 (the slam) is p240 here, p540 (the cut to sc 12) is p600.
export const FPS = 24;
export const BEAT = 15;
export const BAR = 60;
export const SHIFT = 60;
export const FRAMES = 600 + SHIFT;
/** brief frame -> this clip's frame (the brief's p0 is phrase 1's second bar) */
export const B = (p: number) => p + SHIFT;

/** the takes (tools/voice.py, stock Kokoro packs; frames measured from the WAVs) */
export const LINES = {
  memo: {at: 6, frames: 206},       // MARIO: "Memo, on race dynamics. Point one: we must not launch on the same day as them. That's how a race starts."
  right: {at: B(184), frames: 32},  // CLOD: "You're absolutely right!"
  addendum: {at: B(262), frames: 25}, // MARIO: "Addendum."
};

export const T = {
  // phrase 1 (bars 1-4): the split, all pixel
  plateMario: [8, 96] as [number, number],
  napkinUp: 42, napkinSnap: 60, napkinDown: 72, // Gerg holds the napkin up and photographs it
  // phrase 2 (bars 5-6): the launch
  slam: B(180),                      // the can slams on: CLOD is clay from here to the cut
  press: B(188),                     // the bow's down key (a dry clay press)
  plateClod: [B(192), B(272)] as [number, number], // round 6: held 3.3 s like Mario's (40 f was too short to read)
  site1: B(210), site2: B(217),      // the napkin becomes a website, in two drawings
  lookUp1: B(240), lookUp2: B(246),  // Mario looks up to the split line
  cheer1: B(285),                    // the bullpen cheers, two held frames
  // phrase 3 (bars 7-8)
  phoneUp: B(300), post: B(305),     // Mas holds up his phone; the post pops
  marioPhone: B(305), marioWrite: [B(330), B(390)] as [number, number],
  cheer2: B(360),
  // phrase 4 (bars 9-10)
  unroll: B(420), cross: B(452), land: B(480), snap2: B(495), site3: B(505), site4: B(512), spindle: B(525),
  // sc 12
  cut: B(540), rail: B(544),
};

/** the hold: from here CLOD's bow is done; it holds the way a puppet holds (breathing, a few small moves on story
 *  beats, its surface boiling on 2s) until the cut */
export const HOLD_FROM = B(222);

/** Round 6: the band stays whole and readable for the clip (the adventure layout's own band, undimmed): its
 *  verbs and Mas's inventory are the frame's running joke (`Open` struck out; a nonprofit charter, a GPU, an orb),
 *  and a dead bar there read as unfinished. Its position never moves. */
export const BAND_FADE = Infinity;
/** Mario's startle at the slam: a recoil (a step back and a hop, a squint, a hand to his chest, a gasp), HELD so it
 *  reads at phone size (round 5's one-frame version didn't), then he watches CLOD bow at him */
export const STARTLE: [number, number] = [B(180), B(196)];
/** Round 6: the can doesn't fade up. It STRIKES: the clunk, and in the same frame the light is full and CLOD is
 *  clay (the swap happens inside the flash, never a dim clay CLOD before the light). The flash is the camera's
 *  exposure catching up: one extra rung on the pixel light for the first drawing, and the clay overexposed and
 *  settling over three drawings (FLASH_EXP). */
export const lightAt = (f: number) => (f < T.slam || f >= T.cut ? 0 : 1);
/** extra rungs of light on drawing 1 of the strike (the pixel side of the flash) */
export const flashAt = (f: number) => (f >= T.slam && f < T.slam + 2 ? 1 : 0);
/** the clay's exposure over the strike's first drawings: blown, bright, a touch hot, then normal */
export const FLASH_EXP = [1.9, 1.38, 1.12];
export const flashExpAt = (f: number) => (f < T.slam || f >= T.cut ? 1 : FLASH_EXP[(f - T.slam) >> 1] ?? 1);
/** Round 6: the lighthouse's SAFETY lantern browns out as the launch light pulls power: two held steps, then back */
export const SAFETY_DIP: Array<[number, number, number]> = [[B(180), B(184), 2], [B(184), B(190), 1]];
export const safetyDipAt = (f: number) => { for (const [a, b, k] of SAFETY_DIP) if (f >= a && f < b) return k; return 0; };
