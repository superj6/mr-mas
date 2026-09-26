// MR. MAS - style-range Prototype 1: the table's PROPS as cel layers, and the TELLS that light as objects.
// Standing objects are billboards in their own cm units (a GPU "chip" stack, Kram's thermos and ladle, Nesnej's till,
// the dealer's shoe); flat objects (the cards, Mario's napkin) are drawn in the felt's own plane through an affine map
// from three projected corners. Generic by rule: no casino, card or chip marks; the cards carry plain pips.
import React from 'react';
import {curve, ell, ink, Pt} from '../../../../shared/anime/ink';
import {Cam, project, TABLE} from './world';
import {KEY} from './tungsten';

/** SVG matrix for drawing in the felt's plane: local (u, v) cm along +X and toward the camera (-Z) from (x0, z0), so
 *  anything written on the felt reads upright from our side of the table */
export const feltMatrix = (c: Cam, x0: number, z0: number, y = TABLE.TOP) => {
  const o = project(c, x0, y, z0), a = project(c, x0 + 1, y, z0), b = project(c, x0, y, z0 - 1);
  return `matrix(${a.x - o.x} ${a.y - o.y} ${b.x - o.x} ${b.y - o.y} ${o.x} ${o.y})`;
};

// ------------------------------------------------------------------ a GPU "chip" stack (billboard, cm units, base at 0)
export const GpuStack: React.FC<{n: number; w?: number; seed?: number; k: number}> = ({n, w = 4.6, seed = 1, k}) => {
  const out: React.ReactNode[] = [];
  const t = 0.95;
  for (let i = 0; i < n; i++) {
    const jx = (((seed * 7 + i * 13) % 5) - 2) * 0.12;
    const y = -(i + 1) * t;
    out.push(
      <g key={i} transform={`translate(${jx} 0)`}>
        <rect x={-w / 2} y={y} width={w} height={t} fill={i === n - 1 ? '#2A2C33' : '#1C1D23'} />
        {/* the gold edge connector: where a poker chip would carry its colour band */}
        <rect x={-w / 2 + 0.5} y={y + t * 0.52} width={w * 0.5} height={t * 0.28} fill="#B9842F" />
        <rect x={-w / 2} y={y} width={w} height={0.14} fill="#8A7A64" />
        <rect x={w / 2 - 0.3} y={y} width={0.3} height={t} fill="#0A0A0E" />
      </g>,
    );
  }
  const top = -(n * t);
  return (
    <g>
      <path d={ell(0.4, 0.1, w * 0.72, 0.9)} fill="#000" opacity={0.55} />
      {out}
      {/* the top board's face: the fan's grille, lit by the lamp */}
      <path d={`M${-w / 2} ${top}L${w / 2} ${top}L${w / 2 - 0.5} ${top - 1.1}L${-w / 2 + 0.5} ${top - 1.1}Z`} fill="#6E6A66" />
      <path d={ell(-0.4, top - 0.55, 1.2, 0.36)} fill="#2A2A30" stroke="#A8A098" strokeWidth={0.12} />
      <path d={ink([[-w / 2 + 0.4, top - 1.05], [w / 2 - 0.6, top - 1.05]], 0.22, {a: 0.2, b: 0.2})} fill={KEY.hot} opacity={0.7} />
      <rect x={-w / 2} y={top} width={w} height={n * t} fill="none" stroke="#050507" strokeWidth={0.16 * k} />
    </g>
  );
};

