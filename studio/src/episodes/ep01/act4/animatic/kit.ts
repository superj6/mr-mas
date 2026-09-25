// MR. MAS — Ep1 Act Four · THE EDITOR's animatic: the pixel-side layout kit.
// Everything here is layout scaffolding for the act animatic (a timing tool), never show art:
//   * portrait windows for every speaking character (the shared cast modules), mouths driven by the recorded cues
//   * the rail band (placeholder chrome, real rail text), V.O. on screen (pov-and-framing 5.2), dialogue boxes
//   * PROXY framings: a nearest-neighbour crop of the real room wide stands in for the [M] / [2S] medium plates
//     and the [CU] drawing that are not built yet (the final show never scales a sprite; the animatic flags it)
//   * labelled boxes (rose outline) for assets that do not exist yet
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from '../../../../shared/pixel/font';
import {portraitWindow, dialogueBox, nameCard} from '../../../../shared/pixel/ui';
import {applyPalette} from '../../../../shared/pixel/palettes';
import {blitImg} from '../../../../shared/pixel/figure';
import type {Img} from '../../../../shared/pixel/figure';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {marioMouth} from '../../../../shared/pixel/cast/talk';
import {drawMasPortrait, masPortrait} from '../../../../shared/pixel/cast/mas';
import {drawNelehPortrait} from '../../../../shared/pixel/cast/neleh';
import {drawMadaPortrait} from '../../../../shared/pixel/cast/mada';
import {drawRimaSpeakPortrait} from '../../../../shared/pixel/cast/rima-speak';
import {drawAlyiWindow} from '../../../../shared/pixel/cast/alyi-speak';
import {drawTtemmePortrait} from '../../../../shared/pixel/cast/ttemme';
import {drawTasyaSpeakPortrait} from '../../../../shared/pixel/cast/tasya-speak';
import {drawAdelinaPortrait} from '../../../../shared/pixel/cast/adelina';
import {drawMarioPortrait} from '../../../../shared/pixel/cast/mario';
import {drawTerbPortrait} from '../../../../shared/pixel/cast/terb';
import {gergGlow} from '../../../../shared/pixel/cast/gerg-speak';
import {drawQuietVotePortrait} from '../../../../shared/pixel/cast/the-quiet-vote';
import {blitTo} from '../../../../shared/pixel/cast/kit';
// the Orb still lives in the cold-open builder's dev file (rooms-b.md: promote it to a shared cast file)
import {drawOrb} from '../../../../dev/mcoldopen/orb';
import type {ShotCue} from './data';

export const RH = 203; // the room area; rows 203-269 are the rail band
export const WL: [number, number] = [12, 24]; // Mas's window, LEFT
export const WR: [number, number] = [356, 24]; // everyone else, RIGHT
export const PW = 112, PH = 136;

