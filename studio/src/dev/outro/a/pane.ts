// MR. MAS — outro A: the INSERT. His monitor, full frame (a 5 px bezel), showing the session log in this
// month's skin. Ep1 = 1-BIT: paper #E9E6DA type on black, fixed-width, block cursor, a striped title bar.
// Second polish pass: ONE block in ONE face. Everything the viewer reads is in this window, top to bottom, in the
// fixed-width setting: the title bar, the header, three credit rows, a dotted rule, then the legal block (the terms
// on two rows and the pointer) and the prompt. There is no band under the picture any more. The credits type; the
// terms print whole, in one frame, and then never move (the brief: never animated, never covered); the pointer
// prints under them a beat later, as its own event, so the eye goes to it.
import {Buf, W, H, rect} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {O, beatOn, typingSchedule} from './timeline';
import {EpText, LEGAL_ROWS, TERMS_ROWS, POINTER, CELL, COL, mono, monoWidth, creditRow, typed} from './text';
import {standin} from './standin';

export const INK = 0x0e0e10; // the ONEBIT pair (shared/pixel/palettes.ts ONEBIT)
export const PAPER = 0xe9e6da;

// ------------------------------------------------------------------ layout (native px)
export const BEZEL = 5;
export const SCR = {x: BEZEL, y: BEZEL, w: W - 2 * BEZEL, h: H - 2 * BEZEL}; // 470 x 260: the whole monitor

const LINE = 13; // log line pitch
const PAD = 12;
const TITLE_H = 11;

export interface WinLayout {
  x: number; y: number; w: number; h: number; titleH: number;
  /** text left edge, text columns (cells) */
  tx: number; cols: number;
  headY: number; ruleY: number;
  /** credit rows (incl. an Ep10 extra row) */
  rows: number[];
  rule2Y: number;
  /** the legal block: terms row 1, terms row 2, pointer */
  legal: number[];
  promptY: number;
}

const layouts = new Map<number, WinLayout>();
/** the window for an episode's text (Ep10 has one more credit row); centred on the monitor, a touch high */
export const winFor = (t: EpText): WinLayout => {
  let L = layouts.get(t.ep);
  if (L) return L;
  const rowsN = t.credits.length + (t.extra ? 1 : 0);
  const cols = Math.max(...LEGAL_ROWS.map((s) => s.length), ...t.credits.map((c) => creditRow(c).length),
    t.header.length + 2 + (t.date?.length ?? 0));
  const w = cols * CELL - 1 + 2 * PAD;
  // positions relative to the window's top: title bar, header, rule, credit rows, rule, legal rows, prompt
  const headR = TITLE_H + 1 + 7;
  const ruleR = headR + 11;
  const line0R = ruleR + 6;
  const rule2R = line0R + rowsN * LINE - 1;
  const legal0R = rule2R + 6;
  const promptR = legal0R + 3 * LINE;
  const h = promptR + 7 + 7;
  const x = Math.round((W - w) / 2);
  const y = SCR.y + Math.floor((SCR.h - h) * 0.46);
  const rows = Array.from({length: rowsN}, (_, i) => y + line0R + i * LINE);
  const legal = [0, 1, 2].map((j) => y + legal0R + j * LINE);
  L = {x, y, w, h, titleH: TITLE_H, tx: x + PAD, cols, headY: y + headR, ruleY: y + ruleR, rows, rule2Y: y + rule2R,
    legal, promptY: y + promptR};
  layouts.set(t.ep, L);
  return L;
};

/** every line of text the viewer is asked to read, with its box (native px) and first readable outro frame; the
 *  QA reads this (tools/preview.ts `layout`), so build.py never mirrors the layout by hand */
export const textBoxes = (t: EpText) => {
  const L = winFor(t);
  const sched = typingSchedule(t.credits);
  const tw = monoWidth(t.title) + 10;
  const tbx = L.x + Math.round((L.w - tw) / 2);
  const last = O.pull - 1;
  /** o0 = the frame the line is complete; from = its first visible character (a reader can read along) */
  const boxes: Array<{name: string; text: string; kind: 'glance' | 'read'; from: number; o0: number; o1: number; box: [number, number, number, number]}> = [
    {name: 'title bar', text: t.title, kind: 'glance', from: O.paneFull, o0: O.paneFull, o1: last, box: [tbx, L.y + 1, tbx + tw, L.y + L.titleH]},
    {name: 'header', text: t.header + (t.date ? ` ${t.date}` : ''), kind: 'glance', from: O.header, o0: O.header, o1: last,
      box: [L.tx, L.headY - 1, L.tx + monoWidth(' '.repeat(L.cols)) + 1, L.headY + 8]},
  ];
  t.credits.forEach((c, i) => boxes.push({
    name: `credit ${i + 1}`, text: `${c[0]} ${c[1]}`, kind: 'read', from: sched[i][0], o0: sched[i][1], o1: last,
    box: [L.tx, L.rows[i] - 1, L.tx + monoWidth(creditRow(c)) + 1, L.rows[i] + 8],
  }));
  LEGAL_ROWS.forEach((s, j) => boxes.push({
    name: j < 2 ? `terms ${j + 1}` : 'pointer', text: s, kind: 'read', from: j < 2 ? O.legal : O.pointer, o0: j < 2 ? O.legal : O.pointer, o1: last,
    box: [L.tx, L.legal[j] - 1, L.tx + monoWidth(s) + 1, L.legal[j] + 8],
  }));
  return boxes;
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
  // title bar: paper pinstripes, a close box, the title knocked out of the stripes (the same fixed-width face)
  const tb = TITLE_H;
  for (let j = 2; j < tb - 1; j += 2) rect(x + 2, y + j, w - 4, 1, b.ink(PAPER));
  rect(x + 1, y + tb, w - 2, 1, b.ink(PAPER));
  rect(x + 8, y + 2, 9, tb - 3, b.ink(INK)); rect(x + 9, y + 3, 7, tb - 5, b.ink(PAPER)); rect(x + 10, y + 4, 5, tb - 7, b.ink(INK));
  if (title) {
    const tw = monoWidth(title) + 10;
    const tx = x + Math.round((w - tw) / 2);
    rect(tx, y + 1, tw, tb - 1, b.ink(INK));
    mono(b, title, tx + 5, y + 2, PAPER);
  }
};