// ------------------------------------------------------------------ a card lying on the felt (6.3 x 8.8 cm)
export const Card: React.FC<{up: boolean; pip?: 0 | 1 | 2 | 3; rot?: number}> = ({up, pip = 0, rot = 0}) => {
  const red = pip % 2 === 0;
  const P: Record<number, string> = {
    0: 'M3.15 2.9L4.2 4.4L3.15 5.9L2.1 4.4Z',
    1: 'M3.15 2.8C3.9 3.7 4.5 4.2 4.1 5C3.7 5.6 3.3 5.3 3.15 5C3 5.3 2.6 5.6 2.2 5C1.8 4.2 2.4 3.7 3.15 2.8ZM2.9 5.2L3.4 5.2L3.6 6.1L2.7 6.1Z',
    2: 'M3.15 3.2C3.5 2.5 4.7 2.7 4.5 3.7C4.4 4.4 3.6 5 3.15 5.8C2.7 5 1.9 4.4 1.8 3.7C1.6 2.7 2.8 2.5 3.15 3.2Z',
    3: 'M3.15 2.6A0.8 0.8 0 1 1 3.15 2.61ZM2.2 4.2A0.8 0.8 0 1 1 2.2 4.21ZM4.1 4.2A0.8 0.8 0 1 1 4.1 4.21Z',
  };
  return (
    <g transform={`rotate(${rot} 3.15 4.4)`}>
      <rect x={0.25} y={0.35} width={6.3} height={8.8} rx={0.5} fill="#000" opacity={0.5} />
      <rect x={0} y={0} width={6.3} height={8.8} rx={0.5} fill={up ? '#E9DDC6' : '#1D2A4E'} stroke="#0A0A0C" strokeWidth={0.12} />
      {up ? (
        <path d={P[pip]} fill={red ? '#A8263A' : '#141418'} transform="translate(0 0.2)" />
      ) : (
        <>
          <rect x={0.55} y={0.55} width={5.2} height={7.7} rx={0.3} fill="none" stroke="#C9B98E" strokeWidth={0.18} />
          <path d="M0.9 0.9L5.4 8.1M5.4 0.9L0.9 8.1" stroke="#34457A" strokeWidth={0.22} />
        </>
      )}
      {/* the lamp's sheen across the near half */}
      <rect x={0} y={4.6} width={6.3} height={4.2} rx={0.5} fill={KEY.hot} opacity={up ? 0.12 : 0.07} />
    </g>
  );
};

