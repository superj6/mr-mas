// MR. MAS — pixelengine demo art: THE ORB (room scale) and the TRUE WORLD behind the room — an endless
// data-center cathedral in one-point perspective — which the Orb's scan reveals in GLYPH.
// Demo-only art (the intro builders own the final versions); everything is master-palette pixels.
import {Buf, spr, blit, line, rect, poly, hash, clamp, bayer, W, H} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';
const bayer4 = bayer;

// ------------------------------------------------------------------ the Orb (13x13, floats at Mas's shoulder)
const ORB = spr(`
....ooooo....
..ooMMMMMoo..
.oMmWWmmmmMo.
.oMWWmmmmmMo.
oMmWmmdddmmMo
oMmmmdiIidmMo
oMmmmdIcIdmMo
oMmmmdiIidmMo
oMmmmmdddmmMo
.oMmmmmmmmMo.
.ooMmmmmmMoo.
..ooMMMMMoo..
....ooooo....
`);
export const ORB_SIZE = 13;
/** iris centre relative to the sprite's top-left */
export const ORB_IRIS: [number, number] = [7, 6];
export const drawOrb = (b: Buf, x: number, y: number, scanning = false) => {
  blit(b, ORB, x, y, {
    o: PAL.N0, M: PAL.G1, m: PAL.G3, W: PAL.G5, d: PAL.N1,
    i: scanning ? PAL.C6 : PAL.C3, I: scanning ? PAL.C8 : PAL.C5, c: PAL.C9,
  });
  // monitor-side rim (the key light is screen-left)
  for (const [i, j] of [[1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [2, 3], [2, 9]] as const) b.set(x + i, y + j, PAL.C4);
};

// ------------------------------------------------------------------ the cathedral
const FOCAL = 5;
let VP: [number, number] = [262, 108];
const proj = (X: number, Y: number, z: number): [number, number] => [VP[0] + (X / z) * FOCAL, VP[1] + (Y / z) * FOCAL];

/** Endless server nave. `f` drives LED blink (deterministic); `vp` = vanishing point (aim it down the scan cone). */
export const drawCathedral = (b: Buf, f = 0, vp: [number, number] = [262, 108]) => {
  VP = vp;
  b.c.fill(PAL.N0);
  // far light: the core at the end of the nave
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const d = Math.hypot((x - VP[0]) / 1.0, (y - VP[1]) * 1.3);
      const t = clamp(1 - d / 150, 0, 1);
      const v = t * t * 7.2 + bayer4(x, y) - 0.5;
      const ramp = [PAL.N0, PAL.N1, PAL.N2, PAL.C0, PAL.C1, PAL.C2, PAL.C4, PAL.C6];
      b.set(x, y, ramp[clamp(Math.floor(v), 0, 7)]);
    }
  // depth slices
  const zs: number[] = [];
  for (let z = 1.1; z < 60; z *= 1.16) zs.push(z);
  // floor grid
  for (let X = -200; X <= 200; X += 25) {
    const [x0, y0] = proj(X, 50, 1.1), [x1, y1] = proj(X, 50, 60);
    line(x0, y0, x1, y1, b.ink(Math.abs(X) < 30 ? PAL.C1 : PAL.N2));
  }
  zs.forEach((z, i) => { if (i % 2) return; const [xa, ya] = proj(-200, 50, z), [xb] = proj(200, 50, z); line(xa, ya, xb, ya, b.ink(z < 4 ? PAL.N3 : PAL.N2)); });
  // arches + pillars (drawn far to near so near ribs overlap)
  const archAt = (z: number) => {
    const a = 92, spring = -34;
    const col = z > 14 ? PAL.C3 : z > 6 ? PAL.C2 : PAL.N6;
    const pts: Array<[number, number]> = [];
    for (let k = 0; k <= 16; k++) { const th = Math.PI - (k / 16) * (Math.PI / 3); pts.push(proj(a + 2 * a * Math.cos(th), spring - 2 * a * Math.sin(th), z)); }
    for (let k = 16; k >= 0; k--) { const th = Math.PI - (k / 16) * (Math.PI / 3); pts.push(proj(-(a + 2 * a * Math.cos(th)), spring - 2 * a * Math.sin(th), z)); }
    const wpx = z < 2.2 ? 3 : z < 5 ? 2 : 1;
    for (let k = 0; k + 1 < pts.length; k++)
      for (let o = 0; o < wpx; o++) line(pts[k][0], pts[k][1] + o, pts[k + 1][0], pts[k + 1][1] + o, b.ink(o === wpx - 1 && wpx > 1 ? PAL.C3 : col));
    // pillars
    for (const s of [-1, 1]) {
      const [px0, py0] = proj(s * a, spring, z), [, py1] = proj(s * a, 50, z);
      const pw = Math.max(1, Math.round(9 / z));
      rect(Math.round(px0 - pw / 2), Math.round(py0), pw, Math.round(py1 - py0), b.ink(z > 10 ? PAL.N3 : PAL.N1));
      rect(Math.round(px0 + (s < 0 ? pw / 2 : -pw / 2 - 1)), Math.round(py0), 1, Math.round(py1 - py0), b.ink(PAL.C2));
    }
  };
  for (let i = zs.length - 1; i >= 0; i -= 2) archAt(zs[i]);
  // racks: two rows facing the aisle, one unit per slice (gap between units)
  for (let i = zs.length - 2; i >= 0; i--) {
    const z0 = zs[i], z1 = zs[i + 1] * 0.97;
    for (const s of [-1, 1]) {
      const X = s * 40, Yt = -26, Yb = 50;
      const [ax, ayT] = proj(X, Yt, z0), [, ayB] = proj(X, Yb, z0);
      const [bx, byT] = proj(X, Yt, z1), [, byB] = proj(X, Yb, z1);
      poly([ax, ayT, bx, byT, bx, byB, ax, ayB], b.ink(z0 > 12 ? PAL.N3 : PAL.N2));
      // top edge + aisle-facing edge highlight
      line(ax, ayT, bx, byT, b.ink(z0 > 12 ? PAL.C3 : PAL.C4));
      line(ax, ayT, ax, ayB, b.ink(z0 > 12 ? PAL.C2 : PAL.C3));
      // LEDs: rows across the face
      const rows = z0 < 3 ? 14 : z0 < 8 ? 9 : 5;
      for (let r = 0; r < rows; r++) {
        const Y = Yt + 6 + (r * (Yb - Yt - 10)) / rows;
        const cols = z0 < 3 ? 6 : 3;
        for (let c = 0; c < cols; c++) {
          const zz = z0 + ((z1 - z0) * (c + 0.5)) / cols;
          const [lx, ly] = proj(X, Y, zz);
          const hsh = hash(i * 31 + c, r * 7 + (s > 0 ? 3 : 0), 5);
          const on = hash(i * 31 + c, r, Math.floor(f / 3) + (hsh * 5 | 0)) < 0.72;
          if (!on) continue;
          const colr = hsh < 0.08 ? PAL.W6 : hsh < 0.5 ? PAL.C6 : hsh < 0.8 ? PAL.C5 : PAL.C8;
          b.set(lx, ly, colr);
          if (z0 < 2.2) b.set(lx + s * -1, ly, colr);
        }
      }
      // floor reflection streak under the near units
      if (z0 < 5) for (let k = 1; k < 6; k++) if (bayer4(Math.round(ax), Math.round(ayB) + k) < 0.5 - k * 0.08) b.set(ax - s, ayB + k, PAL.C1);
    }
  }
  // the core itself
  rect(VP[0] - 1, VP[1] - 3, 3, 6, b.ink(PAL.C8));
  b.set(VP[0], VP[1] - 4, PAL.C9); b.set(VP[0], VP[1], PAL.C9);
};
