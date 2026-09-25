// MR. MAS — shared pixel engine: text + UI helpers (adventure-game conventions).
// Portrait windows, dialogue boxes, name plates, the founders' NAME CARD, and the 1-bit system alert.
// All sizes are native px. Windows open in stepped frames (never a smooth scale).
import {Buf, rect, TRANSPARENT} from './px';
import {PAL} from './palette';
import {text, textWidth, wrap, LINE_H, bigText, bigTextWidth, BIG_CAP} from './font';

export interface UITheme {
  /** outer keyline */ ink: number;
  /** window face */ face: number;
  /** bevel light */ hi: number;
  /** bevel dark */ lo: number;
  /** text shadow */ shadow: number;
  /** body text */ body: number;
  /** secondary text */ dim: number;
}
export const THEME: UITheme = {ink: PAL.N0, face: PAL.N1, hi: PAL.N6, lo: PAL.N3, shadow: PAL.N0, body: PAL.N7, dim: PAL.N5};

/** Bevelled window: 1px keyline, light top/left, dark bottom/right, flat face. */
export const panel = (b: Buf, x: number, y: number, w: number, h: number, t: UITheme = THEME, face = true) => {
  rect(x - 3, y - 3, w + 6, h + 6, b.ink(t.ink));
  rect(x - 2, y - 2, w + 4, 1, b.ink(t.hi));
  rect(x - 2, y - 2, 1, h + 4, b.ink(t.hi));
  rect(x - 2, y + h + 1, w + 4, 1, b.ink(t.lo));
  rect(x + w + 1, y - 2, 1, h + 4, b.ink(t.lo));
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(t.ink));
  if (face) rect(x, y, w, h, b.ink(t.face));
};

/** Name plate: a tab with the name in `accent` and an accent underline. Returns its width. */
export const namePlate = (b: Buf, x: number, y: number, name: string, accent: number, t: UITheme = THEME) => {
  const nw = textWidth(name) + 10;
  rect(x - 1, y, nw + 2, 12, b.ink(t.ink));
  rect(x, y, nw, 11, b.ink(PAL.N2));
  rect(x, y + 10, nw, 1, b.ink(accent));
  text(b, name, x + 5, y + 2, accent, {shadow: t.shadow});
  return nw;
};

export interface PortraitWindowOpts {
  /** 0..1 open state; use sprite.openStep() — it is quantised to 3 steps here anyway */
  open?: number;
  name?: string;
  accent?: number;
  theme?: UITheme;
  /** draw the portrait into the inner rect (only called when fully open) */
  content?: (b: Buf, x: number, y: number, w: number, h: number) => void;
}
/**
 * Portrait window (standard: 112x136 inner for dialogue, 116x140 for name cards). Opens top+bottom from the
 * centre line in 3 held steps. The name plate hangs under the frame's left edge.
 */
export const portraitWindow = (b: Buf, x: number, y: number, w: number, h: number, o: PortraitWindowOpts = {}) => {
  const t = o.theme ?? THEME;
  const open = o.open ?? 1;
  if (open <= 0) return {inner: [x, y, w, 0] as [number, number, number, number], full: false};
  const steps = open >= 1 ? 1 : open >= 0.66 ? 0.66 : open >= 0.33 ? 0.33 : 0.1;
  const hh = Math.max(3, Math.round(h * steps));
  const yy = y + Math.round((h - hh) / 2);
  panel(b, x, yy, w, hh, t, false);
  rect(x, yy, w, hh, b.ink(t.ink));
  const full = open >= 1;
  if (full && o.content) o.content(b, x, y, w, h);
  else if (o.content && hh > 2) {
    // an opening step shows the portrait through the opening aperture (a shutter opening onto it), inside the
    // frame's bevel: never a flat black box on the freeze pop
    const tmp = new Buf(b.w, b.h, TRANSPARENT);
    o.content(tmp, x, y, w, h);
    for (let j = yy; j < yy + hh; j++) for (let i = x; i < x + w; i++) { const c = tmp.get(i, j); if (c !== TRANSPARENT) b.set(i, j, c); }
    rect(x, yy, w, 1, b.ink(t.hi)); rect(x, yy + hh - 1, w, 1, b.ink(t.lo));
  }
  if (full && o.name) namePlate(b, x + 4, y + h + 3, o.name, o.accent ?? PAL.C7, t);
  return {inner: [x, yy, w, hh] as [number, number, number, number], full};
};

/**
 * Dialogue box with typewriter text (`shown` chars) and a blinking "more" pip when complete.
 * `tail` notches toward the speaker's portrait. Returns the box height.
 */
