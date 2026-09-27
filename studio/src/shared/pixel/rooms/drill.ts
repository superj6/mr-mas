// MR. MAS — shared set: THE ODOMETER DRILL (Ep1 Act One sc 6–7). New file (v3-art-a, 2026-09-27).
// The v3 drill (script draft 6, beat plan act1.json; the kitchen bar, the shaft phrase and Gerg's second post are cut,
// C5): the counter grows into a desk-sized odometer on Mas's desk and drops through it with a clunk (the wide:
// rooms/bullpen-launch.ts drawLaunchWide, st.odo); its last wheel settles, legible, wedged in the bedrock (6.06); the
// hole in the floor from above, Rima peering down it (6.08); the held HIGH: the tile pops up like a toast, far down the
// odometer glows red beside a smaller `$` odometer spinning faster, heat shimmer, the racks stepping green → amber →
// red (6.09); the tear falling through the open tile onto a red-hot GPU, steam in three held puffs, his phone lighting
// red at the frame's edge (7.02). The style-range pass declined the 3D cutaway (style-range §6.1a): this is BASE pixels.
//   drawHoleHigh(b, f, st)     [HIGH] looking down at the floor in front of his desk: the desk's edge (top), the
//                              carpet, the hole, the shaft through the floors, the basement at the bottom
//   drawWedgedWheel(b, f, st)  [ECU] 6.06: the odometer's window wedged in the rock, the last wheel settling on
//                              1,000,000 (st.settle 0..3 held steps; 3 = settled, legible)
//   drawGpuTear(b, f, st)      [ECU] 7.02: the red-hot GPU, the tear landing (st.k frames since it landed), steam
//   drawDeskOdo(b, f, st)      [M] 6.01: his desk at medium scale, the laptop open, the counter detaching from the
//                              plate and growing in three held drawings to the desk-sized machine, spinning
//   HIGH                       the HIGH's geometry (the hole's rect, the shaft's bottom, the phone's corner)
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor, lightness} from '../palette';
import {text} from '../font';
import {blitImg} from '../figure';
import {drawOdometer, odometerSize} from '../kits/odometer';
import {drawRimaStand, RIMA_STAND_DEFAULT} from '../cast/rima-stand';
import {drawMasMedium, MAS_MEDIUM_DEFAULT, MAS_M_DESK} from '../cast/mas-medium';
import {drawChatWindow} from '../kits/chat-window';
import {launchBackM} from './bullpen-launch';

const RH = 203;
export const HIGH = {
  /** the hole in the floor (where the tile was), in the HIGH's frame */
  hole: {x0: 184, y0: 68, x1: 296, y1: 158},
  /** the shaft's bottom (the basement floor under the hole) */
  bottom: {x0: 214, y0: 92, x1: 266, y1: 134},
  /** his desk's front edge across the top of frame, and his phone on it (lights red at 7.02) */
  deskY: 34,
  phone: [360, 14] as [number, number],
};
const H = HIGH;

