// MR. MAS — kit: EMIT OPEN AT THE OP-ED (draft 7, v31-12.03: Rezeile's op-ed restored). New file (v3-art-a, v3.1
// round, 2026-09-27). A week after the pause letter, a magazine lands flat on the printed letter on Mas's desk: EMIT
// (naming.md: EMIT for TIME), open at an op-ed, its headline held to read: "Pausing AI Developments Isn't Enough. We
// Need to Shut It All Down." [V · MAR 29, 2023 · facts §B; the headline only]. THUD: the desk takes a 2 px shake; his
// glass's water line does not move. The magazine is the tag's EMIT (kits/emit-cover.ts, art-b's): its teal and gold,
// its slab masthead (the four letters' grid copied from there; keep the two in step), no real masthead, no red border.
// The byline is the pipeline's REZEILE plate (the lock's text); the page can print it too (o.byline) if the shot pass
// drops the plate.
//   drawEmitSpread(b, x, y, o)   the magazine open flat (EMIT_SPREAD: 326 x 160): the left page's masthead, section,
//                                headline (the display face, five lines), byline, body; the right page's picture + body
//   drawEmitDrop(b, f, st)       [HIGH] v31-12.03: his desk from above, the printed pause letter under (its header
//                                showing past the magazine's top), his glass; st.k frames since the thud: 0 the magazine
//                                a hand's height above its shadow · 1..4 landed, the desk shaking 2 px (held) · 5+ still
//   drawEmitPhonePage(b, x, y, w, h)   the same page on a phone (12.05: Alyi's reflection reads it): teal band, the
//                                gold masthead line, the headline's dark bars
//   EMIT_OPED                    the words
import {Buf, rect, line, bayer, hash, ellipse} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {bpt, bpw} from './uitype';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {drawLetterPage} from './pause-letter';

export const EMIT_OPED = {
  headline: ['Pausing AI', 'Developments', "Isn't Enough.", 'We Need to', 'Shut It All Down.'],
  section: 'IDEAS',
  byline: 'BY REZEILE',
};
export const EMIT_SPREAD = {w: 326, h: 160, left: 176};
const RH = 203;
// the masthead's slab letters (copied from kits/emit-cover.ts SLAB: E M I T)
const SLAB: Record<string, string[]> = {
  E: ['######', '##....', '##....', '#####.', '##....', '##....', '##....', '######', '######'],
  M: ['##..##', '###.##', '######', '##.#.#', '##...#', '##...#', '##...#', '##...#', '##...#'],
  I: ['######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..', '######', '######'],
  T: ['######', '######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'],
};
const slab = (b: Buf, s: string, x: number, y: number, cell: number, col: number) => {
  let cx = x;
  for (const ch of s) { const g = SLAB[ch]; g.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') rect(cx + i * cell, y + j * cell, cell, cell, b.ink(col)); }); cx += 7 * cell; }
};

export const drawEmitSpread = (b: Buf, x: number, y: number, o: {byline?: boolean} = {}) => {
  const {w, h, left} = EMIT_SPREAD;
  // the paper: two pages, the gutter's shadow, the outer edges a rung down, the page stack's edge under
  rect(x + 3, y + 3, w, h, b.ink(PAL.G1));
  rect(x, y, w, h, b.ink(PAL.P2));
  rect(x, y + h - 1, w, 1, b.ink(PAL.P0)); rect(x, y, 1, h, b.ink(PAL.P1)); rect(x + w - 1, y, 1, h, b.ink(PAL.P1));
  for (let j = 0; j < h; j++) { b.set(x + left - 2, y + j, PAL.P1); b.set(x + left - 1, y + j, PAL.P0); b.set(x + left, y + j, PAL.P0); b.set(x + left + 1, y + j, PAL.P1); if (bayer(x + left + 2, y + j) < 0.5) b.set(x + left + 2, y + j, PAL.P1); }
  // ---- the left page: the teal rule and small masthead, the section, the headline, the byline, the body
  const lx = x + 10;
  rect(lx, y + 7, left - 20, 1, b.ink(PAL.C3));
  slab(b, 'EMIT', lx, y + 10, 1, PAL.C2);
  tiny(b, EMIT_OPED.section, lx + 32, y + 12, PAL.C3);
  let yy = y + 24;
  for (const l of EMIT_OPED.headline) { bpt(b, l, lx, yy, PAL.N1); yy += 17; }
  yy += 2;
  if (o.byline) tiny(b, EMIT_OPED.byline, lx, yy, PAL.C3);
  else { rect(lx, yy + 1, 28, 3, b.ink(PAL.G5)); }
  yy += 9;
  for (let r = 0; yy + r * 4 < y + h - 6; r++) rect(lx, yy + r * 4, left - 22 - (r % 4 === 3 ? 30 : 0), 1, b.ink(PAL.G5));
  // ---- the right page: the op-ed's picture (a dark teal field, one lit chip-grid, abstract) and the body columns
  const rx = x + left + 8, rw = w - left - 16;
  for (let j = 0; j < 64; j++) for (let i = 0; i < rw; i++) b.set(rx + i, y + 8 + j, bayer(i, j) < 0.2 ? PAL.C1 : PAL.C0);
  for (let gy = 0; gy < 5; gy++) for (let gx = 0; gx < 5; gx++) { const X = rx + rw / 2 - 20 + gx * 8, Y = y + 20 + gy * 8; rect(Math.round(X), Y, 6, 6, b.ink(gx === 2 && gy === 2 ? PAL.C7 : hash(gx, gy, 97) < 0.3 ? PAL.C4 : PAL.C2)); }
  rect(rx, y + 76, 40, 2, b.ink(PAL.G5)); // the picture's credit line
  const colW = Math.floor((rw - 6) / 2);
  for (let c = 0; c < 2; c++) for (let r = 0; y + 84 + r * 4 < y + h - 6; r++) rect(rx + c * (colW + 6), y + 84 + r * 4, colW - (r % 5 === 4 ? 12 : 0), 1, b.ink(PAL.G5));
  void text; void textWidth; void bpw; void tinyWidth; void line;
};

/** the phone-sized page (12.05, in Alyi's hand in the glass): the teal band, the gold masthead line, the headline bars */
export const drawEmitPhonePage = (b: Buf, x: number, y: number, w: number, h: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const edge = i === 0 || i === w - 1 || j === 0 || j === h - 1;
    b.set(x + i, y + j, edge ? PAL.N0 : j < 4 ? PAL.C2 : j === 4 ? PAL.W7 : (j >= 6 && j <= 11 && j % 2 === 0 && i > 1 && i < w - 3) ? PAL.N2 : (j > 13 && j % 3 === 0 && i > 1 && i < w - 2) ? PAL.G5 : PAL.P2);
  }
};

