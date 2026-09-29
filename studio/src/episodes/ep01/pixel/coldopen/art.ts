// MR. MAS — Ep1 v3 pixel shots, THE COLD OPEN's own small drawings (the v3-shots-coldopen-tag pass, 2026-09-27). New,
// additive, namespaced to the segment: nothing in shared/pixel is edited, only imported.
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
//   drawIntroCursor(b)        the intro's first frame's cursor (measured from out/season/intro/intro-ep1-V1-1080p.mp4 frame 0)
//   smearRoom(b, j)            3.02's end: the room slides left and streaks, faster each frame (Act Four's whip smear)
//   collapseFrame(b, step)     then the picture's window closes on the cursor's rectangle in three held steps (a crop)
// (Until the lead's ruling on the showrunner's note, 2026-09-27, this file also drew the cold open's own 1993 frame from
// the intro's alert; that beat is cut, and the intro's own 1993 now pays off "too far". See shots-coldopen.md §0.)
import {Buf, ellipse, hash, bayer} from '../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../shared/pixel/palette';
import {Mask} from '../../../../shared/pixel/mask';
import {applyPalette} from '../../../../shared/pixel/palettes';
import {APEC_FREEZE} from '../../../../shared/pixel/rooms/apec-stage';
import {masPortrait, MAS_PORTRAIT_DEFAULT, MasPortraitState} from '../../../../shared/pixel/cast/mas';
import {shiftRoom, whipSmear} from '../../act4/animatic/framing';

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

// ------------------------------------------------------------------ the end of the rewind: into the intro's cursor
/** the intro's first frame (out/season/intro/intro-ep1-V1-1080p.mp4 frame 0): a cyan block cursor on black, drawn in glyph
 *  cells: 4 columns x 9 rows of 8-row cells at native x 83 + 9c, y 39 + 9r; each cell two L3 columns, a gap, two C5
 *  columns (their top row L3). Measured from the intro's own frame (both colours are the master palette's, exactly) */
export const CURSOR = {x: 83, y: 39, w: 32, h: 80};
export const drawIntroCursor = (b: Buf) => {
  for (let c = 0; c < 4; c++) for (let r = 0; r < 9; r++) {
    const x0 = CURSOR.x + c * 9, y0 = CURSOR.y + r * 9;
    for (let j = 0; j < 8; j++) {
      b.set(x0, y0 + j, PAL.L3); b.set(x0 + 1, y0 + j, PAL.L3);
      const col = j === 0 ? PAL.L3 : PAL.C5;
      b.set(x0 + 3, y0 + j, col); b.set(x0 + 4, y0 + j, col);
    }
  }
};
/** the smear: the room slides left (toward the cursor's side of the frame) faster each frame, streaked (Act Four's whip
 *  smear); j = frames into it */
export const SMEAR = [4, 10, 20, 36, 60, 92];
export const smearRoom = (b: Buf, j: number) => {
  const d = SMEAR[Math.min(SMEAR.length - 1, j)];
  shiftRoom(b, -d);
  whipSmear(b, -Math.min(240, 60 + j * 40));
};
/** the collapse: the picture's window closes on the cursor's rectangle in held steps (a crop, nothing scaled); outside
 *  it the WHOLE frame goes black (the band too); inside, the smeared room a rung darker per step, a C5 edge.
 *  step 0..2; returns nothing: the caller returns {full: true} */
export const COLLAPSE_T = [0.5, 0.78, 0.93];
export const collapseFrame = (b: Buf, step: number) => {
  const t = COLLAPSE_T[Math.min(COLLAPSE_T.length - 1, step)];
  const x0 = Math.round(CURSOR.x * t), y0 = Math.round(CURSOR.y * t);
  const x1 = Math.round(480 + (CURSOR.x + CURSOR.w - 480) * t), y1 = Math.round(RH + (CURSOR.y + CURSOR.h - RH) * t);
  for (let y = 0; y < 270; y++) for (let x = 0; x < 480; x++) {
    const i = y * 480 + x;
    if (x < x0 || x >= x1 || y < y0 || y >= y1) { b.c[i] = PAL.N0; continue; }
    if (x === x0 || x === x1 - 1 || y === y0 || y === y1 - 1) { b.c[i] = PAL.C5; continue; }
    b.c[i] = stepColor(b.c[i], -(step + 1));
  }
};
