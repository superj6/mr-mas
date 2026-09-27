// MR. MAS — kit: THE CODE RED on Mas's phone (Ep1 sc 7 → 8). New file (v3-art-a, 2026-09-27).
//   drawAlertInsert(b, f, st)   [ECU] 8.01: his phone on his desk at night, from above; a red news alert card with a
//                               siren glyph, `ELGOOG · CODE RED` (draft 6's text: whose alarm it is, in the world's
//                               words); his thumb opens it; the screen pushes to full-bleed: the app zooms, the camera
//                               doesn't (st.zoom 1..3 held steps: the screen's rect grows until it fills the frame,
//                               showing st.pov, a full-frame Buf of the lobby, through it: no scaling)
//   drawPhoneLockOTS(b, f, st)  [OTS] 8.06: over his shoulder, the phone in his hand, the siren turning on it (a small
//                               screen's drawing of the red dome and its sweep); st.locked: he locks it, the red goes out
//   ALERT                       the alert's words (the facts row: the code red, Dec 2022, [V] facts #5)
import {Buf, rect, ellipse, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {text, textWidth} from '../font';
import {pt, pw} from './uitype';
import {launchBackM, otsShoulder} from '../rooms/bullpen-launch';

export const ALERT = {title: 'ELGOOG · CODE RED'};
const RH = 203;

/** the siren glyph for the alert card: a red dome light on a base, two beams (12 x 10) */
const sirenGlyph = (b: Buf, x: number, y: number, on: boolean) => {
  const rows = ['....rrrr....', '...rRRRRr...', '..rRWWRRRr..', '..rRRRRRRr..', '..rRRRRRRr..', '.kkkkkkkkkk.', '.kggggggggk.', 'kkkkkkkkkkkk'];
  const pal: Record<string, number> = {r: PAL.R1, R: on ? PAL.R3 : PAL.R2, W: on ? PAL.W8 : PAL.R3, k: PAL.N0, g: PAL.G4};
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c !== undefined) b.set(x + i, y + j, c); } });
  if (on) { for (const [dx, dy] of [[-2, 1], [-3, 0], [-4, -1], [13, 1], [14, 0], [15, -1]]) b.set(x + dx, y + 2 + dy, PAL.R3); }
};
/** the alert card (a generic notification, no real app): red header band, the glyph, the title, one dim line */
export const drawAlertCard = (b: Buf, x: number, y: number, w: number, f: number) => {
  const h = 34;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(PAL.N0));
  rect(x, y, w, h, b.ink(PAL.N2)); rect(x, y, w, 10, b.ink(PAL.R2)); rect(x, y, w, 1, b.ink(PAL.R3));
  for (let i = 0; i < 3; i++) rect(x + 4 + i * 4, y + 4, 2, 2, b.ink(PAL.P1)); // the header's generic app dots
  sirenGlyph(b, x + 5, y + 15, Math.floor(f / 6) % 2 === 0);
  text(b, ALERT.title, x + 22, y + 15, PAL.P2);
  rect(x + 22, y + 26, Math.min(w - 30, 70), 1, b.ink(PAL.N5));
};

