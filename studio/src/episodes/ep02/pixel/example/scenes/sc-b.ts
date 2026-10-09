// MR. MAS — Ep2 v1 · example · scene B (the per-scene render's test bed; not the show): the V.O., then a dither exit
// into scene C's first frame (so scene C's first shot is part of scene B's cache key).
import {defineScene, layouts, RH} from '../../kit';
import {rect} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';

const L = layouts();
L.add('ex-b1', {
  st: 'example: the dark room, a monitor glow stepping on f',
  draw: (fb, k, sh, f) => {
    rect(0, 0, 480, RH, fb.ink(PAL.C0));
    rect(300, 70, 120, 70, fb.ink(f % 24 < 12 ? PAL.C3 : PAL.C4));
  },
});
L.add('ex-b2', {
  st: 'example: the dark room, wide; a 12-frame bayer dissolve into scene C',
  exit: {kind: 'dither', frames: 12},
  draw: (fb) => {
    rect(0, 0, 480, RH, fb.ink(PAL.C0));
    rect(0, 160, 480, RH - 160, fb.ink(PAL.C1));
  },
});

export const SCENE = defineScene({scene: 'B', layouts: L.all});
