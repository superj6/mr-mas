// MR. MAS — outro A: the INSERT. His monitor, full frame (a 5 px bezel), showing the session log in this
// month's skin. Ep1 = 1-BIT: paper #E9E6DA type on black, fixed-width, block cursor, a striped title bar.
// THE BAND (terms + pointer) is not on his monitor: it is the show's own UI strip under the picture (480 x 67 at
// y 203, the same band the other proposals and the episodes use), drawn on the UI layer, lit from o0 and out on the
// pull-back. It never moves, is never covered, and looks the same in every skin (the one thing that never changes).
// The window sits in the picture's top 203 px, so the band never covers the log.
import {Buf, W, H, rect} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {text, textWidth} from '../../../shared/pixel/font';
import {O, beatOn, typingSchedule} from './timeline';
import {EpText, TERMS, POINTER, CELL, COL, mono, monoWidth, creditRow, typed} from './text';
import {standin} from './standin';

export const INK = 0x0e0e10; // the ONEBIT pair (shared/pixel/palettes.ts ONEBIT)
export const PAPER = 0xe9e6da;

// ------------------------------------------------------------------ layout (native px)
export const BEZEL = 5;
export const SCR = {x: BEZEL, y: BEZEL, w: W - 2 * BEZEL, h: H - 2 * BEZEL}; // 470 x 260: the whole monitor
/** the band: the show's UI strip (pacing-model §9: the picture's action stays above y 203) */
export const BAND = {y: 203, h: 67};
export const TERMS_AT = {x: Math.floor((W - textWidth(TERMS)) / 2), y: 220};
export const POINTER_AT = {x: Math.floor((W - textWidth(POINTER)) / 2), y: 237};

const LINE = 13; // log line pitch
const PAD = 12;
export const WIN = (() => {
  const w = monoWidth(creditRow(['picture · music:', 'pixel art and original score, rendered in code'])) + 2 * PAD;
  const titleH = 11;
  const h = titleH + 1 + 7 + 11 + 6 + 5 * LINE + LINE + 6; // title, header, rule, 5 credits, prompt
  const x = Math.round((W - w) / 2);
  const y = SCR.y + Math.round((BAND.y - SCR.y - h) / 2); // centred in the picture above the band
  return {x, y, w, h, titleH, tx: x + PAD, headY: y + titleH + 1 + 7, ruleY: y + titleH + 1 + 7 + 11, line0: y + titleH + 1 + 7 + 11 + 6};
})();
export const lineY = (i: number) => WIN.line0 + i * LINE;

/** every line of text the viewer is asked to read, with its box (native px) and first readable outro frame; the
 *  QA reads this (tools/preview.ts `layout`), so build.py never mirrors the layout by hand */
export const textBoxes = (t: EpText) => {
  const sched = typingSchedule(t.credits);
  const title = t.title, tw = textWidth(title) + 10;
  const boxes: Array<{name: string; text: string; o0: number; o1: number; box: [number, number, number, number]}> = [
    {name: 'title bar', text: title, o0: O.paneFull, o1: O.pull - 1, box: [WIN.x + Math.round((WIN.w - tw) / 2), WIN.y + 1, WIN.x + Math.round((WIN.w - tw) / 2) + tw, WIN.y + WIN.titleH]},
    {name: 'header', text: t.header, o0: O.header, o1: O.pull - 1, box: [WIN.tx, WIN.headY - 1, WIN.tx + monoWidth(t.header) + 1, WIN.headY + 8]},
  ];
  t.credits.forEach((c, i) => boxes.push({
    name: `credit ${i + 1}`, text: `${c[0]} ${c[1]}`, o0: sched[i][1], o1: O.pull - 1,
    box: [WIN.tx, lineY(i) - 1, WIN.tx + monoWidth(creditRow(c)) + 1, lineY(i) + 8],
  }));
  boxes.push({name: 'terms', text: TERMS, o0: 0, o1: O.pull - 1, box: [TERMS_AT.x - 1, TERMS_AT.y - 1, TERMS_AT.x + textWidth(TERMS) + 1, TERMS_AT.y + 9]});
  boxes.push({name: 'pointer', text: POINTER, o0: 0, o1: O.pull - 1, box: [POINTER_AT.x - 1, POINTER_AT.y - 1, POINTER_AT.x + textWidth(POINTER) + 1, POINTER_AT.y + 9]});
  return boxes;
};

