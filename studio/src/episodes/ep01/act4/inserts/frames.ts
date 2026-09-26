// MR. MAS — Ep1 act 4 INSERTS + EXPRESSIONS: frame definitions (ids lowercase, dashes). Registered only by ./entry.tsx.
import type {FrameDef} from '../../../../shared/frame-def';
import {InsertsCanvas} from './InsertsCanvas';
import {MOTION_FRAMES, DELIVERABLES} from './sheet';

export const frames: FrameDef[] = [
  ...DELIVERABLES.map(([id, view]) => ({id: `act4ins-${id}`, component: InsertsCanvas, props: {view}})),
  {id: 'act4ins-motion', component: InsertsCanvas, props: {view: 'motion:f'}, durationInFrames: MOTION_FRAMES, fps: 24},
];
