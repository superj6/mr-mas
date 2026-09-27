// MR. MAS — shared room: THE SLATE DESKS through Tasya's door (ROOM-SLATE-DESKS; Ep1 Act Four v5 art pass; new file,
// owned by the v5 art pass). S5.11 [2S] and S5.12 [MCU] (sc 29): the slate-blue door that stepped up out of the dark
// room's back wall (rooms/darkroom-plate.ts `door`, untouched) now has a key that TURNS (3 held drawings), and on
// Tasya's "desk" it opens a crack: through it, in slate light, the desks, one for every employee, already labelled,
// as far back as the light goes. The desks are shown once, here (script 5.1).
//   drawSlateDoorOpen(b, f, o)   over a drawDarkPlate frame that has `door: 4`: the key turn (o.key 0..2), the crack
//                                (o.gap px, 0 = shut; the latch side is the right, where the key is) with the room
//                                beyond in it, the leaf's lit edge, and the slate light spilling onto the frame. Works
//                                under S5.12's soft() too: draw it into the held plate before the softening.
//   drawSlateBeyond(b, x, y, w, h, o)   the slate room alone, into any rect (a crack, a wider door, a pull-out)
//   slateDoorSign(b, dk)         Tasya's taped sign MAS / GERG / -> set LEFT of the crack (v4's doorSign sat across the
//                                latch side, where the crack would cut it); dk = palette rungs down (the rise, the rack)
//   SLATE_GAP                    the gap widths the script plays: crack 6 (the first held step), open 13 (on "desk")
//   keyTurnAt(k, t0)             the key's three held drawings from t0, a half-beat (8 f) apart
// Light: the slate room is its own key light (SLATE_RAMP, bullpen.ts: MACROSOFT slate between N7 and G4); depth steps
// each row down one rung until the last rows go to the shadow. No dither on the desks; ordered dither only in the
// floor's falloff (a background). Everything is whole pixels; nothing scales.
import {Buf, rect, bayer} from '../px';
import {PAL, stepColor} from '../palette';
import {pt, pw} from '../kits/uitype';
import {DPLATE} from './darkroom-plate';

const D = DPLATE.door;
/** the leaf's inner rect in the dark plate (darkroom-plate drawDoor: the frame is 3 px, the leaf's foot is the desk) */
export const SLATE_LEAF = {x0: D.x0 + 3, x1: D.x1 - 3, y0: D.y0 + 3, y1: DPLATE.deskY - 1};
/** the key's lock row in the leaf (drawDoor: ky = leaf top + 50) */
export const SLATE_KEY: [number, number] = [SLATE_LEAF.x1 - 4, SLATE_LEAF.y0 + 50];
export const SLATE_GAP = {crack: 6, open: 13};

/** the key's three held drawings, a half-beat apart from t0 (0 bow face-on, 1 turning, 2 edge-on: unlocked) */
export const keyTurnAt = (k: number, t0: number): 0 | 1 | 2 => (k < t0 + 8 ? 0 : k < t0 + 16 ? 1 : 2);

// ------------------------------------------------------------------ the room beyond
/** depth rows of desks (1 = the nearest row, just past the door); the light holds to about row 7 */
const ROWS = [1.15, 1.5, 1.95, 2.55, 3.35, 4.4, 5.8, 7.6, 10];
const lightAt = (d: number) => (d < 2.2 ? 0 : d < 3.2 ? -1 : d < 4.6 ? -2 : d < 6.5 ? -3 : -4);
const slate = (c: number, k: number) => {
  let v = c;
  for (let i = 0; i < -k; i++) { const n = stepColor(v, -1); if (n === v) break; v = n; }
  return v;
};
export interface SlateBeyondOpts {
  /** where the corridor recedes to, relative to the rect (0..1); default a little left of centre, eye height 0.42 */
  vp?: [number, number];
  /** how many desk rows show before the light gives out */
  rows?: number;
  /** labels on the desks (default on): the name cards that make them "already labelled" */
  labels?: boolean;
}
/**
 * The slate room seen through an opening: a pale slate ceiling with its light panels in perspective, a slate floor
 * falling off to the dark, and rows of desks receding, each with a chair back and a white name card, row after row
 * "as far back as the light goes". Paints only inside (x, y, w, h).
 */
