// MR. MAS — mcoldopen: THE ORB. A chrome eyeball with the gravity of a priest.
// A polished sphere whose chrome only shows the room it floats in (dark ceiling, the monitor's cyan slab on
// the side facing the desk, the cold window on its back rim), with a black glass face holding a mechanical
// iris: six aperture blades, a lens, one glint. The face can point anywhere on the sphere; foreshortening
// comes from the sphere itself, so the iris swivel is a whole-pixel redraw, never a rotated sprite.
import {Buf, bayer} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';

export interface OrbState {
  /** where the face points: x -1 (screen-left) .. 1, y -1 (up) .. 1. [0, 0] = into the lens */
  look: [number, number];
  /** 0 closed .. 1 wide open */
  aperture: number;
  /** the lens is firing (scan) */
  scanning?: boolean;
  /** side the monitor is on (its reflection + the cyan key) */
  monitor?: -1 | 1;
}


const norm = (v: [number, number, number]): [number, number, number] => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

/**
 * Draw the Orb centred at (cx, cy) (pixel centre = cx + 0.5) with radius r. Returns the coverage rect.
 * r >= 11 gets the full iris (blades + lens ring); smaller orbs get a simplified face.
 */
export const drawOrb = (b: Buf, cx: number, cy: number, r: number, s: OrbState, mask?: Uint8Array) => {
  const mon = s.monitor ?? -1;
  const yaw = s.look[0] * 0.95, pitch = s.look[1] * 0.8;
  const D = norm([Math.sin(yaw), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch)]);
  const alpha = r >= 11 ? 0.74 : 0.8; // angular radius of the black face (rad)
  const cosA = Math.cos(alpha);
  const big = r >= 11;
  const ap = Math.max(0, Math.min(1, s.aperture));
  const R = r;
  for (let j = -R - 1; j <= R + 1; j++)
    for (let i = -R - 1; i <= R + 1; i++) {
      const nx = (i + 0.5) / R, ny = (j + 0.5) / R;
      const d2 = nx * nx + ny * ny;
      if (d2 > 1) continue;
      const nz = Math.sqrt(1 - d2);
      const px = cx + i, py = cy + j;
      const bz = bayer(px, py) - 0.5;
      const dd = nx * D[0] + ny * D[1] + nz * D[2];
      let col: number;
      if (dd > cosA) {
        // ---- the face: metal lip, black glass, blades, lens
        const th = Math.acos(Math.min(1, dd)) / alpha; // 0 centre .. 1 edge
        // local 2D coords on the face (for the blade pattern)
        const ux = nx - D[0] * dd, uy = ny - D[1] * dd;
        const ang = Math.atan2(uy, ux);
        const open = 0.2 + 0.26 * ap;
        if (th > 0.87) col = nx * mon > 0.15 ? PAL.G4 : ny < -0.3 ? PAL.G3 : PAL.G1; // the lip catches the monitor
        else if (th > 0.64 || !big && th > 0.5) {
          // black glass with one curved reflection of the monitor on its desk-facing side
          const refl = nx * mon > 0.25 && ny < 0.25 && th > 0.7 && th < 0.8;
          col = refl ? PAL.C2 : PAL.N0;
        } else if (th > open) {
          // aperture blades: six overlapping leaves, each edge a lighter line
          const seg = ((ang + Math.PI) / (Math.PI * 2)) * 6 + th * 2.2;
          const edge = seg - Math.floor(seg) < (big ? 0.14 : 0.0);
          col = edge ? PAL.G2 : big ? PAL.G0 : PAL.N1;
          if (s.scanning && th < open + 0.08) col = PAL.C3;
        } else {
          // the lens
          const t = th / open;
          col = s.scanning ? (t < 0.45 ? PAL.C9 : t < 0.8 ? PAL.C8 : PAL.C6) : t < 0.35 ? PAL.C6 : t < 0.7 ? PAL.C4 : PAL.C2;
        }
        // one glint, up and toward the monitor
        const gx = D[0] + mon * 0.12 / (big ? 1.3 : 1), gy = D[1] - 0.16;
        if (Math.hypot(nx - gx, ny - gy) < (big ? 0.075 : 0.11)) col = PAL.C9;
      } else {
        // ---- chrome: what the sphere reflects, in clean bands (dither only on the seams)
        const rx = 2 * nz * nx, ry = 2 * nz * ny + 0.1, rz = 2 * nz * nz - 1;
        const edge = 1 - nz;
        const side = nx * mon; // + toward the monitor
        const seam = bz * 0.06;
        if (side > 0.1 && rx * mon > 0.34 + seam && Math.abs(ry + 0.02) < 0.34 + seam && rz > -0.6) {
          // the monitor: a cyan slab curving round the desk-facing side, hottest in its middle
          const k = Math.min(1, (rx * mon - 0.34) / 0.4) * (1 - Math.abs(ry + 0.02) / 0.34);
          col = k > 0.42 + seam ? PAL.C7 : k > 0.12 ? PAL.C5 : PAL.C3;
        } else if (ry < -0.55 + seam) col = PAL.N1; // straight up: the dark ceiling
        else if (ry < -0.2 + seam) col = rx * mon > 0.05 ? PAL.G1 : PAL.G0;
        else if (ry < -0.07 + seam) col = rx * mon > -0.2 ? PAL.G4 : PAL.G3; // the horizon: chrome's bright line
        else if (ry < 0.3 + seam) col = PAL.G0; // the dark front of the desk
        else col = rx * mon > 0.12 + seam ? PAL.C1 : ry > 0.7 ? PAL.G2 : PAL.G1; // the desk top, monitor-lit toward it
        // Fresnel rim: the window rims the far side cold, the rest of the edge a quiet keyline
        if (edge > 0.8) col = side < -0.25 && ny < 0.55 ? (edge > 0.9 ? PAL.N7 : PAL.N5) : edge > 0.9 && ny > 0.3 ? PAL.N0 : col;
        // hard specular: the monitor's centre kicks one hot cluster
        if (big && Math.hypot(nx - mon * 0.56, ny + 0.2) < 0.075) col = PAL.C9;
        else if (!big && r >= 6 && Math.hypot(nx - mon * 0.55, ny + 0.2) < 0.12) col = PAL.C8;
      }
      b.set(px, py, col);
      if (mask && px >= 0 && py >= 0 && px < b.w && py < b.h) mask[py * b.w + px] = 255;
    }
  // the silhouette's bottom edge is the darkest thing in the frame (it floats: no contact shadow)
  return [cx - R, cy - R, 2 * R + 1, 2 * R + 1] as const;
};

/** The iris position over the span: toward the monitor, then (f97 in-between, f98) into the lens. */
export const orbLookAt = (f: number, turn: number): [number, number] =>
  f < turn ? [-0.62, 0.12] : f === turn ? [-0.3, 0.05] : [0, 0];

/** 1px float bob on a slow hold cycle (whole pixels, never drifting). */
export const orbBob = (f: number) => [0, 0, -1, -1, -1, 0, 0, 1][Math.floor(f / 6) % 8] ?? 0;
