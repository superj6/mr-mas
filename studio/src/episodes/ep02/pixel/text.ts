// MR. MAS — Ep2 v1 pixel pipeline (a copy of the Ep1 v3 pipeline, studio/src/episodes/ep01/pixel/, which stays locked): TEXT. The review overlay face (otext), and default drawings of a shot's in-world
// text (the lock's texts and posts) for stand-ins and for layouts that don't place their own (drawTexts). In-world text
// is part of the picture (name plates, UI, toasts, posts, signs); rails are the host's (the band). Layouts that have
// their own plate or post art should draw it and not call drawTexts for that kind.
import {Buf, rect} from '../../../shared/pixel/px';
import {PAL} from '../../../shared/pixel/palette';
import {pt, pw, pwrap, bpt, bpw, plain, RH, ACCENT, toast, postCard} from '../../ep01/act4/animatic/lay';
import type {PxShot, PxText} from './types';

// ------------------------------------------------------------------ overlay text (the 7 px face at an integer scale)
// A copy of act4/animatic/frame.ts otext (that module pulls the v3 lock in), unchanged so the review frame of the
// Act Four port is pixel-identical to frame5's.
const scratch = new Buf(1400, 12, 0);
const TRANSP = -1;
export const otext = (out: Buf, s: string, x: number, y: number, sc: number, col: number, o: {italic?: boolean; shadow?: number; maxW?: number} = {}) => {
  const w = Math.min(scratch.w - 2, pw(s) + 2);
  scratch.c.fill(TRANSP);
  pt(scratch, s, 0, 1, 1);
  const lean = (j: number) => (o.italic ? Math.round((8 - j) * sc * 0.28) : 0);
  const paint = (dx: number, dy: number, c: number) => {
    for (let j = 0; j < 10; j++) for (let i = 0; i < w; i++) {
      if (scratch.c[j * scratch.w + i] !== 1) continue;
      const X = x + dx + i * sc + lean(j), Y = y + dy + (j - 1) * sc;
      if (o.maxW && i * sc > o.maxW) continue;
      rect(X, Y, sc, sc, (px, py) => { if (px >= 0 && py >= 0 && px < out.w && py < out.h) out.c[py * out.w + px] = c; });
    }
  };
  if (o.shadow !== undefined) paint(Math.max(1, sc >> 1), Math.max(1, sc >> 1), o.shadow);
  paint(0, 0, col);
  return pw(s) * sc;
};
export const owrap = (s: string, maxPx: number, sc: number) => pwrap(s, Math.floor(maxPx / sc));
/** 0xRRGGBB -> RGBA bytes (a canvas ImageData) */
export const toRGBA = (b: Buf, data: Uint8ClampedArray) => {
  for (let i = 0; i < b.c.length; i++) { const v = b.c[i]; data[i * 4] = (v >> 16) & 255; data[i * 4 + 1] = (v >> 8) & 255; data[i * 4 + 2] = v & 255; data[i * 4 + 3] = 255; }
};