// ------------------------------------------------------------------ KRAM: the soup thermos and its ladle (the tell)
/** tip 0 level, 1-2 tipping; drop 0..1 the drop's fall (undefined = none yet, >= 1 landed); lit = the lamp catches it */
export const Thermos: React.FC<{tip: 0 | 1 | 2; drop?: number; lit: number; k: number}> = ({tip, drop, lit, k}) => {
  const rot = [0, 10, 18][tip];
  const pivot: Pt = [3.4, -22.6];
  // the ladle's lip (where the drop leaves), rotated with the ladle
  const lip: Pt = [12.6, -21.4];
  const ra = (rot * Math.PI) / 180;
  const lx = pivot[0] + (lip[0] - pivot[0]) * Math.cos(ra) - (lip[1] - pivot[1]) * Math.sin(ra);
  const ly = pivot[1] + (lip[0] - pivot[0]) * Math.sin(ra) + (lip[1] - pivot[1]) * Math.cos(ra);
  return (
    <g>
      <path d={ell(1.6, 0.3, 7.6, 1.6)} fill="#000" opacity={0.6} />
      {/* the steel body: one hard lit stripe down the side toward the lamp, the rest in the dark */}
      <rect x={-4.2} y={-22} width={8.4} height={22} rx={0.9} fill="#34343A" />
      <rect x={-1.4} y={-22} width={2.6} height={22} fill="#B9B4AC" />
      <rect x={-0.7} y={-22} width={0.7} height={22} fill={KEY.hot} opacity={0.9} />
      <rect x={2.6} y={-22} width={1.6} height={22} fill="#141418" />
      <rect x={-4.4} y={-23} width={8.8} height={1.8} rx={0.45} fill="#6A6860" />
      <rect x={-4.2} y={-22} width={8.4} height={22} rx={0.9} fill="none" stroke="#050507" strokeWidth={0.3 * k} />
      {/* the soup ladle hangs on the rim: handle back into the soup, the bowl out over the felt; it tips on the tell */}
      <g transform={`rotate(${rot} ${pivot[0]} ${pivot[1]})`}>
        <path d={ink([[3.4, -22.6], [-0.4, -30], [-3.6, -36.5]], 1.2, {a: 0.1, b: 0.1, tip: 0.6})} fill="#CFC8BC" />
        <path d={ink([[3.4, -22.6], [7.6, -23.4]], 0.9, {a: 0.1, b: 0.1, tip: 0.8})} fill="#CFC8BC" />
        <path d={curve([[7, -24], [13, -24], [12.4, -21], [10, -19.6], [7.6, -21]])} fill="#8E887E" stroke="#050507" strokeWidth={0.26 * k} />
        <path d={curve([[7.6, -23.6], [12.4, -23.6], [11.4, -22.6], [8.4, -22.6]])} fill="#C8783A" />
        <path d={ink([[7.8, -23.8], [12.6, -23.8]], 0.5, {a: 0.2, b: 0.2})} fill={KEY.hot} opacity={0.5 + 0.5 * lit} />
      </g>
      {drop !== undefined && drop < 1 && (() => {
        const y = ly + (0 - ly) * drop * drop;
        return (
          <g>
            <path d={curve([[lx, y - 3], [lx + 1.2, y - 0.3], [lx, y + 1], [lx - 1.2, y - 0.3]])} fill="#E8963C" stroke="#3A1A08" strokeWidth={0.18} />
            <path d={ell(lx - 0.35, y - 0.6, 0.35, 0.45)} fill={KEY.hot} opacity={0.9} />
          </g>
        );
      })()}
      {drop !== undefined && drop >= 1 && (
        <g>
          <path d={ell(lx, 0, 1.8, 0.5)} fill="#6A3A14" opacity={0.95} />
          <path d={ell(lx - 0.4, -0.1, 0.7, 0.18)} fill="#E8963C" opacity={0.7} />
        </g>
      )}
    </g>
  );
};

// ------------------------------------------------------------------ NESNEJ: the till (the tell: one key sinks)
export const Register: React.FC<{sunk: boolean; lit: number; k: number}> = ({sunk, lit, k}) => (
  <g transform="scale(1.45)">
    <path d={ell(0.5, 0.3, 10, 1.6)} fill="#000" opacity={0.6} />
    {/* body: dark enamel with brass trim, the key bank sloping toward him */}
    <path d="M-9 0L9 0L8 -7L-8 -7Z" fill="#1E1A18" />
    <path d="M-8 -7L8 -7L6.6 -12L-6.6 -12Z" fill="#3A2E24" />
    <rect x={-4.4} y={-17} width={8.8} height={5} rx={0.4} fill="#16120F" />
    <rect x={-3.8} y={-16.3} width={7.6} height={3.2} fill="#233A2A" />
    {/* the window's tab pops up when the key goes down */}
    {sunk && <rect x={-1.6} y={-19.6} width={3.2} height={3.4} rx={0.3} fill="#E8DCC0" stroke="#0A0806" strokeWidth={0.14} />}
    <path d={ink([[-3.4, -15.4], [3.2, -15.4]], 0.35, {a: 0.2, b: 0.2})} fill="#6FD37A" opacity={0.5} />
    <path d={ink([[-9, -0.2], [9, -0.2]], 0.5, {a: 0.05, b: 0.05})} fill="#B9842F" />
    <path d={ink([[-8, -7], [8, -7]], 0.45, {a: 0.05, b: 0.05})} fill="#E2B060" />
    {Array.from({length: 10}, (_, i) => {
      const row = Math.floor(i / 5), col = i % 5;
      const big = i === 4;
      const down = big && sunk;
      const x = -5.2 + col * 2.6, y = -10.9 + row * 2.1 + (down ? 1.1 : 0);
      return (
        <g key={i}>
          <path d={ell(x, y, big ? 1.15 : 0.8, big ? 0.7 : 0.48)} fill={down ? '#5A4830' : '#D8CCB0'} stroke="#0A0806" strokeWidth={0.14 * k} />
          {!down && <path d={ell(x - 0.2, y - 0.18, 0.4, 0.16)} fill="#FFF4DC" opacity={0.8} />}
          {down && <path d={ell(x, y - 0.3, 1.0, 0.3)} fill={KEY.hot} opacity={0.35 + 0.4 * lit} />}
        </g>
      );
    })}
    <path d="M-9 0L9 0L8 -7L6.6 -12L6.2 -17L-6.2 -17L-6.6 -12L-8 -7Z" fill="none" stroke="#050404" strokeWidth={0.26 * k} />
  </g>
);

