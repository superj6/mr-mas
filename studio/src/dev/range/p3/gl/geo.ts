// MR. MAS — range/p3: procedural geometry for the learned objects (metres). The tablecloth with its hang, folds
// and belled corners; plates, wine and water glasses and their liquid; cutlery; the LED pillar in its hurricane;
// napkins; table legs; the monitor. Everything is built once and deterministic.
import {THREE, Any, h01} from './kit';
import {TABLE} from '../layout';

const V = (x: number, y: number) => new THREE.Vector2(x, y);

// ------------------------------------------------------------------ the tablecloth
/** the flat top (a rounded rectangle), UVs normalised over the table for the crease map */
export const clothTop = () => {
  const {x0, x1, z0, z1, top} = TABLE;
  const r = 0.012, s = new THREE.Shape();
  const a = x0, b = x1, c = z0, d = z1;
  s.moveTo(a + r, c); s.lineTo(b - r, c); s.quadraticCurveTo(b, c, b, c + r); s.lineTo(b, d - r); s.quadraticCurveTo(b, d, b - r, d);
  s.lineTo(a + r, d); s.quadraticCurveTo(a, d, a, d - r); s.lineTo(a, c + r); s.quadraticCurveTo(a, c, a + r, c);
  const g = new THREE.ShapeGeometry(s, 12);
  // shape is in (x, y) -> lay it on the table: (x, top, y)
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getY(i);
    p.setXYZ(i, x, top + 0.002, z);
    uv.setXY(i, (x - x0) / (x1 - x0), (z - z0) / (z1 - z0));
  }
  g.computeVertexNormals();
  // ShapeGeometry winds for +z; after the swap the face points down: flip the index order
  const idx = g.index.array;
  for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  g.computeVertexNormals();
  return g;
};

