// MR. MAS — cast: THE ORB at MEDIUM / TWO-SHOT scale (Ep1 act 4 draft 3.1; new file, owned by the act-4 medium-tier
// artist). pov-and-framing §4.1: "The Orb at this scale is a sphere and an iris."
// The drawing is the APPROVED cold-open Orb (studio/src/shared/pixel/cast/orb.ts drawOrb: a chrome sphere that reflects only
// the room it floats in, a black glass face, six aperture blades, a lens, one glint), PORTED here unchanged so episodes
// don't import a dev folder (the original is not edited). The face can point anywhere; foreshortening comes from the
// sphere, so every iris step is a whole-pixel redraw, never a rotated sprite.
// Added for the medium tier:
//   ORB_MR                 the medium radius (12: the full iris with blades; his medium head is 26 px wide)
//   orbLook(o, target)     the look vector from the Orb's centre to a frame point (the tally marks, his thumb, the
//                          GUEST lanyard, his face, the phone, a name on the monitor)
//   orbStep(f, t0, looks)  the iris STEPPING between targets, one per beat (15 f), held; never a sweep
//   orbBob(f)              the 1 px float on a slow hold cycle
// Rules it keeps (pov-and-framing §1.2, §4.3): it reacts to OBJECTS and FACES, never to narration; it's already on the
// lanyard before "the badge was a joke."; the only thing that ever touches tally marks 1 and 2 is its look.
import {Buf, bayer} from '../px';
import {PAL} from '../palette';
import {lookAt} from './medium-kit';

export interface OrbState {
  /** where the face points: x -1 (screen-left) .. 1, y -1 (up) .. 1. [0, 0] = into the lens */
  look: [number, number];
  /** 0 closed .. 1 wide open */
  aperture: number;
  /** the lens is firing (scan) */
  scanning?: boolean;
  /** side the monitor is on (its reflection + the cyan key): -1 camera-left (the dark room) */
  monitor?: -1 | 1;
}

/** the medium radius: at r >= 11 the face gets its blades and lens ring */
export const ORB_MR = 12;

const norm = (v: [number, number, number]): [number, number, number] => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

/**
 * Draw the Orb centred at (cx, cy) (pixel centre = cx + 0.5) with radius r. Returns the coverage rect.
 * r >= 11 gets the full iris (blades + lens ring); smaller orbs get a simplified face. (Port of mcoldopen drawOrb.)
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
        const th = Math.acos(Math.min(1, dd)) / alpha; // 0 centre .. 1 edge
        const ux = nx - D[0] * dd, uy = ny - D[1] * dd;
        const ang = Math.atan2(uy, ux);
        const open = 0.2 + 0.26 * ap;
        if (th > 0.87) col = nx * mon > 0.15 ? PAL.G4 : ny < -0.3 ? PAL.G3 : PAL.G1;
        else if (th > 0.64 || !big && th > 0.5) {
          const refl = nx * mon > 0.25 && ny < 0.25 && th > 0.7 && th < 0.8;
          col = refl ? PAL.C2 : PAL.N0;
        } else if (th > open) {
          const seg = ((ang + Math.PI) / (Math.PI * 2)) * 6 + th * 2.2;
          const edge = seg - Math.floor(seg) < (big ? 0.14 : 0.0);
          col = edge ? PAL.G2 : big ? PAL.G0 : PAL.N1;
          if (s.scanning && th < open + 0.08) col = PAL.C3;
        } else {
          const t = th / open;
          col = s.scanning ? (t < 0.45 ? PAL.C9 : t < 0.8 ? PAL.C8 : PAL.C6) : t < 0.35 ? PAL.C6 : t < 0.7 ? PAL.C4 : PAL.C2;
        }
        const gx = D[0] + mon * 0.12 / (big ? 1.3 : 1), gy = D[1] - 0.16;
        if (Math.hypot(nx - gx, ny - gy) < (big ? 0.075 : 0.11)) col = PAL.C9;
      } else {
        const rx = 2 * nz * nx, ry = 2 * nz * ny + 0.1, rz = 2 * nz * nz - 1;
        const edge = 1 - nz;
        const side = nx * mon;
        const seam = bz * 0.06;
        if (side > 0.1 && rx * mon > 0.34 + seam && Math.abs(ry + 0.02) < 0.34 + seam && rz > -0.6) {
          const k = Math.min(1, (rx * mon - 0.34) / 0.4) * (1 - Math.abs(ry + 0.02) / 0.34);
          col = k > 0.42 + seam ? PAL.C7 : k > 0.12 ? PAL.C5 : PAL.C3;
        } else if (ry < -0.55 + seam) col = PAL.N1;
        else if (ry < -0.2 + seam) col = rx * mon > 0.05 ? PAL.G1 : PAL.G0;
        else if (ry < -0.07 + seam) col = rx * mon > -0.2 ? PAL.G4 : PAL.G3;
        else if (ry < 0.3 + seam) col = PAL.G0;
        else col = rx * mon > 0.12 + seam ? PAL.C1 : ry > 0.7 ? PAL.G2 : PAL.G1;
        if (edge > 0.8) col = side < -0.25 && ny < 0.55 ? (edge > 0.9 ? PAL.N7 : PAL.N5) : edge > 0.9 && ny > 0.3 ? PAL.N0 : col;
        if (big && Math.hypot(nx - mon * 0.56, ny + 0.2) < 0.075) col = PAL.C9;
        else if (!big && r >= 6 && Math.hypot(nx - mon * 0.55, ny + 0.2) < 0.12) col = PAL.C8;
      }
      b.set(px, py, col);
      if (mask && px >= 0 && py >= 0 && px < b.w && py < b.h) mask[py * b.w + px] = 255;
    }
  return [cx - R, cy - R, 2 * R + 1, 2 * R + 1] as const;
};

/** 1px float bob on a slow hold cycle (whole pixels, never drifting). `still` = the MAS'S VERSION stillness flag. */
export const orbBob = (f: number, still = false) => (still ? 0 : [0, 0, -1, -1, -1, 0, 0, 1][Math.floor(f / 6) % 8] ?? 0);

/**
 * The look from the Orb at (ox, oy) to a frame point. `depth` is how far the target sits in front of the Orb's plane
 * (things on the desk below it are closer to the lens than the Orb: a smaller depth makes the look steeper).
 */
export const orbLook = (ox: number, oy: number, tx: number, ty: number, depth = 36): [number, number] => lookAt(ox, oy, tx, ty, depth);

/**
 * The iris stepping along a list of looks, one per `beat` frames from t0, holding the last: 1 -> 2 -> 3 -> the thumb.
 * Every change is a cut between two drawings (with one in-between frame at half the angle, like the intro's servo).
 */
export const orbStep = (f: number, t0: number, looks: Array<[number, number]>, beat = 15): [number, number] => {
  if (!looks.length) return [0, 0];
  if (f < t0) return looks[0];
  const k = Math.min(looks.length - 1, Math.floor((f - t0) / beat));
  const inb = (f - t0) % beat === 0 && k > 0 ? looks[k - 1] : null;
  const L = looks[k];
  return inb ? [(inb[0] + L[0]) / 2, (inb[1] + L[1]) / 2] : L;
};
