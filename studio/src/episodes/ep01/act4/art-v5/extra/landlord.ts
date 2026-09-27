// MR. MAS — Ep1 Act Four v5, EXTRA pixel assets: TASYA'S ROOM REMAP, the E1-P3 staging in pixel (S7.02b "below, above,
// around"; the PROP-PODCAST-BOOM option). New file, owned by the v5 extra art pass (a4fin-pixelextra).
//
// Where this sits (style-range 1.D, ruling R25): the FINAL 1.D is the landlord's flat-vector house style, prototyped as
// E1-P3 (src/dev/range/ep1-p3, a Remotion clip on the v5 takes; vector paths at output resolution, which the Node pixel
// renderer can't draw). Until R25 is ruled, the v5 preview's DEFAULT is v4's pixel palette steps (rooms/bullpen.ts
// bullpenLandlord: floor / ceiling / walls step to MACROSOFT slate in three held region steps). This module is a third
// option between the two: the same master-palette remap (a switch, never a redraw: PIXEL_GUIDE §2 rule 5), but moved the
// way E1-P3 moves, so a pixel cut and a 1.D cut play the same beats if the room compares them:
//   "below"  the floor goes slate outward from under Tasya's feet, both ways, in held 2-frame steps over ~12 frames;
//   "above"  the ceiling from over his head, the same way;
//   "around" the walls (and the NOPE AI neon: he owns the sign too) go slate as a ring closing in from the frame's corners
//            onto MAS at his end desk (over ~16 frames), so the last of NopeAI's colour in the room is the wall around him.
//            island > 0 keeps a small circle around him unremapped at the end (E1-P3's "one pixel island"); the default 0
//            ends all-slate, which matches v4's S7.03 (v3 30.06: Mas over the all-slate bullpen).
//
//   drawLandlordRemapPlate(b, f, st)  the room plate for S7.02b's MCU (the host softens it and draws Tasya's bust over it,
//                         exactly where v4's S7.02b passes `(b) => bullpenRoom(b, 0, {variant: 'walkout'}, {mas: false,
//                         tasya: null, landlord: L})` to MCU()). st.below / st.above / st.around = frames since each word
//                         (undefined or < 0 = not yet); st.mas draws Mas at his end desk (the ring's target; default true);
//                         st.island (px, default 0).
//   landlordRemapKey(st)  a cache key (the held step of each spread) for a host that holds the softened plate.
//   landlordRemapAt(k, marks)  st from a shot frame and the lock's word marks ({below, above, around} in shot frames,
//                         shots-locked-v5.json S7.02b marks: 126 / 149 / 172).
//   drawPodcastBoom(b, mx, my, step)  the optional generic podcast mic on a boom (script 5.1: it "dips into frame in front
//                         of him, from nowhere ... it lifts away after 'around them'"; cut it if 1.D is taken). (mx, my) =
//                         the mic head's centre when it is in; step 0 out .. 3 in (3 held drawings in, the same 3 out).
//   boomStepAt(k, kIn, kOut)   the held step for shot frame k: in over 3 x 2 frames from kIn, out the same from kOut.
import {Buf, rect, line, bayer} from '../../../../../shared/pixel/px';
import {PAL} from '../../../../../shared/pixel/palette';
import {drawBullpen, toSlate} from '../../../../../shared/pixel/rooms/bullpen';
import {drawMasDesk, MAS_DESK_DEFAULT} from '../../../../../shared/pixel/cast/mas';

