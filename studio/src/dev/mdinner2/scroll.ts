// MR. MAS — mdinner2: MARIO's scroll. It starts life as the WORD COUNT bar on his name card, runs off the card
// and lies down the length of the table as a strip of typed parchment. Its text is legible micro type (an egg
// for freeze-framers): fragments of the essay, ink blue on parchment, never red. The leading end is a roll;
// Mas takes that end and rolls it into a paper telescope.
import {Buf, PAL} from '../../shared/pixel';
import {CX, micro, microWidth} from '../../shared/pixel/cast/bosses';

/** the strip is 7 px tall: lit top edge, 5 rows of micro type, a shadow row */
export const STRIP_H = 7;
export const INK = CX.INK;
const PAPER = PAL.P2, PAPER2 = PAL.P1, EDGE = PAL.P0;

// the essay, left to right from the leading end (the last page is the one that arrives at Mas): only the two scripted
// fragments (SCRIPT §3.5c / §5.3, real phrases verbatim) and the last line, ADDENDUM: + a tiny blank price tag.
// ("...we must pace the frontier" is Ep9-10's PACE, cut in v2.1; the invented excerpts are cut: guardrails §4.)
const ADD = 'ADDENDUM: ';
const TAG_W = 8;
const TEXT = `${ADD}${' '.repeat(3)}  ...A COUNTRY OF GENIUSES IN A DATACENTER...  ...MACHINES OF LOVING GRACE...  `;
const TEXT_W = microWidth(TEXT) + TAG_W + 3;
/** the tiny price tag after ADDENDUM: (blank, 5 rows: a pointed end with a hole, ink outline) */
const TAG = ['..####', '.#...#', '#.o..#', '.#...#', '..####'];
const tagAt = (b: Buf, x: number, y: number) => TAG.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(x + i, y + j, INK); });

/**
 * A horizontal strip from x0 (left end) to x1 (right end), top at y (screen coords). `phase` = the world x of
 * the strip's left end (so the type stays glued to the paper while the camera moves).
 */
export const drawStrip = (b: Buf, x0: number, x1: number, y: number, phase: number, clip?: (x: number) => boolean, mask?: (x: number, y: number) => void) => {
  if (x1 <= x0) return;
  const tmp = new Buf(x1 - x0, STRIP_H, PAPER);
  for (let i = 0; i < tmp.w; i++) { tmp.set(i, 0, PAPER); tmp.set(i, STRIP_H - 1, EDGE); }
  // faint fibre every 9 px (a paper seam), then the type, tiled
  for (let i = 0; i < tmp.w; i++) if ((i + phase) % 37 === 0) for (let j = 1; j < STRIP_H - 1; j++) tmp.set(i, j, PAPER2);
  const start = -(((x0 - phase) % TEXT_W) + TEXT_W) % TEXT_W;
  for (let ox = start; ox < tmp.w; ox += TEXT_W) { micro(tmp, TEXT, ox + 2, 1, INK); tagAt(tmp, ox + 2 + microWidth(ADD) + 1, 1); }
  for (let j = 0; j < STRIP_H; j++)
    for (let i = 0; i < tmp.w; i++) {
      const X = x0 + i;
      if (clip && !clip(X)) continue;
      b.set(X, y + j, tmp.c[j * tmp.w + i]);
      mask?.(X, y + j);
    }
};

/** the roll at the leading (left) end, sitting on the table: 6 wide, 10 tall, the spiral end facing us */
export const drawRoll = (b: Buf, x: number, y: number, spin: number, mask?: (x: number, y: number) => void) => {
  // y = the table line under the strip's bottom
  const rows = [
    '.oooo.',
    'oPPPPo',
    'PPssPP',
    'PsPPsP',
    'PsPsPP',
    'PsPPsP',
    'PPssPP',
    'oPPPPo',
    '.oooo.',
  ];
  const spirals = [rows, rows.map((r) => r.split('').reverse().join(''))];
  const pal: Record<string, number> = {o: PAL.P0, P: PAPER, s: INK};
  spirals[spin % 2].forEach((r, j) => { for (let i = 0; i < 6; i++) { const c = pal[r[i]]; if (c === undefined) continue; b.set(x + i, y - 9 + j, c); mask?.(x + i, y - 9 + j); } });
};

/** the in-card WORD COUNT bar: the same paper, growing (UI layer) */
export const drawCardBar = (b: Buf, x0: number, x1: number, y: number, phase: number) => drawStrip(b, x0, x1, y, phase);

/**
 * The paper telescope: a rolled tube from (ex, ey) (the eye end) to (tx, ty) (the far end), 3 px thick, drawn on
 * whole pixels along a stepped diagonal. Ink shows as a spiral line; the far end is an open ring.
 */
export const drawTelescope = (b: Buf, ex: number, ey: number, tx: number, ty: number, mask?: (x: number, y: number) => void) => {
  const n = Math.max(Math.abs(tx - ex), Math.abs(ty - ey));
  const put = (x: number, y: number, c: number) => { b.set(x, y, c); mask?.(x, y); };
  for (let k = 0; k <= n; k++) {
    const x = Math.round(ex + ((tx - ex) * k) / n), y = Math.round(ey + ((ty - ey) * k) / n);
    // the tube cross-section: lit top-left, shadowed bottom-right
    put(x, y - 1, PAPER);
    put(x, y, k % 4 === 1 ? INK : PAPER2);
    put(x + 1, y, EDGE);
    put(x, y + 1, EDGE);
  }
  // the far end: an open ring of paper around a dark hole
  put(tx + 1, ty - 1, PAPER); put(tx + 1, ty, PAL.N1); put(tx + 2, ty, PAPER); put(tx + 1, ty + 1, EDGE);
};