export interface HoleHighState {
  /** the floor tile: 'gone' (the hole open, the tile fell in: 6.08) · 'toast' 0..2 (popping up, held steps: 6.09) */
  tile?: 'gone' | 0 | 1 | 2;
  /** Rima peering down at the hole's edge (6.08) */
  rima?: boolean;
  /** the glow far below: 0 none · 1 warm · 2 red · 3 red-hot */
  glow?: number;
  /** the racks' held palette step in the basement: 0 green · 1 amber · 2 red */
  racks?: 0 | 1 | 2;
  /** the `$` odometer beside it (6.09) */
  dollar?: boolean;
  /** the tear falling down the shaft: t 0..1, or null (7.02) */
  tear?: number | null;
  /** his phone at the frame's top edge: dark · red (the siren's news alert: 7.02's J-cut) */
  phone?: 'dark' | 'red';
}
const CARPET_TILE = 30;
export const drawHoleHigh = (b: Buf, f: number, st: HoleHighState = {}) => {
  const glow = st.glow ?? 2;
  // the carpet from above: square tiles, fibre noise, the room's night ambient; the hole's red light spills onto the
  // carpet round the opening in stepped rings
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    const seam = ((x + 6) % CARPET_TILE === 0) || ((y + 2) % CARPET_TILE === 0);
    let c = seam ? PAL.N1 : hash(x >> 1, y, 13) < 0.08 ? PAL.N3 : PAL.N2;
    if (glow >= 2) {
      const d = Math.max(0, Math.max(H.hole.x0 - x, x - H.hole.x1, H.hole.y0 - y, y - H.hole.y1)) / 40;
      if (d < 1 && bayer(x, y) < (1 - d) * (glow >= 3 ? 0.75 : 0.5)) c = d < 0.35 ? PAL.R1 : PAL.R0;
    }
    b.set(x, y, c);
  }
  // his desk's front edge across the top (seen from above): the desk top, its lip, the dark under it; his phone on it
  for (let y = 0; y < H.deskY; y++) for (let x = 0; x < 480; x++) b.set(x, y, y > H.deskY - 3 ? PAL.G1 : y === H.deskY - 3 ? PAL.G4 : bayer(x, y) < 0.15 ? PAL.G3 : PAL.G2);
  for (let x = 0; x < 480; x++) { b.set(x, H.deskY, PAL.N0); b.set(x, H.deskY + 1, PAL.N0); b.set(x, H.deskY + 2, PAL.N1); }
  const [px, py] = H.phone;
  rect(px, py, 26, 14, b.ink(PAL.N0)); rect(px + 1, py + 1, 24, 12, b.ink(st.phone === 'red' ? PAL.R2 : PAL.N1));
  if (st.phone === 'red') {
    rect(px + 3, py + 3, 20, 3, b.ink(PAL.R3)); rect(px + 3, py + 8, 14, 1, b.ink(PAL.P1));
    for (let y = py - 4; y < py + 20; y++) for (let x = px - 8; x < px + 34; x++) { const d = Math.hypot((x - px - 13) / 22, (y - py - 7) / 14); if (d < 1 && d > 0.55 && bayer(x, y) < 0.4 && b.get(x, y) !== PAL.N0) b.set(x, y, PAL.R1); }
  }
  // the hole: the torn carpet's edge, then the shaft through the floors, ring by ring toward the basement
  const {x0, y0, x1, y1} = H.hole, B = H.bottom;
  const rings = 5;
  for (let r = 0; r <= rings; r++) {
    const t = r / rings;
    const rx0 = Math.round(x0 + (B.x0 - x0) * t), ry0 = Math.round(y0 + (B.y0 - y0) * t), rx1 = Math.round(x1 + (B.x1 - x1) * t), ry1 = Math.round(y1 + (B.y1 - y1) * t);
    const nt = (r + 1) / rings;
    const nx0 = Math.round(x0 + (B.x0 - x0) * nt), ny0 = Math.round(y0 + (B.y0 - y0) * nt), nx1 = Math.round(x1 + (B.x1 - x1) * nt), ny1 = Math.round(y1 + (B.y1 - y1) * nt);
    // each ring: a floor slab's cut edge (concrete, 2 px), then the storey's dark void down to the next slab; lit red
    // from below, more the deeper it is
    for (let y = ry0; y <= ry1; y++) for (let x = rx0; x <= rx1; x++) {
      if (r < rings && x > nx0 && x < nx1 && y > ny0 && y < ny1) continue;
      const slab = x - rx0 < 2 || rx1 - x < 2 || y - ry0 < 2 || ry1 - y < 2;
      const heat = glow * t;
      let c: number;
      if (slab) c = heat > 2.2 ? PAL.R2 : heat > 1.2 ? PAL.W3 : heat > 0.5 ? PAL.G2 : PAL.G1;
      else c = heat > 2.2 ? (bayer(x, y) < 0.5 ? PAL.R1 : PAL.R0) : heat > 1.2 ? (bayer(x, y) < 0.4 ? PAL.R0 : PAL.N1) : PAL.N0;
      // rebar and pipes in the voids: a few straight runs
      if (!slab && (x + r * 7) % 17 === 0 && hash(x, r, 3) < 0.5) c = heat > 1.5 ? PAL.W4 : PAL.N2;
      b.set(x, y, c);
    }
    if (r === 0) { rect(rx0 - 1, ry0 - 1, rx1 - rx0 + 3, 1, b.ink(PAL.N0)); rect(rx0 - 1, ry1 + 1, rx1 - rx0 + 3, 1, b.ink(PAL.G2)); rect(rx0 - 1, ry0, 1, ry1 - ry0 + 1, b.ink(PAL.N0)); rect(rx1 + 1, ry0, 1, ry1 - ry0 + 1, b.ink(PAL.G2)); }
  }
  // the basement floor at the bottom: the data centre's racks from above in rows (their tops, their LEDs), the bedrock
  // crater, the odometer wedged in it glowing, the `$` odometer beside it
  const rackCol = [PAL.L2, PAL.W6, PAL.R3][st.racks ?? 0], rackTop = [PAL.N2, PAL.W1, PAL.R0][st.racks ?? 0];
  for (let y = B.y0; y <= B.y1; y++) for (let x = B.x0; x <= B.x1; x++) b.set(x, y, bayer(x, y) < 0.5 ? PAL.N1 : PAL.N0);
  for (let row = 0; row < 3; row++) {
    const ry = B.y0 + 3 + row * 14;
    for (let x = B.x0 + 2; x < B.x1 - 2; x++) { b.set(x, ry, rackTop); b.set(x, ry + 1, rackTop); b.set(x, ry + 2, PAL.N0); if ((x + row * 3) % 4 === 0 && hash(x, row + Math.floor(f / 8), 5) < 0.7) b.set(x, ry, rackCol); }
  }
  // the crater and the odometer in it (face up: its window and wheels toward us), the $ one beside it
  const ox = B.x0 + 8, oy = B.y0 + 16;
  ellipse(ox + 16, oy + 8, 22, 11, b.ink(glow >= 3 ? PAL.R1 : PAL.D1));
  ellipse(ox + 16, oy + 8, 18, 8, b.ink(PAL.N0));
  rect(ox, oy + 2, 32, 12, b.ink(glow >= 3 ? PAL.R2 : PAL.W3)); rect(ox, oy + 2, 32, 1, b.ink(glow >= 3 ? PAL.W6 : PAL.W4));
  rect(ox + 2, oy + 6, 28, 6, b.ink(PAL.N0));
  for (let i = 0; i < 7; i++) rect(ox + 3 + i * 4, oy + 7, 3, 4, b.ink(glow >= 3 ? PAL.W8 : PAL.P1));
  if (st.dollar) {
    const dx = B.x1 - 18, dy = B.y0 + 22;
    rect(dx, dy, 14, 9, b.ink(glow >= 3 ? PAL.R2 : PAL.W3)); rect(dx + 1, dy + 3, 12, 5, b.ink(PAL.N0));
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) if (hash(i, j + Math.floor(f / 2), 9) < 0.6) b.set(dx + 2 + i * 4 + (j & 1), dy + 4 + (j >> 1), PAL.W8);
    b.set(dx - 3, dy + 3, PAL.W7); b.set(dx - 3, dy + 5, PAL.W7); b.set(dx - 4, dy + 4, PAL.W7); // its $ label, a glint
  }
  // heat shimmer over the bottom: rows shifted a pixel in held steps (every third frame)
  if (glow >= 2) {
    const k = Math.floor(f / 3);
    for (let y = B.y0 - 8; y <= B.y1; y++) {
      const s = Math.round(Math.sin(y * 0.9 + k) * (glow >= 3 ? 1 : 0.6));
      if (!s) continue;
      const row: number[] = []; for (let x = B.x0 - 6; x <= B.x1 + 6; x++) row.push(b.get(x, y));
      for (let x = B.x0 - 6; x <= B.x1 + 6; x++) b.set(x, y, row[clamp(x - (B.x0 - 6) - s, 0, row.length - 1)]);
    }
  }
  // the tile: gone (it went down the hole) · popping up like a toast, held steps (0 flush, 1 up 5, 2 up 10 and tipped)
  if (st.tile !== undefined && st.tile !== 'gone') {
    const up = [0, 5, 10][st.tile];
    const tx = x0 + 2, ty = y0 + 2 - up, tw = x1 - x0 - 4, th = y1 - y0 - 4;
    // its underside's red light on the carpet where it lifts
    for (let y = ty + th; y < ty + th + up + 2; y++) for (let x = tx; x < tx + tw; x++) if (bayer(x, y) < 0.6) b.set(x, y, PAL.R1);
    for (let y = ty; y < ty + th; y++) for (let x = tx; x < tx + tw; x++) b.set(x, y, ((x + 6) % CARPET_TILE === 0) ? PAL.N1 : hash(x >> 1, y, 14) < 0.08 ? PAL.N3 : PAL.N2);
    rect(tx, ty + th, tw, Math.max(1, up >> 1), b.ink(PAL.N1)); // its edge
    rect(tx, ty, tw, 1, b.ink(PAL.G1));
  }
  // Rima at the hole's near edge, peering down: from above we see the top of her head, her shoulders, her hands on her
  // knees (her room sprite's 'peer' drawing, seen from this high: its upper half, foreshortened by cropping)
  if (st.rima) {
    const rx = x0 + 40, ry = y1 + 24;
    // the top of her head (hair from above: the centre part), her jacket's shoulders, her hands at the edge
    ellipse(rx, ry, 11, 9, b.ink(PAL.B1)); ellipse(rx, ry, 9, 7, b.ink(PAL.B2)); rect(rx, ry - 7, 1, 9, b.ink(PAL.B0));
    for (let i = -6; i <= 6; i += 3) b.set(rx + i, ry + 5, PAL.B3);
    ellipse(rx, ry + 16, 22, 9, b.ink(PAL.G2)); ellipse(rx, ry + 15, 20, 7, b.ink(PAL.G3)); ellipse(rx, ry + 9, 12, 5, b.ink(PAL.B1)); ellipse(rx, ry + 3, 9, 6, b.ink(PAL.B2));
    // the red light from the hole on her crown
    for (let i = -8; i <= 8; i++) if (bayer(rx + i, ry - 6) < 0.5) b.set(rx + i, ry - 6 + Math.round(Math.abs(i) * 0.3), PAL.R2);
    rect(rx - 22, y1 - 2, 6, 4, b.ink(PAL.S4)); rect(rx + 16, y1 - 2, 6, 4, b.ink(PAL.S4)); b.set(rx - 22, y1 - 2, PAL.S5); b.set(rx + 21, y1 - 2, PAL.S5);
  }
  // the tear falling down the shaft: one pixel, cyan, from the rim (t 0) to the GPU at the bottom (t 1); held 2 f steps
  if (typeof st.tear === 'number') {
    const t = clamp(st.tear, 0, 1);
    const tx = Math.round(x0 + 40 + (B.x0 + 20 - x0 - 40) * t), ty = Math.round(y0 + 10 + (B.y0 + 12 - y0 - 10) * t);
    b.set(tx, ty, PAL.C8); if (t < 0.6) b.set(tx, ty - 1, PAL.C6);
  }
};

