// MR. MAS — shared pixel engine: THE FREEZE PRINT + THE FOUNDER CARD (one module for the whole Woodrose dinner:
// mdinner1's GERG and ALYI, mdinner2's MARIO and NOLE). The era stamp lives in src/shared/pixel/cast/era.ts.
//
// When a founder enters, the world is PRINTED for one beat: cream paper plus that founder's ink (Gerg green, Alyi
// orange, Mario ink blue, Nole red). Mas is never printed: he stays in colour and keeps moving. The card that names
// the founder uses ONE geometry for everyone: portrait window top-left, the text plate to its right, at most one
// fine-print line, an optional rubber stamp. Rise-ins may differ per founder (pass a per-frame y); the layout may not.
//
// Dither discipline (binding): the room prints as a THRESHOLD PLUS ONE PATTERN (solid ink / one 50% clustered
// screen / solid paper). Figures, faces and lettering print as a pure THRESHOLD (no pattern at all). Skin never
// dithers.
//
// Two ways to use it:
//   1. per-pixel, by owner (what the dinner does: mdinner1 scene.ts printFrame, mirrored in mdinner2): paint into an
//      owner buffer, then map each pixel with freezePrint (the room), freezeSolid (figures, lettering, the linen,
//      the featured founder — each on its own curve; mdinner1 exports its PRINT_TONES) or freezePop (the flash).
//   2. as switch specs: freezeSwitches(who, {live, figures, shade, pop}) returns the masked palette specs in order.
//   after: (ui) => founderCard(ui, {who: 'mario', x: 12, y: 14, k, portrait: ...})
import {Buf, rect, hash} from './px';
import {PAL, SKIN_COLORS} from './palette';
import {Threshold, cluster4} from './dither';
import {compilePalette, PaletteSet, ToneCurve} from './palettes';
import {Mask} from './mask';
import type {SwitchSpec} from './compose';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from './font';
import {portraitWindow, THEME} from './ui';

export type Founder = 'gerg' | 'alyi' | 'mario' | 'nole';

export interface FounderStyle {
  name: string;
  /** the card tagline */
  line: string;
  /** the print's dark ink (the frozen room's shadows print in this) */
  ink: number;
  /** the card accent: name, top rule, rule under the name (a bright member of the same family) */
  accent: number;
  /** the one fine-print line (optional; `founderCard` also takes an override, e.g. a live counter) */
  fine?: string;
  /** the rubber stamp (optional) */
  stamp?: string;
}

/** The founders, their inks and their card copy (INTRO_PIXEL_BRIEF: name-card text). */
export const FOUNDERS: Record<Founder, FounderStyle> = {
  gerg: {name: 'GERG MOCKBRAN', line: 'ORG CHART: HIM.', ink: PAL.L1, accent: PAL.L3, fine: 'SLEEP: DEPRECATED'},
  // ink W4 (ember), not the rust W3: it read too close to Nole's maroon in print. Fine print: the SCRIPT §3.5b
  // fallback (BUNKER: YES is held pending the §9.10 ruling)
  alyi: {name: 'ALYI', line: 'FEELS THE AGI.', ink: PAL.W4, accent: PAL.W6, fine: 'PRODUCTS: 0 · EFFIGIES: 1'},
  mario: {name: 'MARIO', line: 'HAS CONCERNS. HAS GPUS.', ink: PAL.F3, accent: PAL.F6, fine: 'WORD COUNT: 15,000+'},
  // ink Q1 (rocket red, the SPACEZ family), not the maroon R0: Alyi's ember and Nole's red stay apart in print
  nole: {name: 'NOLE', line: 'NAMED IT.', ink: PAL.Q1, accent: PAL.Q2, stamp: 'SUED OVER IT.'},
};

/** the print's paper */
export const PAPER = PAL.P2;
/** the one pattern the room may use (a 50% clustered screen: reads as print, not as GIF noise) */
export const PRINT_PATTERN: Threshold = cluster4;

/** Tone curves on OKLab lightness, tuned on THE WOODROSE (a warm, brighter-than-night room). */
export const FREEZE_TONE = {
  /** the room: the tablecloth and lit plaster print as screen or paper, the night stays ink */
  room: {lo: 0.2, hi: 0.6, gamma: 1} as ToneCurve,
  /** figures and text: a pure threshold at this lightness (below = ink, above = paper) */
  figure: {lo: 0.3, hi: 0.4, gamma: 1} as ToneCurve,
  /** the 2-frame pop on the hit: the same two inks, pushed toward paper (<= 80% paper) */
  pop: {lo: 0.08, hi: 0.4, gamma: 0.85} as ToneCurve,
  /**
   * shadowed surfaces that would otherwise block up into a flat field of ink (the tablecloth skirt under the
   * table's front edge): lifted so their shadow prints as the screen and their light as paper
   */
  shade: {lo: 0.05, hi: 0.45, gamma: 1} as ToneCurve,
};

