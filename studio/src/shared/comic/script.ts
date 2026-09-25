/**
 * THE PAGE + THE TIMELINE (builder: comic). One landscape album page, 7 panels, and the guided-view
 * camera that travels it. All beat timings live here.
 */
import type {Plate} from './print';
import {clamp, easeInOut, lerp, hash, noise1} from './geo';

export const FPS = 24;
export const SCENE_FRAMES = 120;

export const PAGE = {w: 3160, h: 2760};

export type PanelId = 'p1' | 'p2' | 'p3' | 'p4a' | 'p4b' | 'p4c' | 'p5';
export interface PanelDef {
  id: PanelId;
  x: number;
  y: number;
  w: number;
  h: number;
  /** frame the panel prints in (before: blue-line pencils) */
  printAt: number;
  /** spot plates used */
  spots: Plate[];
}

export const PANELS: PanelDef[] = [
  {id: 'p1', x: 150, y: 150, w: 1830, h: 820, printAt: -99, spots: ['c', 'r']},
  {id: 'p2', x: 2024, y: 150, w: 986, h: 820, printAt: 25, spots: ['r']},
  {id: 'p3', x: 150, y: 1014, w: 1380, h: 900, printAt: 49, spots: ['c', 'r']},
  {id: 'p4a', x: 1574, y: 1014, w: 460, h: 900, printAt: 85, spots: ['c']},
  {id: 'p4b', x: 2062, y: 1014, w: 460, h: 900, printAt: 92, spots: ['c']},
  {id: 'p4c', x: 2550, y: 1014, w: 460, h: 900, printAt: 99, spots: ['c']},
  {id: 'p5', x: 150, y: 1958, w: 2860, h: 652, printAt: 107, spots: ['c', 'r']},
];
export const panel = (id: PanelId) => PANELS.find((p) => p.id === id)!;

// ------------------------------------------------------------------------------------------------ beats
export const T = {
  // P1 — the lab
  cap1: 2,
  cap2: 9,
  typeEnd: 23,
  feet: 15,
  // P2 — the door
  bam: 24,
  burst: 26,
  stride: 31,
  land: 42,
  // P3 — the name
  balloon3: 51,
  words: [52, 55, 58, 60, 63, 66] as number[],
  speechEnd: 78,
  jabs: [55, 66, 73] as number[],
  // P4 — the reaction
  eyesSlide: 88,
  turn: 93,
  blink: 97,
  smile: 101,
  superAt: 102,
  // P5 — the button
  cut: 107,
  slam: 108,
  card: 111,
};

/** Mouth track for Nole's line, "I came up with the name!" (replacement shapes). */
export const noleMouth = (f: number): 'rest' | 'open' | 'grin' | 'smirk' => {
  const keys: [number, 'rest' | 'open' | 'grin' | 'smirk'][] = [
    [0, 'rest'],
    [51, 'grin'], // I
    [53, 'open'],
    [55, 'open'], // CAME
    [57, 'grin'],
    [58, 'open'], // UP
    [60, 'rest'], // WITH (w)
    [61, 'grin'],
    [63, 'open'], // THE
    [64, 'grin'],
    [66, 'open'], // NAME
    [69, 'open'],
    [71, 'grin'],
    [74, 'open'], // !
    [77, 'grin'],
    [80, 'grin'],
  ];
  let m: 'rest' | 'open' | 'grin' | 'smirk' = 'rest';
  for (const [k, v] of keys) if (f >= k) m = v;
  return m;
};

// ------------------------------------------------------------------------------------------------ camera
export interface Cam {
  cx: number;
  cy: number;
  /** px per page unit at 1920 wide */
  z: number;
}
type Key = [number, number, number, number]; // frame, cx, cy, z
const KEYS: Key[] = [
  [0, 1050, 566, 0.985],
  [21, 1092, 560, 1.005],
  [29, 2268, 566, 1.1],
  [46, 2286, 580, 1.13],
  [55, 925, 1462, 1.05],
  [83, 952, 1452, 1.1],
  [91, 2292, 1462, 1.135],
  [106, 2292, 1468, 1.165],
];
const CUT_KEYS: Key[] = [
  [107, 1420, 2190, 0.975],
  [120, 1432, 2196, 0.99],
];
const clampCam = (c: Cam): Cam => {
  const vw = 1920 / c.z;
  const vh = 1080 / c.z;
  return {cx: clamp(c.cx, vw / 2, PAGE.w - vw / 2), cy: clamp(c.cy, vh / 2, PAGE.h - vh / 2), z: c.z};
};
const along = (keys: Key[], f: number): Cam => {
  if (f <= keys[0][0]) return {cx: keys[0][1], cy: keys[0][2], z: keys[0][3]};
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (f <= b[0]) {
      const t = (f - a[0]) / (b[0] - a[0]);
      // big travels ease in/out hard (a guided-view glide); holds drift linearly
      const travel = Math.hypot(b[1] - a[1], b[2] - a[2]) > 200;
      const e = travel ? easeInOut(t) : t;
      // zoom dips during travel so the glide reads as a move across the page
      const dip = travel ? Math.sin(Math.PI * t) * 0.09 : 0;
      return {cx: lerp(a[1], b[1], e), cy: lerp(a[2], b[2], e), z: lerp(a[3], b[3], e) * (1 - dip)};
    }
  }
  const l = keys[keys.length - 1];
  return {cx: l[1], cy: l[2], z: l[3]};
};

/** Button jolt: decaying screen shake (px) + plate misregistration (units). */
export const jolt = (f: number) => {
  const t = f - T.slam;
  if (t < 0 || t > 7) return {x: 0, y: 0, a: 0};
  const k = Math.exp(-t * 0.55) * (t < 1 ? 1 : 1);
  return {x: (hash(t * 3.1) - 0.5) * 2 * 26 * k, y: (hash(t * 7.7 + 2) - 0.5) * 2 * 18 * k, a: k};
};

export const camAt = (f: number): Cam => {
  const c = f >= T.cut ? along(CUT_KEYS, f) : along(KEYS, f);
  // handheld-free "guided view": tiny breathing drift so holds never freeze dead
  const br = noise1(f / 30, 3) * 3;
  return clampCam({cx: c.cx + br, cy: c.cy + noise1(f / 34, 5) * 2, z: c.z});
};

/** Plate misregistration offsets (page units) for a plate at a frame (constant slight trap + jolt). */
export const misreg = (plate: Plate, f: number, seed = 0): [number, number] => {
  const base: Record<Plate, [number, number]> = {k: [0, 0], c: [1.6, -1.1], r: [-1.3, 1.4]};
  const j = jolt(f);
  if (!j.a) return base[plate];
  const t = f - T.slam;
  const s = plate === 'k' ? 0.5 : 1;
  return [base[plate][0] + (hash(t * 5.3 + seed + plate.charCodeAt(0)) - 0.5) * 2 * 22 * j.a * s, base[plate][1] + (hash(t * 9.1 + seed * 3 + plate.charCodeAt(0)) - 0.5) * 2 * 16 * j.a * s];
};
