// MR. MAS — range/p3: the direction. For every frame: the mode (pure pixel or the model's render), the camera, which
// families have resolved, how many samples, and what the pixel layers show. Pure: no GL here.
// Every change of state in the render is an eased ramp (6-16 frames); the pixel layers change in whole rungs or
// held steps, as the show's pixel rules say.
import {T, bandRows, smoother, ramp} from './timeline';
import {Cam, SIDE_CAM, POV_CAM, WIN_CAM, glideCam, outCam, Who} from './layout';
import {frontPos} from '../../../shared/pixel/transitions';
import type {Family} from './gl/world';

export interface Plan {
  mode: 'pixel' | '3d';
  band: number;
  /** the [W] monitor's flare (0..3) in pixel frames */
  flare: number;
  /** a render front on a pixel frame: 'in' = the room becomes the model's copy, 'out' = the [W] re-renders */
  front: {kind: 'in' | 'out'; pos: number; smear: number} | null;
  cam: Cam; camFrom: Cam | null; camTo: Cam | null;
  /** the window insert (4x) */
  insert: boolean;
  samples: number; aperture: number; focus: number; bloom: number; grain: number; vig: number;
  reveal: Record<Family, number>; fresh: Record<Family, number>;
  /** the LED candles' light · the sconces' fill before the candles · the monitor's light · its screen · its flare */
  light: number; fill: number; monitor: number; monScreen: number; monFlare: number;
  pts: {rimCyan: number; deres: Record<number, number>; stream0: number; winDots: number};
  /** the guests' light stage (sprites.relight) */
  stage: 0 | 1 | 2;
  /** his glass: 0..1 appear (held steps) */
  masGlass: number;
  /** his reflection (insert), and the empty plate over it (frames since it rose, -1 = none) */
  reflection: boolean; plate: number;
  /** frames since each bar's beat (-1 = not yet / gone) */
  bars: Record<Who, number>;
  /** the rim's glow level 0..3 */
  rim: number;
  /** era slate age (-1 = none) */
  era: number;
  /** the window's reflection of the learned objects (a mirror pass) */
  winMirror: boolean;
  /** the [W] monitor drawn into the frame as the camera lands back on the side view (-1 = no) */
  monPixel: number;
}

const GL0 = T.glide[0], GL1 = T.glide[1];
const moving = (f: number) => (f >= GL0 && f <= GL1) || (f >= T.pullback[0] && f <= T.pullback[1]);

export const camAt = (f: number): Cam => {
  if (f < GL0) return SIDE_CAM;
  if (f <= GL1) return glideCam(smoother((f - GL0) / (GL1 - GL0)));
  if (f < T.window) return POV_CAM;
  if (f < T.pullback[0]) return WIN_CAM;
  return outCam(Math.min(1, (f - T.pullback[0]) / (T.pullback[1] - T.pullback[0])));
};

const fam = (f: number, a: number, len: number, out: number, outLen: number) => ramp(f, a, a + len) * (1 - ramp(f, out, out + outLen));
const freshOf = (f: number, a: number) => ramp(f, a, a + 3) * (1 - ramp(f, a + 5, a + 20));

export const plan = (f: number): Plan => {
  const R = T.resolve, D = T.deresolve;
  const pixel = f < GL0 || f >= T.back;
  const insert = f >= T.window && f < T.pullback[0];
  const reveal: Record<Family, number> = {
    table: fam(f, R.table, 14, D.table, 12),
    candles: fam(f, R.candles, 8, D.candles, 10),
    cutlery: fam(f, R.cutlery, 10, D.cutlery, 10),
    glasses: fam(f, R.glasses, 10, D.glasses, 10),
  };
  const fresh: Record<Family, number> = {table: freshOf(f, R.table), candles: freshOf(f, R.candles), cutlery: freshOf(f, R.cutlery), glasses: freshOf(f, R.glasses)};
  const light = ramp(f, R.candles + 4, R.candles + 18) * (1 - ramp(f, D.candles, D.candles + 10));
  const fill = 0.35 * ramp(f, R.table, R.table + 16) * (1 - ramp(f, D.table, D.table + 12));
  const mv = moving(f);
  const held = !mv && f >= R.table;
  const samples = pixel ? 0 : mv ? (f >= R.table ? 24 : 12) : held ? 64 : 12;
  const pulling = f >= T.pullback[0];
  const aperture = insert ? 0.0022 : pulling ? 0.0022 * (1 - ramp(f, T.pullback[0], T.pullback[0] + 6)) : f < 96 ? 0 : 0.0075 * smoother((f - 96) / 24);
  const bars = {} as Record<Who, number>;
  (['gerg', 'alyi', 'nole', 'mario'] as Who[]).forEach((w, i) => { const k = f - T.bars[i]; bars[w] = k >= 0 && f < T.window ? k : -1; });
  const deres: Record<number, number> = {1: D.table, 2: D.candles, 3: D.cutlery, 4: D.glasses, 6: D.cutlery};
  let front: Plan['front'] = null;
  if (f >= T.front[0] && f < GL0) { const q = frontPos(f, T.front[0], T.front[1] - T.front[0] + 1, 480); front = {kind: 'in', pos: q.pos, smear: q.smear}; }
  if (f >= T.backFront[0] && f <= T.backFront[1]) { const q = frontPos(f, T.backFront[0], T.backFront[1] - T.backFront[0] + 1, 480); front = {kind: 'out', pos: q.pos, smear: q.smear}; }
  const rim = f < T.rimFrame ? 0 : f < T.rimFrame + 2 ? 1 : f < T.rimFrame + 4 ? 2 : f < 316 ? 3 : f < 319 ? 2 : f < 322 ? 1 : 0;
  return {
    mode: pixel ? 'pixel' : '3d',
    band: bandRows(f),
    flare: f >= T.back ? (f < T.back + 3 ? 3 : f < T.back + 6 ? 2 : f < T.back + 9 ? 1 : 0) : 0,
    front,
    cam: camAt(f), camFrom: mv ? camAt(f - 0.2) : null, camTo: mv ? camAt(f + 0.2) : null,
    insert,
    samples, aperture, focus: insert || pulling ? 9.4 : 2.35,
    bloom: 0.55 * ramp(f, R.table, R.candles + 16),
    grain: 0.011 * ramp(f, GL0, GL0 + 18) * (1 - ramp(f, 320, 329)),
    vig: 0.3 * ramp(f, GL0, GL0 + 24) * (1 - ramp(f, 318, 329)),
    reveal, fresh, light, fill,
    monitor: ramp(f, GL0, GL0 + 24),
    monScreen: ramp(f, GL0 + 4, GL0 + 22),
    monFlare: 1.6 * ramp(f, T.stream[0] + 4, T.stream[1]) + (f >= 327 ? 0.8 : 0),
    pts: {rimCyan: f < T.rimsCyan ? 0 : f < T.rimsCyan + 3 ? 0.5 : 1, deres, stream0: f >= T.stream[0] ? T.stream[0] : 0, winDots: insert ? 0.3 : 1},
    stage: f < R.candles + 6 ? 0 : f < R.candles + 12 ? 1 : 2,
    masGlass: f < R.masGlass ? 0 : f < R.masGlass + 2 ? 0.34 : f < R.masGlass + 4 ? 0.67 : 1,
    reflection: insert,
    plate: insert && f >= T.emptyPlate ? f - T.emptyPlate : -1,
    bars,
    rim,
    era: f >= T.era && f < T.era + 56 ? f - T.era : -1,
    winMirror: f >= R.candles && f < 318,
    monPixel: f >= 327 && f < T.back ? 3 : -1,
  };
};
void POV_CAM;
