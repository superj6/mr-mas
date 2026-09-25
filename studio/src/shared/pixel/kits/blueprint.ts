// MR. MAS — shared kit: THE PLAN BLUEPRINT (show-wide; first used in Ep1 sc 25 "THE PLAN").
//
// The show's explainer register: cyan #7FDBFF on navy #0B1E3F, on a drafting grid. Everything explained on a PLAN
// is accurate; the plan failing is the joke (guardrails §4). Linework DRAWS ITSELF ON in whole-pixel strokes (a
// Bresenham path revealed n pixels at a time, a hot pen tip at the head), labels type on in blueprint lettering,
// stamps land with a 1 px kick and worn-rubber breakup. Nothing is scaled, rotated or tweened.
//
// HOW THE COLOURS WORK (read this first)
//   The blueprint's two inks are not master-palette colours, so the kit works like every other style set: you draw
//   the sheet in PROXY master colours (`BPX.*`), and the `BLUEPRINT` palette set pins each proxy to its exact output
//   colour (`BP.*`). Any other colour that lands on the sheet (a traced room, a cast sprite) tone-maps onto the same
//   navy -> cyan ramp, with skin solid (dither discipline).
//     draw into a sheet Buf with BPX.*  ->  bpComposite(fb, sheet, {oy, behind, curl, tear})  (final colours)
//   or, for a plain full-frame blueprint:  <PixelScene palette={BLUEPRINT} ... />.
//
// PARTS
//   sheet      bpSheet (paper + drafting grid + border + zone letters), bpTitleBlock
//   draw-on    Pt paths (linePts, polyPts, rectPts, ellipsePts, loopPts), inkPath (n px of a path, pen tip),
//              drawOn (px revealed at frame f), bpText (types on), bpLeader, bpBox, bpArrow, bpBanner, bpDim
//   stamps     bpStamp (boxed, 7 px or 14 px lettering, lands with a kick), bpCheck (the tick box)
//   figures    bpChair (sit / stand / walk A / walk B; bolts, sticker), bpWalker (door / paper / spinner / square),
//              bpMoth (3 drawings), bpKeyRing, bpFence, bpSpinner
//   the break  bpChalk (a stroke that squeaks and snaps), bpCurl + bpTear via bpComposite (the paper peels and
//              tears to reveal the BASE frame behind: the plan failing, diegetically)
//   the entry  traceBlueprint (a BASE frame as blueprint linework) + bpFront (the render front into it)
import {Buf, rect, hash, clamp} from '../px';
import {PAL, SKIN_COLORS, lightness, stepColor} from '../palette';
import {compilePalette, PaletteSet, applyPalette} from '../palettes';
import {bayer4, bayer8, cluster4} from '../dither';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from '../font';
import {Mask} from '../mask';
import {renderFront, frontPos, Dir} from '../transitions';
import {micro, microWidth} from '../cast/bosses';
import {spinnerDots} from './callgrid';

// ================================================================== colours
/** Output colours (what the viewer sees). NAVY and LINE are the guardrails' spec; the rest are its own ramp. */
export const BP = {
  shade: 0x061430, // under the curl, the QUIET VOTE's square, cast shadows
  navy: 0x0b1e3f, // the paper (spec)
  minor: 0x0f2750, // minor grid
  major: 0x173869, // major grid, border ticks
  faint: 0x2b6499, // construction lines, hatching, dim lettering
  mid: 0x4f9fcf, // secondary linework, pen trail
  line: 0x7fdbff, // the ink (spec)
  hot: 0xe2f8ff, // pen tip, chalk, stamps (<= 80% white on any pop: broadcast safety)
  back: 0xb4d2e6, // the back of the sheet (curl, torn fibres)
  backShade: 0x7fa6c2,
} as const;
export type BPInk = keyof typeof BP;
/** Proxies: the master colours you DRAW the sheet with. Each pins to BP[same key]. */
export const BPX: Record<BPInk, number> = {
  shade: PAL.N0, navy: PAL.N2, minor: PAL.N3, major: PAL.N4, faint: PAL.C3, mid: PAL.C5, line: PAL.C7, hot: PAL.C9,
  back: PAL.P1, backShade: PAL.P0,
};

/** The [BLUEPRINT] style set: proxies pinned exactly, everything else tone-mapped onto the navy -> cyan ramp. */
export const BLUEPRINT: PaletteSet = compilePalette({
  id: 'BLUEPRINT', label: 'BLUEPRINT', use: 'THE PLAN: explanations (accurate) on cyan-on-navy drafting paper. Script tag [BLUEPRINT].',
  colors: Object.values(BP),
  ramp: [BP.shade, BP.navy, BP.major, BP.faint, BP.mid, BP.line, BP.hot], mode: 'tone', levels: 3, pattern: bayer4,
  tone: {lo: 0.1, hi: 0.78, gamma: 0.9}, solid: SKIN_COLORS,
  pin: (Object.keys(BPX) as BPInk[]).map((k) => [BPX[k], BP[k]] as [number, number]),
});

/**
 * THE FLASH-PRINT (24.02: "the whole frame flash-prints to blueprint", a palette remap, no redraw): a BASE frame as
 * a cyanotype print. A threshold plus ONE pattern (like the freeze print): the dark room is navy paper, mid tones take
 * a 50% line screen, lit things print as cyan ink, the brightest as hot ink. Skin solid. Use as a whole-frame switch:
 *   {type: 'palette', to: BLUEPRINT_PRINT}
 */
export const BLUEPRINT_PRINT: PaletteSet = compilePalette({
  id: 'BLUEPRINT_PRINT', label: 'BLUEPRINT PRINT', use: '24.02: a BASE frame flash-printed to blueprint for a beat',
  colors: Object.values(BP), ramp: [BP.navy, BP.faint, BP.line, BP.hot], mode: 'tone', levels: 3, pattern: cluster4,
  tone: {lo: 0.16, hi: 0.72, gamma: 0.8}, solid: SKIN_COLORS,
});

/** Remap a sheet drawn in proxies to the blueprint output colours (in place). */
export const inkBlueprint = (b: Buf, mask?: Mask) => applyPalette(b, BLUEPRINT, {mask});