// ------------------------------------------------------------------ 6.06: the last wheel, legible
export interface WedgedWheelState { settle?: number; value?: number; heat?: number }
/** [ECU] the odometer's window in the rock: the six wheels at 0 already still, the last one settling in held steps
 *  (0 spinning, 1 rolling, 2 overshoot, 3 settled), then held to read: 1,000,000 */
export const drawWedgedWheel = (b: Buf, f: number, st: WedgedWheelState = {}) => {
  const settle = st.settle ?? 3;
  // bedrock: irregular fractured stone (the nearest of a jittered grid of seeds owns each pixel; its edges are the
  // cracks), lit warm from the machine's heat toward the centre
  const seeds: Array<[number, number, number]> = [];
  for (let gy = -1; gy < 8; gy++) for (let gx = -1; gx < 14; gx++) seeds.push([gx * 38 + hash(gx, gy, 31) * 30, gy * 30 + hash(gx, gy, 32) * 24, hash(gx, gy, 33)]);
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
    let d1 = 1e9, d2 = 1e9, tone = 0;
    for (const [sx, sy, t] of seeds) { const d = (x - sx) ** 2 + ((y - sy) * 1.3) ** 2; if (d < d1) { d2 = d1; d1 = d; tone = t; } else if (d < d2) d2 = d; }
    const crack = Math.sqrt(d2) - Math.sqrt(d1) < 1.6;
    const warm = Math.hypot((x - 240) / 260, (y - 95) / 140) < 1 - tone * 0.3;
    b.set(x, y, crack ? PAL.N0 : warm ? (tone < 0.35 ? PAL.D2 : tone < 0.7 ? PAL.D1 : PAL.W1) : tone < 0.4 ? PAL.N2 : tone < 0.75 ? PAL.D0 : PAL.N1);
  }
  const {w, h} = odometerSize('desk', 7);
  const x = Math.round((480 - w) / 2), y = 66;
  // the rock is split round it; it sits a little askew (drawn level: the crack round it carries the angle)
  poly([x - 20, y - 12, x + w + 26, y - 18, x + w + 16, y + h + 20, x - 26, y + h + 14], b.ink(PAL.N0));
  const spin: number[] = [settle === 0 ? 1 : 0, 0, 0, 0, 0, 0, 0];
  const roll = [settle === 1 ? 0.6 : settle === 2 ? 0.15 : 0, 0, 0, 0, 0, 0, 0];
  const v = st.value ?? 1000000;
  // the last wheel is the millions: while it settles it shows 0 rolling up to 1
  const shown = settle >= 3 ? v : v - 1000000;
  drawOdometer(b, x, y, {size: 'desk', value: shown, digits: 7, spin: spin.reverse(), roll: roll.reverse(), heat: st.heat ?? 1, f});
  // shards of rock round it
  for (let k = 0; k < 14; k++) { const a = hash(k, 1, 22) * Math.PI * 2, r = 70 + hash(k, 2, 22) * 60; const sx = Math.round(240 + Math.cos(a) * r * 1.3), sy = Math.round(95 + Math.sin(a) * r * 0.6); rect(sx, sy, 3 + (k % 3), 2, b.ink(k % 2 ? PAL.D2 : PAL.N3)); }
};

