// MR. MAS — shared kit: THE VIDEO-CALL GRID (show-wide). Salvaged from the cut intro slot
// (src/dev/mfinale/callart.ts + slot.ts, still out/season/intro/moments/_cut/mfinale-fired.png) into one reusable module.
//
// A generic call app (guardrails §5: no real app's UI, no real OS sounds): a plain title bar, N tiles on a centred
// grid, name chips, mute icons, a speaking ring, small vote chips that FLIP, a camera-off tile, system toasts, a
// full-colour copy of the 1993 dialog (same plain frame, no icon) whose Cancel can grey out one dither step at a
// time, the board's arrow pointer, and a tile that DROPS out of the grid (four held drawings, straight down) while
// it comes apart in the GLYPH dissolve (20 frames: the tile dissolve is Ep1's 2nd of 2 GLYPH uses).
//
//   const tiles = gridLayout(5);                                   // [{x, y, w, h}] (3 + 2, centred)
//   callChrome(fb, {title: 'board sync'});                         // no clock: the rail carries the time
//   drawTile(fb, {...tiles[1], id: 'alyi', name: 'ALYI', speaking: true, vote: 3}, f);
//   const img = captureTile({...tiles[0], id: 'mas', name: 'MAS MANALT'}, f0);   // for the drop
//   layers.push(tileDrop(fb, img, tiles[0].x, tiles[0].y, f - t0));             // fall + dissolve (GlyphLayer)
//   const now = slideTiles(gridLayout(5).slice(1), gridLayout(4), f, t0);        // the gap closes (held steps)
//
// Painters (tile content, all clipped to the tile, all hold still when `frozen`):
//   mas    the Strip's neon through the hotel glass behind him        neleh  bookshelf, a paper glowing behind her,
//   alyi   a doorway; he is only a reflection in its glass                   footnote numbers orbiting her head
//   mada   plain wall, arms folded, a loading spinner turning above him   off  THE QUIET VOTE: black, camera off
//   gerg   laptop open, typing, the green glow under his chin          rima  her roll-call art, webcam crop (+ spotlight())
//   face   a generic employee tile (seeded; also the avalanche's faces)
import {Buf, rect, line, poly, ellipse, hash, clamp, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {Img, P, Part, Adjust, LightRig, FigureDef, renderFigure, blitImg} from '../figure';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from '../font';
import {compilePalette, PaletteSet} from '../palettes';
import {bayer4} from '../dither';
import {glyphDissolve, GlyphLayer, GlyphStyle} from '../glyph';
import {imgFromBuf, mapImg, stepImg, holds, ease} from '../sprite';
import {masPortrait} from '../cast/mas';
import {alyiPortrait} from '../cast/alyi';
import {gergPortrait} from '../cast/gerg';
import {lightPool} from '../cast/kit';
import {micro} from '../cast/bosses';
import {drawRima} from '../cast/rollcall';

const memo1 = <T,>(fn: () => T) => { let v: T | undefined; return () => (v ??= fn()); };

// ================================================================== geometry
/** Standard tile: 150 x 84 (16:9-ish). A video tile, not a portrait window. */
export const TILE_W = 150, TILE_H = 84;
export const CALL_BAR_H = 12;
export interface TileRect { x: number; y: number; w: number; h: number; }

/**
 * Centred grid for n tiles (rows of up to `perRow`), inside the call area below the title bar.
 * 5 -> 3 + 2, 4 -> 2 + 2, 3 -> 3, 6 -> 3 + 3. Area defaults to the full 480 x 270 frame minus chrome.
 */
export const gridLayout = (n: number, o: {w?: number; h?: number; gap?: number; perRow?: number; area?: TileRect} = {}): TileRect[] => {
  const w = o.w ?? TILE_W, h = o.h ?? TILE_H, gap = o.gap ?? 7;
  const per = o.perRow ?? (n === 4 ? 2 : 3);
  const area = o.area ?? {x: 0, y: CALL_BAR_H, w: 480, h: 222};
  const rows: number[] = [];
  for (let left = n; left > 0; left -= per) rows.push(Math.min(per, left));
  const th = rows.length * h + (rows.length - 1) * gap;
  const y0 = area.y + Math.floor((area.h - th) / 2);
  const out: TileRect[] = [];
  rows.forEach((cnt, r) => {
    const tw = cnt * w + (cnt - 1) * gap;
    const x0 = area.x + Math.floor((area.w - tw) / 2);
    for (let i = 0; i < cnt; i++) out.push({x: x0 + i * (w + gap), y: y0 + r * (h + gap), w, h});
  });
  return out;
};

/**
 * Tiles slide from one layout to another in HELD steps (the gap closes like a UI reflow, snap-eased, on 2s).
 * `from` and `to` are matched by index.
 */
export const slideTiles = (from: TileRect[], to: TileRect[], f: number, t0: number, frames = 8): TileRect[] => {
  const q = f < t0 ? 0 : Math.min(1, Math.floor((f - t0) / 2) * 2 / Math.max(1, frames));
  const e = ease.snap(q);
  return from.map((a, i) => {
    const b = to[i] ?? a;
    return {x: Math.round(a.x + (b.x - a.x) * e), y: Math.round(a.y + (b.y - a.y) * e), w: b.w, h: b.h};
  });
};

// ================================================================== the call app chrome
export interface ChromeOpts {
  title?: string;
  /** a clock string, or null for none (Ep1 sc 26: blank it, the rail carries the time). Default null */
  clock?: string | null;
  /** the control bar (mic, camera, share, leave). Default true */
  controls?: boolean;
  /** leave the background alone (draw the chrome over an existing frame). Default false */
  noFill?: boolean;
  w?: number; h?: number;
}
export const callChrome = (b: Buf, o: ChromeOpts = {}) => {
  const W = o.w ?? b.w, H = o.h ?? b.h;
  if (!o.noFill) rect(0, 0, W, H, b.ink(PAL.N1));
  rect(0, 0, W, CALL_BAR_H - 1, b.ink(PAL.N2));
  rect(0, CALL_BAR_H - 1, W, 1, b.ink(PAL.N0));
  // a generic app mark: two stacked dots (the "recording" red is kept off the chrome)
  b.set(7, 4, PAL.C5); b.set(8, 4, PAL.C5); b.set(7, 6, PAL.N6); b.set(8, 6, PAL.N6);
  text(b, o.title ?? 'board sync', 14, 2, PAL.N6);
  if (o.clock) text(b, o.clock, W - 8 - textWidth(o.clock), 2, PAL.N6);
  if (o.controls !== false) {
    const bx = W - 224, by = H - 34;
    rect(bx, by, 212, 18, b.ink(PAL.N2));
    rect(bx, by, 212, 1, b.ink(PAL.N3));
    const icon = (x: number, col: number) => { rect(x, by + 4, 14, 10, b.ink(PAL.N3)); rect(x + 5, by + 6, 4, 6, b.ink(col)); };
    icon(bx + 8, PAL.G4); icon(bx + 26, PAL.G4); icon(bx + 44, PAL.G4); icon(bx + 62, PAL.G4);
    rect(bx + 174, by + 4, 30, 10, b.ink(PAL.R1)); rect(bx + 179, by + 8, 20, 2, b.ink(PAL.P1));
  }
};

// ================================================================== small UI pieces
/** Name chip (bottom-left of a tile). */
export const nameChip = (b: Buf, x: number, y: number, s: string, col: number = PAL.P1) => {
  const w = textWidth(s) + 8;
  rect(x, y, w, 11, b.ink(PAL.N0));
  text(b, s, x + 4, y + 2, col);
  return w;
};

/** Mic icon, 7 x 9 in a dark 11 x 11 chip. muted = red slash; level 0..3 = the speaking bars beside it. */
export const micIcon = (b: Buf, x: number, y: number, o: {muted?: boolean; level?: number; col?: number} = {}) => {
  const col = o.col ?? PAL.P1;
  rect(x, y, 11, 11, b.ink(PAL.N0));
  rect(x + 4, y + 2, 3, 5, b.ink(col));
  b.set(x + 3, y + 5, col); b.set(x + 7, y + 5, col); b.set(x + 3, y + 6, col); b.set(x + 7, y + 6, col);
  b.set(x + 4, y + 7, col); b.set(x + 6, y + 7, col); rect(x + 5, y + 8, 1, 1, b.ink(col)); rect(x + 4, y + 9, 3, 1, b.ink(col));
  if (o.muted) for (let i = 0; i < 8; i++) b.set(x + 2 + i, y + 1 + i, PAL.R3);
  const lv = o.muted ? 0 : clamp(Math.round(o.level ?? 0), 0, 3);
  if (lv) for (let k = 0; k < lv; k++) rect(x + 12 + k * 2, y + 7 - k * 2, 1, 2 + k * 2, b.ink(PAL.L3));
};

/**
 * Vote chip (a small flip card, 9 x 9). state: 0 unflipped (hollow grey), 1 and 2 the flip's edge-on drawings,
 * 3 flipped (filled red, a paper tick). Use voteFlip(f, t0) for the 3-drawing flip.
 */
export const voteChip = (b: Buf, x: number, y: number, state: 0 | 1 | 2 | 3) => {
  if (state === 1) { rect(x, y + 2, 9, 5, b.ink(PAL.G4)); rect(x, y + 4, 9, 1, b.ink(PAL.G2)); return; }
  if (state === 2) { rect(x, y + 4, 9, 1, b.ink(PAL.R3)); return; }
  if (state === 0) {
    rect(x, y, 9, 9, b.ink(PAL.N0));
    rect(x, y, 9, 1, b.ink(PAL.G3)); rect(x, y + 8, 9, 1, b.ink(PAL.G3)); rect(x, y, 1, 9, b.ink(PAL.G3)); rect(x + 8, y, 1, 9, b.ink(PAL.G3));
    return;
  }
  rect(x, y, 9, 9, b.ink(PAL.R2));
  rect(x, y, 9, 1, b.ink(PAL.R3)); rect(x, y + 8, 9, 1, b.ink(PAL.R1));
  ['......', '.....#', '#...#.', '.#.#..', '..#...'].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(x + 2 + i, y + 2 + j, PAL.P2); });
};
/** The flip: 0 before t0, then edge-on (2 frames), thin (1 frame), and flipped (3) from t0 + 3. */
export const voteFlip = (f: number, t0: number): 0 | 1 | 2 | 3 => (f < t0 ? 0 : f < t0 + 2 ? 1 : f < t0 + 3 ? 2 : 3);

