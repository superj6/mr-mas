// MR. MAS — range E1-P1 (1.A): the PIXEL frame, 480 x 270 (pure: shared by the Remotion clip and the Node preview).
// sc 11's [SPLIT] in Act Four's grammar (two 238 x 203 panes, a 4 px N0 divider at x 238-241): LEFT the bullpen as a
// demo stage, RIGHT the lighthouse; then sc 12's first shot, over Mas's shoulder at night. The verb band stays on
// screen and never moves, dimmed (the record's band), with the rail on its sentence line; round 5 steps its verbs and
// inventory out after the opening beat so the bottom quarter goes quiet and the eye stays on the panes.
// Everything here is the approved pixel engine (shared rooms and cast, read-only). New pixel art (the can-light, the
// plinth, the demo monitor and camera, the arms that hold things up, the leftward scroll, the night OTS) is drawn
// here in master-palette colours only. The clay is NOT drawn here: the clip composites it at output resolution on top
// of this frame (P1.tsx), and this frame supplies what the clay touches (the pool in rungs, the clay's shadow in rungs).
import {Buf, rect, line, poly, ellipse, bayer, hash, clamp} from '../../../shared/pixel/px';
import {PAL, stepColor, familyOf, oklab, ALL_COLORS} from '../../../shared/pixel/palette';
import {blitImg, Img} from '../../../shared/pixel/figure';
import {text, textWidth, bigText, bigTextWidth} from '../../../shared/pixel/font';
import {drawBullpen, walkoutExtra} from '../../../shared/pixel/rooms/bullpen';
import {drawLighthouse, LIGHTHOUSE, STAIR_STEPS} from '../../../shared/pixel/rooms/lighthouse';
import type {RoomOut} from '../../../shared/pixel/rooms/kit-b';
import {marioImg, MARIO_BASE, MARIO_FOOT, MARIO_W, MarioPose} from '../../../shared/pixel/cast/mario';
import {drawGergTable, GERG_DEFAULT, gergTypeAt} from '../../../shared/pixel/cast/gerg';
import {drawMasDesk, MAS_DESK_DEFAULT, masPortrait, MAS_PORTRAIT_DEFAULT} from '../../../shared/pixel/cast/mas';
import {drawBand} from '../p4/passes/band';
import {FRAMES, LINES, T, BEAT, BAND_FADE, STARTLE, lightAt} from './timeline';

export const RH = 203;
export const PANE_W = 238;
export const RX0 = 242; // right pane's first column
export const SX_L = 96; // bullpen crop (room x of the left pane's column 0)
export const SX_R = 64; // lighthouse crop (Act Four's S4.08 uses the same)

// ------------------------------------------------------------------ the right pane's layout (lighthouse room coords)
export const CLOD_AT = {x: 142, top: 176}; // the plinth's top centre: CLOD's feet
export const PLINTH = {rx: 20, ry: 3, h: 17};
export const CAN = {x: 92, foot: 214, headX: 98, headY: 62}; // a tall stand in the near left: its feet below the pane
export const MARIO_AT = {x: 250, foot: 197};
/** room coords -> frame coords (right pane) */
export const rToF = (x: number) => x - SX_R + RX0;

// ------------------------------------------------------------------ small helpers
const on2 = (f: number) => f - (f & 1);
const put = (b: Buf, x: number, y: number, c: number) => b.set(x, y, c);
/** 7px text with '…' (three dots) and curly quotes as plain quotes */
export const ptext = (b: Buf, s: string, x: number, y: number, col: number, shadow?: number) => {
  let cx = x;
  for (const ch of s) {
    if (ch === '…') { for (let k = 0; k < 3; k++) { if (shadow !== undefined) b.set(cx + k * 2 + 1, y + 7, shadow); b.set(cx + k * 2, y + 6, col); } cx += 7; continue; }
    const c2 = ch === '“' || ch === '”' ? '"' : ch === '’' ? "'" : ch;
    text(b, c2, cx, y, col, {shadow});
    cx += textWidth(c2) + (c2 === ' ' ? 0 : 1);
  }
  return cx - x;
};
export const ptextW = (s: string) => { let w = 0; for (const ch of s) { if (ch === '…') { w += 7; continue; } const c2 = ch === '“' || ch === '”' ? '"' : ch === '’' ? "'" : ch; w += textWidth(c2) + (c2 === ' ' ? 0 : 1); } return w; };

/** "one rung warmer": each master colour's nearest warm neighbour one step up (never red: R, Q and the reddest dusk
 *  rungs are excluded from the targets, so Mario's blue fleece goes toward a warm grey-violet, never toward red) */
const WARM_POOL = ALL_COLORS.filter((c) => { const f = familyOf(c); return f && !['R', 'Q', 'C', 'K', 'L', 'I'].includes(f[0]) && !(f[0] === 'U' && f[1] >= 4); });
const warmCache = new Map<string, number>();
export const warmStep = (c: number, k: number, amberBias = 1): number => {
  const key = `${c}:${k}:${amberBias}`;
  const hit = warmCache.get(key);
  if (hit !== undefined) return hit;
  const [L0, a0, b0] = oklab(c);
  const tL = L0 + 0.055 * k, ta = a0 * 0.55 + 0.035 * amberBias, tb = b0 * 0.45 + 0.06 * amberBias;
  let best = c, bd = Infinity;
  for (const p of WARM_POOL) {
    const [L, a, bb] = oklab(p);
    if (L < L0 - 0.01) continue; // a light never darkens
    const d = (L - tL) ** 2 * 3 + (a - ta) ** 2 + (bb - tb) ** 2;
    if (d < bd) { bd = d; best = p; }
  }
  warmCache.set(key, best);
  return best;
};

// ------------------------------------------------------------------ the pixel CLOD and the clay's shadow (generated)
/** Filled in by the clip / preview from gen/clod-px.json (built from the clay's first key, tools/pxclod.ts). */
export interface ClodPixel {
  /** the pixel CLOD's two held drawings (the wheel in two positions), frame coords of the image's top-left */
  frames: Img[]; x: number; y: number;
  /** per native pixel (frame coords), how many rungs the clay's contact shadow takes off, per pose id */
  shadow: Record<string, {x: number; y: number; w: number; h: number; k: number[]}>;
  /** round 5: the clay's coverage on the grid per key pose (frame coords), for its shadow on the back wall */
  cover?: Record<string, {x: number; y: number; w: number; h: number; a: Uint8Array}>;
}
let CLOD_PX: ClodPixel | null = null;
export const setClodPixel = (c: ClodPixel) => { CLOD_PX = c; };

/** what the clay does on frame f (P1.tsx looks the cel up from gl/cels.ts; here only: lit or not, and the pose id) */
export interface ClayState { lit: boolean; poseId: string | null }

// ------------------------------------------------------------------ the right pane: THE LIGHTHOUSE
/** the clay's shadow on frame coords (0 outside the tile): key rungs (0..3) and contact occlusion (0/1) */
const shadowAt = (poseId: string | null, fx: number, fy: number): [number, number] => {
  if (!poseId || !CLOD_PX) return [0, 0];
  const s = CLOD_PX.shadow[poseId];
  if (!s) return [0, 0];
  const i = fx - s.x, j = fy - s.y;
  if (i < 0 || j < 0 || i >= s.w || j >= s.h) return [0, 0];
  const v = s.k[j * s.w + i];
  return [v >> 1, v & 1];
};

// ------------------------------------------------------------------ the launch light, all in whole rungs
/** The can's tungsten ladder, by lightness: its light walks a colour up this ladder (warm, never red; W7 is the
 *  frame's ceiling, about 78 % luma, so the pop stays at or under 80 % white). */
const TUNG = [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.W3, PAL.W4, PAL.W5, PAL.W6, PAL.W7];
const TUNG_L = TUNG.map((c) => oklab(c)[0]);
const tungCache = new Map<number, number>();
const tungIdx = (c: number) => {
  let k = tungCache.get(c);
  if (k === undefined) { const L0 = oklab(c)[0]; k = 0; for (let i = 0; i < TUNG.length; i++) if (TUNG_L[i] <= L0 + 0.03) k = i; tungCache.set(c, k); }
  return k;
};
/** k rungs of the can's light on colour c: up the ladder, never darker than c, never past W7 */
const tung = (c: number, k: number) => {
  if (k <= 0) return c;
  const r = TUNG[Math.min(TUNG.length - 1, tungIdx(c) + k)];
  return oklab(r)[0] >= oklab(c)[0] - 0.005 ? r : c;
};

/** a knee-high stage plinth, turned and painted dark, its round top seen a little from above.
 *  Lit by the can (up and to the left): the side is a cylinder in crisp bands (the light, two half-tones, the core
 *  shadow, the pool's bounce on the far edge), the lip catching the can, its foot closing on the floor; the top a lit
 *  disc. The clay's shadow comes off in whole rungs. Unlit: the night rungs, the room's ambient on its left edge. */
