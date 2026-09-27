// MR. MAS — shared room: INT. ELGOOG CAMPUS — LOBBY — DAY, seen full-bleed on Mas's phone (Ep1 sc 8). New file
// (v3-art-a, 2026-09-27). A 480 x 203 room plate.
// An airy corporate atrium in ELGOOG's "skewed primaries" (red, yellow, green and blue, rotated and deliberately
// off-brand: characters/radnus.md), so the rival reads as a place by colour before anyone speaks. The code red: a floor
// slab slides aside (3 held drawings), and up through the hole on a stepped scissor lift (3 held drawings) rises a
// siren the size of a water tower; it turns slowly (8 held beam positions a revolution, one per 3 frames: 1 rev/s,
// inside the photosensitivity limit of 2), its red sweeping the lobby in palette steps. RADNUS stands serenely beside
// the hole (cast/radnus.ts). Behind the siren, stone steps go down into a crypt: the founders climb out of it one held
// step at a time (cast/elgoog-founders.ts), into the day.
// It is on his phone: `chrome` draws the thin status bar and the rounded screen corners, so a newcomer knows whose
// screen this is (drop it for a pure full-bleed).
//   drawElgoogLobby(b, f, st)    the plate + the siren + its sweep; the cast is the caller's (or st.cast)
//   ELGOOG                       the geometry: the hole, the lift's column, the crypt's mouth and its steps, feet lines
//   sirenBeamAt(f)               the beam's held position (0..7)
//   stairFoot(step)              where a founder's feet are on the crypt stair, step 0 (deepest) .. 3 (the top)
import {Buf, rect, line, poly, ellipse, hash, bayer, clamp} from '../px';
import {PAL, stepColor, lightness} from '../palette';
import {MatBuf, resolve, defineMat} from '../light';
import {text, textWidth} from '../font';
import {drawRadnus, RadnusPose, RADNUS_DEFAULT, radnusFlameAt} from '../cast/radnus';
import {drawFounder, FounderPose, FOUNDER_DEFAULT} from '../cast/elgoog-founders';

const RH = 203;
export const ELGOOG = {
  floorY: 138,
  /** the floor slab / the hole it opens */
  hole: {x0: 168, x1: 252, y0: 150, y1: 164},
  /** the scissor lift's column centre */
  liftX: 210,
  /** the crypt's mouth in the floor behind the siren, and its steps down */
  crypt: {x0: 300, x1: 372, y0: 132, y1: 146},
  radnusFoot: [132, 176] as [number, number],
  founderTop: [[312, 150], [356, 152]] as Array<[number, number]>,
};
const E = ELGOOG;