// ------------------------------------------------------------------ text: the 7px face + the glyphs it lacks
// The engine font has no ' & % @ ~ … ∞ — [ ] #. The animatic draws them here (engine owner: add them to font.ts).
const XG: Record<string, string[]> = {
  "'": ['#', '#', '.', '.', '.', '.', '.'],
  '’': ['#', '#', '.', '.', '.', '.', '.'],
  '&': ['.##..', '#..#.', '.##..', '.#.#.', '#..##', '#..#.', '.##.#'],
  '%': ['##..#', '##.#.', '...#.', '..#..', '.#...', '.#.##', '#..##'],
  '@': ['.###.', '#...#', '#.###', '#.#.#', '#.###', '#....', '.###.'],
  '~': ['......', '......', '.##..#', '#..##.', '......', '......', '......'],
  '…': ['.....', '.....', '.....', '.....', '.....', '.....', '#.#.#'],
  '∞': ['.......', '.......', '.##.##.', '#..#..#', '.##.##.', '.......', '.......'],
  '—': ['......', '......', '......', '######', '......', '......', '......'],
  '[': ['##', '#.', '#.', '#.', '#.', '#.', '##'],
  ']': ['##', '.#', '.#', '.#', '.#', '.#', '##'],
  '#': ['.#.#.', '#####', '.#.#.', '.#.#.', '#####', '.#.#.', '.....'],
  '“': ['#.#', '#.#', '...', '...', '...', '...', '...'],
  '”': ['#.#', '#.#', '...', '...', '...', '...', '...'],
};
const cw = (ch: string) => (ch === ' ' ? 3 : XG[ch] ? XG[ch][0].length : textWidth(ch));
export const pw = (s: string) => { let w = 0; for (const ch of s) w += cw(ch) + 1; return Math.max(0, w - 1); };
/** 7px text with the extra glyphs; `sc` 2 draws the extras at 2x next to bigText (display size). */
export const pt = (b: Buf, s: string, x: number, y: number, col: number, o: {shadow?: number} = {}) => {
  const draw = (ox: number, oy: number, c: number) => {
    let cx = x + ox;
    for (const ch of s) {
      if (XG[ch]) XG[ch].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') b.set(cx + i, y + oy + j, c); });
      else if (ch !== ' ') text(b, ch, cx, y + oy, c);
      cx += cw(ch) + 1;
    }
  };
  if (o.shadow !== undefined) draw(1, 1, o.shadow);
  draw(0, 0, col);
};
export const pwrap = (s: string, maxW: number) => {
  const out: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) { const t = cur ? cur + ' ' + w : w; if (pw(t) > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur);
  return out;
};
/** display size (14px): bigText for what it has, the extras as 2x blocks */
const bw = (ch: string) => (ch === ' ' ? 6 : XG[ch] ? XG[ch][0].length * 2 : bigTextWidth(ch));
export const bpw = (s: string) => { let w = 0; for (const ch of s) w += bw(ch) + 2; return Math.max(0, w - 2); };
export const bpt = (b: Buf, s: string, x: number, y: number, col: number, o: {shadow?: number} = {}) => {
  let cx = x;
  for (const ch of s) {
    if (XG[ch]) XG[ch].forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') { if (o.shadow !== undefined) rect(cx + i * 2 + 1, y + j * 2 + 1, 2, 2, b.ink(o.shadow)); rect(cx + i * 2, y + j * 2, 2, 2, b.ink(col)); } });
    else if (ch !== ' ') bigText(b, ch, cx, y, col, {shadow: o.shadow});
    cx += bw(ch) + 2;
  }
};
export const bpwrap = (s: string, maxW: number) => {
  const out: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) { const t = cur ? cur + ' ' + w : w; if (bpw(t) > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur);
  return out;
};

// ------------------------------------------------------------------ the rail band (placeholder chrome; real text)
export const railBand = (b: Buf, rail: string | null, typed: number) => {
  rect(0, RH, 480, 270 - RH, b.ink(PAL.N0));
  rect(0, RH, 480, 1, b.ink(PAL.N3));
  if (!rail) return;
  const s = rail.slice(0, Math.max(0, typed));
  const lines = pwrap(s, 456);
  lines.slice(0, 3).forEach((l, i) => pt(b, l, 12, RH + 12 + i * 11, PAL.P1, {shadow: PAL.N2}));
};

// ------------------------------------------------------------------ V.O. on screen (pov-and-framing 5.2)
/** one line, left-aligned directly above the band (x 12, baseline 198), his cyan one step down, 1 px N0 shadow,
 *  typed at 0.5 characters a frame (the voice is the clock); no frame, no quotation marks */
export const voText = (b: Buf, s: string, k: number) => {
  if (k < 0) return;
  const n = clamp(Math.floor(k * 0.5), 0, s.length);
  pt(b, s.slice(0, n), 12, 191, PAL.C6, {shadow: PAL.N0});
};

