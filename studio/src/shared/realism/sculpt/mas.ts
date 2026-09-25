// MAS maquette sculpt (builder key: realism). Head space in cm: x = character's left, y up, z forward,
// origin between the ear canals. Realistic adult proportions (head 22.8 cm, 7.5 heads tall);
// caricature only in: slightly large, calm eyes and the forward cowlick.
import {V, v, ellipsoid, sphere, capsule, taperCap, smin, smax, ssub, mirrorX} from './sdf';

const EYE_R = 1.28;
export const MAS_EYE = {c: v(3.2, 1.85, 7.72), r: EYE_R};

export function masSkin(p: V): number {
  const m = mirrorX(p);
  // cranium + forehead
  let d = ellipsoid(p, v(0, 3.6, -0.6), v(7.35, 8.8, 9.5));
  d = smin(d, ellipsoid(p, v(0, 4.4, 4.0), v(5.5, 5.6, 5.2)), 2.2);
  d = smax(d, Math.abs(p[0]) - 7.25, 1.2);
  // temple hollows
  d = ssub(d, sphere(m, v(6.7, 3.9, 4.6), 1.1), 1.4);
  // mid-face mass, cheekbones, zygomatic arch
  d = smin(d, ellipsoid(p, v(0, -1.4, 5.5), v(5.1, 4.3, 4.2)), 1.8);
  d = smin(d, ellipsoid(m, v(4.5, 0.7, 6.4), v(1.85, 1.2, 1.75)), 1.3);
  d = smin(d, capsule(m, v(5.5, 0.7, 5.0), v(6.6, 0.3, 1.3), 0.75), 1.1);
  // cheek fill (buccal + masseter), slim
  d = smin(d, ellipsoid(m, v(3.6, -3.7, 4.7), v(2.35, 2.9, 3.0)), 1.6);
  // jaw: ramus + body of mandible + chin
  d = smin(d, capsule(m, v(4.95, -0.9, -0.4), v(4.45, -6.0, 0.7), 1.1), 1.2);
  d = smin(d, capsule(m, v(4.45, -6.0, 0.7), v(1.9, -9.3, 7.2), 1.25), 1.2);
  d = smin(d, ellipsoid(p, v(0, -9.05, 8.45), v(2.1, 1.45, 1.35)), 1.0);
  // muzzle
  d = smin(d, ellipsoid(p, v(0, -5.3, 7.55), v(3.0, 2.55, 2.55)), 1.4);
  // brow ridge
  d = smin(d, capsule(m, v(0, 3.15, 9.05), v(1.6, 3.15, 8.95), 0.55), 0.9);
  d = smin(d, capsule(m, v(1.6, 3.15, 8.95), v(4.6, 2.95, 7.25), 0.58), 0.9);
  // eye sockets, then eyeballs + lids
  d = ssub(d, ellipsoid(m, v(3.2, 1.9, 8.85), v(1.85, 1.3, 1.45)), 0.8);
  d = smin(d, sphere(m, MAS_EYE.c, EYE_R), 0.25);
  d = smin(d, ellipsoid(m, v(3.2, 2.4, 7.95), v(1.6, 0.55, 1.22)), 0.35);
  d = smin(d, ellipsoid(m, v(3.2, 1.1, 8.08), v(1.38, 0.38, 1.0)), 0.3);
  // nose: bridge, tip, alae, nostrils
  d = smin(d, taperCap(p, v(0, 2.45, 9.05), v(0, -2.35, 11.15), 0.48, 0.72), 0.85);
  d = smin(d, sphere(p, v(0, -2.85, 11.2), 0.86), 0.5);
  d = smin(d, ellipsoid(m, v(1.38, -3.3, 9.95), v(0.72, 0.62, 0.82)), 0.4);
  d = ssub(d, ellipsoid(m, v(0.66, -3.72, 10.55), v(0.36, 0.19, 0.48)), 0.14);
  // lips
  d = smin(d, ellipsoid(p, v(0, -5.45, 10.02), v(2.05, 0.55, 0.7)), 0.35);
  d = smin(d, ellipsoid(p, v(0, -6.52, 9.78), v(1.78, 0.64, 0.74)), 0.35);
  d = ssub(d, ellipsoid(p, v(0, -5.95, 10.3), v(2.3, 0.075, 1.15)), 0.1);
  d = ssub(d, sphere(m, v(2.2, -5.98, 9.05), 0.24), 0.3);
  // philtrum, nasolabial, mentolabial
  d = ssub(d, capsule(p, v(0, -4.05, 10.2), v(0, -4.95, 10.5), 0.15), 0.14);
  d = ssub(d, capsule(m, v(1.75, -3.65, 9.45), v(2.6, -6.2, 8.65), 0.16), 0.5);
  d = ssub(d, capsule(p, v(-1.35, -7.55, 9.45), v(1.35, -7.55, 9.45), 0.28), 0.5);
  // ears (tilted back ~14°)
  {
    const q: V = [m[0] - 7.15, p[1] + 0.2, p[2] + 0.9];
    const c = Math.cos(0.245), s = Math.sin(0.245);
    const qy = q[1] * c - q[2] * s, qz = q[1] * s + q[2] * c;
    let e = ellipsoid([q[0], qy, qz], v(0, 0, 0), v(0.78, 3.05, 1.7));
    e = ssub(e, ellipsoid([q[0], qy, qz], v(0.62, -0.35, 0.25), v(0.5, 1.05, 0.72)), 0.25);
    e = ssub(e, ellipsoid([q[0], qy, qz], v(0.72, 1.25, -0.1), v(0.35, 1.1, 0.9)), 0.2);
    d = smin(d, e, 0.55);
  }
  // neck + sternocleidomastoids + a little larynx
  let n = taperCap(p, v(0, -2.8, -1.6), v(0, -21, -0.2), 4.85, 5.25);
  n = smin(n, capsule(m, v(4.7, -2.4, -2.2), v(1.0, -15.5, 3.7), 0.95), 1.2);
  n = smin(n, ellipsoid(p, v(0, -11.3, 4.0), v(0.55, 0.8, 0.45)), 0.8);
  d = smin(d, n, 1.0);
  return d;
}

