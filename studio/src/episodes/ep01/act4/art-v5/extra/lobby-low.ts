// MR. MAS — Ep1 Act Four v5, EXTRA pixel assets: ROOM-LOBBY-LOW, the lobby from low (S8.01; art-needs-v5 P4). New file,
// owned by the v5 extra art pass (a4fin-pixelextra).
// Script 5.1: "INT. NOPEAI LOBBY — NIGHT. [LOW] (S8.01) The wall sign that was blank in the check scene lights up over us,
// on a brass stab: DAYS SINCE SOMEONE TRIED TO FIRE MAS: 0. Mas is already at the reception desk, wearing no badge of
// either kind, his glass in his hand ... In the same shot, under the sign, a maintenance hand sets down a small box full
// of spare 0 plates." (5.0 folded v4's S8.02 insert into this shot.) v4 cropped the night wide (a marked stand-in).
//
// The drawing: the camera drops to the floor at the wide's distance, so every figure keeps its room scale (Mas's 78 px
// sprite, the desk, the sign's lettering all stay legible and on model), and the low angle is carried by what a floor
// camera sees: the gothic vault overhead (more of it than the wide shows), the floor collapsed to a thin polished band
// holding long reflections of the sign, the neon and the votives, Mas standing on the horizon, and a near foreground: the
// carton of spare 0 plates coming down just in front of the lens, under the sign, in a maintenance worker's hand.
// The room above the floor is the lobby's own painter (rooms/lobby.ts lobbyLayers, night), re-framed in whole pixels
// (never scaled); the vault band, the floor band, the carton and the hand are drawn here.
//   drawLobbyLow(b, f, st)   st.sign 0..3 (the lobby's sign states: blank / letters / half-lit / lit; v4 ignites it
//                            1, 2, 1, 2, 3 on 2s from the 'ignite' mark, see signAt); st.box 0..4 (boxAt); st.mas
//                            (default true). Paints the 480 x 203 room band.
//   signAt(k, ignite)        the sign's state for shot frame k: v4's flicker 1, 2, 1, 2, then 3 (lit) on 2s
//   boxAt(k, k0)             the carton's held step: 0 low in the air, 1 lower, 2 set, 3 the hand lifting away, 4 gone
//   LOBBY_LOW                the geometry (horizon, shifts, the carton's place) for a host adding anything
// A true dolly-in low angle (the sign looming, Mas bigger) needs a new ~1.6x standing Mas drawing; see the handoff
// (show/episodes/ep01/production/act4/art-extra-v5.md).
import {Buf, rect, line, poly, bayer, hash} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {bigText, bigTextWidth} from '../../../../../shared/pixel/font';
import {lobbyLayers, LOBBY} from '../../../../../shared/pixel/rooms/lobby';
import {drawMasStand, MAS_STAND_DEFAULT} from '../../../../../shared/pixel/cast/mas-stand';
import {drawWorkerCarryHand} from './hands';

const T = 0x1000000;
export const LOBBY_LOW = {
  /** the floor line (the back wall's base) in the low frame; the camera's eye line sits 11 px above it */
  base: 176,
  /** whole-pixel shifts of the lobby's layers: the far wall (+18), the desk (+10: it is nearer, so it drops less) */
  dyFar: 18, dyDesk: 10,
  /** Mas's feet (in front of the desk, on the compressed floor) */
  masFeet: [262, 180] as [number, number],
  /** the carton: centre of its top edge, width, height (a near object: ~2 px/cm, its foot below the frame) */
  box: {cx: 404, top: 168, w: 62, h: 44},
};
export const signAt = (k: number, ignite: number): 0 | 1 | 2 | 3 => {
  if (k < ignite) return 1;
  const seq = [1, 2, 1, 2, 3] as const;
  return seq[Math.min(seq.length - 1, Math.floor((k - ignite) / 2))];
};
export const boxAt = (k: number, k0: number): 0 | 1 | 2 | 3 | 4 => (k < k0 ? 0 : Math.min(4, Math.floor((k - k0) / 3) + 0)) as 0 | 1 | 2 | 3 | 4;

