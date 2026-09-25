import React from 'react';
import {ink, Pt, sample, sub} from './ink';

/** A hair lock: closed point list root -> edge -> tip -> edge -> root. `tip` = index of the tip point. */
export interface Lock {
  pts: Pt[];
  tip: number;
}

/** The two side edges of a lock, tapering into the root (hidden in the mass) and sharp at the tip. */
export const lockLines = (l: Lock, w: number, k = 1): string[] => [
  ink(sub(l.pts, 0, l.tip), w * k, {a: 0.5, b: 0.12, tip: 0.04}),
  ink(sub(l.pts, l.tip, l.pts.length - 1), w * k * 0.85, {a: 0.12, b: 0.5, tip: 0.04}),
];

export interface ShineSeg {
  pts: Pt[];
  w: number;
  /** Positions 0..1 along the segment where a pointed "tooth" hangs down along the strands. */
  teeth: number[];
  color: string;
  op: number;
}

/**
 * Anime specular "angel ring": broken lens-shaped segments following the skull curve, each with a few
 * teeth hanging down along the strand direction. Broken + uneven = designed, not procedural.
 */
export const shineBand = (segs: ShineSeg[], dx = 0): React.ReactNode =>
  segs.map((s, i) => {
    const pts = s.pts.map((p) => [p[0] + dx, p[1]] as Pt);
    const S = sample(pts, false, 16);
    const at = (u: number) => {
      const f = Math.max(1, Math.min(S.length - 2, Math.round(u * (S.length - 1))));
      const p = S[f];
      let tx = S[f + 1][0] - S[f - 1][0];
      let ty = S[f + 1][1] - S[f - 1][1];
      const l = Math.hypot(tx, ty) || 1;
      tx /= l;
      ty /= l;
      let nx = -ty;
      let ny = tx;
      if (ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      return {p, tx, ty, nx, ny};
    };
    const teeth = s.teeth.map((u, j) => {
      const {p, tx, ty, nx, ny} = at(u);
      const base = s.w * 0.42;
      const len = s.w * (0.9 + ((j * 37) % 5) * 0.18);
      const bx = p[0] + nx * s.w * 0.2;
      const by = p[1] + ny * s.w * 0.2;
      return `M${bx - tx * base} ${by - ty * base}L${bx + nx * len + tx * 1.5} ${by + ny * len + ty * 1.5}L${bx + tx * base} ${by + ty * base}Z`;
    });
    return (
      <g key={i} fill={s.color} opacity={s.op}>
        <path d={ink(pts, s.w, {a: 0.45, b: 0.45, tip: 0})} />
        {teeth.map((d, j) => (
          <path key={j} d={d} />
        ))}
      </g>
    );
  });
