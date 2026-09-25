// MR. MAS — mcoldopen: THE TRUE WORLD behind Mas's room — an endless data-center cathedral, drawn in
// master-palette pixels in one-point perspective and only ever seen through the Orb's scan, in GLYPH.
// Built for the glyph read (density + contour glyphs): bold curved ribs (they become / | \ -), a hot core
// (dense tokens), god-rays (mid tokens), irregular LED votives (sparse bright tokens), a black void between.
// Everything is aimed at `vp` so the reveal reads as depth down the cone, not as texture.
import {Buf, line, rect, poly, hash, bayer, clamp} from '../../shared/pixel/px';
import {PAL} from '../../shared/pixel/palette';

const F = 6; // focal length (native px per world unit at z = 1, scaled below)

export const drawCathedral = (b: Buf, f = 0, vp: [number, number] = [169, 125]) => {
  const [vx, vy] = vp;
  const P = (X: number, Y: number, z: number): [number, number] => [vx + (X / z) * F, vy + (Y / z) * F];
  b.c.fill(PAL.N0);
  // ---- the core's light: stepped rings + god-rays fanning from the far end
  const RAYS = [0.3, 0.9, 1.35, 1.9, 2.6, 3.3, 3.9, 4.5, 5.2, 5.9];
  for (let y = 0; y < b.h; y++)
    for (let x = 0; x < b.w; x++) {
      const dx = x + 0.5 - vx, dy = (y + 0.5 - vy) * 1.25;
      const d = Math.hypot(dx, dy);
      const bz = bayer(x, y);
      let v = clamp(1 - d / 150, 0, 1);
      v = v * v * 4.2;
      const ang = Math.atan2(dy, dx) + Math.PI;
      for (const r of RAYS) {
        const da = Math.abs(((ang - r + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        const width = 0.035 + 0.02 * Math.sin(r * 7);
        if (da < width && d > 18) v += 1.6 * clamp(1 - d / 260, 0, 1) * (1 - da / width);
      }
      const k = Math.floor(v + bz * 0.9);
      if (k > 0) b.set(x, y, [PAL.N0, PAL.N1, PAL.C0, PAL.C1, PAL.C2, PAL.C3, PAL.C4][Math.min(6, k)]);
    }
  const zs: number[] = [];
  for (let z = 1.5; z < 70; z *= 1.2) zs.push(z);
  const FLOOR = 34, WALLX = 34, A = 44, SPRING = -18;
  // ---- floor: polished, lines converging, one slice line per bay, LED reflections
  for (let X = -240; X <= 240; X += 24) {
    const [x0, y0] = P(X, FLOOR, 1.15), [x1, y1] = P(X, FLOOR, 70);
    line(x0, y0, x1, y1, b.ink(Math.abs(X) < 25 ? PAL.C2 : PAL.N2));
  }
  zs.forEach((z, i) => {
    if (i % 2) return;
    const [xa, ya] = P(-240, FLOOR, z), [xb] = P(240, FLOOR, z);
    line(xa, ya, xb, ya, b.ink(z < 3 ? PAL.N3 : PAL.N2));
  });
  // ---- the nave, drawn far to near
  for (let i = zs.length - 2; i >= 0; i--) {
    const z0 = zs[i], z1 = zs[i + 1] * 0.94;
    const near = z0 < 3, mid = z0 < 9;
    // rack rows facing the aisle: one cabinet per bay
    for (const s of [-1, 1]) {
      const X = s * WALLX, Yt = SPRING + 4, Yb = FLOOR;
      const [ax, ayT] = P(X, Yt, z0), [, ayB] = P(X, Yb, z0);
      const [bx, byT] = P(X, Yt, z1), [, byB] = P(X, Yb, z1);
      poly([ax, ayT, bx, byT, bx, byB, ax, ayB], b.ink(PAL.N0));
      line(ax, ayT, bx, byT, b.ink(near ? PAL.C4 : mid ? PAL.C3 : PAL.C2));
      // server units: short horizontal shelves across the cabinet face (never one long vertical rule)
      const units = near ? 7 : mid ? 5 : 3;
      for (let u = 1; u < units; u++) {
        const Yu = Yt + ((Yb - Yt) * u) / units;
        const [ux0, uy0] = P(X, Yu, z0), [ux1, uy1] = P(X, Yu, z1);
        line(ux0, uy0, ux1, uy1, b.ink(near ? PAL.C1 : PAL.N2));
      }
      if (!near) line(ax, ayT, ax, ayB, b.ink(PAL.C1));
      // LED votives: irregular, a few per unit, rarely amber, one red in a hundred
      const n = near ? 16 : mid ? 8 : 3;
      for (let k = 0; k < n; k++) {
        const h1 = hash(i * 17 + k, s + 3, 5), h2 = hash(k * 13, i + (s > 0 ? 50 : 0), 9);
        const zz = z0 + (z1 - z0) * (0.1 + 0.8 * h1);
        const Y = Yt + 3 + (Yb - Yt - 6) * h2;
        const [lx, ly] = P(X, Y, zz);
        const blink = hash(i + k, Math.floor((f + k * 5) / 4), 2) < 0.8;
        if (!blink) continue;
        const r = hash(k, i, 77);
        const col = r < 0.01 ? PAL.R3 : r < 0.09 ? PAL.W6 : r < 0.55 ? PAL.C7 : PAL.C6;
        b.set(lx, ly, col);
        if (near) b.set(lx, ly + 1, col === PAL.C7 ? PAL.C5 : col);
        // its reflection in the polished floor
        if (mid) { const [, fy] = P(X, FLOOR, zz); for (let q = 1; q < (near ? 7 : 3); q += 2) b.set(lx, fy + q, PAL.C1); }
      }
    }
    // pointed (equilateral) arches every other bay: ribs + piers
    if (i % 2 === 0) {
      const z = z0;
      const pts: Array<[number, number]> = [];
      for (let k = 0; k <= 18; k++) { const th = Math.PI - (k / 18) * (Math.PI / 3); pts.push(P(A + 2 * A * Math.cos(th), SPRING - 2 * A * Math.sin(th), z)); }
      for (let k = 18; k >= 0; k--) { const th = Math.PI - (k / 18) * (Math.PI / 3); pts.push(P(-(A + 2 * A * Math.cos(th)), SPRING - 2 * A * Math.sin(th), z)); }
      const w = z < 1.8 ? 3 : z < 4 ? 2 : 1;
      const col = z < 2.2 ? PAL.C5 : z < 6 ? PAL.C4 : z < 16 ? PAL.C3 : PAL.C2;
      for (let k = 0; k + 1 < pts.length; k++)
        for (let o = 0; o < w; o++) line(pts[k][0], pts[k][1] + o, pts[k + 1][0], pts[k + 1][1] + o, b.ink(o === 0 ? col : PAL.C1));
      for (const s of [-1, 1]) {
        const [px0, py0] = P(s * A, SPRING, z), [, py1] = P(s * A, FLOOR, z);
        const pw = Math.max(1, Math.round(10 / z));
        rect(Math.round(px0 - pw / 2), Math.round(py0), pw, Math.round(py1 - py0), b.ink(z > 8 ? PAL.N2 : PAL.N1));
        rect(Math.round(px0 + (s < 0 ? pw / 2 - 1 : -pw / 2)), Math.round(py0), 1, Math.round(py1 - py0), b.ink(z < 4 ? PAL.C3 : PAL.C2));
      }
      // the ridge: a strip of cold light along the vault's crown
      const [rx, ry] = P(0, SPRING - 2 * A * Math.sin(Math.PI / 3), z);
      b.set(rx, ry, PAL.C8);
      if (z < 3) { b.set(rx - 1, ry, PAL.C6); b.set(rx + 1, ry, PAL.C6); }
    }
  }
  // ---- the rose window at the far end: a GPU die in a wheel
  const R = 13;
  for (let y = -R; y <= R; y++)
    for (let x = -R; x <= R; x++) {
      const d = Math.hypot(x, y);
      if (d > R + 0.5) continue;
      const a = Math.atan2(y, x);
      let c: number = PAL.C4;
      if (d > R - 1.5) c = PAL.C7;
      else if (Math.abs(((a / (Math.PI / 6)) % 1 + 1) % 1 - 0.5) > 0.44 && d > 5) c = PAL.C6; // spokes
      else if (d < 6) c = (Math.abs(x) % 3 === 0 || Math.abs(y) % 3 === 0) ? PAL.C8 : PAL.C9; // the die's grid
      b.set(vx + x, vy + y, c);
    }
  return b;
};
