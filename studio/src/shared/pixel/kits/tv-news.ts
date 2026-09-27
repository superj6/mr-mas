// MR. MAS — kit: THE LOBBY TV's broadcasts (Ep1 sc 9: GNIB's unveil, then Elgoog's drab demo). New file (v3-art-a,
// 2026-09-27). A generic news broadcast (no real network's marks): the picture, the TV's own caption band, the ticker.
//   drawTvPicture(b, x, y, w, h, st)   the broadcast inside any screen rect: at the lobby wide's size (LOBBY.TV,
//                                      70 x 34: the caption in tiny caps on two lines) or full-frame ([SCR])
//     st.show: 'gnib' (GNIB's launch: a search box with a chat bubble inside it; the caption MACROSOFT UNVEILS THE NEW
//              GNIB) · 'tap' (across town, at Elgoog: Radnus tap-dancing, two drawings, the extinguisher held politely
//              aside, the siren turning above him) · 'telescope' (a giant space telescope turning in three held
//              drawings until its lens stares straight at him; the ticker ELGOOG'S DRAB DEMO GETS A TELESCOPE FACT
//              WRONG, then the loss figure, which holds)
//     st.k (the telescope's held turn 0..2), st.ticker 0..1 (how far the ticker has crawled in), st.figure (the loss
//     line shown in the ticker, held to read)
//   drawTvScreen(b, f, st)             [SCR] the TV filling the frame: its bezel, the broadcast
//   tvLedger(b, st)                    the LEDGER flash-print over the [SCR] (6 frames at most: money), then off
//   TV_TEXT                            the broadcast's words (the ticker's lines as draft 6 prints them)
import {Buf, rect, line, ellipse, bayer, hash} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth, bigText, bigTextWidth} from '../font';
import {applyPalette} from '../palettes';
import {pt, pw} from './uitype';
import {tiny, tinyWidth} from '../rooms/kit-b';
import {drawRadnus, RADNUS_DEFAULT} from '../cast/radnus';
import {drawChatBubble} from '../cast/chatgtp';

export const TV_TEXT = {
  gnib: 'MACROSOFT UNVEILS THE NEW GNIB',
  across: 'ACROSS TOWN, AT ELGOOG',
  ticker: "ELGOOG'S DRAB DEMO GETS A TELESCOPE FACT WRONG",
  // the record's line is ELGOOG ≈ −$100B (≈7.7%, ONE DAY); the kit face has no ≈ or − (uitype.ts), so they're set as
  // ~ and a hyphen, the closest glyphs it has
  figure: 'ELGOOG ~ -$100B (~7.7%, ONE DAY)',
};
export type TvShow = 'gnib' | 'tap' | 'telescope' | 'off';
export interface TvState { show: TvShow; f?: number; k?: number; ticker?: number; figure?: boolean }

