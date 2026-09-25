// MR. MAS — meras: the span's frame pipeline (pure, no DOM). `merasScene` is a PixelScene props object whose
// frame argument is LOCAL (0..119); every era module works in GLOBAL intro frames (g = local + 120).
import {Buf} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
import type {PixelSceneProps} from '../../shared/pixel/compose';
import {renderFront, frontPos} from '../../shared/pixel/transitions';
import {draw1993, STAIR} from './era1993';
import {draw2008} from './era2008';
import {draw2014} from './era2014';
import {draw2015} from './era2015';
import {MERAS_START, T} from './timeline';

/** where the render front meets the staircase line (the "tip" it chases), or null */
const stairAt = (x: number): number | null => {
  for (let k = 0; k + 1 < STAIR.length; k++) {
    const [x0, y0] = STAIR[k], [x1, y1] = STAIR[k + 1];
    if (y0 === y1 && x >= Math.min(x0, x1) && x <= Math.max(x0, x1)) return y0;
    if (x0 === x1 && x === x0) return Math.min(y0, y1);
  }
  return null;
};

const drawFront93to08 = (fb: Buf, g: number) => {
  const a = new Buf(fb.w, fb.h), b = new Buf(fb.w, fb.h);
  draw1993(a, g, {noDialog: true});
  draw2008(b, g);
  const {pos, smear} = frontPos(g, T.fire, T.frontFrames, fb.w, 5);
  renderFront(fb, a, b, pos, {dir: 'right', smear, glow: 5, core: [0xffffff, 0xccffff, 0x66ccff, 0x3399cc, 0x336699], tear: 1});
  // the tip: a hot spark riding the curve where the beam crosses it; past the curve's end it climbs off
  const y = stairAt(pos);
  if (y !== null) {
    for (let k = -2; k <= 2; k++) { fb.set(pos + k, y, 0xffffff); fb.set(pos, y + k, 0xffffff); }
    fb.set(pos - 1, y - 1, 0xccffff); fb.set(pos + 1, y + 1, 0xccffff); fb.set(pos + 1, y - 1, 0xccffff); fb.set(pos - 1, y + 1, 0xccffff);
  }
};

export const merasDraw = (fb: Buf, local: number) => {
  const g = local + MERAS_START;
  if (g < T.fire) draw1993(fb, g);
  else if (g < T.fire + T.frontFrames) drawFront93to08(fb, g);
  else if (g < T.y14) draw2008(fb, g);
  // 4.2 (f195): a hard cut on the brass stab, straight into 2014 (no wipe: the transition vocabulary stays four)
  else if (g < T.whip) draw2014(fb, g);
  else draw2015(fb, g);
};

export const merasScene: PixelSceneProps = {draw: merasDraw, bg: PAL.N0};