// ================================================================== the sheet
export interface SheetOpts {
  /** minor grid pitch (native px). Default 8 */
  minor?: number;
  /** major every n minors. Default 5 (40 px) */
  majorEvery?: number;
  /** border inset. Default 6 */
  margin?: number;
  /** zone letters down the margins (A, B, C ...) and numbers along the top. Default true */
  zones?: boolean;
  /** paper grain (sparse minor-colour specks; background only). Default true */
  grain?: boolean;
  seed?: number;
  /** the grid drawing itself on (25.01: rows, then columns, 3 held steps): 0 paper only, 1 rows, 2 rows + columns,
   *  3 (default) everything with the border. Use sheetReveal(k). */
  reveal?: 0 | 1 | 2 | 3;
}
/** 25.01's grid draw-on as held steps: k = frames since the downbeat (a step per 5 frames). */
export const sheetReveal = (k: number): 0 | 1 | 2 | 3 => (k < 0 ? 0 : k < 5 ? 1 : k < 10 ? 2 : 3);
/** Paper + drafting grid + a drawing border, into a sheet buffer (any size; 480 x 540 for a two-screen plan). */
export const bpSheet = (b: Buf, o: SheetOpts = {}) => {
  const mi = o.minor ?? 8, mj = mi * (o.majorEvery ?? 5), m = o.margin ?? 6, seed = o.seed ?? 3;
  const rv = o.reveal ?? 3;
  rect(0, 0, b.w, b.h, b.ink(BPX.navy));
  for (let y = 0; y < b.h; y++)
    for (let x = 0; x < b.w; x++) {
      const gx = rv >= 2 && (x - m) % mi === 0, gy = rv >= 1 && (y - m) % mi === 0;
      const Gx = rv >= 2 && (x - m) % mj === 0, Gy = rv >= 1 && (y - m) % mj === 0;
      if (Gx || Gy) b.set(x, y, BPX.major);
      else if (gx || gy) b.set(x, y, BPX.minor);
      else if (o.grain !== false && hash(x, y, seed) < 0.018) b.set(x, y, BPX.minor);
    }
  if (rv < 3) return;
  // border: a thin outer rule and a 2 px inner rule (an engineering sheet), with centring ticks
  const bx = m - 3, by = m - 3, bw = b.w - 2 * (m - 3), bh = b.h - 2 * (m - 3);
  outline(b, bx, by, bw, bh, BPX.faint);
  outline(b, bx + 3, by + 3, bw - 6, bh - 6, BPX.mid);
  outline(b, bx + 4, by + 4, bw - 8, bh - 8, BPX.mid);
  if (o.zones !== false) {
    const zl = 'ABCDEFGHJKLMN';
    for (let i = 0, y = by + 4 + 45; y < by + bh - 30; i++, y += 90) {
      micro(b, zl[i], bx, y - 2, BPX.faint);
      micro(b, zl[i], bx + bw - 3, y - 2, BPX.faint);
      rect(bx + 3, y + 43, 2, 1, b.ink(BPX.faint)); rect(bx + bw - 5, y + 43, 2, 1, b.ink(BPX.faint));
    }
    for (let i = 1, x = bx + 4 + 60; x < bx + bw - 30; i++, x += 120) {
      micro(b, String(i), x - 1, by - 1 < 0 ? 0 : by - 1 + 0, BPX.faint);
      rect(x + 59, by + 3, 1, 2, b.ink(BPX.faint));
    }
  }
};
const outline = (b: Buf, x: number, y: number, w: number, h: number, col: number) => {
  rect(x, y, w, 1, b.ink(col)); rect(x, y + h - 1, w, 1, b.ink(col)); rect(x, y, 1, h, b.ink(col)); rect(x + w - 1, y, 1, h, b.ink(col));
};

/**
 * Title block (bottom-right of a sheet): zero-read eggs in 3x5 micro lettering. `rows` = [label, value] pairs.
 * (x, y) = top-left. Returns the block size.
 */
export const bpTitleBlock = (b: Buf, x: number, y: number, rows: Array<[string, string]>, w = 150): [number, number] => {
  const rh = 9, h = rows.length * rh + 1;
  rect(x, y, w, h, b.ink(BPX.navy));
  outline(b, x, y, w, h, BPX.mid);
  rows.forEach(([k, v], i) => {
    const ry = y + i * rh;
    if (i) rect(x, ry, w, 1, b.ink(BPX.faint));
    micro(b, k, x + 3, ry + 2, BPX.faint);
    const kx = x + 44;
    rect(kx - 3, ry + 1, 1, rh - 1, b.ink(BPX.faint));
    micro(b, v, kx, ry + 2, BPX.line);
  });
  return [w, h];
};

// ================================================================== paths (whole-pixel strokes)
export type Pt = [number, number];
/** Bresenham points from (x0, y0) to (x1, y1), both ends included. */
export const linePts = (x0: number, y0: number, x1: number, y1: number): Pt[] => {
  x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
  const out: Pt[] = [];
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    out.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
  return out;
};
/** A polyline [x0,y0,x1,y1,...] as one continuous path (joints not doubled); `closed` returns to the start. */
export const polyPts = (pts: number[], closed = false): Pt[] => {
  const out: Pt[] = [];
  const n = pts.length / 2;
  for (let i = 0; i < n - 1 + (closed ? 1 : 0); i++) {
    const a = i, c = (i + 1) % n;
    const seg = linePts(pts[a * 2], pts[a * 2 + 1], pts[c * 2], pts[c * 2 + 1]);
    out.push(...(out.length ? seg.slice(1) : seg));
  }
  if (closed && out.length > 1) out.pop();
  return out;
};
/** Rectangle outline, clockwise from the top-left corner. */
export const rectPts = (x: number, y: number, w: number, h: number): Pt[] => polyPts([x, y, x + w - 1, y, x + w - 1, y + h - 1, x, y + h - 1], true);
/** Ellipse outline from angle a0 through `sweep` radians (clockwise on screen), 8-connected, no repeats. */
export const ellipsePts = (cx: number, cy: number, rx: number, ry: number, a0 = -Math.PI / 2, sweep = Math.PI * 2): Pt[] => {
  const out: Pt[] = [];
  const steps = Math.max(24, Math.ceil((rx + ry) * Math.abs(sweep) * 1.5));
  for (let i = 0; i <= steps; i++) {
    const a = a0 + (sweep * i) / steps;
    const p: Pt = [Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry)];
    const q = out[out.length - 1];
    if (q && q[0] === p[0] && q[1] === p[1]) continue;
    if (q && (Math.abs(q[0] - p[0]) > 1 || Math.abs(q[1] - p[1]) > 1)) out.push(...linePts(q[0], q[1], p[0], p[1]).slice(1));
    else out.push(p);
  }
  return out;
};
/**
 * A hand-drawn circling loop (THESE FOUR VOTE): an ellipse that starts at the top-right, runs a little past a full
 * turn and ends a few px outside the start, the way a marker circles a group.
 */
export const loopPts = (cx: number, cy: number, rx: number, ry: number): Pt[] => {
  const a = ellipsePts(cx, cy, rx, ry, -Math.PI * 0.3, Math.PI * 2.12);
  // spiral the tail outward by 2 px over its last 12%
  const n = a.length, k0 = Math.floor(n * 0.88);
  return a.map((p, i) => (i < k0 ? p : [p[0], p[1] - Math.round(((i - k0) / (n - k0)) * 3)] as Pt));
};
/** Pixels of a stroke revealed at frame f: starts at t0, `speed` px per frame, on whole frames. */
export const drawOn = (f: number, t0: number, len: number, speed = 8) => (f < t0 ? 0 : clamp(Math.floor((f - t0 + 1) * speed), 0, len));
/** Frame at which a stroke of `len` px started at t0 finishes. */
export const drawnAt = (t0: number, len: number, speed = 8) => t0 + Math.ceil(len / speed) - 1;

export interface InkOpts {
  /** brush: 1 (hairline), 2 (2x2), 3 (plus-shaped 3 px). Default 1 */
  weight?: 1 | 2 | 3;
  /** hot pen tip while drawing. Default true */
  tip?: boolean;
  /** dash pattern [on, off] in px along the path */
  dash?: [number, number];
}
/** Ink the first `n` pixels of a path (n >= pts.length = all). Returns true when complete. */
export const inkPath = (b: Buf, pts: Pt[], n: number, col: number, o: InkOpts = {}) => {
  const w = o.weight ?? 1;
  const m = Math.min(n, pts.length);
  const plot = (x: number, y: number, c: number) => {
    b.set(x, y, c);
    if (w >= 2) { b.set(x + 1, y, c); b.set(x, y + 1, c); b.set(x + 1, y + 1, c); }
    if (w === 3) { b.set(x - 1, y, c); b.set(x, y - 1, c); }
  };
  for (let i = 0; i < m; i++) {
    if (o.dash && i % (o.dash[0] + o.dash[1]) >= o.dash[0]) continue;
    plot(pts[i][0], pts[i][1], col);
  }
  if ((o.tip ?? true) && m > 0 && m < pts.length) {
    const [x, y] = pts[m - 1];
    if (m > 1) plot(pts[m - 2][0], pts[m - 2][1], BPX.mid === col ? BPX.line : BPX.mid);
    plot(x, y, BPX.hot);
  }
  return m >= pts.length;
};

