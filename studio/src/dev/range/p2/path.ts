// MR. MAS — Prototype 2 · THE CLIFF · the frame chain and the camera path (pure math; runs in Node and the browser).
// One continuous world, nested:  ROOM (the dark room, metres, staging camera at the origin)
//   -> TUN   the nest, behind the portal in his screen (card units of V3)
//   -> SURF  the loss plot, behind V9's photo window (cells: 1/4 of a virtual-screen px)
//   -> ROOM2 the dark room again, at the foot of the wall (metres), its staging camera where the fall ends
// The camera is keyframed per segment in that segment's own coordinates, then composed to world in float64.
// Motion: the reveal is a heavy dolly (accelerates, settles, never overshoots); the push swings round his card and
// brakes onto V3; the nest is flown on ln(lambda) (a read, a rush of generations, a hard brake onto V9, a creep, the
// dive); the plot: a swoop onto the line, the ride, the lip, and the fall, which only gains speed and ends dead on
// the room's own staging camera (the last 3D frame is the pixel frame).
// three ships no types here (no @types/three is installed): typed at this module's boundary.
// @ts-ignore
import {Matrix4, Vector3, Quaternion} from 'three';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Matrix4 = any; type Vector3 = any;
import {CAM, DEPTH, T} from './params';
import {portalRect, CARD} from './pixel';
import {SCREEN_N, screenPoint, V3} from './extrude';
import {nestGeometry, TUNNEL, PW, LIP, X_OUT, lineTop, VX, VY} from './worlds';

const v = (a: V3) => new Vector3(a[0], a[1], a[2]);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const smooth = (a: number, b: number, t: number) => { const x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); };
const deg = Math.PI / 180;

/** monotone cubic (Fritsch-Carlson) through keys [(x, y)]; optional end slopes */
const monotone = (keys: Array<[number, number]>, m0?: number, mN?: number) => {
  const n = keys.length, xs = keys.map((k) => k[0]), ys = keys.map((k) => k[1]);
  const d: number[] = [], m: number[] = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (3 * (xs[i + 1] - xs[i - 1])) / ((2 * xs[i + 1] - xs[i] - xs[i - 1]) / d[i - 1] + (xs[i + 1] - 2 * xs[i] + xs[i - 1]) / d[i]);
  m[0] = m0 ?? d[0]; m[n - 1] = mN ?? d[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i];
    const h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0] + m[0] * (x - xs[0]);
    if (x >= xs[n - 1]) return ys[n - 1] + m[n - 1] * (x - xs[n - 1]);
    let i = 0;
    while (x > xs[i + 1]) i++;
    const hh = xs[i + 1] - xs[i], t = (x - xs[i]) / hh, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * hh * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * hh * m[i + 1];
  };
};

export type Seg = 'ROOM' | 'TUN' | 'SURF' | 'ROOM2';
export interface Shot {
  seg: Seg;
  /** camera position / forward / up in the segment's own coordinates */
  pos: Vector3; fwd: Vector3; up: Vector3;
  /** principal point row (16 = the staging lens shift, 135 = centred) */
  cy: number;
  /** ROOM2's depth (1 full .. 0 flat) */
  collapse2: number;
  /** the portal in his screen is open */
  portal: boolean;
  /** the plate's vignette (screen space, native grid) on ROOM / ROOM2 */
  vig1: boolean; vig2: boolean;
  /** the key's shadows: they dissolve in with the depth (0..1) */
  shadow1: number; shadow2: number;
  /** which segments to draw */
  draw: Seg[];
}

