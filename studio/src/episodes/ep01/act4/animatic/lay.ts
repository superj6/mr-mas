// MR. MAS — Ep1 Act Four · THE EDITOR's animatic v2: the layout kit (owned by THE EDITOR).
// Layout scaffolding for the act animatic (a timing tool, never show art): the portrait windows and their painters
// (the shared cast modules), the show's in-picture dialogue box and V.O. line, stand-ins for kits that are not built
// yet (post-ui pop-ups, the cards kit's rail and quote cards), labelled boxes for assets nobody has built, and a
// held-frame cache so a held room behind a window is drawn once per shot, not once per frame.
import {Buf, rect, clamp} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {text, textWidth, bigText, bigTextWidth, BIG_CAP} from '../../../../shared/pixel/font';
import {portraitWindow, dialogueBox, nameCard} from '../../../../shared/pixel/ui';
import {applyPalette} from '../../../../shared/pixel/palettes';
import {blitImg} from '../../../../shared/pixel/figure';
import type {Viseme} from '../../../../shared/pixel/cast/talk';
import {marioMouth} from '../../../../shared/pixel/cast/talk';
import {drawMasPortrait} from '../../../../shared/pixel/cast/mas';
import {drawMasLookDown} from '../../../../shared/pixel/cast/swaps-act4';
import {drawNelehPortrait} from '../../../../shared/pixel/cast/neleh';
import {drawMadaPortrait} from '../../../../shared/pixel/cast/mada';
import {drawRimaSpeakPortrait} from '../../../../shared/pixel/cast/rima-speak';
import {drawAlyiWindow, alyiSpeakPortrait} from '../../../../shared/pixel/cast/alyi-speak';
import {drawTtemmePortrait} from '../../../../shared/pixel/cast/ttemme';
import {drawTasyaSpeakPortrait} from '../../../../shared/pixel/cast/tasya-speak';
import {drawAdelinaPortrait} from '../../../../shared/pixel/cast/adelina';
import {drawMarioPortrait} from '../../../../shared/pixel/cast/mario';
import {drawTerbPortrait} from '../../../../shared/pixel/cast/terb';
import {gergGlow} from '../../../../shared/pixel/cast/gerg-speak';
import {drawQuietVotePortrait} from '../../../../shared/pixel/cast/the-quiet-vote';
import {drawOrb} from '../../../../shared/pixel/cast/orb-medium';
import {callToast} from '../../../../shared/pixel/kits/callgrid';
import type {LineV2, ShotV2} from './data-v2';

export const RH = 203; // the room area; rows 203-269 are the rail band
export const WL: [number, number] = [12, 24]; // Mas's window, LEFT
export const WR: [number, number] = [356, 24]; // everyone else, RIGHT
export const PW = 112, PH = 136;

// ------------------------------------------------------------------ text: the 7px face + the glyphs it lacks
// The engine font has no ' & % @ ~ … ∞ — [ ] #. The animatic draws them here (engine owner: add them to font.ts).
const XG: Record<string, string[]> = {
  "'": ['#', '#', '.', '.', '.', '.', '.'],
  '’': ['#', '#', '.', '.', '.', '.', '.'],
  '‘': ['#', '#', '.', '.', '.', '.', '.'],
  '&': ['.##..', '#..#.', '.##..', '.#.#.', '#..##', '#..#.', '.##.#'],
  '%': ['##..#', '##.#.', '...#.', '..#..', '.#...', '.#.##', '#..##'],
  '@': ['.###.', '#...#', '#.###', '#.#.#', '#.###', '#....', '.###.'],
  '~': ['......', '......', '.##..#', '#..##.', '......', '......', '......'],
  '…': ['.....', '.....', '.....', '.....', '.....', '.....', '#.#.#'],
  '∞': ['.......', '.......', '.##.##.', '#..#..#', '.##.##.', '.......', '.......'],
  '—': ['......', '......', '......', '######', '......', '......', '......'],
  '–': ['....', '....', '....', '####', '....', '....', '....'],
  '[': ['##', '#.', '#.', '#.', '#.', '#.', '##'],
  ']': ['##', '.#', '.#', '.#', '.#', '.#', '##'],
  '#': ['.#.#.', '#####', '.#.#.', '.#.#.', '#####', '.#.#.', '.....'],
  '“': ['#.#', '#.#', '...', '...', '...', '...', '...'],
  '”': ['#.#', '#.#', '...', '...', '...', '...', '...'],
  '"': ['#.#', '#.#', '...', '...', '...', '...', '...'],
  '*': ['.....', '#.#.#', '.###.', '#####', '.###.', '#.#.#', '.....'],
  '✓': ['.....', '....#', '...#.', '#.#..', '.#...', '.....', '.....'],
  '→': ['.....', '...#.', '....#', '#####', '....#', '...#.', '.....'],
  '(': ['.#', '#.', '#.', '#.', '#.', '#.', '.#'],
  ')': ['#.', '.#', '.#', '.#', '.#', '.#', '#.'],
};
const cw = (ch: string) => (ch === ' ' ? 3 : XG[ch] ? XG[ch][0].length : textWidth(ch));
export const pw = (s: string) => { let w = 0; for (const ch of s) w += cw(ch) + 1; return Math.max(0, w - 1); };
/** 7px text with the extra glyphs */
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
/** the engine's own text() for strings it can draw fully; used where the show UI would (dialogue boxes) */
export const plain = (s: string) => s.replace(/[…]/g, '...').replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/—/g, '-').replace(/–/g, '-');

