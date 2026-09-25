// MR. MAS — meras: intro span f120-239 (5.0 s) — 1993 1-BIT -> render front -> 2008 / 2014 EARLY-WEB 16 ->
// the candle's radial front into BASE at THE WOODROSE. Code in src/dev/meras/, notes in notes/meras.md.
//   meras              the span, 120 frames; local frame n = global intro frame n + 120 (use <MerasMount/>)
//   meras-key-<name>   key stills at 1920x1080 (global frame in the id's table below)
import type {FrameDef} from '../shared/frame-def';
import {Meras, MerasStill} from '../dev/meras/Meras';
import {MERAS_FRAMES} from '../dev/meras/timeline';

/** key frames (GLOBAL intro frames) */
export const MERAS_KEYS: Record<string, number> = {
  '1993': 132, // the stare
  'alert': 152, // his name card: the stranger's pointer has just clicked Cancel
  'front': 174, // the render front: 2008 re-renders behind the beam
  '2008': 193, // two popped collars, the clicker caught, TPOOL
  '2014': 220, // crowned; the glint, the frame before the pan
  'woodrose': 235, // the fallback 2015 frame (hard switch to BASE on the cut; mdinner1 owns the real set)
};

export const frames: FrameDef[] = [
  {id: 'meras', component: Meras, durationInFrames: MERAS_FRAMES, fps: 24},
  ...Object.entries(MERAS_KEYS).map(([name, g]) => ({id: `meras-key-${name}`, component: MerasStill, props: {g}})),
];
