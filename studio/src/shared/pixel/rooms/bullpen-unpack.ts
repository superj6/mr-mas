// MR. MAS — shared room: THE BULLPEN, NOV 29 (ROOM-BULLPEN-UNPACK; Ep1 Act Four v5 art pass; new file, owned by the v5
// art pass). S8.08 [W]: "The bullpen by day: coats off, the boxes open and being unpacked, the staff turned toward MAS
// at his end desk. He reads his memo to the room." The mirror of S7.02's walkout (rooms/bullpen.ts 'walkout': coats
// on, a packed box on every desk), drawn on the same room, which is untouched:
//   drawBullpenUnpack(b, f, o)   the bullpen 'day' + open boxes on the desks (things out beside them), coats off and
//                                draped over the chair backs, the staff in shirtsleeves standing and turned toward his
//                                end desk (station 3, in front of the conference door), MAS at it at room scale
//                                (cast/mas.ts drawMasDesk) with his mouth for the read (o.mas.mouth 'open' / 'rest').
//                                o.drift: the shot's whole-pixel drift (0..8 px, the room and everyone in it)
//   openBox(kind)                a kraft box with its flaps open and its contents half out (22 x 28; kind 0..4)
//   shirtExtra(seed, o)          a staff member in shirtsleeves (bullpen.ts walkoutExtra with no box, the coat's four
//                                rungs remapped to a shirt's, cut at the belt; below it trousers, the arms to the hips)
//   UNPACK_STAFF                 who stands where (x, foot, seed, shirt, what they hold)
// Facing: the staff left of his desk face screen-right, the ones right of it are flipped; all look at him.
// NOTE for the lead: the bullpen's geometry puts Mas's end desk right of centre (station 3, x 264-330), as v4's S7.02
// did; the script's "MAS ... at his end desk, left" would need the room itself re-staged (not an art-only change).
import {Buf, rect} from '../px';
import {PAL} from '../palette';
import type {Img} from '../figure';
import {drawBullpen, walkoutExtra, BULLPEN, EXTRA_H} from './bullpen';
import {RoomOut, newImg, imgPut, put, h01} from './kit-b';
import {drawMasDesk, MAS_DESK_DEFAULT, MasDeskPose} from '../cast/mas';

const G = BULLPEN;

// ------------------------------------------------------------------ an open box
/** A kraft box (the walkout's packedBox, opened): the two top flaps folded out, the dark inside, something half out.
 *  22 x 28, its base on the bottom row. kind 0 plant · 1 lamp arm · 2 rolled poster · 3 mug + notebooks · 4 a frame */
