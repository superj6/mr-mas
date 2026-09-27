// MR. MAS — Ep1 Act Four v5, EXTRA pixel assets: THE OBSERVER CHAIR (S8.10, the act's last image; art-needs-v5 P4
// POLISH-STANDINS "the folding chair"). New file, owned by the v5 extra art pass (a4fin-pixelextra).
// Script 5.1: "By the bullpen's window, a MACROSOFT-blue folding chair unfolds itself. Its seat reads MACROSOFT · OBSERVER
// (NON-VOTING) [V]. It stays empty. From somewhere above, Tasya's key ring drops onto the seat. Jangle."
// v4 drew a front-on blue slab as tall as a person (shots4 foldChair, flagged a stand-in). This is the chair at the
// bullpen wide's own scale (about 0.62 px/cm at the window corner: 80 cm -> ~50 px), built as a small 3D model (tubes and
// panels, whole-pixel projected, no rotation of a sprite) so its four unfold drawings share one geometry:
//   drawObserverChair(b, footX, footY, {unfold, keys, light})  unfold 0 folded flat (standing on its own) .. 3 open,
//                         one held drawing each; keys = the key ring's drop step (null = none; 0.. falling, then landed
//                         with a 1 px bounce: KEYS_LAND is the first landed step). (footX, footY) = the floor under the
//                         seat's centre. The chair faces into the room (toward camera-left), its window side lit.
//   observerPlacard(b, cx, y, {k})  the chair's own reserved-seat card, clipped to the backrest's top rail and hanging in
//                         front of it: `MACROSOFT · OBSERVER` / `(NON-VOTING)` in the 7 px face, legible at 1x (a card
//                         that size can't sit ON a room-scale chair; the card is the chair's tag, the way v4 hung it).
//                         k = frames since it appears (it swings in 2 held steps, then hangs still).
//   CHAIR                 anchors for the host: the backrest's top-rail centre (hang the card there), the seat's centre
//                         (where the keys land), per unfold step, relative to (footX, footY).
//   chairKeysAt(k, k0)    the key ring's held drop state for shot frame k with the drop starting at k0.
// Palette: the MACROSOFT slate (N4-N8, G6: the badge's and the landlord remap's ramp), a white print line on the backrest's
// top rail, the key ring in brass (W5-W7) with one steel key (G5-G6). Nothing in it is a real brand.
import {Buf, rect, poly, line} from '../../../../../shared/pixel/px';
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import {text, textWidth} from '../../../../../shared/pixel/font';

type V3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;

// ------------------------------------------------------------------ the camera: a slight high three-quarter, orthographic
const S = 0.62; // px per cm at the window corner of the bullpen wide
const YAW = rad(-32); // the chair turned to face into the room (camera-left); its right (window) side toward us
const ELEV = rad(14);
/** local chair cm (x right, y up, z toward the chair's front) -> screen px offset (dx, dy) and depth (toward camera +) */
const proj = (p: V3): [number, number, number] => {
  const [x, y, z] = p;
  const xr = x * Math.cos(YAW) + z * Math.sin(YAW), zr = -x * Math.sin(YAW) + z * Math.cos(YAW);
  const sy = y * Math.cos(ELEV) - zr * Math.sin(ELEV);
  const d = zr * Math.cos(ELEV) + y * Math.sin(ELEV);
  return [xr * S, -sy * S, d];
};
/** the light: daylight from the window, camera-right and above */
const LIGHT: V3 = (() => { const v: V3 = [0.8, 0.55, 0.25]; const l = Math.hypot(...v); return [v[0] / l, v[1] / l, v[2] / l]; })();
const rotN = (n: V3): V3 => [n[0] * Math.cos(YAW) + n[2] * Math.sin(YAW), n[1], -n[0] * Math.sin(YAW) + n[2] * Math.cos(YAW)];
const RAMP = [PAL.N3, PAL.N4, PAL.N5, PAL.N6, PAL.N7, PAL.N8, PAL.G6];
const tone = (n: V3, bias = 0) => {
  const r = rotN(n);
  const lam = r[0] * LIGHT[0] + r[1] * LIGHT[1] + r[2] * LIGHT[2];
  return RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(3.1 + lam * 3.2 + bias)))];
};