// ------------------------------------------------------------------ the frame chain (local -> parent matrices)
const basis = (x: Vector3, y: Vector3, z: Vector3, t: Vector3, s: number) => {
  const m = new Matrix4().makeBasis(x, y, z);
  m.scale(new Vector3(s, s, s));
  m.setPosition(t);
  return m;
};
const P = portalRect();
const TL = v(screenPoint(P.x, P.y)), TR = v(screenPoint(P.x + P.w, P.y));
/** metres per card unit of V3: it fills the portal exactly */
export const S_T = TL.distanceTo(TR) / CARD.w;
const XT = v([1, 0, 0]), YT = new Vector3(0, 1, 0), ZT = v(SCREEN_N);
{
  // x along the screen's rows as drawn (screenPoint's own u direction), y up, z out of the screen
  const TR2 = v(screenPoint(P.x + P.w, P.y)), TLv = v(screenPoint(P.x, P.y));
  XT.copy(TR2.sub(TLv)).normalize();
}
YT.sub(ZT.clone().multiplyScalar(YT.dot(ZT))).normalize();
XT.crossVectors(YT, ZT).normalize();
/** TUN in ROOM: origin at V3's top-left front corner, a hair behind the screen plane */
export const M_TUN = basis(XT, YT, ZT, TL.clone().add(v(SCREEN_N).multiplyScalar(-0.0012)), S_T);

const G = nestGeometry();
const W0 = v(G.photoCentre(0)), F = v(G.F);
/** the Droste axis in TUN: from F out through every photo window */
export const AXIS = W0.clone().sub(F);
export const AXIS_LEN = AXIS.length();
const AXIS_DIR = AXIS.clone().normalize();
/** the camera on the axis: lambda = 1 at V3's photo window, rho^k at the k-th */
export const onAxis = (lambda: number) => F.clone().add(AXIS.clone().multiplyScalar(lambda));
const LR = Math.log(TUNNEL.rho);
const LAST = TUNNEL.count - 1;

// ------------------------------------------------------------------ the nest: ln(lambda) by frame
/** where the push hands over (on the axis, 0.3 m off the screen) and where it brakes onto V3 (the whole card) */
export const LAMBDA_1 = 1 + 0.22 / (AXIS_LEN * S_T);
export const LAMBDA_A = 2.4;
export const NEST_KEYS: Array<[number, number]> = [
  [T.nest, Math.log(LAMBDA_A)],
  [190, Math.log(1.45)], // V3 read: RESEARCHER · V3
  [197, 0], // V3's window
  [203, LR], [208, 2 * LR], [212, 3 * LR], [215, 4 * LR], [218, 5 * LR], // the rush: V4 .. V8
  [226, 6 * LR + Math.log(2.45)], // the brake: V9, the whole card
  [235, 6 * LR + Math.log(2.05)], // EXCEEDS EXPECTATIONS, held (the whole line in frame)
  [T.surface, 6 * LR], // V9's window: the plot
];
const nestLn = monotone(NEST_KEYS, -0.03, -0.075);
export const lnLambda = (p: number) => nestLn(p);

// ------------------------------------------------------------------ the plot: the truck, the crest, the plunge (SURF)
/** the camera's line in the chart's plane: the line's top offset by `clear` (over the plateau), round the lip, then
 *  straight down. The camera trucks along it facing the chart (out at camZ), crests slowly and plunges. */