export interface LandlordRemapState { below?: number; above?: number; around?: number; mas?: boolean; island?: number; origin?: [number, number]; }
const held2 = (t: number) => t - (t % 2);
const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
/** the room plate with the spreading remap (Node-safe; 480 x 203 into b's top) */
export const drawLandlordRemapPlate = (b: Buf, f: number, st: LandlordRemapState = {}) => {
  const mas = st.mas !== false;
  const room = drawBullpen(b, f, {variant: 'walkout', masGlass: !mas});
  const A = room.anchors;
  if (mas) {
    const [mx, my] = A.masDesk;
    drawMasDesk(b, mx, my, {...MAS_DESK_DEFAULT, head: 'screen', light: 'monitor'});
  }
  const [ox, oy] = st.origin ?? A.tasyaFloor;
  const W = 480, H = 203;
  const on = (m: {a: Uint8Array}, x: number, y: number) => m.a[y * W + x] !== 0;
  // below: the floor, an ellipse from his feet (the floor's perspective squashes it), wide enough to take the room at 12 f
  if (st.below !== undefined && st.below >= 0) {
    const e = easeOut(Math.min(1, held2(st.below) / 12));
    const rx = 12 + e * 520, ry = 3 + e * 120;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (on(room.masks.floor, x, y) && ((x - ox) / rx) ** 2 + ((y - oy) / ry) ** 2 <= 1) b.set(x, y, toSlate(b.get(x, y)));
  }
  // above: the ceiling, from the point over his head
  if (st.above !== undefined && st.above >= 0) {
    const e = easeOut(Math.min(1, held2(st.above) / 12));
    const rx = 12 + e * 520, ry = 2 + e * 40;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (on(room.masks.ceiling, x, y) && ((x - ox) / rx) ** 2 + (y / ry) ** 2 <= 1) b.set(x, y, toSlate(b.get(x, y)));
  }
  // around: the walls and the sign, a ring closing from the corners onto Mas
  if (st.around !== undefined && st.around >= 0) {
    const [tx, ty] = mas ? [A.masDesk[0] + 22, A.masDesk[1] + 18] : [ox, oy - 60];
    const R0 = Math.max(Math.hypot(tx, ty), Math.hypot(W - tx, ty), Math.hypot(tx, H - ty), Math.hypot(W - tx, H - ty)) + 4;
    const e = Math.min(1, held2(st.around) / 16);
    const island = st.island ?? 0;
    const R = e >= 1 ? island : Math.max(island, R0 * Math.pow(1 - e, 2.2));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!on(room.masks.walls, x, y) && !on(room.masks.sign, x, y)) continue;
      if (Math.hypot(x - tx, (y - ty) * 1.15) >= R) b.set(x, y, toSlate(b.get(x, y)));
    }
  }
  return room;
};
/** a cache key for a host that holds the softened plate (v4's MCU() caches by key): the held step of each spread */
export const landlordRemapKey = (st: LandlordRemapState) => {
  const q = (t: number | undefined, end: number) => (t === undefined || t < 0 ? -1 : Math.min(end, held2(t)));
  return `lrpx-${q(st.below, 12)}-${q(st.above, 12)}-${q(st.around, 16)}-${st.mas === false ? 0 : 1}-${st.island ?? 0}`;
};
/** the plate state for shot frame k, from the word marks (shot frames) */
export const landlordRemapAt = (k: number, marks: {below: number; above: number; around: number}): LandlordRemapState => ({
  below: k - marks.below, above: k - marks.above, around: k - marks.around,
});

// ================================================================== the optional podcast boom
/** 0 out, 1-2 on its way, 3 in; in over 3 held 2-frame steps from kIn, out the same from kOut */
export const boomStepAt = (k: number, kIn: number, kOut: number): 0 | 1 | 2 | 3 => {
  if (k < kIn) return 0;
  const i = Math.min(3, 1 + Math.floor((k - kIn) / 2));
  if (k < kOut) return i as 0 | 1 | 2 | 3;
  return Math.max(0, 3 - 1 - Math.floor((k - kOut) / 2)) as 0 | 1 | 2 | 3;
};
/**
 * A generic end-address podcast mic in a shock-mount ring on a spring boom arm, dipping in from the top-left of frame to
 * sit in front of his mouth (the head toward him, the body angled up-left, the arm leaving the frame's top). Metal greys
 * (G1-G6) with the room's slate daylight on its lit edge; the grille a fine mesh (a 50% pattern: it is a metal mesh, not
 * dither on a figure). No brand, no light, no cable colour.
 */
