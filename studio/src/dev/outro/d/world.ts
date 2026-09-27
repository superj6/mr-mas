// MR. MAS — outro D, "the curve": the chart, the thread, the plates, the anchored title, the post box, the dot, the
// moth and the UI band. Pure (no DOM): the Remotion scene and the Node preview both call it.
//
// d4 (polish after the cold read). WORLD COORDINATES ARE THE FINAL FRAME'S SCREEN COORDINATES (native 480x270).
// The camera never pans (in d3 the pan cut the title to "R. MAS" and the file to "eview.md"); it only cranes 20 px up
// during the leap (o105-153), so a world point sits 20 px higher on screen before the crane and exactly where the
// final frame has it after. The title block is anchored to the screen (the crane never moves it). Nothing is ever
// partly off screen: every plate pops fully inside the frame and stays put (bar the slow crane) to the out. d5: no
// plate folds (the fold machinery below is kept, unused, for a week that needs it).
//
// The final frame (o153-239): every credit, human first, and two matched windows at the top of the curve:
//   ┌MR. MAS──────────────────┐┌──────────────────┐  <- the empty post box, the caret blinking; the moth inside it
//   └ep1.0_research_preview.md┘│▮   (moth)         │
//                              │──────────────────│
//                              │ ▣ ≡ ◎      ○ Post │
//                    ┌AI tools─┐└──────────────────┘
//               ┌voices───────┐│  <- the thread runs up into the box, under the caret
//            ┌picture · music┐╱
//   ┌created by┐┌written───┐═╯ •  (the human credits, 1-BIT, held to the out)
//                       you are here
//   ══════════════ the band: terms + pointer ══════════════
//
// Draw order per frame (scene.ts): chart (master colours; d5: quiet below the 1K decade) -> the tier palette pass on
// the background (the capability ladder by HEIGHT: 1-BIT under the flat line's decade, EARLY-WEB 16 up the leap, BASE
// at the top) -> axis labels -> [o14-25 the grid develops; o<14 the stand-in dissolving; o<24 the lifted line]
// -> the thread (always in colour) -> the dot -> the plates -> the title -> the moth -> [the out] -> UI: the band + slug.
import {Buf, rect, TRANSPARENT} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {bayer4} from '../../../shared/pixel/dither';
import {ONEBIT, EARLYWEB16, PaletteSet} from '../../../shared/pixel/palettes';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP, LINE_H} from '../../../shared/pixel/font';
import {micro, microWidth} from '../../../shared/pixel/cast/bosses';
import {curveY} from '../../mfinale/skyline';
import {EpCfg, PlateDef, Tier, PLATES, TERMS, POINTER, SLUG, SHOW} from './text';
import {NOTES, EV, CRANE, craneAt, blinkOn, readFrames} from './timeline';

// ------------------------------------------------------------------ fixed geometry (world = the final frame)
export const BAND_Y = 240;
/** the chart's x axis (decades every 60 px above it, log minors between) */
export const AXIS_Y = 226;
export const DECADE = 60;
/** the flat line */
export const FLAT_Y = 206;
/** the eighth plate: the empty post box at the top of the curve (the cold open's composer, as a plate) */
export const BOX = {x: 300, y: 24, w: 124, h: 46};
/** the post box's caret (4x9, the cold open's): the last thing on screen */
export const CARET: [number, number] = [BOX.x + 8, BOX.y + 6];
/** the thread's last column: straight up into the box's bottom edge, under the caret */
export const TOP_X = CARET[0] + 1;
const LEAP_W = 64;
export const KNEE_X = TOP_X - LEAP_W;
/** the title block (anchored to the screen): right-aligned to TITLE_R, beside the box */
export const TITLE_R = BOX.x - 15;
export const TITLE_Y = 24;
const MARGIN = 4;

// ------------------------------------------------------------------ 1-bit / early-web inks
const INK = 0x0e0e10, PAPER = 0xe9e6da; // ONEBIT's two colours
const W16 = {k: 0x000000, navy: 0x000033, slate: 0x333366, steel: 0x336699, sky: 0x3399cc, cyan: 0x66ccff, ice: 0xccffff, lilac: 0x666699, grey: 0x999999};

/** EARLY-WEB 16 for the chart's night: the black stays black, the grid is navy (no GIF checker over the whole sky). */
const EW16_CHART: PaletteSet = EARLYWEB16.with({pin: [[PAL.N0, PAL.N0], [PAL.N2, W16.navy], [PAL.N3, W16.slate], [PAL.N4, W16.slate]]});
/** 1-BIT for the chart: the axis a 50% screen, the quiet grid's dots (QUIET, below) solid paper. d5: no other grid in
 *  the 1-bit rows (the cold read: "bright white dotted grid lines in the bottom band fight the chips") */
const QUIET = PAL.N4;
const ONEBIT_CHART: PaletteSet = ONEBIT.with({pin: [[PAL.N0, PAL.N0], [PAL.N2, PAL.N0], [PAL.N3, [PAL.N0, PAPER, 0.5]], [QUIET, PAPER]]});

// ------------------------------------------------------------------ the camera: a crane only
export interface View { cx: number; cy: number }
/** screen = world - (cx, cy): before the crane the world sits CRANE px higher on screen */
export const viewAt = (o: number): View => ({cx: 0, cy: CRANE - craneAt(o)});

// ------------------------------------------------------------------ plates
export interface PlateBox {
  n: number;
  def: PlateDef;
  tier: Tier;
  x: number; y: number; w: number; h: number;
  /** the frame it pops (its note; a beat early from Ep10) */
  pop: number;
  /** the frame it starts folding back into its line (none: it stays to the out) */
  fold?: number;
  /** the line under it (it rises out of it and folds back into it) */
  base: number;
}

