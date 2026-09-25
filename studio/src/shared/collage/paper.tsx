import React from 'react';
import {strHash} from './core';

/**
 * COLLAGE — paper pieces.
 * <Piece> = one scissor-cut fragment: a soft contact shadow, the paper margin left around the engraving
 * (cut with a slightly irregular scissor edge), the engraved content, hand-tint / airbrush overlays, and
 * the paper's own fibre + age mottling multiplied over all of it. The texture lives in the piece's local
 * space, so it travels and rotates with the piece (no shower-door).
 */

export interface Stock {
  /** Paper colour of the margin / unprinted paper. */
  paper: string;
  /** Mottling strength 0..1 (age, foxing). */
  age?: number;
  /** Fibre grain strength 0..1. */
  grain?: number;
  /** Mottle scale (lower = bigger blotches). */
  mottle?: number;
}

/** A few named paper stocks (the "sources" the pieces were cut from). */
export const STOCK = {
  /** banknote portrait paper: cool cream with a green cast */
  note: {paper: '#E6E3CC', age: 0.35, grain: 0.5, mottle: 0.011},
  /** Nole's portrait: a warmer, pinker certificate stock */
  cert: {paper: '#EBDCC3', age: 0.45, grain: 0.5, mottle: 0.009},
  /** mail-order catalogue newsprint: yellowed, fibrous */
  news: {paper: '#DCCCA6', age: 0.6, grain: 0.8, mottle: 0.014},
  /** glove / hosiery catalogue: whiter coated stock */
  coated: {paper: '#EEE8DA', age: 0.25, grain: 0.35, mottle: 0.01},
  /** grey sugar-paper (the rocket plate) */
  sugar: {paper: '#CFC7B4', age: 0.5, grain: 0.9, mottle: 0.012},
  /** the room plate: heavy grey-cream etching paper */
  plate: {paper: '#D9D0BA', age: 0.55, grain: 0.6, mottle: 0.006},
} satisfies Record<string, Stock>;

export interface Sil {
  d: string;
  transform?: string;
}

export interface PieceProps {
  id: string;
  /** Silhouette shapes (local coords) — the margin is these, dilated. */
  sil: Sil[];
  stock: Stock;
  /** Paper margin left by the scissors, local units. */
  margin?: number;
  /** Contact shadow: [dx, dy, blur, opacity] in local units. */
  shadow?: [number, number, number, number] | false;
  transform?: string;
  /** Engraved content (drawn in local coords). */
  children?: React.ReactNode;
  /** Drawn above the content, still inside the paper texture (tints, airbrush). */
  over?: React.ReactNode;
  /** Scissor-edge roughness multiplier. */
  rough?: number;
  /** Edge line: the thin darker rim of a cut paper edge. */
  edge?: string | false;
  /** Bounding box hint for filters [x, y, w, h]. */
  box: [number, number, number, number];
  opacity?: number;
  /** Draw the margin (false for pieces printed edge-to-edge). */
  showMargin?: boolean;
}

const fid = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '_');