/** Speaking ring: 2 px accent just outside the tile (the generic "active speaker" highlight). */
export const speakingRing = (b: Buf, t: TileRect, col: number = PAL.C6) => {
  for (const d of [2, 3]) {
    rect(t.x - d, t.y - d, t.w + 2 * d, 1, b.ink(col)); rect(t.x - d, t.y + t.h - 1 + d, t.w + 2 * d, 1, b.ink(col));
    rect(t.x - d, t.y - d, 1, t.h + 2 * d, b.ink(col)); rect(t.x + t.w - 1 + d, t.y - d, 1, t.h + 2 * d, b.ink(col));
  }
};

/** A floating mic chip: the tile is gone, the microphone isn't. level 0..3 (live bars). */
export const micChip = (b: Buf, x: number, y: number, level: number) => {
  rect(x - 1, y - 1, 21, 13, b.ink(PAL.N0));
  rect(x - 1, y - 1, 21, 1, b.ink(PAL.N3));
  micIcon(b, x, y, {level, col: level > 0 ? PAL.L3 : PAL.P1});
};

/**
 * MADA's loading spinner: 8 positions on a ring, a bright head and a 2-dot tail, one position per 2 frames
 * (drawn frames, never rotated). Returns [dx, dy, level] (level 3 head .. 0 dim). size r3 (7 px) or r5 (11 px).
 */
export const spinnerDots = (f: number, size: 'r3' | 'r5' = 'r5'): Array<[number, number, number]> => {
  const R3: Array<[number, number]> = [[0, -3], [2, -2], [3, 0], [2, 2], [0, 3], [-2, 2], [-3, 0], [-2, -2]];
  const R5: Array<[number, number]> = [[0, -5], [4, -4], [5, 0], [4, 4], [0, 5], [-4, 4], [-5, 0], [-4, -4]];
  const ring = size === 'r3' ? R3 : R5;
  const head = Math.floor(f / 2) % 8;
  return ring.map(([dx, dy], i) => {
    const age = (head - i + 8) % 8;
    return [dx, dy, age === 0 ? 3 : age === 1 ? 2 : age === 2 ? 1 : 0];
  });
};
/** Draw the spinner (tile scale: 2 x 2 dots). `frozen` holds it on one drawing. */
export const spinner = (b: Buf, cx: number, cy: number, f: number, o: {frozen?: boolean; size?: 'r3' | 'r5'; ramp?: number[]; dot?: 1 | 2} = {}) => {
  const ramp = o.ramp ?? [PAL.G2, PAL.G4, PAL.G6, PAL.P2];
  const big = (o.dot ?? ((o.size ?? 'r5') === 'r5' ? 2 : 1)) === 2;
  for (const [dx, dy, lv] of spinnerDots(o.frozen ? 0 : f, o.size ?? 'r5')) {
    const c = ramp[lv];
    b.set(cx + dx, cy + dy, c);
    if (big) { b.set(cx + dx + 1, cy + dy, c); b.set(cx + dx, cy + dy + 1, c); b.set(cx + dx + 1, cy + dy + 1, c); }
  }
};

/** A system toast ("GERG MOCKBRAN has left."): rises in 3 held steps from k = 0, holds, sinks from `out`. */
/** The toast's icon style. 'outline' (default) = v4's door outline. 'v5' (a4p5 finish, Act Four v5, via withToastIcon):
 *  the picture audit read the 3 x 6 outline at 1x as a missing-glyph box, and "rewinding…" is no door. */
export type ToastIcon = 'outline' | 'v5';
let TOAST_ICON: ToastIcon = 'outline';
export const withToastIcon = <T>(style: ToastIcon, fn: () => T): T => {
  const prev = TOAST_ICON;
  TOAST_ICON = style;
  try { return fn(); } finally { TOAST_ICON = prev; }
};
/** a4p5 finish: the notice icons at 1x, top-left (x, y), 12 x 9. 'leave' = a filled door with an arrow out of it (someone
 *  left or was removed); 'rewind' = the two left-pointing triangles of a transport control */
export const noticeIcon = (b: Buf, x: number, y: number, kind: 'leave' | 'rewind') => {
  if (kind === 'rewind') {
    for (const ox of [0, 5]) for (let c = 0; c < 5; c++) for (let j = -c; j <= c; j++) b.set(x + ox + c, y + 4 + j, c === 4 ? PAL.P2 : PAL.P1);
    return;
  }
  rect(x, y, 6, 9, b.ink(PAL.N0)); rect(x + 1, y + 1, 4, 8, b.ink(PAL.G5)); rect(x + 1, y + 1, 4, 1, b.ink(PAL.G6)); b.set(x + 4, y + 5, PAL.N0);
  rect(x + 6, y + 4, 5, 1, b.ink(PAL.P2)); b.set(x + 9, y + 3, PAL.P2); b.set(x + 9, y + 5, PAL.P2); b.set(x + 8, y + 2, PAL.P2); b.set(x + 8, y + 6, PAL.P2);
};
export const callToast = (b: Buf, x: number, y: number, s: string, k: number, out = 999) => {
  if (k < 0 || k >= out + 3) return;
  const w = textWidth(s) + 26, h = 15;
  const rise = k < 3 ? [8, 4, 1][k] : k >= out ? [2, 5, 9][k - out] : 0;
  const yy = y + rise;
  rect(x, yy, w, h, b.ink(PAL.N0));
  rect(x + 1, yy + 1, w - 2, h - 2, b.ink(PAL.N3));
  rect(x + 1, yy + 1, w - 2, 1, b.ink(PAL.N5));
  // a door-exit glyph
  if (TOAST_ICON === 'v5') noticeIcon(b, x + 4, yy + 3, /^rewind/i.test(s) ? 'rewind' : 'leave');
  else { rect(x + 6, yy + 4, 6, 8, b.ink(PAL.G5)); rect(x + 7, yy + 5, 4, 7, b.ink(PAL.N1)); b.set(x + 10, yy + 8, PAL.G5); }
  text(b, s, x + 17, yy + 4, PAL.P1);
};

/** The "someone is typing" bubble: three dots that bob in turn; from `stopAt` they hold, dimmed. */
export const typingDots = (b: Buf, x: number, y: number, f: number, stopAt = 1e9) => {
  rect(x, y, 23, 11, b.ink(PAL.N0)); rect(x + 1, y + 1, 21, 9, b.ink(PAL.N3));
  b.set(x + 3, y + 11, PAL.N0); b.set(x + 4, y + 11, PAL.N0); b.set(x + 3, y + 12, PAL.N0);
  const stop = f >= stopAt;
  for (let i = 0; i < 3; i++) {
    const up = !stop && Math.floor(f / 4) % 3 === i ? 1 : 0;
    rect(x + 5 + i * 5, y + 4 - up, 3, 3, b.ink(stop ? PAL.G3 : PAL.P1));
  }
};