const CACHE = new Map<string, PaletteSet>();
const make = (who: Founder, kind: 'room' | 'figure' | 'pop' | 'shade', tone?: ToneCurve) => {
  const key = `${who}:${kind}:${tone ? JSON.stringify(tone) : ''}`;
  let s = CACHE.get(key);
  if (!s) {
    const ink = FOUNDERS[who].ink;
    s = compilePalette({
      id: `FREEZE_${who.toUpperCase()}_${kind.toUpperCase()}`, label: `freeze print (${who}, ${kind})`,
      use: 'The founders\' name cards: the world freezes into cream paper + the founder\'s ink; Mas stays in colour.',
      colors: [ink, PAPER], ramp: [ink, PAPER], mode: 'tone', pattern: PRINT_PATTERN,
      // the room: threshold + one pattern; figures/text: threshold only; the pop: threshold + one pattern
      levels: kind === 'figure' ? 2 : 3,
      tone: tone ?? FREEZE_TONE[kind], solid: SKIN_COLORS,
    });
    CACHE.set(key, s);
  }
  return s;
};
/** The frozen room in `who`'s ink: threshold + one 50% screen. */
export const freezePrint = (who: Founder, tone?: ToneCurve) => make(who, 'room', tone);
/** Frozen figures, faces and text in `who`'s ink: a pure threshold. */
export const freezeSolid = (who: Founder, tone?: ToneCurve) => make(who, 'figure', tone);
/** The 2-frame pop on the freeze hit. */
export const freezePop = (who: Founder, tone?: ToneCurve) => make(who, 'pop', tone);
/** Shadowed surfaces (the tablecloth skirt): the same print with a lifted curve, so they read as screen. */
export const freezeShade = (who: Founder, tone?: ToneCurve) => make(who, 'shade', tone);

export interface FreezeMasks {
  /** pixels that never freeze (Mas and whatever he touches): excluded from every spec */
  live: Mask;
  /** frozen figures and text (threshold only). Optional */
  figures?: Mask;
  /** shadowed surfaces printed with the lifted `shade` curve (e.g. the tablecloth skirt). Optional */
  shade?: Mask;
  /** frames 0-1 of the hit: print everything with the pop curve */
  pop?: boolean;
  /** tone overrides (dev tuning) */
  tone?: Partial<typeof FREEZE_TONE>;
}
/**
 * The freeze as switch specs, in order: the room (everything outside live + figures), then the figures.
 * Masks are binary (255 = in). Mas is outside both and stays in colour.
 */
export const freezeSwitches = (who: Founder, m: FreezeMasks): SwitchSpec[] => {
  const t = {...FREEZE_TONE, ...(m.tone ?? {})};
  const out: SwitchSpec[] = [];
  const keep = m.live.clone();
  if (m.figures) keep.union(m.figures);
  if (m.shade) keep.union(m.shade);
  out.push({type: 'palette', to: m.pop ? freezePop(who, t.pop) : freezePrint(who, t.room), mask: keep, invert: true});
  if (m.shade) out.push({type: 'palette', to: m.pop ? freezePop(who, t.pop) : freezeShade(who, t.shade), mask: m.shade.clone().subtract(m.live)});
  if (m.figures) out.push({type: 'palette', to: m.pop ? freezePop(who, t.pop) : freezeSolid(who, t.figure), mask: m.figures.clone().subtract(m.live)});
  return out;
};

// ================================================================== the founder card (UI layer: never remapped)
/** One geometry for every founder (native px; x, y = top-left of the portrait window). */
export const CARD = {portraitW: 112, portraitH: 136, gap: 10, textTop: 10, pad: 5, minW: 60} as const;

export interface FounderCardOpts {
  who: Founder;
  /** top-left of the portrait window, this frame (a rise-in passes a moving y) */
  x: number; y: number;
  /** frames since the hit */
  k: number;
  /** paint the 112x136 portrait (called only when the window is fully open) */
  portrait?: (b: Buf, x: number, y: number, w: number, h: number) => void;
  /** skip the engine window: the caller draws its own (Alyi's lancet), the text plate still sits beside it */
  customWindow?: boolean;
  /** the window is already open (a rise-in carries an open window) */
  open?: boolean;
  /** override the fine-print line (e.g. a live counter); '' = none */
  fine?: string;
  /** frame the fine print starts typing (default 14) */
  kFine?: number;
  /** frame the stamp lands (default 15) */
  kStamp?: number;
}
/** width of the text block for a founder (the plate is this + 2 * pad) */
export const cardBlockW = (who: Founder, fine?: string) => {
  const s = FOUNDERS[who];
  const f = fine ?? s.fine ?? '';
  return Math.max(bigTextWidth(s.name) + 8, textWidth(s.line) + 4, f ? textWidth(f) + 4 : 0, s.stamp ? textWidth(s.stamp) + 16 : 0, CARD.minW);
};

