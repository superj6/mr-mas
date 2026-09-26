// MR. MAS — style jump prototype 2 · VARIANT A, THE GLASS (fix pass; built for comparison, kept as a still).
// The sky behaves like a pane. A star fracture blooms from one point in the window's upper-right sky, the way safety
// glass or a phone screen breaks: radial arms, then concentric spider-web rings between them. When it opens, the
// shards inside the second ring become the far side, each one seen slightly offset and at its own brightness (each
// shard is tilted: refraction), so the new medium shows through what it bends. Outside the open shards the cracks stay
// whole-pixel lines on the pixel sky. The fracture lives only on the sky plane (skyplane.ts): it passes behind the
// transom, the mullion, the spire and the rooftops, and never reaches his face.
//
// Geometry is native px (float), rendered at 1080 inside the open shards; the outer matte is the native grid.
import {hash} from '../../../shared/pixel/px';
import {stepColor} from '../../../shared/pixel/palette';
import {T, glassOpen} from './timing';
import {isSky} from './skyplane';

const NW = 480, RH = 203;

export const IMPACT = {x: 268.5, y: 27.5};
const K = 9;
const SEED = 7171;
/** ring radii (native px) before per-arm jitter; ring 3 is partial */
const RINGS = [4.5, 10, 17, 27];
const RMAX = 120;

interface Arm { th: Float32Array; len: number }
interface Glass { arms: Arm[]; ring: Array<Array<[number, number]>>; ringOn: boolean[][] }
let G: Glass | null = null;

const build = (): Glass => {
  const rot = 0.21;
  const arms: Arm[] = [];
  for (let k = 0; k < K; k++) {
    const th = new Float32Array(RMAX + 1);
    let a = rot + (2 * Math.PI * k) / K + (hash(k, 1, SEED) - 0.5) * 0.5;
    for (let r = 0; r <= RMAX; r++) {
      if (r > 0 && r % 6 === 0) a += (hash(k, r, SEED + 1) - 0.5) * 0.16;
      th[r] = a;
    }
    arms.push({th, len: 38 + Math.floor(hash(k, 2, SEED) * 70)});
  }
  const ring: Array<Array<[number, number]>> = [];
  const ringOn: boolean[][] = [];
  RINGS.forEach((rho, j) => {
    const pts: Array<[number, number]> = [];
    const on: boolean[] = [];
    for (let k = 0; k < K; k++) {
      const r = rho * (0.8 + 0.4 * hash(j, k, SEED + 2));
      const a = arms[k].th[Math.min(RMAX, Math.round(r))];
      pts.push([IMPACT.x + r * Math.cos(a), IMPACT.y + r * Math.sin(a)]);
      on.push(j < 3 || hash(j, k, SEED + 3) < 0.62);
    }
    ring.push(pts);
    ringOn.push(on);
  });
  return {arms, ring, ringOn};
};
const glass = () => (G ??= build());

const wrap = (a: number) => { a %= 2 * Math.PI; return a < 0 ? a + 2 * Math.PI : a; };
/** the shard at native float (x, y): its sector k and ring j (0 = the centre .. 4 = outside every ring) */
export const cellAt = (x: number, y: number): [number, number] => {
  const g = glass();
  const dx = x - IMPACT.x, dy = y - IMPACT.y, r = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
  const ri = Math.min(RMAX, Math.round(r));
  let k = K - 1;
  for (let i = 0; i < K; i++) {
    const a0 = g.arms[i].th[ri], a1 = g.arms[(i + 1) % K].th[ri];
    if (wrap(th - a0) < wrap(a1 - a0)) { k = i; break; }
  }
  const k1 = (k + 1) % K;
  for (let j = 0; j < RINGS.length; j++) {
    const [ax, ay] = g.ring[j][k], [bx, by] = g.ring[j][k1];
    const s = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
    const si = (bx - ax) * (IMPACT.y - ay) - (by - ay) * (IMPACT.x - ax);
    if (Math.sign(s) === Math.sign(si)) return [k, j];
  }
  return [k, RINGS.length];
};