const dotted = (b: Buf, x0: number, x1: number, y: number) => { for (let x = x0; x < x1; x += 2) b.set(x, y, PAPER); };

/** the pane's content at outro frame o (the log as typed so far), 1-BIT */
const drawLog1 = (b: Buf, o: number, t: EpText) => {
  const L = winFor(t);
  const {tx} = L;
  const fullW = monoWidth(' '.repeat(L.cols));
  let cur: [number, number] | null = null; // cursor cell (x, y)
  let busy = false;
  if (o >= O.header) {
    mono(b, t.header, tx, L.headY, PAPER);
    if (t.date) mono(b, t.date, tx + (L.cols - t.date.length) * CELL, L.headY, PAPER);
    dotted(b, tx, tx + fullW, L.ruleY);
  } else cur = [tx, L.headY];
  const sched = typingSchedule(t.credits);
  for (let i = 0; i < t.credits.length; i++) {
    const [start] = sched[i];
    const y = L.rows[i];
    if (o < O.header) break;
    if (o < start) { if (!cur) cur = [tx, y]; continue; }
    const {shown, done, full} = typed(t.credits[i], start, o, O.cps);
    mono(b, full.slice(0, shown), tx, y, PAPER);
    if (o <= done) { cur = [tx + shown * CELL, y]; busy = true; }
  }
  if (o >= O.legal) {
    // the terms, printed whole under the rule (both rows in one frame); then the pointer and the prompt, a beat later
    dotted(b, tx, tx + fullW, L.rule2Y);
    TERMS_ROWS.forEach((s, j) => mono(b, s, tx, L.legal[j], PAPER));
    if (o >= O.pointer) {
      mono(b, POINTER, tx, L.legal[2], PAPER);
      mono(b, '>', tx, L.promptY, PAPER);
      cur = [tx + 2 * CELL, L.promptY];
    } else cur = [tx, L.legal[2]]; // parked where the pointer will print
  } else if (!cur) cur = [tx, L.legal[0]]; // parked where the print will land
  if (busy || beatOn(o)) rect(cur[0], cur[1], 5, 7, b.ink(PAPER));
};

/** Ep1's INSERT at outro frame o (o0 to the pull). o0-2: the act's picture steps down to black inside the bezel. */
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
  const {x, y, w, h} = winFor(t);
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
 * onto the room's 180 x 112 screen.
 * close: 0 the window up, 1 half its height, 2 a line, 3 gone (the session closes the way it opened, reversed).
 */
export const miniPane = (sw: number, sh: number, t: EpText, close: 0 | 1 | 2 | 3 = 0): Buf => {
  const b = new Buf(sw, sh, INK);
  if (close === 3) return b;
  const L = winFor(t);
  const mx = (x: number) => Math.round(((x - SCR.x) * sw) / SCR.w), my = (y: number) => Math.round(((y - SCR.y) * sh) / SCR.h);
  const wx0 = mx(L.x), wx1 = mx(L.x + L.w), wy0 = my(L.y), wy1 = my(L.y + L.h);
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
  const tx = mx(L.tx);
  const greek = (s: string, y: number, x0 = tx) => {
    let x = x0;
    for (const word of s.split(' ')) {
      if (word.length) rect(x, y, Math.max(1, Math.round(word.length * CELL * sw / SCR.w) - 1), 1, b.ink(PAPER));
      x += Math.round((word.length + 1) * CELL * sw / SCR.w);
    }
  };
  greek(t.header, my(L.headY + 3));
  if (t.date) greek(t.date, my(L.headY + 3), mx(L.tx + (L.cols - t.date.length) * CELL));
  t.credits.forEach((c, i) => greek(creditRow(c).replace(/ {2,}/g, ' '), my(L.rows[i] + 3)));
  LEGAL_ROWS.forEach((s, j) => greek(s, my(L.legal[j] + 3)));
  greek('> _', my(L.promptY + 3));
  return b;
};
export {COL, TERMS_ROWS, POINTER};
