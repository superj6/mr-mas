// MR. MAS — Ep2 v1 art: a head BUILT PER CHARACTER (the art review's first note: "every new bust is the same head").
// Ep1's speaking busts each have their own skull (Mas, Mario, Tasya, Rima, Alyi, Nole: hand-painted planes). The Ep2
// cast is eight new people, so instead of one skull with two knobs, each head is SCULPTED from a few forms with its own
// sizes (the cranium, the cheek mass, the jaw, the chin, the cheekbones, the brow ridge, the nose and its wings, the
// mouth's muzzle, the eye sockets, the ears, the neck, the hair's own masses), turned to its own angle, lit by the
// bust's key and cut into the portraits' flat cel planes: three skin tones and a highlight, no dither on skin, an
// outline on the shadow side, a hot rim on the key side and the back light's rim behind. It is the same idea as Ep1's
// insert hands (kits/inserts-hands.ts: forms lit from their normals, cut into cel bands), so it sits in the show's
// light. The face's features are drawn on the sculpted landmarks per character and per expression: the eyes (their
// own shape, size, tilt and lids), the brows (their own weight and arch), the mouth (its width, the lips' colour), the
// lines of age and of a smile, lashes, glasses.
//
//   sculptHead(spec, pose)        -> Sculpt: the shaded head + neck + hair (112 x 136, the bust frame), its depth,
//                                    materials, and `at(p)` (a head-space point to the frame)
//   drawFace(sculpt, spec, face)  paints the features onto a copy of the sculpt's image
// Every length in a spec is in bust pixels, measured from the point between the eyes (head space: x toward the
// character's left, which is the camera's right at yaw 0; y down; z toward the camera).
import {PAL, stepColor} from '../../../../../shared/pixel/palette';
import type {Img} from '../../../../../shared/pixel/figure';

export type V3 = [number, number, number];
export type HairStyle = 'none' | 'crop' | 'side' | 'quiff' | 'curly' | 'tousled' | 'bob' | 'bun' | 'swept' | 'cap';
export interface HeadSpec3 {
  /** the turn: + faces camera-left (deg); 0 looks straight down the lens */
  yaw: number;
  /** + tips the chin down (deg) */
  pitch?: number;
  /** a tilt in the image plane (deg, + clockwise) */
  roll?: number;
  /** the point between the eyes, in the bust frame */
  at: [number, number];
  /** overall size (1 = the reference head, about 70 px from crown to chin) */
  scale?: number;
  /** cranium half-sizes (width, height, depth) and its centre's y / z */
  cranium: V3; craniumY?: number; craniumZ?: number;
  /** the cheek mass: half-width, centre y, forward z */
  cheekW: number; cheekY?: number; cheekZ?: number;
  /** the jaw: half-width at the angle, the angle's y, its half-height */
  jawW: number; jawY: number; jawH?: number;
  /** the chin: bottom y, half-width, forward z, half-height */
  chinY: number; chinW: number; chinZ: number; chinH?: number;
  /** cheekbones (0 none .. 1.4 strong), cheek fullness (0 hollow .. 1.4 round) */
  cheekbone: number; full: number;
  /** the brow ridge's radius (0 none .. 4 heavy) and its y */
  brow: number; browY?: number;
  /** the nose: bridge top y, tip y, the tip's reach forward of the face (z), the wings' half-width, the bridge's
   *  radius, a hook (+ convex, - concave), the tip's radius */
  nose: {top?: number; tipY: number; proj: number; wing: number; bridge?: number; hook?: number; tip?: number};
  /** the mouth line's y, the muzzle's forward z, the lips' fullness (0..1.6) */
  mouthY: number; muzzle?: number; lips?: number;
  /** eyes: half their spacing, the socket depth (0.6 shallow .. 1.4 deep) */
  eyeX: number; socket?: number;
  /** ears: centre y, half-height, z */
  ear?: {y: number; h: number; z?: number};
  /** the neck: radius, forward lean, an Adam's apple */
  neck: {r: number; z?: number; throat?: boolean};
  /** the hair: style, thickness, the hairline's height at the front, the parting side, length (bob), volume on top */
  hair: {style: HairStyle; thick?: number; line?: number; side?: -1 | 1; len?: number; volume?: number; sideLine?: number};
  /** ramps [outline, shadow, mid, light, bright, rim] */
  skin: number[]; hairRamp: number[];
  /** the back light's colour on the silhouette's far edge (skin, hair) */
  back?: {skin: number; hair: number};
  /** the key light (toward it, screen space: x right, y down, z toward the camera) */
  key?: V3;
}
export interface HeadPose {
  /** the jaw drop for an open mouth (px) */
  jaw?: number;
  /** a smile lifts the cheeks (0..2) */
  cheekUp?: number;
  /** a nod (deg, added to pitch); a turn (deg, added to yaw) */
  nod?: number; turn?: number;
}
export interface Sculpt {
  img: Img;
  /** a head-space point to the frame: [x, y, depth] */
  at: (p: V3) => [number, number, number];
  /** per pixel: 0 none, 1 skin, 2 hair, 3 ear, 4 neck */
  mat: Uint8Array;
  depth: Float32Array;
  /** the cel tone per pixel (0..5; -1 empty) */
  tone: Int8Array;
}

// ------------------------------------------------------------------ SDF primitives
const ell = (p: V3, c: V3, r: V3) => {
  const x = (p[0] - c[0]) / r[0], y = (p[1] - c[1]) / r[1], z = (p[2] - c[2]) / r[2];
  const k0 = Math.sqrt(x * x + y * y + z * z);
  const a = x / r[0], b = y / r[1], cc = z / r[2];
  const k1 = Math.sqrt(a * a + b * b + cc * cc);
  return k1 < 1e-6 ? -Math.min(r[0], r[1], r[2]) : (k0 * (k0 - 1)) / k1;
};
const cap = (p: V3, a: V3, b: V3, ra: number, rb: number) => {
  const pax = p[0] - a[0], pay = p[1] - a[1], paz = p[2] - a[2], bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2];
  const L2 = bax * bax + bay * bay + baz * baz || 1e-6;
  const h = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / L2));
  const dx = pax - bax * h, dy = pay - bay * h, dz = paz - baz * h;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - (ra + (rb - ra) * h);
};
const smin = (a: number, b: number, k: number) => { const h = Math.max(0, Math.min(1, 0.5 + (0.5 * (b - a)) / k)); return b + (a - b) * h - k * h * (1 - h); };
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);
const rad = (d: number) => (d * Math.PI) / 180;
/** a smooth value noise on a lattice (hair texture; deterministic) */
const hh = (x: number, y: number, z: number) => { const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return s - Math.floor(s); };