// ------------------------------------------------------------------ the held-frame cache (per state key)
const CACHE = new Map<string, Buf>();
/** draw once per key into a buffer the size of `b`, then copy (a held room behind a window, a held plate) */
export const held = (b: Buf, key: string, draw: (bb: Buf) => void) => {
  let c = CACHE.get(key);
  if (!c) {
    c = new Buf(b.w, b.h, PAL.N0);
    draw(c);
    CACHE.set(key, c);
    if (CACHE.size > 48) CACHE.delete(CACHE.keys().next().value as string);
  }
  b.c.set(c.c);
};

// ------------------------------------------------------------------ light steps (lighting notes step the ROOM down)
export const dimRect = (b: Buf, x: number, y: number, w: number, h: number, k: number) => {
  if (k <= 0) return;
  for (let j = Math.max(0, y); j < Math.min(b.h, y + h); j++) for (let i = Math.max(0, x); i < Math.min(b.w, x + w); i++) b.set(i, j, stepColor(b.get(i, j), -k));
};
export const dimRoom = (b: Buf, k: number) => dimRect(b, 0, 0, 480, RH, k);
/** the fallaway: the room steps down in held steps from k0 (one rung a beat, to `to`) */
export const fallaway = (b: Buf, k: number, to = 3, k0 = 0, every = 8) => dimRoom(b, clamp(Math.floor((k - k0) / every) + 1, 0, to));

// ------------------------------------------------------------------ mouths from the recorded cues
export const lineAt = (sh: ShotV2, k: number, who: string): LineV2 | null => {
  for (const l of sh.lines) if (l.who === who && l.kind !== 'post' && k >= l.s && k < l.e) return l;
  return null;
};
export const mouthOf = (sh: ShotV2, k: number, who: string): Viseme => {
  const l = lineAt(sh, k, who);
  if (!l || !l.lip) return 'rest';
  let m: Viseme = 'rest';
  for (const [fr, shape] of l.mouth) { if (k - l.s >= fr) m = shape as Viseme; else break; }
  if (!l.mouth.length) m = Math.floor((k - l.s) / 3) % 2 ? 'A' : 'E';
  return m;
};
export const speaking = (sh: ShotV2, k: number, who: string) => lineAt(sh, k, who) !== null;
export const roomMouth = (v: Viseme): 'rest' | 'open' => (v === 'rest' || v === 'smile' || v === 'M' ? 'rest' : 'open');

// ------------------------------------------------------------------ portraits
export interface PS { mouth?: Viseme; look?: -1 | 0 | 1; lid?: 0 | 1 | 2; f: number; x?: Record<string, unknown>; }
export const ACCENT: Record<string, number> = {MAS: PAL.C7, NELEH: PAL.W7, MADA: PAL.G6, RIMA: PAL.P2, ALYI: PAL.W5, TTEMME: PAL.U5, TASYA: PAL.N8,
  ADELINA: PAL.W5, MARIO: PAL.F6, TERB: PAL.R3, GERG: PAL.L3, ORB: PAL.C7, QV: PAL.N6};