// ------------------------------------------------------------------ mouths from the recorded cues
export const mouthAt = (sh: ShotCue, k: number, who: string): Viseme => {
  for (const l of sh.lines) {
    if (l.who !== who || k < l.s || k >= l.e + 2) continue;
    let m: Viseme = 'rest';
    for (const [fr, shape] of l.mouth) { if (k - l.s >= fr) m = shape as Viseme; else break; }
    if (!l.mouth.length) m = Math.floor((k - l.s) / 3) % 2 ? 'A' : 'E';
    return m;
  }
  return 'rest';
};
export const speaking = (sh: ShotCue, k: number, who: string) => sh.lines.some((l) => l.who === who && k >= l.s && k < l.e);
/** room-scale heads only open and close */
export const openMouth = (v: Viseme): 'rest' | 'open' => (v === 'rest' || v === 'smile' || v === 'M' ? 'rest' : 'open');

// ------------------------------------------------------------------ portraits
export interface PS { mouth?: Viseme; look?: -1 | 0 | 1; lid?: 0 | 1 | 2; f: number; x?: Record<string, unknown>; }
const ACCENT: Record<string, number> = {MAS: PAL.C7, NELEH: PAL.W7, MADA: PAL.G6, RIMA: PAL.P2, ALYI: PAL.W5, TTEMME: PAL.U5, TASYA: PAL.N8,
  ADELINA: PAL.W5, MARIO: PAL.F6, TERB: PAL.R3, GERG: PAL.L3, ORB: PAL.C7, QV: PAL.N6};
const NAMES: Record<string, string> = {MAS: 'MAS MANALT', NELEH: 'NELEH', MADA: 'MADA', RIMA: 'RIMA TAMURI', ALYI: 'ALYI', TTEMME: 'TTEMME', TASYA: 'TASYA',
  ADELINA: 'ADELINA', MARIO: 'MARIO', TERB: 'TERB', GERG: 'GERG', ORB: 'THE ORB', QV: 'THE QUIET VOTE'};
const blink = (f: number, seed: number): 0 | 1 | 2 => { const p = (f + seed * 37) % 97; return p === 0 || p === 2 ? 1 : p === 1 ? 2 : 0; };

export const paintPortrait = (b: Buf, who: string, x: number, y: number, s: PS) => {
  const m = s.mouth ?? 'rest', f = s.f, X = s.x ?? {};
  const lid = s.lid ?? blink(f, who.length);
  switch (who) {
    case 'MAS': drawMasPortrait(b, x, y, {mouth: m, lid: 0, look: s.look ?? -1, brow: 0, light: (X.light as 'monitor' | 'warm') ?? 'monitor'}); break; // adult Mas doesn't blink
    case 'NELEH': drawNelehPortrait(b, x, y, {mouth: m, lid, look: s.look ?? -1, brow: (X.brow as 'level') ?? 'level', gaze: X.gaze as 'up' | 'down' | undefined}, {orbit: (X.orbit as number) ?? f}); break;
    case 'MADA': drawMadaPortrait(b, x, y, {mouth: m, lid, look: s.look ?? 0, nod: (X.nod as 0 | 1 | 2) ?? 0}, {spin: (X.spin as number) ?? f, stopped: !!X.stopped}); break;
    case 'RIMA': drawRimaSpeakPortrait(b, x, y, {mouth: m, lid, brow: 'level', hand: (X.hand as 'none') ?? 'none'}, {spot: (X.spot as 'on' | 'dark') ?? 'on'}); break;
    case 'ALYI': drawAlyiWindow(b, x, y, PW, PH, {mouth: m, eyes: 'open', t: f}, {flicker: (X.flicker as 'there' | 'gone') ?? 'there'}); break;
    case 'TTEMME': drawTtemmePortrait(b, x, y, {mouth: m, lid, look: 0, brow: (X.brow as 'hype') ?? 'hype', gaze: (X.gaze as 'cam' | 'sand') ?? 'cam'}, {sand: (X.sand as number) ?? 0, stream: true, chat: f, f}); break;
    case 'TASYA': drawTasyaSpeakPortrait(b, x, y, {mouth: m, lid, brow: 'warm', arms: (X.arms as 'ring' | 'clasp') ?? 'ring', jangle: (Math.floor(f / 4) % 2) as 0 | 1}); break;
    case 'ADELINA': drawAdelinaPortrait(b, x, y, {mouth: m, lid, look: -1, brow: 'brisk', phone: (X.phone as 'none' | 'ear') ?? 'ear', throne: X.throne !== false}); break;
    case 'MARIO': drawMarioPortrait(b, x, y, {mouth: marioMouth(m), blink: lid, brow: (X.brow as 0 | 1) ?? 0, finger: (X.finger as 0 | 1 | 2) ?? 0, nod: 0}); break;
    case 'TERB': drawTerbPortrait(b, x, y, {mouth: m, lid, look: -1, brow: (X.brow as 'level' | 'ah') ?? 'level', helmet: X.helmet !== false}, {f}); break;
    case 'GERG': {
      rect(x, y, PW, PH, b.ink(PAL.N1));
      const clip = (px: number, py: number) => px >= x && py >= y && px < x + PW && py < y + PH;
      blitImg(b, gergGlow({mouth: m, lid: 1, look: s.look ?? 0}), x, y, {clip});
      break;
    }
    case 'QV': drawQuietVotePortrait(b, x, y, PW, PH); break;
    case 'ORB': {
      rect(x, y, PW, PH, b.ink(PAL.N0));
      for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) { const d = Math.hypot(i - 30, j - 70) / 90; if (d < 1 && ((i + j) & 1) === 0 && d > 0.5) b.set(x + i, y + j, PAL.N1); else if (d <= 0.5) b.set(x + i, y + j, d < 0.3 ? PAL.C0 : PAL.N1); }
      const look = (X.look as [number, number]) ?? [-0.7, 0.1];
      drawOrb(b, x + 58, y + 66, 34, {look, aperture: (X.aperture as number) ?? 0.55, monitor: -1});
      break;
    }
    default: box(b, x, y, PW, PH, who);
  }
};

