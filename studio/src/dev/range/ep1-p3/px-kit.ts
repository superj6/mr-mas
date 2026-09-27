// MR. MAS - style-range prototype E1-P3 (1.D): the few pixel framing helpers this clip needs, COPIED (not imported) from
// the Act Four animatic (src/episodes/ep01/act4/animatic/framing.ts: soft, vignette, bust, drawBust; lay.ts: pt, pw,
// railBand), so this prototype never reaches into files another pass is editing. Same code, same pixels.
import {Buf, rect, bayer} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {text, textWidth} from '../../../shared/pixel/font';
import type {Img} from '../../../shared/pixel/figure';

export const W = 480;
export const RH = 203; // the room area; rows 203-269 are the rail band

// ------------------------------------------------------------------ soft focus (the pixel rack: hard ramp steps)
export const soft = (b: Buf, k: number) => {
  if (k <= 0) return;
  for (let i = 0; i < W * RH; i++) b.c[i] = stepColor(b.c[i], -k);
};
/** negative fill behind a bust: the room steps down around the body's lower half (background only) */
export const vignette = (b: Buf, cx: number, k = 2) => {
  for (let y = 100; y < RH; y++) for (let x = 0; x < W; x++) {
    const d = Math.abs(x - cx) / 140 - (y - 100) / 160;
    if (d < 0.9 && bayer(x, y) < (0.9 - d) * 1.4) b.c[y * W + x] = stepColor(b.c[y * W + x], -k);
  }
};

// ------------------------------------------------------------------ the frameless bust
const BUSTS = new WeakMap<Img, Map<string, Img>>();
/** `cap` (1..6) is the deepest falloff rung: 6 = the animatic's negative fill (the body sinks to black into a dark room);
 *  a lower cap keeps the same falloff shape, compressed, for a bust standing in a lit room (E1-P3, the landlord's daylight) */
/** `taper` (px in per row, 0 = the animatic's straight extrusion) narrows the extended rows toward the frame's edge in
 *  clean 1-px stair steps, carrying the edge pixel (the rim) along the new edge, so the body below the drawn portrait reads
 *  as arms hanging from the shoulders instead of a ruled slab (E1-P3: a dark bust on the pale vector room) */
export const bust = (img: Img, extend = 48, side = 34, cap = 6, taper = 0): Img => {
  let m = BUSTS.get(img);
  if (!m) { m = new Map(); BUSTS.set(img, m); }
  const key = `${extend}:${side}:${cap}:${taper}`;
  const hit = m.get(key);
  if (hit) return hit;
  const Wd = img.w, H = img.h + extend, c = new Int32Array(Wd * H).fill(-1);
  for (let y = 0; y < H; y++) for (let x = 0; x < Wd; x++) {
    const sy = Math.min(y, img.h - 1);
    let v = img.c[sy * Wd + x];
    if (v < 0) continue;
    if (y >= 88) {
      const sd = side + (y >= img.h ? Math.round((y - img.h) * 0.7) : 0);
      const dx = Math.min(x, Wd - 1 - x);
      const kSide = dx < sd / 4 ? 6 : dx < sd / 2 ? 3 : dx < (3 * sd) / 4 ? 2 : dx < sd ? 1 : 0;
      const kBot = y >= img.h + 30 ? 5 : y >= img.h + 18 ? 3 : y >= img.h + 6 ? 2 : y >= img.h - 12 ? 1 : 0;
      const k0 = Math.max(kSide * (y >= 96 ? 1 : 0), kBot);
      const k = cap >= 6 ? k0 : Math.ceil((k0 * cap) / 6);
      if (k) v = stepColor(v, -k);
    }
    c[y * Wd + x] = v;
  }
  if (taper > 0) {
    const last = (img.h - 1) * Wd;
    let lx = 0, rx = Wd - 1;
    while (lx < Wd && img.c[last + lx] < 0) lx++;
    while (rx > lx && img.c[last + rx] < 0) rx--;
    for (let y = img.h; y < H; y++) {
      const inset = Math.min(Math.floor((y - img.h + 1 / (2 * taper)) * taper), Math.floor((rx - lx) / 3));
      if (inset <= 0) continue;
      const o = y * Wd, eL = c[o + lx], eR = c[o + rx];
      for (let x = lx; x < lx + inset; x++) c[o + x] = -1;
      for (let x = rx - inset + 1; x <= rx; x++) c[o + x] = -1;
      if (eL >= 0) c[o + lx + inset] = eL;
      if (eR >= 0) c[o + rx - inset] = eR;
    }
  }
  const out = {w: Wd, h: H, c};
  m.set(key, out);
  return out;
};
export const MCU_X = {L: 100, R: 262};
/** the bust composed straight into the frame (third L/R + dx), eyes on the upper third; pixels also go to `mask`.
 *  `head` (E1-P3 pass 7, not in the animatic): the rows above `split` (the neck, between chin and collar) move on their
 *  own by (dx, dy) whole pixels, drawn over the body; the body starts a row early so a lifted head never opens a gap. */
export const drawBust = (b: Buf, img: Img, third: 'L' | 'R', dx = 0, y = 22, mask?: Uint8Array, cap = 6, taper = 0,
  head?: {split: number; dx: number; dy: number}) => {
  const bs = bust(img, 48, 34, cap, taper);
  const x = MCU_X[third] + dx;
  const moved = head && (head.dx || head.dy);
  const pass = (j0: number, j1: number, ox: number, oy: number) => {
    for (let j = j0; j < j1; j++) {
      const Y = y + j + oy;
      if (Y < 0 || Y >= RH) continue;
      for (let i = 0; i < bs.w; i++) {
        const v = bs.c[j * bs.w + i];
        if (v < 0) continue;
        const X = x + i + ox;
        if (X < 0 || X >= W) continue;
        b.c[Y * W + X] = v;
        if (mask) mask[Y * W + X] = 1;
      }
    }
  };
  if (!moved) { pass(0, bs.h, 0, 0); return; }
  pass(head!.split - 1, bs.h, 0, 0);
  pass(0, head!.split, head!.dx, head!.dy);
};

// ------------------------------------------------------------------ text with the extra glyphs the rail needs
const XG: Record<string, string[]> = {
  '~': ['......', '......', '.##..#', '#..##.', '......', '......', '......'],
  "'": ['#', '#', '.', '.', '.', '.', '.'],
};
const cw = (ch: string) => (ch === ' ' ? 3 : XG[ch] ? XG[ch][0].length : textWidth(ch));
export const pw = (s: string) => { let w = 0; for (const ch of s) w += cw(ch) + 1; return Math.max(0, w - 1); };
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
/** the rail band (rows 203-269): the rail's time and place, typed; the told-twice side chip bottom-right */
export const railBand = (b: Buf, rail: string | null, typed: number) => {
  rect(0, RH, 480, 270 - RH, b.ink(PAL.N0));
  rect(0, RH, 480, 1, b.ink(PAL.N3));
  if (rail) pt(b, rail.slice(0, Math.max(0, typed)), 12, RH + 12, PAL.P1, {shadow: PAL.N2});
  const lab = 'HIS SIDE', col = PAL.C6;
  const w = pw(lab) + 12, x = 480 - 10 - w, y = 270 - 20;
  for (let i = 0; i < w; i++) if ((i >> 1) % 2 === 0) { b.set(x + i, y, col); b.set(x + i, y + 13, col); }
  for (let j = 0; j < 14; j++) if ((j >> 1) % 2 === 0) { b.set(x, y + j, col); b.set(x + w - 1, y + j, col); }
  pt(b, lab, x + 6, y + 4, col);
};