// ------------------------------------------------------------------ the title face (local; the shared font is untouched)
/** THE SHOW NAME AT 28 px: the shared 14 px display face (Scale2x of the 7 px face) put through Scale2x again, so it
 *  stays stepped-smooth rather than blocky. d3's title had the weight of a filename tag; this is 4x the credits. */
export const HUGE_CAP = BIG_CAP * 2;
const HUGE = new Map<string, {w: number; m: Uint8Array}>();
const hugeMask = (s: string) => {
  const hit = HUGE.get(s);
  if (hit) return hit;
  const w0 = bigTextWidth(s), h0 = BIG_CAP;
  const tmp = new Buf(w0, h0, 0);
  bigText(tmp, s, 0, 0, 1);
  const at = (x: number, y: number) => x >= 0 && y >= 0 && x < w0 && y < h0 && tmp.c[y * w0 + x] === 1;
  const w = w0 * 2, m = new Uint8Array(w * h0 * 2);
  for (let y = 0; y < h0; y++)
    for (let x = 0; x < w0; x++) {
      const P = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      m[(2 * y) * w + 2 * x] = (C === A && C !== D && A !== B ? A : P) ? 1 : 0;
      m[(2 * y) * w + 2 * x + 1] = (A === B && A !== C && B !== D ? B : P) ? 1 : 0;
      m[(2 * y + 1) * w + 2 * x] = (D === C && D !== B && C !== A ? C : P) ? 1 : 0;
      m[(2 * y + 1) * w + 2 * x + 1] = (B === D && B !== A && D !== C ? D : P) ? 1 : 0;
    }
  const r = {w, m};
  HUGE.set(s, r);
  return r;
};
export const hugeTextWidth = (s: string) => hugeMask(s).w;
export const hugeText = (b: Buf, s: string, x: number, y: number, col: number) => {
  const {w, m} = hugeMask(s);
  for (let j = 0; j < HUGE_CAP; j++) for (let i = 0; i < w; i++) if (m[j * w + i]) b.set(x + i, y + j, col);
};

const textBlockW = (def: PlateDef) => Math.max(...def.lines.map(textWidth));
const textBlockH = (def: PlateDef) => 9 + (def.lines.length - 1) * LINE_H;
/** border 2 (outer + gutter / bevel), pad 3 left-right, 3 top, 1 bottom (the 7 px face's descenders sit in the block) */
const plateSize = (def: PlateDef): [number, number] =>
  def.kind === 'cursor' ? [BOX.w, BOX.h] : [textBlockW(def) + 10, textBlockH(def) + 4 + 3 + 1];

/** the tower-pop grammar, cut to 3 drawings with a 1 px overshoot: rising out of the line, 1 px high, settled */
export const popDy = (k: number, h: number) => (k < 0 ? null : k === 0 ? Math.ceil(h * 0.45) : k === 1 ? -1 : 0);
/** the fold, the pop reversed: 1 px up, half sunk into the line, gone */
export const foldDy = (j: number, h: number) => (j < 0 ? 0 : j === 0 ? -1 : j === 1 ? Math.ceil(h * 0.45) : null);
/** a plate's vertical offset at frame o (null = not on screen) */
export const plateDy = (p: {pop: number; fold?: number; h: number}, o: number) => {
  const d = popDy(o - p.pop, p.h);
  if (d === null) return null;
  if (p.fold !== undefined && o >= p.fold) return foldDy(o - p.fold, p.h);
  return d;
};
/** wholly drawn and not moving by itself (the crane aside) */
export const plateSettled = (p: {pop: number; fold?: number}, o: number) => o - p.pop >= 2 && (p.fold === undefined || o < p.fold);

// ------------------------------------------------------------------ the curve
/** rise (raw px) at d px past the knee: the intro skyline's own curveY, squeezed into LEAP_W (a hockey stick) */
const riseRaw = (d: number) => 130 - curveY(Math.max(0, Math.min(297, (d * 297) / LEAP_W)));
const RAW_TOP = riseRaw(LEAP_W);
/** inverse: the x offset past the knee where the raw curve reaches `r` (0..RAW_TOP) */
const riseInv = (r: number) => (LEAP_W / 297) * 45 * Math.log(r / 0.1435 + 1);
/** the curve's top: 3 px under the box, then a straight run up to its bottom edge */
const CURVE_TOP = BOX.y + BOX.h + 3;
const R = (FLAT_Y - CURVE_TOP) / RAW_TOP;
export const curveAt = (x: number) => FLAT_Y - Math.round(R * riseRaw(x - KNEE_X));
const xAtRise = (rise: number) => KNEE_X + riseInv(rise / R);

export interface Layout {
  cfg: EpCfg;
  plates: PlateBox[];
  /** the title block (screen): the plate rect, the show name and the file line */
  title: {x: number; y: number; w: number; h: number; pop: number; show: [number, number]; file: [number, number]; fileText: string};
  tier1Y: number;
  tier2Y: number;
  /** the thread as an ordered list of pixels [x, y, kind] (kind 0 flat, 1 rise, 2 into the box) */
  path: Array<[number, number, number]>;
  /** path index of each plate's note point (the pen reaches it on the note) */
  noteIdx: number[];
  kneeIdx: number;
  dot: [number, number] | null;
}

const LAYOUTS = new Map<number, Layout>();

