// MR. MAS — cast: THE ALL-HANDS EMPLOYEE WHO STANDS (CAST-EMP-STAND; Ep1 Act Four v5 art pass, round 3; new file, owned by
// the v5 art pass). S3.06 [W] the all-hands from the back: "One employee stands, hand up" and then "Her hand comes down;
// she stays standing" (S3.06's tail or S3.07). The all-hands is drawn as its attendees' webcam tiles filling the bullpen
// (rooms/bullpen.ts employeeTile, ALLHANDS_TILES; v4 raises one hand through a tile's top edge). Standing, in that
// language: her tile RISES above its row in 3 held steps and her torso shows under it, so she is taller than everyone
// seated, hand up or down. rooms/bullpen.ts is not edited; this paints over an already-drawn all-hands room.
//   drawEmployeeStanding(b, i, st)   tile i of ALLHANDS_TILES (v4's hand is tile 22): st.rise 0..3 (held steps of the
//                                    stand: 0 = seated as v4 draws it), st.hand true = up through the tile's top, false =
//                                    down. The seat she leaves is filled from the room's own colour between the tiles.
//                                    From rise 2 an amber attention ring rounds her tile (st.ring false: off; a4p5 r2)
//                                    Draw it into the room in ROOM coordinates, before any framing shift; over a frame
//                                    that is already shifted (v4 S3.06 shifts the room by MATCH_DX for the match cut),
//                                    pass o.dx = that shift
//   standAt(k, k0)                   the rise at frame k of a stand starting at k0 (a step every 3 frames, then held)
//   EMP_STAND_RISE                   px per step
import {Buf, rect} from '../px';
import {PAL, stepColor} from '../palette';
import {blitImg} from '../figure';
import {employeeTile, ALLHANDS_TILES, EMP_TILE} from '../rooms/bullpen';

export const EMP_STAND_RISE = [0, 4, 8, 11];
export interface EmpStandState {
  rise: 0 | 1 | 2 | 3; hand: boolean;
  /** a4p5 r2: the call app's attention ring round her risen tile (amber, 1 px, from rise 2), because among ~60 tiles the
   *  rise alone did not pop at 1x on the stills check. Default on; false turns it off */
  ring?: boolean;
  /** a4p5-lipsync (INF-LIPSYNC5): her mouth in her tile while she asks (S3.06; the animatic's roomMouth5 flap). 'open'
   *  darkens the tile's 2 px mouth and drops her lower lip a pixel; default 'rest' = the tile as drawn */
  mouth?: 'rest' | 'open';
}
export const EMP_STAND_WHO = 22; // v4's hand-up tile (S3.06 handsUp: [22])

export const drawEmployeeStanding = (b: Buf, i: number, st: EmpStandState, o: {dx?: number} = {}) => {
  const t0 = ALLHANDS_TILES[i], t = {...t0, x: t0.x + (o.dx ?? 0)};
  const W = EMP_TILE.w, H = EMP_TILE.h;
  const img = employeeTile(t.seed, {hand: st.hand});
  const dy = EMP_STAND_RISE[st.rise];
  if (dy === 0) { blitImg(b, img, t.x, t.y - 6); if (st.mouth === 'open') openMouth(b, img, t.x, t.y); return; }
  // clear the seat: every row of her old tile (and its 1 px drop shadow) takes the room colour just left of the tile
  for (let y = t.y - 6; y < t.y + H + 1; y++) {
    const c = b.get(t.x - 2, y);
    const rowHasHand = y < t.y; // the headroom rows are hers only where her raised hand was drawn
    for (let x = t.x; x < t.x + W + 1; x++) if (!rowHasHand || x >= t.x + 14) b.set(x, y, c);
  }
  // her torso under the raised tile: her top's colours (sampled from the tile's shoulders), a dark outline each side
  const top = [img.c[(6 + 18) * img.w + 5], img.c[(6 + 18) * img.w + 11], img.c[(6 + 18) * img.w + 16]];
  const y0 = t.y + H - dy, y1 = t.y + H;
  for (let y = y0 - 1; y < y1; y++) {
    rect(t.x + 4, y, 1, 1, b.ink(PAL.N0)); rect(t.x + 17, y, 1, 1, b.ink(PAL.N0));
    for (let x = t.x + 5; x < t.x + 17; x++) b.set(x, y, x > t.x + 13 ? top[2] : x < t.x + 8 ? top[0] : top[1]);
  }
  // the tile, raised, and its drop shadow on the row behind (one step darker, right and below its frame)
  blitImg(b, img, t.x, t.y - 6 - dy);
  if (st.mouth === 'open') openMouth(b, img, t.x, t.y - dy);
  for (let x = t.x + 1; x <= t.x + W; x++) { const y = t.y - dy + H; if (y < y0 - 1) b.set(x, y, stepColor(b.get(x, y), -2)); }
  for (let y = t.y - dy + 1; y < y0 - 1; y++) b.set(t.x + W, y, stepColor(b.get(t.x + W, y), -2));
  if (st.ring !== false && st.rise >= 2) {
    // the attention ring: 1 px outside her tile's frame, the corners left out (a UI ring, not a box)
    const rx = t.x - 1, ry = t.y - dy - 1, rw = W + 2, rh = H + 2;
    for (let x = rx + 1; x < rx + rw - 1; x++) { b.set(x, ry, PAL.W7); b.set(x, ry + rh - 1, PAL.W6); }
    for (let y = ry + 1; y < ry + rh - 1; y++) { b.set(rx, y, PAL.W7); b.set(rx + rw - 1, y, PAL.W6); }
  }
};
/** her tile's mouth open (bullpen.ts employeeTile draws it 2 px wide at head (hx + ex + 1, hy + 7): hx 8, ex 3, hy 5 for
 *  the default look to the door): the 2 px go dark, her lower lip (the tile's own mouth colour) one row under the left one.
 *  (x, y) = the tile's frame top-left on screen */
const EMP_MOUTH: [number, number] = [12, 12];
const openMouth = (b: Buf, img: {w: number; c: Int32Array}, x: number, y: number) => {
  const [mx, my] = EMP_MOUTH, lip = img.c[(my + 6) * img.w + mx];
  b.set(x + mx, y + my, PAL.N0); b.set(x + mx + 1, y + my, PAL.N0);
  if (lip >= 0) b.set(x + mx, y + my + 1, lip);
};
export const standAt = (k: number, k0: number): 0 | 1 | 2 | 3 => (k < k0 ? 0 : k < k0 + 3 ? 1 : k < k0 + 6 ? 2 : 3);