/** the skin's field (head space) */
const skinField = (S: HeadSpec3, Q: HeadPose) => {
  const cr = S.cranium, cy = S.craniumY ?? -8, cz = S.craniumZ ?? -3;
  const jd = Q.jaw ?? 0, cu = Q.cheekUp ?? 0;
  const cheekY = S.cheekY ?? 7, cheekZ = S.cheekZ ?? 6;
  const jawH = S.jawH ?? 11, chinH = S.chinH ?? 5, browY = S.browY ?? -6;
  const N = S.nose, nTop = N.top ?? -3, nb = N.bridge ?? 2.2, nTip = N.tip ?? 3;
  const muz = S.muzzle ?? 14, lips = S.lips ?? 1, sock = S.socket ?? 1;
  const ear = S.ear ?? {y: 3, h: 8};
  const tipZ = 16 + N.proj, hook = N.hook ?? 0;
  const mid: V3 = [0, (nTop + N.tipY) / 2, (14 + tipZ) / 2 + hook];
  return (p: V3): number => {
    const x = p[0], y = p[1], z = p[2];
    const q: V3 = [Math.abs(x), y, z];
    let d = ell(p, [0, cy, cz], cr);
    const yl = y > 12 ? y - jd * Math.min(1, (y - 12) / 10) : y;
    const pl: V3 = [x, yl, z], ql: V3 = [Math.abs(x), yl, z];
    d = smin(d, ell(pl, [0, cheekY, cheekZ], [S.cheekW, 17, 15]), 6);
    d = smin(d, ell(pl, [0, S.jawY, 0], [S.jawW, jawH, 15]), 6);
    d = smin(d, ell(pl, [0, S.chinY - chinH, S.chinZ], [S.chinW, chinH, 6]), 5);
    if (S.cheekbone > 0) d = smin(d, ell(q, [S.eyeX + 3, 5 - cu, cheekZ + 9], [5.5 * S.cheekbone, 4.5, 5.5]), 3.5);
    if (S.full > 0) d = smin(d, ell(ql, [S.eyeX + 1, 13 - cu * 1.5, cheekZ + 7 + cu], [7 * S.full, 6.5 * S.full, 6]), 4);
    if (S.brow > 0) d = smin(d, cap(p, [-S.eyeX - 4, browY, cz + cr[2] - 6], [S.eyeX + 4, browY, cz + cr[2] - 6], S.brow, S.brow), 3);
    d = smin(d, ell(pl, [0, S.mouthY - 1, muz], [9.5, 6.5, 4.5]), 4);
    if (lips > 0) d = smin(d, ell(pl, [0, S.mouthY + 0.5, muz + 3.2], [5.6, 1.4 + lips * 1.1, 1.4 + lips * 0.8]), 1.8);
    d = smin(d, cap(p, [0, nTop, 15], mid, nb * 0.85, nb), 1.5);
    d = smin(d, cap(p, mid, [0, N.tipY - 1, tipZ], nb, nTip * 0.9), 1.5);
    d = smin(d, ell(p, [0, N.tipY, tipZ - 1.2], [nTip * 0.92, nTip * 0.82, nTip * 0.85]), 1.4);
    d = smin(d, ell(q, [N.wing, N.tipY + 0.5, tipZ - 4.5], [2.6, 2.2, 2.6]), 1.5);
    d = smax(d, -ell(q, [S.eyeX, -0.5, 18.5 + (1 - sock) * 2], [5.6, 3.6, 3.6 * sock + 0.4]), 2.4);
    d = smin(d, ell(q, [S.eyeX, 0, 13.5], [4.3, 3.6, 4.3]), 0.8);
    d = smin(d, ell(q, [cr[0] - 1.5, ear.y, ear.z ?? -3], [3, ear.h, 5.5]), 1.5);
    return d;
  };
};
const neckField = (S: HeadSpec3) => (p: V3): number => {
  const nz = S.neck.z ?? 0;
  let d = cap(p, [0, S.jawY - 4, -5 + nz], [0, 62, -9 + nz], S.neck.r, S.neck.r + 2);
  if (S.neck.throat) d = Math.min(d, ell(p, [0, S.jawY + 13, S.neck.r - 6 + nz], [2.2, 3, 2.4]));
  return d;
};
/** the hairline's height at a head-space direction: `line` at the front, `sideLine` over the ears, `back` at the nape */
const hairline = (S: HeadSpec3, x: number, z: number, back = 14) => {
  const H = S.hair, line = H.line ?? -18, sideLine = H.sideLine ?? -4;
  const cz = S.craniumZ ?? -3;
  const phi = Math.abs(Math.atan2(x, z - cz)) * (180 / Math.PI); // 0 front, 90 side, 180 back
  if (phi < 35) return line;
  if (phi < 95) { const t = (phi - 35) / 60; return line + (sideLine - line) * (t * t * (3 - 2 * t)); }
  const t = Math.min(1, (phi - 95) / 60); return sideLine + (back - sideLine) * (t * t * (3 - 2 * t));
};
const hairField = (S: HeadSpec3) => {
  const H = S.hair, cr = S.cranium, cy = S.craniumY ?? -8, cz = S.craniumZ ?? -3;
  const th = H.thick ?? 3, side = H.side ?? 1, vol = H.volume ?? 1;
  if (H.style === 'none') return (_p: V3) => 1e9;
  const shell = (p: V3, t: number) => ell(p, [0, cy - t * 0.25, cz - t * 0.2], [cr[0] + t, cr[1] + t, cr[2] + t]);
  const cut = (p: V3, back = 14) => p[1] - hairline(S, p[0], p[2], back);
  return (p: V3): number => {
    const x = p[0], y = p[1], z = p[2];
    switch (H.style) {
      case 'crop': return smax(shell(p, th), cut(p, 10), 1);
      case 'side': {
        // a side part: the hair lies over to the far side, fuller on top, the parting a groove on the near side
        const top = ell(p, [-side * 3, cy - cr[1] * 0.55, cz + 3], [cr[0] + 1, 8 * vol, cr[2] * 0.95]);
        let d = smax(smin(shell(p, th), top, 4), cut(p, 12), 1.2);
        d = smax(d, -cap(p, [side * 6, cy - cr[1] - 6, cz + cr[2]], [side * 6, cy - cr[1] - 6, cz - 2], 1.2, 1.2), 0.8);
        return d;
      }
      case 'quiff': {
        const q = ell(p, [0, (H.line ?? -18) - 5, cz + cr[2] - 3], [cr[0] * 0.78, 8 * vol, 9]);
        return smax(smin(shell(p, th), q, 5), cut(p, 8), 1);
      }
      case 'swept': {
        const top = ell(p, [0, cy - cr[1] * 0.45, cz - 2], [cr[0] + 1.5, 8.5 * vol, cr[2] + 2]);
        return smax(smin(shell(p, th), top, 4), cut(p, 12), 1.2);
      }
      case 'curly': {
        const n = (hh(Math.floor(x / 4.5), Math.floor(y / 4.5), Math.floor(z / 4.5)) - 0.5) * 3;
        return smax(shell(p, th + 1.5 + n), cut(p, 10) - 1, 1.5);
      }
      case 'tousled': {
        const n = (hh(Math.floor(x / 5), Math.floor(y / 3.5), Math.floor(z / 5)) - 0.5) * 2.4;
        const top = ell(p, [side * 2, cy - cr[1] * 0.5, cz + 3], [cr[0] + 1, 7.5 * vol, cr[2]]);
        return smax(smin(shell(p, th + n), top, 4), cut(p, 10) + n * 0.6, 1.2);
      }
      case 'bob': {
        // a chin-length bob: a crown shell plus a mass that hangs to `len` at the sides and back, open at the face
        // (in front of the ears' plane, below the hairline); a light fringe swept toward the far side
        const len = H.len ?? 24, line = H.line ?? -16;
        const crown = shell(p, th);
        const hang = ell(p, [0, cy + 8, cz - 1], [cr[0] + th + 0.5, cr[1] + 10, cr[2] + th]);
        let d = smin(crown, hang, 3);
        d = smax(d, y - len - Math.max(0, -(z - cz)) * 0.1, 1.5);
        const open = smax(smax(cz + 2.5 - z, line + 1 - y, 1), Math.abs(x) - (cr[0] + 0.5), 1);
        d = smax(d, -open, 1.2);
        const fringe = smax(ell(p, [-side * 5, line - 0.5, cz + cr[2] - 2.5], [cr[0] * 0.8, 3.6, 6]), z - (cz + cr[2] + 3), 1);
        return smin(d, fringe, 2);
      }
      case 'cap': {
        // a baseball cap: its crown a shell over the top of the head down to the band (`line`), its brim a flat
        // visor forward over the brow (the hair ramp is the cap's colour)
        const line = H.line ?? -12;
        const crown = smax(shell(p, th), y - line, 0.8);
        const brim = smax(ell(p, [0, line - 0.5, cz + cr[2] + 2], [cr[0] * 0.78, 1.3, 9]), cz + cr[2] - 3 - z, 0.6);
        return smin(crown, brim, 0.8);
      }
      case 'bun': {
        const b = ell(p, [0, cy - 6, cz - cr[2] - 1], [7.5, 7, 6.5]);
        return smin(smax(shell(p, th), cut(p, 12), 1), b, 2);
      }
    }
    return 1e9;
  };
};

