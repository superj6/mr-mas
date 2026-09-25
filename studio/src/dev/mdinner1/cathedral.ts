// MR. MAS — mdinner1: ALYI's bay lights into a SERVER CATHEDRAL (f285-299). The restaurant's architecture IS
// the machine: the fluted pilasters are rack columns, the recessed panel opens into an endless nave whose
// vanishing point sits behind Alyi's head (his halo), the oculus becomes a neural-net rose window, LED votives
// flicker on tiered stands, and god-rays fall on the table. All direct master-palette colour, world coords,
// staged in held steps on the beat grid. No soft glows: light is dither and palette steps.
import {Buf, bayer, clamp, hash, line, rect} from '../../shared/pixel/px';
import {PAL, stepColor} from '../../shared/pixel/palette';
import {Mask} from '../../shared/pixel/mask';
import {BAY, TABLE} from './set';

export const NAVE = {x0: BAY.x0 + BAY.pw + 6, x1: BAY.x1 - BAY.pw - 7, y0: 96, y1: 207, vx: BAY.cx, vy: 150} as const;

export interface CathState {
  /** global frame (LED blink / votive flicker, frozen by the caller during a freeze) */
  t: number;
  /** 0..1 rack LEDs powered (a ripple from the floor up) */
  racks: number;
  /** -3..0 nave brightness step (held drawings: dark -> lit) or null = not open yet */
  nave: number | null;
  /** votives lit (0..1 fraction) */
  votives: number;
  /** rose window: 0 off (dusk glass), 1 lit */
  rose: 0 | 1;
  /** god-ray length 0..1 */
  rays: number;
}

/** The staging on the beat grid (global frames). */
export const cathAt = (g: number, t: number): CathState => ({
  t,
  racks: g < 285 ? 0 : clamp((g - 284) / 4, 0, 1),
  nave: g < 286 ? null : g < 287 ? -3 : g < 288 ? -2 : g < 289 ? -1 : 0,
  votives: g < 289 ? 0 : clamp((g - 288) / 3, 0, 1),
  rose: g < 292 ? 0 : 1,
  rays: g < 294 ? 0 : g < 295 ? 0.34 : g < 296 ? 0.67 : 1,
});
/** Cool light level the cathedral throws on the room (for the set's light rig). */
export const cathLight = (g: number) => (g < 285 ? 0 : g < 287 ? 0.3 : g < 289 ? 0.6 : g < 292 ? 0.8 : 1);

const put = (b: Buf, x: number, y: number, c: number, k: number) => b.set(x, y, k ? stepColor(c, k) : c);