/** the hang: one loop round the table, rolled over the edge, falling to the hem, the corners belled out lower */
export const clothDrape = () => {
  const {x0, x1, z0, z1, top, hem} = TABLE;
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, hx = (x1 - x0) / 2, hz = (z1 - z0) / 2;
  const NS = 900, NT = 26, drop = top - hem;
  // rows: 0..2 the roll over the edge, then the fall
  const rowY = (j: number) => (j === 0 ? top + 0.002 : j === 1 ? top - 0.004 : j === 2 ? top - 0.011 : top - 0.011 - ((j - 2) / (NT - 3)) * (drop - 0.011));
  const rowOff = (j: number) => (j === 0 ? 0.0 : j === 1 ? 0.008 : j === 2 ? 0.0115 : 0.0115 + 0.006 * ((j - 2) / (NT - 3)));
  const rowT = (j: number) => (j <= 2 ? 0 : (j - 2) / (NT - 3));
  const pos: number[] = [], uvs: number[] = [];
  // arc-length parametrisation of a rounded rectangle with corner radius rho (sides + quarter circles)
  const loopPoint = (u: number, rho: number, off: number): [number, number, number, number] => {
    const ax = hx - rho, az = hz - rho; // straight half-lengths
    const L = 4 * (ax + az) + 2 * Math.PI * rho;
    let s = ((u % 1) + 1) % 1 * L;
    const R = rho + off;
    const seg = [2 * az, Math.PI * rho / 2, 2 * ax, Math.PI * rho / 2, 2 * az, Math.PI * rho / 2, 2 * ax, Math.PI * rho / 2];
    // start at the +x side's middle-bottom, going +z
    let k = 0;
    while (k < 8 && s > seg[k]) { s -= seg[k]; k++; }
    k = Math.min(k, 7);
    let px = 0, pz = 0, nx = 0, nz = 0, corner = 0;
    switch (k) {
      case 0: px = cx + ax + R; pz = cz - az + s; nx = 1; nz = 0; break;
      case 1: { const a = s / Math.max(rho, 1e-6); nx = Math.cos(a); nz = Math.sin(a); px = cx + ax + nx * R; pz = cz + az + nz * R; corner = Math.sin(a * 2); break; }
      case 2: px = cx + ax - s; pz = cz + az + R; nx = 0; nz = 1; break;
      case 3: { const a = Math.PI / 2 + s / Math.max(rho, 1e-6); nx = Math.cos(a); nz = Math.sin(a); px = cx - ax + nx * R; pz = cz + az + nz * R; corner = Math.sin((a - Math.PI / 2) * 2); break; }
      case 4: px = cx - ax - R; pz = cz + az - s; nx = -1; nz = 0; break;
      case 5: { const a = Math.PI + s / Math.max(rho, 1e-6); nx = Math.cos(a); nz = Math.sin(a); px = cx - ax + nx * R; pz = cz - az + nz * R; corner = Math.sin((a - Math.PI) * 2); break; }
      case 6: px = cx - ax + s; pz = cz - az - R; nx = 0; nz = -1; break;
      default: { const a = 1.5 * Math.PI + s / Math.max(rho, 1e-6); nx = Math.cos(a); nz = Math.sin(a); px = cx + ax + nx * R; pz = cz - az + nz * R; corner = Math.sin((a - 1.5 * Math.PI) * 2); }
    }
    return [px, pz, nx, nz + corner * 0];
  };
  const perim = 4 * (hx + hz);
  for (let j = 0; j < NT; j++) {
    const t = rowT(j), y0 = rowY(j);
    const rho = 0.012 + 0.11 * Math.pow(t, 1.15); // the corners bell out as the cloth falls
    for (let i = 0; i <= NS; i++) {
      const u = i / NS;
      const [px, pz, nx, nz] = loopPoint(u, rho, rowOff(j));
      const sM = u * perim; // metres along the loop (approx)
      // folds: grow with the fall; two scales, phase-shifted per side so no two sides repeat
      const fold = Math.pow(t, 1.35) * (0.013 * Math.sin(sM / 0.21 * Math.PI * 2 + 1.3) + 0.008 * Math.sin(sM / 0.083 * Math.PI * 2 + 0.4 + h01(Math.floor(sM / 0.5)) * 2) + 0.006 * Math.sin(sM / 0.41 * Math.PI * 2 + 2.1));
      // corners hang lower (the diagonal of the cloth is longer than the sides)
      const cornerLow = (() => {
        const dx = Math.max(0, Math.abs(px - cx) - hx + 0.02), dz = Math.max(0, Math.abs(pz - cz) - hz + 0.02);
        return Math.min(1, Math.hypot(dx, dz) / 0.12);
      })();
      const y = y0 - t * 0.075 * cornerLow * cornerLow;
      pos.push(px + nx * fold, y, pz + nz * fold);
      uvs.push(sM, (top - y));
    }
  }
  const idx: number[] = [];
  for (let j = 0; j < NT - 1; j++)
    for (let i = 0; i < NS; i++) {
      const a = j * (NS + 1) + i, b = a + 1, c = a + NS + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
};

// ------------------------------------------------------------------ lathe helpers
const lathe = (pts: Array<[number, number]>, seg = 72) => { const g = new THREE.LatheGeometry(pts.map(([r, y]) => V(Math.max(r, 0.0001), y)), seg); g.computeVertexNormals(); return g; };

/** a porcelain dinner plate, 27 cm, with a well, a rim and a foot ring */
export const plateGeo = () => lathe(([
  [0, 0.0045], [0.07, 0.0045], [0.085, 0.006], [0.095, 0.011], [0.1, 0.0135], [0.12, 0.0155], [0.132, 0.0165], [0.1345, 0.0155], [0.1345, 0.0135],
  [0.132, 0.0125], [0.118, 0.0118], [0.1, 0.0095], [0.085, 0.004], [0.075, 0.0015], [0.072, 0.0], [0.068, 0.0], [0.066, 0.0015], [0, 0.0015],
] as Array<[number, number]>).reverse(), 96);

/** a wine glass: outer profile up, inner profile down (1.4 mm wall), a heavy foot, a pulled stem */
export const wineGlassGeo = () => {
  const outer: Array<[number, number]> = [[0.0001, 0], [0.034, 0.0005], [0.0355, 0.002], [0.03, 0.0035], [0.008, 0.006], [0.0045, 0.012], [0.004, 0.06], [0.0045, 0.078], [0.008, 0.086], [0.02, 0.095], [0.033, 0.11], [0.0405, 0.13], [0.042, 0.148], [0.04, 0.17], [0.0365, 0.195], [0.0355, 0.205]];
  const inner: Array<[number, number]> = [[0.0342, 0.2048], [0.0352, 0.195], [0.0386, 0.17], [0.0406, 0.148], [0.0391, 0.13], [0.0318, 0.111], [0.019, 0.097], [0.009, 0.0905], [0.0001, 0.0895]];
  return lathe([...outer, ...inner], 96);
};
/** wine in the bowl up to `fill` (the meniscus is flat: nothing at this table ever ripples) */
export const wineGeo = (fill = 0.122) => {
  const prof: Array<[number, number]> = [[0.0001, 0.0898], [0.009, 0.0908], [0.019, 0.0973], [0.0316, 0.1112], [Math.min(0.0389, 0.0316 + (fill - 0.1112) * 0.38), fill], [0.0001, fill]];
  return lathe(prof, 96);
};
/** a water goblet: a lower, wider bowl on a short stem */
export const waterGlassGeo = () => {
  const outer: Array<[number, number]> = [[0.0001, 0], [0.036, 0.0005], [0.037, 0.0025], [0.03, 0.004], [0.009, 0.007], [0.0055, 0.014], [0.005, 0.045], [0.0065, 0.056], [0.014, 0.063], [0.03, 0.075], [0.042, 0.095], [0.0445, 0.12], [0.043, 0.145], [0.0415, 0.158]];
  const inner: Array<[number, number]> = [[0.0402, 0.1578], [0.0417, 0.145], [0.0431, 0.12], [0.0406, 0.096], [0.0288, 0.0765], [0.0135, 0.0665], [0.0001, 0.0655]];
  return lathe([...outer, ...inner], 96);
};
export const waterGeo = (fill = 0.128) => lathe([[0.0001, 0.0658], [0.0135, 0.0668], [0.0288, 0.0768], [0.0405, 0.0962], [0.0429, 0.12], [0.0425, fill], [0.0001, fill]], 96);

/** the LED pillar (ivory, a soft uneven "melted" lip) and its flame-shaped LED */
export const pillarGeo = () => lathe([[0.0001, 0.0], [0.034, 0.0], [0.035, 0.004], [0.035, 0.1], [0.0352, 0.106], [0.0335, 0.1085], [0.028, 0.104], [0.012, 0.1025], [0.0001, 0.1025]], 64);
export const ledFlameGeo = () => lathe([[0.0001, 0], [0.0035, 0.002], [0.0058, 0.007], [0.0055, 0.012], [0.0035, 0.017], [0.0012, 0.021], [0.0001, 0.0225]], 24);
/** the hurricane holder: a thick-bottomed clear tumbler around the pillar */
export const holderGeo = () => lathe([[0.0001, 0], [0.05, 0], [0.052, 0.003], [0.053, 0.13], [0.0515, 0.1315], [0.0495, 0.13], [0.0485, 0.012], [0.045, 0.009], [0.0001, 0.009]], 72);

// ------------------------------------------------------------------ cutlery (lying on the cloth; length along +x)
const extrudeFlat = (s: Any, th: number, lift: (x: number) => number, dip?: (x: number, z: number) => number) => {
  const g = new THREE.ExtrudeGeometry(s, {depth: th, bevelEnabled: true, bevelThickness: 0.0006, bevelSize: 0.0006, bevelSegments: 2, curveSegments: 24, steps: 1});
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getY(i), y = p.getZ(i);
    p.setXYZ(i, x, y + lift(x) + (dip ? dip(x, z) : 0), z);
  }
  // extrude builds along +z; we rotated it onto y: fix winding
  const idx = g.index ? g.index.array : null;
  if (idx) for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
  else { const a = p.array as Float32Array; for (let i = 0; i < p.count; i += 3) for (let k = 0; k < 3; k++) { const t = a[(i + 1) * 3 + k]; a[(i + 1) * 3 + k] = a[(i + 2) * 3 + k]; a[(i + 2) * 3 + k] = t; } }
  g.computeVertexNormals();
  return g;
};
/** handle rises a few mm toward its end, as real flatware rests on its heel and tip */
const liftFn = (L: number) => (x: number) => 0.0022 * Math.sin(Math.PI * Math.min(1, Math.max(0, x / L)));
export const knifeGeo = () => {
  const s = new THREE.Shape();
  s.moveTo(0, -0.006); s.lineTo(0.1, -0.0072); s.quadraticCurveTo(0.112, -0.0068, 0.114, -0.004); s.lineTo(0.118, -0.0045);
  s.lineTo(0.215, -0.0065); s.quadraticCurveTo(0.232, -0.005, 0.235, 0.004); s.lineTo(0.118, 0.0055); s.lineTo(0.114, 0.004);
  s.quadraticCurveTo(0.112, 0.0068, 0.1, 0.0072); s.lineTo(0, 0.006); s.quadraticCurveTo(-0.004, 0, 0, -0.006);
  return extrudeFlat(s, 0.0026, liftFn(0.235));
};
export const forkGeo = () => {
  const s = new THREE.Shape();
  s.moveTo(0, -0.0065); s.lineTo(0.11, -0.0045); s.quadraticCurveTo(0.13, -0.004, 0.142, -0.0105); s.lineTo(0.192, -0.0115);
  const tine = (z0: number, z1: number) => { s.lineTo(0.192, z0); s.lineTo(0.15, z0); s.lineTo(0.15, z1); s.lineTo(0.192, z1); };
  s.lineTo(0.192, -0.0085); tine(-0.0085, -0.0055); s.lineTo(0.192, -0.0028); tine(-0.0028, 0.0002); s.lineTo(0.192, 0.0028); tine(0.0028, 0.0058); s.lineTo(0.192, 0.0115);
  s.lineTo(0.142, 0.0105); s.quadraticCurveTo(0.13, 0.004, 0.11, 0.0045); s.lineTo(0, 0.0065); s.quadraticCurveTo(-0.004, 0, 0, -0.0065);
  return extrudeFlat(s, 0.0022, liftFn(0.19));
};
export const spoonGeo = () => {
  const s = new THREE.Shape();
  s.moveTo(0, -0.0065); s.lineTo(0.115, -0.0035); s.quadraticCurveTo(0.13, -0.004, 0.14, -0.018); s.quadraticCurveTo(0.19, -0.024, 0.19, 0);
  s.quadraticCurveTo(0.19, 0.024, 0.14, 0.018); s.quadraticCurveTo(0.13, 0.004, 0.115, 0.0035); s.lineTo(0, 0.0065); s.quadraticCurveTo(-0.004, 0, 0, -0.0065);
  // the bowl is dished (a mirror that curves: the reflections in it bend)
  const dip = (x: number, z: number) => { const u = (x - 0.162) / 0.03, v = z / 0.021; const d = 1 - (u * u + v * v); return d > 0 ? -0.0045 * d : 0; };
  return extrudeFlat(s, 0.0022, liftFn(0.19), dip);
};

/** a folded linen napkin (a soft slab) */
export const napkinGeo = () => {
  const g = new THREE.BoxGeometry(0.2, 0.012, 0.1, 24, 2, 12);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const edge = Math.max(Math.abs(x) / 0.1, Math.abs(z) / 0.05);
    const round = Math.pow(Math.max(0, edge - 0.82) / 0.18, 2) * 0.005;
    p.setXYZ(i, x, (y > 0 ? y - round : y + round * 0.3) + 0.0012 * Math.sin(x * 60 + z * 20), z);
  }
  g.computeVertexNormals();
  return g;
};
export const legGeo = () => new THREE.BoxGeometry(0.065, 0.74, 0.065);