// ------------------------------------------------------------------ the render
const W = 112, H = 136;
const SCULPTS = new Map<string, Sculpt>();
/** sculpt a head into the bust frame (cached per spec + pose) */
export const sculptHead = (spec: HeadSpec3, pose: HeadPose = {}): Sculpt => {
  const k = JSON.stringify([spec, pose]);
  const hit = SCULPTS.get(k);
  if (hit) return hit;
  const r = sculpt(spec, pose);
  SCULPTS.set(k, r);
  return r;
};
const sculpt = (S: HeadSpec3, Q: HeadPose): Sculpt => {
  const yaw = rad(S.yaw + (Q.turn ?? 0)), pitch = rad((S.pitch ?? 0) + (Q.nod ?? 0)), roll = rad(S.roll ?? 0);
  const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll);
  const sc = S.scale ?? 1;
  const [ox, oy] = S.at;
  const toScreen = (p: V3): [number, number, number] => {
    const x1 = p[0] * cyw - p[2] * syw, z1 = p[0] * syw + p[2] * cyw;
    const y2 = p[1] * cp - z1 * sp, z2 = p[1] * sp + z1 * cp;
    const x3 = x1 * cr - y2 * sr, y3 = x1 * sr + y2 * cr;
    return [ox + x3 * sc, oy + y3 * sc, z2 * sc];
  };
  const fs = skinField(S, Q), fn = neckField(S), fh = hairField(S);
  const P: V3 = [0, 0, 0];
  const toHead = (x: number, y: number, z: number) => {
    const u = (x - ox) / sc, v = (y - oy) / sc, w = z / sc;
    const x1 = u * cr + v * sr, y1 = -u * sr + v * cr;
    const yy = y1 * cp + w * sp, z1 = -y1 * sp + w * cp;
    P[0] = x1 * cyw + z1 * syw; P[1] = yy; P[2] = -x1 * syw + z1 * cyw;
    return P;
  };
  const sdf = (x: number, y: number, z: number) => { const p = toHead(x, y, z); return Math.min(fs(p), fn(p), fh(p)) * sc; };
  const matAt = (x: number, y: number, z: number) => {
    const p = toHead(x, y, z);
    const a0 = fs(p), a1 = fn(p), a2 = fh(p);
    if (a2 <= a0 && a2 <= a1) return 2;
    if (a1 < a0) return 4;
    const ear = S.ear ?? {y: 3, h: 8};
    if (Math.abs(p[0]) > S.cranium[0] - 4.5 && Math.abs(p[1] - ear.y) < ear.h + 1 && p[2] < 3) return 3;
    return 1;
  };
  const depth = new Float32Array(W * H).fill(-1e9), mat = new Uint8Array(W * H), lam = new Float32Array(W * H);
  const hp = new Float32Array(W * H * 3);
  const key = S.key ?? [-0.8, -0.38, 0.48];
  const kl = Math.hypot(key[0], key[1], key[2]);
  const K: V3 = [key[0] / kl, key[1] / kl, key[2] / kl];
  const R = 58 * sc;
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const x = px + 0.5, y = py + 0.5;
    if (Math.hypot(x - ox, y - (oy + 6 * sc)) > R && y < oy + 30 * sc) continue;
    let z = 44 * sc, hit = false;
    for (let k = 0; k < 90 && z > -44 * sc; k++) {
      const d = sdf(x, y, z);
      if (d < 0.1) { hit = true; break; }
      z -= Math.max(0.25, d * 0.75);
    }
    if (!hit) continue;
    const i = py * W + px;
    const e = 0.5;
    let nx = sdf(x + e, y, z) - sdf(x - e, y, z), ny = sdf(x, y + e, z) - sdf(x, y - e, z), nz = sdf(x, y, z + e) - sdf(x, y, z - e);
    const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
    depth[i] = z; mat[i] = matAt(x, y, z);
    { const q = toHead(x, y, z); hp[i * 3] = q[0]; hp[i * 3 + 1] = q[1]; hp[i * 3 + 2] = q[2]; }
    let l = nx * K[0] + ny * K[1] + nz * K[2];
    // deep creases only (the sockets' inner corner, under the nose, the mouth's corners)
    const ao = sdf(x + nx * 2.2, y + ny * 2.2, z + nz * 2.2) / 2.2;
    if (ao < 0.3) l -= (0.3 - ao) * 1.2;
    // the key's cast shadows: the nose on the far cheek, the jaw on the neck, the hair on the forehead
    let t = 1.5, sh = false;
    for (let k = 0; k < 28 && t < 34; k++) { const d = sdf(x + K[0] * t, y + K[1] * t, z + K[2] * t); if (d < 0.08) { sh = true; break; } t += Math.max(0.5, d); }
    if (sh) l = Math.min(l, -0.1);
    lam[i] = l;
  }
  // the cel planes: one big lit plane, a turn-off plane, the shadow; a highlight only where the form faces the key
  const tone = new Int8Array(W * H).fill(-1);
  for (let i = 0; i < W * H; i++) {
    if (!mat[i]) continue;
    const l = lam[i], m = mat[i];
    let t = l > 0.62 ? 4 : l > 0.2 ? 3 : l > -0.18 ? 2 : 1;
    if (m === 4) t = Math.max(1, Math.min(t, 3) - 1);
    if (m === 3) t = Math.max(1, Math.min(t, 3));
    if (m === 2) t = l > 0.66 ? 4 : l > 0.22 ? 3 : l > -0.2 ? 2 : 1;
    tone[i] = t;
  }
  // edges: the silhouette's shadow side takes the outline, its key side the hot rim, its back the back light; where a
  // nearer form passes over a farther one (the nose over the cheek, the ear, the jaw over the neck) the outline
  const out = new Int8Array(tone);
  const backHit = new Uint8Array(W * H);
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const i = py * W + px;
    if (tone[i] < 0) continue;
    let edge = false, rim = false, back = false;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const X = px + dx, Y = py + dy, j = Y * W + X;
      const empty = X < 0 || Y < 0 || X >= W || Y >= H || tone[j] < 0;
      const toward = dx * K[0] + dy * K[1] > 0.25;
      if (empty) { if (toward) rim = true; else if (dx > 0) back = true; else edge = true; }
      else if (depth[j] < depth[i] - 4.5 * sc && !toward && (mat[j] !== mat[i] || depth[j] < depth[i] - 8 * sc)) edge = true;
    }
    if (edge) out[i] = 0;
    else if (rim && mat[i] !== 4) out[i] = 5;
    else if (back && S.back) backHit[i] = 1;
  }
  const img: Img = {w: W, h: H, c: new Int32Array(W * H).fill(-1)};
  for (let i = 0; i < W * H; i++) {
    if (out[i] < 0) continue;
    const ramp = mat[i] === 2 ? S.hairRamp : S.skin;
    img.c[i] = backHit[i] && S.back ? (mat[i] === 2 ? S.back.hair : S.back.skin) : ramp[out[i]];
  }
  // the hair's own texture, in head space so it follows the head as it turns: combed styles a rung-down strand line
  // every few millimetres running back from the hairline; a bob's strands falling down its curve; curls and tousles as
  // clumps, each with its lit top and its shadowed underside
  const st = S.hair.style;
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const i = py * W + px;
    if (mat[i] !== 2 || out[i] <= 1 || out[i] === 5 || backHit[i]) continue;
    const X = hp[i * 3], Y = hp[i * 3 + 1], Z = hp[i * 3 + 2];
    let k = 0;
    if (st === 'curly' || st === 'tousled') {
      const cs = st === 'curly' ? 3.2 : 4.6;
      const cx = Math.floor(X / cs), cz = Math.floor(Z / cs), off = hh(cx, 7, cz) * cs;
      const cy = Math.floor((Y + off) / cs), fy = (Y + off) / cs - cy, fx = X / cs - cx;
      const r = hh(cx, cy, cz);
      if (fy > 0.74 && (st === 'curly' || r > 0.35) && Math.abs(fx - 0.5) < 0.42) k = -1; else if (fy < 0.25 && r > 0.55) k = 1;
    } else if (st === 'bob') {
      const a = Math.atan2(X, Z - (S.craniumZ ?? -3)) * 7;
      if (Y > (S.hair.line ?? -16) + 2 && Math.abs(a - Math.round(a)) < 0.12) k = -1;
      else if (Y <= (S.hair.line ?? -16) + 2 && Math.abs(X / 2.6 - Math.round(X / 2.6)) < 0.14) k = -1;
    } else {
      const u = X / 2.8 + Math.sin(Z / 7) * 0.4 + (st === 'side' ? Math.max(0, -Y - 20) * 0.04 : 0);
      if (Math.abs(u - Math.round(u)) < 0.11) k = -1;
    }
    if (k < 0) img.c[i] = S.hairRamp[Math.max(1, out[i] - 1)];
    else if (k > 0 && out[i] < 4) img.c[i] = S.hairRamp[out[i] + 1];
  }
  return {img, at: toScreen, mat, depth, tone: out};
};