export interface LobbyLowState { sign?: 0 | 1 | 2 | 3; box?: 0 | 1 | 2 | 3 | 4; mas?: boolean; }
const copyLayer = (b: Buf, src: Buf, dy: number, y0: number, y1: number, opaque: boolean) => {
  for (let y = y0; y < y1; y++) {
    const Y = y + dy;
    if (Y < 0 || Y >= 203) continue;
    for (let x = 0; x < 480; x++) { const c = src.c[y * 480 + x]; if (opaque || c !== T) b.c[Y * b.w + x] = c; }
  }
};

export const drawLobbyLow = (b: Buf, f: number, st: LobbyLowState = {}) => {
  const L = LOBBY_LOW;
  const sign = st.sign ?? 3;
  const layers = lobbyLayers({f, time: 'night', sign, zeroBox: false});
  // ---- the vault overhead: the ribs rising past the wide's top edge to a boss beyond the frame
  for (let y = 0; y < L.dyFar + 2; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.35 + y * 0.01 ? PAL.N1 : PAL.N0);
  const ribs = [-120, -20, 60, 116, 180, 240, 300, 364, 420, 500, 600];
  for (const rx of ribs) line(rx, L.dyFar + 1, 240 + (rx - 240) * 0.55, -1, (x, y) => { b.set(x, y, PAL.N3); b.set(x + 1, y, PAL.N2); });
  // the two votive chandeliers' chains, now long (they hang from the vault we can see)
  for (const cx of [60, 420]) for (let y = 0; y < L.dyFar + 2; y++) if (y % 3 !== 2) b.set(cx, y, PAL.G1);
  // ---- the room above the floor (the wide's far layer, rows 0..157), shifted down to its new floor line
  copyLayer(b, layers.far, L.dyFar, 0, LOBBY.WALL_FLOOR_Y, true);
  // ---- the floor: collapsed to a thin polished band, the room reflected in it (compressed, two rungs down)
  const fy0 = LOBBY.WALL_FLOOR_Y + L.dyFar; // 176
  for (let y = fy0; y < 203; y++) {
    const d = y - fy0;
    const sy = fy0 - 1 - Math.round(d * 2.6);
    for (let x = 0; x < 480; x++) {
      const base = d < 2 ? PAL.N2 : PAL.N1;
      const refl = sy >= 0 ? b.get(x, sy) : PAL.N0;
      const lit = stepColor(refl, -2);
      b.set(x, y, bayer(x, y) < 0.62 - d * 0.018 ? lit : base);
    }
  }
  // tile joints converging to the vanishing point on the horizon
  for (let xw = -900; xw <= 1380; xw += 60) line(240 + Math.round((xw - 240) * 0.08), fy0, xw, 203 + 40, (x, y) => { if (y >= fy0 && y < 203) b.set(x, y, stepColor(b.get(x, y), -1)); });
  // ---- the revolving door's front glass (door layer) and the desk (front layer), each at its own depth
  copyLayer(b, layers.door, L.dyFar - 4, 0, 203, false);
  copyLayer(b, layers.front, L.dyDesk, 0, 203, false);
  // ---- Mas, already at the desk: no badge, his glass in his near hand
  if (st.mas !== false) {
    const [mx, my] = L.masFeet;
    drawMasStand(b, mx, my, {...MAS_STAND_DEFAULT, light: 'room', guest: false});
    const gx = mx + 6, gy = my - 37; // the near hand
    rect(gx - 1, gy - 5, 4, 5, b.ink(PAL.C2)); rect(gx - 1, gy - 5, 4, 1, b.ink(PAL.C6)); b.set(gx + 2, gy - 4, PAL.C5); b.set(gx, gy - 3, PAL.C4);
  }
  // ---- the near foreground: the carton of spare 0 plates, under the sign, the worker's hand on its near rim
  const box = st.box ?? 2;
  if (box < 4 || true) drawCarton(b, box);
};