export interface EmitDropState { k?: number; byline?: boolean }
/** the 2 px shake, per frame since the thud (held drawings) */
const SHAKE = [0, 2, -2, 1, -1];
export const drawEmitDrop = (b: Buf, f: number, st: EmitDropState = {}) => {
  const k = st.k ?? 8;
  const sy = k >= 1 && k < SHAKE.length ? SHAKE[k] : 0;
  // his desk at night from above (the laminate, the lamp's pool: the PLEASE insert's desk), shifted by the shake
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 240) / 280, (y - sy - 70) / 200); b.set(x, y, bayer(x, y - sy) < (1 - Math.min(1, d)) * 0.7 ? PAL.G3 : bayer(x, y - sy) < 0.3 ? PAL.G1 : PAL.G2); }
  // the printed pause letter under it (a printout: no browser strip), its header past the magazine's top edge
  drawLetterPage(b, 150, -4 + sy, 190, 150, {print: true});
  // his glass at the top left: its rim and water shake with the desk; the water line stays put
  ellipse(52, 36 + sy, 13, 13, b.ink(PAL.G5)); ellipse(52, 36 + sy, 11, 11, b.ink(PAL.C5));
  for (let i = -7; i <= 7; i++) b.set(52 + i, 32, PAL.C8);
  // the magazine: in the air on the thud's first frame (a hand's height over its shadow), then flat
  const mx = 77, my = 38;
  if (k === 0) {
    for (let j = 0; j < EMIT_SPREAD.h; j++) for (let i = 0; i < EMIT_SPREAD.w; i++) { const X = mx + 10 + i, Y = my + 10 + j; if (Y < RH && bayer(X, Y) < 0.6) b.set(X, Y, stepColor(b.get(X, Y), -2)); }
    drawEmitSpread(b, mx - 4, my - 8, st);
  } else drawEmitSpread(b, mx, my + sy, st);
  void f;
};
