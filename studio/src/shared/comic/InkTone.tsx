/**
 * InkTone: renders a shared TONAL RIG (masTone / noleTone, read-only imports) as a noir comic print.
 * Like a real comic it splits into two jobs:
 *  - BLACK PLATE (line art): brush contour around each material group (heavier on the shadow side),
 *    open line strokes, and spotted blacks (tone 0-1) — all crisp.
 *  - SPOT PLATE (colour): tone modelling of the key light, blurred a little so terminators screen into
 *    halftone ramps instead of posterized steps.
 * Must be rendered inside a PlateGroup (reads the current plate from context).
 */
import React from 'react';
import type {ToneModel, TP} from '../tonal/types';
import {analyze} from '../tonal/render/geom';
import {luminance} from '../theme/color';
import {Spec, usePlate, tone, Plate} from './print';

export interface InkLook {
  /** Spot plate carrying the key light. */
  key: 'c' | 'r';
  /** Contour width in the model's local units. */
  line?: number;
  /** Shadow-side weight offset (local units) — the contour gets heavier away from the key. */
  heavy?: [number, number];
  /** Coverage of the key on lit skin (tone 3). */
  lit?: number;
  /** Coverage of the key on skin half-tone (tone 2). */
  mid?: number;
  /** Spot-plate blur (local units). */
  soft?: number;
  /** Wide-shot mode: tone <= 2 all black, tone 3 spot, 4 paper (rim-lit silhouettes). */
  silhouette?: boolean;
  /** Hues that never get a contour (small features drawn by their own lines). */
  noContour?: string[];
  /** Per-hue overrides. */
  hue?: Record<string, (tone: number, light: boolean) => Spec>;
  /** Drop the black of tone-1 planes of these hues to spot (keeps forms readable on dark backgrounds). */
  liftShadow?: string[];
}

const cls = (hex: string) => {
  const l = luminance(hex);
  return l < 0.3 ? 'dark' : l < 0.6 ? 'mid' : 'light';
};

export const specOf = (p: TP, hex: string, look: InkLook): Spec => {
  const X = look.key;
  const t = p.tone;
  const o = look.hue?.[p.hue];
  if (o) return o(t, !!p.light);
  if (look.silhouette) {
    if (p.light) return t >= 4 ? {} : {[X]: 1};
    return t >= 4 ? {[X]: 0.25} : t === 3 ? {[X]: 1} : {k: 1, [X]: 1};
  }
  const c = cls(hex);
  if (p.line) {
    if (t <= 1) return {k: 1};
    if (t === 2) return c === 'dark' ? {k: 1} : {[X]: 1};
    return {};
  }
  if (p.light) return t >= 4 ? {} : {[X]: 0.5};
  const lift = look.liftShadow?.includes(p.hue);
  if (c === 'light') return t >= 4 ? {} : t === 3 ? {[X]: look.lit ?? 0.16} : t === 2 ? {[X]: look.mid ?? 0.62} : lift && t === 1 ? {[X]: 1, k: 0.55} : {k: 1, [X]: 1};
  if (c === 'mid') return t >= 4 ? {[X]: 0.14} : t === 3 ? {[X]: 0.42} : t === 2 ? {[X]: 0.85, k: 0.25} : {k: 1, [X]: 1};
  return t >= 4 ? {[X]: 0.3} : t === 3 ? {[X]: 1} : {k: 1, [X]: 1};
};

export const InkTone: React.FC<{model: ToneModel; look: InkLook; transform?: string; uid: string}> = ({model, look, transform, uid}) => {
  const plate = usePlate();
  const infos = analyze(model);
  const hueOf = (p: TP) => (p.hue.startsWith('#') ? p.hue : model.hues[p.hue] ?? '#888888');
  const W = look.line ?? 5;
  const [hx, hy] = look.heavy ?? [-3, 2];
  const skip = new Set(look.noContour ?? ['eye', 'iris', 'pupil', 'lip', 'mouth', 'teeth', 'screen', 'ui', 'string', 'print']);
  const id = (k: string) => `it-${uid}-${plate}-${k}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const clips = new Map<string, number[]>();
  infos.forEach((f) => {
    if (!f.base && !f.p.line && f.clip.length) clips.set(f.clipKey, f.clip);
  });
  // contour strokes of a hue group are painted just before the group's first plane, so internal
  // borders between same-material silhouettes are covered by their own fills (one outer contour).
  const firstOfGroup = new Map<string, number>();
  const groupSils = new Map<string, number[]>();
  infos.forEach((f) => {
    if (f.p.line) return;
    if (!firstOfGroup.has(f.p.hue)) firstOfGroup.set(f.p.hue, f.i);
    if (f.base && !f.p.light && !skip.has(f.p.hue) && f.minDim >= 14) groupSils.set(f.p.hue, [...(groupSils.get(f.p.hue) ?? []), f.i]);
  });
  const K = tone('k', {k: 1});
  const fillOf = (p: TP) => tone(plate, specOf(p, hueOf(p), look));
  const body = infos.map((f) => {
    const p = f.p;
    const els: React.ReactNode[] = [];
    if (plate === 'k' && firstOfGroup.get(p.hue) === f.i) {
      for (const si of groupSils.get(p.hue) ?? []) {
        const q = infos[si].p;
        els.push(<path key={`c${si}`} d={q.d} transform={q.transform} fill="none" stroke={K} strokeWidth={W} strokeLinejoin="round" />);
        els.push(
          <g key={`h${si}`} transform={`translate(${hx} ${hy})`}>
            <path d={q.d} transform={q.transform} fill="none" stroke={K} strokeWidth={W * 1.3} strokeLinejoin="round" />
          </g>,
        );
      }
    }
    if (p.line) {
      const s = specOf(p, hueOf(p), look);
      els.push(<path key="l" d={p.d} transform={p.transform} fill="none" stroke={tone(plate, s)} strokeWidth={p.line * (s.k ? 1.1 : 1)} strokeLinecap="round" strokeLinejoin="round" />);
    } else if (f.base) {
      els.push(<path key="b" d={p.d} transform={p.transform} fill={fillOf(p)} />);
    } else {
      els.push(
        <g key="i" clipPath={f.clip.length ? `url(#${id(f.clipKey)})` : undefined}>
          <path d={p.d} transform={p.transform} fill={fillOf(p)} />
        </g>,
      );
    }
    return <React.Fragment key={f.i}>{els}</React.Fragment>;
  });
  const soft = plate === 'k' ? 0 : look.soft ?? 4;
  return (
    <g transform={transform}>
      <defs>
        {[...clips.entries()].map(([k, sils]) => (
          <clipPath key={k} id={id(k)}>
            {sils.map((si) => (
              <path key={si} d={infos[si].p.d} transform={infos[si].p.transform} />
            ))}
          </clipPath>
        ))}
        {soft > 0 && (
          <filter id={id('soft')} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={soft} />
          </filter>
        )}
      </defs>
      <g filter={soft > 0 ? `url(#${id('soft')})` : undefined}>{body}</g>
    </g>
  );
};

export type {Plate};