// ------------------------------------------------------------------ geometry, per unfold step
/** the seat's fold angle per held drawing (deg up from level): folded flat, two in-betweens, open */
const PHI = [88, 58, 26, 0];
interface Prim { kind: 'quad' | 'tube'; pts: V3[]; col: number; w?: number; depth: number; }
const chairPrims = (u: 0 | 1 | 2 | 3): {prims: Prim[]; seatC: V3; railC: V3} => {
  const phi = rad(PHI[u]);
  const prims: Prim[] = [];
  const quad = (pts: V3[], n: V3, bias = 0) => prims.push({kind: 'quad', pts, col: tone(n, bias), depth: pts.reduce((a, p) => a + proj(p)[2], 0) / pts.length});
  const tube = (a: V3, b: V3, n: V3, w = 2, bias = 0) => prims.push({kind: 'tube', pts: [a, b], col: tone(n, bias), w, depth: (proj(a)[2] + proj(b)[2]) / 2});
  const X = 20.5;
  // rear uprights, leaning back, floor to the top of the backrest
  for (const sx of [-1, 1]) tube([sx * X, 0, -16], [sx * X, 81, -22], [sx, 0.2, 0.3], 2);
  // the backrest panel (a gently dished slate pressing): front face + its top rail
  const bY0 = 60, bY1 = 79;
  const zAt = (y: number) => -16 - (6 * y) / 81;
  quad([[-X, bY1, zAt(bY1) + 0.6], [X, bY1, zAt(bY1) + 0.6], [X, bY0, zAt(bY0) + 0.6], [-X, bY0, zAt(bY0) + 0.6]], [0, 0.15, 1], 0.4);
  quad([[-X, bY1 + 1.6, zAt(bY1) - 0.6], [X, bY1 + 1.6, zAt(bY1) - 0.6], [X, bY1, zAt(bY1) + 0.8], [-X, bY1, zAt(bY1) + 0.8]], [0, 1, 0.3], 0.6);
  // the rear cross brace
  tube([-X, 13, zAt(13)], [X, 13, zAt(13)], [0, 0, 1], 1, -0.6);
  // the seat: hinged at its rear edge on the uprights (y 45), folding up flat against the backrest
  const hy = 45, hz = zAt(45) + 1.5, D = 38;
  const fy = hy + Math.sin(phi) * D, fz = hz + Math.cos(phi) * D;
  const seatN: V3 = [0, Math.cos(phi), -Math.sin(phi)];
  const seat: V3[] = [[-X + 0.5, hy, hz], [X - 0.5, hy, hz], [X - 0.5, fy, fz], [-X + 0.5, fy, fz]];
  quad(seat, seatN[1] >= 0.1 || u === 3 ? seatN : [0, -seatN[1], -seatN[2]], 0.2);
  // the seat's front lip (a rolled edge, one tone down) and its underside when it shows
  quad([[-X + 0.5, fy, fz], [X - 0.5, fy, fz], [X - 0.5, fy - 2.2 * Math.cos(phi), fz + 2.2 * Math.sin(phi)], [-X + 0.5, fy - 2.2 * Math.cos(phi), fz + 2.2 * Math.sin(phi)]], [0, -Math.sin(phi), Math.cos(phi)], -0.4);
  // the front legs: from the seat's front corners down to the floor, their feet swinging forward as it opens
  const footZ = -14 + (1 - PHI[u] / 88) * 42;
  for (const sx of [-1, 1]) tube([sx * (X + 1.2), fy + 1, fz - 1], [sx * (X + 1.2), 0, footZ], [sx, 0.1, 0.8], 2, sx > 0 ? 0.2 : -0.3);
  // the front cross brace
  const by = 13, bt = by / Math.max(1, fy + 1), bz = footZ + (fz - 1 - footZ) * bt;
  tube([-(X + 1.2), by, bz], [X + 1.2, by, bz], [0, 0, 1], 1, 0);
  // rubber feet
  for (const sx of [-1, 1]) { tube([sx * X, 0, -16], [sx * X, 1.5, -16.2], [0, 1, 0], 3, -2); tube([sx * (X + 1.2), 0, footZ], [sx * (X + 1.2), 1.5, footZ], [0, 1, 0], 3, -2); }
  const seatC: V3 = [0, (hy + fy) / 2 + 1, (hz + fz) / 2];
  const railC: V3 = [0, bY1 + 1.6, zAt(bY1)];
  return {prims, seatC, railC};
};

