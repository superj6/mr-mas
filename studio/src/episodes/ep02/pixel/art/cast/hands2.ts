// MR. MAS — Ep2 v1 art: HANDS AT INSERT SCALE, on Ep1's insert-hands grammar (shared/pixel/kits/inserts-hands.ts,
// imported read-only: its capsule renderer `renderCaps`, its cel bands `CEL` and its room lights). Ep1's insert hands
// are full hands (three-segment fingers from the knuckles, the back of the hand, the thumb's mound, nails, joint
// creases, a cuff), so every Ep2 ECU hand is built the same way and carries its WRIST TO A CUFF TO A SLEEVE (the art
// review: "the ECU hand is one small sideways mitten ... it often floats free of the arm").
//   handRig(pose)            a posable hand (right or left) in centimetres: the wrist, the direction to the knuckles,
//                            the back's normal, each finger's curl (or its three joint angles), the spread, the thumb's
//                            tip; returns its capsules in world cm (x right, y down, z toward the camera)
//   renderHand(o)            renders a rig at s px/cm into an image with a z-buffer, lit by a room light; the cuff
//                            takes the sleeve's own ramp; returns anchors (the wrist, each fingertip, the cuff's end)
//   drawHand(b, h, x, y, o)  composites it (o.front / o.behind: only the pixels nearer / farther than a prop's plane)
//   sleeve(b, a, c, r, ramp) the sleeve from the cuff back to the elbow / the frame's edge, a lit capsule
// Named poses for Ep2's inserts (phoneGrip, point, pinch, palm, screwdriver, fingertips) live with their sets.
import {PAL, stepColor, familyOf} from '../../../../../shared/pixel/palette';
import type {Img} from '../../../../../shared/pixel/figure';
import {renderCaps, CEL, Cap, CapLight, HandLight} from '../../../../../shared/pixel/kits/inserts-hands';
import {Buf, clamp} from '../../../../../shared/pixel/px';

export type V3 = [number, number, number];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const rot = (v: V3, k: V3, deg: number): V3 => {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), kv = cross(k, v), d = dot(k, v);
  return [v[0] * c + kv[0] * s + k[0] * d * (1 - c), v[1] * c + kv[1] * s + k[1] * d * (1 - c), v[2] * c + kv[2] * s + k[2] * d * (1 - c)];
};

export interface HandPose {
  side: 'R' | 'L';
  /** the wrist's centre (world cm) */
  wrist: V3;
  /** toward the knuckles; the back of the hand's normal (world) */
  fwd: V3; back: V3;
  /** each finger (index, middle, ring, pinky): 0 straight .. 1 a fist; or its three joint angles (deg) */
  fingers: Array<number | [number, number, number]>;
  /** the fan between the fingers (deg) */
  spread?: number;
  /** the thumb's tip in the hand's own frame (cm: x toward the thumb side, y toward the fingers, z out of the back) */
  thumb?: V3;
  /** the cuff's length back from the wrist (cm; 0 = no cuff) and its radius */
  cuff?: number; cuffR?: number;
  /** nails on the fingertips seen from the back */
  nails?: boolean;
  /** size (1 = an adult's hand, ~19 cm wrist to fingertip) */
  size?: number;
}
export interface HandRig { caps: Cap[]; tips: V3[]; thumbTip: V3; wrist: V3; cuffEnd: V3; frame: {t: V3; f: V3; n: V3} }