const drawPlinth = (b: Buf, cx: number, top: number, lit: boolean, sh: (x: number, y: number) => [number, number], lv = 1) => {
  const dim = lv < 0.5 ? 3 : lv < 0.8 ? 2 : lv < 1 ? 1 : 0; // the filament's ramp, in rungs
  const {rx, ry, h} = PLINTH;
  const ryB = ry + 1; // the foot's ellipse is seen a little more from above than the top
  const Lx = -0.66, Lz = 0.75; // the can's direction, flattened onto the cylinder's section
  const SIDE_LIT = [PAL.N0, PAL.D0, PAL.D1, PAL.D2, PAL.D3, PAL.W3, PAL.W4, PAL.W5, PAL.W6];
  const SIDE_DARK = [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4, PAL.N5];
  for (let x = cx - rx; x <= cx + rx; x++) {
    const u = (x + 0.5 - cx) / (rx + 0.5);
    if (Math.abs(u) > 1) continue;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    const yT = top + Math.round(ry * s), yB = top + h + Math.round(ryB * s);
    const I = Math.max(0, Lx * u + Lz * s);
    for (let y = yT + 1; y <= yB; y++) {
      const r = y - yT; // rows under the lip
      const dz = (bayer(x, y) - 0.5) * 0.4; // the engine's ordered-dither seam between bands (round 5: thinner)
      if (lit) {
        // the light, the half-tones, the core shadow; the pool's bounce on the far edge (the reflected light)
        let lv = 1.6 + I * 3.9;
        if (u > 0.8) lv = Math.max(lv, 2.6 + (u - 0.8) * 3);
        let k = Math.floor(lv + dz * 0.8);
        if (r === 1) k = Math.round(1.6 + I * 5.2); // the lip catches the can
        else if (r === 3) k -= 2; // a turned groove...
        else if (r === 4) k += 1; // ...and its bead
        if (y >= yB - 1) k = y === yB ? 1 : k - 1; // the foot, closing on the floor
        const [ks, ao] = sh(x, y);
        k -= ks * 2 + ao + dim;
        b.set(x, y, SIDE_LIT[clamp(k, 0, 8)]);
      } else {
        let k = Math.floor((u < -0.7 ? 2.6 : 1.6 - u * 0.5) + dz * 0.8); // the room's ambient from the left
        if (r === 1) k += 1; else if (r === 3) k -= 1;
        if (y === yB) k = 0;
        b.set(x, y, SIDE_DARK[clamp(k, 0, 5)]);
      }
    }
  }
  // the top: a disc, its rim brighter toward the can
  ellipse(cx, top + 0.5, rx + 0.5, ry + 0.5, (x, y) => {
    const u = (x + 0.5 - cx) / (rx + 0.5), v = (y - top) / (ry + 0.5);
    const rr = Math.hypot(u, v);
    if (lit) {
      let k = rr > 0.85 ? (u < 0.1 ? 8 : 6) : u < -0.25 ? 7 : 6;
      const [ks, ao] = sh(x, y);
      // the clay's shadow takes one rung a step here, not two: at two the top went to the desk's black behind it
      // and the far foot read as hovering over nothing; the contact rung under the feet stays
      k -= ks + ao + dim;
      b.set(x, y, SIDE_LIT[clamp(k, 0, 8)]);
    } else b.set(x, y, rr > 0.85 && u < 0.3 ? PAL.N5 : PAL.N4);
  });
};

/** The stage can-light: a PAR can on a tall stand, up and to the left of CLOD, tipped down at it. On: the lens at W7
 *  (the frame's ceiling), off: a dead grey. The slam: the head kicks one pixel on the clunk, two frames. */
const drawCanLight = (b: Buf, on: boolean, kick: boolean, lv = 1) => {
  const {x, foot} = CAN;
  const headX = CAN.headX, headY = CAN.headY + (kick ? 1 : 0);
  const st = on ? [PAL.N0, PAL.G0, PAL.G1, PAL.G3] : [PAL.N0, PAL.N0, PAL.N1, PAL.G0];
  // the tripod: three legs and a spreader
  line(x, foot - 24, x - 10, foot, b.ink(st[2])); line(x, foot - 24, x + 9, foot, b.ink(st[1])); line(x, foot - 24, x - 1, foot + 1, b.ink(st[1]));
  rect(x - 6, foot - 11, 12, 1, b.ink(st[1]));
  b.set(x - 10, foot, st[3]); b.set(x + 9, foot, st[3]);
  // the mast (two tubes, a clamp where they telescope)
  rect(x, CAN.headY + 10, 2, foot - 24 - CAN.headY - 10, b.ink(st[2])); rect(x + 1, CAN.headY + 10, 1, foot - 24 - CAN.headY - 10, b.ink(st[1]));
  for (const cy of [CAN.headY + 46, CAN.headY + 86]) { rect(x - 1, cy, 4, 3, b.ink(st[3])); b.set(x + 3, cy + 1, st[2]); }
  // the yoke: a U from the mast top to the can's sides
  rect(x - 5, headY + 8, 12, 2, b.ink(st[2])); rect(x - 6, headY - 2, 2, 11, b.ink(st[2])); rect(x + 6, headY - 2, 2, 11, b.ink(st[1]));
  // the can: a drum tipped down to the right (back cap, ribbed body, the lens ring, the lens), and its barn door
  const can = [
    '.....oooooo..........',
    '...oo222222oo........',
    '..o2221111122oo......',
    '.o221111111111ooo....',
    'o2211111111111112o...',
    'o21111111111111122o..',
    'o211111111111111rrLo.',
    '.o11111111111111rLLLo',
    '.o1111111111111rLLLLo',
    '..o111111111111rLLLLo',
    '...oo1111111111rLLLo.',
    '.....ooo11111111rLo..',
    '........oooooooooo...',
  ];
  const pal: Record<string, number> = on
    ? {o: PAL.N0, '1': PAL.G1, '2': PAL.G3, r: PAL.G4, L: lv < 0.5 ? PAL.W4 : lv < 0.8 ? PAL.W5 : PAL.W6}
    : {o: PAL.N0, '1': PAL.N1, '2': PAL.G0, r: PAL.G1, L: PAL.N3};
  can.forEach((r, j) => [...r].forEach((ch, i) => { const c = pal[ch]; if (c !== undefined) b.set(headX - 12 + i, headY - 6 + j, c); }));
  for (const i of [3, 6, 9]) for (let j = 2; j < 10; j++) if (can[j][i] === '1') b.set(headX - 12 + i, headY - 6 + j, on ? PAL.G2 : PAL.N2);
  // the lens's hot centre: W7 (the ceiling), never W8
  if (on && lv >= 0.58) for (const [dx, dy] of [[6, 2], [5, 3], [6, 3], [7, 3], [6, 4]]) b.set(headX + dx, headY + dy, lv < 0.8 ? PAL.W6 : PAL.W7);
  // the barn door's top leaf, open over the lens
  line(headX + 4, headY - 5, headX + 10, headY - 1, b.ink(on ? PAL.G2 : PAL.N1));
  // the cable off the stand, along the floor, out of the pane
  for (let i = 0; i < 40; i++) b.set(x - 2 - i, foot + 1 + (i > 14 ? 1 : 0), on ? PAL.N1 : PAL.N0);
};

