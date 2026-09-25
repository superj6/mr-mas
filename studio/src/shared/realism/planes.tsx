// Realism kit — helpers for authoring the painted normal pass (builder key: realism).
import React from 'react';
import {P, sample, spline as S, taper as taperPath} from './geom';
import {N, ncol, norm3, V3} from './lit';
import {Soft, useUid} from './paint';

/** A plane: polygon (spline) filled with the normal colour for (φ, θ), softened by r. */
export const Pl: React.FC<{pts: P[]; phi: number; th?: number; r?: number; op?: number; closed?: boolean}> = ({pts, phi, th = 0, r = 6, op = 1}) => (
  <Soft d={S(pts, true)} fill={N(phi, th)} r={r} op={op} />
);

/**
 * Dome: a rounded bulge (eyeball under the lid, nose tip, chin ball, ala). Built from a centre facing `phi`
 * and 4 lobes facing outward, blurred together.
 */
export const Dome: React.FC<{cx: number; cy: number; rx: number; ry?: number; phi: number; th?: number; k?: number; r?: number; op?: number}> = ({
  cx,
  cy,
  rx,
  ry,
  phi,
  th = 0,
  k = 45,
  r,
  op = 1,
}) => {
  const uid = useUid();
  const RY = ry ?? rx;
  const blur = r ?? Math.min(rx, RY) * 0.45;
  const lobe = (dx: number, dy: number, p: number, t: number) => (
    <ellipse cx={cx + dx * rx * 0.55} cy={cy + dy * RY * 0.55} rx={rx * 0.55} ry={RY * 0.55} fill={N(p, t)} />
  );
  return (
    <g opacity={op}>
      <Soft d={`M${cx - rx},${cy}a${rx},${RY} 0 1,0 ${2 * rx},0a${rx},${RY} 0 1,0 ${-2 * rx},0`} fill={N(phi, th)} r={blur * 0.6} />
      <g>
        <filter id={uid} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
        <g filter={`url(#${uid})`}>
          {lobe(-1, 0, phi - k, th)}
          {lobe(1, 0, phi + k, th)}
          {lobe(0, -1, phi, th + k)}
          {lobe(0, 1, phi, th - k)}
          <ellipse cx={cx} cy={cy} rx={rx * 0.45} ry={RY * 0.45} fill={N(phi, th)} />
        </g>
      </g>
    </g>
  );
};

/**
 * Edge band: along a closed contour, paint outward-facing normals (tilted `z` toward camera), blurred inward.
 * This is what makes silhouettes "turn away" and gives the key its bright far edge and the door its rim.
 */
export const EdgeBand: React.FC<{pts: P[]; w: number; r: number; z?: number; per?: number; skip?: (x: number, y: number) => boolean; closed?: boolean}> = ({
  pts,
  w,
  r,
  z = 0.2,
  per = 6,
  skip,
  closed = true,
}) => {
  const uid = useUid();
  const s = sample(pts, closed, per);
  // orientation (signed area) so we know which side is outward
  let area = 0;
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = s[(i + 1) % s.length];
    area += a[0] * b[1] - b[0] * a[1];
  }
  const sign = area > 0 ? 1 : -1; // y-down screen coords: area>0 => clockwise on screen
  const segs: React.ReactNode[] = [];
  const n = closed ? s.length : s.length - 1;
  for (let i = 0; i < n; i++) {
    const a = s[i], b = s[(i + 1) % s.length];
    if (skip && skip((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)) continue;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    // outward normal for clockwise (screen) polygon: (dy, -dx)
    const ox = (sign * dy) / l, oy = (sign * -dx) / l;
    const k = Math.sqrt(1 - z * z);
    const col = ncol(norm3([ox * k, oy * k, z] as V3));
    segs.push(<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={w} strokeLinecap="round" />);
  }
  const id = uid;
  return (
    <g>
      <filter id={id} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation={r} />
      </filter>
      <g filter={`url(#${id})`}>{segs}</g>
    </g>
  );
};

/**
 * Tube: a hair clump / fold / finger as a tapered stroke whose normals turn across its width.
 * `phi`,`th` = facing of the tube's crest; the side toward `up` (screen-up by default) gets `lit` tilt.
 */
export const Tube: React.FC<{pts: P[]; w: number; phi: number; th?: number; turn?: number; a?: number; b?: number; bias?: number; r?: number}> = ({
  pts,
  w,
  phi,
  th = 0,
  turn = 50,
  a = 0.15,
  b = 0.05,
  bias = 0.4,
  r = 1.5,
}) => {
  // perpendicular offset of the whole centreline (average direction)
  const p0 = pts[0], p1 = pts[pts.length - 1];
  let dx = p1[0] - p0[0], dy = p1[1] - p0[1];
  const l = Math.hypot(dx, dy) || 1;
  dx /= l;
  dy /= l;
  let px = -dy, py = dx; // perpendicular
  if (py > 0) {
    px = -px;
    py = -py;
  } // make it point screen-up
  // angle of perpendicular in screen space -> which way that side of the tube faces
  const sideAng = (Math.atan2(px, -py) * 180) / Math.PI; // 0 = up, 90 = right
  const upPhi = phi + Math.sin((sideAng * Math.PI) / 180) * turn;
  const upTh = th + Math.cos((sideAng * Math.PI) / 180) * turn;
  const dnPhi = phi - Math.sin((sideAng * Math.PI) / 180) * turn;
  const dnTh = th - Math.cos((sideAng * Math.PI) / 180) * turn;
  const off = (k: number) => pts.map((p) => [p[0] + px * w * k, p[1] + py * w * k, p.length > 2 ? p[2] : 1] as P);
  return (
    <g>
      <Soft d={taperPath(pts, w, a, b, bias)} fill={N(phi, th)} r={r} />
      <Soft d={taperPath(off(0.26), w * 0.42, a, b, bias)} fill={N(upPhi, upTh)} r={r * 1.2} />
      <Soft d={taperPath(off(-0.28), w * 0.4, a, b, bias)} fill={N(dnPhi, dnTh)} r={r * 1.2} />
    </g>
  );
};