defineMat('eg.wall', ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'G6'], ['N1', 'N2', 'N3', 'N5', 'N6', 'N7', 'N8', 'P1'], ['N1', 'N3', 'G3', 'G4', 'G5', 'G6', 'P1', 'P2']);
defineMat('eg.floor', ['N1', 'N2', 'N3', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N1', 'N2', 'N3', 'G3', 'G4', 'G5', 'G6', 'P1'], ['N1', 'G2', 'G3', 'G4', 'G5', 'G6', 'P1', 'P2']);
defineMat('eg.stone', ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'N2', 'G1', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'G1', 'G2', 'G3', 'G4', 'G5', 'P0']);
defineMat('eg.frame', ['N0', 'N1', 'N2', 'N3', 'G2', 'G3', 'G4', 'G5'], ['N0', 'N1', 'N2', 'G2', 'G3', 'G4', 'G5', 'G6'], ['N0', 'N1', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6']);
// the four skewed primaries as flat materials (the panels, the furniture): their own ramps, lit by the same light
defineMat('eg.red', ['R0', 'R0', 'R1', 'R1', 'R2', 'R2', 'R3', 'R3'], ['R0', 'R1', 'R1', 'R2', 'R2', 'R3', 'R3', 'W6'], ['R0', 'R1', 'R2', 'R2', 'R3', 'R3', 'W6', 'W7']);
defineMat('eg.yel', ['W2', 'W3', 'W4', 'W5', 'W6', 'W6', 'W7', 'W7'], ['W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W7', 'W8'], ['W3', 'W4', 'W5', 'W6', 'W7', 'W7', 'W8', 'W8']);
defineMat('eg.grn', ['L0', 'L0', 'L1', 'L1', 'L2', 'L2', 'L3', 'L3'], ['L0', 'L1', 'L1', 'L2', 'L2', 'L3', 'L3', 'L3'], ['L0', 'L1', 'L1', 'L2', 'L2', 'L3', 'L3', 'L3']);
defineMat('eg.blu', ['F1', 'F2', 'F3', 'F3', 'F4', 'F4', 'F5', 'F6'], ['F1', 'F2', 'F3', 'F4', 'F4', 'F5', 'F5', 'F6'], ['F2', 'F3', 'F3', 'F4', 'F5', 'F5', 'F6', 'F6']);

let base: Buf | null = null;
const paintBase = () => {
  if (base) return base;
  const mb = new MatBuf(480, RH);
  const P = (m: string, l = 0) => mb.mat(m, l), S = (d: number) => mb.shade(d);
  // the ceiling: a white slatted canopy high over the atrium
  rect(0, 0, 480, 12, P('eg.wall', 1.4)); for (let x = 0; x < 480; x += 6) rect(x, 0, 2, 12, S(-0.8)); rect(0, 12, 480, 2, P('eg.frame', 0));
  // the back wall: a glass curtain wall (the day outside, emissive after), its mullions; a mezzanine rail across it
  rect(0, 14, 480, E.floorY - 14, P('eg.wall', 0.6));
  rect(0, 60, 480, 4, P('eg.frame', 0.6)); rect(0, 60, 480, 1, S(1));
  for (let x = 0; x < 480; x += 3) if (x % 12 === 0) rect(x, 64, 1, 10, P('eg.frame', 0.4)); // the mezzanine's glass rail posts
  rect(0, 74, 480, 2, P('eg.frame', 0.8));
  // the primaries: tall colour panels between the glass bays (rotated order), a bench and two cubes on the floor
  const cols = ['eg.grn', 'eg.red', 'eg.blu', 'eg.yel'];
  for (let k = 0; k < 6; k++) { const x = 20 + k * 80; rect(x, 76, 10, E.floorY - 76, P(cols[k % 4], 0)); rect(x, 76, 1, E.floorY - 76, S(1)); }
  // the floor: polished pale tiles in depth bands, the sky's reflection
  rect(0, E.floorY, 480, RH - E.floorY, P('eg.floor', 0.4));
  for (let x = -600; x < 1100; x += 40) line(x, E.floorY, Math.round(240 + (x - 240) * 2.4), RH, S(-0.6));
  for (const y of [E.floorY + 6, E.floorY + 14, E.floorY + 25, E.floorY + 40, E.floorY + 58]) rect(0, y, 480, 1, S(-0.6));
  // furniture in primaries: a long bench (blue), two cubes (yellow, red), a planter (green)
  rect(24, 152, 70, 8, P('eg.blu', 0)); rect(24, 152, 70, 1, S(1.2)); rect(28, 160, 4, 8, P('eg.frame', 0)); rect(86, 160, 4, 8, P('eg.frame', 0));
  rect(420, 148, 18, 16, P('eg.yel', 0)); rect(420, 148, 18, 1, S(1.2)); rect(442, 156, 14, 12, P('eg.red', 0)); rect(442, 156, 14, 1, S(1.2));
  rect(398, 130, 16, 14, P('eg.grn', -0.5)); for (const [ax, bx, by] of [[405, 398, 112], [406, 408, 108], [406, 416, 114]]) line(ax, 130, bx, by, P('eg.grn', 0.8));
  // the crypt: a stone mouth in the floor behind the siren, a rounded arch of old stone over steps that go down into
  // the dark (it was always there, under the lobby)
  const c = E.crypt;
  rect(c.x0 - 6, c.y0 - 26, c.x1 - c.x0 + 12, 26, P('eg.stone', 0.4));
  for (let y = c.y0 - 26; y < c.y0; y++) for (let x = c.x0 - 6; x < c.x1 + 6; x++) if (((x - c.x0) % 12 === 0) || ((y - c.y0) % 7 === 0)) S(-1)(x, y);
  // the opening under the arch (dark), and the steps: lighter treads stepping down toward the dark
  for (let y = c.y0 - 20; y < c.y1 + 8; y++) for (let x = c.x0; x < c.x1; x++) {
    const u = (x - c.x0) / (c.x1 - c.x0), arch = c.y0 - 20 + Math.round(8 * (1 - Math.sin(Math.PI * u)));
    if (y < arch) continue;
    P('eg.stone', -3)(x, y);
  }
  for (let k = 0; k < 4; k++) { const ty = c.y0 - 2 + k * 4, inset = 4 + k * 3; rect(c.x0 + inset, ty, c.x1 - c.x0 - inset * 2, 1, P('eg.stone', 1 - k * 0.9)); rect(c.x0 + inset, ty + 1, c.x1 - c.x0 - inset * 2, 1, S(-1)); }
  // the floor slab (closed), its seam
  const h = E.hole;
  rect(h.x0, h.y0, h.x1 - h.x0, 1, S(-1.2)); rect(h.x0, h.y1, h.x1 - h.x0, 1, S(-1.2)); rect(h.x0, h.y0, 1, h.y1 - h.y0, S(-1.2)); rect(h.x1, h.y0, 1, h.y1 - h.y0 + 1, S(-1.2));
  const L = {
    amb: (x: number, y: number) => 4.6 + (y < E.floorY ? clamp(1 - y / 120, 0, 1) * 0.8 : -(y - E.floorY) / 90),
    cyan: (x: number, y: number) => (y < 60 ? 0.6 : y < E.floorY ? 0.35 : 0.25), // the day through the glass
    warm: () => 0,
    dither: 0.55,
  };
  const buf = new Buf(480, RH, PAL.N0);
  resolve(mb, L, buf, 0);
  // the day through the curtain wall (above the mezzanine and between the panels, lower): sky, trees, a far hill
  for (let y = 14; y < 60; y++) for (let x = 0; x < 480; x++) { const t = (y - 14) / 46 + (bayer(x, y) - 0.5) * 0.2; buf.set(x, y, x % 40 < 2 ? PAL.G4 : t < 0.35 ? PAL.N8 : t < 0.75 ? PAL.G6 : PAL.P1); }
  for (let x = 0; x < 480; x++) { const hy = 48 + Math.round(4 * Math.sin(x * 0.03) + 2 * Math.sin(x * 0.11)); for (let y = hy; y < 60; y++) if (x % 40 >= 2) buf.set(x, y, (x + y) % 3 ? PAL.L1 : PAL.L2); }
  const keep = (x: number, y: number) => (x >= E.crypt.x0 - 6 && x < E.crypt.x1 + 6 && y >= E.crypt.y0 - 26) || (x >= 396 && x < 418 && y >= 106);
  for (let y = 76; y < E.floorY; y++) for (let x = 0; x < 480; x++) { if (keep(x, y) || (x - 20) % 80 < 10) continue; if ((x % 40) < 2) { buf.set(x, y, PAL.G4); continue; } const t = (y - 76) / 62; buf.set(x, y, t < 0.5 ? (bayer(x, y) < 0.3 ? PAL.G5 : PAL.G6) : (x + y) % 4 === 0 ? PAL.L2 : PAL.L1); }
  base = buf;
  return base;
};
// re-draw the colour panels over the day (paintBase's day pass covers the lower glass; the panels sit in front)
const panels = (b: Buf) => {
  const cols: Array<[number, number, number]> = [[PAL.L1, PAL.L2, PAL.L3], [PAL.R1, PAL.R2, PAL.R3], [PAL.F3, PAL.F4, PAL.F5], [PAL.W5, PAL.W6, PAL.W7]];
  for (let k = 0; k < 6; k++) { const x = 20 + k * 80, c = cols[k % 4]; for (let y = 76; y < E.floorY; y++) for (let i = 0; i < 10; i++) b.set(x + i, y, i === 0 ? c[2] : i > 7 ? c[0] : c[1]); }
};

export const sirenBeamAt = (f: number) => Math.floor(f / 3) % 8;
export const stairFoot = (step: number, who: 0 | 1): [number, number] => {
  const [tx, ty] = E.founderTop[who];
  const deep = 3 - clamp(step, 0, 3);
  return [tx - (who ? 0 : -2) * deep, ty + deep * 9];
};

export interface ElgoogState {
  /** the floor slab: 0 closed · 1..3 sliding aside (held) · 3 open */
  slab?: number;
  /** the lift: 0 down (nothing) · 1..3 rising (held drawings) · 3 up, the siren clear of the atrium */
  lift?: number;
  /** the siren turning (its beam sweeping the lobby) */
  turning?: boolean;
  /** the status bar and the screen's rounded corners (on his phone) */
  chrome?: boolean;
  /** the cast, in the plate's order (drawn under the siren's sweep) */
  radnus?: Partial<RadnusPose> & {at?: [number, number]} | null;
  /** the founders: their stair step 0 (deepest) .. 3 (the top) .. 4 (out on the floor), and poses */
  nirb?: (Partial<FounderPose> & {step: number}) | null;
  egap?: (Partial<FounderPose> & {step: number}) | null;
}
export const drawElgoogLobby = (b: Buf, f: number, st: ElgoogState = {}) => {
  const src = paintBase();
  for (let y = 0; y < RH; y++) b.c.set(src.c.subarray(y * 480, (y + 1) * 480), y * b.w);
  panels(b);
  const h = E.hole;
  const slab = clamp(st.slab ?? 0, 0, 3), lift = clamp(st.lift ?? 0, 0, 3);
  // the hole (as the slab slides left under the floor): black with the lift's machinery a rung up
  if (slab > 0) {
    const open = Math.round((h.x1 - h.x0) * slab / 3);
    rect(h.x1 - open, h.y0, open, h.y1 - h.y0, b.ink(PAL.N0));
    for (let x = h.x1 - open; x < h.x1; x += 5) rect(x, h.y0 + 2, 1, h.y1 - h.y0 - 3, b.ink(PAL.N1));
    // the slab itself, slid aside: its edge showing at the hole's left lip
    if (slab < 3) rect(h.x0, h.y0, h.x1 - h.x0 - open, h.y1 - h.y0, b.ink(PAL.G4));
    rect(h.x1 - open, h.y0, open, 1, b.ink(PAL.G2));
  }
  // the scissor lift and the siren on it: the platform's height by the held drawing
  const top = [h.y0, 118, 72, 40][lift];
  const cx = E.liftX;
  if (lift > 0) {
    // the scissor: X braces from the hole to the platform, stepped (grey steel, yellow-black hazard edge on the deck)
    const n = [0, 1, 3, 5][lift], seg = (h.y0 - top - 8) / Math.max(1, n);
    for (let k = 0; k < n; k++) {
      const y0 = Math.round(top + 8 + k * seg), y1 = Math.round(top + 8 + (k + 1) * seg);
      line(cx - 22, y0, cx + 22, y1, b.ink(PAL.G3)); line(cx + 22, y0, cx - 22, y1, b.ink(PAL.G3));
      line(cx - 22, y0 + 1, cx + 22, y1 + 1, b.ink(PAL.G1)); line(cx + 22, y0 + 1, cx - 22, y1 + 1, b.ink(PAL.G1));
      b.set(cx, Math.round((y0 + y1) / 2), PAL.G5);
    }
    rect(cx - 28, top + 4, 56, 4, b.ink(PAL.G2)); for (let x = cx - 28; x < cx + 28; x += 4) rect(x, top + 4, 2, 1, b.ink(PAL.W6));
    // the siren: a red dome the size of a water tower on a squat base, a hot lamp inside that turns
    rect(cx - 22, top - 4, 44, 8, b.ink(PAL.G1)); rect(cx - 22, top - 4, 44, 1, b.ink(PAL.G4));
    const beam = st.turning ? sirenBeamAt(f) : 2;
    for (let y = top - 48; y < top - 4; y++) for (let x = cx - 24; x <= cx + 24; x++) {
      const d = Math.hypot((x - cx) / 24, (y - (top - 4)) / 44);
      if (d > 1 || y > top - 4) continue;
      // the lamp inside: its bright side faces the beam's direction; the dome's red ramp round it
      const ang = Math.atan2(y - (top - 26), x - cx), bdir = (beam / 8) * Math.PI * 2 - Math.PI / 2;
      const facing = Math.cos(ang - bdir);
      const lit = d < 0.45 ? (facing > 0.3 ? PAL.W8 : PAL.W6) : facing > 0.5 && d < 0.85 ? PAL.R3 : d > 0.9 ? PAL.R1 : PAL.R2;
      b.set(x, y, lit);
    }
    // the dome's highlight and its ribs
    for (let y = top - 44; y < top - 8; y += 9) for (let x = cx - 22; x <= cx + 22; x++) if (Math.hypot((x - cx) / 24, (y - (top - 4)) / 44) < 0.98) b.set(x, y, stepColor(b.get(x, y), -1));
    rect(cx - 12, top - 42, 5, 2, b.ink(PAL.W9)); b.set(cx - 13, top - 40, PAL.W8);
  }
  // the cast (under the sweep)
  if (st.nirb) { const [fx, fy] = st.nirb.step >= 4 ? [312, 176] : stairFoot(st.nirb.step, 0); drawFounder(b, 'nirb', fx, fy, {...FOUNDER_DEFAULT, lit: st.nirb.step >= 3 ? 1 : 0, ...st.nirb}, {clip: (x, y) => st.nirb!.step >= 3 || y < E.crypt.y0 + 2 + (3 - st.nirb!.step) * 2 || x < E.crypt.x0 || x >= E.crypt.x1 ? true : y < E.crypt.y0 + 4}); }
  if (st.egap) { const [fx, fy] = st.egap.step >= 4 ? [360, 178] : stairFoot(st.egap.step, 1); drawFounder(b, 'egap', fx, fy, {...FOUNDER_DEFAULT, arm: 'mug', lit: st.egap.step >= 3 ? 1 : 0, ...st.egap}, {clip: (x, y) => st.egap!.step >= 3 || y < E.crypt.y0 + 4}); }
  if (st.radnus !== null && st.radnus !== undefined) {
    const [rx, ry] = st.radnus.at ?? E.radnusFoot;
    drawRadnus(b, rx, ry, {...RADNUS_DEFAULT, fire: radnusFlameAt(f), ...st.radnus}, {flip: true});
  }
  // the siren's sweep: a wedge of red across the lobby from the dome, in palette steps (a gel on what it passes)
  if (lift >= 3 && st.turning) {
    const beam = sirenBeamAt(f), bdir = (beam / 8) * Math.PI * 2 - Math.PI / 2;
    const ox = cx, oy = top - 26;
    // only the half of the turn that faces the room lands on it (the beam's far side lights the ceiling slats)
    for (let y = 0; y < RH; y++) for (let x = 0; x < 480; x++) {
      const a = Math.atan2(y - oy, x - ox), da = Math.abs(((a - bdir + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (da > 0.32 || Math.hypot(x - ox, y - oy) < 26) continue;
      const soft = da > 0.22;
      if (soft && bayer(x, y) > 0.5) continue;
      const c = b.get(x, y), L = lightness(c);
      b.set(x, y, L > 0.62 ? PAL.W7 : L > 0.45 ? PAL.R3 : L > 0.28 ? PAL.R2 : L > 0.14 ? PAL.R1 : PAL.R0);
    }
  }
  if (st.chrome) {
    // the phone's status bar (generic: a dot row, a battery) and the screen's rounded corners
    rect(0, 0, 480, 7, b.ink(PAL.N0));
    for (let i = 0; i < 4; i++) rect(8 + i * 3, 4 - i, 2, 1 + i, b.ink(PAL.G5));
    rect(452, 2, 18, 4, b.ink(PAL.G5)); rect(453, 3, 12, 2, b.ink(PAL.L2)); rect(470, 3, 1, 2, b.ink(PAL.G5));
    for (const [cx0, cy0, sx, sy] of [[0, 0, 1, 1], [479, 0, -1, 1], [0, RH - 1, 1, -1], [479, RH - 1, -1, -1]] as Array<[number, number, number, number]>)
      for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) if (Math.hypot(5.5 - i, 5.5 - j) > 5.5) b.set(cx0 + i * sx, cy0 + j * sy, PAL.N0);
  }
  void text; void textWidth; void poly; void ellipse; void hash;
};
