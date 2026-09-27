// MR. MAS — Ep1 v3, Acts Two and Three (the `v3-shots-act2-act3` pass): small helpers the two segments' layouts share.
// Nothing here is art: the gag card (the show's freeze-frame name card, text only, placed per shot so it never covers
// the face it names), the 2-tone freeze with Mas kept in colour (palettes.ts 2TONE_FREEZE: "the world freezes into
// navy/cream while Mas stays in colour"), blinks on a fixed un-mechanical schedule, held-step helpers and the mouth
// maps for rigs whose mouths are not the six visemes.
import {Buf, rect, clamp, bayer} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {bigText, bigTextWidth, text, textWidth, BIG_CAP} from '../../../../shared/pixel/font';
import {applyPalette, PALETTES} from '../../../../shared/pixel/palettes';
import type {PaletteSet} from '../../../../shared/pixel/palettes';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {RH, mouth} from '../kit';
import type {PxShot} from '../kit';

/** a blink on a fixed schedule: lid 0 open, 1 half, 2 shut (3 frames every ~4 s, offset by seed). Mas never blinks */
export const blink = (k: number, seed: number): 0 | 1 | 2 => { const p = (k + seed * 37) % 97; return p === 0 || p === 2 ? 1 : p === 1 ? 2 : 0; };
/** held steps: which of `at` (ascending shot frames) has been reached (0 = none) */
export const stepOf = (k: number, at: number[]) => { let n = 0; for (const a of at) if (k >= a) n++; return n; };
/** a whole-pixel value that moves from a to b between k0 and k1, held on `every` frames */
export const heldLerp = (k: number, k0: number, k1: number, a: number, b: number, every = 2) => {
  const kk = clamp(k - ((k - k0) % every + every) % every, k0, k1);
  return Math.round(a + (b - a) * clamp((kk - k0) / Math.max(1, k1 - k0), 0, 1));
};
/**
 * A speaker's drawn mouth that stays shut under his own V.O. The host applies a layout's `face` to every non-post line of
 * that speaker, the inner voice included, so `mouth()` alone would move Mas's lips on his V.O.: this reads the mouth
 * only while one of his spoken (dialogue) lines is sounding (with the lip-sync's one-frame lead).
 */
export const spoken = (sh: PxShot, k: number, who: string): Viseme => {
  const vo = sh.lines.some((l) => l.who === who && l.kind === 'vo' && k + 1 >= l.s && k < l.e);
  const dl = sh.lines.some((l) => l.who === who && l.kind === 'dialogue' && k + 1 >= l.s && k < l.e + 1);
  return vo && !dl ? 'rest' : mouth(sh, k, who);
};
/** the Mario portrait's four mouths (cast/talk marioMouth's reading) */
export const marioM = (v: Viseme): 0 | 1 | 2 | 3 => (v === 'A' ? 2 : v === 'O' ? 3 : v === 'E' ? 1 : 0);
/** NESNEJ's bust mouths (the grin is his rest) */
export const nesnejM = (v: Viseme): 'grin' | 'A' | 'E' | 'O' | 'M' => (v === 'A' || v === 'E' || v === 'O' || v === 'M' ? v : 'grin');
/** a room-scale rig with rest / open / smile mouths: `open` while the take is open, else its rest */
export const roomM = (open: 'open' | 'rest', rest: 'rest' | 'smile' = 'rest'): 'rest' | 'open' | 'smile' => (open === 'open' ? 'open' : rest);

/** the 2-tone freeze of the room area (the card's one beat), keeping `keep` pixels (Mas) in colour */
export const freeze2 = (b: Buf, keep?: (x: number, y: number) => boolean, set: PaletteSet = PALETTES['2TONE_FREEZE']) => {
  const src = keep ? b.clone() : null;
  applyPalette(b, set, {rect: [0, 0, 480, RH]});
  if (src && keep) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (keep(x, y)) b.set(x, y, src.get(x, y));
};
/** the freeze re-curved for a bright room (art-a's APEC_FREEZE recipe: the stock curve prints a bright room almost
 *  all cream), and a step brighter for the dark ones */
