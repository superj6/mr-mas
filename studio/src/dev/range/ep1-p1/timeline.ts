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
  plateClod: [B(195), B(235)] as [number, number],
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

/** Round 5: the band's content steps down to a quiet bar after the opening beat (the plate has cleared): the
 *  verbs and the inventory leave in three held steps and the rail's date stays. Its position never moves. */
export const BAND_FADE = 100;
/** Mario's startle at the slam (a hand to his chest, brows up, a pixel back), then he looks at CLOD */
export const STARTLE: [number, number] = [B(180), B(196)];
/** The can's filament: the clunk at the slam, then the light comes up in four held steps on 2s (8 f) instead of
 *  one frame. Level 0..1: the pixel light's rungs scale by it, and the clay blends from its night key to its lit one. */
export const LIGHT_RAMP = [0.3, 0.58, 0.84];
export const lightAt = (f: number) => (f < T.slam || f >= T.cut ? 0 : LIGHT_RAMP[(f - T.slam) >> 1] ?? 1);