/** the lens (room coords): where the beam starts, and where the clay's key light sits (gl/CelRender.tsx) */
const LENS = () => ({x: CAN.headX + 6.5, y: CAN.headY + 3.5});
/** The pool on the floor: three rungs on the grid (outer +1, mid +2, core +3), a 1 px dithered seam between rungs */
const POOL = {cx: 156, cy: 196, rx: 50, ry: 7.5};
/** The spill: the cone's hit on the desk's front panel behind CLOD (outer +2, core +3), CLOD's shadow cut out of it */
const SPILL = {cx: 170, cy: 172, rx: 50, ry: 18};
const inEll = (x: number, y: number, cx: number, cy: number, rx: number, ry: number) => Math.hypot((x + 0.5 - cx) / rx, (y + 0.5 - cy) / ry);
const ringsAt = (x: number, y: number, e: {cx: number; cy: number; rx: number; ry: number}, rings: Array<[number, number]>, seam = 0.06) => {
  const d = inEll(x, y, e.cx, e.cy, e.rx, e.ry);
  let k = 0;
  for (const [r, kk] of rings) if (d < r - seam || (d < r && bayer(x, y) < (r - d) / seam)) k = kk;
  return k;
};
/** the key shadow's rungs: the umbra takes all the light, the penumbra all but one */
const cut = (k: number, ks: number) => (ks >= 2 ? 0 : ks === 1 ? Math.min(k, 1) : k);
/** the plinth's own shadow on the floor: its footprint swept away from the can (right, and back toward the desk) */
const plinthShadow = (x: number, y: number) => {
  const {rx, ry, h} = PLINTH, bx = CLOD_AT.x, by = CLOD_AT.top + h;
  for (let t = 0; t <= 1.0001; t += 0.25) if (inEll(x, y, bx + t * 6, by - t * 2.5, rx + 0.5, ry + 1.5) < 1) return true;
  return false;
};
/** a level (0..1, the filament's ramp) applied to whole rungs */
const atLv = (k: number, lv: number) => (k <= 0 ? 0 : Math.round(k * lv));
const warmPool = (b: Buf, floor: (x: number, y: number) => boolean, deskFront: (x: number, y: number) => boolean, sh: (x: number, y: number) => [number, number], lv: number) => {
  // round 5: hard rung edges (no ordered-dither seam): the seams read as speckle round the clay at full size
  for (let y = Math.floor(POOL.cy - POOL.ry) - 1; y <= POOL.cy + POOL.ry + 1; y++) for (let x = POOL.cx - POOL.rx - 1; x <= POOL.cx + POOL.rx + 1; x++) {
    if (!floor(x, y)) continue;
    const [ks, ao] = sh(x, y);
    const k = Math.max(0, atLv(cut(ringsAt(x, y, POOL, [[1.0, 2], [0.7, 3], [0.42, 4]], 0), plinthShadow(x, y) ? 2 : ks), lv) - ao);
    if (k) b.set(x, y, tung(b.get(x, y), k));
  }
  for (let y = SPILL.cy - SPILL.ry - 1; y <= SPILL.cy + SPILL.ry + 1; y++) for (let x = SPILL.cx - SPILL.rx - 1; x <= SPILL.cx + SPILL.rx + 1; x++) {
    if (!deskFront(x, y)) continue;
    const [ks] = sh(x, y);
    const k = atLv(cut(ringsAt(x, y, SPILL, [[1.0, 2], [0.6, 3]], 0), ks), lv);
    if (k) b.set(x, y, tung(b.get(x, y), k));
  }
};
/** round 5: where the cone lands behind CLOD. The rays that pass over its head carry on to the back wall, the stack
 *  and the phone on the desk: a hot spot in three rungs (the light visibly landing somewhere), with CLOD's own
 *  silhouette projected from the lens (x1.6, the wall's depth behind it) cut out of it */
const WALLSPOT = {cx: 168, cy: 128, rx: 36, ry: 22};
const WALL_S = 1.6;
const wallSpot = (b: Buf, back: (x: number, y: number) => boolean, lv: number, poseId: string | null) => {
  const {x: lx, y: ly} = LENS();
  const cov = poseId && CLOD_PX?.cover ? CLOD_PX.cover[poseId] : undefined;
  const covered = (rx: number, ry: number) => {
    if (!cov) return false;
    const fx = Math.floor(rx - SX_R + RX0) - cov.x, fy = Math.floor(ry) - cov.y;
    return fx >= 0 && fy >= 0 && fx < cov.w && fy < cov.h && cov.a[fy * cov.w + fx] === 1;
  };
  for (let y = WALLSPOT.cy - WALLSPOT.ry - 1; y <= WALLSPOT.cy + WALLSPOT.ry + 1; y++) for (let x = WALLSPOT.cx - WALLSPOT.rx - 1; x <= WALLSPOT.cx + WALLSPOT.rx + 1; x++) {
    if (!back(x, y)) continue;
    let k = ringsAt(x, y, WALLSPOT, [[1.0, 1], [0.62, 2], [0.3, 3]], 0);
    if (!k) continue;
    if (covered(lx + (x + 0.5 - lx) / WALL_S, ly + (y + 0.5 - ly) / WALL_S)) k = 0;
    k = atLv(k, lv);
    if (k) b.set(x, y, tung(b.get(x, y), k));
  }
};
/** the beam: the can's cone through the room's dust, aimed at CLOD (round 5: narrowed from the whole desk to CLOD
 *  and its plinth). Two rungs near the lens, one along the cone, gone by the time it reaches the figure: the lit
 *  surfaces carry the light from there. The end is a one-band checker taper, never a dither ramp. */
const coneRays = () => {
  const {x: ax, y: ay} = LENS();
  const e1 = [CLOD_AT.x - 27 - ax, POOL.cy + 2 - ay], e2 = [CLOD_AT.x + 34 - ax, LIGHTHOUSE.desk.back - 6 - ay];
  return {ax, ay, e1, e2, n1: Math.hypot(e1[0], e1[1]), n2: Math.hypot(e2[0], e2[1])};
};
const beam = (b: Buf, air: (x: number, y: number) => boolean, lv: number) => {
  const {ax, ay, e1, e2, n1, n2} = coneRays();
  const len = Math.max(n1, n2);
  for (let y = Math.floor(ay); y < RH; y++) for (let x = Math.floor(ax) - 2; x < CLOD_AT.x + 60; x++) {
    if (!air(x, y)) continue;
    const dx = x + 0.5 - ax, dy = y + 0.5 - ay;
    const s1 = (e1[0] * dy - e1[1] * dx) / n1, s2 = (e2[0] * dy - e2[1] * dx) / n2; // signed px from each edge
    if (s1 > 0 || s2 < 0) continue;
    const d = Math.hypot(dx, dy);
    if (d < 6) continue;
    const t = d / len;
    if (t > 0.66) continue;
    if (t > 0.54 && (x + y) % 2) continue; // the taper: one band of checker
    const k = atLv(d < 18 ? 2 : 1, lv);
    if (k) b.set(x, y, warmStep(b.get(x, y), k, 0.7));
  }
};
/** dust in the beam: eleven motes drifting on 2s, a pixel at a time, each at its own slow rate, catching the light
 *  now and then (the pane's only continuous motion besides the people; nothing in it repeats on a beat) */
const motes = (b: Buf, air: (x: number, y: number) => boolean, lv: number, f: number) => {
  if (lv < 0.8) return;
  const {ax, ay, e1, e2, n1, n2} = coneRays();
  const len = Math.max(n1, n2);
  const k = on2(f);
  for (let i = 0; i < 11; i++) {
    const sp = 0.55 + hash(i, 3, 41) * 0.9;
    let u = 0.16 + hash(i, 1, 41) * 0.44 + ((k * 0.00042 * sp) % 0.44);
    if (u > 0.6) u -= 0.44;
    const w = 0.5 + (hash(i, 2, 41) - 0.5) * 0.7 + 0.16 * Math.sin(k / (70 + i * 11) + i * 1.9);
    const dx = (e1[0] / n1) * (1 - w) + (e2[0] / n2) * w, dy = (e1[1] / n1) * (1 - w) + (e2[1] / n2) * w;
    const x = Math.floor(ax + dx * u * len), y = Math.floor(ay + dy * u * len);
    if (!air(x, y)) continue;
    const glint = hash(i, Math.floor((k + i * 17) / (30 + i * 4)), 43) > 0.55;
    b.set(x, y, glint ? PAL.P1 : warmStep(b.get(x, y), 3, 0.7));
  }
};
/** the stair's rope handrail read as a scratch across the brick ("a thin orange diagonal line"): off, in this pane */
const HANDRAIL: Array<[number, number]> = (() => {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < STAIR_STEPS.length - 1; i++) {
    const [xa, ya, wa] = STAIR_STEPS[i], [xb, yb, wb] = STAIR_STEPS[i + 1];
    line(xa + Math.floor(wa / 2) - 3, ya - 24, xb + Math.floor(wb / 2) - 3, yb - 24, (x, y) => { pts.push([x, y]); });
  }
  for (let i = 0; i < STAIR_STEPS.length; i++) if (i % 3 === 1) { const [x, y, w] = STAIR_STEPS[i]; for (let j = 0; j < 22; j++) pts.push([x - Math.floor(w / 2) + w - 3, y - 24 + j]); }
  return pts;
})();
const eraseRail = (R: Buf, room: RoomOut) => {
  const wall = room.masks.wall?.a;
  const isWall = (x: number, y: number) => !!wall && x >= 0 && y >= 0 && x < R.w && y < RH && wall[y * R.w + x] > 0;
  for (const [x, y] of HANDRAIL) {
    if (x < 0 || y < 0 || x >= R.w || y >= RH) continue;
    if (isWall(x, y - 1)) R.set(x, y, R.get(x, y - 1)); else if (isWall(x, y + 1)) R.set(x, y, R.get(x, y + 1));
    else if (isWall(x - 1, y)) R.set(x, y, R.get(x - 1, y)); else if (isWall(x + 1, y)) R.set(x, y, R.get(x + 1, y));
  }
};
/** the lighthouse's lamp held still for this scene (a fixed frame, 45 degrees round: no panel faces us, its sweep
 *  falls outside the pane). Turning, it stepped every 3 f and swept a patch of brick every 1.25 s, which read as a
 *  metronome glitch next to the clay's hold */
const LAMP_F = 15;