export const layoutFor = (cfg: EpCfg): Layout => {
  const hit = LAYOUTS.get(cfg.ep);
  if (hit) return hit;
  const lead = cfg.machineLeads ? 15 : 0;
  const plates: PlateBox[] = [];
  // ---- the flat two (1-BIT floor): the human credits, on the line, side by side, held to the out (d5: no fold)
  const flatX = [20, 124];
  for (let n = 0; n < 2; n++) {
    const def = PLATES[n];
    const [w, h] = plateSize(def);
    plates.push({n, def, tier: cfg.tiers.flat, x: flatX[n], y: FLAT_Y - h, w, h, pop: NOTES[2 + n] - lead, base: FLAT_Y});
  }
  // ---- the leap three: stacked up the rise, each right edge hugging the curve at its own bottom row
  let bot = FLAT_Y - 24;
  for (let n = 2; n < 5; n++) {
    const def = PLATES[n];
    const [w, h] = plateSize(def);
    const xr = Math.floor(xAtRise(FLAT_Y - bot)) - 3;
    plates.push({n, def, tier: cfg.tiers.leap, x: xr - w + 1, y: bot - h + 1, w, h, pop: NOTES[2 + n] - lead, base: bot + 1});
    bot = bot - h - 5;
  }
  // ---- the eighth plate: the post box, rising out of the thread's end
  plates.push({n: 5, def: PLATES[5], tier: cfg.tiers.top, x: BOX.x, y: BOX.y, w: BOX.w, h: BOX.h, pop: NOTES[7] - lead, base: BOX.y + BOX.h});

  // ---- the title block (screen-anchored), right-aligned beside the box
  const sw = hugeTextWidth(SHOW), fw = textWidth(cfg.file), bw = Math.max(sw, fw);
  const show: [number, number] = [TITLE_R - sw + 1, TITLE_Y];
  const file: [number, number] = [TITLE_R - fw + 1, TITLE_Y + HUGE_CAP + 6];
  const title = {x: TITLE_R - bw - 5, y: TITLE_Y - 6, w: bw + 12, h: HUGE_CAP + 6 + 9 + 12, pop: NOTES[1] - lead, show, file, fileText: cfg.file};

  // ---- the thread: flat to the knee, the rise (vertical runs filled), then straight up into the box
  const path: Array<[number, number, number]> = [];
  for (let x = 0; x < KNEE_X; x++) path.push([x, FLAT_Y, 0]);
  let py = FLAT_Y;
  for (let x = KNEE_X; x <= TOP_X; x++) {
    const y = curveAt(x);
    for (let yy = py; yy >= y; yy--) path.push([x, yy, 1]);
    py = y;
  }
  for (let yy = py - 1; yy >= BOX.y + BOX.h; yy--) path.push([TOP_X, yy, 2]);
  const idxOf = (x: number, y: number) => {
    let best = 0, bd = Infinity;
    path.forEach(([px, pyy], i) => { const d = Math.abs(px - x) + Math.abs(pyy - y); if (d < bd) { bd = d; best = i; } });
    return best;
  };
  const noteIdx = plates.map((p) => (p.n < 2 ? idxOf(p.x + p.w, FLAT_Y) : p.n < 5 ? idxOf(p.x + p.w + 3, p.y + p.h - 1) : path.length - 1));
  let dot: [number, number] | null = null;
  if (cfg.dot !== 'up') {
    const dx = Math.round(KNEE_X + cfg.dot * LEAP_W);
    dot = [dx, curveAt(dx)];
  }
  const tier2Y = Math.round((plates[4].y + BOX.y + BOX.h) / 2);
  const L: Layout = {cfg, plates, title, tier1Y: AXIS_Y - DECADE, tier2Y, path, noteIdx, kneeIdx: KNEE_X, dot};
  LAYOUTS.set(cfg.ep, L);
  return L;
};

// ------------------------------------------------------------------ the pen (how far the thread has drawn)
/** Ep1: the flat line is whole once it has lifted off the desk; the pen waits at the knee, leaves it on 2.3 and
 *  reaches each leap plate's corner on its note and the box on the last F. Ep10: drawn to the top from the start. */
export const penIdx = (L: Layout, o: number) => {
  if (L.cfg.machineLeads) return L.path.length - 1;
  if (o < EV.climb) return L.kneeIdx;
  const keys: Array<[number, number]> = [[EV.climb, L.kneeIdx], [NOTES[4], L.noteIdx[2]], [NOTES[5], L.noteIdx[3]], [NOTES[6], L.noteIdx[4]], [NOTES[7], L.path.length - 1]];
  for (let i = 0; i + 1 < keys.length; i++) {
    const [o0, i0] = keys[i], [o1, i1] = keys[i + 1];
    if (o <= o1) return Math.round(i0 + ((i1 - i0) * Math.max(0, o - o0)) / Math.max(1, o1 - o0));
  }
  return L.path.length - 1;
};
/** Ep1: the dotted future is the monitor's rise, broken into dots as it arrives (the morph, o12-23); from o24 it
 *  stays until the pen covers it */
export const futureReach = (L: Layout, o: number) => (o <= EV.morph[1] ? -1 : L.path.length - 1);

// ------------------------------------------------------------------ background: the chart
/** the cold open's chart, as a world: decade lines, dotted log minors, dotted verticals, the axis.
 *  d5: from world row `quiet` down (the flat line's decade, where the human credits, `you are here` and the years sit)
 *  the grid is only the decade line as one dot every 8 px: no minors, no verticals */
export const drawChart = (fb: Buf, v: View, quiet = Infinity) => {
  for (let sy = 0; sy < fb.h; sy++) {
    const wy = sy + v.cy;
    const dRow = ((AXIS_Y - wy) % DECADE + DECADE) % DECADE;
    const isDecade = dRow === 0 && wy <= AXIS_Y;
    let isMinor = false;
    if (!isDecade && wy < AXIS_Y) for (let k = 2; k <= 9; k++) if (Math.round(DECADE * Math.log10(k)) === dRow) isMinor = true;
    const q = wy >= quiet;
    for (let sx = 0; sx < fb.w; sx++) {
      const wx = sx + v.cx;
      let c = PAL.N0;
      if (wy === AXIS_Y) c = PAL.N3;
      else if (wy > AXIS_Y) c = PAL.N0;
      else if (q) c = isDecade && (((wx % 8) + 8) % 8) === 4 ? QUIET : PAL.N0;
      else if (isDecade) c = PAL.N2;
      else if (isMinor && ((wx + (wy & 1)) & 3) === 0) c = PAL.N2;
      else if (((wx % 40) + 40) % 40 === 20 && (wy & 1) === 0) c = PAL.N2;
      fb.c[sy * fb.w + sx] = c;
    }
  }
};