// ------------------------------------------------------------------ the band (UI layer; identical in every skin)
/** The band, lit: the interface strip's keylines, empty of verbs, carrying only the terms line and the pointer.
 *  Paper on dark (P1 / P0 on N1), dimmer than the log's paper, so the pane stays the thing to read first. */
export const drawBand = (ui: Buf) => {
  const y0 = BAND.y;
  rect(0, y0, W, BAND.h, ui.ink(PAL.N1));
  rect(0, y0, W, 1, ui.ink(PAL.N0));
  rect(0, y0 + 1, W, 1, ui.ink(PAL.N4));
  rect(0, y0 + 2, W, 1, ui.ink(PAL.N2));
  text(ui, TERMS, TERMS_AT.x, TERMS_AT.y, PAL.P1);
  text(ui, POINTER, POINTER_AT.x, POINTER_AT.y, PAL.P0);
};

// ------------------------------------------------------------------ the bezel (BASE: the monitor itself)
export const drawBezel = (b: Buf) => {
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const e = Math.min(x, y, W - 1 - x, H - 1 - y);
      if (e >= BEZEL) continue;
      b.set(x, y, e === BEZEL - 1 ? PAL.N0 : y === 0 ? PAL.G1 : PAL.N1);
    }
  // soft inner corners
  for (const [cx, cy] of [[SCR.x, SCR.y], [SCR.x + SCR.w - 1, SCR.y], [SCR.x, SCR.y + SCR.h - 1], [SCR.x + SCR.w - 1, SCR.y + SCR.h - 1]]) b.set(cx, cy, PAL.N0);
};

// ------------------------------------------------------------------ 1-BIT window chrome
const winChrome1 = (b: Buf, x: number, y: number, w: number, h: number, title: string | null) => {
  // drop shadow (paper, 1 px right/bottom), outline, black face
  rect(x + 2, y + h, w, 1, b.ink(PAPER)); rect(x + w, y + 2, 1, h - 1, b.ink(PAPER));
  rect(x, y, w, h, b.ink(PAPER));
  rect(x + 1, y + 1, w - 2, h - 2, b.ink(INK));
  if (h < 14) return;
  // title bar: paper pinstripes, a close box, the title knocked out of the stripes
  const tb = WIN.titleH;
  for (let j = 2; j < tb - 1; j += 2) rect(x + 2, y + j, w - 4, 1, b.ink(PAPER));
  rect(x + 1, y + tb, w - 2, 1, b.ink(PAPER));
  rect(x + 8, y + 2, 9, tb - 3, b.ink(INK)); rect(x + 9, y + 3, 7, tb - 5, b.ink(PAPER)); rect(x + 10, y + 4, 5, tb - 7, b.ink(INK));
  if (title) {
    const tw = textWidth(title) + 10;
    const tx = x + Math.round((w - tw) / 2);
    rect(tx, y + 1, tw, tb - 1, b.ink(INK));
    text(b, title, tx + 5, y + 2, PAPER);
  }
};

/** the pane's content at outro frame o (the log as typed so far), 1-BIT */
const drawLog1 = (b: Buf, o: number, t: EpText) => {
  const {tx, headY, ruleY} = WIN;
  let cur: [number, number] | null = null; // cursor cell (x, y)
  let busy = false;
  if (o >= O.header) {
    mono(b, t.header, tx, headY, PAPER);
    for (let x = tx; x < tx + monoWidth(t.header); x += 2) b.set(x, ruleY, PAPER);
  } else cur = [tx, headY];
  const sched = typingSchedule(t.credits);
  for (let i = 0; i < t.credits.length; i++) {
    const [start] = sched[i];
    const y = lineY(i);
    if (o < O.header) break;
    if (o < start) { if (!cur) cur = [tx, y]; continue; }
    const {shown, done, full} = typed(t.credits[i], start, o, O.cps);
    mono(b, full.slice(0, shown), tx, y, PAPER);
    if (o <= done) { cur = [tx + shown * CELL, y]; busy = true; }
  }
  if (!cur) {
    // the log is complete: the prompt, and the cursor parked after it
    const y = lineY(t.credits.length);
    mono(b, '>', tx, y, PAPER);
    cur = [tx + 2 * CELL, y];
  }
  if (busy || beatOn(o)) rect(cur[0], cur[1], 5, 7, b.ink(PAPER));
};