const pathPts: Array<[number, number]> = [];
const RIDE_X0 = VX(20);
{
  const {clear} = PW;
  for (let x = RIDE_X0; x <= LIP.cx; x += 0.5) {
    const y = lineTop(x), dy = (lineTop(x + 0.5) - lineTop(x - 0.5)) / 1;
    const l = Math.hypot(dy, 1);
    pathPts.push([x + (-dy / l) * clear, y + (1 / l) * clear]);
  }
  const R = PW.ro + clear;
  for (let th = 0.005; th <= Math.PI / 2; th += 0.005) pathPts.push([LIP.cx + R * Math.sin(th), LIP.cy + R * Math.cos(th)]);
  for (let y = LIP.cy - 0.5; y >= PW.landY - 40; y -= 0.5) pathPts.push([LIP.cx + R, y]);
}
const pathLen: number[] = [0];
for (let i = 1; i < pathPts.length; i++) pathLen.push(pathLen[i - 1] + Math.hypot(pathPts[i][0] - pathPts[i - 1][0], pathPts[i][1] - pathPts[i - 1][1]));
const pathAt = (s: number): {x: number; y: number; tx: number; ty: number} => {
  let lo = 0, hi = pathLen.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (pathLen[mid] < s) lo = mid; else hi = mid; }
  const t = clamp01((s - pathLen[lo]) / Math.max(1e-9, pathLen[hi] - pathLen[lo]));
  const [x0, y0] = pathPts[lo], [x1, y1] = pathPts[hi];
  const l = Math.hypot(x1 - x0, y1 - y0) || 1;
  return {x: lerp(x0, x1, t), y: lerp(y0, y1, t), tx: (x1 - x0) / l, ty: (y1 - y0) / l};
};
const sAtX = (x: number) => { let i = 0; while (i < pathPts.length - 1 && pathPts[i][0] < x) i++; return pathLen[i]; };
const sAtY = (y: number) => { let i = pathPts.length - 1; while (i > 0 && pathPts[i][1] < y) i--; return pathLen[i]; };
const LIP_R = PW.ro + PW.clear;
const S_R0 = sAtX(VX(37)), S_A = sAtX(LIP.cx), S_V = S_A + (Math.PI / 2) * LIP_R, S_L = sAtY(PW.landY);
/** arc length by frame: the truck (~8 cells a frame), slow over the crest, then the plunge, which only gains speed */
const RIDE_V0 = 8.5;
const rideKeys: Array<[number, number]> = [[T.ride, S_R0], [T.edge, S_A], [T.vertical, S_V], [T.land, S_L]];
const rideMono = monotone(rideKeys, RIDE_V0, 22);
export const RIDE = {S_R0, S_A, S_V, S_L, crest: (S_V - S_A) / (T.vertical - T.edge), plunge: (S_L - S_V) / (T.land - T.vertical)};
export const rideS = (p: number) => rideMono(p);
/** heading: into the chart, turned toward the way we travel; over the crest it swings back onto the face we fall
 *  down (the landing's `up` is the final heading) */
const YAW_RIDE = 28 * deg, YAW_FALL = -10 * deg;
const heading = (yaw: number) => new Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
const yawAt = (p: number) => lerp(YAW_RIDE, YAW_FALL, smooth(T.edge - 6, T.vertical + 2, p));
const H_DIR = heading(YAW_FALL);
const orient = (theta: number, p: number) => {
  const h = heading(yawAt(p));
  return {
    fwd: h.clone().multiplyScalar(Math.cos(theta)).add(new Vector3(0, Math.sin(theta), 0)),
    up: h.clone().multiplyScalar(-Math.sin(theta)).add(new Vector3(0, Math.cos(theta), 0)),
  };
};
/** the look: down onto the ledge; over the crest it tips down the face; in the plunge it looks down the wall (the
 *  face and the wall stream past the top of frame, the room rushes up below), and rights to straight down to land */
const thetaAt = (p: number) => {
  const ride = lerp(-16, -22, smooth(T.ride, T.edge, p));
  if (p <= T.edge) return ride * deg;
  if (p <= T.vertical + 2) return lerp(ride, -72, smooth(T.edge - 2, T.vertical + 2, p)) * deg;
  // in the plunge the look tips on toward straight down, so the room rushing up is in frame well before the landing
  return lerp(-72, -90, smooth(T.vertical + 2, T.land - 4, p)) * deg;
};
const camZAt = (p: number) => lerp(PW.camZ, PW.fallZ, smooth(T.edge + 4, T.land - 6, p));

