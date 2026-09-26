// MR. MAS — range/p3: ONE layout for both worlds. The pixel [W] (side view) and the model's 3D render are built from
// the same metres, so the first 3D frame lifts the real pixel frame into depth pixel-for-pixel, and the last one
// lands back on it. Pure math (no three.js), so the Node previews and the plate can use it too.
//   x along the table (Mas's head end at x = 0, the monitor's end at x = TABLE.x1), y up, z across the table
//   (-z = the WOODROSE back wall behind the side view's diners, +z = where the side-view camera stands).
export type V3 = [number, number, number];
export type Who = 'mario' | 'gerg' | 'nole' | 'alyi';

export const TABLE = {x0: 0, x1: 3.3, z0: -0.5, z1: 0.5, top: 0.75, hem: 0.45, drape: 0.02} as const;
export const WALL_Z = -1.6; // the WOODROSE back wall (the side view's wall art)
export const END_X = 4.35; // the far end wall (the reflective window lives here)
export const RIGHT_Z = 1.6; // the near-side wall (never seen in the side view)

/** Mas's eye in his chair at the head (the POV camera) */
export const MAS_EYE: V3 = [-0.36, 1.19, 0];
/** Mas's own glass (pixel) at his place, foreground right */
export const MAS_GLASS: V3 = [0.5, TABLE.top, 0.22];
/** the monitor at the far end, facing Mas (the model) */
export const MONITOR = {c: [3.47, 1.08, -0.47] as V3, w: 0.5, h: 0.31};

/** The 2015 seats (the model's reconstruction): near pair = portrait drawings, far pair = the medium tier */
/** x, z = the chair; pz = the body's plane (they sit in close, chests near the cloth's edge); eye = eye height */
export interface Seat { who: Who; x: number; z: number; pz: number; eye: number; near: boolean; rim: number; }
export const SEATS: Seat[] = [
  {who: 'mario', x: 0.95, z: -0.8, pz: -0.62, eye: 1.16, near: true, rim: 0x1f3a93},
  {who: 'nole', x: 0.95, z: 0.8, pz: 0.62, eye: 1.17, near: true, rim: 0xe0301e},
  {who: 'gerg', x: 2.45, z: -0.82, pz: -0.64, eye: 1.15, near: false, rim: 0x39ff88},
  {who: 'alyi', x: 2.45, z: 0.82, pz: 0.64, eye: 1.16, near: false, rim: 0xff6a1a},
];
/** The far guests' forearms on the cloth (the pair that were busts): the arm on the camera's side of each body, clear
 *  of the cutlery; e = the elbow (just past the cloth's edge, over the lap), w = the wrist, h = the fingertips */
export const ARMS: Array<{who: Who; e: V3; w: V3; h: V3}> = SEATS.filter((s) => !s.near).map((s) => {
  const sg = Math.sign(s.z), x = s.x - 0.25;
  return {who: s.who, e: [x - 0.03, TABLE.top + 0.05, sg * (TABLE.z1 + 0.04)] as V3, w: [x + 0.02, TABLE.top + 0.036, sg * (TABLE.z1 - 0.1)] as V3, h: [x + 0.06, TABLE.top + 0.016, sg * (TABLE.z1 - 0.17)] as V3};
});
/** LED candles on the centre line (true point lights once they resolve) */
export const CANDLES: V3[] = [[1.32, TABLE.top, -0.04], [2.66, TABLE.top, 0.05]];
export const CANDLE_H = 0.16;
/** wall sconces behind the guests (the WOODROSE's): the light that throws each guest's silhouette onto the cloth in
 *  front of them (a table-top flame is lower than a head: it can never put a person's shadow on the table) */
export const SCONCES: Array<{p: V3; aim: V3; who: Who}> = [
  {p: [0.95, 2.4, WALL_Z + 0.06], aim: [0.95, TABLE.top, -0.2], who: 'mario'},
  {p: [2.45, 2.4, WALL_Z + 0.06], aim: [2.45, TABLE.top, -0.2], who: 'gerg'},
  {p: [0.95, 2.4, RIGHT_Z - 0.06], aim: [0.95, TABLE.top, 0.2], who: 'nole'},
  {p: [2.45, 2.4, RIGHT_Z - 0.06], aim: [2.45, TABLE.top, 0.2], who: 'alyi'},
]; // pillar height; the LED flame sits on top
/** place settings: plate centre (x, z) for each diner, Mas's included */
export const PLACES: Array<{x: number; z: number; who: Who | 'mas'}> = [
  {x: 0.32, z: 0, who: 'mas'},
  {x: 0.95, z: -0.3, who: 'mario'}, {x: 0.95, z: 0.3, who: 'nole'},
  {x: 2.45, z: -0.3, who: 'gerg'}, {x: 2.45, z: 0.3, who: 'alyi'},
];