const px = (fx: number, fy: number, p: V3): [number, number] => { const [dx, dy] = proj(p); return [Math.round(fx + dx), Math.round(fy + dy)]; };

export interface ChairState {
  /** 0 folded .. 3 open (one held drawing each) */
  unfold?: 0 | 1 | 2 | 3;
  /** the key ring's drop step (chairKeysAt), null = no keys */
  keys?: number | null;
  /** the floor shadow under it (default true) */
  shadow?: boolean;
}
export const KEYS_LAND = 5;
/** the key ring's drop as held steps: 0-4 falling (it enters from the frame's top), 5 landed, 6 the 1 px bounce, 7+ still */
export const chairKeysAt = (k: number, k0: number): number | null => (k < k0 ? null : Math.min(8, Math.floor((k - k0) / 2)));

/** anchors for a chair at (footX, footY): the top rail's centre (the placard hangs there) and the seat's centre */
export const CHAIR = {
  rail: (footX: number, footY: number, u: 0 | 1 | 2 | 3 = 3) => px(footX, footY, chairPrims(u).railC),
  seat: (footX: number, footY: number, u: 0 | 1 | 2 | 3 = 3) => px(footX, footY, chairPrims(u).seatC),
};

export const drawObserverChair = (b: Buf, footX: number, footY: number, st: ChairState = {}) => {
  const u = st.unfold ?? 3;
  const {prims, seatC} = chairPrims(u);
  const layer = new Buf(b.w, b.h, 0x1000000);
  // the floor shadow: a soft slate-dark lozenge under it, away from the window (camera-left), two rungs of dither
  if (st.shadow !== false) {
    const w = u === 0 ? 14 : 24, h = u === 0 ? 2 : 4;
    for (let y = -h; y <= h; y++) for (let x = -w; x <= w; x++) {
      const d = Math.hypot(x / w, y / h);
      if (d < 1 && ((x + y) & 1 || d < 0.6)) { const X = footX - 6 + x, Y = footY + 1 + y; const c = b.get(X, Y); if (Y < 203) b.set(X, Y, darker(c)); }
    }
  }
  prims.sort((a, z) => a.depth - z.depth);
  for (const p of prims) {
    if (p.kind === 'quad') { const pts = p.pts.flatMap((q) => px(footX, footY, q)); poly(pts, layer.ink(p.col)); }
    else {
      const [a, z] = p.pts.map((q) => px(footX, footY, q));
      const w = p.w ?? 2;
      for (let o = 0; o < w; o++) line(a[0] + o, a[1], z[0] + o, z[1], layer.ink(p.col));
    }
  }
  // the outline: a pixel of the chair next to empty space takes the dark rung on the side away from the window
  const out = new Buf(b.w, b.h, 0x1000000);
  out.c.set(layer.c);
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) {
    const c = layer.c[y * b.w + x];
    if (c === 0x1000000) continue;
    const emptyL = layer.get(x - 1, y) === 0x1000000 || x === 0, emptyD = layer.get(x, y + 1) === 0x1000000;
    if (emptyL || emptyD) out.set(x, y, PAL.N2);
  }
  // the print: a thin white rule along the backrest's lit top edge (the MACROSOFT house trim; lettering is the placard's)
  if (u >= 0) {
    const [ax, ay] = px(footX, footY, [-17, 76, -16 - (6 * 76) / 81 + 0.7]);
    const [bx, by] = px(footX, footY, [17, 76, -16 - (6 * 76) / 81 + 0.7]);
    line(ax, ay, bx, by, (x, y) => { if (out.get(x, y) !== 0x1000000) out.set(x, y, PAL.P1); });
  }
  for (let i = 0; i < out.c.length; i++) if (out.c[i] !== 0x1000000 && ((i / b.w) | 0) < 203) b.c[i] = out.c[i];
  if (st.keys !== null && st.keys !== undefined) drawKeyRing(b, px(footX, footY, seatC), st.keys, u);
};
const darker = (c: number) => stepColor(c, -1);