/** Mario's pose over the clip (on 2s): dictating (finger up), writing, looking up, reading the post, the spindle */
const MOUTH: Array<[number, 0 | 1 | 2]> = [];
export const setMouthTrack = (memo: Array<{f: number; shape: string}>, add: Array<{f: number; shape: string}>) => {
  MOUTH.length = 0;
  const m = (s: string): 0 | 1 | 2 => (s === 'A' || s === 'O' ? 2 : s === 'E' ? 1 : 0);
  for (const q of memo) MOUTH.push([LINES.memo.at + q.f, m(q.shape)]);
  MOUTH.push([LINES.memo.at + LINES.memo.frames, 0]);
  for (const q of add) MOUTH.push([LINES.addendum.at + q.f, m(q.shape)]);
  MOUTH.push([LINES.addendum.at + LINES.addendum.frames, 0]);
};
const mouthAt = (f: number): 0 | 1 | 2 => { let v: 0 | 1 | 2 = 0; for (const [t, s] of MOUTH) { if (t <= f) v = s; else break; } return v; };

export interface MarioState { pose: MarioPose; hand: [number, number]; scroll: 'trail' | 'write' | 'unroll' | 'spindle'; phone: boolean; dx: number }
export const marioAt = (f: number): MarioState => {
  const k = on2(f);
  const talking = (k >= LINES.memo.at && k < LINES.memo.at + LINES.memo.frames) || (k >= LINES.addendum.at && k < LINES.addendum.at + LINES.addendum.frames);
  let arm: MarioPose['arm'] = 'scroll', blink = false, brow: 0 | 1 = 0, scroll: MarioState['scroll'] = 'trail', phone = false, dx = 0;
  // phrase 1: "Memo, on race dynamics." finger up; "Point one:" finger up again; writing through the rest
  if (k < 58) arm = 'raise';
  else if (k < 64) arm = 'down';
  else if (k < 86) arm = 'raise2';
  else if (k < T.slam) { arm = 'scroll'; blink = k >= 90 && k < 150; scroll = 'write'; }
  else if (k < STARTLE[1]) {
    // round 5: the slam startles him: a squint into the light, a hand to his chest, a pixel back on the clunk
    arm = 'chest'; brow = 1; blink = k < T.slam + 4; dx = k < T.slam + 8 ? 1 : 0;
  } else if (k < T.lookUp1) { arm = 'scroll'; blink = false; brow = 1; } // ...then he watches it bow at him
  else if (k < T.lookUp2) { arm = 'scroll'; blink = false; }
  else if (k < T.phoneUp) { arm = k >= LINES.addendum.at - 4 ? 'raise' : 'scroll'; brow = 1; }
  else if (k < T.marioWrite[0]) { arm = 'chest'; phone = k >= T.marioPhone; blink = true; }
  else if (k < T.marioWrite[1]) { arm = 'scroll'; blink = true; scroll = 'write'; }
  else if (k < T.unroll) { arm = 'down'; }
  else if (k < T.spindle) { arm = 'scroll'; scroll = 'unroll'; brow = 1; }
  else { arm = 'raise'; scroll = 'spindle'; blink = true; brow = 1; }
  // a rare blink while talking
  if (!blink && (k % 96 === 40 || k % 96 === 42)) blink = true;
  const mouth = talking ? mouthAt(k) : 0;
  return {pose: {...MARIO_BASE, legs: 'stand', arm, scroll: true, mouth, brow, blink, light: 'lit'}, hand: [0, 0], scroll, phone, dx};
};

/** Mario is drawn flipped (facing screen-left, toward the split line and the pane beyond it: the script's facing) */
const MARIO_FOOT_F = MARIO_W - 1 - MARIO_FOOT[0];
const marioLeft = () => MARIO_AT.x - MARIO_FOOT_F;
const marioTop = () => MARIO_AT.foot - MARIO_FOOT[1];

/** the scroll, leftward: from the back hand down to the floor, then along the floor toward the split line.
 *  Round 5 (it read as "a ruler, a ladder or piano keys stuck to his leg", then "a progress bar or a cable"): paper
 *  first. The roll's ends show either side of his hand; the sheet is wider, hangs from his far hand BEHIND him,
 *  bellying back with the curl a scroll keeps, and turns onto the floor in a lip; the writing is ink-blue lines of uneven length with a
 *  margin, in paragraphs, never evenly spaced ticks; on the floor the sheet is seen edge-on, so the writing is only a
 *  faint mottle, it throws a shadow, and its leading end is a round roll. */
const SCROLL_Y = 199; // the floor line it runs along (in front of the plinth)
const PAPER_W = 8;
/** the belly of the hanging sheet (px toward screen-right, i.e. behind him: it hangs from his far hand at his back
 *  and swings back under his heels) at row j of a drop h */
const belly = (j: number, h: number) => Math.round(6 * Math.sin(Math.PI * Math.min(1, j / Math.max(1, h)) * 0.9));
/** handwriting on a hanging sheet: a line every 3 rows, a gap between paragraphs; lengths and starts hashed */
const inkRow = (j: number, seed: number): [number, number] | null => {
  if (j % 3 !== 1) return null;
  const line = Math.floor(j / 3);
  if (hash(line, 1, seed) < 0.16) return null; // a paragraph break
  const x0 = 1 + (hash(line, 2, seed) < 0.2 ? 1 : 0), len = 3 + Math.floor(hash(line, 3, seed) * 3.99);
  return [x0, Math.min(PAPER_W - 2, x0 + len)];
};
const drawRollEnds = (b: Buf, hx: number, hy: number) => {
  // a roll of paper crosswise in his fist: its two ends stick out either side of the hand
  for (const [x0, w] of [[hx - 6, 3], [hx + 3, 3]] as Array<[number, number]>) {
    rect(x0, hy - 1, w, 5, b.ink(PAL.N0));
    rect(x0 + (x0 < hx ? 1 : 0), hy, w - 1, 3, b.ink(PAL.P1));
    rect(x0 + (x0 < hx ? 1 : 0), hy, w - 1, 1, b.ink(PAL.P2));
  }
  b.set(hx - 6, hy + 1, PAL.D3); // the spindle's knob
};
const paperFloor = (b: Buf, xRight: number, xLeft: number, seed: number) => {
  for (let x = xLeft; x <= xRight; x++) {
    // a sheet a hand wide lying flat, seen a little from above: 5-6 rows (its far edge lifts here and there)
    const top = SCROLL_Y - 4 + (hash(Math.floor(x / 5), 5, seed) < 0.18 ? -1 : 0);
    for (let y = top; y <= SCROLL_Y; y++) {
      let c = y === top ? PAL.P2 : y === SCROLL_Y ? PAL.P0 : PAL.P1;
      if (y > top && y < SCROLL_Y && hash(x, y * 7, seed) < 0.16) c = PAL.P0; // the writing, edge-on: a faint mottle
      b.set(x, y, c);
    }
    b.set(x, SCROLL_Y + 1, stepColor(b.get(x, SCROLL_Y + 1), -2)); // its shadow on the floor
  }
};
const rollEnd = (b: Buf, x: number) => {
  // the leading roll, end-on: a round of paper with its spiral
  const y = SCROLL_Y - 6;
  const rows = ['.ooo.', 'o221o', 'o2p1o', 'o1p1o', 'o111o', 'o111o', '.ooo.'];
  const pal: Record<string, number> = {o: PAL.N0, '1': PAL.P1, '2': PAL.P2, p: PAL.P0};
  rows.forEach((r, j) => [...r].forEach((ch, i) => { if (pal[ch] !== undefined) b.set(x + i, y + j, pal[ch]); }));
  b.set(x + 5, SCROLL_Y + 1, stepColor(b.get(x + 5, SCROLL_Y + 1), -2));
};
const drawScrollLeft = (b: Buf, hx: number, hy: number, len: number, o: {roll?: boolean; seed?: number} = {}) => {
  const seed = o.seed ?? 3;
  const top = hy + 3;
  const drop = SCROLL_Y - 3 - top;
  const hang = Math.min(len, drop);
  for (let j = 0; j < hang; j++) {
    const off = belly(j, drop);
    const ink = inkRow(j, seed);
    for (let i = 0; i < PAPER_W; i++) {
      const x = hx - 4 + i + off, y = top + j;
      // lit from the can (screen-left): the left edge catches it, the right edge turns away
      let c = i === 0 ? PAL.P2 : i === PAPER_W - 1 ? PAL.N2 : i === PAPER_W - 2 ? PAL.P0 : PAL.P1;
      if (ink && i >= ink[0] && i < ink[1]) c = PAL.F3; // ink-blue, a step light: writing at a distance, not rungs
      b.set(x, y, c);
    }
  }
  drawRollEnds(b, hx, hy);
  const run = Math.max(0, len - drop);
  // the lip where it turns onto the floor
  const xl = hx - 4 + belly(drop, drop);
  if (len > drop) {
    for (let i = 0; i < PAPER_W; i++) { b.set(xl + i, SCROLL_Y - 3, PAL.P1); b.set(xl + i, SCROLL_Y - 2, i < 2 ? PAL.P2 : PAL.P0); }
    if (run > 0) paperFloor(b, xl + PAPER_W - 1, xl - run, seed);
    if (o.roll !== false && run > 0) rollEnd(b, xl - run - 5);
  }
};
/** Mario's phone (reading the post): a small dark slab with a cyan screen, at the chest hand */
const drawSmallPhone = (b: Buf, x: number, y: number) => { rect(x, y, 4, 6, b.ink(PAL.N0)); rect(x + 1, y + 1, 2, 4, b.ink(PAL.C5)); b.set(x + 1, y + 1, PAL.C7); };

