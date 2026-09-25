// SCREENLIFE structure: timing grid + tiny deterministic animation helpers (owned by the 'screen' builder).
import {Easing, interpolate} from 'remotion';

export const W = 1920;
export const H = 1080;
export const FPS = 24;
export const SCENE_FRAMES = 120;

/** Beat sheet (frames @24fps). Everything keys off these so re-timing is one edit. */
export const T = {
  leak: 21, // orange light leak on the right edge (anticipation)
  slam: 24, // call takeover hits
  land: 30, // call window lands
  connect: 31, // Nole's feed connects
  burst: 33, // Nole lunges into his own frame
  settle: 42,
  lean: 46, // lean-in starts
  speech: 50,
  speechEnd: 79,
  whip: 80, // camera whip to Mas
  whipEnd: 86,
  eyeDart: 88,
  turn0: 89,
  turn1: 103,
  click: 86,
  type1: 87, // "Super!" (full at 92, held 5 frames)
  del: 97, // hold backspace
  type2: 100, // "super."
  blink: 98,
  smile: 102,
  send: 105, // "super." holds alone for 3 frames
  slamIn: 108, // Nole's reply falls in
  impact: 110, // button: everything jolts except the water
} as const;

export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, x: number) => clamp((x - a) / (b - a));

const ease = {
  io: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  whip: Easing.bezier(0.8, 0, 0.1, 1),
};
export const E = ease;

/** Clamped interpolate with easing. */
export const tw = (f: number, a: number, b: number, from: number, to: number, e: (t: number) => number = ease.io) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** Keyframe track: [[frame, value], ...] with per-segment ease. */
export const track = (f: number, keys: [number, number][], e: (t: number) => number = ease.io) => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i][0]) {
      const [f0, v0] = keys[i - 1];
      const [f1, v1] = keys[i];
      return lerp(v0, v1, e((f - f0) / (f1 - f0)));
    }
  }
  return keys[keys.length - 1][1];
};

/** Damped spring response to a unit step at frame `at` (0 before, ->1 after, with overshoot). */
export const springStep = (f: number, at: number, stiffness = 0.55, damping = 0.22) => {
  const t = f - at;
  if (t <= 0) return 0;
  const w = Math.sqrt(stiffness) * 1.25;
  const z = damping;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
};

/** Damped ring (impulse response), 0 before `at`. amp at t=0 is 0; peaks after ~a quarter period. */
export const ring = (f: number, at: number, freq = 0.33, decay = 5, phase = 0) => {
  const t = f - at;
  if (t < 0) return 0;
  return Math.exp(-t / decay) * Math.sin(t * freq * Math.PI * 2 + phase);
};

/** Deterministic hash noise in -1..1. */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};
/** Smooth value noise in -1..1. */
export const noise1 = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const t = x - i;
  const u = t * t * (3 - 2 * t);
  return lerp(hash(i + seed * 57.3), hash(i + 1 + seed * 57.3), u);
};

/** Characters are animated on twos (12 fps video feel) while the UI runs on ones. */
export const twos = (f: number) => Math.floor(f / 2) * 2;
