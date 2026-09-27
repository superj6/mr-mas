// MR. MAS · outro B: the drawings. The band (the show's own UI home, carrying the terms line and the pointer), the
// Orb's toast chips (the intro bookend's TOAST, stacked), the Ep1 moth, the stand-in's lookdev label, and the one
// glyph the shared 7-px face lacks here (the em dash of Ep10's `viewer: —`). Everything is whole pixels, master palette only.
// The shared font, the Orb rig and the palette are imported read-only; nothing shared is edited.
import {Buf, rect, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {text, textWidth} from '../../../shared/pixel/font';
import {drawOrb} from '../../../shared/pixel/cast/orb-medium';
import {TERMS, POINTER} from './timeline';

// ================================================================== text with the em dash (drawn locally)
const DASH = '—';
/** width of s in the 7-px face, counting a locally drawn em dash as 5 px */
export const tw = (s: string) => {
  let w = 0;
  const parts = s.split(DASH);
  parts.forEach((p, i) => {
    w += textWidth(p);
    if (i < parts.length - 1) w += (p.length ? 1 : 0) + 5 + 1;
  });
  return parts[parts.length - 1].length ? w : w - 1;
};
/** text() plus a 5-px em dash on the x-height middle row (the shared face has none) */
export const tx = (b: Buf, s: string, x: number, y: number, col: number) => {
  const parts = s.split(DASH);
  let cx = x;
  parts.forEach((p, i) => {
    if (p.length) { text(b, p, cx, y, col); cx += textWidth(p) + 1; }
    if (i < parts.length - 1) { rect(cx, y + 3, 5, 1, b.ink(col)); cx += 6; }
  });
};

// ================================================================== the band (480 x 67 at y 203)
export const BAND = {y: 203, h: 67};
/** the terms line: 389 px in the 7-px face, one row, centred; never moves, never covered, never a joke */
export const TERMS_AT = {x: Math.floor((480 - textWidth(TERMS)) / 2), y: 220};
export const POINTER_AT = {x: Math.floor((480 - textWidth(POINTER)) / 2), y: 237};
/** the terms line's final period (native px): the moth settles here, beside the words, never on them */
export const PERIOD = {x: TERMS_AT.x + textWidth(TERMS) - 1, y: TERMS_AT.y + 6};

/** The band, lit: the adventure layout's interface strip (pixeladv drawUI's keylines), empty of verbs, carrying
 *  only the terms line and the pointer. Paper on dark (P1 / P0 on N1). UI layer: nothing switches it or covers it. */
export const drawBand = (ui: Buf) => {
  const y0 = BAND.y;
  rect(0, y0, 480, BAND.h, ui.ink(PAL.N1));
  rect(0, y0, 480, 1, ui.ink(PAL.N0));
  rect(0, y0 + 1, 480, 1, ui.ink(PAL.N4));
  rect(0, y0 + 2, 480, 1, ui.ink(PAL.N2));
  text(ui, TERMS, TERMS_AT.x, TERMS_AT.y, PAL.P1);
  text(ui, POINTER, POINTER_AT.x, POINTER_AT.y, PAL.P0);
};

// ================================================================== the lookdev label (the stand-in second only)
// Pass 4: the outro's own frames carry NO slug. A cold viewer read the corner `LEGAL TEXT: DRAFT` (on every outro
// frame) as the product looking unfinished, and `(creator)` as a broken template. Both flags now sit on the stand-in
// second, which is not part of the outro, so the outro is seen as it would air. They are also in the MP4's comment
// tag, on the key stills' caption bars and on the sheets. Legal review of the on-screen text is still PENDING.
export const STANDIN_LABEL = ["STAND-IN: EP1'S LAST SHOT (NOT BUILT)", 'LOOKDEV · LEGAL TEXT: DRAFT, REVIEW PENDING · (CREATOR) = CREDIT TBD'];
export const drawStandinLabel = (ui: Buf) => {
  const w = Math.max(...STANDIN_LABEL.map((s) => textWidth(s))) + 8;
  rect(3, 3, w, 24, ui.ink(PAL.N0));
  rect(3, 26, w, 1, ui.ink(PAL.W5));
  text(ui, STANDIN_LABEL[0], 7, 5, PAL.W6);
  text(ui, STANDIN_LABEL[1], 7, 16, PAL.N8);
};

// ================================================================== the Orb's toast chips
/** The intro bookend's TOAST (mfinale/bookend.ts drawToast), one chip per line, stacked like notifications.
 *  'credit': dark cyan face, pale type (the scan's findings). 'verdict': the intro's own chip (C6 face, N0 type).
 *  k = frames since it popped: frame 0 sits 2 px high, then it drops into place (2 held steps). `flash` lights the
 *  chip's rule for one frame instead: a chip landing IN PLACE around type that is already on screen (no drop). */
export const CHIP_H = 13;
export const chipW = (s: string) => tw(s) + 12;
export const drawChip = (b: Buf, x: number, y: number, s: string, kind: 'credit' | 'verdict', k: number, flash = false) => {
  if (k < 0) return;
  const nw = chipW(s), ny = y + (k === 0 ? -2 : 0);
  const face = kind === 'verdict' ? PAL.C6 : PAL.C1;
  const rule = flash ? PAL.C9 : kind === 'verdict' ? PAL.C8 : PAL.C4;
  const ink = kind === 'verdict' ? PAL.N0 : PAL.C8;
  rect(x - 1, ny - 1, nw + 2, CHIP_H, b.ink(PAL.N0));
  rect(x, ny, nw, 11, b.ink(face));
  rect(x, ny, nw, 1, b.ink(rule));
  // the chip's left tick: the Orb's colour, one pixel wide (it's the Orb talking)
  if (kind === 'credit') rect(x, ny + 1, 1, 10, b.ink(PAL.C5));
  tx(b, s, x + 6, ny + 2, ink);
};

// ================================================================== the Orb, close
export const ORB = {cx: 420, cy: 96, r: 31};
/** look vectors: idle (toward its own toast, screen-left and a touch down), the in-betweens, the lens */
export const LOOK_IDLE: [number, number] = [-0.62, 0.12];
export const LOOKS: Array<[number, number]> = [LOOK_IDLE, [-0.4, 0.07], [-0.18, 0.03], [0, 0]];
/** the chrome's hard specular (drawOrb: nx = -0.56, ny = -0.2 with the monitor side at -1) */
export const specAt = (cy: number): [number, number] => [ORB.cx + Math.round(-0.56 * ORB.r), cy + Math.round(-0.2 * ORB.r)];

/** The Orb (the approved cold-open model, shared/pixel/cast/orb-medium drawOrb) at r 31 on black. `step` < 0 draws
 *  it that many light rungs down (the fade-up is 3 held palette steps, never a blend). */
export const drawOrbClose = (fb: Buf, cy: number, look: [number, number], aperture: number, scanning: boolean, step: number, mask?: Uint8Array) => {
  if (step === 0) { drawOrb(fb, ORB.cx, cy, ORB.r, {look, aperture, scanning, monitor: -1}, mask); return; }
  const tmp = new Buf(fb.w, fb.h, TRANSPARENT);
  drawOrb(tmp, ORB.cx, cy, ORB.r, {look, aperture, scanning, monitor: -1}, mask);
  for (let i = 0; i < tmp.c.length; i++) if (tmp.c[i] !== TRANSPARENT) fb.c[i] = stepColor(tmp.c[i], step);
};

/** The catch-light glint (the title's four-point sparkle), on the chrome's specular. L = arm length. */
export const drawGlint = (b: Buf, cy: number, L: number) => {
  const [sx, sy] = specAt(cy);
  for (let i = -L; i <= L; i++) {
    b.set(sx + i, sy, Math.abs(i) < 1 ? PAL.P2 : PAL.C8);
    b.set(sx, sy + i, Math.abs(i) < 1 ? PAL.P2 : PAL.C8);
  }
  b.set(sx, sy, PAL.C9);
};

// ================================================================== the moth (Ep1's stinger)
// The Senate moth (Ep1 script: "the Senate moth flutters in across the legal card, settles on its last line and folds
// its wings"). Pass 4 redraw: the first moth (11 x 8, mauve and salmon) read as a pink bow-tie, "a speck of dust" at
// 480x270. This one is 19 px wide, a real moth's silhouette at rest on a lit window: the DELTA (forewings swept back
// over the hindwings, widest at the trailing edge, two scalloped lobes), a pale fuzzy thorax, antennae forward. Dusty
// brown (B4 / B3 / D3) with a pale grey-tan leading edge (P0): warm against the cool band, and never the paper colour
// of the terms line (P1), so it can't read as one of its glyphs. In flight it alternates two drawings on 2s: wings
// down and spread ('open'), wings up in a V ('half'). w wing, v trailing shade, d wing mark, e leading edge (lit),
// t thorax, b body, h head, a antenna. Every drawing is anchored at its centre column (9) and middle row.
const MOTH: Record<'open' | 'half' | 'rest', {rows: string[]; ax: number; ay: number}> = {
  open: {rows: [
    '......a.....a......',
    '.......a.h.a.......',
    'eee....eetee....eee',
    'wwweeeewwtwweeeewww',
    '.wwwwwdwwbwwdwwwww.',
    '..vwwwwwwbwwwwwwv..',
    '...vvwwwvbvwwwvv...',
    '.....vvv.b.vvv.....',
  ], ax: 9, ay: 4},
  half: {rows: [
    '..e.............e..',
    '..ee...a...a...ee..',
    '...we...a.a...ew...',
    '...wwe..ehe..eww...',
    '....wwe.ete.eww....',
    '....vwwdwbwdwwv....',
    '.....vwwwbwwwv.....',
    '......vvwbwvv......',
    '.........b.........',
  ], ax: 9, ay: 4},
  rest: {rows: [
    '.....a.......a.....',
    '......a.....a......',
    '.......a.h.a.......',
    '.......eetee.......',
    '.....eewwtwwee.....',
    '...eewwwwbwwwwee...',
    '.eewwdwwwbwwwdwwee.',
    'ewwwddwwwbwwwddwwwe',
    'vwwwwwwwwbwwwwwwwwv',
    '.vvwwwwvvbvvwwwwvv.',
    '...vvvv.....vvvv...',
  ], ax: 9, ay: 5},
};
const MOTH_PAL: Record<string, number> = {w: PAL.B4, v: PAL.B3, d: PAL.D3, e: PAL.P0, t: PAL.P0, b: PAL.B2, h: PAL.B3, a: PAL.B4};
export type MothPose = keyof typeof MOTH;
/** the moth's anchor (its centre column, middle row) goes at (x, y) */
export const drawMoth = (b: Buf, pose: MothPose, x: number, y: number) => {
  const d = MOTH[pose];
  d.rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const c = MOTH_PAL[row[i]]; if (c !== undefined) b.set(x - d.ax + i, y - d.ay + j, c); } });
};
/** a pose's inked box relative to its anchor: [x0, y0, x1, y1] */
export const mothBox = (pose: MothPose, x: number, y: number): [number, number, number, number] => {
  const d = MOTH[pose];
  let x0 = 99, y0 = 99, x1 = -99, y1 = -99;
  d.rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] !== '.') { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, j); y1 = Math.max(y1, j); } });
  return [x - d.ax + x0, y - d.ay + y0, x - d.ax + x1, y - d.ay + y1];
};
/** where the resting moth sits: its left wing tip 2 px right of the final period (a 1 px gap), centred on the line's
 *  cap height, so the dot, the last letter and the words stay clear: "at the final period, beside the words, never on
 *  one". The wings then reach 20 px past the line's end (x 435-453 of 480). */
export const MOTH_REST: [number, number] = [PERIOD.x + 2 + MOTH.rest.ax, TERMS_AT.y + 3];
/** the resting moth's bounding box (for the QA check that it covers no letter): [x0, y0, x1, y1] */
export const mothRestBox = (): [number, number, number, number] => mothBox('rest', MOTH_REST[0], MOTH_REST[1]);