const MCP: V3[] = [[2.9, 8.6, 0.25], [0.95, 9.0, 0.4], [-1.0, 8.7, 0.3], [-2.8, 8.0, 0.05]];
const LENS: Array<[number, number, number]> = [[4.3, 2.5, 1.9], [4.7, 2.9, 2.1], [4.4, 2.7, 2.0], [3.4, 2.0, 1.7]];
const RAD = [1.0, 1.04, 0.98, 0.86];
/** a hand as capsules in world cm */
export const handRig = (P: HandPose): HandRig => {
  const sz = P.size ?? 1;
  const f = norm(P.fwd);
  let n = norm(P.back);
  n = norm(add(n, mul(f, -dot(n, f))));
  const t = P.side === 'R' ? cross(f, n) : cross(n, f);
  const W = (p: V3): V3 => add(P.wrist, add(add(mul(t, p[0] * sz), mul(f, p[1] * sz)), mul(n, p[2] * sz)));
  const caps: Cap[] = [];
  const C = (a: V3, b: V3, ra: number, rb: number, id: string, mat: Cap['mat'] = 'skin', creases?: number[]): Cap => ({a, b, ra: ra * sz, rb: rb * sz, id, mat, creases});
  // the cuff, the wrist, the metacarpals as a slab (one capsule per knuckle), the thumb's mound, the pinky's edge
  const cuffL = P.cuff ?? 4, cuffR = P.cuffR ?? 2.9;
  const cuffEnd = W([0, -1.2 - cuffL, 0]);
  if (cuffL > 0) caps.push(C(cuffEnd, W([0, -1.0, 0]), cuffR, cuffR, 'cuff', 'cuff'));
  caps.push(C(W([0, -1.4, -0.1]), W([0, 1.8, -0.1]), 2.35, 2.5, 'wrist'));
  MCP.forEach((m, i) => caps.push(C(W([m[0] * 0.45, 1.4, -0.15]), W([m[0], m[1] - 0.4, m[2] - 0.2]), 1.25, 1.12, 'meta' + i)));
  caps.push(C(W([1.5, 1.8, -0.9]), W([3.2, 5.0, -1.0]), 1.55, 1.3, 'thenar'));
  caps.push(C(W([-2.0, 1.8, -0.5]), W([-2.8, 6.8, -0.4]), 1.15, 1.05, 'hypo'));
  // the fingers: three segments from each knuckle, bending toward the palm
  const tips: V3[] = [];
  const spread = P.spread ?? 6;
  P.fingers.forEach((cv, i) => {
    const ang: [number, number, number] = typeof cv === 'number' ? [cv * 72, cv * 98, cv * 66] : cv;
    let dir = rot(f, n, (P.side === 'R' ? 1 : -1) * spread * (1.5 - i) * (i === 3 ? 1.3 : 1));
    let nb = n;
    let p = W(MCP[i]);
    const r = RAD[i];
    caps.push(C(add(p, mul(dir, -0.2 * sz)), add(p, mul(dir, 0.2 * sz)), r * 1.0, r * 1.0, 'mcp' + i));
    for (let k = 0; k < 3; k++) {
      const s = norm(cross(nb, dir));
      dir = norm(rot(dir, s, ang[k]));
      nb = norm(rot(nb, s, ang[k]));
      const q = add(p, mul(dir, LENS[i][k] * sz));
      caps.push(C(p, q, r * [0.95, 0.88, 0.8][k], r * [0.88, 0.8, 0.74][k], `f${i}${k}`, 'skin', k === 0 ? [0.88] : k === 1 ? [0.86] : undefined));
      if (k === 2 && (P.nails ?? true)) {
        const na = add(add(p, mul(dir, LENS[i][k] * 0.4 * sz)), mul(nb, r * 0.72 * sz)), nq = add(add(p, mul(dir, LENS[i][k] * 0.94 * sz)), mul(nb, r * 0.62 * sz));
        caps.push({a: na, b: nq, ra: r * 0.42 * sz, rb: r * 0.38 * sz, sz: 0.5, mat: 'nail', id: `n${i}`});
      }
      p = q;
    }
    tips.push(p);
  });
  // the thumb: its metacarpal from the mound, then two segments to its tip (bent outward at the joint)
  const tt: V3 = P.thumb ?? [5.0, 8.2, -1.4];
  const cmc: V3 = [2.0, 1.8, -0.8], mcp: V3 = [3.9, 4.6, -1.1];
  const mid: V3 = [(mcp[0] + tt[0]) / 2 + 0.7, (mcp[1] + tt[1]) / 2 - 0.2, (mcp[2] + tt[2]) / 2 + 0.5];
  caps.push(C(W(cmc), W(mcp), 1.5, 1.2, 'tmeta'));
  caps.push(C(W(mcp), W(mid), 1.18, 1.06, 'tprox', 'skin', [0.9]));
  caps.push(C(W(mid), W(tt), 1.04, 0.92, 'tdist'));
  if (P.nails ?? true) {
    const d = norm(add(W(tt), mul(W(mid), -1)));
    const up = norm(add(n, mul(d, -dot(n, d))));
    caps.push({a: add(add(W(mid), mul(d, 0.9 * sz)), mul(up, 0.75 * sz)), b: add(W(tt), mul(up, 0.6 * sz)), ra: 0.45 * sz, rb: 0.4 * sz, sz: 0.5, mat: 'nail', id: 'tn'});
  }
  return {caps, tips, thumbTip: W(tt), wrist: P.wrist, cuffEnd, frame: {t, f, n}};
};

