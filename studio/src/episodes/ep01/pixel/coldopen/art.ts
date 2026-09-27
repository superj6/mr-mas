// MR. MAS — Ep1 v3 pixel shots, THE COLD OPEN's own small drawings (the v3-shots-coldopen-tag pass, 2026-09-27). New,
// additive, namespaced to the segment: nothing in shared/pixel or in the intro's code is edited; both are only imported.
//   tableStone(b, f, k)        1.03: the hailstone dropping into Mas's glass and bobbing, WITHOUT the plink's ring that
//                              rooms/apec-stage.ts draws (pov-and-framing §3.6: "a ring in the water" is Ep12's reserved
//                              tell, and the script says his water line doesn't move). Drawn over drawApecTable(plink: null)
//                              with the art's own stone drawing (the same ellipses and glyph noise, the same bob steps)
//   hostSpill(b)               1.03: the host's spilled water on the table, kept after the slosh settles (the art draws the
//                              spill only inside its slosh-3 drawing)
//   freezeOutside(b, live)     sc 2's 2-TONE FREEZE for the MCU and the insert: the room navy and cream, `live` kept
//   mcuLive(state)             the MCU's live mask: Mas's portrait as drawApecMCU places it (X 70, Y 30), its hoodie run
//                              down to the frame's foot, and his collars (a 2-px margin)
//   phoneLive()                the invite insert's live mask: the phone
//   draw1993(b, k, o)          F1.1 · 1993, the WHOLE 480 x 270 frame in the intro's own 1-bit look: its 3:2 pillarbox
//                              (dev/meras/era1993.ts PB), its era stamp (cast/era.ts, as the intro sets 1993), its zoom
//                              rects, and its alert (drawDialog: the modal frame, the dithered title bar, the rounded
//                              buttons, Cancel greyed, OK's default ring), re-used as drawn and centred, with the cold
//                              open's words in it (`Are you sure?`) and the intro's 1-bit Orb icon, whose iris can look
import {Buf, rect, ellipse, hash, bayer} from '../../../../shared/pixel/px';
import {PAL} from '../../../../shared/pixel/palette';
import {Mask} from '../../../../shared/pixel/mask';
import {applyPalette} from '../../../../shared/pixel/palettes';
import {bigText, bigTextWidth, BIG_CAP} from '../../../../shared/pixel/font';
import {APEC_FREEZE} from '../../../../shared/pixel/rooms/apec-stage';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {eraStamp} from '../../../../shared/pixel/cast/era';
import {drawRewindToast1bit} from '../../../../shared/pixel/kits/rewind-toast';
import {pw} from '../../../../shared/pixel/kits/uitype';
// the intro's 1993 (the shipped intro is built from these files; they are imported, never edited)
import {drawDialog, zoomRects, DLG, PB} from '../../../../dev/meras/era1993';
import {INK, PAPER, LV, pp} from '../../../../dev/meras/bit';

const RH = 203;

// ------------------------------------------------------------------ 1.03: the stone in his glass (no ring)
/** apec-stage's table geometry for HIS glass: glass(196, 34, ...) -> the water's surface at y 48 */
const GLASS_CX = 196, WATER_Y = 34 + 14;
/** k = frames since the cut; the stone falls in (k 0, 1: two held drawings from above), lands on k 2 (the plink), bobs
 *  in the art's steps, then settles (its surface's glyph noise keeps turning on 6s) */
