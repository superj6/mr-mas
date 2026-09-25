import React, {useMemo} from 'react';
import {bboxOf, flatten} from '../tonal/render/geom';
import {Family, hatch, ToneFn} from './engrave';
import {strHash} from './core';

/**
 * COLLAGE — <Engr>: an engraved drawing made of regions (each hatched with its own line families and tone
 * function, clipped to its outline), solid ink fills, and burin contour lines.
 * Hatching is computed once per (id, pitch) and cached — parts are static in their own local space and
 * move only by transform, like real cut paper.
 */
export interface Region {
  d: string;
  tone: ToneFn;
  fam: Family[];
  /** pitch multiplier for this region */
  k?: number;
  gamma?: number;
  maxW?: number;
}
export interface InkLine {
  d: string;
  w: number;
  /** dashed / dotted */
  dash?: string;
  color?: string;
}
export interface EngrProps {
  id: string;
  regions: Region[];
  pitch: number;
  ink: string;
  /** Solid ink (or other colour) fills, drawn under the contours. */
  fills?: {d: string; color?: string; opacity?: number}[];
  lines?: InkLine[];
  /** Paper-colour knock-outs drawn after hatching (highlights scraped out of the plate). */
  lights?: {d: string; color: string; opacity?: number}[];
}

const cache = new Map<string, string>();

export const Engr: React.FC<EngrProps> = ({id, regions, pitch, ink, fills = [], lines = [], lights = []}) => {
  const hatches = useMemo(
    () =>
      regions.map((r, i) => {
        const key = `${id}|${i}|${pitch.toFixed(3)}`;
        const hit = cache.get(key);
        if (hit) return hit;
        const bb = bboxOf(flatten(r.d), pitch * 2);
        const d = hatch({bbox: bb, tone: r.tone, pitch: pitch * (r.k ?? 1), families: r.fam, gamma: r.gamma, maxW: r.maxW, seed: strHash(id) + i});
        cache.set(key, d);
        return d;
      }),
    // regions are static per id; recompute only if the pitch changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, pitch],
  );
  const u = id.replace(/[^a-zA-Z0-9_-]/g, '_');
  return (
    <g>
      <defs>
        {regions.map((r, i) => (
          <clipPath key={i} id={`${u}-r${i}`}>
            <path d={r.d} />
          </clipPath>
        ))}
      </defs>
      {hatches.map((h, i) => (
        <path key={i} d={h} fill={ink} clipPath={`url(#${u}-r${i})`} />
      ))}
      {fills.map((f, i) => (
        <path key={'f' + i} d={f.d} fill={f.color ?? ink} opacity={f.opacity} />
      ))}
      {lights.map((f, i) => (
        <path key={'k' + i} d={f.d} fill={f.color} opacity={f.opacity} />
      ))}
      {lines.map((l, i) => (
        <path key={'l' + i} d={l.d} fill="none" stroke={l.color ?? ink} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={l.dash} />
      ))}
    </g>
  );
};