/** the cuff tones the renderer uses per light (to swap for the sleeve's own ramp) */
const CUFFT: Record<HandLight, number[]> = {
  dark: [PAL.N0, PAL.G0, PAL.G0, PAL.G1, PAL.C1, PAL.C2, PAL.C4],
  suite: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.C5],
  lobby: [PAL.N0, PAL.G0, PAL.G1, PAL.G2, PAL.G3, PAL.G4, PAL.W6],
};
export interface RenderedHand { img: Img; z: Float32Array; ids: Int16Array; capIds: string[]; at: (p: V3) => [number, number]; tips: Array<[number, number]>; thumb: [number, number]; wrist: [number, number]; cuffEnd: [number, number] }
/**
 * Render a hand rig at s px/cm with its origin (world 0, 0) at image (ox, oy). `cuffRamp`: 7 tones (shadow..rim) for
 * the cuff (a white shirt cuff, a navy jacket's, an orange cuff); `skin`: shift the warm skin ramp by k rungs (deeper
 * skin) or swap it with a map; `light` the room's (Ep1's three); `key` the key's direction toward the light.
 */
export const renderHand = (rig: HandRig, o: {s: number; w: number; h: number; ox: number; oy: number; light?: HandLight; key?: V3; cuffRamp?: number[]; skinMap?: (c: number) => number; back?: {dir: V3; min: number; col: number}}): RenderedHand => {
  const light = o.light ?? 'lobby';
  const P = (p: V3): V3 => [o.ox + p[0] * o.s, o.oy + p[1] * o.s, p[2] * o.s];
  const caps = rig.caps.map((c) => ({...c, a: P(c.a), b: P(c.b), ra: c.ra * o.s, rb: c.rb * o.s}));
  const L: CapLight = {key: o.key ?? [-0.45, -0.7, 0.55], cel: CEL, back: o.back};
  const r = renderCaps(o.w, o.h, caps, light, L);
  const img = r.img;
  // the cuff's own ramp, the skin's map
  for (let i = 0; i < img.c.length; i++) {
    const v = img.c[i]; if (v < 0) continue;
    const id = r.id[i];
    if (id >= 0 && caps[id].mat === 'cuff' && o.cuffRamp) { const k = CUFFT[light].indexOf(v); img.c[i] = k >= 0 ? o.cuffRamp[k] : v === PAL.S0 ? o.cuffRamp[0] : v; }
    else if (o.skinMap && id >= 0 && caps[id].mat !== 'cuff') img.c[i] = o.skinMap(v);
  }
  const at = (p: V3): [number, number] => { const q = P(p); return [q[0], q[1]]; };
  return {img, z: r.z, ids: r.id, capIds: caps.map((c) => c.id), at, tips: rig.tips.map(at), thumb: at(rig.thumbTip), wrist: at(rig.wrist), cuffEnd: at(rig.cuffEnd)};
};
/** composite a rendered hand at (x, y); `front`/`behind` keep only the pixels nearer / farther than a z (image px) */
export const drawHand = (b: Buf, h: RenderedHand, x: number, y: number, o: {front?: number; behind?: number; clip?: (x: number, y: number) => boolean; map?: (c: number) => number; caps?: (id: string, x: number, y: number) => boolean} = {}) => {
  const {img, z} = h;
  for (let j = 0; j < img.h; j++) for (let i = 0; i < img.w; i++) {
    const v = img.c[j * img.w + i]; if (v < 0) continue;
    const zz = z[j * img.w + i];
    if (o.caps) { const id = h.ids[j * img.w + i]; if (id < 0 || !o.caps(h.capIds[id], x + i, y + j)) continue; }
    if (o.front !== undefined && zz <= o.front) continue;
    if (o.behind !== undefined && zz > o.behind) continue;
    const X = x + i, Y = y + j;
    if (o.clip && !o.clip(X, Y)) continue;
    b.set(X, Y, o.map ? o.map(v) : v);
  }
};
/** the sleeve from (x0, y0) to (x1, y1): a capsule lit from the key, its far side a rung down, a rim on the lit edge,
 *  an outline on the shadow side; `ramp` = [outline, shadow, mid, lit, rim] */
