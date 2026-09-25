// MR. MAS — mdinner1: intro frames 225-359, THE WOODROSE opening + the GERG and ALYI cards (pixel edition).
//   mdinner1            the span, 135 frames @ 24 fps; local frame f = global intro frame f + 225
//   mdinner1-<name>     key stills (1920x1080), each holding one GLOBAL frame
// Code: src/dev/mdinner1/ (scene.ts = the staging, timeline.ts = beats/camera, notes/mdinner1.md).
import type {FrameDef} from '../shared/frame-def';
import {Mdinner1} from '../dev/mdinner1/Mdinner1';
import {MD1, toLocal} from '../dev/mdinner1/timeline';

/** The key frames (global intro frame numbers). */
export const MDINNER1_KEYS: Record<string, number> = {
  opening: 237, // 2015 · the dinner: Gerg's popcorn keys, the napkin website, Mas steepled in the window
  'gerg-card': 253, // GERG print (the one frozen beat): the card, Mas in colour holding the CTRL key, looking at us
  ctrl: 251, // Mas holds up the CTRL key he just plucked out of the frozen air (the legend is on the cap)
  cathedral: 299, // the wall is a server cathedral, Alyi levitates, the effigy burns
  'alyi-card': 334, // the ALYI card holds over the live room: token eyes; Mas toasts a marshmallow on the burning effigy
  vault: 359, // hand-off: the vault is open, MARIO steps out, finger up
};

export const frames: FrameDef[] = [
  {id: 'mdinner1', component: Mdinner1, durationInFrames: MD1.frames, fps: 24},
  ...Object.entries(MDINNER1_KEYS).map(([name, g]) => ({id: `mdinner1-${name}`, component: Mdinner1, props: {hold: toLocal(g)}})),
];