export const openBox = (kind: number): Img => {
  const img = newImg(22, 28);
  const T = 14; // the box's top edge
  const W2 = 16, H2 = 12, x0 = 3;
  // the flaps, folded out: the left one leaning out-left, the right one out-right (light on the right-hand faces)
  for (let j = 0; j < 5; j++) { for (let i = 0; i < 6; i++) imgPut(img, x0 - 3 + i + (4 - j) * 0, T - 1 - j, j === 4 ? PAL.W4 : PAL.D4); imgPut(img, x0 - 3 - j + 5, T - 1 - j, PAL.D3); }
  for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) imgPut(img, x0 + W2 - 3 + i, T - 1 - j, i === 5 || j === 4 ? PAL.W5 : PAL.W4);
  // the inside: dark, its back wall a rung lighter
  for (let y = T; y < T + 3; y++) for (let x = x0; x < x0 + W2; x++) imgPut(img, x, y, y === T ? PAL.D2 : PAL.D1);
  // the body: front face, right side toward the window light, the tape cut open, the base
  for (let y = T + 3; y < T + H2; y++) for (let x = x0; x < x0 + W2; x++) imgPut(img, x, y, x >= x0 + W2 - 4 ? PAL.W4 : y === T + 3 ? PAL.W4 : PAL.D4);
  for (let y = T + 3; y < T + 6; y++) imgPut(img, x0 + 6, y, PAL.P0); // the tape's cut end hanging
  for (let x = x0; x < x0 + W2; x++) imgPut(img, x, T + H2 - 1, PAL.D2);
  // what is half out
  const cx = x0 + 8;
  if (kind === 0) { for (let y = T - 6; y < T + 1; y++) imgPut(img, cx, y, PAL.L1); for (const [x, y] of [[cx - 2, T - 7], [cx - 1, T - 6], [cx + 1, T - 8], [cx + 2, T - 7], [cx - 3, T - 5], [cx + 3, T - 5], [cx, T - 9]]) imgPut(img, x, y, PAL.L2); for (const [x, y] of [[cx - 2, T - 6], [cx + 2, T - 6], [cx, T - 8]]) imgPut(img, x, y, PAL.L3); }
  else if (kind === 1) { for (let k = 0; k < 8; k++) imgPut(img, cx - 4 + k, T - k, PAL.G4); for (let x = cx + 2; x < cx + 8; x++) imgPut(img, x, T - 8, PAL.G5); for (let x = cx + 3; x < cx + 7; x++) imgPut(img, x, T - 7, PAL.G3); }
  else if (kind === 2) { for (let y = T - 11; y < T + 1; y++) { imgPut(img, cx + 2, y, PAL.P1); imgPut(img, cx + 3, y, PAL.P2); } imgPut(img, cx + 2, T - 12, PAL.P0); imgPut(img, cx + 3, T - 12, PAL.P0); }
  else if (kind === 3) { for (let k = 0; k < 3; k++) for (let x = cx - 5; x < cx + 3; x++) imgPut(img, x, T - k, [PAL.F4, PAL.L2, PAL.U3][k]); }
  else { for (let y = T - 9; y < T + 1; y++) for (let x = cx - 3; x < cx + 4; x++) imgPut(img, x, y, x === cx - 3 || x === cx + 3 || y === T - 9 ? PAL.D3 : PAL.P1); for (let y = T - 7; y < T - 2; y++) for (let x = cx - 1; x < cx + 2; x++) imgPut(img, x, y, PAL.F4); }
  return img;
};
/** things set out on the desk beside a box: a mug, a small plant, a stack of notebooks, a desk photo (x, y = base) */
const deskThing = (b: Buf, x: number, y: number, k: number) => {
  if (k === 0) { rect(x, y - 5, 4, 5, b.ink(PAL.P2)); rect(x + 3, y - 5, 1, 5, b.ink(PAL.G4)); b.set(x + 4, y - 4, PAL.P1); b.set(x + 4, y - 3, PAL.P1); }
  else if (k === 1) { rect(x, y - 3, 5, 3, b.ink(PAL.W4)); for (const [dx, dy] of [[1, -4], [2, -6], [3, -5], [0, -5], [4, -4], [2, -5]]) b.set(x + dx, y + dy, dy < -5 ? PAL.L3 : PAL.L2); }
  else if (k === 2) { for (let j = 0; j < 3; j++) rect(x, y - 1 - j, 8, 1, b.ink([PAL.F4, PAL.U3, PAL.L2][j])); }
  else { rect(x, y - 7, 6, 7, b.ink(PAL.D3)); rect(x + 1, y - 6, 4, 5, b.ink(PAL.P1)); rect(x + 2, y - 5, 2, 3, b.ink(PAL.F4)); }
};