// ------------------------------------------------------------------ 7.02: the tear lands on a red-hot GPU
export interface GpuTearState {
  /** frames since the tear landed: < 0 it's still falling (a drop above the card), 0..2 the splash, then the steam's
   *  three held puffs rise (every 5 f) */
  k?: number;
}
export const drawGpuTear = (b: Buf, f: number, st: GpuTearState = {}) => {
  const k = st.k ?? 10;
  // the basement floor, the rack's open bay, red light
  for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) b.set(x, y, bayer(x, y) < 0.45 ? PAL.R0 : PAL.N1);
  // the card, from above: the PCB (dark), its red-hot heatsink fins (a stepped red ramp), two fans' hubs, the edge
  const cx = 100, cy = 50, cw = 280, ch = 110;
  rect(cx + 6, cy + 6, cw, ch, b.ink(PAL.N0));
  rect(cx, cy, cw, ch, b.ink(PAL.D1)); rect(cx, cy, cw, 2, b.ink(PAL.D3));
  for (let x = cx + 10; x < cx + cw - 10; x++) for (let y = cy + 12; y < cy + ch - 12; y++) b.set(x, y, (x - cx) % 6 < 2 ? PAL.R1 : bayer(x, y) < 0.5 ? PAL.R2 : PAL.R3);
  for (const fx of [cx + 80, cx + 200]) {
    ellipse(fx, cy + ch / 2, 34, 34, b.ink(PAL.N1)); ellipse(fx, cy + ch / 2, 30, 30, b.ink(PAL.R1));
    for (let t = 0; t < 7; t++) { const a = (t / 7) * Math.PI * 2 + Math.floor(f / 2) * 0.2; line(fx, cy + ch / 2, Math.round(fx + Math.cos(a) * 28), Math.round(cy + ch / 2 + Math.sin(a) * 28), b.ink(PAL.R2)); }
    ellipse(fx, cy + ch / 2, 8, 8, b.ink(PAL.W5)); ellipse(fx, cy + ch / 2, 4, 4, b.ink(PAL.W8));
  }
  // heat shimmer over it
  for (let y = cy; y < cy + ch; y += 3) for (let x = cx; x < cx + cw; x += 7) if (hash(x, y + Math.floor(f / 3), 44) < 0.12) b.set(x, y, PAL.W7);
  // the tear: a falling drop (k < 0), the splash on the fins (0..2), then the steam
  const tx = cx + 140, ty = cy + 34;
  if (k < 0) { const yy = ty + k * 8; if (yy > 0) { b.set(tx, yy, PAL.C8); b.set(tx, yy - 1, PAL.C6); b.set(tx + 1, yy, PAL.C7); } return; }
  if (k < 3) { b.set(tx, ty, PAL.C9); for (const [dx, dy] of [[-2, -1], [2, -1], [-3, 1], [3, 1]]) b.set(tx + dx * (k + 1), ty + dy * (k + 1), PAL.C7); }
  // the steam: three held puffs, each one higher and softer than the last (P1 / P0 / G5 dither clouds)
  const puffs = Math.min(3, Math.floor(Math.max(0, k - 2) / 5) + (k >= 3 ? 1 : 0));
  for (let p = 0; p < puffs; p++) {
    const py = ty - 10 - p * 22, pr = 9 + p * 5;
    for (let y = py - pr; y <= py + pr; y++) for (let x = tx - pr - 4; x <= tx + pr + 4; x++) {
      const d = Math.hypot((x - tx - (p - 1) * 3) / (pr + 4), (y - py) / pr);
      if (d < 1 && bayer(x, y) < (1 - d) * (1.1 - p * 0.25)) b.set(x, y, p === 0 ? PAL.P1 : p === 1 ? PAL.P0 : PAL.G5);
    }
  }
  // the hiss's mark in the picture: a few bright pixels round the landing
  if (k >= 3) for (let i = 0; i < 6; i++) b.set(tx - 6 + i * 2, ty + (i & 1), PAL.W8);
};