/** the tall arched window on the end wall, square to the table: it faces the head (a mirror, for him) */
export const WINDOW = {c: [END_X - 0.01, 1.36, 0.06] as V3, w: 1.06, h: 2.1};

// ------------------------------------------------------------------ cameras
/** A camera: position, yaw (0 = looking -z, +90deg = looking +x), pitch, and an off-axis frustum as tangents. */
export interface Cam { pos: V3; yaw: number; pitch: number; tl: number; tr: number; tt: number; tb: number; }
export const NW = 480, NH = 270;
const DEG = Math.PI / 180;

/** The side view that the pixel [W] is drawn from: level (verticals stay parallel), lens-shifted down. */
export const SIDE_CAM: Cam = (() => {
  const d = 9, f = 785.8; // focal length in native px: 87.3 px per metre at the table's plane
  const rh = 64; // the horizon row
  return {pos: [1.55, 1.57, d], yaw: 0, pitch: 0, tl: -240 / f, tr: 240 / f, tt: rh / f, tb: (rh - NH) / f};
})();
/** The model's camera in Mas's chair, looking down the table at the monitor (vFOV 40deg, pitched down 10deg). */
export const POV_CAM: Cam = (() => {
  const t = Math.tan(20 * DEG);
  return {pos: MAS_EYE, yaw: 86 * DEG, pitch: -10.5 * DEG, tl: -t * (NW / NH), tr: t * (NW / NH), tt: t, tb: -t};
})();

export const camBasis = (c: Cam) => {
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const fwd: V3 = [sy * cp, sp, -cy * cp];
  const right: V3 = [cy, 0, sy];
  const up: V3 = [right[1] * fwd[2] - right[2] * fwd[1], right[2] * fwd[0] - right[0] * fwd[2], right[0] * fwd[1] - right[1] * fwd[0]];
  return {fwd, right, up};
};
/** world -> native screen (x right, y down, float px) and view depth; null behind the camera */
export const project = (c: Cam, p: V3): [number, number, number] | null => {
  const {fwd, right, up} = camBasis(c);
  const d: V3 = [p[0] - c.pos[0], p[1] - c.pos[1], p[2] - c.pos[2]];
  const z = d[0] * fwd[0] + d[1] * fwd[1] + d[2] * fwd[2];
  if (z <= 1e-4) return null;
  const x = (d[0] * right[0] + d[1] * right[1] + d[2] * right[2]) / z;
  const y = (d[0] * up[0] + d[1] * up[1] + d[2] * up[2]) / z;
  return [((x - c.tl) / (c.tr - c.tl)) * NW, ((c.tt - y) / (c.tt - c.tb)) * NH, z];
};
/** native screen (sx, sy) at view depth z -> world */
export const unprojectDepth = (c: Cam, sx: number, sy: number, z: number): V3 => {
  const {fwd, right, up} = camBasis(c);
  const x = c.tl + (sx / NW) * (c.tr - c.tl), y = c.tt - (sy / NH) * (c.tt - c.tb);
  return [c.pos[0] + (fwd[0] + right[0] * x + up[0] * y) * z, c.pos[1] + (fwd[1] + right[1] * x + up[1] * y) * z, c.pos[2] + (fwd[2] + right[2] * x + up[2] * y) * z];
};
/** the ray through a native pixel, intersected with the plane n.p = k (null if parallel / behind) */
export const unprojectPlane = (c: Cam, sx: number, sy: number, n: V3, k: number): V3 | null => {
  const a = unprojectDepth(c, sx, sy, 1);
  const dir: V3 = [a[0] - c.pos[0], a[1] - c.pos[1], a[2] - c.pos[2]];
  const den = dir[0] * n[0] + dir[1] * n[1] + dir[2] * n[2];
  if (Math.abs(den) < 1e-9) return null;
  const t = (k - (c.pos[0] * n[0] + c.pos[1] * n[1] + c.pos[2] * n[2])) / den;
  if (t <= 0) return null;
  return [c.pos[0] + dir[0] * t, c.pos[1] + dir[1] * t, c.pos[2] + dir[2] * t];
};