export interface AlertInsertState {
  /** frames since it lit (0 dark) */
  k?: number;
  /** his thumb: none · over the card · tap (the press) */
  thumb?: 'none' | 'over' | 'tap';
  /** the zoom to full-bleed: 0 the phone on the desk · 1..2 the screen's rect growing (held) · 3 full-bleed */
  zoom?: number;
  /** what the app opens to, full-frame (the Elgoog lobby) */
  pov?: Buf;
}
export const drawAlertInsert = (b: Buf, f: number, st: AlertInsertState = {}) => {
  const k = st.k ?? 12;
  // the desk top at night (his end desk's grey laminate, the lamp's cool pool), his dark laptop's edge
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) { const d = Math.hypot((x - 300) / 300, (y - 30) / 180); b.set(x, y, bayer(x, y) < (1 - Math.min(1, d)) * 0.7 ? PAL.G3 : bayer(x, y) < 0.3 ? PAL.G1 : PAL.G2); }
  const px = 176, py = 28, pw0 = 128, ph = 175;
  // the red of the screen on the desk round the phone
  if (k > 0) for (let y = py - 16; y < RH; y++) for (let x = px - 20; x < px + pw0 + 20; x++) { const d = Math.max(Math.abs(x - px - pw0 / 2) - pw0 / 2, py - y, 0) / 20; if (d < 1 && bayer(x, y) < (1 - d) * 0.5) b.set(x, y, PAL.R0); }
  rect(px + 4, py + 4, pw0, ph, b.ink(PAL.N0));
  rect(px, py, pw0, ph, b.ink(PAL.N0)); rect(px + 1, py + 1, pw0 - 2, ph, b.ink(PAL.N1));
  const sx = px + 6, sy = py + 10, sw = pw0 - 12;
  for (let y = sy; y < RH; y++) for (let x = sx; x < sx + sw; x++) b.set(x, y, k > 0 ? (bayer(x, y) < 0.2 ? PAL.N3 : PAL.N2) : PAL.N0);
  if (k > 0) drawAlertCard(b, sx + 4, sy + 10 + (k < 3 ? [-14, -6, -2][k] : 0), sw - 8, f);
  // his thumb, from the bottom edge: over the card, then the tap (the card presses a rung darker)
  if (st.thumb && st.thumb !== 'none') {
    const tx = sx + 52, ty = st.thumb === 'tap' ? sy + 30 : sy + 46;
    if (st.thumb === 'tap') rect(sx + 4, sy + 10, sw - 8, 34, b.ink(PAL.N3));
    if (st.thumb === 'tap') drawAlertCard(b, sx + 4, sy + 11, sw - 8, f);
    // the thumb: a broad tip coming in from the bottom-right, its pad on the card, the nail up; it widens toward the
    // frame's edge (the hand below frame)
    for (let y = ty; y < RH; y++) {
      const t = (y - ty) / (RH - ty), hw = 12 + Math.round(t * 14), cx = tx + Math.round(t * 34);
      for (let x = cx - hw; x <= cx + hw; x++) {
        const d = Math.hypot((x - cx) / hw, (y - ty - 12) / 12);
        if (y < ty + 12 && d > 1) continue;
        const edge = x === cx - hw || x === cx + hw || (y < ty + 12 && d > 0.88);
        b.set(x, y, edge ? PAL.S2 : x < cx - hw * 0.5 ? PAL.S3 : x > cx + hw * 0.55 ? PAL.S3 : y < ty + 8 ? PAL.S5 : PAL.S4);
      }
    }
    for (let j = 0; j < 9; j++) for (let i = -6; i <= 6; i++) if (Math.hypot(i / 6.5, (j - 4) / 5) < 1) b.set(tx + i, ty + 3 + j, j < 2 ? PAL.P2 : PAL.P1); // the nail
    for (let i = -5; i <= 5; i++) b.set(tx + i, ty + 12, PAL.S3);
  }
  // the zoom: the screen's rect grows to the frame, the POV seen through it at 1:1
  const z = st.zoom ?? 0;
  if (z > 0 && st.pov) {
    const t = [0, 0.36, 0.72, 1][Math.min(3, z)];
    const x0 = Math.round(sx * (1 - t)), y0 = Math.round(sy * (1 - t)), x1 = Math.round((sx + sw) * (1 - t) + 480 * t), y1 = Math.round(RH * (1 - t) + RH * t);
    const ox = Math.round((480 - (x1 - x0)) / 2) - x0; // the POV is centred in the growing rect
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) b.set(x, y, st.pov.get(x + ox, y));
    if (z < 3) { rect(x0 - 1, y0 - 1, x1 - x0 + 2, 1, b.ink(PAL.N0)); rect(x0 - 1, y1, x1 - x0 + 2, 1, b.ink(PAL.N0)); rect(x0 - 1, y0, 1, y1 - y0, b.ink(PAL.N0)); rect(x1, y0, 1, y1 - y0, b.ink(PAL.N0)); }
  }
};

