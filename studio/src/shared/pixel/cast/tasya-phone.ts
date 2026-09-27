// MR. MAS — cast: TASYA READING HIS STATEMENT FROM HIS PHONE (CAST-TASYA-PHONE; Ep1 Act Four v5 art pass; new file,
// owned by the v5 art pass). S4.13 [MCU·door]: "TASYA in the new doorway, slate light behind him, the key ring
// jangling, warm as ever, his phone in his hand." cast/tasya-speak.ts has arms 'ring' | 'clasp' | 'none'; this adds the
// phone as a patch on its portrait, the way swaps-act4.ts patches the others:
//   tasyaPhonePortrait(s)   112 x 136, tasyaSpeakPortrait's frame: his near forearm up from the bottom edge, the hand
//                           holding the phone at his chest, turned up to him (we see its back and edge), its screen's
//                           light on his chin and beard (a palette step, never a blend). s.arms 'ring' raises the far
//                           arm with the KEY RING IN ITS FIST, drawn into the portrait (a4p5: the host no longer has to
//                           draw it; without it the raised arm read as a dark blade floating by his head);
//                           'clasp' is treated as 'none' (both hands can't be clasped with a phone in one).
//                           s.read: true (default) his eyes down on it (lid 1, brows level) AND the phone's screen
//                           reflected along the bottom of both lenses (a4p5: the lowered lid alone sits under the
//                           glasses' rim and read as "no change"); false = looking up from it (the portrait's own lids:
//                           the "pleased" beat after a sentence)
//                           s.skin: 'room' (default, a4p5) a warm skin ramp keyed from the room with the slate door as
//                           his grey back rim; 'slate' = v4's ramp (S0 X1 X2 K2 K3 K4: the stills check read it as a
//                           green, sickly face at 1x and at full size)
//   TASYA_PHONE_AT          where the phone sits in the portrait (for a host drawing its glow or a notification)
// Palette: his blazer's cool ramp (N0 N1 N2 N4 C2), his shirt cuff (G4 G5), his skin (S0 X1 X2 S3 S4 S5; or v4's cool
// rungs), the case in greys (G2 G3 G5) so it reads against the navy, the ring's brass (W).
import {Buf} from '../px';
import {PAL} from '../palette';
import {renderFigure, type Img} from '../figure';
import {memo} from './kit';
import {tasyaSpeakPortrait, TasyaPortraitState, tasyaSpeakFig, TASYA_SPEAK_RIG, drawTasyaKeyRing} from './tasya-speak';

export const TASYA_PHONE_AT = {x: 58, y: 100, w: 15, h: 24};
export type TasyaSkin = 'room' | 'slate';
export interface TasyaPhoneState extends TasyaPortraitState { read?: boolean; skin?: TasyaSkin }

/** the warm skin ramp (tone 0..5): shadow, the mauve bridge, then the lit warm rungs; the rim stays the slate door's grey */
const SKIN_ROOM = [PAL.S0, PAL.X1, PAL.X2, PAL.S3, PAL.S4, PAL.S5];
/** the hand's three rungs (shadow, body, knuckle light) per skin */
const HAND: Record<TasyaSkin, {sh: number; body: number; lit: number}> = {
  room: {sh: PAL.X2, body: PAL.S3, lit: PAL.S4},
  slate: {sh: PAL.X2, body: PAL.K2, lit: PAL.K3},
};
/** the screen's light: one rung up on the planes that face down toward it (his jaw's underside, the beard) */
const UP: Record<TasyaSkin, Record<number, number>> = {
  room: {[PAL.S0]: PAL.X1, [PAL.X1]: PAL.X2, [PAL.X2]: PAL.S3, [PAL.S3]: PAL.S4, [PAL.N3]: PAL.G2, [PAL.G2]: PAL.G3, [PAL.G3]: PAL.G4},
  slate: {[PAL.S0]: PAL.X1, [PAL.X1]: PAL.X2, [PAL.X2]: PAL.K2, [PAL.N3]: PAL.G2, [PAL.G2]: PAL.G3, [PAL.G3]: PAL.G4},
};