/** Which rung of the ladder a world height belongs to. */
export const tierAt = (L: Layout, wy: number): Tier => (wy >= L.tier1Y ? L.cfg.tiers.flat : wy >= L.tier2Y ? L.cfg.tiers.leap : L.cfg.tiers.top);

/** The ladder pass on the background: ordered dither in WORLD coordinates, so the pattern travels with the chart. */
export const tierPass = (fb: Buf, L: Layout, v: View) => {
  for (let sy = 0; sy < fb.h; sy++) {
    const wy = sy + v.cy;
    const t = tierAt(L, wy);
    const set = t === 'onebit' ? ONEBIT_CHART : t === 'web16' ? EW16_CHART : null;
    if (!set) continue;
    for (let sx = 0; sx < fb.w; sx++) fb.c[sy * fb.w + sx] = set.map(fb.c[sy * fb.w + sx], sx + v.cx, wy);
  }
};

/** a solid ink for small type on the chart, per rung (type never dithers) */
const labelInk = (t: Tier) => (t === 'onebit' ? PAPER : t === 'web16' ? W16.lilac : PAL.N5);

/** micro digits with a drawn apostrophe (the shared 3x5 face has none) */
const microYear = (fb: Buf, t: string, x: number, y: number, col: number) => {
  if (t[0] !== "'") { micro(fb, t, x, y, col); return; }
  fb.set(x, y, col); fb.set(x, y + 1, col);
  micro(fb, t.slice(1), x + 2, y, col);
};
/** the cold open's eggs, spread to this chart: the knee lands late in '23 */
export const YEARS: Array<[string, number]> = [["'93", 20], ["'08", 96], ["'15", 164], ["'22", 232]];
/** axis eggs: years under the x axis, decade labels on a y axis pinned to the frame's left edge */
export const drawAxes = (fb: Buf, L: Layout, v: View) => {
  for (const [t, x] of YEARS) {
    const sx = x - v.cx, sy = AXIS_Y - v.cy;
    const ink = labelInk(tierAt(L, AXIS_Y));
    for (let j = 0; j < 3; j++) fb.set(sx, sy - 1 - j, ink);
    microYear(fb, t, sx - Math.floor((microWidth(t.slice(1)) + 2) / 2), sy + 3, ink);
  }
  const labels = ['1K', '1M', '1B', '1T'];
  for (let sy = 0; sy < Math.min(fb.h, AXIS_Y - v.cy + 1); sy++) {
    const wy = sy + v.cy;
    if ((wy & 1) === 0) fb.set(12, sy, labelInk(tierAt(L, wy)));
  }
  labels.forEach((t, i) => {
    const wy = AXIS_Y - (i + 1) * DECADE;
    const sy = wy - v.cy;
    if (sy < 16 || sy > fb.h) return; // clear of the lookdev slug
    const ink = labelInk(tierAt(L, wy));
    fb.set(13, sy, ink); fb.set(14, sy, ink);
    micro(fb, t, 2, sy - 6, ink);
  });
};

// ------------------------------------------------------------------ the thread
const THREAD = [
  {core: PAL.C5, glow: PAL.C1, halo: PAL.C0, fut: PAL.C2}, // flat
  {core: PAL.C6, glow: PAL.C2, halo: PAL.C1, fut: PAL.C3}, // rise
  {core: PAL.C7, glow: PAL.C3, halo: PAL.C1, fut: PAL.C3}, // into the box
];
/** Draw the thread up to path index `upto` (solid), then the dotted future up to `future` (Ep1).
 *  `lift` shifts the flat part down (the thread peeling up off the last frame's desk edge); `reach` limits x. */
export const drawThread = (fb: Buf, L: Layout, v: View, upto: number, o: {future?: number; lift?: number; reach?: number; tip?: boolean} = {}) => {
  const lift = o.lift ?? 0;
  const reach = o.reach ?? Infinity;
  const fut = o.future ?? -1;
  const horiz = (i: number) => {
    const [x, y] = L.path[i];
    const p = L.path[i - 1], n = L.path[i + 1];
    return (p !== undefined && p[1] === y && p[0] !== x) || (n !== undefined && n[1] === y && n[0] !== x);
  };
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < L.path.length; i++) {
      const [x, y0, k] = L.path[i];
      if (x > reach) break;
      const y = k === 0 ? y0 + lift : y0;
      const sx = x - v.cx, sy = y - v.cy;
      if (sx < -2 || sx > fb.w + 1 || sy < -2 || sy > fb.h + 1) continue;
      const s = THREAD[k];
      if (i <= upto) {
        if (pass === 1) { fb.set(sx, sy, s.core); continue; }
        if (k === 0 || horiz(i)) { fb.set(sx, sy + 1, s.glow); if ((x & 1) === 0) fb.set(sx, sy - 1, s.halo); }
        else { fb.set(sx + 1, sy, s.glow); if ((y & 1) === 0) fb.set(sx - 1, sy, s.halo); }
      } else if (pass === 1 && i <= fut && (i - upto) % 3 === 0) fb.set(sx, sy, s.fut);
    }
  }
  if (o.tip && upto >= 0 && upto < L.path.length - 1) {
    const [x, y0, k] = L.path[upto];
    const y = k === 0 ? y0 + lift : y0;
    fb.set(x - v.cx, y - v.cy, PAL.C9);
    fb.set(x - v.cx + 1, y - v.cy, PAL.C7);
  }
};

