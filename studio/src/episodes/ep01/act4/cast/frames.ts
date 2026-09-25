// MR. MAS — Ep1 act 4 cast: frame definitions (ids lowercase, dashes). Registered only by ./entry.tsx.
import type {FrameDef} from '../../../../shared/frame-def';
import {CastCanvas} from './CastCanvas';
import {MOTION_FRAMES} from './sheet';

const SHEETS = ['walkers', 'neleh', 'mada', 'ttemme', 'terb', 'quietvote', 'rima', 'tasya', 'adelina', 'alyi', 'gerg'];
export const frames: FrameDef[] = [
  ...SHEETS.map((w) => ({id: `act4cast-sheet-${w}`, component: CastCanvas, props: {view: `sheet:${w}`}})),
  {id: 'act4cast-lineup', component: CastCanvas, props: {view: 'lineup'}},
  ...[0, 1, 2, 3, 4, 5].map((i) => ({id: `act4cast-card-${i}`, component: CastCanvas, props: {view: `cards:${i}`}})),
  {id: 'act4cast-callgrid', component: CastCanvas, props: {view: 'callgrid'}},
  {id: 'act4cast-boardgrid', component: CastCanvas, props: {view: 'boardgrid'}},
  {id: 'act4cast-motion', component: CastCanvas, props: {view: 'motion'}, durationInFrames: MOTION_FRAMES, fps: 24},
];