const NAMES: Record<string, string> = {MAS: 'MAS MANALT', NELEH: 'NELEH', MADA: 'MADA', RIMA: 'RIMA TAMURI', ALYI: 'ALYI', TTEMME: 'TTEMME', TASYA: 'TASYA',
  ADELINA: 'ADELINA', MARIO: 'MARIO', TERB: 'TERB', GERG: 'GERG', ORB: 'THE ORB', QV: 'THE QUIET VOTE'};
const blink = (f: number, seed: number): 0 | 1 | 2 => { const p = (f + seed * 37) % 97; return p === 0 || p === 2 ? 1 : p === 1 ? 2 : 0; };

/** the Orb in a portrait window: no Orb portrait is built yet (cast.orb.portrait NEW): orb-medium's drawOrb at r 34 */
const orbWindow = (b: Buf, x: number, y: number, look: [number, number], ap: number) => {
  rect(x, y, PW, PH, b.ink(PAL.N0));
  for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) {
    const d = Math.hypot(i - 34, j - 72) / 96;
    if (d < 0.35) b.set(x + i, y + j, PAL.C0); else if (d < 0.7 && ((i + j) & 1) === 0) b.set(x + i, y + j, PAL.N1);
  }
  drawOrb(b, x + 58, y + 64, 34, {look, aperture: ap});
};

export const paintPortrait = (b: Buf, who: string, x: number, y: number, s: PS) => {
  const m = s.mouth ?? 'rest', f = s.f, X = s.x ?? {};
  const lid = s.lid ?? blink(f, who.length);
  switch (who) {
    case 'MAS':
      if (X.down) drawMasLookDown(b, x, y, {mouth: m, brow: 0, light: 'monitor'});
      else drawMasPortrait(b, x, y, {mouth: m, lid: 0, look: s.look ?? -1, brow: 0, light: (X.light as 'monitor' | 'warm') ?? 'monitor', head: (X.head as '34' | 'front') ?? '34'});
      break; // adult Mas doesn't blink
    case 'NELEH': drawNelehPortrait(b, x, y, {mouth: m, lid, look: s.look ?? -1, brow: (X.brow as 'level') ?? 'level', gaze: X.gaze as 'up' | 'down' | undefined}, {orbit: X.orbit === null ? null : ((X.orbit as number) ?? f)}); break;
    case 'MADA': drawMadaPortrait(b, x, y, {mouth: m, lid, look: s.look ?? 0, nod: (X.nod as 0 | 1 | 2) ?? 0}, {spin: X.spin === null ? null : ((X.spin as number) ?? f), stopped: !!X.stopped}); break;
    case 'RIMA': drawRimaSpeakPortrait(b, x, y, {mouth: m, lid, brow: 'level', hand: (X.hand as 'none') ?? 'none'}, {spot: (X.spot as 'on' | 'dark') ?? 'on'}); break;
    case 'ALYI':
      if (X.plain) { // his own speaking portrait (the all-hands doorway), not the reflection window
        rect(x, y, PW, PH, b.ink(PAL.N1));
        const clip = (px: number, py: number) => px >= x && py >= y && px < x + PW && py < y + PH;
        blitImg(b, alyiSpeakPortrait({mouth: m, eyes: 'open', t: f}), x + ((X.dx as number) ?? 0), y, {clip});
      } else drawAlyiWindow(b, x, y, PW, PH, {mouth: m, eyes: 'open', t: f}, {flicker: (X.flicker as 'there' | 'gone') ?? 'there', dx: (X.dx as number) ?? 0});
      break;
    case 'TTEMME': drawTtemmePortrait(b, x, y, {mouth: m, lid, look: 0, brow: (X.brow as 'hype') ?? 'hype', gaze: (X.gaze as 'cam' | 'sand') ?? 'cam'}, {sand: (X.sand as number) ?? 0, stream: true, chat: f, f}); break;
    case 'TASYA': drawTasyaSpeakPortrait(b, x, y, {mouth: m, lid, brow: 'warm', arms: (X.arms as 'ring' | 'clasp') ?? 'ring', jangle: (Math.floor(f / 4) % 2) as 0 | 1}); break;
    case 'ADELINA': drawAdelinaPortrait(b, x, y, {mouth: m, lid, look: -1, brow: (X.brow as 'brisk') ?? 'brisk', phone: (X.phone as 'none' | 'ear') ?? 'ear', throne: X.throne !== false}); break;
    case 'MARIO': drawMarioPortrait(b, x, y, {mouth: marioMouth(m), blink: lid, brow: (X.brow as 0 | 1) ?? 0, finger: (X.finger as 0 | 1 | 2) ?? 0, nod: 0}); break;
    case 'TERB': drawTerbPortrait(b, x, y, {mouth: m, lid, look: (s.look ?? -1) as -1 | 0 | 1, brow: (X.brow as 'level' | 'ah') ?? 'level', helmet: X.helmet !== false}, {f}); break;
    case 'GERG': {
      rect(x, y, PW, PH, b.ink(PAL.N1));
      const clip = (px: number, py: number) => px >= x && py >= y && px < x + PW && py < y + PH;
      blitImg(b, gergGlow({mouth: m, lid: (X.lid as 0 | 1 | 2) ?? 1, look: (s.look ?? 0) as -1 | 0 | 1}), x, y, {clip});
      break;
    }
    case 'QV': drawQuietVotePortrait(b, x, y, PW, PH); break;
    case 'ORB': orbWindow(b, x, y, (X.look as [number, number]) ?? [-0.7, 0.1], (X.aperture as number) ?? 0.55); break;
    default: box(b, x, y, PW, PH, who);
  }
};