// ------------------------------------------------------------------ MARIO: his napkin (the tell: its near corner lifts
// off the felt and the underside shows a line of his handwriting, `Addendum:`). A paper napkin, soft-edged, drawn in
// the felt's plane from projected points each frame; the corner folds up about a diagonal crease.
export const Napkin: React.FC<{cam: Cam; x0: number; z0: number; lift: number; rot?: number}> = ({cam, x0, z0, lift, rot = -14}) => {
  const Y = TABLE.TOP - 0.15;
  const S = 16;
  const ra = (rot * Math.PI) / 180;
  // napkin-local (u right, v toward us) -> world
  const W3 = (u: number, v: number, h = 0) => {
    const x = x0 + u * Math.cos(ra) - v * Math.sin(ra), z = z0 - (u * Math.sin(ra) + v * Math.cos(ra));
    return project(cam, x, Y - h, z);
  };
  const q = (pts: Array<{x: number; y: number}>) => 'M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L') + 'Z';
  // the crease runs corner to corner-ish; the near-right corner is the flap
  const c0 = {u: S * 0.42, v: S}, c1 = {u: S, v: S * 0.4};
  const tip = {u: S, v: S};
  const th = (lift * Math.PI) / 180;
  // rotate the tip about the crease line (c0 -> c1)
  const ax = c1.u - c0.u, av = c1.v - c0.v, al = Math.hypot(ax, av);
  const nx = ax / al, nv = av / al;
  const rx = tip.u - c0.u, rv = tip.v - c0.v;
  const along = rx * nx + rv * nv;
  const perpU = rx - along * nx, perpV = rv - along * nv;
  const pl = Math.hypot(perpU, perpV);
  const tipU = c0.u + along * nx + perpU * Math.cos(th), tipV = c0.v + along * nv + perpV * Math.cos(th), tipH = pl * Math.sin(th);
  const A = W3(0, 0), B = W3(S, 0), C1 = W3(c1.u, c1.v), C0 = W3(c0.u, c0.v), D = W3(0, S);
  const Tp = W3(tipU, tipV, tipH);
  const Tflat = W3(tip.u, tip.v);
  // the flap's underside as an affine frame (u along the crease from c0, v toward the tip)
  const inner = `matrix(${(C1.x - C0.x) / al} ${(C1.y - C0.y) / al} ${(Tp.x - (C0.x + C1.x) / 2) / pl} ${(Tp.y - (C0.y + C1.y) / 2) / pl} ${C0.x} ${C0.y})`;
  const up = lift > 8;
  return (
    <g>
      <path d={q([A, B, C1, Tflat, C0, D])} fill="#000" opacity={0.3} transform="translate(1.5 2.5)" />
      <path d={q(up ? [A, B, C1, C0, D] : [A, B, C1, Tflat, C0, D])} fill="#D9D2C2" stroke="#8C8474" strokeWidth={0.6} strokeLinejoin="round" />
      {/* the paper's own soft fold lines */}
      <path d={q([W3(S * 0.5, 0), W3(S * 0.52, S * 0.02), W3(S * 0.5, S * 0.7), W3(S * 0.48, S * 0.68)])} fill="#B8B0A0" opacity={0.5} />
      {up && (
        <>
          <path d={q([C0, C1, Tp])} fill="#F2ECDF" stroke="#8C8474" strokeWidth={0.6} strokeLinejoin="round" />
          <g transform={inner}>
            <text x={0.8} y={2.9} fontFamily='"Playfair Display", serif' fontStyle="italic" fontWeight={400} fontSize={2.1} fill="#1F3A93" opacity={0.92}>Addendum:</text>
            <path d={ink([[1, 4.3], [5.6, 4.2], [8.8, 4.35]], 0.13, {a: 0.2, b: 0.4})} fill="#1F3A93" opacity={0.7} />
          </g>
          <path d={q([C0, C1, Tp])} fill={KEY.hot} opacity={0.1} />
        </>
      )}
    </g>
  );
};

