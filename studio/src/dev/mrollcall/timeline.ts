// MR. MAS — mrollcall: "THE PLAYERS" roll call, intro frames 480-539 (bar 9, 20.0-22.5 s).
// Every time constant here is a GLOBAL intro frame on the 96 BPM / 24 fps grid (src/shared/timing.ts:
// 15 frames per beat, so an eighth note is 7.5 frames). The composition runs LOCAL frames 0..59;
// `g = local + MR.from`. Mount it in the full intro with <MRollcallSequence/> (Rollcall.tsx), or
// <Sequence from={MR.from} durationInFrames={MR.frames}><MRollcall/></Sequence>.
import {FRAMES_PER_BEAT, at} from '../../shared/timing';

export const MR = {from: at(9, 1), to: at(10, 1) - 1, frames: at(10, 1) - at(9, 1)} as const; // 480..539, 60 frames
export const toGlobal = (local: number) => local + MR.from;
export const toLocal = (global: number) => global - MR.from;

/** 7.5 frames: the eighth note. */
export const EIGHTH = FRAMES_PER_BEAT / 2;

/**
 * SNAPPING RULE (one rule, no exceptions): flash n (0-based) cuts in on floor(480 + n * 7.5).
 * On-beat eighths land exactly (480, 495, 510, 525); off-beat eighths fall on the half frame and are
 * floored, so the picture cuts half a frame AHEAD of the stab, never behind it (editors cut a hit on or
 * just before the transient). Result: 480 487 495 502 510 517 525 532, lengths 7 8 7 8 7 8 7 8.
 */
export const CUTS = Array.from({length: 8}, (_, n) => Math.floor(MR.from + n * EIGHTH));
export const cutLen = (n: number) => (n < 7 ? CUTS[n + 1] : MR.to + 1) - CUTS[n];

/** The knee motif, one note per flash, and its height above the root in semitones. */
export const MOTIF = [
  {note: 'F', semi: 0}, {note: 'F', semi: 0}, {note: 'F', semi: 0}, {note: 'F', semi: 0},
  {note: 'G', semi: 2}, {note: 'Ab', semi: 3}, {note: 'C', semi: 7}, {note: 'F', semi: 12},
] as const;

export type PlayerId = 'tasya' | 'radnus' | 'kram' | 'nesnej' | 'rima' | 'whale' | 'rumpt' | 'cursor';
export const ORDER: PlayerId[] = ['tasya', 'radnus', 'kram', 'nesnej', 'rima', 'whale', 'rumpt', 'cursor'];

/** Which flash is on screen at global frame g, and k = frames since its cut. */
export const flashAt = (g: number) => {
  let n = 0;
  for (let i = 0; i < CUTS.length; i++) if (g >= CUTS[i]) n = i;
  return {n, id: ORDER[n], k: g - CUTS[n], len: cutLen(n)};
};

/**
 * THE PORTRAITS RIDE THE CURVE (SCRIPT v2.1 §3.7). One window size for all eight (112x136 inner, the name-card
 * portrait size, about 12% of the frame: under the 25%-area flash threshold), one steady dusk surround, and a cyan
 * thread drawn ON the surround: flat at y 236 under flashes 1-4, then 220, 196, 164, 128 and off the top. Each window
 * sits on its step of the thread (its frame's bottom edge on the line). Hard cut on every eighth; nothing grows,
 * nothing slides, and the cursor window holds to f539 (hard cut to the skyline at f540: no pull-back).
 */
export const WIN_W = 112, WIN_H = 136;
/** the thread's height under each window (native y), the knee in whole-pixel stair steps */
export const THREAD_Y = [236, 236, 236, 236, 220, 196, 164, 128] as const;
/** window x per flash (SCRIPT §3.7 table) */
export const WIN_X = [16, 64, 112, 160, 208, 256, 304, 352] as const;
/** the panel's bevel is 3 px outside the inner rect: the frame's bottom edge sits on the thread */
export const WINDOWS = MOTIF.map((_, n) => ({w: WIN_W, h: WIN_H, x: WIN_X[n], y: THREAD_Y[n] - WIN_H - 3}));
/** the knee: from the frame's left edge, flat to the leap, then up in whole-pixel stairs, and off the top past the
 *  last window (like the you-are-here dot at f89). Segments [x0, x1, y] (inclusive). */
export const THREAD: Array<[number, number, number]> = [
  [0, WIN_X[4] - 1, THREAD_Y[0]],
  [WIN_X[4], WIN_X[5] - 1, THREAD_Y[4]],
  [WIN_X[5], WIN_X[6] - 1, THREAD_Y[5]],
  [WIN_X[6], WIN_X[7] - 1, THREAD_Y[6]],
  [WIN_X[7], WIN_X[7] + WIN_W + 5, THREAD_Y[7]],
];
/** the final riser: straight up the frame from the end of the last step */
export const THREAD_RISE_X = WIN_X[7] + WIN_W + 6;
/** how far the thread has drawn by flash n (it draws left to right with the windows; the whole knee is up by f532) */
export const threadReach = (n: number) => (n >= 7 ? 480 : WIN_X[n] + WIN_W + 3);

/** (retired) the cursor window's pull-back onto the dusk: the window now holds to f539 and the cut is hard. */
export const HANDOFF = {t0: 540, frames: 0} as const;
