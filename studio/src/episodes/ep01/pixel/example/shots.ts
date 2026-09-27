// MR. MAS — Ep1 pixel pipeline (P0): THE WORKED EXAMPLE for shot passes. NOT a segment of the show: it runs the
// pipeline on the v3 stick sample (show/reel/trials/ep01-v3-sample.json: three excerpts, pre-laps, Mas's inner voice,
// reviewer slates, beat lengths that are not whole frames) with three placeholder layouts on the existing bullpen art,
// so every host feature shows: the V.O. line above the band, a pre-lapped line, a room-scale mouth from the take, a mark
// on a word, an enter transition, the reviewer slates (drawn by the host), and STAND-INS for every other shot.
// Re-lock:  python3 studio/src/episodes/ep01/pixel/tools/lock.py --seg example --label "ACT ONE (EXAMPLE: THE v3 SAMPLE)" \
//             --timeline show/reel/trials/ep01-v3-sample.json --takes audio/ep01/act1/dialogue/lines-fast-v1.json \
//             --takes audio/ep01/act2/dialogue/lines-fast-v2.json --takes audio/ep01/act3/dialogue/lines-fast-v2.json \
//             --takes audio/ep01/act4/dialogue/lines-v5.json --takes audio/ep01/v3-sample/lines-vo-v2.json \
//             --mix audio/reel/ep01-v3-sample/mix.wav --mix-offset 0
import {defineSegment, layouts, held, mk, drawTexts, roomMouth} from '../kit';
import type {PxShot} from '../kit';
import type {Buf} from '../../../../shared/pixel/px';
import {drawBullpen} from '../../../../shared/pixel/rooms/bullpen';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../shared/pixel/cast/mas-stand';
import {drawGergStand, GERG_STAND_DEFAULT} from '../../../../shared/pixel/cast/gerg-stand';
import {LOCK} from './data';

const L = layouts();
const room = (fb: Buf) => held(fb, 'example:bullpen-day', (b) => { drawBullpen(b, 0, {variant: 'day', door: 'shut'}); });
/** the launch-night bullpen: Mas by his end desk, Gerg standing at his, typing; Gerg's mouth at room scale. Only
 *  committed art (the art passes' new modules may still change) */
const launch = (fb: Buf, k: number, sh: PxShot, typingFast: boolean) => {
  const out = drawBullpen(fb, 0, {variant: 'day', door: 'shut'}); // the room caches its own drawing; `front` repaints the bench
  drawMasStand(fb, 300, 178, {...MAS_STAND_DEFAULT, blink: k % 97 < 2});
  drawGergStand(fb, 236, 176, {...GERG_STAND_DEFAULT, type: (typingFast ? (k >> 1) % 3 : (k >> 2) % 3) as 0 | 1 | 2, mouth: roomMouth(sh, k, 'GERG') === 'open' ? 'open' : 'rest'});
  out.front?.(fb);
  drawTexts(fb, sh, k);
};
L.add('5.01', {st: 'EXAMPLE · rooms/bullpen drawBullpen (day, door shut), held; the lock\'s texts by the host\'s default drawTexts', enter: {kind: 'dip', frames: 8},
  draw: (fb, k, sh) => { room(fb); drawTexts(fb, sh, k); }});
L.add('5.02', {st: 'EXAMPLE · the bullpen + cast/mas-stand + cast/gerg-stand; Gerg types faster from the word "shipping" (a mark on the pre-lapped line)',
  face: {GERG: 'room'}, marks: {push: ['w', 'e1-a1-5-01', 'shipping', 0]},
  draw: (fb, k, sh) => launch(fb, k, sh, k >= mk(sh, 'push', 1e9))});
L.add('5.03', {st: 'EXAMPLE · the same set-up (a two-shot stand-in for a real one); Gerg\'s room-scale mouth from his takes', face: {GERG: 'room'},
  draw: (fb, k, sh) => launch(fb, k, sh, false)});

export const SEGMENT = defineSegment({seg: 'example', lock: LOCK, layouts: L.all, options: {standin: 'stick'}});