export const drawSlateBeyond = (b: Buf, x: number, y: number, w: number, h: number, o: SlateBeyondOpts = {}) => {
  const [fx, fy] = o.vp ?? [0.35, 0.42];
  const vx = x + Math.round(w * fx), vy = y + Math.round(h * fy);
  const y1 = y + h - 1;
  const inR = (px: number, py: number) => px >= x && px < x + w && py >= y && py < y + h;
  const put = (px: number, py: number, c: number) => { if (inR(px, py)) b.set(px, py, c); };
  const hl = (x0: number, x1: number, py: number, c: number) => { for (let px = x0; px <= x1; px++) put(px, py, c); };
  // ceiling and back: the slate light's source. Bright near the top, a step down toward the horizon
  for (let py = y; py <= vy; py++) {
    const t = (py - y) / Math.max(1, vy - y);
    for (let px = x; px < x + w; px++) {
      const c = t < 0.35 ? PAL.N7 : t < 0.7 ? PAL.N6 : PAL.N5;
      put(px, py, c);
    }
  }
  // the light panels: short bright bars on the ceiling, closer together toward the horizon (depth rows)
  for (const d of [1.1, 1.6, 2.4, 3.6, 5.4]) {
    const py = Math.round(vy - (vy - y) / d);
    if (py <= y || py >= vy - 1) continue;
    const half = Math.max(1, Math.round((w * 0.45) / d));
    hl(vx - half, vx + half, py, d < 2 ? PAL.G6 : PAL.N8);
  }
  // the floor: slate, falling off to the dark with distance (ordered dither only here, in the falloff)
  for (let py = vy + 1; py <= y1; py++) {
    const t = (py - vy) / Math.max(1, y1 - vy);
    for (let px = x; px < x + w; px++) {
      const c = t > 0.55 ? PAL.N5 : t > 0.3 ? (bayer(px, py) < (t - 0.3) / 0.25 ? PAL.N5 : PAL.N4) : t > 0.12 ? PAL.N4 : (bayer(px, py) < t / 0.12 ? PAL.N4 : PAL.N3);
      put(px, py, c);
    }
  }
  // the far dark: where the light gives out
  hl(x, x + w - 1, vy, PAL.N3);
  // desk rows, far to near (so the near ones overlap the far)
  const n = Math.min(ROWS.length, o.rows ?? ROWS.length);
  for (let r = n - 1; r >= 0; r--) {
    const d = ROWS[r];
    const k = lightAt(d);
    const front = Math.round(vy + (y1 - vy) / d); // the desk's front edge on the floor
    const topH = Math.max(1, Math.round(4 / d)); // desk top thickness as seen
    const faceH = Math.max(1, Math.round(9 / d)); // the front panel down to the floor
    const top = front - faceH - topH;
    // desks run across the room in pairs with an aisle; the aisle is on the vanishing point's line
    const deskW = Math.max(3, Math.round(34 / d)), aisle = Math.max(1, Math.round(8 / d));
    const phase = r % 2 === 0 ? 0 : Math.round(deskW / 2);
    const P = deskW + aisle;
    const x0 = vx + aisle - phase - P * (Math.ceil((vx - x + deskW) / P) + 1);
    for (let dx = x0; dx < x + w + deskW; dx += P) {
      const ax = dx, bx = dx + deskW - 1;
      if (bx < x || ax >= x + w) continue;
      // the chair back behind the desk (dark, a step above the floor), then the top, the lit lip and the face
      const cw = Math.max(1, Math.round(6 / d)), ch = Math.max(1, Math.round(7 / d));
      const cx = Math.round((ax + bx) / 2) - Math.floor(cw / 2);
      for (let j = 0; j < ch; j++) hl(cx, cx + cw - 1, top - 1 - j, slate(PAL.N3, k));
      for (let j = 0; j < topH; j++) hl(ax, bx, top + j, slate(j === 0 ? PAL.G6 : PAL.N8, k));
      for (let j = 0; j < faceH; j++) hl(ax, bx, top + topH + j, slate(j === faceH - 1 ? PAL.N3 : PAL.N6, k));
      // the name card: a white tent card on the desk's near edge (with a dark name line on the near rows)
      if (o.labels !== false) {
        const lw = Math.max(1, Math.round(9 / d)), lh = Math.max(1, Math.round(5 / d));
        const lx = cx + Math.floor(cw / 2) - Math.floor(lw / 2) + (r % 3) - 1;
        for (let j = 0; j < lh; j++) hl(lx, lx + lw - 1, top - lh + j + (topH > 1 ? 1 : 0), slate(PAL.P2, k));
        if (lw >= 5 && lh >= 3) hl(lx + 1, lx + lw - 2, top - lh + 1 + (topH > 1 ? 1 : 0) + Math.floor(lh / 2) - 1, slate(PAL.N4, k));
      }
    }
  }
};