export interface PhoneLockState {
  /** he locks it: the screen dark, the red out of the frame */
  locked?: boolean;
}
/** the phone's small screen with the siren turning on it (a screen-sized drawing, not a copy of the POV) */
const smallSiren = (b: Buf, x: number, y: number, w: number, h: number, f: number) => {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, j < h * 0.6 ? (bayer(i, j) < 0.3 ? PAL.G5 : PAL.G6) : PAL.G4);
  const cx = x + (w >> 1), cy = y + Math.round(h * 0.45);
  ellipse(cx, cy, 7, 6, b.ink(PAL.R2)); ellipse(cx, cy - 1, 4, 3, b.ink(Math.floor(f / 6) % 2 ? PAL.W7 : PAL.R3));
  rect(cx - 7, cy + 5, 14, 3, b.ink(PAL.G1)); rect(cx - 1, cy + 8, 2, h - (cy - y) - 8, b.ink(PAL.G2));
  const dir = Math.floor(f / 3) % 8 < 4 ? -1 : 1;
  for (let i = 8; i < w; i++) { const X = cx + dir * i; if (X < x || X >= x + w) continue; for (let jj = -Math.floor(i / 5); jj <= Math.floor(i / 5); jj++) if (bayer(X, cy + jj) < 0.7) b.set(X, cy + jj, PAL.R3); }
};
export const drawPhoneLockOTS = (b: Buf, f: number, st: PhoneLockState = {}) => {
  launchBackM(b, 380, {soft: 2, alyi: 'gone', underlines: 3});
  // the phone's red on the room before he locks it (a wash on the right, where the phone faces)
  if (!st.locked) for (let y = 0; y < RH; y++) for (let x = 180; x < 480; x++) if (bayer(x, y) < 0.18 * (1 - Math.abs(x - 330) / 150)) b.set(x, y, stepColor(b.get(x, y), 0) === b.get(x, y) ? PAL.R0 : PAL.R0);
  otsShoulder(b, -40, 58, st.locked ? PAL.N3 : PAL.R2, {flip: true});
  // his hand and the phone, held up at the frame's centre-right
  const px = 220, py = 70, pw1 = 54, ph = 96;
  rect(px - 1, py - 1, pw1 + 2, ph + 2, b.ink(PAL.N0)); rect(px, py, pw1, ph, b.ink(PAL.N1));
  if (st.locked) rect(px + 3, py + 6, pw1 - 6, ph - 12, b.ink(PAL.N0));
  else smallSiren(b, px + 3, py + 6, pw1 - 6, ph - 12, f);
  // his forearm: the hoodie sleeve from the frame's bottom-left up to the wrist under the phone, its top edge lit by
  // the screen (red while it's on); the palm is behind the phone, the fingers wrap its right edge, the thumb its left
  const rim = st.locked ? PAL.G3 : PAL.R2;
  for (let y = py + ph - 14; y < RH; y++) {
    const t = (y - (py + ph - 14)) / (RH - (py + ph - 14));
    const x0 = Math.round(px + 2 - t * 130), x1 = x0 + 24 + Math.round(t * 14);
    for (let x = x0; x < x1; x++) b.set(x, y, x === x0 || x === x0 + 1 ? rim : x > x1 - 4 ? PAL.G0 : PAL.G1);
  }
  rect(px + 2, py + ph - 16, 26, 6, b.ink(PAL.S2)); rect(px + 2, py + ph - 16, 26, 1, b.ink(PAL.S3)); // the wrist and the heel of the hand
  for (let k2 = 0; k2 < 4; k2++) { rect(px + pw1 - 1, py + 36 + k2 * 11, 5, 8, b.ink(PAL.S3)); rect(px + pw1 + 3, py + 37 + k2 * 11, 1, 6, b.ink(PAL.S2)); rect(px + pw1 - 1, py + 36 + k2 * 11, 5, 1, b.ink(PAL.S4)); }
  rect(px - 4, py + ph - 42, 7, 26, b.ink(PAL.S3)); rect(px - 4, py + ph - 42, 1, 26, b.ink(PAL.S2)); rect(px - 3, py + ph - 43, 5, 1, b.ink(PAL.S4));
  void textWidth; void pw;
};
