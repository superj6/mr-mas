// MR. MAS - style-range Prototype 1: the push's painted plates on one canvas per frame: the casino dark (a flat card at
// the far wall) and the felt (mapped in true perspective by a subdivided triangle mesh, clipped at the near plane).
import React, {useLayoutEffect, useRef} from 'react';
import {continueRender, delayRender} from 'remotion';
import {Cam, project, TABLE, WORLD} from './world';
import {backdrop, BACK, tableTop, TOPTEX} from './plates';

const tri = (g: CanvasRenderingContext2D, img: HTMLCanvasElement, s: number[][], d: number[][]) => {
  // affine map from source triangle s to destination triangle d, clipped to d (grown half a pixel to hide seams)
  const [x0, y0] = s[0], [x1, y1] = s[1], [x2, y2] = s[2];
  const [u0, v0] = d[0], [u1, v1] = d[1], [u2, v2] = d[2];
  const den = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
  if (Math.abs(den) < 1e-9) return;
  const a = ((u1 - u0) * (y2 - y0) - (u2 - u0) * (y1 - y0)) / den;
  const b = ((v1 - v0) * (y2 - y0) - (v2 - v0) * (y1 - y0)) / den;
  const c = ((u2 - u0) * (x1 - x0) - (u1 - u0) * (x2 - x0)) / den;
  const dd = ((v2 - v0) * (x1 - x0) - (v1 - v0) * (x2 - x0)) / den;
  const e = u0 - a * x0 - c * y0;
  const f = v0 - b * x0 - dd * y0;
  const cx = (u0 + u1 + u2) / 3, cy = (v0 + v1 + v2) / 3;
  const grow = (u: number, v: number): [number, number] => { const l = Math.hypot(u - cx, v - cy) || 1; return [u + ((u - cx) / l) * 0.7, v + ((v - cy) / l) * 0.7]; };
  g.save();
  g.beginPath();
  const p0 = grow(u0, v0), p1 = grow(u1, v1), p2 = grow(u2, v2);
  g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.closePath();
  g.clip();
  g.setTransform(a, b, c, dd, e, f);
  const sx = Math.max(0, Math.floor(Math.min(x0, x1, x2)) - 2), sy = Math.max(0, Math.floor(Math.min(y0, y1, y2)) - 2);
  const sw = Math.min(img.width - sx, Math.ceil(Math.max(x0, x1, x2)) + 2 - sx), sh = Math.min(img.height - sy, Math.ceil(Math.max(y0, y1, y2)) + 2 - sy);
  if (sw > 0 && sh > 0) g.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh);
  g.restore();
};

export const PlateCanvas: React.FC<{cam: Cam}> = ({cam}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const h = delayRender('p1 plates', {timeoutInMilliseconds: 180000});
    try {
    const cv = ref.current!;
    const g = cv.getContext('2d')!;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = '#07060A';
    g.fillRect(0, 0, cv.width, cv.height);
    // the far room
    const bd = backdrop();
    const tl = project(cam, BACK.x0, BACK.y0, WORLD.wallZ), br = project(cam, BACK.x1, BACK.y1, WORLD.wallZ);
    g.drawImage(bd, tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    // the felt, in perspective
    const tex = tableTop();
    const {x0, x1, z0, z1, ppc} = TOPTEX;
    const NX = 30, NZ = 22;
    const near = cam.z + 8;
    const P: Array<Array<{x: number; y: number; ok: boolean}>> = [];
    for (let j = 0; j <= NZ; j++) {
      const row: Array<{x: number; y: number; ok: boolean}> = [];
      const Z = z0 + ((z1 - z0) * j) / NZ;
      for (let i = 0; i <= NX; i++) {
        const X = x0 + ((x1 - x0) * i) / NX;
        const q = project(cam, X, TABLE.TOP, Z);
        row.push({x: q.x, y: q.y, ok: Z > near});
      }
      P.push(row);
    }
    const S = (i: number, j: number) => [((x1 - x0) * i * ppc) / NX, (z1 - z0) * ppc - ((z1 - z0) * j * ppc) / NZ];
    for (let j = 0; j < NZ; j++)
      for (let i = 0; i < NX; i++) {
        const a = P[j][i], b = P[j][i + 1], c = P[j + 1][i + 1], d = P[j + 1][i];
        if (!a.ok || !b.ok || !c.ok || !d.ok) continue;
        const minX = Math.min(a.x, b.x, c.x, d.x), maxX = Math.max(a.x, b.x, c.x, d.x), minY = Math.min(a.y, b.y, c.y, d.y), maxY = Math.max(a.y, b.y, c.y, d.y);
        if (maxX < -4 || minX > cv.width + 4 || maxY < -4 || minY > cv.height + 4) continue;
        tri(g, tex, [S(i, j), S(i + 1, j), S(i + 1, j + 1)], [[a.x, a.y], [b.x, b.y], [c.x, c.y]]);
        tri(g, tex, [S(i, j), S(i + 1, j + 1), S(i, j + 1)], [[a.x, a.y], [c.x, c.y], [d.x, d.y]]);
      }
    } finally {
      continueRender(h);
    }
  }, [cam.x, cam.y, cam.z]);
  return <canvas ref={ref} width={1920} height={1080} style={{position: 'absolute', inset: 0, width: 1920, height: 1080}} />;
};
