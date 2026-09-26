// MR. MAS — Ep1 act 4 MEDIUM tier: frame definitions (ids lowercase, dashes). Registered only by ./entry.tsx.
// Owned by the act-4 medium-tier artist.
import type {FrameDef} from '../../../../shared/frame-def';
import {MediumCanvas} from './MediumCanvas';
import {MOTION_FRAMES, SHOT_IDS} from './sheet';

const SHEETS = ['mas', 'orb', 'mada', 'neleh', 'gerg'];
const PLATES = ['dark', 'board'];
/** board shot id -> composition id ('26A.02' -> 'act4med-shot-26a-02') */
export const shotFrameId = (id: string) => `act4med-shot-${id.toLowerCase().replace(/\./g, '-')}`;
export const frames: FrameDef[] = [
  ...SHEETS.map((w) => ({id: `act4med-sheet-${w}`, component: MediumCanvas, props: {view: `sheet:${w}`}})),
  ...PLATES.map((w) => ({id: `act4med-plate-${w}`, component: MediumCanvas, props: {view: `plate:${w}`}})),
  ...SHOT_IDS.map((s) => ({id: shotFrameId(s), component: MediumCanvas, props: {view: `shot:${s}`}})),
  {id: 'act4med-contact', component: MediumCanvas, props: {view: 'contact'}},
  {id: 'act4med-motion', component: MediumCanvas, props: {view: 'motion:@'}, durationInFrames: MOTION_FRAMES, fps: 24},
];