// ------------------------------------------------------------------ the camera through the clip
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const bez3 = (a: V3, b: V3, c: V3, d: V3, t: number): V3 => {
  const u = 1 - t;
  return [0, 1, 2].map((i) => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i]) as V3;
};
/** interpolate two cameras: the path swings round the head of the table, the frustum opens from the long lens */
export const glideCam = (t: number): Cam => {
  const a = SIDE_CAM, b = POV_CAM;
  // position: a crane-like arc out past the head end, then in behind his chair
  const pos = bez3(a.pos, [-1.6, 1.75, 6.2], [-2.4, 1.3, 0.9], b.pos, t);
  // orientation turns through the same beat (a little behind the path, like a heavy head on the dolly)
  const tr = Math.pow(t, 1.25);
  const yaw = lerp(a.yaw, b.yaw, tr), pitch = lerp(a.pitch, b.pitch, tr);
  // the frustum: interpolate the log of the tangents, so the long lens opens at an even rate
  const L = (x: number, y: number) => Math.sign(y || x) * Math.exp(lerp(Math.log(Math.abs(x)), Math.log(Math.abs(y)), t));
  return {pos, yaw, pitch, tl: L(a.tl, b.tl), tr: L(a.tr, b.tr), tt: lerp(a.tt, b.tt, t), tb: L(a.tb, b.tb)};
};
/** POV turned toward the window (pure rotation: the sprites never scale) — kept for the sketch tool */
export const TURN_YAW = 4.5 * DEG;
export const TURN_PITCH = 3 * DEG;
export const turnCam = (t: number): Cam => ({...POV_CAM, yaw: POV_CAM.yaw + TURN_YAW * t, pitch: POV_CAM.pitch + TURN_PITCH * t});

/** The window insert: a CUT from his chair to an 8x lens on the end wall. At 8x his reflection (9.4 m away, optically)
 *  is exactly the portrait's size, so the approved drawing is physically right; the monitor's screen fills the left
 *  of the frame (the model's picture of the table, his seat empty) and his face is in the dark glass beside it. */
export const WIN_ZOOM = 8;
export const WIN_CAM: Cam = (() => {
  const t = Math.tan(20 * DEG) / WIN_ZOOM;
  return {pos: MAS_EYE, yaw: 87.6 * DEG, pitch: 0.3 * DEG, tl: -t * (NW / NH), tr: t * (NW / NH), tt: t, tb: -t};
})();
/** the reflected eye (the mirror is the window plane, x = WINDOW.c[0]) */
export const REFL_EYE_W: V3 = [2 * WINDOW.c[0] - MAS_EYE[0], MAS_EYE[1], MAS_EYE[2]];

/** Leaving his chair: the lens widens back to the POV, then the glide in reverse to the side view (the [W]'s camera) */
const lerpLog = (x: number, y: number, t: number) => Math.sign(y || x) * Math.exp(lerp(Math.log(Math.abs(x)), Math.log(Math.abs(y)), t));
export const outCam = (t: number): Cam => {
  const k = 0.32;
  if (t < k) {
    const u = t / k, e = u * u * (3 - 2 * u), a = WIN_CAM, b = POV_CAM;
    return {pos: a.pos, yaw: lerp(a.yaw, b.yaw, e), pitch: lerp(a.pitch, b.pitch, e), tl: lerpLog(a.tl, b.tl, e), tr: lerpLog(a.tr, b.tr, e), tt: lerpLog(a.tt, b.tt, e), tb: lerpLog(a.tb, b.tb, e)};
  }
  const u = (t - k) / (1 - k);
  // ease in (it leaves the chair slowly), then the whole arc: the room is already points, so it can travel fast
  const e = u * u * u * (u * (u * 6 - 15) + 10);
  return glideCam(1 - e);
};

/** The monitor's own eye (for the glyph picture on its screen): at the screen, looking back up the table at his chair */
export const MON_CAM: Cam = (() => {
  const t = Math.tan(17 * DEG);
  return {pos: [MONITOR.c[0] - 0.05, MONITOR.c[1] + 0.02, MONITOR.c[2]], yaw: -106 * DEG, pitch: -6.5 * DEG, tl: -t * (MONITOR.w / MONITOR.h), tr: t * (MONITOR.w / MONITOR.h), tt: t, tb: -t};
})();
