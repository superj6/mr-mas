// MR. MAS — kit: TASYA'S KEY RING, LARGE (script draft 8.1, v32-9.10k: "Weeks on. The key ring at Tasya's belt, big in
// frame: eleven keys, and a twelfth, new, in NopeAI beige, stamped NOPEAI. It jangles as he turns toward the TV.").
// New file (v3-art-a, v3.2 round, 2026-09-28). The key-count lines are cut, so the picture carries the count: every key
// its own drawing, spread round the ring's lower half so they can be counted, the landlord's tenants in brass, steel and
// copper; the twelfth hangs straight down at the front (so its stamp is level, never rotated), beige, its bow stamped
// NOPEAI. The ring is cast/tasya-medium.ts drawKeyRing's ring, redrawn at insert scale (never a scaled sprite).
//   drawKeyRingECU(b, f, st)   [ECU] his belt and the ring filling the frame: st.keys (11 or 12, or 13 for Act
//                              Three's thirteenth, v31-18.00b), st.beige (the twelfth beige), st.jangle 0 | 1 (two held
//                              drawings: the keys swing a few degrees), st.thirteenth (13th key's colour: Atem blue)
//   KEY_RING_ECU               the ring's centre and radius, where the beige key hangs (a rail or plate can sit clear)
import {Buf, rect, bayer, hash} from '../px';
import {PAL} from '../palette';
import {text, textWidth} from '../font';

const RH = 203;
export const KEY_RING_ECU = {cx: 240, cy: 62, r: 50, beigeAt: [246, 110] as [number, number]};
type KeyCol = [number, number, number, number]; // shadow, body, lit, glint
const METALS: KeyCol[] = [
  [PAL.W3, PAL.W5, PAL.W6, PAL.W8], // brass
  [PAL.G3, PAL.G4, PAL.G5, PAL.G6], // steel
  [PAL.W2, PAL.W4, PAL.W5, PAL.W7], // copper
  [PAL.G2, PAL.G3, PAL.G4, PAL.G6], // dark steel
];
/** one key drawn along a direction (whole pixels, rasterised from its shape: a bow with its hole, a toothed blade) */
const key = (b: Buf, ax: number, ay: number, deg: number, col: KeyCol, len: number, bowR: number, seed: number) => {
  const a = (deg * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), vx = -uy, vy = ux;
  const R = len + bowR * 2 + 4;
  for (let y = Math.round(ay - R); y <= Math.round(ay + R); y++) for (let x = Math.round(ax - R); x <= Math.round(ax + R); x++) {
    const dx = x - ax, dy = y - ay, s = dx * ux + dy * uy, q = dx * vx + dy * vy;
    let inside = false, lit = false, edge = false;
    // the bow: a disc (or a squared disc on some keys) past the ring's bite, its hole at the centre
    const bs = s - bowR - 1;
    const round = seed % 3 !== 1;
    const dBow = round ? Math.hypot(bs, q) / bowR : Math.max(Math.abs(bs), Math.abs(q)) / bowR;
    if (dBow <= 1) { const hole = Math.hypot(bs + bowR * 0.45, q) < 1.6; if (!hole) { inside = true; edge = dBow > 0.8; lit = q < -bowR * 0.2; } }
    // the blade: from the bow's far edge, 4 px wide, teeth cut into one side, a notched tip
    const t = s - bowR * 2;
    if (!inside && t >= 0 && t <= len) {
      const tooth = Math.floor(t / 3 + hash(seed, Math.floor(t / 3), 71) * 2) % 2 === 0 && t > 3 && t < len - 2;
      const w0 = -2, w1 = tooth ? 3 : 1;
      if (q >= w0 && q <= w1 && !(t > len - 2 && q > 0)) { inside = true; lit = q < -1; edge = q === w1 || t > len - 1; }
    }
    if (!inside) continue;
    b.set(x, y, edge ? col[0] : lit ? col[2] : col[1]);
  }
  // a glint on the bow
  b.set(Math.round(ax + ux * (bowR * 0.6) - vx * bowR * 0.5), Math.round(ay + uy * (bowR * 0.6) - vy * bowR * 0.5), col[3]);
};