const studio = (b: Buf, x: number, y: number, w: number, h: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const t = j / h + (bayer(x + i, y + j) - 0.5) * 0.2; b.set(x + i, y + j, t < 0.5 ? PAL.N4 : t < 0.8 ? PAL.N3 : PAL.N2); }
};
/** GNIB's search box with the chat bubble inside it (a search product with a chat in it: the whole joke of the frame) */
const gnibFrame = (b: Buf, x: number, y: number, w: number, h: number, small: boolean) => {
  studio(b, x, y, w, h);
  const bw = Math.round(w * 0.7), bh = small ? 10 : Math.round(h * 0.34);
  const bx = x + Math.round((w - bw) / 2), by = y + Math.round(h * (small ? 0.18 : 0.2));
  rect(bx - 1, by - 1, bw + 2, bh + 2, b.ink(PAL.N0)); rect(bx, by, bw, bh, b.ink(PAL.P2));
  // the GNIB wordmark over it: the parody name in slate, off-brand
  if (!small) bigText(b, 'GNIB', x + Math.round((w - bigTextWidth('GNIB')) / 2), by - 22, PAL.N7);
  // the chat bubble living inside the search box, and a magnifier glyph at the box's end
  if (small) { rect(bx + 2, by + 2, 8, 5, b.ink(PAL.C6)); b.set(bx + 4, by + 3, PAL.N0); b.set(bx + 7, by + 3, PAL.N0); }
  else drawChatBubble(b, bx + 8, by + 6, {size: 'screen', state: 'talk', f: 4});
  const mx = bx + bw - (small ? 7 : 18), my = by + (small ? 2 : Math.round(bh / 2) - 5);
  ellipse(mx + 3, my + 3, small ? 2 : 4, small ? 2 : 4, b.ink(PAL.G4)); ellipse(mx + 3, my + 3, small ? 1 : 2.4, small ? 1 : 2.4, b.ink(PAL.P2)); line(mx + 5, my + 5, mx + (small ? 6 : 9), my + (small ? 6 : 9), b.ink(PAL.G4));
};
/** across town at Elgoog: the atrium's primaries, the siren up on its lift, Radnus tap-dancing */
const tapFrame = (b: Buf, x: number, y: number, w: number, h: number, f: number, small: boolean) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, j < h * 0.35 ? PAL.G6 : j < h * 0.7 ? PAL.G5 : PAL.G4);
  const cols = [PAL.L2, PAL.R2, PAL.F4, PAL.W6];
  for (let k = 0; k < 5; k++) rect(x + Math.round((k + 0.5) * w / 5), y + Math.round(h * 0.35), Math.max(1, Math.round(w / 40)), Math.round(h * 0.35), b.ink(cols[k % 4]));
  // the siren on its lift, turning
  const sx = x + Math.round(w * 0.72), sy = y + Math.round(h * 0.18), sr = small ? 4 : Math.round(h * 0.12);
  ellipse(sx, sy, sr, sr, b.ink(PAL.R2)); ellipse(sx, sy - 1, Math.max(1, sr >> 1), Math.max(1, sr >> 1), b.ink(Math.floor(f / 6) % 2 ? PAL.W7 : PAL.R3));
  line(sx, sy + sr, sx, y + Math.round(h * 0.7), b.ink(PAL.G3));
  if (small) {
    // Radnus as a room-scale speck: navy, the red extinguisher aside, a heel up on alternate drawings
    const rx = x + Math.round(w * 0.4), ry = y + h - 4, up = Math.floor(f / 6) % 2;
    rect(rx, ry - 12, 3, 8, b.ink(PAL.N4)); rect(rx, ry - 15, 3, 3, b.ink(PAL.S3)); rect(rx + (up ? -1 : 0), ry - 4, 1, 4, b.ink(PAL.G2)); rect(rx + 2, ry - 4 + up, 1, 4 - up, b.ink(PAL.G2)); rect(rx + 4, ry - 10, 2, 3, b.ink(PAL.R3));
  } else drawRadnus(b, x + Math.round(w * 0.42), y + h - 6, {...RADNUS_DEFAULT, arm: Math.floor(f / 6) % 2 ? 'tap1' : 'tap0', light: 'tv'});
};
/** the telescope: a big white tube on a mount, turning in three held drawings until its lens faces straight at him */
const telescopeFrame = (b: Buf, x: number, y: number, w: number, h: number, f: number, k: number, small: boolean) => {
  // deep space behind the studio set: a starfield
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, hash(i, j, 81) < 0.02 ? PAL.N7 : PAL.N1);
  const cx = x + Math.round(w * 0.3), cy = y + Math.round(h * 0.42), L = small ? 18 : Math.round(w * 0.28), R = small ? 4 : Math.round(h * 0.09);
  const ang = [-0.9, -0.45, 0][Math.min(2, k)];
  // the tube: a stepped rectangle along the angle (drawn as a polygon of whole pixels), its lens ring, the mount
  const ex = cx + Math.round(Math.cos(ang) * L), ey = cy + Math.round(Math.sin(ang) * L);
  for (let t = 0; t <= L; t++) { const px = cx + Math.round(Math.cos(ang) * t), py = cy + Math.round(Math.sin(ang) * t); for (let r = -R; r <= R; r++) { const qx = px - Math.round(Math.sin(ang) * r), qy = py + Math.round(Math.cos(ang) * r); b.set(qx, qy, r < -R + 2 ? PAL.P2 : r > R - 2 ? PAL.G4 : PAL.G6); } }
  ellipse(ex, ey, R + 1, R + 1, b.ink(PAL.G3)); ellipse(ex, ey, R - 1, R - 1, b.ink(k >= 2 ? PAL.C7 : PAL.N2));
  if (k >= 2) { b.set(ex - 1, ey - 1, PAL.C9); }
  rect(cx - 2, cy, 4, Math.round(h * 0.3), b.ink(PAL.G3));
  // Radnus to the right, standing still under its stare (small: a speck), the extinguisher held
  if (small) { const rx = x + Math.round(w * 0.72), ry = y + h - 4; rect(rx, ry - 12, 3, 8, b.ink(PAL.N4)); rect(rx, ry - 15, 3, 3, b.ink(PAL.S3)); rect(rx + 4, ry - 10, 2, 3, b.ink(PAL.R3)); }
  else drawRadnus(b, x + Math.round(w * 0.74), y + h - 6, {...RADNUS_DEFAULT, arm: 'ext', light: 'tv', fire: null});
  void f;
};
export const drawTvPicture = (b: Buf, x: number, y: number, w: number, h: number, st: TvState) => {
  const f = st.f ?? 0, small = w < 120;
  if (st.show === 'off') { rect(x, y, w, h, b.ink(PAL.N0)); return; }
  const capH = small ? 12 : 20;
  const ph = h - capH;
  if (st.show === 'gnib') gnibFrame(b, x, y, w, ph, small);
  else if (st.show === 'tap') tapFrame(b, x, y, w, ph, f, small);
  else telescopeFrame(b, x, y, w, ph, f, st.k ?? 2, small);
  // the caption band (the TV's own) and, for the demo, the ticker under it
  rect(x, y + ph, w, capH, b.ink(PAL.N0));
  rect(x, y + ph, w, 1, b.ink(PAL.R2));
  if (small) {
    if (st.show === 'gnib') { tiny(b, 'MACROSOFT UNVEILS', x + 1, y + ph + 1, PAL.P2); tiny(b, 'THE NEW GNIB', x + 1, y + ph + 7, PAL.P2); }
    else if (st.show === 'tap') { tiny(b, 'ACROSS TOWN,', x + 1, y + ph + 1, PAL.P2); tiny(b, 'AT ELGOOG', x + 1, y + ph + 7, PAL.P2); }
    else { const s = st.figure ? 'ELGOOG -$100B' : "ELGOOG'S DRAB DEMO"; tiny(b, s.replace("'", ''), x + 1, y + ph + 1, st.figure ? PAL.R3 : PAL.P2); tiny(b, 'TELESCOPE FACT', x + 1, y + ph + 7, PAL.P2); }
    return;
  }
  const cap = st.show === 'gnib' ? TV_TEXT.gnib : st.show === 'tap' ? TV_TEXT.across : '';
  if (cap) pt(b, cap, x + 8, y + ph + 7, PAL.P2);
  if (st.show === 'telescope') {
    // the ticker crawls in from the right (whole pixels), then the figure replaces it and holds
    const s = st.figure ? TV_TEXT.figure : TV_TEXT.ticker;
    const tw = pw(s), t = st.ticker ?? 1;
    const tx = st.figure ? x + 8 : Math.round(x + w - (w - 8 + 0) * Math.min(1, t)) ;
    const tmp = new Buf(w, capH, PAL.N0);
    pt(tmp, s, tx - x, 7, st.figure ? PAL.R3 : PAL.P2);
    for (let j = 1; j < capH; j++) for (let i = 0; i < w; i++) b.set(x + i, y + ph + j, tmp.c[j * w + i]);
    void tw;
  }
};
/** [SCR] the lobby TV filling the frame: its bezel and wall mount edge, the broadcast */
export const drawTvScreen = (b: Buf, f: number, st: TvState) => {
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.5 ? PAL.G2 : PAL.G1);
  rect(22, 8, 436, 188, b.ink(PAL.N0)); rect(23, 9, 434, 1, b.ink(PAL.G3));
  drawTvPicture(b, 30, 16, 420, 172, {...st, f});
  // the screen's sheen (one diagonal streak a rung up)
  for (let j = 16; j < 188; j++) { const i = 40 + Math.round((j - 16) * 0.7); for (const d of [0, 1]) b.set(30 + i + d, j, stepColor(b.get(30 + i + d, j), 1)); }
};
/** the LEDGER flash-print (money; the engine's sanctioned set, 6 frames at most) over the screen rect of drawTvScreen */
export const tvLedger = (b: Buf) => applyPalette(b, 'LEDGER', {rect: [30, 16, 420, 172]});
void text; void textWidth; void tinyWidth;
