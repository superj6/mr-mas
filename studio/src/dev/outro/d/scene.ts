// MR. MAS — outro D, "the curve": the whole mock-up as one pure draw (Remotion + Node preview).
//   comp frame g = o + PRE.  g 0-23: the stand-in last frame (1 s) -> o0-29 the thread lifts off the desk, the room
//   dissolves to the chart, the band comes up -> o30 the title -> o60-104 the flat line (2 plates) -> o105-150 the
//   leap in quarter notes (3 plates, the crane, the post box on the last F) -> o150-239 the final frame (MR. MAS beside
//   the empty post box; the moth lands on it on 4.1) -> o240-249 the frame steps to black around the caret -> o255 the
//   caret alone, with the f0 sound (the loop) -> out o269.
import {Buf, W, H} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {bayer4} from '../../../shared/pixel/dither';
import type {DrawResult} from '../../../shared/pixel/compose';
import {drawMedium, MED} from '../../mcoldopen/medium';
import {EpCfg, EP1} from './text';
import {PRE, EV, NOTES, CRANE, blinkOn} from './timeline';
import {
  layoutFor, viewAt, drawChart, tierPass, drawAxes, drawThread, drawDot, drawPlate, penIdx, futureReach, mothAt,
  drawMoth, drawBand, drawSlug, drawTag, drawTitle, drawCaret, FLAT_Y, CARET, windowScreenRect,
} from './world';

// ------------------------------------------------------------------ the stand-in last frame (Ep1's button isn't built)
/** the cold open's dark-room MEDIUM at f56 (the brief's stand-in), cached: it is held, like a button's last frame */
let STANDIN: Buf | null = null;
export const standIn = () => {
  if (!STANDIN) STANDIN = drawMedium(new Buf(W, H, PAL.N0), 56);
  return STANDIN;
};

/** o0-4: the thread draws itself along the desk's lit front edge, left to right (96 px a frame, a hot pen tip);
 *  o4-14: it peels up off the desk into the flat line, in whole-pixel steps (ease-out). World px (the desk edge is
 *  at screen MED.deskY; before the crane the world sits CRANE px higher on screen). */
const LIFT_FROM = MED.deskY + CRANE;
const DRAW_ON = 5;
export const drawOnReach = (o: number) => (o < DRAW_ON ? (o + 1) * 96 - 1 : Infinity);
export const liftAt = (o: number) => {
  if (o >= EV.lift[1]) return 0;
  if (o < DRAW_ON - 1) return LIFT_FROM - FLAT_Y;
  const t = (o - (DRAW_ON - 1)) / (EV.lift[1] - (DRAW_ON - 1));
  const e = 1 - (1 - t) * (1 - t) * (1 - t);
  return Math.round((LIFT_FROM - FLAT_Y) * (1 - e));
};

/** o6-23: a 3-step Bayer dissolve of the last frame into the chart (what remains steps down its own ramps); gone at o24 */
export const fadeStep = (o: number) => (o < EV.fade[0] ? 0 : Math.min(4, 1 + Math.floor((o - EV.fade[0]) / 6)));
/** o240-249: the out, 4 steps (o240, 243, 246, 249), then black */
export const outStep = (o: number) => (o < EV.out ? 0 : Math.min(4, 1 + Math.floor((o - EV.out) / 3)));

export interface FrameInfo {
  /** the post box's text field on screen (native), when a machine render goes in it */
  machineWin: [number, number, number, number] | null;
}

/** Paint outro frame o (-PRE..OUT-1) for episode cfg. */
export const drawOutro = (fb: Buf, o: number, cfg: EpCfg = EP1): FrameInfo => {
  const info: FrameInfo = {machineWin: null};
  if (o < 0) { fb.c.set(standIn().c); return info; }
  const L = layoutFor(cfg);
  const v = viewAt(o);
  drawChart(fb, v);
  tierPass(fb, L, v);
  drawAxes(fb, L, v);
  const k = fadeStep(o);
  if (k < 4) {
    const s = standIn();
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (k > 0 && bayer4(x, y) < k / 4) continue;
        fb.c[i] = k ? stepColor(s.c[i], -k) : s.c[i];
      }
  }
  const pen = penIdx(L, o);
  const lead = cfg.machineLeads ? 15 : 0;
  drawThread(fb, L, v, pen, {
    future: cfg.machineLeads ? -1 : futureReach(L, o), lift: liftAt(o), reach: drawOnReach(o),
    tip: !cfg.machineLeads && o >= EV.climb && o < NOTES[7],
  });
  if (o >= EV.dot - lead) drawDot(fb, L, v, o);
  for (const p of L.plates) drawPlate(fb, p, v, o);
  drawTitle(fb, L, o);
  drawMoth(fb, mothAt(L, o));
  if (cfg.tiers.top === 'machine') info.machineWin = windowScreenRect(L, v, o);
  // the out: the frame steps to black on an ordered dither; the post box's caret stays, on the beat, in place
  const s = outStep(o);
  if (s > 0) {
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        fb.c[i] = s >= 4 || bayer4(x, y) < s / 4 ? PAL.N0 : stepColor(fb.c[i], -s);
      }
    info.machineWin = null;
    if (blinkOn(o)) drawCaret(fb, CARET[0] - v.cx, CARET[1] - v.cy);
  }
  return info;
};

/** the UI layer (never palette-mapped): the band and the lookdev slug */
export const drawOutroUI = (ui: Buf, o: number, cfg: EpCfg = EP1): void | DrawResult => {
  void cfg;
  if (o < 0) drawTag(ui, 'STAND-IN: COLD OPEN F56 (EP1 BUTTON NOT BUILT)');
  if (o >= 0) drawBand(ui, o);
  drawSlug(ui);
};

export {PRE};
