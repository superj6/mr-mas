// MR. MAS — outro E, "file closed": the mock-up as ONE pure draw function per frame (runs in Remotion and in the
// Node preview). Frame m of the composition (o = m - 24):
//   m0-23     STAND-IN for the episode's last frame: the cold open's dark-room MEDIUM (drawMedium f56-62 cycle)
//   o0-149    the file window, full frame, scrolled to its end; the credits block lights one line per knee note
//             (o0-55); the caret appears on 2.1 (o60) and blinks on the beat; the terms + the pointer line on the
//             desktop's bottom line, outside the window, from o0
//   o128-141  the pointer travels in from frame-right to the close box (on 2s, ease-out); hover o142-147, press o148-149
//   o150-157  3.3 click; the window closes in 4 whole-pixel drawings toward the loop cursor: rows, line, dot, gone
//   o158-179  the black desktop: the loop cursor blinks on the beat (first on at o165), the terms line stays. The
//             outro ends o179 (every week)
//   o152-199  Ep1 only: the moth arrives with the collapsing light and lands on the terms line's period on 4.1 (o180)
import {Buf, W, H} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {drawMedium} from '../../mcoldopen/medium';
import {drawPointer} from '../../mfinale/callart';
import {PRE, EV, OUTRO, KNEE, toO, blinkOn} from './timeline';
import {drawEp1Window, drawTerms, drawSlug, drawStandinSlug, drawClose, drawEmber, drawCursor, CLOSE_AIM, ChromeState} from './window';
import {drawMoth, drawMothLanded} from './moth';
import {drawEp3, drawEp10} from './variants';

export interface OutroOpts { slug?: boolean; /** Ep1's moth (default on) */ sting?: boolean }

// ------------------------------------------------------------------ the pointer's path (o128-141)
const START: [number, number] = [486, 150];
const CTRL: [number, number] = [476, 52];
export const pointerAt = (o: number): [number, number] | null => {
  if (o < EV.pointer[0]) return null;
  if (o > EV.pointer[1]) return CLOSE_AIM;
  const steps = Math.ceil((EV.pointer[1] - EV.pointer[0] + 1) / 2); // 7 drawings on 2s
  const k = Math.floor((o - EV.pointer[0]) / 2) + 1;
  const t = 1 - Math.pow(1 - k / steps, 3); // ease-out
  const q = (a: number, c: number, e: number) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * e;
  return [Math.round(q(START[0], CTRL[0], CLOSE_AIM[0])), Math.round(q(START[1], CTRL[1], CLOSE_AIM[1]))];
};

const chromeAt = (o: number): ChromeState => ({
  hover: o >= EV.hover[0] && o <= EV.hover[1],
  press: o >= EV.press[0] && o <= EV.press[1],
});

// the window as it stood at the click, for the rows drawing
let clickFrame: Buf | null = null;
const atClick = () => {
  if (clickFrame) return clickFrame;
  const b = new Buf(W, H, PAL.N0);
  drawEp1Window(b, {press: true}, blinkOn(EV.click - 1));
  return (clickFrame = b);
};

/** how many of the credits block's 8 lines the knee has lit by outro frame o */
export const litAt = (o: number) => KNEE.filter((k) => o >= k).length;

/** the outro proper + (Ep1) the moth, at outro frame o (0..EV.end) */
export const drawOutro = (fb: Buf, o: number, opts: OutroOpts = {}) => {
  fb.c.fill(PAL.N0);
  const c = EV.close;
  if (o < EV.click) {
    drawEp1Window(fb, chromeAt(o), o >= EV.caret && blinkOn(o), litAt(o));
    const p = pointerAt(o);
    if (p) drawPointer(fb, p[0], p[1], chromeAt(o).press);
  } else if (o < c.gone) {
    drawClose(fb, atClick(), o < c.line ? 0 : o < c.dot ? 1 : 2);
  } else if (o === c.gone) {
    drawEmber(fb);
  } else if (o >= EV.desktop && blinkOn(o)) {
    drawCursor(fb);
  }
  // the desktop's bottom line: up from o0 to the end, never moved, never covered
  drawTerms(fb);
  if (opts.sting !== false) drawMoth(fb, o);
  if (opts.slug) drawSlug(fb);
};

/** the whole mock-up, at composition frame m: Ep1 (sting on) runs to o199, a plain week to o179 */
export const drawMockup = (fb: Buf, m: number, opts: OutroOpts = {}) => {
  if (m < PRE) {
    // the stand-in: the cold open's dark-room medium, its f56-62 drawings cycled so the rack and the city live
    drawMedium(fb, 56 + (m % 7));
    if (opts.slug) drawStandinSlug(fb);
    return;
  }
  drawOutro(fb, Math.min(toO(m), opts.sting === false ? OUTRO - 1 : EV.end), opts);
};

/** per-episode stills (the ladder): 3 = strawberry.jpg, 10 = pace.yaml; 1 = the Ep1 file for reference */
export const drawVariant = (fb: Buf, ep: 1 | 3 | 10, opts: OutroOpts = {}) => {
  fb.c.fill(PAL.N0);
  if (ep === 3) drawEp3(fb);
  else if (ep === 10) drawEp10(fb);
  else drawEp1Window(fb, {}, true);
  drawTerms(fb);
  if (opts.slug) drawSlug(fb);
};

/** a still of the final state (the desktop, the cursor on, the moth landed) */
export const drawEndState = (fb: Buf, opts: OutroOpts = {}) => {
  fb.c.fill(PAL.N0);
  drawCursor(fb);
  drawTerms(fb);
  drawMothLanded(fb);
  if (opts.slug) drawSlug(fb);
};
