// MR. MAS — shared pixel engine: PALETTE SETS (the style switches) and remap utilities.
//
// The framebuffer only ever holds master-palette colours, so a style switch is a per-colour lookup:
// every source colour compiles to an ordered-dither PAIR (a, b, t) in the target set, and a pixel shows b
// where threshold(x, y) < t. That keeps switches crisp, stable frame to frame, and cheap enough to cut in on
// any frame — including inside a mask (the Orb's scan cone, "freeze everything except Mas").
//
//   BASE          the show. identity.
//   2TONE_FREEZE  navy/cream freeze-frame for founders' name cards (world frozen, Mas stays in colour).
//   ONEBIT        1993: early-Mac black/paper-white, stepped fill patterns (not noise).
//   EARLYWEB16    2008-14: 16 web-safe colours, GIF-era ordered dither; hue-preserving pair matching.
//   LEDGER        money: green ledger-paper line screen (engraving stand-in).
//   TERMINAL      the machine's point of view: 4-level CRT teal.
import {Buf} from './px';
import {PAL, lightness, oklab, toLinear, linToOklab, stepColor, SKIN_COLORS} from './palette';
import {Threshold, bayer4, bayer8, lines, cluster4} from './dither';
// Tone curves below are tuned on the show's dark night rooms (most of the frame sits at OKLab L 0.12-0.4).
// Brighter sets (the Woodrose dinner, the skyline) should derive a variant: PALETTES.ONEBIT.with({tone: ...}).
import {Mask} from './mask';

export type PaletteId = 'BASE' | '2TONE_FREEZE' | 'ONEBIT' | 'EARLYWEB16' | 'LEDGER' | 'TERMINAL';

/** Tone curve on OKLab lightness: t = clamp((L - lo) / (hi - lo))^gamma. */
export interface ToneCurve { lo: number; hi: number; gamma: number; }

export interface PaletteSetDef {
  id: string;
  label: string;
  /** when to use it (shown in the guide / sheets) */
  use: string;
  /** every colour the set can output */
  colors: number[];
  /** identity: pass-through. tone: lightness -> a dark-to-light ramp. pair: nearest perceptual mix (hue kept). */
  mode: 'identity' | 'tone' | 'pair';
  /** tone mode: output ramp, darkest first */
  ramp?: number[];
  /** tone mode: dither steps between neighbouring ramp colours, including both ends (3 = solid, 50%, solid) */
  levels?: number;
  tone?: ToneCurve;
  /** ordered threshold map for the pairs */
  pattern?: Threshold;
  /** pair mode: allowed mix ratios (fewer = calmer) */
  mixes?: number[];
  /** pair mode: penalty on mixing far-apart colours (higher = fewer noisy pairs) */
  pairBias?: number;
  /** pair mode: linear-light exposure gain before matching (lifts the dark show palette) */
  exposure?: number;
  /** pair mode: OKLab chroma gain before matching */
  chroma?: number;
  /** hand overrides: source colour -> [a, b, t] or a single colour */
  pin?: Array<[number, number | [number, number, number]]>;
  /**
   * colours that must never dither (the dither-discipline rule: skin, usually `SKIN_COLORS`). They resolve to
   * ONE output colour: tone mode thresholds their level, pair mode takes the nearest single set colour.
   * Pins still win.
   */
  solid?: number[];
}

