import React, {createContext, useContext} from 'react';
import {useLook} from '../theme/LookContext';
import {lighten, darken} from '../theme/color';
import {hashId} from './ids';

/** When > 0, Shapes render only a thick ink silhouette underlay of this width (see <Figure>). */
const OutlinePass = createContext(0);

/**
 * Wrap a character/prop in <Figure> to get the pro line hierarchy:
 * a heavy outer silhouette (width `outline`) with thin inner lines (width = designed stroke x inner).
 */
export const Figure: React.FC<{outline?: number; children: React.ReactNode}> = ({outline = 7, children}) => {
  const look = useLook();
  if (!look.line || look.lineScale === 0) return <>{children}</>;
  return (
    <>
      <OutlinePass.Provider value={outline * look.lineScale}>{children}</OutlinePass.Provider>
      <InnerPass.Provider value={true}>{children}</InnerPass.Provider>
    </>
  );
};
const InnerPass = createContext(false);

export interface ShapeProps {
  /** Silhouette path (local units). */
  d: string;
  /** Designed ("true") fill color; the active Look maps it. */
  fill: string;
  /** Shadow region, automatically clipped to the silhouette. */
  shadow?: string;
  /** Highlight region, automatically clipped to the silhouette. */
  highlight?: string;
  /** Designed outline width in local units (default 6). 0 = no outline for this shape. */
  stroke?: number;
  /** Override the outline color (e.g. colored inner lines). */
  lineColor?: string;
  opacity?: number;
  transform?: string;
  /** Skip the look's color mapping (e.g. pure white eye highlights, UI colors). */
  raw?: boolean;
}

/**
 * The basic look-aware drawing primitive. Every character, prop and set is built from Shapes,
 * so switching the Look re-renders the whole world in another style.
 */
export const Shape: React.FC<ShapeProps> = ({d, fill, shadow, highlight, stroke = 6, lineColor, opacity, transform, raw}) => {
  const look = useLook();
  const outlinePass = useContext(OutlinePass);
  const inner = useContext(InnerPass);
  if (outlinePass > 0) {
    if (stroke === 0) return null;
    return (
      <g transform={transform} opacity={opacity}>
        <path d={d} fill={look.line ?? look.ink} stroke={look.line ?? look.ink} strokeWidth={outlinePass * 2} strokeLinejoin="round" />
      </g>
    );
  }
  const base = raw ? fill : look.color(fill);
  const clipId = hashId('clip', d);
  const gradId = hashId('grad', d + base);
  const needsClip = Boolean(shadow || highlight);
  const sw = stroke * look.lineScale * (inner ? 0.55 : 1);
  const line = lineColor ? (look.id === 'news' || look.id === 'onebit' ? look.line : look.color(lineColor)) : look.line;

  let baseFill: string = base;
  if (look.shading === 'gloss') baseFill = `url(#${gradId})`;

  return (
    <g transform={transform} opacity={opacity}>
      {(needsClip || look.shading === 'gloss') && (
        <defs>
          {needsClip && (
            <clipPath id={clipId}>
              <path d={d} />
            </clipPath>
          )}
          {look.shading === 'gloss' && (
            <linearGradient id={gradId} x1="0" y1="0" x2="0.25" y2="1">
              <stop offset="0" stopColor={lighten(base, 0.22)} />
              <stop offset="0.55" stopColor={base} />
              <stop offset="1" stopColor={darken(base, 0.25)} />
            </linearGradient>
          )}
        </defs>
      )}
      <path d={d} fill={baseFill} />
      {needsClip && (
        <g clipPath={`url(#${clipId})`}>
          {shadow && <ShadowFill d={shadow} base={base} />}
          {highlight && look.highlight && (
            <path d={highlight} fill={look.highlight(base)} opacity={look.shading === 'gloss' ? 0.55 : 1} />
          )}
        </g>
      )}
      {line && sw > 0 && (
        <path d={d} fill="none" stroke={line} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
      )}
    </g>
  );
};

const ShadowFill: React.FC<{d: string; base: string}> = ({d, base}) => {
  const look = useLook();
  switch (look.shading) {
    case 'halftone':
      return <path d={d} fill="url(#ht-mid)" />;
    case 'flat':
      return <path d={d} fill={look.shade(base)} transform={`translate(${look.misregister} ${look.misregister * 0.6})`} />;
    case 'gloss':
      return <path d={d} fill={look.shade(base)} opacity={0.8} />;
    default:
      return <path d={d} fill={look.shade(base)} />;
  }
};

/** An open stroke (brows, mouth lines, creases). Look-aware color and weight. */
export const Line: React.FC<{d: string; width?: number; color?: string; opacity?: number; cap?: 'round' | 'butt'}> = ({
  d,
  width = 4,
  color,
  opacity,
  cap = 'round',
}) => {
  const look = useLook();
  const outlinePass = useContext(OutlinePass);
  if (outlinePass > 0) return null;
  const c = color ? (look.id === 'news' || look.id === 'onebit' ? look.ink : look.color(color)) : look.line ?? look.ink;
  const w = look.lineScale === 0 ? width : width * Math.max(0.6, look.lineScale);
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" opacity={opacity} />;
};

/** A filled detail with no outline (pupils, nostrils, stubble patches). */
export const Fill: React.FC<{d: string; fill: string; opacity?: number; raw?: boolean; transform?: string}> = ({
  d,
  fill,
  opacity,
  raw,
  transform,
}) => {
  const look = useLook();
  const outlinePass = useContext(OutlinePass);
  if (outlinePass > 0) return null;
  return <path d={d} fill={raw ? fill : look.color(fill)} opacity={opacity} transform={transform} />;
};
