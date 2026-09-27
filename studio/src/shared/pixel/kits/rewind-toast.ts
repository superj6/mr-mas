// MR. MAS — kit: THE ORB's REWIND TOAST with its year counter (Ep1 cold open sc 3–4). New file (v3-art-a, 2026-09-27).
// The toast is the call kit's system toast (kits/callgrid.ts callToast, with the v5 'rewind' transport glyph), so the
// Orb speaks in the same UI the board's call does; under it sits a small counter slot with the year, which rolls back
// like an odometer wheel (whole-pixel steps of the digit strip, never a blur filter): 2023 -> catches on 2022 and holds
// -> slips, faster and faster, 2019 · 2015 · 2008 · 2001. The 1-bit version (sc 4, `rewinding… too far`) is the same
// toast drawn in ink and paper for the 1993 frame (no year slot: it has overshot).
//   drawRewindToast(b, x, y, {k, year, roll, text})   k = frames since it popped (3 held rise steps); year = the digits
//                                                      shown; roll 0..1 = how far the ones wheel has turned toward the
//                                                      previous year (0 = settled, the slot reads cleanly)
//   yearAt(t)                                          the counter's year and roll for sc 3's scrub, t in seconds from
//                                                      the pop (the stick's cue times: 2023 to 0.5, 2022 to 1.55, then
//                                                      2019 · 2015 · 2008 · 2001 at 1.55 / 1.95 / 2.32 / 2.67)
//   drawRewindToast1bit(b, x, y, {k, text})            ink / paper (the ONEBIT set's two colours), for F1.1
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';
import {noticeIcon} from './callgrid';
import {pt, pw} from './uitype';
import {INK, PAPER} from '../cast/kit';

const DIG_H = 9;
/** one digit cell of the year slot, rolled `r` (0..1) toward the digit below it on the wheel (d - 1) */
const digit = (b: Buf, x: number, y: number, d: number, r: number, col: number, bg: number) => {
  const cell = new Buf(6, DIG_H * 2, bg);
  text(cell, String(d), 0, 1, col);
  text(cell, String((d + 9) % 10), 0, DIG_H + 1, col);
  const off = Math.round(r * DIG_H);
  for (let j = 0; j < DIG_H; j++) for (let i = 0; i < 6; i++) b.set(x + i, y + j, cell.c[(j + off) * 6 + i]);
};
export interface RewindToastState {
  /** frames since the toast popped (it rises in 3 held steps) */
  k: number;
  /** the year in the slot (null: no slot) */
  year?: number | null;
  /** 0..1: the ones wheel rolling toward the previous year */
  roll?: number;
  text?: string;
}
export const drawRewindToast = (b: Buf, x: number, y: number, s: RewindToastState) => {
  if (s.k < 0) return;
  const label = s.text ?? 'rewinding…';
  // the call kit's system toast (callgrid.ts callToast's box, its v5 'rewind' glyph), set with the kit type so the
  // ellipsis draws (the engine face has none)
  const w = pw(label) + 26, h = 15, rise = s.k < 3 ? [8, 4, 1][s.k] : 0, yy = y + rise;
  rect(x, yy, w, h, b.ink(PAL.N0)); rect(x + 1, yy + 1, w - 2, h - 2, b.ink(PAL.N3)); rect(x + 1, yy + 1, w - 2, 1, b.ink(PAL.N5));
  noticeIcon(b, x + 4, yy + 3, 'rewind');
  pt(b, label, x + 17, yy + 4, PAL.P1);
  if (s.year === null || s.year === undefined || s.k < 3) return;
  // the year slot hangs under the toast's left end: a dark counter window, four digit cells
  const sx = x + 16, sy = y + 16;
  rect(sx, sy, 32, 13, b.ink(PAL.N0)); rect(sx + 1, sy + 1, 30, 11, b.ink(PAL.N2));
  const ds = String(s.year).padStart(4, '0').split('').map(Number);
  const r = s.roll ?? 0;
  ds.forEach((d, i) => {
    // the ones wheel rolls; a tens wheel only rolls when the ones pass 0 (whole-wheel carries, like an odometer)
    const rr = i === 3 ? r : i === 2 && ds[3] === 0 ? r : 0;
    digit(b, sx + 3 + i * 7, sy + 2, d, rr, PAL.P1, PAL.N2);
  });
  rect(sx + 1, sy + 6, 30, 1, b.ink(PAL.N1)); // the wheel's seam (the counter's one mechanical line)
};

/** sc 3's counter (t in seconds from the toast's pop): the stick timeline's cue times */
export const yearAt = (t: number): {year: number; roll: number} => {
  const steps: Array<[number, number]> = [[0, 2023], [0.5, 2022], [1.55, 2019], [1.95, 2015], [2.32, 2008], [2.67, 2001]];
  let i = 0;
  while (i + 1 < steps.length && t >= steps[i + 1][0]) i++;
  const [t0, y] = steps[i];
  // after it slips (from 1.55 s), the wheel is always turning: the roll grows with the speed of the slip
  const roll = t < 1.55 ? (t > 0.42 && t < 0.5 ? 0.5 : 0) : Math.min(0.8, ((t - t0) * (i + 1)) % 1);
  return {year: y, roll};
};

/** F1.1: the same toast in ink and paper (the 1993 frame is ONEBIT) */
export const drawRewindToast1bit = (b: Buf, x: number, y: number, s: {k: number; text?: string}) => {
  if (s.k < 0) return;
  const label = s.text ?? 'rewinding… too far';
  const w = pw(label) + 26, h = 15;
  const rise = s.k < 3 ? [8, 4, 1][s.k] : 0;
  const yy = y + rise;
  rect(x + 2, yy + 2, w, h, b.ink(INK));
  rect(x, yy, w, h, b.ink(INK)); rect(x + 1, yy + 1, w - 2, h - 2, b.ink(PAPER));
  for (const ox of [0, 5]) for (let c = 0; c < 5; c++) for (let j = -c; j <= c; j++) b.set(x + 4 + ox + c, yy + 3 + 4 + j, INK);
  pt(b, label, x + 17, yy + 4, INK);
};
