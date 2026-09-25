// Single source of truth for the intro's beat grid.
// 96 BPM at 24 fps = 15 frames per beat, 60 per 4/4 bar, 12 bars = 720 frames = 30.0 s.
export const FPS = 24;
export const BPM = 96;
export const FRAMES_PER_BEAT = (FPS * 60) / BPM; // 15
export const BEATS_PER_BAR = 4;
export const FRAMES_PER_BAR = FRAMES_PER_BEAT * BEATS_PER_BAR; // 60
export const INTRO_BARS = 12;
export const INTRO_FRAMES = FRAMES_PER_BAR * INTRO_BARS; // 720

/** Frame of bar.beat, both 1-based (bar 1 beat 1 = frame 0). */
export const at = (bar: number, beat = 1): number =>
  (bar - 1) * FRAMES_PER_BAR + (beat - 1) * FRAMES_PER_BEAT;

/** Absolute beat index (1-based) to frame. */
export const beat = (n: number): number => (n - 1) * FRAMES_PER_BEAT;