/** the carton at near scale: kraft board, flaps up, five enamel 0 plates standing in it; its foot runs off the frame */
const drawCarton = (b: Buf, step: 0 | 1 | 2 | 3 | 4) => {
  const B = LOBBY_LOW.box;
  const lift = [10, 4, 0, 0, 0][step];
  const x0 = B.cx - Math.round(B.w / 2), y0 = B.top - lift, x1 = x0 + B.w;
  // its shadow on the floor band: grows as it comes down (it lands just below the frame's foot)
  const sh = [0.4, 0.7, 1, 1, 1][step];
  for (let y = 196; y < 203; y++) for (let x = x0 - 6; x < x1 + 10; x++) if (bayer(x, y) < 0.55 * sh) b.set(x, y, stepColor(b.get(x, y), -2));
  // the plates first (standing in the box, the front ones a little lower), then the box's front over their feet
  for (let k = 0; k < 5; k++) {
    const px = x0 + 5 + k * 11, py = y0 - 20 + (k % 2) * 3 + (k === 2 ? -2 : 0);
    rect(px, py, 10, 22, b.ink(PAL.P1)); rect(px, py, 10, 1, b.ink(PAL.P2)); rect(px + 9, py, 1, 22, b.ink(PAL.P0)); rect(px, py, 1, 22, b.ink(PAL.P2));
    const w = bigTextWidth('0');
    const sink = new Buf(1, 1, 0);
    sink.set = (sx: number, sy: number) => { b.set(sx, sy, PAL.R2); };
    bigText(sink, '0', px + Math.round((10 - w) / 2), py + 4, PAL.R2);
    b.set(px + 1, py + 1, PAL.P2);
  }
  // flaps (the far pair seen above the rim, lit by the sign), then the front face
  poly([x0, y0, x0 - 9, y0 - 12, x0 + 14, y0 - 12, x0 + 18, y0], b.ink(PAL.D3));
  line(x0 - 9, y0 - 12, x0 + 14, y0 - 12, b.ink(PAL.W4));
  poly([x1, y0, x1 + 7, y0 - 14, x1 - 16, y0 - 14, x1 - 20, y0], b.ink(PAL.D4));
  line(x1 + 7, y0 - 14, x1 - 16, y0 - 14, b.ink(PAL.W5));
  for (let y = y0; y < Math.min(203, y0 + B.h + 20); y++) for (let x = x0; x < x1; x++) {
    const u = (x - x0) / B.w;
    let c = u < 0.08 ? PAL.D2 : u > 0.86 ? PAL.D2 : PAL.D3; // the corners turn away
    if (y === y0) c = PAL.W4; // the lit rim
    else if (y === y0 + 1) c = PAL.D4;
    if (y > y0 + 16 && y < y0 + 20 && u > 0.08 && u < 0.86) c = y === y0 + 17 ? PAL.D4 : PAL.D2; // the tape seam
    if ((x * 3 + y * 7) % 23 === 0 && c === PAL.D3) c = PAL.D2; // the board's fleck
    b.set(x, y, c);
  }
  // a shipping label, blank (no brand), and a hand-hole
  rect(x0 + 8, y0 + 24, 16, 10, b.ink(PAL.P0)); rect(x0 + 8, y0 + 24, 16, 1, b.ink(PAL.P1));
  for (let i = 0; i < 3; i++) rect(x0 + 10, y0 + 27 + i * 2, 11 - i * 3, 1, b.ink(PAL.G3));
  rect(x0 + 40, y0 + 6, 12, 4, b.ink(PAL.D0)); rect(x0 + 40, y0 + 6, 12, 1, b.ink(PAL.D1));
  // the hand: on the near rim while carrying and setting (0..2), lifting away (3), gone (4)
  if (step <= 3) drawWorkerCarryHand(b, x0 + Math.round(B.w * 0.62), y0 + 1 - (step === 3 ? 7 : 0));
  void hash;
};
