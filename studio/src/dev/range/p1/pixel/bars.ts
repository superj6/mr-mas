// MR. MAS - style-range Prototype 1: the season's STAT BAR in pixel (the tell ladder's rung 2, G6 THE HOTSPOT).
// F4.1's shape and fill order, kept in every medium it visits: the LABEL first, then the cells ▰ left to right in held
// steps, the unfilled ones as outlines ▱. Pure pixel, drawn in the UI layer so it never switches.
import {Buf} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../shared/pixel/font';

export const BAR_COL = {label: PAL.P1, cell: PAL.C6, cellHi: PAL.C8, empty: PAL.C3, shadow: PAL.N0};
/** one cell: 5 x 4, leaning (the ▰ glyph at pixel scale) */
const CELL_ON = ['.####', '.####', '####.', '####.'];
const CELL_OFF = ['.####', '.#..#', '#..#.', '####.'];
export const CELL_W = 5, CELL_GAP = 1, CELL_H = 4;

export const barWidth = (label: string, cells: number) => textWidth(label) + 4 + cells * (CELL_W + CELL_GAP) - CELL_GAP;

/**
 * Draw a stat bar with its LEFT edge at x and the label's cap top at y. k = frames since it started setting:
 * k 0.. the label cuts in; from k = 2 one cell every 2 frames.
 */
export const statBar = (b: Buf, x: number, y: number, label: string, cells: number, filled: number, k: number, lit = false) => {
  if (k < 0) return;
  text(b, label, x, y, lit ? PAL.P2 : BAR_COL.label, {shadow: BAR_COL.shadow});
  const shown = Math.max(0, Math.min(cells, Math.floor((k - 2) / 2) + 1));
  let cx = x + textWidth(label) + 4;
  for (let i = 0; i < shown; i++) {
    const on = i < filled;
    const rows = on ? CELL_ON : CELL_OFF;
    rows.forEach((r, j) => {
      for (let q = 0; q < r.length; q++) if (r[q] === '#') {
        b.set(cx + q + 1, y + 2 + j + 1, BAR_COL.shadow);
      }
    });
    rows.forEach((r, j) => {
      for (let q = 0; q < r.length; q++) if (r[q] === '#') b.set(cx + q, y + 2 + j, on ? (j === 0 ? BAR_COL.cellHi : BAR_COL.cell) : BAR_COL.empty);
    });
    cx += CELL_W + CELL_GAP;
  }
};