/** the key ring: a brass ring (r 3), two brass keys and one steel, dropping onto the seat and bouncing once */
const drawKeyRing = (b: Buf, seat: [number, number], k: number, u: number) => {
  const [sx, sy0] = seat;
  const sy = sy0 - (u === 3 ? 2 : 0);
  const fall = [-150, -118, -84, -52, -22];
  const y = k < KEYS_LAND ? sy + fall[k] : k === KEYS_LAND + 1 ? sy - 1 : sy;
  if (y < -8) return;
  const ring = (cx: number, cy: number) => {
    for (let a = 0; a < 360; a += 24) { const x = Math.round(cx + Math.cos(rad(a)) * 3.2), yy = Math.round(cy + Math.sin(rad(a)) * 2.2); if (yy < 203) b.set(x, yy, a > 180 && a < 330 ? PAL.W7 : PAL.W5); }
  };
  const key = (x: number, yy: number, col: number, hi: number, dx: number) => {
    rect(x, yy, 2, 2, b.ink(col)); b.set(x, yy, hi);
    for (let i = 0; i < 4; i++) b.set(x + (i >> 1) * dx + (dx > 0 ? 1 : 0), yy + 2 + i, col);
    b.set(x + (dx > 0 ? 2 : -1), yy + 4, col);
  };
  const landed = k >= KEYS_LAND;
  ring(sx, y);
  if (landed) { key(sx - 5, y + 1, PAL.W5, PAL.W7, -1); key(sx + 3, y + 1, PAL.G5, PAL.G6, 1); key(sx - 1, y + 2, PAL.W4, PAL.W6, 0); }
  else { key(sx - 3, y + 2, PAL.W5, PAL.W7, 0); key(sx + 1, y + 2, PAL.G5, PAL.G6, 0); key(sx - 1, y + 3, PAL.W4, PAL.W6, 0); }
};

/**
 * The chair's reserved-seat card, the way event chairs carry them: a white laminated card in a slate clip-stand that grips
 * the backrest's top rail and holds the card up ABOVE the chair (so the empty seat stays clear under it). A slate band along
 * its top, the words in the 7 px face in slate ink. (cx, railY) = the top rail's centre (CHAIR.rail). k: frames since it
 * shows (it settles in two held 1 px sways: -1 at k 0-1, +1 at k 2-3, still from 4). Returns the card's rect.
 */
export const observerPlacard = (b: Buf, cx: number, railY: number, o: {k?: number; lift?: number} = {}) => {
  const l1 = 'MACROSOFT · OBSERVER', l2 = '(NON-VOTING)';
  const w = Math.max(textWidth(l1), textWidth(l2)) + 12, h = 29;
  const k = o.k ?? 99;
  const sw = k < 2 ? -1 : k < 4 ? 1 : 0;
  const lift = o.lift ?? 6;
  const x0 = Math.round(cx - w / 2) + sw, y0 = railY - lift - h;
  // the clip-stand: a 2 px slate post from the rail up to the card's foot, a small jaw on the rail
  rect(cx - 1, y0 + h, 2, lift + 1, b.ink(PAL.N5)); rect(cx, y0 + h, 1, lift + 1, b.ink(PAL.N7));
  rect(cx - 2, railY - 1, 5, 2, b.ink(PAL.N4)); b.set(cx + 2, railY - 1, PAL.N7);
  rect(x0 + 1, y0 + 1, w, h, b.ink(PAL.N3)); // its shadow on the window behind
  rect(x0, y0, w, h, b.ink(PAL.P2));
  rect(x0, y0, w, 3, b.ink(PAL.N7)); rect(x0, y0 + 3, w, 1, b.ink(PAL.N5));
  rect(x0, y0 + h - 1, w, 1, b.ink(PAL.P0)); rect(x0 + w - 1, y0, 1, h, b.ink(PAL.P0));
  text(b, l1, x0 + 6, y0 + 7, PAL.N5);
  text(b, l2, x0 + 6, y0 + 18, PAL.N6);
  return {x: x0, y: y0, w, h};
};