// the launch: out of V9's photo window, face-on to the whole plot (the photo is the plot)
const LAUNCH = new Vector3(VX(48), VY(29), 430);
/** TUN units per cell: V9's photo window frames the plot like a photo from the read position */
export const S_S = 0.15 * Math.pow(TUNNEL.rho, LAST);
// the camera's frame at V9's window, in TUN (forward down the axis, up orthogonalised) ...
const tF = AXIS_DIR.clone().negate();
const tU = new Vector3(0, 1, 0).sub(tF.clone().multiplyScalar(tF.y)).normalize();
const tR = new Vector3().crossVectors(tF, tU).normalize();
// ... is SURF's launch frame (forward -z, up +y): SURF's axes in TUN follow
const XS = tR.clone(), YS = tU.clone(), ZS = tF.clone().negate();
const surfOrigin = v(G.photoCentre(LAST)).sub(new Vector3().copy(LAUNCH).applyMatrix4(new Matrix4().makeBasis(XS, YS, ZS)).multiplyScalar(S_S));
export const M_SURF = basis(XS, YS, ZS, surfOrigin, S_S);
/** the nest's exit speed, in cells per frame (the swoop starts at it) */
const V_LAUNCH = (() => {
  const e = 0.5, l0 = Math.exp(lnLambda(T.surface - e)), l1 = Math.exp(lnLambda(T.surface));
  return ((l0 - l1) / e) * AXIS_LEN / S_S;
})();

/** ROOM2 in SURF: its staging camera at the landing point looks straight down the fall, up = the heading */
export const LAND_POINT = new Vector3(LIP.cx + LIP_R, PW.landY, PW.fallZ);
{
  const q = pathAt(S_L);
  LAND_POINT.x = q.x;
}
const RIGHT_L = new Vector3(0, -1, 0).cross(H_DIR.clone()).normalize();
export const M_ROOM2 = basis(RIGHT_L, H_DIR.clone(), new Vector3(0, 1, 0), LAND_POINT, PW.sigma);

// ------------------------------------------------------------------ the room: the reveal, the hold, the push
/** where the reveal settles: trucked right, craned up, yawed ~8° left, tilted ~2° down */
const HOLD = {pos: new Vector3(0.55, 0.1, 0.02), yaw: 8 * deg, pitch: -2 * deg};
const dirOf = (yaw: number, pitch: number) => new Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
/** heavy dolly: the critically damped step (starts from rest, accelerates, settles, no overshoot), normalised to 1 */
const dolly = (t: number) => { const w = 5.2; const f = (x: number) => 1 - (1 + w * x) * Math.exp(-w * x); return f(clamp01(t)) / f(1); };

/** V3's photo-window centre and the axis direction, in ROOM coordinates */
const Q = W0.clone().applyMatrix4(M_TUN);
const U_ROOM = AXIS_DIR.clone().transformDirection(M_TUN);
/** passing his face: camera-left of his card's edge, in front of it, at eye height */
export const PASS = new Vector3(-0.86, -0.28, -2.78);
const A1_ROOM = onAxis(LAMBDA_1).applyMatrix4(M_TUN);
const hermite = (p0: Vector3, m0: Vector3, p1: Vector3, m1: Vector3, t: number) => {
  const t2 = t * t, t3 = t2 * t;
  return p0.clone().multiplyScalar(2 * t3 - 3 * t2 + 1).add(m0.clone().multiplyScalar(t3 - 2 * t2 + t)).add(p1.clone().multiplyScalar(-2 * t3 + 3 * t2)).add(m1.clone().multiplyScalar(t3 - t2));
};
/** the swing: HOLD (from rest) -> PASS -> A1, arriving along the axis */
const SW = {e: 0.58, p0: T.pushAt, p1: 160};
const swingAt = (e: number) => {
  const mP = A1_ROOM.clone().sub(HOLD.pos).multiplyScalar(0.55);
  const mA = U_ROOM.clone().negate().multiplyScalar(A1_ROOM.distanceTo(PASS) * 1.2);
  if (e < SW.e) return hermite(HOLD.pos, new Vector3(0, 0, 0), PASS, mP.clone().multiplyScalar(SW.e), e / SW.e);
  return hermite(PASS, mP.clone().multiplyScalar(1 - SW.e), A1_ROOM, mA.clone().multiplyScalar(1 - SW.e), (e - SW.e) / (1 - SW.e));
};
const swingE = (t: number) => t * t * (1.6 - 0.6 * t);
/** the axis leg (p160 -> nest): ln(lambda) from LAMBDA_1 braking onto the nest's first key */
const AXIS_LEG = (() => {
  const dt = 0.25, e1 = swingE(1), e0 = swingE(1 - dt / (SW.p1 - SW.p0));
  const vm = swingAt(e1).distanceTo(swingAt(e0)) / dt; // m per frame at the hand-over
  const m0 = -vm / (S_T * AXIS_LEN * LAMBDA_1);
  const m1 = (NEST_KEYS[1][1] - NEST_KEYS[0][1]) / (NEST_KEYS[1][0] - NEST_KEYS[0][0]);
  return monotone([[SW.p1, Math.log(LAMBDA_1)], [T.nest, Math.log(LAMBDA_A)]], m0, m1);
})();