// ================================================================== lettering
// The engine's 7 px face has no '~' (needed for '~$10B', '~72 HOURS'); the kit draws its own 5 px tilde in the
// same weight. (Engine owner: consider promoting it to font.ts; this is additive and local until then.)
const TILDE = ['.....', '.....', '.##.#', '#.##.', '.....', '.....', '.....'];
/** 28 px title face: the 14 px display face run through Scale2x once more (a drawn face, not a scaled sprite). */
export const HUGE_CAP = 28;
const HUGE = new Map<string, {w: number; rows: string[]}>();
const hugeGlyph = (ch: string) => {
  let g = HUGE.get(ch);
  if (g) return g;
  const bw = bigTextWidth(ch) || 8;
  const t = new Buf(bw, BIG_CAP + 4, 0);
  bigText(t, ch, 0, 0, 1);
  const at = (x: number, y: number) => x >= 0 && y >= 0 && x < t.w && y < t.h && t.c[y * t.w + x] === 1;
  const rows: string[][] = Array.from({length: t.h * 2}, () => Array(t.w * 2).fill('.'));
  for (let y = 0; y < t.h; y++)
    for (let x = 0; x < t.w; x++) {
      const P0 = at(x, y), A = at(x, y - 1), B = at(x + 1, y), C = at(x - 1, y), D = at(x, y + 1);
      rows[y * 2][x * 2] = (C === A && C !== D && A !== B ? A : P0) ? '#' : '.';
      rows[y * 2][x * 2 + 1] = (A === B && A !== C && B !== D ? B : P0) ? '#' : '.';
      rows[y * 2 + 1][x * 2] = (D === C && D !== B && C !== A ? C : P0) ? '#' : '.';
      rows[y * 2 + 1][x * 2 + 1] = (B === D && B !== A && D !== C ? D : P0) ? '#' : '.';
    }
  g = {w: t.w * 2, rows: rows.map((r) => r.join(''))};
  HUGE.set(ch, g);
  return g;
};
export const hugeTextWidth = (s: string) => {
  let w = 0;
  for (const ch of s) w += (ch === ' ' ? 12 : hugeGlyph(ch).w) + 4;
  return Math.max(0, w - 4);
};
export const hugeText = (b: Buf, s: string, x: number, y: number, col: number) => {
  let cx = x;
  for (const ch of s) {
    if (ch === ' ') { cx += 16; continue; }
    const g = hugeGlyph(ch);
    g.rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + j, col); });
    cx += g.w + 4;
  }
};
/** textWidth that knows the kit's tilde. */
export const bpTextWidth = (s: string, big = false) => {
  const parts = s.split('~');
  let w = 0;
  parts.forEach((p, i) => { w += big ? bigTextWidth(p) : textWidth(p); if (i < parts.length - 1) w += (p ? (big ? 2 : 1) : 0) + (big ? 10 : 5) + (big ? 2 : 1); });
  return w;
};
/** text / bigText with the kit's tilde. */
export const bpDrawText = (b: Buf, s: string, x: number, y: number, col: number, big = false) => {
  const parts = s.split('~');
  let cx = x;
  parts.forEach((p, i) => {
    if (p) { if (big) bigText(b, p, cx, y, col); else text(b, p, cx, y, col); cx += (big ? bigTextWidth(p) + 2 : textWidth(p) + 1); }
    if (i < parts.length - 1) {
      const k = big ? 2 : 1;
      TILDE.forEach((r, j) => { for (let q = 0; q < r.length; q++) if (r[q] === '#') for (let a = 0; a < k; a++) for (let c = 0; c < k; c++) b.set(cx + q * k + a, y + j * k + c, col); });
      cx += 5 * k + k;
    }
  });
};
export interface TextOpts {
  /** chars per frame (blueprint lettering types on). Default 2 */
  cps?: number;
  col?: number;
  /** 14 px display lettering */
  big?: boolean;
  align?: 'left' | 'center' | 'right';
  /** draw an underline after the text is complete (at 12 px/frame) */
  underline?: boolean;
}
/** Blueprint lettering that types on from frame t0. (x, y) = anchor (top). Returns the frame it completes. */
export const bpText = (b: Buf, s: string, x: number, y: number, f: number, t0: number, o: TextOpts = {}) => {
  const cps = o.cps ?? 2, col = o.col ?? BPX.line;
  const w = bpTextWidth(s, o.big);
  const ax = o.align === 'center' ? Math.round(x - w / 2) : o.align === 'right' ? x - w : x;
  const n = f < t0 ? 0 : clamp(Math.floor((f - t0 + 1) * cps), 0, s.length);
  const shown = s.slice(0, n);
  bpDrawText(b, shown, ax, y, col, o.big);
  const done = t0 + Math.ceil(s.length / cps) - 1;
  if (n > 0 && n < s.length) {
    // the pen: a hot block where the next letter goes
    const cx = ax + bpTextWidth(shown, o.big) + (o.big ? 2 : 1);
    rect(cx, y + (o.big ? BIG_CAP - 3 : 5), o.big ? 3 : 2, o.big ? 3 : 2, b.ink(BPX.hot));
  }
  if (o.underline && f > done) {
    const pts = linePts(ax, y + (o.big ? BIG_CAP + 2 : 9), ax + w - 1, y + (o.big ? BIG_CAP + 2 : 9));
    inkPath(b, pts, drawOn(f, done + 1, pts.length, 12), col);
  }
  return done;
};
/** A leader line from a label to its object, with a 3 px dot at the object end. Draws on from t0. */
export const bpLeader = (b: Buf, from: Pt, to: Pt, f: number, t0: number, col: number = BPX.mid) => {
  const pts = linePts(from[0], from[1], to[0], to[1]);
  const done = inkPath(b, pts, drawOn(f, t0, pts.length, 6), col);
  if (done) { b.set(to[0], to[1], BPX.line); b.set(to[0] + 1, to[1], BPX.line); b.set(to[0], to[1] + 1, BPX.line); b.set(to[0] - 1, to[1], BPX.line); b.set(to[0], to[1] - 1, BPX.line); }
};

/**
 * A spoken line on the blueprint (the figures talk in drafting lettering, not in speech balloons): a short leader
 * from the speaker's head, a knee, and the line typed on at 1 char/frame in hot ink. (x, y) = the label's top-left.
 */
export const bpCallout = (b: Buf, s: string, x: number, y: number, head: Pt, f: number, t0: number) => {
  if (f < t0) return t0;
  const kneeX = x - 4, kneeY = y + 4;
  const a = linePts(head[0], head[1], kneeX, kneeY), c = linePts(kneeX, kneeY, x - 1, kneeY);
  const n = drawOn(f, t0, a.length + c.length, 10);
  inkPath(b, a, n, BPX.mid, {tip: false});
  inkPath(b, c, Math.max(0, n - a.length), BPX.mid, {tip: false});
  return bpText(b, s, x + 2, y, f, t0 + Math.ceil((a.length + c.length) / 10), {cps: 1, col: BPX.hot});
};

// ================================================================== boxes, arrows, banners, dimensions
export interface BoxOpts {
  speed?: number;
  col?: number;
  /** double rule (a heavier box: the company) */
  double?: boolean;
  /** a label typed into a tab on the top edge, after the box closes */
  label?: string;
  labelBig?: boolean;
  /** which edge carries the label tab. Default 'top' */
  labelAt?: 'top' | 'bottom';
}
/** A box that draws itself on (clockwise from top-left), then types its label. Returns the frame it completes. */
export const bpBox = (b: Buf, x: number, y: number, w: number, h: number, f: number, t0: number, o: BoxOpts = {}) => {
  const col = o.col ?? BPX.line, sp = o.speed ?? 14;
  const pts = rectPts(x, y, w, h);
  const n = drawOn(f, t0, pts.length, sp);
  inkPath(b, pts, n, col);
  let done = drawnAt(t0, pts.length, sp);
  if (o.double) {
    const p2 = rectPts(x + 2, y + 2, w - 4, h - 4);
    inkPath(b, p2, drawOn(f, t0 + 2, p2.length, sp), BPX.mid);
    done = Math.max(done, drawnAt(t0 + 2, p2.length, sp));
  }
  if (o.label) {
    const tw = (o.labelBig ? bigTextWidth(o.label) : textWidth(o.label)) + 10;
    const th = o.labelBig ? BIG_CAP + 6 : 12;
    if (f > done) {
      // the tab: knocked out of the top rule, left-aligned
      const tx = x + 8, ty = (o.labelAt === 'bottom' ? y + h - 1 : y) - Math.floor(th / 2);
      rect(tx, ty, tw, th, b.ink(BPX.navy));
      const tp = rectPts(tx, ty, tw, th);
      inkPath(b, tp, drawOn(f, done + 1, tp.length, 16), col, {tip: false});
      done = bpText(b, o.label, tx + 5, ty + (o.labelBig ? 3 : 3), f, done + 2, {big: o.labelBig, col});
    }
  }
  return done;
};

