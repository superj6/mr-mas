/**
 * COMIC PRINT SYSTEM (builder: comic)
 * Everything in a panel is drawn once per PRINTING PLATE (k = black, c = cyan spot, r = red/orange spot).
 * Inside a plate, a shape's fill is its INK COVERAGE for that plate, encoded as a red-channel grey
 * (rgb(255,0,0) = no ink, rgb(0,0,0) = solid). A plate group is then run through an SVG "RIP" filter:
 * tone + a rotated dot screen (green channel, blended in with `screen`) -> threshold -> plate ink with alpha.
 * So blurred glows, gradients and soft shapes become real halftone dots; solids stay solid.
 * Plates are multiplied onto the paper and can be misregistered independently (print-native jolts).
 */
import React, {createContext, useContext} from 'react';

export type Plate = 'k' | 'c' | 'r';
export interface Spec {
  k?: number;
  c?: number;
  r?: number;
}

export const PAPER = '#EDE5D0';
export const PAPER_SHADE = '#D9CFB6';
export const INKS: Record<Plate, string> = {k: '#16141A', c: '#1FB4CC', r: '#E8502A'};
/** Non-photo-blue for unprinted (pencilled) panels. */
export const BLUELINE = '#7FB2D9';

/** Screen pitch (page units) and angle per plate. Black at 45deg, spots at 15/75 like real separations. */
export const SCREEN: Record<Plate, {pitch: number; angle: number}> = {
  k: {pitch: 11, angle: 45},
  c: {pitch: 11, angle: 15},
  r: {pitch: 11, angle: 75},
};

const PlateCtx = createContext<Plate>('k');
export const PlateProvider = PlateCtx.Provider;
export const usePlate = () => useContext(PlateCtx);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Fill for a print spec on a given plate. */
export const tone = (plate: Plate, s: Spec | undefined): string => {
  const v = 1 - clamp01(s?.[plate] ?? 0);
  return `rgb(${Math.round(v * 255)},0,0)`;
};
/** Hook: `const ink = useInk(); <path fill={ink({k: 1})} />`. */
export const useInk = () => {
  const p = usePlate();
  return (s: Spec | undefined) => tone(p, s);
};
export const KNOCK = 'rgb(255,0,0)';

/** Global defs: dot screens + RIP filters + utility blurs. Render once inside the page <svg>. */
export const PrintDefs: React.FC<{uid?: string; grain?: number}> = ({uid = 'pg', grain = 0.09}) => {
  const plates: Plate[] = ['k', 'c', 'r'];
  return (
    <defs>
      <radialGradient id={`${uid}-dot`} cx="0.5" cy="0.5" r="0.7071" gradientUnits="objectBoundingBox">
        <stop offset="0" stopColor="rgb(0,14,0)" />
        <stop offset="1" stopColor="rgb(0,226,0)" />
      </radialGradient>
      {plates.map((p) => (
        <pattern key={p} id={`${uid}-scr-${p}`} width={SCREEN[p].pitch} height={SCREEN[p].pitch} patternUnits="userSpaceOnUse" patternTransform={`rotate(${SCREEN[p].angle})`}>
          <rect width={SCREEN[p].pitch} height={SCREEN[p].pitch} fill={`url(#${uid}-dot)`} />
        </pattern>
      ))}
      {plates.map((p, i) => {
        const [r, g, b] = hex01(INKS[p]);
        const S = 16;
        const T = 0.945;
        return (
          <filter key={p} id={`${uid}-rip-${p}`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves={2} seed={7 + i * 13} result="n" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 1 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="sum" />
            <feComposite in="sum" in2="n" operator="arithmetic" k1={0} k2={1} k3={grain} k4={-grain / 2} result="sn" />
            <feComponentTransfer in="sn" result="th">
              <feFuncR type="linear" slope={S} intercept={0.5 - S * T} />
            </feComponentTransfer>
            <feColorMatrix in="th" type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  -1 0 0 0 1`} />
          </filter>
        );
      })}
      {/* blue-line proof of an unprinted panel: the black plate as faint non-photo-blue */}
      <filter id={`${uid}-blue`} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 1 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 1" result="sum" />
        <feComponentTransfer in="sum" result="th">
          <feFuncR type="linear" slope={16} intercept={0.5 - 16 * 0.945} />
        </feComponentTransfer>
        <feColorMatrix in="th" type="matrix" values={`0 0 0 0 ${hex01(BLUELINE).join(' 0 0 0 0 ')}  -0.55 0 0 0 0.55`} />
      </filter>
      {/* hand-inked edge: tiny displacement so vector ink never looks machine-perfect */}
      <filter id={`${uid}-rough`} x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={3} result="t" />
        <feDisplacementMap in="SourceGraphic" in2="t" scale={2.6} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
};

const hex01 = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => +(parseInt(h.slice(i, i + 2), 16) / 255).toFixed(4)) as [number, number, number];
};

/**
 * One printing plate of some content: paper-white base over `box`, the content drawn with plate
 * coverages, the dot screen blended on top, then the RIP filter. Multiplied onto whatever is below.
 */
export const PlateGroup: React.FC<{
  plate: Plate;
  box: [number, number, number, number];
  uid?: string;
  dx?: number;
  dy?: number;
  blue?: boolean;
  opacity?: number;
  children: React.ReactNode;
}> = ({plate, box, uid = 'pg', dx = 0, dy = 0, blue = false, opacity = 1, children}) => {
  const [x, y, w, h] = box;
  return (
    <g style={{mixBlendMode: 'multiply'}} transform={dx || dy ? `translate(${dx.toFixed(2)} ${dy.toFixed(2)})` : undefined} opacity={opacity}>
      <g filter={`url(#${uid}-${blue ? 'blue' : 'rip-' + plate})`}>
        <rect x={x} y={y} width={w} height={h} fill={KNOCK} />
        <PlateProvider value={plate}>{children}</PlateProvider>
        {!blue && <rect x={x} y={y} width={w} height={h} fill={`url(#${uid}-scr-${plate})`} style={{mixBlendMode: 'screen'}} />}
      </g>
    </g>
  );
};

/** Helper: a filled path with a print spec. */
export const Ink: React.FC<{d: string; s?: Spec; transform?: string; opacity?: number; filter?: string; eo?: boolean}> = ({d, s, transform, opacity, filter, eo}) => {
  const ink = useInk();
  return <path d={d} fill={ink(s)} transform={transform} opacity={opacity} filter={filter} fillRule={eo ? 'evenodd' : undefined} />;
};
/** Helper: a stroked path with a print spec. */
export const InkLine: React.FC<{d: string; s?: Spec; w: number; transform?: string; cap?: 'round' | 'butt' | 'square'; opacity?: number}> = ({d, s, w, transform, cap = 'round', opacity}) => {
  const ink = useInk();
  return <path d={d} fill="none" stroke={ink(s)} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" transform={transform} opacity={opacity} />;
};

/** Deterministic PRNG. */
export const rng = (seed: number) => {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
};