export const dialogueBox = (b: Buf, x: number, y: number, w: number, str: string, shown: number, col: number, f: number, tail: 'left' | 'right' | 'none' = 'none', t: UITheme = THEME) => {
  const ls = wrap(str, w - 14);
  const h = 10 + ls.length * LINE_H;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(t.ink));
  rect(x, y, w, h, b.ink(t.face));
  rect(x, y, w, 1, b.ink(PAL.N5));
  rect(x, y + h - 1, w, 1, b.ink(t.lo));
  const ty = y + 8;
  if (tail === 'right') for (let k = 0; k < 4; k++) rect(x + w + 1, ty + k, 3 - k, 1, b.ink(t.face));
  if (tail === 'left') for (let k = 0; k < 4; k++) rect(x - 1 - (3 - k), ty + k, 3 - k, 1, b.ink(t.face));
  let left = shown;
  ls.forEach((ln, i) => {
    text(b, ln.slice(0, Math.max(0, left)), x + 7, y + 6 + i * LINE_H, col, {shadow: t.shadow});
    left -= ln.length + 1;
  });
  if (shown >= str.length && Math.floor(f / 6) % 2 === 0) {
    const px = x + w - 9, py = y + h - 7;
    rect(px, py, 5, 1, b.ink(col)); rect(px + 1, py + 1, 3, 1, b.ink(col)); rect(px + 2, py + 2, 1, 1, b.ink(col));
  }
  return h;
};

export interface NameCardOpts {
  /** top-left of the portrait window (or of the text block when there is no portrait) */
  x: number; y: number;
  name: string;
  /** tagline under the name, e.g. "ORG CHART: HIM." */
  line: string;
  accent: number;
  /** optional stamp, e.g. "SUED OVER IT." */
  stamp?: string;
  stampCol?: number;
  /** tagline colour. Default P1 (paper) */
  lineCol?: number;
  /** frames since the card started (drives the stepped open, the cut-in, the type-on and the stamp) */
  k: number;
  /** portrait painter for the 112x136 window (optional: cards also work text-only) */
  portrait?: (b: Buf, x: number, y: number, w: number, h: number) => void;
  /** which side of the portrait the text block sits on (put it on the side away from the action). Default right */
  textSide?: 'right' | 'left';
  theme?: UITheme;
}
export const NAMECARD = {portraitW: 112, portraitH: 136, gap: 10, textW: 176, textTop: 10};
/**
 * The founders' NAME CARD (freeze-frame intro). Layout, native px (x/y = top-left of the portrait window):
 *   [portrait 112x136]  10px  [ NAME   14px display face, accent colour, 2px deep shadow   (y + 10)
 *                               ====   2px accent rule, name width + 8                     (y + 27)
 *                               tagline, 7px face, types on at 2 chars/frame              (y + 33)
 *                               [STAMP] boxed, 2px border, lands at k=14 with a 1-frame kick (y + 50) ]
 * The text block sits on a black plate so it reads over any frozen frame; it is top-aligned with the
 * portrait so the lower half of the screen (where the live character acts) stays clear.
 * Timeline (k): 0-2 window opens in 3 held steps, 3 name cuts in, 4 rule, 5+ tagline types on, 14 stamp.
 */
export const nameCard = (b: Buf, o: NameCardOpts) => {
  const t = o.theme ?? THEME;
  const {portraitW: pw, portraitH: ph, gap, textTop} = NAMECARD;
  const k = o.k;
  const hasP = o.portrait !== undefined;
  if (hasP) portraitWindow(b, o.x, o.y, pw, ph, {open: Math.min(1, (k + 1) / 3), content: o.portrait, theme: t});
  const nw = bigTextWidth(o.name);
  const blockW = Math.max(nw + 8, textWidth(o.line) + 4, o.stamp ? bigTextWidth(o.stamp) + 14 : 0, 60);
  const tx = !hasP ? o.x : o.textSide === 'left' ? o.x - gap - blockW : o.x + pw + gap;
  const ty = o.y + (hasP ? textTop : 0);
  if (k >= 3) {
    const plateH = BIG_CAP + 26 + (o.stamp && k >= 14 ? BIG_CAP + 16 : 0);
    rect(tx - 5, ty - 5, blockW + 10, plateH, b.ink(t.ink));
    rect(tx - 5, ty - 5, blockW + 10, 1, b.ink(o.accent));
    bigText(b, o.name, tx, ty, o.accent, {shadow: t.shadow, deep: true});
    if (k >= 4) rect(tx, ty + BIG_CAP + 3, nw + 8, 2, b.ink(o.accent));
    if (k >= 5) text(b, o.line.slice(0, Math.max(0, (k - 5) * 2)), tx, ty + BIG_CAP + 9, o.lineCol ?? PAL.P1, {shadow: t.shadow});
  }
  if (o.stamp && k >= 14) {
    const kick = k === 14 ? 1 : 0;
    const sc = o.stampCol ?? PAL.R3;
    const sw = bigTextWidth(o.stamp) + 12;
    const sx = tx + kick, sy = ty + BIG_CAP + 24 + kick;
    rect(sx, sy, sw, 2, b.ink(sc)); rect(sx, sy + BIG_CAP + 8, sw, 2, b.ink(sc));
    rect(sx, sy, 2, BIG_CAP + 10, b.ink(sc)); rect(sx + sw - 2, sy, 2, BIG_CAP + 10, b.ink(sc));
    bigText(b, o.stamp, sx + 6, sy + 5, sc);
  }
};

