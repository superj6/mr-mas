// MR. MAS — outro A: the pane's later skins (the capability ladder, OUTRO-PROPOSALS §2 "Per episode" and §1.4),
// as variant STILLS. The band (terms + pointer) is drawn by the same function as Ep1's and never changes.
//   ep6        BASE UI (the Orb's toast-panel family), proportional face, a toast-cyan title bar
//   ep10       the layered interface (dithered drop shadow, the columns aligned) and THE MACHINE TYPES: the
//              `reviewed by:` line is its own; the box is ticked before the words have arrived, and the value is
//              pre-filled ahead of the cursor (ghost text), faster than typing
//   ep10-keys  INSERT, his keyboard: the keys go down with no hands on them
import {Buf, W, H, rect, bayer} from '../../../shared/pixel/px';
import {PAL, stepColor} from '../../../shared/pixel/palette';
import {text, textWidth} from '../../../shared/pixel/font';
import type {PixelSceneProps} from '../../../shared/pixel/compose';
import {EP1, EP6, EP10, EpText, drawSlug, checkbox} from './text';
import {drawBezel, drawBand, SCR, BAND, WIN, lineY} from './pane';
import {drawInsert1} from './pane';

export type VariantId = 'ep1' | 'ep6' | 'ep10' | 'ep10-keys';

const LABEL_COL = 96; // the value column for the proportional skins (px from the text's left edge)

const panelWin = (b: Buf, x: number, y: number, w: number, h: number, bar: [number, number, number], shadow: 'hard' | 'dither') => {
  // drop shadow
  if (shadow === 'hard') rect(x + 3, y + 3, w, h, b.ink(PAL.N0));
  else for (let j = 0; j < h + 5; j++) for (let i = 0; i < w + 5; i++) {
    const X = x + i + 1, Y = y + j + 1;
    const d = Math.min(i, j, w + 4 - i, h + 4 - j);
    if (d < 5 && bayer(X, Y) < 0.2 + d * 0.14) b.set(X, Y, PAL.N0);
  }
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.N2));
  rect(x, y, w, 1, b.ink(PAL.N5));
  // the title bar (the toast family: cyan face, a bright top line)
  const [c0, c1, top] = bar;
  rect(x, y, w, 12, b.ink(c0));
  rect(x, y + 6, w, 6, b.ink(c1));
  rect(x, y, w, 1, b.ink(top));
  rect(x, y + 12, w, 1, b.ink(PAL.N0));
  for (const [cx, cy] of [[x, y], [x + w - 1, y], [x, y + h - 1], [x + w - 1, y + h - 1]]) b.set(cx, cy, PAL.N1);
};

const drawSkinnedLog = (b: Buf, t: EpText, skin: 'ep6' | 'ep10') => {
  const {x, y, w, h} = WIN;
  const hh = h + (t.extra ? 13 : 0);
  const yy = y - (t.extra ? 6 : 0);
  // the desktop
  rect(SCR.x, SCR.y, SCR.w, SCR.h, b.ink(PAL.N1));
  if (skin === 'ep10') for (let j = SCR.y; j < BAND.y; j++) for (let i = SCR.x; i < SCR.x + SCR.w; i++) if (bayer(i, j) < 0.12 * (1 - (j - SCR.y) / (BAND.y - SCR.y))) b.set(i, j, PAL.N2);
  panelWin(b, x, yy, w, hh, skin === 'ep6' ? [PAL.C6, PAL.C6, PAL.C8] : [PAL.C5, PAL.C6, PAL.C8], skin === 'ep6' ? 'hard' : 'dither');
  text(b, t.title, x + Math.round((w - textWidth(t.title)) / 2), yy + 3, PAL.N0);
  // the close box
  rect(x + 5, yy + 3, 7, 7, b.ink(PAL.N0)); rect(x + 6, yy + 4, 5, 5, b.ink(skin === 'ep6' ? PAL.C6 : PAL.C5));
  const tx = WIN.tx;
  const dy = yy - y;
  text(b, t.header, tx, WIN.headY + dy, PAL.P1);
  rect(tx, WIN.ruleY + dy, textWidth(t.header), 1, b.ink(PAL.C3));
  t.credits.forEach(([l, v], i) => {
    const ly = lineY(i) + dy;
    text(b, l, tx, ly, PAL.C6);
    text(b, v, tx + LABEL_COL, ly, PAL.P2);
  });
  const n = t.credits.length;
  if (t.extra) {
    // the machine's own line: the box already ticked, the value arriving ahead of the cursor (ghost text)
    const ly = lineY(n) + dy;
    text(b, t.extra[0], tx, ly, PAL.C7);
    const typed = 'a ', ghost = t.extra[1].slice(typed.length);
    text(b, typed, tx + LABEL_COL, ly, PAL.P2);
    const gx = tx + LABEL_COL + textWidth(typed) + 3;
    rect(gx, ly - 1, 1, 9, b.ink(PAL.C7)); // the machine's caret: a 1 px beam, not his block
    text(b, ghost, gx + 3, ly, PAL.N6);
    checkbox(b, tx + LABEL_COL + textWidth(t.extra[1]) + 12, ly, PAL.C6, true, PAL.C8);
    text(b, '>', tx, lineY(n + 1) + dy, PAL.C4);
  } else {
    text(b, '>', tx, lineY(n) + dy, PAL.C5);
    rect(tx + 10, lineY(n) + dy - 1, 4, 8, b.ink(PAL.C7));
  }
};