/** a portrait window at L or R; opens in 3 held steps from k0 (never a smooth scale) */
export const win = (b: Buf, side: 'L' | 'R', who: string, k: number, s: PS, o: {k0?: number; open?: boolean; plate?: boolean; closeAt?: number} = {}) => {
  const [x, y] = side === 'L' ? WL : WR;
  const k0 = o.k0 ?? -99;
  if (k < k0) return;
  let open = o.open === false ? 1 : Math.min(1, (k - k0 + 1) / 3);
  if (o.closeAt !== undefined && k >= o.closeAt) open = Math.max(0, 1 - (k - o.closeAt + 1) / 3);
  if (open <= 0) return;
  // a non-Mas portrait in the LEFT window is flipped to face the right (the cast's rule: flip a portrait to put it on
  // the other side of the frame; its key light flips with it). Mas is never flipped.
  const flip = side === 'L' && who !== 'MAS';
  portraitWindow(b, x, y, PW, PH, {open, name: o.plate === false ? undefined : NAMES[who] ?? who, accent: ACCENT[who] ?? PAL.C7,
    content: (bb, xx, yy) => {
      if (!flip) { paintPortrait(bb, who, xx, yy, s); return; }
      const t = new Buf(PW, PH, PAL.N1);
      paintPortrait(t, who, 0, 0, s);
      for (let j = 0; j < PH; j++) for (let i = 0; i < PW; i++) bb.set(xx + i, yy + j, t.get(PW - 1 - i, j));
    }});
};
/** an EMPTY window (Alyi has stepped out of his own window): the frame and black inside */
export const emptyWin = (b: Buf, side: 'L' | 'R', paint?: (b: Buf, x: number, y: number) => void) => {
  const [x, y] = side === 'L' ? WL : WR;
  portraitWindow(b, x, y, PW, PH, {open: 1, content: (bb, xx, yy) => { rect(xx, yy, PW, PH, bb.ink(PAL.N0)); paint?.(bb, xx, yy); }});
};