export const sleeve = (b: Buf, a: [number, number], c: [number, number], r0: number, r1: number, ramp: number[], key: [number, number] = [-0.55, -0.83], o: {fold?: boolean} = {}) => {
  const [x0, y0] = a, [x1, y1] = c;
  const dx = x1 - x0, dy = y1 - y0, L2 = Math.max(1, dx * dx + dy * dy), L = Math.sqrt(L2);
  const R = Math.max(r0, r1);
  for (let y = Math.floor(Math.min(y0, y1) - R - 1); y <= Math.max(y0, y1) + R + 1; y++) for (let x = Math.floor(Math.min(x0, x1) - R - 1); x <= Math.max(x0, x1) + R + 1; x++) {
    if (x < 0 || y < 0 || x >= b.w || y >= b.h) continue;
    const t = clamp(((x + 0.5 - x0) * dx + (y + 0.5 - y0) * dy) / L2, 0, 1), cx = x0 + dx * t, cy = y0 + dy * t, d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
    const r = r0 + (r1 - r0) * t;
    if (d > r) continue;
    const nx = (x + 0.5 - cx) / Math.max(0.5, d), ny = (y + 0.5 - cy) / Math.max(0.5, d), lit = key[0] * nx + key[1] * ny;
    let c = d > r - 1 ? (lit > 0.3 ? ramp[4] : lit < -0.2 ? ramp[0] : ramp[2]) : lit > 0.35 ? ramp[3] : lit < -0.3 ? ramp[1] : ramp[2];
    // the cloth's folds: a few soft creases across the sleeve (a rung down), never a pattern
    if (o.fold !== false && d < r - 1.5) { const u = t * L; if ((Math.round(u) % 11 === 6 && Math.abs(nx) < 0.7) || (Math.round(u) % 17 === 3 && nx > 0)) c = ramp[1]; }
    b.set(x, y, c);
  }
};
/** deeper skin: the warm ramp walked k rungs down (a different person's hand, the same light) */
export const skinDown = (k: number) => (c: number) => { const fm = familyOf(c); return fm && fm[0] === 'S' ? stepColor(c, -k) : c; };

/** render a hand and place it so one of its points (a fingertip, the thumb's tip, the wrist) lands on a frame point:
 *  returns the rendered hand, its image offset, and its anchors in frame coordinates */
export const placeHand = (pose: HandPose, o: {s: number; at: [number, number]; anchor?: 'index' | 'middle' | 'thumb' | 'wrist'; pad?: number; light?: HandLight; key?: V3; cuffRamp?: number[]; skinMap?: (c: number) => number; back?: {dir: V3; min: number; col: number}}) => {
  const rig = handRig(pose);
  // the image box round the rig's points (cm -> px), with room for the radii
  const pts: V3[] = rig.caps.flatMap((c) => [c.a, c.b]);
  const pad = o.pad ?? 4;
  const xs = pts.map((p) => p[0] * o.s), ys = pts.map((p) => p[1] * o.s);
  const x0 = Math.floor(Math.min(...xs)) - Math.ceil(3.5 * o.s) - pad, y0 = Math.floor(Math.min(...ys)) - Math.ceil(3.5 * o.s) - pad;
  const w = Math.ceil(Math.max(...xs)) - x0 + Math.ceil(3.5 * o.s) + pad, h = Math.ceil(Math.max(...ys)) - y0 + Math.ceil(3.5 * o.s) + pad;
  const hand = renderHand(rig, {s: o.s, w, h, ox: -x0, oy: -y0, light: o.light, key: o.key, cuffRamp: o.cuffRamp, skinMap: o.skinMap, back: o.back});
  const a = o.anchor ?? 'index';
  const ap = a === 'thumb' ? hand.thumb : a === 'wrist' ? hand.wrist : hand.tips[a === 'middle' ? 1 : 0];
  const dx = Math.round(o.at[0] - ap[0]), dy = Math.round(o.at[1] - ap[1]);
  const T = (p: [number, number]): [number, number] => [p[0] + dx, p[1] + dy];
  return {hand, x: dx, y: dy, tips: hand.tips.map(T), thumb: T(hand.thumb), wrist: T(hand.wrist), cuffEnd: T(hand.cuffEnd)};
};
/** common Ep2 poses (right hands; `side: 'L'` mirrors). Directions are screen-space (x right, y down, z to camera). */
export const POSES = {
  /** the index out and down, the other fingers curled under, the thumb tucked along the middle finger */
  point: (fwd: V3, back: V3, side: 'R' | 'L' = 'R'): HandPose => ({side, wrist: [0, 0, 0], fwd, back, fingers: [[4, 8, 6], 0.92, 0.95, 0.95], spread: 3, thumb: [2.6, 7.2, -2.2], cuff: 4}),
  /** a relaxed open hand, the fingers a little curled, the thumb out */
  open: (fwd: V3, back: V3, side: 'R' | 'L' = 'R'): HandPose => ({side, wrist: [0, 0, 0], fwd, back, fingers: [0.12, 0.1, 0.14, 0.2], spread: 7, thumb: [5.6, 6.2, -0.6], cuff: 4}),
  /** a grip round something 2-3 cm thick held across the palm (a phone's edge, a handle): the fingers wrapped, the
   *  thumb along the far side */
  grip: (fwd: V3, back: V3, side: 'R' | 'L' = 'R', wrap = 0.62): HandPose => ({side, wrist: [0, 0, 0], fwd, back, fingers: [wrap, wrap + 0.04, wrap + 0.08, wrap + 0.12], spread: 2, thumb: [4.4, 8.6, -2.6], cuff: 4}),
  /** a pinch: the index and thumb meet at their tips, the others curled loosely */
  pinch: (fwd: V3, back: V3, side: 'R' | 'L' = 'R'): HandPose => ({side, wrist: [0, 0, 0], fwd, back, fingers: [[30, 40, 20], 0.55, 0.65, 0.72], spread: 4, thumb: [3.0, 10.4, -2.8], cuff: 4}),
};

