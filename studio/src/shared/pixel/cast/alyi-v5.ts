// MR. MAS — cast: ALYI's v5 expression swaps (CAST-ALYI-LOOK, CAST-ALYI-PHONE; Ep1 Act Four v5 art pass; new file, owned
// by the v5 art pass). New drawings on the approved speaking portrait (cast/alyi-speak.ts alyiSpeakPortrait), made as
// pixel patches the way swaps-act4.ts makes his look-up (the owner's files are untouched):
//   alyiLook(s, dir)             the eyes shift inside the deep sockets: 'left' / 'right' (3-4 px, pupil and glint on S3 whites),
//                                'down' (lids lowered, the irises at the bottom of the eye: reading his phone), 'ahead'
//                                (the portrait as drawn). S3.07: the look to the employee at the pause
//   alyiReflectionLook(s, dir)   the same look as his REFLECTION in dark glass (mirrored, mapped to the glass ramp exactly
//                                as alyi-speak.ts alyiReflection does; 'door' = the look toward the slate door, S4.13d)
//   drawAlyiTileFit(b, x, y, w, h, s)  his call tile (a doorway, he is a reflection in its glass) re-framed for ANY tile
//                                size: alyi-speak.ts drawAlyiTile places the reflection for the 144 x 76 tile, so at
//                                the 88 x 49 tiles of Neleh's OTS laptop and the letter's thumbnail it shows only the top
//                                of his head (the r3 stills check: no eyes, no mouth, so no lip-sync). Here the face
//                                (eye line to mouth) is centred in the glass and the glass is widened on small tiles.
//                                Used by kits/call-boardside.ts for tiles narrower than 130 px; v4's drawAlyiTile is untouched.
//   drawAlyiDoorPhone(b, f, st)  CAST-ALYI-PHONE, S7.01's box: drawDoorwayP2 with Alyi reading his post on his phone (eyes
//                                down, the phone lit at his chest), then looking up at the hearts (st.up: twoshots' alyiUp)
// Eyes in the portrait (after its 3 px drop): near x 49-59, far x 38-43, rows 47-49; the socket is S0, the white S2.
import {Buf, rect, bayer} from '../px';
import {PAL, lightness} from '../palette';
import {Img, blitImg} from '../figure';
import {memo} from './kit';
import {alyiSpeakPortrait, AlyiSpeakState, alyiReflection} from './alyi-speak';
import {ALYI_PW} from './alyi';
import {tileClip, clipped} from './calltile';
import {drawDoorwayP2, DoorwayP2State, WR} from '../rooms/twoshots';

