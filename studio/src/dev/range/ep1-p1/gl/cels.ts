// MR. MAS — range E1-P1 (1.A): the clay's exposure sheet. Pure (no GL): shared by the cel renderer (Cels.tsx), the
// clip (P1.tsx), the pixel frame (pixel.ts, via clayAt) and the Node tools.
// Claymation's rules for the whole stretch: every move on 2s (a new drawing on even frames only); the mouths are
// three REPLACEMENT mouths, never morphs; the surface "boils" through four replacement surfaces on 2s in a hashed
// order (never the same one twice running, no period), the thumbprints and the tool drag pinned; the potter's wheel
// in its chest turns one eighth a drawing (1.5 turns a second).
// Round 5: the hold is a MOVING hold, the way a stop-motion animator keeps a puppet alive: it breathes (a slow lean
// and chest swell at an uneven rate, a few millimetres), and it acts on the scene's beats in small eased moves
// (it looks where Mario looks, cocks its head for "Addendum.", nods along while he writes, follows the scroll
// across the floor, turns back and grins at the empty spindle). Between moves it holds.
import {LINES, T, FRAMES, B} from '../timeline';

export interface Pose {
  /** forward bend at the hips (rad, + = bowing toward its front) */ lean: number;
  /** extra nod at the neck (rad, + = down) */ nod: number;
  /** head roll toward Mario (rad) */ tilt: number;
  /** the clipboard arm's lift (rad) */ arm: number;
  /** head turn at the neck (rad, + = toward its left, i.e. toward Mario; - = toward the split line) */ turn?: number;
  /** chest swell (-1..1, a breath) */ breath?: number;
  /** round 6: the whole puppet's turn on its tie-down (rad, added to the camera yaw; - = square to the lens) */ body?: number;
}
export const POSES: Record<string, Pose> = {
  up: {lean: 0, nod: 0, tilt: 0, arm: 0},
  antic: {lean: -0.07, nod: -0.06, tilt: 0.02, arm: 0.04},
  down1: {lean: 0.3, nod: 0.12, tilt: 0.03, arm: 0.06},
  down: {lean: 0.52, nod: 0.2, tilt: 0.04, arm: 0.08},
  down2: {lean: 0.49, nod: 0.18, tilt: 0.05, arm: 0.08},
  rise1: {lean: 0.34, nod: 0.0, tilt: 0.07, arm: 0.07, body: -0.06},
  rise2: {lean: 0.17, nod: -0.08, tilt: 0.1, arm: 0.06, body: -0.18},
  /** Round 6: the bow's button is a PRESENTATION: it straightens up and squares to the lens like a product on its
   *  launch plinth, the face lifted, the head a touch toward Mario (round 5 held the bow hunched and turned 3/4 away,
   *  so the new medium's star showed us its back and its face didn't read at phone size) */
  hold: {lean: 0.03, nod: -0.1, tilt: 0.12, arm: 0.05, turn: 0.14, body: -0.34},
  /** looking where Mario looks: up and across to the split line (the same day) */
  lookSplit: {lean: 0.02, nod: -0.2, tilt: 0.0, arm: 0.05, turn: -0.38, body: -0.34},
  /** back on Mario for "Addendum.", the head cocked */
  attend: {lean: 0.06, nod: -0.1, tilt: 0.22, arm: 0.05, turn: 0.36, body: -0.34},
  /** the nod's down key (agreeing with whatever he writes) */
  nodDown: {lean: 0.1, nod: 0.07, tilt: 0.18, arm: 0.06, turn: 0.32, body: -0.34},
  /** following the scroll along the floor toward the split line */
  watch: {lean: 0.08, nod: 0.15, tilt: 0.04, arm: 0.06, turn: -0.34, body: -0.34},
  /** the button: back to Mario at his empty spindle, square to us, grinning */
  beam: {lean: 0.04, nod: -0.12, tilt: 0.1, arm: 0.05, turn: 0.28, body: -0.3},
};
const KEY_NAMES = Object.keys(POSES);

export type Mode = 'lit' | 'night' | 'id';
export interface Cel { pose: string; pz?: Pose; mouth: 0 | 1 | 2; surface: 0 | 1 | 2 | 3; wheel: number; mode: Mode; lid?: 0 | 1 | 2 }
const r3 = (v: number | undefined) => Math.round((v ?? 0) * 1000);
export const celKey = (c: Cel) => {
  const p = c.pz;
  const pk = p ? `${r3(p.lean)},${r3(p.nod)},${r3(p.tilt)},${r3(p.arm)},${r3(p.turn)},${r3(p.breath)},${r3(p.body)}` : '';
  return `${c.mode}:${c.pose}:${pk}:${c.mouth}:${c.surface}:${c.wheel}:${c.lid ?? 0}`;
};