// ------------------------------------------------------------------ the dot
/** "you are here", the cold open's dot: 3x3, a halo that blinks on the beat; `you are ↑` (off the top) from Ep10 */
export const drawDot = (fb: Buf, L: Layout, v: View, o: number) => {
  if (L.dot) {
    const [x, y] = [L.dot[0] - v.cx, L.dot[1] - v.cy];
    if (blinkOn(o)) for (const [i, j] of [[-2, 0], [2, 0], [0, -2], [0, 2], [-1, -1], [1, -1], [-1, 1], [1, 1]]) fb.set(x + i, y + j, PAL.C3);
    rect(x - 1, y - 1, 3, 3, fb.ink(PAL.C7));
    fb.set(x, y, PAL.C9);
    const label = 'you are here';
    const lw = textWidth(label);
    // near the knee: under the flat line, right-aligned to the dot (the cold open's layout); high on the rise: to
    // its right (the side of the curve no plate uses)
    // (on a cleared strip, so the chart's dotted verticals never read as punctuation inside it)
    const [lx, ly] = L.dot[1] > FLAT_Y - 12 ? [x - lw + 1, FLAT_Y + 5 - v.cy] : [x + 6, y - 3];
    rect(lx - 1, ly - 1, lw + 2, 11, fb.ink(PAL.N0));
    text(fb, label, lx, ly, PAL.C5);
  } else {
    // off the top: an arrow at the frame's top edge over the thread's column, `you are` left of it
    const x = TOP_X - v.cx;
    const y = 3;
    for (let j = 0; j < 7; j++) fb.set(x, y + j, PAL.C7);
    for (let k = 1; k <= 3; k++) { fb.set(x - k, y + k, PAL.C7); fb.set(x + k, y + k, PAL.C7); }
    const aw = textWidth('you are');
    text(fb, 'you are', x - 6 - aw, y, PAL.C5);
  }
};

// ------------------------------------------------------------------ the post box (the eighth plate)
/** the inner rect a machine render replaces (Ep7 / Ep10): the text field */
export const boxField = (x: number, y: number): [number, number, number, number] => [x + 2, y + 2, BOX.w - 4, 26];
/** the cold open's caret, 4x9 */
export const drawCaret = (fb: Buf, x: number, y: number) => rect(x, y, 4, 9, fb.ink(PAL.C6));

/** The cold open's composer, as the eighth plate: an empty field and its caret, a divider, the tool row, the empty
 *  counter ring and a greyed Post (nothing to post). Original chrome: no real app's UI. */
const drawBox = (fb: Buf, x: number, y: number, o: number, tier: Tier) => {
  const {w, h} = BOX;
  rect(x + 2, y + 2, w, h, fb.ink(PAL.N0)); // the drop shadow hides the grid under it
  rect(x, y, w, h, fb.ink(PAL.N5)); // keyline
  rect(x + 1, y + 1, w - 2, h - 2, fb.ink(PAL.N1)); // face
  for (const [cx, cy] of [[x, y], [x + w - 1, y], [x, y + h - 1], [x + w - 1, y + h - 1]]) fb.set(cx, cy, PAL.N0);
  if (tier !== 'machine' && blinkOn(o)) drawCaret(fb, CARET[0] - BOX.x + x, CARET[1] - BOX.y + y);
  // divider + tool row
  for (let i = x + 8; i < x + w - 5; i++) fb.set(i, y + 30, PAL.N3);
  const iy = y + 35, tx = x + 8, ic = PAL.C3;
  rect(tx, iy, 6, 5, fb.ink(ic)); rect(tx + 1, iy + 1, 4, 3, fb.ink(PAL.N1)); fb.set(tx + 2, iy + 3, ic); fb.set(tx + 3, iy + 2, ic);
  for (let k = 0; k < 3; k++) rect(tx + 10, iy + k * 2, k === 1 ? 4 : 6, 1, fb.ink(ic));
  for (const [i, j] of [[1, 0], [2, 0], [3, 0], [0, 1], [4, 1], [0, 2], [4, 2], [0, 3], [4, 3], [1, 4], [2, 4], [3, 4]]) fb.set(tx + 20 + i, iy + j, ic);
  // the counter ring (empty) and Post, greyed: the box is empty
  const bx = x + w - 30, by = y + 33;
  for (let a = 0; a < 16; a++) {
    const th = (a / 16) * Math.PI * 2;
    fb.set(Math.round(bx - 7 + Math.cos(th) * 3.4), Math.round(by + 5 + Math.sin(th) * 3.4), PAL.N4);
  }
  rect(bx, by, 24, 10, fb.ink(PAL.N3));
  for (const [cx, cy] of [[bx, by], [bx + 23, by], [bx, by + 9], [bx + 23, by + 9]]) fb.set(cx, cy, PAL.N1);
  text(fb, 'Post', bx + Math.floor((24 - textWidth('Post')) / 2), by + 2, PAL.N6);
};

// ------------------------------------------------------------------ plate drawing, per rung
const drawPlateBody = (fb: Buf, p: PlateBox, x: number, y: number, o: number) => {
  const {w, h, def} = p;
  if (def.kind === 'cursor') { drawBox(fb, x, y, o, p.tier); return; }
  const tx = x + 5, ty = y + 5;
  const [bodyCol, labelCol] = plateSurface(fb, p.tier, x, y, w, h);
  def.lines.forEach((ln, i) => text(fb, ln, tx, ty + i * LINE_H, def.lines.length > 1 && i === 0 ? labelCol : bodyCol));
};

