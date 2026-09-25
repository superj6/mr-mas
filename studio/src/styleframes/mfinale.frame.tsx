// MR. MAS — mfinale: intro frames 540-719 (the skyline, the title, the bookend), in the shared pixel engine.
// Composition frame N = intro frame 540 + N. `mfinale-bars9-12` prepends the roll call (480-539) for review.
import type {FrameDef} from '../shared/frame-def';
import {MFinale, MFinaleAt, MFinaleSheet, MFinaleBars9to12} from '../dev/mfinale/MFinale';
import {MF_FRAMES, MF_START, ROLLCALL_START} from '../dev/mfinale/timeline';

/** key stills, addressed by GLOBAL intro frame */
export const MFINALE_KEYS: Array<{name: string; g: number}> = [
  {name: 'skyline', g: 628},
  {name: 'title', g: 660},
  {name: 'bookend', g: 705},
];

export const frames: FrameDef[] = [
  {id: 'mfinale', component: MFinale, durationInFrames: MF_FRAMES, fps: 24},
  {id: 'mfinale-bars9-12', component: MFinaleBars9to12, durationInFrames: MF_FRAMES + MF_START - ROLLCALL_START, fps: 24},
  ...MFINALE_KEYS.map((k) => ({id: `mfinale-key-${k.name}`, component: MFinaleAt, props: {g: k.g}})),
  // dev: 4x4 contact sheet at 1x of any global frames (pass --props='{"gs":[...]}')
  {id: 'mfinale-sheet', component: MFinaleSheet, props: {gs: [540, 555, 570, 585, 600, 615, 622, 628, 630, 633, 636, 639, 660, 690, 692, 705]}},
];