export const tableStone = (b: Buf, f: number, k: number, land = 2) => {
  const t = k - land;
  let hx = GLASS_CX - 4, hy: number;
  if (t < 0) hy = t <= -2 ? 0 : WATER_Y - 26; // falling: out of the top of the frame, then just above the rim
  else hy = WATER_Y - 5 + (t < 12 ? [0, -3, 1, -2, 0, 1][Math.floor(t / 2) % 6] : 0);
  if (t < 0) hx += 2;
  ellipse(hx + 4, hy + 4, 6, 5, b.ink(PAL.C8)); ellipse(hx + 4, hy + 3, 5, 4, b.ink(PAL.C9));
  for (let j = 0; j < 8; j++) for (let i = 0; i < 9; i++) if (hash(i, j, 90 + (Math.floor(f / 6) % 2)) < 0.32 && Math.hypot((i - 4) / 5, (j - 3.5) / 4) < 1) b.set(hx + i, hy + j, PAL.C6);
  if (t < 0 && t > -2) for (let j = 1; j < 4; j++) b.set(hx + 4, hy - j * 3, PAL.C7); // a short fall streak, one drawing
};
/** the host's glass: glass(330, 26, slosh) -> its spill (cx + 18..52, the base's row + 4..12) */
export const hostSpill = (b: Buf) => {
  const cx = 330, top = 26, h = 58;
  for (let y = top + h + 4; y < top + h + 12; y++) for (let x = cx + 18; x < cx + 52; x++) if (Math.hypot((x - cx - 35) / 17, (y - top - h - 8) / 4) < 1) b.set(x, y, bayer(x, y) < 0.5 ? PAL.C3 : PAL.G4);
};

// ------------------------------------------------------------------ sc 2: the freeze in the MCU and the insert
export const freezeOutside = (b: Buf, live: Mask) => applyPalette(b, APEC_FREEZE, {mask: live, invert: true, rect: [0, 0, 480, RH]});
/** Mas's pixels in drawApecMCU (the portrait at X 70, Y 30; the hoodie run down; a 2-px margin for the collars) */
export const mcuLive = (s: Partial<MasPortraitState>) => {
  const img = masPortrait({...MAS_PORTRAIT_DEFAULT, light: 'warm', head: 'front', look: 1, ...s});
  const X = 70, Y = 30, m = new Mask(480, 270);
  const on = (x: number, y: number) => { for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const X2 = x + dx, Y2 = y + dy; if (X2 >= 0 && X2 < 480 && Y2 >= 0 && Y2 < RH) m.a[Y2 * 480 + X2] = 255; } };
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) if (img.c[j * img.w + i] >= 0) on(X + i, Y + j);
  for (let i = 0; i < img.w; i++) if (img.c[(img.h - 1) * img.w + i] >= 0) for (let y = Y + img.h; y < RH; y++) on(X + i, y);
  return m;
};
/** the insert's phone (kits/phone-invite.ts: x 150, y 8, 180 wide, run off the frame's foot), its shadow included */
export const phoneLive = () => { const m = new Mask(480, 270); for (let y = 8; y < RH; y++) for (let x = 150; x < 334; x++) m.a[y * 480 + x] = 255; return m; };
/** the buzz: the phone (and only the phone) jumps 1 px sideways, the table under it unchanged */
export const buzzPhone = (b: Buf, dx: number) => {
  if (!dx) return;
  const x0 = 148, x1 = 336;
  for (let y = 6; y < RH; y++) {
    const row = y * b.w;
    const seg = b.c.slice(row + x0, row + x1);
    for (let x = x0 + 2; x < x1 - 2; x++) b.c[row + x] = seg[x - x0 - dx];
  }
};

// ------------------------------------------------------------------ F1.1 · 1993 (the whole frame)
/** the cold open's alert: the intro's (DLG, 244 x 96) moved to the frame's centre */
export const DLG_CO = {x: 240 - Math.round(DLG.w / 2), y: 72, w: DLG.w, h: DLG.h};
/** the intro's 32 x 32 1-bit Orb icon (era1993.ts orbIcon, which is not exported: the same pixels, re-set here), with an
 *  iris that can look: `look` [dx, dy] in whole pixels (0, 0 = the intro's: at us) */