/** The opening in the bay: a pointed (lancet) arch, springing at y0 + 34. */
export const inNaveArch = (x: number, y: number) => {
  const {x0, x1, y0, y1} = NAVE;
  if (x < x0 || x > x1 || y > y1 || y < y0 - 22) return false;
  const spring = y0 + 20;
  if (y >= spring) return true;
  const w = x1 - x0 + 1, r = w * 0.9;
  const dy = spring - y;
  return (x + 0.5 - (x1 + 1 - r)) ** 2 + dy * dy <= r * r && (x + 0.5 - (x0 + r)) ** 2 + dy * dy <= r * r;
};
/** The endless nave inside the recessed panel (one-point perspective, VP behind Alyi's head). */
const drawNave = (b: Buf, ox: number, oy: number, s: CathState) => {
  const k = s.nave ?? 0;
  const {x0, x1, y0, y1, vx, vy} = NAVE;
  const F = 5;
  const proj = (X: number, Y: number, z: number): [number, number] => [vx + (X / z) * F, vy + (Y / z) * F];
  // far core glow
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      if (!inNaveArch(x, y)) continue;
      const d = Math.hypot(x - vx, (y - vy) * 1.25);
      const v = clamp(1 - d / 70, 0, 1);
      const q = v * v * 7 + bayer(x, y) - 0.5;
      const rmp = [PAL.N0, PAL.N1, PAL.N2, PAL.C0, PAL.C1, PAL.C2, PAL.C4, PAL.C6];
      put(b, x - ox, y - oy, rmp[clamp(Math.floor(q), 0, 7)], k);
    }
  const inside = (x: number, y: number) => inNaveArch(x, y);
  const dot = (x: number, y: number, c: number) => { x = Math.round(x); y = Math.round(y); if (inside(x, y)) put(b, x - ox, y - oy, c, k); };
  const seg = (xa: number, ya: number, xb: number, yb: number, c: number) => line(Math.round(xa), Math.round(ya), Math.round(xb), Math.round(yb), (x, y) => dot(x, y, c));
  const zs: number[] = [];
  for (let z = 1.2; z < 40; z *= 1.22) zs.push(z);
  // floor seams
  for (let X = -120; X <= 120; X += 20) { const [a, ay] = proj(X, 40, 1.2), [c, cy] = proj(X, 40, 40); seg(a, ay, c, cy, Math.abs(X) < 30 ? PAL.C1 : PAL.N2); }
  // gothic ribs: pointed arches at each slice (far first)
  for (let i = zs.length - 1; i >= 0; i -= 2) {
    const z = zs[i];
    const col = z > 12 ? PAL.C3 : z > 5 ? PAL.C2 : PAL.N6;
    const a = 60, spring = -30;
    let prev: [number, number] | null = null;
    for (let t = 0; t <= 16; t++) {
      const th = Math.PI - (t / 16) * (Math.PI / 3);
      const p = proj(a + 2 * a * Math.cos(th), spring - 2 * a * Math.sin(th), z);
      if (prev) seg(prev[0], prev[1], p[0], p[1], col);
      prev = p;
    }
    prev = null;
    for (let t = 0; t <= 16; t++) {
      const th = Math.PI - (t / 16) * (Math.PI / 3);
      const p = proj(-(a + 2 * a * Math.cos(th)), spring - 2 * a * Math.sin(th), z);
      if (prev) seg(prev[0], prev[1], p[0], p[1], col);
      prev = p;
    }
    for (const sgn of [-1, 1]) { const [px, py] = proj(sgn * a, spring, z), [, pb] = proj(sgn * a, 40, z); seg(px, py, px, pb, z > 10 ? PAL.N3 : PAL.N2); }
  }
  // rack rows facing the aisle, LEDs as dots (blink hashed on the clock, held 3)
  for (let i = zs.length - 2; i >= 0; i--) {
    const z0 = zs[i], z1 = zs[i + 1] * 0.96;
    for (const sgn of [-1, 1]) {
      const X = sgn * 26;
      const [ax, at] = proj(X, -18, z0), [, ab] = proj(X, 40, z0), [bx, bt] = proj(X, -18, z1), [, bb] = proj(X, 40, z1);
      for (let x = Math.round(Math.min(ax, bx)); x <= Math.round(Math.max(ax, bx)); x++) {
        const u = (x - ax) / ((bx - ax) || 1);
        const top = at + (bt - at) * u, bot = ab + (bb - ab) * u;
        for (let y = Math.round(top); y <= Math.round(bot); y++) dot(x, y, z0 > 10 ? PAL.N3 : PAL.N2);
        dot(x, top, z0 > 10 ? PAL.C3 : PAL.C4);
      }
      seg(ax, at, ax, ab, z0 > 10 ? PAL.C2 : PAL.C3);
      const rows = z0 < 3 ? 8 : z0 < 7 ? 5 : 3;
      for (let r = 0; r < rows; r++) {
        const Y = -14 + (r * 50) / rows;
        for (let c = 0; c < 2; c++) {
          const zz = z0 + ((z1 - z0) * (c + 0.5)) / 2;
          const [lx, ly] = proj(X, Y, zz);
          const h = hash(i * 17 + c, r * 5 + (sgn > 0 ? 3 : 0), 41);
          if (hash(i * 17 + c, r, Math.floor(s.t / 3) + ((h * 5) | 0)) > 0.75) continue;
          dot(lx, ly, h < 0.1 ? PAL.W6 : h < 0.55 ? PAL.C6 : h < 0.85 ? PAL.C5 : PAL.C8);
        }
      }
    }
  }
  // the core at the vanishing point
  dot(vx, vy, PAL.C9); dot(vx, vy - 1, PAL.C8); dot(vx, vy + 1, PAL.C8); dot(vx - 1, vy, PAL.C7); dot(vx + 1, vy, PAL.C7);
};