/** a portrait window at L or R; opens in 3 held steps from k0 (never a smooth scale) */
export const win = (b: Buf, side: 'L' | 'R', who: string, k: number, s: PS, o: {open?: boolean; k0?: number; plate?: boolean; half?: boolean} = {}) => {
  const [x, y] = side === 'L' ? WL : WR;
  const k0 = o.k0 ?? 0;
  const open = o.open === false ? 1 : Math.min(1, (k - k0 + 1) / 3);
  if (k < k0) return;
  portraitWindow(b, x, y, PW, PH, {open, name: o.plate === false ? undefined : NAMES[who] ?? who, accent: ACCENT[who] ?? PAL.C7,
    content: (bb, xx, yy) => paintPortrait(bb, who, xx, yy, s)});
  if (o.half && open >= 1) {
    // the door frame cuts his window in half (27.07): the jamb and the dark hall beside it
    rect(x, y, 50, PH, b.ink(PAL.N0)); rect(x + 50, y, 4, PH, b.ink(PAL.D3)); rect(x + 54, y, 1, PH, b.ink(PAL.D4));
  }
};

/** the listener one family step down (TWO-PORTRAIT) */
export const dimRect = (b: Buf, x: number, y: number, w: number, h: number, k: number) => {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) b.set(i, j, stepColor(b.get(i, j), -k));
};
/** the room behind the windows, stepped down (the fallaway and the held room) */
export const dimRoom = (b: Buf, k: number) => dimRect(b, 0, 0, 480, RH, k);

// ------------------------------------------------------------------ PROXY framings
/** nearest crop of a drawn room (src, 480 x 203) at an integer scale, centred on (cx, cy), filling the room area */
export const proxyCrop = (b: Buf, src: Buf, cx: number, cy: number, s: number) => {
  const w = Math.floor(480 / s), h = Math.ceil(RH / s);
  const x0 = clamp(Math.round(cx - w / 2), 0, 480 - w), y0 = clamp(Math.round(cy - h / 2), 0, RH - h);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, src.get(x0 + Math.floor(x / s), y0 + Math.floor(y / s)));
};
/** [CU] proxy: Mas's portrait drawing at 2x, head filling the room area, in the left third */
export const masCU = (b: Buf, light: 'monitor' | 'warm', mouth: Viseme, bg: (b: Buf) => void) => {
  bg(b);
  const img: Img = masPortrait({mouth, lid: 0, look: -1, brow: 0, light});
  const ox = 40, oy = -30;
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const c = img.c[j * img.w + i];
    if (c < 0) continue;
    rect(ox + i * 2, oy + j * 2, 2, 2, (x, y) => { if (y >= 0 && y < RH) b.set(x, y, c); });
  }
};