export interface PaletteSet extends PaletteSetDef {
  /** the (a, b, t) pair for a source colour (cached) */
  entry: (c: number) => [number, number, number];
  /** remap one pixel */
  map: (c: number, x: number, y: number) => number;
  /** derive a variant (e.g. a brighter scene needs a different tone curve) */
  with: (o: Partial<PaletteSetDef>) => PaletteSet;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const compilePalette = (def: PaletteSetDef): PaletteSet => {
  const cache = new Map<number, [number, number, number]>();
  const pattern = def.pattern ?? bayer4;
  const pins = new Map(def.pin ?? []);
  const solids = new Set(def.solid ?? []);
  const toneOf = (c: number) => {
    const t = def.tone ?? {lo: 0.14, hi: 0.8, gamma: 1};
    return Math.pow(clamp01((lightness(c) - t.lo) / (t.hi - t.lo)), t.gamma);
  };
  // pair-mode precomputation
  const pc = def.colors.map((c) => ({c, lin: toLinear(c), lab: oklab(c)}));
  const mixes = def.mixes ?? [0, 0.25, 0.5, 0.75];
  const solve = (c: number): [number, number, number] => {
    const pin = pins.get(c);
    if (pin !== undefined) return typeof pin === 'number' ? [pin, pin, 0] : pin;
    if (def.mode === 'identity') return [c, c, 0];
    if (def.mode === 'tone') {
      const ramp = def.ramp ?? def.colors;
      const n = ramp.length - 1;
      const lv = Math.max(2, def.levels ?? 3) - 1;
      const v = toneOf(c) * n;
      let i = Math.floor(v);
      let f = v - i;
      if (i >= n) { i = n - 1; f = 1; }
      const q = solids.has(c) ? (f < 0.5 ? 0 : 1) : Math.round(f * lv) / lv;
      if (q <= 0) return [ramp[i], ramp[i], 0];
      if (q >= 1) return [ramp[i + 1], ramp[i + 1], 0];
      return [ramp[i], ramp[i + 1], q];
    }
    // pair: minimise perceptual error of the linear-light mix, plus a penalty for mixing far colours
    let [r, g, b] = toLinear(c);
    const ex = def.exposure ?? 1;
    r *= ex; g *= ex; b *= ex;
    let [L, A, B] = linToOklab(r, g, b);
    const ch = def.chroma ?? 1;
    A *= ch; B *= ch;
    const bias = def.pairBias ?? 0.35;
    let best: [number, number, number] = [pc[0].c, pc[0].c, 0];
    let bestE = Infinity;
    const single = solids.has(c);
    for (let i = 0; i < pc.length; i++)
      for (let j = i; j < (single ? i + 1 : pc.length); j++) {
        const p = pc[i], q = pc[j];
        const dPair = Math.hypot(p.lab[0] - q.lab[0], p.lab[1] - q.lab[1], p.lab[2] - q.lab[2]);
        for (const m of i === j ? [0] : mixes) {
          if (i !== j && m === 0) continue;
          const lr = p.lin[0] * (1 - m) + q.lin[0] * m, lg = p.lin[1] * (1 - m) + q.lin[1] * m, lb = p.lin[2] * (1 - m) + q.lin[2] * m;
          const [l2, a2, b2] = linToOklab(lr, lg, lb);
          const e = Math.hypot((l2 - L) * 1.2, a2 - A, b2 - B) + (i === j ? 0 : bias * dPair * 4 * m * (1 - m));
          if (e < bestE) { bestE = e; best = [p.c, q.c, m]; }
        }
      }
    return best;
  };
  const entry = (c: number) => {
    let e = cache.get(c);
    if (!e) { e = solve(c); cache.set(c, e); }
    return e;
  };
  const map = (c: number, x: number, y: number) => {
    const e = entry(c);
    return e[2] <= 0 ? e[0] : e[2] >= 1 ? e[1] : pattern(x, y) < e[2] ? e[1] : e[0];
  };
  const set: PaletteSet = {...def, entry, map, with: (o) => compilePalette({...def, ...o})};
  return set;
};

// ------------------------------------------------------------------------------------------------ sets
export const BASE = compilePalette({id: 'BASE', label: 'BASE', use: 'The show. Everything that is not a motivated switch.', colors: Object.values(PAL), mode: 'identity'});

/**
 * navy / cream — both are master colours (N4, P2), so a frozen frame still sits inside the show palette.
 * A THRESHOLD PLUS ONE PATTERN (levels 3: solid ink, one 50% clustered screen, solid paper) and skin is solid:
 * the dither-discipline rule. The founders' dinner uses the per-founder inks in freeze.ts (same recipe).
 */
export const TWOTONE_FREEZE = compilePalette({
  id: '2TONE_FREEZE', label: '2-TONE FREEZE', use: 'Founders\' name cards: the world freezes into navy/cream while Mas stays in colour and keeps moving.',
  colors: [PAL.N4, PAL.P2], ramp: [PAL.N4, PAL.P2], mode: 'tone', levels: 3, pattern: cluster4,
  tone: {lo: 0.14, hi: 0.54, gamma: 0.95}, solid: SKIN_COLORS,
});

export const ONEBIT = compilePalette({
  id: 'ONEBIT', label: '1-BIT', use: '1993 only (Kid Mas, the beige computer, the system alert). Era-true early-Mac monochrome.',
  colors: [0x0e0e10, 0xe9e6da], ramp: [0x0e0e10, 0xe9e6da], mode: 'tone', levels: 9, pattern: bayer4,
  // N0/N1 solid black, the N2 night wall a sparse 1/8 dot, N3 25%, lit planes climb to white
  tone: {lo: 0.135, hi: 0.62, gamma: 0.85},
});

/** 16 web-safe colours (every channel a multiple of 0x33) picked for this show's hue families. */
export const EARLYWEB16_COLORS = [
  0x000000, 0x000033, 0x333366, 0x336699, 0x3399cc, 0x66ccff, 0xccffff, 0xffffff,
  0x666699, 0x999999, 0x663333, 0x993300, 0xff6600, 0xffcc66, 0xcc9966, 0xcc3333,
];
export const EARLYWEB16 = compilePalette({
  id: 'EARLYWEB16', label: 'EARLY-WEB 16', use: '2008-14 (the TPOOL stage, the WHY COMBINATOR crown). The palette scales with the era.',
  colors: EARLYWEB16_COLORS, mode: 'pair', pattern: bayer4, mixes: [0.5], pairBias: 0.6, exposure: 1.5, chroma: 1.1,
  solid: SKIN_COLORS, // skin takes one flat web colour, never a GIF checker
});

export const LEDGER = compilePalette({
  id: 'LEDGER', label: 'LEDGER', use: 'Money. A few frames at most (the $1,000,000,000* novelty check). Engraving stand-in.',
  colors: [0x16251d, 0x4f6f55, 0xe3dcc0], ramp: [0x16251d, 0x4f6f55, 0xe3dcc0], mode: 'tone', levels: 4, pattern: lines(3, 0),
  tone: {lo: 0.15, hi: 0.72, gamma: 0.85}, solid: SKIN_COLORS,
});

export const TERMINAL = compilePalette({
  id: 'TERMINAL', label: 'TERMINAL', use: 'The machine\'s point of view (Orb POV, the model looking at us).',
  colors: [0x020606, 0x0b3b3b, 0x22a7ad, 0xc6fbf1], ramp: [0x020606, 0x0b3b3b, 0x22a7ad, 0xc6fbf1], mode: 'tone', levels: 3, pattern: bayer4,
  tone: {lo: 0.14, hi: 0.78, gamma: 0.85}, solid: SKIN_COLORS,
});

export const PALETTES: Record<PaletteId, PaletteSet> = {
  BASE, '2TONE_FREEZE': TWOTONE_FREEZE, ONEBIT, EARLYWEB16, LEDGER, TERMINAL,
};
export type PaletteRef = PaletteId | PaletteSet;
export const getPalette = (p: PaletteRef): PaletteSet => (typeof p === 'string' ? PALETTES[p] : p);

// ------------------------------------------------------------------------------------------------ applying
export interface ApplyOpts {
  /** only inside this mask (soft coverage resolves with `edge`) */
  mask?: Mask;
  /** apply OUTSIDE the mask instead ("freeze everything except Mas") */
  invert?: boolean;
  /** restrict to a rectangle [x, y, w, h] */
  rect?: [number, number, number, number];
  /** threshold used to resolve soft mask edges (default bayer8) */
  edge?: Threshold;
}

/** Generic per-pixel remap with mask/rect support. `f(c, x, y)` returns the new colour. */
export const remap = (b: Buf, f: (c: number, x: number, y: number) => number, o: ApplyOpts = {}) => {
  const [rx, ry, rw, rh] = o.rect ?? [0, 0, b.w, b.h];
  const edge = o.edge ?? bayer8;
  const m = o.mask;
  for (let y = Math.max(0, ry); y < Math.min(b.h, ry + rh); y++)
    for (let x = Math.max(0, rx); x < Math.min(b.w, rx + rw); x++) {
      if (m) {
        const inside = m.on(x, y, edge);
        if (inside === !!o.invert) continue;
      }
      const i = y * b.w + x;
      b.c[i] = f(b.c[i], x, y);
    }
  return b;
};

/** Apply a palette set to the whole buffer, a rect, or a mask. */
export const applyPalette = (b: Buf, p: PaletteRef, o: ApplyOpts = {}) => {
  const set = getPalette(p);
  if (set.mode === 'identity' && !set.pin) return b;
  return remap(b, set.map, o);
};

/** Copy of `b` in palette `p` (source untouched). */
export const inPalette = (b: Buf, p: PaletteRef, o: ApplyOpts = {}) => applyPalette(b.clone(), p, o);

/** Step every colour k rungs along its master family: k>0 "bloom brighter", k<0 dim (cutscene UI). */
export const familyStep = (k: number) => (c: number) => stepColor(c, k);

/** Remap through an explicit table (unlisted colours pass through). */
export const lutRemap = (table: Map<number, number> | Record<number, number>) => {
  const t = table instanceof Map ? table : new Map(Object.entries(table).map(([k, v]) => [Number(k), v]));
  return (c: number) => t.get(c) ?? c;
};

/** Silhouette: every non-background colour becomes `col` (door backlight, shadow puppets). */
export const flatten = (col: number, except: number[] = []) => (c: number) => (except.includes(c) ? c : col);

/** Report colours that are not in the master palette (dev check for hand-typed hexes). */
export const strayColors = (b: Buf) => {
  const known = new Set(Object.values(PAL));
  const out = new Map<number, number>();
  for (let i = 0; i < b.c.length; i++) if (!known.has(b.c[i])) out.set(b.c[i], (out.get(b.c[i]) ?? 0) + 1);
  return out;
};