const orbIcon = (b: Buf, x: number, y: number, look: [number, number]) => {
  const cx = x + 16, cy = y + 16, r = 13.5;
  for (let j = 0; j < 32; j++) for (let i = 0; i < 32; i++) {
    const dx = (i + 0.5 - 16) / r, dy = (j + 0.5 - 16) / r;
    const d2 = dx * dx + dy * dy;
    if (d2 > 1) continue;
    const nz = Math.sqrt(1 - d2);
    const v = Math.max(0, -0.55 * dx - 0.6 * dy + 0.58 * nz);
    const kk = v > 0.8 ? 8 : v > 0.62 ? 6 : v > 0.45 ? 5 : v > 0.3 ? 4 : v > 0.15 ? 3 : 2;
    b.set(x + i, y + j, LV[kk](x + i, y + j) ? INK : PAPER);
  }
  for (let a = 0; a < 360; a += 2) { const t = (a * Math.PI) / 180; b.set(Math.round(cx - 0.5 + Math.cos(t) * r), Math.round(cy - 0.5 + Math.sin(t) * r), INK); }
  const ix = cx + look[0], iy = cy + look[1];
  ellipse(ix + 1, iy + 1, 6.5, 6.5, b.ink(INK));
  ellipse(ix + 1, iy + 1, 5, 5, pp(b, LV[4]));
  ellipse(ix + 1, iy + 1, 3, 3, b.ink(INK));
  rect(ix - 2, iy - 2, 2, 2, b.ink(PAPER));
  b.set(ix + 3, iy + 3, PAPER);
};
export interface Frame1993 {
  /** frames since the cut: the field and the stamp at 0; the zoom rects at `open`, open + 1; the alert from open + 2 */
  k: number;
  open?: number;
  /** the icon's iris (whole-pixel offset) */
  look?: [number, number];
  /** frames since the Orb's 1-bit toast popped (< 0: not yet) */
  toast?: number;
}
export const draw1993 = (b: Buf, o: Frame1993) => {
  const open = o.open ?? 6;
  // the intro's paper field in its 3:2 pillarbox, all 270 rows (the era switch fills the frame, as the intro's 1993 does)
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) b.c[y * 480 + x] = x < PB.x0 || x >= PB.x1 ? INK : PAPER;
  // the era stamp as the intro sets 1993 (the shared stamp, paper on an ink plate, its rule growing 8 px a frame)
  eraStamp(b, '1993', o.k, {text: PAPER, plate: INK, rule: PAPER});
  const {x, y, w, h} = DLG_CO;
  if (o.k === open) zoomRects(b, [234, 116, 12, 8], [x, y, w, h], 0.05, 0.4);
  else if (o.k === open + 1) zoomRects(b, [234, 116, 12, 8], [x, y, w, h], 0.45, 0.85);
  else if (o.k >= open + 2) {
    // the intro's alert, drawn where the intro draws it, then moved here whole (frame, title bar, buttons, shadow)
    const t = new Buf(480, 270, PAPER);
    drawDialog(t, {okDown: false});
    const sx = DLG.x, sy = DLG.y;
    for (let j = 0; j < h + 3; j++) for (let i = 0; i < w + 3; i++) {
      const v = t.c[(sy + j) * 480 + sx + i];
      // the shadow's two outer strips are ink on paper in the source: carry them as drawn
      b.c[(y + j) * 480 + x + i] = v;
    }
    // the title bar: the intro's names the kid (`age 8`); nobody is here, so the band runs whole (its own dither)
    const tb = 12;
    for (let j = 2; j < tb - 1; j++) for (let i = 3; i < w - 3; i++) b.set(x + i, y + 1 + j, (x + i + y + 1 + j) & 1 ? INK : PAPER);
    // the content: the icon (its iris free to look), and the question in the intro's display face
    rect(x + 8, y + tb + 4, w - 16, 42, b.ink(PAPER));
    orbIcon(b, x + 14, y + tb + 12, o.look ?? [0, 0]);
    const q = 'Are you sure?';
    bigText(b, q, x + 58, y + tb + 14, INK);
    void bigTextWidth; void BIG_CAP;
  }
  if ((o.toast ?? -1) >= 0) {
    const label = 'rewinding… too far';
    const tw = pw(label) + 26;
    drawRewindToast1bit(b, 240 - Math.round(tw / 2), y + h + 18, {k: o.toast!, text: label});
  }
};