/** the blinks: replacement lids (1 half, 2 shut), half-shut-shut-half on 2s (8 f). An animator's blinks: on the
 *  head turns (p300, p486, p570) and one right after "Addendum." (the paperwork beat) */
export const BLINKS = [B(240), B(292), B(426), B(510)].map((b) => b - (b & 1));
const lidAt = (k: number): 0 | 1 | 2 => {
  for (const b of BLINKS) { const r = k - b; if (r >= 0 && r < 8) return r < 2 || r >= 6 ? 1 : 2; }
  return 0;
};

// ------------------------------------------------------------------ the bow, drawing by drawing (clip frames, on 2s)
const BOW: Array<[number, string]> = [
  [T.slam, 'up'], [T.slam + 4, 'antic'], [T.slam + 6, 'down1'], [T.press, 'down'], [T.press + 4, 'down2'],
  [T.press + 8, 'rise1'], [T.press + 12, 'rise2'],
];
/** round 6: from here the hold's moves take over (the first one is the turn to the lens, from rise2) */
export const HOLD_START = T.press + 14;
/** the moving hold: [from, to, key]. Each move eases (slow in, slow out) from wherever CLOD is to the key, on 2s */
export const MOVES: Array<[number, number, string]> = [
  [T.press + 14, T.press + 32, 'hold'], // round 6: it rises out of the bow and squares to us, finishing "...right!"
  [B(240), B(252), 'lookSplit'], // Mario looks up to the split line; CLOD looks where he looks
  [B(252), B(262), 'attend'], //    back to Mario for "Addendum.", head cocked
  [B(332), B(340), 'nodDown'], [B(340), B(348), 'attend'], // it nods along while he writes his line
  [B(362), B(370), 'nodDown'], [B(370), B(378), 'attend'],
  [B(426), B(450), 'watch'], //     it follows the scroll across the floor toward the split
  [B(510), B(524), 'beam'], //      and turns back to Mario, who is looking at the empty spindle
];
/** from here the closed smile is swapped for the grin (a replacement mouth): CLOD grins at Mario and the spindle */
export const GRIN_FROM = B(526);

const ease = (t: number) => t * t * (3 - 2 * t);
const lerpPose = (a: Pose, b: Pose, t: number): Pose => ({
  lean: a.lean + (b.lean - a.lean) * t, nod: a.nod + (b.nod - a.nod) * t, tilt: a.tilt + (b.tilt - a.tilt) * t,
  arm: a.arm + (b.arm - a.arm) * t, turn: (a.turn ?? 0) + ((b.turn ?? 0) - (a.turn ?? 0)) * t,
  body: (a.body ?? 0) + ((b.body ?? 0) - (a.body ?? 0)) * t,
});
/** the breath: an uneven slow cycle (each breath 64-88 f), fading in after the bow; -1..1 */
const BREATHS: number[] = (() => { const out = [0]; let t = 0, x = 0x2545f491; while (t < FRAMES + 200) { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0; t += 64 + (x % 25); out.push(t); } return out; })();
const breathAt = (k: number) => {
  if (k < HOLD_START) return 0;
  const t = k - HOLD_START + 20; // start mid-exhale
  let i = 0;
  while (BREATHS[i + 1] <= t) i++;
  const ph = (t - BREATHS[i]) / (BREATHS[i + 1] - BREATHS[i]);
  const fade = Math.min(1, (k - HOLD_START) / 24);
  return Math.sin(ph * Math.PI * 2) * fade;
};
/** the pose on drawing k (explicit numbers), and the name of the nearest key (for the pixel side's shadow) */
export const poseAt = (k: number): {pz: Pose; key: string} => {
  if (k < HOLD_START) { let p = 'up'; for (const [t, q] of BOW) if (k >= t) p = q; return {pz: {...POSES[p]}, key: p}; }
  let cur: Pose = {...POSES.rise2};
  for (const [a, b, key] of MOVES) {
    if (k >= b) cur = {...POSES[key]};
    else if (k >= a) cur = lerpPose(cur, POSES[key], ease((k - a) / (b - a)));
  }
  const br = breathAt(k);
  const pz: Pose = {...cur, lean: cur.lean + 0.014 * br, nod: cur.nod - 0.012 * br, breath: br};
  return {pz, key: nearestKey(pz, HOLD_KEYS)};
};
/** round 6: in the hold, a drawing's shadow comes from the nearest HOLD key (the bow's keys stand elsewhere) */
const HOLD_KEYS = ['hold', 'lookSplit', 'attend', 'nodDown', 'watch', 'beam'];
export const nearestKey = (p: Pose, keys: string[] = KEY_NAMES) => {
  let best = 'hold', bd = Infinity;
  for (const k of keys) {
    const q = POSES[k];
    const d = (p.lean - q.lean) ** 2 + (p.nod - q.nod) ** 2 + (p.tilt - q.tilt) ** 2 + ((p.turn ?? 0) - (q.turn ?? 0)) ** 2 + ((p.body ?? 0) - (q.body ?? 0)) ** 2;
    if (d < bd) { bd = d; best = k; }
  }
  return best;
};