/**
 * A thick arrow (CONTROLS) from (x, y0) down to (x, y1) (vertical; pass y1 < y0 to point up): the outline draws on,
 * then the shaft fills with 45-degree hatching. `w` = shaft width (odd), `head` = head half-width.
 */
export const bpArrow = (b: Buf, x: number, y0: number, y1: number, f: number, t0: number, o: {w?: number; head?: number; col?: number; speed?: number} = {}) => {
  const w = o.w ?? 7, hw = o.head ?? 8, col = o.col ?? BPX.line, sp = o.speed ?? 8;
  const dir = y1 >= y0 ? 1 : -1;
  const hl = hw + 2; // head length
  const sEnd = y1 - dir * hl;
  const s2 = Math.floor(w / 2);
  const pts = polyPts([x - s2, y0, x - s2, sEnd, x - hw, sEnd, x, y1, x + hw, sEnd, x + s2, sEnd, x + s2, y0], true);
  const n = drawOn(f, t0, pts.length, sp);
  const fin = drawnAt(t0, pts.length, sp);
  if (f > fin) {
    // hatching fills in whole-pixel rows (6 frames), shaft first, then the head
    const k = clamp((f - fin) / 6, 0, 1);
    const ya = Math.min(y0, y1), yb = Math.max(y0, y1);
    const lim = dir > 0 ? ya + Math.round((yb - ya) * k) : yb - Math.round((yb - ya) * k);
    for (let yy = ya + 1; yy < yb; yy++) {
      if (dir > 0 ? yy > lim : yy < lim) continue;
      const inHead = dir > 0 ? yy >= sEnd : yy <= sEnd;
      const half = inHead ? Math.floor(((y1 - yy) * dir) * hw / hl) - 1 : s2 - 1;
      for (let xx = x - half; xx <= x + half; xx++) if ((xx + yy) % 3 === 0) b.set(xx, yy, BPX.faint);
    }
  }
  inkPath(b, pts, n, col);
  return fin + 6;
};

/** A ribbon banner across a box top: the band with notched tails, the text centred. Draws on, then types. */
export const bpBanner = (b: Buf, cx: number, y: number, s: string, f: number, t0: number, o: {col?: number; pad?: number} = {}) => {
  const col = o.col ?? BPX.line, pad = o.pad ?? 10;
  const tw = textWidth(s) + pad * 2, x0 = cx - Math.floor(tw / 2), x1 = x0 + tw - 1, h = 13;
  // the tails: folded ends behind the band, 10 px each, notched
  const lt = polyPts([x0 + 4, y + 4, x0 - 10, y + 4, x0 - 5, y + 10, x0 - 10, y + 16, x0 + 4, y + 16], false);
  const rt = polyPts([x1 - 4, y + 4, x1 + 10, y + 4, x1 + 5, y + 10, x1 + 10, y + 16, x1 - 4, y + 16], false);
  const band = rectPts(x0, y, tw, h);
  const n = drawOn(f, t0, band.length, 18);
  if (n >= band.length) rect(x0 + 1, y + 1, tw - 2, h - 2, b.ink(BPX.navy));
  const ft = drawnAt(t0, band.length, 18);
  inkPath(b, lt, drawOn(f, ft + 1, lt.length, 6), BPX.mid);
  inkPath(b, rt, drawOn(f, ft + 1, rt.length, 6), BPX.mid);
  inkPath(b, band, n, col);
  return bpText(b, s, cx, y + 3, f, ft + 3, {align: 'center', col});
};

/** A dimension line with end ticks and arrowheads and a centred value: |<--- 6 SEATS --->| (horizontal). */
export const bpDim = (b: Buf, x0: number, x1: number, y: number, label: string, f: number, t0: number, col: number = BPX.faint) => {
  const tw = textWidth(label) + 6, cx = Math.round((x0 + x1) / 2);
  const left = linePts(cx - Math.ceil(tw / 2), y, x0, y), right = linePts(cx + Math.ceil(tw / 2), y, x1, y);
  const n = drawOn(f, t0, left.length, 10);
  inkPath(b, left, n, col); inkPath(b, right, n, col);
  if (n >= left.length) {
    for (const [ex, d] of [[x0, 1], [x1, -1]] as const) {
      rect(ex, y - 3, 1, 7, b.ink(col));
      b.set(ex + d, y - 1, col); b.set(ex + d, y + 1, col); b.set(ex + 2 * d, y - 2, col); b.set(ex + 2 * d, y + 2, col);
    }
    text(b, label, cx - Math.floor(textWidth(label) / 2), y - 3, BPX.mid);
  }
};

// ================================================================== stamps
export interface StampOpts {
  /** 14 px lettering. Default false (7 px) */
  big?: boolean;
  /** 28 px title lettering (THE WORD): the display face run through Scale2x once more. Overrides big */
  huge?: boolean;
  col?: number;
  /** double-ruled frame (THE WORD). Default false */
  double?: boolean;
  /** ink breakup (0..0.3). Default 0.12 */
  wear?: number;
  seed?: number;
  pad?: number;
}
/**
 * A rubber stamp centred on (cx, cy): lands at k = 0 (drawn 1 px down-right, the kick), settles at k = 1, and
 * stays. k < 0: nothing. Lines are centred. Returns [w, h].
 */
export const bpStamp = (b: Buf, lines: string[], cx: number, cy: number, k: number, o: StampOpts = {}): [number, number] => {
  const huge = !!o.huge, big = !!o.big || huge, col = o.col ?? BPX.hot, pad = o.pad ?? (huge ? 12 : big ? 9 : 5), wear = o.wear ?? 0.12, seed = o.seed ?? 7;
  const lh = huge ? HUGE_CAP + 8 : big ? BIG_CAP + 5 : 10;
  const lw = (s: string) => (huge ? hugeTextWidth(s) : big ? bigTextWidth(s) : textWidth(s));
  const tw = Math.max(...lines.map(lw));
  const w = tw + pad * 2 + (o.double ? 6 : 0), h = lines.length * lh - (huge ? 8 : big ? 5 : 3) + pad * 2 + (o.double ? 6 : 0);
  if (k < 0) return [w, h];
  const kick = k === 0 ? 1 : 0;
  const x = Math.round(cx - w / 2) + kick, y = Math.round(cy - h / 2) + kick;
  const t = new Buf(w, h, -1);
  const bw = huge ? 3 : big ? 2 : 1;
  for (let i = 0; i < bw; i++) outline(t, i, i, w - 2 * i, h - 2 * i, 1);
  if (o.double) for (let i = 0; i < (huge ? 2 : 1); i++) outline(t, bw + 2 + i, bw + 2 + i, w - 2 * (bw + 2 + i), h - 2 * (bw + 2 + i), 1);
  const ox = o.double ? 3 : 0;
  lines.forEach((s, i) => {
    const lx = Math.round((w - lw(s)) / 2), ly = pad + ox + i * lh;
    if (huge) hugeText(t, s, lx, ly, 1); else if (big) bigText(t, s, lx, ly, 1); else text(t, s, lx, ly, 1);
  });
  // worn rubber: dropouts only where the ink is at least 2 px thick both ways (a 1 px stroke never breaks, so
  // 7 px lettering stays legible), plus a paler band where the stamp was pressed unevenly
  const ink = (i: number, j: number) => i >= 0 && j >= 0 && i < w && j < h && t.c[j * w + i] === 1;
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      if (!ink(i, j)) continue;
      const thick = (ink(i - 1, j) || ink(i + 1, j)) && (ink(i, j - 1) || ink(i, j + 1)) && (ink(i - 1, j) && ink(i + 1, j) || ink(i, j - 1) && ink(i, j + 1));
      const drop = thick && (hash(i >> 1, j >> 1, seed) < wear || hash(i, j, seed + 1) < wear * 0.5);
      const pale = hash((i + j * 3) >> 3, 0, seed + 2) < 0.3 && hash(i, j, seed + 3) < 0.5;
      if (drop) continue;
      b.set(x + i, y + j, pale ? BPX.line : col);
    }
  return [w, h];
};

