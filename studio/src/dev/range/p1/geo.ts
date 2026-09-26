// MR. MAS - style-range Prototype 1 (THE READ, 10.C + a J4 placeholder, Ep10 #19): the shared clock and the table's
// layout. Both media (the pixel pre-roll / tail and the HD cel push) read their staging from here, so the light, the
// seats and the dealer sit in the same places on both sides of the cut.
//
// The clip is 480 f at 24 fps on the 96 BPM grid (a beat is 15 f, a bar is 60 f). `p` = the prototype's frame.

export const FPS = 24;
export const BEAT = 15;
export const BAR = 60;
export const CLIP_F = 480;

/** the brief's frame-by-frame, as numbers (style-range §7.1, as revised after the first cold read) */
export const T = {
  /** G6 THE HOTSPOT: the cursor lands on each player on the beat; it crosses the Intern and nothing lights */
  hot: {nole: 30, kram: 45, mario: 60, nesnej: 75} as Record<Seat, number>,
  internCross: [85, 89] as [number, number],
  /** the band slides away (one eased move on whole pixels, on 1s) and the room below the table takes the lines */
  retract: [90, 103] as [number, number],
  /** the Intern takes the next card off the shoe, lifts it into the lamp, holds it, and snaps it down on p120 */
  lift: {reach: 94, lift: 100, up: 105, down: 116, smear: 118} as const,
  snap: 120,
  /** ECU key drawing: his one live motion */
  pupilStep: 135,
  ots: 150,
  /** the tells light as objects, one per beat */
  tell: {kram: 180, mario: 195, nesnej: 210, nole: 225} as Record<Seat, number>,
  /** the push lands on the dealer; the caret stops blinking; the lens is drawn into its screen */
  rest: 318,
  caretHold: 345,
  into: 334,
  /** J4 placeholder: the machine's view opens out of the caret; the four tells rise; the caret finds Mas: nothing */
  j4: 360,
  j4open: 13,
  j4rise: [365, 367, 369, 371] as [number, number, number, number],
  j4caretOff: 377,
  j4caretMas: 380,
  tail: 406,
  /** the band slides home */
  ret: [406, 418] as [number, number],
  /** his cursor comes back on the downbeat, crosses to him, and lands: `look at mas`, and nothing sets */
  cursorBack: 420,
  cursorOnMas: 435,
  /** Mas's one-pixel eye return, then the cut to black on the last note */
  eyeReturn: 450,
  black: 468,
};

export type Seat = 'nole' | 'kram' | 'mario' | 'nesnej';
/** left to right across the far side of the table (the cursor sweeps this way; Nole sits across from Mas) */
export const SEATS: Seat[] = ['nole', 'kram', 'mario', 'nesnej'];

/** the stat bars (F4.1's shape: label first, then the cells left to right) */
export const BARS: Record<Seat, {label: string; cells: number; filled: number}> = {
  nole: {label: 'POST-BUTTON TWITCH', cells: 5, filled: 5},
  kram: {label: 'LADLE', cells: 4, filled: 3},
  mario: {label: 'ADDENDUM', cells: 4, filled: 4},
  nesnej: {label: 'REGISTER', cells: 5, filled: 5},
};

/** the caret face blinks on the quarter notes: lit for the first 8 frames of every beat */
export const caretOn = (p: number) => p % BEAT < 8;

// ------------------------------------------------------------------ the pixel frame (native 480 x 270)
/** the pool light hangs over the pot; its pool on the felt is the key for everyone */
export const LAMP = {x: 290, shadeY: 13, poolX: 290, poolY: 138, poolRX: 168, poolRY: 33};
/** the felt oval (the rail is drawn outside it, thicker at the near side: the table is seen from above the rail) */
export const TABLE = {cx: 292, cy: 140, rx: 176, ry: 35, railFar: 3, railNear: 7, apron: 8};
/** seat x-centres on the far side and where each head sits (top of the head stamp) */
export const SEAT_X: Record<Seat, number> = {nole: 180, kram: 240, mario: 300, nesnej: 362};
export const INTERN_X = 438;