/** the lighthouse pane: the room, the plinth and the can, CLOD (pixel until the slam), Mario, his scroll, the light */
export const drawRight = (R: Buf, f: number, clay: ClayState) => {
  const room = drawLighthouse(R, LAMP_F, {meters: 0, throne: 'on'});
  eraseRail(R, room);
  const lit = f >= T.slam;
  const lv = lightAt(f);
  // the clay's shadow, looked up in room coords (the shadow map is in frame coords)
  const sh = (x: number, y: number) => shadowAt(lit ? clay.poseId : null, x - SX_R + RX0, y);
  // the light (all in whole rungs, scaled by the filament's level): the hot spot where the cone lands on the back
  // wall and the desk behind CLOD, the beam through the air, the pool on the floor, the spill on the desk front; the
  // clay's key shadow and its contact occlusion come off them in rungs
  const mask = (name: string) => { const a = room.masks[name]?.a; return (x: number, y: number) => !!a && x >= 0 && y >= 0 && x < R.w && y < RH && a[y * R.w + x] > 0; };
  const onFloor = mask('floor');
  if (lit) {
    const onFurn = mask('furniture'), onWall = mask('wall'), onPaper = mask('paper'), onStair = mask('stair'), onDesk = mask('desk');
    const deskFront = (x: number, y: number) => x >= LIGHTHOUSE.desk.x0 && x <= LIGHTHOUSE.desk.x1 && y > LIGHTHOUSE.desk.front + 1 && y <= LIGHTHOUSE.desk.panel && onFurn(x, y);
    const inSpill = (x: number, y: number) => deskFront(x, y) && inEll(x, y, SPILL.cx, SPILL.cy, SPILL.rx, SPILL.ry) < 1;
    const back = (x: number, y: number) => y <= LIGHTHOUSE.desk.front + 1 && (onWall(x, y) || onPaper(x, y) || onStair(x, y) || onDesk(x, y) || onFurn(x, y));
    wallSpot(R, back, lv, clay.poseId);
    const air = (x: number, y: number) => y < RH && !onFloor(x, y) && !inSpill(x, y) && !(back(x, y) && inEll(x, y, WALLSPOT.cx, WALLSPOT.cy, WALLSPOT.rx, WALLSPOT.ry) < 1);
    beam(R, air, lv);
    warmPool(R, onFloor, deskFront, sh, lv);
    motes(R, air, lv, f);
  }
  const kick = f >= T.slam && f < T.slam + 2;
  drawCanLight(R, lit, kick, lv);
  drawPlinth(R, CLOD_AT.x, CLOD_AT.top, lit, sh, lv);
  // the pixel CLOD (before the slam): its two held drawings, the wheel turning
  if (!lit && CLOD_PX && CLOD_PX.frames.length) {
    const img = CLOD_PX.frames[Math.floor(f / 6) % CLOD_PX.frames.length];
    blitImg(R, img, CLOD_PX.x - RX0 + SX_R, CLOD_PX.y);
  } else if (!lit) {
    // stand-in until gen/clod-px.json exists (never in a delivered render: the build makes it first)
    ellipse(CLOD_AT.x, CLOD_AT.top - 30, 13, 30, R.ink(PAL.N1));
  }
  // Mario
  const m = marioAt(f);
  const img = marioImg(m.pose);
  const mx = marioLeft() + m.dx, my = marioTop();
  // his shadow from the can, thrown right along the floor from his feet (one rung, while the light is up)
  if (lv >= 0.5) {
    const fx = MARIO_AT.x + m.dx, fy = MARIO_AT.foot;
    for (let y = fy - 1; y <= fy + 2; y++) for (let x = fx + 1; x < fx + 22; x++) {
      if (!onFloor(x, y)) continue;
      if (inEll(x, y, fx + 10, fy + 0.5, 11, 2.2) < 1) R.set(x, y, stepColor(R.get(x, y), -1));
    }
  }
  // the scroll hangs from his FAR hand, so it's drawn behind him (in front of his near leg it read as a ruler
  // strapped to it): it shows between and in front of his legs, then runs along the floor. Hand: the flipped back hand
  const handX = mx + (MARIO_W - 1 - 25), handY = my + 45;
  if (m.scroll === 'trail' || m.scroll === 'write') drawScrollLeft(R, handX, handY, (SCROLL_Y - handY) + 18 + (f >= T.marioWrite[1] ? 6 : 0));
  else if (m.scroll === 'unroll') {
    // the second scroll: it unrolls along the floor toward the split line on 2s, whole pixels, and keeps going
    const k = on2(f) - T.unroll;
    const len = (SCROLL_Y - handY) + Math.floor(k * 3.2);
    drawScrollLeft(R, handX, handY, len, {roll: true, seed: 9});
  } else if (m.scroll === 'spindle') {
    // the empty spindle in his raised hand: a bare dowel (the paper is all in the other pane)
    const sx = mx + 16, sy = my + 22;
    rect(sx, sy, 2, 9, R.ink(PAL.D4)); R.set(sx, sy, PAL.W4); R.set(sx + 1, sy + 8, PAL.D2);
    // the sheet still lies along the floor, from his feet to the split line
    paperFloor(R, handX + 3, SX_R - 2, 9);
  }
  blitImg(R, img, mx, my, {flip: true});
  if (lit) {
    // round 5: his near side takes the can (amber, never red): two rungs on the edge facing it, one on the next
    // three columns (it was one rung on four, which nobody saw)
    const k2 = atLv(2, lv), k1 = atLv(1, lv);
    for (let j = 0; j < img.h; j++) {
      let n = 0;
      for (let i = 0; i < img.w && n < 5; i++) {
        const v = img.c[j * img.w + (img.w - 1 - i)];
        if (v < 0) continue;
        const k = n < 2 ? k2 : k1;
        const x = mx + i, y = my + j;
        if (k) R.set(x, y, warmStep(R.get(x, y), k, 1.2));
        n++;
      }
    }
  }
  if (m.phone) drawSmallPhone(R, mx + 18, my + 28);
  return m;
};