export interface AlertOpts {
  title: string;
  body: string;
  buttons: string[];
  /** indices of greyed-out buttons */
  disabled?: number[];
  /** default button (double border) */
  def?: number;
  fg?: number; bg?: number;
}
/**
 * 1-bit system alert (1993). Draw it straight in ONEBIT colours (or apply ONEBIT after): black-on-paper,
 * 2px outer frame, title rule, dithered greyed-out buttons. x,y = top-left; returns [w, h].
 */
export const alertDialog = (b: Buf, x: number, y: number, w: number, o: AlertOpts): [number, number] => {
  const fg = o.fg ?? 0x0e0e10, bg = o.bg ?? 0xe9e6da;
  const bodyLines = wrap(o.body, w - 52);
  const h = 34 + bodyLines.length * LINE_H + 26;
  rect(x + 3, y + 3, w, h, b.ink(fg)); // hard drop shadow
  rect(x, y, w, h, b.ink(fg));
  rect(x + 1, y + 1, w - 2, h - 2, b.ink(bg));
  rect(x + 3, y + 3, w - 6, h - 6, b.ink(fg));
  rect(x + 4, y + 4, w - 8, h - 8, b.ink(bg));
  // "!" icon: a 16x16 sign
  const ix = x + 12, iy = y + 12;
  for (let j = 0; j < 16; j++) for (let i = 0; i < 16; i++) {
    const d = Math.abs(i - 7.5) <= j / 2 + 0.5;
    if (d) b.set(ix + i, iy + j, fg);
  }
  rect(ix + 7, iy + 5, 2, 6, b.ink(bg)); rect(ix + 7, iy + 12, 2, 2, b.ink(bg));
  text(b, o.title, x + 38, y + 12, fg);
  rect(x + 38, y + 21, textWidth(o.title), 1, b.ink(fg));
  bodyLines.forEach((ln, i) => text(b, ln, x + 38, y + 27 + i * LINE_H, fg));
  // buttons, right-aligned
  let bx = x + w - 12;
  const by = y + h - 22;
  for (let i = o.buttons.length - 1; i >= 0; i--) {
    const label = o.buttons[i];
    const bw = Math.max(44, textWidth(label) + 16);
    bx -= bw;
    const dis = o.disabled?.includes(i);
    rect(bx, by, bw, 14, b.ink(fg));
    rect(bx + 1, by + 1, bw - 2, 12, b.ink(bg));
    if (o.def === i) { rect(bx - 2, by - 2, bw + 4, 1, b.ink(fg)); rect(bx - 2, by + 15, bw + 4, 1, b.ink(fg)); rect(bx - 2, by - 2, 1, 18, b.ink(fg)); rect(bx + bw + 1, by - 2, 1, 18, b.ink(fg)); }
    const tx = bx + Math.round((bw - textWidth(label)) / 2);
    if (dis) {
      // greyed out the 1993 way, legible at 7px: a 50% dotted frame, text with every 4th pixel knocked out
      for (let i2 = 0; i2 < bw; i2++) for (const j of [0, 13]) if ((i2 + j) % 2) b.set(bx + i2, by + j, bg);
      for (let j = 0; j < 14; j++) for (const i2 of [0, bw - 1]) if ((i2 + j) % 2) b.set(bx + i2, by + j, bg);
      const tmp = new Buf(bw, 10, bg);
      text(tmp, label, tx - bx, 0, fg);
      for (let j = 0; j < 10; j++) for (let i2 = 0; i2 < bw; i2++) if (tmp.c[j * bw + i2] === fg && !((i2 & 1) && (j & 1))) b.set(bx + i2, by + 3 + j, fg);
    } else text(b, label, tx, by + 3, fg);
    bx -= 10;
  }
  return [w, h];
};