// ------------------------------------------------------------------ 6.01: the counter grows on his desk
export interface DeskOdoState {
  /** 0 the plate on the screen · 1 detached, bigger (held) · 2 bigger still · 3 desk-sized on the desk, spinning */
  grow?: 0 | 1 | 2 | 3;
  value?: number;
  f?: number;
}
/** [M] his desk at medium scale: the laptop open on the chat at frame left, Mas behind it (looking at it), the counter
 *  growing out of the plate in three held drawings until it sits on the desk as a machine the size of the desk */
export const drawDeskOdo = (b: Buf, f: number, st: DeskOdoState = {}) => {
  launchBackM(b, 80, {soft: 1, alyi: 'gone'});
  const g = st.grow ?? 3;
  // Mas behind his desk (medium, flipped to frame right), watching it
  drawMasMedium(b, 40, 40, {...MAS_MEDIUM_DEFAULT, light: 'monitor', head: '34', look: 1, arm: 'rest'}, {flip: true, desk: (bb) => {
    for (let y = 40 + MAS_M_DESK; y < RH; y++) for (let x = 0; x < 480; x++) bb.set(x, y, y === 40 + MAS_M_DESK ? PAL.G4 : y < 40 + MAS_M_DESK + 3 ? PAL.G3 : y < 40 + MAS_M_DESK + 5 ? PAL.G2 : bayer(x, y) < 0.3 ? PAL.N2 : PAL.N1);
  }});
  // his laptop open at frame left on the desk (its screen toward us, three-quarter: the chat window on it)
  const sx = 22, sy = 70, sw = 120, sh = 70;
  rect(sx - 4, sy - 4, sw + 8, sh + 8, b.ink(PAL.N0));
  drawChatWindow(b, sx, sy, sw, sh, {f, bubble: 'talk', users: g === 0 ? 1389 : 0, spin: g === 0, banner: false});
  rect(sx - 10, sy + sh + 4, sw + 20, 4, b.ink(PAL.G2));
  const deskTop = 40 + MAS_M_DESK;
  if (g === 1) drawOdometer(b, 150, 96, {size: 'plate', value: 14000, digits: 7, spin: 1, f});
  if (g === 2) drawOdometer(b, 160, 80, {size: 'ecu', value: 88000, digits: 7, spin: 1, f});
  if (g === 3) {
    const {w, h} = odometerSize('desk', 7);
    drawOdometer(b, 470 - w, deskTop - h + 2, {size: 'desk', value: 301775, digits: 7, spin: 1, f, shake: [f % 4 < 2 ? 0 : 1, 0]});
    // it crowds the laptop: the desk top dips a pixel under its weight, a crack starts in the laminate
    line(470 - w + 10, deskTop + 3, 470 - w + 40, deskTop + 8, b.ink(PAL.N0));
  }
  void text; void blitImg; void drawRimaStand; void RIMA_STAND_DEFAULT; void lightness; void stepColor;
};
