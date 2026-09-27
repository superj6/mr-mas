// MR. MAS — kit: F1.1 · 1993, the 1-bit dialog (Ep1 cold open sc 4). New file (v3-art-a, 2026-09-27).
// The script: a paper-white field inside a 3:2 pillarbox, the `1993` date card at its top-left, and floating alone in
// the middle a 1-bit alert: `Are you sure?`, and under it OK and Cancel, Cancel greyed out with a 50% dither. The frame is
// a plain single rule (no double-border alert frame, no bomb or stop icon), and there is no computer, desk or hand.
// Drawn straight in the ONEBIT set's ink and paper (cast/kit.ts INK / PAPER), the intro's own 1993 look
// (dev/meras/era1993.ts drawDialog: its button drawings, the System-7-style greyed Cancel and OK's default ring,
// re-drawn here so shipped code doesn't import a dev folder). The intro's dialog says `MAS MANALT / no equity.` and
// Act Four's says `MAS MANALT`; this one only asks, so the three build.
//   draw1993Dialog(b, {k, question, okDown})   k = frames since the cut (0: the field; 1-2: the dialog opens in two
//                                              held steps; 3+: whole); question defaults to 'Are you sure?' (the
//                                              room's alternative: 'Continue?')
//   DLG1993                                    the dialog's rect (for the toast's placement)
import {Buf, rect} from '../px';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from '../font';
import {INK, PAPER} from '../cast/kit';

const RH = 203;
/** the 3:2 pillarbox inside the 480 x 203 room area: 304 wide, centred */
export const PILLAR = {x0: 88, x1: 392};
export const DLG1993 = {x: 150, y: 70, w: 180, h: 64};

const roundRect = (b: Buf, x: number, y: number, w: number, h: number, col: number) => {
  rect(x + 2, y, w - 4, 1, b.ink(col)); rect(x + 2, y + h - 1, w - 4, 1, b.ink(col));
  rect(x, y + 2, 1, h - 4, b.ink(col)); rect(x + w - 1, y + 2, 1, h - 4, b.ink(col));
  b.set(x + 1, y + 1, col); b.set(x + w - 2, y + 1, col); b.set(x + 1, y + h - 2, col); b.set(x + w - 2, y + h - 2, col);
};

export const draw1993Dialog = (b: Buf, o: {k?: number; question?: string; okDown?: boolean; card?: boolean} = {}) => {
  const k = o.k ?? 99;
  // the pillarbox bars and the paper field
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, x < PILLAR.x0 || x >= PILLAR.x1 ? INK : PAPER);
  // the date card, top-left inside the pillarbox: the era stamp's design (the display face on an ink plate, its rule)
  if (o.card !== false) {
    const s = '1993', w = bigTextWidth(s), cx = PILLAR.x0 + 10, cy = 10;
    rect(cx - 4, cy - 4, w + 8, BIG_CAP + 9, b.ink(INK));
    bigText(b, s, cx, cy, PAPER, {shadow: INK, deep: true});
    rect(cx, cy + BIG_CAP + 2, w, 1, b.ink(PAPER));
  }
  if (k < 1) return;
  const {x, y, w, h} = DLG1993;
  if (k < 3) {
    // the open: two held outline steps from the centre (a 1993 zoom-rect), then the dialog whole
    const f = k === 1 ? 0.35 : 0.7;
    const ww = Math.round(w * f), hh = Math.round(h * f), xx = x + Math.round((w - ww) / 2), yy = y + Math.round((h - hh) / 2);
    rect(xx, yy, ww, 1, b.ink(INK)); rect(xx, yy + hh - 1, ww, 1, b.ink(INK)); rect(xx, yy, 1, hh, b.ink(INK)); rect(xx + ww - 1, yy, 1, hh, b.ink(INK));
    return;
  }
  // a hard drop shadow, one plain rule, paper inside
  rect(x + 3, y + 3, w, h, b.ink(INK));
  rect(x, y, w, h, b.ink(INK)); rect(x + 1, y + 1, w - 2, h - 2, b.ink(PAPER));
  const q = o.question ?? 'Are you sure?';
  bigText(b, q, x + Math.round((w - bigTextWidth(q)) / 2), y + 10, INK);
  // the buttons: Cancel greyed out (50% frame and knocked-out text), OK the default (its thick ring)
  const bw = 52, bh = 17, by = y + h - bh - 9;
  const cx = x + 24, ox = x + w - 24 - bw;
  roundRect(b, cx, by, bw, bh, INK);
  for (let i = 0; i < bw; i++) for (const j of [0, bh - 1]) if ((cx + i + by + j) & 1) b.set(cx + i, by + j, PAPER);
  for (let j = 0; j < bh; j++) for (const i of [0, bw - 1]) if ((cx + i + by + j) & 1) b.set(cx + i, by + j, PAPER);
  const lab = 'Cancel', tmp = new Buf(bw, 10, PAPER);
  text(tmp, lab, Math.round((bw - textWidth(lab)) / 2), 0, INK);
  for (let j = 0; j < 10; j++) for (let i = 0; i < bw; i++) if (tmp.c[j * bw + i] === INK && !((i & 1) && (j & 1))) b.set(cx + i, by + 5 + j, INK);
  roundRect(b, ox, by, bw, bh, INK);
  for (let t = 2; t <= 3; t++) roundRect(b, ox - t, by - t, bw + t * 2, bh + t * 2, INK);
  text(b, 'OK', ox + Math.round((bw - textWidth('OK')) / 2), by + 5, INK);
  if (o.okDown) for (let j = 1; j < bh - 1; j++) for (let i = 1; i < bw - 1; i++) b.set(ox + i, by + j, b.get(ox + i, by + j) === INK ? PAPER : INK);
};
