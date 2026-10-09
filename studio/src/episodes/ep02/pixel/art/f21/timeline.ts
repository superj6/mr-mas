// MR. MAS — Ep2 v1 art: a COPY of studio/src/dev/meras/timeline.ts (not edited), for F2.1's 2008 stage (manifest SET-20).
// MR. MAS — meras: intro span f120-239 ("the eras"). Frame numbers here are GLOBAL intro frames.
// The composition 'meras' is 120 frames long; local frame 0 = global MERAS_START. Mount it with
// <MerasMount/> (Meras.tsx) inside the full intro, or pass `globalFrame(local)` to the draw function.
//
// Beat grid (96 BPM, 15 f/beat): 120 3.1 | 135 3.2 | 150 3.3 | 165 3.4 | 180 4.1 | 195 4.2 | 210 4.3 | 225 4.4
import {at} from '../../../../../shared/timing';

export const MERAS_START = at(3, 1); // 120
export const MERAS_FRAMES = 120; // 120..239 (5.0 s)
export const MERAS_END = MERAS_START + MERAS_FRAMES - 1; // 239
export const globalFrame = (local: number) => local + MERAS_START;

/** Every cue in the span, global frames. Picture and sound both key off this table (see notes/meras.md). */
export const T = {
  // ---- 1993 (ONEBIT, 3:2 pillarbox, animated on fours)
  y93: 120, // DROP. cut in on the downbeat
  eyes: 128, // eyes leave the screen for the lens (beeper F at 127, picture on the four)
  turn: 132, // head follows the eyes: the stare
  freeze: 133, // the world greys out; the two zoom rects expand from the screen (133-134, SCRIPT §3.3)
  dialog: 135, // 3.2: alert fully open (T04 reads f135-165)
  ptrIn: 146, // a stranger's pointer slides in from frame-right (146-149), lands on Cancel for 150
  cancel: 150, // 3.3: the stranger clicks Cancel. nothing.
  ok: 165, // 3.4: the kid clicks OK
  collapse: 166, // dialog zooms shut into the line's tip (166-167)
  // ---- render front up to 2008 (EARLYWEB16)
  fire: 168, // the line fires; front sweeps left->right, 12 frames
  frontFrames: 12,
  // ---- 2008
  y08: 180, // 4.1: first collar pops
  pop2: 190, // second collar pops on the hook's swung F (f190; the SFX doubles it on C5)
  take: 190, // he takes the clicker
  // ---- 2014
  y14: 195, // 4.2: hard cut on the brass stab
  repop: 205, // collars re-pop over the hoodie on the hook's F (f205, F5)
  seat: 210, // 4.3: he lands on the throne
  crownGo: 205, // the crown leaves LUAP's hand with the re-pop (path drawn from 199)
  crownLand: 217, // the crown lands (kept 3 frames ahead of the A-flat at 220: the whip into the cut starts on 220)
  glint: 218, // the glint grows on the crown; the pan into the cut starts on 219
  // ---- 2015
  whip: 225, // 4.4: the glint flares, 5-frame whip
  y15: 230, // land on the candle; the candle's light re-renders the room in BASE (radial front)
  frontEnd: 239,
} as const;

/** Beat hits in this span (for the timing check + the sound sketch). */
export const BEATS = [120, 135, 150, 165, 180, 195, 210, 225];