/** paint a plate's surface in its rung's idiom; returns [body ink, label ink] */
const plateSurface = (fb: Buf, tier: Tier, x: number, y: number, w: number, h: number): [number, number] => {
  if (tier === 'onebit') {
    // 1993: paper, a black gutter, paper again (the double frame of a system window); black type
    rect(x, y, w, h, fb.ink(PAPER));
    rect(x + 1, y + 1, w - 2, h - 2, fb.ink(INK));
    rect(x + 2, y + 2, w - 4, h - 4, fb.ink(PAPER));
    return [INK, INK];
  }
  if (tier === 'web16') {
    // 2008-14: a bevelled web box, a GIF-era 50% checker drop shadow, cyan-on-slate type
    for (let j = 2; j < h + 2; j++) for (let i = 2; i < w + 2; i++) if ((i >= w || j >= h) && ((x + i + y + j) & 1) === 0) fb.set(x + i, y + j, W16.navy);
    rect(x, y, w, h, fb.ink(W16.k));
    rect(x + 1, y + 1, w - 2, h - 2, fb.ink(W16.slate));
    rect(x + 1, y + 1, w - 2, 1, fb.ink(W16.lilac));
    rect(x + 1, y + 1, 1, h - 2, fb.ink(W16.lilac));
    rect(x + 1, y + h - 2, w - 2, 1, fb.ink(W16.navy));
    rect(x + w - 2, y + 1, 1, h - 2, fb.ink(W16.navy));
    return [W16.ice, W16.cyan];
  }
  // the show's own bevelled window (BASE)
  rect(x, y, w, h, fb.ink(PAL.N0));
  rect(x + 1, y + 1, w - 2, 1, fb.ink(PAL.N6));
  rect(x + 1, y + 1, 1, h - 2, fb.ink(PAL.N6));
  rect(x + 1, y + h - 2, w - 2, 1, fb.ink(PAL.N3));
  rect(x + w - 2, y + 1, 1, h - 2, fb.ink(PAL.N3));
  rect(x + 2, y + 2, w - 4, h - 4, fb.ink(PAL.N1));
  return [PAL.P1, PAL.C5];
};

/** draw `paint` into a scratch layer and copy only the rows above `clipY` (a plate rising out of / sinking into its line) */
const clipped = (fb: Buf, clipY: number, paint: (b: Buf) => void) => {
  const tmp = new Buf(fb.w, fb.h, TRANSPARENT);
  paint(tmp);
  for (let j = 0; j < Math.min(fb.h, clipY); j++) for (let i = 0; i < fb.w; i++) { const c = tmp.c[j * fb.w + i]; if (c !== TRANSPARENT) fb.c[j * fb.w + i] = c; }
};

/** Draw plate p at frame o (pop and fold included). */
export const drawPlate = (fb: Buf, p: PlateBox, v: View, o: number) => {
  const dy = plateDy(p, o);
  if (dy === null) return;
  const x = p.x - v.cx, y = p.y - v.cy + dy;
  if (dy !== 0) { clipped(fb, p.base - v.cy, (b) => drawPlateBody(b, p, x, y, o)); return; }
  drawPlateBody(fb, p, x, y, o);
};

/** the post box's text field on screen (for the machine-render overlay), or null before it has settled */
export const windowScreenRect = (L: Layout, v: View, o: number): [number, number, number, number] | null => {
  const p = L.plates[5];
  if (plateDy(p, o) !== 0) return null;
  return boxField(p.x - v.cx, p.y - v.cy);
};

// ------------------------------------------------------------------ the title (anchored to the screen)
/** which rung the title is drawn in at frame o. d5: ONE step, on the last F, when the post box arrives: the episode's
 *  floor (Ep1: a 1-BIT paper plate) -> the show's own window. d4 stepped twice (1-BIT > EARLY-WEB16 > bare type) and the
 *  cold read took the restyles for indecision, the last one (no plate) for the least finished. */
export const titleTier = (L: Layout, o: number): Tier => {
  const lead = L.cfg.machineLeads ? 15 : 0;
  if (o < EV.upgrade - lead) return L.cfg.tiers.flat;
  return 'base';
};

/** the title's top look: the post box's own chrome (drop shadow, N5 keyline, N1 face, soft corners), so the final
 *  frame's two windows read as one app; MR. MAS in paper with a P0 bevel on its lower-right edge, the file in cyan */
const titleWindow = (b: Buf, T: Layout['title'], dy: number) => {
  const {x, w, h} = T, y = T.y + dy;
  rect(x + 2, y + 2, w, h, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.N5));
  rect(x + 1, y + 1, w - 2, h - 2, b.ink(PAL.N1));
  for (const [cx, cy] of [[x, y], [x + w - 1, y], [x, y + h - 1], [x + w - 1, y + h - 1]]) b.set(cx, cy, PAL.N0);
  hugeText(b, SHOW, T.show[0] + 1, T.show[1] + dy + 1, PAL.P0);
  hugeText(b, SHOW, T.show[0], T.show[1] + dy, PAL.P1);
  text(b, T.fileText, T.file[0], T.file[1] + dy, PAL.C5);
};

/**
 * The show name and the file, one block, never moving: MR. MAS in the 28 px face, the file under it, right-aligned
 * beside the post box. Its surface is the episode's floor until the last F, then it upgrades once to the show's own
 * window, as an interlaced develop over 3 frames (every 4th row, every 2nd, all: a picture loading in, the ladder's
 * gesture), in step with the post box rising beside it.
 */