// ------------------------------------------------------------------ the staff in shirtsleeves
/** a shirt's four rungs (shadow, body, lit side, rim), replacing the coat's */
const SHIRTS: Array<[number, number, number, number]> = [
  [PAL.G4, PAL.G5, PAL.G6, PAL.P2], // white shirt
  [PAL.F3, PAL.F4, PAL.F5, PAL.F6], // blue oxford
  [PAL.U2, PAL.U3, PAL.U4, PAL.U5], // plum tee
  [PAL.L0, PAL.L1, PAL.L2, PAL.L3], // green tee
  [PAL.D3, PAL.D4, PAL.W3, PAL.W4], // tan sweater
  [PAL.G2, PAL.G3, PAL.G4, PAL.G6], // grey hoodie
];
/** bullpen.ts COATS[6] (light grey): the walkout extra is drawn in it, then its four rungs are remapped to the shirt */
const COAT6 = [PAL.G2, PAL.G3, PAL.G4, PAL.G6];
/** seeds whose walkout extra wears a SHORT coat (it ends at the belt: a shirt reads right), in order */
const SHORT_SEEDS: number[] = (() => { const out: number[] = []; for (let s = 1; out.length < 24 && s < 400; s++) if (h01(s, 25) >= 0.55) out.push(s); return out; })();
export type StaffHold = 'none' | 'mug' | 'plant' | 'papers';
export const shirtExtra = (seed: number, o: {shirt?: number; hold?: StaffHold; flip?: boolean} = {}): Img => {
  const src = walkoutExtra(seed, {box: false, coat: 6});
  const sh = SHIRTS[(o.shirt ?? 0) % SHIRTS.length];
  const img = newImg(src.w, src.h);
  // walkoutExtra's height variation (its r(9)) and its trousers' colour (sampled on the near leg)
  const dy = Math.floor(h01(seed, 29) * 4);
  const pants = src.c[62 * src.w + 12];
  const belt = 41 + dy;
  const legTop = (h01(seed, 25) < 0.55 ? 58 : 48) + dy; // a long coat's skirt reaches lower: trousers from the belt
  const skin = src.c[(15 + dy) * src.w + 14];
  for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
    let v = src.c[y * src.w + x];
    if (v >= 0 && y >= 14 && y < 64) {
      const i = COAT6.indexOf(v);
      const arm = Math.abs(x - 15) === 11;
      if (y < belt) { if (i >= 0) v = sh[i]; }
      else if (y === belt) v = Math.abs(x - 15) <= 9 ? PAL.N1 : arm && i >= 0 ? sh[i] : -1;
      // a shirt ends at the belt: below it the coat's skirt becomes the trousers (narrowed to the legs' width), the
      // arms run on to the hands at the hips
      else if (Math.abs(x - 15) <= 6) v = x === 9 ? PAL.N0 : i >= 0 || v === PAL.N0 ? pants : v;
      else if (arm && y <= belt + 3) v = i >= 0 ? sh[i] : v;
      else if (arm && y <= belt + 5) v = skin;
      else if (y < legTop) v = -1;
    }
    img.c[y * src.w + (o.flip ? src.w - 1 - x : x)] = v;
  }
  // what the free near hand holds (drawn after the flip, at the hand's side)
  const hx = o.flip ? 3 : src.w - 5, hy = 42 + Math.floor(h01(seed, 29) * 4);
  if (o.hold === 'mug') { for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) imgPut(img, hx + i, hy + j, i === 2 ? PAL.G5 : PAL.P2); }
  if (o.hold === 'plant') { for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) imgPut(img, hx + i - 1, hy + j, PAL.W4); for (const [i, j] of [[0, -1], [1, -2], [2, -1], [-1, -2], [1, -3]]) imgPut(img, hx + i, hy + j, j < -2 ? PAL.L3 : PAL.L2); }
  if (o.hold === 'papers') { for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) imgPut(img, hx + i - 1, hy - 2 + j, j === 0 ? PAL.P1 : PAL.P2); }
  return img;
};
/** the staff: x (foot centre), foot row, which short-coat seed, shirt, hold, behind the bench (cut at the desk top) */
export const UNPACK_STAFF: Array<{x: number; foot: number; seed: number; shirt: number; hold: StaffHold; behind: boolean}> = [
  {x: 110, foot: 150, seed: 0, shirt: 1, hold: 'none', behind: true},
  {x: 168, foot: 151, seed: 1, shirt: 0, hold: 'mug', behind: true},
  {x: 226, foot: 150, seed: 2, shirt: 3, hold: 'none', behind: true},
  {x: 356, foot: 152, seed: 3, shirt: 2, hold: 'papers', behind: false},
  {x: 408, foot: 150, seed: 4, shirt: 4, hold: 'none', behind: false},
  {x: 70, foot: 190, seed: 5, shirt: 5, hold: 'plant', behind: false},
  // a4p5 r2: the front row opened in front of his desk (the stills check found Mas "only on a second look": the
  // staffer at x 250 stood tall and bright a few pixels left of him). Now nobody in the front row stands within
  // ~75 px of him, so the eye runs down the others' looks to the one dark, lit figure at the end desk
  {x: 150, foot: 197, seed: 6, shirt: 0, hold: 'none', behind: false},
  {x: 216, foot: 199, seed: 7, shirt: 1, hold: 'mug', behind: false},
  {x: 430, foot: 193, seed: 8, shirt: 3, hold: 'none', behind: false},
];
/** a coat draped over a chair back or a desk corner: a folded slab with its collar */
const drapedCoat = (b: Buf, x: number, y: number, k: number) => {
  const C = [[PAL.D2, PAL.D3, PAL.D4], [PAL.F1, PAL.F2, PAL.F3], [PAL.G1, PAL.G2, PAL.G3], [PAL.L0, PAL.L1, PAL.L2]][k % 4];
  for (let j = 0; j < 12; j++) for (let i = 0; i < 9 - (j > 8 ? 1 : 0); i++) b.set(x + i, y + j, i === 0 ? C[0] : i > 6 ? C[2] : C[1]);
  for (let i = 0; i < 9; i++) b.set(x + i, y, C[2]);
  b.set(x + 3, y + 4, C[0]); b.set(x + 3, y + 5, C[0]); b.set(x + 4, y + 6, C[0]);
};