// ================================================================== the dialog (the 1993 alert, in full colour)
export interface CallDialogOpts {
  /** dialog width. Default 244 (the 1993 size) */
  w?: number;
  /** title in the title band. Default none */
  title?: string;
  /** the 14 px headline. Default 'MAS MANALT' */
  head?: string;
  /** body line. Default none */
  body?: string;
  /**
   * Cancel's greying: 0 live (sc 26: it is NOT greyed out), 1..3 = one dither step per level (sc 30's lobby:
   * the frame goes 25% -> 50% dotted, the label loses pixels), 3 = the 1993 look exactly.
   */
  grey?: 0 | 1 | 2 | 3;
  cancelDown?: boolean;
  okDown?: boolean;
}
export const DIALOG_H = 96;
/** Button rects [x, y, w, h] inside a dialog at (x, y) of width w: for the pointer's target. */
export const dialogButton = (x: number, y: number, which: 'ok' | 'cancel', w = 244): [number, number, number, number] => {
  const bw = 56, bh = 18;
  const bx = x + w - 18 - bw - (which === 'cancel' ? bw + 16 : 0);
  return [bx, y + DIALOG_H - 12 - bh, bw, bh];
};
const roundRect = (b: Buf, x: number, y: number, w: number, h: number, col: number, dotted = 0) => {
  const r = 3;
  const on = (i: number, j: number) => (dotted === 0 ? true : dotted === 1 ? (i + j) % 4 !== 0 : (i + j) % 2 === 0);
  for (let i = r; i < w - r; i++) { if (on(i, 0)) b.set(x + i, y, col); if (on(i, h - 1)) b.set(x + i, y + h - 1, col); }
  for (let j = r; j < h - r; j++) { if (on(0, j)) b.set(x, y + j, col); if (on(w - 1, j)) b.set(x + w - 1, y + j, col); }
  for (const [dx, dy] of [[1, 2], [2, 1]]) { b.set(x + dx, y + dy, col); b.set(x + w - 1 - dx, y + dy, col); b.set(x + dx, y + h - 1 - dy, col); b.set(x + w - 1 - dx, y + h - 1 - dy, col); }
};
/**
 * The dialog, drawn like the 1993 one (hard shadow, double modal frame, a dithered title band with a knock-out
 * title, the 14 px name, a body line, Cancel + OK with OK's default ring) but in the show's full colour, no icon.
 */
export const callDialog = (b: Buf, x: number, y: number, o: CallDialogOpts = {}) => {
  const w = o.w ?? 244, h = DIALOG_H;
  const ink = PAL.N1, paper = PAL.P2, band = PAL.C4, bandDk = PAL.C2;
  rect(x + 3, y + 3, w, h, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(ink));
  rect(x + 1, y + 1, w - 2, h - 2, b.ink(paper));
  const tb = 12;
  for (let j = 2; j < tb - 1; j++) for (let i = 3; i < w - 3; i++) b.set(x + i, y + 1 + j, (x + i + y + 1 + j) & 1 ? band : bandDk);
  if (o.title) {
    const tw = textWidth(o.title) + 10;
    rect(x + Math.round((w - tw) / 2), y + 2, tw, tb - 2, b.ink(paper));
    text(b, o.title, x + Math.round((w - tw) / 2) + 5, y + 3, ink);
  }
  rect(x, y + tb + 1, w, 1, b.ink(ink));
  const head = o.head ?? 'MAS MANALT';
  const hx = x + 22;
  bigText(b, head, hx, y + tb + 12, ink);
  rect(hx, y + tb + 12 + BIG_CAP + 3, bigTextWidth(head), 1, b.ink(ink));
  if (o.body) text(b, o.body, hx, y + tb + 12 + BIG_CAP + 9, PAL.N4);
  // Cancel
  const g = o.grey ?? 0;
  const [cx, cy, cw, ch] = dialogButton(x, y, 'cancel', w);
  const cCol = g === 0 ? ink : g === 1 ? PAL.N4 : PAL.G3;
  if (o.cancelDown) { rect(cx + 1, cy + 1, cw - 2, ch - 2, b.ink(ink)); }
  roundRect(b, cx, cy, cw, ch, cCol, g === 0 ? 0 : g === 1 ? 1 : 2);
  const lab = 'Cancel';
  const tmp = new Buf(cw, 10, 0);
  text(tmp, lab, Math.round((cw - textWidth(lab)) / 2), 0, 1);
  for (let j = 0; j < 10; j++)
    for (let i = 0; i < cw; i++) {
      if (tmp.c[j * cw + i] !== 1) continue;
      const knock = g >= 3 ? (i & 1) && (j & 1) : g >= 2 ? (i & 1) && (j & 1) && ((i + j) & 2) : false;
      if (knock) continue;
      b.set(cx + i, cy + 5 + j, o.cancelDown ? paper : cCol);
    }
  // OK, default ring
  const [ox, oy, ow, oh] = dialogButton(x, y, 'ok', w);
  if (o.okDown) rect(ox + 1, oy + 1, ow - 2, oh - 2, b.ink(ink));
  roundRect(b, ox, oy, ow, oh, ink);
  for (let t = 2; t <= 4; t++) roundRect(b, ox - t, oy - t, ow + t * 2, oh + t * 2, t === 3 ? PAL.C4 : ink);
  text(b, 'OK', ox + Math.round((ow - textWidth('OK')) / 2), oy + 5, o.okDown ? paper : ink);
};

// ------------------------------------------------------------------ the board's pointer (a classic arrow)
const ARROW = [
  'o..........', 'oo.........', 'owo........', 'owwo.......', 'owwwo......', 'owwwwo.....', 'owwwwwo....', 'owwwwwwo...',
  'owwwwwwwo..', 'owwwwwoooo.', 'owwowwo....', 'owo.owwo...', 'oo..owwo...', 'o....owwo..', '.....owwo..', '......oo...',
];
/** (x, y) = the hot spot (arrow tip). press = the 1 px click dip. */
export const drawPointer = (b: Buf, x: number, y: number, press = false) => {
  ARROW.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = r[i]; if (c === 'o') b.set(x + i, y + j + (press ? 1 : 0), PAL.N0); else if (c === 'w') b.set(x + i, y + j + (press ? 1 : 0), PAL.P2); } });
};
/** Pointer glide from a to b over t0..t1, eased out, whole px on 1s (a pointer is UI: it moves every frame). */
export const pointerAt = (f: number, t0: number, t1: number, a: [number, number], z: [number, number]): [number, number] => {
  const t = clamp((f - t0) / Math.max(1, t1 - t0), 0, 1), e = 1 - (1 - t) * (1 - t);
  return [Math.round(a[0] + (z[0] - a[0]) * e), Math.round(a[1] + (z[1] - a[1]) * e)];
};

// ================================================================== the desaturated call (salvage)
/** Everything collapses onto the cool greys: the call "90% desaturated" (Mas's greyed tile, the FIRED look). */
export const CALL_GREY: PaletteSet = compilePalette({
  id: 'CALL_GREY', label: 'CALL GREY', use: 'the board call, desaturated (the falling tile)',
  colors: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  ramp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6, PAL.P2],
  mode: 'tone', levels: 3, pattern: bayer4, tone: {lo: 0.1, hi: 0.86, gamma: 0.9},
});