export const drawTitle = (fb: Buf, L: Layout, o: number) => {
  const T = L.title;
  const k = o - T.pop;
  const dy = popDy(k, T.h);
  if (dy === null) return;
  const lead = L.cfg.machineLeads ? 15 : 0;
  const paintTier = (b: Buf, tier: Tier) => {
    if (tier === 'base' || tier === 'machine') { titleWindow(b, T, dy); return; }
    let [ink, sub] = plateSurface(b, tier, T.x, T.y + dy, T.w, T.h);
    if (tier === 'onebit') sub = INK;
    hugeText(b, SHOW, T.show[0], T.show[1] + dy, ink);
    text(b, T.fileText, T.file[0], T.file[1] + dy, sub);
  };
  const tier = titleTier(L, o);
  const j = o - (EV.upgrade - lead);
  if (tier === 'base' && L.cfg.tiers.flat !== 'base' && j >= 0 && j < 2) {
    // the develop: the old plate, with the new look's rows coming in (every 4th, then every 2nd)
    paintTier(fb, L.cfg.tiers.flat);
    const nb = new Buf(fb.w, fb.h, TRANSPARENT);
    paintTier(nb, 'base');
    const step = j === 0 ? 4 : 2;
    for (let yy = Math.max(0, T.y - 2); yy < Math.min(fb.h, T.y + T.h + 4); yy++) {
      if ((yy - T.y) % step !== 0) continue;
      for (let xx = Math.max(0, T.x - 2); xx < Math.min(fb.w, T.x + T.w + 4); xx++) {
        const c = nb.c[yy * fb.w + xx];
        if (c !== TRANSPARENT) fb.c[yy * fb.w + xx] = c;
      }
    }
    return;
  }
  if (k <= 1) clipped(fb, T.y + T.h, (b) => paintTier(b, tier));
  else paintTier(fb, tier);
};

// ------------------------------------------------------------------ the moth (Ep1 stinger: it goes to the light)
/**
 * THE PLAN's moth (Ep1 act 3: "a tiny moth drawn in blueprint linework" flies out of the empty EQUITY box), so it is
 * blueprint cyan. d5: the cold read took d4's 11x7 moth for "a speck ... a glitch or dust" at 480x270, so it is now a
 * moth first: 19x14 native (76x56 at 1080p), bright linework forewings over a dark-teal fill with an eyespot, dimmer
 * hindwings, a hot thorax, feathered antennae; its wings beat on 1s (spread, half, up, half) in flight. Drawn from
 * the left half + the body column, mirrored, so every drawing stays symmetric.
 *   o  forewing line  f  forewing fill  v  eyespot   h  hindwing line  g  hindwing fill   a  antenna  b B  body
 */
const MOTH_HALF: Array<[string, string]> = [
  ['.....a...', '.'],
  ['......a..', '.'],
  ['.......a.', '.'],
  ['........b', 'B'],
  ['....oooob', 'B'],
  ['..ooffffb', 'B'],
  ['ooffvfffb', 'B'],
  ['offvvfffb', 'B'],
  ['.offffffb', 'B'],
  ['..oooffob', 'B'],
  ['....hoohb', 'B'],
  ['...hgggh.', 'b'],
  ['..hgggh..', 'b'],
  ['...hhh...', 'b'],
];
const MOTH_ROWS = MOTH_HALF.map(([l, c]) => l + c + l.split('').reverse().join(''));
export const MOTH_W = MOTH_ROWS[0].length; // 19
export const MOTH_H = MOTH_ROWS.length; // 14
const MOTH_INK: Record<string, number> = {o: PAL.C7, f: PAL.C2, v: PAL.C5, h: PAL.C5, g: PAL.C1, a: PAL.C6, b: PAL.C6, B: PAL.C8};
const WING = new Set(['o', 'f', 'v', 'h', 'g']);
/** one drawing: the wings squashed toward the body by `s` (1 spread, 0.6 half, 0.25 up), the body and antennae kept */
const drawMothAt = (b: Buf, cx: number, cy: number, s: number) => {
  const half = (MOTH_W - 1) / 2;
  const x0 = cx - half, y0 = cy - Math.floor(MOTH_H / 2);
  MOTH_ROWS.forEach((r, j) => {
    for (let i = -half; i <= half; i++) {
      const own = r[i + half];
      let ch = own !== '.' && !WING.has(own) ? own : '.';
      if (ch === '.') {
        const si = Math.round(i / s);
        if (Math.abs(si) <= half) { const w = r[si + half]; if (WING.has(w)) ch = w; }
      }
      if (ch !== '.') b.set(x0 + i + half, y0 + j, MOTH_INK[ch]);
    }
  });
};
const BEAT_S = [1, 0.7, 0.35, 0.7];

/** its rest: inside the empty post box's text field, just right of the caret (the light), clear of it by 17 px: the
 *  empty box holds nothing but a moth (the EQUITY box callback). At rest its wings are always spread (the drawing
 *  that reads as a moth); the half and up drawings exist only in motion, a frame each */
export const MOTH_REST: [number, number] = [CARET[0] + 30, BOX.y + 17];
export const MOTH_IN = NOTES[7] + 3; // o153: after the post box (the light) is up, never before it
export const MOTH_LAND = 180; // 4.1, with the harp F5
/** at rest it lifts its wings twice (half, up, half; one frame each), the equity-box moth "opens its wings" */
const TWITCH: Record<number, number> = {206: 0.7, 207: 0.35, 208: 0.7, 227: 0.7, 228: 0.35, 229: 0.7};

export interface MothState { x: number; y: number; s: number }
/**
 * Ep1's stinger. It comes in from the right once the post box is up (o153), climbs the dark right side that no plate
 * uses, crosses over the box's top edge, flutters into the light, bumps at it once (never over the caret) and settles
 * in the field on 4.1 (o180); it stays until the out takes it. Centre, screen px (the crane is over by o153). The
 * path keeps x >= 317 (the title ends at 291) and never touches a letter (measured by the preview's audit).
 */