/** The tick box of a plan step: an empty 9x9 box; ticked (k >= 0) a check lands in 2 drawings. */
export const bpCheck = (b: Buf, x: number, y: number, k: number, col: number = BPX.line) => {
  outline(b, x, y, 9, 9, BPX.mid);
  if (k < 0) return;
  const tick = k === 0 ? ['.......', '.......', '.......', '#......', '.#.....', '..#....', '.......'] : ['......#', '.....#.', '....#..', '#..#...', '.##....', '..#....', '.......'];
  tick.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') { b.set(x + 1 + i, y + 1 + j, k === 0 ? BPX.hot : col); } });
  if (k >= 1) b.set(x + 8, y - 1, col);
};

// ================================================================== figures
/** Blueprint drafting figures are line drawings on the navy paper: outline + a dash-dot centreline. */
const plotRows = (b: Buf, rows: string[], x: number, y: number, pal: Record<string, number>, flip = false) => {
  const w = rows[0].length;
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[flip ? w - 1 - i : i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
};

export type ChairPose = 'sit' | 'stand' | 'walkA' | 'walkB';
export const CHAIR_W = 21;
/**
 * A boardroom chair in blueprint elevation (front view), 21 wide. (x, y) = foot centre on the floor line.
 *  sit    the pedestal chair, empty, waiting
 *  stand  it rises 4 px on two small legs (the pedestal gone), a held pose
 *  walkA / walkB  the two walk drawings (hold each 4-5 frames; move 2 px per step)
 * `bolts` draws MADA's egg: two bolt heads and anchor lines at the pedestal feet. `sticker` = DRUH's campaign sticker
 * (a plain rosette: no logo, no date).
 */
export const bpChair = (b: Buf, x: number, y: number, pose: ChairPose = 'sit', o: {bolts?: boolean; sticker?: boolean; col?: number} = {}) => {
  const col = o.col ?? BPX.line;
  const lift = pose === 'sit' ? 0 : pose === 'walkA' ? 5 : pose === 'walkB' ? 4 : 4;
  const x0 = x - 10, top = y - 30 - lift;
  // backrest: a tall rounded rect with a lumbar seam
  const back = polyPts([x0 + 4, top + 2, x0 + 6, top, x0 + 14, top, x0 + 16, top + 2, x0 + 16, top + 15, x0 + 4, top + 15], true);
  inkPath(b, back, 999, col, {tip: false});
  inkPath(b, linePts(x0 + 6, top + 11, x0 + 14, top + 11), 999, BPX.faint, {tip: false});
  // arms + seat (a flattened box in elevation)
  inkPath(b, polyPts([x0 + 1, top + 13, x0 + 3, top + 13, x0 + 3, top + 18]), 999, col, {tip: false});
  inkPath(b, polyPts([x0 + 19, top + 13, x0 + 17, top + 13, x0 + 17, top + 18]), 999, col, {tip: false});
  inkPath(b, rectPts(x0 + 1, top + 17, 19, 4), 999, col, {tip: false});
  if (pose === 'sit') {
    // gas stem + five-star base in elevation: a bar with three casters
    rect(x0 + 10, top + 21, 1, 5, b.ink(col));
    inkPath(b, polyPts([x0 + 3, y - 3, x0 + 10, y - 4, x0 + 17, y - 3]), 999, col, {tip: false});
    for (const cx of [x0 + 3, x0 + 10, x0 + 17]) { b.set(cx, y - 2, col); b.set(cx - 1, y - 1, col); b.set(cx + 1, y - 1, col); b.set(cx, y, BPX.mid); }
    if (o.bolts) {
      // bolted to the floor: hex heads on the outer casters, anchor lines down into the ground (dashed)
      for (const cx of [x0 + 3, x0 + 17]) {
        rect(cx - 1, y + 1, 3, 2, b.ink(BPX.hot));
        for (let j = 3; j < 8; j += 2) b.set(cx, y + j, BPX.faint);
      }
    }
  } else {
    // small legs: two, 1 px, with 2 px feet. walkA spreads them, walkB crosses the passing position
    const hip = top + 21;
    const legs: Array<[number, number, number, number]> =
      pose === 'stand' ? [[x0 + 7, hip, x0 + 7, y], [x0 + 13, hip, x0 + 13, y]]
        : pose === 'walkA' ? [[x0 + 8, hip, x0 + 5, y], [x0 + 12, hip, x0 + 15, y]]
          : [[x0 + 9, hip, x0 + 9, y], [x0 + 11, hip, x0 + 12, y - 1]];
    for (const [a, c, d, e] of legs) { inkPath(b, linePts(a, c, d, e), 999, col, {tip: false}); b.set(d + 1, e, col); }
  }
  // the centreline (dash-dot) down the chair: a drafting convention, not a drawing
  for (let j = top - 3; j < top + 24; j++) if ((j - top) % 6 < 3 || (j - top) % 6 === 4) if (j < top || j > top + 16) b.set(x0 + 10, j, BPX.faint);
  if (o.sticker) {
    // a plain round campaign sticker on the backrest (no logo, no date): a disc with a star, two ribbon tails
    const sx = x0 + 10, sy = top + 6;
    plotRows(b, ['..###..', '.#####.', '###.###', '##...##', '###.###', '.#####.', '..###..'], sx - 3, sy - 3, {'#': BPX.hot});
    b.set(sx, sy, BPX.line);
    b.set(sx - 2, sy + 4, BPX.mid); b.set(sx - 2, sy + 5, BPX.mid); b.set(sx + 2, sy + 4, BPX.mid); b.set(sx + 2, sy + 5, BPX.mid);
  }
};

/**
 * A chair in PLAN view (25.03: "the six remaining chairs as small top-view symbols"): a rounded seat, the backrest
 * as a thick arc on the far side, the arms as ticks. (x, y) = centre. `mark` rings it (a voter, carried over from
 * 25.02's circles). `back` = which side the backrest is on.
 */
export const bpChairTop = (b: Buf, x: number, y: number, o: {mark?: boolean; back?: 'up' | 'down'; col?: number} = {}) => {
  const col = o.col ?? BPX.line, up = (o.back ?? 'up') === 'up';
  inkPath(b, polyPts([x - 4, y - 5, x + 4, y - 5, x + 6, y - 3, x + 6, y + 4, x + 4, y + 6, x - 4, y + 6, x - 6, y + 4, x - 6, y - 3], true), 999, col, {tip: false});
  const by = up ? y - 7 : y + 8;
  rect(x - 5, by, 11, 2, b.ink(col));
  b.set(x - 7, y, BPX.mid); b.set(x + 7, y, BPX.mid); b.set(x - 7, y + 1, BPX.mid); b.set(x + 7, y + 1, BPX.mid);
  b.set(x, y, BPX.faint);
  if (o.mark) inkPath(b, ellipsePts(x, y, 11, 11), 999, BPX.hot, {tip: false});
};
/** A small hand-drawn circle around one item (25.02: the voters circled one per beat), drawing on from t0. */
export const bpRing = (b: Buf, cx: number, cy: number, rx: number, ry: number, f: number, t0: number, col: number = BPX.hot) => {
  const lp = loopPts(cx, cy, rx, ry);
  inkPath(b, lp, drawOn(f, t0, lp.length, Math.max(8, Math.ceil(lp.length / 8))), col);
};

export type WalkerKind = 'door' | 'paper' | 'spinner' | 'square';
/**
 * The four PLAN walkers (drafting figures, ~30 px): a door on legs (ALYI), a figure holding a glowing paper (NELEH),
 * a figure with a loading spinner over its head (MADA), a black square on legs (THE QUIET VOTE).
 * (x, y) = foot centre. `step` = walk drawing 0 (stand) / 1 / 2 (use walkStep()). `f` drives the glow and spinner.
 */
export const bpWalker = (b: Buf, kind: WalkerKind, x: number, y: number, step: 0 | 1 | 2, f: number, o: {spin?: boolean; flip?: boolean; k?: 1 | 2; bright?: boolean} = {}) => {
  // k = 2: the same figure REDRAWN larger (25.05's close): every coordinate doubles, strokes stay 1 px
  const k = o.k ?? 1;
  const col = BPX.line;
  const bob = step === 2 ? -k : 0;
  const hip = y - 11 * k + bob;
  const S = (v: number) => v * k;
  const legs: Array<[number, number, number, number]> =
    step === 0 ? [[x - S(2), hip, x - S(2), y], [x + S(2), hip, x + S(2), y]] : step === 1 ? [[x - S(1), hip, x - S(4), y], [x + S(1), hip, x + S(4), y]] : [[x, hip, x, y], [x + S(1), hip, x + S(2), y - k]];
  const d = o.flip ? -1 : 1;
  for (const [a, c, e, g] of legs) { inkPath(b, linePts(a, c, e, g), 999, col, {tip: false}); for (let i = 1; i <= k; i++) b.set(e + d * i, g, col); }
  if (kind === 'door') {
    const top = hip - S(26);
    inkPath(b, rectPts(x - S(7), top, S(15), S(27)), 999, col, {tip: false});
    inkPath(b, rectPts(x - S(5), top + S(2), S(11), S(10)), 999, BPX.mid, {tip: false});
    inkPath(b, rectPts(x - S(5), top + S(14), S(11), S(9)), 999, BPX.mid, {tip: false});
    rect(x + S(5) * d - (k > 1 ? 1 : 0), top + S(14), k, k, b.ink(BPX.hot));
    return;
  }
  if (kind === 'square') {
    const top = hip - S(15);
    rect(x - S(7), top, S(15), S(15), b.ink(BPX.shade));
    inkPath(b, rectPts(x - S(7), top, S(15), S(15)), 999, col, {tip: false});
    return;
  }
  const neck = hip - S(14), head = neck - S(7);
  inkPath(b, ellipsePts(x, head, 3.5 * k, 3.5 * k), 999, col, {tip: false});
  inkPath(b, polyPts([x - S(3), neck, x + S(3), neck, x + S(4), hip, x - S(4), hip], true), 999, col, {tip: false});
  if (kind === 'paper') {
    inkPath(b, polyPts([x - S(3), neck + S(2), x + S(3) * d, neck + S(7), x + S(6) * d, neck + S(6)]), 999, col, {tip: false});
    inkPath(b, polyPts([x + S(3), neck + S(2), x + S(6) * d, neck + S(5)]), 999, col, {tip: false});
    const px0 = o.flip ? x - S(10) : x + S(5);
    const glow = Math.floor(f / 4) % 3 + (o.bright ? 2 : 0);
    for (let j = -S(4); j < S(11); j++) for (let i = -S(4); i < S(10); i++) {
      const dd = Math.hypot((i - 2.5 * k) / 1.1, j - 3.5 * k) / k;
      if (dd > 5 + glow * 0.5 || dd < 3.5) continue;
      if (bayer8(px0 + i, neck + j) < (o.bright ? 0.55 : 0.35) - (dd - 3.5) * 0.08) b.set(px0 + i, neck - S(2) + j, o.bright ? BPX.mid : BPX.faint);
    }
    rect(px0, neck - k, S(6), S(8), b.ink(BPX.hot));
    for (let j = k; j < S(7); j += 2) rect(px0 + k, neck - k + j, S(4), 1, b.ink(BPX.back));
    return;
  }
  inkPath(b, linePts(x - S(4), neck + S(4), x + S(4), neck + S(4)), 999, col, {tip: false});
  inkPath(b, linePts(x - S(4), neck + S(4) + 1, x + S(4), neck + S(4) + 1), 999, BPX.mid, {tip: false});
  bpSpinner(b, x, head - S(9), o.spin === false ? 0 : f, false, k);
};
/** Walk drawing for a walker moving from t0 (2 drawings, on `every` frames: 2 = the board's "walks on 2s"). */
export const walkStep = (f: number, t0: number, t1: number, every = 4): 0 | 1 | 2 => (f < t0 || f >= t1 ? 0 : (Math.floor((f - t0) / every) % 2 === 0 ? 1 : 2));

/** MADA's loading spinner in blueprint ink (the same 8-position drawing as the call tile's). */
export const bpSpinner = (b: Buf, cx: number, cy: number, f: number, frozen = false, k = 1) => {
  const dots = spinnerDots(frozen ? 0 : f, k > 1 ? 'r5' : 'r3');
  for (const [dx, dy, lv] of dots) { const c = lv === 3 ? BPX.hot : lv === 2 ? BPX.line : lv === 1 ? BPX.mid : BPX.faint; b.set(cx + dx, cy + dy, c); if (k > 1) { b.set(cx + dx + 1, cy + dy, c); b.set(cx + dx, cy + dy + 1, c); b.set(cx + dx + 1, cy + dy + 1, c); } }
};

/** The moth in the equity box: closed (k<=0), half (1), open (>=2). ~11 x 7. (x, y) = centre. */
export const bpMoth = (b: Buf, x: number, y: number, k: number) => {
  const d = k <= 0 ? ['....#....', '...###...', '...###...', '...###...', '...###...', '....#....']
    : k === 1 ? ['...#.#...', '..##.##..', '.###.###.', '..#####..', '...###...', '....#....']
      : ['##.......##', '#.#.....#.#', '#..#.#.#..#', '.#..###..#.', '..#.###.#..', '.#..###..#.', '#..#.#.#..#', '.##.....##.'];
  const pal = {'#': BPX.line};
  const w = d[0].length;
  plotRows(b, d, x - Math.floor(w / 2), y - Math.floor(d.length / 2), pal);
  // antennae
  const ty = y - Math.floor(d.length / 2) - 1;
  if (k >= 1) { b.set(x - 1, ty, BPX.mid); b.set(x + 1, ty, BPX.mid); b.set(x - 2, ty - 1, BPX.mid); b.set(x + 2, ty - 1, BPX.mid); }
};

/** A key ring the size of a steering wheel: the ring (2 px), n keys hanging off its bottom. Draws on from t0. */
export const bpKeyRing = (b: Buf, cx: number, cy: number, r: number, f: number, t0: number, nKeys = 4) => {
  const ring = ellipsePts(cx, cy, r, r, -Math.PI / 2, Math.PI * 2);
  const n = drawOn(f, t0, ring.length, 8);
  inkPath(b, ring, n, BPX.line, {weight: 1});
  inkPath(b, ellipsePts(cx, cy, r - 2, r - 2, -Math.PI / 2, Math.PI * 2), n, BPX.mid, {tip: false});
  if (n < ring.length) return drawnAt(t0, ring.length, 8);
  const done = drawnAt(t0, ring.length, 8);
  for (let i = 0; i < nKeys; i++) {
    if (f < done + 2 + i * 3) continue;
    const a = Math.PI / 2 + (i - (nKeys - 1) / 2) * 0.42;
    const kx = Math.round(cx + Math.cos(a) * r), ky = Math.round(cy + Math.sin(a) * r);
    // each key: a round bow, a shaft hanging straight down, two teeth (drawn, never rotated)
    inkPath(b, ellipsePts(kx, ky + 3, 2.5, 2.5), 999, BPX.line, {tip: false});
    rect(kx, ky + 6, 1, 11 + (i % 2) * 3, b.ink(BPX.line));
    const tip = ky + 16 + (i % 2) * 3;
    b.set(kx + 1, tip - 1, BPX.line); b.set(kx + 2, tip - 1, BPX.line); b.set(kx + 1, tip - 4, BPX.line);
  }
  return done + 2 + nKeys * 3;
};

/** A picket fence that draws itself on left to right (posts one at a time, then the rails). */
export const bpFence = (b: Buf, x: number, y: number, w: number, h: number, f: number, t0: number, pitch = 7) => {
  const posts = Math.floor(w / pitch) + 1;
  for (let i = 0; i < posts; i++) {
    if (f < t0 + i) continue;
    const px = x + i * pitch;
    inkPath(b, polyPts([px, y + h, px, y + 2, px + 1, y, px + 2, y + 2, px + 2, y + h]), 999, BPX.line, {tip: false});
  }
  const rt = t0 + posts;
  for (const ry of [y + 5, y + h - 4]) {
    const pts = linePts(x - 2, ry, x + (posts - 1) * pitch + 4, ry);
    inkPath(b, pts, drawOn(f, rt, pts.length, 20), BPX.mid);
  }
  return rt + Math.ceil(w / 20);
};

// ================================================================== the break
/**
 * THE BREAK's chalk: a stroke starts along the blank (x, y) and runs `len` px at 3 px/frame, SQUEAKS (the line
 * chatters 1 px, stalls for 4 frames) and SNAPS (the stick breaks, its tip hops off and falls). k = frames since the
 * chalk touched down. Returns the phase: 'draw' | 'squeak' | 'snap' | 'done'.
 */
export const bpChalk = (b: Buf, x: number, y: number, k: number, o: {run?: number; col?: number; held?: boolean; size?: 1 | 2} = {}) => {
  if (k < 0) return 'draw';
  const run = o.run ?? 22, col = o.col ?? BPX.hot, z = o.size ?? 1;
  // held (25.06's board): the stroke grows in 3 held drawings on 4s (1/3, 2/3, all), then squeaks and snaps.
  // size 2 = the insert's chalk, REDRAWN bigger (a 4 px stroke, a 16 x 5 stick), never scaled
  const drawF = o.held ? 12 : Math.ceil(run / 3), squeakF = drawF + 5, snapF = squeakF;
  const ln = o.held ? Math.min(run, Math.round((run * (Math.floor(k / 4) + 1)) / 3)) : Math.min(run, (k + 1) * 3);
  // the stroke: chalky rows with hash dropouts, then the chatter (a zigzag over the last 6 px)
  for (let i = 0; i < ln; i++) {
    const cx = x + i;
    for (let r = 0; r < 2 * z; r++) if (hash(cx, y + r, 51) > (r === 2 * z - 1 ? 0.45 : 0.18)) b.set(cx, y - 1 - r, r === 2 * z - 1 ? BPX.back : col);
  }
  const chat = k >= drawF ? Math.min(6 * z, (k - drawF + 2) * z) : 0;
  for (let i = 0; i < chat; i++) for (let r = 0; r < z; r++) b.set(x + run + i, y - 1 - r - ((i >> (z - 1)) % 2 ? 2 * z : 0), col);
  const tipX = x + ln + chat;
  const L = 9 * z, T = 2 * z;
  const stick = (sx: number, sy: number, len: number) => { rect(sx, sy, len, T, b.ink(BPX.hot)); rect(sx, sy + T, len, z, b.ink(BPX.back)); rect(sx + len - z, sy, z, T + z, b.ink(BPX.back)); };
  if (k < snapF) { const jit = k >= drawF && k % 2 ? -z : 0; stick(tipX, y - 3 * z - 2 + jit, L); return k < drawF ? 'draw' : 'squeak'; }
  const s = k - snapF;
  // snapped (2 drawings): the stroke breaks (its last 3 px lift off), the butt jerks back; a crumb drops 2 px, falls
  if (s < 10) stick(tipX + 3 * z, y - 5 * z - Math.min(2, s) * z, 6 * z);
  for (let i = 0; i < 3 * z; i++) for (let r = 0; r < 2 * z; r++) b.set(tipX - 1 - i, y - 1 - r, BPX.navy);
  const HOP = [0, 2, 2, -4, -6, -6, -5, -3, 0, 4, 9, 15, 22, 30, 39, 49];
  const hopY = (s < HOP.length ? HOP[s] : 49 + (s - 15) * 12) * z; // and on out of frame
  if (s > 40) return 'done';
  const tx = tipX + 1 + s * 2 * z, ty = y - 3 * z + hopY;
  rect(tx, ty, 3 * z, 2 * z, b.ink(BPX.hot)); rect(tx, ty + 2 * z, 3 * z, z, b.ink(BPX.back));
  if (s < 8) for (let i = 0; i < 4; i++) rect(tipX + 1 + i * 2 * z, y - 3 * z + s + (i % 2) * z, z, z, b.ink(BPX.back));
  return s < 16 ? 'snap' : 'done';
};

export interface CurlSpec {
  corner: 'br' | 'tr' | 'bl' | 'tl';
  /** how far the corner has lifted, px along the diagonal. Held drawings: 6, 14, 26, 42 ... */
  s: number;
}
export interface TearSpec {
  /** screen y of the tear line (the step-4 line) */
  y: number;
  /** 0..1: how far the crack has run across the sheet (from `from`) */
  run: number;
  /** px the upper half has lifted / the lower half has dropped */
  up: number;
  down: number;
  from?: 'left' | 'right';
  seed?: number;
}
/** Held drawings for a curl: k = frames since it starts, one drawing per `every` frames (25.07: 4 held drawings). */
export const curlAt = (k: number, steps: number[] = [8, 18, 32, 48], every = 4): number => (k < 0 ? 0 : steps[Math.min(steps.length - 1, Math.floor(k / every))]);
/** Held drawings for the tear: the crack runs (3 drawings), then the halves part (whole px, on 2s/3s) and leave. */
export const tearAt = (k: number, runFrames = 7): {run: number; up: number; down: number} => {
  // the crack RUNS left to right like a render front (runFrames, whole px per frame, a hot head), then the halves part
  if (k < 0) return {run: 0, up: 0, down: 0};
  if (k < runFrames) return {run: (k + 1) / runFrames, up: 0, down: 0};
  const seq: Array<[number, number, number]> = [[1, 2, 2], [4, 8, 2], [12, 24, 2], [32, 56, 2], [80, 130, 1], [300, 300, 1]];
  let t = k - runFrames;
  for (const [up, down, n] of seq) { if (t < n) return {run: 1, up, down}; t -= n; }
  return {run: 1, up: 300, down: 300};
};

const JAG_CACHE = new Map<string, Int8Array>();
const jagRow = (w: number, seed: number) => {
  const key = `${w}|${seed}`;
  let r = JAG_CACHE.get(key);
  if (!r) {
    r = new Int8Array(w);
    let v = 0;
    for (let x = 0; x < w; x++) {
      if (x % 3 === 0) v = clamp(v + (hash(x, 0, seed) < 0.5 ? -1 : 1), -2, 2);
      const tooth = hash(Math.floor(x / 5), 1, seed) < 0.12 ? (hash(x, 2, seed) < 0.5 ? -1 : 1) : 0;
      r[x] = v + tooth;
    }
    JAG_CACHE.set(key, r);
  }
  return r;
};

export interface CompositeOpts {
  /** camera offset into the sheet (whole px). Default 0 */
  ox?: number;
  oy?: number;
  /** the frame behind the paper (BASE). Shown where the paper is gone; default: N0 */
  behind?: Buf;
  curl?: CurlSpec | null;
  tear?: TearSpec | null;
  /** neon light from behind catches the lifted paper (a sparse rim in these master colours). Default Vegas neon */
  neon?: number[];
}
/**
 * The final blueprint frame into `fb` (which it overwrites): the sheet (proxies) viewed at (ox, oy), inked to the
 * blueprint output colours, then the curl and the tear revealing `behind` (left in BASE: the neon bleeds through).
 */
export const bpComposite = (fb: Buf, sheet: Buf, o: CompositeOpts = {}) => {
  const W = fb.w, H = fb.h, ox = o.ox ?? 0, oy = o.oy ?? 0;
  const page = new Buf(W, H, BPX.navy);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const sx = x + ox, sy = y + oy; if (sx >= 0 && sy >= 0 && sx < sheet.w && sy < sheet.h) page.c[y * W + x] = sheet.c[sy * sheet.w + sx]; }
  inkBlueprint(page);
  const behind = (x: number, y: number) => (o.behind ? o.behind.c[clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1)] : PAL.N0);
  const neon = o.neon ?? [PAL.R3, PAL.W7, PAL.U5, PAL.R2];
  // 1. the curl (on the page, before it tears)
  const curled = new Buf(W, H, 0);
  curled.c.set(page.c);
  const cu = o.curl;
  if (cu && cu.s > 0) {
    const s = cu.s, fw = Math.max(2, Math.round(s * 0.55));
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const dx = cu.corner === 'br' || cu.corner === 'tr' ? W - 1 - x : x;
        const dy = cu.corner === 'br' || cu.corner === 'bl' ? H - 1 - y : y;
        const d = dx + dy;
        const i = y * W + x;
        if (d < s) curled.c[i] = behind(x, y);
        else if (d < s + fw) {
          // the flap: the back of the sheet, shaded toward the roll and at its lip; neon catches the edge
          const u = (d - s) / fw;
          let c: number = u < 0.18 ? BP.backShade : u > 0.82 ? BP.backShade : BP.back;
          if (u >= 0.18 && u < 0.4 && bayer4(x, y) < 0.5) c = BP.backShade;
          if (d - s < 2 && bayer4(x, y) < 0.6) c = neon[Math.floor(hash(x >> 1, y >> 1, 9) * neon.length)];
          curled.c[i] = c;
        } else if (d < s + fw + 3 && bayer4(x, y) < (d < s + fw + 1 ? 0.75 : 0.35)) curled.c[i] = BP.shade;
      }
  }
  // 2. the tear (the two halves part along the ragged line; torn fibres show the sheet's back)
  const te = o.tear;
  if (!te || te.run <= 0) { fb.c.set(curled.c); return fb; }
  const J = jagRow(W, te.seed ?? 5);
  const runPx = Math.round(te.run * W);
  const fromL = (te.from ?? 'left') === 'left';
  // the running crack's head: a render-front core (hot, a dithered glow) at the tip, while it runs
  const headX = te.run < 1 && te.up === 0 ? (fromL ? runPx - 1 : W - runPx) : -99;
  for (let x = 0; x < W; x++) {
    const ty = te.y + J[x];
    const cracked = fromL ? x < runPx : x >= W - runPx;
    for (let y = 0; y < H; y++) {
      const i = y * W + x;
      if (!cracked) { fb.c[i] = curled.c[i]; continue; }
      if (te.up === 0 && te.down === 0) {
        // the crack: a 1 px line of the frame behind with fibre on both lips
        fb.c[i] = y === ty ? behind(x, y) : (y === ty - 1 || y === ty + 1) && hash(x, y, 3) < 0.55 ? BP.back : curled.c[i];
        continue;
      }
      const su = y + te.up, sd = y - te.down;
      if (su < ty) {
        // upper half; its torn lip (last 1-2 rows) is fibre
        fb.c[i] = su >= ty - 1 - (hash(x, 7, 2) < 0.4 ? 1 : 0) ? (hash(x, su, 4) < 0.7 ? BP.back : BP.backShade) : curled.c[clamp(su, 0, H - 1) * W + x];
      } else if (sd > ty) {
        fb.c[i] = sd <= ty + 1 + (hash(x, 8, 2) < 0.4 ? 1 : 0) ? (hash(x, sd, 5) < 0.7 ? BP.back : BP.backShade) : curled.c[clamp(sd, 0, H - 1) * W + x];
      } else {
        // the gap: the room behind, with the upper half's shadow falling 2 px onto it
        let c = behind(x, y);
        const edge = ty - te.up;
        if (y - edge >= 0 && y - edge < 3) c = stepColor(stepColor(c, -1), y - edge < 2 ? -1 : 0);
        fb.c[i] = c;
      }
    }
  }
  if (headX > -99) {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -6; dx <= 2; dx++) {
      const X = headX + (fromL ? dx : -dx), Y = te.y + J[clamp(headX, 0, W - 1)] + dy;
      const r = Math.hypot(dx / 2, dy);
      if (r < 1) fb.set(X, Y, BP.hot);
      else if (r < 4 && bayer4(X, Y) < (1 - r / 4) * 0.8) fb.set(X, Y, r < 2 ? BP.line : BP.mid);
    }
  }
  return fb;
};