export const Piece: React.FC<PieceProps> = ({id, sil, stock, margin = 7, shadow = [5, 7, 5, 0.45], transform, children, over, rough = 1, edge = '#00000055', box, opacity, showMargin = true}) => {
  const u = fid(id);
  const seed = strHash(id) % 997;
  const [bx, by, bw, bh] = box;
  const pad = margin * 3 + 40;
  const region = {x: bx - pad, y: by - pad, width: bw + pad * 2, height: bh + pad * 2};
  const marginShape = (fill: string, stroke = fill, key = '') =>
    sil.map((s, i) => <path key={key + i} d={s.d} transform={s.transform} fill={fill} stroke={stroke} strokeWidth={margin * 2} strokeLinejoin="round" />);
  const age = stock.age ?? 0.4;
  const grain = stock.grain ?? 0.5;
  // multiply factors: fibres (fine) + mottling (large, warm-brown)
  const gA = 0.16 * grain;
  const mA = 0.2 * age;
  return (
    <g transform={transform} opacity={opacity}>
      <defs>
        <filter id={`cut-${u}`} filterUnits="userSpaceOnUse" {...region}>
          <feTurbulence type="fractalNoise" baseFrequency={0.028} numOctaves={2} seed={seed} result="lo" />
          <feDisplacementMap in="SourceGraphic" in2="lo" scale={margin * 1.1 * rough} xChannelSelector="R" yChannelSelector="G" result="d1" />
          <feTurbulence type="turbulence" baseFrequency={0.35} numOctaves={1} seed={seed + 5} result="hi" />
          <feDisplacementMap in="d1" in2="hi" scale={1.6 * rough} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id={`tex-${u}`} filterUnits="userSpaceOnUse" {...region} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.55 0.85" numOctaves={2} seed={seed + 1} result="fib" />
          <feColorMatrix in="fib" type="matrix" values={`0 0 0 0 ${1 - gA * 0.5}  0 0 0 0 ${1 - gA * 0.5}  0 0 0 0 ${1 - gA * 0.5}  0 0 0 0 1`} result="fibBase" />
          <feColorMatrix in="fib" type="matrix" values={`${gA} 0 0 0 ${1 - gA}  ${gA} 0 0 0 ${1 - gA}  ${gA} 0 0 0 ${1 - gA}  0 0 0 0 1`} result="fibM" />
          <feTurbulence type="fractalNoise" baseFrequency={stock.mottle ?? 0.01} numOctaves={4} seed={seed + 2} result="mot" />
          <feColorMatrix in="mot" type="matrix" values={`${mA * 1.3} 0 0 0 ${1 - mA * 0.9}  ${mA * 1.5} 0 0 0 ${1 - mA * 1.15}  ${mA * 1.9} 0 0 0 ${1 - mA * 1.6}  0 0 0 0 1`} result="motM" />
          <feComposite in="fibM" in2="motM" operator="arithmetic" k1={1} result="noise" />
          <feComposite in="SourceGraphic" in2="noise" operator="arithmetic" k1={1} />
        </filter>
        {shadow && (
          <filter id={`sh-${u}`} filterUnits="userSpaceOnUse" {...region}>
            <feGaussianBlur stdDeviation={shadow[2]} />
          </filter>
        )}
      </defs>
      {shadow && showMargin && (
        <g transform={`translate(${shadow[0]} ${shadow[1]})`} filter={`url(#sh-${u})`} opacity={shadow[3]}>
          <g filter={`url(#cut-${u})`}>{marginShape('#07060A')}</g>
        </g>
      )}
      <g filter={`url(#tex-${u})`}>
        {showMargin && (
          <g filter={`url(#cut-${u})`}>
            {edge && marginShape(edge, edge, 'e')}
            <g transform="translate(-0.8 -0.8)">{marginShape(stock.paper)}</g>
          </g>
        )}
        {children}
        {over}
      </g>
    </g>
  );
};

/** Hand-tint wash: transparent watercolour (multiply) with a soft, slightly bleeding edge. */
export const Wash: React.FC<{d: string; color: string; opacity?: number; blur?: number; transform?: string; blend?: 'multiply' | 'screen' | 'color' | 'overlay' | 'soft-light' | 'normal'; id: string}> = ({
  d,
  color,
  opacity = 0.55,
  blur = 3,
  transform,
  blend = 'multiply',
  id,
}) => {
  const u = fid('w' + id);
  const seed = strHash(id) % 991;
  return (
    <g style={{mixBlendMode: blend}} opacity={opacity}>
      <defs>
        <filter id={u} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={0.04} numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={blur * 2.2} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation={blur} />
        </filter>
      </defs>
      <path d={d} transform={transform} fill={color} filter={`url(#${u})`} />
    </g>
  );
};