// ================================================================== webcam busts (salvage + MADA's folded arms)
const BW = 72, BH = 80;
const plane = (onlyMat: string, tone: number, ...prims: ReturnType<typeof P.poly>[]): Adjust => ({prims, tone, onlyMat});
const WEBCAM_RIG = (ramps: Record<string, number[]>): LightRig => ({
  key: [-0.55, -0.6], keyBand: 0, shadowBand: 0, rim: true, outline: true, edgesOnTop: true, noEdge: ['in'],
  back: [0.9, -0.3], backBand: 1, backRamp: {}, ramps,
});
const nelehFig = (): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(2, 80, 4, 66, 12, 58, 24, 53, 36, 52, 48, 53, 60, 58, 68, 66, 70, 80)]},
    {group: 'top', mat: 'top', tone: 3, prims: [P.poly(27, 53, 36, 51, 45, 53, 41, 64, 36, 68, 31, 64)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(30, 42, 30, 55, 36, 58, 42, 55, 42, 42)]},
    {group: 'hairB', mat: 'hair', tone: 1, prims: [P.poly(16, 30, 17, 16, 24, 8, 36, 5, 48, 8, 55, 16, 56, 30, 56, 44, 50, 47, 22, 47, 16, 44)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(22, 22, 24, 13, 30, 9, 36, 8, 42, 9, 48, 13, 50, 22, 50, 31, 48, 38, 44, 44, 36, 48, 28, 44, 24, 38, 22, 31)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [
      P.poly(20, 30, 20, 18, 25, 10, 32, 7, 36, 9, 30, 12, 26, 18, 24, 28, 24, 40, 25, 46, 18, 46, 17, 38),
      P.poly(52, 30, 52, 18, 47, 10, 40, 7, 36, 9, 42, 12, 46, 18, 48, 28, 48, 40, 47, 46, 54, 46, 55, 38),
    ]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(26, 16, 32, 12, 36, 12, 30, 16, 27, 22), P.poly(34, 26, 37, 26, 36, 34, 34, 35)),
    plane('skin', 2, P.poly(44, 18, 48, 22, 48, 32, 45, 40, 44, 30), P.poly(28, 41, 36, 45, 44, 41, 40, 46, 32, 46)),
    plane('hair', 3, P.poly(24, 12, 30, 9, 26, 15, 23, 22)),
    plane('hair', 1, P.line(36, 8, 36, 11), P.poly(46, 20, 48, 28, 48, 42, 46, 44)),
    plane('neck', 0, P.poly(30, 44, 36, 48, 42, 44, 42, 49, 36, 52, 30, 49)),
    plane('jacket', 3, P.poly(6, 66, 12, 58, 22, 54, 16, 62, 10, 72)),
    plane('jacket', 1, P.poly(60, 58, 68, 66, 70, 80, 62, 80, 60, 68), P.line(26, 56, 30, 80), P.line(46, 56, 42, 80)),
  ];
  const stamps: FigureDef['stamps'] = [
    {x: 26, y: 23, rows: ['.bbbb.....bbbb.', 'b..........b..b'], pal: {b: PAL.B1}},
    {x: 27, y: 26, rows: ['.www....www.', 'wiIw...wiIw.', '.kk.....kk..'], pal: {w: PAL.S5, i: PAL.B3, I: PAL.N0, k: PAL.S2}},
    {x: 35, y: 31, rows: ['.o', 'oo'], pal: {o: PAL.S2}},
    {x: 31, y: 37, rows: ['.mmmmmmm.', '..lllll..'], pal: {m: PAL.S1, l: PAL.S4}},
  ];
  return {w: BW, h: BH, parts, adjust, stamps};
};
/** MADA: short dark hair, rectangular glasses, a crew-neck sweater, ARMS FOLDED (perfectly still). */
const madaFig = (): FigureDef => {
  const parts: Part[] = [
    {group: 'torso', mat: 'jacket', tone: 2, prims: [P.poly(0, 80, 3, 64, 12, 56, 24, 52, 36, 51, 48, 52, 60, 56, 69, 64, 72, 80)]},
    {group: 'neck', mat: 'neck', tone: 2, prims: [P.poly(29, 40, 29, 54, 36, 57, 43, 54, 43, 40)]},
    {group: 'rib', mat: 'jacket', tone: 3, prims: [P.poly(26, 52, 36, 55, 46, 52, 44, 56, 36, 59, 28, 56)]},
    {group: 'head', mat: 'skin', tone: 3, prims: [P.poly(21, 22, 22, 13, 28, 8, 36, 7, 44, 8, 50, 13, 51, 22, 51, 32, 48, 40, 43, 45, 36, 47, 29, 45, 24, 40, 21, 32)]},
    {group: 'ears', mat: 'skin', tone: 2, prims: [P.ell(20.5, 28, 2.5, 4), P.ell(51.5, 28, 2.5, 4)]},
    {group: 'hair', mat: 'hair', tone: 2, prims: [P.poly(20, 24, 20, 14, 25, 7, 32, 4, 40, 4, 47, 7, 52, 14, 52, 24, 50, 18, 46, 13, 38, 12, 30, 13, 25, 15, 22, 20)]},
    // the folded arms: the far forearm tucked under, the near one across on top (a clear lit band), both hands
    // gripping the opposite upper arms: the poker face's posture, perfectly still
    {group: 'armB', mat: 'arm', tone: 1, prims: [P.poly(8, 68, 18, 63, 44, 64, 60, 62, 66, 66, 62, 71, 40, 71, 14, 73)]},
    {group: 'armF', mat: 'arm', tone: 3, prims: [P.poly(6, 74, 14, 69, 34, 68, 56, 69, 68, 72, 68, 79, 46, 80, 14, 80, 6, 78)]},
    {group: 'handR', mat: 'neck', tone: 3, prims: [P.poly(58, 64, 63, 62, 67, 65, 66, 69, 61, 70, 58, 68)]},
    {group: 'handL', mat: 'neck', tone: 3, prims: [P.poly(6, 70, 10, 67, 14, 68, 14, 73, 9, 74)]},
  ];
  const adjust: Adjust[] = [
    plane('skin', 4, P.poly(24, 16, 30, 13, 36, 13, 28, 17, 25, 22), P.poly(34, 27, 37, 27, 36, 35, 34, 36)),
    plane('skin', 2, P.poly(45, 18, 50, 22, 50, 32, 46, 40, 45, 30), P.poly(28, 41, 36, 45, 44, 41, 40, 46, 32, 46)),
    plane('hair', 3, P.poly(24, 10, 32, 6, 28, 10, 23, 16)),
    plane('hair', 1, P.poly(44, 9, 50, 14, 51, 22, 47, 15)),
    plane('neck', 0, P.poly(29, 42, 36, 47, 43, 42, 43, 48, 36, 51, 29, 48)),
    plane('jacket', 3, P.poly(4, 64, 12, 57, 22, 53, 15, 61, 9, 71)),
    plane('jacket', 1, P.poly(60, 57, 69, 64, 72, 80, 63, 80, 61, 68)),
    plane('arm', 4, P.line(14, 69, 34, 68), P.line(35, 68, 56, 69)),
    plane('arm', 0, P.line(14, 74, 60, 72)),
    plane('neck', 4, P.line(60, 63, 64, 63)),
  ];
  const stamps: FigureDef['stamps'] = [
    {x: 25, y: 22, rows: ['bbbbb....bbbbb', '..............'], pal: {b: PAL.B0}},
    {x: 24, y: 24, rows: ['gggggggg.gggggggg', 'g.wiIw.ggg.wiIw.g', 'g..kk..g.g..kk..g', 'ggggggg...ggggggg'], pal: {g: PAL.N0, w: PAL.S5, i: PAL.B3, I: PAL.N0, k: PAL.S3}},
    {x: 26, y: 25, rows: ['j'], pal: {j: PAL.P2}},
    {x: 35, y: 31, rows: ['.o', 'oo'], pal: {o: PAL.S2}},
    {x: 31, y: 38, rows: ['mmmmmmmmm', '.lllllll.'], pal: {m: PAL.S1, l: PAL.S4}},
  ];
  return {w: BW, h: BH, parts, adjust, stamps};
};
const RAMPS_CALL = {
  skin: [PAL.S0, PAL.S1, PAL.S3, PAL.S4, PAL.S5, PAL.K4],
  neck: [PAL.S0, PAL.S1, PAL.S2, PAL.S3, PAL.S4, PAL.S5],
  in: [PAL.N0, PAL.N0, PAL.N1, PAL.N1, PAL.N2, PAL.N2],
};
export const nelehBust = memo1(() => renderFigure(nelehFig(), WEBCAM_RIG({
  ...RAMPS_CALL,
  hair: [PAL.B0, PAL.B1, PAL.B3, PAL.B4, PAL.W4, PAL.W5],
  jacket: [PAL.N0, PAL.D1, PAL.D3, PAL.D4, PAL.W3, PAL.W5],
  top: [PAL.N1, PAL.P0, PAL.P1, PAL.P1, PAL.P2, PAL.P2],
})));
export const madaBust = memo1(() => renderFigure(madaFig(), WEBCAM_RIG({
  ...RAMPS_CALL,
  hair: [PAL.B0, PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.G3],
  jacket: [PAL.N0, PAL.L0, PAL.L1, PAL.L2, PAL.L2, PAL.C4],
  arm: [PAL.N0, PAL.L0, PAL.L1, PAL.L2, PAL.L3, PAL.C5],
})));
export const BUST_W = BW, BUST_H = BH;

// ================================================================== tile backgrounds (salvage)
/** A Buf view that only writes inside a rect (painters can never spill out of their tile). */
export const clipView = (b0: Buf, x: number, y: number, w: number, h: number): Buf => {
  const v = new Buf(1, 1, 0);
  v.w = b0.w; v.h = b0.h;
  v.set = (px: number, py: number, c: number) => { px |= 0; py |= 0; if (px >= x && py >= y && px < x + w && py < y + h) b0.set(px, py, c); };
  v.get = (px: number, py: number) => b0.get(px, py);
  return v;
};