/**
 * A phone (or a clicker, anything flat held up) in a hand, its face to the camera: the hand behind it, the phone, then
 * the parts of the hand in front of its face (the thumb on its edge, the fingertips round the far edge). `grip`:
 *   'wrap' one hand from the side `side` (its fingers round the far edge, its thumb on the near edge)
 *   'cup'  a hand under the phone's lower half for typing (its fingers up behind it, its thumb on the screen)
 * r = the phone's face in the frame (px); the hand is sized to the phone (a phone is ~7 cm wide). `thumbAt` 0..1 moves
 * the thumb along the edge (or across the screen for 'cup'). The sleeve runs from the cuff toward `sleeveTo`.
 */
export const holdPhone = (b: Buf, r: {x: number; y: number; w: number; h: number}, o: {side?: 'R' | 'L'; grip?: 'wrap' | 'cup'; light?: HandLight; key?: V3; cuffRamp: number[]; sleeveRamp: number[]; sleeveTo?: [number, number]; sleeveR?: number; drawPhone: (b: Buf) => void; thumbAt?: number; skinMap?: (c: number) => number; widthCm?: number; back?: {dir: V3; min: number; col: number}}) => {
  const side = o.side ?? 'R', sx = side === 'R' ? 1 : -1;
  const s = r.w / (o.widthCm ?? 7.2);
  const g = o.grip ?? 'wrap';
  let pose: HandPose;
  const ta = o.thumbAt ?? 0.5;
  // (the second pass, tested on a grip sheet: the wrap's wrist sits off the near edge low down so the knuckles land at
  // the far edge and only the curled fingertips come round it, not whole fingers lying out past the phone; the cup's
  // hand is behind the phone (z negative is behind), its fingers straight up its back, only the thumb in front)
  if (g === 'wrap') {
    const wx = side === 'R' ? r.x + r.w + 2.2 * s : r.x - 2.2 * s, wy = r.y + r.h - 3.0 * s;
    pose = {side, wrist: [wx / s, wy / s, -1.7], fwd: [-sx, -0.25, 0], back: [0, 0, -1], fingers: [0.62, 0.66, 0.7, 0.76], spread: 2, thumb: [6.6 - ta * 3.0, 3.2, -2.4], cuff: 4.5};
  } else {
    const wx = side === 'R' ? r.x + r.w - 0.8 * s : r.x + 0.8 * s, wy = r.y + r.h + 4.5 * s;
    pose = {side, wrist: [wx / s, wy / s, -2.8], fwd: [-sx * 0.35, -1, 0], back: [0, 0, -1], fingers: [0.1, 0.12, 0.14, 0.18], spread: 3, thumb: [3.2 - ta * 2.0, 6.4 + ta * 1.6, -5.4], cuff: 4.5};
  }
  const rig = handRig(pose);
  const hand = renderHand(rig, {s, w: b.w, h: b.h, ox: 0, oy: 0, light: o.light, key: o.key, cuffRamp: o.cuffRamp, skinMap: o.skinMap, back: o.back});
  const ce = hand.cuffEnd, wr = hand.wrist;
  const to = o.sleeveTo ?? [ce[0] + (ce[0] - wr[0]) * 6, ce[1] + (ce[1] - wr[1]) * 6];
  const sr = o.sleeveR ?? 3.2 * s;
  sleeve(b, ce, to, sr, sr * 1.15, o.sleeveRamp);
  drawHand(b, hand, 0, 0, {behind: 0});
  o.drawPhone(b);
  drawHand(b, hand, 0, 0, {front: 0, caps: g === 'cup' ? (id) => id.startsWith('t') : undefined});
  return hand;
};