/** The fluted pilasters become rack columns (LED rows switch on as a ripple from the floor up). */
const drawRackPilaster = (b: Buf, px: number, ox: number, oy: number, s: CathState) => {
  const top = 32, bot = 210;
  for (let y = top; y < bot; y++) {
    const unit = Math.floor((y - top) / 4), row = (y - top) % 4;
    const lit = 1 - (y - top) / (bot - top) <= s.racks + 0.02;
    for (let i = 1; i < BAY.pw - 1; i++) {
      let c: number = row === 3 ? PAL.N0 : i === 1 ? PAL.N3 : i === BAY.pw - 2 ? PAL.N1 : PAL.N2;
      if (row === 0 && i > 1 && i < BAY.pw - 2) c = PAL.N3;
      if (lit && row === 1 && i >= 3 && i <= BAY.pw - 4 && (i - 3) % 2 === 0) {
        const h = hash(px + i, unit, 7);
        const on = hash(px + i, unit, Math.floor(s.t / (2 + ((h * 3) | 0)))) < 0.7;
        c = !on ? PAL.C0 : h < 0.12 ? PAL.W6 : h < 0.3 ? PAL.L3 : h < 0.75 ? PAL.C6 : PAL.C8;
      }
      if (lit && row === 2 && i === BAY.pw - 3) c = PAL.C2;
      b.set(px + i - ox, y - oy, c);
    }
  }
};

/** Tiered stands of LED votives (the church's prayer candles, as status lights). */
const drawVotives = (b: Buf, cx: number, ox: number, oy: number, s: CathState) => {
  const tiers = [[190, 11], [196, 14], [202, 17]] as const;
  for (const [ty, hw] of tiers) {
    rect(cx - hw - ox, ty + 2 - oy, hw * 2 + 1, 1, b.ink(PAL.N3));
    rect(cx - hw - ox, ty + 3 - oy, hw * 2 + 1, 1, b.ink(PAL.N1));
    for (let i = -hw + 1; i <= hw - 1; i += 3) {
      const h = hash(cx + i, ty, 5);
      if (h > s.votives) { b.set(cx + i - ox, ty + 1 - oy, PAL.N2); continue; }
      const fl = hash(cx + i, ty, Math.floor(s.t / 2)) < 0.8;
      b.set(cx + i - ox, ty + 1 - oy, PAL.P1);
      b.set(cx + i - ox, ty - oy, fl ? (h < 0.5 ? PAL.W8 : PAL.C8) : (h < 0.5 ? PAL.W6 : PAL.C6));
    }
  }
  rect(cx - ox, 205 - oy, 1, 4, b.ink(PAL.N2));
};

/** Mask of the oculus disc (the rose window) — for the 2-frame GLYPH boot. Screen coords. */
export const roseMask = (ox: number, oy: number) => new Mask().addEllipse(BAY.cx - ox + 0.5, BAY.oy - oy + 0.5, BAY.or - 0.5, BAY.or - 0.5);

