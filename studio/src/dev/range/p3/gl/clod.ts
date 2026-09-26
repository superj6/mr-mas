// MR. MAS — range/p3: CLOD in clay (Misanthropic's product, a polite clay golem): the turnaround still, and the kit
// 1.A, 7.A and 11.C build on. A puppet, not CG with a clay texture: every form is hand-pushed (low-frequency
// asymmetry, soft seams where parts were pressed on), the surface carries thumbprints and tool drag, and it is
// shot like a miniature (one big soft key, a warm fill, contact shadows on a paper sweep, a shallow lens).
//   terracotta #B8573A · a small bow tie · a clipboard · a tiny potter's wheel set into its chest
import {THREE, Any, h01} from './kit';
// @ts-ignore
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';

// ------------------------------------------------------------------ the clay surface
const vnoise = (x: number, y: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const g = (i: number, j: number) => h01(i, j, s);
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return (g(xi, yi) * (1 - u) + g(xi + 1, yi) * u) * (1 - v) + (g(xi, yi + 1) * (1 - u) + g(xi + 1, yi + 1) * u) * v;
};
/** height field: thumbprint whorls, tool drags, the lumps of hand-pressed clay; -> a normal map */
/** value noise that tiles over `per` cells (the triplanar map must tile, or its edge shows as a seam line) */
const vnoiseT = (x: number, y: number, per: number, s: number) => {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const g = (i: number, j: number) => h01(((i % per) + per) % per, ((j % per) + per) % per, s);
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return (g(xi, yi) * (1 - u) + g(xi + 1, yi) * u) * (1 - v) + (g(xi, yi + 1) * (1 - u) + g(xi + 1, yi + 1) * u) * v;
};
export const clayNormal = (seed = 1) => {
  const n = 1024, hf = new Float32Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) hf[y * n + x] = (vnoiseT(x / 64, y / 64, 16, seed) - 0.5) * 1.2 + (vnoiseT(x / 16, y / 16, 64, seed + 1) - 0.5) * 0.35 + (vnoiseT(x / 4, y / 4, 256, seed + 2) - 0.5) * 0.06;
  // thumbprints: ridged whorls, each an ellipse of concentric ridges, faded at its rim
  for (let k = 0; k < 90; k++) {
    const cx = h01(k, 1, seed) * n, cy = h01(k, 2, seed) * n, rx = 38 + h01(k, 3, seed) * 44, ry = rx * (0.6 + h01(k, 4, seed) * 0.3), a = h01(k, 5, seed) * Math.PI;
    const ca = Math.cos(a), sa = Math.sin(a), depth = 0.5 + h01(k, 6, seed) * 0.6;
    for (let j = -Math.ceil(rx); j <= Math.ceil(rx); j++)
      for (let i = -Math.ceil(rx); i <= Math.ceil(rx); i++) {
        const u = (i * ca + j * sa) / rx, v = (-i * sa + j * ca) / ry;
        const r = Math.hypot(u, v);
        if (r > 1) continue;
        const X = ((Math.round(cx + i) % n) + n) % n, Y = ((Math.round(cy + j) % n) + n) % n;
        const ridge = Math.cos(r * Math.PI * 2 * 7.5 + Math.atan2(v, u) * 0.35) * 0.5 + 0.5;
        const w = Math.pow(1 - r, 0.7) * depth;
        hf[Y * n + X] += (ridge - 0.5) * 0.14 * w - 0.25 * w * (1 - r); // the pad dents, the ridges print
      }
  }
  // tool drags: a few parallel scratch groups (a modelling tool pulled across)
  for (let k = 0; k < 14; k++) {
    const x0 = h01(k, 7, seed) * n, y0 = h01(k, 8, seed) * n, a = h01(k, 9, seed) * Math.PI, L = 120 + h01(k, 10, seed) * 200;
    const dx = Math.cos(a), dy = Math.sin(a);
    for (let t = 0; t < L; t += 0.5)
      for (let s = -6; s <= 6; s++) {
        const X = ((Math.round(x0 + dx * t - dy * s) % n) + n) % n, Y = ((Math.round(y0 + dy * t + dx * s) % n) + n) % n;
        const groove = Math.abs(s % 3) < 0.6 ? -0.09 : 0.02;
        hf[Y * n + X] += groove * Math.sin((t / L) * Math.PI);
      }
  }
  const data = new Uint8Array(n * n * 4);
  const H = (x: number, y: number) => hf[((y + n) % n) * n + ((x + n) % n)];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const dx = (H(x + 1, y) - H(x - 1, y)) * 2.2, dy = (H(x, y + 1) - H(x, y - 1)) * 2.2, l = Math.hypot(dx, dy, 1), i = (y * n + x) * 4;
    data[i] = (-dx / l * 0.5 + 0.5) * 255; data[i + 1] = (dy / l * 0.5 + 0.5) * 255; data[i + 2] = (1 / l * 0.5 + 0.5) * 255; data[i + 3] = 255;
  }
  const t = new THREE.DataTexture(data, n, n, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = true; t.colorSpace = THREE.NoColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  return t;
};