/**
 * INSERT, Ep10: his keyboard in extreme close-up (an ECU crop, the keys running off every edge), lit only by the
 * monitor above frame: cyan on the caps' far edges, falling off toward the camera. Nobody's hands, and three keys
 * are going down by themselves at three depths (H down, U two-thirds, M one-third): the machine typing `a human`
 * ahead of any typist. Whole-pixel key travel (3 px full).
 */
const drawKeys = (b: Buf) => {
  // the desk under the keys: dark wood
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) b.set(x, y, bayer(x, y) < 0.3 ? PAL.D1 : PAL.D0);
  const rows = ['QWERTYUIOP[', 'ASDFGHJKL;\'', 'ZXCVBNM,./'];
  const depth: Record<string, number> = {H: 3, U: 2, M: 1};
  const kw = 56, kh = 50, pitch = 64;
  const x0s = [-38, -22, 10], y0 = 14;
  // the board's plate (black), then the keys
  rect(0, y0 - 8, W, 3 * pitch + 60, b.ink(PAL.N0));
  const light = (y: number) => Math.max(0, 1 - y / 230); // the monitor is above frame
  rows.forEach((r, j) => {
    [...r].forEach((ch, i) => {
      const kx = x0s[j] + i * pitch, ky = y0 + j * pitch;
      if (kx > W || kx + kw < 0) return;
      const d = depth[ch] ?? 0;
      const L = light(ky);
      // the well (the switch's shadow) shows more as the key goes down
      rect(kx - 1, ky - 1, kw + 2, kh + 6, b.ink(PAL.N0));
      // the cap: skirt (sides) + top face; a pressed cap sits d px lower and its skirt is hidden
      const top = ky + d;
      const skirt = 5 - d;
      rect(kx, top, kw, kh + skirt - 2, b.ink(L > 0.55 ? PAL.G2 : PAL.G1)); // skirt / body
      const face = L > 0.7 ? PAL.G4 : L > 0.45 ? PAL.G3 : L > 0.2 ? PAL.G2 : PAL.G1;
      rect(kx + 3, top + 2, kw - 6, kh - 8, b.ink(d ? stepColor(face, -1) : face));
      // dithered dish (the concave top catches less light toward the camera)
      for (let yy = top + 2; yy < top + kh - 6; yy++) for (let xx = kx + 3; xx < kx + kw - 3; xx++)
        if (bayer(xx, yy) < ((yy - top) / kh) * 0.5) b.set(xx, yy, stepColor(b.get(xx, yy), -1));
      // the far edge catches the screen: cyan, brighter near the top of frame; a pressed key drops out of it
      rect(kx + 1, top, kw - 2, 1, b.ink(d >= 2 ? PAL.C1 : L > 0.6 ? PAL.C5 : L > 0.3 ? PAL.C3 : PAL.C2));
      rect(kx + 3, top + 2, kw - 6, 1, b.ink(d ? PAL.C1 : L > 0.6 ? PAL.C3 : PAL.C2));
      // the legend (top-left, printed)
      text(b, ch, kx + 8, top + 7, d ? PAL.G5 : L > 0.5 ? PAL.G6 : PAL.G5);
      // a pressed key's shadow line on the plate below it
      if (d) rect(kx, top + kh + skirt - 2, kw, 1, b.ink(PAL.N0));
    });
  });
  // the space bar's top edge at the bottom of frame (the fourth row)
  const sy = y0 + 3 * pitch;
  rect(x0s[2] + 2 * pitch + 8, sy, 5 * pitch - 8, 40, b.ink(PAL.G1));
  rect(x0s[2] + 2 * pitch + 11, sy + 2, 5 * pitch - 14, 30, b.ink(PAL.G1));
  rect(x0s[2] + 2 * pitch + 9, sy, 5 * pitch - 10, 1, b.ink(PAL.C2));
  // vignette: the light pools where the screen is, the frame's corners fall away
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dd = Math.hypot((x - W * 0.55) / (W * 0.7), (y - H * 0.15) / (H * 1.0));
    if (dd > 0.75 + (bayer(x, y) - 0.5) * 0.12) b.set(x, y, stepColor(b.get(x, y), -1));
  }
};

export const variantScene = (which: VariantId): Pick<PixelSceneProps, 'draw' | 'after' | 'bg'> => ({
  bg: PAL.N0,
  draw: (b) => {
    if (which === 'ep1') return void drawInsert1(b, 120, EP1);
    if (which === 'ep10-keys') return void drawKeys(b);
    const t = which === 'ep6' ? EP6 : EP10;
    drawSkinnedLog(b, t, which);
    drawBezel(b);
  },
  // the band is lit through the whole insert in every skin (the keyboard insert included: it cuts in while the log types)
  after: (ui) => { drawBand(ui); drawSlug(ui); },
});
export {W};