export type AlyiLookDir = 'ahead' | 'left' | 'right' | 'down' | 'door';
// Eye whites one rung up from the portrait's S2 (S3) and a true-black pupil, so the look reads at 1:1 in a 480 x 270
// frame (the first build's 1-2 px shifts in S2 whites read cold as "no change" on the stills sheet). Every direction,
// 'ahead' included, is a patch in the same palette, so a cut or a held swap between looks never changes the whites.
// L (a lowered lid) is the socket's skin one rung up.
const EYE_PAL: Record<string, number> = {k: PAL.S0, w: PAL.S3, i: PAL.B2, I: PAL.N0, g: PAL.W8, s: PAL.S0, L: PAL.S2};
// near eye: x 49-59 (whites x 51-57 on row 48, x 52-56 on row 49); far eye: x 38-43; rows 47-49
const NEAR: Record<Exclude<AlyiLookDir, 'door'>, string[]> = {
  ahead: ['sssssssssss', 'kkwwiIgwwkk', 'kkkwiIIwkkk'],
  left: ['sssssssssss', 'kkiIgwwwwkk', 'kkkIIwwwkkk'],
  right: ['sssssssssss', 'kkwwwwiIgkk', 'kkkwwwIIkkk'],
  down: ['sssssssssss', 'kkLLLLLLLkk', 'kkkwiIiwkkk'],
};
const FAR: Record<Exclude<AlyiLookDir, 'door'>, string[]> = {
  ahead: ['ssssss', 'kwiIgk', 'kwiIkk'],
  left: ['ssssss', 'kIgwwk', 'kIIwkk'],
  right: ['ssssss', 'kwwIgk', 'kwwIIk'],
  down: ['ssssss', 'kLLLLk', 'kwIIwk'],
};
const patch = (img: Img, x0: number, y0: number, rows: string[]) => {
  rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = EYE_PAL[r[i]]; if (c !== undefined && img.c[(y0 + j) * img.w + x0 + i] >= 0) img.c[(y0 + j) * img.w + x0 + i] = c; } });
};
export const alyiLook = memo((p: AlyiSpeakState & {dir: AlyiLookDir}): Img => {
  const base = alyiSpeakPortrait({mouth: p.mouth, eyes: p.dir === 'down' ? 'open' : p.eyes, t: p.t});
  const out: Img = {w: base.w, h: base.h, c: new Int32Array(base.c)};
  const dir = p.dir === 'door' ? 'right' : p.dir;
  if (p.eyes !== 'open' && p.dir !== 'down') return out; // closed or GLYPH eyes: the portrait as drawn
  patch(out, 49, 47, NEAR[dir]);
  patch(out, 38, 47, FAR[dir]);
  return out;
});
// the glass mapping (copied from alyi-speak.ts alyiReflection: lightness onto a dim cool ramp, the darkest drop out)
const GLASS_RAMP = [-1, -1, -1, -2, PAL.N3, PAL.N4, PAL.N5, PAL.C2];
export const alyiReflectionLook = (s: AlyiSpeakState, dir: AlyiLookDir): Img => reflMemo({...s, dir});
const reflMemo = memo((p: AlyiSpeakState & {dir: AlyiLookDir}): Img => {
  // in a mirror a look to HIS right shows as a look to OUR left: 'door' (the door is right of the glass in S4.13d) is
  // drawn as his 'left' so the mirrored reflection looks right, at it
  const src = alyiLook({mouth: p.mouth, eyes: p.eyes, t: p.t, dir: p.dir === 'door' ? 'left' : p.dir});
  const out: Img = {w: src.w, h: src.h, c: new Int32Array(src.w * src.h).fill(-1)};
  for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
    const v = src.c[y * src.w + (src.w - 1 - x)];
    if (v < 0) continue;
    const L = lightness(v);
    const k = Math.max(0, Math.min(GLASS_RAMP.length - 1, Math.floor((L - 0.1) / 0.075)));
    let c = GLASS_RAMP[k];
    if (c === -2) c = ((x + y) & 1) === 0 ? PAL.N3 : -1;
    out.c[y * src.w + x] = v === PAL.C6 || v === PAL.C8 ? PAL.C6 : c;
  }
  return out;
});

// ------------------------------------------------------------------ CAST-ALYI-PHONE: S7.01's box
export interface AlyiDoorPhoneState extends DoorwayP2State {
  /** reading his post on his phone (eyes down, the phone lit) until he looks up (st.alyi.up) */
  phone?: boolean;
}
/** drawDoorwayP2, then Alyi's window re-dressed: eyes down to the phone at his chest, lit, in his near hand */
export const drawAlyiDoorPhone = (b: Buf, f: number, s: AlyiDoorPhoneState = {}) => {
  drawDoorwayP2(b, f, s);
  if (!s.phone || (s.openR ?? 1) < 1) return;
  const [wx, wy] = WR;
  const up = s.alyi?.up;
  // the eyes (window x + 4 is where twoshots blits his portrait)
  if (!up) {
    const img = alyiLook({mouth: s.alyi?.mouth ?? 'rest', eyes: 'open', t: f, dir: 'down'});
    for (let y = 46; y < 51; y++) for (let x = 36; x < 62; x++) { const v = img.c[y * img.w + x]; if (v >= 0) b.set(wx + 4 + x, wy + y, v); }
  }
  // the phone at his chest in the window: a dark slab, its screen lit (his post's shape), his fingers round it
  const px = wx + 58, py = wy + 104;
  rect(px - 1, py - 1, 18, 26, b.ink(PAL.N0));
  rect(px, py, 16, 24, b.ink(PAL.N1));
  rect(px + 1, py + 2, 14, 19, b.ink(up ? PAL.N3 : PAL.N4));
  if (!up) { rect(px + 2, py + 4, 3, 3, b.ink(PAL.W5)); rect(px + 6, py + 4, 8, 1, b.ink(PAL.P1)); for (let j = 0; j < 4; j++) rect(px + 2, py + 9 + j * 3, 11 - (j % 2) * 3, 1, b.ink(PAL.P0)); }
  // his fingers: three pale knuckles over the phone's left edge, the thumb on its right
  for (let j = 0; j < 3; j++) { rect(px - 3, py + 8 + j * 4, 4, 3, b.ink(PAL.S3)); rect(px - 3, py + 8 + j * 4, 4, 1, b.ink(PAL.S4)); }
  rect(px + 14, py + 6, 3, 6, b.ink(PAL.S3));
  // the screen's light on his chin (a palette step, never a blend)
  for (let y = wy + 80; y < wy + 96; y++) for (let x = wx + 44; x < wx + 74; x++) if (((x + y) & 1) === 0) { const c = b.get(x, y); if (c === PAL.S1 || c === PAL.S0) b.set(x, y, c === PAL.S0 ? PAL.S1 : PAL.S2); }
};