// ------------------------------------------------------------------ placeholders (assets not built yet)
/** rose outline + label: an asset that does not exist yet (never show art) */
export const box = (b: Buf, x: number, y: number, w: number, h: number, label: string, o: {fill?: number | null; col?: number} = {}) => {
  const col = o.col ?? PAL.U4;
  if (o.fill !== null) rect(x, y, w, h, b.ink(o.fill ?? PAL.N1));
  for (let i = 0; i < w; i++) { if ((i >> 1) % 2 === 0) { b.set(x + i, y, col); b.set(x + i, y + h - 1, col); } }
  for (let j = 0; j < h; j++) { if ((j >> 1) % 2 === 0) { b.set(x, y + j, col); b.set(x + w - 1, y + j, col); } }
  const lines = pwrap(label, Math.max(20, w - 8));
  lines.slice(0, Math.max(1, Math.floor((h - 4) / 10))).forEach((l, i) => pt(b, l, x + 4, y + 4 + i * 10, PAL.U5));
};

// ------------------------------------------------------------------ in-picture dialogue (the show's box) and pop-ups
/** the speaking line's dialogue box, top centre, typed 1.25 chars a frame from the cue */
export const talk = (b: Buf, sh: ShotCue, k: number, o: {x?: number; y?: number; w?: number; tail?: 'left' | 'right' | 'none'; skip?: string[]} = {}) => {
  for (const l of sh.lines) {
    if (l.kind === 'vo' || (o.skip && o.skip.includes(l.who))) continue;
    if (k < l.s || k >= l.e + 12) continue;
    const who = l.kind === 'os' ? `${l.who} (O.S.)` : l.who;
    const str = `${who}: ${l.text}`.replace(/…/g, '...');
    const shown = Math.floor((k - l.s) * 1.25) + who.length + 2;
    dialogueBox(b, o.x ?? 132, o.y ?? 8, o.w ?? 216, str, Math.min(str.length, shown), PAL.P1, k, o.tail ?? 'none');
  }
};
/** a post pop-up in source casing (kit.post-ui is NEW: this is a stand-in card) */
export const postCard = (b: Buf, x: number, y: number, w: number, who: string, s: string, k: number, o: {col?: number; bg?: number; upside?: boolean} = {}) => {
  if (k < 0) return;
  const lines = pwrap(s, w - 12);
  const h = 18 + lines.length * 10;
  const open = Math.min(1, (k + 1) / 3);
  const hh = Math.max(3, Math.round(h * open));
  const tmp = o.upside ? new Buf(480, 270, 0) : b;
  const tx = o.upside ? 0 : x, ty = o.upside ? 0 : y;
  rect(tx - 1, ty - 1, w + 2, hh + 2, tmp.ink(PAL.N0));
  rect(tx, ty, w, hh, tmp.ink(o.bg ?? PAL.N2));
  rect(tx, ty, w, 1, tmp.ink(o.col ?? PAL.C6));
  if (open >= 1) {
    rect(tx + 4, ty + 4, 7, 7, tmp.ink(o.col ?? PAL.C6));
    pt(tmp, who, tx + 14, ty + 4, PAL.N7);
    lines.forEach((l, i) => pt(tmp, l, tx + 6, ty + 15 + i * 10, o.col ?? PAL.P1));
  }
  if (o.upside) for (let j = 0; j < hh + 2; j++) for (let i = 0; i < w + 2; i++) b.set(x + w - i, y + hh - j, tmp.get(i - 1, j - 1));
};
export const toast = (b: Buf, x: number, y: number, s: string, k: number) => {
  if (k < 0) return;
  const w = pw(s) + 12;
  const open = Math.min(1, (k + 1) / 3);
  rect(x - 1, y - 1, w + 2, 14, b.ink(PAL.N0));
  rect(x, y, Math.round(w * open), 12, b.ink(PAL.N3));
  if (open >= 1) pt(b, s, x + 6, y + 3, PAL.P1);
};