/** Neural-net stained glass: node rings joined by lead came, jewel panes, glowing nodes. */
export const drawRose = (b: Buf, ox: number, oy: number) => {
  const R = BAY.or, cx = BAY.cx, cy = BAY.oy;
  const ring1 = Array.from({length: 6}, (_, i) => (i / 6) * Math.PI * 2 - Math.PI / 2);
  const ring2 = Array.from({length: 12}, (_, i) => (i / 12) * Math.PI * 2 - Math.PI / 2 + Math.PI / 12);
  const P1 = ring1.map((a) => [cx + Math.cos(a) * 8.5, cy + Math.sin(a) * 8.5]);
  const P2 = ring2.map((a) => [cx + Math.cos(a) * 16.5, cy + Math.sin(a) * 16.5]);
  const jewels = [PAL.C4, PAL.W5, PAL.C5, PAL.R2, PAL.N6, PAL.L2, PAL.C4, PAL.W6, PAL.C5, PAL.R1, PAL.N7, PAL.L2];
  for (let y = cy - R; y <= cy + R; y++)
    for (let x = cx - R; x <= cx + R; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy);
      if (d > R - 0.5) continue;
      const a = (Math.atan2(dy, dx) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
      const sec = Math.floor((a / (Math.PI * 2)) * 12) % 12;
      const band = d < 8.5 ? 0 : d < 16.5 ? 1 : 2;
      let c = band === 0 ? PAL.C6 : jewels[(sec + band * 3) % 12];
      // glass is never flat: a lighter pane centre, darker toward the lead
      const inner = band === 1 ? Math.abs(d - 12.5) < 2 : band === 2 ? Math.abs(d - 20) < 1.6 : d < 4;
      if (inner && bayer(x, y) < 0.6) c = stepColor(c, 1);
      b.set(x - ox, y - oy, c);
    }
  const lead = (xa: number, ya: number, xb: number, yb: number) => line(Math.round(xa), Math.round(ya), Math.round(xb), Math.round(yb), (x, y) => b.set(x - ox, y - oy, PAL.N0));
  for (let i = 0; i < 6; i++) lead(cx, cy, P1[i][0], P1[i][1]);
  for (let i = 0; i < 6; i++) for (const j of [2 * i, 2 * i + 1, (2 * i + 11) % 12]) lead(P1[i][0], P1[i][1], P2[j][0], P2[j][1]);
  for (let j = 0; j < 12; j++) { const a = ring2[j]; lead(P2[j][0], P2[j][1], cx + Math.cos(a) * (R - 1), cy + Math.sin(a) * (R - 1)); }
  for (let k = 0; k < 96; k++) { const a = (k / 96) * Math.PI * 2; b.set(Math.round(cx + Math.cos(a) * (R - 0.8)) - ox, Math.round(cy + Math.sin(a) * (R - 0.8)) - oy, PAL.N0); }
  const node = (x: number, y: number, hot: number) => {
    const X = Math.round(x) - ox, Y = Math.round(y) - oy;
    for (const [i, j] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]) b.set(X + i, Y + j, i || j ? PAL.N0 : hot);
    b.set(X, Y, hot);
  };
  for (const [x, y] of P2) node(x, y, PAL.C8);
  for (const [x, y] of P1) node(x, y, PAL.C9);
  node(cx, cy, PAL.P2);
  b.set(cx - ox - 1, cy - oy, PAL.C9); b.set(cx - ox + 1, cy - oy, PAL.C9); b.set(cx - ox, cy - oy - 1, PAL.C9); b.set(cx - ox, cy - oy + 1, PAL.C9);
};

/** light in the air: the dark end of the palette lifts toward machine cyan, everything else one rung */
const RAY_LIFT = new Map<number, number>([
  [PAL.N0, PAL.C0], [PAL.N1, PAL.C1], [PAL.N2, PAL.C1], [PAL.N3, PAL.C2], [PAL.N4, PAL.C2], [PAL.C0, PAL.C2], [PAL.C1, PAL.C3],
  [PAL.C2, PAL.C4], [PAL.C3, PAL.C5], [PAL.C4, PAL.C6], [PAL.C5, PAL.C7], [PAL.C6, PAL.C8], [PAL.D0, PAL.C0], [PAL.D1, PAL.C1],
  [PAL.X0, PAL.K1], [PAL.X1, PAL.K2], [PAL.S1, PAL.K1], [PAL.S2, PAL.K2], [PAL.S3, PAL.K2], [PAL.S4, PAL.K3], [PAL.S5, PAL.K4],
]);
/** God-rays: three dithered shafts from the rose window, falling on Alyi's seat and the table. */
const drawRays = (b: Buf, ox: number, oy: number, s: CathState, skip?: (x: number, y: number) => boolean) => {
  if (s.rays <= 0) return;
  const cx = BAY.cx, cy = BAY.oy + BAY.or - 2;
  const rays: Array<[number, number, number]> = [[-0.36, 0.1, 0.42], [0.0, 0.09, 0.62], [0.33, 0.1, 0.38]]; // [slope dx/dy, half-width growth, density]
  const len = (TABLE.top - cy) * s.rays;
  for (const [sl, gw, dens] of rays)
    for (let j = 2; j < len; j++) {
      const y = cy + j;
      const xc = cx + sl * j;
      const hw = 2 + gw * j;
      for (let x = Math.floor(xc - hw); x <= Math.ceil(xc + hw); x++) {
        const edge = 1 - Math.abs(x + 0.5 - xc) / hw;
        if (edge <= 0) continue;
        const fade = 1 - (j / (TABLE.top - cy)) * 0.55;
        if (bayer(x, y) >= dens * edge * fade * 1.3) continue;
        const X = x - ox, Y = y - oy;
        if (skip && skip(X, Y)) continue;
        const c = b.get(X, Y);
        b.set(X, Y, RAY_LIFT.get(c) ?? stepColor(c, 1));
      }
    }
};

