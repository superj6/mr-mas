// ANIME SCENE (key: animescene) — beat sheet + deterministic timing helpers. Owned by the animescene builder.
import {Easing, interpolate} from 'remotion';
import {prng} from '../ink';

export const FPS = 24;
export const SCENE_FRAMES = 120;

/**
 * Cut list (e-konte). TV-anime split: character drawings on 2s (holds + a few key drawings), camera,
 * light, dust and speed lines on 1s. Every number in the scene keys off this table.
 */
export const CUTS = [
  {id: 'C1', from: 0, to: 24, name: 'WIDE · PAN (multiplane)'},
  {id: 'C2', from: 24, to: 36, name: 'DOOR · low angle hold'},
  {id: 'C3', from: 36, to: 48, name: 'WIDE · Nole slides in'},
  {id: 'C4', from: 48, to: 84, name: 'NOLE B.C.U. · focus lines'},
  {id: 'C5', from: 84, to: 108, name: 'MAS C.U. · slow T.U. to eyes'},
  {id: 'C6', from: 108, to: 120, name: 'WIDE · button (bank of C3)'},
] as const;
export type CutId = (typeof CUTS)[number]['id'];
export const cutAt = (f: number) => CUTS.find((c) => f >= c.from && f < c.to) ?? CUTS[CUTS.length - 1];

export const on2s = (f: number) => Math.floor(f / 2) * 2;
export const on3s = (f: number) => Math.floor(f / 3) * 3;
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const E = {
  io: Easing.bezier(0.65, 0, 0.35, 1),
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  soft: Easing.bezier(0.33, 0, 0.2, 1),
};

/** Clamped tween. */
export const tw = (f: number, a: number, b: number, from: number, to: number, e: (t: number) => number = E.io) =>
  interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

/** Keyframe track [[frame, value], ...]. */
export const track = (f: number, keys: [number, number][], e: (t: number) => number = E.io) => {
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

/** Stepped (held) track: value of the last key at or before f. For drawings/poses. */
export function hold<T>(f: number, keys: [number, T][]): T {
  let v = keys[0][1];
  for (const [k, val] of keys) if (f >= k) v = val;
  return v;
}

/**
 * Anime camera shake ("gata-gata"): alternating hard jumps on 1s, decaying. Deterministic.
 * Returns [dx, dy] in px.
 */
export const shake = (f: number, f0: number, amp: number, dur = 8, seed = 1): [number, number] => {
  const t = f - f0;
  if (t < 0 || t >= dur) return [0, 0];
  const r = prng(seed * 977 + t * 31);
  const d = Math.pow(1 - t / dur, 1.6);
  const sx = t % 2 === 0 ? 1 : -1;
  return [sx * amp * d * (0.55 + 0.45 * r()), (r() - 0.5) * 2 * amp * d * 0.8];
};

/** Monitor flicker on 1s (dips on a few placed frames + a low hum). */
export const monitorFlicker = (f: number) => {
  const dip: Record<number, number> = {9: 0.8, 10: 0.92, 61: 0.86, 62: 0.95, 93: 0.82, 94: 0.9, 109: 0.55, 110: 0.72, 111: 0.9};
  return (dip[f] ?? 1) + 0.03 * Math.sin(f * 1.7) + 0.018 * Math.sin(f * 4.3);
};

/**
 * Damped spring on an impulse list [[frame, kick], ...] (hair lag, cowlick boing). Integrated from 0 so
 * it's deterministic per frame. Evaluate on 2s for drawings.
 */
export const spring = (f: number, kicks: [number, number][], k = 0.2, damp = 0.24) => {
  let x = 0;
  let v = 0;
  for (let t = 0; t <= f; t++) {
    for (const [kf, kv] of kicks) if (kf === t) v += kv;
    v += -k * x - damp * v;
    x += v;
  }
  return x;
};

/** Standard 4-frame blink starting at f0 (0.55, 1, 1, 0.5). */
export const blink = (f: number, f0: number, base: number) => {
  const seq = [0.55, 1, 1, 0.5];
  const i = f - f0;
  return i >= 0 && i < 4 ? seq[i] : base;
};
