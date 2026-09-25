// Realism kit — tiny SDF library for the maquette sculpts (builder key: realism).
// Pure TS, no DOM: used by the offline bake (Node) and by the rig to project 3D landmarks into each drawn angle.
export type V = [number, number, number];

export const v = (x: number, y: number, z: number): V => [x, y, z];
export const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: V, s: number): V => [a[0] * s, a[1] * s, a[2] * s];
export const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const len = (a: V) => Math.hypot(a[0], a[1], a[2]);
export const nz = (a: V): V => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
export const mirrorX = (p: V): V => [Math.abs(p[0]), p[1], p[2]];

export const sphere = (p: V, c: V, r: number) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) - r;
export const ellipsoid = (p: V, c: V, r: V) => {
  const qx = (p[0] - c[0]) / r[0], qy = (p[1] - c[1]) / r[1], qz = (p[2] - c[2]) / r[2];
  const k0 = Math.hypot(qx, qy, qz);
  const k1 = Math.hypot(qx / r[0], qy / r[1], qz / r[2]);
  return k1 === 0 ? -Math.min(r[0], r[1], r[2]) : (k0 * (k0 - 1)) / k1;
};
export const capsule = (p: V, a: V, b: V, r: number) => {
  const pa = sub(p, a), ba = sub(b, a);
  const h = Math.max(0, Math.min(1, dot(pa, ba) / dot(ba, ba)));
  return len(sub(pa, mul(ba, h))) - r;
};
/** Capsule with radius varying linearly from ra (at a) to rb (at b). Cheap approximation (fine for small taper). */
export const taperCap = (p: V, a: V, b: V, ra: number, rb: number) => {
  const pa = sub(p, a), ba = sub(b, a);
  const h = Math.max(0, Math.min(1, dot(pa, ba) / dot(ba, ba)));
  return len(sub(pa, mul(ba, h))) - (ra + (rb - ra) * h);
};
export const box = (p: V, c: V, b: V, r = 0) => {
  const qx = Math.abs(p[0] - c[0]) - b[0], qy = Math.abs(p[1] - c[1]) - b[1], qz = Math.abs(p[2] - c[2]) - b[2];
  const ox = Math.max(qx, 0), oy = Math.max(qy, 0), oz = Math.max(qz, 0);
  return Math.hypot(ox, oy, oz) + Math.min(Math.max(qx, Math.max(qy, qz)), 0) - r;
};
/** Polynomial smooth min. */
export const smin = (a: number, b: number, k: number) => {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
export const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);
/** Smooth subtraction: a minus b. */
export const ssub = (a: number, b: number, k: number) => smax(a, -b, k);

/** Rotate about X (pitch), Y (yaw), Z (roll); degrees. Applied yaw, then pitch, then roll. */
export function rotYPR(p: V, yaw: number, pitch: number, roll: number): V {
  const cy = Math.cos((yaw * Math.PI) / 180), sy = Math.sin((yaw * Math.PI) / 180);
  const cp = Math.cos((pitch * Math.PI) / 180), sp = Math.sin((pitch * Math.PI) / 180);
  const cr = Math.cos((roll * Math.PI) / 180), sr = Math.sin((roll * Math.PI) / 180);
  // yaw about Y: forward (0,0,1) -> (-sin, 0, cos) for positive yaw means face turns to screen-left
  let x = p[0] * cy - p[2] * sy;
  let z = p[0] * sy + p[2] * cy;
  let y = p[1];
  // pitch about X: positive = face tilts down (chin toward chest)
  const y2 = y * cp - z * sp;
  const z2 = y * sp + z * cp;
  y = y2;
  z = z2;
  // roll about Z: positive = head tilts toward screen-right (clockwise on screen)
  const x3 = x * cr + y * sr;
  const y3 = -x * sr + y * cr;
  return [x3, y3, z];
}
/** Inverse of rotYPR. */
export function unrotYPR(p: V, yaw: number, pitch: number, roll: number): V {
  const cy = Math.cos((yaw * Math.PI) / 180), sy = Math.sin((yaw * Math.PI) / 180);
  const cp = Math.cos((pitch * Math.PI) / 180), sp = Math.sin((pitch * Math.PI) / 180);
  const cr = Math.cos((roll * Math.PI) / 180), sr = Math.sin((roll * Math.PI) / 180);
  let x = p[0] * cr - p[1] * sr;
  let y = p[0] * sr + p[1] * cr;
  let z = p[2];
  const y2 = y * cp + z * sp;
  const z2 = -y * sp + z * cp;
  y = y2;
  z = z2;
  const x3 = x * cy + z * sy;
  const z3 = -x * sy + z * cy;
  return [x3, y, z3];
}

export interface View {
  yaw: number;
  pitch: number;
  roll: number;
}
/** Units: sculpt is in cm; the rig draws at 20 SVG units per cm, y down. */
export const U = 20;
/** Project a head-space point (cm) to SVG rig units for a view. */
export const project = (p: V, view: View): [number, number] => {
  const c = rotYPR(p, view.yaw, view.pitch, view.roll);
  return [c[0] * U, -c[1] * U];
};
/** Camera-space depth (toward camera) of a head-space point. */
export const depthOf = (p: V, view: View) => rotYPR(p, view.yaw, view.pitch, view.roll)[2];