// ================================================================== the face (drawn on the sculpt)
export type EyeShape = 'almond' | 'round' | 'narrow' | 'hooded' | 'deep' | 'lash';
export type EyeState = 'open' | 'half' | 'closed' | 'crinkle' | 'happy' | 'wide' | 'squint';
export type BrowStyle = 'straight' | 'arched' | 'heavy' | 'thin' | 'soft';
export type BrowState = 'level' | 'up' | 'worry' | 'knit' | 'one';
export type MouthShape = 'rest' | 'smile' | 'grin' | 'proud' | 'laugh' | 'worry' | 'flat' | 'A' | 'E' | 'O' | 'M';
export interface FaceSpec {
  eye: EyeShape; eyeW: number; eyeH: number; eyeTilt?: number;
  /** the iris's colour (a dark brown / blue-grey / green ring; the pupil is always N0) */
  iris?: number;
  brow: BrowStyle; browCol: number; browGap?: number;
  mouthW: number;
  /** lip colours (upper line, lower lip) for a painted mouth; default the skin's own */
  lip?: {line: number; lower: number};
  /** lines: 0 none, 1 the nasolabial fold, 2 + crow's feet and a forehead line, 3 + the eye bags and jowl */
  age?: 0 | 1 | 2 | 3;
  /** glasses: the frame's colour, a glint */
  glasses?: {col: number; glint?: number; round?: boolean};
  /** a stubble shadow (one tone down on the jaw), freckles */
  stubble?: boolean;
  /** dimples / a smile's laugh lines */
  laughLines?: boolean;
}
export interface FaceState { eye: EyeState; brow: BrowState; mouth: MouthShape; look?: -1 | 0 | 1 }

