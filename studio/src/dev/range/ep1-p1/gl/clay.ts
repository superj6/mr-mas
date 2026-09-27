// MR. MAS — range E1-P1 (1.A): CLOD as a stop-motion puppet, built from Prototype 3's clay kit
// (dev/range/p3/gl/clod.ts, imported read-only for its clayNormal; the forms are re-made here so they can be posed).
// What makes it a puppet rather than CG with a clay texture:
//   - one pushed, asymmetric body; thumb dents with raised lips and dragged smears pressed INTO the geometry; the
//     thumbprint whorls and tool drag in a normal map. All of these are PINNED: the same on every drawing.
//   - the pose is bent like an armature under clay (a soft bend at the waist, a nod at the neck), never a joint.
//   - the boil: four replacement SURFACES (the fine grain, the mottling, a hair of lumpiness) swapped on 2s while the
//     prints stay put, the way an animator's handling shifts a clay surface between exposures.
//   - three replacement MOUTHS pressed into the face (a closed smile, a grin, an open 'ah'), never morphs.
//   - the potter's wheel in its chest turns in eighths (the fleck on its rim and the groove in the thrown lump read it).
import {THREE, Any, h01} from '../../p3/gl/kit';
import {clayNormal} from '../../p3/gl/clod';
// @ts-ignore
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {POSES, Pose} from './cels';

const vnoise = (x: number, y: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const g = (i: number, j: number) => h01(i, j, s);
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return (g(xi, yi) * (1 - u) + g(xi + 1, yi) * u) * (1 - v) + (g(xi, yi + 1) * (1 - u) + g(xi + 1, yi + 1) * u) * v;
};
const vnoiseT = (x: number, y: number, per: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const g = (i: number, j: number) => h01(((i % per) + per) % per, ((j % per) + per) % per, s);
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return (g(xi, yi) * (1 - u) + g(xi + 1, yi) * u) * (1 - v) + (g(xi, yi + 1) * (1 - u) + g(xi + 1, yi + 1) * u) * v;
};

/** the boil's grain: a fine, tileable clay grain + soft lumps (no prints: those live in the pinned map) */
const grainNormal = (seed: number) => {
  const n = 512, hf = new Float32Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) hf[y * n + x] = (vnoiseT(x / 32, y / 32, 16, seed) - 0.5) * 0.9 + (vnoiseT(x / 9, y / 9, 57, seed + 1) - 0.5) * 0.3 + (vnoiseT(x / 3, y / 3, 171, seed + 2) - 0.5) * 0.08;
  const data = new Uint8Array(n * n * 4);
  const H = (x: number, y: number) => hf[((y + n) % n) * n + ((x + n) % n)];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const dx = (H(x + 1, y) - H(x - 1, y)) * 2.0, dy = (H(x, y + 1) - H(x, y - 1)) * 2.0, l = Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
    data[i] = (-dx / l * 0.5 + 0.5) * 255; data[i + 1] = (dy / l * 0.5 + 0.5) * 255; data[i + 2] = (1 / l * 0.5 + 0.5) * 255; data[i + 3] = 255;
  }
  const t = new THREE.DataTexture(data, n, n, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  return t;
};

export interface ClayTex { prints: Any; grain: Any }
export const makeClayTex = (): ClayTex => ({prints: clayNormal(3), grain: grainNormal(17)});

/** the four surfaces: where the grain sits (a whole-map offset), how the mottling falls, a hair of lump */
const SURFACES = [
  {off: [0.0, 0.0, 0.0], mott: 101, lump: 201},
  {off: [0.37, 0.11, 0.53], mott: 102, lump: 202},
  {off: [0.71, 0.61, 0.23], mott: 103, lump: 203},
  {off: [0.19, 0.83, 0.77], mott: 104, lump: 204},
];

export type ClayMode = 'lit' | 'night' | 'id';
/** clay: the colour (with the hands' marks in the vertex colours); the pinned prints and the surface's grain mapped
 *  TRIPLANAR in the puppet's rest space (so the marks ride the bend with the clay and never swim) */