// ================================================================== the entry: a room turns to blueprint
export interface TraceOpts {
  /** lightness step that inks a full line. Default 0.075 */
  edge?: number;
  /** lightness step that inks a faint construction line. Default 0.035 */
  soft?: number;
  /** hatch bright areas (lamps, windows, neon) with sparse 45-degree lines. Default true */
  hatch?: boolean;
  /** paper grid under the trace. Default true */
  grid?: boolean;
}
const LCACHE = new Map<number, number>();
const Lof = (c: number) => { let v = LCACHE.get(c); if (v === undefined) { v = lightness(c); LCACHE.set(c, v); } return v; };
/**
 * The frame as a blueprint drawing (proxies): 1 px lines where lightness steps, faint construction lines on soft
 * steps, sparse hatching on bright planes, the drafting grid everywhere else. Deterministic; a remap of the frame
 * (it never redraws the art). Ink it with inkBlueprint (or use bpFront).
 */
export const traceBlueprint = (src: Buf, o: TraceOpts = {}): Buf => {
  const W = src.w, H = src.h, e1 = o.edge ?? 0.075, e0 = o.soft ?? 0.035;
  const out = new Buf(W, H, BPX.navy);
  if (o.grid !== false) bpSheet(out, {zones: false});
  const L = new Float32Array(W * H);
  for (let i = 0; i < L.length; i++) L[i] = Lof(src.c[i]);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x, l = L[i];
      const gx = x + 1 < W ? Math.abs(L[i + 1] - l) : 0, gy = y + 1 < H ? Math.abs(L[i + W] - l) : 0;
      const g = Math.max(gx, gy);
      if (g >= e1) out.c[i] = g >= e1 * 2.2 ? BPX.line : BPX.mid;
      else if (g >= e0) out.c[i] = BPX.faint;
      else if (o.hatch !== false && l > 0.5 && (x + y) % 4 === 0) out.c[i] = l > 0.7 ? BPX.mid : BPX.faint;
    }
  return out;
};

/**
 * THE ENTRY: a render front sweeps the BASE frame `base` into its blueprint trace (final colours into `fb`).
 * Use frames 10-14 (it must be over before it reads as an effect); the beam is blueprint-hot, not monitor cyan.
 */
export const bpFront = (fb: Buf, base: Buf, f: number, t0: number, frames = 12, o: {dir?: Dir; trace?: Buf} = {}) => {
  const tr = o.trace ?? traceBlueprint(base);
  const inked = tr.clone();
  inkBlueprint(inked);
  const dir = o.dir ?? 'right';
  const len = dir === 'right' || dir === 'left' ? fb.w : fb.h;
  const {pos, smear} = frontPos(f, t0, frames, len, 4);
  renderFront(fb, base, inked, pos, {dir, smear, glow: 4, core: [BP.hot, BP.line, BP.mid, BP.faint, BP.major], tear: 1});
  return fb;
};