const setPx = (img: Img, x: number, y: number, c: number) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < img.w && y < img.h && img.c[y * img.w + x] >= 0) img.c[y * img.w + x] = c; };
const getPx = (img: Img, x: number, y: number) => { x = Math.round(x); y = Math.round(y); return x >= 0 && y >= 0 && x < img.w && y < img.h ? img.c[y * img.w + x] : -1; };

/**
 * One eye, drawn procedurally at (cx, cy) (its centre), `w` wide: `inner` = which end is toward the nose (-1 left,
 * +1 right). The upper lid is the dark line (a lash adds weight and a flick at the outer corner); the opening is the
 * white; the iris and pupil sit toward the look; the lower lid is a skin crease a rung down; a happy eye is a closed
 * arc; a squint a slit. `skin` is the ramp the lids sit in.
 */
const drawEye = (img: Img, cx: number, cy: number, w: number, h: number, inner: -1 | 1, st: EyeState, o: {shape: EyeShape; skin: number[]; iris: number; tilt: number; look: number; far: boolean; key: 'L' | 'R'}) => {
  const n = Math.max(3, Math.round(w));
  const x0 = Math.round(cx - n / 2);
  let open = h, low = Math.max(1, Math.round(h * 0.55));
  if (st === 'half') open = Math.max(1, Math.round(h * 0.5));
  if (st === 'wide') { open = h + 1; low = low + 1; }
  if (o.shape === 'narrow') { open = st === 'wide' ? Math.max(1, h - 1) : 1; low = st === 'wide' ? 1 : 0; }
  if (st === 'squint') { open = o.shape === 'narrow' ? 0 : 1; low = 0; }
  if (st === 'crinkle') low = 0;
  const lidC = PAL.N0, white = o.shape === 'deep' ? PAL.P1 : PAL.P1, whiteSh = o.skin[3];
  const lowerC = o.skin[1], creaseC = o.skin[2];
  const t0 = (i: number) => (i + 0.5) / n;
  // per column: the upper lid's height (rows above the centre line) and the lower lid's depth
  const up = (i: number) => {
    const t = t0(i), tt = inner < 0 ? t : 1 - t; // tt: 0 at the inner corner
    const arch = Math.pow(Math.sin(Math.PI * Math.min(1, tt * 0.92 + 0.04)), o.shape === 'round' ? 0.6 : 0.85);
    return open * arch + o.tilt * (tt - 0.5);
  };
  const dn = (i: number) => { const t = t0(i), tt = inner < 0 ? t : 1 - t; return low * Math.pow(Math.sin(Math.PI * tt), 1.1); };
  if (st === 'closed' || st === 'happy') {
    for (let i = 0; i < n; i++) {
      const t = t0(i), tt = inner < 0 ? t : 1 - t;
      const arc = st === 'happy' ? Math.round(Math.sin(Math.PI * tt) * 2) : 0;
      setPx(img, x0 + i, cy - arc + (st === 'happy' ? 1 : 0), lidC);
      if (st === 'happy' && tt > 0.15 && tt < 0.85) setPx(img, x0 + i, cy - arc + 2, o.skin[4]);
      if (st === 'closed' && i > 0 && i < n - 1) setPx(img, x0 + i, cy + 1, o.skin[2]);
    }
    return;
  }
  // a squint's slit: the lids met, a dark line with the iris's glint of colour in it, the lower lid pushed up
  if (open === 0) {
    for (let i = 0; i < n; i++) {
      const t = t0(i), tt = inner < 0 ? t : 1 - t;
      const yy = Math.round(cy - o.tilt * (tt - 0.5) * 0.5);
      setPx(img, x0 + i, yy, lidC);
      if (tt > 0.1 && tt < 0.92) setPx(img, x0 + i, yy - 1, tt > 0.25 && tt < 0.85 ? lidC : creaseC);
      if (tt > 0.15 && tt < 0.9) setPx(img, x0 + i, yy + 1, lowerC);
      if (tt > 0.2 && tt < 0.8) setPx(img, x0 + i, yy + 2, o.skin[4]);
    }
    const ixs = Math.round(cx + o.look);
    setPx(img, ixs, Math.round(cy), o.iris);
    return;
  }
  // the iris: centred, darted toward the look (and toward the face's turn: the head looks camera-left)
  const irisR = Math.max(1, Math.min(open + low, Math.round(n * 0.22)));
  const ix = cx + o.look * Math.max(1, Math.round(n * 0.12)) - (o.far ? 0 : 0.5);
  for (let i = 0; i < n; i++) {
    const u = up(i), d = dn(i);
    const top = Math.round(cy - u), bot = Math.round(cy + d);
    for (let y = top; y <= bot; y++) {
      const x = x0 + i;
      const inIris = open > 0 && (top === bot ? Math.abs(x - Math.round(ix)) <= Math.max(1, Math.round(n * 0.22)) : Math.abs(x - ix) <= irisR - (y === top || y === bot ? 1 : 0));
      setPx(img, x, y, inIris ? (Math.abs(x - ix) < irisR * 0.55 && y > top ? PAL.N0 : o.iris) : y === top + 0 && open > 1 ? whiteSh : white);
    }
    // the upper lid line (2 px on a lash, or at the outer third of a hooded eye)
    setPx(img, x0 + i, top - 1, lidC);
    const t = t0(i), tt = inner < 0 ? t : 1 - t;
    if ((o.shape === 'lash' && tt > 0.25) || (o.shape === 'hooded' && tt > 0.2) || (o.shape === 'deep') || (o.shape === 'narrow' && tt > 0.1 && tt < 0.9)) setPx(img, x0 + i, top - 2, o.shape === 'lash' || o.shape === 'narrow' ? lidC : creaseC);
    // the lower lid: a skin crease (a lash line on a lash eye's outer half)
    if (st !== 'crinkle') setPx(img, x0 + i, bot + 1, o.shape === 'lash' && tt > 0.55 ? o.skin[0] : lowerC);
    else { setPx(img, x0 + i, bot + 1, lowerC); setPx(img, x0 + i, bot + 2, o.skin[4]); }
  }
  // the glint, on the key side of the pupil, one pixel
  if (open > 1 && !o.far) setPx(img, ix + (o.key === 'L' ? -1 : 1), cy - Math.max(0, open - 2), PAL.W9);
  // a lash's flick at the outer corner
  if (o.shape === 'lash') { const ox2 = inner < 0 ? x0 + n : x0 - 1; setPx(img, ox2, Math.round(cy - up(inner < 0 ? n - 1 : 0)) - 1, lidC); setPx(img, ox2 + (inner < 0 ? 1 : -1), Math.round(cy - up(inner < 0 ? n - 1 : 0)) - 2, lidC); }
  // the lid's crease above (hooded: close over the lid; almond: a faint line)
  if (o.shape !== 'narrow' && o.shape !== 'lash' && !o.far && st !== 'squint') for (let i = 1; i < n - 1; i++) { const tt = inner < 0 ? t0(i) : 1 - t0(i); if (tt > 0.3 && tt < 0.9) setPx(img, x0 + i, Math.round(cy - up(i)) - (o.shape === 'hooded' ? 2 : 3), creaseC); }
};
/** a brow: a band from the inner end to the outer end, its own weight and arch, moved by the expression */
const drawBrow = (img: Img, cx: number, cy: number, w: number, inner: -1 | 1, style: BrowStyle, st: BrowState, col: number, near: boolean, flip: boolean) => {
  const n = Math.max(3, Math.round(w));
  const x0 = Math.round(cx - n / 2);
  const th = style === 'heavy' ? 3 : style === 'thin' ? 1 : 2;
  const raise = st === 'up' || (st === 'one' && flip) ? 2 : 0;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, tt = inner < 0 ? t : 1 - t; // 0 at the inner end
    let y = cy - raise;
    if (style === 'arched' || style === 'thin') y -= Math.round(Math.sin(Math.PI * Math.min(1, tt * 1.15)) * 2);
    else if (style === 'soft') y -= Math.round(Math.sin(Math.PI * tt) * 1);
    else y -= tt > 0.3 && tt < 0.8 ? 1 : 0;
    if (st === 'worry') y -= Math.round((1 - tt) * 3) - 1;
    if (st === 'knit') y += Math.round((1 - tt) * 2) - (tt > 0.6 ? 1 : 0);
    const thick = Math.max(1, th - (tt > 0.85 ? 1 : 0) - (style !== 'heavy' && tt < 0.1 ? 0 : 0));
    for (let k = 0; k < thick; k++) setPx(img, x0 + i, y + k, k === thick - 1 && thick > 1 ? stepColor(col, 1) : col);
  }
  void near;
};
/** the mouth at (cx, cy), `w` wide (its near half a little longer: the 3/4 turn) */
const drawMouth = (img: Img, cx: number, cy: number, w: number, m: MouthShape, o: {skin: number[]; lip?: {line: number; lower: number}; nearRight: boolean}) => {
  const n = Math.max(4, Math.round(w));
  const x0 = Math.round(cx - n / 2);
  const line = o.lip?.line ?? PAL.S0, lower = o.lip?.lower ?? o.skin[2], dark = PAL.N0, teeth = PAL.P2;
  const s = (i: number, y: number, c: number) => setPx(img, x0 + i, cy + y, c);
  const curve = (i: number, amt: number) => { const t = (i + 0.5) / n; return Math.round(-amt * Math.pow(Math.abs(2 * t - 1), 2)); };
  switch (m) {
    case 'rest': case 'flat': case 'M': {
      for (let i = 0; i < n; i++) s(i, 0, line);
      for (let i = 1; i < n - 1; i++) if (i > n * 0.2 && i < n * 0.8) s(i, m === 'M' ? 2 : 1, lower);
      if (m === 'M') for (let i = 1; i < n - 1; i++) s(i, 1, stepColor(line, 1));
      if (o.lip) for (let i = 2; i < n - 2; i++) s(i, -1, stepColor(o.lip.lower, -1));
      break;
    }
    case 'smile': case 'proud': {
      // the line, its corners lifted a pixel (the proud one only on the near side), the lower lip's light under it
      for (let i = 0; i < n; i++) {
        const edge = i === 0 || i === n - 1, near = o.nearRight ? i >= n / 2 : i < n / 2;
        const lift = edge && (m === 'smile' || near) ? -1 : 0;
        s(i, lift, line);
      }
      if (m === 'smile') { s(-1, -2, o.skin[1]); s(n, -2, o.skin[1]); } else s(o.nearRight ? n : -1, -2, o.skin[1]);
      for (let i = 2; i < n - 2; i++) s(i, 1, o.lip ? o.lip.lower : o.skin[3]);
      if (o.lip) for (let i = 2; i < n - 2; i++) s(i, -1, stepColor(o.lip.lower, -1));
      break;
    }
    case 'grin': case 'E': {
      for (let i = 0; i < n; i++) s(i, curve(i, m === 'grin' ? 2 : 1), line);
      for (let i = 1; i < n - 1; i++) { s(i, 1 + (m === 'grin' ? curve(i, 1) : 0), teeth); s(i, 2 + (m === 'grin' ? curve(i, 1) : 0), i > 1 && i < n - 2 ? dark : line); }
      for (let i = 2; i < n - 2; i++) s(i, 3, lower);
      break;
    }
    case 'laugh': case 'A': {
      const open = m === 'laugh' ? 4 : 3;
      for (let i = 0; i < n; i++) s(i, curve(i, m === 'laugh' ? 2 : 0), line);
      for (let i = 1; i < n - 1; i++) s(i, 1, teeth);
      for (let y = 2; y < open + 1; y++) for (let i = 1 + (y >= open ? 1 : 0); i < n - 1 - (y >= open ? 1 : 0); i++) s(i, y, y === open && i > n * 0.3 && i < n * 0.7 && m === 'laugh' ? PAL.R2 : dark);
      for (let i = 2; i < n - 2; i++) s(i, open + 1, line);
      for (let i = 3; i < n - 3; i++) s(i, open + 2, lower);
      break;
    }
    case 'O': {
      const ow = Math.max(3, Math.round(n * 0.5)), xo = Math.round((n - ow) / 2);
      for (let i = xo; i < xo + ow; i++) { s(i, 0, line); s(i, 4, line); }
      for (let y = 1; y < 4; y++) { s(xo - 1, y, line); s(xo + ow, y, line); for (let i = xo; i < xo + ow; i++) s(i, y, dark); }
      for (let i = xo; i < xo + ow; i++) s(i, 5, lower);
      break;
    }
    case 'worry': {
      for (let i = 1; i < n - 1; i++) s(i, -curve(i, 1) - 1, line);
      s(0, 0, line); s(n - 1, 0, line);
      for (let i = 2; i < n - 2; i++) s(i, 1, lower);
      break;
    }
  }
};