/** MAS's tile: a hotel room, the Strip's neon through the glass, a race car streaking past below. */
export const vegasBg = (b0: Buf, x: number, y: number, w: number, h: number, f: number, frozen = false, guard = false) => {
  const b = clipView(b0, x, y, w, h);
  // guard (v5, STYLE-1G-NEON; additive, default off so v4 draws as before): 1.G's chase-light guardrail is one step
  // every 8 frames at most (3 in any 24 f). v4's lights step every 2-4 f and the race car streaks; guarded, every
  // light steps on ONE 8-f clock by one position (ff is re-scaled so each light's own divisor advances it by exactly
  // one per 8 f), and the car is gone (motion noise)
  const g = Math.floor((frozen ? 0 : f) / 8);
  const ff = frozen ? 0 : f;
  const st4 = guard ? g * 4 : ff, st3 = guard ? g * 3 : ff, st2 = guard ? g * 2 : ff;
  rect(x, y, w, h, b.ink(PAL.N1));
  const wx = x + 34, ww = w - 34;
  for (let j = 0; j < h; j++) for (let i = 0; i < ww; i++) b.set(wx + i, y + j, j < h * 0.55 ? (bayer(i, j) < (j / (h * 0.55)) * 0.5 ? PAL.N3 : PAL.N2) : PAL.N1);
  rect(wx + 70, y + 10, 26, h - 10, b.ink(PAL.N0));
  for (let j = 14; j < h - 20; j += 5) for (let i = 73; i < 94; i += 4) if (hash(i, j, 3) < 0.55) b.set(wx + i, y + j, hash(i, j, 4) < 0.5 ? PAL.W6 : PAL.W4);
  const star = [[0, -4], [0, -3], [0, -2], [-1, -1], [1, -1], [-4, 0], [-3, 0], [-2, 0], [2, 0], [3, 0], [4, 0], [-1, 1], [1, 1], [0, 2], [0, 3], [0, 4], [0, -1], [0, 0], [0, 1], [-1, 0], [1, 0]];
  const on = Math.floor(st4 / 4) % 3 !== 2;
  for (const [i, j] of star) b.set(wx + 50 + i, y + 16 + j, on ? (i === 0 && j === 0 ? PAL.W9 : PAL.W7) : PAL.W4);
  rect(wx + 30, y + 6, 9, 44, b.ink(PAL.N0));
  for (let j = 0; j < 8; j++) { const c = (j + Math.floor(st3 / 3)) % 8 === 0 ? PAL.P2 : PAL.R3; rect(wx + 32, y + 9 + j * 5, 5, 3, b.ink(c)); rect(wx + 33, y + 10 + j * 5, 3, 1, b.ink(PAL.R1)); }
  for (let i = 0; i < ww - 8; i += 3) b.set(wx + 4 + i, y + 56, ((i / 3 + Math.floor(st2 / 2)) % 3 === 0) ? PAL.W8 : PAL.W4);
  const cx = ((ff * 23) % 190) - 30;
  if (!frozen && !guard && cx > -20 && cx < ww + 10) {
    const cy = y + h - 12;
    rect(wx + cx, cy, 16, 3, b.ink(PAL.R2)); rect(wx + cx + 4, cy - 2, 6, 2, b.ink(PAL.N0));
    rect(wx + cx + 1, cy + 3, 3, 1, b.ink(PAL.N0)); rect(wx + cx + 11, cy + 3, 3, 1, b.ink(PAL.N0));
    for (let k = 1; k < 18; k++) if (bayer(k, 0) < 1 - k / 18) b.set(wx + cx - k, cy + 1, PAL.R3);
    rect(wx + cx + 15, cy + 1, 2, 1, b.ink(PAL.W8));
  }
  rect(wx - 1, y, 2, h, b.ink(PAL.N0));
  rect(wx + 1, y, 1, h, b.ink(PAL.R1));
};

/** NELEH's tile: a bookshelf (an academic's standard-issue video background). */
export const shelfBg = (b0: Buf, x: number, y: number, w: number, h: number) => {
  const b = clipView(b0, x, y, w, h);
  rect(x, y, w, h, b.ink(PAL.D1));
  const spines = [PAL.D3, PAL.R1, PAL.N4, PAL.L1, PAL.D4, PAL.P0, PAL.W3, PAL.N5];
  for (let s = 0; s < 4; s++) {
    const sy = y + 4 + s * 21;
    rect(x, sy + 17, w, 3, b.ink(PAL.D3));
    rect(x, sy + 20, w, 1, b.ink(PAL.D0));
    let bx = x + 2 + ((s * 7) % 5);
    while (bx < x + w - 2) {
      const bw = 2 + Math.floor(hash(bx, s, 9) * 3);
      const bh = 11 + Math.floor(hash(bx, s, 8) * 6);
      const col = spines[Math.floor(hash(bx, s, 7) * spines.length)];
      rect(bx, sy + 17 - bh, bw, bh, b.ink(col));
      b.set(bx, sy + 17 - bh, PAL.P1);
      bx += bw + (hash(bx, s, 6) < 0.15 ? 3 : 0);
    }
  }
};

/** MADA's tile: a plain office wall, one framed print, a plant. */
export const officeBg = (b0: Buf, x: number, y: number, w: number, h: number) => {
  const b = clipView(b0, x, y, w, h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, bayer(i, j) < i / w * 0.6 ? PAL.N3 : PAL.N4);
  rect(x + w - 44, y + 12, 30, 22, b.ink(PAL.N0));
  rect(x + w - 42, y + 14, 26, 18, b.ink(PAL.P1));
  line(x + w - 42, y + 29, x + w - 30, y + 20, b.ink(PAL.L1)); line(x + w - 30, y + 20, x + w - 17, y + 27, b.ink(PAL.L1));
  rect(x + 8, y + h - 18, 10, 18, b.ink(PAL.D2));
  for (const [i, j] of [[0, -6], [-4, -10], [4, -12], [-2, -16], [3, -19], [0, -22]] as const) ellipse(x + 13 + i, y + h - 16 + j, 4, 3, b.ink(PAL.L1));
};

/** THE QUIET VOTE: a black tile. `disc` adds the generic avatar disc (off by default: the script says a black tile). */
export const camOffBg = (b0: Buf, x: number, y: number, w: number, h: number, disc = false) => {
  const b = clipView(b0, x, y, w, h);
  rect(x, y, w, h, b.ink(PAL.N0));
  rect(x, y, w, 1, b.ink(PAL.N2)); rect(x, y + h - 1, w, 1, b.ink(PAL.N2)); rect(x, y, 1, h, b.ink(PAL.N2)); rect(x + w - 1, y, 1, h, b.ink(PAL.N2));
  if (disc) {
    ellipse(x + w / 2, y + h / 2 - 4, 13, 13, b.ink(PAL.G1));
    ellipse(x + w / 2, y + h / 2 - 9, 5, 5, b.ink(PAL.G3));
    poly([x + w / 2 - 9, y + h / 2 + 6, x + w / 2 - 6, y + h / 2 - 1, x + w / 2 + 6, y + h / 2 - 1, x + w / 2 + 9, y + h / 2 + 6], b.ink(PAL.G3));
  }
};

// ================================================================== tile content painters
export interface PaintOpts { frozen?: boolean; seed?: number; /** hold every loop (footnotes, spinner, neon) on the drawing it had at this frame */ frozenAt?: number; hand?: 0 | 1 | 2; /** v5 (STYLE-1G-NEON): his tile's neon on 1.G's guardrail clock (see vegasBg); default off = v4's drawing */ neonGuard?: boolean; /** v5 (STATE-SMALL 5): Alyi's mouth in his tile on his side ('open' while he talks unheard); default 'rest' = v4 */ mouth?: 'rest' | 'open'; }
export type Painter = (b: Buf, x: number, y: number, w: number, h: number, f: number, o: PaintOpts) => void;

/** Footnote superscripts orbiting a head: [dx, dy, digit, front] for frame f (whole px, on 2s). */
export const footnoteOrbit = (f: number, n = 3, rx = 27, ry = 6, period = 48): Array<[number, number, string, boolean]> => {
  const out: Array<[number, number, string, boolean]> = [];
  const ff = Math.floor(f / 2) * 2;
  for (let i = 0; i < n; i++) {
    const a = (ff / period) * Math.PI * 2 + (i * Math.PI * 2) / n;
    out.push([Math.round(Math.cos(a) * rx), Math.round(Math.sin(a) * ry), String(i + 1), Math.sin(a) > 0]);
  }
  return out;
};
const footnote = (b: Buf, x: number, y: number, d: string, col: number) => {
  micro(b, d, x, y, col);
  b.set(x - 1, y - 1, stepColor(col, -2));
};