// ------------------------------------------------------------------ the room
export interface BullpenUnpackOpts {
  /** Mas at his end desk (room scale); his mouth for the read: 'open' on the words, 'rest' between */
  mas?: Partial<MasDeskPose> | null;
  /** the slow whole-pixel drift (px, 0..8): the whole room moves left one pixel at a time. The room is painted exactly
   *  480 wide, so the revealed right-edge columns are the last 8 reflected (the window wall; reads as more of it). A
   *  longer drift needs the plate painted wider */
  drift?: number;
}
const MAS_X = 294; // his desk's centre (station 3): where the staff look
export const drawBullpenUnpack = (b: Buf, f: number, o: BullpenUnpackOpts = {}): RoomOut => {
  const base = new Buf(480, 203 + 16, PAL.N0);
  const room = drawBullpen(base, f, {variant: 'day', door: 'shut', masGlass: o.mas === null ? undefined : false});
  const A = room.anchors as unknown as Record<string, [number, number]>;
  // the staff behind the bench (cut at the desk's back edge), then the open boxes and what came out, the coats on
  // the chair backs, then the bench front, the front row, and Mas
  const staff = (behind: boolean) => UNPACK_STAFF.filter((s) => s.behind === behind).forEach((s) => {
    const img = shirtExtra(SHORT_SEEDS[s.seed], {shirt: s.shirt, hold: s.hold, flip: s.x > MAS_X});
    put(base, img, s.x - 15, s.foot - EXTRA_H + 1, behind ? {clip: (_x, y) => y < G.bench.back} : {});
  });
  staff(true);
  G.stations.forEach(([sx0, sx1], i) => {
    if (i === 3) return; // his desk: his laptop and glass, no box
    const bx = Math.round((sx0 + sx1) / 2) - 12;
    put(base, openBox((i * 3 + 1) % 5), bx, G.bench.back - 26);
    deskThing(base, bx + 22, G.bench.back - 2, i);
    deskThing(base, bx - 8, G.bench.back - 2, (i + 2) % 4);
  });
  drapedCoat(base, G.stations[0][0] + 2, G.bench.back + 2, 0);
  drapedCoat(base, G.stations[2][1] - 12, G.bench.back + 2, 1);
  put(base, openBox(4), G.win.x0 + 30, G.win.y1 + 9 - 27);
  room.front?.(base);
  staff(false);
  if (o.mas !== null) {
    const [mx, my] = A.masDesk;
    drawMasDesk(base, mx, my, {...MAS_DESK_DEFAULT, head: 'turn', light: 'monitor', ...(o.mas ?? {})});
  }
  const dx = Math.max(0, Math.min(8, Math.round(o.drift ?? 0)));
  for (let y = 0; y < 203; y++) for (let x = 0; x < 480; x++) { const sx = x + dx; b.set(x, y, base.get(sx <= 479 ? sx : 958 - sx, y)); }
  return room;
};