export const FREEZE_BRIGHT = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.3, hi: 0.62, gamma: 1}});
/** the rooftop's open sky: a curve high enough that the blue prints as the half screen, not as paper */
export const FREEZE_SKY = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.5, hi: 0.82, gamma: 1}});
export const FREEZE_DARK = PALETTES['2TONE_FREEZE'].with({tone: {lo: 0.1, hi: 0.46, gamma: 0.95}});
/** a keep-mask from a drawing call: whatever `draw` paints into an empty buffer */
export const maskOf = (draw: (b: Buf) => void): ((x: number, y: number) => boolean) => {
  const E = 0x1000000;
  const t = new Buf(480, 270, E);
  draw(t);
  return (x, y) => t.get(x, y) !== E;
};
/** lighten the room area n palette steps (the flash's white step: never to white) */
export const lighten = (b: Buf, n: number) => { if (n > 0) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), n)); };
export const darken = (b: Buf, n: number) => { if (n > 0) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, stepColor(b.get(x, y), -n)); };

/** a soft band of light (one palette step, bayer-edged) crossing the room area from x0 to x1 between shot frames k0
 *  and k1 in 4-px held steps: a passing car's headlight on a wall, a glint across brass or a print. `clip` limits it */
export const sweep = (b: Buf, k: number, k0: number, k1: number, x0: number, x1: number, halfW = 36, clip?: (x: number, y: number) => boolean) => {
  if (k < k0 || k >= k1) return;
  const t = (k - k0) / Math.max(1, k1 - k0);
  let cx = Math.round(x0 + (x1 - x0) * t);
  cx -= ((cx % 4) + 4) % 4;
  for (let y = 0; y < RH; y++) for (let x = Math.max(0, cx - halfW); x < Math.min(480, cx + halfW); x++) {
    if (clip && !clip(x, y)) continue;
    const d = Math.abs(x - cx) / halfW;
    if (bayer(x, y) > d * 1.2) b.set(x, y, stepColor(b.get(x, y), 1));
  }
};

/**
 * THE GAG CARD: the show's freeze-frame name card (shared/pixel/ui.ts nameCard's text block and act4 lay.ts blipCard's
 * stat chip, in the same timeline: k 3 the plate and the name cut in, 4 the rule, 5+ the tagline types 2 chars a frame,
 * 16+ the stat chip types on), text only and placed per shot in the room's empty corner, so it never covers the face it
 * names. `lines` / `stat` are pre-wrapped rows. align 'right' puts x at the block's right edge.
 */
export interface GagCard { x: number; y: number; name: string; lines: string[]; stat: string[]; accent: number; align?: 'left' | 'right'; }
export const gagCardW = (c: GagCard) => Math.max(bigTextWidth(c.name) + 8, ...c.lines.map((l) => textWidth(l) + 4), 60);
export const drawGagCard = (b: Buf, k: number, c: GagCard) => {
  if (k < 3) return;
  const W = gagCardW(c);
  const x = c.align === 'right' ? c.x - W : c.x, y = c.y;
  const plateH = BIG_CAP + 16 + c.lines.length * 10;
  rect(x - 5, y - 5, W + 10, plateH, b.ink(PAL.N0));
  rect(x - 5, y - 5, W + 10, 1, b.ink(c.accent));
  bigText(b, c.name, x, y, c.accent, {shadow: PAL.N1, deep: true});
  if (k >= 4) rect(x, y + BIG_CAP + 3, bigTextWidth(c.name) + 8, 2, b.ink(c.accent));
  if (k >= 5) {
    let left = (k - 5) * 2;
    c.lines.forEach((l, i) => { text(b, l.slice(0, Math.max(0, left)), x, y + BIG_CAP + 9 + i * 10, PAL.P1, {shadow: PAL.N1}); left -= l.length; });
  }
  if (k >= 16 && c.stat.length) {
    const sw = Math.max(...c.stat.map((s) => textWidth(s)));
    const sx = c.align === 'right' ? x + W - sw : x, sy = y - 5 + plateH + 3;
    const sh = 3 + c.stat.length * 10;
    rect(sx - 5, sy, sw + 10, sh, b.ink(PAL.N0));
    rect(sx - 5, sy, sw + 10, 1, b.ink(c.accent));
    let left = (k - 16) * 2;
    c.stat.forEach((s, i) => { text(b, s.slice(0, Math.max(0, left)), sx, sy + 3 + i * 10, PAL.N8, {shadow: PAL.N1}); left -= s.length; });
  }
};
/** a name plate (names only): the pipeline's plate look, typed on, one line */
export const namePlate = (b: Buf, k: number, name: string, x: number, y: number, accent: number) => {
  if (k < 0) return;
  const w = textWidth(name) + 16, full = 16;
  const open = Math.min(1, (k + 1) / 3), hh = Math.max(2, Math.round(full * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, y, w, hh, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(accent));
  if (open < 1) return;
  text(b, name.slice(0, Math.max(0, Math.floor((k - 2) * 3))), x + 8, y + 5, accent);
};