/** A glowing paper on a surface: the charter, a soft gold halo in ordered dither (background, never skin). */
export const glowingPaper = (b: Buf, x: number, y: number, f: number, frozen = false) => {
  const pulse = frozen ? 0 : [0, 1, 1, 0][Math.floor(f / 6) % 4];
  for (let j = -8; j < 16; j++)
    for (let i = -10; i < 22; i++) {
      const d = Math.hypot((i - 5.5) / 1.4, (j - 3.5));
      const r0 = 5, r1 = 11 + pulse;
      if (d < r0 || d > r1) continue;
      const t = 1 - (d - r0) / (r1 - r0);
      if (bayer(x + i, y + j) < t * 0.7) b.set(x + i, y + j, t > 0.55 ? PAL.W6 : t > 0.3 ? PAL.W5 : PAL.W4);
    }
  rect(x, y, 12, 8, b.ink(PAL.W8));
  rect(x, y + 7, 12, 1, b.ink(PAL.W6));
  for (let j = 2; j < 7; j += 2) rect(x + 2, y + j, 7, 1, b.ink(PAL.W7));
  b.set(x + 11, y, PAL.W9);
};

export const PAINTERS: Record<string, Painter> = {
  mas: (b, x, y, w, h, f, o) => {
    vegasBg(b, x, y, w, h, o.frozenAt ?? f, o.frozen, o.neonGuard);
    blitImg(b, masPortrait({mouth: 'rest', lid: 0, look: -1, brow: 0, light: 'monitor'}), x - 6, y - 12, {clip: inside(x, y, w, h)});
  },
  alyi: (b, x, y, w, h, f, o) => {
    // a corridor wall in tungsten spill, a door (dark frame, a tall glass pane); he is only a reflection in the glass
    const v = clipView(b, x, y, w, h);
    lightPool(v, x, y, w, h, w * 0.85, h * 0.2, w * 0.7, h * 1.1, PAL.N1, [[1, PAL.W0], [0.62, PAL.W1], [0.34, PAL.W2]]);
    const dx = x + 40, dw = 66, gy = y + 8;
    rect(dx - 5, y, dw + 10, h, v.ink(PAL.D1));
    rect(dx - 5, y, 2, h, v.ink(PAL.D3)); rect(dx + dw + 3, y, 2, h, v.ink(PAL.D0));
    rect(dx, gy, dw, h - 8, v.ink(PAL.N0));
    // the reflection: his portrait mapped onto dark glass (every colour to a dim cool ramp), offset and cropped
    const glass = (c: number) => { const L = lum3(c); return L > 0.62 ? PAL.C2 : L > 0.45 ? PAL.C1 : L > 0.3 ? PAL.N3 : L > 0.18 ? PAL.N2 : PAL.N1; };
    blitImg(v, alyiPortrait({eyes: 'open', mouth: o.mouth ?? 'rest', t: 0}), dx - 26, gy - 16, {clip: inside(dx, gy, dw, h - 8), map: glass});
    // the glass's own sheen over the reflection: sparse horizontal lines (it is a surface, not a window onto him)
    for (let j = gy; j < y + h; j += 3) for (let i = dx; i < dx + dw; i++) if (bayer(i, j) < 0.18) v.set(i, j, PAL.N3);
    // glare: two diagonal streaks across the pane, and the door's push bar
    for (let k = 0; k < 90; k++) { const px = dx + 8 + k * 0.7, py = gy + h - 10 - k; if (py > gy) { v.set(Math.round(px), py, PAL.C4); v.set(Math.round(px) + 5, py, PAL.C2); } }
    rect(dx, y + h - 22, dw, 3, v.ink(PAL.G3)); rect(dx, y + h - 22, dw, 1, v.ink(PAL.G5));
    void f; void o;
  },
  neleh: (b, x, y, w, h, f, o) => {
    shelfBg(b, x, y, w, h);
    const v = clipView(b, x, y, w, h);
    const ff = o.frozenAt ?? (o.frozen ? 0 : f);
    glowingPaper(v, x + 12, y + 46, ff, false);
    const bx = x + 38, by = y + 5;
    const hx = bx + 36, hy = by + 16; // her head centre (bust coords 36, 16..)
    const orbit = footnoteOrbit(ff);
    for (const [ox, oy, d, front] of orbit) if (!front) footnote(v, hx + ox - 1, hy + oy - 2, d, PAL.W6);
    blitImg(v, nelehBust(), bx, by);
    for (const [ox, oy, d, front] of orbit) if (front) footnote(v, hx + ox - 1, hy + oy - 2, d, PAL.W8);
  },
  mada: (b, x, y, w, h, f, o) => {
    officeBg(b, x, y, w, h);
    const v = clipView(b, x, y, w, h);
    blitImg(v, madaBust(), x + 40, y + 6);
    spinner(v, x + 75, y + 4, o.frozenAt ?? f, {frozen: o.frozen, size: 'r3', dot: 2});
  },
  off: (b, x, y, w, h) => camOffBg(b, x, y, w, h),
  gerg: (b, x, y, w, h, f, o) => {
    const v = clipView(b, x, y, w, h);
    rect(x, y, w, h, v.ink(PAL.N1));
    lightPool(v, x, y, w, h, w * 0.5, h * 1.05, w * 0.6, h * 0.55, PAL.N1, [[1, PAL.L0], [0.6, PAL.L1]]);
    blitImg(v, gergPortrait({mouth: 'rest', lid: 1, look: 0}), x + 22, y - 14, {clip: inside(x, y, w, h)});
    // the laptop lid edge at the bottom of frame; its screen throws green up onto his chin
    rect(x, y + h - 7, w, 7, v.ink(PAL.N0));
    rect(x + 20, y + h - 7, w - 40, 1, v.ink(PAL.L3));
    for (let i = 0; i < w - 44; i++) if (bayer(i, 0) < 0.5 && !o.frozen && Math.floor((f + i) / 3) % 5 === 0) v.set(x + 22 + i, y + h - 5, PAL.L2);
  },
  rima: (b, x, y, w, h) => {
    // her roll-call portrait, cropped to a webcam framing (jacket perfect); pair with spotlight() for the find
    const v = clipView(b, x, y, w, h);
    rect(x, y, w, h, v.ink(PAL.N0));
    drawRima(v, x + 6, y - 22, 2);
  },
  face: (b, x, y, w, h, f, o) => employeeFace(b, x, y, w, h, o.seed ?? 1, o.hand ?? 0),
  blank: (b, x, y, w, h) => rect(x, y, w, h, b.ink(PAL.N0)),
};
const inside = (x: number, y: number, w: number, h: number) => (px: number, py: number) => px >= x && py >= y && px < x + w && py < y + h;
const lum3 = (c: number) => (((c >> 16) & 255) * 0.3 + ((c >> 8) & 255) * 0.59 + (c & 255) * 0.11) / 255;

// ================================================================== employee faces (the avalanche; the all-hands)
const SKIN = [[PAL.S2, PAL.S3, PAL.S4], [PAL.S3, PAL.S4, PAL.S5], [PAL.S4, PAL.S5, PAL.S6], [PAL.S1, PAL.S2, PAL.S3], [PAL.S3, PAL.S5, PAL.S6]];
const HAIR = [PAL.B0, PAL.B1, PAL.B2, PAL.B3, PAL.B4, PAL.N0, PAL.G4, PAL.W3, PAL.P0, PAL.D2];
const SHIRT = [PAL.G2, PAL.G3, PAL.N4, PAL.N5, PAL.L1, PAL.F3, PAL.U2, PAL.D3, PAL.C3, PAL.R1, PAL.G5, PAL.W3];
const ROOM = [[PAL.N2, PAL.N3], [PAL.D1, PAL.D2], [PAL.N3, PAL.N4], [PAL.C0, PAL.C1], [PAL.U0, PAL.U1], [PAL.G0, PAL.G1], [PAL.W0, PAL.W1]];
/**
 * A generic employee's webcam tile, seeded (each seed is one person, held for good). Works from 9 x 9 up to ~40 x 30.
 * Head and shoulders, a room colour behind, hair style from 6, glasses sometimes, a laptop-lit cheek sometimes.
 * Nobody is a caricature of anyone: these are the 745.
 */
