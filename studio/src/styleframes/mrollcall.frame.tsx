// MR. MAS — mrollcall: "THE PLAYERS" roll call, intro frames 480-539 (bar 9). Eight portrait flashes, one per
// eighth note (cuts at 480 487 495 502 510 517 525 532), playing the knee motif F F F F G Ab C F; the window
// grows with the pitch. Composition frame 0 = global 480 (see src/dev/mrollcall/timeline.ts: MR, toGlobal).
//   mrollcall          60 frames, the moment
//   mrollcall-sheet    all 8 portraits at their signature frames (contact sheet)
//   mrollcall-hold     one global frame held: --props='{"g":506}'
import type {FrameDef} from '../shared/frame-def';
import {MRollcall, MRollcallSheet, MRollcallHold} from '../dev/mrollcall/Rollcall';
import {MR} from '../dev/mrollcall/timeline';

export const frames: FrameDef[] = [
  {id: 'mrollcall', component: MRollcall, durationInFrames: MR.frames, fps: 24},
  {id: 'mrollcall-sheet', component: MRollcallSheet},
  {id: 'mrollcall-hold', component: MRollcallHold, props: {g: MR.from}},
];