// ------------------------------------------------------------------ his call tile, framed for any size (r3)
/** portrait coords of what must show in the glass: the eye line (y 47-49) to the mouth (y 74-79); the face's centre
 *  column, mirrored (the reflection is mirrored: portrait x 47 lands at ALYI_PW - 1 - 47) */
const FACE_CY = 63, FACE_CX = 47, FACE_CX_MIRRORED = ALYI_PW - 1 - FACE_CX;
/** a4p5 finish (opt-in `lit`, the board's side of the call): the same doorway tile with the door OPEN and the man in it,
 *  lit by his own screen (alyiSpeakPortrait as S3.07 draws him, not mirrored), in place of his reflection in its glass.
 *  The picture audit (§2.9) and the newcomer read: on the board's laptops the navy reflection delivering the firing line
 *  read as a shadow, and as "an android"; the board sees the man, his side keeps the reflection. Default: the r3 drawing. */
export const drawAlyiTileFit = (b0: Buf, x: number, y: number, w: number, h: number, s: AlyiSpeakState, o: {flicker?: 'there' | 'gone'; lit?: boolean} = {}) => {
  const clip = tileClip(x, y, w, h);
  const b = clipped(b0, clip);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, bayer(x + i, y + j) < 0.3 ? PAL.W1 : PAL.W0);
  // the door: 46% of the tile as v4, but never narrower than the face needs (small tiles widen it, to w - 16 at most)
  const dw = Math.max(Math.round(w * 0.46), Math.min(w - 16, 50)), dx = x + Math.round((w - dw) / 2);
  rect(dx - 5, y, dw + 10, h, b.ink(PAL.D2)); rect(dx - 5, y, 2, h, b.ink(PAL.D3)); rect(dx + dw + 3, y, 2, h, b.ink(PAL.D1));
  rect(dx - 1, y, dw + 2, h, b.ink(PAL.D1));
  const gx = dx + 3, gy = y + 3, gw = dw - 6, gh = h - 3;
  const gc = tileClip(gx, gy, gw, gh);
  if (o.lit) {
    // the open doorway: the dark corridor behind him (a 2-rung ordered screen), the man lit in it, no glass sheen
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) b.set(gx + i, gy + j, bayer(gx + i, gy + j) < 0.35 ? PAL.D0 : PAL.N1);
    const img = alyiSpeakPortrait({mouth: s.mouth, eyes: s.eyes, t: s.t});
    const oy = Math.min(Math.round(gh * 0.48), gh - 30);
    blitImg(b0, img, gx + Math.round(gw / 2) - FACE_CX, gy + oy - FACE_CY, {clip: (px, py) => gc(px, py) && clip(px, py)});
    rect(gx - 1, gy + Math.round(gh * 0.55), 1, 6, b.ink(PAL.G4)); // the door's handle, on the jamb
    return;
  }
  rect(gx, gy, gw, gh, b.ink(PAL.N1));
  if (o.flicker !== 'gone') {
    const img = alyiReflection({...s, mirror: true});
    // the face centred in the glass; a tall tile keeps v4's lower placement (his shoulders in the glass)
    const oy = Math.min(Math.round(gh * 0.48), gh - 30);
    blitImg(b0, img, gx + Math.round(gw / 2) - FACE_CX_MIRRORED, gy + oy - FACE_CY, {clip: (px, py) => gc(px, py) && clip(px, py)});
  }
  // the glass's sheen: two thin diagonal streaks fixed to the glass
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const u = i + j * 0.55;
    if ((u > gw * 0.12 && u < gw * 0.12 + 2) || (u > gw * 0.2 && u < gw * 0.2 + 1)) { const X = gx + i, Y = gy + j; if (bayer(X, Y) < 0.5 && clip(X, Y)) b0.set(X, Y, PAL.N4); }
  }
  rect(gx - 1, gy + Math.round(gh * 0.55), 2, 6, b.ink(PAL.G4));
};