export const employeeFace = (b: Buf, x: number, y: number, w: number, h: number, seed: number, hand: 0 | 1 | 2 = 0) => {
  const r = (k: number) => hash(seed, k, 911);
  const room = ROOM[Math.floor(r(1) * ROOM.length)];
  const skin = SKIN[Math.floor(r(2) * SKIN.length)];
  const hair = HAIR[Math.floor(r(3) * HAIR.length)];
  const shirt = SHIRT[Math.floor(r(4) * SHIRT.length)];
  const style = Math.floor(r(5) * 6); // 0 short, 1 long, 2 bald, 3 bun, 4 curly, 5 cap
  const glasses = r(6) < 0.28;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, bayer(i + x, j + y) < j / h * 0.5 ? room[0] : room[1]);
  const cx = x + (w - 1) / 2 + (r(7) < 0.5 ? 0 : r(7) < 0.75 ? -1 : 1);
  const hr = Math.max(2, Math.round(w * 0.2)), hy = y + Math.round(h * 0.42);
  // shoulders
  const sw = Math.round(w * 0.42), sy = y + Math.round(h * 0.72);
  for (let j = sy; j < y + h; j++) for (let i = -sw; i <= sw; i++) { const d = Math.abs(i) - (j - sy) * 1.5; if (d <= sw - 1) b.set(Math.round(cx + i), j, Math.abs(i) > sw * 0.7 ? stepColor(shirt, -1) : shirt); }
  // neck + head
  rect(Math.round(cx) - 1, hy + hr - 1, 3, sy - (hy + hr - 1) + 1, b.ink(skin[0]));
  for (let j = -hr - 1; j <= hr + 1; j++)
    for (let i = -hr; i <= hr; i++) {
      if ((i * i) / (hr * hr) + (j * j) / ((hr + 1) * (hr + 1)) > 1.05) continue;
      b.set(Math.round(cx + i), hy + j, i > hr * 0.4 ? skin[0] : i < -hr * 0.3 && j < 0 ? skin[2] : skin[1]);
    }
  // hair
  const X = (i: number) => Math.round(cx + i);
  if (style !== 2 && style !== 5) for (let i = -hr; i <= hr; i++) { b.set(X(i), hy - hr - 1, hair); if (Math.abs(i) >= hr - 1 || (style === 4 && (i & 1))) b.set(X(i), hy - hr, hair); }
  if (style === 0) for (let i = -hr + 1; i <= hr - 1; i++) b.set(X(i), hy - hr, hair);
  if (style === 1) for (let j = -hr; j <= hr + 2; j++) { b.set(X(-hr - 1), hy + j, hair); b.set(X(hr + 1), hy + j, hair); if (j < 0) { b.set(X(-hr), hy + j, hair); b.set(X(hr), hy + j, hair); } }
  if (style === 3) { rect(X(-1), hy - hr - 3, 3, 2, b.ink(hair)); for (let i = -hr; i <= hr; i++) b.set(X(i), hy - hr, hair); }
  if (style === 4) for (let i = -hr - 1; i <= hr + 1; i += 2) { b.set(X(i), hy - hr - 2, hair); b.set(X(i), hy - hr + 1, hair); }
  if (style === 5) { for (let i = -hr - 1; i <= hr; i++) { b.set(X(i), hy - hr - 1, shirt); b.set(X(i), hy - hr, shirt); } rect(X(hr), hy - hr, 2, 1, b.ink(stepColor(shirt, -1))); }
  // eyes (2 dark px), glasses
  const ey = hy - (hr > 2 ? 0 : 0);
  b.set(X(-Math.ceil(hr / 2)), ey, PAL.N0); b.set(X(Math.floor(hr / 2)), ey, PAL.N0);
  if (glasses && hr >= 3) for (let i = -hr + 1; i <= hr - 1; i++) if (i !== 0) b.set(X(i), ey - 1, PAL.N0);
  if (w >= 16 && hr >= 3) b.set(X(0), ey + Math.round(hr * 0.6), skin[0]);
  // a hand going up ("Is this a coup?"): 1 = at the shoulder, 2 = raised beside the head (2 drawings)
  if (hand) {
    const hx = Math.round(cx + hr + 2), top = hand === 2 ? hy - hr - 1 : hy + 1;
    const sleeve = stepColor(shirt, 1);
    for (let j = top + 3; j < y + h; j++) { b.set(hx, j, sleeve); b.set(hx + 1, j, sleeve); }
    rect(hx - 1, top, 3, 3, b.ink(skin[1])); b.set(hx - 1, top - 1, skin[1]); b.set(hx + 1, top - 1, skin[2]);
  }
};

// ================================================================== drawing a tile
export interface TileState extends TileRect {
  /** painter key (PAINTERS) */
  id: string;
  name?: string;
  /** a second label line on camera-off tiles, e.g. 'camera off' */
  sub?: string;
  muted?: boolean;
  speaking?: boolean;
  /** 0..3 mic level bars */
  level?: number;
  /** vote chip state (-1 = none) */
  vote?: -1 | 0 | 1 | 2 | 3;
  /** desaturate (CALL_GREY) */
  grey?: boolean;
  frozen?: boolean;
  /** freeze mid-loop: hold the painter's loops on the drawing they had at this frame (26.08) */
  frozenAt?: number;
  /** frames since the tile started opening (3 held steps: 1/3, 2/3, full); undefined = open */
  open?: number;
  seed?: number;
  hand?: 0 | 1 | 2;
  /** v5 (STYLE-1G-NEON): his tile's neon on 1.G's 8-frame guardrail clock, no race car; default off (v4) */
  neonGuard?: boolean;
  /** v5 (STATE-SMALL 5): Alyi's reflection's mouth ('rest' | 'open'); default 'rest' (v4) */
  mouth?: 'rest' | 'open';
}
/** One call tile: its content, its frame, chips. */
export const drawTile = (b: Buf, t: TileState, f: number) => {
  if (t.open !== undefined && t.open < 6) {
    // opening: the tile is a black plate that grows from its centre line in 3 held steps (never a smooth scale)
    if (t.open < 0) return;
    const step = t.open < 2 ? 0.2 : t.open < 4 ? 0.55 : 0.85;
    const hh = Math.max(3, Math.round(t.h * step)), yy = t.y + Math.round((t.h - hh) / 2);
    rect(t.x - 1, yy - 1, t.w + 2, hh + 2, b.ink(PAL.N0));
    rect(t.x, yy, t.w, hh, b.ink(PAL.N2));
    rect(t.x, yy, t.w, 1, b.ink(PAL.N4));
    return;
  }
  rect(t.x - 1, t.y - 1, t.w + 2, t.h + 2, b.ink(PAL.N0));
  rect(t.x - 2, t.y - 2, t.w + 4, 1, b.ink(PAL.N2));
  const p = PAINTERS[t.id] ?? PAINTERS.blank;
  p(b, t.x, t.y, t.w, t.h, f, {frozen: t.frozen, frozenAt: t.frozenAt, seed: t.seed, hand: t.hand, neonGuard: t.neonGuard, mouth: t.mouth});
  if (t.id === 'off') {
    const s = t.name ?? 'THE QUIET VOTE';
    text(b, s, t.x + Math.round((t.w - textWidth(s)) / 2), t.y + Math.round(t.h / 2) - 8, PAL.G4);
    const sub = t.sub ?? 'camera off';
    text(b, sub, t.x + Math.round((t.w - textWidth(sub)) / 2), t.y + Math.round(t.h / 2) + 3, PAL.G2);
  } else if (t.name) nameChip(b, t.x + 2, t.y + t.h - 13, t.name);
  if (t.muted !== undefined || t.level !== undefined) micIcon(b, t.x + t.w - 13, t.y + t.h - 13, {muted: t.muted, level: t.level});
  if (t.vote !== undefined && t.vote >= 0) voteChip(b, t.x + t.w - 12, t.y + 3, t.vote as 0 | 1 | 2 | 3);
  if (t.grey) {
    for (let j = t.y; j < t.y + t.h; j++) for (let i = t.x; i < t.x + t.w; i++) { const c = b.get(i, j); b.set(i, j, CALL_GREY.map(c, i, j)); }
  }
  if (t.speaking) speakingRing(b, t);
};

/** Capture a tile (content + chips) as an Img, for the drop / dissolve. Cached per (id, f). */
const KEY = 0x010203;
const capCache = new Map<string, Img>();
export const captureTile = (t: TileState, f: number): Img => {
  const k = JSON.stringify(t) + '|' + f;
  let v = capCache.get(k);
  if (v) return v;
  const buf = new Buf(480, 270, KEY);
  const at = {...t, x: 2, y: 2};
  drawTile(buf, {...at, speaking: false}, f);
  v = imgFromBuf(buf, 1, 1, t.w + 2, t.h + 2, KEY);
  capCache.set(k, v);
  if (capCache.size > 64) capCache.delete(capCache.keys().next().value as string);
  return v;
};

// ================================================================== the drop + the GLYPH dissolve
/** The fall: FOUR held drawings straight down (whole px, a new drawing every 4 frames: f0 / 4 / 8 / 12), then the
 *  emptied plate keeps going below frame on the same cadence. k = frames since the drop. */