// ------------------------------------------------------------------ the left pane: THE BULLPEN as a demo stage
const DEMO = {x: 99, y: 62, w: 54, h: 40}; // the demo monitor's screen (room coords), on a rolling stand
const drawDemoScreen = (b: Buf, f: number) => {
  const {x, y, w, h} = DEMO;
  // bezel, stand, feet
  rect(x - 3, y - 3, w + 6, h + 6, b.ink(PAL.N0)); rect(x - 2, y - 2, w + 4, h + 4, b.ink(PAL.G1)); rect(x - 2, y - 2, w + 4, 1, b.ink(PAL.G3));
  rect(x + w / 2 - 1, y + h + 3, 3, 196 - (y + h + 3), b.ink(PAL.G1)); rect(x + w / 2 + 1, y + h + 3, 1, 196 - (y + h + 3), b.ink(PAL.N1));
  rect(x + w / 2 - 12, 196, 25, 2, b.ink(PAL.G2)); b.set(x + w / 2 - 12, 198, PAL.N0); b.set(x + w / 2 + 12, 198, PAL.N0);
  // the screen: before the snap, the demo's own blank chat; then the photo of the napkin; then the site in two drawings
  const scr = (c: number) => rect(x, y, w, h, b.ink(c));
  const napkin = (ox: number, oy: number, s: number) => {
    rect(ox, oy, 22 * s, 18 * s, b.ink(PAL.P2));
    rect(ox + 3 * s, oy + 3 * s, 16 * s, 3 * s, b.ink(PAL.N4)); // the header box (a pen line)
    rect(ox + 4 * s, oy + 4 * s, 14 * s, 1, b.ink(PAL.P2));
    rect(ox + 3 * s, oy + 8 * s, 9 * s, 1, b.ink(PAL.N4)); rect(ox + 3 * s, oy + 10 * s, 7 * s, 1, b.ink(PAL.N4));
    rect(ox + 13 * s, oy + 9 * s, 6 * s, 4 * s, b.ink(PAL.N4)); rect(ox + 14 * s, oy + 10 * s, 4 * s, 2 * s, b.ink(PAL.P2)); // the button
    // the stick-figure joke in the corner
    b.set(ox + 5 * s, oy + 13 * s, PAL.N4); rect(ox + 5 * s, oy + 14 * s, 1, 2 * s, b.ink(PAL.N4)); b.set(ox + 4 * s, oy + 15 * s, PAL.N4); b.set(ox + 6 * s, oy + 15 * s, PAL.N4);
  };
  const site = (k: number, memo = false) => {
    // a working website: a header bar, a headline, body lines, a button (k: 1 half-built, 2 working)
    scr(memo ? PAL.P1 : PAL.G6);
    rect(x, y, w, 7, b.ink(memo ? PAL.F3 : PAL.C4)); rect(x + 2, y + 2, 12, 3, b.ink(PAL.P2));
    for (let i = 0; i < 3; i++) b.set(x + w - 4 - i * 3, y + 3, PAL.P2);
    if (memo) {
      text(b, 'MEMO', x + 4, y + 9, PAL.F2);
      for (let j = 0; j < 4; j++) rect(x + 4, y + 19 + j * 3, w - 10 - (j % 2) * 8, 1, b.ink(PAL.N4));
    } else {
      rect(x + 4, y + 11, w - 20, 3, b.ink(PAL.N3));
      for (let j = 0; j < 3; j++) rect(x + 4, y + 17 + j * 3, w - 14 - (j % 2) * 6, 1, b.ink(PAL.G3));
    }
    if (k >= 2) { rect(x + w - 19, y + h - 11, 15, 7, b.ink(memo ? PAL.F4 : PAL.C5)); rect(x + w - 17, y + h - 9, 11, 3, b.ink(PAL.P2)); }
    else { for (let j = y + h - 12; j < y + h - 3; j += 2) rect(x + w - 20, j, 16, 1, b.ink(PAL.G4)); } // still drawing in
  };
  if (f < T.napkinSnap + 4) { scr(PAL.N2); rect(x + 4, y + h - 8, w - 8, 4, b.ink(PAL.N3)); b.set(x + 6, y + h - 7, PAL.C6); }
  else if (f < T.site1) { scr(PAL.N3); napkin(x + 4, y + 2, 2); }
  else if (f < T.site2) site(1);
  else if (f < T.snap2 + 4) site(2);
  else if (f < T.site3) { scr(PAL.N3); rect(x + 3, y + 8, w - 6, 22, b.ink(PAL.P1)); for (let j = 0; j < 5; j++) rect(x + 6, y + 11 + j * 4, w - 14 - (j % 3) * 5, 1, b.ink(PAL.N4)); }
  else if (f < T.site4) site(1, true);
  else site(2, true);
  // screen glare line
  for (let i = 0; i < 6; i++) b.set(x + w - 8 + i, y + 1 + i, stepColor(b.get(x + w - 8 + i, y + 1 + i), 1));
};

/** the livestream camera on a tripod, pointed at Gerg: a small grey body, a lens, the red tally */
const drawTripodCam = (b: Buf, x: number, foot: number, f: number) => {
  line(x, foot - 26, x - 8, foot, b.ink(PAL.G2)); line(x, foot - 26, x + 7, foot, b.ink(PAL.G1)); line(x, foot - 26, x, foot, b.ink(PAL.N2));
  rect(x - 1, foot - 44, 2, 18, b.ink(PAL.G2));
  const cy = foot - 54;
  rect(x - 8, cy, 16, 10, b.ink(PAL.N0)); rect(x - 7, cy + 1, 14, 8, b.ink(PAL.G2)); rect(x - 7, cy + 1, 14, 1, b.ink(PAL.G4));
  rect(x + 7, cy + 2, 6, 6, b.ink(PAL.N0)); rect(x + 8, cy + 3, 4, 4, b.ink(PAL.N3)); b.set(x + 10, cy + 4, PAL.C6); // the lens, toward Gerg
  b.set(x - 5, cy - 1, PAL.R3); b.set(x - 5, cy - 2, stepColor(PAL.R3, -1)); // the tally light (on: live)
  void f;
};

/** Gerg's arm up with a napkin (or his phone snapping it), over the table sprite. Hand-drawn, whole pixels. */
const gergArmUp = (b: Buf, gx: number, gy: number, what: 'napkin' | 'phone' | 'both', flash: boolean) => {
  const sleeve = [PAL.N1, PAL.F1, PAL.F2];
  const arm = (x0: number, y0: number, x1: number, y1: number) => { line(x0, y0, x1, y1, b.ink(sleeve[1])); line(x0 + 1, y0, x1 + 1, y1, b.ink(sleeve[2])); line(x0 - 1, y0, x1 - 1, y1, b.ink(sleeve[0])); };
  if (what === 'napkin' || what === 'both') {
    arm(gx + 18, gy + 30, gx + 12, gy + 12);
    rect(gx + 4, gy + 1, 15, 11, b.ink(PAL.P2)); rect(gx + 4, gy + 11, 15, 1, b.ink(PAL.P0));
    rect(gx + 6, gy + 3, 11, 2, b.ink(PAL.N4)); rect(gx + 6, gy + 7, 5, 1, b.ink(PAL.N4)); rect(gx + 13, gy + 6, 4, 3, b.ink(PAL.N4));
    b.set(gx + 11, gy + 12, PAL.S4); b.set(gx + 12, gy + 12, PAL.S5); b.set(gx + 12, gy + 11, PAL.S4);
  }
  if (what === 'phone' || what === 'both') {
    arm(gx + 34, gy + 30, gx + 30, gy + 16);
    rect(gx + 27, gy + 10, 6, 8, b.ink(PAL.N0)); rect(gx + 28, gy + 11, 4, 6, b.ink(flash ? PAL.P2 : PAL.C3));
    b.set(gx + 30, gy + 18, PAL.S4); b.set(gx + 31, gy + 18, PAL.S5);
    if (flash) { b.set(gx + 26, gy + 9, PAL.P1); b.set(gx + 25, gy + 8, PAL.P0); }
  }
};

/** Mas holds up his phone: a raised forearm and the phone, lit by its own screen */
const masPhoneUp = (b: Buf, mx: number, my: number) => {
  line(mx + 28, my + 32, mx + 34, my + 16, b.ink(PAL.G1)); line(mx + 29, my + 32, mx + 35, my + 16, b.ink(PAL.G2));
  rect(mx + 32, my + 7, 6, 10, b.ink(PAL.N0)); rect(mx + 33, my + 8, 4, 8, b.ink(PAL.C5)); b.set(mx + 33, my + 8, PAL.C8);
  b.set(mx + 34, my + 17, PAL.K3); b.set(mx + 35, my + 17, PAL.K2);
};

/** a coworker at station 2: the bullpen's seated table sprite, turned to watch the demo and recoloured (another
 *  person: black hair, a grey top, a plum collar, a skin rung darker); cheers in two held drawings */
const COWORKER = (c: number) => {
  const f = familyOf(c);
  if (!f) return c;
  const [fam, i] = f;
  if (fam === 'B') return [PAL.N0, PAL.N1, PAL.N2, PAL.N3, PAL.N4][Math.min(4, i)];
  if (fam === 'L') return [PAL.U0, PAL.U1, PAL.U2, PAL.U3][Math.min(3, i)];
  if (fam === 'F') return [PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6][Math.min(6, i)];
  if (fam === 'S') return stepColor(c, -1);
  return c;
};
/** round 5: the table sprites' tee is near-black navy (it was built for the WOODROSE's dark dining room), so in the
 *  day bullpen the shoulders and forearms merged into the laptop: "heads on armless blob bodies". Their tops are lifted
 *  into a colour that separates from the laptop: Gerg's blue (the sleeves his raised arm already wears), the
 *  coworker's grey. */
const TEE_BLUE = [PAL.N0, PAL.N1, PAL.F1, PAL.F2, PAL.F3, PAL.F4];
const TEE_GREY = [PAL.N0, PAL.N1, PAL.G1, PAL.G2, PAL.G3, PAL.G4];
const teeMap = (ramp: number[], then?: (c: number) => number) => (c: number) => {
  const f = familyOf(c);
  if (f && f[0] === 'N' && f[1] >= 2 && f[1] <= 5) return ramp[f[1]];
  return then ? then(c) : c;
};
const GERG_DAY = teeMap(TEE_BLUE);
const COWORKER_DAY = teeMap(TEE_GREY, COWORKER);
/** Mas's desk sprite is lit for the cold open's dark room (cyan-lit skin, cyan rims); in the day bullpen that read as a
 *  "sickly teal face". Here his skin takes the room's daylight and the rims go neutral. */