// ------------------------------------------------------------------ the show's in-picture dialogue box + the V.O. line
/** the lines spoken off screen (the script's O.S.) */
export const OS = new Set(['a4-29-07', 'a4-30-04', 'a4-30-07']);
/** the speaking line's dialogue box, top centre, typed 1.25 chars a frame; tail toward the speaker's window */
export const talkBox = (b: Buf, sh: ShotV2, k: number, o: {x?: number; y?: number; w?: number; only?: string[]} = {}) => {
  for (const l of sh.lines) {
    if (l.kind !== 'dialogue') continue;
    if (o.only && !o.only.includes(l.id)) continue;
    if (k < l.s || k >= l.e + 10) continue;
    const who = l.mode === 'speaker' ? '' : OS.has(l.id) ? `${l.who} (O.S.)` : l.who;
    const str = plain(who ? `${who}: ${l.text}` : l.text);
    const shown = Math.floor((k - l.s) * 1.25) + (who ? who.length + 2 : 0);
    const tail = (l.side === 'left' || l.side === 'right' ? l.side : 'none') as 'left' | 'right' | 'none';
    dialogueBox(b, o.x ?? 132, o.y ?? 8, o.w ?? 216, str, Math.min(str.length, shown), PAL.P1, k, tail);
  }
};
/** V.O. on screen (pov-and-framing 5.2): one line, x 12, baseline y 198, his cyan one step down, 1 px N0 shadow,
 *  typed at 0.5 chars a frame; no frame, no quotation marks. Held a beat past the voice. */
export const voLine = (b: Buf, sh: ShotV2, k: number) => {
  for (const l of sh.lines) {
    if (l.kind !== 'vo' || k < l.s || k >= l.e + 15) continue;
    const n = clamp(Math.floor((k - l.s) * 0.5), 0, l.text.length);
    pt(b, l.text.slice(0, n), 12, 191, PAL.C6, {shadow: PAL.N0});
  }
};

// ------------------------------------------------------------------ stand-ins for kits not built (post-ui, cards)
/** a post pop-up in source casing (kit.post-ui is NEW: a stand-in card), typed in 1 beat */
export const postCard = (b: Buf, x: number, y: number, w: number, who: string, s: string, k: number, o: {col?: number; bg?: number; ts?: string; noTag?: boolean} = {}) => {
  if (k < 0) return;
  const lines = pwrap(s, w - 12);
  const h = 20 + lines.length * 10 + (o.ts ? 10 : 0);
  const open = Math.min(1, (k + 1) / 3);
  const hh = Math.max(3, Math.round(h * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0));
  rect(x, y, w, hh, b.ink(o.bg ?? PAL.N2));
  rect(x, y, w, 1, b.ink(o.col ?? PAL.C6));
  if (open < 1) return;
  rect(x + 4, y + 4, 8, 8, b.ink(o.col ?? PAL.C6));
  pt(b, who, x + 16, y + 5, PAL.N7);
  const typed = Math.floor(clamp((k - 2) / 13, 0, 1) * s.length);
  let left = typed;
  lines.forEach((l, i) => { pt(b, l.slice(0, Math.max(0, left)), x + 6, y + 17 + i * 10, o.col ?? PAL.P1); left -= l.length + 1; });
  if (o.ts) pt(b, o.ts, x + w - 6 - pw(o.ts), y + h - 11, PAL.N5);
  if (!o.noTag) pt(b, 'post-ui', x + w - 4 - pw('post-ui'), y + 4, PAL.U3); // v4 passes noTag: a stand-in is never a label in the picture
};
export const toast = (b: Buf, x: number, y: number, s: string, k: number) => { if (k >= 0) callToast(b, x, y, plain(s), k); };