export const drawCathedral = (b: Buf, ox: number, oy: number, s: CathState) => {
  if (s.racks <= 0 && s.nave === null) return;
  if (s.nave !== null) {
    drawNave(b, ox, oy, s);
    // the opening's moulding: a lit inner lip, a dark reveal
    for (let y = NAVE.y0 - 24; y <= NAVE.y1; y++)
      for (let x = NAVE.x0 - 3; x <= NAVE.x1 + 3; x++) {
        if (inNaveArch(x, y)) continue;
        const n1 = inNaveArch(x + 1, y) || inNaveArch(x - 1, y) || inNaveArch(x, y + 1) || inNaveArch(x, y - 1);
        const n2 = !n1 && (inNaveArch(x + 2, y) || inNaveArch(x - 2, y) || inNaveArch(x, y + 2) || inNaveArch(x, y - 2));
        if (n1) b.set(x - ox, y - oy, stepColor(PAL.C3, s.nave));
        else if (n2) b.set(x - ox, y - oy, PAL.N0);
      }
  }
  for (const px of [BAY.x0, BAY.x1 - BAY.pw]) drawRackPilaster(b, px, ox, oy, s);
  if (s.votives > 0) { drawVotives(b, BAY.x0 - 16, ox, oy, s); drawVotives(b, BAY.x1 + 16, ox, oy, s); }
  if (s.rose) drawRose(b, ox, oy);
};
/** Rays go over the diners (drawn late), only inside the bay's air. `skip` keeps a figure out of the dither. */
export const drawCathRays = drawRays;

/**
 * The levitating ALYI under the rose window: lit in flat planes, never dithered. The rays skip him (see
 * drawCathRays `skip`); instead his top edges (dome, shoulders, knees) take a 1px cyan rim, and the planes that face
 * up (top 1/3 of his silhouette) lift one flat rung toward the machine light.
 */
export const alyiRim = (b: Buf, isAlyi: (x: number, y: number) => boolean, rays: number) => {
  if (rays <= 0) return;
  let y0 = 9999, y1 = -1;
  for (let y = 0; y < b.h; y++) for (let x = 0; x < b.w; x++) if (isAlyi(x, y)) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (y1 < 0) return;
  const src = b.c.slice();
  const lift = (c: number) => RAY_LIFT.get(c) ?? stepColor(c, 1);
  for (let y = y0; y <= y1; y++)
    for (let x = 0; x < b.w; x++) {
      if (!isAlyi(x, y)) continue;
      const c = src[y * b.w + x];
      if (c === PAL.N0) continue; // keep his outline
      const up1 = !isAlyi(x, y - 1), up2 = !up1 && !isAlyi(x, y - 2);
      if (up1) b.set(x, y, rays >= 1 ? PAL.C6 : PAL.C4);
      else if (up2 && rays >= 1) b.set(x, y, lift(lift(c)));
      else if (y < y0 + (y1 - y0) * 0.34) b.set(x, y, lift(c));
    }
};