/** Ep1's INSERT at outro frame o (o0-149). o0-2: the act's picture steps down to black inside the bezel. */
export const drawInsert1 = (b: Buf, o: number, t: EpText) => {
  if (o < O.paneUp) {
    // the episode's picture going out in 3 drawings: one step down, three steps down (odd rows a step ahead: the LCD
    // going out), then black (the paper ramp has no black at its foot, so the last drawing is a fill, not a step)
    const k = o - O.stepDown;
    if (k >= 2) rect(0, 0, W, H, b.ink(INK));
    else {
      const s = standin();
      const d = k === 0 ? 1 : 3;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) b.set(x, y, stepColor(s.c[y * W + x], -(d + (y & 1))));
    }
    drawBezel(b);
    return;
  }
  // the desktop: 1-bit black
  rect(SCR.x, SCR.y, SCR.w, SCR.h, b.ink(INK));
  // the window opens in 3 drawings (a line, half, full), from its centre line
  const {x, y, w, h} = WIN;
  const step = Math.min(2, o - O.paneUp);
  if (step === 0) rect(x + 20, y + (h >> 1), w - 40, 1, b.ink(PAPER));
  else if (step === 1) winChrome1(b, x + 6, y + (h >> 2), w - 12, h >> 1, null);
  else {
    winChrome1(b, x, y, w, h, t.title);
    drawLog1(b, o, t);
  }
  drawBezel(b);
};

// ------------------------------------------------------------------ the pane as his monitor shows it (180 x 112)
/**
 * The same screen hand-set at monitor size for the room shot (greeked: every word a paper dash, not a
 * downsample): the desktop, the window, its title stripes and the log's lines. The insert's 470 x 260 screen maps
 * onto the room's 180 x 112 screen. There is no band on his monitor: the band was never his.
 * close: 0 the window up, 1 half its height, 2 a line, 3 gone (the session closes the way it opened, reversed).
 */
export const miniPane = (sw: number, sh: number, t: EpText, close: 0 | 1 | 2 | 3 = 0): Buf => {
  const b = new Buf(sw, sh, INK);
  if (close === 3) return b;
  const mx = (x: number) => Math.round(((x - SCR.x) * sw) / SCR.w), my = (y: number) => Math.round(((y - SCR.y) * sh) / SCR.h);
  const wx0 = mx(WIN.x), wx1 = mx(WIN.x + WIN.w), wy0 = my(WIN.y), wy1 = my(WIN.y + WIN.h);
  const cy = (wy0 + wy1) >> 1;
  if (close === 2) { rect(wx0 + 8, cy, wx1 - wx0 - 16, 1, b.ink(PAPER)); return b; }
  if (close === 1) {
    const hh = (wy1 - wy0) >> 1;
    rect(wx0 + 2, cy - (hh >> 1), wx1 - wx0 - 4, hh, b.ink(PAPER));
    rect(wx0 + 3, cy - (hh >> 1) + 1, wx1 - wx0 - 6, hh - 2, b.ink(INK));
    return b;
  }
  rect(wx0, wy0, wx1 - wx0, wy1 - wy0, b.ink(PAPER));
  rect(wx0 + 1, wy0 + 1, wx1 - wx0 - 2, wy1 - wy0 - 2, b.ink(INK));
  for (let j = 1; j < 4; j += 2) rect(wx0 + 1, wy0 + j, wx1 - wx0 - 2, 1, b.ink(PAPER));
  const tx = mx(WIN.tx);
  const greek = (s: string, y: number) => {
    let x = tx;
    for (const word of s.split(' ')) {
      if (word.length) rect(x, y, Math.max(1, Math.round(word.length * CELL * sw / SCR.w) - 1), 1, b.ink(PAPER));
      x += Math.round((word.length + 1) * CELL * sw / SCR.w);
    }
  };
  greek(t.header, my(WIN.headY + 3));
  t.credits.forEach((c, i) => greek(creditRow(c).replace(/ {2,}/g, ' '), my(lineY(i) + 3)));
  greek('> _', my(lineY(t.credits.length) + 3));
  return b;
};
export {COL};