const slerpDir = (a: Vector3, b: Vector3, t: number) => {
  const qa = new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), a.clone().normalize());
  const qb = new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), b.clone().normalize());
  return new Vector3(0, 0, -1).applyQuaternion(qa.slerp(qb, clamp01(t)));
};
const lookQuat = (fwd: Vector3, up: Vector3) => {
  const z = fwd.clone().normalize().negate(), x = new Vector3().crossVectors(up, z).normalize(), y = new Vector3().crossVectors(z, x);
  return new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(x, y, z));
};

/** the shadows dissolve in over the reveal's second beat, once the room visibly has depth */
export const SHADOW_IN: [number, number] = [70, 86];
/** the camera for clip frame p (60 .. 314). `step2` holds the reveal's camera on 2s (the native A/B variant). */
export const shotAt = (pIn: number, step2: boolean): Shot => {
  const base = {collapse2: 1, portal: false, vig1: true, vig2: false, shadow1: smooth(SHADOW_IN[0], SHADOW_IN[1], pIn), shadow2: 0};
  // the reveal on 2s in the native variant (it settles into the hold, which hides the switch to 1s for the push)
  const p = step2 && pIn < T.pushAt ? T.d3 + 2 * Math.floor((pIn - T.d3) / 2) : pIn;
  if (p < T.pushAt) {
    const s = dolly((p - T.d3) / (T.revealEnd - T.d3));
    return {...base, seg: 'ROOM', pos: HOLD.pos.clone().multiplyScalar(s), fwd: dirOf(HOLD.yaw * s, HOLD.pitch * s), up: new Vector3(0, 1, 0), cy: CAM.cy, draw: ['ROOM']};
  }
  if (p < SW.p1) {
    // the swing: round his card and onto the axis, gaining; the lens re-centres as it turns
    const t = (p - SW.p0) / (SW.p1 - SW.p0);
    const pos = swingAt(swingE(t));
    const fwdHold = dirOf(HOLD.yaw, HOLD.pitch);
    const toQ = Q.clone().sub(pos).normalize();
    const fwd = slerpDir(slerpDir(fwdHold, toQ, smooth(0.0, 0.6, t)), U_ROOM.clone().negate(), smooth(0.6, 1, t));
    return {...base, seg: 'ROOM', pos, fwd, up: new Vector3(0, 1, 0), cy: lerp(CAM.cy, 135, smooth(0.1, 0.8, t)), portal: p >= T.portalOpen, draw: ['ROOM', 'TUN']};
  }
  if (p < T.surface) {
    // on the Droste axis (TUN coordinates): the leg in, then the nest
    const lam = Math.exp(p < T.nest ? AXIS_LEG(p) : lnLambda(p));
    const pos = onAxis(lam);
    const inFront = pos.z > 0.0012 / S_T + 0.5;
    const draw: Seg[] = inFront ? ['ROOM', 'TUN', 'SURF', 'ROOM2'] : ['TUN', 'SURF', 'ROOM2'];
    return {...base, seg: 'TUN', pos, fwd: AXIS_DIR.clone().negate(), up: new Vector3(0, 1, 0), cy: 135, portal: p >= T.portalOpen, vig1: inFront, draw};
  }
  if (p < T.ride) {
    // the swoop: out of the photo (face-on to the whole plot) in toward the line, turning to truck along it
    const t = (p - T.surface) / (T.ride - T.surface);
    const q = pathAt(S_R0), dur = T.ride - T.surface;
    const P0 = LAUNCH.clone(), P3 = new Vector3(q.x, q.y, PW.camZ);
    const P1 = P0.clone().add(new Vector3(0, 0, -V_LAUNCH * dur / 3));
    const P2 = P3.clone().sub(new Vector3(q.tx, q.ty, 0).multiplyScalar(RIDE_V0 * dur / 3));
    const u = 1 - t;
    const pos = P0.clone().multiplyScalar(u * u * u).add(P1.clone().multiplyScalar(3 * u * u * t)).add(P2.clone().multiplyScalar(3 * u * t * t)).add(P3.clone().multiplyScalar(t * t * t));
    const o = orient(thetaAt(T.ride), T.ride);
    const qa = lookQuat(new Vector3(0, 0, -1), new Vector3(0, 1, 0)), qb = lookQuat(o.fwd, o.up);
    const qq = qa.clone().slerp(qb, smooth(0.1, 1, t));
    const fwd = new Vector3(0, 0, -1).applyQuaternion(qq), up = new Vector3(0, 1, 0).applyQuaternion(qq);
    return {...base, seg: 'SURF', pos, fwd, up, cy: 135, portal: true, vig1: false, draw: p < T.surface + 3 ? ['TUN', 'SURF', 'ROOM2'] : ['SURF', 'ROOM2']};
  }
  // the truck, the crest, the plunge (SURF), ending dead on ROOM2's staging camera
  if (p >= T.land) {
    return {...base, seg: 'SURF', pos: LAND_POINT.clone(), fwd: new Vector3(0, -1, 0), up: H_DIR.clone(), cy: CAM.cy, collapse2: 0.05, portal: true, vig1: false, vig2: true, draw: ['SURF', 'ROOM2']};
  }
  const q = pathAt(Math.min(rideS(p), S_L));
  const pos = new Vector3(q.x, q.y, camZAt(p));
  const o = orient(thetaAt(p), p);
  return {...base, seg: 'SURF', pos, fwd: o.fwd, up: o.up, cy: lerp(135, CAM.cy, smooth(T.land - 20, T.land, p)),
    collapse2: 1 - 0.95 * smooth(T.land - 14, T.land - 1, p), portal: true, vig1: false, vig2: p >= T.land - 6, draw: ['SURF', 'ROOM2']};
};