// the phone (its back toward us: a light grey case so it reads against the navy blazer, its edge lit by the slate
// door behind him, the camera bump), his fingers curled round its left side, the thumb on its right, the heel of the
// hand under it, the shirt cuff, the blazer sleeve down out of frame. Portrait coords.
const paintArm = (out: Img, skin: TasyaSkin) => {
  const set = (x: number, y: number, c: number) => { if (x >= 0 && y >= 0 && x < out.w && y < out.h) out.c[y * out.w + x] = c; };
  const box = (x: number, y: number, w: number, h: number, c: number) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
  const {x: px, y: py, w: pw, h: ph} = TASYA_PHONE_AT;
  const H = HAND[skin];
  // the sleeve: from the bottom edge up to the wrist, on a slant toward the phone (lit edge on the key side, left)
  for (let y = py + ph + 4; y < out.h; y++) {
    const t = (y - (py + ph + 4)) / Math.max(1, out.h - (py + ph + 4));
    const x0 = Math.round(px - 2 + t * 12), w = 22 + Math.round(t * 6);
    for (let i = 0; i < w; i++) set(x0 + i, y, i === 0 || i === w - 1 ? PAL.N0 : i < 3 ? PAL.C2 : i < 6 ? PAL.N4 : i > w - 5 ? PAL.N1 : PAL.N2);
  }
  // the cuff and the wrist
  box(px - 2, py + ph + 2, 22, 2, PAL.G4); box(px - 2, py + ph + 2, 22, 1, PAL.G5);
  box(px, py + ph - 2, 17, 4, H.body); box(px, py + ph - 2, 17, 1, H.lit);
  // the phone's back
  box(px - 1, py - 1, pw + 2, ph + 2, PAL.N0);
  box(px, py, pw, ph, PAL.G3);
  box(px, py, pw, 1, PAL.G5); box(px, py, 1, ph, PAL.G5); box(px + pw - 1, py + 1, 1, ph - 1, PAL.G2);
  box(px + 2, py + 2, 4, 4, PAL.N1); set(px + 3, py + 3, PAL.G4); // the camera bump
  // four fingers round its left side (each 3 rows, its knuckle lit), the thumb along its right edge
  for (let k = 0; k < 4; k++) { const fy = py + 6 + k * 4; box(px - 4, fy, 6, 3, H.body); box(px - 4, fy, 6, 1, H.lit); set(px - 4, fy + 2, H.sh); set(px + 1, fy + 1, H.lit); }
  box(px + pw - 2, py + 5, 4, 9, H.body); box(px + pw + 1, py + 5, 1, 9, H.sh); box(px + pw - 2, py + 5, 4, 1, H.lit);
};
/** the phone's screen caught in his glasses: a short pale streak along the bottom of each lens (portrait coords; the
 *  lenses are tasya-speak's glasses stamp: near lens interior x 53-67, far lens x 43-49, both on rows 46-48) */
const lensGlow = (out: Img) => {
  const set = (x: number, y: number, c: number) => { out.c[y * out.w + x] = c; };
  for (let x = 56; x <= 62; x++) set(x, 48, x === 58 || x === 59 ? PAL.G6 : PAL.N8);
  for (let x = 57; x <= 61; x++) set(x, 47, x === 59 ? PAL.N8 : out.c[47 * out.w + x]);
  for (let x = 44; x <= 47; x++) set(x, 48, x === 45 ? PAL.G6 : PAL.N8);
};
/** the fist's slate rungs re-lit warm for the room skin (a4p5 r2: in the slate rungs the fist round the ring read as a
 *  pale teal gem, not a hand). The ring's brass (W) is untouched. */
const FIST_ROOM: Record<number, number> = {[PAL.K2]: PAL.S3, [PAL.K3]: PAL.S4, [PAL.K4]: PAL.S5};
/** the key ring in his raised fist, drawn into the portrait (tasya-speak's own ring, 2 jangle drawings) */
const ringInto = (out: Img, jangle: 0 | 1, skin: TasyaSkin) => {
  const KEY = 0xff00ff; // not a palette colour: marks "untouched"
  const b = new Buf(out.w, out.h, KEY);
  drawTasyaKeyRing(b, (x, y) => x >= 0 && y >= 0 && x < out.w && y < out.h, -5, 0, jangle);
  for (let i = 0; i < b.c.length; i++) if (b.c[i] !== KEY) out.c[i] = skin === 'room' ? (FIST_ROOM[b.c[i]] ?? b.c[i]) : b.c[i];
};
/** the portrait's fixed stamps and top rungs still carry slate colours under the room skin: the eye whites (K2), the
 *  teeth and the beard's and hair's top rung (K3). Re-keyed so no teal is left on a warm-lit face (a4p5 r2). */
const STAMP_ROOM: Record<number, number> = {[PAL.K2]: PAL.P0, [PAL.K3]: PAL.G6, [PAL.K4]: PAL.P1};
const roomPortrait = memo((s: TasyaPortraitState): Img => {
  const im = renderFigure(tasyaSpeakFig(s), {...TASYA_SPEAK_RIG, ramps: {...TASYA_SPEAK_RIG.ramps, skin: SKIN_ROOM}});
  const c = new Int32Array(im.c);
  for (let i = 0; i < c.length; i++) { const r = STAMP_ROOM[c[i]]; if (r !== undefined) c[i] = r; }
  return {w: im.w, h: im.h, c};
});
/** a4p5 finish: tasya-speak's portrait (any arms, 'clasp' included; no phone, no glow) with the room's warm skin, for the
 *  shots where he talks in person (S7.02b): the same face as S4.13's, so a cut never turns him teal (audit §2.5) */
export const tasyaRoomPortrait = (s: TasyaPortraitState): Img => roomPortrait(s);

export const tasyaPhonePortrait = memo((s: TasyaPhoneState): Img => {
  const read = s.read !== false;
  const skin: TasyaSkin = s.skin ?? 'room';
  const ps: TasyaPortraitState = {mouth: s.mouth, lid: read ? 1 : s.lid, brow: read ? 'level' : s.brow, arms: s.arms === 'ring' ? 'ring' : 'none', jangle: s.jangle};
  const base = skin === 'slate' ? tasyaSpeakPortrait({...ps, brow: s.brow}) : roomPortrait(ps);
  const out: Img = {w: base.w, h: base.h, c: new Int32Array(base.c)};
  // the glow first (so the arm, drawn after, is never lifted): rows under the lower lip, over the chin and beard
  const up = UP[skin];
  for (let y = 82; y < 100; y++) for (let x = 46; x < 80; x++) {
    const i = y * out.w + x, v = out.c[i];
    if (v >= 0 && up[v] !== undefined && (y < 92 || ((x + y) & 1) === 0)) out.c[i] = up[v];
  }
  paintArm(out, skin);
  if (read) lensGlow(out);
  if (s.arms === 'ring') ringInto(out, s.jangle, skin);
  return out;
});