export const DROP: Array<[number, number]> = [[0, 4], [6, 4], [18, 4], [38, 4], [66, 4], [102, 4], [146, 4], [200, 4], [270, 4]];
export const dropY = (k: number) => (k < 0 ? 0 : holds(k, DROP.map(([dy, n]) => [dy, n] as [number, number])));
export const DISSOLVE_STYLE: GlyphStyle = {cell: [2, 3], bloom: 0.55, tint: PAL.C6, tintAmt: 0.3};
/**
 * The falling tile (sc 26 phrase 3): the tile drops through four drawings while it comes apart into tokens
 * (GLYPH dissolve, 20 frames). Draws the still-solid cells into fb and returns the token layer. k = frames since
 * the drop. `grey` pre-desaturates (the greyed tile that becomes the F1.2 render front's start).
 */
export const tileDrop = (fb: Buf, img: Img, x: number, y: number, k: number, o: {frames?: number; grey?: boolean; wind?: [number, number]; seed?: number} = {}): GlyphLayer => {
  const src = o.grey ? mapImg(img, (c, i, j) => CALL_GREY.map(c, i + x, j + y)) : img;
  return glyphDissolve(fb, src, x - 1, y - 1 + dropY(k), {
    ...DISSOLVE_STYLE, t: k, frames: o.frames ?? 20, wind: o.wind ?? [1.2, 2.6], from: 'top', spread: 0.5, lead: 2, life: 12, seed: o.seed ?? 11,
  });
};

/**
 * The emptied plate: what's left of a tile after the dissolve (a greyed frame, a dark face, the ghost of its name
 * chip). It keeps falling (26.05) and, still falling in a corner, starts the F1.2 render front (26.11).
 */
export const tilePlate = (b: Buf, x: number, y: number, w = TILE_W, h = TILE_H) => {
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.G3));
  rect(x, y, w, h, b.ink(PAL.G0));
  rect(x, y, w, 1, b.ink(PAL.G2));
  rect(x + 2, y + h - 13, 60, 11, b.ink(PAL.G1));
  for (let j = y + 2; j < y + h - 2; j += 2) for (let i = x + 2; i < x + w - 2; i++) if (bayer(i, j) < 0.08) b.set(i, j, PAL.G1);
};
/** The emptied plate's fall after the dissolve: 4 px per held step (4 frames), from where the drop left it. */
export const plateFallY = (k: number, from = 0) => from + Math.floor(Math.max(0, k) / 4) * 4;

/** "..." typed into a small box above a tile at 1 char / 4 frames, then it just stops (26.03). k = frames since. */
export const typedDots = (b: Buf, x: number, y: number, k: number) => {
  if (k < 0) return;
  const n = Math.min(3, Math.floor(k / 4) + 1);
  rect(x, y, 23, 11, b.ink(PAL.N0)); rect(x + 1, y + 1, 21, 9, b.ink(PAL.N1)); rect(x + 1, y + 1, 21, 1, b.ink(PAL.N5));
  b.set(x + 3, y + 11, PAL.N0); b.set(x + 4, y + 11, PAL.N0); b.set(x + 3, y + 12, PAL.N0);
  for (let i = 0; i < n; i++) rect(x + 6 + i * 5, y + 6, 2, 2, b.ink(PAL.P1));
};

// ================================================================== the spotlight (a hard circle finds a tile)
/**
 * A hard circular spotlight over a region: outside the circle steps 2 rungs darker, a 1 px warm rim on the edge.
 * `find` = frames since it started searching: it lands in 3 held drawings (overshoot, back, on the mark).
 */
export const spotlight = (b: Buf, rgn: TileRect, cx: number, cy: number, r: number, find = 99, o: {leave?: number; rim?: boolean} = {}) => {
  // hard edge, no glow (27.03): a 2-rung palette step outside the circle. `leave` = frames since it starts to drift
  // off (27.05: 3 held positions, then gone). `rim` adds a 1 px warm edge (off by default).
  const path: Array<[number, number]> = [[-60, -20], [18, 6], [-5, -2], [0, 0]];
  let [ox, oy] = path[Math.min(3, Math.max(0, Math.floor(find / 3)))];
  if (o.leave !== undefined && o.leave >= 0) {
    const out: Array<[number, number]> = [[8, -2], [26, -6], [58, -12], [400, 0]];
    [ox, oy] = out[Math.min(3, Math.floor(o.leave / 4))];
  }
  const X = cx + ox, Y = cy + oy;
  for (let j = rgn.y; j < rgn.y + rgn.h; j++)
    for (let i = rgn.x; i < rgn.x + rgn.w; i++) {
      const d = Math.hypot(i + 0.5 - X, j + 0.5 - Y);
      if (d > r + (o.rim ? 1 : 0)) b.set(i, j, stepColor(stepColor(b.get(i, j), -1), -1));
      else if (o.rim && d > r) b.set(i, j, PAL.W8);
    }
};

/** A tile-sized plate of text (a post / quote inside the grid), used by pass one's notifications. */
export const postChip = (b: Buf, x: number, y: number, who: string, s: string, col: number = PAL.P1) => {
  const w = Math.max(textWidth(s), textWidth(who)) + 12;
  rect(x, y, w, 26, b.ink(PAL.N0)); rect(x + 1, y + 1, w - 2, 24, b.ink(PAL.N2)); rect(x + 1, y + 1, w - 2, 1, b.ink(PAL.N4));
  text(b, who, x + 6, y + 4, PAL.C6);
  text(b, s, x + 6, y + 14, col);
  return w;
};

// ================================================================== the security-camera tile (sc 27: the lobby, seen from the board's side)
/** A cool monochrome for CCTV (never skin-dithered: a threshold per colour). */
export const CCTV: PaletteSet = compilePalette({
  id: 'CCTV', label: 'CCTV', use: 'a security-camera tile inside the call grid',
  colors: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6],
  ramp: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.G5, PAL.G6],
  mode: 'tone', levels: 2, tone: {lo: 0.08, hi: 0.75, gamma: 0.85},
});
/**
 * Turn a tile's content (already painted) into security-camera footage: CCTV greys, every other row a rung darker,
 * corner brackets, a camera label, a REC dot that blinks once a second (small: no flash), a running clock-free
 * frame counter. `post` sits UPSIDE-DOWN in the tile's corner (a pixel-exact 180-degree flip of the lettering).
 */
export const cctv = (b: Buf, t: TileRect, f: number, o: {label?: string; post?: string} = {}) => {
  for (let j = t.y; j < t.y + t.h; j++)
    for (let i = t.x; i < t.x + t.w; i++) {
      let c = CCTV.map(b.get(i, j), i, j);
      if ((j - t.y) & 1) c = stepColor(c, -1);
      b.set(i, j, c);
    }
  const br = (x: number, y: number, dx: number, dy: number) => { rect(x, y, 6 * dx || 1, 1, b.ink(PAL.G6)); rect(x, y, 1, 6 * dy || 1, b.ink(PAL.G6)); };
  const L = t.x + 3, R = t.x + t.w - 4, T = t.y + 3, B = t.y + t.h - 4;
  rect(L, T, 6, 1, b.ink(PAL.G6)); rect(L, T, 1, 6, b.ink(PAL.G6));
  rect(R - 5, T, 6, 1, b.ink(PAL.G6)); rect(R, T, 1, 6, b.ink(PAL.G6));
  rect(L, B, 6, 1, b.ink(PAL.G6)); rect(L, B - 5, 1, 6, b.ink(PAL.G6));
  rect(R - 5, B, 6, 1, b.ink(PAL.G6)); rect(R, B - 5, 1, 6, b.ink(PAL.G6));
  void br;
  micro(b, o.label ?? 'CAM 02 LOBBY', t.x + 7, t.y + 6, PAL.G6);
  if (Math.floor(f / 12) % 2 === 0) { rect(t.x + t.w - 22, t.y + 6, 3, 3, b.ink(PAL.R3)); }
  micro(b, 'REC', t.x + t.w - 17, t.y + 5, PAL.G6);
  if (o.post) {
    const w = textWidth(o.post) + 8;
    const tmp = new Buf(w, 11, 0);
    rect(0, 0, w, 11, tmp.ink(PAL.N0));
    text(tmp, o.post, 4, 2, PAL.P1);
    // bottom-right corner, flipped both ways (pixel-exact: nothing is resampled)
    const x0 = t.x + t.w - 4 - w, y0 = t.y + t.h - 16;
    for (let j = 0; j < 11; j++) for (let i = 0; i < w; i++) b.set(x0 + i, y0 + j, tmp.c[(10 - j) * w + (w - 1 - i)]);
  }
};