/** Clay: the colour (with the hands' own marks in the vertex colours), and the fine surface (thumbprints, tool drag)
 *  mapped TRIPLANAR in the puppet's own space, so there is no UV seam anywhere and every view shows the same marks. */
const clayMat = (hex: number, nmap: Any, scale = 7, rough = 0.62, str = 1.5) => {
  const m = new THREE.MeshPhysicalMaterial({color: new THREE.Color(hex), roughness: rough, sheen: 0.35, sheenRoughness: 0.55, sheenColor: new THREE.Color(1, 0.82, 0.7), vertexColors: true});
  m.onBeforeCompile = (sh: Any) => {
    sh.uniforms.tClay = {value: nmap}; sh.uniforms.uClayScale = {value: scale}; sh.uniforms.uClayStr = {value: str};
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vOP; varying vec3 vON; varying vec3 vM0; varying vec3 vM1; varying vec3 vM2;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n vOP = position; vON = normal; mat3 mv3 = mat3(modelViewMatrix); vM0 = mv3[0]; vM1 = mv3[1]; vM2 = mv3[2];');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D tClay; uniform float uClayScale; uniform float uClayStr; varying vec3 vOP; varying vec3 vON; varying vec3 vM0; varying vec3 vM1; varying vec3 vM2;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        {
          vec3 n = normalize(vON);
          vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z);
          vec3 p = vOP * uClayScale;
          vec3 tx = texture2D(tClay, p.zy + 0.19).xyz * 2.0 - 1.0, ty = texture2D(tClay, p.xz + 0.37).xyz * 2.0 - 1.0, tz = texture2D(tClay, p.xy + 0.71).xyz * 2.0 - 1.0;
          tx.xy *= uClayStr; ty.xy *= uClayStr; tz.xy *= uClayStr;
          tx = vec3(tx.xy + n.zy, abs(tx.z) * n.x); ty = vec3(ty.xy + n.xz, abs(ty.z) * n.y); tz = vec3(tz.xy + n.xy, abs(tz.z) * n.z);
          vec3 no = normalize(tx.zyx * w.x + ty.xzy * w.y + tz.xyz * w.z);
          normal = normalize(mat3(vM0, vM1, vM2) * no) * faceDirection;
        }`);
  };
  m.customProgramCacheKey = () => 'clay-tri';
  return m;
};

/** one clean surface: the lathe's seam and pole welded (no seam line over the head), normals recomputed, and the
 *  hands' marks pressed INTO the form: thumb dents with a raised lip, a few smears where a thumb dragged, and the
 *  colour of handled clay (darker in the dents where skin oil and dust sit, lighter where it was burnished) */
const finish = (g0: Any, seed: number, marks = 1, base = [1, 1, 1] as [number, number, number]) => {
  let g = g0.index ? g0.toNonIndexed() : g0;
  g.deleteAttribute('uv'); g.deleteAttribute('normal');
  g = mergeVertices(g, 1e-5);
  g.computeVertexNormals();
  const p = g.attributes.position, nrm = g.attributes.normal, n = p.count;
  const col = new Float32Array(n * 3);
  const P = (i: number) => [p.getX(i), p.getY(i), p.getZ(i)];
  const disp = new Float32Array(n), shade = new Float32Array(n);
  // the dents: centred on surface points of the form itself (so they sit on it, not float)
  const dents = Math.round(24 * marks);
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
  // smears: a thumb dragged across (a shallow groove fading at both ends)
  const smears = Math.round(9 * marks);
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
  for (let i = 0; i < n; i++) {
    const q = P(i);
    p.setXYZ(i, q[0] + nrm.getX(i) * disp[i], q[1] + nrm.getY(i) * disp[i], q[2] + nrm.getZ(i) * disp[i]);
    // handled clay: low mottling, the dents a touch darker, a few grains of grit
    const mott = (vnoise(q[0] * 40 + seed, q[1] * 40 + q[2] * 23, seed + 9) - 0.5) * 0.07;
    const grit = h01(i, 7, seed) > 0.992 ? -0.12 : 0;
    const k = 1 - shade[i] + mott + grit;
    col[i * 3] = base[0] * k; col[i * 3 + 1] = base[1] * k; col[i * 3 + 2] = base[2] * k;
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
};

/** push every vertex a little (hands, not a lathe): low-frequency lumps and a slight lean */
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
  // a smooth profile (Catmull-Rom through the hand-set points): no facets on the silhouette
  const c = new THREE.SplineCurve(pts.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0005), y)));
  const sp = c.getPoints(Math.max(24, pts.length * 6)).map((v: Any) => new THREE.Vector2(Math.max(v.x, 0.0005), v.y));
  return new THREE.LatheGeometry(sp, seg);
};
const ball = (r: number, sx = 1, sy = 1, sz = 1, seed = 0, amp = 0.0012) => { const g = new THREE.SphereGeometry(r, 64, 48); g.scale(sx, sy, sz); return handPush(g, amp, seed); };
const capsule = (r: number, len: number, seed: number) => handPush(new THREE.CapsuleGeometry(r, len, 16, 40), 0.0021, seed);

/** one CLOD (≈ 30 cm, a tabletop puppet): returns a Group; its front faces +z */
export const makeClod = (nmap: Any, seed: number) => {
  const G = new THREE.Group();
  const terracotta = clayMat(0xb8573a, nmap, 5, 0.6, 1.7);
  const dark = clayMat(0x2e3a4a, nmap, 11, 0.55, 1.2);
  const board = clayMat(0xc9a27c, nmap, 9, 0.72, 1.3);
  const paper = clayMat(0xe6d9bf, nmap, 12, 0.8, 0.9);
  const wheelM = clayMat(0x9a4630, nmap, 12, 0.6, 1.0);
  const mesh = (g: Any, m: Any, marks = 1) => { const o = new THREE.Mesh(finish(g, seed * 31 + G.children.length * 7, marks), m); o.castShadow = true; o.receiveShadow = true; return o; };
  // the body and head: one pushed form (a golem: big, soft, never sharp); where the head was pressed on, the join is
  // smoothed over with a thumb (a broken, shallow groove, not a ring)
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
  G.add(mesh(bodyG, terracotta, 1.4));
  // legs and feet
  for (const s of [-1, 1]) {
    const leg = mesh(capsule(0.024, 0.028, seed + s), terracotta, 0.4); leg.position.set(s * 0.036, 0.03, 0.002); G.add(leg);
    const foot = mesh(ball(0.028, 1, 0.55, 1.25, seed + 7 + s), terracotta, 0.5); foot.position.set(s * 0.038, 0.012, 0.012); G.add(foot);
  }
  // the left arm hangs, a mitten hand; the right arm comes forward and down to GRIP the clipboard's edge
  const armL = mesh(capsule(0.018, 0.075, seed + 11), terracotta, 0.4); armL.position.set(-0.078, 0.145, 0.006); armL.rotation.z = -0.28; armL.rotation.x = -0.12; G.add(armL);
  const handL = mesh(ball(0.022, 1, 1.1, 0.95, seed + 12), terracotta, 0.4); handL.position.set(-0.093, 0.093, 0.016); G.add(handL);
  const armR = mesh(capsule(0.018, 0.07, seed + 13), terracotta, 0.4); armR.position.set(0.082, 0.14, 0.036); armR.rotation.z = 0.22; armR.rotation.x = -0.62; G.add(armR);
  // the clipboard, held against his belly on the right, tipped back onto the body (it touches it: it is held)
  const clip = new THREE.Group();
  const b = mesh(handPush(new THREE.BoxGeometry(0.07, 0.09, 0.007, 20, 24, 3), 0.0011, seed + 20), board, 0.6); clip.add(b);
  const sheet = mesh(handPush(new THREE.BoxGeometry(0.058, 0.07, 0.0025, 16, 18, 2), 0.0007, seed + 22), paper, 0.35); sheet.position.set(0.001, -0.006, 0.0045); clip.add(sheet);
  const c = mesh(handPush(new THREE.BoxGeometry(0.032, 0.013, 0.011, 8, 5, 3), 0.0012, seed + 21), dark, 0.3); c.position.set(0, 0.043, 0.006); clip.add(c);
  // three pressed lines of "fourteen considerations" on the page (clay snakes, not type)
  for (let k = 0; k < 3; k++) { const l = mesh(capsule(0.0016, 0.034 - k * 0.007, seed + 30 + k), dark, 0.1); l.rotation.z = Math.PI / 2 + (h01(k, 3, seed) - 0.5) * 0.12; l.position.set(-0.004 - k * 0.002, 0.018 - k * 0.015, 0.0068); clip.add(l); }
  clip.position.set(0.058, 0.108, 0.082); clip.rotation.set(-0.3, 0.42, -0.06);
  G.add(clip);
  // the hand on its edge: the palm behind the board, the thumb pressed onto the front
  const handR = mesh(ball(0.021, 0.9, 1.1, 1.0, seed + 14), terracotta, 0.4); handR.position.set(0.093, 0.1, 0.07); G.add(handR);
  const thumb = mesh(ball(0.0085, 1.3, 0.8, 0.8, seed + 15, 0.0006), terracotta, 0.2); thumb.position.set(0.084, 0.108, 0.094); thumb.rotation.z = 0.4; G.add(thumb);
  // the bow tie: two lobes pinched at the middle (the pinch shows), a knot pressed in over it
  for (const s of [-1, 1]) {
    const lg = ball(0.013, 1.3, 0.85, 0.5, seed + 40 + s, 0.0022);
    const q = lg.attributes.position;
    for (let i = 0; i < q.count; i++) { const x = q.getX(i); const pinch = Math.exp(-Math.pow((x + s * 0.012) / 0.006, 2)); q.setXYZ(i, x, q.getY(i) * (1 - 0.45 * pinch), q.getZ(i) * (1 - 0.3 * pinch)); }
    const lobe = mesh(lg, dark, 0.6); lobe.position.set(s * 0.016, 0.207, 0.049); lobe.rotation.z = s * 0.25 + (h01(s + 3, 1, seed) - 0.5) * 0.2; G.add(lobe);
  }
  const knot = mesh(ball(0.0068, 1.05, 1, 0.8, seed + 43, 0.0009), dark, 0.3); knot.position.set(0.0008, 0.2065, 0.0545); G.add(knot);
  // the potter's wheel in its chest: a pressed hollow, a wheel, a lump of clay being thrown
  const hollow = mesh(new THREE.TorusGeometry(0.024, 0.0045, 16, 64), terracotta, 0.3); hollow.position.set(0, 0.125, 0.076); hollow.rotation.x = -0.12; G.add(hollow);
  const back = mesh(new THREE.CircleGeometry(0.023, 48), clayMat(0x6e2f1e, nmap, 14, 0.7), 0.1); back.position.set(0, 0.125, 0.071); back.rotation.x = -0.12; G.add(back);
  const wheel = mesh(new THREE.CylinderGeometry(0.016, 0.017, 0.004, 48), wheelM, 0.2); wheel.position.set(0, 0.116, 0.082); wheel.rotation.x = -0.12; G.add(wheel);
  const lump = mesh(lathe([[0.0005, 0], [0.008, 0.001], [0.0065, 0.008], [0.0045, 0.013], [0.0055, 0.015], [0.0005, 0.0155]], 32), terracotta, 0.1); lump.position.set(0, 0.118, 0.082); lump.rotation.x = -0.12; G.add(lump);
  // the face: two pressed eyes (dark clay balls in soft sockets) and a small pressed smile
  for (const s of [-1, 1]) {
    const eye = mesh(ball(0.0055, 1, 1.15, 0.7, seed + 50 + s, 0.0003), dark, 0.05); eye.position.set(s * 0.014, 0.262, 0.053); G.add(eye);
  }
  const smile = mesh(new THREE.TorusGeometry(0.011, 0.0013, 8, 32, Math.PI * 0.7), dark, 0.05);
  smile.position.set(0, 0.246, 0.054); smile.rotation.z = Math.PI + Math.PI * 0.15; G.add(smile);
  return G;
};

/** the seamless paper sweep: floor curving up into a back wall */
export const makeSweep = () => {
  const W = 3.2, R = 0.35, depth = 3.2, H = 1.4;
  const shape: Array<[number, number]> = [];
  for (let i = 0; i <= 20; i++) shape.push([depth - (i / 20) * depth, 0]);
  for (let i = 1; i <= 24; i++) { const a = (i / 24) * (Math.PI / 2); shape.push([-Math.sin(a) * R, R - Math.cos(a) * R]); }
  for (let i = 1; i <= 10; i++) shape.push([-R, R + (i / 10) * H]);
  const pos: number[] = [], idx: number[] = [], uv: number[] = [];
  const NX = 60;
  for (let j = 0; j < shape.length; j++) for (let i = 0; i <= NX; i++) {
    const x = -W / 2 + (i / NX) * W;
    pos.push(x, shape[j][1], shape[j][0] - 0.25); uv.push(i / NX * 6, j / shape.length * 6);
  }
  for (let j = 0; j < shape.length - 1; j++) for (let i = 0; i < NX; i++) { const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.MeshPhysicalMaterial({color: new THREE.Color(0.78, 0.74, 0.68), roughness: 0.95, side: THREE.DoubleSide});
  const s = new THREE.Mesh(g, m); s.receiveShadow = true;
  return s;
};
