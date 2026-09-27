// MR. MAS — cast: TASYA READING HIS STATEMENT FROM HIS PHONE (CAST-TASYA-PHONE; Ep1 Act Four v5 art pass; new file,
// owned by the v5 art pass). S4.13 [MCU·door]: "TASYA in the new doorway, slate light behind him, the key ring
// jangling, warm as ever, his phone in his hand." cast/tasya-speak.ts (untouched) has arms 'ring' | 'clasp' | 'none';
// this adds the phone as a patch on its portrait, the way swaps-act4.ts patches the others:
//   tasyaPhonePortrait(s)   112 x 136, tasyaSpeakPortrait's frame: his near forearm up from the bottom edge, the hand
//                           holding the phone at his chest, turned up to him (we see its back and edge), its screen's
//                           slate light on his chin and beard (a palette step, never a blend). s.arms 'ring' keeps the
//                           raised key-ring arm on the far side (the host draws the ring itself, as for 'ring' today);
//                           'clasp' is treated as 'none' (both hands can't be clasped with a phone in one).
//                           s.read: true (default) his eyes down on it (lid 1), false = looking up from it (the
//                           portrait's own lids: the "pleased" beat after a sentence)
//   TASYA_PHONE_AT          where the phone sits in the portrait (for a host drawing its glow or a notification)
// Palette: his blazer's cool ramp (N0 N1 N2 N4 C2), his shirt cuff (G4 G5), his skin's cool rungs (X2 K2 K3), the case
// in greys (G2 G3 G5) so it reads against the navy.
import {PAL} from '../palette';
import type {Img} from '../figure';
import {memo} from './kit';
import {tasyaSpeakPortrait, TasyaPortraitState} from './tasya-speak';

export const TASYA_PHONE_AT = {x: 58, y: 100, w: 15, h: 24};
export interface TasyaPhoneState extends TasyaPortraitState { read?: boolean }

// the phone (its back toward us: a light grey case so it reads against the navy blazer, its edge lit by the slate
// door behind him, the camera bump), his fingers curled round its left side, the thumb on its right, the heel of the
// hand under it, the shirt cuff, the blazer sleeve down out of frame. Portrait coords.
const paintArm = (out: Img) => {
  const set = (x: number, y: number, c: number) => { if (x >= 0 && y >= 0 && x < out.w && y < out.h) out.c[y * out.w + x] = c; };
  const box = (x: number, y: number, w: number, h: number, c: number) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
  const {x: px, y: py, w: pw, h: ph} = TASYA_PHONE_AT;
  // the sleeve: from the bottom edge up to the wrist, on a slant toward the phone (lit edge on the key side, left)
  for (let y = py + ph + 4; y < out.h; y++) {
    const t = (y - (py + ph + 4)) / Math.max(1, out.h - (py + ph + 4));
    const x0 = Math.round(px - 2 + t * 12), w = 22 + Math.round(t * 6);
    for (let i = 0; i < w; i++) set(x0 + i, y, i === 0 || i === w - 1 ? PAL.N0 : i < 3 ? PAL.C2 : i < 6 ? PAL.N4 : i > w - 5 ? PAL.N1 : PAL.N2);
  }
  // the cuff and the wrist
  box(px - 2, py + ph + 2, 22, 2, PAL.G4); box(px - 2, py + ph + 2, 22, 1, PAL.G5);
  box(px, py + ph - 2, 17, 4, PAL.K2); box(px, py + ph - 2, 17, 1, PAL.K3);
  // the phone's back
  box(px - 1, py - 1, pw + 2, ph + 2, PAL.N0);
  box(px, py, pw, ph, PAL.G3);
  box(px, py, pw, 1, PAL.G5); box(px, py, 1, ph, PAL.G5); box(px + pw - 1, py + 1, 1, ph - 1, PAL.G2);
  box(px + 2, py + 2, 4, 4, PAL.N1); set(px + 3, py + 3, PAL.G4); // the camera bump
  // four fingers round its left side (each 3 rows, its knuckle lit), the thumb along its right edge
  for (let k = 0; k < 4; k++) { const fy = py + 6 + k * 4; box(px - 4, fy, 6, 3, PAL.K2); box(px - 4, fy, 6, 1, PAL.K3); set(px - 4, fy + 2, PAL.X2); set(px + 1, fy + 1, PAL.K3); }
  box(px + pw - 2, py + 5, 4, 9, PAL.K2); box(px + pw + 1, py + 5, 1, 9, PAL.X2); box(px + pw - 2, py + 5, 4, 1, PAL.K3);
};
/** the screen's light, one rung up on the planes that face down toward it (his jaw's underside, the beard) */
const UP: Record<number, number> = {[PAL.S0]: PAL.X1, [PAL.X1]: PAL.X2, [PAL.X2]: PAL.K2, [PAL.N3]: PAL.G2, [PAL.G2]: PAL.G3, [PAL.G3]: PAL.G4};

export const tasyaPhonePortrait = memo((s: TasyaPhoneState): Img => {
  const read = s.read !== false;
  const base = tasyaSpeakPortrait({...s, arms: s.arms === 'ring' ? 'ring' : 'none', lid: read ? 1 : s.lid});
  const out: Img = {w: base.w, h: base.h, c: new Int32Array(base.c)};
  // the glow first (so the arm, drawn after, is never lifted): rows under the lower lip, over the chin and beard
  for (let y = 82; y < 100; y++) for (let x = 46; x < 80; x++) {
    const i = y * out.w + x, v = out.c[i];
    if (v >= 0 && UP[v] !== undefined && (y < 92 || ((x + y) & 1) === 0)) out.c[i] = UP[v];
  }
  paintArm(out);
  return out;
});