// ------------------------------------------------------------------ cards
export const freezePrint = (b: Buf, keep?: (x: number, y: number) => boolean) => {
  const src = b.clone();
  applyPalette(b, '2TONE_FREEZE');
  if (keep) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (keep(x, y)) b.set(x, y, src.get(x, y));
};
/** a Blip name card over the (live or frozen) frame: the engine's nameCard + the stat line */
export const blipCard = (b: Buf, k: number, who: string, name: string, line: string, stat: string, s: PS, side: 'L' | 'R' = 'R') => {
  const [x, y] = side === 'L' ? WL : WR;
  nameCard(b, {x, y, name, line: line.replace(/…/g, '...'), accent: ACCENT[who] ?? PAL.C7, k, textSide: side === 'L' ? 'right' : 'left',
    portrait: (bb, px, py) => paintPortrait(bb, who, px, py, s)});
  if (k >= 16) {
    const sx = side === 'L' ? x + PW + 10 : x - 10 - Math.max(pw(stat), 60);
    rect(sx - 5, y + 58, pw(stat) + 10, 13, b.ink(PAL.N0));
    pt(b, stat, sx, y + 61, PAL.N8);
  }
};
/** full-screen dated quote card (kit.cards is NEW): black, cream, real quotation marks, the date line */
export const quoteCard = (b: Buf, quote: string, attrib: string, k: number) => {
  rect(0, 0, 480, 270, b.ink(PAL.N0));
  const lines = bpwrap(quote, 420);
  const lh = BIG_CAP + 8;
  const y0 = Math.round(135 - (lines.length * lh + 22) / 2);
  lines.forEach((l, i) => bpt(b, l, Math.round(240 - bpw(l) / 2), y0 + i * lh, PAL.P2));
  if (k >= 8) pt(b, attrib, Math.round(240 - pw(attrib) / 2), y0 + lines.length * lh + 12, PAL.P0);
};
export const actOut = (b: Buf, s: string) => {
  rect(0, 0, 480, 270, b.ink(PAL.N0));
  bpt(b, s, Math.round(240 - bpw(s) / 2), 128, PAL.P2);
};

// ------------------------------------------------------------------ screens
/** [SCR]: a screen as an object in the world: the laptop's bezel over the full-frame UI (the world's view) */
export const bezel = (b: Buf) => {
  const c = PAL.G1, e = PAL.G2;
  rect(0, 0, 480, 10, b.ink(c)); rect(0, 0, 12, RH, b.ink(c)); rect(468, 0, 12, RH, b.ink(c)); rect(0, 188, 480, RH - 188, b.ink(c));
  rect(12, 10, 456, 1, b.ink(e)); rect(12, 187, 456, 1, b.ink(e));
  rect(238, 3, 4, 4, b.ink(PAL.N0)); b.set(239, 4, PAL.C3);
  rect(0, 196, 480, 1, b.ink(PAL.G0));
};
/** his phone / monitor, full-bleed ([POV]): a plain dark app surface */
export const screen = (b: Buf, col = PAL.N1) => { rect(0, 0, 480, RH, b.ink(col)); rect(0, 0, 480, 11, b.ink(PAL.N2)); };
/** a hand placeholder for the ECU kit (NEW) */
export const hand = (b: Buf, x: number, y: number, label: string) => box(b, x, y, 108, 34, `HAND (ECU kit NEW): ${label}`, {fill: PAL.S2, col: PAL.S5});

void blitTo; void bigText;
