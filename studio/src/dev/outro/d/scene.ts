// MR. MAS — outro D, "the curve": the whole mock-up as one pure draw (Remotion + Node preview).
//   comp frame g = o + PRE.  g 0-23: the stand-in last frame (1 s) -> o0-1 the monitor's own curve lights up ->
//   o2-13 the room dissolves around it -> o12-23 the push-in, on the thread alone: the monitor's curve stretches out
//   into the full-frame chart's line (its rise breaks into the dotted future), the grid develops under it, the band
//   comes up -> o30 the title -> o60-104 the flat line (the human credits) -> o105-150 the leap in quarter notes (3
//   plates, the crane, the post box on the last F, the title's one upgrade) -> o153-239 the final frame (every credit
//   on screen; the moth comes to the post box's light and settles in its empty field on 4.1) -> o240-249 the frame
//   and the band step to black around the caret -> o255 the caret alone, with the f0 sound (the loop) -> out o269.
import {Buf, W, H, line} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {bayer4} from '../../../shared/pixel/dither';
import type {DrawResult} from '../../../shared/pixel/compose';
import {drawMedium, MED} from '../../mcoldopen/medium';
import {KNEE as MON_KNEE} from '../../mcoldopen/screen';
import {EpCfg, EP1} from './text';
import {PRE, EV, NOTES, blinkOn} from './timeline';
import {
  layoutFor, viewAt, drawChart, tierPass, drawAxes, drawThread, drawDot, drawPlate, penIdx, futureReach, mothAt,
  drawMoth, drawBand, drawSlug, drawTag, drawTitle, drawCaret, FLAT_Y, CARET, windowScreenRect, Layout, View,
} from './world';

// ------------------------------------------------------------------ the stand-in last frame (Ep1's button isn't built)
/** the cold open's dark-room MEDIUM at f56 (the brief's stand-in), cached: it is held, like a button's last frame */
let STANDIN: Buf | null = null;
export const standIn = () => {
  if (!STANDIN) STANDIN = drawMedium(new Buf(W, H, PAL.N0), 56);
  return STANDIN;
};

// ------------------------------------------------------------------ the monitor's curve (the cold open's, read-only)
/** The chart on Mas's monitor is drawn 1:1 at MED.screen by mcoldopen/screen.ts; its curve's formulas are private
 *  there, so they are mirrored here (same constants): flat from x 0 to the knee (134, 88), falling 3 px to the left;
 *  the rise a 1.75 power to the screen's top edge (clipped at screen row 0). Frame px. */
const MON_RISE_END = 177;
const monFlatY = (x: number) => MON_KNEE[1] + Math.round(3 * (1 - x / MON_KNEE[0]));
const monRiseY = (x: number) => MON_KNEE[1] - Math.round(Math.pow((x - MON_KNEE[0]) / (MON_RISE_END - MON_KNEE[0]), 1.75) * (MON_KNEE[1] + 3));
const [SX, SY] = MED.screen;
/** the monitor rise as a pixel path from the knee up (vertical runs filled), frame px, clipped to the screen */
const MON_RISE: Array<[number, number]> = (() => {
  const pts: Array<[number, number]> = [];
  let py = MON_KNEE[1];
  for (let x = MON_KNEE[0]; x <= MON_RISE_END; x++) {
    const y = monRiseY(x);
    for (let yy = py; yy >= y; yy--) if (yy >= 0) pts.push([SX + x, SY + yy]);
    py = y;
  }
  return pts;
})();

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** the push-in's progress 0..1 (o12-23, ease in-out) */
export const morphT = (o: number) => ease((o - EV.morph[0] + 1) / (EV.morph[1] - EV.morph[0] + 1));

/**
 * The thread before o24: at o0-11 it is the monitor's own curve, lit a step hotter, over the dissolving room; at
 * o12-23 every pixel of it travels to its place on the full-frame chart's line (the flat part stretches out to the
 * frame's left edge and down to the chart's flat line, the knee to the chart's knee, the rise up to the post box's
 * column). One line the whole way: the viewer never sees two charts. The rise breaks up as it goes, arriving as the
 * dotted future (every 3rd pixel, as drawThread draws it); the flat part arrives solid.
 */
const drawLiftedLine = (fb: Buf, L: Layout, v: View, o: number) => {
  const e = morphT(o);
  const lit = o <= EV.light[1];
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * e);
  // flat: one outro pixel per column, from the monitor's matching column
  const kx = L.kneeIdx;
  let prev: [number, number] | null = null;
  for (let x = 0; x < kx; x++) {
    const u = x / kx;
    const mx = SX + u * MON_KNEE[0], my = SY + monFlatY(u * MON_KNEE[0]);
    const px = lerp(mx, x - v.cx), py = lerp(my, FLAT_Y - v.cy);
    if (prev && Math.abs(prev[1] - py) > 1) line(prev[0], prev[1], px, py, fb.ink(PAL.C5));
    fb.set(px, py + 1, PAL.C1);
    if ((px & 1) === 0) fb.set(px, py - 1, PAL.C0);
    fb.set(px, py, lit ? PAL.C7 : e < 0.5 ? PAL.C6 : PAL.C5);
    prev = [px, py];
  }
  // the rise: path index j from the knee to the box, from the monitor rise's matching fraction
  const n = L.path.length - kx;
  for (let j = 0; j < n; j++) {
    const [wx, wy] = L.path[kx + j];
    const [mx, my] = MON_RISE[Math.round((j / Math.max(1, n - 1)) * (MON_RISE.length - 1))];
    const keep = j % 3 === 0 || L.cfg.machineLeads || ((j * 37) % 100) / 100 >= e;
    if (!keep) continue;
    const c = lit ? PAL.C8 : e < 0.6 ? PAL.C6 : PAL.C3;
    fb.set(lerp(mx, wx - v.cx), lerp(my, wy - v.cy), c);
  }
};

/** o2-13: the room's dissolve, 4 steps (o2, 5, 8, 11); black from o11 */
export const fadeStep = (o: number) => (o < EV.fade[0] ? 0 : Math.min(4, 1 + Math.floor((o - EV.fade[0]) / 3)));
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
  drawChart(fb, v, L.tier1Y);
  tierPass(fb, L, v);
  drawAxes(fb, L, v);
  // o14-25: the chart develops in on an ordered dither (nothing of it shows before the room has gone)
  if (o <= EV.grid[1]) {
    const t = (o - EV.grid[0] + 1) / (EV.grid[1] - EV.grid[0] + 1);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (t <= 0 || bayer4(x, y) >= t) fb.c[y * W + x] = PAL.N0;
  }
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
  const lead = cfg.machineLeads ? 15 : 0;
  if (o <= EV.morph[1]) drawLiftedLine(fb, L, v, o);
  else {
    const pen = penIdx(L, o);
    drawThread(fb, L, v, pen, {
      future: cfg.machineLeads ? -1 : futureReach(L, o),
      tip: !cfg.machineLeads && o >= EV.climb && o < NOTES[7],
    });
  }
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