// ------------------------------------------------------------------ default in-world text
const typed = (s: string, k: number, rate = 3) => s.slice(0, Math.max(0, Math.floor(k * rate)));
const accentOf = (sh: PxShot, text: string) => {
  const up = text.toUpperCase();
  const who = sh.chars.map((c) => c.toUpperCase()).find((w) => up.startsWith(w));
  return (who && ACCENT[who]) || PAL.C6;
};
/** a name plate (lower left, typed on): 'NAME · LINE · LINE' */
export const drawPlate = (b: Buf, t: PxText, k: number, x: number, y: number, accent: number) => {
  if (k < 0) return;
  const [name, ...rest] = plain(t.text).split(' · ');
  const line = rest.join(' · ');
  const w = Math.max(pw(name), pw(line)) + 16, full = line ? 26 : 16;
  const open = Math.min(1, (k + 1) / 3), hh = Math.max(2, Math.round(full * open));
  rect(x - 1, y - 1, w + 2, hh + 2, b.ink(PAL.N0)); rect(x, y, w, hh, b.ink(PAL.N1)); rect(x, y, w, 1, b.ink(accent));
  if (open < 1) return;
  pt(b, typed(name, k - 2), x + 8, y + 5, accent);
  if (line) pt(b, typed(line, k - 5), x + 8, y + 15, PAL.P1);
};
/** a title card over the room (centered, the display face) */
export const drawCard = (b: Buf, t: PxText, k: number) => {
  if (k < 0) return;
  const lines = plain(t.text).split(/\s*\n\s*/).flatMap((l) => (bpw(l) > 420 ? pwrap(l, 420) : [l]));
  const h = lines.length * 18 + 16, y0 = Math.round(RH / 2 - h / 2);
  rect(0, y0, 480, h, b.ink(PAL.N0));
  lines.forEach((l, i) => { const big = bpw(l) <= 420; if (big) bpt(b, l, Math.round(240 - bpw(l) / 2), y0 + 8 + i * 18, PAL.P2); else pt(b, l, Math.round(240 - pw(l) / 2), y0 + 10 + i * 18, PAL.P2); });
};
/** a small tag (labels, signs, stamps, clocks): stacked from the top left */
export const drawTag = (b: Buf, text: string, x: number, y: number, col: number, bg = PAL.N1) => {
  const s = plain(text), w = pw(s) + 10;
  rect(x - 1, y - 1, w + 2, 13, b.ink(PAL.N0)); rect(x, y, w, 11, b.ink(bg)); pt(b, s, x + 5, y + 2, col);
  return w;
};
/** an on-screen button */
export const drawButton = (b: Buf, text: string, cx: number, y: number) => {
  const s = plain(text), w = pw(s) + 16;
  const x = Math.round(cx - w / 2);
  rect(x - 1, y - 1, w + 2, 17, b.ink(PAL.N0)); rect(x, y, w, 15, b.ink(PAL.C4)); rect(x, y, w, 1, b.ink(PAL.C7));
  pt(b, s, x + 8, y + 4, PAL.N0);
};
/**
 * Draw the shot's in-world texts (and posts) at k with the default look. `only` / `except` filter by kind. Returns
 * the kinds it drew. Layout order: plates lower left, labels / signs / stamps / clocks top left, UI low centre,
 * toasts above the UI, posts right, cards centred, tickers along the room's foot. Nothing goes below row 180, where
 * the host types Mas's V.O.
 */
export const drawTexts = (b: Buf, sh: PxShot, k: number, o: {only?: string[]; except?: string[]} = {}): string[] => {
  const want = (kind: string) => (!o.only || o.only.includes(kind)) && !(o.except ?? []).includes(kind);
  const on = sh.texts.filter((t) => k >= t.s && k < t.e && want(t.kind));
  const drew = new Set<string>();
  // everything stays above row 180: rows 182-203 are the V.O. line's (pov-and-framing §5.2)
  let tagY = 10, plateY = RH - 60, uiY = RH - 46, toastY = RH - 74;
  for (const t of on) {
    const kk = k - t.s;
    drew.add(t.kind);
    if (t.kind === 'plate') { drawPlate(b, t, kk, 14, plateY, accentOf(sh, t.text)); plateY -= 34; continue; }
    if (t.kind === 'card') { drawCard(b, t, kk); continue; }
    if (t.kind === 'ui') { drawButton(b, t.text, 240, uiY); uiY -= 20; toastY = Math.min(toastY, uiY - 26); continue; }
    if (t.kind === 'toast') { toast(b, Math.round(240 - (pw(plain(t.text)) + 30) / 2), toastY, t.text, kk); toastY -= 28; continue; }
    if (t.kind === 'ticker') {
      const s = `${plain(t.text)}   ·   `, w = pw(s), off = (kk * 2) % Math.max(1, w);
      rect(0, RH - 13, 480, 13, b.ink(PAL.N0));
      for (let x = -off; x < 480; x += w) pt(b, s, x, RH - 10, PAL.W7);
      continue;
    }
    const col = t.kind === 'stamp' ? PAL.R3 : t.kind === 'sign' ? PAL.W7 : t.kind === 'clock' ? PAL.C7 : PAL.P1;
    drawTag(b, t.text, 12, tagY, col, t.kind === 'stamp' ? PAL.R0 : PAL.N1);
    tagY += 16;
  }
  if (want('post')) {
    let py = 12;
    for (const l of sh.lines.filter((x) => x.kind === 'post' && k >= x.s && k < x.e)) {
      postCard(b, 300, py, 168, `@${l.who.toLowerCase()}`, plain(l.text), k - l.s, {noTag: true});
      py += 20 + pwrap(plain(l.text), 156).length * 10 + 8;
      drew.add('post');
    }
  }
  return [...drew];
};