const MAS_DAY = (c: number) => {
  const f = familyOf(c);
  if (!f) return c;
  const [fam, i] = f;
  if (fam === 'X') return [PAL.S1, PAL.S1, PAL.S2, PAL.S2][i] ?? PAL.S2;
  if (fam === 'K') return [PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5, PAL.S5][i] ?? PAL.S5;
  if (fam === 'C') return i >= 6 ? PAL.G5 : i >= 3 ? PAL.G3 : PAL.G1;
  return c;
};
const drawCoworker = (b: Buf, x: number, y: number, f: number, cheer: 0 | 1 | 2) => {
  drawGergTable(b, x, y, {...GERG_DEFAULT, type: cheer ? 0 : gergTypeAt(f + 5), look: 1}, f, {flip: true, capsFrom: 1e9, map: COWORKER_DAY});
  if (!cheer) return;
  // both forearms up past the head (the sleeves, the hands open), two drawings: up, and up higher with a shake
  const up = cheer === 2 ? 3 : 0;
  for (const [sx, dir] of [[x + 17, -1], [x + 33, 1]] as Array<[number, number]>) {
    for (let j = 0; j < 16 + up; j++) { const xx = sx + Math.round(dir * j * 0.2); b.set(xx, y + 28 - j, PAL.G2); b.set(xx + 1, y + 28 - j, PAL.G3); }
    const hx = sx + Math.round(dir * (16 + up) * 0.2), hy = y + 28 - 16 - up;
    rect(hx - 1, hy - 3, 3, 3, b.ink(PAL.S3)); b.set(hx + dir * 2, hy - 2, PAL.S3); b.set(hx, hy - 4, PAL.S4);
  }
};

/** the script's hand-lettered `GTP-4` banner over the demo stage (sc 11, the final pass: the product's name is on
 *  screen before the Senate). A paper strip on two strings from the ceiling, marker letters bobbing a pixel the way
 *  a hand letters them, a teal underline swoosh; it hangs in front of the neon (which the pane's crop cut to "E AI").
 *  Room coords (the left pane shows room x from SX_L). */
const BANNER = {x: SX_L - 2, y: 34, w: 80, h: 16};
const drawBanner = (b: Buf) => {
  const {x, y, w, h} = BANNER;
  // the strings, up to the ceiling grid
  for (const sx of [x + 4, x + w - 5]) for (let yy = 6; yy < y + 1; yy++) b.set(sx, yy, PAL.N2);
  // the paper, a fold shadow along its foot
  for (let i = 0; i < w; i++) for (let j = -1; j <= h; j++) {
    if (j === -1 || j === h || i === 0 || i === w - 1) { b.set(x + i, y + j, PAL.N0); continue; }
    b.set(x + i, y + j, j >= h - 2 ? PAL.P0 : (i + j) % 17 === 0 ? PAL.P0 : PAL.P1);
  }
  // the marker letters: hand-drawn at a fat nib (the 7 px font's G reads as a 6 when it's thickened), each letter
  // bobbing a pixel the way a hand letters a banner
  const G: Record<string, string[]> = {
    G: ['.####.', '##..##', '##....', '##.###', '##..##', '##..##', '.####.'],
    T: ['######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'],
    P: ['#####.', '##..##', '##..##', '#####.', '##....', '##....', '##....'],
    '-': ['....', '....', '....', '####', '....', '....', '....'],
    '4': ['...##.', '..###.', '.#.##.', '#..##.', '######', '...##.', '...##.'],
  };
  const word = ['G', 'T', 'P', '-', '4'];
  const tw = word.reduce((q, ch) => q + G[ch][0].length + 2, -2);
  let cx = x + Math.round((w - tw) / 2);
  word.forEach((ch, k) => {
    const bob = [0, -1, 0, 0, 1][k];
    G[ch].forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') b.set(cx + i, y + 3 + bob + j, PAL.N1); }));
    cx += G[ch][0].length + 2;
  });
  // the underline swoosh, teal, drawn in one stroke that lifts at its end
  for (let i = 0; i < w - 18; i++) b.set(x + 9 + i, y + h - 3 - (i > w - 26 ? 1 : 0), PAL.C4);
};

export const drawLeft = (L: Buf, f: number) => {
  const opts = {variant: 'day' as const, door: 'shut' as const, chairs: [true, false, false, false] as [boolean, boolean, boolean, boolean], iou: false};
  const room = drawBullpen(L, f, opts);
  drawBanner(L);
  // the demo's audience: a coworker at station 2 cheers at the site (p285) and harder at his post (p360)
  const k1 = f >= T.cheer1 && f < T.cheer1 + 36 ? ((f - T.cheer1) % 12 < 6 ? 1 : 2) : 0;
  const k2 = f >= T.cheer2 && f < T.cheer2 + 54 ? ((f - T.cheer2) % 10 < 5 ? 2 : 1) : 0;
  const cheer = Math.max(k1, k2) as 0 | 1 | 2;
  const [sx, sy] = room.anchors.seat2;
  drawCoworker(L, sx, sy, f, cheer);
  const phones = f >= T.post + 16 && f < T.cheer2;
  if (phones) { rect(sx + 22, sy + 24, 4, 6, L.ink(PAL.N0)); rect(sx + 23, sy + 25, 2, 4, L.ink(PAL.C6)); }
  // Gerg at his station (typing on 1s), Mas at his end desk behind the demo
  const [gx, gy] = room.anchors.gergDesk;
  const napkin = f >= T.napkinUp && f < T.napkinDown;
  const snap2 = f >= T.snap2 - 6 && f < T.snap2 + 8;
  // (his keycap popcorn is off here: at this size the caps read as dead pixels round him, "white specks")
  drawGergTable(L, gx, gy, {...GERG_DEFAULT, type: napkin || snap2 ? 0 : gergTypeAt(f), look: napkin ? 1 : 0}, f, {capsFrom: 1e9, map: GERG_DAY});
  if (napkin) gergArmUp(L, gx, gy - 8, f >= T.napkinSnap - 8 ? 'both' : 'napkin', f >= T.napkinSnap && f < T.napkinSnap + 2);
  if (snap2) gergArmUp(L, gx, gy - 4, 'phone', f >= T.snap2 && f < T.snap2 + 2);
  const [mx, my] = room.anchors.masDesk;
  const phoneUp = f >= T.phoneUp && f < T.cheer2 + 30;
  drawMasDesk(L, mx, my, {...MAS_DESK_DEFAULT, head: phoneUp ? 'screen' : 'turn', light: 'monitor', breathe: (Math.floor(f / 48) % 2) as 0 | 1}, undefined, MAS_DAY);
  if (phoneUp) masPhoneUp(L, mx, my);
  void walkoutExtra;
  drawDemoScreen(L, f);
  drawTripodCam(L, 122, 202, f);
  return room;
};

// ------------------------------------------------------------------ the crossing, the post, the plates
/** the second scroll's sheet across the split line and the left pane, and its end climbing onto Gerg's desk */
const drawCrossing = (fb: Buf, f: number, m: MarioState) => {
  if (f < T.unroll) return;
  const handX = rToF(marioLeft() + m.dx + (MARIO_W - 1 - 25));
  const k = on2(f) - T.unroll;
  // the sheet's left end if it kept going (as drawScrollLeft lays it: the lip at handX - 4 + belly, then the run)
  const hy = marioTop() + 45, drop = SCROLL_Y - 3 - (hy + 3);
  const run = (SCROLL_Y - hy) + Math.floor(k * 3.2) - drop;
  const lead = handX - 4 + belly(drop, drop) - run;
  if (lead >= RX0) return; // still in the lighthouse pane (drawn there)
  // the sheet over the divider and across the bullpen floor, to Gerg's desk front (frame x 86)
  paperFloor(fb, RX0 + 1, Math.max(lead, 86), 9);
  if (lead > 86) rollEnd(fb, lead - 5);
  else {
    // at Gerg's desk: the end climbs the bench front and lands on the desk top in two drawings (the landing, p540)
    const up = f < T.land - 4 ? 1 : 2;
    const topY = up === 1 ? 172 : 150;
    for (let y = topY; y < SCROLL_Y - 3; y++) for (let i = 0; i < 5; i++) {
      let c = i === 0 ? PAL.P0 : i === 4 ? PAL.P2 : PAL.P1;
      if (i >= 1 && i <= 3 && y % 3 === 0 && hash(y, i, 13) < 0.7) c = PAL.F2;
      fb.set(83 + i, y, c);
    }
    if (up === 2) { rect(74, 145, 16, 5, fb.ink(PAL.N0)); rect(75, 146, 14, 3, fb.ink(PAL.P1)); rect(75, 146, 14, 1, fb.ink(PAL.P2)); rect(72, 144, 5, 7, fb.ink(PAL.N0)); rect(73, 145, 3, 5, fb.ink(PAL.P1)); fb.set(74, 147, PAL.P0); }
  }
};

/** his post, in his own lowercase: a card that pops over the left pane in two held drawings */
const drawPost = (fb: Buf, f: number) => {
  if (f < T.post || f >= T.unroll - 6) return;
  const k = f - T.post;
  const s = '"…still flawed, still limited…"';
  const w = ptextW(s) + 14, x = 2, y = 16; // at the pane's edge: it covers the GTP-4 banner whole, never half of it
  const h = k < 3 ? 12 : 34;
  rect(x - 1, y - 1, w + 2, h + 2, fb.ink(PAL.N0)); rect(x, y, w, h, fb.ink(PAL.N2)); rect(x, y, w, 1, fb.ink(PAL.C6));
  if (k < 3) return;
  rect(x + 5, y + 4, 8, 8, fb.ink(PAL.C5)); rect(x + 7, y + 6, 4, 4, fb.ink(PAL.N2)); // his avatar (a plain square)
  ptext(fb, 'mas', x + 17, y + 5, PAL.N7);
  ptext(fb, 'MAR 14', x + w - 6 - ptextW('MAR 14'), y + 5, PAL.N5);
  ptext(fb, s, x + 7, y + 20, PAL.P1);
};