/** arms' drawn length (native px) at p: constant speed, fast (glass breaks faster than the eye) */
const armLen = (p: number) => (p < T.crack ? 0 : (p - T.crack + 1) * 12);
/** ring j is drawn from this frame on */
const ringFrom = (j: number) => T.crack + 2 + j;

/** the open shards' native mask at p (on the sky plane only) */
export const glassMask = (p: number, occ?: Uint8Array): Uint8Array => {
  const m = new Uint8Array(NW * 270);
  const n = glassOpen(p);
  if (n < 0) return m;
  const R = RINGS[n] * 1.25 + 2;
  for (let y = Math.max(0, Math.floor(IMPACT.y - R)); y <= Math.min(RH - 1, Math.ceil(IMPACT.y + R)); y++)
    for (let x = Math.floor(IMPACT.x - R); x <= Math.ceil(IMPACT.x + R); x++) {
      if (!isSky(x, y, occ)) continue;
      if (cellAt(x + 0.5, y + 0.5)[1] <= n) m[y * NW + x] = 255;
    }
  return m;
};

/** the pixel side: the cracks as whole-pixel lines, lit (glass edges catch the light), outside the open shards */
export const glassLines = (fb: {c: Uint32Array}, p: number, gap: Uint8Array, occ?: Uint8Array) => {
  // the seal heals the lines with the shards; only the scar stays
  if (p < T.crack || p >= T.scar) return;
  const g = glass();
  const done = new Uint8Array(NW * RH);
  const put = (x: number, y: number, lift: number) => {
    x = Math.floor(x); y = Math.floor(y);
    if (y < 0 || y >= RH || x < 0 || x >= NW) return;
    const i = y * NW + x;
    if (done[i] || gap[i] || !isSky(x, y, occ)) return;
    done[i] = 1;
    fb.c[i] = stepColor(fb.c[i], lift);
  };
  const L = armLen(p);
  for (const a of g.arms) for (let r = 0; r <= Math.min(L, a.len); r += 0.5) put(IMPACT.x + r * Math.cos(a.th[Math.round(r)]), IMPACT.y + r * Math.sin(a.th[Math.round(r)]), r < 22 ? 3 : 2);
  RINGS.forEach((_, j) => {
    if (p < ringFrom(j)) return;
    for (let k = 0; k < K; k++) {
      if (!g.ringOn[j][k]) continue;
      const [ax, ay] = g.ring[j][k], [bx, by] = g.ring[j][(k + 1) % K];
      const n = Math.ceil(Math.hypot(bx - ax, by - ay) * 2);
      for (let s = 0; s <= n; s++) put(ax + ((bx - ax) * s) / n, ay + ((by - ay) * s) / n, 2);
    }
  });
};

/** the scar after the seal: the impact point only, 2 px */
export const glassScar = (fb: {c: Uint32Array}, occ?: Uint8Array) => {
  for (const [x, y] of [[268, 27], [269, 27]] as Array<[number, number]>) if (isSky(x, y, occ)) fb.c[y * NW + x] = stepColor(fb.c[y * NW + x], 2);
};

/** each shard's view of the far side: an integer offset (1080 px) and a gain (its tilt) */
export const shardView = (k: number, j: number): {dx: number; dy: number; gain: number} => {
  const a = glass().arms[k].th[Math.round(RINGS[Math.min(j, 3)] * 0.7)] + 0.35;
  const push = j === 0 ? 10 : 4 + 5 * hash(k, j, SEED + 4);
  return {
    dx: Math.round(Math.cos(a) * push + (hash(k, j, SEED + 5) - 0.5) * 8),
    dy: Math.round(Math.sin(a) * push + (hash(k, j, SEED + 6) - 0.5) * 8),
    gain: j === 0 ? 0.7 : 0.8 + 0.45 * hash(k, j, SEED + 7),
  };
};

export const glassLookAt: [number, number] = [Math.floor(IMPACT.x), Math.floor(IMPACT.y)];