/**
 * The rubber stamp: 7px caps inside a 1px double border, in stamp red, with worn-rubber ink breakup (seeded,
 * stable). kk = frames since it landed: 0 = the impact drawing (+1 px, full ink, specks), then settled.
 */
export const rubberStamp = (b: Buf, x: number, y: number, s: string, kk: number, col = PAL.R3, seed = 7) => {
  const w = textWidth(s) + 10, h = 15;
  const off = kk === 0 ? 1 : 0;
  const X = x + off, Y = y + off;
  const tmp = new Buf(w, h, 0);
  const ink = tmp.ink(1);
  rect(0, 0, w, 1, ink); rect(0, h - 1, w, 1, ink); rect(0, 0, 1, h, ink); rect(w - 1, 0, 1, h, ink);
  rect(2, 2, w - 4, 1, ink); rect(2, h - 3, w - 4, 1, ink); rect(2, 2, 1, h - 4, ink); rect(w - 3, 2, 1, h - 4, ink);
  text(tmp, s, 5, 4, 1);
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      if (tmp.c[j * w + i] !== 1) continue;
      // uneven inking: the border prints light along a diagonal band and at the right end; the letters keep
      // their shapes and only lose a few dry specks (a worn stamp, never a broken word)
      const border = j < 3 || j >= h - 3 || i < 3 || i >= w - 3;
      const band = (i + j * 2) % 23 < 4;
      const dry = hash(i, j, seed) < (kk === 0 ? 0.03 : border ? (band ? 0.55 : i > w * 0.7 ? 0.3 : 0.1) : 0.07);
      if (!dry) b.set(X + i, Y + j, col);
    }
  // the impact frame throws a few ink specks
  if (kk === 0) for (const [i, j] of [[-2, 3], [w + 1, 2], [w, h + 1], [9, -2], [w - 14, h + 1]] as const) b.set(X + i, Y + j, col);
  return [w, h] as const;
};

/**
 * The founder card. Timeline (k): 0-2 the window opens in 3 held steps, 3 the name cuts in, 4 the rule,
 * 5+ the tagline types on at 2 chars/frame, kFine the fine print (3 chars/frame), kStamp the stamp.
 * Returns the text block's geometry so a caller can hang its one bespoke detail off it.
 */
export const founderCard = (b: Buf, o: FounderCardOpts) => {
  const s = FOUNDERS[o.who];
  const {portraitW: pw, portraitH: ph, gap, textTop, pad} = CARD;
  const k = o.k;
  if (!o.customWindow) portraitWindow(b, o.x, o.y, pw, ph, {open: o.open ? 1 : Math.min(1, (k + 1) / 3), content: o.portrait});
  const fine = o.fine ?? s.fine ?? '';
  const blockW = cardBlockW(o.who, fine);
  const tx = o.x + pw + gap, ty = o.y + textTop;
  const kFine = o.kFine ?? 14, kStamp = o.kStamp ?? 15;
  const hasFine = !!fine && k >= kFine;
  const hasStamp = !!s.stamp && k >= kStamp;
  const plateH = BIG_CAP + 26 + (hasFine ? 12 : 0) + (hasStamp && !fine ? 18 : 0);
  if (k >= 3) {
    rect(tx - pad, ty - pad, blockW + 2 * pad, plateH, b.ink(THEME.ink));
    rect(tx - pad, ty - pad, blockW + 2 * pad, 1, b.ink(s.accent));
    bigText(b, s.name, tx, ty, s.accent, {shadow: THEME.shadow, deep: true});
    if (k >= 4) rect(tx, ty + BIG_CAP + 3, bigTextWidth(s.name) + 8, 2, b.ink(s.accent));
    if (k >= 5) text(b, s.line.slice(0, Math.max(0, (k - 5) * 2)), tx, ty + BIG_CAP + 9, PAL.P1, {shadow: THEME.shadow});
    if (hasFine) text(b, fine.slice(0, Math.max(0, (k - kFine) * 3)), tx, ty + BIG_CAP + 21, PAL.N6);
  }
  if (hasStamp) {
    // the stamp takes the fine-print row, struck a little off-centre, its bottom edge overhanging the plate
    const sx = tx + 3, sy = ty + BIG_CAP + 22;
    rubberStamp(b, sx, sy, s.stamp!, k - kStamp);
  }
  return {tx, ty, blockW, plateH, plateX: tx - pad, plateY: ty - pad};
};

/** The place card on the cloth (the name card, shrunk), in the founder's accent. Built by callers from FOUNDERS. */
export const founderAccent = (who: Founder) => FOUNDERS[who].accent;