/** the name plates, in Act Four's plate style (a dark tab, an accent rule, the name then its line typing on) */
const plate = (fb: Buf, x: number, y: number, name: string, l1: string, k: number, accent: number) => {
  if (k < 0) return;
  const w = Math.max(ptextW(name), ptextW(l1)) + 16;
  const open = Math.min(1, (k + 1) / 3), hh = Math.max(2, Math.round(26 * open));
  rect(x - 1, y - 1, w + 2, hh + 2, fb.ink(PAL.N0)); rect(x, y, w, hh, fb.ink(PAL.N1)); rect(x, y, w, 1, fb.ink(accent));
  if (open < 1) return;
  ptext(fb, name.slice(0, Math.max(0, (k - 2) * 3)), x + 8, y + 5, accent);
  ptext(fb, l1.slice(0, Math.max(0, (k - 5) * 3)), x + 8, y + 15, PAL.P1);
};

// ------------------------------------------------------------------ sc 12: over Mas's shoulder at his desk, night
const nightStep = (c: number) => { const f = familyOf(c); if (!f) return c; if (f[0] === 'C' || f[0] === 'K') return c; return stepColor(c, f[0] === 'N' ? -1 : -3); };
const shoulderImg = (() => { let im: Img | null = null; return () => { if (!im) im = masPortrait({...MAS_PORTRAIT_DEFAULT, look: -1, light: 'monitor'} as never); return im; }; })();
export const drawSc12 = (fb: Buf, f: number) => {
  // the bullpen at night, behind: the room on its night ramp (every colour stepped down its family), the windows dark
  const room = new Buf(480, 270, PAL.N0);
  drawBullpen(room, f, {variant: 'day', door: 'shut', chairs: [true, true, true, true]});
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) fb.set(x, y, nightStep(room.get(x, y)));
  // the city at night in the windows: scattered lit windows (W6/W7), the glass dark
  for (let y = 36; y < 122; y++) for (let x = 336; x < 468; x++) { if (hash(x >> 1, y >> 1, 7) > 0.985) fb.set(x, y, PAL.W6); }
  // his monitor, big in frame (he is at his desk, we are behind him): the bezel, the letter's page lighting up
  const mx = 150, my = 26, mw = 250, mh = 128;
  const on = f - T.cut;
  rect(mx - 6, my - 6, mw + 12, mh + 12, fb.ink(PAL.N0)); rect(mx - 5, my - 5, mw + 10, mh + 10, fb.ink(PAL.G0)); rect(mx - 5, my - 5, mw + 10, 1, fb.ink(PAL.G1));
  rect(mx + mw / 2 - 10, my + mh + 6, 20, 20, fb.ink(PAL.G0)); rect(mx + mw / 2 - 30, my + mh + 24, 60, 4, fb.ink(PAL.G0));
  const lvl = on < 2 ? 0 : on < 4 ? 1 : 2; // the screen wakes in two held steps
  rect(mx, my, mw, mh, fb.ink([PAL.N1, PAL.N4, PAL.P1][lvl]));
  if (lvl === 2) {
    rect(mx, my, mw, 12, fb.ink(PAL.N3)); rect(mx + 4, my + 3, 60, 6, fb.ink(PAL.N5)); for (let i = 0; i < 3; i++) rect(mx + mw - 10 - i * 8, my + 4, 4, 4, fb.ink(PAL.N5));
    // the header: the letter's own title
    // round 5: the title in the engine's 14 px display face (the 7 px face struck twice for bold made GIANT read
    // "6IANT" and ran EXPERIMENTS together)
    const h1 = 'PAUSE GIANT AI', h2 = 'EXPERIMENTS';
    bigText(fb, h1, mx + 14, my + 18, PAL.N1);
    bigText(fb, h2, mx + 14, my + 36, PAL.N1);
    void bigTextWidth;
    rect(mx + 14, my + 56, 120, 1, fb.ink(PAL.N5));
    for (let j = 0; j < 6; j++) rect(mx + 14, my + 64 + j * 8, mw - 40 - ((j * 37) % 60), 2, fb.ink(PAL.P0));
    rect(mx + mw - 84, my + mh - 22, 70, 12, fb.ink(PAL.N3)); ptext(fb, 'SIGN', mx + mw - 64, my + mh - 20, PAL.P2);
  }
  // his desk edge and keyboard in the foreground
  rect(0, 176, 480, RH - 176, fb.ink(PAL.N1)); rect(0, 176, 480, 1, fb.ink(PAL.C1));
  rect(200, 180, 150, 10, fb.ink(PAL.N2)); for (let i = 0; i < 18; i++) rect(204 + i * 8, 182, 6, 2, fb.ink(PAL.N3));
  // his glass, by his hand, catching the screen
  rect(372, 160, 10, 16, fb.ink(PAL.N0)); rect(373, 161, 8, 14, fb.ink(PAL.N2)); rect(373, 165, 8, 1, fb.ink(PAL.C3)); rect(380, 162, 1, 12, fb.ink(PAL.C4));
  // over his shoulder: the back of his head and his shoulder in the foreground at native size (never scaled): his
  // portrait's silhouette, mirrored so the cheek line turns to the screen, black, a cyan rim where the screen lights it
  const sh = shoulderImg();
  const sx = -14, sy = 52;
  const op = (i: number, j: number) => i >= 0 && j >= 0 && i < sh.w && j < sh.h && sh.c[j * sh.w + (sh.w - 1 - i)] >= 0;
  for (let j = 0; j < RH - sy; j++) for (let i = 0; i < sh.w; i++) {
    const jj = Math.min(j, sh.h - 1);
    if (!op(i, jj)) continue;
    const rim = !op(i + 1, jj) && j < sh.h - 4;
    fb.set(sx + i, sy + j, rim ? (lvl === 2 ? PAL.C4 : PAL.C2) : !op(i + 2, jj) && j < sh.h - 4 && lvl === 2 ? PAL.N2 : PAL.N0);
  }
};

// ------------------------------------------------------------------ the frame
export const drawFrame = (fb: Buf, f: number, clay: ClayState) => {
  rect(0, 0, 480, 270, fb.ink(PAL.N0));
  let m: MarioState | null = null;
  if (f < T.cut) {
    const L = new Buf(480, RH, PAL.N0), R = new Buf(480, RH, PAL.N0);
    drawLeft(L, f);
    m = drawRight(R, f, clay);
    for (let y = 0; y < RH; y++) for (let x = 0; x < PANE_W; x++) { fb.set(x, y, L.get(SX_L + x, y)); fb.set(RX0 + x, y, R.get(SX_R + x, y)); }
    rect(PANE_W, 0, RX0 - PANE_W, RH, fb.ink(PAL.N0));
    drawCrossing(fb, f, m);
    drawPost(fb, f);
    if (f >= T.plateMario[0] && f < T.plateMario[1]) plate(fb, 250, 8, 'MARIO', 'EX-NOPEAI · THE CAREFUL RIVAL', f - T.plateMario[0], PAL.F5);
    if (f >= T.plateClod[0] && f < T.plateClod[1]) plate(fb, 250, 8, 'CLOD 1', 'SAME DAY', f - T.plateClod[0], PAL.W5);
  } else drawSc12(fb, f);
  // the band: the verb band, dimmed (the record's band); the rail on its sentence line. Round 5: after the opening
  // beat its verbs and inventory step out in three held steps (4 f each), and the band stays as a quiet bar under the
  // panes (its position never moves: "the band's content changes, never its position")
  drawBand(fb, {cutscene: true});
  const fade = f < BAND_FADE ? 0 : Math.min(3, 1 + Math.floor((f - BAND_FADE) / 4));
  if (fade) for (let y = 206; y < 270; y++) for (let x = 0; x < 480; x++) {
    let c = fb.get(x, y);
    if (fade >= 3) c = PAL.N1;
    else for (let q = 0; q < fade * 2; q++) { const d = stepColor(c, -1); if (d === c || oklab(d)[0] < oklab(PAL.N1)[0]) { c = PAL.N1; break; } c = d; }
    fb.set(x, y, c);
  }
  const rail = f < T.cut ? 'MAR 14, 2023' : 'MAR 22, 2023'.slice(0, Math.max(0, f - T.rail + 1));
  ptext(fb, rail, 12, 209, PAL.P1, PAL.N0);
  return m;
};

export const P1_FRAMES = FRAMES;
void BEAT; void poly;