export interface FaceAnchors { eyeN: [number, number]; eyeF: [number, number]; mouth: [number, number]; nose: [number, number]; ear: [number, number]; chin: [number, number]; brow: [number, number]; crown: [number, number] }
/** where the face's landmarks land in the frame for a sculpt (the near eye is the one on the camera's right) */
export const faceAnchors = (sc: Sculpt, S: HeadSpec3): FaceAnchors => {
  const ez = 16.5, by = (S.browY ?? -6) - 0.5;
  const p = (v: V3): [number, number] => { const r = sc.at(v); return [r[0], r[1]]; };
  return {
    eyeN: p([S.eyeX, 0, ez]), eyeF: p([-S.eyeX, 0, ez]), brow: p([0, by, ez + 2]),
    mouth: p([0.8, S.mouthY, (S.muzzle ?? 14) + 4.5]), nose: p([0, S.nose.tipY, 16 + S.nose.proj]),
    ear: p([S.cranium[0], (S.ear ?? {y: 3}).y, -3]), chin: p([0, S.chinY, S.chinZ]),
    crown: p([4, (S.craniumY ?? -8) - S.cranium[1] - (S.hair.thick ?? 3) - 1, (S.craniumZ ?? -3) - 2]),
  };
};
/** paint the face's features on a copy of the sculpt */
export const drawFace = (sc: Sculpt, S: HeadSpec3, F: FaceSpec, st: FaceState, pose: HeadPose = {}): Img => {
  const img: Img = {w: sc.img.w, h: sc.img.h, c: new Int32Array(sc.img.c)};
  const A = faceAnchors(sc, S);
  const yaw = S.yaw + (pose.turn ?? 0);
  // foreshortening: the near eye at nearly its full width, the far eye narrower the further it turns away
  const fN = Math.max(0.55, Math.cos(rad(yaw - 18))), fF = Math.max(0.25, Math.cos(rad(yaw + 22)));
  const keyL = (S.key ?? [-0.8, -0.38, 0.48])[0] < 0 ? 'L' : 'R';
  const iris = F.iris ?? PAL.B3;
  const tilt = F.eyeTilt ?? 0;
  const look = st.look ?? 0;
  const eyeH = F.eyeH;
  // visibility: is the landmark's surface the one the camera sees (not hidden behind the nose or the hair)?
  const vis = (pt: [number, number], z: number) => { const i = Math.round(pt[1]) * img.w + Math.round(pt[0]); return i >= 0 && i < img.c.length && Math.abs(sc.depth[i] - z) < 6 && sc.mat[i] === 1; };
  const zN = sc.at([S.eyeX, 0, 16.5])[2], zF = sc.at([-S.eyeX, 0, 16.5])[2];
  const sk = S.skin;
  // the lines first (under the features): the nasolabial fold, crow's feet, the forehead, eye bags, the jowl
  const age = F.age ?? 0;
  const line = (a: V3, b: V3, c: number) => {
    const pa = sc.at(a), pb = sc.at(b), n = Math.max(1, Math.round(Math.hypot(pb[0] - pa[0], pb[1] - pa[1])));
    for (let k = 0; k <= n; k++) { const x = pa[0] + ((pb[0] - pa[0]) * k) / n, y = pa[1] + ((pb[1] - pa[1]) * k) / n; const i = Math.round(y) * img.w + Math.round(x); if (sc.mat[i] === 1 && sc.tone[i] >= 2) setPx(img, x, y, c); }
  };
  const smiling = st.mouth === 'smile' || st.mouth === 'grin' || st.mouth === 'laugh' || st.mouth === 'proud' || st.eye === 'crinkle' || st.eye === 'happy';
  if (age >= 1 || smiling || F.laughLines) {
    const w = S.nose.wing + 1.5, ty = S.nose.tipY + 1.5;
    const end = smiling ? S.mouthY - 2 : S.mouthY + (age >= 2 ? 2 : 0);
    line([w, ty, 16 + S.nose.proj - 6], [w + 2, end, (S.muzzle ?? 14) + 2], sk[2]);
    if (age >= 2 || smiling) line([-w, ty, 16 + S.nose.proj - 6], [-w - 2, end, (S.muzzle ?? 14) + 2], sk[age >= 2 ? 1 : 2]);
  }
  if (age >= 2 || st.eye === 'squint' || st.eye === 'happy' || F.eye === 'narrow' || (st.eye === 'crinkle' && age >= 1)) {
    const ex = S.eyeX + 5;
    line([ex, -1, 12], [ex + 2, -2, 10], sk[2]); line([ex, 1, 12], [ex + 2, 2, 10], sk[2]);
    if (age >= 2) line([ex - 0.5, 0, 12], [ex + 2.5, 0, 10], sk[2]);
  }
  if (age >= 2) { line([-6, -12, 18], [6, -12, 18], sk[2]); line([-4, -15, 17], [5, -15, 17], sk[2]); }
  if (age >= 3) { line([S.eyeX - 3, 3, 16], [S.eyeX + 2, 3, 15], sk[2]); line([S.jawW - 3, S.mouthY + 4, 8], [S.jawW - 4, S.mouthY + 8, 7], sk[1]); }
  if (F.stubble) for (let i = 0; i < img.c.length; i++) {
    if (sc.mat[i] !== 1 || sc.tone[i] < 1) continue;
    const y = Math.floor(i / img.w), x = i % img.w;
    const mY = A.mouth[1];
    if (y > mY - 3 && y < A.chin[1] + 2 && x > A.chin[0] - 14 && x < A.ear[0] - 4 && ((x + y) & 1)) img.c[i] = stepColor(img.c[i], -1);
  }
  // the eyes
  const wN = F.eyeW * fN, wF = F.eyeW * fF;
  const eyeO = {shape: F.eye, skin: sk, iris, tilt, look, key: keyL as 'L' | 'R'};
  if (vis([A.eyeN[0], A.eyeN[1]], zN) || true) drawEye(img, A.eyeN[0], A.eyeN[1], wN, eyeH, -1, st.eye, {...eyeO, far: false});
  if (wF >= 2.5 && vis([A.eyeF[0], A.eyeF[1]], zF)) drawEye(img, A.eyeF[0], A.eyeF[1], wF, eyeH, 1, st.eye, {...eyeO, far: true});
  // the brows
  const bgap = F.browGap ?? 4;
  const bN = sc.at([S.eyeX + 0.5, (S.browY ?? -6) - bgap + 3.5, 18]), bF = sc.at([-S.eyeX - 0.5, (S.browY ?? -6) - bgap + 3.5, 18]);
  drawBrow(img, bN[0], bN[1], wN + 3, -1, F.brow, st.brow, F.browCol, true, false);
  if (wF >= 2.5) drawBrow(img, bF[0], bF[1], wF + 2, 1, F.brow, st.brow === 'one' ? 'level' : st.brow, F.browCol, false, true);
  // the nostril: on the near wing's underside
  const nos = sc.at([S.nose.wing - 1.2, S.nose.tipY + 1.6, 16 + S.nose.proj - 4]);
  setPx(img, nos[0], nos[1], sk[0]); setPx(img, nos[0] + 1, nos[1], sk[1]);
  // the mouth
  const mw = F.mouthW * Math.max(0.6, Math.cos(rad(yaw * 0.6)));
  drawMouth(img, A.mouth[0], A.mouth[1] + (pose.jaw ? 0 : 0), mw, st.mouth, {skin: sk, lip: F.lip, nearRight: true});
  // glasses: the near lens round the near eye, the far lens foreshortened, the bridge, the arm back to the ear
  if (F.glasses) {
    const g = F.glasses.col;
    const lens = (cx: number, cy: number, w: number, h: number, glint: boolean) => {
      const x0 = Math.round(cx - w / 2 - 2), x1 = Math.round(cx + w / 2 + 1), y0 = Math.round(cy - h - 3), y1 = Math.round(cy + h + 2);
      for (let x = x0; x <= x1; x++) { if (!(F.glasses!.round && (x === x0 || x === x1))) { setPx(img, x, y0, g); setPx(img, x, y1, g); } }
      for (let y = y0 + 1; y < y1; y++) { setPx(img, x0, y, g); setPx(img, x1, y, g); }
      if (glint && F.glasses!.glint !== undefined) { setPx(img, x1 - 2, y0 + 1, F.glasses!.glint); setPx(img, x1 - 3, y0 + 2, F.glasses!.glint); }
      return [x0, x1, y0] as const;
    };
    const n = lens(A.eyeN[0], A.eyeN[1], wN, eyeH, true);
    if (wF >= 2.5) { const f = lens(A.eyeF[0], A.eyeF[1], wF, eyeH, false); for (let x = f[1]; x <= n[0]; x++) setPx(img, x, n[2] + 2, g); }
    const ear = A.ear;
    const n1 = n[1], ny = n[2] + 1, steps = Math.max(1, Math.round(ear[0] - n1));
    for (let k = 0; k <= steps; k++) { const x = n1 + k, y = ny + ((ear[1] - 6 - ny) * k) / steps; const i = Math.round(y) * img.w + Math.round(x); if (sc.mat[i] === 1 || sc.mat[i] === 3) setPx(img, x, y, g); }
  }
  return img;
};