/** Hair shell + forward push + cowlick. */
export function masHair(p: V): number {
  const th = (Math.atan2(p[0], p[2]) * 180) / Math.PI; // 0 front, ±90 sides, ±180 back
  const a = Math.abs(th);
  // hairline height by angle (slight temple recession)
  const hl =
    a < 22 ? 8.9 - (a / 22) * 0.4 :
    a < 55 ? 8.5 - ((a - 22) / 33) * 1.6 :
    a < 100 ? 6.9 - ((a - 55) / 45) * 3.3 :
    a < 150 ? 3.6 - ((a - 100) / 50) * 6.6 : -3.0;
  let d = ellipsoid(p, v(0, 3.85, -0.7), v(7.85, 9.55, 10.15));
  // pushed-forward top volume
  d = smin(d, ellipsoid(p, v(0.3, 9.3, 5.6), v(4.4, 2.1, 3.2)), 1.0);
  d = smax(d, hl - p[1], 0.55);
  // clump ridges radiating from the crown, flowing forward
  const cr = Math.atan2(p[0], p[2] + 3.5);
  const ridge = Math.sin(cr * 21 + p[1] * 0.6) * 0.13 + Math.sin(cr * 47 + p[2] * 1.3) * 0.05;
  d += ridge;
  // sideburns
  const m = mirrorX(p);
  d = smin(d, capsule(m, v(6.95, 3.4, 2.0), v(6.95, 0.9, 2.25), 0.36), 0.4);
  // cowlick: three locks lifting off the front hairline and flipping forward
  const lock = (x0: number, s: number) =>
    Math.min(
      taperCap(p, v(x0, 9.9, 6.6), v(x0 - 0.5 * s, 11.2, 8.5), 0.85 * s, 0.6 * s),
      taperCap(p, v(x0 - 0.5 * s, 11.2, 8.5), v(x0 - 0.8 * s, 11.35, 9.9), 0.6 * s, 0.4 * s),
      taperCap(p, v(x0 - 0.8 * s, 11.35, 9.9), v(x0 - 1.0 * s, 10.75, 10.75), 0.4 * s, 0.2 * s),
    );
  d = smin(d, lock(-0.5, 1), 0.5);
  d = smin(d, lock(1.0, 0.8), 0.45);
  d = smin(d, lock(-2.1, 0.75), 0.45);
  return d;
}

/** Landmarks (head space, cm) the rig paints over: eyes, lid lines, brows, mouth. Mirrored for the far side. */
export const MAS_LM = {
  eyeC: v(3.2, 1.85, 7.72),
  irisR: 0.62,
  // lid line samples as (angle around the eye, from inner corner) — generated in the rig
  brow: [v(1.1, 3.35, 9.15), v(2.2, 3.6, 8.95), v(3.4, 3.7, 8.55), v(4.5, 3.45, 7.75), v(5.2, 3.05, 6.9)],
  mouth: [v(-2.2, -5.98, 9.1), v(-1.2, -5.93, 9.95), v(0, -5.92, 10.3), v(1.2, -5.93, 9.95), v(2.2, -5.98, 9.1)],
};
