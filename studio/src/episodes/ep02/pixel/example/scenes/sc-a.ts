// MR. MAS — Ep2 v1 · example · scene A (the per-scene render's test bed; not the show): two shots, a rail.
import {defineScene, layouts, RH} from '../../kit';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';

const L = layouts();
L.add('ex-a1', {
  st: 'example: a flat wall and floor, a bar crossing on k',
  draw: (fb, k) => {
    rect(0, 0, 480, RH, fb.ink(PAL.N3));
    rect(0, 150, 480, RH - 150, fb.ink(PAL.N5));
    rect(20 + k * 8, 60, 24, 60, fb.ink(PAL.W6));
  },
});
L.add('ex-a2', {
  st: 'example: the wall, a lamp blinking on f (the scene frame) every 6 frames',
  draw: (fb, k, sh, f) => {
    rect(0, 0, 480, RH, fb.ink(PAL.N3));
    rect(0, 150, 480, RH - 150, fb.ink(PAL.N5));
    rect(220, 40, 40, 40, fb.ink(Math.floor(f / 6) % 2 ? PAL.W7 : PAL.W3));
  },
});

export const SCENE = defineScene({scene: 'A', layouts: L.all});