// ------------------------------------------------------------------ the door: the key, the crack, the spill
const leafCol = (x: number) => (x === SLATE_LEAF.x0 ? PAL.N7 : x === SLATE_LEAF.x1 ? PAL.N5 : PAL.N6);
/** the key in its lock, three held drawings: the bow face-on (a ring), turning (narrow), edge-on (a bar) */
const drawKey = (b: Buf, step: 0 | 1 | 2, f: number) => {
  const [kx, ky] = SLATE_KEY; // kx = the keyhole's column (drawDoor's lx1 - 4)
  // clear the drawn key (drawDoor's key: shaft lx1-3..lx1, the bow at lx1+1..lx1+2 with a 1 px jangle)
  for (let yy = ky - 2; yy <= ky + 3; yy++) for (let xx = kx; xx <= kx + 7; xx++) {
    const c = xx <= SLATE_LEAF.x1 ? leafCol(xx) : xx < D.x1 ? PAL.N4 : PAL.N3;
    b.set(xx, yy, c);
  }
  const jig = step === 2 ? 0 : Math.floor(f / 4) % 2; // once unlocked the bow hangs still
  b.set(kx, ky, PAL.N1); // the keyhole
  rect(kx + 1, ky, 3, 1, b.ink(PAL.G5)); // the shaft
  const bx = kx + 4, by = ky + jig;
  if (step === 0) { // face-on: a ring 3 x 3 with its hole
    rect(bx, by - 1, 3, 3, b.ink(PAL.G5)); b.set(bx + 1, by, PAL.N2); b.set(bx, by - 1, PAL.G6);
  } else if (step === 1) { // turning: 2 wide
    rect(bx, by - 1, 2, 3, b.ink(PAL.G5)); b.set(bx, by - 1, PAL.G6); b.set(bx + 1, by + 1, PAL.G4);
  } else { // edge-on: a bar, the key turned a quarter
    rect(bx, by - 2, 1, 5, b.ink(PAL.G6)); b.set(bx, by + 2, PAL.G4);
  }
};
export interface SlateDoorOpenOpts {
  /** the key's drawing: 0 face-on, 1 turning, 2 turned (unlocked); undefined = leave drawDoor's key */
  key?: 0 | 1 | 2;
  /** the crack on the latch side, px (0 = shut). SLATE_GAP.crack, SLATE_GAP.open */
  gap?: number;
  /** labels on the desks beyond */
  labels?: boolean;
}
/**
 * Over a drawDarkPlate frame with `door: 4` (the door fully up). The crack opens on the latch side (right): the leaf
 * swings away from us, so its latch edge shows as a 1 px lit edge (the slate light behind it) and the room beyond
 * fills the gap. The slate light spills a thin wedge onto the frame's jamb and the floor line under the door.
 */
export const drawSlateDoorOpen = (b: Buf, f: number, o: SlateDoorOpenOpts = {}) => {
  const L = SLATE_LEAF;
  const g = Math.max(0, Math.min(18, Math.round(o.gap ?? 0)));
  if (g === 0) { if (o.key !== undefined) drawKey(b, o.key, f); return; }
  const gx = L.x1 - g + 1;
  // the room beyond, seen through the crack (the vanishing point a little left of the gap: we look in at an angle)
  drawSlateBeyond(b, gx, L.y0, g, L.y1 - L.y0 + 1, {vp: [0.2, 0.42], labels: o.labels});
  // the leaf's latch edge, now lit from behind: 1 px bright with a dark 1 px face shadow beside it
  for (let y = L.y0; y <= L.y1; y++) { b.set(gx - 1, y, PAL.N8); b.set(gx - 2, y, PAL.N5); }
  // the key moved away with the leaf: only its dark hole row shows on the edge
  b.set(gx - 1, SLATE_KEY[1], PAL.N3);
  // the spill: the jamb's inner face catches the slate light, and a thin wedge on the floor at the door's foot
  for (let y = L.y0; y <= L.y1; y++) b.set(L.x1 + 1, y, y % 3 === 0 ? PAL.N7 : PAL.N6);
  for (let i = 0; i < g + 4; i++) b.set(gx - 2 + i, L.y1, PAL.N7);
};

/** Tasya's taped sign (MAS / GERG / ->), paper and ink, placed left of the crack; dk steps it down with the door */
export const slateDoorSign = (b: Buf, dk = 0) => {
  const s = (c: number) => (dk > 0 ? stepColor(c, -dk) : c);
  const x = D.x0 + 5, y = D.y0 + 11, w = 26, h = 30;
  rect(x - 1, y - 1, w + 2, h + 2, b.ink(s(PAL.N1))); rect(x, y, w, h, b.ink(s(PAL.P2))); rect(x, y + h - 2, w, 2, b.ink(s(PAL.P0)));
  rect(x + 10, y - 2, 5, 2, b.ink(s(PAL.P1))); // the tape
  for (const [i, t] of ['MAS', 'GERG', '→'].entries()) pt(b, t, x + Math.round((w - pw(t)) / 2), y + 3 + i * 9, s(PAL.N2));
};