/** segment -> world matrix */
export const SEG_M: Record<Seg, Matrix4> = {
  ROOM: new Matrix4(),
  TUN: M_TUN,
  SURF: M_TUN.clone().multiply(M_SURF),
  ROOM2: M_TUN.clone().multiply(M_SURF).multiply(M_ROOM2),
};
/** the camera's world matrix and its world-units-per-local-unit scale */
export const cameraWorld = (s: Shot): {m: Matrix4; scale: number} => {
  const f = s.fwd.clone().normalize();
  const r = new Vector3().crossVectors(f, s.up).normalize();
  const u = new Vector3().crossVectors(r, f).normalize();
  const local = new Matrix4().makeBasis(r, u, f.clone().negate()).setPosition(s.pos);
  const segM = SEG_M[s.seg];
  const m = segM.clone().multiply(local);
  const scale = new Vector3().setFromMatrixColumn(segM, 0).length();
  // strip the scale from the camera's own matrix (keep it a rigid transform in world)
  const pos = new Vector3().setFromMatrixPosition(m);
  const rx = new Vector3().setFromMatrixColumn(m, 0).normalize(), ry = new Vector3().setFromMatrixColumn(m, 1).normalize(), rz = new Vector3().setFromMatrixColumn(m, 2).normalize();
  return {m: new Matrix4().makeBasis(rx, ry, rz).setPosition(pos), scale};
};
export {DEPTH, X_OUT};