/** the 2-tone print of the frame behind a Blip card (the card's 1-beat freeze); keep() pixels stay live */
export const freezePrint = (b: Buf, keep?: (x: number, y: number) => boolean) => {
  const src = b.clone();
  applyPalette(b, '2TONE_FREEZE');
  if (keep) for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) if (keep(x, y)) b.set(x, y, src.get(x, y));
};
/** a Blip name card over the live (or frozen) frame: the engine's nameCard + the stat line (kit.cards is NEW) */
export const blipCard = (b: Buf, k: number, who: string, name: string, line: string, stat: string, s: PS, side: 'L' | 'R' = 'R') => {
  const [x, y] = side === 'L' ? WL : WR;
  nameCard(b, {x, y, name, line: plain(line), accent: ACCENT[who] ?? PAL.C7, k, textSide: side === 'L' ? 'right' : 'left',
    portrait: (bb, px, py) => paintPortrait(bb, who, px, py, s)});
  if (k >= 16) {
    const sw = pw(stat);
    const sx = side === 'L' ? x + PW + 10 : x - 10 - Math.max(sw, 60);
    rect(sx - 5, y + 58, sw + 10, 13, b.ink(PAL.N0));
    rect(sx - 5, y + 58, sw + 10, 1, b.ink(ACCENT[who] ?? PAL.C7));
    pt(b, stat.slice(0, Math.max(0, (k - 16) * 2)), sx, y + 61, PAL.N8);
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
export const actCard = (b: Buf, s: string) => {
  rect(0, 0, 480, 270, b.ink(PAL.N0));
  bpt(b, s, Math.round(240 - bpw(s) / 2), 128, PAL.P2);
};

// ------------------------------------------------------------------ the rail band (the cards kit's rail is NEW: placeholder chrome, the lock's text)
export const railBand = (b: Buf, rail: string | null, typed: number, side: 'MAS' | 'BOARD') => {
  rect(0, RH, 480, 270 - RH, b.ink(PAL.N0));
  rect(0, RH, 480, 1, b.ink(PAL.N3));
  if (rail) {
    const s = rail.slice(0, Math.max(0, typed));
    pwrap(s, 440).slice(0, 3).forEach((l, i) => pt(b, l, 12, RH + 12 + i * 11, PAL.P1, {shadow: PAL.N2}));
  }
  // the told-twice side label (animatic chrome: a dashed chip, bottom-right of the band)
  const lab = side === 'MAS' ? 'HIS SIDE' : "THE BOARD'S SIDE";
  const col = side === 'MAS' ? PAL.C6 : PAL.W6;
  const w = pw(lab) + 12, x = 480 - 10 - w, y = 270 - 20;
  for (let i = 0; i < w; i++) if ((i >> 1) % 2 === 0) { b.set(x + i, y, col); b.set(x + i, y + 13, col); }
  for (let j = 0; j < 14; j++) if ((j >> 1) % 2 === 0) { b.set(x, y + j, col); b.set(x + w - 1, y + j, col); }
  pt(b, lab, x + 6, y + 4, col);
};

// ------------------------------------------------------------------ placeholders (assets not built yet)
/** rose outline + label: an asset that does not exist yet (never show art) */
export const box = (b: Buf, x: number, y: number, w: number, h: number, label: string, o: {fill?: number | null; col?: number} = {}) => {
  const col = o.col ?? PAL.U4;
  if (o.fill !== null) rect(x, y, w, h, b.ink(o.fill ?? PAL.N1));
  for (let i = 0; i < w; i++) { if ((i >> 1) % 2 === 0) { b.set(x + i, y, col); b.set(x + i, y + h - 1, col); } }
  for (let j = 0; j < h; j++) { if ((j >> 1) % 2 === 0) { b.set(x, y + j, col); b.set(x + w - 1, y + j, col); } }
  const lines = pwrap(label, Math.max(20, w - 8));
  lines.slice(0, Math.max(1, Math.floor((h - 4) / 10))).forEach((l, i) => pt(b, l, x + 4, y + 4 + i * 10, PAL.U5, {shadow: PAL.N0}));
};

// ------------------------------------------------------------------ screens
/** [SCR]: a screen as an object in the world: a laptop bezel around the full-frame UI (the world's view) */
export const bezel = (b: Buf) => {
  const c = PAL.G1, e = PAL.G2;
  rect(0, 0, 480, 10, b.ink(c)); rect(0, 0, 12, RH, b.ink(c)); rect(468, 0, 12, RH, b.ink(c)); rect(0, 188, 480, RH - 188, b.ink(c));
  rect(12, 10, 456, 1, b.ink(e)); rect(12, 187, 456, 1, b.ink(e));
  rect(238, 3, 4, 4, b.ink(PAL.N0)); b.set(239, 4, PAL.C3);
  rect(0, 196, 480, 1, b.ink(PAL.G0));
};
/** copy a 480 x 203 UI buffer into the room area, optionally inside the [SCR] bezel (inset) */
export const putUI = (b: Buf, ui: Buf, scr: boolean) => {
  if (!scr) { for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, ui.get(x, y)); return; }
  // the bezel's opening is 456 x 177 at (12, 10): the UI sampled into it (nearest, whole-pixel crop, never scaled)
  for (let y = 0; y < 177; y++) for (let x = 0; x < 456; x++) b.set(12 + x, 10 + y, ui.get(12 + x, 13 + y));
  bezel(b);
};

void textWidth;
