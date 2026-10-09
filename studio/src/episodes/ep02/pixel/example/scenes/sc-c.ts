// MR. MAS — Ep2 v1 · example · scene C (the per-scene render's test bed; not the show): one shot, a car crossing.
import {defineScene, layouts, RH} from '../../kit';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';

const L = layouts();
L.add('ex-c1', {
  st: 'example: the bridge deck at dusk, a car crossing on k',
  draw: (fb, k) => {
    rect(0, 0, 480, RH, fb.ink(PAL.U1));
    rect(0, 140, 480, RH - 140, fb.ink(PAL.G2));
    rect(470 - k * 6, 120, 36, 16, fb.ink(PAL.R2));
  },
});

export const SCENE = defineScene({scene: 'C', layouts: L.all});