export interface KeyRingEcuState { keys?: number; beige?: boolean; jangle?: 0 | 1; thirteenth?: boolean }
export const drawKeyRingECU = (b: Buf, f: number, st: KeyRingEcuState = {}) => {
  const n = st.keys ?? 12, beige = st.beige ?? n >= 12, sw = st.jangle ? 4 : 0;
  const {cx, cy, r} = KEY_RING_ECU;
  // his trousers (charcoal twill, the lobby's daylight from frame left), the open blazer's panels at the sides, the belt
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const d = x / 480;
    b.set(x, y, bayer(x, y) < 0.45 - d * 0.3 ? PAL.N4 : (x + y * 3) % 23 === 0 ? PAL.N2 : PAL.N3);
  }
  for (let y = 0; y < RH; y++) { const l = 70 - Math.round(y * 0.08), r0 = 404 + Math.round(y * 0.1); for (let x = 0; x < l; x++) b.set(x, y, x > l - 3 ? PAL.N7 : bayer(x, y) < 0.4 ? PAL.N5 : PAL.N4); for (let x = r0; x < 480; x++) b.set(x, y, x < r0 + 2 ? PAL.N2 : bayer(x, y) < 0.25 ? PAL.N4 : PAL.N3); }
  rect(0, 14, 480, 14, b.ink(PAL.N1)); rect(0, 14, 480, 1, b.ink(PAL.N3)); rect(0, 27, 480, 1, b.ink(PAL.N0));
  for (let x = 0; x < 480; x += 7) b.set(x, 21, PAL.N2); // the belt's stitching
  rect(96, 12, 22, 18, b.ink(PAL.W5)); rect(99, 15, 16, 12, b.ink(PAL.N1)); rect(96, 12, 22, 1, b.ink(PAL.W7)); rect(105, 20, 12, 2, b.ink(PAL.W6)); // the buckle
  // the clip on the belt and the ring hanging from it (brass, thick, lit from the upper left)
  rect(cx - 5, 10, 10, 22, b.ink(PAL.W4)); rect(cx - 5, 10, 10, 1, b.ink(PAL.W7)); rect(cx - 1, 30, 3, 4, b.ink(PAL.W3));
  const back = (lx: number, ly: number) => { const d = Math.hypot(lx, ly); return d >= r - 2.5 && d <= r + 2.5; };
  for (let y = -r - 3; y <= r + 3; y++) for (let x = -r - 3; x <= r + 3; x++) if (back(x, y) && y < 0) { const d = Math.hypot(x, y); b.set(cx + x, cy + y, d > r + 1.5 || d < r - 1.5 ? PAL.W3 : -x - y > r * 0.6 ? PAL.W7 : PAL.W5); }
  // the keys round the lower arc, back to front; the twelfth (beige) last, hanging straight down at the front
  const plain = beige ? n - 1 : n;
  const rest = st.thirteenth ? plain - 1 : plain;
  for (let i = 0; i < rest; i++) {
    const t = rest === 1 ? 0.5 : i / (rest - 1);
    const th = 12 + t * 156 + (i % 2 ? sw : -sw);
    const a = (th * Math.PI) / 180;
    const ax = cx + Math.cos(a) * r, ay = cy + Math.sin(a) * r;
    const dir = 90 + (th - 90) * 0.55;
    key(b, ax, ay, dir, METALS[(i * 7 + 3) % 4], 30 + Math.round(hash(i, 1, 72) * 12), 8 + Math.round(hash(i, 2, 72) * 2), i + 1);
  }
  // the ring's front half over the keys' bows
  for (let y = -r - 3; y <= r + 3; y++) for (let x = -r - 3; x <= r + 3; x++) if (back(x, y) && y >= 0) { const d = Math.hypot(x, y); b.set(cx + x, cy + y, d > r + 1.5 || d < r - 1.5 ? PAL.W3 : x < -r * 0.5 ? PAL.W6 : PAL.W5); }
  b.set(cx - Math.round(r * 0.7), cy + Math.round(r * 0.7) - 1, PAL.W8);
  if (st.thirteenth) key(b, cx + Math.cos(2.3) * r, cy + Math.sin(2.3) * r, 116 + sw, [PAL.F3, PAL.F4, PAL.F5, PAL.F6], 40, 10, 13);
  if (beige) {
    // the twelfth: a squared beige bow (52 x 24) hanging level at the front, NOPEAI stamped in it (the 7 px face), its
    // blade straight down
    const [bx, by] = KEY_RING_ECU.beigeAt, jx = st.jangle ? 1 : 0;
    const X = bx + jx, BW = 52, BH = 24;
    rect(X + 24, by - 10, 6, 12, b.ink(PAL.W5)); rect(X + 24, by - 10, 1, 12, b.ink(PAL.W7)); // its split ring onto the big ring
    for (let j = 0; j < BH; j++) for (let i = 0; i < BW; i++) {
      const cxx = Math.min(i, BW - 1 - i), cyy = Math.min(j, BH - 1 - j);
      if (cxx < 3 && cyy < 3 && cxx + cyy < 3) continue;
      b.set(X + i, by + j, cxx === 0 || cyy === 0 ? PAL.P0 : j < 3 ? PAL.P2 : PAL.P1);
    }
    for (let j = 8; j < 16; j++) for (let i = 3; i < 11; i++) if (Math.hypot(i - 6.5, j - 11.5) < 2.6) b.set(X + i, by + j, PAL.N3); // the bow's hole
    const s = 'NOPEAI', tw = textWidth(s), sx0 = X + 12 + ((BW - 14 - tw) >> 1);
    text(b, s, sx0, by + 9, PAL.P2); text(b, s, sx0, by + 8, PAL.P0); // stamped: the letters debossed, a lit lip under each
    // the blade, straight down, teeth on its right
    for (let j = 0; j < 36; j++) for (let i = 0; i < 8; i++) { const tooth = j > 5 && j < 32 && Math.floor(j / 4) % 2 === 0; if (i >= 6 && !tooth) continue; if (j > 32 && i > 4) continue; b.set(X + 22 + i, by + BH + j, i === 0 ? PAL.P2 : i >= 5 ? PAL.P0 : PAL.P1); }
  }
  void f;
};