const FLIGHT: Array<[number, number, number]> = [
  [153, 494, 44], [156, 474, 36], [159, 452, 22], [162, 428, 12], [165, 400, 10], [168, 372, 14], [170, 352, 22],
  [172, 336, 32], [174, 327, 42], [176, 341, 30], [178, 335, 38], [180, MOTH_REST[0], MOTH_REST[1]],
];
export const mothAt = (L: Layout, o: number): MothState | null => {
  if (L.cfg.stinger !== 'moth' || o < FLIGHT[0][0] || o >= EV.out + 12) return null;
  if (o >= MOTH_LAND) return {x: MOTH_REST[0], y: MOTH_REST[1], s: TWITCH[o] ?? 1};
  let i = 0;
  while (i + 1 < FLIGHT.length && FLIGHT[i + 1][0] <= o) i++;
  const [o0, x0, y0] = FLIGHT[i], [o1, x1, y1] = FLIGHT[Math.min(FLIGHT.length - 1, i + 1)];
  const t = o1 === o0 ? 0 : (o - o0) / (o1 - o0);
  return {x: Math.round(x0 + (x1 - x0) * t), y: Math.round(y0 + (y1 - y0) * t), s: BEAT_S[(o - MOTH_IN) & 3]};
};
export const drawMoth = (fb: Buf, m: MothState | null) => {
  if (m) drawMothAt(fb, m.x, m.y, m.s);
};
/** the moth's bounding box on screen, 1 px margin (for the QA: it must never cover a letter) */
export const mothRect = (m: MothState | null): [number, number, number, number] | null => {
  if (!m) return null;
  const half = (MOTH_W - 1) / 2;
  return [m.x - half - 1, m.y - Math.floor(MOTH_H / 2) - 1, MOTH_W + 2, MOTH_H + 2];
};

// ------------------------------------------------------------------ UI: the band + the slug (never palette-mapped)
export const termsX = () => Math.floor((480 - textWidth(TERMS)) / 2);
export const TERMS_Y = BAND_Y + 6;
export const POINTER_Y = BAND_Y + 17;
/** the band steps up in 3 frames at o18 and stays, unmoving, until the out; d5: it goes out WITH the frame, in the
 *  same 4 dithered steps (o240, 243, 246, 249), not on a hard cut under a dissolving picture */
export const drawBand = (ui: Buf, o: number) => {
  if (o < EV.band) return;
  const s = o < EV.out ? 0 : Math.min(4, 1 + Math.floor((o - EV.out) / 3));
  if (s >= 4) return;
  const k = o - EV.band;
  rect(0, BAND_Y, 480, 270 - BAND_Y, ui.ink(PAL.N0));
  rect(0, BAND_Y, 480, 1, ui.ink(k === 0 ? PAL.N2 : PAL.N3));
  if (k < 1) return;
  text(ui, TERMS, termsX(), TERMS_Y, k === 1 ? PAL.P0 : PAL.P1);
  const pw = textWidth(POINTER);
  text(ui, POINTER, Math.floor((480 - pw) / 2), POINTER_Y, k === 1 ? PAL.N5 : PAL.G5);
  if (s > 0)
    for (let y = BAND_Y; y < 270; y++)
      for (let x = 0; x < 480; x++) {
        const i = y * 480 + x;
        ui.c[i] = bayer4(x, y) < s / 4 ? PAL.N0 : stepColor(ui.c[i], -s);
      }
};

/** a lookdev tag, bottom-left over the stand-in (never on the outro itself) */
export const drawTag = (ui: Buf, t: string) => {
  const w = textWidth(t);
  rect(4, 270 - 16, w + 6, 12, ui.ink(PAL.N0));
  rect(4, 270 - 16, 1, 12, ui.ink(PAL.R1));
  text(ui, t, 7, 270 - 14, PAL.G5);
};

/** top-LEFT, clear of the pinned y axis */
export const SLUG_X = 22;
export const drawSlug = (ui: Buf) => {
  const w = textWidth(SLUG);
  const x = SLUG_X, y = 4;
  rect(x - 3, y - 2, w + 6, 11, ui.ink(PAL.N0));
  rect(x - 3, y - 2, w + 6, 1, ui.ink(PAL.R1));
  text(ui, SLUG, x, y, PAL.G5); // G5 on N0: 6.6:1
};

// ------------------------------------------------------------------ read-time audit (preview tool + notes)
/** For each plate and the title: frames wholly on screen and settled (inside the frame, above the band, not popping
 *  or folding) before the out, vs its need; and frames it is on screen but NOT whole (a crop): must be 0. */
export const readAudit = (L: Layout) => {
  const rows = L.plates.filter((p) => p.def.kind !== 'cursor').map((p) => {
    let vis = 0, crop = 0;
    for (let o = 0; o < EV.out; o++) {
      const dy = plateDy(p, o);
      if (dy === null) continue;
      const v = viewAt(o);
      const x0 = p.x - v.cx, x1 = p.x + p.w - 1 - v.cx, y0 = p.y - v.cy + dy, y1 = p.y + p.h - 1 - v.cy + dy;
      const inside = x0 >= MARGIN && x1 < 480 - MARGIN && y0 >= 0 && y1 < BAND_Y;
      if (!inside) crop++;
      else if (plateSettled(p, o)) vis++;
    }
    const chars = p.def.lines.join(' ').length;
    return {n: p.n, text: p.def.lines.join(' / '), chars, need: readFrames(chars), vis, crop};
  });
  const T = L.title;
  let tv = 0;
  for (let o = 0; o < EV.out; o++) if (o - T.pop >= 2) tv++;
  rows.unshift({n: -1, text: `${SHOW} / ${T.fileText}`, chars: SHOW.length + 1 + T.fileText.length, need: 60, vis: tv, crop: 0});
  return rows;
};