const clayMat = (hex: number, tex: ClayTex, surf: number, o: {scale?: number; rough?: number; str?: number; grainStr?: number; cc?: number} = {}) => {
  const {scale = 6, rough = 0.62, str = 1.5, grainStr = 0.9, cc = 0.04} = o;
  // plasticine, not felt: no sheen lobe (sheen is a cloth model and read as a plush toy at 2x), a waxy clearcoat
  // that the thumbprints and tool drag break up, so the prints catch the can as highlights
  const m = new THREE.MeshPhysicalMaterial({color: new THREE.Color(hex), roughness: rough, vertexColors: true, clearcoat: cc, clearcoatRoughness: cc > 0.5 ? 0.18 : 0.42});
  const off = SURFACES[surf].off;
  m.onBeforeCompile = (sh: Any) => {
    sh.uniforms.tPrint = {value: tex.prints}; sh.uniforms.tGrain = {value: tex.grain};
    sh.uniforms.uScale = {value: scale}; sh.uniforms.uStr = {value: str}; sh.uniforms.uGStr = {value: grainStr};
    sh.uniforms.uOff = {value: new THREE.Vector3(off[0], off[1], off[2])};
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 restP; attribute vec3 restN; varying vec3 vOP; varying vec3 vON; varying vec3 vM0; varying vec3 vM1; varying vec3 vM2;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vOP = restP; vON = restN; mat3 mv3 = mat3(modelViewMatrix); vM0 = mv3[0]; vM1 = mv3[1]; vM2 = mv3[2];');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D tPrint; uniform sampler2D tGrain; uniform float uScale; uniform float uStr; uniform float uGStr; uniform vec3 uOff; varying vec3 vOP; varying vec3 vON; varying vec3 vM0; varying vec3 vM1; varying vec3 vM2;\n'
      + 'vec3 triN(sampler2D t, vec3 p, vec3 n, float s, vec3 o){ vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z);'
      + ' vec3 tx = texture2D(t, p.zy + o.xy).xyz * 2.0 - 1.0, ty = texture2D(t, p.xz + o.yz).xyz * 2.0 - 1.0, tz = texture2D(t, p.xy + o.zx).xyz * 2.0 - 1.0;'
      + ' tx.xy *= s; ty.xy *= s; tz.xy *= s;'
      + ' tx = vec3(tx.xy + n.zy, abs(tx.z) * n.x); ty = vec3(ty.xy + n.xz, abs(ty.z) * n.y); tz = vec3(tz.xy + n.xy, abs(tz.z) * n.z);'
      + ' return normalize(tx.zyx * w.x + ty.xzy * w.y + tz.xyz * w.z); }')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        {
          vec3 n0 = normalize(vON);
          vec3 p = vOP * uScale;
          vec3 np = triN(tPrint, p + vec3(0.19, 0.37, 0.71), n0, uStr, vec3(0.0));      // the prints: pinned
          vec3 ng = triN(tGrain, p * 2.3, n0, uGStr, uOff);                            // the grain: this surface's
          vec3 no = normalize(np + ng - n0);
          // rest-space normal -> view space through the pose's rotation (carried per vertex: restN -> normal)
          vec3 vn = normalize(vNormal);
          vec3 axis = cross(n0, no);
          // rotate the posed normal by the same small tilt the maps give the rest normal
          float s = length(axis), c = dot(n0, no);
          vec3 k = s > 1e-5 ? axis / s : vec3(0.0, 0.0, 1.0);
          vec3 kv = normalize(mat3(vM0, vM1, vM2) * k);
          vec3 vnr = vn * c + cross(kv, vn) * s + kv * dot(kv, vn) * (1.0 - c);
          normal = normalize(vnr) * faceDirection;
        }`);
  };
  m.customProgramCacheKey = () => 'e1p1-clay';
  return m;
};

// ------------------------------------------------------------------ building the forms (rest pose)
const handPush = (g: Any, amp: number, seed: number, lean = 0) => {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = (vnoise(x * 26 + 3, y * 26 + z * 13, seed) - 0.5) * 2 + (vnoise(x * 60, y * 60 + z * 41, seed + 5) - 0.5) * 0.5;
    const r = Math.hypot(x, z) || 1;
    const k = 1 + (n * amp) / Math.max(r, 0.01);
    p.setXYZ(i, x * k + lean * y, y + n * amp * 0.4, z * k);
  }
  g.computeVertexNormals();
  return g;
};
const lathe = (pts: Array<[number, number]>, seg = 128) => {
  const c = new THREE.SplineCurve(pts.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0005), y)));
  const sp = c.getPoints(Math.max(24, pts.length * 6)).map((v: Any) => new THREE.Vector2(Math.max(v.x, 0.0005), v.y));
  return new THREE.LatheGeometry(sp, seg);
};
const ball = (r: number, sx = 1, sy = 1, sz = 1, seed = 0, amp = 0.0012) => { const g = new THREE.SphereGeometry(r, 48, 36); g.scale(sx, sy, sz); return handPush(g, amp, seed); };
const capsule = (r: number, len: number, seed: number) => handPush(new THREE.CapsuleGeometry(r, len, 12, 32), 0.0021, seed);

/** weld, mark (dents, smears: PINNED by the part's own seed), colour (mottling: by the SURFACE's seed) */
const finish = (g0: Any, seed: number, marks: number, surf: number, clean = false) => {
  let g = g0.index ? g0.toNonIndexed() : g0;
  g.deleteAttribute('uv'); g.deleteAttribute('normal');
  g = mergeVertices(g, 1e-5);
  g.computeVertexNormals();
  const p = g.attributes.position, nrm = g.attributes.normal, n = p.count;
  const P = (i: number) => [p.getX(i), p.getY(i), p.getZ(i)];
  const disp = new Float32Array(n), shade = new Float32Array(n);
  const dents = clean ? 0 : Math.round(24 * marks);
  for (let k = 0; k < dents; k++) {
    const c = P(Math.floor(h01(k, 1, seed) * n)), R = 0.008 + h01(k, 2, seed) * 0.011, dep = (0.0009 + h01(k, 3, seed) * 0.0014) * Math.min(1, marks);
    const el = 0.6 + h01(k, 4, seed) * 0.5, ang = h01(k, 5, seed) * Math.PI;
    for (let i = 0; i < n; i++) {
      const q = P(i), dx = q[0] - c[0], dy = q[1] - c[1], dz = q[2] - c[2];
      const u = (dx * Math.cos(ang) + dy * Math.sin(ang)) / R, v = (dy * Math.cos(ang) - dx * Math.sin(ang)) / (R * el), w2 = dz / R;
      const d2 = u * u + v * v + w2 * w2;
      if (d2 > 1.7) continue;
      const bowl = d2 < 1 ? -(1 - d2) * (1 - d2) : 0, lip = Math.exp(-Math.pow((Math.sqrt(d2) - 1.08) / 0.18, 2)) * 0.35;
      disp[i] += dep * (bowl + lip);
      shade[i] += bowl * 0.08 - lip * 0.05;
    }
  }
  const smears = clean ? 0 : Math.round(9 * marks);
  for (let k = 0; k < smears; k++) {
    const a = P(Math.floor(h01(k, 11, seed) * n)), b = P(Math.floor(h01(k, 12, seed) * n));
    const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (L < 0.01 || L > 0.07) continue;
    for (let i = 0; i < n; i++) {
      const q = P(i);
      const t = ((q[0] - a[0]) * (b[0] - a[0]) + (q[1] - a[1]) * (b[1] - a[1]) + (q[2] - a[2]) * (b[2] - a[2])) / (L * L);
      if (t < 0 || t > 1) continue;
      const cx = a[0] + (b[0] - a[0]) * t, cy = a[1] + (b[1] - a[1]) * t, cz = a[2] + (b[2] - a[2]) * t;
      const d = Math.hypot(q[0] - cx, q[1] - cy, q[2] - cz) / 0.006;
      if (d > 1.6) continue;
      const e = Math.sin(Math.PI * t);
      disp[i] -= 0.0009 * e * Math.max(0, 1 - d * d) * Math.min(1, marks);
      shade[i] += 0.05 * e * Math.max(0, 1 - d * d);
    }
  }
  const S = SURFACES[surf];
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const q = P(i);
    // the boil's hair of lumpiness: ~0.15 mm, this surface's own (the silhouette crawls a touch, as clay does)
    const lump = (vnoise(q[0] * 180 + S.lump, q[1] * 180 + q[2] * 97, S.lump) - 0.5) * 0.0003;
    const dd = disp[i] + lump;
    p.setXYZ(i, q[0] + nrm.getX(i) * dd, q[1] + nrm.getY(i) * dd, q[2] + nrm.getZ(i) * dd);
    // round 6: a clean part (the clipboard's page) takes no mottling and no grit: on the page they read as
    // "camouflage, a texture error" at full size
    const mott = clean ? 0 : (vnoise(q[0] * 40 + S.mott, q[1] * 40 + q[2] * 23, S.mott) - 0.5) * 0.08;
    const grit = !clean && h01(i, 7, seed) > 0.992 ? -0.12 : 0;
    const k = 1 - shade[i] + mott + grit;
    col[i * 3] = k; col[i * 3 + 1] = k; col[i * 3 + 2] = k;
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
};

// ------------------------------------------------------------------ the rest puppet: parts with a rig role
interface Part { geo: Any; mat: string; id: number; role: 'soft' | 'rigid' | 'wheel'; anchor?: number[]; arm?: boolean; marks?: number; clean?: boolean }
const RIG = {hipY: 0.075, neckY: 0.213, neckZ: 0.004, shoulder: [0.082, 0.168, 0.03]};
const bake = (g: Any, pos: number[], rot: number[] = [0, 0, 0]) => {
  const m = new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(rot[0], rot[1], rot[2])), new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(m);
  return g;
};

/** mouths: 2D shapes wrapped onto the face's cylinder (radius ~ the head's), dark clay set into the terracotta */
const FACE_R = 0.0555, MOUTH_Y = 0.245;
const wrap = (g: Any, zLift = 0) => {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const a = x / FACE_R, r = FACE_R + z + zLift;
    p.setXYZ(i, Math.sin(a) * r, y + MOUTH_Y, Math.cos(a) * r);
  }
  g.computeVertexNormals();
  return g;
};
const mouthParts = (m: 0 | 1 | 2, seed: number): Part[] => {
  const out: Part[] = [];
  if (m === 0) {
    // the closed smile: a pressed line of dark clay, a small lift at its corners
    const t = new THREE.TorusGeometry(0.011, 0.00135, 8, 40, Math.PI * 0.72);
    t.rotateZ(Math.PI + Math.PI * 0.14);
    t.translate(0, 0.0085, 0);
    out.push({geo: wrap(t, -0.0003), mat: 'dark', id: 2, role: 'rigid'});
  } else {
    // an opening: a dark hollow (its floor set back into the head), a terracotta lip rolled round it
    const sh = new THREE.Shape();
    const w = m === 1 ? 0.0125 : 0.0092, top = m === 1 ? 0.0022 : 0.0052, bot = m === 1 ? -0.0052 : -0.0082;
    const N = 28;
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      const x = Math.cos(a) * w;
      const y = Math.sin(a) > 0 ? Math.sin(a) * top : Math.sin(a) * -bot;
      if (i === 0) sh.moveTo(x, y); else sh.lineTo(x, y);
    }
    const hollow = new THREE.ExtrudeGeometry(sh, {depth: 0.0016, bevelEnabled: true, bevelThickness: 0.0006, bevelSize: 0.0006, bevelSegments: 2, curveSegments: 24});
    hollow.translate(0, 0, -0.0012);
    out.push({geo: wrap(hollow), mat: 'mouth', id: 2, role: 'rigid'});
    // the lip: a thin roll along the outline
    const pts: Any[] = [];
    for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * (w + 0.0012), (Math.sin(a) > 0 ? Math.sin(a) * (top + 0.0011) : Math.sin(a) * -(bot - 0.0011)), 0.0004)); }
    const lip = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 64, 0.0011, 8, true);
    out.push({geo: wrap(handPush(lip, 0.0002, seed + 70)), mat: 'terracotta', id: 1, role: 'rigid'});
    if (m === 2) { // the tongue, a small dark-red lump at the bottom of the 'ah'
      const tg = ball(0.0048, 1.3, 0.5, 0.6, seed + 71, 0.0002); tg.translate(0, -0.0052, 0.0006);
      out.push({geo: wrap(tg), mat: 'tongue', id: 2, role: 'rigid'});
    }
  }
  return out;
};

/** the replacement lids: a pad of terracotta pressed over the bead (half: its upper half; shut: all of it, with a
 *  dark crease pressed along the lid's lower edge, the classic clay "closed eye") */
const lidParts = (lid: 0 | 1 | 2, seed: number): Part[] => {
  if (!lid) return [];
  const out: Part[] = [];
  for (const s of [-1, 1]) {
    const up = lid === 1 ? 0.0042 : 0.0006;
    const g = ball(0.0074, 1.05, lid === 1 ? 0.62 : 1.08, 0.8, seed + 80 + s, 0.0002);
    out.push({geo: bake(g, [s * 0.0145, 0.263 + up, 0.0538]), mat: 'terracotta', id: 1, role: 'rigid', anchor: [0, 0.25, 0.05], marks: 0});
    if (lid === 2) {
      const t = new THREE.TorusGeometry(0.0056, 0.00085, 6, 24, Math.PI * 0.8);
      t.rotateZ(Math.PI + Math.PI * 0.1);
      out.push({geo: bake(t, [s * 0.0145, 0.2645, 0.0605], [-0.18, s * 0.22, 0]), mat: 'dark', id: 2, role: 'rigid', anchor: [0, 0.25, 0.05], marks: 0});
    }
  }
  return out;
};

const buildParts = (seed: number, mouth: 0 | 1 | 2, lid: 0 | 1 | 2 = 0): Part[] => {
  const parts: Part[] = [];
  const add = (geo: Any, mat: string, id: number, role: Part['role'], anchor?: number[], arm = false) => parts.push({geo, mat, id, role, anchor, arm});
  const bodyG = handPush(lathe([[0.0005, 0.045], [0.05, 0.047], [0.07, 0.06], [0.08, 0.09], [0.079, 0.12], [0.072, 0.15], [0.06, 0.18], [0.048, 0.2], [0.044, 0.212],
    [0.05, 0.222], [0.056, 0.24], [0.056, 0.26], [0.05, 0.28], [0.036, 0.296], [0.018, 0.304], [0.0005, 0.306]]), 0.0035, seed, 0.02);
  {
    const q = bodyG.attributes.position;
    for (let i = 0; i < q.count; i++) {
      const x = q.getX(i), y = q.getY(i), z = q.getZ(i), r = Math.hypot(x, z) || 1;
      const ang = Math.atan2(z, x), br = Math.max(0, vnoise(ang * 2.2 + 3, 1.5, seed + 4) - 0.35) / 0.65;
      const g = -0.0011 * br * Math.exp(-Math.pow((y - 0.213) / 0.004, 2));
      q.setXYZ(i, x + (x / r) * g, y, z + (z / r) * g);
    }
  }
  // the niche for the potter's wheel: the chest pressed in with a thumb (round 6: a shallow bowl, 5 mm: at 9 mm
  // its dark back and the wheel's pale crescent read as "a hole or a wound" at phone size)
  {
    const q = bodyG.attributes.position;
    for (let i = 0; i < q.count; i++) {
      const x = q.getX(i), y = q.getY(i), z = q.getZ(i);
      if (z <= 0) continue;
      const r = Math.hypot(x, y - 0.125) / 0.024;
      if (r >= 1) continue;
      const rr = Math.hypot(x, z) || 1, d = 0.005 * Math.sqrt(1 - r * r);
      q.setXYZ(i, x - (x / rr) * d, y, z - (z / rr) * d);
    }
  }
  add(bodyG, 'terracotta', 1, 'soft');
  (bodyG as Any).userData = {marks: 1.4};
  for (const s of [-1, 1]) {
    add(bake(capsule(0.024, 0.028, seed + s), [s * 0.036, 0.03, 0.002]), 'terracotta', 1, 'rigid', [s * 0.036, 0.03, 0.002]);
    add(bake(ball(0.028, 1, 0.55, 1.25, seed + 7 + s), [s * 0.038, 0.012, 0.012]), 'terracotta', 1, 'rigid', [s * 0.038, 0.012, 0.012]);
  }
  add(bake(capsule(0.018, 0.075, seed + 11), [-0.078, 0.145, 0.006], [-0.12, 0, -0.28]), 'terracotta', 1, 'rigid', [-0.074, 0.16, 0.006]);
  add(bake(ball(0.022, 1, 1.1, 0.95, seed + 12), [-0.093, 0.093, 0.016]), 'terracotta', 1, 'rigid', [-0.074, 0.16, 0.006]);
  add(bake(capsule(0.018, 0.07, seed + 13), [0.082, 0.14, 0.036], [-0.62, 0, 0.22]), 'terracotta', 1, 'rigid', RIG.shoulder, true);
  // the clipboard, gripped against the belly
  const clip = (g: Any) => bake(g, [0.058, 0.108, 0.082], [-0.3, 0.42, -0.06]);
  add(clip(handPush(new THREE.BoxGeometry(0.07, 0.09, 0.007, 20, 24, 3), 0.0011, seed + 20)), 'board', 3, 'rigid', RIG.shoulder, true);
  add(clip(bake(new THREE.BoxGeometry(0.058, 0.07, 0.0025, 16, 18, 2), [0.001, -0.006, 0.0045])), 'paper', 4, 'rigid', RIG.shoulder, true);
  parts[parts.length - 1].clean = true; parts[parts.length - 1].marks = 0;
  add(clip(bake(handPush(new THREE.BoxGeometry(0.032, 0.013, 0.011, 8, 5, 3), 0.0012, seed + 21), [0, 0.043, 0.006])), 'dark', 2, 'rigid', RIG.shoulder, true);
  // round 6: a checklist that reads as one: three bold rolled lines and a big tick (it was three hairlines on a
  // mottled page, "camouflage")
  const stroke = (a: number[], b: number[], r: number, mat: string, s2: number) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    add(clip(bake(capsule(r, Math.max(0.001, L - 2 * r), s2), [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.0068], [0, 0, Math.atan2(-dx, dy)])), mat, 2, 'rigid', RIG.shoulder, true);
  };
  for (let k = 0; k < 3; k++) { const y = 0.02 - k * 0.013, w = 0.036 - k * 0.008; stroke([-0.022, y], [-0.022 + w, y + (h01(k, 3, seed) - 0.5) * 0.002], 0.0024, 'dark', seed + 30 + k); }
  stroke([0.002, -0.021], [0.008, -0.029], 0.0027, 'tick', seed + 34);
  stroke([0.008, -0.029], [0.022, -0.011], 0.0027, 'tick', seed + 35);
  add(bake(ball(0.021, 0.9, 1.1, 1.0, seed + 14), [0.093, 0.1, 0.07]), 'terracotta', 1, 'rigid', RIG.shoulder, true);
  add(bake(ball(0.0085, 1.3, 0.8, 0.8, seed + 15, 0.0006), [0.084, 0.108, 0.094], [0, 0, 0.4]), 'terracotta', 1, 'rigid', RIG.shoulder, true);
  // the bow tie
  for (const s of [-1, 1]) {
    const lg = ball(0.013, 1.3, 0.85, 0.5, seed + 40 + s, 0.0022);
    const q = lg.attributes.position;
    for (let i = 0; i < q.count; i++) { const x = q.getX(i); const pinch = Math.exp(-Math.pow((x + s * 0.012) / 0.006, 2)); q.setXYZ(i, x, q.getY(i) * (1 - 0.45 * pinch), q.getZ(i) * (1 - 0.3 * pinch)); }
    add(bake(lg, [s * 0.016, 0.207, 0.049], [0, 0, s * 0.25 + (h01(s + 3, 1, seed) - 0.5) * 0.2]), 'dark', 2, 'rigid', [0, 0.207, 0.05]);
  }
  add(bake(ball(0.0068, 1.05, 1, 0.8, seed + 43, 0.0009), [0.0008, 0.2065, 0.0545]), 'dark', 2, 'rigid', [0, 0.207, 0.05]);
  // the potter's wheel in the chest: the pressed hollow, its dark back, the wheel and the thrown lump (they turn)
  add(bake(new THREE.TorusGeometry(0.024, 0.0045, 16, 64), [0, 0.125, 0.076], [-0.12, 0, 0]), 'terracotta', 1, 'rigid', [0, 0.125, 0.076]);
  add(bake(new THREE.CircleGeometry(0.023, 48), [0, 0.125, 0.0705], [-0.12, 0, 0]), 'hollow', 5, 'rigid', [0, 0.125, 0.076]);
  const wheelG = new THREE.CylinderGeometry(0.0165, 0.0175, 0.0045, 48);
  add(wheelG, 'wheel', 5, 'wheel', [0, 0.12, 0.077]);
  // round 6: the thrown lump is a POT (a belly, a neck, a lip), a shade lighter than CLOD, so the wheel reads as a
  // potter's wheel with work on it, not a dent
  add(lathe([[0.0005, 0], [0.0075, 0.0008], [0.0092, 0.005], [0.0078, 0.0095], [0.0055, 0.0125], [0.0062, 0.0145], [0.0005, 0.013]], 40), 'pot', 1, 'wheel', [0, 0.12, 0.077]);
  // the wheel's fleck (a dot of dark clay on its rim) and a thumb groove on the lump: the turn reads from these
  add(bake(ball(0.0026, 0.8, 1.1, 1.3, seed + 60, 0.0002), [0.0172, 0, 0]), 'dark', 2, 'wheel', [0, 0.12, 0.077]);
  add(bake(ball(0.0019, 0.7, 1.6, 0.9, seed + 61, 0.0001), [0.0062, 0.0065, 0]), 'dark', 2, 'wheel', [0, 0.12, 0.077]);
  // the face: two pressed eyes, and the mouth of the drawing
  // (glossy beads of dark clay, a little bigger than P3's so the face reads at 480 x 270; they catch the can)
  for (const s of [-1, 1]) { add(bake(ball(0.0066, 1, 1.15, 0.7, seed + 50 + s, 0.0003), [s * 0.0145, 0.263, 0.053]), 'eye', 2, 'rigid', [0, 0.25, 0.05]); parts[parts.length - 1].marks = 0; }
  for (const mp of mouthParts(mouth, seed)) { mp.anchor = [0, 0.25, 0.05]; mp.marks = 0; parts.push(mp); }
  parts.push(...lidParts(lid, seed));
  return parts;
};

// ------------------------------------------------------------------ posing
const smooth = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const rotAbout = (v: Any, pivot: Any, q: Any) => v.sub(pivot).applyQuaternion(q).add(pivot);
const qHead = (pz: Pose, w: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(pz.nod * w, (pz.turn ?? 0) * w, -pz.tilt * w, 'YXZ'));
/** the bow bends toward BOW_DIR (rad, in the puppet's own yaw): forward and to its left-front, i.e. toward Mario */
export const BOW_DIR = 0.45;
const BOW_AXIS = new THREE.Vector3(Math.cos(BOW_DIR), 0, -Math.sin(BOW_DIR));
const qLean = (pz: Pose, w: number) => new THREE.Quaternion().setFromAxisAngle(BOW_AXIS, pz.lean * w);
const qArm = (pz: Pose) => new THREE.Quaternion().setFromEuler(new THREE.Euler(-pz.arm, 0, 0));
const NECK = () => new THREE.Vector3(0, RIG.neckY, RIG.neckZ);
const HIP = () => new THREE.Vector3(0, RIG.hipY, 0);
/** the deformation at a rest point (soft parts: per vertex) */
const deformPoint = (v: Any, pz: Pose) => {
  const y = v.y;
  // the breath: the chest swells a few per cent round its middle (only the soft body takes it, under the lean)
  const br = pz.breath ?? 0;
  if (br) {
    const wc = Math.exp(-Math.pow((y - 0.135) / 0.045, 2));
    const s = 1 + 0.018 * br * wc;
    v.x *= s; v.z = v.z * s + 0.0012 * br * wc;
  }
  const wh = smooth(RIG.neckY - 0.012, RIG.neckY + 0.008, y);
  if (wh > 0) rotAbout(v, NECK(), qHead(pz, wh));
  const wl = smooth(RIG.hipY - 0.01, RIG.hipY + 0.045, y);
  if (wl > 0) rotAbout(v, HIP(), qLean(pz, wl));
  return v;
};
/** the rigid transform a part takes from its anchor (rotation + where the anchor goes) */
const rigidFor = (anchor: number[], pz: Pose, arm: boolean) => {
  const a = new THREE.Vector3(...anchor);
  const wh = smooth(RIG.neckY - 0.012, RIG.neckY + 0.008, a.y), wl = smooth(RIG.hipY - 0.01, RIG.hipY + 0.045, a.y);
  const q = new THREE.Quaternion();
  if (arm) q.premultiply(qArm(pz));
  if (wh > 0) q.premultiply(qHead(pz, wh));
  if (wl > 0) q.premultiply(qLean(pz, wl));
  const a2 = deformPoint(a.clone(), pz);
  return {q, a, a2};
};

export interface Puppet { group: Any; meshes: Any[] }
/** the wheel's tip toward the lens (rad about x): a level camera saw its head edge-on, so the turn and the thrown
 *  lump didn't read and the niche read as a hole; tipped ~40 degrees its head is an ellipse with the fleck on it */
const WHEEL_TILT = 0.95; // round 6: 0.7 -> 0.95, and the wheel sits 6 mm further out (the niche is shallower): its head is a grey disc, not a crescent
const MATS = (tex: ClayTex, surf: number, mode: ClayMode): Record<string, Any> => {
  if (mode === 'id') {
    // the part's code, flat, in the red channel (40 x id / 255, written linear: no colour management on a code)
    const b = (id: number) => new THREE.MeshBasicMaterial({color: new THREE.Color().setRGB((id * 40) / 255, 0, 0, THREE.LinearSRGBColorSpace)});
    return {terracotta: b(1), dark: b(2), eye: b(2), board: b(3), paper: b(4), wheel: b(5), hollow: b(5), mouth: b(2), tongue: b(2), tick: b(2), pot: b(1)};
  }
  return {
    terracotta: clayMat(0xb04e32, tex, surf, {scale: 5, rough: 0.52, str: 1.9, cc: 0.22}),
    dark: clayMat(0x2e3a4a, tex, surf, {scale: 11, rough: 0.5, str: 1.2, cc: 0.18}),
    eye: clayMat(0x1a202c, tex, surf, {scale: 14, rough: 0.32, str: 0.4, grainStr: 0.3, cc: 0.75}),
    board: clayMat(0xc9a27c, tex, surf, {scale: 9, rough: 0.72, str: 0.7, grainStr: 0.5}),
    paper: clayMat(0xe6dcc4, tex, surf, {scale: 12, rough: 0.85, str: 0.08, grainStr: 0.06}),
    tick: clayMat(0xa83a2c, tex, surf, {scale: 14, rough: 0.5, str: 0.4, cc: 0.15}),
    wheel: clayMat(0x7f8792, tex, surf, {scale: 12, rough: 0.5, str: 0.9, cc: 0.12}),
    hollow: clayMat(0x7a3322, tex, surf, {scale: 14, rough: 0.7, str: 0.8}),
    pot: clayMat(0xd28358, tex, surf, {scale: 7, rough: 0.5, str: 1.2, cc: 0.2}),
    mouth: clayMat(0x2a0f10, tex, surf, {scale: 14, rough: 0.5, str: 0.6}),
    tongue: clayMat(0x7a2a26, tex, surf, {scale: 14, rough: 0.45, str: 0.6}),
  };
};

const restCache = new Map<string, Part[]>();
/** One CLOD for one drawing: pose, mouth, surface, wheel. Returns a Group (front faces +z before its yaw). */
export const makePuppet = (tex: ClayTex, o: {pose: string; pz?: Pose; mouth: 0 | 1 | 2; surface: number; wheel: number; mode: ClayMode; lid?: 0 | 1 | 2}, seed = 7): Puppet => {
  const key = `${o.mouth}:${o.surface}:${o.lid ?? 0}`;
  let parts = restCache.get(key);
  if (!parts) {
    parts = buildParts(seed, o.mouth, o.lid ?? 0).map((p, i) => ({...p, geo: finish(p.geo, seed * 31 + i * 7, p.marks ?? (p.mat === 'terracotta' && p.role === 'soft' ? 1.4 : p.mat === 'terracotta' ? 0.45 : 0.15), o.surface, p.clean)}));
    restCache.set(key, parts);
  }
  const pz = o.pz ?? POSES[o.pose];
  const mats = MATS(tex, o.surface, o.mode);
  const G = new THREE.Group();
  const meshes: Any[] = [];
  const wheelQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -(o.wheel * Math.PI) / 4);
  const wheelTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(WHEEL_TILT, 0, 0));
  for (const part of parts) {
    const g = part.geo.clone();
    const pos = g.attributes.position, nrm = g.attributes.normal;
    // rest-space attributes for the pinned maps
    g.setAttribute('restP', pos.clone()); g.setAttribute('restN', nrm.clone());
    const v = new THREE.Vector3();
    if (part.role === 'soft') {
      for (let i = 0; i < pos.count; i++) { v.set(pos.getX(i), pos.getY(i), pos.getZ(i)); deformPoint(v, pz); pos.setXYZ(i, v.x, v.y, v.z); }
    } else {
      let pre: Any = null;
      if (part.role === 'wheel') {
        // the wheel's own turn about its axis (it sits tilted back in the chest hollow)
        const c = new THREE.Vector3(...part.anchor!);
        pre = (w: Any) => { w.applyQuaternion(wheelQ).applyQuaternion(wheelTilt).add(c); return w; };
      }
      const {q, a, a2} = rigidFor(part.anchor ?? [0, 0.1, 0], pz, !!part.arm);
      for (let i = 0; i < pos.count; i++) {
        v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
        if (pre) pre(v);
        v.sub(a).applyQuaternion(q).add(a2);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      if (pre) { // the wheel's rest attributes follow its turn, so its marks turn with it
        const rp = g.attributes.restP;
        for (let i = 0; i < rp.count; i++) { v.set(rp.getX(i), rp.getY(i), rp.getZ(i)); pre(v); rp.setXYZ(i, v.x, v.y, v.z); }
      }
    }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, mats[part.mat]);
    m.castShadow = true; m.receiveShadow = true;
    G.add(m); meshes.push(m);
  }
  return {group: G, meshes};
};
export const disposePuppet = (p: Puppet) => { for (const m of p.meshes) m.geometry.dispose(); };