// ------------------------------------------------------------------ a high-back card-room chair (billboard, cm units,
// origin at the seat's head centre): dark oxblood leather, a brass nail line, its top edge catching the pool
export const Chair: React.FC<{uid: string; w: number; top: number; bottom: number; k: number}> = ({uid, w, top, bottom, k}) => {
  const hw = w / 2;
  const back: Pt[] = [[-hw, bottom, 1], [-hw, top + 7], [-hw + 2, top + 1.6], [-hw + 8, top], [hw - 8, top], [hw - 2, top + 1.6], [hw, top + 7], [hw, bottom, 1]];
  const d = curve(back);
  const nails = Array.from({length: 17}, (_, i) => {
    const t = i / 16;
    const x = -hw + 2.4 + t * (w - 4.8);
    const y = top + 2.6 + (Math.abs(x) > hw - 8 ? (Math.abs(x) - (hw - 8)) * 0.55 : 0);
    return <circle key={i} cx={x} cy={y} r={0.42} fill="#B9842F" />;
  });
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-g`} x1="0" y1={top} x2="0" y2={bottom} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3A1C1C" />
          <stop offset="0.35" stopColor="#1E0E10" />
          <stop offset="1" stopColor="#0A0608" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${uid}-g)`} />
      {/* the tufting: two soft rows of buttons in shade */}
      {[0, 1].map((r) => Array.from({length: 5}, (_, i) => <circle key={`${r}-${i}`} cx={-hw + 8 + i * ((w - 16) / 4) + (r % 2) * 3} cy={top + 9 + r * 7} r={0.55} fill="#07040A" opacity={0.8} />))}
      {nails}
      <path d={ink([[-hw + 3, top + 0.6], [0, top - 0.1], [hw - 3, top + 0.6]], 0.7, {a: 0.3, b: 0.3})} fill={KEY.warm} opacity={0.75} />
      <path d={ink([[hw - 0.4, top + 6], [hw - 0.4, top + 22]], 0.5, {a: 0.2, b: 0.6})} fill={KEY.rimCool} opacity={0.45} />
      <path d={d} fill="none" stroke="#050304" strokeWidth={0.35 * k} />
    </g>
  );
};

// ------------------------------------------------------------------ the dealer's shoe (billboard)
export const Shoe: React.FC<{k: number}> = ({k}) => (
  <g>
    <path d={ell(0, 0.3, 10, 1.4)} fill="#000" opacity={0.6} />
    <path d="M-9 0L9 0L9 -6L-6 -9L-9 -8Z" fill="#141A2C" stroke="#050507" strokeWidth={0.24 * k} />
    <path d="M-6 -9L9 -6L9 -5.2L-6 -8.2Z" fill="#2E3A5C" />
    <path d="M-8.4 -7.2L-3 -8.2L-3 -1.4L-8.4 -1Z" fill="#E4D8C0" />
    <path d={ink([[-8, -7.6], [-3.4, -8.4]], 0.3, {a: 0.2, b: 0.2})} fill={KEY.hot} opacity={0.8} />
  </g>
);