// CLOD's mouth: the take's cues (tools/voice.py) mapped onto three replacement mouths: 0 closed smile, 1 the grin
// (E), 2 open (A, O). Filled in by setClodMouth; the default is the measured take (clod-right, 32 f).
let MOUTH: Array<[number, 0 | 1 | 2]> = [[0, 2], [4, 2], [6, 0], [8, 1], [12, 2], [15, 1], [22, 2], [28, 1], [30, 0]];
export const setClodMouth = (cues: Array<{f: number; shape: string}>) => {
  MOUTH = cues.map((q) => [q.f, (q.shape === 'A' || q.shape === 'O' ? 2 : q.shape === 'E' ? 1 : 0) as 0 | 1 | 2]);
};
const mouthAt = (k: number): 0 | 1 | 2 => {
  if (k >= GRIN_FROM) return 1;
  const r = k - LINES.right.at;
  if (r < 0 || r >= LINES.right.frames) return 0;
  let v: 0 | 1 | 2 = 0;
  for (const [t, s] of MOUTH) if (t <= r) v = s;
  return v;
};

/** the boil: a hashed sequence over 4 surfaces, never the same twice running (deterministic, no period) */
const SURF: number[] = (() => {
  const out: number[] = [];
  let prev = -1, x = 0x9e3779b9;
  for (let i = 0; i < 400; i++) {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
    let s = x % 3; // one of the three that aren't the last one
    const pool = [0, 1, 2, 3].filter((q) => q !== prev);
    s = pool[s];
    out.push(s);
    prev = s;
  }
  return out;
})();

/** the cel on frame f (null before the slam and after the cut) */
export const celAt = (f: number): Cel | null => {
  if (f < T.slam || f >= T.cut) return null;
  const k = f - (f & 1); // on 2s
  const d = (k - T.slam) >> 1; // drawing index
  const {pz, key} = poseAt(k);
  return {pose: key, pz, mouth: mouthAt(k), surface: SURF[d % SURF.length] as 0 | 1 | 2 | 3, wheel: d % 8, mode: 'lit', lid: lidAt(k)};
};
/** round 5 blended night twins into the first lit drawings (a dim clay CLOD before the light: "a pop, then a
 *  light"). Round 6 strikes the light instead (timeline.ts flashExpAt), so there are no twins */
export const nightTwinAt = (_f: number): Cel | null => null;

/** the night key for the pixel CLOD (phrase 1): the first key, unlit, the wheel in two held drawings */
export const NIGHT_CELS: Cel[] = [
  {pose: 'up', mouth: 0, surface: 0, wheel: 0, mode: 'night'}, {pose: 'up', mouth: 0, surface: 0, wheel: 4, mode: 'night'},
  {pose: 'up', mouth: 0, surface: 0, wheel: 0, mode: 'id'}, {pose: 'up', mouth: 0, surface: 0, wheel: 4, mode: 'id'},
];

/** every distinct cel the clip uses, in a stable order (the cel sequence's frames), plus the night/id keys */
export const CELS: Cel[] = (() => {
  const seen = new Map<string, Cel>();
  for (const c of NIGHT_CELS) seen.set(celKey(c), c);
  for (let f = 0; f < FRAMES; f++) {
    for (const c of [celAt(f), nightTwinAt(f)]) if (c && !seen.has(celKey(c))) seen.set(celKey(c), c);
  }
  return [...seen.values()];
})();
export const CEL_INDEX = new Map(CELS.map((c, i) => [celKey(c), i]));
export const celIndexAt = (f: number) => { const c = celAt(f); return c ? CEL_INDEX.get(celKey(c))! : -1; };
export const nightIndexAt = (f: number) => { const c = nightTwinAt(f); return c ? CEL_INDEX.get(celKey(c))! : -1; };

/** what the pixel frame needs to know: lit or not, the nearest key (its shadow), the light's level */
export const clayAt = (f: number) => { const c = celAt(f); return {lit: !!c, poseId: c ? c.pose : null}; };

// ------------------------------------------------------------------ the camera and the cel tile (output pixels)
/** the cel tile: a window of the 1920 x 1080 frame around CLOD (so every cel lands exactly where it was rendered) */
export const TILE = {x: 1116, y: 404, w: 400, h: 384};