export const drawPodcastBoom = (b: Buf, mx: number, my: number, step: 0 | 1 | 2 | 3, o: {maxY?: number} = {}) => {
  if (step === 0) return;
  const maxY = o.maxY ?? 203;
  const OFF = [0, 64, 22, 0][step]; // px back along the arm, per held step
  const ax = -0.62, ay = -0.78; // the arm's direction from the mount (up-left)
  const hx = mx + ax * OFF, hy = my + ay * OFF; // the head's centre this step
  const put = (x: number, y: number, c: number) => { if (y >= 0 && y < maxY) b.set(Math.round(x), Math.round(y), c); };
  // the mic body: from the head (toward him) back up-left, 11 px thick, 30 px long
  const bx = -0.82, by = -0.57; // the body's axis (head -> tail)
  const nx = -by, ny = bx; // across it
  const L = 40, R = 7;
  for (let t = 0; t <= L; t += 0.5) for (let u = -R; u <= R; u += 0.5) {
    const x = hx + bx * t + nx * u, y = hy + by * t + ny * u;
    const e = u / R; // -1 .. 1 (the lit side is +u: toward the window, camera-right/up)
    let c: number;
    if (t < 12) { // the grille: a rounded head, a fine mesh
      const round = Math.abs(e) > Math.sqrt(Math.max(0, 1 - ((12 - t) / 12) ** 6)) * 0.98;
      if (t < 0.6 || round) { if (Math.abs(e) < 1.02) c = PAL.N1; else continue; }
      else c = (Math.round(x) + Math.round(y)) % 2 ? (e > 0.35 ? PAL.G5 : PAL.G3) : (e > 0.35 ? PAL.G3 : PAL.G1);
    } else if (t < 14) c = e > 0.3 ? PAL.G6 : PAL.G4; // the grille's trim ring
    else c = Math.abs(e) > 0.9 ? PAL.N0 : e > 0.45 ? PAL.G4 : e > -0.2 ? PAL.G2 : PAL.G1;
    put(x, y, c);
  }
  // the shock mount: a ring around the body's middle, its two arms to the yoke
  const cx = hx + bx * 26, cy = hy + by * 26;
  for (let a = 0; a < 360; a += 6) { const r = (a * Math.PI) / 180; put(cx + Math.cos(r) * 11, cy + Math.sin(r) * 11, a > 200 && a < 340 ? PAL.G4 : PAL.N2); }
  for (let a = 0; a < 360; a += 45) { const r = (a * Math.PI) / 180; line(Math.round(cx + Math.cos(r) * 7), Math.round(cy + Math.sin(r) * 7), Math.round(cx + Math.cos(r) * 11), Math.round(cy + Math.sin(r) * 11), (x, y) => put(x, y, PAL.N3)); }
  // the boom arm: two parallel rods up-left out of the frame, a spring along the upper one
  const sx = cx + ax * 10, sy = cy + ay * 10;
  line(Math.round(cx), Math.round(cy - 9), Math.round(sx), Math.round(sy), (x, y) => put(x, y, PAL.G3)); // the yoke
  for (let t = 0; t < 400; t++) {
    const x = sx + ax * t, y = sy + ay * t;
    if (y < -4 || x < -4) break;
    put(x, y, PAL.G1); put(x + 1, y, PAL.G4); // the lower rod (lit edge)
    put(x + 4, y - 3, PAL.G1); put(x + 5, y - 3, PAL.G3); // the upper rod
    if (t % 3 === 0) { put(x + 2, y - 1, PAL.G5); put(x + 3, y - 2, PAL.G2); } // the spring's coils
  }
  // the cable: a dark line from the tail, down along the arm
  for (let t = 0; t < 26; t++) put(hx + bx * (L + 1) + ax * t * 0.2 + t * 0.1, hy + by * (L + 1) + t * 0.55, bayer(t, 0) < 0.5 ? PAL.N0 : PAL.N1);
  void rect;
};
